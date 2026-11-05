/* ──────────────────────────────────────────────
   Services Page
   ────────────────────────────────────────────── */
const ServicesPage = (() => {

    async function render() {
        const app = document.getElementById('app');
        app.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2>Our Services</h2>
            <p>Browse all available service categories and find the right provider</p>
          </div>
          <div class="grid grid-3" id="servicesGrid">
            <div class="skeleton" style="height:180px"></div>
            <div class="skeleton" style="height:180px"></div>
            <div class="skeleton" style="height:180px"></div>
            <div class="skeleton" style="height:180px"></div>
            <div class="skeleton" style="height:180px"></div>
            <div class="skeleton" style="height:180px"></div>
          </div>
        </div>
      </section>
    `;

        try {
            const res = await API.get('/categories');
            const grid = document.getElementById('servicesGrid');
            if (!grid) return;

            if (res.data && res.data.length > 0) {
                grid.innerHTML = res.data.map(cat => `
          <div class="card service-card" onclick="Router.navigate('/providers?categoryId=${cat.id}')">
            <div class="service-icon">${cat.icon || '🔧'}</div>
            <h4>${UI.escapeHTML(cat.name)}</h4>
            <p>${UI.escapeHTML(cat.description || '')}</p>
          </div>
        `).join('');
            } else {
                showDefaultCategories(grid);
            }
        } catch (e) {
            const grid = document.getElementById('servicesGrid');
            if (grid) showDefaultCategories(grid);
        }
    }

    function showDefaultCategories(grid) {
        const defaults = [
            { icon: '⚡', name: 'Electrician', desc: 'Electrical wiring, repairs, installations' },
            { icon: '🔧', name: 'Plumber', desc: 'Pipe fitting, leak repairs, installations' },
            { icon: '❄️', name: 'AC Technician', desc: 'AC installation, servicing, gas refill' },
            { icon: '💻', name: 'Laptop Repair', desc: 'Laptop servicing, screen & keyboard' },
            { icon: '📱', name: 'Mobile Repair', desc: 'Screen repair, battery replacement' },
            { icon: '🧹', name: 'Cleaner', desc: 'Home cleaning, deep cleaning' },
            { icon: '🪚', name: 'Carpenter', desc: 'Furniture repair, custom woodwork' },
            { icon: '🚗', name: 'Mechanic', desc: 'Vehicle servicing, repairs' },
            { icon: '🔌', name: 'Appliance Repair', desc: 'Washing machine, fridge repairs' },
            { icon: '🎨', name: 'Painter', desc: 'Interior & exterior painting' },
        ];
        grid.innerHTML = defaults.map(c => `
      <div class="card service-card" onclick="Router.navigate('/providers')">
        <div class="service-icon">${c.icon}</div>
        <h4>${c.name}</h4>
        <p>${c.desc}</p>
      </div>
    `).join('');
    }

    return { render };
})();
