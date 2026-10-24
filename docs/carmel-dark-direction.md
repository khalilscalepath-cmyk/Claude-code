# Second design direction for Carmel — the "expensive product launch" look

**Status: not started. Build when Khalil says go.**

Queued 2026-10-24 from a 45-second TikTok Khalil sent
(@jackroberts___). Watched locally with `tools/watch-video.py`, frames and
audio both.

## What the video actually is

The same clip that started this whole project. Its argument: *do not let Claude
build your website unless you give it GSAP, Lenis and React Bits, or it will
look like slop.* We already build with all three.

So the ask is not the tools. It is **the example sites he uses to show what
"a designer created it" looks like** — and those are a different world from
the cream Skyline page Carmel has now.

## The look being pointed at

From the frames, the sites shown are Zentry, aether1.ai and Rejouice —
Awwwards-shelf product launches. What they have in common:

- **Near-black grounds.** Deep navy and violet-black, not grey. The page reads
  as a dark room with one lit object in it.
- **One hero object, lit and rotating.** Zentry's particle bloom, aether1's
  earbuds floating over a glowing wireframe. The product is the only bright
  thing on screen.
- **Enormous display type, letter-spaced tight**, often split across the
  object so the words sit behind and in front of it — "REDEFINE / REALITY"
  with the bloom between the two words.
- **Thin neon hairlines and measurement marks** over the object: crosshairs,
  callout leaders, little labelled ticks. Technical drawing as decoration.
- **Section-to-section, the whole viewport changes**, rather than content
  scrolling past a fixed background.

## Why it is a real option for Carmel, and where it fights them

**For it.** Carmel sells "we build the impossible house on the mountainside."
Dark and cinematic suits that better than cream-and-serif does, and the
process scroll we already built — slab, walls, frame, roof, glass assembling in
3D — is *exactly* the hero-object move those sites make. We have the mechanism
already. It just currently runs on paper instead of in a dark room.

**Against it.** Those are product launches for one object. Carmel's value is
349 photographs of nine finished houses. Go too dark and the photography — the
actual asset — gets buried. The first dark version of this page had that
problem and it is why we moved to paper.

**The likely answer:** dark ground for the hero and the process scroll, where
the 3D model and the line work can glow, then open out to light for the work,
the tour and the contact. One transition, deliberately, rather than a dark
page with light patches.

## Other thing from the video worth keeping

At 0:28 he names a fourth resource, **21st.dev** (the transcript mishears it as
"21st.gov") — a component marketplace in the same vein as React Bits. Not used
yet. Worth a look when this gets built, under the same rule we applied to React
Bits: read the licence, port the component rather than pulling a dependency,
and write down every deviation from upstream.

## What this needs before anyone starts

1. **A decision from Khalil** on how far the dark goes — whole page, or hero
   and process only.
2. A second artifact and a second Netlify deploy, so both versions live at the
   same time on real links. The point is to show Jamie two and let him pick;
   that is the same "you are in control" move the outreach uses.
3. The current cream version is not thrown away. It stays deployed.

## What it must not break

- Every photograph, project name, photo count, licence number, rating and
  quote stays sourced. No new claims, and quotes keep the names Carmel
  publishes them under.
- The preview disclosure stays in the header and footer.
- `noindex, nofollow` stays.
- Reduced-motion still gets a static page.
