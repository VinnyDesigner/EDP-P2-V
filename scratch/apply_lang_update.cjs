const fs = require('fs');

// 1. Update public/assets/navigation-DiPJwl4U.js
let navJs = fs.readFileSync('public/assets/navigation-DiPJwl4U.js', 'utf8');

const t1Old = 'v=[`ko`,`en`],y=typeof document<`u`&&document.documentElement.lang===`en`?`en`:`ko`,b=`puture-lang`,x=(e,t)=>({ko:e,en:t}),S=e=>typeof e==`object`&&!!e&&Object.keys(e).length===2&&typeof e.ko==`string`&&typeof e.en==`string`;function C(e,t=y){let n=e=>S(e)?e[t]:Array.isArray(e)?e.map(n):typeof e==`object`&&e?Object.fromEntries(Object.entries(e).map(([e,t])=>[e,n(t)])):e;return n(e)}function w(e,t){let n=t.replace(/^\\/en(?=\\/|$)/,``)||`/`;return e===`en`?`/en${n===`/`?`/`:n}`:n}function T(e){try{localStorage.setItem(b,e)}catch{}}';

const t1New = 'v=[{code:`ar`,label:`عربي`},{code:`en`,label:`English`}],y=(typeof window<`u`&&(new URLSearchParams(window.location.search).get(`lang`)||localStorage.getItem(`edp-lang`)))===`ar`?`ar`:`en`,b=`edp-lang`,x=(e,t)=>({ar:typeof e==`string`&&!/[\\uAC00-\\uD7AF]/.test(e)?e:(t||e),en:t,ko:e}),S=e=>typeof e==`object`&&!!e&&(`en`in e)&&(`ar`in e||`ko`in e);if(typeof document<`u`){document.documentElement.lang=y;if(y===`ar`){document.documentElement.dir=`rtl`}}function C(e,t=y){let n=e=>S(e)?(t===`ar`?(e.ar||e.ko||e.en):(e.en||e.ar)):Array.isArray(e)?e.map(n):typeof e==`object`&&e?Object.fromEntries(Object.entries(e).map(([e,t])=>[e,n(t)])):e;return n(e)}function w(e,t){let c=typeof e==`object`?e.code:e;try{let u=new URL(window.location.href);u.searchParams.set(`lang`,c);return u.pathname+u.search}catch{return`?lang=`+c}}function T(e){let c=typeof e==`object`?e.code:e;try{localStorage.setItem(b,c)}catch{}}';

const t2Old = 'function $l({label:e}){return(0,Q.jsx)(`nav`,{className:`lang-switch mono`,"aria-label":e,children:v.map(e=>(0,Q.jsx)(`a`,{href:w(e,window.location.pathname)+window.location.hash,hrefLang:e,lang:e,"aria-current":e===y?`true`:void 0,onClick:()=>T(e),children:e.toUpperCase()},e))})}';

const t2New = 'function $l({label:e}){return(0,Q.jsx)(`nav`,{className:`lang-switch mono`,"aria-label":e||`Language`,children:v.map(e=>(0,Q.jsx)(`a`,{href:w(e,window.location.pathname)+window.location.hash,hrefLang:e.code,lang:e.code,"aria-current":e.code===y?`true`:void 0,onClick:t=>{t.preventDefault();if(e.code===y)return;T(e.code);try{let u=new URL(window.location.href);u.searchParams.set(`lang`,e.code);window.location.href=u.toString()}catch{window.location.search=`?lang=`+e.code}},children:e.label},e.code))})}';

if (!navJs.includes(t1Old)) {
  throw new Error('Target 1 not found in navigation-DiPJwl4U.js');
}
if (!navJs.includes(t2Old)) {
  throw new Error('Target 2 not found in navigation-DiPJwl4U.js');
}

navJs = navJs.replace(t1Old, t1New).replace(t2Old, t2New);

fs.writeFileSync('public/assets/navigation-DiPJwl4U.js', navJs);
console.log('Successfully updated navigation-DiPJwl4U.js');

// 2. Update ContactDialog-DOlj7i4z.js
let contactJs = fs.readFileSync('public/assets/ContactDialog-DOlj7i4z.js', 'utf8');
contactJs = contactJs.replace(/"aria-label":`PUTURE home`/g, '"aria-label":`EDP Home`');
contactJs = contactJs.replace(/writer__name mono`,children:`PUTURE`/g, 'writer__name mono`,children:`Abu Dhabi EDP`');
fs.writeFileSync('public/assets/ContactDialog-DOlj7i4z.js', contactJs);
console.log('Successfully updated ContactDialog-DOlj7i4z.js');

