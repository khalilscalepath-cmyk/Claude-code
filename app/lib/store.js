/**
 * Persistence for the console: clients, leads, bookings, escalations, conversations.
 *
 * Deliberately a flat JSON-lines file per collection, with no database and no dependencies, so it
 * runs on the same free hosting as everything else and can be read with `cat` when something looks
 * wrong. It is the right size for a few hundred records per client per month, which is what a
 * handful of trade businesses actually produce. When one client outgrows it, the shape below maps
 * onto Postgres without changing a caller.
 *
 * Append-only by design: an agent writing a booking must never be able to lose an earlier one, and
 * a crash mid-write costs the last line rather than the file.
 */
const fs = require("fs");
const path = require("path");

const DIR = process.env.STORE_DIR || path.join(__dirname, "..", "..", "data");
const COLLECTIONS = ["records", "conversations", "reviews"];

function file(name) {
  if (!COLLECTIONS.includes(name)) throw new Error(`unknown collection "${name}"`);
  return path.join(DIR, name + ".jsonl");
}

function ensure() {
  fs.mkdirSync(DIR, { recursive: true });
}

function id() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Append one row. Returns the stored row, including the id and timestamp it was given. */
function add(collection, row) {
  ensure();
  const stored = Object.assign({ id: id(), at: new Date().toISOString() }, row);
  fs.appendFileSync(file(collection), JSON.stringify(stored) + "\n", "utf8");
  return stored;
}

/**
 * Read rows back, newest first.
 * `where` matches on exact equality for every key given, so list({client, kind}) reads naturally.
 */
function list(collection, where, limit) {
  ensure();
  const f = file(collection);
  if (!fs.existsSync(f)) return [];
  const rows = [];
  for (const line of fs.readFileSync(f, "utf8").split("\n")) {
    if (!line.trim()) continue;
    let row;
    try { row = JSON.parse(line); } catch (e) { continue; }   // skip a torn last line
    if (where && Object.keys(where).some(k => where[k] !== undefined && row[k] !== where[k])) continue;
    rows.push(row);
  }
  rows.reverse();
  return limit ? rows.slice(0, limit) : rows;
}

/** Mark a record handled. Rewrites the file, which is fine at this size and rare in practice. */
function update(collection, rowId, patch) {
  ensure();
  const f = file(collection);
  if (!fs.existsSync(f)) return null;
  let found = null;
  const out = fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map(line => {
    let row;
    try { row = JSON.parse(line); } catch (e) { return line; }
    if (row.id !== rowId) return line;
    found = Object.assign(row, patch, { updatedAt: new Date().toISOString() });
    return JSON.stringify(found);
  });
  if (found) fs.writeFileSync(f, out.join("\n") + "\n", "utf8");
  return found;
}

/** The numbers the console header shows, and the ones a weekly client report is built from. */
function summary(client, sinceDays) {
  const since = sinceDays
    ? new Date(Date.now() - sinceDays * 864e5).toISOString()
    : null;
  const rows = list("records", client ? { client } : null)
    .filter(r => !since || r.at >= since);

  const count = k => rows.filter(r => r.kind === k).length;
  return {
    bookings: count("booking"),
    escalations: count("escalation"),
    safety: rows.filter(r => r.kind === "escalation" && r.reason === "safety").length,
    leads: count("lead"),
    optouts: count("optout"),
    openItems: rows.filter(r => r.kind !== "lead" && !r.handledAt).length,
    afterHours: rows.filter(r => {
      const h = new Date(r.at).getHours();
      return h >= 19 || h < 7;
    }).length,
    total: rows.length
  };
}

/** Which clients have records, for the console's client switcher. */
function clients() {
  const seen = new Map();
  for (const r of list("records")) {
    if (!r.client) continue;
    if (!seen.has(r.client)) seen.set(r.client, { client: r.client, last: r.at, count: 0 });
    seen.get(r.client).count++;
  }
  return [...seen.values()].sort((a, b) => (a.last < b.last ? 1 : -1));
}

module.exports = { add, list, update, summary, clients, DIR };
