/* ==========================================================
   For Zafer, from Amreen: "How well do you know us?" quiz
   Play Planet · personal sent-link game
   ========================================================== */

/* ==========================================================
   ✏️ CONFIG: everything personal lives here. Edit freely!
   You never need to touch the code below the content blocks.
   ========================================================== */
const CONFIG = {
  from: "Amreen",                 // who made the game (shown in texts)
  to: "Zafer",                    // who plays it

  greeting: "Hey Zafer 💙",
  introText:
    "Hyderabad to Muscat is a long way, but let's see how well you really know us. " +
    "15 questions, a timer, and a hint button if you get stuck. No cheating… okay, a little cheating 😚",

  // Where each of you is. tz must be an IANA time zone so clocks are right on any phone.
  // "me" = the creator (Amreen), "them" = the player (Zafer).
  me:   { city: "Hyderabad", flag: "🇮🇳", tz: "Asia/Kolkata", lat: 17.385, lon: 78.4867 },
  them: { city: "Muscat",    flag: "🇴🇲", tz: "Asia/Muscat",  lat: 23.588, lon: 58.3829 },

  timerSeconds: 30,               // seconds per question. 0 = no timer
  meterName: "Love-o-meter",      // name of the score bar on the results screen

  // The big question at the end. "highlight" is shown in the handwritten font.
  ask: { before: "So, Zafer… will you stay my", highlight: "favourite person", after: "forever? 💙" },
  // Shown if he taps "Let me think" (a real, honest way to answer).
  thinkText: "No pressure 😌 Tell {from} what you really think. The WhatsApp button sends your answers too 👇",

  // No event was requested, so there is no countdown or calendar.
  // To add one, replace null with an object like this:
  // event: {
  //   date: "2026-10-30", time: "21:00", tz: "Asia/Kolkata", durationMinutes: 60,
  //   calendarTitle: "Call with Amreen 💙", calendarLocation: "WhatsApp video call",
  //   details: [ { icon: "📱", label: "Where", value: "WhatsApp video call" } ],
  // },
  event: null,

  successTitle: "Made for each other 💙",
  message:
    "{km} km and a {diff} time difference, and still you're my favourite notification. " +
    "Thank you for playing. Now send me your answers, I want to see them all 😚",
  signoff: "— Cutie 😚",

  // WhatsApp reply: number with country code, digits only. "" hides the buttons.
  whatsapp: {
    number: "917989381957",
    text: "YES! 💙 Made for each other.",
    thinkText: "I'm still thinking 🤔 Here's how I did in your quiz:",
  },

  // A small visible line telling the player their answers are shared. Recommended ON.
  privacyNote: { show: true, text: "Your answers are shared with {from} 💙" },

  // Small "Made with Play Planet" line at the bottom of each card.
  brand: { show: true, text: "Made with Play Planet 🪐" },

  // Live phone notifications via ntfy.sh. Add ?quiet to the URL to test without notifying.
  ntfy: {
    enabled: true,
    server: "https://ntfy.sh",           // or your self-hosted ntfy server
    topic: "pp-quiz-oct26-ff27c5eabaaf", // pp-<type>-<mmmyy>-<12 hex>: one topic per game
    label: "Quiz Oct 26",                // prefixed to every title: "[Quiz Oct 26] ..."
    clickUrl: "",                        // optional: link opened when you tap the notification
    priorityOnFinish: 4,                 // 1–5, used only for the final score and the answer
  },
};

/* ==========================================================
   ✏️ QUIZ QUESTIONS
   correct: index of the right option (0 = first), or "all" for a trick question.
   hint: shown when he taps "Need a hint?".
   type "distance" / "time" / "offset" build their options live from the cities above.
   Placeholders filled in automatically:
     {from} {to} {myCity} {theirCity} {km} {myTime} {theirTime}
     {diff} {aheadBehind} {myUtc} {theirUtc}
   ⚠️ Questions marked "editable example" are guesses: check the right answer!
   ========================================================== */
