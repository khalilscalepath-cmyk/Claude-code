# Business Plan: Review-First Entry, Lead-Recovery Ladder

Built from Oliver Rasmussen's *Build & Sell Claude AI Agents* (2h course, Oct 2026) —
https://youtu.be/kyngnLF27bw — checked against what this repo already has.

**The one-line thesis:** Scalepath currently leads with its most expensive, highest-friction,
hardest-to-prove offer (voice AI, $1,500–3,000 setup + $997–1,497/mo) with zero case studies.
Lead instead with the cheapest offer whose proof is *publicly visible* — Google reviews — and use
it to buy the right to sell lead recovery later.

---

## 1. The need, stated properly

The video sells "AI agents". That's the product, not the need. Underneath it there are two
separate needs, and they are not equally good to sell first:

| | **Need A: the response gap** | **Need B: the proof gap** |
|---|---|---|
| What it is | Jobs die between a customer reaching out and a human replying (missed calls, after hours, slow forms) | Business never gets the call: 9 reviews vs a competitor's 2,431 |
| Who Scalepath sells today | This one | Nobody |
| Verifiable from outside? | Only by test-calling, or inferring from reviews | **Yes — anyone can count reviews on Google Maps in 5 seconds** |
| Needs client system access? | Yes: phone system, call forwarding, A2P, calendar | **No** — their own customer list and a hosted page |
| Time to visible proof | 1 recovered after-hours call (ambiguous, needs a dashboard to see) | **Reviews appear on their own Google profile in week 1** |
| Cost to deliver | Phone number + voice minutes + QA calls | **1–3¢ per SMS** |
| Owner's prior belief | "Robots will annoy my customers" | "More reviews = more calls" (already believed) |

Need B is the better front door on every axis that matters when you have no case studies. The
video's own highest-converting cold email is the review-gap comparison, and its cheapest offer
($300/mo) is the review agent — he just doesn't say out loud that this is *why* it works.

**Market size for Need B:** every home-service business with a Google profile and fewer reviews
than its top local competitor — which is, by definition, most of them. Unlike missed calls, you
never have to argue the problem exists. You screenshot it.

## 2. The strategic finding (the part that should change what you do)

The video's blunt argument, and it is aimed squarely at this repo's current pricing:

> "All the guys telling you to sell $2,000 to $5,000 retainers never had to *keep* a $2,000 to
> $5,000 retainer. They're 10 times harder to close... a lot of them cancel within the first
> months." — he productizes at $300–500/mo instead, and scales by client count.

`docs/05-team-plan.md` already admits the same squeeze from the other side: "at $500/mo two hires
eat most of the profit, so price at $1,000+/mo or reach 8–10 clients." Both are true, and together
they point one way: **the $1,000+/mo offer is the right rung 3, not the right rung 1.** Selling it
first means a long sales cycle, a demo that needs their phone system, and churn risk you can't
absorb before you have proof.

**Recommendation:** keep the Lead Recovery offers exactly as they are, but stop opening with them.
Open with a $300/mo product that is nearly free to deliver and proves itself in public.

## 3. The business

**Who:** US home-service businesses — HVAC, plumbing, electrical, roofing — 1–20 techs, with
(a) fewer Google reviews than their nearest competitor, and (b) a phone number that is answered
during the day. Owner-operated, owner answers the phone or their office manager does. Avoid
franchises and 300+ review shops (they have marketing agencies already).

**Why they say yes:** they are already losing the comparison on Google and they know it. The ask
is $300/mo, no setup fee, cancel any time, 30-day refund. The decision is small enough to make on
the first call without a committee.

### The ladder

Each rung is sold only after the rung below it is visibly working. This is the video's "upsell
ladder", fitted to the assets already in this repo.

| Rung | Offer | Price | Proof it needs | Repo asset |
|---|---|---|---|---|
| 0 | Free website preview (optional door-opener) | $0, then $500/yr hosting+SEO or $97/mo | None — pure gift | `local-business-website`, `sites/` |
| **1** | **Review & Reactivation Engine** | **$300/mo, no setup, 30-day refund** | **None — this is the entry** | **`review-engine` (new)** |
| 2 | Speed-to-Lead (web forms, missed-call text-back) | +$200/mo, or **$25–45 per booked appointment** | Rung 1 producing reviews | `client-delivery-agents` |
| 3 | After-Hours Voice AI | 14-day pilot $700–1,500 (refundable) → $300–700/mo per location | Rungs 1–2 trusted | `voice-receptionist` |
| 4 | Full implementation (quotes, invoices, follow-ups, dashboard) | $5,000–7,000 one-off, 7-day refund | They start asking "what else can it do?" | — |

The ladder is also a **capacity ladder**. Rung 1 is ~2–3 hours to build and ~20 min/month to run,
so one person can hold 20+ clients. Rung 3 needs QA test calls and ongoing tuning, so it caps at
a handful per builder. Don't sell rung 3 before rung 1 cash pays for a builder.

### What Rung 1 actually is

Three things, sent as the client (their name, their number), never as Scalepath:

