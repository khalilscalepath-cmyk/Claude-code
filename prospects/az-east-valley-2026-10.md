# Lead list: Phoenix East & West Valley, October 2026

Pulled 2026-10-25 from Google Maps (Firecrawl `firecrawl-maps/businesses/search`), 60 businesses
across three searches: HVAC in Phoenix, air conditioning in Mesa, plumbing in Glendale, electrical
in Chandler. Reviews read with `businesses/reviews` sorted lowest-first, which is where the call
pain is written down.

**Open their listing and confirm the pattern is still there before you contact anyone.** These
notes are a filter, not a verdict.

## What the market looks like

The spread is the whole pitch. In Phoenix HVAC the leaders carry 33,966 (Parker & Sons), 14,551
(Goettl) and 13,507 (Semper Fi) reviews. A good small shop in the same city has 37. A homeowner
comparing two names on Google calls the one with more stars, almost regardless of the work. That
gap is visible to the owner the moment you show it to them, and it needs no argument.

## Top of the list: Emergency Plumbing Hero (Glendale)

Tom, owner-operated, AZ ROC #349522, Phoenix and the West Valley, 45 reviews at 4.9.

A 1-star edited six months ago:

> "on 3/31/26 they became flaky. A no show when they told me they'd be here between 10-2pm.
> **Would not answer their phones would not answer text messages.** ... I called another plumber the
> same day, and they arrived within 1/2 hour and did the same job at half the price."

And the owner's own public reply, which diagnoses the problem better than any pitch could:

> "The nature of our business prioritizes emergency calls and we were regretfully stuck helping make
> sure one of customers was able to have water to their home so **the hose bib you requested became
> lower priority**."

That is the owner stating in writing that when he is on an emergency, other customers fall off the
list. He is not disorganised, he is one van. His five-star reviews are the same fact from the other
side: "Tom answered after the second ring" at 3am, "here in 15 minutes and with a broken leg", "under
the sink leak at 8:00 pm, he drove right over". He answers brilliantly when he can answer at all.

He also replies to 90% of his reviews, which is the clearest buying signal on this list: he already
cares about reputation and already spends time on it.

**One warning, from his own reviews.** The 3am customer wrote: "I called the first plumber that
google showed, and after realising I was talking to a digital person, I hung up." Then she found
Tom. Do not pitch this as a robot answering his phone. Pitch it as the message getting taken and his
phone ringing with the detail already captured. And never let an agent pretend to be human, which is
exactly why the brain now discloses on the first ask.

Profile at `brains/clients/emergency-plumbing-hero.json`, package in `sites/emergency-plumbing-hero/`.

## Also built: A/C Handyman (Mesa)

Bradley, owner-operated, 17 years, AZ ROC #259312, 104 S Pomeroy, Mesa.

| Signal | What we found |
|---|---|
| Missed calls | A 1-star review reads *"I tried to contact twice and did not receive a call back"* |
| Review gap | 37 reviews against Semper Fi's 13,507 in the same city |
| Hours | 5am–7pm, seven days. Nothing after 7pm, and nothing published about emergencies |
| Website | Copyright 2008. No booking form, no chat, no mobile layout, testimonials pasted as plain text |
| Existing vendor | None found |
| Decision maker | Bradley answers his own phone — no gatekeeper to get past |
| Real prices published | $99.95 service call. One year warranty. A+ at the BBB |

He also has glowing reviews about *responsiveness* — "called him at 5:30pm and he was here by 7",
"called at 7am, showed up at 8:30". So he is not slow by nature; he is one person who cannot answer
while his hands are inside a condenser. That is precisely the problem the agents solve, and it is
worth saying to him that way rather than implying he is bad at his job.

Profile built at `brains/clients/ac-handyman.json`, compiled from his own published facts only.

## The lesson from RSB Electrical (disqualified)

RSB had the best pain evidence of anyone — ten 1-star reviews about the phone, two of them in the
last four months. On paper, a perfect prospect. Their website turned out to be newly rebuilt and
carrying a Chatwoot widget served from `gtlautomations.cloud`. **They already have an automation
vendor.** Walking in there is competing on price against an incumbent.

So the website check is not optional and it is not about the website. A recently rebuilt site, a
chat widget, a review widget or a tracking number means somebody got there first. Check it before
you spend an hour on research, not after.

**Caveat, and the reason this dropped to second:** his only call-pain review is three years old,
and his recent reviews are good. Showing an owner stale evidence loses the call in the first minute.
Build is done and keeps, but Emergency Plumbing Hero is the one to approach.

## What the second pass changed about the method

1. **Check the website before spending review credits.** A scrape is a fraction of the cost of a
   review pull and disqualifies faster. RSB cost an hour before this rule existed.
2. **Weight recency.** Three-year-old pain is not pain. The scoring column now records evidence age,
   and anything over about 18 months is a weak lead no matter how good the quote reads.
3. **A phone number on the website that differs from the Google listing usually means call
   tracking**, which usually means an agency. Red Mountain failed on this.
4. **No complaints is a disqualifier too.** Broggie Electric has a clean sheet across its ten lowest
   reviews. Nothing to fix means nothing to sell, however small their review count.

## Next

Proforce Plumbing is the only unresearched name left. Then widen: the same three searches in
Tucson, Chandler and Surprise would refill the list in about ten minutes.
