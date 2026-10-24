# Outreach — Carmel Homes Design Group

Jamie Vaughn, owner. 602-348-2430. Scottsdale, AZ.

The standard Scalepath angle is missed calls after hours. It does not fit here.
Carmel is a design-build firm whose jobs run from $20,000 to $6 million, with a
sales cycle measured in months. Nobody picks a custom home builder off a
voicemail. The problem is the shopfront.

## What is actually wrong with their site

Measured once, 24 Oct 2026, on a simulated iPhone against
`luxuryhomebuildersscottsdale.com`. Each of these is visible to anyone and can
be repeated, so every line below is safe to put in an email.

| Finding | Theirs | The preview |
|---|---|---|
| Says how long they have been building | "25 years of experience" on the homepage, while the About page says since 1986 — which is 40 years | 1986, consistently |
| Contact form on the homepage | none | one, posting to a real endpoint |
| Pinch-zoom on mobile | blocked (`maximum-scale=1.0` in the viewport meta) | allowed |
| Requests to load the homepage | 131 | 31 |
| Page weight | 3.9 MB | 1.4 MB |
| `<title>` in Google results | duplicated: "…Carmel Homes Design GroupTop-Rated Scottsdale Luxury…" | single, clean |

One more, worth knowing but **not** worth putting in a cold email: the
homepage's `og:description` carries a block of keyword stuffing and links to
a dozen blogspot/tumblr/weebly pages, left behind by a previous agency. It
reads as spam to a search engine. Raise it on the call, not in writing — it
accuses someone they paid, and that is not how a first email should feel.

### The one to lead with

**"25 years" versus 1986.** It is specific, it is checkable in ten seconds, and
it is in Jamie's favour — they are underselling themselves by 15 years. It
cannot be mistaken for a mail merge.

Do not open with the speed numbers. A builder does not care about requests
and megabytes, and leading with them makes it a technical pitch instead of a
business one.

## Email 1

> **Subject:** Your site says 25 years. Your About page says 1986.
>
> Jamie —
>
> I was reading through your site and the homepage says "25 years of
> experience", while your About page says you have been designing and building
> here since 1986. That is 40 years. You are underselling yourself by 15.
>
> Two other things on the phone version: there is no contact form on the
> homepage, so every enquiry depends on someone deciding to ring you. And the
> page will not let you pinch to zoom.
>
> So I rebuilt it as a demo — your own photographs, your real project names,
> and a form that actually reaches you. Nothing to buy. I would rather show
> you than describe it.
>
> Want the link?
>
> Khalil

116 words. Ends on a question that takes one word to answer, and buys time to
get the preview onto a real URL before sending it.

## Email 2 — day 3

> Jamie — the demo is still up if you want a look. Open it on your phone, it
> is built for that first.
>
> {link}

## Email 3 — day 7

> Jamie, last one from me.
>
> You do not need a new site to win ten jobs. Your range runs from $20,000 to
> $6 million — one enquiry that would otherwise have bounced off the old page
> covers the whole thing several times over.
>
> The demo stays up either way: {link}
>
> If the timing is wrong, say so and I will stop.

Then stop. Three is the limit unless Jamie replies.

## Loom, 2 minutes

- **0:00** Their homepage on a phone. Read the "25 years" line out loud, then
  open the About page and read "since 1986". Say nothing else — let it land.
- **0:25** Scroll the homepage to the bottom. Point out there is nowhere to
  leave a name. Try to pinch-zoom and show that it does not.
- **0:45** Cut to the preview. Scroll the process section once, slowly. This is
  the part that takes 20 seconds and is the reason the call happens.
- **1:15** The nine projects, with their real photo counts. "These are your
  photographs, from your own archive. 349 of them."
- **1:35** Fill in the form, submit it, show the notification arriving.
- **1:50** "If it is useful, grab 15 minutes. If not, no hard feelings — the
  25 years line is worth fixing either way."

That last clause matters. It gives Jamie something free whether or not they
reply, which is the whole reason this gets opened.

## Before any of this goes out

The claude.ai artifact link is **private to Khalil's account**. Jamie cannot
open it. Deploy to Netlify first — `DEPLOY.md` has the steps — and send that
URL.

Leave the preview disclosure in the header and footer. It says the page is
built by Scalepath, is not affiliated and is not the live site. It is the
honest framing, and it is also what makes "I rebuilt it as a demo" land as
generous rather than presumptuous.

## If Jamie replies

The site is the icebreaker, not the offer. What Carmel plausibly needs beyond
it, in the order worth raising:

1. **The enquiry form going somewhere Jamie reads.** Already built. SMS is the
   channel that matters — a text beats an email for someone on site all day.
2. **A reply to first-contact enquiries.** For a job of this size the first
   useful thing is a qualifier: budget band, lot or existing house, rough
   timing. That can be a short form flow or a chat widget. It is not an
   after-hours receptionist; nobody commits to a $2m build at 9pm.
3. **The spam block in their meta description.** A cleanup with a visible
   before and after.

Do not lead with any of these. Lead with the thing they can see.