const QUESTIONS = [
  {
    type: "distance",
    emoji: "✈️",
    q: "Warm-up! How far is {myCity} from {theirCity}?",
    hint: "More than a road trip, less than a flight to London 😉",
    right: "Correct! {km} km… and I still feel you right here 💙",
    wrong: "It's about {km} km. Far on the map, close in the heart 🫶",
  },
  {
    type: "time",
    emoji: "🕰️",
    q: "Quick! What time is it for me in {myCity} right now?",
    hint: "I'm {diff} {aheadBehind} you. Do the maths 🧮",
    right: "Yes! It's {myTime} here. I'm always {diff} {aheadBehind} you 😏",
    wrong: "It's {myTime} here! I'm {diff} {aheadBehind} you, remember? 🙈",
  },
  {
    type: "offset",
    emoji: "🌍",
    q: "How far ahead of {theirCity} is {myCity}'s clock?",
    hint: "India uses a half-hour time zone. That's the clue 🕧",
    right: "Exactly {diff}! {myCity} runs on {myUtc} and {theirCity} on {theirUtc} 🤓",
    wrong: "It's {diff}. {myCity} is {myUtc} and {theirCity} is {theirUtc}, so that pesky half hour sneaks in 🕧",
  },
  {
    emoji: "🏛️",
    q: "Which famous monument is in my city, {myCity}?",
    options: ["Charminar", "Gateway of India", "India Gate", "Qutub Minar"],
    correct: 0,
    hint: "Its name literally means \"four minarets\" 😉",
    right: "Correct! Charminar, built in 1591. Take me there when you visit 🥰",
    wrong: "It's Charminar! Gateway of India is Mumbai, India Gate and Qutub Minar are Delhi 🗺️",
  },
  {
    emoji: "🕌",
    q: "And which grand landmark is in your city, {theirCity}?",
    options: ["Sultan Qaboos Grand Mosque", "Burj Khalifa", "Petra", "The Taj Mahal"],
    correct: 0,
    hint: "It's named after a Sultan, and it's very, very grand 🕌",
    right: "Yes! The Sultan Qaboos Grand Mosque. See, I do my homework on your city 😌",
    wrong: "It's the Sultan Qaboos Grand Mosque! Burj Khalifa is Dubai, Petra is Jordan 🙈",
  },
  {
    emoji: "🍛",
    q: "Which city makes the better biryani?",
    options: ["Hyderabad, obviously", "Muscat (very brave)", "Whichever we eat together", "Both… please don't fight me"],
    correct: "all",
    hint: "There's no wrong answer… or is there? 😏",
    right: "Trick question! Every answer is right, as long as we eat it together 🥰",
  },
  {
    // editable example
    emoji: "📞",
    q: "Who says \"I'll call you in 5 minutes\" and calls an hour later?",
    options: ["Zafer", "Amreen", "Both of us", "Blame the network"],
    correct: 0,
    hint: "Look in the mirror 🪞",
    right: "Guilty as charged 🙋‍♂️ I know you, Zafer 😏",
    wrong: "Hmm, nice try. It's YOU, mister 🙋‍♂️ I've been counting",
  },
  {
    emoji: "😚",
    q: "What name am I signing this quiz with?",
    options: ["Cutie 😚", "Boss Lady 👑", "Your Majesty", "Amreen the Great"],
    correct: 0,
    hint: "Scroll back to the very first screen… just kidding, it's cute 😚",
    right: "Correct! Cutie 😚, and don't you forget it",
    wrong: "It's Cutie 😚! Although Boss Lady also fits, let's be honest",
  },
  {
    // editable example
    emoji: "🎨",
    q: "What's my favourite colour?",
    options: ["Sky blue", "Royal blue", "Both blues, obviously", "Whatever you're wearing"],
    correct: 2,
    hint: "Look at the colours of this whole quiz 👀",
    right: "Both blues! You paid attention to the theme 💙🩵",
    wrong: "Both blues! Why do you think this whole quiz is blue? 💙🩵",
  },
  {
    // editable example
    emoji: "🍫",
    q: "What's my go-to comfort food?",
    options: ["Biryani", "Chocolate", "Chai and biscuits", "Ice cream"],
    correct: 2,
    hint: "It comes in a cup and pairs with something crunchy ☕",
    right: "Chai and biscuits! You know me too well ☕",
    wrong: "It's chai and biscuits! Bring some next time and I'll forgive you ☕",
  },
  {
    // editable example
    emoji: "🏆",
    q: "Who wins basically every argument?",
    options: ["Zafer, obviously", "Amreen, obviously", "It's always a draw", "Whoever sends the cuter sticker"],
    correct: 1,
    hint: "Who made this quiz? Exactly 😌",
    right: "Correct. You never stood a chance 😌",
    wrong: "Nice try, but it's me. Every single time 😌",
  },
  {
    emoji: "🥺",
    q: "On a scale of 1–10, how much do I miss you?",
    options: ["7", "9", "10", "It broke the scale"],
    correct: 3,
    hint: "Think bigger. Much bigger 📈",
    right: "Correct! The scale is broken. I miss you THAT much 💙",
    wrong: "Way too low! The scale is broken. I miss you THAT much 🥺",
  },
  {
    // editable example
    emoji: "🎁",
    q: "What's the best gift you could ever give me?",
    options: ["Flowers 💐", "Chocolates 🍫", "A surprise call 📞", "Your time ⏳"],
    correct: 3,
    hint: "It's free, but it's the most precious thing you have ⏳",
    right: "Your time! That's all I ever want 🥹",
    wrong: "Sweet, but it's your time ⏳ (Flowers are also accepted, just saying)",
  },
  {
    emoji: "🌙",
    q: "If I said \"let's look at the same moon tonight\", what would you do?",
    options: ["Step outside right away", "Send me a photo of it", "Call me while looking at it", "All of these, obviously"],
    correct: "all",
    hint: "Same moon, two cities. Any answer works 🌙",
    right: "Trick question! Every answer is perfect. Same moon, {myCity} and {theirCity} 🌙",
  },
  {
    emoji: "💙",
    q: "Last one. Are we made for each other?",
    options: ["Yes", "Absolutely yes", "Obviously yes", "Was that even a question?"],
    correct: "all",
    hint: "There is only one kind of answer here 😚",
    right: "Trick question! Every answer is right, because we are 💙",
  },
];

