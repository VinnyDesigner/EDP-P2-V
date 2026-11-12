const fs = require('fs');
fs.copyFileSync('public/puture-en.html', 'public/edp-en.html');
console.log('Copied puture-en.html to edp-en.html');

let home5 = fs.readFileSync('src/routes/home5.tsx', 'utf8');
home5 = home5.replace(/\/puture-en\.html\?v=[^"']+/g, '/edp-en.html?v=edp-v15');
fs.writeFileSync('src/routes/home5.tsx', home5);
console.log('Updated src/routes/home5.tsx to /edp-en.html?v=edp-v15');

if (fs.existsSync('public/puture-en.html')) {
  fs.unlinkSync('public/puture-en.html');
  console.log('Deleted public/puture-en.html');
}

