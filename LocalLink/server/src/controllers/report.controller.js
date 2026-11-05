/* ──────────────────────────────────────────────
   Report Controller
   ────────────────────────────────────────────── */
const reportService = require('../services/report.service');

async function create(req, res, next) {
    try {
        const data = {
            providerId: req.body.providerId,
            customerId: req.user.uid,
            customerName: req.user.name || 'Anonymous',
            reason: req.body.reason,
            description: req.body.description || ''
        };
        const report = await reportService.createReport(data);
        res.status(201).json({ success: true, data: report });
    } catch (err) { next(err); }
}

async function list(req, res, next) {
    try {
        const reports = await reportService.getReports(req.query.status);
        res.json({ success: true, data: reports });
    } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
    try {
        const { status } = req.body;
        const valid = ['open', 'under_review', 'resolved', 'dismissed'];
        if (!valid.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        const report = await reportService.updateReportStatus(req.params.id, status);
        res.json({ success: true, data: report });
    } catch (err) { next(err); }
}

module.exports = { create, list, updateStatus };
