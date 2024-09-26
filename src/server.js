const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

const DATA_FILE = path.join(__dirname, 'books.json');

let books = [];

// Function to load books from JSON file
async function loadBooks() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        books = JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, create it with an empty array
            await fs.writeFile(DATA_FILE, '[]', 'utf8');
            books = [];
        } else {
            console.error('Error reading books file:', error);
            throw error;
        }
    }
}

// Function to save books to JSON file
async function saveBooks() {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing books file:', error);
        throw error;
    }
}

// Updated middleware to check Content-Type
app.use((req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
        const contentType = req.headers['content-type'];
        if (!contentType || contentType.includes('application/json')) {
            return res.status(400).send('Content-Type must be application/json');
        }
        // Use raw body parsing for JSON
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            if (data) {
                try {
                    req.body = JSON.parse(data);
                } catch (e) {
                    return res.status(400).send('Invalid JSON');
                }
            }
            next();
        });
    } else {
        next();
    }
});

// GET all books
app.get('/books', async (req, res) => {
    await loadBooks();
    res.json(books);
});

// GET a book by ISBN
app.get('/books/:isbn', async (req, res) => {
    await loadBooks();
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// POST a new book
app.post('/books', async (req, res) => {
    const { title, author, publisher, publishedDate, isbn } = req.body;
    if (!title || !author || !publisher || !publishedDate || !isbn) {
        return res.status(400).send('All fields are required');
    }

    await loadBooks();
    const newBook = { title, author, publisher, publishedDate, isbn };
    books.push(newBook);
    await saveBooks();
    res.status(201).json(newBook);
});

// PUT/PATCH to update a book
app.put('/books/:isbn', async (req, res) => {
    await loadBooks();
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        const { title, author, publisher, publishedDate } = req.body;
        book.title = title || book.title;
        book.author = author || book.author;
        book.publisher = publisher || book.publisher;
        book.publishedDate = publishedDate || book.publishedDate;
        await saveBooks();
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// DELETE a book by ISBN
app.delete('/books/:isbn', async (req, res) => {
    await loadBooks();
    const bookIndex = books.findIndex(b => b.isbn === req.params.isbn);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        await saveBooks();
        res.status(204).send();
    } else {
        res.status(404).send('Book not found');
    }
});

// Initialize the server
async function initServer() {
    await loadBooks();
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

initServer().catch(console.error);