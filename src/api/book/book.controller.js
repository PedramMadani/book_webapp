const Book = require('./book.model');
const { validationResult } = require('express-validator');

// Utility function for handling validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return false;
    }
    return true;
};

exports.addBook = async (req, res) => {
    if (!handleValidationErrors(req, res)) return;

    const { title, author, summary, isbn, genres, imageUrl, status } = req.body;
    try {
        const newBook = new Book({
            title,
            author,
            summary,
            isbn,
            genres,
            imageUrl,
            status,
            user: req.user.id // Assuming req.user is populated from authentication middleware
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Server error while adding a book', error: error.message });
    }
};

exports.updateBook = async (req, res) => {
    if (!handleValidationErrors(req, res)) return;

    const { bookId } = req.params;
    const updates = req.body;

    try {
        const book = await Book.findOneAndUpdate(
            { _id: bookId, user: req.user.id },
            { $set: updates },
            { new: true }
        );

        if (!book) {
            return res.status(404).json({ message: "Book not found or user not authorized" });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating the book', error: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    const { bookId } = req.params;

    try {
        const result = await Book.deleteOne({ _id: bookId, user: req.user.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Book not found or user not authorized" });
        }

        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting the book', error: error.message });
    }
};

exports.getBooksByStatus = async (req, res) => {
    const { status } = req.params;
    const user = req.user.id;

    try {
        const books = await Book.find({ user, status }).sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error while retrieving books', error: error.message });
    }
};

exports.getAllBooksForUser = async (req, res) => {
    const user = req.user.id;

    try {
        const books = await Book.find({ user }).sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error while retrieving books', error: error.message });
    }
};

exports.updateReadingProgress = async (req, res) => {
    const { bookId } = req.params;
    const { readPages } = req.body;

    try {
        const book = await Book.findOneAndUpdate(
            { _id: bookId, user: req.user.id },
            { $set: { readPages } },
            { new: true }
        );

        if (!book) {
            return res.status(404).json({ message: "Book not found or user not authorized to update this book." });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating reading progress', error: error.message });
    }
};

// New function to generate book recommendations
exports.getBookRecommendations = async (req, res) => {
    const user = req.user.id;

    try {
        // Find genres of books the user is interested in
        const userBooks = await Book.find({ user }).select('genres');
        const genres = userBooks.map(book => book.genres).flat();

        // Get unique genres
        const uniqueGenres = [...new Set(genres)];

        // Find books in those genres not added by the user
        const recommendations = await Book.find({
            genres: { $in: uniqueGenres },
            user: { $ne: user }
        }).limit(10); // Limit to 10 recommendations for simplicity

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Server error while getting book recommendations', error: error.message });
    }
};
