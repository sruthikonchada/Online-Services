/* ──────────────────────────────────────────────
   LocalLink — API Module
   HTTP client for Express backend
   ────────────────────────────────────────────── */
const API = (() => {

    /**
     * Make an authenticated API request.
     * @param {string} path  - e.g. '/providers'
     * @param {object} opts  - { method, body, token, params }
     */
    async function request(path, opts = {}) {
        const { method = 'GET', body, token, params } = opts;

        let url = `${CONFIG.API_URL}${path}`;

        // Append query params
        if (params && Object.keys(params).length) {
            const qs = new URLSearchParams();
            Object.entries(params).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== '') qs.append(k, v);
            });
            url += `?${qs.toString()}`;
        }

        const headers = { 'Content-Type': 'application/json' };

        // Auto-attach token
        let authToken = token;
        if (!authToken && Auth.isLoggedIn()) {
            authToken = await Auth.getToken();
        }
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const fetchOpts = { method, headers };
        if (body && method !== 'GET') fetchOpts.body = JSON.stringify(body);

        const res = await fetch(url, fetchOpts);
        const data = await res.json();

        if (!res.ok) {
            const err = new Error(data.message || 'Request failed');
            err.status = res.status;
            err.data = data;
            throw err;
        }
        return data;
    }

    /**
     * Upload a file via multipart/form-data.
     */
    async function upload(path, formData) {
        let url = `${CONFIG.API_URL}${path}`;
        const headers = {};
        const token = await Auth.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: formData  // browser sets Content-Type with boundary
        });
        const data = await res.json();
        if (!res.ok) {
            const err = new Error(data.message || 'Upload failed');
            err.status = res.status;
            throw err;
        }
        return data;
    }

    /* ── Convenience wrappers ───────────────────── */
    const get = (path, params) => request(path, { params });
    const post = (path, body) => request(path, { method: 'POST', body });
    const put = (path, body) => request(path, { method: 'PUT', body });
    const del = (path) => request(path, { method: 'DELETE' });

    return { request, upload, get, post, put, del };
})();
