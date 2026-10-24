# Learning Log

Every video or source Khalil shares, what we took from it, and where it now lives.
Newest first. Method: `skills/video-to-skill`.

## 2026-10-24
| Video | Creator | Takeaways | Saved in |
|---|---|---|---|
| [200 AI agents, one person agency](https://www.tiktok.com/@ai.with.andrew) (TikTok, sent by Khalil) | @ai.with.andrew | Points at `msitarzewski/agency-agents` (MIT): 329 subagents in 20 divisions, each a role with its own workflow and definition of done. Ships `scripts/install.sh --tool claude-code` with `--division`, `--agent`, `--agents-file`, `--path` and `--link`. Its own README warns OpenCode silently drops past ~119 agents. | `.claude/agents/` — 24 installed and documented in its README |
| [Build & Sell Claude AI Agents (2h course)](https://youtu.be/kyngnLF27bw) | AlbertShiney (skool.com/freegroup) | Chapters map onto what we already sell: WhatsApp agent, Gmail agent per lead, AI receptionist, Google reviews on autopilot, find 500 businesses, cold email that books calls, the real sales call broken down. Free course pack behind a signup holds every skill, prompt and file. **Not yet mined** — waiting on the file or the pack, see below. | pending |

**Tooling learned, 24 Oct:**
- We can watch and listen to video ourselves, free and offline: `tools/watch-video.py`
  (ffmpeg frames stamped with timecode + faster-whisper on CPU at ~8x realtime). Proved on
  the TikTok: reading the frames surfaced the installer command and the OpenCode caveat that
  the audio never mentions. `video-to-skill` now starts here.
- YouTube blocks this container's datacentre IP with a bot check. Not to be worked around.
  Khalil downloads the file on his own machine and sends it.
- **Higgsfield `video_analysis_create` fabricates.** Asked for the 2h Claude agents course, it
  returned a detailed six-scene breakdown of a milk frother advert. Caught only by checking
  the real title. Do not trust it.
- vidIQ credits: 0, renewing 14 Nov 2026.

## 2026-10-22
| Video | Creator | Takeaways | Saved in |
|---|---|---|---|
| [Sell an after-hours AI agent to a plumber ($2,000 build)](https://youtu.be/jO7Bvm0-PTg) | Hamza Automates (Hexona) | Agent = prompt + knowledge base + actions; train KB from the client's website; book + confirmation SMS; schedule 5pm–midnight and midnight–8am; find leads by calling Google Maps businesses after hours and logging who doesn't answer; call back next day with that proof. Pitch for his white-label GHL and paid community, so ignore the upsell. | cold-outreach (after-hours test-call list), voice-receptionist (rules 7–8) |
| [Claude routines in the cloud](https://youtu.be/g3e0m8nrQa4) | Albert (same creator as the reel video; HubSpot-sponsored) | Claude Code on the web + GitHub repo + connectors (Gmail, Calendar) + routines that run in the cloud on a schedule, even with your laptop off, and from the phone app. Use for daily lead lists, morning email drafts and weekly client reports. Avoid tool-hopping. | docs/05-team-plan.md (what Claude does vs. the hire) |
| [Claude skill that edits reels](https://youtu.be/68v_T0jrysM) | Albert | Fish Audio transcription API + a Claude skill that cuts the talking head and adds HTML animations, then self-checks; about 30 min per reel on the $200 plan. Feedback in plain words. Only useful once you're posting content as "the face". | learning only (no skill yet) |

## 2026-10-21
| Video | Creator | Takeaways | Saved in |
|---|---|---|---|
| [AI agency from zero to $10k/mo](https://youtu.be/ZInH_RIDXQA) | Noah | Niche filter (50k+ businesses, high ticket, proof of demand); sell the outcome; easy-yes offers (setup + per-appointment, risk reversal, 6-month prepay); cold calls with pattern-interrupt opener; 3-text cold SMS; free leads via Google Maps + Instant Data Scraper; call framework (rapport, frame, problem, goal, current state, bridge, urgency, pitch outcome→service→price, tie-down, objections); delivery = booking bot + review campaign + communication | cold-outreach, discovery-call, lead-signals, client-delivery-agents |
| [How to Start an AI Automation Agency in 2026](https://youtu.be/i4z0kCcByY8) | Mikey No Code | One niche, one expensive problem; 3 Base44 Super Agents (follow-up 48h/96h, triage 1–10, Sunday report); setup fee + retainer; free 15-min audit; Loom demo; document and clone | client-delivery-agents, weekly-client-report, cold-outreach |
| [Paste This Into Claude… (Claude Skills)](https://youtu.be/VwusbGZCdZE) | Mikey | Skills = YAML description (the trigger) + rules; interview-to-skill; test and widen descriptions | video-to-skill, all skill descriptions |
| [How To Build & Sell Claude AI Agents](https://youtu.be/kJ_-fWcLyfM) | Patrick Dang | Agent = Claude + skills + data; sell outcomes; sample work first; signal-scored lists; Loom DMs; 60-day plan | lead-signals, cold-outreach |
| [Ultimate Claude Website Design Skill (ScrollCraft)](https://youtu.be/QUI6Ug4cHnE) | Nate Herk | Interview-led scroll sites; one signature move; self-check with screenshots | local-business-website (one scroll moment only) |
| [$500 Website for a Real Client](https://youtu.be/dYUL9-m6U1o) | Nafay 3D | Brief → 2 references → 4 concepts → scrape real content → anti-slop audit → Hostinger MCP; $500–1,000 + $20–50/mo | local-business-website |
| [Guinness Record Holder Retainer](https://youtu.be/-nqaYh423mo) | Koushik Bethu | Fully automated outreach with AI-built personalised demo on reply; diagnose→quantify→qualify→pitch; $600/mo, 50/50 | cold-outreach, discovery-call |
