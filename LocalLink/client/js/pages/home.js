/* ──────────────────────────────────────────────
   Home Page
   ────────────────────────────────────────────── */
const HomePage = (() => {

    async function render() {
        const app = document.getElementById('app');

        app.innerHTML = `
      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <h1>Find Trusted Local Services <br>Near You</h1>
          <p>Connect with verified electricians, plumbers, mechanics and more — all in your area. Quick, reliable, and just a call away.</p>
          <div class="mt-8 flex gap-4 flex-wrap">
            <a href="#/providers" class="btn btn-lg" style="background:#fff;color:var(--color-primary);font-weight:700" onclick="Router.navigate('/providers')">
              🔍 Find a Provider
            </a>
            <a href="#/register?role=provider" class="btn btn-lg btn-outline" style="border-color:#fff;color:#fff" onclick="Router.navigate('/register?role=provider')">
              🤝 Become a Provider
            </a>
          </div>
        </div>
      </section>

      <!-- How it works -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to find the right service provider</p>
          </div>
          <div class="grid grid-3">
            <div class="card service-card" style="cursor:default">
              <div class="service-icon">📍</div>
              <h4>Set Your Location</h4>
              <p>Enter your city, area or allow GPS to detect your location automatically.</p>
            </div>
            <div class="card service-card" style="cursor:default">
              <div class="service-icon">🔧</div>
              <h4>Choose a Service</h4>
              <p>Browse categories like electrician, plumber, AC technician, and more.</p>
            </div>
            <div class="card service-card" style="cursor:default">
              <div class="service-icon">📞</div>
              <h4>Contact Directly</h4>
              <p>View provider profiles, check ratings, and call them directly.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="section" style="background:var(--color-white)">
        <div class="container">
          <div class="section-header">
            <h2>Popular Services</h2>
            <p>Browse our most requested service categories</p>
          </div>
          <div class="grid grid-4" id="homeCategoriesGrid">
            <div class="skeleton" style="height:160px"></div>
            <div class="skeleton" style="height:160px"></div>
            <div class="skeleton" style="height:160px"></div>
            <div class="skeleton" style="height:160px"></div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="section">
        <div class="container">
          <div class="grid grid-4">
            <div class="stat-card text-center">
              <div class="stat-icon" style="background:var(--color-primary-light);margin:0 auto var(--space-4)">🔧</div>
              <div class="stat-value">10+</div>
              <div class="stat-label">Service Categories</div>
            </div>
            <div class="stat-card text-center">
              <div class="stat-icon" style="background:#d1fae5;margin:0 auto var(--space-4)">✓</div>
              <div class="stat-value">Verified</div>
              <div class="stat-label">Trusted Providers</div>
            </div>
            <div class="stat-card text-center">
              <div class="stat-icon" style="background:#fef3c7;margin:0 auto var(--space-4)">⭐</div>
              <div class="stat-value">Rated</div>
              <div class="stat-label">Real Customer Reviews</div>
            </div>
            <div class="stat-card text-center">
              <div class="stat-icon" style="background:#fee2e2;margin:0 auto var(--space-4)">📞</div>
              <div class="stat-value">Direct</div>
              <div class="stat-label">Call Providers Instantly</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="section" style="background:linear-gradient(135deg,#1e3a8a,#2563eb);color:#fff;text-align:center">
        <div class="container">
          <h2 style="color:#fff;margin-bottom:var(--space-4)">Are You a Service Provider?</h2>
          <p style="color:rgba(255,255,255,.8);max-width:520px;margin:0 auto var(--space-6)">
            Join LocalLink to reach customers in your area. Create your profile, get verified, and start receiving calls today.
          </p>
          <a href="#/register?role=provider" class="btn btn-lg" style="background:#fff;color:var(--color-primary)" onclick="Router.navigate('/register?role=provider')">
            Register as Provider
          </a>
        </div>
      </section>
    `;

        // Load categories
        loadCategories();
    }

    async function loadCategories() {
        try {
            const res = await API.get('/categories');
            const grid = document.getElementById('homeCategoriesGrid');
            if (!grid) return;

            if (res.data && res.data.length > 0) {
                grid.innerHTML = res.data.slice(0, 8).map(cat => `
          <div class="card service-card" onclick="Router.navigate('/providers?categoryId=${cat.id}')">
            <div class="service-icon">${cat.icon || '🔧'}</div>
            <h4>${UI.escapeHTML(cat.name)}</h4>
            <p>${UI.escapeHTML(cat.description || '')}</p>
          </div>
        `).join('');
            } else {
                grid.innerHTML = `
          <div class="card service-card" onclick="Router.navigate('/providers?categoryId=electrician')"><div class="service-icon">⚡</div><h4>Electrician</h4><p>Wiring, repairs & installations</p></div>
          <div class="card service-card" onclick="Router.navigate('/providers?categoryId=plumber')"><div class="service-icon">🔧</div><h4>Plumber</h4><p>Pipe fitting & leak repairs</p></div>
          <div class="card service-card" onclick="Router.navigate('/providers?categoryId=ac')"><div class="service-icon">❄️</div><h4>AC Technician</h4><p>AC servicing & gas refill</p></div>
          <div class="card service-card" onclick="Router.navigate('/providers?categoryId=carpenter')"><div class="service-icon">🪚</div><h4>Carpenter</h4><p>Furniture repair & woodwork</p></div>
          <div class="card service-card" onclick="Router.navigate('/providers?categoryId=laptop')"><div class="service-icon">💻</div><h4>Laptop Repair</h4><p>Screen, keyboard & software</p></div>
          <div class="card service-card" onclick="Router.navigate('/providers?categoryId=mobile')"><div class="service-icon">📱</div><h4>Mobile Repair</h4><p>Screen & battery replacement</p></div>
          <div class="card service-card" onclick="Router.navigate('/providers?categoryId=cleaner')"><div class="service-icon">🧹</div><h4>Cleaner</h4><p>Home & office cleaning</p></div>
          <div class="card service-card" onclick="Router.navigate('/providers?categoryId=painter')"><div class="service-icon">🎨</div><h4>Painter</h4><p>Interior & exterior painting</p></div>
        `;
            }
        } catch (e) {
            console.log('Categories not loaded (backend may not be running):', e.message);
            const grid = document.getElementById('homeCategoriesGrid');
            if (grid) {
                grid.innerHTML = `
          <div class="card service-card"><div class="service-icon">⚡</div><h4>Electrician</h4><p>Wiring, repairs & installations</p></div>
          <div class="card service-card"><div class="service-icon">🔧</div><h4>Plumber</h4><p>Pipe fitting & leak repairs</p></div>
          <div class="card service-card"><div class="service-icon">❄️</div><h4>AC Technician</h4><p>AC servicing & gas refill</p></div>
          <div class="card service-card"><div class="service-icon">🪚</div><h4>Carpenter</h4><p>Furniture repair & woodwork</p></div>
        `;
            }
        }
    }

    return { render };
})();
