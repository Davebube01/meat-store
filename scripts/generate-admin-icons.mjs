// One-off generator for the admin PWA's icons, derived from the mark already
// used in AdminSidebar.tsx (a green rounded square with Lucide's "Store"
// icon). Re-run with `node scripts/generate-admin-icons.mjs` if that mark
// ever changes. Swap these for real designed icons whenever they're ready —
// nothing else needs to change, the manifest just points at these filenames.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "admin", "icons");
mkdirSync(outDir, { recursive: true });

// Lucide "store" icon path data (stroke-based, 24x24 viewBox) — copied from
// node_modules/lucide-react/dist/esm/icons/store.js so the derived mark
// matches AdminSidebar.tsx exactly.
const STORE_PATHS = [
  "M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5",
  "M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",
  "M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05",
];

function storeGlyph(scale, strokeWidth) {
  // Path data is drawn in a 24x24 box; center it at the origin, then the
  // caller positions/scales the whole group.
  const d = STORE_PATHS.map((d) => `<path d="${d}"/>`).join("");
  return `<g transform="scale(${scale}) translate(-12,-12)" fill="none" stroke="#fff" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
}

function icon({ size, cornerPct, glyphScale, strokeWidth }) {
  const r = size * cornerPct;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#22c55e"/>
        <stop offset="1" stop-color="#15803d"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
    <g transform="translate(${size / 2},${size / 2})">${storeGlyph((size * glyphScale) / 24, strokeWidth)}</g>
  </svg>`;
}

const targets = [
  // Standard icons: rounded-square background (matches the sidebar mark),
  // glyph fills most of the icon since OSes won't mask these further.
  { file: "icon-192.png", size: 192, cornerPct: 0.22, glyphScale: 0.6, strokeWidth: 1.6 },
  { file: "icon-512.png", size: 512, cornerPct: 0.22, glyphScale: 0.6, strokeWidth: 1.6 },
  // Maskable: edge-to-edge fill (the OS applies its own shape mask) with the
  // glyph shrunk well inside the ~80% "safe zone" so it survives any mask.
  { file: "icon-maskable-512.png", size: 512, cornerPct: 0, glyphScale: 0.42, strokeWidth: 1.8 },
];

for (const t of targets) {
  const svg = Buffer.from(icon(t));
  await sharp(svg).png().toFile(path.join(outDir, t.file));
  console.log("wrote", t.file);
}
