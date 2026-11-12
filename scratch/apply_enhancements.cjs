const fs = require('fs');

console.log('=== Applying Navbar, Buttons, and 3D Coin Thumbnail Enhancements ===');

// -------------------------------------------------------------
// 1. SpaceScene-Di910BNj.js (3D Coins: Circular Clipmasked Photos)
// -------------------------------------------------------------
let spaceJs = fs.readFileSync('public/assets/SpaceScene-Di910BNj.js', 'utf8');

// Change plane geometry from .58 to 1.06 to cover the coin face
if (spaceJs.includes('Xy=new el(.58,.58);')) {
  spaceJs = spaceJs.replace('Xy=new el(.58,.58);', 'Xy=new el(1.06,1.06);');
  console.log('Updated Xy geometry to 1.06 x 1.06 for full coin face coverage.');
} else {
  console.log('Xy geometry match check:', spaceJs.includes('Xy=new el('));
}

// Replace function eb(e)
const targetEb = `function eb(e){let t=document.createElement(\`canvas\`);t.width=256,t.height=256;let n=t.getContext(\`2d\`);if(!n)throw Error(\`2D canvas unavailable for icon textures\`);n.scale(256/24,256/24),n.strokeStyle=\`#ffffff\`,n.lineWidth=1.75,n.lineCap=\`round\`,n.lineJoin=\`round\`;for(let t of f[e])n.stroke(new Path2D(t));let r=new _s(t);return r.colorSpace=Tt,r.anisotropy=4,r}`;

const newEb = `var _edpThumbs=[
  "/edp-thumbs/img-97.jpg",
  "/edp-thumbs/img-65.png",
  "/edp-thumbs/img-285.jpg",
  "/edp-thumbs/img-101.jpg",
  "/edp-thumbs/img-90.jpg",
  "/edp-thumbs/img-81.png",
  "/edp-thumbs/img-106.png",
  "/edp-thumbs/img-79.jpg",
  "/edp-thumbs/img-87.jpg",
  "/edp-thumbs/img-100.png",
  "/edp-thumbs/img-104.png",
  "/edp-thumbs/img-110.png"
];
function eb(e,idx){
  let t=document.createElement("canvas");
  t.width=512,t.height=512;
  let n=t.getContext("2d");
  if(!n)throw Error("2D canvas unavailable for coin face textures");
  let r=new _s(t);
  r.colorSpace=Tt,r.anisotropy=4;

  function render(img){
    n.clearRect(0,0,512,512);
    n.save();
    n.beginPath();
    n.arc(256,256,244,0,Math.PI*2);
    n.closePath();
    n.clip();

    if(img&&img.complete&&img.naturalWidth>0){
      let asp=img.naturalWidth/img.naturalHeight;
      let dw,dh,dx,dy;
      if(asp>1){
        dh=512;dw=512*asp;dx=-(dw-512)/2;dy=0;
      }else{
        dw=512;dh=512/asp;dx=0;dy=-(dh-512)/2;
      }
      n.drawImage(img,dx,dy,dw,dh);
    }else{
      let bg=n.createRadialGradient(256,256,20,256,256,244);
      bg.addColorStop(0,"#00d293");
      bg.addColorStop(0.4,"#059669");
      bg.addColorStop(0.8,"#065f46");
      bg.addColorStop(1,"#022c22");
      n.fillStyle=bg;
      n.fill();
    }

    let vig=n.createRadialGradient(256,256,120,256,256,244);
    vig.addColorStop(0,"rgba(0,0,0,0)");
    vig.addColorStop(0.65,"rgba(3,24,20,0.32)");
    vig.addColorStop(1,"rgba(2,16,14,0.88)");
    n.fillStyle=vig;
    n.beginPath();
    n.arc(256,256,244,0,Math.PI*2);
    n.fill();

    n.restore();

    let rg=n.createLinearGradient(40,40,472,472);
    rg.addColorStop(0,"#f5c86b");
    rg.addColorStop(0.3,"#34d399");
    rg.addColorStop(0.7,"#065f46");
    rg.addColorStop(1,"#dfba73");
    n.strokeStyle=rg;
    n.lineWidth=14;
    n.beginPath();
    n.arc(256,256,244,0,Math.PI*2);
    n.stroke();

    n.strokeStyle="rgba(245,200,107,0.7)";
    n.lineWidth=3;
    n.beginPath();
    n.arc(256,256,230,0,Math.PI*2);
    n.stroke();
  }

  render(null);

  let thumbSrc=_edpThumbs[(idx||0)%_edpThumbs.length];
  let img=new Image();
  img.crossOrigin="anonymous";
  img.onload=()=>{
    render(img);
    r.needsUpdate=true;
  };
  img.src=thumbSrc;

  return r;
}`;

