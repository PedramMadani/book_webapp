const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const authMiddleware = require('../../middleware/authMiddleware'); // Ensure the path is correct for your project
const { validatePostCreation, validatePostUpdate, validateCommentAddition } = require('./validationMiddleware'); // Update the path as needed

// Route to create a new post, with validation
router.post('/', [authMiddleware, validatePostCreation], postController.createPost);

// Route to update an existing post, with validation
router.put('/:postId', [authMiddleware, validatePostUpdate], postController.updatePost);

// Route to delete a post
router.delete('/:postId', authMiddleware, postController.deletePost);

// Route to toggle like on a post
router.patch('/:postId/like', authMiddleware, postController.toggleLikePost);

// Route to add a comment to a post, with validation
router.post('/:postId/comment', [authMiddleware, validateCommentAddition], postController.addCommentToPost);

// Route to delete a comment from a post
// This assumes comments have unique IDs and are accessible by postId and commentId
router.delete('/:postId/comment/:commentId', authMiddleware, postController.deleteCommentFromPost);

module.exports = router;
