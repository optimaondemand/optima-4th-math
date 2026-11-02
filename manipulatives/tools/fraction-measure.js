/* Fractions, decimals, money and measurement tools:
   fbars (Fraction Tiles), fcircles, decgrid, money, ruler, scale, beaker, clock */
(function () {
  var O = OAOM;
  var VIO = '#6B46C1', GRN = '#23915A', YEL = '#F2B705', NAVY = '#0E1C42', LINE = '#C9CFDF', MUTE = '#5B6478';

  /* ---------- shared helpers ---------- */
  /* one svg per tool that lives for the whole mount, so a drag (O.rootDrag) can redraw it mid-way without losing pointer capture.
     reset() empties and resizes it at the start of every draw. */
  function stageSvg(api, label) { var d = O.el('div'); api.stage.appendChild(d); return O.svg(10, 10, d, label); }
  function reset(v, w, h, vb, label) { while (v.firstChild) v.removeChild(v.firstChild); v.setAttribute('viewBox', vb || ('0 0 ' + w + ' ' + h)); v.setAttribute('width', w); v.setAttribute('height', h); if (label) v.setAttribute('aria-label', label); return v; }
  function dragKind(e) { var t = e.target.closest && e.target.closest('[data-drag]'); return t ? t.getAttribute('data-drag') : null; }
  /* O.rootDrag captures the pointer on the svg root, so a plain click never reaches a piece's O.tap: the tools do the tap in up() when
     nothing moved, then call O.dragDone() so a click that does arrive is ignored. Keyboard taps still go through O.tap. */
  /* setup groups we can show and hide */
  function grp(api, fn) {
    var boxes = [api.setup].concat([].slice.call(api.setup.querySelectorAll('details.om-more'))), n0 = boxes.map(function (b) { return b.children.length; });
    fn(); var out = [];
    boxes.forEach(function (b, i) { out = out.concat([].slice.call(b.children, n0[i])); });
    return out;
  }
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
  /* k out of d as a report string: 'a/b' simplified, or a whole number */
  function fracStr(k, d) { if (!k) return '0'; var g = O.gcd(k, d); return d / g === 1 ? String(k / g) : (k / g) + '/' + (d / g); }
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
  /* fraction palette: darker than the place-value colors so thirds never look like ones and sixths never look like tens.
     White labels on every one of these read at 4.5:1 or better (checked: halves 6.4, thirds 4.7, fourths 5.1, fifths 5.1, sixths 4.7,
     sevenths 6.0, eighths 5.9, ninths 4.9, tenths 4.9, elevenths 7.7, twelfths 5.9). Unshaded tiles get navy labels. */
  var DCOL = { 2: '#6B46C1', 3: '#B05E09', 4: '#8A6A00', 5: '#4E7A1A', 6: '#2F6FDE', 7: '#B03A2E', 8: '#A23B8C', 9: '#2E7D6B', 10: '#117E7E', 11: '#8C2F6E', 12: '#5B6478' };
  var DNAME = { 1: 'Wholes', 2: 'Halves', 3: 'Thirds', 4: 'Fourths', 5: 'Fifths', 6: 'Sixths', 7: 'Sevenths', 8: 'Eighths', 9: 'Ninths', 10: 'Tenths', 11: 'Elevenths', 12: 'Twelfths' };
  function sing(d) { return d === 2 ? 'half' : DNAME[d].toLowerCase().replace(/s$/, ''); }

  /* ═════════ FRACTION TILES ═════════ */
  O.register('fbars', {
    /* bm (build | wall) is not in the defaults on purpose: mount() picks it for a link that does not carry one */
    defaults: { d: [2, 3, 4, 6, 8, 12], w: 1, lab: 1, sh: {}, gd: 1, gx: 0.5, bt: [] },
    mount: function (api) {
      var S = api.S; if (!S.bt) S.bt = [];
      /* an older link with no mode: shaded wall tiles mean the wall, otherwise build */
      if (S.bm !== 'build' && S.bm !== 'wall') S.bm = Object.keys(S.sh || {}).some(function (k) { return S.sh[k] && S.sh[k].length; }) ? 'wall' : 'build';
      var SH = { sh: {}, bt: [] };
      api.quick([['Halves to eighths', Object.assign({ d: [2, 4, 8] }, SH)], ['Thirds and sixths', Object.assign({ d: [3, 6, 12] }, SH)], ['Tenths', Object.assign({ d: [2, 5, 10] }, SH)], ['All rows', Object.assign({ d: [2, 3, 4, 5, 6, 8, 10, 12] }, SH)]]);
      api.seg('How to use the tiles', 'bm', [['build', 'Build with tiles'], ['wall', 'Shade the wall']]);
      api.button('Clear', function () { S.sh = {}; S.bt = []; api.redraw(); }, '', api.row());
      var moreBox = api.more();
      api.heading('Tiles to use');
      var wrap = O.el('div', { class: 'om-field' }), g = O.el('div', { class: 'om-seg', role: 'group', 'aria-label': 'Rows to show' });
      for (var dd = 2; dd <= 12; dd++) (function (d) {
        var b = O.el('button', { type: 'button', 'aria-label': DNAME[d] }, String(d)); b.setAttribute('aria-pressed', S.d.indexOf(d) > -1);
        b.onclick = function () { var i = S.d.indexOf(d); if (i > -1) { if (S.d.length === 1) return; S.d.splice(i, 1); delete S.sh[d]; } else S.d.push(d); S.d.sort(function (a, b) { return a - b; }); b.setAttribute('aria-pressed', S.d.indexOf(d) > -1); api.redraw(); };
        g.appendChild(b);
      })(dd);
      wrap.appendChild(g); moreBox.appendChild(wrap);
      api.hint('Each number is a row: 2 means halves, 3 means thirds, and so on.');
      api.seg('Wholes in each row', 'w', [[1, '1'], [2, '2'], [3, '3']], function () { Object.keys(S.sh).forEach(function (d) { S.sh[d] = S.sh[d].filter(function (i) { return i < d * S.w; }); }); });
      api.check('Write the fraction on each tile', 'lab');
      api.check('Show the line-up guide', 'gd');
      api.endMore();

      var v = stageSvg(api, 'Fraction tiles'); v.style.width = '100%';
      var BW = 680, LX = 10, RH = 44, GAP = 7, Y0 = 34, BL = null;
      function sumBt() { var L = S.bt.reduce(lcm, 1), n = 0; S.bt.forEach(function (d) { n += L / d; }); return [n, L]; }
      function tile(p, x, y, w, d, on) {
        var col = DCOL[d], t = O.s('g', {}, p);
        O.s('rect', { x: x + 1, y: y, width: w - 2, height: RH, rx: 6, fill: on ? col : '#fff', stroke: col, 'stroke-width': 2, class: on ? '' : 'paper' }, t);
        if (S.lab && w >= 30) sFrac(t, x + w / 2, y + RH / 2 - 1, 1, d, w >= 44 ? 15 : 12, on ? '#fff' : NAVY, on ? '' : 'ink');
        return t;
      }
      function onBar(p) { return BL && p.y >= BL.by - 30 && p.y <= BL.by + RH + 30 && p.x >= LX - 20 && p.x <= LX + BW + 20; }
      function drawBuild() {
        api.say('Drag tiles from the tray onto the bar under the 1. Drag a tile off the bar to take it away.');
        var WW = BW / S.w, by = Y0 + RH + GAP + 6, ty = by + RH + 40, rowsT = [[]], x = 0;
        S.d.forEach(function (d) { var w = WW / d; if (x + w > BW + 0.5 && rowsT[rowsT.length - 1].length) { rowsT.push([]); x = 0; } rowsT[rowsT.length - 1].push([d, x, w]); x += w + 10; });
        var H = ty + 22 + rowsT.length * (RH + 12) + 6;
        reset(v, BW + 2 * LX, H, null, 'Fraction tiles: build');
        for (var k = 0; k < S.w; k++) { var w1 = O.s('g', {}, v); O.s('rect', { x: LX + k * WW + 1, y: Y0, width: WW - 2, height: RH, rx: 6, fill: NAVY }, w1); O.s('text', { x: LX + k * WW + WW / 2, y: Y0 + RH / 2 + 7, 'text-anchor': 'middle', 'font-size': 20, fill: '#fff', text: '1' }, w1); }
        O.s('rect', { x: LX, y: by, width: BW, height: RH, rx: 6, fill: '#F6F7FB', stroke: '#AEB6CC', 'stroke-width': 2, 'stroke-dasharray': '6 5', class: 'paper' }, v);
        BL = { by: by, ty: ty };
        var bx = LX;
        S.bt.forEach(function (d, i) {
          var w = WW / d, t = tile(v, bx, by, w, d, true);
          function take() { S.bt.splice(i, 1); api.redraw(); }
          O.dragTap(v, t, take, function (p) { if (onBar(p)) return false; take(); return true; }, 'Take away a ' + sing(d) + ' tile', 'bt-' + i);
          bx += w;
        });
        var tg = O.s('g', { 'data-ui': 'tray' }, v);
        O.s('text', { x: LX, y: ty - 6, 'font-size': 12, fill: MUTE, class: 'ink', text: 'TRAY' }, tg);
        rowsT.forEach(function (r, ri) { r.forEach(function (q) {
          var t = tile(tg, LX + q[1], ty + ri * (RH + 12), q[2], q[0], false);
          O.dragTap(v, t, function () { add(q[0]); }, function (p) { return onBar(p) ? add(q[0]) : false; }, 'Add a ' + sing(q[0]) + ' tile', 'tt-' + q[0]);
        }); });
        var s = sumBt();
        if (!S.bt.length) api.readout('<span>On the bar: <b>0</b></span>');
        else {
          var terms = []; S.bt.forEach(function (d) { terms.push(O.frac(1, d)); });
          api.readout('<span>On the bar: <b>' + (terms.length > 1 ? terms.join(' + ') + ' = ' : '') + fracWords(s[0], s[1]) + '</b></span>' + (s[0] === s[1] * S.w ? '<span style="color:' + GRN + '">The bar is full.</span>' : ''));
        }
        api.report({ v: fracStr(s[0], s[1]), rows: 'build:' + S.bt.join(',') });
      }
      /* add one tile of size d to the bar; true when it fit */
      function add(d) {
        var s = sumBt(); if (s[0] / s[1] + 1 / d > S.w + 1e-9) { O.toast('That tile won’t fit. Try a smaller tile.'); return false; }
        S.bt.push(d); api.redraw(); return true;
      }
      function draw() {
        if (S.bm === 'build') return drawBuild();
        api.say('Drag across tiles to shade them. Drag the yellow line to see which tiles line up.');
        var rows = [1].concat(S.d), H = Y0 + rows.length * (RH + GAP) + 6, WW = BW / S.w;
        reset(v, BW + 2 * LX, H, null, 'Fraction tiles');
        rows.forEach(function (d, r) {
          var y = Y0 + r * (RH + GAP), n = d * S.w, tw = WW / d, sh = S.sh[d] || [];
          for (var i = 0; i < n; i++) {
            var x = LX + i * tw, on = d === 1 || sh.indexOf(i) > -1, col = d === 1 ? NAVY : DCOL[d];
            var t = O.s('g', d > 1 ? { 'data-drag': 'tile' } : {}, v);
            O.s('rect', { x: x + 1, y: y, width: tw - 2, height: RH, rx: 6, fill: on ? col : '#fff', stroke: col, 'stroke-width': 2, class: on ? '' : 'paper' }, t);
            if (d === 1) O.s('text', { x: x + tw / 2, y: y + RH / 2 + 7, 'text-anchor': 'middle', 'font-size': 20, fill: '#fff', text: '1' }, t);
            else if (S.lab && tw >= 30) sFrac(t, x + tw / 2, y + RH / 2 - 1, 1, d, tw >= 44 ? 15 : 12, on ? '#fff' : NAVY, on ? '' : 'ink');
            if (d > 1) (function (d, i) { O.tap(t, function () { var a = S.sh[d] || (S.sh[d] = []), k = a.indexOf(i); if (k > -1) a.splice(k, 1); else a.push(i); api.redraw(); }, (sh.indexOf(i) > -1 ? 'Unshade' : 'Shade') + ' tile ' + (i + 1) + ' of ' + DNAME[d].toLowerCase(), 'tile-' + d + '-' + i); })(d, i);
          }
        });
        if (S.gd) {
          var gx = LX + S.gx * BW, gg = O.s('g', { 'data-drag': 'g' }, v);
          O.s('line', { x1: gx, x2: gx, y1: 22, y2: H - 2, stroke: YEL, 'stroke-width': 4 }, gg);
          O.s('rect', { x: gx - 18, y: 0, width: 36, height: 26, rx: 8, fill: YEL }, gg);
          O.s('text', { x: gx, y: 18, 'text-anchor': 'middle', 'font-size': 15, fill: NAVY, text: '⇔' }, gg);
          O.s('rect', { x: gx - 14, y: 22, width: 28, height: H - 24, fill: 'transparent', 'data-drag': 'g' }, gg);
          gg.style.cursor = 'ew-resize';
          O.keys(gg, function (k) { S.gx = O.clamp(S.gx + k / (24 * S.w), 0, 1); api.redraw(); }, 'Line-up guide', 'guide', function () { return O.fmt(S.gx * S.w, 2) + ' wholes from the left'; });
        }
        var out = [];
        S.d.forEach(function (d) { var k = (S.sh[d] || []).length; if (k) out.push('<span>' + DNAME[d] + ': <b>' + fracWords(k, d) + '</b></span>'); });
        api.readout(out.join(''));
        var d0 = S.d[0];
        api.report({ v: fracStr((S.sh[d0] || []).length, d0), rows: S.d.map(function (d) { return d + ':' + (S.sh[d] || []).length; }).join(',') });
      }
      function tileAt(p, d) { /* index of the tile under p in row d, or -1 */
        var r = [1].concat(S.d).indexOf(d), y = Y0 + r * (RH + GAP), n = d * S.w, tw = BW / S.w / d;
        if (p.y < y - GAP / 2 || p.y > y + RH + GAP / 2) return -1;
        var i = Math.floor((p.x - LX) / tw); return i >= 0 && i < n ? i : -1;
      }
      function paint(c, i) { var k = c.a.indexOf(i); if (c.val && k < 0) c.a.push(i); else if (!c.val && k > -1) c.a.splice(k, 1); }
      /* wall mode: paint across tiles, or slide the guide; a plain tap toggles the tile under the pointer */
      O.rootDrag(v, {
        down: function (p, e) {
          if (S.bm === 'build') return null;
          var kind = dragKind(e); if (!kind) return null;
          if (kind === 'g') return { g: 1 };
          var row = -1; [1].concat(S.d).forEach(function (d, r) { var y = Y0 + r * (RH + GAP); if (p.y >= y && p.y <= y + RH) row = d; });
          if (row < 2) return null;
          var i0 = tileAt(p, row); if (i0 < 0) return null;
          var a = S.sh[row] || (S.sh[row] = []);
          return { row: row, i0: i0, a: a, val: a.indexOf(i0) < 0, painted: false };
        },
        move: function (p, c, moved) {
          if (!moved) return;
          if (c.g) { var f = O.clamp((p.x - LX) / BW, 0, 1), best = f, bd = 1;
            S.d.concat([1]).forEach(function (d) { var n = d * S.w; for (var i = 0; i <= n; i++) { var b = i / n, dist = Math.abs(b - f) * BW; if (dist < 7 && dist < bd * BW) { best = b; bd = dist / BW; } } });
            S.gx = best; draw(); return; }
          var i = tileAt(p, c.row); if (i < 0) return;
          if (!c.painted) { paint(c, c.i0); c.painted = true; }
          paint(c, i); draw();
        },
        up: function (p, c, moved) { if (!moved) { if (c.g) return; paint(c, c.i0); O.dragDone(); } api.redraw(); }
      });
      api.onRedraw(draw);
    }
  });

  /* ═════════ FRACTION CIRCLES ═════════ */
  O.register('fcircles', {
    defaults: { c: 1, n: 4, per: 0, ns: [4, 4, 4, 4], lab: 0, sh: [[], [], [], []] },
    mount: function (api) {
      var S = api.S;
      api.say('Drag a slice from the tray into a circle, or drag across a circle to shade it. Drag a slice out to take it away.');
      function F(c, n) { return { c: c, n: n, ns: [n, n, n, n], per: 0, sh: [[], [], [], []] }; }
      api.quick([['1 circle, fourths', F(1, 4)], ['3 circles, fourths', F(3, 4)], ['Halves', F(2, 2)], ['Thirds', F(2, 3)], ['Sixths', F(2, 6)], ['Eighths', F(2, 8)]]);
      api.num('How many circles', 'c', 1, 4, 1);
      api.select('Slices in each circle', 'n', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (k) { return [k, k + ' slices']; }), function (v) { S.ns = [v, v, v, v]; trim(); syncSel(); });
      api.button('Clear shading', function () { S.sh = [[], [], [], []]; api.redraw(); }, '', api.row());
      api.more();
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
      api.endMore();
      function trim() { S.sh = S.sh.map(function (a, i) { return a.filter(function (k) { return k < S.ns[i]; }); }); }

      var v = stageSvg(api, 'Fraction circles'); v.style.width = '100%';
      var CW = 240, R = 104;
      function draw() {
        var c = S.c, cols = c === 4 ? 2 : c, rowsN = Math.ceil(c / cols);
        var ns = [], TR = 66; S.ns.slice(0, c).forEach(function (n) { if (ns.indexOf(n) < 0) ns.push(n); });
        var VW = Math.max(cols * CW, ns.length * 130 + 20), TY = rowsN * CW, VH = TY + 128;
        reset(v, VW, VH); v.style.maxWidth = (Math.max(cols, 2) * 330) + 'px';
        /* tray: one slice of each size in use */
        var tg = O.s('g', { 'data-ui': 'tray' }, v);
        O.s('rect', { x: 4, y: TY + 4, width: VW - 8, height: 118, rx: 12, fill: '#F1F3F8', stroke: LINE, 'stroke-width': 2 }, tg);
        O.s('text', { x: 14, y: TY + 20, 'font-size': 12, fill: MUTE, text: 'TRAY' }, tg);
        ns.forEach(function (n, j) {
          var ax = 20 + 130 * j + 65, ay = TY + 112, half = 180 / n, g = O.s('g', {}, tg);
          O.s('path', { d: n === 1 ? pie(ax, ay - TR, TR, 0, 360) : pie(ax, ay, Math.min(TR + 18, n <= 2 ? TR : TR + 18), -half, half), fill: VIO, stroke: NAVY, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
          var lab = sFrac(g, ax, ay - (n <= 2 ? 40 : 52), 1, n, 13, '#fff'); lab.style.pointerEvents = 'none';
          O.dragTap(v, g, function () { drop(n, -1); }, function (p) { var ci = circleAt(p); return ci >= 0 && drop(n, ci); }, 'Add a ' + sing(n), 'tray-' + n);
        });
        for (var ci = 0; ci < c; ci++) {
          var cx = (ci % cols) * CW + CW / 2, cy = Math.floor(ci / cols) * CW + CW / 2, n = S.ns[ci], sh = S.sh[ci];
          for (var k = 0; k < n; k++) {
            var on = sh.indexOf(k) > -1, a0 = k * 360 / n, a1 = (k + 1) * 360 / n;
            var p = O.s('path', { d: pie(cx, cy, R, a0, a1), fill: on ? VIO : '#fff', stroke: NAVY, 'stroke-width': 2.5, 'stroke-linejoin': 'round', class: on ? '' : 'paper', 'data-drag': 'slice' }, v);
            (function (ci, k) { O.tap(p, function () { var a = S.sh[ci], i = a.indexOf(k); if (i > -1) a.splice(i, 1); else a.push(k); api.redraw(); }, 'Slice ' + (k + 1) + ' of circle ' + (ci + 1), 'slice-' + ci + '-' + k); })(ci, k);
            if (S.lab) { var mid = ((a0 + a1) / 2 - 90) * Math.PI / 180, rr = n === 1 ? 0 : R * 0.64, fs = n > 8 ? 12 : 16; var lab = sFrac(v, cx + rr * Math.cos(mid), cy + rr * Math.sin(mid) - 2, 1, n, fs, on ? '#fff' : NAVY, on ? '' : 'ink'); lab.style.pointerEvents = 'none'; }
          }
        }
        /* readout */
        var used = S.ns.slice(0, c), same = used.every(function (n) { return n === used[0]; }), ks = S.sh.slice(0, c).map(function (a) { return a.length; });
        var tot = ks.reduce(function (a, b) { return a + b; }, 0), L = used.reduce(lcm), sum = 0, parts = [];
        ks.forEach(function (k, i) { if (k) { parts.push(O.frac(k, used[i])); sum += k * L / used[i]; } });
        api.report({ v: fracStr(sum, L) });
        if (!tot) { api.readout('<span>Shaded: <b>0</b></span>'); return; }
        if (same) api.readout('<span>Shaded: <b>' + (parts.length > 1 ? parts.join(' + ') + ' = ' : '') + fracWords(tot, used[0]) + '</b></span>');
        else api.readout('<span>Shaded: <b>' + parts.join(' + ') + ' = ' + fracWords(sum, L) + '</b></span>');
      }
      /* put one slice of size n into circle ci (or the first circle that fits it when ci < 0); true when it went in */
      function drop(n, ci) {
        var list = ci >= 0 ? [ci] : [0, 1, 2, 3].slice(0, S.c);
        for (var j = 0; j < list.length; j++) {
          var i = list[j];
          if (S.ns[i] !== n) { if (ci >= 0) { O.toast('That slice is a different size. Use a slice that matches this circle.'); return false; } continue; }
          for (var k = 0; k < n; k++) if (S.sh[i].indexOf(k) < 0) { S.sh[i].push(k); api.redraw(); return true; }
          if (ci >= 0) { O.toast('That circle is full. Try the next circle.'); return false; }
        }
        O.toast('There is no room for that slice.'); return false;
      }
      function circleAt(p) { var c = S.c, cols = c === 4 ? 2 : c; for (var ci = 0; ci < c; ci++) { var cx = (ci % cols) * CW + CW / 2, cy = Math.floor(ci / cols) * CW + CW / 2; if (Math.hypot(p.x - cx, p.y - cy) <= R + 14) return ci; } return -1; }
      function sliceAt(p) {
        var c = S.c, cols = c === 4 ? 2 : c;
        for (var ci = 0; ci < c; ci++) {
          var cx = (ci % cols) * CW + CW / 2, cy = Math.floor(ci / cols) * CW + CW / 2, dx = p.x - cx, dy = p.y - cy;
          if (dx * dx + dy * dy > R * R) continue;
          var a = Math.atan2(dx, -dy) * 180 / Math.PI; if (a < 0) a += 360;
          return [ci, Math.min(S.ns[ci] - 1, Math.floor(a / (360 / S.ns[ci])))];
        }
        return null;
      }
      function paint(c, h) { var a = S.sh[h[0]], k = a.indexOf(h[1]); if (c.val && k < 0) a.push(h[1]); else if (!c.val && k > -1) a.splice(k, 1); }
      /* paint across slices, or drag a shaded slice out of its circle; a plain tap toggles the slice */
      O.rootDrag(v, {
        down: function (p) { var h0 = sliceAt(p); if (!h0) return null; return { h0: h0, val: S.sh[h0[0]].indexOf(h0[1]) < 0, painted: false, out: false, ghost: null, p0: p }; },
        move: function (p, c, moved) {
          if (!moved) return;
          var h = sliceAt(p);
          if (!h) { /* dragging a shaded slice out of the circle */
            if (!c.val && circleAt(p) < 0) { c.out = true; if (!c.ghost) { var src = v.querySelector('[data-k="slice-' + c.h0[0] + '-' + c.h0[1] + '"]'); if (src) { c.ghost = src.cloneNode(); c.ghost.removeAttribute('tabindex'); c.ghost.removeAttribute('data-k'); c.ghost.style.pointerEvents = 'none'; c.ghost.style.opacity = .85; v.appendChild(c.ghost); src.setAttribute('fill', '#fff'); } }
              if (c.ghost) c.ghost.setAttribute('transform', 'translate(' + (p.x - c.p0.x) + ' ' + (p.y - c.p0.y) + ')'); }
            return; }
          c.out = false; if (c.ghost) { c.ghost.remove(); c.ghost = null; draw(); }
          if (c.painted || h[0] !== c.h0[0] || h[1] !== c.h0[1]) { if (!c.painted) { paint(c, c.h0); c.painted = true; } paint(c, h); draw(); }
        },
        up: function (p, c, moved) { if (c.ghost) c.ghost.remove(); if (!moved) O.dragDone(); if (!moved || c.out || !c.painted) paint(c, c.h0); api.redraw(); }
      });
      api.onRedraw(draw);
    }
  });

  /* ═════════ DECIMAL GRID ═════════ */
  var DLEN = { t: 10, h: 100, th: 1000 }, DDP = { t: 1, h: 2, th: 3 };
  function encBits(a) { var s = ''; for (var i = 0; i < a.length; i += 4) s += ((a[i] ? 8 : 0) | (a[i + 1] ? 4 : 0) | (a[i + 2] ? 2 : 0) | (a[i + 3] ? 1 : 0)).toString(16); return s.replace(/0+$/, ''); }
  function decBits(s, L) { var a = new Array(L).fill(0); s = s || ''; for (var i = 0; i < s.length; i++) { var v = parseInt(s[i], 16) || 0; for (var b = 0; b < 4; b++) if (i * 4 + b < L) a[i * 4 + b] = (v >> (3 - b)) & 1; } return a; }
  /* the cell an arrow key moves to from cell i of a grid (null = stay). Cells run down each column, then the next column. */
  function cellStep(m, i, key) {
    var L = DLEN[m], col, row, b;
    if (m === 't') { if (key === 'ArrowRight') return i < 9 ? i + 1 : null; if (key === 'ArrowLeft') return i > 0 ? i - 1 : null; return null; }
    if (m === 'h') { col = Math.floor(i / 10); row = i % 10;
      if (key === 'ArrowRight') return col < 9 ? i + 10 : null; if (key === 'ArrowLeft') return col > 0 ? i - 10 : null;
      if (key === 'ArrowDown') return row < 9 ? i + 1 : null; if (key === 'ArrowUp') return row > 0 ? i - 1 : null; return null; }
    col = Math.floor(i / 100); row = Math.floor(i / 10) % 10; b = i % 10;
    if (key === 'ArrowRight') return b < 9 ? i + 1 : col < 9 ? i + 91 : null; if (key === 'ArrowLeft') return b > 0 ? i - 1 : col > 0 ? i - 91 : null;
    if (key === 'ArrowDown') return row < 9 ? i + 10 : null; if (key === 'ArrowUp') return row > 0 ? i - 10 : null;
    void L; return null;
  }
  O.register('decgrid', {
    defaults: { m: 'h', c: 1, sh: ['', '', ''], pct: 0 },
    mount: function (api) {
      var S = api.S, bits;
      function load() { bits = [0, 1, 2].map(function (i) { return decBits(S.sh[i], DLEN[S.m]); }); }
      function sync() { S.sh = bits.map(encBits); }
      load();
      api.say('Tap or drag across the squares to shade them. One whole grid is 1.');
      var E = ['', '', ''];
      api.quick([['Tenths', { m: 't', c: 1, sh: E }], ['Hundredths', { m: 'h', c: 1, sh: E }], ['Thousandths', { m: 'th', c: 1, sh: E }], ['2 grids', { m: 'h', c: 2, sh: E }]]);
      api.seg('Grid', 'm', [['t', 'Tenths'], ['h', 'Hundredths'], ['th', 'Thousandths']], function () { S.sh = ['', '', '']; load(); });
      api.button('Clear shading', function () { S.sh = ['', '', '']; load(); api.redraw(); }, '', api.row());
      api.more();
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
      api.endMore();

      var v = stageSvg(api, 'Decimal grid'); v.style.width = '100%';
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
      function focusCell(g, i) { var n = v.querySelector('[data-k="cell-' + g + '-' + i + '"]'); if (n) n.focus(); }
      function cellKeys(g, i) { return function (e) {
        if (e.key.indexOf('Arrow') !== 0) return; e.preventDefault();
        var j = cellStep(S.m, i, e.key);
        if (j != null) { focusCell(g, j); return; }
        /* off the edge of this grid: step into the next or previous grid on the same row */
        var L = DLEN[S.m], rowOf = S.m === 't' ? 0 : S.m === 'h' ? i % 10 : Math.floor(i / 10) % 10;
        if (e.key === 'ArrowRight' && g + 1 < S.c) focusCell(g + 1, S.m === 't' ? 0 : S.m === 'h' ? rowOf : rowOf * 10);
        if (e.key === 'ArrowLeft' && g > 0) focusCell(g - 1, S.m === 't' ? 9 : S.m === 'h' ? 90 + rowOf : 900 + rowOf * 10 + 9);
        void L;
      }; }
      function draw() {
        var W = S.c * GS + (S.c - 1) * GAP + 2 * M; reset(v, W, GS + 2 * M + 26); v.style.maxWidth = (S.c * 400) + 'px';
        var names = [['tenth', 'tenths'], ['hundredth', 'hundredths'], ['thousandth', 'thousandths']], cellName = names[DDP[S.m] - 1][0];
        for (var g = 0; g < S.c; g++) {
          var ox = M + g * (GS + GAP), oy = M, b = bits[g];
          O.s('rect', { x: ox, y: oy, width: GS, height: GS, fill: '#fff', class: 'paper' }, v);
          for (var i = 0; i < b.length; i++) if (b[i]) { var r = cellRect(S.m, i); O.s('rect', { x: ox + r[0], y: oy + r[1], width: r[2], height: r[3], fill: '#2F6FDE' }, v); }
          var path = '';
          if (S.m === 'th') for (var k = 3; k < GS; k += 3) if (k % 30) path += 'M' + (ox + k) + ',' + oy + 'v' + GS;
          O.s('path', { d: path, stroke: '#DDE2EE', 'stroke-width': .6, 'pointer-events': 'none' }, v);
          var p2 = ''; for (var j = 30; j < GS; j += 30) { p2 += 'M' + (ox + j) + ',' + oy + 'v' + GS; if (S.m !== 't') p2 += 'M' + ox + ',' + (oy + j) + 'h' + GS; }
          O.s('path', { d: p2, stroke: S.m === 'th' ? '#8E98B3' : '#AEB6CC', 'stroke-width': 1.3, 'pointer-events': 'none' }, v);
          /* every cell is a button: Enter shades or unshades it, arrow keys move to the next cell */
          for (var q = 0; q < b.length; q++) (function (g, q) {
            var r = cellRect(S.m, q), c = O.s('rect', { x: ox + r[0], y: oy + r[1], width: r[2], height: r[3], fill: 'transparent', style: 'cursor:crosshair' }, v);
            O.tap(c, function () { bits[g][q] = bits[g][q] ? 0 : 1; sync(); api.redraw(); }, (b[q] ? 'Unshade ' : 'Shade ') + cellName + ' ' + (q + 1) + (S.c > 1 ? ' of grid ' + (g + 1) : ''), 'cell-' + g + '-' + q);
            c.addEventListener('keydown', cellKeys(g, q));
          })(g, q);
          O.s('rect', { x: ox, y: oy, width: GS, height: GS, fill: 'none', stroke: NAVY, 'stroke-width': 3, class: 'inks', 'pointer-events': 'none' }, v);
          var k2 = b.reduce(function (a, c) { return a + c; }, 0);
          O.s('text', { x: ox + GS / 2, y: oy + GS + 22, 'text-anchor': 'middle', 'font-size': 15, fill: MUTE, class: 'om-num ink', text: k2 === DLEN[S.m] ? '1 whole' : k2 + ' of ' + DLEN[S.m] }, v);
        }
        var L = DLEN[S.m], dp = DDP[S.m], u = 0; for (var g2 = 0; g2 < S.c; g2++) u += bits[g2].reduce(function (a, c) { return a + c; }, 0);
        var str = String(u); while (str.length <= dp) str = '0' + str; var dec = str.slice(0, -dp) + '.' + str.slice(-dp);
        var ones = Math.floor(u / L), rest = u - ones * L, pv = [];
        if (ones) pv.push(ones + (ones === 1 ? ' one' : ' ones'));
        for (var q2 = 0; q2 < dp; q2++) { var dg = Math.floor(rest / Math.pow(10, dp - 1 - q2)) % 10; pv.push(dg + ' ' + names[q2][dg === 1 ? 0 : 1]); }
        var fr = u >= L && u % L === 0 ? String(u / L) : (u > L ? O.mixed(u, L) + ' = ' + O.frac(u, L) : O.frac(u, L));
        var pctS = S.pct ? '<span>Percent: <b>' + Number((u / L * 100).toFixed(1)) + '%</b></span>' : '';
        var dTrim = dec.indexOf('.') > -1 ? dec.replace(/0+$/, '').replace(/\.$/, '') : dec; if (dTrim === '') dTrim = '0';
        var terms = []; if (ones) terms.push(String(ones));
        for (var q3 = 0; q3 < dp; q3++) { var dg2 = Math.floor(rest / Math.pow(10, dp - 1 - q3)) % 10; if (dg2) terms.push('0.' + '0'.repeat(q3) + dg2); }
        var sent = terms.length > 1 ? '<span>' + terms.join(' + ') + ' = <b>' + dTrim + '</b></span>' : '';
        api.readout('<span>Decimal: <b>' + dec + '</b></span><span>Fraction: <b>' + (u ? fr : '0') + '</b></span>' + pctS + sent + '<span>' + pv.join(', ') + '</span>');
        api.report({ v: dTrim });
      }
      var raf = 0;
      function sched() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; draw(); }); }
      /* paint across cells; a plain tap toggles the cell */
      O.rootDrag(v, {
        down: function (p) { var h = hit(p.x, p.y); if (!h) return null; return { h: h, val: bits[h[0]][h[1]] ? 0 : 1, started: false }; },
        move: function (p, c, moved) {
          if (!moved) return;
          if (!c.started) { c.started = true; bits[c.h[0]][c.h[1]] = c.val; sched(); }
          var hh = hit(p.x, p.y); if (hh && bits[hh[0]][hh[1]] !== c.val) { bits[hh[0]][hh[1]] = c.val; sched(); }
        },
        up: function (p, c, moved) { if (!moved) { bits[c.h[0]][c.h[1]] = c.val; O.dragDone(); } if (raf) { cancelAnimationFrame(raf); raf = 0; } sync(); api.redraw(); }
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
    /* navy on the copper penny reads at 5:1; white only managed 3.3:1 */
    O.s('text', { x: cx, y: cy + (r > 16 ? 5 : 4), 'text-anchor': 'middle', 'font-size': r > 18 ? 13 : 11, fill: cu ? NAVY : '#27303F', text: val + '¢' }, g);
    return [g, 2 * r + 6];
  }
  O.register('money', {
    defaults: { it: [], mode: 'count', pr: 3.65, pd: 5 },
    mount: function (api) {
      var S = api.S;
      api.quick([['Count money', { mode: 'count', it: [] }], ['Make change', { mode: 'change', it: [] }]]);
      api.button('Clear the mat', function () { S.it = []; api.redraw(); }, '', api.row());
      var chM = api.more('Price and amount paid');
      api.num('Price ($)', 'pr', 0.01, 100, 0.01); api.num('Paid ($)', 'pd', 0.01, 100, 0.01);
      api.endMore(); chM.style.display = S.mode === 'change' ? '' : 'none';

      var v = stageSvg(api, 'Coins and bills');
      var fly = null, L = null; /* L = layout of the last draw */
      function cashName(val) { return val >= 100 ? 'a $' + val / 100 + ' bill' : 'a ' + COIN[val][1]; }
      function lab(val) { return val >= 100 ? '$' + val / 100 : val + '¢'; }
      function onMat(p) { return L && p.y >= L.matTop && p.y <= L.H && p.x >= 0 && p.x <= L.W; }
      function put(val, from) { if (S.it.length >= 60) { O.toast('The mat is full.'); return false; } if (from) fly = { val: val, x: from[0], y: from[1] }; S.it.push(val); api.redraw(); return true; }
      function draw() {
        if (S.mode === 'change') api.say('The price is <b>' + money(Math.round(S.pr * 100)) + '</b>. You paid <b>' + money(Math.round(S.pd * 100)) + '</b>. Count up from the price. Drag the change from the tray into the change box.');
        else api.say('Drag money from the tray onto the mat. Drag it off the mat to take it away.');
        S.it.sort(function (a, b) { return b - a; });
        var W = Math.max(360, Math.min(760, api.stage.clientWidth || 700)), rowH = 56;
        function flow(list, x0, y0, gap) { var x = x0, y = y0, pos = []; list.forEach(function (val) { var w = val >= 100 ? 104 : 2 * COIN[val][0] + 6; if (x + w > W - 12) { x = x0; y += rowH; } pos.push([x, y]); x += w + gap; }); return { pos: pos, bottom: y + rowH }; }
        var tray = flow(CASH.map(function (c) { return c[0]; }), 14, 26, 6), matTop = tray.bottom + 12;
        var mat = flow(S.it, 16, matTop + 26, 0);
        var H = Math.max(mat.bottom + 14, matTop + 170);
        reset(v, W, H);
        var tg = O.s('g', { 'data-ui': 'tray' }, v);
        O.s('rect', { x: 4, y: 4, width: W - 8, height: tray.bottom - 2, rx: 12, fill: '#F1F3F8', stroke: LINE, 'stroke-width': 2 }, tg);
        O.s('text', { x: 14, y: 20, 'font-size': 12, fill: MUTE, class: 'ink', text: 'TRAY' }, tg);
        L = { W: W, H: H, matTop: matTop };
        CASH.forEach(function (c, i) { var r = drawCash(tg, c[0], tray.pos[i][0], tray.pos[i][1]);
          O.dragTap(v, r[0], function () { put(c[0], tray.pos[i]); }, function (p) { return onMat(p) && put(c[0]); }, 'Add ' + cashName(c[0]), 'tray-' + c[0]); });
        O.s('rect', { x: 4, y: matTop, width: W - 8, height: H - matTop - 4, rx: 12, fill: '#fff', stroke: LINE, 'stroke-width': 2, class: 'paper' }, v);
        O.s('text', { x: 14, y: matTop + 18, 'font-size': 12, fill: MUTE, class: 'ink', text: S.mode === 'change' ? 'CHANGE' : 'MAT' }, v);
        var pos = mat.pos;
        var flyTo = fly ? S.it.lastIndexOf(fly.val) : -1;
        S.it.forEach(function (val, i) { var r = drawCash(v, val, pos[i][0], pos[i][1]);
          function take() { S.it.splice(i, 1); api.redraw(); }
          O.dragTap(v, r[0], take, function (p) { if (onMat(p)) return false; take(); return true; }, 'Take off ' + cashName(val), 'mat-' + i);
          if (i === flyTo) O.anim(r[0], { tx: fly.x - pos[i][0], ty: fly.y - pos[i][1] }, { tx: 0, ty: 0 }, 380); });
        fly = null;
        var tot = S.it.reduce(function (a, b) { return a + b; }, 0);
        /* number sentence, biggest first, repeats grouped: $1 + 25¢ + 3 × 10¢ = $1.35 */
        var groups = []; S.it.forEach(function (val) { var g = groups[groups.length - 1]; if (g && g[0] === val) g[1]++; else groups.push([val, 1]); });
        var sent = groups.length && (groups.length > 1 || groups[0][1] > 1) ? '<span>' + groups.map(function (g) { return (g[1] > 1 ? g[1] + ' × ' : '') + lab(g[0]); }).join(' + ') + ' = <b>' + money(tot) + '</b></span>' : '';
        var out = '<span>On the mat: <b>' + money(tot) + '</b></span><span>' + tot.toLocaleString('en-US') + (tot === 1 ? ' cent' : ' cents') + '</span>' + sent;
        if (S.mode === 'change') {
          var ch = Math.round(S.pd * 100) - Math.round(S.pr * 100);
          if (ch < 0) out += '<span>The amount paid must be more than the price.</span>';
          else if (tot === ch) out += '<span style="color:' + GRN + '">You made ' + money(ch) + ' in change. ✓</span>';
          else if (tot < ch) out += '<span>Keep going.</span>';
          else out += '<span>That is more than the change. Take some away.</span>';
        }
        api.readout(out);
        api.report({ v: String(tot) });
      }
      api.onResize(draw);
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
      function place() { var c = RU[S.u]; S.a = S.nz ? c.nz : 0; S.b = Math.min(c.max, snap(S.a + S.len)); if (S.b <= S.a) S.b = snap(S.a + step()); }
      api.say('Drag the ribbon or its round ends. Read the length on the ruler.');
      function RQ(u) { return { u: u, len: RU[u].len, a: 0, b: RU[u].len, nz: 0 }; }
      api.quick([['Centimeters', RQ('cm')], ['Meter stick', RQ('m')], ['Inches', RQ('in')], ['Yard stick', RQ('yd')]]);
      api.teacherOnly(api.num('Ribbon length (in the ruler’s unit)', 'len', 0.1, 100, 'any', function () { S.len = snap(S.len); place(); }));
      api.more();
      var qG = grp(api, function () { api.seg('Inch marks', 'q', [[2, O.frac(1, 2)], [4, O.frac(1, 4)], [8, O.frac(1, 8)]], function () { S.a = snap(S.a); S.b = snap(S.b); }); });
      showG(qG, S.u === 'in');
      api.check('Start the ribbon at a mark that isn’t 0', 'nz', place);
      api.endMore();
      var v = stageSvg(api, 'Ruler'); v.style.width = '100%';
      /* the ruler is always the same length in its unit (15 cm, 12 in, 1 m, 1 yd); on a phone the drawing shrinks and its labels grow */
      var W = 760, MX = 36, UW = W - 2 * MX;
      function narrow() { var w = api.stage.clientWidth; return w > 0 && w < 560; }
      function unitWord(n) { return S.u === 'in' || S.u === 'yd' ? (n === 1 ? 'inch' : 'inches') : (n === 1 ? 'centimeter' : 'centimeters'); }
      function at(u) { if (S.u === 'in') { var n2 = Math.round(u * S.q), g2 = O.gcd(n2, S.q); return O.mixed(n2 / g2, S.q / g2); } return O.fmt(u, 1); }
      function spoken(u) { return O.fmt(u, S.u === 'in' ? 3 : 1) + ' ' + unitWord(u); }
      function draw() {
        var c = RU[S.u], big = narrow() ? 1.4 : 1;
        reset(v, W, 210);
        var k = UW / c.max, X = function (u) { return MX + u * k; };
        var wood = S.u === 'm' || S.u === 'yd';
        O.s('rect', { x: MX - 22, y: 104, width: UW + 44, height: 86, rx: 6, fill: wood ? '#F6DE94' : '#EAF3FF', stroke: wood ? '#B8902A' : '#8FB2DA', 'stroke-width': 2 }, v);
        var ticks = '';
        function tk(u, h) { ticks += 'M' + X(u).toFixed(2) + ',104v' + h; }
        function lab(u, t, fs) { O.s('text', { x: X(u), y: 104 + 46, 'text-anchor': 'middle', 'font-size': (fs || 14) * big, fill: NAVY, text: t }, v); }
        if (S.u === 'cm') { for (var i = 0; i <= c.max * 10; i++) { tk(i / 10, i % 10 === 0 ? 28 : i % 5 === 0 ? 18 : 11); if (i % 10 === 0) lab(i / 10, String(i / 10)); } O.s('text', { x: MX - 14, y: 182, 'font-size': 12 * big, fill: MUTE, text: 'cm' }, v); }
        else if (S.u === 'm') { for (var j = 0; j <= 100; j++) { tk(j, j % 10 === 0 ? 30 : j % 5 === 0 ? 20 : 11); if (j % 10 === 0) lab(j, String(j), 13); } O.s('text', { x: MX - 14, y: 182, 'font-size': 12 * big, fill: MUTE, text: 'cm' }, v); }
        else if (S.u === 'in') { for (var n = 0; n <= c.max * S.q; n++) { var f = n / S.q, h = n % S.q === 0 ? 30 : (n * 2) % S.q === 0 ? 22 : (n * 4) % S.q === 0 ? 15 : 10; tk(f, h); if (n % S.q === 0) lab(f, String(f), 15); } O.s('text', { x: MX - 14, y: 182, 'font-size': 12 * big, fill: MUTE, text: 'in' }, v); }
        else { for (var y = 0; y <= 36; y++) { tk(y, y % 12 === 0 ? 34 : y % 6 === 0 ? 22 : 13); if (y % 12 === 0 && y) { O.s('text', { x: X(y), y: 104 + 52, 'text-anchor': 'middle', 'font-size': 15 * big, fill: '#7A5230', text: (y / 12) + ' ft' }, v); } else if (y % 12 && (big === 1 || y % 3 === 0)) lab(y, String(y), big > 1 ? 10 : 11); } /* a phone shows every third inch label */ O.s('text', { x: MX - 14, y: 182, 'font-size': 12 * big, fill: MUTE, text: 'in' }, v); }
        O.s('path', { d: ticks, stroke: NAVY, 'stroke-width': 1.4 }, v);
        /* ribbon */
        var xa = X(S.a), xb = X(S.b);
        O.s('path', { d: 'M' + xa + ',72V104M' + xb + ',72V104', stroke: VIO, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }, v);
        var body = O.s('rect', { x: xa, y: 44, width: Math.max(2, xb - xa), height: 28, rx: 5, fill: VIO, 'data-drag': 'body', style: 'cursor:grab' }, v);
        O.s('rect', { x: xa, y: 44, width: Math.max(2, xb - xa), height: 9, rx: 4, fill: '#8C6BE0', 'pointer-events': 'none' }, v);
        O.keys(body, function (d) { var s = step(), m = O.clamp(d * s, -S.a, c.max - S.b); S.a = snap(S.a + m); S.b = snap(S.b + m); api.redraw(); }, 'Ribbon', 'ribbon', function () { return 'from ' + spoken(S.a) + ' to ' + spoken(S.b); });
        [['a', xa], ['b', xb]].forEach(function (hh) {
          var g = O.s('g', { 'data-drag': hh[0], style: 'cursor:ew-resize' }, v);
          O.s('circle', { cx: hh[1], cy: 58, r: 20 * big, fill: 'transparent', 'data-drag': hh[0] }, g);
          O.s('circle', { cx: hh[1], cy: 58, r: 11 * big, fill: YEL, stroke: NAVY, 'stroke-width': 2, 'data-drag': hh[0] }, g);
          O.keys(g, function (d) { var s = step(); if (hh[0] === 'a') S.a = O.clamp(snap(S.a + d * s), 0, S.b - s); else S.b = O.clamp(snap(S.b + d * s), S.a + s, c.max); api.redraw(); }, hh[0] === 'a' ? 'Left end of ribbon' : 'Right end of ribbon', 'end-' + hh[0], function () { return spoken(hh[0] === 'a' ? S.a : S.b); });
        });
        /* readout */
        var L = Math.round((S.b - S.a) * 1000) / 1000, r;
        if (S.u === 'cm') { var mm = Math.round(L * 10); r = '<b>' + O.fmt(L, 1) + ' cm</b>' + (mm % 10 ? ' = ' + Math.floor(mm / 10) + ' cm ' + (mm % 10) + ' mm = ' + mm + ' mm' : ''); }
        else if (S.u === 'm') r = '<b>' + L + ' cm</b>' + (L === 100 ? ' = 1 m' : '');
        else if (S.u === 'in') { var nn = Math.round(L * S.q), g = O.gcd(nn, S.q); r = '<b>' + O.mixed(nn / g, S.q / g) + ' in</b>'; }
        else r = '<b>' + L + ' in</b>' + (L >= 12 ? ' = ' + Math.floor(L / 12) + ' ft' + (L % 12 ? ' ' + (L % 12) + ' in' : '') : '');
        api.report({ v: String(L) });
        api.readout('<span>Length: ' + r + '</span>' + (S.a ? '<span>From ' + at(S.a) + ' to ' + at(S.b) + ' ' + (S.u === 'cm' ? 'cm' : S.u === 'm' ? 'cm' : 'in') + '</span>' : ''));
      }
      O.rootDrag(v, {
        down: function (p, e) { var which = dragKind(e); if (!which) return null; return { which: which, c: RU[S.u], k: UW / RU[S.u].max, p0: p, a0: S.a, b0: S.b, s: step() }; },
        move: function (p, c, moved) {
          if (!moved) return;
          var u = (p.x - MX) / c.k;
          if (c.which === 'a') S.a = O.clamp(snap(u), 0, S.b - c.s);
          else if (c.which === 'b') S.b = O.clamp(snap(u), S.a + c.s, c.c.max);
          else { var d = snap((p.x - c.p0.x) / c.k); d = O.clamp(d, -c.a0, c.c.max - c.b0); S.a = snap(c.a0 + d); S.b = snap(c.b0 + d); }
          draw();
        },
        up: function (p, c, moved) { if (moved) api.redraw(); }
      });
      api.onResize(draw);
      api.onRedraw(draw);
    }
  });

  /* ═════════ SCALE & BALANCE ═════════ */
  var WTS = [1, 2, 5, 10, 20, 50, 100, 500, 1000];
  function wLabel(g) { return g >= 1000 ? g / 1000 + ' kg' : g + ' g'; }
  function kgg(g) { var k = Math.floor(g / 1000), r = g % 1000; return k ? k + ' kg' + (r ? ' ' + r + ' g' : '') : r + ' g'; }
  function lboz(o) { var l = Math.floor(o / 16), r = o % 16; return l ? l + ' lb' + (r ? ' ' + r + ' oz' : '') : r + ' oz'; }
  O.register('scale', {
    defaults: { m: 'dial', u: 'kg', mx: 5, tk: 100, w: 2400, bw: 350, L: [], off: 0 },
    mount: function (api) {
      var S = api.S;
      function wMax() { return S.u === 'kg' ? S.mx * 1000 : S.mx * 16; }
      api.quick([['Kitchen scale', { m: 'dial', u: 'kg', mx: 1, tk: 20, w: 640, off: 0 }], ['Big scale', { m: 'dial', u: 'kg', mx: 5, tk: 100, w: 2400, off: 0 }], ['Pounds', { m: 'dial', u: 'lb', mx: 5, tk: 2, w: 38, off: 0 }], ['Balance', { m: 'bal', L: [] }]]);
      var kgMax, kgTk, lbMax, lbTk, wIn;
      var bG = grp(api, function () { api.button('Take all weights off', function () { S.L = []; api.redraw(); }, '', api.row()); });
      api.more();
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
        /* the answer the student reads off the dial: teachers only */
        wIn = api.teacherOnly(api.num('Weight on the scale (grams, or ounces for lb)', 'w', 0, 10000, 1, function () { S.w = Math.min(S.w, wMax()); }));
      });
      var kG, lG;
      var bG2 = grp(api, function () { api.teacherOnly(api.num('Mystery box weight (grams)', 'bw', 1, 5000, 1)); });
      api.endMore();
      function vis() { showG(dG, S.m === 'dial'); showG(bG.concat(bG2), S.m === 'bal'); if (S.m === 'dial') { showG(kG, S.u === 'kg'); showG(lG, S.u === 'lb'); } }
      vis();

      var v = stageSvg(api, 'Scale'); v.style.width = '100%';
      var CX = 200, CY = 230, R = 150;
      function panTotal() { return S.L.reduce(function (a, b) { return a + b; }, 0); }
      function draw() {
        if (S.m === 'dial') {
          api.say(S.off ? 'Drag the box onto the scale. Then read the dial.' : 'Read the dial. Drag the box off and on again, or drag the red pointer.');
          var mx = wMax(), tk = S.tk, nT = mx / tk; if (nT > 200) tk = tk * Math.ceil(nT / 200);
          var major = S.u === 'kg' ? (S.mx === 1 ? 100 : 1000) : (S.mx === 1 ? 4 : 16);
          reset(v, 560, 450, '-160 -50 560 450', 'Platform scale'); v.style.maxWidth = '560px';
          O.s('line', { x1: -160, y1: 392, x2: 400, y2: 392, stroke: '#C9CFDF', 'stroke-width': 3 }, v);
          O.s('rect', { x: 60, y: 22, width: 280, height: 22, rx: 6, fill: '#AEB6CC' }, v);
          O.s('rect', { x: 190, y: 44, width: 20, height: 22, fill: '#AEB6CC' }, v);
          var shown = S.off ? 0 : S.w;
          O.s('rect', { x: 30, y: 62, width: 340, height: 330, rx: 40, fill: '#E7EAF2', stroke: '#AEB6CC', 'stroke-width': 3 }, v);
          O.s('circle', { cx: CX, cy: CY, r: R + 8, fill: '#fff', stroke: NAVY, 'stroke-width': 3, class: 'paper' }, v);
          var tp = '';
          for (var q = 0; q < mx; q += tk) { var a = q / mx * 2 * Math.PI, isM = q % major === 0, ln = isM ? 18 : 9; tp += 'M' + (CX + R * Math.sin(a)).toFixed(1) + ',' + (CY - R * Math.cos(a)).toFixed(1) + 'L' + (CX + (R - ln) * Math.sin(a)).toFixed(1) + ',' + (CY - (R - ln) * Math.cos(a)).toFixed(1); }
          O.s('path', { d: tp, stroke: NAVY, 'stroke-width': 1.6, class: 'inks' }, v);
          for (var m = 0; m < mx; m += major) {
            var aa = m / mx * 2 * Math.PI, t = S.u === 'kg' ? (S.mx === 1 ? String(m) : m / 1000 + (m ? ' kg' : '')) : (S.mx === 1 ? (m ? m + ' oz' : '0') : m / 16 + (m ? ' lb' : ''));
            O.s('text', { x: CX + (R - 36) * Math.sin(aa), y: CY - (R - 36) * Math.cos(aa) + 5, 'text-anchor': 'middle', 'font-size': 14, fill: NAVY, class: 'ink', text: m === 0 ? '0' : t }, v);
          }
          /* on a 1 kg (or 1 lb) dial the top mark is both 0 and a full turn: say so under the 0 */
          if (S.mx === 1) O.s('text', { x: CX, y: CY - R + 55, 'text-anchor': 'middle', 'font-size': 11, fill: MUTE, text: '(' + (S.u === 'kg' ? '1 kg' : '1 lb') + ')' }, v);
          if (S.u === 'kg' && S.mx === 1) O.s('text', { x: CX, y: CY + 42, 'text-anchor': 'middle', 'font-size': 13, fill: MUTE, text: 'grams' }, v);
          var deg = (spinA != null ? spinA : Math.min(shown, mx) / mx * 360);
          var pg = O.s('g', { 'data-drag': 'p', style: 'cursor:grab', transform: 'rotate(' + deg + ' ' + CX + ' ' + CY + ')' }, v);
          O.s('line', { x1: CX, y1: CY, x2: CX, y2: CY - R + 6, stroke: 'transparent', 'stroke-width': 26, 'data-drag': 'p' }, pg);
          O.s('line', { x1: CX, y1: CY, x2: CX, y2: CY - R + 6, stroke: '#D2453B', 'stroke-width': 4, 'stroke-linecap': 'round', 'data-drag': 'p' }, pg);
          O.s('circle', { cx: CX, cy: CY, r: 9, fill: '#D2453B' }, v);
          O.keys(pg, function (d) { S.off = 0; S.w = O.clamp(S.w + d * S.tk, 0, mx); api.redraw(); }, 'Scale pointer', 'pointer', function () { return S.u === 'kg' ? kgg(shown) : lboz(shown); });
          /* the box: on the platform, or on the floor beside the scale */
          var bg = O.s('g', { style: 'cursor:grab' }, v), bx = S.off ? -140 : 145, byy = S.off ? 340 : -30;
          O.s('rect', { x: bx, y: byy, width: 110, height: 52, rx: 4, fill: '#D9A35F', stroke: '#9A6A2E', 'stroke-width': 2 }, bg);
          O.s('text', { x: bx + 55, y: byy + 36, 'text-anchor': 'middle', 'font-size': 28, fill: '#5A3A12', text: '?' }, bg);
          O.dragTap(v, bg, function () { boxTo(!!S.off); }, function (p) { var onPlat = p.x > 20 && p.x < 380 && p.y < 90; if (onPlat === !S.off) return false; boxTo(onPlat); return true; }, S.off ? 'Put the box on the scale' : 'Take the box off the scale', 'box');
          api.readout('<span>Weight: <b>' + (S.u === 'kg' ? kgg(shown) : lboz(shown)) + '</b></span><span>= ' + (S.u === 'kg' ? shown.toLocaleString('en-US') + ' g' : shown + ' oz') + '</span>');
          api.report({ v: String(shown) });
        } else {
          api.say('Drag weights onto the right pan. Drag them off to take them away. Make the pans level.');
          var nw = api.stage.clientWidth > 0 && api.stage.clientWidth < 560, BW2 = nw ? 440 : 700, MID = BW2 / 2, ARM = nw ? 150 : 210, per = nw ? 5 : 9, TRY = 292, TH = nw ? 136 : 80;
          reset(v, BW2, TRY + TH + 8, null, 'Pan balance'); v.style.maxWidth = '';
          var left = S.bw, right = panTotal();
          var th = thAnim != null ? thAnim : tiltOf(left, right), rad = th * Math.PI / 180;
          BAL = { MID: MID, TRY: TRY };
          O.s('path', { d: 'M' + MID + ',120L' + (MID - 30) + ',250H' + (MID + 30) + 'Z', fill: '#AEB6CC' }, v);
          O.s('rect', { x: MID - 80, y: 248, width: 160, height: 12, rx: 4, fill: '#8E98B3' }, v);
          var ex = ARM * Math.cos(rad), ey = ARM * Math.sin(rad);
          O.s('line', { x1: MID - ex, y1: 120 - ey, x2: MID + ex, y2: 120 + ey, stroke: NAVY, 'stroke-width': 8, 'stroke-linecap': 'round', class: 'inks' }, v);
          O.s('circle', { cx: MID, cy: 120, r: 8, fill: YEL }, v);
          O.s('line', { x1: MID, y1: 104, x2: MID + 26 * Math.sin(rad), y2: 104 - 26 * Math.cos(rad), stroke: '#D2453B', 'stroke-width': 3 }, v);
          function pan(x, y) { O.s('path', { d: 'M' + x + ',' + y + 'L' + (x - 60) + ',' + (y + 70) + 'M' + x + ',' + y + 'L' + (x + 60) + ',' + (y + 70), stroke: MUTE, 'stroke-width': 1.5 }, v); O.s('path', { d: 'M' + (x - 78) + ',' + (y + 70) + 'H' + (x + 78) + 'l-14,16H' + (x - 64) + 'Z', fill: '#C9CFDF', stroke: MUTE, 'stroke-width': 2 }, v); return y + 70; }
          var ly = pan(MID - ex, 120 - ey), ry = pan(MID + ex, 120 + ey), lx = MID - ex, rx = MID + ex;
          O.s('rect', { x: lx - 34, y: ly - 54, width: 68, height: 54, rx: 4, fill: '#D9A35F', stroke: '#9A6A2E', 'stroke-width': 2 }, v);
          O.s('text', { x: lx, y: ly - 18, 'text-anchor': 'middle', 'font-size': 28, fill: '#5A3A12', text: '?' }, v);
          var sorted = S.L.slice().sort(function (a, b) { return b - a; }), wx = 0, wy = 0;
          sorted.forEach(function (g, i) {
            var w = g >= 500 ? 40 : g >= 50 ? 32 : 24, h = g >= 500 ? 26 : g >= 50 ? 20 : 15;
            if (wx + w > 140) { wx = 0; wy += 26; }
            var x0 = rx - 70 + wx, y0 = ry - h - wy, gg = O.s('g', {}, v);
            O.s('rect', { x: x0, y: y0, width: w - 2, height: h, rx: 3, fill: '#B8BFCC', stroke: '#5B6478', 'stroke-width': 1.5 }, gg);
            O.s('text', { x: x0 + w / 2 - 1, y: y0 + h / 2 + 4, 'text-anchor': 'middle', 'font-size': g >= 100 ? 9 : 10, fill: '#1B2238', text: wLabel(g) }, gg);
            function off() { setL(function () { var i = S.L.indexOf(g); if (i > -1) S.L.splice(i, 1); }); }
            O.dragTap(v, gg, off, function (p) { if (p.y >= BAL.TRY - 10 || p.x < BAL.MID - 20) { off(); return true; } return false; }, 'Take off ' + wLabel(g), 'pw-' + i);
            wx += w;
          });
          var tg = O.s('g', { 'data-ui': 'tray' }, v);
          O.s('rect', { x: 10, y: TRY, width: BW2 - 20, height: TH, rx: 12, fill: '#F1F3F8', stroke: LINE, 'stroke-width': 2 }, tg);
          O.s('text', { x: 20, y: TRY + 16, 'font-size': 12, fill: MUTE, text: 'WEIGHTS' }, tg);
          var colW = (BW2 - 40) / per;
          WTS.forEach(function (g, i) {
            var cx = 20 + colW * (i % per) + colW / 2, base = TRY + 68 + Math.floor(i / per) * 56, gg = O.s('g', {}, tg), h = g >= 500 ? 40 : g >= 50 ? 32 : 26, w = Math.min(colW - 8, g >= 500 ? 62 : g >= 50 ? 54 : 46);
            O.s('rect', { x: cx - w / 2, y: base - h, width: w, height: h, rx: 5, fill: '#B8BFCC', stroke: '#5B6478', 'stroke-width': 2 }, gg);
            O.s('text', { x: cx, y: base - h / 2 + 5, 'text-anchor': 'middle', 'font-size': 13, fill: '#1B2238', text: wLabel(g) }, gg);
            O.dragTap(v, gg, function () { addW(g); }, function (p) { return p.y < BAL.TRY && addW(g); }, 'Put ' + wLabel(g) + ' on the right pan', 'wt-' + g);
          });
          var msg = left === right ? '<span style="color:' + GRN + '">Balanced! The box weighs ' + kgg(left) + '.</span>' : left > right ? '<span>The box is heavier. Add more weights.</span>' : '<span>The weights are heavier. Take some off.</span>';
          api.readout('<span>Weights on the pan: <b>' + kgg(right) + '</b></span>' + msg);
          api.report({ v: String(right), b: left === right ? 'yes' : 'no' });
        }
      }
      var thAnim = null, spinA = null, BAL = null;
      function tiltOf(l, r) { return l === r ? 0 : O.clamp((r - l) / Math.max(l, r) * 16, -14, 14); }
      /* a short tween that stops if the tool was remounted while it ran; each frame redraws without losing keyboard focus */
      function tween(from, to, ms, set, done) { if (O.reduce) { done(); return; } var t0 = performance.now(); (function f(t) { if (!v.isConnected) return; var k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3); set(from + (to - from) * e); if (k < 1) requestAnimationFrame(f); else done(); })(t0); }
      function drawKeep() { var f = O.focusKey(api.stage); draw(); O.refocus(api.stage, f); }
      /* change the right pan, then let the beam swing to its new tilt */
      function setL(fn) { var a0 = tiltOf(S.bw, panTotal()); fn(); var a1 = tiltOf(S.bw, panTotal());
        api.redraw(); if (a0 !== a1) tween(a0, a1, 450, function (x) { thAnim = x; drawKeep(); }, function () { thAnim = null; drawKeep(); }); }
      function addW(g) { if (S.L.length >= 24) { O.toast('The pan is full.'); return false; } setL(function () { S.L.push(g); }); return true; }
      /* put the box on or off the platform; the pointer swings */
      function boxTo(on) { var mx = wMax(), a0 = S.off ? 0 : Math.min(S.w, mx) / mx * 360; S.off = on ? 0 : 1; var a1 = S.off ? 0 : Math.min(S.w, mx) / mx * 360;
        api.redraw(); tween(a0, a1, 700, function (x) { spinA = x; drawKeep(); }, function () { spinA = null; drawKeep(); }); }
      /* drag the red pointer round the dial */
      O.rootDrag(v, {
        down: function (p, e) { return S.m === 'dial' && dragKind(e) === 'p' ? { p: 1 } : null; },
        move: function (p, c, moved) {
          if (!moved) return; S.off = 0;
          var a = Math.atan2(p.x - CX, CY - p.y); if (a < 0) a += 2 * Math.PI;
          var mx = wMax(), w = Math.round(a / (2 * Math.PI) * mx / S.tk) * S.tk;
          if (Math.abs(w - S.w) > mx / 2) w = S.w > mx / 2 ? mx : 0;
          S.w = O.clamp(w, 0, mx); wIn.value = S.w; draw();
        },
        up: function (p, c, moved) { if (moved) api.redraw(); }
      });
      api.onResize(function () { if (S.m === 'bal') draw(); });
      api.onRedraw(draw);
    }
  });

  /* ═════════ BEAKERS & MEASURING CUPS ═════════ */
  function cupText(c) { var n = Math.round(c * 4), g = O.gcd(n, 4); return n ? O.mixed(n / g, 4 / g) : '0'; }
  /* "1 cup", "1/4 cup", "2 cups": one or less is singular */
  function unitN(x, one, many) { return x > 1 ? many : one; }
  O.register('beaker', {
    defaults: { u: 'ml', mx: 1000, tk: 100, c: 1, a0: 0, a1: 0 },
    mount: function (api) {
      var S = api.S, mlMx, mlTk, cupTk, qtTk, a0In, a1In;
      api.say('Drag up or down inside a beaker to fill it. To pour, drag the yellow handle over the other beaker.');
      api.quick([['Milliliters', { u: 'ml', mx: 1000, tk: 100, c: 1, a0: 400, a1: 0 }], ['2 beakers', { u: 'ml', mx: 1000, tk: 100, c: 2, a0: 600, a1: 200 }], ['Cups', { u: 'cup', mx: 4, tk: 0.25, c: 1, a0: 1.5, a1: 0 }], ['Quarts and gallon', { u: 'qt', mx: 4, tk: 1, c: 1, a0: 3, a1: 0 }]]);
      api.more();
      api.seg('Units', 'u', [['ml', 'Milliliters'], ['cup', 'Cups'], ['qt', 'Gallon jug']], function (u) {
        if (u === 'ml') { S.mx = 1000; S.tk = 100; S.a0 = 400; } else if (u === 'cup') { S.mx = 4; S.tk = 0.25; S.a0 = 1.5; } else { S.mx = 4; S.tk = 1; S.a0 = 3; }
        S.a1 = 0; mlMx.value = S.mx; [mlTk, cupTk, qtTk].forEach(function (s) { s.value = S.tk; }); a0In.value = S.a0; a1In.value = 0;
        showG(mG, u === 'ml'); showG(cG, u === 'cup'); showG(qG, u === 'qt');
      });
      var mG = grp(api, function () {
        mlMx = api.select('Biggest amount', 'mx', [[500, '500 mL'], [1000, '1 L (1,000 mL)'], [2000, '2 L (2,000 mL)']], fit);
        mlTk = api.select('Small marks every', 'tk', [[10, '10 mL'], [25, '25 mL'], [50, '50 mL'], [100, '100 mL'], [200, '200 mL']], fit);
      });
      var cG = grp(api, function () { var sg = api.seg('Small marks every', 'tk', [[0.25, O.frac(1, 4) + ' cup'], [0.5, O.frac(1, 2) + ' cup']], fit); cupTk = { set value(x) { sg.paint(); } }; });
      var qG = grp(api, function () { qtTk = api.select('Small marks every', 'tk', [[0.25, '1 cup'], [0.5, '1 pint'], [1, '1 quart']], fit); });
      showG(mG, S.u === 'ml'); showG(cG, S.u === 'cup'); showG(qG, S.u === 'qt');
      api.num('How many beakers', 'c', 1, 2, 1);
      /* the amounts are what students read off the beaker: teachers only */
      a0In = api.teacherOnly(api.num('Amount in A', 'a0', 0, 2000, 'any', fit));
      a1In = api.teacherOnly(api.num('Amount in B', 'a1', 0, 2000, 'any', fit));
      api.endMore();
      function snap(x) { return Math.round(Math.round(x / S.tk) * S.tk * 1000) / 1000; }
      function fit() { S.a0 = O.clamp(snap(S.a0), 0, S.mx); S.a1 = O.clamp(snap(S.a1), 0, S.mx); }
      function amt(x) {
        if (S.u === 'ml') return '<b>' + x.toLocaleString('en-US') + ' mL</b>' + (x >= 1000 ? ' = ' + Math.floor(x / 1000) + ' L' + (x % 1000 ? ' ' + x % 1000 + ' mL' : '') : '');
        if (S.u === 'cup') { var s = '<b>' + cupText(x) + unitN(x, ' cup', ' cups') + '</b>', q = Math.floor(x / 4), r = x - 4 * q, p = Math.floor(r / 2), cu = r - 2 * p, parts = [];
          if (x >= 2) { if (q) parts.push(q + unitN(q, ' quart', ' quarts')); if (p) parts.push(p + unitN(p, ' pint', ' pints')); if (cu) parts.push(cupText(cu) + unitN(cu, ' cup', ' cups')); s += ' = ' + parts.join(' '); } return s; }
        var cups = Math.round(x * 4), pints = x * 2; return '<b>' + cupText(x) + unitN(x, ' quart', ' quarts') + '</b> = ' + (pints % 1 ? cupText(pints) : pints) + unitN(pints, ' pint', ' pints') + ' = ' + cups + unitN(cups, ' cup', ' cups') + (x === 4 ? ' = 1 gallon' : '');
      }
      /* the same amount in plain words for a screen reader */
      function spoken(x) { return S.u === 'ml' ? O.fmt(x) + ' milliliters' : O.fmt(x) + (S.u === 'cup' ? unitN(x, ' cup', ' cups') : unitN(x, ' quart', ' quarts')); }
      var v = stageSvg(api, 'Beakers'), btns = O.el('div', { class: 'om-row om-noprint' }); api.stage.appendChild(btns); v.style.width = '100%';
      var GT = 50, GB = 350, BWd = 130;
      function tickLab(q) {
        if (S.u === 'ml') return q === 1000 ? '1 L' : q === 2000 ? '2 L' : q + ' mL';
        if (S.u === 'cup') return q % 1 ? null : q + (q === 1 ? ' cup' : ' cups'); /* halves are drawn stacked */
        return q === 4 ? '1 gal' : q + ' qt';
      }
      /* a mixed number like 1 and one half, stacked, right-aligned at x */
      function halfLab(p, x, y, q) { var w = Math.floor(q), fx = x - 8; sFrac(p, fx, y - 1, 1, 2, 11, NAVY, 'ink'); if (w) O.s('text', { x: fx - 10, y: y + 5, 'text-anchor': 'end', 'font-size': 13, fill: NAVY, class: 'ink', text: String(w) }, p); }
      var water = [];
      function lv(i) { return i ? S.a1 : S.a0; }
      function setLv(i, x) { x = O.clamp(snap(x), 0, S.mx); if (i) S.a1 = x; else S.a0 = x; (i ? a1In : a0In).value = x; }
      /* pour everything that fits from beaker i0 into the other one */
      function pourFrom(i0) { var m = i0 === 0 ? Math.min(S.a0, S.mx - S.a1) : Math.min(S.a1, S.mx - S.a0);
        if (!m) { O.toast(lv(i0) ? 'The other beaker is full.' : 'This beaker is empty.'); return false; }
        pour(function () { if (i0 === 0) { setLv(0, S.a0 - m); setLv(1, S.a1 + m); } else { setLv(1, S.a1 - m); setLv(0, S.a0 + m); } }); return true; }
      function draw() {
        btns.innerHTML = '';
        if (S.c > 1) reset(v, S.c * 260, 460, '0 -60 ' + (S.c * 260) + ' 460'); else reset(v, 260, 400);
        v.style.maxWidth = (S.c * 300) + 'px';
        var nT = S.mx / S.tk, lstep = S.tk; [1, 2, 4, 5, 10, 20].some(function (k) { lstep = S.tk * k; return S.mx / lstep <= 10 && Math.abs(Math.round(S.mx / lstep) - S.mx / lstep) < 1e-9; });
        if (S.u !== 'ml') lstep = S.u === 'cup' ? (S.tk === 0.25 ? 0.5 : 1) : 1;
        for (var i = 0; i < S.c; i++) {
          var ox = i * 260 + 90, H = GB - GT, y = function (x) { return GB - x / S.mx * H; }, jug = S.u === 'qt', gB = O.s('g', {}, v);
          O.s('rect', { x: ox, y: GT - 10, width: BWd, height: H + 10, rx: jug ? 22 : 4, fill: '#F4FAFF', stroke: '#7E9CC0', 'stroke-width': 3, class: 'paper' }, gB);
          var L = lv(i), wy = y(L), wr = O.s('rect', { x: ox + 3, y: wy, width: BWd - 6, height: Math.max(0, GB - wy - 2), rx: 3, fill: '#5DB3EA', opacity: L > 0 ? .85 : 0 }, gB);
          var wl = O.s('rect', { x: ox + 3, y: wy, width: BWd - 6, height: 4, fill: '#2F8FD0', opacity: L > 0 ? 1 : 0 }, gB);
          water[i] = { r: wr, l: wl, y: y, g: gB, ox: ox };
          var tp = '';
          for (var k = 0; k <= nT + 1e-9; k++) { var q = Math.round(k * S.tk * 1000) / 1000, isL = Math.abs(q / lstep - Math.round(q / lstep)) < 1e-9; tp += 'M' + ox + ',' + y(q).toFixed(1) + 'h' + (isL ? 26 : 13);
            if (isL && q > 0) { var tl = tickLab(q); if (tl === null) halfLab(gB, ox - 4, y(q), q); else O.s('text', { x: ox - 8, y: y(q) + 5, 'text-anchor': 'end', 'font-size': 13, fill: NAVY, class: 'ink', text: tl }, gB); } }
          O.s('path', { d: tp, stroke: NAVY, 'stroke-width': 1.6, class: 'inks' }, gB);
          if (jug && S.c === 1) O.s('text', { x: ox + BWd / 2, y: GT - 16, 'text-anchor': 'middle', 'font-size': 13, fill: MUTE, text: '1 gallon jug' }, gB);
          O.s('text', { x: ox + BWd / 2, y: GB + 34, 'text-anchor': 'middle', 'font-size': 20, fill: NAVY, class: 'ink', text: S.c > 1 ? (i ? 'B' : 'A') : '' }, gB);
          var hit = O.s('rect', { x: ox, y: GT - 10, width: BWd, height: H + 14, fill: 'transparent', 'data-drag': String(i), style: 'cursor:ns-resize' }, gB);
          (function (i) { O.keys(hit, function (d) { setLv(i, lv(i) + d * S.tk); api.redraw(); }, 'Water in beaker ' + (i ? 'B' : 'A'), 'beaker-' + i, function () { return spoken(lv(i)); }); })(i);
          if (S.c > 1) { var gr = O.s('g', { 'data-drag': 'pour', 'data-i': i, 'data-ui': 'btn', style: 'cursor:grab' }, gB);
            O.s('rect', { x: ox + 10, y: GT - 48, width: BWd - 20, height: 30, rx: 9, fill: YEL, stroke: NAVY, 'stroke-width': 1.5 }, gr);
            O.s('text', { x: ox + BWd / 2, y: GT - 28, 'text-anchor': 'middle', 'font-size': 13, fill: NAVY, text: 'Drag to pour' }, gr);
            (function (i) { O.tap(gr, function () { pourFrom(i); }, 'Pour ' + (i ? 'B into A' : 'A into B'), 'pour-' + i); })(i); }
        }
        if (S.c > 1) {
          api.button('Pour A into B', function () { pourFrom(0); }, '', btns);
          api.button('Pour B into A', function () { pourFrom(1); }, '', btns);
        }
        api.button('Empty' + (S.c > 1 ? ' both' : ''), function () { setLv(0, 0); setLv(1, 0); api.redraw(); }, '', btns);
        var out = '<span>' + (S.c > 1 ? 'A: ' : '') + amt(S.a0) + '</span>';
        if (S.c > 1) out += '<span>B: ' + amt(S.a1) + '</span><span>Together: ' + amt(Math.round((S.a0 + S.a1) * 1000) / 1000) + '</span>';
        api.readout(out);
        api.report({ v: String(S.u === 'qt' ? Math.round(S.a0 * 4 * 1000) / 1000 : S.a0) });
      }
      /* pour: change the levels, redraw, then slide the water from the old level to the new one */
      function pour(fn) {
        var old = [S.a0, S.a1]; fn(); api.redraw();
        [0, 1].forEach(function (i) { var w = water[i]; if (!w || old[i] === lv(i)) return;
          var y0 = w.y(old[i]), y1 = w.y(lv(i));
          w.r.setAttribute('opacity', .85); w.l.setAttribute('opacity', 1);
          O.anim(w.r, { y: y0, height: Math.max(0, GB - y0 - 2) }, { y: y1, height: Math.max(0, GB - y1 - 2) }, 600, function () { if (!lv(i)) { w.r.setAttribute('opacity', 0); w.l.setAttribute('opacity', 0); } });
          O.anim(w.l, { y: y0 }, { y: y1 }, 600); });
      }
      O.rootDrag(v, {
        down: function (p, e) {
          var kind = dragKind(e); if (kind == null) return null;
          if (kind === 'pour') { var t = e.target.closest('[data-drag]'), i0 = +t.getAttribute('data-i'), w = water[i0], tw = water[1 - i0]; return { pour: 1, i0: i0, w: w, tw: tw, p0: p, over: false, dx: 0, dy: 0, dir: tw.ox > w.ox ? 1 : -1 }; }
          var i = +kind; setLv(i, (GB - p.y) / (GB - GT) * S.mx); draw(); return { i: i };
        },
        move: function (p, c, moved) {
          if (!moved) return;
          if (!c.pour) { setLv(c.i, (GB - p.y) / (GB - GT) * S.mx); draw(); return; }
          var w = c.w, tw = c.tw; c.dx = p.x - c.p0.x; c.dy = Math.min(p.y - c.p0.y, 0); if (w.g.nextSibling) w.g.parentNode.appendChild(w.g);
          var cx = w.ox + BWd / 2 + c.dx; c.over = Math.abs(cx - (tw.ox + BWd / 2 - c.dir * BWd * 0.6)) < BWd * 0.8 && c.dy < -20;
          w.g.setAttribute('transform', 'translate(' + c.dx + ' ' + c.dy + ')' + (c.over ? ' rotate(' + (c.dir * 42) + ' ' + (w.ox + BWd / 2) + ' ' + GT + ') translate(' + (w.ox + BWd / 2) + ' ' + GT + ') scale(.72) translate(' + -(w.ox + BWd / 2) + ' ' + -GT + ')' : ''));
        },
        up: function (p, c, moved) {
          if (!c.pour) { api.redraw(); return; }
          if (!moved) return; /* a tap on the handle: O.tap pours */
          if (!c.over) { api.redraw(); return; }
          var i0 = c.i0, j = 1 - i0, w = c.w, tw = c.tw, m = i0 === 0 ? Math.min(S.a0, S.mx - S.a1) : Math.min(S.a1, S.mx - S.a0);
          if (!m) { O.toast(lv(i0) ? 'The other beaker is full.' : 'This beaker is empty.'); api.redraw(); return; }
          var mx = w.ox + BWd / 2 + c.dx + c.dir * 45, my = GT + c.dy + 35;
          var st = O.s('path', { d: 'M' + mx + ',' + my + 'Q' + (mx + c.dir * 20) + ',' + (my + 40) + ' ' + (tw.ox + BWd / 2) + ',' + (tw.y(lv(j)) - 2), stroke: '#5DB3EA', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, v);
          setTimeout(function () { st.remove(); if (!v.isConnected) return; pour(function () { if (i0 === 0) { setLv(0, S.a0 - m); setLv(1, S.a1 + m); } else { setLv(1, S.a1 - m); setLv(0, S.a0 + m); } }); }, O.reduce ? 0 : 450);
        }
      });
      api.onRedraw(draw);
    }
  });

  /* ═════════ CLOCK & TIMER ═════════ */
  var timerInt = null;
  function hm(t) { t = ((t % 1440) + 1440) % 1440; var h = Math.floor(t / 60) % 12 || 12, m = t % 60; return h + ':' + (m < 10 ? '0' : '') + m + (t < 720 ? ' a.m.' : ' p.m.'); }
  function dur(e) { var h = Math.floor(e / 60), m = e % 60, parts = []; if (h) parts.push(h + (h === 1 ? ' hour' : ' hours')); if (m || !h) parts.push(m + (m === 1 ? ' minute' : ' minutes')); return parts.join(' '); }
  O.register('clock', {
    defaults: { t: 550, sn: 5, dg: 1, el: 0, st: 480, tmr: 0 },
    mount: function (api) {
      var S = api.S; clearInterval(timerInt); timerInt = null;
      api.say('Drag the long hand or the short hand to set the time.');
      api.quick([['Tell time', { el: 0, tmr: 0 }], ['Time passed', { el: 1, tmr: 0, st: 540, t: 540 }], ['Timer', { el: 0, tmr: 1 }]]);
      api.heading('Set the clock');
      inputRow(api, 'like 3:45 pm', 'Time to show', function (txt) {
        var m = String(txt).trim().match(/^(\d{1,2}):(\d{2})\s*([ap])?\.?\s*m?\.?$/i); if (!m || +m[1] > 12 || +m[1] < 1 || +m[2] > 59) { O.toast('Type a time like 3:45 pm'); return; }
        var h = +m[1] % 12; if (m[3] && m[3].toLowerCase() === 'p') h += 12; else if (!m[3] && S.t >= 720) h += 12;
        S.t = h * 60 + +m[2]; api.redraw();
      });
      api.more();
      api.seg('The long hand moves by', 'sn', [[5, '5 minutes'], [1, '1 minute']]);
      api.check('Show the digital time', 'dg');
      api.check('Time passed (start time and end time)', 'el');
      api.check('Show the timer', 'tmr');
      api.endMore();

      var v = stageSvg(api, 'Clock'), ctr = O.el('div', { class: 'om-row om-noprint' }), tbox = O.el('div', { class: 'om-noprint' });
      api.stage.appendChild(ctr); api.stage.appendChild(tbox); v.style.width = '100%'; v.style.maxWidth = '470px';
      var CX = 200, CY = 200, R = 180;
      function hand(ang, len, w, col, key, cls) {
        var a = ang * Math.PI / 180, x = CX + len * Math.sin(a), y = CY - len * Math.cos(a), g = O.s('g', { 'data-drag': key, style: 'cursor:grab' }, v);
        O.s('line', { x1: CX, y1: CY, x2: x, y2: y, stroke: 'transparent', 'stroke-width': 30, 'data-drag': key }, g);
        O.s('line', { x1: CX, y1: CY, x2: x, y2: y, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'data-drag': key, class: cls || '' }, g);
        return g;
      }
      function draw() {
        ctr.innerHTML = '';
        api.say(S.el ? 'Tap Set start time. Then drag the long hand forward and watch the time that passes fill in.' : 'Drag the long hand or the short hand to set the time.');
        reset(v, 400, 400, null, 'Clock showing ' + hm(S.t));
        O.s('circle', { cx: CX, cy: CY, r: R + 12, fill: VIO }, v);
        O.s('circle', { cx: CX, cy: CY, r: R, fill: '#fff', class: 'paper' }, v);
        if (S.el) {
          var e = ((S.t - S.st) % 1440 + 1440) % 1440, sm = (S.st % 60) * 6;
          /* whole hours as a green wedge in the middle, the minutes left over as a yellow wedge round the edge */
          if (e > 60) { var a0 = (S.st % 720) / 2; O.s('path', { d: pie(CX, CY, R * 0.62, a0, a0 + Math.min(e, 720) / 2), fill: GRN, opacity: .3 }, v); }
          var rem = e > 60 ? e % 60 : e;
          if (rem > 0) O.s('path', { d: pie(CX, CY, R - 4, sm, sm + rem * 6), fill: YEL, opacity: .45 }, v);
          var sa = sm * Math.PI / 180; O.s('line', { x1: CX, y1: CY, x2: CX + (R - 30) * Math.sin(sa), y2: CY - (R - 30) * Math.cos(sa), stroke: '#AEB6CC', 'stroke-width': 4, 'stroke-dasharray': '6 5' }, v);
        }
        var tp = ''; for (var i = 0; i < 60; i++) { var a = i * 6 * Math.PI / 180, l = i % 5 ? 8 : 16; tp += 'M' + (CX + R * Math.sin(a)).toFixed(1) + ',' + (CY - R * Math.cos(a)).toFixed(1) + 'L' + (CX + (R - l) * Math.sin(a)).toFixed(1) + ',' + (CY - (R - l) * Math.cos(a)).toFixed(1); }
        O.s('path', { d: tp, stroke: NAVY, 'stroke-width': 2, class: 'inks' }, v);
        for (var h = 1; h <= 12; h++) { var ah = h * 30 * Math.PI / 180; O.s('text', { x: CX + (R - 40) * Math.sin(ah), y: CY - (R - 40) * Math.cos(ah) + 10, 'text-anchor': 'middle', 'font-size': 30, fill: NAVY, class: 'ink', text: String(h) }, v); }
        var hk = hand((S.t % 720) / 2, R * 0.5, 10, NAVY, 'h', 'inks'), mk = hand((S.t % 60) * 6, R * 0.82, 6, VIO, 'm');
        O.keys(mk, function (d) { S.t = (S.t + d * S.sn + 1440) % 1440; api.redraw(); }, 'Minute hand', 'minute', function () { return hm(S.t); });
        O.keys(hk, function (d) { S.t = (S.t + d * 60 + 1440) % 1440; api.redraw(); }, 'Hour hand', 'hour', function () { return hm(S.t); });
        O.s('circle', { cx: CX, cy: CY, r: 9, fill: YEL, stroke: NAVY, 'stroke-width': 2 }, v);
        /* buttons */
        var ap = O.el('button', { type: 'button', class: 'om-btn small' }, S.t < 720 ? 'a.m. → p.m.' : 'p.m. → a.m.'); ap.onclick = function () { S.t = (S.t + 720) % 1440; api.redraw(); }; ctr.appendChild(ap);
        [[-60, '− 1 hour'], [-S.sn, '− ' + S.sn + ' min'], [S.sn, '+ ' + S.sn + ' min'], [60, '+ 1 hour']].forEach(function (b) { api.button(b[1], function () { S.t = (S.t + b[0] + 1440) % 1440; api.redraw(); }, '', ctr); });
        if (S.el) api.button('Set start time', function () { S.st = S.t; api.redraw(); }, 'green', ctr);
        tbox.style.display = S.tmr ? '' : 'none';
        var out = '';
        if (S.dg) out += '<span>Time: <b>' + hm(S.t) + '</b></span>';
        var el = ((S.t - S.st) % 1440 + 1440) % 1440;
        if (S.el) out += '<span>Start: <b>' + hm(S.st) + '</b></span><span>End: <b>' + hm(S.t) + '</b></span><span>Time passed: <b>' + dur(el) + '</b></span>';
        api.readout(out);
        var rep = { v: hm(S.t).replace(/ [ap]\.m\.$/, '') }; if (S.el) rep.e = String(el); api.report(rep);
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
      api.onCleanup(function () { clearInterval(timerInt); timerInt = null; });
      show();

      O.rootDrag(v, {
        down: function (p, e) { var which = dragKind(e); return which ? { which: which } : null; },
        move: function (p, c, moved) {
          if (!moved) return;
          var a = Math.atan2(p.x - CX, CY - p.y) * 180 / Math.PI; if (a < 0) a += 360;
          if (c.which === 'm') { var m = (Math.round(a / 6 / S.sn) * S.sn) % 60, d = m - S.t % 60; if (d > 30) d -= 60; if (d < -30) d += 60; S.t = (S.t + d + 1440) % 1440; }
          else { var pos = Math.round(a * 2 / S.sn) * S.sn % 720, d2 = pos - S.t % 720; if (d2 > 360) d2 -= 720; if (d2 < -360) d2 += 720; S.t = (S.t + d2 + 1440) % 1440; }
          draw();
        },
        up: function (p, c, moved) { if (moved) api.redraw(); }
      });
      api.onRedraw(draw);
    }
  });
})();
