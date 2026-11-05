const router = require('express').Router();
const ctrl = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', authenticate, authorize('admin'), ctrl.create);
router.put('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
