package config

import (
	"fmt"
	"gin/utils"
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB



func ConnectDatabase() {
	var dbUser, dbPassword, dbName, dbHost, dbPort string
	
	// Local development
	dbUser = utils.GetEnvOrDefault("DB_USER", "myuser")
	dbPassword = utils.GetEnvOrDefault("DB_PASSWORD", "mypassword")
	dbName = utils.GetEnvOrDefault("DB_NAME", "mydb")
	dbHost = utils.GetEnvOrDefault("DB_HOST", "localhost")
	dbPort = utils.GetEnvOrDefault("DB_PORT", "3306")
	log.Println("Connecting to database in local development mode...")
	
	if dbUser == "" || dbPassword == "" || dbName == "" {
		log.Fatal("Missing required database credentials")
	}

	// DSN (Data Source Name) format for MySQL
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", 
		dbUser, dbPassword, dbHost, dbPort, dbName)
	
	log.Printf("Connecting to: %s:***@tcp(%s:%s)/%s", dbUser, dbHost, dbPort, dbName)

	var err error
	// Configure GORM
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info), 
	})
	
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}
	
	if err = sqlDB.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	// Configure connection pool
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Successfully connected to MySQL database with GORM!")
}

func MigrateDatabase() {
	// We'll import models here later
	log.Println("Database migration completed!")
}