// Video 001, sentences 10 to 54 (0:31 to 3:12). seg(first, last, draw(t, a)); a(i) = local time sentence i starts.

// 6,000 planets
seg(10, 11, (t, a) => {
  let w = space(t, 5);
  const n = Math.round(160 * easeOut(prog(t, .2, 3.6)));
  for (let i = 0; i < n; i++) { const x = 40 + rnd(i + 900) * 1200, y = 230 + rnd(i + 950) * 440, r = 6 + rnd(i + 990) * 14; w += `<circle cx="${x}" cy="${y}" r="${r}" fill="${['#c96a3d', '#8d99ae', '#e9c46a', '#9b5de5', '#3a86c8', '#f4845f'][i % 6]}" stroke="${C.ink}" stroke-width="3"/>`; }
  let s = cam(w, 640, 360, lerp(1.15, 1, easeOut(prog(t, 0, 4))));
  s += label(640, 140, Math.round(6464 * easeOut(prog(t, .2, 3.4))).toLocaleString('en-US'), 150, C.yellow);
  s += text(640, 200, 'planets confirmed around other stars', 40, C.cream);
  if (t > a(11)) s += g(`<rect x="-330" y="-64" width="660" height="128" rx="10" fill="${C.red}" stroke="${C.ink}" stroke-width="7"/>` + text(0, 26, 'ALMOST ALL TERRIBLE', 74, C.white, { font: 'Brush' }), at(640, 430, lerp(2.2, 1, easeOut(prog(t, a(11), a(11) + .18))), -5));
  return s;
});
// furnace
seg(12, 12, t => {
  let w = `<rect x="-200" y="-200" width="1700" height="1200" fill="#2a0d0a"/>` + glow(640, 360, 620, 'gRed', .8);
  w += planet(640, 370, 210, C.salmon, { face: 'wavy', bands: [{ d: 'M-230 -90 h460 v50 h-460z', fill: C.orange }, { d: 'M-230 30 h460 v40 h-460z', fill: C.red, o: .7 }, { d: 'M-230 120 h460 v30 h-460z', fill: '#ffb347', o: .6 }] });
  for (let i = 0; i < 6; i++) { const y = (t * 150 + i * 60) % 240; w += `<path d="M${380 + i * 16} ${200 + y} q-12 22 0 32 q12 -10 0 -32z" fill="#9ddcff" stroke="${C.ink}" stroke-width="4"/>`; }
  for (let i = 0; i < 9; i++) w += `<path d="M${200 + i * 110} ${700 - ((t * 200 + i * 77) % 300)} q20 -40 0 -80 q-20 40 0 80z" fill="${C.orange}" opacity=".7"/>`;
  return cam(w, 640, 360, lerp(1, 1.1, prog(t, 0, 2.3))) + pl(640, 660, 'hotter than a furnace', 58, C.yellow, pop(t, .2));
});
// frozen
seg(13, 13, t => {
  let w = space(t, 9, '#04060f', 40);
  w += planet(640 + 5 * Math.sin(t * 38), 360, 190, C.ice, { face: 'sad', bands: [{ d: 'M-200 -40 l120 -60 l100 80 l140 -40 v-160 h-360z', fill: C.white }, { d: 'M-200 120 l150 -30 l120 40 l100 -20 v100 h-370z', fill: '#9cc9dd' }] });
  for (let i = 0; i < 30; i++) w += `<circle cx="${(rnd(i + 3) * 1280 + t * 30) % 1280}" cy="${(rnd(i + 30) * 720 + t * 80) % 720}" r="4" fill="#fff" opacity=".8"/>`;
  return cam(w, 640, 360, lerp(1.1, 1, prog(t, 0, 2))) + pl(640, 660, 'frozen in the dark', 58, C.ice, pop(t, .2));
});
// glass rain
seg(14, 14, t => {
  let w = `<rect x="-200" y="-200" width="1700" height="1200" fill="#0a1830"/>`;
  w += planet(640, 370, 200, C.blue, { face: 'ooh', bands: [{ d: 'M-220 -60 q220 -60 440 0 v40 q-220 -50 -440 0z', fill: '#6fb3e8' }] });
  for (let i = 0; i < 26; i++) { const yy = ((t * 520 + i * 61) % 900) - 100, xx = 100 + i * 46 + yy * .4; w += `<path d="M${xx} ${yy} l16 36 l-22 -8z" fill="${C.white}" stroke="${C.ink}" stroke-width="3"/>`; }
  return cam(w, 640, 360, lerp(1, 1.08, prog(t, 0, 3))) + pl(640, 660, 'raining molten glass', 58, C.white, pop(t, .2));
});

