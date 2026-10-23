# 💙 For Zafer — "How well do you know us?"

A 15-question long-distance quiz from **Amreen (Hyderabad)** to **Zafer (Muscat)**, in sky blue and royal blue.
Made with Play Planet 🪐

**Screens:** Intro (live clocks for both cities + distance) → 15 timed questions with hints → Love-o-meter + the big question (YES 💙 or an honest "Let me think 🤔") → "Made for each other 💙" with confetti and a WhatsApp reply carrying his score and every answer.

Plain HTML/CSS/JS. No build step. Runs on GitHub Pages as-is.

---

## 1. Personalise (everything is at the top of `script.js`)

### `CONFIG`

| Field | What it does |
|---|---|
| `from`, `to` | Names used in texts (`{from}`, `{to}`) |
| `greeting`, `introText` | Words on the first screen |
| `me` / `them` | City, flag, IANA time zone, latitude/longitude. Distance, clocks, time difference and UTC offsets are all calculated from these |
| `timerSeconds` | Seconds per question (`30`). `0` turns the timer off |
| `meterName` | Name of the score bar ("Love-o-meter") |
| `ask` | The big question. `highlight` is shown in the handwritten font |
| `thinkText` | Shown if he taps "Let me think 🤔" |
| `event` | `null` = no countdown/calendar (none was requested). An example of the shape is in the comment above it |
| `successTitle`, `message`, `signoff` | Final screen ("Made for each other 💙", "— Cutie 😚") |
| `whatsapp.number` | Number that receives replies, digits only with country code (`917989381957`). `""` hides the buttons |
| `whatsapp.text` / `thinkText` | First line of the WhatsApp reply (score + all answers are added automatically) |
| `privacyNote` | Small line "Your answers are shared with Amreen 💙". Leave it on unless he already knows |
| `brand` | "Made with Play Planet 🪐" line. `show: false` removes it |
| `ntfy` | Live phone notifications (see section 6) |

### `QUESTIONS`

- `options`: 4 answers. `correct`: index of the right one (`0` = first), or `"all"` for a trick question (every answer scores).
- `right` / `wrong`: the line he sees after answering. `hint`: shown when he taps "💡 Need a hint?".
- `type: "distance"`, `"time"` or `"offset"`: options are generated live from the cities. Only edit their text.
- Placeholders filled in automatically: `{from} {to} {myCity} {theirCity} {km} {myTime} {theirTime} {diff} {aheadBehind} {myUtc} {theirUtc}`.
- ⚠️ Questions marked `// editable example` are guesses (comfort food, favourite colour, best gift, who wins arguments, who calls late). **Check the right answer for each one**, or swap in your own facts.

Score-band notes are in `SCORE_NOTES`, just below the questions.

## 2. Test locally

```bash
cd amreen-to-zafer-quiz
python3 -m http.server 8000
```

- Open **http://localhost:8000/?quiet** (`?quiet` = no notifications while you test).
- On your phone (same Wi-Fi): `http://<your-computer-IP>:8000/?quiet`.
- On desktop: DevTools → device toolbar → a 360px-wide phone.

## 3. Push to GitHub (its own repository)

Create an **empty** repo on GitHub first (no README). A hard-to-guess name is best for a private game, e.g. `for-zafer-7k2q`.

```bash
cd amreen-to-zafer-quiz
git init            # skip if the folder already has a .git
git add .
git commit -m "Quiz for Zafer 💙"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## 4. Turn on GitHub Pages

Repo → **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.
Your link: `https://<your-username>.github.io/<repo-name>/` (ready in about a minute).

## 5. After every change

Bump the version in **both** lines of `index.html` (`style.css?v=1` → `?v=2`, `script.js?v=1` → `?v=2`), then:

```bash
git add . && git commit -m "Quiz: <what changed>" && git push
```

## 6. Live notifications (ntfy)

**Topic:** `pp-quiz-oct26-ff27c5eabaaf` · **Label:** `Quiz Oct 26`

1. Install the **ntfy** app (Android/iPhone) → **+** → topic `pp-quiz-oct26-ff27c5eabaaf`, server `https://ntfy.sh`, display name `Quiz Oct 26`.
2. Open the live link once **without** `?quiet` to check a notification arrives. Use `?quiet` for all further testing.

You get: page opened, every answer (✅ / ❌ / ⏰ / 🎭 trick), the final score, and YES 💙 or "Let me think 🤔". Each play has a short session code (e.g. `#k3f9`) so replays are easy to tell apart. Final score and the answer arrive with priority 4.

**Good to know:** the topic is visible in the page source, so anyone with the link could subscribe to it or post to it. That's fine for a light personal game. For more privacy, reserve the topic on an ntfy.sh account with everyone else write-only, or self-host ntfy. Never put an ntfy token in this code. ntfy.sh keeps messages only for about 12 hours, so the WhatsApp reply is your permanent record.

**Retire it** (after he's played, or by **22 Nov 2026**): set `ntfy.enabled: false`, bump `?v=`, push, unsubscribe in the app, mark it retired in your topic list.

## 7. Notes

- Times use IANA time zones, so clocks are right on any phone. Hyderabad is currently 1½ hours ahead of Muscat; the game calculates this live.
- Reduced motion is respected (no floating hearts, gentle confetti).
- Google Fonts is the only outside resource, plus ntfy.sh when notifications are on.
- Anything in a public repo is public: the WhatsApp number and ntfy topic are in `script.js`.
