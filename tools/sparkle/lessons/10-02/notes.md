# 4.10.02 Customary Units of Length · Level 10, the Foot Bridge (lesson 2 of 7)

Built 28 Oct 2026 to the Dimensions 4B Chapter 10 Lesson 2 shape. Guide notes: `claude/g4-dm-4b-ch10-notes.md` (no new photos needed).

- **Gap analysis:** the old page drilled factors (12, 3, 5,280) with multiple choice and never taught regrouping, inches → ft in, or ft → yd ft, which IP 4 needs. It also solved IP problems (5 ft 4 in = 64 in three times, the track lap three times, SWYK 1 = IP 1/2, Felix's 9 ft 3 in − 7 ft 5 in). All gone.
- **Real problem:** the Smudge snapped Gus's rope rail on the Foot Bridge. Jobs: ① Build a Foot (Bar Strip: 12 one-inch pieces; 2 ft = 24 in) · ② Rope Ruler 46 in = 3 ft 10 in (Bar Strip with 12-in + 1-in pieces + Number Bond + ft/in boxes) · ③ Join the Ropes 2 ft 8 in + 1 ft 7 in = 4 ft 3 in ("make the next foot" + Story Bar Model) · ④ Measure the Rail 29 ft = 9 yd 2 ft (Bar Strip with 3-ft yard pieces) · ⑤ Prove the Smudge's banner wrong: 2 ft 15 in (39 in) ≠ 3 ft 5 in (41 in).
- **Think:** Gus's two posts, north 6 ft 5 in vs south tag 79 in (answer: south, by 2 in), any method; bars hide the target. Picked over the guide's height Think so no IP fact (4 ft = 48 in) is solved.
- **Learn:** Crew card (Atlas number bond vs Felix all inches) → Rope Ruler (CREW_TAUGHT = j2) → Join the Ropes → build quest → Foot Bridge Board (yard, mile defined here) → Do video → Study It: 6 ft 2 in − 2 ft 10 in = 3 ft 4 in → Measure the Rail → "Rosa says 3 ft 14 in = 4 ft 2 in".
- **Mental math:** Warm-Up "Make a foot" (7 in + ? = 1 ft, known: making 12 like 10.01's Make 100); Learn "Make the next foot" (after the 12-inch trade is taught).
- **Mistakes met:** trading 10 inches ("treats inches like tens and ones": 10-in scrap, the Smudge's tag 3 ft 15 in = 4 ft 5 in, rope 4 ft 6 in, Think "by 14", Do mistake board 2 ft 13 in = 3 ft 3 in, 80 in = 8 ft in the chase) · yards/feet swapped (2 yd 9 ft hint, chase stop 1).
- **Game (3 windows):** sort (Rosa's scraps into SHORT / 1 FOOT / LONG; after Job 1) · build (Gus, fix the Smudge's tag, tie the rail; after Job 3) · chase (the Smudge across the bridge: 29 ft = 9 yd 2 ft, 80 in = 6 ft 8 in, 3 yd = 9 ft; Eastside opens; a gray brick chip stamped G). Crew HELLO = the bridge and river.
- **Voices:** cast + Gus (secondary_man) + Rosa (secondary_woman). Full takes + 14 re-recorded lines after the independent solve (`voice.py one`). ElevenLabs flow "G4 math 10-02 Foot Bridge voices".
- **Every job (all tabs)** opens with Your job + What to do and has a 3-rung hint ladder (README rule, 28 Oct).
- **Bonus:** rope cutter, 2 yd into 8-in pieces = 9.
- **SWYK:** 7 ft = 84 in · 6 yd = 18 ft · 67 in = 5 ft 7 in · 3 ft 9 in + 2 ft 6 in = 6 ft 3 in · 6 ft 4 in − 2 ft 8 in = 3 ft 8 in · 34 ft = 11 yd 1 ft.
- **Videos:** think (cards), learn (posts chart board, two-ways board, live Rope Ruler `?board=rope`), do (3 ft 7 in + 1 ft 8 in; 4 ft 3 in − 2 ft 7 in; 23 ft = 7 yd 2 ft; mistake 2 ft 13 in), wrap. Old welcome video stays in Think until a new one is recorded.
- **Kit changes:** Bar Strip `hideTarget` (hides "of N" and the dashed target line), `.mk-two .ok-btn` style, pq-art `b` bridge tile + `rope` item, build_lesson.py hashlib fix (failed when a lesson had no voice.json yet).
- **Independent solve (28 Oct):** all keys right; fixed "like centimeters" wording, Rosa's rope naming, the gap piece vs 26-ft rail, a yards line before the Board, "swap" wording, the Learn video bond step, the Wrap "press Play", and IP-adjacent facts (4 ft/5 ft/8 yd, 27 in, 10 in). Left as is: the page's original division fact grid (÷11, ÷12 facts).

## Readiness list (✅ known · 🟡 taught here, above first use)
- ✅ division facts, ×1-digit, ÷ with remainders, regrouping m/cm (10.01), number bonds, skip-counting
- 🟡 12 in = 1 ft — Build a Foot (Warm-Up job 1), before the sort quest, Mental Math and Think
- 🟡 "customary" — defined in the Build a Foot sentence
- 🟡 inches → ft in (count by 12s + bond) — Rope Ruler (Learn job 2); Crew card above shows it first
- 🟡 adding with a 12-inch trade — Make the next foot + Join the Ropes (job 3)
- 🟡 subtracting with a trade — Do video, then Study It
- 🟡 yard (3 ft = 36 in), mile (5,280 ft) — Foot Bridge Board, before Measure the Rail and SWYK
- 🟡 feet → yd ft — Measure the Rail (job 4), before the chase and SWYK 3
- Game: sort needs only 12 in = 1 ft (locked until job 1); Crew method lines unlock at j2; build locked until j3; chase locked until j4.

## Revision 29 Oct 2026 (IP alignment + One Picture)
- **IP coverage:** IP 3 (composite → single, yards → feet → inches) had no hands-on job; the page practiced the other direction. Measure the Rail (29 ft = 9 yd 2 ft) became **Rope Order** (Job 4): 2 yd 2 ft 7 in → 6 ft → 8 ft → 96 in → 103 in, Bar Strip with yd/ft/in pieces (hidden target) + a 4-step chain. Feet → yards left the page (not on the IP).
- **Cut from Learn:** the "3 ft 14 in = 4 ft 2 in" writing box, the Board's two-ways paragraph, 2 of the 3 make-the-next-foot problems.
- **One Picture:** big idea "To work with yards, feet and inches, change everything to the same smaller unit: multiply yards by 3 to get feet, multiply feet by 12 to get inches, then add the extra." + yards ×3 feet ×12 inches picture + 3 yd 1 ft 4 in = 124 in + "Put the big idea in your own words" box (`journal-big`). `bigIdea` tops the journal.
- **Follow-on changes:** SWYK 3 = 4 yd 2 ft → 14 ft → 168 in; chase stops 9 yd = 27 ft, 80 in = 6 ft 8 in, 2 ft 6 in = 30 in (mistake moments: ×12 for a yard, 2 ft as 20 in, 80 in as 8 ft); bonus 3 yd into 9-in pieces = 12; Do problem 3 = 3 yd 2 ft 5 in = 137 in; 9 voice lines re-recorded. The yards/feet swapped-remainder moment went away with feet → yards.

## Revision 29 Oct 2026 (review fixes: subtraction job, discussion, giveaways)
- **New Job 4 · Cut the Rope** (Trade Mat, new kit tool `OAOKit.tradeMat`, rate 12): 5 ft 1 in − 2 ft 6 in = 2 ft 7 in, hands-on take-away with a break (IP 4(d)'s shape, which only Study It and the Do video covered before). Two quick ones with the answer in inches (IP 4(a)/(b)'s shape): 1 ft − 5 in = 7 in, 2 ft + 9 in = 33 in. Rope Order is Job 5, the banner is Job 6 (chase unlocks after Job 5).
- **Notice / wonder** box on the Think (`journal-notice`); **compare-your-way** box after the Crew card (`journal-compare`, "which way for 150 in and why").
- **Giveaways closed:** Build a Foot round 1 and both Prove bars hide their targets (the question was the target).
- **Stale text fixed:** objective 3 (yards, feet and inches → inches), Join the Ropes step 1 (one make-the-next-foot problem), Study It subtitle (cut a rope yourself), the bar model's second What-to-do list removed, Essential Question (Which is longer, 6 ft 5 in or 79 in? How can you be sure?), six jobs everywhere.
- **Big idea is two ways** (trade 12 in for 1 ft as you go, or change everything to inches first); journal-big chips match.
- **SWYK 2(c)/(d):** 1 ft − 4 in = 8 in, 3 ft + 2 in = 38 in.
- **Scripts:** Think names six jobs and asks for notice/wonder first; Learn opens with the noticing, adds "pause and say which way is like yours"; Do adds "your turn first" before Problem 2 and points at Cut the Rope. check_lesson counts live-board moves toward the 2-minute cap (8 words each) and allows one spoken line between a board cue and its DRAW.
- **Phones:** Bar Strips hide minor ticks under 520 px.
- Left as is: the Learn video still demonstrates Rosa's 46 in rope on the live Rope Ruler (the same numbers as Job 2) — imitation before independence; the bond pre-fills 36.
