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

// New route for updating reading progress
router.patch('/:bookId/progress', authMiddleware, bookController.updateReadingProgress);

module.exports = router;
