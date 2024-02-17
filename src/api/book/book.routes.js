const express = require('express');
const { body } = require('express-validator');
const bookController = require('./book.controller');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

const validateBook = [
    body('title').trim().not().isEmpty().withMessage('Title is required'),
    body('author').trim().not().isEmpty().withMessage('Author is required'),
    body('status').isIn(['wantToRead', 'reading', 'alreadyRead']).withMessage('Invalid status'),
];

router.post('/', [authMiddleware, validateBook], bookController.addBook);
router.put('/:bookId', [authMiddleware, validateBook], bookController.updateBook);
router.delete('/:bookId', authMiddleware, bookController.deleteBook);
router.get('/status/:status', authMiddleware, bookController.getBooksByStatus);
router.get('/', authMiddleware, bookController.getAllBooksForUser);
router.patch('/:bookId/progress', authMiddleware, bookController.updateReadingProgress);
router.get('/recommendations', authMiddleware, bookController.getBookRecommendations);

// Routes for review management
router.post('/:bookId/reviews', [authMiddleware, validateReview], bookController.addReview);
router.put('/:bookId/reviews/:reviewId', [authMiddleware, validateReview], bookController.updateReview);
router.delete('/:bookId/reviews/:reviewId', authMiddleware, bookController.deleteReview);

module.exports = router;
