const mongoose = require('mongoose');

// Define a separate schema for reviews
const reviewSchema = new mongoose.Schema({
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the User model
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // Ensure ratings are between 1 and 5
    createdAt: { type: Date, default: Date.now }
});

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    summary: { type: String },
    isbn: { type: String },
    genres: [{ type: String }],
    imageUrl: { type: String },
    status: { type: String, enum: ['wantToRead', 'alreadyRead', 'wishlist'], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, default: 0 }, // Consider updating this based on reviews or removing if not used
    reviews: [reviewSchema], // Use the defined review schema
    readPages: { type: Number, default: 0 }
}, { timestamps: true });

// Existing indexes for query performance and search functionality
bookSchema.index({ user: 1, status: 1 });
bookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', bookSchema);
