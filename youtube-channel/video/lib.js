// Shared drawing helpers for the paper-cartoon style. Everything returns SVG strings.
const W = 1280, H = 720;
const C = { navy: '#14213d', navy2: '#1d2f57', cream: '#f3e9d2', ink: '#1b1b1e', orange: '#f77f00', red: '#d94f3d',
  blue: '#3a86c8', teal: '#2a9d8f', green: '#6bbf59', white: '#fdfaf3', grey: '#8d99ae', yellow: '#ffd166', salmon: '#f4845f', ice: '#bfe3f2' };

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = x => 1 - Math.pow(1 - x, 3);
const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const back = x => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const lerp = (a, b, x) => a + (b - a) * x;
// pop-in scale: 0 before `at`, overshoots to 1 over `d` seconds
const pop = (t, at, d = .35) => t < at ? 0 : back(prog(t, at, at + d));
// deterministic pseudo-random
const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const g = (inner, tf = '', extra = '') => `<g transform="${tf}" ${extra}>${inner}</g>`;
const at = (x, y, s = 1, r = 0) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function text(x, y, str, size = 44, fill = C.white, o = {}) {
  const { anchor = 'middle', font = 'Hand', rot = 0, opacity = 1, stroke = '', sw = 0 } = o;
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}" ${stroke ? `stroke="${stroke}" stroke-width="${sw}" paint-order="stroke"` : ''} transform="rotate(${rot} ${x} ${y})">${esc(str)}</text>`;
}
// text that "writes on" left to right between t0 and t1
function writeOn(t, t0, t1, x, y, str, size, fill, o = {}) {
  const n = Math.round(str.length * prog(t, t0, t1));
  if (n <= 0) return '';
  const o2 = Object.assign({}, o);
  if ((o.anchor || 'middle') === 'middle') { // keep the line from re-centring while it writes
    o2.anchor = 'start';
    return text(x - (o.width || str.length * size * .42) / 2, y, str.slice(0, n), size, fill, o2);
  }
  return text(x, y, str.slice(0, n), size, fill, o2);
}

function bgNavy(t) {
  let s = `<rect width="${W}" height="${H}" fill="${C.navy}"/>`;
  for (let i = 0; i < 70; i++) {
    const x = rnd(i) * W, y = rnd(i + 100) * H, r = 1.2 + rnd(i + 200) * 2.6;
    const tw = .45 + .55 * Math.abs(Math.sin(t * (.6 + rnd(i + 300)) + i));
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${C.cream}" opacity="${tw.toFixed(2)}"/>`;
  }
  return s;
}
const bgCream = () => `<rect width="${W}" height="${H}" fill="${C.cream}"/>`;
const bgBlack = () => `<rect width="${W}" height="${H}" fill="#0b0b0d"/>`;

// A cut-paper planet with an optional face.
function planet(x, y, r, fill, o = {}) {
  const { face = '', bands = [], ring = '', shadow = true, sw = 6 } = o;
  let s = '';
  if (ring) s += `<circle r="${r + 12}" fill="none" stroke="${ring}" stroke-width="9" opacity=".8"/>`;
  s += `<clipPath id="pc${Math.round(x)}_${Math.round(y)}_${Math.round(r)}"><circle r="${r}"/></clipPath>`;
  s += `<circle r="${r}" fill="${fill}"/>`;
  let inner = '';
  bands.forEach(b => { inner += `<path d="${b.d}" fill="${b.fill}" opacity="${b.o || 1}"/>`; });
  if (shadow) inner += `<circle cx="${r * .45}" cy="${r * .35}" r="${r * 1.05}" fill="#000" opacity=".16"/>`;
  s += `<g clip-path="url(#pc${Math.round(x)}_${Math.round(y)}_${Math.round(r)})">${inner}</g>`;
  s += `<circle r="${r}" fill="none" stroke="${C.ink}" stroke-width="${sw}"/>`;
  if (face) s += faceSvg(r, face);
  return g(s, at(x, y));
}
function faceSvg(r, mood) {
  const e = r * .11, ex = r * .3, ey = -r * .1;
  let s = `<circle cx="${-ex}" cy="${ey}" r="${e}" fill="${C.ink}"/><circle cx="${ex}" cy="${ey}" r="${e}" fill="${C.ink}"/>`;
  const my = r * .32;
  if (mood === 'happy') s += `<path d="M${-r * .25} ${my} Q0 ${my + r * .28} ${r * .25} ${my}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
  else if (mood === 'flat') s += `<path d="M${-r * .22} ${my + 4} L${r * .22} ${my + 4}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
  else if (mood === 'sad') s += `<path d="M${-r * .25} ${my + r * .16} Q0 ${my - r * .1} ${r * .25} ${my + r * .16}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
  else if (mood === 'ooh') s += `<ellipse cx="0" cy="${my + 6}" rx="${r * .1}" ry="${r * .14}" fill="${C.ink}"/>`;
  else if (mood === 'wavy') s += `<path d="M${-r * .28} ${my + 6} q${r * .07} ${-r * .12} ${r * .14} 0 t${r * .14} 0 t${r * .14} 0 t${r * .14} 0" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
  return s;
}

