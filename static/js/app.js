// Global variables
let currentBookId = null;
let currentLanguage = 'en';
const allColumns = ['Title', 'Author', 'Status', 'StartDate', 'EndDate', 'Review', 'Rating', 'Reread', 'Genres', 'Pages'];

// Translation system
const translations = {
    en: {
        // Page titles and sections
        pageTitle: 'Book Archive',
        addEditBook: 'Add/Edit Book',
        bookList: 'Book List',
        readmeSettings: 'README Settings',

        // Form labels
        title: 'Title',
        author: 'Author',
        status: 'Status',
        startDate: 'Start Date',
        endDate: 'End Date',
        review: 'Review',
        rating: 'Rating (1-10)',
        reread: 'Would read again',
        genres: 'Genres',
        pages: 'Pages',
        readmeTitle: 'README Title',
        visibleColumns: 'Visible Columns',

        // Buttons
        saveBook: 'Save Book',
        cancel: 'Cancel',
        saveSettings: 'Save Settings',
        saveCommit: 'Save and Commit to Git',
        edit: 'Edit',
        delete: 'Delete',

        // Status options
        statusNotRead: 'Non Letto',
        statusReading: 'Leggendo',
        statusFinished: 'Finito',
        statusAbandoned: 'Abbandonato',

        // Messages
        deleteConfirm: 'Are you sure you want to delete this book?',
        settingsSaved: 'Settings saved!',
        savedCommitted: 'Saved and committed successfully',

        // Table headers
        tableTitle: 'Title',
        tableAuthor: 'Author',
        tableStatus: 'Status',
        tableStartDate: 'Start Date',
        tableEndDate: 'End Date',
        tableRating: 'Rating',
        tableGenres: 'Genres',
        tablePages: 'Pages',
        tableActions: 'Actions',

        // Language
        language: 'Language',
        english: 'English',
        italian: 'Italiano'
    },
    it: {
        // Page titles and sections
        pageTitle: 'Archivio Libri',
        addEditBook: 'Aggiungi/Modifica Libro',
        bookList: 'Lista Libri',
        readmeSettings: 'Impostazioni README',

        // Form labels
        title: 'Titolo',
        author: 'Autore',
        status: 'Stato',
        startDate: 'Data Inizio',
        endDate: 'Data Fine',
        review: 'Recensione',
        rating: 'Valutazione (1-10)',
        reread: 'Lo Rileggerei',
        genres: 'Generi',
        pages: 'Pagine',
        readmeTitle: 'Titolo README',
        visibleColumns: 'Colonne Visibili',

        // Buttons
        saveBook: 'Salva Libro',
        cancel: 'Annulla',
        saveSettings: 'Salva Impostazioni',
        saveCommit: 'Salva e Committa su Git',
        edit: 'Modifica',
        delete: 'Elimina',

        // Status options
        statusNotRead: 'Non Letto',
        statusReading: 'Leggendo',
        statusFinished: 'Finito',
        statusAbandoned: 'Abbandonato',

        // Messages
        deleteConfirm: 'Sei sicuro di voler eliminare questo libro?',
        settingsSaved: 'Impostazioni salvate!',
        savedCommitted: 'Salvato e committato con successo',

        // Table headers
        tableTitle: 'Titolo',
        tableAuthor: 'Autore',
        tableStatus: 'Stato',
        tableStartDate: 'Data Inizio',
        tableEndDate: 'Data Fine',
        tableRating: 'Valutazione',
        tableGenres: 'Generi',
        tablePages: 'Pagine',
        tableActions: 'Azioni',

        // Language
        language: 'Lingua',
        english: 'English',
        italian: 'Italiano'
    }
};

// Translation function
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Load data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    loadConfig();
    setupEventListeners();
    updateLanguageUI();
});

