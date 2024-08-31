const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    files: {
        type: [String],
        default: [],
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        name: { type: String },
        coords: { type: [Number] },  // Массив с координатами [широта, долгота]
    },
    price: {
        type: String,
    },
    date: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    desc: {
        type: String,
    },
    link: {
        type: String,
    },
    rating: {
        type: Number,
        min: 0,
        max: 2,
        default: 0,
    },
    visited: {
        type: Boolean,
        default: false,  // По умолчанию локация считается непосещенной
    },
    public: {
        type: Boolean,
        default: false,
    },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
