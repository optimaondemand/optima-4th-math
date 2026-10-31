/* Fact Check — math fact fluency, timer optional.
   Teacher view: set up + notes + share. Student view (?st=1): Start → facts → score card.
   Score link (?r=): read-only score card. Settings travel in ?q=<OAOM.enc(settings)>. */
(function () {
  'use strict';
  var O = OAOM, esc = O.esc;
  var P = new URLSearchParams(location.search);
  var isStudent = P.get('st') === '1', app = document.getElementById('fl-app');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FAST = 3000; /* 3-second automaticity guideline (Kling & Bay-Williams) */

  /* ---------- fact families ---------- */
  var ADD_FAMS = [
    ['w5', 'Sums within 5', 'K–1'], ['w10', 'Sums within 10', 'Gr 1'], ['make10', 'Make 10 pairs', 'K–1'], ['dbl5', 'Doubles to 5 + 5', 'K–1'],
    ['w20', 'Sums within 20', 'Gr 1–2'], ['dbl10', 'Doubles to 10 + 10', 'Gr 1–2'], ['neardbl', 'Near doubles', 'Gr 1–2'], ['bridge', 'Make-ten facts (like 8 + 6)', 'Gr 1–2'], ['teen', 'Subtract from teen numbers', 'Gr 1–2']
  ];
  var FACS = [[2, 5, 10], [3, 4], [6, 7, 8, 9], [11, 12]];
  var DEF = { op: 'add', fam: 'w10', facs: [2, 5, 10], sq: 0, to12: 0, n: 20, tm: 0, goal: 1 };
  function S0(q) { var s = q ? O.dec(q) : null; return Object.assign({}, DEF, s || {}); }
  function isMul(op) { return op === 'mul' || op === 'div' || op === 'muldiv'; }

  function addPairs(fam) {
    var a = [], i, j;
    function push(x, y) { a.push([x, y]); }
    if (fam === 'w5') for (i = 0; i <= 5; i++) for (j = 0; i + j <= 5; j++) push(i, j);
    else if (fam === 'w10') for (i = 0; i <= 10; i++) for (j = 0; i + j <= 10; j++) push(i, j);
    else if (fam === 'make10') for (i = 0; i <= 10; i++) push(i, 10 - i);
    else if (fam === 'dbl5') for (i = 0; i <= 5; i++) push(i, i);
    else if (fam === 'w20') for (i = 0; i <= 10; i++) for (j = 0; j <= 10; j++) { if (i + j <= 20) push(i, j); }
    else if (fam === 'dbl10') for (i = 0; i <= 10; i++) push(i, i);
    else if (fam === 'neardbl') for (i = 1; i <= 9; i++) { push(i, i + 1); push(i + 1, i); }
    else if (fam === 'bridge' || fam === 'teen') for (i = 2; i <= 9; i++) for (j = 2; j <= 9; j++) { if (i + j > 10) push(i, j); }
    return a;
  }
  function makeFacts(s) {
    var out = [], seen = {};
    function f(a, op, b, ans) { var k = a + op + b; if (seen[k]) return; seen[k] = 1; out.push({ a: a, op: op, b: b, ans: ans }); }
    if (!isMul(s.op)) {
      var pairs = addPairs(s.fam), doAdd = s.op === 'add' || s.op === 'addsub', doSub = s.op === 'sub' || s.op === 'addsub' || s.fam === 'teen';
      if (s.fam === 'teen') doAdd = s.op === 'addsub';
      pairs.forEach(function (p) { if (doAdd) f(p[0], '+', p[1], p[0] + p[1]); if (doSub) f(p[0] + p[1], '−', p[1], p[0]); });
    } else {
      var top = s.to12 ? 12 : 10, facs = (s.facs || []).slice();
      var doMul = s.op === 'mul' || s.op === 'muldiv', doDiv = s.op === 'div' || s.op === 'muldiv';
      facs.forEach(function (x) { for (var n = 0; n <= top; n++) { if (doMul) { f(x, '×', n, x * n); f(n, '×', x, x * n); } if (doDiv && x > 0) f(x * n, '÷', x, n); } });
      if (s.sq) for (var q = 0; q <= top; q++) { if (doMul) f(q, '×', q, q * q); if (doDiv && q > 0) f(q * q, '÷', q, q); }
    }
    return out;
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function deal(pool, n) { if (!pool.length) return []; if (!n) return shuffle(pool); var o = []; while (o.length < n) o = o.concat(shuffle(pool)); return o.slice(0, n); }

  function label(s) {
    if (isMul(s.op)) { var w = { mul: 'Multiplication', div: 'Division', muldiv: 'Multiplication and division' }[s.op]; return w + ': ×' + (s.facs || []).join(', ×') + (s.sq ? ', squares' : '') + (s.to12 ? ' (to 12)' : ''); }
    var fam = ADD_FAMS.filter(function (x) { return x[0] === s.fam; })[0]; var w2 = { add: 'Addition', sub: 'Subtraction', addsub: 'Addition and subtraction' }[s.op];
    return w2 + ': ' + (fam ? fam[1].toLowerCase() : '');
  }
  /* B.E.S.T. goals, verified on CPALMS / Hillsborough benchmark pages (Oct 2026) */
  function goalText(s) {
    if (isMul(s.op)) return '<b>Grade 3</b> (MA.3.NSO.2.4): multiply two whole numbers from 0 to 12 and divide using related facts with procedural reliability. <b>Grade 4</b> (MA.4.NSO.2.1): recall multiplication facts with factors up to 12 and related division facts with automaticity.';
    if (s.fam === 'w5' || s.fam === 'make10' || s.fam === 'dbl5') return '<b>Kindergarten</b> (MA.K.NSO.3.1): explore addition of two whole numbers from 0 to 10, and related subtraction facts. <b>Grade 1</b> (MA.1.NSO.2.1): recall addition facts with sums to 10 and related subtraction facts with automaticity.';
    if (s.fam === 'w10') return '<b>Grade 1</b> (MA.1.NSO.2.1): recall addition facts with sums to 10 and related subtraction facts with automaticity.';
    return '<b>Grade 2</b> (MA.2.NSO.2.1): recall addition facts with sums to 20 and related subtraction facts with automaticity.';
  }

  /* ---------- strategy hints for facts to practice ---------- */
  function hint(f) {
    var a = f.a, b = f.b;
    if (f.op === '+') {
      if (a === 0 || b === 0) return 'Adding 0 keeps the number the same.';
      if (a === b) return 'Doubles: ' + a + ' + ' + a + ' = ' + (a + a) + '.';
      if (Math.abs(a - b) === 1) { var m = Math.min(a, b); return 'Near doubles: ' + m + ' + ' + m + ' = ' + (2 * m) + ', plus 1 more is ' + (a + b) + '.'; }
      if (a + b > 10 && a < 10 && b < 10) { var big = Math.max(a, b), sm = Math.min(a, b), need = 10 - big; return 'Make ten: ' + big + ' + ' + need + ' + ' + (sm - need) + ' = ' + (a + b) + '.'; }
      if (a === 10 || b === 10) return 'Adding 10: 1 ten and ' + (a === 10 ? b : a) + ' ones make ' + (a + b) + '.';
      if (a + b === 10) return 'Ten partners: ' + a + ' and ' + b + ' make 10.';
      if (Math.min(a, b) <= 3) return 'Start with ' + Math.max(a, b) + ' and count on ' + Math.min(a, b) + '.';
      return 'Think of a fact you know, like a double or 10, and adjust.';
    }
    if (f.op === '−') {
      var c = a, s = b, d = c - s;
      if (c > 10 && s > c - 10) return 'Get to 10 first: ' + c + ' − ' + (c - 10) + ' = 10, then − ' + (s - (c - 10)) + ' more = ' + d + '.';
      return 'Think addition: ' + s + ' + ? = ' + c + '. The answer is ' + d + '.';
    }
    if (f.op === '÷') return 'Think multiplication: ' + b + ' × ? = ' + a + '. The answer is ' + f.ans + '.';
    var pr = [0, 1, 10, 2, 5, 9, 11, 4, 3, 6, 8, 12, 7], x = pr.indexOf(a) <= pr.indexOf(b) ? a : b, n = x === a ? b : a, p = a * b;
    if (x === 0) return 'Anything times 0 is 0.';
    if (x === 1) return 'Times 1 keeps the number the same.';
    if (x === 10) return '10 groups of ' + n + ' is ' + p + '.';
    if (x === 2) return 'Double it: ' + n + ' + ' + n + ' = ' + p + '.';
    if (x === 5) return 'Half of 10 × ' + n + ': 10 × ' + n + ' = ' + (10 * n) + ', half is ' + p + '.';
    if (x === 9) return 'Use 10: 10 × ' + n + ' = ' + (10 * n) + ', minus ' + n + ' = ' + p + '.';
    if (x === 11) return '10 × ' + n + ' + ' + n + ' = ' + p + '.';
    if (x === 4) return 'Double, then double again: ' + n + ', ' + (2 * n) + ', ' + p + '.';
    if (x === 3) return 'Double it, then add one more group: ' + (2 * n) + ' + ' + n + ' = ' + p + '.';
    if (a === b) return 'A square: ' + a + ' × ' + a + ' = ' + p + '.';
    if (Math.abs(a - b) === 1) { var lo = Math.min(a, b); return 'Use a square: ' + lo + ' × ' + lo + ' = ' + (lo * lo) + ', plus ' + lo + ' = ' + p + '.'; }
    if (x === 6) return '5 × ' + n + ' = ' + (5 * n) + ', plus one more ' + n + ' = ' + p + '.';
    if (x === 8) return 'Double three times: ' + n + ', ' + (2 * n) + ', ' + (4 * n) + ', ' + p + '.';
    if (x === 12) return '10 × ' + n + ' + 2 × ' + n + ' = ' + (10 * n) + ' + ' + (2 * n) + ' = ' + p + '.';
    return 'Break it apart: 5 × ' + n + ' + ' + (x - 5) + ' × ' + n + ' = ' + (5 * n) + ' + ' + ((x - 5) * n) + ' = ' + p + '.';
  }
  function factStr(f) { return f.a + ' ' + f.op + ' ' + f.b; }

  /* ---------- header ---------- */
  var top = document.getElementById('fl-top'), acts = document.getElementById('fl-actions');
  if (isStudent || P.get('r')) { var bk = document.getElementById('fl-back'); if (bk) bk.remove(); }
  function btn(label, cls, fn, parent) { var b = O.el('button', { type: 'button', class: 'om-btn small ' + (cls || '') }, label); b.onclick = fn; (parent || acts).appendChild(b); return b; }

  /* ================= TEACHER SETUP ================= */
  function teacher() {
    var s = S0(P.get('q'));
    document.title = 'Fact Check · set up · OAO Math Tools';
    app.innerHTML = '<div class="fl-grid"><section class="fl-card" id="fl-setup"></section><section class="fl-card fl-notes" id="fl-notes"></section></div>';
    var box = document.getElementById('fl-setup');
    function paint() {
      var h = '<h2>Set up a fact check</h2><h3>Operation</h3><div class="fl-chips" data-k="op">' +
        [['add', '+ Add'], ['sub', '− Subtract'], ['addsub', '+ and −'], ['mul', '× Multiply'], ['div', '÷ Divide'], ['muldiv', '× and ÷']].map(function (o) { return '<button data-v="' + o[0] + '" aria-pressed="' + (s.op === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>';
      if (!isMul(s.op)) {
        h += '<h3>Facts</h3><div class="fl-chips" data-k="fam">' + ADD_FAMS.map(function (f) { return '<button data-v="' + f[0] + '" aria-pressed="' + (s.fam === f[0]) + '">' + esc(f[1]) + ' <small style="opacity:.7">' + f[2] + '</small></button>'; }).join('') + '</div>';
      } else {
        h += '<h3>Fact families (pick any)</h3><p class="om-hint" style="margin:0 0 .4rem">A good order: ×2, ×5, ×10 first, then ×3 and ×4, then ×6, ×7, ×8, ×9.</p>' +
          FACS.map(function (row) { return '<div class="fl-chips" data-k="facs" style="margin-bottom:.35rem">' + row.map(function (x) { return '<button data-v="' + x + '" aria-pressed="' + (s.facs.indexOf(x) > -1) + '">×' + x + '</button>'; }).join('') + '</div>'; }).join('') +
          '<div class="fl-chips" data-k="facs" style="margin-bottom:.35rem"><button data-v="0" aria-pressed="' + (s.facs.indexOf(0) > -1) + '">×0</button><button data-v="1" aria-pressed="' + (s.facs.indexOf(1) > -1) + '">×1</button><button data-all="1">All 0–10</button></div>' +
          '<label class="om-check"><input type="checkbox" data-c="sq"' + (s.sq ? ' checked' : '') + '> Squares (like 7 × 7)</label>' +
          '<label class="om-check"><input type="checkbox" data-c="to12"' + (s.to12 ? ' checked' : '') + '> Include ×11 and ×12 (part of the Florida benchmark: factors up to 12)</label>';
      }
      var pool = makeFacts(s).length;
      h += '<h3>How many facts</h3><div class="fl-chips" data-k="n">' + [[10, '10'], [20, '20'], [30, '30'], [0, 'All ' + pool]].map(function (o) { return '<button data-v="' + o[0] + '" aria-pressed="' + (s.n === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>' +
        '<h3>Timer</h3><div class="fl-chips" data-k="tm">' + [[0, 'Off (recommended)'], [60, '1 minute'], [120, '2 minutes']].map(function (o) { return '<button data-v="' + o[0] + '" aria-pressed="' + (s.tm === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>' +
        '<label class="om-check" style="margin-top:.7rem"><input type="checkbox" data-c="goal"' + (s.goal ? ' checked' : '') + '> Show students the fast-fact goal (about 3 seconds a fact)</label>' +
        '<div class="fl-goal">' + goalText(s) + '</div>' +
        '<p class="fl-sum">' + esc(label(s)) + ' · ' + pool + ' different facts' + (s.tm ? ' · ' + (s.tm / 60) + '-minute timer' : ' · no timer') + '</p>' +
        '<div class="om-row"><button class="om-btn primary" id="fl-share">Share with students</button><button class="om-btn" id="fl-try">Try it ↗</button></div>';
      box.innerHTML = h;
      [].forEach.call(box.querySelectorAll('.fl-chips button'), function (b) {
        b.onclick = function () {
          var k = b.parentNode.dataset.k;
          if (b.dataset.all) s.facs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
          else if (k === 'facs') { var v = +b.dataset.v, i = s.facs.indexOf(v); if (i > -1) s.facs.splice(i, 1); else s.facs.push(v); s.facs.sort(function (x, y) { return x - y; }); if (!s.facs.length && !s.sq) s.facs = [v]; }
          else if (k === 'op') { var was = isMul(s.op); s.op = b.dataset.v; if (!isMul(s.op) && was !== isMul(s.op) && !s.fam) s.fam = 'w10'; if (s.op === 'sub' && s.fam === 'teen') s.fam = 'teen'; }
          else s[k] = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v;
          if (!isMul(s.op) && s.fam === 'teen' && s.op === 'add') s.op = 'sub';
          paint();
        };
      });
      [].forEach.call(box.querySelectorAll('[data-c]'), function (c) { c.onchange = function () { s[c.dataset.c] = c.checked ? 1 : 0; paint(); }; });
      document.getElementById('fl-share').onclick = function () {
        if (!makeFacts(s).length) { O.toast('Pick at least one fact family.'); return; }
        O.share({ title: 'Fact Check: ' + label(s), url: link(s), note: 'Students open a clean fact check. No names, no logins. They can download their score or send you a link to it.',
          dir: { title: 'Fact Check', intro: 'Answer each fact. Take your time and do your best. You will see which facts you know fast and which ones to practice.', steps: ['Tap Start.', 'Type the answer with the number buttons or your keyboard, then tap ✓ or press Enter.', 'At the end, look at your fast facts and the facts to practice.', 'Download your score or copy the link to your score, and turn it in where your teacher asked.'] } });
      };
      document.getElementById('fl-try').onclick = function () { if (!makeFacts(s).length) { O.toast('Pick at least one fact family.'); return; } window.open(O.addSt(link(s)), '_blank'); };
    }
    paint();
    document.getElementById('fl-notes').innerHTML =
      '<h2>Teacher notes</h2>' +
      '<p><b>What fluency means.</b> Fact fluency is more than speed. Researchers describe four parts: <b>accuracy</b> (getting it right), <b>efficiency</b> (a quick, sensible path), <b>flexibility</b> (more than one way), and <b>choosing a good strategy</b> for the fact in front of you.</p>' +
      '<p><b>Why the timer is off by default.</b> Timed tests show little about how students think and are linked to math anxiety, even for strong students. Fact Check times each fact quietly instead, so you still see which facts are automatic without a clock on the screen.</p>' +
      '<p><b>Fast facts and strategy facts.</b> A correct answer in about 3 seconds or less counts as a <b>fast fact</b> (known from memory). A correct answer that took longer is a <b>strategy fact</b>: the student worked it out. Both are good news. Strategy facts show you what to practice next.</p>' +
      '<p><b>Using the score.</b></p><ul><li>Look at the strategy facts and the facts to practice. Do they share a family (like ×7 or make-ten facts)?</li><li>Ask a student about one: “How did you figure out 8 + 6?” Their answer tells you more than the number.</li><li>Students also rate how it felt. Read that too.</li><li>Compare each student with their own last score, not with classmates.</li></ul>' +
      '<p><b>If you turn the timer on.</b> As context only, curriculum-based measures expect about 20 digits correct a minute in Grades 1–2, 30 in Grade 3, 40 in Grade 4 and 30 in Grade 5 on mixed computation probes. Fact Check counts facts, not digits, so treat these as a rough guide.</p>' +
      '<p><b>A good routine.</b> 2–3 minutes, a few times a week, on one family at a time. Then practice the slow facts with a strategy (the score card gives one for each), and celebrate growth.</p>' +
      '<p class="fl-src">Sources: Kling &amp; Bay-Williams, <a href="https://bpb-us-e1.wpmucdn.com/sites.psu.edu/dist/3/1552/files/2018/07/assessing-basic-fact-fluency-TCM-yxaog2.pdf" target="_blank" rel="noopener">“Assessing Basic Fact Fluency,” Teaching Children Mathematics (2014)</a> · Jo Boaler, <a href="https://newsroom.unl.edu/announce/csmce/3499/18149" target="_blank" rel="noopener">“Research suggests timed tests cause math anxiety”</a> · Florida B.E.S.T. benchmarks <a href="https://www.hillsboroughschools.org/cms/lib/FL50000635/Centricity/domain/5824/grade%20k/MAKNSO31.pdf" target="_blank" rel="noopener">MA.K.NSO.3.1</a>, <a href="https://www.hillsboroughschools.org/cms/lib/FL50000635/Centricity/domain/5824/grade%201/MA.1.NSO.2.1.pdf" target="_blank" rel="noopener">MA.1.NSO.2.1</a>, <a href="https://cpalms.org/PreviewStandard/Export/15284" target="_blank" rel="noopener">MA.2.NSO.2.1</a>, <a href="https://www.hillsboroughschools.org/Page/9968" target="_blank" rel="noopener">MA.3.NSO.2.4 and MA.4.NSO.2.1</a> · <a href="https://cdn.vanderbilt.edu/vu-my/wp-content/uploads/sites/270/2011/09/14093115/IA.Math-CBM.pdf" target="_blank" rel="noopener">IRIS Center (Vanderbilt), math CBM benchmarks</a>.</p>';
  }
  function link(s) { return location.href.split('#')[0].split('?')[0] + '?q=' + O.enc(s); }

  /* ================= STUDENT ================= */
  function student(facts0) {
    var s = S0(P.get('q')), pool = makeFacts(s);
    var facts = facts0 || deal(pool, s.n), log = [], i = 0, t0 = 0, typed = '', busy = false, endAt = 0, tick = null;
    document.title = 'Fact Check · OAO Math Tools';
    acts.innerHTML = '';
    if (!pool.length) { app.innerHTML = '<div class="fl-card"><p>This fact check has no facts. Ask your teacher for a new link.</p></div>'; return; }
    app.innerHTML = '<div class="fl-card fl-stage fl-start"><p class="big">Fact Check</p><p>' + esc(label(s)) + '</p><p>' + facts.length + ' facts. ' +
      (s.tm ? 'You have ' + (s.tm / 60) + ' minute' + (s.tm > 60 ? 's' : '') + '. Go at your own pace.' : 'Take your time.') + '</p>' +
      (s.goal ? '<p class="om-hint">Goal: facts you know fast, in about 3 seconds. It’s fine to use a strategy too.</p>' : '') +
      '<button class="om-btn primary" id="fl-go" style="font-size:1.3rem;min-height:56px;padding:.4em 1.6em">Start</button></div>';
    var go = document.getElementById('fl-go'); go.focus(); go.onclick = begin;

    function begin() {
      app.innerHTML = '<div class="fl-card fl-stage">' + (s.tm ? '<div class="fl-bar" aria-hidden="true"><span id="fl-bar"></span></div>' : '') +
        '<p class="fl-count" id="fl-count"></p><div class="fl-fact" id="fl-fact" aria-live="polite"></div><div class="fl-fb" id="fl-fb" aria-live="polite"></div>' +
        '<div class="fl-pad" id="fl-pad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (d) { return '<button data-d="' + d + '">' + d + '</button>'; }).join('') +
        '<button class="del" data-del="1" aria-label="Erase">⌫</button><button data-d="0">0</button><button class="go" data-ok="1" aria-label="Check">✓</button></div>' +
        '<div class="om-row" style="justify-content:center"><button class="om-btn small" id="fl-stop">I’m done</button></div></div>';
      [].forEach.call(document.querySelectorAll('#fl-pad button'), function (b) { b.onclick = function () { if (b.dataset.d != null) key(b.dataset.d); else if (b.dataset.del) key('Backspace'); else key('Enter'); }; });
      document.getElementById('fl-stop').onclick = finish;
      document.addEventListener('keydown', onKey);
      if (s.tm) { endAt = Date.now() + s.tm * 1000; var bar = document.getElementById('fl-bar'); tick = setInterval(function () { var left = Math.max(0, endAt - Date.now()); bar.style.width = (left / (s.tm * 1000) * 100) + '%'; if (!left) finish(); }, reduce ? 1000 : 250); }
      show();
    }
    function onKey(e) { if (e.target && e.target.tagName === 'INPUT') return; if (/^[0-9]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') { e.preventDefault(); key(e.key); } }
    function show() {
      if (i >= facts.length) return finish();
      var f = facts[i]; typed = '';
      document.getElementById('fl-count').textContent = 'Fact ' + (i + 1) + ' of ' + facts.length;
      document.getElementById('fl-fact').innerHTML = '<span>' + f.a + '</span><span>' + f.op + '</span><span>' + f.b + '</span><span>=</span><span class="fl-ans" id="fl-ans"></span>';
      document.getElementById('fl-fb').textContent = ''; document.getElementById('fl-fb').className = 'fl-fb';
      t0 = performance.now(); busy = false;
    }
    function key(k) {
      if (busy) return; var ans = document.getElementById('fl-ans'); if (!ans) return;
      if (/^[0-9]$/.test(k)) { if (typed.length < 4) typed += k; }
      else if (k === 'Backspace') typed = typed.slice(0, -1);
      else if (k === 'Enter') { if (!typed) return; check(); return; }
      ans.textContent = typed;
    }
    function check() {
      var f = facts[i], ms = Math.round(performance.now() - t0), ok = +typed === f.ans; busy = true;
      log.push({ a: f.a, op: f.op, b: f.b, ans: f.ans, g: +typed, ms: ms, ok: ok });
      var fb = document.getElementById('fl-fb');
      if (ok) { fb.className = 'fl-fb ok'; fb.textContent = '✓'; }
      else { fb.className = 'fl-fb no'; fb.textContent = factStr(f) + ' = ' + f.ans; }
      setTimeout(function () { i++; show(); }, ok ? 450 : 1400);
    }
    function finish() {
      if (finish.done) return; finish.done = true; clearInterval(tick); document.removeEventListener('keydown', onKey);
      var r = summarize(s, log, facts.length);
      scoreCard(r, false, function again(slow) { finish.done = false; var nf = slow ? deal(r.pr.map(function (x) { return x; }), Math.max(r.pr.length, Math.min(10, r.pr.length * 2))) : shuffle(facts); student(nf.length ? nf : null); });
    }
  }
  function summarize(s, log, planned) {
    var fast = log.filter(function (x) { return x.ok && x.ms <= FAST; }), strat = log.filter(function (x) { return x.ok && x.ms > FAST; }), miss = log.filter(function (x) { return !x.ok; });
    var seen = {}, pr = [];
    miss.concat(strat).forEach(function (x) { var k = x.a + x.op + x.b; if (!seen[k]) { seen[k] = 1; pr.push({ a: x.a, op: x.op, b: x.b, ans: x.ans }); } });
    return { L: label(s), d: new Date().toISOString(), tm: s.tm, n: log.length, pl: planned, c: fast.length + strat.length, f: fast.length, s: strat.length, m: miss.length, pr: pr.slice(0, 24), sa: -1, cn: '' };
  }

  /* ================= SCORE CARD ================= */
  var FACES = ['😀 I knew them', '🤔 Some I figured out', '🌱 I need practice'];
  function scoreCard(r, readOnly, again) {
    acts.innerHTML = '';
    var h = '<div class="fl-card fl-score">' + (readOnly ? '<p class="fl-ro">A student’s Fact Check score (read only).' + (r.cn ? ' Class number: ' + esc(r.cn) + '.' : '') + '</p>' : '') +
      '<h2>' + (readOnly ? 'Fact Check score' : 'Nice work! Here is your score.') + '</h2><p style="margin:0;color:var(--mute);font-weight:700">' + esc(r.L) + ' · ' + new Date(r.d).toLocaleString() + (r.tm ? ' · ' + (r.tm / 60) + '-minute timer' : '') + '</p>' +
      '<div class="fl-stats"><div class="fl-stat"><b>' + r.c + ' of ' + r.n + '</b>correct' + (r.n < r.pl ? ' (' + r.pl + ' planned)' : '') + '</div><div class="fl-stat fast"><b>' + r.f + '</b>fast facts<br><small>about 3 seconds or less</small></div><div class="fl-stat strat"><b>' + r.s + '</b>strategy facts<br><small>right, took a little longer</small></div><div class="fl-stat miss"><b>' + r.m + '</b>to fix</div></div>';
    if (r.pr.length) h += '<h3 style="font-family:Nunito,sans-serif;font-size:1rem;margin:.2rem 0">Facts to practice</h3><ul class="fl-prac">' + r.pr.map(function (f) { return '<li><b>' + esc(factStr(f)) + ' = ' + f.ans + '</b>' + esc(hint(f)) + '</li>'; }).join('') + '</ul>';
    else h += '<p style="font-weight:700;color:var(--green)">Every fact was fast. Ask your teacher for a new fact family!</p>';
    h += '<h3 style="font-family:Nunito,sans-serif;font-size:1rem;margin:.6rem 0 .3rem">How did it feel?</h3><div class="fl-faces" id="fl-faces">' + FACES.map(function (t, k) { return '<button data-k="' + k + '" aria-pressed="' + (r.sa === k) + '"' + (readOnly ? ' disabled' : '') + '>' + t + '</button>'; }).join('') + '</div>';
    if (!readOnly) h += '<label class="fl-cn">My class number (if your teacher asks): <input id="fl-cn" inputmode="numeric" maxlength="6" value="' + esc(r.cn) + '"></label>';
    h += '<div class="om-row"><button class="om-btn primary" id="fl-dl">Download my score</button>' + (readOnly ? '' : '<button class="om-btn primary" id="fl-link">Copy link to my score</button><button class="om-btn" id="fl-again">Try again</button>' + (r.pr.length ? '<button class="om-btn" id="fl-slow">Practice my slow facts</button>' : '')) + '</div>' +
      (readOnly ? '' : '<p class="om-hint">Turn in your score where your teacher asked: a Canvas assignment (File Upload for the picture, Website URL for the link), a discussion, or the chat.</p>') + '</div>';
    app.innerHTML = h;
    [].forEach.call(document.querySelectorAll('#fl-faces button'), function (b) { b.onclick = function () { r.sa = +b.dataset.k; [].forEach.call(document.querySelectorAll('#fl-faces button'), function (x) { x.setAttribute('aria-pressed', x === b); }); }; });
    var cn = document.getElementById('fl-cn'); if (cn) cn.oninput = function () { r.cn = cn.value.trim(); };
    document.getElementById('fl-dl').onclick = function () { download(r); };
    var lk = document.getElementById('fl-link'); if (lk) lk.onclick = function () { O.copy(location.href.split('#')[0].split('?')[0] + '?r=' + O.enc(r), 'Link to your score copied'); };
    var ag = document.getElementById('fl-again'); if (ag) ag.onclick = function () { again(false); };
    var sl = document.getElementById('fl-slow'); if (sl) sl.onclick = function () { again(true); };
  }
  function download(r) {
    var W = 900, lines = r.pr.slice(0, 12), H = 360 + lines.length * 30, sc = 2, c = document.createElement('canvas'); c.width = W * sc; c.height = H * sc;
    var g = c.getContext('2d'); g.scale(sc, sc); g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#0E1C42'; g.fillRect(0, 0, W, 70); ['#6B46C1', '#23915A', '#F2B705'].forEach(function (col, k) { g.fillStyle = col; g.fillRect(k * W / 3, 70, W / 3, 6); });
    g.fillStyle = '#fff'; g.font = 'bold 28px Lora, Georgia, serif'; g.fillText('Fact Check score', 28, 46);
    g.fillStyle = '#5B6478'; g.font = '16px Nunito, Arial, sans-serif'; g.fillText(r.L + '  ·  ' + new Date(r.d).toLocaleString() + (r.tm ? '  ·  ' + (r.tm / 60) + '-minute timer' : '') + (r.cn ? '  ·  Class number ' + r.cn : ''), 28, 108);
    var boxes = [[r.c + ' of ' + r.n, 'correct', '#F6F7FB', '#0E1C42'], [String(r.f), 'fast facts', '#E5F5EC', '#23915A'], [String(r.s), 'strategy facts', '#FFF6D6', '#8a6400'], [String(r.m), 'to fix', '#EFE9FB', '#6B46C1']];
    boxes.forEach(function (b, k) { var x = 28 + k * 213; g.fillStyle = b[2]; g.fillRect(x, 128, 200, 96); g.fillStyle = b[3]; g.font = 'bold 34px Lora, Georgia, serif'; g.fillText(b[0], x + 16, 176); g.font = '16px Nunito, Arial, sans-serif'; g.fillText(b[1], x + 16, 204); });
    g.fillStyle = '#0E1C42'; g.font = 'bold 18px Nunito, Arial, sans-serif'; g.fillText(r.sa > -1 ? 'How it felt: ' + FACES[r.sa].replace(/^\S+\s/, '') : 'How it felt: (not picked)', 28, 260);
    g.fillText(lines.length ? 'Facts to practice:' : 'Every fact was fast!', 28, 296);
    g.font = '16px Nunito, Arial, sans-serif'; lines.forEach(function (f, k) { g.fillStyle = '#0E1C42'; g.fillText(factStr(f) + ' = ' + f.ans + '   ' + hint(f), 40, 326 + k * 30); });
    var a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'fact-check-score.png'; document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- route ---------- */
  if (P.get('r')) { var rr = O.dec(P.get('r')); if (rr) { document.title = 'Fact Check score · OAO Math Tools'; scoreCard(rr, true); } else app.innerHTML = '<div class="fl-card"><p>This score link is broken.</p></div>'; }
  else if (isStudent) student();
  else teacher();
})();
