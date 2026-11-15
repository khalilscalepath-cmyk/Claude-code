// Video 001, part 1 (0:00 to 1:19). Times are seconds in narration-001.mp3, taken from timing-001.json.
const SCENES = [];
const scene = (start, end, draw, o = {}) => SCENES.push({ start, end, draw, o });

// 1. Headlines pile up. "Every few months... nobody tells you the catch."
scene(0, 10.66, t => {
  let s = `<rect width="${W}" height="${H}" fill="${C.navy2}"/><rect y="560" width="${W}" height="160" fill="#3b2f2f"/><line x1="0" y1="560" x2="${W}" y2="560" stroke="${C.ink}" stroke-width="6"/>`;
  const drops = [[0.2, 400, 330, -8], [1.3, 470, 310, 6], [2.4, 430, 290, -3], [3.5, 500, 270, 9], [5.0, 455, 250, -5]];
  drops.forEach(([d, x, y, r], i) => {
    const p = easeOut(prog(t, d, d + .45));
    if (p > 0) s += newspaper(x, lerp(-200, y, p), 1, r + (1 - p) * 20, i === 4 ? 'EARTH 2.0 !' : 'NEW EARTH FOUND');
  });
  const mood = t > 7.6 ? 'hmm' : 'flat';
  s += astronaut(940, 330, 1.25, { mood, lookX: -6, armL: 35 + 6 * Math.sin(t * 2), armR: t > 7.6 ? -150 : -20, bob: 4 * Math.sin(t * 1.6) });
  if (t > 7.9) s += g(text(0, 0, '?', 120, C.yellow, { font: 'Brush', stroke: C.ink, sw: 8 }), at(1085, 190, pop(t, 7.9), 12));
  return s;
});

// 2. The best candidate. "So today we're going to pick the best candidate we have..."
scene(10.66, 19.24, t => {
  let s = bgNavy(t);
  const cols = [C.salmon, C.grey, C.teal, C.yellow, C.red];
  cols.forEach((c, i) => {
    const x = 200 + i * 220, chosen = i === 2;
    const lift = chosen ? -70 * easeInOut(prog(t, 2.6, 3.6)) : 0;
    const dim = chosen ? 1 : lerp(1, .35, prog(t, 2.6, 3.4));
    s += g(planet(0, 0, chosen ? 78 : 62, c, { face: chosen ? 'happy' : 'flat' }), at(x, 330 + lift + 8 * Math.sin(t * 1.3 + i), pop(t, .15 + i * .18)), `opacity="${dim}"`);
  });
  s += `<rect x="90" y="430" width="1100" height="16" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/>`;
  if (t > 3.4) {
    const k = pop(t, 3.4);
    s += g(`<path d="M-150 -34 h300 l-24 34 l24 34 h-300 l24 -34z" fill="${C.orange}" stroke="${C.ink}" stroke-width="6"/>` + text(0, 14, 'BEST CANDIDATE', 40, C.ink, { font: 'Brush' }), at(640, 130, k, -3));
  }
  s += writeOn(t, 5.3, 7.6, 640, 590, 'Three simple questions.', 62, C.cream, { font: 'Brush' });
  return s;
});

// 3. The three questions.
scene(19.24, 24.63, t => card(t, [
  { at: 0.0, str: 'Where is it?', y: 250, size: 76 },
  { at: 1.0, str: 'What is it actually like there?', y: 370, size: 76 },
  { at: 2.9, str: 'Could a human ever live on it?', y: 490, size: 76 },
]), { noWobble: true });

// 4. "The answers are stranger than the headlines."
scene(24.63, 27.43, t => {
  let s = `<rect width="${W}" height="${H}" fill="${C.navy2}"/><rect y="560" width="${W}" height="160" fill="#3b2f2f"/><line x1="0" y1="560" x2="${W}" y2="560" stroke="${C.ink}" stroke-width="6"/>`;
  const p = easeOut(prog(t, .5, 1.5));
  s += newspaper(lerp(760, 180, p), lerp(360, 480, p) - 260 * Math.sin(p * Math.PI), lerp(.8, .45, p), -p * 400);
  s += astronaut(940, 330, 1.25, { mood: 'happy', armL: lerp(60, 150, prog(t, .3, .7)), armR: -20, bob: 4 * Math.sin(t * 2) });
  return s;
});

// 5. Chapter question.
scene(27.43, 30.85, t => card(t, [
  { at: 0.1, str: 'Why do you keep hearing', y: 320, size: 80 },
  { at: 1.0, str: 'about a "new Earth"?', y: 430, size: 80 },
]), { noWobble: true });

