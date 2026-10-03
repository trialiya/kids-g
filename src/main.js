import "./styles/base.css";
import "./styles/menu.css";
import "./styles/game.css";
import "./styles/animations.css";
import "./styles/responsive.css";

import { initSound } from "./js/audio.js";
import { initFullscreen } from "./js/fullscreen.js";
import { initSpeech } from "./js/speech.js";
import { initGame } from "./js/game.js";
import { initMenu, applyLang } from "./js/menu.js";
import { state } from "./js/state.js";

// Для отладки и автотестов: открой страницу с ?debug, и состояние игры будет в window.__state
if (location.search.includes("debug")) window.__state = state;

initSound();
initFullscreen();
initSpeech();
initGame();
initMenu();
applyLang();

// Офлайн-режим: service worker собирается вместе с приложением (см. vite.config.js)
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => { /* без офлайн-режима тоже работает */ });
}
