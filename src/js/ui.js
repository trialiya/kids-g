// Переключение экранов
import { $ } from "./dom.js";
import { stopSpeak } from "./speech.js";

export function show(id) {
  document.body.classList.toggle("playing", id === "game");
  ["menu", "game", "end"].forEach(s => $(s).classList.toggle("hidden", s !== id));
}
export function showMenu() { stopSpeak(); show("menu"); }
