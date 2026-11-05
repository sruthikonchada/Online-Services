/* ──────────────────────────────────────────────
   Customer Dashboard Page
   ────────────────────────────────────────────── */
const CustomerDashboardPage = (() => {

    async function render() {
        await Auth.waitForAuth();

        if (!Auth.isLoggedIn()) {
            UI.showToast('Please log in to view dashboard', 'warning');
            return Router.navigate('/login');
        }

        const profile = Auth.getProfile();
        if (profile?.role === 'admin') return Router.navigate('/admin');
        if (profile?.role === 'provider') return Router.navigate('/provider/dashboard');

        const app = document.getElementById('app');
        app.innerHTML = `
      <div class="dashboard-layout">
        <aside class="sidebar">
          <div class="p-6 text-center border-bottom">
            ${UI.avatarHTML(profile?.name || 'Customer', 'avatar-lg')}
            <h4 class="mt-3 mb-1" style="margin:0">${UI.escapeHTML(profile?.name || 'Customer')}</h4>
            <p class="text-xs text-muted" style="margin:0">${UI.escapeHTML(profile?.email || '')}</p>
            <div class="mt-2"><span class="badge badge-primary">Customer Account</span></div>
          </div>
          <nav class="sidebar-nav mt-4">
            <a href="#/dashboard" class="active">📊 Overview & Search</a>
            <a href="#/providers" onclick="Router.navigate('/providers')">🔍 Find Services</a>
            <a href="#/register?role=provider" onclick="Router.navigate('/register?role=provider')">🤝 Become a Provider</a>
            <a href="#" onclick="Auth.logout()">🚪 Logout</a>
          </nav>
        </aside>

        <main class="dashboard-content">
          <div class="flex justify-between items-center mb-6">
            <h2>Customer Dashboard</h2>
            <button class="btn btn-primary" onclick="Router.navigate('/providers')">🔍 Find Local Services</button>
          </div>

          <div class="grid grid-3 mb-8">
            <div class="stat-card">
              <div class="stat-icon" style="background:var(--color-primary-light)">🔍</div>
              <div class="stat-value">Search</div>
              <div class="stat-label">Find trusted service providers near you</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#d1fae5">📞</div>
              <div class="stat-value">Direct</div>
              <div class="stat-label">Call providers directly with no fees</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#fef3c7">⭐</div>
              <div class="stat-value">Reviews</div>
              <div class="stat-label">Share feedback on services received</div>
            </div>
          </div>

          <!-- Profile Details Card -->
          <div class="card mb-8">
            <div class="card-header">Account Profile</div>
            <div class="card-body">
              <form id="customerProfileForm">
                <div class="grid grid-2">
                  <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" id="custNameInput" class="form-control" value="${UI.escapeHTML(profile?.name || '')}" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" id="custPhoneInput" class="form-control" value="${UI.escapeHTML(profile?.phone || '')}" required>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Email Address (Read-only)</label>
                  <input type="email" class="form-control" value="${UI.escapeHTML(profile?.email || '')}" disabled>
                </div>
                <button type="submit" class="btn btn-primary" id="saveCustProfileBtn">Save Profile Changes</button>
              </form>
            </div>
          </div>

          <!-- Quick Navigation Banner -->
          <div class="card p-6 text-center" style="background:linear-gradient(135deg,#eff6ff,#dbeafe)">
            <h3>Need something fixed at home?</h3>
            <p style="max-width:500px;margin:var(--space-2) auto var(--space-4)">Search electricians, plumbers, painters, cleaners and appliance repair technicians available in your city.</p>
            <button class="btn btn-primary btn-lg" onclick="Router.navigate('/providers')">Explore Local Providers</button>
          </div>
        </main>
      </div>
    `;

        document.getElementById('customerProfileForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('custNameInput').value.trim();
            const phone = document.getElementById('custPhoneInput').value.trim();
            try {
                UI.showLoading();
                await API.put('/auth/profile', { name, phone });
                UI.hideLoading();
                UI.showToast('Profile updated successfully!', 'success');
            } catch (err) {
                UI.hideLoading();
                UI.showToast(err.message || 'Failed to update profile', 'error');
            }
        });
    }

    return { render };
})();
