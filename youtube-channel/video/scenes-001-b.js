// Video 001, sentences 55 to 98 (3:12 to 5:52).

seg(55, 56, (t, a) => card(t, [{ at: .2, str: 'The only question that really matters:', y: 300, size: 60, dur: 1.6 }, { at: a(56), str: 'Does TRAPPIST-1e still have air?', y: 420, size: 84, dur: 1.5 }]), { noWobble: true, noVig: true });

// What air does; without it, a rock
seg(57, 61, (t, a) => {
  let w = space(t, 101);
  const air = 1 - prog(t, a(60), a(60) + 2.2), rock = prog(t, a(60) + .6, a(61) + .3);
  w += tp(640, 370, 190, t, { air, rock, face: rock > .6 ? 'flat' : '' });
  let s = cam(w, 640, 370, lerp(1, 1.12, prog(t, 0, 14)));
  const item = (x, y, icon, str, t0, t1) => { const k = pop(t, t0) * (t > t1 ? 0 : 1); return k > 0 ? g(`<circle r="62" fill="#10254a" stroke="${C.cream}" stroke-width="5"/>` + icon + label(0, 112, str, 40, C.cream), at(x, y, k)) : ''; };
  s += item(220, 260, `<path d="M0 -36 q30 36 0 62 q-30 -26 0 -62z" fill="#59b7ff" stroke="${C.ink}" stroke-width="5"/>`, 'holds water liquid', a(57) + .6, a(60));
  s += item(1060, 260, arrow(-34, 10, 34, 10, '#ffb347', 7) + `<path d="M-30 -18 q30 -24 60 0" fill="none" stroke="#ffb347" stroke-width="6"/>`, 'spreads the heat', a(58) + .2, a(60));
  s += item(640, 620, `<path d="M-8 -34 v20 q-34 6 -30 44 q22 10 30 -14 z M8 -34 v20 q34 6 30 44 q-22 10 -30 -14z" fill="#ff9aa2" stroke="${C.ink}" stroke-width="5"/>`, 'something to breathe', a(59), a(60));
  s += pl(640, 120, 'NOT Earth 2.0', 84, C.red, pop(t, a(60) + 1), -3);
  s += pl(640, 660, 'a rock.', 96, '#c9ced6', pop(t, a(61)));
  return s;
});
seg(62, 62, qcard([{ at: .2, str: 'How do you check for air', y: 300, size: 72, dur: 1.1 }, { at: 1.4, str: 'on a planet you cannot even see,', y: 400, size: 72, dur: 1.4 }, { at: 3.0, str: '40 light-years away?', y: 500, size: 72, dur: 1.0 }]), { noWobble: true, noVig: true });