// Habitable zone, seen from above
seg(15, 17, (t, a) => {
  let w = space(t, 21, '#070b1a', 60);
  const cx = 250, cy = 380, show = easeOut(prog(t, 3.2, 4.4));
  w += `<circle cx="${cx}" cy="${cy}" r="${700 * show}" fill="#3a86c8" opacity=".22"/><circle cx="${cx}" cy="${cy}" r="${470 * show}" fill="#57c785" opacity=".5"/><circle cx="${cx}" cy="${cy}" r="${330 * show}" fill="#070b1a"/><circle cx="${cx}" cy="${cy}" r="${330 * show}" fill="#d94f3d" opacity=".35"/>`;
  w += glow(cx, cy, 300, 'gWarm', .9) + `<circle cx="${cx}" cy="${cy}" r="100" fill="${C.yellow}" stroke="${C.ink}" stroke-width="6"/>` + g(faceSvg(100, 'happy'), at(cx, cy));
  const ang = -.35 + t * .035, R = lerp(900, 400, easeOut(prog(t, .5, 2.8)));
  w += `<circle cx="${cx}" cy="${cy}" r="400" fill="none" stroke="${C.cream}" stroke-width="3" stroke-dasharray="4 14" opacity="${show}"/>`;
  w += earth2(cx + R * Math.cos(ang), cy + R * Math.sin(ang), 52, t, { glow: .5 });
  let s = cam(w, lerp(520, 640, prog(t, 0, 5)), 360, lerp(1.12, 1, prog(t, 0, 5)));
  s += pl(880, 110, 'THE HABITABLE ZONE', 72, '#8ff0a8', pop(t, a(16) + .6), -2);
  s += pl(460, 640, 'too hot', 52, '#ff8a75', pop(t, a(17))) + pl(900, 640, 'too cold', 52, '#8fc8ff', pop(t, a(17) + .75));
  return s;
});

// First catch
seg(18, 19, (t, a) => {
  let w = space(t, 31) + earth2(420, 300, 210, t + 4);
  const lt = t - .5;
  w += catchTag(560, 560, 'CATCH No. 1', lt > 0 ? 1 : 0, 14 * Math.exp(-Math.max(0, lt) * 1.2) * Math.sin(lt * 7));
  let s = cam(w, 640, 360, lerp(1.08, 1, prog(t, 0, 4)));
  s += writeOn(t, a(19), a(19) + 1.3, 900, 250, '"habitable zone"', 56, C.cream, { font: 'Brush' });
  s += pl(900, 340, 'does NOT mean', 50, C.red, pop(t, a(19) + 1.2), -3);
  s += writeOn(t, a(19) + 1.7, a(19) + 2.4, 900, 430, 'habitable', 64, C.cream, { font: 'Brush' });
  return s;
});

