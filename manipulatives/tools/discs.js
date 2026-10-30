/* Number Discs on a place-value chart (Dimensions kit: Place Value Discs, 4-value and 10-value) */
(function () {
  var O = OAOM;
  var COL = { 6: '#7A5230', 5: '#138A8A', 4: '#D6457A', 3: '#7C4DFF', 2: '#2F6FDE', 1: '#23915A', 0: '#F08A24', '-1': '#C99A00', '-2': '#C2410C', '-3': '#5B6478' };
  var NAME = { 6: ['Millions', 'million'], 5: ['Hundred Thousands', 'hundred thousand'], 4: ['Ten Thousands', 'ten thousand'], 3: ['Thousands', 'thousand'], 2: ['Hundreds', 'hundred'], 1: ['Tens', 'ten'], 0: ['Ones', 'one'], '-1': ['Tenths', 'tenth'], '-2': ['Hundredths', 'hundredth'], '-3': ['Thousandths', 'thousandth'] };
  var SHORT = { 6: 'M', 5: 'HTh', 4: 'TTh', 3: 'Th', 2: 'H', 1: 'T', 0: 'O', '-1': 't', '-2': 'h', '-3': 'th' };
  function label(e) { return e >= 0 ? O.fmt(Math.pow(10, e)) : '0.' + '0'.repeat(-e - 1) + '1'; }
  function plural(e, n) { var w = NAME[e][1]; return n + ' ' + (n === 1 ? w : w.replace(/(thousand|hundred|million)$/, '$1') + 's'); }
  /* value as string, exact (counts * 10^e summed as integer of 10^lo) */
  function valueStr(S) {
    var lo = S.lo, tot = 0n;
    for (var e = S.hi; e >= lo; e--) tot += BigInt(S.c[e] || 0) * (10n ** BigInt(e - lo));
    var str = tot.toString();
    if (lo >= 0) { str = str + '0'.repeat(lo); return Number(str).toLocaleString('en-US'); }
    var dp = -lo; while (str.length <= dp) str = '0' + str;
    var ip = str.slice(0, str.length - dp), fp = str.slice(str.length - dp);
    return Number(ip).toLocaleString('en-US') + '.' + fp;
  }

  O.register('discs', {
    defaults: { hi: 3, lo: 0, c: {}, cap: 1 },
    mount: function (api) {
      var S = api.S;
      function places() { var a = []; for (var e = S.hi; e >= S.lo; e--) a.push(e); return a; }
      function n(e) { return S.c[e] || 0; }
      api.say('Tap <b>+</b> to add a disc. Tap a disc to break it into 10 smaller discs. Tap <b>Trade 10</b> to make 10 discs into 1 bigger disc.');

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
        mountSetup(); api.redraw();
      }
      function mountSetup() { /* keep selects in sync after setNumber */ var sels = api.setup.querySelectorAll('select'); if (sels[0]) sels[0].value = S.hi; if (sels[1]) sels[1].value = S.lo; }

      var W = 132, HEAD = 64, ROWH = 40, ROWS = 5, PER = 4, top = HEAD + 34, areaH = ROWS * ROWH + 14, BTN = top + areaH + 10, H = BTN + 50;
      var holder = O.el('div'); api.stage.appendChild(holder);
      function draw() {
        holder.innerHTML = '';
        var P = places(), w = P.length * W + 8;
        var v = O.svg(w, H, holder, 'Place-value chart with number discs');
        P.forEach(function (e, i) {
          var x = 4 + i * W, col = COL[e];
          O.s('rect', { x: x + 3, y: 4, width: W - 6, height: H - 8, rx: 12, fill: '#fff', stroke: '#D9DEEA', 'stroke-width': 2, class: 'paper' }, v);
          O.s('rect', { x: x + 3, y: 4, width: W - 6, height: HEAD - 4, rx: 12, fill: col }, v);
          O.s('rect', { x: x + 3, y: HEAD - 16, width: W - 6, height: 12, fill: col }, v);
          if (S.cap) O.s('text', { x: x + W / 2, y: 26, 'text-anchor': 'middle', fill: '#fff', 'font-size': NAME[e][0].length > 12 ? 11.5 : 14, text: NAME[e][0] }, v);
          O.s('text', { x: x + W / 2, y: S.cap ? 48 : 38, 'text-anchor': 'middle', fill: '#fff', 'font-size': S.cap ? 13 : 18, text: S.cap ? label(e) : SHORT[e] }, v);
          /* count */
          var cnt = O.s('text', { x: x + W / 2, y: HEAD + 24, 'text-anchor': 'middle', 'font-size': 20, fill: col, class: 'om-num', text: String(n(e)) }, v);
          /* discs */
          var k = n(e), show = Math.min(k, ROWS * PER);
          for (var d = 0; d < show; d++) {
            var cx = x + 22 + (d % PER) * 29.5, cy = top + 18 + Math.floor(d / PER) * ROWH;
            var g = O.s('g', {}, v);
            O.s('circle', { cx: cx, cy: cy, r: 15, fill: col, stroke: '#fff', 'stroke-width': 2 }, g);
            var lb = label(e); O.s('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', fill: '#fff', 'font-size': lb.length > 5 ? 6.5 : lb.length > 3 ? 8 : 11, text: lb }, g);
            (function (e) { O.tap(g, function () { breakDisc(e); }, 'Break one ' + label(e) + ' disc into 10 smaller discs'); })(e);
            if (e === S.lo) { g.classList.remove('om-tap'); g.style.cursor = 'default'; }
          }
          if (k > show) O.s('text', { x: x + W / 2, y: top + areaH - 2, 'text-anchor': 'middle', 'font-size': 13, fill: '#5B6478', class: 'ink', text: '+' + (k - show) + ' more' }, v);
          /* buttons */
          btn(v, x + 24, BTN + 20, '−', '#5B6478', function () { if (n(e) > 0) { S.c[e] = n(e) - 1; api.redraw(); } }, 'Take away one ' + label(e) + ' disc');
          btn(v, x + 66, BTN + 20, '+', col, function () { if (n(e) >= 40) { O.toast('That column is full. Trade 10 discs for 1 bigger disc.'); return; } S.c[e] = n(e) + 1; api.redraw(); }, 'Add one ' + label(e) + ' disc');
          if (e < S.hi) {
            var can = n(e) >= 10;
            var tg = O.s('g', { opacity: can ? 1 : .35 }, v);
            O.s('rect', { x: x + 86, y: BTN + 4, width: 40, height: 32, rx: 9, fill: can ? '#F2B705' : '#E7E9F0' }, tg);
            O.s('text', { x: x + 106, y: BTN + 17, 'text-anchor': 'middle', 'font-size': 9.5, fill: '#0E1C42', text: 'Trade' }, tg);
            O.s('text', { x: x + 106, y: BTN + 29, 'text-anchor': 'middle', 'font-size': 9.5, fill: '#0E1C42', text: '10 ⇧' }, tg);
            (function (e) { O.tap(tg, function () { if (n(e) < 10) { O.toast('You need 10 discs here to trade.'); return; } S.c[e] = n(e) - 10; S.c[e + 1] = n(e + 1) + 1; api.redraw(); }, 'Trade 10 ' + label(e) + ' discs for 1 ' + label(e + 1) + ' disc'); })(e);
          }
        });
        /* readout */
        var P2 = places(), parts = [], words = [];
        P2.forEach(function (e) { if (n(e)) { parts.push(n(e) === 1 ? label(e) : n(e) + ' × ' + label(e)); } words.push(plural(e, n(e))); });
        var over = P2.some(function (e) { return n(e) >= 10; });
        api.readout('<span>Value: <b>' + valueStr(S) + '</b></span><span>' + words.join(', ') + '</span>' + (over ? '<span style="color:#B45309">A column has 10 or more. Can you trade?</span>' : ''));
      }
      function breakDisc(e) { if (e <= S.lo) { O.toast('This is the smallest place on the chart.'); return; } if (n(e - 1) + 10 > 40) { O.toast('No room. Trade some discs first.'); return; } S.c[e] = n(e) - 1; S.c[e - 1] = n(e - 1) + 10; api.redraw(); }
      function btn(v, cx, cy, t, fill, fn, lab) { var g = O.s('g', {}, v); O.s('circle', { cx: cx, cy: cy, r: 16, fill: fill }, g); O.s('text', { x: cx, y: cy + 7, 'text-anchor': 'middle', fill: '#fff', 'font-size': 22, text: t }, g); O.tap(g, fn, lab); }
      api.onRedraw(draw);
    }
  });
})();
