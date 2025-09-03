package models

import (
	"time"

	"gorm.io/gorm"
)

type Book struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Title     string         `json:"title" gorm:"not null"`
	Author    string         `json:"author" gorm:"not null"`
	Status    string         `json:"status" gorm:"not null"` // Not Letto, Leggendo, Finito, Abbandonato
	StartDate *time.Time     `json:"start_date"`
	Review    string         `json:"review"`
	Rating    int            `json:"rating" gorm:"check:rating >= 0 AND rating <= 10"`
	Reread    bool           `json:"reread"`
	Genres    string         `json:"genres"` // comma-separated
	Pages     int            `json:"pages"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// Status constants
const (
	StatusNotRead    = "Non Letto"
	StatusReading    = "Leggendo"
	StatusFinished   = "Finito"
	StatusAbandoned  = "Abbandonato"
)