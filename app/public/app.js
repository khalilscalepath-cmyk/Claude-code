/* Front Desk — talks to /api/agent. No API key in the browser, no suggested lines: you type
   what a real customer would and see whether it actually understood. */

const $ = id => document.getElementById(id);
const qs = new URLSearchParams(location.search);
const CLIENT = (qs.get("c") || qs.get("client") || "northside-hvac").toLowerCase();
const AGENCY = qs.get("by") || "Scalepath";

let P = null;                       // the client profile
const KEY = "fd:" + CLIENT;         // records live per client, per browser

// Tab ids are short for the UI; the brain's channels have their own names.
const CHANNEL_OF = { chat: "chat", mail: "email", call: "voice", rev: "review" };

const CH = {
  chat:  { turns: [], busy: false },
  mail:  { turns: [], busy: false },
  call:  { turns: [], busy: false },
  rev:   { turns: [], busy: false },
};
for (const k of Object.keys(CH)) {
  CH[k].stream = $("s-" + k); CH[k].input = $("i-" + k); CH[k].go = $("g-" + k);
}

const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g,
  c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clock = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const bottom = el => { el.scrollTop = el.scrollHeight; };

/* ---------------------------------------------------------------- records */
function loadRecs() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
}
function saveRecs(r) {
  try { localStorage.setItem(KEY, JSON.stringify(r.slice(0, 60))); } catch (e) { /* private mode */ }
}
function addRec(rec) {
  const r = loadRecs();
  r.unshift(Object.assign({ at: new Date().toISOString() }, rec));
  saveRecs(r); renderRecs();
}
function renderRecs() {
  const el = $("s-rec"), recs = loadRecs();
  if (!recs.length) {
    el.innerHTML = `<div class="empty"><b>Nothing booked yet</b>
      <p>Every booking, escalation and opt-out the agents produce lands here, with what a tech
      needs before knocking.</p></div>`;
    return;
  }
  el.innerHTML = "";
  for (const d of recs) {
    const kind = d.kind || "booking";
    const sev = kind === "booking" ? (d.urgency || "routine")
              : kind === "escalation" ? (d.reason === "safety" ? "safety" : "escalation") : "routine";
    const title = kind === "booking" ? (d.name || "Booking")
                : kind === "escalation" ? "Escalation" : "Opted out";
    const rows = [];
    const add = (k, v) => { if (v) rows.push(`<dt>${k}</dt><dd>${esc(v)}</dd>`); };
    add("phone", d.phone); add("address", d.address); add("service", d.service);
    add("problem", d.problem || d.detail); add("wants", d.preferred);
    add("situation", d.situation); add("notes", d.notes); add("reason", d.reason);
    add("channel", d.channel);
    el.insertAdjacentHTML("beforeend", `<article class="rec">
      <div class="rh"><b>${esc(title)}</b><span class="tag ${sev}">${esc(sev)}</span>
      <span class="when">${esc(new Date(d.at).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }))}</span></div>
      ${rows.length ? `<dl class="kv">${rows.join("")}</dl>` : ""}</article>`);
  }
}

/* ---------------------------------------------------------------- painting */
function paint(ch, role, text) {
  const B = P.business;
  if (ch === "mail") {
    const el = document.createElement("article");
    el.className = "mail";
    const who = role === "user" ? (P.lead && P.lead.name) || "Customer" : `${B.owner_or_office}, ${B.name}`;
    const addr = role === "user" ? (P.lead && P.lead.email) || "" : "office";
    el.innerHTML = `<div class="hd"><b>${esc(who)}</b><span>${esc(addr)}</span>
      <span style="margin-left:auto">${esc(clock())}</span></div><div class="bd"></div>`;
    el.querySelector(".bd").textContent = text;
    return el;
  }
  if (ch === "call") {
    const el = document.createElement("div");
    el.className = "line " + (role === "user" ? "c" : "a");
    el.innerHTML = `<span class="sp"></span><span class="sd"></span>`;
    el.querySelector(".sp").textContent = role === "user" ? "Caller" : P.agent_name;
    el.querySelector(".sd").textContent = text;
    return el;
  }
  const el = document.createElement("div");
  el.className = "msg " + (role === "user" ? "cust" : "agent");
  el.textContent = text;
  return el;
}
function bodyOf(el) { return el.querySelector(".bd") || el.querySelector(".sd") || el; }