// Transit and the spectrum
seg(63, 67, (t, a) => {
  let w = space(t, 110);
  w += rstar(280, 330, 210, t, { glow: .8 });
  const px = lerp(60, 330, easeInOut(prog(t, .2, 2.6))) + 30 * prog(t, 2.6, 20);
  w += `<circle cx="${px}" cy="330" r="50" fill="none" stroke="#8fe3ff" stroke-width="10" opacity=".85"/><circle cx="${px}" cy="330" r="42" fill="#1a0d0d" stroke="${C.ink}" stroke-width="5"/>`;
  const beam = prog(t, a(64) + .6, a(64) + 3.2);
  if (beam > 0) for (let i = -1; i <= 1; i++) w += `<line x1="${px}" y1="${330 + i * 46}" x2="${px + (820 - px) * beam}" y2="${330 + i * 14}" stroke="#ffe6a8" stroke-width="5" stroke-dasharray="14 10" stroke-dashoffset="${-t * 60}" opacity=".9"/>`;
  // spectrum bar
  const sk = pop(t, a(64) + 3.0);
  const cols = ['#7b2ff7', '#3a86ff', '#2ec4b6', '#8ac926', '#ffca3a', '#ff924c', '#ff595e'];
  let bar = cols.map((c, i) => `<rect x="${-175 + i * 50}" y="-45" width="50" height="90" fill="${c}"/>`).join('');
  const gp = prog(t, a(65) + .4, a(65) + 1.6);
  [[-120, 16], [-20, 24], [95, 14]].forEach(([x, wd]) => { bar += `<rect x="${x}" y="-45" width="${wd}" height="${90 * gp}" fill="#0b0b0d"/>`; });
  bar += `<rect x="-175" y="-45" width="350" height="90" fill="none" stroke="${C.ink}" stroke-width="6"/>`;
  w += g(bar, at(1010, 330, sk));
  let s = cam(w, lerp(420, 660, easeInOut(prog(t, a(64), a(64) + 3))), 340, lerp(1.3, 1, easeInOut(prog(t, a(64), a(64) + 3))));
  s += pl(330, 640, 'the planet crosses its star', 46, C.cream, pop(t, .5) * (t < a(64) + 3 ? 1 : 0));
  s += pl(620, 180, 'starlight through its air', 44, '#ffe6a8', pop(t, a(64) + 1.6));
  s += pl(1010, 470, 'missing colours', 50, C.cream, pop(t, a(65) + 1.4));
  if (t > a(66)) s += g(`<circle r="70" fill="${C.cream}" stroke="${C.ink}" stroke-width="6"/>` + [20, 32, 44, 56].map(r => `<path d="M${-r} 14 A${r} ${r} 0 0 1 ${r} 14" fill="none" stroke="${C.ink}" stroke-width="5"/>`).join('') + label(0, 126, '= a fingerprint', 44, C.yellow), at(1010, 590, pop(t, a(66) + .5) * .8));
  s += pl(330, 110, 'gaps → what the air is made of', 46, C.yellow, pop(t, a(67) + .3));
  return s;
});

// Tiny signal, the gnat and the searchlight
seg(68, 69, (t, a) => {
  let s = `<rect width="${W}" height="${H}" fill="#0c1a14"/>` + glow(640, 360, 700, 'gBlue', .18);
  s += paper(140, 130, 1000, 440, -1, '#0f2a22');
  for (let i = 0; i < 9; i++) s += `<line x1="150" y1="${170 + i * 45}" x2="1130" y2="${170 + i * 45}" stroke="#1d4a3c" stroke-width="2"/>`;
  let d = 'M170 340'; for (let x = 170; x <= 1110; x += 10) { const dip = (x > 560 && x < 720) ? 7 * prog(t, a(69) + .5, a(69) + 2) : 0; d += ` L${x} ${340 + dip + 2.2 * Math.sin(x * .3 + t * 8)}`; }
  s += `<path d="${d}" fill="none" stroke="#59f0a8" stroke-width="5"/>`;
  s += pl(640, 90, 'the size of the signal', 60, C.cream, pop(t, .2));
  if (t > a(69) + 2) s += arrow(640, 470, 640, 372, C.yellow, 6) + pl(640, 530, 'a few thousandths of 1%', 56, C.yellow, pop(t, a(69) + 2.2));
  return s;
});
seg(70, 70, (t, a) => {
  let w = `<rect x="-200" y="-200" width="1700" height="1200" fill="#081126"/>` + stars(t, 60, W, 300, 3);
  for (let i = 0; i < 16; i++) { const h = 120 + rnd(i + 7) * 240, x = 520 + i * 52; w += `<rect x="${x}" y="${640 - h}" width="46" height="${h}" fill="#101c3d" stroke="${C.ink}" stroke-width="4"/>`; for (let j = 0; j < 5; j++) if (rnd(i * 9 + j) > .5) w += `<rect x="${x + 8 + (j % 2) * 18}" y="${650 - h + j * 26}" width="10" height="12" fill="#ffd98a"/>`; }
  w += `<polygon points="900,470 1320,90 1320,250" fill="url(#gSpot)" opacity=".9" transform="rotate(${4 * Math.sin(t)} 900 470)"/><rect x="880" y="455" width="44" height="30" fill="#d7dde6" stroke="${C.ink}" stroke-width="5"/>`;
  const gx = 1120 + 30 * Math.sin(t * 3), gy = 250 + 14 * Math.sin(t * 7);
  w += `<circle cx="${gx}" cy="${gy}" r="5" fill="${C.ink}"/><circle cx="${gx}" cy="${gy}" r="26" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="6 6"/>`;
  w += `<rect x="-200" y="640" width="1700" height="300" fill="#050a18"/>` + person(360, 480, .9, { mood: 'flat', look: 8, armR: -100 });
  w += g(`<rect x="-34" y="-12" width="68" height="24" rx="6" fill="#39485c" stroke="${C.ink}" stroke-width="5"/>`, at(404, 462, .9));
  return cam(w, lerp(640, 760, prog(t, 0, 5)), 360, lerp(1, 1.15, prog(t, 0, 5))) + pl(380, 110, 'a gnat in a searchlight', 54, C.cream, pop(t, .4)) + pl(380, 180, '…from another city', 46, C.yellow, pop(t, 3.0));
});

