/** Serves the client profile so the page renders their real details. */
const { profileFor } = require("../lib/handler");

module.exports = async function (req, res) {
  const url = new URL(req.url, "http://localhost");
  const out = profileFor(url.searchParams.get("client"));
  res.statusCode = out.status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(out.json));
};