function flag(ch, text, kind) {
  const n = document.createElement("div");
  n.className = "flag" + (kind ? " " + kind : "");
  n.innerHTML = `<b>${kind === "err" ? "Problem" : kind === "bad" ? "Flagged" : "Captured"}</b> — ${esc(text)}`;
  CH[ch].stream.appendChild(n);
  bottom(CH[ch].stream);
}

/* ---------------------------------------------------------------- the call */
async function ask(ch) {
  const c = CH[ch];
  const ph = paint(ch, "assistant", "…");
  ph.classList.add("wait");
  c.stream.appendChild(ph);
  bottom(c.stream);

  let data;
  try {
    const res = await fetch("api/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ client: CLIENT, channel: CHANNEL_OF[ch], turns: c.turns.slice(-20) })
    });
    data = await res.json();
    if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
  } catch (err) {
    ph.remove();
    flag(ch, err.message, "err");
    return;
  }

  ph.classList.remove("wait");
  bodyOf(ph).textContent = data.reply || "(no reply)";
  c.turns.push({ role: "assistant", content: data.reply || "" });
  if (data.provider) $("prov").textContent = data.provider;

  for (const m of data.markers || []) {
    addRec(Object.assign({ channel: ch }, m));
    flag(ch,
      m.kind === "booking" ? "Booked — it's under Jobs. The office confirms the time."
      : m.kind === "escalation" ? (m.reason === "safety"
          ? "Safety stop. It refused to book or quote and sent them outside. Under Jobs."
          : "Handed to a human rather than answered. Under Jobs.")
      : "Opted out. That number is never messaged again.",
      m.kind === "escalation" && m.reason === "safety" ? "bad" : "");
  }
  if (ch === "call" && speakOn) speak(data.reply);
  bottom(c.stream);
}

async function send(ch) {
  const c = CH[ch];
  const text = c.input.value.trim();
  if (!text || c.busy) return;
  c.busy = true; c.go.disabled = true;
  c.input.value = ""; c.input.style.height = "";
  const e = c.stream.querySelector(".empty"); if (e) e.remove();
  c.stream.appendChild(paint(ch, "user", text));
  bottom(c.stream);
  c.turns.push({ role: "user", content: text });
  try { await ask(ch); } finally { c.busy = false; c.go.disabled = false; c.input.focus(); }
}

for (const ch of Object.keys(CH)) {
  CH[ch].go.addEventListener("click", () => send(ch));
  CH[ch].input.addEventListener("keydown", ev => {
    if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); send(ch); }
  });
  CH[ch].input.addEventListener("input", () => {
    const t = CH[ch].input;
    t.style.height = ""; t.style.height = Math.min(t.scrollHeight, 120) + "px";
  });
}

/* ---------------------------------------------------------------- voice out */
let speakOn = false, voice = null;
function pickVoice() {
  try {
    const v = speechSynthesis.getVoices() || [];
    voice = v.find(x => /en-US/i.test(x.lang) && /samantha|jenny|aria|zira|female/i.test(x.name))
         || v.find(x => /en-US/i.test(x.lang)) || v[0] || null;
  } catch (e) { voice = null; }
}
if ("speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.addEventListener("voiceschanged", pickVoice);
} else { $("sound").hidden = true; }

