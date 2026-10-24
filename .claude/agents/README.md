# Agents

24 subagents from [agency-agents](https://github.com/msitarzewski/agency-agents) (MIT,
AgentLand Contributors), picked for what Scalepath actually sells and builds.

Found via a TikTok by @ai.with.andrew; the repo ships 329 agents across 20 divisions.

## Why 24 and not 329

Most of the catalogue is for games, GIS, healthcare, embedded firmware and the Chinese
social platforms. Installing all of them buries the handful that matter. These are the ones
that map onto the work:

| Group | Agents |
|---|---|
| Selling | offer-lead-gen-strategist, outbound-strategist, discovery-coach, deal-strategist, proposal-strategist, pipeline-analyst |
| AI delivery | voice-ai-integration-engineer, ai-engineer, prompt-engineer |
| Websites | frontend-developer, wordpress-performance, rapid-prototyper, code-reviewer, ui-designer, ux-researcher, brand-guardian, accessibility-auditor, performance-benchmarker |
| Marketing | seo-specialist, email-strategist, content-creator, growth-hacker |
| Running the shop | analytics-reporter, legal-compliance-checker |

`wordpress-performance` earns its place because every prospect audited so far is on a slow
WordPress site, and `voice-ai-integration-engineer` lines up with the after-hours
receptionist offer.

## Two deliberate differences from upstream

1. **Names are slugs.** Upstream ships `name: Voice AI Integration Engineer`. Claude Code
   addresses an agent by its `name`, so each file here uses the filename slug instead. The
   official installer does not do this — it was checked and deliberately not used for that
   reason.
2. **Descriptions say when to reach for it.** Each description has a `Use for …` clause so
   routing has something to match on.

Each file keeps a provenance footer pointing back at its source path upstream.

## Adding more later

The upstream installer handles selection and per-tool conversion:

```bash
git clone --depth 1 https://github.com/msitarzewski/agency-agents /tmp/agency-agents
cd /tmp/agency-agents
./scripts/install.sh --list agents                      # what is available
./scripts/install.sh --tool claude-code \
  --agent engineering-data-engineer \
  --path /path/to/Claude-code/.claude/agents
```

Then rewrite the new file's `name:` to its filename slug, or it will not be addressable.

## Before trusting a new one

These are third-party prompts. The 24 here were scanned for prompt injection, exfiltration
and hardcoded credentials before being committed — the only hits were security agents
*discussing* exfiltration as subject matter. Run the same check on anything added:

```bash
grep -rniE "ignore (all |any )?(previous|prior) instruction|exfiltrat|base64 -d|\.ssh/" .claude/agents/
```
