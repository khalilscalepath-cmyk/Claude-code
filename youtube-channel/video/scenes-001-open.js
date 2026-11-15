// Video 001 opening (0:00 to 0:31), second look: lit scenes, camera moves, a cut every few seconds.
// Times are seconds in narration-001.mp3, from timing-001.json (clause-level alignment).
const SCENES = [];
const scene = (start, end, draw, o = {}) => SCENES.push({ start, end, draw, o });

const mountains = () =>
  `<path d="M-40 520 L120 380 L260 470 L420 330 L600 480 L760 400 L930 500 L1100 360 L1320 500 V760 H-40z" fill="#163a55"/>` +
  `<path d="M-40 600 L160 470 L330 560 L520 450 L720 580 L900 500 L1090 590 L1320 480 V760 H-40z" fill="#0c2236"/>`;

function observatory(x, y, t) {
  let s = glow(0, -70, 190, 'gWarm', .55 + .08 * Math.sin(t * 3));
  s += `<rect x="-95" y="-40" width="190" height="110" fill="#aab7c7" stroke="${C.ink}" stroke-width="6"/>`;
  s += `<path d="M-110 -40 A110 110 0 0 1 110 -40z" fill="#dfe7ef" stroke="${C.ink}" stroke-width="6"/>`;
  s += `<path d="M-12 -40 L8 -148 L40 -140 L26 -40z" fill="#ffd98a" stroke="${C.ink}" stroke-width="5"/>`;
  s += `<g transform="translate(18 -96) rotate(-58)"><rect x="-10" y="-90" width="34" height="104" rx="6" fill="#39485c" stroke="${C.ink}" stroke-width="5"/><rect x="-14" y="-100" width="42" height="16" rx="4" fill="#7e8da3" stroke="${C.ink}" stroke-width="5"/></g>`;
  s += `<rect x="-22" y="14" width="44" height="56" rx="4" fill="#ffd98a" stroke="${C.ink}" stroke-width="5"/>`;
  s += `<rect x="-70" y="-14" width="30" height="30" fill="#ffd98a" stroke="${C.ink}" stroke-width="4"/><rect x="40" y="-14" width="30" height="30" fill="#ffd98a" stroke="${C.ink}" stroke-width="4"/>`;
  return g(s, at(x, y));
}

// A. Hilltop observatory, a new Earth rising. "Every few months, a headline tells you..."
scene(0, 4.65, t => {
  const rise = easeOut(prog(t, 0, 3.6));
  let w = `<rect x="-60" y="-60" width="${W + 120}" height="${H + 120}" fill="url(#gSky)"/>` + stars(t, 140);
  w += earth2(840, lerp(520, 290, rise), 175, t);
  w += mountains();
  w += `<path d="M-40 640 Q300 520 700 610 T1320 600 V760 H-40z" fill="#06121f"/>`;
  w += observatory(330, 548, t);
  w += person(590, 470, .72, { mood: t > 1.2 ? 'ooh' : 'flat', look: 5, lookY: -6, armR: t > 1.4 ? -150 : 10, lit: '#8fe3ff' });
  let s = cam(w, lerp(640, 720, rise), lerp(360, 340, rise), lerp(1, 1.14, rise));
  // lower-third headline
  if (t > .25) s += tag(60, 560, 'BREAKING', C.red, pop(t, .25), -2, 30);
  const bar = prog(t, .7, 1.1);
  if (bar > 0) s += `<rect x="60" y="590" width="${760 * easeOut(bar)}" height="74" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/>` + writeOn(t, 1.0, 3.3, 84, 642, 'SCIENTISTS FIND ANOTHER EARTH', 48, C.ink, { font: 'Brush', anchor: 'start' });
  return s;
});

