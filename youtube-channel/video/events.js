// Walks the timeline without drawing and records when things appear, for placing sound effects.
// Output: sfx-events-001.json  [{t, kind}]  kinds: cut, card, pop, write
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = __dirname;
let lib = fs.readFileSync(path.join(dir, 'lib.js'), 'utf8');
lib = lib.replace('const pop = (t, at, d = .35) => t < at ? 0 : back(prog(t, at, at + d));',
  'const pop = (t, at, d = .35) => { if (t >= at && t - at < 1 / 12 + 1e-6) __ev.push({ t: __T0 + at, kind: "pop" }); return t < at ? 0 : back(prog(t, at, at + d)); };');
lib = lib.replace('function writeOn(t, t0, t1, x, y, str, size, fill, o = {}) {',
  'function writeOn(t, t0, t1, x, y, str, size, fill, o = {}) { if (t >= t0 && t - t0 < 1 / 12 + 1e-6) __ev.push({ t: __T0 + t0, kind: "write", dur: t1 - t0 });');
const timing = JSON.parse(fs.readFileSync(path.join(dir, 'timing-001.json'))).sentences;
const files = ['scenes-001-open.js', 'scenes-001-a.js', 'scenes-001-b.js', 'scenes-001-c.js'];
const ctx = { TIMING: timing, __ev: [], __T0: 0, Math, String, Number, JSON, console };
vm.createContext(ctx);
vm.runInContext(lib + '\n' + files.map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n') + '\n;this.SCENES = SCENES;', ctx);
const S = ctx.SCENES, fps = 12, end = 513.8;
for (let i = 0; i * 1 / fps < end; i++) {
  const T = i / fps;
  const sc = S.slice().reverse().find(s => T >= s.start && T < s.end) || S[S.length - 1];
  ctx.__T0 = sc.start; sc.draw(T - sc.start, T);
}
const ev = ctx.__ev.slice();
S.forEach(s => ev.push({ t: s.start, kind: s.o && s.o.noVig ? 'card' : 'cut' }));
const seen = new Set(), out = [];
ev.sort((a, b) => a.t - b.t).forEach(e => { const k = e.kind + Math.round(e.t * 20); if (!seen.has(k) && e.t >= 0 && e.t < end) { seen.add(k); out.push(e); } });
fs.writeFileSync(path.join(dir, 'sfx-events-001.json'), JSON.stringify(out, null, 0));
const c = {}; out.forEach(e => c[e.kind] = (c[e.kind] || 0) + 1); console.log(c, out.length);
