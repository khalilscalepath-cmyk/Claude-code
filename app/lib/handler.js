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
    const out = await ask(system, turns, { maxTokens: channel === "voice" ? 300 : 700 });
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

module.exports = { handle, profileFor };