// B. Close on the planet. "A second home. Earth two point zero."
scene(4.65, 7.6, t => {
  let w = `<rect x="-60" y="-60" width="${W + 120}" height="${H + 120}" fill="#070b1a"/>` + stars(t, 110, W, H, 40);
  w += earth2(640, 380, 220, t + 10);
  if (t > .22) { // little house planted on top
    const k = pop(t, .22);
    w += g(`<line x1="0" y1="0" x2="0" y2="-26" stroke="${C.ink}" stroke-width="6"/><rect x="-36" y="-78" width="72" height="54" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/><path d="M-48 -78 L0 -118 L48 -78z" fill="${C.red}" stroke="${C.ink}" stroke-width="5"/><rect x="-10" y="-52" width="20" height="28" fill="${C.orange}" stroke="${C.ink}" stroke-width="4"/>`, at(640, 166, k, -4));
    w += g(`<line x1="0" y1="0" x2="0" y2="46" stroke="${C.ink}" stroke-width="5"/><rect x="-78" y="-40" width="156" height="46" rx="4" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/>` + text(0, -6, 'HOME No. 2', 32, C.ink, { font: 'Brush' }), at(790, 150, pop(t, .5), 8));
  }
  if (t > 1.44) { // neon sign
    const on = (t < 1.6 || (t > 1.68 && t < 1.74)) ? .35 : 1;
    w += g(`<g filter="url(#soft)" opacity="${.9 * on}">` + text(0, 0, 'EARTH 2.0', 150, '#59f0ff', { font: 'Brush' }) + '</g>' + text(0, 0, 'EARTH 2.0', 150, '#eaffff', { font: 'Brush', stroke: '#19b6d6', sw: 5, opacity: on }), at(640, 660, 1, -2));
  }
  return cam(w, 640, lerp(380, 400, prog(t, 0, 2.9)), lerp(1.12, 1.0, easeOut(prog(t, 0, 2.9))));
});

// C. The catch drops. "And every time, nobody tells you the catch."
scene(7.6, 10.66, t => {
  let w = `<rect x="-60" y="-60" width="${W + 120}" height="${H + 120}" fill="url(#gSky)"/>` + stars(t, 90, W, H, 77);
  w += earth2(900, 150, 260, t + 20);
  w += `<path d="M-40 640 Q300 560 700 630 T1320 610 V760 H-40z" fill="#06121f"/>`;
  const dropped = t > 1.33;
  // price tag on a string, falls then swings
  if (dropped) {
    const lt = t - 1.33, fall = easeOut(prog(lt, 0, .45));
    const swing = 16 * Math.exp(-lt * 1.1) * Math.sin(lt * 7);
    const len = lerp(20, 250, fall);
    let tg = `<line x1="0" y1="0" x2="0" y2="${len}" stroke="${C.cream}" stroke-width="4"/>`;
    tg += g(`<path d="M-120 0 L-86 -46 H180 V46 H-86z" fill="${C.cream}" stroke="${C.ink}" stroke-width="6"/><circle cx="-92" cy="0" r="9" fill="#06121f" stroke="${C.ink}" stroke-width="4"/>` + text(46, 17, '* THE CATCH', 46, C.red, { font: 'Brush' }), `translate(92 ${len})`);
    w += g(tg, `translate(700 330) rotate(${swing})`);
  }
  w += person(330, 420, 1.25, { mood: dropped && t > 1.7 ? 'worry' : 'happy', look: 7, lookY: -5, armR: dropped ? 20 : -140, lit: '#8fe3ff' });
  return cam(w, lerp(600, 640, prog(t, 0, 3)), 360, lerp(1.1, 1.02, prog(t, 0, 3)));
});

