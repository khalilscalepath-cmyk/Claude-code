// Video 001, sentences 99 to 137 (5:52 to the end).

// The twilight ring
seg(99, 100, (t, a) => {
  let w = space(t, 170) + rstar(-60, 360, 240, t, { glow: .8 });
  w += tp(760, 360, 210, t, { lock: 0, air: .7 });
  const k = prog(t, a(100) + 3.4, a(100) + 4.6);
  w += `<ellipse cx="760" cy="360" rx="26" ry="212" fill="none" stroke="${C.yellow}" stroke-width="10" opacity="${k}" stroke-dasharray="${1400 * k} 1400"/>`;
  let s = cam(w, lerp(560, 700, prog(t, 0, 10)), 360, lerp(1, 1.12, prog(t, 0, 10)));
  s += pl(1010, 110, 'start with the weather', 50, C.cream, pop(t, .2) * (t < a(100) + 3 ? 1 : 0));
  s += pl(1010, 110, 'the twilight ring', 64, C.yellow, pop(t, a(100) + 4.2), -2) + pl(1010, 640, 'an endless sunset', 52, '#ffb347', pop(t, a(100) + 6.6));
  return s;
});
// Eyeball ocean
seg(101, 101, (t, a) => {
  let w = space(t, 175);
  w += glow(640, 370, 430, 'gBlue', .6) + `<circle cx="640" cy="370" r="230" fill="#e8f4fa" stroke="${C.ink}" stroke-width="7"/>`;
  const r = 120 * easeOut(prog(t, .6, 2.4));
  w += `<circle cx="640" cy="370" r="${r}" fill="#2f8fd6" stroke="${C.ink}" stroke-width="6"/><circle cx="${640 - r * .3}" cy="${370 - r * .3}" r="${r * .25}" fill="#8fd0ff" opacity=".7"/>`;
  for (let i = 0; i < 8; i++) w += `<path d="M${640 + 180 * Math.cos(i * .8)} ${370 + 180 * Math.sin(i * .8)} l14 -22 l12 22z" fill="#bfe3f2" stroke="${C.ink}" stroke-width="3"/>`;
  return cam(w, 640, 370, lerp(1.15, 1, prog(t, 0, 6))) + pl(640, 90, 'one round sea, under the star', 54, '#8fd0ff', pop(t, 2.2)) + pl(640, 680, 'surrounded by ice', 46, C.cream, pop(t, 4.4));
});
// Twilight landscape, sister planets
seg(102, 103, (t, a) => {
  let w = `<rect x="-200" y="-200" width="1700" height="1200" fill="#1a1236"/><rect x="-200" y="330" width="1700" height="260" fill="#8a3a4a" opacity=".8"/><rect x="-200" y="430" width="1700" height="200" fill="#e07a45" opacity=".8"/>` + stars(t, 70, W, 300, 181);
  w += glow(1000, 500, 420, 'gRed', 1) + `<circle cx="1000" cy="520" r="120" fill="#f0704f" stroke="${C.ink}" stroke-width="6"/>`;
  [[200, 150, 44, '#8d99ae'], [380, 90, 30, '#c9a36b'], [560, 170, 58, '#b5838d'], [760, 80, 36, '#84a59d'], [930, 190, 26, '#9b8ac4'], [1110, 110, 46, '#bfe3f2']].forEach(([x, y, r, c], i) => { w += g(`<circle r="${r}" fill="${c}" stroke="${C.ink}" stroke-width="5"/><circle cx="${r * .4}" cy="${r * .3}" r="${r}" fill="#000" opacity=".25" clip-path="circle(${r}px at ${-r * .4}px ${-r * .3}px)"/>`, at(x + t * 4, y + 5 * Math.sin(t + i), pop(t, .3 + i * .25))); });
  w += `<path d="M-200 580 Q200 520 520 570 T1100 560 T1500 590 V900 H-200z" fill="#140a1e" stroke="${C.ink}" stroke-width="6"/><path d="M-200 600 Q300 580 700 610 T1500 600 V640 H-200z" fill="#3a6fa0" opacity=".7"/>`;
  w += person(300, 440, .8, { mood: 'happy', look: 6, lookY: -6, lit: '#ff9d80' });
  return cam(w, 640, 360, lerp(1.1, 1, prog(t, 0, 8))) + pl(640, 680, 'It would be beautiful.', 60, C.cream, pop(t, a(103)));
});
// Radiation, shelter
seg(104, 106, (t, a) => {
  const flash = .5 + .5 * Math.sin(t * 14);
  let w = `<rect x="-200" y="-200" width="1700" height="1200" fill="#3a0f14"/>` + glow(1000, 160, 700, 'gRed', .7 + .3 * flash) + `<circle cx="1000" cy="170" r="130" fill="#ff8a66" stroke="${C.ink}" stroke-width="6"/>`;
  for (let i = 0; i < 10; i++) w += `<line x1="${1000 - i * 30}" y1="${200 + i * 8}" x2="${1000 - i * 30 - 200 - ((t * 300 + i * 50) % 300)}" y2="${200 + i * 8 + 240 + ((t * 300 + i * 50) % 300) * .5}" stroke="#ffd0a0" stroke-width="6" opacity=".5"/>`;
  w += `<path d="M-200 330 H1500 V900 H-200z" fill="#24101a" stroke="${C.ink}" stroke-width="6"/>`;
  // underground base
  w += `<rect x="330" y="420" width="620" height="220" rx="30" fill="#1d3a5c" stroke="${C.ink}" stroke-width="7"/><rect x="590" y="300" width="80" height="130" fill="#1d3a5c" stroke="${C.ink}" stroke-width="7"/><rect x="570" y="286" width="120" height="26" rx="8" fill="#aab2c0" stroke="${C.ink}" stroke-width="6"/>`;
  w += glow(640, 520, 260, 'gWarm', .5) + `<rect x="370" y="560" width="120" height="50" fill="#57c785" stroke="${C.ink}" stroke-width="5"/><rect x="800" y="540" width="100" height="70" fill="#8a5a2b" stroke="${C.ink}" stroke-width="5"/>`;
  const inside = t > a(105);
  w += inside ? person(640, 470, .62, { mood: 'flat' }) : person(lerp(200, 600, prog(t, .3, a(105))), 170, .62, { mood: 'worry', look: 6, armR: -150, armL: 150 });
  return cam(w, 640, lerp(300, 440, easeInOut(prog(t, a(105), a(106) + 1))), 1.05) + pl(330, 110, t < a(105) ? 'radiation, every flare' : 'life under shielding', 52, '#ffd0a0', pop(t, t < a(105) ? 1.6 : a(106)));
});
// Last catch
seg(107, 108, (t, a) => {
  let w = space(t, 190) + g(tp(0, 0, 200, t, { air: 1 }), at(430, 300));
  const lt = t - a(108);
  w += catchTag(590, 560, 'THE LAST CATCH', lt > 0 ? 1 : 0, 14 * Math.exp(-Math.max(0, lt) * 1.2) * Math.sin(lt * 7));
  return cam(w, 640, 360, lerp(1.08, 1, prog(t, 0, 5))) + pl(940, 200, 'if you could arrive', 52, C.cream, pop(t, .5)) + pl(960, 300, 'and the biggest', 56, C.red, pop(t, a(108) + 1.4), -3);
});

