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

exports.getBookRecommendations = async (req, res) => {
    const user = req.user.id;

    try {
        const userBooks = await Book.find({ user }).select('genres');
        const genres = userBooks.map(book => book.genres).flat();
        const uniqueGenres = [...new Set(genres)];

        const recommendations = await Book.find({
            genres: { $in: uniqueGenres },
            user: { $ne: user }
        }).limit(10);

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Server error while getting book recommendations', error: error.message });
    }
};

// Implementing review functionalities
exports.addReview = async (req, res) => {
    const { bookId } = req.params;
    const { text, rating } = req.body;

    if (!handleValidationErrors(req, res)) return;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const newReview = {
            reviewer: req.user.id,
            text,
            rating,
            createdAt: new Date()
        };

        book.reviews.push(newReview);
        await book.save();

        res.status(201).json({ message: "Review added successfully", book });
    } catch (error) {
        res.status(500).json({ message: 'Server error while adding a review', error: error.message });
    }
};

exports.updateReview = async (req, res) => {
    const { bookId, reviewId } = req.params;
    const { text, rating } = req.body;
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        // Find the review by ID
        const review = book.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }

        // Check if the current user is the reviewer
        if (review.reviewer.toString() !== req.user.id) {
            return res.status(403).json({ message: "User not authorized to update this review." });
        }

        // Update the review
        review.text = text;
        review.rating = rating;
        await book.save();

        res.json({ message: "Review updated successfully.", review });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating review', error: error.message });
    }
};


exports.deleteReview = async (req, res) => {
    const { bookId, reviewId } = req.params;
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        // Find and remove the review
        const review = book.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }

        // Check if the current user is the reviewer
        if (review.reviewer.toString() !== req.user.id) {
            return res.status(403).json({ message: "User not authorized to delete this review." });
        }

        review.remove();
        await book.save();

        res.json({ message: "Review deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting review', error: error.message });
    }
};

