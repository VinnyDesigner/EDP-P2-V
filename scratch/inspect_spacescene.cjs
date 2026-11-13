const fs = require('fs');
const space = fs.readFileSync('public/assets/SpaceScene-Di910BNj.js', 'utf8');
const idxBox = space.indexOf('Wy={index:');
console.log('--- RoundedBoxGeometry class before Wy ---');
console.log(space.slice(idxBox - 400, idxBox + 50));

const idxMesh = space.indexOf('zb=new el(');
console.log('\n--- Background Contour Shader (from zb to end) ---');
console.log(space.slice(idxMesh, idxMesh + 4500));
