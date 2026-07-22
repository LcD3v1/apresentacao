/**
 * Gerador de imagens temporarias com tema arabe.
 *
 * Produz arte vetorial (SVG) em /public/images: dunas, arcos, mosaicos,
 * skylines noturnos e retratos em silhueta. Tudo local, sem rede,
 * reproduzivel e leve — substitua pelos arquivos reais quando tiver.
 *
 *   npm run assets
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images');
mkdirSync(outDir, { recursive: true });

/* ---------------------------------------------------------------- utils */

const seeded = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const n = (v) => Number(v.toFixed(1));

const write = (name, svg) => {
  writeFileSync(join(outDir, name), svg.replace(/\n\s+/g, '\n').trim() + '\n', 'utf8');
  return name;
};

/* -------------------------------------------------------------- shapes */

function dunePath(w, h, baseY, amp, freq, phase) {
  const steps = 64;
  let d = `M 0 ${h} L 0 ${n(baseY)}`;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = w * t;
    const y =
      baseY -
      Math.sin(t * Math.PI * freq + phase) * amp -
      Math.sin(t * Math.PI * freq * 2.4 + phase * 1.7) * amp * 0.32;
    d += ` L ${n(x)} ${n(y)}`;
  }
  return `${d} L ${w} ${h} Z`;
}

function archPath(cx, baseY, w, h) {
  const half = w / 2;
  const spring = baseY - h * 0.52;
  const apex = baseY - h;
  return [
    `M ${n(cx - half)} ${n(baseY)}`,
    `L ${n(cx - half)} ${n(spring)}`,
    `Q ${n(cx - half)} ${n(spring - h * 0.26)} ${n(cx - half * 0.45)} ${n(spring - h * 0.34)}`,
    `Q ${n(cx)} ${n(spring - h * 0.28)} ${n(cx)} ${n(apex)}`,
    `Q ${n(cx)} ${n(spring - h * 0.28)} ${n(cx + half * 0.45)} ${n(spring - h * 0.34)}`,
    `Q ${n(cx + half)} ${n(spring - h * 0.26)} ${n(cx + half)} ${n(spring)}`,
    `L ${n(cx + half)} ${n(baseY)} Z`,
  ].join(' ');
}

function stars(w, h, count, rand, maxY = 1) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = n(rand() * w);
    const y = n(rand() * h * maxY);
    const r = n(0.6 + rand() * 1.9);
    const o = (0.18 + rand() * 0.7).toFixed(2);
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${o}"/>`;
  }
  return out;
}

function particles(w, h, count, rand, color = '#d4af37') {
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = n(rand() * w);
    const y = n(h * 0.35 + rand() * h * 0.65);
    const r = n(0.8 + rand() * 2.4);
    const o = (0.1 + rand() * 0.45).toFixed(2);
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${o}"/>`;
  }
  return out;
}

function skyline(w, baseY, rand, fill) {
  let out = '';
  let x = -40;
  while (x < w + 40) {
    const bw = 40 + rand() * 90;
    const bh = 90 + rand() * 320;
    const y = baseY - bh;
    out += `<rect x="${n(x)}" y="${n(y)}" width="${n(bw)}" height="${n(bh)}" fill="${fill}"/>`;
    if (rand() > 0.72) {
      out += `<rect x="${n(x + bw * 0.35)}" y="${n(y - 60 - rand() * 90)}" width="${n(bw * 0.3)}" height="70" fill="${fill}"/>`;
    }
    // janelas acesas
    const cols = Math.max(1, Math.floor(bw / 22));
    const rows = Math.max(2, Math.floor(bh / 34));
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (rand() > 0.78) {
          out += `<rect x="${n(x + 8 + c * 22)}" y="${n(y + 14 + r * 34)}" width="6" height="10" fill="#f1d77a" opacity="${(0.25 + rand() * 0.5).toFixed(2)}"/>`;
        }
      }
    }
    x += bw + 8 + rand() * 26;
  }
  return out;
}

