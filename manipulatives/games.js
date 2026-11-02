/* OAO Math Manipulatives — Games for two players, a team or the whole class, played on tools already in the library.
   Data: OAOM_GAMES.list. Card: OAOM_GAMES.render(el, game, {teacher, print, toolURL, embed}).
   Each game: {id, title, type, grades, players, minutes, tools, setup, goal, rules, win, variations, notes, src}
     grades: -1 = Pre-K, 0 = K.   players: '2' (two players), 'team' (small group), 'class' (whole class).
     tools: tool ids, the first one opens first.   setup: {toolId: state} for the tools that need a set-up, or null.
     rules: 4–7 short numbered steps.   notes: {purpose, watch, questions[]} (teacher only, never on student links).
     Fractions in any student text are written [1/2] and drawn stacked.   src: where the idea comes from. */
window.OAOM_GAMES = (function () {
  'use strict';
  var L = [];
  function G(o) { L.push(o); }
  var MFL = 'inspired by Math for Love';
  var D1 = { mode: 'dice', k: 1, sides: 6 }, D2 = { mode: 'dice', k: 2, sides: 6 }, T1 = { mode: 'dice', k: 1, sides: 10 }, T2 = { mode: 'dice', k: 2, sides: 10 };
  var WB = { bg: 'grid', col: 0, w: 4, tool: 'pen', st: [] };

  /* ───── Counting and number ───── */
  G({ id: 'nim-10', title: '1-2 Nim on a ten frame', type: 'Counting and number', grades: [0, 1, 2], players: '2', minutes: 5, tools: ['tenframe'],
    setup: { tenframe: { m: 'one', c: [] } },
    goal: 'Be the one who puts the 10th counter in the frame.',
    rules: ['Start with an empty ten frame.', 'On your turn, drag 1 or 2 counters into the frame.', 'Then it is the other player’s turn.', 'Keep going until the frame is full.', 'The player who fills the last box wins.'],
    win: 'You win when your counter fills the frame.',
    variations: ['Play it backwards: the player who fills the last box loses.', '1-2-3 Nim: use the double ten frame (20 boxes) and put in 1, 2 or 3 counters.', 'Find the trick: is there a number of empty boxes you always want to leave?'],
    notes: { purpose: 'Counting on, seeing how many more make 10, and planning ahead. With 10 boxes and moves of 1 or 2, the player who leaves a multiple of 3 empty boxes (9, 6, 3) can always win.', watch: 'Players who put in counters without counting the empty boxes. Ask them to say how many boxes are left before every move.', questions: ['How many empty boxes are left?', 'If you put in 2, how many will be left for me?', 'Is there a number of empty boxes you never want to leave?', 'Does it matter who goes first?'] },
    src: MFL });
  G({ id: 'dot-war', title: 'Dot card war', type: 'Counting and number', grades: [-1, 0, 1], players: '2', minutes: 10, tools: ['dotcards'],
    setup: { dotcards: { k: 'd10', n: 5, fl: 0, _r: 0 } },
    goal: 'Say how many dots you see. The bigger number wins the round.',
    rules: ['Player 1 taps Next card and says the number of dots.', 'Player 2 taps Next card and says the number of dots.', 'Which number is bigger? That player gets a point.', 'If the numbers are the same, nobody gets a point.', 'Play 10 rounds.'],
    win: 'The player with more points after 10 rounds wins.',
    variations: ['Match the dots: one player shows a card, the other shows the same number on their fingers.', 'Turn on Flash so the card hides after 2 seconds. Say the number from memory.', 'Use the Dots to 5 cards for younger players, or ten-frame cards to practice 5 and some more.'],
    notes: { purpose: 'Subitizing: seeing a small amount without counting one by one, and comparing two numbers.', watch: 'Players who count every dot by touching the screen. Turn on Flash so they have to see the dots in groups.', questions: ['How did you see it so fast?', 'Did you see it in parts? Which parts?', 'Which card had more? How many more?'] },
    src: MFL });
  G({ id: 'handfuls', title: 'Handfuls', type: 'Counting and number', grades: [-1, 0, 1], players: '2', minutes: 10, tools: ['linkcubes'],
    setup: { linkcubes: { m: 'train', t: [], meas: 0, _r: 0 } },
    goal: 'Guess how many cubes, then count to check.',
    rules: ['Player 1 says a guess: “I think I can grab 7.”', 'Player 1 taps cubes from the tray for 3 seconds while Player 2 counts “1 banana, 2 banana, 3 banana.” Stop!', 'Count the cubes in the train together.', 'Was the guess too high, too low, or just right?', 'Tap Clear. Now Player 2 guesses and grabs.'],
    win: 'Nobody wins. The fun is getting closer with every guess.',
    variations: ['Make it a race: whoever is closer to their guess gets a point.', 'Snap the train into groups of 5 before you count. Is it faster?', 'With real cubes: grab a real handful, guess, then build the same train on the screen.'],
    notes: { purpose: 'Estimating, counting with one-to-one correspondence, and comparing a guess to a count.', watch: 'Players who skip numbers or count a cube twice. Have them drag the cubes into one straight train before counting.', questions: ['Was your guess close?', 'How did you count? Can you count by 2s?', 'How many more would make 10?'] },
    src: MFL });
  G({ id: 'back-forth', title: 'Back and forth to 10', type: 'Counting and number', grades: [0, 1, 2], players: '2', minutes: 10, tools: ['numberline', 'dice'],
    setup: { numberline: { a: 0, b: 10, parts: 10, mode: 'whole', lab: 'all', simp: 0, two: 0, parts2: 8, hop: 0, dots: ['0:5'], hops: [] }, dice: D1 },
    goal: 'Push the dot to your end of the line.',
    rules: ['The dot starts on 5. Player 1 wants it on 10. Player 2 wants it on 0.', 'Roll the die.', 'Drag the dot that many marks toward your end.', 'Take turns rolling and dragging.', 'If your roll goes past your end, that counts. You win.'],
    win: 'The first player to get the dot to their end wins.',
    variations: ['Back and forth to 20: set the line to 0 to 20 and roll two dice. Add them, then move.', 'Must be exact: a roll that goes past the end is a lost turn.', 'Say where the dot will land before you drag it.'],
    notes: { purpose: 'Counting on and counting back, and seeing a number line as a track with 0 at one end and 10 at the other.', watch: 'Players who count the mark they are on as 1. Say “start on your number, then hop.”', questions: ['Where will the dot land? How do you know?', 'How far is the dot from your end?', 'What roll do you need to win?'] },
    src: MFL });
  G({ id: 'roll-fill', title: 'Roll and fill the frame', type: 'Counting and number', grades: [0, 1], players: '2', minutes: 10, tools: ['tenframe', 'dice'],
    setup: { tenframe: { m: 'one', c: [] }, dice: D1 },
    goal: 'Fill your ten frame with exactly 10 counters.',
    rules: ['Player 1 uses red counters. Player 2 uses yellow.', 'Roll the die. Drag that many of your counters into the frame.', 'Now the other player rolls and adds their counters to the same frame.', 'When the frame is almost full, you need the exact number to finish.', 'Say how many more you need before you roll.'],
    win: 'The player who fills the last box wins.',
    variations: ['Use the double ten frame and play to 20.', 'Roll and empty: start with a full frame and take counters out.', 'Play alone: how many rolls does it take you to fill the frame?'],
    notes: { purpose: 'Counting on, the pairs that make 10, and “how many more?”', watch: 'Players who do not see that a full row is 5. Ask how many are in the top row without counting.', questions: ['How many are in the frame now?', 'How many more make 10?', 'What roll would fill it exactly?'] },
    src: MFL });
  G({ id: 'guess-number', title: 'Guess my number', type: 'Counting and number', grades: [1, 2, 3], players: '2', minutes: 10, tools: ['numberline'],
    setup: { numberline: { a: 0, b: 100, parts: 20, mode: 'whole', lab: 'all', simp: 0, two: 0, parts2: 8, hop: 0, dots: [], hops: [] } },
    goal: 'Find the secret number in as few guesses as you can.',
    rules: ['Player 1 picks a secret number from 0 to 100 and keeps it hidden.', 'Player 2 guesses a number.', 'Player 1 says “more” or “less.”', 'Player 2 drags a dot onto the mark nearest the guess. The secret number is on one side of the dot.', 'Keep guessing. Count how many guesses it takes.'],
    win: 'Find the number in 7 guesses or fewer and you win the round. Then swap.',
    variations: ['Use 0 to 1,000 by hundreds. Can you still do it in 10 guesses?', 'Use 0 to 1 in tenths: the secret number is a decimal.', 'Take the dots off: hold the clues in your head.'],
    notes: { purpose: 'Comparing numbers, using “between,” and halving a range to search quickly.', watch: 'Guesses that ignore the clues (guessing 20 after hearing 30 is too low). Ask which side of the dot the number must be on.', questions: ['Which two dots is the number between now?', 'What guess would cut that in half?', 'What is the most guesses you could ever need?'] },
    src: 'classic game' });

  /* ───── Adding and subtracting ───── */
  G({ id: 'pig', title: 'Pig', type: 'Adding and subtracting', grades: [2, 3, 4], players: '2', minutes: 15, tools: ['dice', 'whiteboard'],
    setup: { dice: D1, whiteboard: WB },
    goal: 'Be the first to 100 points. Roll as much as you dare.',
    rules: ['On your turn, roll the die as many times as you like. Add up your rolls as you go.', 'Roll a 1 and your turn ends. You get 0 for that turn.', 'Say “stop” before you roll a 1, and add your turn’s points to your score.', 'Write both scores on the whiteboard after every turn.', 'Take turns.'],
    win: 'The first player to reach 100 wins.',
    variations: ['Big Pig: roll two dice and add them. One 1 ends your turn. Two 1s wipe out your whole score. Doubles count twice.', 'Play to 50 for a quicker game.', 'Keep your running total in your head. Only write it down when you stop.'],
    notes: { purpose: 'Mental addition and a first feel for risk: each extra roll adds about 4 but one roll in six loses the turn.', watch: 'Players who always stop after one roll, or never stop. Ask what usually happens after 3 more rolls.', questions: ['How many points do you have this turn?', 'How many more do you need to win?', 'Is it worth one more roll? Why?'] },
    src: 'classic game' });
  G({ id: 'game-of-12', title: 'Game of twelve', type: 'Adding and subtracting', grades: [2, 3, 4], players: '2', minutes: 15, tools: ['dice', 'whiteboard'],
    setup: { dice: D2, whiteboard: WB },
    goal: 'Cross off every number from 1 to 12.',
    rules: ['Each player writes 1 to 12 in a row on the whiteboard.', 'Roll two dice.', 'Add, take away, multiply or divide the two numbers. Cross off the answer on your row.', 'You can only cross off one number each turn, and only if it is still there.', 'Take turns.'],
    win: 'The first player to cross off all 12 numbers wins.',
    variations: ['Target practice: the teacher calls a target. Everyone rolls and tries to hit it with + or − or ×.', 'Cross off 2 numbers a turn if you can show two different number sentences.', 'Play to 20 with three dice.'],
    notes: { purpose: 'Flexible use of all four operations with small numbers, and choosing the operation that gets the number you still need.', watch: 'Players who only add. Point to a high number they still need and ask what could make it.', questions: ['What can you make with a 3 and a 4?', 'Which numbers are hardest to cross off? Why?', 'Can you ever make 11 by multiplying?'] },
    src: MFL });
  G({ id: 'race-100', title: 'Race to 100', type: 'Adding and subtracting', grades: [1, 2, 3], players: '2', minutes: 15, tools: ['hundred', 'dice'],
    setup: { hundred: { mode: 'hundred', start: 1, sk1: 0, sk2: 0, hl: {}, fac: 0, fv: 0 }, dice: D2 },
    goal: 'Race across the hundred chart.',
    rules: ['Player 1 colors yellow (tap a square once). Player 2 colors pink (tap twice). Both start just before 1.', 'Roll two dice and add them.', 'Count on that many from your last square. Color the square you land on.', 'Say your new number out loud.', 'Take turns.'],
    win: 'The first player to reach 100 or go past it wins.',
    variations: ['Exact finish: you must land on 100 exactly or lose that turn.', 'Use the 0 to 9 dice and make a two-digit number to jump that far. Then race on a chart that starts at 101.', 'Race down: start on 100 and take away your roll. First to 1 wins.'],
    notes: { purpose: 'Counting on by small amounts, adding tens and ones on the chart (down a row is 10 more), and reading two-digit numbers.', watch: 'Counting the square they are on as 1. Say “start on your number, then count the hops.”', questions: ['What number are you on? What will 10 more be?', 'How far to 100?', 'Which roll would get you there fastest?'] },
    src: MFL });
  G({ id: 'penny-nickel-dime', title: 'Penny, nickel, dime', type: 'Money', grades: [1, 2], players: '2', minutes: 15, tools: ['money', 'dice'],
    setup: { money: { mode: 'count', it: [] }, dice: D1 },
    goal: 'Trade your way up to 50 cents.',
    rules: ['Roll the die. Drag that many pennies onto your mat.', 'Got 5 pennies? Trade them for a nickel: drag the pennies off and a nickel on.', 'Got 2 nickels? Trade them for a dime.', 'Say how much money you have at the end of your turn.', 'Take turns. Clear the mat when you swap players, or share one mat and keep your coins on your own side.'],
    win: 'The first player to reach 50 cents wins.',
    variations: ['Trade up to a quarter too: 2 dimes and a nickel make 25 cents.', 'Race to a dollar.', 'Go backwards: start with a dollar, roll, and give pennies away. Trade down when you run out.'],
    notes: { purpose: 'Coin values, trading 5 for 1 and 2 for 1, and counting a mixed set of coins.', watch: 'Counting every coin as 1 cent. Ask what the nickel is worth and have them count by 5s.', questions: ['How much do you have now?', 'Which coins could you trade?', 'How many more cents to 50?'] },
    src: MFL });
  G({ id: 'spending-spree', title: 'Spending spree', type: 'Money', grades: [2, 3], players: '2', minutes: 15, tools: ['dice', 'money'],
    setup: { dice: T2, money: { mode: 'count', it: [] } },
    goal: 'Pay the price with the fewest coins.',
    rules: ['Roll the two 0 to 9 dice. Make a price in cents, like 47¢.', 'Player 1 drags coins onto the mat to pay exactly that much.', 'Player 2 checks the total. Right? 1 point.', 'Did Player 1 use the fewest coins possible? 1 more point.', 'Clear the mat and swap.'],
    win: 'The player with more points after 8 rounds wins.',
    variations: ['Dollars and cents: roll three dice for a price like $3.47.', 'Make change: use the Make change setup. The price is your roll. Pay with a dollar.', 'Pay with no dimes. Can you still do it?'],
    notes: { purpose: 'Counting coins, making an amount more than one way, and using quarters and dimes first for the fewest coins.', watch: 'Paying with all pennies. Ask which coin is closest to the price without going over.', questions: ['Which coin did you choose first? Why?', 'Can you pay with fewer coins?', 'How much more would make a dollar?'] },
    src: MFL });

  /* ───── Place value ───── */
  G({ id: 'fill-stairs', title: 'Fill the stairs', type: 'Place value', grades: [2, 3, 4], players: '2', minutes: 15, tools: ['dice', 'whiteboard'],
    setup: { dice: T2, whiteboard: WB },
    goal: 'Fill 10 stairs with numbers that go up from bottom to top.',
    rules: ['Draw a staircase with 10 steps on the whiteboard, one for each player.', 'Roll the two 0 to 9 dice. Make a two-digit number from them, in either order.', 'Write the number on any empty step. Numbers must get bigger as you go up.', 'Once a number is written, it stays.', 'If your number does not fit anywhere, you lose that turn.'],
    win: 'The first player to fill all 10 steps wins.',
    variations: ['Roll three dice and make three-digit numbers.', 'Use 5 steps for a quicker game.', 'Play alone: how many rolls does it take to fill the stairs?'],
    notes: { purpose: 'Reading two-digit numbers, comparing and ordering, and estimating where a number belongs in 0 to 99.', watch: 'Putting 47 on the bottom step. Ask where 47 is between 0 and 99, and where that is on the stairs.', questions: ['Which number did you make? Why that order?', 'Which steps could that number fit on?', 'What numbers would still fit between 32 and 58?'] },
    src: MFL });
  G({ id: 'dont-break-bank', title: 'Don’t break the bank', type: 'Place value', grades: [3, 4, 5], players: '2', minutes: 15, tools: ['dice', 'whiteboard'],
    setup: { dice: T1, whiteboard: WB },
    goal: 'Build the biggest number you can without passing the target.',
    rules: ['Agree on a target, like 500. Each player draws three boxes: hundreds, tens, ones.', 'Roll the 0 to 9 die.', 'Write the digit in one of your boxes. You cannot move it later.', 'Roll three times to fill your boxes.', 'Read your number. If it is bigger than the target, you broke the bank: 0 points.'],
    win: 'The biggest number that does not pass the target wins the round.',
    variations: ['Four boxes and a target of 5,000.', 'Smallest number without going under 200.', 'Decimals: boxes for ones, tenths and hundredths, target 5.'],
    notes: { purpose: 'Place value: where a digit goes changes what it is worth. Players must weigh a safe choice against a bigger one.', watch: 'Putting a 7 in the hundreds with a target of 500. Ask what that digit is worth there.', questions: ['Where will you put the 4? Why?', 'What is the biggest number you can still make?', 'What rolls would break the bank now?'] },
    src: MFL });
  G({ id: 'bullseye', title: 'Bullseyes and close calls', type: 'Place value', grades: [2, 3, 4, 5], players: '2', minutes: 15, tools: ['whiteboard'],
    setup: { whiteboard: WB },
    goal: 'Crack the secret number using digit clues.',
    rules: ['Player 1 writes a secret two-digit number on paper and hides it. The two digits must be different.', 'Player 2 guesses a two-digit number and writes it on the whiteboard.', 'Player 1 gives clues. A bullseye is a right digit in the right place. A close call is a right digit in the wrong place.', 'Write the clues next to the guess, like “1 bullseye, 0 close calls.”', 'Keep guessing until you get 2 bullseyes.'],
    win: 'Crack it in 6 guesses or fewer to win. Then swap.',
    variations: ['Three-digit secret numbers.', 'Let digits repeat.', 'Play as a class: the teacher has the secret number and the class takes turns guessing.'],
    notes: { purpose: 'Place value and logical reasoning: each clue rules out some digits and places.', watch: 'Guesses that forget earlier clues. Ask what each clue tells you about the tens place.', questions: ['What do you know for sure after that clue?', 'Which digits can you rule out?', 'What guess would tell you the most?'] },
    src: MFL });
  G({ id: 'horseshoes', title: 'Horseshoes', type: 'Place value', grades: [2, 3], players: '2', minutes: 10, tools: ['dice', 'hundred'],
    setup: { dice: T2, hundred: { mode: 'hundred', start: 1, sk1: 0, sk2: 0, hl: {}, fac: 0, fv: 0 } },
    goal: 'Make a number as close to the target as you can.',
    rules: ['Pick a target on the hundred chart and color it blue (tap three times).', 'Roll the two 0 to 9 dice. Make a two-digit number from them, in either order.', 'Color your number: yellow for Player 1, pink for Player 2.', 'The closer number scores 1 point. Hit the target exactly? That is a ringer: 3 points.', 'Clear the colors and pick a new target.'],
    win: 'The first player to 10 points wins.',
    variations: ['Say how far your number is from the target to get your point.', 'Roll three dice and play on a chart that starts at 101.', 'Lowest wins: the number farther from the target scores.'],
    notes: { purpose: 'Reading two-digit numbers, choosing which digit goes in the tens place, and finding the distance between two numbers.', watch: 'Making 71 when 17 is closer to 20. Ask which order gets closer.', questions: ['Which order gets you closer? Why?', 'How far is your number from the target?', 'Who is closer? How do you know from the chart?'] },
    src: MFL });

  /* ───── Multiplying and area ───── */
  G({ id: 'blockout', title: 'Blockout', type: 'Multiplying and area', grades: [3, 4], players: '2', minutes: 15, tools: ['tiles', 'dice'],
    setup: { tiles: { cols: 10, rows: 8, unit: '', cells: {}, col: 0, edge: false }, dice: D2 },
    goal: 'Cover more of the grid than the other player.',
    rules: ['Player 1 uses red tiles. Player 2 uses blue.', 'Roll two dice. They are the sides of your rectangle, like 3 by 4.', 'Lay a rectangle that size anywhere it fits, using your color. Drag across the grid to lay tiles fast.', 'Say the area: “3 by 4 is 12 squares.”', 'If your rectangle does not fit anywhere, you lose that turn. When neither player can place, the game ends.'],
    win: 'Count your squares. The player who covered more wins.',
    variations: ['Big Blockout: use the Big grid and the 0 to 9 dice. Roll again if you get a 0.', 'Rectangles must touch one of your own tiles after your first turn.', 'Score the perimeter instead of the area.'],
    notes: { purpose: 'Multiplication as area, and the fact that 3 by 4 and 4 by 3 cover the same amount but fit differently.', watch: 'Counting every square one by one. Ask for a faster way using the rows.', questions: ['How many squares is your rectangle? How do you know without counting?', 'Could you turn it to make it fit?', 'How many empty squares are left? What roll would fill them?'] },
    src: MFL });
  G({ id: 'square-build', title: 'Square building', type: 'Multiplying and area', grades: [3, 4, 5], players: '2', minutes: 15, tools: ['tiles', 'dice'],
    setup: { tiles: { cols: 10, rows: 8, unit: '', cells: {}, col: 0, edge: false }, dice: D1 },
    goal: 'Build squares out of your tiles. Bigger squares score more.',
    rules: ['Player 1 uses red tiles. Player 2 uses blue.', 'Roll the die. Lay that many of your tiles anywhere on the grid.', 'When your tiles make a solid square (2 by 2, 3 by 3 or bigger), say its area and score that many points.', 'A square can only be scored once.', 'Take turns until the grid is full.'],
    win: 'The player with more points wins.',
    variations: ['Only squares you finish on your own turn count.', 'Roll two dice and lay the sum.', 'Rectangles count too, but squares score double.'],
    notes: { purpose: 'Square numbers (4, 9, 16, 25) as pictures, and planning a shape a few tiles at a time.', watch: 'Scoring a 3 by 3 as 6 or 9 without a reason. Ask how many rows of how many.', questions: ['What is the area of a 3 by 3 square?', 'How many more tiles would make your square bigger?', 'Why does a 4 by 4 square score more than four 2 by 2 squares?'] },
    src: MFL });
  G({ id: 'forty-faces', title: 'Forty faces', type: 'Multiplying and area', grades: [2, 3, 4], players: 'team', minutes: 20, tools: ['pattern'],
    setup: { pattern: { b: [], mirror: 'none', frac: false, sel: -1 } },
    goal: 'Build a face worth exactly 40.',
    rules: ['A green triangle is worth 1. A blue rhombus is 2. A red trapezoid is 3. A yellow hexagon is 6.', 'Build a face out of blocks: eyes, nose, mouth, hair, anything you like.', 'Add up what your face is worth.', 'Change blocks until your face is worth exactly 40.', 'Show your face and prove it adds to 40.'],
    win: 'Every face worth exactly 40 wins. Can your team make three different ones?',
    variations: ['Make a face worth 40 with the fewest blocks. With the most blocks.', 'Pick a different number, like 25 or 60.', 'Secret face: build one, and let the other team work out what it is worth.'],
    notes: { purpose: 'Adding and multiplying with 1, 2, 3 and 6, and swapping blocks that are worth the same (two triangles for a rhombus, two trapezoids for a hexagon).', watch: 'Counting blocks instead of adding their values. Ask what each block is worth before they add.', questions: ['What is your face worth so far?', 'How much more do you need?', 'What could you swap to change the total by 1?'] },
    src: MFL });
  G({ id: 'rod-fill', title: 'Rod fill-ins', type: 'Adding and subtracting', grades: [0, 1, 2], players: '2', minutes: 10, tools: ['cuisenaire'],
    setup: { cuisenaire: { r: [], lab: 1, rows: 8 } },
    goal: 'Match a rod with two shorter rods that are exactly as long.',
    rules: ['Player 1 drags one rod onto the top row of the mat.', 'Player 2 puts two rods right under it, starting at the same place, to make the same length.', 'Do they line up exactly? A check mark appears. 1 point.', 'Find a second way under that. Another point.', 'Tap Clear and swap jobs.'],
    win: 'The first player to 5 points wins.',
    variations: ['Fill it with three rods.', 'Turn off the numbers on the rods and name them by color.', 'Find every way to make the orange rod with two rods. How many are there?'],
    notes: { purpose: 'Number bonds as lengths: 7 is 3 and 4, 5 and 2, 6 and 1. The check mark only appears when the lengths match exactly.', watch: 'Players who leave a gap or hang over the end. Ask them to look at the right-hand end.', questions: ['Which two rods make 8?', 'Is there another way?', 'If one rod gets longer, what happens to the other?'] },
    src: MFL });
  G({ id: 'rod-roll', title: 'Rod rolling', type: 'Adding and subtracting', grades: [1, 2], players: '2', minutes: 10, tools: ['cuisenaire', 'dice'],
    setup: { cuisenaire: { r: [], lab: 1, rows: 8 }, dice: D1 },
    goal: 'Make a train exactly 20 long.',
    rules: ['Player 1 builds on the top row of the mat. Player 2 builds on the row under it.', 'Roll the die. Take the rod with that number and add it to the end of your train.', 'Say how long your train is now.', 'When you are close to 20, you need the exact rod to finish.', 'A roll that goes past 20 is a lost turn.'],
    win: 'The first player to build exactly 20 wins.',
    variations: ['Race to 10.', 'Roll two dice. Pick one of them.', 'Count down: start with two orange rods and take rods away.'],
    notes: { purpose: 'Adding on, keeping a running total, and “how many more to 20?” On a phone the mat is only 10 wide, so play Race to 10 there.', watch: 'Players who lose track of the total. Have them read the sum under the mat after every turn.', questions: ['How long is your train?', 'How many more to 20?', 'Which rolls would finish it exactly?'] },
    src: MFL });

  /* ───── Dominoes ───── */
  G({ id: 'domino-war', title: 'Domino war', type: 'Counting and number', grades: [0, 1, 2], players: '2', minutes: 10, tools: ['dominoes'],
    setup: { dominoes: { set: 6, d: [], _r: 0 } },
    goal: 'Add up your domino. The bigger total wins the round.',
    rules: ['Each player drags one domino from the pile onto the mat.', 'Say the number on each side, then the total: “4 and 3 make 7.”', 'The bigger total gets a point. Same total? Nobody scores.', 'Drag both dominoes off the mat.', 'Play until the pile runs out.'],
    win: 'The player with more points wins.',
    variations: ['Domino sorting: drag out every domino and sort them by total. Which totals have the most dominoes?', 'Play with the double-nine set for bigger sums.', 'Take-away war: the difference between the two sides is your number.'],
    notes: { purpose: 'Adding two small parts, with the picture right there, and comparing totals.', watch: 'Counting every dot from 1. Model counting on from the bigger side.', questions: ['Which side has more? Can you count on from there?', 'What is the total?', 'Who won? By how much?'] },
    src: MFL });

  /* ───── Fractions and decimals ───── */
  G({ id: 'fraction-war', title: 'Fraction war', type: 'Fractions and decimals', grades: [3, 4, 5], players: '2', minutes: 15, tools: ['dice', 'fbars'],
    setup: { dice: D2, fbars: { d: [2, 3, 4, 5, 6], w: 1, lab: 1, sh: {}, gd: 1, gx: 0.5, bm: 'wall', bt: [] } },
    goal: 'Make the bigger fraction.',
    rules: ['Roll two dice. The smaller number goes on top, the bigger one on the bottom. A 3 and a 4 make [3/4]. Doubles make 1 whole.', 'Shade your fraction on the wall, starting from the left. Then the other player rolls and shades theirs.', 'Both need the same row? Player 2 shades from the right end instead.', 'Which shaded part is longer? That player gets a point. Same length? Nobody scores.', 'Clear the wall. Play 10 rounds.'],
    win: 'The player with more points after 10 rounds wins.',
    variations: ['Closest to [1/2] wins the round instead of biggest.', 'Smallest fraction wins.', 'Use the 0 to 9 dice for fractions with bigger numbers. Add the rows you need in More options.'],
    notes: { purpose: 'Comparing fractions with a picture, including fractions with different bottoms, and seeing equal fractions like [2/4] and [1/2].', watch: 'Thinking the bigger bottom number means the bigger fraction. Ask them to look at the shaded length.', questions: ['Which is longer? How can you tell?', 'How much more do you need to make 1?', 'Are any two fractions the same length?'] },
    src: MFL });
  G({ id: 'cover-whole', title: 'Cover the whole', type: 'Fractions and decimals', grades: [2, 3, 4], players: '2', minutes: 15, tools: ['fcircles', 'dice'],
    setup: { fcircles: { c: 2, n: 6, per: 0, ns: [6, 6, 6, 6], lab: 0, sh: [[], [], [], []] }, dice: D1 },
    goal: 'Fill your circle with slices, no more and no less.',
    rules: ['Player 1 has the left circle. Player 2 has the right circle. Both are cut into sixths.', 'Roll the die. Roll a 1? Add 1 slice. Roll a 2? Add 2 slices. Roll a 3? Add 3 slices.', 'Roll a 4? Add 4 slices. Roll a 5? Lose your turn. Roll a 6? Fill the whole circle, but only if it is empty.', 'Say your fraction after every turn: “I have [4/6], that is [2/3].”', 'Near the end you need the exact roll. Too many? Lose that turn.'],
    win: 'The first player to fill their whole circle wins.',
    variations: ['Uncover the whole: start full and take slices away.', 'Cut the circles into eighths. A roll of 1 to 4 adds that many eighths.', 'Play with two circles each and race to 2 wholes.'],
    notes: { purpose: 'Counting unit fractions, naming the same amount two ways ([3/6] and [1/2]), and “how much more to 1?”', watch: 'Saying “4 slices” without a fraction name. Ask how many slices make the whole.', questions: ['What fraction is shaded now?', 'How much more do you need to make 1?', 'Which rolls would finish it?'] },
    src: MFL });
  G({ id: 'close-to-1', title: 'Close to 1', type: 'Fractions and decimals', grades: [4, 5], players: '2', minutes: 15, tools: ['decgrid', 'dice'],
    setup: { decgrid: { m: 'h', c: 2, sh: ['', '', ''], pct: 0 }, dice: T2 },
    goal: 'Get as close to 1 as you can without going over.',
    rules: ['Player 1 has the left grid. Player 2 has the right grid. A full grid is 1.', 'Roll the two 0 to 9 dice. Make a decimal in hundredths, like 0.37 or 0.73.', 'Shade that much on your grid, adding to what is already there.', 'Each player gets 3 rolls. You may stop after 2 if you like.', 'Go past 1? You are out this round.'],
    win: 'The player closer to 1 wins the round. Play 5 rounds.',
    variations: ['Tenths only: roll one die and shade that many tenths.', 'Close to 2: use three grids each.', 'Say how far you are from 1 to earn your point.'],
    notes: { purpose: 'Reading and adding decimals to hundredths, and seeing that 0.37 and 0.73 are very different amounts of a grid.', watch: 'Adding 0.6 and 0.45 as 0.51. Ask what the grid shows.', questions: ['Which order should the digits go? Why?', 'How much more to make 1?', 'What is the biggest roll you can still take safely?'] },
    src: MFL });

  /* ═══════════════ card ═══════════════ */
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function fracHTML(t) { return esc(t).replace(/(\d*)\[(\d+)\/(\d+)\]/g, function (m, w, a, b) { return (w ? w + ' ' : '') + '<span class="fr"><span>' + a + '</span><span>' + b + '</span></span>'; }); }
  function fracText(t) { return String(t).replace(/(\d*)\[(\d+)\/(\d+)\]/g, function (m, w, a, b) { return (w ? w + ' and ' : '') + a + ' ' + ({ 2: 'half', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 8: 'eighth', 10: 'tenth', 12: 'twelfth' }[b] || 'over ' + b) + (+a === 1 || !{ 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 8: 1, 10: 1, 12: 1 }[b] ? '' : 's'); }); }
  function h(tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var k in attrs) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); } if (html != null) e.innerHTML = html; return e; }
  var GR = { '-1': 'Pre-K', 0: 'K' };
  function gradeText(gs) { var a = gs.slice().sort(function (x, y) { return x - y; }), name = function (g) { return GR[g] || ('Gr ' + g); }; if (a.length === 1) return name(a[0]); var runs = [], s = a[0], p = a[0]; for (var i = 1; i <= a.length; i++) { if (i < a.length && a[i] === p + 1) { p = a[i]; continue; } runs.push(s === p ? name(s) : name(s) + '–' + (GR[p] || p)); if (i < a.length) { s = p = a[i]; } } return runs.join(', '); }
  var PL = { 2: '2 players', team: 'Small group', class: 'Whole class' };
  function toolName(id) { return (window.OAOM && OAOM.meta) ? OAOM.meta(id).name : id; }

  function render(el, g, o) {
    o = o || {}; el.innerHTML = ''; el.className = 'gm' + (o.print ? ' gm-print' : '');
    el.appendChild(h('div', { class: 'gm-head' }, '<div class="badges"><span class="badge">' + esc(gradeText(g.grades)) + '</span><span class="badge">' + esc(PL[g.players] || g.players) + '</span><span class="badge">' + g.minutes + ' min</span><span class="badge kit">' + esc(g.type) + '</span></div><h2>' + esc(g.title) + '</h2>'));
    el.appendChild(h('p', { class: 'gm-goal' }, fracHTML(g.goal)));
    el.appendChild(h('p', { class: 'gm-need' }, '<b>You need:</b> ' + g.tools.map(function (t) { return '<span class="gm-tool">' + esc(toolName(t)) + '</span>'; }).join(' ')));
    var ol = h('ol', { class: 'gm-rules' }); g.rules.forEach(function (r) { ol.appendChild(h('li', null, fracHTML(r))); }); el.appendChild(ol);
    el.appendChild(h('p', { class: 'gm-win' }, '<b>Who wins?</b> ' + fracHTML(g.win)));
    if (g.variations && g.variations.length) { var vb = h('div', { class: 'gm-var' }, '<h3>Try it another way</h3>'); var ul = h('ul'); g.variations.forEach(function (v) { ul.appendChild(h('li', null, fracHTML(v))); }); vb.appendChild(ul); el.appendChild(vb); }
    if (o.teacher && g.notes) {
      var n = g.notes, body = '<h4>Why play it</h4><p>' + fracHTML(n.purpose) + '</p><h4>Watch for</h4><p>' + fracHTML(n.watch) + '</p><h4>Questions to ask</h4><ul>' + n.questions.map(function (q) { return '<li>' + fracHTML(q) + '</li>'; }).join('') + '</ul>' + (g.src ? '<p class="gm-src">Game idea: ' + esc(g.src) + '.</p>' : '');
      var d = h('details', { class: 'gm-notes' }, '<summary>Teacher notes (never on student links)</summary><div>' + body + '</div>'); if (o.print) d.open = true; el.appendChild(d);
    }
    /* the tool, under the rules; a Switch tool row when the game lists more than one */
    if (o.embed && o.toolURL && !o.print) {
      var frames = {}, box = h('div', { class: 'gm-play' }), sw = null;
      if (g.tools.length > 1) { sw = h('div', { class: 'om-row gm-switch', role: 'group', 'aria-label': 'Switch tool' }, '<b>Switch tool:</b>'); box.appendChild(sw); }
      var stage = h('div', { class: 'gm-stage' }); box.appendChild(stage);
      function show(t) {
        g.tools.forEach(function (id) { if (frames[id]) frames[id].hidden = id !== t; });
        if (!frames[t]) { var f = h('iframe', { src: o.toolURL(t, g.setup && g.setup[t] ? g.setup[t] : null), title: toolName(t), allow: 'fullscreen; clipboard-write' }); f.setAttribute('allowfullscreen', ''); frames[t] = f; stage.appendChild(f); }
        if (sw) sw.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.t === t ? 'true' : 'false'); });
      }
      if (sw) g.tools.forEach(function (t) { var b = h('button', { type: 'button', class: 'om-btn small' }, esc(toolName(t))); b.dataset.t = t; b.onclick = function () { show(t); }; sw.appendChild(b); });
      show(g.tools[0]);
      el.appendChild(box);
      el._show = show;
    }
    return el;
  }
  /* plain-text rules for the Canvas directions box (fractions as words) */
  function dirSteps(g) { return g.rules.map(fracText); }

  var types = []; L.forEach(function (g) { if (types.indexOf(g.type) < 0) types.push(g.type); });
  return { list: L, types: types, get: function (id) { return L.filter(function (g) { return g.id === id; })[0]; }, render: render, dirSteps: dirSteps, fracHTML: fracHTML, fracText: fracText, gradeText: gradeText };
})();
