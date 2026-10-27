# Scalepath Claude Skills

Eleven skills that run the agency workflow from the videos (see `docs/04-video-playbook.md`).
Together they build the 7 AI employees of the Growth Team bundle (`docs/03-offer-playbook.md`):

| Skill | Use it when you say things like |
|---|---|
| `lead-signals` | "find plumbers in Houston who miss calls", "is this company a good prospect?" |
| `local-business-website` | "build a new website for this HVAC company", "their site is bad, make a better one" |
| `voice-receptionist` | "build the after-hours receptionist for this lead", "set up the demo agent" |
| `cold-outreach` | "write the email for this lead", "Loom script for Emergency Air" |
| `discovery-call` | "prep me for my call with X", "write the proposal", "how much should I charge?" |
| `weekly-client-report` | "make this week's report for my client" |
| `client-delivery-agents` | "set up the follow-up agent for my new client", "review campaign", "referrals" |
| `database-reactivation` | "text their old customer list", "wake up their database", "unsold estimates" |
| `sales-coach` | "review this call", "role-play a price objection", "my client's team can't close" |
| `ads-funnel` | "run Facebook ads for this client", "write lead ads", "get clients without cold calling" |
| `video-to-skill` | "watch this video and add what's useful" (any YouTube link) |

## Install
- **Claude app / claude.ai (works from a phone browser):** Settings → Capabilities/Skills → Upload
  skill → pick a file from `skills/zips/`. Do it once per skill.
- **Claude Code:** copy a folder into `~/.claude/skills/` (or this repo's `.claude/skills/`).

## Check it works
Ask in a new chat using everyday words (e.g. "write the cold email for Texas Quality Plumbing").
The reply should show "loaded cold-outreach". If it doesn't, tell Claude the exact sentence you
used and ask it to widen that skill's description. That's the fix from the Claude Skills video.
