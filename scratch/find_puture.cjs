const fs = require('fs');

['public/assets/ContactDialog-DOlj7i4z.js', 'public/assets/main-7Jk9ujX-.js', 'public/assets/navigation-DiPJwl4U.js', 'src/routes/home5.tsx'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let idx = 0;
  const re = /puture/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    console.log(file, 'at', m.index, ':', content.slice(Math.max(0, m.index - 40), Math.min(content.length, m.index + 50)));
  }
});