if (spaceJs.includes(targetEb)) {
  spaceJs = spaceJs.replace(targetEb, newEb);
  console.log('Successfully replaced eb(e) with circular clipmasked thumbnail coin renderer.');
} else {
  console.warn('Target eb not found with exact match, searching fallback...');
  let idx = spaceJs.indexOf('function eb(e){');
  let endIdx = spaceJs.indexOf('var tb=', idx);
  if (idx !== -1 && endIdx !== -1) {
    spaceJs = spaceJs.slice(0, idx) + newEb + spaceJs.slice(endIdx);
    console.log('Replaced eb with fallback range.');
  }
}

// Also in Rb(): ensure idx is passed to eb: g.map((item, idx) => eb(item, idx))
if (spaceJs.includes('g.map(eb)')) {
  spaceJs = spaceJs.replace('g.map(eb)', 'g.map((e,idx)=>eb(e,idx))');
  console.log('Updated g.map to pass coin index.');
}

spaceJs = spaceJs.replace(/\r\n/g, '\n');
fs.writeFileSync('public/assets/SpaceScene-Di910BNj.js', spaceJs, 'utf8');
console.log('Saved SpaceScene-Di910BNj.js');

// -------------------------------------------------------------
// 2. ContactDialog-DOlj7i4z.js (Remove plus icons from vn nav)
// -------------------------------------------------------------
let contactJs = fs.readFileSync('public/assets/ContactDialog-DOlj7i4z.js', 'utf8');

const oldPlusIcon = `(0,B.jsx)(\`span\`,{className:\`nav-links__plus\`,\"aria-hidden\":\`true\`,children:(0,B.jsx)(V,{name:\`plus\`,size:10})})`;
if (contactJs.includes(oldPlusIcon)) {
  contactJs = contactJs.replace(oldPlusIcon, 'null');
  console.log('Successfully removed plus icon from vn in ContactDialog.js');
}

contactJs = contactJs.replace(/\r\n/g, '\n');
fs.writeFileSync('public/assets/ContactDialog-DOlj7i4z.js', contactJs, 'utf8');

// -------------------------------------------------------------
// 3. puture-en.html (Navbar look & feel, Glassmorphism, Rounded Gradient Buttons)
// -------------------------------------------------------------
let html = fs.readFileSync('public/puture-en.html', 'utf8');

