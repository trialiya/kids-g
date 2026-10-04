// Альбом: наклейки за пройденные остановки (5 из 5 — золотая), наклейка за всю главу и гардероб Барсика.
// Всё считается из прогресса истории (звёзды остановок), отдельно ничего не хранится — кроме выбранного наряда.
import { $ } from "./dom.js";
import { state } from "./state.js";
import { STORY_TEXTS } from "./i18n/story-texts.js";
import { show } from "./ui.js";
import { ART, cat } from "./art.js";
import { OUTFITS, getOutfit, setOutfit, outfitOpen } from "./outfits.js";

const s = () => STORY_TEXTS[state.lang];
let src = null, tab = "stickers"; // src — { chapters, stars(stopId), total(), isDone(stop) } из story.js

// Наклейка: рисунок в кружке с белой каймой; gold — золотая (5 из 5), big — наклейка главы, empty — ещё не получена
export function stickerHtml(art, { gold = false, big = false, empty = false, size = 54 } = {}) {
  return `<span class="sticker${gold ? " gold" : ""}${big ? " big" : ""}${empty ? " empty" : ""}">${ART[art](size)}${empty ? "<i>?</i>" : ""}</span>`;
}

function renderStickers() {
  const box = $("albumBody");
  let got = 0, all = 0;
  box.innerHTML = src.chapters.map(ch => {
    const done = ch.stops.every(src.isDone);
    const items = ch.stops.map(st => {
      const n = src.stars(st.id), has = src.isDone(st); all++; got += has;
      return `<figure class="slot">${stickerHtml(st.art, { gold: n === 3, empty: !has })}<figcaption>${has ? s().stops[st.id].title : "?"}</figcaption></figure>`;
    }).join("");
    all++; got += done;
    return `<section class="album-page ch-${ch.id}"><h3>${s().chapters[ch.id].title}</h3><div class="slots">${items}
      <figure class="slot wide">${stickerHtml(ch.art, { big: true, gold: done, empty: !done, size: 64 })}<figcaption>${done ? s().chapterSticker : "?"}</figcaption></figure></div></section>`;
  }).join("");
  $("albumSub").textContent = s().stickersGot(got, all);
}

function renderWardrobe() {
  const stars = src.total(), cur = getOutfit();
  const items = [{ id: "", stars: 0 }, ...OUTFITS].map(o => {
    const open = outfitOpen(o, stars), on = cur === o.id;
    return `<button class="outfit${on ? " on" : ""}${open ? "" : " locked"}" data-outfit="${o.id}" type="button" ${open ? "" : "disabled"}
      aria-pressed="${on}">${cat(70, on ? "happy" : "", "", open ? o.id : "")}
      <b>${s().outfits[o.id || "none"]}</b><small>${open ? (on ? s().wearing : s().wear) : `★ ${o.stars}`}</small></button>`;
  }).join("");
  $("albumBody").innerHTML = `<div class="wardrobe">${items}</div>`;
  $("albumSub").textContent = s().starsGot(stars);
}

function render() {
  $("albumBack").textContent = s().backChapters;
  $("albumTitle").textContent = s().album;
  $("tabStickers").textContent = s().tabStickers;
  $("tabWardrobe").textContent = s().tabWardrobe;
  $("tabStickers").classList.toggle("active", tab === "stickers");
  $("tabWardrobe").classList.toggle("active", tab === "wardrobe");
  $("tabStickers").setAttribute("aria-selected", tab === "stickers");
  $("tabWardrobe").setAttribute("aria-selected", tab === "wardrobe");
  tab === "stickers" ? renderStickers() : renderWardrobe();
}

export function openAlbum(which = "stickers") { tab = which; render(); show("album"); }

export function initAlbum(source) {
  src = source;
  $("albumBack").onclick = () => show("story");
  $("tabStickers").onclick = () => { tab = "stickers"; render(); };
  $("tabWardrobe").onclick = () => { tab = "wardrobe"; render(); };
  $("albumBody").addEventListener("click", e => {
    const b = e.target.closest("[data-outfit]");
    if (b && !b.disabled) setOutfit(b.dataset.outfit);
  });
  document.addEventListener("outfitchange", () => { if (!$("album").classList.contains("hidden")) render(); });
  document.addEventListener("langchange", () => { if (!$("album").classList.contains("hidden")) render(); });
}
