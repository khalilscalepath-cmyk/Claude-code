/**
 * Free-tier LLM providers, tried in order.
 *
 * No provider is hard-wired. Set whichever free keys you have and the first one that answers wins;
 * a rate limit or an outage falls through to the next. Free tiers change their limits often, so
 * treat the model defaults as a starting point and override them with env vars when a console says
 * otherwise. Nothing here ever touches a paid Anthropic or Claude account.
 *
 *   GROQ_API_KEY         console.groq.com/keys            fastest — best for voice
 *   GEMINI_API_KEY       aistudio.google.com/apikey       most generous daily allowance
 *   OPENROUTER_API_KEY   openrouter.ai/keys               last resort, ":free" models
 *
 * Override a model:  GROQ_MODEL, GEMINI_MODEL, OPENROUTER_MODEL
 */

const PROVIDERS = [
  {
    name: "groq",
    env: "GROQ_API_KEY",
    model: () => process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    url: () => "https://api.groq.com/openai/v1/chat/completions",
    headers: key => ({ "content-type": "application/json", authorization: `Bearer ${key}` }),
    body: (system, turns, model, maxTokens) => JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature: 0.6,
      messages: [{ role: "system", content: system }].concat(turns)
    }),
    parse: j => (j.choices && j.choices[0] && j.choices[0].message &&
                 j.choices[0].message.content || "").trim()
  },
  {
    name: "gemini",
    env: "GEMINI_API_KEY",
    model: () => process.env.GEMINI_MODEL || "gemini-2.0-flash",
    url: m => `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,
    headers: key => ({ "content-type": "application/json", "x-goog-api-key": key }),
    body: (system, turns, model, maxTokens) => JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: turns.map(t => ({
        role: t.role === "assistant" ? "model" : "user",
        parts: [{ text: t.content }]
      })),
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.6 }
    }),
    parse: j => {
      const c = j.candidates && j.candidates[0];
      if (!c) return "";
      const parts = (c.content && c.content.parts) || [];
      return parts.map(p => p.text || "").join("").trim();
    }
  },
  {
    name: "openrouter",
    env: "OPENROUTER_API_KEY",
    model: () => process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
    url: () => "https://openrouter.ai/api/v1/chat/completions",
    headers: key => ({ "content-type": "application/json", authorization: `Bearer ${key}` }),
    body: (system, turns, model, maxTokens) => JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature: 0.6,
      messages: [{ role: "system", content: system }].concat(turns)
    }),
    parse: j => (j.choices && j.choices[0] && j.choices[0].message &&
                 j.choices[0].message.content || "").trim()
  }
];

function configured() {
  return PROVIDERS.filter(p => (process.env[p.env] || "").trim().length > 0);
}

/**
 * Ask the first configured provider that answers.
 * Returns {text, provider, model}. Throws {status, message, tried} when they all fail.
 */
async function ask(system, turns, opts) {
  const o = opts || {};
  const maxTokens = o.maxTokens || 700;
  const list = configured();

  if (!list.length) {
    const e = new Error(
      "No API key set. Add one free key to .env — GROQ_API_KEY, GEMINI_API_KEY or " +
      "OPENROUTER_API_KEY — and restart.");
    e.status = 503; e.tried = [];
    throw e;
  }

  const tried = [];
  for (const p of list) {
    const key = process.env[p.env].trim();
    const model = p.model();
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), o.timeoutMs || 30000);
      let res;
      try {
        res = await fetch(p.url(model), {
          method: "POST",
          headers: p.headers(key),
          body: p.body(system, turns, model, maxTokens),
          signal: ctl.signal
        });
      } finally { clearTimeout(timer); }

      const raw = await res.text();

      // Rate limited or provider-side failure: that's what the next provider is for.
      if (res.status === 429 || res.status >= 500) {
        tried.push(`${p.name}: ${res.status}`);
        continue;
      }
      if (!res.ok) {
        tried.push(`${p.name}: ${res.status} ${raw.slice(0, 160)}`);
        continue;
      }

      let json;
      try { json = JSON.parse(raw); }
      catch (e) { tried.push(`${p.name}: unparseable response`); continue; }

      const text = p.parse(json);
      if (!text) { tried.push(`${p.name}: empty reply`); continue; }

      return { text, provider: p.name, model };
    } catch (err) {
      tried.push(`${p.name}: ${err.name === "AbortError" ? "timed out" : err.message}`);
    }
  }

  const e = new Error("Every provider failed or was rate limited.");
  e.status = 502; e.tried = tried;
  throw e;
}

module.exports = { ask, configured, PROVIDERS };