function domes(w, baseY, rand, fill) {
  let out = '';
  let x = 60;
  while (x < w - 60) {
    const r = 30 + rand() * 55;
    out += `<path d="M ${n(x - r)} ${n(baseY)} A ${n(r)} ${n(r * 1.25)} 0 0 1 ${n(x + r)} ${n(baseY)} Z" fill="${fill}"/>`;
    out += `<rect x="${n(x - r)} " y="${n(baseY)}" width="${n(r * 2)}" height="${n(r * 1.4)}" fill="${fill}"/>`;
    // minarete
    if (rand() > 0.5) {
      const mx = x + r + 26;
      const mh = 120 + rand() * 110;
      out += `<rect x="${n(mx)}" y="${n(baseY - mh)}" width="16" height="${n(mh)}" fill="${fill}"/>`;
      out += `<path d="M ${n(mx - 8)} ${n(baseY - mh)} L ${n(mx + 8)} ${n(baseY - mh)} L ${n(mx)} ${n(baseY - mh - 34)} Z" fill="${fill}"/>`;
    }
    x += r * 2 + 70 + rand() * 90;
  }
  return out;
}

/* ------------------------------------------------------------ defs base */

/**
 * Vinheta suave de topo, no lugar de uma textura de grao.
 *
 * Grao custa caro aqui: feTurbulence sobre 1920x1080 e um mosaico de pontos
 * finos geram dezenas de milhares de formas por imagem, e com uma dezena
 * dessas imagens na pagina o navegador trava. O acabamento fotografico vem
 * dos degrades e da vinheta.
 */
const grain = (id) => `
<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#000" stop-opacity="0.35"/>
  <stop offset="35%" stop-color="#000" stop-opacity="0"/>
</linearGradient>`;

const starTile = (id, stroke = '#d4af37', opacity = 0.16) => `
<pattern id="${id}" width="120" height="120" patternUnits="userSpaceOnUse">
  <g fill="none" stroke="${stroke}" stroke-width="1" opacity="${opacity}">
    <path d="M60 6 L84 36 L114 60 L84 84 L60 114 L36 84 L6 60 L36 36 Z"/>
    <path d="M60 24 L96 60 L60 96 L24 60 Z"/>
    <rect x="24" y="24" width="72" height="72" transform="rotate(45 60 60)"/>
    <circle cx="60" cy="60" r="10"/>
    <path d="M0 0 L120 120 M120 0 L0 120" opacity="0.35"/>
  </g>
</pattern>`;

const vignette = (id, strength = 0.85) => `
<radialGradient id="${id}" cx="50%" cy="45%" r="78%">
  <stop offset="45%" stop-color="#000" stop-opacity="0"/>
  <stop offset="100%" stop-color="#000" stop-opacity="${strength}"/>
</radialGradient>`;

/* --------------------------------------------------------------- cenas */

