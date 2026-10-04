// Рисование стрелочных часов в SVG
import { $, el } from "./dom.js";
import { state } from "./state.js";
import { drawAnimal, ANIMALS } from "./animals.js";
import catFace from "../assets/cat-face.jpg";
import { cat } from "./art.js";
import { CLOCK_THEMES } from "./clock-themes.js";

export function drawClock(h, m) {
  // в основном режиме цифры минут — это подсказка, их нет; в истории — рисованный Барсик в центре, без зверушек и фото
  drawClockInto($("clock"), h, m, state.level.numbers && state.training, !state.story, !!state.story,
                state.story && CLOCK_THEMES[state.story.clock]); // в истории у каждой остановки свои часы
  if (state.story && state.story.animals) drawAnimals($("clock"));
}

// Зверушки: маленькие между цифрами и крупные по углам — чисто для красоты
const RING = ["cat", "bunny", "dog", "butterfly", "rabbit", "cat", "dog", "butterfly", "bunny", "rabbit", "dog", "butterfly"];
const CORNERS = [["cat", 19, 19], ["bunny", 181, 21], ["dog", 19, 181], ["butterfly", 181, 181]];

// animals — украшения классики (зверушки и фото кота); cartoon — рисованный Барсик как в макетах (история)
// theme — оформление часов остановки (clock-themes.js): цвет обода и фона, украшения вокруг
export function drawClockInto(svg, h, m, minuteNumbers, animals = true, cartoon = false, theme = null) {
  svg.innerHTML = "";
  // украшениям нужно место вокруг циферблата — раздвигаем рамку рисунка
  if (svg.id === "clock") svg.setAttribute("viewBox", theme ? "-22 -22 244 244" : "0 0 200 200");
  if (theme && theme.back) theme.back(svg);
  const face = theme ? theme.face : "#fffdf5";
  if (animals) CORNERS.forEach(([a, x, y], i) =>
    drawAnimal(svg, a, x, y, .62, "animal corner c" + i));
  if (theme) el("circle", { cx: 100, cy: 100, r: 96 + (theme.rimW || 6), fill: theme.rim, stroke: "#2b2d42", "stroke-width": 3 }, svg);
  el("circle", { cx: 100, cy: 100, r: 96, fill: face, stroke: "#2b2d42", "stroke-width": theme ? 3 : 5 }, svg);
  if (animals) { // морда нашего кота в середине циферблата, высветленная, чтобы цифры читались
    const clip = el("clipPath", { id: "dialClip" }, el("defs", {}, svg));
    el("circle", { cx: 100, cy: 100, r: 93.5 }, clip);
    el("image", { href: catFace, x: 6, y: 6, width: 188, height: 188, "clip-path": "url(#dialClip)",
                  preserveAspectRatio: "xMidYMid slice" }, svg);
    el("circle", { cx: 100, cy: 100, r: 94, fill: "url(#dialFade)" }, svg);
    const fade = el("radialGradient", { id: "dialFade" }, svg.querySelector("defs"));
    el("stop", { offset: "40%", "stop-color": "#fffdf5", "stop-opacity": .25 }, fade);
    el("stop", { offset: "60%", "stop-color": "#fffdf5", "stop-opacity": .7 }, fade);
    el("stop", { offset: "100%", "stop-color": "#fffdf5", "stop-opacity": .85 }, fade);
  }
  if (cartoon) { // мордочка Барсика (90×90) в центре: цифры часов на радиусе 68 остаются снаружи
    const g = el("g", { transform: "translate(55 52)", opacity: .85, class: "dial-cat", "aria-hidden": "true" }, svg);
    g.innerHTML = ((state.story && state.story.hero) || cat)(90); // в главе Ню — Ню
  }
  if (animals) RING.forEach((a, i) => {
    const ang = (i * 30 + 15) * Math.PI / 180;
    drawAnimal(svg, a, 100 + 75 * Math.sin(ang), 100 - 75 * Math.cos(ang), .27);
  });
  for (let i = 0; i < 60; i++) {
    const a = i * 6 * Math.PI / 180, big = i % 5 === 0;
    const r1 = big ? 82 : 87, r2 = 91;
    el("line", { x1: 100 + r1 * Math.sin(a), y1: 100 - r1 * Math.cos(a),
                 x2: 100 + r2 * Math.sin(a), y2: 100 - r2 * Math.cos(a),
                 stroke: "#2b2d42", "stroke-width": big ? 2.5 : 1 }, svg);
  }
  for (let n = 1; n <= 12; n++) {
    const a = n * 30 * Math.PI / 180;
    const t = el("text", { x: 100 + 68 * Math.sin(a), y: 100 - 68 * Math.cos(a) + 7,
                           "text-anchor": "middle", "font-size": 20, "font-weight": "bold",
                           fill: "#2b2d42" }, svg);
    t.textContent = n;
    if (minuteNumbers) { // подпись минут снаружи не помещается — рисуем мелко внутри кольца
      const tm = el("text", { x: 100 + 52 * Math.sin(a), y: 100 - 52 * Math.cos(a) + 3.5,
                              "text-anchor": "middle", "font-size": 9, fill: "#1d6fd1",
                              stroke: face, "stroke-width": 2.5, "paint-order": "stroke" }, svg); // обводка цветом фона — читается поверх кота
      tm.textContent = n * 5;
    }
  }
  const hourAngle = ((h % 12) + m / 60) * 30;
  const minAngle = m * 6;
  hand(svg, hourAngle, 46, 8, "#e63946", "hand-h");
  hand(svg, minAngle, 76, 5, "#1d6fd1", "hand-m");
  el("circle", { cx: 100, cy: 100, r: 6, fill: "#2b2d42" }, svg);
}

// Награда в истории: за каждый ответ с первой попытки у часов появляется ещё одна случайная зверушка
// и остаётся до конца остановки — 3 верных сразу = 3 зверушки. Сначала крупные по углам, дальше маленькие между цифрами.
const SLOTS = [...CORNERS.map(([, x, y]) => [x, y, .62, true]),
  ...RING.map((_, i) => { const a = (i * 30 + 15) * Math.PI / 180; return [100 + 75 * Math.sin(a), 100 - 75 * Math.cos(a), .27, false]; })];
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

export function addAnimal() {
  const list = state.story.animals, used = list.map(a => a.slot);
  const free = [...SLOTS.keys()].filter(i => !used.includes(i));
  const corners = free.filter(i => SLOTS[i][3]);
  if (!free.length) return;
  list.push({ name: pick(Object.keys(ANIMALS)), slot: pick(corners.length ? corners : free), fresh: true });
  drawAnimals($("clock"));
}

function drawAnimals(svg) {
  svg.querySelectorAll(".collected").forEach(g => g.remove());
  const hands = svg.querySelector(".hand-h");
  for (const a of state.story.animals) {
    const [x, y, sc, corner] = SLOTS[a.slot];
    const g = el("g", { class: "collected" + (a.fresh ? " pop" : "") }); // выскакивает только новая
    a.fresh = false;
    svg.insertBefore(g, corner ? svg.firstChild : hands); // крупные — за циферблатом, маленькие — под стрелками
    drawAnimal(g, a.name, x, y, sc, corner ? "animal corner" : "animal");
  }
}

function hand(svg, deg, len, width, color, cls) {
  const a = deg * Math.PI / 180;
  el("line", { x1: 100 - 10 * Math.sin(a), y1: 100 + 10 * Math.cos(a),
               x2: 100 + len * Math.sin(a), y2: 100 - len * Math.cos(a),
               stroke: color, "stroke-width": width, "stroke-linecap": "round", class: cls }, svg);
}
