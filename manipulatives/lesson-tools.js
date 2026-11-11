/* "Math tools for this lesson": one line in a lesson page, <script src="manipulatives/lesson-tools.js" defer></script>.
   Shows the tools tagged for that lesson in manipulatives/data.js in two places (Bethany, 3 Nov 2026):
   - a compact row at the top of the first tab (right under the Essential Question and objectives),
   - a full card with each tool's picture and what it is for, above the footer.
   The lesson id comes from the file name (math-lesson-4-06-02-… → 4.06.02). Links are student links (no way back to the library). */
(function () {
  var m = /math-lesson-(\d)-(\d\d)-(\d\d)/.exec(location.pathname); if (!m) return;
  var lid = m[1] + '.' + m[2] + '.' + m[3];
  var me = document.currentScript, base = me && me.src ? me.src.replace(/[^\/]*$/, '') : 'manipulatives/';
  /* One step at a time (11 Nov 2026): on the three sparkle layers (G3 Storybook, G4 classical guide, G5 Master Builders) one part
     of a tab shows at a time, with Back / Next and "Step 3 of 21". The code is onestep-math.js, next to this file. ?steps=0 = off. */
  (function () {
    function go() {
      if (window.__osMath || /[?&]steps=0\b/.test(location.search)) return;
      if (!document.querySelector('body.sb .sb-panel, .bd-panel, .tab-panel .cw-slot, .tab-panel .cw-station')) return;
      var s = document.createElement('script'); s.src = base + 'onestep-math.js?v=2'; document.head.appendChild(s);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  })();
  function enc(o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var CSS = '.olt{font-family:Nunito,Arial,sans-serif;font-size:17px;color:#0E1C42;border-radius:16px;background:#FFFFFF;border:2px solid #C9BCEB;box-shadow:0 6px 18px rgba(14,28,66,.08)}'
    + '.olt-full{margin:22px auto 8px;max-width:960px;padding:16px 18px}'
    + '.olt-pro{margin:10px 0 0;padding:8px 12px;background:#FFF8E1;border:1.5px dashed #E0B44A;border-radius:10px;font-size:15px;line-height:1.4;color:#3B2A0A}'
    + '.olt-top{margin:4px 0 18px;padding:12px 14px}'
    + '.olt-hd{display:flex;gap:.7rem;align-items:center;flex-wrap:wrap}.olt-hd>div{flex:1;min-width:190px}'
    + '.olt-badge{width:38px;height:38px;border-radius:11px;background:#6B46C1;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;flex:0 0 auto;box-shadow:0 2px 0 #4c2f93}'
    + '.olt-t{font-weight:900;color:#0E1C42;font-size:1.2em;line-height:1.25}.olt-s{color:#1F2A44;font-size:1em;font-weight:700;line-height:1.35}'
    + '.olt-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;margin-top:12px}'
    + '.olt-top .olt-grid{grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-top:10px}'
    + '.olt-tile{display:flex;gap:12px;align-items:center;padding:12px 14px;background:#FBFAFF;border:2px solid #C9BCEB;border-radius:14px;text-decoration:none;color:#1B2238;transition:transform .15s,border-color .15s,box-shadow .15s;min-height:56px}'
    + '.olt-tile:hover,.olt-tile:focus-visible{transform:translateY(-2px);border-color:#6B46C1;box-shadow:0 6px 14px rgba(107,70,193,.18);outline:none}'
    + '.olt-ic{flex:0 0 auto;width:44px;height:44px;border-radius:10px;background:#F7F4FD;display:flex;align-items:center;justify-content:center}.olt-ic svg{width:38px;height:38px}'
    + '.olt-top .olt-ic{width:36px;height:36px}.olt-top .olt-ic svg{width:30px;height:30px}'
    + '.olt-n{font-weight:900;color:#0E1C42;font-size:1.06em;line-height:1.25}.olt-w{display:block;font-size:.95em;color:#1F2A44;font-weight:600;line-height:1.4;margin-top:3px}'
    + '.olt-go{margin-left:auto;font-weight:900;color:#4C2F93;font-size:1.25em}'
    + '.olt-all{display:inline-flex;align-items:center;gap:.4em;margin-top:12px;border-radius:999px;padding:.45em 1em;font-weight:800;color:#fff;background:#0E1C42;text-decoration:none;min-height:40px}'
    + '.olt-all:hover,.olt-all:focus-visible{background:#1F2F55;outline:3px solid #F2B705}'
    + '.olt-top .olt-all{margin-top:0;margin-left:auto;font-size:.9em;min-height:34px}'
    + '.olt-drawer{margin:4px 0 16px;padding:0;border-width:1.5px;box-shadow:none}'
    + '.olt-drawer>summary{list-style:none;display:flex;align-items:center;gap:10px;padding:8px 14px;cursor:pointer;font-weight:800;font-size:15px;color:#0E1C42}'
    + '.olt-drawer>summary::-webkit-details-marker{display:none}'
    + '.olt-dr-ic{display:flex;gap:6px}.olt-dr-ic span{width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:#F7F4FD;border-radius:7px}.olt-dr-ic svg{width:22px;height:22px}'
    + '.olt-dr-more{margin-left:auto;font-size:13px;color:#4C2F93;border:1.5px solid #C9BCEB;border-radius:999px;padding:2px 10px}'
    + '.olt-drawer[open]>summary{border-bottom:1px solid #E6E0F5}'
    + '.olt-dr-b{padding:4px 14px 14px}.olt-dr-b .olt-all{margin-top:10px}'
    + '.olt-learn{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin:10px 0 0;font-size:15px;font-weight:700;color:#1F2A44}'
    + '.olt-learn a{display:inline-flex;align-items:center;gap:.4em;padding:.35em .9em;border-radius:999px;background:#F3EEFF;border:2px solid #D8C8FF;color:#5B34C7;font-weight:800;text-decoration:none;min-height:36px}'
    + '.olt-learn a:hover,.olt-learn a:focus-visible{border-color:#6B46C1;background:#fff;outline:none}'
    + '.olt-nudge{margin:12px 0}'
    + '.olt-nudge a{display:inline-flex;align-items:center;gap:.5em;background:#F7F4FD;border:2px solid #C9BCEB;border-radius:999px;padding:.5em 1.05em;font-weight:800;color:#4C2F93;text-decoration:none;font-size:1em;line-height:1.3;min-height:40px}'
    + '.olt-nudge a:hover,.olt-nudge a:focus-visible{border-color:#6B46C1;background:#FFFFFF;box-shadow:0 4px 12px rgba(107,70,193,.18);outline:none}';
  function build() {
    var D = window.OAOM_DATA; if (!D) return; var L = D.lessonById(lid); if (!L || !L.tools.length) return;
    var I = window.OAOM_ICONS || {}, names = {}; D.tools.forEach(function (t) { names[t.id] = t; });
    if (!document.getElementById('olt-css')) { var st = document.createElement('style'); st.id = 'olt-css'; st.textContent = CSS; document.head.appendChild(st); }
    var all = base + 'tool.html?lesson=' + encodeURIComponent(lid) + '&st=1';
    function tiles(full) {
      return '<div class="olt-grid">' + L.tools.map(function (t) {
        var n = names[t.t] || { name: t.t, what: '' }, url = base + 'tool.html?t=' + encodeURIComponent(t.t) + '&st=1' + (t.p ? '#s=' + enc(t.p) : '');
        var tip = t.s || n.what || '';
        return '<a class="olt-tile" href="' + esc(url) + '" target="_blank" rel="noopener" title="' + esc(n.what || '') + '"><span class="olt-ic">' + (I[t.t] || '🧮') + '</span>'
          + '<span><span class="olt-n">' + esc(n.name) + '</span>' + (full && tip ? '<span class="olt-w">' + esc(tip) + '</span>' : '') + '</span><span class="olt-go" aria-hidden="true">↗</span></a>';
      }).join('') + '</div>';
    }
    /* "Learn to use this tool" videos (Bethany, 4 Nov 2026): opens the tool with its 1-minute student video drawer open */
    function learn() { var SV = D.stuvid || {}, has = L.tools.filter(function (t) { return SV[t.t]; }); if (!has.length) return '';
      return '<div class="olt-learn"><span>New to a tool? Watch a 1-minute video:</span>' + has.map(function (t) { var n = names[t.t] || { name: t.t };
        return '<a href="' + esc(base + 'tool.html?t=' + encodeURIComponent(t.t) + '&st=1&learn=1') + '" target="_blank" rel="noopener">▶ ' + esc(n.name) + '</a>'; }).join('') + '</div>'; }
    // full card above the footer
    var bar = document.createElement('section'); bar.className = 'oao-lesson-tools olt olt-full'; bar.setAttribute('aria-label', 'Math tools for this lesson');
    bar.innerHTML = '<div class="olt-hd"><span class="olt-badge" aria-hidden="true">🧮</span><div><div class="olt-t">Math tools for this lesson</div><div class="olt-s">Open one in a new tab and use it on any problem here.</div></div></div>'
      + tiles(true) + learn() + (L.tools.length > 1 ? '<a class="olt-all" href="' + esc(all) + '" target="_blank" rel="noopener">Open all ' + L.tools.length + ' together ↗</a>' : '') + '<p class="olt-pro">⭐ <b>Pro tip:</b> In any tool, press <b>📤 Turn in my work</b> to copy a link to your work. If you want your teacher to see it, paste the link into your assignment.</p>';
    // the bottom card only shows on a page with no tabs (Bethany, 3 Nov 2026: tools at the top only)
    if (!document.querySelector('.tab-panel')) { var foot = document.querySelector('.footer'); if (foot && foot.parentNode) foot.parentNode.insertBefore(bar, foot); else document.body.appendChild(bar); }
    // compact row at the top of the first tab
    var first = document.querySelector('.tab-panel');
    if (first) {
      /* a small drawer, closed by default (audit, 3 Nov 2026: the big shelf competed with the first task). The activities
         carry their own "Try the …" buttons for the moment a tool helps. */
      var top = document.createElement('details'); top.className = 'oao-lesson-tools-top olt olt-drawer';
      var I2 = window.OAOM_ICONS || {};
      top.innerHTML = '<summary><span class="olt-dr-t">🧮 Math tools</span><span class="olt-dr-ic" aria-hidden="true">' + L.tools.map(function (t) { return '<span>' + (I2[t.t] || '') + '</span>'; }).join('') + '</span><span class="olt-dr-more">Show</span></summary>'
        + '<div class="olt-dr-b">' + tiles(false) + learn() + (L.tools.length > 1 ? '<a class="olt-all" href="' + esc(all) + '" target="_blank" rel="noopener">Open all ' + L.tools.length + ' ↗</a>' : '') + '<p class="olt-pro">⭐ <b>Pro tip:</b> In any tool, press <b>📤 Turn in my work</b> to copy a link to your work. If you want your teacher to see it, paste the link into your assignment.</p>' + '</div>';
      top.addEventListener('toggle', function () { var sm = top.querySelector('.olt-dr-more'); if (sm) sm.textContent = top.open ? 'Hide' : 'Show'; });
      first.insertBefore(top, first.firstChild);
    }
  }
  /* More fact practice (Bethany, 3 Nov 2026): under every fact warm-up, a link to a 2-minute Fact Check with the
     warm-up's own fact families, × and ÷ to 12. The families come from the warm-up itself: every number 2–12 that
     shows up in at least 3 of its facts (a × b counts a and b, p ÷ d counts d and p ÷ d; squares like 7 × 7 don't count). */
  function factLink() {
    var box = document.querySelector('.fluency-box'); if (!box || document.querySelector('.olt-fc')) return;
    var n = {}, qs = [].slice.call(box.querySelectorAll('.fluency-q'));
    qs.forEach(function (q) {
      var t = q.textContent.replace(/[=\s]/g, ''), a, b, mm;
      if ((mm = /^(\d+)[×x\*](\d+)$/.exec(t))) { a = +mm[1]; b = +mm[2]; }
      else if ((mm = /^(\d+)÷(\d+)$/.exec(t))) { b = +mm[2]; a = b ? +mm[1] / b : 0; }
      else if ((mm = /^(\d+)[×x\*]_+(\d+)$/.exec(t))) { a = +mm[1]; b = a ? +mm[2] / a : 0; }   /* 6 × ___ = 48 */
      else return;
      if (a === b) return;
      [a, b].forEach(function (k) { if (k >= 2 && k <= 12 && k === Math.floor(k)) n[k] = (n[k] || 0) + 1; });
    });
    var facs = Object.keys(n).map(Number).filter(function (k) { return n[k] >= 3; }).sort(function (x, y) { return n[y] - n[x] || x - y; }).slice(0, 4).sort(function (x, y) { return x - y; });
    if (!facs.length) return;
    var url = base + 'fluency.html?st=1&q=' + enc({ op: 'muldiv', facs: facs, sq: 0, to12: 1, n: 0, tm: 120, goal: 1 });
    var names = facs.map(function (k) { return k + 's'; }), list = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
    if (!document.getElementById('olt-fc-css')) { var st = document.createElement('style'); st.id = 'olt-fc-css';
      st.textContent = '.olt-fc{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;margin:14px 0 0;padding:10px 0 0;border-top:1px dashed rgba(14,28,66,.18);font-family:Nunito,Arial,sans-serif}'
        + '.olt-fc a{display:inline-flex;align-items:center;gap:.4em;padding:.4em .9em;border-radius:999px;background:#0E1C42;color:#fff;font-weight:800;font-size:14px;text-decoration:none;white-space:nowrap}'
        + '.olt-fc a:hover,.olt-fc a:focus-visible{background:#1F2F55;outline:3px solid #F2B705}'
        + '.olt-fc p{margin:0;flex:1;min-width:200px;font-size:13.5px;line-height:1.4;color:#3A4560}.olt-fc b{color:#0E1C42}'; document.head.appendChild(st); }
    var d = document.createElement('div'); d.className = 'olt-fc';
    d.innerHTML = '<a href="' + esc(url) + '" target="_blank" rel="noopener">⏱️ 2-minute fact check ↗</a>'
      + '<p><b>Want more practice? (optional)</b> Try ' + esc(list) + ', times and divide. To show your teacher, press <b>Copy link to my score</b> and paste it into your assignment.</p>';
    var inner = box.querySelector('.fluency-grid'); (inner ? inner.parentNode : box).appendChild(d);   /* inside the fact warm-up box, at its foot (Bethany, 3 Nov 2026) */
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', factLink); else factLink();
  function need(src, ok, cb) { if (ok()) return cb(); var s = document.createElement('script'); s.src = base + src; s.onload = cb; s.onerror = cb; document.head.appendChild(s); }
  need('data.js', function () { return !!window.OAOM_DATA; }, function () { need('icons.js', function () { return !!window.OAOM_ICONS; }, build); });
})();
