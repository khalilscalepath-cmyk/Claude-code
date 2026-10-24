# Outreach — Carmel Homes Design Group

Jamie Vaughn, owner. 602-348-2430. Scottsdale, AZ.

The frame is not "here is what is wrong with your site". It is: *this is what
happened when I went looking for you, so I built what I think you need, here
it is for free, you decide.* Jamie stays in control of every step. We never
ask for the sale, only for permission to show.

## What we actually know, and how sure we are

Verified 24 Oct 2026. Only use the first group in writing.

**Solid — checkable by anyone in under a minute:**

| Where | What it says |
|---|---|
| Homepage body text | "25 years of experience" |
| Homepage badge image | "Celebrating 35 Years In Business" |
| Houzz profile | "almost 24 years" |
| About page | since 1986, so 40 years |

Four different answers to the same question, on material they control. That is
the hook, and it is unarguable.

Also solid, for the call rather than the email: no contact form anywhere on
the homepage, pinch-zoom blocked on mobile (`maximum-scale=1.0` in the
viewport meta), 131 requests and 3.9 MB to load (the preview is 31 and
1.4 MB), and their own walkthrough video has 143 views since Dec 2017 — the
footage exists, nobody sees it.

**Dropped — could not verify honestly:**

`carmelhomesdesigngroup.com`, the website address on their Houzz profile,
returned `403 Forbidden — "Request forbidden by administrative rules"` to two
separate automated fetches. That wording is what a bot filter says, not what a
dead site says. Khalil's read is the right one: a real person on a real phone
may well see the site load fine, and I could not test that from here without
disguising an automated request as a human one, which is not something to do.

So it stays out of the email. If you want to know, open it on your phone. If
it genuinely fails for you, it goes back in and it leads — but say it only
once you have seen it with your own eyes.

(`carmelhomesllc.com` does work and redirects correctly. An early sandbox
result said otherwise and was wrong.)

## One thing to get right before you write

Carmel's own published testimonials refer to Jamie as "he" throughout — "Jamie
Vaughn and **his** team", "**He** is a perfectionist", "**his** 24 years of
experience". That is their own copy, not an assumption from the name. The
emails below avoid pronouns and address Jamie directly as "you", so nothing is
at risk in writing, but it will come up on the call.

## Email 1

> **Subject:** Quick question about Carmel Homes
>
> Jamie —
>
> I am hoping you can settle something for me. Your homepage says "25 years of
> experience", the badge on that same page says 35, Houzz says almost 24, and
> your About page says you have been designing and building here since 1986.
>
> Four different answers, and I could not work out which one you want people
> to believe.
>
> I ask because I have been putting together a demo of what a new Carmel site
> could look like — your photographs, your project names, your nine galleries
> — and I would rather have that line right than guess. I went with 1986:
>
> {link}
>
> It is free and there is nothing attached to it. Best on a phone. Have a look
> and tell me what I got wrong.
>
> Khalil

126 words. The question is genuine, it cannot be answered with silence, and it
casts Jamie as the expert settling something rather than a prospect being
sold to. "Tell me what I got wrong" is the real close — it makes replying
safe, and every correction is Jamie describing the site he actually wants.

## Email 2 — day 3

> Jamie — no pressure on this. The demo stays up either way:
>
> {link}
>
> Still curious which of those four numbers is the right one, though.

## Email 3 — day 7

> Jamie, last one from me — I am not going to keep emailing.
>
> The demo is yours to look at, pull apart or ignore: {link}
>
> If the timing is wrong, just say so and I will leave you to it.

Then stop. Three unless Jamie replies.

## When Jamie replies

**Do not send a price.** Send changes. The first reply is almost always a
criticism or a question — treat it as a brief:

> Good catch, give me today and I will have it changed.

Turn it around the same day. That is the moment it stops being our mock-up and
starts being their site, and it is worth more than any proposal.

### When Jamie asks what it costs

Only then, and be straight:

> Honestly — we are new. Scalepath is a small team and Carmel would be one of
> our first builds, which is why the demo was free and why the price is what
> it is. $300 to $400 covers the build. Hosting and maintenance we handle, and
> you can walk away whenever you like.
>
> If you would rather not be someone's early client, I completely understand.

Being new is only a weakness if we hide it. Said plainly it explains the
price, and offering them the exit is what makes the whole thing credible.

**A note on that number.** $300–$400 is very low for a firm quoting jobs at
$20,000 to $6,000,000 — low enough that it can read as amateur to a luxury
buyer rather than as a bargain. Worth considering a higher build fee with a
small monthly for hosting and changes; that reads as a working relationship
instead of a favour. Your call, and either is defensible — just go in knowing
the low number can cost credibility with this particular kind of client.

## Loom, 2 minutes

- **0:00** Their homepage on a phone. "I was trying to work out how long you
  have been doing this." Read the "25 years" line. Scroll to the badge that
  says 35. Open About and read "since 1986". Open Houzz: "almost 24." Say
  nothing else — four numbers in forty seconds makes the point on its own.
- **0:40** Cut to the demo. Scroll the process section once, slowly, in
  silence. This is the twenty seconds that earns the call.
- **1:10** The nine projects with their real photo counts. "These are your
  photographs, out of your own gallery. 349 of them."
- **1:35** Fill in the form, submit it, show the notification land.
- **1:50** "It is free, it is yours to pull apart, and if you hate it nothing
  happens. I just want to know which number is the right one."

## Where the demo lives

The `gh-pages` branch is the built site — `index.html` at the root next to
`assets/` and `vendor/`, plus a `netlify.toml` that sets the publish directory,
so there is nothing to type on a phone.

**In Netlify:** Add new site -> Import an existing project -> GitHub ->
`khalilscalepath-cmyk/Claude-code` -> set the branch to **`gh-pages`** ->
Deploy. The toml handles the rest.

Then **Site settings -> Forms -> Form notifications -> Email**, pointed at
whichever inbox should get the leads. Netlify picks the form up from the
`data-netlify` attributes in `index.html`, so submissions capture with no
backend, and the hidden `company` field is declared as the honeypot so bot
traffic never reaches the inbox.

GitHub Pages returned 404 because the Pages source is pointed somewhere other
than `gh-pages` — the branch itself is correct. Not worth chasing now that
Netlify is in play: Pages cannot capture the form anyway.

Whichever host, the page carries `noindex, nofollow` so it never competes with
Carmel's real site in search, and the preview disclosure stays in the header
and footer saying it is built by Scalepath, unaffiliated, and not the live
site.
