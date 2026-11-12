const fs = require('fs');

const edpHtml = fs.readFileSync('public/edp-en.html', 'utf8');
fs.writeFileSync('public/puture-en.html', edpHtml);
console.log('Synchronized public/puture-en.html with public/edp-en.html');

