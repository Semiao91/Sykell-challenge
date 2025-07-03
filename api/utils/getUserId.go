package utils

import (
	"github.com/gin-gonic/gin"
)

func GetUserID(c *gin.Context) uint {
	uid, _ := c.Get("userID")
	return uid.(uint)
}
