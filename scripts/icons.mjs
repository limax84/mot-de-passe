// Génère les icônes PWA à partir d'un SVG (motif : champ de mot de passe lumineux).
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

function svg(maskable = false) {
  // Pour l'icône maskable, le motif est resserré dans la zone sûre (80 %).
  const s = maskable ? 0.72 : 1;
  const cy = 512;
  const dotR = 62 * s;
  const gap = 172 * s;
  const startX = 512 - 1.5 * gap;
  const dots = [0, 1, 2, 3]
    .map((i) => {
      const x = startX + i * gap;
      const gold = i === 3;
      return `
        <circle cx="${x}" cy="${cy}" r="${dotR * 1.65}" fill="${gold ? "#ffc843" : "#41d6ff"}" opacity="0.18"/>
        <circle cx="${x}" cy="${cy}" r="${dotR}" fill="${gold ? "#ffc843" : "#41d6ff"}"/>`;
    })
    .join("");
  const lineW = 3.6 * gap + 2 * dotR;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <radialGradient id="glow" cx="50%" cy="32%" r="80%">
      <stop offset="0%" stop-color="#2f6bff" stop-opacity="0.85"/>
      <stop offset="55%" stop-color="#0d1d4a"/>
      <stop offset="100%" stop-color="#040918"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" rx="${maskable ? 0 : 220}" fill="url(#glow)"/>
  ${dots}
  <rect x="${512 - lineW / 2}" y="${cy + 130 * s}" width="${lineW}" height="${26 * s}" rx="${13 * s}" fill="#ffc843" opacity="0.9"/>
</svg>`;
}

await mkdir("public/icons", { recursive: true });

await sharp(Buffer.from(svg(false))).resize(192, 192).png().toFile("public/icons/icon-192.png");
await sharp(Buffer.from(svg(false))).resize(512, 512).png().toFile("public/icons/icon-512.png");
await sharp(Buffer.from(svg(true))).resize(512, 512).png().toFile("public/icons/maskable-512.png");

console.log("Icônes générées dans public/icons/");
