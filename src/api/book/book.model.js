const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    summary: { type: String },
    isbn: { type: String },
    genres: [{ type: String }],
    imageUrl: { type: String },
    status: { type: String, enum: ['wantToRead', 'alreadyRead', 'wishlist'], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, default: 0 },
    reviews: [{
        reviewer: { type: String },
        text: { type: String },
        rating: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    readPages: { type: Number, default: 0 }
}, { timestamps: true });

bookSchema.index({ user: 1, status: 1 }); // Improve query performance

module.exports = mongoose.model('Book', bookSchema);
