---
name: voice-receptionist
description: Create the after-hours AI voice receptionist for a specific HVAC, plumbing or electrical business: system prompt, first message, knowledge base, booking and SMS actions, and test calls, for GoHighLevel/Hexona Voice AI or Vapi. Use when asked to build, set up, write or test a voice agent, AI receptionist, answering agent, after-hours line, call bot, or "the demo" for a prospect or client.
---

# Voice receptionist (Scalepath main offer)

## Inputs (from lead research or the client)
Business name, trade, city + service area, hours, emergency policy, services, diagnostic/trip
fee (if they publish one), booking calendar, on-call tech's mobile number.

## Build
1. Start from `templates/voice-ai/after-hours-receptionist.md`. Fill every {{FIELD}}; nothing left in braces.
2. First message: "Thanks for calling {Business}, this is the after-hours line. Is this an
   emergency, or would you like to schedule service?"
3. Knowledge base: services, service area, hours, fees, brands, warranty. Only verified facts;
   unknowns become "I'll have the owner confirm that first thing in the morning."
4. Actions: `book_appointment` (name, callback number, address, issue, is_emergency,
   preferred_time) → calendar; `notify_tech` SMS with a one-line job summary.
5. Safety: gas smell → leave the home and call the gas company/911 first; sparks/smoke → 911 first.
6. Must say it's an AI if asked. Never quotes exact prices or promises arrival times outside the calendar.
7. Keep answers short: if asked "what do you do?", name at most 3 services in one sentence, then steer
   to booking (Hamza's demo listed 30 services on the first try). Fix the prompt by pasting the bad
   transcript back with "it did X, it should do Y" and re-test.
8. Schedule: two windows, 5pm–midnight and midnight–8am (plus weekends), so it never touches daytime
   calls the office answers.

## Test (before any prospect hears it)
Run these 6 calls and fix anything that fails:
emergency no-AC at 9pm with infant · routine tune-up on Saturday · price shopper · wrong number /
spam · caller who won't give an address · caller asking "are you a robot?".
Pass = correct triage, details read back, booking created, tech SMS correct, no invented facts.

## Platforms
- GoHighLevel/Hexona: sub-account → Voice AI → paste prompt → Prompting Advisor → knowledge base
  → actions (Book Appointment, Send SMS) → after-hours schedule → test calls.
- Vapi: `python -m leadengine demo --lead <folder> --live` (needs the PRIVATE key), or paste into the dashboard.
