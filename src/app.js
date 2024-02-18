require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/swagger.yaml');
const swaggerJsDoc = require('swagger-jsdoc');

// Passport configuration
require('./config/passport')(passport);

// Import routes
const authRoutes = require('./api/auth/auth.routes');
const bookRoutes = require('./api/book/book.routes');
const postRoutes = require('./api/social/post.routes');
const notificationRoutes = require('./api/notifications/notification.routes');
const bookListRoutes = require('./api/book/bookList.routes');

// Import middleware
const authMiddleware = require('./middleware/authMiddleware');
const errorHandlingMiddleware = require('./middleware/errorHandlingMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

// Swagger UI setup

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Apply middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(errorHandlingMiddleware);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after a 15 minute wait',
});
app.use(limiter);

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/books', bookListRoutes); // Note: This seems to be intended for bookLists specifically
app.use('/api/social', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