/* ===== Score-band notes for the results meter ===== */
const SCORE_NOTES = [
  { min: 100, text: "Perfect score! You know me better than I know myself 🏆💙" },
  { min: 70,  text: "Certified expert in us. I'm impressed (and a little in love) 😍" },
  { min: 40,  text: "Not bad! We'll study together on our next call 📚💙" },
  { min: 0,   text: "Hmm… sounds like you need more calls with me to practise 😏" },
];
const TIMEOUT_PREFIX = "⏰ Time's up! ";

/* ==========================================================
   Helpers (no need to edit below this line)
   ========================================================== */
const $ = (id) => document.getElementById(id);
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const QUIET = new URLSearchParams(location.search).has("quiet");
const SESSION = Math.random().toString(36).slice(2, 6);

const fmt = (date, tz, opts) => new Intl.DateTimeFormat("en-US", { timeZone: tz, ...opts }).format(date);
const fmtTime = (date, tz) => fmt(date, tz, { hour: "numeric", minute: "2-digit" });
const fmtDate = (date, tz) => fmt(date, tz, { weekday: "short", day: "numeric", month: "short" });
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pad = (n) => String(n).padStart(2, "0");

/** Minutes a time zone is ahead of UTC at a given instant. */
function tzOffsetMin(tz, at = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(at).map((x) => [x.type, x.value])
  );
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60000);
}

/** Convert a wall-clock date+time in an IANA zone to a real Date (two passes handle DST). */
function zonedToDate(dateStr, timeStr, tz) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const wanted = Date.UTC(y, m - 1, d, hh, mm);
  let ts = wanted - tzOffsetMin(tz, new Date(wanted)) * 60000;
  ts = wanted - tzOffsetMin(tz, new Date(ts)) * 60000;
  return new Date(ts);
}

