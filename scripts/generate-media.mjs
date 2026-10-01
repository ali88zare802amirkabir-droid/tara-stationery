/**
 * Tara artwork generator.
 *
 * The storefront ships zero third-party assets: every product, category and
 * banner image is a small, hand-authored SVG generated here and written into
 * `public/media`. Run with `npm run media`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'public', 'media');

/* ---------------------------------------------------------------- palettes */

const PALETTES = {
  azure: { bg1: '#EEF4FF', bg2: '#DCE8FF', ink: '#2A46A6', soft: '#9BB9FB', pop: '#4A73E8' },
  sky: { bg1: '#EAF6FF', bg2: '#D3EBFF', ink: '#1F5B96', soft: '#93CBF0', pop: '#2F8AD6' },
  mint: { bg1: '#E9FAF4', bg2: '#D0F3E6', ink: '#12695A', soft: '#8FDCC6', pop: '#17A186' },
  blush: { bg1: '#FEF0F4', bg2: '#FBDEE8', ink: '#9B2B50', soft: '#F5A7C4', pop: '#E5306A' },
  sand: { bg1: '#FDF5E8', bg2: '#F8E7C8', ink: '#8A5B12', soft: '#EFCB8A', pop: '#D08A1E' },
  lilac: { bg1: '#F3F0FE', bg2: '#E4DCFD', ink: '#4A2E9E', soft: '#B9A6F5', pop: '#7C4DE8' },
  slate: { bg1: '#F1F4F9', bg2: '#DFE5EF', ink: '#33435F', soft: '#AEBBD0', pop: '#5A6B87' },
  coral: { bg1: '#FFF1EC', bg2: '#FFDCD0', ink: '#9C3A22', soft: '#F7B09B', pop: '#F06A45' },
};

/* ------------------------------------------------------------------- scene */

/** Soft background wash + dot grid, shared by every artwork. */
function backdrop(p, seed) {
  return `
  <defs>
    <linearGradient id="bg${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.bg1}"/>
      <stop offset="100%" stop-color="${p.bg2}"/>
    </linearGradient>
    <radialGradient id="glow${seed}" cx="30%" cy="22%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft${seed}" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="${p.ink}" flood-opacity="0.16"/>
    </filter>
    <pattern id="dots${seed}" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="${p.ink}" fill-opacity="0.10"/>
    </pattern>
  </defs>
  <rect width="640" height="640" fill="url(#bg${seed})"/>
  <rect width="640" height="640" fill="url(#dots${seed})"/>
  <rect width="640" height="640" fill="url(#glow${seed})"/>
  <ellipse cx="320" cy="524" rx="150" ry="24" fill="${p.ink}" fill-opacity="0.10"/>`;
}

