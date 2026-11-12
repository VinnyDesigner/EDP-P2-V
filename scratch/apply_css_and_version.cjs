const fs = require('fs');

// 1. Update public/assets/navigation-BQ5-cxHW.css
let css = fs.readFileSync('public/assets/navigation-BQ5-cxHW.css', 'utf8');

const oldLangCss = '.lang-switch{gap:2px;display:flex}.lang-switch a{color:inherit;opacity:.55;border-radius:var(--radius);padding:5px 7px;transition:opacity .2s,background-color .2s}.lang-switch a:hover{opacity:1}.lang-switch a[aria-current=true]{opacity:1;box-shadow:inset 0 0 0 1px}';

const newLangCss = '.lang-switch{display:inline-flex!important;align-items:center!important;background:rgba(3,24,20,0.68)!important;border:1px solid rgba(197,160,89,0.35)!important;border-radius:9999px!important;padding:3px!important;gap:3px!important;box-shadow:inset 0 1px 3px rgba(0,0,0,0.4),0 2px 8px rgba(0,0,0,0.25)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important}.lang-switch a{font-family:inherit!important;font-size:12.5px!important;font-weight:600!important;letter-spacing:0.02em!important;color:rgba(209,250,229,0.72)!important;padding:5px 12px!important;border-radius:9999px!important;text-decoration:none!important;transition:all .22s cubic-bezier(0.16,1,0.3,1)!important;line-height:1.2!important;opacity:1!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important}.lang-switch a:hover{color:#ffffff!important;background:rgba(16,185,129,0.18)!important}.lang-switch a[aria-current=true]{background:linear-gradient(135deg,#10b981 0%,#005844 100%)!important;color:#ffffff!important;box-shadow:0 2px 8px rgba(16,185,129,0.38),inset 0 1px 0 rgba(255,255,255,0.25)!important;border:1px solid rgba(16,185,129,0.5)!important;font-weight:700!important}';

if (!css.includes(oldLangCss)) {
  console.log('oldLangCss exact string not found, checking with regex');
  const re = /\.lang-switch\{gap:2px;display:flex\}[\s\S]*?\.lang-switch a\[aria-current=true\]\{opacity:1;box-shadow:inset 0 0 0 1px\}/;
  if (re.test(css)) {
    css = css.replace(re, newLangCss);
    fs.writeFileSync('public/assets/navigation-BQ5-cxHW.css', css);
    console.log('Replaced lang-switch CSS with regex');
  } else {
    console.error('Could not find lang-switch CSS to replace');
  }
} else {
  css = css.replace(oldLangCss, newLangCss);
  fs.writeFileSync('public/assets/navigation-BQ5-cxHW.css', css);
  console.log('Successfully replaced lang-switch CSS in navigation-BQ5-cxHW.css');
}

// 2. Update puture-en.html with extra language switcher styling and bump cache version
let html = fs.readFileSync('public/puture-en.html', 'utf8');

// Replace cache version from v=edp-v13 to v=edp-v14
html = html.replace(/v=edp-v13/g, 'v=edp-v14');

// Ensure extra styles are in puture-en.html
const extraStyle = `
    /* Language switcher luxury pill styling */
    .lang-switch {
      display: inline-flex !important;
      align-items: center !important;
      background: rgba(3, 24, 20, 0.7) !important;
      border: 1px solid rgba(197, 160, 89, 0.35) !important;
      border-radius: 9999px !important;
      padding: 3px !important;
      gap: 3px !important;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25) !important;
      backdrop-filter: blur(14px) !important;
      -webkit-backdrop-filter: blur(14px) !important;
    }
    .lang-switch a {
      font-size: 13px !important;
      font-weight: 600 !important;
      letter-spacing: 0.02em !important;
      color: rgba(209, 250, 229, 0.75) !important;
      padding: 5px 13px !important;
      border-radius: 9999px !important;
      text-decoration: none !important;
      transition: all 0.22s ease !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      opacity: 1 !important;
      cursor: pointer !important;
    }
    .lang-switch a:hover {
      color: #ffffff !important;
      background: rgba(16, 185, 129, 0.16) !important;
    }
    .lang-switch a[aria-current="true"] {
      background: linear-gradient(135deg, #10b981 0%, #005844 100%) !important;
      color: #ffffff !important;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
      border: 1px solid rgba(16, 185, 129, 0.5) !important;
      font-weight: 700 !important;
    }
    html[lang="ar"], html[dir="rtl"] {
      direction: rtl;
    }
`;

if (!html.includes('Language switcher luxury pill styling')) {
  html = html.replace('</style>', extraStyle + '\n  </style>');
}

fs.writeFileSync('public/puture-en.html', html);
console.log('Successfully updated puture-en.html to v=edp-v14');

// Also update src/routes/home5.tsx to v=edp-v14
let home5 = fs.readFileSync('src/routes/home5.tsx', 'utf8');
home5 = home5.replace(/v=edp-v13/g, 'v=edp-v14');
fs.writeFileSync('src/routes/home5.tsx', home5);
console.log('Successfully updated src/routes/home5.tsx to v=edp-v14');

