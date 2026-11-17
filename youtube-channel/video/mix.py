# Builds the final soundtrack for video 001: narration + music bed (ducked under speech) + synthesized sound effects.
# Usage: python3 mix.py  -> out/mix-001.wav
import json, subprocess, numpy as np
SR = 44100
rng = np.random.default_rng(7)
T = json.load(open('timing-001.json'))['sentences']
EV = json.load(open('sfx-events-001.json'))

def decode(path, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32)
    return a.reshape(-1, ch).copy()

voice = decode('narration-001.mp3', 1)[:, 0]
N = len(voice) + int(SR * .2)
cut = lambda i: 0 if i <= 0 else (T[i - 1]['end'] + T[i]['start']) / 2
st = lambda i: T[i]['start']

# ---------- music bed ----------
def rms(x): return float(np.sqrt(np.mean(x.astype(np.float64) ** 2)) + 1e-12)
# (track, start, end, seconds to skip into the track) — space-toned picks after the first mix felt off-tone
sections = [('Unwritten Return', 0, cut(34), 8), ('Odyssey', cut(34), cut(55), 10), ('Hypnothis', cut(55), cut(95), 0),
            ('Impact Lento', cut(95), cut(124), 6), ('Dreams Become Real', cut(124), N / SR, 44)]
bed = np.zeros((N, 2), np.float32)
XF = 2.0
for name, a, b, off in sections:
    tr = decode(f'music/{name}.mp3', 2)[int(off * SR):]
    tr /= rms(tr[:int((b - a + XF) * SR)])
    need = int((b - a + XF) * SR)
    seg = tr.copy(); lx = int(3 * SR)
    while len(seg) < need:  # loop with a 3 s crossfade
        f = np.linspace(0, 1, lx)[:, None]
        seg = np.concatenate([seg[:-lx], seg[-lx:] * (1 - f) + tr[:lx] * f, tr[lx:]])
    seg = seg[:need]
    fi = int((XF if a > 0 else .3) * SR); fo = int(XF * SR)
    seg[:fi] *= np.linspace(0, 1, fi)[:, None]; seg[-fo:] *= np.linspace(1, 0, fo)[:, None]
    p = max(0, int((a - XF / 2) * SR)); seg = seg[:N - p]
    bed[p:p + len(seg)] += seg

# speech envelope at 100 Hz -> ducking gain
hop = SR // 100
fr = len(voice) // hop
env = np.sqrt(np.mean(voice[:fr * hop].reshape(fr, hop) ** 2, axis=1) + 1e-12)
db = 20 * np.log10(env)
act = np.clip((db + 42) / 14, 0, 1)
sm = np.zeros_like(act)
for i in range(1, len(act)):  # attack 30 ms, release 350 ms
    k = .5 if act[i] > sm[i - 1] else .028
    sm[i] = sm[i - 1] + k * (act[i] - sm[i - 1])
speech_rms = float(np.sqrt(np.mean(env[db > -35] ** 2)))
gain_db = -15 - 7 * sm            # music sits 15 dB under speech in gaps, 22 dB under while talking
# comedic dropouts: music cuts out for a beat
for t0, d in [(st(33), 1.1), (st(121), 1.4), (st(61), .9)]:
    i0, i1 = int(t0 * 100), int((t0 + d) * 100)
    gain_db[max(0, i0 - 3):i1] = -80
g = 10 ** (gain_db / 20) * speech_rms
g = np.interp(np.arange(N) / hop, np.arange(len(g)), g, right=g[-1]).astype(np.float32)
bed *= g[:, None]

# ---------- sound effects ----------
sfx = np.zeros((N, 2), np.float32)
def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    sig = sig[:N - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    if sig.ndim == 1: sfx[i:i + len(sig), 0] += sig * l * 1.414; sfx[i:i + len(sig), 1] += sig * r * 1.414
    else: sfx[i:i + len(sig)] += sig
def tt(d): return np.arange(int(d * SR)) / SR
def lp(x, a):  # one-pole low-pass; a may be an array
    y = np.zeros_like(x); s = 0.0; a = np.broadcast_to(a, x.shape)
    for i in range(len(x)): s += a[i] * (x[i] - s); y[i] = s
    return y
def whoosh(d=.5):
    n = rng.standard_normal(int(d * SR)).astype(np.float32); t = tt(d)
    a = .02 + .25 * np.sin(np.pi * t / d) ** 2
    y = lp(n, a) * np.sin(np.pi * t / d) ** 2
    y /= np.abs(y).max(); pan = np.linspace(-.7, .7, len(y))
    return np.stack([y * np.cos((pan + 1) * np.pi / 4), y * np.sin((pan + 1) * np.pi / 4)], 1) * 1.414
def pop(f=700):
    t = tt(.09); ph = 2 * np.pi * np.cumsum(f * np.exp(-t * 18) + f * .45) / SR
    return np.sin(ph) * np.exp(-t * 45) * (1 - np.exp(-t * 2000))
def ding(f=880, d=1.2):
    t = tt(d); return sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * k) for m, a, k in [(1, 1, 3), (2.76, .4, 6), (5.4, .2, 10)]) / 1.6
