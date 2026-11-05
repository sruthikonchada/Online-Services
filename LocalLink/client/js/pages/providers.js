/* ──────────────────────────────────────────────
   Providers Listing & Search Page
   ────────────────────────────────────────────── */
const ProvidersPage = (() => {
    let allCategories = [];
    let userLocation = null;

    async function render(params = {}) {
        const app = document.getElementById('app');

        app.innerHTML = `
      <section class="section" style="padding-top:var(--space-8)">
        <div class="container">
          <div class="section-header" style="margin-bottom:var(--space-8);text-align:left">
            <h2>Find Local Service Providers</h2>
            <p>Discover verified professionals near you</p>
          </div>

          <!-- Location Bar & Geolocation -->
          <div class="card p-4 mb-6" style="background:var(--color-primary-50);border-color:var(--color-primary-light)">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-3" style="flex:1;min-width:280px">
                <span style="font-size:1.5rem">📍</span>
                <div style="flex:1">
                  <div class="fw-semibold text-sm">Location Search</div>
                  <div class="flex gap-2 mt-1">
                    <input type="text" id="locCityInput" class="form-control form-control-sm" placeholder="City (e.g. Mumbai)" style="padding:4px 8px;font-size:0.875rem">
                    <input type="text" id="locAreaInput" class="form-control form-control-sm" placeholder="Area / Pincode" style="padding:4px 8px;font-size:0.875rem">
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-secondary btn-sm" id="geoLocBtn">
                  🎯 Detect My Location
                </button>
                <button class="btn btn-primary btn-sm" id="searchLocBtn">
                  Search Location
                </button>
              </div>
            </div>
            <div id="geoStatus" class="text-xs text-muted mt-2"></div>
          </div>

          <div class="grid" style="grid-template-columns: 280px 1fr; gap: var(--space-8)">
            
            <!-- Filters Sidebar -->
            <aside class="filter-panel">
              <div class="flex justify-between items-center mb-4">
                <h4 style="margin:0">Filters</h4>
                <button class="btn btn-sm btn-secondary" id="resetFiltersBtn">Reset</button>
              </div>

              <!-- Category -->
              <div class="filter-group">
                <label class="form-label">Category</label>
                <select id="filterCategory" class="form-control form-select">
                  <option value="">All Categories</option>
                </select>
              </div>

              <!-- Rating -->
              <div class="filter-group">
                <label class="form-label">Minimum Rating</label>
                <select id="filterRating" class="form-control form-select">
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5★ & above</option>
                  <option value="4.0">4.0★ & above</option>
                  <option value="3.5">3.5★ & above</option>
                  <option value="3.0">3.0★ & above</option>
                </select>
              </div>

              <!-- Max Starting Price -->
              <div class="filter-group">
                <label class="form-label">Max Starting Price (₹)</label>
                <input type="number" id="filterMaxPrice" class="form-control" placeholder="e.g. 500">
              </div>

              <!-- Min Experience -->
              <div class="filter-group">
                <label class="form-label">Min Experience (Years)</label>
                <input type="number" id="filterExperience" class="form-control" placeholder="e.g. 2">
              </div>

              <!-- Verified Only -->
              <div class="filter-group">
                <label class="flex items-center gap-2" style="cursor:pointer;font-size:0.875rem">
                  <input type="checkbox" id="filterVerifiedOnly" checked>
                  Verified Providers Only
                </label>
              </div>

              <!-- Sort By -->
              <div class="filter-group">
                <label class="form-label">Sort By</label>
                <select id="filterSort" class="form-control form-select">
                  <option value="">Default</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price">Lowest Starting Price</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>

              <button class="btn btn-primary" style="width:100%" id="applyFiltersBtn">Apply Filters</button>
            </aside>

            <!-- Main Results Area -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <div class="text-sm text-muted" id="resultsCount">Loading providers...</div>
                <div class="flex gap-2">
                  <button class="btn btn-sm btn-secondary" id="viewGridBtn" style="background:var(--color-primary-light);color:var(--color-primary)">Grid View</button>
                  <button class="btn btn-sm btn-secondary" id="viewMapBtn">Map View</button>
                </div>
              </div>

              <!-- Map Container (Hidden by default) -->
              <div id="mapContainer" class="card mb-6 hidden" style="height:350px;background:#e2e8f0;display:none;align-items:center;justify-content:center">
                <div class="text-center p-6" id="mapContent">
                  <div style="font-size:2.5rem;margin-bottom:var(--space-2)">🗺️</div>
                  <h4>Interactive Location Map</h4>
                  <p class="text-sm text-muted">Providers mapped near your location. Add your Google Maps API key in <code>config.js</code> to enable live maps.</p>
                  <div id="mapMarkersList" class="mt-4 flex flex-wrap gap-2 justify-center"></div>
                </div>
              </div>

              <!-- Grid Results -->
              <div class="grid grid-3" id="providersGrid">
                <div class="skeleton" style="height:260px"></div>
                <div class="skeleton" style="height:260px"></div>
                <div class="skeleton" style="height:260px"></div>
              </div>
            </div>

          </div>
        </div>
      </section>
    `;

        await loadCategoriesSelect(params.categoryId);
        attachEvents(params);
        loadProviders(params);
    }

    async function loadCategoriesSelect(selectedId) {
        try {
            const res = await API.get('/categories');
            allCategories = res.data || [];
            const sel = document.getElementById('filterCategory');
            if (sel) {
                sel.innerHTML = '<option value="">All Categories</option>' +
                    allCategories.map(c => `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${UI.escapeHTML(c.name)}</option>`).join('');
            }
        } catch (e) {
            console.log('Categories load error:', e.message);
        }
    }

    function attachEvents(initialParams) {
        document.getElementById('applyFiltersBtn')?.addEventListener('click', () => fetchFilteredProviders());
        document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
            document.getElementById('filterCategory').value = '';
            document.getElementById('filterRating').value = '';
            document.getElementById('filterMaxPrice').value = '';
            document.getElementById('filterExperience').value = '';
            document.getElementById('filterSort').value = '';
            document.getElementById('locCityInput').value = '';
            document.getElementById('locAreaInput').value = '';
            document.getElementById('filterVerifiedOnly').checked = true;
            userLocation = null;
            document.getElementById('geoStatus').textContent = '';
            fetchFilteredProviders();
        });

        document.getElementById('searchLocBtn')?.addEventListener('click', () => fetchFilteredProviders());

        // Geolocation API
        document.getElementById('geoLocBtn')?.addEventListener('click', () => {
            const status = document.getElementById('geoStatus');
            if (!navigator.geolocation) {
                if (status) status.textContent = 'Geolocation is not supported by your browser.';
                return;
            }
            if (status) status.textContent = 'Locating...';
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    userLocation = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    };
                    if (status) status.textContent = `✓ Location detected: Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`;
                    fetchFilteredProviders();
                },
                (err) => {
                    let msg = 'Unable to retrieve location.';
                    if (err.code === err.PERMISSION_DENIED) msg = 'Location permission denied by user. Enter city manually.';
                    else if (err.code === err.POSITION_UNAVAILABLE) msg = 'Location information unavailable.';
                    else if (err.code === err.TIMEOUT) msg = 'Location request timed out.';
                    if (status) status.textContent = msg;
                },
                { timeout: 10000, maximumAge: 60000 }
            );
        });

        // Toggle View
        const gridViewBtn = document.getElementById('viewGridBtn');
        const mapViewBtn = document.getElementById('viewMapBtn');
        const mapContainer = document.getElementById('mapContainer');
        const providersGrid = document.getElementById('providersGrid');

        gridViewBtn?.addEventListener('click', () => {
            mapContainer.style.display = 'none';
            providersGrid.style.display = 'grid';
            gridViewBtn.style.background = 'var(--color-primary-light)';
            gridViewBtn.style.color = 'var(--color-primary)';
            mapViewBtn.style.background = 'var(--color-white)';
            mapViewBtn.style.color = 'var(--color-gray-700)';
        });

        mapViewBtn?.addEventListener('click', () => {
            mapContainer.style.display = 'flex';
            providersGrid.style.display = 'none';
            mapViewBtn.style.background = 'var(--color-primary-light)';
            mapViewBtn.style.color = 'var(--color-primary)';
            gridViewBtn.style.background = 'var(--color-white)';
            gridViewBtn.style.color = 'var(--color-gray-700)';
        });
    }

    function getFilterQuery() {
        const categoryId = document.getElementById('filterCategory')?.value || '';
        const minRating = document.getElementById('filterRating')?.value || '';
        const maxPrice = document.getElementById('filterMaxPrice')?.value || '';
        const minExperience = document.getElementById('filterExperience')?.value || '';
        const verified = document.getElementById('filterVerifiedOnly')?.checked ? 'true' : 'false';
        const sortBy = document.getElementById('filterSort')?.value || '';
        const city = document.getElementById('locCityInput')?.value.trim() || '';
        const area = document.getElementById('locAreaInput')?.value.trim() || '';

        const query = { categoryId, minRating, maxPrice, minExperience, verified, sortBy, city, area };
        if (userLocation) {
            query.latitude = userLocation.latitude;
            query.longitude = userLocation.longitude;
            query.maxDistance = 50; // 50km
        }
        return query;
    }

    async function loadProviders(initialParams) {
        if (initialParams.categoryId && document.getElementById('filterCategory')) {
            document.getElementById('filterCategory').value = initialParams.categoryId;
        }
        fetchFilteredProviders();
    }

    async function fetchFilteredProviders() {
        const grid = document.getElementById('providersGrid');
        const countEl = document.getElementById('resultsCount');
        if (!grid) return;

        grid.innerHTML = '<div class="skeleton" style="height:260px"></div><div class="skeleton" style="height:260px"></div>';

        try {
            const params = getFilterQuery();
            const res = await API.get('/providers/search', params);
            const providers = res.data || [];

            if (countEl) countEl.textContent = `Found ${providers.length} provider${providers.length === 1 ? '' : 's'}`;

            if (providers.length === 0) {
                grid.innerHTML = UI.emptyStateHTML('🔍', 'No providers found', 'Try adjusting your location or filter options.');
                renderMapMarkers([]);
                return;
            }

            // Map category name to providers
            providers.forEach(p => {
                const cat = allCategories.find(c => c.id === p.categoryId);
                if (cat) p._categoryName = cat.name;
            });

            grid.innerHTML = providers.map(p => UI.providerCardHTML(p)).join('');
            renderMapMarkers(providers);
        } catch (e) {
            console.error('Fetch providers error:', e);
            if (countEl) countEl.textContent = 'Error loading providers';
            grid.innerHTML = UI.emptyStateHTML('⚠️', 'Unable to load providers', e.message || 'Please check backend connectivity.');
        }
    }

    function renderMapMarkers(providers) {
        const list = document.getElementById('mapMarkersList');
        if (!list) return;
        if (!providers.length) {
            list.innerHTML = '<span class="text-muted text-sm">No map markers to display</span>';
            return;
        }
        list.innerHTML = providers.map(p => `
      <span class="badge badge-primary" style="cursor:pointer" onclick="Router.navigate('/providers/${p.id}')">
        📍 ${UI.escapeHTML(p.businessName)} (${p.city || 'Local'})
      </span>
    `).join('');
    }

    return { render };
})();
