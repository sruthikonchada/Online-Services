const router = require('express').Router();
const ctrl = require('../controllers/provider.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

router.get('/', ctrl.list);
router.get('/search', ctrl.search);
router.get('/me', authenticate, authorize('provider'), ctrl.getMyProvider);
router.get('/:id', ctrl.getById);
router.post('/', authenticate, authorize('provider'), ctrl.create);
router.put('/:id', authenticate, authorize('provider'), ctrl.update);
router.post('/:id/image', authenticate, authorize('provider'), upload.single('image'), ctrl.uploadImage);

module.exports = router;
