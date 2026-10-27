---
name: database-reactivation
description: Run a database reactivation campaign for a home-service client (AI employee #2, the "outreach specialist"): take their old customer list, unsold estimates and dead leads, clean and segment it, write the text campaign and the AI reply agent that books people back in, and do the money math. Use when asked about reactivation, a "dead lead" or old customer list, texting past customers, unsold estimates, a win-back or tune-up promo, "wake up their database", or a quick first win for a new client.
---

# Database reactivation (AI employee #2)

From JP Middleton's "7 AI employees" video, adapted from gyms to HVAC/plumbing/electrical.
Every owner has years of past customers and quotes nobody followed up. A short text campaign
with one good offer and an AI that answers replies books jobs within days, with no ad spend.
That makes it the best **first win** for a new client and the easiest thing to sell on its own.

## 1. Get the list (from the client)
Ask for an export from their CRM (ServiceTitan, Housecall Pro, Jobber, FieldEdge, QuickBooks)
or any spreadsheet. Useful columns: name, mobile, email, last service date, equipment install
year, estimate status/amount/date, do-not-text, SMS consent. More columns = better segments.

## 2. Clean and segment it (run the engine)
```bash
python -m leadengine reactivate --list export.csv --business "Emergency Air" --trade hvac \
    --ticket 350 --offer "a \$79 AC tune-up (normally \$149)"
```
Writes `out/reactivation-<business>/ghl_import.csv` (ready to import into GoHighLevel, tagged by
segment, 3 messages each) and `summary.md` (counts, skipped rows, unsold-estimate total, the math).
It fixes phone formats, removes duplicates, bad numbers, opt-outs and anyone marked "no consent".

| Segment | Why it works | Offer idea (client approves it) |
|---|---|---|
| Unsold estimate (last 24 months) | Already wanted the job | Honor the old price this month + free second look |
| Equipment 10+ years | Replacement is coming anyway | Tune-up / safety check that reveals the system's state |
| No service in 12+ months | Lapsed, still trusts them | Seasonal tune-up, drain clean, water-heater flush |
| Served in last 12 months | Happy and recent | Maintenance plan, or "bring a neighbour" referral |
| Enquired, never booked | Was shopping | Same promo, softer tone |

Lead with the **unsold estimates**. Their dollar total in `summary.md` is the number that gets the owner's attention.

## 3. Compliance (non-negotiable; protects the client and you)
- Only text people who gave the business their number (work orders, booking forms, invoices) and
  haven't opted out. If the client can't say how numbers were collected, call or email instead.
- The client's number must be **A2P 10DLC registered** in GoHighLevel/Twilio before any send.
- Every first message identifies the business and says "Reply STOP to opt out". STOP, "remove",
  "unsubscribe" and similar replies are honoured at once, permanently.
- Send 9am–7pm in the customer's time zone (some states are stricter), not Sundays or holidays.
- No fake scarcity ("only 3 spots left") unless it's true. The offer must be one the client honours.
- Have the client sign off on the list, the offer and the 3 messages in writing (email is fine).
This is general guidance, not legal advice. Texting rules change. Tell the client to check with
their own adviser if they're unsure.

## 4. Send it (GoHighLevel)
Import `ghl_import.csv` → workflow per segment tag: Message 1 now → wait 2 days, no reply →
Message 2 → wait 3 days, no reply → Message 3 → end. Any reply stops the workflow and hands the
conversation to the AI reply agent. Send 100–200 a day so the team can absorb the bookings.

## 5. AI reply agent (GHL Conversation AI or a Base44 agent)
> You are the booking assistant texting for {Business}, a {trade} company in {city}. People are
> replying to this offer: {offer}. Your goal is a booked appointment. Be warm, brief (1–2 sentences),
> and sound like the office, not a robot. Ask one question at a time: what's going on with the
> system, the service address, then offer two times from the calendar {calendar}. Confirm the
> booking with date, time window and address. Prices: only quote {offer}; for anything else say a
> tech will confirm on site. If they ask whether you're a person, say you're {Business}'s automated
> assistant and a team member can call them. If they're upset, have an emergency (no heat, gas
> smell, flooding, sparks) or ask for a human, stop and alert {owner phone} at once. If they say
> STOP or "not interested", reply once politely and never message again.

Reminders: 24h and 2h before the visit. No-show: one text the same day offering a new time.

## 6. Report the result
Track per segment: sent, replies, booked, showed, revenue (from the client's CRM). Put it in that
week's `weekly-client-report`. Say the numbers plainly, including if a segment did nothing.

## Selling it
- On the discovery call: "How many past customers and old quotes are sitting in your system?"
  Then do the math out loud: `list size × 5–12% book × average ticket`. These are assumptions to
  show the size of the opportunity, not a promise. Say it that way.
- Pricing to test: as a standalone sprint, about $500–1,500 flat, or $0 setup + $50–100 per booked
  job. In the full bundle it is the first thing you run, to prove the system in week 1.
- Easiest cold opener: "You already have a list of people who trust you. I can turn it into booked
  jobs this month without spending on ads."
