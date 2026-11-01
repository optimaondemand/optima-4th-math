# 4.10.05 Units of Time · Level 10, the Clock Tower (lesson 5 of 7)

Built 1 Nov 2026 to the Dimensions 4B Chapter 10 Lesson 5 shape and aligned to the IP. Guide notes: `claude/g4-dm-4b-ch10-notes.md` (10-5 row, no new photos). IP: `Grade 4/Independent Practice Drafts/Unit 10/math-lesson-4-10-05-independent-practice.pdf`.

## Bethany's decisions (31 Oct)
- Problem: restart the stopped Clock Tower. Main model: new **Clock Hands** kit tool (`OAOKit.clock`). Think: compare two times (2 h 10 min vs 125 min). Mistakes: 1 h = 100 min, using 60 for days, forgetting the extra minutes.
- Quests: fix · find · deliver · chime (+ crew). Prove: the timetable's "1 h 75 min" (her pick was "2 h 70 min"; that is 190 min = IP 2b, so the plan she approved changed it). Bonus: two sand timers. Keeper: Clockkeeper Otto (`secondary_man`).
- Readiness: ÷ 60 is not taught (two-digit divisor). Going up counts full turns (groups of 60); halving and × 60 / × 24 are known.

## Gap table (guide · old page · IP)
| | Dimensions 10-5 | Old page | IP | Now |
|---|---|---|---|---|
| Skill | s/min/h/day/week facts; down = multiply; up = count groups | time chart, "Time Stacker", multiple choice | facts, down, up (h min), chains, compound → one unit, halve | IP |
| Methods | hours and minutes vs all minutes | one way | — | Atlas (hours and minutes) · Felix (all minutes) · Hazel (picture the clock) · Cora (60 not 100) |
| Mistake | trading 100 | not named | — | Cora tip in J1, hints in every model, Do video mistake board |
| Leftovers | — | solved IP facts, jargon, crew copy | — | gone |

## IP coverage
| IP | Direction | Hands-on job (new numbers) |
|---|---|---|
| 1a, 1b, 4c | min (s) → s | J2 Restart the Hands: 7 min 25 s = 445 s; quick 8 min = 480 s |
| 2a, 4a | h (min) → min | J2: 5 h 15 min = 315 min; quick 10 h = 600 min |
| 2b | min → h min | J3 Group the Minutes: 145 min = 2 h 25 min (after "make the next hour") |
| 3a | days → h | J4 Day Wheel: 3 days = 72 h |
| 3b, 4b | chain h → min → s; min → s | J4: 2 h → 120 min → 7,200 s; 150 min = 9,000 s |
| 5 | h min → min, halve, back to h min | J5 Express Train: 2 h 50 min = 170, half 85 = 1 h 25 min (Story Bar Model) |

IP facts avoided everywhere: 240, 258, 180 (3 h), 190 → 3 h 10, 168, 540, 32,400, 360 (6 × 60), 392, 9,600, 120 s (2 min), 132, 194, 97, 1 h 37 min.

## Readiness list (✅ known · 🟡 taught here, above first use)
- ✅ × by 1 digit and by multiples of 10, halving, number bonds, two-unit amounts and regrouping (10.01–10.04), reading a clock to 5 minutes (Grade 3)
- 🟡 second, minute, hour, day, week + 1 min = 60 s, 1 h = 60 min — J1 Wind the Clock (tooltips, Cora's 60-not-100 tip) before Mental Math and Think
- 🟡 1 day = 24 h — J1 round 3 (day face)
- 🟡 down = multiply, up = count full turns — Crew card, J2 (down), J3 (up; CREW_TAUGHT = j3)
- 🟡 h min with a leftover — "Make the next hour" + J3
- 🟡 chains — J4, Otto's Time Board, Do video, Study It (1 h 40 min → 100 min → 50 min)
- Game: fix locked until j1; crew on Learn; find after j2; deliver after j4; chime after j6.

## Story, game, voices
- Quests: **fix** (read the clock at 3/8/11 → 15/40/55) · **crew** · **find** (three gears: 60, 25, 24) · **deliver** (timetable to the station master: 5 h 5 min = 305; misses 505, 300) · **chime** (GOLEM COMES IN 1 DAY 6 HOURS = 30 h; one Smudge line; Opti points to the night market).
- Crew HELLO = the Clock Tower (Atlas: how tall, Felix: one tick then nothing, Hazel: drawing the train, Cora: a wrong clock is worse than none). CREW_TAUGHT = 'j3'.
- Voices: cast + Otto (`secondary_man`, added to `_cast`) + one Smudge line. Opti's three generic Crew lines reuse 10-04 clips. Flow "G4 Math 4.10.05 voices"; takes in `3-5 Math OAO/voice-10-05`.

## Kit changes
- **New `OAOKit.clock`** (Clock Hands): an SVG face with `rate` ticks (60 or 24); drag the red hand clockwise or wind with step buttons; "+ 1 full turn" after one turn by hand; full turns stack as tiles; readout as a count or "N full turns and M"; optional answer form with mistakes (default nudge when the leftover is ≥ rate); `hideTarget`/`hideRate`. Demo + kit test.
- pq-art item: gear. 10.01–10.04 rebuilt; checks and play-throughs pass.

## Independent solve (1 Nov) — fixed
IP collisions: deliver 6 h 5 min → 5 h 5 min; SWYK 1(c) 6 h 5 min → 8 h 50 min; J2 quick 6 min → 8 min and 8 h → 10 h; Do video 6 h 40 min → 10 h 20 min and 335 min → 155 min (no count past 120); SWYK 2 hint "60, 120, 180" → "60, 120"; SWYK 1(b) 2 min 35 s → 3 min 35 s; hint example 2 min 45 s → 5 min 45 s. Readiness: SWYK 2(b) 200 s → 95 min (s → min going up is never modeled); EQ spells out hours/minutes. Wording: "Some amounts of time", "wound forward", Job 4 chain sentence, Study It line, "finished" now only means units are missing, express [8,5] hint, week = any 7 days in a row, Hazel's card adds her last line. Hints that gave answers away (Mental Math 35 and 45, next-hour 2, express rung 1, prove rung 2) now point at the method. Page tower scene runs only after the fix quest.
Left: the EQ's 2 h = 120 min (the Think problem itself).

## Videos
think (cards) · learn (times chart, two ways board, live `?board=hands`) · do (10 h 20 min = 620 min; 155 min = 2 h 35 min "your turn first"; 2 days = 48 h = 2,880 min; mistake 175 min ≠ 1 h 75 min → 2 h 55 min) · wrap.
