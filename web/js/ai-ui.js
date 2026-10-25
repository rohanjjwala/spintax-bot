/* AI mode panel: provider, model, key. Keys live only in this browser (localStorage when "Remember" is ticked). */
(() => {
  const $ = s => document.querySelector(s), A = window.SpintaxAI, S = window.Spintax;
  const KEY = "spintax-ai", load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } };
  const save = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage blocked */ } };
  const forget = () => { try { localStorage.removeItem(KEY); } catch (e) { /* storage blocked */ } };
  const saved = load();
  let provider = saved.provider || "claude";

  const seg = $("#aiProvider"), model = $("#aiModel"), key = $("#aiKey"), on = $("#aiOn"), remember = $("#aiRemember");
  function setProvider(p) {
    provider = p;
    seg.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === p));
    const t = seg.querySelector(".thumb"), b = seg.querySelector(`[data-v="${p}"]`);
    if (t && b) { t.style.width = b.offsetWidth + "px"; t.style.left = "3px"; t.style.transform = `translateX(${b.offsetLeft - 3}px)`; }
    $("#aiModels").innerHTML = A.MODELS[p].map(m => `<option value="${m.id}">${m.label}</option>`).join("");
    if (!model.value || !A.MODELS[p].some(m => m.id === model.value) && /^(claude|gpt)/.test(model.value)) model.value = A.DEFAULT_MODEL[p];
    $("#aiKeyLbl").textContent = p === "claude" ? "Anthropic API key" : "OpenAI API key";
    key.placeholder = p === "claude" ? "sk-ant-..." : "sk-...";
    key.value = (saved.keys && saved.keys[p]) || "";
    sum(); persist();
  }
  const sum = () => { $("#aiSum").textContent = on.checked ? `on · ${model.value || A.DEFAULT_MODEL[provider]}` : "off · optional"; };
  const persist = () => {
    if (!remember.checked) { forget(); return; }
    saved.provider = provider; saved.on = on.checked; saved.model = model.value; saved.keys = Object.assign({}, saved.keys, { [provider]: key.value.trim() });
    save(saved);
  };

  model.value = saved.model || A.DEFAULT_MODEL[provider];
  on.checked = !!saved.on; remember.checked = !!(saved.keys && Object.values(saved.keys).some(Boolean));
  if (on.checked) $("#aiPanel").open = true;
  seg.addEventListener("click", e => { const b = e.target.closest("button"); if (b) { model.value = ""; setProvider(b.dataset.v); } });
  [model, key].forEach(el => el.addEventListener("change", () => { sum(); persist(); }));
  on.addEventListener("change", () => { sum(); persist(); if (on.checked && !key.value.trim()) key.focus(); });
  remember.addEventListener("change", persist);
  $("#aiPanel").addEventListener("toggle", () => setProvider(provider));
  setProvider(provider);

  let ticket = 0;
  window.addEventListener("spintax:spin", async e => {
    if (!on.checked) return;
    if (!key.value.trim()) { $("#aiPanel").open = true; key.focus(); return; }
    const mine = ++ticket, m = model.value.trim() || A.DEFAULT_MODEL[provider];
    window.SpintaxUI.busy(`Writing with ${m}. The bot's own version is ready if this fails.`);
    try {
      const r = await A.spin(S, e.detail.src, e.detail.settings, { provider, key: key.value.trim(), model: m, examples: window.SPINTAX_EXAMPLES });
      if (mine !== ticket) return;
      window.SpintaxUI.show(r.res, `${r.model}${r.attempts > 1 ? " · fixed on retry" : ""} · checked by the bot`);
    } catch (err) {
      if (mine !== ticket) return;
      const res = S.build(e.detail.src, e.detail.settings);
      window.SpintaxUI.show(res, `Bot version. AI said: ${String(err.message || err).slice(0, 160)}`);
    }
  });
})();
