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
const profile = () => {
  let s = sky(800, 800, 90, 11) + glow(400, 400, 420, 'gBlue', 1);
  s += '<ellipse cx="400" cy="400" rx="330" ry="110" fill="none" stroke="' + C.yellow + '" stroke-width="16" transform="rotate(-22 400 400)" opacity=".95"/>';
  s += earth2(400, 400, 235, 4, { glow: 0, sw: 12 });
  s += '<path d="M 76.8 470.6 A 330 110 0 0 0 723.2 329.4" fill="none" stroke="' + C.yellow + '" stroke-width="16" transform="rotate(-22 400 400)"/>';
  s += tp(690, 250, 52, 4, { sw: 8 });
  return svg(800, 800, s, .1);
};
const banner = (name, tagline) => {
  const W2 = 2560, H2 = 1440;
  let s = sky(W2, H2, 420, 21);
  s += glow(330, 720, 700, 'gBlue', .9) + earth2(330, 720, 330, 2, { glow: 0, sw: 12 });
  s += glow(2280, 640, 520, 'gRed', .8) + rstar(2300, 600, 170, 2, { sw: 10 }) + tp(2060, 860, 70, 2, { sw: 8 });
  // safe area (all devices): 1546 x 423, centred
  const [first, ...rest] = name.split(' '), second = rest.join(' ');
  s += big(1280, 700, name.toUpperCase(), 170, C.white, -2);
  s += text(1280, 800, tagline, 64, C.yellow, { font: 'Brush' });
  s += text(1280, 880, 'space  ·  the human body  ·  technology  ·  chemistry', 44, C.cream, { font: 'Hand' });
  return svg(W2, H2, s, .1);
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
window.go = (k, a, b) => { document.getElementById('s').innerHTML = k === 'profile' ? profile() : k === 'end' ? endscreen() : banner(a, b); };`;
(async () => {
  const html = '<style>@font-face{font-family:Hand;src:url(data:font/ttf;base64,' + b64('PatrickHand.ttf') + ')}@font-face{font-family:Brush;src:url(data:font/ttf;base64,' + b64('CaveatBrush.ttf') + ')}html,body{margin:0;background:#000}</style><div id="s"></div><script>const TIMING=[];' + fs.readFileSync(path.join(dir, 'lib.js'), 'utf8') + '\n' + ART + '</script>';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2560, height: 1440 } });
  p.on('pageerror', e => console.error('ERR', e.message));
  await p.setContent(html); await p.evaluate(() => document.fonts.ready);
  const shot = async (k, a, bb, w, h, file) => { await p.setViewportSize({ width: w, height: h }); await p.evaluate(([k, a, bb]) => window.go(k, a, bb), [k, a, bb]); await p.screenshot({ path: path.join(out, file), clip: { x: 0, y: 0, width: w, height: h } }); };
  await shot('profile', '', '', 800, 800, 'profile-800.png');
  await shot('banner', 'Earth to Science', 'Big science questions. Honest answers.', 2560, 1440, 'banner-earth-to-science.png');
  await shot('banner', 'Science to Earth', 'Big science questions. Honest answers.', 2560, 1440, 'banner-science-to-earth.png');
  await shot('end', '', '', 1280, 720, 'endscreen-1280x720.png');
  await b.close();
})();
