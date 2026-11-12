const fs = require('fs');

console.log('--- Cleaning font rules and external references from navigation-BQ5-cxHW.css ---');

let css = fs.readFileSync('public/assets/navigation-BQ5-cxHW.css', 'utf8');

// 1. Remove all @font-face blocks pointing to https://puture.co.kr
const regex = /@font-face\s*\{[^}]*https:\/\/puture\.co\.kr[^}]*\}/g;
const initialLength = css.length;
css = css.replace(regex, '');
console.log(`Removed ${initialLength - css.length} bytes of external puture.co.kr font rules.`);

// 2. Replace --font-sans with clean system fonts
css = css.replace(
  '--font-sans:"42dot Sans Variable", "Pretendard Variable", Pretendard, system-ui, sans-serif;',
  '--font-sans:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;'
);

// 3. Check for any remaining occurrences of puture.co.kr
if (css.includes('puture.co.kr')) {
  console.warn('WARNING: Some puture.co.kr references still remain in CSS!');
} else {
  console.log('Confirmed: 0 puture.co.kr references remaining.');
}

fs.writeFileSync('public/assets/navigation-BQ5-cxHW.css', css, 'utf8');
console.log('Successfully updated public/assets/navigation-BQ5-cxHW.css');

