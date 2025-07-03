package utils

import (
	"net/http"
	"strings"
)

func detectHTMLVersionFromRaw(url string) string {
	resp, err := http.Get(url)
	if err != nil {
		return "Unknown"
	}
	defer resp.Body.Close()

	buf := make([]byte, 512)
	n, err := resp.Body.Read(buf)
	if err != nil {
		return "Unknown"
	}
	html := strings.ToLower(string(buf[:n]))

	switch {
	case strings.Contains(html, "<!doctype html>"):
		return "HTML5"
	case strings.Contains(html, `-//w3c//dtd html 4.01`):
		return "HTML 4.01"
	case strings.Contains(html, `-//w3c//dtd xhtml 1.0`):
		return "XHTML 1.0"
	case strings.Contains(html, `-//w3c//dtd html 3.2`):
		return "HTML 3.2"
	default:
		return "Unknown"
	}
}
