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
| Franchisee-owned location (One Hour, Benjamin Franklin, Mister Sparky, Mr. Rooter, Aire Serv, Mr. Electric…) | ×1.0 + **MASTER KEY** flag | Full bundle |
| Company-owned brand (Roto-Rooter, ARS, Service Experts…) or 1,500+ reviews (likely a call center) | ×0.4 | |
| Retailer / home warranty (Home Depot, Sears, Frontdoor) | ×0 | not a prospect |

## Franchise owners (master-key clients)
From JP Middleton: franchise owners don't compete with each other, sit on advisory boards and
meet at conventions, so one happy owner tells the others. He got 200+ gym clients from one
Anytime Fitness owner with 12 locations. One win = a case study the whole network trusts.
1. Pick 1–2 franchise brands in the trade (HVAC: One Hour, Aire Serv; plumbing: Benjamin
   Franklin, Mr. Rooter; electrical: Mister Sparky, Mr. Electric).
2. Find the owners: the brand's Franchise Disclosure Document (FDD) lists current franchisees with
   location and phone. FDDs are public through state franchise registries (e.g. California
   DFPI, Wisconsin DFI, Minnesota CARDS). Prefer **multi-unit owners** (one owner, several territories).
3. Check the location: Google reviews for missed calls, and call after hours. If it rings a
   brand call center, lead with reactivation, reviews, sales coaching and ads, not the receptionist.
4. Find the owner on LinkedIn or the state business registry, then use `cold-outreach`. Mention
   other owners in the brand only with their permission.
5. Treat the first franchise client as a showcase: overdeliver, measure everything, ask for an
   intro to 2 other owners at day 60.

## Is the niche worth it? (Noah's 3-point filter)
1. Size: 50,000+ businesses in the US (HVAC ≈ 115k, roofing ≈ 135–166k).
2. High ticket: each customer job worth $500+ so a recovered job pays the retainer.
3. Proof of demand: other agencies already sell to them (search Facebook Ad Library for
   "more HVAC jobs", "plumbing leads"). Pick, then stop niche-hopping.

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
- Confirm size and website on 2+ sources (Yelp, BBB, the company's own site) before calling a lead
  "small" or "no website". One weak search missed a 300+ review company with its own site.
- Flag anything older than 18 months as "dated evidence, verify".
