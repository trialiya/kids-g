// Ход игры: вопросы, ответы, обратная связь, итог
import { $, ns, pad, fmt, shuffle, nextHour, prevHour } from "./dom.js";
import { state } from "./state.js";
import { ROUNDS, LEVELS, KINDS } from "./levels.js";
import { t, lv } from "./i18n/index.js";
import { sfx } from "./audio.js";
import { celebrate, confetti } from "./effects.js";
import { canSpeak, speak, stopSpeak, toggleSpeak, isSpeakingFrom } from "./speech.js";
import { drawClock, drawClockInto } from "./clock.js";
import { explainCorrect, explainMistake, explainClockMistake, timeText, timeWords } from "./explain.js";
import { show, showMenu } from "./ui.js";

export function start(l, k, type) {
  state.level = l; state.kind = k; state.answerType = type || "choice";
  state.training = state.kind === "learn";
  state.mode = state.kind === "clocks" ? "clocks" : state.answerType;
  state.qIndex = 0; state.score = 0; state.lastKey = null;
  $("levelName").textContent = `${KINDS[state.kind].icon} ${t("lvShort", l.id)}`;
  $("tipText").innerHTML = "💡 " + lv(l).tip;
  $("levelTip").classList.toggle("hidden", !state.training);
  const clocks = state.mode === "clocks";
  $("clock").classList.toggle("hidden", clocks);
  document.querySelector(".legend").classList.toggle("hidden", clocks);
  $("timeCard").classList.toggle("hidden", !clocks);
  $("choices").classList.toggle("clock-grid", clocks);
  const inp = state.mode === "input";
  $("answer").classList.toggle("hidden", !inp);
  $("check").classList.toggle("hidden", !inp);
  $("choices").classList.toggle("hidden", inp);
  $("mSpin").classList.toggle("hidden", l.step === 0);
  document.querySelector(".colon").classList.toggle("hidden", l.step === 0);
  show("game");
  nextQuestion();
}

function randomTime() {
  let h, m, key;
  do {
    h = 1 + Math.floor(Math.random() * 12);
    m = state.level.minutes ? state.level.minutes[Math.floor(Math.random() * state.level.minutes.length)]
                      : Math.floor(Math.random() * 60);
    key = h + ":" + m;
  } while (key === state.lastKey);
  state.lastKey = key;
  return { h, m };
}

function nextQuestion() {
  stopSpeak();
  if (state.qIndex >= ROUNDS) return finish();
  state.current = randomTime();
  state.guessH = 12; state.guessM = 0; state.answered = false; state.attempts = 0; state.revealed = false;
  // в «Обучении» сначала спрашиваем только часы, потом минуты (и в выборе из 4, и при вводе стрелочками)
  state.step = state.training && state.mode !== "clocks" && state.level.step > 0 ? "h" : null;
  state.helped = false;
  if (state.mode === "clocks") {
    $("timeBig").textContent = state.level.step === 0 ? state.current.h + ":00" : fmt(state.current.h, state.current.m);
    $("timeWords").textContent = timeWords(state.current.h, state.current.m);
  } else drawClock(state.current.h, state.current.m);
  updateAnswer();
  $("feedback").classList.add("hidden");
  $("next").classList.add("hidden");
  if (state.mode === "input") $("check").classList.remove("hidden");
  setSpinEnabled(true);
  makeChoices();
  $("bar").style.width = (state.qIndex / ROUNDS * 100) + "%";
  $("score").textContent = "⭐ " + state.score;
}

function setSpinEnabled(on) {
  ["hUp", "hDn", "mUp", "mDn"].forEach(id => $(id).disabled = !on);
}

function updateAnswer() {
  $("hVal").textContent = state.guessH;
  $("mVal").textContent = state.step === "h" ? "··" : pad(state.guessM); // минуты ещё не спрашивали
}

const stepM = () => Math.max(state.level.step, 1);
$("hUp").onclick = () => { state.guessH = state.guessH % 12 + 1; updateAnswer(); };
$("hDn").onclick = () => { state.guessH = (state.guessH + 10) % 12 + 1; updateAnswer(); };
$("mUp").onclick = () => { state.guessM = (state.guessM + stepM()) % 60; updateAnswer(); };
$("mDn").onclick = () => { state.guessM = (state.guessM - stepM() + 60) % 60; updateAnswer(); };

$("check").onclick = () => {
  if (state.answered) return;
  if (!state.step) return submit(state.guessH, state.level.step === 0 ? 0 : state.guessM);
  // обучение по шагам: сначала проверяем только часы, потом только минуты
  const { h, m } = state.current;
  if (state.step === "h") state.guessH === h ? toMinutes() : wrongStep(state.guessH, m);
  else if (state.guessM === m) submit(h, m, state.attempts > 0 || state.revealed || state.helped);
  else wrongStep(h, state.guessM);
};


