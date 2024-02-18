const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/', authMiddleware, notificationController.getNotifications);
router.post('/markAsRead', authMiddleware, notificationController.markAsRead);

module.exports = router;