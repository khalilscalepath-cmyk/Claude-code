# Carmel Homes Design Group — website preview

An unsolicited rebuild of [luxuryhomebuildersscottsdale.com](https://luxuryhomebuildersscottsdale.com/),
built as the door-opener for Scalepath. Nothing here is affiliated with Carmel Homes, and the page
says so in the header and the footer.

**Client:** Carmel Homes Design Group, LLC — Jamie Vaughn, designer/builder, Scottsdale AZ.
**Why them:** real pedigree, broken shopfront. See *The audit* below.

```bash
python3 server/server.py --port 8000     # site + lead endpoint
node tools/check.js                      # browser checks at 390px and 1366px
python3 -m pytest ../../tests/test_carmel_server.py -q
```

---

## The audit: why this business needs it

Jamie has a magazine cover and a Builder of the Year award. His website is representing him with
SEO-vendor spam. Everything below was verified against live pages in October 2026.

| Finding | Evidence |
|---|---|
| Hero and service imagery is stock, uploaded Dec 2019 | every `service-*.jpg` under `/wp-content/uploads/2019/12/` |
| Contact page untouched since Dec 2019 | `article:modified_time` = `2019-12-13` |
| Logo file is a free background-remover's output | `Logo-removebg-preview.png` |
| Social share card is an AI-generated image | `og:image` = `ChatGPT-Image-Oct-1-2025-at-02_59_57-PM.png` |
| Every image alt is keyword-stuffed | "…crafted by luxury home builders Scottsdale" on all of them |
| Meta description carries a 50-keyword block and a link farm | blogspot, weebly, tumblr, buzzfeed, pearltrees, quora, 500px, behance |
| h1 renders at 30px | computed styles; body copy is 18px, so the headline is barely larger |
| 349 photographs of real work shown at 240×160 | NextGEN gallery thumbnails |
| **Two different websites** | `luxuryhomebuildersscottsdale.com` and `carmelhomesdesigngroup.com` (listed on Houzz) |
| **Two different addresses** | AZ **85258** on their site, AZ **85050** on Houzz |
| **Three different tenure claims** | "25 years" (home), "almost 24 years" (Houzz), "since 1986" and "close to 30 years" (about) |

The last three are the ones to lead with on a call. Inconsistent name/address/phone across listings
splits their local SEO, and a buyer comparing three builders will notice the maths does not add up.

## Verified facts used on the page

From Carmel's own site and their Houzz profile. Nothing on the page is invented.

| Fact | Value | Source |
|---|---|---|
| Owner | Jamie Vaughn, designer/builder | about-us |
| Designing and building in the Valley since | 1986 | about-us |
| Phone | 602-348-2430 | contact-us, Houzz |
| Office | 7702 E Doubletree Ranch Rd, Suite 300-C, Scottsdale AZ 85258 | contact-us |
| Hours | Mon–Fri 8:00am–4:00pm, appointments outside | contact-us |
| Licence | Arizona ROC #214294 | Houzz |
| Typical job cost | $20,000 – $6,000,000 | Houzz |
| Rating | 5.0 from 3 reviews (quality, communication, value all 5.0) | Houzz |
| Areas served | Phoenix, Scottsdale, Paradise Valley, Arcadia, Carefree, Rio Verde, Gainey Ranch | about-us, Houzz |
| Projects in their gallery | 9 named, 349 photographs | project-gallery |
| Awards | Luxury Home Magazine cover Oct 2016; Custom Builder "Builder of the Year" (Desert Resort); Phoenix Home & Garden Grand Tour of Homes; Fox 10 Parade of Homes; Business Journal front page "Outdoor Living"; Exceptional Properties "Kiss of Class" | about-us, Houzz |
| Client quotes | Fernando, Ernesto Reyes | testimonials |

### Confirm with Jamie before this goes live

- **Years in business.** Three different numbers across his own properties. Pick one.
- **Award dates.** Only the Luxury Home Magazine cover carries a date. The page says "year to confirm"
  on the rest rather than guessing.
- **Which address and which domain** are current, then make them match everywhere.
- **Photographs.** The page ships with line drawings, not photos. See below.

## The media still to drop in

Two placeholders, both deliberate, both labelled on the page.

1. **Project photos.** Their archive has 349. `assets/img/` is empty because
   `luxuryhomebuildersscottsdale.com` is blocked by this environment's network policy. Until then each
   project card draws an illustrative SVG elevation. Drop real images in and reference them from the
   `.project__frame` in `index.html`.
2. **The scroll-scrubbed walkthrough.** The process section is wired to play a frame sequence against
   scroll position. Produce it from Carmel's own footage:

   ```bash
   tools/build-frames.sh <video-file-or-url> 72 1280
   ```

   Jamie's walkthrough is on his YouTube channel ("Luxury Remodelers in Scottsdale AZ",
   `watch?v=xUe9ZmMqNok`). The script writes `assets/frames/` and rewrites `manifest.json`; the page
   picks it up on next load with no code change. While the manifest is empty the floor plan draws
   itself across the same scroll distance, so the section works either way.