// Venus
seg(20, 20, (t, a) => {
  let w = `<rect x="-200" y="-200" width="1700" height="1200" fill="#7a3b12"/><rect x="-200" y="-200" width="1700" height="640" fill="#c9792a"/>` + glow(950, 160, 420, 'gWarm', .8);
  for (let i = 0; i < 5; i++) w += `<ellipse cx="${(i * 330 + t * 25) % 1600 - 100}" cy="${90 + (i % 3) * 70}" rx="220" ry="46" fill="#e2a24e" opacity=".75"/>`;
  w += `<path d="M-200 460 L60 330 L210 450 L420 300 L640 470 L900 380 L1120 470 L1480 360 V900 H-200z" fill="#5c2a0c" stroke="${C.ink}" stroke-width="6"/>`;
  const m = prog(t, 3.0, 5.2);
  w += g(`<ellipse cx="0" cy="62" rx="${170 + 170 * m}" ry="${12 + 30 * m}" fill="#9aa3b2" stroke="${C.ink}" stroke-width="6"/><path d="M-130 ${-50 + 96 * m} h260 l26 ${112 - 96 * m} h-312z" fill="#aab2c0" stroke="${C.ink}" stroke-width="6"/>` + text(0, 34 + 30 * m, 'LEAD', 54, C.ink, { font: 'Brush', opacity: 1 - m }), at(520, 560));
  w += thermo(1050, 520, 260, prog(t, 2.2, 4.2), C.red, '465 °C', pop(t, 2.0));
  return cam(w, 640, 380, lerp(1, 1.08, prog(t, 0, 6))) + pl(250, 120, 'VENUS', 96, C.yellow, pop(t, .2), -4);
});

// Lottery ticket
seg(21, 22, (t, a) => {
  let s = `<rect width="${W}" height="${H}" fill="#0b1226"/>` + glow(640, 340, 560, 'gWarm', .4);
  const k = pop(t, .15), wig = 3 * Math.sin(t * 3);
  let tk = `<rect x="-340" y="-160" width="680" height="320" rx="18" fill="${C.cream}" stroke="${C.ink}" stroke-width="7"/><line x1="170" y1="-160" x2="170" y2="160" stroke="${C.ink}" stroke-width="4" stroke-dasharray="10 10"/>`;
  tk += text(-85, -80, 'COSMIC LOTTERY', 58, C.red, { font: 'Brush' }) + text(-85, 0, 'HABITABLE ZONE', 64, C.ink, { font: 'Brush' }) + text(-85, 70, 'admit one planet', 40, C.ink) + text(255, 10, 'No.', 38, C.ink) + text(255, 62, '6464', 46, C.ink, { font: 'Brush' });
  s += g(tk, at(640, 320, k, -5 + wig));
  s += pl(640, 640, 'A ticket. Not the prize.', 68, C.yellow, pop(t, a(22) + .3));
  return s;
});
seg(23, 23, qcard([{ at: .25, str: 'So which planet holds the best ticket?', y: 380, size: 72, dur: 1.4 }]), { noWobble: true, noVig: true });

// TRAPPIST-1 system from above
seg(24, 25, (t, a) => {
  let w = space(t, 44);
  const cx = 640, cy = 380;
  w += rstar(cx, cy, 46, t);
  const rs = [78, 108, 150, 198, 258, 314, 400], per = [1.5, 2.4, 4.0, 6.1, 9.2, 12.4, 18.8];
  rs.forEach((R, i) => {
    const sh = prog(t, a(25) + 1.6 + i * .12, a(25) + 2 + i * .12), e = i === 3;
    w += `<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * .62}" fill="none" stroke="${e ? C.yellow : C.cream}" stroke-width="${e ? 4 : 2}" opacity="${(e ? 1 : .45) * (e ? 1 : sh)}"/>`;
    const an = t * 6 / per[i] + i * 1.3, px = cx + R * Math.cos(an), py = cy + R * .62 * Math.sin(an);
    if (e) w += tp(px, py, 24, t, { sw: 4 }); else if (sh > 0) w += `<circle cx="${px}" cy="${py}" r="${12 + i % 3 * 3}" fill="${['#8d99ae', '#c9a36b', '#b5838d', '', '#84a59d', '#9b8ac4', '#bfe3f2'][i]}" stroke="${C.ink}" stroke-width="4" opacity="${sh}"/>`;
  });
  let s = cam(w, cx, cy, lerp(1.5, 1.05, easeInOut(prog(t, a(25), a(25) + 3))));
  s += pl(640, 110, 'TRAPPIST-1e', 110, C.yellow, pop(t, a(24) + .1), -2);
  s += pl(190, 620, 'found: 2017', 50, C.cream, pop(t, a(25) + .4)) + pl(1040, 620, '7 rocky planets', 50, C.cream, pop(t, a(25) + 2.3));
  return s;
});

