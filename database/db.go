package database

import (
	"log"

	"book_archive/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("books.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate the schema
	err = DB.AutoMigrate(&models.Book{}, &models.Config{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Create default config if not exists
	var config models.Config
	if err := DB.First(&config).Error; err != nil {
		defaultConfig := models.Config{
			ReadmeTitle:    "My Book List",
			VisibleColumns: models.DefaultColumns,
		}
		DB.Create(&defaultConfig)
	}
}