# Book Archive

A simple Go web application for tracking your personal book reading list with automatic README generation and Git integration.

## Features

- **Book Management**: Add, edit, and delete books with comprehensive details:
  - Title, Author, Status, Start Date, End Date
  - Rating (1-10), Review, Genres, Pages
  - "Would read again" preference
- **Reading Status Tracking**: Non Letto, Leggendo, Finito, Abbandonato
- **Customizable README Generation**: Selectable columns with personalized title
- **Automatic Git Integration**: Commit and push changes with timestamp messages
- **Multi-language Support**: English and Italian translations
- **Modern Web Interface**: Responsive design with gradient styling
- **SQLite Database**: Local storage with automatic schema migration
- **Persistent Settings**: Language preference and README configuration saved in database

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
3. **Choose your language** in the README Settings section (English/Italian)
4. Add books using the form with comprehensive details:
   - Title, Author, Reading Status
   - Start and End dates
   - Rating, Review, Genres, Pages
   - "Would read again" preference
5. Configure README settings (title and visible columns)
6. Click "Save and Commit" to generate README and commit changes to Git

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
- `GET /api/books/:id` - Get a specific book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `GET /api/config` - Get README configuration and language settings
- `PUT /api/config` - Update README configuration and language preference
- `POST /api/save` - Save changes and commit to Git

## Database

The application uses SQLite (`books.db`) for data storage. The database is created automatically on first run.

## Configuration

Settings are stored in the database and can be modified through the web interface:
- **README Settings**:
  - Custom title for the README
  - Select which columns to display in the generated README
- **Language Settings**:
  - Choose between English and Italian interface
  - Language preference is automatically saved and restored

## Development

The project structure:
- `main.go` - Application entry point and routing
- `models/` - Data models (Book with end_date, Config with language)
- `handlers/` - HTTP request handlers and API endpoints
- `database/` - Database initialization and GORM setup
- `utils/` - Utility functions (README generation, Git operations)
- `templates/` - HTML templates with translation support
- `static/` - CSS styling and JavaScript with i18n functionality
- `PROJECT_README.md` - Project documentation
- `go.mod` - Go module dependencies

## Recent Updates

### Version 2.0 Features
- **End Date Tracking**: Track both start and end dates for books
- **Multi-language Support**: Full English and Italian translations
- **Enhanced UI**: Modern gradient design with improved styling
- **Better Git Integration**: Improved error handling and commit messages
- **Persistent Language Settings**: Language preference saved in database
- **Improved Checkbox Alignment**: Better form element styling

### Database Schema
The application uses SQLite with the following main tables:
- **books**: id, title, author, status, start_date, end_date, review, rating, reread, genres, pages
- **configs**: id, readme_title, visible_columns, language

## License

This project is open source. Feel free to modify and distribute.