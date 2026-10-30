/* Number Discs on a place-value chart (Dimensions kit: Place Value Discs, 4-value and 10-value)
   Drag AND tap: drag a disc from the tray onto its column, drag a mat disc onto the next smaller column to break it,
   drag a mat disc off the mat to take it away. Trades and breaks animate so students see the 10-for-1 move. */
(function () {
  var O = OAOM;
  var COL = { 6: '#7A5230', 5: '#138A8A', 4: '#D6457A', 3: '#7C4DFF', 2: '#2F6FDE', 1: '#23915A', 0: '#F08A24', '-1': '#C99A00', '-2': '#C2410C', '-3': '#5B6478' };
  var NAME = { 6: ['Millions', 'million'], 5: ['Hundred Thousands', 'hundred thousand'], 4: ['Ten Thousands', 'ten thousand'], 3: ['Thousands', 'thousand'], 2: ['Hundreds', 'hundred'], 1: ['Tens', 'ten'], 0: ['Ones', 'one'], '-1': ['Tenths', 'tenth'], '-2': ['Hundredths', 'hundredth'], '-3': ['Thousandths', 'thousandth'] };
  var SHORT = { 6: 'M', 5: 'HTh', 4: 'TTh', 3: 'Th', 2: 'H', 1: 'T', 0: 'O', '-1': 't', '-2': 'h', '-3': 'th' };
  function label(e) { return e >= 0 ? O.fmt(Math.pow(10, e)) : '0.' + '0'.repeat(-e - 1) + '1'; }
  function plural(e, n) { var w = NAME[e][1]; return n + ' ' + (n === 1 ? w : w + 's'); }
  /* n discs of place e, as a decimal string (exact) */
  function termStr(e, n) { if (e >= 0) return O.fmt(n * Math.pow(10, e)); var s = String(n); while (s.length <= -e) s = '0' + s; var ip = s.slice(0, s.length + e), fp = s.slice(s.length + e).replace(/0+$/, ''); return O.fmt(+ip) + (fp ? '.' + fp : ''); }
  /* value as string, exact (counts * 10^e summed as integer of 10^lo) */
  function valueStr(S) {
    var lo = S.lo, tot = 0n;
    for (var e = S.hi; e >= lo; e--) tot += BigInt(S.c[e] || 0) * (10n ** BigInt(e - lo));
    var str = tot.toString();
    if (lo >= 0) { str = str + '0'.repeat(lo); return Number(str).toLocaleString('en-US'); }
    var dp = -lo; while (str.length <= dp) str = '0' + str;
    var ip = str.slice(0, str.length - dp), fp = str.slice(str.length - dp).replace(/0+$/, '');
    return Number(ip).toLocaleString('en-US') + (fp ? '.' + fp : '');
  }

  /* ---- drag helper: drag a clone ("ghost"); tap still works through O.tap ---- */
  var supUntil = 0;
  function tapS(node, fn, lab) { O.tap(node, function (e) { if (Date.now() < supUntil) return; fn(e); }, lab); }
  function ghostDrag(svg, node, busy, drop, mk, onMove) {
    node.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || busy()) return;
      e.preventDefault(); e.stopPropagation();
      var id = e.pointerId, p0 = O.pt(svg, e), moved = false, ghost = null, hide = [node];
      try { node.setPointerCapture(id); } catch (x) {}
      function mv(ev) {
        if (ev.pointerId !== id) return;
        if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) > 6) {
          moved = true; var m = mk ? mk() : null;
          ghost = m ? m.el : node.cloneNode(true); if (m && m.hide) hide = m.hide;
          ghost.style.pointerEvents = 'none'; if (ghost.removeAttribute) ghost.removeAttribute('tabindex');
          ((m && m.par) || node.parentNode).appendChild(ghost); hide.forEach(function (h) { h.style.opacity = '.3'; });
        }
        if (ghost) { var p = O.pt(svg, ev); ghost._tx = p.x - p0.x; ghost._ty = p.y - p0.y; ghost.setAttribute('transform', 'translate(' + ghost._tx + ' ' + ghost._ty + ')'); if (onMove) onMove(p, ev); }
      }
      function up(ev) {
        if (ev.pointerId !== id) return;
        node.removeEventListener('pointermove', mv); node.removeEventListener('pointerup', up); node.removeEventListener('pointercancel', up);
        if (!moved) return;
        supUntil = Date.now() + 250;
        var t = ev.type === 'pointercancel' ? null : document.elementFromPoint(ev.clientX, ev.clientY);
        if (drop(t, O.pt(svg, ev))) { ghost.remove(); return; }
        O.anim(ghost, { tx: ghost._tx, ty: ghost._ty }, { tx: 0, ty: 0 }, 220, function () { ghost.remove(); hide.forEach(function (h) { h.style.opacity = ''; }); });
      }
      node.addEventListener('pointermove', mv); node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
    });
  }
  /* lasso: drag on an empty spot of `area` to draw a box; done(list of nodes whose centers are inside) */
  function lasso(svg, area, getNodes, done) {
    area.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      var id = e.pointerId, p0 = O.pt(svg, e), c0 = [e.clientX, e.clientY], box = null;
      try { area.setPointerCapture(id); } catch (x) {}
      function mv(ev) {
        if (ev.pointerId !== id) return;
        var p = O.pt(svg, ev);
        if (!box && Math.hypot(ev.clientX - c0[0], ev.clientY - c0[1]) > 6) box = O.s('rect', { fill: 'rgba(242,183,5,.15)', stroke: '#F2B705', 'stroke-width': 2, 'stroke-dasharray': '6 4', rx: 6, 'pointer-events': 'none' }, svg);
        if (box) { box.setAttribute('x', Math.min(p.x, p0.x)); box.setAttribute('y', Math.min(p.y, p0.y)); box.setAttribute('width', Math.abs(p.x - p0.x)); box.setAttribute('height', Math.abs(p.y - p0.y)); }
      }
      function up(ev) {
        if (ev.pointerId !== id) return;
        area.removeEventListener('pointermove', mv); area.removeEventListener('pointerup', up); area.removeEventListener('pointercancel', up);
        var x1 = Math.min(c0[0], ev.clientX), x2 = Math.max(c0[0], ev.clientX), y1 = Math.min(c0[1], ev.clientY), y2 = Math.max(c0[1], ev.clientY);
        if (box) { box.remove(); supUntil = Date.now() + 250; }
        done(box ? getNodes().filter(function (n) { var r = n.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2; }) : []);
      }
      area.addEventListener('pointermove', mv); area.addEventListener('pointerup', up); area.addEventListener('pointercancel', up);
    });
  }
  /* a group of clones of nodes, for dragging several pieces at once */
  function cloneGroup(nodes, par) { var g = O.s('g', {}); nodes.forEach(function (n) { var c = n.cloneNode(true); c.removeAttribute('tabindex'); if (n._tx || n._ty) c.removeAttribute('transform'); g.appendChild(c); }); return { el: g, hide: nodes, par: par }; }

  function colOf(t) { var c = t && t.closest && t.closest('[data-col]'); return c ? +c.getAttribute('data-col') : null; }

  O.register('discs', {
    defaults: { hi: 3, lo: 0, c: {}, cap: 1 },
    mount: function (api) {
      var S = api.S, busyF = false, sel = null; /* sel = {e, nodes} picked with a lasso */
      function busy() { return busyF; }
      function places() { var a = []; for (var e = S.hi; e >= S.lo; e--) a.push(e); return a; }
      function n(e) { return S.c[e] || 0; }
      api.say('Drag discs from the tray onto the mat. Drag a disc to the smaller column to break it, or to the bigger column to trade 10 for 1. Drag it off the mat to take it away.');

      api.heading('Places on the chart');
      var opts = []; for (var e = 6; e >= -3; e--) opts.push([e, NAME[e][0]]);
      api.select('Biggest place', 'hi', opts.filter(function (o) { return o[0] >= 0; }), function () { if (S.lo > S.hi) S.lo = S.hi; trim(); });
      api.select('Smallest place', 'lo', opts.filter(function (o) { return o[0] <= 0; }), function () { trim(); });
      api.heading('Start with a number');
      var row = api.row(); var inp = O.el('input', { type: 'text', placeholder: 'like 3,405 or 2.75', 'aria-label': 'Number to show', style: 'flex:1;min-width:0;border:2px solid var(--line);border-radius:10px;padding:.35em .55em;min-height:38px' });
      row.appendChild(inp); api.button('Show it', function () { setNumber(inp.value); }, 'primary', row);
      inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') setNumber(inp.value); });
      api.check('Show place names on the chart', 'cap');
      api.button('Clear the mat', function () { S.c = {}; api.redraw(); }, '', api.row());
      api.hint('Tip: drag a box around 10 discs to pick them up together. Keyboard: Tab to the small + − and Trade buttons under each column.');

      function trim() { Object.keys(S.c).forEach(function (k) { if (+k > S.hi || +k < S.lo) delete S.c[k]; }); }
      function setNumber(t) {
        t = String(t).replace(/[,\s$]/g, ''); if (!/^\d*\.?\d*$/.test(t) || t === '' || t === '.') { O.toast('Type a number like 3405 or 2.75'); return; }
        var parts = t.split('.'), ip = parts[0].replace(/^0+(?=\d)/, ''), fp = parts[1] || '';
        var needHi = Math.max(0, ip.length - 1), needLo = -fp.replace(/0+$/, '').length;
        if (needHi > 6 || needLo < -3) { O.toast('That number is too big or has too many decimal places.'); return; }
        if (needHi > S.hi) S.hi = needHi; if (needLo < S.lo) S.lo = needLo;
        S.c = {};
        for (var i = 0; i < ip.length; i++) { var d = +ip[ip.length - 1 - i]; if (d) S.c[i] = d; }
        for (var j = 0; j < fp.length; j++) { var f = +fp[j]; if (f) S.c[-(j + 1)] = f; }
        syncSel(); api.redraw();
      }
      function syncSel() { var sels = api.setup.querySelectorAll('select'); if (sels[0]) sels[0].value = S.hi; if (sels[1]) sels[1].value = S.lo; }

      var W = 132, HEAD = 64, ROWH = 40, ROWS = 5, PER = 4, top = HEAD + 34, areaH = ROWS * ROWH + 14, BTN = top + areaH + 4, TRAY = BTN + 34, H = TRAY + 62;
      var MAXSHOW = ROWS * PER;
      var holder = O.el('div'); api.stage.appendChild(holder);
      var v, nodes = {};
      function colX(e) { return 4 + places().indexOf(e) * W; }
      function dpos(e, d) { d = Math.min(d, MAXSHOW - 1); return [colX(e) + 22 + (d % PER) * 29.5, top + 18 + Math.floor(d / PER) * ROWH]; }
      function discG(par, cx, cy, e) {
        var g = O.s('g', {}, par), col = COL[e];
        O.s('circle', { cx: cx, cy: cy, r: 15, fill: col, stroke: '#fff', 'stroke-width': 2 }, g);
        var lb = label(e); O.s('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', fill: '#fff', 'font-size': lb.length > 5 ? 6.5 : lb.length > 3 ? 8 : 11, text: lb }, g);
        return g;
      }
      function mark(list) { (sel ? sel.nodes : []).forEach(function (g) { var r = g.querySelector('.sel'); if (r) r.remove(); }); sel = null; if (!list.length) return;
        var e = +list[0].getAttribute('data-e'); list = list.filter(function (g) { return +g.getAttribute('data-e') === e; });
        sel = { e: e, nodes: list }; list.forEach(function (g) { O.s('circle', { class: 'sel', cx: g._c[0], cy: g._c[1], r: 18, fill: 'none', stroke: '#F2B705', 'stroke-width': 4 }, g); });
        O.toast(list.length + ' picked. Drag them together.'); }
      function draw() {
        holder.innerHTML = ''; nodes = {}; sel = null;
        var P = places(), w = P.length * W + 8;
        v = O.svg(w, H, holder, 'Place-value chart with number discs');
        P.forEach(function (e) {
          var x = colX(e), col = COL[e], cg = O.s('g', { 'data-col': e }, v);
          var bg = O.s('rect', { x: x + 3, y: 4, width: W - 6, height: TRAY - 10, rx: 12, fill: '#fff', stroke: '#D9DEEA', 'stroke-width': 2, class: 'paper' }, cg);
          O.s('rect', { x: x + 3, y: 4, width: W - 6, height: HEAD - 4, rx: 12, fill: col }, cg);
          O.s('rect', { x: x + 3, y: HEAD - 16, width: W - 6, height: 12, fill: col }, cg);
          if (S.cap) O.s('text', { x: x + W / 2, y: 26, 'text-anchor': 'middle', fill: '#fff', 'font-size': NAME[e][0].length > 12 ? 11.5 : 14, text: NAME[e][0] }, cg);
          O.s('text', { x: x + W / 2, y: S.cap ? 48 : 38, 'text-anchor': 'middle', fill: '#fff', 'font-size': S.cap ? 13 : 18, text: S.cap ? label(e) : SHORT[e] }, cg);
          O.s('text', { x: x + W / 2, y: HEAD + 24, 'text-anchor': 'middle', 'font-size': 20, fill: col, class: 'om-num', text: String(n(e)) }, cg);
          lasso(v, bg, function () { return nodes[e]; }, mark);
          var k = n(e), show = Math.min(k, MAXSHOW); nodes[e] = [];
          for (var d = 0; d < show; d++) {
            var p = dpos(e, d), g = discG(cg, p[0], p[1], e); g._c = p; g.setAttribute('data-e', e); nodes[e].push(g);
            (function (e, g) {
              if (e > S.lo) tapS(g, function () { if (!busyF) breakDisc(e, g); }, 'Break one ' + label(e) + ' disc into 10 smaller discs');
              else { g.setAttribute('tabindex', '-1'); }
              g.style.cursor = 'grab';
              function picked() { return sel && sel.e === e && sel.nodes.indexOf(g) > -1 ? sel.nodes.slice() : null; }
              ghostDrag(v, g, busy, function (t) {
                var to = colOf(t), many = picked(), cnt = many ? many.length : 1;
                if (to === null) { S.c[e] = n(e) - cnt; api.redraw(); return true; }            /* off the mat: take away */
                if (to === e) return false;
                if (to === e + 1 && e < S.hi) {
                  if (many) { if (cnt >= 10) { trade(e, many.slice(0, 10)); return true; } O.toast('You need 10 to trade. You picked ' + cnt + '.'); return false; }
                  if (n(e) >= 10) { trade(e, [g].concat(nodes[e].filter(function (x) { return x !== g; }).slice(-9))); return true; }
                  O.toast('You need 10 to trade. You have ' + n(e) + '.'); return false;
                }
                if (to === e - 1 && e > S.lo && cnt === 1) { g.style.opacity = '0'; breakDisc(e, g); return true; }
                O.toast(to === e - 1 ? 'Break one disc at a time.' : 'That disc goes in the ' + NAME[e][0] + ' column.');
                return false;
              }, function () { var m = picked(); return m ? cloneGroup(m, cg) : null; });
            })(e, g);
          }
          if (k > show) O.s('text', { x: x + W / 2, y: top + areaH - 6, 'text-anchor': 'middle', 'font-size': 13, fill: '#5B6478', class: 'ink', text: '+' + (k - show) + ' more' }, cg);
          /* small keyboard row: − + and Trade */
          btn(cg, x + 20, BTN + 12, '−', '#5B6478', function () { if (n(e) > 0) { S.c[e] = n(e) - 1; api.redraw(); } }, 'Take away one ' + label(e) + ' disc');
          btn(cg, x + 46, BTN + 12, '+', col, function () { add(e); }, 'Add one ' + label(e) + ' disc');
          if (e < S.hi) {
            var can = n(e) >= 10;
            var tg = O.s('g', { opacity: can ? 1 : .4 }, cg);
            O.s('rect', { x: x + 66, y: BTN + 3, width: 58, height: 18, rx: 6, fill: can ? '#F2B705' : '#E7E9F0' }, tg);
            O.s('text', { x: x + 95, y: BTN + 15.5, 'text-anchor': 'middle', 'font-size': 9, fill: '#0E1C42', text: 'Trade 10 ⇧' }, tg);
            (function (e) { tapS(tg, function () { if (busyF) return; if (n(e) < 10) { O.toast('You need 10 to trade. You have ' + n(e) + '.'); return; } trade(e); }, 'Trade 10 ' + label(e) + ' discs for 1 ' + label(e + 1) + ' disc'); })(e);
          }
        });
        /* tray: one disc per place, drag it onto its column (or tap it) */
        var tray = O.s('g', { 'data-tray': 1 }, v);
        O.s('rect', { x: 7, y: TRAY, width: w - 14, height: 50, rx: 12, fill: '#F6F7FB', stroke: '#D9DEEA', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, tray);
        P.forEach(function (e) {
          var cx = colX(e) + W / 2, g = discG(tray, cx, TRAY + 25, e);
          g.style.cursor = 'grab';
          tapS(g, function () { if (!busyF) add(e); }, 'Add one ' + label(e) + ' disc');
          ghostDrag(v, g, busy, function (t) {
            var to = colOf(t);
            if (to === e) { add(e); return true; }
            if (to !== null) O.toast('That disc goes in the ' + NAME[e][0] + ' column.');
            return false;
          });
        });
        /* readout: live number sentence + short words */
        var terms = [], words = [];
        P.forEach(function (e) { var k = n(e); if (k) terms.push(k < 10 ? termStr(e, k) : k + ' × ' + label(e)); words.push(plural(e, k)); });
        var val = valueStr(S), sent;
        if (!terms.length) sent = '0';
        else if (terms.length === 1 && terms[0] === val) sent = val;
        else sent = terms.join(' + ') + ' = ' + val;
        var over = P.some(function (e) { return n(e) >= 10; });
        api.readout('<span><b>' + sent + '</b></span><span>' + words.join(', ') + '</span>' + (over ? '<span style="color:#B45309">A column has 10 or more. Can you trade?</span>' : ''));
        api.report({ v: val.replace(/,/g, ''), places: P.map(n).join(',') });
      }
      function add(e) { if (n(e) >= 40) { O.toast('That column is full. Trade 10 discs for 1 bigger disc.'); return; } S.c[e] = n(e) + 1; api.redraw(); }
      /* 10 discs slide together into the next column, then become 1 disc */
      function trade(e, list) {
        list = list || (nodes[e] || []).slice(-10);
        var to = dpos(e + 1, n(e + 1)), left = list.length;
        function done() { S.c[e] = n(e) - 10; S.c[e + 1] = n(e + 1) + 1; busyF = false; api.redraw(); }
        if (O.reduce || !left) { done(); return; }
        busyF = true;
        list.forEach(function (g, i) { g.style.opacity = ''; v.appendChild(g); O.anim(g, { tx: 0, ty: 0 }, { tx: to[0] - g._c[0], ty: to[1] - g._c[1] }, 380 + i * 12, function () { if (--left === 0) done(); }); });
      }
      /* 1 disc splits into 10 smaller discs that fan out into the next column */
      function breakDisc(e, g) {
        if (e <= S.lo) { O.toast('This is the smallest place on the chart.'); return; }
        if (n(e - 1) + 10 > 40) { O.toast('No room. Trade some discs first.'); if (g) g.style.opacity = ''; return; }
        function done() { S.c[e] = n(e) - 1; S.c[e - 1] = n(e - 1) + 10; busyF = false; api.redraw(); }
        if (O.reduce || !g || !g._c) { done(); return; }
        busyF = true; g.style.opacity = '0';
        var from = g._c, base = n(e - 1), left = 10;
        for (var k = 0; k < 10; k++) {
          var to = dpos(e - 1, base + k), c = discG(v, from[0], from[1], e - 1);
          c.style.pointerEvents = 'none';
          O.anim(c, { tx: 0, ty: 0 }, { tx: to[0] - from[0], ty: to[1] - from[1] }, 360 + k * 18, function () { if (--left === 0) done(); });
        }
      }
      function btn(par, cx, cy, t, fill, fn, lab) { var g = O.s('g', {}, par); O.s('circle', { cx: cx, cy: cy, r: 10, fill: fill, opacity: .85 }, g); O.s('text', { x: cx, y: cy + 5, 'text-anchor': 'middle', fill: '#fff', 'font-size': 15, text: t }, g); tapS(g, function () { if (!busyF) fn(); }, lab); }
      api.onRedraw(draw);
    }
  });
})();
