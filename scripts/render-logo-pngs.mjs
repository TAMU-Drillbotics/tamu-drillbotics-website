// One-off: derives every shipped logo raster from the single master artwork.
//
// Input:
//   public/branding/logo-master.webp  (maroon #500000 mark on transparency)
//
// Output:
//   public/branding/logo-{256,512,1024}.png          maroon, for light surfaces
//   public/branding/logo-on-dark-{256,512,1024}.png  white,  for dark surfaces
//   public/branding/icon-{32,180}.png                favicon / apple-touch, on a white plate
//   public/favicon.ico                               PNG-in-ICO wrapper around icon-32
//
// The master is trimmed to its ink and padded back out to a true square: the
// source art is a couple of pixels off-center, which reads as a crooked frame
// once the mark is scaled down to nav size.
//
// Usage: node scripts/render-logo-pngs.mjs
// (sharp is not a direct dependency — it ships inside next.)

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const BRAND = path.join(ROOT, 'public', 'branding');

const MASTER = path.join(BRAND, 'logo-master.webp');
const SIZES = [256, 512, 1024];
const ICON_SIZES = [32, 180];

/** Trim to the opaque bounding box, then pad the short axis back to square. */
async function squaredMaster() {
  const trimmed = await sharp(MASTER)
    .ensureAlpha()
    .trim({ threshold: 10 })
    .png()
    .toBuffer();

  const { width, height } = await sharp(trimmed).metadata();
  const side = Math.max(width, height);
  const dx = side - width;
  const dy = side - height;

  return sharp(trimmed)
    .extend({
      left: Math.floor(dx / 2),
      right: Math.ceil(dx / 2),
      top: Math.floor(dy / 2),
      bottom: Math.ceil(dy / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

/** Repaint every pixel solid `rgb`, keeping the master's alpha as the stencil. */
async function tint(master, size, rgb) {
  const scaled = await sharp(master)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .png()
    .toBuffer();

  const alpha = await sharp(scaled).extractChannel('alpha').raw().toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 3, background: rgb },
  })
    .joinChannel(alpha, { raw: { width: size, height: size, channels: 1 } })
    .png()
    .toBuffer();
}

/** Wrap a PNG in a single-image ICO container (PNG-in-ICO, universally supported). */
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette size
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  return Buffer.concat([header, entry, png]);
}

async function run() {
  const master = await squaredMaster();
  const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');

  for (const size of SIZES) {
    const maroon = await tint(master, size, { r: 0x50, g: 0x00, b: 0x00 });
    const white = await tint(master, size, { r: 0xff, g: 0xff, b: 0xff });

    const a = path.join(BRAND, `logo-${size}.png`);
    const b = path.join(BRAND, `logo-on-dark-${size}.png`);
    await writeFile(a, maroon);
    await writeFile(b, white);
    console.log(`  wrote ${rel(a)}`);
    console.log(`  wrote ${rel(b)}`);
  }

  // Browser chrome can be light or dark, and the mark's interior is transparent,
  // so the icon variants get an opaque white plate to stay legible on both.
  for (const size of ICON_SIZES) {
    const maroon = await tint(master, size, { r: 0x50, g: 0x00, b: 0x00 });
    const plated = await sharp({
      create: { width: size, height: size, channels: 4, background: '#FFFFFF' },
    })
      .composite([{ input: maroon }])
      .png()
      .toBuffer();

    const out = path.join(BRAND, `icon-${size}.png`);
    await writeFile(out, plated);
    console.log(`  wrote ${rel(out)}`);

    if (size === 32) {
      const ico = path.join(ROOT, 'public', 'favicon.ico');
      await writeFile(ico, pngToIco(plated, size));
      console.log(`  wrote ${rel(ico)}`);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