function frame(p, seed, inner, { viewBox = '0 0 640 640' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="640" height="640" role="img">
${backdrop(p, seed)}
${inner}
</svg>
`;
}

/* ------------------------------------------------------------- illustrations
 * Each painter returns SVG markup centred around (320, 300) inside a 640² box.
 * -------------------------------------------------------------------------- */

const pen = (p) => `
  <g transform="translate(320 300) rotate(-32)" filter="url(#soft1)">
    <rect x="-26" y="-172" width="52" height="250" rx="26" fill="${p.ink}"/>
    <rect x="-26" y="-172" width="52" height="250" rx="26" fill="#ffffff" fill-opacity="0.10"/>
    <rect x="-9" y="-150" width="8" height="190" rx="4" fill="#ffffff" fill-opacity="0.22"/>
    <rect x="-26" y="46" width="52" height="34" rx="10" fill="${p.pop}"/>
    <path d="M-26 78 L26 78 L20 132 Q16 156 0 158 Q-16 156 -20 132 Z" fill="${p.soft}"/>
    <path d="M-20 132 L20 132 L0 158 Z" fill="${p.ink}" fill-opacity="0.35"/>
    <path d="M-26 78 L26 78 L22 96 L-22 96 Z" fill="${p.ink}" fill-opacity="0.22"/>
  </g>`;

const pencil = (p) => `
  <g transform="translate(320 300) rotate(-18)" filter="url(#soft2)">
    <rect x="-30" y="-190" width="60" height="286" rx="8" fill="${p.pop}"/>
    <rect x="-30" y="-190" width="22" height="286" fill="#ffffff" fill-opacity="0.16"/>
    <rect x="-30" y="-190" width="60" height="286" rx="8" fill="none" stroke="${p.ink}" stroke-opacity="0.18" stroke-width="2"/>
    <path d="M-30 -190 L30 -190 L0 -252 Z" fill="#F7E3C4"/>
    <path d="M-13 -212 L13 -212 L0 -252 Z" fill="${p.ink}"/>
    <rect x="-30" y="-190" width="60" height="22" fill="${p.ink}" fill-opacity="0.55"/>
    <rect x="-30" y="72" width="60" height="24" rx="6" fill="${p.ink}" fill-opacity="0.75"/>
  </g>`;

const pencilSet = (p) => `
  <g filter="url(#soft3)">
    ${[
      { x: -120, rot: -22, color: p.pop },
      { x: -40, rot: -11, color: p.ink },
      { x: 40, rot: 0, color: p.soft },
      { x: 120, rot: 12, color: p.pop },
    ]
      .map(
        ({ x, rot, color }) => `
    <g transform="translate(${320 + x} 300) rotate(${rot})">
      <rect x="-19" y="-150" width="38" height="222" rx="6" fill="${color}"/>
      <path d="M-19 -150 L19 -150 L0 -196 Z" fill="#F7E3C4"/>
      <path d="M-8 -166 L8 -166 L0 -196 Z" fill="${p.ink}" fill-opacity="0.8"/>
      <rect x="-19" y="52" width="38" height="20" rx="5" fill="${p.ink}" fill-opacity="0.35"/>
      <rect x="-19" y="-150" width="11" height="222" fill="#ffffff" fill-opacity="0.20"/>
    </g>`,
      )
      .join('')}
  </g>`;

const notebook = (p) => `
  <g transform="translate(320 300) rotate(-8)" filter="url(#soft4)">
    <rect x="-160" y="-190" width="320" height="380" rx="26" fill="${p.ink}"/>
    <rect x="-160" y="-190" width="320" height="380" rx="26" fill="#ffffff" fill-opacity="0.08"/>
    <rect x="-134" y="-176" width="268" height="352" rx="18" fill="#FFFFFF"/>
    <rect x="-134" y="-176" width="16" height="352" rx="8" fill="${p.soft}" fill-opacity="0.55"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7]
      .map((i) => `<line x1="-108" y1="${-118 + i * 34}" x2="112" y2="${-118 + i * 34}" stroke="${p.ink}" stroke-opacity="0.13" stroke-width="4" stroke-linecap="round"/>`)
      .join('')}
    <rect x="-60" y="-176" width="120" height="18" rx="9" fill="${p.pop}"/>
  </g>`;

const journal = (p) => `
  <g transform="translate(320 300) rotate(6)" filter="url(#soft5)">
    <rect x="-150" y="-186" width="300" height="372" rx="22" fill="${p.pop}"/>
    <rect x="-150" y="-186" width="150" height="372" rx="22" fill="#ffffff" fill-opacity="0.14"/>
    <rect x="-126" y="-162" width="252" height="324" rx="14" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3"/>
    <circle cx="0" cy="-40" r="58" fill="#ffffff" fill-opacity="0.16"/>
    <circle cx="0" cy="-40" r="34" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="4"/>
    <rect x="-70" y="46" width="140" height="12" rx="6" fill="#ffffff" fill-opacity="0.55"/>
    <rect x="-46" y="76" width="92" height="10" rx="5" fill="#ffffff" fill-opacity="0.32"/>
  </g>`;

const eraser = (p) => `
  <g transform="translate(320 300) rotate(-14)" filter="url(#soft6)">
    <rect x="-150" y="-92" width="300" height="184" rx="28" fill="#FFFFFF"/>
    <rect x="-150" y="-92" width="300" height="92" rx="28" fill="${p.pop}"/>
    <rect x="-150" y="-24" width="300" height="24" fill="${p.ink}" fill-opacity="0.12"/>
    <rect x="-150" y="24" width="300" height="68" rx="28" fill="${p.soft}" fill-opacity="0.35"/>
    <rect x="-118" y="-62" width="112" height="20" rx="10" fill="#ffffff" fill-opacity="0.65"/>
    <rect x="-118" y="56" width="180" height="14" rx="7" fill="${p.ink}" fill-opacity="0.16"/>
  </g>`;

const sharpener = (p) => `
  <g transform="translate(320 300) rotate(20)" filter="url(#soft7)">
    <rect x="-118" y="-104" width="236" height="150" rx="26" fill="${p.ink}"/>
    <rect x="-118" y="-104" width="236" height="150" rx="26" fill="#ffffff" fill-opacity="0.10"/>
    <ellipse cx="0" cy="-30" rx="74" ry="34" fill="${p.pop}"/>
    <ellipse cx="0" cy="-30" rx="34" ry="15" fill="${p.ink}" fill-opacity="0.55"/>
    <circle cx="0" cy="-30" r="9" fill="#ffffff" fill-opacity="0.7"/>
    <rect x="-72" y="14" width="144" height="14" rx="7" fill="#ffffff" fill-opacity="0.22"/>
    <circle cx="-84" cy="4" r="7" fill="${p.soft}"/>
    <circle cx="84" cy="4" r="7" fill="${p.soft}"/>
  </g>`;

const marker = (p) => `
  <g filter="url(#soft8)">
    <g transform="translate(230 300) rotate(-14)">
      <rect x="-40" y="-180" width="80" height="236" rx="18" fill="${p.ink}"/>
      <rect x="-40" y="-180" width="26" height="236" fill="#ffffff" fill-opacity="0.16"/>
      <path d="M-40 56 L40 56 L30 128 Q24 152 0 154 Q-24 152 -30 128 Z" fill="${p.soft}"/>
      <rect x="-40" y="-180" width="80" height="34" rx="14" fill="${p.pop}"/>
    </g>
    <g transform="translate(400 300) rotate(16)">
      <rect x="-40" y="-180" width="80" height="236" rx="18" fill="${p.pop}"/>
      <rect x="-40" y="-180" width="26" height="236" fill="#ffffff" fill-opacity="0.20"/>
      <path d="M-40 56 L40 56 L30 128 Q24 152 0 154 Q-24 152 -30 128 Z" fill="${p.ink}" fill-opacity="0.6"/>
      <rect x="-40" y="-180" width="80" height="34" rx="14" fill="${p.ink}"/>
    </g>
  </g>`;

const highlighter = (p) => `
  <g transform="translate(320 300) rotate(-26)" filter="url(#soft9)">
    <rect x="-52" y="-190" width="104" height="248" rx="18" fill="${p.pop}"/>
    <rect x="-52" y="-190" width="104" height="248" rx="18" fill="#ffffff" fill-opacity="0.14"/>
    <path d="M-52 58 L52 58 L34 150 Q28 174 0 176 Q-28 174 -34 150 Z" fill="${p.soft}"/>
    <path d="M-52 58 L52 58 L46 92 L-46 92 Z" fill="${p.ink}" fill-opacity="0.35"/>
    <rect x="-30" y="-150" width="60" height="96" rx="10" fill="#ffffff" fill-opacity="0.55"/>
    <rect x="-22" y="-134" width="44" height="8" rx="4" fill="${p.ink}" fill-opacity="0.4"/>
    <rect x="-22" y="-114" width="44" height="8" rx="4" fill="${p.ink}" fill-opacity="0.25"/>
  </g>`;

const backpack = (p) => `
  <g transform="translate(320 300)" filter="url(#soft10)">
    <path d="M-118 -120 Q-118 -190 -40 -190 L40 -190 Q118 -190 118 -120 L118 150 Q118 190 78 190 L-78 190 Q-118 190 -118 150 Z" fill="${p.ink}"/>
    <path d="M-118 -120 Q-118 -190 -40 -190 L40 -190 Q118 -190 118 -120 L118 150 Q118 190 78 190 L-78 190 Q-118 190 -118 150 Z" fill="#ffffff" fill-opacity="0.06"/>
    <path d="M-66 -186 Q0 -258 66 -186" fill="none" stroke="${p.pop}" stroke-width="16" stroke-linecap="round"/>
    <rect x="-96" y="-30" width="192" height="128" rx="26" fill="${p.pop}"/>
    <rect x="-96" y="-30" width="192" height="128" rx="26" fill="#ffffff" fill-opacity="0.12"/>
    <rect x="-58" y="6" width="116" height="14" rx="7" fill="#ffffff" fill-opacity="0.65"/>
    <rect x="-96" y="-8" width="192" height="12" rx="6" fill="${p.ink}" fill-opacity="0.45"/>
    <rect x="-84" y="-158" width="34" height="52" rx="16" fill="${p.soft}" fill-opacity="0.75"/>
    <rect x="50" y="-158" width="34" height="52" rx="16" fill="${p.soft}" fill-opacity="0.75"/>
  </g>`;

const pencilCase = (p) => `
  <g transform="translate(320 300) rotate(-6)" filter="url(#soft11)">
    <rect x="-190" y="-88" width="380" height="176" rx="60" fill="${p.pop}"/>
    <rect x="-190" y="-88" width="380" height="176" rx="60" fill="#ffffff" fill-opacity="0.14"/>
    <path d="M-190 -6 L190 -6 L190 28 L-190 28 Z" fill="${p.ink}" fill-opacity="0.35"/>
    <rect x="-152" y="-118" width="150" height="26" rx="13" fill="${p.ink}" fill-opacity="0.7"/>
    <circle cx="130" cy="0" r="26" fill="#ffffff" fill-opacity="0.65"/>
    <circle cx="130" cy="0" r="10" fill="${p.ink}" fill-opacity="0.35"/>
    <rect x="-140" y="56" width="120" height="12" rx="6" fill="#ffffff" fill-opacity="0.45"/>
  </g>`;

const ruler = (p) => `
  <g transform="translate(320 300) rotate(-38)" filter="url(#soft12)">
    <rect x="-56" y="-240" width="112" height="480" rx="20" fill="#FFFFFF"/>
    <rect x="-56" y="-240" width="112" height="480" rx="20" fill="none" stroke="${p.ink}" stroke-opacity="0.15" stroke-width="3"/>
    <rect x="-56" y="-240" width="26" height="480" rx="12" fill="${p.soft}" fill-opacity="0.4"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map((i) => {
        const y = -220 + i * 50;
        const long = i % 2 === 0;
        return `<line x1="-4" y1="${y}" x2="${long ? 46 : 26}" y2="${y}" stroke="${p.ink}" stroke-opacity="0.55" stroke-width="5" stroke-linecap="round"/>`;
      })
      .join('')}
    <line x1="-4" y1="-220" x2="-4" y2="230" stroke="${p.pop}" stroke-width="6" stroke-linecap="round"/>
  </g>`;

const setSquare = (p) => `
  <g transform="translate(320 300) rotate(12)" filter="url(#soft13)">
    <path d="M-180 170 L180 170 L-180 -170 Z" fill="#FFFFFF" fill-opacity="0.95"/>
    <path d="M-180 170 L180 170 L-180 -170 Z" fill="none" stroke="${p.ink}" stroke-opacity="0.18" stroke-width="4"/>
    <path d="M-130 120 L76 120 L-130 -58 Z" fill="none" stroke="${p.pop}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-120 -130 A 120 120 0 0 1 -120 -130" fill="none" stroke="${p.ink}" stroke-opacity="0.3" stroke-width="5"/>
    <circle cx="-180" cy="170" r="14" fill="${p.soft}"/>
    <circle cx="180" cy="170" r="14" fill="${p.soft}"/>
    <circle cx="-180" cy="-170" r="14" fill="${p.soft}"/>
  </g>`;

const compass = (p) => `
  <g transform="translate(320 300) rotate(-10)" filter="url(#soft14)">
    <path d="M0 -190 L64 150 L0 108 L-64 150 Z" fill="${p.ink}"/>
    <path d="M0 -190 L64 150 L0 108 Z" fill="#ffffff" fill-opacity="0.22"/>
    <path d="M0 -190 L-64 150 L0 108 Z" fill="${p.ink}" fill-opacity="0.6"/>
    <rect x="-24" y="108" width="48" height="34" rx="12" fill="${p.pop}"/>
    <circle cx="0" cy="-190" r="24" fill="${p.pop}"/>
    <circle cx="0" cy="-190" r="9" fill="#ffffff" fill-opacity="0.8"/>
    <path d="M-96 -96 A 140 140 0 0 1 96 -96" fill="none" stroke="${p.soft}" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 26"/>
  </g>`;

const paintSet = (p) => `
  <g filter="url(#soft15)">
    ${[
      { x: -110, c: p.pop, r: -16 },
      { x: 0, c: p.ink, r: 0 },
      { x: 110, c: p.soft, r: 16 },
    ]
      .map(
        ({ x, c, r }) => `
    <g transform="translate(${320 + x} 300) rotate(${r})">
      <rect x="-46" y="-120" width="92" height="150" rx="18" fill="${c}"/>
      <rect x="-46" y="-120" width="26" height="150" fill="#ffffff" fill-opacity="0.20"/>
      <rect x="-20" y="-186" width="40" height="72" rx="12" fill="${p.ink}" fill-opacity="0.75"/>
      <rect x="-46" y="-46" width="92" height="76" rx="14" fill="#ffffff" fill-opacity="0.85"/>
      <circle cx="0" cy="-8" r="22" fill="${c}" fill-opacity="0.8"/>
    </g>`,
      )
      .join('')}
  </g>`;

const canvasBoard = (p) => `
  <g transform="translate(320 300) rotate(-6)" filter="url(#soft16)">
    <rect x="-190" y="-140" width="380" height="280" rx="20" fill="#FFFFFF"/>
    <rect x="-190" y="-140" width="380" height="280" rx="20" fill="none" stroke="${p.ink}" stroke-opacity="0.14" stroke-width="4"/>
    <rect x="-152" y="-102" width="304" height="204" rx="12" fill="${p.bg2}"/>
    <path d="M-152 62 L-52 -22 L10 32 L74 -34 L152 44 L152 102 L-152 102 Z" fill="${p.soft}" fill-opacity="0.75"/>
    <circle cx="52" cy="-40" r="30" fill="${p.pop}" fill-opacity="0.85"/>
    <path d="M-152 102 L-40 30 L44 102 Z" fill="${p.ink}" fill-opacity="0.32"/>
    <rect x="-190" y="-140" width="380" height="18" rx="9" fill="${p.ink}" fill-opacity="0.18"/>
  </g>`;

const brush = (p) => `
  <g transform="translate(320 300) rotate(28)" filter="url(#soft17)">
    <rect x="-22" y="-230" width="44" height="200" rx="18" fill="${p.ink}"/>
    <rect x="-22" y="-230" width="14" height="200" fill="#ffffff" fill-opacity="0.18"/>
    <rect x="-34" y="-60" width="68" height="42" rx="14" fill="${p.soft}"/>
    <path d="M-26 -18 Q0 60 26 -18 Q0 -6 -26 -18 Z" fill="${p.pop}"/>
    <path d="M-22 -16 Q0 40 22 -16" fill="none" stroke="${p.ink}" stroke-opacity="0.35" stroke-width="5"/>
  </g>`;

const giftBox = (p) => `
  <g transform="translate(320 300)" filter="url(#soft18)">
    <rect x="-160" y="-90" width="320" height="250" rx="24" fill="${p.pop}"/>
    <rect x="-160" y="-90" width="320" height="250" rx="24" fill="#ffffff" fill-opacity="0.12"/>
    <rect x="-176" y="-140" width="352" height="66" rx="18" fill="${p.ink}"/>
    <rect x="-34" y="-140" width="68" height="300" fill="${p.soft}" fill-opacity="0.6"/>
    <path d="M0 -140 Q-120 -140 -108 -204 Q-96 -252 -34 -218 Q-6 -206 0 -140 Z" fill="${p.soft}"/>
    <path d="M0 -140 Q120 -140 108 -204 Q96 -252 34 -218 Q6 -206 0 -140 Z" fill="${p.soft}" fill-opacity="0.8"/>
    <rect x="-118" y="52" width="150" height="16" rx="8" fill="#ffffff" fill-opacity="0.4"/>
  </g>`;

const scissors = (p) => `
  <g transform="translate(320 300) rotate(-24)" filter="url(#soft19)">
    <path d="M-14 -18 L120 -190 L142 -176 L4 6 Z" fill="${p.ink}"/>
    <path d="M-14 22 L120 194 L142 180 L4 -2 Z" fill="${p.ink}" fill-opacity="0.75"/>
    <circle cx="-52" cy="-52" r="46" fill="none" stroke="${p.pop}" stroke-width="26"/>
    <circle cx="-52" cy="56" r="46" fill="none" stroke="${p.pop}" stroke-opacity="0.75" stroke-width="26"/>
    <circle cx="-6" cy="4" r="16" fill="${p.soft}"/>
  </g>`;

const glue = (p) => `
  <g transform="translate(320 300) rotate(-8)" filter="url(#soft20)">
    <rect x="-104" y="-120" width="208" height="270" rx="34" fill="${p.ink}"/>
    <rect x="-104" y="-120" width="52" height="270" rx="26" fill="#ffffff" fill-opacity="0.14"/>
    <path d="M-34 -120 L34 -120 L26 -212 Q24 -240 0 -240 Q-24 -240 -26 -212 Z" fill="${p.pop}"/>
    <rect x="-46" y="-248" width="92" height="26" rx="13" fill="${p.soft}"/>
    <rect x="-72" y="-46" width="144" height="104" rx="18" fill="#ffffff" fill-opacity="0.9"/>
    <rect x="-52" y="-18" width="104" height="12" rx="6" fill="${p.pop}"/>
    <rect x="-52" y="4" width="76" height="10" rx="5" fill="${p.ink}" fill-opacity="0.22"/>
    <rect x="-52" y="24" width="60" height="10" rx="5" fill="${p.ink}" fill-opacity="0.16"/>
  </g>`;

const stapler = (p) => `
  <g transform="translate(320 300) rotate(-16)" filter="url(#soft21)">
    <path d="M-190 96 Q-190 44 -140 44 L150 44 Q190 44 190 96 L190 130 L-190 130 Z" fill="${p.ink}"/>
    <path d="M-180 60 Q-176 4 -120 4 L120 4 Q176 4 180 60 Z" fill="${p.pop}"/>
    <path d="M-180 60 Q-176 4 -120 4 L120 4 Q176 4 180 60 Z" fill="#ffffff" fill-opacity="0.16"/>
    <rect x="-70" y="118" width="140" height="46" rx="20" fill="${p.soft}"/>
    <rect x="-26" y="-40" width="52" height="52" rx="12" fill="${p.ink}" fill-opacity="0.6"/>
  </g>`;

const deskOrganizer = (p) => `
  <g filter="url(#soft22)">
    <g transform="translate(320 300)">
      <rect x="-160" y="60" width="320" height="110" rx="26" fill="${p.ink}"/>
      <rect x="-160" y="60" width="320" height="110" rx="26" fill="#ffffff" fill-opacity="0.08"/>
      <rect x="-118" y="86" width="236" height="18" rx="9" fill="${p.ink}" fill-opacity="0.35"/>
      <rect x="-118" y="-140" width="26" height="210" rx="12" fill="${p.pop}"/>
      <rect x="-70" y="-96" width="26" height="166" rx="12" fill="${p.soft}"/>
      <rect x="-22" y="-168" width="26" height="238" rx="12" fill="${p.ink}" fill-opacity="0.7"/>
      <rect x="26" y="-56" width="26" height="126" rx="12" fill="${p.pop}" fill-opacity="0.7"/>
      <rect x="74" y="-120" width="26" height="190" rx="12" fill="${p.soft}" fill-opacity="0.85"/>
    </g>
  </g>`;

const calculator = (p) => `
  <g transform="translate(320 300) rotate(-8)" filter="url(#soft23)">
    <rect x="-140" y="-190" width="280" height="380" rx="34" fill="${p.ink}"/>
    <rect x="-112" y="-162" width="224" height="82" rx="14" fill="${p.soft}" fill-opacity="0.85"/>
    <rect x="-88" y="-138" width="120" height="26" rx="8" fill="${p.ink}" fill-opacity="0.55"/>
    ${Array.from({ length: 4 })
      .map((_, row) =>
        Array.from({ length: 3 })
          .map((__, col) => {
            const x = -112 + col * 78;
            const y = -56 + row * 58;
            const isLast = row === 3 && col === 2;
            return `<rect x="${x}" y="${y}" width="62" height="44" rx="14" fill="${isLast ? p.pop : '#ffffff'}" fill-opacity="${isLast ? 1 : 0.22}"/>`;
          })
          .join(''),
      )
      .join('')}
  </g>`;

const inkBottle = (p) => `
  <g transform="translate(320 300)" filter="url(#soft24)">
    <path d="M-40 -190 L40 -190 L40 -110 L86 -60 L86 140 Q86 176 50 176 L-50 176 Q-86 176 -86 140 L-86 -60 L-40 -110 Z" fill="${p.ink}"/>
    <path d="M-40 -190 L40 -190 L40 -110 L86 -60 L86 20 L-86 20 L-86 -60 L-40 -110 Z" fill="#ffffff" fill-opacity="0.14"/>
    <rect x="-52" y="-206" width="104" height="26" rx="12" fill="${p.soft}"/>
    <rect x="-62" y="52" width="124" height="82" rx="16" fill="#ffffff" fill-opacity="0.9"/>
    <rect x="-44" y="76" width="88" height="12" rx="6" fill="${p.pop}"/>
    <rect x="-44" y="98" width="60" height="10" rx="5" fill="${p.ink}" fill-opacity="0.22"/>
  </g>`;

const folder = (p) => `
  <g transform="translate(320 300) rotate(-7)" filter="url(#soft25)">
    <path d="M-180 -100 L-30 -100 L-6 -68 L180 -68 L180 150 Q180 172 158 172 L-158 172 Q-180 172 -180 150 Z" fill="${p.pop}"/>
    <path d="M-180 -100 L-30 -100 L-6 -68 L180 -68 L180 150 Q180 172 158 172 L-158 172 Q-180 172 -180 150 Z" fill="#ffffff" fill-opacity="0.14"/>
    <path d="M-180 -52 L180 -52 L180 8 L-180 8 Z" fill="${p.ink}" fill-opacity="0.22"/>
    <rect x="-150" y="46" width="140" height="18" rx="9" fill="#ffffff" fill-opacity="0.55"/>
    <rect x="-150" y="82" width="96" height="14" rx="7" fill="#ffffff" fill-opacity="0.35"/>
  </g>`;

const tapeRoll = (p) => `
  <g filter="url(#soft26)">
    <g transform="translate(320 300) rotate(24)">
      <ellipse cx="0" cy="-40" rx="150" ry="46" fill="${p.pop}"/>
      <path d="M-150 -40 L-150 60 A150 46 0 0 0 150 60 L150 -40 Z" fill="${p.ink}" fill-opacity="0.8"/>
      <ellipse cx="0" cy="-40" rx="150" ry="46" fill="${p.pop}"/>
      <ellipse cx="0" cy="-40" rx="86" ry="26" fill="${p.bg1}"/>
      <ellipse cx="0" cy="-40" rx="86" ry="26" fill="${p.ink}" fill-opacity="0.18"/>
      <ellipse cx="0" cy="-52" rx="150" ry="46" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="6"/>
    </g>
  </g>`;

const crayonBox = (p) => `
  <g filter="url(#soft27)">
    <rect x="-210" y="-60" width="420" height="120" rx="20" fill="${p.ink}"/>
    <rect x="-210" y="-60" width="420" height="120" rx="20" fill="#ffffff" fill-opacity="0.08"/>
    ${[-7, -5, -3, -1, 1, 3, 5, 7].map((i, index) => {
      const x = i * 42;
      const colors = [p.pop, p.ink, p.soft, p.pop, p.soft, p.ink, p.pop, p.soft];
      return `<g transform="translate(${320 + x} 300)"><rect x="-16" y="-172" width="32" height="112" rx="8" fill="${colors[index]}"/><path d="M-16 -172 L16 -172 L0 -216 Z" fill="${colors[index]}" fill-opacity="0.8"/></g>`;
    }).join('')}
    <rect x="-210" y="60" width="420" height="16" rx="8" fill="${p.ink}" fill-opacity="0.2"/>
  </g>`;

const stamp = (p) => `
  <g transform="translate(320 300) rotate(-14)" filter="url(#soft28)">
    <rect x="-92" y="-60" width="184" height="130" rx="28" fill="${p.pop}"/>
    <rect x="-92" y="-60" width="184" height="130" rx="28" fill="#ffffff" fill-opacity="0.16"/>
    <rect x="-124" y="62" width="248" height="60" rx="22" fill="${p.ink}"/>
    <rect x="-124" y="62" width="248" height="60" rx="22" fill="#ffffff" fill-opacity="0.08"/>
    <rect x="-52" y="-186" width="104" height="132" rx="30" fill="${p.ink}" fill-opacity="0.85"/>
    <ellipse cx="0" cy="-192" rx="52" ry="20" fill="${p.soft}"/>
    <rect x="-40" y="-8" width="80" height="14" rx="7" fill="#ffffff" fill-opacity="0.6"/>
  </g>`;

const student = (p) => `
  <g transform="translate(320 300)" filter="url(#soft29)">
    <circle cx="0" cy="-118" r="62" fill="${p.soft}"/>
    <path d="M-64 -128 Q0 -206 64 -128 Q64 -166 0 -166 Q-64 -166 -64 -128 Z" fill="${p.ink}" fill-opacity="0.8"/>
    <path d="M-104 190 Q-104 40 0 40 Q104 40 104 190 Z" fill="${p.ink}"/>
    <path d="M-104 190 Q-104 40 0 40 Q104 40 104 190 Z" fill="#ffffff" fill-opacity="0.08"/>
    <rect x="-40" y="-6" width="80" height="60" rx="10" fill="#FFFFFF" transform="rotate(-8)"/>
    <rect x="-34" y="2" width="68" height="7" rx="3.5" fill="${p.soft}" transform="rotate(-8)"/>
    <rect x="-34" y="18" width="52" height="7" rx="3.5" fill="${p.ink}" fill-opacity="0.25" transform="rotate(-8)"/>
    <rect x="-34" y="34" width="60" height="7" rx="3.5" fill="${p.ink}" fill-opacity="0.18" transform="rotate(-8)"/>
  </g>`;

const PAINTERS = {
  pen,
  pencil,
  pencilSet,
  notebook,
  journal,
  eraser,
  sharpener,
  marker,
  highlighter,
  backpack,
  pencilCase,
  ruler,
  setSquare,
  compass,
  paintSet,
  canvasBoard,
  brush,
  giftBox,
  scissors,
  glue,
  stapler,
  deskOrganizer,
  calculator,
  inkBottle,
  folder,
  tapeRoll,
  crayonBox,
  stamp,
  student,
};

const PALETTE_KEYS = Object.keys(PALETTES);

/* ------------------------------------------------------------ wide artwork */

function wideFrame(p, seed, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" width="1200" height="760" role="img">
${backdrop(p, seed)}
${inner}
</svg>
`;
}

