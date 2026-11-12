const fs = require('fs');
['public/edp-en.html', 'public/puture-en.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  console.log(f, 'length:', html.length);
  console.log(f, 'modal:', html.includes('id="edp-catalog-modal"'));
  console.log(f, 'openEdpPanel:', html.includes('window.openEdpPanel = function'));
  console.log(f, 'capture listener:', html.includes('Capture phase click listener'));
});

