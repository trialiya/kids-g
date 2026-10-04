// Фразы истории, привязанные ко времени дня: «пора завтракать» — только утром и т. п.
// Интервалы — в 24-часовом времени, включительно ("07:00"–"10:00" = с 7 до 10 утра).
// На циферблате то же время показывается в 12-часовом виде (13:30 → 1:30).
// Тексты фраз (вопрос героя и радость после верного ответа) — в i18n/story-texts.js, раздел phrases.
// Проверка интервалов: scripts/check-phrases.mjs (каждой фразе хватает вариантов времени на её уровне).

export const PHRASES = {
  // Глава 1 «День Мурки»
  breakfast: [ // «Утро», уровень «Ровно час»
    { id: "wake",      from: "06:00", to: "08:00" },
    { id: "exercise",  from: "07:00", to: "09:00" },
    { id: "teethAm",   from: "07:00", to: "09:00" },
    { id: "breakfast", from: "07:00", to: "10:00" },
    { id: "school",    from: "07:00", to: "08:00" },
  ],
  walk: [ // «День», уровень «Ровно час»
    { id: "walkBunny", from: "10:00", to: "13:00" },
    { id: "lunch",     from: "12:00", to: "15:00" },
    { id: "nap",       from: "13:00", to: "15:00" },
    { id: "homework",  from: "15:00", to: "17:00" },
  ],
  play: [ // «Вечер», уровень «Половина»
    { id: "snack",     from: "16:00", to: "17:00" },
    { id: "playDog",   from: "16:00", to: "19:00" },
    { id: "cartoons",  from: "17:00", to: "19:00" },
    { id: "dinner",    from: "18:00", to: "20:00" },
  ],
  night: [ // «Ночь», уровень «Половина»
    { id: "bath",      from: "19:00", to: "20:30" },
    { id: "teethPm",   from: "20:00", to: "21:00" },
    { id: "fairyTale", from: "20:00", to: "21:30" },
    { id: "sleep",     from: "20:30", to: "22:00" },
  ],
  // Глава 2 «Чай у Мурки»: гости приходят в своё время
  teaBunny: [ // уровень «Четверти»
    { id: "kettle",     from: "15:30", to: "16:30" },
    { id: "bunnyTea",   from: "16:00", to: "18:00" },
  ],
  teaDog: [ // уровень «Четверти»
    { id: "dogLunch",   from: "12:00", to: "14:00" },
    { id: "dogWalk",    from: "14:00", to: "16:00" },
  ],
  teaButterfly: [ // уровень «По 5 минут»
    { id: "bflyMorning", from: "08:00", to: "10:00" },
    { id: "bflyGarden",  from: "11:00", to: "13:00" },
  ],
  teaRabbit: [ // уровень «По 5 минут»
    { id: "rabbitDinner", from: "18:00", to: "20:00" },
    { id: "rabbitHome",   from: "20:00", to: "21:00" },
  ],
  // Глава 3 «Мастерская»: остановившиеся часы могут показывать что угодно — фразы без интервала (stops.*.ask)
};

const toMin = s => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };

// Части дня для остановок — фраза остановки должна в них укладываться (проверяет scripts/check-phrases.mjs)
export const PART_OF_DAY = {
  breakfast: ["06:00", "10:00"], walk: ["10:00", "17:00"], play: ["16:00", "20:00"], night: ["19:00", "22:00"],
  teaBunny: ["08:00", "21:00"], teaDog: ["08:00", "21:00"], teaButterfly: ["08:00", "21:00"], teaRabbit: ["08:00", "21:00"],
};

// Вопрос для остановки: случайная фраза (не та же, что в прошлый раз) и время только из её интервала.
// last = { phraseId, key } — прошлый вопрос, чтобы не повторяться подряд.
export function pickQuestion(stopId, level, last = {}) {
  const list = PHRASES[stopId];
  const pool = list.length > 1 ? list.filter(p => p.id !== last.phraseId) : list;
  const phrase = pool[Math.floor(Math.random() * pool.length)];
  let times = timesFor(phrase, level);
  if (times.length > 1) times = times.filter(t => t.h + ":" + t.m !== last.key);
  const { h, m } = times[Math.floor(Math.random() * times.length)];
  return { phrase, h, m };
}

// Все времена на циферблате (12-часовые h:m), которые попадают в интервал фразы и разрешены уровнем
export function timesFor(phrase, level) {
  const from = toMin(phrase.from), to = toMin(phrase.to), seen = new Set(), out = [];
  for (let t = from; t <= to; t++) {
    const h24 = Math.floor(t / 60), m = t % 60;
    if (level.minutes && !level.minutes.includes(m)) continue;
    const h = h24 % 12 || 12, key = h + ":" + m;
    if (!seen.has(key)) { seen.add(key); out.push({ h, m }); }
  }
  return out;
}
