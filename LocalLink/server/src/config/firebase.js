/* ──────────────────────────────────────────────
   Firebase Admin SDK Configuration
   ────────────────────────────────────────────── */
const admin = require('firebase-admin');

const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

let db, auth, storage;

try {
    if (!admin.apps.length) {
        if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey
                }),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET
            });
            console.log('✓ Firebase Admin SDK initialized with credentials');
        } else {
            console.warn('⚠️ Firebase credentials missing in .env — Running in development mode with fallback/mock Firestore.');
            // Initialize with default application credentials or application default if available
            try {
                admin.initializeApp({ projectId: 'locallink-dev' });
            } catch (e) {
                // App already exists or demo app
            }
        }
    }

    db = admin.firestore();
    auth = admin.auth();
    storage = admin.storage();

} catch (err) {
    console.warn('⚠️ Firebase initialization warning:', err.message);
    db = admin.firestore ? admin.firestore() : null;
    auth = admin.auth ? admin.auth() : null;
    storage = admin.storage ? admin.storage() : null;
}

module.exports = { admin, db, auth, storage };