// Webb
function webb(t) {
  let s = '';
  for (let i = 0; i < 5; i++) s += `<path d="M-250 ${96 + i * 10} L0 ${150 + i * 10} L250 ${96 + i * 10} L0 ${60 + i * 10}z" fill="${['#d9c7ff', '#c9b6f2', '#b9a5e6', '#a994d9', '#9984cc'][i]}" stroke="${C.ink}" stroke-width="4"/>`;
  const hex = (x, y) => `<polygon points="${[0, 60, 120, 180, 240, 300].map(d => `${x + 30 * Math.cos(d * Math.PI / 180)},${y + 30 * Math.sin(d * Math.PI / 180)}`).join(' ')}" fill="#ffcc4d" stroke="${C.ink}" stroke-width="4"/>`;
  [[0, -56], [0, 48], [-45, -30], [45, -30], [-45, 22], [45, 22], [0, -108], [-90, -56], [90, -56], [-90, -4], [90, -4], [-45, -82], [45, -82], [-45, 74], [45, 74], [0, 100]].forEach(([x, y]) => { if (y < 70) s += hex(x, y - 30); });
  s += `<line x1="0" y1="-60" x2="130" y2="-200" stroke="${C.ink}" stroke-width="6"/><line x1="-60" y1="20" x2="130" y2="-200" stroke="${C.ink}" stroke-width="5"/><circle cx="130" cy="-200" r="16" fill="#39485c" stroke="${C.ink}" stroke-width="5"/>`;
  return s;
}
seg(71, 72, (t, a) => {
  let w = space(t, 120) + glow(640, 330, 480, 'gWarm', .35);
  w += g(webb(t), at(640, 360 + 10 * Math.sin(t * .8), 1.25, -6 + 2 * Math.sin(t * .5)));
  w += earth2(110, 640, 60, t, { glow: .5 });
  let s = cam(w, 640, 360, lerp(1.25, 1, easeOut(prog(t, 0, 4))));
  s += pl(640, 100, 'JAMES WEBB SPACE TELESCOPE', 60, C.yellow, pop(t, a(72) + .2), -1);
  s += pl(250, 520, '1.5 million km away', 46, C.cream, pop(t, a(72) + 2.6)) + pl(1040, 520, '6.5 m gold mirror', 46, C.cream, pop(t, a(72) + 5.4));
  return s;
});

