# 4.11.04 · Perimeter, Part 1 · classical-guide layer (Leonardo, Milan 1495)

Built 27 Nov 2026. Source: Dimensions 4B Ch 11 Lesson 4 via `claude/g4-dm-4b-ch11-notes.md` (no new photos needed) + the IP.
Story promised by the 4.11.03 wrap window and Wrap video: the Duke's garden fence.

## Bethany's choices (27 Nov 2026)
- **Videos: the Learn video only.** Three videos would not fit the 3,800-credit budget. The first voiced window is the
  Warm-Up's media; the wrap window closes the lesson. No Think, Do or Wrap video from this lesson on.
- **Think:** the Duke's garden, **30 ft of fencing, long side 11 ft → 4 ft**. Setting moves outdoors (11.01 workshop,
  11.02 storeroom, 11.03 workshop).
- **Hook:** the gardener's two plans, both using all 30 ft. Prediction: which holds more plants? Payoff after the Think:
  **11 × 4 = 44 sq ft vs 8 × 7 = 56 sq ft** — the same fence, different room inside. This is the guide's Toothpick
  Puzzler, and it inverts 11.01's same-area-different-shape payoff.
- **Main model: the Fence Builder** (new `OAOKit.fenceBuilder`, modes `walk` / `missing` / `free`). Rails laid one unit
  at a time, like the guide's toothpicks.
- **Keepsake:** the Duke's clay horse. Leonardo built the full-size clay model for the bronze monument; it was standing
  in Milan in 1495 and the bronze was taken for cannon, so the statue was never cast. New `horse` art in cw-guide.js.
- **Notation:** taught in words ("add the length and the width, then double it"), with the IP's `2 × (L + W)` and
  `(P − 2L) ÷ 2` shown ONCE in an aside on the rules card, so the practice page isn't a surprise. Chapter notes: no
  order of operations until Grade 5.
- **Mental Math:** double a 2-digit number, blank bonds, 3 problems (the move the quicker way needs).
- **Bonus (optional):** 12 rails, three different gardens (1 × 5, 2 × 4, 3 × 3 → 5, 8 and 9 sq ft).

## Gap table (guide vs old page vs IP)
| | Guide 11-4 | Old page | IP |
|---|---|---|---|
| Skill | perimeter of rectangles; a missing side from the perimeter | the same two, but the missing side only as a solved example | both, plus an area/perimeter mix |
| Think | fence a garden with a set length of fencing, one side given; build it with toothpicks | multiple choice on IP 3(a) | — |
| Methods | M1 take both given lengths away, then halve · M2 half the perimeter = length + width | "the formula" only, never compared | — |
| Model | toothpicks laid end to end | a Perimeter Walker widget that walked for the student | — |
| **Leak** | — | **five of five IP sections solved on the page** (see below) | — |

## The leak the rebuild fixes
| IP | Where the old page solved it |
|---|---|
| 1 (a)(b)(c) 12×6, square 8, 15×7 | the whole Warm-Up, all three, word for word |
| 2 (a) 9×4 | Show What You Know 1 |
| 3 (a) P 40, side 7 → 13 | the Think **and** the Picture It, twice |
| 3 (c) / 5 (a)(b) square P 136 → 34 | the "Worked Example", Theo's dog pen, word for word |

## IP coverage (new numbers, same direction)
| IP | Asks | Hands-on job |
|---|---|---|
| 1 | add all four sides, incl. a square | Job 2 r1 14 × 6 m = 40 · r2 square 5 m = 20 |
| 2 | the shortcut | Job 2 r3 18 × 7 ft: 25 doubled = 50 |
| 3 | missing side from the perimeter | Think (30 ft, 11 → 4) · Your Turn (24 ft, 7 → 5) · Job 3 (30 cm w/ 4 → 11; 150 cm w/ 48 → 27; square 92 → 23) |
| 4 | area and perimeter in one | Job 4 A 17 × 6 ft → 102 sq ft, 46 ft · B 54 sq cm, 9 cm → 6 cm, 30 cm |
| 5 | square from its perimeter, then the same perimeter as a rectangle, compare areas | Job 5 (square from 48 ft → 12, 144 sq ft; 16 ft long → 8, 128 sq ft) · Prove It (20 ft as 8-long and 6-long) |

Every spot has its own numbers; no two spots solve the same problem:
Think 30/11 · video 18 × 6 ft and 52/17 · Your Turn 24/7 · Study It 12 × 9 m · Job 2 14 × 6, square 5, 18 × 7 ·
Job 3 30/4, 150/48, square 92 · Job 4 17 × 6, 54 ÷ 9 · Job 5 48 square, 48 w/ 16 · SWYK 18 × 7, 56/20, square 72 ·
Prove It 20 ft · Bonus 12 rails.

IP facts kept off every taught spot: 12+6+12+6, 4×8, 15+7+15+7, 2×(9+4)=26, 4×7, 2×(20+13), 40−14, 26÷2, 160−90, 70÷2,
136÷4, 12×7, 2×(12+7)=38, 84÷12, 136−80, 56÷2, 40×28, 34×34.

## Readiness
Known before this lesson: area = length × width (4.11.01), a missing side by dividing (4.11.02), doubling and halving a
2-digit number by splitting (Unit 4 and 11.02's Mental Math), 2-digit × 1-digit and 2-digit × 2-digit (Unit 4),
48 ÷ 4 (Unit 5), what perimeter is (Grade 3). Taught here before its first use: adding all four sides (Think → video →
Study It → Job 2), the double-the-half way (video → rules card → Job 2 r3), working backward (Think → video → Your Turn
→ Job 3). Nothing on the page, in a window, in a hint or in a guide answer needs a skill the page has not taught.

## Shared files changed this run
- `oao-kit.js`: part 5, `OAOKit.fenceBuilder` (walk / missing / free).
- `cw.css`: its styles, plus `.cw-aside` (the "written short" note on the rules card).
- `cw-guide.js`: a `horse` keepsake in the decor art.
- `kit-demo.html` + `test/kit.js`: three Fence Builder demos and their checks. README kit table row.

## Audio (budget 3,800; this page 2,739 = 72%)
| Clip | Chars |
|---|---|
| Learn video narration, Claire, 11 takes | 1,195 |
| Learn video book-ends, Leonardo, 2 | 363 |
| Windows, Leonardo, 16 lines | 882 |
| Windows, Bernardo, 5 lines | 299 |

One take on every generation. The video script is 326 words (cap 330).
