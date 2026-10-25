#!/usr/bin/env node
/* Spintax Bot from the command line. Node 18+, no dependencies.

   node cli/spin.js email.txt --platform smartlead --intensity 80 --mode word
   cat email.txt | node cli/spin.js --platform instantly --mode mixed --renders 3
   ANTHROPIC_API_KEY=... node cli/spin.js email.txt --ai claude
   OPENAI_API_KEY=...    node cli/spin.js email.txt --ai openai --model gpt-5

   The spintax goes to stdout, the checks go to stderr, so `> out.txt` captures only the spintax. */
const fs = require("fs"), path = require("path");
const S = require("../src/spintax.js"), AI = require("../src/ai.js");

const HELP = `Usage: node cli/spin.js [file] [options]

  --platform  bison | smartlead | instantly      (default: smartlead)
  --intensity 50 | 80 | 100                      (default: 80)
  --mode      word | sentence | mixed            (default: word)
  --no-humanize                                  skip the humanize pass
  --no-convert                                   keep variables as written
  --convert-only                                 only convert existing spintax and variables to --platform
  --humanize-only                                only run the humanizer, no spin
  --renders N                                    also print N random versions (default: 0)
  --seed N                                       change the random picks
  --json                                         print everything as JSON
  --ai claude | openai                           let your own model write the spintax (key from
                                                 ANTHROPIC_API_KEY or OPENAI_API_KEY)
  --model ID                                     model to use with --ai
  -h, --help                                     show this help

Reads the email from [file], or from stdin when no file is given.`;

const args = process.argv.slice(2), opt = { platform: "smartlead", intensity: "80", mode: "word", humanize: true, convert: true, renders: 0, seed: 1 };
let file = null;
for (let i = 0; i < args.length; i++) {
  const a = args[i], next = () => args[++i];
  if (a === "-h" || a === "--help") { console.log(HELP); process.exit(0); }
  else if (a === "--platform") opt.platform = next();
  else if (a === "--intensity") opt.intensity = next();
  else if (a === "--mode") opt.mode = next();
  else if (a === "--no-humanize") opt.humanize = false;
  else if (a === "--no-convert") opt.convert = false;
  else if (a === "--convert-only") opt.convertOnly = true;
  else if (a === "--humanize-only") opt.humanizeOnly = true;
  else if (a === "--renders") opt.renders = +next();
  else if (a === "--seed") opt.seed = +next();
  else if (a === "--json") opt.json = true;
  else if (a === "--ai") opt.ai = next();
  else if (a === "--model") opt.model = next();
  else if (!a.startsWith("-") && !file) file = a;
  else { console.error(`Unknown option: ${a}\n\n${HELP}`); process.exit(2); }
}
const die = m => { console.error(m); process.exit(2); };
if (!["bison", "smartlead", "instantly"].includes(opt.platform)) die("--platform must be bison, smartlead or instantly");
const intensity = { 50: 0.5, 80: 0.8, 100: 1 }[String(opt.intensity).replace("%", "")];
if (!intensity) die("--intensity must be 50, 80 or 100");
if (!["word", "sentence", "mixed"].includes(opt.mode)) die("--mode must be word, sentence or mixed");

const input = (file ? fs.readFileSync(file, "utf8") : fs.readFileSync(0, "utf8")).trimEnd();
if (!input.trim()) die("The email is empty.");

(async () => {
  if (opt.humanizeOnly) {
    const h = S.humanize(input);
    if (opt.json) return console.log(JSON.stringify(h, null, 2));
    console.log(h.text.trimEnd()); console.error(`\n${h.changes.length} changes: ${h.changes.map(c => c.label).join(" · ") || "none"}`); return;
  }
  if (opt.convertOnly) {
    const c = S.convertSyntax(input, opt.platform);
    if (opt.json) return console.log(JSON.stringify(c, null, 2));
    console.log(c.text); console.error(`\n${c.log.join(" · ") || "Nothing to convert."}`); return;
  }
  const settings = { platform: opt.platform, mode: opt.mode, intensity, humanize: opt.humanize, convert: opt.convert, seed: opt.seed };
  let res = S.build(input, settings), source = "rule-based engine", note = "";
  if (opt.ai) {
    const provider = opt.ai === "openai" ? "openai" : "claude";
    const key = provider === "openai" ? process.env.OPENAI_API_KEY : process.env.ANTHROPIC_API_KEY;
    if (!key) die(`Set ${provider === "openai" ? "OPENAI_API_KEY" : "ANTHROPIC_API_KEY"} in your environment first.`);
    let examples = null; try { examples = require(path.join(__dirname, "..", "examples", "examples.json")); } catch (e) { /* examples are optional */ }
    try {
      const r = await AI.spin(S, input, settings, { provider, key, model: opt.model, examples });
      res = r.res; source = `${r.model} (checked by the engine${r.attempts > 1 ? ", 1 retry" : ""})`;
    } catch (e) { note = e.message; }
  }
  const c = S.check(res, 1000), out = S.serialize(res), rr = S.rng(opt.seed + 100);
  const renders = Array.from({ length: opt.renders }, () => S.render(res, rr));
  if (opt.json) return console.log(JSON.stringify({ spintax: out, source, note: note || undefined, checks: { blocks: c.blocks, versions: c.combos.toString(), worstGrade: +c.worst.g.toFixed(1), words: c.words, lint: c.lint, spam: c.spam }, changes: [...(res.humanized || []).map(h => h.label), ...(res.log || [])], renders }, null, 2));
  console.log(out);
  renders.forEach((t, i) => console.error(`\n--- version ${i + 1} ---\n${t}`));
  if (note) console.error(`\nAI: ${note}`);
  console.error(`\n${source} · ${c.blocks} blocks · ${S.fmtBig(c.combos)} versions · worst grade ${c.worst.g.toFixed(1)} · ${c.lint.reduce((a, x) => a + x.count, 0)} lint hits${c.spam.length ? ` · spam words: ${c.spam.join(", ")}` : ""}`);
})().catch(e => die(e.message));