// Size, gravity, sunlight
seg(26, 26, (t, a) => {
  let w = space(t, 51) + earth2(400, 350, 180, t, { glow: .5 }) + tp(880, 350, 166, t);
  w += `<line x1="220" y1="590" x2="580" y2="590" stroke="${C.cream}" stroke-width="6"/><line x1="714" y1="590" x2="1046" y2="590" stroke="${C.yellow}" stroke-width="6"/>`;
  return cam(w, 640, 370, lerp(1.06, 1, prog(t, 0, 2.5))) + pl(400, 660, 'Earth', 54, C.cream, 1) + pl(880, 660, '92% as wide', 60, C.yellow, pop(t, .5));
});
seg(27, 27, (t, a) => {
  const half = (x, kg, bgc, who) => { let b = `<rect x="${x}" y="-200" width="640" height="1200" fill="${bgc}"/>`; b += `<rect x="${x + 180}" y="540" width="280" height="56" rx="12" fill="#d7dde6" stroke="${C.ink}" stroke-width="6"/><circle cx="${x + 320}" cy="568" r="34" fill="${C.white}" stroke="${C.ink}" stroke-width="5"/>` + text(x + 320, 580, kg, 34, C.red, { font: 'Brush' }); b += person(x + 320, 360, 1, { mood: who ? 'happy' : 'flat', armR: who ? -150 : 10, armL: who ? 150 : -10 }); return b; };
  let s = half(0, '80', '#18315c', 0) + half(640, String(Math.round(lerp(80, 65, easeOut(prog(t, 3.3, 4.6))))), '#5c2a1e', t > 4.2);
  s += `<line x1="640" y1="0" x2="640" y2="720" stroke="${C.ink}" stroke-width="8"/>`;
  s += pl(320, 110, 'EARTH', 64, C.cream, 1) + pl(960, 110, 'TRAPPIST-1e', 64, C.yellow, 1) + pl(960, 680, 'gravity: about 4/5', 46, C.cream, pop(t, .8));
  return s;
});
seg(28, 28, (t, a) => {
  let w = space(t, 58);
  w += glow(330, 330, 330, 'gWarm', 1) + `<circle cx="330" cy="330" r="110" fill="${C.yellow}" stroke="${C.ink}" stroke-width="6"/>`;
  w += glow(950, 330, 330, 'gRed', .66) + `<circle cx="950" cy="330" r="110" fill="#f0704f" stroke="${C.ink}" stroke-width="6"/>`;
  w += `<rect x="180" y="540" width="300" height="40" rx="8" fill="${C.yellow}" stroke="${C.ink}" stroke-width="5"/><rect x="800" y="540" width="300" height="40" rx="8" fill="#1b2748" stroke="${C.ink}" stroke-width="5"/><rect x="800" y="540" width="${300 * .65 * easeOut(prog(t, .6, 1.8))}" height="40" rx="8" fill="#f0704f" stroke="${C.ink}" stroke-width="5"/>`;
  return w + pl(330, 650, 'sunlight on Earth', 44, C.cream, 1) + pl(950, 650, 'about two thirds', 52, C.yellow, pop(t, 1.2));
});

