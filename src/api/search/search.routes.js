const express = require('express');
const router = express.Router();
const searchController = require('./search.controller'); // Adjust path as necessary
const authMiddleware = require('../../middleware/authMiddleware'); // Adjust path as necessary

router.get('/search', authMiddleware, searchController.searchItems);

module.exports = router;
