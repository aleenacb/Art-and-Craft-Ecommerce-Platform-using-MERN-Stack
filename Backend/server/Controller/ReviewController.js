const Review = require('../models/reviewModel');

const createReview = async (req, res) => {
    try {
        const { userId, userName, productId, rating, title, review, tags } = req.body;
        const newReview = new Review({ userId, userName, productId, rating, title, review, tags });
        await newReview.save();
        res.status(201).json({ message: 'Review created', review: newReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const { review, rating } = req.body;
        const updated = await Review.findByIdAndUpdate(
            req.params.id,
            { review, rating },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review updated', review: updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const deleted = await Review.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// GET /review/admin/all  →  all reviews, newest first
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json({ reviews });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /review/admin/:id  →  admin edits review text, rating, title, tags
const adminUpdateReview = async (req, res) => {
    try {
        const { review, rating, title, tags } = req.body;
        const updated = await Review.findByIdAndUpdate(
            req.params.id,
            { review, rating, title, tags },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review updated', review: updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /review/admin/:id  →  admin hard-deletes a review
const adminDeleteReview = async (req, res) => {
    try {
        const deleted = await Review.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getUserReviews,
    updateReview,
    deleteReview,
    getProductReviews,
    getAllReviews,
    adminUpdateReview,
    adminDeleteReview,
};
