/* ──────────────────────────────────────────────
   LocalLink — App Initialization
   ────────────────────────────────────────────── */
(function () {
    // Initialize Firebase
    firebase.initializeApp(CONFIG.FIREBASE);

    // Initialize Auth
    Auth.init();

    // Mobile hamburger toggle
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Close mobile nav on link click
    if (navLinks) {
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') navLinks.classList.remove('open');
        });
    }

    /* ── Route Registration ──────────────────────── */
    Router.register('/', HomePage.render);
    Router.register('/services', ServicesPage.render);
    Router.register('/login', LoginPage.render);
    Router.register('/register', RegisterPage.render);
    Router.register('/providers', ProvidersPage.render);
    Router.register('/providers/:id', ProviderProfilePage.render);
    Router.register('/dashboard', CustomerDashboardPage.render);
    Router.register('/provider/register', ProviderRegisterPage.render);
    Router.register('/provider/dashboard', ProviderDashboardPage.render);
    Router.register('/admin', AdminDashboardPage.render);

    // Initialize router
    Router.init();

    // Active nav link highlight on navigation
    window.addEventListener('hashchange', updateActiveNavLink);
    updateActiveNavLink();

    function updateActiveNavLink() {
        const path = Router.getCurrentPath();
        document.querySelectorAll('#navLinks a').forEach(a => {
            const href = a.getAttribute('href')?.replace('#', '') || '';
            a.classList.toggle('active', href === path);
        });
    }
})();
