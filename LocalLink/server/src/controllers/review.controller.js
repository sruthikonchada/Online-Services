/* ──────────────────────────────────────────────
   Review Controller
   ────────────────────────────────────────────── */
const reviewService = require('../services/review.service');

async function create(req, res, next) {
    try {
        const data = {
            providerId: req.body.providerId,
            customerId: req.user.uid,
            customerName: req.user.name || 'Anonymous',
            rating: parseInt(req.body.rating),
            comment: req.body.comment || ''
        };
        if (data.rating < 1 || data.rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be 1–5' });
        }
        const review = await reviewService.createReview(data);
        res.status(201).json({ success: true, data: review });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
}

async function listByProvider(req, res, next) {
    try {
        const reviews = await reviewService.getReviewsByProvider(req.params.providerId);
        res.json({ success: true, data: reviews });
    } catch (err) { next(err); }
}

async function remove(req, res, next) {
    try {
        await reviewService.deleteReview(req.params.id);
        res.json({ success: true, message: 'Review deleted' });
    } catch (err) { next(err); }
}

module.exports = { create, listByProvider, remove };
