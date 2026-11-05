/* ──────────────────────────────────────────────
   LocalLink — Auth Module
   Firebase Authentication wrapper
   ────────────────────────────────────────────── */
const Auth = (() => {
    let currentUser = null;
    let userProfile = null;
    let authReady = false;
    const listeners = [];

    /* ── Initialize Firebase Auth listener ─────── */
    function init() {
        firebase.auth().onAuthStateChanged(async (user) => {
            currentUser = user;
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const res = await API.request('/auth/me', { token });
                    userProfile = res.data;
                } catch (e) {
                    console.error('Failed to fetch profile:', e);
                    userProfile = null;
                }
            } else {
                userProfile = null;
            }
            authReady = true;
            listeners.forEach(fn => fn(currentUser, userProfile));
            updateNavUI();
        });
    }

    /* ── Register ────────────────────────────────── */
    async function register(email, password, name, phone, role = 'customer') {
        const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName: name });

        // Create user doc in Firestore via backend
        await API.request('/auth/register', {
            method: 'POST',
            body: {
                uid: cred.user.uid,
                name,
                email,
                phone,
                role
            }
        });
        return cred.user;
    }

    /* ── Login ──────────────────────────────────── */
    async function login(email, password) {
        const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
        return cred.user;
    }

    /* ── Logout ─────────────────────────────────── */
    async function logout() {
        await firebase.auth().signOut();
        currentUser = null;
        userProfile = null;
        Router.navigate('/');
    }

    /* ── Password reset ─────────────────────────── */
    async function resetPassword(email) {
        await firebase.auth().sendPasswordResetEmail(email);
    }

    /* ── Get ID Token ───────────────────────────── */
    async function getToken() {
        if (!currentUser) return null;
        return currentUser.getIdToken();
    }

    /* ── Getters ────────────────────────────────── */
    function getUser() { return currentUser; }
    function getProfile() { return userProfile; }
    function isReady() { return authReady; }
    function isLoggedIn() { return !!currentUser; }
    function getRole() { return userProfile?.role || null; }

    function isAdmin() { return getRole() === 'admin'; }
    function isProvider() { return getRole() === 'provider'; }
    function isCustomer() { return getRole() === 'customer'; }

    /* ── Auth state subscriber ──────────────────── */
    function onAuthChange(fn) {
        listeners.push(fn);
        if (authReady) fn(currentUser, userProfile);
    }

    /* ── Update nav UI based on auth state ──────── */
    function updateNavUI() {
        const navActions = document.getElementById('navActions');
        const navLinks = document.getElementById('navLinks');
        if (!navActions) return;

        if (currentUser && userProfile) {
            const dashPath = userProfile.role === 'admin' ? '/admin' :
                userProfile.role === 'provider' ? '/provider/dashboard' :
                    '/dashboard';

            navActions.innerHTML = `
        <a href="#${dashPath}" class="btn btn-secondary btn-sm" onclick="Router.navigate('${dashPath}')">Dashboard</a>
        <button class="btn btn-primary btn-sm" onclick="Auth.logout()">Logout</button>
      `;

            // Show/hide nav links based on role
            if (navLinks) {
                const adminLink = navLinks.querySelector('[data-role="admin"]');
                if (adminLink) adminLink.style.display = userProfile.role === 'admin' ? '' : 'none';
            }
        } else {
            navActions.innerHTML = `
        <a href="#/login" class="btn btn-secondary btn-sm" onclick="Router.navigate('/login')">Login</a>
        <a href="#/register" class="btn btn-primary btn-sm" onclick="Router.navigate('/register')">Register</a>
      `;
        }
    }

    /* ── Wait for auth to be ready ──────────────── */
    function waitForAuth() {
        return new Promise(resolve => {
            if (authReady) return resolve();
            const check = () => {
                if (authReady) { resolve(); return; }
                setTimeout(check, 50);
            };
            check();
        });
    }

    return {
        init, register, login, logout, resetPassword, getToken,
        getUser, getProfile, isReady, isLoggedIn, getRole,
        isAdmin, isProvider, isCustomer, onAuthChange,
        updateNavUI, waitForAuth
    };
})();
