/* Geometry + space tools: tiles, geoboard, whiteboard, tangram, pattern, protractor, setsquare, compass, cubes
   (Dimensions kit: Color Tiles, cm Grid Boards, Geoboard, Tangrams, Pattern Blocks, Protractor,
    Triangle Ruler Set, Safety Compass, Centimeter/Linking Cubes) */
(function () {
  var O = OAOM;
  var VIO = '#6B46C1', GRN = '#23915A', YEL = '#F2B705', NAVY = '#0E1C42', RED = '#D2453B', BLUE = '#2F6FDE', ORG = '#F08A24', TEAL = '#138A8A', LINE = '#D9DEEA', GRAY = '#5B6478';
  var R3 = Math.sqrt(3), RAD = Math.PI / 180;

  /* ---------- shared helpers ---------- */
  function clear(v) { while (v.firstChild) v.removeChild(v.firstChild); }
  function size(v, w, h) { v.setAttribute('viewBox', '0 0 ' + w + ' ' + h); v.setAttribute('width', w); v.setAttribute('height', h); }
  function toolbar(api) { var b = O.el('div', { class: 'om-row om-noprint', style: 'margin:0 0 .5rem' }); api.stage.appendChild(b); return b; }
  function holder(api, w, h, label) { var d = O.el('div'); api.stage.appendChild(d); var v = O.svg(w, h, d, label); return v; }
  /* pointer drag on the svg root so we can redraw children mid-drag */
  function rootDrag(v, h) {
    var ctx = null, id = null, sx, sy, moved;
    v.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || ctx) return; var c = h.down(O.pt(v, e), e); if (c == null) return;
      e.preventDefault(); ctx = c; id = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false; try { v.setPointerCapture(id); } catch (x) {}
    });
    v.addEventListener('pointermove', function (e) { if (e.pointerId !== id || !ctx) return; if (Math.hypot(e.clientX - sx, e.clientY - sy) > 4) moved = true; if (h.move) h.move(O.pt(v, e), ctx, moved); });
    function up(e) { if (e.pointerId !== id || !ctx) return; var c = ctx; ctx = null; id = null; if (h.up) h.up(O.pt(v, e), c, moved); }
    v.addEventListener('pointerup', up); v.addEventListener('pointercancel', up);
  }
  function keyTap(n, fn, label) { n.setAttribute('tabindex', '0'); n.setAttribute('role', 'button'); if (label) n.setAttribute('aria-label', label); n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } }); }
  function poly(pts) { return pts.map(function (p) { return (+p[0]).toFixed(1) + ',' + (+p[1]).toFixed(1); }).join(' '); }
  function xf(pts, x, y, r, f) { var c = Math.cos(r * RAD), s = Math.sin(r * RAD); return pts.map(function (p) { var px = f ? -p[0] : p[0], py = p[1]; return [x + px * c - py * s, y + px * s + py * c]; }); }
  function center(pts) { var x = 0, y = 0; pts.forEach(function (p) { x += p[0]; y += p[1]; }); x /= pts.length; y /= pts.length; return pts.map(function (p) { return [p[0] - x, p[1] - y]; }); }
  function segDist(p, a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy, t = L ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); }
  function inPoly(p, pts) { var ins = false; for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) { if (segDist(p, pts[i], pts[j]) < 1.5) return true; var a = pts[i], b = pts[j]; if (((a[1] > p[1]) !== (b[1] > p[1])) && (p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0])) ins = !ins; } return ins; }
  function half(v) { var w = Math.floor(v), r = v - w; if (Math.abs(r) < 1e-9) return '' + w; return (w ? w : '') + O.frac(1, 2); }
  function art(w) { return /^[aeiou]/i.test(w) ? 'an' : 'a'; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  /* snap: move pts so the closest vertex pair (within tol) meets */
  function snapShift(pts, targets, tol) { var best = null, bs = -1; pts.forEach(function (p) { targets.forEach(function (t) { var d = Math.hypot(p[0] - t[0], p[1] - t[1]); if (d >= tol) return; var sh = [t[0] - p[0], t[1] - p[1]], n = 0;
      pts.forEach(function (q) { if (targets.some(function (u) { return Math.hypot(q[0] + sh[0] - u[0], q[1] + sh[1] - u[1]) < 2; })) n++; }); var score = n * 100 - d; if (score > bs) { bs = score; best = sh; } }); }); return best; }

  /* ================= COLOR TILES & AREA GRID ================= */
  O.register('tiles', {
    defaults: { cols: 10, rows: 8, unit: '', cells: {}, col: 0, edge: false },
    mount: function (api) {
      var S = api.S, C = [RED, YEL, GRN, BLUE], CN = ['Red', 'Yellow', 'Green', 'Blue'], Z = 40, M = 14, TY = 56;
      var UN = { '': ['unit', 'units'], cm: ['centimeter', 'centimeters'], m: ['meter', 'meters'], in: ['inch', 'inches'], ft: ['foot', 'feet'] };
      api.say('Drag a tile from the tray onto the grid, or drag across the grid to lay tiles. Drag a tile off the grid to pick it up.');
      var bar = toolbar(api);
      api.seg('', 'col', C.map(function (c, i) { return [i, '<span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:' + c + ';vertical-align:-2px"></span> ' + CN[i]]; }), null, bar);
      api.button('Clear', function () { S.cells = {}; api.redraw(); }, '', bar);
      api.heading('Grid');
      api.num('Columns (across)', 'cols', 1, 16, 1, trim); api.num('Rows (down)', 'rows', 1, 12, 1, trim);
      api.select('Each square is 1 square…', 'unit', [['', 'unit'], ['cm', 'centimeter'], ['m', 'meter'], ['in', 'inch'], ['ft', 'foot']]);
      api.check('Show the outline (perimeter)', 'edge');
      function trim() { Object.keys(S.cells).forEach(function (k) { var a = k.split('_'); if (+a[0] >= S.cols || +a[1] >= S.rows) delete S.cells[k]; }); }
      var v = holder(api, 100, 100, 'Grid of square tiles');
      function has(x, y) { return S.cells[x + '_' + y] != null; }
      function apply(k, mode) { if (mode === 'fill') S.cells[k] = S.col; else delete S.cells[k]; }
      function draw() {
        clear(v); var W = Math.max(S.cols * Z + 2 * M, 300), H = S.rows * Z + 2 * M; size(v, W, H + TY);
        /* tray of kit color tiles */
        O.s('rect', { x: 4, y: 4, width: W - 8, height: TY - 10, rx: 10, fill: '#F1EDFB' }, v);
        O.s('text', { x: 14, y: TY / 2 + 2, 'font-size': 13, fill: NAVY, text: 'Tiles:' }, v);
        C.forEach(function (c, i) { var tr = O.s('rect', { x: 64 + i * 46, y: TY / 2 - 18, width: 34, height: 34, rx: 5, fill: c, stroke: i === S.col ? NAVY : 'rgba(0,0,0,.25)', 'stroke-width': i === S.col ? 3 : 1.5, 'data-tray': i, style: 'cursor:grab' }, v);
          keyTap(tr, function () { S.col = i; api.redraw(); }, CN[i] + ' tile'); });
        var gG = O.s('g', { transform: 'translate(0 ' + TY + ')' }, v);
        for (var y = 0; y < S.rows; y++) for (var x = 0; x < S.cols; x++) {
          var k = x + '_' + y, r = O.s('rect', { x: M + x * Z, y: M + y * Z, width: Z, height: Z, fill: '#fff', stroke: LINE, 'stroke-width': 1.5, class: 'paper', 'data-c': k }, gG);
          (function (k) { keyTap(r, function () { apply(k, S.cells[k] != null ? 'erase' : 'fill'); api.redraw(); }, 'Square ' + k.replace('_', ', ')); })(k);
          if (S.cells[k] != null) O.s('rect', { x: M + x * Z + 2, y: M + y * Z + 2, width: Z - 4, height: Z - 4, rx: 5, fill: C[S.cells[k]] || VIO, stroke: 'rgba(0,0,0,.25)', 'stroke-width': 1.5, 'data-c': k, style: 'pointer-events:none' }, gG);
        }
        var area = 0, per = 0, edges = [];
        Object.keys(S.cells).forEach(function (k) { var a = k.split('_'), x = +a[0], y = +a[1]; area++;
          [[0, -1, x, y, x + 1, y], [0, 1, x, y + 1, x + 1, y + 1], [-1, 0, x, y, x, y + 1], [1, 0, x + 1, y, x + 1, y + 1]].forEach(function (d) { if (!has(x + d[0], y + d[1])) { per++; edges.push(d.slice(2)); } }); });
        if (S.edge) edges.forEach(function (e) {
          O.s('line', { x1: M + e[0] * Z, y1: M + e[1] * Z, x2: M + e[2] * Z, y2: M + e[3] * Z, stroke: VIO, 'stroke-width': 5, 'stroke-linecap': 'round', style: 'pointer-events:none' }, gG);
          O.s('circle', { cx: M + (e[0] + e[2]) / 2 * Z, cy: M + (e[1] + e[3]) / 2 * Z, r: 4, fill: YEL, stroke: NAVY, 'stroke-width': 1, class: 'om-num', style: 'pointer-events:none' }, gG);
        });
        var u = UN[S.unit] || UN[''], ks = Object.keys(S.cells), out = '<span>Area: <b>' + plural(area, 'square ' + u[0], 'square ' + u[1]) + '</b></span><span>Perimeter: <b>' + plural(per, u[0], u[1]) + '</b></span>';
        if (area) { var xs = ks.map(function (k) { return +k.split('_')[0]; }), ys = ks.map(function (k) { return +k.split('_')[1]; });
          var bw = Math.max.apply(0, xs) - Math.min.apply(0, xs) + 1, bh = Math.max.apply(0, ys) - Math.min.apply(0, ys) + 1;
          if (bw * bh === area) out += '<span>Rectangle: ' + bw + ' × ' + bh + ' = ' + area + '</span>'; }
        api.readout(area ? out : '');
        api.report({ v: String(area), p: String(per) });
      }
      function cellAt(p) { var x = Math.floor((p.x - M) / Z), y = Math.floor((p.y - TY - M) / Z); return x < 0 || y < 0 || x >= S.cols || y >= S.rows ? null : x + '_' + y; }
      rootDrag(v, {
        down: function (p, e) {
          var tr = e.target.closest && e.target.closest('[data-tray]');
          if (tr) { S.col = +tr.getAttribute('data-tray'); draw(); var gh = O.s('rect', { x: p.x - 17, y: p.y - 17, width: 34, height: 34, rx: 5, fill: C[S.col], opacity: .85, style: 'pointer-events:none' }, v); return { tray: 1, gh: gh }; }
          var t = e.target.closest && e.target.closest('[data-c]'); if (!t) return null; var k = t.getAttribute('data-c');
          if (S.cells[k] != null) return { lift: k, col: S.cells[k], last: k };
          apply(k, 'fill'); draw(); return { mode: 'fill', last: k }; },
        move: function (p, c, moved) {
          if (c.tray || c.lift) { if (c.lift && !c.gh && moved) { delete S.cells[c.lift]; draw(); c.gh = O.s('rect', { x: 0, y: 0, width: 34, height: 34, rx: 5, fill: C[c.col] || VIO, opacity: .85, style: 'pointer-events:none' }, v); }
            if (c.gh) { if (!c.gh.parentNode) v.appendChild(c.gh); c.gh.setAttribute('x', p.x - 17); c.gh.setAttribute('y', p.y - 17); } return; }
          var k = cellAt(p); if (!k || k === c.last) return; c.last = k; apply(k, c.mode); draw(); },
        up: function (p, c, moved) {
          if (c.tray) { var k = cellAt(p); if (k) S.cells[k] = S.col; else if (!moved) O.toast('Drag the tile onto the grid.'); }
          else if (c.lift) { if (!moved) delete S.cells[c.lift]; else { var k2 = cellAt(p); if (k2) S.cells[k2] = c.col; } }
          api.redraw(); }
      });
      api.onRedraw(draw);
    }
  });

  /* ================= GEOBOARD ================= */
  O.register('geoboard', {
    defaults: { n: 11, bands: [], mode: 'band', mirror: 'none', sel: -1, cur: -1 },
    mount: function (api) {
      var S = api.S, COLS = [VIO, GRN, RED, BLUE, ORG], B = 440, MG = 30;
      api.say('Press a pin and drag the band to the next pin. Drag back to the first pin to close the shape. Drag a corner to move it.');
      var bar = toolbar(api);
      api.seg('', 'mode', [['band', 'Shape band'], ['line', 'Straight line']], function () { S.cur = -1; }, bar);
      api.button('Undo pin', function () { var b = S.bands[S.cur]; if (b) { b.p.pop(); if (!b.p.length) { S.bands.splice(S.cur, 1); S.cur = -1; } } else if (S.bands.length) { S.bands.pop(); S.sel = -1; } api.redraw(); }, '', bar);
      api.button('Remove band', function () { var i = S.sel >= 0 ? S.sel : S.bands.length - 1; if (i < 0) return; S.bands.splice(i, 1); S.sel = -1; S.cur = -1; api.redraw(); }, '', bar);
      api.button('Clear', function () { S.bands = []; S.sel = -1; S.cur = -1; api.redraw(); }, '', bar);
      api.select('Board size', 'n', [[5, '5 by 5 pins'], [11, '11 by 11 pins']], function () { S.bands = []; S.sel = S.cur = -1; });
      api.heading('Symmetry');
      api.select('Mirror line', 'mirror', [['none', 'None'], ['v', 'Up and down'], ['h', 'Across'], ['d', 'Slanted']]);
      api.button('Reflect my shape', function () {
        if (S.mirror === 'none') { O.toast('Pick a mirror line first.'); return; }
        var i = S.sel >= 0 ? S.sel : S.bands.length - 1, b = S.bands[i]; if (!b) { O.toast('Make a shape first.'); return; }
        var m = S.n - 1; S.bands.push({ p: b.p.map(function (q) { return S.mirror === 'v' ? [m - q[0], q[1]] : S.mirror === 'h' ? [q[0], m - q[1]] : [q[1], q[0]]; }), k: b.k, c: (b.c + 1) % 5 }); S.sel = S.bands.length - 1; api.redraw();
      }, '', api.row());
      var v = holder(api, B, B, 'Geoboard');
      var lastDrag = 0;
      function sp() { return (B - 2 * MG) / (S.n - 1); }
      function pinAt(p) { var x = Math.round((p.x - MG) / sp()), y = Math.round((p.y - MG) / sp()); if (x < 0 || y < 0 || x >= S.n || y >= S.n) return null; var c = P([x, y]); return Math.hypot(p.x - c[0], p.y - c[1]) < sp() * 0.45 ? [x, y] : null; }
      function same(a, b) { return a && b && a[0] === b[0] && a[1] === b[1]; }
      rootDrag(v, {
        down: function (p) { var q = pinAt(p); if (!q) return null;
          var cb = S.bands[S.cur], sb = S.bands[S.sel];
          if (!cb && sb) { var vi = -1; sb.p.forEach(function (r, k) { if (same(r, q)) vi = k; }); if (vi >= 0) return { corner: vi, band: S.sel, from: q }; }
          lastDrag = Date.now(); if (!cb || !same(cb.p[cb.p.length - 1], q)) { pin(q[0], q[1]); }
          var nb = S.bands[S.cur]; if (!nb || S.mode === 'line' && nb.p.length > 1) return null;
          return { from: q }; },
        move: function (p, c, moved) { if (!moved) return;
          if (!c.ln) { c.ln = O.s('line', { stroke: c.corner != null ? GRAY : COLS[(S.bands[S.cur] || {}).c % 5 || 0], 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': c.corner != null ? '6 5' : '', style: 'pointer-events:none' }, v); }
          if (!c.ln.parentNode) v.appendChild(c.ln);
          var f = P(c.from), q = pinAt(p), e = q ? P(q) : [p.x, p.y];
          c.ln.setAttribute('x1', f[0]); c.ln.setAttribute('y1', f[1]); c.ln.setAttribute('x2', e[0]); c.ln.setAttribute('y2', e[1]); },
        up: function (p, c, moved) { if (!moved) return; lastDrag = Date.now(); if (c.ln && c.ln.parentNode) c.ln.remove(); var q = pinAt(p);
          if (c.corner != null) { var b = S.bands[c.band]; if (q && b && !b.p.some(function (r, k) { return k !== c.corner && same(r, q); })) { b.p[c.corner] = q; } api.redraw(); return; }
          if (!q) { O.toast('Let go on a pin to hook the band.'); return; }
          pin(q[0], q[1]); }
      });
      function P(q) { return [MG + q[0] * sp(), MG + q[1] * sp()]; }
      function pin(x, y) {
        var b = S.bands[S.cur];
        if (!b) { S.bands.push({ p: [[x, y]], k: 0, c: S.bands.length % 5 }); S.cur = S.bands.length - 1; S.sel = S.cur; api.redraw(); return; }
        var f = b.p[0], l = b.p[b.p.length - 1];
        if (S.mode === 'line') { if (f[0] === x && f[1] === y) return; b.p.push([x, y]); S.cur = -1; }
        else if (f[0] === x && f[1] === y) { if (b.p.length >= 3) { b.k = 1; S.cur = -1; } else { O.toast('Add more pins before you close the band.'); return; } }
        else if (l[0] === x && l[1] === y) return;
        else if (b.p.some(function (q) { return q[0] === x && q[1] === y; })) { O.toast('That pin is already in this band.'); return; }
        else b.p.push([x, y]);
        api.redraw();
      }
      function clean(p) { var out = p.filter(function (q, i) { var a = p[(i - 1 + p.length) % p.length], c = p[(i + 1) % p.length]; return (q[0] - a[0]) * (c[1] - q[1]) - (q[1] - a[1]) * (c[0] - q[0]) !== 0; }); return out.length >= 3 ? out : p; }
      function rights(p) { return p.map(function (q, i) { var a = p[(i - 1 + p.length) % p.length], c = p[(i + 1) % p.length]; return (a[0] - q[0]) * (c[0] - q[0]) + (a[1] - q[1]) * (c[1] - q[1]) === 0; }); }
      function par(a, b, c, d) { return (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]) === 0; }
      function L2(a, b) { return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]); }
      function name(p, ra) {
        var n = p.length; if (n === 3) return 'triangle' + (ra.some(Boolean) ? ' (with a right angle)' : '');
        if (n === 4) { var s = [0, 1, 2, 3].map(function (i) { return L2(p[i], p[(i + 1) % 4]); }), eq = s.every(function (x) { return x === s[0]; });
          var p1 = par(p[0], p[1], p[3], p[2]), p2 = par(p[1], p[2], p[0], p[3]);
          if (ra.every(Boolean)) return eq ? 'square' : 'rectangle'; if (p1 && p2) return eq ? 'rhombus' : 'parallelogram'; if (p1 || p2) return 'trapezoid'; return 'quadrilateral'; }
        return { 5: 'pentagon', 6: 'hexagon', 8: 'octagon' }[n] || 'shape with ' + n + ' sides';
      }
      function draw() {
        clear(v);
        O.s('rect', { x: 2, y: 2, width: B - 4, height: B - 4, rx: 22, fill: '#EEF0F6', stroke: LINE, 'stroke-width': 3, class: 'paper' }, v);
        var m = S.n - 1, ln = { v: [[m / 2, -0.4], [m / 2, m + 0.4]], h: [[-0.4, m / 2], [m + 0.4, m / 2]], d: [[-0.3, -0.3], [m + 0.3, m + 0.3]] }[S.mirror];
        if (ln) O.s('line', { x1: P(ln[0])[0], y1: P(ln[0])[1], x2: P(ln[1])[0], y2: P(ln[1])[1], stroke: YEL, 'stroke-width': 4, 'stroke-dasharray': '10 7' }, v);
        S.bands.forEach(function (b, i) {
          var pts = b.p.map(P), col = COLS[b.c % 5], el = O.s(b.k ? 'polygon' : 'polyline', { points: poly(pts), fill: b.k ? col : 'none', 'fill-opacity': .14, stroke: col, 'stroke-width': i === S.sel ? 7 : 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, v);
          if (b.k) rights(clean(b.p)).forEach(function (r, j, arr) { if (!r) return; var cp = clean(b.p), q = cp[j], a = cp[(j - 1 + cp.length) % cp.length], c = cp[(j + 1) % cp.length], s1 = 0.22;
            var ua = [(a[0] - q[0]) / Math.sqrt(L2(a, q)), (a[1] - q[1]) / Math.sqrt(L2(a, q))], uc = [(c[0] - q[0]) / Math.sqrt(L2(c, q)), (c[1] - q[1]) / Math.sqrt(L2(c, q))];
            var k1 = P([q[0] + ua[0] * s1, q[1] + ua[1] * s1]), k2 = P([q[0] + (ua[0] + uc[0]) * s1, q[1] + (ua[1] + uc[1]) * s1]), k3 = P([q[0] + uc[0] * s1, q[1] + uc[1] * s1]);
            O.s('polyline', { points: poly([k1, k2, k3]), fill: 'none', stroke: NAVY, 'stroke-width': 2, class: 'inks' }, v); });
          var hit = O.s(b.k ? 'polygon' : 'polyline', { points: poly(pts), fill: 'none', stroke: 'transparent', 'stroke-width': 16 }, v);
          O.tap(hit, function () { S.sel = i; api.redraw(); }, 'Choose band ' + (i + 1)); void el;
        });
        var cb = S.bands[S.cur];
        for (var y = 0; y < S.n; y++) for (var x = 0; x < S.n; x++) {
          var c = P([x, y]), g = O.s('g', {}, v);
          O.s('circle', { cx: c[0], cy: c[1], r: sp() * 0.45, fill: 'transparent' }, g);
          if (cb && cb.p[0][0] === x && cb.p[0][1] === y) O.s('circle', { cx: c[0], cy: c[1], r: 11, fill: 'none', stroke: COLS[cb.c % 5], 'stroke-width': 3 }, g);
          O.s('circle', { cx: c[0], cy: c[1], r: S.n > 6 ? 5 : 8, fill: '#6B7280', stroke: '#fff', 'stroke-width': 1.5 }, g);
          (function (x, y) { O.tap(g, function () { if (Date.now() - lastDrag < 400) return; pin(x, y); }, 'Pin ' + (x + 1) + ', ' + (y + 1)); })(x, y);
        }
        /* readout */
        var b = S.bands[S.sel] || S.bands[S.bands.length - 1], out = '', rep = { v: '', s: '' };
        if (b && b.k) { var p = clean(b.p), ra = rights(p), A = 0; p.forEach(function (q, i) { var r = p[(i + 1) % p.length]; A += q[0] * r[1] - r[0] * q[1]; }); A = Math.abs(A) / 2;
          out = '<span>It is ' + art(name(p, ra)) + ' <b>' + name(p, ra) + '</b></span><span>Sides: <b>' + p.length + '</b></span><span>Right angles: <b>' + ra.filter(Boolean).length + '</b></span><span>Area: <b>' + half(A) + '</b> square units</span>';
          var axis = p.every(function (q, i) { var r = p[(i + 1) % p.length]; return q[0] === r[0] || q[1] === r[1]; });
          if (axis) { var per = 0; p.forEach(function (q, i) { var r = p[(i + 1) % p.length]; per += Math.abs(q[0] - r[0]) + Math.abs(q[1] - r[1]); }); out += '<span>Perimeter: <b>' + per + '</b> units</span>'; }
          rep = { v: String(A), s: String(p.length) }; }
        else if (b && b.p.length === 2) { var a = b.p[0], c2 = b.p[1]; if (a[0] === c2[0] || a[1] === c2[1]) out = '<span>Line: <b>' + (Math.abs(a[0] - c2[0]) + Math.abs(a[1] - c2[1])) + '</b> units long</span>'; }
        var lines = S.bands.filter(function (q) { return !q.k && q.p.length === 2; });
        if (lines.length >= 2) { var l1 = lines[lines.length - 2].p, l2 = lines[lines.length - 1].p, dot = (l1[1][0] - l1[0][0]) * (l2[1][0] - l2[0][0]) + (l1[1][1] - l1[0][1]) * (l2[1][1] - l2[0][1]);
          out += par(l1[0], l1[1], l2[0], l2[1]) ? '<span>The last two lines are <b>parallel</b></span>' : dot === 0 ? '<span>The last two lines are <b>perpendicular</b></span>' : ''; }
        api.readout(out); api.report(rep);
      }
      api.onRedraw(draw);
    }
  });

  /* ================= GRID WHITEBOARD ================= */
  O.register('whiteboard', {
    defaults: { bg: 'grid', col: 0, w: 4, tool: 'pen', st: [] },
    mount: function (api) {
      var S = api.S, CO = [NAVY, VIO, GRN, RED], W = 800, H = 500, G = 25, warned = false;
      api.say('Draw and write your work. Use the line tool for straight lines.');
      var bar = toolbar(api);
      api.seg('', 'tool', [['pen', '✏ Pen'], ['line', '╱ Line'], ['erase', '⌫ Eraser']], null, bar);
      api.seg('', 'col', CO.map(function (c, i) { return [i, '<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:' + c + ';vertical-align:-3px" aria-label="' + ['Navy', 'Violet', 'Green', 'Red'][i] + '"></span>']; }), null, bar);
      api.seg('', 'w', [[2, 'Thin'], [4, 'Medium'], [8, 'Thick']], null, bar);
      api.button('↶ Undo', function () { S.st.pop(); api.redraw(); }, '', bar);
      api.button('Clear', function () { S.st = []; api.redraw(); }, '', bar);
      api.select('Paper', 'bg', [['grid', 'Centimeter grid'], ['dot', 'Dot paper'], ['lined', 'Lined paper'], ['blank', 'Blank']]);
      var v = holder(api, W, H, 'Whiteboard'); v.style.touchAction = 'none';
      var ink;
      function path(p) { var d = 'M' + p[0] + ' ' + p[1]; for (var i = 2; i < p.length; i += 2) d += 'L' + p[i] + ' ' + p[i + 1]; if (p.length === 2) d += 'l0.1 0'; return d; }
      function draw() { api.report({});
        clear(v); O.s('rect', { x: 0, y: 0, width: W, height: H, fill: '#fff', class: 'paper' }, v);
        var x, y;
        if (S.bg === 'grid') { for (x = 0; x <= W; x += G) O.s('line', { x1: x, y1: 0, x2: x, y2: H, stroke: x % (G * 4) ? '#E3E7F1' : '#C9D0E3', 'stroke-width': 1 }, v); for (y = 0; y <= H; y += G) O.s('line', { x1: 0, y1: y, x2: W, y2: y, stroke: y % (G * 4) ? '#E3E7F1' : '#C9D0E3', 'stroke-width': 1 }, v); }
        if (S.bg === 'dot') for (y = G; y < H; y += G) for (x = G; x < W; x += G) O.s('circle', { cx: x, cy: y, r: 1.8, fill: '#9AA3B8' }, v);
        if (S.bg === 'lined') { for (y = 50; y < H; y += 40) O.s('line', { x1: 0, y1: y, x2: W, y2: y, stroke: '#BFD4F2', 'stroke-width': 1.5 }, v); O.s('line', { x1: 60, y1: 0, x2: 60, y2: H, stroke: '#F2B8B8', 'stroke-width': 1.5 }, v); }
        S.st.forEach(function (s) { O.s('path', { d: path(s[2]), fill: 'none', stroke: CO[s[0]], 'stroke-width': s[1], 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: s[0] === 0 ? 'inks' : '' }, v); });
        ink = O.s('g', {}, v);
      }
      function rdp(p, eps) { if (p.length <= 4) return p; var pts = []; for (var i = 0; i < p.length; i += 2) pts.push([p[i], p[i + 1]]);
        function rec(a, b, out) { var md = 0, mi = -1; for (var i = a + 1; i < b; i++) { var d = segDist(pts[i], pts[a], pts[b]); if (d > md) { md = d; mi = i; } } if (md > eps) { rec(a, mi, out); out.push(pts[mi]); rec(mi, b, out); } }
        var out = [pts[0]]; rec(0, pts.length - 1, out); out.push(pts[pts.length - 1]); var f = []; out.forEach(function (q) { f.push(Math.round(q[0]), Math.round(q[1])); }); return f; }
      function eraseAt(p) { var n = S.st.length; S.st = S.st.filter(function (s) { var q = s[2]; if (q.length === 2) return Math.hypot(q[0] - p.x, q[1] - p.y) > 10; for (var i = 0; i < q.length - 2; i += 2) if (segDist([p.x, p.y], [q[i], q[i + 1]], [q[i + 2], q[i + 3]]) < 10 + s[1] / 2) return false; return true; }); if (S.st.length !== n) draw(); }
      function finish(s) { S.st.push(s); api.redraw(); if (!warned && JSON.stringify(S.st).length > 12000) { warned = true; O.toast('This drawing is too big to share as a link. You can still print it.'); } }
      rootDrag(v, {
        down: function (p) {
          if (S.tool === 'erase') { eraseAt(p); return { e: 1 }; }
          var c = { pts: [Math.round(p.x), Math.round(p.y)], x0: p.x, y0: p.y };
          c.el = O.s(S.tool === 'line' ? 'line' : 'path', { fill: 'none', stroke: CO[S.col], 'stroke-width': S.w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ink);
          if (S.tool === 'line') { c.el.setAttribute('x1', p.x); c.el.setAttribute('y1', p.y); c.el.setAttribute('x2', p.x); c.el.setAttribute('y2', p.y); } else c.el.setAttribute('d', path(c.pts));
          return c;
        },
        move: function (p, c) {
          if (c.e) { eraseAt(p); return; }
          if (S.tool === 'line') { c.el.setAttribute('x2', p.x); c.el.setAttribute('y2', p.y); c.x1 = p.x; c.y1 = p.y; return; }
          var n = c.pts.length; if (Math.hypot(p.x - c.pts[n - 2], p.y - c.pts[n - 1]) < 2) return; c.pts.push(Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10); c.el.setAttribute('d', path(c.pts));
        },
        up: function (p, c) {
          if (c.e) { api.redraw(); return; }
          if (S.tool === 'line') { if (Math.hypot(p.x - c.x0, p.y - c.y0) < 4) { draw(); return; } finish([S.col, S.w, [Math.round(c.x0), Math.round(c.y0), Math.round(p.x), Math.round(p.y)]]); }
          else finish([S.col, S.w, rdp(c.pts, 0.9)]);
        }
      });
      api.onRedraw(draw);
    }
  });

  /* ================= TANGRAMS ================= */
  var TU = 64, Q2 = Math.SQRT1_2;
  var TSH = { L: [[0, 0], [2, 0], [0, 2]], M: [[0, 0], [2, 0], [1, 1]], S: [[0, 0], [1, 0], [0, 1]], Q: [[0, 0], [1, 0], [1, 1], [0, 1]], P: [[0, 0], [1, 0], [2, 1], [1, 1]] };
  var TP = [['L', RED, 'large triangle'], ['L', BLUE, 'large triangle'], ['M', GRN, 'medium triangle'], ['S', YEL, 'small triangle'], ['S', ORG, 'small triangle'], ['Q', VIO, 'square'], ['P', TEAL, 'parallelogram']]
    .map(function (d) { return { sh: center(TSH[d[0]].map(function (p) { return [p[0] * TU, p[1] * TU]; })), c: d[1], n: d[2] }; });
  function sq7() { return [[[0, 0], [4, 0], [2, 2]], [[0, 0], [2, 2], [0, 4]], [[4, 0], [4, 2], [3, 1]], [[2, 2], [3, 1], [4, 2], [3, 3]], [[2, 2], [3, 3], [1, 3]], [[0, 4], [1, 3], [3, 3], [2, 4]], [[4, 2], [4, 4], [2, 4]]].map(function (pp) { return pp.map(function (p) { return [p[0] * Q2, p[1] * Q2]; }); }); }
  var PUZ = {
    free: { n: 'Free build', p: [] },
    sq7: { n: 'Big square (all 7 pieces)', p: sq7() },
    sq2: { n: 'Square (2 pieces)', p: [[[0, 0], [1, 0], [0, 1]], [[1, 0], [1, 1], [0, 1]]] },
    tri3: { n: 'Triangle (3 pieces)', p: [[[0, 0], [2, 0], [1, 1]], [[0, 0], [1, 1], [0, 1]], [[0, 1], [1, 1], [0, 2]]] },
    tri3b: { n: 'Triangle with a square inside (3 pieces)', p: [[[0, 0], [1, 0], [1, 1], [0, 1]], [[1, 0], [2, 0], [1, 1]], [[0, 1], [1, 1], [0, 2]]] },
    rect3: { n: 'Rectangle (3 pieces)', p: [[[0, 0], [1, 0], [1, 1], [0, 1]], [[1, 0], [2, 0], [2, 1]], [[1, 0], [2, 1], [1, 1]]] },
    house: { n: 'House (3 pieces)', p: [[[0, 1], [2, 1], [1, 0]], [[0, 1], [2, 1], [0, 3]], [[2, 1], [2, 3], [0, 3]]] },
    boat: { n: 'Sailboat (6 pieces)', p: [[[1, 0], [1, 2], [3, 2]], [[1, 0], [1, 2], [0, 1]], [[0, 2], [1, 2], [1, 3]], [[1, 2], [2, 2], [2, 3], [1, 3]], [[2, 2], [3, 2], [2, 3]], [[2, 3], [3, 3], [4, 2], [3, 2]]] }
  };
  var TDEF = [[115, 110, 0, 0], [295, 95, 90, 0], [120, 300, 0, 0], [265, 280, 0, 0], [345, 280, 0, 0], [115, 430, 0, 0], [270, 425, 0, 0]];
  O.register('tangram', {
    defaults: { pz: 'sq7', pc: TDEF, sol: false, sel: -1 },
    mount: function (api) {
      var S = api.S, W = 760, H = 500, SX = 440, SY = 80;
      api.say('Drag the pieces into the gray shape. To turn a piece, drag its round ⟳ handle. Flip it with the Flip button.');
      var bar = toolbar(api);
      api.button('↺', function () { turn(-45); }, '', bar).title = 'Turn left (keyboard)'; api.button('↻', function () { turn(45); }, '', bar).title = 'Turn right (keyboard)'; api.button('⇋ Flip', function () { var q = S.pc[S.sel]; if (!q) return pick(); q[3] = q[3] ? 0 : 1; api.redraw(); }, '', bar);
      api.button('Mix up', function () { S.pc = O.clone(TDEF); S.sel = -1; api.redraw(); }, '', bar);
      api.select('Puzzle', 'pz', Object.keys(PUZ).map(function (k) { return [k, PUZ[k].n]; }));
      api.check('Show the answer', 'sol');
      function pick() { O.toast('Tap a piece first.'); }
      function turn(d) { var q = S.pc[S.sel]; if (!q) return pick(); q[2] = (q[2] + d + 360) % 360; api.redraw(); }
      var v = holder(api, W, H, 'Tangram pieces and puzzle');
      function abs(i) { var q = S.pc[i]; return xf(TP[i].sh, q[0], q[1], q[2], q[3]); }
      function handle(cx, cy, pts, rot) { var md = 0; pts.forEach(function (p) { md = Math.max(md, Math.hypot(p[0] - cx, p[1] - cy)); }); var a = (rot - 90) * RAD, hx = cx + (md + 24) * Math.cos(a), hy = cy + (md + 24) * Math.sin(a);
        var vb = v.viewBox.baseVal; if (hx < 18 || hy < 18 || hx > vb.width - 18 || hy > vb.height - 18) { hx = cx - (md + 24) * Math.cos(a); hy = cy - (md + 24) * Math.sin(a); }
        hx = O.clamp(hx, 18, vb.width - 18); hy = O.clamp(hy, 18, vb.height - 18);
        O.s('line', { x1: cx, y1: cy, x2: hx, y2: hy, stroke: NAVY, 'stroke-width': 2, 'stroke-dasharray': '4 4', style: 'pointer-events:none' }, v);
        var h = O.s('circle', { cx: hx, cy: hy, r: 15, fill: '#fff', stroke: NAVY, 'stroke-width': 3, 'data-rot': 1, style: 'cursor:grab' }, v);
        O.s('text', { x: hx, y: hy + 5, 'text-anchor': 'middle', 'font-size': 15, fill: NAVY, text: '⟳', style: 'pointer-events:none' }, v); return h; }
      function sil() { var pz = PUZ[S.pz] || PUZ.free; return pz.p.map(function (pp) { return pp.map(function (p) { return [SX + p[0] * TU, SY + p[1] * TU]; }); }); }
      function draw() {
        clear(v); O.s('rect', { x: 0, y: 0, width: W, height: H, rx: 14, fill: '#fff', class: 'paper' }, v);
        var sp = sil();
        sp.forEach(function (pp) { O.s('polygon', { points: poly(pp), fill: '#C9CFDD', stroke: '#C9CFDD', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, v); });
        if (S.sol) sp.forEach(function (pp) { O.s('polygon', { points: poly(pp), fill: 'none', stroke: NAVY, 'stroke-width': 1.5, 'stroke-dasharray': '5 4', class: 'inks' }, v); });
        var order = [0, 1, 2, 3, 4, 5, 6].filter(function (i) { return i !== S.sel; }); if (S.sel >= 0) order.push(S.sel);
        order.forEach(function (i) { var g = O.s('polygon', { points: poly(abs(i)), fill: TP[i].c, 'fill-opacity': .92, stroke: i === S.sel ? NAVY : '#fff', 'stroke-width': i === S.sel ? 3 : 2, 'stroke-linejoin': 'round', 'data-i': i, style: 'cursor:grab' }, v);
          keyTap(g, function () { S.sel = i; api.redraw(); }, TP[i].n); });
        if (S.sel >= 0 && S.pc[S.sel]) handle(S.pc[S.sel][0], S.pc[S.sel][1], abs(S.sel), S.pc[S.sel][2]);
        /* readout: how many pieces sit inside, and solved? */
        var pz = PUZ[S.pz] || PUZ.free; if (!pz.p.length) { api.readout(''); api.report({ v: '' }); return; }
        var inside = 0; for (var i = 0; i < 7; i++) if (abs(i).every(function (p) { return sp.some(function (pp) { return inPoly(p, pp); }); })) inside++;
        var tot = 0, hit = 0, xs = [], ys = []; sp.forEach(function (pp) { pp.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
        for (var x = Math.min.apply(0, xs) + 4; x < Math.max.apply(0, xs); x += 8) for (var y = Math.min.apply(0, ys) + 4; y < Math.max.apply(0, ys); y += 8) {
          if (!sp.some(function (pp) { return inPoly([x, y], pp); })) continue; tot++; for (var j = 0; j < 7; j++) if (inPoly([x, y], abs(j))) { hit++; break; } }
        var done = tot && hit / tot > 0.97 && inside === pz.p.length;
        api.readout('<span>Puzzle: <b>' + pz.n + '</b></span><span>Pieces in the shape: <b>' + inside + ' of ' + pz.p.length + '</b></span>' + (done ? '<span style="color:' + GRN + '">You solved it!</span>' : ''));
        api.report({ v: done ? 'solved' : '' });
      }
      rootDrag(v, {
        down: function (p, e) { if (e.target.closest && e.target.closest('[data-rot]') && S.pc[S.sel]) { var q0 = S.pc[S.sel]; return { rot: S.sel, off: Math.atan2(p.y - q0[1], p.x - q0[0]) / RAD - q0[2] }; } var t = e.target.closest && e.target.closest('[data-i]'); if (!t) { if (S.sel >= 0) { S.sel = -1; draw(); } return null; } var i = +t.getAttribute('data-i'); S.sel = i; draw(); return { i: i, dx: S.pc[i][0] - p.x, dy: S.pc[i][1] - p.y }; },
        move: function (p, c) { if (c.rot != null) { var qr = S.pc[c.rot]; qr[2] = ((Math.round((Math.atan2(p.y - qr[1], p.x - qr[0]) / RAD - c.off) / 45) * 45) % 360 + 360) % 360; draw(); return; } var q = S.pc[c.i]; q[0] = O.clamp(p.x + c.dx, 10, W - 10); q[1] = O.clamp(p.y + c.dy, 10, H - 10); draw(); },
        up: function (p, c, moved) {
          if (c.rot != null) { api.redraw(); return; }
          if (moved) { var tg = []; sil().forEach(function (pp) { tg = tg.concat(pp); }); for (var j = 0; j < 7; j++) if (j !== c.i) tg = tg.concat(abs(j));
            var sh = snapShift(abs(c.i), tg, 16); if (sh) { S.pc[c.i][0] += sh[0]; S.pc[c.i][1] += sh[1]; }
            S.pc[c.i][0] = Math.round(S.pc[c.i][0] * 10) / 10; S.pc[c.i][1] = Math.round(S.pc[c.i][1] * 10) / 10; }
          api.redraw();
        }
      });
      api.onRedraw(draw);
    }
  });

  /* ================= PATTERN BLOCKS ================= */
  var PS = 40, PH = PS * R3 / 2;
  function hexPts() { var a = []; for (var k = 0; k < 6; k++) a.push([PS * Math.cos(k * 60 * RAD), PS * Math.sin(k * 60 * RAD)]); return a; }
  var PB = {
    hex: { c: YEL, n: ['hexagon', 'hexagons'], v: 6, p: hexPts() },
    trap: { c: RED, n: ['trapezoid', 'trapezoids'], v: 3, p: [[-PS, 0], [PS, 0], [PS / 2, -PH], [-PS / 2, -PH]] },
    rh: { c: BLUE, n: ['blue rhombus', 'blue rhombuses'], v: 2, p: [[0, 0], [PS, 0], [1.5 * PS, -PH], [.5 * PS, -PH]] },
    tri: { c: GRN, n: ['triangle', 'triangles'], v: 1, p: [[0, 0], [PS, 0], [PS / 2, -PH]] },
    sq: { c: ORG, n: ['square', 'squares'], v: 0, p: [[0, 0], [PS, 0], [PS, -PS], [0, -PS]] },
    tan: { c: '#D9B48F', n: ['tan rhombus', 'tan rhombuses'], v: 0, p: [[0, 0], [PS, 0], [PS + PS * R3 / 2, -PS / 2], [PS * R3 / 2, -PS / 2]] }
  };
  Object.keys(PB).forEach(function (k) { PB[k].p = center(PB[k].p); });
  var PORD = ['hex', 'trap', 'rh', 'tri', 'sq', 'tan'];
  O.register('pattern', {
    defaults: { b: [], mirror: 'none', frac: false, sel: -1 },
    mount: function (api) {
      var S = api.S, W = 720, H = 500, TRAY = 100;
      api.say('Drag blocks from the top onto the mat. To turn a block, drag its round ⟳ handle. Drag a block back to the top to put it away.');
      var bar = toolbar(api);
      api.button('↺', function () { turn(-30); }, '', bar).title = 'Turn left (keyboard)'; api.button('↻', function () { turn(30); }, '', bar).title = 'Turn right (keyboard)';
      api.button('Remove', function () { if (S.sel < 0) return O.toast('Tap a block first.'); S.b.splice(S.sel, 1); S.sel = -1; api.redraw(); }, '', bar);
      api.button('Clear', function () { S.b = []; S.sel = -1; api.redraw(); }, '', bar);
      api.select('Mirror line', 'mirror', [['none', 'None'], ['v', 'Up and down'], ['h', 'Across']]);
      api.check('Fractions: the hexagon is 1 whole', 'frac');
      function turn(d) { var q = S.b[S.sel]; if (!q) return O.toast('Tap a block first.'); q[3] = (q[3] + d + 360) % 360; api.redraw(); }
      var v = holder(api, W, H, 'Pattern block mat');
      function handle(cx, cy, pts, rot) { var md = 0; pts.forEach(function (p) { md = Math.max(md, Math.hypot(p[0] - cx, p[1] - cy)); }); var a = (rot - 90) * RAD, hx = cx + (md + 24) * Math.cos(a), hy = cy + (md + 24) * Math.sin(a);
        var vb = v.viewBox.baseVal; if (hx < 18 || hy < 18 || hx > vb.width - 18 || hy > vb.height - 18) { hx = cx - (md + 24) * Math.cos(a); hy = cy - (md + 24) * Math.sin(a); }
        hx = O.clamp(hx, 18, vb.width - 18); hy = O.clamp(hy, 18, vb.height - 18);
        O.s('line', { x1: cx, y1: cy, x2: hx, y2: hy, stroke: NAVY, 'stroke-width': 2, 'stroke-dasharray': '4 4', style: 'pointer-events:none' }, v);
        var h = O.s('circle', { cx: hx, cy: hy, r: 15, fill: '#fff', stroke: NAVY, 'stroke-width': 3, 'data-rot': 1, style: 'cursor:grab' }, v);
        O.s('text', { x: hx, y: hy + 5, 'text-anchor': 'middle', 'font-size': 15, fill: NAVY, text: '⟳', style: 'pointer-events:none' }, v); return h; }
      function abs(q) { return xf(PB[q[0]].p, q[1], q[2], q[3], 0); }
      var MX = W / 2, MY = TRAY + (H - TRAY) / 2;
      function draw() {
        clear(v); O.s('rect', { x: 0, y: 0, width: W, height: H, rx: 14, fill: '#fff', class: 'paper' }, v);
        O.s('rect', { x: 1, y: 1, width: W - 2, height: H - 2, rx: 14, fill: 'none', stroke: LINE, 'stroke-width': 2 }, v);
        O.s('rect', { x: 0, y: 0, width: W, height: TRAY, rx: 14, fill: '#F1EDFB' }, v);
        PORD.forEach(function (t, i) { var cx = 60 + i * 120, g = O.s('polygon', { points: poly(xf(PB[t].p, cx, TRAY / 2, 0, 0)), fill: PB[t].c, stroke: 'rgba(0,0,0,.3)', 'stroke-width': 1.5, 'data-t': t, style: 'cursor:grab' }, v);
          keyTap(g, function () { S.b.push([t, MX + (Math.random() * 80 - 40), MY + (Math.random() * 60 - 30), 0]); S.sel = S.b.length - 1; api.redraw(); }, 'Add a ' + PB[t].n[0]); });
        if (S.mirror === 'v') O.s('line', { x1: MX, y1: TRAY + 6, x2: MX, y2: H - 6, stroke: VIO, 'stroke-width': 3, 'stroke-dasharray': '10 7' }, v);
        if (S.mirror === 'h') O.s('line', { x1: 6, y1: MY, x2: W - 6, y2: MY, stroke: VIO, 'stroke-width': 3, 'stroke-dasharray': '10 7' }, v);
        var order = S.b.map(function (q, i) { return i; }).filter(function (i) { return i !== S.sel; }); if (S.sel >= 0 && S.b[S.sel]) order.push(S.sel);
        order.forEach(function (i) { var q = S.b[i], g = O.s('polygon', { points: poly(abs(q)), fill: PB[q[0]].c, stroke: i === S.sel ? NAVY : 'rgba(0,0,0,.35)', 'stroke-width': i === S.sel ? 3 : 1.5, 'stroke-linejoin': 'round', 'data-i': i, style: 'cursor:grab' }, v);
          keyTap(g, function () { S.sel = i; api.redraw(); }, PB[q[0]].n[0]); });
        if (S.sel >= 0 && S.b[S.sel]) handle(S.b[S.sel][1], S.b[S.sel][2], abs(S.b[S.sel]), S.b[S.sel][3]);
        /* readout */
        var cnt = {}, six = 0; S.b.forEach(function (q) { cnt[q[0]] = (cnt[q[0]] || 0) + 1; six += PB[q[0]].v; });
        var parts = PORD.filter(function (t) { return cnt[t]; }).map(function (t) { return cnt[t] + ' ' + PB[t].n[cnt[t] === 1 ? 0 : 1]; }), out = parts.length ? '<span>' + parts.join(', ') + '</span>' : '';
        if (S.frac && S.b.length) { var w = Math.floor(six / 6), r = six % 6, g2 = O.gcd(r, 6); out += '<span>Value: <b>' + (r ? (w ? '<span class="mixed">' + w + O.frac(r / g2, 6 / g2) + '</span>' : O.frac(r / g2, 6 / g2)) : w) + '</b> ' + (six && six <= 6 && !r ? 'whole' : 'wholes') + '</span>'; }
        var pv = ''; if (S.frac && S.b.length) { var gg = O.gcd(six, 6); pv = six % 6 === 0 ? String(six / 6) : (six / gg) + '/' + (6 / gg); }
        api.report({ v: pv });
        if (S.mirror !== 'none' && S.b.length) out += '<span>' + (symmetric() ? '<b style="color:' + GRN + '">The design is symmetric!</b>' : 'Not symmetric yet') + '</span>';
        api.readout(out);
      }
      function key(t, pts) { return t + ':' + pts.map(function (p) { return Math.round(p[0] / 4) + ',' + Math.round(p[1] / 4); }).sort().join(';'); }
      function symmetric() { var a = S.b.map(function (q) { return key(q[0], abs(q)); }).sort(), b = S.b.map(function (q) { return key(q[0], abs(q).map(function (p) { return S.mirror === 'v' ? [2 * MX - p[0], p[1]] : [p[0], 2 * MY - p[1]]; })); }).sort(); return a.join('|') === b.join('|'); }
      rootDrag(v, {
        down: function (p, e) { if (e.target.closest && e.target.closest('[data-rot]') && S.b[S.sel]) { var q0 = S.b[S.sel]; return { rot: S.sel, off: Math.atan2(p.y - q0[2], p.x - q0[1]) / RAD - q0[3] }; } var t = e.target.closest && e.target.closest('[data-i],[data-t]'); if (!t) { if (S.sel >= 0) { S.sel = -1; draw(); } return null; }
          if (t.hasAttribute('data-t')) { S.b.push([t.getAttribute('data-t'), p.x, p.y, 0]); S.sel = S.b.length - 1; draw(); return { i: S.sel, dx: 0, dy: 0, fresh: 1 }; }
          var i = +t.getAttribute('data-i'); S.sel = i; draw(); return { i: i, dx: S.b[i][1] - p.x, dy: S.b[i][2] - p.y }; },
        move: function (p, c) { if (c.rot != null) { var qr = S.b[c.rot]; qr[3] = ((Math.round((Math.atan2(p.y - qr[2], p.x - qr[1]) / RAD - c.off) / 30) * 30) % 360 + 360) % 360; draw(); return; } var q = S.b[c.i]; q[1] = O.clamp(p.x + c.dx, 10, W - 10); q[2] = O.clamp(p.y + c.dy, 10, H - 10); draw(); },
        up: function (p, c, moved) {
          if (c.rot != null) { api.redraw(); return; }
          var q = S.b[c.i];
          if (q[2] < TRAY && (moved || c.fresh)) { if (moved) { S.b.splice(c.i, 1); S.sel = -1; } else { q[1] = MX; q[2] = MY; } api.redraw(); return; }
          if (moved) { var tg = []; S.b.forEach(function (o, j) { if (j !== c.i) tg = tg.concat(abs(o)); }); var sh = snapShift(abs(q), tg, 12); if (sh) { q[1] += sh[0]; q[2] += sh[1]; } q[1] = Math.round(q[1] * 10) / 10; q[2] = Math.round(q[2] * 10) / 10; }
          api.redraw();
        }
      });
      api.onRedraw(draw);
    }
  });

  /* ================= PROTRACTOR ================= */
  function angType(a) { return a === 0 ? 'zero angle' : a < 90 ? 'acute angle' : a === 90 ? 'right angle' : a < 180 ? 'obtuse angle' : a === 180 ? 'straight angle' : a < 360 ? 'reflex angle' : 'full turn'; }
  O.register('protractor', {
    defaults: { base: 0, a: 50, three: false, c: 110, full: false, show: true, target: '', place: false, px: 0, py: 0, pr: 0 },
    mount: function (api) {
      var S = api.S;
      api.num('Turn the bottom arm (degrees)', 'base', 0, 359, 1);
      api.check('Circle protractor (for reflex angles)', 'full', function () { clampAll(); });
      api.check('Add a third arm (add two angles)', 'three', function () { clampAll(); });
      api.check('Show the protractor', 'show');
      api.check('Place the protractor yourself (practice lining it up)', 'place', function (on) { if (on) { S.px = -150; S.py = -70; S.pr = (S.base + 25) % 360; } else { S.px = S.py = 0; S.pr = S.base; } });
      api.heading('Challenge');
      api.text('Ask students to make this angle', 'target', null, 'like 135');
      var v = holder(api, 640, 370, 'Protractor');
      var cx, cy, R;
      function lim() { return S.full ? 359 : 180; }
      function clampAll() { S.a = O.clamp(S.a, 0, lim()); S.c = O.clamp(S.c, 0, lim()); }
      function P(deg, r) { return [cx + r * Math.cos(deg * RAD), cy - r * Math.sin(deg * RAD)]; }
      function arc(a0, a1, r) { var pts = []; for (var t = a0; t <= a1 + 0.01; t += Math.max(1, (a1 - a0) / 60)) pts.push(P(t, r)); pts.push(P(a1, r)); return poly(pts); }
      function draw() {
        clear(v); var square = S.full || S.base !== 0 || S.place;
        if (square) { size(v, 640, 640); cx = 320; cy = 320; R = 235; } else { size(v, 640, 370); cx = 320; cy = 335; R = 255; }
        O.s('rect', { x: 0, y: 0, width: 640, height: square ? 640 : 370, rx: 14, fill: '#fff', class: 'paper' }, v);
        if (S.show) {
          var g = O.s('g', { transform: S.place ? 'translate(' + S.px + ' ' + S.py + ') rotate(' + (-S.pr) + ' ' + cx + ' ' + cy + ')' : 'rotate(' + (-S.base) + ' ' + cx + ' ' + cy + ')' }, v), top = S.full ? 360 : 180;
          if (S.full) O.s('circle', { cx: cx, cy: cy, r: R, fill: 'rgba(107,70,193,.07)', stroke: VIO, 'stroke-width': 2, 'data-pbody': 1 }, g);
          else O.s('path', { d: 'M' + (cx - R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 0 1 ' + (cx + R) + ' ' + cy + ' Z', fill: 'rgba(107,70,193,.07)', stroke: VIO, 'stroke-width': 2, 'data-pbody': 1 }, g);
          for (var d = 0; d < top + (S.full ? 0 : 1); d++) { var L = d % 10 === 0 ? 18 : d % 5 === 0 ? 12 : 6, a = P(d, R), b = P(d, R - L); O.s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: NAVY, 'stroke-width': d % 10 ? 1 : 1.6, class: 'inks' }, g);
            if (d % 10 === 0) { var t1 = P(d, R - 30); O.s('text', { x: t1[0], y: t1[1] + 4, 'text-anchor': 'middle', 'font-size': 12, fill: NAVY, class: 'ink', text: d }, g);
              if (!S.full) { var t2 = P(d, R - 52); O.s('text', { x: t2[0], y: t2[1] + 4, 'text-anchor': 'middle', 'font-size': 10.5, fill: VIO, text: 180 - d }, g); } } }
          O.s('line', { x1: cx - (S.full ? R : R), y1: cy, x2: cx + R, y2: cy, stroke: VIO, 'stroke-width': 1.5 }, g);
          O.s('circle', { cx: cx, cy: cy, r: 4, fill: VIO }, g);
          O.s('line', { x1: cx, y1: cy - 12, x2: cx, y2: cy, stroke: VIO, 'stroke-width': 1.5 }, g);
          if (S.place) { g.setAttribute('data-pbody', 1); g.style.cursor = 'grab'; var ph = O.s('circle', { cx: cx + R + 24, cy: cy, r: 16, fill: '#fff', stroke: VIO, 'stroke-width': 3, 'data-h': 'prot', style: 'cursor:grab' }, g); O.s('text', { x: cx + R + 24, y: cy + 5, 'text-anchor': 'middle', 'font-size': 15, fill: VIO, text: '⟳', style: 'pointer-events:none' }, g); }
        }
        /* angle arcs */
        var A = S.base, arms = [[A, NAVY, 'base'], [A + S.a, GRN, 'a']]; if (S.three) arms.push([A + S.c, RED, 'c']);
        var lo = Math.min(S.a, S.three ? S.c : S.a), hi = Math.max(S.a, S.three ? S.c : S.a);
        if (S.a > 0) O.s('polyline', { points: arc(A, A + (S.three ? lo : S.a), 55), fill: 'none', stroke: GRN, 'stroke-width': 3 }, v);
        if (S.three && hi > lo) O.s('polyline', { points: arc(A + lo, A + hi, 70), fill: 'none', stroke: RED, 'stroke-width': 3 }, v);
        var m1 = P(A + (S.three ? lo : S.a) / 2, 88); O.s('text', { x: m1[0], y: m1[1] + 5, 'text-anchor': 'middle', 'font-size': 17, fill: GRN, class: 'om-num', text: (S.three ? lo : S.a) + '°' }, v);
        if (S.three && hi > lo) { var m2 = P(A + (lo + hi) / 2, 104); O.s('text', { x: m2[0], y: m2[1] + 5, 'text-anchor': 'middle', 'font-size': 17, fill: RED, class: 'om-num', text: (hi - lo) + '°' }, v); }
        arms.forEach(function (am) { var e = P(am[0], R + 22); O.s('line', { x1: cx, y1: cy, x2: e[0], y2: e[1], stroke: am[1], 'stroke-width': 4, 'stroke-linecap': 'round', class: am[2] === 'base' ? 'inks' : '' }, v);
          var h = O.s('circle', { cx: e[0], cy: e[1], r: 15, fill: am[1], stroke: '#fff', 'stroke-width': 3, 'data-h': am[2], style: 'cursor:grab' }, v);
          keyTapArrows(h, am[2]); });
        O.s('circle', { cx: cx, cy: cy, r: 6, fill: NAVY, class: 'ink' }, v);
        var out = S.three ? '<span>Angles: <b>' + lo + '°</b> and <b>' + (hi - lo) + '°</b></span><span>Together: <b>' + hi + '°</b> (' + angType(hi) + ')</span>' : '<span>Angle: <b>' + S.a + '°</b></span><span>It is ' + art(angType(S.a)) + ' <b>' + angType(S.a) + '</b></span>';
        api.readout(out);
        api.report(S.three ? { v: String(hi), a: String(lo), b: String(hi - lo) } : { v: String(S.a), a: String(S.a), b: '' });
        var tg = parseInt(S.target, 10);
        var pm = '';
        if (S.place && S.show) { var c1 = !S.px && !S.py, c2 = ((S.pr - S.base) % 360 + 360) % 360 === 0;
          pm = 'Drag the protractor so its center dot sits on the corner, then turn it with the round ⟳ handle until 0 is on the bottom arm. ' + (c1 ? '<span style="color:' + GRN + '">✓ Center on the corner.</span> ' : '') + (c2 ? '<span style="color:' + GRN + '">✓ 0 on the bottom arm.</span> ' : '') + (c1 && c2 ? '' : '<br>'); }
        if (pm && !(!S.px && !S.py && ((S.pr - S.base) % 360 + 360) % 360 === 0)) api.say(pm);
        else if (!isNaN(tg)) api.say(pm + 'Make an angle of <b>' + tg + '°</b>. Drag the green arm.' + ((S.three ? hi : S.a) === tg ? ' <span style="color:' + GRN + '">✓ That is ' + tg + '°!</span>' : ''));
        else api.say(pm + 'Drag the green arm to make an angle. Read the scale that starts at 0 on the bottom arm.');
      }
      function keyTapArrows(h, which) { h.setAttribute('tabindex', '0'); h.setAttribute('role', 'slider'); h.setAttribute('aria-label', which === 'base' ? 'Bottom arm' : 'Arm'); h.addEventListener('keydown', function (e) { var d = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowRight' || e.key === 'ArrowDown' ? -1 : 0; if (!d) return; e.preventDefault(); setArm(which, (which === 'base' ? S.base : S[which]) + d); api.redraw(); var n = v.querySelector('[data-h="' + which + '"]'); if (n) n.focus(); }); }
      function setArm(which, deg) {
        if (which === 'base') { S.base = ((Math.round(deg) % 360) + 360) % 360; var ins = api.setup.querySelector('input[type=number]'); if (ins) ins.value = S.base; return; }
        var rel = ((Math.round(deg) % 360) + 360) % 360; if (!S.full && rel > 180) rel = rel > 270 ? 0 : 180; S[which] = rel;
      }
      rootDrag(v, {
        down: function (p, e) { var t = e.target.closest && e.target.closest('[data-h]');
          if (!t && S.place && e.target.closest && e.target.closest('[data-pbody]')) return { body: 1, dx: S.px - p.x, dy: S.py - p.y };
          if (!t) return null; return { h: t.getAttribute('data-h') }; },
        move: function (p, c) {
          if (c.body) { S.px = Math.round(p.x + c.dx); S.py = Math.round(p.y + c.dy); draw(); return; }
          if (c.h === 'prot') { S.pr = ((Math.round(Math.atan2(cy + S.py - p.y, p.x - cx - S.px) / RAD) % 360) + 360) % 360; draw(); return; } var deg = Math.atan2(cy - p.y, p.x - cx) / RAD; if (c.h === 'base') { var keep = [S.a, S.c]; setArm('base', deg); } else setArm(c.h, deg - S.base); draw(); },
        up: function (p, c) { if (c.body && Math.hypot(S.px, S.py) < 12) { S.px = 0; S.py = 0; }
          if (c.h === 'prot') { var df = ((S.pr - S.base) % 360 + 360) % 360; if (df < 4 || df > 356) S.pr = S.base; }
          api.redraw(); }
      });
      api.onRedraw(draw);
    }
  });

  /* ================= SET SQUARES & RULER ================= */
  var SSH = { ru: center([[-280, -24], [280, -24], [280, 24], [-280, 24]]), s45: center([[0, 0], [200, 0], [0, -200]]), s30: center([[0, 0], [300, 0], [0, -173.2]]) };
  var SNM = { ru: 'ruler', s45: 'set square (45°)', s30: 'set square (30° and 60°)' };
  O.register('setsquare', {
    defaults: { t: { ru: [400, 470, 0], s45: [180, 230, 0], s30: [560, 230, 0] }, lines: [], mode: 'draw', sel: 's45' },
    mount: function (api) {
      var S = api.S, W = 800, H = 560;
      api.say('Pick Move to slide or turn a tool. Pick Draw, then drag along an edge to draw a straight line.');
      var bar = toolbar(api);
      api.seg('', 'mode', [['move', '✋ Move'], ['draw', '✏ Draw']], null, bar);
      api.button('↺ Turn', function () { turn(-15); }, '', bar); api.button('↻ Turn', function () { turn(15); }, '', bar);
      api.button('↶ Undo', function () { S.lines.pop(); api.redraw(); }, '', bar); api.button('Clear lines', function () { S.lines = []; api.redraw(); }, '', bar);
      api.select('Turn this tool', 'sel', [['ru', 'Ruler'], ['s45', 'Set square (45°)'], ['s30', 'Set square (30° and 60°)']]);
      api.hint('Slide one set square along the ruler to draw lines that never meet (parallel). Use the square corner for lines that cross at a right angle (perpendicular).');
      function turn(d) { var q = S.t[S.sel]; q[2] = (q[2] + d + 360) % 360; api.redraw(); }
      var v = holder(api, W, H, 'Ruler and set squares for drawing lines');
      function abs(k) { var q = S.t[k]; return xf(SSH[k], q[0], q[1], q[2], 0); }
      function edges() { var e = []; ['ru', 's45', 's30'].forEach(function (k) { var p = abs(k); p.forEach(function (a, i) { e.push([a, p[(i + 1) % p.length]]); }); }); return e; }
      function draw() {
        clear(v); O.s('rect', { x: 0, y: 0, width: W, height: H, rx: 14, fill: '#fff', class: 'paper' }, v);
        for (var x = 20; x < W; x += 20) O.s('line', { x1: x, y1: 0, x2: x, y2: H, stroke: '#F0F2F8' }, v);
        for (var y = 20; y < H; y += 20) O.s('line', { x1: 0, y1: y, x2: W, y2: y, stroke: '#F0F2F8' }, v);
        S.lines.forEach(function (l, i) { O.s('line', { x1: l[0], y1: l[1], x2: l[2], y2: l[3], stroke: NAVY, 'stroke-width': 3, 'stroke-linecap': 'round', class: 'inks' }, v);
          O.s('text', { x: l[0] + (l[0] < l[2] ? -14 : 8), y: l[1] + 4, 'font-size': 13, fill: VIO, text: i + 1 }, v); });
        ['s45', 's30', 'ru'].sort(function (a, b) { return (a === S.sel) - (b === S.sel); }).forEach(function (k) {
          var q = S.t[k], g = O.s('g', { transform: 'translate(' + q[0] + ' ' + q[1] + ') rotate(' + q[2] + ')', 'data-tool': k, style: 'cursor:' + (S.mode === 'move' ? 'grab' : 'crosshair') }, v);
          O.s('polygon', { points: poly(SSH[k]), fill: k === 'ru' ? '#FFF4C7' : k === 's45' ? '#D9F0E3' : '#E6DDF8', 'fill-opacity': .75, stroke: k === S.sel ? NAVY : GRAY, 'stroke-width': k === S.sel ? 2.5 : 1.5 }, g);
          if (k === 'ru') for (var c = 0; c <= 27; c++) { var tx = -270 + c * 20; O.s('line', { x1: tx, y1: -24, x2: tx, y2: -24 + (c % 5 ? 9 : 15), stroke: NAVY, 'stroke-width': 1.2 }, g); if (c % 5 === 0) O.s('text', { x: tx, y: -2, 'text-anchor': 'middle', 'font-size': 10, fill: NAVY, text: c }, g); }
          else { var cn = SSH[k][0]; O.s('polyline', { points: poly([[cn[0] + 14, cn[1]], [cn[0] + 14, cn[1] - 14], [cn[0], cn[1] - 14]]), fill: 'none', stroke: GRAY, 'stroke-width': 1.5 }, g); }
          keyTap(g, function () { S.sel = k; api.redraw(); }, SNM[k]);
        });
        /* relations */
        var rel = [], L = S.lines;
        for (var i = 0; i < L.length; i++) for (var j = i + 1; j < L.length; j++) { var a1 = Math.atan2(L[i][3] - L[i][1], L[i][2] - L[i][0]) / RAD, a2 = Math.atan2(L[j][3] - L[j][1], L[j][2] - L[j][0]) / RAD, d = Math.abs(((a1 - a2) % 180 + 180) % 180); d = Math.min(d, 180 - d);
          if (d <= 1) rel.push('Lines ' + (i + 1) + ' and ' + (j + 1) + ' are <b>parallel</b>'); else if (Math.abs(d - 90) <= 1) rel.push('Lines ' + (i + 1) + ' and ' + (j + 1) + ' are <b>perpendicular</b>'); }
        api.readout(rel.slice(-6).map(function (r) { return '<span>' + r + '.</span>'; }).join(''));
        var lastRel = rel.length ? rel[rel.length - 1] : ''; api.report({ v: /perpendicular/.test(lastRel) ? 'perpendicular' : /parallel/.test(lastRel) ? 'parallel' : '' });
      }
      rootDrag(v, {
        down: function (p, e) {
          var t = e.target.closest && e.target.closest('[data-tool]');
          if (S.mode === 'move') { if (!t) return null; var k = t.getAttribute('data-tool'); S.sel = k; var sel = api.setup.querySelector('select'); if (sel) sel.value = k; draw(); return { k: k, dx: S.t[k][0] - p.x, dy: S.t[k][1] - p.y }; }
          var best = null, bd = 16; edges().forEach(function (ed) { var d = segDist([p.x, p.y], ed[0], ed[1]); if (d < bd) { bd = d; best = ed; } });
          var c = { a: [p.x, p.y], dir: null };
          if (best) { var dx = best[1][0] - best[0][0], dy = best[1][1] - best[0][1], L = Math.hypot(dx, dy); c.dir = [dx / L, dy / L]; c.o = best[0]; c.a = proj(c, [p.x, p.y]); }
          c.el = O.s('line', { x1: c.a[0], y1: c.a[1], x2: c.a[0], y2: c.a[1], stroke: NAVY, 'stroke-width': 3, 'stroke-linecap': 'round' }, v); return c;
        },
        move: function (p, c) {
          if (c.k) { S.t[c.k][0] = O.clamp(p.x + c.dx, 0, W); S.t[c.k][1] = O.clamp(p.y + c.dy, 0, H); draw(); return; }
          c.b = c.dir ? proj(c, [p.x, p.y]) : [p.x, p.y]; c.el.setAttribute('x2', c.b[0]); c.el.setAttribute('y2', c.b[1]);
        },
        up: function (p, c) {
          if (c.k) { S.t[c.k][0] = Math.round(S.t[c.k][0]); S.t[c.k][1] = Math.round(S.t[c.k][1]); api.redraw(); return; }
          if (c.b && Math.hypot(c.b[0] - c.a[0], c.b[1] - c.a[1]) > 8) S.lines.push([c.a[0], c.a[1], c.b[0], c.b[1]].map(function (n) { return Math.round(n * 10) / 10; }));
          api.redraw();
        }
      });
      function proj(c, p) { var t = (p[0] - c.o[0]) * c.dir[0] + (p[1] - c.o[1]) * c.dir[1]; return [c.o[0] + t * c.dir[0], c.o[1] + t * c.dir[1]]; }
      api.onRedraw(draw);
    }
  });

  /* ================= COMPASS ================= */
  O.register('compass', {
    defaults: { cx: 9, cy: 6, r: 3, a: 0, circ: [], lines: true },
    mount: function (api) {
      var S = api.S, CM = 30, M = 20, GW = 18, GH = 12, W = GW * CM + 2 * M, H = GH * CM + 2 * M, busy = false;
      api.say('Drag the gray point to the center. Drag the yellow pencil out to open the compass, then drag it all the way around to draw the circle.');
      var bar = toolbar(api);
      api.button('Draw it for me', swing, '', bar);
      api.button('↶ Undo', function () { S.circ.pop(); api.redraw(); }, '', bar); api.button('Clear', function () { S.circ = []; api.redraw(); }, '', bar);
      var rIn = api.num('Radius (cm)', 'r', 0.5, 8, 0.5);
      api.check('Show radius and diameter', 'lines');
      var v = holder(api, W, H, 'Centimeter grid with a compass');
      function X(c) { return M + c * CM; }
      function pen() { return [S.cx + S.r * Math.cos(S.a * RAD), S.cy - S.r * Math.sin(S.a * RAD)]; }
      function cpts(cx, cy, r, a0, a1) { var p = []; for (var t = a0; t <= a1; t += 4) p.push([X(cx + r * Math.cos(t * RAD)), X(cy - r * Math.sin(t * RAD))]); p.push([X(cx + r * Math.cos(a1 * RAD)), X(cy - r * Math.sin(a1 * RAD))]); return p; }
      function draw(sweep) {
        clear(v); O.s('rect', { x: 0, y: 0, width: W, height: H, rx: 12, fill: '#fff', class: 'paper' }, v);
        for (var i = 0; i <= GW; i++) O.s('line', { x1: X(i), y1: M, x2: X(i), y2: H - M, stroke: '#DCE2EE' }, v);
        for (var j = 0; j <= GH; j++) O.s('line', { x1: M, y1: X(j), x2: W - M, y2: X(j), stroke: '#DCE2EE' }, v);
        O.s('text', { x: W - M, y: H - 5, 'text-anchor': 'end', 'font-size': 11, fill: GRAY, class: 'ink', text: 'Each square is 1 cm' }, v);
        S.circ.forEach(function (c) { O.s('circle', { cx: X(c[0]), cy: X(c[1]), r: c[2] * CM, fill: 'none', stroke: NAVY, 'stroke-width': 2.5, class: 'inks' }, v); O.s('circle', { cx: X(c[0]), cy: X(c[1]), r: 3, fill: NAVY, class: 'ink' }, v); });
        var last = S.circ[S.circ.length - 1];
        if (S.lines && last) { var c0 = [X(last[0]), X(last[1])], rr = last[2] * CM, e1 = [c0[0] + rr * Math.cos(35 * RAD), c0[1] - rr * Math.sin(35 * RAD)];
          O.s('line', { x1: c0[0], y1: c0[1], x2: e1[0], y2: e1[1], stroke: GRN, 'stroke-width': 3 }, v);
          O.s('text', { x: (c0[0] + e1[0]) / 2 - 6, y: (c0[1] + e1[1]) / 2 - 8, 'font-size': 13, fill: GRN, 'text-anchor': 'end', class: 'om-num', text: 'radius ' + last[2] + ' cm' }, v);
          O.s('line', { x1: c0[0] - rr, y1: c0[1], x2: c0[0] + rr, y2: c0[1], stroke: VIO, 'stroke-width': 3 }, v);
          O.s('text', { x: c0[0], y: c0[1] + 18, 'font-size': 13, fill: VIO, 'text-anchor': 'middle', class: 'om-num', text: 'diameter ' + (last[2] * 2) + ' cm' }, v); }
        if (sweep) O.s('polyline', { points: poly(cpts(S.cx, S.cy, S.r, Math.min(S.a, S.a + sweep), Math.max(S.a, S.a + sweep))), fill: 'none', stroke: NAVY, 'stroke-width': 2.5, class: 'inks' }, v);
        /* compass */
        var ang = S.a + (sweep || 0), n = [X(S.cx), X(S.cy)], pp = [X(S.cx + S.r * Math.cos(ang * RAD)), X(S.cy - S.r * Math.sin(ang * RAD))], mid = [(n[0] + pp[0]) / 2, (n[1] + pp[1]) / 2], d = Math.hypot(pp[0] - n[0], pp[1] - n[1]), Lg = 270, hh = Math.sqrt(Math.max(Lg * Lg - d * d / 4, 0)) * 0.45;
        var ux = d ? (pp[0] - n[0]) / d : 1, uy = d ? (pp[1] - n[1]) / d : 0, hinge = [mid[0] + uy * hh, mid[1] - ux * hh]; if (hinge[1] > mid[1]) hinge = [mid[0] - uy * hh, mid[1] + ux * hh];
        O.s('line', { x1: n[0], y1: n[1], x2: hinge[0], y2: hinge[1], stroke: GRAY, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: .85 }, v);
        O.s('line', { x1: pp[0], y1: pp[1], x2: hinge[0], y2: hinge[1], stroke: VIO, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: .85 }, v);
        O.s('circle', { cx: hinge[0], cy: hinge[1], r: 10, fill: NAVY, 'data-h': 'p', style: 'cursor:grab' }, v);
        O.s('line', { x1: n[0], y1: n[1], x2: pp[0], y2: pp[1], stroke: YEL, 'stroke-width': 2, 'stroke-dasharray': '4 4' }, v);
        var hn = O.s('circle', { cx: n[0], cy: n[1], r: 14, fill: 'rgba(91,100,120,.25)', stroke: GRAY, 'stroke-width': 2, 'data-h': 'n', style: 'cursor:grab' }, v); O.s('circle', { cx: n[0], cy: n[1], r: 3, fill: NAVY, style: 'pointer-events:none' }, v);
        var hp = O.s('circle', { cx: pp[0], cy: pp[1], r: 14, fill: YEL, stroke: NAVY, 'stroke-width': 2, 'data-h': 'p', style: 'cursor:grab' }, v);
        keyMove(hn, 'n'); keyMove(hp, 'p');
        api.readout(last ? '<span>Last circle: radius <b>' + last[2] + ' cm</b></span><span>Diameter <b>' + (last[2] * 2) + ' cm</b></span>' : '<span>The compass is set to <b>' + S.r + ' cm</b>.</span>');
        api.report({ v: last ? String(last[2]) : '' });
      }
      function keyMove(h, w) { h.setAttribute('tabindex', '0'); h.setAttribute('role', 'button'); h.setAttribute('aria-label', w === 'n' ? 'Needle point. Use arrow keys to move.' : 'Pencil. Arrow keys change the radius.');
        h.addEventListener('keydown', function (e) { var k = e.key, dx = k === 'ArrowRight' ? .5 : k === 'ArrowLeft' ? -.5 : 0, dy = k === 'ArrowDown' ? .5 : k === 'ArrowUp' ? -.5 : 0; if (!dx && !dy) return; e.preventDefault();
          if (w === 'n') { S.cx = O.clamp(S.cx + dx, 0, GW); S.cy = O.clamp(S.cy + dy, 0, GH); } else { S.r = O.clamp(S.r + dx - dy, .5, 8); rIn.value = S.r; } api.redraw(); var q = v.querySelector('[data-h="' + w + '"]'); if (q) q.focus(); }); }
      function swing() { if (busy) return; var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; if (reduce) { done(); return; } busy = true; var t0 = performance.now();
        (function step(t) { var k = Math.min(1, (t - t0) / 1100); draw(k * 360); if (k < 1) requestAnimationFrame(step); else done(); })(t0); }
      function done() { busy = false; S.circ.push([S.cx, S.cy, S.r]); api.redraw(); }
      rootDrag(v, {
        down: function (p, e) { if (busy) return null; var t = e.target.closest && e.target.closest('[data-h]'); if (!t) return null; var gx = (p.x - M) / CM, gy = (p.y - M) / CM, a0 = Math.atan2(S.cy - gy, gx - S.cx) / RAD;
          return { h: t.getAttribute('data-h'), start: S.a, prev: a0, acc: 0, drawing: false }; },
        move: function (p, c) { var gx = (p.x - M) / CM, gy = (p.y - M) / CM;
          if (c.h === 'n') { S.cx = O.clamp(Math.round(gx * 2) / 2, 0, GW); S.cy = O.clamp(Math.round(gy * 2) / 2, 0, GH); draw(); return; }
          if (c.fin) return;
          var r = Math.hypot(gx - S.cx, gy - S.cy), ang = Math.atan2(S.cy - gy, gx - S.cx) / RAD;
          if (!c.drawing && Math.abs(r - S.r) >= 0.5) { S.r = O.clamp(Math.round(r * 2) / 2, .5, 8); S.a = Math.round(ang); c.start = S.a; c.prev = ang; c.acc = 0; rIn.value = S.r; draw(); return; }
          var d = ang - c.prev; if (d > 180) d -= 360; if (d < -180) d += 360; c.acc += d; c.prev = ang;
          if (Math.abs(c.acc) > 8) c.drawing = true;
          if (Math.abs(c.acc) >= 356) { c.fin = true; S.circ.push([S.cx, S.cy, S.r]); S.a = Math.round(c.start + c.acc); api.redraw(); return; }
          S.a = c.start; draw(c.drawing ? c.acc : 0); },
        up: function (p, c) { if (c.h === 'p' && c.drawing && !c.fin) { S.a = Math.round(c.start + c.acc); O.toast('Keep going all the way around to finish the circle.'); } api.redraw(); }
      });
      api.onRedraw(function () { draw(0); });
    }
  });

  /* ================= UNIT CUBES ================= */
  O.register('cubes', {
    defaults: { n: 5, h: {}, mode: 'add', lay: false, rot: 0, cm: false, L: 4, W: 3, H: 2 },
    mount: function (api) {
      var S = api.S, s = 30, a = s * 0.866, b = s / 2, MAXH = 8;
      var LC = [VIO, GRN, YEL, BLUE, ORG, RED, TEAL, '#D6457A'];
      api.say('Drag a cube from the tray onto a square to stack it. Drag the top cube off the board to take it away.');
      var bar = toolbar(api);
      api.seg('', 'mode', [['add', '＋ Add a cube'], ['remove', '－ Take away']], null, bar);
      api.button('⟲ Turn', function () { S.rot = (S.rot + 3) % 4; api.redraw(); }, '', bar); api.button('⟳ Turn', function () { S.rot = (S.rot + 1) % 4; api.redraw(); }, '', bar);
      api.button('Clear', function () { S.h = {}; api.redraw(); }, '', bar);
      api.select('Base size', 'n', [3, 4, 5, 6, 7, 8].map(function (k) { return [k, k + ' by ' + k]; }), function () { Object.keys(S.h).forEach(function (k) { var q = k.split('_'); if (+q[0] >= S.n || +q[1] >= S.n) delete S.h[k]; }); });
      api.check('Pull the layers apart', 'lay');
      api.check('Cubes are 1 cm (cubic centimeters)', 'cm');
      api.heading('Build a box');
      api.num('Length', 'L', 1, 8, 1); api.num('Width', 'W', 1, 8, 1); api.num('Height', 'H', 1, 8, 1);
      api.button('Build it', function () { if (S.L > S.n || S.W > S.n) S.n = Math.max(S.L, S.W); var sel = api.setup.querySelector('select'); if (sel) sel.value = S.n; S.h = {}; for (var x = 0; x < S.L; x++) for (var y = 0; y < S.W; y++) S.h[x + '_' + y] = S.H; api.redraw(); }, 'primary', api.row());
      var v = holder(api, 400, 400, 'Unit cubes');
      function view(x, y) { var n = S.n - 1; return [[x, y], [n - y, x], [n - x, n - y], [y, n - x]][S.rot]; }
      function shade(hex, f) { var c = parseInt(hex.slice(1), 16), r = c >> 16, g = (c >> 8) & 255, bl = c & 255; function m(v) { return Math.round(f > 1 ? v + (255 - v) * (f - 1) : v * f); } return 'rgb(' + m(r) + ',' + m(g) + ',' + m(bl) + ')'; }
      function act(k) { var cur = S.h[k] || 0; if (S.mode === 'add') { if (cur >= MAXH) { O.toast('That stack is as tall as it can go.'); return; } S.h[k] = cur + 1; } else { if (!cur) return; if (cur === 1) delete S.h[k]; else S.h[k] = cur - 1; } api.redraw(); }
      function draw() {
        clear(v); var mh = 0; Object.keys(S.h).forEach(function (k) { mh = Math.max(mh, S.h[k]); }); mh = Math.max(3, Math.min(MAXH, mh + 1));
        var gap = S.lay ? 0.45 : 0, ox = S.n * a + 24, oy = 24 + mh * s * (1 + gap), W = 2 * S.n * a + 48, H = oy + 2 * S.n * b + 24; size(v, W, H);
        function P(u, w, z, lv) { return [ox + (u - w) * a, oy + (u + w) * b - (z + lv * gap) * s]; }
        O.s('rect', { x: 0, y: 0, width: W, height: H, rx: 14, fill: '#fff', class: 'paper' }, v);
        var cells = [];
        for (var x = 0; x < S.n; x++) for (var y = 0; y < S.n; y++) { var uv = view(x, y); cells.push({ k: x + '_' + y, u: uv[0], w: uv[1] }); }
        cells.forEach(function (c) { var g = O.s('polygon', { points: poly([P(c.u, c.w, 0, 0), P(c.u + 1, c.w, 0, 0), P(c.u + 1, c.w + 1, 0, 0), P(c.u, c.w + 1, 0, 0)]), fill: '#EEF1F8', stroke: '#C9D0E3', 'stroke-width': 1, 'data-k': c.k, class: 'om-tap' }, v); keyTap(g, function () { act(c.k); }, 'Stack at ' + c.k.replace('_', ', ')); });
        var cubes = []; cells.forEach(function (c) { for (var z = 0; z < (S.h[c.k] || 0); z++) cubes.push({ c: c, z: z }); });
        cubes.sort(function (p, q) { return (p.c.u + p.c.w) - (q.c.u + q.c.w) || p.z - q.z; });
        cubes.forEach(function (q) { var u = q.c.u, w = q.c.w, z = q.z, col = S.lay ? LC[z % 8] : VIO, g = O.s('g', { 'data-k': q.c.k, style: 'cursor:pointer' }, v), st = { stroke: 'rgba(14,28,66,.55)', 'stroke-width': 1, 'stroke-linejoin': 'round' };
          O.s('polygon', Object.assign({ points: poly([P(u, w + 1, z, z), P(u + 1, w + 1, z, z), P(u + 1, w + 1, z + 1, z), P(u, w + 1, z + 1, z)]), fill: shade(col, 0.82) }, st), g);
          O.s('polygon', Object.assign({ points: poly([P(u + 1, w, z, z), P(u + 1, w + 1, z, z), P(u + 1, w + 1, z + 1, z), P(u + 1, w, z + 1, z)]), fill: shade(col, 0.62) }, st), g);
          O.s('polygon', Object.assign({ points: poly([P(u, w, z + 1, z), P(u + 1, w, z + 1, z), P(u + 1, w + 1, z + 1, z), P(u, w + 1, z + 1, z)]), fill: shade(col, 1.35) }, st), g); });
        /* readout */
        var ks = Object.keys(S.h).filter(function (k) { return S.h[k] > 0; }), vol = 0; ks.forEach(function (k) { vol += S.h[k]; });
        var unit = S.cm ? ['cubic centimeter', 'cubic centimeters'] : ['cubic unit', 'cubic units'], out = '<span>Cubes: <b>' + vol + '</b></span><span>Volume: <b>' + plural(vol, unit[0], unit[1]) + '</b></span>';
        if (vol) { var xs = ks.map(function (k) { return +k.split('_')[0]; }), ys = ks.map(function (k) { return +k.split('_')[1]; }), bw = Math.max.apply(0, xs) - Math.min.apply(0, xs) + 1, bl = Math.max.apply(0, ys) - Math.min.apply(0, ys) + 1, h0 = S.h[ks[0]];
          if (ks.length === bw * bl && ks.every(function (k) { return S.h[k] === h0; })) out += '<span>Box: length ' + bw + ' × width ' + bl + ' × height ' + h0 + ' = ' + vol + '</span><span>A cuboid has 6 faces, 12 edges and 8 vertices.</span>';
          if (S.lay) { var mx = 0; ks.forEach(function (k) { mx = Math.max(mx, S.h[k]); }); var ls = []; for (var z = 0; z < mx; z++) ls.push('Layer ' + (z + 1) + ': ' + ks.filter(function (k) { return S.h[k] > z; }).length); out += '<span>' + ls.join(' · ') + '</span>'; } }
        /* cube tray */
        var tg = O.s('g', { 'data-tray': 1, style: 'cursor:grab' }, v); O.s('rect', { x: 8, y: 8, width: 92, height: 74, rx: 10, fill: '#F1EDFB' }, tg); iso(tg, 54, 30, 16, VIO); O.s('text', { x: 54, y: 74, 'text-anchor': 'middle', 'font-size': 11.5, fill: NAVY, text: 'Drag a cube', style: 'pointer-events:none' }, tg);
        api.readout(out); api.report({ v: String(vol) });
      }
      v.addEventListener('click', function (e) { if (Date.now() - lastDrag < 400) return; var t = e.target.closest && e.target.closest('[data-k]'); if (t) act(t.getAttribute('data-k')); });
      var lastDrag = 0;
      function iso(par, x, y, sz, col) { var A = sz * 0.866, Bh = sz / 2, st = { stroke: 'rgba(14,28,66,.55)', 'stroke-width': 1, 'stroke-linejoin': 'round', style: 'pointer-events:none' };
        O.s('polygon', Object.assign({ points: poly([[x, y], [x + A, y - Bh], [x, y - 2 * Bh], [x - A, y - Bh]]), fill: shade(col, 1.35) }, st), par);
        O.s('polygon', Object.assign({ points: poly([[x - A, y - Bh], [x, y], [x, y + sz], [x - A, y + sz - Bh]]), fill: shade(col, 0.82) }, st), par);
        O.s('polygon', Object.assign({ points: poly([[x + A, y - Bh], [x, y], [x, y + sz], [x + A, y + sz - Bh]]), fill: shade(col, 0.62) }, st), par); }
      function cellUnder(p) { var m = v.getScreenCTM(); if (!m) return null; var el = document.elementFromPoint(m.a * p.x + m.c * p.y + m.e, m.b * p.x + m.d * p.y + m.f); var t = el && el.closest && el.closest('[data-k]'); return t ? t.getAttribute('data-k') : null; }
      rootDrag(v, {
        down: function (p, e) { if (e.target.closest && e.target.closest('[data-tray]')) return { add: 1 };
          var cg = e.target.closest && e.target.closest('g[data-k]'); if (cg) return { lift: cg.getAttribute('data-k') }; return null; },
        move: function (p, c, moved) { if (!moved) return; if (!c.gh) { c.gh = O.s('g', { style: 'pointer-events:none', opacity: .85 }, v); iso(c.gh, 0, 0, 22, VIO); } if (!c.gh.parentNode) v.appendChild(c.gh); c.gh.setAttribute('transform', 'translate(' + p.x + ' ' + (p.y - 10) + ')'); },
        up: function (p, c, moved) { if (c.gh && c.gh.parentNode) c.gh.remove(); if (!moved) { if (c.add) O.toast('Drag the cube onto a square.'); return; } lastDrag = Date.now();
          var k = cellUnder(p);
          if (c.add) { if (!k) return; var cur = S.h[k] || 0; if (cur >= MAXH) { O.toast('That stack is as tall as it can go.'); return; } S.h[k] = cur + 1; api.redraw(); return; }
          if (c.lift) { if (k === c.lift) return; var h0 = S.h[c.lift] || 0; if (!h0) return; if (h0 === 1) delete S.h[c.lift]; else S.h[c.lift] = h0 - 1; if (k) { var c2 = S.h[k] || 0; if (c2 < MAXH) S.h[k] = c2 + 1; } api.redraw(); } }
      });
      api.onRedraw(draw);
    }
  });
})();
