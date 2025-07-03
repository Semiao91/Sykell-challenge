package utils

import "gin/models"

func MapBrokenLinks(links []BrokenLink) []models.BrokenLinkDetail {
	var result []models.BrokenLinkDetail
	for _, l := range links {
		result = append(result, models.BrokenLinkDetail{
			URL:        l.URL,
			StatusCode: l.StatusCode,
		})
	}
	return result
}
