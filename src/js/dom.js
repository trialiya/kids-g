// Мелкие общие помощники для работы с DOM и числами
export const $ = id => document.getElementById(id);
export const pad = n => String(n).padStart(2, "0");
export const ns = "http://www.w3.org/2000/svg";
export const fmt = (h, m) => h + ":" + pad(m);
export const nextHour = h => h % 12 + 1;
export const prevHour = h => (h + 10) % 12 + 1;

export function el(name, attrs, parent) {
  const e = document.createElementNS(ns, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

export function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