// The channel's astronaut: round helmet, dot eyes, stick body in an orange suit.
function astronaut(x, y, s = 1, o = {}) {
  const { mood = 'flat', armL = 20, armR = -20, lookX = 0, bob = 0 } = o;
  const ink = C.ink;
  let b = '';
  b += `<line x1="-14" y1="150" x2="-22" y2="235" stroke="${ink}" stroke-width="9" stroke-linecap="round"/><line x1="14" y1="150" x2="22" y2="235" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>`;
  b += `<ellipse cx="-30" cy="238" rx="18" ry="9" fill="${C.white}" stroke="${ink}" stroke-width="5"/><ellipse cx="30" cy="238" rx="18" ry="9" fill="${C.white}" stroke="${ink}" stroke-width="5"/>`;
  b += `<g transform="translate(-30 82) rotate(${armL})"><line x1="0" y1="0" x2="-8" y2="66" stroke="${ink}" stroke-width="9" stroke-linecap="round"/><circle cx="-8" cy="70" r="10" fill="${C.white}" stroke="${ink}" stroke-width="5"/></g>`;
  b += `<g transform="translate(30 82) rotate(${armR})"><line x1="0" y1="0" x2="8" y2="66" stroke="${ink}" stroke-width="9" stroke-linecap="round"/><circle cx="8" cy="70" r="10" fill="${C.white}" stroke="${ink}" stroke-width="5"/></g>`;
  b += `<rect x="-36" y="62" width="72" height="96" rx="22" fill="${C.orange}" stroke="${ink}" stroke-width="6"/>`;
  b += `<rect x="-16" y="92" width="32" height="22" rx="5" fill="${C.cream}" stroke="${ink}" stroke-width="4"/><circle cx="-7" cy="103" r="3.5" fill="${C.red}"/><circle cx="7" cy="103" r="3.5" fill="${C.teal}"/>`;
  b += `<circle cx="0" cy="0" r="70" fill="${C.white}" stroke="${ink}" stroke-width="6"/>`;
  b += `<ellipse cx="0" cy="4" rx="52" ry="44" fill="#fde8c8" stroke="${ink}" stroke-width="5"/>`;
  b += `<circle cx="${-17 + lookX}" cy="-2" r="6.5" fill="${ink}"/><circle cx="${17 + lookX}" cy="-2" r="6.5" fill="${ink}"/>`;
  if (mood === 'flat') b += `<line x1="${-12 + lookX}" y1="22" x2="${12 + lookX}" y2="22" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><line x1="${-26 + lookX}" y1="-17" x2="${-8 + lookX}" y2="-13" stroke="${ink}" stroke-width="4" stroke-linecap="round"/><line x1="${26 + lookX}" y1="-17" x2="${8 + lookX}" y2="-13" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
  if (mood === 'happy') b += `<path d="M${-14 + lookX} 18 Q${lookX} 34 ${14 + lookX} 18" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
  if (mood === 'ooh') b += `<ellipse cx="${lookX}" cy="24" rx="7" ry="9" fill="${ink}"/>`;
  if (mood === 'hmm') b += `<path d="M${-12 + lookX} 24 q6 -7 12 0 t12 0" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
  b += `<path d="M-40 -34 Q-20 -56 6 -58" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>`;
  return g(b, at(x, y + bob, s));
}

function newspaper(x, y, s, rot, headline = 'NEW EARTH FOUND') {
  let b = `<rect x="-190" y="-130" width="380" height="260" rx="6" fill="${C.cream}" stroke="${C.ink}" stroke-width="6"/>`;
  b += text(0, -92, 'THE DAILY COSMOS', 22, C.ink, { font: 'Hand' });
  b += `<line x1="-170" y1="-80" x2="170" y2="-80" stroke="${C.ink}" stroke-width="3"/>`;
  b += text(0, -30, headline, 46, C.ink, { font: 'Brush' });
  b += `<circle cx="-105" cy="52" r="48" fill="${C.blue}" stroke="${C.ink}" stroke-width="5"/><path d="M-135 30 q20 -20 40 0 q10 24 -14 30 q-22 -4 -26 -30z" fill="${C.green}"/><path d="M-100 70 q20 -14 34 4 q-10 18 -34 -4z" fill="${C.green}"/>`;
  for (let i = 0; i < 6; i++) b += `<line x1="-30" y1="${14 + i * 17}" x2="${150 - (i % 3) * 22}" y2="${14 + i * 17}" stroke="${C.grey}" stroke-width="5" stroke-linecap="round"/>`;
  return g(b, at(x, y, s, rot));
}

// Black card with handwritten white lines, like a chalked question.
function card(t, lines) { // lines: [{at, str, size, y}]
  let s = bgBlack();
  lines.forEach(l => { s += writeOn(t, l.at, l.at + (l.dur || Math.min(1.4, l.str.length * .035)), W / 2, l.y, l.str, l.size || 64, C.white, { font: 'Brush', width: l.width }); });
  return s;
}

// Wrap a finished frame: hand-drawn wobble + paper grain.
function frame(inner, t, o = {}) {
  const seed = Math.floor(t * 6) % 5;
  const wob = o.noWobble ? '' : 'filter="url(#boil)"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${DEFS}
    <filter id="boil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="${seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${seed + 9}"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.9 -0.25"/></filter>
  </defs>
  ${o.under||''}<g ${wob}><g transform="translate(${W/2} ${H/2}) scale(1.025) translate(${-W/2} ${-H/2})">${inner}</g></g>${o.noVig?'':vignette(o.vig??1)}
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="${o.grain ?? .22}" style="mix-blend-mode:multiply"/>
  </svg>`;
}

