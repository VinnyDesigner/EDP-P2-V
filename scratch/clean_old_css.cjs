const fs = require('fs');

['public/edp-en.html', 'public/puture-en.html'].forEach(filePath => {
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Find and remove any old rule that sets background: inherit on char
  const oldPattern = /\.hero__title div,\s*\.hero__title span,\s*\.hero__title \.shell__line[\s\S]*?\.hero__title \[class\*="char"\]\s*\{[\s\S]*?\}/g;
  if (oldPattern.test(html)) {
    html = html.replace(oldPattern, '/* Old per-char gradient removed */');
    console.log(`Cleaned old per-char inherit rule in ${filePath}`);
  }

  // Also remove the old .hero__title background rule that was before it if present
  const oldTitleBg = /\.hero__title\s*\{[^}]*background:\s*linear-gradient\(135deg[^}]*\}/g;
  if (oldTitleBg.test(html)) {
    html = html.replace(oldTitleBg, '/* Old title background removed */');
    console.log(`Cleaned old title background in ${filePath}`);
  }

  fs.writeFileSync(filePath, html);
});
