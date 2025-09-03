// Global variables
let currentBookId = null;
const allColumns = ['Title', 'Author', 'Status', 'StartDate', 'EndDate', 'Review', 'Rating', 'Reread', 'Genres', 'Pages'];

// Load data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    loadConfig();
    setupEventListeners();
});

function setupEventListeners() {
    // Book form
    document.getElementById('bookForm').addEventListener('submit', saveBook);
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);

    // Settings
    document.getElementById('saveSettings').addEventListener('click', saveConfig);

    // Save and commit
    document.getElementById('saveCommitBtn').addEventListener('click', saveAndCommit);
}

function loadBooks() {
    fetch('/api/books')
        .then(response => response.json())
        .then(books => {
            displayBooks(books);
        })
        .catch(error => console.error('Error loading books:', error));
}

function displayBooks(books) {
    const tbody = document.querySelector('#bookTable tbody');
    tbody.innerHTML = '';

    books.forEach(book => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.status}</td>
            <td>${formatDate(book.start_date)}</td>
            <td>${formatDate(book.end_date)}</td>
            <td>${book.rating || ''}</td>
            <td>${book.genres}</td>
            <td>${book.pages || ''}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editBook(${book.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteBook(${book.id})">Delete</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT'); // DD/MM/YYYY
}

function saveBook(event) {
    event.preventDefault();

    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        status: document.getElementById('status').value,
        start_date: document.getElementById('startDate').value || null,
        end_date: document.getElementById('endDate').value || null,
        review: document.getElementById('review').value,
        rating: parseInt(document.getElementById('rating').value) || 0,
        reread: document.getElementById('reread').checked,
        genres: document.getElementById('genres').value,
        pages: parseInt(document.getElementById('pages').value) || 0
    };

    const method = currentBookId ? 'PUT' : 'POST';
    const url = currentBookId ? `/api/books/${currentBookId}` : '/api/books';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    })
    .then(response => response.json())
    .then(() => {
        loadBooks();
        resetForm();
    })
    .catch(error => console.error('Error saving book:', error));
}

function editBook(id) {
    fetch(`/api/books/${id}`)
        .then(response => response.json())
        .then(book => {
            currentBookId = book.id;
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('status').value = book.status;
            document.getElementById('startDate').value = book.start_date ? book.start_date.split('T')[0] : '';
            document.getElementById('endDate').value = book.end_date ? book.end_date.split('T')[0] : '';
            document.getElementById('review').value = book.review;
            document.getElementById('rating').value = book.rating;
            document.getElementById('reread').checked = book.reread;
            document.getElementById('genres').value = book.genres;
            document.getElementById('pages').value = book.pages;
        })
        .catch(error => console.error('Error loading book:', error));
}

function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        fetch(`/api/books/${id}`, {
            method: 'DELETE'
        })
        .then(() => loadBooks())
        .catch(error => console.error('Error deleting book:', error));
    }
}

function cancelEdit() {
    resetForm();
}

function resetForm() {
    currentBookId = null;
    document.getElementById('bookForm').reset();
    document.getElementById('endDate').value = '';
}

function loadConfig() {
    fetch('/api/config')
        .then(response => response.json())
        .then(config => {
            document.getElementById('readmeTitle').value = config.readme_title;
            displayColumnCheckboxes(config.visible_columns);
        })
        .catch(error => console.error('Error loading config:', error));
}

function displayColumnCheckboxes(visibleColumns) {
    const container = document.getElementById('columnCheckboxes');
    container.innerHTML = '';

    allColumns.forEach(column => {
        const div = document.createElement('div');
        div.className = 'checkbox-group';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `col_${column}`;
        checkbox.value = column;
        checkbox.checked = visibleColumns.includes(column);

        const label = document.createElement('label');
        label.htmlFor = `col_${column}`;
        label.textContent = column;

        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);
    });
}

function saveConfig() {
    const visibleColumns = [];
    allColumns.forEach(column => {
        const checkbox = document.getElementById(`col_${column}`);
        if (checkbox.checked) {
            visibleColumns.push(column);
        }
    });

    const configData = {
        readme_title: document.getElementById('readmeTitle').value,
        visible_columns: visibleColumns
    };

    fetch('/api/config', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(configData)
    })
    .then(response => response.json())
    .then(() => alert('Settings saved!'))
    .catch(error => console.error('Error saving config:', error));
}

function saveAndCommit() {
    fetch('/api/save', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error saving and committing:', error));
}