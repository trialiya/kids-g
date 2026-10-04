// Вступление к главе в виде комикса-переписки: реплики героев появляются по одной.
// Нажатие на диалог — следующая реплика (сразу читается вслух, если звук включён), внизу «Пропустить» / «Начать!».
import { $ } from "./dom.js";
import { state } from "./state.js";
import { STORY_TEXTS } from "./i18n/story-texts.js";
import { show } from "./ui.js";
import { speak, stopSpeak, canSpeak } from "./speech.js";
import { ART, cat, nyu } from "./art.js";
import { ENDING_SCENES } from "./ending-scenes.js";

const s = () => STORY_TEXTS[state.lang];
// Высота голоса героя: Барсик чуть выше обычного, Бобик и часы на башне — ниже, Зайка и Бабочка — тоненько
const PITCH = { nyu: 1.4, cat: 1.15, bunny: 1.5, dog: .75, butterfly: 1.7, rabbit: 1.3, townClock: .6 };

let lines = [], pos = 0, done = null, chId = null, kind = "comics";

// chapterId — id главы из story.js, onDone — что открыть после (дорожку остановок);
// which — "comics" (вступление к главе) или "endings" (мини-концовка с картинкой-комиксом)
export function showComic(chapterId, onDone, shown = 0, which = "comics") {
  const txt = s()[which][chapterId];
  lines = txt.lines; pos = 0; done = onDone; chId = chapterId; kind = which;
  $("comic").className = `card ch-${chapterId}`;
  $("comicTitle").textContent = txt.title || s().chapters[chapterId].title;
  const pic = which === "endings" && ENDING_SCENES[chapterId];
  $("comicScene").classList.toggle("hidden", !pic);
  $("comicScene").innerHTML = pic ? pic(s().bom) : "";
  $("comicBack").textContent = s().backChapters;
  $("chatLog").innerHTML = "";
  show("comic");
  if (!shown) nextLine();
  else while (pos < shown) nextLine(true); // смена языка: те же реплики, без повторного чтения
}

function nextLine(silent = false) {
  if (pos >= lines.length) return;
  const [who, text, mood] = lines[pos++];
  const left = who === "cat"; // Барсик пишет слева, друзья — справа, как в переписке
  const row = document.createElement("div");
  row.className = "msg " + (left ? "left" : "right");
  row.innerHTML = `<span class="ava">${who === "cat" ? cat(54, mood || "") : who === "nyu" ? nyu(54, mood || "") : ART[who](48)}</span>
    <p class="bubble"><b>${s().names[who]}</b><span class="say"></span></p>`;
  row.querySelector(".say").textContent = text;
  $("chatLog").appendChild(row);
  if (!silent && canSpeak && state.soundOn) speak(row.querySelector(".say"), null, PITCH[who] || 1);
  const last = pos >= lines.length;
  $("chatTap").textContent = last ? "" : s().comicTap;
  $("comicSkip").textContent = last ? (kind === "endings" ? s().comicEnd : s().comicStart) : s().comicSkip;
  $("comicSkip").classList.toggle("start", last);
  // переписка растёт вниз: прокручиваем за ней, чтобы новая реплика и кнопка под ней были на экране
  if (!silent) requestAnimationFrame(() => $("comicSkip").scrollIntoView({ block: "end",
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
}

function finish() { stopSpeak(); if (done) done(); }

export function initComic() {
  $("chat").onclick = () => nextLine();
  $("chat").onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); nextLine(); } };
  // сменили язык посреди вступления — показываем уже прочитанные реплики на новом языке
  document.addEventListener("langchange", () => {
    if ($("comic").classList.contains("hidden")) return;
    stopSpeak(); showComic(chId, done, pos, kind);
  });
  $("comicSkip").onclick = finish;
  $("comicBack").onclick = () => { stopSpeak(); state.chapter = null; show("story"); };
}
