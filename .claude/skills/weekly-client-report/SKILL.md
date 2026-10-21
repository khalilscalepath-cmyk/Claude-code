---
name: weekly-client-report
description: Turn a Scalepath client's call logs, SMS logs, bookings and lead data into the weekly (or monthly) results report that justifies the retainer. Use when asked for a client report, weekly report, monthly report, results summary, ROI report, case study numbers, or "how did the system do this week" for an HVAC, plumbing or electrical client.
---

# Weekly client report

## Inputs
Call log (time, answered by AI/human, outcome), missed-call texts sent/replied, web leads with
first-response time, bookings with job value if known, the client's average ticket.

## Output: exactly these 4 sections, in this order, no intro or sign-off
1. **This week in one line** (≤ 2 sentences): e.g. "18 after-hours calls answered, 7 jobs booked,
   about $2,450 in work that would have gone to voicemail."
2. **Numbers** (table): after-hours calls answered · missed calls texted back · replies · web
   leads · median first response (seconds) · jobs booked · estimated revenue recovered
   (booked jobs × average ticket) · change vs last week.
3. **Worth a look** (≤ 3 bullets): calls that need a human callback, unhappy callers, odd patterns.
4. **Next week** (≤ 3 numbered actions): prompt tweaks, schedule changes, upsell opportunities.

## Rules
- Never invent numbers. Missing data shows as "not tracked yet".
- Revenue is always labelled "estimated" and shows the average ticket used.
- Keep it readable in 30 seconds on a phone.
- After 30 days, also produce a 3-line case study: before → after → result.
