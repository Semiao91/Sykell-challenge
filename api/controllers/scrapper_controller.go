package controllers

import (
	"gin/models"
	"gin/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ScrapperController struct {
	DB *gorm.DB
}

// GetUrls retrieves all URLs for the authenticated user
func (s *ScrapperController) GetUrls(c *gin.Context) {
	userID := utils.GetUserID(c)

	var urls []models.Url
	if err := s.DB.Where("user_id = ?", userID).Preload("BrokenLinkDetails").Find(&urls).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch urls"})
		return
	}

	c.JSON(http.StatusOK, urls)
}

// AnalyzeUrl scrapes the provided URL and saves the analysis result
func (s *ScrapperController) AnalyzeUrl(c *gin.Context) {
	type RequestBody struct {
		Url string `json:"url" binding:"required,url"`
	}

	var req RequestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL"})
		return
	}

	userID := utils.GetUserID(c)

	// Scrape the URL
	result, err := utils.ScrapeUrl(req.Url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scrape URL"})
		return
	}

	url := models.Url{
		UserID:            userID,
		Url:               req.Url,
		Title:             result.Title,
		HtmlVersion:       result.HTMLVersion,
		Status:            models.Complete,
		InternalLinks:     int16(result.InternalLinks),
		ExternalLinks:     int16(result.ExternalLinks),
		BrokenLinks:       int16(len(result.BrokenLinks)),
		HasLoginForm:      result.HasLoginForm,
		HeadingCounts:     result.HeadingCounts,
		AnalyzedAt:        time.Now(),
		BrokenLinkDetails: utils.MapBrokenLinks(result.BrokenLinks),
	}

	if err := s.DB.Create(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save analysis"})
		return
	}

	c.JSON(http.StatusCreated, url)
}

// DeleteUrl deletes a URL by its ID for the authenticated user
func (s *ScrapperController) DeleteUrl(c *gin.Context) {
	urlID := c.Param("id")
	userID := utils.GetUserID(c)

	var url models.Url
	if err := s.DB.Where("id = ? AND user_id = ?", urlID, userID).First(&url).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}

	if err := s.DB.Delete(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete URL"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "URL deleted successfully"})
}
