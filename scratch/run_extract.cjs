const fs = require('fs');
const content = fs.readFileSync('src/lib/edp-apps.ts', 'utf8');

const prefix = 'export const APPS: EdpApp[] = ';
const startIdx = content.indexOf(prefix);
const endIdx = content.indexOf('export const APPLICATIONS =');
const arrayContent = content.slice(startIdx + prefix.length, endIdx).trim();

// Wrap in valid JS
const code = 'const APPS = ' + arrayContent + '\nmodule.exports = APPS;\n';
fs.writeFileSync('scratch/extract_apps.cjs', code);

const APPS = require('./extract_apps.cjs');
console.log('Successfully loaded APPS:', APPS.length);
fs.writeFileSync('scratch/edp_apps_data.json', JSON.stringify(APPS, null, 2));
console.log('Saved scratch/edp_apps_data.json');
