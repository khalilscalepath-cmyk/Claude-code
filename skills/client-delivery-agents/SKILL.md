---
name: client-delivery-agents
description: Set up the automations Scalepath delivers to a signed home-service client after the sale: speed-to-lead follow-up agent, lead triage/scoring agent, weekly executive report agent, AI booking bot for web forms, and Google review campaign, in Base44 Super Agents, GoHighLevel or Make. Use when asked to build, configure, prompt or test a client's agents, automations, follow-up sequence, lead scoring, booking bot, review request campaign, or "deliver the service" for an HVAC, plumbing or electrical client.
---

# Client delivery agents

Sources: Mikey No Code's Base44 Super Agents build (3 agents) and Noah's delivery stack (booking bot +
review campaign). The agent prompts below are written from the narration of the videos, adapted from
real estate to home services. Replace every {placeholder} with confirmed client details.

## Setup rules (every agent)
- Base44 Super Agents: Customize → General → set BOTH chat model and automated-tasks model to the
  same strongest available model (don't leave on automatic; it makes results inconsistent).
- Connect only the plugins the agent needs (Gmail, Google Sheets, Calendar, CRM).
- Test with a fake lead before touching live data. Show the client the test, then go live.

## Agent 1: Speed-to-lead follow-up
Prompt:
> You are the lead response assistant for {Business}, a {trade} company in {city}. Watch the
> connected inbox (and form/webhook notifications from {lead sources: website form, Google LSA,
> Angi, Thumbtack, Facebook}) for new service requests. For each new request, extract: name, phone,
> email, address or zip, the problem, how urgent it is, and preferred time. Within 2 minutes send a
> warm, short reply from {Business} that mentions their specific problem, says a technician can come
> out {soonest availability}, and offers two options: a quick call now or a booking link {link}.
> Never quote prices. Sign as {owner/office name}.
Follow-up rule:
> If the lead hasn't replied 48 hours after the first message, send a second message with a fresh
> angle (e.g. seasonal tune-up reminder, financing, or "we have an opening tomorrow"). If still no
> reply after 96 hours, send one last check-in asking if they still need help. Stop the sequence the
> moment they reply and immediately notify {owner phone/email} with the lead's details.
Test prompt:
> Simulate a new request from Maria Lopez (maria@example.com, 480-555-0199): "AC blowing warm air,
> 2-story house in 85226, home all day tomorrow." Show the extracted fields, the first reply, and when
> the 48h and 96h follow-ups would send.

## Agent 2: Triage and routing
> Review every incoming request for {Business} and score urgency 1–10 using: (a) how specific the
> problem is, (b) safety or damage risk (no heat in freezing weather, no AC above 100°F, active leak,
> sewage, burning smell, sparks), (c) how soon they want service. 8–10 = high: send an instant alert
> to {on-call phone} with contact details, score and a one-line reason. 5–7 = medium, 1–4 = low:
> log to the connected Google Sheet (name, contact, time received, score, one-line summary) for the
> morning digest.
Test with two opposite leads: "Water pouring through the ceiling, need someone tonight, 85224" vs
"Just curious what a new system costs someday." First must score high and alert; second low and log.

## Agent 3: Weekly executive report (the retainer's proof)
> Act as {Business}'s operations analyst. Every Sunday at 8pm ({timezone}) review the week's lead
> and call activity and report: total inbound leads, after-hours calls answered, missed calls texted
> back, % high priority, median first-response time, jobs booked, estimated revenue (jobs booked ×
> {average ticket}). Write a short executive summary with clear totals, deliver it to {owner email},
> and log a copy to the connected Google Sheet.
Check Automations shows "Weekly executive report" active for Sunday 8pm. Format: see `weekly-client-report` skill.

## Web-form booking bot (GoHighLevel)
Trigger: form submitted → internal notification to owner → SMS now: "Hi {first}, this is {Business}.
We got your request about {issue}. A tech can come out {window}." → wait 2 min → "Is now a good time
for a quick call?" → AI conversation qualifies (address, timeline, problem) and books.

## Google review campaign (past customers, with consent)
> Hi {first}, this is {owner} from {Business}. Hope the {service} is still working well! Would you be
> open to leaving us a quick Google review? It really helps a small local business: {review link}
Send only to past customers who gave their number for service updates. Don't offer rewards for
reviews (Google's policy prohibits incentivised reviews, so skip "raffle" tactics).

## Client communication
Clients churn over silence more than results. Send a short weekly update even when quiet, and reply
to client messages the same day.
