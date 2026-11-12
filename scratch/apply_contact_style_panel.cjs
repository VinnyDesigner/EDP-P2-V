const fs = require('fs');

const panelSnippet = fs.readFileSync('scratch/contact_style_panel.html', 'utf8');

['public/edp-en.html', 'public/puture-en.html'].forEach(filePath => {
  let html = fs.readFileSync(filePath, 'utf8');

  // Strip previous modal block
  const oldModalStart = html.indexOf('<!-- EDP APPLICATIONS & CATALOGUES');
  if (oldModalStart !== -1) {
    const endScript = html.indexOf('</script>\n\n<style>', oldModalStart);
    // Find closing </script>
    const nextBody = html.indexOf('</body>', oldModalStart);
    // Cut out previous modal up to </body>
    html = html.slice(0, oldModalStart) + '</body>' + html.slice(nextBody + 7);
  }

  // Inject the new Contact EAD-style panel before </body>
  html = html.replace('</body>', panelSnippet + '\n</body>');

  // Bump version to v=edp-v18
  html = html.replace(/v=edp-v\d+/g, 'v=edp-v18');

  fs.writeFileSync(filePath, html);
  console.log(`Saved ${filePath} with Contact EAD panel & effect (v=edp-v18)`);
});

// Update home5.tsx version
let home5 = fs.readFileSync('src/routes/home5.tsx', 'utf8');
home5 = home5.replace(/v=edp-v\d+/g, 'v=edp-v18');
fs.writeFileSync('src/routes/home5.tsx', home5);
console.log('Saved src/routes/home5.tsx with v=edp-v18');

