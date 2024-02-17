const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./auth.model'); // Ensure this path is correct

// Register a new user
const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ email, password });
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login user
const login = (req, user, res) => {
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
};

// Update user profile
const updateProfile = async (req, res) => {
    const { bio, profilePicture, social } = req.body;
    try {
        // Assuming the update doesn't allow changing email or password directly
        const updates = { bio, profilePicture, social };

        const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true })
            .select('-password'); // Exclude password from the response

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error while updating profile');
    }
};

module.exports = { register, login, updateProfile };
