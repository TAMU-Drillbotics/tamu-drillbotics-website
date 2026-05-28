// One-off: rasterizes the two logo SVGs to PNGs at common sizes.
// Output:
//   public/branding/logo-{256,512,1024}.png
//   public/branding/logo-on-dark-{256,512,1024}.png
//
// Usage: node scripts/render-logo-pngs.mjs

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const BRAND = path.join(ROOT, 'public', 'branding');

const sources = [
  { svg: 'logo.svg', basePng: 'logo' },
  { svg: 'logo-on-dark.svg', basePng: 'logo-on-dark' },
];
const sizes = [256, 512, 1024];

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  try {
    for (const src of sources) {
      const svgText = await readFile(path.join(BRAND, src.svg), 'utf8');
      for (const size of sizes) {
        const page = await browser.newPage();
        await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
        const html = `<!doctype html><html><body style="margin:0;background:transparent;">
          <div style="width:${size}px;height:${size}px;">${svgText.replace(
          /<svg([^>]*)>/,
          `<svg$1 width="${size}" height="${size}">`,
        )}</div></body></html>`;
        await page.setContent(html, { waitUntil: 'load' });
        const out = path.join(BRAND, `${src.basePng}-${size}.png`);
        await page.screenshot({ path: out, omitBackground: true, type: 'png' });
        await page.close();
        console.log(`  wrote ${path.relative(ROOT, out)}`);
      }
    }
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
