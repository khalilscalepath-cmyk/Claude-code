#!/usr/bin/env node
/**
 * Compile a client profile into finished agent prompts.
 *
 *   node brains/compile.js --client ac-handyman --all --out out/ach/
 *   node brains/compile.js --client ac-handyman --channel voice
 *   node brains/compile.js --client ac-handyman --all --full      # the long documented build
 *
 * This is the ONE compiler. The app serves prompts from the same app/lib/brain.js, so what you
 * paste into GoHighLevel or a voice platform is byte-identical to what the web agent answers with.
 *
 * Compact is the default because free-tier accounts meter tokens per minute: the full build is
 * about 4,200 tokens, which on an 8,000/min ceiling is two replies a minute.
 */
const path = require("path");
const fs = require("fs");
const B = require(path.join(__dirname, "..", "app", "lib", "brain.js"));

const VOICE_CEILING = 2000;
const argv = process.argv.slice(2);
const flag = n => argv.includes("--" + n);
const val = n => { const i = argv.indexOf("--" + n); return i > -1 ? argv[i + 1] : null; };

const client = val("client");
const channel = val("channel");
const out = val("out");
const full = flag("full");

if (!client || (!channel && !flag("all"))) {
  console.error("usage: node brains/compile.js --client <slug> (--channel <chat|email|voice|review> | --all) [--out dir] [--full]");
  console.error("clients: " + B.listClients().join(", "));
  process.exit(2);
}

let profile;
try { profile = B.loadProfile(client); }
catch (e) { console.error(e.message); process.exit(1); }

const link = ((profile.review || {}).link || "");
if (!/^https?:\/\//i.test(link) || /example|replace/i.test(link)) {
  console.error("  ! review.link is still a placeholder - the review agent would send a dead link");
}

const channels = channel ? [channel] : Object.keys(B.CHANNELS);
for (const ch of channels) {
  let text;
  try { text = B.build(profile, ch, { full }); }
  catch (e) { console.error(`  ! ${ch}: ${e.message}`); continue; }

  const tok = Math.round(text.length / 4);
  const left = text.match(/\{\{\w+\}\}/g);
  if (left) console.error(`  ! ${ch}: unfilled placeholders ${[...new Set(left)].join(", ")}`);
  if (ch === "voice" && tok > VOICE_CEILING)
    console.error(`  ! voice is ~${tok} tokens, over the ${VOICE_CEILING} ceiling - it will lag on calls`);

  if (out) {
    fs.mkdirSync(out, { recursive: true });
    const f = path.join(out, `${client}-${ch}${full ? "-full" : ""}.md`);
    fs.writeFileSync(f, text);
    console.log(`  ${f}  (~${tok} tokens)`);
  } else {
    console.log(text);
  }
}
