(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const S = window.Spintax;
  const st = { platform: "bison", intensity: 0.8, mode: "word", seed: 1, started: false };
  const SYNTAX = {
    bison: "EmailBison: {Hi|Hey} · variables {FIRST_NAME} · signature {SENDER_EMAIL_SIGNATURE}",
    instantly: "Instantly: {{RANDOM | Hi | Hey}} · variables {{firstName}} · signature {{accountSignature}}",
    smartlead: "Smartlead: {Hi|Hey} · variables {{first_name}} · signature %signature% · variables are kept outside blocks",
  };
  const INT = {
    0.5: "About half the phrases get a block. Enough to keep a hundred inboxes from sending the same email.",
    0.8: "Most phrases get a block. My default for a list over 2,000.",
    1: "Every phrase the bot knows gets a block, with up to four options each.",
  };
  const MODE = {
    word: "Swaps words and short phrases inside a sentence, like I {noticed|saw}. The meaning and the length stay put.",
    sentence: "Offers two to four full versions of each sentence, like {Worth a quick chat?|Open to a short call?}. Bigger difference per send. Sentences with a merge tag, link or signature get word swaps instead, so the tag never lands inside a block.",
    mixed: "Words inside the body, whole-sentence blocks for the CTA, opt-out and sign-off.",
  };
  const EXAMPLE = `Hi {{first_name}},

I hope this email finds you well. I noticed {{company_name}} is hiring 2 SDRs right now — usually that means the team wants more meetings on the calendar.

We recently worked with a similar company and booked 14 calls in their first month. I put together a quick list of 25 prospects in your space that match your best customers.

Mind if I send it over?

Not relevant? Reply no and I will leave it there.

Best,
%signature%`;

  // seg controls
  function place(root) { const b = root.querySelector('[aria-pressed="true"]'), t = root.querySelector(".thumb"); if (!b || !t) return; t.style.width = b.offsetWidth + "px"; t.style.left = "3px"; t.style.transform = `translateX(${b.offsetLeft - 3}px)`; }
  function seg(id, key, cast) {
    const root = $("#" + id);
    root.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; root.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); place(root); st[key] = cast ? cast(b.dataset.v) : b.dataset.v; run(); });
    place(root);
  }
  seg("platform", "platform"); seg("intensity", "intensity", Number); seg("mode", "mode");
  const relayout = () => $$(".seg").forEach(place);
  document.fonts && document.fonts.ready.then(relayout); addEventListener("resize", relayout);

  // tabs
  $$(".tabs [role=tab]").forEach(t => t.addEventListener("click", () => {
    $$(".tabs [role=tab]").forEach(x => x.setAttribute("aria-selected", x === t));
    $$(".tabp").forEach(p => p.hidden = p.id !== "p-" + t.dataset.t);
  }));
  $(".tabs").addEventListener("keydown", e => {
    const tabs = $$(".tabs [role=tab]"), i = tabs.findIndex(t => t.getAttribute("aria-selected") === "true");
    const n = { ArrowRight: i + 1, ArrowLeft: i - 1 }[e.key]; if (n === undefined) return;
    const t = tabs[(n + tabs.length) % tabs.length]; t.click(); t.focus();
  });

  $("#kb").innerHTML = `<span>${S.KB.groups} phrase groups</span><span>${S.KB.intents} sentence templates</span><span>${S.KB.rules} humanize rules</span><span>0 API calls</span>`;

  const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  let res = null, previewSeed = 11;

  function run(force) {
    if (force) st.started = true;
    const src = $("#src").value;
    const wc = (src.match(/[A-Za-z']+/g) || []).length;
    $("#srcMeta").textContent = `${wc} words`;
    $("#syntaxHint").textContent = SYNTAX[st.platform];
    $("#modeHint").textContent = MODE[st.mode];
    $("#intHint").textContent = INT[st.intensity];
    if (!st.started || !src.trim()) {
      $("#out").innerHTML = `<span class="empty">${src.trim() ? "Ready. Press Spin it." : "Your spun email appears here. Paste on the left, pick a platform, press Spin it."}</span>`;
      $("#stats").innerHTML = ""; $("#checks").innerHTML = ""; $("#changes").innerHTML = ""; $("#renders").innerHTML = ""; res = null; return;
    }
    try {
      res = S.build(src, { platform: st.platform, intensity: st.intensity, mode: st.mode, humanize: $("#humanize").checked, convert: $("#convert").checked, seed: st.seed });
    } catch (err) {
      res = null; $("#stats").innerHTML = "";
      $("#out").innerHTML = `<span class="empty">That did not spin. Check for an unclosed brace and try again. (${esc(String(err.message || err))})</span>`;
      return;
    }
    source = "";
    paint();
    if (force) window.dispatchEvent(new CustomEvent("spintax:spin", { detail: { src, settings: { platform: st.platform, intensity: st.intensity, mode: st.mode, humanize: $("#humanize").checked, convert: $("#convert").checked, seed: st.seed } } }));
  }
  let source = "";
  function paint() {
    const inst = st.platform === "instantly";
    $("#out").innerHTML = res.segs.map(s => s.t != null ? esc(s.t) : `<span class="blk k-${s.kind}">${inst ? "{{RANDOM | " : "{"}${s.b.map(esc).join(inst ? " | " : "<i>|</i>")}${inst ? "}}" : "}"}</span>`).join("");
    const c = S.check(res, 1000);
    $("#stats").innerHTML = (source ? `<span class="src-tag">${esc(source)}</span>` : "") + `<span><b>${c.blocks}</b> blocks</span><span><b>${S.fmtBig(c.combos)}</b> versions</span><span><b>${c.worst.g.toFixed(1)}</b> worst grade</span><span class="${c.lint.length ? "bad" : "ok"}"><b>${c.lint.reduce((a, x) => a + x.count, 0)}</b> lint hits</span>`;
    const li = (ok, label, val) => `<li class="${ok ? "ok" : "bad"}"><span class="dot"></span><span>${label}</span><span class="v">${val}</span></li>`;
    $("#checks").innerHTML =
      li(c.blocks > 0, "Spin blocks", c.blocks) +
      li(c.combos >= 100n, "Unique versions", S.fmtBig(c.combos)) +
      li(c.worst.g < 7, "Worst-case reading grade (aim under 7)", c.worst.g.toFixed(1)) +
      li(c.words <= 120, "Words in a typical render (aim under 120)", c.words) +
      li(!c.dashes, "No em or en dashes", c.dashes ? "found" : "0") +
      li(!c.spam.length, "Spam-trigger words", c.spam.length ? c.spam.join(", ") : "0") +
      (c.lint.length ? c.lint.map(l => li(false, `${l.label} (e.g. "${esc(l.example)}")`, l.count)).join("") : li(true, "Grammar lint across 1,000 renders", "0 hits"));
    const changes = [...res.humanized.map(h => `${h.label}${h.count > 1 ? ` (${h.count})` : ""}`), ...res.log];
    $("#changes").innerHTML = changes.length ? changes.map(x => `<li class="ok"><span class="dot"></span><span>${esc(x)}</span></li>`).join("") : `<li><span class="dot"></span><span>No changes. ${$("#humanize").checked ? "The copy already reads clean." : "Humanize is off."}</span></li>`;
    renders();
  }
  // used by web/js/ai-ui.js to show the AI version (already parsed and checked) in the same panes
  window.SpintaxUI = { show(r, label) { res = r; source = label || ""; paint(); }, busy(msg) { $("#out").innerHTML = `<span class="empty">${esc(msg)}</span>`; } };
  function renders() {
    if (!res) return;
    const r = S.rng(previewSeed);
    $("#renders").innerHTML = [0, 1, 2].map(i => `<div class="render"><span class="mono tiny muted">Version ${i + 1}</span><p>${esc(S.render(res, r)).replace(/\n/g, "<br>")}</p></div>`).join("");
  }

  let t; $("#src").addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => run(), 180); });
  $("#spin").addEventListener("click", () => { st.seed++; run(true); const o = $(".out"); if (o.getBoundingClientRect().top > innerHeight * .6) o.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); });
  $("#src").addEventListener("keydown", e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); $("#spin").click(); } });
  ["humanize", "convert"].forEach(id => $("#" + id).addEventListener("change", () => run()));
  $("#example").addEventListener("click", () => { $("#src").value = EXAMPLE; run(true); $("#copied").textContent = "The example has one dash on purpose. Turn on Humanize to watch it go."; setTimeout(() => $("#copied").textContent = "", 4000); });
  $("#regen").addEventListener("click", () => { st.seed++; run(); });
  $("#shuffle").addEventListener("click", () => { previewSeed++; renders(); });
  const copy = async (txt, label) => {
    try { await navigator.clipboard.writeText(txt); $("#copied").textContent = `${label} copied`; }
    catch (e) { const ta = document.createElement("textarea"); ta.value = txt; document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove(); $("#copied").textContent = `${label} copied`; }
    setTimeout(() => $("#copied").textContent = "", 1800);
  };
  $("#copyTxt").addEventListener("click", () => res && copy(S.serialize(res), "Spintax"));
  $("#copyHtml").addEventListener("click", () => res && copy(S.toHTML(res), "HTML"));
  run();
})();
