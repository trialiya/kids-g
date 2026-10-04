// Чтение вслух (Web Speech API)
import { $ } from "./dom.js";
import { state } from "./state.js";
import { t } from "./i18n/index.js";

export const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
let speaking = false;

function speechText(box) {
  const c = box.cloneNode(true);
  // читаем коротко: без кнопок, служебных пометок и свёрнутых блоков (кроме подсказки — её открывают перед чтением)
  c.querySelectorAll(".speak, .nospeak, .hintnote").forEach(n => n.remove());
  c.querySelectorAll("details").forEach(d => { if (!d.open && d.id !== "hint") d.remove(); });
  c.querySelectorAll("summary").forEach(n => n.remove());
  c.querySelectorAll("h3, div, li").forEach(n => n.append(" . ")); // паузы между фразами
  // убираем эмодзи и «служебные» подписи, чтобы голос их не зачитывал
  return c.textContent
    .replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, "")
    .replace(/\(\d+:\d\d\)/g, "") // «(7:40)» дублирует слова
    .replace(/(\d+):(\d\d)/g, (m, h, mm) => t("speechTime", h, mm))
    .replace(/×/g, t("speechTimes")).replace(/[→=]/g, t("speechArrow"))
    .replace(/\(а\)|\(ась\)/g, "")
    .replace(/\s+/g, " ").trim();
}

let activeSpeak = null, currentU = null;

function setSpeakUi(on, btn) {
  speaking = on;
  if (btn) activeSpeak = btn;
  if (activeSpeak) {
    activeSpeak.textContent = on ? "⏹" : "🔊";
    activeSpeak.classList.toggle("on", on);
    activeSpeak.setAttribute("aria-label", on ? t("stopRead") : activeSpeak.dataset.label || t("readAloud"));
  }
  if (!on) activeSpeak = null;
}

// Нажатие на 🔊: читает box или, если эта кнопка уже читает, останавливает
export function toggleSpeak(box, btn) {
  if (speaking && activeSpeak === btn) return stopSpeak();
  speak(box, btn);
}

export function speak(box, btn, pitch = 1) {
  if (speaking) setSpeakUi(false); // вернуть иконку у предыдущей кнопки
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(speechText(box));
  currentU = u;
  u.lang = t("speechLang");
  const v = speechSynthesis.getVoices().find(x => x.lang && x.lang.toLowerCase().startsWith(state.lang));
  if (v) u.voice = v;
  u.rate = 0.9;
  u.pitch = pitch; // у героев вступления свой голос: Зайка выше, Бобик ниже
  u.onend = u.onerror = () => { if (currentU === u) setSpeakUi(false); }; // cancel() старой реплики не сбрасывает новую
  setSpeakUi(true, btn);
  speechSynthesis.speak(u);
}

export function stopSpeak() {
  currentU = null;
  if (canSpeak) speechSynthesis.cancel();
  setSpeakUi(false);
}

// Читает ли сейчас именно эта кнопка
export const isSpeakingFrom = btn => speaking && activeSpeak === btn;

// Кнопка 🔊 в подсказке «как определять время»
export function initSpeech() {
  if (canSpeak) {
    $("speakTip").classList.remove("hidden");
    $("speakTip").onclick = () => toggleSpeak($("levelTip"), $("speakTip"));
  }
}