// D. The line-up. "So today we're going to pick the best candidate we have..."
scene(10.66, 19.24, t => {
  const pick = t > 3.33;                      // "the single most Earth-like planet" at 13.99
  const xs = [190, 415, 640, 865, 1090];
  const cols = ['#c9a36b', '#8d99ae', '#c96a3d', '#e9c46a', '#9b5de5'];
  const sweep = pick ? 640 : 640 + 430 * Math.sin(t * 1.9);
  const spotX = pick ? lerp(640 + 430 * Math.sin(3.33 * 1.9), 640, easeOut(prog(t, 3.33, 3.8))) : sweep;
  let w = `<rect x="-80" y="-80" width="${W + 160}" height="${H + 160}" fill="url(#gHall)"/>`;
  for (let i = 0; i < 7; i++) w += `<rect x="${-20 + i * 200}" y="-80" width="26" height="700" fill="#0a0e20" opacity=".8"/>`;
  w += `<rect x="-80" y="560" width="${W + 160}" height="240" fill="#0b0f22"/><line x1="-80" y1="560" x2="${W + 80}" y2="560" stroke="#2a3566" stroke-width="5"/>`;
  w += `<polygon points="${spotX - 26},-80 ${spotX + 26},-80 ${spotX + 170},600 ${spotX - 170},600" fill="url(#gSpot)" opacity=".9"/><ellipse cx="${spotX}" cy="585" rx="170" ry="26" fill="#fff6d8" opacity=".22"/>`;
  xs.forEach((x, i) => {
    const chosen = i === 2, lit = clamp(1 - Math.abs(spotX - x) / 200), dim = pick && !chosen ? .3 : lerp(.45, 1, lit);
    let p = `<path d="M-62 0 h124 l14 150 h-152z" fill="#2b3359" stroke="${C.ink}" stroke-width="6"/><rect x="-74" y="-16" width="148" height="20" rx="4" fill="#3a4578" stroke="${C.ink}" stroke-width="5"/>`;
    p += text(0, 78, '#' + (i + 1), 44, '#aab3e0', { font: 'Brush' });
    const bob = 6 * Math.sin(t * 1.4 + i);
    if (chosen) {
      p += glow(0, -96 + bob, 150, 'gWarm', pick ? .8 : .2 * lit);
      p += planet(0, -96 + bob, 70, cols[i], { face: pick ? 'happy' : 'flat', bands: [{ d: 'M-70 -10 q30 -30 60 -6 q30 20 80 -8 v60 h-140z', fill: '#2a9d8f' }] });
    } else p += planet(0, -88 + bob, 58, cols[i], { face: 'flat' });
    w += g(p, at(x, 410), `opacity="${dim}"`);
  });
  if (t > 3.9) w += g(`<circle r="62" fill="${C.yellow}" stroke="${C.ink}" stroke-width="6"/><circle r="46" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="6 6"/><path d="M-30 50 l-14 70 l32 -18 l14 30 l10 -70z M30 50 l14 70 l-32 -18 l-14 30 l-10 -70z" fill="${C.red}" stroke="${C.ink}" stroke-width="5"/>` + text(0, -4, 'MOST', 28, C.ink, { font: 'Brush' }) + text(0, 24, 'EARTH-LIKE', 22, C.ink, { font: 'Brush' }), at(760, 250, pop(t, 3.9), 10));
  w += person(1010, 520, .62, { mood: 'happy', look: -6, armL: pick ? 150 : -10, coat: '#22264a', scarf: C.red, lit: '#fff6d8' });
  const push = easeInOut(prog(t, 3.33, 6.2));
  let s = cam(w, lerp(640, 660, push), lerp(360, 340, push), lerp(1, 1.3, push));
  if (t > 6.51) { // "and ask three simple questions" at 17.17
    ['?', '?', '?'].forEach((q, i) => { s += g(`<rect x="-50" y="-64" width="100" height="128" rx="12" fill="${C.cream}" stroke="${C.ink}" stroke-width="6"/>` + text(0, 28, q, 100, C.red, { font: 'Brush' }), at(150 + i * 120, 130, pop(t, 6.51 + i * .22), -8 + i * 8)); });
  }
  return s;
});

// E. The three questions.
scene(19.24, 24.63, t => card(t, [
  { at: 0.17, str: 'Where is it?', y: 250, size: 76, dur: .55 },
  { at: 1.18, str: 'What is it actually like there?', y: 370, size: 76, dur: 1.4 },
  { at: 3.10, str: 'Could a human ever live on it?', y: 490, size: 76, dur: 1.8 },
]), { noWobble: true, noVig: true });

// F. "The answers are stranger than the headlines."
scene(24.63, 27.43, t => {
  let s = `<rect width="${W}" height="${H}" fill="#0b1226"/>` + glow(640, 360, 520, 'gWarm', .35);
  const p = easeOut(prog(t, .27, 1.0));
  s += newspaper(640, 360, lerp(.1, 1.75, p), lerp(-720, -4, p), 'EARTH 2.0 !');
  if (t > 1.5) {
    const k = lerp(2.4, 1, easeOut(prog(t, 1.5, 1.66)));
    s += g(`<rect x="-300" y="-60" width="600" height="120" rx="10" fill="none" stroke="${C.red}" stroke-width="12"/>` + text(0, 28, "IT'S COMPLICATED", 84, C.red, { font: 'Brush' }), at(660, 400, k, -12), 'opacity=".95"');
  }
  return s;
});

// G. Chapter question.
scene(27.43, 30.85, t => card(t, [
  { at: 0.26, str: 'Why do you keep hearing', y: 320, size: 80, dur: 1.1 },
  { at: 1.40, str: 'about a "new Earth"?', y: 430, size: 80, dur: 1.2 },
]), { noWobble: true, noVig: true });
