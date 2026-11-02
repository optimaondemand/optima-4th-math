/* Trade Mat (two units, any trade rate) and Bar Strip (pieces on a bar, always to scale).
   Kit rules: plain pieces, labels on the model, one line of directions, a live number sentence,
   drag AND tap, hints that point where to look, a payoff state.
   Drag + tap comes from core (O.dragTap); every piece and button carries a data-k key so focus survives a redraw.
   Every state string that reaches innerHTML goes through O.esc. */
(function () {
  var O = OAOM;
  /* O.hit without pointer-events="all": a transparent fill is still hit-testable, and a drag ghost (pointer-events none on its group) must not catch elementFromPoint */
  function hit(g, x, y, w, h) { var r = O.hit(g, x, y, w, h); r.removeAttribute('pointer-events'); return r; }
  var VIO = '#6B46C1', GRN = '#23915A', YEL = '#F2B705', NAVY = '#0E1C42', LINE = '#D9DEEA', GRAY = '#5B6478', ORG = '#F08A24', BLUE = '#2F6FDE';
  function narrow(api) { return (api.stage.clientWidth || 800) < 560; }
  /* text on an orange piece is navy (white has too little contrast there) */
  function inkOn(fill) { return fill === ORG || fill === YEL || fill === '#fff' ? NAVY : '#fff'; }
  /* svg button (the keyboard path); h = height in svg units (≥ 32 css px once the stage is scaled) */
  function sbtn(v, x, y, w, h, label, fill, fn, aria, key, dim) {
    var g = O.s('g', { opacity: dim ? 0.35 : 0.85, 'data-ui': 'btn' }, v), fs = Math.min(13, h * .5);
    O.s('rect', { x: x, y: y, width: w, height: h, rx: 7, fill: fill || '#fff', stroke: fill ? fill : LINE, 'stroke-width': 1.5 }, g);
    O.s('text', { x: x + w / 2, y: y + h / 2 + fs * .36, 'text-anchor': 'middle', 'font-size': fs, fill: inkOn(fill || '#fff'), text: label }, g);
    O.tap(g, fn, aria || label, key);
    return g;
  }
  function inR(p, r) { return r && p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h; }
  /* a disc piece; hit = side of an invisible square that makes it easy to touch */
  function disc(v, x, y, r, fill, label, hs) {
    var g = O.s('g', {}, v);
    O.s('circle', { cx: x, cy: y, r: r, fill: fill, stroke: '#fff', 'stroke-width': 2 }, g);
    O.s('text', { x: x, y: y + 4.5, 'text-anchor': 'middle', fill: inkOn(fill), 'font-size': Math.min(label.length > 6 ? 9.5 : label.length > 4 ? 11 : 12.5, r * (label.length > 4 ? 0.58 : 0.8)), text: label, style: 'pointer-events:none' }, g);
    if (hs && hs > r * 2) hit(g, x - hs / 2, y - hs / 2, hs, hs);
    return g;
  }
  function fly(node, dx, dy, fade) { if (!node) return; if (O.reduce) { if (fade) node.remove(); else node.removeAttribute('transform'); return; } node._tx = dx; node._ty = dy; node.setAttribute('transform', 'translate(' + dx + ' ' + dy + ')');
    var to = { tx: 0, ty: 0 }, from = { tx: dx, ty: dy };
    if (fade) { to = { tx: fade.x, ty: fade.y, opacity: 0 }; from = { tx: 0, ty: 0, opacity: 1 }; node._tx = 0; node._ty = 0; node.removeAttribute('transform'); }
    O.anim(node, from, to, 420, function () { if (fade) node.remove(); }); }
  function few(n, one, many) { return O.fmt(n) + ' ' + (n === 1 ? one : many); }

  /* ═════════════ TRADE MAT ═════════════ */
  /* [short big, short small, rate, Big column name, Small column name, one big, one small] */
  var UNITS = {
    ftin: ['ft', 'in', 12, 'Feet', 'Inches', 'foot', 'inch'], ydft: ['yd', 'ft', 3, 'Yards', 'Feet', 'yard', 'foot'], lboz: ['lb', 'oz', 16, 'Pounds', 'Ounces', 'pound', 'ounce'],
    galqt: ['gal', 'qt', 4, 'Gallons', 'Quarts', 'gallon', 'quart'], mcm: ['m', 'cm', 100, 'Meters', 'Centimeters', 'meter', 'centimeter'], kmm: ['km', 'm', 1000, 'Kilometers', 'Meters', 'kilometer', 'meter'],
    lml: ['L', 'mL', 1000, 'Liters', 'Milliliters', 'liter', 'milliliter'], kgg: ['kg', 'g', 1000, 'Kilograms', 'Grams', 'kilogram', 'gram'], hmin: ['h', 'min', 60, 'Hours', 'Minutes', 'hour', 'minute']
  };
  O.register('trademat', {
    defaults: { u: 'ftin', big: 'ft', small: 'in', rate: 12, b0: 0, s0: 0, b: 0, sp: [0], take: 0, tb: 2, ts: 6, zb: 0, zp: [0] },
    mount: function (api) {
      var S = api.S;
      /* the unit words: big/small (short, on pieces), B/Sm (column names), b1/s1 (one ...), bl/sl (many ...) */
      function U() {
        var u = UNITS[S.u];
        if (u) return { big: u[0], small: u[1], rate: u[2], B: u[3], Sm: u[4], b1: u[5], s1: u[6], bl: u[3].toLowerCase(), sl: u[4].toLowerCase() };
        var bn = String(S.big || 'big'), sn = String(S.small || 'small');
        return { big: bn, small: sn, rate: Math.max(2, +S.rate || 10), B: bn, Sm: sn, b1: bn, s1: sn, bl: bn, sl: sn };
      }
      function escU(u) { var o = {}; for (var k in u) o[k] = typeof u[k] === 'string' ? O.esc(u[k]) : u[k]; return o; }
      function SZ() { var r = U().rate, a = [1]; if (r >= 100 && /^10+$/.test(String(r))) { for (var s = 10; s < r; s *= 10) a.push(s); } return a; }
      function split(n) { var z = SZ(), out = z.map(function () { return 0; }); for (var i = z.length - 1; i >= 0; i--) { out[i] = Math.floor(n / z[i]); n -= out[i] * z[i]; } return out; }
      function sumS(a) { var z = SZ(), t = 0; z.forEach(function (s, i) { t += (a[i] || 0) * s; }); return t; }
      function fix() { var n = SZ().length; if (!Array.isArray(S.sp) || S.sp.length !== n) S.sp = split(+S.s0 || 0); if (!Array.isArray(S.zp) || S.zp.length !== n) S.zp = SZ().map(function () { return 0; }); }
      /* amt(b, s, u): "2 ft 5 in"; pass the escaped unit words for html */
      function amt(b, s, u) { u = u || U(); if (!b && !s) return '0 ' + u.small; return (b ? O.fmt(b) + ' ' + u.big : '') + (b && s ? ' ' : '') + (s ? O.fmt(s) + ' ' + u.small : ''); }
      function norm(t, u) { var r = U().rate; return amt(Math.floor(t / r), t % r, u); }
      function reset() { S.b = +S.b0 || 0; S.sp = split(+S.s0 || 0); S.zb = 0; S.zp = SZ().map(function () { return 0; }); }

      var EMPTY = { b0: 0, s0: 0, b: 0, sp: null, zb: 0, zp: null, take: 0 };
      function Q(u) { return Object.assign({ u: u }, EMPTY); }
      api.quick([['ft and in', Q('ftin')], ['yd and ft', Q('ydft')], ['lb and oz', Q('lboz')], ['gal and qt', Q('galqt')], ['m and cm', Q('mcm')], ['h and min', Q('hmin')]], 'Units');
      var hint60 = O.el('p', { class: 'om-hint' }, '60 minutes is a lot of discs. Keep the amounts small.'); api.setup.appendChild(hint60);
      api.button('Clear the mat', function () { S.b0 = 0; S.s0 = 0; S.take = 0; reset(); api.redraw(); }, '', api.row());
      api.more('More options');
      api.heading('Start with');
      api.num('Big units', 'b0', 0, 20, 1, reset); api.num('Small units', 's0', 0, 999, 1, reset);
      api.check('Take some away (subtract)', 'take', function () { S.zb = 0; S.zp = SZ().map(function () { return 0; }); });
      var tbI = api.num('Take away: big units', 'tb', 0, 20, 1), tsI = api.num('Take away: small units', 'ts', 0, 999, 1);
      api.button('Put everything back', function () { reset(); api.redraw(); }, '', api.row());
      api.heading('Other units');
      api.select('Big and small unit', 'u', [['ftin', 'feet and inches (12)'], ['ydft', 'yards and feet (3)'], ['lboz', 'pounds and ounces (16)'], ['galqt', 'gallons and quarts (4)'], ['mcm', 'meters and centimeters (100)'], ['kmm', 'kilometers and meters (1,000)'], ['lml', 'liters and milliliters (1,000)'], ['kgg', 'kilograms and grams (1,000)'], ['hmin', 'hours and minutes (60)'], ['custom', 'my own units']], function () { reset(); });
      var cBig = api.text('Big unit name', 'big', null, 'like ft'), cSm = api.text('Small unit name', 'small', null, 'like in'), cRate = api.num('Small units in 1 big unit', 'rate', 2, 1000, 1, function () { reset(); });
      api.endMore();

      var holder = O.el('div'); api.stage.appendChild(holder);
      var sent = O.el('div', { style: 'margin-top:.6rem;font-weight:800;font-size:1.2rem;color:#0E1C42;min-height:1.6em', 'aria-live': 'polite' }); api.stage.appendChild(sent);
      var pos = { big: [], sm: [], zb: [], zs: [] }, pending = null;

      function act(kind, i) { /* returns false + toast when it can't */
        var u = U(), z = SZ(), top = z.length - 1;
        if (kind === 'addB') { if (S.b >= 20) return O.toast('That column is full.'); S.b++; pending = { k: 'new', list: 'big', n: 1, from: pos.tray && pos.tray[0] }; }
        else if (kind === 'subB') { if (S.b > 0) S.b--; }
        else if (kind === 'addS') { if (S.sp[i] >= 99) return O.toast('That column is full. Trade some.'); S.sp[i]++; pending = { k: 'new', list: 'sm' + i, n: 1, from: pos.tray && pos.tray[1 + (z.length - 1 - i)] }; }
        else if (kind === 'subS') { if (S.sp[i] > 0) S.sp[i]--; }
        else if (kind === 'break') { if (!S.b) return O.toast('There is no ' + u.b1 + ' to break.'); var n = u.rate / z[top]; if (S.sp[top] + n > 99) return O.toast('No room. Trade some first.');
          var src = pos.big[S.b - 1]; S.b--; S.sp[top] += n; pending = { k: 'new', list: 'sm' + top, n: n, from: src }; }
        else if (kind === 'bundle') { for (var j = 1; j < z.length; j++) if (S.sp[j] > 0) { var s2 = pos.sm[j] && pos.sm[j][S.sp[j] - 1]; S.sp[j]--; S.sp[j - 1] += 10; pending = { k: 'new', list: 'sm' + (j - 1), n: 10, from: s2 }; return true; }
          return O.toast('There is no bundle to break.'); }
        else if (kind === 'trade') {
          for (var k = 0; k < top; k++) if (S.sp[k] >= 10) { var gh = (pos.sm[k] || []).slice(S.sp[k] - 10, S.sp[k]); S.sp[k] -= 10; S.sp[k + 1]++; pending = { k: 'merge', list: 'sm' + (k + 1), ghosts: gh, fill: color(k) }; return true; }
          var need = u.rate / z[top];
          if (S.sp[top] >= need) { var gh2 = (pos.sm[top] || []).slice(S.sp[top] - need, S.sp[top]); S.sp[top] -= need; S.b++; pending = { k: 'merge', list: 'big', ghosts: gh2, fill: color(top) }; return true; }
          return O.toast('You need ' + few(u.rate, u.s1, u.sl) + ' to make 1 ' + u.b1 + '. You have ' + few(sumS(S.sp), u.s1, u.sl) + '.');
        }
        else if (kind === 'breakS') { if (!S.sp[i] || i < 1) return false; var s5 = pos.sm[i] && pos.sm[i][S.sp[i] - 1]; S.sp[i]--; S.sp[i - 1] += 10; pending = { k: 'new', list: 'sm' + (i - 1), n: 10, from: s5 }; }
        else if (kind === 'tradeS') { /* 10 of one size become the next size, inside the small column */
          if (i >= top) return act('tradeBig', i);
          if (S.sp[i] < 10) return O.toast('You need 10 pieces of ' + lab(i) + ' to make 1 ' + lab(i + 1) + '. You have ' + S.sp[i] + '.');
          var g3 = (pos.sm[i] || []).slice(S.sp[i] - 10, S.sp[i]); S.sp[i] -= 10; S.sp[i + 1]++; pending = { k: 'merge', list: 'sm' + (i + 1), ghosts: g3, fill: color(i) }; return true; }
        else if (kind === 'tradeBig') { /* the whole small column is worth enough: a rate's worth of it becomes 1 big piece */
          var have = sumS(S.sp);
          if (have < u.rate) return O.toast('You need ' + few(u.rate, u.s1, u.sl) + ' to make 1 ' + u.b1 + '. You have ' + few(have, u.s1, u.sl) + '.');
          var ci = i == null ? top : i, g4 = (pos.sm[ci] || []).slice(Math.max(0, S.sp[ci] - 10), S.sp[ci]);
          S.sp = split(have - u.rate); S.b++; pending = { k: 'merge', list: 'big', ghosts: g4, fill: color(ci) }; return true; }
        else if (kind === 'toBoxB') { if (!S.b) return; var f = pos.big[S.b - 1]; S.b--; S.zb++; pending = { k: 'new', list: 'zb', n: 1, from: f }; }
        else if (kind === 'toBoxS') { if (!S.sp[i]) return; var f2 = pos.sm[i][S.sp[i] - 1]; S.sp[i]--; S.zp[i]++; pending = { k: 'new', list: 'zs' + i, n: 1, from: f2 }; }
        else if (kind === 'backB') { if (!S.zb) return; S.zb--; S.b++; }
        else if (kind === 'backS') { if (!S.zp[i]) return; S.zp[i]--; S.sp[i]++; }
        return true;
      }
      function color(i) { return [ORG, GRN, BLUE, VIO][i] || ORG; }
      function lab(i) { var z = SZ(); return O.fmt(z[i]) + ' ' + U().small; }
      function go(kind, i) { if (act(kind, i) === true) { api.redraw(); return true; } return false; }

      function draw() {
        fix();
        var u = U(), uh = escU(u), z = SZ(), top = z.length - 1, nar = narrow(api), W = nar ? 430 : 780, take = !!S.take, sc = Math.min(1, (api.stage.clientWidth || 800) / W), BHt = Math.max(28, 32 / sc), HIT = 44 / sc;
        cBig.parentNode.style.display = cSm.parentNode.style.display = cRate.parentNode.style.display = S.u === 'custom' ? '' : 'none';
        hint60.style.display = u.rate === 60 ? '' : 'none';
        tbI.parentNode.style.display = tsI.parentNode.style.display = take ? '' : 'none';
        api.say(take ? 'Drag pieces into the box to take them away. Need more ' + uh.sl + '? Drag 1 ' + uh.b1 + ' onto the ' + uh.Sm + ' column to break it.'
          : z.length > 1 ? 'Drag pieces onto the mat. Have 10 of a piece? Drop one on its own column to trade them for the next bigger piece. Have ' + few(u.rate, uh.s1, uh.sl) + '? Drag a piece up onto the ' + uh.B + ' column to trade for 1 ' + uh.b1 + '. To break, drag 1 ' + uh.b1 + ' onto the ' + uh.Sm + ' column.'
          : 'Drag pieces onto the mat. To trade, drag 1 ' + uh.s1 + ' up onto the ' + uh.B + ' column. To break, drag 1 ' + uh.b1 + ' onto the ' + uh.Sm + ' column.');
        /* layout */
        var bx = 8, bw = nar ? 140 : 210, sx = bx + bw + 8, sw = nar ? W - sx - 8 : (take ? 330 : W - sx - 8), boxR = null;
        var BR = 21, SRr = z.length > 1 ? 19 : 16, bPer = Math.max(1, Math.floor((bw - 12) / (BR * 2 + 6))), sPer = Math.max(1, Math.floor((sw - 12) / (SRr * 2 + 5)));
        var top0 = 120, bRows = Math.max(2, Math.ceil(S.b / bPer)), sRows = 0;
        z.forEach(function (s, i) { sRows += Math.max(i === 0 ? 1 : 0, Math.ceil(Math.min(S.sp[i], 60) / sPer)); }); sRows = Math.max(3, sRows);
        var btnRows = z.length > 1 && nar ? 2 : 1, btnH = btnRows * (BHt + 8) + 8;
        var areaH = Math.max(bRows * (BR * 2 + 6), sRows * (SRr * 2 + 5)) + 20, colH = 48 + areaH + btnH, H = top0 - 48 + colH + 8;
        var TY = Math.max(66, HIT + 10); /* tray height: the tray discs have a ≥ 44 css px hit area */
        top0 += TY - 66; H += TY - 66;
        if (take) { if (nar) { boxR = { x: 8, y: H + 4, w: W - 16, h: 150 }; H += 162; } else boxR = { x: sx + sw + 8, y: top0 - 48, w: W - (sx + sw + 8) - 8, h: colH }; }
        holder.innerHTML = '';
        var v = O.svg(W, H, holder, 'Trade mat with ' + u.bl + ' and ' + u.sl);
        /* tray */
        var trayG = O.s('g', { 'data-ui': 'tray' }, v), ty = TY / 2 + 4;
        O.s('rect', { x: 4, y: 4, width: W - 8, height: TY - 8, rx: 12, fill: '#F1EDFB' }, trayG);
        O.s('text', { x: 16, y: ty + 5, 'font-size': 14, fill: NAVY, text: 'Add:' }, trayG);
        pos.tray = [];
        var colB = { x: bx, y: top0 - 48, w: bw, h: colH }, colS = { x: sx, y: top0 - 48, w: sw, h: colH };
        var tg = disc(trayG, 72, ty, BR, VIO, '1 ' + u.big, HIT); pos.tray.push({ x: 72, y: ty });
        O.dragTap(v, tg, function () { go('addB'); }, function (p) { if (inR(p, colB)) return go('addB'); if (inR(p, colS)) O.toast('That is 1 ' + u.b1 + '. Put it in the ' + u.B + ' column, or tap Break.'); }, 'Add 1 ' + u.b1, 'tray-b');
        z.slice().reverse().forEach(function (s, k) { var i = z.length - 1 - k, x = 128 + k * Math.max(50, HIT + 4), d = disc(trayG, x, ty, SRr, color(i), lab(i), HIT); pos.tray.push({ x: x, y: ty });
          O.dragTap(v, d, function () { go('addS', i); }, function (p) { if (inR(p, colS)) return go('addS', i); if (inR(p, colB)) O.toast('Small pieces go in the ' + u.Sm + ' column. Trade ' + few(u.rate, u.s1, u.sl) + ' for 1 ' + u.b1 + '.'); }, 'Add ' + lab(i), 'tray-s' + i); });
        O.s('text', { x: W - 16, y: ty + 5, 'text-anchor': 'end', 'font-size': 14, fill: GRAY, class: 'ink om-num', text: '1 ' + u.big + ' = ' + O.fmt(u.rate) + ' ' + u.small }, trayG);
        /* columns */
        [[colB, u.B, VIO], [colS, u.Sm, color(top)]].forEach(function (c) {
          O.s('rect', { x: c[0].x, y: c[0].y, width: c[0].w, height: c[0].h, rx: 12, fill: '#fff', stroke: LINE, 'stroke-width': 2, class: 'paper' }, v);
          O.s('rect', { x: c[0].x, y: c[0].y, width: c[0].w, height: 34, rx: 12, fill: c[2] }, v);
          O.s('text', { x: c[0].x + c[0].w / 2, y: c[0].y + 23, 'text-anchor': 'middle', fill: inkOn(c[2]), 'font-size': 15, text: c[1] }, v);
        });
        O.s('text', { x: bx + bw / 2, y: top0 - 0, 'text-anchor': 'middle', 'font-size': 18, fill: VIO, class: 'om-num', text: String(S.b) }, v);
        O.s('text', { x: sx + sw / 2, y: top0 - 0, 'text-anchor': 'middle', 'font-size': 18, fill: top === 0 ? '#B4621A' : color(top), class: 'om-num', text: O.fmt(sumS(S.sp)) }, v);
        pos.big = []; pos.sm = z.map(function () { return []; }); var nodes = { big: [] };
        for (var d = 0; d < S.b; d++) { var x = bx + 6 + BR + 3 + (d % bPer) * (BR * 2 + 6), y = top0 + 14 + BR + Math.floor(d / bPer) * (BR * 2 + 6); pos.big.push({ x: x, y: y });
          var g = disc(v, x, y, BR, VIO, '1 ' + u.big, BR * 2 + 4); nodes.big.push(g);
          O.dragTap(v, g, function () { if (S.take) go('toBoxB'); else O.toast('Drag 1 ' + u.b1 + ' onto the ' + u.Sm + ' column to break it.'); }, function (p) { if (inR(p, boxR)) return go('toBoxB'); if (inR(p, colS)) return go('break'); if (inR(p, colB)) return false; return S.take ? false : go('subB'); }, S.take ? 'Move 1 ' + u.b1 + ' to the box' : 'Piece: 1 ' + u.b1, 'b' + d); }
        var row = 0;
        for (var i = top; i >= 0; i--) { nodes['sm' + i] = []; var n = Math.min(S.sp[i], 60);
          for (var e = 0; e < n; e++) { var x2 = sx + 6 + SRr + 3 + (e % sPer) * (SRr * 2 + 5), y2 = top0 + 14 + SRr + (row + Math.floor(e / sPer)) * (SRr * 2 + 5); pos.sm[i].push({ x: x2, y: y2 });
            var g2 = disc(v, x2, y2, SRr, color(i), lab(i), SRr * 2 + 3); nodes['sm' + i].push(g2);
            (function (i, e) { O.dragTap(v, g2, function () { if (S.take) go('toBoxS', i); else O.toast(z.length > 1 && i < top ? 'Have 10? Drop one on its own column to trade. Drag it onto the ' + u.B + ' column to trade ' + few(u.rate, u.s1, u.sl) + ' for 1 ' + u.b1 + '.' : 'Drag ' + lab(i) + ' onto the ' + u.B + ' column to trade.'); },
              function (p) {
                if (inR(p, boxR)) return go('toBoxS', i);
                if (inR(p, colB)) return go('tradeBig', i);                                   /* up onto the big column: a rate's worth becomes 1 big piece */
                if (inR(p, colS)) {                                                            /* its own column: 10 of a size trade up; otherwise a bundle breaks */
                  if (z.length === 1) return false;
                  if (i < top && S.sp[i] >= 10) return go('tradeS', i);
                  if (i > 0) return go('breakS', i);
                  O.toast('You need 10 pieces of ' + lab(0) + ' to trade. You have ' + S.sp[0] + '.'); return false;
                }
                return S.take ? false : go('subS', i);
              }, S.take ? 'Move ' + lab(i) + ' to the box' : 'Piece: ' + lab(i), 'sm' + i + '-' + e); })(i, e); }
          if (S.sp[i] > 60) O.s('text', { x: sx + sw - 10, y: top0 + 14 + (row + Math.ceil(n / sPer)) * (SRr * 2 + 5), 'text-anchor': 'end', 'font-size': 13, fill: GRAY, class: 'om-num', text: '+' + (S.sp[i] - 60) + ' more' }, v);
          row += Math.ceil(n / sPer); }
        /* column buttons */
        var by = colB.y + colB.h - btnH + 4;
        sbtn(v, bx + 8, by, 34, BHt, '−', GRAY, function () { go('subB'); }, 'Take away 1 ' + u.b1, 'btn-subB');
        sbtn(v, bx + 48, by, 34, BHt, '+', VIO, function () { go('addB'); }, 'Add 1 ' + u.b1, 'btn-addB');
        sbtn(v, bx + 88, by, bw - 96, BHt, nar ? 'Break' : 'Break ↓', YEL, function () { go('break'); }, 'Break 1 ' + u.b1 + ' into ' + few(u.rate, u.s1, u.sl), 'btn-break', !S.b);
        sbtn(v, sx + 8, by, 34, BHt, '−', GRAY, function () { go('subS', 0); }, 'Take away ' + lab(0), 'btn-subS');
        sbtn(v, sx + 48, by, 34, BHt, '+', color(0), function () { go('addS', 0); }, 'Add ' + lab(0), 'btn-addS');
        var canT = S.sp.some(function (c, k) { return k < top && c >= 10; }) || sumS(S.sp) >= u.rate;
        sbtn(v, sx + 88, by, nar ? sw - 96 : 110, BHt, nar ? 'Trade' : 'Trade ↑', YEL, function () { go('trade'); }, 'Trade small pieces for a bigger piece', 'btn-trade', !canT);
        var canBundle = S.sp.some(function (c, k) { return k > 0 && c > 0; });
        if (z.length > 1 && !nar) sbtn(v, sx + 206, by, Math.min(118, sw - 214), BHt, 'Break a bundle', '#fff', function () { go('bundle'); }, 'Break a bundle into 10 smaller pieces', 'btn-bundle', !canBundle);
        if (z.length > 1 && nar) sbtn(v, sx + 8, by + BHt + 8, sw - 16, BHt, 'Break a bundle', '#fff', function () { go('bundle'); }, 'Break a bundle into 10 smaller pieces', 'btn-bundle', !canBundle);
        /* take-away box */
        pos.zb = []; pos.zs = z.map(function () { return []; }); nodes.zb = [];
        if (take) {
          O.s('rect', { x: boxR.x, y: boxR.y, width: boxR.w, height: boxR.h, rx: 12, fill: '#FFF6D6', stroke: '#B88A00', 'stroke-width': 2, 'stroke-dasharray': '8 6' }, v);
          O.s('text', { x: boxR.x + boxR.w / 2, y: boxR.y + 24, 'text-anchor': 'middle', 'font-size': 15, fill: NAVY, text: 'Take away' }, v);
          O.s('text', { x: boxR.x + boxR.w / 2, y: boxR.y + 44, 'text-anchor': 'middle', 'font-size': 15, fill: '#8a6400', text: amt(+S.tb || 0, +S.ts || 0) }, v);
          var stp = SRr * 2 + 9, per = Math.max(1, Math.floor((boxR.w - 12) / stp)), k2 = 0;
          function place(r, fill, label, onTap, onDrop, list, key) { var x3 = boxR.x + 8 + SRr + 2 + (k2 % per) * stp, y3 = boxR.y + 74 + Math.floor(k2 / per) * stp; k2++;
            var g3 = disc(v, x3, y3, r, fill, label, stp - 2); list.push(g3); O.dragTap(v, g3, onTap, onDrop, 'Put ' + label + ' back', key); return { x: x3, y: y3 }; }
          for (var q = 0; q < S.zb; q++) pos.zb.push(place(SRr + 2, VIO, '1 ' + u.big, function () { go('backB'); }, function (p) { if (!inR(p, boxR)) return go('backB'); }, nodes.zb, 'zb' + q));
          for (var i3 = top; i3 >= 0; i3--) { nodes['zs' + i3] = []; for (var q2 = 0; q2 < Math.min(S.zp[i3], 40); q2++) (function (i3, q2) { pos.zs[i3].push(place(SRr, color(i3), lab(i3), function () { go('backS', i3); }, function (p) { if (!inR(p, boxR)) return go('backS', i3); }, nodes['zs' + i3], 'zs' + i3 + '-' + q2)); })(i3, q2); }
        }
        /* motion */
        if (pending) { var pd = pending; pending = null;
          if (pd.k === 'new' && pd.from) { var L = nodes[pd.list] || [], tgt = pd.list === 'big' ? pos.big : pd.list === 'zb' ? pos.zb : pd.list.indexOf('zs') === 0 ? pos.zs[+pd.list.slice(2)] : pos.sm[+pd.list.slice(2)];
            for (var a = Math.max(0, L.length - pd.n); a < L.length; a++) if (tgt[a]) fly(L[a], pd.from.x - tgt[a].x, pd.from.y - tgt[a].y); }
          if (pd.k === 'merge') { var L2 = nodes[pd.list] || [], tg2 = pd.list === 'big' ? pos.big : pos.sm[+pd.list.slice(2)], dst = tg2[L2.length - 1];
            if (dst) { (pd.ghosts || []).forEach(function (gp) { var gh = disc(v, gp.x, gp.y, SRr, pd.fill, ''); gh.style.pointerEvents = 'none'; fly(gh, 0, 0, { x: dst.x - gp.x, y: dst.y - gp.y }); });
              if (L2.length && !O.reduce) { var last = L2[L2.length - 1]; last.setAttribute('opacity', 0); setTimeout(function () { last.setAttribute('opacity', 1); }, 380); } } }
        }
        /* sentence + readout (html: every unit word is escaped) */
        var sm = sumS(S.sp), mat = S.b * u.rate + sm, zs = sumS(S.zp), box = S.zb * u.rate + zs, want = (+S.tb || 0) * u.rate + (+S.ts || 0), start = (+S.b0 || 0) * u.rate + (+S.s0 || 0), h = '', hint = '';
        var startH = amt(+S.b0 || 0, +S.s0 || 0, uh), takeH = amt(+S.tb || 0, +S.ts || 0, uh);
        if (take) {
          if (box === want && want > 0 && mat !== start - want) { h = startH + ' − ' + takeH + ' = ?'; hint = 'Pieces were added to or taken off the mat. Tap <b>Start over</b> to try again.'; }
          else if (box === want && want > 0) h = startH + ' − ' + takeH + ' = <span class="om-num">' + norm(mat, uh) + ' <span style="color:' + GRN + '">✓</span></span>';
          else { h = startH + ' − ' + takeH + ' = ?';
            if (box > want) hint = 'That is more than ' + takeH + ' in the box. Tap a piece in the box to put it back.';
            else { var need = want - box; if (need > mat) hint = 'There isn’t enough on the mat to take that away.';
              else if (need < u.rate && sm < need && S.b > 0) hint = 'Not enough ' + uh.sl + ' on the mat? Break 1 ' + uh.b1 + ' into ' + few(u.rate, uh.s1, uh.sl) + '.';
              else if (z.length > 1 && need < z[1] && S.sp[0] < need && S.sp.some(function (c, k) { return k > 0 && c > 0; })) hint = 'Need ' + O.esc(lab(0)) + ' pieces? Drag a ' + O.esc(lab(1)) + ' piece a little way inside its column and let go: it breaks into ten ' + O.esc(lab(0)) + ' pieces.'; } }
        } else {
          h = '<span class="om-num">' + amt(S.b, sm, uh);
          if (sm >= u.rate) h += ' = ' + norm(mat, uh) + ' <span style="font-size:.85em;color:#B45309">(trade ' + few(u.rate, uh.s1, uh.sl) + ' for 1 ' + uh.b1 + ')</span>';
          else if (S.b && sm) h += ' = ' + O.fmt(mat) + ' ' + uh.small;
          h += '</span>';
        }
        sent.innerHTML = h + (hint ? '<div style="font-size:.85em;color:#B45309;margin-top:.3rem">' + hint + '</div>' : '');
        api.readout('<span>On the mat: <b>' + amt(S.b, sm, uh) + '</b> (' + O.fmt(mat) + ' ' + uh.small + ')</span>' + (take ? '<span>In the box: <b>' + amt(S.zb, zs, uh) + '</b></span>' : ''));
        api.report({ v: String(mat), b: String(S.b), s: String(sm), z: S.zb + ' ' + zs });
      }
      api.onRedraw(draw);
      var rt; api.onResize(function () { clearTimeout(rt); rt = setTimeout(function () { if (holder.isConnected) { var f = O.focusKey(api.stage); draw(); O.refocus(api.stage, f); } }, 150); });
    }
  });

  /* ═════════════ BAR STRIP ═════════════ */
  /* an svg label; "3/4" is drawn as a stacked fraction */
  function fracLabel(v, x, y, t, fs, fill) { var m = String(t).match(/^(\d+)\/(\d+)$/);
    if (!m) { O.s('text', { x: x, y: y + fs * 0.35, 'text-anchor': 'middle', 'font-size': fs, fill: fill, text: t, style: 'pointer-events:none' }, v); return; }
    O.s('text', { x: x, y: y - 2, 'text-anchor': 'middle', 'font-size': fs * 0.85, fill: fill, text: m[1], style: 'pointer-events:none' }, v);
    O.s('line', { x1: x - fs * 0.45, y1: y + 1, x2: x + fs * 0.45, y2: y + 1, stroke: fill, 'stroke-width': 1.6 }, v);
    O.s('text', { x: x, y: y + fs * 0.85, 'text-anchor': 'middle', 'font-size': fs * 0.85, fill: fill, text: m[2], style: 'pointer-events:none' }, v); }
  O.register('barstrip', {
    defaults: { mode: 'fill', unit: 'in', whole: 12, wl: '1 ft', piece: 1, pl: '', p2: 0, p2l: '', hide: 0, pa: [], pb: [], a: 77, al: '6 ft 5 in', b: 79, bl: '79 in', act: 0 },
    mount: function (api) {
      var S = api.S;
      var BCLR = { pa: [], pb: [], act: 0 };
      api.quick([['Inches in a foot', Object.assign({ mode: 'fill', unit: 'in', whole: 12, wl: '1 ft', piece: 1, pl: '', p2: 0, p2l: '', hide: 1 }, BCLR)],
        ['Feet in a yard', Object.assign({ mode: 'fill', unit: 'ft', whole: 3, wl: '1 yd', piece: 1, pl: '', p2: 0, p2l: '', hide: 1 }, BCLR)],
        ['Fourths of a whole', Object.assign({ mode: 'fill', unit: '', whole: 1, wl: '1 whole', piece: 0.25, pl: '1/4', p2: 0, p2l: '', hide: 0 }, BCLR)],
        ['Compare two lengths', Object.assign({ mode: 'compare', unit: 'in', piece: 1, pl: '', p2: 12, p2l: '1 ft', a: 77, al: '6 ft 5 in', b: 79, bl: '79 in', hide: 1 }, BCLR)]]);
      api.check('Hide the answer (no scale numbers, no total) until the bars are built', 'hide');
      api.button('Clear the pieces', function () { S.pa = []; S.pb = []; api.redraw(); }, '', api.row());
      api.more('More options');
      api.seg('What to do', 'mode', [['fill', 'Fill one bar'], ['compare', 'Compare two amounts']], function () { S.pa = []; S.pb = []; S.act = 0; });
      api.heading('Pieces');
      api.num('Small piece size', 'piece', 0.05, 1000, 0.05, function () { S.pa = []; S.pb = []; });
      api.text('Unit (in, cm, ft, or blank)', 'unit');
      api.text('Small piece label (optional, like 1/4)', 'pl', null, 'auto');
      api.num('Big piece size (0 = none)', 'p2', 0, 1000, 1, function () { S.pa = []; S.pb = []; });
      api.text('Big piece label', 'p2l', null, 'like 1 ft');
      api.heading('Fill one bar');
      var wI = api.num('Bar length (in small units)', 'whole', 1, 1000, 1, function () { S.pa = []; });
      var wlI = api.text('Bar name', 'wl', null, 'like 1 ft');
      api.heading('Compare two amounts');
      var aI = api.num('Amount 1 (in small units)', 'a', 1, 1000, 1, function () { S.pa = []; }), alI = api.text('Amount 1 as written', 'al');
      var bI = api.num('Amount 2 (in small units)', 'b', 1, 1000, 1, function () { S.pb = []; }), blI = api.text('Amount 2 as written', 'bl');
      api.endMore();
      var holder = O.el('div'); api.stage.appendChild(holder);
      var sent = O.el('div', { style: 'margin-top:.6rem;font-weight:800;font-size:1.2rem;color:#0E1C42;min-height:1.6em', 'aria-live': 'polite' }); api.stage.appendChild(sent);
      var pending = null;
      function sum(a) { return a.reduce(function (t, x) { return t + x; }, 0); }
      function r3(x) { return Math.round(x * 1000) / 1000; }
      function plab(sz) { if (sz === +S.p2 && S.p2l) return String(S.p2l); if (sz === +S.piece && S.pl) return String(S.pl); return O.fmt(sz) + (S.unit ? ' ' + S.unit : ''); }
      function un(x) { return O.fmt(r3(x)) + (S.unit ? ' ' + S.unit : ''); }
      /* a piece whose label is "n/d" is a fraction piece: [n, d] */
      function fracOf(sz) { var m = String(plab(sz)).match(/^(\d+)\/(\d+)$/); return m && +m[2] ? [+m[1], +m[2]] : null; }
      /* html copies: escaped, and fractions stacked */
      function plabH(sz) { var f = fracOf(sz); return f ? O.frac(f[0], f[1]) : O.esc(plab(sz)); }
      function totH(x) { var f = fracOf(+S.piece); if (f && !S.unit && +S.piece) { var N = x / +S.piece * f[0]; if (Math.abs(N - Math.round(N)) < 1e-6) return O.mixed(Math.round(N), f[1]); } return O.esc(un(x)); }
      function nameH(bi) { return O.esc(String(bi === 0 ? S.al : S.bl)); }
      function cap(bi) { return S.mode === 'fill' ? +S.whole : bi === 0 ? +S.a : +S.b; }
      function list(bi) { return bi === 0 ? S.pa : S.pb; }
      function add(bi, sz) {
        var L = list(bi), c = cap(bi), have = sum(L);
        if (S.mode === 'fill' && r3(have + sz) > c) return O.toast(r3(c - have) > 0 ? 'That piece won’t fit. There is ' + un(c - have) + ' left.' : 'The bar is full.');
        if (S.mode === 'compare' && r3(have + sz) > Math.max(+S.a, +S.b) * 1.25 + sz) return O.toast('That is much more than either amount.');
        L.push(sz); pending = { bi: bi }; api.redraw();
      }
      function pop(bi) { var L = list(bi); if (L.length) { L.pop(); api.redraw(); } }
      function draw() {
        var cmp = S.mode === 'compare', nar = narrow(api), W = nar ? 430 : 780, M = 18, piece = +S.piece || 1, p2 = +S.p2 || 0, sc = Math.min(1, (api.stage.clientWidth || 800) / W), HIT = 44 / sc;
        [wI, wlI].forEach(function (i) { i.parentNode.style.display = cmp ? 'none' : ''; });
        [].forEach.call(api.setup.querySelectorAll('h3'), function (h) { if (/^Fill one bar$/i.test(h.textContent)) h.style.display = cmp ? 'none' : ''; if (/^Compare two amounts$/i.test(h.textContent)) h.style.display = cmp ? '' : 'none'; }); [aI, alI, bI, blI].forEach(function (i) { i.parentNode.style.display = cmp ? '' : 'none'; });
        api.say(cmp ? 'Drag pieces onto each bar to build each amount. Then see which bar is longer. Drag a piece off a bar to take it away.' : 'Drag pieces onto the bar to fill it from left to right. Drag a piece off the bar to take it away.');
        var bars = cmp ? [0, 1] : [0], maxLen = cmp ? Math.max(+S.a, +S.b) * 1.12 : +S.whole, sc2 = (W - 2 * M) / maxLen, built = bars.map(function (bi) { return r3(sum(list(bi))) === r3(cap(bi)); });
        var reveal = !S.hide || built.every(Boolean), trayH = Math.max(64, HIT + 20), BH = 56, gap = cmp ? 48 : 30, H = trayH + 16 + bars.length * (BH + gap) + 34;
        holder.innerHTML = '';
        var v = O.svg(W, H, holder, cmp ? 'Two bars to compare' : 'A bar to fill with pieces');
        var trayG = O.s('g', { 'data-ui': 'tray' }, v);
        O.s('rect', { x: 4, y: 4, width: W - 8, height: trayH - 8, rx: 12, fill: '#F1EDFB' }, trayG);
        O.s('text', { x: 16, y: trayH / 2 + 5, 'font-size': 14, fill: NAVY, text: 'Pieces:' }, trayG);
        var rows = bars.map(function (bi, k) { return { x: M, y: trayH + 16 + k * (BH + gap) + (cmp ? 22 : 0), w: maxLen * sc2, h: BH }; });
        var tx = 80;
        [[piece, ORG]].concat(p2 ? [[p2, VIO]] : []).forEach(function (pc, pi) { var pw = Math.max(34, Math.min(pc[0] * sc2, 200)), g = O.s('g', {}, trayG), py = trayH / 2 - 17;
          O.s('rect', { x: tx, y: py, width: pw, height: 34, rx: 6, fill: pc[1], stroke: '#fff', 'stroke-width': 2 }, g); fracLabel(g, tx + pw / 2, py + 17, plab(pc[0]), 13, inkOn(pc[1]));
          var hw = Math.max(pw, HIT), hh = Math.max(34, HIT); hit(g, tx + pw / 2 - hw / 2, py + 17 - hh / 2, hw, hh);
          O.dragTap(v, g, function () { add(cmp ? S.act : 0, pc[0]); }, function (p) { var hit = -1; rows.forEach(function (r, k) { if (p.y >= r.y - 14 && p.y <= r.y + r.h + 14) hit = k; }); if (hit >= 0) { S.act = hit; add(hit, pc[0]); return true; } }, 'Add a ' + plab(pc[0]) + ' piece', 'tray' + pi);
          tx += Math.max(pw, HIT) + 14; });
        bars.forEach(function (bi, k) {
          var r = rows[k], L = list(bi), c = cap(bi), x = r.x;
          if (cmp) { var lb = O.s('text', { x: r.x, y: r.y - 8, 'font-size': 14.5, fill: S.act === k ? VIO : NAVY, class: S.act === k ? '' : 'ink', text: (S.act === k ? '▶ ' : '') + (bi === 0 ? S.al : S.bl) + (built[k] ? '  ✓ built' : '') }, v);
            O.tap(lb, function () { S.act = k; api.redraw(); }, 'Build ' + (bi === 0 ? S.al : S.bl), 'lab' + k); }
          /* the bar outline: to scale unless it would give the answer away */
          var showOutline = !cmp || !S.hide || built[k];
          var track = O.s('rect', { x: r.x, y: r.y, width: (showOutline ? c : maxLen) * sc2, height: r.h, rx: 6, fill: showOutline ? '#fff' : '#F7F8FC', stroke: showOutline ? NAVY : LINE, 'stroke-width': showOutline ? 2.5 : 1.5, 'stroke-dasharray': showOutline ? '' : '6 5', class: 'paper' }, v);
          O.tap(track, function () { S.act = k; if (!cmp) add(0, piece); else api.redraw(); }, cmp ? 'Choose this bar' : 'Add a piece', 'track' + k);
          var nodes = [];
          L.forEach(function (sz, i) { var w = sz * sc2, g = O.s('g', {}, v), fill = sz === p2 && p2 ? VIO : ORG; O.s('rect', { x: x, y: r.y + 4, width: Math.max(1, w), height: r.h - 8, rx: 3, fill: fill, stroke: '#fff', 'stroke-width': w > 6 ? 2 : 0.6 }, g);
            if (w > 26) fracLabel(g, x + w / 2, r.y + r.h / 2, plab(sz), w > 44 ? 13 : 10.5, inkOn(fill));
            (function (i) { O.dragTap(v, g, function () { S.act = k; pop(bi); }, function (p) { var hit = -1; rows.forEach(function (r2, k2) { if (p.y >= r2.y - 14 && p.y <= r2.y + r2.h + 14) hit = k2; });
              if (hit === k) return false; var szz = L.splice(i, 1)[0]; if (hit >= 0) { S.act = hit; list(bars[hit]).push(szz); } api.redraw(); return true; }, 'Take off the last piece', 'bar' + k + '-' + i); })(i);
            nodes.push(g); x += w; });
          if (pending && pending.bi === bi && nodes.length) { var ln = nodes[nodes.length - 1]; fly(ln, 0, -(r.y - 30)); }
          /* scale (the numbers are totals, so Hide totals hides them too) */
          var step = piece, major = p2 || (c % 12 === 0 && S.unit === 'in' ? 12 : c <= 20 ? 1 : 10);
          if (reveal) { for (var t = 0; r3(t) <= r3(maxLen); t = r3(t + step)) { var isM = r3(t / major) === Math.round(t / major), tx2 = r.x + t * sc2; if (!isM && nar) continue; if (!isM && step * sc2 < 3) continue;
              O.s('line', { x1: tx2, y1: r.y + r.h, x2: tx2, y2: r.y + r.h + (isM ? 12 : 6), stroke: GRAY, 'stroke-width': isM ? 1.6 : 1, class: 'inks' }, v);
              if (isM) O.s('text', { x: tx2, y: r.y + r.h + 25, 'text-anchor': 'middle', 'font-size': 11.5, fill: GRAY, class: 'ink om-num', text: O.fmt(r3(t)) }, v); } }
          if (!cmp) { /* "1 ft = 12 in": the name stays, the number part is a total (hidden with Hide totals, and with S.hide until built) */
            var lt = O.s('text', { x: r.x + c * sc2, y: r.y - 8, 'text-anchor': 'end', 'font-size': 15, fill: NAVY, class: 'ink' }, v);
            O.s('tspan', { text: String(S.wl) }, lt);
            if (S.hide && !built[0]) O.s('tspan', { text: ' = ? ' + (S.unit || 'pieces') }, lt);
            else if (S.unit) O.s('tspan', { class: 'om-num', text: ' = ' + un(c) }, lt);
          }
        });
        pending = null;
        /* sentence (html: labels escaped, fractions stacked) */
        var h = '', L0 = S.pa, n0 = L0.length, w0 = sum(L0);
        function terms(L) { var c2 = {}; L.forEach(function (x) { c2[x] = (c2[x] || 0) + 1; }); return Object.keys(c2).sort(function (a, b) { return b - a; }).map(function (x) { return c2[x] + ' × ' + plabH(+x); }).join(' + '); }
        var cmpRes = '', wlH = O.esc(String(S.wl));
        if (!cmp) {
          if (!n0) h = S.hide ? 'How many pieces fill ' + wlH + '?' : 'Fill ' + wlH + ' with pieces.';
          else h = terms(L0) + ' = ' + (built[0] ? '<span class="om-num">' + wlH + ' <span style="color:' + GRN + '">✓ It’s full!</span></span>' : '<span class="om-num">' + totH(w0) + '</span>');
          if (!built[0] && n0 && r3(+S.whole - w0) < piece && r3(+S.whole - w0) > 0) h += '<div style="font-size:.85em;color:#B45309">The last space is smaller than a piece: <span class="om-num">' + totH(+S.whole - w0) + '</span> left over.</div>';
        } else {
          h = [0, 1].map(function (bi) { var L = list(bi); return nameH(bi) + ': ' + (L.length ? terms(L) : '—') + (r3(sum(L)) > r3(cap(bi)) ? ' <span style="color:#B45309;font-size:.85em">(that’s more than ' + nameH(bi) + ' — tap the last piece to take it off)</span>' : ''); }).join('<br>');
          if (built[0] && built[1]) { var d = r3(+S.a - +S.b); cmpRes = d > 0 ? '1' : d < 0 ? '2' : 'same';
            h += '<br><span class="om-num">' + (d ? (d > 0 ? nameH(0) : nameH(1)) + ' is longer, by ' + totH(Math.abs(d)) + '.' : 'They are the same length.') + ' <span style="color:' + GRN + '">✓</span></span>'; }
        }
        sent.innerHTML = h;
        api.readout(cmp ? '<span>Bar 1: <b>' + totH(sum(S.pa)) + '</b></span><span>Bar 2: <b>' + totH(sum(S.pb)) + '</b></span>' : '<span>Pieces: <b>' + n0 + '</b></span><span>Length: <b>' + totH(w0) + '</b></span>');
        api.report({ v: String(n0), w: String(r3(w0)), c: cmpRes });
      }
      api.onRedraw(draw);
      var rt; api.onResize(function () { clearTimeout(rt); rt = setTimeout(function () { if (holder.isConnected) { var f = O.focusKey(api.stage); draw(); O.refocus(api.stage, f); } }, 150); });
    }
  });
})();
