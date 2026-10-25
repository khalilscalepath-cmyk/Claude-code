# Scalepath Lead Recovery: Prospecting & Delivery Kit

Finds home-service businesses (HVAC, plumbing, electrical) that are **publicly losing jobs to missed
calls, slow callbacks and after-hours gaps**, scores them for Scalepath's 4 offers, and writes the
outreach and the demo for each one.

| Offer | Fixes |
|---|---|
| After-Hours Voice AI Receptionist | Nobody answers evenings/weekends |
| Missed-Call Text-Back | Calls ring out / go to voicemail during jobs |
| Speed-to-Lead | Web/ads/Angi leads wait hours for a callback |
| Full Lead Recovery (flagship) | Two or more of the above |

## What's here

```
docs/01-research-findings.md   Real businesses with documented call problems + market data + sources
docs/02-apis-and-mcps.md       Which APIs/MCPs to add, links, and exact setup commands
docs/03-offer-playbook.md      Evidence → offer → pitch, diagnosis-call script, compliance
prospects/tier-a-2026-10.csv   First 8 researched prospects (import to Notion/CRM)
templates/                     Voice-AI prompt, missed-call text-back, speed-to-lead flows
leadengine/                    The scanner (Python)
brains/                        One brain per client, compiled to four channel prompts
app/                           The four agents as a real app, on a free LLM key (node app/server.js)
production/                    Free 24/7 deployment (Google Apps Script)
docs/06-business-plan-review-first.md   Why we enter on reviews, what to charge, the ladder
```

## Build the agents for a client

```bash
python3 brains/compile.py --client northside-hvac --all --out out/northside/
```

Then run them: `cp app/.env.example app/.env` (one free Groq/Gemini/OpenRouter key) and
`node app/server.js`. One profile in `brains/clients/<client>.json` compiles to four prompts: text/WhatsApp booking,
email speed-to-lead, voice receptionist, and review + reactivation. Facts live in the profile,
reasoning in `brains/core-brain.md`; never hand-edit a compiled prompt. Full process, tests and
pricing in `skills/agent-suite`.

## Run the lead engine

```bash
pip install -r requirements.txt
cp .env.example .env          # add GOOGLE_PLACES_API_KEY at minimum
python -m leadengine run --trade "HVAC company" --city "Phoenix, AZ" --limit 60 --full-reviews 100
```

For each business it:
1. Pulls the Google Maps listing: phone, site, hours, rating, reviews (Places API).
2. Optionally pulls up to N more reviews, worst-rated first, where the complaints are (Outscraper).
3. Audits the website: 24/7 claims, booking widget, chat, forms, ad pixels, emails.
4. Scans reviews for pain: *no answer, voicemail, never called back, after hours, went with
   another company, slow quote*.
5. Scores all 4 offers, flags franchises/very large shops, and explains why.
6. Writes `out/<city-trade>/`:
   - `leads.csv`: ranked, with reasons and evidence quotes
   - `instantly_import.csv`: ready for Instantly/Smartlead (subject, body, 2 follow-ups)
   - `leads/<business>/email.md`, `voice_ai_prompt.md`, `knowledge_base.md`

Then build the demo for a hot lead:

```bash
python -m leadengine demo --lead out/phoenix-az-hvac-company/leads/<business>          # dry run
python -m leadengine demo --lead out/phoenix-az-hvac-company/leads/<business> --live   # creates it on Vapi
```

Or paste `voice_ai_prompt.md` into GoHighLevel/Hexona Voice AI → Prompting Advisor, and
`knowledge_base.md` into its knowledge base (steps 1–9 of the operating guide).

**Always read the evidence before emailing.** The score is a filter. You still decide who to contact.

## Tests

```bash
python -m pytest -q
```
