---
name: video-to-skill
description: Watch a YouTube video Khalil sends (or a list of them), extract the tools, prompts, scripts, numbers and methods shown, and turn what's useful for Scalepath into new or updated Claude skills plus an entry in the learning log. Use whenever a YouTube link is shared with "watch this", "add this", "learn from this", "steal their prompts", "make a skill from this video", or similar.
---

# Video → skill

## 1. Watch it properly (cheapest first)
1. Metadata: `vidiq_get_videos_by_ids` (title, channel, length, chapter timestamps) for 5 credits.
2. Words: `vidiq_video_transcript` for 5 credits. Long transcripts land in a file; read it in slices.
3. Visuals, free: Higgsfield `video_analysis_create` with the YouTube URL, then poll
   `video_analysis_status` (3–5 min). Note: it often covers only the first minutes of long videos.
4. Full visual watch: `vidiq_video_watch` for 25 credits, with a custom prompt asking for on-screen
   prompts **verbatim**, tools, settings, layouts, colours and timestamps. Use it when the value is on
   screen (website builds, prompts shown but not read aloud, dashboards). Check `vidiq_balance` first.

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
