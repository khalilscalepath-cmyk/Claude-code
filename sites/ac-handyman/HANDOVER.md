# A/C Handyman — the free package

Everything here runs at no cost to Bradley or to us. Built from facts published on
air-conditioning-arizona.com and his Google listing on 2026-10-25.

```
index.html      the new site, with the chat agent built in
prompts/        the four compiled agent prompts
```

The review page is shared by every client and served by the app at
`/review.html?c=ac-handyman&id=<customer>`, reading its details from the same profile. One page
means one place to fix it.

## What this replaces

His current site has a 2008 copyright, no booking form, no chat, and does not lay out on a phone.
Everything in the new one is his own copy, his own prices and his own customers' words. Nothing is
invented. The one number on the page, $99.95, is the one he publishes himself.

## Put it live (about 20 minutes)

**1. The site.** Drag `sites/ac-handyman/` onto netlify.com/drop. Free, instant, HTTPS. Rename the
project to `ac-handyman`. His domain can point at it later, after he says yes.

**2. The form.** Create a free account at web3forms.com (250 submissions a month, no card), add the
access key to the page:

```html
<script>window.WEB3FORMS_KEY = "paste-it-here";</script>
```

Until that key is set the form tells people to call instead of failing silently. Submissions land
in whatever inbox he gives Web3Forms.

**3. The chat agent.** Deploy `app/` (see `app/README.md`) and point the site at it:

```html
<script>window.AGENT_API = "https://<your-deploy>/api/agent";</script>
```

It answers from `brains/clients/ac-handyman.json`. Change a price there and the site, the email
agent and the phone agent all change together.

The site and the API sit on different domains, so the API sends CORS headers. Once his domain is
known, set `ALLOWED_ORIGINS` on the deploy to that domain instead of leaving it open.

**4. Email speed-to-lead.** `production/gmail-speed-to-lead.gs`, installed on *his* Google account.
Paste `prompts/ac-handyman-email.md` into `BRAIN`, add a free Groq or Gemini key and the sheet id as
script properties, run `setup()`. **Leave `REVIEW_MODE = true` for the first week** so it drafts and
he sends. Bookings append to a Google Sheet he owns.

**5. The review page.** Served by the app, already compliant, see below. It needs a logger URL
before it can tell him who rated what:

```html
<script>window.TRACK_URL = "https://<your-deploy>/api/review";</script>
```

Send one link per customer: `/review.html?c=ac-handyman&id=<their id>`.

## The compliance line, and why it is drawn where it is

On 1 to 3 stars the page apologises, offers Bradley's call, and **still shows the Google review
link**. It does not hide it, delay it, or ask the customer to hold off.

Hiding it would be review gating. Google removes gated reviews in bulk, which would retroactively
erase every result this system ever produced for him. The page is built so that cannot happen, and
it should not be "improved" later by someone who thinks filtering the unhappy ones is the point.

Never offer anything in exchange for a review. Never draft the words of one.

## Before anything is sent to a real customer

- [ ] Bradley confirms $99.95 and 5am to 7pm are still current
- [ ] Open the Google review link once and confirm it lands on *his* review box
- [ ] Confirm the four quoted reviews are his and he is happy to keep using them
- [ ] His Gmail connected, `REVIEW_MODE` on, one test lead sent end to end
- [ ] Send yourself `review.html?c=test` and tap 2, then tap 5

## What is free and what is not

| Piece | Runs free |
|---|---|
| Site, hosting, HTTPS | Yes, Netlify free tier |
| Request form | Yes, 250/month |
| Chat agent on the site | Yes, free LLM tier |
| Email speed-to-lead + booking sheet | Yes, Apps Script on his account |
| Review page | Yes |
| **Review and reactivation by SMS** | **No.** 1 to 3 cents a text, and A2P 10DLC registration under *his* brand |
| **Phone receptionist** | **No.** About $15/month plus a number |

The free five are the handover. The two that cost money are the conversation after he has seen the
first five working.

## One thing to get right on the call

His bad review is three years old and his good ones praise his speed: "called at 7:00 am, showed up
at 8:30", "called early Sunday, air was cold by 10". He is not slow and he is not careless. He is
one man who cannot answer the phone with his hands inside a condenser. Say it that way. If this
sounds like a critique of how he runs his shop, the call is over in the first minute.
