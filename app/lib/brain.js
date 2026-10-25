/**
 * Compiles a client profile into a channel prompt — the JS twin of brains/compile.py, reading the
 * SAME files. One source of truth: brains/clients/<slug>.json for the facts, brains/core-brain.md
 * for the reasoning, brains/agents/*.md for the channel. Change a price in the JSON and every
 * channel picks it up on the next request.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const BRAINS = path.join(ROOT, "brains");

const CHANNELS = {
  chat:  "whatsapp-booking.md",
  email: "gmail-speed-to-lead.md",
  voice: "voice-receptionist.md",
  review: "review-reactivation.md"
};
const SELF_CONTAINED = new Set(["voice"]);

// Compact channel rules, used by the runtime build. Short on purpose: free-tier accounts meter
// tokens per minute, so every line here costs replies per minute.
const COMPACT_CHANNEL = {
  chat: `CHANNEL: live text message. Two or three short lines at most. Plain text only, no markdown, no bullets, no links. One question. Answer as if within 30 seconds.`,
  email: `CHANNEL: email reply to a website form. The form already gave you their name, phone and email, so never ask for those again. 40 to 80 words, plain text, no HTML, no signature block beyond the sign-off. Acknowledge the specific problem, then give one question or two time options. Sign off as "{{OWNER_OR_OFFICE}}, {{BUSINESS_NAME}}" with {{PHONE}} on its own line. Reply with the body of the email only.`,
  voice: `CHANNEL: a live phone call. You are speaking and they hear you. One or two sentences, then stop and let them talk, under 30 words. Say numbers as words, like "ten in the morning". No lists, never more than two options at once. If you cannot make out what they said, ask once more, then take their number for a human. Reply with only the words you speak.`,
  review: `CHANNEL: a text to one of {{BUSINESS_NAME}}'s own past customers, sent as {{OWNER_OR_OFFICE}}, after a job. One or two short lines, plain text.
COMPLIANCE, absolute: never route an unhappy customer away from Google, never hide the review link, never make it conditional on their rating. On 4 or 5 stars, thank them and send {{REVIEW_LINK}}, asking once and never again. On 1 to 3 stars, apologise once, ask what went wrong, offer {{OWNER_OR_OFFICE}}'s call, AND show the same link {{REVIEW_LINK}} anyway, then add [[ESCALATE]]{"reason":"low_rating","detail":"","phone":""}[[/ESCALATE]]. Never offer anything in exchange for a review and never write the words of one. If they mention a problem or another job, drop the review and book it.
On STOP or any request to stop, reply once confirming they are unsubscribed, add [[OPTOUT]]{"phone":"","reason":""}[[/OPTOUT]], and never message again.`
};

const cache = new Map();
const readCached = p => {
  const st = fs.statSync(p);
  const k = p + ":" + st.mtimeMs;
  if (!cache.has(k)) cache.set(k, fs.readFileSync(p, "utf8"));
  return cache.get(k);
};

function clientDirs() {
  return [path.join(BRAINS, "clients"), path.join(__dirname, "..", "clients")];
}

function listClients() {
  const out = new Set();
  for (const d of clientDirs()) {
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) if (f.endsWith(".json")) out.add(f.replace(/\.json$/, ""));
  }
  return [...out].sort();
}

function loadProfile(slug) {
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/i.test(slug)) throw new Error("bad client id");
  for (const d of clientDirs()) {
    const f = path.join(d, slug + ".json");
    if (fs.existsSync(f)) return JSON.parse(readCached(f));
  }
  throw new Error(`no profile for "${slug}"`);
}

const money = s => {
  const a = s.price_from, b = s.price_to;
  if (a == null) return "price on request";
  const n = x => "$" + Number(x).toLocaleString("en-US");
  return (b == null || a === b) ? n(a) : `${n(a)}-${n(b)}`;
};

function groundTruth(p) {
  const b = p.business, o = [];
  o.push(`**${b.name}** — ${b.trade}${b.years_in_business ? ", " + b.years_in_business : ""}`);
  if (b.license) o.push(`Licence: ${b.license}`);
  o.push(`Phone: ${b.phone || "(not listed)"}`);
  if (b.address) o.push(`Address: ${b.address}`);
  o.push(`Service area: ${b.service_area}`);

  const h = p.hours || {};
  if (Object.keys(h).length) {
    o.push("\n**Hours**");
    for (const [label, key] of [["Open", "regular"], ["Closed", "closed"], ["After hours", "after_hours"]])
      if (h[key]) o.push(`- ${label}: ${h[key]}`);
  }
  if ((p.services || []).length) {
    o.push("\n**Services and prices**\n", "| Service | Price | Notes |", "|---|---|---|");
    for (const s of p.services) o.push(`| ${s.name} | ${money(s)} | ${s.notes || ""} |`);
    o.push("\nPrices shown as a range are ranges, not quotes. Give the range, then say the exact " +
           "figure comes after a tech sees the job.");
  }
  if (p.policies) {
    o.push("\n**Policies**");
    for (const [k, v] of Object.entries(p.policies))
      o.push(`- ${k.replace(/_/g, " ").replace(/^./, c => c.toUpperCase())}: ${v}`);
  }
  if (p.booking) {
    o.push("\n**Booking**");
    for (const [k, v] of Object.entries(p.booking))
      o.push(`- ${k.replace(/_/g, " ").replace(/^./, c => c.toUpperCase())}: ${v}`);
  }
  if ((p.faqs || []).length) {
    o.push("\n**Questions they actually get**");
    for (const f of p.faqs) o.push(`- *${f.q}* — ${f.a}`);
  }
  if ((p.unknowns || []).length) {
    o.push("\n**You do not know these — the office confirms**");
    for (const u of p.unknowns) o.push(`- ${u}`);
  }
  return o.join("\n");
}

// Values like "Not published" are placeholders, not facts; feeding them in makes the agent read
// like a form with blanks in it.
const said = v => v && !/^(not published|n\/a|none|unknown)\.?$/i.test(String(v).trim());

function groundTruthCompact(p) {
  const b = p.business, o = [];
  o.push(`${b.name}, ${b.trade}${said(b.years_in_business) ? ", " + b.years_in_business : ""}. Covers ${b.service_area}.`);
  if (said(b.address)) o.push(`Address: ${String(b.address).replace(/\.+$/, "")}.`);
  if (said(b.phone)) o.push(`Phone: ${b.phone}.`);
  const h = p.hours || {};
  if (Object.keys(h).length)
    o.push(`Hours: ${h.regular || ""} Closed ${h.closed || "—"}. ${h.after_hours || ""}`.trim());
  if ((p.services || []).length)
    o.push("Prices: " + p.services.map(s => `${s.name} ${money(s)}`).join("; ") + ".");
  const pol = p.policies || {};
  for (const k of ["after_hours_fee", "warranty", "emergency"])
    if (pol[k]) o.push(`${k.replace(/_/g, " ").replace(/^./, c => c.toUpperCase())}: ${pol[k]}.`);
  if ((p.faqs || []).length) o.push(p.faqs.map(f => `${f.q} ${f.a}`).join(" "));
  return o.filter(Boolean).join(" ");
}

function build(profile, channel, opts) {
  if (!CHANNELS[channel]) throw new Error(`unknown channel "${channel}"`);
  const compact = !(opts && opts.full);
  const p = profile, b = p.business;
  const gas = (p.safety || {}).gas_emergency_line;
  const rv = p.review || {};
  const trade = b.trade || "";
  const article = (/^[AEFHILMNORSX]/.test(trade[0] || "") && trade === trade.toUpperCase())
    || /^[aeiou]/i.test(trade[0] || "") ? "an" : "a";

  const vals = {
    AGENT_NAME: p.agent_name,
    BUSINESS_NAME: b.name,
    TRADE: trade,
    TRADE_ARTICLE: article,
    SERVICE_AREA: b.service_area,
    SERVICE_AREA_SHORT: b.service_area_short || b.service_area,
    OWNER_OR_OFFICE: b.owner_or_office,
    TONE: p.tone || "Warm, brief, plainly spoken.",
    GROUND_TRUTH: groundTruth(p),
    GROUND_TRUTH_COMPACT: groundTruthCompact(p),
    GAS_LINE_CLAUSE: gas ? `, and ${gas}` : "",
    GAS_LINE_CLAUSE_SPOKEN: gas ? `, and then ${gas}` : "",
    SMS_WINDOW: rv.sms_window || "9am to 7pm",
    REVIEW_LINK: rv.link || "[REVIEW LINK NOT SET]",
    REACTIVATION_DAYS: String(rv.reactivation_days == null ? 90 : rv.reactivation_days),
    REACTIVATION_SERVICE: rv.reactivation_service || "a check-up"
  };

  // Worked examples teach tone, so they have to be in THIS trade. A profile can supply its own;
  // otherwise build them from the trade and whatever price the business actually publishes.
  const priced = (p.services || []).find(s => s.price_from != null);
  vals.HEADLINE_PRICE = priced ? money(priced) : "";
  const ex = p.examples || {};
  const good = ex.good && ex.good.length ? ex.good : [
    `"That sounds like a bad one. How long has it been going on?"`,
    priced
      ? `"${priced.name} is ${money(priced)}. What's it doing right now?"`
      : `"I'd have to have the office confirm the price. What's it doing right now?"`
  ];
  const bad = ex.bad && ex.bad.length ? ex.bad : [
    `"Great question! I'd be happy to help. What's your name, address, and when works for you?"`,
    `"Thanks for reaching out. How can I assist you today?"`
  ];
  vals.EXAMPLES = good.map(g => "Good: " + g).concat(bad.map(x => "Bad: " + x)).join("\n");
  vals.HOURS_SHORT = (p.hours && p.hours.regular) || "our opening hours";
  vals.PHONE = b.phone || "";

  let text;
  // Voice already has a purpose-built short prompt; the generic compact one is bigger.
  if (compact && !SELF_CONTAINED.has(channel)) {
    text = readCached(path.join(BRAINS, "core-compact.md"));
    text = text.replace(/^[\s\S]*?\n---\n/, "");          // drop the authoring note
    vals.CHANNEL_RULES = COMPACT_CHANNEL[channel] || "";
  } else {
    const parts = [];
    if (!SELF_CONTAINED.has(channel)) parts.push(readCached(path.join(BRAINS, "core-brain.md")));
    parts.push(readCached(path.join(BRAINS, "agents", CHANNELS[channel])));
    text = parts.join("\n\n");
    vals.CHANNEL_RULES = "";
  }

  // Strip the authoring notes and the platform-config tail; neither belongs in a system prompt.
  text = text.replace(/^#.*?\n\nPlaceholders[\s\S]*?\n\n---\n/, "");
  text = text.replace(/\n## VOICE SETTINGS[\s\S]*$/, "");
  text = text.replace(/^# Channel: .*$/gm, "");
  text = text.replace(/Voice agents degrade badly[\s\S]*?warns past 2,000\.\n\n---\n/, "");

  for (let pass = 0; pass < 2; pass++)
    for (const [k, v] of Object.entries(vals)) text = text.split("{{" + k + "}}").join(v);

  // Live conversation, not a document: say so once at the end.
  text = text.trim() + `

---
You are in a live conversation now. Reply with the message itself and nothing else: no preamble,
no stage directions, no "Agent:", no surrounding quotes, and no markdown formatting.`;
  return text;
}

// --- markers emitted by the agent ------------------------------------------
// Deliberately forgiving. Models mis-close these: single brackets, a stray brace, a missing
// closing tag. A booking that fails to parse is a job on the floor, so accept the near misses
// rather than insisting on exact syntax.
const MARKER = /\[{1,2}\s*(BOOKING|ESCALATE|OPTOUT)\s*\]{1,2}([\s\S]*?)(?:\[{1,2}\s*\/\s*\1\s*\]{1,2}|$)/gi;

const stripMarkers = t => String(t).replace(MARKER, "").replace(/\n{3,}/g, "\n\n").trim();

/** Pull the first balanced JSON object out of a string, tolerating junk either side. */
function looseJson(s) {
  const start = s.indexOf("{");
  if (start === -1) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (esc) { esc = false; continue; }
    if (c === "\\") { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) {
      try { return JSON.parse(s.slice(start, i + 1)); } catch (e) { return null; }
    }
  }
  return null;
}

function readMarkers(t) {
  const out = [];
  for (const m of String(t).matchAll(MARKER)) {
    const body = looseJson(m[2]) || { notes: m[2].trim().slice(0, 400) };
    body.kind = m[1].toUpperCase() === "BOOKING" ? "booking"
              : m[1].toUpperCase() === "ESCALATE" ? "escalation" : "optout";
    out.push(body);
  }
  return out;
}

module.exports = { build, loadProfile, listClients, stripMarkers, readMarkers, CHANNELS };
