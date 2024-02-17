const { body, validationResult } = require('express-validator');

// Validation for creating a new post
exports.validatePostCreation = [
    body('text').trim().not().isEmpty().withMessage('Text is required for a post.'),
    // Add more validations here as needed, for example, for 'photoUrl' if you have specific requirements
    // Ensure photoUrl is a valid URL (optional field)
    body('photoUrl').optional().isURL().withMessage('Photo URL must be a valid URL.'),
    // Middleware to check the result of the validation
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validation for updating a post (can be similar to creation, adjust based on requirements)
exports.validatePostUpdate = [
    body('text').optional().trim().not().isEmpty().withMessage('Text is required for updating a post.'),
    body('photoUrl').optional().isURL().withMessage('Photo URL must be a valid URL.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validation for adding a comment to a post
exports.validateCommentAddition = [
    body('text').trim().not().isEmpty().withMessage('Text is required for a comment.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