def slam():
    t = tt(.5); body = np.sin(2 * np.pi * np.cumsum(40 + 50 * np.exp(-t * 12)) / SR) * np.exp(-t * 7)
    hit = lp(rng.standard_normal(len(t)), .25) * np.exp(-t * 40) * 2
    return np.tanh(1.8 * (body + hit)) / np.tanh(1.8)
def thump():
    t = tt(.3); return np.sin(2 * np.pi * np.cumsum(50 + 40 * np.exp(-t * 15)) / SR) * np.exp(-t * 12)
def scribble(d):
    d = float(np.clip(d, .3, 1.6)); t = tt(d); n = np.diff(rng.standard_normal(len(t) + 1))
    am = (np.sin(2 * np.pi * 13 * t + 3 * np.sin(2 * np.pi * 2.3 * t)) > .2).astype(float)
    return lp(n * am, .5) * .35 * np.minimum(1, np.minimum(t, d - t) * 20)
def buzz(d=.6, off=False):
    t = tt(d); y = sum(np.sin(2 * np.pi * 120 * k * t) / k for k in range(1, 9))
    gate = (rng.random(len(t) // 800 + 1) > (.35 if not off else .5)).repeat(800)[:len(t)]
    env = np.linspace(1, 0, len(t)) if off else np.ones(len(t))
    return y / 3 * gate * env * np.minimum(1, t * 50)
def noise_bed(d, a, hp=False):
    t = tt(d); n = rng.standard_normal(len(t)); n = np.diff(n, prepend=0) if hp else n
    return lp(n, a) * np.sin(np.pi * t / d) ** .6
def tick(): t = tt(.012); return np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 500)

W = {k: v for k, v in [('whoosh', whoosh())]}
last = -9; dens = []
for e in EV:
    t, k = e['t'], e['kind']
    if k == 'cut' and t > .1: place(whoosh(.55), t - .25, .16)
    elif k == 'card': place(thump(), t, .5)
    elif k == 'write': place(scribble(e.get('dur', .8)), t, .22, rng.uniform(-.3, .3))
    elif k == 'pop':
        dens = [x for x in dens if x > t - 1]
        if t - last < .16 or len(dens) >= 4: continue
        last = t; dens.append(t); place(pop(rng.uniform(560, 860)), t, .32, rng.uniform(-.4, .4))

# hand-placed moments
for t in [st(11), 24.63 + 1.5, st(33), st(121)]: place(slam(), t, .62)
for t in [8.93, cut(18) + .5, st(108)]: place(whoosh(.35), t - .1, .25); place(slam(), t + .3, .3)   # the catch tag drops
place(buzz(.7), 6.09, .16); place(buzz(1.0, True), st(122) + 1.2, .16)                                   # neon sign on / off
place(noise_bed(2.4, .9, True), cut(20) + 3.0, .13)                                                    # lead melting on Venus
place(noise_bed(7.0, .015), st(54), .9)                                                                # flares rumble
for i in range(30): place(tick(), cut(10) + .2 + i * .1, .25)                                          # 6,464 counter
for i in range(6): place(noise_bed(.06, .6), cut(40) + .2 + i * .7, .35)                               # calendar flips
for i, f in enumerate([523, 659, 784, 1047]): place(ding(f, .8), st(43) + 2.2 + i * .12, .18)           # age 1,796
for i in range(9): place(pop(500 + i * 40), st(44) + i * .22, .25)                                     # cakes stack
for t in [st(24) + .1, st(112) + 2.4, st(84)]: place(ding(988, 1.6), t, .2)                            # big reveals
place(ding(660, 2.5), st(137), .2)                                                                     # last line

mix = bed + sfx
mix[:len(voice)] += voice[:, None]
peak = float(np.abs(mix).max()); mix *= .89 / peak
mix.astype(np.float32).tofile('out/mix-001.f32')
print('peak before', round(peak, 3), 'speech rms', round(speech_rms, 4), 'samples', N)
# report: music level in gaps vs under speech
ga, gb = gain_db[sm < .05], gain_db[sm > .9]
print('music gain dB in gaps %.1f, under speech %.1f' % (np.median(ga), np.median(gb)))