// What Webb found: the clipboard
seg(73, 77, (t, a) => {
  let s = `<rect width="${W}" height="${H}" fill="#12203a"/>` + glow(400, 300, 560, 'gRed', .5);
  // left: transits counter
  s += rstar(300, 300, 130, t, { glow: .6 });
  const n = Math.min(4, Math.floor(prog(t, .3, 3.4) * 4.01)), ph = (prog(t, .3, 3.4) * 4) % 1;
  if (t < a(74)) s += `<circle cx="${150 + ph * 300}" cy="300" r="26" fill="#1a0d0d" stroke="${C.ink}" stroke-width="5"/>`;
  s += pl(300, 520, 'crossings watched: ' + n, 48, C.cream, 1);
  // right: clipboard
  let cb = `<rect x="-250" y="-270" width="500" height="560" rx="16" fill="#8a5a2b" stroke="${C.ink}" stroke-width="7"/><rect x="-220" y="-235" width="440" height="500" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/><rect x="-70" y="-292" width="140" height="52" rx="10" fill="#aab2c0" stroke="${C.ink}" stroke-width="6"/>`;
  cb += text(0, -170, 'WHAT WEBB FOUND', 44, C.ink, { font: 'Brush' });
  const row = (y, str, t0, mark) => { if (t < t0) return ''; let r = writeOn(t, t0, t0 + .8, -190, y, str, 38, C.ink, { font: 'Brush', anchor: 'start' }); if (t > t0 + 1.4) r += g(text(0, 0, mark, 64, mark === '?' ? C.orange : C.red, { font: 'Brush' }), at(180, y + 6, pop(t, t0 + 1.4))); return r; };
  cb += row(-80, 'Thick hydrogen air', a(75), '✗') + row(10, 'CO₂ air (like Venus)', a(77), '✗');
  s += g(cb, at(900, 370, pop(t, a(74) - .1) || .001, 3));
  if (t > a(76) && t < a(77)) s += pl(300, 620, 'blown away by flares', 48, '#ffd0a0', pop(t, a(76) + .3));
  return s;
});

// Two possibilities, even odds
seg(78, 82, (t, a) => {
  let w = `<rect x="-200" y="-200" width="1700" height="1200" fill="url(#gHall)"/><rect x="-200" y="560" width="1700" height="400" fill="#0b0f22"/>`;
  const ped = (x, lit) => `<polygon points="${x - 30},-200 ${x + 30},-200 ${x + 190},600 ${x - 190},600" fill="url(#gSpot)" opacity="${lit}"/><path d="M${x - 80} 470 h160 l16 130 h-192z" fill="#2b3359" stroke="${C.ink}" stroke-width="6"/>`;
  const L = t > a(79) - .2 ? 1 : .25, R = t > a(80) - .2 ? 1 : .25;
  w += ped(380, L * .9) + ped(900, R * .9);
  w += g(tp(0, 0, 105, t, { air: 1, face: 'happy' }), at(380, 340 + 6 * Math.sin(t * 1.5)), `opacity="${lerp(.35, 1, L)}"`);
  w += g(tp(0, 0, 105, t, { rock: 1, face: 'flat' }), at(900, 340 + 6 * Math.sin(t * 1.5 + 2)), `opacity="${lerp(.35, 1, R)}"`);
  let s = cam(w, 640, 370, lerp(1.08, 1, prog(t, 0, 6)));
  s += pl(380, 120, '1. nitrogen air', 58, '#8fe3ff', pop(t, a(79) + .3)) + pl(380, 180, 'like the air in your lungs', 36, C.cream, pop(t, a(79) + 3.2));
  s += pl(900, 120, '2. no air at all', 58, '#c9ced6', pop(t, a(80) + .2)) + pl(900, 180, 'bare rock', 40, C.cream, pop(t, a(81)));
  s += pl(640, 670, 'the odds: about even', 64, C.yellow, pop(t, a(82) + 1.6));
  return s;
});

// The coin
const coin = (x, y, r, ph) => { const sx = Math.cos(ph), front = sx >= 0; return g(`<ellipse rx="${Math.max(4, Math.abs(sx) * r)}" ry="${r}" fill="${front ? '#3a86c8' : '#8a8f98'}" stroke="${C.ink}" stroke-width="7"/>` + (Math.abs(sx) > .3 ? `<ellipse rx="${Math.abs(sx) * r * .7}" ry="${r * .7}" fill="none" stroke="${C.yellow}" stroke-width="6"/>` + g(text(0, r * .22, front ? 'AIR' : 'ROCK', r * .5, C.white, { font: 'Brush' }), `scale(${Math.abs(sx)} 1)`) : ''), at(x, y)); };
seg(83, 85, (t, a) => {
  let s = `<rect width="${W}" height="${H}" fill="#0b1226"/>` + glow(640, 330, 520, 'gWarm', .4);
  const slow = t > a(85) ? .25 : 1;
  s += coin(640, 360 - 80 * Math.abs(Math.sin(t * 1.2)), 150, t * 9 * slow + (t > a(85) ? a(85) * 9 * .75 : 0));
  s += pl(640, 110, 'the honest state of Earth 2.0', 56, C.cream, pop(t, .3)) + pl(640, 640, '50 / 50', 120, C.yellow, pop(t, a(84)));
  return s;
});

