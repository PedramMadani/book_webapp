const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('./auth.controller');
const authMiddleware = require('../../middleware/authMiddleware'); // Adjust this path as needed for your auth middleware

// Validation for signup
const signupValidation = [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 })
];

router.post('/signup', signupValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await authController.register(req, res);
});

router.post('/login', async (req, res) => {
    await authController.login(req, req.user, res);
});

// Route for updating user profile
router.put('/profile', [authMiddleware], async (req, res) => {
    await authController.updateProfile(req, res);
});

module.exports = router;
