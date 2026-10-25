/** The one request handler, shared by the local server and every serverless target. */
const { ask } = require("./providers");
const { build, loadProfile, stripMarkers, readMarkers, CHANNELS } = require("./brain");
const store = require("./store");
const report = require("./report");
const crypto = require("crypto");

const MAX_TURNS = 24;
const MAX_CHARS = 4000;

async function handle(body) {
  const b = body || {};
  const channel = String(b.channel || "chat");
  const client = String(b.client || "northside-hvac");

  if (!CHANNELS[channel]) return { status: 400, json: { error: `unknown channel "${channel}"` } };
  if (!Array.isArray(b.turns) || !b.turns.length)
    return { status: 400, json: { error: "turns must be a non-empty array" } };

  const turns = b.turns
    .filter(t => t && (t.role === "user" || t.role === "assistant") && typeof t.content === "string")
    .map(t => ({ role: t.role, content: t.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS);

  if (!turns.length || turns[turns.length - 1].role !== "user")
    return { status: 400, json: { error: "the last turn must be the customer's" } };

  let profile;
  try { profile = loadProfile(client); }
  catch (e) { return { status: 404, json: { error: e.message } }; }

  const system = build(profile, channel);

  try {
    // Generous caps: reasoning models bill their thinking against this before writing a word.
    const out = await ask(system, turns, { maxTokens: channel === "voice" ? 800 : 1500 });
    const reply = stripMarkers(out.text);
    const markers = readMarkers(out.text);

    // Anything the agent captured is the whole point: persist it before replying, so a booking
    // survives the customer closing the tab.
    for (const m of markers) {
      try { store.add("records", Object.assign({ client, channel }, m)); }
      catch (e) { console.error("could not store a " + m.kind + ": " + e.message); }
    }

    return {
      status: 200,
      json: { reply, markers, provider: out.provider, model: out.model }
    };
  } catch (e) {
    return {
      status: e.status || 500,
      json: { error: e.message, tried: e.tried || [] }
    };
  }
}

/** Everything the page needs to render itself for a client. */
function profileFor(client) {
  try {
    const p = loadProfile(String(client || "northside-hvac"));
    return { status: 200, json: { profile: p } };
  } catch (e) {
    return { status: 404, json: { error: e.message } };
  }
}

/**
 * The client's site lives on its own domain and this API on another, so the browser preflights
 * every chat message. Without these the widget fails silently on the one page that matters.
 * ALLOWED_ORIGINS (comma separated) locks it down; unset allows any origin, which is fine for a
 * read-only agent holding no user data but should be set once the client's domain is known.
 */
function corsHeaders(origin) {
  const allow = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  const ok = !allow.length ? "*" : (allow.includes(origin) ? origin : "");
  const h = {
    "access-control-allow-methods": "POST, GET, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400"
  };
  if (ok) h["access-control-allow-origin"] = ok;
  if (allow.length) h["vary"] = "Origin";
  return h;
}

/** The website form, and the review page's star clicks. Both are public by design. */
function capture(kind, body) {
  const b = body || {};
  const client = String(b.client || "").toLowerCase();
  if (!client) return { status: 400, json: { error: "client is required" } };

  if (kind === "lead") {
    if (!b.phone && !b.email) return { status: 400, json: { error: "a phone or email is required" } };
    const row = store.add("records", {
      client, kind: "lead", channel: "website",
      name: String(b.name || "").slice(0, 200),
      phone: String(b.phone || "").slice(0, 60),
      email: String(b.email || "").slice(0, 200),
      problem: String(b.message || "").slice(0, 4000)
    });
    return { status: 200, json: { ok: true, id: row.id } };
  }

  // review page: a rating, and optionally what went wrong
  const rating = Number(b.rating);
  const row = store.add("reviews", {
    client,
    contact: String(b.contact || "").slice(0, 120),
    rating: Number.isFinite(rating) ? rating : null,
    feedback: String(b.feedback || "").slice(0, 4000),
    alertOwner: !!b.alert_owner
  });
  // An unhappy customer is a job for a human, not a row in a table nobody opens.
  if (Number.isFinite(rating) && rating <= 3) {
    store.add("records", {
      client, kind: "escalation", channel: "review", reason: "low_rating",
      detail: `Rated ${rating}. ${String(b.feedback || "").slice(0, 500)}`.trim(),
      phone: String(b.phone || "")
    });
  }
  return { status: 200, json: { ok: true, id: row.id } };
}

/** Console reads. Behind a shared token: these are real customers' names and numbers. */
function consoleData(query, token) {
  const expected = (process.env.CONSOLE_TOKEN || "").trim();
  if (!expected) return { status: 503, json: { error: "CONSOLE_TOKEN is not set on the server" } };
  if (token !== expected) return { status: 401, json: { error: "wrong or missing token" } };

  const client = query.client && query.client !== "all" ? String(query.client) : null;
  const days = Number(query.days) || 30;
  const since = new Date(Date.now() - days * 864e5).toISOString();

  const records = store.list("records", client ? { client } : null, 400)
    .filter(r => r.at >= since);

  return {
    status: 200,
    json: {
      clients: store.clients(),
      summary: store.summary(client, days),
      records,
      days,
      client: client || "all"
    }
  };
}

function markHandled(body, token) {
  const expected = (process.env.CONSOLE_TOKEN || "").trim();
  if (!expected || token !== expected) return { status: 401, json: { error: "wrong or missing token" } };
  const row = store.update("records", String((body || {}).id || ""), { handledAt: new Date().toISOString() });
  return row ? { status: 200, json: { ok: true, row } } : { status: 404, json: { error: "no such record" } };
}

/**
 * A client's own link key, derived from the console token rather than stored. No key table, and
 * rotating CONSOLE_TOKEN revokes every client link at once.
 */
function clientKey(client) {
  const secret = (process.env.CONSOLE_TOKEN || "").trim();
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update("client:" + String(client)).digest("hex").slice(0, 24);
}

/** The client's own report. Readable with their key, or with the console token. */
function reportFor(query, token) {
  const client = String(query.client || "").toLowerCase();
  if (!client) return { status: 400, json: { error: "client is required" } };

  const secret = (process.env.CONSOLE_TOKEN || "").trim();
  if (!secret) return { status: 503, json: { error: "CONSOLE_TOKEN is not set on the server" } };

  const key = String(query.k || "");
  const expected = clientKey(client);
  const ok = (token && token === secret) ||
    (key && expected && key.length === expected.length &&
     crypto.timingSafeEqual(Buffer.from(key), Buffer.from(expected)));
  if (!ok) return { status: 401, json: { error: "this link is not valid" } };

  try {
    return { status: 200, json: report.build(client, Number(query.days) || 7) };
  } catch (e) {
    return { status: 500, json: { error: e.message } };
  }
}

module.exports = { handle, profileFor, corsHeaders, capture, consoleData, markHandled,
                   reportFor, clientKey };
