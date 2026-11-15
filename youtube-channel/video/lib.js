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
  <defs>
    <filter id="boil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="${seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${seed + 9}"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.9 -0.25"/></filter>
  </defs>
  <g ${wob}><g transform="translate(${W/2} ${H/2}) scale(1.025) translate(${-W/2} ${-H/2})">${inner}</g></g>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="${o.grain ?? .22}" style="mix-blend-mode:multiply"/>
  </svg>`;
}
