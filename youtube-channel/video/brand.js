// Renders channel branding: profile picture, banners (one per candidate name) and an end-screen background.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const dir = __dirname, out = path.join(dir, '..', 'branding'), b64 = f => fs.readFileSync(path.join(dir, 'fonts', f)).toString('base64');
const ART = String.raw`
const svg = (w, h, inner, grain = .14) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '"><defs>' + DEFS +
  '<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.9 -0.25"/></filter>' +
  '<radialGradient id="vg2" cx="50%" cy="50%" r="70%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".6"/></radialGradient></defs>' +
  inner + '<rect width="' + w + '" height="' + h + '" fill="url(#vg2)"/><rect width="' + w + '" height="' + h + '" filter="url(#grain)" opacity="' + grain + '" style="mix-blend-mode:multiply"/></svg>';
const sky = (w, h, n, seed) => { let s = '<rect width="' + w + '" height="' + h + '" fill="#070b1a"/>'; for (let i = 0; i < n; i++) { const x = rnd(i + seed) * w, y = rnd(i + seed + 100) * h, r = 1 + rnd(i + seed + 200) * 3; s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="#fff8e7" opacity="' + (.35 + .6 * rnd(i + seed + 300)).toFixed(2) + '"/>'; } return s; };
const big = (x, y, str, size, fill, rot = 0) => text(x, y, str, size, fill, { font: 'Brush', stroke: C.ink, sw: size * .13, rot });
// --- science icons (paper style) ---
const ink = C.ink;
const atomRings = (cx, cy, rx, ry, sw, cols, t = 0) => cols.map((c, i) => '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="' + c + '" stroke-width="' + sw + '" transform="rotate(' + (i * 60 - 30) + ' ' + cx + ' ' + cy + ')"/>').join('');
const electrons = (cx, cy, rx, ry, r, cols) => cols.map((c, i) => { const a = (i * 60 - 30) * Math.PI / 180, ang = [0.15, Math.PI + 0.15, 0.12][i], x = rx * Math.cos(ang), y = ry * Math.sin(ang); return '<circle cx="' + (cx + x * Math.cos(a) - y * Math.sin(a)).toFixed(1) + '" cy="' + (cy + x * Math.sin(a) + y * Math.cos(a)).toFixed(1) + '" r="' + r + '" fill="' + c + '" stroke="' + ink + '" stroke-width="' + r * .35 + '"/>'; }).join('');
const brain = (x, y, s) => g('<path d="M-70 10 C-95 -40 -55 -85 -10 -75 C10 -100 70 -95 80 -50 C115 -30 105 30 70 45 C60 80 10 85 -5 65 C-40 85 -95 60 -70 10z" fill="#f7a8c4" stroke="' + ink + '" stroke-width="8"/><path d="M0 -70 C-10 -30 15 0 0 60 M-50 -30 q20 10 15 35 M40 -55 q-15 25 10 45 M-45 30 q20 -5 30 15 M45 20 q-10 15 5 30" fill="none" stroke="#c4577e" stroke-width="7" stroke-linecap="round"/>', at(x, y, s));
const dna = (x, y, s) => { let d1 = '', d2 = '', rungs = ''; for (let i = 0; i <= 40; i++) { const yy = -120 + i * 6, xx = 30 * Math.sin(i * .32); d1 += (i ? 'L' : 'M') + xx.toFixed(1) + ' ' + yy; d2 += (i ? 'L' : 'M') + (-xx).toFixed(1) + ' ' + yy; if (i % 4 === 2) rungs += '<line x1="' + xx.toFixed(1) + '" y1="' + yy + '" x2="' + (-xx).toFixed(1) + '" y2="' + yy + '" stroke="' + ['#ffd166', '#5ec8e5', '#f78c6b', '#9be38a'][i % 4 === 2 ? (i / 4 | 0) % 4 : 0] + '" stroke-width="7"/>'; } return g(rungs + '<path d="' + d1 + '" fill="none" stroke="' + ink + '" stroke-width="10"/><path d="' + d1 + '" fill="none" stroke="#7ad0f0" stroke-width="5"/><path d="' + d2 + '" fill="none" stroke="' + ink + '" stroke-width="10"/><path d="' + d2 + '" fill="none" stroke="#f7a8c4" stroke-width="5"/>', at(x, y, s, 18)); };
const flask = (x, y, s) => g('<path d="M-22 -110 h44 v60 l60 120 q8 22 -14 22 h-136 q-22 0 -14 -22 l60 -120z" fill="#e8f4fa" stroke="' + ink + '" stroke-width="8" stroke-linejoin="round"/><path d="M-50 10 h100 l32 62 q6 12 -8 12 h-148 q-14 0 -8 -12z" fill="#6bd66b"/><circle cx="-10" cy="40" r="9" fill="#c9f7c9"/><circle cx="18" cy="58" r="6" fill="#c9f7c9"/><circle cx="4" cy="-20" r="8" fill="#9be38a" stroke="' + ink + '" stroke-width="4"/><circle cx="-6" cy="-60" r="6" fill="#9be38a" stroke="' + ink + '" stroke-width="4"/><rect x="-30" y="-122" width="60" height="16" rx="6" fill="#aab2c0" stroke="' + ink + '" stroke-width="7"/>', at(x, y, s, -8));
const chip = (x, y, s) => { let p = ''; for (let i = -2; i <= 2; i++) p += '<rect x="' + (i * 26 - 6) + '" y="-92" width="12" height="22" fill="#d7dde6" stroke="' + ink + '" stroke-width="4"/><rect x="' + (i * 26 - 6) + '" y="70" width="12" height="22" fill="#d7dde6" stroke="' + ink + '" stroke-width="4"/><rect x="-92" y="' + (i * 26 - 6) + '" width="22" height="12" fill="#d7dde6" stroke="' + ink + '" stroke-width="4"/><rect x="70" y="' + (i * 26 - 6) + '" width="22" height="12" fill="#d7dde6" stroke="' + ink + '" stroke-width="4"/>'; return g(p + '<rect x="-72" y="-72" width="144" height="144" rx="14" fill="#2b3359" stroke="' + ink + '" stroke-width="8"/><rect x="-36" y="-36" width="72" height="72" rx="8" fill="#5ec8e5" stroke="' + ink + '" stroke-width="6"/><path d="M-36 0 h-22 M36 -18 h22 M0 36 v22" stroke="#5ec8e5" stroke-width="6"/>', at(x, y, s, 8)); };
const heart = (x, y, s) => g('<path d="M0 60 C-90 0 -80 -70 -30 -70 C-10 -70 0 -55 0 -45 C0 -55 10 -70 30 -70 C80 -70 90 0 0 60z" fill="#e5484d" stroke="' + ink + '" stroke-width="8"/><path d="M-40 -40 q-10 15 0 30" fill="none" stroke="#ff9a9e" stroke-width="7" stroke-linecap="round"/>', at(x, y, s, -10));
const profile = () => {
  const cols = ['#ffd166', '#5ec8e5', '#f78fb3'];
  let s = sky(800, 800, 80, 11) + glow(400, 400, 430, 'gBlue', .9);
  s += earth2(400, 400, 190, 4, { glow: 0, sw: 12 });
  s += atomRings(400, 400, 330, 112, 18, cols.map(() => C.ink));
  s += atomRings(400, 400, 330, 112, 10, cols);
  s += electrons(400, 400, 330, 112, 28, cols);
  return svg(800, 800, s, .1);
};
const banner = (name, tagline) => {
  const W2 = 2560, H2 = 1440;
  let s = sky(W2, H2, 380, 21);
  s += glow(330, 520, 520, 'gRed', .55) + glow(330, 980, 520, 'gBlue', .5) + glow(2230, 520, 520, 'gBlue', .6) + glow(2230, 980, 520, 'gWarm', .45);
  s += brain(300, 560, 1.6) + dna(560, 960, 1.4) + heart(170, 1000, 1.1);
  s += flask(2280, 1000, 1.5) + chip(2010, 560, 1.15);
  const cols = ['#ffd166', '#5ec8e5', '#f78fb3'];
  s += atomRings(2330, 470, 150, 54, 10, cols.map(() => C.ink)) + atomRings(2330, 470, 150, 54, 5, cols) + earth2(2330, 470, 70, 2, { glow: 0, sw: 7 });
  s += tp(520, 330, 60, 2, { sw: 7 });
  s += big(1280, 700, name.toUpperCase(), 170, C.white, -2);
  s += text(1280, 800, tagline, 64, C.yellow, { font: 'Brush' });
  s += text(1280, 880, 'the human body  ·  chemistry  ·  technology  ·  space', 44, C.cream, { font: 'Hand' });
  return svg(W2, H2, s, .1);
};
const mark = () => {
  const cols = ['#ffd166', '#5ec8e5', '#f78fb3'];
  let s = '<circle cx="400" cy="400" r="385" fill="#070b1a" opacity=".7" stroke="#ffffff" stroke-width="14" stroke-opacity=".85"/>';
  s += earth2(400, 400, 190, 4, { glow: 0, sw: 14 });
  s += atomRings(400, 400, 330, 112, 34, cols.map(() => C.ink)) + atomRings(400, 400, 330, 112, 22, cols);
  s += electrons(400, 400, 330, 112, 34, cols);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800"><defs>' + DEFS + '</defs>' + s + '</svg>';
};
const endscreen = () => {
  let s = sky(1280, 720, 140, 31) + glow(640, 360, 600, 'gBlue', .35);
  s += big(640, 110, 'WHAT SHOULD WE EXPLAIN NEXT?', 64, C.white, -1);
  s += text(640, 168, 'tell us in the comments', 36, C.yellow, { font: 'Brush' });
  // YouTube end-screen element spots (approximate): two videos + subscribe circle
  [[95, 240], [665, 240]].forEach(([x, y]) => { s += '<rect x="' + x + '" y="' + y + '" width="520" height="292" rx="14" fill="#0d1530" stroke="#2a3a6a" stroke-width="4" stroke-dasharray="14 10"/>'; });
  s += '<circle cx="640" cy="625" r="64" fill="#0d1530" stroke="#2a3a6a" stroke-width="4" stroke-dasharray="14 10"/>';
  return svg(1280, 720, s, .1);
};
window.go = (k, a, b) => { document.getElementById('s').innerHTML = k === 'mark' ? mark() : k === 'profile' ? profile() : k === 'end' ? endscreen() : banner(a, b); };`;
(async () => {
  const html = '<style>@font-face{font-family:Hand;src:url(data:font/ttf;base64,' + b64('PatrickHand.ttf') + ')}@font-face{font-family:Brush;src:url(data:font/ttf;base64,' + b64('CaveatBrush.ttf') + ')}html,body{margin:0;background:transparent}</style><div id="s"></div><script>const TIMING=[];' + fs.readFileSync(path.join(dir, 'lib.js'), 'utf8') + '\n' + ART + '</script>';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2560, height: 1440 } });
  p.on('pageerror', e => console.error('ERR', e.message));
  await p.setContent(html); await p.evaluate(() => document.fonts.ready);
  const shot = async (k, a, bb, w, h, file, transparent = false) => { await p.setViewportSize({ width: w, height: h }); await p.evaluate(([k, a, bb]) => window.go(k, a, bb), [k, a, bb]); await p.screenshot({ path: path.join(out, file), clip: { x: 0, y: 0, width: w, height: h }, omitBackground: transparent }); };
  await shot('mark', '', '', 800, 800, 'watermark-800.png', true);
  await shot('profile', '', '', 800, 800, 'profile-800.png');
  await shot('banner', 'Earth to Science', 'Big science questions. Honest answers.', 2560, 1440, 'banner-earth-to-science.png');
  await shot('banner', 'Science to Earth', 'Big science questions. Honest answers.', 2560, 1440, 'banner-science-to-earth.png');
  await shot('end', '', '', 1280, 720, 'endscreen-1280x720.png');
  await b.close();
})();
