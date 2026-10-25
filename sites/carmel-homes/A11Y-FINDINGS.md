# Accessibility findings — dark.html

Audited 2026-10-25 against WCAG 2.1 AA by the `testing-accessibility-auditor`
agent (run on Haiku to keep cost down), then left unfixed because the session
ended. **Nothing below has been acted on.**

Method was sound: contrast was pixel-sampled rather than computed from CSS —
text hidden, the real painted background sampled under every text run, 40
scroll stops at 1440x900 and 41 at 390x844. 207 text runs measured on desktop,
188 on mobile. The agent noticed `dark.css` changed while it was auditing and
re-ran against the current file, which is the right instinct.

It independently confirmed the fixes from the previous commit landed: CTA
labels 2.84 -> 6.95:1, footer 1.02 -> 8.36:1, photo-count pills ~1.1 -> passing,
tour captions 1.1-1.6:1 -> passing.

## Blocker — fix before this goes to anyone

**B1. Under `prefers-reduced-motion`, the work and band strips clip their
content and nothing can scroll them.**

- `site.css:329` `.work__viewport { overflow: hidden }` at 900px+, and
  `site.css:236` `.band__track { width: max-content }`.
- `site.js:475` and `site.js:121` skip the scroll-driven movement when
  `REDUCED`, so the tracks never move — but they are still clipped.
- Measured at 1440x900 with reduced motion: 9 work cards, **2 fully visible, 6
  past the right edge**. 9 band photos, 4 visible, 4 past the edge.
- No focusable element sits inside either track, so keyboard users cannot reach
  them either. The hint "Scroll to move through the work" still shows and is
  now a lie.

Suggested fix, under `@media (prefers-reduced-motion: reduce)`: wrap the
tracks (`flex-wrap: wrap; width: auto`), make the viewports `overflow:
visible`, give `.project` a `calc(50% - 11px)` width at 900px+, and hide the
hint.

**This is a gap in my own testing, not just theirs.** My reduced-motion check
only looked for elements left at `opacity: 0`. It never checked whether
content was reachable, so it passed a page where two thirds of the work
section is unreachable.

## Serious

| # | What | Measured | Where |
|---|---|---|---|
| S1 | Reduced motion: the finished-house photo never appears (`opacity: 0` at every stop, alt text still exposed while invisible), and the tour drops to 1 room of 12 while the caption still says "keep scrolling" | — | `site.css:281`, `site.js:445`, `site.js:517` |
| S2 | Below 900px the tour shows one room; its counter fails on the bright first photo | 1.14:1 | `site.css:362`, `site.js:517` |
| S3 | Header nav and wordmark over photos — the bar is 72% opaque so photos show through | 3.80–3.97:1 nav, 2.84–2.98:1 wordmark sub | `dark.css` `.site-head`, `site.css:142` |
| S4 | Tour counter (10.24px) fails at every desktop tour position | 2.45–3.89:1 | `site.css:362` `.tour__copy .mark` |
| S5 | Tour sub-line | 4.10:1 desktop, 3.24:1 mobile | `dark.css` `.tour__sub` |
| S6 | Form field borders are the only visible edge of each field and nearly invisible (WCAG 1.4.11 needs 3:1) | 1.24:1 | `dark.css` `.field input/select/textarea` |
| S7 | "Phase 05" label sits on the finished-house photo | 1.67:1 | `dark.css` `.phase__no` |
| S8 | Hero measurement labels over bright sky and stone. The black halo I added helps visually but WCAG does not count a stroke | 1.02–1.57:1 | `dark.css` `.arch__marks text` |

Each has a concrete suggested value in the agent's report; S4 and S5 are
one-line colour changes, S6 is `border-color: #8b8599` (5.48:1), S7 and S8
want a backing plate rather than a colour change.

## Minor

- **M1** Hero fact labels over the violet glow: 4.26:1 and 4.48:1 against a
  4.5 threshold. Raising `--ink-faint` to `#9a93ab` fixes these and lifts every
  `.mark` on the page.
- **M2** Ghost button outline 2.78:1 (only matters if the outline is what
  identifies the control — the label is present, so marginal).
- **M3** Scrub plan annotations render at ~4.6px on mobile. True of the light
  version too.
- **M4** `aria-label` on a generic `<span class="stars">` is not reliably
  announced; needs `role="img"`.
- **M5** Tour room photos 1–11 are created by JS with `alt=""`.
- **M6** `<footer>` inside `<blockquote>` may expose as a landmark; use
  `<cite>`.

## Passes

21 tab stops, every one with a visible 2px orange focus ring (7.09:1), no
keyboard trap, no `outline: none` anywhere. All five form controls labelled.
One h1, no skipped levels, `lang="en"`. Zoom not blocked. All 46 images have
alt attributes. Reflow at 320px with no horizontal page scroll. Count-up
figures show their final values under reduced motion. Body copy, figure
labels, award rows, review text and contact copy all clear AA.

## Not covered

No real screen-reader run (NVDA/VoiceOver) — DOM and ARIA attributes only.
No Windows forced-colours, 200% desktop zoom, or text-spacing overrides.
Text-shadow was excluded from sampling, so shadowed text is measured
conservatively.

## Note on the light version

B1, S1 and S2 are reduced-motion and mobile-gating issues in `site.js` and
`site.css`, not in `dark.css`. **They almost certainly affect `index.html`
too.** Check both when fixing.