// 6. Six thousand planets, almost all terrible.
scene(30.85, 45.03, t => {
  let s = bgNavy(t);
  const n = Math.round(6464 * easeOut(prog(t, .3, 3.6)));
  s += text(640, 130, n.toLocaleString('en-US'), 120, C.yellow, { font: 'Brush', stroke: C.ink, sw: 10 });
  s += text(640, 185, 'planets confirmed around other stars', 38, C.cream);
  if (t > 4.86 && t < 7.4) s += g(`<rect x="-250" y="-46" width="500" height="92" rx="10" fill="${C.red}" stroke="${C.ink}" stroke-width="6"/>` + text(0, 18, 'ALMOST ALL TERRIBLE', 50, C.white, { font: 'Brush' }), at(640, 420, pop(t, 4.86), -4));
  // gas giant, 7.22
  if (t > 7.22) {
    const k = pop(t, 7.22);
    let b = planet(0, 0, 120, C.salmon, { face: 'wavy', bands: [{ d: 'M-130 -50 h260 v28 h-260z', fill: C.orange }, { d: 'M-130 20 h260 v22 h-260z', fill: C.red, o: .7 }] });
    for (let i = 0; i < 3; i++) { const y = ((t * 60 + i * 40) % 110); b += `<path d="M${-150 + i * 20} ${-90 + y} q-9 16 0 24 q9 -8 0 -24z" fill="${C.ice}" stroke="${C.ink}" stroke-width="3"/>`; }
    b += text(0, 190, 'hotter than a furnace', 36, C.cream);
    s += g(b, at(250, 430, k));
  }
  // ice rock, 9.52
  if (t > 9.52) {
    const k = pop(t, 9.52), sh = 5 * Math.sin(t * 40);
    let b = planet(sh, 0, 95, C.ice, { face: 'sad', bands: [{ d: 'M-100 -20 l60 -30 l50 40 l70 -20 v-80 h-180z', fill: C.white }] });
    b += text(0, 190, 'frozen in the dark', 36, C.cream);
    s += g(b, at(640, 430, k));
  }
  // glass rain, 11.32
  if (t > 11.32) {
    const k = pop(t, 11.32);
    let b = planet(0, 0, 105, C.blue, { face: 'ooh' });
    for (let i = 0; i < 9; i++) { const yy = ((t * 260 + i * 53) % 260) - 190, xx = -110 + i * 28 + yy * .35; b += `<path d="M${xx} ${yy} l12 26 l-16 -6z" fill="${C.white}" stroke="${C.ink}" stroke-width="3" opacity=".95"/>`; }
    b += text(0, 190, 'raining molten glass', 36, C.cream);
    s += g(b, at(1030, 430, k));
  }
  return s;
});

// 7. The habitable zone.
scene(45.03, 59.87, t => {
  let s = bgCream();
  const zx = [230, 560, 830, 1280];
  const show = prog(t, 3.0, 4.2);
  s += `<rect x="${zx[0]}" y="150" width="${zx[1] - zx[0]}" height="380" fill="${C.red}" opacity="${.28 * show}"/>`;
  s += `<rect x="${zx[1]}" y="150" width="${zx[2] - zx[1]}" height="380" fill="${C.green}" opacity="${.45 * show}"/>`;
  s += `<rect x="${zx[2]}" y="150" width="${zx[3] - zx[2]}" height="380" fill="${C.blue}" opacity="${.28 * show}"/>`;
  s += `<line x1="230" y1="340" x2="1250" y2="340" stroke="${C.ink}" stroke-width="4" stroke-dasharray="4 14" stroke-linecap="round"/>`;
  // star
  let st = '';
  for (let i = 0; i < 12; i++) { const a = i * 30 + t * 12; st += `<line x1="0" y1="0" x2="${190 + 12 * Math.sin(t * 3 + i)}" y2="0" stroke="${C.orange}" stroke-width="10" stroke-linecap="round" transform="rotate(${a})"/>`; }
  st += `<circle r="150" fill="${C.yellow}" stroke="${C.ink}" stroke-width="7"/>` + faceSvg(150, 'happy');
  s += g(st, at(60, 340));
  // the Earth-sized planet slides into the green band
  const px = lerp(1400, 695, easeOut(prog(t, .6, 2.6)));
  s += planet(px, 340 + 6 * Math.sin(t * 2), 58, C.blue, { face: t > 9.3 ? 'happy' : 'flat', bands: [{ d: 'M-40 -30 q20 -24 44 -4 q8 26 -18 32 q-22 -2 -26 -28z', fill: C.green }, { d: 'M4 26 q22 -12 34 6 q-12 18 -34 -6z', fill: C.green }] });
  if (t > 9.34) s += g(`<rect x="-225" y="-44" width="450" height="88" rx="10" fill="${C.ink}"/>` + text(0, 17, 'THE HABITABLE ZONE', 48, C.cream, { font: 'Brush' }), at(695, 88, pop(t, 9.34), -2));
  if (t > 12.83) {
    s += g(text(0, 0, 'too hot', 46, C.red, { font: 'Brush' }), at(395, 590, pop(t, 12.83)));
    s += g(text(0, 0, 'just right', 46, '#2f7d32', { font: 'Brush' }), at(695, 590, pop(t, 13.3)));
    s += g(text(0, 0, 'too cold', 46, C.blue, { font: 'Brush' }), at(1050, 590, pop(t, 13.8)));
  }
  return s;
});

