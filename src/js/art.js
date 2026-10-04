// Рисунки для сюжетного режима: Барсик (по фото нашего кота), его друзья и мелкие иконки.
// Все функции возвращают строку <svg>…</svg>, размер задаётся первым аргументом.
import { getOutfit, outfitSvg } from "./outfits.js";
const INK = "#3A2E39";
const svg = (size, vb, body, label) =>
  `<svg width="${size}" height="${size}" viewBox="${vb}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${body}</svg>`;

// Кошачья мордочка в мультяшном стиле: Барсик и Ню отличаются окрасом (pal) и деталями.
// mood: "" | "happy" | "sad"; outfit — наряд (outfits.js)
function kitty(size, mood, label, outfit, pal) {
  const eyes = mood === "happy"
    ? `<path d="M32 64 q9 -11 18 0 M70 64 q9 -11 18 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`
    : `<circle cx="41" cy="62" r="9.5" fill="${pal.eye}" stroke="${INK}" stroke-width="2.5"/>
       <ellipse cx="42" cy="${mood === "sad" ? 65 : 63}" rx="4.5" ry="${mood === "sad" ? 5.5 : 6.5}" fill="#2B2230"/>
       <circle cx="45" cy="59" r="2.3" fill="#fff"/>
       <circle cx="79" cy="62" r="9.5" fill="${pal.eye}" stroke="${INK}" stroke-width="2.5"/>
       <ellipse cx="80" cy="${mood === "sad" ? 65 : 63}" rx="4.5" ry="${mood === "sad" ? 5.5 : 6.5}" fill="#2B2230"/>
       <circle cx="83" cy="59" r="2.3" fill="#fff"/>`;
  const mouth = mood === "happy"
    ? `<path d="M50 82 q10 14 20 0 Z" fill="#E86A7E" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`
    : mood === "sad"
      ? `<path d="M51 90 q9 -8 18 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
         <path d="M30 50 l13 5 M90 50 l-13 5" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
         <path d="M33 74 q-4 8 0 10 q4 -2 0 -10 Z" fill="#7FC8F8" stroke="${INK}" stroke-width="1.5"/>`
      : `<path d="M60 79.5 v4 M52.5 85 q3.75 4.5 7.5 0 q3.75 4.5 7.5 0" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`;
  const ears = mood === "sad"
    ? `<path d="M22 56 L10 22 L48 36 Z" fill="${pal.ears}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
       <path d="M98 56 L110 22 L72 36 Z" fill="${pal.ears}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`
    : `<path d="M24 52 L18 8 L54 32 Z" fill="${pal.ears}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
       <path d="M28 44 L25 19 L46 33 Z" fill="#F4B8C1"/>
       <path d="M96 52 L102 8 L66 32 Z" fill="${pal.ears}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
       <path d="M92 44 L95 19 L74 33 Z" fill="#F4B8C1"/>`;
  return svg(size, "0 0 120 120", `${ears}
    <ellipse cx="60" cy="68" rx="46" ry="40" fill="${pal.fur}" stroke="${INK}" stroke-width="3.5"/>
    ${pal.mask || ""}
    <path d="M50 32 q3 9 1 17 M60 29 v19 M70 32 q-3 9 -1 17" fill="none" stroke="${pal.stripes}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M56 48 L64 48 L67 64 C76 64 84 72 82 84 C80 96 40 96 38 84 C36 72 44 64 53 64 Z" fill="${pal.muzzle}"/>
    ${eyes}
    ${pal.nose}
    ${mouth}
    <ellipse cx="31" cy="79" rx="6" ry="4" fill="#F49AAB" opacity=".75"/>
    <ellipse cx="89" cy="79" rx="6" ry="4" fill="#F49AAB" opacity=".75"/>
    <path d="M30 82 l-22 -5 M30 88 l-22 2 M90 82 l22 -5 M90 88 l22 2" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    ${pal.extra || ""}${outfitSvg(outfit)}`, label);
}

// Барсик: серый полосатый, белая мордочка, янтарные глаза (по фото нашего кота)
const BARSIK = { fur: "#A3A3AF", ears: "#A3A3AF", stripes: "#6F6F7D", muzzle: "#fff", eye: "#E8A93A",
  nose: `<path d="M54.5 73 h11 l-5.5 6.5 Z" fill="#B97A7F" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` };
