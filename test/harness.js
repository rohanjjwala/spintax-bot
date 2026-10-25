/* Stress test: 10 inputs x 3 platforms x 3 modes x 3 intensities x humanize on/off, 1,000 renders each. Run: node test/harness.js */
const path = require("path"), fs = require("fs"), S = require(path.join(__dirname, "..", "src", "spintax.js"));
const ui = fs.readFileSync(path.join(__dirname, "..", "web", "js", "ui.js"), "utf8");
const EXAMPLE = ui.match(/const EXAMPLE = `([\s\S]*?)`;/)[1];
const INPUTS = {
  example: EXAMPLE,
  bison: `Subject: {FIRST_NAME}, quick one\n\nHey {FIRST_NAME},\n\nSaw {COMPANY_NAME} opened a second location in {CITY}. Usually that means the front desk gets slammed and a lot of calls go to voicemail.\n\nWe helped 40 clinics book more patients without adding staff.\n\nWorth a quick chat?\n\nThanks,\n{SENDER_EMAIL_SIGNATURE}`,
  instantly: `{{RANDOM | Hi | Hey | Hello}} {{firstName}},\n\nCurious if {{companyName}} is still using Salesforce for outbound. I noticed a lot of teams in your space struggle with reply rates.\n\nHere is the demo: https://example.com/demo?utm_source=email&x=1\n\nOpen to a short call next week?\n\nCheers,\n{{accountSignature}}`,
  fallbacks: `Hi {{first_name|there}},\n\nNoticed {{company_name|your company}} raised $4.5M in March. Congrats!\n\nAre you free Tuesday at 10am?\n\nBest regards,\nSam\nsam@acme.io | www.acme.io`,
  slop: `Hi {{first_name}},\n\nI hope you're doing well! I just wanted to reach out because I came across {{company_name}} and was really impressed by your innovative approach to leveraging cutting-edge technology. Our robust platform seamlessly streamlines your workflow and it's a true game-changer.\n\nWe've helped a lot of companies enhance their results. Please don't hesitate to reach out if you'd like to delve into this further.\n\nLooking forward to hearing from you!\n\nBest,\n%signature%`,
  edge: `An email a day keeps the problem away. I noticed Email Bison is a tool a lot of teams in your space use. Clients like Acme Co. see results fast. I think it could help. I'd love to book a call. Following up on my last note. Interested?`,
  short: `Hey,\n\nQuick question. Are you the right person for outbound at {{company_name}}?\n\nThanks`,
  oneliners: `We cut bounce from 8–9% to 2% in 3–6 weeks. Also—no retainer.\n\nQuick one -- are you still hiring SDRs?\n\nWe are leveraging AI to enhance results and foster growth.\n\nI think you will like it.\n\nWe helped 40 clinics book more patients.`,
  unclosed: `Hi {{first_name, quick one\n\nI noticed your team is hiring.`,
  realistic: `Subject: {{company_name}} + faster quotes\n\nHi {{first_name}},\n\nI noticed {{company_name}} is quoting jobs by hand. Most shops your size lose 2 to 4 hours a week on that — usually the owner does it at night.\n\nWe built a simple tool that turns a photo into a quote in about 5 minutes. A roofer in {{city}} used it to send 30% more quotes last month.\n\nWould you be open to a quick call?\n\nIf this isn't a fit, reply no and I will leave you alone.\n\nThanks,\n%signature%`,
};
const VAR = /\{\{(?!\s*RANDOM)[^{}]*\}\}|\{[A-Z0-9_]+\}|%signature%/g;
const plats = ["bison", "instantly", "smartlead"], modes = ["word", "sentence", "mixed"], ints = [.5, .8, 1];
const fails = {}, tbl = {}; let builds = 0, renders = 0;
const fail = (k, msg) => { (fails[k] = fails[k] || []).push(msg); };
for (const [name, src] of Object.entries(INPUTS)) for (const p of plats) for (const m of modes) for (const i of ints) for (const h of [true, false]) {
  const tag = `${name}/${p}/${m}/${i}/h${+h}`; builds++;
  const res = S.build(src, { platform: p, mode: m, intensity: i, humanize: h, convert: true, seed: 3 });
  const out = S.serialize(res), c = S.check(res, 1000);
  const row = (tbl[name] = tbl[name] || { builds: 0, minBlocks: 1e9, lint: 0, fails: 0 }); row.builds++; row.minBlocks = Math.min(row.minBlocks, c.blocks);
  const F = msg => { row.fails++; fail(name, `${tag}: ${msg}`); };
  // block option hygiene
  res.segs.filter(s => s.b).forEach(s => s.b.forEach(o => { if (/[{}|%\u0000\u0001@]|https?:|www\./.test(o)) F(`protected/brace in option: ${JSON.stringify(o)}`); if (!o.trim()) F("empty option"); }));
  // balanced braces in serialized output (skip input that is itself unbalanced)
  if (name !== "unclosed") { let d = 0, max = 0; for (const ch of out) { if (ch === "{") d++; if (ch === "}") d--; if (d < 0) break; max = Math.max(max, d); } if (d !== 0) F("unbalanced braces"); if (p !== "instantly" && max > 2) F("nested braces"); }
  if (p === "instantly") { const bad = out.match(/\{\{RANDOM(?! \| [^{}|]+( \| [^{}|]+)+\}\})/g); if (bad) F("instantly RANDOM parse"); if (/\{\{(?!RANDOM)\w+ \|/.test(out)) F("space before fallback pipe"); }
  // variables outside blocks, exactly once per render vs text segments
  const textOnly = res.segs.filter(s => s.t != null).map(s => s.t).join("");
  const exp = (textOnly.match(VAR) || []).sort().join(",");
  const srcN = (src.match(VAR) || []).length; if ((textOnly.match(VAR) || []).length !== srcN && name !== "unclosed") F(`var count ${srcN} -> ${(textOnly.match(VAR) || []).length}`);
  const sig = { bison: "{SENDER_EMAIL_SIGNATURE}", smartlead: "%signature%", instantly: "{{accountSignature}}" }[p];
  if (/signature|SIGNATURE/i.test(src) && textOnly.split(sig).length !== 2) F("signature missing/dup");
  const r = S.rng(99);
  for (let k = 0; k < 20; k++) { renders++; const t = S.render(res, r); if ((t.match(VAR) || []).sort().join(",") !== exp) F("render var mismatch"); }
  if (c.lint.length) { const hasDashIn = /[—–]/.test(src) && !h; const real = c.lint.filter(l => !(hasDashIn && l.label === "Dash")); if (real.length) { row.lint += real.reduce((a, x) => a + x.count, 0); F("lint " + real.map(l => `${l.label}x${l.count} "${l.example}"`).join("; ")); } }
  if (c.blocks === 0) F("0 blocks");
  if (h && /[—–]/.test(out)) F("dash in humanized output");
}
console.log(`builds ${builds}, renders checked ${renders} (+1000 lint renders each)`);
console.table(tbl);
for (const [k, v] of Object.entries(fails)) { console.log(`\n## ${k}: ${v.length} fails`); const seen = new Set(); v.forEach(x => { const key = x.replace(/^\S+: /, ""); if (!seen.has(key) && seen.size < 8) { seen.add(key); console.log("  " + x); } }); }
