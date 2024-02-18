# Book Social Network API

## Description

The Book Social Network API is a RESTful web service designed to support a social networking application for book enthusiasts. This API allows users to register and manage accounts, connect with other readers, share book reviews, and track their reading progress.

## Features

- User authentication and profile management.
- Book management, including CRUD operations for books.
- Social features such as following users, posting book reviews, and comments.
- Reading progress tracker for users to log and track the books they are reading, want to read, or have completed.
- Recommendations based on user preferences and reading history.

## Technologies

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Multer for handling file uploads
- Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js (version 12.x or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/PedramMadani/book_webapp
cd book-social-network-api
```
2. Install npm packages:
```bash
npm install
```
3. Set up environment variables:
Create a .env file in the root directory of the project and add the following variables:
```bash
DB_URI=mongodb+srv://<your_mongodb_atlas_uri>
JWT_SECRET=<your_jwt_secret>
PORT=3000
```
Replace <your_mongodb_atlas_uri> with your MongoDB connection string and <your_jwt_secret> with a secure secret for JWT.

4. Run the application:
```bash
npm start
```
## API Documentation
Access the Swagger UI for the API documentation and to test endpoints at http://localhost:3000/api-docs after starting the application.

Usage
Here are some example requests you can make to the API:

- Create a New User:
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```
Log In:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
More examples and detailed usage instructions can be found in the API documentation.

## Contributing
Contributions are welcome! Please feel free to submit pull requests, open issues, or suggest new features.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

