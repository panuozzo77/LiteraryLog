package main

import (
	"book_archive/database"
	"book_archive/handlers"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	database.InitDB()

	// Create Gin router
	r := gin.Default()

	// Serve static files
	r.Static("/static", "./static")

	// Load HTML templates
	r.LoadHTMLGlob("templates/*")

	// Routes
	r.GET("/", handlers.IndexHandler)

	// API routes for books
	r.GET("/api/books", handlers.GetBooks)
	r.POST("/api/books", handlers.CreateBook)
	r.PUT("/api/books/:id", handlers.UpdateBook)
	r.DELETE("/api/books/:id", handlers.DeleteBook)

	// API routes for config
	r.GET("/api/config", handlers.GetConfig)
	r.PUT("/api/config", handlers.UpdateConfig)

	// Save and commit
	r.POST("/api/save", handlers.SaveAndCommit)

	// Start server
	log.Println("Server starting on :8080")
	r.Run(":8080")
}