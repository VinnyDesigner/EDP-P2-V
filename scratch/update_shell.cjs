const fs = require('fs');

let html = fs.readFileSync('public/puture-en.html', 'utf8');

const targetStart = '<span class="hero__title" lang="en">';
const targetEnd = '</span></div><div class="hero__side">';

const sIdx = html.indexOf(targetStart);
const eIdx = html.indexOf(targetEnd);

if (sIdx !== -1 && eIdx !== -1) {
  const replacement = `${targetStart}Unlock Environmental Insights,<br/>for a Sustainable Future.`;
  html = html.slice(0, sIdx) + replacement + html.slice(eIdx);
  console.log('Successfully replaced prerender shell hero__title');
} else {
  console.warn('Could not locate prerender shell hero__title indices!');
}

fs.writeFileSync('public/puture-en.html', html, 'utf8');
console.log('Saved puture-en.html');

