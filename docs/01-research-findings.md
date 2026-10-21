# Research Findings: Who Actually Needs Scalepath (October 2026)

All of this comes from public sources found through web search. Every prospect below
links to the page where the evidence appears. **Before you email anyone, open their
Google Maps reviews and confirm the pattern is still current.** The lead engine in this repo
(`python -m leadengine run ...`) does that check automatically once your API keys are in.

---

## 1. The market pain (what to quote on calls)

| Data point | Number | Source | How solid |
|---|---|---|---|
| Home-service calls missed (CallRail 2025 benchmark) | ~14% | via [ainora.lt summary](https://ainora.lt/blog/hvac-service-call-statistics-2026) | Vendor data, method not disclosed |
| Home-service calls missed (Invoca platform data) | ~27% | via [HiGrovi 2026 report](https://www.higrovi.com/blog/contractor-missed-call-report-2026) | Vendor data |
| Missed-call rate weekday vs weekend (ServiceTitan call tracking, as cited) | 18% weekday / 41% weekend | via [ainora.lt summary](https://ainora.lt/blog/hvac-service-call-statistics-2026) | Second-hand citation |
| Calls that become booked jobs (ServiceTitan 2022) | Plumbing 43%, Electrical 41%, HVAC 38% | via [ainora.lt summary](https://ainora.lt/blog/hvac-service-call-statistics-2026) | Widely cited |

**Honest takeaway for the pitch:** "Most home-service shops miss somewhere between 1 in 7 and
1 in 4 calls, and it roughly doubles on weekends." Don't quote the 62% figures you'll see on
vendor blogs. They mix all small businesses together and an owner who checks will stop
trusting you.

**The math to use on a diagnosis call** (fill in their numbers):

```
missed calls / week  x  booking rate (≈40%)  x  average ticket  x  52
e.g. 10 missed  x  0.40  x  $350  x  52  =  $72,800 / year walking to a competitor
```

## 2. Where the pain shows up publicly (the signals we hunt for)

These phrases in reviews and complaints are what the lead engine scans for
(`leadengine/signals.py`):

| Signal | Example wording found in real reviews/complaints | Service it sells |
|---|---|---|
| Missed call / voicemail | "rings and rings and goes to voicemail", "called multiple times and left several voicemail messages" | Missed-Call Text-Back |
| No callback | "never received a call back", "still have not even called back" | Missed-Call Text-Back + Speed-to-Lead |
| After-hours gap | "told they all left for the day", "wouldn't come until Monday" | After-Hours Voice AI |
| Lost to competitor | "found a different plumber... they answered my call immediately" | Full Lead Recovery (flagship) |
| Paid leads going cold | Contractors on Angi complaining leads never connect ([ConsumerAffairs](https://www.consumeraffairs.com/online/angies-list.html)) | Speed-to-Lead |

The last row matters: contractors paying for Angi/HomeAdvisor/Thumbtack leads are already
spending money on leads and losing them to slow response. That's the easiest Speed-to-Lead sale.

## 3. Prospect list, first batch

**Tier A** = small or mid-size independent with a documented public call or callback
problem. These are the best fit: they feel the pain and have no call center.
**Tier B** = documented pain but large or franchise operation. They probably have a call center
or franchise contract, so they're a harder sale. Use them as case-study material, not first targets.

### Tier A: email these first (after verifying on Google Maps)

| # | Business | Trade / Location | Public evidence | Recommended offer | Source |
|---|---|---|---|---|---|
| 1 | **Emergency Air** | HVAC, Chandler AZ | BBB complaint (Jul 2026): customer was told staff "all left for the day" and then called "several times a day every day" with no response. Resolved later with refund. A company named *Emergency* Air going dark after hours in Phoenix summer is the exact pitch. | **After-Hours Voice AI** → upsell Flagship | [BBB](https://www.bbb.org/us/az/chandler/profile/air-conditioning-contractor/emergency-air-1126-1000033360/complaints) |
| 2 | **Air Max HVAC, Inc.** | HVAC, Burbank CA | Strong reputation (4.8 from ~422 ratings on Experience.com, 4.9/509 on ServiceMag) **but** a review says "I called multiple times and left several voicemail messages requesting service." Listings show **two different phone numbers** and conflicting Saturday hours. High demand plus leaking calls means they have budget and need. | **Flagship Full Lead Recovery** (volume business) | [BBB](https://www.bbb.org/us/ca/burbank/profile/heating-and-air-conditioning/air-max-hvac-inc-1216-100053065), [Experience.com](https://www.experience.com/reviews/air-22320705), [ServiceMag](https://servicemag.org/biz/air-max-hvac-inc) |
| 3 | **Stay Cool Air Conditioning & Heating, LLC** | HVAC, Oldsmar FL (Tampa Bay) | BBB complaint (May 2025): "The phone number rings and rings and goes to a voicemail which I left multiple but never received a returned call." In business since 2011 with almost no online reviews, so they're also invisible online. | **Missed-Call Text-Back + After-Hours Voice AI** | [BBB](https://www.bbb.org/us/fl/oldsmar/profile/commercial-air-conditioning-contractors/stay-cool-air-conditioning-heating-llc-0653-90278586/complaints), [HomeGuide](https://homeguide.com/fl/dunedin/central-air-conditioning-repair/stay-cool-air-conditioning---heating-3RWLmudOz) |
| 4 | **Texas Quality Plumbing, LLC** | Plumbing, Houston TX (10814 Woodedge Dr) | 4.35 from 49 reviews on HomeAdvisor. A review says they promised to come back and "it has been four weeks and they still have not even called back." BBB page also references a customer never receiving a call back. | **Missed-Call Text-Back + follow-up automation** (callback reminders) | [HomeAdvisor](https://cost-guide-ssr.homeadvisor.com/rated.texasqualityplumbing.156459467.html), [BBB](https://www.bbb.org/us/tx/houston/profile/plumber/texas-quality-plumbing-llc-0915-90023150/complaints) |
| 5 | **Service Contractors Plumbing** | Plumbing, Kaufman TX (east of Dallas) | BBB complaint: "They aren't responsive, I've texted, called and left messages and even reopened my claim and they won't respond." Thin online presence (3.81 on Porch, reviews from 2016–2019). | **Missed-Call Text-Back + Speed-to-Lead** | [BBB](https://www.bbb.org/us/tx/kaufman/profile/plumber/service-contractors-plumbing-0875-90408429/complaints), [Porch](https://pro.porch.com/kaufman-tx/plumbers/service-contractors-plumbing/pp) |
| 6 | **DEAR Services / DEAR Electric, Inc.** | Electrical, Kent WA | BBB complaint: manager promised a call back next business day and the customer "never received a call again". Marked **Unanswered** on BBB (no response to the dispute). Locally owned since 2014. | **Missed-Call Text-Back** | [BBB](https://www.bbb.org/us/wa/kent/profile/electrician/dear-services-1296-90002250/complaints), [HomeGuide](https://homeguide.com/wa/kent/general-contractors/dear-services-zgMx91myR) |
| 7 | **Reliable Services** | Electrical, Deerfield Beach FL | BBB complaint: "multiple calls to Reliable were either ignored, or answered after long delays," with about a two-week wait for a promised manager callback. | **After-Hours/Overflow Voice AI** | [BBB](https://www.bbb.org/us/fl/deerfield-beach/profile/electrician/reliable-services-0633-92008553/complaints) |
| 8 | **E I Electrical Inc.** | Electrical, Honolulu HI | BBB complaint: "tried to reach them by text, phone and email but they are not returning my inquiries." Later resolved with refund. Weaker fit, since it's a single resolved case. | **Missed-Call Text-Back** (low priority) | [BBB](https://www.bbb.org/us/hi/honolulu/profile/electrical-contractors/e-i-electrical-inc-1296-53084404/complaints) |

### Tier B: real pain, harder sale (franchise / large)

| Business | Evidence | Why lower priority | Source |
|---|---|---|---|
| One Hour Air Conditioning & Heating, Las Vegas NV | "Called three times over several days... over 2 weeks and I am still waiting for that call back" | Franchise; likely bound to franchisor call center. Pitch only if the local owner is reachable | [BBB](https://www.bbb.org/us/nv/las-vegas/profile/air-conditioning-contractor/one-hour-air-conditioning-heating-1086-49238/complaints) |
| One Hour Air Conditioning & Heating, Fort Worth TX | Weekend freeze complaint; wouldn't come until Monday after a missed call | Franchise | [BBB](https://www.bbb.org/us/tx/fort-worth/profile/commercial-air-conditioning-contractors/one-hour-air-conditioning-heating-0825-93090008/complaints) |
| One Hour Heating & Air Conditioning, Indianapolis IN | Tried calling every day for a week without a callback | Franchise | [BBB](https://www.bbb.org/us/in/indianapolis/profile/heating-and-air-conditioning/one-hour-heating-air-conditioning-0382-8001066/complaints) |
| Reliant Plumbing, Austin TX | 56 BBB complaints in 3 yrs; several about promised callbacks that never came | Large operation, already has dispatch staff | [BBB](https://www.bbb.org/us/tx/austin/profile/plumber/reliant-plumbing-0825-1000140950/complaints) |
| Horizon Services, Mount Laurel NJ | Emergency in 100° heat: "not one dispatcher has answered a call" | Large multi-trade company | [BBB](https://www.bbb.org/us/nj/mount-laurel/profile/heating-and-air-conditioning/horizon-services-heating-cooling-plumbing-and-electrical-0221-90163912/complaints) |
| Any Hour Services, Orem UT | Follow-up call went to voicemail; never called back after a week | Large multi-trade company | [BBB](https://www.bbb.org/us/ut/orem/profile/electrician/any-hour-services-1126-22021189/complaints) |

### Looked into but excluded (no call-related evidence found)
Call Dad AC & Heating (Charlotte), Reds HVAC (Grove City OH), Fast Response Heating & Cooling
(Grove City OH; acquired by Rocket Group in 2024, so likely centralized), B & B Plumbing
(Mineral Wells TX; BBB non-response isn't call-related), True Comfort HVAC (Canyon Country CA;
the voicemail was on the customer's side).

## 4. What I could not do from this environment (and how to fix it)

- **The YouTube video**: this cloud session's network blocks youtube.com, so I couldn't
  watch it or pull its transcript. Your doc's "How to Build the After-Hours AI" steps (Hexona/GHL
  sub-account → Voice AI → Prompting Advisor → knowledge base → actions → after-hours
  schedule) are what the templates in `templates/` follow. If the video differs, paste the
  transcript into the chat (YouTube → "...more" → "Show transcript") and I'll adjust.
- **Scraping Google reviews, Yelp, Facebook and websites directly**: blocked here too. Only
  web *search* worked, which is why this first batch comes from BBB/HomeAdvisor-type pages.
  The lead engine fixes this: it pulls Google Maps listings, hours, reviews and websites
  through APIs, so it's cheap and repeatable and doesn't spend Claude tokens. See
  `docs/02-apis-and-mcps.md`.
