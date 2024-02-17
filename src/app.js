
Implementing a centralized error handling middleware allows you to catch and handle errors uniformly across your application.This middleware will ensure that any errors thrown or passed along in your route handlers or other middleware are dealt with in a consistent manner, improving the reliability and maintainability of your code.

    errorHandlingMiddleware.js
javascript
Copy code
// errorHandlingMiddleware.js
function errorHandlingMiddleware(err, req, res, next) {
    // Log the error for debugging purposes
    console.error(err);

    // Determine the status code based on the error
    const statusCode = err.statusCode || 500; // Default to 500 if statusCode not set

    // Send a generic error message or a specific one if defined
    res.status(statusCode).json({
        error: {
            message: err.message || 'An unexpected error occurred on the server.',
            status: statusCode,
            timestamp: new Date(),
        },
    });
}

module.exports = errorHandlingMiddleware;
Integrating errorHandlingMiddleware into Your Application
After defining the middleware, you need to integrate it into your application to ensure it catches and processes errors effectively.This integration typically occurs in your main application file, such as app.js, after all route definitions and before starting the server.

Update to app.js:
javascript
Copy code
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
require('dotenv').config();

// Import routes
const authRoutes = require('./api/auth/auth.routes');
const postRoutes = require('./api/social/post.routes'); // Ensure this path is correct

// Import middleware
const authMiddleware = require('./middleware/authMiddleware');
const errorHandlingMiddleware = require('./middleware/errorHandlingMiddleware'); // Ensure this path is correct

const app = express();

// Connect to MongoDB
connectDB();

// Apply middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(passport.initialize());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after a 15 minute wait'
});
app.use(limiter);

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// HTTPS redirect in production
if (process.env.NODE_ENV === 'production') {
    app.enable('trust proxy');
    app.use((req, res, next) => {
        if (req.secure) next();
        else res.redirect(`https://${req.headers.host}${req.url}`);
    });
}
