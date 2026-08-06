// Drives the live /capture-rig page through 240 deterministic camera angles
// and stitches the frames into a seamlessly-looping WebM + MP4 used as the
// mobile rig display (heavy WebGL is too slow on phones).
//
// Prerequisites:
//   1. A PRODUCTION server running (npm run build && npm run start).
//      Do NOT capture against `npm run dev` — the Next.js dev-tools indicator
//      renders as a floating badge and gets burned into every frame. The
//      shipped rig-loop.mp4 had exactly that, bottom-left.
//   2. devDependencies installed: puppeteer, ffmpeg-static.
//
// Usage:
//   node scripts/render-rig-video.mjs
//   RIG_CAPTURE_URL=http://localhost:3197/capture-rig node scripts/render-rig-video.mjs
//
// Anything RigViewer draws over the canvas at desktop width lands in the
// video, so overlays there must be gated on `captureMode`.
//
// Output:
//   public/models/rig-loop.webm
//   public/models/rig-loop.mp4

import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import ffmpegPath from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const URL = process.env.RIG_CAPTURE_URL ?? 'http://localhost:3000/capture-rig';
const FRAMES = 240;             // 240 frames → 8 seconds at 30fps
const FPS = 30;
const WIDTH = 1080;             // square render — fits mobile aspect
const HEIGHT = 1080;
const FRAMES_DIR = path.join(ROOT, '.rig-frames');
const OUT_DIR = path.join(ROOT, 'public', 'models');

async function run() {
  if (!ffmpegPath) {
    console.error('ffmpeg-static did not resolve a binary path.');
    process.exit(1);
  }
  console.log(`Using ffmpeg: ${ffmpegPath}`);

  // Clean + recreate the frame scratch directory.
  await rm(FRAMES_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  console.log('Launching browser…');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      // ANGLE backend gives proper hardware WebGL on Windows.
      '--use-gl=angle',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--disable-gpu-driver-bug-workarounds',
    ],
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
  });

  try {
    const page = await browser.newPage();
    page.on('console', (msg) => {
      if (msg.type() === 'error') console.error('[browser]', msg.text());
    });
    page.on('pageerror', (err) => console.error('[pageerror]', err.message));

    console.log(`Navigating to ${URL}…`);
    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60_000 });

    console.log('Waiting for rig to load and Stage to frame the camera…');
    await page.waitForFunction(
      () => (window).__rigReady === true && typeof (window).__setRigAngle === 'function',
      { timeout: 60_000 },
    );
    // Give Stage / shadows / HDRI an extra moment to settle.
    await new Promise((r) => setTimeout(r, 1500));

    console.log(`Capturing ${FRAMES} frames at ${WIDTH}×${HEIGHT}…`);
    const start = Date.now();
    for (let i = 0; i < FRAMES; i++) {
      const angle = (i / FRAMES) * Math.PI * 2;
      const ok = await page.evaluate((a) => (window).__setRigAngle?.(a), angle);
      if (!ok) throw new Error(`__setRigAngle returned false at frame ${i}`);
      // Two RAF ticks: one to apply camera position, one to render the frame.
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))),
          ),
      );
      const file = path.join(FRAMES_DIR, `frame_${String(i).padStart(4, '0')}.png`);
      await page.screenshot({ path: file, type: 'png', omitBackground: false });
      if (i % 20 === 0) {
        const pct = ((i / FRAMES) * 100).toFixed(0);
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        console.log(`  ${pct}% (${i}/${FRAMES}) — ${elapsed}s elapsed`);
      }
    }
    const captureTime = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`Captured all frames in ${captureTime}s.`);
  } finally {
    await browser.close();
  }

  const framePattern = path.join(FRAMES_DIR, 'frame_%04d.png');
  const webmOut = path.join(OUT_DIR, 'rig-loop.webm');
  const mp4Out = path.join(OUT_DIR, 'rig-loop.mp4');

  console.log('Encoding WebM (VP9)…');
  await ffmpeg([
    '-y',
    '-framerate', String(FPS),
    '-i', framePattern,
    '-c:v', 'libvpx-vp9',
    '-crf', '30',
    '-b:v', '0',
    '-pix_fmt', 'yuv420p',
    '-an',
    webmOut,
  ]);

  console.log('Encoding MP4 (H.264 — iOS Safari fallback)…');
  await ffmpeg([
    '-y',
    '-framerate', String(FPS),
    '-i', framePattern,
    '-c:v', 'libx264',
    '-crf', '23',
    '-preset', 'medium',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-an',
    mp4Out,
  ]);

  // Clean up frame directory.
  await rm(FRAMES_DIR, { recursive: true, force: true });

  console.log('\nDone:');
  console.log(`  ${path.relative(ROOT, webmOut)}`);
  console.log(`  ${path.relative(ROOT, mp4Out)}`);
}

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'inherit', 'inherit'] });
    proc.on('error', reject);
    proc.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}`));
    });
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
