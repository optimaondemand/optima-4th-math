/* OAO Math Manipulatives — Puzzles for early finishers and party days.
   Data: OAOM_PUZZLES.list. Player: OAOM_PUZZLES.render(el, puzzle, {teacher, print}).
   Grades: 0 = K. Occasion: 'early' (early finisher), 'party' (party day), 'both'. */
window.OAOM_PUZZLES = (function () {
  'use strict';
  var L = [];
  function P(o) { L.push(o); }

  /* ───── Sudoku (grid strings, '.' = blank) ───── */
  P({ id: 'sud4-1', type: 'Sudoku', kind: 'sudoku', grades: [1, 2], diff: 1, occ: 'both', title: 'Mini Sudoku 1', n: 4, box: [2, 2], grid: '12..3.1..14.43..', sol: '1234341221434321', hint: 'Every row, column and 2 by 2 box has 1, 2, 3 and 4. Find a row that only needs one more number.' });
  P({ id: 'sud4-2', type: 'Sudoku', kind: 'sudoku', grades: [1, 2, 3], diff: 2, occ: 'both', title: 'Mini Sudoku 2', n: 4, box: [2, 2], grid: '...3..1.1..4.32.', sol: '2143341212344321', hint: 'Look at a box that already has two numbers. Which two are missing?' });
  P({ id: 'sud4-3', type: 'Sudoku', kind: 'sudoku', grades: [2, 3], diff: 3, occ: 'early', title: 'Mini Sudoku 3', n: 4, box: [2, 2], grid: '.3....4...1.1..4', sol: '4321214334121234', hint: 'Start with the column that has two numbers already.' });
  P({ id: 'sud6-1', type: 'Sudoku', kind: 'sudoku', grades: [3, 4, 5], diff: 1, occ: 'both', title: 'Sudoku 6 by 6 (easy)', n: 6, box: [2, 3], grid: '.23.5.45..232.4.65.......3164264....', sol: '123456456123214365365214531642642531', hint: 'Each row, column and 2 by 3 box has 1 to 6. Find a box missing only one number.' });
  P({ id: 'sud6-2', type: 'Sudoku', kind: 'sudoku', grades: [4, 5], diff: 2, occ: 'early', title: 'Sudoku 6 by 6 (medium)', n: 6, box: [2, 3], grid: '.62..45...6..2....64.1.5.5.2....6...', sol: '362514514362125643643125451236236451', hint: 'Pick a number, like 6, and find every place it can go.' });

  /* ───── KenKen (cages: {c: [[r,c]...], op, t}) ───── */
  P({ id: 'ken3-1', type: 'KenKen', kind: 'kenken', grades: [2, 3], diff: 1, occ: 'both', title: 'KenKen 3 by 3 (adding)', n: 3, sol: '123312231',
    cages: [{ c: [[0, 0], [1, 0]], op: '+', t: 4 }, { c: [[0, 1], [0, 2]], op: '+', t: 5 }, { c: [[1, 1], [2, 1]], op: '+', t: 4 }, { c: [[1, 2], [2, 2]], op: '+', t: 3 }, { c: [[2, 0]], op: '', t: 2 }],
    hint: 'Each row and column has 1, 2 and 3. The numbers in each outlined box make the number in its corner.' });
  P({ id: 'ken3-2', type: 'KenKen', kind: 'kenken', grades: [3, 4], diff: 2, occ: 'both', title: 'KenKen 3 by 3 (add and multiply)', n: 3, sol: '231123312',
    cages: [{ c: [[0, 0], [0, 1]], op: '×', t: 6 }, { c: [[0, 2], [1, 2]], op: '+', t: 4 }, { c: [[1, 0], [2, 0]], op: '+', t: 4 }, { c: [[1, 1], [2, 1], [2, 2]], op: '×', t: 4 }],
    hint: 'Which two numbers from 1 to 3 multiply to 6?' });
  P({ id: 'ken4-1', type: 'KenKen', kind: 'kenken', grades: [4, 5], diff: 2, occ: 'early', title: 'KenKen 4 by 4', n: 4, sol: '1342423131242413',
    cages: [{ c: [[0, 0], [0, 1]], op: '+', t: 4 }, { c: [[0, 2], [0, 3]], op: '×', t: 8 }, { c: [[1, 0], [2, 0]], op: '−', t: 1 }, { c: [[1, 1], [1, 2], [2, 2]], op: '+', t: 7 }, { c: [[1, 3], [2, 3]], op: '−', t: 3 }, { c: [[2, 1], [3, 1]], op: '×', t: 4 }, { c: [[3, 0]], op: '', t: 2 }, { c: [[3, 2], [3, 3]], op: '+', t: 4 }],
    hint: 'Start with the box that has no sign: it is just that number. For − boxes, take the smaller number from the bigger one.' });
  P({ id: 'ken4-2', type: 'KenKen', kind: 'kenken', grades: [5], diff: 3, occ: 'early', title: 'KenKen 4 by 4 (tricky)', n: 4, sol: '2143432114323214',
    cages: [{ c: [[0, 0], [0, 1], [1, 0]], op: '+', t: 7 }, { c: [[0, 2], [0, 3]], op: '+', t: 7 }, { c: [[1, 1], [1, 2]], op: '+', t: 5 }, { c: [[1, 3], [2, 3]], op: '+', t: 3 }, { c: [[2, 0], [3, 0]], op: '÷', t: 3 }, { c: [[2, 1], [2, 2]], op: '−', t: 1 }, { c: [[3, 1], [3, 2], [3, 3]], op: '×', t: 8 }],
    hint: 'Start with the ÷ 3 box: which two numbers from 1 to 4 make 3 when you divide?' });

  /* ───── Magic squares (rows/cols/diagonals add to target; use each number once) ───── */
  P({ id: 'magic-15a', type: 'Magic square', kind: 'magic', grades: [2, 3, 4], diff: 1, occ: 'both', title: 'Magic square: 15', n: 3, target: 15, nums: [1, 2, 3, 4, 5, 6, 7, 8, 9], grid: [2, 7, 6, 9, null, null, null, 3, null], sol: [2, 7, 6, 9, 5, 1, 4, 3, 8], hint: 'The middle of a 1 to 9 magic square is always 5.' });
  P({ id: 'magic-15b', type: 'Magic square', kind: 'magic', grades: [3, 4, 5], diff: 2, occ: 'early', title: 'Magic square: 15 (fewer clues)', n: 3, target: 15, nums: [1, 2, 3, 4, 5, 6, 7, 8, 9], grid: [8, null, null, null, 5, null, null, null, 2], sol: [8, 1, 6, 3, 5, 7, 4, 9, 2], hint: 'Even numbers go in the corners.' });
  P({ id: 'magic-18', type: 'Magic square', kind: 'magic', grades: [4, 5], diff: 3, occ: 'early', title: 'Magic square: 18', n: 3, target: 18, nums: [2, 3, 4, 5, 6, 7, 8, 9, 10], grid: [null, null, 7, null, 6, null, 5, null, null], sol: [9, 2, 7, 4, 6, 8, 5, 10, 3], hint: 'This uses 2 to 10. The middle number is the middle of the list.' });

  /* ───── Number pyramids (each brick = the two bricks under it added) ───── */
  P({ id: 'pyr-3a', type: 'Number pyramid', kind: 'pyramid', grades: [1, 2], diff: 1, occ: 'both', title: 'Number pyramid (3 rows)', rows: [[null], [null, null], [3, 4, 2]], sol: [[13], [7, 6], [3, 4, 2]], hint: 'Add the two bricks below to get the brick on top.' });
  P({ id: 'pyr-3b', type: 'Number pyramid', kind: 'pyramid', grades: [2, 3], diff: 2, occ: 'both', title: 'Number pyramid: work backwards', rows: [[20], [null, 9], [5, null, null]], sol: [[20], [11, 9], [5, 6, 3]], hint: 'If two bricks add to 20 and one is 9, what is the other?' });
  P({ id: 'pyr-4a', type: 'Number pyramid', kind: 'pyramid', grades: [3, 4], diff: 2, occ: 'both', title: 'Number pyramid (4 rows)', rows: [[null], [null, null], [null, null, null], [10, 5, 7, 3]], sol: [[49], [27, 22], [15, 12, 10], [10, 5, 7, 3]], hint: 'Fill the row just above the bottom first.' });
  P({ id: 'pyr-4b', type: 'Number pyramid', kind: 'pyramid', grades: [4, 5], diff: 3, occ: 'early', title: 'Number pyramid: missing middle', rows: [[100], [null, 48], [null, null, 25], [12, null, null, null]], sol: [[100], [52, 48], [29, 23, 25], [12, 17, 6, 19]], hint: 'Start at the top: 100 − 48 = ?' });

  /* ───── Target number (use every card once) ───── */
  P({ id: 'tgt-10', type: 'Target number', kind: 'target', grades: [1, 2], diff: 1, occ: 'both', title: 'Make 10', cards: [2, 3, 5], target: 10, ops: ['+', '−'], hint: 'Try adding all three. Then try taking one away.' });
  P({ id: 'tgt-12', type: 'Target number', kind: 'target', grades: [1, 2], diff: 1, occ: 'party', title: 'Make 12', cards: [9, 5, 8], target: 12, ops: ['+', '−'], hint: 'Two cards can add to more than 12. Then take away the third.' });
  P({ id: 'tgt-20', type: 'Target number', kind: 'target', grades: [2, 3], diff: 2, occ: 'both', title: 'Make 20', cards: [6, 7, 4, 3], target: 20, ops: ['+', '−'], hint: 'Make a ten first.' });
  P({ id: 'tgt-24a', type: 'Target number', kind: 'target', grades: [3, 4, 5], diff: 1, occ: 'both', title: 'Make 24 (1, 2, 3, 4)', cards: [1, 2, 3, 4], target: 24, ops: ['+', '−', '×', '÷'], hint: 'What do you get if you multiply them all?' });
  P({ id: 'tgt-24b', type: 'Target number', kind: 'target', grades: [3, 4, 5], diff: 2, occ: 'party', title: 'Make 24 (2, 3, 4, 6)', cards: [2, 3, 4, 6], target: 24, ops: ['+', '−', '×', '÷'], hint: '6 × 4 is 24. Can 3 and 2 make 1?' });
  P({ id: 'tgt-24c', type: 'Target number', kind: 'target', grades: [4, 5], diff: 3, occ: 'early', title: 'Make 24 (5, 5, 5, 1)', cards: [5, 5, 5, 1], target: 24, ops: ['+', '−', '×', '÷'], hint: '5 × 5 is 25. How can 5 and 1 make 1?' });
  P({ id: 'tgt-100', type: 'Target number', kind: 'target', grades: [4, 5], diff: 2, occ: 'both', title: 'Make 100', cards: [25, 3, 1, 7], target: 100, ops: ['+', '−', '×', '÷'], hint: '25 × 4 = 100. Can the other cards make 4?' });

  /* ───── Balance puzzles (find the value of each shape) ───── */
  P({ id: 'bal-2', type: 'Balance puzzle', kind: 'balance', grades: [1, 2], diff: 1, occ: 'both', title: 'Shape balance', shapes: ['circle', 'square'], eqs: [[['circle', 'circle'], 6], [['circle', 'square'], 7]], sol: { circle: 3, square: 4 }, hint: 'Two circles are 6. So one circle is…?' });
  P({ id: 'bal-3', type: 'Balance puzzle', kind: 'balance', grades: [3, 4], diff: 2, occ: 'both', title: 'Three-shape balance', shapes: ['triangle', 'circle', 'square'], eqs: [[['triangle', 'triangle', 'triangle'], 12], [['triangle', 'circle'], 10], [['circle', 'square', 'square'], 16]], sol: { triangle: 4, circle: 6, square: 5 }, hint: 'Start with the triangles.' });
  P({ id: 'bal-x', type: 'Balance puzzle', kind: 'balance', grades: [4, 5], diff: 3, occ: 'early', title: 'Balance with groups', shapes: ['star', 'circle', 'square'], eqs: [[['star', 'star', 'circle'], 17], [['star', 'circle', 'circle'], 13], [['circle', 'square'], 12]], sol: { star: 7, circle: 3, square: 9 }, hint: 'Compare the first two: what changed, and by how much?' });

  /* ───── Riddles ───── */
  P({ id: 'rid-8', type: 'Number riddle', kind: 'riddle', grades: [0, 1], diff: 1, occ: 'both', title: 'Who am I? (to 10)', text: 'I am an even number. I am more than 6. I am less than 10. Who am I?', ans: ['8'], hint: 'Count from 6 to 10. Which of those are even?' });
  P({ id: 'rid-13', type: 'Number riddle', kind: 'riddle', grades: [1, 2], diff: 2, occ: 'both', title: 'Who am I? (teens)', text: 'I am between 10 and 20. My ones digit is 2 more than my tens digit. Who am I?', ans: ['13'], hint: 'Every number from 10 to 19 has 1 ten.' });
  P({ id: 'rid-coins', type: 'Number riddle', kind: 'riddle', grades: [1, 2], diff: 2, occ: 'party', title: 'Coin riddle', text: 'I have 3 coins. Together they make 16 cents. One coin is a dime. How many cents is my smallest coin worth?', ans: ['1'], hint: 'Take away the dime. What two coins make 6 cents?', answer: 'A dime, a nickel and a penny. The smallest coin is worth 1 cent.' });
  P({ id: 'rid-7s', type: 'Number riddle', kind: 'riddle', grades: [3, 4], diff: 2, occ: 'both', title: 'Who am I? (multiples)', text: 'I am a two-digit number less than 50. I am a multiple of 7. My digits add up to 10. Who am I?', ans: ['28'], hint: 'List the multiples of 7 up to 50.' });
  P({ id: 'rid-ang', type: 'Number riddle', kind: 'riddle', grades: [4, 5], diff: 2, occ: 'early', title: 'Missing angle', text: 'Two angles of a triangle are 50° and 65°. How many degrees is the third angle?', ans: ['65'], hint: 'The angles of a triangle add to 180°.' });
  P({ id: 'rid-legs', type: 'Number riddle', kind: 'riddle', grades: [2, 3, 4], diff: 3, occ: 'party', title: 'Farm riddle', text: 'A farm has chickens and cows. There are 7 animals and 20 legs. How many cows are there?', ans: ['3'], hint: 'If all 7 were chickens, how many legs would there be?' });

  /* ───── Hands-on challenge cards (open a tool) ───── */
  P({ id: 'card-tan-sq', type: 'Shape challenge', kind: 'card', grades: [0, 1, 2, 3], diff: 2, occ: 'party', title: 'Tangram: make the square', text: 'Use all seven tangram pieces to make one big square.', tool: { t: 'tangram', s: { pz: 'sq7' } }, answer: 'The two big triangles make half the square; the other five pieces fill the other half.' });
  P({ id: 'card-tan-house', type: 'Shape challenge', kind: 'card', grades: [1, 2, 3, 4], diff: 2, occ: 'party', title: 'Tangram: build the house', text: 'Fill the house shape with tangram pieces. No gaps, no overlaps.', tool: { t: 'tangram', s: { pz: 'house' } }, answer: 'Turn on Show the answer in the tool’s setup to check.' });
  P({ id: 'card-hex', type: 'Shape challenge', kind: 'card', grades: [0, 1, 2], diff: 1, occ: 'both', title: 'Cover the hexagon', text: 'Cover a yellow hexagon three different ways using other pattern blocks.', tool: { t: 'pattern', s: { b: [] } }, answer: 'Some ways: 2 trapezoids; 3 blue rhombuses; 6 triangles; 1 trapezoid and 3 triangles; 2 rhombuses and 2 triangles.' });
  P({ id: 'card-frac', type: 'Shape challenge', kind: 'card', grades: [3, 4, 5], diff: 2, occ: 'early', title: 'Pattern block fractions', text: 'The yellow hexagon is 1 whole. Build 2 and 1 half using exactly 7 blocks.', tool: { t: 'pattern', s: { b: [], frac: true } }, answer: 'One way: 4 red trapezoids (2 wholes) and 3 green triangles (1 half) make 7 blocks. Other ways work too.' });
  P({ id: 'card-tens', type: 'Shape challenge', kind: 'card', grades: [0, 1], diff: 1, occ: 'party', title: 'Ten frame race', text: 'Roll a die. Put that many counters on your ten frame. Keep rolling. Who fills the frame first? You must land exactly on 10!', tool: { t: 'tenframe', s: { m: 'one', c: [] } }, answer: 'Game: no single answer. Ask, “How many more do you need?” each turn.' });
  P({ id: 'card-four4s', type: 'Number challenge', kind: 'card', grades: [4, 5], diff: 3, occ: 'early', title: 'Four 4s', text: 'Use four 4s and any of + − × ÷ to make every number from 1 to 10. Example: 4 ÷ 4 + 4 − 4 = 1.', answer: '2 = 4 ÷ 4 + 4 ÷ 4; 3 = (4 + 4 + 4) ÷ 4; 4 = 4 × (4 − 4) + 4; 5 = (4 × 4 + 4) ÷ 4; 6 = 4 + (4 + 4) ÷ 4; 7 = 4 + 4 − 4 ÷ 4; 8 = 4 + 4 + 4 − 4; 9 = 4 + 4 + 4 ÷ 4; 10 = (44 − 4) ÷ 4.' });

  /* ═══════════════ checks ═══════════════ */
  function evalExpr(tokens) { /* tokens: numbers and + − × ÷ ( ) ; returns number or NaN */
    var pos = 0;
    function peek() { return tokens[pos]; }
    function num() { var t = tokens[pos]; if (t === '(') { pos++; var v = expr(); if (tokens[pos] !== ')') return NaN; pos++; return v; } if (typeof t === 'number') { pos++; return t; } return NaN; }
    function term() { var v = num(); while (peek() === '×' || peek() === '÷') { var o = tokens[pos++], r = num(); v = o === '×' ? v * r : v / r; } return v; }
    function expr() { var v = term(); while (peek() === '+' || peek() === '−') { var o = tokens[pos++], r = term(); v = o === '+' ? v + r : v - r; } return v; }
    var v = expr(); return pos === tokens.length ? v : NaN;
  }
  function solvable(cards, target, ops) { /* brute force for the data check */
    function go(nums) { if (nums.length === 1) return Math.abs(nums[0] - target) < 1e-9; for (var i = 0; i < nums.length; i++) for (var j = 0; j < nums.length; j++) { if (i === j) continue; var rest = nums.filter(function (_, k) { return k !== i && k !== j; }), a = nums[i], b = nums[j], c = [];
      if (ops.indexOf('+') > -1) c.push(a + b); if (ops.indexOf('−') > -1) c.push(a - b); if (ops.indexOf('×') > -1) c.push(a * b); if (ops.indexOf('÷') > -1 && b) c.push(a / b);
      for (var q = 0; q < c.length; q++) if (go(rest.concat([c[q]]))) return true; } return false; }
    return go(cards.slice());
  }

  /* ═══════════════ player ═══════════════ */
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function h(tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var k in attrs) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); } if (html != null) e.innerHTML = html; return e; }
  var SHAPE = {
    circle: '<circle cx="16" cy="16" r="13" fill="#2F6FDE"/>', square: '<rect x="4" y="4" width="24" height="24" rx="3" fill="#23915A"/>',
    triangle: '<path d="M16 3 L30 28 L2 28 Z" fill="#F08A24"/>', star: '<path d="M16 2l4 9 10 1-7.5 6.5 2.5 10-9-5.5-9 5.5 2.5-10L2 12l10-1z" fill="#6B46C1"/>'
  };
  function shape(n, sz) { return '<svg viewBox="0 0 32 32" width="' + (sz || 32) + '" height="' + (sz || 32) + '" aria-label="' + n + '" role="img">' + SHAPE[n] + '</svg>'; }

  function render(el, p, o) {
    o = o || {}; el.innerHTML = ''; el.className = 'pz pz-' + p.kind + (o.print ? ' pz-print' : '');
    var head = h('div', { class: 'pz-head' }, '<h2>' + esc(p.title) + '</h2>');
    el.appendChild(head);
    var body = h('div', { class: 'pz-body' }); el.appendChild(body);
    var msg = h('p', { class: 'pz-msg', 'aria-live': 'polite' }), check = null;
    var rules = {
      sudoku: 'Fill the grid so every row, every column and every ' + (p.box ? p.box[0] + ' by ' + p.box[1] : '') + ' box has the numbers 1 to ' + p.n + ' once.',
      kenken: 'Use 1 to ' + p.n + ' once in every row and column. The numbers in each outlined box make the small number with its sign.',
      magic: 'Put the numbers ' + (p.nums ? p.nums[0] + ' to ' + p.nums[p.nums.length - 1] : '') + ' in the boxes, each once. Every row, column and diagonal must add to ' + p.target + '.',
      pyramid: 'Each brick is the two bricks under it added together.',
      target: 'Use every card once to make ' + p.target + '. Tap cards and signs to build your number sentence.',
      balance: 'Each scale balances. Find what each shape is worth.',
      riddle: '', card: ''
    }[p.kind];
    if (rules) body.appendChild(h('p', { class: 'pz-rules' }, esc(rules)));

    if (p.kind === 'sudoku' || p.kind === 'kenken') {
      var n = p.n, grid = p.kind === 'sudoku' ? p.grid : '.'.repeat(n * n), cageOf = {};
      if (p.cages) p.cages.forEach(function (cg, ci) { cg.c.forEach(function (rc) { cageOf[rc[0] + ',' + rc[1]] = ci; }); });
      var t = h('table', { class: 'pz-grid n' + n }), inputs = [];
      for (var r = 0; r < n; r++) {
        var tr = h('tr'); t.appendChild(tr);
        for (var c = 0; c < n; c++) {
          var td = h('td'), g = grid[r * n + c], bs = [];
          if (p.kind === 'sudoku') { if (c % p.box[1] === p.box[1] - 1 && c < n - 1) bs.push('br'); if (r % p.box[0] === p.box[0] - 1 && r < n - 1) bs.push('bb'); }
          else { var me = cageOf[r + ',' + c]; if (c < n - 1 && cageOf[r + ',' + (c + 1)] !== me) bs.push('br'); if (r < n - 1 && cageOf[(r + 1) + ',' + c] !== me) bs.push('bb');
            var cg = p.cages[me]; if (cg.c[0][0] === r && cg.c[0][1] === c) td.appendChild(h('span', { class: 'pz-cage' }, cg.t + (cg.op || ''))); }
          td.className = bs.join(' ');
          if (g && g !== '.') td.appendChild(h('span', { class: 'pz-given' }, g));
          else if (!o.print) { var inp = h('input', { inputmode: 'numeric', maxlength: '1', 'aria-label': 'Row ' + (r + 1) + ' column ' + (c + 1) }); inp.dataset.i = r * n + c; td.appendChild(inp); inputs.push(inp); }
          tr.appendChild(td);
        }
      }
      body.appendChild(t);
      check = function () { var wrong = 0, empty = 0; inputs.forEach(function (inp) { inp.classList.remove('bad'); var v = inp.value.trim(); if (!v) { empty++; return; } if (v !== p.sol[+inp.dataset.i]) { wrong++; inp.classList.add('bad'); } });
        return empty ? 'Fill every box first. ' + empty + ' to go.' : wrong ? (wrong === 1 ? '1 box needs' : wrong + ' boxes need') + ' another look.' : true; };
      o.hintFill = function () { var e = inputs.filter(function (i) { return i.value.trim() !== p.sol[+i.dataset.i]; }); if (e.length) { var i = e[0]; i.value = p.sol[+i.dataset.i]; i.classList.add('given-hint'); } };
    } else if (p.kind === 'magic') {
      var t2 = h('table', { class: 'pz-grid n3 magic' }), ins = [];
      for (var i = 0; i < 9; i++) { if (i % 3 === 0) t2.appendChild(h('tr')); var td2 = h('td'); var g2 = p.grid[i]; if (g2 != null) td2.appendChild(h('span', { class: 'pz-given' }, g2)); else if (!o.print) { var in2 = h('input', { inputmode: 'numeric', maxlength: '2', 'aria-label': 'Box ' + (i + 1) }); in2.dataset.i = i; td2.appendChild(in2); ins.push(in2); } t2.lastChild.appendChild(td2); }
      body.appendChild(t2);
      body.appendChild(h('p', { class: 'pz-rules' }, 'Numbers you can use: ' + p.nums.join(', ')));
      check = function () { var v = p.grid.slice(); var empty = 0; ins.forEach(function (x) { x.classList.remove('bad'); var k = parseInt(x.value, 10); if (isNaN(k)) empty++; v[+x.dataset.i] = k; }); if (empty) return 'Fill every box first.';
        var used = {}, dup = false; v.forEach(function (k) { if (used[k] || p.nums.indexOf(k) < 0) dup = true; used[k] = 1; }); if (dup) return 'Use each number from the list once.';
        var L3 = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]], bad = L3.filter(function (l) { return v[l[0]] + v[l[1]] + v[l[2]] !== p.target; }).length;
        return bad ? bad + (bad === 1 ? ' line doesn’t' : ' lines don’t') + ' add to ' + p.target + ' yet.' : true; };
      o.hintFill = function () { var e = ins.filter(function (x) { return +x.value !== p.sol[+x.dataset.i]; }); if (e.length) { e[0].value = p.sol[+e[0].dataset.i]; } };
    } else if (p.kind === 'pyramid') {
      var box = h('div', { class: 'pz-pyr' }), pins = [];
      p.rows.forEach(function (row, ri) { var rr = h('div', { class: 'pz-row' }); row.forEach(function (v, ci) { var b = h('div', { class: 'pz-brick' }); if (v != null) b.appendChild(h('span', { class: 'pz-given' }, v)); else if (!o.print) { var ip = h('input', { inputmode: 'numeric', maxlength: '3', 'aria-label': 'Row ' + (ri + 1) + ' brick ' + (ci + 1) }); ip.dataset.r = ri; ip.dataset.c = ci; b.appendChild(ip); pins.push(ip); } rr.appendChild(b); }); box.appendChild(rr); });
      body.appendChild(box);
      check = function () { var wrong = 0, empty = 0; pins.forEach(function (x) { x.classList.remove('bad'); if (!x.value.trim()) { empty++; return; } if (+x.value !== p.sol[+x.dataset.r][+x.dataset.c]) { wrong++; x.classList.add('bad'); } }); return empty ? 'Fill every brick first.' : wrong ? (wrong === 1 ? '1 brick needs' : wrong + ' bricks need') + ' another look.' : true; };
      o.hintFill = function () { var e = pins.filter(function (x) { return +x.value !== p.sol[+x.dataset.r][+x.dataset.c]; }); if (e.length) e[e.length - 1].value = p.sol[+e[e.length - 1].dataset.r][+e[e.length - 1].dataset.c]; };
    } else if (p.kind === 'target') {
      var tk = [], used = {};
      var big = h('div', { class: 'pz-target' }, 'Make <b>' + p.target + '</b>');
      body.appendChild(big);
      var cardsRow = h('div', { class: 'pz-cards' });
      p.cards.forEach(function (cv, ci) { var b = h('button', { type: 'button', class: 'pz-card' }, String(cv)); b.dataset.ci = ci; b.onclick = function () { if (used[ci]) return; var last = tk[tk.length - 1]; if (last && (typeof last.v === 'number' || last.v === ')')) { say('Put a sign between numbers.'); return; } used[ci] = 1; tk.push({ v: cv, ci: ci }); paint(); }; cardsRow.appendChild(b); });
      body.appendChild(cardsRow);
      if (!o.print) {
        var opsRow = h('div', { class: 'pz-ops' });
        p.ops.concat(['(', ')']).forEach(function (op) { var b = h('button', { type: 'button', class: 'pz-op' }, op); b.onclick = function () { tk.push({ v: op }); paint(); }; opsRow.appendChild(b); });
        var bk = h('button', { type: 'button', class: 'pz-op' }, '⌫'); bk.setAttribute('aria-label', 'Take back'); bk.onclick = function () { var x = tk.pop(); if (x && x.ci != null) delete used[x.ci]; paint(); }; opsRow.appendChild(bk);
        var cl = h('button', { type: 'button', class: 'pz-op' }, 'Clear'); cl.onclick = function () { tk = []; used = {}; paint(); }; opsRow.appendChild(cl);
        body.appendChild(opsRow);
        var line = h('div', { class: 'pz-line' }); body.appendChild(line);
      } else body.appendChild(h('div', { class: 'pz-writeline' }, 'Write your number sentence: ________________________ = ' + p.target));
      function paint() { if (!line) return; var s = tk.map(function (x) { return x.v; }).join(' '); var v = evalExpr(tk.map(function (x) { return x.v; })); line.innerHTML = (s || '<span class="muted">Tap a card to start</span>') + (s && !isNaN(v) ? ' <b>= ' + (Math.round(v * 1000) / 1000) + '</b>' : ''); [].forEach.call(cardsRow.children, function (b) { b.disabled = !!used[b.dataset.ci]; }); }
      paint();
      check = function () { if (Object.keys(used).length < p.cards.length) return 'Use every card once.'; var v = evalExpr(tk.map(function (x) { return x.v; })); if (isNaN(v)) return 'Check your signs and parentheses.'; return Math.abs(v - p.target) < 1e-9 ? true : 'That makes ' + (Math.round(v * 1000) / 1000) + '. Try another way.'; };
    } else if (p.kind === 'balance') {
      var wrap = h('div', { class: 'pz-scales' });
      p.eqs.forEach(function (eq) { var s = h('div', { class: 'pz-scale' }); s.innerHTML = '<div class="pan">' + eq[0].map(function (n) { return shape(n, 34); }).join('') + '</div><div class="eq">=</div><div class="pan num">' + eq[1] + '</div>'; wrap.appendChild(s); });
      body.appendChild(wrap);
      var ans = h('div', { class: 'pz-ans' }), bins = {};
      p.shapes.forEach(function (n) { var lab = h('label', { class: 'pz-shapein' }, shape(n, 30) + '<span>=</span>'); if (!o.print) { var ip = h('input', { inputmode: 'numeric', maxlength: '3', 'aria-label': n + ' is worth' }); lab.appendChild(ip); bins[n] = ip; } else lab.appendChild(h('span', { class: 'blank' }, '____')); ans.appendChild(lab); });
      body.appendChild(ans);
      check = function () { var bad = 0, empty = 0; p.shapes.forEach(function (n) { bins[n].classList.remove('bad'); if (!bins[n].value.trim()) { empty++; return; } if (+bins[n].value !== p.sol[n]) { bad++; bins[n].classList.add('bad'); } }); return empty ? 'Find every shape first.' : bad ? 'Check that every scale balances with your numbers.' : true; };
      o.hintFill = function () { var e = p.shapes.filter(function (n) { return +bins[n].value !== p.sol[n]; }); if (e.length) bins[e[0]].value = p.sol[e[0]]; };
    } else if (p.kind === 'riddle') {
      body.appendChild(h('p', { class: 'pz-riddle' }, esc(p.text)));
      if (!o.print) { var row = h('div', { class: 'pz-ans' }); var ri = h('input', { inputmode: 'numeric', maxlength: '4', 'aria-label': 'Your answer', class: 'wide' }); row.appendChild(h('span', null, 'My answer:')); row.appendChild(ri); body.appendChild(row);
        check = function () { var v = ri.value.trim(); if (!v) return 'Type your answer first.'; ri.classList.remove('bad'); if (p.ans.indexOf(v) > -1) return true; ri.classList.add('bad'); return 'Not quite. Read each clue again.'; }; }
      else body.appendChild(h('div', { class: 'pz-writeline' }, 'My answer: ____________'));
    } else if (p.kind === 'card') {
      body.appendChild(h('p', { class: 'pz-riddle' }, esc(p.text)));
      if (p.tool && !o.print && o.toolURL) { var a = h('a', { class: 'om-btn primary', href: o.toolURL(p.tool.t, p.tool.s), target: '_blank', rel: 'noopener' }, 'Open the tool ↗'); body.appendChild(h('div', { class: 'om-row' })).appendChild(a); }
    }

    if (!o.print) {
      var row2 = h('div', { class: 'om-row pz-actions' });
      if (check) { var cb = h('button', { type: 'button', class: 'om-btn primary' }, 'Check'); cb.onclick = function () { var r = check(); if (r === true) { say('✓ You solved it! Great thinking.', 'ok'); el.classList.add('solved'); } else say(r, 'hint'); }; row2.appendChild(cb); }
      if (p.hint) { var hb = h('button', { type: 'button', class: 'om-btn' }, 'Need a hint?'); var step = 0; hb.onclick = function () { step++; if (step === 1 || !o.hintFill) say('Hint: ' + p.hint, 'hint'); else { o.hintFill(); say('I filled in one box for you.', 'hint'); } }; row2.appendChild(hb); }
      body.appendChild(row2); body.appendChild(msg);
    }
    if (o.teacher) {
      var ansTxt = answerText(p);
      var d = h('details', { class: 'pz-answer' }, '<summary>Show answer (teacher only)</summary><div>' + ansTxt + '</div>'); if (o.print) d.open = true; el.appendChild(d);
    }
    function say(t, k) { msg.className = 'pz-msg ' + (k || ''); msg.textContent = t; }
    return { check: check };
  }
  function answerText(p) {
    if (p.answer) return esc(p.answer);
    if (p.kind === 'sudoku' || p.kind === 'kenken') { var rows = []; for (var r = 0; r < p.n; r++) rows.push(p.sol.slice(r * p.n, r * p.n + p.n).split('').join(' ')); return rows.join('<br>'); }
    if (p.kind === 'magic') return [0, 3, 6].map(function (i) { return p.sol.slice(i, i + 3).join(' '); }).join('<br>');
    if (p.kind === 'pyramid') return p.sol.map(function (r) { return r.join(' '); }).join('<br>');
    if (p.kind === 'balance') return p.shapes.map(function (n) { return n + ' = ' + p.sol[n]; }).join(', ');
    if (p.kind === 'riddle') return esc(p.ans[0]);
    if (p.kind === 'target') return esc(p.solText || 'Many ways. One way is in the hint.');
    return '';
  }
  /* example solutions for target puzzles (teacher answer) */
  var SOLS = { 'tgt-10': '2 + 3 + 5 = 10', 'tgt-12': '9 + 8 − 5 = 12', 'tgt-20': '6 + 7 + 4 + 3 = 20', 'tgt-24a': '1 × 2 × 3 × 4 = 24', 'tgt-24b': '6 × 4 × (3 − 2) = 24', 'tgt-24c': '5 × (5 − 1 ÷ 5) = 24', 'tgt-100': '25 × (7 − 3) × 1 = 100' };
  L.forEach(function (p) { if (SOLS[p.id]) p.solText = SOLS[p.id]; });

  var types = []; L.forEach(function (p) { if (types.indexOf(p.type) < 0) types.push(p.type); });
  return { list: L, types: types, get: function (id) { return L.filter(function (p) { return p.id === id; })[0]; }, render: render, evalExpr: evalExpr, solvable: solvable };
})();
