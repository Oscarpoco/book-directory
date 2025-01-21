# 📚 Book Directory API

A robust RESTful API built with Node.js for managing a book directory. This API provides comprehensive CRUD operations for book management, with data persistence using a JSON file storage system.

![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![Express](https://img.shields.io/badge/express-4.x-blue)

## 🚀 Features

- Full CRUD operations for book management
- Input validation and error handling
- RESTful architecture
- Middleware for logging and error handling
- Swagger API documentation

## 📋 API Endpoints

### Books

| Method   | Endpoint           | Description                    | Request Body                                      |
|----------|-------------------|--------------------------------|--------------------------------------------------|
| GET      | `/api/books`      | Retrieve all books             | -                                                |
| GET      | `/api/books/:isbn`| Get book by ISBN               | -                                                |
| POST     | `/api/books`      | Create a new book              | `{ title, author, isbn, price, category }`       |
| PUT      | `/api/books/:isbn`| Update book by ISBN            | `{ title?, author?, price?, category? }`         |
| DELETE   | `/api/books/:isbn`| Delete book by ISBN            | -                                                |

## 🛠️ Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Data Storage**: JSON file
- **Documentation**: Swagger/OpenAPI
- **Validation**: Express-validator

## ⚙️ Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/oscarpoco/book-directory.git
cd book-directory
```

2. Install dependencies:
```bash
npm install
```

4. Start the server:
```bash
# Development mode
npm run dev
node server

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## 📝 API Documentation

### Request/Response Examples

#### Get All Books
```http
GET /books
```

#### Create New Book
```http
POST /books
Content-Type: application/json

{
  "title": "New Book",
  "author": "Oscar",
  "publisher": "mlab",
  "publishedDate": "2023-09-15",
  "isbn": "1234543434343434"
}
```

```

## ⚡ Performance

- Implements caching for frequently accessed data
- Rate limiting to prevent abuse
- Efficient JSON file operations with streaming
- Error handling middleware for consistent responses


## 🔄 Data Persistence

Books are stored in `data/books.json` with the following structure:

```json
{
  "books": [
    {
      "title": "New Book",
      "author": "Oscar",
      "publisher": "mlab",
      "publishedDate": "2023-09-15",
      "isbn": "1234543434343434"
    }
  ]
}
```

## 🛡️ Security

- Input validation for all endpoints
- Rate limiting per IP
- Sanitization of user inputs
- Error messages don't expose internal details
- HTTP headers security using helmet


## 📈 Monitoring

- Built-in endpoint for health checks: `/health`
- Logging of all API requests
- Performance metrics available at `/metrics`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 📞 Support

- Create an issue in the GitHub repository
- Email: oscarkylepoco@gmail.com
