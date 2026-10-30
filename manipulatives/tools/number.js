/* Place value, models and operations tools:
   pvcards · blocks · bond · bar · numberline · counters · hundred · dice */
(function () {
  var O = OAOM;
  var PV = { 6: '#7A5230', 5: '#138A8A', 4: '#D6457A', 3: '#7C4DFF', 2: '#2F6FDE', 1: '#23915A', 0: '#F08A24', '-1': '#C99A00', '-2': '#C2410C', '-3': '#5B6478' };
  var NAVY = '#0E1C42', VIO = '#6B46C1', GRN = '#23915A', YEL = '#F2B705';
  function hx(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function mix(c, t, w) { var a = hx(c), b = hx(w); return '#' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0'); }).join(''); }
  function tint(c, t) { return mix(c, t, '#ffffff'); }
  function shade(c, t) { return mix(c, t, '#000000'); }
  function num(t) { if (t == null) return NaN; t = String(t).replace(/[,\s$]/g, ''); if (t === '' || !/^-?\d*\.?\d+$/.test(t)) return NaN; return parseFloat(t); }
  function nice(v) { return O.fmt(Math.round(v * 1e6) / 1e6); }
  /* stacked fraction drawn in SVG, centered on x, top of numerator near y */
  function sFrac(p, x, y, n, d, fs, fill, cls) {
    var g = O.s('g', { class: cls || '' }, p), w = Math.max(String(n).length, String(d).length) * fs * 0.62 + 4;
    O.s('text', { x: x, y: y + fs * 0.85, 'text-anchor': 'middle', 'font-size': fs, fill: fill || NAVY, text: n }, g);
    O.s('line', { x1: x - w / 2, x2: x + w / 2, y1: y + fs + 2, y2: y + fs + 2, stroke: fill || NAVY, 'stroke-width': 1.6 }, g);
    O.s('text', { x: x, y: y + fs * 1.95 + 3, 'text-anchor': 'middle', 'font-size': fs, fill: fill || NAVY, text: d }, g);
    return g;
  }
  /* whole, fraction or mixed number in SVG; v = {w, n, d} */
  function sNum(p, x, y, v, fs, fill, cls) {
    if (!v.n) { O.s('text', { x: x, y: y + fs * 1.4, 'text-anchor': 'middle', 'font-size': fs * 1.1, fill: fill || NAVY, class: cls || '', text: (v.neg ? '−' : '') + v.w }, p); return; }
    if (v.w) { var ws = String(v.w).length * fs * 0.62; O.s('text', { x: x - 4, y: y + fs * 1.4, 'text-anchor': 'end', 'font-size': fs * 1.1, fill: fill || NAVY, class: cls || '', text: v.w }, p); sFrac(p, x + 8, y, v.n, v.d, fs * 0.85, fill, cls); return; }
    sFrac(p, x, y, v.n, v.d, fs, fill, cls);
  }
  /* curly brace from x1 to x2 at y; dir -1 = opens up (label above), 1 = label below */
  function brace(p, x1, x2, y, dir, label, col) {
    var h = 8, m = (x1 + x2) / 2, c = col || NAVY, d;
    if (x2 - x1 < 34) d = 'M' + x1 + ',' + y + ' L' + x1 + ',' + (y + dir * h) + ' L' + x2 + ',' + (y + dir * h) + ' L' + x2 + ',' + y + ' M' + m + ',' + (y + dir * h) + ' L' + m + ',' + (y + dir * 2 * h);
    else d = 'M' + x1 + ',' + y + ' Q' + x1 + ',' + (y + dir * h) + ' ' + (x1 + 10) + ',' + (y + dir * h) + ' L' + (m - 8) + ',' + (y + dir * h) + ' Q' + m + ',' + (y + dir * h) + ' ' + m + ',' + (y + dir * 2 * h) + ' Q' + m + ',' + (y + dir * h) + ' ' + (m + 8) + ',' + (y + dir * h) + ' L' + (x2 - 10) + ',' + (y + dir * h) + ' Q' + x2 + ',' + (y + dir * h) + ' ' + x2 + ',' + y;
    O.s('path', { d: d, fill: 'none', stroke: c, 'stroke-width': 2, class: 'inks' }, p);
    if (label) O.s('text', { x: m, y: dir < 0 ? y - 2 * h - 6 : y + 2 * h + 17, 'text-anchor': 'middle', 'font-size': 17, fill: c, class: 'ink', text: label }, p);
  }
  function rnd(n) { return Math.floor(Math.random() * n); }
  /* redraw when the stage crosses the phone/desktop width */
  function narrowWatch(holder, fn) { var last = null; function chk() { var n = (holder.clientWidth || 800) < 560; if (n !== last) { last = n; fn(); } } window.addEventListener('resize', function () { clearTimeout(chk.t); chk.t = setTimeout(chk, 120); }); return function () { last = (holder.clientWidth || 800) < 560; return last; }; }

  /* ---------- number words (Dimensions style: no "and" in whole numbers) ---------- */
  var ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
  var TENS = ',,twenty,thirty,forty,fifty,sixty,seventy,eighty,ninety'.split(',');
  function w99(n) { return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''); }
  function w999(n) { var h = Math.floor(n / 100), r = n % 100, out = []; if (h) out.push(ONES[h] + ' hundred'); if (r || !h) out.push(w99(r)); return out.join(' '); }
  function wInt(n) {
    if (n === 0) return 'zero';
    var parts = [], m = Math.floor(n / 1e6), t = Math.floor(n / 1000) % 1000, r = n % 1000;
    if (m) parts.push(w999(m) + ' million'); if (t) parts.push(w999(t) + ' thousand'); if (r) parts.push(w999(r));
    return parts.join(', ');
  }
  function words(ip, fp) {
    var i = parseInt(ip || '0', 10), f = fp ? parseInt(fp, 10) : 0, out = '';
    if (i || !f) out = wInt(i);
    if (f) { var u = ['tenth', 'hundredth', 'thousandth'][fp.length - 1]; out += (i ? ' and ' : '') + wInt(f) + ' ' + u + (f > 1 ? 's' : ''); }
    return out;
  }
  function plab(e) { return e >= 0 ? O.fmt(Math.pow(10, e)) : '0.' + '0'.repeat(-e - 1) + '1'; }

  /* ============ PLACE-VALUE CARDS (arrow cards) ============ */
  O.register('pvcards', {
    defaults: { n: '3456', apart: 0 },
    mount: function (api) {
      var S = api.S;
      api.say('Tap the cards to pull them apart. Tap again to push them back together.');
      api.heading('Number on the cards');
      api.text('Type a number', 'n', null, 'like 3,456 or 25.07');
      api.hint('Up to 7 digits, and up to 3 decimal places.');
      var bar = O.el('div', { class: 'om-row', style: 'margin:0 0 .6rem' }); api.stage.appendChild(bar);
      var tog = O.el('button', { type: 'button', class: 'om-btn primary' }); bar.appendChild(tog);
      tog.onclick = function () { S.apart = S.apart ? 0 : 1; draw(true); api.changed(); };
      var holder = O.el('div'); api.stage.appendChild(holder);
      function parse() {
        var t = String(S.n).replace(/[,\s]/g, '');
        if (!/^\d{1,7}(\.\d{1,3})?$/.test(t)) return null;
        var p = t.split('.'), ip = p[0].replace(/^0+(?=\d)/, ''), fp = p[1] || '';
        var cards = [];
        for (var i = 0; i < ip.length; i++) { var d = +ip[i], e = ip.length - 1 - i; if (d) cards.push({ e: e, d: d }); }
        for (var j = 0; j < fp.length; j++) { if (+fp[j]) cards.push({ e: -(j + 1), d: +fp[j] }); }
        if (!cards.length) cards.push({ e: 0, d: 0 });
        return { ip: ip, fp: fp, cards: cards, hi: Math.max(ip.length - 1, 0), lo: -fp.length };
      }
      function draw(anim) {
        tog.textContent = S.apart ? 'Push together' : 'Pull apart';
        var P = parse(); holder.innerHTML = '';
        if (!P) { holder.innerHTML = '<p class="om-hint">Type a whole number up to 7 digits, or a decimal with up to 3 decimal places.</p>'; api.readout(''); return; }
        /* character slots */
        var slot = {}, x = 50, DW = 34, SW = 12;
        for (var e = P.hi; e >= Math.min(P.lo, 0); e--) {
          slot[e] = x; x += DW;
          if (e > 0 && e % 3 === 0) { slot['c' + e] = x; x += SW; }
          if (e === 0 && P.lo < 0) { slot.pt = x; x += SW; }
        }
        var W = Math.max(x + 30, 300), CH = 62, GAP = 76;
        var order = P.cards.filter(function (c) { return c.e >= 0; }).concat(P.cards.filter(function (c) { return c.e < 0; }).reverse());
        var apartOrder = P.cards.slice();
        var H = S.apart ? 30 + apartOrder.length * GAP : 30 + CH + 20;
        var v = O.svg(W, H, holder, 'Place-value cards'); v.style.width = '100%'; v.style.maxWidth = (W * 1.7) + 'px';
        var g0 = O.s('g', {}, v);
        O.tap(g0, function () { tog.click(); }, S.apart ? 'Push the cards together' : 'Pull the cards apart');
        function cardChars(c, stacked) {
          var ch = [];
          if (c.e >= 0) {
            ch.push([slot[c.e], String(c.d)]);
            for (var k = c.e - 1; k >= 0; k--) { if (slot['c' + (k + 1)] != null && (k + 1) % 3 === 0) ch.push([slot['c' + (k + 1)], ',', 1]); ch.push([slot[k], '0']); }
          } else {
            if (!stacked) ch.push([slot[0], '0']);
            ch.push([slot.pt, '.', 1]);
            for (var k2 = -1; k2 > c.e; k2--) ch.push([slot[k2], '0']);
            ch.push([slot[c.e], String(c.d)]);
          }
          return ch;
        }
        var drawList = S.apart ? apartOrder : order;
        drawList.forEach(function (c, i) {
          var col = PV[c.e], ch = cardChars(c, !S.apart && P.ip !== '0');
          var x0 = ch[0][0], last = ch[ch.length - 1], x1 = last[0] + (last[2] ? SW : DW);
          var g = O.s('g', {}, g0);
          var y = S.apart ? 20 + i * GAP : 24;
          var fromY = S.apart ? 24 : 20 + apartOrder.indexOf(c) * GAP;
          g.style.transition = 'transform .45s ease';
          g.style.transform = 'translate(0px,' + (anim ? fromY : y) + 'px)';
          if (anim) requestAnimationFrame(function () { requestAnimationFrame(function () { g.style.transform = 'translate(0px,' + y + 'px)'; }); });
          O.s('rect', { x: x0, y: 0, width: x1 - x0, height: CH, rx: 6, fill: tint(col, .86), stroke: col, 'stroke-width': 2 }, g);
          O.s('rect', { x: x0 + 1, y: 1, width: x1 - x0 - 2, height: 7, rx: 3, fill: col }, g);
          ch.forEach(function (q) { O.s('text', { x: q[0] + (q[2] ? SW / 2 : DW / 2), y: 43, 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 800, fill: shade(col, .15), text: q[1] }, g); });
          if (S.apart && i > 0) O.s('text', { x: 26, y: y + 42, 'text-anchor': 'middle', 'font-size': 32, fill: NAVY, class: 'ink', text: '+' }, v);
        });
        var std = Number(P.ip).toLocaleString('en-US') + (P.fp ? '.' + P.fp : '');
        var exp = P.cards.map(function (c) { return c.e >= 0 ? O.fmt(c.d * Math.pow(10, c.e)) : '0.' + '0'.repeat(-c.e - 1) + c.d; }).join(' + ');
        api.readout('<span>Standard form: <b>' + std + '</b></span><span>Expanded form: <b>' + exp + '</b></span><span>Word form: <b>' + words(P.ip, P.fp.replace(/0+$/, '')) + '</b></span>');
      }
      api.onRedraw(function () { draw(false); });
    }
  });

  /* ============ BASE-TEN BLOCKS ============ */
  function box(p, x, y, w, h, d, col, gx, gy, gz) {
    var st = shade(col, .45), g = O.s('g', {}, p);
    O.s('polygon', { points: [x, y, x + d, y - d, x + w + d, y - d, x + w, y].join(' '), fill: tint(col, .35), stroke: st, 'stroke-width': 1 }, g);
    O.s('polygon', { points: [x + w, y, x + w + d, y - d, x + w + d, y + h - d, x + w, y + h].join(' '), fill: shade(col, .22), stroke: st, 'stroke-width': 1 }, g);
    O.s('rect', { x: x, y: y, width: w, height: h, fill: col, stroke: st, 'stroke-width': 1 }, g);
    var L = [], i;
    for (i = 1; i < gx; i++) { L.push('M' + (x + i * w / gx) + ',' + y + 'v' + h); L.push('M' + (x + i * w / gx) + ',' + y + 'l' + d + ',' + (-d)); }
    for (i = 1; i < gy; i++) { L.push('M' + x + ',' + (y + i * h / gy) + 'h' + w); L.push('M' + (x + w) + ',' + (y + i * h / gy) + 'l' + d + ',' + (-d)); }
    for (i = 1; i < (gz || 1); i++) { var o = i * d / gz; L.push('M' + (x + o) + ',' + (y - o) + 'h' + w); L.push('M' + (x + w + o) + ',' + (y - o) + 'v' + h); }
    if (L.length) O.s('path', { d: L.join(' '), stroke: st, 'stroke-width': .7, 'stroke-opacity': .7, fill: 'none' }, g);
    return g;
  }
  O.register('blocks', {
    defaults: { c: { 3: 1, 2: 2, 1: 3, 0: 4 } },
    mount: function (api) {
      var S = api.S, NM = { 3: 'Thousands', 2: 'Hundreds', 1: 'Tens', 0: 'Ones' }, CW = { 3: 160, 2: 150, 1: 168, 0: 128 };
      function n(e) { return S.c[e] || 0; }
      api.say('Tap <b>+</b> to add a block. Tap a block to break it into 10 smaller blocks.');
      api.heading('Start with a number');
      var row = api.row(); var inp = O.el('input', { type: 'text', placeholder: 'like 1,234', 'aria-label': 'Number to show', style: 'flex:1;min-width:0;border:2px solid var(--line);border-radius:10px;padding:.35em .55em;min-height:38px' });
      row.appendChild(inp); api.button('Show it', function () { setN(inp.value); }, 'primary', row);
      inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') setN(inp.value); });
      api.button('Clear the mat', function () { S.c = {}; api.redraw(); }, '', api.row());
      function setN(t) { var v = num(t); if (isNaN(v) || v < 0 || v > 9999 || v % 1) { O.toast('Type a whole number from 0 to 9,999.'); return; } S.c = { 3: Math.floor(v / 1000), 2: Math.floor(v / 100) % 10, 1: Math.floor(v / 10) % 10, 0: v % 10 }; api.redraw(); }
      var holder = O.el('div'); api.stage.appendChild(holder);
      function layout(e, k) { /* returns [x,y] offsets inside column body + body height */
        var pos = [], i;
        if (e === 3) { for (i = 0; i < k; i++) pos.push([18, 44 + i * 22]); return { pos: pos, h: k ? 44 + (k - 1) * 22 + 90 : 60 }; }
        if (e === 2) { for (i = 0; i < k; i++) pos.push([22, 18 + i * 14]); return { pos: pos, h: k ? 18 + (k - 1) * 14 + 100 : 60 }; }
        if (e === 1) { for (i = 0; i < k; i++) pos.push([10 + (i % 7) * 21, 14 + Math.floor(i / 7) * 136]); return { pos: pos, h: k ? 14 + Math.ceil(k / 7) * 136 : 60 }; }
        for (i = 0; i < k; i++) pos.push([14 + (i % 5) * 21, 16 + Math.floor(i / 5) * 22]); return { pos: pos, h: k ? 16 + Math.ceil(k / 5) * 22 + 6 : 60 };
      }
      var isNarrow = narrowWatch(holder, function () { draw(); });
      function draw() {
        holder.innerHTML = '';
        var narrow = isNarrow(), P = [3, 2, 1, 0], TOP = 118, L = {}, rows = narrow ? [[3, 2], [1, 0]] : [[3, 2, 1, 0]];
        P.forEach(function (e) { L[e] = layout(e, n(e)); });
        var pos = {}, y = 0, W = 8;
        rows.forEach(function (r) {
          var x = 4, bh = 0; r.forEach(function (e) { bh = Math.max(bh, L[e].h); });
          r.forEach(function (e) { pos[e] = { x: x, y: y, h: TOP + bh + 10 }; x += CW[e] + (narrow ? 20 : 0); });
          W = Math.max(W, x + 4); y += TOP + bh + 10 + 10;
        });
        var H = y;
        var v = O.svg(W, H, holder, 'Base-ten blocks on a place-value mat');
        P.forEach(function (e) {
          var cw = CW[e] + (narrow ? 20 : 0), col = PV[e], x = pos[e].x, y0 = pos[e].y, ch = pos[e].h;
          var g0 = O.s('g', { transform: 'translate(0,' + y0 + ')' }, v);
          O.s('rect', { x: x + 2, y: 2, width: cw - 4, height: ch - 4, rx: 12, fill: '#fff', stroke: '#D9DEEA', 'stroke-width': 2, class: 'paper' }, g0);
          O.s('rect', { x: x + 2, y: 2, width: cw - 4, height: 34, rx: 12, fill: col }, g0);
          O.s('text', { x: x + cw / 2, y: 25, 'text-anchor': 'middle', fill: '#fff', 'font-size': 15, text: NM[e] }, g0);
          O.s('text', { x: x + cw / 2, y: 106, 'text-anchor': 'middle', 'font-size': 22, fill: col, class: 'om-num', text: String(n(e)) }, g0);
          btn(g0, x + 22, 62, '−', '#5B6478', function () { if (n(e)) { S.c[e] = n(e) - 1; api.redraw(); } }, 'Take away one ' + NM[e].toLowerCase().replace(/s$/, ''));
          btn(g0, x + 58, 62, '+', col, function () { if (n(e) >= 29) { O.toast('That column is full. Group 10 first.'); return; } S.c[e] = n(e) + 1; api.redraw(); }, 'Add one ' + NM[e].toLowerCase().replace(/s$/, ''));
          if (e < 3) {
            var can = n(e) >= 10, tg = O.s('g', { opacity: can ? 1 : .35 }, g0);
            O.s('rect', { x: x + 80, y: 47, width: 54, height: 30, rx: 8, fill: can ? YEL : '#E7E9F0' }, tg);
            O.s('text', { x: x + 107, y: 66, 'text-anchor': 'middle', 'font-size': 11, fill: NAVY, text: 'Group 10' }, tg);
            O.tap(tg, function () { if (n(e) < 10) { O.toast('You need 10 here to make a group.'); return; } S.c[e] = n(e) - 10; S.c[e + 1] = n(e + 1) + 1; api.redraw(); }, 'Group 10 into one bigger block');
          }
          var dx = narrow ? 10 : 0;
          L[e].pos.forEach(function (p) {
            var bx = x + p[0] + dx, by = TOP + p[1], g;
            if (e === 3) g = box(g0, bx, by, 80, 80, 34, col, 10, 10, 10);
            else if (e === 2) g = box(g0, bx, by, 90, 90, 7, col, 10, 10, 1);
            else if (e === 1) g = box(g0, bx, by, 13, 120, 5, col, 1, 10, 1);
            else g = box(g0, bx, by, 14, 14, 5, col, 1, 1, 1);
            if (e > 0) O.tap(g, function () { if (n(e - 1) + 10 > 29) { O.toast('No room. Group some blocks first.'); return; } S.c[e] = n(e) - 1; S.c[e - 1] = n(e - 1) + 10; api.redraw(); }, 'Break this block into 10 smaller blocks');
          });
        });
        var val = n(3) * 1000 + n(2) * 100 + n(1) * 10 + n(0);
        api.readout('<span>Value: <b>' + O.fmt(val) + '</b></span><span>' + n(3) + ' thousands, ' + n(2) + ' hundreds, ' + n(1) + ' tens, ' + n(0) + ' ones</span>' + ([0, 1, 2].some(function (e) { return n(e) >= 10; }) ? '<span style="color:#B45309">A column has 10 or more. Can you group them?</span>' : ''));
      }
      function btn(v, cx, cy, t, fill, fn, lab) { var g = O.s('g', {}, v); O.s('circle', { cx: cx, cy: cy, r: 15, fill: fill }, g); O.s('text', { x: cx, y: cy + 7, 'text-anchor': 'middle', fill: '#fff', 'font-size': 21, text: t }, g); O.tap(g, fn, lab); }
      api.onRedraw(draw);
    }
  });

  /* ============ NUMBER BOND ============ */
  O.register('bond', {
    defaults: { parts: 2, w: '10', p: ['6', '?', '', ''], dir: 'top' },
    mount: function (api) {
      var S = api.S;
      api.say('Tap a circle and type a number. Use ? for the number you need to find.');
      api.seg('Parts', 'parts', [[2, '2'], [3, '3'], [4, '4']]);
      api.seg('Whole goes', 'dir', [['top', 'On top'], ['left', 'On the left']]);
      api.button('Clear all circles', function () { S.w = ''; S.p = ['', '', '', '']; api.redraw(); }, '', api.row());
      var holder = O.el('div', { style: 'position:relative;max-width:560px;margin:0 auto' }); api.stage.appendChild(holder);
      var W = 520, H = 300, inputs = [];
      function geo() {
        var k = S.parts, c = [], i;
        if (S.dir === 'left') { H = 360; c.push([95, 180, 50]); for (i = 0; i < k; i++) c.push([390, 180 + (i - (k - 1) / 2) * 92, 40]); }
        else { H = 300; c.push([260, 72, 52]); for (i = 0; i < k; i++) c.push([260 + (i - (k - 1) / 2) * 124, 228, 44]); }
        return c;
      }
      function draw() {
        holder.innerHTML = ''; inputs = [];
        var C = geo(), v = O.svg(W, H, holder, 'Number bond');
        v.style.width = '100%';
        C.slice(1).forEach(function (q) { O.s('line', { x1: C[0][0], y1: C[0][1], x2: q[0], y2: q[1], stroke: NAVY, 'stroke-width': 3, class: 'inks' }, v); });
        C.forEach(function (q, i) {
          var circ = O.s('circle', { cx: q[0], cy: q[1], r: q[2], fill: i ? '#E5F5EC' : '#EFE9FB', stroke: i ? GRN : VIO, 'stroke-width': 4 }, v);
          var inp = O.el('input', { type: 'text', inputmode: 'decimal', maxlength: 9, 'aria-label': i ? 'Part ' + i : 'Whole',
            style: 'position:absolute;left:' + (q[0] / W * 100) + '%;top:' + (q[1] / H * 100) + '%;width:' + (q[2] * 1.7 / W * 100) + '%;transform:translate(-50%,-50%);border:0;background:transparent;text-align:center;font-weight:800;color:#0E1C42;outline:none;padding:0' });
          inp.value = i ? (S.p[i - 1] || '') : (S.w || '');
          inp.addEventListener('input', function () { if (i) S.p[i - 1] = inp.value; else S.w = inp.value; check(); api.changed(); });
          inp.addEventListener('focus', function () { circ.setAttribute('stroke', YEL); }); inp.addEventListener('blur', function () { circ.setAttribute('stroke', i ? GRN : VIO); });
          circ.addEventListener('click', function () { inp.focus(); });
          holder.appendChild(inp); inputs.push(inp);
        });
        O.s('text', { x: C[0][0], y: C[0][1] - C[0][2] - 8, 'text-anchor': 'middle', 'font-size': 14, fill: VIO, text: 'whole' }, v);
        size(); check();
      }
      function size() { var f = Math.max(14, holder.clientWidth / W * 30); inputs.forEach(function (i) { i.style.fontSize = f + 'px'; }); }
      if (window.ResizeObserver) new ResizeObserver(size).observe(holder);
      function check() {
        var vals = [S.w].concat(S.p.slice(0, S.parts)), missing = vals.filter(function (t) { return isNaN(num(t)); }).length;
        if (missing === 0) {
          var parts = S.p.slice(0, S.parts).map(num), sum = parts.reduce(function (a, b) { return a + b; }, 0), w = num(S.w);
          api.readout(Math.abs(sum - w) < 1e-9 ? '<span>✓ The parts make the whole: <b>' + parts.map(nice).join(' + ') + ' = ' + nice(w) + '</b></span>' : '<span>These parts make <b>' + nice(sum) + '</b>, not ' + nice(w) + '. Check again.</span>');
        } else if (missing === 1) api.readout('<span>Find the missing number.</span>');
        else api.readout('<span>Fill in the circles.</span>');
      }
      api.onRedraw(draw);
    }
  });

  /* ============ BAR MODEL ============ */
  var BAR_FILL = ['#FFFFFF', '#DCCFF7', '#CDEBDB', '#FFE9A8'];
  var BAR_START = {
    pw: { bars: [{ n: '', t: '240', tp: 'above', p: [{ v: '85', l: '85', c: 1 }, { v: '', l: '?', c: 0 }] }], cmp: { on: 0, a: 0, b: 1, l: '' } },
    cmp: { bars: [{ n: 'Ali', t: '', tp: 'above', p: [{ v: '', l: '', c: 0 }, { v: '', l: '', c: 0 }, { v: '', l: '', c: 0 }] }, { n: 'Ben', t: '?', tp: 'below', p: [{ v: '', l: '', c: 0 }, { v: '', l: '', c: 0 }, { v: '', l: '', c: 0 }, { v: '', l: '', c: 0 }, { v: '', l: '', c: 0 }] }], cmp: { on: 1, a: 0, b: 1, l: '24' } },
    frac: { bars: [{ n: '', t: '40', tp: 'above', p: [{ v: '', l: '', c: 2 }, { v: '', l: '', c: 2 }, { v: '', l: '', c: 2 }, { v: '', l: '', c: 0 }, { v: '', l: '', c: 0 }] }], cmp: { on: 0, a: 0, b: 1, l: '' } },
    blank: { bars: [{ n: '', t: '', tp: 'above', p: [{ v: '', l: '', c: 0 }] }], cmp: { on: 0, a: 0, b: 1, l: '' } }
  };
  O.register('bar', {
    defaults: O.clone(BAR_START.pw),
    mount: function (api) {
      var S = api.S;
      api.say('Draw the story with bars. Tap a piece to color it.');
      var box2 = O.el('div'); api.setup.appendChild(box2);
      var holder = O.el('div'); api.stage.appendChild(holder);
      var isNarrow = narrowWatch(holder, function () { draw(); });
      function field(par, label, val, on, w) { var f = O.el('label', { class: 'om-field', style: w ? 'flex:' + w + ';margin:0' : '' }, '<span>' + label + '</span>'); var i = O.el('input', { type: 'text', value: val || '' }); i.addEventListener('input', function () { on(i.value); draw(); api.changed(); }); f.appendChild(i); par.appendChild(f); return i; }
      function sbtn(par, t, fn, cls) { var b = O.el('button', { type: 'button', class: 'om-btn small ' + (cls || '') }, t); b.onclick = function () { fn(); build(); api.redraw(); }; par.appendChild(b); return b; }
      function build() {
        box2.innerHTML = '';
        box2.appendChild(O.el('h3', null, 'Start from'));
        var r0 = O.el('div', { class: 'om-row', style: 'margin:0 0 .4rem' }); box2.appendChild(r0);
        [['pw', 'Part-whole'], ['cmp', 'Compare'], ['frac', 'Fraction of'], ['blank', 'Blank']].forEach(function (o) { sbtn(r0, o[1], function () { var k = O.clone(BAR_START[o[0]]); S.bars = k.bars; S.cmp = k.cmp; }); });
        S.bars.forEach(function (b, bi) {
          box2.appendChild(O.el('h3', null, 'Bar ' + (bi + 1)));
          var r = O.el('div', { style: 'display:flex;gap:.4rem' }); box2.appendChild(r);
          field(r, 'Name', b.n, function (v) { b.n = v; }, 1); field(r, 'Total label', b.t, function (v) { b.t = v; }, 1);
          var r2 = O.el('div', { class: 'om-seg', style: 'margin:.1rem 0 .5rem' }); box2.appendChild(r2);
          [['above', 'Total above'], ['below', 'Total below']].forEach(function (o) { var bb = O.el('button', { type: 'button', 'aria-pressed': b.tp === o[0] ? 'true' : 'false' }, o[1]); bb.onclick = function () { b.tp = o[0]; build(); api.redraw(); }; r2.appendChild(bb); });
          b.p.forEach(function (p, pi) {
            var pr = O.el('div', { style: 'display:flex;gap:.3rem;align-items:flex-end;margin-bottom:.3rem' }); box2.appendChild(pr);
            field(pr, 'Piece ' + (pi + 1) + ' size', p.v, function (v) { p.v = v; }, 1);
            field(pr, 'Label', p.l, function (v) { p.l = v; }, 1);
            var x = O.el('button', { type: 'button', class: 'om-btn small', 'aria-label': 'Remove piece', style: 'min-height:38px' }, '×'); x.onclick = function () { b.p.splice(pi, 1); if (!b.p.length) b.p.push({ v: '', l: '', c: 0 }); build(); api.redraw(); }; pr.appendChild(x);
          });
          var r3 = O.el('div', { class: 'om-row', style: 'margin:.2rem 0 .3rem' }); box2.appendChild(r3);
          sbtn(r3, '+ Piece', function () { if (b.p.length < 12) b.p.push({ v: '', l: '', c: 0 }); });
          var ni = O.el('input', { type: 'number', min: 1, max: 12, value: b.p.length, 'aria-label': 'Number of equal units', style: 'width:4.2em;border:2px solid var(--line);border-radius:10px;min-height:32px;padding:0 .3em' }); r3.appendChild(ni);
          sbtn(r3, 'equal units', function () { var k = O.clamp(parseInt(ni.value, 10) || 1, 1, 12); b.p = []; for (var i = 0; i < k; i++) b.p.push({ v: '', l: '', c: 0 }); });
          if (S.bars.length > 1) sbtn(r3, 'Remove bar', function () { S.bars.splice(bi, 1); });
        });
        var r4 = O.el('div', { class: 'om-row', style: 'margin:.6rem 0' }); box2.appendChild(r4);
        if (S.bars.length < 4) sbtn(r4, '+ Add a bar', function () { S.bars.push({ n: '', t: '', tp: 'below', p: [{ v: '', l: '', c: 0 }] }); }, 'primary');
        if (S.bars.length > 1) {
          box2.appendChild(O.el('h3', null, 'Difference'));
          var ck = O.el('label', { class: 'om-check' }); var cb = O.el('input', { type: 'checkbox' }); cb.checked = !!S.cmp.on; cb.onchange = function () { S.cmp.on = cb.checked ? 1 : 0; api.redraw(); }; ck.appendChild(cb); ck.appendChild(document.createTextNode('Show the difference between two bars')); box2.appendChild(ck);
          var rr = O.el('div', { style: 'display:flex;gap:.4rem' }); box2.appendChild(rr);
          ['a', 'b'].forEach(function (k, ix) { var f = O.el('label', { class: 'om-field', style: 'flex:1' }, '<span>' + (ix ? 'and bar' : 'Between bar') + '</span>'); var sel = O.el('select'); S.bars.forEach(function (b, i) { var op = O.el('option', { value: i }, String(i + 1)); if (S.cmp[k] === i) op.selected = true; sel.appendChild(op); }); sel.onchange = function () { S.cmp[k] = +sel.value; api.redraw(); }; f.appendChild(sel); rr.appendChild(f); });
          field(box2, 'Difference label', S.cmp.l, function (v) { S.cmp.l = v; });
        }
      }
      function draw() {
        holder.innerHTML = '';
        var narrow = isNarrow(), X0 = narrow ? 64 : 120, WMAX = narrow ? 360 : 600, SW = narrow ? 440 : 760, BH = 46, ROW = BH + 84;
        /* widths */
        var anyNum = false, sumN = 0, cntN = 0;
        S.bars.forEach(function (b) { b.p.forEach(function (p) { var v = num(p.v); if (!isNaN(v) && v > 0) { anyNum = true; sumN += v; cntN++; } }); if (!isNaN(num(b.t)) && num(b.t) > 0) anyNum = true; });
        var guess = cntN ? sumN / cntN : 1;
        var M = S.bars.map(function (b) {
          var known = 0, blanks = 0; b.p.forEach(function (p) { var v = num(p.v); if (!isNaN(v) && v > 0) known += v; else blanks++; });
          var tot = num(b.t), each = (!isNaN(tot) && tot > known && blanks) ? (tot - known) / blanks : guess;
          if (!cntN && !isNaN(tot) && tot > 0 && blanks) each = tot / blanks;
          return { each: each, mag: b.p.reduce(function (a, p) { var v = num(p.v); return a + (!isNaN(v) && v > 0 ? v : each); }, 0) };
        });
        /* units with no numbers anywhere: keep all bars on the same unit size */
        var noNum = !cntN && S.bars.every(function (b, i) { return isNaN(num(b.t)) || b.p.every(function (p) { return isNaN(num(p.v)); }); });
        if (noNum) M.forEach(function (m, i) { m.each = 1; m.mag = S.bars[i].p.length; });
        var maxMag = Math.max.apply(null, M.map(function (m) { return m.mag; }));
        var sc = WMAX / maxMag; if (noNum) sc = Math.min(sc, 90);
        var H = 20 + S.bars.length * ROW, v = O.svg(SW, H, holder, 'Bar model'), ends = [];
        S.bars.forEach(function (b, bi) {
          var y = 52 + bi * ROW, x = X0;
          O.s('text', { x: X0 - 12, y: y + BH / 2 + 6, 'text-anchor': 'end', 'font-size': 18, fill: NAVY, class: 'ink', text: b.n || '' }, v);
          b.p.forEach(function (p, pi) {
            var val = num(p.v), w = Math.max(24, (!isNaN(val) && val > 0 ? val : M[bi].each) * sc);
            var g = O.s('g', {}, v);
            O.s('rect', { x: x, y: y, width: w, height: BH, fill: BAR_FILL[p.c || 0], stroke: NAVY, 'stroke-width': 2.5 }, g);
            var lab = p.l || (!isNaN(val) ? p.v : '');
            if (lab) O.s('text', { x: x + w / 2, y: y + BH / 2 + 6, 'text-anchor': 'middle', 'font-size': lab.length * 9 > w ? 12 : 17, fill: NAVY, text: lab }, g);
            O.tap(g, function () { p.c = ((p.c || 0) + 1) % 4; api.redraw(); }, 'Color this piece');
            x += w;
          });
          ends.push([X0, x, y]);
          if (b.t) { var up = b.tp !== 'below'; brace(v, X0, x, up ? y - 4 : y + BH + 4, up ? -1 : 1, b.t); }
        });
        if (S.cmp.on && S.bars[S.cmp.a] && S.bars[S.cmp.b] && S.cmp.a !== S.cmp.b) {
          var A = ends[S.cmp.a], B = ends[S.cmp.b], sh = A[1] <= B[1] ? A : B, lo = A[1] <= B[1] ? B : A;
          if (lo[1] - sh[1] > 2) {
            O.s('rect', { x: sh[1], y: sh[2], width: lo[1] - sh[1], height: BH, fill: 'none', stroke: VIO, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, v);
            var below = sh[2] > lo[2], bars = S.bars[A === sh ? S.cmp.a : S.cmp.b];
            /* keep away from that bar's own total brace */
            var useBelow = bars.t ? bars.tp !== 'below' : below;
            brace(v, sh[1], lo[1], useBelow ? sh[2] + BH + 4 : sh[2] - 4, useBelow ? 1 : -1, S.cmp.l, VIO);
          }
        }
        api.readout('');
      }
      build();
      api.onRedraw(draw);
    }
  });

  /* ============ NUMBER LINE ============ */
  O.register('numberline', {
    defaults: { a: 0, b: 1, parts: 4, mode: 'frac', lab: 'all', simp: 0, two: 0, parts2: 8, hop: 0, dots: [], hops: [] },
    mount: function (api) {
      var S = api.S, pend = null;
      function setSay() { api.say(S.hop ? 'Tap where the hop starts, then tap where it lands.' : 'Tap a mark to put a dot on it. Tap the dot again to take it off.'); }
      api.heading('The line');
      api.num('Starts at', 'a', -1000, 100000, 'any', clearMarks); api.num('Ends at', 'b', -1000, 100000, 'any', clearMarks);
      api.num('Equal parts', 'parts', 1, 100, 1, clearMarks);
      api.select('Labels as', 'mode', [['whole', 'Whole numbers'], ['frac', 'Fractions'], ['mixed', 'Mixed numbers'], ['dec', 'Decimals']]);
      api.seg('Show labels', 'lab', [['all', 'Every mark'], ['ends', 'Ends only'], ['none', 'None']]);
      api.check('Write fractions in simplest form', 'simp');
      api.heading('Compare');
      api.check('Add a second line underneath', 'two');
      api.num('Equal parts on the second line', 'parts2', 1, 100, 1, clearMarks);
      api.heading('Mode');
      api.seg('', 'hop', [[0, 'Dots'], [1, 'Hops']], function () { pend = null; setSay(); });
      api.button('Clear dots and hops', function () { S.dots = []; S.hops = []; pend = null; api.redraw(); }, '', api.row());
      function clearMarks() { S.dots = []; S.hops = []; pend = null; }
      setSay();
      var holder = O.el('div'); api.stage.appendChild(holder);
      var isNarrow = narrowWatch(holder, function () { draw(); });
      function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
      /* value of tick i on a line with k parts, as {w,n,d,neg} and as html */
      function val(i, k) {
        var a = S.a, b = S.b, x = a + (b - a) * i / k, intEnds = isInt(a) && isInt(b);
        if (S.mode === 'whole' || !intEnds) return { v: x, w: nice(x) };
        if (S.mode === 'dec') { var dp = 0; while (dp < 3 && !isInt(x * Math.pow(10, dp) * 1)) dp++; return { v: x, w: Number(x.toFixed(Math.max(dp, decPlaces(k)))).toFixed(Math.max(dp, decPlaces(k))) }; }
        var per = k / (b - a), N, D;
        if (isInt(per)) { D = Math.round(per); N = Math.round(a * D + i); } else { N = Math.round(a * k + (b - a) * i); D = k; }
        if (S.simp) { var g = O.gcd(N, D); N /= g; D /= g; }
        if (N % D === 0 && (S.simp || i === 0 || i === k)) return { v: x, w: String(N / D) };
        var neg = N < 0; N = Math.abs(N);
        if (S.mode === 'mixed' && N >= D) { var w = Math.floor(N / D), rr = N % D; return rr ? { v: x, w: (neg ? '−' : '') + w, n: rr, d: D } : { v: x, w: (neg ? '−' : '') + w }; }
        return { v: x, w: neg ? '−' : 0, n: N, d: D, neg: neg };
      }
      function decPlaces(k) { var step = Math.abs(S.b - S.a) / k, dp = 0; while (dp < 3 && !isInt(step * Math.pow(10, dp))) dp++; return dp; }
      function html(q) { if (!q.n) return q.w; return (q.w ? '<span class="mixed">' + q.w + O.frac(q.n, q.d) + '</span>' : O.frac(q.n, q.d)); }
      function hopSize(i, j, k) {
        var steps = Math.abs(j - i), a = S.a, b = S.b, size = (b - a) * steps / k;
        if (S.mode === 'whole' || !isInt(a) || !isInt(b)) return { w: nice(size) };
        if (S.mode === 'dec') return { w: size.toFixed(decPlaces(k)) };
        var per = k / (b - a), N = isInt(per) ? steps : Math.round((b - a) * steps), D = isInt(per) ? Math.round(per) : k; if (S.simp) { var g = O.gcd(N, D); N /= g; D /= g; }
        if (N % D === 0) return { w: String(N / D) };
        if (S.mode === 'mixed' && N > D) return { w: Math.floor(N / D), n: N % D, d: D };
        return { w: 0, n: N, d: D };
      }
      function draw() {
        holder.innerHTML = '';
        if (S.b <= S.a) { holder.innerHTML = '<p class="om-hint">Make the end number bigger than the start number.</p>'; api.readout(''); return; }
        var narrow = isNarrow(), W = narrow ? 440 : 780, X0 = narrow ? 36 : 50, X1 = W - X0, lines = S.two ? [S.parts, S.parts2] : [S.parts], LY = [110, 260], H = S.two ? 340 : 190;
        var v = O.svg(W, H, holder, 'Number line');
        lines.forEach(function (k, L) {
          var y = LY[L], every = Math.ceil(k / 20);
          O.s('line', { x1: X0 - 22, x2: X1 + 22, y1: y, y2: y, stroke: NAVY, 'stroke-width': 3, class: 'inks' }, v);
          O.s('path', { d: 'M' + (X1 + 30) + ',' + y + ' l-12,-7 v14 z M' + (X0 - 30) + ',' + y + ' l12,-7 v14 z', fill: NAVY, class: 'ink' }, v);
          for (var i = 0; i <= k; i++) (function (i) {
            var x = X0 + (X1 - X0) * i / k, q = val(i, k), whole = isInt(q.v), major = i === 0 || i === k || whole || i % every === 0;
            O.s('line', { x1: x, x2: x, y1: y - (whole ? 16 : 11), y2: y + (whole ? 16 : 11), stroke: NAVY, 'stroke-width': whole ? 3 : 2, class: 'inks' }, v);
            var show = S.lab === 'all' ? major : S.lab === 'ends' ? (i === 0 || i === k) : false;
            if (show) sNum(v, x, y + 20, q, k > 12 ? 13 : 16, NAVY, 'ink');
            var on = S.dots.indexOf(L + ':' + i) > -1, sel = pend && pend[0] === L && pend[1] === i;
            if (on) O.s('circle', { cx: x, cy: y, r: 9, fill: VIO, stroke: '#fff', 'stroke-width': 2 }, v);
            if (sel) O.s('circle', { cx: x, cy: y, r: 13, fill: 'none', stroke: YEL, 'stroke-width': 4 }, v);
            var hit = O.s('rect', { x: x - Math.min(18, (X1 - X0) / k / 2), y: y - 26, width: Math.min(36, (X1 - X0) / k), height: 52, fill: 'transparent' }, v);
            O.tap(hit, function () { tapTick(L, i); }, 'Mark ' + i + ' of ' + k);
          })(i);
          S.hops.filter(function (h) { return h[0] === L; }).forEach(function (h) {
            var xa = X0 + (X1 - X0) * h[1] / k, xb = X0 + (X1 - X0) * h[2] / k, mx = (xa + xb) / 2, ht = Math.min(60, 18 + Math.abs(xb - xa) * .25);
            O.s('path', { d: 'M' + xa + ',' + (y - 6) + ' Q' + mx + ',' + (y - 6 - ht * 1.6) + ' ' + xb + ',' + (y - 6), fill: 'none', stroke: GRN, 'stroke-width': 3 }, v);
            var ang = xb > xa ? -1 : 1; O.s('path', { d: 'M' + xb + ',' + (y - 6) + ' l' + (ang * 10) + ',-9 l' + (ang * 2) + ',8 z', fill: GRN }, v);
            var hs = hopSize(h[1], h[2], k), sign = h[2] > h[1] ? '+' : '−';
            var lg = O.s('g', { class: 'om-num' }, v);
            if (hs.n) { O.s('text', { x: mx - (hs.w ? 24 : 14), y: y - ht - 12, 'text-anchor': 'middle', 'font-size': 16, fill: GRN, text: sign + (hs.w || '') }, lg); sFrac(lg, mx + (hs.w ? 4 : 2), y - ht - 42, hs.n, hs.d, 13, GRN); }
            else O.s('text', { x: mx, y: y - ht - 12, 'text-anchor': 'middle', 'font-size': 16, fill: GRN, text: sign + hs.w }, lg);
          });
        });
        var dl = S.dots.map(function (d) { var p = d.split(':'); return { L: +p[0], i: +p[1] }; }).filter(function (d) { return d.L < lines.length && d.i <= lines[d.L]; })
          .sort(function (a, b) { return val(a.i, lines[a.L]).v - val(b.i, lines[b.L]).v; });
        var out = [];
        if (dl.length) out.push('<span>Dots: <b>' + dl.map(function (d) { return html(val(d.i, lines[d.L])); }).join(', ') + '</b></span>');
        S.hops.forEach(function (h) { if (h[0] < lines.length) { var k = lines[h[0]]; out.push('<span>Hop from ' + html(val(h[1], k)) + ' to ' + html(val(h[2], k)) + ' is ' + html(hopSize(h[1], h[2], k)) + '</span>'); } });
        if (S.two && dl.length === 2 && dl[0].L !== dl[1].L) { var c = val(dl[0].i, lines[dl[0].L]).v - val(dl[1].i, lines[dl[1].L]).v; if (Math.abs(c) < 1e-9) out.push('<span><b>The dots line up. They are equal.</b></span>'); }
        api.readout(out.join(''));
      }
      function tapTick(L, i) {
        if (S.hop) {
          if (!pend) { pend = [L, i]; draw(); return; }
          if (pend[0] === L && pend[1] !== i) { S.hops.push([L, pend[1], i]); if (S.hops.length > 12) S.hops.shift(); }
          pend = null; api.redraw(); return;
        }
        var key = L + ':' + i, ix = S.dots.indexOf(key);
        if (ix > -1) S.dots.splice(ix, 1); else S.dots.push(key);
        api.redraw();
      }
      api.onRedraw(draw);
    }
  });

  /* ============ COUNTERS & ARRAYS ============ */
  O.register('counters', {
    defaults: { mode: 'array', r: 3, c: 6, flip: [], tf: 'one', split: 0, n: 14, g: 3, d: 0 },
    mount: function (api) {
      var S = api.S;
      function setSay() { api.say(S.mode === 'array' ? 'Tap a counter to flip it. Tap between two columns to split the array.' : 'Tap <b>Deal one</b> to share the counters into the groups, one at a time.'); }
      api.seg('Mode', 'mode', [['array', 'Array'], ['share', 'Share into groups']], function () { buildSetup(); setSay(); });
      var box2 = O.el('div'); api.setup.appendChild(box2);
      function mv(x) { var n = x.el || (x.parentNode && x.parentNode.tagName === 'LABEL' ? x.parentNode : x); box2.appendChild(n); }
      function buildSetup() {
        box2.innerHTML = '';
        if (S.mode === 'array') {
          mv(api.num('Rows', 'r', 1, 12, 1, function () { S.flip = []; S.split = 0; })); mv(api.num('Columns', 'c', 1, 12, 1, function () { S.flip = []; S.split = 0; }));
          mv(api.seg('A tap flips', 'tf', [['one', 'One'], ['row', 'A row'], ['col', 'A column']]));
          var rw = api.row(box2);
          api.button('Remove the split', function () { S.split = 0; api.redraw(); }, '', rw);
          api.button('All red again', function () { S.flip = []; api.redraw(); }, '', rw);
        } else {
          mv(api.num('Counters', 'n', 1, 60, 1, function () { S.d = 0; })); mv(api.num('Groups', 'g', 1, 10, 1, function () { S.d = 0; }));
        }
      }
      buildSetup(); setSay();
      var ctrl = O.el('div', { class: 'om-row', style: 'margin:0 0 .5rem' }); api.stage.appendChild(ctrl);
      var holder = O.el('div'); api.stage.appendChild(holder);
      function draw() {
        holder.innerHTML = ''; ctrl.innerHTML = '';
        if (S.mode === 'array') return drawArray();
        var q = Math.floor(S.n / S.g), rem = S.n - q * S.g, maxD = q * S.g;
        var b1 = api.button('Deal one', function () { if (S.d < maxD) { S.d++; api.redraw(); } }, 'primary', ctrl);
        api.button('Deal all', function () { S.d = maxD; api.redraw(); }, '', ctrl);
        api.button('Start over', function () { S.d = 0; api.redraw(); }, '', ctrl);
        if (S.d >= maxD) b1.disabled = true;
        var per = Math.min(S.g, 4), PW = 170, PH = 40 + Math.ceil(Math.max(q, 1) / 5) * 28 + 10, rows = Math.ceil(S.g / per);
        var left = S.n - S.d, pileRows = Math.ceil(Math.max(left, 1) / 15);
        var top = 40 + pileRows * 26, W = Math.max(per * (PW + 12) + 12, 420), H = top + rows * (PH + 14) + 10;
        var v = O.svg(W, H, holder, 'Counters shared into groups');
        O.s('text', { x: 12, y: 22, 'font-size': 15, fill: '#5B6478', class: 'ink', text: S.d >= maxD ? (rem ? 'Left over (not enough for every group):' : 'All shared!') : 'Still to share:' }, v);
        for (var i = 0; i < left; i++) O.s('circle', { cx: 24 + (i % 15) * 26, cy: 44 + Math.floor(i / 15) * 26, r: 10, fill: S.d >= maxD ? YEL : '#D2453B', stroke: shade('#D2453B', .3), 'stroke-width': 1.5 }, v);
        for (var gI = 0; gI < S.g; gI++) {
          var gx = 12 + (gI % per) * (PW + 12), gy = top + Math.floor(gI / per) * (PH + 14);
          O.s('rect', { x: gx, y: gy, width: PW, height: PH, rx: 20, fill: '#EFE9FB', stroke: VIO, 'stroke-width': 2 }, v);
          O.s('text', { x: gx + 12, y: gy + 22, 'font-size': 13, fill: VIO, text: 'Group ' + (gI + 1) }, v);
          var inG = Math.floor(S.d / S.g) + (gI < S.d % S.g ? 1 : 0);
          for (var k = 0; k < inG; k++) O.s('circle', { cx: gx + 22 + (k % 5) * 30, cy: gy + 44 + Math.floor(k / 5) * 28, r: 11, fill: '#D2453B', stroke: shade('#D2453B', .3), 'stroke-width': 1.5 }, v);
          O.s('text', { x: gx + PW - 12, y: gy + 22, 'text-anchor': 'end', 'font-size': 15, fill: VIO, class: 'om-num', text: String(inG) }, v);
        }
        api.readout(S.d >= maxD ? '<span><b>' + S.n + ' ÷ ' + S.g + ' = ' + q + (rem ? ' R ' + rem : '') + '</b></span><span>' + S.g + ' groups of ' + q + (rem ? ', with ' + rem + ' left over' : '') + '</span>' : '<span>Shared so far: ' + S.d + ' of ' + S.n + '</span>');
      }
      function isY(r, c) { return S.flip.indexOf(r + ',' + c) > -1; }
      function setY(r, c, on) { var k = r + ',' + c, i = S.flip.indexOf(k); if (on && i < 0) S.flip.push(k); if (!on && i > -1) S.flip.splice(i, 1); }
      function drawArray() {
        var SP = 46, X0 = 40, Y0 = 34, W = X0 * 2 + S.c * SP, H = Y0 + S.r * SP + 24;
        var v = O.svg(Math.max(W, 300), H, holder, S.r + ' by ' + S.c + ' array of counters');
        for (var r = 0; r < S.r; r++) {
          O.s('text', { x: 18, y: Y0 + r * SP + SP / 2 + 6, 'text-anchor': 'middle', 'font-size': 13, fill: '#5B6478', class: 'ink', text: r + 1 }, v);
          for (var c = 0; c < S.c; c++) (function (r, c) {
            var cx = X0 + c * SP + SP / 2, cy = Y0 + r * SP + SP / 2, y = isY(r, c);
            var g = O.s('g', {}, v);
            O.s('circle', { cx: cx, cy: cy, r: 18, fill: y ? YEL : '#D2453B', stroke: shade(y ? YEL : '#D2453B', .3), 'stroke-width': 2 }, g);
            O.tap(g, function () {
              var on = !isY(r, c), i;
              if (S.tf === 'row') for (i = 0; i < S.c; i++) setY(r, i, on); else if (S.tf === 'col') for (i = 0; i < S.r; i++) setY(i, c, on); else setY(r, c, on);
              api.redraw();
            }, 'Flip counter');
          })(r, c);
        }
        for (var c2 = 0; c2 < S.c; c2++) O.s('text', { x: X0 + c2 * SP + SP / 2, y: 20, 'text-anchor': 'middle', 'font-size': 13, fill: '#5B6478', class: 'ink', text: c2 + 1 }, v);
        for (var s = 1; s < S.c; s++) (function (s) {
          var x = X0 + s * SP;
          if (S.split === s) O.s('line', { x1: x, x2: x, y1: Y0 - 4, y2: Y0 + S.r * SP + 6, stroke: VIO, 'stroke-width': 4, 'stroke-dasharray': '8 6' }, v);
          var hit = O.s('rect', { x: x - 7, y: Y0, width: 14, height: S.r * SP, fill: 'transparent' }, v);
          O.tap(hit, function () { S.split = S.split === s ? 0 : s; api.redraw(); }, 'Split after column ' + s);
        })(s);
        var tot = S.r * S.c, out = '<span><b>' + S.r + ' × ' + S.c + ' = ' + tot + '</b></span>';
        if (S.split) { var a = S.split, b = S.c - S.split; out += '<span>' + S.r + ' × ' + S.c + ' = ' + S.r + ' × ' + a + ' + ' + S.r + ' × ' + b + ' = ' + S.r * a + ' + ' + S.r * b + ' = ' + tot + '</span>'; }
        var ny = S.flip.filter(function (k) { var p = k.split(','); return +p[0] < S.r && +p[1] < S.c; }).length;
        if (ny) out += '<span>Yellow: ' + ny + ' · Red: ' + (tot - ny) + '</span>';
        api.readout(out);
      }
      api.onRedraw(draw);
    }
  });

  /* ============ HUNDRED CHART & TIMES TABLE ============ */
  var HL = [null, '#FFE08A', '#F9C4D2', '#BFE3F7'];
  O.register('hundred', {
    defaults: { mode: 'hundred', start: 1, sk1: 0, sk2: 0, hl: {}, fac: 0, fv: 0 },
    mount: function (api) {
      var S = api.S;
      function setSay() { api.say(S.mode === 'times' && S.fac ? 'Tap a number to find all the ways to make it.' : 'Tap a number to color it. Tap again to change the color.'); }
      api.seg('Chart', 'mode', [['hundred', 'Hundred chart'], ['times', 'Times table']], function () { S.hl = {}; S.fv = 0; setSay(); });
      api.select('Hundred chart starts at', 'start', [[0, '0'], [1, '1'], [101, '101'], [201, '201'], [301, '301'], [401, '401'], [501, '501'], [601, '601'], [701, '701'], [801, '801'], [901, '901']], function () { S.hl = {}; });
      api.heading('Skip-count');
      api.num('Count by (violet, 0 = off)', 'sk1', 0, 50, 1);
      api.num('Also count by (green, 0 = off)', 'sk2', 0, 50, 1);
      api.hint('In the times table, this colors that row and column.');
      api.heading('Times table');
      api.check('Factor finder: tap a product to see every way to make it', 'fac', function () { S.fv = 0; setSay(); });
      api.button('Clear my colors', function () { S.hl = {}; S.fv = 0; api.redraw(); }, '', api.row());
      setSay();
      var holder = O.el('div'); api.stage.appendChild(holder);
      function mult(v, n) { return n > 0 && v > 0 && v % n === 0; }
      function cellFill(p, x, y, w, h, a, b) {
        if (a && b) { O.s('polygon', { points: [x, y, x + w, y, x, y + h].join(' '), fill: '#D9CCF5' }, p); O.s('polygon', { points: [x + w, y, x + w, y + h, x, y + h].join(' '), fill: '#BDE5CF' }, p); }
        else if (a || b) O.s('rect', { x: x, y: y, width: w, height: h, fill: a ? '#D9CCF5' : '#BDE5CF' }, p);
      }
      function draw() {
        holder.innerHTML = '';
        var out = [];
        if (S.mode === 'hundred') {
          var C = 58, v = O.svg(10 * C + 4, 10 * C + 4, holder, 'Hundred chart'), both = [];
          for (var i = 0; i < 100; i++) (function (i) {
            var val = S.start + i, x = 2 + (i % 10) * C, y = 2 + Math.floor(i / 10) * C, g = O.s('g', {}, v);
            O.s('rect', { x: x, y: y, width: C, height: C, fill: '#fff', class: 'paper' }, g);
            var a = mult(val, S.sk1), b = mult(val, S.sk2); if (a && b) both.push(val);
            cellFill(g, x, y, C, C, a, b);
            if (S.hl[val]) O.s('circle', { cx: x + C / 2, cy: y + C / 2, r: C * .4, fill: HL[S.hl[val]] }, g);
            O.s('rect', { x: x, y: y, width: C, height: C, fill: 'none', stroke: '#B8C0D6', 'stroke-width': 1 }, g);
            O.s('text', { x: x + C / 2, y: y + C / 2 + 7, 'text-anchor': 'middle', 'font-size': val > 999 ? 15 : 19, fill: NAVY, text: val }, g);
            O.tap(g, function () { S.hl[val] = ((S.hl[val] || 0) + 1) % 4; if (!S.hl[val]) delete S.hl[val]; api.redraw(); }, String(val));
          })(i);
          if (S.sk1) out.push('<span style="color:#6B46C1">Violet: counting by ' + S.sk1 + '</span>');
          if (S.sk2) out.push('<span style="color:#23915A">Green: counting by ' + S.sk2 + '</span>');
          if (S.sk1 && S.sk2) out.push('<span>In both (common multiples): <b>' + (both.length ? both.join(', ') : 'none on this chart') + '</b></span>');
        } else {
          var C2 = 50, N = 12, v2 = O.svg((N + 1) * C2 + 4, (N + 1) * C2 + 4, holder, 'Times table');
          for (var r = 0; r <= N; r++) for (var c = 0; c <= N; c++) (function (r, c) {
            var x = 2 + c * C2, y = 2 + r * C2, head = !r || !c, val = r * c, g = O.s('g', {}, v2);
            if (!r && !c) { O.s('rect', { x: x, y: y, width: C2, height: C2, fill: NAVY }, g); O.s('text', { x: x + C2 / 2, y: y + C2 / 2 + 8, 'text-anchor': 'middle', 'font-size': 22, fill: '#fff', text: '×' }, g); return; }
            O.s('rect', { x: x, y: y, width: C2, height: C2, fill: head ? '#E7E9F0' : '#fff', class: head ? '' : 'paper' }, g);
            if (!head) {
              cellFill(g, x, y, C2, C2, S.sk1 && (r === S.sk1 || c === S.sk1), S.sk2 && (r === S.sk2 || c === S.sk2));
              if (S.fac && S.fv && val === S.fv) O.s('circle', { cx: x + C2 / 2, cy: y + C2 / 2, r: C2 * .42, fill: YEL }, g);
              else if (S.hl[r + 'x' + c]) O.s('circle', { cx: x + C2 / 2, cy: y + C2 / 2, r: C2 * .4, fill: HL[S.hl[r + 'x' + c]] }, g);
            }
            O.s('rect', { x: x, y: y, width: C2, height: C2, fill: 'none', stroke: '#B8C0D6', 'stroke-width': 1 }, g);
            O.s('text', { x: x + C2 / 2, y: y + C2 / 2 + 7, 'text-anchor': 'middle', 'font-size': head ? 19 : 17, fill: NAVY, 'font-weight': head ? 800 : 700, text: head ? (r || c) : val }, g);
            if (!head) O.tap(g, function () {
              if (S.fac) S.fv = S.fv === val ? 0 : val;
              else { var k = r + 'x' + c; S.hl[k] = ((S.hl[k] || 0) + 1) % 4; if (!S.hl[k]) delete S.hl[k]; }
              api.redraw();
            }, r + ' times ' + c);
          })(r, c);
          if (S.fac && S.fv) {
            var f = []; for (var d = 1; d <= S.fv; d++) if (S.fv % d === 0) f.push(d);
            var pairs = f.filter(function (d) { return d <= S.fv / d; }).map(function (d) { return d + ' × ' + S.fv / d; });
            out.push('<span><b>' + S.fv + '</b> = ' + pairs.join(', ') + '</span><span>Factors of ' + S.fv + ': <b>' + f.join(', ') + '</b></span>');
          }
          if (S.sk1) out.push('<span style="color:#6B46C1">Violet: the ' + S.sk1 + ' row and column</span>');
          if (S.sk2) out.push('<span style="color:#23915A">Green: the ' + S.sk2 + ' row and column</span>');
        }
        var mine = Object.keys(S.hl).map(function (k) { return S.mode === 'hundred' ? +k : k.split('x').reduce(function (a, b) { return a * b; }, 1); }).sort(function (a, b) { return a - b; });
        if (mine.length) out.push('<span>You colored: ' + mine.join(', ') + '</span>');
        api.readout(out.join(''));
      }
      api.onRedraw(draw);
    }
  });

  /* ============ DICE & NUMBER CARDS ============ */
  var PIPS = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] };
  var PNAME = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten Thousands', 'Hundred Thousands'];
  O.register('dice', {
    defaults: { mode: 'dice', k: 2, sides: 6, cur: [], hist: [], put: 1, deck: [], lo: 2, hi: 9, op: 'x', fa: 0, fb: 0, show: 0, game: 'none', places: 4, slots: [], pend: null },
    mount: function (api) {
      var S = api.S;
      api.seg('Use', 'mode', [['dice', 'Dice'], ['cards', 'Digit cards'], ['facts', 'Fact cards']], function () { S.cur = []; S.pend = null; S.slots = []; build(); });
      var box2 = O.el('div'); api.setup.appendChild(box2);
      function mv(x) { var n = x.el || (x.parentNode && x.parentNode.tagName === 'LABEL' ? x.parentNode : x); box2.appendChild(n); }
      function build() {
        box2.innerHTML = '';
        if (S.mode === 'dice') { mv(api.seg('How many dice', 'k', [[1, '1'], [2, '2'], [3, '3'], [4, '4']])); mv(api.seg('Kind', 'sides', [[6, '1 to 6 (dots)'], [10, '0 to 9']])); }
        if (S.mode === 'cards') {
          mv(api.check('Put each card back after drawing', 'put', function () { S.deck = []; }));
          mv(api.select('Game', 'game', [['none', 'No game, just draw'], ['big', 'Make the biggest number'], ['small', 'Make the smallest number']], function () { S.slots = []; S.pend = null; S.cur = []; S.deck = []; say(); }));
          mv(api.num('Digits in the number', 'places', 2, 6, 1, function () { S.slots = []; S.pend = null; }));
        }
        if (S.mode === 'facts') {
          mv(api.seg('Facts', 'op', [['x', '×'], ['d', '÷'], ['m', 'Both']], function () { S.fop = null; }));
          mv(api.num('Smallest factor', 'lo', 0, 12, 1, function () { S.fop = null; })); mv(api.num('Biggest factor', 'hi', 1, 12, 1, function () { S.fop = null; }));
        }
        api.button('Clear history', function () { S.hist = []; S.cur = []; S.slots = []; S.pend = null; S.deck = []; api.redraw(); }, '', api.row(box2));
        say();
      }
      function say() {
        api.say(S.mode === 'dice' ? 'Tap <b>Roll</b>.' : S.mode === 'facts' ? 'Say the answer, then tap the card to check.' :
          S.game === 'none' ? 'Tap <b>Draw a card</b>.' : 'Draw a card, then tap a box to place it. You can’t move it later!');
      }
      build();
      var ctrl = O.el('div', { class: 'om-row', style: 'margin:0 0 .6rem' }); api.stage.appendChild(ctrl);
      var holder = O.el('div'); api.stage.appendChild(holder);
      var histEl = O.el('p', { class: 'om-hint om-num', style: 'margin-top:.6rem' }); api.stage.appendChild(histEl);
      function log(t) { S.hist.unshift(t); S.hist = S.hist.slice(0, 10); }
      function drawCard() {
        if (S.put) return rnd(10);
        if (!S.deck.length) { S.deck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; for (var i = 9; i > 0; i--) { var j = rnd(i + 1), t = S.deck[i]; S.deck[i] = S.deck[j]; S.deck[j] = t; } }
        return S.deck.pop();
      }
      function newFact() {
        var a = S.lo + rnd(S.hi - S.lo + 1), b = S.lo + rnd(S.hi - S.lo + 1), op = S.op === 'm' ? (rnd(2) ? 'x' : 'd') : S.op;
        if (op === 'd' && b === 0) b = 1;
        S.fa = a; S.fb = b; S.fop = op; S.show = 0;
      }
      function draw() {
        holder.innerHTML = ''; ctrl.innerHTML = '';
        var out = '';
        if (S.mode === 'dice') {
          api.button('Roll', function () { S.cur = []; for (var i = 0; i < S.k; i++) S.cur.push(S.sides === 6 ? 1 + rnd(6) : rnd(10)); log(S.cur.join(', ')); api.redraw(); }, 'primary', ctrl);
          var dc = S.cur.length ? S.cur : [];
          var v = O.svg(Math.max(4, S.k) * 120, 130, holder, 'Dice');
          for (var i = 0; i < S.k; i++) {
            var x = 10 + i * 120, y = 10, val = dc[i];
            if (S.sides === 6) {
              O.s('rect', { x: x, y: y, width: 100, height: 100, rx: 18, fill: '#fff', stroke: NAVY, 'stroke-width': 3 }, v);
              (PIPS[val] || []).forEach(function (p) { O.s('circle', { cx: x + 22 + p[0] * 28, cy: y + 22 + p[1] * 28, r: 9, fill: NAVY }, v); });
              if (val == null) O.s('text', { x: x + 50, y: y + 62, 'text-anchor': 'middle', 'font-size': 34, fill: '#B8C0D6', text: '?' }, v);
            } else {
              var pts = []; for (var a = 0; a < 10; a++) { var an = -Math.PI / 2 + a * Math.PI / 5; pts.push((x + 50 + 50 * Math.cos(an)).toFixed(1) + ',' + (y + 55 + 50 * Math.sin(an)).toFixed(1)); }
              O.s('polygon', { points: pts.join(' '), fill: tint(VIO, .85), stroke: VIO, 'stroke-width': 3 }, v);
              O.s('text', { x: x + 50, y: y + 70, 'text-anchor': 'middle', 'font-size': 44, fill: val == null ? '#B8C0D6' : NAVY, text: val == null ? '?' : val }, v);
            }
          }
          if (dc.length) { var sum = dc.reduce(function (a, b) { return a + b; }, 0), pr = dc.reduce(function (a, b) { return a * b; }, 1); out = '<span>Rolled: <b>' + dc.join(', ') + '</b></span>' + (dc.length > 1 ? '<span>Sum: <b>' + sum + '</b></span><span>Product: <b>' + pr + '</b></span>' : ''); }
        } else if (S.mode === 'cards') {
          var gameOn = S.game !== 'none', full = gameOn && S.slots.length === S.places && S.slots.every(function (d) { return d != null; });
          var db = api.button(gameOn ? 'Draw a card' : 'Draw a card', function () {
            var d = drawCard();
            if (gameOn) { if (S.pend != null) { O.toast('Place the card you have first.'); return; } S.pend = d; }
            else { S.cur.push(d); if (S.cur.length > 7) S.cur.shift(); }
            log(String(d)); api.redraw();
          }, 'primary', ctrl);
          if (full || (gameOn && S.pend != null)) db.disabled = true;
          if (gameOn) api.button('New game', function () { S.slots = []; S.pend = null; S.deck = []; api.redraw(); }, '', ctrl);
          if (!S.put) ctrl.appendChild(O.el('span', { class: 'om-hint', style: 'margin:0' }, (S.deck.length || 10) + ' cards left in the pile'));
          if (!gameOn) {
            var n = Math.max(S.cur.length, 1), v2 = O.svg(Math.max(n, 4) * 96 + 10, 140, holder, 'Digit cards');
            S.cur.forEach(function (d, i) { card(v2, 10 + i * 96, 10, d, i === S.cur.length - 1); });
            if (!S.cur.length) card(v2, 10, 10, null);
            if (S.cur.length) out = '<span>Cards: <b>' + S.cur.join(' ') + '</b></span>';
          } else {
            while (S.slots.length < S.places) S.slots.push(null);
            var P = S.places, v3 = O.svg(Math.max(P * 104 + 140, 460), 230, holder, 'Place the digits');
            O.s('text', { x: 10, y: 24, 'font-size': 16, fill: NAVY, class: 'ink', text: S.game === 'big' ? 'Make the biggest number you can.' : 'Make the smallest number you can.' }, v3);
            for (var s = 0; s < P; s++) (function (s) {
              var e = P - 1 - s, x = 10 + s * 104, g = O.s('g', {}, v3), d = S.slots[s];
              O.s('text', { x: x + 46, y: 52, 'text-anchor': 'middle', 'font-size': 11.5, fill: PV[e], text: PNAME[e] }, g);
              O.s('rect', { x: x, y: 60, width: 92, height: 112, rx: 12, fill: d == null ? '#F6F7FB' : tint(PV[e], .85), stroke: PV[e], 'stroke-width': 3, 'stroke-dasharray': d == null ? '7 5' : '' }, g);
              if (d != null) O.s('text', { x: x + 46, y: 136, 'text-anchor': 'middle', 'font-size': 56, fill: NAVY, text: d }, g);
              if (d == null) O.tap(g, function () { if (S.pend == null) { O.toast('Draw a card first.'); return; } S.slots[s] = S.pend; S.pend = null; api.redraw(); }, 'Put the card in the ' + PNAME[e] + ' place');
            })(s);
            if (S.pend != null) { O.s('text', { x: P * 104 + 18, y: 52, 'font-size': 13, fill: '#5B6478', class: 'ink', text: 'Your card' }, v3); card(v3, P * 104 + 20, 60, S.pend, true); }
            if (full) {
              var mine = S.slots.join(''), sorted = S.slots.slice().sort(function (a, b) { return S.game === 'big' ? b - a : a - b; });
              if (S.game === 'small' && sorted[0] === 0) { var nz = sorted.findIndex(function (d) { return d > 0; }); if (nz > 0) { var t = sorted[nz]; sorted.splice(nz, 1); sorted.unshift(t); } }
              var best = sorted.join('');
              out = '<span>Your number: <b>' + Number(mine).toLocaleString('en-US') + '</b></span><span>' + (mine === best ? '✓ That is the ' + (S.game === 'big' ? 'biggest' : 'smallest') + ' number these digits can make!' : 'With these digits, the ' + (S.game === 'big' ? 'biggest' : 'smallest') + ' is <b>' + Number(best).toLocaleString('en-US') + '</b>.') + '</span>';
            }
          }
        } else {
          if (!S.fop) newFact();
          api.button('Next card', function () { newFact(); api.redraw(); }, 'primary', ctrl);
          var a1 = S.fa, b1 = S.fb, txt, ans;
          if (S.fop === 'd') { txt = (a1 * b1) + ' ÷ ' + b1; ans = a1; } else { txt = a1 + ' × ' + b1; ans = a1 * b1; }
          var v4 = O.svg(420, 220, holder, 'Fact card'), g = O.s('g', {}, v4);
          O.s('rect', { x: 10, y: 10, width: 400, height: 200, rx: 20, fill: S.show ? '#E5F5EC' : '#fff', stroke: S.show ? GRN : VIO, 'stroke-width': 4 }, g);
          O.s('text', { x: 210, y: S.show ? 92 : 128, 'text-anchor': 'middle', 'font-size': S.show ? 44 : 58, fill: NAVY, text: txt }, g);
          if (S.show) O.s('text', { x: 210, y: 168, 'text-anchor': 'middle', 'font-size': 58, fill: GRN, text: '= ' + ans }, g);
          else O.s('text', { x: 210, y: 192, 'text-anchor': 'middle', 'font-size': 13, fill: '#5B6478', text: 'tap to check' }, g);
          O.tap(g, function () { if (!S.show) { S.show = 1; log(txt + ' = ' + ans); } else S.show = 0; api.redraw(); }, 'Flip the card');
        }
        histEl.textContent = S.hist.length ? 'Last ' + S.hist.length + ': ' + S.hist.join('  ·  ') : '';
        api.readout(out);
      }
      function card(v, x, y, d, hot) {
        O.s('rect', { x: x, y: y, width: 82, height: 116, rx: 10, fill: d == null ? '#E7E9F0' : '#fff', stroke: hot ? YEL : NAVY, 'stroke-width': hot ? 4 : 2.5 }, v);
        O.s('text', { x: x + 41, y: y + 78, 'text-anchor': 'middle', 'font-size': 54, fill: d == null ? '#B8C0D6' : NAVY, text: d == null ? '?' : d }, v);
        if (d === 6 || d === 9) O.s('line', { x1: x + 26, x2: x + 56, y1: y + 92, y2: y + 92, stroke: NAVY, 'stroke-width': 3 }, v);
      }
      api.onRedraw(draw);
    }
  });
})();