function heroScene(p, seed) {
  return `
  <g transform="translate(820 400)">
    <ellipse cx="0" cy="212" rx="250" ry="34" fill="${p.ink}" fill-opacity="0.12"/>
    <g transform="translate(-90 10) rotate(-12)">
      <rect x="-30" y="-240" width="60" height="300" rx="26" fill="${p.pop}"/>
      <rect x="-30" y="-240" width="60" height="300" rx="26" fill="#ffffff" fill-opacity="0.16"/>
      <path d="M-30 60 L30 60 L22 132 Q16 154 0 156 Q-16 154 -22 132 Z" fill="${p.soft}"/>
    </g>
    <g transform="translate(20 -40) rotate(8)">
      <rect x="-120" y="-220" width="240" height="380" rx="28" fill="#FFFFFF"/>
      <rect x="-120" y="-220" width="240" height="380" rx="28" fill="none" stroke="${p.ink}" stroke-opacity="0.12" stroke-width="4"/>
      <rect x="-92" y="-192" width="184" height="150" rx="16" fill="${p.soft}" fill-opacity="0.5"/>
      ${[0, 1, 2, 3].map((i) => `<line x1="-92" y1="${-8 + i * 34}" x2="92" y2="${-8 + i * 34}" stroke="${p.ink}" stroke-opacity="0.16" stroke-width="5" stroke-linecap="round"/>`).join('')}
      <rect x="-52" y="-220" width="104" height="18" rx="9" fill="${p.pop}"/>
    </g>
    <g transform="translate(180 -20) rotate(24)">
      <rect x="-22" y="-200" width="44" height="220" rx="18" fill="${p.ink}"/>
      <path d="M-22 20 L22 20 L14 76 Q10 92 0 94 Q-10 92 -14 76 Z" fill="${p.soft}"/>
    </g>
    <circle cx="-260" cy="-160" r="26" fill="${p.pop}" fill-opacity="0.5"/>
    <circle cx="290" cy="-230" r="18" fill="${p.soft}" fill-opacity="0.7"/>
    <rect x="-330" y="150" width="120" height="120" rx="28" fill="${p.soft}" fill-opacity="0.45" transform="rotate(18 -270 210)"/>
    <rect x="240" y="120" width="140" height="140" rx="30" fill="#ffffff" fill-opacity="0.55" transform="rotate(-14 310 190)"/>
  </g>`;
}