function setupEventListeners() {
    // Book form
    document.getElementById('bookForm').addEventListener('submit', saveBook);
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);

    // Settings
    document.getElementById('saveSettings').addEventListener('click', saveConfig);
    document.getElementById('language').addEventListener('change', changeLanguage);

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
                <button class="action-btn edit-btn" onclick="editBook(${book.id})">${t('edit')}</button>
                <button class="action-btn delete-btn" onclick="deleteBook(${book.id})">${t('delete')}</button>
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
    if (confirm(t('deleteConfirm'))) {
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
            currentLanguage = config.language || 'en';
            document.getElementById('language').value = currentLanguage;
            displayColumnCheckboxes(config.visible_columns);
        })
        .catch(error => console.error('Error loading config:', error));
}

function changeLanguage() {
    const newLanguage = document.getElementById('language').value;
    currentLanguage = newLanguage;
    updateLanguageUI();
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

function updateLanguageUI() {
    // Update page title
    document.querySelector('h1').textContent = t('pageTitle');

    // Update section headers
    document.querySelectorAll('h2')[0].textContent = t('addEditBook');
    document.querySelectorAll('h2')[1].textContent = t('bookList');
    document.querySelectorAll('h2')[2].textContent = t('readmeSettings');

    // Update form labels
    document.querySelector('label[for="title"]').textContent = t('title') + ':';
    document.querySelector('label[for="author"]').textContent = t('author') + ':';
    document.querySelector('label[for="status"]').textContent = t('status') + ':';
    document.querySelector('label[for="startDate"]').textContent = t('startDate') + ':';
    document.querySelector('label[for="endDate"]').textContent = t('endDate') + ':';
    document.querySelector('label[for="review"]').textContent = t('review') + ':';
    document.querySelector('label[for="rating"]').textContent = t('rating') + ':';
    document.querySelector('label[for="genres"]').textContent = t('genres') + ':';
    document.querySelector('label[for="pages"]').textContent = t('pages') + ':';
    document.querySelector('label[for="readmeTitle"]').textContent = t('readmeTitle') + ':';

    // Update buttons
    document.querySelector('button[type="submit"]').textContent = t('saveBook');
    document.getElementById('cancelBtn').textContent = t('cancel');
    document.getElementById('saveSettings').textContent = t('saveSettings');
    document.getElementById('saveCommitBtn').textContent = t('saveCommit');

    // Update table headers
    const headers = document.querySelectorAll('th');
    headers[0].textContent = t('tableTitle');
    headers[1].textContent = t('tableAuthor');
    headers[2].textContent = t('tableStatus');
    headers[3].textContent = t('tableStartDate');
    headers[4].textContent = t('tableEndDate');
    headers[5].textContent = t('tableRating');
    headers[6].textContent = t('tableGenres');
    headers[7].textContent = t('tablePages');
    headers[8].textContent = t('tableActions');

    // Update status options
    const statusSelect = document.getElementById('status');
    statusSelect.options[0].text = t('statusNotRead');
    statusSelect.options[1].text = t('statusReading');
    statusSelect.options[2].text = t('statusFinished');
    statusSelect.options[3].text = t('statusAbandoned');

    // Update checkbox label
    const checkboxText = document.querySelector('.checkbox-text');
    if (checkboxText) {
        checkboxText.textContent = t('reread');
    }

    // Update checkbox labels
    document.querySelectorAll('.checkbox-group label').forEach(label => {
        const checkbox = label.previousElementSibling;
        const columnName = checkbox.value;
        label.textContent = t('table' + columnName);
    });
}

function saveConfig() {
    const visibleColumns = [];
    allColumns.forEach(column => {
        const checkbox = document.getElementById(`col_${column}`);
        if (checkbox && checkbox.checked) {
            visibleColumns.push(column);
        }
    });

    const configData = {
        readme_title: document.getElementById('readmeTitle').value,
        visible_columns: visibleColumns,
        language: currentLanguage
    };

    fetch('/api/config', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(configData)
    })
    .then(response => response.json())
    .then(() => alert(t('settingsSaved')))
    .catch(error => console.error('Error saving config:', error));
}

function saveAndCommit() {
    fetch('/api/save', {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            alert(t('savedCommitted'));
        } else if (data.error) {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error saving and committing:', error);
        alert('An error occurred while saving and committing');
    });
}