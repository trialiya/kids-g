// Анимации радости: конфетти, «подпрыгивание» часов, вибрация
import { $ } from "./dom.js";
import { state } from "./state.js";
import { sfx } from "./audio.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
export function confetti(count) {
  if (reduceMotion) return;
  const layer = document.createElement("div");
  layer.className = "confetti-layer";
  const sym = ["⭐", "🎉", "✨", "🌟", "🎈", "💛"];
  for (let i = 0; i < count; i++) {
    const sp = document.createElement("span");
    sp.textContent = sym[Math.floor(Math.random() * sym.length)];
    const a = Math.random() * Math.PI * 2, r = 80 + Math.random() * 150;
    sp.style.setProperty("--dx", Math.round(Math.cos(a) * r) + "px");
    sp.style.setProperty("--dy", Math.round(Math.sin(a) * r - 60) + "px");
    sp.style.setProperty("--rot", Math.round(Math.random() * 720 - 360) + "deg");
    sp.style.setProperty("--t", (1 + Math.random() * 0.6).toFixed(2) + "s");
    layer.appendChild(sp);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 2000);
}
function retrigger(el, cls) { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); }
export function celebrate(big) {
  sfx.ok();
  retrigger(state.mode === "clocks" ? $("timeCard") : $("clock"), "cheer");
  if (big) { retrigger($("score"), "pop"); confetti(22); } else confetti(8);
  if (navigator.vibrate) try { navigator.vibrate(big ? [30, 40, 30] : 20); } catch (e) {}
}
