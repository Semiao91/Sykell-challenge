package main

import (
	"database/sql"
	"gin/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

var db *sql.DB


func main() {

	router := gin.Default()
	config.ConnectDatabase()
	sqlDB, _ := config.DB.DB()
	defer sqlDB.Close()

	router.GET("/test-db", func(c *gin.Context) {
		var result string
		err := db.QueryRow("SELECT 'Hello from MySQL!' as message").Scan(&result)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Database query failed",
				"details": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": result,
			"timestamp": "NOW()",
		})
	})

	router.Run(":8080")
}