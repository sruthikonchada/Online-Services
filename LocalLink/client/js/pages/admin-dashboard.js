/* ──────────────────────────────────────────────
   Admin Dashboard Page
   ────────────────────────────────────────────── */
const AdminDashboardPage = (() => {
    let activeTab = 'pending'; // pending, providers, reports, categories

    async function render() {
        await Auth.waitForAuth();

        if (!Auth.isLoggedIn()) {
            UI.showToast('Please log in as admin', 'warning');
            return Router.navigate('/login');
        }

        const profile = Auth.getProfile();
        if (profile?.role !== 'admin') {
            UI.showToast('Access denied. Admin role required.', 'error');
            return Router.navigate('/dashboard');
        }

        const app = document.getElementById('app');
        app.innerHTML = `
      <div class="dashboard-layout">
        <aside class="sidebar">
          <div class="p-6 text-center border-bottom">
            ${UI.avatarHTML('Admin', 'avatar-lg')}
            <h4 class="mt-3 mb-1" style="margin:0">${UI.escapeHTML(profile?.name || 'Administrator')}</h4>
            <div class="mt-2"><span class="badge badge-danger">Admin Panel</span></div>
          </div>
          <nav class="sidebar-nav mt-4">
            <a href="#/admin" class="${activeTab === 'pending' ? 'active' : ''}" onclick="AdminDashboardPage.switchTab('pending')">⏳ Pending Verification</a>
            <a href="#/admin" class="${activeTab === 'providers' ? 'active' : ''}" onclick="AdminDashboardPage.switchTab('providers')">🏢 All Providers</a>
            <a href="#/admin" class="${activeTab === 'reports' ? 'active' : ''}" onclick="AdminDashboardPage.switchTab('reports')">🚩 Reports Management</a>
            <a href="#/admin" class="${activeTab === 'categories' ? 'active' : ''}" onclick="AdminDashboardPage.switchTab('categories')">🏷️ Categories</a>
            <a href="#" onclick="Auth.logout()">🚪 Logout</a>
          </nav>
        </aside>

        <main class="dashboard-content">
          <div class="flex justify-between items-center mb-6">
            <h2>Admin Control Dashboard</h2>
            <button class="btn btn-secondary btn-sm" id="seedCategoriesBtn">🌱 Seed Categories</button>
          </div>

          <!-- Tab Navigation Header -->
          <div class="tabs mb-6">
            <button class="tab ${activeTab === 'pending' ? 'active' : ''}" onclick="AdminDashboardPage.switchTab('pending')">Pending Approvals</button>
            <button class="tab ${activeTab === 'providers' ? 'active' : ''}" onclick="AdminDashboardPage.switchTab('providers')">All Providers</button>
            <button class="tab ${activeTab === 'reports' ? 'active' : ''}" onclick="AdminDashboardPage.switchTab('reports')">Reports</button>
            <button class="tab ${activeTab === 'categories' ? 'active' : ''}" onclick="AdminDashboardPage.switchTab('categories')">Categories</button>
          </div>

          <div id="adminTabContent">
            <div class="skeleton" style="height:300px"></div>
          </div>

        </main>
      </div>
    `;

        document.getElementById('seedCategoriesBtn')?.addEventListener('click', async () => {
            try {
                UI.showLoading();
                await API.post('/admin/categories/seed');
                UI.hideLoading();
                UI.showToast('Categories seeded successfully!', 'success');
                if (activeTab === 'categories') loadCategoriesTab();
            } catch (e) {
                UI.hideLoading();
                UI.showToast(e.message || 'Failed to seed categories', 'error');
            }
        });

        loadCurrentTab();
    }

    function switchTab(tabName) {
        activeTab = tabName;
        document.querySelectorAll('.sidebar-nav a, .tabs .tab').forEach(el => el.classList.remove('active'));
        render();
    }

    function loadCurrentTab() {
        if (activeTab === 'pending') loadPendingTab();
        else if (activeTab === 'providers') loadAllProvidersTab();
        else if (activeTab === 'reports') loadReportsTab();
        else if (activeTab === 'categories') loadCategoriesTab();
    }

    /* ── 1. Pending Approvals Tab ──────────────── */
    async function loadPendingTab() {
        const content = document.getElementById('adminTabContent');
        if (!content) return;
        try {
            const res = await API.get('/admin/providers/pending');
            const providers = res.data || [];

            if (providers.length === 0) {
                content.innerHTML = UI.emptyStateHTML('✅', 'No Pending Providers', 'All submitted provider registrations have been reviewed.');
                return;
            }

            content.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${providers.map(p => `
                <tr>
                  <td class="fw-bold">${UI.escapeHTML(p.businessName)}</td>
                  <td>${UI.escapeHTML(p.categoryId || 'General')}</td>
                  <td>${UI.escapeHTML(p.city || '')}, ${UI.escapeHTML(p.area || '')}</td>
                  <td>${UI.escapeHTML(p.phone)}</td>
                  <td>${p.experience || 0} Yrs</td>
                  <td>${UI.statusBadge(p.verificationStatus)}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-sm btn-success" onclick="AdminDashboardPage.verifyProvider('${p.id}', 'approve')">Approve</button>
                      <button class="btn btn-sm btn-danger" onclick="AdminDashboardPage.verifyProvider('${p.id}', 'reject')">Reject</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
        } catch (e) {
            content.innerHTML = UI.emptyStateHTML('⚠️', 'Error Loading Pending Approvals', e.message);
        }
    }

    /* ── 2. All Providers Tab ─────────────────── */
    async function loadAllProvidersTab() {
        const content = document.getElementById('adminTabContent');
        if (!content) return;
        try {
            const res = await API.get('/admin/providers');
            const providers = res.data || [];

            if (providers.length === 0) {
                content.innerHTML = UI.emptyStateHTML('🏢', 'No Providers Found', 'No registered service providers in database.');
                return;
            }

            content.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${providers.map(p => `
                <tr>
                  <td class="fw-bold">${UI.escapeHTML(p.businessName)}</td>
                  <td>${UI.escapeHTML(p.categoryId || '')}</td>
                  <td>${UI.escapeHTML(p.city || '')}</td>
                  <td>${(p.averageRating || 0).toFixed(1)} ★ (${p.totalReviews || 0})</td>
                  <td>${UI.statusBadge(p.verificationStatus)}</td>
                  <td>
                    <div class="flex gap-2 flex-wrap">
                      ${p.verificationStatus !== 'verified' ? `<button class="btn btn-sm btn-success" onclick="AdminDashboardPage.verifyProvider('${p.id}', 'approve')">Approve</button>` : ''}
                      ${p.verificationStatus !== 'suspended' ? `<button class="btn btn-sm btn-warning" onclick="AdminDashboardPage.verifyProvider('${p.id}', 'suspend')">Suspend</button>` : ''}
                      ${p.verificationStatus !== 'rejected' ? `<button class="btn btn-sm btn-danger" onclick="AdminDashboardPage.verifyProvider('${p.id}', 'reject')">Reject</button>` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
        } catch (e) {
            content.innerHTML = UI.emptyStateHTML('⚠️', 'Error Loading Providers', e.message);
        }
    }

    /* ── 3. Reports Tab ────────────────────────── */
    async function loadReportsTab() {
        const content = document.getElementById('adminTabContent');
        if (!content) return;
        try {
            const res = await API.get('/admin/reports');
            const reports = res.data || [];

            if (reports.length === 0) {
                content.innerHTML = UI.emptyStateHTML('🛡️', 'No Reports', 'No reported providers in system.');
                return;
            }

            content.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Reason</th>
                <th>Description</th>
                <th>Submitted By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${reports.map(r => `
                <tr>
                  <td class="fw-bold text-danger">${UI.escapeHTML(r.reason)}</td>
                  <td>${UI.escapeHTML(r.description)}</td>
                  <td>${UI.escapeHTML(r.customerName || 'Customer')}</td>
                  <td>${UI.statusBadge(r.status)}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-sm btn-success" onclick="AdminDashboardPage.updateReportStatus('${r.id}', 'resolved')">Resolve</button>
                      <button class="btn btn-sm btn-secondary" onclick="AdminDashboardPage.updateReportStatus('${r.id}', 'dismissed')">Dismiss</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
        } catch (e) {
            content.innerHTML = UI.emptyStateHTML('⚠️', 'Error Loading Reports', e.message);
        }
    }

    /* ── 4. Categories Tab ─────────────────────── */
    async function loadCategoriesTab() {
        const content = document.getElementById('adminTabContent');
        if (!content) return;
        try {
            const res = await API.get('/categories');
            const categories = res.data || [];

            content.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <h4>Service Categories (${categories.length})</h4>
          <button class="btn btn-primary btn-sm" id="openAddCategoryModalBtn">+ Add Category</button>
        </div>
        <div class="grid grid-3">
          ${categories.map(c => `
            <div class="card p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span style="font-size:2rem">${c.icon || '🔧'}</span>
                <div>
                  <div class="fw-semibold">${UI.escapeHTML(c.name)}</div>
                  <div class="text-xs text-muted">${UI.escapeHTML(c.description || '')}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
        } catch (e) {
            content.innerHTML = UI.emptyStateHTML('⚠️', 'Error Loading Categories', e.message);
        }
    }

    /* ── Action Handlers ───────────────────────── */
    async function verifyProvider(providerId, action) {
        const confirmed = await UI.confirm(`Are you sure you want to ${action} this provider?`);
        if (!confirmed) return;
        try {
            UI.showLoading();
            await API.put(`/admin/providers/${providerId}/${action}`);
            UI.hideLoading();
            UI.showToast(`Provider status updated to ${action}d!`, 'success');
            loadCurrentTab();
        } catch (e) {
            UI.hideLoading();
            UI.showToast(e.message || 'Operation failed', 'error');
        }
    }

    async function updateReportStatus(reportId, status) {
        try {
            UI.showLoading();
            await API.put(`/admin/reports/${reportId}`, { status });
            UI.hideLoading();
            UI.showToast(`Report updated to ${status}!`, 'success');
            loadReportsTab();
        } catch (e) {
            UI.hideLoading();
            UI.showToast(e.message || 'Failed to update report', 'error');
        }
    }

    return { render, switchTab, verifyProvider, updateReportStatus };
})();
