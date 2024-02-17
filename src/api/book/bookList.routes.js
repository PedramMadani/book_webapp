const express = require('express');
const router = express.Router();
const bookListController = require('./bookList.controller');
const authMiddleware = require('../../middleware/authMiddleware');

// Route to create a new book list
router.post('/lists', authMiddleware, bookListController.createBookList);

// Route to get all book lists for the authenticated user
router.get('/lists', authMiddleware, bookListController.getBookLists);

// Route to update an existing book list
router.put('/lists/:listId', authMiddleware, bookListController.updateBookList);

// Route to delete an existing book list
router.delete('/lists/:listId', authMiddleware, bookListController.deleteBookList);

module.exports = router;
