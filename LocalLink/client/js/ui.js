/* ──────────────────────────────────────────────
   LocalLink — UI Utility Helpers
   ────────────────────────────────────────────── */
const UI = (() => {

    /* ── Toast notifications ────────────────────── */
    function showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    /* ── Loading overlay ────────────────────────── */
    function showLoading() {
        let overlay = document.querySelector('.loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
    }

    function hideLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    /* ── Stars HTML ─────────────────────────────── */
    function starsHTML(rating, size = '') {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;
        let html = '<span class="stars ' + size + '">';
        for (let i = 0; i < full; i++)  html += '★';
        if (half) html += '★';
        for (let i = 0; i < empty; i++) html += '<span class="empty">★</span>';
        html += '</span>';
        return html;
    }

    /* ── Time ago ───────────────────────────────── */
    function timeAgo(date) {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date._seconds ? date._seconds * 1000 : date);
        const diff = Math.floor((Date.now() - d.getTime()) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
        return d.toLocaleDateString();
    }

    /* ── Badge HTML by status ───────────────────── */
    function statusBadge(status) {
        const map = {
            verified: { cls: 'badge-success', label: '✓ Verified' },
            pending: { cls: 'badge-warning', label: '⏳ Pending' },
            rejected: { cls: 'badge-danger', label: '✗ Rejected' },
            suspended: { cls: 'badge-danger', label: '⛔ Suspended' },
            open: { cls: 'badge-warning', label: 'Open' },
            under_review: { cls: 'badge-info', label: 'Under Review' },
            resolved: { cls: 'badge-success', label: 'Resolved' },
            dismissed: { cls: 'badge-gray', label: 'Dismissed' },
            available: { cls: 'badge-success', label: 'Available' },
            busy: { cls: 'badge-warning', label: 'Busy' },
            unavailable: { cls: 'badge-gray', label: 'Unavailable' }
        };
        const s = map[status] || { cls: 'badge-gray', label: status };
        return `<span class="badge ${s.cls}">${s.label}</span>`;
    }

    /* ── Avatar initials ────────────────────────── */
    function avatarHTML(name, size = '') {
        const initials = (name || '?').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        return `<div class="avatar ${size}">${initials}</div>`;
    }

    /* ── Provider card HTML ─────────────────────── */
    function providerCardHTML(p) {
        const imgSrc = p.profileImage
            ? (p.profileImage.startsWith('http') ? p.profileImage : CONFIG.API_URL.replace('/api', '') + p.profileImage)
            : '';
        const imgHTML = imgSrc
            ? `<img src="${imgSrc}" alt="${p.businessName}" class="card-img" onerror="this.parentElement.innerHTML='<div class=\\'card-img\\' style=\\'display:flex;align-items:center;justify-content:center;font-size:3rem;color:var(--color-gray-400);background:var(--color-gray-100)\\'>🏢</div>'">`
            : `<div class="card-img" style="display:flex;align-items:center;justify-content:center;font-size:3rem;color:var(--color-gray-400);background:var(--color-gray-100)">🏢</div>`;
        return `
      <div class="card provider-card" onclick="Router.navigate('/providers/${p.id || p.providerId}')">
        ${imgHTML}
        <div class="card-body">
          <div class="provider-name">${escapeHTML(p.businessName)}</div>
          <div class="provider-category">${escapeHTML(p._categoryName || '')}</div>
          <div class="provider-location">📍 ${escapeHTML(p.area || '')}${p.area && p.city ? ', ' : ''}${escapeHTML(p.city || '')}</div>
          <div class="provider-meta">
            <div>${starsHTML(p.averageRating || 0)} <span class="text-sm text-muted">(${p.totalReviews || 0})</span></div>
            <div class="provider-price">${p.startingPrice ? '₹' + p.startingPrice : ''}</div>
          </div>
          ${p.verificationStatus === 'verified' ? '<div class="mt-2"><span class="badge badge-success">✓ Verified</span></div>' : ''}
        </div>
      </div>
    `;
    }

    /* ── Escape HTML ────────────────────────────── */
    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /* ── Confirm dialog ─────────────────────────── */
    function confirm(message) {
        return new Promise(resolve => {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop active';
            backdrop.innerHTML = `
        <div class="modal">
          <div class="modal-header"><h3>Confirm</h3></div>
          <div class="modal-body"><p>${message}</p></div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="confirmNo">Cancel</button>
            <button class="btn btn-primary" id="confirmYes">Confirm</button>
          </div>
        </div>
      `;
            document.body.appendChild(backdrop);
            backdrop.querySelector('#confirmYes').onclick = () => { backdrop.remove(); resolve(true); };
            backdrop.querySelector('#confirmNo').onclick = () => { backdrop.remove(); resolve(false); };
        });
    }

    /* ── Form validation helper ─────────────────── */
    function validateForm(formEl) {
        let valid = true;
        formEl.querySelectorAll('[required]').forEach(input => {
            const err = input.parentElement.querySelector('.form-error');
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                if (err) err.textContent = 'This field is required';
                valid = false;
            } else {
                input.classList.remove('is-invalid');
                if (err) err.textContent = '';
            }
        });
        return valid;
    }

    /* ── Empty state HTML ───────────────────────── */
    function emptyStateHTML(icon, title, message) {
        return `
      <div class="empty-state">
        <div class="icon">${icon}</div>
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
    `;
    }

    return {
        showToast, showLoading, hideLoading,
        starsHTML, timeAgo, statusBadge, avatarHTML,
        providerCardHTML, escapeHTML, confirm, validateForm,
        emptyStateHTML
    };
})();
