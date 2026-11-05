/* ──────────────────────────────────────────────
   Admin Controller
   ────────────────────────────────────────────── */
const providerService = require('../services/provider.service');
const reportService = require('../services/report.service');
const reviewService = require('../services/review.service');
const categoryService = require('../services/category.service');

/* GET /api/admin/providers/pending */
async function getPendingProviders(req, res, next) {
    try {
        const providers = await providerService.getProvidersByStatus('pending');
        res.json({ success: true, data: providers });
    } catch (err) { next(err); }
}

/* GET /api/admin/providers */
async function getAllProviders(req, res, next) {
    try {
        const status = req.query.status;
        if (status) {
            const providers = await providerService.getProvidersByStatus(status);
            return res.json({ success: true, data: providers });
        }
        const providers = await providerService.getProviders({});
        res.json({ success: true, data: providers });
    } catch (err) { next(err); }
}

/* PUT /api/admin/providers/:id/approve */
async function approveProvider(req, res, next) {
    try {
        const provider = await providerService.updateProvider(req.params.id, { verificationStatus: 'verified' });
        res.json({ success: true, data: provider });
    } catch (err) { next(err); }
}

/* PUT /api/admin/providers/:id/reject */
async function rejectProvider(req, res, next) {
    try {
        const provider = await providerService.updateProvider(req.params.id, { verificationStatus: 'rejected' });
        res.json({ success: true, data: provider });
    } catch (err) { next(err); }
}

/* PUT /api/admin/providers/:id/suspend */
async function suspendProvider(req, res, next) {
    try {
        const provider = await providerService.updateProvider(req.params.id, { verificationStatus: 'suspended' });
        res.json({ success: true, data: provider });
    } catch (err) { next(err); }
}

/* GET /api/admin/reports */
async function getReports(req, res, next) {
    try {
        const reports = await reportService.getReports(req.query.status);
        res.json({ success: true, data: reports });
    } catch (err) { next(err); }
}

/* PUT /api/admin/reports/:id */
async function updateReport(req, res, next) {
    try {
        const report = await reportService.updateReportStatus(req.params.id, req.body.status);
        res.json({ success: true, data: report });
    } catch (err) { next(err); }
}

/* DELETE /api/admin/reviews/:id */
async function deleteReview(req, res, next) {
    try {
        await reviewService.deleteReview(req.params.id);
        res.json({ success: true, message: 'Review deleted' });
    } catch (err) { next(err); }
}

/* POST /api/admin/categories/seed */
async function seedCategories(req, res, next) {
    try {
        await categoryService.seedCategories();
        res.json({ success: true, message: 'Categories seeded' });
    } catch (err) { next(err); }
}

module.exports = {
    getPendingProviders, getAllProviders,
    approveProvider, rejectProvider, suspendProvider,
    getReports, updateReport, deleteReview, seedCategories
};