function bannerScene(p, seed, variant) {
  const blobs = [
    `<circle cx="1010" cy="150" r="120" fill="${p.soft}" fill-opacity="0.5"/><circle cx="880" cy="600" r="90" fill="#ffffff" fill-opacity="0.55"/>`,
    `<rect x="930" y="120" width="220" height="220" rx="48" fill="${p.soft}" fill-opacity="0.45" transform="rotate(18 1040 230)"/><circle cx="1000" cy="560" r="70" fill="#ffffff" fill-opacity="0.5"/>`,
    `<path d="M900 120 L1180 120 L1180 400 Q1040 330 900 400 Z" fill="${p.soft}" fill-opacity="0.45"/><circle cx="1060" cy="600" r="60" fill="#ffffff" fill-opacity="0.5"/>`,
  ][variant % 3];
  return `
  ${blobs}
  <g transform="translate(1010 400)">
    <g transform="translate(-70 -30) rotate(-14)">
      <rect x="-34" y="-180" width="68" height="240" rx="28" fill="${p.pop}"/>
      <rect x="-34" y="-180" width="68" height="240" rx="28" fill="#ffffff" fill-opacity="0.16"/>
      <path d="M-34 60 L34 60 L24 126 Q18 148 0 150 Q-18 148 -24 126 Z" fill="${p.soft}"/>
    </g>
    <g transform="translate(30 10) rotate(10)">
      <rect x="-92" y="-140" width="184" height="280" rx="24" fill="#FFFFFF"/>
      <rect x="-92" y="-140" width="184" height="280" rx="24" fill="none" stroke="${p.ink}" stroke-opacity="0.12" stroke-width="4"/>
      <rect x="-64" y="-112" width="128" height="80" rx="12" fill="${p.soft}" fill-opacity="0.55"/>
      <rect x="-64" y="-6" width="128" height="9" rx="4.5" fill="${p.ink}" fill-opacity="0.16"/>
      <rect x="-64" y="24" width="96" height="9" rx="4.5" fill="${p.ink}" fill-opacity="0.12"/>
    </g>
  </g>`;
}

