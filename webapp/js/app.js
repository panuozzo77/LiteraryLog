// Global state
let allBooks = [];
let filteredBooks = [];
let currentTab = 'bookshelf';
let sortOrder = 'recent';

// Status translations
const statusMap = {
    'Finito': 'Completato',
    'Leggendo': 'Leggendo',
    'Non Letto': 'Non iniziato',
    'Abbandonato': 'Abbandonato'
};

const statusClass = {
    'Finito': 'status-completed',
    'Leggendo': 'status-reading',
    'Non Letto': 'status-not-started',
    'Abbandonato': 'status-abandoned'
};

// Load books from JSON
async function loadBooks() {
    try {
        var allowCrossDomain = function(req,res,next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        }
        const response = await fetch('data/books.json');
        allBooks = await response.json();
        console.log(`Loaded ${allBooks.length} books`);
        
        // Initialize the display
        filterBooks();
        setupEventListeners();
    } catch (error) {
        console.error('Error loading books:', error);
        document.getElementById('booksContainer').innerHTML = 
            '<div class="no-books"><div class="no-books-icon">❌</div><div class="no-books-text">Errore nel caricamento dei libri</div></div>';
    }
}

// Filter books based on current tab
function filterBooks() {
    let filtered = allBooks;

    // Filter by tab
    switch(currentTab) {
        case 'reading':
            filtered = filtered.filter(book => book.status === 'Leggendo');
            break;
        case 'completed':
            filtered = filtered.filter(book => book.status === 'Finito');
            break;
        case 'abandoned':
            filtered = filtered.filter(book => book.status === 'Abbandonato');
            break;
        case 'not-read':
            filtered = filtered.filter(book => book.status === 'Non Letto');
            break;
        case 'bookshelf':
            filtered = filtered.filter(book => book.status !== 'Non Letto');
            break;
        case 'all':
            // Show all books
            break;
    }

    // Filter by search
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
    }

    // Sort books
    filtered = sortBooks(filtered);

    filteredBooks = filtered;
    displayBooks();
}

// Sort books based on current sort order
function sortBooks(books) {
    const sorted = [...books];

    switch(sortOrder) {
        case 'recent':
            sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            break;
        case 'rating':
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'title':
            sorted.sort((a, b) => a.title.localeCompare(b.title, 'it'));
            break;
        case 'author':
            sorted.sort((a, b) => a.author.localeCompare(b.author, 'it'));
            break;
    }

    return sorted;
}

// Display books in the container
async function displayBooks() {
    const container = document.getElementById('booksContainer');

    if (filteredBooks.length === 0) {
        container.innerHTML = `
            <div class="no-books">
                <div class="no-books-icon">📭</div>
                <div class="no-books-text">Nessun libro trovato</div>
            </div>
        `;
        return;
    }

    const bookCards = await Promise.all(filteredBooks.map(book => createBookCard(book)));
    container.innerHTML = bookCards.join('');
}

// Create a book card HTML
async function createBookCard(book) {
    const rating = book.rating || 0;
    const stars = generateStars(rating);
    const statusLabel = statusMap[book.status] || book.status;
    const statusClass_ = statusClass[book.status] || 'status-not-started';
    
    const coverUrl = await fetchBookCover(book.title, book.author);

    let coverElement;
    if (coverUrl) {
        coverElement = `<img src="${coverUrl}" alt="${escapeHtml(book.title)}" class="book-cover-image">`;
    } else {
        // Generate a color-based cover using the first letter of the title
        const coverColor = getColorFromTitle(book.title);
        const firstLetter = book.title.charAt(0).toUpperCase();
        coverElement = `<div class="book-cover-placeholder" style="background: ${coverColor};">${firstLetter}</div>`;
    }

    return `
        <div class="book-card">
            <div class="book-cover">
                ${coverElement}
            </div>
            <div class="book-info">
                <div class="book-title">${escapeHtml(book.title)}</div>
                <div class="book-author">${escapeHtml(book.author)}</div>
                <div class="book-status ${statusClass_}">${statusLabel}</div>
                <div class="book-rating">${stars}</div>
                <div class="book-meta">
                    ${book.pages ? `📄 ${book.pages} pagine` : ''}
                </div>
            </div>
        </div>
    `;
}

// Fetch book cover from Google Books API
async function fetchBookCover(title, author) {
    try {
        const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const book = data.items[0];
            if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
                return book.volumeInfo.imageLinks.thumbnail;
            }
        }
        return null;
    } catch (error) {
        console.error('Error fetching book cover:', error);
        return null;
    }
}

// Generate star rating HTML
function generateStars(rating) {
    const totalStars = 5;
    let stars = '';
    const scaledRating = (rating / 10) * totalStars;

    for (let i = 1; i <= totalStars; i++) {
        if (i <= scaledRating) {
            stars += '<span class="star">★</span>';
        } else if (i - 0.5 <= scaledRating) {
            stars += '<span class="star half">☆</span>';
        } else {
            stars += '<span class="star empty">☆</span>';
        }
    }
    return stars;
}

// Get a consistent color based on the title
function getColorFromTitle(title) {
    const colors = [
        '#667eea',
        '#764ba2',
        '#f093fb',
        '#4facfe',
        '#00f2fe',
        '#43e97b',
        '#fa709a',
        '#fee140',
        '#30cfd0',
        '#330867'
    ];
    
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
}

// Escape HTML special characters
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup event listeners
function setupEventListeners() {
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTab = e.target.dataset.tab;
            filterBooks();
        });
    });

    // Search input
    document.getElementById('searchInput').addEventListener('input', () => {
        filterBooks();
    });

    // Search button
    document.getElementById('searchBtn').addEventListener('click', () => {
        filterBooks();
    });

    // Sort button
    document.getElementById('sortBtn').addEventListener('click', () => {
        const options = ['recent', 'rating', 'title', 'author'];
        const currentIndex = options.indexOf(sortOrder);
        sortOrder = options[(currentIndex + 1) % options.length];
        
        const sortLabels = {
            'recent': '⚡ Recenti',
            'rating': '⭐ Voto',
            'title': '📖 Titolo',
            'author': '✍️ Autore'
        };
        
        document.getElementById('sortBtn').textContent = sortLabels[sortOrder];
        filterBooks();
    });

    // Search on Enter key
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterBooks();
        }
    });
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', loadBooks);

