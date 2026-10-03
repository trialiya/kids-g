// Переключение языка (ru / en) и доступ к текстам
import { state } from "../state.js";
import ru from "./ru.js";
import en from "./en.js";

const I18N = { ru, en };

export function initLang() {
  try {
    const saved = localStorage.getItem("lang");
    state.lang = saved === "ru" || saved === "en"
      ? saved
      : ((navigator.language || "ru").toLowerCase().startsWith("ru") ? "ru" : "en");
  } catch (e) { /* хранилище недоступно */ }
}

export function setLang(l) {
  state.lang = l;
  try { localStorage.setItem("lang", l); } catch (e) { /* хранилище недоступно */ }
}

// t("ключ", ...аргументы) — строка или результат функции-шаблона
export const t = (k, ...a) => { const v = I18N[state.lang][k]; return typeof v === "function" ? v(...a) : v; };
export const lv = l => I18N[state.lang].levels[l.id - 1];

initLang();
