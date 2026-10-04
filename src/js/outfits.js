// Наряды Барсика: открываются за звёзды в истории, выбранный Барсик носит везде (art.js → cat()).
// Рисунки — слой поверх мордочки в координатах 120×120, как у cat().
const INK = "#3A2E39";

// stars — сколько звёзд всего нужно в истории (максимум 15 остановок × 3 = 45; корона — за все)
export const OUTFITS = [
  { id: "bow", stars: 3 },
  { id: "scarf", stars: 8 },
  { id: "glasses", stars: 14 },
  { id: "beanie", stars: 20 },
  { id: "wreath", stars: 28 },
  { id: "crown", stars: 45 },
];

const flower = (x, y, c) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a =>
  `<circle cx="${(4.2 * Math.sin(a * Math.PI / 180)).toFixed(1)}" cy="${(-4.2 * Math.cos(a * Math.PI / 180)).toFixed(1)}" r="3.6" fill="${c}" stroke="${INK}" stroke-width="1.3"/>`).join("")}
  <circle r="2.6" fill="#FFD23F" stroke="${INK}" stroke-width="1.2"/></g>`;

const ART = {
  bow: `<g transform="translate(34 33) rotate(-20)">
    <path d="M0 0 L-15 -10 L-15 10 Z M0 0 L15 -10 L15 10 Z" fill="#FF6FA5" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle r="5" fill="#FF8FB8" stroke="${INK}" stroke-width="2.5"/></g>`,
  scarf: `<path d="M24 96 Q60 116 96 96 L99 106 Q60 126 21 106 Z" fill="#E63946" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M40 106 l2 8 M52 109 l1 8 M66 109 l-1 8 M80 106 l-2 8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M78 107 l4 11 l11 -2 l-5 -12 Z" fill="#E63946" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
  glasses: `<g fill="#BDE3FF" fill-opacity=".35" stroke="${INK}" stroke-width="3.2"><circle cx="41" cy="62" r="13.5"/><circle cx="79" cy="62" r="13.5"/></g>
    <path d="M54.5 60 q5.5 -4 11 0 M27.5 60 l-10 -4 M92.5 60 l10 -4" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  beanie: `<path d="M30 42 Q60 4 90 42 Z" fill="#4D96FF" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <rect x="27" y="38" width="66" height="10" rx="5" fill="#FFD23F" stroke="${INK}" stroke-width="3"/>
    <circle cx="60" cy="12" r="7" fill="#fff" stroke="${INK}" stroke-width="3"/>`,
  wreath: flower(30, 40, "#FF8FB1") + flower(43, 31, "#B79CFF") + flower(60, 27, "#FF8FB1") + flower(77, 31, "#7FC8F8") + flower(90, 40, "#B79CFF"),
  crown: `<path d="M36 36 L38 8 L49 22 L60 4 L71 22 L82 8 L84 36 Z" fill="#FFD23F" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="60" cy="27" r="4" fill="#E63946" stroke="${INK}" stroke-width="1.8"/>
    <circle cx="45" cy="29" r="3" fill="#4D96FF" stroke="${INK}" stroke-width="1.6"/><circle cx="75" cy="29" r="3" fill="#4D96FF" stroke="${INK}" stroke-width="1.6"/>`,
};
export const outfitSvg = id => ART[id] || "";

let current = "";
try { current = localStorage.getItem("outfit") || ""; } catch (e) { /* хранилище недоступно */ }
export const getOutfit = () => current;
export function setOutfit(id) {
  current = id;
  try { localStorage.setItem("outfit", id); } catch (e) {}
  document.dispatchEvent(new Event("outfitchange"));
}
// открыт ли наряд при таком числе звёзд
export const outfitOpen = (o, stars) => stars >= o.stars;
