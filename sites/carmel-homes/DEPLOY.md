# Putting this preview somewhere Jamie can open it

The claude.ai artifact link is private to Khalil's account. A prospect cannot
open it, so the preview needs a real URL before it goes out.

Everything in this folder is static except `server/server.py`. That shapes the
two options below.

## The form has two ways out

`assets/js/site.js` tries them in order, with no configuration:

1. **`POST /api/lead`** — `server/server.py`. Validates the lead, appends it to
   `server/leads.jsonl`, then notifies. Use this where we control the backend.
2. **A urlencoded POST back to the page** carrying `form-name`. This is how
   Netlify captures a submission with no backend at all; the `data-netlify`
   attributes on the form are what switch it on.

If neither exists, the caller is shown the phone number and told plainly that
nothing sent. That is deliberate — a form that silently drops a lead costs
Jamie the job.

## Option A — Netlify (recommended for the first send)

No server, no credentials, free, about five minutes.

1. Push this repo to GitHub (already done).
2. netlify.com → **Add new site** → **Import an existing project** → pick the
   repo.
3. Build command: leave empty. Publish directory: `sites/carmel-homes`.
4. Deploy. The site gets a `*.netlify.app` URL immediately.
5. **Site settings → Forms → Form notifications → Add notification → Email.**
   Point it at whichever inbox should receive leads.

Submissions then land in the Netlify dashboard under **Forms → lead**, and an
email goes out on each one. The honeypot is already wired: `netlify-honeypot`
on the form names the hidden `company` field, so Netlify drops bot traffic
before it reaches the inbox.

To use a custom domain later: **Domain settings → Add a domain**.

## Option B — a host that runs Python

Use this when the lead needs to reach Jamie by SMS as well, or when the leads
file has to live somewhere we control.

```bash
python3 server/server.py --port 8077
```

It serves the static files and `/api/lead` from one process, so no separate
web server is needed. Put it behind nginx or Caddy for TLS.

### Environment variables

Nothing below is required. Each channel that is not configured reports itself
as skipped and the lead is still written to `server/leads.jsonl`, so a missing
credential never loses a lead.

**Email**

| Variable | Notes |
|---|---|
| `LEAD_NOTIFY_EMAIL_TO` | Where leads go. Required for email. |
| `SMTP_HOST` | Required for email. |
| `SMTP_PORT` | Defaults to 587. STARTTLS is always attempted. |
| `SMTP_USER`, `SMTP_PASS` | Omit for an unauthenticated relay. |
| `SMTP_FROM` | Defaults to `LEAD_NOTIFY_EMAIL_TO`. |

For Gmail, `SMTP_PASS` must be an app password, not the account password.

The lead's own address is set as `Reply-To`, so replying in the mail client
goes to the caller rather than to the website.

**SMS**, through Bird:

| Variable |
|---|
| `LEAD_NOTIFY_SMS_TO` |
| `BIRD_API_KEY` |
| `BIRD_WORKSPACE_ID` |
| `BIRD_SMS_CHANNEL_ID` |

SMS is the one worth having. A text beats an email for a contractor who is on
site all day, which is the whole reason the lead was being missed.

## What is verified, and what is not

Verified here:

- A real lead posts, validates, normalises the phone to E.164, and appends to
  `server/leads.jsonl`.
- A filled honeypot returns the same `200 {"ok": true}` a real submission gets,
  stores nothing and pages no one — so a bot has no signal to tune against.
- The email path, against a local SMTP sink: STARTTLS negotiated, message
  delivered, `Reply-To` set to the caller.
- Per-IP rate limiting trips at the cap.

Not verified, because it needs an account we do not have:

- Bird SMS. The request is built to Bird's documented message endpoint and
  failures are caught, but no live send has been made.
- Netlify form capture. The markup follows Netlify's documented form
  attributes; it cannot be exercised until the site is deployed there.

## Before this goes to Jamie

The preview disclosure in the header and footer says it is built by Scalepath,
is not affiliated and is not the live site. Leave it in place until Jamie
engages. It is the honest framing and it is also what makes the cold email
easy to write.
