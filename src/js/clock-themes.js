// Оформление часов в истории: у каждой остановки свои часы (кухонные, будильник, с ушками Зайки, с шестерёнками…).
// Циферблат, цифры и стрелки те же — меняются цвет обода, фон и украшения вокруг, чтобы часы читались одинаково легко.
import { el } from "./dom.js";

const INK = "#2b2d42";
const ring = (n, r, f) => Array.from({ length: n }, (_, i) => { const a = i * 2 * Math.PI / n; return f(100 + r * Math.sin(a), 100 - r * Math.cos(a), a); });
const path = (svg, d, fill, sw = 3) => el("path", { d, fill, stroke: INK, "stroke-width": sw, "stroke-linejoin": "round" }, svg);
const circle = (svg, cx, cy, r, fill, sw = 2.5) => el("circle", { cx, cy, r, fill, stroke: INK, "stroke-width": sw }, svg);

// Украшения рисуются ДО циферблата (back) — выступают из-под обода — или ПОСЛЕ обода (front)
const ears = (svg, fill, inner) => { // ушки Зайки или Кролика сверху
  [-1, 1].forEach(s => {
    path(svg, `M${100 + s * 18} 6 C${100 + s * 12} -26 ${100 + s * 50} -26 ${100 + s * 42} 10 Z`, fill);
    path(svg, `M${100 + s * 23} 2 C${100 + s * 20} -16 ${100 + s * 42} -16 ${100 + s * 37} 4 Z`, inner, 0);
  });
};
const bells = svg => { // будильник: два колокольчика с молоточком и ножки
  [-1, 1].forEach(s => {
    const cx = 100 + s * 60, cy = 10;
    path(svg, `M${100 + s * 74} 186 l${s * 14} 24`, "none", 7);
    const g = el("g", { transform: `rotate(${s * 35} ${cx} ${cy})` }, svg);
    path(g, `M${cx - 24} ${cy + 12} A24 24 0 0 1 ${cx + 24} ${cy + 12} Z`, "#F2B33D");
  });
  path(svg, "M100 4 V-12 M86 -12 H114", "none", 5);
};

export const CLOCK_THEMES = {
  // Глава 1 «День Барсика»
  breakfast: { face: "#FFF6E0", rim: "#F27D52", back: svg => ring(12, 106, (x, y) => circle(svg, x, y, 8, "#FFC6A8", 2)) },
  walk: { face: "#EEF8FF", rim: "#5DAE4B", back: svg => ring(16, 100, (x, y, a) => // лучики солнышка
    path(svg, `M${x + 7 * Math.cos(a)} ${y + 7 * Math.sin(a)} L${x + 16 * Math.sin(a)} ${y - 16 * Math.cos(a)} L${x - 7 * Math.cos(a)} ${y - 7 * Math.sin(a)} Z`, "#FFD23F", 2)) },
  play: { face: "#FFFDF5", rim: "#E63946", back: bells },
  night: { face: "#EEEAFF", rim: "#4B4F8C", back: svg => {
    ring(10, 110, (x, y) => path(svg, `M${x} ${y - 9} l2.5 6.5 l6.5 2.5 l-6.5 2.5 l-2.5 6.5 l-2.5 -6.5 l-6.5 -2.5 l6.5 -2.5 Z`, "#FFD23F", 1.5));
    path(svg, "M168 4 a17 17 0 1 0 18 24 a13 13 0 1 1 -18 -24 Z", "#FFE08A", 2.5);
  } },
  // Глава 2 «Чай у Барсика»
  teaBunny: { face: "#FFF3F7", rim: "#E8628D", back: svg => ears(svg, "#fff", "#F4B8C1") },
  teaDog: { face: "#FFF8EE", rim: "#A0673C", back: svg => [-1, 1].forEach(s =>
    path(svg, `M${100 + s * 70} 20 C${100 + s * 118} 30 ${100 + s * 120} 90 ${100 + s * 100} 110 C${100 + s * 92} 80 ${100 + s * 84} 50 ${100 + s * 70} 20 Z`, "#C98B5B")) },
  teaButterfly: { face: "#FBF5FF", rim: "#9B6DD6", back: svg => ring(18, 104, (x, y) => circle(svg, x, y, 10, "#E5D4FF", 2)) },
  teaRabbit: { face: "#FFF9F0", rim: "#B98A5E", back: svg => ears(svg, "#D9B38C", "#F4C9B8") },
  // Глава 3 «Мастерская»
  fixBunny: { face: "#FFFBEF", rim: "#D9951F", back: svg => ring(24, 104, (x, y, a) => // зубчики шестерёнки
    el("rect", { x: x - 6, y: y - 6, width: 12, height: 12, rx: 2, fill: "#F2B33D", stroke: INK, "stroke-width": 2,
                 transform: `rotate(${a * 180 / Math.PI} ${x} ${y})` }, svg)) },
  fixDog: { face: "#FFFDF5", rim: "#3B8EA5", back: bells },
  fixButterfly: { face: "#F6FFF4", rim: "#7BB661", rimW: 7, back: svg => ring(12, 108, (x, y) => circle(svg, x, y, 7, "#FF8FB1", 2)) },
  fixTown: { face: "#FFFDF5", rim: "#8D8A86", rimW: 8, back: svg => {
    path(svg, "M100 -20 L186 30 H14 Z", "#C0504D"); // крыша башни
    ring(24, 108, (x, y) => circle(svg, x, y, 4, "#C8C3BC", 1.5));
  } },
  // Глава 4 «Ошибки Ню»: розовые часы с бантиками
  nyuMorning: { face: "#FFF7FA", rim: "#FF8FB8", back: svg => ring(12, 106, (x, y) => circle(svg, x, y, 7, "#FFD6E6", 2)) },
  nyuGarden: { face: "#F7FFF7", rim: "#F48FB1", back: svg => ring(18, 104, (x, y) => circle(svg, x, y, 10, "#C8EFC4", 2)) },
  nyuParty: { face: "#FFFDF5", rim: "#C77DFF", back: svg => ring(16, 106, (x, y, a) =>
    circle(svg, x, y, 7, ["#FF8FB8", "#FFD23F", "#7FC8F8", "#9BE38B"][Math.round(a * 16 / (2 * Math.PI)) % 4], 2)) },
  nyuTrain: { face: "#FFFDF5", rim: "#E8628D", rimW: 8, back: svg => {
    path(svg, "M58 -18 h84 l-10 26 h-64 Z", "#FF8FB8"); // табло вокзала
    ring(24, 108, (x, y) => circle(svg, x, y, 4, "#F8C6D8", 1.5));
  } },
};
