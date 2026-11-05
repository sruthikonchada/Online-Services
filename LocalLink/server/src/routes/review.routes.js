const router = require('express').Router();
const ctrl = require('../controllers/review.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/provider/:providerId', ctrl.listByProvider);
router.post('/', authenticate, authorize('customer'), ctrl.create);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
