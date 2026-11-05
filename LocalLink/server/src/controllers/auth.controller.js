/* ──────────────────────────────────────────────
   Auth Controller
   ────────────────────────────────────────────── */
const authService = require('../services/auth.service');

/* POST /api/auth/register */
async function register(req, res, next) {
    try {
        const { uid, name, email, phone, role } = req.body;
        // Only allow customer or provider from client
        const safeRole = (role === 'provider') ? 'provider' : 'customer';
        const user = await authService.createUser(uid, { name, email, phone, role: safeRole });
        res.status(201).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
}

/* GET /api/auth/me */
async function getMe(req, res, next) {
    try {
        const user = await authService.getUserByUid(req.user.uid);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
}

/* PUT /api/auth/profile */
async function updateProfile(req, res, next) {
    try {
        const { name, phone } = req.body;
        const user = await authService.updateUser(req.user.uid, { name, phone });
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
}

module.exports = { register, getMe, updateProfile };
