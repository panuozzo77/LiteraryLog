package models

import (
	"time"
)

type Config struct {
	ID             uint     `json:"id" gorm:"primaryKey"`
	ReadmeTitle    string   `json:"readme_title" gorm:"default:'My Book List'"`
	VisibleColumns []string `json:"visible_columns" gorm:"serializer:json"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

// Default visible columns
var DefaultColumns = []string{"Title", "Author", "Status", "StartDate", "EndDate", "Rating", "Genres", "Pages"}