/* Number Discs on a place-value chart (Dimensions kit: Place Value Discs, 4-value and 10-value)
   Drag AND tap: drag a disc from the tray onto its column, drag a mat disc onto the next smaller column to break it,
   drag a mat disc off the mat to take it away. Trades and breaks animate so students see the 10-for-1 move.
   Drag, tap, lasso and focus memory all come from core (O.ghostDrag, O.tap, O.lasso, data-k keys). */
(function () {
  var O = OAOM;
  /* O.hit without pointer-events="all": a transparent fill is still hit-testable, and a drag ghost (pointer-events none on its group) must not catch elementFromPoint */
  function hit(g, x, y, w, h) { var r = O.hit(g, x, y, w, h); r.removeAttribute('pointer-events'); return r; }
  var COL = { 6: '#7A5230', 5: '#138A8A', 4: '#D6457A', 3: '#7C4DFF', 2: '#2F6FDE', 1: '#23915A', 0: '#F08A24', '-1': '#C99A00', '-2': '#C2410C', '-3': '#5B6478' };
  var NAVY = '#0E1C42';
  /* text on the orange (1) and gold (0.1) discs is navy: white does not have enough contrast there */
  function inkOn(e) { return e === 0 || e === -1 ? NAVY : '#fff'; }
  /* a darker copy of the orange / gold for text written in that color on white */
  var DARK = { 0: '#B4621A', '-1': '#8A6900' };
  function textCol(e) { return DARK[e] || COL[e]; }
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
  function colOf(t) { var c = t && t.closest && t.closest('[data-col]'); return c ? +c.getAttribute('data-col') : null; }

  O.register('discs', {
    defaults: { hi: 3, lo: 0, c: {}, cap: 1 },
    mount: function (api) {
      var S = api.S, busyF = false, sel = null; /* sel = {e, nodes} picked with a lasso */
      function busy() { return busyF; }
      function places() { var a = []; for (var e = S.hi; e >= S.lo; e--) a.push(e); return a; }
      function n(e) { return S.c[e] || 0; }
      api.say('Drag discs from the tray onto the mat. Drag a disc to the smaller column to break it, or to the bigger column to trade 10 for 1. Drag it off the mat to take it away.');

      api.quick([['Whole numbers', { hi: 3, lo: 0, c: {} }], ['Big numbers', { hi: 5, lo: 0, c: {} }], ['Decimals', { hi: 0, lo: -2, c: {} }], ['Thousandths', { hi: 0, lo: -3, c: {} }]]);
      api.button('Clear the mat', function () { S.c = {}; api.redraw(); }, '', api.row());
      api.hint('Tip: drag a box around 10 discs to pick them up together. Keyboard: Tab to the small + − and Trade buttons under each column.');
      api.more('More options');
      api.heading('Places on the chart');
      var opts = []; for (var e = 6; e >= -3; e--) opts.push([e, NAME[e][0]]);
      api.select('Biggest place', 'hi', opts.filter(function (o) { return o[0] >= 0; }), function () { if (S.lo > S.hi) S.lo = S.hi; trim(); });
      api.select('Smallest place', 'lo', opts.filter(function (o) { return o[0] <= 0; }), function () { trim(); });
      api.check('Show place names on the chart', 'cap');
      api.heading('Start with a number');
      var row = api.row(); var inp = O.el('input', { type: 'text', placeholder: 'like 3,405 or 2.75', 'aria-label': 'Number to show', style: 'flex:1;min-width:0;border:2px solid var(--line);border-radius:10px;padding:.35em .55em;min-height:38px' });
      row.appendChild(inp); api.button('Show it', function () { setNumber(inp.value); }, 'primary', row);
      inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') setNumber(inp.value); });
      api.endMore();

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

      /* layout: W is a column; everything else is worked out in draw() from how small the stage will be drawn
         (the svg is scaled down to fit a phone, so discs and buttons grow in svg units to stay big enough to touch) */
      var W = 132, HEAD = 64, SHOW = 20;
      var holder = O.el('div'); api.stage.appendChild(holder);
      var v, nodes = {}, G = null; /* G = the current geometry */
      function colX(e) { return 4 + places().indexOf(e) * W; }
      function geometry() {
        var P = places(), w = P.length * W + 8, sc = Math.min(1, (api.stage.clientWidth || 800) / w); /* css px per svg unit */
        var R = sc < 0.85 ? O.clamp(18 / sc, 15, 28) : 15;                  /* a disc is at least 36 css px wide on a phone; two still fit in a column */
        var PER = sc < 0.85 ? Math.max(1, Math.floor((W - 12) / (2 * R + 2))) : 4, ROWS = Math.ceil(SHOW / PER);
        var cell = (W - 12) / PER, ROWH = 2 * R + 6, top = HEAD + 34, areaH = ROWS * ROWH + 14;
        var BH = Math.max(26, 32 / sc), BTN = top + areaH + 4, btnArea = 2 * BH + 14;        /* two rows of buttons, each ≥ 32 css px tall */
        var TH = Math.max(2 * R + 14, 44 / sc + 8), TRAY = BTN + btnArea + 4, H = TRAY + TH + 8;
        return { P: P, w: w, sc: sc, R: R, PER: PER, ROWS: ROWS, cell: cell, ROWH: ROWH, top: top, areaH: areaH, BH: BH, BTN: BTN, TH: TH, TRAY: TRAY, H: H, fs: R / 15 };
      }
      function dpos(e, d) { d = Math.min(d, SHOW - 1); return [colX(e) + 6 + (d % G.PER) * G.cell + G.cell / 2, G.top + G.R + 4 + Math.floor(d / G.PER) * G.ROWH]; }
      function discG(par, cx, cy, e, hitW, hitH) {
        var g = O.s('g', {}, par), col = COL[e], R = G.R, lb = label(e), fs = (lb.length > 5 ? 6.5 : lb.length > 3 ? 8 : lb.length > 2 ? 11 : 14) * G.fs;
        O.s('circle', { cx: cx, cy: cy, r: R, fill: col, stroke: '#fff', 'stroke-width': 2 }, g);
        O.s('text', { x: cx, y: cy + fs * 0.36, 'text-anchor': 'middle', fill: inkOn(e), 'font-size': fs, text: lb }, g);
        if (hitW) hit(g, cx - hitW / 2, cy - (hitH || hitW) / 2, hitW, hitH || hitW);
        return g;
      }
      function mark(list) { (sel ? sel.nodes : []).forEach(function (g) { var r = g.querySelector('.sel'); if (r) r.remove(); }); sel = null; if (!list.length) return;
        var e = +list[0].getAttribute('data-e'); list = list.filter(function (g) { return +g.getAttribute('data-e') === e; });
        sel = { e: e, nodes: list }; list.forEach(function (g) { O.s('circle', { class: 'sel', cx: g._c[0], cy: g._c[1], r: G.R + 3, fill: 'none', stroke: '#F2B705', 'stroke-width': 4 }, g); });
        O.toast(list.length + ' picked. Drag them together.'); }
      /* a small rectangular button (keyboard path); ≥ 32 css px tall */
      function btn(par, x, y, w, t, fill, fn, lab, key, dim) {
        var g = O.s('g', { opacity: dim ? .4 : 1, 'data-ui': 'btn' }, par), h = G.BH, fs = Math.min(t.length > 1 ? 12 : 16, h * .55);
        O.s('rect', { x: x, y: y, width: w, height: h, rx: 7, fill: fill, opacity: fill === '#E7E9F0' ? 1 : .9 }, g);
        O.s('text', { x: x + w / 2, y: y + h / 2 + fs * .36, 'text-anchor': 'middle', fill: fill === '#F2B705' || fill === '#E7E9F0' ? NAVY : '#fff', 'font-size': fs, text: t }, g);
        O.tap(g, function () { if (!busyF) fn(); }, lab, key);
        return g;
      }
      function draw() {
        holder.innerHTML = ''; nodes = {}; sel = null;
        G = geometry();
        var P = G.P, w = G.w, R = G.R;
        v = O.svg(w, G.H, holder, 'Place-value chart with number discs');
        P.forEach(function (e) {
          var x = colX(e), col = COL[e], cg = O.s('g', { 'data-col': e }, v);
          var bg = O.s('rect', { x: x + 3, y: 4, width: W - 6, height: G.TRAY - 10, rx: 12, fill: '#fff', stroke: '#D9DEEA', 'stroke-width': 2, class: 'paper' }, cg);
          O.s('rect', { x: x + 3, y: 4, width: W - 6, height: HEAD - 4, rx: 12, fill: col }, cg);
          O.s('rect', { x: x + 3, y: HEAD - 16, width: W - 6, height: 12, fill: col }, cg);
          if (S.cap) O.s('text', { x: x + W / 2, y: 26, 'text-anchor': 'middle', fill: inkOn(e), 'font-size': NAME[e][0].length > 12 ? 11.5 : 14, text: NAME[e][0] }, cg);
          O.s('text', { x: x + W / 2, y: S.cap ? 48 : 38, 'text-anchor': 'middle', fill: inkOn(e), 'font-size': S.cap ? 13 : 18, text: S.cap ? label(e) : SHORT[e] }, cg);
          O.s('text', { x: x + W / 2, y: HEAD + 24, 'text-anchor': 'middle', 'font-size': 20, fill: textCol(e), class: 'om-num', text: String(n(e)) }, cg);
          O.lasso(v, bg, function () { return nodes[e]; }, mark);
          var k = n(e), show = Math.min(k, SHOW); nodes[e] = [];
          for (var d = 0; d < show; d++) {
            var p = dpos(e, d), g = discG(cg, p[0], p[1], e, G.cell - 4, G.ROWH - 4); g._c = p; g.setAttribute('data-e', e); nodes[e].push(g);
            (function (e, g, d) {
              if (e > S.lo) O.tap(g, function () { if (!busyF) breakDisc(e, g); }, 'Break one ' + label(e) + ' disc into 10 smaller discs', 'd' + e + '-' + d);
              else { g.setAttribute('tabindex', '-1'); g.setAttribute('data-k', 'd' + e + '-' + d); }
              g.style.cursor = 'grab';
              function picked() { return sel && sel.e === e && sel.nodes.indexOf(g) > -1 ? sel.nodes.slice() : null; }
              O.ghostDrag(v, g, busy, function (t) {
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
              }, function () { var m = picked(); return m ? O.cloneGroup(m, cg) : null; });
            })(e, g, d);
          }
          if (k > show) O.s('text', { x: x + W / 2, y: G.top + G.areaH - 6, 'text-anchor': 'middle', 'font-size': 13, fill: '#5B6478', class: 'ink om-num', text: '+' + (k - show) + ' more' }, cg);
          /* keyboard row: − + on one line, Trade on the next */
          var bw = (W - 24) / 2, by = G.BTN;
          btn(cg, x + 8, by, bw, '−', '#5B6478', function () { if (n(e) > 0) { S.c[e] = n(e) - 1; api.redraw(); } }, 'Take away one ' + label(e) + ' disc', 'col' + e + '-sub');
          btn(cg, x + 16 + bw, by, bw, '+', col, function () { add(e); }, 'Add one ' + label(e) + ' disc', 'col' + e + '-add');
          if (e < S.hi) {
            var can = n(e) >= 10;
            (function (e) { btn(cg, x + 8, by + G.BH + 6, W - 16, 'Trade 10 ⇧', can ? '#F2B705' : '#E7E9F0', function () { if (n(e) < 10) { O.toast('You need 10 to trade. You have ' + n(e) + '.'); return; } trade(e); }, 'Trade 10 ' + label(e) + ' discs for 1 ' + label(e + 1) + ' disc', 'col' + e + '-trade', !can); })(e);
          }
        });
        /* tray: one disc per place, drag it onto its column (or tap it); each disc has a ≥ 44 css px hit area */
        var tray = O.s('g', { 'data-tray': 1, 'data-ui': 'tray' }, v), hitT = Math.min(W - 10, Math.max(2 * R + 8, 44 / G.sc));
        O.s('rect', { x: 7, y: G.TRAY, width: w - 14, height: G.TH, rx: 12, fill: '#F6F7FB', stroke: '#D9DEEA', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, tray);
        P.forEach(function (e) {
          var cx = colX(e) + W / 2, g = discG(tray, cx, G.TRAY + G.TH / 2, e, hitT, Math.min(G.TH - 2, hitT));
          g.style.cursor = 'grab';
          O.tap(g, function () { if (!busyF) add(e); }, 'Add one ' + label(e) + ' disc', 'tray' + e);
          O.ghostDrag(v, g, busy, function (t) {
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
        /* the biggest column has nowhere to trade to, so it never gets the nudge */
        var over = P.some(function (e) { return e < S.hi && n(e) >= 10; });
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
      api.onRedraw(draw);
      /* the disc size depends on how wide the stage is, so redraw (without a new history step) when the window changes size */
      var rt; api.onResize(function () { clearTimeout(rt); rt = setTimeout(function () { if (holder.isConnected && !busyF) { var f = O.focusKey(api.stage); draw(); O.refocus(api.stage, f); } }, 150); });
    }
  });
})();
