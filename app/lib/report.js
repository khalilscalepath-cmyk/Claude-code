/**
 * The weekly client report, built only from what the store actually recorded.
 *
 * Follows skills/weekly-client-report: four sections, in order, no intro and no sign-off. The rule
 * that matters most is that nothing is invented. Anything the system does not measure comes back as
 * "not tracked yet" rather than a plausible number, because a client who catches one invented
 * figure stops believing the other six.
 */
const store = require("./store");
const { loadProfile } = require("./brain");

const NOT_TRACKED = "not tracked yet";
const AFTER_HOURS = r => { const h = new Date(r.at).getHours(); return h >= 19 || h < 7; };

function windowRows(client, from, to) {
  return store.list("records", { client })
    .filter(r => r.at >= from && r.at < to);
}

function tally(rows) {
  const is = (k, extra) => rows.filter(r => r.kind === k && (!extra || extra(r)));
  return {
    bookings: is("booking").length,
    leads: is("lead").length,
    handoffs: is("escalation").length,
    safety: is("escalation", r => r.reason === "safety").length,
    unhappy: is("escalation", r => r.reason === "low_rating").length,
    optouts: is("optout").length,
    afterHours: rows.filter(AFTER_HOURS).length,
    total: rows.length
  };
}

const change = (now, before) => {
  if (before === 0) return now === 0 ? "no change" : `up ${now} from none`;
  const d = now - before;
  if (d === 0) return "no change";
  return `${d > 0 ? "up" : "down"} ${Math.abs(d)} from ${before}`;
};

/**
 * Build the report. `days` is the window; the same window immediately before it is the comparison.
 * Returns structured data, so the same numbers serve the client page, a PDF, or an email.
 */
function build(client, days) {
  const span = Math.max(1, Number(days) || 7);
  const now = Date.now();
  const to = new Date(now).toISOString();
  const from = new Date(now - span * 864e5).toISOString();
  const prevFrom = new Date(now - span * 2 * 864e5).toISOString();

  const rows = windowRows(client, from, to);
  const prev = tally(windowRows(client, prevFrom, from));
  const t = tally(rows);

  let profile = null;
  try { profile = loadProfile(client); } catch (e) { /* report still works without it */ }
  const business = profile ? profile.business.name : client;
  const ticket = profile && profile.average_ticket ? Number(profile.average_ticket) : null;

  // Estimated, and only when the client has told us their average ticket.
  const revenue = ticket
    ? { value: t.bookings * ticket, ticket, label: `estimated, using an average ticket of $${ticket.toLocaleString("en-US")}` }
    : null;

  const headline = t.total === 0
    ? `Nothing came through the agents in the last ${span} days.`
    : [
        t.afterHours ? `${t.afterHours} ${t.afterHours === 1 ? "enquiry" : "enquiries"} arrived outside 7am to 7pm` : null,
        t.bookings ? `${t.bookings} ${t.bookings === 1 ? "job" : "jobs"} booked` : null,
        t.handoffs ? `${t.handoffs} passed to a human` : null
      ].filter(Boolean).join(", ") + "."
      + (revenue ? ` That is about $${revenue.value.toLocaleString("en-US")} of work, ${revenue.label}.` : "");

  const numbers = [
    { name: "Jobs booked", value: t.bookings, change: change(t.bookings, prev.bookings) },
    { name: "Website enquiries", value: t.leads, change: change(t.leads, prev.leads) },
    { name: "Came in outside 7am to 7pm", value: t.afterHours, change: change(t.afterHours, prev.afterHours) },
    { name: "Passed to a human", value: t.handoffs, change: change(t.handoffs, prev.handoffs) },
    { name: "Safety stops", value: t.safety, change: change(t.safety, prev.safety) },
    { name: "Estimated revenue", value: revenue ? `$${revenue.value.toLocaleString("en-US")}` : NOT_TRACKED,
      change: revenue ? change(t.bookings, prev.bookings) + " in bookings" : "tell us your average ticket and this fills in" },
    { name: "Median first response", value: NOT_TRACKED, change: "" },
    { name: "Calls answered", value: NOT_TRACKED, change: "the phone agent is not live yet" }
  ];

  // Section 3: what a person should actually look at, from the real rows.
  const look = [];
  const openHandoffs = rows.filter(r => r.kind === "escalation" && !r.handledAt);
  if (t.safety) look.push(`${t.safety} safety ${t.safety === 1 ? "call" : "calls"}: the agent stopped, sent them outside and flagged it. Worth checking these were followed up.`);
  if (t.unhappy) look.push(`${t.unhappy} unhappy ${t.unhappy === 1 ? "customer" : "customers"} rated the job 3 or below and asked for a call back.`);
  if (openHandoffs.length) look.push(`${openHandoffs.length} ${openHandoffs.length === 1 ? "item is" : "items are"} still waiting on a human.`);
  if (t.afterHours && t.total) {
    const pct = Math.round((t.afterHours / t.total) * 100);
    if (pct >= 40) look.push(`${pct}% of everything arrived outside normal hours, which is where the agents earn their keep.`);
  }
  if (!look.length) look.push("Nothing needs a person this week.");

  // Section 4: next steps that follow from the numbers, not boilerplate.
  const next = [];
  if (!ticket) next.push("Tell us your average job value so the revenue line stops reading \"not tracked yet\".");
  if (t.leads && !t.bookings) next.push("Enquiries came in but none converted to a booking. Worth reading the transcripts together.");
  if (t.unhappy) next.push("Call the customers who rated 3 or below before they decide on their own.");
  if (t.bookings >= 3 && !t.safety) next.push("Steady week. The phone agent is the next thing that would add volume.");
  if (!next.length) next.push("Nothing to change. Leave it running.");

  return {
    client, business, days: span,
    from, to,
    headline,
    numbers,
    look: look.slice(0, 3),
    next: next.slice(0, 3),
    totals: t,
    rows: rows.map(r => ({
      at: r.at, kind: r.kind, reason: r.reason || null,
      name: r.name || null, problem: r.problem || r.detail || null,
      preferred: r.preferred || null, handled: !!r.handledAt
    }))
  };
}

module.exports = { build, NOT_TRACKED };