/** "1½ hours", "2 hours", "45 minutes", "3 h 15 min" */
function durationText(min) {
  min = Math.abs(min);
  const h = Math.floor(min / 60), m = min % 60;
  if (min === 0) return "0 hours";
  if (h === 0) return `${m} minutes`;
  if (m === 0) return `${h} hour${h > 1 ? "s" : ""}`;
  if (m === 30) return `${h}½ hours`;
  return `${h} h ${m} min`;
}

function distanceKm(a, b) {
  const r = (x) => (x * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lon - a.lon) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(h)));
}
const KM = distanceKm(CONFIG.me, CONFIG.them);
const kmText = (n) => n.toLocaleString("en-US");
/** "UTC+5:30" style label for a zone, right now. */
function utcLabel(tz) {
  const o = tzOffsetMin(tz), a = Math.abs(o);
  return `UTC${o < 0 ? "−" : "+"}${Math.floor(a / 60)}${a % 60 ? ":" + pad(a % 60) : ""}`;
}
const diffMin = () => tzOffsetMin(CONFIG.me.tz) - tzOffsetMin(CONFIG.them.tz);

const EVENT_START = CONFIG.event ? zonedToDate(CONFIG.event.date, CONFIG.event.time, CONFIG.event.tz) : null;
const EVENT_END = CONFIG.event ? new Date(EVENT_START.getTime() + CONFIG.event.durationMinutes * 60000) : null;

function fill(text) {
  const now = new Date();
  const d = diffMin();
  return String(text)
    .replaceAll("{from}", CONFIG.from)
    .replaceAll("{to}", CONFIG.to)
    .replaceAll("{km}", kmText(KM))
    .replaceAll("{myCity}", CONFIG.me.city)
    .replaceAll("{theirCity}", CONFIG.them.city)
    .replaceAll("{myTime}", fmtTime(now, CONFIG.me.tz))
    .replaceAll("{theirTime}", fmtTime(now, CONFIG.them.tz))
    .replaceAll("{diff}", durationText(d))
    .replaceAll("{myUtc}", utcLabel(CONFIG.me.tz))
    .replaceAll("{theirUtc}", utcLabel(CONFIG.them.tz))
    .replaceAll("{aheadBehind}", d > 0 ? "ahead of" : d < 0 ? "behind" : "the same time as");
}

/** Fire-and-forget phone notification via ntfy (JSON body, no custom headers → no CORS preflight). */
function notify(title, message, { tags = [], finish = false } = {}) {
  const n = CONFIG.ntfy;
  if (QUIET || !n || !n.enabled || !n.topic) return;
  try {
    const body = { topic: n.topic, title: `[${n.label}] ${title}`, message: `${message}\n#${SESSION}`, tags };
    if (finish) body.priority = n.priorityOnFinish || 4;
    if (n.clickUrl) body.click = n.clickUrl;
    fetch(n.server.replace(/\/+$/, "") + "/", { method: "POST", body: JSON.stringify(body), keepalive: true }).catch(() => {});
  } catch (_) { /* never break the page over a notification */ }
}

function showScreen(from, to) {
  const swap = () => { from.hidden = true; from.classList.remove("leaving"); to.hidden = false; to.scrollTop = 0; };
  if (REDUCED) return swap();
  from.classList.add("leaving");
  setTimeout(swap, 340);
}

/* ===== Floating background ===== */
(function makeFloaters() {
  if (REDUCED) return;
  const box = $("bgFloat");
  const emojis = ["💙", "🩵", "✨", "☁️", "💙", "🫧"];
  const count = window.innerWidth < 600 ? 12 : 20;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = emojis[i % emojis.length];
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = 14 + Math.random() * 20 + "px";
    s.style.animationDuration = 10 + Math.random() * 14 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    box.appendChild(s);
  }
})();

/* ===== Brand line on every card ===== */
if (CONFIG.brand && CONFIG.brand.show) {
  document.querySelectorAll(".card").forEach((c) => {
    const p = document.createElement("p");
    p.className = "brand";
    p.textContent = CONFIG.brand.text;
    c.appendChild(p);
  });
}

/* ==========================================================
   1. INTRO
   ========================================================== */
