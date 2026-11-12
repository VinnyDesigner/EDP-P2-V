const fs = require('fs');

console.log('--- Applying Dark Theme across all files ---');

// 1. main-7Jk9ujX-.js
let mainJs = fs.readFileSync('public/assets/main-7Jk9ujX-.js', 'utf8');

// Replace I={light:1 with I={light:0
if (mainJs.includes('var I={light:1')) {
  mainJs = mainJs.replace('var I={light:1', 'var I={light:0');
  console.log('Updated I in main.js to light:0');
} else {
  console.log('WARNING: var I={light:1 not found in main.js');
}

// Replace d.light>.5?`light`:`dark` with `dark`
if (mainJs.includes('d.light>.5?`light`:`dark`')) {
  mainJs = mainJs.replaceAll('d.light>.5?`light`:`dark`', '`dark`');
  console.log('Updated tone state logic in main.js');
} else if (mainJs.includes('d.light>.5?"light":"dark"')) {
  mainJs = mainJs.replaceAll('d.light>.5?"light":"dark"', '"dark"');
  console.log('Updated tone state logic in main.js (double quotes)');
}

// Replace className:o===`light`?`page is-light`:`page` with className:`page`
if (mainJs.includes('className:o===`light`?`page is-light`:`page`')) {
  mainJs = mainJs.replace('className:o===`light`?`page is-light`:`page`', 'className:`page`');
  console.log('Updated root div className in main.js to always be page');
} else if (mainJs.includes('className:o==="light"?"page is-light":"page"')) {
  mainJs = mainJs.replace('className:o==="light"?"page is-light":"page"', 'className:"page"');
  console.log('Updated root div className in main.js (double quotes)');
}

fs.writeFileSync('public/assets/main-7Jk9ujX-.js', mainJs, 'utf8');

// 2. ContactDialog-DOlj7i4z.js
let contactJs = fs.readFileSync('public/assets/ContactDialog-DOlj7i4z.js', 'utf8');

if (contactJs.includes("tone:`light`")) {
  contactJs = contactJs.replaceAll("tone:`light`", "tone:`dark`");
  console.log('Replaced tone:`light` with tone:`dark` in ContactDialog.js');
} else if (contactJs.includes('tone:"light"')) {
  contactJs = contactJs.replaceAll('tone:"light"', 'tone:"dark"');
  console.log('Replaced tone:"light" with tone:"dark" in ContactDialog.js');
} else {
  console.log('WARNING: tone:light not found in ContactDialog.js');
}

fs.writeFileSync('public/assets/ContactDialog-DOlj7i4z.js', contactJs, 'utf8');

// 3. SpaceScene-Di910BNj.js
let spaceJs = fs.readFileSync('public/assets/SpaceScene-Di910BNj.js', 'utf8');

// uLight in uniforms
if (spaceJs.includes('uLight:{value:l.light}')) {
  spaceJs = spaceJs.replace('uLight:{value:l.light}', 'uLight:{value:0}');
  console.log('Updated uLight initial value to 0 in SpaceScene');
}

// uLight in RAF loop
if (spaceJs.includes('i.uniforms.uLight.value=l.light')) {
  spaceJs = spaceJs.replace('i.uniforms.uLight.value=l.light', 'i.uniforms.uLight.value=0');
  console.log('Updated i.uniforms.uLight.value to 0 in SpaceScene');
}

// Hb.uLight.value=l.light
if (spaceJs.includes('Hb.uLight.value=l.light')) {
  spaceJs = spaceJs.replace('Hb.uLight.value=l.light', 'Hb.uLight.value=0');
  console.log('Updated Hb.uLight.value to 0 in SpaceScene');
}

// s.uLightMix.value=l.light
if (spaceJs.includes('s.uLightMix.value=l.light')) {
  spaceJs = spaceJs.replace('s.uLightMix.value=l.light', 's.uLightMix.value=0');
  console.log('Updated s.uLightMix.value to 0 in SpaceScene');
}

// s.uOpacity.value=l.dust*(1-l.light*.45)
if (spaceJs.includes('s.uOpacity.value=l.dust*(1-l.light*.45)')) {
  spaceJs = spaceJs.replace('s.uOpacity.value=l.dust*(1-l.light*.45)', 's.uOpacity.value=l.dust');
  console.log('Updated s.uOpacity.value in SpaceScene');
}

// uLineLight: black -> emerald
if (spaceJs.includes("uLineLight:{value:new G(`#000000`)}")) {
  spaceJs = spaceJs.replace("uLineLight:{value:new G(`#000000`)}", "uLineLight:{value:new G(`#10b981`)}");
  console.log('Updated uLineLight to #10b981 in SpaceScene');
}

// uFirstLight, uSecondLight, uThirdLight: bright colors -> dark EDP luxury colors
if (spaceJs.includes("uFirstLight:{value:new G(`#D5E1F6`)},uSecondLight:{value:new G(`#F7F9FC`)},uThirdLight:{value:new G(`#E7ECF5`)}")) {
  spaceJs = spaceJs.replace(
    "uFirstLight:{value:new G(`#D5E1F6`)},uSecondLight:{value:new G(`#F7F9FC`)},uThirdLight:{value:new G(`#E7ECF5`)}",
    "uFirstLight:{value:new G(`#020b09`)},uSecondLight:{value:new G(`#041215`)},uThirdLight:{value:new G(`#005844`)}"
  );
  console.log('Updated sky light colors to dark EDP palette in SpaceScene');
}

fs.writeFileSync('public/assets/SpaceScene-Di910BNj.js', spaceJs, 'utf8');

console.log('All JS files updated successfully!');
