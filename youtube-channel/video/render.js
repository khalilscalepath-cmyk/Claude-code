// Renders scenes to PNG frames with headless Chromium, then ffmpeg joins them with the narration.
// Usage: node render.js <scenes.js> <out.mp4> [fps] [start] [end]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

(async () => {
  const [scenesFile, out, fpsArg, startArg, endArg] = process.argv.slice(2);
  const fps = Number(fpsArg || 12);
  const dir = __dirname, frames = path.join(dir, 'frames');
  fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames);
  const b64 = f => fs.readFileSync(path.join(dir, 'fonts', f)).toString('base64');
  const html = `<!doctype html><html><head><style>
    @font-face{font-family:Hand;src:url(data:font/ttf;base64,${b64('PatrickHand.ttf')})}
    @font-face{font-family:Brush;src:url(data:font/ttf;base64,${b64('CaveatBrush.ttf')})}
    html,body{margin:0;background:#000;overflow:hidden}</style></head><body><div id="s"></div>
    <script>${fs.readFileSync(path.join(dir, 'lib.js'), 'utf8')}\n${fs.readFileSync(path.resolve(scenesFile), 'utf8')}
    window.draw = T => { const sc = SCENES.find(s => T >= s.start && T < s.end) || SCENES[SCENES.length - 1];
      document.getElementById('s').innerHTML = frame(sc.draw(T - sc.start, T), T, sc.o); };
    window.range = () => [SCENES[0].start, SCENES[SCENES.length - 1].end];</script></body></html>`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exit(1); });
  await page.setContent(html); await page.evaluate(() => document.fonts.ready);
  const [s0, s1] = await page.evaluate(() => window.range());
  const start = Number(startArg ?? s0), end = Number(endArg ?? s1);
  const n = Math.round((end - start) * fps);
  for (let i = 0; i < n; i++) {
    await page.evaluate(T => window.draw(T), start + i / fps);
    await page.screenshot({ path: path.join(frames, String(i).padStart(6, '0') + '.png') });
    if (i % 120 === 0) console.log(`frame ${i}/${n}`);
  }
  await browser.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(fps), '-i', path.join(frames, '%06d.png'),
    '-ss', String(start), '-t', String(end - start), '-i', path.join(dir, 'narration-001.mp3'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '24', '-crf', '20', '-c:a', 'aac', '-b:a', '160k', '-af', 'loudnorm=I=-16:TP=-1.5', '-shortest', out]);
  console.log('wrote', out);
})();
