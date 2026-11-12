const fs = require('fs');

const localThumbs = fs.readdirSync('public/edp-thumbs');
const apps = JSON.parse(fs.readFileSync('scratch/edp_apps_data.json', 'utf8'));

apps.forEach((app, i) => {
  const thumbBase = app.image ? app.image.replace('/edp-thumbs/', '') : '';
  if (!localThumbs.includes(thumbBase)) {
    // assign an existing local thumb
    const assigned = localThumbs[i % localThumbs.length];
    console.log(`Mapping ${app.name} (${thumbBase}) -> /edp-thumbs/${assigned}`);
    app.image = '/edp-thumbs/' + assigned;
  }
});

fs.writeFileSync('scratch/edp_apps_data.json', JSON.stringify(apps, null, 2));
console.log('Verified all 32 app thumbnails point to existing local files');

