# Front Desk — the app

Four agents (text, email, phone, reviews) on one brain, running on a **free** LLM key. Nothing
here touches a Claude or Anthropic account.

## Run it on your laptop (2 minutes, no signup beyond the key)

```bash
cp app/.env.example app/.env     # paste ONE free key into it
node app/server.js               # http://localhost:8787
```

Get a free key from whichever is quickest:
- **Groq** — console.groq.com/keys — fastest replies, best for the phone agent
- **Gemini** — aistudio.google.com/apikey — biggest daily allowance
- **OpenRouter** — openrouter.ai/keys — backup

Set more than one and they're tried in order, so a rate limit falls through instead of failing.
Free-tier limits move around; if a model name stops working, override it in `.env` (see the
example file) rather than editing code.

## Put it online, free

The whole thing is static files plus two tiny functions. Any of these work:

| Host | How |
|---|---|
| **Vercel** | `npx vercel` in the repo root. `app/api/*.js` become functions automatically. Add the key under Settings → Environment Variables. |
| **Netlify** | Point the publish directory at `app/public` and the functions directory at `app/api`. Add the key under Site settings → Environment variables. |
| **Cloudflare / Render / Fly** | Run `node app/server.js` as the start command; set `PORT` and the key as env vars. |

Never put the key in the front end. It only ever lives on the server, which is the whole reason
`api/agent.js` exists.

## The console

`/console.html` is the part we own instead of renting. It answers one question: **what came in,
and what needs a human.**

```bash
echo 'CONSOLE_TOKEN=some-long-random-string' >> app/.env
node app/server.js            # http://localhost:8787/console.html
```

Everything the agents capture lands in it automatically: a booking from any channel, a hand-off to
a human, a website enquiry, and a 1-3 star review, which raises an escalation on its own because an
unhappy customer is a job for a person rather than a row in a table nobody opens.

Records live in `data/*.jsonl` on the server, one JSON object per line, appended never rewritten.
No database, no dependency, and you can read it with `cat` when something looks wrong. It is the
right size for a few hundred records per client per month; the shape maps onto Postgres unchanged
when a client outgrows it.

`CONSOLE_TOKEN` gates every console read and write. Without it set, the console API refuses
everything, because these are real customers' names, addresses and phone numbers. Set it before the
app is reachable from the internet.

## The client's own page

Each client gets a read-only page of their week at `/client.html?c=<slug>&k=<key>`. Ask the server
for the link:

```bash
curl -H "x-console-token: $CONSOLE_TOKEN" "http://localhost:8787/api/client-link?client=<slug>"
```

The key is derived from `CONSOLE_TOKEN`, not stored, so there is no key table to leak and rotating
the token revokes every client link at once. A client's key only opens their own client: used
against another slug it returns 401.

The page follows `skills/weekly-client-report`: one line, the numbers, what is worth a look, and
what happens next. Anything the system does not measure says **"not tracked yet"** rather than
showing a zero or a plausible guess, because a client who catches one invented number stops
believing the other six. Revenue stays "not tracked yet" until `average_ticket` is set on the
client profile, and it is always labelled estimated with the ticket shown.

## What this is not

It is not GoHighLevel, and it is not trying to be. GHL is a CRM plus pipelines, funnels, email and
SMS infrastructure, call tracking, workflows and white-label billing. More to the point, the
expensive part of GHL is not its software: it is the carrier cost of sending SMS and owning phone
numbers, and that bill arrives whoever writes the interface. Rebuilding GHL saves the subscription,
not the per-message cost.

What is worth owning is this: the capture, the record, and the one screen that says what needs you.

## One deploy, many clients

Profiles live in `brains/clients/<slug>.json` — the same file `brains/compile.py` uses, so the app
and the production prompts can never drift. Open `?c=<slug>` to load one:

```
http://localhost:8787/?c=northside-hvac
```

To add a client: write their profile, reload. Nothing else.

## What this is and isn't

It **is** the real web chat agent — point a client's site at this and it answers their customers.
It is also the demo you drive on a sales call, and unlike the artifact version, a prospect can
open the link themselves and it just works.

It **isn't** the phone line or the SMS channel. Those need a telephony provider and, for SMS,
A2P 10DLC registration under the client's own brand. The Phone tab here types instead of dialling;
it proves the brain, not the carrier.
