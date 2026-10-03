// Звуки (Web Audio, без файлов) и кнопка включения/выключения
import { $ } from "./dom.js";
import { state } from "./state.js";
import { t } from "./i18n/index.js";

let audioCtx = null;
function ac() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
function tone(freq, start, dur, type, vol) {
  const c = ac(); if (!c) return;
  const t0 = c.currentTime + start;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || "sine"; o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
export const sfx = {
  ok()   { if (state.soundOn) [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.28, "triangle", 0.22)); },
  bad()  { if (state.soundOn) { tone(220, 0, 0.18, "sine", 0.2); tone(165, 0.14, 0.28, "sine", 0.2); } },
  win()  { if (state.soundOn) [523.25, 659.25, 783.99, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.12, 0.35, "triangle", 0.22)); },
};

export function syncSound() {
  $("sfxGame").textContent = state.soundOn ? "🔔" : "🔕";
  $("sfxMenu").textContent = t(state.soundOn ? "soundOn" : "soundOff");
  $("sfxGame").setAttribute("aria-label", t(state.soundOn ? "soundOffAria" : "soundOnAria"));
}
function toggleSound() {
  state.soundOn = !state.soundOn;
  try { localStorage.setItem("sound", state.soundOn ? "on" : "off"); } catch (e) {}
  syncSound();
  if (state.soundOn) sfx.ok();
}

export function initSound() {
  $("sfxGame").onclick = $("sfxMenu").onclick = toggleSound;
  syncSound();
}