export const cat = (size = 96, mood = "", label = "", outfit = getOutfit()) => kitty(size, mood, label, outfit, BARSIK);

// Ню: тайская кошка — кремовая шубка, тёмно-шоколадные ушки и маска, голубые глаза, розовый бантик
const NYU = { fur: "#F5ECDF", ears: "#5E4637", stripes: "none", muzzle: "#A2826C", eye: "#6FB6E8",
  mask: `<path d="M60 42 C78 46 92 60 90 78 C88 96 32 96 30 78 C28 60 42 46 60 42 Z" fill="#8C6A55"/>`,
  nose: `<path d="M54.5 73 h11 l-5.5 6.5 Z" fill="#3E2E26" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`,
  extra: `<g transform="translate(88 30) rotate(20)">
    <path d="M0 0 L-13 -9 L-13 9 Z M0 0 L13 -9 L13 9 Z" fill="#FF8FB8" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle r="4.5" fill="#FFB3CF" stroke="${INK}" stroke-width="2.5"/></g>` };
export const nyu = (size = 96, mood = "", label = "") => kitty(size, mood, label, "", NYU);

export const bunny = (size = 56, label = "") => svg(size, "0 0 60 60", `
  <ellipse cx="22" cy="17" rx="6" ry="14" fill="#fff" stroke="${INK}" stroke-width="2.2"/><ellipse cx="22" cy="17" rx="2.5" ry="9" fill="#F4B8C1"/>
  <ellipse cx="38" cy="17" rx="6" ry="14" fill="#fff" stroke="${INK}" stroke-width="2.2"/><ellipse cx="38" cy="17" rx="2.5" ry="9" fill="#F4B8C1"/>
  <circle cx="30" cy="40" r="16" fill="#fff" stroke="${INK}" stroke-width="2.2"/>
  <circle cx="24" cy="38" r="2.4" fill="${INK}"/><circle cx="36" cy="38" r="2.4" fill="${INK}"/>
  <ellipse cx="30" cy="44" rx="2.6" ry="2" fill="#F49AAB"/>
  <ellipse cx="20" cy="45" rx="3" ry="2" fill="#F49AAB" opacity=".7"/><ellipse cx="40" cy="45" rx="3" ry="2" fill="#F49AAB" opacity=".7"/>`, label);

export const rabbit = (size = 56, label = "") => svg(size, "0 0 60 60", `
  <ellipse cx="20" cy="20" rx="6" ry="14" fill="#C9A27E" stroke="${INK}" stroke-width="2.2" transform="rotate(-18 20 30)"/>
  <ellipse cx="20" cy="20" rx="2.5" ry="9" fill="#F2D0B5" transform="rotate(-18 20 30)"/>
  <ellipse cx="40" cy="22" rx="6" ry="14" fill="#C9A27E" stroke="${INK}" stroke-width="2.2" transform="rotate(60 40 30)"/>
  <circle cx="30" cy="40" r="16" fill="#C9A27E" stroke="${INK}" stroke-width="2.2"/>
  <circle cx="24" cy="38" r="2.4" fill="${INK}"/><circle cx="36" cy="38" r="2.4" fill="${INK}"/>
  <ellipse cx="30" cy="44" rx="2.6" ry="2" fill="#F49AAB"/>
  <ellipse cx="20" cy="45" rx="3" ry="2" fill="#F49AAB" opacity=".7"/><ellipse cx="40" cy="45" rx="3" ry="2" fill="#F49AAB" opacity=".7"/>`, label);

