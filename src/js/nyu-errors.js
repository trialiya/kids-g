// «Ошибки Ню»: на часах h:m, а Ню прочитала неправильно — типичные детские ошибки.
// Её ответ должен лежать на сетке минут уровня: он среди вариантов ответа или стоит на стрелочках.
import { nextHour as next, prevHour as prev } from "./dom.js";

// id — какая ошибка (по нему Ню потом объясняет, что перепутала, — story-texts.js, nyuOops)
const ERRORS = [
  { id: "swap", make: (h, m) => ({ h: (m / 5 | 0) || 12, m: (h % 12) * 5 }), when: (h, m) => m % 5 === 0 },
  { id: "hourNext", make: (h, m) => ({ h: next(h), m }) },
  { id: "hourPrev", make: (h, m) => ({ h: prev(h), m }) },
  { id: "minNumber", make: (h, m) => ({ h, m: m / 5 }), when: (h, m) => m % 5 === 0 && m >= 10 }, // «длинная на 2 — значит 2 минуты»
  { id: "minOpp", make: (h, m) => ({ h, m: (m + 30) % 60 }), when: (h, m) => m % 30 === 0 }, // ровно ↔ половина
  { id: "minOff", make: (h, m) => ({ h, m: (m + (Math.random() < .5 ? 5 : 55)) % 60 }), when: (h, m) => m % 5 === 0 },
];

// step — шаг минут уровня (0 — только ровные часы); avoid — ошибки, которые уже были в сессии.
// Возвращает { h, m, error }.
export function nyuMistake(h, m, step, avoid = new Set()) {
  const st = Math.max(step, 1);
  const ok = w => (w.h !== h || w.m !== m) && w.m % st === 0 && (step !== 0 || w.m === 0);
  const variants = ERRORS.filter(e => !e.when || e.when(h, m)).map(e => ({ ...e.make(h, m), error: e.id })).filter(ok);
  const fresh = variants.filter(v => !avoid.has(v.error)); // по возможности новая ошибка
  const pool = fresh.length ? fresh : variants;
  return pool[Math.floor(Math.random() * pool.length)]; // hourNext/hourPrev подходят всегда
}

export const NYU_ERRORS = ERRORS.map(e => e.id);
