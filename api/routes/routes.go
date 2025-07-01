package routes

import (
	"gin/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
    authController := &controllers.AuthController{DB: db}
    
    // Public routes
    auth := router.Group("/api/auth")
    {
        auth.POST("/register", authController.Register)
        auth.POST("/login", authController.Login)
    }
    
    // Protected routes
    // api := router.Group("/api")
    // api.Use(middleware.AuthRequired())
    // {
    //     // Your protected routes here
    //     api.GET("/urls", authController.Login)
    //     api.POST("/urls", authController.Register)
    // }
}