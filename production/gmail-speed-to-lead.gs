/**
 * Speed-to-lead email agent — runs on the CLIENT's own Google account.
 *
 * Why Apps Script: it's free, it runs every minute whether or not anyone's laptop is open, and it
 * lives in the client's account, so you are never the single point of failure and they keep their
 * own data. No server, no hosting bill, no Zapier seat.
 *
 * What it does, end to end:
 *   website form -> email into their inbox -> this script (<=1 min) -> Claude writes the reply
 *   -> sent (or drafted, in review mode) -> booking appended to a Google Sheet the office opens.
 *
 * INSTALL (about 10 minutes, once per client — do it on a screen share)
 *  1. In the client's Google account: sheets.new, call it "<Business> Bookings". Copy its id from
 *     the URL (the long string between /d/ and /edit).
 *  2. Extensions -> Apps Script. Paste this whole file in. Rename the project.
 *  3. Project Settings -> Script properties -> add ONE free model key plus the sheet id:
 *        GROQ_KEY        gsk_...     console.groq.com/keys        (fastest)
 *        GEMINI_KEY      AIza...     aistudio.google.com/apikey   (biggest daily allowance)
 *        OPENROUTER_KEY  sk-or-...   openrouter.ai/keys           (backup)
 *        SHEET_ID        the id from step 1
 *     Set more than one and they are tried in order, so a rate limit falls through
 *     instead of dropping the lead.
 *  4. Paste the compiled email brain into BRAIN below:
 *        python3 brains/compile.py --client <client> --channel email
 *  5. Set LEAD_QUERY to match how their form arrives (see below).
 *  6. Run setup() once. Approve the permissions prompt. It creates the labels and the 1-minute
 *     trigger, and writes the Sheet header.
 *  7. Leave REVIEW_MODE = true for the first two weeks: it drafts instead of sending, the office
 *     reads each one, and you fix the brain from what they change. Then flip it to false.
 *
 * COST: nothing. These are free tiers, and a home-service shop's lead volume is nowhere near the
 * daily caps. Create the key on the CLIENT's own account where you can — then there is no usage of
 * yours to meter and nothing to reconcile when they leave. Free-tier limits move around; if a model
 * name stops working, change MODELS below rather than the code.
 *
 * LIMITS to know before you promise anything: Gmail sends are capped (about 100/day on a free
 * account, 1,500 on Workspace) and Apps Script gets about 90 minutes of runtime a day. Both are far
 * above a home-service shop's lead volume. The trigger runs every minute, so the worst case is
 * about a 2-minute reply, not 5.
 */

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

/** Gmail search that matches an incoming lead and nothing else. Tighten it per client. */
var LEAD_QUERY = 'is:unread (from:noreply@web3forms.com OR subject:"New form submission") -label:lead-handled';

var REVIEW_MODE   = true;   // true = create a draft for the office to send. Start here. Always.
/** Model per provider. Override if a provider's console says the default is gone. */
var MODELS = {
  groq:       'llama-3.3-70b-versatile',
  gemini:     'gemini-2.0-flash',
  openrouter: 'meta-llama/llama-3.3-70b-instruct:free'
};
var MAX_PER_RUN   = 5;      // threads per minute; protects the daily send quota
var LABEL_DONE    = 'lead-handled';
var LABEL_REVIEW  = 'lead-needs-human';
var SHEET_TAB     = 'Bookings';

/** The compiled email brain. Replace wholesale from compile.py — don't hand-edit it here. */
var BRAIN = [
  'PASTE THE OUTPUT OF:',
  '  python3 brains/compile.py --client <client> --channel email',
  'The script refuses to run until you do.'
].join('\n');

// ---------------------------------------------------------------------------
// Entry point — the trigger calls this every minute
// ---------------------------------------------------------------------------

function processInbox() {
  if (BRAIN.indexOf('PASTE THE OUTPUT OF') !== -1) {
    throw new Error('BRAIN is still the placeholder. Compile it and paste it in before running.');
  }
  // Overlapping runs would answer the same lead twice. Skip rather than queue.
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;

  try {
    var threads = GmailApp.search(LEAD_QUERY, 0, MAX_PER_RUN);
    for (var i = 0; i < threads.length; i++) {
      try {
        handleThread(threads[i]);
      } catch (err) {
        // One bad lead must never stop the rest, and must never be silently dropped.
        flagForHuman(threads[i], 'Agent failed: ' + err.message);
        console.error('thread ' + threads[i].getId() + ': ' + err.message);
      }
    }
  } finally {
    lock.releaseLock();
  }
}

