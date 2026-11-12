const fs = require('fs');
const content = fs.readFileSync('public/assets/ContactDialog-DOlj7i4z.js', 'utf8');

const idx = content.indexOf('function nr()');
console.log('function nr():', content.slice(idx, idx + 800));

