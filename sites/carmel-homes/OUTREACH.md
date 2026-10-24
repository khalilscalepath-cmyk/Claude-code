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
| Says how long they have been building | three different answers: "25 years" on the homepage, "almost 24" on Houzz, and since 1986 (so 40) on the About page | 1986, consistently |
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

### The one to lead with — as a question, not a correction

There are **three different numbers** on their own material for the same thing:

- the homepage says "25 years of experience"
- the Houzz profile says "almost 24 years", and David Larchez's testimonial
  says "his 24 years of experience"
- the About page says they have been designing and building here since 1986,
  which is 40 years

Do **not** write "you have made a mistake". Ask which one is right, because
you are building something and do not want to get it wrong. That does three
things at once: it is impossible to answer with silence, it puts Jamie in the
position of the expert correcting us rather than the one being corrected, and
it reveals that something is already being built for them.

Everything after that is framed the same way. Jamie decides at every step:
decides which number is right, decides whether to look, decides whether to
keep it, decides whether we ever talk about money. We never ask for the sale,
only for permission to show.

Do not open with the speed numbers. A builder does not care about requests
and megabytes, and leading with them makes it a technical pitch instead of a
conversation.

## Email 1

> **Subject:** Quick question about Carmel Homes
>
> Jamie —
>
> I am hoping you can settle something. Your homepage says "25 years of
> experience", your Houzz profile says almost 24, and your About page says you
> have been designing and building here since 1986. Which should I be going
> with?
>
> I ask because I have been putting together a mock-up of what a new Carmel
> Homes site could look like — your own photographs, your own project names —
> and I would rather have that line right than guess at it.
>
> It is free and it is not a pitch. You look at it, you tell me what is wrong
> with it. If you do not want it, we bin it and that is the end of it.
>
> Want me to send it over?
>
> Khalil

117 words. Every sentence hands a decision to Jamie. The close asks permission
to show rather than permission to sell — and a one-word reply is enough, which
also buys the time to get the preview onto a real URL.

## Email 2 — day 3

> Jamie — no rush on this. The mock-up is sitting here whenever you want a
> look, and it is built for a phone first, so open it on one:
>
> {link}
>
> If you would rather I did not keep it up, say the word and it comes down.

## Email 3 — day 7

> Jamie, last one from me — I will not keep bothering you.
>
> The offer has not changed and there is nothing attached to it. Have a look,
> keep what you like, throw out what you do not. If any of it is useful you
> own it either way:
>
> {link}
>
> And if the timing is simply wrong, tell me and I will leave you alone.

Then stop. Three is the limit unless Jamie replies.

## If Jamie replies "send it"

Send the link and nothing else. No price, no deck, no list of what else we
could do. One line:

> Here it is — {link}. Best on a phone. Tell me what is wrong with it.

"Tell me what is wrong with it" is the whole play. It invites criticism, which
makes it safe to engage, and every piece of criticism is Jamie describing the
site they actually want. Let them design it. Money only comes up when Jamie
raises it, or on a call they agreed to.

If Jamie asks for changes, make them and send it back the same day. That is
the moment the relationship changes: it stops being our mock-up and starts
being their site.

## Loom, 2 minutes

Same frame. Curious, not corrective.

- **0:00** Their homepage on a phone. "I was trying to work out how long you
  have been doing this." Read the "25 years" line, then open About and read
  "since 1986". "So which is it? Because those are fifteen years apart."
- **0:25** "While I was in there I noticed a couple of other things." Scroll to
  the bottom — nowhere to leave a name. Try to pinch-zoom; show it does not.
  State it flatly, no editorialising.
- **0:45** Cut to the preview. Scroll the process section once, slowly. This is
  the twenty seconds that earns the call. Say nothing over it.
- **1:15** The nine projects with their real photo counts. "These are your
  photographs, out of your own archive. There are 349 of them."
- **1:35** Fill in the form, submit, show the notification land.
- **1:50** "That is it. It is free, it is yours to pull apart, and if you do not
  like it nothing happens. The years thing is worth fixing either way."

That last line matters. Jamie gets something whether or not they reply, which
is the whole reason this gets watched to the end.

## One thing to get right before you write

Carmel's own published testimonials refer to Jamie as "he" throughout — "Jamie
Vaughn and **his** team", "**He** is a perfectionist", "**his** 24 years of
experience", "**he** will not leave the job until you're 100% satisfied". The
About page is written in Jamie's own voice and never settles it either way, so
this is what their own site says, not an assumption from the name.

The emails above avoid pronouns entirely and address Jamie directly as "you",
which is what a cold email should do anyway. But it will come up on the call,
so worth knowing in advance. Getting it wrong on a first call is an avoidable
own goal.

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
