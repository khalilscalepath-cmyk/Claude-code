/** The one request handler, shared by the local server and every serverless target. */
const { ask } = require("./providers");
const { build, loadProfile, stripMarkers, readMarkers, CHANNELS } = require("./brain");

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
    return {
      status: 200,
      json: {
        reply: stripMarkers(out.text),
        markers: readMarkers(out.text),
        provider: out.provider,
        model: out.model
      }
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

module.exports = { handle, profileFor, corsHeaders };
