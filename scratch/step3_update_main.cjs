const fs = require('fs');

let code = fs.readFileSync('public/assets/main-7Jk9ujX-.js', 'utf8');
code = code.replace(/name:`PUTURE`/g, 'name:`EDP`');
code = code.replace(/PUTURE/gi, 'EDP');
fs.writeFileSync('public/assets/main-7Jk9ujX-.js', code);
console.log('Saved main-7Jk9ujX-.js');

