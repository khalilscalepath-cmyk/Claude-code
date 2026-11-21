// Renders the thumbnails for video 001 (1280x720 PNG) with the same drawing code as the video.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const dir = __dirname, b64 = f => fs.readFileSync(path.join(dir, 'fonts', f)).toString('base64');
const THUMBS = String.raw`
const big = (x, y, str, size, fill, rot = 0) => text(x, y, str, size, fill, { font: 'Brush', stroke: C.ink, sw: size * .14, rot });
const A = () => {
  let s = space(1, 3, '#060a18', 150) + glow(430, 380, 520, 'gBlue', .9);
  s += tp(430, 380, 250, 1, { air: 1, lock: -35, face: 'ooh' });
  s += catchTag(560, 610, 'THE CATCH', 1.15, -8);
  s += big(960, 300, 'EARTH', 190, C.white, -4) + big(990, 490, '2.0?', 230, C.yellow, -4);
  return s;
};
const B = () => {
  let s = space(2, 9, '#12060a', 120) + glow(1060, 400, 620, 'gRed', 1) + rstar(1070, 400, 210, 2, { flare: 1.1 });
  s += tp(760, 560, 115, 2, { lock: -20 });
  s += person(250, 470, 1.3, { mood: 'ooh', look: 9, lookY: -5, lit: '#ff9d80' });
  s += big(330, 150, 'NOBODY', 160, C.white, -3) + big(350, 300, 'TELLS YOU', 120, C.yellow, -3);
  return s;
};
const Cc = () => {
  let s = space(3, 17, '#060a18', 150) + glow(860, 400, 560, 'gBlue', .9);
  s += tp(860, 400, 255, 1, { air: 1, lock: -30, face: 'flat' });
  // a "for sale" tag hanging off the planet
  s += g('<line x1="0" y1="-150" x2="0" y2="-20" stroke="' + C.cream + '" stroke-width="5"/>' + g('<path d="M-200 -20 L-160 -80 H200 V80 H-160z" fill="' + C.cream + '" stroke="' + C.ink + '" stroke-width="7"/><circle cx="-168" cy="0" r="11" fill="#06121f" stroke="' + C.ink + '" stroke-width="5"/>' + text(20, -14, 'TRIP THERE:', 40, C.ink, { font: 'Brush' }) + text(20, 52, '700,000 YRS', 62, C.red, { font: 'Brush' }), 'translate(0 0)'), 'translate(700 560) rotate(-8)');
  s += big(300, 250, 'THE', 150, C.white, -5) + big(320, 420, 'CATCH', 190, C.yellow, -5);
  return s;
};
const D = () => {
  let s = space(3, 17, '#060a18', 150) + glow(860, 400, 560, 'gBlue', .9);
  s += tp(860, 400, 255, 1, { air: 1, lock: -30, face: 'flat' });
  s += g('<line x1="0" y1="-150" x2="0" y2="-20" stroke="' + C.cream + '" stroke-width="5"/><path d="M-200 -20 L-160 -80 H200 V80 H-160z" fill="' + C.cream + '" stroke="' + C.ink + '" stroke-width="7"/><circle cx="-168" cy="0" r="11" fill="#06121f" stroke="' + C.ink + '" stroke-width="5"/>' + text(20, -14, 'TRIP THERE:', 40, C.ink, { font: 'Brush' }) + text(20, 52, '700,000 YRS', 62, C.red, { font: 'Brush' }), 'translate(700 560) rotate(-8)');
  s += big(300, 250, 'EARTH', 170, C.white, -5) + big(320, 440, '2.0?', 230, C.yellow, -5);
  return s;
};
window.render = k => { document.getElementById('s').innerHTML = frame((k === 'A' ? A : k === 'B' ? B : k === 'D' ? D : Cc)(), 0, { noWobble: true, vig: .8, grain: .12 }); };`;
(async () => {
  const html = `<style>@font-face{font-family:Hand;src:url(data:font/ttf;base64,${b64('PatrickHand.ttf')})}@font-face{font-family:Brush;src:url(data:font/ttf;base64,${b64('CaveatBrush.ttf')})}html,body{margin:0;background:#000}</style><div id="s"></div><script>const TIMING=[];${fs.readFileSync(path.join(dir, 'lib.js'), 'utf8')}\n${THUMBS}</script>`;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on('pageerror', e => console.error('ERR', e.message));
  await p.setContent(html); await p.evaluate(() => document.fonts.ready);
  for (const k of ['A', 'B', 'C', 'D']) { await p.evaluate(k => window.render(k), k); await p.screenshot({ path: path.join(dir, '..', 'thumbnails', `001-thumb-${k}.png`) }); }
  await b.close();
})();
