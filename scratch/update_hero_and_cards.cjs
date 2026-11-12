const fs = require('fs');

console.log('--- Updating EDP Hero Title, Headings and Card Styles ---');

// 1. Update navigation-DiPJwl4U.js
let navJs = fs.readFileSync('public/assets/navigation-DiPJwl4U.js', 'utf8');

// Replace hero section content
const oldHeroRegex = /hero:\{slogan:x\([^)]+\),title:`[^`]+`,lede:x\([^)]+\)\}/;
const newHeroStr = `hero:{slogan:x(\`بوابتكم نحو الرؤى البيئية\`,\`Your Gateway to Environmental Insights\`),title:\`Unlock Environmental Insights,\\nfor a Sustainable Future.\`,lede:x(\`بوابة البيانات البيئية (EDP) لهيئة البيئة – أبوظبي: فتح آفاق البيانات البيئية لمستقبل مستدام. شبكات رصد فوري، بيانات مكانية معتمدة، وتطبيقات ذكاء اصطناعي عبر إمارة أبوظبي.\`,\`Unlock environmental insights for a sustainable future. Real-time telemetry, authoritative spatial data, and AI-powered conservation platforms across Abu Dhabi.\`)}`;

if (oldHeroRegex.test(navJs)) {
  navJs = navJs.replace(oldHeroRegex, newHeroStr);
  console.log('Successfully updated hero section in navigation-DiPJwl4U.js');
} else {
  console.warn('Hero regex did not match in navigation-DiPJwl4U.js!');
}

// Replace seeWork button label in common
if (navJs.includes("seeWork:x(`작업 보기`,`See our work`)")) {
  navJs = navJs.replace("seeWork:x(`작업 보기`,`See our work`)", "seeWork:x(`استكشف المنصات`,`Explore Platforms`)");
  console.log('Updated seeWork button label');
}

// Make all process steps dark tone
navJs = navJs.replaceAll("tone:`light`", "tone:`dark`");

fs.writeFileSync('public/assets/navigation-DiPJwl4U.js', navJs, 'utf8');
console.log('Saved navigation-DiPJwl4U.js');

// 2. Update puture-en.html
let html = fs.readFileSync('public/puture-en.html', 'utf8');

// Update static fallback shell text
html = html.replace(
  'We build interactive experiences with AI. Experiences, engineered.',
  'Your Gateway to Environmental Insights. Unlock Environmental Insights for a Sustainable Future.'
);
html = html.replace(
  '<span class="hero__slogan intro-in">We build interactive experiences with AI</span>',
  '<span class="hero__slogan intro-in">Your Gateway to Environmental Insights</span>'
);

// Add high-contrast styling for all card text in puture-en.html
const cardStyles = `
      /* ========================================================= */
      /* HIGH CONTRAST CARD TYPOGRAPHY & VISIBILITY ENHANCEMENTS */
      /* ========================================================= */

      /* Feature Cards (About EDP) */
      .feature-card,
      .feature-card.edp-premium-card {
        background: linear-gradient(168deg, rgba(3, 24, 20, 0.96), rgba(4, 34, 28, 0.94)) !important;
        border: 1px solid rgba(197, 160, 89, 0.45) !important;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 20px rgba(16, 185, 129, 0.15) !important;
        color: #ffffff !important;
      }
      .feature-card h3,
      .feature-card__title {
        color: #ffffff !important;
        font-weight: 700 !important;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8) !important;
      }
      .feature-card p,
      .feature-card__body {
        color: #d1fae5 !important;
        font-size: 15px !important;
        line-height: 1.65 !important;
      }
      .feature-card__tags li,
      .edp-card-tags li {
        color: #6ee7b7 !important;
        background: rgba(16, 185, 129, 0.18) !important;
        border: 1px solid rgba(16, 185, 129, 0.35) !important;
        font-weight: 600 !important;
      }
      .feature-card__more,
      .edp-card-btn {
        color: #f0fdf4 !important;
        border-top: 1px solid rgba(197, 160, 89, 0.3) !important;
      }

      /* Step / Process Cards (Data Lifecycle) */
      .step,
      .step--dark,
      .step--light {
        background: rgba(3, 24, 20, 0.95) !important;
        border: 1px solid rgba(197, 160, 89, 0.45) !important;
        border-radius: 16px !important;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(16, 185, 129, 0.18) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        color: #ffffff !important;
      }
      .step__title {
        color: #ffffff !important;
        text-shadow: 0 2px 16px rgba(0, 0, 0, 0.9), 0 0 30px rgba(16, 185, 129, 0.25) !important;
      }
      .step__body {
        color: #d1fae5 !important;
        font-size: 16px !important;
        line-height: 1.65 !important;
      }
      .step__log,
      .step .type-lines,
      .step--dark .type-lines,
      .step--light .type-lines {
        background: rgba(1, 15, 12, 0.85) !important;
        border: 1px solid rgba(16, 185, 129, 0.25) !important;
        border-radius: 8px !important;
        padding: 12px 16px !important;
        color: #a7f3d0 !important;
      }
      .step__log .type-lines__line:first-child,
      .step .type-lines__line:first-child {
        color: #c5a059 !important;
        font-weight: 700 !important;
      }
      .step__progress li {
        background: rgba(255, 255, 255, 0.22) !important;
      }
      .step__progress li.is-on {
        background: #10b981 !important;
        box-shadow: 0 0 12px #10b981 !important;
      }

      /* Hero Title & Slogan Styling */
      .hero__slogan {
        color: #c5a059 !important;
        font-weight: 700 !important;
        letter-spacing: 0.12em !important;
        text-shadow: 0 0 16px rgba(197, 160, 89, 0.4) !important;
      }
      .hero__title {
        color: #ffffff !important;
        text-shadow: 0 4px 24px rgba(0, 0, 0, 0.9), 0 0 50px rgba(16, 185, 129, 0.3) !important;
        font-weight: 500 !important;
      }
      .hero__side p {
        color: #d1fae5 !important;
      }
`;

// Insert styles
html = html.replace('</style>', cardStyles + '\n    </style>');

// Bump cache to ?v=edp-v10
html = html.replaceAll('?v=edp-v9', '?v=edp-v10');
fs.writeFileSync('public/puture-en.html', html, 'utf8');

let home5 = fs.readFileSync('src/routes/home5.tsx', 'utf8');
home5 = home5.replaceAll('?v=edp-v9', '?v=edp-v10');
fs.writeFileSync('src/routes/home5.tsx', home5, 'utf8');

console.log('Bumped cache to ?v=edp-v10 in puture-en.html and home5.tsx');

