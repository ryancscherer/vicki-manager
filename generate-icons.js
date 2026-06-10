/**
 * generate-icons.js
 * Run once with Node.js to produce PNG icons from icon.svg
 *
 * Requirements:
 *   npm install sharp
 *
 * Usage:
 *   node generate-icons.js
 */

const fs   = require('fs');
const path = require('path');

// Try sharp (recommended)
try {
  const sharp = require('sharp');
  const svgBuf = fs.readFileSync(path.join(__dirname, 'icons', 'icon.svg'));
  const sizes = [48, 72, 96, 144, 192, 512];

  (async () => {
    for (const size of sizes) {
      await sharp(svgBuf)
        .resize(size, size)
        .png()
        .toFile(path.join(__dirname, 'icons', `icon-${size}.png`));
      console.log(`✅ icon-${size}.png`);
    }

    // Feature graphic 1024x500
    await sharp(svgBuf)
      .resize(512, 512)
      .extend({ top: 0, bottom: 0, left: 256, right: 256, background: { r: 15, g: 61, b: 26, alpha: 1 } })
      .png()
      .toFile(path.join(__dirname, 'icons', 'feature-graphic-1024x500.png'));
    console.log('✅ feature-graphic-1024x500.png');

    console.log('\n🎉 All icons generated!');
  })();

} catch (e) {
  console.log('sharp not found. Install it with: npm install sharp');
  console.log('Then run: node generate-icons.js');
}
