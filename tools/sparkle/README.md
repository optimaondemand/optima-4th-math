# Pixel Quest · the G4 math sparkle kit

Read this at the start of every lesson run. The skill is `g4-math-sparkle-lesson`.

## Files

| Where | What | Edit? |
|---|---|---|
| `assets/sparkle/pq-art.js` | pixel art: characters, tiles, objects, gear | shared: a change touches every lesson |
| `assets/sparkle/pq-engine.js` | the game (map, walking, dialog, quests, number pad, glow + arrow guidance, "all quests here done" card) | shared |
| `assets/sparkle/oao-kit.js` | the math models (Disc Mat, Two-Unit Mat, **Trade Mat**, Bar Strip, Stamp Signs, Story Bar Model, Number Bond, Mental Math, Bonus Quest) | shared |
| `assets/sparkle/pq-layer.js` | the page layer: real-problem board, coins/XP/rank, tips, clean top, Game/Clean switch, question drawer, video slots, My Math Map progress | shared |
| `assets/sparkle/pq-intro.js` | the cinematic opening: an 8-bit curtain that draws the lesson's math, lands a title card + today's puzzle, then dissolves into the page (once per session, skippable, Replay button, still picture under reduced motion) | shared |
| `assets/sparkle/pq-music.js` | 10 original study-music loops (WebAudio, no files, no licensing) | shared |
| `assets/sparkle/pq.css` | every style above | shared |
| `assets/sparkle/lessons/lesson-4-UU-LL.js` | **built**: PQ_VIDEO + PQ_DATA + PQ_LESSON | never by hand |
| `assets/sparkle/map-data.js` | **built** by `build_map.py`: the levels My Math Map lists | never by hand |
| `tools/sparkle/lessons/UU-LL/` | one lesson's source: `original.html`, `make.py`, `lesson.js`, `video.json`, `play.js`, `notes.md` | yes |
| `my-math-map.html` | progress map + Level Clear and Master Wayfinder certificates | shared |
| `parent-guide-unit-<U>.html` | the unit family guide (model: Unit 10) | per unit |
| `data/videos/lesson-UU-LL.json` | **built**: the plan the Video Studio reads | never by hand |
| `tools/sparkle/kit-demo.html` | every kit tool with sample settings | add a demo for every new tool |
| `tools/sparkle/studio/` | `video_shotlist_math.py` + `add_math_to_studio.py` (installed in optima-4th-ela) | |

## Commands (run from the repo root)

```
python3 tools/sparkle/build_lesson.py 10-01      # rebuild the page from original.html + make.py (+ the data file)
python3 tools/sparkle/check_lesson.py 10-01      # math, IP overlap, jargon, answer boxes, videos, wiring: must be 0 FAIL
node    tools/sparkle/test/smoke.js 10-01        # tabs, drawer, slots, clean mode, 1150 + 390 px screenshots → tools/sparkle/out/10-01/
node    tools/sparkle/lessons/10-01/play.js      # this lesson's full play-through (every job, quest, model, tap and drag)
node    tools/sparkle/test/intro.js 10-01        # the cinematic opening: frames at 1150 + 390 px, closes, skips, plays once, Replay, reduced motion
node    tools/sparkle/test/kit.js                # every kit tool (run after any change to oao-kit.js)
node    tools/sparkle/test/map.js                # My Math Map + certificates
python3 tools/sparkle/build_map.py               # after a lesson is sparkled (marks it on the map)
python3 tools/sparkle/unit_check.py page.html    # the math scan alone (also takes video.json files); reads 2 m 120 cm as 320 cm,
                                                 # but skips sums that start mid-amount (1 m 70 cm + 30 cm = 2 m): check those by hand
```

`build_lesson.py` saves `original.html` the first time and rebuilds from it every time, so a rebuild is always safe.
It writes the page, the lesson data file and the studio plan, and stamps every link with `?v=` (a hash of the files).

## A lesson's `make.py`

Runs with `s` = the original HTML. Helpers (each asserts its anchor appears exactly once):
`rep(a, b)`, `ins_before(marker, html)`, `ins_after(marker, html)`, `block(start)`, `replace_block(start, new)`,
`remove_block(start)`, `sub(pattern, repl)`, `block_end(s, i)`, `answer_boxes_save()`.
HTML builders: `game('quest')`, `video('think'|'learn'|'do'|'wrap')`, `tip('who', 'text')`, `model('name')`, `BOARD`, `TOWN`,
`problem(n, title, parts_html)`, `part('Problem 1 (a)', html)`, `box('1a', 'aria label', 'cm')`.
Start from the newest lesson's `make.py`; keep its section order (clean top → board + Think → Warm-Up → Learn → Show What You Know).

## `lesson.js`

