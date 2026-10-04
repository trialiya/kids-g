// Сюжетный режим «История с Барсиком»: три главы по возрастанию сложности.
// Игровая логика общая с классикой (game.js), здесь — главы, остановки, прогресс и реплики героев.
import { $ } from "./dom.js";
import { state } from "./state.js";
import { LEVELS } from "./levels.js";
import { lv } from "./i18n/index.js";
import { STORY_TEXTS } from "./i18n/story-texts.js";
import { show } from "./ui.js";
import { stopSpeak, speak, toggleSpeak, canSpeak } from "./speech.js";
import { PHRASES, pickQuestion } from "./phrases.js";
import { start } from "./game.js";
import { ART, cat, lock, fish, cup, gear } from "./art.js";

const ROUNDS = 5; // в истории раунды короче, чем в классике
const s = () => STORY_TEXTS[state.lang];
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const REWARD = { fish: (sz, on) => fish(sz, on ? "#F27D52" : "#eadfce"), cup: (sz, on) => cup(sz, on ? "#FF8FB1" : "#e3ece5"),
                 gear: (sz, on) => gear(sz, on ? "#F2B33D" : "#e8dcc4") };

// who — кто говорит в сцене, art — картинка остановки; level — уровень сложности из levels.js
export const CHAPTERS = [
  { id: "day", art: "cat", reward: "fish", type: "choice", stops: [
    { id: "breakfast", level: 1, art: "bowl", who: "cat" },
    { id: "walk", level: 1, art: "bunny", who: "cat" },
    { id: "play", level: 2, art: "dog", who: "cat" },
    { id: "night", level: 2, art: "moon", who: "cat" },
  ] },
  { id: "tea", art: "cup", reward: "cup", type: "choice", stops: [
    { id: "teaBunny", level: 3, art: "bunny", who: "bunny" },
    { id: "teaDog", level: 3, art: "dog", who: "dog" },
    { id: "teaButterfly", level: 4, art: "butterfly", who: "butterfly" },
    { id: "teaRabbit", level: 4, art: "rabbit", who: "rabbit" },
  ] },
  { id: "shop", art: "gear", reward: "gear", type: "input", stops: [
    { id: "fixBunny", level: 3, art: "bunny", who: "bunny" },
    { id: "fixDog", level: 4, art: "dog", who: "dog" },
    { id: "fixButterfly", level: 4, art: "butterfly", who: "butterfly" },
    { id: "fixTown", level: 5, art: "townClock", who: "townClock" },
  ] },
];

/* ---------- прогресс: { stopId: звёзды 0..3 }, есть ключ — остановка пройдена ---------- */
let progress = {};
try { progress = JSON.parse(localStorage.getItem("storyProgress")) || {}; } catch (e) { /* хранилище недоступно */ }
function save() {
  try { localStorage.setItem("storyProgress", JSON.stringify(progress)); } catch (e) {}
  keepStorage();
}

// Просим браузер не удалять данные игры, когда на телефоне мало места.
// Вызываем после первой пройденной остановки: ребёнок уже играет, и Firefox, если спросит разрешение, спросит один раз.
function keepStorage() {
  const st = navigator.storage;
  if (!st || !st.persist || !st.persisted) return;
  st.persisted().then(yes => yes || st.persist()).catch(() => { /* не получилось — прогресс всё равно в localStorage */ });
}

function resetProgress() {
  if (!confirm(s().resetAsk)) return;
  progress = {};
  try { localStorage.removeItem("storyProgress"); } catch (e) {}
  state.chapter = null;
  renderStory();
}

const isDone = st => st.id in progress;
const doneCount = ch => ch.stops.filter(isDone).length;
const chapterOpen = i => i === 0 || doneCount(CHAPTERS[i - 1]) === CHAPTERS[i - 1].stops.length;
const stopOpen = (ch, i) => i === 0 || isDone(ch.stops[i - 1]);
const starsHtml = n => `<span class="stars-sm" aria-label="★ ${n}/3">${"★".repeat(n)}<i>${"★".repeat(3 - n)}</i></span>`;

/* ---------- экран «Главы» ---------- */
export function renderStory() {
  $("storyCat").innerHTML = cat(104, "", "Барсик");
  $("storyHello").textContent = s().hello;
  $("toClassic").textContent = s().classic;
  $("resetStory").textContent = s().reset;
  $("resetStory").classList.toggle("hidden", !Object.keys(progress).length); // сбрасывать нечего — кнопку не показываем
  $("toStory").textContent = s().toStory;
  $("sceneSpeak").setAttribute("aria-label", s().listen); $("sceneSpeak").dataset.label = s().listen;
  const box = $("chapters");
  box.innerHTML = "";
  CHAPTERS.forEach((ch, i) => {
    const open = chapterOpen(i), txt = s().chapters[ch.id];
    const b = document.createElement("button");
    b.className = `chapter-card ch-${ch.id}` + (open ? "" : " locked");
    b.disabled = !open;
    b.innerHTML = `<span class="pic">${ART[ch.art](56)}</span>
      <span class="txt"><small>${s().chapter(i + 1)}</small><b>${txt.title}</b><span>${txt.skill}</span></span>
      <span class="state">${open ? s().done(doneCount(ch), ch.stops.length) : lock(22) + `<small>${s().locked(i)}</small>`}</span>`;
    b.onclick = () => openChapter(i);
    box.appendChild(b);
  });
  if (state.chapter != null) renderChapter(state.chapter);
}

