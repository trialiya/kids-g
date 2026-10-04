// Мультяшные зверушки в SVG. Каждая рисуется в группу с центром в (0,0), размер примерно 40×40.
import { el } from "./dom.js";

const INK = "#2b2d42";
const line = { stroke: INK, "stroke-width": 1.6, "stroke-linejoin": "round", "stroke-linecap": "round" };

function eyes(g, y, dx = 6) {
  for (const x of [-dx, dx]) {
    el("circle", { cx: x, cy: y, r: 3, fill: INK }, g);
    el("circle", { cx: x + 1, cy: y - 1, r: 1.1, fill: "#fff" }, g);
  }
}
function cheeks(g, y, dx = 10) {
  for (const x of [-dx, dx]) el("ellipse", { cx: x, cy: y, rx: 2.8, ry: 1.8, fill: "#ff8fa3", opacity: .7 }, g);
}
function smile(g, y) {
  el("path", { d: `M-4 ${y} q2 3 4 0 q2 3 4 0`, fill: "none", ...line, "stroke-width": 1.3 }, g);
}

function cat(g) {
  const fur = "#ffb547";
  el("path", { d: "M-15 -4 L-14 -20 L-4 -12 Z", fill: fur, ...line }, g);
  el("path", { d: "M15 -4 L14 -20 L4 -12 Z", fill: fur, ...line }, g);
  el("path", { d: "M-12.5 -7 L-12 -16 L-7 -12 Z", fill: "#ff8fa3" }, g);
  el("path", { d: "M12.5 -7 L12 -16 L7 -12 Z", fill: "#ff8fa3" }, g);
  el("ellipse", { cx: 0, cy: 2, rx: 17, ry: 15, fill: fur, ...line }, g);
  el("path", { d: "M-3 -12 l1 5 M0 -13 v5 M3 -12 l-1 5", fill: "none", stroke: "#e08a1e", "stroke-width": 1.4, "stroke-linecap": "round" }, g);
  eyes(g, 0);
  cheeks(g, 6, 11);
  el("path", { d: "M-2 4 h4 l-2 2.2 Z", fill: "#ff6b81", ...line, "stroke-width": 1 }, g);
  smile(g, 7);
  el("path", { d: "M-9 5 l-10 -2 M-9 7.5 l-10 1.5 M9 5 l10 -2 M9 7.5 l10 1.5", stroke: INK, "stroke-width": .9, "stroke-linecap": "round" }, g);
}

function bunny(g, fur = "#fff", inner = "#ffc2d1", flop = false) {
  el("ellipse", { cx: -6, cy: -17, rx: 4.5, ry: 11, fill: fur, ...line, transform: "rotate(-12 -6 -8)" }, g);
  el("ellipse", { cx: -6, cy: -17, rx: 2, ry: 7.5, fill: inner, transform: "rotate(-12 -6 -8)" }, g);
  const rt = flop ? "rotate(70 6 -8)" : "rotate(12 6 -8)";
  el("ellipse", { cx: 6, cy: -17, rx: 4.5, ry: 11, fill: fur, ...line, transform: rt }, g);
  el("ellipse", { cx: 6, cy: -17, rx: 2, ry: 7.5, fill: inner, transform: rt }, g);
  el("ellipse", { cx: 0, cy: 4, rx: 14, ry: 13, fill: fur, ...line }, g);
  eyes(g, 2, 5.5);
  cheeks(g, 8, 9);
  el("ellipse", { cx: 0, cy: 7, rx: 2, ry: 1.5, fill: "#ff6b81" }, g);
  el("path", { d: "M0 8.5 v2.5 M-3 11 q1.5 2 3 0 q1.5 2 3 0", fill: "none", ...line, "stroke-width": 1.1 }, g);
  el("rect", { x: -1.6, y: 12.6, width: 3.2, height: 2.6, rx: .6, fill: "#fff", ...line, "stroke-width": .8 }, g);
}

function rabbit(g) { bunny(g, "#c9a27e", "#f2d0b5", true); } // коричневый кролик с висячим ухом

function dog(g) {
  const fur = "#f3d9b1";
  el("ellipse", { cx: 0, cy: 2, rx: 15, ry: 15, fill: fur, ...line }, g);
  el("ellipse", { cx: 6, cy: -3, rx: 6, ry: 5, fill: "#d9a066", opacity: .8 }, g); // пятнышко
  el("path", { d: "M-13 -10 q-9 2 -7 16 q5 1 7 -6 Z", fill: "#a0673b", ...line }, g);
  el("path", { d: "M13 -10 q9 2 7 16 q-5 1 -7 -6 Z", fill: "#a0673b", ...line }, g);
  eyes(g, -1, 5.5);
  cheeks(g, 7, 10);
  el("ellipse", { cx: 0, cy: 8, rx: 7, ry: 5, fill: "#fff6e6", ...line, "stroke-width": 1.1 }, g);
  el("ellipse", { cx: 0, cy: 5.5, rx: 3, ry: 2.2, fill: INK }, g);
  el("path", { d: "M0 7.5 v2 M-3 9.5 q1.5 2 3 0 q1.5 2 3 0", fill: "none", ...line, "stroke-width": 1.1 }, g);
  el("path", { d: "M-1.6 11.4 q1.6 4 3.2 0 Z", fill: "#ff6b81", ...line, "stroke-width": .8 }, g); // язычок
}

function butterfly(g) {
  const w1 = "#b388ff", w2 = "#ffd166";
  el("path", { d: "M0 -2 C-8 -20 -22 -18 -18 -6 C-16 0 -8 0 0 -2 Z", fill: w1, ...line }, g);
  el("path", { d: "M0 -2 C8 -20 22 -18 18 -6 C16 0 8 0 0 -2 Z", fill: w1, ...line }, g);
  el("path", { d: "M0 0 C-6 2 -18 6 -12 15 C-8 18 -2 10 0 0 Z", fill: w2, ...line }, g);
  el("path", { d: "M0 0 C6 2 18 6 12 15 C8 18 2 10 0 0 Z", fill: w2, ...line }, g);
  for (const x of [-11, 11]) {
    el("circle", { cx: x, cy: -9, r: 2.6, fill: "#fff", opacity: .85 }, g);
    el("circle", { cx: x * .7, cy: 8, r: 1.8, fill: "#ff8fa3" }, g);
  }
  el("ellipse", { cx: 0, cy: 0, rx: 2.4, ry: 11, fill: INK }, g);
  el("path", { d: "M-1 -10 q-3 -6 -6 -7 M1 -10 q3 -6 6 -7", fill: "none", ...line, "stroke-width": 1.1 }, g);
  el("circle", { cx: -7, cy: -17, r: 1.4, fill: INK }, g);
  el("circle", { cx: 7, cy: -17, r: 1.4, fill: INK }, g);
}

export const ANIMALS = { cat, bunny, rabbit, dog, butterfly };

export function drawAnimal(parent, name, x, y, scale, cls = "animal") {
  const g = el("g", { transform: `translate(${x} ${y}) scale(${scale})`, class: cls, "aria-hidden": "true" }, parent);
  // внутренняя группа — чтобы CSS-анимация не затирала transform с позицией
  const inner = el("g", { class: "animal-body" }, g);
  ANIMALS[name](inner);
  return g;
}
