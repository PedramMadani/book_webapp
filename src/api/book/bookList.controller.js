const BookList = require('./bookList.model');

// Create a new book list
exports.createBookList = async (req, res) => {
    const { name, description, books } = req.body;
    try {
        const newBookList = new BookList({
            name,
            description,
            books,
            user: req.user.id // Assuming req.user is set by auth middleware
        });

        await newBookList.save();
        res.status(201).json(newBookList);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating book list', error: error.message });
    }
};

// Get all book lists for a user
exports.getBookLists = async (req, res) => {
    try {
        const bookLists = await BookList.find({ user: req.user.id }).populate('books');
        res.json(bookLists);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching book lists', error: error.message });
    }
};

// Update a book list
exports.updateBookList = async (req, res) => {
    const { listId } = req.params;
    const { name, description, books } = req.body;
    try {
        const updatedBookList = await BookList.findOneAndUpdate(
            { _id: listId, user: req.user.id },
            { name, description, books },
            { new: true, runValidators: true }
        ).populate('books');

        if (!updatedBookList) {
            return res.status(404).json({ message: "Book list not found or user not authorized" });
        }

        res.json(updatedBookList);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating book list', error: error.message });
    }
};

// Delete a book list
exports.deleteBookList = async (req, res) => {
    const { listId } = req.params;
    try {
        const result = await BookList.findOneAndDelete({ _id: listId, user: req.user.id });

        if (!result) {
            return res.status(404).json({ message: "Book list not found or user not authorized" });
        }

        res.json({ message: "Book list deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting book list', error: error.message });
    }
};
