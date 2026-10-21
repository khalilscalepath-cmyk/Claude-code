# What the 6 Videos Teach (and How Scalepath Uses It)

Watched with vidIQ (full transcripts + full visual watch) and Higgsfield (scene-by-scene visual
analysis), October 2026.

## The one-line version

**Find a business with a public, expensive problem → build them a personalised demo before you
ever talk → send it with a short, specific message → run a diagnosis call → deliver with reusable
templates → send a weekly report that justifies the retainer.** Automate everything except the
service itself (the 80/20 model).

---

## Video by video

### 1. "How to Start an AI Automation Agency in 2026" (Mikey No Code, 52 min)
- Pick **one niche** and speak its language. (Ours: HVAC/plumbing/electrical.)
- Sell **one expensive, repetitive problem** fixed automatically. Owners don't care about AI;
  they care about faster lead response, fewer missed opportunities, and **a report that proves it**.
- Builds 3 Base44 Super Agents: **speed-to-lead follow-up** (reply within minutes, follow up at
  48h and 96h, stop on reply), **triage** (score 1–10, urgent → instant alert, rest → sheet),
  **weekly executive report** (every Sunday 8pm: leads, % high priority, avg response time,
  conversion to bookings).
- Offer: **setup fee + monthly retainer**, never hourly. First clients $1,000–1,500 setup,
  later $3,500+. Retainer $500–1,500/mo. One-page offer, 7–10 day delivery.
- Outreach: problem → system → measurable result. Entry offer: **free 15-min audit**.
  Strongest asset: a **2–3 min Loom of the demo working**.
- Scale: document everything, clone templates, hire an operator at $5–10k MRR.

### 2. "Paste This Into Claude To Get 10x More Output" (Mikey, Claude Skills, 32 min)
- A **Skill** = a SKILL.md file: YAML header (name + **description**) + rules.
  The **description decides when it loads**; vague descriptions silently fail.
- A "skill extractor" prompt interviews you (task, triggers, rules, things to avoid) and writes
  the skill. Test with realistic wording; if the "loaded skill" banner doesn't show, fix the
  description, not the rules.
- Use for anything you repeat: reports, writing voice, quality checklists.

### 3. "How To Build & Sell Claude AI Agents" (Patrick Dang, 25 min)
- An agent = **Claude + skills + data**. Sell the **outcome**, not the agent.
- Don't cold-pitch "AI audits" to strangers. Instead: **sample work first**, then a
  **signal-based list** (data showing they need it), ranked by points, test 10–12 before 1,000.
- Personal **Loom**: "I noticed X, your competitor does Y, here's what I'd do."
- 60-day plan: idea (week 1) → samples (week 2) → outreach daily (weeks 3–8).

### 4. "I Built The Ultimate Claude Website Design Skill" (Nate Herk, ScrollCraft, 17 min)
- Premium **scroll-driven** sites where scrolling controls something on the page.
- Starts with an **interview**: what the visitor hits first, what they must believe by the end,
  what real assets exist, one signature move. Then builds and **checks its own screenshots**.
- Techniques: pinned sections, live counters, typewriter text, map dots lighting up,
  "Exhibit A" proof labels, a sources counter (0/9) that fills as you scroll, light/dark switches.
- Best for brands and agencies. For a local trade business, use these **sparingly** (see 5).

### 5. "How I Build a $500 Website for a Real Client using Claude" (Nafay 3D, 23 min)
- Real client (6-agent realty firm). Flow: **client brief → 2 real reference sites
  (Dribbble/Google, full-page screenshots) → Claude design mode → 4 concepts → client picks →
  scrape their existing site for real content → anti-slop audit → publish via Hostinger MCP.**
- Rejects heavy 3D/WebGL: slow, bad on phones, hurts SEO, doesn't get calls.
- **Anti-AI-slop rules:** no buzzwords (elevate, seamless, unlock, game-changer…), headlines say
  what they actually do, digits not words, no em-dash habit, no purple/cyan gradients, glow,
  glassmorphism or blobs, no Inter/Roboto/Poppins by default, no generic SaaS layout (centered
  hero + 2 buttons + 3 cards + logo strip + FAQ accordion), no emoji/sparkle icons, real local
  photos. **Acid test: remove the logo — could it only be this business?**
- Pricing: **$500–1,000 build + $20–50/mo** hosting/maintenance (hosting costs ~$3/mo).

### 6. "I Signed a Guinness Record Holder as a Monthly Retainer" (Koushik Bethu, 26 min)
- **This is the Scalepath model, already working for someone else.** His pipeline:
  scrape companies by a signal (Shopify stores) → AI finds a personal email → AI researches them
  and writes a personalised icebreaker → when they reply, **AI builds a personalised demo landing
  page in 2–3 minutes** → automated "accept the invite or the call is cancelled" email.
- Sales call structure: what made the email stand out → diagnose the problem → quantify →
  qualify (do they have real answers?) → urgency ("every day you're losing") → price → payment.
- **$600/month**, paid 50% upfront / 50% on launch. "80% of my business is automated; the 20% is
  creating the service."

---

## What this means for Scalepath

| Step | What we automate | Tool |
|---|---|---|
| 1. Find | HVAC/plumbing/electrical shops with missed-call / no-callback / no-website signals, scored | `leadengine` + `lead-signals` skill |
| 2. Research | Their site, hours, services, reviews, owner email | `leadengine` / web search |
| 3. Demo | (a) their 24/7 AI receptionist; (b) a clean new website if theirs is bad or missing | `voice-receptionist` + `local-business-website` skills, Vapi |
| 4. Outreach | Short email + 2-min Loom-style walkthrough of *their* demo | `cold-outreach` skill |
| 5. Call | Diagnose → quantify → qualify → pitch → 50/50 payment | `discovery-call` skill |
| 6. Deliver | Clone the template, connect their phone/calendar, test | GHL/Hexona or Vapi + Make |
| 7. Retain | Weekly report: calls answered after hours, jobs booked, revenue recovered | `weekly-client-report` skill |

**Website offer, adjusted by video 5:** the free website must be clean, fast and built from
the business's real details and photos, not a cinematic scroll piece. Keep at most one small
scroll moment (e.g. a call log that fills in). The receptionist is the monthly product.
