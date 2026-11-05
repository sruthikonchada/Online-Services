/* ──────────────────────────────────────────────
   Report Service
   ────────────────────────────────────────────── */
const { db, admin } = require('../config/firebase');

const reportsCol = db.collection('reports');

async function createReport(data) {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const ref = reportsCol.doc();
    const report = {
        reportId: ref.id,
        providerId: data.providerId,
        customerId: data.customerId,
        customerName: data.customerName || 'Anonymous',
        reason: data.reason,
        description: data.description || '',
        status: 'open',
        createdAt: now,
        resolvedAt: null
    };
    await ref.set(report);
    return { id: ref.id, ...report, createdAt: new Date() };
}

async function getReports(statusFilter) {
    let query = reportsCol.orderBy('createdAt', 'desc');
    if (statusFilter) {
        query = reportsCol.where('status', '==', statusFilter).orderBy('createdAt', 'desc');
    }
    const snap = await query.get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function updateReportStatus(reportId, status) {
    const update = { status };
    if (status === 'resolved' || status === 'dismissed') {
        update.resolvedAt = admin.firestore.FieldValue.serverTimestamp();
    }
    await reportsCol.doc(reportId).update(update);
    const doc = await reportsCol.doc(reportId).get();
    return { id: doc.id, ...doc.data() };
}

module.exports = { createReport, getReports, updateReportStatus };
