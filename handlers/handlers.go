package handlers

import (
	"book_archive/database"
	"book_archive/models"
	"book_archive/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// IndexHandler serves the main page
func IndexHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", nil)
}

// GetBooks returns all books
func GetBooks(c *gin.Context) {
	var books []models.Book
	database.DB.Order("created_at DESC").Find(&books)
	c.JSON(http.StatusOK, books)
}

// GetBook returns a single book by ID
func GetBook(c *gin.Context) {
	id := c.Param("id")
	var book models.Book
	if err := database.DB.First(&book, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	c.JSON(http.StatusOK, book)
}

// CreateBook creates a new book
func CreateBook(c *gin.Context) {
	var book models.Book
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&book)
	c.JSON(http.StatusCreated, book)
}

// UpdateBook updates an existing book
func UpdateBook(c *gin.Context) {
	id := c.Param("id")
	var book models.Book
	if err := database.DB.First(&book, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&book)
	c.JSON(http.StatusOK, book)
}

// DeleteBook deletes a book
func DeleteBook(c *gin.Context) {
	id := c.Param("id")
	var book models.Book
	if err := database.DB.First(&book, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	database.DB.Delete(&book)
	c.JSON(http.StatusOK, gin.H{"message": "Book deleted"})
}

// GetConfig returns the README config
func GetConfig(c *gin.Context) {
	var config models.Config
	database.DB.First(&config)
	c.JSON(http.StatusOK, config)
}

// UpdateConfig updates the README config
func UpdateConfig(c *gin.Context) {
	var config models.Config
	if err := database.DB.First(&config).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Config not found"})
		return
	}
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&config)
	c.JSON(http.StatusOK, config)
}

// SaveAndCommit saves changes and commits to git
func SaveAndCommit(c *gin.Context) {
	// Generate README
	if err := utils.GenerateReadme(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to generate README: %v", err)})
		return
	}

	// Git operations
	if err := utils.GitCommitAndPush(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Git operation failed: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Saved and committed successfully"})
}