function speak(t) {
  if (!speakOn || !t || !("speechSynthesis" in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    if (voice) u.voice = voice;
    u.rate = 1.06;
    speechSynthesis.speak(u);
  } catch (e) { /* no voice here */ }
}
$("sound").addEventListener("click", ev => {
  speakOn = !speakOn;
  ev.currentTarget.setAttribute("aria-pressed", String(speakOn));
  if (speakOn) {
    const last = [...CH.call.turns].reverse().find(t => t.role === "assistant");
    if (last) speak(last.content);
  } else { try { speechSynthesis.cancel(); } catch (e) {} }
});

/* ---------------------------------------------------------------- tabs */
const TABS = ["chat", "mail", "call", "rev", "rec"];
function show(t) {
  for (const p of TABS) $("p-" + p).hidden = (p !== t);
  for (const b of $("tabs").querySelectorAll("button"))
    b.setAttribute("aria-selected", String(b.dataset.t === t));
  if (CH[t]) { bottom(CH[t].stream); CH[t].input.focus({ preventScroll: true }); }
  if (t === "rec") renderRecs();
  history.replaceState(null, "", "#" + t);
}
$("tabs").addEventListener("click", ev => {
  const b = ev.target.closest("button[data-t]");
  if (b) show(b.dataset.t);
});

$("reset").addEventListener("click", () => {
  for (const k of Object.keys(CH)) { CH[k].turns = []; CH[k].stream.innerHTML = ""; }
  try { localStorage.removeItem(KEY); } catch (e) {}
  seed();
  renderRecs();
  show("chat");
});

/* ---------------------------------------------------------------- seeds */
function seed() {
  const B = P.business;

  $("s-chat").innerHTML = "";
  $("s-chat").insertAdjacentHTML("beforeend",
    `<div class="empty"><b>No messages yet</b><p>Type what a customer would actually send.
     Try something awkward — an emergency, a price question, or a gas smell.</p></div>`);

  // email: the form submission is already the customer's first turn
  const lead = P.lead || {
    name: "Marcus Hale", phone: "(602) 555-8831", email: "m.hale@example.com",
    msg: "AC is blowing warm and it's over 100 out. How soon can someone come?"
  };
  P.lead = lead;
  $("s-mail").innerHTML = "";
  const card = document.createElement("article");
  card.className = "mail form";
  card.innerHTML = `<div class="hd"><b>New form submission</b><span>website</span>
    <span style="margin-left:auto">${esc(clock())}</span></div><div class="bd"></div>`;
  card.querySelector(".bd").textContent =
    `name:  ${lead.name}\nphone: ${lead.phone}\nemail: ${lead.email}\n\n${lead.msg}`;
  $("s-mail").appendChild(card);
  CH.mail.turns = [{ role: "user", content:
    `A new form submission came in from the website just now.\nName: ${lead.name}\n` +
    `Phone: ${lead.phone}\nEmail: ${lead.email}\nMessage: ${lead.msg}\n\nWrite the first reply.` }];
  ask("mail");

  // phone: the greeting is fixed, not generated
  const greet = `${B.name}, this is ${P.agent_name}. Calls may be recorded. How can I help?`;
  $("s-call").innerHTML = "";
  $("s-call").appendChild(paint("call", "assistant", greet));
  CH.call.turns = [{ role: "assistant", content: greet }];

  // reviews: first outbound is a template, as in production
  const first = `Hey ${(lead.name || "there").split(" ")[0]}, it's ${B.owner_or_office} from ` +
    `${B.name} — we were out yesterday. How did we do, 1 to 5?`;
  $("s-rev").innerHTML = "";
  $("s-rev").appendChild(paint("rev", "assistant", first));
  CH.rev.turns = [{ role: "assistant", content: first }];
  const stars = document.createElement("div");
  stars.className = "stars";
  for (let i = 1; i <= 5; i++) {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = String(i);
    b.setAttribute("aria-label", i + " out of 5");
    b.addEventListener("click", () => {
      stars.remove();
      CH.rev.input.value = String(i);
      send("rev");
    });
    stars.appendChild(b);
  }
  $("s-rev").appendChild(stars);
}

/* ---------------------------------------------------------------- boot */
(async () => {
  try {
    const res = await fetch("api/profile?client=" + encodeURIComponent(CLIENT));
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || "could not load the client profile");
    P = j.profile;
  } catch (e) {
    $("foot").textContent = "Couldn't load the client profile: " + e.message;
    $("dot").className = "dot bad";
    $("prov").textContent = "offline";
    return;
  }

  const B = P.business;
  document.title = B.name + " — Front Desk";
  $("bizName").textContent = B.name;
  $("mark").textContent = B.name.split(/\s+/).filter(w => /^[A-Za-z]/.test(w))
    .slice(0, 2).map(w => w[0].toUpperCase()).join("");
  $("dot").className = "dot ok";
  $("prov").textContent = "ready";
  $("h-chat").textContent =
    `A customer texts ${B.name}. Type anything a real one would.`;
  $("foot").textContent = `${B.trade} · ${B.service_area_short || B.service_area}`;
  // Never let a demo pass as the business's own service.
  const flag = $("demoFlag");
  flag.textContent = `Demo prepared for ${B.name} by ${AGENCY}`;
  flag.hidden = false;

  seed();
  renderRecs();
  const h = (location.hash.slice(1) || "").replace(/[^a-z]/g, "");
  show(TABS.includes(h) ? h : "chat");
})();