function makeChoices() {
  const box = $("choices");
  box.innerHTML = "";
  showStep();
  if (state.mode === "input") return;
  if (state.step) return makeStepChoices(box);
  const { h, m } = state.current, key = (a, b) => a + ":" + b;
  const grid = state.level.minutes || null;
  const okM = x => (x + 60) % 60;
  const snap = x => state.level.step > 1 ? Math.round(okM(x) / state.level.step) * state.level.step % 60 : okM(x);
  const cand = [];
  if (state.level.step === 0) {
    [1, -1, 2, -2, 6].forEach(d => cand.push([(h + d + 11) % 12 + 1, 0]));
  } else {
    const st = stepM();
    cand.push([h, snap(m + 30)]);                                  // другая сторона
    cand.push([nextHour(h), m], [prevHour(h), m]);                 // час ± 1
    cand.push([(m / 5 | 0) || 12, snap((h % 12) * 5)]);            // перепутаны стрелки
    cand.push([h, snap(Math.floor(m / 5))]);                       // цифра как минуты
    cand.push([h, snap(m + st)], [h, snap(m - st)]);               // соседнее деление
    cand.push([nextHour(h), snap(m + st)], [prevHour(h), snap(m - st)]);
  }
  const seen = new Set([key(h, m)]), opts = [{ h, m }];
  // на картинке часы с разницей в минуту не отличить — для режима «Найди часы» нужна заметная разница
  const close = (ch, cm) => state.mode === "clocks" && opts.some(o => o.h === ch && Math.min(Math.abs(o.m - cm), 60 - Math.abs(o.m - cm)) < 5);
  shuffle(cand).forEach(([ch, cm]) => {
    const k = key(ch, cm);
    if (opts.length < 4 && !seen.has(k) && !close(ch, cm)) { seen.add(k); opts.push({ h: ch, m: cm }); }
  });
  while (opts.length < 4) { // добор случайными, если подсказок не хватило
    const ch = 1 + Math.floor(Math.random() * 12);
    const cm = state.level.step === 0 ? 0 : (grid ? grid[Math.floor(Math.random() * grid.length)] : Math.floor(Math.random() * 60));
    const k = key(ch, cm);
    if (!seen.has(k) && !close(ch, cm)) { seen.add(k); opts.push({ h: ch, m: cm }); }
  }
  shuffle(opts).forEach((o, i) => {
    const b = document.createElement("button");
    b.dataset.h = o.h; b.dataset.m = o.m;
    if (state.mode === "clocks") {
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", "0 0 200 200");
      drawClockInto(svg, o.h, o.m, false, false); // на маленьких часах зверушки мешают
      b.appendChild(svg);
      b.setAttribute("aria-label", t("clockOptAria", i + 1));
    } else {
      b.textContent = state.level.step === 0 ? o.h + ":00" : fmt(o.h, o.m);
      b.setAttribute("aria-label", t("optAria", i + 1, o.h, o.m));
    }
    b.onclick = () => choose(o, b);
    box.appendChild(b);
  });
}

/* Обучение по шагам: подсказка над вариантами и приглушённая «чужая» стрелка */
function showStep() {
  const ask = $("stepAsk");
  ask.classList.toggle("hidden", !state.step);
  if (state.step) ask.innerHTML = state.step === "h" ? t("stepHour") : t("stepMin", state.current.h);
  $("clock").classList.toggle("focus-h", state.step === "h");
  $("clock").classList.toggle("focus-m", state.step === "m");
  // ввод стрелочками: на шаге часов минуты заблокированы, на шаге минут час уже зафиксирован
  const inp = state.mode === "input" && !state.answered;
  $("mSpin").classList.toggle("locked", inp && state.step === "h");
  $("hSpin").classList.toggle("done", inp && state.step === "m");
  if (inp && state.step) {
    $("hUp").disabled = $("hDn").disabled = state.step === "m";
    $("mUp").disabled = $("mDn").disabled = state.step === "h";
  }
  updateAnswer();
}

// Час угадан — переходим к минутам
function toMinutes() {
  stopSpeak();
  state.helped = state.attempts > 0 || state.revealed;
  state.revealed = false;
  state.step = "m";
  sfx.ok();
  $("feedback").classList.add("hidden");
  makeChoices();
}

function wrongStep(gh, gm) {
  state.attempts++;
  sfx.bad();
  showRetryFeedback(gh, gm);
}

