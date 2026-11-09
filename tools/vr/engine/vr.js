/* G4 Math VR · Commission engine (ported from the G3 math kit). No week words: everything comes from window.VR (built from week.json). */
(function () {
  var V = window.VR || {}, G = V.game || {}, PRE = V.pre || 'g4math-vr';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function load() { try { return JSON.parse(localStorage.getItem(PRE) || '{}'); } catch (e) { return {}; } }
  var st = load();
  st.steps = st.steps || []; st.g = st.g || { stage: 0, a: 0, b: 0, eq: [], eqOk: false }; st.p = st.p || '';
  function save() { try { localStorage.setItem(PRE, JSON.stringify(st)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function words(s) { return (String(s).match(/[A-Za-z0-9’']+/g) || []).length; }
  function sentences(s) { return String(s).split(/[.!?]+/).filter(function (x) { return words(x) >= 3; }).length; }

  /* details pill */
  var db = $('#wl-details-btn'), dd = $('#wl-details');
  if (db && dd) db.addEventListener('click', function () { var o = dd.classList.toggle('open'); db.setAttribute('aria-expanded', o); });

  /* audio */
  var audio = null, playing = null;
  $$('.vr-play').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = b.getAttribute('data-clip');
      if (audio) { audio.pause(); }
      $$('.vr-play').forEach(function (x) { x.classList.remove('on'); });
      if (playing === b) { playing = null; return; }
      audio = new Audio(V.clips[c]); playing = b; b.classList.add('on');
      audio.onended = function () { b.classList.remove('on'); playing = null; };
      audio.play().catch(function () { b.classList.remove('on'); });
    });
  });

  /* teacher video: shown only when the file exists */
  if (V.video && window.fetch) {
    fetch(V.video, { method: 'HEAD' }).then(function (r) {
      if (r.ok) { var w = $('#vr-video'); $('video', w).src = V.video; w.hidden = false; }
    }).catch(function () {});
  }

  /* path toggle */
  function showPath(id) {
    $$('.vr-path').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-path') === id); });
    $$('.vr-pane').forEach(function (p) { p.classList.toggle('on', p.id === id); });
    st.path = id; save();
  }
  $$('.vr-path').forEach(function (b) {
    b.addEventListener('click', function () {
      showPath(b.getAttribute('data-path'));
      var p = $('#' + b.getAttribute('data-path')); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  if (st.path) showPath(st.path);

  /* checklist: optional steps (the VR-only Extra) never block the seal */
  var steps = $$('.vr-step');
  function paintSteps() {
    var n = 0, need = 0, got = 0;
    steps.forEach(function (s, i) {
      var d = !!st.steps[i], opt = s.hasAttribute('data-optional');
      if (!opt) { need++; if (d) got++; }
      s.classList.toggle('done', d);
      var b = $('.vr-chk', s); b.textContent = d ? '✓' : ''; b.setAttribute('aria-pressed', d);
    });
    var t = $('#vr-prog-t'), bar = $('#vr-prog-b');
    if (t) t.textContent = got + ' of ' + need + ' steps done';
    if (bar) bar.style.width = (100 * got / need) + '%';
    var sent = $('#vr-sent'); if (sent) sent.checked = !!st.sent;
    var bd = $('#vr-badge'); if (bd) bd.classList.toggle('on', got === need && !!st.sent);
  }
  steps.forEach(function (s, i) {
    $('.vr-chk', s).addEventListener('click', function () { st.steps[i] = !st.steps[i]; save(); paintSteps(); });
  });
  var sent = $('#vr-sent');
  if (sent) sent.addEventListener('change', function () {
    st.sent = sent.checked;
    if (sent.checked) steps.forEach(function (s, i) { if (!s.hasAttribute('data-optional')) st.steps[i] = true; });
    save(); paintSteps();
  });
  paintSteps();

  /* help drawer: load the video only when opened */
  var help = $('#vr-help');
  if (help) help.addEventListener('toggle', function () {
    if (!help.open) return;
    var f = $('iframe[data-src]', help); if (f && !f.src) f.src = f.getAttribute('data-src');
  });

  /* ---------- Sketchbook Day: tile the floor sketch (game type "floor") ----------
     Stage 0: cover Part A with its piece. Stage 1: cover Part B. Stage 2: build the equation with tiles.
     Tap a piece or drag it onto the sketch; tap a tile or drag it onto the equation line. One stage shows at a time. */
  var game = $('#vr-game'), K = G.sketch || {}, EQ = G.eq || {}, NM = G.names || {};
  var PARTS = [K.partA, K.partB].filter(Boolean);
  function pname(kind, n) { var w = NM[kind] || [kind, kind + 's']; return n === 1 ? w[0] : w[1]; }
  function sketchSVG(a, b, live) {
    var s = 14, pad = 6, Wd = 0, Ht = 0;
    PARTS.forEach(function (P) { Wd = Math.max(Wd, P.x + P.w); Ht = Math.max(Ht, P.y + P.h); });
    var h = '<svg class="sk-svg" viewBox="0 0 ' + (Wd * s + pad * 2 + 70) + ' ' + (Ht * s + pad * 2) + '" aria-hidden="true"><rect width="100%" height="100%" fill="#F7F0E1"/>';
    PARTS.forEach(function (P, k) {
      var x = pad + P.x * s, y = pad + P.y * s, have = k === 0 ? a : b, col = (G.colors || {})[P.piece] || '#999';
      for (var j = 0; j < P.h; j++) for (var i = 0; i < P.w; i++) h += '<rect x="' + (x + i * s) + '" y="' + (y + j * s) + '" width="' + s + '" height="' + s + '" fill="#fffaf0" stroke="#d8c7a6" stroke-width=".8"/>';
      /* one piece covers (w*h)/count squares: a Flat covers the whole part; each Rod covers one column */
      var per = P.count, cols = P.w / per, rows = P.h;
      for (var q = 0; q < Math.min(have, per); q++) {
        h += '<g class="' + (live === k && q === have - 1 ? 'pg-new' : '') + '"><rect x="' + (x + q * cols * s) + '" y="' + y + '" width="' + (cols * s) + '" height="' + (rows * s) + '" fill="' + col + '" stroke="#7a3c10" stroke-width="1.5"/>';
        for (var c = 1; c < cols; c++) h += '<line x1="' + (x + (q * cols + c) * s) + '" y1="' + y + '" x2="' + (x + (q * cols + c) * s) + '" y2="' + (y + rows * s) + '" stroke="#fff" stroke-opacity=".55"/>';
        for (var r = 1; r < rows; r++) h += '<line x1="' + (x + q * cols * s) + '" y1="' + (y + r * s) + '" x2="' + (x + (q + 1) * cols * s) + '" y2="' + (y + r * s) + '" stroke="#fff" stroke-opacity=".55"/>';
        h += '</g>';
      }
      h += '<rect x="' + x + '" y="' + y + '" width="' + (P.w * s) + '" height="' + (P.h * s) + '" fill="none" stroke="#2B1D12" stroke-width="3"' + (live === k ? ' class="sk-live"' : '') + '/>';
      h += '<text x="' + (pad + (P.x + P.w) * s + 8) + '" y="' + (y + P.h * s / 2 + 5) + '" font-family="Georgia,serif" font-size="15" font-weight="700" fill="#9e4552">' + esc(P.label) + '</text>';
    });
    return h + '</svg>';
  }
  function pieceSVG(kind) {
    var col = (G.colors || {})[kind] || '#999';
    if (kind === 'flat') return '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="4" width="32" height="32" fill="' + col + '" stroke="#7a3c10" stroke-width="1.5"/></svg>';
    return '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="16" y="2" width="8" height="36" fill="' + col + '" stroke="#7a3c10" stroke-width="1.5"/></svg>';
  }
  function eqText(t) { return (t || []).join('').replace(/\*/g, '×'); }
  function eqShow(t) { return eqText(t).replace(/([+×=])/g, ' $1 '); }
  function evalSide(s) {
    if (!/^\d+([+×]\d+)*$/.test(s)) return null;
    var terms = s.split('+').map(function (t) { return t.split('×').reduce(function (p, x) { return p * parseInt(x, 10); }, 1); });
    return { v: terms.reduce(function (a, b) { return a + b; }, 0), terms: terms };
  }
  function checkEq(t) {
    var s = eqText(t), said = eqShow(t), sides = s.split('=');
    if (sides.length !== 2 || !sides[0] || !sides[1]) return { ok: false, msg: EQ.noPlus };
    var L = evalSide(sides[0]), R = evalSide(sides[1]);
    if (!L || !R) return { ok: false, msg: EQ.noPlus };
    if (L.terms.length < 2) return { ok: false, msg: EQ.noPlus };
    if (L.v !== R.v) return { ok: false, msg: EQ.notTrue.replace('{eq}', said) };
    var want = (K.parts || []).slice().sort().join(','), got = L.terms.slice().sort().join(',');
    if (R.v !== K.total || got !== want) return { ok: false, msg: EQ.wrongParts.replace('{eq}', said) };
    return { ok: true, msg: EQ.ok };
  }
  function gameDone() { return st.g.stage >= 3; }
  function render() {
    var g = st.g;
    if (gameDone()) {
      game.innerHTML = '<div class="sk-wrap"><div class="sk-board">' + sketchSVG(PARTS[0].count, PARTS[1].count, -1) + '</div><div class="sk-side"><div class="sk-eq done">' + esc(eqShow(g.eq)) + '</div></div></div>' +
        '<div class="vr-fb ok">' + esc(EQ.ok) + '</div>';
      $('#vr-write').hidden = false; refresh(); return;
    }
    $('#vr-write').hidden = true;
    var total = 3, h = '<div class="vr-gstep">Step ' + (g.stage + 1) + ' of ' + total + ' · ' + (g.stage < 2 ? esc(PARTS[g.stage].label) : 'Equation') + '</div>';
    if (g.stage < 2) {
      var P = PARTS[g.stage];
      h += '<div class="pg-do">👉 Cover <b>' + esc(P.label) + '</b> with ' + esc(pname(P.piece, 2)) + '. Tap a ' + esc(pname(P.piece, 1)) + ', or drag it onto the sketch.</div>';
    } else h += '<div class="pg-do">👉 ' + esc(EQ.do) + '</div>';
    h += '<div class="sk-wrap"><div class="sk-board' + (g.stage < 2 ? ' live' : '') + '" id="sk-board">' + sketchSVG(g.a, g.b, g.stage < 2 ? g.stage : -1) + '</div><div class="sk-side">';
    if (g.stage < 2) {
      var P2 = PARTS[g.stage];
      h += '<button type="button" class="pg-slice" id="pg-piece" aria-label="Add a ' + esc(pname(P2.piece, 1)) + '">' + pieceSVG(P2.piece) + '<span>Add a ' + esc(pname(P2.piece, 1)) + '</span></button>' +
        '<button type="button" class="pg-undo" id="pg-undo">Take one off</button>';
    } else {
      h += '<div class="sk-eq" id="sk-eq" aria-label="Your equation" aria-live="polite">' + (g.eq.length ? esc(eqShow(g.eq)) : '<i>tap tiles to build it</i>') + '</div>' +
        '<div class="sk-tiles">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '×', '='].map(function (t) { return '<button type="button" class="pg-card" data-t="' + t + '">' + t + '</button>'; }).join('') + '</div>' +
        '<div class="sk-tools"><button type="button" class="pg-undo" id="sk-back">⌫ Back</button><button type="button" class="pg-undo" id="sk-clear">Clear</button><button type="button" class="vr-check" id="sk-check">Check my equation</button></div>';
    }
    h += '</div></div><div class="vr-fb" id="vr-fb" aria-live="polite"></div>';
    game.innerHTML = h;
    var fb = $('#vr-fb');
    function say(cls, t) { fb.className = 'vr-fb ' + cls; fb.textContent = t; }
    if (g.stage < 2) {
      var key = g.stage === 0 ? 'a' : 'b', P3 = PARTS[g.stage], board = $('#sk-board');
      var paint = function () {
        board.innerHTML = sketchSVG(g.a, g.b, g.stage);
        var c = g[key];
        if (c === P3.count) {
          say('ok', P3.label + ' is covered. Every small square has a tile.');
          setTimeout(function () { if (g[key] === P3.count && g.stage === (key === 'a' ? 0 : 1)) { g.stage++; save(); render(); } }, 1100);
        } else say('', c + ' ' + pname(P3.piece, c) + ' so far. Keep going until every square in ' + P3.label + ' is covered.');
      };
      var add = function () {
        if (g[key] >= P3.count) { say('no', P3.label + ' is full. There is no empty square left.'); return; }
        g[key]++; save(); paint();
      };
      $('#pg-piece').addEventListener('click', function () { if (!dragMoved) add(); });
      $('#pg-undo').addEventListener('click', function () { if (g[key] > 0) { g[key]--; save(); paint(); } });
      board.addEventListener('click', add);
      dragify($('#pg-piece'), function (x, y) { return hit(board, x, y); }, add);
    } else {
      var line = $('#sk-eq');
      var show = function () { line.innerHTML = g.eq.length ? esc(eqShow(g.eq)) : '<i>tap tiles to build it</i>'; line.classList.remove('no', 'ok'); say('', ''); };
      var put = function (t) { if (g.eq.length >= 16) return; g.eq.push(t); save(); show(); };
      $$('.pg-card', game).forEach(function (b) {
        b.addEventListener('click', function () { if (!dragMoved) put(b.getAttribute('data-t')); });
        dragify(b, function (x, y) { return hit(line, x, y); }, function () { put(b.getAttribute('data-t')); });
      });
      $('#sk-back').addEventListener('click', function () { g.eq.pop(); save(); show(); });
      $('#sk-clear').addEventListener('click', function () { g.eq = []; save(); show(); });
      $('#sk-check').addEventListener('click', function () {
        var r = checkEq(g.eq);
        if (r.ok) {
          line.classList.add('ok'); say('ok', r.msg); g.eqOk = true;
          setTimeout(function () { g.stage = 3; save(); render(); }, 1600);
        } else { line.classList.remove('no'); void line.offsetWidth; line.classList.add('no'); say('no', r.msg); }
      });
    }
  }
  function hit(el, x, y) { var r = el.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }
  var dragMoved = false;
  function dragify(el, over, drop) {
    el.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      var sx = e.clientX, sy = e.clientY, ghost = null; dragMoved = false;
      function mv(ev) {
        var dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!ghost && Math.abs(dx) + Math.abs(dy) > 8) {
          dragMoved = true; ghost = el.cloneNode(true); ghost.className += ' pg-ghost'; ghost.removeAttribute('id');
          document.body.appendChild(ghost);
        }
        if (ghost) { ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px'; ev.preventDefault(); }
      }
      function up(ev) {
        document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up);
        if (ghost) { ghost.remove(); if (over(ev.clientX, ev.clientY)) drop(); setTimeout(function () { dragMoved = false; }, 0); }
      }
      document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up);
    });
  }

  /* ---------- the math paragraph: live checks, then the stamp and the PDF gate ---------- */
  var WR = G.write || { checks: [] }, ta = $('#vr-para');
  function results() {
    var t = ta ? ta.value : '', low = t.toLowerCase();
    var r = (WR.checks || []).map(function (c) {
      if (c.re) return new RegExp(c.re, 'i').test(t);
      var n = 0; (c.words || []).forEach(function (w) { if (new RegExp('\\b' + w.replace(/ /g, '\\s+') + '\\b', 'i').test(low)) n++; });
      return n >= (c.need || 2);
    });
    r.len = words(t) >= WR.min && sentences(t) >= WR.sentences;
    return r;
  }
  function paraDone() { var r = results(); return r.len && r.every(Boolean); }
  function allDone() { return gameDone() && paraDone(); }
  function refresh() {
    var r = results(), t = ta ? ta.value : '';
    $$('#vr-checks li').forEach(function (li) { var k = li.getAttribute('data-c'); li.classList.toggle('ok', k === 'len' ? r.len : !!r[+k]); });
    var c = $('#vr-count');
    if (c) { var n = words(t), s = sentences(t); c.textContent = (n >= WR.min ? n + ' words ✓' : n + ' of ' + WR.min + ' words') + ' · ' + (s >= WR.sentences ? s + ' sentences ✓' : s + ' of ' + WR.sentences + ' sentences'); c.classList.toggle('ok', r.len); }
    var stp = $('#vr-stamp'); if (stp) stp.classList.toggle('on', allDone());
    var pdf = $('#vr-pdf'), gate = $('#vr-gate');
    if (pdf) pdf.disabled = !allDone();
    if (gate) gate.hidden = allDone();
  }
  if (ta) {
    ta.value = st.p || '';
    ta.addEventListener('input', function () { st.p = ta.value; save(); refresh(); });
  }
  $$('#vr-write .vr-chips button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!ta) return;
      var w = b.textContent.replace(/…$/, '');
      ta.value = (ta.value && !/\s$/.test(ta.value) ? ta.value + ' ' : ta.value) + w + (b.classList.contains('st') ? ' ' : '');
      ta.dispatchEvent(new Event('input')); ta.focus();
    });
  });

  /* first name with a kind filter */
  var BAD = /(stupid|dumb|idiot|hate|kill|poop|butt|fart|ugly|loser|sex|damn|hell|crap|shit|fuck|bitch|ass\b)/i;
  var nm = $('#vr-name'), nmMsg = $('#vr-name-msg');
  if (nm) {
    nm.value = st.name || '';
    nm.addEventListener('input', function () {
      var v = nm.value.trim();
      if (BAD.test(v) || /[^A-Za-zÀ-ÿ' -]/.test(v)) { nmMsg.textContent = 'Please type just your first name.'; }
      else { nmMsg.textContent = ''; st.name = v; save(); }
    });
  }

  /* PDF (Gathered Answers): the tiled sketch, the equation, the paragraph */
  var pdf = $('#vr-pdf');
  if (pdf) pdf.addEventListener('click', function () {
    if (!allDone()) return;
    var name = (st.name || '').trim();
    if (!name) { nmMsg.textContent = 'Type your first name first.'; nm.focus(); return; }
    var h = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(V.canvas) + ' · ' + esc(name) + '</title><style>body{font:16px/1.5 Arial,sans-serif;max-width:720px;margin:24px auto;padding:0 16px;color:#222}h1{font-size:22px;margin:4px 0}h2{font-size:18px;margin:18px 0 6px}.k{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#9e4552}.eq{font:700 28px Georgia,serif;border:2px solid #2B1D12;border-radius:8px;display:inline-block;padding:4px 14px}svg{max-width:360px;display:block}.st{display:inline-block;border:3px solid #2f5d4a;color:#2f5d4a;font-weight:900;letter-spacing:2px;padding:3px 12px;border-radius:8px;transform:rotate(-3deg);text-transform:uppercase}@media print{button{display:none}}</style></head><body>' +
      '<div class="k">Optima Academy Online · 4th Grade Math · Week ' + V.week + '</div><h1>' + esc(V.canvas) + ' (Sketchbook Day)</h1>' +
      '<p><b>Name:</b> ' + esc(name) + ' &nbsp; <b>Date:</b> ' + new Date().toLocaleDateString() + '</p>' +
      '<h2>My floor</h2>' + G.filledSvg + '<h2>My equation</h2><div class="eq">' + esc(eqShow(st.g.eq)) + '</div>' +
      '<h2>My math paragraph (' + words(ta.value) + ' words)</h2><p>' + esc(ta.value).replace(/\n/g, '<br>') + '</p>' +
      '<div class="st">' + esc(V.stamp) + '</div>' +
      '<p style="margin-top:24px"><button onclick="print()">🖨 Print or save as PDF</button></p></body></html>';
    var w = null; try { w = window.open('', '_blank'); } catch (e) {}
    if (w && w.document) { w.document.open(); w.document.write(h); w.document.close(); setTimeout(function () { try { w.print(); } catch (e) {} }, 400); }
    else {
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([h], { type: 'text/html' }));
      a.download = 'week-' + V.week + '-vr-sketchbook-' + name.replace(/\s+/g, '-') + '.html'; document.body.appendChild(a); a.click(); a.remove();
    }
  });

  if (game) render();
  refresh();
  window.VR_TEST = { state: st, render: render, checkEq: checkEq, results: results };
})();