// Minus 18 / minus 23, "on paper"
seg(29, 33, (t, a) => {
  let s = `<rect width="${W}" height="${H}" fill="#3b2a1e"/>` + glow(640, 300, 700, 'gWarm', .35);
  const lift = t > a(33) - .1 ? 1 : 0;
  let pg = paper(-470, -290, 940, 580, 0);
  pg += g(earth2(0, 0, 70, t, { glow: 0, sw: 5 }), at(-250, -160)) + g(tp(0, 0, 64, t, { sw: 5 }), at(250, -160));
  pg += text(-250, -55, 'Earth, no air', 40, C.ink, { font: 'Brush' }) + text(250, -55, 'TRAPPIST-1e, no air', 40, C.ink, { font: 'Brush' });
  pg += thermo(-250, 150, 150, prog(t, a(30) + 2.0, a(30) + 3.6) * .5, C.blue, '−18 °C', pop(t, a(30) + 1.6) || .001);
  pg += thermo(250, 150, 150, prog(t, a(31) + 2.0, a(31) + 3.2) * .42, C.blue, '−23 °C', pop(t, a(31) + 1.6) || .001);
  if (t > a(32)) pg += g(text(0, 0, 'almost the same start', 46, C.red, { font: 'Brush' }), at(0, 20, pop(t, a(32) + 1.2), -4));
  s += g(pg, at(640, 370, lerp(.92, 1, prog(t, 0, 8)) * (lift ? lerp(1, 1.12, prog(t, a(33), a(33) + .5)) : 1), -2 + lift * 3));
  if (t > a(33)) s += g(`<rect x="-250" y="-70" width="500" height="140" rx="10" fill="none" stroke="${C.red}" stroke-width="12"/>` + text(0, 34, 'ON PAPER', 110, C.red, { font: 'Brush' }), at(640, 370, lerp(2.4, 1, easeOut(prog(t, a(33), a(33) + .16))), -10));
  return s;
});
seg(34, 34, qcard([{ at: .2, str: 'Now we have to talk about its sun.', y: 380, size: 76, dur: 1.5 }]), { noWobble: true, noVig: true });

// The star: red dwarf line-up
seg(35, 37, (t, a) => {
  let w = space(t, 66);
  w += glow(-260, 380, 900, 'gWarm', .9) + `<circle cx="-520" cy="380" r="760" fill="${C.yellow}" stroke="${C.ink}" stroke-width="8"/>`;
  w += pl(120, 150, 'our Sun', 60, C.ink, 1, 0, { stroke: C.yellow });
  const jk = pop(t, a(36) + 2.2), sk = pop(t, .3);
  w += g(`<circle r="60" fill="#d9b38c" stroke="${C.ink}" stroke-width="6"/><path d="M-58 -16 h116 M-60 10 h120 M-50 32 h100" stroke="#a9744f" stroke-width="9"/><ellipse cx="22" cy="20" rx="14" ry="8" fill="#c0563b"/>`, at(700, 400, jk)) + pl(700, 520, 'Jupiter', 44, C.cream, jk);
  w += g(rstar(0, 0, 72, t, { glow: lerp(.5, 1, prog(t, a(37), a(37) + 1)) }), at(1000, 400, sk)) + pl(1000, 540, 'TRAPPIST-1', 50, '#ff9d80', sk);
  let s = cam(w, lerp(820, 640, easeInOut(prog(t, a(36), a(36) + 2))), 380, lerp(1.5, 1, easeInOut(prog(t, a(36), a(36) + 2))));
  s += pl(640, 100, 'A RED DWARF', 84, '#ff9d80', pop(t, .9), -2) + pl(1000, 640, '9% of the Sun’s mass', 46, C.cream, pop(t, a(36) + .5));
  return s;
});

// Huddling close: 30x closer
seg(38, 39, (t, a) => {
  let w = space(t, 71);
  const top = (cx, col, R, lab, pr) => `<circle cx="${cx}" cy="330" r="${R}" fill="none" stroke="${C.cream}" stroke-width="3" stroke-dasharray="5 12"/>` + label(cx, 640, lab, 46, col);
  w += top(330, C.cream, 230, 'Earth: 150 million km') + glow(330, 330, 150, 'gWarm') + `<circle cx="330" cy="330" r="34" fill="${C.yellow}" stroke="${C.ink}" stroke-width="5"/>`;
  w += earth2(330 + 230 * Math.cos(t * .5), 330 + 230 * Math.sin(t * .5), 20, t, { glow: .3, sw: 4 });
  const R2 = lerp(230, 26, easeInOut(prog(t, a(39) + .3, a(39) + 2.4)));
  w += `<circle cx="950" cy="330" r="${R2}" fill="none" stroke="${C.yellow}" stroke-width="3" stroke-dasharray="5 12"/>` + rstar(950, 330, 12, t, { sw: 3, glow: 1 });
  w += tp(950 + R2 * Math.cos(t * 2.4), 330 + R2 * Math.sin(t * 2.4), 9, t, { sw: 3 });
  w += label(950, 640, 'TRAPPIST-1e', 46, C.yellow);
  return w + pl(950, 120, '30× closer', 84, C.yellow, pop(t, a(39) + 2.5), -3);
});