1. **Post-job review request.** Job marked complete → wait 2h → SMS during business hours only
   (9am–7pm, no Sundays) → unique tracked link → star picker page → 4–5 stars routes to Google,
   1–3 stars routes to "the owner would like to call you first" **while still showing the Google
   link** (see §7 — this is the compliance line).
2. **Reactivation.** Happy past customers get a check-in at an interval set by trade: cleaning 30
   days, HVAC/plumbing/pest 90 days, roofing and dental 180 days (inspections and services, not
   a new roof). This books jobs from a list they already own — revenue attributable to you in
   month one.
3. **An agent behind the link**, so a reply like "while I have you, my other unit is making a
   noise" becomes a booking instead of a dead end.

Plus a past-customer backfill at launch: upload their stored customers, drip in batches of 10,
"it's {Owner} from {Business}, you had us out a while back and I'm trying to get better — how did
we do from 1 to 5?" That's the week-one spike that makes the $300 obviously worth it.

## 4. Unit economics (honest version)

Per client, per month, at ~80 completed jobs:

| Item | Cost |
|---|---|
| Review/reactivation SMS (~250 messages @ 1–3¢) | $4–8 |
| Reactivation drip (~300 contacts) | $5–9 |
| Phone number | $1–3 |
| LLM for agent replies (~200 conversations, ~4¢ each) | ~$8 |
| Review page hosting (Netlify/Vercel free tier) | $0 |
| **Variable cost per client** | **≈ $20–30** |

Shared, not per client: GoHighLevel $97–497/mo (all clients as sub-accounts), Claude subscription,
Firecrawl. At 10 clients: revenue $3,000, variable ~$300, GHL ~$300 → **gross ≈ $2,400/mo, ~80%
margin.** The video claims 95%; that ignores the platform and model bills. 80% is the number to
plan with.

**Blended path to ~$10k/mo** (conservative — assumes half the upgrade rate the video claims):

| | Clients | Monthly |
|---|---|---|
| Rung 1 @ $300 | 20 | $6,000 |
| Rung 2 @ +$200 (50% take it; video claims 70%) | 10 | $2,000 |
| Rung 3 pilots, 2/mo @ $1,000 | — | $2,000 one-off |
| **Total** | **20** | **≈ $10,000** |

Compare the current model: $10k/mo needs ~8 clients at $1,247/mo — fewer, slower, each one a
bigger loss when it churns, and none of them closeable today without a case study.

## 5. Acquisition engine, with realistic funnel math

Two channels, both evidence-first.

**A. Review-gap cold email** (the highest-converting angle in the video). Google Maps scrape →
enrich with each prospect's review count *and their top competitor's* → subject line is just the
company name → body states the comparison plainly and offers a built example. The full sequence
lives in `cold-outreach`; the sending infrastructure lives in `cold-email-machine`.

Realistic per 1 domain / 5 inboxes / 20 sends per inbox per day:

| Stage | Rate | Result |
|---|---|---|
| Sends per month (business days) | — | ~2,200 |
| Replies | 1–3% | ~33 |
| Meetings booked | ~20% of replies | ~7 |
| Showed up | 80% with the show-up system (§6) | ~5–6 |
| Closed on a $300 no-setup offer | ~1 in 3 | **~2 clients/mo** |

So: **one domain ≈ 2 clients/month ≈ $600/mo added, at ~$400/mo infrastructure.** Profitable from
month two and compounding, but it is not 20 clients in 90 days on its own. Three domains plus cold
calls gets you there.

**B. Cold calls from the same list.** Five-part script, and the rule that makes it work: **never
say "AI"** — describe the outcome. "I'm working on a project with HVAC companies in {city}" → no
pitch, just need-creating questions → "if we made sure those calls got picked up and booked, would
that even help?" → "mornings or afternoons?" → book 1–2 days out. ~1 in 20 dials becomes a meeting.
Free, and it's the right first task for the Hire 1 in `05-team-plan.md`.

## 6. The two mechanics worth stealing wholesale

**The show-up system** (claims 8/10 show rate; costs nothing):
1. Create the Google Calendar event with their email on it while on the phone, and have them
   confirm the time and time zone *out loud* so they open their calendar and accept.
2. 24h before (or a few hours, if same-day): **call with a research question** — "I'm building your
   demo, do you close Sundays?" Proves you're working and extracts commitment through reciprocity.
3. 2h before: "quick heads up, see you in 2 hours."
4. 5 min late: Calendar → **email guests** → "are you able to make it?" (they get a notification
   with the link, and it reads as you sitting there waiting).

