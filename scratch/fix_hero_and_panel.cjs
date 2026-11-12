const fs = require('fs');

// 1. Update ContactDialog-DOlj7i4z.js
let contactCode = fs.readFileSync('public/assets/ContactDialog-DOlj7i4z.js', 'utf8');

// Ensure function yn handles onClick and checks href #applications and #catalogues
const oldYn = /function yn\(\{href:e,children:t,variant:n=`primary`,size:r=`md`,arrow:i=!1[^\}]*\}\)\{return\(0,B\.jsxs\)\(`a`,\{className:\[`btn`[^\}]*\}\)\}/;

const newYn = 'function yn({href:e,children:t,variant:n=`primary`,size:r=`md`,arrow:i=!1,onClick:a}){return(0,B.jsxs)(`a`,{className:[`btn`,`btn--${n}`,r===`sm`?`btn--sm`:``].filter(Boolean).join(` `),href:e,onClick:t=>{if(a){t.preventDefault();a(t);return;}if(e===`#applications`){t.preventDefault();window.openEdpPanel&&window.openEdpPanel(`applications`);return;}if(e===`#catalogues`){t.preventDefault();window.openEdpPanel&&window.openEdpPanel(`catalogues`);return;}_n(t,e)},onPointerEnter:gn,children:[(0,B.jsx)(`span`,{"data-label":``,className:`btn__label`,children:t}),i&&(0,B.jsx)(V,{name:`arrow`,size:r===`sm`?14:16})]})};';

contactCode = contactCode.replace(oldYn, newYn);

// Ensure function nr() renders Applications and Catalogues buttons with explicit labels and handlers
const oldHeroBtns = /\(0,B\.jsx\)\(yn,\{href:`#applications`[^\)]*\)\),\(0,B\.jsx\)\(yn,\{href:`#catalogues`[^\)]*\)\)/;
const newHeroBtns = '(0,B.jsx)(yn,{href:`#applications`,arrow:!0,onClick:e=>{e.preventDefault();window.openEdpPanel&&window.openEdpPanel(`applications`)},children:`Applications`}),(0,B.jsx)(yn,{href:`#catalogues`,variant:`ghost`,onClick:e=>{e.preventDefault();window.openEdpPanel&&window.openEdpPanel(`catalogues`)},children:`Catalogues`})';

if (oldHeroBtns.test(contactCode)) {
  contactCode = contactCode.replace(oldHeroBtns, newHeroBtns);
  console.log('Replaced hero buttons in ContactDialog-DOlj7i4z.js');
} else {
  console.log('Hero buttons regex did not match, searching with broader pattern');
  const broadRe = /className:`hero__actions intro-in`,style:\{animationDelay:`0\.65s`\},children:\[[\s\S]*?\]\}\)/;
  contactCode = contactCode.replace(broadRe, `className:\`hero__actions intro-in\`,style:{animationDelay:\`0.65s\`},children:[${newHeroBtns}]})`);
  console.log('Replaced hero buttons with broad pattern');
}

fs.writeFileSync('public/assets/ContactDialog-DOlj7i4z.js', contactCode);
console.log('Saved ContactDialog-DOlj7i4z.js');

// 2. Build the complete panel HTML with verified local thumbnails
const apps = JSON.parse(fs.readFileSync('scratch/edp_apps_data.json', 'utf8'));

// Re-generate panel snippet
const snippetScript = fs.readFileSync('scratch/build_panel.cjs', 'utf8');
eval(snippetScript);

const panelSnippet = fs.readFileSync('scratch/panel_snippet.html', 'utf8');

// 3. Update public/edp-en.html
let edpHtml = fs.readFileSync('public/edp-en.html', 'utf8');

// Remove any existing modal if present to avoid duplication
const modalStart = edpHtml.indexOf('<!-- EDP APPLICATIONS & CATALOGUES FULL-PAGE PANEL -->');
if (modalStart !== -1) {
  const modalEnd = edpHtml.indexOf('</script>\n\n<style>', modalStart);
  // find end of script
  const scriptEnd = edpHtml.indexOf('</script>', modalStart + 100);
  edpHtml = edpHtml.slice(0, modalStart) + edpHtml.slice(scriptEnd + 9);
}

// Ensure global capture phase listener is added for clicking hero buttons
const clickCaptureScript = `
<script>
// Capture phase click listener for Hero buttons: Applications and Catalogues
window.addEventListener('click', function(e) {
  const btn = e.target.closest('a.btn, a[href="#applications"], a[href="#catalogues"], button.btn');
  if (!btn) return;
  const href = (btn.getAttribute('href') || '').toLowerCase();
  const text = (btn.textContent || '').trim().toLowerCase();

  if (href === '#applications' || text === 'applications' || text === 'application') {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('[EDP] Opening Applications panel');
    if (typeof window.openEdpPanel === 'function') {
      window.openEdpPanel('applications');
    }
  } else if (href === '#catalogues' || text === 'catalogues' || text === 'catalogue') {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('[EDP] Opening Catalogues panel');
    if (typeof window.openEdpPanel === 'function') {
      window.openEdpPanel('catalogues');
    }
  }
}, true);
</script>
`;

edpHtml = edpHtml.replace('</body>', clickCaptureScript + '\n' + panelSnippet + '\n</body>');

// Bump cache version to v=edp-v16
edpHtml = edpHtml.replace(/v=edp-v\d+/g, 'v=edp-v16');

fs.writeFileSync('public/edp-en.html', edpHtml);
console.log('Saved updated public/edp-en.html with panel & capture listener');

// 4. Also write public/puture-en.html identically so legacy path never breaks
fs.writeFileSync('public/puture-en.html', edpHtml);
console.log('Saved identical public/puture-en.html');

// 5. Update src/routes/home5.tsx cache version
let home5 = fs.readFileSync('src/routes/home5.tsx', 'utf8');
home5 = home5.replace(/v=edp-v\d+/g, 'v=edp-v16');
fs.writeFileSync('src/routes/home5.tsx', home5);
console.log('Saved src/routes/home5.tsx to v=edp-v16');

