# Emergency Plumbing Hero — the free package

Built from facts published on emergencyplumbinghero.com and their Google listing on 2026-10-25.
Everything here runs at no cost to Tom or to us.

```
index.html   the new site, with the chat agent built in
prompts/     the four compiled agent prompts
```

The review page is not in here on purpose. It is one page for every client, served by the app at
`/review.html?c=emergency-plumbing-hero&id=<customer>`, and it reads their details from the same
profile as everything else. One page means one place to fix it.

## Why this business, in one paragraph

Tom answers brilliantly when he can answer at all. His reviews say "answered after the second ring"
at 3am and "here in 15 minutes, with a broken leg". The one bad review, six months old, says the
opposite: "a no show... would not answer their phones would not answer text messages", and the
customer went to a competitor the same day. Tom's own public reply explains it: he was on an
emergency, so the other job "became lower priority". He is not disorganised, he is one van. That is
the gap the agent closes, and it is the only thing it needs to do.

## Say it this way, not that way

One of his five-star reviews contains a warning worth more than any script:

> "I called the first plumber that google showed, and after realising I was talking to a digital
> person, I hung up."

Then she found Tom and he saved her bathroom at 3am.

So do not sell him a robot that answers his phone. Sell him this: **the message gets taken while he
is under someone's sink, with the address and the problem already captured, and his phone rings with
a job ready to go.** The agent discloses that it is automated the moment anyone asks, which is both
honest and the thing that stops the hang-up.

## Put it live (about 20 minutes)

1. **Site.** Drag `sites/emergency-plumbing-hero/` onto netlify.com/drop.
2. **Form.** Free key from web3forms.com, then `<script>window.WEB3FORMS_KEY = "...";</script>`.
   Until it is set the form tells people to call rather than failing silently.
3. **Chat agent.** Deploy `app/` and set `window.AGENT_API` to it. Set `ALLOWED_ORIGINS` to his
   domain once he has one.
4. **Email speed-to-lead.** `production/gmail-speed-to-lead.gs` on *his* Google account, with
   `prompts/emergency-plumbing-hero-email.md` pasted into `BRAIN`. Leave `REVIEW_MODE = true` the
   first week.
5. **Review page.** Already live at the app. Send one link per customer with `&id=<their id>`.

## Before anything reaches a real customer

- [ ] Tom confirms the service list and that he is genuinely 24/7
- [ ] Open the Google review link once and confirm it lands on *his* review box
- [ ] Confirm he is happy for his Google reviews to be quoted on the site
- [ ] Ask for a street address, years trading, and whether he publishes any price at all
- [ ] One test lead end to end with the email agent in drafts mode
- [ ] Send yourself the review link and tap 2, then tap 5

He publishes no prices anywhere, so the agent quotes none. It says Tom confirms the price before
work starts, which is what his own reviews say he does.

## What is free and what is not

Free: site, hosting, form, chat agent, email speed-to-lead, booking sheet, review page.
Not free: SMS review requests (1 to 3 cents a text plus A2P 10DLC under his brand) and a phone
receptionist (about $15/month plus a number). Those are the conversation after he has seen the free
five working.
