# 4.10.07 Fractions and Measurement, Part 2 · notes (2 Nov 2026)

Level 10 "Metric Market", the farmers' market, lesson 7 of 7 + the Brick Golem boss. Dimensions 4B Ch 10 Lesson 8 (chapter notes, no new photos) + the IP.

## Decisions (Bethany, 2 Nov)
- 10.06's factory gate swapped from 1/3 h (= IP 3b's piece) to 1/6 h = 10 min; the other three 10.06 facts left as they were.
- Greenhollow tease kept, soft wording: the seed packet says GREENHOLLOW and the road south opens; no promise of another game level.
- Problem: rebuild Goldie's Re-Stamper (handle · face · ink), then re-stamp the Golem's bricks. Model: new Mixed-Number Splitter. All four mistakes ticked: converts the whole too · drops the wholes · leftover not simplified · adds before changing. Bonus: Triangle of Equals. Keeper Goldie (secondary_woman).

## Gap table
| | Guide (DM 10-8) | Old page | IP |
|---|---|---|---|
| Skill | mixed number of a unit → ft and in, then all in; "what needs converting?" | mostly matches | matches + reverse, two-unit ↔ mixed, add/regroup/simplify (IP wins) |
| Numbers | — | timed grid of IP/summative facts; pumpkin 2 3/4 lb = 44 oz (IP 6's 3/4 lb); 42 in; SWYK 2 ft 8 in (summative 8 in) | — |
| Methods | change just the fraction vs change it all | Crew quotes only | IP prints "split, change each piece, put back together" |

## IP coverage
| IP | Direction | Hands-on job (new numbers) |
|---|---|---|
| 1 | mixed ft → in | J2 Measure the Scarecrows: 2 5/6 ft = 2 ft 10 in = 34 in; 1 7/12 ft = 1 ft 7 in = 19 in (Think: 2 5/6 ft, any form) |
| 2, 3 | mixed lb → oz, h → min | J3 Weigh and Time: 2 7/8 lb = 46 oz; 1 2/5 h = 84 min; 2 1/10 h = 126 min |
| 4 | small → mixed, simplest | J4 Label the Crates: 26 in = 2 1/6 ft; 18 oz = 1 1/8 lb; 70 min = 1 1/6 h |
| 5 | two-unit ↔ mixed | J5: 5 ft 2 in = 5 1/6 ft; 3 lb 14 oz = 3 7/8 lb; 1 7/12 h = 1 h 35 min |
| 6 | change, add, regroup, simplify (lb oz) | Study It 1 15/16 lb + 1 lb 3 oz = 3 1/8 lb (two ways) → J6 (SWYK) 1 7/8 lb + 3 lb 4 oz = 5 lb 2 oz = 5 1/8 lb |
Every IP result, IP single fact and summative item was avoided (checked with a script and the independent solve). J1 (Warm-Up) only changes each piece separately: 4 ft / 1/6 ft, 3 lb / 7/16 lb, 1 h / 3/10 h.

## Readiness
- Known: whole units × 12/16/60 (Gr 3, 10.02–10.05), a fraction of a unit (10.06), simplifying by bigger equal parts (10.06), lb oz regrouping (10.03), mixed numbers (Units 6–7), metric two-unit (10.01), gal qt (10.04), h min (10.05).
- Taught here, above first use: mixed number (defined in J1), splitting into two pieces (J1), joining (Think, any way → Crew card → J2), reverse by skip-counting whole units (J4; no two-digit division), two units ↔ mixed (J5), add-then-simplify (Study It before J6).
- "factor" removed from student text (independent solve).
- Game: find (after J1: pieces only), crew (Learn), build (after J3: mixed → small), deliver (after J5: mixed → small), boss (after J6: Level 10 review + today).

## Boss (no engine change)
The Golem is a lesson object (lesson.js `golemArt`): dark shadow until the fight, bricks + an 8-segment HP bar during it, rubble + seed packet after. 4 phases × 2 bricks on the number pad: metric 4 m 6 cm = 406 cm, 2 kg 300 g = 2,300 g · customary 3 gal 1 qt = 13 qt, 3 ft 10 in + 1 ft 6 in = 5 ft 4 in · time 4 h 5 min = 245 min, 7/10 h = 42 min · today 3 5/12 ft = 3 ft 5 in, 4 3/16 lb = 67 oz. Each stamp shows the Smudge's wrong amount; a wrong answer gets a Crew hint and the same brick again (no damage, no timer). Defeat sets world `golem` (= PQ_LESSON.boss), opens the road south, one Smudge line ("You haven't seen the last of me"), PQM.progress() records the boss for My Math Map.

## Kit changes
- New `OAOKit.splitter` (Mixed-Number Splitter): `split` mode (tag on a bond, + 1 whole bars, cut the last bar, take parts, sequential `asks`) and `group` mode (mark off whole units from a tape, leftover over the rate on one more bar, mixed-number form, Parts-of buttons, simplest form; `startWholes` for two-unit form). Demo + kit test. CSS in pq.css.
- pq-art items: pumpkin, handle, stampface, ink, seeds (additive). voices.json `_cast` goldie → secondary_woman.
- 10.01–10.06 rebuilt; all checks, smoke and play-throughs pass.

## Independent solve (2 Nov) — fixed
Mis-wired mistake (76 → 88 for 5 lb 8 oz) · "half a pound is 8 oz" (IP fact) reworded · Conversion Chart "1 gal = 4 qt = 16 c" trimmed (summative) · hints that solved SWYK 1a/3a and a non-simplest 3/12 replaced (5 7/12 ft, 4 h 24 min, 2 7/12 h) · J6 bar + mixed box now appear only after the step before · "factor" and "two-unit form" removed · J1 question "small units", Mental Math tip, one jargon hint.

## Voices
New lines for Opti (11; 3 generic Crew clips copied from 10.06), Atlas 7, Felix 32 (two takes), Hazel 5, Cora 19, the Smudge 2, Goldie 11. 10.06: Cora + 2 Felix gate lines re-voiced. Flow "G4 Math 4.10.07 voices"; takes + sample reel in `3-5 Math OAO/voice-10-07`.

## Videos
think (cards) · learn (bond board, two-ways board, live `?board=split`, 168 words incl. 6 moves) · do (3 7/12 ft both ways; 2 5/16 lb = 37 oz "your turn first"; 39 oz = 2 7/16 lb; mistake "4 5/6 ft = 4 ft 58 in") · wrap (Level 10 clear).
