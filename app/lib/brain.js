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

function groundTruthCompact(p) {
  const b = p.business, o = [];
  o.push(`${b.name}, ${b.trade}${b.years_in_business ? ", " + b.years_in_business : ""}. Covers ${b.service_area}.`);
  if (b.address) o.push(`Address: ${b.address}.`);
  if (b.phone) o.push(`Phone: ${b.phone}.`);
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

function build(profile, channel) {
  if (!CHANNELS[channel]) throw new Error(`unknown channel "${channel}"`);
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

  const parts = [];
  if (!SELF_CONTAINED.has(channel)) parts.push(readCached(path.join(BRAINS, "core-brain.md")));
  parts.push(readCached(path.join(BRAINS, "agents", CHANNELS[channel])));
  let text = parts.join("\n\n");

  // Strip the authoring notes and the platform-config tail; neither belongs in a system prompt.
  text = text.replace(/^#.*?\n\nPlaceholders[\s\S]*?\n\n---\n/, "");
  text = text.replace(/\n## VOICE SETTINGS[\s\S]*$/, "");
  text = text.replace(/^# Channel: .*$/gm, "");
  text = text.replace(/Voice agents degrade badly[\s\S]*?warns past 2,000\.\n\n---\n/, "");

  for (const [k, v] of Object.entries(vals)) text = text.split("{{" + k + "}}").join(v);

  // Live conversation, not a document: say so once at the end.
  text = text.trim() + `

---
You are in a live conversation now. Reply with the message itself and nothing else: no preamble,
no stage directions, no "Agent:", no surrounding quotes, and no markdown formatting.`;
  return text;
}

// --- markers emitted by the agent ------------------------------------------
const MARKER = /\[\[(BOOKING|ESCALATE|OPTOUT)\]\]([\s\S]*?)\[\[\/\1\]\]/g;

const stripMarkers = t => String(t).replace(MARKER, "").replace(/\n{3,}/g, "\n\n").trim();

function readMarkers(t) {
  const out = [];
  for (const m of String(t).matchAll(MARKER)) {
    let body = {};
    try { body = JSON.parse(m[2].trim()); }
    catch (e) { body = { notes: m[2].trim().slice(0, 400) }; }
    body.kind = m[1] === "BOOKING" ? "booking" : m[1] === "ESCALATE" ? "escalation" : "optout";
    out.push(body);
  }
  return out;
}

module.exports = { build, loadProfile, listClients, stripMarkers, readMarkers, CHANNELS };
