# How video 001 is built

1. `python3 align.py` — times every clause of the script to the pauses in `narration-001.mp3` → `timing-001.json`.
2. Scenes are drawn in code: `lib.js` (drawing kit) and `scenes-001-*.js` (one scene per few sentences, timed with `seg(first, last, ...)`).
3. `node shot.js <scenes,comma,separated> <seconds...>` — still frames into `checks/` for review.
4. `node render.js <scenes> out/parts/pN.mp4 12 <start> <end>` — renders a time range (run 4 in parallel).
5. `node events.js` — records every cut and label pop → `sfx-events-001.json`.
6. `python3 mix.py` — music bed (ducked under the voice), synthesized sound effects, narration → `out/mix-001.f32`.
7. Join the parts and the mix, normalise to about −15 LUFS (see the ffmpeg commands in the session notes) → `out/001-earth-2-0-final.mp4`.
8. `node thumb.js` — thumbnails into `../thumbnails/`.

Music: `music/CREDITS.md` (CC BY 4.0, credit required in every description).
