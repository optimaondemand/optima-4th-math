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
  /* ---- drag helper (same as discs.js): drag a clone ("ghost"); taps still go through O.tap ---- */
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

  function attrOf(t, a) { var c = t && t.closest && t.closest('[' + a + ']'); return c ? +c.getAttribute(a) : null; }
  /* k pieces worth 10^e, as a term in an expanded-form sentence */
  function term(e, k) { return k < 10 ? O.fmt(k * Math.pow(10, e)) : k + ' × ' + O.fmt(Math.pow(10, e)); }
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
      api.say('Drag a card down to pull it out of the stack. Drag it back up to push it in.');
      api.heading('Number on the cards');
      api.text('Type a number', 'n', function () { S.out = []; S.apart = 0; }, 'like 3,456 or 25.07');
      api.hint('Up to 7 digits, and up to 3 decimal places.');
      var holder = O.el('div'); api.stage.appendChild(holder);
      var bar = O.el('div', { class: 'om-row', style: 'margin:.4rem 0 0' }); api.stage.appendChild(bar);
      var tog = O.el('button', { type: 'button', class: 'om-btn small', title: 'Keyboard: move every card at once' }); bar.appendChild(tog);
      tog.onclick = function () { var all = allOut(); S.apart = all ? 0 : 1; S.out = []; draw(true); api.changed(); };
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
      function isOut(c) { return S.apart ? true : (S.out || []).indexOf(c.e) > -1; }
      function allOut() { var P = parse(); return !!P && P.cards.every(isOut); }
      var prevY = {};
      function draw(anim) {
        var P = parse(); holder.innerHTML = '';
        if (!P) { holder.innerHTML = '<p class="om-hint">Type a whole number up to 7 digits, or a decimal with up to 3 decimal places.</p>'; api.readout(''); api.report({ v: '' }); return; }
        if (S.apart && P.cards.length === 1) { /* fine */ }
        var all = P.cards.every(isOut); tog.textContent = all ? 'Push all together' : 'Pull all apart';
        /* character slots */
        var slot = {}, x = 50, DW = 34, SW = 12;
        for (var e = P.hi; e >= Math.min(P.lo, 0); e--) {
          slot[e] = x; x += DW;
          if (e > 0 && e % 3 === 0) { slot['c' + e] = x; x += SW; }
          if (e === 0 && P.lo < 0) { slot.pt = x; x += SW; }
        }
        var W = Math.max(x + 30, 300), CH = 62, GAP = 76;
        var stacked = P.cards.filter(function (c) { return !isOut(c); }), outs = P.cards.filter(isOut);
        var order = stacked.filter(function (c) { return c.e >= 0; }).concat(stacked.filter(function (c) { return c.e < 0; }).reverse());
        var rowsN = (stacked.length ? 1 : 0) + outs.length;
        var H = 30 + Math.max(rowsN, 1) * GAP + 10;
        var v = O.svg(W, H, holder, 'Place-value cards'); v.style.width = '100%'; v.style.maxWidth = (W * 1.7) + 'px';
        if (stacked.length) O.s('rect', { x: 40, y: 14, width: W - 70, height: CH + 12, rx: 10, fill: '#F6F7FB', stroke: '#D9DEEA', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, v);
        function cardChars(c, stack) {
          var ch = [];
          if (c.e >= 0) {
            ch.push([slot[c.e], String(c.d)]);
            for (var k = c.e - 1; k >= 0; k--) { if (slot['c' + (k + 1)] != null && (k + 1) % 3 === 0) ch.push([slot['c' + (k + 1)], ',', 1]); ch.push([slot[k], '0']); }
          } else {
            if (!stack) ch.push([slot[0], '0']);
            ch.push([slot.pt, '.', 1]);
            for (var k2 = -1; k2 > c.e; k2--) ch.push([slot[k2], '0']);
            ch.push([slot[c.e], String(c.d)]);
          }
          return ch;
        }
        var list = order.map(function (c) { return { c: c, y: 20 }; }).concat(outs.map(function (c, j) { return { c: c, y: 20 + (stacked.length ? j + 1 : j) * GAP }; }));
        list.forEach(function (it, i) {
          var c = it.c, col = PV[c.e], ch = cardChars(c, !isOut(c) && P.ip !== '0');
          var x0 = ch[0][0], last = ch[ch.length - 1], x1 = last[0] + (last[2] ? SW : DW);
          var g = O.s('g', {}, v), y = it.y, from = anim && prevY[c.e] != null ? prevY[c.e] : y;
          g.style.transition = 'transform .45s ease'; g.style.cursor = 'grab';
          g.style.transform = 'translate(0px,' + from + 'px)';
          if (from !== y) requestAnimationFrame(function () { requestAnimationFrame(function () { g.style.transform = 'translate(0px,' + y + 'px)'; }); });
          O.s('rect', { x: x0, y: 0, width: x1 - x0, height: CH, rx: 6, fill: tint(col, .86), stroke: col, 'stroke-width': 2 }, g);
          O.s('rect', { x: x0 + 1, y: 1, width: x1 - x0 - 2, height: 7, rx: 3, fill: col }, g);
          ch.forEach(function (q) { O.s('text', { x: q[0] + (q[2] ? SW / 2 : DW / 2), y: 43, 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 800, fill: shade(col, .15), text: q[1] }, g); });
          if (all && i > 0) O.s('text', { x: 26, y: y + 42, 'text-anchor': 'middle', 'font-size': 32, fill: NAVY, class: 'ink', text: '+' }, v);
          tapS(g, function () { tog.click(); }, all ? 'Push the cards together' : 'Pull the cards apart');
          /* drag the card: down pulls it out, up onto the stack pushes it in */
          g.addEventListener('pointerdown', function (e0) {
            if (e0.button > 0) return; e0.preventDefault();
            var id = e0.pointerId, p0 = O.pt(v, e0), moved = false;
            try { g.setPointerCapture(id); } catch (x) {}
            function mv(ev) { if (ev.pointerId !== id) return; var p = O.pt(v, ev); if (!moved && Math.hypot(ev.clientX - e0.clientX, ev.clientY - e0.clientY) > 6) { moved = true; g.style.transition = 'none'; v.appendChild(g); } if (moved) g.style.transform = 'translate(' + (p.x - p0.x) + 'px,' + (y + p.y - p0.y) + 'px)'; }
            function up(ev) {
              if (ev.pointerId !== id) return;
              g.removeEventListener('pointermove', mv); g.removeEventListener('pointerup', up); g.removeEventListener('pointercancel', up);
              if (!moved) return;
              supUntil = Date.now() + 250;
              var p = O.pt(v, ev), dy = p.y - p0.y, ny = y + dy;
              prevY = {}; list.forEach(function (o) { prevY[o.c.e] = o.y; }); prevY[c.e] = ny;
              var out = (S.apart ? P.cards.map(function (k) { return k.e; }) : (S.out || []).slice()); S.apart = 0;
              if (!isOutE(out, c.e) && dy > 30) out.push(c.e);
              else if (isOutE(out, c.e) && ny < 20 + CH * .7 && stacked.length) out.splice(out.indexOf(c.e), 1);
              else if (isOutE(out, c.e) && !stacked.length && dy < -30) out.splice(out.indexOf(c.e), 1);
              S.out = out; if (P.cards.every(function (k) { return out.indexOf(k.e) > -1; })) { S.apart = 1; S.out = []; }
              draw(true); api.changed();
            }
            g.addEventListener('pointermove', mv); g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
          });
        });
        prevY = {}; list.forEach(function (o) { prevY[o.c.e] = o.y; });
        var std = Number(P.ip).toLocaleString('en-US') + (P.fp ? '.' + P.fp : '');
        var exp = P.cards.map(function (c) { return c.e >= 0 ? O.fmt(c.d * Math.pow(10, c.e)) : '0.' + '0'.repeat(-c.e - 1) + c.d; }).join(' + ');
        api.readout('<span>Standard form: <b>' + std + '</b></span><span>Expanded form: <b>' + exp + '</b></span><span>Word form: <b>' + words(P.ip, P.fp.replace(/0+$/, '')) + '</b></span>');
        var fpz = P.fp.replace(/0+$/, ''); api.report({ v: String(+P.ip) + (fpz ? '.' + fpz : '') });
      }
      function isOutE(out, e) { return out.indexOf(e) > -1; }
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
      var S = api.S, NM = { 3: 'Thousands', 2: 'Hundreds', 1: 'Tens', 0: 'Ones' }, ONE = { 3: 'thousand', 2: 'hundred', 1: 'ten', 0: 'one' }, CW = { 3: 160, 2: 150, 1: 168, 0: 128 }, busyF = false;
      function busy() { return busyF; }
      function n(e) { return S.c[e] || 0; }
      api.say('Drag blocks from the tray onto the mat. Drag a block to the smaller column to break it, or to the bigger column to group 10 into 1. Drag it off the mat to take it away.');
      api.heading('Start with a number');
      var row = api.row(); var inp = O.el('input', { type: 'text', placeholder: 'like 1,234', 'aria-label': 'Number to show', style: 'flex:1;min-width:0;border:2px solid var(--line);border-radius:10px;padding:.35em .55em;min-height:38px' });
      row.appendChild(inp); api.button('Show it', function () { setN(inp.value); }, 'primary', row);
      inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') setN(inp.value); });
      api.button('Clear the mat', function () { S.c = {}; api.redraw(); }, '', api.row());
      api.hint('Tip: drag a box around 10 blocks to pick them up together. Keyboard: Tab to the small + − and Group buttons.');
      var sel = null;
      function mark(list) { (sel ? sel.nodes : []).forEach(function (g) { g.style.filter = ''; }); sel = null; if (!list.length) return;
        var e = +list[0].getAttribute('data-e'); list = list.filter(function (g) { return +g.getAttribute('data-e') === e; });
        sel = { e: e, nodes: list }; list.forEach(function (g) { g.style.filter = 'drop-shadow(0 0 3px #F2B705) drop-shadow(0 0 2px #F2B705)'; });
        O.toast(list.length + ' picked. Drag them together.'); }
      function setN(t) { var v = num(t); if (isNaN(v) || v < 0 || v > 9999 || v % 1) { O.toast('Type a whole number from 0 to 9,999.'); return; } S.c = { 3: Math.floor(v / 1000), 2: Math.floor(v / 100) % 10, 1: Math.floor(v / 10) % 10, 0: v % 10 }; api.redraw(); }
      var holder = O.el('div'); api.stage.appendChild(holder);
      function layout(e, k) { /* returns [x,y] offsets inside column body + body height */
        var pos = [], i;
        if (e === 3) { for (i = 0; i < k; i++) pos.push([18, 44 + i * 22]); return { pos: pos, h: k ? 44 + (k - 1) * 22 + 90 : 60 }; }
        if (e === 2) { for (i = 0; i < k; i++) pos.push([22, 18 + i * 14]); return { pos: pos, h: k ? 18 + (k - 1) * 14 + 100 : 60 }; }
        if (e === 1) { for (i = 0; i < k; i++) pos.push([10 + (i % 7) * 21, 14 + Math.floor(i / 7) * 136]); return { pos: pos, h: k ? 14 + Math.ceil(k / 7) * 136 : 60 }; }
        for (i = 0; i < k; i++) pos.push([14 + (i % 5) * 21, 16 + Math.floor(i / 5) * 22]); return { pos: pos, h: k ? 16 + Math.ceil(k / 5) * 22 + 6 : 60 };
      }
      function block(par, e, bx, by) {
        if (e === 3) return box(par, bx, by, 80, 80, 34, PV[3], 10, 10, 10);
        if (e === 2) return box(par, bx, by, 90, 90, 7, PV[2], 10, 10, 1);
        if (e === 1) return box(par, bx, by, 13, 120, 5, PV[1], 1, 10, 1);
        return box(par, bx, by, 14, 14, 5, PV[0], 1, 1, 1);
      }
      var isNarrow = narrowWatch(holder, function () { draw(); });
      var TOP = 118, v, pos = {}, nodes = {}, dxN = 0;
      /* absolute (svg) top-left of block number i in column e */
      function abs(e, i) { var p = layout(e, i + 1).pos[i]; return [pos[e].x + p[0] + dxN, pos[e].y + TOP + p[1]]; }
      function draw() {
        holder.innerHTML = ''; nodes = {}; sel = null;
        var narrow = isNarrow(), P = [3, 2, 1, 0], L = {}, rows = narrow ? [[3, 2], [1, 0]] : [[3, 2, 1, 0]];
        dxN = narrow ? 10 : 0;
        P.forEach(function (e) { L[e] = layout(e, n(e)); });
        pos = {}; var y = 0, W = 8;
        rows.forEach(function (r) {
          var x = 4, bh = 0; r.forEach(function (e) { bh = Math.max(bh, L[e].h); });
          r.forEach(function (e) { pos[e] = { x: x, y: y, h: TOP + bh + 10 }; x += CW[e] + (narrow ? 20 : 0); });
          W = Math.max(W, x + 4); y += TOP + bh + 10 + 10;
        });
        var TRY = y, H = y + 92;
        v = O.svg(W, H, holder, 'Base-ten blocks on a place-value mat');
        P.forEach(function (e) {
          var cw = CW[e] + (narrow ? 20 : 0), col = PV[e], x = pos[e].x, y0 = pos[e].y, ch = pos[e].h;
          var g0 = O.s('g', { transform: 'translate(0,' + y0 + ')', 'data-col': e }, v);
          var bg = O.s('rect', { x: x + 2, y: 2, width: cw - 4, height: ch - 4, rx: 12, fill: '#fff', stroke: '#D9DEEA', 'stroke-width': 2, class: 'paper' }, g0);
          lasso(v, bg, function () { return nodes[e]; }, mark);
          O.s('rect', { x: x + 2, y: 2, width: cw - 4, height: 34, rx: 12, fill: col }, g0);
          O.s('text', { x: x + cw / 2, y: 25, 'text-anchor': 'middle', fill: '#fff', 'font-size': 15, text: NM[e] }, g0);
          O.s('text', { x: x + cw / 2, y: 106, 'text-anchor': 'middle', 'font-size': 22, fill: col, class: 'om-num', text: String(n(e)) }, g0);
          btn(g0, x + 18, 58, '−', '#5B6478', function () { if (n(e)) { S.c[e] = n(e) - 1; api.redraw(); } }, 'Take away one ' + ONE[e]);
          btn(g0, x + 42, 58, '+', col, function () { add(e); }, 'Add one ' + ONE[e]);
          if (e < 3) {
            var can = n(e) >= 10, tg = O.s('g', { opacity: can ? 1 : .35 }, g0);
            O.s('rect', { x: x + 58, y: 49, width: 56, height: 18, rx: 6, fill: can ? YEL : '#E7E9F0' }, tg);
            O.s('text', { x: x + 86, y: 61.5, 'text-anchor': 'middle', 'font-size': 9, fill: NAVY, text: 'Group 10 ⇧' }, tg);
            tapS(tg, function () { if (busyF) return; if (n(e) < 10) { O.toast('You need 10 to group. You have ' + n(e) + '.'); return; } group(e); }, 'Group 10 into one bigger block');
          }
          nodes[e] = [];
          L[e].pos.forEach(function (p, i) {
            var bx = x + p[0] + dxN, by = TOP + p[1], g = block(g0, e, bx, by);
            g._a = [bx, by + y0]; g._y0 = y0; g.setAttribute('data-e', e); nodes[e].push(g);
            if (e > 0) tapS(g, function () { if (!busyF) breakB(e, g); }, 'Break this block into 10 smaller blocks');
            g.style.cursor = 'grab';
            function picked() { return sel && sel.e === e && sel.nodes.indexOf(g) > -1 ? sel.nodes.slice() : null; }
            ghostDrag(v, g, busy, function (t) {
              var to = attrOf(t, 'data-col'), many = picked(), cnt = many ? many.length : 1;
              if (to === null) { S.c[e] = n(e) - cnt; api.redraw(); return true; }
              if (to === e) return false;
              if (to === e + 1 && e < 3) {
                if (many) { if (cnt >= 10) { group(e, many.slice(0, 10)); return true; } O.toast('You need 10 to group. You picked ' + cnt + '.'); return false; }
                if (n(e) >= 10) { group(e, [g].concat(nodes[e].filter(function (x) { return x !== g; }).slice(-9))); return true; }
                O.toast('You need 10 to group. You have ' + n(e) + '.'); return false;
              }
              if (to === e - 1 && e > 0 && cnt === 1) { g.style.opacity = '0'; breakB(e, g); return true; }
              O.toast(to === e - 1 ? 'Break one block at a time.' : 'That block goes in the ' + NM[e] + ' column.');
              return false;
            }, function () { var m = picked(); return m ? cloneGroup(m, g0) : null; });
          });
        });
        /* tray: one of each block; drag it onto its column (or tap it) */
        var tray = O.s('g', { 'data-tray': 1 }, v);
        O.s('rect', { x: 6, y: TRY, width: W - 12, height: 84, rx: 12, fill: '#F6F7FB', stroke: '#D9DEEA', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, tray);
        var mini = { 3: [44, 44, 18, 10, 10, 10], 2: [50, 50, 4, 10, 10, 1], 1: [8, 66, 3, 1, 10, 1], 0: [12, 12, 4, 1, 1, 1] }, slot = (W - 12) / 4;
        P.forEach(function (e, i) {
          var m = mini[e], cx = 6 + slot * i + slot / 2, g = box(tray, cx - (m[0] + m[2]) / 2, TRY + 42 - m[1] / 2 + m[2] / 2, m[0], m[1], m[2], PV[e], m[3], m[4], m[5]);
          tapS(g, function () { if (!busyF) add(e); }, 'Add one ' + ONE[e]);
          ghostDrag(v, g, busy, function (t) {
            var to = attrOf(t, 'data-col');
            if (to === e) { add(e); return true; }
            if (to !== null) O.toast('That block goes in the ' + NM[e] + ' column.');
            return false;
          });
        });
        /* readout: live number sentence + short words */
        var val = n(3) * 1000 + n(2) * 100 + n(1) * 10 + n(0), terms = [];
        P.forEach(function (e) { if (n(e)) terms.push(term(e, n(e))); });
        var sent = !terms.length ? '0' : (terms.length === 1 && n(P.filter(function (e) { return n(e); })[0]) < 10) ? O.fmt(val) : terms.join(' + ') + ' = ' + O.fmt(val);
        api.readout('<span><b>' + sent + '</b></span><span>' + P.map(function (e) { return n(e) + ' ' + ONE[e] + (n(e) === 1 ? '' : 's'); }).join(', ') + '</span>' + ([0, 1, 2].some(function (e) { return n(e) >= 10; }) ? '<span style="color:#B45309">A column has 10 or more. Can you group them?</span>' : ''));
        api.report({ v: String(val) });
      }
      function add(e) { if (n(e) >= 29) { O.toast('That column is full. Group 10 first.'); return; } S.c[e] = n(e) + 1; api.redraw(); }
      /* 10 blocks slide into the next column, then become 1 bigger block */
      function group(e, list) {
        list = list || (nodes[e] || []).slice(-10);
        var to = abs(e + 1, n(e + 1)), left = list.length;
        function done() { S.c[e] = n(e) - 10; S.c[e + 1] = n(e + 1) + 1; busyF = false; api.redraw(); }
        if (O.reduce || !left) { done(); return; }
        busyF = true;
        list.forEach(function (g, i) { g.style.opacity = ''; g.style.filter = ''; g.parentNode.appendChild(g); O.anim(g, { tx: 0, ty: 0 }, { tx: to[0] - g._a[0], ty: to[1] - g._a[1] }, 380 + i * 12, function () { if (--left === 0) done(); }); });
      }
      /* 1 block splits into 10 smaller blocks that fan out into the next column */
      function breakB(e, g) {
        if (n(e - 1) + 10 > 29) { O.toast('No room. Group some blocks first.'); g.style.opacity = ''; return; }
        function done() { S.c[e] = n(e) - 1; S.c[e - 1] = n(e - 1) + 10; busyF = false; api.redraw(); }
        if (O.reduce || !g._a) { done(); return; }
        busyF = true; g.style.opacity = '0';
        var base = n(e - 1), left = 10, from = g._a;
        for (var k = 0; k < 10; k++) {
          var to = abs(e - 1, base + k), c = block(v, e - 1, from[0], from[1]);
          c.style.pointerEvents = 'none';
          O.anim(c, { tx: 0, ty: 0 }, { tx: to[0] - from[0], ty: to[1] - from[1] }, 360 + k * 18, function () { if (--left === 0) done(); });
        }
      }
      function btn(v, cx, cy, t, fill, fn, lab) { var g = O.s('g', {}, v); O.s('circle', { cx: cx, cy: cy, r: 10, fill: fill, opacity: .85 }, g); O.s('text', { x: cx, y: cy + 5, 'text-anchor': 'middle', fill: '#fff', 'font-size': 15, text: t }, g); tapS(g, function () { if (!busyF) fn(); }, lab); }
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
        var okB = false;
        if (missing === 0) {
          var parts = S.p.slice(0, S.parts).map(num), sum = parts.reduce(function (a, b) { return a + b; }, 0), w = num(S.w);
          okB = Math.abs(sum - w) < 1e-9;
          api.readout(okB ? '<span>✓ The parts make the whole: <b>' + parts.map(nice).join(' + ') + ' = ' + nice(w) + '</b></span>' : '<span>These parts make <b>' + nice(sum) + '</b>, not ' + nice(w) + '. Check again.</span>');
        } else if (missing === 1) api.readout('<span>Find the missing number.</span>');
        else api.readout('<span>Fill in the circles.</span>');
        api.report({ v: okB ? 'ok' : '' });
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
      api.say('Draw the story with bars. Drag the edge of a piece with no number to make it longer or shorter. Tap a piece to color it.');
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
          if (S.cmp.o) sbtn(box2, 'Line the brace up with the bars again', function () { delete S.cmp.o; });
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
          return { each: each, mag: b.p.reduce(function (a, p) { var v = num(p.v); return a + (!isNaN(v) && v > 0 ? v : each * (p.k || 1)); }, 0) };
        });
        /* units with no numbers anywhere: keep all bars on the same unit size */
        var noNum = !cntN && S.bars.every(function (b, i) { return isNaN(num(b.t)) || b.p.every(function (p) { return isNaN(num(p.v)); }); });
        if (noNum) M.forEach(function (m, i) { m.each = 1; m.mag = S.bars[i].p.reduce(function (a, p) { return a + (p.k || 1); }, 0); });
        var maxMag = Math.max.apply(null, M.map(function (m) { return m.mag; }));
        var sc = WMAX / maxMag; if (noNum) sc = Math.min(sc, 90);
        var H = 20 + S.bars.length * ROW, v = O.svg(SW, H, holder, 'Bar model'), ends = [], grips = [];
        S.bars.forEach(function (b, bi) {
          var y = 52 + bi * ROW, x = X0;
          O.s('text', { x: X0 - 12, y: y + BH / 2 + 6, 'text-anchor': 'end', 'font-size': 18, fill: NAVY, class: 'ink', text: b.n || '' }, v);
          b.p.forEach(function (p, pi) {
            var val = num(p.v), blank = !(!isNaN(val) && val > 0), w = Math.max(24, (blank ? M[bi].each * (p.k || 1) : val) * sc);
            var g = O.s('g', {}, v);
            var pr = O.s('rect', { x: x, y: y, width: w, height: BH, fill: BAR_FILL[p.c || 0], stroke: NAVY, 'stroke-width': 2.5 }, g);
            var lab = p.l || (!isNaN(val) ? p.v : '');
            if (lab) O.s('text', { x: x + w / 2, y: y + BH / 2 + 6, 'text-anchor': 'middle', 'font-size': lab.length * 9 > w ? 12 : 17, fill: NAVY, text: lab }, g);
            tapS(g, function () { p.c = ((p.c || 0) + 1) % 4; api.redraw(); }, 'Color this piece');
            if (blank) (function (x0, unit) { /* drag the right edge to resize a piece that has no number */
              var gr = O.s('rect', { x: x0 + w - 7, y: y + 6, width: 14, height: BH - 12, rx: 4, fill: '#fff', stroke: VIO, 'stroke-width': 2 }, v); gr.style.cursor = 'ew-resize';
              grips.push(gr);
              gr.addEventListener('pointerdown', function (e0) {
                if (e0.button > 0) return; e0.preventDefault(); var id = e0.pointerId; try { gr.setPointerCapture(id); } catch (xx) {}
                function mvr(ev) { if (ev.pointerId !== id) return; var pp = O.pt(v, ev); p.k = O.clamp(Math.round((pp.x - x0) / unit * 4) / 4, .25, 8); var nw = Math.max(24, unit * p.k); pr.setAttribute('width', nw); gr.setAttribute('x', x0 + nw - 7); }
                function upr(ev) { if (ev.pointerId !== id) return; gr.removeEventListener('pointermove', mvr); gr.removeEventListener('pointerup', upr); supUntil = Date.now() + 250; api.redraw(); }
                gr.addEventListener('pointermove', mvr); gr.addEventListener('pointerup', upr); gr.addEventListener('pointercancel', upr);
              });
            })(x, M[bi].each * sc);
            x += w;
          });
          ends.push([X0, x, y]);
          grips.forEach(function (gr) { v.appendChild(gr); });
          if (b.t) { var up = b.tp !== 'below'; brace(v, X0, x, up ? y - 4 : y + BH + 4, up ? -1 : 1, b.t); }
        });
        if (S.cmp.on && S.bars[S.cmp.a] && S.bars[S.cmp.b] && S.cmp.a !== S.cmp.b) {
          var A = ends[S.cmp.a], B = ends[S.cmp.b], sh = A[1] <= B[1] ? A : B, lo = A[1] <= B[1] ? B : A;
          var c1 = S.cmp.o ? X0 + S.cmp.o[0] * sc : sh[1], c2 = S.cmp.o ? X0 + S.cmp.o[1] * sc : lo[1];
          if (c2 - c1 > 2) {
            var dr = O.s('rect', { x: c1, y: sh[2], width: c2 - c1, height: BH, fill: 'none', stroke: VIO, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, v);
            var below = sh[2] > lo[2], bars = S.bars[A === sh ? S.cmp.a : S.cmp.b];
            /* keep away from that bar's own total brace */
            var useBelow = bars.t ? bars.tp !== 'below' : below, by = useBelow ? sh[2] + BH + 4 : sh[2] - 4;
            brace(v, c1, c2, by, useBelow ? 1 : -1, S.cmp.l, VIO);
            /* drag either end of the difference brace */
            [0, 1].forEach(function (k) {
              var hx = k ? c2 : c1, hd = O.s('circle', { cx: hx, cy: by, r: 8, fill: '#fff', stroke: VIO, 'stroke-width': 3 }, v); hd.style.cursor = 'ew-resize';
              hd.addEventListener('pointerdown', function (e0) {
                if (e0.button > 0) return; e0.preventDefault(); var id = e0.pointerId; try { hd.setPointerCapture(id); } catch (xx) {}
                var o = S.cmp.o ? S.cmp.o.slice() : [(c1 - X0) / sc, (c2 - X0) / sc];
                function mvb(ev) { if (ev.pointerId !== id) return; var pp = O.pt(v, ev); o[k] = Math.max(0, (pp.x - X0) / sc); S.cmp.o = [Math.min(o[0], o[1]), Math.max(o[0], o[1])]; hd.setAttribute('cx', X0 + o[k] * sc); dr.setAttribute('x', X0 + S.cmp.o[0] * sc); dr.setAttribute('width', Math.max(1, (S.cmp.o[1] - S.cmp.o[0]) * sc)); }
                function upb(ev) { if (ev.pointerId !== id) return; hd.removeEventListener('pointermove', mvb); hd.removeEventListener('pointerup', upb); supUntil = Date.now() + 250; build(); api.redraw(); }
                hd.addEventListener('pointermove', mvb); hd.addEventListener('pointerup', upb); hd.addEventListener('pointercancel', upb);
              });
            });
          }
        }
        api.readout('');
        api.report({});
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
      function setSay() { api.say(S.hop ? 'Drag from the mark where the hop starts to the mark where it lands.' : 'Drag a dot from the cup onto the line. Drag a dot along the line to move it, or off the line to take it away.'); }
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
        if (S.b <= S.a) { holder.innerHTML = '<p class="om-hint">Make the end number bigger than the start number.</p>'; api.readout(''); api.report({ v: '' }); return; }
        var narrow = isNarrow(), W = narrow ? 440 : 780, X0 = narrow ? 36 : 50, X1 = W - X0, lines = S.two ? [S.parts, S.parts2] : [S.parts], LY = [110, 260], H = S.two ? 340 : 190;
        var v = O.svg(W, H, holder, 'Number line');
        function tx(L, i) { return X0 + (X1 - X0) * i / lines[L]; }
        function nearest(p) { var best = null; lines.forEach(function (k, L) { if (Math.abs(p.y - LY[L]) < 48) { var i = Math.round((p.x - X0) / (X1 - X0) * k); if (i >= 0 && i <= k && Math.abs(tx(L, i) - p.x) < 40 && (!best || Math.abs(p.y - LY[L]) < best.d)) best = { L: L, i: i, d: Math.abs(p.y - LY[L]) }; } }); return best; }
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
            if (sel) O.s('circle', { cx: x, cy: y, r: 13, fill: 'none', stroke: YEL, 'stroke-width': 4 }, v);
            var hit = O.s('rect', { x: x - Math.min(18, (X1 - X0) / k / 2), y: y - 26, width: Math.min(36, (X1 - X0) / k), height: 52, fill: 'transparent' }, v);
            tapS(hit, function () { tapTick(L, i); }, 'Mark ' + i + ' of ' + k);
            if (S.hop) hit.addEventListener('pointerdown', function (e0) { /* draw a hop by dragging from mark to mark */
              if (e0.button > 0) return; e0.preventDefault();
              var id = e0.pointerId, moved = false, prev = null;
              try { hit.setPointerCapture(id); } catch (xx) {}
              function mvh(ev) { if (ev.pointerId !== id) return; var p = O.pt(v, ev); if (!moved && Math.hypot(ev.clientX - e0.clientX, ev.clientY - e0.clientY) > 6) moved = true; if (!moved) return;
                if (!prev) prev = O.s('path', { fill: 'none', stroke: GRN, 'stroke-width': 3, 'stroke-dasharray': '7 5', 'pointer-events': 'none' }, v);
                var mx = (x + p.x) / 2, ht = Math.min(60, 18 + Math.abs(p.x - x) * .25); prev.setAttribute('d', 'M' + x + ',' + (y - 6) + ' Q' + mx + ',' + (y - 6 - ht * 1.6) + ' ' + p.x + ',' + Math.min(p.y, y - 6)); }
              function uph(ev) { if (ev.pointerId !== id) return; hit.removeEventListener('pointermove', mvh); hit.removeEventListener('pointerup', uph); hit.removeEventListener('pointercancel', uph);
                if (prev) prev.remove(); if (!moved) return; supUntil = Date.now() + 250;
                var q = nearest(O.pt(v, ev)); if (q && q.L === L && q.i !== i) { S.hops.push([L, i, q.i]); if (S.hops.length > 12) S.hops.shift(); pend = null; api.redraw(); } else O.toast('Let go on a mark on the same line.'); }
              hit.addEventListener('pointermove', mvh); hit.addEventListener('pointerup', uph); hit.addEventListener('pointercancel', uph);
            });
          })(i);
          /* dots sit on top of the marks: drag to move, drag off to take away, tap to take away */
          S.dots.forEach(function (key) {
            var pr = key.split(':'); if (+pr[0] !== L || +pr[1] > k) return;
            var i = +pr[1], g = O.s('g', {}, v); g.style.cursor = 'grab';
            O.s('circle', { cx: tx(L, i), cy: y, r: 11, fill: VIO, stroke: '#fff', 'stroke-width': 2.5 }, g);
            if (!S.hop) {
              tapS(g, function () { tapTick(L, i); }, 'Take the dot off');
              ghostDrag(v, g, function () { return false; }, function (t, p) {
                var q = nearest(p), ix = S.dots.indexOf(key);
                if (!q) { S.dots.splice(ix, 1); api.redraw(); return true; }
                var nk = q.L + ':' + q.i; if (nk === key) return false;
                S.dots.splice(ix, 1); if (S.dots.indexOf(nk) < 0) S.dots.push(nk); api.redraw(); return true;
              });
            } else g.style.pointerEvents = 'none';
          });
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
        /* the dot cup: drag a new dot onto the line */
        if (!S.hop) {
          var cup = O.s('g', {}, v), cx0 = X0 + 4, cy0 = 30;
          O.s('rect', { x: cx0 - 22, y: cy0 - 18, width: 120, height: 36, rx: 18, fill: '#EFE9FB', stroke: VIO, 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, cup);
          O.s('text', { x: cx0 + 17, y: cy0 + 5, 'font-size': 14, fill: VIO, text: 'drag a dot' }, cup);
          var src = O.s('g', {}, cup); src.style.cursor = 'grab';
          O.s('circle', { cx: cx0, cy: cy0, r: 11, fill: VIO, stroke: '#fff', 'stroke-width': 2.5 }, src);
          tapS(src, function () { O.toast('Drag the dot onto a mark on the line.'); }, 'Drag a new dot onto the line');
          ghostDrag(v, src, function () { return false; }, function (t, p) {
            var q = nearest(p); if (!q) { O.toast('Let go on the line.'); return false; }
            var nk = q.L + ':' + q.i; if (S.dots.indexOf(nk) < 0) S.dots.push(nk); api.redraw(); return true;
          });
        }
        var dl = S.dots.map(function (d) { var p = d.split(':'); return { L: +p[0], i: +p[1] }; }).filter(function (d) { return d.L < lines.length && d.i <= lines[d.L]; })
          .sort(function (a, b) { return val(a.i, lines[a.L]).v - val(b.i, lines[b.L]).v; });
        var out = [];
        if (dl.length) out.push('<span>Dots: <b>' + dl.map(function (d) { return html(val(d.i, lines[d.L])); }).join(', ') + '</b></span>');
        S.hops.forEach(function (h) { if (h[0] < lines.length) { var k = lines[h[0]]; out.push('<span>Hop from ' + html(val(h[1], k)) + ' to ' + html(val(h[2], k)) + ' is ' + html(hopSize(h[1], h[2], k)) + '</span>'); } });
        if (S.two && dl.length === 2 && dl[0].L !== dl[1].L) { var c = val(dl[0].i, lines[dl[0].L]).v - val(dl[1].i, lines[dl[1].L]).v; if (Math.abs(c) < 1e-9) out.push('<span><b>The dots line up. They are equal.</b></span>'); }
        api.readout(out.join(''));
        api.report({ v: dl.map(function (d) { return String(Number(val(d.i, lines[d.L]).v.toFixed(4))); }).join(',') });
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
      var S = api.S, RED = '#D2453B';
      function setSay() { api.say(S.mode === 'array' ? 'Drag across counters to flip them. Drag the scissors between two columns to split the array.' : 'Drag counters from the top into the groups. Share them fairly.'); }
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
          mv(api.num('Counters', 'n', 1, 60, 1, function () { S.d = 0; S.gc = null; })); mv(api.num('Groups', 'g', 1, 10, 1, function () { S.d = 0; S.gc = null; }));
        }
      }
      buildSetup(); setSay();
      var holder = O.el('div'); api.stage.appendChild(holder);
      var ctrl = O.el('div', { class: 'om-row', style: 'margin:.4rem 0 0' }); api.stage.appendChild(ctrl);
      /* how many counters sit in each group: explicit S.gc once a student drags, else dealt in turn (old links) */
      function counts() {
        if (S.gc && S.gc.length === S.g) return S.gc.slice();
        var a = []; for (var i = 0; i < S.g; i++) a.push(Math.floor(S.d / S.g) + (i < S.d % S.g ? 1 : 0)); return a;
      }
      function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
      function state() { var a = counts(), t = sum(a), left = S.n - t, eq = a.every(function (k) { return k === a[0]; }); return { a: a, t: t, left: left, eq: eq, done: left <= 0 || (eq && left < S.g) }; }
      function setCounts(a) { S.gc = a; S.d = sum(a); }
      function dealOne() { var st = state(); if (st.done && st.eq) return false; if (st.left <= 0) return false; var a = st.a, mi = 0; a.forEach(function (k, i) { if (k < a[mi]) mi = i; }); a[mi]++; setCounts(a); return true; }
      function draw() {
        holder.innerHTML = ''; ctrl.innerHTML = '';
        if (S.mode === 'array') return drawArray();
        var st = state(), a = st.a, q = Math.floor(S.n / S.g), rem = S.n - q * S.g;
        var b1 = api.button('Deal one', function () { if (dealOne()) api.redraw(); }, '', ctrl);
        api.button('Deal all', function () { var k = 0; while (k++ < 200 && dealOne()); api.redraw(); }, '', ctrl);
        api.button('Start over', function () { S.d = 0; S.gc = null; api.redraw(); }, '', ctrl);
        if (st.done) b1.disabled = true;
        var maxIn = Math.max.apply(null, a.concat([1]));
        var per = Math.min(S.g, 4), PW = 170, PH = 40 + Math.ceil(Math.max(maxIn, q, 1) / 5) * 28 + 10, rows = Math.ceil(S.g / per);
        var left = st.left, pileRows = Math.ceil(Math.max(left, 1) / 15);
        var top = 40 + pileRows * 26, W = Math.max(per * (PW + 12) + 12, 420), H = top + rows * (PH + 14) + 10;
        var v = O.svg(W, H, holder, 'Counters shared into groups');
        var pile = O.s('g', { 'data-pile': 1 }, v);
        O.s('rect', { x: 4, y: 4, width: W - 8, height: top - 10, rx: 12, fill: 'transparent' }, pile);
        O.s('text', { x: 12, y: 22, 'font-size': 15, fill: '#5B6478', class: 'ink', text: st.done ? (left ? 'Left over (not enough for every group):' : (st.eq ? 'All shared!' : 'All shared. Are the groups equal?')) : 'Still to share:' }, pile);
        for (var i = 0; i < left; i++) (function (i) {
          var g = O.s('g', {}, pile);
          O.s('circle', { cx: 24 + (i % 15) * 26, cy: 44 + Math.floor(i / 15) * 26, r: 10, fill: st.done && st.eq ? YEL : RED, stroke: shade(RED, .3), 'stroke-width': 1.5 }, g);
          tapS(g, function () { if (dealOne()) api.redraw(); }, 'Deal one counter');
          ghostDrag(v, g, function () { return false; }, function (t) {
            var to = attrOf(t, 'data-grp'); if (to === null) return false;
            var a2 = counts(); a2[to]++; setCounts(a2); api.redraw(); return true;
          });
        })(i);
        for (var gI = 0; gI < S.g; gI++) (function (gI) {
          var gx = 12 + (gI % per) * (PW + 12), gy = top + Math.floor(gI / per) * (PH + 14), gg = O.s('g', { 'data-grp': gI }, v);
          O.s('rect', { x: gx, y: gy, width: PW, height: PH, rx: 20, fill: '#EFE9FB', stroke: VIO, 'stroke-width': 2 }, gg);
          O.s('text', { x: gx + 12, y: gy + 22, 'font-size': 13, fill: VIO, text: 'Group ' + (gI + 1) }, gg);
          for (var k = 0; k < a[gI]; k++) {
            var c = O.s('g', {}, gg);
            O.s('circle', { cx: gx + 22 + (k % 5) * 30, cy: gy + 44 + Math.floor(k / 5) * 28, r: 11, fill: RED, stroke: shade(RED, .3), 'stroke-width': 1.5 }, c);
            c.style.cursor = 'grab';
            ghostDrag(v, c, function () { return false; }, function (t) {
              var to = attrOf(t, 'data-grp'), a2 = counts();
              if (to === gI) return false;
              a2[gI]--; if (to !== null) a2[to]++;
              setCounts(a2); api.redraw(); return true;
            });
          }
          O.s('text', { x: gx + PW - 12, y: gy + 22, 'text-anchor': 'end', 'font-size': 15, fill: VIO, class: 'om-num', text: String(a[gI]) }, gg);
        })(gI);
        var out;
        if (st.done && st.eq) out = '<span><b>' + S.n + ' ÷ ' + S.g + ' = ' + a[0] + (left ? ' R ' + left : '') + '</b></span><span>' + S.g + ' groups of ' + a[0] + (left ? ', with ' + left + ' left over' : '') + '</span>';
        else if (st.done) out = '<span>The groups are not equal yet: ' + a.join(', ') + '. Move counters to make them fair.</span>';
        else out = '<span>Shared so far: ' + st.t + ' of ' + S.n + '</span>' + (st.eq ? '' : '<span>Groups now: ' + a.join(', ') + '</span>');
        api.readout(out);
        api.report({ v: st.eq ? String(a[0]) : '', r: st.done && st.eq ? String(left) : '', d: String(st.t) });
      }
      function isY(r, c) { return S.flip.indexOf(r + ',' + c) > -1; }
      function setY(r, c, on) { var k = r + ',' + c, i = S.flip.indexOf(k); if (on && i < 0) S.flip.push(k); if (!on && i > -1) S.flip.splice(i, 1); }
      function drawArray() {
        var SP = 46, X0 = 40, Y0 = 34, W = X0 * 2 + S.c * SP, H = Y0 + S.r * SP + 56;
        var v = O.svg(Math.max(W, 300), H, holder, S.r + ' by ' + S.c + ' array of counters');
        for (var r = 0; r < S.r; r++) {
          O.s('text', { x: 18, y: Y0 + r * SP + SP / 2 + 6, 'text-anchor': 'middle', 'font-size': 13, fill: '#5B6478', class: 'ink', text: r + 1 }, v);
          for (var c = 0; c < S.c; c++) (function (r, c) {
            var cx = X0 + c * SP + SP / 2, cy = Y0 + r * SP + SP / 2, y = isY(r, c);
            var g = O.s('g', { 'data-rc': r + ',' + c }, v);
            O.s('circle', { cx: cx, cy: cy, r: 18, fill: y ? YEL : RED, stroke: shade(y ? YEL : RED, .3), 'stroke-width': 2 }, g);
            tapS(g, function () {
              var on = !isY(r, c), i;
              if (S.tf === 'row') for (i = 0; i < S.c; i++) setY(r, i, on); else if (S.tf === 'col') for (i = 0; i < S.r; i++) setY(i, c, on); else setY(r, c, on);
              api.redraw();
            }, 'Flip counter');
          })(r, c);
        }
        /* drag across counters to paint-flip them (one at a time) */
        v.addEventListener('pointerdown', function (e) {
          var g0 = e.target.closest && e.target.closest('[data-rc]'); if (!g0 || e.button > 0) return;
          var id = e.pointerId, moved = false, k0 = g0.getAttribute('data-rc').split(','), on = !isY(+k0[0], +k0[1]), seen = {};
          function paint(g) { var k = g.getAttribute('data-rc'); if (seen[k]) return; seen[k] = 1; var p = k.split(','); setY(+p[0], +p[1], on); var cc = g.querySelector('circle'); cc.setAttribute('fill', on ? YEL : RED); cc.setAttribute('stroke', shade(on ? YEL : RED, .3)); }
          function mvp(ev) {
            if (ev.pointerId !== id) return;
            if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) > 6) { moved = true; try { v.setPointerCapture(id); } catch (x) {} paint(g0); }
            if (moved) { var t = document.elementFromPoint(ev.clientX, ev.clientY), g = t && t.closest && t.closest('[data-rc]'); if (g && v.contains(g)) paint(g); }
          }
          function upp(ev) {
            if (ev.pointerId !== id) return;
            v.removeEventListener('pointermove', mvp); v.removeEventListener('pointerup', upp); v.removeEventListener('pointercancel', upp);
            if (moved) { supUntil = Date.now() + 250; api.redraw(); }
          }
          v.addEventListener('pointermove', mvp); v.addEventListener('pointerup', upp); v.addEventListener('pointercancel', upp);
        });
        for (var c2 = 0; c2 < S.c; c2++) O.s('text', { x: X0 + c2 * SP + SP / 2, y: 20, 'text-anchor': 'middle', 'font-size': 13, fill: '#5B6478', class: 'ink', text: c2 + 1 }, v);
        for (var s = 1; s < S.c; s++) (function (s) {
          var x = X0 + s * SP;
          if (S.split === s) O.s('line', { x1: x, x2: x, y1: Y0 - 4, y2: Y0 + S.r * SP + 6, stroke: VIO, 'stroke-width': 4, 'stroke-dasharray': '8 6' }, v);
          var hit = O.s('rect', { x: x - 7, y: Y0, width: 14, height: S.r * SP, fill: 'transparent' }, v);
          tapS(hit, function () { S.split = S.split === s ? 0 : s; api.redraw(); }, 'Split after column ' + s);
        })(s);
        /* the scissors: drag them between two columns to split the array */
        if (S.c > 1) {
          var sy = Y0 + S.r * SP + 30, sx = S.split ? X0 + S.split * SP : X0 - 22, sc = O.s('g', {}, v); sc.style.cursor = 'grab';
          O.s('rect', { x: sx - 20, y: sy - 15, width: 40, height: 30, rx: 10, fill: '#EFE9FB', stroke: VIO, 'stroke-width': 2 }, sc);
          O.s('text', { x: sx, y: sy + 7, 'text-anchor': 'middle', 'font-size': 19, fill: VIO, text: '✂' }, sc);
          tapS(sc, function () { S.split = S.split ? 0 : Math.floor(S.c / 2); api.redraw(); }, 'Split the array (keyboard: puts the split in the middle)');
          sc.addEventListener('pointerdown', function (e0) {
            if (e0.button > 0) return; e0.preventDefault(); e0.stopPropagation();
            var id = e0.pointerId, moved = false, ln = null;
            try { sc.setPointerCapture(id); } catch (x) {}
            function snap(p) { return Math.round((p.x - X0) / SP); }
            function mvs(ev) { if (ev.pointerId !== id) return; var p = O.pt(v, ev); if (!moved && Math.hypot(ev.clientX - e0.clientX, ev.clientY - e0.clientY) > 6) moved = true; if (!moved) return;
              sc.setAttribute('transform', 'translate(' + (p.x - sx) + ' 0)');
              var k = snap(p); if (!ln) ln = O.s('line', { y1: Y0 - 4, y2: Y0 + S.r * SP + 6, stroke: VIO, 'stroke-width': 4, 'stroke-dasharray': '8 6', 'pointer-events': 'none' }, v);
              var xx = X0 + O.clamp(k, 0, S.c) * SP; ln.setAttribute('x1', xx); ln.setAttribute('x2', xx); ln.style.opacity = k > 0 && k < S.c ? 1 : .2; }
            function ups(ev) { if (ev.pointerId !== id) return; sc.removeEventListener('pointermove', mvs); sc.removeEventListener('pointerup', ups); sc.removeEventListener('pointercancel', ups);
              if (!moved) return; supUntil = Date.now() + 250; var k = snap(O.pt(v, ev)); S.split = k > 0 && k < S.c ? k : 0; api.redraw(); }
            sc.addEventListener('pointermove', mvs); sc.addEventListener('pointerup', ups); sc.addEventListener('pointercancel', ups);
          });
        }
        var tot = S.r * S.c, out = '<span><b>' + S.r + ' × ' + S.c + ' = ' + tot + '</b></span>';
        if (S.split) { var a = S.split, b = S.c - S.split; out += '<span>' + S.r + ' × ' + S.c + ' = ' + S.r + ' × ' + a + ' + ' + S.r + ' × ' + b + ' = ' + S.r * a + ' + ' + S.r * b + ' = ' + tot + '</span>'; }
        var ny = S.flip.filter(function (k) { var p = k.split(','); return +p[0] < S.r && +p[1] < S.c; }).length;
        if (ny) out += '<span>Yellow: ' + ny + ' · Red: ' + (tot - ny) + '</span>';
        api.readout(out);
        api.report({ v: String(tot), r: String(S.r), c: String(S.c) });
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
      function setSay() { api.say(S.mode === 'times' && S.fac ? 'Tap a number to find all the ways to make it.' : 'Drag across numbers to color a run. Start on a colored number to change or clear the color.'); }
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
      /* drag across cells to color a run with the start cell's next color */
      function paintable(sv) {
        sv.addEventListener('pointerdown', function (e0) {
          var g0 = e0.target.closest && e0.target.closest('[data-k]'); if (!g0 || e0.button > 0) return;
          var id = e0.pointerId, moved = false, k0 = g0.getAttribute('data-k'), col = ((S.hl[k0] || 0) + 1) % 4, seen = {};
          function paint(g) { var k = g.getAttribute('data-k'); if (seen[k]) return; seen[k] = 1; if (col) S.hl[k] = col; else delete S.hl[k];
            var old = g.querySelector('.pnt'); if (old) old.remove(); var r = g.querySelector('rect'); if (col) { var bb = r.getBBox(); var c = O.s('circle', { class: 'pnt', cx: bb.x + bb.width / 2, cy: bb.y + bb.height / 2, r: bb.width * .4, fill: HL[col] }, g); g.insertBefore(c, g.querySelector('text')); } }
          function mvp(ev) { if (ev.pointerId !== id) return;
            if (!moved && Math.hypot(ev.clientX - e0.clientX, ev.clientY - e0.clientY) > 6) { moved = true; try { sv.setPointerCapture(id); } catch (x) {} paint(g0); }
            if (moved) { var t = document.elementFromPoint(ev.clientX, ev.clientY), g = t && t.closest && t.closest('[data-k]'); if (g && sv.contains(g)) paint(g); } }
          function upp(ev) { if (ev.pointerId !== id) return; sv.removeEventListener('pointermove', mvp); sv.removeEventListener('pointerup', upp); sv.removeEventListener('pointercancel', upp); if (moved) { supUntil = Date.now() + 250; api.redraw(); } }
          sv.addEventListener('pointermove', mvp); sv.addEventListener('pointerup', upp); sv.addEventListener('pointercancel', upp);
        });
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
            g.setAttribute('data-k', val);
            tapS(g, function () { S.hl[val] = ((S.hl[val] || 0) + 1) % 4; if (!S.hl[val]) delete S.hl[val]; api.redraw(); }, String(val));
          })(i);
          paintable(v);
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
            if (!head && !S.fac) g.setAttribute('data-k', r + 'x' + c);
            if (!head) tapS(g, function () {
              if (S.fac) S.fv = S.fv === val ? 0 : val;
              else { var k = r + 'x' + c; S.hl[k] = ((S.hl[k] || 0) + 1) % 4; if (!S.hl[k]) delete S.hl[k]; }
              api.redraw();
            }, r + ' times ' + c);
          })(r, c);
          paintable(v2);
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
        api.report({ v: mine.join(',') });
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
        var last = '';
        if (S.mode === 'dice') last = (S.cur || []).join(',');
        else if (S.mode === 'cards') last = S.game !== 'none' ? ((S.slots.length === S.places && S.slots.every(function (d) { return d != null; })) ? String(+S.slots.join('')) : '') : (S.cur.length ? String(S.cur[S.cur.length - 1]) : '');
        else if (S.show) last = String(S.fop === 'd' ? S.fa : S.fa * S.fb);
        api.report({ v: last });
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
