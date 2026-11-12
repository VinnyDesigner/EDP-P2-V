const fs = require('fs');

const appsData = JSON.parse(fs.readFileSync('scratch/edp_apps_data.json', 'utf8'));
console.log('Loaded apps count:', appsData.length);

// Generate panel HTML and JS
const panelHTML = `
<!-- EDP APPLICATIONS & CATALOGUES FULL-PAGE PANEL -->
<div id="edp-catalog-modal" class="edp-modal" style="display: none;" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="edp-modal-title">
  <div class="edp-modal__backdrop" onclick="window.closeEdpPanel()"></div>
  <div class="edp-modal__sheet">
    <!-- Top Header Bar -->
    <header class="edp-modal__header">
      <div class="edp-modal__brand">
        <img src="/edplogo.svg" alt="EAD Logo" class="edp-modal__logo" />
        <div>
          <h2 id="edp-modal-title" class="edp-modal__title">Environmental Applications &amp; Catalogues</h2>
          <p class="edp-modal__subtitle">Authoritative data platforms, geospatial GIS portals, AI advisory, and biodiversity registries for Abu Dhabi</p>
        </div>
      </div>

      <div class="edp-modal__controls">
        <div class="edp-modal__tabs" role="tablist">
          <button type="button" class="edp-tab-btn is-active" data-tab="all" onclick="window.setEdpTab('all')">
            <span>All Solutions</span>
            <span class="edp-tab-count">32</span>
          </button>
          <button type="button" class="edp-tab-btn" data-tab="applications" onclick="window.setEdpTab('applications')">
            <span>Applications</span>
            <span class="edp-tab-count">24</span>
          </button>
          <button type="button" class="edp-tab-btn" data-tab="catalogues" onclick="window.setEdpTab('catalogues')">
            <span>Catalogues</span>
            <span class="edp-tab-count">8</span>
          </button>
        </div>

        <div class="edp-modal__search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="edp-catalog-search" placeholder="Search portals, air quality, species..." oninput="window.filterEdpCards()" />
        </div>

        <button type="button" class="edp-modal__close-btn" onclick="window.closeEdpPanel()" aria-label="Close dialog">
          <span>✕ Close</span>
          <kbd>ESC</kbd>
        </button>
      </div>
    </header>

    <!-- Grid Container -->
    <main class="edp-modal__body">
      <div id="edp-cards-grid" class="edp-grid"></div>
    </main>
  </div>
</div>

<style>
/* EDP Full Page Modal Styles */
.edp-modal {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
}
.edp-modal.is-open {
  opacity: 1;
  pointer-events: auto;
}
.edp-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(1, 10, 8, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
.edp-modal__sheet {
  position: relative;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(130% 100% at 50% 0%, rgba(4, 32, 26, 0.98) 0%, rgba(1, 10, 8, 0.99) 100%);
  color: #ffffff;
  overflow: hidden;
  box-sizing: border-box;
}

/* Header */
.edp-modal__header {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 48px;
  background: rgba(3, 22, 18, 0.85);
  border-bottom: 1px solid rgba(197, 160, 89, 0.28);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.edp-modal__brand {
  display: flex;
  align-items: center;
  gap: 18px;
}
.edp-modal__logo {
  height: 48px;
  width: auto;
  filter: drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3));
}
.edp-modal__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, #ffffff 0%, #d1fae5 50%, #c5a059 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.edp-modal__subtitle {
  margin: 3px 0 0 0;
  font-size: 13px;
  color: rgba(209, 250, 229, 0.7);
}

.edp-modal__controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* Filter Tabs */
.edp-modal__tabs {
  display: inline-flex;
  align-items: center;
  background: rgba(2, 16, 13, 0.8);
  border: 1px solid rgba(197, 160, 89, 0.3);
  border-radius: 9999px;
  padding: 4px;
  gap: 4px;
}
.edp-tab-btn {
  background: transparent;
  border: none;
  color: rgba(209, 250, 229, 0.75);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}
.edp-tab-btn:hover {
  color: #ffffff;
  background: rgba(16, 185, 129, 0.15);
}
.edp-tab-btn.is-active {
  background: linear-gradient(135deg, #10b981 0%, #005844 100%);
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.4);
}
.edp-tab-count {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.3);
  color: #d1fae5;
}

/* Search Box */
.edp-modal__search {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.edp-modal__search svg {
  position: absolute;
  left: 12px;
  color: rgba(197, 160, 89, 0.8);
  pointer-events: none;
}
.edp-modal__search input {
  background: rgba(2, 16, 13, 0.8);
  border: 1px solid rgba(197, 160, 89, 0.3);
  border-radius: 9999px;
  padding: 8px 16px 8px 36px;
  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  width: 260px;
  outline: none;
  transition: all 0.2s ease;
}
.edp-modal__search input:focus {
  border-color: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.35);
  width: 300px;
}
.edp-modal__search input::placeholder {
  color: rgba(209, 250, 229, 0.45);
}

/* Close Button */
.edp-modal__close-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(3, 24, 20, 0.8);
  border: 1px solid rgba(197, 160, 89, 0.4);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 9999px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.edp-modal__close-btn:hover {
  background: rgba(16, 185, 129, 0.25);
  border-color: #10b981;
  box-shadow: 0 0 14px rgba(16, 185, 129, 0.3);
}
.edp-modal__close-btn kbd {
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.12);
  color: #d1fae5;
}

/* Body / Grid */
.edp-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 36px 48px 80px;
  box-sizing: border-box;
}
.edp-modal__body::-webkit-scrollbar {
  width: 8px;
}
.edp-modal__body::-webkit-scrollbar-track {
  background: rgba(1, 10, 8, 0.5);
}
.edp-modal__body::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3);
  border-radius: 4px;
}
.edp-modal__body::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.6);
}

.edp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 28px;
  width: 100%;
}

/* Card Styling */
.edp-card {
  display: flex;
  flex-direction: column;
  background: rgba(6, 28, 23, 0.78);
  border: 1px solid rgba(197, 160, 89, 0.26);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.edp-card:hover {
  transform: translateY(-6px);
  border-color: rgba(16, 185, 129, 0.65);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.55), 0 0 24px rgba(16, 185, 129, 0.22);
}

.edp-card__cover {
  position: relative;
  width: 100%;
  height: 195px;
  overflow: hidden;
  background: #020b09;
}
.edp-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.edp-card:hover .edp-card__img {
  transform: scale(1.04);
}
.edp-card__badge-row {
  position: absolute;
  top: 12px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
}
.edp-card__badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
}
.edp-card__badge--platform {
  background: rgba(16, 185, 129, 0.88);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}
.edp-card__badge--ai {
  background: rgba(197, 160, 89, 0.92);
  color: #020b09;
  box-shadow: 0 2px 8px rgba(197, 160, 89, 0.35);
}
.edp-card__badge--catalogue {
  background: rgba(6, 182, 212, 0.88);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);
}

.edp-card__idx {
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 3px 8px;
  border-radius: 9999px;
  backdrop-filter: blur(6px);
}

.edp-card__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px 22px;
}
.edp-card__names {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 8px;
}
.edp-card__name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}
.edp-card__name-ar {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #c5a059;
  direction: rtl;
  white-space: nowrap;
}
.edp-card__desc {
  margin: 0 0 18px 0;
  font-size: 13.5px;
  line-height: 1.55;
  color: rgba(209, 250, 229, 0.8);
  flex: 1;
}

.edp-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(197, 160, 89, 0.18);
  padding-top: 14px;
  margin-top: auto;
}
.edp-card__launch-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #10b981 0%, #005844 100%);
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 700;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 9999px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}
.edp-card__launch-btn:hover {
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.5);
  transform: translateY(-1px);
}
.edp-card__tag {
  font-size: 11px;
  color: #c5a059;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}

@media (max-width: 768px) {
  .edp-modal__header {
    padding: 16px 20px;
  }
  .edp-modal__body {
    padding: 20px 20px 60px;
  }
  .edp-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>

<script>
(function() {
  const EDP_APPS = ${JSON.stringify(appsData)};

  let activeTab = 'all';
  let searchQuery = '';

  window.openEdpPanel = function(tab) {
    activeTab = tab || 'all';
    const modal = document.getElementById('edp-catalog-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.style.overflow = 'hidden';

    // Update active tab buttons
    document.querySelectorAll('.edp-tab-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tab === activeTab);
    });

    // Clear search
    const searchInput = document.getElementById('edp-catalog-search');
    if (searchInput) {
      searchInput.value = '';
      searchQuery = '';
      searchInput.focus();
    }

    renderEdpCards();
  };

  window.closeEdpPanel = function() {
    const modal = document.getElementById('edp-catalog-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 280);
  };

  window.setEdpTab = function(tab) {
    activeTab = tab;
    document.querySelectorAll('.edp-tab-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tab === activeTab);
    });
    renderEdpCards();
  };

  window.filterEdpCards = function() {
    const searchInput = document.getElementById('edp-catalog-search');
    searchQuery = (searchInput ? searchInput.value : '').toLowerCase().trim();
    renderEdpCards();
  };

  function renderEdpCards() {
    const grid = document.getElementById('edp-cards-grid');
    if (!grid) return;

    const filtered = EDP_APPS.filter(app => {
      // Tab filter
      if (activeTab === 'applications' && app.tab !== 'applications') return false;
      if (activeTab === 'catalogues' && app.tab !== 'catalogues') return false;

      // Search filter
      if (searchQuery) {
        const text = (app.name + ' ' + (app.nameAr || '') + ' ' + (app.desc || '') + ' ' + (app.group || '')).toLowerCase();
        if (!text.includes(searchQuery)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = \`
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: rgba(209, 250, 229, 0.6);">
          <p style="font-size: 18px; font-weight: 600; color: #ffffff;">No environmental platforms match "\${searchQuery}"</p>
          <p style="font-size: 14px;">Try searching for "Air Quality", "Biodiversity", "Groundwater", or "Chatbot"</p>
        </div>
      \`;
      return;
    }

    grid.innerHTML = filtered.map((app, idx) => {
      const isAI = app.group === 'ai';
      const isCat = app.tab === 'catalogues';
      const badgeClass = isAI ? 'edp-card__badge--ai' : (isCat ? 'edp-card__badge--catalogue' : 'edp-card__badge--platform');
      const badgeLabel = isAI ? '✦ CONSERVATION AI' : (isCat ? '◈ CATALOGUE' : '● PLATFORM');
      const fallbackImg = app.remoteImage || '/edp-thumbs/img-97.jpg';

      return \`
        <article class="edp-card">
          <div class="edp-card__cover">
            <img src="\${app.image}" onerror="this.onerror=null;this.src='\${fallbackImg}';" alt="\${app.name}" class="edp-card__img" loading="lazy" />
            <div class="edp-card__badge-row">
              <span class="edp-card__badge \${badgeClass}">\${badgeLabel}</span>
              <span class="edp-card__idx">#\${String(idx + 1).padStart(2, '0')}</span>
            </div>
          </div>
          <div class="edp-card__content">
            <div class="edp-card__names">
              <h3 class="edp-card__name">\${app.name}</h3>
              <span class="edp-card__name-ar">\${app.nameAr || ''}</span>
            </div>
            <p class="edp-card__desc">\${app.desc}</p>
            <div class="edp-card__footer">
              <span class="edp-card__tag">EAD · Abu Dhabi</span>
              <a href="\${app.url}" target="_blank" rel="noopener" class="edp-card__launch-btn">
                <span>Launch Portal</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
        </article>
      \`;
    }).join('');
  }

  // Keyboard shortcut ESC to close
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeEdpPanel();
    }
  });

  // Global trigger listener
  window.addEventListener('message', function(ev) {
    if (ev.data && ev.data.type === 'OPEN_EDP_PANEL') {
      window.openEdpPanel(ev.data.tab || 'all');
    }
  });
})();
</script>
`;

fs.writeFileSync('scratch/panel_snippet.html', panelHTML);
console.log('Successfully generated panel_snippet.html');

