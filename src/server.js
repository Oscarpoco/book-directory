const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

const DATA_FILE = path.join(__dirname, 'books.json');

// Enable JSON parsing middleware
app.use(express.json());

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

// Middleware to check Content-Type for POST and PUT requests
app.use((req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
            return res.status(400).send('Content-Type must be application/json');
        }
    }
    next();
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
    res.status(201).json({
        message: `Book "${title}" has been successfully added`,
        book: newBook
    });
});

// PUT/PATCH to update a book
app.put('/books/:isbn', async (req, res) => {
    await loadBooks();
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        const { title, author, publisher, publishedDate } = req.body;
        const oldTitle = book.title;
        book.title = title || book.title;
        book.author = author || book.author;
        book.publisher = publisher || book.publisher;
        book.publishedDate = publishedDate || book.publishedDate;
        await saveBooks();
        res.json({
            message: `Book "${oldTitle}" has been successfully updated`,
            book: book
        });
    } else {
        res.status(404).send('Book not found');
    }
});

// DELETE a book by ISBN
app.delete('/books/:isbn', async (req, res) => {
    await loadBooks();
    const bookIndex = books.findIndex(b => b.isbn === req.params.isbn);
    if (bookIndex !== -1) {
        const deletedBook = books[bookIndex];
        books.splice(bookIndex, 1);
        await saveBooks();
        res.status(200).json({
            message: `Book "${deletedBook.title}" has been successfully deleted`,
            isbn: deletedBook.isbn
        });
    } else {
        res.status(404).json({
            message: `Book with ISBN ${req.params.isbn} was not found`
        });
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