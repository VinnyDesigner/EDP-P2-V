const fs = require('fs');

const appsData = JSON.parse(fs.readFileSync('scratch/edp_apps_data.json', 'utf8'));

const contactPanelSnippet = `
<!-- EDP APPLICATIONS & CATALOGUES DIALOG USING CONTACT EAD PANEL ARCHITECTURE & EFFECT -->
<dialog id="edp-catalog-modal" class="contact-dialog is-closed" aria-labelledby="edp-catalog-title" data-lenis-prevent="">
  <!-- Dark ambient backdrop with space layer -->
  <div class="contact-dialog__space edp-space-backdrop" onclick="window.closeEdpPanel()" aria-hidden="true"></div>

  <!-- Close button with exact Contact EAD styling -->
  <button type="button" class="contact-dialog__close mono" onclick="window.closeEdpPanel()" aria-label="Close dialog">
    <span class="menu-button__close mono" aria-hidden="true">
      <span class="menu-button__cross">&times;</span> ESC
    </span>
  </button>

  <!-- Panel with Contact Dialog scroll mask -->
  <div class="contact-dialog__panel edp-contact-style-panel" data-lenis-prevent="">
    <div class="edp-panel-inner">
      <!-- Header Section -->
      <div class="edp-panel-header">
        <div class="edp-panel-brand">
          <img src="/edplogo.svg" alt="EAD Logo" class="edp-panel-logo" />
          <div>
            <div class="mono edp-panel-kicker">ENVIRONMENT AGENCY &ndash; ABU DHABI &middot; EAD</div>
            <h2 id="edp-catalog-title" class="edp-panel-title">Environmental Applications &amp; Catalogues</h2>
            <p class="edp-panel-desc">24 Specialized Environmental Platforms &amp; 8 Biodiversity Catalogues Powering Abu Dhabi's Ecological Leadership</p>
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="edp-panel-controls">
          <div class="edp-panel-tabs mono" role="tablist">
            <button type="button" class="edp-catalog-tab is-active" data-tab="all" onclick="window.setEdpTab('all')">
              <span>All Solutions</span>
              <span class="edp-tab-pill">32</span>
            </button>
            <button type="button" class="edp-catalog-tab" data-tab="applications" onclick="window.setEdpTab('applications')">
              <span>Applications</span>
              <span class="edp-tab-pill">24</span>
            </button>
            <button type="button" class="edp-catalog-tab" data-tab="catalogues" onclick="window.setEdpTab('catalogues')">
              <span>Catalogues</span>
              <span class="edp-tab-pill">8</span>
            </button>
          </div>

          <div class="edp-panel-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="edp-catalog-search-input" placeholder="Search portals, air quality, species..." oninput="window.filterEdpCards()" />
          </div>
        </div>
      </div>

      <!-- Card Grid -->
      <div id="edp-cards-grid" class="edp-catalog-grid"></div>
    </div>
  </div>
</dialog>

<style>
/* Contact EAD Effect & Panel Styling for Applications / Catalogues */
.contact-dialog.is-open {
  display: block;
}
.contact-dialog.is-closed {
  display: none;
}
.edp-space-backdrop {
  position: absolute;
  inset: 0;
  background: radial-gradient(130% 100% at 50% 0%, rgba(3, 26, 21, 0.94) 0%, rgba(1, 10, 8, 0.97) 100%);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  z-index: 1;
}

.edp-contact-style-panel {
  position: relative;
  z-index: 2;
  overflow-y: auto;
  box-sizing: border-box;
}

.edp-panel-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 10px 20px 80px;
}

.edp-panel-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(197, 160, 89, 0.28);
  margin-bottom: 36px;
}

.edp-panel-brand {
  display: flex;
  align-items: center;
  gap: 20px;
}
.edp-panel-logo {
  height: 54px;
  width: auto;
  filter: drop-shadow(0 2px 12px rgba(16, 185, 129, 0.35));
}
.edp-panel-kicker {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #c5a059;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.edp-panel-title {
  margin: 0;
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  background: linear-gradient(135deg, #ffffff 0%, #d1fae5 45%, #c5a059 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.edp-panel-desc {
  margin: 6px 0 0 0;
  font-size: 14px;
  color: rgba(209, 250, 229, 0.75);
  max-width: 600px;
}

.edp-panel-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.edp-panel-tabs {
  display: inline-flex;
  align-items: center;
  background: rgba(3, 22, 18, 0.85);
  border: 1px solid rgba(197, 160, 89, 0.35);
  border-radius: 9999px;
  padding: 4px;
  gap: 4px;
}
.edp-catalog-tab {
  background: transparent;
  border: none;
  color: rgba(209, 250, 229, 0.75);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  padding: 7px 16px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.22s ease;
}
.edp-catalog-tab:hover {
  color: #ffffff;
  background: rgba(16, 185, 129, 0.16);
}
.edp-catalog-tab.is-active {
  background: linear-gradient(135deg, #10b981 0%, #005844 100%);
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.4);
}
.edp-tab-pill {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.35);
  color: #d1fae5;
}

.edp-panel-search {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.edp-panel-search svg {
  position: absolute;
  left: 14px;
  color: rgba(197, 160, 89, 0.8);
  pointer-events: none;
}
.edp-panel-search input {
  background: rgba(3, 22, 18, 0.85);
  border: 1px solid rgba(197, 160, 89, 0.35);
  border-radius: 9999px;
  padding: 9px 18px 9px 38px;
  color: #ffffff;
  font-family: inherit;
  font-size: 13.5px;
  width: 270px;
  outline: none;
  transition: all 0.2s ease;
}
.edp-panel-search input:focus {
  border-color: #10b981;
  box-shadow: 0 0 14px rgba(16, 185, 129, 0.4);
  width: 310px;
}
.edp-panel-search input::placeholder {
  color: rgba(209, 250, 229, 0.45);
}

/* Grid & Cards */
.edp-catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 28px;
  width: 100%;
}

.edp-catalog-card {
  display: flex;
  flex-direction: column;
  background: rgba(4, 26, 21, 0.82);
  border: 1px solid rgba(197, 160, 89, 0.28);
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.28s ease, box-shadow 0.28s ease;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.edp-catalog-card:hover {
  transform: translateY(-6px);
  border-color: rgba(16, 185, 129, 0.7);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6), 0 0 26px rgba(16, 185, 129, 0.25);
}

.edp-catalog-card__cover {
  position: relative;
  width: 100%;
  height: 195px;
  overflow: hidden;
  background: #020b09;
}
.edp-catalog-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.edp-catalog-card:hover .edp-catalog-card__img {
  transform: scale(1.04);
}
.edp-catalog-card__badges {
  position: absolute;
  top: 12px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
}
.edp-card-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
}
.edp-card-tag--platform {
  background: rgba(16, 185, 129, 0.9);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}
.edp-card-tag--ai {
  background: rgba(197, 160, 89, 0.94);
  color: #020b09;
  box-shadow: 0 2px 8px rgba(197, 160, 89, 0.35);
}
.edp-card-tag--catalogue {
  background: rgba(6, 182, 212, 0.9);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);
}

.edp-card-idx {
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 3px 8px;
  border-radius: 9999px;
  backdrop-filter: blur(6px);
}

.edp-catalog-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 22px;
}
.edp-catalog-card__names {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 8px;
}
.edp-catalog-card__name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}
.edp-catalog-card__name-ar {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #c5a059;
  direction: rtl;
  white-space: nowrap;
}
.edp-catalog-card__desc {
  margin: 0 0 20px 0;
  font-size: 13.5px;
  line-height: 1.55;
  color: rgba(209, 250, 229, 0.8);
  flex: 1;
}

.edp-catalog-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(197, 160, 89, 0.2);
  padding-top: 14px;
  margin-top: auto;
}
.edp-card-launch-btn {
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
.edp-card-launch-btn:hover {
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.5);
  transform: translateY(-1px);
}
.edp-card-gov {
  font-size: 11px;
  color: #c5a059;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

@media (max-width: 768px) {
  .edp-panel-header {
    padding-bottom: 20px;
    margin-bottom: 24px;
  }
  .edp-catalog-grid {
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

    // Contact EAD Effect: Add is-contact-open to documentElement to fade main page
    document.documentElement.classList.add('is-contact-open');
    try { modal.showModal(); } catch(e) {}
    modal.classList.remove('is-closed');
    modal.classList.add('is-open', 'is-shown', 'is-live');
    document.body.style.overflow = 'hidden';

    // Update active tab buttons
    document.querySelectorAll('.edp-catalog-tab').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tab === activeTab);
    });

    // Reset search
    const searchInput = document.getElementById('edp-catalog-search-input');
    if (searchInput) {
      searchInput.value = '';
      searchQuery = '';
    }

    renderEdpCards();
  };

  window.closeEdpPanel = function() {
    const modal = document.getElementById('edp-catalog-modal');
    if (!modal) return;

    modal.classList.remove('is-shown');
    // Remove is-contact-open to smoothly fade main page back in
    document.documentElement.classList.remove('is-contact-open');

    setTimeout(() => {
      modal.classList.remove('is-open', 'is-live');
      modal.classList.add('is-closed');
      document.body.style.overflow = '';
      try { modal.close(); } catch(e) {}
    }, 350);
  };

  window.setEdpTab = function(tab) {
    activeTab = tab;
    document.querySelectorAll('.edp-catalog-tab').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tab === activeTab);
    });
    renderEdpCards();
  };

  window.filterEdpCards = function() {
    const searchInput = document.getElementById('edp-catalog-search-input');
    searchQuery = (searchInput ? searchInput.value : '').toLowerCase().trim();
    renderEdpCards();
  };

  function renderEdpCards() {
    const grid = document.getElementById('edp-cards-grid');
    if (!grid) return;

    const filtered = EDP_APPS.filter(app => {
      if (activeTab === 'applications' && app.tab !== 'applications') return false;
      if (activeTab === 'catalogues' && app.tab !== 'catalogues') return false;

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
      const badgeClass = isAI ? 'edp-card-tag--ai' : (isCat ? 'edp-card-tag--catalogue' : 'edp-card-tag--platform');
      const badgeLabel = isAI ? '✦ CONSERVATION AI' : (isCat ? '◈ CATALOGUE' : '● PLATFORM');
      const fallbackImg = app.remoteImage || '/edp-thumbs/img-97.jpg';

      return \`
        <article class="edp-catalog-card">
          <div class="edp-catalog-card__cover">
            <img src="\${app.image}" onerror="this.onerror=null;this.src='\${fallbackImg}';" alt="\${app.name}" class="edp-catalog-card__img" loading="lazy" />
            <div class="edp-catalog-card__badges">
              <span class="edp-card-tag \${badgeClass}">\${badgeLabel}</span>
              <span class="edp-card-idx">#\${String(idx + 1).padStart(2, '0')}</span>
            </div>
          </div>
          <div class="edp-catalog-card__body">
            <div class="edp-catalog-card__names">
              <h3 class="edp-catalog-card__name">\${app.name}</h3>
              <span class="edp-catalog-card__name-ar">\${app.nameAr || ''}</span>
            </div>
            <p class="edp-catalog-card__desc">\${app.desc}</p>
            <div class="edp-catalog-card__footer">
              <span class="edp-card-gov">EAD &middot; Abu Dhabi</span>
              <a href="\${app.url}" target="_blank" rel="noopener" class="edp-card-launch-btn">
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

  // Native dialog cancel event
  const modalEl = document.getElementById('edp-catalog-modal');
  if (modalEl) {
    modalEl.addEventListener('cancel', function(e) {
      e.preventDefault();
      window.closeEdpPanel();
    });
  }
})();
</script>
`;

fs.writeFileSync('scratch/contact_style_panel.html', contactPanelSnippet);
console.log('Generated scratch/contact_style_panel.html');

