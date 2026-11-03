/* cw-guide.js — the guide on a ladder (classical layer, sparkle only; Bethany, 3 Nov 2026).
   A small sprite of the unit's guide climbs a ladder at the side of the page as the student scrolls.
   Click him: a short tip for the part of the page you are on, plus a question you can ask him.
   Little things along the ladder (a painting, a flying machine, a notebook) are decoration only.
   Data: CW_DATA.guide = {who, name, decor:[{at,kind,say}], top, bottom, fast, tabs:{tab:{say,ask}}, spots:[{sel,say,ask:[{q,a}]}]}
   Off in clean mode (body.pq-clean); a round button instead of the ladder when there is no room at the side. */
var CWGUIDE = (function () {
'use strict';
var G, root, rail, man, cv, ctx, pop, panel, btn, wall, deco = [], reduce = false;
var prog = 0, _u = 0, shown = 0, lastY = 0, lastT = 0, frame = 0, ft = 0, blink = 0, spot = null, seenSpot = {}, once = {}, popT = 0, flap = 0, compact = false;
var RAIL_W = 51, MAN_H = 90, TOP = 0, BOT = 0, PAD = 6, PANEL_MIN = 70;
function padTop() { return G && G.ride === 'lift' ? 38 : PAD; }

function R(c, x, y, w, h, p) { p.fillStyle = c; p.fillRect(x | 0, y | 0, w | 0, h | 0); }
function mkc(w, h, fn) { return CWART.mk(w, h, fn, true); }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

/* ── decoration art (small, still, 16-bit) ── */
var ART = {
  mona: function () { return mkc(30, 38, function (p) {
    R('#b8862a', 0, 0, 30, 38, p); R('#e2b84e', 1, 1, 28, 1, p); R('#7a5418', 1, 36, 28, 1, p);
    R('#55603f', 3, 3, 24, 32, p); R('#7d8a63', 3, 3, 24, 9, p); R('#8f9b74', 3, 6, 24, 2, p); R('#6a7650', 3, 12, 24, 4, p);
    R('#2a1c12', 10, 6, 10, 16, p); R('#2a1c12', 8, 12, 14, 10, p);                        // hair
    R('#d6ad78', 11, 8, 8, 10, p); R('#c4986a', 11, 16, 8, 2, p);                         // face
    R('#3a2a1a', 12, 11, 2, 1, p); R('#3a2a1a', 16, 11, 2, 1, p); R('#a87458', 14, 15, 3, 1, p);
    for (var y = 20; y < 35; y++) { var hw = 5 + Math.floor((y - 20) / 2); R('#3b2f1e', 15 - hw, y, hw * 2, 1, p); }
    R('#d6ad78', 13, 19, 4, 3, p); R('#d6ad78', 10, 29, 10, 3, p); R('#c4986a', 10, 31, 10, 1, p);
  }); },
  flyer: function (up) { return mkc(44, 30, function (p) {
    var wy = up ? 3 : 20;
    for (var i = 0; i < 18; i++) {                                                          // wings
      var t = i / 17, y0 = Math.round(14 + (wy - 14) * t), h = Math.max(2, Math.round(9 * (1 - t)) + 2);
      R('#efe0bb', 20 - i, y0, 1, h, p); R('#efe0bb', 23 + i, y0, 1, h, p);
      if (i % 4 === 0) { R('#8a6a4a', 20 - i, y0, 1, h, p); R('#8a6a4a', 23 + i, y0, 1, h, p); }
    }
    R('#6b4a2a', 20, 9, 4, 14, p); R('#8a6a4a', 21, 9, 2, 14, p);                           // body
    R('#6b4a2a', 14, 23, 16, 2, p); R('#6b4a2a', 21, 25, 2, 4, p);                           // frame
  }); },
  note: function () { return mkc(34, 24, function (p) {
    R('#8a6a4a', 0, 2, 34, 22, p); R('#f4ead5', 1, 1, 15, 21, p); R('#f4ead5', 18, 1, 15, 21, p); R('#d9c9a3', 16, 1, 2, 22, p);
    for (var i = 0; i < 5; i++) R('#9a7a5a', 3, 4 + i * 3, 9 - (i % 2) * 3, 1, p);
    R('#9a7a5a', 21, 4, 9, 1, p); R('#9a7a5a', 21, 7, 6, 1, p);
    for (var a = 0; a < 16; a++) { var x = 25 + Math.round(4 * Math.cos(a / 16 * 6.283)), y = 15 + Math.round(4 * Math.sin(a / 16 * 6.283)); R('#6b4f35', x, y, 1, 1, p); }
    R('#6b4f35', 25, 15, 1, 1, p);
  }); }
};

/* ── the guide on the ladder: his back to us while he climbs, turns to look when the student stops ── */
var BACK = {}, ropes = [];
function backView(f) {
  if (BACK[f]) return BACK[f];
  var robe = G.robe || '#c4626e', shade = G.robeShade || '#9e4552', cap = G.cap || '#5b2a33', hair = G.hair || '#6b4f35', skin = '#e8b98f';
  return (BACK[f] = CWART.mk(34, 60, function (p) {
    var cx = 17, up = f % 2;
    // arms first (behind the robe at the shoulder): one hand high on a rail, one low
    [[-1, up ? 8 : 26, 1], [1, up ? 26 : 8, 31]].forEach(function (a) {
      var sx = cx + a[0] * 6, sy = 21, hx = a[2], hy = a[1], n = 10;
      for (var k = 0; k <= n; k++) R(k % 3 ? robe : shade, Math.round(sx + (hx - sx) * k / n) - 1, Math.round(sy + (hy - sy) * k / n), 3, 3, p);
      R(skin, hx, hy - 1, 3, 3, p);
    });
    // legs: one foot up a rung, one foot down
    var lA = (G.ride === 'lift') ? 56 : (up ? 52 : 56), lB = (G.ride === 'lift') ? 56 : (up ? 56 : 52);
    R('#3b2a3a', cx - 4, 44, 3, lA - 44, p); R('#2a1c14', cx - 5, lA - 1, 4, 2, p);
    R('#3b2a3a', cx + 1, 44, 3, lB - 44, p); R('#2a1c14', cx + 1, lB - 1, 4, 2, p);
    // robe from behind
    for (var y = 17; y < 46; y++) { var hw = 6 + Math.floor((y - 18) / 7); R(robe, cx - hw, y, hw * 2 + 1, 1, p); R(shade, cx + hw - 1, y, 2, 1, p); }
    R(shade, cx, 31, 1, 14, p); R('#4a2e1a', cx - 8, 30, 17, 2, p);
    // head from behind: cap and long hair, no face
    R(hair, cx - 5, 4, 11, 14, p); R('#5a3f28', cx - 2, 6, 1, 11, p); R('#5a3f28', cx + 2, 6, 1, 11, p);
    R(cap, cx - 6, 1, 13, 4, p); R('#7a3a45', cx - 4, 0, 9, 2, p); R('#43202a', cx - 6, 4, 13, 1, p);
  }, true));
}
var still = 0;
function drawMan() {
  var who = G.who || 'leo';
  ctx.clearRect(0, 0, 34, 60);
  if (still < 260 && !reduce) { ctx.drawImage(backView(frame), 0, 0); return; }
  var s = CWART.person(who, 0, blink > 0, popT > 0); ctx.drawImage(s, 2, 2);   /* facing the reader */
  if (G.idle === 'none') return;
  /* waiting to be clicked: he writes in his notebook (Bethany, 3 Nov 2026). Every few seconds he lifts the quill and looks up. */
  var now = performance.now() / 1000, cyc = now % 7, writing = panel.hidden && cyc < 5.6 && !reduce;
  R('#3f2716', 8, 24, 14, 10, ctx); R('#6b4a2a', 9, 25, 12, 8, ctx);                          // cover
  R('#f4ead5', 9, 25, 5, 7, ctx); R('#f4ead5', 15, 25, 5, 7, ctx); R('#c9b48a', 14, 25, 1, 8, ctx);  // pages + spine
  var done = writing ? cyc / 5.6 : 1, rows = 6, k, w;                                           // ink lines fill the pages, then a fresh page
  for (k = 0; k < rows; k++) { w = Math.max(0, Math.min(4, Math.round((done * rows - k) * 4))); if (w) R('#7a5a3a', k < 3 ? 10 : 16, 26 + (k % 3) * 2, w, 1, ctx); }
  var row = Math.min(rows - 1, Math.floor(done * rows)), px = (row < 3 ? 10 : 16) + Math.min(4, Math.round((done * rows - row) * 4)), py = 26 + (row % 3) * 2;
  if (!writing) { px = 21; py = 23; }                                                           // quill lifted
  else py += (Math.floor(now * 9) % 2);                                                         // a little scratch-scratch
  for (k = 0; k < 7; k++) R(k < 2 ? '#3a2a1a' : '#f4efe2', px + Math.round(k * 0.7), py - k, 1, 1, ctx);   // quill
  R('#e8b98f', px + 1, py - 2, 2, 2, ctx);                                                       // his hand on it
}

/* the pulley lift (Leonardo drew many hoists): beam + spinning wheel at the top, ropes down to his plank */
var wheelA = 0, wheelCv = null;
function drawWheel() {
  if (!wheelCv) return; var p = wheelCv.getContext('2d'); p.clearRect(0, 0, 34, 22);
  R('#5a3a22', 0, 1, 34, 4, p); R('#7a5133', 0, 1, 34, 1, p); R('#3f2716', 0, 4, 34, 1, p);    // beam
  R('#3f2716', 16, 5, 2, 2, p);                                                                  // axle bracket
  var cx = 17, cy = 13, r = 7, k;
  for (k = 0; k < 48; k++) { var a = k / 48 * 6.283; R('#6b4a2a', Math.round(cx - 0.5 + r * Math.cos(a)), Math.round(cy - 0.5 + r * Math.sin(a)), 1, 1, p); }
  for (k = 0; k < 4; k++) { var b = wheelA + k * Math.PI / 2; for (var t = 1; t < r; t++) R('#a07a48', Math.round(cx - 0.5 + t * Math.cos(b)), Math.round(cy - 0.5 + t * Math.sin(b)), 1, 1, p); }
  R('#3f2716', cx - 1, cy - 1, 2, 2, p);
}
/* a close-up face that fills its box (head and beard only), for the help card and the Ask button */
function face(cnv, talk) {
  var who = G.who || 'leo', sp = CWART.person(who, 0, 0, !!talk), p = cnv.getContext('2d');
  cnv.width = 20; cnv.height = 20; p.imageSmoothingEnabled = false;
  R('#e9d9b4', 0, 0, 20, 20, p); R('#d9c49a', 0, 14, 20, 6, p);
  p.drawImage(sp, Math.round(sp.width / 2) - 10, 0, 20, 20, 0, 0, 20, 20);
}
function el(h) { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; }
function build() {
  root = el('<div class="cwg"></div>');
  rail = el('<div class="cwg-rail"></div>');
  root.appendChild(rail);
  (G.decor || []).forEach(function (d) {
    var c = ART[d.kind] ? ART[d.kind](false) : null; if (!c) return;
    if (!wall) { wall = el('<div class="cwg-wall" aria-hidden="true"></div>'); root.appendChild(wall); }
    c.className = 'cwg-deco cwg-' + d.kind; c.setAttribute('aria-hidden', 'true'); wall.appendChild(c);   /* on the page: it scrolls by (Bethany, 3 Nov 2026) */
    deco.push({ d: d, c: c, up: d.kind === 'flyer' ? ART.flyer(true) : null, down: d.kind === 'flyer' ? ART.flyer(false) : null });
  });
  if (G.ride === 'lift') {
    root.classList.add('cwg-lift');
    wheelCv = document.createElement('canvas'); wheelCv.width = 34; wheelCv.height = 22; wheelCv.className = 'cwg-wheel'; wheelCv.setAttribute('aria-hidden', 'true'); rail.appendChild(wheelCv);
    ropes = [el('<div class="cwg-rope l" aria-hidden="true"></div>'), el('<div class="cwg-rope r" aria-hidden="true"></div>')]; ropes.forEach(function (r) { rail.appendChild(r); });
    drawWheel();
  }
  man = el('<button type="button" class="cwg-man" aria-haspopup="dialog" aria-expanded="false"></button>');
  man.setAttribute('aria-label', 'Ask ' + (G.name || 'the guide') + ' for help');
  cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); cv.width = 34; cv.height = 60; ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
  man.appendChild(cv); rail.appendChild(man);
  pop = el('<div class="cwg-pop" role="status" hidden></div>'); rail.appendChild(pop);
  btn = el('<button type="button" class="cwg-btn" aria-haspopup="dialog" aria-expanded="false"><canvas width="40" height="40" aria-hidden="true"></canvas><span>Ask</span></button>');
  btn.setAttribute('aria-label', 'Ask ' + (G.name || 'the guide') + ' for help');
  face(btn.querySelector('canvas')); root.appendChild(btn);
  panel = el('<div class="cwg-panel" role="dialog" hidden></div>'); panel.setAttribute('aria-label', (G.name || 'Guide') + ' helps'); root.appendChild(panel);
  document.body.appendChild(root);
  man.onclick = btn.onclick = function () { panel.hidden ? open() : close(); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { close(); (compact ? btn : man).focus(); } });
  document.addEventListener('click', function (e) { if (!panel.hidden && !root.contains(e.target)) close(); });
}

