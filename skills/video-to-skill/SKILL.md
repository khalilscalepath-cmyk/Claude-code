---
name: video-to-skill
description: Watch a YouTube video Khalil sends (or a list of them), extract the tools, prompts, scripts, numbers and methods shown, and turn what's useful for Scalepath into new or updated Claude skills plus an entry in the learning log. Use whenever a YouTube link is shared with "watch this", "add this", "learn from this", "steal their prompts", "make a skill from this video", or similar.
---

# Video → skill

## 1. Watch it properly

**If you have the file, watch it yourself. This is free, unlimited and the most reliable option:**

```bash
python3 tools/watch-video.py <video.mp4> --every 20 --model base
```

It writes stamped contact sheets to look at and a timed transcript to read, using
faster-whisper on the CPU at roughly 8x realtime — a two hour talk takes about fifteen
minutes. Look at every sheet: screens carry prompts and settings that are never read aloud.

Getting the file: YouTube blocks this container's datacentre IP with a bot check, and that
is not to be worked around. Ask Khalil to download it on his own machine and send it.
TikTok and Instagram files he sends directly work straight away.

**Without the file**, in order:
1. The YouTube watch page often carries the full transcript and the chapter list — scrape it
   with Firecrawl and read it. Free, and it is his actual words.
2. Metadata: `vidiq_get_videos_by_ids` (5 credits). Words: `vidiq_video_transcript` (5 credits).
3. Full visual watch: `vidiq_video_watch` (25 credits) with a prompt asking for on-screen text
   **verbatim**. Check `vidiq_balance` first.

**Do not rely on Higgsfield `video_analysis_create`.** On 24 Oct 2026 it returned a confident,
fully detailed six-scene breakdown of a milk frother advert for a two-hour Claude agents
course. It fabricates. If it is used at all, verify the title against the real page first.

## 2. Extract (write these down, with timestamps)
- Tools and settings used (and what they cost).
- Prompts, scripts, message templates: verbatim where shown, otherwise "reconstructed from narration".
- Numbers: prices, conversion rates, timelines, volumes.
- The process in steps, and the mistakes they warn about.

## 3. Decide what Scalepath keeps
Keep what helps find, demo, sell, deliver or retain HVAC/plumbing/electrical clients. Adapt niche
examples (real estate, e-commerce) to home services. Flag anything risky (compliance, platform
terms, fake reviews, income claims) and adjust it rather than copying it.

## 4. Save it
- Update the matching skill in `skills/` (lead-signals, local-business-website, voice-receptionist,
  cold-outreach, discovery-call, client-delivery-agents, weekly-client-report), or create a new skill
  when the video teaches a new repeatable task. Description = trigger words people would actually say.
- Add a dated entry to `docs/learning-log.md`: video, creator, 3–6 takeaways, what changed in which skill.
- Rebuild the zips (`skills/zips/`) and copy into `.claude/skills/`, then commit and push.

## 5. Tell Khalil in plain words
What the video teaches, what was added or changed, and one thing to try this week.
