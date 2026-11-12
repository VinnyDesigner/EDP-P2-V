const fs = require('fs');

['public/assets/navigation-BQ5-cxHW.css', 'public/assets/ContactDialog-BPD9mSvP.css'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const re = /@keyframes\s+([a-zA-Z0-9_-]+)/g;
  let m;
  const names = [];
  while ((m = re.exec(content)) !== null) names.push(m[1]);
  console.log(file, 'animations:', names);
});
