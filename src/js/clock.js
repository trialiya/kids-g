// Рисование стрелочных часов в SVG
import { $, el } from "./dom.js";
import { state } from "./state.js";

export function drawClock(h, m) {
  drawClockInto($("clock"), h, m, state.level.numbers && state.training); // в основном режиме цифры минут — это подсказка, их нет
}

export function drawClockInto(svg, h, m, minuteNumbers) {
  svg.innerHTML = "";
  el("circle", { cx: 100, cy: 100, r: 96, fill: "#fffdf5", stroke: "#2b2d42", "stroke-width": 5 }, svg);
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
                              "text-anchor": "middle", "font-size": 9, fill: "#1d6fd1" }, svg);
      tm.textContent = n * 5;
    }
  }
  const hourAngle = ((h % 12) + m / 60) * 30;
  const minAngle = m * 6;
  hand(svg, hourAngle, 46, 8, "#e63946");
  hand(svg, minAngle, 76, 5, "#1d6fd1");
  el("circle", { cx: 100, cy: 100, r: 6, fill: "#2b2d42" }, svg);
}

function hand(svg, deg, len, width, color) {
  const a = deg * Math.PI / 180;
  el("line", { x1: 100 - 10 * Math.sin(a), y1: 100 + 10 * Math.cos(a),
               x2: 100 + len * Math.sin(a), y2: 100 - len * Math.cos(a),
               stroke: color, "stroke-width": width, "stroke-linecap": "round" }, svg);
}