const navAndButtonStyles = `
      /* ========================================================= */
      /* CENTER-ALIGNED ROUNDED RECTANGULAR GLASSMORPHISM NAVBAR   */
      /* ========================================================= */
      .site-header {
        position: fixed !important;
        top: 20px !important;
        left: 50% !important;
        right: auto !important;
        bottom: auto !important;
        transform: translateX(-50%) !important;
        width: min(94vw, 1120px) !important;
        height: 64px !important;
        padding: 8px 20px 8px 18px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 20px !important;
        background: rgba(3, 20, 16, 0.78) !important;
        backdrop-filter: blur(20px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
        border: 1px solid rgba(197, 160, 89, 0.4) !important;
        border-radius: 9999px !important;
        box-shadow: 0 16px 45px rgba(0, 0, 0, 0.7), 0 0 28px rgba(16, 185, 129, 0.16) !important;
        z-index: 99999 !important;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }

      .site-header:before {
        display: none !important;
      }

      /* Logo inside navbar */
      .site-header a[href="#welcome"] {
        display: flex !important;
        align-items: center !important;
        padding-left: 4px !important;
      }
      .site-header .edp-main-logo {
        height: 38px !important;
        width: auto !important;
        display: block !important;
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6)) !important;
      }

      /* Centered Nav Links */
      .site-header .nav-links {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        margin: 0 auto !important;
        padding: 0 !important;
        list-style: none !important;
      }

      .site-header .nav-links__item {
        color: #d1fae5 !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        letter-spacing: 0.02em !important;
        padding: 9px 18px !important;
        border-radius: 9999px !important;
        text-decoration: none !important;
        transition: all 0.25s ease !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 0 !important;
      }

      .site-header .nav-links__item:hover {
        color: #ffffff !important;
        background: rgba(16, 185, 129, 0.2) !important;
        box-shadow: 0 0 14px rgba(16, 185, 129, 0.35) !important;
      }

      /* Remove Plus Icons completely */
      .nav-links__plus,
      .site-header .nav-links__item svg,
      .site-header .nav-links__plus {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        width: 0 !important;
        height: 0 !important;
      }

      /* Language Toggle Button inside navbar */
      .site-header .lang-toggle,
      .site-header .menu-button {
        border-radius: 9999px !important;
      }

      /* ========================================================= */
      /* ENHANCED ROUNDED GRADIENT BUTTONS                         */
      /* ========================================================= */
      .btn,
      .btn--primary,
      .btn--ghost,
      .btn--sm,
      .edp-card-btn,
      .feature-card__more,
      .work-panel__action,
      .hero__actions .btn {
        border-radius: 9999px !important;
        font-weight: 600 !important;
        letter-spacing: 0.02em !important;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      /* Primary Rounded Gradient Button */
      .btn--primary,
      .site-header .btn--primary,
      .hero__actions .btn--primary,
      .work-award__box .btn--primary {
        background: linear-gradient(135deg, #10b981 0%, #059669 45%, #005844 100%) !important;
        color: #ffffff !important;
        border: 1px solid rgba(197, 160, 89, 0.5) !important;
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        padding-inline: 24px !important;
      }

      .btn--primary:hover,
      .site-header .btn--primary:hover,
      .hero__actions .btn--primary:hover,
      .work-award__box .btn--primary:hover {
        background: linear-gradient(135deg, #34d399 0%, #10b981 45%, #059669 100%) !important;
        color: #ffffff !important;
        border-color: rgba(245, 200, 107, 0.9) !important;
        box-shadow: 0 10px 32px rgba(16, 185, 129, 0.7), 0 0 20px rgba(197, 160, 89, 0.6) !important;
        transform: translateY(-2px) !important;
      }

      /* Ghost Rounded Gradient Button */
      .btn--ghost,
      .hero__actions .btn--ghost {
        background: linear-gradient(135deg, rgba(3, 24, 20, 0.88) 0%, rgba(5, 36, 28, 0.72) 100%) !important;
        color: #f0fdf4 !important;
        border: 1px solid rgba(197, 160, 89, 0.5) !important;
        backdrop-filter: blur(14px) !important;
        -webkit-backdrop-filter: blur(14px) !important;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
        padding-inline: 24px !important;
      }

      .btn--ghost:hover,
      .hero__actions .btn--ghost:hover {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(197, 160, 89, 0.25) 100%) !important;
        border-color: #c5a059 !important;
        color: #ffffff !important;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.45), 0 0 16px rgba(197, 160, 89, 0.45) !important;
        transform: translateY(-2px) !important;
      }

      /* Navbar Small CTA Button */
      .site-header .btn--sm {
        height: 38px !important;
        padding-inline: 20px !important;
        font-size: 13.5px !important;
        border-radius: 9999px !important;
      }

      /* Card Action Buttons */
      .feature-card__more,
      .edp-card-btn {
        border-radius: 9999px !important;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(197, 160, 89, 0.22) 100%) !important;
        border: 1px solid rgba(197, 160, 89, 0.5) !important;
        color: #ffffff !important;
        padding: 12px 24px !important;
      }
      .feature-card__more:hover,
      .edp-card-btn:hover {
        background: linear-gradient(135deg, #059669 0%, #c5a059 100%) !important;
        color: #041215 !important;
        border-color: #dfba73 !important;
        box-shadow: 0 6px 22px rgba(16, 185, 129, 0.5) !important;
        transform: translateX(4px) !important;
      }
`;

html = html.replace('</style>', navAndButtonStyles + '\n    </style>');

// Bump cache bust to ?v=edp-v11
html = html.replaceAll('?v=edp-v10', '?v=edp-v11');
fs.writeFileSync('public/puture-en.html', html, 'utf8');

let home5 = fs.readFileSync('src/routes/home5.tsx', 'utf8');
home5 = home5.replaceAll('?v=edp-v10', '?v=edp-v11');
fs.writeFileSync('src/routes/home5.tsx', home5, 'utf8');

console.log('Bumped cache to ?v=edp-v11 across puture-en.html and home5.tsx');
console.log('All enhancements applied successfully!');