// ---------- v2: lit scenes, camera, in-scene characters ----------
const DEFS = `
  <radialGradient id="gVig" cx="50%" cy="50%" r="72%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".72"/></radialGradient>
  <radialGradient id="gBlue"><stop offset="0%" stop-color="#8fe3ff" stop-opacity=".95"/><stop offset="45%" stop-color="#3fb4ff" stop-opacity=".35"/><stop offset="100%" stop-color="#3fb4ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="gWarm"><stop offset="0%" stop-color="#ffe6a8" stop-opacity=".95"/><stop offset="50%" stop-color="#ffb347" stop-opacity=".3"/><stop offset="100%" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
  <radialGradient id="gRed"><stop offset="0%" stop-color="#ff9a8a" stop-opacity=".9"/><stop offset="55%" stop-color="#ff5a45" stop-opacity=".28"/><stop offset="100%" stop-color="#ff5a45" stop-opacity="0"/></radialGradient>
  <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#070b1a"/><stop offset="60%" stop-color="#10254a"/><stop offset="100%" stop-color="#1d4a66"/></linearGradient>
  <linearGradient id="gSpot" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff6d8" stop-opacity=".55"/><stop offset="100%" stop-color="#fff6d8" stop-opacity="0"/></linearGradient>
  <linearGradient id="gHall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1c"/><stop offset="100%" stop-color="#1a2140"/></linearGradient>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="soft2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>`;
