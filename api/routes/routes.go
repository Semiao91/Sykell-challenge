package routes

import (
	"gin/controllers"
	"gin/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
    authController := &controllers.AuthController{DB: db}
    scrapperController := &controllers.ScrapperController{DB: db}
    
    // Public routes
    auth := router.Group("/api/auth")
    {
        auth.POST("/register", authController.Register)
        auth.POST("/login", authController.Login)
    }
    
    // Protected routes
    scrapper := router.Group("/api/scrapper")
    scrapper.Use(middleware.AuthRequired())
    {
        scrapper.GET("/urls", scrapperController.GetUrls)
        scrapper.POST("/urls", scrapperController.CreateUrl)
    }
}