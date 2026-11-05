/* ──────────────────────────────────────────────
   Category Service
   ────────────────────────────────────────────── */
const { db, admin } = require('../config/firebase');

const categoriesCol = db.collection('categories');

async function getAllCategories() {
    const snap = await categoriesCol.orderBy('name').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getCategoryById(id) {
    const doc = await categoriesCol.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function createCategory(data) {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const ref = categoriesCol.doc();
    const cat = {
        name: data.name,
        description: data.description || '',
        icon: data.icon || '',
        createdAt: now
    };
    await ref.set(cat);
    return { id: ref.id, ...cat };
}

async function updateCategory(id, data) {
    await categoriesCol.doc(id).update(data);
    return getCategoryById(id);
}

async function deleteCategory(id) {
    await categoriesCol.doc(id).delete();
}

/* ── Seed default categories ────────────────── */
async function seedCategories() {
    const snap = await categoriesCol.limit(1).get();
    if (!snap.empty) return; // already seeded

    const defaults = [
        { name: 'Electrician', icon: '⚡', description: 'Electrical wiring, repairs, installations' },
        { name: 'Plumber', icon: '🔧', description: 'Pipe fitting, leak repairs, installations' },
        { name: 'AC Technician', icon: '❄️', description: 'AC installation, servicing, gas refill' },
        { name: 'Laptop Repair', icon: '💻', description: 'Laptop servicing, screen & keyboard replacement' },
        { name: 'Mobile Repair', icon: '📱', description: 'Screen repair, battery replacement, software' },
        { name: 'Cleaner', icon: '🧹', description: 'Home cleaning, deep cleaning, office cleaning' },
        { name: 'Carpenter', icon: '🪚', description: 'Furniture repair, custom woodwork' },
        { name: 'Mechanic', icon: '🚗', description: 'Vehicle servicing, repairs, roadside help' },
        { name: 'Appliance Repair', icon: '🔌', description: 'Washing machine, fridge, microwave repairs' },
        { name: 'Painter', icon: '🎨', description: 'Interior & exterior painting, waterproofing' }
    ];

    const batch = db.batch();
    const now = admin.firestore.FieldValue.serverTimestamp();
    defaults.forEach(cat => {
        const ref = categoriesCol.doc();
        batch.set(ref, { ...cat, createdAt: now });
    });
    await batch.commit();
    console.log('✓ Default categories seeded');
}

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, seedCategories };
