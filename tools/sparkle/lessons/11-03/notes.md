# 4.11.03 · Area of Composite Figures · classical-guide layer (Leonardo, Milan 1495)

Built 7 Nov 2026. Source: Dimensions 4B Ch 11 Lesson 3 via `claude/g4-dm-4b-ch11-notes.md` (no new photos needed) + the IP.

## Bethany's choices (7 Nov 2026)
- Think: the Duke's mirror border (promised by the 4.11.02 wrap). Numbers **8 in × 6 in, border 2 in → 12 × 10 = 120, 120 − 48 = 72**. The handoff's 8 × 5 was dropped: its split makes 2 × 5 = 10 (IP 4, rectangle C).
- Main model: **Shape Cutter** (new `OAOKit.shapeCutter`: split / away / border modes). Demo + kit test added.
- Keepsake on the lift: Leonardo's notebook (`kind:'note'`): he really wrote his notes in mirror writing.
- Five jobs (IP 4's three boards folded into Job 3 as round 2).
- Unit 11 family guide: after 11.05.
- IP 3 said "square sandbox" for 3 m × 4 m: Bethany ticked the fix → "rectangular sandbox" (PDF text only, line rewrapped).

## Gap table (guide vs page vs IP)
| | Guide 11-3 | Old page | IP |
|---|---|---|---|
| Skill | borders/paths: whole − inner (M1), split + add (M2) | split + add; subtract once as a picture | both + a path's outer size |
| Think | patio around a pool | multiple choice on a missing side (10 − 6) | — |
| Model | outer rectangle, inner one a different color | bar-splitting leftover + direction buttons | — |
| Leak | — | "Worked Example" = IP 2 word for word (Theo's T-patio) | — |

## IP coverage
| IP | Asks | Hands-on job (new numbers) |
|---|---|---|
| 1 | L: split AND subtract, same total? | Job 2: L 10 × 9 ft, 6 × 4 notch: 36 + 30, 50 + 16, 90 − 24 = 66 |
| 2 | T: two areas, add | Job 3 r1: T 9 × 2 + 3 × 6 = 18 + 18 = 36 |
| 3 | outer − cut-out | Job 4: wall 12 × 9 − door 4 × 7 − window 2 × 2 = 76 |
| 4 | three rectangles, add | Job 3 r2: 4 × 7 + 6 × 7 + 2 × 7 = 84 |
| 5 | path: outer size first, then subtract | Think (72), Your Turn (9 × 4, 1-in frame → 11 × 6 − 36 = 30), Job 5 (Bernardo: 9 × 7, 2-in frame, he wrote 11 × 9; really 13 × 11 − 63 = 80) |
IP facts kept off every taught spot: 7×5, 3×2, 35−6=29 and the L's parts (4×5, 3×3, 7×3, 4×2), 8×3, 4×5, 24+20, 10×6, 3×4, 60−12, 3×5, 2×5, 15+20+10, 13×10, 13+3+3, 10+3+3, 19×16, 304−130.

## Readiness
Known: area = L × W, converting (4.11.01), a missing side by subtracting/dividing (4.11.02), 2-digit × 1-digit and 2-digit × 2-digit (Unit 4). Taught here before use: split and add, whole − missing part, border on both sides (Think → Learn video → Your Turn → rules). Job 5 multiplies 13 × 11 (2-digit × 2-digit, Unit 4).

## Videos (all produced: Claire; Leonardo book-ends the Learn video)
- Think 0:49 · Learn 2:10 (board 9 × 7 with a 4 × 4 window: 63 − 16 = 47; M2 named) · Do 1:36 (L 10 × 8 − 4 × 4 corner split: 40 + 24; tabletop 14 × 8 − 5 × 5 = 87, your turn first; border mistake 6 × 4 with a 2-in border: 8 by 6 ✗ → 10 × 8 − 24 = 56) · Wrap 0:43.
- Sources in `3-5 Math OAO/4.11.03 videos/` (+ `audio/`, ElevenLabs flow "G4 math 4.11.03 Composite Figures").

## Shared files changed this run
- `oao-kit.js`: part 4, `OAOKit.shapeCutter`. `cw.css`: its styles. `cw-engine.js`: object kind `mirror`. `kit-demo.html` + `test/kit.js`: three Shape Cutter demos and checks. README kit table row.
