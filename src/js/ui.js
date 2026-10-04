// Переключение экранов
import { $ } from "./dom.js";
import { stopSpeak } from "./speech.js";
import { state } from "./state.js";

export function show(id) {
  document.body.classList.toggle("playing", id === "game");
  document.body.dataset.screen = id; // кроме главной — звук, язык и экран компактно в строке сверху (cartoon.css)
  ["story", "album", "comic", "chapter", "menu", "game", "end"].forEach(s => $(s).classList.toggle("hidden", s !== id));
}
// Домашний экран: история с Барсиком или классическое меню
export function showMenu() { stopSpeak(); show(state.ui === "classic" ? "menu" : "story"); }
