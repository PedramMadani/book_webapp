const express = require('express');
const router = express.Router();
const followController = require('./follow.controller');
const authMiddleware = require('../../middleware/authMiddleware'); // Update this path based on your project structure

// Route to follow a user
router.post('/:followedId/follow', authMiddleware, followController.followUser);

// Route to unfollow a user
router.delete('/:followedId/unfollow', authMiddleware, followController.unfollowUser);

// Route to list all followers of a user
router.get('/:userId/followers', authMiddleware, followController.listFollowers);

// Route to list all users a user is following
router.get('/:userId/followings', authMiddleware, followController.listFollowings);

module.exports = router;
