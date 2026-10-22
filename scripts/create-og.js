const sharp = require('sharp');
const fs = require('fs');

async function generateOG() {
  // 1. Prepare cat cutouts/resizes
  // Cat height 560px on 630px canvas
  const catBuffer = await sharp('public/images/cat.png')
    .resize({ height: 560, fit: 'contain' })
    .toBuffer();

  // Create 1200x630 SVG overlay with text and subtle stars/glow
  const svgOverlay = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stop-color="#80183b" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="#520c22" stop-opacity="1"/>
          <stop offset="100%" stop-color="#380514" stop-opacity="1"/>
        </radialGradient>
        <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#dfc08f"/>
          <stop offset="50%" stop-color="#f7eedc"/>
          <stop offset="100%" stop-color="#dfc08f"/>
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bgGlow)"/>
      
      <!-- Gold Frame -->
      <rect x="25" y="25" width="1150" height="580" rx="20" fill="none" stroke="url(#goldBorder)" stroke-width="3" stroke-opacity="0.6"/>
      <rect x="35" y="35" width="1130" height="560" rx="15" fill="none" stroke="url(#goldBorder)" stroke-width="1" stroke-opacity="0.3"/>
      
      <!-- Decorative Sparkles -->
      <text x="120" y="140" fill="#dfc08f" font-size="28" opacity="0.8">✦</text>
      <text x="1080" y="140" fill="#dfc08f" font-size="28" opacity="0.8">✦</text>
      <text x="160" y="490" fill="#dfc08f" font-size="24" opacity="0.6">✧</text>
      <text x="1040" y="490" fill="#dfc08f" font-size="24" opacity="0.6">✧</text>

      <!-- Badge / Header Text -->
      <rect x="425" y="55" width="350" height="42" rx="21" fill="rgba(223, 192, 143, 0.2)" stroke="#dfc08f" stroke-width="1.5"/>
      <text x="600" y="83" font-family="'Nunito', sans-serif" font-weight="800" font-size="19" fill="#f7eedc" text-anchor="middle" letter-spacing="3">HAPPY BIRTHDAY AHMED</text>

      <!-- Footer Text -->
      <text x="600" y="585" font-family="'Playfair Display', serif" font-weight="700" font-size="24" fill="#dfc08f" text-anchor="middle" letter-spacing="2">A Special Gift For You 🎁</text>
    </svg>
  `);

  // Composite cat over SVG
  const og1200 = await sharp(svgOverlay)
    .composite([
      { input: catBuffer, top: 40, left: Math.round((1200 - 315) / 2) } // centered cat
    ])
    .jpeg({ quality: 90 })
    .toBuffer();

  fs.writeFileSync('public/images/og-cat.jpg', og1200);
  fs.writeFileSync('public/images/share-cover.jpg', og1200);

  // Also create a PNG version
  const og1200Png = await sharp(svgOverlay)
    .composite([
      { input: catBuffer, top: 40, left: Math.round((1200 - 315) / 2) }
    ])
    .png({ quality: 90 })
    .toBuffer();
  fs.writeFileSync('public/images/og-cat.png', og1200Png);
  fs.writeFileSync('public/images/share-cover.png', og1200Png);

  // Also create a square 600x600 preview (some apps prefer 1:1)
  const catSquareBuffer = await sharp('public/images/cat.png')
    .resize({ height: 500, fit: 'contain' })
    .toBuffer();

  const squareSvg = Buffer.from(`
    <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGlowSq" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stop-color="#80183b" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#380514" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="600" height="600" fill="url(#bgGlowSq)"/>
      <rect x="15" y="15" width="570" height="570" rx="16" fill="none" stroke="#dfc08f" stroke-width="2" stroke-opacity="0.6"/>
    </svg>
  `);

  const squareJpg = await sharp(squareSvg)
    .composite([
      { input: catSquareBuffer, gravity: 'center' }
    ])
    .jpeg({ quality: 90 })
    .toBuffer();

  fs.writeFileSync('public/images/cat-square.jpg', squareJpg);

  console.log('OG images successfully generated:');
  console.log('og-cat.jpg size:', fs.statSync('public/images/og-cat.jpg').size);
  console.log('og-cat.png size:', fs.statSync('public/images/og-cat.png').size);
  console.log('cat-square.jpg size:', fs.statSync('public/images/cat-square.jpg').size);
}

generateOG().catch(console.error);
