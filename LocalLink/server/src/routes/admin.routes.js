const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All admin routes require admin role
router.use(authenticate, authorize('admin'));

router.get('/providers', ctrl.getAllProviders);
router.get('/providers/pending', ctrl.getPendingProviders);
router.put('/providers/:id/approve', ctrl.approveProvider);
router.put('/providers/:id/reject', ctrl.rejectProvider);
router.put('/providers/:id/suspend', ctrl.suspendProvider);

router.get('/reports', ctrl.getReports);
router.put('/reports/:id', ctrl.updateReport);

router.delete('/reviews/:id', ctrl.deleteReview);

router.post('/categories/seed', ctrl.seedCategories);

module.exports = router;
