const sharp = require('sharp');

async function cleanBalloon() {
  const { data, info } = await sharp('public/images/ballon.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Let's identify the hole inside '0':
  // In ballon.jpg, what are the pixels in the hole of '0'?
  // Let's sample a grid in x: 480..630, y: 530..730
  const isHole = new Uint8Array(width * height);
  // Flood fill from center of '0' (say x=500, y=600):
  // Let's find pixel at 500, 600
  const centerIdx = (600 * width + 500) * channels;
  console.log('Center 500,600:', data[centerIdx], data[centerIdx+1], data[centerIdx+2]);

  // Notice: Background is flat, neutral grayish/off-white (low saturation, saturation < 15)
  // Metallic balloon has dark reflections (black/dark grey < 180) and specular highlights with strong borders.
  // The background around the balloon is anywhere diff from (229, 229, 229) is small, OR inside the hole where color is (245..250).
  // Let's flood fill the outside from (0,0):
  const isOutside = new Uint8Array(width * height);
  const q = [0, 0];
  while (q.length > 0) {
    const x = q.shift();
    const y = q.shift();
    const idx = y * width + x;
    if (isOutside[idx]) continue;
    const s = idx * channels;
    const r = data[s], g = data[s+1], b = data[s+2];
    // Border background condition:
    // It's the smooth light grey studio background:
    // All R,G,B are > 210 and nearly identical:
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const isNeutralLight = (r > 200 && g > 200 && b > 200 && (max - min) < 15);
    if (!isNeutralLight && Math.hypot(r - 229, g - 229, b - 229) > 35) continue;

    isOutside[idx] = 1;
    if (x > 0 && !isOutside[idx - 1]) q.push(x - 1, y);
    if (x < width - 1 && !isOutside[idx + 1]) q.push(x + 1, y);
    if (y > 0 && !isOutside[idx - width]) q.push(x, y - 1);
    if (y < height - 1 && !isOutside[idx + width]) q.push(x, y + 1);
  }

  // Flood fill inside of '0':
  // Let's find seed inside '0' hole:
  // Let's find a point in 460..580, 560..680 that has max-min < 12 and r > 220:
  let seedX = -1, seedY = -1;
  for (let y = 560; y <= 680; y += 10) {
    for (let x = 460; x <= 580; x += 10) {
      const idx = (y * width + x);
      if (isOutside[idx]) continue;
      const s = idx * channels;
      const r = data[s], g = data[s+1], b = data[s+2];
      if (r > 220 && g > 220 && b > 220 && Math.max(r,g,b) - Math.min(r,g,b) < 15) {
        seedX = x;
        seedY = y;
        break;
      }
    }
    if (seedX !== -1) break;
  }
  console.log('Hole seed:', seedX, seedY);

  if (seedX !== -1) {
    const holeQ = [seedX, seedY];
    while (holeQ.length > 0) {
      const x = holeQ.shift();
      const y = holeQ.shift();
      const idx = y * width + x;
      if (isOutside[idx]) continue;
      const s = idx * channels;
      const r = data[s], g = data[s+1], b = data[s+2];
      const isNeutralLight = (r > 210 && g > 210 && b > 210 && (Math.max(r,g,b) - Math.min(r,g,b)) < 18);
      if (!isNeutralLight) continue;
      isOutside[idx] = 1;
      if (x > 0 && !isOutside[idx - 1]) holeQ.push(x - 1, y);
      if (x < width - 1 && !isOutside[idx + 1]) holeQ.push(x + 1, y);
      if (y > 0 && !isOutside[idx - width]) holeQ.push(x, y - 1);
      if (y < height - 1 && !isOutside[idx + width]) holeQ.push(x, y + 1);
    }
  }

  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * channels;
    const d = i * 4;
    if (isOutside[i]) {
      out[d] = 0;
      out[d+1] = 0;
      out[d+2] = 0;
      out[d+3] = 0;
    } else {
      out[d] = data[s];
      out[d+1] = data[s+1];
      out[d+2] = data[s+2];
      out[d+3] = 255;
    }
  }

  // Edge antialiasing:
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const d = idx * 4;
      if (out[d+3] === 255) {
        const hasOutNeighbor = isOutside[idx-1] || isOutside[idx+1] || isOutside[idx-width] || isOutside[idx+width];
        if (hasOutNeighbor) {
          const r = out[d], g = out[d+1], b = out[d+2];
          if (r > 210 && g > 210 && b > 210) {
            out[d+3] = 180;
          }
        }
      }
    }
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .trim()
    .png()
    .toFile('public/images/ballon.png');

  console.log('Saved perfect transparent ballon.png!');
}

cleanBalloon();
