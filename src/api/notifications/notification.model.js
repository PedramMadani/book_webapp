const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['newFollower', 'like', 'comment', 'bookRecommendation'],
        required: true
    },
    message: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
