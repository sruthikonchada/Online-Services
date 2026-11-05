/* ──────────────────────────────────────────────
   Auth Middleware — Verify Firebase ID Token
   ────────────────────────────────────────────── */
const { auth, db } = require('../config/firebase');

/**
 * Verifies the Firebase ID token from the Authorization header.
 * Attaches `req.user` = { uid, email, role, ... }
 */
async function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const token = header.split('Bearer ')[1];
        const decoded = await auth.verifyIdToken(token);

        // Fetch the user document from Firestore for the authoritative role
        const userDoc = await db.collection('users').doc(decoded.uid).get();
        if (!userDoc.exists) {
            return res.status(401).json({ success: false, message: 'User record not found' });
        }

        const userData = userDoc.data();
        req.user = {
            uid: decoded.uid,
            email: decoded.email,
            role: userData.role || 'customer',
            name: userData.name || '',
            phone: userData.phone || ''
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

/**
 * Role-based authorization factory.
 * Usage: authorize('admin') or authorize('admin', 'provider')
 */
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Insufficient permissions' });
        }
        next();
    };
}

module.exports = { authenticate, authorize };