export const dog = (size = 56, label = "") => svg(size, "0 0 60 60", `
  <path d="M14 20 q-10 4 -6 22 q8 0 8 -10 Z" fill="#A0673B" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M46 20 q10 4 6 22 q-8 0 -8 -10 Z" fill="#A0673B" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
  <circle cx="30" cy="32" r="17" fill="#F3D9B1" stroke="${INK}" stroke-width="2.2"/>
  <ellipse cx="37" cy="26" rx="6" ry="5" fill="#D9A066"/>
  <circle cx="24" cy="29" r="2.4" fill="${INK}"/><circle cx="36" cy="29" r="2.4" fill="${INK}"/>
  <ellipse cx="30" cy="40" rx="9" ry="6" fill="#FFF6E6" stroke="${INK}" stroke-width="1.6"/>
  <ellipse cx="30" cy="37" rx="3.6" ry="2.6" fill="${INK}"/>
  <path d="M28 43 q2 5 4 0 Z" fill="#F27D8E"/>`, label);

export const butterfly = (size = 56, label = "") => svg(size, "0 0 60 60", `
  <path d="M30 28 C22 6 6 8 10 22 C12 30 22 30 30 28 Z M30 28 C38 6 54 8 50 22 C48 30 38 30 30 28 Z" fill="#B9A3F5" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M30 30 C22 32 10 38 16 48 C20 52 28 42 30 30 Z M30 30 C38 32 50 38 44 48 C40 52 32 42 30 30 Z" fill="#F2C14E" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
  <circle cx="18" cy="18" r="2.6" fill="#fff"/><circle cx="42" cy="18" r="2.6" fill="#fff"/>
  <ellipse cx="30" cy="30" rx="3" ry="13" fill="${INK}"/>
  <path d="M29 18 q-3 -7 -7 -9 M31 18 q3 -7 7 -9" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`, label);

export const bowl = (size = 44) => svg(size, "0 0 40 40", `
  <path d="M12 15 q8 -8 16 0 q-8 6 -16 0 Z M27 15 l5 -4 v8 Z" fill="#6CB4A8" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M5 20 h30 a15 12 0 0 1 -30 0 Z" fill="#F27D52" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`);

export const moon = (size = 44) => svg(size, "0 0 40 40", `
  <path d="M24 5 a15 15 0 1 0 11 24 a12 12 0 1 1 -11 -24 Z" fill="#F2C14E" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
  <circle cx="31" cy="9" r="1.8" fill="${INK}"/><circle cx="35" cy="16" r="1.2" fill="${INK}"/>`);

export const cup = (size = 44, fill = "#FF8FB1") => svg(size, "0 0 28 24", `
  <path d="M3 6 h18 v8 a7 7 0 0 1 -7 7 h-4 a7 7 0 0 1 -7 -7 Z" fill="${fill}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M21 9 h2.5 a3 3 0 0 1 0 6 H21" fill="none" stroke="${INK}" stroke-width="1.8"/>`);

export const fish = (size = 44, fill = "#F27D52") => svg(size, "0 0 28 16", `
  <path d="M2 8 C6 1 16 1 21 8 C16 15 6 15 2 8 Z M21 8 L27 3 V13 Z" fill="${fill}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
  <circle cx="8" cy="7" r="1.3" fill="${INK}"/>`);

export const gear = (size = 44, fill = "#F2B33D") => svg(size, "0 0 40 40", `
  <circle cx="20" cy="20" r="14" fill="none" stroke="${fill}" stroke-width="7" stroke-dasharray="4.4 3.6"/>
  <circle cx="20" cy="20" r="11" fill="${fill}" stroke="${INK}" stroke-width="2"/>
  <circle cx="20" cy="20" r="4" fill="#FFFDF6" stroke="${INK}" stroke-width="2"/>`);

export const townClock = (size = 56) => svg(size, "0 0 60 60", `
  <path d="M14 58 V24 L30 6 L46 24 V58 Z" fill="#C98B5B" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
  <circle cx="30" cy="32" r="11" fill="#FFFDF6" stroke="${INK}" stroke-width="2.2"/>
  <path d="M30 32 V25 M30 32 l5 3" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
  <rect x="25" y="46" width="10" height="12" rx="5" fill="#8B5E3C" stroke="${INK}" stroke-width="2"/>`);

export const lock = (size = 22) => svg(size, "0 0 24 24", `
  <g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></g>`);

// Картинка по имени — для данных сюжета
export const ART = { cat: s => cat(s), nyu: s => nyu(s), bunny, rabbit, dog, butterfly, bowl, moon, cup: s => cup(s), fish: s => fish(s), gear: s => gear(s), townClock };
