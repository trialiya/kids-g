// Проверка фраз истории: node scripts/check-phrases.mjs
// - у каждой фразы корректный интервал внутри своей части дня;
// - на уровне остановки у фразы хватает вариантов времени (минимум 2);
// - выбранное игрой время всегда лежит в интервале своей фразы, и в одной сессии фразы не повторяются;
// - у каждой фразы есть тексты на ru и en.
import { PHRASES, PART_OF_DAY, timesFor, pickQuestion } from "../src/js/phrases.js";
import { LEVELS } from "../src/js/levels.js";
import { STORY_TEXTS } from "../src/js/i18n/story-texts.js";

const SESSION = 5; // вопросов на остановке истории (ROUNDS в story.js)
const STOP_LEVEL = { breakfast: 1, walk: 1, play: 2, night: 2, teaBunny: 3, teaDog: 3, teaButterfly: 4, teaRabbit: 4, nyuDay: 2, nyuTea: 4, nyuShop: 5 };
const toMin = s => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
const errors = [], rows = [];
const inInterval = (p, level, h, m) => { // есть ли 24-часовое время из интервала, которое на циферблате выглядит как h:m
  for (let t = toMin(p.from); t <= toMin(p.to); t++)
    if ((Math.floor(t / 60) % 12 || 12) === h && t % 60 === m && (!level.minutes || level.minutes.includes(m))) return true;
  return false;
};

for (const [stop, list] of Object.entries(PHRASES)) {
  const level = LEVELS[STOP_LEVEL[stop] - 1];
  const [dayFrom, dayTo] = PART_OF_DAY[stop].map(toMin);
  if (!level) errors.push(`${stop}: нет уровня`);
  for (const p of list) {
    const from = toMin(p.from), to = toMin(p.to);
    if (!/^\d\d:\d\d$/.test(p.from) || !/^\d\d:\d\d$/.test(p.to)) errors.push(`${p.id}: формат времени`);
    if (from >= to) errors.push(`${p.id}: начало ${p.from} не раньше конца ${p.to}`);
    if (from < dayFrom || to > dayTo) errors.push(`${p.id}: ${p.from}–${p.to} выходит за часть дня ${PART_OF_DAY[stop].join("–")}`);
    const times = timesFor(p, level);
    if (times.length < 2) errors.push(`${p.id}: на уровне ${level.id} всего ${times.length} вариант(ов) времени`);
    for (const lang of ["ru", "en"]) {
      const tx = STORY_TEXTS[lang].phrases[p.id];
      if (!tx || !tx.ask || !tx.win) errors.push(`${p.id}: нет текста ${lang}`);
    }
    rows.push(`${stop.padEnd(12)} ур.${level.id}  ${p.id.padEnd(13)} ${p.from}–${p.to}  вариантов: ${String(times.length).padStart(3)}  ` +
      times.slice(0, 6).map(t => `${t.h}:${String(t.m).padStart(2, "0")}`).join(" ") + (times.length > 6 ? " …" : "") +
      `   «${STORY_TEXTS.ru.phrases[p.id]?.ask}»`);
  }
  if (list.length < SESSION) errors.push(`${stop}: всего ${list.length} фраз, а вопросов в сессии ${SESSION}`);
  // выбор игрой: 400 сессий по ${SESSION} вопросов — время всегда в интервале фразы, фразы в сессии не повторяются
  for (let n = 0; n < 400; n++) {
    const used = { phrases: new Set(), times: new Set() }, ids = [];
    for (let i = 0; i < SESSION; i++) {
      const q = pickQuestion(stop, level, used), key = q.h + ":" + q.m;
      if (!inInterval(q.phrase, level, q.h, q.m)) { errors.push(`${stop}: выбрано ${key} вне ${q.phrase.id} ${q.phrase.from}–${q.phrase.to}`); break; }
      ids.push(q.phrase.id);
    }
    if (new Set(ids).size !== ids.length) { errors.push(`${stop}: в сессии повторилась фраза: ${ids.join(", ")}`); break; }
  }
}
for (const lang of ["ru", "en"]) for (const id of Object.keys(STORY_TEXTS[lang].phrases))
  if (!Object.values(PHRASES).flat().some(p => p.id === id)) errors.push(`${lang}: текст ${id} без фразы`);

console.log(rows.join("\n"));
console.log(errors.length ? "\nОШИБКИ:\n" + errors.join("\n") : "\nВсё в порядке: интервалы корректны, время выбирается только внутри интервала фразы, в сессии без повторов.");
process.exit(errors.length ? 1 : 0);