/* ------------------------------------------------------------------- output */

const files = new Map();

// Product artwork: 30 variants cycling through shapes + palettes.
const PRODUCT_SHAPES = Object.keys(PAINTERS);
const seedIndex = new Map();

function productArt(artKey, index) {
  const shape = PRODUCT_SHAPES[index % PRODUCT_SHAPES.length];
  const palette = PALETTE_KEYS[index % PALETTE_KEYS.length];
  const seed = seedIndex.get(palette) ?? 1;
  seedIndex.set(palette, seed + 1);
  const painter = PAINTERS[shape];
  return frame(PALETTES[palette], seed, painter(PALETTES[palette]));
}

// Category tiles.
const CATEGORIES = [
  ['writing', 'pen'],
  ['notebooks', 'notebook'],
  ['school', 'pencilCase'],
  ['art', 'paintSet'],
  ['bags', 'backpack'],
  ['geometry', 'compass'],
  ['office', 'deskOrganizer'],
  ['gifts', 'giftBox'],
];

for (const [i, [slug, shape]] of CATEGORIES.entries()) {
  const palette = PALETTES[PALETTE_KEYS[i % PALETTE_KEYS.length]];
  const seed = 90 + i;
  files.set(`category-${slug}.svg`, frame(palette, seed, PAINTERS[shape](palette)));
}

