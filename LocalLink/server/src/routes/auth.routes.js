const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/register', ctrl.register);
router.get('/me', authenticate, ctrl.getMe);
router.put('/profile', authenticate, ctrl.updateProfile);

module.exports = router;
