const fs = require('fs');

console.log('--- Patching SpaceScene-Di910BNj.js cleanly ---');

let js = fs.readFileSync('public/assets/SpaceScene-Di910BNj.js', 'utf8');

// The exact target in xx()
const target = 'uFirstLight:{value:new G(`#D5E1F6`)},uSecondLight:{value:new G(`#F7F9FC`)},uThirdLight:{value:new G(`#E7ECF5`)}';
const replacement = 'uFirstLight:{value:new G(`#020b09`)},uSecondLight:{value:new G(`#041215`)},uThirdLight:{value:new G(`#005844`)}';

if (js.includes(target)) {
  js = js.replace(target, replacement);
  console.log('Replaced sky light colors with dark EDP luxury colors.');
} else {
  console.error('Target not found in SpaceScene!');
  process.exit(1);
}

// Make sure newlines stay LF
js = js.replace(/\r\n/g, '\n');

fs.writeFileSync('public/assets/SpaceScene-Di910BNj.js', js, 'utf8');
console.log('SpaceScene saved successfully.');

