# Math Manipulatives Library (Pre-K to Grade 5)

Open `index.html` on GitHub Pages. Teachers hand students an open, on-screen manipulative as a link, a QR code, a Canvas embed or on the big screen. Every item in the Dimensions Math classroom kits for Pre-K, K and Grades 1–5 is here, plus the book models (bar model, number bond, number line, decimal grid). Grade 3–5 OAO lessons are tagged with the tools that fit them.

## Files

- `index.html`: the library. Hero with lesson lookup, then tabs: All tools · By lesson (Gr 3–5) · My setups (saved setups + problem-set builder) · Number talks · Games · Puzzles · Fact check · Hands-on kit list · How to use this. A folded "How to use it with students" section sits under the tabs.
- `tool.html`: runs one tool (`?t=discs`) or every tool tagged for a lesson as tabs (`?lesson=4.06.02`).
  - `&st=1` student link (added to every shared link): no way back to the library, **Turn in my work** instead of Share, no teacher items.
  - `&embed=1` for Canvas iframes (how-to box folded, Full screen button).
  - `&board=1` big screen (dark mode, full screen, setup behind Set up).
  - `&plain=1` no how-to box; `&lang=es` Spanish how-to steps and directions.
  - `#s=` the setup/state. Plain base64url JSON, or `~`-prefixed when compressed (long states: pen ink, whiteboard, sets). Old links keep working.
- `core.js`, `lib.css`: the shared runner. Tool API, share box (student link, big-screen link, Canvas embed with directions, QR, "say it first", Spanish), Turn in my work, Picture (clean PNG/JPEG), Save setup, undo/redo, pen, Surprise me, Flash it, Read to me, hide totals, quick setups / More options, print, the More ▾ menu, offline registration.
  - Shared helpers every tool uses: `O.tap`, `O.keys` (arrow-key sliders with spoken values), `O.dragTap`, `O.ghostDrag`, `O.lasso`, `O.rootDrag`, `O.hit` (≥44 px touch areas). `api.redraw()` keeps keyboard focus on the same piece (`data-k`). `api.onResize` / `api.onCleanup` are owned by core, so nothing leaks between mounts. `api.teacherOnly(field)` hides a setup field that holds an answer on student links.
- `tools/discs.js`, `number.js`, `fraction-measure.js`, `geometry.js`, `trade.js`, `early.js`: the 39 tools.
- `data.js`: the tool catalog (kit item, at-home stand-in, student `HOW` steps and Spanish `HOW_ES`), lesson tags for all 275 Grade 3–5 lessons, `CONFIG` (the only setup keys a tag may set), teacher `QUESTIONS`, and `SURPRISE` generators. This is the only file to edit when you add or change tags.
- `set.html`: problem sets (`?x=<enc([{t,s,n}])>`), Back/Next, state kept per problem, one Turn in for the whole set.
- `duo.html`: two tools side by side (`?a=&b=`).
- `fluency.html` + `fluency.js`: Fact check. Timer optional; "fast" = 3 s plus 0.4 s per extra digit; strategy hints; self-reported score card and read-only score link `?r=`.
- `talks.js`: 84 number talks (Pre-K–2 and Gr 3–5: dot talks, fraction talks, unit chats, same and different, counterexamples, broken calculator, choral counting, guess my number, strings) with teacher notes.
- `games.js` + `games.html`: 24 games that run on the tools (Nim, Pig, Fill the Stairs, Blockout, Fraction War, Close to 1…), each a rules card with the tool under it; `?g=<id>`, `&st=1`, `&print=1`.
- `puzzles.js` + `puzzle.html`: 38 puzzles with two written hints each; teacher view has Fill one box and the answer key; `&print=1` worksheets and party packs.
- `lesson-tools.js`: one line in a lesson page (`<script src="manipulatives/lesson-tools.js" defer></script>`) adds a "Math tools for this lesson" bar above the footer, read from the tags. Every Grade 4 lesson page has it.
- `sw.js`: offline support (network first, cache fallback).
- `vendor/qrcode.js`: QR code generator (MIT, Kazuhiko Arase).

## The 39 tools

Place value: discs, pvcards, blocks. Models: bond, bar, numberline. Operations: counters, hundred, dice. Fractions and decimals: fbars, fcircles, decgrid, money. Measurement: ruler, scale, beaker, clock, trademat, barstrip, bucket. Geometry: tiles, geoboard, whiteboard, tangram, pattern, protractor, setsquare, compass, cubes, attrblocks, solids. Counting and early number: tenframe, bears, linkcubes, dotcards, dominoes, sticks, cuisenaire, beads.

## Making a preset

1. Open the tool and set it up.
2. Tap Share and copy the student link. The part after `#s=` is the setup.
3. To store a setup in a lesson tag, write the same settings as a plain object in `data.js`. Only keys listed in `CONFIG` are kept.

Lesson links for Grade 3 and Grade 5 point to `optimaondemand.github.io/optima-3rd-math/` and `.../optima-5th-math/`. Change `base` in `data.js` if those sites move.

## How it's meant to be used

These are **open manipulatives**: a way to hand students a tool outside a Canvas assignment, or to drop one onto a Canvas page. A tool opens clean and works for any problem. Lesson tags only say which tools fit a lesson and set them up sensibly (places, units, fraction rows); they never set a problem, a goal or a starting amount. Teachers can still set a tool up their own way and share that link.

## Model rules (from the sparkle work, Oct 2026)

- **Hands on:** every operation is done by dragging the pieces (add, trade, break, take away, stretch, pour, swing). Buttons and keys are the keyboard path, and every drag has one.
- **Models:** plain pieces, to scale, labels on the model, fixed place-value colors (1,000 violet, 100 blue, 10 green, 1 orange; navy text on orange and gold), a live number sentence, motion you can see when a trade happens (none under reduced motion), stacked fractions only, no letter variables in student text.
- **Student links:** no names, no way back to the library, nothing teacher-only. Hide totals, once set by the teacher, stays hidden (students get Check my answer).
- **Student text:** short, plain, grade-level, never machine-sounding. Pre-K–2 tools get the 🔊 button that reads the directions line and the total.

## Testing

Playwright: serve the folder over http (`python3 -m http.server`), abort font requests (`context.route(/fonts\./, r => r.abort())`) or pages hang offline. The Nov 2026 audit sweep (every tool × teacher/student/embed/board/dark × 1280/390, lesson bundles, flows, axe-core, keyboard walks) is the bar: no page errors, no sideways scroll, every stage piece reachable by Tab with focus kept after Enter.

## Workflow

Commit locally; push only when Bethany says so.
