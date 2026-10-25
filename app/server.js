#!/usr/bin/env node
/**
 * Local server — zero dependencies, nothing to install.
 *
 *   cp app/.env.example app/.env     # add one free key
 *   node app/server.js               # http://localhost:8787
 *
 * The same lib/ runs unchanged on Vercel, Netlify or Cloudflare. See app/README.md.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { handle, profileFor } = require("./lib/handler");
const { configured } = require("./lib/providers");

// Minimal .env loader, so there is nothing to npm install.
(function loadEnv() {
  for (const f of [path.join(__dirname, ".env"), path.join(__dirname, "..", ".env")]) {
    if (!fs.existsSync(f)) continue;
    for (const line of fs.readFileSync(f, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
})();

const PORT = Number(process.env.PORT || 8787);
const PUBLIC = path.join(__dirname, "public");
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
                ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
                ".ico": "image/x-icon" };

const json = (res, status, obj) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(obj));
};

http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/agent") {
    if (req.method !== "POST") return json(res, 405, { error: "POST only" });
    let raw = "";
    req.on("data", c => {
      raw += c;
      if (raw.length > 1e6) { req.destroy(); }
    });
    req.on("end", async () => {
      let body = {};
      try { body = JSON.parse(raw || "{}"); } catch (e) { return json(res, 400, { error: "bad JSON" }); }
      const out = await handle(body);
      json(res, out.status, out.json);
    });
    return;
  }

  if (url.pathname === "/api/profile") {
    const out = profileFor(url.searchParams.get("client"));
    return json(res, out.status, out.json);
  }

  // static
  let p = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = path.join(PUBLIC, path.normalize(p).replace(/^(\.\.[/\\])+/, ""));
  if (!file.startsWith(PUBLIC) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain" });
    return res.end("not found");
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => {
  const keys = configured().map(p => p.name);
  console.log(`\n  Front Desk running:  http://localhost:${PORT}`);
  console.log(keys.length
    ? `  Providers ready:     ${keys.join(" -> ")}\n`
    : `  NO API KEY SET. Add one to app/.env (see app/.env.example) and restart.\n`);
});
