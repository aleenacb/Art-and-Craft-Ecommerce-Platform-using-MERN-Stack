<<<<<<< HEAD
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, default: 'Anonymous' },
    productId: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5},
    title: { type: String, default: '' },
    review: { type: String, required: true },
    tags: { type: [String], default: [] },  
}, { timestamps: true });

=======
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, default: 'Anonymous' },
    productId: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5},
    title: { type: String, default: '' },
    review: { type: String, required: true },
    tags: { type: [String], default: [] },  
}, { timestamps: true });

>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
module.exports = mongoose.model('Review', reviewSchema);