// Четыре варианта: правильный + похожие ошибки (cand), при нехватке — случайные (rnd)
function pickOptions(right, cand, rnd) {
  const opts = [right];
  shuffle(cand).forEach(c => { if (opts.length < 4 && !opts.includes(c)) opts.push(c); });
  for (let tries = 0; opts.length < 4 && tries < 200; tries++) { const c = rnd(); if (!opts.includes(c)) opts.push(c); }
  return shuffle(opts);
}

function makeStepChoices(box) {
  const { h, m } = state.current;
  const hourStep = state.step === "h";
  // на «Половине» всего два значения минут — неверные варианты тогда берём по 5 минут
  const st = state.level.minutes && state.level.minutes.length < 4 ? 5 : stepM();
  const snap = x => Math.round(((x + 60) % 60) / st) * st % 60;
  const vals = hourStep
    ? pickOptions(h, [nextHour(h), prevHour(h), (m / 5 | 0) || 12, (h + 5) % 12 + 1], // ±1 час, перепутаны стрелки, напротив
                  () => 1 + Math.floor(Math.random() * 12))
    : pickOptions(m, [snap(m + 30), snap(m + st), snap(m - st), snap((h % 12) * 5), snap(Math.floor(m / 5))],
                  () => snap(Math.floor(Math.random() * 60)));
  vals.forEach((v, i) => {
    const o = hourStep ? { h: v, m } : { h, m: v }; // вторая часть ответа уже верная
    const b = document.createElement("button");
    b.dataset.h = o.h; b.dataset.m = o.m;
    b.textContent = hourStep ? v : fmt(h, v);
    b.setAttribute("aria-label", hourStep ? t("hourOptAria", i + 1, v) : t("optAria", i + 1, h, v));
    b.onclick = () => choose(o, b);
    box.appendChild(b);
  });
}

/* Режим «выбор из 4»: можно пробовать несколько раз.
   Правильный вариант подсвечивается только после просмотра подсказки или её прослушивания. */
function choose(o, btn) {
  if (state.answered) return;
  if (!state.training) { submit(o.h, o.m, false); return; } // основной режим: одна попытка
  if (o.h === state.current.h && o.m === state.current.m) {
    stopSpeak();
    if (state.step === "h") return toMinutes();
    submit(o.h, o.m, state.attempts > 0 || state.revealed || state.helped);
    return;
  }
  state.attempts++;
  sfx.bad();
  btn.disabled = true;
  btn.classList.add("wrong");
  showRetryFeedback(o.h, o.m);
}

function revealAnswer() {
  if (state.revealed || !state.training) return;
  state.revealed = true;
  document.querySelectorAll("#choices button").forEach(b => {
    if (+b.dataset.h === state.current.h && +b.dataset.m === state.current.m) b.classList.add("right");
  });
}

function showRetryFeedback(gh, gm) {
  stopSpeak();
  const f = $("feedback");
  f.className = "feedback bad";
  const speakBtn = canSpeak
    ? `<button class="speak" id="speak" type="button" aria-label="${t("speakHint")}" title="${t("speakTitle")}">🔊</button>` : "";
  const bullets = explainMistake(state.current.h, state.current.m, gh, gm).map(s => `<li>${s}</li>`).join("");
  f.innerHTML = `<h3>${mood(false)}${t("fbRetry")}${speakBtn}</h3>
    <details id="hint"><summary>${t("hintLabel")}</summary><ul>${bullets}</ul>
    <div class="hintnote">${t("hintNote")}</div></details>`;
  f.classList.remove("hidden");
  const hintEl = $("hint");
  hintEl.addEventListener("toggle", () => { if (hintEl.open) revealAnswer(); }); // элемент может исчезнуть до события
  const sp = $("speak");
  if (sp) sp.dataset.label = t("speakHint");
  if (sp) sp.onclick = () => {
    if (isSpeakingFrom(sp)) return stopSpeak();
    revealAnswer();
    $("hint").open = true;
    speak(f, sp);
  };
}

function submit(gh, gm, assisted) {
  if (state.answered) return;
  state.answered = true;
  if (state.step) { state.step = null; showStep(); }
  $("mSpin").classList.remove("locked"); $("hSpin").classList.remove("done");
  const ok = gh === state.current.h && gm === state.current.m;
  document.querySelectorAll("#choices button").forEach(b => {
    b.disabled = true;
    if (+b.dataset.h === state.current.h && +b.dataset.m === state.current.m) b.classList.add("right");
    else if (+b.dataset.h === gh && +b.dataset.m === gm) b.classList.add("wrong");
  });
  if (ok && !assisted) state.score++;
  $("score").textContent = "⭐ " + state.score;
  if (ok) celebrate(!assisted); else sfx.bad();
  showFeedback(ok, gh, gm, assisted);
  setSpinEnabled(false);
  $("check").classList.add("hidden");
  $("next").classList.remove("hidden");
  $("next").scrollIntoView({ block: "nearest", behavior: "smooth" });
  $("next").textContent = t(state.qIndex === ROUNDS - 1 ? "result" : "next");
  state.qIndex++;
  $("bar").style.width = (state.qIndex / ROUNDS * 100) + "%";
}
$("next").onclick = nextQuestion;

