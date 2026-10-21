# APIs & MCPs to Add (and How)

**Rule of thumb:** APIs do the bulk work (scraping, enriching, sending) through the lead engine
script, which costs a few dollars per city and **zero Claude tokens**. MCPs let Claude operate your tools
directly in chat (build a Vapi agent, update a GHL sub-account, read a website) for the
one-off, judgment-heavy steps.

## Priority 1: add these first

| What | Why we need it | Cost (check current pricing) | Get it here | Where it goes |
|---|---|---|---|---|
| **Google Places API (New)** | Every HVAC/plumber/electrician in a city: phone, website, hours, rating, 5 reviews. This is the backbone of the lead engine. | Pay-per-request with a free monthly tier; a 60-business city run costs cents to a few dollars (the `reviews` field is in the pricier Enterprise+Atmosphere SKU) | Enable: [console.cloud.google.com → Places API (New)](https://console.cloud.google.com/apis/library/places.googleapis.com) → Credentials → Create API key → restrict it to Places API. Docs: [developers.google.com/maps/documentation/places/web-service](https://developers.google.com/maps/documentation/places/web-service/overview) | `.env` → `GOOGLE_PLACES_API_KEY` |
| **Outscraper** | Full Google review history (Places only gives 5). The "never called back" complaints are usually in the 1–3★ reviews, and the engine pulls those first (`--review-sort lowest_rating`). | Pay-as-you-go, free tier to start | [app.outscraper.com](https://app.outscraper.com/) → Profile → API key. Docs: [app.outscraper.com/api-docs](https://app.outscraper.com/api-docs) | `.env` → `OUTSCRAPER_API_KEY` |
| **Vapi** | Build an "I already built you a demo" AI receptionist per prospect from the generated prompt, in one command. Cheaper per minute than GHL at volume. | Per-minute usage | [dashboard.vapi.ai](https://dashboard.vapi.ai) → API Keys (private key). Buy one phone number to use as your shared demo line and copy its ID. | `.env` → `VAPI_API_KEY`, `VAPI_DEMO_PHONE_NUMBER_ID` |
| **Hunter.io** | Owner/office emails from the business's domain when the website doesn't show one | Free tier: small monthly quota | [hunter.io/api-keys](https://hunter.io/api-keys) | `.env` → `HUNTER_API_KEY` |

## Priority 2: delivery and outreach

| What | Why | Get it here |
|---|---|---|
| **GoHighLevel / Hexona API** (Private Integration Token) | Create sub-accounts, contacts and workflows (missed-call text-back, speed-to-lead) without clicking | In the client **sub-account**: Settings → Integrations → Private Integrations → create token with contacts, conversations, calendars, opportunities scopes. Also copy the Location ID. Docs: [marketplace.gohighlevel.com/docs](https://marketplace.gohighlevel.com/docs/) |
| **Instantly.ai** (or Smartlead) | Cold email sending + warm-up. The engine writes `instantly_import.csv` with subject/body/follow-ups as custom variables. | [instantly.ai](https://instantly.ai) → Settings → Integrations → API. Docs: [developer.instantly.ai](https://developer.instantly.ai) |
| **Twilio** (only if not using GHL's phone system) | SMS for missed-call text-back via Make/n8n | [console.twilio.com](https://console.twilio.com) → Account SID + Auth Token. For US business texting you **must register A2P 10DLC**, or messages get blocked. |
| **Make.com** | Glue for speed-to-lead (form → SMS in 60s → CRM) per your doc | [make.com](https://www.make.com) → Profile → API access |

## MCPs: let Claude operate the tools directly

Run these in **Claude Code on your own computer** (terminal). For the Claude desktop/web app, add them
under Settings → Connectors (custom connector → paste the URL).

```bash
# 1. Apify: thousands of ready scrapers (Google Maps reviews, Facebook pages, Yelp, Instagram comments)
claude mcp add --transport http apify https://mcp.apify.com
#    sign in via browser on first use, or add: --header "Authorization: Bearer <APIFY_TOKEN>"
#    Token: https://console.apify.com/settings/integrations

# 2. Firecrawl: turns any client website into clean text for the voice-AI knowledge base
claude mcp add firecrawl -e FIRECRAWL_API_KEY=fc-YOUR_KEY -- npx -y firecrawl-mcp
#    Key: https://www.firecrawl.dev/app/api-keys   Docs: https://docs.firecrawl.dev/mcp-server

# 3. Vapi: create/edit voice agents, buy numbers, read call logs from chat
claude mcp add vapi -- npx -y @vapi-ai/mcp-server
#    browser sign-in on first use (or set VAPI_TOKEN). Docs: https://docs.vapi.ai

# 4. GoHighLevel / Hexona: check HighLevel's docs for their official MCP first;
#    community servers use the same Private Integration Token + Location ID:
#    https://github.com/tenfoldmarc/ghl-mcp  (read the code before giving it your token)
```

Already in your stack per the operating guide: **Gmail, Google Calendar, Google Drive, Notion,
Calendly**. Note: in this cloud session, the Notion, HubSpot, Airtable, Slack and other marketing
connectors **failed to connect** (the network proxy refused them). They're configured, but this
environment's network policy is blocking them. Same fix as below.

## Letting me run all of this for you in the cloud session

This cloud environment's network blocks almost everything except Google APIs. That's why I
couldn't open the YouTube video or scrape sites directly. To let me run the full pipeline here:

1. Open the environment menu in the session's title bar → **Edit** → **Network access**.
2. Either pick a broader access level, or under **Allowed domains** add:
   `api.app.outscraper.com`, `api.hunter.io`, `api.vapi.ai`, `api.instantly.ai`,
   `api.firecrawl.dev`, `mcp.apify.com`, `api.apify.com`, `services.leadconnectorhq.com`,
   `www.youtube.com`, `youtube.com`. Keep "Allow package managers" ticked.
   Docs: <https://code.claude.com/docs/en/cloud-environments#network-access>
3. Add your API keys as **environment secrets** (same Edit screen), using the variable names in
   `.env.example`. Don't paste keys into chat.

`places.googleapis.com` already works here, so once `GOOGLE_PLACES_API_KEY` is added I can run
real city scans immediately.

## What each tool replaces (token savings)

| Instead of Claude... | Use | Saves |
|---|---|---|
| Searching the web business by business | Places API + Outscraper via `leadengine run` | ~all research tokens; one command does 60 businesses |
| Reading websites to write knowledge bases | `leadengine` (auto) or Firecrawl MCP | Website text is extracted locally |
| Writing each cold email | Template engine in `leadengine/outreach.py` | Personalised from evidence at no LLM cost |
| Clicking through Vapi/GHL to build demos | `python -m leadengine demo --live` or Vapi MCP | Minutes per demo |
