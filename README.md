# Blog-App

A modern, secure, and feature-rich RESTful API for a blogging platform built with Node.js and Express. This backend application provides comprehensive authentication, post management, and comprehensive API documentation.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Security Features](#security-features)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Authentication

- **User Registration**: Create new user accounts with email validation
- **User Login**: Secure login with JWT token-based authentication
- **Password Hashing**: Industry-standard bcryptjs for password security
- **Protected Routes**: JWT authentication middleware for secured endpoints

### Blog Post Management

- **Create Posts**: Authenticated users can create new blog posts
- **Read Posts**: Browse all blog posts or view individual posts
- **Update Posts**: Authors can edit their own posts
- **Delete Posts**: Authors can remove their own posts
- **Rich Content**: Support for HTML/markdown content in posts
- **Timestamps**: Automatic creation and update timestamps for all posts

### API Features

- **Rate Limiting**: Protection against API abuse with express-rate-limit
- **CORS Support**: Cross-origin resource sharing enabled
- **Security Headers**: Helmet.js for HTTP header security
- **Request Logging**: Morgan middleware for HTTP request logging
- **Input Validation**: Comprehensive request validation with express-validator
- **Swagger Documentation**: Interactive API documentation at `/api/docs`

---

## 🛠 Tech Stack

### Core Framework

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Security & Utilities

- **bcryptjs** - Password hashing library
- **jsonwebtoken (JWT)** - Token-based authentication
- **helmet** - HTTP header security middleware
- **express-rate-limit** - API rate limiting
- **cors** - Cross-Origin Resource Sharing
- **express-validator** - Request validation

### Documentation & Logging

- **Swagger/OpenAPI** - API documentation
- **swagger-jsdoc** - JSDoc to Swagger converter
- **swagger-ui-express** - Interactive Swagger UI
- **morgan** - HTTP request logger

### Development Tools

- **dotenv** - Environment variable management
- **nodemon** - Auto-restart during development

---

## 📁 Project Structure

```
Blog-App/
└── backend/
    ├── package.json              # Project dependencies and scripts
    ├── .env                       # Environment variables (not included in repo)
    └── src/
        ├── app.js                # Express app configuration
        ├── server.js             # Server entry point
        ├── config/
        │   ├── db.js             # MongoDB connection configuration
        │   └── swagger.js        # Swagger/OpenAPI configuration
        ├── controllers/
        │   ├── auth.controller.js    # Authentication logic
        │   └── post.controller.js    # Post CRUD operations
        ├── middleware/
        │   ├── auth.middleware.js     # JWT authentication middleware
        │   ├── error.middleware.js    # Error handling middleware
        │   └── validate.middleware.js # Request validation middleware
        ├── models/
        │   ├── post.model.js      # Post MongoDB schema
        │   └── user.model.js      # User MongoDB schema
        ├── routes/
        │   ├── auth.routes.js     # Authentication routes
        │   └── post.routes.js     # Post management routes
        ├── services/
        │   ├── auth.service.js    # Authentication business logic
        │   └── post.service.js    # Post business logic
        └── validators/
            ├── auth.validator.js  # Auth request validation rules
            └── post.validator.js  # Post request validation rules
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance like MongoDB Atlas)

### Steps

1. **Clone the repository** (if applicable):

```bash
git clone <repository-url>
cd Blog-App
```

2. **Navigate to the backend directory**:

```bash
cd backend
```

3. **Install dependencies**:

```bash
npm install
```

4. **Create a `.env` file** in the `backend` directory with the required environment variables (see below)

5. **Start the application**:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/blog-app
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/blog-app?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Application URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Environment Variable Descriptions

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRE` - JWT token expiration time
- `FRONTEND_URL` - Frontend application URL for CORS

---

## ▶️ Running the Application

### Production Mode

```bash
npm start
```

Runs the server on the specified PORT (default: 5000)

### Development Mode

```bash
npm run dev
```

Uses nodemon for automatic server restart on file changes

### Server Output

```
Server running on port 5000
Connected to MongoDB...
API is running...
```

---

## 📚 API Documentation

### Interactive Swagger Documentation

Once the server is running, access the interactive API documentation:

```
http://localhost:5000/api/docs
```

This provides:

- Complete list of all endpoints
- Request/response examples
- Try-it-out functionality
- Parameter and schema documentation

---

## 🔌 API Endpoints

### Authentication Endpoints

#### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123"
}

