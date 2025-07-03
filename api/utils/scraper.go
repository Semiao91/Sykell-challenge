package utils

import (
	"net/http"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/gocolly/colly"
)

type ScrapeResult struct {
	Title         string
	HTMLVersion   string
	InternalLinks int
	ExternalLinks int
	BrokenLinks   []BrokenLink
	HeadingCounts map[string]int
	HasLoginForm  bool
}

type BrokenLink struct {
	URL        string
	StatusCode int
}

func ScrapeUrl(url string) (*ScrapeResult, error) {
	result := &ScrapeResult{
		HeadingCounts: make(map[string]int),
	}

	c := colly.NewCollector(
		colly.MaxDepth(1),
	)

	visitedLinks := make(map[string]bool)

	c.OnHTML("title", func(e *colly.HTMLElement) {
		result.Title = e.Text
	})

	c.OnHTML("html", func(e *colly.HTMLElement) {
		result.HTMLVersion = detectHTMLVersion(e.DOM)
	})

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Request.AbsoluteURL(e.Attr("href"))
		if link == "" || visitedLinks[link] {
			return
		}
		visitedLinks[link] = true

		if strings.Contains(link, e.Request.URL.Hostname()) {
			result.InternalLinks++
		} else {
			result.ExternalLinks++
		}

		go func(link string) {
			resp, err := http.Head(link)
			if err != nil || resp.StatusCode >= 400 {
				status := 0
				if resp != nil {
					status = resp.StatusCode
				}
				result.BrokenLinks = append(result.BrokenLinks, BrokenLink{URL: link, StatusCode: status})
			}
		}(link)
	})

	c.OnHTML("form", func(e *colly.HTMLElement) {
		if e.DOM.Find("input[type='password']").Length() > 0 {
			result.HasLoginForm = true
		}
	})

	// Count headings
	for _, tag := range []string{"h1", "h2", "h3", "h4", "h5", "h6"} {
		t := tag
		c.OnHTML(t, func(e *colly.HTMLElement) {
			result.HeadingCounts[strings.ToUpper(t)]++
		})
	}

	err := c.Visit(url)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func detectHTMLVersion(selection *goquery.Selection) string {
	docType := selection.Nodes[0].FirstChild
	if docType != nil && strings.Contains(strings.ToLower(docType.Data), "html") {
		return "HTML5"
	}
	return "Unknown"
}
