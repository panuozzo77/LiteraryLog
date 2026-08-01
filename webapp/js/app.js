// Global state
let allBooks = [];
let filteredBooks = [];
let currentTab = 'bookshelf';
let sortOrder = 'recent';
// Cache for book covers
const coverCache = JSON.parse(localStorage.getItem('bookCovers') || '{}');

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
        var allowCrossDomain = function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        }
        const response = await fetch('data/books.json');
        allBooks = await response.json();
        console.log(`Loaded ${allBooks.length} books`);

        // Initialize the display
        // Initialize the display
        updateSortButtonLabel();
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
    switch (currentTab) {
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

    switch (sortOrder) {
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

    const coverUrl = await fetchBookCover(book);

    let coverElement;
    if (coverUrl) {
        coverElement = `<img src="${coverUrl}" alt="${escapeHtml(book.title)}" class="book-cover-image" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'book-cover-placeholder\\'></div>';">`;
    } else {
        coverElement = `<div class="book-cover-placeholder"></div>`;
    }

    return `
        <div class="book-card">
            <div class="book-cover-container">
                ${coverElement}
            </div>
            <div class="book-info">
                <div class="book-title">${escapeHtml(book.title)}</div>
                <div class="book-author">${escapeHtml(book.author)}</div>
                
                <div class="book-meta">
                    <div class="book-status ${statusClass_}">${statusLabel}</div>
                    <div class="book-rating">${stars}</div>
                </div>
            </div>
        </div>
    `;
}

// Fetch book cover (prefer local cover from webapp/covers/<id>.jpg)
async function fetchBookCover(book) {
    if (typeof book === 'object' && book !== null && book.id) {
        return `covers/${book.id}.jpg`;
    }

    const title = typeof book === 'string' ? book : (book ? book.title : '');
    const author = typeof book === 'object' && book ? book.author : '';
    const cacheKey = `${title}-${author}`;

    if (coverCache[cacheKey]) {
        return coverCache[cacheKey];
    }

    return null;
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

    // Search input with debounce
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(() => {
        filterBooks();
    }, 300));



    // Sort button
    document.getElementById('sortBtn').addEventListener('click', () => {
        const options = ['rating', 'title', 'author', 'recent'];
        const currentIndex = options.indexOf(sortOrder);
        sortOrder = options[(currentIndex + 1) % options.length];

        updateSortButtonLabel();
        filterBooks();
    });

    // Search on Enter key
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterBooks();
        }
    });
}

// Update sort button label
function updateSortButtonLabel() {
    const sortLabels = {
        'recent': '⚡ Recenti',
        'rating': '⭐ Voto',
        'title': '📖 Titolo',
        'author': '✍️ Autore'
    };
    document.getElementById('sortBtn').textContent = sortLabels[sortOrder];
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', loadBooks);

