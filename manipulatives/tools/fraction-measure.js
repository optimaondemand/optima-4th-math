/* Fractions, decimals, money and measurement tools:
   fbars (Fraction Tiles), fcircles, decgrid, money, ruler, scale, beaker, clock */
(function () {
  var O = OAOM;
  var VIO = '#6B46C1', GRN = '#23915A', YEL = '#F2B705', NAVY = '#0E1C42', LINE = '#C9CFDF', MUTE = '#5B6478';

  /* ---------- shared helpers ---------- */
  /* drag that only starts on elements marked data-drag; the host keeps pointer capture so the svg can be redrawn mid-drag */
  function dragOn(host, fn) {
    host.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return; var t = e.target.closest && e.target.closest('[data-drag]'); if (!t) return;
      var h = fn(e, t); if (!h) return; e.preventDefault();
      var id = e.pointerId; try { host.setPointerCapture(id); } catch (x) {}
      function mv(ev) { if (ev.pointerId === id && h.move) h.move(ev); }
      function up(ev) { if (ev.pointerId !== id) return; host.removeEventListener('pointermove', mv); host.removeEventListener('pointerup', up); host.removeEventListener('pointercancel', up); if (h.end) h.end(ev); }
      host.addEventListener('pointermove', mv); host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up);
    });
  }
  function P(host, e) { return O.pt(host.querySelector('svg'), e); }
  /* arrow keys on an svg handle */
  function keys(node, fn, label) {
    node.setAttribute('tabindex', '0'); node.setAttribute('role', 'slider'); if (label) node.setAttribute('aria-label', label);
    node.addEventListener('keydown', function (e) { var d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]; if (d) { e.preventDefault(); fn(d); } });
  }
  /* setup groups we can show and hide */
  function grp(api, fn) { var n0 = api.setup.children.length; fn(); return [].slice.call(api.setup.children, n0); }
  function showG(nodes, on) { nodes.forEach(function (n) { n.style.display = on ? '' : 'none'; }); }
  /* stacked fraction drawn in svg, centered on x, line at y */
  function sFrac(p, x, y, n, d, fs, fill, cls) {
    var g = O.s('g', {}, p), w = fs * 0.62 * Math.max(String(n).length, String(d).length) + 4;
    O.s('text', { x: x, y: y - fs * 0.2, 'text-anchor': 'middle', 'font-size': fs, fill: fill, class: cls || '', text: String(n) }, g);
    O.s('line', { x1: x - w / 2, x2: x + w / 2, y1: y, y2: y, stroke: fill, 'stroke-width': Math.max(1.2, fs / 11), class: cls ? 'inks' : '' }, g);
    O.s('text', { x: x, y: y + fs * 0.92, 'text-anchor': 'middle', 'font-size': fs, fill: fill, class: cls || '', text: String(d) }, g);
    return g;
  }
  function lcm(a, b) { return a / O.gcd(a, b) * b; }
  /* k out of d, written the way a 4th grader would: 3/4, 6/4 = 1 1/2, 4/4 = 1 */
  function fracWords(k, d) {
    if (k === 0) return '0';
    var s = O.frac(k, d), g = O.gcd(k, d), simple;
    if (k % d === 0) simple = String(k / d); else if (k > d) simple = O.mixed(k / g, d / g); else simple = O.frac(k / g, d / g);
    if (g > 1 || k >= d) s += ' = ' + simple;
    return s;
  }
  function money(c) { return '$' + (c / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pie(cx, cy, r, a0, a1) { /* degrees, 0 = 12 o'clock, clockwise */
    if (a1 - a0 >= 359.999) return 'M' + (cx - r) + ',' + cy + 'a' + r + ',' + r + ' 0 1,0 ' + 2 * r + ',0a' + r + ',' + r + ' 0 1,0 ' + -2 * r + ',0Z';
    function q(a) { var t = (a - 90) * Math.PI / 180; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; }
    var p0 = q(a0), p1 = q(a1);
    return 'M' + cx + ',' + cy + 'L' + p0[0].toFixed(2) + ',' + p0[1].toFixed(2) + 'A' + r + ',' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ',1 ' + p1[0].toFixed(2) + ',' + p1[1].toFixed(2) + 'Z';
  }
  function inputRow(api, ph, label, fn) {
    var row = api.row(); var inp = O.el('input', { type: 'text', placeholder: ph, 'aria-label': label, style: 'flex:1;min-width:0;border:2px solid var(--line);border-radius:10px;padding:.35em .55em;min-height:38px' });
    row.appendChild(inp); api.button('Show it', function () { fn(inp.value); }, 'primary', row);
    inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') fn(inp.value); });
    return inp;
  }
  var DCOL = { 2: '#D2453B', 3: '#F08A24', 4: '#C99A00', 5: '#7AA22B', 6: '#23915A', 7: '#138A8A', 8: '#2F6FDE', 9: '#4B55C8', 10: '#6B46C1', 11: '#A23FB0', 12: '#D6457A' };
  var DNAME = { 1: 'Wholes', 2: 'Halves', 3: 'Thirds', 4: 'Fourths', 5: 'Fifths', 6: 'Sixths', 7: 'Sevenths', 8: 'Eighths', 9: 'Ninths', 10: 'Tenths', 11: 'Elevenths', 12: 'Twelfths' };

  /* ═════════ FRACTION TILES ═════════ */
  O.register('fbars', {
    defaults: { d: [2, 3, 4, 6, 8, 12], w: 1, lab: 1, sh: {}, gd: 1, gx: 0.5 },
    mount: function (api) {
      var S = api.S;
      api.say('Tap tiles to shade them. Drag the yellow line to see which tiles line up.');
      api.heading('Rows to show');
      var wrap = O.el('div', { class: 'om-field' }), g = O.el('div', { class: 'om-seg', role: 'group', 'aria-label': 'Rows to show' });
      for (var dd = 2; dd <= 12; dd++) (function (d) {
        var b = O.el('button', { type: 'button', 'aria-label': DNAME[d] }, String(d)); b.setAttribute('aria-pressed', S.d.indexOf(d) > -1);
        b.onclick = function () { var i = S.d.indexOf(d); if (i > -1) { if (S.d.length === 1) return; S.d.splice(i, 1); delete S.sh[d]; } else S.d.push(d); S.d.sort(function (a, b) { return a - b; }); b.setAttribute('aria-pressed', S.d.indexOf(d) > -1); api.redraw(); };
        g.appendChild(b);
      })(dd);
      wrap.appendChild(g); api.setup.appendChild(wrap);
      api.hint('Each number is a row: 2 means halves, 3 means thirds, and so on.');
      api.seg('Wholes in each row', 'w', [[1, '1'], [2, '2'], [3, '3']], function () { Object.keys(S.sh).forEach(function (d) { S.sh[d] = S.sh[d].filter(function (i) { return i < d * S.w; }); }); });
      api.check('Write the fraction on each tile', 'lab');
      api.check('Show the line-up guide', 'gd');
      api.button('Clear shading', function () { S.sh = {}; api.redraw(); }, '', api.row());

      var holder = O.el('div'); api.stage.appendChild(holder);
      var BW = 680, LX = 10, RH = 44, GAP = 7, Y0 = 34;
      function draw() {
        holder.innerHTML = '';
        var rows = [1].concat(S.d), H = Y0 + rows.length * (RH + GAP) + 6, WW = BW / S.w;
        var v = O.svg(BW + 2 * LX, H, holder, 'Fraction tiles'); v.style.width = '100%';
        rows.forEach(function (d, r) {
          var y = Y0 + r * (RH + GAP), n = d * S.w, tw = WW / d, sh = S.sh[d] || [];
          for (var i = 0; i < n; i++) {
            var x = LX + i * tw, on = d === 1 || sh.indexOf(i) > -1, col = d === 1 ? NAVY : DCOL[d];
            var t = O.s('g', {}, v);
            O.s('rect', { x: x + 1, y: y, width: tw - 2, height: RH, rx: 6, fill: on ? col : '#fff', stroke: col, 'stroke-width': 2, class: on ? '' : 'paper' }, t);
            if (d === 1) O.s('text', { x: x + tw / 2, y: y + RH / 2 + 7, 'text-anchor': 'middle', 'font-size': 20, fill: '#fff', text: '1' }, t);
            else if (S.lab && tw >= 30) sFrac(t, x + tw / 2, y + RH / 2 - 1, 1, d, tw >= 44 ? 15 : 12, on ? '#fff' : col);
            if (d > 1) (function (d, i) { O.tap(t, function () { var a = S.sh[d] || (S.sh[d] = []), k = a.indexOf(i); if (k > -1) a.splice(k, 1); else a.push(i); api.redraw(); }, (sh.indexOf(i) > -1 ? 'Unshade' : 'Shade') + ' tile ' + (i + 1) + ' of ' + DNAME[d].toLowerCase()); })(d, i);
          }
        });
        if (S.gd) {
          var gx = LX + S.gx * BW, gg = O.s('g', { 'data-drag': 'g' }, v);
          O.s('line', { x1: gx, x2: gx, y1: 22, y2: H - 2, stroke: YEL, 'stroke-width': 4 }, gg);
          O.s('rect', { x: gx - 18, y: 0, width: 36, height: 26, rx: 8, fill: YEL }, gg);
          O.s('text', { x: gx, y: 18, 'text-anchor': 'middle', 'font-size': 15, fill: NAVY, text: '⇔' }, gg);
          O.s('rect', { x: gx - 14, y: 22, width: 28, height: H - 24, fill: 'transparent', 'data-drag': 'g' }, gg);
          gg.style.cursor = 'ew-resize';
          keys(gg, function (k) { S.gx = O.clamp(S.gx + k / (24 * S.w), 0, 1); api.redraw(); }, 'Line-up guide');
        }
        var out = [];
        S.d.forEach(function (d) { var k = (S.sh[d] || []).length; if (k) out.push('<span>' + DNAME[d] + ': <b>' + fracWords(k, d) + '</b></span>'); });
        api.readout(out.join(''));
      }
      dragOn(holder, function () {
        return { move: function (e) {
          var p = P(holder, e), f = O.clamp((p.x - LX) / BW, 0, 1), best = f, bd = 1;
          S.d.concat([1]).forEach(function (d) { var n = d * S.w; for (var i = 0; i <= n; i++) { var b = i / n, dist = Math.abs(b - f) * BW; if (dist < 7 && dist < bd * BW) { best = b; bd = dist / BW; } } });
          S.gx = best; draw();
        }, end: function () { api.redraw(); } };
      });
      api.onRedraw(draw);
    }
  });

  /* ═════════ FRACTION CIRCLES ═════════ */
  O.register('fcircles', {
    defaults: { c: 1, n: 4, per: 0, ns: [4, 4, 4, 4], lab: 0, sh: [[], [], [], []] },
    mount: function (api) {
      var S = api.S;
      api.say('Tap slices to shade them.');
      api.num('How many circles', 'c', 1, 4, 1);
      api.select('Slices in each circle', 'n', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (k) { return [k, k + ' slices']; }), function (v) { S.ns = [v, v, v, v]; trim(); syncSel(); });
      api.check('Give each circle its own number of slices', 'per', function (on) { if (!on) { S.ns = [S.n, S.n, S.n, S.n]; trim(); syncSel(); } showG(perG, on); });
      var sels = [];
      var perG = grp(api, function () {
        var row = api.row();
        [0, 1, 2, 3].forEach(function (i) {
          var s = O.el('select', { 'aria-label': 'Slices in circle ' + (i + 1), style: 'border:2px solid var(--line);border-radius:10px;padding:.25em;min-height:36px' });
          for (var k = 2; k <= 12; k++) s.appendChild(O.el('option', { value: k }, k));
          s.value = S.ns[i]; s.onchange = function () { S.ns[i] = +s.value; trim(); api.redraw(); }; sels.push(s); row.appendChild(s);
        });
      });
      showG(perG, S.per);
      function syncSel() { sels.forEach(function (s, i) { s.value = S.ns[i]; }); }
      api.check('Write the fraction on each slice', 'lab');
      api.button('Clear shading', function () { S.sh = [[], [], [], []]; api.redraw(); }, '', api.row());
      function trim() { S.sh = S.sh.map(function (a, i) { return a.filter(function (k) { return k < S.ns[i]; }); }); }

      var holder = O.el('div'); api.stage.appendChild(holder);
      function draw() {
        holder.innerHTML = '';
        var c = S.c, cols = c === 4 ? 2 : c, rowsN = Math.ceil(c / cols), CW = 240, R = 104;
        var v = O.svg(cols * CW, rowsN * CW, holder, 'Fraction circles'); v.style.width = '100%'; v.style.maxWidth = (cols * 330) + 'px';
        for (var ci = 0; ci < c; ci++) {
          var cx = (ci % cols) * CW + CW / 2, cy = Math.floor(ci / cols) * CW + CW / 2, n = S.ns[ci], sh = S.sh[ci];
          for (var k = 0; k < n; k++) {
            var on = sh.indexOf(k) > -1, a0 = k * 360 / n, a1 = (k + 1) * 360 / n;
            var p = O.s('path', { d: pie(cx, cy, R, a0, a1), fill: on ? VIO : '#fff', stroke: NAVY, 'stroke-width': 2.5, 'stroke-linejoin': 'round', class: on ? '' : 'paper' }, v);
            (function (ci, k) { O.tap(p, function () { var a = S.sh[ci], i = a.indexOf(k); if (i > -1) a.splice(i, 1); else a.push(k); api.redraw(); }, 'Slice ' + (k + 1) + ' of circle ' + (ci + 1)); })(ci, k);
            if (S.lab) { var mid = ((a0 + a1) / 2 - 90) * Math.PI / 180, rr = n === 1 ? 0 : R * 0.64, fs = n > 8 ? 12 : 16; var lab = sFrac(v, cx + rr * Math.cos(mid), cy + rr * Math.sin(mid) - 2, 1, n, fs, on ? '#fff' : NAVY, on ? '' : 'ink'); lab.style.pointerEvents = 'none'; }
          }
        }
        /* readout */
        var used = S.ns.slice(0, c), same = used.every(function (n) { return n === used[0]; }), ks = S.sh.slice(0, c).map(function (a) { return a.length; });
        var tot = ks.reduce(function (a, b) { return a + b; }, 0);
        if (!tot) { api.readout('<span>Shaded: <b>0</b></span>'); return; }
        if (same) api.readout('<span>Shaded: <b>' + fracWords(tot, used[0]) + '</b></span>');
        else {
          var L = used.reduce(lcm), sum = 0, parts = [];
          ks.forEach(function (k, i) { if (k) { parts.push(O.frac(k, used[i])); sum += k * L / used[i]; } });
          api.readout('<span>Shaded: <b>' + parts.join(' + ') + ' = ' + fracWords(sum, L) + '</b></span>');
        }
      }
      api.onRedraw(draw);
    }
  });

  /* ═════════ DECIMAL GRID ═════════ */
  var DLEN = { t: 10, h: 100, th: 1000 }, DDP = { t: 1, h: 2, th: 3 };
  function encBits(a) { var s = ''; for (var i = 0; i < a.length; i += 4) s += ((a[i] ? 8 : 0) | (a[i + 1] ? 4 : 0) | (a[i + 2] ? 2 : 0) | (a[i + 3] ? 1 : 0)).toString(16); return s.replace(/0+$/, ''); }
  function decBits(s, L) { var a = new Array(L).fill(0); s = s || ''; for (var i = 0; i < s.length; i++) { var v = parseInt(s[i], 16) || 0; for (var b = 0; b < 4; b++) if (i * 4 + b < L) a[i * 4 + b] = (v >> (3 - b)) & 1; } return a; }
  O.register('decgrid', {
    defaults: { m: 'h', c: 1, sh: ['', '', ''], pct: 0 },
    mount: function (api) {
      var S = api.S, bits;
      function load() { bits = [0, 1, 2].map(function (i) { return decBits(S.sh[i], DLEN[S.m]); }); }
      function sync() { S.sh = bits.map(encBits); }
      load();
      api.say('Tap or drag across the squares to shade them. One whole grid is 1.');
      api.seg('Grid', 'm', [['t', 'Tenths'], ['h', 'Hundredths'], ['th', 'Thousandths']], function () { S.sh = ['', '', '']; load(); });
      api.num('How many grids', 'c', 1, 3, 1);
      api.heading('Start with a number');
      inputRow(api, 'like 0.35 or 1.4', 'Decimal to shade', function (t) {
        t = String(t).replace(/[\s,]/g, ''); if (!/^\d*\.?\d+$/.test(t)) { O.toast('Type a decimal like 0.35'); return; }
        var dp = DDP[S.m], fp = (t.split('.')[1] || '').replace(/0+$/, '');
        if (fp.length > dp) { O.toast('Pick the ' + (fp.length === 2 ? 'hundredths' : 'thousandths') + ' grid for that number.'); return; }
        var L = DLEN[S.m], u = Math.round(parseFloat(t) * L);
        if (u > 3 * L) { O.toast('That is more than 3 grids.'); return; }
        S.c = Math.max(S.c, Math.ceil(u / L) || 1); var cIn = api.setup.querySelector('input[type=number]'); if (cIn) cIn.value = S.c;
        bits = [0, 1, 2].map(function (g) { var a = new Array(L).fill(0); for (var i = 0; i < L; i++) if (g * L + i < u) a[i] = 1; return a; });
        sync(); api.redraw();
      });
      api.check('Show percent too', 'pct');
      api.button('Clear shading', function () { S.sh = ['', '', '']; load(); api.redraw(); }, '', api.row());

      var holder = O.el('div'); api.stage.appendChild(holder);
      var GS = 300, GAP = 34, M = 8;
      function cellRect(m, i) { /* returns x,y,w,h inside one grid for index i (column by column) */
        if (m === 't') return [i * 30, 0, 30, 300];
        if (m === 'h') return [Math.floor(i / 10) * 30, (i % 10) * 30, 30, 30];
        var cell = Math.floor(i / 10), b = i % 10; return [Math.floor(cell / 10) * 30 + b * 3, (cell % 10) * 30, 3, 30];
      }
      function hit(x, y) {
        for (var g = 0; g < S.c; g++) {
          var ox = M + g * (GS + GAP), lx = x - ox, ly = y - M; if (lx < 0 || lx >= GS || ly < 0 || ly >= GS) continue;
          var col = Math.floor(lx / 30), row = Math.floor(ly / 30);
          if (S.m === 't') return [g, col]; if (S.m === 'h') return [g, col * 10 + row];
          return [g, (col * 10 + row) * 10 + Math.floor((lx - col * 30) / 3)];
        }
        return null;
      }
      function draw() {
        holder.innerHTML = '';
        var W = S.c * GS + (S.c - 1) * GAP + 2 * M, v = O.svg(W, GS + 2 * M + 26, holder, 'Decimal grid'); v.style.width = '100%'; v.style.maxWidth = (S.c * 400) + 'px';
        for (var g = 0; g < S.c; g++) {
          var ox = M + g * (GS + GAP), oy = M, b = bits[g];
          O.s('rect', { x: ox, y: oy, width: GS, height: GS, fill: '#fff', class: 'paper' }, v);
          for (var i = 0; i < b.length; i++) if (b[i]) { var r = cellRect(S.m, i); O.s('rect', { x: ox + r[0], y: oy + r[1], width: r[2], height: r[3], fill: '#2F6FDE' }, v); }
          var path = '';
          if (S.m === 'th') for (var k = 3; k < GS; k += 3) if (k % 30) path += 'M' + (ox + k) + ',' + oy + 'v' + GS;
          var thin = O.s('path', { d: path, stroke: '#DDE2EE', 'stroke-width': .6 }, v); thin.style.pointerEvents = 'none';
          var p2 = ''; for (var j = 30; j < GS; j += 30) { p2 += 'M' + (ox + j) + ',' + oy + 'v' + GS; if (S.m !== 't') p2 += 'M' + ox + ',' + (oy + j) + 'h' + GS; }
          O.s('path', { d: p2, stroke: S.m === 'th' ? '#8E98B3' : '#AEB6CC', 'stroke-width': 1.3 }, v);
          O.s('rect', { x: ox, y: oy, width: GS, height: GS, fill: 'transparent', stroke: NAVY, 'stroke-width': 3, class: 'inks', 'data-drag': 'paint', style: 'cursor:crosshair' }, v);
          var k2 = b.reduce(function (a, c) { return a + c; }, 0);
          O.s('text', { x: ox + GS / 2, y: oy + GS + 22, 'text-anchor': 'middle', 'font-size': 15, fill: MUTE, class: 'om-num ink', text: k2 === DLEN[S.m] ? '1 whole' : k2 + ' of ' + DLEN[S.m] }, v);
        }
        var L = DLEN[S.m], dp = DDP[S.m], u = 0; for (var g2 = 0; g2 < S.c; g2++) u += bits[g2].reduce(function (a, c) { return a + c; }, 0);
        var str = String(u); while (str.length <= dp) str = '0' + str; var dec = str.slice(0, -dp) + '.' + str.slice(-dp);
        var ones = Math.floor(u / L), rest = u - ones * L, pv = [];
        if (ones) pv.push(ones + (ones === 1 ? ' one' : ' ones'));
        var names = [['tenth', 'tenths'], ['hundredth', 'hundredths'], ['thousandth', 'thousandths']];
        for (var q = 0; q < dp; q++) { var dg = Math.floor(rest / Math.pow(10, dp - 1 - q)) % 10; pv.push(dg + ' ' + names[q][dg === 1 ? 0 : 1]); }
        var fr = u >= L && u % L === 0 ? String(u / L) : (u > L ? O.mixed(u, L) + ' = ' + O.frac(u, L) : O.frac(u, L));
        var pctS = S.pct ? '<span>Percent: <b>' + Number((u / L * 100).toFixed(1)) + '%</b></span>' : '';
        api.readout('<span>Decimal: <b>' + dec + '</b></span><span>Fraction: <b>' + (u ? fr : '0') + '</b></span>' + pctS + '<span>' + pv.join(', ') + '</span>');
      }
      var raf = 0;
      dragOn(holder, function (e) {
        var p = P(holder, e), h = hit(p.x, p.y); if (!h) return null;
        var val = bits[h[0]][h[1]] ? 0 : 1; bits[h[0]][h[1]] = val; draw();
        return { move: function (ev) { var q = P(holder, ev), hh = hit(q.x, q.y); if (hh && bits[hh[0]][hh[1]] !== val) { bits[hh[0]][hh[1]] = val; if (!raf) raf = requestAnimationFrame(function () { raf = 0; draw(); }); } },
          end: function () { sync(); api.redraw(); } };
      });
      api.onRedraw(draw);
    }
  });

  /* ═════════ COINS & BILLS ═════════ */
  var CASH = [[2000, '$20'], [1000, '$10'], [500, '$5'], [100, '$1'], [25, '25¢'], [10, '10¢'], [5, '5¢'], [1, '1¢']];
  var COIN = { 25: [22, 'quarter'], 10: [15, 'dime'], 5: [19, 'nickel'], 1: [16.5, 'penny'] };
  function drawCash(p, val, x, y) { /* x,y = top-left; returns width used */
    var g = O.s('g', {}, p);
    if (val >= 100) {
      O.s('rect', { x: x, y: y, width: 100, height: 48, rx: 5, fill: '#DCEFD8', stroke: '#2F7D4B', 'stroke-width': 2 }, g);
      O.s('rect', { x: x + 5, y: y + 5, width: 90, height: 38, rx: 3, fill: 'none', stroke: '#7FB98A', 'stroke-width': 1 }, g);
      O.s('ellipse', { cx: x + 50, cy: y + 24, rx: 15, ry: 15, fill: '#BFE0BF', stroke: '#2F7D4B', 'stroke-width': 1 }, g);
      O.s('text', { x: x + 50, y: y + 30, 'text-anchor': 'middle', 'font-size': 16, fill: '#1E5A33', text: String(val / 100) }, g);
      O.s('text', { x: x + 9, y: y + 18, 'font-size': 11, fill: '#1E5A33', text: String(val / 100) }, g);
      O.s('text', { x: x + 91, y: y + 41, 'text-anchor': 'end', 'font-size': 11, fill: '#1E5A33', text: String(val / 100) }, g);
      return [g, 104];
    }
    var r = COIN[val][0], cx = x + r, cy = y + 24, cu = val === 1;
    O.s('circle', { cx: cx, cy: cy, r: r, fill: cu ? '#C77B3B' : '#CDD2DA', stroke: cu ? '#8C4F1E' : '#7E8794', 'stroke-width': 2 }, g);
    O.s('circle', { cx: cx, cy: cy, r: r - 3.5, fill: 'none', stroke: cu ? '#E3A46F' : '#EEF1F5', 'stroke-width': 1.2 }, g);
    O.s('text', { x: cx, y: cy + (r > 16 ? 5 : 4), 'text-anchor': 'middle', 'font-size': r > 18 ? 13 : 11, fill: cu ? '#fff' : '#27303F', text: val + '¢' }, g);
    return [g, 2 * r + 6];
  }
  O.register('money', {
    defaults: { it: [], mode: 'count', pr: 3.65, pd: 5 },
    mount: function (api) {
      var S = api.S;
      api.seg('What to do', 'mode', [['count', 'Count money'], ['change', 'Make change']], function (m) { showG(chG, m === 'change'); });
      var chG = grp(api, function () { api.num('Price ($)', 'pr', 0.01, 100, 0.01); api.num('Paid ($)', 'pd', 0.01, 100, 0.01); });
      showG(chG, S.mode === 'change');
      api.button('Clear the mat', function () { S.it = []; api.redraw(); }, '', api.row());

      var holder = O.el('div'); api.stage.appendChild(holder);
      function draw() {
        holder.innerHTML = '';
        if (S.mode === 'change') api.say('The price is <b>' + money(Math.round(S.pr * 100)) + '</b>. You paid <b>' + money(Math.round(S.pd * 100)) + '</b>. Count up from the price and put the change on the mat.');
        else api.say('Tap money in the tray to put it on the mat. Tap money on the mat to take it off.');
        S.it.sort(function (a, b) { return b - a; });
        var W = Math.max(360, Math.min(760, api.stage.clientWidth || 700)), rowH = 56;
        function flow(list, x0, y0, gap) { var x = x0, y = y0, pos = []; list.forEach(function (val) { var w = val >= 100 ? 104 : 2 * COIN[val][0] + 6; if (x + w > W - 12) { x = x0; y += rowH; } pos.push([x, y]); x += w + gap; }); return { pos: pos, bottom: y + rowH }; }
        var tray = flow(CASH.map(function (c) { return c[0]; }), 14, 26, 6), matTop = tray.bottom + 12;
        var mat = flow(S.it, 16, matTop + 26, 0);
        var H = Math.max(mat.bottom + 14, matTop + 170);
        var v = O.svg(W, H, holder, 'Coins and bills');
        O.s('rect', { x: 4, y: 4, width: W - 8, height: tray.bottom - 2, rx: 12, fill: '#F1F3F8', stroke: LINE, 'stroke-width': 2 }, v);
        O.s('text', { x: 14, y: 20, 'font-size': 12, fill: MUTE, class: 'ink', text: 'TRAY' }, v);
        CASH.forEach(function (c, i) { var r = drawCash(v, c[0], tray.pos[i][0], tray.pos[i][1]); var lab = c[0] >= 100 ? 'a ' + c[1] + ' bill' : 'a ' + COIN[c[0]][1]; O.tap(r[0], function () { if (S.it.length >= 60) { O.toast('The mat is full.'); return; } S.it.push(c[0]); api.redraw(); }, 'Add ' + lab); });
        O.s('rect', { x: 4, y: matTop, width: W - 8, height: H - matTop - 4, rx: 12, fill: '#fff', stroke: LINE, 'stroke-width': 2, class: 'paper' }, v);
        O.s('text', { x: 14, y: matTop + 18, 'font-size': 12, fill: MUTE, class: 'ink', text: 'MAT' }, v);
        var pos = mat.pos;
        S.it.forEach(function (val, i) { var r = drawCash(v, val, pos[i][0], pos[i][1]); O.tap(r[0], function () { S.it.splice(i, 1); api.redraw(); }, 'Take off ' + (val >= 100 ? 'a $' + val / 100 + ' bill' : 'a ' + COIN[val][1])); });
        var tot = S.it.reduce(function (a, b) { return a + b; }, 0);
        var out = '<span>On the mat: <b>' + money(tot) + '</b></span><span>' + tot.toLocaleString('en-US') + (tot === 1 ? ' cent' : ' cents') + '</span>';
        if (S.mode === 'change') {
          var ch = Math.round(S.pd * 100) - Math.round(S.pr * 100);
          if (ch < 0) out += '<span>The amount paid must be more than the price.</span>';
          else if (tot === ch) out += '<span style="color:' + GRN + '">You made ' + money(ch) + ' in change. ✓</span>';
          else if (tot < ch) out += '<span>Keep going.</span>';
          else out += '<span>That is more than the change. Take some away.</span>';
        }
        api.readout(out);
      }
      api.onRedraw(draw);
    }
  });

  /* ═════════ RULERS & MEASURING TAPE ═════════ */
  var RU = { cm: { max: 15, step: 0.1, a: 0, len: 7.5, nz: 2 }, m: { max: 100, step: 1, a: 0, len: 64, nz: 20 }, 'in': { max: 12, a: 0, len: 4.5, nz: 2 }, yd: { max: 36, step: 1, a: 0, len: 27, nz: 6 } };
  O.register('ruler', {
    defaults: { u: 'cm', q: 4, a: 0, b: 7.5, len: 7.5, nz: 0 },
    mount: function (api) {
      var S = api.S;
      function step() { return S.u === 'in' ? 1 / S.q : RU[S.u].step; }
      function snap(x) { var s = step(); return Math.round(Math.round(x / s) * s * 1000) / 1000; }
      function place() { var c = rc(); S.a = S.nz ? c.nz : 0; S.b = Math.min(c.max, snap(S.a + S.len)); if (S.b <= S.a) S.b = snap(S.a + step()); }
      api.say('Drag the ribbon or its round ends. Read the length on the ruler.');
      api.seg('Ruler', 'u', [['cm', 'Centimeters'], ['m', 'Meter stick'], ['in', 'Inches'], ['yd', 'Yard stick']], function (u) { S.len = RU[u].len; lenIn.value = S.len; place(); showG(qG, u === 'in'); });
      var qG = grp(api, function () { api.seg('Inch marks', 'q', [[2, '½'], [4, '¼'], [8, '⅛']], function () { S.a = snap(S.a); S.b = snap(S.b); }); });
      showG(qG, S.u === 'in');
      var lenIn = api.num('Ribbon length (in the ruler’s unit)', 'len', 0.1, 100, 'any', function () { S.len = snap(S.len); place(); });
      api.check('Start the ribbon at a mark that isn’t 0', 'nz', place);
      var holder = O.el('div'); api.stage.appendChild(holder);
      var W = 760, MX = 36, UW = W - 2 * MX;
      function narrow() { var w = api.stage.clientWidth; return w > 0 && w < 560; }
      function rc() { var c = Object.assign({}, RU[S.u]); if (narrow()) { if (S.u === 'cm') c.max = 10; if (S.u === 'in') c.max = 6; } return c; }
      function draw() {
        holder.innerHTML = '';
        W = narrow() ? 470 : 760; UW = W - 2 * MX; var c = rc();
        if (S.b > c.max) { var ln = S.b - S.a; S.b = c.max; S.a = Math.max(0, snap(c.max - ln)); }
        var k = UW / c.max, X = function (u) { return MX + u * k; };
        var v = O.svg(W, 210, holder, 'Ruler'); v.style.width = '100%';
        var wood = S.u === 'm' || S.u === 'yd';
        O.s('rect', { x: MX - 22, y: 104, width: UW + 44, height: 86, rx: 6, fill: wood ? '#F6DE94' : '#EAF3FF', stroke: wood ? '#B8902A' : '#8FB2DA', 'stroke-width': 2 }, v);
        var ticks = '';
        function tk(u, h) { ticks += 'M' + X(u).toFixed(2) + ',104v' + h; }
        function lab(u, t, fs) { O.s('text', { x: X(u), y: 104 + 46, 'text-anchor': 'middle', 'font-size': fs || 14, fill: NAVY, text: t }, v); }
        if (S.u === 'cm') { for (var i = 0; i <= c.max * 10; i++) { tk(i / 10, i % 10 === 0 ? 28 : i % 5 === 0 ? 18 : 11); if (i % 10 === 0) lab(i / 10, String(i / 10)); } O.s('text', { x: MX - 14, y: 182, 'font-size': 12, fill: MUTE, text: 'cm' }, v); }
        else if (S.u === 'm') { for (var j = 0; j <= 100; j++) { tk(j, j % 10 === 0 ? 30 : j % 5 === 0 ? 20 : 11); if (j % 10 === 0) lab(j, String(j), 13); } O.s('text', { x: MX - 14, y: 182, 'font-size': 12, fill: MUTE, text: 'cm' }, v); }
        else if (S.u === 'in') { for (var n = 0; n <= c.max * S.q; n++) { var f = n / S.q, h = n % S.q === 0 ? 30 : (n * 2) % S.q === 0 ? 22 : (n * 4) % S.q === 0 ? 15 : 10; tk(f, h); if (n % S.q === 0) lab(f, String(f), 15); } O.s('text', { x: MX - 14, y: 182, 'font-size': 12, fill: MUTE, text: 'in' }, v); }
        else { for (var y = 0; y <= 36; y++) { tk(y, y % 12 === 0 ? 34 : y % 6 === 0 ? 22 : 13); if (y % 12 === 0 && y) { O.s('text', { x: X(y), y: 104 + 52, 'text-anchor': 'middle', 'font-size': 15, fill: '#7A5230', text: (y / 12) + ' ft' }, v); } else if (y % 12) lab(y, String(y), 11); } O.s('text', { x: MX - 14, y: 182, 'font-size': 12, fill: MUTE, text: 'in' }, v); }
        O.s('path', { d: ticks, stroke: NAVY, 'stroke-width': 1.4 }, v);
        /* ribbon */
        var xa = X(S.a), xb = X(S.b);
        O.s('path', { d: 'M' + xa + ',72V104M' + xb + ',72V104', stroke: VIO, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }, v);
        var body = O.s('rect', { x: xa, y: 44, width: Math.max(2, xb - xa), height: 28, rx: 5, fill: VIO, 'data-drag': 'body', style: 'cursor:grab' }, v);
        O.s('rect', { x: xa, y: 44, width: Math.max(2, xb - xa), height: 9, rx: 4, fill: '#8C6BE0', 'pointer-events': 'none' }, v);
        [['a', xa], ['b', xb]].forEach(function (hh) {
          var g = O.s('g', { 'data-drag': hh[0], style: 'cursor:ew-resize' }, v);
          O.s('circle', { cx: hh[1], cy: 58, r: 20, fill: 'transparent', 'data-drag': hh[0] }, g);
          O.s('circle', { cx: hh[1], cy: 58, r: 11, fill: YEL, stroke: NAVY, 'stroke-width': 2, 'data-drag': hh[0] }, g);
          keys(g, function (d) { var s = step(); if (hh[0] === 'a') S.a = O.clamp(snap(S.a + d * s), 0, S.b - s); else S.b = O.clamp(snap(S.b + d * s), S.a + s, c.max); api.redraw(); }, hh[0] === 'a' ? 'Left end of ribbon' : 'Right end of ribbon');
        });
        /* readout */
        var L = Math.round((S.b - S.a) * 1000) / 1000, r;
        if (S.u === 'cm') { var mm = Math.round(L * 10); r = '<b>' + O.fmt(L, 1) + ' cm</b>' + (mm % 10 ? ' = ' + Math.floor(mm / 10) + ' cm ' + (mm % 10) + ' mm = ' + mm + ' mm' : ''); }
        else if (S.u === 'm') r = '<b>' + L + ' cm</b>' + (L === 100 ? ' = 1 m' : '');
        else if (S.u === 'in') { var nn = Math.round(L * S.q), g = O.gcd(nn, S.q); r = '<b>' + O.mixed(nn / g, S.q / g) + ' in</b>'; }
        else r = '<b>' + L + ' in</b>' + (L >= 12 ? ' = ' + Math.floor(L / 12) + ' ft' + (L % 12 ? ' ' + (L % 12) + ' in' : '') : '');
        function at(u) { if (S.u === 'in') { var n2 = Math.round(u * S.q), g2 = O.gcd(n2, S.q); return O.mixed(n2 / g2, S.q / g2); } return O.fmt(u, 1); }
        api.readout('<span>Length: ' + r + '</span>' + (S.a ? '<span>From ' + at(S.a) + ' to ' + at(S.b) + ' ' + (S.u === 'cm' ? 'cm' : S.u === 'm' ? 'cm' : 'in') + '</span>' : ''));
      }
      dragOn(holder, function (e, t) {
        var which = t.getAttribute('data-drag'), c = rc(), k = UW / c.max, p0 = P(holder, e), a0 = S.a, b0 = S.b, s = step();
        return { move: function (ev) {
          var p = P(holder, ev), u = (p.x - MX) / k;
          if (which === 'a') S.a = O.clamp(snap(u), 0, S.b - s);
          else if (which === 'b') S.b = O.clamp(snap(u), S.a + s, c.max);
          else { var d = snap((p.x - p0.x) / k); d = O.clamp(d, -a0, c.max - b0); S.a = snap(a0 + d); S.b = snap(b0 + d); }
          draw();
        }, end: function () { api.redraw(); } };
      });
      api.onRedraw(draw);
    }
  });

  /* ═════════ SCALE & BALANCE ═════════ */
  var WTS = [1, 2, 5, 10, 20, 50, 100, 500, 1000];
  function wLabel(g) { return g >= 1000 ? g / 1000 + ' kg' : g + ' g'; }
  function kgg(g) { var k = Math.floor(g / 1000), r = g % 1000; return k ? k + ' kg' + (r ? ' ' + r + ' g' : '') : r + ' g'; }
  function lboz(o) { var l = Math.floor(o / 16), r = o % 16; return l ? l + ' lb' + (r ? ' ' + r + ' oz' : '') : r + ' oz'; }
  O.register('scale', {
    defaults: { m: 'dial', u: 'kg', mx: 5, tk: 100, w: 2400, bw: 350, L: [] },
    mount: function (api) {
      var S = api.S;
      function wMax() { return S.u === 'kg' ? S.mx * 1000 : S.mx * 16; }
      api.seg('Tool', 'm', [['dial', 'Scale'], ['bal', 'Balance']], function () { vis(); });
      var kgMax, kgTk, lbMax, lbTk, wIn;
      var dG = grp(api, function () {
        api.seg('Units', 'u', [['kg', 'kg and g'], ['lb', 'lb and oz']], function (u) {
          if (u === 'kg') { S.mx = 5; S.tk = 100; S.w = 2400; } else { S.mx = 5; S.tk = 2; S.w = 38; }
          kgMax.value = lbMax.value = S.mx; kgTk.value = lbTk.value = S.tk; wIn.value = S.w; vis();
        });
        kG = grp(api, function () {
          kgMax = api.select('Biggest weight', 'mx', [[1, '1 kg'], [5, '5 kg'], [10, '10 kg']], function () { S.w = Math.min(S.w, wMax()); });
          kgTk = api.select('Small marks every', 'tk', [[10, '10 g'], [20, '20 g'], [50, '50 g'], [100, '100 g'], [200, '200 g'], [500, '500 g']]);
        });
        lG = grp(api, function () {
          lbMax = api.select('Biggest weight', 'mx', [[1, '1 lb'], [5, '5 lb'], [11, '11 lb']], function () { S.w = Math.min(S.w, wMax()); });
          lbTk = api.select('Small marks every', 'tk', [[1, '1 oz'], [2, '2 oz'], [4, '4 oz'], [8, '8 oz']]);
        });
        wIn = api.num('Weight on the scale (grams, or ounces for lb)', 'w', 0, 10000, 1, function () { S.w = Math.min(S.w, wMax()); });
      });
      var kG, lG;
      var bG = grp(api, function () { api.num('Mystery box weight (grams)', 'bw', 1, 5000, 1); api.button('Take all weights off', function () { S.L = []; api.redraw(); }, '', api.row()); });
      function vis() { showG(dG, S.m === 'dial'); showG(bG, S.m === 'bal'); if (S.m === 'dial') { showG(kG, S.u === 'kg'); showG(lG, S.u === 'lb'); } }
      vis();

      var holder = O.el('div'); api.stage.appendChild(holder);
      var CX = 200, CY = 230, R = 150;
      function draw() {
        holder.innerHTML = '';
        if (S.m === 'dial') {
          api.say('Read the scale. You can drag the red pointer too.');
          var mx = wMax(), tk = S.tk, nT = mx / tk; if (nT > 200) tk = tk * Math.ceil(nT / 200);
          var major = S.u === 'kg' ? (S.mx === 1 ? 100 : 1000) : (S.mx === 1 ? 4 : 16);
          var v = O.svg(400, 400, holder, 'Platform scale'); v.style.width = '100%'; v.style.maxWidth = '460px';
          O.s('rect', { x: 60, y: 22, width: 280, height: 22, rx: 6, fill: '#AEB6CC' }, v);
          O.s('rect', { x: 190, y: 44, width: 20, height: 22, fill: '#AEB6CC' }, v);
          if (S.w > 0) { O.s('rect', { x: 150, y: -6, width: 100, height: 28, rx: 3, fill: '#D9A35F', stroke: '#9A6A2E', 'stroke-width': 2 }, v); }
          O.s('rect', { x: 30, y: 62, width: 340, height: 330, rx: 40, fill: '#E7EAF2', stroke: '#AEB6CC', 'stroke-width': 3 }, v);
          O.s('circle', { cx: CX, cy: CY, r: R + 8, fill: '#fff', stroke: NAVY, 'stroke-width': 3, class: 'paper' }, v);
          var tp = '';
          for (var q = 0; q < mx; q += tk) { var a = q / mx * 2 * Math.PI, isM = q % major === 0, ln = isM ? 18 : 9; tp += 'M' + (CX + R * Math.sin(a)).toFixed(1) + ',' + (CY - R * Math.cos(a)).toFixed(1) + 'L' + (CX + (R - ln) * Math.sin(a)).toFixed(1) + ',' + (CY - (R - ln) * Math.cos(a)).toFixed(1); }
          O.s('path', { d: tp, stroke: NAVY, 'stroke-width': 1.6, class: 'inks' }, v);
          for (var m = 0; m < mx; m += major) {
            var aa = m / mx * 2 * Math.PI, t = S.u === 'kg' ? (S.mx === 1 ? (m ? String(m) : '0') : m / 1000 + (m ? ' kg' : '')) : (S.mx === 1 ? (m ? m + ' oz' : '0') : m / 16 + (m ? ' lb' : ''));
            O.s('text', { x: CX + (R - 36) * Math.sin(aa), y: CY - (R - 36) * Math.cos(aa) + 5, 'text-anchor': 'middle', 'font-size': 14, fill: NAVY, class: 'ink', text: m === 0 ? (S.u === 'kg' ? '0 ' + (S.mx === 1 ? '1 kg' : '') : '0') : t }, v);
          }
          if (S.u === 'kg' && S.mx === 1) O.s('text', { x: CX, y: CY + 42, 'text-anchor': 'middle', 'font-size': 13, fill: MUTE, text: 'grams' }, v);
          var ang = Math.min(S.w, mx) / mx * 2 * Math.PI, px = CX + (R - 6) * Math.sin(ang), py = CY - (R - 6) * Math.cos(ang);
          var pg = O.s('g', { 'data-drag': 'p', style: 'cursor:grab' }, v);
          O.s('line', { x1: CX, y1: CY, x2: px, y2: py, stroke: 'transparent', 'stroke-width': 26, 'data-drag': 'p' }, pg);
          O.s('line', { x1: CX, y1: CY, x2: px, y2: py, stroke: '#D2453B', 'stroke-width': 4, 'stroke-linecap': 'round', 'data-drag': 'p' }, pg);
          O.s('circle', { cx: CX, cy: CY, r: 9, fill: '#D2453B' }, v);
          keys(pg, function (d) { S.w = O.clamp(S.w + d * S.tk, 0, mx); api.redraw(); }, 'Scale pointer');
          api.readout('<span>Weight: <b>' + (S.u === 'kg' ? kgg(S.w) : lboz(S.w)) + '</b></span><span>= ' + (S.u === 'kg' ? S.w.toLocaleString('en-US') + ' g' : S.w + ' oz') + '</span>');
        } else {
          api.say('Tap weights to put them on the right pan. Make the pans balance to find the weight of the box.');
          var nw = api.stage.clientWidth > 0 && api.stage.clientWidth < 560, BW2 = nw ? 440 : 700, MID = BW2 / 2, ARM = nw ? 150 : 210, per = nw ? 5 : 9, TRY = 292, TH = nw ? 136 : 80;
          var v2 = O.svg(BW2, TRY + TH + 8, holder, 'Pan balance'); v2.style.width = '100%';
          var left = S.bw, right = S.L.reduce(function (a, b) { return a + b; }, 0);
          var th = left === right ? 0 : O.clamp((right - left) / Math.max(left, right) * 16, -14, 14), rad = th * Math.PI / 180;
          O.s('path', { d: 'M' + MID + ',120L' + (MID - 30) + ',250H' + (MID + 30) + 'Z', fill: '#AEB6CC' }, v2);
          O.s('rect', { x: MID - 80, y: 248, width: 160, height: 12, rx: 4, fill: '#8E98B3' }, v2);
          var ex = ARM * Math.cos(rad), ey = ARM * Math.sin(rad);
          O.s('line', { x1: MID - ex, y1: 120 - ey, x2: MID + ex, y2: 120 + ey, stroke: NAVY, 'stroke-width': 8, 'stroke-linecap': 'round', class: 'inks' }, v2);
          O.s('circle', { cx: MID, cy: 120, r: 8, fill: YEL }, v2);
          O.s('line', { x1: MID, y1: 104, x2: MID + 26 * Math.sin(rad), y2: 104 - 26 * Math.cos(rad), stroke: '#D2453B', 'stroke-width': 3 }, v2);
          function pan(x, y) { O.s('path', { d: 'M' + x + ',' + y + 'L' + (x - 60) + ',' + (y + 70) + 'M' + x + ',' + y + 'L' + (x + 60) + ',' + (y + 70), stroke: MUTE, 'stroke-width': 1.5 }, v2); O.s('path', { d: 'M' + (x - 78) + ',' + (y + 70) + 'H' + (x + 78) + 'l-14,16H' + (x - 64) + 'Z', fill: '#C9CFDF', stroke: MUTE, 'stroke-width': 2 }, v2); return y + 70; }
          var ly = pan(MID - ex, 120 - ey), ry = pan(MID + ex, 120 + ey), lx = MID - ex, rx = MID + ex;
          O.s('rect', { x: lx - 34, y: ly - 54, width: 68, height: 54, rx: 4, fill: '#D9A35F', stroke: '#9A6A2E', 'stroke-width': 2 }, v2);
          O.s('text', { x: lx, y: ly - 18, 'text-anchor': 'middle', 'font-size': 28, fill: '#5A3A12', text: '?' }, v2);
          var sorted = S.L.slice().sort(function (a, b) { return b - a; }), wx = 0, wy = 0;
          sorted.forEach(function (g) {
            var w = g >= 500 ? 40 : g >= 50 ? 32 : 24, h = g >= 500 ? 26 : g >= 50 ? 20 : 15;
            if (wx + w > 140) { wx = 0; wy += 26; }
            var x0 = rx - 70 + wx, y0 = ry - h - wy, gg = O.s('g', {}, v2);
            O.s('rect', { x: x0, y: y0, width: w - 2, height: h, rx: 3, fill: '#B8BFCC', stroke: '#5B6478', 'stroke-width': 1.5 }, gg);
            O.s('text', { x: x0 + w / 2 - 1, y: y0 + h / 2 + 4, 'text-anchor': 'middle', 'font-size': g >= 100 ? 9 : 10, fill: '#1B2238', text: wLabel(g) }, gg);
            O.tap(gg, function () { var i = S.L.indexOf(g); if (i > -1) S.L.splice(i, 1); api.redraw(); }, 'Take off ' + wLabel(g));
            wx += w;
          });
          O.s('rect', { x: 10, y: TRY, width: BW2 - 20, height: TH, rx: 12, fill: '#F1F3F8', stroke: LINE, 'stroke-width': 2 }, v2);
          O.s('text', { x: 20, y: TRY + 16, 'font-size': 12, fill: MUTE, text: 'WEIGHTS' }, v2);
          var colW = (BW2 - 40) / per;
          WTS.forEach(function (g, i) {
            var cx = 20 + colW * (i % per) + colW / 2, base = TRY + 68 + Math.floor(i / per) * 56, gg = O.s('g', {}, v2), h = g >= 500 ? 40 : g >= 50 ? 32 : 26, w = Math.min(colW - 8, g >= 500 ? 62 : g >= 50 ? 54 : 46);
            O.s('rect', { x: cx - w / 2, y: base - h, width: w, height: h, rx: 5, fill: '#B8BFCC', stroke: '#5B6478', 'stroke-width': 2 }, gg);
            O.s('text', { x: cx, y: base - h / 2 + 5, 'text-anchor': 'middle', 'font-size': 13, fill: '#1B2238', text: wLabel(g) }, gg);
            O.tap(gg, function () { if (S.L.length >= 24) { O.toast('The pan is full.'); return; } S.L.push(g); api.redraw(); }, 'Put ' + wLabel(g) + ' on the right pan');
          });
          var msg = left === right ? '<span style="color:' + GRN + '">Balanced! The box weighs ' + kgg(left) + '.</span>' : left > right ? '<span>The box is heavier. Add more weights.</span>' : '<span>The weights are heavier. Take some off.</span>';
          api.readout('<span>Weights on the pan: <b>' + kgg(right) + '</b></span>' + msg);
        }
      }
      dragOn(holder, function () {
        return { move: function (e) {
          var p = P(holder, e), a = Math.atan2(p.x - CX, CY - p.y); if (a < 0) a += 2 * Math.PI;
          var mx = wMax(), w = Math.round(a / (2 * Math.PI) * mx / S.tk) * S.tk;
          if (Math.abs(w - S.w) > mx / 2) w = S.w > mx / 2 ? mx : 0;
          S.w = O.clamp(w, 0, mx); wIn.value = S.w; draw();
        }, end: function () { api.redraw(); } };
      });
      api.onRedraw(draw);
    }
  });

  /* ═════════ BEAKERS & MEASURING CUPS ═════════ */
  function cupText(c) { var n = Math.round(c * 4), g = O.gcd(n, 4); return n ? O.mixed(n / g, 4 / g) : '0'; }
  O.register('beaker', {
    defaults: { u: 'ml', mx: 1000, tk: 100, c: 1, a0: 400, a1: 0 },
    mount: function (api) {
      var S = api.S, mlMx, mlTk, cupTk, qtTk, a0In, a1In;
      api.say('Drag up or down inside a beaker to fill it. Read the marks on the side.');
      api.seg('Units', 'u', [['ml', 'Milliliters'], ['cup', 'Cups'], ['qt', 'Gallon jug']], function (u) {
        if (u === 'ml') { S.mx = 1000; S.tk = 100; S.a0 = 400; } else if (u === 'cup') { S.mx = 4; S.tk = 0.25; S.a0 = 1.5; } else { S.mx = 4; S.tk = 1; S.a0 = 3; }
        S.a1 = 0; mlMx.value = S.mx; [mlTk, cupTk, qtTk].forEach(function (s) { s.value = S.tk; }); a0In.value = S.a0; a1In.value = 0;
        showG(mG, u === 'ml'); showG(cG, u === 'cup'); showG(qG, u === 'qt');
      });
      var mG = grp(api, function () {
        mlMx = api.select('Biggest amount', 'mx', [[500, '500 mL'], [1000, '1 L (1,000 mL)'], [2000, '2 L (2,000 mL)']], fit);
        mlTk = api.select('Small marks every', 'tk', [[10, '10 mL'], [25, '25 mL'], [50, '50 mL'], [100, '100 mL'], [200, '200 mL']], fit);
      });
      var cG = grp(api, function () { cupTk = api.select('Small marks every', 'tk', [[0.25, '¼ cup'], [0.5, '½ cup']], fit); });
      var qG = grp(api, function () { qtTk = api.select('Small marks every', 'tk', [[0.25, '1 cup'], [0.5, '1 pint'], [1, '1 quart']], fit); });
      showG(mG, S.u === 'ml'); showG(cG, S.u === 'cup'); showG(qG, S.u === 'qt');
      api.num('How many beakers', 'c', 1, 2, 1);
      a0In = api.num('Amount in A', 'a0', 0, 2000, 'any', fit);
      a1In = api.num('Amount in B', 'a1', 0, 2000, 'any', fit);
      function snap(x) { return Math.round(Math.round(x / S.tk) * S.tk * 1000) / 1000; }
      function fit() { S.a0 = O.clamp(snap(S.a0), 0, S.mx); S.a1 = O.clamp(snap(S.a1), 0, S.mx); }
      function amt(x) {
        if (S.u === 'ml') return '<b>' + x.toLocaleString('en-US') + ' mL</b>' + (x >= 1000 ? ' = ' + Math.floor(x / 1000) + ' L' + (x % 1000 ? ' ' + x % 1000 + ' mL' : '') : '');
        if (S.u === 'cup') { var s = '<b>' + cupText(x) + (x === 1 ? ' cup' : ' cups') + '</b>', q = Math.floor(x / 4), r = x - 4 * q, p = Math.floor(r / 2), cu = r - 2 * p, parts = [];
          if (x >= 2) { if (q) parts.push(q + (q === 1 ? ' quart' : ' quarts')); if (p) parts.push(p + (p === 1 ? ' pint' : ' pints')); if (cu) parts.push(cupText(cu) + (cu === 1 ? ' cup' : ' cups')); s += ' = ' + parts.join(' '); } return s; }
        var cups = Math.round(x * 4); return '<b>' + cupText(x) + (x === 1 ? ' quart' : ' quarts') + '</b> = ' + (x * 2 % 1 ? cupText(x * 2) : x * 2) + ' pints = ' + cups + ' cups' + (x === 4 ? ' = 1 gallon' : '');
      }
      var holder = O.el('div'), btns = O.el('div', { class: 'om-row om-noprint' }); api.stage.appendChild(holder); api.stage.appendChild(btns);
      var GT = 50, GB = 350, BWd = 130;
      function tickLab(q) {
        if (S.u === 'ml') return q === 1000 ? '1 L' : q === 2000 ? '2 L' : q + ' mL';
        if (S.u === 'cup') return q % 1 ? (Math.floor(q) || '') + '½' : q + (q === 1 ? ' cup' : ' cups');
        return q === 4 ? '1 gal' : q + ' qt';
      }
      function lv(i) { return i ? S.a1 : S.a0; }
      function setLv(i, x) { x = O.clamp(snap(x), 0, S.mx); if (i) S.a1 = x; else S.a0 = x; (i ? a1In : a0In).value = x; }
      function draw() {
        holder.innerHTML = ''; btns.innerHTML = '';
        var v = O.svg(S.c * 260, 400, holder, 'Beakers'); v.style.width = '100%'; v.style.maxWidth = (S.c * 300) + 'px';
        var nT = S.mx / S.tk, lstep = S.tk; [1, 2, 4, 5, 10, 20].some(function (k) { lstep = S.tk * k; return S.mx / lstep <= 10 && Math.abs(Math.round(S.mx / lstep) - S.mx / lstep) < 1e-9; });
        if (S.u !== 'ml') lstep = S.u === 'cup' ? (S.tk === 0.25 ? 0.5 : 1) : 1;
        for (var i = 0; i < S.c; i++) {
          var ox = i * 260 + 90, H = GB - GT, y = function (x) { return GB - x / S.mx * H; }, jug = S.u === 'qt';
          O.s('rect', { x: ox, y: GT - 10, width: BWd, height: H + 10, rx: jug ? 22 : 4, fill: '#F4FAFF', stroke: '#7E9CC0', 'stroke-width': 3, class: 'paper' }, v);
          var L = lv(i); if (L > 0) O.s('rect', { x: ox + 3, y: y(L), width: BWd - 6, height: GB - y(L) - 2, rx: 3, fill: '#5DB3EA', opacity: .85 }, v);
          if (L > 0) O.s('rect', { x: ox + 3, y: y(L), width: BWd - 6, height: 4, fill: '#2F8FD0' }, v);
          var tp = '';
          for (var k = 0; k <= nT + 1e-9; k++) { var q = Math.round(k * S.tk * 1000) / 1000, isL = Math.abs(q / lstep - Math.round(q / lstep)) < 1e-9; tp += 'M' + ox + ',' + y(q).toFixed(1) + 'h' + (isL ? 26 : 13);
            if (isL && q > 0) O.s('text', { x: ox - 8, y: y(q) + 5, 'text-anchor': 'end', 'font-size': 13, fill: NAVY, class: 'ink', text: tickLab(q) }, v); }
          O.s('path', { d: tp, stroke: NAVY, 'stroke-width': 1.6, class: 'inks' }, v);
          if (jug) O.s('text', { x: ox + BWd / 2, y: GT - 16, 'text-anchor': 'middle', 'font-size': 13, fill: MUTE, text: '1 gallon jug' }, v);
          O.s('text', { x: ox + BWd / 2, y: GB + 34, 'text-anchor': 'middle', 'font-size': 20, fill: NAVY, class: 'ink', text: S.c > 1 ? (i ? 'B' : 'A') : '' }, v);
          var hit = O.s('rect', { x: ox, y: GT - 10, width: BWd, height: H + 14, fill: 'transparent', 'data-drag': String(i), style: 'cursor:ns-resize' }, v);
          (function (i) { keys(hit, function (d) { setLv(i, lv(i) + d * S.tk); api.redraw(); }, 'Water in beaker ' + (i ? 'B' : 'A')); })(i);
        }
        if (S.c > 1) {
          api.button('Pour A into B', function () { var m = Math.min(S.a0, S.mx - S.a1); setLv(0, S.a0 - m); setLv(1, S.a1 + m); api.redraw(); }, '', btns);
          api.button('Pour B into A', function () { var m = Math.min(S.a1, S.mx - S.a0); setLv(1, S.a1 - m); setLv(0, S.a0 + m); api.redraw(); }, '', btns);
        }
        api.button('Empty' + (S.c > 1 ? ' both' : ''), function () { setLv(0, 0); setLv(1, 0); api.redraw(); }, '', btns);
        var out = '<span>' + (S.c > 1 ? 'A: ' : '') + amt(S.a0) + '</span>';
        if (S.c > 1) out += '<span>B: ' + amt(S.a1) + '</span><span>Together: ' + amt(Math.round((S.a0 + S.a1) * 1000) / 1000) + '</span>';
        api.readout(out);
      }
      dragOn(holder, function (e, t) {
        var i = +t.getAttribute('data-drag');
        function at(ev) { var p = P(holder, ev); setLv(i, (GB - p.y) / (GB - GT) * S.mx); draw(); }
        at(e); return { move: at, end: function () { api.redraw(); } };
      });
      api.onRedraw(draw);
    }
  });

  /* ═════════ CLOCK & TIMER ═════════ */
  var timerInt = null;
  function hm(t) { t = ((t % 1440) + 1440) % 1440; var h = Math.floor(t / 60) % 12 || 12, m = t % 60; return h + ':' + (m < 10 ? '0' : '') + m + (t < 720 ? ' a.m.' : ' p.m.'); }
  function dur(e) { var h = Math.floor(e / 60), m = e % 60; return (h ? h + (h === 1 ? ' hour ' : ' hours ') : '') + (m || !h ? m + (m === 1 ? ' minute' : ' minutes') : ''); }
  O.register('clock', {
    defaults: { t: 550, sn: 5, dg: 1, el: 0, st: 480, tmr: 0 },
    mount: function (api) {
      var S = api.S; clearInterval(timerInt); timerInt = null;
      api.say('Drag the long hand or the short hand to set the time.');
      api.heading('Set the clock');
      inputRow(api, 'like 3:45 pm', 'Time to show', function (txt) {
        var m = String(txt).trim().match(/^(\d{1,2}):(\d{2})\s*([ap])?\.?\s*m?\.?$/i); if (!m || +m[1] > 12 || +m[1] < 1 || +m[2] > 59) { O.toast('Type a time like 3:45 pm'); return; }
        var h = +m[1] % 12; if (m[3] && m[3].toLowerCase() === 'p') h += 12; else if (!m[3] && S.t >= 720) h += 12;
        S.t = h * 60 + +m[2]; api.redraw();
      });
      api.seg('The long hand moves by', 'sn', [[5, '5 minutes'], [1, '1 minute']]);
      api.check('Show the digital time', 'dg');
      api.check('Time passed (start time and end time)', 'el');
      api.check('Show the timer', 'tmr');

      var holder = O.el('div'), ctr = O.el('div', { class: 'om-row om-noprint' }), tbox = O.el('div', { class: 'om-noprint' });
      api.stage.appendChild(holder); api.stage.appendChild(ctr); api.stage.appendChild(tbox);
      var CX = 200, CY = 200, R = 180;
      function hand(v, ang, len, w, col, key, cls) {
        var a = ang * Math.PI / 180, x = CX + len * Math.sin(a), y = CY - len * Math.cos(a), g = O.s('g', { 'data-drag': key, style: 'cursor:grab' }, v);
        O.s('line', { x1: CX, y1: CY, x2: x, y2: y, stroke: 'transparent', 'stroke-width': 30, 'data-drag': key }, g);
        O.s('line', { x1: CX, y1: CY, x2: x, y2: y, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'data-drag': key, class: cls || '' }, g);
        return g;
      }
      function draw() {
        holder.innerHTML = ''; ctr.innerHTML = '';
        var v = O.svg(400, 400, holder, 'Clock showing ' + hm(S.t)); v.style.width = '100%'; v.style.maxWidth = '470px';
        O.s('circle', { cx: CX, cy: CY, r: R + 12, fill: VIO }, v);
        O.s('circle', { cx: CX, cy: CY, r: R, fill: '#fff', class: 'paper' }, v);
        if (S.el) {
          var e = ((S.t - S.st) % 1440 + 1440) % 1440;
          if (e > 0 && e <= 60) O.s('path', { d: pie(CX, CY, R - 4, (S.st % 60) * 6, (S.st % 60) * 6 + e * 6), fill: YEL, opacity: .45 }, v);
          else if (e > 60) { var a0 = (S.st % 720) / 2; O.s('path', { d: pie(CX, CY, R * 0.62, a0, a0 + Math.min(e, 720) / 2), fill: GRN, opacity: .3 }, v); }
          var sa = (S.st % 60) * 6 * Math.PI / 180; O.s('line', { x1: CX, y1: CY, x2: CX + (R - 30) * Math.sin(sa), y2: CY - (R - 30) * Math.cos(sa), stroke: '#AEB6CC', 'stroke-width': 4, 'stroke-dasharray': '6 5' }, v);
        }
        var tp = ''; for (var i = 0; i < 60; i++) { var a = i * 6 * Math.PI / 180, l = i % 5 ? 8 : 16; tp += 'M' + (CX + R * Math.sin(a)).toFixed(1) + ',' + (CY - R * Math.cos(a)).toFixed(1) + 'L' + (CX + (R - l) * Math.sin(a)).toFixed(1) + ',' + (CY - (R - l) * Math.cos(a)).toFixed(1); }
        O.s('path', { d: tp, stroke: NAVY, 'stroke-width': 2, class: 'inks' }, v);
        for (var h = 1; h <= 12; h++) { var ah = h * 30 * Math.PI / 180; O.s('text', { x: CX + (R - 40) * Math.sin(ah), y: CY - (R - 40) * Math.cos(ah) + 10, 'text-anchor': 'middle', 'font-size': 30, fill: NAVY, class: 'ink', text: String(h) }, v); }
        var hk = hand(v, (S.t % 720) / 2, R * 0.5, 10, NAVY, 'h', 'inks'), mk = hand(v, (S.t % 60) * 6, R * 0.82, 6, VIO, 'm');
        keys(mk, function (d) { S.t = (S.t + d * S.sn + 1440) % 1440; api.redraw(); }, 'Minute hand'); keys(hk, function (d) { S.t = (S.t + d * 60 + 1440) % 1440; api.redraw(); }, 'Hour hand');
        O.s('circle', { cx: CX, cy: CY, r: 9, fill: YEL, stroke: NAVY, 'stroke-width': 2 }, v);
        /* buttons */
        var ap = O.el('button', { type: 'button', class: 'om-btn small' }, S.t < 720 ? 'a.m. → p.m.' : 'p.m. → a.m.'); ap.onclick = function () { S.t = (S.t + 720) % 1440; api.redraw(); }; ctr.appendChild(ap);
        [[-60, '− 1 hour'], [-S.sn, '− ' + S.sn + ' min'], [S.sn, '+ ' + S.sn + ' min'], [60, '+ 1 hour']].forEach(function (b) { api.button(b[1], function () { S.t = (S.t + b[0] + 1440) % 1440; api.redraw(); }, '', ctr); });
        if (S.el) api.button('Set start time', function () { S.st = S.t; api.redraw(); }, 'green', ctr);
        tbox.style.display = S.tmr ? '' : 'none';
        var out = '';
        if (S.dg) out += '<span>Time: <b>' + hm(S.t) + '</b></span>';
        if (S.el) out += '<span>Start: <b>' + hm(S.st) + '</b></span><span>End: <b>' + hm(S.t) + '</b></span><span>Time passed: <b>' + dur(((S.t - S.st) % 1440 + 1440) % 1440) + '</b></span>';
        api.readout(out);
      }
      /* timer panel (not saved in the link) */
      var tm = { mode: 'up', sec: 0, set: 300, run: false };
      tbox.innerHTML = '<div style="margin-top:1rem;padding:.8rem 1rem;border:2px solid var(--line);border-radius:14px;display:flex;flex-wrap:wrap;gap:.6rem;align-items:center">' +
        '<b style="margin-right:.3rem">Timer</b><div class="om-seg"><button type="button" data-m="up" aria-pressed="true">Count up</button><button type="button" data-m="down" aria-pressed="false">Count down</button></div>' +
        '<label class="tm-set" style="display:none;font-weight:700">Minutes <input type="number" min="1" max="99" value="5" style="width:4.5em;border:2px solid var(--line);border-radius:8px;padding:.2em .4em"></label>' +
        '<span class="tm-disp" style="font:800 2rem/1 ui-monospace,Consolas,monospace;min-width:5ch;color:var(--navy)">0:00</span>' +
        '<button type="button" class="om-btn small primary tm-go">Start</button><button type="button" class="om-btn small tm-rs">Reset</button></div>';
      var disp = tbox.querySelector('.tm-disp'), go = tbox.querySelector('.tm-go'), setL = tbox.querySelector('.tm-set'), setIn = setL.querySelector('input');
      function show() { var s = tm.mode === 'up' ? tm.sec : Math.max(0, tm.set - tm.sec); disp.textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); go.textContent = tm.run ? 'Pause' : 'Start'; }
      function stop() { clearInterval(timerInt); timerInt = null; tm.run = false; show(); }
      go.onclick = function () { if (tm.run) { stop(); return; } if (tm.mode === 'down' && tm.sec >= tm.set) tm.sec = 0; tm.run = true; timerInt = setInterval(function () { if (!document.body.contains(tbox)) { stop(); return; } tm.sec++; if (tm.mode === 'down' && tm.sec >= tm.set) { stop(); O.toast('Time’s up!'); } show(); }, 1000); show(); };
      tbox.querySelector('.tm-rs').onclick = function () { stop(); tm.sec = 0; show(); };
      tbox.querySelectorAll('[data-m]').forEach(function (b) { b.onclick = function () { tm.mode = b.dataset.m; tbox.querySelectorAll('[data-m]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); setL.style.display = tm.mode === 'down' ? '' : 'none'; stop(); tm.sec = 0; show(); }; });
      setIn.onchange = function () { tm.set = O.clamp(parseInt(setIn.value, 10) || 1, 1, 99) * 60; setIn.value = tm.set / 60; stop(); tm.sec = 0; show(); };
      show();

      dragOn(holder, function (e, t) {
        var which = t.getAttribute('data-drag');
        return { move: function (ev) {
          var p = P(holder, ev), a = Math.atan2(p.x - CX, CY - p.y) * 180 / Math.PI; if (a < 0) a += 360;
          if (which === 'm') { var m = (Math.round(a / 6 / S.sn) * S.sn) % 60, d = m - S.t % 60; if (d > 30) d -= 60; if (d < -30) d += 60; S.t = (S.t + d + 1440) % 1440; }
          else { var pos = Math.round(a * 2 / S.sn) * S.sn % 720, d2 = pos - S.t % 720; if (d2 > 360) d2 -= 720; if (d2 < -360) d2 += 720; S.t = (S.t + d2 + 1440) % 1440; }
          draw();
        }, end: function () { api.redraw(); } };
      });
      api.onRedraw(draw);
    }
  });
})();
