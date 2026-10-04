// English texts
import { pad } from "../dom.js";

const enMin = n => n + (n === 1 ? " minute" : " minutes");
const enPhrase = (h, m) => {
  const nx = h % 12 + 1;
  if (m === 0) return `${h} o’clock`;
  if (m === 15) return `quarter past ${h}`;
  if (m === 30) return `half past ${h}`;
  if (m === 45) return `quarter to ${nx}`;
  if (m < 30) return `${m % 5 === 0 ? m : enMin(m)} past ${h}`;
  return `${(60 - m) % 5 === 0 ? 60 - m : enMin(60 - m)} to ${nx}`;
};

const en = {
  title: "What time is it?", h1: "🕒 What time is it?", sub: "Learn to tell the time on an analog clock",
  ios: "On iPhone: tap “Share” → “Add to Home Screen” to play full screen.",
  howto: `<b>How to read the clock:</b><br>
      The <span style="color:var(--hour)"><b>short red</b></span> hand shows hours.
      The <span style="color:var(--min)"><b>long blue</b></span> hand shows minutes.
      One big mark (number) for the long hand is <b>5 minutes</b>.`,
  mLearn: "🎓 Learn", mPlay: "🏆 Play", mClocks: "🕒 Find the clock", modesAria: "Game mode",
  desc_learn: "You get all the hints. First name the hour, then the minutes, and try again until you find the right answer.",
  desc_play: "No hints and only one try. Show what you’ve learned!",
  desc_clocks: "You get a time — find the clock whose hands show it. One try.",
  start: "▶ Start", choose4: "🔘 Choose from 4", typeIt: "⌨️ Type it",
  back: "← Levels", lvShort: n => `Lv ${n}`, legH: "hours", legM: "minutes", lblH: "hours", lblM: "minutes",
  hUp: "more hours", hDn: "fewer hours", mUp: "more minutes", mDn: "fewer minutes", clockAria: "Clock",
  check: "Check ✔", next: "Next →", result: "Results 🏁", again: "Play again", toMenu: "Levels",
  soundOn: "🔔 Sound: on", soundOff: "🔕 Sound: off", soundOffAria: "Turn sound off", soundOnAria: "Turn sound on",
  fsEnter: "⛶ Full screen", fsExit: "✕ Exit full screen", fsAria: "Full screen",
  speakExpl: "Read the explanation aloud", speakHint: "Read the hint aloud", speakTipLbl: "Listen to how to read the time",
  speakTitle: "Read aloud", speakTipTitle: "Listen to the tip", stopRead: "Stop reading", readAloud: "Read aloud",
  speechLang: "en-US", speechTime: (h, mm) => mm === "00" ? h + " o’clock" : h + " " + mm, speechTimes: " times ", speechArrow: " is ",
  levels: [
    { name: "On the hour", desc: "The long hand points to 12",
      tip: "Long hand on <b>12</b> — it’s exactly on the hour. The short hand shows the hour." },
    { name: "Half past", desc: "On the hour and half past",
      tip: "Long hand on <b>12</b> — on the hour. Long hand on <b>6</b> — <b>half past</b>, 30 minutes." },
    { name: "Quarters", desc: "On the hour, 15, 30 and 45 minutes",
      tip: "Long hand on <b>3</b> — 15 minutes, on <b>6</b> — 30, on <b>9</b> — 45. The hour is the number the short hand has <b>already passed</b>." },
    { name: "Every five minutes", desc: "5, 10, 20, 25 … minutes",
      tip: "Each number for the long hand is <b>5 minutes</b>. Count by fives: 5, 10, 15…" },
    { name: "Master", desc: "Any minute, no minute labels",
      tip: "Find the number before the long hand, multiply by 5 and add the small marks." },
  ],
  hoursWord: h => h === 1 ? "hour" : "hours", minWord: m => m === 1 ? "minute" : "minutes",
  timeText: (h, m) => `${enPhrase(h, m)} (${h}:${pad(m)})`,
  timeWords: (h, m) => enPhrase(h, m),
  optAria: (i, h, m) => `Option ${i}: ${enPhrase(h, m)}`, clockOptAria: i => `Clock, option ${i}`,
  ecZero1: () => `The long <b>blue</b> hand is on <b>12</b> — exactly on the hour.`,
  ecZero2: h => `The short <b>red</b> hand points to <b>${h}</b> — ${h} o’clock.`,
  ecExact: (near, m) => `The long <b>blue</b> hand is on <b>${near}</b>: ${near} × 5 is <b>${m}</b> minutes.`,
  ecPartial: (near, rest, m) => `The long <b>blue</b> hand passed <b>${near === 0 ? 12 : near}</b> and ${rest} small mark${rest === 1 ? "" : "s"} — <b>${m}</b> ${m === 1 ? "minute" : "minutes"}.`,
  ecEarly: (h, nx) => `The short <b>red</b> hand passed <b>${h}</b> but not ${nx} yet — the hour is ${h}.`,
  ecHalf: (h, nx) => `The short <b>red</b> hand is halfway between ${h} and ${nx} — the hour is ${h}.`,
  ecLate: (h, nx) => `The short <b>red</b> hand is closer to ${nx}, but hasn’t reached it — the hour is still <b>${h}</b>.`,
  emSwap: () => `The hands are mixed up. <b>Short</b> — hours, <b>long</b> — minutes.`,
  emHourLate: (gh, h) => `<b>Hours:</b> the short hand hasn’t <b>reached</b> ${gh} yet. So the hour is ${h}.`,
  emHourEarly: (gh, h, nx) => `<b>Hours:</b> the short hand has already <b>passed</b> ${h}. So the hour is ${h}, not ${gh}.`,
  emHourZero: (h, gh) => `<b>Hours:</b> the short hand points to <b>${h}</b>, not ${gh}.`,
  emHourGen: (h, gh) => `<b>Hours:</b> look at the <b>short</b> hand — it shows <b>${h}</b>.`,
  emMinNum: (a, m) => `<b>Minutes:</b> each number is <b>5 minutes</b>. ${a} × 5 is <b>${m}</b>.`,
  emMinOne: (x, m, gm) => `<b>Minutes:</b> the long hand is on <b>${x}</b> — that’s ${x === 12 ? "<b>0</b> minutes" : `<b>${m}</b> minutes`}.`,
  emMinOpp: (m, gm) => `<b>Minutes:</b> count from <b>12</b> clockwise — you get <b>${m}</b>, not ${gm}.`,
  emMinClose: d => `<b>Minutes:</b> almost! Count the small marks again.`,
  emMinGen: (m, gm) => `<b>Minutes:</b> the long hand shows <b>${m}</b> ${m === 1 ? "minute" : "minutes"}. Each number is 5 minutes.`,
  ecmSwap: () => `The hands are mixed up: the short hand is where the long one should be.`,
  ecmHour: (gh, h) => `<b>Hours:</b> this clock’s short hand shows ${gh}, but you need <b>${h}</b>.`,
  ecmWantExact: (x, m) => `at <b>${x}</b>`,
  ecmWantAfter: x => `a little past <b>${x}</b>`,
  ecmMin: (gm, m, want) => `<b>Minutes:</b> this one shows ${gm}, you need <b>${m}</b> — the long hand should point ${want}.`,
  fbOk: "Correct!", fbOkHint: "Correct, with a hint!", why: "Why?", fbBad: "Not quite", fbRetry: "Not quite. Try again!",
  stepHour: "<b>Step 1 of 2.</b> What <b>hour</b> is it? Look at the short <b class=\"c-h\">red</b> hand.",
  stepMin: h => `Yes, the hour is <b>${h}</b>! <b>Step 2 of 2.</b> How many <b>minutes</b>? Look at the long <b class="c-m">blue</b> hand.`,
  hourOptAria: (i, h) => `Option ${i}: ${h}`,
  hintLabel: "💡 Hint", hintNote: "The correct option is highlighted.",
  fbAnswered: (a, right) => `You answered ${a}, but it’s <b>${right}</b>.`,
  fbHowRight: "How to get it right:",
  fbClockLine: (right, picked) => `You need <b>${right}</b>, but this clock shows <b>${picked}</b>.`,
  fbHowFind: "How to find the right clock:",
  endGreat: "Excellent! 🏆", endGood: "Good job! 👍", endMore: "Let’s practice some more 💪",
  endScore: (sc, n) => `Correct: ${sc} of ${n}.`, endNext: name => ` Try the next level: “${name}”!`, endRetry: training => training ? " Read the tip and try again." : " Practice in “Learn” mode and try again.",
};

export default en;
