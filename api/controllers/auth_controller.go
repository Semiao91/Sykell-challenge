package controllers

import (
	"log"
	"net/http"
	"os"
	"time"

	"gin/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

type AuthController struct {
    DB *gorm.DB
}

type LoginRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
}

type AuthResponse struct {
    Token string       `json:"token"`
    User  models.User  `json:"user"`
}

// Register creates a new user
func (ac *AuthController) Register(c *gin.Context) {
    var req LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var existingUser models.User
    if err := ac.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
        return
    }

    user := models.User{
        Email: req.Email,
    }
    
    if err := user.HashPassword(req.Password); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    if err := ac.DB.Create(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
        return
    }

    token, err := generateToken(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusCreated, AuthResponse{
        Token: token,
        User:  user,
    })
}

// Login authenticates a user
func (ac *AuthController) Login(c *gin.Context) {
    var req LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user models.User
    if err := ac.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    if err := user.CheckPassword(req.Password); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    token, err := generateToken(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusOK, AuthResponse{
        Token: token,
        User:  user,
    })
}

// generateToken creates a JWT token
func generateToken(userID uint) (string, error) {
    secret := os.Getenv("JWT_SECRET")
    if secret == "" {
        log.Println("JWT_SECRET is not set in environment variables")
		return "", http.ErrNoCookie
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": userID,
        "exp":     time.Now().Add(time.Hour * 24).Unix(),
    })

    return token.SignedString([]byte(secret))
}