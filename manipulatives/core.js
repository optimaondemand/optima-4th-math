/* OAO Math Manipulatives — core runner
   A tool registers with OAOM.register(id, {defaults, mount(api)}).
   api: S (state), stage (div), setup (side panel div), say(text), readout(html), changed(), redraw()
        ui helpers: num, select, seg, check, text, button, heading, hint
   State lives in the URL hash (#s=...) so any setup can be shared as a link. */
var OAOM = (function () {
  'use strict';
  var tools = {};
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- tiny utils ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var k in attrs) { if (k === 'class') e.className = attrs[k]; else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]); } if (html != null) e.innerHTML = html; return e; }
  function s(tag, attrs, parent) { var e = document.createElementNS(NS, tag); if (attrs) for (var k in attrs) { if (k === 'text') e.textContent = attrs[k]; else if (k === 'class') e.setAttribute('class', attrs[k]); else e.setAttribute(k, attrs[k]); } if (parent) parent.appendChild(e); return e; }
  function svg(w, h, parent, label) { var v = s('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h, role: 'img', 'aria-label': label || '' }, parent); return v; }
  function pt(svgEl, e) { var p = svgEl.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var m = svgEl.getScreenCTM(); return m ? p.matrixTransform(m.inverse()) : { x: 0, y: 0 }; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function fmt(n, dp) { if (dp != null) n = Number(Number(n).toFixed(dp)); return Number(n).toLocaleString('en-US', { maximumFractionDigits: 6 }); }
  function frac(n, d) { return '<span class="fr"><span>' + n + '</span><span>' + d + '</span></span>'; }
  /* n/d as mixed number html (whole + fraction), stacked */
  function mixed(n, d) { if (d === 0) return '—'; var w = Math.floor(n / d), r = n - w * d; if (r === 0) return '' + w; if (w === 0) return frac(r, d); return '<span class="mixed">' + w + frac(r, d) + '</span>'; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* drag helper: works for mouse, touch, pen */
  function drag(target, h) {
    target.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return; e.preventDefault();
      var id = e.pointerId; try { target.setPointerCapture(id); } catch (x) {}
      var moved = false, sx = e.clientX, sy = e.clientY;
      if (h.start) h.start(e);
      function mv(ev) { if (ev.pointerId !== id) return; if (Math.hypot(ev.clientX - sx, ev.clientY - sy) > 4) moved = true; if (h.move) h.move(ev, moved); }
      function up(ev) { if (ev.pointerId !== id) return; target.removeEventListener('pointermove', mv); target.removeEventListener('pointerup', up); target.removeEventListener('pointercancel', up); if (h.end) h.end(ev, moved); }
      target.addEventListener('pointermove', mv); target.addEventListener('pointerup', up); target.addEventListener('pointercancel', up);
    });
  }
  /* keyboard + click for svg shapes */
  function tap(node, fn, label) { node.setAttribute('tabindex', '0'); node.setAttribute('role', 'button'); node.classList.add('om-tap'); if (label) node.setAttribute('aria-label', label); node.addEventListener('click', fn); node.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } }); }

  /* ---------- state <-> url ---------- */
  function enc(o) { var j = JSON.stringify(o); return btoa(unescape(encodeURIComponent(j))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function dec(t) { try { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; return JSON.parse(decodeURIComponent(escape(atob(t)))); } catch (e) { return null; } }
  function readHash() { var m = location.hash.match(/s=([^&]+)/); return m ? dec(m[1]) : null; }
  function base() { return location.href.split('#')[0].split('?')[0].replace(/[^\/]*$/, ''); }
  function toolURL(id, state, extra) {
    var q = '?t=' + encodeURIComponent(id) + (extra || '');
    return base() + 'tool.html' + q + (state ? '#s=' + enc(state) : '');
  }
  function lessonURL(lid, extra) { return base() + 'tool.html?lesson=' + encodeURIComponent(lid) + (extra || ''); }

  /* ---------- toast ---------- */
  var toastEl;
  function toast(t) { if (!toastEl) { toastEl = el('div', { class: 'om-toast', role: 'status' }); document.body.appendChild(toastEl); } toastEl.textContent = t; toastEl.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(function () { toastEl.classList.remove('show'); }, 1800); }
  function copy(text, done) {
    function ok() { toast(done || 'Copied!'); }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
    function fallback() { var t = el('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } catch (e) { toast('Select the text and copy it.'); } t.remove(); }
  }

  /* ---------- student directions (Canvas-ready html) ---------- */
  function directions(o) { /* o = {title, steps:[], tries:[[toolName, text]], intro} */
    var h = '<div style="font-family:Nunito,Arial,sans-serif;color:#1B2238;border-left:6px solid #6B46C1;background:#F4F0FC;border-radius:10px;padding:12px 16px;margin:0 0 12px">' +
      '<h3 style="margin:0 0 6px;color:#0E1C42">' + esc(o.title) + '</h3>' + (o.intro ? '<p style="margin:0 0 6px">' + esc(o.intro) + '</p>' : '');
    if (o.steps && o.steps.length) h += '<p style="margin:6px 0 2px"><strong>How to use it:</strong></p><ol style="margin:0 0 6px 20px;padding:0">' + o.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>';
    if (o.tries && o.tries.length) h += '<p style="margin:6px 0 2px"><strong>Your tools:</strong></p><ul style="margin:0 0 6px 20px;padding:0">' + o.tries.map(function (t) { return '<li>' + (t[0] ? '<strong>' + esc(t[0]) + ':</strong> ' : '') + esc(t[1]) + '</li>'; }).join('') + '</ul>';
    h += '<p style="margin:6px 0 0;font-size:.9em">Made a mistake? Tap <strong>Start over</strong>. Want more room? Tap <strong>All tools</strong> to open it in a new tab.</p></div>';
    return h;
  }

  /* ---------- share modal (used by tool page + library) ---------- */
  var modal;
  function share(o) { /* o = {title, url, boardUrl, embedUrl} */
    if (!modal) { modal = el('div', { class: 'om-modal', hidden: '' }); document.body.appendChild(modal); modal.addEventListener('click', function (e) { if (e.target === modal) closeShare(); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeShare(); }); }
    var embedUrl = o.embedUrl || (o.url + (o.url.indexOf('#') > -1 ? '' : '')).replace(/(\?[^#]*)/, '$1&embed=1');
    var boardUrl = o.boardUrl || o.url.replace(/(\?[^#]*)/, '$1&board=1');
    var iframe = '<iframe src="' + embedUrl + '" title="' + esc(o.title) + '" width="100%" height="680" style="border:0;max-width:100%" allow="fullscreen" allowfullscreen></iframe>';
    var dirs = o.dir ? directions(o.dir) : '';
    var embed = dirs + iframe;
    modal.innerHTML = '<div class="om-dialog" role="dialog" aria-modal="true" aria-labelledby="om-sh-t">' +
      '<h2 id="om-sh-t">Share: ' + esc(o.title) + '</h2><p class="sub">' + (o.note || 'The link opens the tool set up exactly the way it looks right now.') + '</p>' +
      '<div class="om-sharegrid"><div>' +
      '<div class="om-label">Student link</div><div class="om-copy"><input readonly value="' + esc(o.url) + '" aria-label="Student link"><button class="om-btn small primary" data-c="0">Copy</button></div>' +
      '<div class="om-label">Big-screen link (for live class)</div><div class="om-copy"><input readonly value="' + esc(boardUrl) + '" aria-label="Big-screen link"><button class="om-btn small" data-c="1">Copy</button></div>' +
      '<div class="om-label">Canvas embed code (student directions + tool)</div><div class="om-copy"><textarea rows="4" readonly aria-label="Canvas embed code">' + esc(embed) + '</textarea><button class="om-btn small" data-c="2">Copy</button></div>' +
      '<p class="om-hint">In Canvas: Edit the page → open the HTML editor (&lt;/&gt;) → paste. The directions show above the tool.</p>' +
      (dirs ? '<details class="om-dirprev"><summary class="om-label">See the student directions</summary>' + dirs + '<div class="om-row"><button class="om-btn small" data-c="3">Copy directions only</button></div></details>' : '') +
      '</div><div class="om-qr"><div class="om-label">QR code</div><div class="qrbox"></div><button class="om-btn small" data-dl>Download QR</button></div></div>' +
      '<div class="om-row" style="justify-content:flex-end"><a class="om-btn small" target="_blank" rel="noopener" href="' + esc(o.url) + '">Open in new tab ↗</a><button class="om-btn small" data-x>Close</button></div></div>';
    var vals = [o.url, boardUrl, embed, dirs];
    modal.querySelectorAll('[data-c]').forEach(function (b) { b.addEventListener('click', function () { copy(vals[+b.dataset.c], ['Student link copied', 'Big-screen link copied', 'Embed code copied', 'Directions copied'][+b.dataset.c]); }); });
    modal.querySelector('[data-x]').addEventListener('click', closeShare);
    var box = modal.querySelector('.qrbox'), dataUrl = '';
    try {
      var q = qrcode(0, 'M'); q.addData(o.url); q.make();
      var n = q.getModuleCount(), sc = Math.max(2, Math.floor(340 / (n + 8))), c = document.createElement('canvas'); c.width = c.height = (n + 8) * sc; var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.fillStyle = '#0E1C42';
      for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (q.isDark(r, k)) g.fillRect((k + 4) * sc, (r + 4) * sc, sc, sc);
      box.appendChild(c); dataUrl = c.toDataURL('image/png');
    } catch (e) { box.innerHTML = '<p class="om-hint">This link is too long for a QR code. Use the student link instead.</p>'; }
    modal.querySelector('[data-dl]').addEventListener('click', function () { if (!dataUrl) return; var a = el('a', { href: dataUrl, download: (o.title || 'math-tool').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '-qr.png' }); document.body.appendChild(a); a.click(); a.remove(); });
    modal.hidden = false; modal.querySelector('input').focus();
  }
  function closeShare() { if (modal) modal.hidden = true; }

  /* ---------- tool data lookups ---------- */
  function meta(id) { return (window.OAOM_DATA && OAOM_DATA.tools.filter(function (t) { return t.id === id; })[0]) || { id: id, name: id }; }
  function lesson(lid) { return window.OAOM_DATA && OAOM_DATA.lessonById(lid); }

  /* ---------- runner ---------- */
  var params = new URLSearchParams(location.search);
  var cur = null; /* {id, def, S, initial} */
  var saveT;
  function register(id, def) { tools[id] = def; }

  function mount(id, state) {
    var def = tools[id]; var m = meta(id);
    var stage = $('#om-stage'), side = $('#om-setup'), sayEl = $('#om-say'), out = $('#om-readout');
    stage.innerHTML = ''; side.innerHTML = ''; sayEl.textContent = ''; out.innerHTML = '';
    if (!def) { stage.innerHTML = '<p>That tool was not found. <a href="index.html">Go to the library</a>.</p>'; return; }
    var S = Object.assign(clone(def.defaults || {}), state || {});
    cur = { id: id, def: def, S: S, initial: clone(S) };
    document.title = m.name + ' · OAO Math Tools';
    $('#om-title').textContent = m.name;
    var hl = $('#om-howlist'); if (hl) hl.innerHTML = (m.how || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    document.body.classList.toggle('hide-nums', S._r === 0);
    var bt = $('#om-nums'); if (bt) bt.setAttribute('aria-pressed', S._r === 0 ? 'true' : 'false');
    var redrawFn = function () {};
    var api = {
      S: S, stage: stage, setup: side, board: document.body.classList.contains('board'),
      say: function (t) { sayEl.innerHTML = t || ''; },
      readout: function (h) { out.innerHTML = h || ''; },
      /* report(o): the tool's current answer(s) as strings, e.g. {v:'2407'}; checked against the goal S._g */
      report: function (o) { cur.rep = o || {}; goalCheck(); },
      changed: function () { clearTimeout(saveT); saveT = setTimeout(function () { if (!params.get('lesson')) history.replaceState(null, '', '#s=' + enc(cur.S)); else cur.lessonStates[cur.tab] = clone(cur.S); }, 250); },
      onRedraw: function (f) { redrawFn = f; },
      redraw: function () { redrawFn(); api.changed(); },
      heading: function (t) { side.appendChild(el('h3', null, t)); },
      hint: function (t) { side.appendChild(el('p', { class: 'om-hint' }, t)); },
      num: function (label, key, min, max, step, after) {
        var f = el('label', { class: 'om-field' }, '<span>' + label + '</span>'); var i = el('input', { type: 'number', min: min, max: max, step: step || 1, value: S[key] });
        i.addEventListener('change', function () { var v = parseFloat(i.value); if (isNaN(v)) v = S[key]; v = clamp(v, min, max); i.value = v; S[key] = v; if (after) after(v); api.redraw(); });
        f.appendChild(i); side.appendChild(f); return i;
      },
      text: function (label, key, after, ph) {
        var f = el('label', { class: 'om-field' }, '<span>' + label + '</span>'); var i = el('input', { type: 'text', value: S[key] == null ? '' : S[key], placeholder: ph || '' });
        i.addEventListener('input', function () { S[key] = i.value; if (after) after(i.value); api.redraw(); }); f.appendChild(i); side.appendChild(f); return i;
      },
      select: function (label, key, opts, after) {
        var f = el('label', { class: 'om-field' }, '<span>' + label + '</span>'); var i = el('select');
        opts.forEach(function (o) { var op = el('option', { value: o[0] }, o[1]); if (String(S[key]) === String(o[0])) op.selected = true; i.appendChild(op); });
        i.addEventListener('change', function () { var v = i.value; S[key] = isNaN(+v) || v === '' ? v : +v; if (after) after(S[key]); api.redraw(); }); f.appendChild(i); side.appendChild(f); return i;
      },
      seg: function (label, key, opts, after, parent) {
        var wrap = el('div', { class: 'om-field' }, label ? '<span>' + label + '</span>' : ''); var g = el('div', { class: 'om-seg', role: 'group' });
        function paint() { [].forEach.call(g.children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.v) === String(S[key]) ? 'true' : 'false'); }); }
        opts.forEach(function (o) { var b = el('button', { type: 'button' }, o[1]); b.dataset.v = o[0]; b.addEventListener('click', function () { S[key] = typeof o[0] === 'number' ? o[0] : o[0]; paint(); if (after) after(S[key]); api.redraw(); }); g.appendChild(b); });
        paint(); wrap.appendChild(g); (parent || side).appendChild(wrap); return { paint: paint, el: wrap };
      },
      check: function (label, key, after) {
        var f = el('label', { class: 'om-check' }); var i = el('input', { type: 'checkbox' }); i.checked = !!S[key];
        i.addEventListener('change', function () { S[key] = i.checked; if (after) after(i.checked); api.redraw(); }); f.appendChild(i); f.appendChild(document.createTextNode(label)); side.appendChild(f); return i;
      },
      button: function (label, fn, cls, parent) { var b = el('button', { type: 'button', class: 'om-btn small ' + (cls || '') }, label); b.addEventListener('click', fn); (parent || side).appendChild(b); return b; },
      row: function (parent) { var r = el('div', { class: 'om-row' }); (parent || side).appendChild(r); return r; }
    };
    goalBar();
    def.mount(api);
    redrawFn();
    /* kit note */
    if (m.kit) side.appendChild(el('div', { class: 'om-kit' }, '<b>Hands-on:</b> ' + m.kit + (m.home ? '<br><b>At home:</b> ' + m.home : '')));
    $('#om-main').classList.toggle('nosetup', !side.children.length);
    /* with a goal, the setup panel starts folded so students build by hand instead of typing the answer in */
    var aside = side.parentNode, h2 = aside.querySelector('h2');
    aside.classList.toggle('folded', !!S._g);
    h2.innerHTML = S._g ? '<button type="button" class="om-fold" aria-expanded="false">Set up (for teachers) ▸</button>' : 'Set up';
    var fb = h2.querySelector('button'); if (fb) fb.onclick = function () { var open = aside.classList.toggle('folded') === false; fb.setAttribute('aria-expanded', open); fb.textContent = 'Set up (for teachers) ' + (open ? '▾' : '▸'); };
    $('#om-printhead').innerHTML = '<span><b>' + esc(m.name) + '</b>' + '' + '</span><span>Name: ______________________ &nbsp; Date: __________</span>';
  }

  /* ---------- goal + check-my-answer ----------
     S._g = {t:'Build 2,407', k:'v', v:'2407', m:[['247','Look at the tens. Did you leave a spot for 0 tens?']]}
     Goals live in the state, so they travel with share links. */
  function norm(x) { return String(x == null ? '' : x).toLowerCase().replace(/[\s,$]/g, ''); }
  function goalBar() {
    var g = $('#om-goal'); if (!g) return; var S = cur.S;
    var hidden = S._r === 0;
    if (!S._g && !hidden) { g.hidden = true; g.innerHTML = ''; return; }
    g.hidden = false;
    g.innerHTML = (S._g ? '<span class="om-gt">🎯 ' + esc(S._g.t) + '</span>' : '<span class="om-gt">Work it out, then check.</span>') +
      '<span class="om-gs" aria-live="polite"></span>' + (hidden ? '<button type="button" class="om-btn small" id="om-check">Check my answer</button>' : '');
    var cb = $('#om-check'); if (cb) cb.onclick = function () { document.body.classList.remove('hide-nums'); cb.remove(); goalCheck(true); };
  }
  function goalCheck(force) {
    var S = cur && cur.S, gs = $('#om-goal .om-gs'); if (!S || !S._g || !gs) return;
    var k = S._g.k || 'v', val = norm((cur.rep || {})[k]), want = norm(S._g.v);
    var revealed = S._r !== 0 || !document.body.classList.contains('hide-nums');
    var ok = val !== '' && val === want, mis = (S._g.m || []).filter(function (m) { return norm(m[0]) === val; })[0];
    gs.className = 'om-gs' + (ok ? ' ok' : mis ? ' hint' : '');
    if (ok && (revealed || force)) { gs.textContent = '✓ You did it!'; if (!cur.cheered) { cur.cheered = 1; } }
    else if (ok) gs.textContent = 'Ready? Tap Check my answer.';
    else if (mis) gs.textContent = mis[1];
    else gs.textContent = '';
  }

  function boot() {
    var id = params.get('t'), lid = params.get('lesson');
    var isBoard = params.get('board') === '1', isEmbed = params.get('embed') === '1';
    document.body.classList.toggle('board', isBoard); document.body.classList.toggle('embed', isEmbed);
    var app = $('#app');
    app.innerHTML =
      '<header class="om-top"><a class="back om-noprint" href="index.html" ' + (isEmbed ? 'target="_blank"' : '') + '>← ' + (isEmbed ? 'All tools' : 'Library') + '</a><h1 id="om-title">Math Tool</h1><div class="om-actions">' +
      '<button class="om-btn small" id="om-nums" aria-pressed="false" title="Hide or show the totals"><span class="lbl">Hide totals</span><span aria-hidden="true">👁</span></button>' +
      '<button class="om-btn small" id="om-reset" title="Start over"><span aria-hidden="true">↺</span><span class="lbl">Start over</span></button>' +
      '<button class="om-btn small om-sidetoggle" id="om-setbtn" aria-pressed="false"><span class="lbl">Set up</span><span aria-hidden="true">⚙</span></button>' +
      (isBoard ? '<button class="om-btn small" id="om-dark" aria-pressed="false"><span class="lbl">Dark</span><span aria-hidden="true">◐</span></button><button class="om-btn small" id="om-full"><span class="lbl">Full screen</span><span aria-hidden="true">⛶</span></button>' : '<button class="om-btn small" id="om-big" title="Big-screen mode"><span class="lbl">Big screen</span><span aria-hidden="true">⛶</span></button>') +
      '<button class="om-btn small" id="om-print" title="Print"><span class="lbl">Print</span><span aria-hidden="true">🖨</span></button>' +
      '<button class="om-btn small primary" id="om-share"><span class="lbl">Share</span><span aria-hidden="true">🔗</span></button></div></header>' +
      '<nav class="om-tabs" id="om-tabs" role="tablist" hidden></nav><p class="om-lessonnote" id="om-lnote" hidden></p>' +
      '<main class="om-main" id="om-main"><section class="om-stagecard"><div class="om-printhead" id="om-printhead"></div><details class="om-how" id="om-how"' + (isEmbed ? '' : ' open') + '><summary>How to use this tool</summary><ol id="om-howlist"></ol></details><p class="om-say" id="om-say" aria-live="polite"></p><div class="om-goal" id="om-goal" hidden></div><div class="om-stage" id="om-stage"></div><div class="om-readout om-num" id="om-readout" aria-live="polite"></div></section>' +
      '<aside class="om-side"><h2>Set up</h2><div id="om-setup"></div></aside></main>';

    $('#om-reset').onclick = function () { if (!cur) return; mount(cur.id, clone(cur.initial)); if (!lid) history.replaceState(null, '', '#s=' + enc(cur.initial)); };
    $('#om-nums').onclick = function () { if (!cur) return; cur.S._r = cur.S._r === 0 ? 1 : 0; document.body.classList.toggle('hide-nums', cur.S._r === 0); this.setAttribute('aria-pressed', cur.S._r === 0 ? 'true' : 'false'); goalBar(); goalCheck(); if (!lid) history.replaceState(null, '', '#s=' + enc(cur.S)); };
    $('#om-print').onclick = function () { window.print(); };
    $('#om-setbtn').onclick = function () { var on = document.body.classList.toggle('show-setup'); this.setAttribute('aria-pressed', on); };
    var big = $('#om-big'); if (big) big.onclick = function () { location.href = currentURL('&board=1'); };
    var dark = $('#om-dark'); if (dark) dark.onclick = function () { var on = document.body.classList.toggle('dark'); this.setAttribute('aria-pressed', on); };
    var full = $('#om-full'); if (full) full.onclick = function () { if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); };
    $('#om-share').onclick = function () {
      if (!cur) return;
      if (lid) { share(lessonShare(lid)); return; }
      var mm = meta(cur.id); share({ title: mm.name, url: toolURL(cur.id, cur.S), dir: { title: 'Math tool: ' + mm.name, intro: mm.what, steps: mm.how } });
    };

    if (lid) {
      var L = lesson(lid);
      if (!L || !L.tools.length) { $('#om-stage').innerHTML = '<p>No tools are tagged for lesson ' + esc(lid) + ' yet. <a href="index.html">Go to the library</a>.</p>'; return; }
      var tabs = $('#om-tabs'); tabs.hidden = false; var note = $('#om-lnote'); note.hidden = false;
      var states = {};
      function show(i) {
        var tt = L.tools[i];
        [].forEach.call(tabs.children, function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
        mount(tt.t, states[i] || clone(tt.p || {}));
        cur.lessonId = lid; cur.lessonStates = states; cur.tab = i; cur.initial = clone(tt.p ? Object.assign(clone(tools[tt.t] ? tools[tt.t].defaults : {}), tt.p) : cur.initial);
        note.innerHTML = '<b>' + esc(meta(tt.t).name) + ':</b> ' + esc(meta(tt.t).what || '');
        $('#om-title').textContent = 'Math Tools';
      }
      L.tools.forEach(function (tt, i) { var b = el('button', { type: 'button', role: 'tab' }, esc(meta(tt.t).name)); b.onclick = function () { if (cur) states[cur.tab] = clone(cur.S); show(i); }; tabs.appendChild(b); });
      show(0);
      return;
    }
    mount(id, readHash());
  }
  function lessonShare(lid) {
    var L = lesson(lid); if (!L) return null;
    var names = L.tools.map(function (t) { return meta(t.t).name; });
    return { title: 'Math tools for Lesson ' + lid, url: lessonURL(lid), note: 'One link opens the tools that fit this lesson (' + names.join(', ') + ') as tabs. They are open tools, ready for any problem.',
      dir: { title: 'Math tools', intro: 'Use these tools on any problem while you work. Tap a tab at the top to switch tools. Each tool has a “How to use this tool” box.', tries: L.tools.map(function (t) { return [meta(t.t).name, meta(t.t).what]; }) } };
  }
  function toolShare(id, state) { var mm = meta(id); return { title: mm.name, url: toolURL(id, state), dir: { title: 'Math tool: ' + mm.name, intro: mm.what, steps: mm.how } }; }
  function currentURL(extra) { if (params.get('lesson')) return lessonURL(params.get('lesson'), extra); return toolURL(cur.id, cur.S, extra); }

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* anim(node, attrs, ms): tween numeric SVG attributes (x, y, cx, cy, opacity, transform via 'tx','ty'); skipped under reduced motion */
  function anim(node, from, to, ms, done) {
    if (reduce || !node) { if (done) done(); return; }
    var t0 = performance.now(); ms = ms || 350;
    function step(t) { var k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      for (var a in to) { var v = from[a] + (to[a] - from[a]) * e; if (a === 'tx' || a === 'ty') { var tx = a === 'tx' ? v : (node._tx || 0), ty = a === 'ty' ? v : (node._ty || 0); node._tx = tx; node._ty = ty; node.setAttribute('transform', 'translate(' + tx + ' ' + ty + ')'); } else node.setAttribute(a, v); }
      if (k < 1) requestAnimationFrame(step); else if (done) done(); }
    requestAnimationFrame(step);
  }
  return { reduce: reduce, anim: anim, register: register, boot: boot, tools: tools, s: s, svg: svg, el: el, pt: pt, drag: drag, tap: tap, clone: clone, clamp: clamp, gcd: gcd, fmt: fmt, frac: frac, mixed: mixed, esc: esc,
    enc: enc, dec: dec, directions: directions, lessonShare: lessonShare, toolShare: toolShare, toolURL: toolURL, lessonURL: lessonURL, share: share, copy: copy, toast: toast, meta: meta };
})();
