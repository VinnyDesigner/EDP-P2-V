const fs = require('fs');

const html = fs.readFileSync('public/edp-en.html', 'utf8');
const regex = /\.hero__title[\s\S]*?\}/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log('--- Match at', m.index, '---');
  console.log(m[0]);
}
