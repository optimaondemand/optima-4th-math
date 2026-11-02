/* "Math tools for this lesson": one line in a lesson page, <script src="manipulatives/lesson-tools.js" defer></script>,
   adds a small bar above the footer with the tools tagged for that lesson in manipulatives/data.js.
   The lesson id comes from the file name (math-lesson-4-06-02-… → 4.06.02). Links are student links (no way back to the library). */
(function () {
  var m = /math-lesson-(\d)-(\d\d)-(\d\d)/.exec(location.pathname); if (!m) return;
  var lid = m[1] + '.' + m[2] + '.' + m[3];
  var me = document.currentScript, base = me && me.src ? me.src.replace(/[^\/]*$/, '') : 'manipulatives/';
  function enc(o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function build() {
    var D = window.OAOM_DATA; if (!D) return; var L = D.lessonById(lid); if (!L || !L.tools.length) return;
    var names = {}; D.tools.forEach(function (t) { names[t.id] = t; });
    var bar = document.createElement('section'); bar.className = 'oao-lesson-tools'; bar.setAttribute('aria-label', 'Math tools for this lesson');
    bar.style.cssText = 'margin:18px auto 6px;max-width:960px;padding:12px 16px;border:2px solid #D9DEEA;border-left:6px solid #6B46C1;border-radius:14px;background:#F4F0FC;font-family:Nunito,Arial,sans-serif;color:#1B2238';
    var h = '<div style="display:flex;gap:.6rem;flex-wrap:wrap;align-items:center"><strong style="color:#0E1C42;font-size:1.05em">🧮 Math tools for this lesson</strong><span style="color:#5B6478;font-size:.92em">Open one in a new tab and use it on any problem here.</span></div><div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.6rem">';
    L.tools.forEach(function (t) {
      var n = names[t.t] || { name: t.t, what: '' };
      var url = base + 'tool.html?t=' + encodeURIComponent(t.t) + '&st=1' + (t.p ? '#s=' + enc(t.p) : '');
      h += '<a href="' + esc(url) + '" target="_blank" rel="noopener" title="' + esc(n.what || '') + '" style="display:inline-flex;align-items:center;gap:.35em;border:2px solid #6B46C1;border-radius:999px;padding:.35em .9em;font-weight:700;color:#6B46C1;background:#fff;text-decoration:none;min-height:40px">' + esc(n.name) + ' ↗</a>';
    });
    h += '<a href="' + esc(base + 'tool.html?lesson=' + encodeURIComponent(lid) + '&st=1') + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:.35em;border:2px solid #0E1C42;border-radius:999px;padding:.35em .9em;font-weight:700;color:#fff;background:#0E1C42;text-decoration:none;min-height:40px">All ' + L.tools.length + ' as tabs ↗</a></div>';
    bar.innerHTML = h;
    var foot = document.querySelector('.footer'); if (foot && foot.parentNode) foot.parentNode.insertBefore(bar, foot); else document.body.appendChild(bar);
  }
  if (window.OAOM_DATA) build();
  else { var s = document.createElement('script'); s.src = base + 'data.js'; s.onload = build; document.head.appendChild(s); }
})();
