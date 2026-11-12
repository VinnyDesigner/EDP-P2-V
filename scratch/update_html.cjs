const fs = require('fs');

let html = fs.readFileSync('public/puture-en.html', 'utf8');

const darkStyles = `
      /* ========================================================= */
      /* STRICT PERMANENT DARK LUXURY THEME - NO LIGHT THEME ALLOWED */
      /* ========================================================= */
      html,
      body,
      .page,
      .page.is-light,
      .scene__frame,
      .scene__frame.chapter--light,
      [data-chapter="work"],
      #work {
        background-color: #020b09 !important;
        color: #f0fdf4 !important;
      }

      /* Disable all white background overlays */
      .work-award:before,
      .work-award.is-in:before {
        display: none !important;
        opacity: 0 !important;
        background: transparent !important;
        visibility: hidden !important;
      }

      /* Work / Applications Section Typography in Dark Obsidian Theme */
      .work-award__title,
      .beat__title,
      .chapter--light .beat__title,
      .chapter--light .work-award__title {
        color: #ffffff !important;
        text-shadow: 0 2px 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(16, 185, 129, 0.25) !important;
      }
      .work-award__title em {
        color: #10b981 !important;
        background: linear-gradient(135deg, #34d399, #10b981);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      /* Work Award Box Luxury Styling */
      .work-award__box {
        background: rgba(3, 22, 18, 0.94) !important;
        border: 1px solid rgba(197, 160, 89, 0.45) !important;
        border-radius: 16px !important;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.15) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        color: #d1fae5 !important;
      }
      .work-award__kicker {
        color: #c5a059 !important;
        font-weight: 700 !important;
        letter-spacing: 0.08em !important;
      }
      .work-award__about {
        color: #d1fae5 !important;
      }
      .work-award__facts {
        border-top: 1px solid rgba(197, 160, 89, 0.25) !important;
      }
      .work-award__facts dt {
        color: #c5a059 !important;
        font-weight: 600 !important;
      }
      .work-award__facts dd {
        color: #ffffff !important;
        font-weight: 700 !important;
      }

      /* Section 02 Floating Badge */
      .chapter--light .label__text,
      .label__text--dark {
        background: rgba(3, 22, 18, 0.95) !important;
        color: #ffffff !important;
        border: 1px solid rgba(16, 185, 129, 0.4) !important;
      }

      /* Invert light theme header & markers */
      .is-light .site-header,
      .site-header {
        color: #f0fdf4 !important;
      }
      .is-light .site-header:before,
      .site-header:before {
        background: linear-gradient(rgba(2, 11, 9, 0.92) 40%, rgba(2, 11, 9, 0)) !important;
      }

      .chapter--light .muted {
        color: #94a3b8 !important;
      }
      .chapter--light .beat__intro {
        color: #a7f3d0 !important;
      }
      .is-light .chapter-dots__name {
        background: rgba(3, 22, 18, 0.95) !important;
        color: #ffffff !important;
      }
      .is-light .chapter-dots__mark {
        background: rgba(255, 255, 255, 0.25) !important;
      }
      .is-light .chapter-dots__item.is-active .chapter-dots__mark {
        background: #10b981 !important;
        box-shadow: 0 0 14px rgba(16, 185, 129, 0.8) !important;
      }
      .is-light .type-lines {
        color: #6ee7b7 !important;
      }
      .is-light .type-lines__line:first-child {
        color: #ffffff !important;
      }
      .is-light .route__track {
        stroke: rgba(16, 185, 129, 0.35) !important;
      }
      .is-light .route__node {
        fill: #041215 !important;
        stroke: #10b981 !important;
      }
      .is-light .route__head {
        fill: #10b981 !important;
      }
      .is-light .cursor-cta__bubble {
        color: #ffffff !important;
        background: linear-gradient(135deg, #005844, #10b981) !important;
      }
`;

// Insert inside <style>
html = html.replace('</style>', darkStyles + '\n    </style>');

// Bump cache string from v=edp-v5 to v=edp-v7
html = html.replaceAll('?v=edp-v5', '?v=edp-v7');
html = html.replaceAll('?v=edp-v6', '?v=edp-v7');

fs.writeFileSync('public/puture-en.html', html, 'utf8');
console.log('Successfully updated public/puture-en.html with strict dark styles and cache bust v=edp-v7');

