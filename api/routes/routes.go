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

	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authController.Register)
			auth.POST("/login", authController.Login)
		}

		urls := api.Group("/urls")
		urls.Use(middleware.AuthRequired())
		{
			urls.GET("/", scrapperController.GetUrls)
			urls.POST("/", scrapperController.AnalyzeUrl)
			urls.DELETE("/:id", scrapperController.DeleteUrl)
		}
	}
}
