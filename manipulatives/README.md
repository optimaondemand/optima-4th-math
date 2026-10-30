# Math Manipulatives Library (Grades 3–5)

Open `index.html` on GitHub Pages. Teachers find a lesson, open its tools already set up, and share a link, a big-screen link, a QR code, or Canvas embed code. The embed code includes the student directions.

## Files

- `index.html`: the library. It has four views: by lesson, all tools, hands-on kit list and teacher guide.
- `tool.html`: runs one tool (`?t=discs`) or every tool for a lesson as tabs (`?lesson=4.06.02`).
  - Add `&board=1` for big-screen mode.
  - Add `&embed=1` for Canvas iframes.
- `core.js`, `lib.css`: the shared runner. It handles setup links (`#s=`), the share box, QR codes, printing and hide totals.
- `tools/*.js`: the 28 tools (26 kit + book tools, plus the Trade Mat and Bar Strip from the sparkle kit), matched to the Dimensions Math Grade 3, 4 and 5 classroom kits plus the book models.
- `data.js`: the tool catalog and the lesson tags. This is the only file to edit when you add or change tags.
  - Each tool has its kit item, an at-home stand-in and student directions (`HOW`).
  - Each unit (`U['4.06']`) lists its tools.
  - A lesson can add its own entries under `L`.
  - Each entry is `T(toolId, setup, 'Idea for this lesson (teacher-facing)', 'Teacher tip')`. Only setup keys listed in `CONFIG` are kept.
- `vendor/qrcode.js`: QR code generator (MIT, Kazuhiko Arase).

## Making a preset

1. Open the tool and set it up.
2. Tap Share and copy the student link.
3. The part after `#s=` is the setup.

To store a setup in a lesson tag, write the same settings as a plain object in `data.js`. The examples in `data.js` show the keys each tool uses.

Lesson links for Grade 3 and Grade 5 point to `optimaondemand.github.io/optima-3rd-math/` and `.../optima-5th-math/`. Change `base` in `data.js` if those sites move.

## How it's meant to be used

These are **open manipulatives**: a way to hand students a tool outside a Canvas assignment, or to drop one onto a Canvas page. A tool opens clean and works for any problem. Lesson tags only say which tools fit a lesson and set them up sensibly (places, units, fraction rows); they never set a problem, a goal or a starting amount. Teachers can still set a tool up their own way and share that link.

## Model rules (from the sparkle work, Oct 2026)

- **Hands on:** every operation is done by dragging the pieces (add, trade, break, take away, stretch, pour, swing). Buttons are a small keyboard-only path.
- **Models:** plain pieces, to scale, labels on the model, fixed place-value colors, a live number sentence, motion you can see when a trade happens (none under reduced motion), stacked fractions only.
- **Hide totals** is the teacher's choice, saved in a share link.
