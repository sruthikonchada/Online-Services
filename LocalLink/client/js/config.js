/* ──────────────────────────────────────────────
   LocalLink — Frontend Configuration
   ────────────────────────────────────────────── */
const CONFIG = {
    // Backend API base URL
    API_URL: 'http://localhost:5000/api',

    // Firebase web config (public — safe to expose)
    FIREBASE: {
        apiKey: "API_KEY",
        authDomain: "locallink-923a7.firebaseapp.com",
        projectId: "locallink-923a7",
        storageBucket: "locallink-923a7.firebasestorage.app",
        messagingSenderId: "695780749482",
        appId: "1:695780749482:web:701d7dc76a4f66801de0d3"
    },

    // Google Maps API key (restricted client key)
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',

    // App constants
    DEFAULT_CITY: '',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5 MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

    REPORT_REASONS: [
        'Fake information',
        'Wrong contact',
        'Misleading service',
        'Inappropriate behavior',
        'Suspicious provider',
        'Other'
    ],

    SERVICE_AVAILABILITY: [
        { value: 'available', label: 'Available' },
        { value: 'busy', label: 'Busy' },
        { value: 'unavailable', label: 'Unavailable' }
    ]
};

// Freeze so nothing accidentally mutates it
Object.freeze(CONFIG);
Object.freeze(CONFIG.FIREBASE);
