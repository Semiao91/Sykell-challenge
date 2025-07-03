package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Status string

const (
	Queued   Status = "queued"
	Running  Status = "running"
	Complete Status = "complete"
	Error    Status = "error"
)
type HeadingCounts map[string]int

func (h HeadingCounts) Value() (driver.Value, error) {
	return json.Marshal(h)
}

func (h *HeadingCounts) Scan(value interface{}) error {
	return json.Unmarshal(value.([]byte), &h)
}

type BrokenLinkDetail struct {
	ID         uint   `gorm:"primaryKey"`
	UrlID      uint   `gorm:"index"`
	URL        string `gorm:"type:varchar(255);not null" json:"url"`
	StatusCode int    `gorm:"not null" json:"status_code"`
}

type Url struct {
    gorm.Model
	
	// One-to-many relationship with User
	UserID  uint   `gorm:"not null" json:"user_id"`
	User	 User   `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user"`

    Url      string `gorm:"type:varchar(255);uniqueIndex;not null" json:"url"`
	Title   string `gorm:"type:varchar(255);not null" json:"title"`
	Status  Status  `gorm:"type:varchar(255);not null" json:"status"`
	InternalLinks int16 `gorm:"not null" json:"internal_links"`
	ExternalLinks int16 `gorm:"not null" json:"external_links"`
	BrokenLinks int16 `gorm:"not null" json:"broken_links"`
	HtmlVersion string `gorm:"type:varchar(255);not null" json:"html_version"`
	HasLoginForm bool `gorm:"not null" json:"has_login_form"`
	HeadingCounts HeadingCounts `gorm:"type:json;not null" json:"heading_counts"`
	AnalyzedAt        time.Time          `json:"analyzed_at"`
	BrokenLinkDetails []BrokenLinkDetail `gorm:"foreignKey:UrlID;constraint:OnDelete:CASCADE" json:"broken_link_details"`

	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

