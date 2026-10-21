# Missed-Call Text-Back: build + copy

## Build (GoHighLevel / Hexona)
1. Sub-account → Phone System → port or forward the client's number (or add a GHL number as a
   forward target when the main line goes unanswered after ~20s).
2. Automation → Workflow → trigger **Call Status = missed / no-answer / voicemail**.
3. Action: **Send SMS** (copy below) within 0 seconds, and only if the contact hasn't been texted in the last 2 hours.
4. Action: **Internal notification** to the owner/on-call tech with the caller's number.
5. Branch on reply → if reply contains a booking intent, send the booking link or hand off to
   Conversation AI. If there's no reply in 15 min during business hours, create a call-back task for the office.
6. US numbers: make sure the sub-account's **A2P 10DLC** registration is approved first, or carriers block the texts.

(Make.com + Twilio alternative: Twilio voice webhook "no-answer" → Make scenario → Twilio SMS → Google Sheet/CRM row.)

## SMS copy (pick one per client)

**Default**
> Hi, this is {{BUSINESS_NAME}}. Sorry we missed your call, our team is out on jobs. What can we help with? Reply here and we'll get you scheduled. (Reply STOP to opt out)

**Emergency-first (HVAC summer/winter, plumbing)**
> Hi, it's {{BUSINESS_NAME}}. We just missed your call. If this is an emergency (no AC/heat, water leak), reply URGENT and the on-call tech gets your message right away. Otherwise tell us what's going on and we'll book you in.

**After-hours**
> Thanks for calling {{BUSINESS_NAME}}! We're closed right now but you can still book. Reply with your address and what's happening, or call back to talk to our after-hours line 24/7.

## What to report to the client monthly
Missed calls caught · replies · jobs booked from replies · estimated revenue (jobs × avg ticket).
This report is what renews the retainer.