```
var PQ_DATA = (function(){ … return D; })();   // the game
var PQ_LESSON = (function(){ … return {…}; })(); // the page
```

**PQ_DATA (game)**: `key` (`g4-4-UU-LL-pq`), `levelLabel`, `map` (32×22 tile rows), `speakers`, `npcs` (`{id,x,y,look|owl|smudge,show(S)}`),
`items`, `labels` (names the guide arrow uses), `objects` (`O({id, make(A)})`), `quests.<id>` (`title`, `spawn`, `teaser`, `doneText`,
`goal(S)`, `markers(S)`, `start`, `transcript`, `next:{tab, sel, label}` = where the "all quests here done" button sends students,
`locked(S)` for quests that wait on a page job), `talk(id, api)`, `afterQuest(q, api)`.
Quest ids must match the page's `game('…')` windows. 3–5 windows per lesson.

**PQ_LESSON (page)**:
`id` ('4.10.01'), `key` ('g4-4-10-01', prefix for saved model state), `title`, `unit`, `level` (level name), `standard` (the bubble),
`boss` (world flag set when the boss is beaten, last lesson before the summative only),
`problem:{title, text, jobWord, jobsTitle}`, `jobs:[{id, t, w, go (selector), tab, coins}]` (4–5 jobs = the page activities),
`intro:{kicker, ask, alt, len, scene(g,t)}` → the cinematic opening (see the top of `pq-intro.js` for the drawing kit `g`). It DRAWS the lesson's own model with the place-value colors (the same pieces students meet on the page), about 7 s. **Pictures and counters only** (Bethany: no sentences, no title card): use `card:false`; live counters on the model and a walking character are the good parts. Keep ONE unit on the counter (no switching cm → m cm) and no tiny 1-unit pieces (use one chunk, e.g. a 5 cm piece). Lay things out the way the story does (planks END TO END): pull the camera back to fit instead of stacking. End on the Think puzzle as a picture (e.g. a character with a "?"); never show its answer. `alt` says in words what the animation shows. Model: 10-01 `introScene`.
`bigIdea` → the one big-idea sentence (the main action, not a fact) shown in the yellow `op-big` box of "The Whole Lesson in One Picture" (end of Learn, `id="mk-onepic"`, followed by the `journal-big` "Put the big idea in your own words" box); the layer also puts it at the top of the gathered/downloaded journal.
`scene(api)` → SVG of the problem's place that changes as jobs finish (optional), `intendedWrong:['2 L = 200 mL', …]`
(story mistakes on purpose, so the math check doesn't fail them), `models:{name: bind(fn)}`.

**Helpers students can choose** (the social studies set, in every lesson):
- `hints:[{sel, i, text, inside, rungs:[3]}]` → a "💡 Need a hint?" button after (or `inside`) the element; each tap shows the
  next rung: 1 a nudge, 2 the fact or picture they need *right there* (never "go back"), 3 a start with **different numbers**
  (never the problem's or the IP's). One ladder per Show What You Know problem + one on the Think problem.
- `writing:{'<textarea id>': {min, chips:[{label, words:[…]}]}}` → a live "📝 6 of 10 words" counter + "Your answer needs" chips
  that light as the student writes. Write **wide** word lists (synonyms, numbers with and without commas, plain kid phrasing);
  test 2 natural answers (should light every chip) and "idk" (lights none). Never a hidden requirement or a lock.
- `words:[{w, d}]` → the first time a word appears in the tabs it becomes **word (meaning)** in the sentence; the journal
  lists them under "Words I learned today". 3–6 words a lesson, the ones a 4th grader won't know.
A model gets `(mount, api)`; `api` = `earn(key, coins, xp, el, label)`, `setJob(id, el)`, `jobDone(id)`, `state()`, `save()`,
`fmt`, `ls`, `lsSet`, `clean()`, `renderBoard()`, `key('x')`.

## Kit tools (see `kit-demo.html` for working settings)

| Tool | Use it for | Notes |
|---|---|---|
| `OAOKit.discMat(el, cfg)` | place value, regrouping, converting with 10/100/1,000, subtracting across units | `places`, `start`, `tray`, `zone {kind:'convert'|'away'}`, `steps[{text, done(st, api)}]`, `perRow`, `noRemove` |
| `OAOKit.unitMat(el, cfg)` | **two-unit amounts** (1 m 65 cm, 2 L 750 mL): build, add copies, trade 10 small for 1 bigger, regroup | a Disc Mat with `big` (100 or 1,000), `bigUnit`, `smallUnit`, `names`, `short`, `discLabel`, `adds[{label, of, when, notYet, said}]`, `lead(api)`; the symbol line shows `3 m 195 cm` and warns until it's regrouped. Powers of 10 only: for 12/16/60 use Bar Strip |
| `OAOKit.tradeMat(el, cfg)` | **add and subtract with a trade that isn't a power of ten** (12 in = 1 ft, 16 oz = 1 lb): build, trade `rate` small discs for 1 big, break 1 big into `rate` small, take an amount away into a box | `rate`, `big:{unit,name:[one,many]}`, `small:{…}`, `start`, `tray`, `zone:{title, btn, want:{big,small}, over}`, `steps[{text, done(st, api)}]` (`st` = `{b, s, zb, zs}`), `sym(api)`, `noBreak`, `noAdd`. Discs count units (not to scale): use it for the arithmetic, the Bar Strip for lengths you compare by eye. A rate of 60 makes too many discs: time gets its own tool |
| `OAOKit.barStrip(el, cfg)` | "how many small fit in one big", fractions of a whole, fair compare on one scale | `rounds` or compare `rows`; pieces always to scale; `hideTarget:true` on any row whose target IS the question's answer ("how many pieces fill it?", a fair compare); on phones only the major ticks show |
| `OAOKit.stamps(el, cfg)` | match a factor/fact to a picture (warm-up sorts) | `signs[{id, stall, q, ans, svg}]`, `stamps`, `miss(sign)` |
| `OAOKit.barModel(el, cfg)` | **every word problem**: students place each story fact on the bar, find the ?, answer | `kind:'part-whole'|'compare'`, `story` (facts with `put`), `parts`/`bars`/`diff`, `answer`, `mistakes[{value, text}]`, `sym` |
| `OAOKit.numberBond(el, cfg)` | part-whole facts, splitting for mental math | `rounds[{whole, parts:[a,b], hide:'whole'|0|1, note}]` |
| `OAOKit.mentalMath(el, cfg)` | the Warm-Up strategy (one strategy, 4–6 problems) | `name`, `how`, `example{q, bond, steps}`, `problems[{q, a, hint, lead, post}]` (`lead:'1 m', post:'cm'` → 60 cm + 55 cm = 1 m [__] cm) |
| `OAOKit.challenge(el, cfg)` | the optional Bonus quest (the teacher's guide "Extend") | `title`, `text`, `answer`, `unit`, `hint`, `explain` |

Design rules for every model: plain pieces, always to scale, labels on the model, one line of directions, live number sentence,
drag AND tap, fixed place-value colors (1,000 violet · 100 blue · 10 green · 1 orange), gentle hints that point where to look,
nothing moves under reduced motion. A new tool goes in `oao-kit.js` (+ styles in `pq.css`), gets a demo in `kit-demo.html`
and a check in `test/kit.js`, and every sparkled lesson is re-checked.

## Video plan (`video.json`)

`lesson`, `grade`, `prefix` (`g4math-UU-LL`), `manifestKey`, `title`, `welcomeSlot` (the slot the old manifest welcome video may fill), `off` (slots to hide until re-recorded),
`slots.think|learn|do|wrap` = `{label, title, length, want, where, screen (do only), parts:[cards], script}`.
Scripts: under 2 minutes (≤ 230 words; aim 80–160). `[ON SCREEN: Card label]` cues on their own line must match a card's `label`.
Files the studio saves: `assets/video/teacher/<prefix>-<slot>.mp4` (+ `.jpg`, `.vtt`). Slots stay invisible until the file exists; `?review` on the lesson URL shows empty slots with their scripts.

## Saved on the student's device (localStorage)

`oao.pq.avatar` · `oao.pq.wallet` (coins, XP, gear; earned keys are `<lesson id>:<thing>`) · `oao.pq.progress` (My Math Map) ·
`oao.pq.mute` · `oao.pq.clean` · `oao.pq.music` · `oao.pq.year` · `oao.pq.certname` · `g4-4-UU-LL-pq` (the lesson's world) ·
`g4-4-UU-LL-*` (each model). Lessons and My Math Map share these only because they live on the same site.

## Video boards (math teacher videos)

The Learn and Do videos teach on **boards**: pictures that fill the video in the Video Studio, with Bethany in a corner bubble,
drawn on with the studio pen (ink stays until she switches boards). Each board is a part in `video.json` with
`"kind":"board"`, a `pic` name and a `board` spec; `node tools/sparkle/boards.js <UU-LL>` draws them into
`assets/video/boards/<UU-LL>/` (1600×900, bottom-right corner left empty for the camera). Types: `problem` (big problem +
an empty bar model, two-unit chart, number bond or "two ways" side by side), `mistake` (a wrong answer to circle and fix),
`page` (a clean capture of the page's own model, built with real `clicks`). Scripts cue a board with
`[ON SCREEN: Board: …]` and say what to draw with `[DRAW: …]` right after (shown in green in the prompter, not counted as
spoken words). `build_lesson.py` hands the boards to the studio shot list; the studio loads each one from the math site.

**Live boards.** When moving the pieces is the teaching (discs on the mat, trades), use a live board instead of a picture:
a part with `"kind":"live"` and `"model":"<data-mk-model name>"` (e.g. `counter`). In the studio it opens the lesson page in
board mode (`<page>.html?board=<model>`: only that model, zoomed to fit, nothing saved to the student's progress) in a panel
beside the video. Chrome asks once to share the tab (pick this tab → Share); only the panel goes in the video, full screen
behind Bethany. Script it with `[ON SCREEN: Live: …]` and say what to move with `[DO: …]` (🖐 in the prompter, not spoken).
Every board has a pen bar under the video: ✏️ Pen, colors, Undo, Clear, Board off (D still toggles the pen).

## Two writing moments every lesson keeps (Dimensions discussion, Bethany 29 Oct 2026)

- **Notice / wonder** on the Think problem, before the model: one `journal-notice` box ("What do you notice about …? What do you wonder?",
  placeholder "I notice… I wonder…", `min:6`, two chips: I notice / I wonder). No right answer; it earns the writing XP like any box.
- **Compare your way** right after the Math Crew card: a `journal-compare` box ("Which Crew way is most like yours? Which way would you
  use for a bigger number, like 150 in, and why?", `min:12`, chips: a Crew member's way · what you would do for the bigger number · why).
  This is where students answer the card's "Which way would you pick?" instead of just reading it.
- A kit model inside a job gets `todo:[]` (Story Bar Model) so the job's own **What to do** is the only list.

## Every job: a goal, steps and hints

Every job, on every tab (Learn and Show What You Know), opens with `job(story, steps)` in `make.py`: a **Your job** box (the story and the question it answers) and a
**What to do** list, then the tip and the model. Each job also gets a 3-rung hint ladder in `PQ_LESSON.hints` (where to start →
the trade or step students miss → the same idea with different numbers). Add new hints at the END of the list (`play.js`
counts them by position). Unit labels are never uppercased (mL, cm).

## Math Crew talk in the game (readiness)

In `lesson.js`, the Crew has two sets of lines. `HELLO` (they introduce themselves and talk about today's place, no math) plays
until the page teaches their methods. `IDLE` (each Crew member's method) unlocks after `CREW_TAUGHT`, the Learn job that teaches
it (4.10.01: `'j2'`, Build the Counter). `check_lesson.py` fails a lesson that has `IDLE` without `HELLO` and `CREW_TAUGHT`.
Opti never says "Hoo" in a clip: write "Hoo!" in his line and the game plays a soft 8-bit hoot (`Snd.hoot`) before the clip
(`voice.py` strips it from the script). `voice.py` also respells names the voices misread (`SAY`: Liter Well → Leeter Well), and
`build_lesson.py` tags every clip link with `?v=<hash>` so a re-recorded clip is never served from the browser cache.
Add a single new voiced line without re-recording everyone: `python3 tools/sparkle/voice/voice.py one 10-01 atlas "Hi, I'm Atlas" take.mp3`.

## Character voices (`tools/sparkle/voice/`)

Only the year-long cast is voiced (Opti, Atlas, Felix, Hazel, Cora, the Smudge) plus a level's key characters (Level 10: Amy, Mo).
Everyone else, and the student, keeps the sprite garble. Voice ids live in `voice/voices.json` (shared by every lesson).
Key level characters share two secondary voices: `secondary_man` (Matt) and `secondary_woman` (Caroline). Map each one in `_cast`
in `voices.json` (for example `"mo": "secondary_man"`); never give a level character its own voice id.
Voices are animated ElevenLabs voices generated with `eleven_v4`: write each character's lines with emotion tags (`[excited]`, `[gasps]`) and `[long pause]` between lines (about 1–2 s, enough for `split`). `_fx` in `voices.json` can add a sound effect per character; it is off (Bethany found the 8-bit sound tinny).

```
python3 tools/sparkle/voice/voice.py lines 10-01                 # writes lessons/10-01/voice-lines.json: one prompt per character
#   generate each prompt in ElevenLabs (eleven_multilingual_v2, the <break time="1.5s" /> tags split the lines), download the takes
python3 tools/sparkle/voice/voice.py split 10-01 opti take.mp3   # cuts on the longest pauses, levels, writes assets/audio/lessons/10-01/ + voice.json
python3 tools/sparkle/build_lesson.py 10-01                      # adds PQ_DATA.voice to the lesson data file
```
A clip plays when its line matches the text in `lesson.js` exactly (FNV-1a key of who|line). Reword a line and it goes back to
the garble until it is re-voiced. Units are spoken in full ("1 meter 65 centimeters"), and {name} is read as "explorer".