// 40 light-years
const distLine = (t, o = {}) => `<line x1="110" y1="380" x2="1170" y2="380" stroke="${C.cream}" stroke-width="5" stroke-dasharray="3 14" stroke-linecap="round"/>` + earth2(110, 380, 46, t, { glow: .5, sw: 5 }) + rstar(1170, 380, 34, t, { sw: 5 }) + label(110, 480, 'Earth', 40, C.cream) + label(1150, 480, 'TRAPPIST-1', 40, '#ff9d80');
seg(109, 111, (t, a) => {
  let w = space(t, 200) + distLine(t);
  const p = prog(t, a(110), a(110) + 4.4), x = lerp(160, 1130, p);
  if (t > a(110)) w += `<line x1="160" y1="380" x2="${x}" y2="380" stroke="${C.yellow}" stroke-width="8"/>` + glow(x, 380, 50, 'gWarm') + `<circle cx="${x}" cy="380" r="10" fill="#fff"/>`;
  let s = w + pl(640, 130, '40 light-years', 100, C.yellow, pop(t, .4), -2);
  if (t > a(110)) s += pl(640, 600, 'light takes ' + Math.round(40 * p) + ' years', 60, C.cream, 1);
  if (t > a(111)) s += pl(640, 680, 'we are much slower', 50, C.red, pop(t, a(111) + .2));
  return s;
});
// Voyager
function voyager() { return `<line x1="0" y1="0" x2="-150" y2="40" stroke="${C.ink}" stroke-width="7"/><line x1="0" y1="0" x2="120" y2="-90" stroke="${C.ink}" stroke-width="6"/><rect x="100" y="-112" width="50" height="24" fill="#8d99ae" stroke="${C.ink}" stroke-width="5" transform="rotate(-36 125 -100)"/><polygon points="-36,-20 36,-20 46,24 -46,24" fill="#d7dde6" stroke="${C.ink}" stroke-width="6"/><ellipse cx="0" cy="-34" rx="74" ry="26" fill="${C.white}" stroke="${C.ink}" stroke-width="6"/><line x1="0" y1="-34" x2="0" y2="-82" stroke="${C.ink}" stroke-width="5"/><circle cy="-84" r="8" fill="${C.yellow}" stroke="${C.ink}" stroke-width="4"/>`; }
seg(112, 116, (t, a) => {
  let w = space(t, 210);
  for (let i = 0; i < 14; i++) { const x = 1400 - ((t * 420 + i * 120) % 1700); w += `<line x1="${x}" y1="${80 + i * 44}" x2="${x + 90}" y2="${80 + i * 44}" stroke="#fff" stroke-width="3" opacity=".35"/>`; }
  w += g(voyager(), at(640 + 8 * Math.sin(t * 2), 350 + 6 * Math.sin(t * 3), 1.3, -8));
  let s = cam(w, 640, 360, lerp(1.2, 1, easeOut(prog(t, 0, 4))));
  s += pl(640, 100, 'VOYAGER 1', 96, C.yellow, pop(t, a(112) + 2.4), -2);
  s += pl(240, 560, 'launched 1977', 50, C.cream, pop(t, a(113) + .5)) + pl(1010, 560, '17 km every second', 50, C.cream, pop(t, a(113) + 4));
  if (t > a(114)) { const k = pop(t, a(114) + .3); s += g(`<rect x="-380" y="-70" width="760" height="140" rx="12" fill="#0b1226" stroke="${C.yellow}" stroke-width="6"/>` + text(0, -10, 'after ' + Math.round(lerp(0, 49, prog(t, a(114) + .5, a(114) + 2.6))) + ' years:', 46, C.cream, { font: 'Brush' }) + (t > a(115) ? text(0, 46, '1 light-day from Earth', 54, C.yellow, { font: 'Brush' }) : ''), at(640, 630, k)); }
  return s;
});
// 14,000 light-days, 700,000 years
seg(117, 120, (t, a) => {
  let s = space(t, 220);
  const z = easeInOut(prog(t, .3, 3.4)), tick = lerp(1000, 1060 / 14610, z);
  s += `<line x1="110" y1="250" x2="1170" y2="250" stroke="${C.cream}" stroke-width="5"/>` + earth2(110, 250, 30, t, { glow: .4, sw: 4 }) + `<rect x="110" y="238" width="${Math.max(3, tick)}" height="24" fill="${C.yellow}"/>`;
  if (z > .6) s += rstar(1170, 250, 22, t, { sw: 4 }) + label(1150, 190, 'TRAPPIST-1', 34, '#ff9d80');
  s += pl(640, 120, z < 1 ? '1 light-day' : '14,000+ light-days', 64, C.yellow, 1);
  const bar = (y, wd, col, str, k) => k > 0 ? `<rect x="110" y="${y}" width="${wd * easeOut(k)}" height="54" rx="8" fill="${col}" stroke="${C.ink}" stroke-width="6"/>` + label(110 + wd * easeOut(k) + 20, y + 42, str, 44, C.cream, { anchor: 'start' }) : '';
  s += bar(400, 700, C.red, 'the trip: 700,000+ years', prog(t, a(118) + 1.4, a(118) + 3));
  s += bar(520, 300, C.teal, 'humans have existed: 300,000', prog(t, a(119) + .6, a(119) + 2));
  s += pl(640, 670, 'leave before there were humans. still not there.', 42, C.cream, pop(t, a(120) + 1.5));
  return s;
});
// So no.
seg(121, 123, (t, a) => {
  let s = `<rect width="${W}" height="${H}" fill="#070b1a"/>` + stars(t, 80, W, H, 230);
  const off = t > a(122) + 1.2, flick = off ? ((t - a(122) - 1.2) < .5 && Math.sin(t * 60) > 0 ? .8 : .12) : 1;
  s += g(`<g filter="url(#soft)" opacity="${.9 * flick}">` + text(0, 0, 'EARTH 2.0', 170, '#59f0ff', { font: 'Brush' }) + '</g>' + text(0, 0, 'EARTH 2.0', 170, off && flick < .5 ? '#2a3a4a' : '#eaffff', { font: 'Brush', stroke: off && flick < .5 ? '#1a2633' : '#19b6d6', sw: 5 }), at(640, 330, 1, -2));
  s += g(text(0, 0, 'NO.', 150, C.red, { font: 'Brush', stroke: C.ink, sw: 14 }), at(640, 140, lerp(2.4, 1, easeOut(prog(t, a(121), a(121) + .16))) * (t > a(121) ? 1 : 0), -6));
  if (t > a(123)) ['not us', 'not our grandchildren', 'not anyone we can imagine'].forEach((str, i) => { s += pl(250 + i * 390, 560 + (i % 2) * 60, str, 46, C.cream, pop(t, a(123) + i * 1.1)); });
  return s;
});
seg(124, 125, (t, a) => card(t, [{ at: .15, str: 'Then why does any of this matter?', y: 320, size: 80, dur: 1.5 }, { at: a(125) + .2, str: 'The prize was never a place to move to.', y: 460, size: 58, dur: 1.8, width: 760 }]), { noWobble: true, noVig: true });