document.title = `For ${CONFIG.to} 💙`;
$("greeting").textContent = fill(CONFIG.greeting);
$("introText").textContent = fill(CONFIG.introText);
$("introSmall").textContent =
  `${QUESTIONS.length} questions` + (CONFIG.timerSeconds ? ` · ${CONFIG.timerSeconds}s each` : "") + " · hints if you need them 💡";
if (CONFIG.privacyNote && CONFIG.privacyNote.show) {
  $("privacy").textContent = fill(CONFIG.privacyNote.text);
  $("privacy").hidden = false;
}
$("myCity").textContent = CONFIG.me.city;
$("theirCity").textContent = CONFIG.them.city;
$("myFlag").textContent = CONFIG.me.flag;
$("theirFlag").textContent = CONFIG.them.flag;
$("distance").textContent = kmText(KM) + " km apart";

function tickClocks() {
  const now = new Date();
  $("myClock").textContent = fmtTime(now, CONFIG.me.tz);
  $("theirClock").textContent = fmtTime(now, CONFIG.them.tz);
}
tickClocks();
setInterval(tickClocks, 15000);

notify(`👀 ${CONFIG.to} opened the quiz`, `${fmtTime(new Date(), CONFIG.them.tz)} his time (${CONFIG.them.city})`, { tags: ["eyes"] });

$("startBtn").addEventListener("click", () => {
  showScreen($("introScreen"), $("quizScreen"));
  renderQuestion();
});

/* ==========================================================
   2. QUIZ
   ========================================================== */
let qIndex = 0;
let score = 0;
let hintsUsed = 0;
const picked = []; // chosen answer text per question (for the WhatsApp reply)

function uniqueOptions(right, candidates, count) {
  const set = new Set([right]);
  for (const c of candidates) { if (set.size >= count) break; set.add(c); }
  return [...set];
}

/** Build options for the live questions. The correct option is always present exactly once. */
function buildDynamic(item) {
  if (item.type === "distance") {
    const right = kmText(KM) + " km";
    const opts = shuffle(uniqueOptions(right, [
      kmText(Math.round((KM * 0.45) / 10) * 10) + " km",
      kmText(Math.round((KM * 2.3) / 10) * 10) + " km",
      kmText(Math.round((KM * 1.6) / 10) * 10) + " km",
    ], 3));
    opts.push("Too far 😢");
    return { options: opts, correct: opts.indexOf(right) };
  }
  if (item.type === "time") {
    const now = Date.now();
    const right = fmtTime(new Date(now), CONFIG.me.tz);
    const opts = shuffle(uniqueOptions(right, [90, -90, 150, -60, 60].map((m) => fmtTime(new Date(now + m * 60000), CONFIG.me.tz)), 3));
    opts.push("Time stops when I'm talking to you ⏳");
    return { options: opts, correct: opts.indexOf(right) };
  }
  if (item.type === "offset") {
    const d = Math.abs(diffMin());
    const right = durationText(d);
    const cands = [d + 60, d - 60, d + 120, d + 30, d - 30].filter((m) => m > 0).map(durationText);
    const opts = shuffle(uniqueOptions(right, cands, 3));
    opts.push("No difference, love has no time zone 💙");
    return { options: opts, correct: opts.indexOf(right) };
  }
  return { options: item.options, correct: item.correct };
}

/* ----- per-question timer ----- */
let timerRaf = null, timerEnd = 0;
function startTimer() {
  stopTimer();
  const wrap = $("timerWrap");
  if (!CONFIG.timerSeconds) { wrap.hidden = true; return; }
  wrap.hidden = false;
  wrap.classList.remove("low");
  timerEnd = performance.now() + CONFIG.timerSeconds * 1000;
  const step = () => {
    const left = Math.max(0, timerEnd - performance.now());
    $("timerBar").style.width = (left / (CONFIG.timerSeconds * 1000)) * 100 + "%";
    $("timerNum").textContent = `⏱ ${Math.ceil(left / 1000)}s`;
    wrap.classList.toggle("low", left < 6000);
    if (left <= 0) { timerRaf = null; answer(-1); return; }
    timerRaf = requestAnimationFrame(step);
  };
  step();
}
function stopTimer() { if (timerRaf) cancelAnimationFrame(timerRaf); timerRaf = null; }

