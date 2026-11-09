# G4 Math VR kit (`tools/vr/`) — one weekly VR page (the Commission, with the unit's classical guide)

Goes with the **last teaching lesson of the week** (skill `g4-math-vr-activity`). Ported 9 Nov 2026 from the G3 math
kit (`optima-3rd-math/tools/vr/`); the G3 kits are untouched.

```
python3 check_vr.py weeks/WW/week.json                                   # rules (0 FAIL)
python3 build_vr.py weeks/WW/week.json out/G4-Math-Week-WW-VR-mockup.html
python3 check_vr.py weeks/WW/week.json out/G4-Math-Week-WW-VR-mockup.html   # + reading load per path
node playtest_vr.js out/G4-Math-Week-WW-VR-mockup.html 1150 out/pt       # needs playwright (cloud container)
node playtest_vr.js out/G4-Math-Week-WW-VR-mockup.html 420 out/pt
python3 build_vr.py weeks/WW/week.json ../../vr-WW.html --repo           # live page (assets referenced)
```
playtest prints one line: errors [], steps 7, seal true, help 14/14, gameDone, 4 equation tries (no plus / not true /
wrong parts / right), PDF gate (early, short, open), checks 5/5, stamp, pdf ok, sideways false.

- `engine/vr.css`, `engine/vr.js`: no week words. Repo copies: `assets/vr/vr.css`, `assets/vr/vr.js`;
  `shared/wf-lesson.css` → `assets/vr/base.css`; `shared/optima-logo.png` → `assets/vr/optima-logo.png`;
  `shared/guides/<key>.png` → `assets/vr/guides/<key>.png` (the unit guide's pixel portrait, drawn from cw-art.js).
- `weeks/WW/`: week.json, credits.json, img/<key>.jpg (≤1280 px, q≈62–70), audio/<guide>-<clip>.mp3
  (3 clips only: brief, build, sketchbook; one take each). Repo copies: `assets/vr-WW/`.
- VR path: 7 steps, step 5 (index 4) is the optional VR-only Extra. Turn-in: ONE photo or ONE video (≤30 s).
  The answer is written with Number + sign models.
- Sketchbook Day game type `floor`: tile Part A, tile Part B (tap or drag), then build the equation with tiles
  (accepted: a true equation whose + terms are the two part areas and whose total is the floor). Then the math
  paragraph with live checks (week.json `sketchbook.write.checks`); the PDF stays locked until all are met.
- `pacing-g4.json`: G4 weeks (4 days, CC/SA count) + `pilotException` (week 20 → 4.11.03, Bethany's call).
- `bannedNumbers` + `facts` in week.json: no used fact may be a banned IP/CC/SA/lesson fact.
- Help drawer images: `images/vr-canvas-help-*.jpg` at the repo root (copied from optima-4th-science).
- Pilot: week 20, 4.11.03 VR · The Castle Floor (Medieval Castle (Day), Leonardo).
