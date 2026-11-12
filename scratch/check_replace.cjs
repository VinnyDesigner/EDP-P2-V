const fs = require('fs');
const content = fs.readFileSync('public/assets/navigation-DiPJwl4U.js', 'utf8');
const endIdx = content.indexOf('export{', 388123);
console.log('endIdx:', endIdx);
console.log(content.slice(388123, endIdx));
