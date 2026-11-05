/* ──────────────────────────────────────────────
   LocalLink — Client-side Router (Hash-based)
   ────────────────────────────────────────────── */
const Router = (() => {
    const routes = {};
    let notFoundHandler = null;

    function register(path, handler) {
        routes[path] = handler;
    }

    function navigate(path) {
        window.location.hash = '#' + path;
    }

    function getParams() {
        const hash = window.location.hash.slice(1) || '/';
        const qs = hash.split('?')[1] || '';
        return Object.fromEntries(new URLSearchParams(qs));
    }

    function getCurrentPath() {
        const hash = window.location.hash.slice(1) || '/';
        return hash.split('?')[0];
    }

    function resolve() {
        const path = getCurrentPath();

        // Exact match
        if (routes[path]) {
            routes[path](getParams());
            return;
        }

        // Parameterized match (e.g. /providers/:id)
        for (const [pattern, handler] of Object.entries(routes)) {
            const paramNames = [];
            const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
                paramNames.push(name);
                return '([^/]+)';
            });
            const regex = new RegExp('^' + regexStr + '$');
            const match = path.match(regex);
            if (match) {
                const params = { ...getParams() };
                paramNames.forEach((name, i) => params[name] = match[i + 1]);
                handler(params);
                return;
            }
        }

        // 404
        if (notFoundHandler) notFoundHandler();
        else document.getElementById('app').innerHTML = '<div class="empty-state"><div class="icon">🔍</div><h3>Page not found</h3><p>The page you\'re looking for doesn\'t exist.</p></div>';
    }

    function setNotFound(handler) {
        notFoundHandler = handler;
    }

    function init() {
        window.addEventListener('hashchange', resolve);
        resolve();
    }

    return { register, navigate, resolve, init, getCurrentPath, getParams, setNotFound };
})();
