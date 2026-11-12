const fs = require('fs');
const content = fs.readFileSync('src/lib/edp-apps.ts', 'utf8');

const thumbs = [
  "img-97.jpg",
  "img-65.png",
  "img-285.jpg",
  "img-101.jpg",
  "img-90.jpg",
  "img-81.png",
  "img-106.png",
  "img-79.jpg",
  "img-87.jpg",
  "img-100.png",
  "img-104.png",
  "img-110.png"
];

thumbs.forEach(t => {
  const idx = content.indexOf(t);
  if (idx !== -1) {
    const before = content.slice(Math.max(0, idx - 400), idx + 200);
    const nameMatch = before.match(/name:\s*"([^"]+)"/);
    const descMatch = before.match(/desc:\s*"([^"]+)"/);
    console.log(t, '->', nameMatch ? nameMatch[1] : 'unknown', '|', descMatch ? descMatch[1].slice(0, 80) : '');
  } else {
    console.log(t, '-> not found in edp-apps.ts');
  }
});
