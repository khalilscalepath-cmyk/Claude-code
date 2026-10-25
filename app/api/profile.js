/** Serves the client profile so the page renders their real details. */
const { profileFor, corsHeaders } = require("../lib/handler");

module.exports = async function (req, res) {
  for (const [k, v] of Object.entries(corsHeaders(req.headers.origin || ""))) res.setHeader(k, v);
  if (req.method === "OPTIONS") { res.statusCode = 204; return res.end(); }
  const url = new URL(req.url, "http://localhost");
  const out = profileFor(url.searchParams.get("client"));
  res.statusCode = out.status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(out.json));
};
