// Слова для времени и объяснения «что пошло не так»
import { state } from "./state.js";
import { t } from "./i18n/index.js";
import { nextHour, prevHour } from "./dom.js";

export const hoursWord = h => t("hoursWord", h);
export const minWord = m => t("minWord", m);
export const timeText = (h, m) => t("timeText", h, m);
export const timeWords = (h, m) => t("timeWords", h, m);

/* ---------- объяснения ---------- */
export function explainCorrect(h, m) {
  const parts = [], nx = nextHour(h);
  if (m === 0) {
    parts.push(t("ecZero1"), t("ecZero2", h));
  } else {
    const near = Math.floor(m / 5), rest = m % 5;
    parts.push(rest === 0 ? t("ecExact", near, m) : t("ecPartial", near, rest, m));
    parts.push(m < 30 ? t("ecEarly", h, nx) : m === 30 ? t("ecHalf", h, nx) : t("ecLate", h, nx));
  }
  return parts;
}

export function explainMistake(h, m, gh, gm) {
  const out = [];
  const hourOk = gh === h, minOk = gm === m;

  // стрелки перепутаны
  if (!hourOk && !minOk && state.level.step !== 0 && gh === (m / 5 | 0 || 12) && gm === (h % 12) * 5) {
    out.push(t("emSwap"));
  } else {
    if (!hourOk) {
      if (m >= 30 && gh === nextHour(h)) out.push(t("emHourLate", gh, h));
      else if (m < 30 && m !== 0 && gh === prevHour(h)) out.push(t("emHourEarly", gh, h, nextHour(h)));
      else if (m === 0 && gh !== h) out.push(t("emHourZero", h, gh));
      else out.push(t("emHourGen", h, gh));
    }
    if (!minOk && state.level.step !== 0) {
      const asNumber = Math.floor(m / 5);
      if (m % 5 === 0 && gm === asNumber) out.push(t("emMinNum", asNumber, m));
      else if (gm % 5 === 0 && m % 5 === 0 && Math.abs(gm - m) === 5) out.push(t("emMinOne", m / 5 || 12, m, gm));
      else if (gm === (m + 30) % 60) out.push(t("emMinOpp", m, gm));
      else if (state.level.step === 1 && Math.abs(gm - m) <= 3) out.push(t("emMinClose", Math.abs(gm - m)));
      else out.push(t("emMinGen", m, gm));
    }
  }
  return out;
}

export function explainClockMistake(h, m, gh, gm) {
  const out = [];
  if (gh === ((m / 5 | 0) || 12) && gm === (h % 12) * 5 && m % 5 === 0 && (gh !== h || gm !== m)) {
    out.push(t("ecmSwap"));
    return out;
  }
  if (gh !== h) out.push(t("ecmHour", gh, h));
  if (gm !== m) {
    const want = m % 5 === 0 ? t("ecmWantExact", m / 5 || 12, m) : t("ecmWantAfter", Math.floor(m / 5) || 12);
    out.push(t("ecmMin", gm, m, want));
  }
  return out;
}
