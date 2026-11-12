const fs = require('fs');

// 1. Update ContactDialog-DOlj7i4z.js
let contactCode = fs.readFileSync('public/assets/ContactDialog-DOlj7i4z.js', 'utf8');

const oldCtaBtn = /\(0,B\.jsxs\)\(`a`,\{className:`btn btn--primary`,href:Xn,onClick:e=>\{b\(e\)&&\(e\.preventDefault\(\),F\(Xn,\{from:O\(e\.currentTarget\)\}\)\)\},children:\[\(0,B\.jsx\)\(`span`,\{className:`btn__label`,children:g\.cta\}\),\(0,B\.jsx\)\(V,\{name:`arrow`,size:16\}\)\]\}\)/;

const newCtaBtn = '(0,B.jsxs)(`a`,{className:`btn btn--primary`,href:`#applications`,onClick:e=>{e.preventDefault();window.openEdpPanel&&window.openEdpPanel(`applications`)},children:[(0,B.jsx)(`span`,{className:`btn__label`,children:g.cta}),(0,B.jsx)(V,{name:`arrow`,size:16})]})';

if (oldCtaBtn.test(contactCode)) {
  contactCode = contactCode.replace(oldCtaBtn, newCtaBtn);
  console.log('Successfully replaced Explore EDP Applications button in ContactDialog-DOlj7i4z.js');
} else {
  console.log('Exact regex not matched, using substring search');
  const target = '(0,B.jsx)(`span`,{className:`btn__label`,children:g.cta}),(0,B.jsx)(V,{name:`arrow`,size:16})]})';
  const idx = contactCode.indexOf(target);
  if (idx !== -1) {
    const start = contactCode.lastIndexOf('(0,B.jsxs)(`a`', idx);
    const end = idx + target.length;
    contactCode = contactCode.slice(0, start) + newCtaBtn + contactCode.slice(end);
    console.log('Successfully replaced Explore EDP Applications button via substring search');
  } else {
    throw new Error('Could not find Explore EDP Applications button in ContactDialog-DOlj7i4z.js');
  }
}

fs.writeFileSync('public/assets/ContactDialog-DOlj7i4z.js', contactCode);
console.log('Saved ContactDialog-DOlj7i4z.js');

// 2. Update global capture listener in edp-en.html and puture-en.html
const updatedCaptureScript = `
<script>
// Capture phase click listener for all Applications and Catalogues triggers
window.addEventListener('click', function(e) {
  const btn = e.target.closest('a, button');
  if (!btn) return;
  const href = (btn.getAttribute('href') || '').toLowerCase();
  const text = (btn.textContent || '').trim().toLowerCase();

  // Check if it's an Applications button
  if (
    href === '#applications' ||
    text.includes('explore edp') ||
    text.includes('edp application') ||
    text === 'applications' ||
    text === 'application' ||
    text.includes('تطبيقات')
  ) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('[EDP] Opening Applications panel via:', text || href);
    if (typeof window.openEdpPanel === 'function') {
      window.openEdpPanel('applications');
    }
  } else if (
    href === '#catalogues' ||
    text === 'catalogues' ||
    text === 'catalogue' ||
    text.includes('أدلة')
  ) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('[EDP] Opening Catalogues panel via:', text || href);
    if (typeof window.openEdpPanel === 'function') {
      window.openEdpPanel('catalogues');
    }
  }
}, true);
</script>
`;

['public/edp-en.html', 'public/puture-en.html'].forEach(filePath => {
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace existing capture script
  const oldCapture = /<script>\s*\/\/ Capture phase click listener[\s\S]*?<\/script>/;
  if (oldCapture.test(html)) {
    html = html.replace(oldCapture, updatedCaptureScript.trim());
    console.log(`Replaced capture listener in ${filePath}`);
  } else {
    html = html.replace('</body>', updatedCaptureScript.trim() + '\n</body>');
    console.log(`Appended capture listener in ${filePath}`);
  }

  // Bump version to v=edp-v19
  html = html.replace(/v=edp-v\d+/g, 'v=edp-v19');

  fs.writeFileSync(filePath, html);
  console.log(`Saved ${filePath} with v=edp-v19`);
});

// 3. Update home5.tsx version
let home5 = fs.readFileSync('src/routes/home5.tsx', 'utf8');
home5 = home5.replace(/v=edp-v\d+/g, 'v=edp-v19');
fs.writeFileSync('src/routes/home5.tsx', home5);
console.log('Saved src/routes/home5.tsx with v=edp-v19');

