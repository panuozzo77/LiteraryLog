package utils

import (
	"book_archive/database"
	"book_archive/models"
	"fmt"
	"os"
	"strings"
)

// GenerateReadme creates the README.md file with the book list
func GenerateReadme() error {
	// Get config
	var config models.Config
	database.DB.First(&config)

	// Get books ordered by created_at DESC
	var books []models.Book
	database.DB.Order("created_at DESC").Find(&books)

	// Build markdown
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("# %s\n\n", config.ReadmeTitle))

	if len(books) == 0 {
		sb.WriteString("No books added yet.\n")
	} else {
		// Header row
		sb.WriteString("| ")
		for _, col := range config.VisibleColumns {
			sb.WriteString(col + " | ")
		}
		sb.WriteString("\n")

		// Separator row
		sb.WriteString("| ")
		for range config.VisibleColumns {
			sb.WriteString("--- | ")
		}
		sb.WriteString("\n")

		// Data rows
		for _, book := range books {
			sb.WriteString("| ")
			for _, col := range config.VisibleColumns {
				value := getColumnValue(book, col)
				sb.WriteString(value + " | ")
			}
			sb.WriteString("\n")
		}
	}

	// Write to file
	return os.WriteFile("README.md", []byte(sb.String()), 0644)
}

// getColumnValue returns the string value for a column
func getColumnValue(book models.Book, column string) string {
	switch column {
	case "Title":
		return book.Title
	case "Author":
		return book.Author
	case "Status":
		return book.Status
	case "StartDate":
		if book.StartDate != nil {
			return book.StartDate.Format("02/01/2006")
		}
		return ""
	case "EndDate":
		if book.EndDate != nil {
			return book.EndDate.Format("02/01/2006")
		}
		return ""
	case "Review":
		return book.Review
	case "Rating":
		if book.Rating > 0 {
			return fmt.Sprintf("%d", book.Rating)
		}
		return ""
	case "Reread":
		if book.Reread {
			return "Yes"
		}
		return "No"
	case "Genres":
		return book.Genres
	case "Pages":
		if book.Pages > 0 {
			return fmt.Sprintf("%d", book.Pages)
		}
		return ""
	default:
		return ""
	}
}