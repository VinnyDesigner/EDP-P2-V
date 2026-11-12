const fs = require('fs');

const content = fs.readFileSync('public/assets/ContactDialog-DOlj7i4z.js', 'utf8');

const idx = content.indexOf('children:g.cta');
console.log(content.slice(idx - 300, idx + 200));

