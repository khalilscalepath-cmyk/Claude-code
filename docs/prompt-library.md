# Prompt Library (from the videos, adapted for Scalepath)

**Verbatim** = shown/quoted exactly in the video. **Reconstructed** = written from the narration because the
prompt was only on screen. Each one is adapted to home services where useful. Saved skills that use these:
see `skills/`.

---

## 1. Skill Extractor (Mikey, "Paste This Into Claude…") · reconstructed
Use to turn anything you repeat into a Claude skill.
```
Act as a process documentation analyst. Your job is to turn one of my recurring tasks into a Claude
Skill. Interview me with exactly four questions, ONE AT A TIME, waiting for my answer each time:
1. What recurring task do you want to automate? Describe what you do today, step by step.
2. What kinds of requests, words, files or situations should trigger this skill? Give examples of how
   you'd naturally ask for it.
3. What rules, structure, format or steps must Claude follow every time?
4. What should Claude never do (mistakes, tone, things to leave out)?
After the four answers, write a complete SKILL.md: YAML front matter with a short unique `name` and a
trigger-focused `description` that includes the natural phrases from answer 2, then the Markdown
instructions (purpose, procedure, output format, rules, things to avoid). Then list 3 test requests I
should try in a new chat to check that the skill loads.
```

## 2. Skill Repair (Mikey) · reconstructed
```
The skill "<skill name>" did not load when I wrote: "<exact request>". Read its current description,
find why that wording didn't match, and rewrite only the description so similar everyday phrasing
triggers it, without making it so broad that it fires on unrelated requests. Show me the old and new
description.
```

## 3. Client website from a brief (Nafay 3D, "$500 Website") · verbatim, then adapted
Verbatim steps:
```
/design
Can you connect to unsplash mcp?
[Client brief pasted here] Based on these requirements and the design inspiration images attached,
create 4 designs for the clients website.
<current website URL> this is the existing website of the client, scrape it and extract all important
info. then add that in the new website. we chose the 3rd one (<concept name>)
make the website dark mode
using the hostinger mcp, publish this website
```
Scalepath version:
```
Build 3 different homepage concepts for <Business>, a <trade> company in <city>, using only these
verified facts: <name, phone, address, services, hours, license, reviews>. Goal: get phone calls and
booked requests. Follow skills/local-business-website and the frontend-design skill. Each concept needs
its own palette, type pairing and one signature moment tied to the trade. Mark anything unverified
"to confirm with owner". Then I'll pick one.
```

## 4. Anti-AI-slop audit (Nafay 3D + Anthropic frontend-design) · reconstructed
```
Audit this website for anything that makes it look AI-generated or generic, then fix it:
- Copy: remove buzzwords (elevate, seamless, unlock, empower, cutting-edge, next-level, game-changer,
  leverage, robust, transform, supercharge). Headlines must say what the business does and where.
  Use digits. No em-dash habit. Testimonials must be real or removed.
- Visual: no purple/cyan gradients, glow, glassmorphism or blobs; no default Inter/Roboto/Poppins; no
  generic SaaS layout (centered hero + 2 buttons + 3 identical cards + logo strip + FAQ accordion);
  no emoji or sparkle icons; no cream + serif + terracotta combo; no ALL-CAPS label over every heading;
  no "A · B · C" strings; no 01/02/03 unless it's a real sequence; not every section fading up.
- Acid test: hide the name and logo. Could it only be this business in this town? If not, change it.
List each problem found and the fix you made.
```

## 5. ScrollCraft interview (Nate Herk) · reconstructed from the questions shown
Ask these before building a premium scroll site:
```
1. What's the scroll journey: what does the visitor hit first, and in what order after that?
2. What must the visitor believe by the end? (one sentence, not a feature list)
3. What real assets do you have (photos, logos, video)? What should be generated?
4. Where should the page feel calm, and where intense?
5. One thing this site should do that no site you've seen does (the signature move).
```

## 6. Speed-to-lead follow-up agent (Mikey, Base44 Super Agents) · reconstructed, adapted
In `skills/client-delivery-agents/SKILL.md` (Agent 1 + 48h/96h follow-up rule + test prompt).

## 7. Lead triage agent (Mikey) · reconstructed, adapted
In `skills/client-delivery-agents/SKILL.md` (Agent 2: score 1–10, alert 8–10, log the rest).

## 8. Weekly executive report agent (Mikey) · reconstructed, adapted
In `skills/client-delivery-agents/SKILL.md` (Agent 3, Sunday 8pm) and `skills/weekly-client-report`.

## 9. Cold SMS + cold call scripts (Noah) · verbatim, adapted
In `skills/cold-outreach/SKILL.md`. SMS: "hey {first}, are you able to take on more jobs right now?" →
"{first}, are you fully booked out?" → "{first}??". Call opener: "I'll be honest, this is a cold call.
Do you have 15 seconds?"

## 10. Sales call questions (Koushik + Noah) · verbatim lines, combined
In `skills/discovery-call/SKILL.md`. Key lines: "What made my email stand out, and how can I make this
call a total win for you?" · "Walk me through what happens when a customer calls at 8pm on a Saturday."
· "Why not just keep doing what you're doing?" · "What happens if nothing changes in the next 6 months?"
· "Is it just the money?"

## 11. Website chat assistant "Cara" · ours
`sites/scp-kaufman/cara-instructions.txt`. Reuse for any client: swap name, address, services, towns.