// camera: look at (cx,cy) with zoom z
const cam = (inner, cx, cy, z) => `<g transform="translate(${W / 2} ${H / 2}) scale(${z}) translate(${-cx} ${-cy})">${inner}</g>`;
const glow = (x, y, r, id, o = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id})" opacity="${o}"/>`;
function stars(t, n = 120, w = W, h = H, seed = 0) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = rnd(i + seed) * w, y = rnd(i + seed + 100) * h, r = .8 + rnd(i + seed + 200) * 2.2;
    const tw = .35 + .65 * Math.abs(Math.sin(t * (.5 + rnd(i + 300)) + i));
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff8e7" opacity="${tw.toFixed(2)}"/>`;
  }
  return s;
}
// The big glowing "Earth 2.0": the video's recurring object.
function earth2(x, y, r, t, o = {}) {
  const id = 'e2' + Math.round(x) + Math.round(r);
  const drift = (t * 14) % (r * 4);
  let land = '';
  for (let k = -1; k < 2; k++) {
    const dx = k * r * 4 - drift + r;
    land += `<path transform="translate(${dx} 0)" d="M${-r * .9} ${-r * .35} q${r * .3} ${-r * .45} ${r * .75} ${-r * .15} q${r * .25} ${r * .3} ${-r * .05} ${r * .55} q${-r * .35} ${r * .2} ${-r * .7} ${-r * .4}z M${r * .5} ${r * .2} q${r * .4} ${-r * .2} ${r * .6} ${r * .15} q${-r * .1} ${r * .4} ${-r * .6} ${-r * .15}z M${r * 1.5} ${-r * .5} q${r * .5} ${-r * .1} ${r * .5} ${r * .35} q${-r * .3} ${r * .25} ${-r * .5} ${-r * .35}z" fill="#57c785"/>`;
  }
  let s = glow(0, 0, r * 2.1, 'gBlue', o.glow ?? .9);
  s += `<clipPath id="${id}"><circle r="${r}"/></clipPath><circle r="${r}" fill="#2f8fd6"/>`;
  s += `<g clip-path="url(#${id})">${land}<ellipse cx="${-r * .3}" cy="${-r * .62}" rx="${r * .5}" ry="${r * .09}" fill="#fff" opacity=".8"/><ellipse cx="${r * .35}" cy="${r * .5}" rx="${r * .45}" ry="${r * .08}" fill="#fff" opacity=".7"/><circle cx="${r * .5}" cy="${r * .45}" r="${r * 1.15}" fill="#061a3a" opacity=".38"/></g>`;
  s += `<circle r="${r}" fill="none" stroke="${C.ink}" stroke-width="${o.sw ?? 6}"/><path d="M${-r * .72} ${-r * .38} A${r * .82} ${r * .82} 0 0 1 ${-r * .2} ${-r * .8}" fill="none" stroke="#fff" stroke-width="${r * .05}" stroke-linecap="round" opacity=".7"/>`;
  return g(s, at(x, y));
}
// In-scene person: round head, bean body, thin legs.
function person(x, y, s = 1, o = {}) {
  const { coat = C.white, skin = '#f6d7b0', hair = '#5b3a29', mood = 'flat', look = 0, armR = 10, armL = -10, glasses = true, scarf = C.orange, lit = '' } = o;
  const ink = C.ink; let b = '';
  b += `<ellipse cx="0" cy="182" rx="52" ry="9" fill="#000" opacity=".35"/>`;
  b += `<line x1="-13" y1="120" x2="-15" y2="176" stroke="${ink}" stroke-width="8" stroke-linecap="round"/><line x1="13" y1="120" x2="15" y2="176" stroke="${ink}" stroke-width="8" stroke-linecap="round"/><path d="M-30 180 h18 M12 180 h18" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>`;
  b += `<g transform="translate(-30 52) rotate(${armL})"><path d="M0 0 q-10 30 -4 58" fill="none" stroke="${ink}" stroke-width="15" stroke-linecap="round"/><path d="M0 0 q-10 30 -4 58" fill="none" stroke="${coat}" stroke-width="7" stroke-linecap="round"/></g>`;
  b += `<g transform="translate(30 52) rotate(${armR})"><path d="M0 0 q10 30 4 58" fill="none" stroke="${ink}" stroke-width="15" stroke-linecap="round"/><path d="M0 0 q10 30 4 58" fill="none" stroke="${coat}" stroke-width="7" stroke-linecap="round"/></g>`;
  b += `<path d="M-34 60 q0 -26 34 -26 q34 0 34 26 v48 q0 24 -34 24 q-34 0 -34 -24z" fill="${coat}" stroke="${ink}" stroke-width="6"/><line x1="0" y1="52" x2="0" y2="130" stroke="${ink}" stroke-width="3" opacity=".5"/>`;
  b += `<path d="M-26 36 q26 16 52 0 l4 14 q-30 14 -60 0z" fill="${scarf}" stroke="${ink}" stroke-width="5"/>`;
  b += `<circle cx="0" cy="-18" r="52" fill="${skin}" stroke="${ink}" stroke-width="6"/>`;
  b += `<path d="M-50 -30 q6 -44 50 -42 q44 -2 50 42 q-22 -24 -50 -22 q-28 -2 -50 22z" fill="${hair}" stroke="${ink}" stroke-width="5"/>`;
  const ex = 17, ey = -14 + (o.lookY || 0);
  if (glasses) b += `<circle cx="${-ex + look}" cy="${ey}" r="14" fill="#fff" stroke="${ink}" stroke-width="4"/><circle cx="${ex + look}" cy="${ey}" r="14" fill="#fff" stroke="${ink}" stroke-width="4"/><line x1="${-3 + look}" y1="${ey}" x2="${3 + look}" y2="${ey}" stroke="${ink}" stroke-width="4"/>`;
  b += `<circle cx="${-ex + look * 1.4}" cy="${ey + (o.lookY || 0) * .4}" r="5" fill="${ink}"/><circle cx="${ex + look * 1.4}" cy="${ey + (o.lookY || 0) * .4}" r="5" fill="${ink}"/>`;
  const my = 12;
  if (mood === 'ooh') b += `<ellipse cx="${look}" cy="${my + 2}" rx="7" ry="10" fill="${ink}"/>`;
  if (mood === 'flat') b += `<line x1="${-10 + look}" y1="${my}" x2="${10 + look}" y2="${my}" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
  if (mood === 'happy') b += `<path d="M${-12 + look} ${my - 3} Q${look} ${my + 13} ${12 + look} ${my - 3}" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
  if (mood === 'worry') b += `<path d="M${-11 + look} ${my + 5} Q${look} ${my - 6} ${11 + look} ${my + 5}" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><path d="M44 -44 q-9 16 0 24 q9 -8 0 -24z" fill="#9ddcff" stroke="${ink}" stroke-width="3"/>`;
  if (lit) b += `<path d="M-46 -40 A52 52 0 0 1 10 -69" fill="none" stroke="${lit}" stroke-width="7" stroke-linecap="round" opacity=".9"/><path d="M-33 62 q0 -22 22 -26" fill="none" stroke="${lit}" stroke-width="6" stroke-linecap="round" opacity=".8"/>`;
  return g(b, at(x, y, s));
}
const tag = (x, y, str, fill = C.red, k = 1, rot = 0, size = 34) => { const w = str.length * size * .5 + 36; return g(`<rect x="0" y="${-size * .8}" width="${w}" height="${size * 1.5}" rx="6" fill="${fill}" stroke="${C.ink}" stroke-width="5"/>` + text(w / 2, size * .3, str, size, C.white, { font: 'Brush' }), at(x, y, k, rot)); };
const vignette = (o = 1) => `<rect width="${W}" height="${H}" fill="url(#gVig)" opacity="${o}"/>`;
