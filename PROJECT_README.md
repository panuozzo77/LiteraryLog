# Book Archive

A simple Go web application for tracking your personal book reading list with automatic README generation and Git integration.

## Features

- Add, edit, and delete books with details like title, author, status, rating, review, etc.
- Track reading status: Non Letto, Leggendo, Finito, Abbandonato
- Customizable README generation with selectable columns
- Automatic Git commit and push when saving changes
- Simple web interface (desktop-focused)
- SQLite database for local storage

## Requirements

- Go 1.21 or later
- Git (for commit/push functionality)

## Installation

1. Clone or download the project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   go mod tidy
   ```
4. Build the application:
   ```bash
   go build -o book_archive
   ```

## Usage

1. Run the application:
   ```bash
   ./book_archive
   ```
2. Open your browser and go to `http://localhost:8080`
3. Add books using the form
4. Configure README settings (title and visible columns)
5. Click "Save and Commit" to generate README and commit changes to Git

## Git Integration

- Initialize a Git repository in the project directory
- Set up a remote repository if you want to push changes
- The app will automatically:
  - Generate/update README.md with your book list
  - Add all changes to Git
  - Commit with a timestamp message
  - Push to the remote repository

## API Endpoints

- `GET /` - Main web interface
- `GET /api/books` - Get all books
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `GET /api/config` - Get README configuration
- `PUT /api/config` - Update README configuration
- `POST /api/save` - Save changes and commit to Git

## Database

The application uses SQLite (`books.db`) for data storage. The database is created automatically on first run.

## Configuration

README settings are stored in the database and can be modified through the web interface:
- Custom title for the README
- Select which columns to display in the generated README

## Development

The project structure:
- `main.go` - Application entry point
- `models/` - Data models (Book, Config)
- `handlers/` - HTTP request handlers
- `database/` - Database initialization
- `utils/` - Utility functions (README generation, Git operations)
- `templates/` - HTML templates
- `static/` - CSS and JavaScript files

## License

This project is open source. Feel free to modify and distribute.