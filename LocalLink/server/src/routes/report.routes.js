const router = require('express').Router();
const ctrl = require('../controllers/report.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.post('/', authenticate, authorize('customer'), ctrl.create);

module.exports = router;
