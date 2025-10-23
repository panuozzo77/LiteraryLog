package utils

import (
	"book_archive/database"
	"book_archive/models"
	"encoding/json"
	"io/ioutil"
	"log"
)

// ExportBooksToJSON fetches all books from the database and saves them to a JSON file.
func ExportBooksToJSON() error {
	var books []models.Book
	if err := database.DB.Order("created_at DESC").Find(&books).Error; err != nil {
		return err
	}

	jsonData, err := json.MarshalIndent(books, "", "  ")
	if err != nil {
		return err
	}

	err = ioutil.WriteFile("webapp/data/books.json", jsonData, 0644)
	if err != nil {
		return err
	}

	log.Println("Successfully exported books to webapp/data/books.json")
	return nil
}