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

func (s *ScrapperController) GetUrls(c *gin.Context) {
	userID := utils.GetUserID(c)

	var urls []models.Url
	if err := s.DB.Where("user_id = ?", userID).Preload("BrokenLinkDetails").Find(&urls).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch urls"})
		return
	}

	c.JSON(http.StatusOK, urls)
}

func (s *ScrapperController) CreateUrl(c *gin.Context) {
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
		UserID:          userID,
		Url:             req.Url,
		Title:           result.Title,
		HtmlVersion:     result.HTMLVersion,
		Status:          models.Complete,
		InternalLinks:   int16(result.InternalLinks),
		ExternalLinks:   int16(result.ExternalLinks),
		BrokenLinks:     int16(len(result.BrokenLinks)),
		HasLoginForm:    result.HasLoginForm,
		HeadingCounts:   result.HeadingCounts,
		AnalyzedAt:      time.Now(),
		BrokenLinkDetails: utils.MapBrokenLinks(result.BrokenLinks),
	}

	if err := s.DB.Create(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save analysis"})
		return
	}

	c.JSON(http.StatusCreated, url)
}