// Hero + banners.
files.set('hero.svg', wideFrame(PALETTES.azure, 70, heroScene(PALETTES.azure, 70)));
files.set('banner-1.svg', wideFrame(PALETTES.azure, 71, bannerScene(PALETTES.azure, 71, 0)));
files.set('banner-2.svg', wideFrame(PALETTES.mint, 72, bannerScene(PALETTES.mint, 72, 1)));
files.set('banner-3.svg', wideFrame(PALETTES.lilac, 73, bannerScene(PALETTES.lilac, 73, 2)));
files.set('about.svg', wideFrame(PALETTES.sand, 74, bannerScene(PALETTES.sand, 74, 0)));
files.set('contact.svg', wideFrame(PALETTES.sky, 75, bannerScene(PALETTES.sky, 75, 1)));
files.set('admin-cover.svg', wideFrame(PALETTES.slate, 76, bannerScene(PALETTES.slate, 76, 2)));

// Brands wordmark tiles.
const BRAND_TILES = [
  ['panter', '#2A46A6', '#EFF4FF'],
  ['familia', '#12695A', '#E9FAF4'],
  ['fano', '#9B2B50', '#FEF0F4'],
  ['cp', '#8A5B12', '#FDF5E8'],
  ['pico', '#1F5B96', '#EAF6FF'],
  ['zit', '#4A2E9E', '#F3F0FE'],
  ['nova', '#9C3A22', '#FFF1EC'],
  ['atlas', '#33435F', '#F1F4F9'],
];
for (const [i, [slug, ink, bg]] of BRAND_TILES.entries()) {
  files.set(
    `brand-${slug}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120" width="240" height="120" role="img">
  <rect width="240" height="120" rx="28" fill="${bg}"/>
  <circle cx="34" cy="30" r="6" fill="${ink}" fill-opacity="0.35"/>
  <text x="120" y="72" text-anchor="middle" font-family="Vazirmatn, Tahoma, sans-serif" font-size="34" font-weight="700" fill="${ink}" fill-opacity="0.8">${slug}</text>
</svg>
`,
  );
}

