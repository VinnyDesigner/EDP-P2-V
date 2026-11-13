const fs = require('fs');
fs.readdirSync('public/assets').filter(f => f.endsWith('.js')).forEach(f => {
  const c = fs.readFileSync('public/assets/' + f, 'utf8');
  const imports = [...c.matchAll(/["'`]\.\/([^"'`]+)["'`]/g)].map(m => m[1]);
  const mapDeps = [...c.matchAll(/assets\/([a-zA-Z0-9._-]+)/g)].map(m => m[1]);
  console.log(f, 'imports:', [...new Set(imports)], 'mapDeps:', [...new Set(mapDeps)]);
});

