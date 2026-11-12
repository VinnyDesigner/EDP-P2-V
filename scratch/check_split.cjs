const fs = require('fs');
const content = fs.readFileSync('public/assets/ContactDialog-DOlj7i4z.js', 'utf8');

const idx = content.indexOf('t.querySelectorAll(`[data-chars]`)');
console.log(content.slice(idx, idx + 400));