/* ---------- экран главы: дорожка остановок ---------- */
function renderChapter(i) {
  const ch = CHAPTERS[i], txt = s().chapters[ch.id];
  $("chapter").className = `card ch-${ch.id}` + ($("chapter").classList.contains("hidden") ? " hidden" : "");
  $("chBack").textContent = s().backChapters;
  $("chTitle").textContent = txt.title;
  $("chWho").innerHTML = cat(88);
  $("chIntro").textContent = txt.intro;
  const box = $("stops");
  box.innerHTML = "";
  ch.stops.forEach((st, j) => {
    const open = stopOpen(ch, j), level = LEVELS[st.level - 1];
    const b = document.createElement("button");
    b.className = "stop" + (open ? "" : " locked");
    b.disabled = !open;
    b.innerHTML = `<span class="pic">${ART[st.art](44)}</span>
      <span class="txt"><b>${s().stops[st.id].title}</b><small>${lv(level).name}</small></span>
      ${open ? (isDone(st) ? starsHtml(progress[st.id]) : "") : lock(22)}`;
    if (!open) b.title = s().stopLocked;
    b.onclick = () => playStop(i, j);
    box.appendChild(b);
  });
}

function openChapter(i) {
  state.chapter = i;
  renderChapter(i);
  show("chapter");
}

/* ---------- игра на остановке ---------- */
function playStop(i, j) {
  const ch = CHAPTERS[i], st = ch.stops[j], txt = s().stops[st.id], level = LEVELS[st.level - 1];
  // Реплика героя: показываем в облачке и, если звук включён, сразу читаем вслух (ребёнок может ещё не читать)
  const say = (text, mood) => {
    $("sceneSay").textContent = text;
    $("sceneWho").innerHTML = st.who === "cat" ? cat(72, mood) : ART[st.who](64);
    if (canSpeak && state.soundOn) speak($("sceneSay"), $("sceneSpeak"));
  };
  let last = {}, phrase = null; // текущая фраза (своя для каждого вопроса) и прошлый вопрос — чтобы не повторяться
  const texts = () => phrase ? s().phrases[phrase.id] : null;
  state.story = {
    chapter: ch.id, rounds: ROUNDS, title: txt.title,
    // время вопроса: из интервала случайной фразы остановки; в мастерской фраз нет — время любое (null → как в классике)
    next() {
      if (!PHRASES[st.id]) return null;
      const q = pickQuestion(st.id, level, last);
      phrase = q.phrase;
      last = { phraseId: q.phrase.id, key: q.h + ":" + q.m };
      return { h: q.h, m: q.m };
    },
    ask: () => say(texts() ? texts().ask : pick(s().stops[st.id].ask), ""),
    askMinutes: h => say(s().minutesAsk(h), ""),
    react: ok => say(ok ? (texts() ? texts().win : pick(s().stops[st.id].win)) : pick(s().oops), ok ? "happy" : "sad"),
    finish(score, rounds) {
      const stars = score >= rounds ? 3 : score >= rounds - 1 ? 2 : score >= 2 ? 1 : 0;
      progress[st.id] = Math.max(progress[st.id] || 0, stars);
      save();
      renderStory();
      const icons = Array.from({ length: rounds }, (_, k) => REWARD[ch.reward](34, k < score)).join("");
      const nxt = ch.stops[j + 1]; // следующий раздел главы (он уже открыт: эта остановка только что пройдена)
      return { stars, text: s().chapters[ch.id].reward(score, rounds),
               art: `${cat(96, stars >= 1 ? "happy" : "sad")}<div class="rewards">${icons}</div>`,
               next: nxt ? { label: s().nextStop(s().stops[nxt.id].title), go: () => playStop(i, j + 1) } : null };
    },
    back: () => { stopSpeak(); renderChapter(i); show("chapter"); },
    toMenuLabel: s().toChapter, backLabel: s().back,
  };
  start(level, "learn", ch.type, state.story);
}

/* ---------- переключение «История» / «Классика» ---------- */
export function setUi(ui) {
  state.ui = ui;
  try { localStorage.setItem("ui", ui); } catch (e) {}
  if (ui === "classic") {
    try { const k = localStorage.getItem("kind"); if (k) state.kind = k; } catch (e) {} // вернуть режим классики
    document.dispatchEvent(new Event("classic:show"));
  }
  show(ui === "classic" ? "menu" : "story");
}

export function initStory() {
  $("toClassic").onclick = () => setUi("classic");
  $("resetStory").onclick = resetProgress;
  $("toStory").onclick = () => setUi("story");
  $("chBack").onclick = () => { state.chapter = null; show("story"); };
  if (canSpeak) {
    $("sceneSpeak").classList.remove("hidden");
    $("sceneSpeak").onclick = () => toggleSpeak($("sceneSay"), $("sceneSpeak"));
  }
  document.addEventListener("langchange", renderStory);
  renderStory();
  show(state.ui === "classic" ? "menu" : "story");
}
