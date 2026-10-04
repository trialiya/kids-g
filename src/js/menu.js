// Меню: выбор языка, режима и уровня
import { $ } from "./dom.js";
import { state } from "./state.js";
import { LEVELS, KINDS } from "./levels.js";
import { t, lv, setLang } from "./i18n/index.js";
import { syncSound } from "./audio.js";
import { syncFs } from "./fullscreen.js";
import { start } from "./game.js";

function renderLevels() {
  document.querySelectorAll("#modes button").forEach(b => b.classList.toggle("active", b.dataset.k === state.kind));
  $("modeDesc").textContent = t("desc_" + state.kind);
  $("levels").innerHTML = "";
  LEVELS.forEach(l => {
    const b = document.createElement("div");
    b.className = "level-row";
    const buttons = state.kind !== "clocks" // в «Обучении» и «Игре» можно отвечать и выбором, и стрелочками
      ? `<button class="mode" data-t="choice">${t("choose4")}</button><button class="mode" data-t="input">${t("typeIt")}</button>`
      : `<button class="mode" data-t="choice">${t("start")}</button>`;
    b.innerHTML = `<span class="n">${l.id}</span><span class="t">${lv(l).name}<small>${lv(l).desc}</small></span>${buttons}`;
    b.querySelectorAll(".mode").forEach(btn => btn.onclick = () => start(l, state.kind, btn.dataset.t));
    $("levels").appendChild(b);
  });
}

export function applyLang() {
  document.documentElement.lang = state.lang;
  document.title = t("title");
  document.querySelectorAll("[data-i]").forEach(n => n.textContent = t(n.dataset.i));
  document.querySelectorAll("[data-ih]").forEach(n => n.innerHTML = t(n.dataset.ih));
  document.querySelectorAll("[data-ia]").forEach(n => n.setAttribute("aria-label", t(n.dataset.ia)));
  document.querySelectorAll("#langSw button").forEach(b => b.classList.toggle("active", b.dataset.l === state.lang));
  const st = $("speakTip");
  st.dataset.label = t("speakTipLbl"); st.setAttribute("aria-label", t("speakTipLbl")); st.title = t("speakTipTitle");
  syncSound(); syncFs(); renderLevels();
}

export function initMenu() {
  try { const k = localStorage.getItem("kind"); if (KINDS[k]) state.kind = k; } catch (e) { /* хранилище недоступно */ }
  document.querySelectorAll("#langSw button").forEach(b => b.onclick = () => {
    setLang(b.dataset.l);
    applyLang();
  });
  document.querySelectorAll("#modes button").forEach(b => b.onclick = () => {
    state.kind = b.dataset.k;
    try { localStorage.setItem("kind", state.kind); } catch (e) {}
    renderLevels();
  });
}
