/** Vercel / Netlify-compatible serverless entry point. The API key never leaves the server. */
const { handle } = require("../lib/handler");

module.exports = async function (req, res) {
  if (req.method === "OPTIONS") { res.statusCode = 204; return res.end(); }
  if (req.method !== "POST") {
    res.statusCode = 405; res.setHeader("content-type", "application/json");
    return res.end(JSON.stringify({ error: "POST only" }));
  }
  let body = req.body;
  if (!body || typeof body === "string") {
    try { body = JSON.parse(body || "{}"); } catch (e) { body = {}; }
  }
  const out = await handle(body);
  res.statusCode = out.status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(out.json));
};