function renderQuestion() {
  const item = QUESTIONS[qIndex];
  const { options, correct } = buildDynamic(item);
  item._live = { options, correct, answered: false };

  $("qCount").textContent = `Question ${qIndex + 1} of ${QUESTIONS.length}`;
  $("qScore").textContent = `💙 ${score}`;
  $("qProgress").style.width = (qIndex / QUESTIONS.length) * 100 + "%";
  $("qEmoji").textContent = item.emoji || "💭";
  $("qText").textContent = fill(item.q);
  $("qFeedback").textContent = "";
  $("qFeedback").className = "feedback";
  $("hintText").textContent = "";
  $("hintBtn").hidden = !item.hint;
  $("hintBtn").disabled = false;
  $("nextBtn").hidden = true;

  const box = $("qOptions");
  box.innerHTML = "";
  options.forEach((text, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "option";
    b.innerHTML = "<b></b><span></span>";
    b.querySelector("b").textContent = "ABCD"[i] || String(i + 1);
    b.querySelector("span").textContent = text;
    b.addEventListener("click", () => answer(i));
    box.appendChild(b);
  });

  const body = $("qBody");
  body.classList.remove("swap");
  void body.offsetWidth;
  body.classList.add("swap");
  startTimer();
}

$("hintBtn").addEventListener("click", () => {
  const item = QUESTIONS[qIndex];
  if (!item.hint || item._live.answered) return;
  hintsUsed++;
  $("hintText").textContent = "💡 " + fill(item.hint);
  $("hintBtn").hidden = true;
});

/** i = chosen option index, or -1 when the timer ran out. */
function answer(i) {
  const item = QUESTIONS[qIndex];
  if (item._live.answered) return;
  item._live.answered = true;
  stopTimer();

  const { options, correct } = item._live;
  const isTrick = correct === "all";
  const timedOut = i < 0;
  const ok = !timedOut && (isTrick || i === correct);
  if (ok) score++;
  picked[qIndex] = timedOut ? "⏰ (time ran out)" : options[i];

  [...$("qOptions").children].forEach((b, j) => {
    b.disabled = true;
    if (isTrick || j === correct) b.classList.add("correct");
    else if (j === i) b.classList.add("wrong");
    else b.classList.add("dim");
  });
  $("hintBtn").hidden = true;

  const fb = $("qFeedback");
  let line = ok ? item.right : item.wrong || item.right;
  if (timedOut) line = TIMEOUT_PREFIX + (isTrick ? "Any answer would have been right 😅" : line);
  fb.textContent = fill(line);
  fb.className = "feedback " + (ok ? "good" : "meh");
  $("qScore").textContent = `💙 ${score}`;
  $("qProgress").style.width = ((qIndex + 1) / QUESTIONS.length) * 100 + "%";

  notify(
    `Q${qIndex + 1} ${timedOut ? "⏰" : isTrick ? "🎭 trick" : ok ? "✅" : "❌"}`,
    `${fill(item.q)}\n→ ${picked[qIndex]}`,
    { tags: [ok ? "white_check_mark" : "x"] }
  );

  const last = qIndex === QUESTIONS.length - 1;
  $("nextBtn").textContent = last ? "See my results 💙" : "Next →";
  $("nextBtn").hidden = false;
  $("nextBtn").focus({ preventScroll: true });
}

$("nextBtn").addEventListener("click", () => {
  qIndex++;
  if (qIndex < QUESTIONS.length) return renderQuestion();
  showResults();
});

/* ==========================================================
   3. RESULTS + THE BIG QUESTION
   ========================================================== */
function scoreNote(pct) { return (SCORE_NOTES.find((n) => pct >= n.min) || SCORE_NOTES[SCORE_NOTES.length - 1]).text; }

function answersSummary() {
  return [`My score: ${score}/${QUESTIONS.length}` + (hintsUsed ? ` (${hintsUsed} hint${hintsUsed > 1 ? "s" : ""})` : ""),
    ...picked.map((a, n) => `${n + 1}. ${a}`)].join("\n");
}

