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
  desc_learn: "You get all the hints. In “Choose from 4” you can try again until you find the right answer.",
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
      tip: "When the long hand points to <b>12</b>, the time is exactly the hour the short hand points to." },
    { name: "Half past", desc: "On the hour and half past",
      tip: "Long hand on <b>12</b> — exactly. Long hand on <b>6</b> — <b>30 minutes</b> (half past). The short hand then stands <b>between</b> two numbers." },
    { name: "Quarters", desc: "On the hour, 15, 30 and 45 minutes",
      tip: "Long hand on <b>3</b> — 15 minutes, on <b>6</b> — 30, on <b>9</b> — 45. The short hand shows the hour it has <b>already passed</b> (it hasn’t reached the next number yet)." },
    { name: "Every five minutes", desc: "5, 10, 20, 25 … minutes",
      tip: "Each number for the long hand is <b>5 minutes</b>: 1 → 5, 2 → 10, 3 → 15, 4 → 20 … Count by fives!" },
    { name: "Master", desc: "Any minute, no minute labels",
      tip: "First find the nearest number before the hand and multiply by 5, then add the small marks. The minutes are not labeled on this clock!" },
  ],
  hoursWord: h => h === 1 ? "hour" : "hours", minWord: m => m === 1 ? "minute" : "minutes",
  timeText: (h, m) => `${enPhrase(h, m)} (${h}:${pad(m)})`,
  timeWords: (h, m) => enPhrase(h, m),
  optAria: (i, h, m) => `Option ${i}: ${enPhrase(h, m)}`, clockOptAria: i => `Clock, option ${i}`,
  ecZero1: () => `The long <b>blue</b> hand points to <b>12</b> — so there are no extra minutes, it’s exactly on the hour.`,
  ecZero2: h => `The short <b>red</b> hand points to <b>${h}</b> — so it’s ${h} o’clock.`,
  ecExact: (near, m) => `The long <b>blue</b> hand points to the number <b>${near}</b>. Each number is 5 minutes: ${near} × 5 = <b>${m}</b> minutes.`,
  ecPartial: (near, rest, m) => `The long <b>blue</b> hand has passed the number <b>${near === 0 ? 12 : near}</b> (that’s ${near * 5} minutes) and ${rest} more small mark${rest === 1 ? "" : "s"} — <b>${m}</b> ${m === 1 ? "minute" : "minutes"} in total.`,
  ecEarly: (h, nx) => `The short <b>red</b> hand has already passed <b>${h}</b> but hasn’t reached <b>${nx}</b> yet. Take the number it has <b>passed</b>: the hour is ${h}.`,
  ecHalf: (h, nx) => `The short <b>red</b> hand is exactly halfway between <b>${h}</b> and <b>${nx}</b>. Take the smaller number it has passed: the hour is ${h}.`,
  ecLate: (h, nx) => `The short <b>red</b> hand is already closer to <b>${nx}</b> but hasn’t reached it. So the hour is still <b>${h}</b>. (It’s close to ${nx} because the next hour is coming soon.)`,
  emSwap: () => `😕 It looks like you mixed up the hands. The <b>short</b> red hand shows hours and the <b>long</b> blue hand shows minutes.`,
  emHourLate: (gh, h) => `😕 <b>Hours:</b> you said ${gh}, but the red hand hasn’t reached ${gh} yet. Half an hour or more has passed, so it is halfway or closer to ${gh}, but the hour is still ${h}. Rule: look at the number the short hand has <b>already passed</b>.`,
  emHourEarly: (gh, h, nx) => `😕 <b>Hours:</b> you said ${gh}, but the red hand has already <b>passed</b> ${h} and is heading to ${nx}. The hour is the number it has passed — ${h}.`,
  emHourZero: (h, gh) => `😕 <b>Hours:</b> when the long hand is on 12, the short hand points exactly at the hour. It points to <b>${h}</b>, not ${gh}.`,
  emHourGen: (h, gh) => `😕 <b>Hours:</b> the short red hand shows the hour <b>${h}</b>, but you answered ${gh}. Make sure you’re looking at the <b>short</b> hand.`,
  emMinNum: (a, m) => `😕 <b>Minutes:</b> you read the number on the clock (${a}) as minutes. But each number is <b>5 minutes</b>! ${a} × 5 = <b>${m}</b>.`,
  emMinOne: (x, m, gm) => `😕 <b>Minutes:</b> you’re off by one number. The long hand points to <b>${x}</b>, ${x === 12 ? "so there are no extra minutes: <b>0</b>" : `so ${x} × 5 = <b>${m}</b> minutes`}, not ${gm}.`,
  emMinOpp: (m, gm) => `😕 <b>Minutes:</b> you looked at the opposite side of the dial. The long hand shows ${enMin(m)}, not ${gm}. Start counting from <b>12</b>, clockwise.`,
  emMinClose: d => `😕 <b>Minutes:</b> almost! You’re off by just ${enMin(d)}. Find the nearest number before the hand, multiply by 5, then count the small marks.`,
  emMinGen: (m, gm) => `😕 <b>Minutes:</b> the long hand shows <b>${m}</b> ${m === 1 ? "minute" : "minutes"}, not ${gm}. Remember: number × 5 = minutes.`,
  ecmSwap: () => `😕 It looks like you mixed up the hands: on the clock you picked, the short red hand is where the long blue one should be, and vice versa.`,
  ecmHour: (gh, h) => `😕 <b>Hours:</b> on the clock you picked the short red hand shows the hour <b>${gh}</b>, but you need <b>${h}</b>. The hour is the number the short hand has <b>already passed</b>.`,
  ecmWantExact: (x, m) => x === 12 ? `at the number <b>12</b> (on the hour, 0 minutes)` : `at the number <b>${x}</b> (${x} × 5 = ${m})`,
  ecmWantAfter: x => `a little past the number <b>${x}</b>`,
  ecmMin: (gm, m, want) => `😕 <b>Minutes:</b> on the clock you picked the long blue hand shows ${enMin(gm)}, but you need ${m}. It should point ${want}.`,
  fbOk: "Correct!", fbOkHint: "Correct, with a hint!", why: "Why?", fbBad: "Not quite", fbRetry: "Not quite. Try again!",
  hintLabel: "💡 Hint", hintNote: "The correct option is highlighted.",
  fbAnswered: (a, right) => `You answered: <b>${a}</b>. Correct: <b>${right}</b>.`,
  fbHowRight: "How to get it right:",
  fbClockLine: (right, picked) => `You need the clock that shows <b>${right}</b>. You picked a clock showing <b>${picked}</b>.`,
  fbHowFind: "How to find the right clock:",
  endGreat: "Excellent! 🏆", endGood: "Good job! 👍", endMore: "Let’s practice some more 💪",
  endScore: (sc, n) => `Correct: ${sc} of ${n}.`, endNext: name => ` Try the next level: “${name}”!`, endRetry: training => training ? " Read the tip and try again." : " Practice in “Learn” mode and try again.",
};

export default en;
