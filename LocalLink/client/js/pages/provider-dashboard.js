/* ──────────────────────────────────────────────
   Provider Dashboard Page
   ────────────────────────────────────────────── */
const ProviderDashboardPage = (() => {
    let providerProfile = null;

    async function render() {
        await Auth.waitForAuth();

        if (!Auth.isLoggedIn()) {
            UI.showToast('Please log in to access dashboard', 'warning');
            return Router.navigate('/login');
        }

        const app = document.getElementById('app');
        app.innerHTML = `
      <div class="dashboard-layout">
        <aside class="sidebar">
          <div class="p-6 text-center border-bottom">
            <div id="sidebarAvatar">${UI.avatarHTML('P', 'avatar-lg')}</div>
            <h4 class="mt-3 mb-1" id="sidebarBusName" style="margin:0">Loading...</h4>
            <p class="text-xs text-muted" id="sidebarCategory" style="margin:0"></p>
            <div class="mt-2" id="sidebarStatusBadge"><span class="badge badge-warning">Checking...</span></div>
          </div>
          <nav class="sidebar-nav mt-4">
            <a href="#/provider/dashboard" class="active">📊 Provider Dashboard</a>
            <a href="#/providers" onclick="Router.navigate('/providers')">🔍 View Public Listings</a>
            <a href="#" onclick="Auth.logout()">🚪 Logout</a>
          </nav>
        </aside>

        <main class="dashboard-content">
          <div class="flex justify-between items-center mb-6">
            <h2>Provider Dashboard</h2>
            <div id="availabilityToggleArea"></div>
          </div>

          <!-- Status Banner -->
          <div id="verificationBanner"></div>

          <!-- Dashboard Stats Grid -->
          <div class="grid grid-4 mb-8">
            <div class="stat-card">
              <div class="stat-icon" style="background:var(--color-primary-light)">⭐</div>
              <div class="stat-value" id="statRating">0.0</div>
              <div class="stat-label">Average Rating</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#d1fae5">💬</div>
              <div class="stat-value" id="statReviews">0</div>
              <div class="stat-label">Total Reviews</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#fef3c7">💼</div>
              <div class="stat-value" id="statExperience">0 Yrs</div>
              <div class="stat-label">Experience</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#fee2e2">🏷️</div>
              <div class="stat-value" id="statPrice">₹0</div>
              <div class="stat-label">Starting Price</div>
            </div>
          </div>

          <div class="grid grid-2 mb-8" style="align-items:start">
            
            <!-- Edit Profile Card -->
            <div class="card">
              <div class="card-header">Business Details</div>
              <div class="card-body">
                <form id="editProviderForm">
                  <div class="form-group">
                    <label class="form-label">Business Name</label>
                    <input type="text" id="editBusName" class="form-control" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Phone Number (Public Contact)</label>
                    <input type="tel" id="editPhone" class="form-control" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea id="editDesc" class="form-control" rows="4" required></textarea>
                  </div>

                  <div class="grid grid-2">
                    <div class="form-group">
                      <label class="form-label">Experience (Years)</label>
                      <input type="number" id="editExp" class="form-control" required min="0">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Starting Price (₹)</label>
                      <input type="number" id="editPrice" class="form-control" required min="0">
                    </div>
                  </div>

                  <div class="grid grid-3">
                    <div class="form-group">
                      <label class="form-label">City</label>
                      <input type="text" id="editCity" class="form-control" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Area</label>
                      <input type="text" id="editArea" class="form-control" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Pincode</label>
                      <input type="text" id="editPincode" class="form-control" required>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Specific Services (Comma separated)</label>
                    <input type="text" id="editServices" class="form-control">
                  </div>

                  <div class="form-group">
                    <label class="form-label">Service Areas (Comma separated)</label>
                    <input type="text" id="editServiceAreas" class="form-control">
                  </div>

                  <button type="submit" class="btn btn-primary" id="saveProviderBtn">Save Changes</button>
                </form>
              </div>
            </div>

            <!-- Profile Image & Reviews Received -->
            <div>
              <div class="card mb-6">
                <div class="card-header">Profile Image</div>
                <div class="card-body text-center">
                  <div id="profileImgContainer" style="width:140px;height:140px;margin:0 auto var(--space-4);border-radius:var(--radius-xl);background:var(--color-gray-100);display:flex;align-items:center;justify-content:center;font-size:4rem;overflow:hidden">
                    🏢
                  </div>
                  <input type="file" id="imageUploadInput" accept="image/*" style="display:none">
                  <button class="btn btn-secondary btn-sm" onclick="document.getElementById('imageUploadInput').click()">
                    📷 Upload New Photo
                  </button>
                  <p class="text-xs text-muted mt-2">JPEG, PNG, WebP up to 5MB.</p>
                </div>
              </div>

              <!-- Reviews List -->
              <div class="card">
                <div class="card-header">Customer Reviews Received</div>
                <div class="card-body" style="padding:0" id="providerReviewsContainer">
                  <div class="p-6 text-center text-muted">Loading reviews...</div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    `;

        await loadProviderDashboard();
    }

    async function loadProviderDashboard() {
        try {
            const res = await API.get('/providers/me');
            providerProfile = res.data;

            if (!providerProfile) {
                // No provider profile created yet
                return Router.navigate('/provider/register');
            }

            // Populate sidebar
            document.getElementById('sidebarBusName').textContent = providerProfile.businessName || 'My Business';
            document.getElementById('sidebarStatusBadge').innerHTML = UI.statusBadge(providerProfile.verificationStatus);
            if (providerProfile.profileImage) {
                const src = providerProfile.profileImage.startsWith('http') ? providerProfile.profileImage : CONFIG.API_URL.replace('/api', '') + providerProfile.profileImage;
                document.getElementById('sidebarAvatar').innerHTML = `<img src="${src}" style="width:80px;height:80px;border-radius:50%;object-fit:cover">`;
                document.getElementById('profileImgContainer').innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover">`;
            } else {
                document.getElementById('sidebarAvatar').innerHTML = UI.avatarHTML(providerProfile.businessName, 'avatar-lg');
            }

            // Render verification status banner
            const banner = document.getElementById('verificationBanner');
            if (providerProfile.verificationStatus === 'pending') {
                banner.innerHTML = `
          <div class="alert alert-warning mb-6">
            <span style="font-size:1.5rem">⏳</span>
            <div>
              <strong>Verification Pending</strong>
              <div>Your profile has been submitted and is currently being reviewed by our administration team. It will appear in public search results once approved.</div>
            </div>
          </div>
        `;
            } else if (providerProfile.verificationStatus === 'verified') {
                banner.innerHTML = `
          <div class="alert alert-success mb-6">
            <span style="font-size:1.5rem">✓</span>
            <div>
              <strong>Verified Provider</strong>
              <div>Your profile is active and publicly visible to customers in your area!</div>
            </div>
          </div>
        `;
            } else if (providerProfile.verificationStatus === 'rejected') {
                banner.innerHTML = `
          <div class="alert alert-danger mb-6">
            <span style="font-size:1.5rem">✗</span>
            <div>
              <strong>Verification Rejected</strong>
              <div>Your provider registration was not approved. Please update your details and contact support.</div>
            </div>
          </div>
        `;
            } else if (providerProfile.verificationStatus === 'suspended') {
                banner.innerHTML = `
          <div class="alert alert-danger mb-6">
            <span style="font-size:1.5rem">⛔</span>
            <div>
              <strong>Account Suspended</strong>
              <div>Your provider profile is currently suspended from public discovery.</div>
            </div>
          </div>
        `;
            }

            // Populate stats
            document.getElementById('statRating').textContent = (providerProfile.averageRating || 0).toFixed(1) + ' ★';
            document.getElementById('statReviews').textContent = providerProfile.totalReviews || 0;
            document.getElementById('statExperience').textContent = (providerProfile.experience || 0) + ' Yrs';
            document.getElementById('statPrice').textContent = '₹' + (providerProfile.startingPrice || 0);

            // Populate form
            document.getElementById('editBusName').value = providerProfile.businessName || '';
            document.getElementById('editPhone').value = providerProfile.phone || '';
            document.getElementById('editDesc').value = providerProfile.description || '';
            document.getElementById('editExp').value = providerProfile.experience || 0;
            document.getElementById('editPrice').value = providerProfile.startingPrice || 0;
            document.getElementById('editCity').value = providerProfile.city || '';
            document.getElementById('editArea').value = providerProfile.area || '';
            document.getElementById('editPincode').value = providerProfile.pincode || '';
            document.getElementById('editServices').value = (providerProfile.services || []).join(', ');
            document.getElementById('editServiceAreas').value = (providerProfile.serviceAreas || []).join(', ');

            // Availability toggle UI
            renderAvailabilityToggle();

            // Load reviews
            loadProviderReviews(providerProfile.id);

            attachEvents();
        } catch (e) {
            console.error('Error loading provider dashboard:', e);
            if (e.status === 404) {
                Router.navigate('/provider/register');
            } else {
                UI.showToast(e.message || 'Failed to load provider profile', 'error');
            }
        }
    }

    function renderAvailabilityToggle() {
        const area = document.getElementById('availabilityToggleArea');
        if (!area || !providerProfile) return;

        area.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">Status:</span>
        <select id="availabilitySelect" class="form-control form-select" style="width:150px">
          <option value="available" ${providerProfile.availability === 'available' ? 'selected' : ''}>🟢 Available</option>
          <option value="busy" ${providerProfile.availability === 'busy' ? 'selected' : ''}>🟡 Busy</option>
          <option value="unavailable" ${providerProfile.availability === 'unavailable' ? 'selected' : ''}>🔴 Unavailable</option>
        </select>
      </div>
    `;

        document.getElementById('availabilitySelect')?.addEventListener('change', async (e) => {
            const val = e.target.value;
            try {
                await API.put(`/providers/${providerProfile.id}`, { availability: val });
                providerProfile.availability = val;
                UI.showToast(`Status updated to ${val}`, 'success');
            } catch (err) {
                UI.showToast(err.message || 'Failed to update status', 'error');
            }
        });
    }

    async function loadProviderReviews(providerId) {
        const container = document.getElementById('providerReviewsContainer');
        if (!container) return;
        try {
            const res = await API.get(`/reviews/provider/${providerId}`);
            const reviews = res.data || [];

            if (reviews.length === 0) {
                container.innerHTML = '<div class="p-6 text-center text-muted">No customer reviews received yet.</div>';
                return;
            }

            container.innerHTML = reviews.map(r => `
        <div class="review-item">
          <div class="review-header">
            ${UI.avatarHTML(r.customerName)}
            <div>
              <div class="review-author">${UI.escapeHTML(r.customerName || 'Anonymous Customer')}</div>
              <div class="review-date">${UI.timeAgo(r.createdAt)}</div>
            </div>
            <div style="margin-left:auto">${UI.starsHTML(r.rating || 5)}</div>
          </div>
          <div class="review-comment">${UI.escapeHTML(r.comment)}</div>
        </div>
      `).join('');
        } catch (e) {
            container.innerHTML = '<div class="p-6 text-center text-muted">Unable to load reviews.</div>';
        }
    }

    function attachEvents() {
        // Form submit
        document.getElementById('editProviderForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                businessName: document.getElementById('editBusName').value.trim(),
                phone: document.getElementById('editPhone').value.trim(),
                description: document.getElementById('editDesc').value.trim(),
                experience: parseInt(document.getElementById('editExp').value) || 0,
                startingPrice: parseFloat(document.getElementById('editPrice').value) || 0,
                city: document.getElementById('editCity').value.trim(),
                area: document.getElementById('editArea').value.trim(),
                pincode: document.getElementById('editPincode').value.trim(),
                services: document.getElementById('editServices').value.split(',').map(s => s.trim()).filter(Boolean),
                serviceAreas: document.getElementById('editServiceAreas').value.split(',').map(a => a.trim()).filter(Boolean)
            };

            try {
                UI.showLoading();
                await API.put(`/providers/${providerProfile.id}`, data);
                UI.hideLoading();
                UI.showToast('Provider profile updated successfully!', 'success');
                loadProviderDashboard();
            } catch (err) {
                UI.hideLoading();
                UI.showToast(err.message || 'Failed to update profile', 'error');
            }
        });

        // Image Upload
        document.getElementById('imageUploadInput')?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > CONFIG.MAX_FILE_SIZE) {
                return UI.showToast('File size exceeds 5MB limit', 'error');
            }

            const formData = new FormData();
            formData.append('image', file);

            try {
                UI.showLoading();
                const res = await API.upload(`/providers/${providerProfile.id}/image`, formData);
                UI.hideLoading();
                UI.showToast('Profile image updated!', 'success');
                loadProviderDashboard();
            } catch (err) {
                UI.hideLoading();
                UI.showToast(err.message || 'Failed to upload image', 'error');
            }
        });
    }

    return { render };
})();
