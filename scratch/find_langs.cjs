const fs = require('fs');
const html = fs.readFileSync('public/puture-en.html', 'utf8');

console.log('lang-switch in html:', html.indexOf('lang-switch'));
