# Offer Playbook: match the problem to the service

The lead engine scores each business for each offer and writes the reasons. Use this table to
pick what you pitch and how you open.

| What the evidence shows | Lead with | Price (from operating guide) | Opening line on the call |
|---|---|---|---|
| Closed evenings/weekends, after-hours complaints, "Emergency" in name but goes dark at night | **After-Hours Voice AI** | $1,500–2,500 setup + $597–997/mo | "What happens right now when someone's AC dies at 9pm on a Saturday and calls you?" |
| Reviews: rings out, voicemail, "never called back" | **Missed-Call Text-Back** (often bundled free into Voice AI to close) | Bundle / add-on | "When your guys are on a job and the phone rings, who gets it?" |
| Web form with no chat, runs Google/Meta ads, on Angi/Thumbtack, "took days to get a quote" | **Speed-to-Lead** | Add-on or part of flagship | "How fast does someone call back a new web lead today, honestly?" |
| Two or more of the above, decent size (30–600 reviews) | **Full Lead Recovery (flagship)** | $2,000–3,000 setup + $997–1,497/mo | "Let's add up where jobs are leaking: after hours, during jobs, and web leads." |

## The full Growth Team: 7 AI employees (bundle)
From JP Middleton's video: selling one fix plugs one hole in a leaky bucket, so the result is
small, the fee is small and the client cancels. Selling the connected system plugs every hole.
Each "employee" is a part we already build:

| # | AI employee | What it does for the owner | How we build it |
|---|---|---|---|
| 1 | Web developer | Fast, phone-first site that turns visitors into calls | `local-business-website` |
| 2 | Outreach specialist | Texts the old customer list and unsold quotes, books them back in | `database-reactivation` + `leadengine reactivate` |
| 3 | Reputation manager | Asks every customer for a rating and a Google review, alerts owner on bad ones, referrals | `client-delivery-agents` |
| 4 | Lead responder | Answers every web/ad/Angi lead in under a minute, follows up until booked | `client-delivery-agents` (speed-to-lead) |
| 5 | Receptionist | Answers calls 24/7, missed-call text-back, books, reminds, reschedules no-shows | `voice-receptionist` + text-back template |
| 6 | Sales coach | Role-plays with CSRs and techs, scores their recorded calls weekly | `sales-coach` |
| 7 | Marketing director | Runs lead ads to a landing page, hands every lead to #4 | `ads-funnel` |
Reporting ties it together: `weekly-client-report` shows each employee's numbers every week.

**Rollout (don't launch all 7 on day 1):**
- Week 1, stop the leaks: receptionist + text-back (#5), lead responder (#4).
- Week 2, quick win: reactivation (#2) and reputation manager (#3). Bookings in days prove it works.
- Weeks 3–4: website (#1) if theirs is slow (show the PageSpeed score before and after).
- Month 2: ads (#7), only once 4 and 5 are answering every lead.
- Month 2–3: sales coach (#6), once there's call volume to review.

**Price (starting points to test, not market data):** $3,500–5,000 setup + $1,997–2,997/mo.
Ad spend is paid by the client straight to Meta. Each extra location of the same owner is cloned
from the first: about $500–1,000 setup + $500–900/mo. That's why franchise and multi-location
owners are the best fit (see "Franchise owners" in `lead-signals`).
Payment: 50% of setup upfront, 50% at go-live of week 1, monthly from go-live.

**Who it's for:** 10+ techs, already spending on marketing, or several locations. Smaller shops
get one or two employees from the table above. Never pitch all 7 to a 2-truck shop.

## Diagnosis call (20 min): diagnose → quantify → present
1. **Diagnose (8 min):** How many calls a day? Who answers after 5pm and on weekends? What happens
   to voicemails? How fast are web leads called back? Do you pay for leads (Angi, LSA, ads)?
2. **Quantify (5 min):** Do the math out loud with *their* numbers:
   `missed calls/week × 40% booking rate × average ticket × 52`.
   Let them say the number. Don't argue it up.
3. **Present (5 min):** Show the demo you already built (call it on speaker). Offer the
   package that matches what they just told you, not the biggest one.
4. **Close (2 min):** Performance-partner framing: "If it doesn't recover at least the monthly fee
   in booked jobs within 60 days, you can walk." Only offer that if you're happy to honour it.

## Outreach compliance (protects your sending domain and you)
- US cold email (CAN-SPAM): real sender name, a physical mailing address in the footer, a
  working opt-out, honour opt-outs within 10 business days, and no misleading subject lines.
- Never quote a customer's review back at the owner by name or verbatim in a cold email. The
  generated emails describe the pattern softly on purpose.
- The AI receptionist must say it's an AI if asked (it's in the prompt template), and the
  client must have SMS consent/A2P registration for text-back.
- Warm up new domains 2–3 weeks in Instantly/Smartlead and stay under ~30–50 sends/inbox/day.
