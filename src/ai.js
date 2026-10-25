/* Optional AI mode: bring your own Claude or OpenAI key.
   The model writes the spintax; the rule-based engine then parses it, converts the syntax for the platform and runs the
   same 1,000-render checks. Output that breaks a hard rule (a merge tag inside a block, nested or unclosed braces)
   gets one automatic retry with the errors listed, then the caller falls back to the engine's own output.
   Works in the browser (window.SpintaxAI) and in Node 18+ (require). No dependencies: plain fetch. */
(function (root) {
  const MODELS = {
    claude: [
      { id: "claude-opus-5-5", label: "Claude Opus 5.5 (best quality)" },
      { id: "claude-sonnet-5-5", label: "Claude Sonnet 5.5 (faster, cheaper)" },
      { id: "claude-haiku-5-5", label: "Claude Haiku 5.5 (cheapest)" },
    ],
    openai: [
      { id: "gpt-5", label: "GPT-5" },
      { id: "gpt-5-mini", label: "GPT-5 mini (cheaper)" },
    ],
  };
  const DEFAULT_MODEL = { claude: "claude-opus-5-5", openai: "gpt-5" };

  const SYNTAX = {
    bison: { name: "EmailBison", block: "{option one|option two|option three}", vars: "{FIRST_NAME}, {COMPANY_NAME} (upper case, single braces)", sig: "{SENDER_EMAIL_SIGNATURE}" },
    smartlead: { name: "Smartlead", block: "{option one|option two|option three}", vars: "{{first_name}}, {{company_name}} (snake case, double braces)", sig: "%signature%" },
    instantly: { name: "Instantly", block: "{{RANDOM | option one | option two | option three}}", vars: "{{firstName}}, {{companyName}} (camel case, double braces; inline fallbacks like {{firstName|there}} are allowed)", sig: "{{accountSignature}}" },
  };
  const INTENSITY = {
    0.5: "about half of the phrases that can be varied get a block",
    0.8: "most phrases that can be varied get a block",
    1: "every phrase that can be varied gets a block, with up to four options",
  };
  const MODE = {
    word: "WORD-LEVEL: vary words and short phrases inside each sentence, like I {noticed|saw} or {a quick|a short} call. Keep sentence structure.",
    sentence: "SENTENCE-LEVEL: wrap whole sentences in a block with two to four complete rewrites, like {Worth a quick chat?|Open to a short call?}. A sentence that contains a merge tag, link or signature must use word-level swaps instead.",
    mixed: "MIXED: word-level swaps in the body, plus whole-sentence blocks for the greeting, the call to action, the opt-out line, any follow-up bump and the sign-off.",
  };

  function systemPrompt(o) {
    const p = SYNTAX[o.platform];
    return [
      "You write spintax for cold emails. You return only the finished email in the exact syntax of the sending platform, with no commentary, no headings and no code fences.",
      "",
      `PLATFORM: ${p.name}. Spin block syntax: ${p.block}. Merge tags look like ${p.vars}. Signature tag: ${p.sig}.`,
      `HOW MUCH: ${INTENSITY[o.intensity]}.`,
      `WHERE: ${MODE[o.mode]}`,
      o.humanize ? "HUMANIZE FIRST: before spinning, rewrite anything that reads as AI-written. Remove stock openers (\"I hope this email finds you well\"), filler (\"just\", \"truly\", \"simply put\"), inflated words (leverage, seamless, robust, cutting-edge, game-changer, unlock, elevate, synergy, delve), \"not just X, it's Y\" lines, lists of three abstractions and pushy or gushing sign-offs. Keep every fact, number, name and the ask." : "Do not rewrite the copy beyond the spin blocks.",
      "",
      "HARD RULES:",
      "1. Never put a merge tag, the signature tag, a link, an email address or a number inside a spin block. They stay exactly as written, outside every block.",
      "2. Every option must read correctly in its sentence, keep the same meaning and roughly the same length. Never add a claim, number, name or promise that is not in the original.",
      "3. No nested blocks. Two to four options per block. The original wording is always one of the options.",
      "4. Keep the line breaks, the subject line and the sign-off position exactly as in the original.",
      "5. No em dashes or en dashes anywhere. No spam words (free money, guarantee, act now, 100% free, risk-free).",
      "6. Do not change what a word means in context: a phone call that goes to voicemail is not a meeting; \"answer every call\" stays as written.",
      "7. Fix a/an so every option reads correctly.",
      "8. Return only the email.",
    ].join("\n");
  }

  // a few worked examples for the same function, pulled from examples/examples.json
  function fewShot(examples, o, k = 2) {
    const fn = examples && examples.functions && examples.functions[`${o.mode}-${Math.round(o.intensity * 100)}`];
    if (!fn) return "";
    const items = fn.items.filter(x => x.platform === o.platform).concat(fn.items.filter(x => x.platform !== o.platform)).slice(0, k);
    return items.map((x, i) => `EXAMPLE ${i + 1} (${SYNTAX[x.platform].name})\nINPUT:\n${x.input}\n\nOUTPUT:\n${x.output}`).join("\n\n---\n\n");
  }

  async function callClaude({ key, model, system, user, fetchImpl }) {
    const m = model || DEFAULT_MODEL.claude;
    const fallback = /opus|sonnet|fable/.test(m); // refusal fallback is available on Opus and Sonnet tiers
    const r = await fetchImpl("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: Object.assign({
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2026-10-21",
        "anthropic-dangerous-direct-browser-access": "true",
      }, fallback ? { "anthropic-beta": "server-side-fallback-2026-07-01" } : {}),
      body: JSON.stringify(Object.assign({
        model: m, max_tokens: 16000, system,
        output_config: { effort: "medium" },
        messages: [{ role: "user", content: user }],
      }, fallback ? { fallbacks: "default" } : {})),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`Claude API ${r.status}: ${(j.error && j.error.message) || r.statusText}`);
    if (j.stop_reason === "refusal") throw new Error("Claude declined this request. Try the rule-based bot instead.");
    return (j.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  }

  async function callOpenAI({ key, model, system, user, fetchImpl }) {
    const r = await fetchImpl("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: model || DEFAULT_MODEL.openai, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`OpenAI API ${r.status}: ${(j.error && j.error.message) || r.statusText}`);
    return ((j.choices || [])[0] || {}).message?.content || "";
  }

  const clean = t => String(t).replace(/^\s*```[a-z]*\s*\n?|\n?```\s*$/gi, "").trim();

  /* Main entry. S = the Spintax engine. Returns { text, res, check, model, attempts } or throws. */
  async function spin(S, input, o, ai) {
    const fetchImpl = ai.fetch || (typeof fetch !== "undefined" ? fetch.bind(root) : null);
    if (!fetchImpl) throw new Error("fetch is not available. Use Node 18 or newer.");
    if (!ai.key) throw new Error("Add your API key first.");
    const call = ai.provider === "openai" ? callOpenAI : callClaude;
    const system = systemPrompt(o), shots = fewShot(ai.examples, o);
    let user = (shots ? `Here is how it should look:\n\n${shots}\n\n---\n\n` : "") + `Now spin this email:\n\n${input}`;
    let last = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      const raw = clean(await call({ key: ai.key, model: ai.model, system, user, fetchImpl }));
      const conv = S.convertSyntax(raw, o.platform).text; // repair any variable or block syntax for the platform
      const parsed = S.parse(conv, o.platform);
      const check = S.check(parsed.res, 1000);
      const errors = parsed.errors.slice();
      if (!check.blocks) errors.push("No spin blocks were added.");
      if (check.dashes) errors.push("The output contains an em or en dash.");
      if (!errors.length) return { text: S.serialize(parsed.res), res: parsed.res, check, model: ai.model || DEFAULT_MODEL[ai.provider || "claude"], attempts: attempt };
      last = errors;
      user = `Your previous answer broke these rules:\n- ${errors.join("\n- ")}\n\nFix them and return only the corrected email.\n\nOriginal email:\n\n${input}\n\nYour previous answer:\n\n${raw}`;
    }
    throw new Error(`The AI output did not pass the checks (${last.join("; ")}). Showing the rule-based version instead.`);
  }

  const API = { spin, systemPrompt, fewShot, MODELS, DEFAULT_MODEL };
  if (typeof module !== "undefined") module.exports = API; else root.SpintaxAI = API;
})(typeof window !== "undefined" ? window : globalThis);