Response: 201 Created
{
  "success": true,
  "token": "jwt_token_here",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

#### Login User

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "StrongPassword123"
}

Response: 200 OK
{
  "success": true,
  "token": "jwt_token_here",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

### Post Endpoints

#### Get All Posts

```
GET /api/posts

Response: 200 OK
[
  {
    "id": "...",
    "title": "My First Blog Post",
    "content": "<p>Post content here</p>",
    "author": { "id": "...", "name": "John Doe" },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  ...
]
```

#### Get Single Post

```
GET /api/posts/:id

Response: 200 OK
{
  "id": "...",
  "title": "My First Blog Post",
  "content": "<p>Post content here</p>",
  "author": { "id": "...", "name": "John Doe" },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Create Post (Protected)

```
POST /api/posts
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "title": "My New Blog Post",
  "content": "<p>This is the content of my blog post</p>"
}

Response: 201 Created
{
  "success": true,
  "post": { "id": "...", "title": "...", "content": "...", ... }
}
```

#### Update Post (Protected)

```
PUT /api/posts/:id
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "title": "Updated Title",
  "content": "<p>Updated content</p>"
}

Response: 200 OK
{
  "success": true,
  "post": { "id": "...", "title": "Updated Title", ... }
}
```

#### Delete Post (Protected)

```
DELETE /api/posts/:id
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## 🏗 Architecture

### Design Patterns Used

1. **MVC Pattern**

   - **Models**: Mongoose schemas define data structure
   - **Controllers**: Handle request/response logic
   - **Views**: JSON responses through routes

2. **Service Layer**

   - Business logic separated from controllers
   - Reusable functions for data operations
   - Database interaction abstraction

3. **Middleware Pipeline**
   - Authentication middleware for protected routes
   - Validation middleware for request validation
   - Error handling middleware for exceptions
   - Logging middleware for request tracking

### Request Flow

```
Request → Express App → Middleware Stack → Route Handler →
Controller → Service Layer → Database → Response
```

---

## 🔒 Security Features

### Authentication & Authorization

- **JWT Tokens**: Stateless authentication with expiration
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **Protected Routes**: Middleware to verify JWT tokens on protected endpoints

### Request Security

- **CORS**: Cross-origin requests properly configured
- **Helmet.js**: HTTP header security (XSS, CSRF, clickjacking protection)
- **Rate Limiting**: Protect against brute force and DoS attacks
- **Input Validation**: Comprehensive validation of all inputs with express-validator

### Best Practices

- Environment variables for sensitive data
- HTTP-only tokens recommendation
- Password reset mechanisms (ready to implement)
- Error message sanitization

---

## 📝 Contributing

### How to Contribute

1. Create a new feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m 'Add your feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

### Code Standards

- Follow existing code style
- Add comments for complex logic
- Update API documentation (Swagger comments)
- Test endpoints before submitting PR

---

## 📄 License

This project is licensed under the ISC License - see the [package.json](backend/package.json) file for details.

---

## 🤝 Support

For issues, questions, or suggestions:

1. Check existing documentation
2. Review API documentation at `/api/docs`
3. Check error messages and logs
4. Open an issue with detailed description

---

## 🗺 Future Enhancements

- [ ] Comment system on blog posts
- [ ] User profile management
- [ ] Post categories and tags
- [ ] Search functionality
- [ ] Email verification
- [ ] Password reset functionality
- [ ] User roles and permissions
- [ ] Post publishing schedule
- [ ] Image upload support
- [ ] Analytics and views counter

---

## 📞 Contact

For questions or inquiries, please reach out through the project repository.

---

**Happy Blogging! 🎉**
