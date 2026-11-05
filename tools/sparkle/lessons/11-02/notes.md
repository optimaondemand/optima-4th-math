# 4.11.02 · Area of Rectangles, Part 2 (a missing side) · classical-guide layer (Leonardo, Milan 1495)

Built 5 Nov 2026. Source: Dimensions 4B Ch 11 Lesson 2 via `claude/g4-dm-4b-ch11-notes.md` (Bethany's 2 Nov photos; no new photos needed) + the IP.

## Bethany's choices (5 Nov 2026)
- Layer: classical guide, not Pixel Quest (Unit 11 is the classical unit).
- Think: the storeroom floor (guide-faithful): 7 ft wide, 56 one-foot tiles → 8 ft. The Duke's letter from 11.01 (48 sheets, 4 in wide) became Job 2.
- Main model: **Row Builder** (new `mode:'rows'` on the Area Grid: fixed width, "? " side, + Add a row / − Take away a row, "tiles laid / left", never shows the row count).
- Main video: missing factor + check (5 in × ? = 65 → 13). Script waits for her approval before audio.
- Mental Math: split to divide (blank bonds now work with ÷).
- "Go, but trim": the length-known round folded into Job 4 (convert first), so Job 2 is the Duke's panel only.

## Gap table (guide vs page vs IP)
| | Guide 11-2 | Old page | IP |
|---|---|---|---|
| Skill | missing side = missing factor; area ÷ width | same, via a "fact triangle" + multiple choice | matches the guide |
| Think | tiles cover a floor, width given, add rows of the width | MC 112 ÷ 8 (= IP 1b) | — |
| Mistakes | not converting first; multiplying instead of dividing | none | IP 5 multiplied |
| Model | grid paper, one side fixed | "split the bar into groups" leftover | — |

## IP coverage
| IP | Asks | Hands-on job (new numbers) |
|---|---|---|
| 1 | area ÷ side, same units, both directions | Think (56 ÷ 7), Your Turn (90 ÷ 6), Job 2 (48 ÷ 4) |
| 2 | squares ? × ? = area | Job 3 (64 → 8) |
| 3 | convert first, then divide (ft in; fraction of a ft) | Job 4 (1 ft 2 in, 98 → 7; ¾ ft, 117 → 13) |
| 4 + 6 | same area, two steps | Job 6 (12 × 9 = 108; 108 ÷ 6 = 18) |
| 5 | find and fix (multiplied) | Job 5 (Bernardo 72 × 8 = 576 → 9) |
IP facts kept off every taught spot: 126÷9, 112÷8, 144÷8, 5×5, 7×7, 10×10, 104÷8, ⅔ ft = 8 in, 2 ft = 24 in, 240÷24, 10×6, 60÷4, 60÷12, 96÷8, 96÷6.

## Readiness
Known: area = L × W (4.11.01), ft/in/yd and fractions of a foot (Unit 10), 1-digit division and splitting to divide (Unit 5). Taught here, above first use: rows of the known side (Think/Your Turn), "side × ? = area", missing factor (Measuring Rules). Dropped from the old page: √ (square root), "inverse", "fact triangle".
Note: Job 4 round 1 divides by 14 (two-digit divisor) because IP 3(b) divides by 24; students do it by building/counting rows of 14, not long division.

## Independent solve (subagent) fixes
Square mistake texts reworded; 117 ÷ ¾ mistake removed; lid area clash (Job 4 → a drawer front); "convert" → "change" in the rules; IP-fact leaks removed (7 × 7 hint, 60 ÷ 6 in the Mental Math example and Job 6 hint, 25 in a hint and the Learn script); the Do video's mistake board now states its problem.

## Also this run
- 11.01: the main-video retarget (Your Turn 1 ft 3 in × 4 in, slot title, Learn script) was only in built files; now in its source (`lesson.js`, `make.py`, `video.json`), and a literal `\U0001F512` lock text on the live page is fixed. `play.js` updated to the new numbers.
- `check_lesson.py`: a `"produced": true` slot (the main video) may run to ~2½ min (330 words) and needs no board.
- `cw-engine.js`: object kind `stack` (floor tiles).
- `oao-kit.js`: Area Grid `mode:'rows'` + `areaText`; Mental Math `work:'bond'` with ÷.

## Not done yet
Main video (needs script approval → ElevenLabs Claire + Leonardo → record), Bernardo/Leonardo voices, Unit 11 family guide, studio update.