function waLink(text) {
  return `https://wa.me/${CONFIG.whatsapp.number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

function showResults() {
  const pct = Math.round((score / QUESTIONS.length) * 100);
  const note = scoreNote(pct);
  notify(`📊 Final score: ${score}/${QUESTIONS.length}`, `${pct}% · hints used: ${hintsUsed}\n${note}`, { tags: ["bar_chart"], finish: true });

  showScreen($("quizScreen"), $("askScreen"));
  $("meterName").textContent = CONFIG.meterName;
  $("meterNote").textContent = note;
  const q = $("askQ");
  q.textContent = "";
  q.append(fill(CONFIG.ask.before) + " ");
  const s = document.createElement("span");
  s.className = "script";
  s.textContent = fill(CONFIG.ask.highlight);
  q.append(s, " " + fill(CONFIG.ask.after));

  setTimeout(() => {
    $("meterFill").style.width = pct + "%";
    if (REDUCED) { $("meterPct").textContent = pct + "%"; return; }
    let n = 0;
    const step = () => {
      n = Math.min(pct, n + Math.max(1, Math.round(pct / 40)));
      $("meterPct").textContent = n + "%";
      if (n < pct) requestAnimationFrame(step);
    };
    step();
  }, 450);
}

let thinkingLogged = false;
$("thinkBtn").addEventListener("click", () => {
  $("thinkBox").hidden = false;
  $("thinkText").textContent = fill(CONFIG.thinkText);
  if (CONFIG.whatsapp.number) {
    $("waThink").href = waLink(fill(CONFIG.whatsapp.thinkText) + "\n" + answersSummary());
    $("waThink").hidden = false;
  }
  if (!thinkingLogged) {
    thinkingLogged = true;
    notify(`🤔 ${CONFIG.to} tapped "Let me think"`, `Score ${score}/${QUESTIONS.length}. Maybe check WhatsApp 😉`, { tags: ["thinking"], finish: true });
  }
});

let saidYes = false;
$("yesBtn").addEventListener("click", () => {
  if (saidYes) return;
  saidYes = true;
  notify(`💙 ${CONFIG.to} said YES!`, `Score ${score}/${QUESTIONS.length}. Made for each other 🎉`, { tags: ["tada", "blue_heart"], finish: true });
  showScreen($("askScreen"), $("successScreen"));
  renderSuccess();
  setTimeout(confettiBurst, REDUCED ? 0 : 250);
});

/* ==========================================================
   4. SUCCESS
   ========================================================== */
let countdownIv = null;
function renderSuccess() {
  $("successTitle").textContent = fill(CONFIG.successTitle);
  $("message").textContent = fill(CONFIG.message);
  $("signoff").textContent = fill(CONFIG.signoff);
  $("scoreline").textContent = `You scored ${score}/${QUESTIONS.length}` + (hintsUsed ? ` with ${hintsUsed} hint${hintsUsed > 1 ? "s" : ""} 💡` : " with no hints 😎");

  if (CONFIG.event) {
    $("eventBlock").hidden = false;
    $("calendarBtn").hidden = false;
    $("tMyFlag").textContent = CONFIG.me.flag;
    $("tTheirFlag").textContent = CONFIG.them.flag;
    $("tMyCity").textContent = CONFIG.me.city;
    $("tTheirCity").textContent = CONFIG.them.city;
    $("tMyTime").textContent = fmtTime(EVENT_START, CONFIG.me.tz);
    $("tMyDate").textContent = fmtDate(EVENT_START, CONFIG.me.tz) + " · my time";
    $("tTheirTime").textContent = fmtTime(EVENT_START, CONFIG.them.tz);
    $("tTheirDate").textContent = fmtDate(EVENT_START, CONFIG.them.tz) + " · your time";
    const ul = $("details");
    ul.innerHTML = "";
    (CONFIG.event.details || []).forEach((d) => {
      const li = document.createElement("li");
      li.innerHTML = "<span></span><div><small></small><strong></strong></div>";
      li.querySelector("span").textContent = d.icon;
      li.querySelector("small").textContent = d.label;
      li.querySelector("strong").textContent = fill(d.value);
      ul.appendChild(li);
    });
    tickCountdown();
    if (!countdownIv) countdownIv = setInterval(tickCountdown, 1000);
  }

  if (CONFIG.whatsapp.number) {
    $("waBtn").href = waLink(fill(CONFIG.whatsapp.text) + "\n" + answersSummary());
    $("waBtn").hidden = false;
  }
}

function tickCountdown() {
  if (!EVENT_START) return;
  const now = Date.now();
  if (now >= EVENT_END.getTime()) {
    $("cdLabel").textContent = "That's done! Thank you 💙";
    $("cdDigits").hidden = true;
    return;
  }
  if (now >= EVENT_START.getTime()) {
    $("cdLabel").textContent = "It's happening right now! 📱💙";
    $("cdDigits").hidden = true;
    return;
  }
  let s = Math.floor((EVENT_START.getTime() - now) / 1000);
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  $("cdD").textContent = d; $("cdH").textContent = pad(h); $("cdM").textContent = pad(m); $("cdS").textContent = pad(s);
}

const icsDate = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsEscape = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
function buildIcs() {
  const ev = CONFIG.event;
  const desc = [fill(CONFIG.message), "", ...(ev.details || []).map((d) => `${d.label}: ${fill(d.value)}`)].join("\n");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Play Planet//Quiz//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${icsDate(EVENT_START)}-${SESSION}@playplanet`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(EVENT_START)}`,
    `DTEND:${icsDate(EVENT_END)}`,
    `SUMMARY:${icsEscape(ev.calendarTitle)}`,
    `LOCATION:${icsEscape(ev.calendarLocation)}`,
    `DESCRIPTION:${icsEscape(desc)}`,
    "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Starting in 15 minutes 💙", "TRIGGER:-PT15M", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}
$("calendarBtn").addEventListener("click", () => {
  if (!CONFIG.event) return;
  const url = URL.createObjectURL(new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = "our-plan.ics";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
});

$("againBtn").addEventListener("click", confettiBurst);

/* ==========================================================
   Confetti: plain canvas, no libraries
   ========================================================== */
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let raf = null;

function sizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener("resize", sizeCanvas);
sizeCanvas();

function confettiBurst() {
  const colors = ["#5bb8f5", "#2f4fd8", "#a9dcff", "#1f3bb0", "#ffffff", "#8fa8ff"];
  const n = REDUCED ? 40 : innerWidth < 600 ? 160 : 260;
  for (let i = 0; i < n; i++) {
    const fromLeft = i % 2 === 0;
    pieces.push({
      x: REDUCED ? Math.random() * innerWidth : fromLeft ? -10 : innerWidth + 10,
      y: REDUCED ? -20 - Math.random() * innerHeight * 0.5 : innerHeight * (0.55 + Math.random() * 0.3),
      vx: REDUCED ? 0 : (fromLeft ? 1 : -1) * (4 + Math.random() * 8),
      vy: REDUCED ? 2 + Math.random() * 2 : -(9 + Math.random() * 10),
      w: 6 + Math.random() * 7, h: 8 + Math.random() * 10,
      rot: Math.random() * Math.PI, vr: REDUCED ? 0 : (Math.random() - 0.5) * 0.3,
      color: colors[(Math.random() * colors.length) | 0],
      heart: Math.random() < 0.25, life: 0,
    });
  }
  if (!raf) raf = requestAnimationFrame(drawConfetti);
}

function drawHeart(s) {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.4, -s, 0, -s * 0.35);
  ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.4, 0, s * 0.3);
  ctx.fill();
}

function drawConfetti() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  pieces = pieces.filter((p) => p.y < innerHeight + 40 && p.life < 600);
  for (const p of pieces) {
    p.life++;
    p.vy += REDUCED ? 0 : 0.25;
    p.vx *= 0.985;
    p.x += p.vx;
    p.y += Math.min(p.vy, 7);
    p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.heart) drawHeart(p.w * 0.9);
    else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.life / 8)) + 2);
    ctx.restore();
  }
  raf = pieces.length ? requestAnimationFrame(drawConfetti) : null;
  if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight);
}
