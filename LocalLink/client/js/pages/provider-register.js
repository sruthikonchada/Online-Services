/* ──────────────────────────────────────────────
   Provider Registration / Profile Creation Page
   ────────────────────────────────────────────── */
const ProviderRegisterPage = (() => {

    async function render() {
        await Auth.waitForAuth();

        if (!Auth.isLoggedIn()) {
            UI.showToast('Please register/login first', 'warning');
            return Router.navigate('/register?role=provider');
        }

        const app = document.getElementById('app');
        app.innerHTML = `
      <section class="section" style="padding-top:var(--space-8)">
        <div class="container" style="max-width:720px">
          <div class="card">
            <div class="card-header">
              <h3>Complete Provider Profile</h3>
              <p class="text-sm text-muted" style="margin:0">Set up your business listing on LocalLink to start receiving service requests.</p>
            </div>
            <div class="card-body">
              <form id="providerRegForm">
                
                <div class="form-group">
                  <label class="form-label">Business / Shop / Professional Name</label>
                  <input type="text" id="pBusName" class="form-control" placeholder="e.g. Apex Electrical Services" required>
                </div>

                <div class="grid grid-2">
                  <div class="form-group">
                    <label class="form-label">Primary Service Category</label>
                    <select id="pCategory" class="form-control form-select" required>
                      <option value="">Select Category</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Contact Phone Number</label>
                    <input type="tel" id="pPhone" class="form-control" placeholder="+91 9876543210" required>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Business Description</label>
                  <textarea id="pDesc" class="form-control" placeholder="Describe your expertise, work experience, tools used, and guarantee..." required></textarea>
                </div>

                <div class="grid grid-2">
                  <div class="form-group">
                    <label class="form-label">Experience (Years)</label>
                    <input type="number" id="pExp" class="form-control" placeholder="e.g. 5" min="0" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Starting Price (₹)</label>
                    <input type="number" id="pPrice" class="form-control" placeholder="e.g. 299" min="0" required>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Specific Services (Comma separated)</label>
                  <input type="text" id="pServices" class="form-control" placeholder="e.g. Wiring, Switchboard Repair, Fan Installation">
                  <div class="form-text">List individual services you offer.</div>
                </div>

                <div class="grid grid-3">
                  <div class="form-group">
                    <label class="form-label">City</label>
                    <input type="text" id="pCity" class="form-control" placeholder="e.g. Mumbai" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Area / Locality</label>
                    <input type="text" id="pArea" class="form-control" placeholder="e.g. Andheri West" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Pincode</label>
                    <input type="text" id="pPincode" class="form-control" placeholder="e.g. 400053" required>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Service Areas Covered (Comma separated)</label>
                  <input type="text" id="pServiceAreas" class="form-control" placeholder="e.g. Andheri, Juhu, Bandra, Goregaon">
                </div>

                <button type="submit" class="btn btn-primary btn-lg" style="width:100%" id="submitProvRegBtn">
                  Submit Profile for Verification
                </button>

              </form>
            </div>
          </div>
        </div>
      </section>
    `;

        loadCategoriesSelect();

        document.getElementById('providerRegForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitProvRegBtn');
            btn.disabled = true;
            btn.textContent = 'Submitting...';

            const data = {
                businessName: document.getElementById('pBusName').value.trim(),
                categoryId: document.getElementById('pCategory').value,
                phone: document.getElementById('pPhone').value.trim(),
                description: document.getElementById('pDesc').value.trim(),
                experience: parseInt(document.getElementById('pExp').value) || 0,
                startingPrice: parseFloat(document.getElementById('pPrice').value) || 0,
                services: document.getElementById('pServices').value.split(',').map(s => s.trim()).filter(Boolean),
                city: document.getElementById('pCity').value.trim(),
                area: document.getElementById('pArea').value.trim(),
                pincode: document.getElementById('pPincode').value.trim(),
                serviceAreas: document.getElementById('pServiceAreas').value.split(',').map(a => a.trim()).filter(Boolean),
                availability: 'available'
            };

            try {
                UI.showLoading();
                await API.post('/providers', data);
                UI.hideLoading();
                UI.showToast('Provider profile created! Verification pending.', 'success');
                Router.navigate('/provider/dashboard');
            } catch (err) {
                UI.hideLoading();
                btn.disabled = false;
                btn.textContent = 'Submit Profile for Verification';
                UI.showToast(err.message || 'Failed to create provider profile', 'error');
            }
        });
    }

    async function loadCategoriesSelect() {
        try {
            const res = await API.get('/categories');
            const sel = document.getElementById('pCategory');
            if (sel && res.data) {
                sel.innerHTML = '<option value="">Select Category</option>' +
                    res.data.map(c => `<option value="${c.id}">${UI.escapeHTML(c.name)}</option>`).join('');
            }
        } catch (e) { }
    }

    return { render };
})();
