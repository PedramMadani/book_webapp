const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    summary: { type: String },
    isbn: { type: String },
    genre: [{ type: String }]
});

module.exports = mongoose.model('Book', bookSchema);
