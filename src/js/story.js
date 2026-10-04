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
import { showComic } from "./comic.js";
import { initAlbum, openAlbum, stickerHtml } from "./album.js";
import { OUTFITS, setOutfit } from "./outfits.js";
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

// Остановка пройдена, если хоть раз было 4 из 5 верных с первой попытки (2 звезды и больше) —
// только тогда открывается следующая. Сыгранная, но не пройденная остановка показывает свои звёзды.
const PASS_STARS = 2;
const PASS_SCORE = rounds => rounds - 1; // 4 из 5 — то же, что PASS_STARS
const isPlayed = st => st.id in progress;
const isDone = st => (progress[st.id] || 0) >= PASS_STARS;
const doneCount = ch => ch.stops.filter(isDone).length;
const chapterOpen = i => i === 0 || doneCount(CHAPTERS[i - 1]) === CHAPTERS[i - 1].stops.length;
const stopOpen = (ch, i) => i === 0 || isDone(ch.stops[i - 1]);
const totalStars = () => Object.values(progress).reduce((a, n) => a + n, 0);
const starsHtml = n => `<span class="stars-sm" aria-label="★ ${n}/3">${"★".repeat(n)}<i>${"★".repeat(3 - n)}</i></span>`;

/* ---------- экран «Главы» ---------- */
export function renderStory() {
  $("storyCat").innerHTML = cat(104, "", "Барсик");
  $("storyHello").textContent = s().hello;
  $("toClassic").textContent = s().classic;
  $("toAlbum").innerHTML = `📒 ${s().album}`;
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
      ${open ? (isPlayed(st) ? starsHtml(progress[st.id]) : "") : lock(22)}`;
    if (!open) b.title = s().stopLocked;
    b.onclick = () => playStop(i, j);
    box.appendChild(b);
  });
}

// Глава всегда открывается вступлением-комиксом, после него (или «Пропустить») — дорожка остановок
function openChapter(i) {
  state.chapter = i;
  showComic(CHAPTERS[i].id, () => { renderChapter(i); show("chapter"); });
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
  // Сессия — одно прохождение остановки: фразы, время и реплики в ней не повторяются («Ещё раз» — новая сессия)
  let used, seen, phrase = null;
  const newSession = () => { used = { phrases: new Set(), times: new Set() }; seen = new Set(); };
  newSession();
  // случайная реплика из списка, которой ещё не было в сессии; все уже были — список идёт по новому кругу
  const fresh = arr => {
    let pool = arr.filter((_, k) => !seen.has(arr[k]));
    if (!pool.length) { arr.forEach(x => seen.delete(x)); pool = arr; }
    const x = pick(pool); seen.add(x); return x;
  };
  const texts = () => phrase ? s().phrases[phrase.id] : null;
  state.story = {
    chapter: ch.id, rounds: ROUNDS, title: txt.title, clock: st.id, // clock — оформление часов (clock-themes.js)
    // время вопроса: из интервала случайной фразы остановки; в мастерской фраз нет — время любое (null → как в классике)
    next() {
      if (!PHRASES[st.id]) return null;
      const q = pickQuestion(st.id, level, used);
      phrase = q.phrase;
      return { h: q.h, m: q.m };
    },
    onStart: newSession,
    ask: () => say(texts() ? texts().ask : fresh(s().stops[st.id].ask), ""),
    askMinutes: h => say(fresh(s().minutesAsk)(h), ""),
    react: ok => say(ok ? (texts() ? texts().win : fresh(s().stops[st.id].win)) : fresh(s().oops), ok ? "happy" : "sad"),
    finish(score, rounds) {
      const stars = score >= rounds ? 3 : score >= rounds - 1 ? 2 : score >= 2 ? 1 : 0;
      const before = progress[st.id] || 0, starsBefore = totalStars(), chapterBefore = ch.stops.every(isDone);
      progress[st.id] = Math.max(before, stars);
      save();
      renderStory();
      const icons = Array.from({ length: rounds }, (_, k) => REWARD[ch.reward](34, k < score)).join("");
      // следующий раздел главы — только если эта остановка пройдена (сейчас или раньше), иначе подсказка, сколько нужно
      const nxt = isDone(st) ? ch.stops[j + 1] : null;
      const lockNote = !isDone(st) && (ch.stops[j + 1] || CHAPTERS[i + 1]) ? `<p class="end-lock">${lock(18)} ${s().needToPass(PASS_SCORE(rounds), rounds)}</p>` : "";
      // итоговая реплика Барсика — по числу верных ответов с первой попытки
      const band = score >= rounds ? "all" : score >= rounds - 1 ? "almost" : score >= Math.ceil(rounds / 2) ? "half" : score > 0 ? "some" : "none";
      const mood = score >= Math.ceil(rounds / 2) ? "happy" : score > 0 ? "" : "sad";
      // награды за эту попытку: новая наклейка (золотая за 5 из 5), наклейка главы, новые наряды Барсика
      const unlocks = [];
      if (before < 2 && stars >= 2 || before < 3 && stars === 3)
        unlocks.push(`<div class="unlock">${stickerHtml(st.art, { gold: stars === 3 })}<b>${s()[stars === 3 ? "newGold" : "newSticker"]}</b></div>`);
      if (!chapterBefore && ch.stops.every(isDone))
        unlocks.push(`<div class="unlock">${stickerHtml(ch.art, { big: true, gold: true, size: 64 })}<b>${s().newChapterSticker}</b></div>`);
      OUTFITS.filter(o => starsBefore < o.stars && totalStars() >= o.stars).forEach(o =>
        unlocks.push(`<div class="unlock">${cat(64, "happy", "", o.id)}<b>${s().newOutfit(s().outfits[o.id])}</b>
          <button class="wear-btn" data-wear="${o.id}" type="button">${s().wear}</button></div>`));
      return { stars, text: s().chapters[ch.id].reward(score, rounds),
               art: `<span class="end-pic">${cat(96, mood)}</span><p class="bubble end-say">${pick(s().finale[band])}</p>` +
                    `<div class="rewards">${icons}</div>${lockNote}` + (unlocks.length ? `<div class="unlocks">${unlocks.join("")}</div>` : ""),
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
  initAlbum({ chapters: CHAPTERS, stars: id => progress[id] || 0, total: totalStars });
  $("toAlbum").onclick = () => openAlbum();
  // «Надеть» новый наряд прямо с экрана итога
  $("endArt").addEventListener("click", e => {
    const b = e.target.closest("[data-wear]");
    if (!b) return;
    setOutfit(b.dataset.wear);
    b.textContent = s().wearing; b.disabled = true;
    const pic = $("endArt").querySelector(".end-pic"); if (pic) pic.innerHTML = cat(96, "happy");
  });
  document.addEventListener("outfitchange", renderStory); // Барсик на главной и в главе — в новом наряде
  if (canSpeak) {
    $("sceneSpeak").classList.remove("hidden");
    $("sceneSpeak").onclick = () => toggleSpeak($("sceneSay"), $("sceneSpeak"));
  }
  document.addEventListener("langchange", renderStory);
  renderStory();
  show(state.ui === "classic" ? "menu" : "story");
}