/* ── which part of the page is the student looking at? ── */
function activeTab() { var a = document.querySelector('.tab-btn.active'); return a ? a.getAttribute('data-tab') : ''; }
function findSpot() {
  var best = null, line = innerHeight * 0.4, bd = 1e9;
  (G.spots || []).forEach(function (s) {
    var e = document.querySelector(s.sel); if (!e || !e.offsetParent) return;
    var r = e.getBoundingClientRect(); if (r.bottom < 60 || r.top > innerHeight) return;
    var d = (r.top <= line && r.bottom >= line) ? 0 : Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line));
    if (d < bd) { bd = d; best = s; }
  });
  return best || (G.tabs || {})[activeTab()] || G.start || null;
}

function say(t, ms) { pop.textContent = t; pop.hidden = false; popT = ms || 1800; }
function open() {
  var s = findSpot() || {}, asks = s.ask || [];
  panel.innerHTML = '<div class="cwg-hd"><canvas aria-hidden="true"></canvas><div class="cwg-who"><b>' + esc(G.name || '') + '</b><small>' + esc(G.role || 'Your guide') + '</small></div><button type="button" class="cwg-x" aria-label="Close">✕</button></div>' +
    '<p class="cwg-say">' + (s.say || G.hello || '') + '</p>' +
    (asks.length ? '<div class="cwg-qs"><div class="cwg-ql">Ask me</div>' + asks.map(function (a, i) { return '<div class="cwg-qa"><button type="button" class="cwg-q" data-i="' + i + '" aria-expanded="false">' + esc(a.q) + '</button><div class="cwg-a" hidden>' + a.a + '</div></div>'; }).join('') + '</div>' : '');
  face(panel.querySelector('canvas'), true);
  panel.querySelector('.cwg-x').onclick = function () { close(); (compact ? btn : man).focus(); };
  [].slice.call(panel.querySelectorAll('.cwg-q')).forEach(function (b) {     /* the answer opens right under its question */
    b.onclick = function () { var box = b.nextElementSibling, on = box.hidden; box.hidden = !on; b.setAttribute('aria-expanded', String(on)); b.classList.toggle('on', on); place(); };
  });
  panel.hidden = false; man.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-expanded', 'true'); place();
  pop.hidden = true; var f = panel.querySelector('.cwg-q') || panel.querySelector('.cwg-x'); try { f.focus({ preventScroll: true }); } catch (e) {}
}
function close() { panel.hidden = true; man.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-expanded', 'false'); }

/* ── layout: the ladder needs a gutter beside the lesson; otherwise a round button ── */
/* In Canvas the lesson fills almost the whole frame, so the side margin is thin. When the margin is too thin
   for him, the page makes a lane for him right beside the lesson (the lesson gets a little narrower);
   only on small screens does he become the round "Ask" button. */
var LANE = RAIL_W + 26;
function layout() {
  var de = document.documentElement, host = document.querySelector('.tab-panel'), box = host ? host.parentElement : null;
  de.classList.remove('cwg-lane');
  var gutter = innerWidth - (box ? box.getBoundingClientRect().right : innerWidth);
  compact = innerWidth < 760 || innerHeight < 420;
  if (!compact && gutter < LANE && innerWidth < 1100) compact = true;
  if (!compact && gutter < LANE) { de.classList.add('cwg-lane'); gutter = innerWidth - (box ? box.getBoundingClientRect().right : innerWidth); }
  root.classList.toggle('cwg-compact', compact);
  if (!compact) rail.style.right = Math.max(4, Math.min(gutter - RAIL_W - 12, Math.round((gutter - RAIL_W) / 2))) + 'px';   /* close to the lesson */
  if (wall && !compact) {                     /* hang each keepsake on the page, in the lift's lane: at its section (d.sel) or part way down (d.at) */
    var rr = rail.getBoundingClientRect(), docH = document.documentElement.scrollHeight, tabEl = document.querySelector('.tab-panel.active') || document.body;
    deco.forEach(function (o) {
      var e = o.d.sel && tabEl.querySelector(o.d.sel), y = e && e.offsetParent ? e.getBoundingClientRect().top + scrollY : Math.round((o.d.at || 0.5) * docH);
      o.c.style.left = Math.round(rr.left + scrollX + RAIL_W / 2 - o.c.offsetWidth / 2) + 'px'; o.c.style.top = Math.round(y) + 'px';
    });
  }
  place();
}
function railH() { return innerHeight - TOP - BOT; }
function manY() { return padTop() + Math.round(shown * (railH() - MAN_H - padTop() - PAD)); }
function place() {
  var y = manY();
  man.style.top = y + 'px'; pop.style.top = (y - 4) + 'px';
  ropes.forEach(function (r) { r.style.height = Math.max(0, y + MAN_H - 8 - 7) + 'px'; });
  if (!panel.hidden) {
    if (compact) { panel.style.top = ''; panel.style.right = ''; }
    else { panel.style.top = Math.min(innerHeight - panel.offsetHeight - 10, Math.max(PANEL_MIN, TOP + y - 10)) + 'px'; panel.style.right = (parseInt(rail.style.right, 10) + RAIL_W + 10) + 'px'; }
  }
}

/* ── scrolling: climb, react, notice things on the way ── */
function onScroll() {
  var max = Math.max(1, document.documentElement.scrollHeight - innerHeight), now = performance.now(), y = scrollY;
  prog = Math.min(1, Math.max(0, y / max));
  var v = Math.abs(y - lastY) / Math.max(16, now - lastT) * 1000; lastY = y; lastT = now;
  if (prog < 0.01 && !once.top && G.top) { once.top = 1; say(G.top, 2200); }
  if (prog > 0.99 && !once.bottom && G.bottom) { once.bottom = 1; say(G.bottom, 2600); }
  if (reduce) { shown = prog; place(); }
}
function tick(t) {
  var dt = Math.min(64, t - (tick.t || t)); tick.t = t;
  if (document.hidden || document.body.classList.contains('pq-clean')) { setTimeout(function () { requestAnimationFrame(tick); }, 500); return; }   /* asleep (audit) */
  if (!reduce) {
    var moving = Math.abs(prog - shown) > 0.0015;
    shown += (prog - shown) * 0.12;
    if (moving) { still = 0; ft += dt; if (ft > 140) { ft = 0; frame++; } if (wheelCv) { wheelA += (prog > shown ? 1 : -1) * dt * 0.008; drawWheel(); } } else still += dt;
    deco.forEach(function (o) {                                                               // he notices things as he passes them
      var r = o.c.getBoundingClientRect(), m = man.getBoundingClientRect(), near = r.bottom > m.top - 10 && r.top < m.bottom + 10;
      if (near && !o.seen && !compact) { o.seen = 1; if (o.d.say) say(o.d.say, 1600); if (o.up) flap = 1400; }
      if (!near && (r.bottom < m.top - 160 || r.top > m.bottom + 160)) o.seen = 0;
    });
    if (flap > 0) { flap -= dt; deco.forEach(function (o) { if (o.up) { var c = o.c.getContext('2d'); c.clearRect(0, 0, 44, 30); c.drawImage((Math.floor(flap / 180) % 2) ? o.up : o.down, 0, 0); } }); }
  }
  if (Math.random() < 0.004) blink = 140; if (blink > 0) blink -= dt;
  if (popT > 0) { popT -= dt; if (popT <= 0) pop.hidden = true; }
  var busy = Math.abs(prog - shown) > 0.0015 || still < 300 || popT > 0 || flap > 0;
  if (!compact && (busy || (tick.d = (tick.d || 0) + dt) > 120)) { tick.d = 0; place(); drawMan(); }   /* idle: ~8 frames a second */
  if ((tick.h = (tick.h || 0) + dt) > 200) { tick.h = 0; checkHop(); var dh = document.documentElement.scrollHeight; if (dh !== tick.dh) { tick.dh = dh; layout(); } }   /* the page grew or shrank: re-hang the keepsake */
  /* a quiet "?" once per section the student stays on, so they know he can help there */
  var s = findSpot();
  if (s !== spot) {                       /* a new part of the page: his old message goes away (Bethany, 3 Nov 2026) */
    var had = spot; spot = s; spot && (spot._t = t);
    if (had) { if (!panel.hidden) close(); if (popT > 0 && /Ask me/.test(pop.textContent)) { popT = 0; pop.hidden = true; } }
  }
  else if (s && s.ask && !seenSpot[s.sel || s.say] && t - s._t > 7000 && panel.hidden && popT <= 0) { seenSpot[s.sel || s.say] = 1; say('💡 Ask me!', 2200); }
  requestAnimationFrame(tick);
}

/* ── he hops into a workshop window (Bethany, 3 Nov 2026) ──
   The first time a window is on screen, he hops off the lift into it (the window has its own Leonardo);
   when the window scrolls away, he hops back onto the plank. Once per window per student, short, silent,
   never on small screens or with reduced motion. */
var away = null, fly = null, flyCv = null, HOPKEY = 'cwg-hop:' + location.pathname;
function hopped(id) { try { return (JSON.parse(localStorage.getItem(HOPKEY) || '{}'))[id]; } catch (e) { return false; } }
function markHop(id) { try { var o = JSON.parse(localStorage.getItem(HOPKEY) || '{}'); o[id] = 1; localStorage.setItem(HOPKEY, JSON.stringify(o)); } catch (e) {} }
function seenFrac(el) { var r = el.getBoundingClientRect(); if (!r.height) return 0; return Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / r.height; }
function winSpot(slot) { var c = slot.querySelector('canvas') || slot, r = c.getBoundingClientRect(); return { x: r.left + r.width * 0.95, y: r.top + r.height * 0.62, w: r.width }; }
function hop(slot, into, done) {
  if (!fly) { fly = el('<div class="cwg-fly" aria-hidden="true"></div>'); flyCv = document.createElement('canvas'); flyCv.width = 34; flyCv.height = 60; fly.appendChild(flyCv); root.appendChild(fly); }
  var m = man.getBoundingClientRect(), from = { x: m.left + m.width / 2, y: m.top + m.height / 2 }, t0 = performance.now(), D = 650;
  var fc = flyCv.getContext('2d'); fc.imageSmoothingEnabled = false; fc.clearRect(0, 0, 34, 60); fc.drawImage(CWART.person(G.who || 'leo', 0, 0, 0), 2, 2);
  if (into) { away = slot; man.classList.add('away'); man.disabled = true; close(); pop.hidden = true; }
  fly.style.display = 'block';
  (function step(now) {
    var k = Math.min(1, (now - t0) / D), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, w = winSpot(slot), a = into ? from : w, b = into ? w : from;
    var x = a.x + (b.x - a.x) * e, y = a.y + (b.y - a.y) * e - Math.sin(Math.PI * e) * 70;           // a little arc
    var grow = into ? 1 - 0.45 * e : 0.55 + 0.45 * e, fade = into ? (k > .75 ? 1 - (k - .75) / .25 : 1) : (k < .25 ? k / .25 : 1);
    fly.style.transform = 'translate(' + Math.round(x - 25) + 'px,' + Math.round(y - 45) + 'px) scale(' + grow.toFixed(3) + ')';
    fly.style.opacity = fade.toFixed(3);
    if (k < 1) requestAnimationFrame(step);
    else { fly.style.display = 'none'; if (into && done) done(); }
  })(t0);
}
/* Never two of him at once (Bethany, 3 Nov 2026): the window's thumbnail has no Leonardo. When the student presses
   play, he hops off the lift into the window and walks in; when the window scrolls away (or the tab changes),
   he leaves the window and is back on his plank. */
function leave(sl) { away = sl; man.classList.add('away'); man.disabled = true; close(); pop.hidden = true; }
function comeBack() { var w = away && away._win; away = null; man.classList.remove('away'); man.disabled = false; if (w && w.guideLeave) w.guideLeave(); }
function enterWindow(sl, walk) {
  if (away && away !== sl) comeBack();
  var quiet = compact || reduce || document.body.classList.contains('pq-clean') || G.hop === false || !root;
  if (quiet || !root) { if (root) leave(sl); walk(); return; }
  hop(sl, true, walk);
}
function checkHop() {
  var clean = document.body.classList.contains('pq-clean');
  if (away) { if (!away.offsetParent || clean || seenFrac(away) < 0.15) comeBack(); return; }
  if (clean) return;
  /* back to a window he was already in: he slips off the lift and is in the window again */
  [].slice.call(document.querySelectorAll('.cw-slot[data-win]')).some(function (sl) {
    var w = sl._win; if (!w || !w.wanted || w.guideIn || !sl.offsetParent || seenFrac(sl) < 0.3) return false;
    leave(sl); w.guideBack(); return true;
  });
}

function init(data) {
  if (!data || !window.CWART) return; G = data;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  build(); layout(); lastY = scrollY; lastT = performance.now(); onScroll(); shown = prog;
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', layout);
  var sw = window.switchTab; if (typeof sw === 'function') window.switchTab = function () { var r = sw.apply(this, arguments); close(); setTimeout(function () { onScroll(); layout(); }, 50); return r; };
  drawMan(); requestAnimationFrame(tick);
}
return { init: init, enterWindow: enterWindow };
})();
