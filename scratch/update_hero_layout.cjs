const fs = require('fs');

console.log('=== Updating Hero Title Layout, Scale, and Linear Gradient ===');

// 1. Update ContactDialog-DOlj7i4z.js (hero buttons)
let contactJs = fs.readFileSync('public/assets/ContactDialog-DOlj7i4z.js', 'utf8');

const oldGhostBtn = `(0,B.jsx)(yn,{href:\`#contact\`,variant:\`ghost\`,children:c.startProject})]})]})]})})})}`;
const newGhostBtn = `(0,B.jsx)(yn,{href:\`#process\`,variant:\`ghost\`,children:\`Environmental Catalogues\`})]})]})]})})})}`;

if (contactJs.includes(oldGhostBtn)) {
  contactJs = contactJs.replace(oldGhostBtn, newGhostBtn);
  console.log('Updated hero ghost button to "Environmental Catalogues"');
} else {
  // Let's search more loosely
  let idx = contactJs.indexOf('href:`#contact`,variant:`ghost`,children:c.startProject');
  if (idx !== -1) {
    contactJs = contactJs.replace('href:`#contact`,variant:`ghost`,children:c.startProject', 'href:`#process`,variant:`ghost`,children:`Environmental Catalogues`');
    console.log('Updated hero ghost button (loose match)');
  }
}

contactJs = contactJs.replace(/\r\n/g, '\n');
fs.writeFileSync('public/assets/ContactDialog-DOlj7i4z.js', contactJs, 'utf8');

// 2. Update puture-en.html (CSS styles for hero title, bottom-left positioning, and luxury gradient)
let html = fs.readFileSync('public/puture-en.html', 'utf8');

const heroStyles = `
      /* ========================================================= */
      /* HERO TITLE: COMPACT BOTTOM-LEFT PLACEMENT & LINEAR GRADIENT */
      /* ========================================================= */
      .hero {
        align-items: flex-end !important;
        justify-content: flex-start !important;
        min-height: 100svh !important;
        padding-bottom: clamp(36px, 6vh, 64px) !important;
        box-sizing: border-box !important;
      }

      .hero__inner {
        grid-template-columns: minmax(0, 1.4fr) minmax(0, 360px) !important;
        align-items: flex-end !important;
        gap: clamp(24px, 4vw, 48px) !important;
        padding-bottom: 0 !important;
        width: 100% !important;
        max-width: min(92vw, 1380px) !important;
        margin: 0 auto !important;
      }

      /* Bottom-left Anchor for Heading */
      .hero__heading {
        max-width: 660px !important;
        margin: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-end !important;
        z-index: 10 !important;
      }

      /* Eyebrow / Slogan */
      .hero__slogan {
        color: #c5a059 !important;
        font-size: clamp(12px, 1vw, 15px) !important;
        font-weight: 700 !important;
        letter-spacing: 0.16em !important;
        text-transform: uppercase !important;
        margin-bottom: 12px !important;
        text-shadow: 0 0 20px rgba(197, 160, 89, 0.45) !important;
        display: inline-block !important;
      }

      /* Reduced Size, Non-overlapping Multi-color Linear Gradient Title */
      .hero__title {
        font-size: clamp(32px, 3.8vw, 54px) !important;
        font-weight: 600 !important;
        line-height: 1.14 !important;
        letter-spacing: -0.03em !important;
        max-width: 15em !important;
        margin: 0 !important;
        margin-left: 0 !important;
        background: linear-gradient(135deg, #ffffff 10%, #d1fae5 45%, #34d399 78%, #c5a059 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        color: transparent !important;
        filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 30px rgba(16, 185, 129, 0.35)) !important;
      }

      /* Ensure child words and characters inherit the smooth linear gradient */
      .hero__title div,
      .hero__title span,
      .hero__title .shell__line,
      .hero__title .shell__word,
      .hero__title .shell__char,
      .hero__title [class*="line"],
      .hero__title [class*="word"],
      .hero__title [class*="char"] {
        background: inherit !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        color: transparent !important;
        max-width: 100% !important;
      }

      /* Right Side Actions */
      .hero__side {
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-end !important;
        gap: 18px !important;
        padding-bottom: 4px !important;
        z-index: 10 !important;
      }

      .hero__side p {
        color: #d1fae5 !important;
        font-size: clamp(14px, 1.05vw, 15.5px) !important;
        line-height: 1.6 !important;
        margin: 0 !important;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8) !important;
      }

      .hero__actions {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 12px !important;
      }
`;

html = html.replace('</style>', heroStyles + '\n    </style>');

// Bump cache bust to ?v=edp-v12
html = html.replaceAll('?v=edp-v11', '?v=edp-v12');
fs.writeFileSync('public/puture-en.html', html, 'utf8');

let home5 = fs.readFileSync('src/routes/home5.tsx', 'utf8');
home5 = home5.replaceAll('?v=edp-v11', '?v=edp-v12');
fs.writeFileSync('src/routes/home5.tsx', home5, 'utf8');

console.log('Bumped cache to ?v=edp-v12 across puture-en.html and home5.tsx');
console.log('Hero title layout and linear gradient applied successfully!');

