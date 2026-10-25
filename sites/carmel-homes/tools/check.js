const { chromium } = require('playwright');

// Browser checks for the preview. Start the server first:
//   python3 server/server.py --port 8077
//   node tools/check.js [baseUrl] [screenshotDir]
const BASE = process.argv[2] || 'http://127.0.0.1:8077/';
const OUT = process.argv[3] || require('path').join(require('os').tmpdir(), 'carmel-shots');
require('fs').mkdirSync(OUT, { recursive: true });

// Scroll the way a visitor does — through the wheel, so Lenis and ScrollTrigger
// stay in sync. Jumping with scrollIntoView desyncs them and hides real bugs.
async function scrollTo(page, y, settle = 700) {
  for (let i = 0; i < 400; i++) {
    const at = await page.evaluate(() => window.scrollY);
    const delta = y - at;
    if (Math.abs(delta) < 24) break;
    await page.mouse.wheel(0, Math.max(-900, Math.min(900, delta)));
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(settle);
}

// Does the viewport actually show content, or are we parked on empty background?
async function paintedRatio(page) {
  const buf = await page.screenshot();
  // cheap proxy: count distinct byte values in the PNG payload
  const seen = new Set();
  for (let i = 0; i < buf.length; i += 97) seen.add(buf[i]);
  return seen.size;
}

(async () => {
  const browser = await chromium.launch();
  const problems = [];

  for (const [label, width, height] of [['mobile', 390, 844], ['desktop', 1366, 900]]) {
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();

    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    page.on('requestfailed', r => errors.push('requestfailed: ' + r.url()));

    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(2200);

    const overflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    if (overflow.scrollW > overflow.clientW + 1) {
      problems.push(`${label}: horizontal overflow ${overflow.scrollW} > ${overflow.clientW}`);
    }

    const callVisible = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="tel:"]')].some(el => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0 && r.width > 0;
      }));
    if (!callVisible) problems.push(`${label}: no tel: link visible without scrolling`);

    await page.screenshot({ path: `${OUT}/${label}-01-hero.png` });

    // --- where does each pinned section actually live? ---
    const marks = await page.evaluate(() => {
      const out = {};
      const sec = s => {
        const el = document.querySelector(s);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
      };
      out.process = sec('.process');
      out.figures = sec('.figures');
      out.work = sec('.work');
      out.tour = sec('.tour');
      out.jamie = sec('.jamie');
      out.contact = sec('#contact');
      out.triggers = ScrollTrigger.getAll()
        .filter(t => t.pin)
        .map(t => ({
          cls: (t.trigger.className || '').toString().split(' ')[1] || t.trigger.className,
          start: Math.round(t.start), end: Math.round(t.end),
        }));
      return out;
    });

    const workPin = marks.triggers.find(t => String(t.cls).includes('work'));

    if (workPin && Math.abs(workPin.start - marks.work.top) > 40) {
      problems.push(`${label}: work pin starts at ${workPin.start} but section is at ${marks.work.top}`);
    }

    // At most two pinned sections. Three fights native scroll and hurts
    // mobile, per the UI/UX guidance; the 3D process scrub was the third.
    if (marks.triggers.length > 2) {
      problems.push(`${label}: ${marks.triggers.length} pinned sections (want at most 2): ` +
        marks.triggers.map(t => t.cls).join(', '));
    }

    // --- process: all four phases plus the finished-house payoff ---
    await scrollTo(page, marks.process.top - 80, 2200);
    await page.screenshot({ path: `${OUT}/${label}-02-process.png` });
    const proc = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('.phase-row')];
      const fin = document.querySelector('.process__finish img');
      return {
        rows: rows.length,
        blank: rows.filter(r => !r.querySelector('h3')?.textContent.trim()).length,
        hidden: rows.filter(r => parseFloat(getComputedStyle(r).opacity) < 0.05).length,
        finishLoaded: !!fin && fin.complete && fin.naturalWidth > 0,
      };
    });
    if (proc.rows !== 4) problems.push(`${label}: ${proc.rows} phase rows (want 4)`);
    if (proc.blank) problems.push(`${label}: ${proc.blank} phase rows with no heading`);
    if (!proc.finishLoaded) problems.push(`${label}: the finished-house photo did not load`);

    // --- figures ---
    await scrollTo(page, marks.figures.top - 120, 2600);
    const figures = await page.evaluate(() =>
      [...document.querySelectorAll('[data-countup]')].map(n => n.textContent.trim()));
    if (figures.some(f => !f)) problems.push(`${label}: CountUp empty: ${JSON.stringify(figures)}`);
    if (figures[0] && figures[0] !== '1986') problems.push(`${label}: first figure settled on "${figures[0]}" not 1986`);
    await page.screenshot({ path: `${OUT}/${label}-03-figures.png` });

    // --- work, mid-track ---
    const workMid = workPin ? workPin.start + (workPin.end - workPin.start) * 0.45 : marks.work.top + 400;
    await scrollTo(page, workMid, 1100);

    const workState = await page.evaluate(() => {
      const first = document.querySelector('.project');
      if (!first) return null;
      const r = first.getBoundingClientRect();
      const names = [...document.querySelectorAll('.project__name')]
        .filter(n => { const b = n.getBoundingClientRect(); return b.left < window.innerWidth && b.right > 0; })
        .map(n => n.textContent.trim());
      return { firstLeft: Math.round(r.left), visibleNames: names, heading: !!document.querySelector('.work h2') };
    });
    if (!workState || workState.visibleNames.length === 0) {
      problems.push(`${label}: no project cards on screen mid-work (${JSON.stringify(workState)})`);
    }
    await page.screenshot({ path: `${OUT}/${label}-04-work.png` });

    // --- the house tour (desktop only) ---
    if (label === 'desktop') {
      const tourPin = marks.triggers.find(t => String(t.cls).includes('tour'));
      if (!tourPin) {
        problems.push('desktop: tour section never pinned');
      } else {
        if (Math.abs(tourPin.start - marks.tour.top) > 40) {
          problems.push(`desktop: tour pin starts at ${tourPin.start} but section is at ${marks.tour.top}`);
        }
        // Each room holds for three quarters of its segment and dissolves over
        // the last quarter, so across the scroll most samples must show exactly
        // one room. A single sample is flaky — scroll position does not map
        // cleanly onto settled scrub progress — so sample across the section
        // and assert the proportion. The regression this guards is the
        // double exposure: two rooms at half opacity for most of the scroll.
        const span = tourPin.end - tourPin.start;
        let singles = 0, samples = 0, maxLit = 0, lastCounter = '';
        for (const f of [0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92]) {
          await scrollTo(page, tourPin.start + span * f, 650);
          const st = await page.evaluate(() => {
            const ops = [...document.querySelectorAll('[data-tour-frames] img')]
              .map(i => +getComputedStyle(i).opacity);
            return {
              lit: ops.filter(o => o > 0.02).length,
              counter: document.querySelector('[data-tour-counter]').textContent.trim(),
            };
          });
          samples++;
          if (st.lit === 1) singles++;
          maxLit = Math.max(maxLit, st.lit);
          lastCounter = st.counter;
        }
        if (maxLit > 2) problems.push(`desktop: ${maxLit} tour frames lit at once`);
        if (singles < 5) {
          problems.push(`desktop: only ${singles}/${samples} tour samples showed a single room — rooms are blending instead of holding`);
        }
        if (/Room 1 of/.test(lastCounter)) {
          problems.push('desktop: tour never advanced past the first room');
        }

        const tour = await page.evaluate(() => ({
          frames: document.querySelectorAll('[data-tour-frames] img').length,
        }));
        if (tour.frames < 12) problems.push(`desktop: only ${tour.frames} tour frames loaded`);

        await page.screenshot({ path: `${OUT}/desktop-04b-tour.png` });
      }
    } else {
      // phones keep the single static frame and must not fetch the rest
      const mobileFrames = await page.evaluate(() =>
        document.querySelectorAll('[data-tour-frames] img').length);
      if (mobileFrames !== 1) problems.push(`mobile: ${mobileFrames} tour frames loaded (want 1)`);
    }

    // --- jamie ---
    await scrollTo(page, marks.jamie.top - 80, 1400);
    await page.screenshot({ path: `${OUT}/${label}-05-jamie.png` });

    // --- contact, submitted for real ---
    await scrollTo(page, marks.contact.top - 60, 800);
    await page.fill('#f-name', 'Marcus Ellery');
    await page.fill('#f-phone', '480 555 0188');
    await page.fill('#f-email', 'marcus@example.com');
    await page.selectOption('#f-type', 'Home renovation');
    await page.fill('#f-msg', 'Kitchen and primary suite, 1998 house in Arcadia.');
    await page.screenshot({ path: `${OUT}/${label}-06-contact.png` });

    await page.click('[data-form] button[type="submit"]');
    await page.waitForTimeout(1600);
    const note = await page.textContent('[data-form-note]');
    if (!/Got it/.test(note || '')) problems.push(`${label}: form did not confirm, note="${note}"`);
    await page.screenshot({ path: `${OUT}/${label}-07-submitted.png` });

    if (label === 'mobile') {
      const small = await page.evaluate(() => {
        const sel = 'a.btn, .callbar a, .head-phone, button[type="submit"]';
        return [...document.querySelectorAll(sel)]
          .map(el => ({ t: (el.textContent || '').trim().slice(0, 20), h: Math.round(el.getBoundingClientRect().height) }))
          .filter(x => x.h > 0 && x.h < 44);
      });
      if (small.length) problems.push(`mobile: tap targets under 44px: ${JSON.stringify(small)}`);
    }

    if (errors.length) problems.push(`${label} console: ${[...new Set(errors)].slice(0, 6).join(' | ')}`);
    await ctx.close();
  }

  // reduced motion
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const rmErrors = [];
  page.on('pageerror', e => rmErrors.push(e.message));
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  const heroOpacity = await page.evaluate(() => getComputedStyle(document.querySelector('.hero__lede')).opacity);
  if (Number(heroOpacity) < 0.9) problems.push(`reduced-motion: hero copy stuck at opacity ${heroOpacity}`);
  await page.screenshot({ path: `${OUT}/reduced-motion.png` });
  if (rmErrors.length) problems.push(`reduced-motion errors: ${rmErrors.join(' | ')}`);
  await ctx.close();

  await browser.close();

  if (problems.length) {
    console.log('PROBLEMS:\n- ' + problems.join('\n- '));
    process.exit(1);
  }
  console.log('All checks passed.');
})();