**The consequence calculator** (replaces the repo's current quantify step for paid-lead clients):

```
cost per lead ÷ their pickup/booking rate = what they already pay per appointment
e.g.  $35 per lead ÷ 0.12 pickup  =  ~$290 per actual conversation
```

Then price visibly under it. On the recorded call he says "$300 a call is outrageous — we'd book
them for $60–70." That's the whole pitch: not a price, an arbitrage they can check. It also
unlocks per-appointment pricing for Rung 2, which has no revenue ceiling and is far harder to
churn than a flat retainer, because the client only pays when you produce.

Two more, both one line each:
- **Bait the "no" before closing.** Small business: "1 to 10, what would you rate this?" → under
  10 → "what would make it a 10?" = their real objection → "if we fix that, is it a 10?" Big
  company: **"what would make this a no?"** — pulls out budget, stakeholders and data-privacy
  objections while you can still answer them.
- **Never leave a meeting without the next one booked.** It sets a deadline even when money moved.

Payment: $1 card-on-file authorisation on the call ("it's not about the dollar, it's the
commitment") is what makes per-appointment billing possible at all. Put the per-appointment price
in the agreement so the card can be charged on performance. Buy-now-pay-later links for setup fees
≥$1,000 — you're paid upfront, they spread it, nobody chases invoices.

## 7. What can kill this business (the video is weak here — read this twice)

**Review gating is the big one.** Routing unhappy customers *away* from Google is a policy
violation, and gated reviews get wiped — which erases every result you ever produced for that
client, retroactively. The compliant design is the one in §3: 1–3 stars see the owner's "let me
call you first" message **and the Google link stays visible and clickable**. Never filter, never
block, never condition the link on the rating. (The video cites "292 million reviews removed this
year" — treat that as his figure, unverified. The policy is the part that matters, not the number.)

**Never incentivise a review.** No discounts, no free filter changes, no entry into a draw. That's
a straight violation and it's the easiest one to talk a client into by accident.

**SMS is the real legal exposure.** Everything in Rung 1 is text messaging to consumers:
- Register **A2P 10DLC under the client's brand**, not Scalepath's. The messages go out as them.
- Only to their own customers with an existing business relationship, from numbers the client
  actually has consent for. Never a purchased list.
- Identify the sender in message one, honour STOP immediately, business hours only, no Sundays.
- The existing compliance box in `cold-outreach` applies here too — inherit it, don't re-derive it.

**Single-platform risk.** GoHighLevel holds the workflows, the agent and the client data. Price it
in ($97–497/mo), keep an export of every client's contacts and workflow spec, and know the
cheap-stack alternative before you need it.

**The claims.** $1M+ sold, 1,000 members' first clients, $19k/mo from Instagram, 8/10 close rate —
all self-reported, in a video that funnels to a paid community and affiliate links (GoHighLevel,
Fish Audio, Blotato, Instantly, cotype.io). Take the mechanics. Don't repeat the numbers to a
prospect, and don't plan on his conversion rates — the ones in §5 are deliberately lower.

## 8. What I'd do differently from the video

- **Keep Scalepath's evidence discipline.** Oliver picks any dentist off Google Maps. This repo
  scores from review text and confirms the pattern on two sources first (`lead-signals`,
  `01-research-findings.md` and its own published correction). Combine: review-gap count for the
  cold email hook, evidence scan to decide who's actually worth a call.
- **Don't lead with WhatsApp.** It's his best demo but it needs a WhatsApp Business number, a
  Facebook profile and a Facebook business account — three things a US HVAC shop usually doesn't
  have. US entry channel is SMS; keep WhatsApp for the demo's visual impact only.
- **Fix the cost claims before quoting them.** He says a patient call costs "$2" and "2 cents" in
  the same breath. Defensible: Fish Audio at $15/mo ≈ 12 hours of talk ≈ $0.02/min, so a 3-minute
  call is well under $0.25 all-in including the model. Use that.
- **Human-in-the-loop for the first two weeks**, which he recommends and then skips. Draft the
  replies, have the client's office approve them, then switch to autopilot. It's also how you
  learn the trade's real objections.
- **Keep the free website as a door-opener, not a product.** The repo already builds these in ~8
  minutes. It costs nothing, it's the easiest "yes" in the business, and `local-business-website`
  already exists — but it isn't what pays.

## 9. First 90 days

**Days 1–14 — one real client, free.**
Pick the best lead already in `prospects/tier-a-2026-10.csv`. Build the full Rung 1 engine for them
at no charge in exchange for permission to use the numbers. Backfill their past customers in week
one. Target: reviews visibly up and at least one reactivation job booked. That is the case study
the current $997/mo offer has never had.

**Days 15–45 — make it repeatable, then sell it twice.**
Run everything through `review-engine` so a new client is ~2 hours. Stand up one cold email domain
with five inboxes (`cold-email-machine`) and start the review-gap sequence at 100/day. Cold call
the same list. Target: 2 paying clients at $300/mo and the show-up system used on every booking.

**Days 46–90 — stack, then climb.**
Add a second and third domain. Target 8–10 clients on Rung 1. Offer Rung 2 only to clients whose
review count has visibly moved, priced per booked appointment with the consequence calculator.
Sell one Rung 3 pilot at $700–1,500 to the happiest client. Expected exit: ~$3,000–3,500/mo
recurring plus setup cash — real revenue, a case study, and an engine that stacks.

**Decision gate at day 90:** if Rung 1 holds 8+ clients at <30 min/month each, hire the lead-gen
assistant from `05-team-plan.md` and keep stacking. If each client is eating hours, the product
isn't productised yet — fix that before selling another one.
