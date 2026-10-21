---
name: lead-signals
description: Find and score US home-service businesses (HVAC, plumbing, electrical, roofing) that are publicly losing jobs to missed calls, unreturned calls, after-hours gaps, slow quotes or a bad/missing website. Use when asked to find leads, prospects, businesses to contact, build a lead list, research a company for outreach, or check whether a business needs Scalepath's services, e.g. "find plumbers in Houston who miss calls", "is this HVAC company a good prospect", "build me 20 leads in Phoenix".
---

# Lead signals (Scalepath)

Goal: a short list of REAL businesses with PUBLIC evidence of a problem we fix. Quality over volume:
test 10–12 first, then scale (Patrick Dang's rule).

## Signals and points
| Signal (must have a source URL) | Points | Fixes it |
|---|---|---|
| Review/complaint: no answer, voicemail, "rings and rings" | +25 each (max 50) | Missed-Call Text-Back |
| Review/complaint: never called back, waited days for a quote | +20 each (max 40) | Speed-to-Lead |
| Review: after hours / weekend / "left for the day" / "until Monday" | +25 | After-Hours Voice AI |
| Review: "went with another company" | +20 | Full Lead Recovery |
| Claims 24/7 or "emergency" but evidence says calls go unanswered | +20 | After-Hours Voice AI |
| Closed weekends or closes by 6pm (Google hours) | +10 | After-Hours Voice AI |
| No website, or website fails the audit (no mobile layout, no HTTPS, © 5+ yrs old, no tap-to-call) | +15 | Free website + receptionist |
| Pays for leads (Google ads tag, LSA, Angi/HomeAdvisor/Thumbtack listing) | +10 | Speed-to-Lead |
| 15–600 Google reviews (owner-operated sweet spot) | ×1.0 | |
| Franchise or 1,500+ reviews (likely has a call center) | ×0.4 | |

## Process
1. Search with the trade + city + complaint wording ("never called back", "no answer", "voicemail")
   on BBB, Google reviews, Yelp, Angi, HomeAdvisor. Use the `leadengine` script when API keys exist
   (`python -m leadengine run --trade plumber --city "Houston, TX"`).
2. For each candidate, confirm it is still operating and find its website, phone and hours.
3. Score with the table. Keep only 40+.
4. Output a table: business, trade, city, score, top signal (quote ≤ 25 words), source URL,
   recommended offer, website status (Good / Dated / Bad / None), first-line opener.

## Rules
- Never invent a business, a quote, a review count or a URL. If you can't verify it, leave it out.
- Don't put reviewer names in the output.
- Quotes are for OUR research. Outreach describes the pattern softly and never pastes a review
  back at the owner.
- Flag anything older than 18 months as "dated evidence, verify".
