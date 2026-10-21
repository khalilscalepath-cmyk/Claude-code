# Speed-to-Lead: respond to every new lead in under 60 seconds

## Lead sources to wire in
Website form · Google Local Services Ads (LSA) leads · Google Business Profile messages ·
Facebook lead ads · Angi / HomeAdvisor / Thumbtack (forward their lead emails to a parser
inbox) · Yelp requests.

## Flow
```
New lead arrives
  └─▶ within 5s: SMS  "Hi {{first_name}}, it's {{BUSINESS_NAME}}, got your request for {{service}}.
                      Is now a good time for a quick call, or would you like to pick a time? {{booking_link}}"
  └─▶ within 30s: AI voice call (Vapi/GHL Voice AI outbound) → qualify → book
  └─▶ notify owner/tech (SMS + CRM)
  └─▶ no answer: SMS again at 5 min, call at 1 h, SMS next morning 8:30
  └─▶ booked → stop sequence, send confirmation + reminder 24h/2h before
```

## Build options
- **GHL/Hexona:** Workflow trigger *Form Submitted* / *Facebook Lead Form* / *Inbound Webhook* →
  SMS → Voice AI outbound call action → wait → if/else on appointment booked.
- **Make.com:** Webhook/Email parser (Angi, Thumbtack lead emails) → Twilio SMS → Vapi
  `POST /call` (outbound with the client's assistant) → Google Sheets/CRM.

## Pitch line
"You already pay for these leads. Right now they wait hours for a call back and half of them hire whoever
called first. This makes you the one who calls first, every time, including 10pm."
