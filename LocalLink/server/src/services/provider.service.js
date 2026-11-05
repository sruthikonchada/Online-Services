/* ──────────────────────────────────────────────
   Provider Service — Firestore CRUD + Search
   ────────────────────────────────────────────── */
const { db, admin } = require('../config/firebase');

const providersCol = db.collection('providers');

/* ── Create ─────────────────────────────────── */
async function createProvider(data) {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const ref = providersCol.doc();
    const provider = {
        providerId: ref.id,
        userId: data.userId,
        businessName: data.businessName || '',
        phone: data.phone || '',
        email: data.email || '',
        description: data.description || '',
        categoryId: data.categoryId || '',
        services: data.services || [],
        experience: data.experience || 0,
        startingPrice: data.startingPrice || 0,
        serviceAreas: data.serviceAreas || [],
        city: data.city || '',
        area: data.area || '',
        pincode: data.pincode || '',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        availability: data.availability || 'available',
        profileImage: data.profileImage || '',
        verificationStatus: 'pending',
        averageRating: 0,
        totalReviews: 0,
        createdAt: now,
        updatedAt: now
    };
    await ref.set(provider);
    return { ...provider, id: ref.id, createdAt: new Date(), updatedAt: new Date() };
}

/* ── Read ───────────────────────────────────── */
async function getProviderById(id) {
    const doc = await providersCol.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function getProviderByUserId(userId) {
    const snap = await providersCol.where('userId', '==', userId).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
}

/* ── List / Search ──────────────────────────── */
async function getProviders(filters = {}) {
    let query = providersCol.orderBy('createdAt', 'desc');

    // Only show verified providers for public listing
    if (filters.publicOnly) {
        query = providersCol.where('verificationStatus', '==', 'verified');
    }

    if (filters.categoryId) {
        query = query.where('categoryId', '==', filters.categoryId);
    }
    if (filters.city) {
        query = query.where('city', '==', filters.city.toLowerCase());
    }
    if (filters.availability) {
        query = query.where('availability', '==', filters.availability);
    }

    const limit = Math.min(parseInt(filters.limit) || 20, 100);
    query = query.limit(limit);

    const snap = await query.get();
    let results = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Client-side filters (Firestore doesn't support multiple inequalities)
    if (filters.minRating) {
        const min = parseFloat(filters.minRating);
        results = results.filter(p => (p.averageRating || 0) >= min);
    }
    if (filters.verified === 'true') {
        results = results.filter(p => p.verificationStatus === 'verified');
    }
    if (filters.maxPrice) {
        results = results.filter(p => (p.startingPrice || 0) <= parseFloat(filters.maxPrice));
    }
    if (filters.minExperience) {
        results = results.filter(p => (p.experience || 0) >= parseInt(filters.minExperience));
    }

    // Distance-based filter
    if (filters.latitude && filters.longitude && filters.maxDistance) {
        const lat = parseFloat(filters.latitude);
        const lng = parseFloat(filters.longitude);
        const maxDist = parseFloat(filters.maxDistance);
        results = results.filter(p => {
            if (!p.latitude || !p.longitude) return false;
            const dist = haversine(lat, lng, p.latitude, p.longitude);
            p._distance = dist;
            return dist <= maxDist;
        });
        results.sort((a, b) => a._distance - b._distance);
    }

    // Sort
    if (filters.sortBy === 'rating') {
        results.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (filters.sortBy === 'price') {
        results.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
    } else if (filters.sortBy === 'experience') {
        results.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    }

    return results;
}

/* ── Update ─────────────────────────────────── */
async function updateProvider(id, data) {
    data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    await providersCol.doc(id).update(data);
    return getProviderById(id);
}

/* ── Admin: list by status ──────────────────── */
async function getProvidersByStatus(status) {
    const snap = await providersCol
        .where('verificationStatus', '==', status)
        .orderBy('createdAt', 'desc')
        .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ── Haversine distance (km) ────────────────── */
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = {
    createProvider, getProviderById, getProviderByUserId,
    getProviders, updateProvider, getProvidersByStatus
};