// LHS 1140 b
seg(86, 87, (t, a) => {
  let w = space(t, 140);
  w += g(`<circle r="16" fill="${C.yellow}" stroke="${C.ink}" stroke-width="4"/>` + label(0, 56, 'Sun', 34, C.cream), at(250, 420));
  const pin = (x, y, str, col, k) => k > 0 ? `<line x1="250" y1="420" x2="${250 + (x - 250) * k}" y2="${420 + (y - 420) * k}" stroke="${col}" stroke-width="4" stroke-dasharray="8 8"/>` + (k >= 1 ? `<circle cx="${x}" cy="${y}" r="14" fill="#f0704f" stroke="${C.ink}" stroke-width="4"/>` + label(x, y - 34, str, 40, col) : '') : '';
  w += pin(700, 230, 'TRAPPIST-1 · 40 light-years', C.cream, easeOut(prog(t, .2, 1.2)));
  w += pin(880, 560, 'LHS 1140 · 48 light-years', C.yellow, easeOut(prog(t, a(87), a(87) + 1.4)));
  let s = cam(w, 600, 400, lerp(1.1, 1, prog(t, 0, 6)));
  if (t > a(87) + 3.4) { const k = pop(t, a(87) + 3.4); s += g(paper(-190, -140, 380, 280, 0, '#10254a') + earth2(-90, -10, 52, t, { glow: 0, sw: 4 }) + planet(70, -10, 88, '#5c7ea8', { sw: 5 }) + text(0, 116, '70% wider than Earth', 32, C.cream, { font: 'Brush' }), at(230, 170, k, -3)); }
  return s;
});
seg(88, 91, (t, a) => {
  let w = `<rect x="-200" y="-200" width="1700" height="1200" fill="url(#gSky)"/>` + stars(t, 100, W, 420, 150);
  w += `<path d="M-200 560 L80 420 L260 520 L480 380 L700 540 L920 450 L1480 580 V900 H-200z" fill="#0c2236"/>` + observatory(300, 520, t);
  w += g(`<path d="M0 0 L500 -330 L560 -250z" fill="#ffe6a8" opacity=".12"/>`, at(340, 400));
  let s = cam(w, 560, 380, lerp(1.12, 1, prog(t, 0, 6)));
  s += pl(300, 660, 'telescope in Chile', 40, C.cream, pop(t, 2.2));
  // graph panel
  let gp = paper(-250, -170, 500, 340, 0, '#0f2a22');
  const dip24 = 46 * prog(t, a(88) + 5.0, a(88) + 6.4);
  let d1 = 'M-220 -70', d2 = 'M-220 70';
  for (let x = -220; x <= 220; x += 10) { d1 += ` L${x} ${-70 + (Math.abs(x) < 60 ? dip24 * (1 - Math.abs(x) / 60) : 0) + 2 * Math.sin(x + t * 6)}`; d2 += ` L${x} ${70 + 3 * Math.sin(x * .7 + t * 7)}`; }
  gp += `<path d="${d1}" fill="none" stroke="#59f0a8" stroke-width="5"/>` + text(-150, -112, '2024', 40, C.cream, { font: 'Brush' });
  if (t > a(89)) gp += `<path d="${d2}" fill="none" stroke="#59f0a8" stroke-width="5" opacity="${fade(t, a(89) + .6)}"/>` + text(-150, 34, '2025', 40, C.cream, { font: 'Brush', opacity: fade(t, a(89) + .4) });
  s += g(gp, at(930, 330, pop(t, a(88) + 3.2) || .001, 2));
  s += pl(930, 110, 'helium streaming off', 48, '#59f0a8', pop(t, a(88) + 6.4));
  s += pl(930, 560, t < a(91) ? 'maybe it faded?' : 'or hiding in the noise?', 50, C.yellow, pop(t, t < a(91) ? a(90) : a(91)));
  return s;
});

