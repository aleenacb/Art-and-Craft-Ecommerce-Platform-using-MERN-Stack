const express = require('express');
const route = express.Router();
const {
    createReview,
    getUserReviews,
    updateReview,
    deleteReview,
    getProductReviews,
    getAllReviews,
    adminUpdateReview,
    adminDeleteReview,
} = require('../controller/ReviewController');

// ─── Existing routes (unchanged) ──────────────────────────────────────────────
route.post('/create', createReview);
route.get('/user/:userId', getUserReviews);
route.get('/product/:productId', getProductReviews);
route.put('/:id', updateReview);
route.delete('/:id', deleteReview);

// ─── Admin routes ─────────────────────────────────────────────────────────────
route.get('/admin/all', getAllReviews);
route.put('/admin/:id', adminUpdateReview);
route.delete('/admin/:id', adminDeleteReview);

module.exports = route;

