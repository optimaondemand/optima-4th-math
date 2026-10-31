/* Early number + PK–2 manipulatives: ten frames, counting bears, linking cubes, dot cards, dominoes,
   bundling sticks, Cuisenaire rods, beads, attribute blocks, geometric solids, bucket balance.
   Open tools for young children: everything moves by dragging with a finger; taps and keys are the backup. */
(function () {
  var O = OAOM, lastDrag = 0;
  var RED = '#D2453B', YEL = '#F2B705', BLU = '#2F6FDE', GRN = '#23915A', NAVY = '#0E1C42', VIO = '#6B46C1', ORG = '#F08A24', MUTE = '#5B6478', LINE = '#C9D0E0';

  /* ---------- shared helpers ---------- */
  function narrow(api) { return (api.stage.clientWidth || 800) < 560; }
  function inR(p, r) { return r && p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h; }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function tw(ms, f, done) {
    if (O.reduce) { f(1); if (done) done(); return; }
    var t0 = performance.now();
    function st(t) { var k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3); f(e); if (k < 1) requestAnimationFrame(st); else if (done) done(); }
    requestAnimationFrame(st);
  }
  function svgBox(holder, W, H, label) { var v = O.svg(W, H, holder, label); v.style.touchAction = 'none'; return v; }
  function rect(v, x, y, w, h, a) { return O.s('rect', Object.assign({ x: x, y: y, width: w, height: h }, a || {}), v); }
  function txt(v, x, y, t, a) { return O.s('text', Object.assign({ x: x, y: y, 'text-anchor': 'middle', fill: NAVY, 'font-size': 16, text: t, style: 'pointer-events:none' }, a || {}), v); }
  /* a piece you can drag (a ghost follows the finger) and tap. onDrop(p, p0) returns true when it changed the state */
  function dragTap(svgEl, node, onTap, onDrop, label) {
    if (onTap) O.tap(node, function (e) { if (e && e.stopPropagation) e.stopPropagation(); if (Date.now() - lastDrag < 350) return; onTap(e); }, label);
    else if (label) node.setAttribute('aria-label', label);
    node.style.cursor = 'grab';
    node.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return; e.preventDefault(); e.stopPropagation();
      var id = e.pointerId, p0 = O.pt(svgEl, e), moved = false, ghost = null, orig = node.getAttribute('transform') || '';
      try { node.setPointerCapture(id); } catch (x) {}
      function mv(ev) {
        if (ev.pointerId !== id) return; var p = O.pt(svgEl, ev);
        if (!moved && Math.hypot(p.x - p0.x, p.y - p0.y) > 6) { moved = true; ghost = node.cloneNode(true); ghost.style.pointerEvents = 'none'; ghost.removeAttribute('tabindex'); ghost.setAttribute('opacity', '0.92'); svgEl.appendChild(ghost); node.style.opacity = '0.25'; }
        if (moved) ghost.setAttribute('transform', 'translate(' + (p.x - p0.x) + ' ' + (p.y - p0.y) + ') ' + orig);
      }
      function up(ev) {
        if (ev.pointerId !== id) return;
        node.removeEventListener('pointermove', mv); node.removeEventListener('pointerup', up); node.removeEventListener('pointercancel', up);
        if (!moved) return; lastDrag = Date.now();
        var pe = O.pt(svgEl, ev), ok = false;
        try { ok = onDrop(pe, p0) === true; } catch (err) { if (window.console) console.error(err); }
        if (ok) { if (ghost.parentNode) ghost.remove(); return; }
        var dx = pe.x - p0.x, dy = pe.y - p0.y;
        tw(300, function (k) { ghost.setAttribute('transform', 'translate(' + dx * (1 - k) + ' ' + dy * (1 - k) + ') ' + orig); }, function () { ghost.remove(); node.style.opacity = ''; });
      }
      node.addEventListener('pointermove', mv); node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
    });
  }
  /* type a short label right on the picture */
  function editText(api, anchor, val, done) {
    var st = api.stage; st.style.position = 'relative';
    var r = anchor.getBoundingClientRect(), sr = st.getBoundingClientRect(), w = Math.max(130, r.width + 40);
    var i = O.el('input', { type: 'text', value: val || '', maxlength: '20', 'aria-label': 'Label',
      style: 'position:absolute;left:' + Math.max(0, r.left - sr.left + r.width / 2 - w / 2) + 'px;top:' + Math.max(0, r.top - sr.top - 8) + 'px;width:' + w + 'px;font:700 17px Nunito,sans-serif;border:2px solid ' + VIO + ';border-radius:10px;padding:5px 8px;z-index:6;background:#fff' });
    st.appendChild(i); i.focus(); i.select();
    var fin = function (ok) { if (!i.parentNode) return; var v = i.value.trim(); i.remove(); if (ok) done(v); };
    i.addEventListener('keydown', function (e) { if (e.key === 'Enter') fin(true); if (e.key === 'Escape') fin(false); });
    i.addEventListener('blur', function () { fin(true); });
  }
  function sbtn(parent, label, fn, cls) { var b = O.el('button', { type: 'button', class: 'om-btn ' + (cls || '') }, label); b.addEventListener('click', fn); parent.appendChild(b); return b; }
  /* redraw when the screen switches between phone and wide layouts */
  function watchSize(api, holder, draw) {
    var last = narrow(api);
    function on() { if (!holder.isConnected) { window.removeEventListener('resize', on); return; } var n = narrow(api); if (n !== last) { last = n; draw(); } }
    window.addEventListener('resize', on);
  }
  function counter(v, x, y, r, c) {
    var g = O.s('g', {}, v);
    O.s('circle', { cx: x, cy: y, r: r, fill: c === 1 ? RED : YEL, stroke: c === 1 ? '#9E2A22' : '#B88700', 'stroke-width': 2.5 }, g);
    O.s('circle', { cx: x - r * 0.3, cy: y - r * 0.3, r: r * 0.25, fill: '#fff', opacity: 0.35, style: 'pointer-events:none' }, g);
    return g;
  }

  /* ═════════════ TEN FRAMES & PART-PART-WHOLE ═════════════ */
  O.register('tenframe', {
    defaults: { m: 'double', c: [], A: [], B: [] },
    mount: function (api) {
      var S = api.S, holder = O.el('div'); api.stage.appendChild(holder);
      api.quick([['One ten frame', { m: 'one', c: [] }], ['Double ten frame', { m: 'double', c: [] }], ['Part-Part-Whole', { m: 'ppw', A: [], B: [] }], ['Five frame', { m: 'five', c: [] }]]);
      api.button('Clear', function () { S.c = []; S.A = []; S.B = []; api.redraw(); });
      function nCells() { return S.m === 'five' ? 5 : S.m === 'one' ? 10 : 20; }
      function draw() {
        holder.innerHTML = ''; var nar = narrow(api);
        api.say(S.m === 'ppw' ? 'Drag counters into the parts. The whole shows them all.' : 'Drag counters into the frame. Tap a counter to flip it.');
        if (S.m === 'ppw') return drawPPW(nar);
        var n = nCells(); while (S.c.length < n) S.c.push(0); S.c.length = n;
        var C = nar ? 66 : 72, frames = n === 20 ? 2 : 1, rowsF = n === 5 ? 1 : 2, fw = 5 * C, fh = rowsF * C, side = frames === 2 && !nar;
        var W = side ? fw * 2 + 80 : fw + 40, fy = 20, frameBottom = side || frames === 1 ? fy + fh : fy + fh * 2 + 30, ty = frameBottom + 30, H = ty + 100;
        var v = svgBox(holder, W, H, 'Ten frame');
        var cells = [];
        for (var f = 0; f < frames; f++) {
          var fx = side ? 20 + f * (fw + 40) : 20, fyy = side ? fy : fy + f * (fh + 30);
          rect(v, fx - 4, fyy - 4, fw + 8, fh + 8, { rx: 10, fill: '#fff', stroke: NAVY, 'stroke-width': 4, class: 'paper' });
          for (var j = 0; j < (n === 5 ? 5 : 10); j++) {
            var r = Math.floor(j / 5), col = j % 5, x = fx + col * C, y = fyy + r * C;
            rect(v, x, y, C, C, { fill: 'none', stroke: NAVY, 'stroke-width': 2 });
            cells.push({ x: x, y: y, w: C, h: C });
          }
        }
        function cellAt(p) { for (var i = 0; i < cells.length; i++) if (inR(p, cells[i])) return i; return -1; }
        cells.forEach(function (cl, i) {
          if (!S.c[i]) return;
          var g = counter(v, cl.x + C / 2, cl.y + C / 2, C * 0.38, S.c[i]);
          dragTap(v, g, function () { S.c[i] = 3 - S.c[i]; api.redraw(); }, function (p) {
            var k = cellAt(p);
            if (k === i) return false;
            if (k >= 0) { if (S.c[k]) return false; S.c[k] = S.c[i]; S.c[i] = 0; api.redraw(); return true; }
            S.c[i] = 0; api.redraw(); return true;
          }, 'Counter. Tap to flip. Drag away to take it off.');
        });
        /* tray */
        rect(v, W / 2 - 130, ty, 260, 80, { rx: 16, fill: '#F6F7FB', stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
        [1, 2].forEach(function (k, idx) {
          var g = counter(v, W / 2 - 50 + idx * 100, ty + 40, 28, k);
          dragTap(v, g, function () { var e = S.c.indexOf(0); if (e < 0) { O.toast('The frame is full.'); return; } S.c[e] = k; api.redraw(); }, function (p) {
            var c = cellAt(p); if (c < 0) return false; if (S.c[c]) { O.toast('That box has a counter. Pick an empty box.'); return false; }
            S.c[c] = k; api.redraw(); return true;
          }, 'Add a ' + (k === 1 ? 'red' : 'yellow') + ' counter');
        });
        /* readout */
        var red = S.c.filter(function (x) { return x === 1; }).length, yel = S.c.filter(function (x) { return x === 2; }).length, tot = red + yel;
        var parts = [];
        if (red && yel) parts.push('<span><b>' + red + '</b> red and <b>' + yel + '</b> yellow make <b>' + tot + '</b></span>');
        else parts.push('<span><b>' + tot + '</b> counter' + (tot === 1 ? '' : 's') + '</span>');
        if (n === 20) { var f1 = S.c.slice(0, 10).filter(Boolean).length, f2 = S.c.slice(10).filter(Boolean).length; if (f2) parts.push('<span>' + f1 + ' and ' + f2 + ' is ' + tot + '</span>'); }
        if (n === 10 && tot < 10 && tot > 0) parts.push('<span>' + tot + ' and ' + (10 - tot) + ' more make 10</span>');
        if (n === 5 && tot < 5 && tot > 0) parts.push('<span>' + tot + ' and ' + (5 - tot) + ' more make 5</span>');
        api.readout(parts.join(''));
        api.report({ v: String(tot), r: String(red), y: String(yel) });
      }
      function drawPPW(nar) {
        var W = nar ? 400 : 760, Rw = nar ? 82 : 100, Rp = nar ? 88 : 110, cxw = W / 2, cyw = 20 + Rw + 14, cyp = cyw + Rw + Rp + 40;
        var pa = { x: W / 2 - (nar ? 102 : 165), y: cyp }, pb = { x: W / 2 + (nar ? 102 : 165), y: cyp }, ty = cyp + Rp + 30, H = ty + 100;
        var v = svgBox(holder, W, H, 'Part-part-whole mat');
        O.s('line', { x1: cxw, y1: cyw + Rw, x2: pa.x, y2: pa.y - Rp, stroke: NAVY, 'stroke-width': 4 }, v);
        O.s('line', { x1: cxw, y1: cyw + Rw, x2: pb.x, y2: pb.y - Rp, stroke: NAVY, 'stroke-width': 4 }, v);
        O.s('circle', { cx: cxw, cy: cyw, r: Rw, fill: '#EFE9FB', stroke: VIO, 'stroke-width': 4 }, v);
        txt(v, cxw, cyw - Rw - 4, 'Whole', { 'font-size': 15, fill: VIO });
        [[pa, S.A, 'Part'], [pb, S.B, 'Part']].forEach(function (q) { O.s('circle', { cx: q[0].x, cy: q[0].y, r: Rp, fill: '#E5F5EC', stroke: GRN, 'stroke-width': 4 }, v); txt(v, q[0].x, q[0].y + Rp + 22, q[2], { 'font-size': 15, fill: GRN }); });
        function slots(c, r, cnt, cell, cols) { var rows = Math.ceil(Math.max(cnt, 1) / cols), out = []; for (var i = 0; i < cnt; i++) out.push({ x: c.x - (cols - 1) * cell / 2 + (i % cols) * cell, y: c.y - (rows - 1) * cell / 2 + Math.floor(i / cols) * cell }); return out; }
        var cellP = nar ? 28 : 34;
        [[pa, 'A'], [pb, 'B']].forEach(function (q) {
          var arr = S[q[1]], pos = slots(q[0], Rp, arr.length, cellP, 5);
          arr.forEach(function (col, i) {
            var g = counter(v, pos[i].x, pos[i].y, cellP * 0.42, col);
            dragTap(v, g, function () { arr[i] = 3 - arr[i]; api.redraw(); }, function (p) {
              var other = q[1] === 'A' ? 'B' : 'A', oc = q[1] === 'A' ? pb : pa;
              if (dist(p, oc) < Rp) { if (S[other].length >= 20) return false; S[other].push(arr[i]); arr.splice(i, 1); api.redraw(); return true; }
              if (dist(p, q[0]) < Rp) return false;
              arr.splice(i, 1); api.redraw(); return true;
            }, 'Counter. Tap to flip. Drag to the other part, or away to take it off.');
          });
        });
        var all = S.A.concat(S.B), cellW = nar ? 20 : 24, wpos = slots({ x: cxw, y: cyw }, Rw, all.length, cellW, 8);
        all.forEach(function (col, i) { counter(v, wpos[i].x, wpos[i].y, cellW * 0.42, col).style.pointerEvents = 'none'; });
        rect(v, W / 2 - 130, ty, 260, 80, { rx: 16, fill: '#F6F7FB', stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
        [1, 2].forEach(function (k, idx) {
          var g = counter(v, W / 2 - 50 + idx * 100, ty + 40, 28, k);
          dragTap(v, g, function () { var t = S.A.length <= S.B.length ? S.A : S.B; if (t.length >= 20) return; t.push(k); api.redraw(); }, function (p) {
            if (dist(p, pa) < Rp && S.A.length < 20) { S.A.push(k); api.redraw(); return true; }
            if (dist(p, pb) < Rp && S.B.length < 20) { S.B.push(k); api.redraw(); return true; }
            if (dist(p, { x: cxw, y: cyw }) < Rw) O.toast('Put counters in the parts. The whole fills up by itself.');
            return false;
          }, 'Add a ' + (k === 1 ? 'red' : 'yellow') + ' counter');
        });
        var a = S.A.length, b = S.B.length;
        api.readout('<span><b>' + a + '</b> and <b>' + b + '</b> make <b>' + (a + b) + '</b></span>');
        api.report({ v: String(a + b), a: String(a), b: String(b) });
      }
      api.onRedraw(draw); watchSize(api, holder, draw);
    }
  });

  /* ═════════════ COUNTING BEARS ═════════════ */
  var BEAR_COL = [['red', '#E0483E'], ['yellow', '#F2B705'], ['blue', '#2F6FDE'], ['green', '#23915A']], BEAR_SZ = ['small', 'middle', 'big'];
  function bear(v, x, y, sz, col) {
    var s = [0.62, 0.82, 1.05][sz], c = BEAR_COL[col][1], g = O.s('g', {}, v);
    var dk = 'rgba(0,0,0,.18)';
    O.s('circle', { cx: x - 11 * s, cy: y - 30 * s, r: 6.5 * s, fill: c }, g);
    O.s('circle', { cx: x + 11 * s, cy: y - 30 * s, r: 6.5 * s, fill: c }, g);
    O.s('ellipse', { cx: x, cy: y + 4 * s, rx: 17 * s, ry: 20 * s, fill: c }, g);
    O.s('circle', { cx: x, cy: y - 22 * s, r: 13 * s, fill: c }, g);
    O.s('ellipse', { cx: x - 15 * s, cy: y - 2 * s, rx: 5 * s, ry: 9 * s, fill: c, stroke: dk, 'stroke-width': 1 }, g);
    O.s('ellipse', { cx: x + 15 * s, cy: y - 2 * s, rx: 5 * s, ry: 9 * s, fill: c, stroke: dk, 'stroke-width': 1 }, g);
    O.s('ellipse', { cx: x - 8 * s, cy: y + 22 * s, rx: 7 * s, ry: 5 * s, fill: c, stroke: dk, 'stroke-width': 1 }, g);
    O.s('ellipse', { cx: x + 8 * s, cy: y + 22 * s, rx: 7 * s, ry: 5 * s, fill: c, stroke: dk, 'stroke-width': 1 }, g);
    O.s('ellipse', { cx: x, cy: y + 6 * s, rx: 9 * s, ry: 11 * s, fill: '#fff', opacity: 0.28 }, g);
    O.s('circle', { cx: x - 4.5 * s, cy: y - 24 * s, r: 1.8 * s, fill: NAVY }, g);
    O.s('circle', { cx: x + 4.5 * s, cy: y - 24 * s, r: 1.8 * s, fill: NAVY }, g);
    O.s('ellipse', { cx: x, cy: y - 18 * s, rx: 3 * s, ry: 2.2 * s, fill: NAVY }, g);
    O.s('rect', { x: x - 22 * s, y: y - 40 * s, width: 44 * s, height: 70 * s, fill: 'transparent' }, g);
    return g;
  }
  O.register('bears', {
    defaults: { m: 'free', b: [], lab: ['', '', '', ''], p: [] },
    mount: function (api) {
      var S = api.S, holder = O.el('div'); api.stage.appendChild(holder);
      api.quick([['Free mat', { m: 'free', b: [] }], ['Sort into 2', { m: 'sort2', b: [] }], ['Sort into 3', { m: 'sort3', b: [] }], ['Pattern row', { m: 'pat', p: [] }]]);
      api.button('Clear', function () { S.b = []; S.p = []; api.redraw(); });
      function draw() {
        holder.innerHTML = ''; var nar = narrow(api), W = nar ? 420 : 760, mh = nar ? 280 : 300, mat = { x: 10, y: 10, w: W - 20, h: mh };
        var perRow = nar ? 6 : 12, cell = (W - 20) / perRow, ty = mat.y + mat.h + 20, trayH = (12 / perRow) * 74 + 10, H = ty + trayH + 10;
        var v = svgBox(holder, W, H, 'Counting bears mat');
        api.say(S.m === 'pat' ? 'Drag bears into the boxes to make a pattern.' : 'Drag bears onto the mat. Drag a bear off to put it away.');
        rect(v, mat.x, mat.y, mat.w, mat.h, { rx: 18, fill: '#FFF8E6', stroke: '#E8D9A8', 'stroke-width': 3, class: 'paper' });
        var nb = S.m === 'sort2' ? 2 : S.m === 'sort3' ? 3 : 0, boxes = [];
        for (var i = 0; i < nb; i++) {
          var bw = (mat.w - 20 - (nb - 1) * 12) / nb, bx = mat.x + 10 + i * (bw + 12), b = { x: bx, y: mat.y + 44, w: bw, h: mat.h - 54 };
          boxes.push(b); rect(v, b.x, b.y, b.w, b.h, { rx: 16, fill: '#fff', stroke: [VIO, GRN, ORG][i], 'stroke-width': 3, 'stroke-dasharray': '8 6' });
          (function (i, b) {
            var lab = S.lab[i] || 'Box ' + (i + 1), t = txt(v, b.x + b.w / 2, mat.y + 30, lab + ' ✎', { 'font-size': 17, fill: [VIO, GRN, ORG][i], style: 'cursor:pointer' });
            var hit = rect(v, b.x + b.w / 2 - 70, mat.y + 8, 140, 32, { fill: 'transparent', style: 'cursor:pointer' });
            O.tap(hit, function () { editText(api, t, S.lab[i] || '', function (val) { S.lab[i] = val; api.redraw(); }); }, 'Name this box');
          })(i, b);
        }
        var slots = [];
        if (S.m === 'pat') {
          var n = nar ? 6 : 10, sw = Math.min(66, (mat.w - 20) / n);
          for (var k = 0; k < n * (nar ? 2 : 1); k++) {
            var row = nar ? Math.floor(k / n) : 0, col = k % n, s = { x: mat.x + (mat.w - n * sw) / 2 + col * sw, y: mat.y + (nar ? 40 + row * 110 : 100), w: sw - 6, h: 96 };
            slots.push(s); rect(v, s.x, s.y, s.w, s.h, { rx: 10, fill: '#fff', stroke: LINE, 'stroke-width': 2 });
          }
          while (S.p.length < slots.length) S.p.push(null);
        }
        function slotAt(p) { for (var i = 0; i < slots.length; i++) if (inR(p, slots[i])) return i; return -1; }
        if (S.m === 'pat') {
          slots.forEach(function (s, i) {
            var q = S.p[i]; if (!q) return;
            var g = bear(v, s.x + s.w / 2, s.y + s.h / 2 + 4, q[1], q[0]);
            dragTap(v, g, function () { hop(g); }, function (p) {
              var j = slotAt(p); if (j === i) return false;
              if (j >= 0) { var t = S.p[j]; S.p[j] = S.p[i]; S.p[i] = t; api.redraw(); return true; }
              S.p[i] = null; api.redraw(); return true;
            }, BEAR_SZ[q[1]] + ' ' + BEAR_COL[q[0]][0] + ' bear');
          });
        } else {
          S.b.forEach(function (q, i) {
            q[0] = O.clamp(q[0], mat.x + 24, mat.x + mat.w - 24); q[1] = O.clamp(q[1], mat.y + 40, mat.y + mat.h - 30);
            var g = bear(v, q[0], q[1], q[3], q[2]);
            dragTap(v, g, function () { hop(g); }, function (p, p0) {
              var nx = q[0] + p.x - p0.x, ny = q[1] + p.y - p0.y;
              if (!inR({ x: nx, y: ny }, mat)) { S.b.splice(i, 1); api.redraw(); return true; }
              q[0] = O.clamp(nx, mat.x + 24, mat.x + mat.w - 24); q[1] = O.clamp(ny, mat.y + 40, mat.y + mat.h - 30); api.redraw(); return true;
            }, BEAR_SZ[q[3]] + ' ' + BEAR_COL[q[2]][0] + ' bear');
          });
        }
        /* tray */
        rect(v, 10, ty - 6, W - 20, trayH, { rx: 14, fill: '#F6F7FB', stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
        var t = 0;
        for (var c = 0; c < 4; c++) for (var z = 0; z < 3; z++) {
          (function (c, z, t) {
            var x = 10 + cell * (t % perRow) + cell / 2, y = ty + 44 + Math.floor(t / perRow) * 74, g = bear(v, x, y, z, c);
            dragTap(v, g, function () {
              if (S.m === 'pat') { var e = S.p.indexOf(null); if (e < 0) { O.toast('The pattern row is full.'); return; } S.p[e] = [c, z]; }
              else { if (S.b.length >= 60) { O.toast('The mat is full.'); return; } S.b.push([rnd(mat.x + 40, mat.x + mat.w - 40), rnd(mat.y + (nb ? 100 : 50), mat.y + mat.h - 40), c, z]); }
              api.redraw();
            }, function (p) {
              if (S.m === 'pat') { var j = slotAt(p); if (j < 0) return false; S.p[j] = [c, z]; api.redraw(); return true; }
              if (!inR(p, mat) || S.b.length >= 60) return false;
              S.b.push([O.clamp(p.x, mat.x + 24, mat.x + mat.w - 24), O.clamp(p.y, mat.y + 40, mat.y + mat.h - 30), c, z]); api.redraw(); return true;
            }, 'Add a ' + BEAR_SZ[z] + ' ' + BEAR_COL[c][0] + ' bear');
          })(c, z, t++);
        }
        /* readout */
        var out = [], tot;
        if (S.m === 'pat') {
          var seq = S.p.filter(Boolean); tot = seq.length;
          var sizes = {}; seq.forEach(function (q) { sizes[q[1]] = 1; });
          var mix = Object.keys(sizes).length > 1;
          out.push('<span><b>' + tot + '</b> bear' + (tot === 1 ? '' : 's') + '</span>');
          if (tot) out.push('<span>' + seq.map(function (q) { return (mix ? BEAR_SZ[q[1]] + ' ' : '') + BEAR_COL[q[0]][0]; }).join(', ') + '</span>');
        } else {
          tot = S.b.length;
          if (nb) {
            boxes.forEach(function (b, i) { var n = S.b.filter(function (q) { return inR({ x: q[0], y: q[1] }, b); }).length; out.push('<span>' + O.esc(S.lab[i] || 'Box ' + (i + 1)) + ': <b>' + n + '</b></span>'); });
          } else {
            var bc = BEAR_COL.map(function (c, i) { return [c[0], S.b.filter(function (q) { return q[2] === i; }).length]; }).filter(function (x) { return x[1]; });
            out.push('<span><b>' + tot + '</b> bear' + (tot === 1 ? '' : 's') + '</span>');
            if (bc.length) out.push('<span>' + bc.map(function (x) { return x[1] + ' ' + x[0]; }).join(', ') + '</span>');
            var bs = BEAR_SZ.map(function (s, i) { return [s, S.b.filter(function (q) { return q[3] === i; }).length]; }).filter(function (x) { return x[1]; });
            if (bs.length > 1) out.push('<span>' + bs.map(function (x) { return x[1] + ' ' + x[0]; }).join(', ') + '</span>');
          }
        }
        api.readout(out.join(''));
        api.report({ v: String(tot) });
      }
      function hop(g) { tw(380, function (k) { var y = -Math.sin(k * Math.PI) * 14; g.setAttribute('transform', 'translate(0 ' + y + ')'); }, function () { g.removeAttribute('transform'); }); }
      api.onRedraw(draw); watchSize(api, holder, draw);
    }
  });

  /* ═════════════ LINKING CUBES ═════════════ */
  var CUBE = ['#E0483E', '#F08A24', '#F2B705', '#7BC043', '#23915A', '#2FB5C9', '#2F6FDE', '#6B46C1', '#D6457A', '#8B5A2B'];
  function cubeShape(v, x, y, U, col, vert) {
    var g = O.s('g', {}, v), c = CUBE[col];
    O.s('rect', { x: x + 2, y: y + 2, width: U - 4, height: U - 4, rx: 5, fill: c, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 2 }, g);
    O.s('rect', { x: x + U * 0.3, y: y + U * 0.3, width: U * 0.4, height: U * 0.4, rx: 3, fill: '#fff', opacity: 0.25 }, g);
    if (vert) O.s('rect', { x: x + U * 0.32, y: y - 3, width: U * 0.36, height: 6, rx: 2, fill: c, stroke: 'rgba(0,0,0,.3)' }, g);
    else O.s('rect', { x: x + U - 4, y: y + U * 0.32, width: 6, height: U * 0.36, rx: 2, fill: c, stroke: 'rgba(0,0,0,.3)' }, g);
    return g;
  }
  O.register('linkcubes', {
    defaults: { m: 'train', t: [], meas: 0, ml: 6 },
    mount: function (api) {
      var S = api.S, holder = O.el('div'); api.stage.appendChild(holder);
      api.quick([['Trains', { m: 'train', t: [], meas: 0 }], ['Towers', { m: 'tower', t: [], meas: 0 }], ['Measure', { m: 'train', t: [], meas: 1, ml: rnd(3, 9) }]]);
      api.button('Clear', function () { S.t = []; api.redraw(); });
      api.more();
      api.check('Show numbers on the cubes', 'meas');
      api.num('Pencil length (cubes, measure)', 'ml', 2, 12, 1);
      api.endMore();
      function draw() {
        holder.innerHTML = ''; var nar = narrow(api), U = nar ? 40 : 44, W = nar ? 420 : 760, tower = S.m === 'tower';
        var top = S.meas && !tower ? 70 : 10, mat = { x: 10, y: top, w: W - 20, h: tower ? 470 : 300 };
        var perRow = nar ? 5 : 10, ty = mat.y + mat.h + 18, trayH = Math.ceil(10 / perRow) * (U + 16) + 20, H = ty + trayH + 8;
        var v = svgBox(holder, W, H, 'Linking cubes');
        api.say(tower ? 'Drag cubes up onto a tower. Drag a cube off to break the tower.' : 'Drag cubes to snap them into trains. Drag a cube off to break the train.');
        rect(v, mat.x, mat.y, mat.w, mat.h, { rx: 16, fill: '#fff', stroke: LINE, 'stroke-width': 2, class: 'paper' });
        if (tower) O.s('line', { x1: mat.x + 10, y1: mat.y + mat.h - 14, x2: mat.x + mat.w - 10, y2: mat.y + mat.h - 14, stroke: '#C9B48A', 'stroke-width': 6 }, v);
        if (S.meas && !tower) {
          var px = 30, py = 22, pl = S.ml * U;
          O.s('rect', { x: px, y: py, width: pl - 26, height: 26, rx: 4, fill: '#F2B705', stroke: '#B88700', 'stroke-width': 2 }, v);
          O.s('rect', { x: px, y: py, width: 16, height: 26, rx: 4, fill: '#F4A3B5', stroke: '#C46A80', 'stroke-width': 2 }, v);
          O.s('path', { d: 'M' + (px + pl - 26) + ' ' + py + ' L' + (px + pl) + ' ' + (py + 13) + ' L' + (px + pl - 26) + ' ' + (py + 26) + 'Z', fill: '#F5D9A8', stroke: '#B88700', 'stroke-width': 2 }, v);
          O.s('path', { d: 'M' + (px + pl - 7) + ' ' + (py + 9.5) + ' L' + (px + pl) + ' ' + (py + 13) + ' L' + (px + pl - 7) + ' ' + (py + 16.5) + 'Z', fill: NAVY }, v);
          txt(v, px + pl + 60, py + 19, 'How many cubes long?', { 'font-size': 15, fill: MUTE, 'text-anchor': 'start' });
        }
        function cubePos(T, k) { return tower ? { x: T.x, y: T.y - k * U } : { x: T.x + k * U, y: T.y }; }
        function endSlot(T) { return cubePos(T, T.c.length); }
        function place(cs, p, skip) {
          var tl = { x: p.x - U / 2, y: p.y - U / 2 };
          for (var i = 0; i < S.t.length; i++) {
            if (i === skip) continue; var T = S.t[i], e = endSlot(T);
            if (Math.hypot(tl.x - e.x, tl.y - e.y) < U * 0.7) { T.c = T.c.concat(cs); return true; }
            if (!tower) { var pre = { x: T.x - cs.length * U, y: T.y }; if (Math.hypot(tl.x - pre.x, tl.y - pre.y) < U * 0.7) { T.x = pre.x; T.c = cs.concat(T.c); return true; } }
          }
          if (!inR(p, mat)) return false;
          if (tower) { tl.y = mat.y + mat.h - 14 - U; }
          tl.x = O.clamp(tl.x, mat.x + 4, mat.x + mat.w - U - 4); tl.y = O.clamp(tl.y, mat.y + 4, mat.y + mat.h - U - 4);
          S.t.push({ x: tl.x, y: tl.y, c: cs.slice() }); return true;
        }
        S.t.forEach(function (T, ti) {
          T.x = O.clamp(T.x, mat.x + 4, mat.x + mat.w - (tower ? U : Math.min(T.c.length * U, mat.w - 8)) - 4);
          if (tower) T.y = O.clamp(T.y, mat.y + 4 + (T.c.length - 1) * U, mat.y + mat.h - U - 4); else T.y = O.clamp(T.y, mat.y + 4, mat.y + mat.h - U - 4);
          var parent = v;
          T.c.forEach(function (col, k) {
            var gp = O.s('g', {}, parent), pos = cubePos(T, k), cg = cubeShape(gp, pos.x, pos.y, U, col, tower);
            if (S.meas) txt(gp, pos.x + U / 2, pos.y + U / 2 + 6, String(k + 1), { 'font-size': 17, fill: '#fff', 'font-weight': 800 });
            (function (k, gp) {
              dragTap(v, gp, function () {
                if (k === T.c.length - 1) { T.c.pop(); if (!T.c.length) S.t.splice(ti, 1); api.redraw(); }
              }, function (p, p0) {
                var piece = T.c.slice(k), rest = T.c.slice(0, k), pos0 = cubePos(T, k), drop = { x: pos0.x + U / 2 + p.x - p0.x, y: pos0.y + U / 2 + p.y - p0.y };
                T.c = rest; var skip = rest.length ? ti : -1;
                var ok = place(piece, drop, skip);
                if (!rest.length) S.t.splice(S.t.indexOf(T), 1);
                api.redraw(); return true || ok;
              }, (k === 0 ? 'Train of ' + T.c.length + '. Drag to move it.' : 'Cube ' + (k + 1) + '. Drag to break the train here.'));
            })(k, gp);
            parent = gp;
          });
        });
        /* tray */
        rect(v, 10, ty - 6, W - 20, trayH, { rx: 14, fill: '#F6F7FB', stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
        var gap = (W - 20 - perRow * U) / (perRow + 1);
        CUBE.forEach(function (c, i) {
          var x = 10 + gap + (i % perRow) * (U + gap), y = ty + 8 + Math.floor(i / perRow) * (U + 16), g = cubeShape(v, x, y, U, i, tower);
          dragTap(v, g, function () {
            var T = S.t[S.t.length - 1];
            if (T && T.c.length < 20) T.c.push(i);
            else S.t.push(tower ? { x: mat.x + 20 + S.t.length * (U + 20), y: mat.y + mat.h - 14 - U, c: [i] } : { x: mat.x + 20, y: mat.y + 20 + S.t.length * (U + 14), c: [i] });
            api.redraw();
          }, function (p) { var ok = place([i], p, -1); if (ok) api.redraw(); return ok; }, 'Add a cube');
        });
        var lens = S.t.map(function (T) { return T.c.length; }), out = [];
        lens.forEach(function (n, i) { out.push('<span>' + (tower ? 'Tower ' : 'Train ') + (i + 1) + ': <b>' + n + '</b> cube' + (n === 1 ? '' : 's') + '</span>'); });
        if (lens.length === 2) { var a = lens[0], b = lens[1]; out.push('<span>' + (a === b ? 'They are the same.' : Math.max(a, b) + ' is ' + Math.abs(a - b) + ' more than ' + Math.min(a, b) + '.') + '</span>'); }
        api.readout(out.join(''));
        api.report({ v: lens.join(',') });
      }
      api.onRedraw(draw); watchSize(api, holder, draw);
    }
  });

  /* ═════════════ DOT & NUMBER CARDS ═════════════ */
  var DICE = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] };
  function dotPos(n) {
    if (n === 0) return [];
    if (n <= 6) return DICE[n].map(function (q) { return [q[0] / 2, q[1] / 2]; });
    if (n === 7) return [[0, 0], [0, 0.5], [0, 1], [0.5, 0.5], [1, 0], [1, 0.5], [1, 1]];
    if (n === 8) { var a = []; for (var i = 0; i < 4; i++) { a.push([0.15, i / 3]); a.push([0.85, i / 3]); } return a; }
    if (n === 9) { var b = []; for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) b.push([c / 2, r / 2]); return b; }
    var d = []; for (var k = 0; k < 10; k++) d.push([(k % 5) / 4, Math.floor(k / 5) ? 0.75 : 0.25]); return d;
  }
  O.register('dotcards', {
    defaults: { k: 'd5', n: 3, a: 1, fl: 0 },
    mount: function (api) {
      var S = api.S, holder = O.el('div'), timer = null, hidden = false; api.stage.appendChild(holder);
      api.quick([['Dots to 5', { k: 'd5', n: 3 }], ['Dots to 10', { k: 'd10', n: 7 }], ['Ten-frame cards', { k: 'ten', n: 6 }], ['Numerals', { k: 'num', n: 4 }]]);
      api.check('Flash: show for 2 seconds, then hide', 'fl');
      api.more();
      api.seg('Card type', 'k', [['d5', 'Dots to 5'], ['d10', 'Dots to 10'], ['five', 'Five frame'], ['ten', 'Ten frame'], ['dom', 'Domino'], ['num', 'Numeral']]);
      api.endMore();
      function range() { return { d5: [1, 5], d10: [1, 10], five: [0, 5], ten: [0, 10], dom: [2, 12], num: [0, 10] }[S.k] || [1, 5]; }
      function next() {
        var r = range(), n = S.n, tries = 0; while (n === S.n && tries++ < 20) n = rnd(r[0], r[1]);
        S.n = n; if (S.k === 'dom') { S.a = Math.max(0, Math.min(6, rnd(Math.max(0, n - 6), Math.min(6, n)))); } hidden = false; api.redraw();
      }
      function draw() {
        clearTimeout(timer); holder.innerHTML = ''; var nar = narrow(api);
        var r = range(); if (S.n < r[0] || S.n > r[1]) S.n = r[0] + Math.floor((r[1] - r[0]) / 2);
        var wide = S.k === 'ten' || S.k === 'five' || S.k === 'dom', W = nar ? 380 : 520, cw = wide ? (nar ? 340 : 440) : (nar ? 260 : 300), ch = wide ? (S.k === 'five' ? 150 : 220) : (nar ? 260 : 300), H = ch + 40;
        var v = svgBox(holder, W, H, 'Number card'), cx = (W - cw) / 2, cy = 20;
        api.say('What number do you see? Drag the card away, or tap Next card.');
        var g = O.s('g', {}, v);
        rect(g, cx, cy, cw, ch, { rx: 22, fill: '#fff', stroke: NAVY, 'stroke-width': 4 });
        if (hidden) {
          rect(g, cx + 10, cy + 10, cw - 20, ch - 20, { rx: 14, fill: VIO, opacity: 0.9 });
          for (var i = 0; i < 6; i++) O.s('circle', { cx: cx + cw / 2 + (i - 2.5) * 22, cy: cy + ch / 2, r: 6, fill: '#fff', opacity: 0.6 }, g);
          txt(g, cx + cw / 2, cy + ch / 2 + 40, 'Tap to see it again', { fill: '#fff', 'font-size': 18 });
        } else if (S.k === 'num') {
          txt(g, cx + cw / 2, cy + ch / 2 + 62, String(S.n), { 'font-size': 180, fill: NAVY, 'font-weight': 800 });
        } else if (S.k === 'ten' || S.k === 'five') {
          var cells = S.k === 'ten' ? 10 : 5, C = Math.min((cw - 60) / 5, (ch - 50) / (cells / 5)), fx = cx + (cw - 5 * C) / 2, fy = cy + (ch - C * cells / 5) / 2;
          for (var j = 0; j < cells; j++) {
            var x = fx + (j % 5) * C, y = fy + Math.floor(j / 5) * C;
            rect(g, x, y, C, C, { fill: 'none', stroke: NAVY, 'stroke-width': 3 });
            if (j < S.n) O.s('circle', { cx: x + C / 2, cy: y + C / 2, r: C * 0.36, fill: RED }, g);
          }
        } else if (S.k === 'dom') {
          var a = Math.min(S.a, S.n), b = S.n - a; if (b > 6) { b = 6; a = S.n - 6; }
          O.s('line', { x1: cx + cw / 2, y1: cy + 20, x2: cx + cw / 2, y2: cy + ch - 20, stroke: NAVY, 'stroke-width': 3 }, g);
          [a, b].forEach(function (m, h) { var bx = cx + (h ? cw / 2 : 0) + 40, by = cy + 40, bw = cw / 2 - 80, bh = ch - 80; dotPos(m).forEach(function (q) { O.s('circle', { cx: bx + q[0] * bw, cy: by + q[1] * bh, r: 13, fill: NAVY }, g); }); });
        } else {
          var pad = 60, s = cw - pad * 2;
          dotPos(S.n).forEach(function (q) { O.s('circle', { cx: cx + pad + q[0] * s, cy: cy + (ch - s) / 2 + q[1] * s, r: S.n > 6 ? 18 : 22, fill: BLU }, g); });
        }
        dragTap(v, g, function () { if (hidden) { hidden = false; draw(); } }, function (p, p0) {
          if (Math.hypot(p.x - p0.x, p.y - p0.y) < 60) return false;
          var dx = p.x - p0.x; tw(260, function (k) { g.setAttribute('transform', 'translate(' + (dx + Math.sign(dx || 1) * 600 * k) + ' ' + (p.y - p0.y) + ')'); }, next); return true;
        }, 'Number card. Drag it away for the next card.');
        var bar = O.el('div', { class: 'om-row', style: 'justify-content:center' }); holder.appendChild(bar);
        sbtn(bar, 'Next card ▶', next, 'primary');
        if (S.fl) sbtn(bar, 'Show again', function () { hidden = false; draw(); });
        if (S.fl && !hidden) timer = setTimeout(function () { if (holder.isConnected) { hidden = true; draw(); } }, 2000);
        api.readout(S.k === 'dom' ? '<span>' + Math.min(S.a, S.n) + ' and ' + (S.n - Math.min(S.a, S.n)) + ' make <b>' + S.n + '</b></span>' : '<span>The number is <b>' + S.n + '</b></span>');
        api.report({ v: String(S.n) });
      }
      api.onRedraw(draw); watchSize(api, holder, draw);
    }
  });

  /* ═════════════ DOMINOES ═════════════ */
  var PIP = { 0: [], 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]],
    7: [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [2, 2]], 8: [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]], 9: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]] };
  function domino(v, x, y, a, b, rot) {
    var g = O.s('g', rot ? { transform: 'rotate(180 ' + (x + 70) + ' ' + (y + 35) + ')' } : {}, v);
    rect(g, x, y, 140, 70, { rx: 12, fill: '#FFFDF7', stroke: NAVY, 'stroke-width': 3 });
    O.s('line', { x1: x + 70, y1: y + 8, x2: x + 70, y2: y + 62, stroke: NAVY, 'stroke-width': 2.5 }, g);
    [a, b].forEach(function (m, h) { PIP[m].forEach(function (q) { O.s('circle', { cx: x + h * 70 + 16 + q[0] * 19, cy: y + 16 + q[1] * 19, r: 6, fill: NAVY }, g); }); });
    return g;
  }
  O.register('dominoes', {
    defaults: { set: 6, d: [] },
    mount: function (api) {
      var S = api.S, holder = O.el('div'); api.stage.appendChild(holder);
      api.quick([['Double-six', { set: 6, d: [] }], ['Double-nine', { set: 9, d: [] }]]);
      api.button('Clear', function () { S.d = []; api.redraw(); });
      function pick() {
        var used = {}, all = []; S.d.forEach(function (q) { used[Math.min(q[0], q[1]) + '_' + Math.max(q[0], q[1])] = 1; });
        for (var a = 0; a <= S.set; a++) for (var b = a; b <= S.set; b++) if (!used[a + '_' + b]) all.push([a, b]);
        if (!all.length) return null; var q = all[rnd(0, all.length - 1)]; return Math.random() < 0.5 ? q : [q[1], q[0]];
      }
      function draw() {
        holder.innerHTML = ''; var nar = narrow(api), W = nar ? 420 : 760, mat = { x: 10, y: 10, w: W - 20, h: nar ? 360 : 320 }, pile = { x: W / 2 - 90, y: mat.y + mat.h + 16, w: 180, h: 96 }, H = pile.y + pile.h + 12;
        var v = svgBox(holder, W, H, 'Dominoes');
        api.say('Drag a domino from the pile onto the mat. Tap a domino to turn it.');
        rect(v, mat.x, mat.y, mat.w, mat.h, { rx: 16, fill: '#E5F5EC', stroke: '#B5DCC4', 'stroke-width': 3, class: 'paper' });
        function freeSpot() { var cols = Math.floor((mat.w - 20) / 160), i = S.d.length; return [mat.x + 20 + (i % cols) * 160, mat.y + 20 + Math.floor(i / cols) * 90 % (mat.h - 80)]; }
        S.d.forEach(function (q, i) {
          q[2] = O.clamp(q[2], mat.x + 4, mat.x + mat.w - 144); q[3] = O.clamp(q[3], mat.y + 4, mat.y + mat.h - 74);
          var g = domino(v, q[2], q[3], q[0], q[1], 0);
          dragTap(v, g, function () {
            var cx = q[2] + 70, cy = q[3] + 35;
            tw(350, function (k) { g.setAttribute('transform', 'rotate(' + (180 * k) + ' ' + cx + ' ' + cy + ')'); }, function () { var t = q[0]; q[0] = q[1]; q[1] = t; api.redraw(); });
          }, function (p, p0) {
            var nx = q[2] + p.x - p0.x, ny = q[3] + p.y - p0.y;
            if (!inR({ x: nx + 70, y: ny + 35 }, mat)) { S.d.splice(i, 1); api.redraw(); return true; }
            q[2] = O.clamp(nx, mat.x + 4, mat.x + mat.w - 144); q[3] = O.clamp(ny, mat.y + 4, mat.y + mat.h - 74); api.redraw(); return true;
          }, q[0] + ' and ' + q[1] + '. Tap to turn it.');
        });
        /* face-down pile */
        var pg = O.s('g', {}, v);
        for (var k = 2; k >= 0; k--) rect(pg, pile.x + 20 + k * 6, pile.y + 10 + k * 5, 140, 70, { rx: 12, fill: VIO, stroke: '#4B2E91', 'stroke-width': 3 });
        txt(pg, pile.x + 90, pile.y + 52, 'Drag a domino', { fill: '#fff', 'font-size': 16 });
        dragTap(v, pg, function () { var q = pick(); if (!q) { O.toast('All the dominoes are out.'); return; } var s = freeSpot(); S.d.push([q[0], q[1], s[0], s[1]]); api.redraw(); }, function (p) {
          if (!inR(p, mat)) return false; var q = pick(); if (!q) { O.toast('All the dominoes are out.'); return false; }
          S.d.push([q[0], q[1], O.clamp(p.x - 70, mat.x + 4, mat.x + mat.w - 144), O.clamp(p.y - 35, mat.y + 4, mat.y + mat.h - 74)]); api.redraw(); return true;
        }, 'Take a domino');
        api.readout(S.d.slice(-6).map(function (q) { return '<span>' + q[0] + ' and ' + q[1] + ' make <b>' + (q[0] + q[1]) + '</b></span>'; }).join('') || '');
        api.report({ v: S.d.map(function (q) { return q[0] + q[1]; }).join(',') });
      }
      api.onRedraw(draw); watchSize(api, holder, draw);
    }
  });

  /* ═════════════ BUNDLING STICKS ═════════════ */
  function stick(v, x, y, h) {
    var g = O.s('g', {}, v);
    O.s('rect', { x: x - 5, y: y, width: 10, height: h, rx: 5, fill: '#E9BE68', stroke: '#B07F2A', 'stroke-width': 2 }, g);
    O.s('rect', { x: x - 2, y: y + 6, width: 3, height: h - 12, rx: 1.5, fill: '#fff', opacity: 0.35 }, g);
    return g;
  }
  function bundle(v, x, y, h) {
    var g = O.s('g', {}, v);
    for (var i = 0; i < 10; i++) { O.s('rect', { x: x - 25 + i * 5, y: y, width: 9, height: h, rx: 4.5, fill: i % 2 ? '#E9BE68' : '#E2B35A', stroke: '#B07F2A', 'stroke-width': 1.5 }, g); }
    O.s('rect', { x: x - 30, y: y + h / 2 - 7, width: 62, height: 14, rx: 7, fill: RED, stroke: '#9E2A22', 'stroke-width': 2 }, g);
    return g;
  }
  O.register('sticks', {
    defaults: { t: 0, o: 0, mx: 20 },
    mount: function (api) {
      var S = api.S, holder = O.el('div'); api.stage.appendChild(holder);
      api.quick([['To 20', { mx: 20, t: 0, o: 0 }], ['To 100', { mx: 100, t: 0, o: 0 }]]);
      api.button('Clear', function () { S.t = 0; S.o = 0; api.redraw(); });
      function draw() {
        holder.innerHTML = ''; var nar = narrow(api), W = nar ? 420 : 760, colW = (W - 50) / 2, SH = nar ? 76 : 90, rowsT = S.mx > 20 ? 2 : 1;
        var top = 10, colH = 52 + Math.max(rowsT * (SH + 18), 3 * (SH * 0.62 + 12)) + 10;
        var tens = { x: 15, y: top, w: colW, h: colH }, ones = { x: 35 + colW, y: top, w: colW, h: colH }, pile = { x: W / 2 - 150, y: top + colH + 16, w: 300, h: SH + 24 }, H = pile.y + pile.h + 10;
        var v = svgBox(holder, W, H, 'Bundling sticks');
        api.say('Drag sticks to Ones. Got 10? Drag one up to Tens to make a bundle.');
        [[tens, 'Tens', BLU], [ones, 'Ones', ORG]].forEach(function (q) {
          rect(v, q[0].x, q[0].y, q[0].w, q[0].h, { rx: 16, fill: '#fff', stroke: q[2], 'stroke-width': 3, class: 'paper' });
          rect(v, q[0].x, q[0].y, q[0].w, 40, { rx: 16, fill: q[2] }); rect(v, q[0].x, q[0].y + 24, q[0].w, 16, { fill: q[2] });
          txt(v, q[0].x + q[0].w / 2, q[0].y + 27, q[1], { fill: '#fff', 'font-size': 19, 'font-weight': 800 });
        });
        /* bundles */
        var perB = Math.max(1, Math.floor((colW - 20) / 64));
        for (var b = 0; b < S.t; b++) {
          (function (b) {
            var x = tens.x + 20 + 32 + (b % perB) * 64, y = tens.y + 52 + Math.floor(b / perB) * (SH + 18), g = bundle(v, x, y, SH);
            dragTap(v, g, null, function (p) {
              if (inR(p, ones)) { if (S.o + 10 > 29) { O.toast('Too many loose sticks. Bundle some first.'); return false; } S.t--; S.o += 10; api.redraw(); return true; }
              if (inR(p, tens)) return false;
              S.t--; api.redraw(); return true;
            }, 'A bundle of ten. Drag it to Ones to unbundle.');
          })(b);
        }
        /* loose ones */
        var sh = SH * 0.62, perO = 10, sp = (colW - 30) / perO, stickNodes = [];
        for (var i = 0; i < S.o; i++) {
          (function (i) {
            var x = ones.x + 15 + sp / 2 + (i % perO) * sp, y = ones.y + 52 + Math.floor(i / perO) * (sh + 12), g = stick(v, x, y, sh);
            stickNodes.push({ g: g, x: x, y: y });
            dragTap(v, g, null, function (p) {
              if (inR(p, tens)) {
                if (S.o < 10) { O.toast('You need 10 sticks to make a bundle. You have ' + S.o + '.'); return false; }
                if (S.t >= S.mx / 10) { O.toast('That is as many tens as this mat holds.'); return false; }
                var bx = tens.x + 20 + 32 + (S.t % perB) * 64, by = tens.y + 52 + Math.floor(S.t / perB) * (SH + 18);
                stickNodes.slice(0, 10).forEach(function (s, k) { var dx = bx - 25 + k * 5 + 4 - s.x, dy = by - s.y; tw(450, function (e) { s.g.setAttribute('transform', 'translate(' + dx * e + ' ' + dy * e + ')'); }); });
                setTimeout(function () { S.o -= 10; S.t++; api.redraw(); }, O.reduce ? 0 : 480); return true;
              }
              if (inR(p, ones)) return false;
              S.o--; api.redraw(); return true;
            }, 'A stick. Drag it to Tens to bundle ten.');
          })(i);
        }
        /* pile */
        var pg = O.s('g', {}, v);
        rect(pg, pile.x, pile.y, pile.w, pile.h, { rx: 16, fill: '#F6F7FB', stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
        for (var k = 0; k < 9; k++) { var s = stick(pg, pile.x + 40 + k * 13, pile.y + 12, SH); s.setAttribute('transform', 'rotate(' + (k - 4) * 5 + ' ' + (pile.x + 40 + k * 13) + ' ' + (pile.y + 12 + SH) + ')'); }
        txt(pg, pile.x + pile.w - 70, pile.y + pile.h / 2 + 6, 'Drag a stick', { 'font-size': 15, fill: MUTE });
        dragTap(v, pg, function () { if (S.t * 10 + S.o >= S.mx) { O.toast('That is ' + S.mx + '. The mat is full.'); return; } if (S.o >= 29) { O.toast('Bundle some sticks first.'); return; } S.o++; api.redraw(); }, function (p) {
          if (inR(p, ones)) { if (S.t * 10 + S.o >= S.mx) { O.toast('That is ' + S.mx + '. The mat is full.'); return false; } if (S.o >= 29) { O.toast('Bundle some sticks first.'); return false; } S.o++; api.redraw(); return true; }
          if (inR(p, tens)) O.toast('Put sticks in Ones first. Then bundle 10 of them.');
          return false;
        }, 'Add a stick');
        var tot = S.t * 10 + S.o;
        api.readout('<span><b>' + S.t + '</b> ten' + (S.t === 1 ? '' : 's') + ' <b>' + S.o + '</b> one' + (S.o === 1 ? '' : 's') + ' = <b>' + tot + '</b></span>' + (S.o >= 10 ? '<span style="color:#B45309">10 or more ones. Can you make a bundle?</span>' : ''));
        api.report({ v: String(tot), t: String(S.t), o: String(S.o) });
      }
      api.onRedraw(draw); watchSize(api, holder, draw);
    }
  });

  /* ═════════════ CUISENAIRE RODS ═════════════ */
  var ROD = [null, ['#F7F5EE', NAVY], ['#E03C31', '#fff'], ['#7BC043', '#fff'], ['#8E44AD', '#fff'], ['#F4D03F', NAVY], ['#1E7B34', '#fff'], ['#2C2C2C', '#fff'], ['#8B5A2B', '#fff'], ['#2E86DE', '#fff'], ['#F08A24', '#fff']];
  function rod(v, x, y, n, U, vert, lab) {
    var g = O.s('g', {}, v), w = vert ? U : n * U, h = vert ? n * U : U;
    rect(g, x + 1, y + 1, w - 2, h - 2, { rx: 4, fill: ROD[n][0], stroke: 'rgba(0,0,0,.45)', 'stroke-width': 1.5 });
    if (lab) txt(g, x + w / 2, y + h / 2 + 6, String(n), { fill: ROD[n][1], 'font-size': 16, 'font-weight': 800 });
    return g;
  }
  O.register('cuisenaire', {
    defaults: { r: [], lab: 1, rows: 8 },
    mount: function (api) {
      var S = api.S, holder = O.el('div'); api.stage.appendChild(holder);
      var stair = []; for (var i = 1; i <= 10; i++) stair.push([i, 0, i - 1, 0]);
      api.quick([['Free mat', { r: [], rows: 8 }], ['Make 10', { r: [[10, 0, 0, 0]], rows: 8 }], ['Staircase', { r: stair, rows: 10 }]]);
      api.check('Show numbers on the rods', 'lab');
      api.button('Clear', function () { S.r = []; api.redraw(); });
      function draw() {
        holder.innerHTML = ''; var nar = narrow(api), cols = nar ? 10 : 20, U = nar ? 38 : 34, W = cols * U + 40;
        var mat = { x: 20, y: 14, w: cols * U, h: S.rows * U };
        S.r.forEach(function (q) { q[1] = Math.min(q[1], cols - (q[3] ? 1 : q[0])); });
        var rowsT = [], cur = [], used = 0; [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].forEach(function (n) { if (used + n > cols) { rowsT.push(cur); cur = []; used = 0; } cur.push(n); used += n + 0.4; }); rowsT.push(cur);
        var ty = mat.y + mat.h + 22, H = ty + rowsT.length * (U + 12) + 16;
        var v = svgBox(holder, W, H, 'Cuisenaire rods');
        api.say('Drag rods onto the mat. Tap a rod to turn it.');
        rect(v, mat.x, mat.y, mat.w, mat.h, { fill: '#fff', stroke: LINE, 'stroke-width': 2, class: 'paper' });
        for (var x = 1; x < cols; x++) O.s('line', { x1: mat.x + x * U, y1: mat.y, x2: mat.x + x * U, y2: mat.y + mat.h, stroke: '#EEF1F7' }, v);
        for (var y = 1; y < S.rows; y++) O.s('line', { x1: mat.x, y1: mat.y + y * U, x2: mat.x + mat.w, y2: mat.y + y * U, stroke: '#EEF1F7' }, v);
        function snap(n, vert, tlx, tly) {
          var gx = Math.round((tlx - mat.x) / U), gy = Math.round((tly - mat.y) / U);
          gx = O.clamp(gx, 0, cols - (vert ? 1 : n)); gy = O.clamp(gy, 0, S.rows - (vert ? n : 1)); return [gx, gy];
        }
        S.r.forEach(function (q, i) {
          var n = q[0], vert = q[3], X = mat.x + q[1] * U, Y = mat.y + q[2] * U, g = rod(v, X, Y, n, U, vert, S.lab);
          dragTap(v, g, function () {
            var nv = vert ? 0 : 1, s = snap(n, nv, X, Y); if (nv && n > S.rows) { O.toast('Too long to stand up here.'); return; } q[3] = nv; q[1] = s[0]; q[2] = s[1]; api.redraw();
          }, function (p, p0) {
            var c = { x: X + (vert ? U : n * U) / 2 + p.x - p0.x, y: Y + (vert ? n * U : U) / 2 + p.y - p0.y };
            if (!inR(c, { x: mat.x - U / 2, y: mat.y - U / 2, w: mat.w + U, h: mat.h + U })) { S.r.splice(i, 1); api.redraw(); return true; }
            var s = snap(n, vert, X + p.x - p0.x, Y + p.y - p0.y); q[1] = s[0]; q[2] = s[1]; api.redraw(); return true;
          }, 'Rod ' + n + '. Tap to turn it. Drag it off to put it away.');
        });
        rowsT.forEach(function (row, ri) {
          var x = mat.x;
          row.forEach(function (n) {
            (function (n, x) {
              var y = ty + ri * (U + 12), g = rod(v, x, y, n, U, 0, true);
              dragTap(v, g, function () {
                for (var gy = 0; gy < S.rows; gy++) { var end = 0; S.r.forEach(function (q) { if (!q[3] && q[2] === gy) end = Math.max(end, q[1] + q[0]); }); if (end + n <= cols) { S.r.push([n, end, gy, 0]); api.redraw(); return; } }
                O.toast('The mat is full.');
              }, function (p, p0) {
                var tl = { x: x + p.x - p0.x, y: y + p.y - p0.y }, c = { x: tl.x + n * U / 2, y: tl.y + U / 2 };
                if (!inR(c, mat)) return false; var s = snap(n, 0, tl.x, tl.y); S.r.push([n, s[0], s[1], 0]); api.redraw(); return true;
              }, 'Rod ' + n);
            })(n, x);
            x += (n + 0.4) * U;
          });
        });
        /* readout: rows of rods side by side, and rods that match the rod above */
        var lines = [];
        for (var gy = 0; gy < S.rows; gy++) {
          var row = S.r.filter(function (q) { return !q[3] && q[2] === gy; }).sort(function (a, b) { return a[1] - b[1]; });
          var trains = [], t = null;
          row.forEach(function (q) { if (t && t.end === q[1]) { t.ns.push(q[0]); t.end += q[0]; } else { t = { start: q[1], end: q[1] + q[0], ns: [q[0]] }; trains.push(t); } });
          trains.forEach(function (tr) {
            var sum = tr.end - tr.start, above = S.r.filter(function (q) { return !q[3] && q[2] === gy - 1 && q[1] === tr.start && q[0] === sum; }).length;
            if (tr.ns.length > 1) lines.push('<span>' + tr.ns.join(' + ') + ' = <b>' + sum + '</b>' + (above ? ' ✓' : '') + '</span>');
          });
        }
        api.readout(lines.slice(0, 6).join('') || (S.r.length ? '<span>' + S.r.length + ' rod' + (S.r.length === 1 ? '' : 's') + '</span>' : ''));
        api.report({ v: lines.length ? lines.map(function (l) { return l.replace(/<[^>]+>/g, '').replace(/ ✓/, ''); }).join('; ') : String(S.r.length) });
      }
      api.onRedraw(draw); watchSize(api, holder, draw);
    }
  });

  /* ═════════════ BEADS & PATTERNS ═════════════ */
  var BEAD = [['red', '#E0483E'], ['blue', '#2F6FDE'], ['yellow', '#F2B705'], ['green', '#23915A']], SHAPE = ['round', 'cube'];
  function bead(v, x, y, q, r) {
    var g = O.s('g', {}, v), c = BEAD[q[0]][1];
    if (q[1]) O.s('rect', { x: x - r, y: y - r, width: 2 * r, height: 2 * r, rx: r * 0.25, fill: c, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 2 }, g);
    else O.s('circle', { cx: x, cy: y, r: r, fill: c, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 2 }, g);
    O.s('circle', { cx: x - r * 0.35, cy: y - r * 0.35, r: r * 0.28, fill: '#fff', opacity: 0.4 }, g);
    O.s('circle', { cx: x, cy: y, r: r * 0.16, fill: '#fff', opacity: 0.7 }, g);
    return g;
  }
  function beadName(q) { return BEAD[q[0]][0] + (q[1] ? ' cube' : ''); }
  function randCard() {
    var types = ['AB', 'AAB', 'ABB', 'ABC'], tp = types[rnd(0, 3)], cs = [0, 1, 2, 3].sort(function () { return Math.random() - 0.5; }), sh = Math.random() < 0.3;
    var map = { A: [cs[0], 0], B: [cs[1], sh ? 1 : 0], C: [cs[2], 0] };
    return tp.split('').map(function (L) { return map[L]; });
  }
  O.register('beads', {
    defaults: { m: 'free', b: [], card: [] },
    mount: function (api) {
      var S = api.S, holder = O.el('div'), lastAdd = null; api.stage.appendChild(holder);
      api.quick([['Free', { m: 'free', b: [] }], ['Copy a pattern', { m: 'copy', b: [], card: randCard() }], ['Make your own pattern', { m: 'own', b: [] }]]);
      api.button('Clear the string', function () { S.b = []; api.redraw(); });
      if (S.m === 'copy') api.button('New pattern card', function () { S.card = randCard(); S.b = []; api.redraw(); });
      function draw() {
        holder.innerHTML = ''; var nar = narrow(api), W = nar ? 420 : 760, per = nar ? 10 : 20, sp = nar ? 38 : 35, R = nar ? 16 : 15;
        var cardH = S.m === 'copy' && S.card.length ? 84 : 0, sy0 = 20 + cardH + 40, rows = nar ? 2 : 1, ty = sy0 + (rows - 1) * 90 + 60, trayPer = nar ? 4 : 8, trayH = (8 / trayPer) * 70 + 10, H = ty + trayH + 10;
        var v = svgBox(holder, W, H, 'Beads on a string');
        api.say(S.m === 'copy' ? 'Copy the pattern. Drag beads onto the string.' : 'Drag beads onto the string. Drag a bead off to take it away.');
        if (cardH) {
          rect(v, W / 2 - (nar ? 190 : 260), 14, nar ? 380 : 520, cardH - 6, { rx: 14, fill: '#FFF6D6', stroke: '#E8D18A', 'stroke-width': 2 });
          txt(v, W / 2, 34, 'Copy this pattern', { 'font-size': 14, fill: '#8a6400' });
          var show = S.card.length === 2 ? 8 : 9, cw = (nar ? 330 : 470) / show;
          for (var c = 0; c < show; c++) bead(v, W / 2 - (show - 1) * cw / 2 + c * cw, 60, S.card[c % S.card.length], 13).style.pointerEvents = 'none';
          txt(v, W / 2 + (show / 2) * cw + 4, 66, '…', { 'font-size': 20, fill: MUTE });
        }
        function slot(i) { var row = Math.floor(i / per); return { x: (W - (per - 1) * sp) / 2 + (i % per) * sp, y: sy0 + row * 90 }; }
        for (var r = 0; r < rows; r++) { var a = slot(r * per), b = slot(r * per + per - 1); O.s('line', { x1: a.x - 30, y1: a.y, x2: b.x + 30, y2: b.y, stroke: '#8B5A2B', 'stroke-width': 3, 'stroke-linecap': 'round' }, v); O.s('circle', { cx: b.x + 32, cy: b.y, r: 6, fill: '#8B5A2B' }, v); }
        var band = { x: 10, y: sy0 - 40, w: W - 20, h: (rows - 1) * 90 + 80 };
        function idxAt(p) { var best = 0, bd = 1e9; for (var i = 0; i <= Math.min(S.b.length, per * rows - 1); i++) { var s = slot(i), d = Math.hypot(p.x - s.x, p.y - s.y); if (d < bd) { bd = d; best = i; } } return Math.min(best, S.b.length); }
        S.b.forEach(function (q, i) {
          var s = slot(i), g = bead(v, s.x, s.y, q, R);
          if (lastAdd && lastAdd.i === i && !O.reduce) { var dx = lastAdd.x - s.x, dy = lastAdd.y - s.y; tw(320, function (k) { g.setAttribute('transform', 'translate(' + dx * (1 - k) + ' ' + dy * (1 - k) + ')'); }); }
          dragTap(v, g, function () { S.b.splice(i, 1); api.redraw(); }, function (p) {
            if (!inR(p, band)) { S.b.splice(i, 1); api.redraw(); return true; }
            var j = idxAt(p); S.b.splice(i, 1); if (j > i) j--; S.b.splice(Math.min(j, S.b.length), 0, q); api.redraw(); return true;
          }, beadName(q) + ' bead. Drag it off to take it away.');
        });
        lastAdd = null;
        rect(v, 10, ty - 6, W - 20, trayH, { rx: 14, fill: '#F6F7FB', stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
        var tc = (W - 20) / trayPer, t = 0;
        for (var sh = 0; sh < 2; sh++) for (var col = 0; col < 4; col++) {
          (function (q, t) {
            var x = 10 + tc * (t % trayPer) + tc / 2, y = ty + 32 + Math.floor(t / trayPer) * 70, g = bead(v, x, y, q, 22);
            dragTap(v, g, function () { if (S.b.length >= per * rows) { O.toast('The string is full.'); return; } lastAdd = { i: S.b.length, x: x, y: y }; S.b.push(q); api.redraw(); }, function (p) {
              if (!inR(p, band)) return false; if (S.b.length >= per * rows) { O.toast('The string is full.'); return false; }
              var j = idxAt(p); lastAdd = { i: j, x: p.x, y: p.y }; S.b.splice(j, 0, q); api.redraw(); return true;
            }, 'Add a ' + beadName(q) + ' bead');
          })([col, sh], t++);
        }
        var n = S.b.length, cnt = {}; S.b.forEach(function (q) { var k = beadName(q); cnt[k] = (cnt[k] || 0) + 1; });
        var out = ['<span><b>' + n + '</b> bead' + (n === 1 ? '' : 's') + '</span>'];
        if (n) out.push('<span>' + Object.keys(cnt).map(function (k) { return cnt[k] + ' ' + k; }).join(', ') + '</span>');
        if (S.m === 'own' && n >= 4) {
          var key = S.b.map(function (q) { return q.join(); });
          for (var p = 1; p <= n / 2; p++) { var ok = true; for (var i2 = p; i2 < n; i2++) if (key[i2] !== key[i2 - p]) { ok = false; break; } if (ok) { out.push('<span>It repeats: ' + S.b.slice(0, p).map(beadName).join(', ') + '</span>'); break; } }
        }
        api.readout(out.join(''));
        api.report({ v: String(n) });
      }
      api.onRedraw(draw); watchSize(api, holder, draw);
    }
  });

  /* ═════════════ ATTRIBUTE BLOCKS ═════════════ */
  var A_SH = ['circle', 'square', 'triangle', 'rectangle', 'hexagon'], A_COL = [['red', '#E0483E', '#A52F27'], ['yellow', '#F2B705', '#B88700'], ['blue', '#2F6FDE', '#1D4FA8']];
  function ablock(i) { var th = i % 2, sz = Math.floor(i / 2) % 2, col = Math.floor(i / 4) % 3, sh = Math.floor(i / 12); return { sh: sh, col: col, sz: sz, th: th }; }
  function aName(i) { var b = ablock(i); return (b.sz ? 'small ' : 'big ') + (b.th ? 'thin ' : 'thick ') + A_COL[b.col][0] + ' ' + A_SH[b.sh]; }
  function aShape(g, sh, x, y, s, fill, stroke, sw) {
    var a = { fill: fill, stroke: stroke, 'stroke-width': sw };
    if (sh === 0) return O.s('circle', Object.assign({ cx: x, cy: y, r: s }, a), g);
    if (sh === 1) return O.s('rect', Object.assign({ x: x - s, y: y - s, width: 2 * s, height: 2 * s, rx: 2 }, a), g);
    if (sh === 2) return O.s('path', Object.assign({ d: 'M' + x + ' ' + (y - s * 1.05) + ' L' + (x + s * 1.15) + ' ' + (y + s * 0.85) + ' L' + (x - s * 1.15) + ' ' + (y + s * 0.85) + 'Z' }, a), g);
    if (sh === 3) return O.s('rect', Object.assign({ x: x - s * 1.12, y: y - s * 0.62, width: 2.24 * s, height: 1.24 * s, rx: 2 }, a), g);
    var d = ''; for (var k = 0; k < 6; k++) { var an = Math.PI / 3 * k; d += (k ? 'L' : 'M') + (x + s * Math.cos(an)) + ' ' + (y + s * Math.sin(an)); } return O.s('path', Object.assign({ d: d + 'Z' }, a), g);
  }
  function aDraw(v, i, x, y) {
    var b = ablock(i), s = b.sz ? 15 : 24, g = O.s('g', {}, v), c = A_COL[b.col];
    if (!b.th) { var sh = O.s('g', { transform: 'translate(4 4)' }, g); aShape(sh, b.sh, x, y, s, c[2], c[2], 2); }
    aShape(g, b.sh, x, y, s, c[1], c[2], b.th ? 1.5 : 2.5);
    if (b.th) O.s('circle', { cx: x, cy: y, r: 2.5, fill: '#fff', opacity: 0.0 }, g);
    O.s('rect', { x: x - 30, y: y - 30, width: 60, height: 60, fill: 'transparent' }, g);
    return g;
  }
  O.register('attrblocks', {
    defaults: { m: 'two', on: [], lab: ['red', 'not red', ''] },
    mount: function (api) {
      var S = api.S, holder = O.el('div'); api.stage.appendChild(holder);
      api.quick([['Free', { m: 'free', on: [] }], ['2 hoops', { m: 'two', on: [], lab: ['red', 'not red', ''] }], ['Venn', { m: 'venn', on: [], lab: ['red', 'triangle', ''] }]]);
      api.button('Put them all back', function () { S.on = []; api.redraw(); });
      function draw() {
        holder.innerHTML = ''; var nar = narrow(api), W = nar ? 420 : 760, mat = { x: 10, y: 10, w: W - 20, h: nar ? 300 : 340 };
        var cols = nar ? 6 : 12, cell = (W - 20) / cols, ty = mat.y + mat.h + 20, rowsT = Math.ceil(60 / cols), H = ty + rowsT * 60 + 20;
        var v = svgBox(holder, W, H, 'Attribute blocks');
        api.say('Drag blocks into the hoops to sort them. Tap a hoop name to change it.');
        rect(v, mat.x, mat.y, mat.w, mat.h, { rx: 16, fill: '#fff', stroke: LINE, 'stroke-width': 2, class: 'paper' });
        var hoops = [];
        if (S.m === 'two') { var r = nar ? 92 : 130; hoops = [{ x: mat.x + mat.w * 0.27, y: mat.y + mat.h / 2 + 14, r: r }, { x: mat.x + mat.w * 0.73, y: mat.y + mat.h / 2 + 14, r: r }]; }
        if (S.m === 'venn') { var r2 = nar ? 100 : 140; hoops = [{ x: mat.x + mat.w / 2 - r2 * 0.6, y: mat.y + mat.h / 2 + 14, r: r2 }, { x: mat.x + mat.w / 2 + r2 * 0.6, y: mat.y + mat.h / 2 + 14, r: r2 }]; }
        hoops.forEach(function (h, k) {
          O.s('circle', { cx: h.x, cy: h.y, r: h.r, fill: [VIO, GRN][k], 'fill-opacity': 0.06, stroke: [VIO, GRN][k], 'stroke-width': 5 }, v);
          var lab = S.lab[k] || ('Hoop ' + (k + 1)), lx = S.m === 'venn' ? h.x + (k ? 40 : -40) : h.x, t = txt(v, lx, h.y - h.r - 10, lab + ' ✎', { 'font-size': 17, fill: [VIO, GRN][k] });
          var hit = rect(v, lx - 70, h.y - h.r - 34, 140, 32, { fill: 'transparent', style: 'cursor:pointer' });
          O.tap(hit, function () { editText(api, t, S.lab[k], function (val) { S.lab[k] = val; api.redraw(); }); }, 'Name this hoop');
        });
        var onSet = {}; S.on.forEach(function (q) { onSet[q[0]] = 1; });
        S.on.forEach(function (q, k) {
          q[1] = O.clamp(q[1], mat.x + 28, mat.x + mat.w - 28); q[2] = O.clamp(q[2], mat.y + 28, mat.y + mat.h - 28);
          var g = aDraw(v, q[0], q[1], q[2]);
          dragTap(v, g, function () { S.on.splice(k, 1); api.redraw(); }, function (p, p0) {
            var nx = q[1] + p.x - p0.x, ny = q[2] + p.y - p0.y;
            if (!inR({ x: nx, y: ny }, mat)) { S.on.splice(k, 1); api.redraw(); return true; }
            q[1] = O.clamp(nx, mat.x + 28, mat.x + mat.w - 28); q[2] = O.clamp(ny, mat.y + 28, mat.y + mat.h - 28); api.redraw(); return true;
          }, aName(q[0]));
        });
        rect(v, 10, ty - 8, W - 20, rowsT * 60 + 14, { rx: 14, fill: '#F6F7FB', stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
        var order = []; for (var sh = 0; sh < 5; sh++) for (var col = 0; col < 3; col++) for (var sz = 0; sz < 2; sz++) for (var th = 0; th < 2; th++) order.push(((sh * 3 + col) * 2 + sz) * 2 + th);
        order.forEach(function (bi, k) {
          if (onSet[bi]) return;
          var x = 10 + (k % cols) * cell + cell / 2, y = ty + 24 + Math.floor(k / cols) * 60, g = aDraw(v, bi, x, y);
          dragTap(v, g, function () { S.on.push([bi, rnd(mat.x + 40, mat.x + mat.w - 40), rnd(mat.y + 40, mat.y + mat.h - 40)]); api.redraw(); }, function (p) {
            if (!inR(p, mat)) return false; S.on.push([bi, O.clamp(p.x, mat.x + 28, mat.x + mat.w - 28), O.clamp(p.y, mat.y + 28, mat.y + mat.h - 28)]); api.redraw(); return true;
          }, aName(bi));
        });
        var inH = function (q, h) { return Math.hypot(q[1] - h.x, q[2] - h.y) < h.r; }, out = [];
        if (hoops.length) {
          var n1 = 0, n2 = 0, both = 0, none = 0;
          S.on.forEach(function (q) { var a = inH(q, hoops[0]), b = inH(q, hoops[1]); if (a && b) both++; else if (a) n1++; else if (b) n2++; else none++; });
          out.push('<span>' + O.esc(S.lab[0] || 'Hoop 1') + ': <b>' + (n1 + (S.m === 'venn' ? 0 : both)) + '</b></span>');
          out.push('<span>' + O.esc(S.lab[1] || 'Hoop 2') + ': <b>' + (n2 + (S.m === 'venn' ? 0 : both)) + '</b></span>');
          if (S.m === 'venn') out.push('<span>Both: <b>' + both + '</b></span>');
          out.push('<span>Outside: <b>' + none + '</b></span>');
          api.report({ v: [n1, n2, both, none].join(',') });
        } else { out.push('<span><b>' + S.on.length + '</b> block' + (S.on.length === 1 ? '' : 's') + ' on the mat</span>'); api.report({ v: String(S.on.length) }); }
        api.readout(out.join(''));
      }
      api.onRedraw(draw); watchSize(api, holder, draw);
    }
  });

  /* ═════════════ GEOMETRIC SOLIDS ═════════════ */
  function polyMesh(V, F) { return { V: V, F: F.map(function (f) { return { i: f, kind: 'flat' }; }) }; }
  function circleRing(n, r, y) { var a = []; for (var k = 0; k < n; k++) { var t = 2 * Math.PI * k / n; a.push([r * Math.cos(t), y, r * Math.sin(t)]); } return a; }
  var SOLIDS = {
    cube: { name: 'Cube', info: [6, 0, 12, 8], roll: 0, stack: 1, mesh: function () { var V = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]; return polyMesh(V, [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [3, 2, 6, 7], [0, 3, 7, 4], [1, 5, 6, 2]]); } },
    rprism: { name: 'Rectangular prism', info: [6, 0, 12, 8], roll: 0, stack: 1, mesh: function () { var a = 1.4, b = 0.7, c = 0.8, V = [[-a, -b, -c], [a, -b, -c], [a, b, -c], [-a, b, -c], [-a, -b, c], [a, -b, c], [a, b, c], [-a, b, c]]; return polyMesh(V, [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [3, 2, 6, 7], [0, 3, 7, 4], [1, 5, 6, 2]]); } },
    spyr: { name: 'Square pyramid', info: [5, 0, 8, 5], roll: 0, stack: 0, mesh: function () { var V = [[-1, -0.8, -1], [1, -0.8, -1], [1, -0.8, 1], [-1, -0.8, 1], [0, 1.1, 0]]; return polyMesh(V, [[0, 1, 2, 3], [0, 4, 1], [1, 4, 2], [2, 4, 3], [3, 4, 0]]); } },
    tprism: { name: 'Triangular prism', info: [5, 0, 9, 6], roll: 0, stack: 1, mesh: function () { var V = [[-1.1, -0.8, -1], [1.1, -0.8, -1], [0, 1, -1], [-1.1, -0.8, 1], [1.1, -0.8, 1], [0, 1, 1]]; return polyMesh(V, [[0, 2, 1], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]]); } },
    tpyr: { name: 'Triangular pyramid', info: [4, 0, 6, 4], roll: 0, stack: 0, mesh: function () { var V = circleRing(3, 1.15, -0.7).concat([[0, 1.1, 0]]); return polyMesh(V, [[0, 1, 2], [0, 3, 1], [1, 3, 2], [2, 3, 0]]); } },
    cyl: { name: 'Cylinder', info: [2, 1, 2, 0], roll: 1, stack: 1, curved: 1, mesh: function () { var N = 36, top = circleRing(N, 0.95, 1), bot = circleRing(N, 0.95, -1), V = top.concat(bot), F = []; for (var k = 0; k < N; k++) { var k2 = (k + 1) % N; F.push({ i: [k, k2, N + k2, N + k], kind: 'curve' }); } var t = [], b = []; for (k = 0; k < N; k++) { t.push(k); b.push(2 * N - 1 - k); } F.push({ i: t, kind: 'flat', rim: 1 }); F.push({ i: b, kind: 'flat', rim: 1 }); return { V: V, F: F }; } },
    cone: { name: 'Cone', info: [1, 1, 1, 1], roll: 1, stack: 0, curved: 1, mesh: function () { var N = 36, V = circleRing(N, 1.05, -0.9).concat([[0, 1.2, 0]]), F = []; for (var k = 0; k < N; k++) F.push({ i: [k, (k + 1) % N, N], kind: 'curve' }); var b = []; for (k = N - 1; k >= 0; k--) b.push(k); F.push({ i: b, kind: 'flat', rim: 1 }); return { V: V, F: F, apex: N }; } },
    sphere: { name: 'Sphere', info: [0, 1, 0, 0], roll: 1, stack: 0, curved: 1, mesh: function () { var V = [], F = [], La = 12, Lo = 24; for (var a = 0; a <= La; a++) { var ph = Math.PI * a / La; for (var o = 0; o < Lo; o++) { var th = 2 * Math.PI * o / Lo; V.push([1.1 * Math.sin(ph) * Math.cos(th), 1.1 * Math.cos(ph), 1.1 * Math.sin(ph) * Math.sin(th)]); } } for (a = 0; a < La; a++) for (var o2 = 0; o2 < Lo; o2++) { var p = a * Lo + o2, q = a * Lo + (o2 + 1) % Lo; F.push({ i: [p, q, q + Lo, p + Lo], kind: 'curve' }); } return { V: V, F: F }; } }
  };
  var SOLID_IDS = ['cube', 'rprism', 'cyl', 'sphere', 'cone', 'spyr', 'tprism', 'tpyr'];
  function renderSolid(v, id, cx, cy, sc, yaw, pit, hl) {
    var def = SOLIDS[id], m = def.mesh(), cy1 = Math.cos(yaw), sy1 = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit);
    var R = m.V.map(function (p) { var x = p[0] * cy1 + p[2] * sy1, z = -p[0] * sy1 + p[2] * cy1; return [x, p[1] * cp - z * sp, p[1] * sp + z * cp]; });
    var P = R.map(function (r) { var f = 1 / (1 - r[2] * 0.08); return { x: cx + r[0] * sc * f, y: cy - r[1] * sc * f, z: r[2] }; });
    var g = O.s('g', {}, v), L = [-0.45, 0.65, 0.6], base = { cube: '#7FB3F5', rprism: '#9AD4A8', spyr: '#F7C66B', tprism: '#F49A8E', tpyr: '#C3A6F2', cyl: '#7FD3DC', cone: '#F7A85E', sphere: '#F28FAE' }[id];
    var PAL = ['#F4D35E', '#7FB3F5', '#F49A8E', '#9AD4A8', '#C3A6F2', '#F7A85E'];
    var faces = m.F.map(function (f, fi) {
      var a = R[f.i[0]], b = R[f.i[1]], c = R[f.i[f.i.length > 3 ? 2 : 2]];
      var u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      var n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
      var ctr = [0, 0, 0]; f.i.forEach(function (k) { ctr[0] += R[k][0]; ctr[1] += R[k][1]; ctr[2] += R[k][2]; }); ctr = ctr.map(function (q) { return q / f.i.length; });
      if (n[0] * ctr[0] + n[1] * ctr[1] + n[2] * ctr[2] < 0) n = n.map(function (q) { return -q; });
      var len = Math.hypot(n[0], n[1], n[2]) || 1;
      return { f: f, fi: fi, z: ctr[2], vis: n[2] / len, lit: Math.max(0.2, (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / len) };
    });
    var flatIdx = 0;
    faces.forEach(function (F) { if (F.f.kind === 'flat') F.flatN = flatIdx++; });
    faces.sort(function (a, b) { return a.z - b.z; }).forEach(function (F) {
      if (F.vis < -0.02) return;
      var col = base;
      if (hl === 'faces' && F.f.kind === 'flat') col = PAL[F.flatN % PAL.length];
      var d = F.f.i.map(function (k, j) { return (j ? 'L' : 'M') + P[k].x.toFixed(1) + ' ' + P[k].y.toFixed(1); }).join('') + 'Z';
      var shade = 0.55 + 0.45 * F.lit, fill = mix(col, shade);
      O.s('path', { d: d, fill: fill, stroke: F.f.kind === 'curve' ? fill : '#29324A', 'stroke-width': F.f.kind === 'curve' ? 0.8 : (hl === 'edges' ? 0 : 2), 'stroke-linejoin': 'round' }, g);
    });
    if (hl === 'edges') {
      var seen = {};
      m.F.forEach(function (f) {
        if (f.kind === 'curve') return;
        f.i.forEach(function (k, j) {
          var k2 = f.i[(j + 1) % f.i.length], key = Math.min(k, k2) + '_' + Math.max(k, k2); if (seen[key]) return; seen[key] = 1;
          var back = (P[k].z + P[k2].z) / 2 < -0.15 && !def.curved;
          O.s('line', { x1: P[k].x, y1: P[k].y, x2: P[k2].x, y2: P[k2].y, stroke: VIO, 'stroke-width': back ? 3 : 6, 'stroke-dasharray': back ? '7 6' : '', 'stroke-linecap': 'round', opacity: back ? 0.55 : 1 }, g);
        });
      });
    }
    if (hl === 'verts') {
      var pts = def.curved ? (m.apex != null ? [m.apex] : []) : P.map(function (p, i) { return i; });
      pts.forEach(function (i) { var p = P[i], back = p.z < -0.2; O.s('circle', { cx: p.x, cy: p.y, r: back ? 7 : 10, fill: back ? '#fff' : RED, stroke: RED, 'stroke-width': 3, opacity: back ? 0.7 : 1 }, g); });
    }
    return g;
  }
  function mix(hex, k) { var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; function c(x) { return Math.round(Math.min(255, x * k + (k > 1 ? 0 : 0))); } return 'rgb(' + c(r) + ',' + c(g) + ',' + c(b) + ')'; }
  O.register('solids', {
    defaults: { k: 'cube', yaw: 0.6, pit: 0.45, m: 'one', hl: '' },
    mount: function (api) {
      var S = api.S, holder = O.el('div'), anim = null; api.stage.appendChild(holder);
      api.quick([['Rotate one', { m: 'one' }], ['All solids (shelf)', { m: 'shelf' }]]);
      api.seg('Show', 'hl', [['', 'Just the shape'], ['faces', 'Faces'], ['edges', 'Edges'], ['verts', 'Corners']]);
      function draw() {
        holder.innerHTML = ''; var nar = narrow(api), W = nar ? 400 : 700;
        if (S.m === 'shelf') return drawShelf(nar, W);
        var H = 400 + (nar ? 90 : 100), sc = nar ? 84 : 98, cx = W / 2, cyy = 200;
        var v = svgBox(holder, W, H, SOLIDS[S.k].name);
        api.say('Drag the shape to turn it. Tap a shape below to pick another one.');
        rect(v, 0, 0, W, 380, { fill: '#fff', class: 'paper' });
        O.s('ellipse', { cx: cx, cy: 330, rx: sc * 1.2, ry: 16, fill: 'rgba(14,28,66,.10)' }, v);
        var holderG = O.s('g', {}, v), shapeG = renderSolid(holderG, S.k, cx, cyy, sc, S.yaw, S.pit, S.hl);
        var hit = rect(v, 0, 0, W, 380, { fill: 'transparent', style: 'cursor:grab' });
        var p0 = null, y0, q0;
        hit.addEventListener('pointerdown', function (e) { e.preventDefault(); p0 = O.pt(v, e); y0 = S.yaw; q0 = S.pit; try { hit.setPointerCapture(e.pointerId); } catch (x) {} });
        hit.addEventListener('pointermove', function (e) { if (!p0) return; var p = O.pt(v, e); S.yaw = y0 + (p.x - p0.x) * 0.012; S.pit = O.clamp(q0 + (p.y - p0.y) * 0.012, -1.4, 1.4); holderG.innerHTML = ''; renderSolid(holderG, S.k, cx, cyy, sc, S.yaw, S.pit, S.hl); });
        function end() { if (p0) { p0 = null; api.changed(); } }
        hit.addEventListener('pointerup', end); hit.addEventListener('pointercancel', end);
        hit.setAttribute('tabindex', '0'); hit.setAttribute('role', 'img'); hit.setAttribute('aria-label', SOLIDS[S.k].name + '. Use arrow keys to turn it.');
        hit.addEventListener('keydown', function (e) { var d = { ArrowLeft: [-0.2, 0], ArrowRight: [0.2, 0], ArrowUp: [0, -0.2], ArrowDown: [0, 0.2] }[e.key]; if (!d) return; e.preventDefault(); S.yaw += d[0]; S.pit = O.clamp(S.pit + d[1], -1.4, 1.4); holderG.innerHTML = ''; renderSolid(holderG, S.k, cx, cyy, sc, S.yaw, S.pit, S.hl); api.changed(); });
        txt(v, cx, 30, SOLIDS[S.k].name, { 'font-size': 22, 'font-weight': 800 });
        /* tray of solids */
        var per = nar ? 4 : 8, cw = W / per, rowsT = Math.ceil(8 / per), ty = 390;
        v.setAttribute('viewBox', '0 0 ' + W + ' ' + (ty + rowsT * 92 + 8)); v.setAttribute('height', ty + rowsT * 92 + 8);
        SOLID_IDS.forEach(function (id, i) {
          var x = (i % per) * cw + cw / 2, y = ty + 40 + Math.floor(i / per) * 92, g = O.s('g', {}, v);
          rect(g, x - cw / 2 + 4, y - 40, cw - 8, 86, { rx: 12, fill: id === S.k ? '#EFE9FB' : '#F6F7FB', stroke: id === S.k ? VIO : LINE, 'stroke-width': id === S.k ? 3 : 1.5 });
          renderSolid(g, id, x, y - 4, 22, 0.6, 0.45, '');
          txt(g, x, y + 38, SOLIDS[id].name.replace('Rectangular', 'Rect.').replace('Triangular', 'Tri.'), { 'font-size': 11.5, fill: MUTE });
          O.tap(g, function () { S.k = id; api.redraw(); }, SOLIDS[id].name);
        });
        /* roll / stack */
        var bar = O.el('div', { class: 'om-row', style: 'justify-content:center' }); holder.appendChild(bar);
        sbtn(bar, 'Can it roll?', function () { play('roll', holderG, cx, cyy, sc); });
        sbtn(bar, 'Can it stack?', function () { play('stack', holderG, cx, cyy, sc); });
        var note = O.el('p', { class: 'om-hint', style: 'text-align:center;font-weight:700;font-size:1rem', 'aria-live': 'polite' }); holder.appendChild(note); anim = note;
        readout();
      }
      function play(kind, gEl, cx, cyy, sc) {
        var def = SOLIDS[S.k];
        if (kind === 'roll') {
          anim.textContent = def.roll ? 'Yes! It rolls.' : 'No. It slides, but it does not roll.';
          var y0 = S.yaw;
          tw(def.roll ? 1400 : 600, function (k) {
            var dx = def.roll ? Math.sin(k * Math.PI) * 120 : Math.min(k * 2, 1) * 40 * (1 - k);
            gEl.innerHTML = ''; renderSolid(gEl, S.k, cx + dx, cyy, sc, def.roll ? y0 + k * Math.PI * 2 : y0, S.pit, S.hl);
          }, function () { gEl.innerHTML = ''; renderSolid(gEl, S.k, cx, cyy, sc, S.yaw, S.pit, S.hl); });
        } else {
          anim.textContent = def.stack ? 'Yes! It stacks. The flat faces sit on each other.' : 'No. It tips over. It does not stack well.';
          var top = O.s('g', {}, gEl.ownerSVGElement);
          tw(1100, function (k) {
            top.innerHTML = ''; var sy = cyy - sc * 2.4 + k * sc * (def.stack ? 0.6 : 0.9), sx = cx;
            if (!def.stack && k > 0.6) { var f = (k - 0.6) / 0.4; sx = cx + f * sc * 1.6; sy += f * sc * 1.4; }
            renderSolid(top, S.k, sx, sy, sc * 0.55, S.yaw, S.pit, '');
          }, function () { setTimeout(function () { top.remove(); }, 900); });
        }
      }
      function drawShelf(nar, W) {
        var per = nar ? 2 : 4, cw = W / per, rows = Math.ceil(8 / per), H = rows * 180 + 20;
        var v = svgBox(holder, W, H, 'Shelf of solids');
        api.say('Tap a shape to turn it and look closer.');
        SOLID_IDS.forEach(function (id, i) {
          var x = (i % per) * cw + cw / 2, y = 20 + Math.floor(i / per) * 180, g = O.s('g', {}, v);
          rect(g, x - cw / 2 + 6, y, cw - 12, 168, { rx: 14, fill: '#fff', stroke: LINE, 'stroke-width': 2, class: 'paper' });
          renderSolid(g, id, x, y + 74, 42, 0.6, 0.45, S.hl);
          txt(g, x, y + 154, SOLIDS[id].name, { 'font-size': 14 });
          O.tap(g, function () { S.m = 'one'; S.k = id; api.redraw(); }, SOLIDS[id].name);
        });
        readout();
      }
      function readout() {
        var d = SOLIDS[S.k], i = d.info, out = [];
        if (S.m === 'shelf') { api.readout('<span>8 solids</span>'); api.report({ v: 'shelf' }); return; }
        out.push('<span><b>' + d.name + '</b></span>');
        if (S.k === 'sphere') out.push('<span>1 curved surface · 0 flat faces · 0 edges · 0 corners</span>');
        else if (d.curved) out.push('<span>' + i[0] + ' flat face' + (i[0] === 1 ? '' : 's') + ' · ' + i[1] + ' curved surface · ' + i[2] + ' curved edge' + (i[2] === 1 ? '' : 's') + ' · ' + i[3] + ' corner' + (i[3] === 1 ? '' : 's') + (S.k === 'cone' ? ' (the point)' : '') + '</span>');
        else out.push('<span>' + i[0] + ' faces · ' + i[2] + ' edges · ' + i[3] + ' corners</span>');
        api.readout(out.join(''));
        api.report({ v: S.k, f: String(i[0]), e: String(i[2]), c: String(i[3]) });
      }
      api.onRedraw(draw); watchSize(api, holder, draw);
    }
  });

  /* ═════════════ BUCKET BALANCE ═════════════ */
  var THINGS = { bear: ['bear', 3], cube: ['cube', 1], apple: ['apple', 6], pencil: ['pencil', 2], book: ['book', 12], block: ['block', 5] };
  function thing(v, k, x, y, s) {
    s = s || 1; var g = O.s('g', {}, v);
    if (k === 'bear') { var b = bear(g, x, y + 4 * s, 0, 2); b.setAttribute('transform', 'translate(' + (x - x * s) + ' ' + (y - y * s) + ') scale(' + s + ')'); }
    else if (k === 'cube') { O.s('rect', { x: x - 12 * s, y: y - 12 * s, width: 24 * s, height: 24 * s, rx: 4, fill: '#2F6FDE', stroke: '#1D4FA8', 'stroke-width': 2 }, g); }
    else if (k === 'apple') { O.s('circle', { cx: x, cy: y + 2 * s, r: 16 * s, fill: '#E0483E', stroke: '#A52F27', 'stroke-width': 2 }, g); O.s('rect', { x: x - 1.5 * s, y: y - 20 * s, width: 3 * s, height: 9 * s, fill: '#6B4423' }, g); O.s('ellipse', { cx: x + 7 * s, cy: y - 15 * s, rx: 6 * s, ry: 3 * s, fill: '#23915A' }, g); }
    else if (k === 'pencil') { O.s('rect', { x: x - 26 * s, y: y - 5 * s, width: 44 * s, height: 10 * s, fill: '#F2B705', stroke: '#B88700', 'stroke-width': 1.5 }, g); O.s('path', { d: 'M' + (x + 18 * s) + ' ' + (y - 5 * s) + 'L' + (x + 28 * s) + ' ' + y + 'L' + (x + 18 * s) + ' ' + (y + 5 * s) + 'Z', fill: '#F5D9A8', stroke: '#B88700' }, g); O.s('rect', { x: x - 30 * s, y: y - 5 * s, width: 5 * s, height: 10 * s, fill: '#F4A3B5' }, g); }
    else if (k === 'book') { O.s('rect', { x: x - 20 * s, y: y - 15 * s, width: 40 * s, height: 30 * s, rx: 3, fill: '#6B46C1', stroke: '#4B2E91', 'stroke-width': 2 }, g); O.s('rect', { x: x - 20 * s, y: y - 15 * s, width: 7 * s, height: 30 * s, fill: '#4B2E91' }, g); }
    else { O.s('rect', { x: x - 18 * s, y: y - 11 * s, width: 36 * s, height: 22 * s, rx: 3, fill: '#D9A86C', stroke: '#9E6F37', 'stroke-width': 2 }, g); }
    O.s('rect', { x: x - 28 * s, y: y - 24 * s, width: 56 * s, height: 48 * s, fill: 'transparent' }, g);
    return g;
  }
  O.register('bucket', {
    defaults: { m: 'cmp', L: [], R: [], obj: 'apple' },
    mount: function (api) {
      var S = api.S, holder = O.el('div'), angle = 0; api.stage.appendChild(holder);
      api.quick([['Compare two things', { m: 'cmp', L: [], R: [] }], ['Balance with cubes', { m: 'cubes', L: ['apple'], R: [], obj: 'apple' }]]);
      api.button('Empty the buckets', function () { S.L = S.m === 'cubes' ? [S.obj] : []; S.R = []; api.redraw(); });
      api.more();
      api.select('Thing to balance (cubes mode)', 'obj', [['apple', 'Apple'], ['bear', 'Bear'], ['book', 'Book'], ['block', 'Block'], ['pencil', 'Pencil']], function () { if (S.m === 'cubes') { S.L = [S.obj]; S.R = []; } });
      api.endMore();
      function wt(arr) { return arr.reduce(function (s, k) { return s + THINGS[k][1]; }, 0); }
      function target() { return O.clamp((wt(S.R) - wt(S.L)) * 2.2, -16, 16); }
      function draw() {
        holder.innerHTML = ''; var nar = narrow(api), W = nar ? 420 : 760, beam = nar ? 300 : 480, bw = nar ? 120 : 160, bh = nar ? 90 : 100, piv = { x: W / 2, y: 70 }, ty = 340, H = ty + 100;
        var v = svgBox(holder, W, H, 'Bucket balance'), scene = O.s('g', {}, v);
        api.say(S.m === 'cubes' ? 'Drag cubes into the right bucket until it balances.' : 'Drag things into the buckets. Which side is heavier?');
        var tray = S.m === 'cubes' ? ['cube'] : ['bear', 'cube', 'apple', 'pencil', 'book', 'block'];
        function geom(a) {
          var r = a * Math.PI / 180, ex = Math.cos(r) * beam / 2, ey = Math.sin(r) * beam / 2;
          return { L: { x: piv.x - ex, y: piv.y - ey }, R: { x: piv.x + ex, y: piv.y + ey } };
        }
        function bucketRect(end) { return { x: end.x - bw / 2, y: end.y + 60, w: bw, h: bh }; }
        function sceneDraw(a) {
          scene.innerHTML = '';
          O.s('path', { d: 'M' + (piv.x - 70) + ' ' + (ty - 30) + ' L' + (piv.x + 70) + ' ' + (ty - 30) + ' L' + (piv.x + 40) + ' ' + (ty - 50) + ' L' + (piv.x - 40) + ' ' + (ty - 50) + 'Z', fill: '#6B46C1' }, scene);
          O.s('rect', { x: piv.x - 8, y: piv.y, width: 16, height: ty - 50 - piv.y, fill: '#8667D6' }, scene);
          var gm = geom(a);
          O.s('line', { x1: gm.L.x, y1: gm.L.y, x2: gm.R.x, y2: gm.R.y, stroke: NAVY, 'stroke-width': 10, 'stroke-linecap': 'round' }, scene);
          O.s('circle', { cx: piv.x, cy: piv.y, r: 10, fill: YEL, stroke: NAVY, 'stroke-width': 3 }, scene);
          O.s('path', { d: 'M' + (piv.x - 12) + ' ' + (piv.y - 26) + ' L' + (piv.x + 12) + ' ' + (piv.y - 26) + ' L' + piv.x + ' ' + (piv.y - 6) + 'Z', fill: RED }, scene);
          [['L', gm.L, RED], ['R', gm.R, BLU]].forEach(function (q) {
            var b = bucketRect(q[1]);
            O.s('line', { x1: q[1].x, y1: q[1].y, x2: b.x + 8, y2: b.y, stroke: MUTE, 'stroke-width': 2 }, scene);
            O.s('line', { x1: q[1].x, y1: q[1].y, x2: b.x + b.w - 8, y2: b.y, stroke: MUTE, 'stroke-width': 2 }, scene);
            O.s('path', { d: 'M' + b.x + ' ' + b.y + ' L' + (b.x + b.w) + ' ' + b.y + ' L' + (b.x + b.w - 16) + ' ' + (b.y + b.h) + ' L' + (b.x + 16) + ' ' + (b.y + b.h) + 'Z', fill: q[2], 'fill-opacity': 0.18, stroke: q[2], 'stroke-width': 4 }, scene);
            var arr = S[q[0]], s = arr.length > 8 ? 0.6 : 0.8, per = arr.length > 8 ? 5 : 4, cw = (b.w - 30) / per;
            arr.forEach(function (k, i) {
              var x = b.x + 15 + cw / 2 + (i % per) * cw, y = b.y + b.h - 22 - Math.floor(i / per) * 28 * s * 1.3, g = thing(scene, k, x, y, s);
              (function (i, side) {
                if (S.m === 'cubes' && side === 'L') { g.style.pointerEvents = 'none'; return; }
                dragTap(v, g, function () { S[side].splice(i, 1); animateTo(); }, function (p) {
                  var other = side === 'L' ? 'R' : 'L', gm2 = geom(angle), ob = bucketRect(gm2[other]);
                  var big = { x: ob.x - 20, y: ob.y - 50, w: ob.w + 40, h: ob.h + 80 };
                  if (inR(p, big) && !(S.m === 'cubes')) { S[other].push(k); S[side].splice(i, 1); animateTo(); return true; }
                  var mine = bucketRect(gm2[side]); if (inR(p, { x: mine.x - 20, y: mine.y - 50, w: mine.w + 40, h: mine.h + 80 })) return false;
                  S[side].splice(i, 1); animateTo(); return true;
                }, THINGS[k][0] + ' in the ' + (side === 'L' ? 'left' : 'right') + ' bucket. Drag it out to take it away.');
              })(i, q[0]);
            });
          });
        }
        function animateTo() {
          var from = angle, to = target(); api.changed(); readout();
          tw(700, function (k) { angle = from + (to - from) * k; sceneDraw(angle); }, function () { angle = to; sceneDraw(angle); });
        }
        sceneDraw(angle);
        if (Math.abs(angle - target()) > 0.01) animateTo(); else readout();
        /* tray */
        var tw2 = Math.min(W - 20, tray.length * 100 + 20), tx = (W - tw2) / 2;
        rect(v, tx, ty, tw2, 86, { rx: 14, fill: '#F6F7FB', stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
        tray.forEach(function (k, i) {
          var x = tx + 10 + (tw2 - 20) / tray.length * (i + 0.5), g = thing(v, k, x, ty + 46, nar && tray.length > 4 ? 0.9 : 1);
          dragTap(v, g, function () {
            var side = S.m === 'cubes' ? 'R' : (S.L.length <= S.R.length ? 'L' : 'R'); if (S[side].length >= 15) { O.toast('That bucket is full.'); return; } S[side].push(k); animateTo();
          }, function (p) {
            var gm = geom(angle);
            for (var sIdx = 0; sIdx < 2; sIdx++) {
              var side = sIdx ? 'R' : 'L', b = bucketRect(gm[side]);
              if (inR(p, { x: b.x - 20, y: b.y - 50, w: b.w + 40, h: b.h + 80 })) {
                if (S.m === 'cubes' && side === 'L') { O.toast('Put the cubes in the other bucket.'); return false; }
                if (S[side].length >= 15) { O.toast('That bucket is full.'); return false; }
                S[side].push(k); animateTo(); return true;
              }
            }
            return false;
          }, 'Add a ' + THINGS[k][0]);
        });
      }
      function readout() {
        var l = wt(S.L), r = wt(S.R), out;
        if (S.m === 'cubes') {
          var n = S.R.length, nm = THINGS[S.obj][0];
          out = l === r ? 'The ' + nm + ' weighs the same as <b>' + n + '</b> cube' + (n === 1 ? '' : 's') + '.' : (r < l ? '<b>' + n + '</b> cube' + (n === 1 ? '' : 's') + '. The ' + nm + ' is heavier. Add more cubes.' : '<b>' + n + '</b> cubes. The cubes are heavier. Take some out.');
        } else if (!S.L.length && !S.R.length) out = 'The buckets are empty.';
        else out = l === r ? '<b>They balance.</b>' : l > r ? 'The <b>left</b> side is heavier.' : 'The <b>right</b> side is heavier.';
        api.readout('<span>' + out + '</span>');
        api.report({ v: l === r ? '=' : l > r ? 'L' : 'R', c: String(S.R.filter(function (k) { return k === 'cube'; }).length) });
      }
      api.onRedraw(draw); watchSize(api, holder, draw);
    }
  });
})();
