/* OAO Math Manipulatives — Number talks bank (teacher-led; teacher notes never go on student links).
   Each talk: {id, grades, topic, title, show, notes}
   show = {t: toolId, s: state} opens that tool on the big screen (use the teacher-only Flash it button for quick images),
        or {text: [lines]} for a number string (fractions written as [1/2] are drawn stacked),
        or {wodb: [four items]} for Which One Doesn't Belong (items are numbers, shape names or [1/2] fractions),
        or {pair: [showA, showB]} for Same and Different (two pictures side by side; each is a {t, s} or {text} show).
   notes = {purpose, launch, strategies: [[what students might say, how to record it]], questions: [], watch, ext}
   Grades: -1 = Pre-K, 0 = K. */
window.OAOM_TALKS = (function () {
  var T = [];
  function add(id, grades, topic, title, show, n) { T.push({ id: id, grades: grades, topic: topic, title: title, show: show, notes: n }); }
  var dc = function (k, n, a) { var s = { k: k, n: n, fl: 0 }; if (a != null) s.a = a; return { t: 'dotcards', s: s }; };
  function frame(m, red, yel, red2, yel2) { /* tenframe cells: 1 red, 2 yellow */
    var c = [], i; if (m === 'double') { for (i = 0; i < 10; i++) c.push(i < red ? 1 : i < red + (yel || 0) ? 2 : 0); for (i = 0; i < 10; i++) c.push(i < (red2 || 0) ? 1 : i < (red2 || 0) + (yel2 || 0) ? 2 : 0); }
    else { var n = m === 'five' ? 5 : 10; for (i = 0; i < n; i++) c.push(i < red ? 1 : i < red + (yel || 0) ? 2 : 0); }
    return { t: 'tenframe', s: { m: m, c: c, A: [], B: [] } };
  }
  function trains(lens, tower) { var U = 44; return { t: 'linkcubes', s: { m: tower ? 'tower' : 'train', meas: 0, t: lens.map(function (L, i) { var c = []; for (var k = 0; k < L; k++) c.push(i % 2 ? 4 : 0); return tower ? { x: 30 + i * (U + 30), y: 10 + 470 - 14 - U, c: c } : { x: 30, y: 40 + i * (U + 24), c: c }; }) } }; }

  var FLASH = 'Open it on the big screen, then tap Flash it (2–3 s) so students see it but can’t count one by one.';
  var SIGNAL = 'Ask students to put a quiet thumb up on their chest when they have an answer, and add a finger for each other way they can see it.';

  /* ───────── Subitizing ───────── */
  add('sub-3', [-1, 0], 'Subitizing', 'How many dots? (3)', dc('d5', 3), {
    purpose: 'See small amounts at a glance without counting one by one.', launch: FLASH + ' Say: “How many dots did you see? How do you know?”',
    strategies: [['“I just knew it was 3.”', 'Write 3 under the picture.'], ['“I saw 2 and 1 more.”', 'Circle 2 dots and 1 dot; write 2 and 1 make 3.'], ['“I counted 1, 2, 3.”', 'Number the dots 1, 2, 3; accept it, then ask who saw it without counting.']],
    questions: ['How many did you see?', 'How did you know so fast?', 'Did anyone see it a different way?', 'Show me with your fingers.'],
    watch: 'Children who touch the air to count each dot. Show it again, a little longer, and ask them to “take a picture with their eyes.”', ext: 'Show 4 in the same layout, then ask what changed.' });
  add('sub-4', [-1, 0], 'Subitizing', 'How many dots? (4)', dc('d5', 4), {
    purpose: 'Recognize 4 as a square pattern and as 2 and 2.', launch: FLASH + ' “How many? Where did you see them?”',
    strategies: [['“It looks like a square.”', 'Trace the square shape.'], ['“2 on top and 2 on the bottom.”', 'Circle each row; write 2 and 2 make 4.']],
    questions: ['How many dots?', 'What shape did the dots make?', 'Who saw two groups?', 'How many more would make 5?'], watch: 'Saying 5 because a dice “five” is familiar. Show it again and count together to check.', ext: 'Show 4 in a line instead. Is it still 4? Is it harder to see?' });
  add('sub-5', [-1, 0], 'Subitizing', 'How many dots? (5)', dc('d5', 5), {
    purpose: 'See 5 as 4 and 1, or 2 and 2 and 1.', launch: FLASH + ' “How many dots? How did you see them?”',
    strategies: [['“Four corners and one in the middle.”', 'Circle the 4 corners, then the middle; write 4 and 1 make 5.'], ['“2 and 2 and 1.”', 'Circle pairs; write 2 + 2 + 1.'], ['“Like a dice!”', 'Accept it; ask how the dice shows 5.']],
    questions: ['How many?', 'Where did you see 4?', 'Is there another way to see it?', 'How many fingers on one hand?'], watch: 'Counting the middle dot twice.', ext: 'Show 6 next. What is the same? What is different?' });
  add('sub-6', [0, 1], 'Subitizing', 'How many dots? (6)', dc('d10', 6), {
    purpose: 'Use groups (3 and 3, 2 and 2 and 2) to see 6 quickly.', launch: FLASH + ' ' + SIGNAL,
    strategies: [['“Two lines of 3, going down.”', 'Circle each line; write 3 + 3 = 6.'], ['“Three pairs.”', 'Circle pairs; write 2 + 2 + 2.'], ['“5 and 1 more.”', 'Circle 5; write 5 + 1.']],
    questions: ['How many dots?', 'How did you see them?', 'Who saw groups of 2?', 'How is your way like ___’s way?'], watch: 'Students who say 5 or 7 — show it again and let them point to the groups they saw.', ext: 'Ask: “How many more would make 10?”' });
  add('sub-7', [0, 1], 'Subitizing', 'How many dots? (7)', dc('d10', 7), {
    purpose: 'Break 7 into easy parts like 5 and 2 or 3 and 4.', launch: FLASH + ' ' + SIGNAL,
    strategies: [['“5 and 2.”', 'Circle 5 and 2; write 5 + 2 = 7.'], ['“3 and 4.”', 'Circle 3 and 4; write 3 + 4 = 7.'], ['“6 and 1.”', 'Circle 6; write 6 + 1.']],
    questions: ['How many?', 'Which parts did you see first?', 'Can you see it another way?', 'How many more make 10?'], watch: 'Counting by ones every time. Ask them to find a part they know without counting.', ext: 'Ask a student to describe their parts without saying the total.' });
  add('sub-8', [0, 1], 'Subitizing', 'How many dots? (8)', dc('d10', 8), {
    purpose: 'See 8 as doubles (4 and 4) or as 5 and 3.', launch: FLASH + ' ' + SIGNAL,
    strategies: [['“4 and 4.”', 'Circle two groups of 4; write 4 + 4 = 8.'], ['“5 and 3.”', 'Circle 5 and 3.'], ['“10 take away 2.”', 'Draw 2 empty spots; write 10 − 2 = 8.']],
    questions: ['How many?', 'Who used a double?', 'Who thought about 10?', 'Which way was fastest for you?'], watch: 'Students who lose track. Show it longer and let them point.', ext: 'Show 9 and ask how it is different from 8.' });
  add('sub-dom-6', [0, 1], 'Subitizing', 'Domino: 4 and 2', dc('dom', 6, 4), {
    purpose: 'See two parts and put them together.', launch: FLASH + ' “How many dots in all? How many on each side?”',
    strategies: [['“4 and 2 make 6.”', 'Write 4 + 2 = 6 under each side.'], ['“I counted on: 4… 5, 6.”', 'Write 4 → 5, 6.'], ['“3 and 3.”', 'Circle 3 and 3 across the sides.']],
    questions: ['How many on each side?', 'How many in all?', 'If we turn it around, is it still 6?', 'What number sentence matches?'], watch: 'Counting all from 1. Model counting on from the bigger side.', ext: 'Turn the domino: 2 and 4. Same total?' });
  add('sub-dom-8', [0, 1], 'Subitizing', 'Domino: 5 and 3', dc('dom', 8, 5), {
    purpose: 'Count on from a known amount.', launch: FLASH + ' “How many dots in all?”',
    strategies: [['“5… 6, 7, 8.”', 'Write 5 + 3 = 8 and draw hops 6, 7, 8.'], ['“4 and 4 if I move one.”', 'Draw an arrow moving one dot; write 4 + 4 = 8.']],
    questions: ['How many on each side?', 'Where did you start counting?', 'Could you make it a double?', 'How many more to make 10?'], watch: 'Starting the count over from 1.', ext: 'Ask: “What domino has the same total but different sides?”' });

  /* ───────── Combinations to 5 and 10 ───────── */
  add('five-3', [-1, 0], 'Combinations to 5 and 10', 'Five frame: 3', dc('five', 3), {
    purpose: 'See how many are filled and how many are empty.', launch: FLASH + ' “How many dots? How many empty boxes?”',
    strategies: [['“3, and 2 empty.”', 'Write 3 and 2 make 5.'], ['“I saw 3 right away.”', 'Write 3.']],
    questions: ['How many dots?', 'How many empty spaces?', 'How many more make 5?', 'How do you know?'], watch: 'Counting the empty boxes as dots.', ext: 'Show 4 and ask about the empty box.' });
  add('five-4', [-1, 0], 'Combinations to 5 and 10', 'Five frame: 4', dc('five', 4), {
    purpose: 'Use 5 as a friendly number: 4 is 1 less than 5.', launch: FLASH + ' “How many dots?”',
    strategies: [['“4, because one box is empty.”', 'Write 5 − 1 = 4.'], ['“2 and 2.”', 'Circle 2 and 2.']],
    questions: ['How many?', 'How many empty?', 'How many more make 5?', 'What if one more dot came?'], watch: 'Children who count every box including empty ones.', ext: 'Show 1. “How many empty now?”' });
  add('ten-6', [0, 1], 'Combinations to 5 and 10', 'Ten frame: 6', dc('ten', 6), {
    purpose: 'See 6 as 5 and 1 using the top row.', launch: FLASH + ' ' + SIGNAL,
    strategies: [['“A full row is 5, and 1 more.”', 'Circle the top row; write 5 + 1 = 6.'], ['“4 empty, so 6.”', 'Write 10 − 4 = 6.'], ['“3 and 3.”', 'Circle 3 and 3.']],
    questions: ['How many dots?', 'How many empty boxes?', 'How did the full row help you?', 'How many more make 10?'], watch: 'Not using the full row of 5. Ask, “How many in the top row? Did you need to count it?”', ext: 'Show 7, 8, 9 in a row and ask what is changing.' });
  add('ten-8', [0, 1], 'Combinations to 5 and 10', 'Ten frame: 8', dc('ten', 8), {
    purpose: 'See 8 as 5 and 3 or as 2 less than 10.', launch: FLASH + ' ' + SIGNAL,
    strategies: [['“5 and 3.”', 'Circle 5 and 3; write 5 + 3 = 8.'], ['“2 empty, so 8.”', 'Write 10 − 2 = 8.'], ['“4 and 4.”', 'Circle two columns of 4.']],
    questions: ['How many?', 'How many empty?', 'Which way was quickest?', 'What two numbers make 10?'], watch: 'Students who count empty boxes as filled.', ext: 'Ask, “If I add 3 more, how many will spill to a new frame?”' });
  add('ten-9', [0, 1], 'Combinations to 5 and 10', 'Ten frame: 9', dc('ten', 9), {
    purpose: 'See 9 as one less than 10.', launch: FLASH + ' “How many? How do you know without counting?”',
    strategies: [['“Just one empty, so 9.”', 'Write 10 − 1 = 9.'], ['“5 and 4.”', 'Circle 5 and 4.']],
    questions: ['How many?', 'How many empty?', 'How does the empty box help?', 'What is 9 and 1?'], watch: 'Saying 10 when they see a nearly full frame.', ext: 'Show 9 and 9 on two frames: “How many now?”' });
  add('ten-5-2', [0, 1], 'Combinations to 5 and 10', 'Red and yellow: 5 and 2', frame('one', 5, 2), {
    purpose: 'Name the parts and the whole.', launch: 'Open it on the big screen (Flash it is optional). “How many red? How many yellow? How many in all?”',
    strategies: [['“5 red and 2 yellow make 7.”', 'Write 5 + 2 = 7.'], ['“7, and 3 empty.”', 'Write 7 + 3 = 10.']],
    questions: ['How many red?', 'How many yellow?', 'How many in all?', 'How many more make 10?', 'What number sentence matches?'], watch: 'Mixing up the parts and the whole when recording.', ext: 'Flip one yellow to red. What changes? What stays the same?' });
  add('ten-4-6', [0, 1], 'Combinations to 5 and 10', 'Pairs that make 10: 4 and 6', frame('one', 4, 6), {
    purpose: 'Learn the pairs that make 10.', launch: 'Show it. “How many red? How many yellow? What do they make together?”',
    strategies: [['“4 and 6 make 10.”', 'Write 4 + 6 = 10.'], ['“6 and 4 is the same.”', 'Write 6 + 4 = 10 below.']],
    questions: ['How many red? Yellow?', 'Is the frame full?', 'What other pairs make 10?', 'If 3 were red, how many yellow?'], watch: 'Not seeing the full frame as 10.', ext: 'Make a list of all the ways to make 10 as students find them.' });

  /* ───────── Doubles and near doubles ───────── */
  add('dbl-6-6', [1, 2], 'Doubles and near doubles', 'Double ten frame: 6 and 6', frame('double', 6, 0, 6, 0), {
    purpose: 'Use a double you know.', launch: FLASH + ' ' + SIGNAL,
    strategies: [['“6 and 6 is 12, a double.”', 'Write 6 + 6 = 12.'], ['“5 and 5 is 10, plus 2.”', 'Circle both top rows; write 10 + 2 = 12.'], ['“Fill the first frame: 6 + 4 = 10, 2 left.”', 'Draw an arrow moving 4; write 10 + 2.']],
    questions: ['How many?', 'Who used a double?', 'Who used 5s?', 'How are these ways alike?'], watch: 'Counting all 12 one by one.', ext: 'Show 6 and 7 next (near double).' });
  add('dbl-6-7', [1, 2], 'Doubles and near doubles', 'Near double: 6 and 7', frame('double', 6, 0, 7, 0), {
    purpose: 'Use a double to solve a near double.', launch: FLASH + ' “How many? How could a double help?”',
    strategies: [['“6 + 6 = 12, and 1 more is 13.”', 'Write 6 + 6 + 1 = 13.'], ['“7 + 7 = 14, take 1 away.”', 'Write 7 + 7 − 1 = 13.'], ['“Make 10: 7 + 3, then 3 more.”', 'Write 7 + 3 = 10, 10 + 3 = 13.']],
    questions: ['How many?', 'Which double did you use?', 'Did you add or take away from the double? Why?', 'Which way do you like best?'], watch: 'Adding the extra 1 twice.', ext: 'Try 8 and 9.' });
  add('dbl-dom', [0, 1], 'Doubles and near doubles', 'Dominoes: 4 and 4, 4 and 5', { t: 'dominoes', s: { set: 6, d: [[4, 4, 60, 60], [4, 5, 260, 60]] } }, {
    purpose: 'Compare a double and a near double.', launch: 'Show both dominoes. “How many on each? How are they the same? Different?”',
    strategies: [['“4 + 4 = 8, so 4 + 5 is 9.”', 'Write both; draw an arrow showing 1 more.'], ['“I counted on from 5.”', 'Write 5 → 6, 7, 8, 9.']],
    questions: ['How many dots on each domino?', 'What is the same?', 'What is different?', 'How did the first help with the second?'], watch: 'Not noticing only one side changed.', ext: 'Ask for another double and near double pair.' });
  add('dbl-cubes', [0, 1, 2], 'Doubles and near doubles', 'Cube trains: 5 and 6', trains([5, 6]), {
    purpose: 'See a near double as a double plus one.', launch: 'Show the trains. “How many cubes in each train? How many in all?”',
    strategies: [['“5 + 5 + 1 = 11.”', 'Line up 5 and 5; mark the extra cube.'], ['“6 + 6 − 1 = 11.”', 'Write it next to the trains.']],
    questions: ['Which train is longer? By how much?', 'How many in all?', 'What double is hiding here?', 'How do you know?'], watch: 'Counting both trains from 1.', ext: 'Make trains for 7 and 8.' });
  add('dbl-string', [1, 2], 'Doubles and near doubles', 'Number string: doubles', { text: ['3 + 3', '3 + 4', '5 + 5', '5 + 6', '8 + 8', '8 + 9'] }, {
    purpose: 'Notice how each double helps the next problem.', launch: 'Show one problem at a time. Students solve it in their heads, then share. Then show the next one.',
    strategies: [['“3 + 4 is 3 + 3 and 1 more.”', 'Draw an arrow from 3 + 3 to 3 + 4; write +1.'], ['“5 + 6 is one more than 5 + 5.”', 'Write 10 + 1 = 11.'], ['“8 + 9: 9 + 9 = 18, minus 1.”', 'Write 18 − 1 = 17.']],
    questions: ['How did the problem above help?', 'Which double did you use?', 'Did you add 1 or take away 1? Why?', 'Make up a problem that fits the pattern.'], watch: 'Students who solve each problem from scratch — ask, “Look at the problem above. Does it help?”', ext: 'Ask for 7 + 8 with no double shown.' });

  /* ───────── Making ten ───────── */
  add('mk10-9-4', [1, 2], 'Making ten', 'Double ten frame: 9 and 4', frame('double', 9, 0, 0, 4), {
    purpose: 'Move counters to make a full ten.', launch: FLASH + ' “How many in all? How could you make a ten?”',
    strategies: [['“Move 1 to make 10, then 3 more: 13.”', 'Draw an arrow moving 1; write 10 + 3 = 13.'], ['“9 + 4 is 1 less than 10 + 4.”', 'Write 10 + 4 = 14, 14 − 1 = 13.'], ['“Counted on: 10, 11, 12, 13.”', 'Write 9 → 10, 11, 12, 13.']],
    questions: ['How many?', 'How did you make a ten?', 'Why is 10 easy to add to?', 'Can someone explain ___’s way in their own words?'], watch: 'Moving more than one counter to fill the frame.', ext: 'Try 8 and 5, then 7 and 6.' });
  add('mk10-8-5', [1, 2], 'Making ten', 'Double ten frame: 8 and 5', frame('double', 8, 0, 0, 5), {
    purpose: 'Break a number apart to make 10.', launch: FLASH + ' ' + SIGNAL,
    strategies: [['“Take 2 from the 5 to make 10, then 3: 13.”', 'Write 5 as 2 + 3 (number bond); 8 + 2 = 10; 10 + 3 = 13.'], ['“5 + 5 + 3.”', 'Circle 5 and 5 across frames.']],
    questions: ['How many?', 'How many did you move?', 'Why that many?', 'What number bond helped?'], watch: 'Not knowing the partner for 10 (8 and 2).', ext: 'Show 8 and 7. Ask for two different make-ten ways.' });
  add('mk10-string', [1, 2], 'Making ten', 'Number string: make a ten', { text: ['9 + 1', '9 + 5', '8 + 2', '8 + 6', '7 + 3', '7 + 5'] }, {
    purpose: 'Use the pairs that make 10 to add past 10.', launch: 'Show one at a time. Solve in your head, thumbs up, share.',
    strategies: [['“9 + 5: 9 + 1 = 10, plus 4 = 14.”', 'Draw a number bond under 5: 1 and 4.'], ['“8 + 6: 8 + 2 = 10, plus 4.”', 'Draw a number bond under 6: 2 and 4.']],
    questions: ['How did the problem above help?', 'How did you split the second number?', 'Why split it that way?', 'What is the same in every pair?'], watch: 'Splitting the wrong number or forgetting the leftover part.', ext: '6 + 7 with no helper problem.' });
  add('mk10-cubes', [1, 2], 'Making ten', 'Cube trains: 7 and 6', trains([7, 6]), {
    purpose: 'Make a ten with cubes, then add what is left.', launch: 'Show the trains. “How many in all? How can we make a train of 10?”',
    strategies: [['“Take 3 from the 6 to make 10, 3 left: 13.”', 'Draw a bracket around 10 cubes; write 10 + 3.'], ['“6 + 6 + 1.”', 'Write the double.']],
    questions: ['How many in all?', 'How many cubes would you move?', 'Is there another way?', 'Which way is easiest?'], watch: 'Students who move all 6.', ext: '8 and 7.' });

  /* ───────── Add and subtract within 20 ───────── */
  add('w20-tens', [1, 2], 'Add and subtract within 20', 'Number string: tens and teens', { text: ['10 + 4', '10 + 7', '9 + 7', '19 − 9', '17 − 8'] }, {
    purpose: 'Use 10 to add and subtract quickly.', launch: 'Show one at a time. “Solve it in your head. Thumb up when you have it.”',
    strategies: [['“9 + 7 is 1 less than 10 + 7.”', 'Write 17 − 1 = 16.'], ['“19 − 9 = 10, I took away the 9 ones.”', 'Write 10 and 9; cross out 9.'], ['“17 − 8: 17 − 7 = 10, then 1 more: 9.”', 'Draw hops back on a number line: −7, −1.']],
    questions: ['Which problem helped you?', 'How did you use 10?', 'Can you check with addition?', 'Did anyone count back? How?'], watch: 'Counting back by ones for every problem.', ext: '15 − 7 with no helper.' });
  add('w20-sub', [1, 2], 'Add and subtract within 20', 'Number string: take away to 10', { text: ['14 − 4', '14 − 5', '15 − 5', '15 − 7', '13 − 6'] }, {
    purpose: 'Subtract back through 10.', launch: 'Show one at a time. Students solve, share, and you record.',
    strategies: [['“14 − 5: take 4 to get to 10, then 1 more: 9.”', 'Number line: 14 → 10 → 9.'], ['“Think addition: 7 + ? = 15, so 8.”', 'Write 7 + 8 = 15.'], ['“13 − 6: 6 + 6 = 12, so 7.”', 'Write the double.']],
    questions: ['How did you use 10?', 'Who thought of addition?', 'How can you check?', 'Which problem was hardest? Why?'], watch: 'Taking away the 1 from the 10 instead of the ones.', ext: 'Write a story for 15 − 7.' });
  add('w20-8-7', [1, 2], 'Add and subtract within 20', 'Double ten frame: 8 and 7', frame('double', 8, 0, 7, 0), {
    purpose: 'Choose a strategy: make ten or doubles.', launch: FLASH + ' ' + SIGNAL,
    strategies: [['“Make 10: 8 + 2, then 5: 15.”', 'Move 2; write 10 + 5.'], ['“7 + 7 + 1 = 15.”', 'Write the double.'], ['“5 + 5 = 10, 3 + 2 = 5, so 15.”', 'Circle both 5s.']],
    questions: ['How many?', 'How did you see it?', 'Which strategy is like ___’s?', 'Would you use the same way for 9 + 6?'], watch: 'Students who do not see the 5s in each frame.', ext: 'Ask for 3 different number sentences for the picture.' });
  add('w20-dom', [0, 1], 'Add and subtract within 20', 'Dominoes: turn it around', { t: 'dominoes', s: { set: 9, d: [[6, 3, 60, 60], [3, 6, 260, 60]] } }, {
    purpose: 'See that order does not change the total.', launch: 'Show both dominoes. “What do you notice? What do you wonder?”',
    strategies: [['“Both are 9.”', 'Write 6 + 3 = 9 and 3 + 6 = 9.'], ['“It is the same domino turned around.”', 'Draw a turning arrow.']],
    questions: ['How many on each domino?', 'What is the same? Different?', 'Is that always true?', 'Can you find another pair?'], watch: 'Thinking a different order means a different total.', ext: 'Ask: “Does it work for take away?”' });
  add('w20-groups', [1, 2], 'Add and subtract within 20', 'Counters: how many?', { t: 'counters', s: { mode: 'array', r: 2, c: 7, flip: ['0,5', '0,6', '1,5', '1,6'], tf: 'one', split: 0 } }, {
    purpose: 'Use rows and colors to find a total.', launch: FLASH + ' “How many counters? How did you see them?”',
    strategies: [['“Two rows of 7: 14.”', 'Write 7 + 7 = 14.'], ['“10 red and 4 yellow.”', 'Write 10 + 4 = 14.'], ['“5 and 5 red, then 4.”', 'Circle groups.']],
    questions: ['How many?', 'How many red? Yellow?', 'What double do you see?', 'Which way was quickest?'], watch: 'Counting by ones across both rows.', ext: 'Flip 2 more to yellow. How many red now?' });

  /* ───────── Place value and tens ───────── */
  add('pv-sticks-23', [1, 2], 'Place value and tens', 'Bundles: 2 tens 3 ones', { t: 'sticks', s: { t: 2, o: 3, mx: 100 } }, {
    purpose: 'See a number as tens and ones.', launch: 'Show it. “How many sticks? How do you know without counting every stick?”',
    strategies: [['“10, 20, 21, 22, 23.”', 'Write 10, 20 → 21, 22, 23.'], ['“2 tens and 3 ones is 23.”', 'Write 20 + 3 = 23.']],
    questions: ['How many in each bundle?', 'How many tens? Ones?', 'How do we write it?', 'What if we add one more bundle?'], watch: 'Writing 203 for 2 tens 3 ones.', ext: 'Add 1 stick, then 1 bundle. What changes?' });
  add('pv-sticks-412', [1, 2], 'Place value and tens', 'Bundles: 4 tens 12 ones', { t: 'sticks', s: { t: 4, o: 12, mx: 100 } }, {
    purpose: 'Regroup 10 ones as 1 ten.', launch: 'Show it. “How many sticks in all?”',
    strategies: [['“Bundle 10 ones: 5 tens 2 ones = 52.”', 'Draw a ring around 10 ones; write 50 + 2.'], ['“40 + 12 = 52.”', 'Write it.']],
    questions: ['How many tens? Ones?', 'Can we make another bundle?', 'Is 4 tens 12 ones the same as 5 tens 2 ones?', 'How do you know?'], watch: 'Writing 412.', ext: 'Show 3 tens 15 ones.' });
  add('pv-discs', [2], 'Place value and tens', 'Discs: 135', { t: 'discs', s: { hi: 2, lo: 0, c: { 2: 1, 1: 3, 0: 5 }, cap: 1 } }, {
    purpose: 'Read a three-digit number from discs.', launch: 'Show it. “What number do the discs show?”',
    strategies: [['“100, 110, 120, 130, 135.”', 'Write the skip count.'], ['“1 hundred 3 tens 5 ones.”', 'Write 100 + 30 + 5 = 135.']],
    questions: ['What is each disc worth?', 'How did you count?', 'What if I add a 10 disc?', 'What is 10 less?'], watch: 'Counting every disc as 1.', ext: 'Show 1 hundred 13 tens 5 ones.' });
  add('pv-string', [2], 'Place value and tens', 'Number string: add tens', { text: ['30 + 5', '30 + 15', '40 + 25', '45 + 25'] }, {
    purpose: 'Add tens to tens and ones to ones.', launch: 'One problem at a time. Solve, share, record.',
    strategies: [['“40 + 25: 40 + 20 = 60, plus 5.”', 'Write 60 + 5 = 65.'], ['“45 + 25: 40 + 20 and 5 + 5.”', 'Write 60 + 10 = 70.']],
    questions: ['How did the problem before help?', 'What did you do with the tens? Ones?', 'Who made a ten?', 'How can you check?'], watch: 'Adding 4 + 2 + 5 + 5 as digits without place value.', ext: '47 + 25.' });
  add('pv-line', [1, 2], 'Place value and tens', 'Where is the dot?', { t: 'numberline', s: { a: 0, b: 100, parts: 10, mode: 'whole', lab: 'ends', simp: 0, two: 0, parts2: 8, hop: 0, dots: ['0:7'], hops: [] } }, {
    purpose: 'Use tens to estimate on a number line.', launch: 'Show it. “What number is the dot on? How do you know?”',
    strategies: [['“Each jump is 10, so 70.”', 'Label 10, 20, … under the marks.'], ['“It is past halfway, so more than 50.”', 'Mark 50.']],
    questions: ['What is each mark worth?', 'Where is 50?', 'What number is 10 more?', 'Where would 75 be?'], watch: 'Thinking each mark is 1.', ext: 'Ask where 35 would be.' });
  add('pv-10more', [1, 2], 'Place value and tens', '10 more, 10 less', { text: ['47', '10 more?', '10 less?', '20 more?', '9 more?'] }, {
    purpose: 'Change the tens digit without counting by ones.', launch: 'Show 47. Then ask each question.',
    strategies: [['“57, the tens go up.”', 'Write 47 → 57; circle the tens digit.'], ['“9 more is 10 more, minus 1.”', 'Write 57 − 1 = 56.']],
    questions: ['Which digit changed?', 'Why did only that digit change?', 'How did 10 more help with 9 more?', 'What about 100 more?'], watch: 'Counting on by ones.', ext: 'Start at 95: 10 more?' });

  /* ───────── Add and subtract within 100 ───────── */
  add('w100-20', [1, 2], 'Add and subtract within 100', 'Take away from tens', { text: ['20 − 8', '20 − 12', '30 − 12', '40 − 18'] }, {
    purpose: 'Subtract from a multiple of 10.', launch: 'One problem at a time. Solve in your head, then share.',
    strategies: [['“20 − 10 = 10, then − 2 = 8.”', 'Number line: 20 → 10 → 8.'], ['“Add up: 12 + 8 = 20.”', 'Write 12 + ? = 20.'], ['“30 − 12 is 10 more than 20 − 12.”', 'Arrow from 8 to 18.']],
    questions: ['How did the problem before help?', 'Who counted up? Who took away?', 'How can you check?', 'Which way works best for 40 − 18?'], watch: 'Writing 20 − 8 = 28 (taking the smaller digit from the bigger one in the ones place: 8 − 0 instead of 10 − 8).', ext: '100 − 24.' });
  add('w100-100', [2], 'Add and subtract within 100', '100 − 24 and 98 + 34', { text: ['100 − 24', '98 + 34'] }, {
    purpose: 'Use friendly numbers like 100.', launch: 'Show the first problem. Solve, share, record, then the second.',
    strategies: [['“Add up from 24: 26 to 50, 50 to 100: 76.”', 'Number line with jumps +6, +70 or +26, +50.'], ['“98 + 34: 98 + 2 = 100, plus 32 = 132.”', 'Number bond under 34: 2 and 32.'], ['“100 + 34 − 2.”', 'Write 134 − 2 = 132.']],
    questions: ['Why is 100 helpful?', 'Who added up?', 'Who changed a number to make it easier?', 'How can you check 76?'], watch: 'Regrouping errors like 100 − 24 = 86.', ext: '200 − 47.' });
  add('w100-23-28', [2], 'Add and subtract within 100', '23 + 28', { text: ['23 + 28'] }, {
    purpose: 'Compare strategies for two-digit addition.', launch: 'Show it horizontally. “Solve it in your head. Find a second way if you can.”',
    strategies: [['Tens and ones: 20 + 20 = 40, 3 + 8 = 11, 40 + 11.', 'Write it in two lines.'], ['Make a ten: 28 + 2 = 30, 30 + 21 = 51.', 'Number bond under 23.'], ['Friendly number: 23 + 30 = 53, minus 2.', 'Write 53 − 2 = 51.']],
    questions: ['Who did it a different way?', 'How are ___’s and ___’s ways alike?', 'Which way would you use for 39 + 28?', 'How can you check?'], watch: 'Forgetting the 1 ten in 11 (writing 411 or 41).', ext: '39 + 28.' });
  add('w100-32-18', [2], 'Add and subtract within 100', '32 − 18', { text: ['32 − 18'] }, {
    purpose: 'Subtract with regrouping using mental strategies.', launch: 'Show it. Students solve, then share.',
    strategies: [['Add up: 18 + 2 = 20, + 12 = 32, so 14.', 'Number line from 18 to 32.'], ['Take away 20, add 2 back: 12 + 2 = 14.', 'Write 32 − 20 + 2.'], ['Same difference: 34 − 20 = 14.', 'Add 2 to both numbers.']],
    questions: ['Who added up?', 'Why did ___ add 2 back?', 'Does adding to both numbers work? Why?', 'How can you check?'], watch: '32 − 18 = 26 (8 − 2 instead of 12 − 8).', ext: '53 − 27.' });
  add('w100-hops', [2], 'Add and subtract within 100', 'What problem do these hops show?', { t: 'numberline', s: { a: 30, b: 70, parts: 40, mode: 'whole', lab: 'ends', simp: 0, two: 0, parts2: 8, hop: 1, dots: ['0:8'], hops: [[0, 8, 18], [0, 18, 28], [0, 28, 33]] } }, {
    purpose: 'Connect hops on a number line to addition.', launch: 'Show it. “What problem could this be? What is the answer?”',
    strategies: [['“38 + 25 = 63: plus 10, plus 10, plus 5.”', 'Write the hops above the line.'], ['“38 + 20 + 5.”', 'Group the two tens.']],
    questions: ['Where does it start?', 'How big is each hop?', 'What is the total jump?', 'Could you do it in fewer hops?'], watch: 'Reading tick marks as ones when labels are only at the ends.', ext: 'Show 63 − 25 with hops back.' });
  add('w100-cubes', [0, 1], 'Add and subtract within 20', 'Towers: which is taller?', trains([5, 8], true), {
    purpose: 'Compare two amounts: how many more?', launch: 'Show the towers. “Which is taller? How many more cubes?”',
    strategies: [['“8 is 3 more than 5.”', 'Draw a line across at 5; circle 3 extra.'], ['“Count up from 5: 6, 7, 8.”', 'Write 5 + 3 = 8.']],
    questions: ['Which tower has more?', 'How many more?', 'How could we make them the same?', 'What number sentence matches?'], watch: 'Answering with the total (13) instead of the difference.', ext: 'Make them equal by moving cubes.' });

  /* ───────── Which one doesn't belong ───────── */
  add('wodb-nums', [1, 2], 'Which one doesn’t belong', 'WODB: 6, 10, 9, 16', { wodb: ['6', '10', '9', '16'] }, {
    purpose: 'Reason about number properties. Every answer can be right with a reason.', launch: 'Show the four numbers. “Which one doesn’t belong? Why?” Push for a reason for each number.',
    strategies: [['“9 — it’s the only odd one.”', 'Write odd under 9.'], ['“16 — it’s the only one bigger than 10.”', 'Write > 10.'], ['“10 — it’s the only one with a 0.”', 'Circle the 0.'], ['“6 — it’s the only one you can make with one dice.”', 'Draw a dice face.']],
    questions: ['Which one doesn’t belong?', 'Who chose a different one?', 'Can we find a reason for every number?', 'Do you agree? Why?'], watch: 'Students who think there is one right answer.', ext: 'Students make their own WODB set.' });
  add('wodb-shapes', [-1, 0, 1], 'Which one doesn’t belong', 'WODB: shapes', { wodb: ['square', 'rectangle', 'triangle', 'circle'] }, {
    purpose: 'Use shape words to describe and compare.', launch: 'Show the shapes. “Which one doesn’t belong? Why?”',
    strategies: [['“The circle has no corners.”', 'Write 0 corners.'], ['“The triangle has 3 sides.”', 'Write 3 sides.'], ['“The rectangle is long.”', 'Ask what “long” means; label sides.'], ['“The square has 4 sides that match.”', 'Mark equal sides.']],
    questions: ['How many sides? Corners?', 'Who picked a different shape?', 'What is the same about two of them?', 'Can every shape be the odd one out?'], watch: 'Calling the square “not a rectangle” — a good discussion for Grade 2.', ext: 'Find these shapes in the room.' });
  add('wodb-tens', [1, 2], 'Which one doesn’t belong', 'WODB: 12, 20, 15, 21', { wodb: ['12', '20', '15', '21'] }, {
    purpose: 'Use tens and ones, odd and even, to explain.', launch: 'Show the numbers. “Which one doesn’t belong?”',
    strategies: [['“20 — it has 0 ones.”', 'Circle the 0.'], ['“15 — it ends in 5.”', 'Circle 5.'], ['“21 — it’s the only odd number above 20.”', 'Write odd.'], ['“12 — it’s the smallest, the only one less than 15.”', 'Write 12 < 15.']],
    questions: ['Which one doesn’t belong?', 'How many tens and ones?', 'Odd or even?', 'Can you give a reason for each?'], watch: 'Reasons that just name the number (“because it’s 15”).', ext: 'Swap one number and ask again.' });
  add('wodb-dots', [-1, 0], 'Which one doesn’t belong', 'WODB: dot pictures', { wodb: ['3 dots', '4 dots', '3 dots in a line', '5 dots'] }, {
    purpose: 'Compare small amounts and how they are arranged.', launch: 'Show the four pictures. “Which one doesn’t belong?”',
    strategies: [['“The line is different.”', 'Trace the line.'], ['“5 has the most.”', 'Write 5.'], ['“The two 3s match.”', 'Draw an equal sign.']],
    questions: ['How many dots in each?', 'Which have the same number?', 'Which looks different?', 'Can you find another reason?'], watch: 'Only noticing shape, not amount (or the other way around).', ext: 'Draw your own set of four.' });

  /* ───────── Grades 3–5 ───────── */
  add('mx-6', [3, 4], 'Multiplication strings', 'Number string: double it', { text: ['2 × 6', '4 × 6', '8 × 6', '8 × 12'] }, {
    purpose: 'Double one factor to double the product.', launch: 'Show one problem at a time. Solve in your head, share, record.',
    strategies: [['“4 × 6 is double 2 × 6: 24.”', 'Arrow from 12 to 24; write ×2.'], ['“8 × 12 is double 8 × 6.”', 'Write 48 × 2 = 96.']],
    questions: ['How did the problem before help?', 'What changed? What stayed the same?', 'Why does doubling one factor double the product?', 'What would 16 × 6 be?'], watch: 'Doubling both factors.', ext: '3 × 6 to 6 × 6 to 12 × 6.' });
  add('mx-7', [3, 4], 'Multiplication strings', 'Number string: 10 and 1 more or less', { text: ['10 × 7', '9 × 7', '11 × 7', '12 × 7'] }, {
    purpose: 'Use 10 × to find nearby facts.', launch: 'One at a time. Solve, share, record.',
    strategies: [['“9 × 7 is 70 − 7 = 63.”', 'Draw an array of 10 rows of 7; cross out one row.'], ['“12 × 7 = 70 + 14.”', 'Split 12 into 10 + 2.']],
    questions: ['How did 10 × 7 help?', 'Why subtract 7, not 9?', 'How else could you find 12 × 7?', 'Which fact do you know best?'], watch: 'Subtracting the wrong number (70 − 9).', ext: '9 × 8, 11 × 8.' });
  add('mx-12', [4], 'Multiplication strings', 'Number string: 5, 10, 15 groups', { text: ['5 × 12', '10 × 12', '15 × 12'] }, {
    purpose: 'Combine partial products.', launch: 'One at a time. Solve, share, record.',
    strategies: [['“15 × 12 = 10 × 12 + 5 × 12.”', 'Write 120 + 60 = 180.'], ['“Half of 10 × 12 is 5 × 12.”', 'Arrow: ÷2.']],
    questions: ['How do the first two help with the third?', 'Why can we add them?', 'Could you use 15 × 10 and 15 × 2?', 'Draw it as an area model.'], watch: 'Adding factors instead of products.', ext: '25 × 12.' });
  add('mx-25', [4, 5], 'Multiplication strings', 'Number string: 25s', { text: ['25 × 4', '25 × 8', '25 × 16', '25 × 24'] }, {
    purpose: 'Use 25 × 4 = 100 to multiply quickly.', launch: 'One at a time. Solve, share, record.',
    strategies: [['“25 × 8 is two 25 × 4s: 200.”', 'Write 100 + 100.'], ['“25 × 24: 24 is 6 fours, so 600.”', 'Write 6 × 100.']],
    questions: ['How many 4s are in 16?', 'Why is 25 × 4 helpful?', 'Can you think of money to help?', 'What is 25 × 40?'], watch: 'Losing track of how many groups of 4.', ext: '25 × 36.' });
  add('mx-array', [3], 'Multiplication strings', 'Array: 6 rows of 7', { t: 'counters', s: { mode: 'array', r: 6, c: 7, flip: [], tf: 'one', split: 5 } }, {
    purpose: 'Split a hard fact into easy facts.', launch: 'Show the split array. “How many counters? How does the line help?”',
    strategies: [['“6 × 5 = 30 and 6 × 2 = 12, so 42.”', 'Write the two products under each side.'], ['“7 × 6 = 42, I know it.”', 'Ask how they could show it.']],
    questions: ['How many rows? In each row?', 'Why split at 5?', 'Where else could we split?', 'What two facts do you see?'], watch: 'Adding instead of multiplying the parts.', ext: 'Split at a different column.' });
  add('fr-wall', [3, 4], 'Fractions', 'Which is more?', { t: 'fbars', s: { d: [2, 3, 4], w: 1, lab: 1, bm: 'wall', bt: [], sh: { 3: [0, 1], 4: [0, 1, 2] }, gd: 1, gx: 0.5 } }, {
    purpose: 'Compare fractions using a picture.', launch: 'Show the tiles. “Which is more, two thirds or three fourths? How do you know?”',
    strategies: [['“Three fourths is closer to 1 whole.”', 'Mark the missing pieces: one fourth vs. one third.'], ['“The fourths line goes further.”', 'Drag the yellow line to compare.']],
    questions: ['How much is missing from each?', 'Which missing piece is smaller?', 'How does the whole help?', 'What about five sixths?'], watch: 'Thinking bigger denominators always mean bigger fractions.', ext: 'Order two thirds, three fourths and four fifths.' });
  add('fr-string', [4, 5], 'Fractions', 'Number string: halves and fourths', { text: ['[1/2] + [1/4]', '[1/2] + [3/4]', '[3/4] + [3/4]', '1[1/2] + [3/4]'] }, {
    purpose: 'Add fractions using halves and fourths.', launch: 'One at a time. Solve, share, record (use a number line).',
    strategies: [['“One half is two fourths, so three fourths.”', 'Write the equivalence.'], ['“Three fourths + one fourth makes 1, one half left.”', 'Number line with a jump to 1.']],
    questions: ['How did you change the half?', 'Where is 1 on your number line?', 'Did anyone make a whole first?', 'How can you check?'], watch: 'Adding tops and bottoms (two sixths).', ext: '2[1/4] + 1[3/4].' });
  add('dec-string', [5], 'Fractions', 'Number string: make 1', { text: ['0.5 + 0.5', '0.25 + 0.75', '0.6 + 0.45', '1.3 − 0.45'] }, {
    purpose: 'Use 1 whole to add and subtract decimals.', launch: 'One at a time. Solve, share, record.',
    strategies: [['“0.6 + 0.4 = 1, plus 0.05.”', 'Write the break-apart.'], ['“1.3 − 0.3 = 1, − 0.15 = 0.85.”', 'Number line back to 1.']],
    questions: ['How did you use 1?', 'Is 0.6 the same as 0.60?', 'How can money help?', 'How can you check?'], watch: 'Lining up digits from the right (0.6 + 0.45 = 0.51).', ext: '2.75 + 1.5.' });
  add('wodb-35', [3, 4, 5], 'Which one doesn’t belong', 'WODB: 9, 16, 25, 43', { wodb: ['9', '16', '25', '43'] }, {
    purpose: 'Reason about factors, square numbers and primes.', launch: 'Show the numbers. “Which one doesn’t belong? Give a reason.”',
    strategies: [['“43 — it’s prime.”', 'Write factors of each.'], ['“16 — it’s the only even one.”', 'Write even.'], ['“9 — it’s the only one-digit number.”', 'Circle it.'], ['“25 — it’s the only multiple of 5.”', 'Write ×5.']],
    questions: ['What do 9, 16, 25 have in common?', 'What are the factors of 43?', 'Can every number be the odd one out?', 'Do you agree with ___? Why?'], watch: 'Reasons that aren’t true for just one number.', ext: 'Make a WODB with four fractions.' });

  /* ───────── Fraction talks (Grades 3–5): a picture with a shaded part. “What fraction is shaded? How do you see it?” ───────── */
  var FT = 'Show the picture. “What fraction is shaded? How do you see it?” Collect every answer before anyone explains.';
  function wall(d, idx) { var sh = {}; sh[d] = idx; return { t: 'fbars', s: { d: [d], w: 1, lab: 0, bm: 'wall', bt: [], sh: sh, gd: 0, gx: 0.5 } }; }
  function circles(c, n, sh) { return { t: 'fcircles', s: { c: c, n: n, per: 0, ns: [n, n, n, n], lab: 0, sh: sh.concat([[], [], []]).slice(0, 4) } }; }
  function dgrid(bits) { return { t: 'decgrid', s: { m: 'h', c: 1, sh: [bits, '', ''], pct: 0 } }; }
  function arr(r, c, flip, split) { return { t: 'counters', s: { mode: 'array', r: r, c: c, flip: flip || [], tf: 'one', split: split || 0 } }; }
  add('ft-bar-34', [3, 4], 'Fraction talks', 'Fraction talk: 3 of 4 tiles', wall(4, [0, 1, 2]), {
    purpose: 'Name a fraction from a picture and see it more than one way.', launch: FT,
    strategies: [['“3 of the 4 parts, so [3/4].”', 'Write [3/4] under the bar; count the parts aloud.'], ['“1 part is missing, so it’s 1 take away [1/4].”', 'Write 1 − [1/4] = [3/4].'], ['“A half and a fourth.”', 'Draw a line after 2 tiles; write [1/2] + [1/4].']],
    questions: ['How many parts in the whole? How do you know they are equal?', 'What fraction is not shaded?', 'Who saw a half in there?', 'What if one more tile were shaded?'], watch: 'Saying “3 out of 1” or counting shaded over unshaded ([3/1]). Ask how many parts make the whole.', ext: 'Shade 6 of 8 tiles. Same amount? How do you know?' });
  add('ft-bar-26', [3, 4], 'Fraction talks', 'Fraction talk: tiles apart', wall(6, [1, 4]), {
    purpose: 'The shaded parts do not have to touch. Equal parts can be anywhere.', launch: FT,
    strategies: [['“2 of 6 are shaded, [2/6].”', 'Write [2/6].'], ['“Push them together and it’s [1/3]: 2 tiles fill a third of the bar.”', 'Draw the two tiles side by side; write [2/6] = [1/3].'], ['“4 are not shaded, so [4/6] is white.”', 'Write [4/6] white, [2/6] shaded.']],
    questions: ['Does it matter that the shaded tiles are apart?', 'How many tiles make a third of this bar?', 'What fraction is white?', 'Can you say the shaded part another way?'], watch: 'Counting the gap between the tiles as one part.', ext: 'Shade 3 tiles that do not touch. What fraction? Is it a half?' });
  add('ft-circle-38', [3, 4], 'Fraction talks', 'Fraction talk: slices of 8', circles(1, 8, [[0, 1, 2]]), {
    purpose: 'See eighths, and compare a fraction to a half.', launch: FT,
    strategies: [['“3 of 8 slices, [3/8].”', 'Write [3/8]; count the slices.'], ['“Less than half. Half would be 4 slices.”', 'Draw the half line; write [3/8] < [1/2].'], ['“A fourth and an eighth.”', 'Mark 2 slices as [1/4]; write [1/4] + [1/8].']],
    questions: ['How many slices make the whole?', 'Is it more or less than half? How do you know?', 'How many more slices would make a half?', 'What fraction is not shaded?'], watch: 'Reading it as [3/5] (shaded over unshaded).', ext: 'Shade 6 of 8. What is that as fourths?' });
  add('ft-circle-mixed', [3, 4, 5], 'Fraction talks', 'Fraction talk: more than one whole', circles(2, 4, [[0, 1, 2, 3], [0]]), {
    purpose: 'Name an amount bigger than 1 as a mixed number and as a fraction.', launch: 'Show both circles. “How much is shaded? Say it two ways.”',
    strategies: [['“One whole and one fourth: 1[1/4].”', 'Write 1[1/4].'], ['“5 fourths, because 4 and 1 more slice.”', 'Write [5/4]; count 1, 2, 3, 4, 5 fourths.'], ['“Half of the second circle would be 2 slices, so it’s less than 1[1/2].”', 'Write 1[1/4] < 1[1/2].']],
    questions: ['How many fourths in one whole?', 'How many fourths are shaded in all?', 'How do you know 1[1/4] and [5/4] are the same?', 'How much more to make 2?'], watch: 'Saying [5/8] because there are 8 slices on the screen. Ask how many slices make one whole.', ext: 'Shade 7 slices. Mixed number? Fraction?' });
  add('ft-pattern', [3, 4], 'Fraction talks', 'Fraction talk: pattern blocks', { t: 'pattern', s: { b: [['hex', 150, 320, 0], ['trap', 330, 330, 0], ['rh', 470, 330, 0], ['tri', 590, 330, 0]], mirror: 'none', frac: false, sel: -1 } }, {
    purpose: 'If the hexagon is 1, name each block as a fraction, then add them.', launch: 'Show the blocks. “The yellow hexagon is 1 whole. What is each other block worth? What are the three of them worth together?”',
    strategies: [['“Two trapezoids cover the hexagon, so the red one is [1/2].”', 'Draw the line across the hexagon; write [1/2].'], ['“Three blue ones cover it: [1/3]. Six green: [1/6].”', 'Write [1/3] and [1/6] under the blocks.'], ['“[1/2] + [1/3] + [1/6] is exactly 1. They would cover the hexagon.”', 'Write the sum; drag the three blocks onto the hexagon to prove it.']],
    questions: ['How do you know the trapezoid is a half?', 'How many triangles make a rhombus? A trapezoid?', 'Do the three blocks make a whole hexagon? Prove it.', 'What if the trapezoid were 1 whole instead?'], watch: 'Calling the triangle [1/3] because it has 3 sides.', ext: 'Make 1[1/2] with blocks two different ways.' });
  add('ft-grid-35', [4, 5], 'Fraction talks', 'Fraction talk: 0.35 on the grid', dgrid('ffffffffe'), {
    purpose: 'Read a shaded hundredths grid as a decimal and as a fraction.', launch: 'Show the grid. “What part is shaded? Say it as a decimal and as a fraction.”',
    strategies: [['“3 full columns and 5 more squares: 35 hundredths.”', 'Write 0.35 and [35/100].'], ['“3 tenths and 5 hundredths.”', 'Write 0.3 + 0.05 = 0.35.'], ['“35 of 100 is the same as 7 of 20.”', 'Write [7/20]; circle groups of 5.']],
    questions: ['What is one column worth? One small square?', 'How is 0.35 the same as 0.3 and 0.05?', 'Is it more or less than a third? Than a half?', 'How much more to make 1?'], watch: 'Reading 3 columns as 3 hundredths (0.03).', ext: 'Shade 0.35 a different way. Is it still 0.35?' });
  add('ft-grid-square', [4, 5], 'Fraction talks', 'Fraction talk: the 5 by 5 square', dgrid('f83e0f83e0f8'), {
    purpose: 'See 25 hundredths as a fourth and as 0.25.', launch: FT + ' Then ask for a decimal.',
    strategies: [['“5 rows of 5 is 25, so [25/100] or 0.25.”', 'Write 5 × 5 = 25; write 0.25.'], ['“It’s a fourth of the grid: four of those squares fill it.”', 'Draw the other three squares; write [1/4].'], ['“A quarter, like 25 cents.”', 'Write 25¢ is [1/4] of a dollar.']],
    questions: ['How did you count 25 so fast?', 'How many 5 by 5 squares fill the grid?', 'How do you know [25/100] is [1/4]?', 'What would half the grid look like?'], watch: 'Counting the shaded squares one by one.', ext: 'Shade a square that is [1/4] of the grid a different way (not in a corner).' });
  add('ft-grid-L', [4, 5], 'Fraction talks', 'Fraction talk: the L shape', dgrid('ffe00802008020080200802'), {
    purpose: 'Count a tricky shape without counting every square, and avoid double counting the corner.', launch: FT + ' “Count a quick way.”',
    strategies: [['“A column of 10 and a row of 10, but the corner is in both: 10 + 10 − 1 = 19.”', 'Write 10 + 10 − 1 = 19; write 0.19.'], ['“A column of 10 and 9 more across.”', 'Write 10 + 9 = 19.'], ['“I counted 19 hundredths, [19/100].”', 'Write [19/100].']],
    questions: ['Why isn’t it 20?', 'Is 0.19 more or less than 0.2? How can you tell on the grid?', 'How much more to make 0.25?', 'What fraction is not shaded?'], watch: 'Saying 0.20 because they see two tens.', ext: 'Shade 0.19 with no corner at all.' });

  /* ───────── Unit chats: how many? count in different units ───────── */
  var UC = 'Show the picture. “How many? What did you count: the little ones, the groups, the colors?” Collect several different counts, each with its unit.';
  var halfFlip = []; for (var hr = 0; hr < 4; hr++) for (var hc = 3; hc < 6; hc++) halfFlip.push(hr + ',' + hc);
  add('uc-array', [3, 4], 'Unit chats', 'Unit chat: the array', arr(4, 6, halfFlip), {
    purpose: 'The same picture has many right counts. The unit you choose changes the number.', launch: UC,
    strategies: [['“24 counters.”', 'Write 24 counters; ask how they counted (4 rows of 6).'], ['“4 rows. 6 columns.”', 'Write 4 rows, 6 columns; write 4 × 6 = 24.'], ['“12 red and 12 yellow. 2 halves.”', 'Write 12 + 12; write 2 groups of 12.'], ['“12 pairs.”', 'Circle a pair; write 12 × 2 = 24.']],
    questions: ['What did you count?', 'Who counted something different?', 'How many groups of 4? Of 3?', 'What number sentence matches your count?'], watch: 'Students who only count by ones. Ask them to count rows.', ext: 'Flip 4 more counters. What changed? What stayed the same?' });
  add('uc-trains', [2, 3], 'Unit chats', 'Unit chat: cube trains', trains([5, 5, 5, 5]), {
    purpose: 'Count by trains, by cubes and by pairs.', launch: UC,
    strategies: [['“4 trains.”', 'Write 4 trains.'], ['“20 cubes: 5, 10, 15, 20.”', 'Write the skip count; write 4 × 5 = 20.'], ['“10 pairs of cubes.”', 'Circle pairs; write 10 × 2.'], ['“2 red trains and 2 green trains.”', 'Write 2 + 2 = 4 trains, 10 + 10 = 20 cubes.']],
    questions: ['How many cubes? How did you count?', 'How many trains?', 'If each train were 6 long, how many cubes?', 'How many trains of 2 could you make from all the cubes?'], watch: 'Mixing units: “4 cubes” when they mean 4 trains.', ext: 'Break one train into 2 and 3. How many trains now? How many cubes?' });
  add('uc-dominoes', [2, 3], 'Unit chats', 'Unit chat: dominoes', { t: 'dominoes', s: { set: 6, d: [[6, 6, 40, 40], [3, 3, 230, 40], [5, 1, 420, 40]] } }, {
    purpose: 'Count dominoes, halves and dots, and add three two-part numbers.', launch: UC,
    strategies: [['“3 dominoes.”', 'Write 3.'], ['“6 halves.”', 'Write 6 halves.'], ['“24 dots: 12 + 6 + 6.”', 'Write 12 + 6 + 6 = 24.'], ['“Two of them are doubles.”', 'Write 6 + 6 and 3 + 3.']],
    questions: ['How many dots on each domino?', 'Which domino has the most? The fewest?', 'How many dots in all? How did you add?', 'How many dots if we turned one around?'], watch: 'Counting every dot from 1. Ask for the total of each domino first.', ext: 'Add a domino so the total is 30.' });

  /* ───────── Same and different (two pictures side by side) ───────── */
  var SD = 'Show both pictures. “What is the same? What is different?” Take one of each before any explaining.';
  add('sd-arrays', [3, 4], 'Same and different', 'Same and different: 3 by 4 and 4 by 3', { pair: [arr(3, 4), arr(4, 3)] }, {
    purpose: 'Turning an array changes the shape, not the total.', launch: SD,
    strategies: [['“Both have 12.”', 'Write 12 under each.'], ['“One has 3 rows of 4, the other 4 rows of 3.”', 'Write 3 × 4 and 4 × 3.'], ['“The second one is the first one turned.”', 'Draw a turning arrow.']],
    questions: ['How many in each? How do you know?', 'Why are 3 × 4 and 4 × 3 the same?', 'Is that true for every pair of numbers?', 'What would a 2 by 6 look like?'], watch: 'Thinking the taller one has more.', ext: 'Find every array that has 12.' });
  add('sd-half', [3, 4], 'Same and different', 'Same and different: 2 of 4 and 1 of 2', { pair: [wall(4, [0, 1]), wall(2, [0])] }, {
    purpose: 'Equal fractions look different but cover the same amount.', launch: SD,
    strategies: [['“Both are half shaded.”', 'Write [1/2] under both.'], ['“One is cut into 4 pieces, the other into 2.”', 'Write fourths and halves.'], ['“[2/4] and [1/2] are the same amount.”', 'Write [2/4] = [1/2].']],
    questions: ['How much is shaded in each?', 'How many fourths make a half?', 'Which has more pieces? Which has bigger pieces?', 'What other fractions equal a half?'], watch: 'Saying the fourths bar has more because it has more shaded pieces.', ext: 'Shade [3/6] and [4/8]. Still a half?' });
  add('sd-lines', [4, 5], 'Same and different', 'Same and different: two number lines', { pair: [{ t: 'numberline', s: { a: 0, b: 1, parts: 4, mode: 'frac', lab: 'all', simp: 0, two: 0, parts2: 8, hop: 0, dots: ['0:3'], hops: [] } }, { t: 'numberline', s: { a: 0, b: 100, parts: 4, mode: 'whole', lab: 'all', simp: 0, two: 0, parts2: 8, hop: 0, dots: ['0:3'], hops: [] } }] }, {
    purpose: 'Connect [3/4] of 1 to 75 of 100.', launch: SD,
    strategies: [['“Both dots are in the same place.”', 'Draw a line connecting the dots.'], ['“One says [3/4], the other says 75.”', 'Write [3/4] and 75.'], ['“75 is [3/4] of 100, like 3 quarters is 75 cents.”', 'Write [3/4] = [75/100] = 0.75.']],
    questions: ['What number is each dot on?', 'How is 75 like [3/4]?', 'Where would [1/2] be on the bottom line?', 'What would 0.75 look like on a tenths line?'], watch: 'Reading the bottom dot as 3 because it is on the third mark.', ext: 'Move both dots to the second mark. Same and different?' });

  /* ───────── Counterexamples ───────── */
  var CE = 'Show one claim at a time. “True or false? If it’s false, find one example that breaks it.” One good counterexample is enough.';
  add('ce-mult5', [3, 4], 'Counterexamples', 'Counterexamples: multiples', { text: ['Every multiple of 5 ends in 5.', 'Every even number can be split into two equal groups.', 'Every number that ends in 2 is a multiple of 4.', 'Every multiple of 6 is a multiple of 3.'] }, {
    purpose: 'Test a claim with examples, and understand that one counterexample proves it false.', launch: CE,
    strategies: [['“10 is a multiple of 5 and ends in 0. False.”', 'Write 10, 20, 30 as counterexamples.'], ['“Even numbers always split into two equal groups. True.”', 'Draw 8 as 4 and 4; ask how we know it works for all.'], ['“2 and 6 end in 2 but 4 doesn’t go into them. False.”', 'Write 2, 6, 14, 22.'], ['“6, 12, 18, 24 are all in the 3s. True.”', 'Write 6 = 2 × 3, so every 6 is two 3s.']],
    questions: ['What would a counterexample look like?', 'Is one example enough to prove it false? To prove it true?', 'Can you fix the false claim so it becomes true?', 'How would you convince someone a true claim is always true?'], watch: 'Thinking three examples that work prove a claim.', ext: 'Students write their own claim with a hidden counterexample.' });
  add('ce-always', [4, 5], 'Counterexamples', 'Counterexamples: always, sometimes, never', { text: ['When you subtract, the answer is always smaller.', 'A rectangle with a bigger perimeter has a bigger area.', 'Multiplying always makes a number bigger.'] }, {
    purpose: 'Sort claims into always, sometimes and never with examples.', launch: CE + ' Then ask: “Always, sometimes or never?”',
    strategies: [['“5 − 0 = 5. Not smaller. Sometimes.”', 'Write 5 − 0 = 5.'], ['“A 1 by 10 has perimeter 22 and area 10. A 4 by 4 has perimeter 16 and area 16. False.”', 'Draw both; write P and A under each.'], ['“6 × 1 = 6 and 6 × 0 = 0. Sometimes.”', 'Write 6 × 1, 6 × 0; for Grade 5, 6 × [1/2] = 3.']],
    questions: ['Is it always, sometimes or never? What example shows that?', 'Can you find a case where it works and one where it doesn’t?', 'What change would make the claim always true?', 'Which claim was hardest to break?'], watch: 'Accepting a claim because the first example worked.', ext: '“Dividing always makes a number smaller.” Always, sometimes, never?' });

  /* ───────── Broken calculator ───────── */
  var BC = 'Show the broken calculator rule, then one target at a time. Students find a way, then a second way. Record every way that works.';
  add('bc-43', [3, 4], 'Broken calculator', 'Broken calculator: 4, 3, + and ×', { text: ['Only 4, 3, + and × work.', 'Make 24.', 'Make 15.', 'Make 100.'] }, {
    purpose: 'Build numbers from limited parts, using both adding and multiplying.', launch: BC,
    strategies: [['“4 × 3 + 4 × 3 = 24.”', 'Write 12 + 12 = 24; also 4 + 4 + 4 + 4 + 4 + 4.'], ['“4 × 3 + 3 = 15.”', 'Write 12 + 3; also 3 + 3 + 3 + 3 + 3.'], ['“4 × 4 × 4 + 4 × 3 × 3: 64 + 36 = 100.”', 'Write both parts, then the sum.'], ['“44 + 44 + 4 + 4 + 4 = 100.”', 'Accept it if two-digit keys are allowed; decide the rule together.']],
    questions: ['Which key did you press first? Why?', 'Can you do it with fewer presses?', 'What is the smallest number you cannot make?', 'What if only + worked?'], watch: 'Students who type 24 directly. Remind them only 4 and 3 work.', ext: 'Make 50 and 60. Which is easier?' });
  add('bc-52', [3, 4, 5], 'Broken calculator', 'Broken calculator: 5, 2, + and −', { text: ['Only 5, 2, + and − work.', 'Make 1.', 'Make 13.', 'Make 50.'] }, {
    purpose: 'Reach a target by adding and taking away two numbers, and notice patterns in what is reachable.', launch: BC,
    strategies: [['“5 − 2 − 2 = 1.”', 'Write it.'], ['“5 + 5 + 5 − 2 = 13.”', 'Write 15 − 2 = 13; also 5 + 2 + 2 + 2 + 2.'], ['“Ten 5s make 50.”', 'Write 5 × 10 = 50 as a shortcut, even though × is broken.'], ['“52 − 2 = 50.”', 'Accept it if two-digit keys are allowed.']],
    questions: ['Can you make every number from 1 to 10?', 'Which numbers need a minus?', 'What is the fewest presses for 13?', 'Can you make 50 with fewer than ten 5s?'], watch: 'Students who think 1 cannot be made because both keys are bigger than 1.', ext: 'Only 7, 3, + and − work. Make 1.' });

  /* ───────── Choral counting ───────── */
  var CC = 'Count together out loud while you write the numbers in rows on the board. Stop and ask: “What do you notice? What will come next? Why?”';
  add('cc-3s', [2, 3], 'Choral counting', 'Count by 3s', { t: 'hundred', s: { mode: 'hundred', start: 1, sk1: 3, sk2: 0, hl: {}, fac: 0, fv: 0 } }, {
    purpose: 'Hear and see the pattern in multiples of 3.', launch: CC + ' Start at 0 and count by 3s to 60 or further.',
    strategies: [['“The ones digits go 3, 6, 9, 2, 5, 8, 1, 4, 7, 0 and then repeat.”', 'Underline the ones digits.'], ['“Every tenth number ends in 0: 30, 60, 90.”', 'Circle 30, 60, 90.'], ['“On the chart they make diagonal stripes.”', 'Trace a diagonal.']],
    questions: ['What number comes after 27? How do you know?', 'Will 50 be in our count? Why not?', 'Which multiples of 3 are also multiples of 6?', 'Starting from 3, what is the 20th number we say?'], watch: 'Losing the count when the tens change (27 to 30).', ext: 'Count by 3s starting at 1: 1, 4, 7, 10… What changes?' });
  add('cc-25', [3, 4], 'Choral counting', 'Count by 25s', { t: 'hundred', s: { mode: 'hundred', start: 1, sk1: 25, sk2: 0, hl: {}, fac: 0, fv: 0 } }, {
    purpose: 'Use 25s like quarters, four to a hundred.', launch: CC + ' Start at 0 and count by 25s past 300.',
    strategies: [['“25, 50, 75, 100. Four make a hundred.”', 'Write 4 × 25 = 100.'], ['“It goes 25, 50, 75, 00 over and over.”', 'Underline the last two digits.'], ['“Like quarters: 4 quarters is a dollar.”', 'Draw 4 coins = $1.']],
    questions: ['Starting from 25, what is the 8th number we say? The 12th?', 'How many 25s make 200?', 'Will 325 be in our count? 340?', 'How could counting by 25s help with 25 × 6?'], watch: 'Saying 100, 125, 150, 175, 200 but then slipping to 215.', ext: 'Count back by 25s from 300.' });
  add('cc-dec', [4, 5], 'Choral counting', 'Count by decimals', { text: ['Count by 0.5 from 0.', 'Count by 0.25 from 0.', 'Count by 0.2 from 0.'] }, {
    purpose: 'Decimals count on just like whole numbers; watch where the whole numbers land.', launch: CC + ' Do one count at a time.',
    strategies: [['“0, 0.5, 1, 1.5, 2… every second number is a whole.”', 'Write the count in two columns so wholes line up.'], ['“0.25, 0.5, 0.75, 1: four to a whole, like quarters.”', 'Write 4 × 0.25 = 1.'], ['“0.2, 0.4, 0.6, 0.8, 1: five to a whole.”', 'Write 5 × 0.2 = 1.']],
    questions: ['When do we land on a whole number?', 'Starting from 0.25, what is the 10th number we say?', 'Why does 0.6 come after 0.4, not 0.5?', 'How is counting by 0.2 like counting by 2?'], watch: 'Saying 0.10 after 0.8 when counting by 0.2 (treating tenths as a count to 10).', ext: 'Count by 0.75 from 0. When do you hit a whole?' });

  /* ───────── Guess my number ───────── */
  var GN = 'Pick a secret number and write it where no one can see. Students guess; you say “more” or “less.” Drag a dot onto the line after each guess so the clues stay visible.';
  add('gmn-100', [2, 3, 4], 'Guess my number', 'Guess my number: 0 to 100', { t: 'numberline', s: { a: 0, b: 100, parts: 10, mode: 'whole', lab: 'all', simp: 0, two: 0, parts2: 8, hop: 0, dots: [], hops: [] } }, {
    purpose: 'Use “more” and “less” clues to narrow a range, and see that halving the range is the fastest search.', launch: GN + ' Count the guesses. Can the class do it in 7?',
    strategies: [['“Guess 50 first, that cuts it in half.”', 'Mark 50; say which half is left.'], ['“It’s more than 60 and less than 70, so try 65.”', 'Mark both ends of the range.'], ['“Start at 1 and go up.”', 'Accept it; later ask how many guesses that could take.']],
    questions: ['Which two numbers is it between now?', 'What guess would cut that in half?', 'What is the most guesses you could ever need?', 'Why is 50 a better first guess than 10?'], watch: 'Guesses outside the range the clues already gave.', ext: 'Secret number from 0 to 1,000. Can you still do it in 10 guesses?' });
  add('gmn-dec', [4, 5], 'Guess my number', 'Guess my number: a decimal', { t: 'numberline', s: { a: 0, b: 1, parts: 10, mode: 'dec', lab: 'all', simp: 0, two: 0, parts2: 8, hop: 0, dots: [], hops: [] } }, {
    purpose: 'Order decimals to hundredths between 0 and 1.', launch: GN + ' The secret number has two decimal places, like 0.37.',
    strategies: [['“Guess 0.5 first.”', 'Mark 0.5.'], ['“It’s between 0.3 and 0.4, so try 0.35.”', 'Mark 0.3 and 0.4; zoom in on that tenth.'], ['“0.4 is less, so it’s not 0.38.”', 'Ask them to explain why 0.38 is less than 0.4.']],
    questions: ['Which tenths is it between?', 'How many hundredths are in that tenth?', 'Is 0.37 more or less than 0.4? How do you know?', 'What guess would cut the range in half?'], watch: 'Thinking 0.38 is more than 0.4 because 38 is more than 4.', ext: 'Secret number between 0 and 10 with one decimal place.' });

  /* ───────── Decimal and multiplication strings ───────── */
  add('dec-x10', [4, 5], 'Fractions', 'Number string: times 10, divided by 10', { text: ['3.5 × 10', '3.5 × 100', '0.35 × 10', '35 ÷ 10', '35 ÷ 100'] }, {
    purpose: 'See what happens to each digit when a number is multiplied or divided by 10 and 100.', launch: 'Show one at a time. Solve in your head, thumbs up, share, record.',
    strategies: [['“3.5 × 10 = 35: ten 3.5s is 30 and 5.”', 'Write 10 × 3 + 10 × 0.5 = 30 + 5.'], ['“3.5 × 100 = 350, every digit moves two places.”', 'Write the digits in a place value chart.'], ['“0.35 × 10 = 3.5 and 35 ÷ 10 = 3.5. Same answer!”', 'Draw an arrow between the two problems.'], ['“35 ÷ 100 = 0.35.”', 'Write [35/100] = 0.35.']],
    questions: ['Which way did the digits move? How far?', 'Why do 0.35 × 10 and 35 ÷ 10 match?', 'What is 3.5 × 1,000?', 'How is 35 ÷ 100 like 35 cents?'], watch: 'Adding a zero: 3.5 × 10 = 3.50.', ext: '0.07 × 100 and 7 ÷ 1,000.' });
  add('dec-money', [4, 5], 'Fractions', 'Number string: dollars and cents', { text: ['0.99 + 0.99', '2.5 + 1.75', '5 − 1.25', '4 × 0.25'] }, {
    purpose: 'Use money to add, subtract and multiply decimals.', launch: 'Show one at a time. “Think of dollars and cents.” Solve, share, record.',
    strategies: [['“0.99 + 0.99: 1 + 1 take away 2 cents: 1.98.”', 'Write 2 − 0.02 = 1.98.'], ['“2.5 + 1.75: 2.5 + 1.5 = 4, plus 0.25 = 4.25.”', 'Number bond under 1.75: 1.5 and 0.25.'], ['“5 − 1.25: count up 0.75 to 2, then 3 more: 3.75.”', 'Number line from 1.25 to 5.'], ['“4 quarters is a dollar: 4 × 0.25 = 1.”', 'Draw 4 quarters.']],
    questions: ['How did money help?', 'Is 2.5 the same as 2.50? Why?', 'Who counted up? Who took away?', 'What is 8 × 0.25?'], watch: 'Lining up 2.5 and 1.75 from the right (2.5 + 1.75 = 1.100).', ext: '3 × 1.99.' });
  add('mx-double-half', [4, 5], 'Multiplication strings', 'Number string: double one, halve the other', { text: ['16 × 5', '8 × 10', '24 × 5', '12 × 10', '36 × 5'] }, {
    purpose: 'Doubling one factor and halving the other keeps the product the same.', launch: 'Show one at a time. Solve, share, record. After the second problem, ask what students notice.',
    strategies: [['“16 × 5 = 80 and 8 × 10 = 80. Same!”', 'Draw a 16 by 5 array cut in half and stacked into 8 by 10.'], ['“24 × 5: half of 24 is 12, 12 × 10 = 120.”', 'Write 24 × 5 = 12 × 10 = 120.'], ['“36 × 5 = 18 × 10 = 180.”', 'Write it.']],
    questions: ['Why does halving one and doubling the other work?', 'Which number did you halve? Why that one?', 'Would it work for 15 × 5?', 'Can you use it for 25 × 12?'], watch: 'Halving both numbers.', ext: '48 × 25 (halve and double twice).' });
  add('mx-9s', [3, 4], 'Multiplication strings', 'Number string: nines from tens', { text: ['9 × 6', '9 × 8', '99 × 6', '99 × 8'] }, {
    purpose: 'Use 10 × and 100 × to find 9 × and 99 ×.', launch: 'Show one at a time. Solve, share, record. Point to the problem above when the next one comes.',
    strategies: [['“10 × 6 = 60, take away one 6: 54.”', 'Write 60 − 6 = 54.'], ['“9 × 8 = 80 − 8 = 72.”', 'Write it.'], ['“99 × 6 = 600 − 6 = 594.”', 'Write 100 × 6 − 6.'], ['“99 × 8 = 800 − 8 = 792.”', 'Write it.']],
    questions: ['Why take away one 6, not one 9?', 'How did 9 × 6 help with 99 × 6?', 'What is 999 × 6?', 'Does this work for 19 × 6?'], watch: 'Taking away 9 instead of the other factor (60 − 9 = 51).', ext: '98 × 7.' });
  add('mx-break', [3, 4], 'Multiplication strings', 'Number string: break a number apart', { text: ['6 × 14', '6 × 10 + 6 × 4', '7 × 15', '12 × 12'] }, {
    purpose: 'Split one factor into tens and ones, multiply each part, and add.', launch: 'Show one at a time. Solve, share, record. Draw each one as an area model.',
    strategies: [['“6 × 14: 6 × 10 = 60 and 6 × 4 = 24, so 84.”', 'Draw a 6 by 14 rectangle split at 10.'], ['“The second one is the same as the first, written out.”', 'Draw an arrow between them.'], ['“7 × 15: 70 + 35 = 105.”', 'Area model split at 10.'], ['“12 × 12: 10 × 12 = 120 and 2 × 12 = 24, so 144.”', 'Area model split at 10; or 12 × 10 + 12 × 2.']],
    questions: ['Where did you split the number? Why there?', 'Could you split it a different way?', 'How does the picture show the two parts?', 'What is 6 × 24?'], watch: 'Multiplying 6 × 10 and then adding 4 instead of 6 × 4.', ext: '13 × 14 (split both numbers).' });
  add('wodb-frac', [3, 4, 5], 'Which one doesn’t belong', 'WODB: fractions', { wodb: ['[1/2]', '[2/4]', '[3/6]', '[2/3]'] }, {
    purpose: 'Reason about equal fractions, simplest form, and odd and even.', launch: 'Show the four fractions. “Which one doesn’t belong? Give a reason.” Find a reason for each.',
    strategies: [['“[2/3] — it’s the only one that isn’t a half.”', 'Draw all four on bars; write [2/3] > [1/2].'], ['“[1/2] — the only one in simplest form.”', 'Write [2/4] = [1/2], [3/6] = [1/2].'], ['“[2/4] — the only one with two even numbers.”', 'Circle the 2 and 4.'], ['“[3/6] — the only one with a 6, and its numbers add to 9.”', 'Write 3 + 6 = 9.']],
    questions: ['Which three are equal? How do you know?', 'Which is biggest?', 'Can you find a reason for each one?', 'What fraction could replace [2/3] so that every one is a half?'], watch: 'Thinking [3/6] is bigger than [1/2] because 3 and 6 are bigger numbers.', ext: 'Make a WODB with four fractions that all equal [1/4] except one.' });
  add('wodb-dec', [4, 5], 'Which one doesn’t belong', 'WODB: 0.5, 0.50, 0.05 and one half', { wodb: ['0.5', '0.50', '0.05', '[1/2]'] }, {
    purpose: 'Equal decimals, place value, and fractions as decimals.', launch: 'Show the four. “Which one doesn’t belong? Why?” Push for a reason for each.',
    strategies: [['“0.05 — it’s the only one that isn’t a half. It’s 5 hundredths.”', 'Write 0.05 = [5/100]; shade it on a grid.'], ['“[1/2] — the only fraction.”', 'Write [1/2] = 0.5.'], ['“0.50 — the only one that ends in 0.”', 'Write 0.50 = 0.5.'], ['“0.5 — the only one with one digit after the point.”', 'Write 5 tenths.']],
    questions: ['Which three are equal? Prove it on the grid.', 'Is 0.50 more than 0.5? Why not?', 'How much smaller is 0.05 than 0.5?', 'What is 0.05 as a fraction?'], watch: 'Saying 0.50 is bigger than 0.5 because 50 is bigger than 5.', ext: 'WODB: 0.25, [1/4], 0.4, 0.250.' });

  var topics = ['Subitizing', 'Combinations to 5 and 10', 'Doubles and near doubles', 'Making ten', 'Add and subtract within 20', 'Place value and tens', 'Add and subtract within 100', 'Which one doesn’t belong', 'Multiplication strings', 'Fractions', 'Fraction talks', 'Unit chats', 'Same and different', 'Counterexamples', 'Broken calculator', 'Choral counting', 'Guess my number'];
  var sources = [
    ['Number Talks Directions (K–2), Anne Arundel County Public Schools', 'https://media.aacps.org/portal/tconnect/_elem/Math09/K-2CCSS/Grade%202/Number%20Talks/Number%20Talks%20Directions%20(K-2).pdf'],
    ['Dot Card and Number Talks, youcubed (Week of Inspirational Math)', 'https://www.youcubed.org/wp-content/uploads/2019/08/WIM-Dot-Card-and-Number-Talks-Grades-K-12.pdf'],
    ['Talk About Dots, Kentucky Center for Mathematics', 'https://kcm.nku.edu/MathHub/talk_about_dots.php'],
    ['Math for Love lessons (openers, counterexamples, broken calculator, unit chats)', 'https://mathforlove.com/lessons/'],
    ['Fraction Talks', 'https://fractiontalks.com/']
  ];
  return { talks: T, topics: topics, sources: sources };
})();
