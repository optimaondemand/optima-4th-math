/* OAO Math Manipulatives — Number talks bank (teacher-led; teacher notes never go on student links).
   Each talk: {id, grades, topic, title, show, notes}
   show = {t: toolId, s: state} opens that tool on the big screen (use the teacher-only Flash it button for quick images),
        or {text: [lines]} for a number string (fractions written as [1/2] are drawn stacked),
        or {wodb: [four items]} for Which One Doesn't Belong (items are numbers or shape names).
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
    strategies: [['“Two rows of 3.”', 'Circle each row; write 3 + 3 = 6.'], ['“Three pairs.”', 'Circle pairs; write 2 + 2 + 2.'], ['“5 and 1 more.”', 'Circle 5; write 5 + 1.']],
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
    questions: ['How did the problem before help?', 'Who counted up? Who took away?', 'How can you check?', 'Which way works best for 40 − 18?'], watch: 'Writing 20 − 8 = 12 (subtracting smaller from bigger digit).', ext: '100 − 24.' });
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
    strategies: [['“20 — it has 0 ones.”', 'Circle the 0.'], ['“15 — it ends in 5.”', 'Circle 5.'], ['“21 — it’s the only odd number above 20.”', 'Write odd.'], ['“12 — it has 1 ten.”', 'Write 1 ten 2 ones.']],
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

  var topics = ['Subitizing', 'Combinations to 5 and 10', 'Doubles and near doubles', 'Making ten', 'Add and subtract within 20', 'Place value and tens', 'Add and subtract within 100', 'Which one doesn’t belong', 'Multiplication strings', 'Fractions'];
  var sources = [
    ['Number Talks Directions (K–2), Anne Arundel County Public Schools', 'https://media.aacps.org/portal/tconnect/_elem/Math09/K-2CCSS/Grade%202/Number%20Talks/Number%20Talks%20Directions%20(K-2).pdf'],
    ['Dot Card and Number Talks, youcubed (Week of Inspirational Math)', 'https://www.youcubed.org/wp-content/uploads/2019/08/WIM-Dot-Card-and-Number-Talks-Grades-K-12.pdf'],
    ['Talk About Dots, Kentucky Center for Mathematics', 'https://kcm.nku.edu/MathHub/talk_about_dots.php']
  ];
  return { talks: T, topics: topics, sources: sources };
})();
