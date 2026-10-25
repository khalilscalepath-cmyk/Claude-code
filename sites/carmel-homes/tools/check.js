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

    // --- every picture is the shape the stylesheet asked for ---
    //
    // This is here because it was once wrong on every image at once and the
    // suite said nothing. Each <img> carries width/height attributes so the
    // browser can reserve its space, and those attributes land as
    // presentational hints — a literal pixel height, which outranks
    // aspect-ratio. Without height:auto the boxes take the photograph's full
    // height and object-fit crops a tall strip out of a wide picture. Asserting
    // "the file loaded" never catches that; asserting the shape does.
    const shapes = await page.evaluate(() => {
      const wrong = [], inset = [];
      for (const img of document.querySelectorAll('img')) {
        const cs = getComputedStyle(img);
        if (cs.aspectRatio === 'auto') continue;
        const [a, b] = cs.aspectRatio.split('/').map(Number);
        const want = a / b;
        const got = parseFloat(cs.width) / parseFloat(cs.height);
        if (Math.abs(got - want) / want > 0.02) {
          wrong.push(`${img.getAttribute('src')} wants ${want.toFixed(2)}, renders ${got.toFixed(2)}`);
        }
      }
      // UA sheets inset figure, blockquote and friends by 40px a side. On a
      // phone that is a fifth of the screen, and it is invisible in code.
      for (const el of document.querySelectorAll('figure, blockquote, dl, fieldset, ol, ul')) {
        const cs = getComputedStyle(el);
        if (parseFloat(cs.marginLeft) >= 39 || parseFloat(cs.marginRight) >= 39) {
          inset.push(`${el.tagName.toLowerCase()}.${el.className.toString().slice(0, 24)}`);
        }
      }
      return { wrong, inset };
    });
    for (const w of shapes.wrong) problems.push(`${label}: ${w}`);
    for (const i of shapes.inset) problems.push(`${label}: ${i} still carries the UA 40px side margin`);

    const callVisible = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="tel:"]')].some(el => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0 && r.width > 0;
      }));
    if (!callVisible) problems.push(`${label}: no tel: link visible without scrolling`);

    await page.screenshot({ path: `${OUT}/${label}-01-hero.png` });

    // --- section geometry ---
    const marks = await page.evaluate(() => {
      const out = {};
      const sec = s => {
        const el = document.querySelector(s);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
      };
      out.work = sec('#work');
      out.process = sec('#process');
      out.jamie = sec('#jamie');
      out.contact = sec('#contact');
      out.figures = sec('.figures');
      out.triggers = ScrollTrigger.getAll().filter(t => t.pin).length;
      return out;
    });

    for (const [name, m] of Object.entries(marks)) {
      if (m === null) problems.push(`${label}: section ${name} is missing from the page`);
    }

    // Swiss layout: nothing is pinned. Pinning fights native scroll and the
    // design does not need it.
    if (marks.triggers > 0) {
      problems.push(`${label}: ${marks.triggers} pinned sections (this layout wants 0)`);
    }

    // --- work: all nine projects, every photograph loaded ---
    await scrollTo(page, marks.work.top + 200, 1800);
    await page.screenshot({ path: `${OUT}/${label}-02-work.png` });
    const work = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('.project')];
      const imgs = cards.map(c => c.querySelector('img')).filter(Boolean);
      return {
        cards: cards.length,
        broken: imgs.filter(i => i.complete && i.naturalWidth === 0).length,
        unnamed: cards.filter(c => !c.querySelector('h3')?.textContent.trim()).length,
        counts: cards.filter(c => /\d/.test(c.querySelector('.mark')?.textContent || '')).length,
        offscreenRight: cards.filter(c => c.getBoundingClientRect().left > innerWidth + 4).length,
      };
    });
    if (work.cards !== 9) problems.push(`${label}: ${work.cards} project cards (want 9)`);
    if (work.broken) problems.push(`${label}: ${work.broken} project photographs failed to load`);
    if (work.unnamed) problems.push(`${label}: ${work.unnamed} project cards with no name`);
    if (work.counts !== 9) problems.push(`${label}: only ${work.counts}/9 cards show a photo count`);
    if (work.offscreenRight) problems.push(`${label}: ${work.offscreenRight} cards sit off the right edge`);

    // --- figures ---
    await scrollTo(page, marks.figures.top - 120, 2600);
    const figures = await page.evaluate(() =>
      [...document.querySelectorAll('[data-countup]')].map(e => e.textContent.trim()));
    if (figures.some(f => !f)) problems.push(`${label}: CountUp empty: ${JSON.stringify(figures)}`);
    if (figures[0] && figures[0] !== '1986') {
      problems.push(`${label}: first figure settled on "${figures[0]}" not 1986`);
    }

    // --- process: four phases, and the dollhouse if WebGL is available ---
    await scrollTo(page, marks.process.top + 150, 2000);
    await page.screenshot({ path: `${OUT}/${label}-03-process.png` });
    const proc = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('.phase')];
      const house = document.querySelector('[data-house]');
      const canvas = document.querySelector('[data-house-canvas]');
      let gl = false;
      try { const c = document.createElement('canvas');
        gl = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) {}
      return {
        rows: rows.length,
        blank: rows.filter(r => !r.querySelector('h3')?.textContent.trim()).length,
        gl,
        houseShown: !!house && !house.hidden,
        canvasSized: !!canvas && canvas.width > 0 && canvas.height > 0,
      };
    });
    if (proc.rows !== 4) problems.push(`${label}: ${proc.rows} phase rows (want 4)`);
    if (proc.blank) problems.push(`${label}: ${proc.blank} phase rows with no heading`);
    // Only assert the dollhouse where the browser can actually run it.
    if (proc.gl && !proc.houseShown) problems.push(`${label}: WebGL available but the dollhouse stayed hidden`);
    if (proc.houseShown && !proc.canvasSized) problems.push(`${label}: dollhouse canvas has no size`);

    // --- the type actually loaded, not a fallback ---
    const typeOk = await page.evaluate(() =>
      getComputedStyle(document.querySelector('h1')).fontFamily.includes('Outfit')
      && document.fonts.status === 'loaded');
    if (!typeOk) problems.push(`${label}: Outfit did not load`);

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
  // Reduced motion must mean no movement, never less content: everything
  // that carries a reveal has to end up visible, and nothing may sit off
  // the right edge where it cannot be reached.
  const rm = await page.evaluate(() => {
    const hidden = [...document.querySelectorAll('[data-reveal], .reveal')]
      .filter(el => parseFloat(getComputedStyle(el).opacity) < 0.9)
      .map(el => el.className.toString().slice(0, 40));
    const offRight = [...document.querySelectorAll('.project')]
      .filter(c => c.getBoundingClientRect().left > innerWidth + 4).length;
    return { hidden, offRight };
  });
  if (rm.hidden.length) {
    problems.push(`reduced-motion: ${rm.hidden.length} element(s) left invisible: ${rm.hidden.slice(0, 3).join(', ')}`);
  }
  if (rm.offRight) problems.push(`reduced-motion: ${rm.offRight} project cards unreachable off-screen`);
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
