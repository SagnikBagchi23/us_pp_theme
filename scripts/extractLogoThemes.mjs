// Offline, one-time dominant-color extraction for stock logos.
// Run: node scripts/extractLogoThemes.mjs
// Writes: assets/logoThemes.json
//
// Ports the canvas-based algorithm from gradient-test.html's
// extractDominantColor()/rgbToHsl()/mapToFamily() to Node + sharp,
// since React Native has no canvas/DOM to do this on-device.

import { readdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.join(__dirname, '..', 'assets', 'logos');
const OUT_FILE = path.join(__dirname, '..', 'assets', 'logoThemes.json');

const SAMPLE_SIZE = 50;

const FAMILIES = [
  { family: 'brown', hue: 5 },
  { family: 'red', hue: 11 },
  { family: 'orange', hue: 34 },
  { family: 'yellow', hue: 49 },
  { family: 'oliveGreen', hue: 78 },
  { family: 'mintGreen', hue: 162 },
  { family: 'skyBlue', hue: 205 },
  { family: 'blue', hue: 233 },
  { family: 'lilac', hue: 240 },
  { family: 'magenta', hue: 333 },
];

async function extractDominantColor(filePath) {
  const { data } = await sharp(filePath)
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buckets = new Map();
  let totalPixels = 0;
  let filteredPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    totalPixels++;
    if (a < 128) continue;
    if (r > 240 && g > 240 && b > 240) continue;
    if (r < 15 && g < 15 && b < 15) continue;
    filteredPixels++;
    const key = `${r >> 5},${g >> 5},${b >> 5}`;
    const bucket = buckets.get(key) ?? { count: 0, rS: 0, gS: 0, bS: 0 };
    bucket.count++;
    bucket.rS += r;
    bucket.gS += g;
    bucket.bS += b;
    buckets.set(key, bucket);
  }

  const ratio = totalPixels > 0 ? filteredPixels / totalPixels : 0;
  if (ratio < 0.05) return { r: 0, g: 0, b: 0, ratio, tooFew: true };

  let best = null;
  for (const bucket of buckets.values()) {
    if (!best || bucket.count > best.count) best = bucket;
  }
  if (!best) return { r: 0, g: 0, b: 0, ratio, tooFew: true };

  return {
    r: Math.round(best.rS / best.count),
    g: Math.round(best.gS / best.count),
    b: Math.round(best.bS / best.count),
    ratio,
    tooFew: false,
  };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function mapToFamily(rgb) {
  if (!rgb || rgb.tooFew) {
    return { family: 'grey', fallback: true, reason: 'too few chromatic pixels', hsl: { h: 0, s: 0, l: 0 } };
  }
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (hsl.s < 0.12) return { family: 'grey', fallback: true, reason: `low saturation (${Math.round(hsl.s * 100)}%)`, hsl };
  if (hsl.l < 0.08) return { family: 'grey', fallback: true, reason: `near-black (L=${Math.round(hsl.l * 100)}%)`, hsl };
  if (hsl.l > 0.92) return { family: 'grey', fallback: true, reason: `near-white (L=${Math.round(hsl.l * 100)}%)`, hsl };
  if (hsl.l > 0.82 && hsl.s < 0.35) {
    return { family: 'grey', fallback: true, reason: `washed-out (L=${Math.round(hsl.l * 100)}%, S=${Math.round(hsl.s * 100)}%)`, hsl };
  }

  let closest = null;
  let minDist = Infinity;
  for (const f of FAMILIES) {
    const dist = Math.min(Math.abs(hsl.h - f.hue), 360 - Math.abs(hsl.h - f.hue));
    if (dist < minDist) { minDist = dist; closest = f; }
  }
  return { family: closest.family, fallback: false, reason: `hue match (dist ${Math.round(minDist)}°)`, hsl };
}

async function main() {
  const files = readdirSync(LOGOS_DIR).filter((f) => f.toLowerCase().endsWith('.png'));
  const out = {};

  for (const file of files) {
    const id = path.basename(file, '.png');
    const filePath = path.join(LOGOS_DIR, file);
    const rgb = await extractDominantColor(filePath);
    const result = mapToFamily(rgb);
    out[id] = {
      family: result.family,
      dominantHex: rgb.tooFew ? '#808FA3' : rgbToHex(rgb.r, rgb.g, rgb.b),
      hsl: { h: Math.round(result.hsl.h), s: Number(result.hsl.s.toFixed(2)), l: Number(result.hsl.l.toFixed(2)) },
      fallback: result.fallback,
    };
    console.log(`${id.padEnd(8)} -> ${result.family.padEnd(10)} ${result.fallback ? `(fallback: ${result.reason})` : result.reason}`);
  }

  await writeFile(OUT_FILE, JSON.stringify(out, null, 2) + '\n');
  console.log(`\nWrote ${Object.keys(out).length} entries to ${path.relative(process.cwd(), OUT_FILE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