mkdirSync(resolve(OUT, 'products'), { recursive: true });
mkdirSync(resolve(OUT, 'categories'), { recursive: true });
mkdirSync(resolve(OUT, 'banners'), { recursive: true });
mkdirSync(resolve(OUT, 'brands'), { recursive: true });

for (const [name, svg] of files) {
  const folder = name.startsWith('category-')
    ? 'categories'
    : name.startsWith('brand-')
      ? 'brands'
      : name === 'hero.svg' || name === 'about.svg' || name === 'contact.svg' || name === 'admin-cover.svg'
        ? '.'
        : 'banners';
  writeFileSync(resolve(OUT, folder, name), svg.trim(), 'utf8');
}

// Product placeholders: one shape per product, rendered in three colourways so
// every product has a believable gallery instead of a single repeated frame.
const PRODUCT_COUNT = 32;
const GALLERY_VARIANTS = 3;

for (let i = 0; i < PRODUCT_COUNT; i += 1) {
  const shape = PRODUCT_SHAPES[i % PRODUCT_SHAPES.length];
  for (let variant = 0; variant < GALLERY_VARIANTS; variant += 1) {
    const palette = PALETTES[PALETTE_KEYS[(i + variant * 3) % PALETTE_KEYS.length]];
    const seed = 100 + i * 4 + variant;
    const svg = frame(palette, seed, PAINTERS[shape](palette));
    writeFileSync(resolve(OUT, 'products', `p${i}-${variant + 1}.svg`), svg.trim(), 'utf8');
  }
}

console.log(`generated ${files.size + PRODUCT_COUNT * GALLERY_VARIANTS} artwork files in public/media`);