// Fifteen more looks; subtracting the star
seg(126, 127, (t, a) => {
  let w = space(t, 240);
  w += rstar(330, 330, 180, t, { glow: .7 });
  const cyc = (t * .55) % 1, bx = lerp(100, 560, clamp(cyc * 2)), ex = lerp(100, 560, clamp(cyc * 2 - .8));
  if (t < a(127)) { w += `<circle cx="${bx}" cy="300" r="20" fill="#3a3f48" stroke="${C.ink}" stroke-width="4"/>` + label(bx, 262, 'b', 34, '#c9ced6'); if (cyc > .4) w += `<circle cx="${ex}" cy="370" r="24" fill="#1a0d0d" stroke="#8fe3ff" stroke-width="5"/>` + label(ex, 430, 'e', 34, '#8fe3ff'); }
  w += g(webb(t), at(1060, 300, .55, -8));
  let s = cam(w, 640, 340, lerp(1.08, 1, prog(t, 0, 8)));
  const n = Math.min(15, Math.floor(prog(t, 1.5, a(127) - .5) * 15.01));
  s += pl(900, 560, 'new observations: ' + n + ' / 15', 54, C.yellow, pop(t, 1.2));
  if (t > a(127)) {
    const spec = (x, gaps, lab, k) => { let b = `<rect x="-120" y="-34" width="240" height="68" fill="#f0704f" stroke="${C.ink}" stroke-width="5"/>`; gaps.forEach(gx => b += `<rect x="${gx}" y="-34" width="12" height="68" fill="#0b0b0d"/>`); return g(b + label(0, 84, lab, 36, C.cream), at(x, 560, k)); };
    s = cam(w, 640, 300, 1) + spec(240, [-80, 20, 70], 'star + planet e', pop(t, a(127) + .2)) + pl(430, 576, '−', 90, C.cream, pop(t, a(127) + 1)) + spec(620, [-80, 70], 'star alone (b)', pop(t, a(127) + 1.2)) + pl(810, 576, '=', 90, C.cream, pop(t, a(127) + 2.6)) + spec(1010, [20], "the planet's air", pop(t, a(127) + 3.2));
  }
  return s;
});
// For the first time in history
seg(128, 128, (t, a) => {
  let w = space(t, 250) + g(tp(0, 0, 200, t, { air: .5 + .5 * Math.sin(t * 2) }), at(640, 370));
  return cam(w, 640, 370, lerp(1, 1.18, prog(t, 0, 10))) + pl(640, 100, 'for the first time in history', 64, C.yellow, pop(t, 2.6), -2) + pl(640, 670, 'does an Earth-sized planet have air?', 50, C.cream, pop(t, 5.6));
});
// Billions of red dwarfs
seg(129, 131, (t, a) => {
  let w = space(t, 260, '#05081a', 40);
  for (let i = 0; i < 90; i++) { const sh = pop(t, a(130) - .3 + rnd(i + 5) * 2.5); if (sh <= 0) continue; const x = 60 + rnd(i + 400) * 1160, y = 150 + rnd(i + 450) * 470, r = 5 + rnd(i) * 7; w += `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="url(#gRed)" opacity=".7"/><circle cx="${x}" cy="${y}" r="${r * sh}" fill="#f0704f" stroke="${C.ink}" stroke-width="2"/>`; if (t > a(131) + rnd(i) * 2.4) w += `<circle cx="${x + r * 2.4}" cy="${y - r}" r="4" fill="#8fe3ff"/>`; }
  return cam(w, 640, 360, lerp(1.3, 1, easeOut(prog(t, 0, 9)))) + pl(640, 90, 'red dwarfs: the most common stars', 54, '#ff9d80', pop(t, a(130) + .4)) + pl(640, 680, 'billions of places worth checking', 54, '#8fe3ff', pop(t, a(131) + 2.4));
});
// And if it doesn't
seg(132, 134, (t, a) => {
  let w = space(t, 270) + earth2(640, 360, lerp(120, 170, prog(t, 0, 10)), t);
  let s = w + pl(640, 100, "and if it doesn't?", 60, C.cream, pop(t, .2) * (t < a(134) ? 1 : 0));
  s += writeOn(t, a(134), a(134) + 2.6, 640, 610, '"…we are special here on Earth,', 50, C.cream, { font: 'Brush' });
  s += writeOn(t, a(134) + 2.8, a(134) + 4.8, 640, 675, 'and to love our planet even more."', 50, C.yellow, { font: 'Brush' });
  return s;
});
// You are standing on it
seg(135, 137, (t, a) => {
  const z = easeInOut(prog(t, a(136) + 4.4, a(137) + 1.4));
  let w = `<rect x="-3000" y="-3000" width="7300" height="6000" fill="#070b1a"/>` + stars(t, 140, W, H, 280);
  w += glow(640, 1700, 1700, 'gBlue', .7) + `<circle cx="640" cy="1700" r="1250" fill="#2f8fd6" stroke="${C.ink}" stroke-width="8"/><path d="M-300 900 Q200 560 640 520 T1580 900 Q900 700 640 720 T-300 900z" fill="#57c785"/>`;
  w += glow(1040, 400, 260, 'gWarm', .9 * (1 - z)) + `<circle cx="1040" cy="430" r="60" fill="${C.yellow}" stroke="${C.ink}" stroke-width="6" opacity="${1 - z}"/>`;
  w += person(640, 330, .8, { mood: 'happy', lit: '#ffe6a8' });
  let s = cam(w, 640, lerp(380, 1660, z), lerp(1.15, .25, z));
  if (t < a(136)) s += pl(640, 110, 'no Earth 2.0 we can reach', 58, C.cream, pop(t, .4));
  ['air you can breathe', 'water you can drink', 'a sun that actually sets'].forEach((str, i) => { const t0 = a(136) + [1.9, 3.2, 4.4][i]; if (t > t0 && z < .2) s += pl(220 + i * 420, 640, str, 44, C.yellow, pop(t, t0)); });
  s += pl(640, 110, 'You are standing on it.', 84, C.cream, pop(t, a(137)));
  return s;
});
