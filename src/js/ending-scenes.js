// Картинки мини-концовок глав (комикс): герои из art.js на общем фоне. Возвращают строку <svg>.
// bom — «БОМ!» на языке игры (story-texts.js)
import { cat, nyu, bunny, dog, butterfly, rabbit, moon, cup, townClock } from "./art.js";

const INK = "#3A2E39";
// вставить готовую картинку героя (её <svg>) в точку x, y сцены
const at = (art, x, y) => art.replace("<svg ", `<svg x="${x}" y="${y}" `);
const scene = (bg, body) => `<svg viewBox="0 0 320 190" role="img" aria-hidden="true" class="scene-pic">
  <rect width="320" height="190" rx="18" fill="${bg}"/>${body}
  <rect x="1.5" y="1.5" width="317" height="187" rx="17" fill="none" stroke="${INK}" stroke-width="3"/></svg>`;
const stars = pts => pts.map(([x, y]) => `<path d="M${x} ${y - 6} l1.8 4.2 l4.2 1.8 l-4.2 1.8 l-1.8 4.2 l-1.8 -4.2 l-4.2 -1.8 l4.2 -1.8 Z" fill="#FFE08A"/>`).join("");

export const ENDING_SCENES = {
  // «Конец дня»: ночь, луна, Барсик и Ню засыпают на подушке, Зайка машет
  day: () => scene("#2F3570", `${stars([[30, 30], [80, 18], [140, 40], [200, 22], [300, 60], [20, 90]])}
    ${at(moon(64), 238, 12)}
    <path d="M0 150 Q160 120 320 150 V190 H0 Z" fill="#3E4A86"/>
    <rect x="70" y="128" width="180" height="40" rx="16" fill="#FFD6E6" stroke="${INK}" stroke-width="3"/>
    ${at(cat(92, "happy"), 82, 52)}${at(nyu(80, "happy"), 168, 64)}${at(bunny(58), 254, 104)}
    <text x="58" y="70" font-size="20" font-weight="bold" fill="#fff">z</text><text x="44" y="52" font-size="26" font-weight="bold" fill="#fff">Z</text>`),
  // «Все в гостях»: стол с чашками и пирогом, все друзья вокруг
  tea: () => scene("#FFF1DE", `<path d="M10 20 Q80 40 160 20 Q240 40 310 20" fill="none" stroke="${INK}" stroke-width="2"/>
    ${[30, 70, 110, 150, 190, 230, 270].map((x, i) => `<path d="M${x} ${26 + (i % 2) * 4} l8 14 l8 -14 Z" fill="${["#FF8FB1", "#FFD23F", "#7FC8F8", "#9BE38B"][i % 4]}" stroke="${INK}" stroke-width="1.5"/>`).join("")}
    ${at(bunny(62), 6, 70)}${at(dog(62), 252, 70)}${at(butterfly(46), 136, 40)}
    ${at(cat(76), 70, 66)}${at(nyu(70), 176, 70)}${at(rabbit(54), 128, 90)}
    <ellipse cx="160" cy="160" rx="140" ry="22" fill="#C98B5B" stroke="${INK}" stroke-width="3"/>
    ${at(cup(34), 70, 132)}${at(cup(34, "#7FC8F8"), 216, 132)}
    <path d="M140 150 h40 l-4 -16 h-32 Z" fill="#F7C948" stroke="${INK}" stroke-width="2.5"/><path d="M144 134 q16 -10 32 0" fill="#FF8FB1" stroke="${INK}" stroke-width="2.5"/>`),
  // «Часы пошли!»: большие часы на башне звонят «Бом!», друзья радуются внизу
  shop: bom => scene("#BDE3FF", `<circle cx="40" cy="36" r="18" fill="#FFD23F" stroke="${INK}" stroke-width="2.5"/>
    ${at(townClock(150), 85, 0)}
    <g font-weight="bold" fill="#E63946" stroke="#fff" stroke-width="4" paint-order="stroke" font-size="22">
      <text x="30" y="96" transform="rotate(-12 30 96)">${bom}</text><text x="222" y="70" transform="rotate(10 222 70)">${bom}</text></g>
    <path d="M0 160 H320 V190 H0 Z" fill="#9BD67F"/>
    ${at(dog(52), 10, 128)}${at(cat(62, "happy"), 56, 122)}${at(nyu(58, "happy"), 206, 124)}${at(bunny(52), 262, 128)}${at(butterfly(36), 268, 70)}`),
};
