const fs = require('fs');

let html = fs.readFileSync('public/edp-en.html', 'utf8');

// Replace any leftover puture references
html = html.replace(/puture/gi, 'edp');

// Read panel snippet
const snippet = fs.readFileSync('scratch/panel_snippet.html', 'utf8');

if (!html.includes('id="edp-catalog-modal"')) {
  html = html.replace('</body>', snippet + '\n</body>');
  console.log('Injected panel snippet into edp-en.html');
} else {
  console.log('Panel snippet already present');
}

fs.writeFileSync('public/edp-en.html', html);
console.log('Saved public/edp-en.html');