/* ---------- клавиатура (компьютер) ---------- */
document.addEventListener("keydown", e => {
  if ($("game").classList.contains("hidden")) return;
  if (state.mode !== "input" && !state.answered && /^[1-4]$/.test(e.key)) {
    const b = $("choices").children[+e.key - 1]; if (b) b.click(); return;
  }
  if (e.key === "Enter" && (state.mode === "input" || state.answered)) {
    const b = state.answered ? $("next") : $("check");
    if (document.activeElement && document.activeElement.tagName === "BUTTON" && document.activeElement !== b) return;
    e.preventDefault(); b.click();
  } else if (!state.answered) {
    const map = { ArrowUp: "hUp", ArrowDown: "hDn", ArrowRight: "mUp", ArrowLeft: "mDn" };
    if (state.mode === "input" && map[e.key]) { e.preventDefault(); $(map[e.key]).click(); }
  }
});


// Большой смайлик: радостный за верный ответ, грустный — за ошибку
function mood(ok) {
  const faces = ok ? ["😄", "😃", "🥳", "😊"] : ["😢", "😟", "🙁", "😿"];
  return `<span class="mood ${ok ? "happy" : "sad"}" aria-hidden="true">${faces[Math.floor(Math.random() * faces.length)]}</span>`;
}

function showFeedback(ok, gh, gm, assisted) {
  const f = $("feedback");
  f.className = "feedback " + (ok ? "ok" : "bad");
  const speakBtn = canSpeak
    ? `<button class="speak" id="speak" type="button" aria-label="${t("speakExpl")}" title="${t("speakTitle")}">🔊</button>` : "";
  const li = arr => arr.map(x => `<li>${x}</li>`).join("");
  const shown = state.level.step === 0 ? gh + ":00" : fmt(gh, gm);
  let html;
  if (ok) {
    html = `<h3>${mood(true)}${t(assisted ? "fbOkHint" : "fbOk")}${speakBtn}</h3><div>${timeText(state.current.h, state.current.m)}</div>`;
    html += `<details style="margin-top:6px"><summary>${t("why")}</summary><ul>${li(explainCorrect(state.current.h, state.current.m))}</ul></details>`;
  } else if (state.mode === "clocks") {
    html = `<h3>${mood(false)}${t("fbBad")}${speakBtn}</h3>`;
    html += `<div>${t("fbClockLine", timeText(state.current.h, state.current.m), shown)}</div>`;
    html += `<ul>${li(explainClockMistake(state.current.h, state.current.m, gh, gm))}</ul>`;
    html += `<div style="margin-top:8px"><b>${t("fbHowFind")}</b></div><ul>${li(explainCorrect(state.current.h, state.current.m))}</ul>`;
  } else {
    html = `<h3>${mood(false)}${t("fbBad")}${speakBtn}</h3>`;
    html += `<div>${t("fbAnswered", shown, timeText(state.current.h, state.current.m))}</div>`;
    html += `<ul>${li(explainMistake(state.current.h, state.current.m, gh, gm))}</ul>`;
    html += `<div style="margin-top:8px"><b>${t("fbHowRight")}</b></div><ul>${li(explainCorrect(state.current.h, state.current.m))}</ul>`;
  }
  f.innerHTML = html;
  const sp = $("speak");
  if (sp) { sp.dataset.label = t("speakExpl"); sp.onclick = () => toggleSpeak(f, sp); }
}


function finish() {
  const stars = state.score >= 9 ? 3 : state.score >= 7 ? 2 : state.score >= 4 ? 1 : 0;
  $("endTitle").textContent = t(stars === 3 ? "endGreat" : stars >= 1 ? "endGood" : "endMore");
  $("endStars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
  const next = LEVELS[state.level.id] ;
  $("endText").textContent = t("endScore", state.score, ROUNDS) +
    (stars >= 2 && next ? t("endNext", lv(next).name) : stars < 2 ? t("endRetry", state.training) : "");
  show("end");
  if (stars >= 2) { sfx.win(); confetti(stars === 3 ? 40 : 24); }
}


export function initGame() {
  $("back").onclick = $("toMenu").onclick = showMenu;
  $("again").onclick = () => start(state.level, state.kind, state.answerType);
}