// Six-day year
seg(40, 42, (t, a) => {
  let s = `<rect width="${W}" height="${H}" fill="#10254a"/>` + glow(330, 360, 420, 'gRed', .7);
  const lap = prog(t, .2, 4.4), an = -Math.PI / 2 + lap * Math.PI * 2;
  s += `<circle cx="330" cy="360" r="200" fill="none" stroke="${C.cream}" stroke-width="4" stroke-dasharray="6 12"/>` + rstar(330, 360, 60, t);
  s += `<path d="M330 160 A200 200 0 ${lap > .5 ? 1 : 0} 1 ${330 + 200 * Math.cos(an)} ${360 + 200 * Math.sin(an)}" fill="none" stroke="${C.yellow}" stroke-width="9" stroke-linecap="round"/>` + tp(330 + 200 * Math.cos(an), 360 + 200 * Math.sin(an), 30, t, { sw: 4 });
  const d = Math.min(6, 1 + Math.floor(lap * 6));
  s += g(`<rect x="-150" y="-150" width="300" height="300" rx="14" fill="${C.cream}" stroke="${C.ink}" stroke-width="7"/><rect x="-150" y="-150" width="300" height="76" rx="14" fill="${C.red}" stroke="${C.ink}" stroke-width="7"/>` + text(0, -94, 'DAY', 54, C.white, { font: 'Brush' }) + text(0, 100, String(d), 200, C.ink, { font: 'Brush' }), at(900, 330, 1 + .06 * Math.max(0, 1 - ((lap * 6) % 1) * 4), -3));
  s += pl(900, 590, 'one full year', 66, C.yellow, pop(t, a(41)), -2) + pl(900, 670, '= 6 days', 66, C.cream, pop(t, a(42)));
  return s;
});

// Birthdays
seg(43, 44, (t, a) => {
  let s = `<rect width="${W}" height="${H}" fill="#3a1d3f"/><rect y="590" width="${W}" height="130" fill="#241026"/>` + glow(640, 250, 620, 'gWarm', .45);
  for (let i = 0; i < 18; i++) s += `<rect x="${(i * 97 + 30) % 1280}" y="${((t * 120 + i * 67) % 800) - 40}" width="14" height="22" fill="${[C.yellow, C.red, C.teal, C.orange][i % 4]}" transform="rotate(${t * 200 + i * 40} ${(i * 97 + 37) % 1280} ${((t * 120 + i * 67) % 800) - 30})"/>`;
  const age = Math.round(lerp(30, 1796, easeInOut(prog(t, a(43) + 2.2, a(43) + 4.2))));
  const cakes = Math.round(9 * prog(t, a(44), a(44) + 2));
  for (let i = 0; i < 1 + cakes; i++) { const y = 560 - i * 44; s += g(`<rect x="-80" y="-36" width="160" height="40" rx="8" fill="${['#f7c8d8', '#fff1c9', '#c9e7f7'][i % 3]}" stroke="${C.ink}" stroke-width="5"/><path d="M-80 -30 q20 22 40 0 q20 22 40 0 q20 22 40 0 q20 22 40 0" fill="none" stroke="${C.white}" stroke-width="7"/>`, at(880 + 6 * Math.sin(i * 2), y)); }
  s += g(`<rect x="-4" y="-40" width="8" height="30" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/><path d="M0 -62 q10 12 0 22 q-10 -10 0 -22z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3"/>`, at(880, 560 - cakes * 44 - 36));
  s += person(420, 400, 1.1, { mood: t > a(44) + 2.4 ? 'flat' : 'happy', armR: -30, look: 6 });
  s += g(`<path d="M-30 -60 L0 -130 L30 -60z" fill="${C.teal}" stroke="${C.ink}" stroke-width="5"/><circle cy="-134" r="9" fill="${C.yellow}" stroke="${C.ink}" stroke-width="4"/>`, at(420, 385, 1.1));
  s += pl(640, 110, 'AGE: ' + age.toLocaleString('en-US'), 100, C.yellow, 1, -2);
  return s;
});

