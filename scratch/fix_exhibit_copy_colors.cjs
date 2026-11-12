const fs = require('fs');

console.log('=== Updating Exhibit Copy Typography to Light High-Contrast Colors ===');

// 1. Update public/assets/ContactDialog-BPD9mSvP.css
let css = fs.readFileSync('public/assets/ContactDialog-BPD9mSvP.css', 'utf8');

const t1 = '.exhibit-copy__summary{color:var(--grey-700)}';
const r1 = '.exhibit-copy__summary{color:#d1fae5;font-size:clamp(15px,1.15vw,18px);line-height:1.65;text-shadow:0 2px 12px rgba(0,0,0,0.9)}';

const t2 = '.exhibit-copy__meta{color:var(--grey-600);font-size:12px}';
const r2 = '.exhibit-copy__meta{color:#c5a059;font-size:12.5px;font-weight:600;letter-spacing:0.1em;text-shadow:0 0 10px rgba(197,160,89,0.3)}';

const t3 = '.exhibit-copy__link{color:var(--black);border-bottom:1px solid var(--blue);padding-bottom:2px;font-size:13px;position:relative}';
const r3 = '.exhibit-copy__link{color:#34d399;border-bottom:1.5px solid #10b981;padding-bottom:3px;font-size:13.5px;font-weight:600;letter-spacing:0.08em;position:relative;transition:all 0.25s ease}';

if (css.includes(t1)) css = css.replace(t1, r1);
if (css.includes(t2)) css = css.replace(t2, r2);
if (css.includes(t3)) css = css.replace(t3, r3);

fs.writeFileSync('public/assets/ContactDialog-BPD9mSvP.css', css, 'utf8');
console.log('Updated ContactDialog-BPD9mSvP.css directly.');

// 2. Update public/puture-en.html
let html = fs.readFileSync('public/puture-en.html', 'utf8');

const exhibitStyles = `
      /* ========================================================= */
      /* SECTION 02 (APPLICATIONS) EXHIBIT COPY LIGHT TYPOGRAPHY   */
      /* ========================================================= */
      .exhibit-copy {
        z-index: 10 !important;
      }
      .exhibit-copy__name {
        color: #ffffff !important;
        font-weight: 600 !important;
        text-shadow: 0 2px 20px rgba(0, 0, 0, 0.95), 0 0 35px rgba(16, 185, 129, 0.35) !important;
      }
      .exhibit-copy__summary {
        color: #d1fae5 !important;
        font-size: clamp(15px, 1.15vw, 18px) !important;
        line-height: 1.65 !important;
        text-shadow: 0 2px 14px rgba(0, 0, 0, 0.9) !important;
        max-width: 460px !important;
      }
      .exhibit-copy__meta {
        color: #c5a059 !important;
        font-size: 12.5px !important;
        font-weight: 600 !important;
        letter-spacing: 0.1em !important;
        text-shadow: 0 0 12px rgba(197, 160, 89, 0.4) !important;
      }
      .exhibit-copy__link {
        color: #34d399 !important;
        border-bottom: 1.5px solid #10b981 !important;
        font-size: 13.5px !important;
        font-weight: 600 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        transition: all 0.25s ease !important;
      }
      .exhibit-copy__link:hover {
        color: #ffffff !important;
        border-bottom-color: #c5a059 !important;
        transform: translateX(4px) !important;
      }
`;

html = html.replace('</style>', exhibitStyles + '\n    </style>');

// Bump cache bust to ?v=edp-v13
html = html.replaceAll('?v=edp-v12', '?v=edp-v13');
html = html.replace('/assets/ContactDialog-BPD9mSvP.css', '/assets/ContactDialog-BPD9mSvP.css?v=edp-v13');
html = html.replace('/assets/ContactDialog-BPD9mSvP.css?v=edp-v13?v=edp-v13', '/assets/ContactDialog-BPD9mSvP.css?v=edp-v13');
fs.writeFileSync('public/puture-en.html', html, 'utf8');

let home5 = fs.readFileSync('src/routes/home5.tsx', 'utf8');
home5 = home5.replaceAll('?v=edp-v12', '?v=edp-v13');
fs.writeFileSync('src/routes/home5.tsx', home5, 'utf8');

console.log('Bumped cache to ?v=edp-v13 in puture-en.html and home5.tsx');
console.log('Done!');

