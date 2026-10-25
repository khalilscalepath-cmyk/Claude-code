# The Brain

Every Scalepath agent — WhatsApp/SMS booking, email speed-to-lead, voice receptionist, review and
reactivation — is the same brain wearing a different channel. Build the brain once per client, then
compile it per channel.

```
clients/<client>.json        ground truth: the client's facts, as data
core-brain.md                the reasoning: situation read, response contract, slots, guardrails
agents/<channel>.md          channel deltas: length, voice, timing, what the channel can't do
compile.py                   profile + core + channel  ->  a finished system prompt
```

```bash
python3 brains/compile.py --client psc-cooling --channel whatsapp     # one prompt
python3 brains/compile.py --client psc-cooling --all --out out/psc/   # all four
```

## Why it's built this way

Most agents people sell are one long prompt with a question script in it. They break the moment a
customer does something the script didn't expect — which is most of the time — and they invent
facts, which is the one thing a client never forgives.

Three rules hold this together:

1. **Facts are data, not prose.** Everything the agent may assert lives in the client's JSON
   profile. The compiler inlines it and closes the door: anything not in the profile does not
   exist, and the agent says a human will confirm rather than guessing. Updating a price is a
   one-line edit to a JSON file and a recompile, not a prompt rewrite.
2. **Read the situation before choosing the goal.** The agent classifies each inbound first
   (emergency, urgent, routine, price shopper, existing customer, complaint, out-of-area, spam)
   and each class has its own objective and its own first question. An emergency is not a booking
   flow, and a price shopper is not an emergency.
3. **Slots, not a script.** The agent fills five slots — problem, urgency, location, timing,
   contact — in whatever order the conversation actually goes, and books as soon as it has enough.
   It never re-asks something already said.

## The two things that make it convert

Kept from what demonstrably works, and enforced by the response contract in `core-brain.md`:

- **Acknowledge first, always.** One clause that proves it read the specific thing they said,
  before anything else. "Happy to help, where would you like to go?" after someone describes pain
  is how you lose them.
- **One question per message.** Two questions in one message halves the reply rate and reads like
  a form.

## What never ships without checking

- **Safety routing** (`core-brain.md` §7). Gas smell, carbon monoxide, burning electrical, water
  near a panel: the agent stops selling, tells them to leave and call 911 or the gas emergency
  line. Every brain is tested against these before go-live. Non-negotiable.
- **A booking is tentative.** The agent says the office will confirm. It never promises a time as
  final — the client's real calendar is the authority, and over-promising a slot is worse than
  not booking.
- **SMS compliance.** The client's own A2P 10DLC brand, their customers only, sender identified,
  STOP honoured instantly, business hours, no Sundays. See `docs/06-business-plan-review-first.md` §7.
