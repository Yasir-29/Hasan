const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateLost: {
        type: Date,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false
    },
    uniqueIdentifiers: {
        type: String,
        required: false
    },
    contactInfo: {
        type: String,
        required: true
    },
    reward: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['lost', 'found'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', itemSchema); 