// 8. The first catch: Venus, and the lottery ticket.
scene(59.87, 76.91, t => {
  let s = bgNavy(t);
  if (t < 6.09) {
    s += g(text(0, 0, 'THE FIRST CATCH', 110, C.yellow, { font: 'Brush', stroke: C.ink, sw: 10 }), at(640, 300, pop(t, .2), -3));
    s += writeOn(t, 2.94, 4.6, 640, 440, '"habitable zone" ≠ habitable', 62, C.cream, { font: 'Brush' });
  } else if (t < 11.81) {
    const lt = t - 6.09;
    s += g(planet(0, 0, 150, '#e8b04a', { face: 'happy', bands: [{ d: 'M-160 -40 q80 -40 320 0 v36 q-160 -30 -320 0z', fill: '#d18f2e' }, { d: 'M-160 50 q160 -30 320 0 v30 h-320z', fill: '#c97b28', o: .8 }] }), at(380, 330, pop(lt, 0)));
    s += g(text(0, 0, 'VENUS', 64, C.cream, { font: 'Brush' }), at(380, 560, pop(lt, .2)));
    // lead bar melting
    const m = prog(lt, 2.2, 4.6);
    let bar = `<path d="M-120 ${-40 + 50 * m} h240 l24 ${80 - 50 * m} h-288z" fill="${C.grey}" stroke="${C.ink}" stroke-width="6"/>`;
    bar += `<ellipse cx="0" cy="48" rx="${150 + 110 * m}" ry="${10 + 22 * m}" fill="${C.grey}" stroke="${C.ink}" stroke-width="6"/>`;
    bar += text(0, 22 + 26 * m, 'LEAD', 40, C.ink, { font: 'Brush', opacity: 1 - m * .8 });
    s += g(bar, at(900, 380, pop(lt, 1.6)));
    s += g(text(0, 0, '465 °C', 76, C.red, { font: 'Brush', stroke: C.ink, sw: 8 }), at(900, 220, pop(lt, 2.4), 4));
  } else {
    const lt = t - 11.81;
    const k = pop(lt, 0), wig = 3 * Math.sin(lt * 3);
    let tk = `<rect x="-300" y="-140" width="600" height="280" rx="18" fill="${C.cream}" stroke="${C.ink}" stroke-width="7"/>`;
    tk += `<line x1="150" y1="-140" x2="150" y2="140" stroke="${C.ink}" stroke-width="4" stroke-dasharray="10 10"/>`;
    tk += text(-75, -70, 'COSMIC LOTTERY', 50, C.red, { font: 'Brush' });
    tk += text(-75, 0, 'HABITABLE ZONE', 56, C.ink, { font: 'Brush' });
    tk += text(-75, 60, 'admit one planet', 36, C.ink);
    tk += text(225, 14, 'No.', 34, C.ink) + text(225, 60, '6464', 40, C.ink, { font: 'Brush' });
    s += g(tk, at(640, 330, k, -5 + wig));
    s += writeOn(lt, 1.7, 3.6, 640, 610, 'A ticket. Not the prize.', 64, C.yellow, { font: 'Brush' });
  }
  return s;
});

// 9. Chapter question.
scene(76.91, 79.15, t => card(t, [{ at: 0.05, str: 'So which planet holds the best ticket?', y: 380, size: 72, dur: 1.3 }]), { noWobble: true });
