---
name: sales-coach
description: Build and run the AI sales coach for a home-service client (AI employee #6): role-play practice for CSRs and technicians, and scored reviews of their recorded booking calls and in-home sales visits, with a weekly team scorecard. Also coaches Khalil on his own discovery calls. Use when asked about call coaching, CSR training, booking rate, "my team can't close", role-play, reviewing a recorded call or transcript, objection practice, scoring calls, or "how did my sales call go".
---

# AI sales coach (AI employee #6)

From JP Middleton's "7 AI employees" video (role-play + review of live calls), adapted to home
services. The point: we can fill the calendar, but if the person answering the phone can't book,
or the tech can't explain a replacement, the money still leaks. Most small shops never train
their staff. This trains them every day, for a fraction of a sales trainer.

## Where the money is in home services
| Who | The moment | What "good" looks like |
|---|---|---|
| CSR / office | Inbound call or text | Books the call. Gets name, address, problem, best time. Handles "how much is it to come out?" without losing them |
| Technician | On site, after diagnosis | Explains options (repair vs replace, good/better/best), offers the maintenance plan, asks for the job |
| Comfort advisor / owner | Replacement estimate | Sits down with all decision makers, shows financing, follows up unsold estimates |

Key number to track for CSRs: **booking rate** = booked calls ÷ calls that could have booked.

## Setup (pick one)
- **Claude Project per client (simplest):** knowledge = their price book or service-call fee,
  memberships, financing, service area, hours, the scripts below. Staff use it from their phone.
- **Call review automation:** recordings from GoHighLevel / ServiceTitan / their phone system →
  transcribe (Fish Audio `speech_to_text`, or the platform's own transcripts) → review prompt
  below → scorecard to the owner each week.
- Recording calls: callers must hear a "this call may be recorded" notice. Several states require
  everyone's consent (e.g. California, Florida, Pennsylvania, Washington, Illinois). Customers and
  staff should know calls are reviewed for training.

## Role-play prompt
> You are a practice customer for {Business}, a {trade} company in {city}. Play ONE of these at
> random unless I pick: (1) AC out in 100° heat, price-shopping, asks "how much just to come out?";
> (2) older homeowner, polite but wants to "think about it"; (3) got a $9,000 replacement quote
> from a competitor, wants yours cheaper; (4) water heater leaking, panicked, wants someone now;
> (5) tenant, landlord pays, unsure who to bill. Stay in character. Be realistic: interrupt,
> hesitate, raise the objections real customers raise. Don't make it easy. When I type "SCORE",
> step out of character and grade me with the scorecard below, quote my best and worst lines,
> and give me the one sentence I should have said instead.

## Call review prompt (for transcripts)
> Review this {CSR/technician} call transcript for {Business}. Score each 0–2 with a short reason:
> 1) warm greeting with business + own name; 2) got the customer's name and used it; 3) understood
> the problem and urgency; 4) collected address and callback number; 5) answered price questions
> honestly using {price rules} without losing the caller; 6) asked for the booking (or the job);
> 7) handled the main objection; 8) confirmed time window and next step; 9) offered the
> maintenance plan where it fit. Total /18. Then: the moment the call was won or lost (quote it),
> 2 specific fixes with exact wording, and whether this was a missed booking. Be direct, kind and
> specific. No generic advice.

## Weekly scorecard to the owner
Per person: calls reviewed, average score, booking rate, the most common miss, one clip worth
sharing with the team. Put it in the `weekly-client-report`. Praise publicly, correct privately.

## Use it on yourself
Paste the transcript of your own discovery call and ask for a review against the `discovery-call`
flow (rapport → frame → problem → goal → current state → bridge → urgency → pitch → close).
Role-play prompt for practice: "Play a skeptical HVAC owner with 3 trucks who's been burned by a
marketing agency. Object to price, to 'AI', and to timing."

## Selling it
- Hook: "You're paying for calls. How many of them actually book? Let's listen to 5 together."
  Reviewing 5 of their real calls for free on the discovery call is the strongest demo you have.
- Pricing to test: add-on about $300–600/mo, or part of the full bundle.
- Don't promise a booking rate. Promise every call gets reviewed and every person gets feedback weekly.