// Tidal locking
seg(45, 48, (t, a) => {
  let w = space(t, 80);
  const cx = 420, cy = 370, R = 300, an = -.6 + t * .16;
  w += rstar(cx, cy, 90, t) + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.cream}" stroke-width="3" stroke-dasharray="5 12" opacity=".6"/>`;
  const px = cx + R * Math.cos(an), py = cy + R * Math.sin(an), deg = an * 180 / Math.PI;
  w += arrow(cx + 100 * Math.cos(an), cy + 100 * Math.sin(an), px - 86 * Math.cos(an), py - 86 * Math.sin(an), '#ffb347', 5);
  w += tp(px, py, 70, t, { lock: deg });
  w += g(`<path d="M-8 -70 L0 -100 L8 -70z" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/><line x1="0" y1="-70" x2="0" y2="-44" stroke="${C.ink}" stroke-width="5"/>`, `translate(${px} ${py}) rotate(${deg - 90})`);
  let s = cam(w, lerp(520, 640, prog(t, 0, 6)), 370, lerp(1.15, 1, prog(t, 0, 6)));
  // Moon inset
  const ik = pop(t, a(46) + 3.4);
  if (ik > 0) { const ma = t * .8; s += g(paper(-150, -110, 300, 220) + `<circle r="34" fill="${C.blue}" stroke="${C.ink}" stroke-width="5"/><circle cx="${82 * Math.cos(ma)}" cy="${60 * Math.sin(ma)}" r="14" fill="#cfd3da" stroke="${C.ink}" stroke-width="4"/>` + text(0, 96, 'like our Moon', 30, C.ink, { font: 'Brush' }), at(1070, 160, ik, 3)); }
  s += pl(1010, 440, 'always day', 58, '#ffb347', pop(t, a(47)), -2) + pl(1010, 540, 'always night', 58, '#8fa8ff', pop(t, a(48)), 2);
  if (t < a(46)) s += pl(940, 600, 'a second effect', 54, C.cream, pop(t, .2));
  return s;
});

// On the surface: the sun never moves
seg(49, 50, (t, a) => {
  let w = `<rect x="-200" y="-200" width="1700" height="1200" fill="#2b1230"/><rect x="-200" y="-200" width="1700" height="700" fill="#5a2038"/>`;
  w += glow(820, 230, 520, 'gRed', 1) + `<circle cx="820" cy="230" r="150" fill="#f0704f" stroke="${C.ink}" stroke-width="7"/><circle cx="790" cy="200" r="70" fill="#ffab85" opacity=".6"/>`;
  const k = pop(t, a(50) + 2.6);
  w += g(`<circle r="38" fill="${C.yellow}" stroke="${C.ink}" stroke-width="5"/>` + label(0, 86, 'our Sun, for scale', 30, C.cream), at(1130, 150, k));
  w += `<path d="M-200 560 Q200 470 520 540 T1100 520 T1500 560 V900 H-200z" fill="#2a0f1f" stroke="${C.ink}" stroke-width="6"/>`;
  w += person(360, 400, .95, { mood: 'ooh', look: 7, lookY: -6, lit: '#ff9d80' });
  // clock spinning while the sun stays put
  const ca = t * 220;
  w += g(`<circle r="62" fill="${C.cream}" stroke="${C.ink}" stroke-width="6"/><line x1="0" y1="0" x2="0" y2="-44" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" transform="rotate(${ca})"/><line x1="0" y1="0" x2="0" y2="-28" stroke="${C.red}" stroke-width="7" stroke-linecap="round" transform="rotate(${ca / 12})"/>`, at(180, 170, pop(t, .6)));
  let s = cam(w, 640, 360, lerp(1, 1.08, prog(t, 0, 9)));
  s += pl(640, 660, t < a(50) ? 'no sunrise. no sunset.' : 'about 4× wider than our Sun', 56, C.cream, t < a(50) ? pop(t, 1.4) : pop(t, a(50) + 3));
  return s;
});

