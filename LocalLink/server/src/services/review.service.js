/* ──────────────────────────────────────────────
   Review Service
   ────────────────────────────────────────────── */
const { db, admin } = require('../config/firebase');

const reviewsCol = db.collection('reviews');
const providersCol = db.collection('providers');

async function createReview(data) {
    // Duplicate check
    const existing = await reviewsCol
        .where('providerId', '==', data.providerId)
        .where('customerId', '==', data.customerId)
        .limit(1)
        .get();
    if (!existing.empty) {
        throw Object.assign(new Error('You have already reviewed this provider'), { status: 409 });
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const ref = reviewsCol.doc();
    const review = {
        reviewId: ref.id,
        providerId: data.providerId,
        customerId: data.customerId,
        customerName: data.customerName || 'Anonymous',
        rating: data.rating,
        comment: data.comment || '',
        createdAt: now
    };
    await ref.set(review);

    // Update provider aggregate
    await updateProviderRating(data.providerId);

    return { id: ref.id, ...review, createdAt: new Date() };
}

async function getReviewsByProvider(providerId) {
    const snap = await reviewsCol
        .where('providerId', '==', providerId)
        .orderBy('createdAt', 'desc')
        .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function updateProviderRating(providerId) {
    const snap = await reviewsCol.where('providerId', '==', providerId).get();
    const total = snap.size;
    if (total === 0) return;
    const sum = snap.docs.reduce((s, d) => s + (d.data().rating || 0), 0);
    const avg = Math.round((sum / total) * 10) / 10;
    await providersCol.doc(providerId).update({
        averageRating: avg,
        totalReviews: total
    });
}

async function deleteReview(reviewId) {
    const doc = await reviewsCol.doc(reviewId).get();
    if (!doc.exists) return;
    const { providerId } = doc.data();
    await reviewsCol.doc(reviewId).delete();
    await updateProviderRating(providerId);
}

module.exports = { createReview, getReviewsByProvider, deleteReview };
