package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)


type User struct {
    gorm.Model
    Email    string `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
    Password string `gorm:"not null" json:"-"`

    // One-to-many relationship with Url
    Urls []Url `gorm:"foreignKey:UserID" json:"urls,omitempty"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (u *User) HashPassword(password string) error {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)

    if err != nil {
        return err
    }

    u.Password = string(bytes)
    return nil
}

func (u *User) CheckPassword(password string) error {
    return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}