// Day half / night half
seg(51, 52, (t, a) => {
  let l = `<rect x="0" y="-100" width="640" height="900" fill="#c7622e"/>` + glow(320, 200, 380, 'gWarm', .9) + `<circle cx="320" cy="200" r="90" fill="#f0704f" stroke="${C.ink}" stroke-width="6"/><path d="M0 520 Q200 450 420 510 T640 490 V800 H0z" fill="#7a3413" stroke="${C.ink}" stroke-width="6"/>`;
  l += person(250, 400, .8, { mood: 'flat', armR: -160 });
  let r = `<rect x="640" y="-100" width="640" height="900" fill="#040714"/>`;
  for (let i = 0; i < 40; i++) r += `<circle cx="${650 + rnd(i + 5) * 620}" cy="${rnd(i + 50) * 420}" r="${1 + rnd(i) * 2}" fill="#fff" opacity="${.4 + .6 * Math.abs(Math.sin(t * 2 + i))}"/>`;
  r += `<path d="M640 520 l90 -70 l80 60 l120 -90 l110 80 l100 -50 l140 70 V800 H640z" fill="#9cc9dd" stroke="${C.ink}" stroke-width="6"/>`;
  r += g(person(0, 0, .8, { mood: 'worry', coat: '#5d6d8f' }), `translate(${1000 + 4 * Math.sin(t * 30)} 400)`);
  const rv = prog(t, a(52) - .2, a(52) + .3);
  let s = l + `<g opacity="${rv}">${r}</g>` + (rv < 1 ? `<rect x="640" y="0" width="640" height="720" fill="#000" opacity="${1 - rv}"/>` : '') + `<line x1="640" y1="0" x2="640" y2="720" stroke="${C.ink}" stroke-width="8"/>`;
  s += pl(320, 660, 'permanent afternoon', 50, C.cream, pop(t, .3)) + pl(960, 660, 'endless night', 50, '#bfe3f2', pop(t, a(52) + .3));
  return s;
});

// Flares strip the air
seg(53, 54, (t, a) => {
  let w = space(t, 93);
  const big = t > a(54) ? 1.6 : .5;
  w += rstar(180, 360, 190, t, { flare: big, face: t > a(54) ? 'wavy' : 'flat' });
  const strip = prog(t, a(54) + 2.8, a(54) + 8);
  for (let i = 0; i < 4; i++) { const p = clamp(strip * 4 - i), R = 150 + i * 20; if (p < 1) w += `<circle cx="${900 + p * 520}" cy="${360 - p * 60 * (i % 2 ? 1 : -1)}" r="${R}" fill="none" stroke="#8fe3ff" stroke-width="16" opacity="${.75 * (1 - p)}"/>`; }
  w += tp(900, 360, 130, t, { face: strip > .3 ? 'sad' : 'flat' });
  if (t > a(54)) for (let i = 0; i < 9; i++) { const x = ((t * 420 + i * 130) % 900) + 330; w += `<path d="M${x} ${200 + i * 40} l60 0" stroke="#ffd0a0" stroke-width="8" stroke-linecap="round" opacity="${1 - (x - 330) / 900}"/>`; }
  let s = cam(w, lerp(520, 680, prog(t, a(54), a(54) + 8)), 360, lerp(1.05, 1.1, prog(t, 0, 10)));
  s += pl(880, 110, t < a(54) ? 'not a gentle star' : 'flares peel the air away', 60, '#ffd0a0', pop(t, t < a(54) ? .2 : a(54) + 2.6), -2);
  return s;
});
