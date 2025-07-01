package main

import (
	"gin/config"

	"github.com/gin-gonic/gin"
)



func main() {

	router := gin.Default()
	config.ConnectDatabase()
	sqlDB, _ := config.DB.DB()
	defer sqlDB.Close()	

	config.MigrateDatabase()
	router.Run(":8080")
}