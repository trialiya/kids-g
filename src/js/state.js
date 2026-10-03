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
};

try { state.soundOn = localStorage.getItem("sound") !== "off"; } catch (e) { /* хранилище недоступно */ }
