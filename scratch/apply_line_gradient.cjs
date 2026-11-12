const fs = require('fs');

// 1. Update ContactDialog-DOlj7i4z.js
let contactCode = fs.readFileSync('public/assets/ContactDialog-DOlj7i4z.js', 'utf8');

// Replace hero__title with line-wise split rendering
const oldTitlePattern = /\(0,B\.jsx\)\(`span`,\{className:`hero__title`[^}]*\}\)/;
const newTitle = `(0,B.jsx)(\`span\`,{className:\`hero__title intro-in\`,lang:\`en\`,children:m.title.split(\`\\n\`).map((line,i)=>(0,B.jsx)(\`span\`,{className:\`hero__title-line\`,children:line},i))})`;

if (oldTitlePattern.test(contactCode)) {
  contactCode = contactCode.replace(oldTitlePattern, newTitle);
  console.log('Successfully updated hero__title in ContactDialog-DOlj7i4z.js to render line-wise spans');
} else {
  console.error('oldTitlePattern not matched in ContactDialog-DOlj7i4z.js');
}

fs.writeFileSync('public/assets/ContactDialog-DOlj7i4z.js', contactCode);

// 2. Update edp-en.html and puture-en.html CSS
const newHeroTitleCss = `
      /* Multi-color Line-Wise & Sentence-Wise Continuous Gradient */
      .hero__title {
        display: flex !important;
        flex-direction: column !important;
        gap: 4px !important;
        font-size: clamp(32px, 3.8vw, 54px) !important;
        font-weight: 600 !important;
        line-height: 1.15 !important;
        letter-spacing: -0.03em !important;
        max-width: 15em !important;
        margin: 0 !important;
        margin-left: 0 !important;
        filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 30px rgba(16, 185, 129, 0.35)) !important;
      }

      /* Line-wise gradient: smoothly flows across each line from left to right */
      .hero__title-line,
      .hero__title .emerge-line,
      .hero__title [class*="line"],
      .hero__title .shell__line {
        display: inline-block !important;
        background: linear-gradient(90deg, #ffffff 0%, #e6fcf5 25%, #6ee7b7 55%, #10b981 80%, #c5a059 100%) !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        color: transparent !important;
        width: fit-content !important;
        max-width: 100% !important;
      }

      /* Crucial: Words and individual characters must NOT repeat or clip the gradient! */
      .hero__title [class*="char"],
      .hero__title [class*="word"],
      .hero__title .shell__char,
      .hero__title .shell__word {
        background: none !important;
        -webkit-background-clip: initial !important;
        background-clip: initial !important;
        -webkit-text-fill-color: inherit !important;
        color: inherit !important;
        display: inline !important;
      }
`;

['public/edp-en.html', 'public/puture-en.html'].forEach(filePath => {
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace old hero__title CSS rules
  const oldCssPattern = /\/\* Vibrant Multi-color Linear Gradient Title \*\/[\s\S]*?\.hero__title \[class\*="char"\]\s*\{[\s\S]*?\}/;
  if (oldCssPattern.test(html)) {
    html = html.replace(oldCssPattern, newHeroTitleCss);
    console.log(`Replaced hero__title CSS in ${filePath}`);
  } else {
    // If pattern doesn't match directly, append before </style>
    html = html.replace('</style>', newHeroTitleCss + '\n      </style>');
    console.log(`Appended hero__title CSS in ${filePath}`);
  }

  // Also replace any static shell title in html
  html = html.replace(
    /<span class="hero__title" lang="en">[\s\S]*?<\/span>/,
    '<span class="hero__title intro-in" lang="en"><span class="hero__title-line">Unlock Environmental Insights,</span><span class="hero__title-line">for a Sustainable Future.</span></span>'
  );

  // Bump version to v=edp-v17
  html = html.replace(/v=edp-v\d+/g, 'v=edp-v17');

  fs.writeFileSync(filePath, html);
  console.log(`Saved ${filePath} with v=edp-v17`);
});

// 3. Update home5.tsx
let home5 = fs.readFileSync('src/routes/home5.tsx', 'utf8');
home5 = home5.replace(/v=edp-v\d+/g, 'v=edp-v17');
fs.writeFileSync('src/routes/home5.tsx', home5);
console.log('Saved src/routes/home5.tsx with v=edp-v17');