function handleThread(thread) {
  var msgs = thread.getMessages();
  var turns = buildTurns(msgs);
  if (!turns.length) { markDone(thread); return; }

  var reply = askClaude(turns);
  var markers = readMarkers(reply);
  var body = stripMarkers(reply);

  if (!body) throw new Error('empty reply from the model');

  var last = msgs[msgs.length - 1];
  if (REVIEW_MODE) {
    last.createDraftReply(body);
  } else {
    last.reply(body);
  }

  for (var i = 0; i < markers.length; i++) {
    var m = markers[i];
    if (m.kind === 'booking')    appendRow(m, thread, 'booking');
    if (m.kind === 'escalation') { appendRow(m, thread, 'escalation'); flagForHuman(thread, m.reason || 'escalated'); }
  }

  thread.markRead();
  markDone(thread);
}

// ---------------------------------------------------------------------------
// Conversation
// ---------------------------------------------------------------------------

/**
 * Turn a Gmail thread into sample-style turns. The business's own sent messages become assistant
 * turns so the agent never repeats itself or re-asks a filled slot.
 */
function buildTurns(msgs) {
  var me = Session.getActiveUser().getEmail().toLowerCase();
  var turns = [];
  for (var i = 0; i < msgs.length; i++) {
    var m = msgs[i];
    var from = String(m.getFrom() || '').toLowerCase();
    var text = cleanBody(m.getPlainBody());
    if (!text) continue;
    var mine = from.indexOf(me) !== -1;
    turns.push({ role: mine ? 'assistant' : 'user', content: text.slice(0, 6000) });
  }
  // The model must be answering something: the last turn has to be the customer's.
  while (turns.length && turns[turns.length - 1].role === 'assistant') turns.pop();
  return turns.slice(-12);
}

/** Strip quoted history and signatures so the model reads the new message, not the whole thread. */
function cleanBody(s) {
  if (!s) return '';
  return String(s)
    .replace(/^\s*On .*wrote:[\s\S]*$/m, '')
    .replace(/^\s*>.*$/gm, '')
    .replace(/^--\s*$[\s\S]*$/m, '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function askClaude(turns) {
  var props = PropertiesService.getScriptProperties();
  var tried = [];

  var providers = [
    { name: 'groq',       prop: 'GROQ_KEY' },
    { name: 'gemini',     prop: 'GEMINI_KEY' },
    { name: 'openrouter', prop: 'OPENROUTER_KEY' }
  ];

  var any = false;
  for (var i = 0; i < providers.length; i++) {
    var key = (props.getProperty(providers[i].prop) || '').trim();
    if (!key) continue;
    any = true;
    try {
      var text = callProvider(providers[i].name, key, turns);
      if (text) return text;
      tried.push(providers[i].name + ': empty reply');
    } catch (e) {
      tried.push(providers[i].name + ': ' + e.message);
      // a rate limit or outage is exactly what the next provider is for
    }
  }

  if (!any) throw new Error('No model key set. Add GROQ_KEY, GEMINI_KEY or OPENROUTER_KEY in Script properties.');
  throw new Error('All providers failed — ' + tried.join(' | '));
}

function callProvider(name, key, turns) {
  var url, options, model = MODELS[name];

  if (name === 'gemini') {
    var contents = [];
    for (var i = 0; i < turns.length; i++) {
      contents.push({
        role: turns[i].role === 'assistant' ? 'model' : 'user',
        parts: [{ text: turns[i].content }]
      });
    }
    url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent';
    options = {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      headers: { 'x-goog-api-key': key },
      payload: JSON.stringify({
        systemInstruction: { parts: [{ text: BRAIN }] },
        contents: contents,
        generationConfig: { maxOutputTokens: 900, temperature: 0.6 }
      })
    };
  } else {
    // Groq and OpenRouter are both OpenAI-shaped
    var msgs = [{ role: 'system', content: BRAIN }].concat(turns);
    url = name === 'groq'
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://openrouter.ai/api/v1/chat/completions';
    options = {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      headers: { Authorization: 'Bearer ' + key },
      payload: JSON.stringify({ model: model, max_tokens: 900, temperature: 0.6, messages: msgs })
    };
  }

  var res = UrlFetchApp.fetch(url, options);
  var code = res.getResponseCode();
  var raw = res.getContentText();
  if (code === 429 || code >= 500) throw new Error(code + ' (rate limited or down)');
  if (code !== 200) throw new Error(code + ': ' + raw.slice(0, 200));

  var data = JSON.parse(raw);
  if (name === 'gemini') {
    var c = data.candidates && data.candidates[0];
    if (!c || !c.content || !c.content.parts) return '';
    var out = '';
    for (var j = 0; j < c.content.parts.length; j++) out += (c.content.parts[j].text || '');
    return out.trim();
  }
  return (data.choices && data.choices[0] && data.choices[0].message &&
          data.choices[0].message.content || '').trim();
}

// ---------------------------------------------------------------------------
// Markers
// ---------------------------------------------------------------------------

// Forgiving on purpose: models mis-close these (single brackets, a stray brace, no closing tag).
// A booking that fails to parse is a job on the floor.
var MARKER_RE = /\[{1,2}\s*(BOOKING|ESCALATE|OPTOUT)\s*\]{1,2}([\s\S]*?)(?:\[{1,2}\s*\/\s*\1\s*\]{1,2}|$)/gi;

function stripMarkers(t) {
  return String(t).replace(MARKER_RE, '').replace(/\n{3,}/g, '\n\n').trim();
}

function readMarkers(t) {
  var out = [], m;
  MARKER_RE.lastIndex = 0;
  while ((m = MARKER_RE.exec(t)) !== null) {
    var body = looseJson(String(m[2])) || { notes: String(m[2]).trim().slice(0, 400) };
    var tag = String(m[1]).toUpperCase();
    body.kind = tag === 'BOOKING' ? 'booking' : (tag === 'ESCALATE' ? 'escalation' : 'optout');
    out.push(body);
  }
  return out;
}

/** First balanced JSON object in a string, tolerating junk either side. */
function looseJson(s) {
  var start = s.indexOf('{');
  if (start === -1) return null;
  var depth = 0, inStr = false, esc = false;
  for (var i = start; i < s.length; i++) {
    var c = s.charAt(i);
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) {
      try { return JSON.parse(s.substring(start, i + 1)); } catch (e) { return null; } } }
  }
  return null;
}

