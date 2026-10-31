# 4.10.04 Customary Units of Capacity · Level 10, Hilltop Dairy (lesson 4 of 7)

Built 31 Oct 2026 to the Dimensions 4B Chapter 10 Lesson 4 shape and aligned to the IP. Guide notes: `claude/g4-dm-4b-ch10-notes.md` (10-4 row, no new photos). IP: `Grade 4/Independent Practice Drafts/Unit 10/math-lesson-4-10-04-independent-practice.pdf`.

## Bethany's decisions (31 Oct)
- Chain facts: **chain other amounts**. The page teaches the four single steps (printed in the IP directions) and chains amounts like 3 qt → 6 pt → 12 c → 96 fl oz. No from-1 chain (1 pt = 16 fl oz, 1 qt = 4 c, 1 gal = 8 pt = 16 c = 128 fl oz) is built anywhere; the shared Conversion Chart's capacity rows are one step each on this page.
- Problem: rebuild the Gallon-Man. Main model: new **Pour Station** kit tool. Mistakes: fl oz vs oz, wrong step number, multiplying going up. Quests: door · sort · escort · trough (+ crew). Think: two milk cans. Prove: the "3 gal 5 qt" plaque. Bonus: two-pail puzzle. Keeper: Farmer Hank (secondary_man).

## Gap table (guide · old page · IP)
| | Dimensions 10-4 | Old page | IP | Now |
|---|---|---|---|---|
| Skill | c ↔ fl oz, qt ↔ c, qt → gal qt | Pour Lab tower, multiple choice | ladder, chain, both directions, compound ↔ one unit, word problem | IP |
| Methods | multiply down vs group up | one way | — | Felix all quarts (multiply down) vs Atlas gallons and quarts (group up) |
| Mistake | fl oz ≠ oz | not named | — | Cora tip at first use (J1) + sort quest |
| Leftovers | — | solved IP 1–5 (1 gal = 16 c / 128 fl oz, 32 fl oz, 5 gal, 62 qt Worked Example, Maya = EQ, SWYK = IP 1 + 5), "SPLIT the bar", Socratic, Worked Example, Connection Forward, division fluency | — | all gone; fact grid is × ÷ by 2, 4, 8 |
| Guide-only | estimate how full, half gallon | — | — | left out |

## IP coverage
| IP | Direction | Hands-on job (new numbers) |
|---|---|---|
| 1 | single steps | J1 Climb the Ladder: pour fl oz → c, c → pt, pt → qt, qt → gal (Pour Station fill) |
| 2, 3a–c | down, chained | J2 Fill the Cream Bottles: pour 3 qt → 6 pt → 12 c, chain to 96 fl oz; 9 gal = 36 qt |
| 3d, 4a, 4b | up | J3 Bottle the Milk: pour 40 fl oz → 5 c, 28 qt → 7 gal; 18 c → 9 pt |
| 4c | gal qt → qt | J4 Count the Milk Cans: pour 4 gal 2 qt → 18 qt |
| 4d | qt → gal qt with a remainder | J4: pour 27 qt → 6 gal 3 qt (27 ÷ 4 gives 6 R 3) |
| 5 | gal → qt → c → servings | J5 Milk for the Picnic: Story Bar Model 4 gal = 16 qt, chain 32 pt, 64 c → 64 glasses |

## Readiness list (✅ known · 🟡 taught here, above first use)
- ✅ × and ÷ by one digit with remainders (Unit 5), number bonds, weight oz (10.03), two-unit amounts and regrouping (10.01–10.03)
- 🟡 capacity, fluid ounce, cup, pint, quart, gallon — J1 Your job sentence (tooltips)
- 🟡 the four steps — J1 rounds 1–4, before the door quest, Mental Math, Think
- 🟡 fl oz ≠ oz — Cora's tip in J1; sort quest after J2
- 🟡 down = multiply, up = group — Crew card, J2 (down), J3 (up; CREW_TAUGHT = j3)
- 🟡 gal qt ↔ qt with a leftover — Make the next gallon + J4
- 🟡 multi-step down the ladder — Hank's Ladder Board, Do video, Study It (2 gal 3 qt → 22 pt), then J5
- Game: door locked until j1; crew on Learn (not locked); sort after j2; escort after j4; trough after j6.

## Story, game, voices
- Quests: **door** (Opti's previously + gray fuzz → hay → cows; 4 locks: 5 fl oz + 3, 1 pt = 2 c, 1 pt + 1 pt, 1 gal = 4 qt) · **crew** · **sort** (HOLDS vs WEIGHS: cream 12 fl oz, cheese 12 oz, cocoa 8 fl oz, butter 8 oz) · **escort** (Hank's milk wagon: Rosa 9 qt = 18 pt, Baker Lou 12 pt = 6 qt, the school 7 gal 1 qt = 29 qt) · **trough** (6 gal 1 qt = 25 qt; GOLEM PART 1 stamp; one Smudge line).
- Crew HELLO = Hilltop (Atlas: the view, Felix: counting cows, Hazel: wants to draw the Gallon-Man, Cora: every pail has a name). CREW_TAUGHT = 'j3'.
- Voices: cast + Hank (`secondary_man`, added to `_cast`) + one Smudge line. Opti's three generic Crew lines reuse 10-03 clips. Flow "G4 math 10-04 Hilltop Dairy voices"; takes in `3-5 Math OAO/voice-10-04`. All clips 2–3 words/s.
- Statue rebuilds piece by piece with j1–j5 (plaque, body, legs, arms, hands); the trough fills after the quest.

## Kit changes
- **New `OAOKit.pour`** (Pour Station): two containers per round, drawn to scale by height, a tick per small unit; modes fill (endless source into one big), up (group small into big; "Fill a whole …" after one by hand; leftovers stay), down (pour big out into small); optional answer form with mistakes. `.ok-pourrow` added to the drop targets. Demo + kit test.
- pq-art items: bottle, cheese, mug, butter.
- 10.01–10.03 rebuilt (new ?v stamps); checks and play-throughs pass.

## Independent solve (31 Oct) — fixed
Job 6 [8,0] hint reason; Mrs. Mabel's cream clash (game order → Rosa); intro trough 8 qt → 25 qt to match the quest; statue "5 pieces" → 6; quart tooltip (carton of juice → a little less than a liter); fl oz tooltip (tablespoons); escort order 3 used 3 gallons (IP 5a) → 7 gal 1 qt; hint rungs that gave SWYK 1(d) and Can 1's answer; "Exact words: rung" tip; make-the-next-gallon got a story line.
Left: chained facts can be inferred from worked amounts (e.g. 4 gal → 64 c) — accepted by the "chain other amounts" decision; the Learn live board does the job's own cream (imitation first, as in 10.02–10.03); the old welcome video stays in the Think slot.

## Videos
think (cards) · learn (cans gal|qt chart, two ways board, live `?board=cream`) · do (3 pt → 6 c → 48 fl oz; 19 qt = 4 gal 3 qt "your turn first"; 10 gal 3 qt = 43 qt; mistake 24 c ≠ 48 pt) · wrap.
