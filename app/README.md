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
