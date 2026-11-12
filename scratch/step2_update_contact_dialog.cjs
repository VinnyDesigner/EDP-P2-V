const fs = require('fs');

let code = fs.readFileSync('public/assets/ContactDialog-DOlj7i4z.js', 'utf8');

// 1. Remove PUTURE / puture
code = code.replace(/https:\/\/www\.awwwards\.com\/sites\/puture/g, 'https://edp.ead.ae');
code = code.replace(/PUTURE, Awwwards Nominee/g, 'Abu Dhabi EDP');
code = code.replace(/what PUTURE builds/g, 'what EDP provides');
code = code.replace(/what PUTURE built/g, 'what EDP built');
code = code.replace(/Footer — PUTURE across the width/g, 'Footer — EDP across the width');
code = code.replace(/children:`PUTURE`/g, 'children:`EDP`');
code = code.replace(/var br=`puture:arrival`/g, 'var br=`edp:arrival`');
code = code.replace(/`puture:arrival`/g, '`edp:arrival`');

// 2. Remove hover glitch effect in hn and gn
const hnOld = 'function hn(e){if(et())return;let t=e.querySelector(`[data-label]`);if(!t)return;let n=t.dataset.label||t.textContent||``;t.dataset.label=n,t.style.width=`${t.getBoundingClientRect().width}px`,p.to(t,{duration:$e.duration.hover,scrambleText:{text:n,chars:We,speed:.9},overwrite:!0,onComplete:()=>{t.style.width=``}})}function gn(e){e.pointerType===`mouse`&&hn(e.currentTarget)}';
const hnNew = 'function hn(e){return;}function gn(e){return;}';

if (!code.includes(hnOld)) {
  console.log('hnOld exact string not found, checking regex');
  const hnRe = /function hn\(e\)\{[\s\S]*?\}function gn\(e\)\{e\.pointerType===`mouse`&&hn\(e\.currentTarget\)\}/;
  if (hnRe.test(code)) {
    code = code.replace(hnRe, hnNew);
    console.log('Replaced hn & gn with regex');
  } else {
    throw new Error('Could not find hn/gn to disable glitch');
  }
} else {
  code = code.replace(hnOld, hnNew);
  console.log('Replaced hn & gn exactly');
}

// 3. Update hero buttons to Applications & Catalogues with window.openEdpPanel
const heroButtonsOld = '(0,B.jsx)(yn,{href:`#work`,arrow:!0,children:c.seeWork}),(0,B.jsx)(yn,{href:`#process`,variant:`ghost`,children:c.startProject})';
const heroButtonsNew = '(0,B.jsx)(yn,{href:`#applications`,arrow:!0,onClick:e=>{e.preventDefault();window.openEdpPanel&&window.openEdpPanel(`applications`)},children:c.seeWork||`Applications`}),(0,B.jsx)(yn,{href:`#catalogues`,variant:`ghost`,onClick:e=>{e.preventDefault();window.openEdpPanel&&window.openEdpPanel(`catalogues`)},children:c.exploreCatalogues||`Catalogues`})';

if (!code.includes(heroButtonsOld)) {
  console.log('heroButtonsOld exact string not found, checking snippet');
  const heroRe = /\(0,B\.jsx\)\(yn,\{href:`#work`,arrow:!0,children:c\.seeWork\}\),\(0,B\.jsx\)\(yn,\{href:`#process`[^}]*\}\)/;
  if (heroRe.test(code)) {
    code = code.replace(heroRe, heroButtonsNew);
    console.log('Replaced hero buttons with regex');
  } else {
    throw new Error('Could not find hero buttons to replace');
  }
} else {
  code = code.replace(heroButtonsOld, heroButtonsNew);
  console.log('Replaced hero buttons exactly');
}

// 4. Update navbar button to Sign In
const navBtnOld = '(0,B.jsx)(yn,{href:`#contact`,size:`sm`,children:c.startProject})';
const navBtnNew = '(0,B.jsx)(yn,{href:`https://edp.ead.ae/signin`,target:`_blank`,rel:`noopener`,size:`sm`,className:`edp-signin-btn`,children:c.startProject||`Sign In`})';

if (!code.includes(navBtnOld)) {
  throw new Error('navBtnOld not found in ContactDialog');
}
code = code.replace(navBtnOld, navBtnNew);
console.log('Replaced nav button with Sign In');

fs.writeFileSync('public/assets/ContactDialog-DOlj7i4z.js', code);
console.log('Saved ContactDialog-DOlj7i4z.js');

