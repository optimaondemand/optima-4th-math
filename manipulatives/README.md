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
  - Each entry is `T(toolId, preset, 'Try this for students', 'Teacher tip')`.
- `vendor/qrcode.js`: QR code generator (MIT, Kazuhiko Arase).

## Making a preset

1. Open the tool and set it up.
2. Tap Share and copy the student link.
3. The part after `#s=` is the setup.

To store a setup in a lesson tag, write the same settings as a plain object in `data.js`. The examples in `data.js` show the keys each tool uses.

Lesson links for Grade 3 and Grade 5 point to `optimaondemand.github.io/optima-3rd-math/` and `.../optima-5th-math/`. Change `base` in `data.js` if those sites move.

## Rules from the sparkle work (Oct 2026)

- **Hands on:** every operation is done by dragging the pieces (add, trade, break, take away, stretch, pour, swing). Buttons are a small keyboard-only path.
- **Don't give the answer away:** when a Try this asks a question, the totals start hidden and students tap Check my answer.
- **Goals:** a lesson tag can carry a goal (`T(..., [what to do, answer, [[wrong answer, hint]], report key])`). It shows ✓ when right and a hint that points where to look on a common mistake. The setup panel folds away so students build instead of typing the answer.
- **Models:** plain pieces, to scale, labels on the model, fixed place-value colors, a live number sentence, motion you can see when a trade happens (none under reduced motion), stacked fractions only.
- **One main tool per lesson,** plus up to two to also try.
