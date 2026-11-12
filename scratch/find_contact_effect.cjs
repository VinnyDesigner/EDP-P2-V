const fs = require('fs');

const css = fs.readFileSync('public/assets/navigation-BQ5-cxHW.css', 'utf8');

const idx = css.indexOf('.contact-dialog__close');
console.log(css.slice(idx, idx + 400));
