const fs = require('fs');

let code = fs.readFileSync('public/assets/navigation-DiPJwl4U.js', 'utf8');

// 1. Remove puture/PUTURE
code = code.replace(/xl=`puture-wave`/g, 'xl=`edp-wave`');
code = code.replace(/`puture-wave`/g, '`edp-wave`');
code = code.replace(/Fl=`puture:contact`/g, 'Fl=`edp:contact`');
code = code.replace(/`puture:contact`/g, '`edp:contact`');
code = code.replace(/PUTURE는/g, 'EDP는');
code = code.replace(/PUTURE designs/g, 'EDP designs');
code = code.replace(/b=`puture-lang`/g, 'b=`edp-lang`');
code = code.replace(/`puture-lang`/g, '`edp-lang`');

// 2. Update UI strings
code = code.replace(/startProject:x\(`[^`]+`,\s*`[^`]+`\)/, 'startProject:x(`تسجيل الدخول`,`Sign In`),exploreCatalogues:x(`الأدلة البيئية`,`Catalogues`)');
code = code.replace(/seeWork:x\(`[^`]+`,\s*`[^`]+`\)/, 'seeWork:x(`التطبيقات`,`Applications`)');

fs.writeFileSync('public/assets/navigation-DiPJwl4U.js', code);
console.log('Saved navigation-DiPJwl4U.js');

