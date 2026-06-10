/**
 * patch-app.js — Run once to add PWA support to app.html
 *
 * This script adds:
 *   1. PWA manifest link + meta tags (after the Google Fonts link)
 *   2. Service worker registration script (before </body>)
 *
 * Usage:
 *   1. Copy your app.html into this folder (vicki-manager/)
 *   2. Run:  node patch-app.js
 *   3. Done — app.html is now PWA-ready
 */

const fs   = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'app.html');

if (!fs.existsSync(appPath)) {
  console.error('❌  app.html not found in this folder.');
  console.error('    Copy your app.html here first, then run this script again.');
  process.exit(1);
}

let html = fs.readFileSync(appPath, 'utf8');

// ── Check if already patched ──────────────────────────────
if (html.includes('<link rel="manifest"')) {
  console.log('ℹ️  app.html already has a manifest link — nothing to do.');
  process.exit(0);
}

// ── Insertion 1: PWA meta tags after the Google Fonts link ──
const fontsLink = '<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">';

const pwaTags = [
  '<link rel="manifest" href="manifest.json">',
  '<meta name="theme-color" content="#1a6b2f">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
  '<meta name="apple-mobile-web-app-title" content="Vicki">',
].join('\n');

if (!html.includes(fontsLink)) {
  console.error('❌  Could not find the Google Fonts link in app.html.');
  console.error('    Make sure you are using the correct app.html (v1.02).');
  process.exit(1);
}

html = html.replace(fontsLink, fontsLink + '\n' + pwaTags);

// ── Insertion 2: Service worker registration before </body> ──
const swScript = `<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW registration failed:', err));
  });
}
</script>`;

html = html.replace('</body>', swScript + '\n</body>');

fs.writeFileSync(appPath, html, 'utf8');
console.log('✅  app.html patched successfully!');
console.log('    • PWA manifest link + meta tags added');
console.log('    • Service worker registration added');
console.log('');
console.log('Next: upload all files to your GitHub repo (vicki-manager/)');