function nightDesertCity(w, h, seed, opts = {}) {
  const rand = seeded(seed);
  const { accent = '#009b63', warm = '#d4af37', city = true } = opts;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#02110c"/>
    <stop offset="42%" stop-color="#04231a"/>
    <stop offset="72%" stop-color="#0d2b1f"/>
    <stop offset="100%" stop-color="#1a1a12"/>
  </linearGradient>
  <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="${warm}" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="${warm}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="horizon" cx="50%" cy="100%" r="70%">
    <stop offset="0%" stop-color="${accent}" stop-opacity="0.42"/>
    <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="d1" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3a3021"/><stop offset="100%" stop-color="#14120c"/>
  </linearGradient>
  <linearGradient id="d2" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#241f16"/><stop offset="100%" stop-color="#0a0a07"/>
  </linearGradient>
  ${starTile('pat', warm, 0.1)}
  ${vignette('vig', 0.92)}
  ${grain('grain', 0.14)}
</defs>
<g>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <rect width="${w}" height="${h}" fill="url(#pat)" opacity="0.5"/>
  ${stars(w, h, 220, rand, 0.72)}
  <circle cx="${n(w * 0.74)}" cy="${n(h * 0.2)}" r="${n(h * 0.22)}" fill="url(#moonGlow)"/>
  <circle cx="${n(w * 0.74)}" cy="${n(h * 0.2)}" r="${n(h * 0.045)}" fill="#f1d77a" opacity="0.9"/>
  <rect width="${w}" height="${h}" fill="url(#horizon)"/>
  ${city ? `<g opacity="0.9">${skyline(w, h * 0.7, rand, '#07100c')}</g>` : `<g opacity="0.85">${domes(w, h * 0.7, rand, '#07100c')}</g>`}
  <path d="${dunePath(w, h, h * 0.72, h * 0.05, 2.1, 0.8)}" fill="url(#d1)" opacity="0.95"/>
  <path d="${dunePath(w, h, h * 0.84, h * 0.06, 1.6, 2.4)}" fill="url(#d2)"/>
  ${particles(w, h, 90, rand, warm)}
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" fill="url(#grain)"/>
</g>
</svg>`;
}

function sunsetDunes(w, h, seed) {
  const rand = seeded(seed);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#08120e"/>
    <stop offset="38%" stop-color="#2a2113"/>
    <stop offset="66%" stop-color="#7a5a22"/>
    <stop offset="88%" stop-color="#d4af37"/>
    <stop offset="100%" stop-color="#f1d77a"/>
  </linearGradient>
  <radialGradient id="sun" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#fff3c4" stop-opacity="0.95"/>
    <stop offset="45%" stop-color="#f1d77a" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="dA" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#6b5527"/><stop offset="100%" stop-color="#1d1810"/>
  </linearGradient>
  <linearGradient id="dB" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2f2716"/><stop offset="100%" stop-color="#0b0a07"/>
  </linearGradient>
  ${vignette('vig', 0.9)}
  ${grain('grain', 0.17)}
</defs>
<g>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  ${stars(w, h, 120, rand, 0.4)}
  <circle cx="${n(w * 0.5)}" cy="${n(h * 0.62)}" r="${n(h * 0.34)}" fill="url(#sun)"/>
  <circle cx="${n(w * 0.5)}" cy="${n(h * 0.62)}" r="${n(h * 0.07)}" fill="#fff6d5" opacity="0.85"/>
  <path d="${dunePath(w, h, h * 0.66, h * 0.045, 1.8, 1.2)}" fill="url(#dA)" opacity="0.9"/>
  <path d="${dunePath(w, h, h * 0.78, h * 0.06, 2.6, 3.1)}" fill="url(#dB)"/>
  <path d="${dunePath(w, h, h * 0.92, h * 0.04, 1.3, 0.4)}" fill="#070604"/>
  ${particles(w, h, 110, rand, '#f1d77a')}
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" fill="url(#grain)"/>
</g>
</svg>`;
}

function archCorridor(w, h, seed) {
  const rand = seeded(seed);
  let arcs = '';
  const count = 5;
  for (let i = 0; i < count; i++) {
    const scale = 1 - i * 0.13;
    const aw = w * 0.62 * scale;
    const ah = h * 0.78 * scale;
    const opacity = (0.14 + i * 0.14).toFixed(2);
    arcs += `<path d="${archPath(w / 2, h * 0.95, aw, ah)}" fill="none" stroke="#d4af37" stroke-width="${n(3 - i * 0.35)}" opacity="${opacity}"/>`;
    arcs += `<path d="${archPath(w / 2, h * 0.95, aw * 0.9, ah * 0.92)}" fill="#03100b" opacity="${(0.18 + i * 0.12).toFixed(2)}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#050706"/><stop offset="55%" stop-color="#0b110e"/><stop offset="100%" stop-color="#040604"/>
  </linearGradient>
  <radialGradient id="depth" cx="50%" cy="72%" r="46%">
    <stop offset="0%" stop-color="#f1d77a" stop-opacity="0.5"/>
    <stop offset="55%" stop-color="#006c45" stop-opacity="0.22"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  ${starTile('pat', '#d4af37', 0.14)}
  ${vignette('vig', 0.88)}
  ${grain('grain', 0.15)}
</defs>
<g>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#pat)"/>
  <rect width="${w}" height="${h}" fill="url(#depth)"/>
  ${arcs}
  <rect x="0" y="${n(h * 0.95)}" width="${w}" height="${n(h * 0.05)}" fill="#020403"/>
  ${particles(w, h, 70, rand)}
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" fill="url(#grain)"/>
</g>
</svg>`;
}

function mosaic(w, h, seed, accent = '#006c45') {
  const rand = seeded(seed);
  let tiles = '';
  const size = 96;
  for (let y = 0; y < h + size; y += size) {
    for (let x = 0; x < w + size; x += size) {
      const roll = rand();
      const fill = roll > 0.86 ? '#d4af37' : roll > 0.7 ? accent : roll > 0.5 ? '#111a15' : '#0b110e';
      const o = (0.25 + rand() * 0.6).toFixed(2);
      tiles += `<rect x="${x}" y="${y}" width="${size - 6}" height="${size - 6}" transform="rotate(45 ${x + size / 2} ${y + size / 2})" fill="${fill}" opacity="${o}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
<defs>
  ${vignette('vig', 0.9)}
  ${grain('grain', 0.14)}
  <radialGradient id="lamp" cx="50%" cy="40%" r="60%">
    <stop offset="0%" stop-color="#f1d77a" stop-opacity="0.35"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
</defs>
<g>
  <rect width="${w}" height="${h}" fill="#050706"/>
  ${tiles}
  <rect width="${w}" height="${h}" fill="url(#lamp)"/>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" fill="url(#grain)"/>
</g>
</svg>`;
}

/** Retrato em silhueta com contraluz — masculino (ghutra) ou feminino (shayla). */
function portrait(w, h, seed, opts = {}) {
  const rand = seeded(seed);
  const { accent = '#009b63', warm = '#d4af37', headwear = 'ghutra' } = opts;
  const cx = w / 2;
  const shoulderTop = h * 0.68;
  const headCy = h * 0.4;

  const body = `M ${n(cx - w * 0.42)} ${h}
    C ${n(cx - w * 0.4)} ${n(shoulderTop + h * 0.14)} ${n(cx - w * 0.26)} ${n(shoulderTop - h * 0.02)} ${n(cx - w * 0.13)} ${n(shoulderTop - h * 0.05)}
    L ${n(cx + w * 0.13)} ${n(shoulderTop - h * 0.05)}
    C ${n(cx + w * 0.26)} ${n(shoulderTop - h * 0.02)} ${n(cx + w * 0.4)} ${n(shoulderTop + h * 0.14)} ${n(cx + w * 0.42)} ${h} Z`;

  const drape =
    headwear === 'ghutra'
      ? `M ${n(cx - w * 0.19)} ${n(shoulderTop - h * 0.01)}
         C ${n(cx - w * 0.23)} ${n(headCy + h * 0.12)} ${n(cx - w * 0.2)} ${n(headCy - h * 0.11)} ${n(cx)} ${n(headCy - h * 0.14)}
         C ${n(cx + w * 0.2)} ${n(headCy - h * 0.11)} ${n(cx + w * 0.23)} ${n(headCy + h * 0.12)} ${n(cx + w * 0.19)} ${n(shoulderTop - h * 0.01)} Z`
      : `M ${n(cx - w * 0.2)} ${n(shoulderTop + h * 0.04)}
         C ${n(cx - w * 0.24)} ${n(headCy + h * 0.1)} ${n(cx - w * 0.19)} ${n(headCy - h * 0.12)} ${n(cx)} ${n(headCy - h * 0.13)}
         C ${n(cx + w * 0.19)} ${n(headCy - h * 0.12)} ${n(cx + w * 0.24)} ${n(headCy + h * 0.1)} ${n(cx + w * 0.2)} ${n(shoulderTop + h * 0.04)} Z`;

  const agal =
    headwear === 'ghutra'
      ? `<g fill="none" stroke="#0a0a08" stroke-width="${n(h * 0.012)}" opacity="0.95">
           <ellipse cx="${n(cx)}" cy="${n(headCy - h * 0.085)}" rx="${n(w * 0.155)}" ry="${n(h * 0.022)}"/>
           <ellipse cx="${n(cx)}" cy="${n(headCy - h * 0.055)}" rx="${n(w * 0.16)}" ry="${n(h * 0.022)}"/>
         </g>`
      : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#081410"/><stop offset="60%" stop-color="#0b110e"/><stop offset="100%" stop-color="#040604"/>
  </linearGradient>
  <radialGradient id="back" cx="50%" cy="38%" r="52%">
    <stop offset="0%" stop-color="${warm}" stop-opacity="0.55"/>
    <stop offset="48%" stop-color="${accent}" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="figure" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#141a16"/><stop offset="70%" stop-color="#080b09"/><stop offset="100%" stop-color="#030403"/>
  </linearGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${warm}" stop-opacity="0.85"/>
    <stop offset="35%" stop-color="${warm}" stop-opacity="0"/>
    <stop offset="72%" stop-color="${accent}" stop-opacity="0"/>
    <stop offset="100%" stop-color="${accent}" stop-opacity="0.7"/>
  </linearGradient>
  ${starTile('pat', warm, 0.12)}
  ${vignette('vig', 0.92)}
  ${grain('grain', 0.18)}
  <clipPath id="figClip"><path d="${body}"/><path d="${drape}"/></clipPath>
</defs>
<g>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#pat)"/>
  <path d="${archPath(cx, h * 0.99, w * 0.86, h * 0.86)}" fill="none" stroke="${warm}" stroke-width="2" opacity="0.28"/>
  <path d="${archPath(cx, h * 0.99, w * 0.7, h * 0.74)}" fill="url(#back)" opacity="0.9"/>
  ${particles(w, h, 60, rand, warm)}
  <g>
    <path d="${drape}" fill="url(#figure)"/>
    <ellipse cx="${n(cx)}" cy="${n(headCy)}" rx="${n(w * 0.115)}" ry="${n(h * 0.095)}" fill="url(#figure)"/>
    <rect x="${n(cx - w * 0.055)}" y="${n(headCy + h * 0.06)}" width="${n(w * 0.11)}" height="${n(h * 0.12)}" fill="#070a08"/>
    <path d="${body}" fill="url(#figure)"/>
    ${agal}
    <g clip-path="url(#figClip)">
      <rect width="${w}" height="${h}" fill="url(#rim)" opacity="0.5"/>
    </g>
  </g>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" fill="url(#grain)"/>
  <rect x="14" y="14" width="${w - 28}" height="${h - 28}" fill="none" stroke="${warm}" stroke-width="1.5" opacity="0.3"/>
</g>
</svg>`;
}

function videoThumb(w, h, seed, opts = {}) {
  const rand = seeded(seed);
  const { accent = '#009b63', warm = '#d4af37' } = opts;
  const cx = w / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#030b08"/><stop offset="55%" stop-color="#0a1f16"/><stop offset="100%" stop-color="#1c1710"/>
  </linearGradient>
  <radialGradient id="glow" cx="50%" cy="62%" r="46%">
    <stop offset="0%" stop-color="${warm}" stop-opacity="0.55"/>
    <stop offset="55%" stop-color="${accent}" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="dune" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2b2416"/><stop offset="100%" stop-color="#080906"/>
  </linearGradient>
  ${starTile('pat', warm, 0.1)}
  ${vignette('vig', 0.9)}
  ${grain('grain', 0.16)}
</defs>
<g>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <rect width="${w}" height="${h}" fill="url(#pat)" opacity="0.6"/>
  ${stars(w, h, 130, rand, 0.6)}
  <path d="${archPath(cx, h * 0.86, w * 0.42, h * 0.72)}" fill="url(#glow)"/>
  <path d="${archPath(cx, h * 0.86, w * 0.42, h * 0.72)}" fill="none" stroke="${warm}" stroke-width="2.5" opacity="0.55"/>
  <path d="${dunePath(w, h, h * 0.8, h * 0.05, 2.2, 1.4)}" fill="url(#dune)"/>
  <path d="${dunePath(w, h, h * 0.92, h * 0.035, 1.5, 2.9)}" fill="#050604"/>
  <ellipse cx="${n(cx)}" cy="${n(h * 0.79)}" rx="${n(w * 0.02)}" ry="${n(h * 0.09)}" fill="#040705"/>
  ${particles(w, h, 80, rand, warm)}
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" fill="url(#grain)"/>
  <rect x="0" y="0" width="${w}" height="${n(h * 0.06)}" fill="#000" opacity="0.85"/>
  <rect x="0" y="${n(h * 0.94)}" width="${w}" height="${n(h * 0.06)}" fill="#000" opacity="0.85"/>
</g>
</svg>`;
}

/* ------------------------------------------------------------- membros */

const accents = [
  { accent: '#009b63', warm: '#d4af37', headwear: 'ghutra' },
  { accent: '#0f7f5a', warm: '#f1d77a', headwear: 'shayla' },
  { accent: '#006c45', warm: '#c58b3d', headwear: 'ghutra' },
  { accent: '#11876b', warm: '#e0c163', headwear: 'shayla' },
  { accent: '#0a6b45', warm: '#b9793a', headwear: 'ghutra' },
  { accent: '#13a06a', warm: '#f1d77a', headwear: 'shayla' },
  { accent: '#0d8f5e', warm: '#d4af37', headwear: 'ghutra' },
  { accent: '#0b7350', warm: '#e8c874', headwear: 'shayla' },
];

const MEMBER_COUNT = 8;
const created = [];

for (let i = 0; i < MEMBER_COUNT; i++) {
  const id = String(i + 1).padStart(2, '0');
  const cfg = accents[i];
  const seed = 1000 + i * 137;

  // Retrato e fundo vetoriais servem de reserva: as fotos reais vivem em
  // public/images/ai. Video e galeria continuam usando esta arte.
  created.push(write(`member-${id}-portrait.svg`, portrait(900, 1200, seed, cfg)));
  created.push(
    write(
      `member-${id}-background.svg`,
      nightDesertCity(1600, 1000, seed + 11, { ...cfg, city: i % 2 === 0 }),
    ),
  );
  created.push(write(`member-${id}-video.svg`, videoThumb(1280, 720, seed + 23, cfg)));
  created.push(write(`member-${id}-gallery-01.svg`, archCorridor(1200, 800, seed + 31)));
  created.push(write(`member-${id}-gallery-02.svg`, sunsetDunes(1200, 800, seed + 47)));
  created.push(write(`member-${id}-gallery-03.svg`, mosaic(1200, 800, seed + 59, cfg.accent)));
}

created.push(write('hero-background.svg', nightDesertCity(1920, 1080, 77, { city: true })));
created.push(write('access-background.svg', archCorridor(1920, 1080, 313)));
created.push(write('og-image.svg', nightDesertCity(1200, 630, 505, { city: true })));

/* ---------------------------------------------------------------- logos */

/** Emblema principal: estrela de oito pontas — os oito integrantes. */
const logoPrimary = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="AL-THAMANIYA">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#f1d77a"/><stop offset="55%" stop-color="#d4af37"/><stop offset="100%" stop-color="#b9793a"/>
  </linearGradient>
</defs>
<g fill="none" stroke="url(#g)" stroke-width="2">
  <circle cx="100" cy="100" r="92" opacity="0.35"/>
  <circle cx="100" cy="100" r="84" opacity="0.6"/>
  <path d="M100 16 L124 52 L160 52 L160 88 L184 100 L160 112 L160 148 L124 148 L100 184 L76 148 L40 148 L40 112 L16 100 L40 88 L40 52 L76 52 Z" opacity="0.9"/>
  <path d="M100 40 L142 58 L160 100 L142 142 L100 160 L58 142 L40 100 L58 58 Z" stroke="#009b63" opacity="0.85"/>
  <path d="M100 58 L142 100 L100 142 L58 100 Z" opacity="0.75"/>
</g>
<path d="M100 78 L112 100 L100 122 L88 100 Z" fill="url(#g)"/>
<circle cx="100" cy="100" r="4" fill="#050706"/>
</svg>`;

/** Selo secundário: brasão com arco árabe, para a casa parceira. */
const logoSecondary = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="Selo parceiro">
<defs>
  <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f1d77a"/><stop offset="100%" stop-color="#c58b3d"/>
  </linearGradient>
</defs>
<g fill="none" stroke="url(#s)" stroke-width="2">
  <path d="M100 12 L172 44 L172 108 Q172 158 100 190 Q28 158 28 108 L28 44 Z" opacity="0.85"/>
  <path d="M100 26 L158 52 L158 106 Q158 148 100 174 Q42 148 42 106 L42 52 Z" opacity="0.4"/>
  <path d="${archPath(100, 148, 76, 92)}" stroke="#009b63" opacity="0.9"/>
  <path d="${archPath(100, 148, 50, 64)}" opacity="0.7"/>
  <path d="M62 158 H138" opacity="0.6"/>
</g>
<circle cx="100" cy="96" r="5" fill="url(#s)"/>
<path d="M100 42 L107 54 L100 66 L93 54 Z" fill="url(#s)" opacity="0.9"/>
</svg>`;

created.push(write('logo-primary.svg', logoPrimary));
created.push(write('logo-secondary.svg', logoSecondary));

// O favicon vem da logo real: veja scripts/make-favicon.mjs


console.log(`Gerados ${created.length} arquivos em public/images.`);
