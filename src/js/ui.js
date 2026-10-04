// Переключение экранов
import { $ } from "./dom.js";
import { stopSpeak } from "./speech.js";
import { state } from "./state.js";

export function show(id) {
  document.body.classList.toggle("playing", id === "game");
  ["story", "chapter", "menu", "game", "end"].forEach(s => $(s).classList.toggle("hidden", s !== id));
}
// Домашний экран: история с Муркой или классическое меню
export function showMenu() { stopSpeak(); show(state.ui === "classic" ? "menu" : "story"); }
