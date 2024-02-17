const Book = require('./book.model'); // Adjust path as necessary
const User = require('../auth/auth.model'); // Adjust path as necessary

exports.searchItems = async (req, res) => {
    const { query } = req.query;

    try {
        const books = await Book.find({ $text: { $search: query } });
        const users = await User.find({ $text: { $search: query } });

        res.json({ books, users });
    } catch (error) {
        res.status(500).json({ message: 'Server error during search', error: error.message });
    }
};
