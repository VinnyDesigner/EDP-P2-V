const fs = require('fs');
['public/puture-en.html', 'public/edp-en.html', 'public/assets/ContactDialog-DOlj7i4z.js'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(f, 'length:', content.length);
  console.log(f, 'has hero__title-line:', content.includes('hero__title-line'));
  console.log(f, 'has edp-catalog-modal:', content.includes('id="edp-catalog-modal"'));
});