## How it is built

Single page, no build step, no external requests at all — fonts, scripts and styles are vendored
into the folder, so it drops onto any host and there is no Google or CDN dependency.

| Library | Version | Used for |
|---|---|---|
| [GSAP](https://gsap.com) + ScrollTrigger + SplitText | 3.13.0 | headline reveal, the elevation drawing itself, scroll scrubbing, pinning, the horizontal work track |
| [Lenis](https://github.com/darkroomengineering/lenis) | 1.3.11 | smooth scroll, driving ScrollTrigger from one clock |
| [React Bits](https://reactbits.dev) (MIT, David Haz) | ported | `CountUp` for the figures, `DotGrid` behind Jamie's section |
| React + ReactDOM | 18.3.1 | mounting the two React Bits components |

`assets/js/reactbits.js` follows the documented React Bits prop APIs exactly, with two differences
noted at the top of the file: `React.createElement` instead of JSX so no bundler is needed, and GSAP
drives the animation instead of pulling in `motion` as a second runtime.

**The signature move** is the drawing. Jamie's own differentiator is that he draws the house *and*
builds it ("I'm a designer/builder. That's a big deal."), so the hero elevation and the process floor
plan draw themselves line by line as you scroll. Hide the logo and the page could only be this
business.

Reduced motion is honoured throughout: Lenis is not started, pins become static sections, the phases
stack and the counters land on their final values.

## Back end

`server/server.py` — standard library only, matching the rest of this repo. Serves the site and
accepts the form at `POST /api/lead`.

- Validates name and phone, normalises phone to E.164, rejects malformed email, falls back to
  "Something else" for an unknown service type, truncates long messages.
- Appends every accepted lead to `leads.jsonl` **before** notifying, so a dead notifier never costs a lead.
- Rate limits to 8 leads per IP per 10 minutes.
- Notifies through whatever is configured, and reports per channel in the response. With nothing
  configured the lead is still stored and the visitor still gets a confirmation.

```bash
export LEAD_NOTIFY_SMS_TO=+16023482430      # Jamie's mobile
export BIRD_API_KEY=... BIRD_WORKSPACE_ID=... BIRD_SMS_CHANNEL_ID=...
export LEAD_NOTIFY_EMAIL_TO=office@...      # plus SMTP_HOST, SMTP_USER, SMTP_PASS
```

This is the hook for speed-to-lead: a $20k–$6M enquiry should reach Jamie's phone in seconds, not sit
in a WordPress inbox. That is the upsell the free website opens.

## Tests

- `tests/test_carmel_server.py` — 18 tests covering validation, storage, notifier failure and rate limiting.
- `tools/check.js` — drives a real browser at 390px and 1366px: no horizontal overflow, a tap-to-call
  link above the fold, tap targets ≥44px, pins measured against their real section positions, the
  phase swap, the counters, project cards actually on screen mid-track, the form submitted end to end,
  and a reduced-motion pass. It scrolls with the wheel rather than jumping, because jumping desyncs
  Lenis from ScrollTrigger and hides exactly the class of bug that shipped the work section blank the
  first time.