// What the search really looks like
seg(92, 94, (t, a) => {
  let s = `<rect width="${W}" height="${H}" fill="#0d1526"/><rect y="560" width="${W}" height="160" fill="#0a0f1c"/>` + glow(640, 300, 460, 'gBlue', .35);
  // crossed-out photo
  const pk = pop(t, a(93));
  if (pk > 0 && t < a(94) + .4) s += g(paper(-150, -120, 300, 240) + earth2(0, -10, 80, t, { glow: 0, sw: 5 }) + (t > a(93) + 1.1 ? `<path d="M-130 -100 L130 100 M130 -100 L-130 100" stroke="${C.red}" stroke-width="14" stroke-linecap="round"/>` : ''), at(640, 300, pk * (1 - prog(t, a(94), a(94) + .3)), -4));
  if (t > a(94)) {
    const k = pop(t, a(94) + .1);
    let mon = `<rect x="-260" y="-170" width="520" height="330" rx="16" fill="#1b2436" stroke="${C.ink}" stroke-width="8"/><rect x="-235" y="-146" width="470" height="282" fill="#0f2a22"/><rect x="-40" y="160" width="80" height="50" fill="#1b2436" stroke="${C.ink}" stroke-width="6"/>`;
    let d = 'M-225 0'; for (let x = -225; x <= 225; x += 9) d += ` L${x} ${12 * Math.sin(x * .05 + t * 3) * Math.exp(-Math.abs(x) / 200) + 3 * Math.sin(x * .6 + t * 9)}`;
    mon += `<path d="${d}" fill="none" stroke="#59f0a8" stroke-width="5"/>`;
    s += g(mon, at(640, 300, k));
    s += person(250, 430, .95, { mood: 'flat', look: 8, lit: '#8fe3ff' }) + person(1030, 430, .95, { mood: 'flat', look: -8, coat: '#d7dde6', hair: '#222', scarf: C.teal, lit: '#8fe3ff' }) + person(1170, 450, .85, { mood: 'flat', look: -8, coat: '#c9b6f2', hair: '#a0522d', scarf: C.yellow, glasses: false });
    s += pl(640, 660, 'a faint wobble in a line of data', 50, C.cream, pop(t, a(94) + .6));
  }
  s += pl(640, 90, 'what the search really looks like', 54, C.yellow, pop(t, .2));
  return s;
});

// Be generous: the coin lands well
seg(95, 97, (t, a) => {
  let w = space(t, 160);
  const land = prog(t, a(96), a(96) + 1.2);
  if (t < a(97)) w += glow(640, 360, 420, 'gWarm', .4) + coin(640, 360 - 200 * Math.sin(Math.min(1, land) * Math.PI) * (1 - land), 150, land < 1 ? t * 14 : 0);
  else { const k = pop(t, a(97)); w += g(tp(0, 0, 200, t, { air: 1, face: 'happy' }), at(640, 370, k)); w += pl(250, 200, 'air', 70, '#8fe3ff', pop(t, a(97) + .6)) + pl(1040, 200, 'liquid water', 70, '#59b7ff', pop(t, a(97) + 2.4)); }
  return cam(w, 640, 360, lerp(1, 1.1, prog(t, 0, 7))) + pl(640, 100, "let's be generous", 60, C.cream, pop(t, .2) * (t < a(97) ? 1 : 0));
});
seg(98, 98, qcard([{ at: .1, str: 'Could humans live there?', y: 380, size: 96, dur: .9 }]), { noWobble: true, noVig: true });
