const fs = require('fs');

let html = fs.readFileSync('public/puture-en.html', 'utf8');

const targetStr = `      html,
      body,
      .page,
      .page.is-light,
      .scene__frame,
      .scene__frame.chapter--light,
      [data-chapter="work"],
      #work {
        background-color: #020b09 !important;
        color: #f0fdf4 !important;
      }`;

const replacementStr = `      html,
      body {
        background-color: #020b09 !important;
        color: #f0fdf4 !important;
      }

      /* CRITICAL: Frames, scenes, and chapters MUST remain transparent so the 3D WebGL stage is fully visible */
      .page,
      .page.is-light,
      main,
      .scene,
      .scene__frame,
      .scene__frame.chapter--light,
      .scene__frame.chapter--dark,
      [data-chapter],
      #work,
      #about,
      #welcome,
      #process,
      #contact {
        background-color: transparent !important;
        background: transparent !important;
      }`;

if (html.includes(targetStr)) {
  html = html.replace(targetStr, replacementStr);
  console.log('Successfully replaced opaque frames with transparent frames in puture-en.html');
} else {
  console.warn('Target string not found in puture-en.html!');
}

// Bump cache bust to ?v=edp-v9
html = html.replaceAll('?v=edp-v8', '?v=edp-v9');
html = html.replaceAll('?v=edp-v7', '?v=edp-v9');
fs.writeFileSync('public/puture-en.html', html, 'utf8');

let home5 = fs.readFileSync('src/routes/home5.tsx', 'utf8');
home5 = home5.replaceAll('?v=edp-v8', '?v=edp-v9');
home5 = home5.replaceAll('?v=edp-v7', '?v=edp-v9');
fs.writeFileSync('src/routes/home5.tsx', home5, 'utf8');

console.log('Bumped cache bust to ?v=edp-v9 in puture-en.html and home5.tsx');

