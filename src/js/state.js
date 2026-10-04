// Общее изменяемое состояние игры (модули импортируют один и тот же объект)
export const state = {
  lang: "ru",
  soundOn: true,
  kind: "learn",          // learn | play | clocks
  answerType: "choice",   // choice | input
  training: true,         // режим «Обучение»: подсказки и повторные попытки
  mode: "choice",         // choice | input | clocks — как отвечает ребёнок
  level: null,
  qIndex: 0,
  score: 0,
  current: null,          // { h, m } — загаданное время
  guessH: 12,
  guessM: 0,
  answered: false,
  lastKey: null,
  attempts: 0,
  revealed: false,
  step: null,             // обучение по шагам: "h" — сначала часы, "m" — потом минуты; null — сразу всё время
  helped: false,          // на шаге часов была подсказка или ошибка
  ui: "story",            // story — «История с Барсиком» (по умолчанию) | classic — классический режим
  story: null,            // текущая остановка истории (реплики героя, итог) или null в классике
  chapter: null,          // открытая глава истории
  rounds: 10,             // вопросов в забеге
};

try { state.soundOn = localStorage.getItem("sound") !== "off"; } catch (e) { /* хранилище недоступно */ }
try { if (localStorage.getItem("ui") === "classic") state.ui = "classic"; } catch (e) { /* хранилище недоступно */ }
