/* ──────────────────────────────────────────────
   Auth Service — Firestore user management
   ────────────────────────────────────────────── */
const { db, admin } = require('../config/firebase');

const usersCol = db.collection('users');

async function createUser(uid, data) {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const userData = {
        uid,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        role: data.role || 'customer',
        createdAt: now,
        updatedAt: now
    };
    await usersCol.doc(uid).set(userData);
    return { ...userData, createdAt: new Date(), updatedAt: new Date() };
}

async function getUserByUid(uid) {
    const doc = await usersCol.doc(uid).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function updateUser(uid, data) {
    data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    await usersCol.doc(uid).update(data);
    return getUserByUid(uid);
}

module.exports = { createUser, getUserByUid, updateUser };