// ---------------------------------------------------------------------------
// The booking sheet — the universal hand-off
// ---------------------------------------------------------------------------

var HEADERS = ['Logged', 'Type', 'Name', 'Phone', 'Email', 'Address', 'Service',
               'Problem', 'Urgency', 'Wants', 'Notes', 'Thread'];

function sheet() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('SHEET_ID is not set in Script properties');
  var ss = SpreadsheetApp.openById(id);
  var sh = ss.getSheetByName(SHEET_TAB) || ss.insertSheet(SHEET_TAB);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function appendRow(m, thread, type) {
  sheet().appendRow([
    new Date(), type, m.name || '', m.phone || '', m.email || '', m.address || '',
    m.service || '', m.problem || m.detail || '', m.urgency || '', m.preferred || '',
    m.notes || m.reason || '',
    thread ? 'https://mail.google.com/mail/u/0/#inbox/' + thread.getId() : ''
  ]);
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

function label(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}
function markDone(thread) { thread.addLabel(label(LABEL_DONE)); }
function flagForHuman(thread, why) {
  thread.addLabel(label(LABEL_REVIEW));
  thread.markUnread();
  console.warn('needs a human: ' + why);
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

function setup() {
  label(LABEL_DONE);
  label(LABEL_REVIEW);
  sheet();

  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === 'processInbox') ScriptApp.deleteTrigger(existing[i]);
  }
  ScriptApp.newTrigger('processInbox').timeBased().everyMinutes(1).create();
  console.log('Ready. REVIEW_MODE is ' + REVIEW_MODE + '. Send yourself a test lead now.');
}

function teardown() {
  var t = ScriptApp.getProjectTriggers();
  for (var i = 0; i < t.length; i++) {
    if (t[i].getHandlerFunction() === 'processInbox') ScriptApp.deleteTrigger(t[i]);
  }
  console.log('Trigger removed. The agent is off.');
}

/** Run this by hand before the first real lead: proves the key, the model and the Sheet all work. */
function selfTest() {
  var reply = askClaude([{ role: 'user',
    content: 'A new form submission came in from the website just now.\nName: Test Customer\n' +
             'Phone: (555) 010-0000\nEmail: test@example.com\n' +
             'Message: My AC stopped working last night and the house is getting hot. ' +
             'How soon can someone come out?\n\nWrite the first reply.' }]);
  console.log('--- reply ---\n' + stripMarkers(reply));
  var m = readMarkers(reply);
  console.log('--- markers: ' + m.length + ' ---');
  sheet();
  console.log('Sheet reachable. If the reply reads like the office wrote it, you are ready.');
}
