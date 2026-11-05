/* ──────────────────────────────────────────────
   Provider Profile Page
   ────────────────────────────────────────────── */
const ProviderProfilePage = (() => {
    let providerData = null;

    async function render(params) {
        const app = document.getElementById('app');
        const providerId = params.id;

        if (!providerId) {
            return Router.navigate('/providers');
        }

        app.innerHTML = `
      <section class="section" style="padding-top:var(--space-8)">
        <div class="container">
          <div id="profileContent">
            <div class="skeleton" style="height:300px;margin-bottom:var(--space-6)"></div>
            <div class="skeleton" style="height:200px"></div>
          </div>
        </div>
      </section>

      <!-- Review Modal -->
      <div class="modal-backdrop" id="reviewModal">
        <div class="modal">
          <div class="modal-header">
            <h3>Write a Review</h3>
            <button class="modal-close" onclick="document.getElementById('reviewModal').classList.remove('active')">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Rating (1 to 5 Stars)</label>
              <select id="reviewRatingSelect" class="form-control form-select">
                <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                <option value="3">⭐⭐⭐ (3 - Average)</option>
                <option value="2">⭐⭐ (2 - Poor)</option>
                <option value="1">⭐ (1 - Terrible)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Your Review / Feedback</label>
              <textarea id="reviewCommentInput" class="form-control" placeholder="Share your experience working with this provider..." required></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('reviewModal').classList.remove('active')">Cancel</button>
            <button class="btn btn-primary" id="submitReviewBtn">Submit Review</button>
          </div>
        </div>
      </div>

      <!-- Report Modal -->
      <div class="modal-backdrop" id="reportModal">
        <div class="modal">
          <div class="modal-header">
            <h3>Report Provider</h3>
            <button class="modal-close" onclick="document.getElementById('reportModal').classList.remove('active')">&times;</button>
          </div>
          <div class="modal-body">
            <p class="text-sm text-muted mb-4">Report suspicious behavior, incorrect phone details, or inappropriate service.</p>
            <div class="form-group">
              <label class="form-label">Reason for Report</label>
              <select id="reportReasonSelect" class="form-control form-select">
                ${CONFIG.REPORT_REASONS.map(r => `<option value="${r}">${r}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Detailed Description</label>
              <textarea id="reportDescInput" class="form-control" placeholder="Explain the issue in detail..." required></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('reportModal').classList.remove('active')">Cancel</button>
            <button class="btn btn-danger" id="submitReportBtn">Submit Report</button>
          </div>
        </div>
      </div>
    `;

        await loadProviderProfile(providerId);
    }

    async function loadProviderProfile(providerId) {
        const container = document.getElementById('profileContent');
        if (!container) return;

        try {
            const res = await API.get(`/providers/${providerId}`);
            providerData = res.data;

            if (!providerData) {
                container.innerHTML = UI.emptyStateHTML('❓', 'Provider Not Found', 'The requested provider profile does not exist.');
                return;
            }

            // Fetch category if needed
            let categoryName = '';
            if (providerData.categoryId) {
                try {
                    const catRes = await API.get(`/categories/${providerData.categoryId}`);
                    if (catRes.data) categoryName = catRes.data.name;
                } catch (e) { }
            }

            // Fetch reviews
            let reviews = [];
            try {
                const revRes = await API.get(`/reviews/provider/${providerId}`);
                reviews = revRes.data || [];
            } catch (e) { }

            const isVerified = providerData.verificationStatus === 'verified';
            const imgSrc = providerData.profileImage
                ? (providerData.profileImage.startsWith('http') ? providerData.profileImage : CONFIG.API_URL.replace('/api', '') + providerData.profileImage)
                : '';

            const phoneNum = providerData.phone ? providerData.phone.replace(/[^0-9+]/g, '') : '';

            container.innerHTML = `
        <!-- Top Profile Banner Card -->
        <div class="card mb-8">
          <div class="card-body">
            <div class="flex gap-6 items-center flex-wrap">
              <div style="width:120px;height:120px;border-radius:var(--radius-xl);background:var(--color-gray-100);display:flex;align-items:center;justify-content:center;font-size:3.5rem;overflow:hidden">
                ${imgSrc ? `<img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover">` : '🏢'}
              </div>
              <div style="flex:1;min-width:280px">
                <div class="flex items-center gap-3 flex-wrap">
                  <h2 style="margin:0">${UI.escapeHTML(providerData.businessName)}</h2>
                  ${UI.statusBadge(providerData.verificationStatus)}
                  <span class="badge ${providerData.availability === 'available' ? 'badge-success' : 'badge-warning'}">${providerData.availability || 'Available'}</span>
                </div>
                <p class="text-primary fw-medium mt-1 mb-2" style="font-size:1.1rem">${UI.escapeHTML(categoryName)}</p>
                <div class="flex items-center gap-4 flex-wrap text-sm text-muted">
                  <span>📍 ${UI.escapeHTML(providerData.area || '')}${providerData.area && providerData.city ? ', ' : ''}${UI.escapeHTML(providerData.city || '')} ${providerData.pincode ? `(${providerData.pincode})` : ''}</span>
                  <span>💼 ${providerData.experience || 0} Years Experience</span>
                  <span>🏷️ Starting Price: <strong>₹${providerData.startingPrice || 0}</strong></span>
                </div>
                <div class="mt-3 flex items-center gap-2">
                  ${UI.starsHTML(providerData.averageRating || 0, 'text-lg')}
                  <span class="fw-bold">${providerData.averageRating || 0}</span>
                  <span class="text-muted text-sm">(${providerData.totalReviews || 0} customer review${providerData.totalReviews === 1 ? '' : 's'})</span>
                </div>
              </div>

              <!-- Direct Contact Action Box -->
              <div class="flex flex-col gap-3" style="min-width:200px">
                ${phoneNum ? `
                  <a href="tel:${phoneNum}" class="btn btn-primary btn-lg" style="width:100%;font-size:1.1rem">
                    📞 Call Provider Directly
                  </a>
                  <div class="text-center text-xs text-muted">Phone: ${UI.escapeHTML(providerData.phone)}</div>
                ` : `
                  <button class="btn btn-secondary btn-lg" disabled style="width:100%">No Phone Available</button>
                `}
                <div class="flex gap-2">
                  <button class="btn btn-secondary btn-sm" style="flex:1" id="openReviewBtn">⭐ Write Review</button>
                  <button class="btn btn-outline btn-sm" style="flex:1" id="openReportBtn">🚩 Report</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-3" style="align-items:start">
          <!-- Main Details -->
          <div style="grid-column: span 2">
            
            <!-- Business Description -->
            <div class="card mb-6">
              <div class="card-header">About Business</div>
              <div class="card-body">
                <p style="white-space:pre-line">${UI.escapeHTML(providerData.description || 'No detailed description provided.')}</p>
              </div>
            </div>

            <!-- Specific Services & Areas -->
            <div class="card mb-6">
              <div class="card-header">Services & Coverage</div>
              <div class="card-body">
                <h5 class="mb-2">Services Provided</h5>
                <div class="flex flex-wrap gap-2 mb-6">
                  ${(providerData.services && providerData.services.length) ? providerData.services.map(s => `<span class="badge badge-gray">${UI.escapeHTML(s)}</span>`).join('') : '<span class="text-muted text-sm">General service provider</span>'}
                </div>

                <h5 class="mb-2">Service Areas Covered</h5>
                <div class="flex flex-wrap gap-2">
                  ${(providerData.serviceAreas && providerData.serviceAreas.length) ? providerData.serviceAreas.map(a => `<span class="badge badge-info">📍 ${UI.escapeHTML(a)}</span>`).join('') : '<span class="text-muted text-sm">Citywide service</span>'}
                </div>
              </div>
            </div>

            <!-- Reviews Section -->
            <div class="card">
              <div class="card-header flex justify-between items-center">
                <span>Customer Reviews (${reviews.length})</span>
                <button class="btn btn-sm btn-primary" id="openReviewBtn2">⭐ Add Review</button>
              </div>
              <div class="card-body" style="padding:0">
                ${reviews.length === 0 ? `
                  <div class="p-6 text-center text-muted">
                    <p>No reviews yet for this provider. Be the first to leave a review!</p>
                  </div>
                ` : reviews.map(r => `
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
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Sidebar Info -->
          <div>
            <div class="card mb-6">
              <div class="card-header">Trust & Verification</div>
              <div class="card-body">
                <div class="mb-4">
                  <div class="fw-semibold text-sm mb-1">Status</div>
                  <div>${UI.statusBadge(providerData.verificationStatus)}</div>
                </div>
                <div class="mb-4">
                  <div class="fw-semibold text-sm mb-1">Direct Interaction</div>
                  <div class="text-xs text-muted">No online booking or prepayment required. Call directly to agree on timing and price.</div>
                </div>
                <div>
                  <div class="fw-semibold text-sm mb-1">Response & Availability</div>
                  <div class="text-sm">${providerData.availability === 'available' ? '🟢 Currently Available' : '🟡 Busy / Call to schedule'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

            attachProfileEvents(providerId);

        } catch (e) {
            console.error('Error loading provider profile:', e);
            container.innerHTML = UI.emptyStateHTML('⚠️', 'Error Loading Profile', e.message || 'Failed to fetch provider details.');
        }
    }

    function attachProfileEvents(providerId) {
        const openRev = () => {
            if (!Auth.isLoggedIn()) {
                UI.showToast('Please log in to submit a review', 'warning');
                return Router.navigate('/login');
            }
            document.getElementById('reviewModal').classList.add('active');
        };

        document.getElementById('openReviewBtn')?.addEventListener('click', openRev);
        document.getElementById('openReviewBtn2')?.addEventListener('click', openRev);

        document.getElementById('openReportBtn')?.addEventListener('click', () => {
            if (!Auth.isLoggedIn()) {
                UI.showToast('Please log in to report a provider', 'warning');
                return Router.navigate('/login');
            }
            document.getElementById('reportModal').classList.add('active');
        });

        // Review Submit
        document.getElementById('submitReviewBtn')?.addEventListener('click', async () => {
            const rating = document.getElementById('reviewRatingSelect').value;
            const comment = document.getElementById('reviewCommentInput').value.trim();

            if (!comment) return UI.showToast('Please enter a review comment', 'error');

            try {
                UI.showLoading();
                await API.post('/reviews', { providerId, rating, comment });
                UI.hideLoading();
                UI.showToast('Review submitted successfully!', 'success');
                document.getElementById('reviewModal').classList.remove('active');
                loadProviderProfile(providerId);
            } catch (e) {
                UI.hideLoading();
                UI.showToast(e.message || 'Failed to submit review', 'error');
            }
        });

        // Report Submit
        document.getElementById('submitReportBtn')?.addEventListener('click', async () => {
            const reason = document.getElementById('reportReasonSelect').value;
            const description = document.getElementById('reportDescInput').value.trim();

            if (!description) return UI.showToast('Please describe the reason for your report', 'error');

            try {
                UI.showLoading();
                await API.post('/reports', { providerId, reason, description });
                UI.hideLoading();
                UI.showToast('Report submitted. Admin will review this provider.', 'success');
                document.getElementById('reportModal').classList.remove('active');
            } catch (e) {
                UI.hideLoading();
                UI.showToast(e.message || 'Failed to submit report', 'error');
            }
        });
    }

    return { render };
})();
