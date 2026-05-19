import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, 'public', 'og-image.png');

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F0F19"/>
      <stop offset="100%" stop-color="#1a1a2e"/>
    </linearGradient>
    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
    <linearGradient id="accentGradient" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle grid lines -->
  <line x1="0" y1="315" x2="1200" y2="315" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
  <line x1="600" y1="0" x2="600" y2="630" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>

  <!-- Logo mark (left column, vertically centred) -->
  <g transform="translate(90, 215)">
    <path d="M100 25 L165 62.5 L165 137.5 L100 175 L35 137.5 L35 62.5 Z"
      fill="none" stroke="url(#brandGradient)" stroke-width="14" stroke-linejoin="round"/>
    <path d="M100 60 L135 80 L135 120 L100 140 L65 120 L65 80 Z"
      fill="url(#accentGradient)" opacity="0.9"/>
    <circle cx="100" cy="100" r="15" fill="#FFFFFF"/>
  </g>

  <!-- Title -->
  <text x="310" y="265"
    font-family="system-ui,-apple-system,Segoe UI,sans-serif"
    font-size="72" font-weight="700" fill="#FFFFFF" letter-spacing="-1">Coding Agent</text>
  <text x="310" y="355"
    font-family="system-ui,-apple-system,Segoe UI,sans-serif"
    font-size="72" font-weight="700" fill="url(#brandGradient)" letter-spacing="-1">Architect</text>

  <!-- Tagline -->
  <text x="312" y="420"
    font-family="system-ui,-apple-system,Segoe UI,sans-serif"
    font-size="26" fill="#94A3B8">The premier open-source registry for AI coding</text>
  <text x="312" y="458"
    font-family="system-ui,-apple-system,Segoe UI,sans-serif"
    font-size="26" fill="#94A3B8">agents, blueprints &amp; skills.</text>

  <!-- Bottom accent line -->
  <rect x="312" y="500" width="200" height="3" rx="2" fill="url(#brandGradient)"/>
</svg>`;

await sharp(Buffer.from(ogSvg))
	.resize(1200, 630)
	.png()
	.toFile(outputPath);

console.log('OG image generated → public/og-image.png');
