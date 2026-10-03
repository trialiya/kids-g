// Уровни сложности и режимы игры
export const ROUNDS = 10;

// step — шаг минут в ответе; mins — какие минуты может показывать часы
export const LEVELS = [
  { id: 1, step: 0,
    minutes: [0], numbers: true },
  { id: 2, step: 30,
    minutes: [0, 30], numbers: true },
  { id: 3, step: 15,
    minutes: [0, 15, 30, 45], numbers: true },
  { id: 4, step: 5,
    minutes: [0,5,10,15,20,25,30,35,40,45,50,55], numbers: true },
  { id: 5, step: 1,
    minutes: null, numbers: false },
];

export const KINDS = { learn: { icon: "🎓" }, play: { icon: "🏆" }, clocks: { icon: "🕒" } };
