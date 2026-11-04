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
  /* the stage svg is a group of pieces (they are buttons), not a picture: role=img would hide them from screen readers */
  function svg(w, h, parent, label) { var v = s('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h, role: 'group', 'aria-label': label || '' }, parent); return v; }
  /* an invisible hit area so a small piece is still easy to touch (≥ 44 css px when possible) */
  function hit(g, x, y, w, h) { return s('rect', { x: x, y: y, width: w, height: h, fill: 'transparent', stroke: 'none' }, g); }
  /* a drag ghost must never catch the pointer, or elementFromPoint finds the ghost instead of the drop target */
  function ghostify(gh) { gh.style.pointerEvents = 'none'; [].slice.call(gh.querySelectorAll('[pointer-events]')).forEach(function (n) { n.removeAttribute('pointer-events'); }); [].slice.call(gh.querySelectorAll('[style]')).forEach(function (n) { n.style.pointerEvents = 'none'; }); return gh; }
  function pt(svgEl, e) { var p = svgEl.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var m = svgEl.getScreenCTM(); return m ? p.matrixTransform(m.inverse()) : { x: 0, y: 0 }; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function fmt(n, dp) { if (dp != null) n = Number(Number(n).toFixed(dp)); return Number(n).toLocaleString('en-US', { maximumFractionDigits: 6 }); }
  function frac(n, d) { return '<span class="fr"><span>' + n + '</span><span>' + d + '</span></span>'; }
  /* n/d as mixed number html (whole + fraction), stacked */
  function mixed(n, d) { if (d === 0) return '—'; var w = Math.floor(n / d), r = n - w * d; if (r === 0) return '' + w; if (w === 0) return frac(r, d); return '<span class="mixed">' + w + frac(r, d) + '</span>'; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* keyboard + click for svg shapes. key (optional) is a stable id (data-k) so focus comes back to the same piece after a redraw.
     Taps are ignored for a moment after a drag ends (dragDone), so the click that follows a drop doesn't also fire. */
  var dragUntil = 0;
  function dragDone(ms) { dragUntil = Date.now() + (ms || 300); }
  function tap(node, fn, label, key) {
    node.setAttribute('tabindex', '0'); node.setAttribute('role', 'button'); node.classList.add('om-tap'); if (label) node.setAttribute('aria-label', label); if (key != null) node.setAttribute('data-k', key);
    node.addEventListener('click', function (e) { if (Date.now() < dragUntil) return; fn(e); });
    node.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } });
  }
  /* arrow keys on an svg handle (a slider). value() returns the text a screen reader should hear ("7.3 centimeters"). */
  function keys(node, fn, label, key, value) {
    node.setAttribute('tabindex', '0'); node.setAttribute('role', 'slider'); node.classList.add('om-tap'); if (label) node.setAttribute('aria-label', label); if (key != null) node.setAttribute('data-k', key);
    var set = function () { if (value) { var v = value(); node.setAttribute('aria-valuetext', String(v)); node.setAttribute('aria-valuenow', parseFloat(v) || 0); } };
    set();
    node.addEventListener('keydown', function (e) { var d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]; if (d) { e.preventDefault(); fn(d, e); set(); } });
    return set;
  }
  /* dragTap(svgEl, node, onTap, onDrop, label, key): a piece you can drag (a ghost follows the finger) and tap.
     onDrop(p, p0, ev) returns true when it changed the state; otherwise the ghost flies back. */
  function dragTap(svgEl, node, onTap, onDrop, label, key) {
    if (onTap) tap(node, function (e) { if (e && e.stopPropagation) e.stopPropagation(); onTap(e); }, label, key);
    else { if (label) node.setAttribute('aria-label', label); if (key != null) node.setAttribute('data-k', key); }
    node.style.cursor = 'grab';
    node.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return; e.preventDefault(); e.stopPropagation();
      var id = e.pointerId, p0 = pt(svgEl, e), moved = false, ghost = null, orig = node.getAttribute('transform') || '';
      try { node.setPointerCapture(id); } catch (x) {}
      function mv(ev) {
        if (ev.pointerId !== id) return; var p = pt(svgEl, ev);
        if (!moved && Math.hypot(p.x - p0.x, p.y - p0.y) > 6) { moved = true; ghost = ghostify(node.cloneNode(true)); ghost.removeAttribute('tabindex'); ghost.removeAttribute('data-k'); ghost.setAttribute('opacity', '0.92'); svgEl.appendChild(ghost); node.style.opacity = '0.25'; }
        if (moved) ghost.setAttribute('transform', 'translate(' + (p.x - p0.x) + ' ' + (p.y - p0.y) + ') ' + orig);
      }
      function up(ev) {
        if (ev.pointerId !== id) return;
        node.removeEventListener('pointermove', mv); node.removeEventListener('pointerup', up); node.removeEventListener('pointercancel', up);
        if (!moved) return; dragDone();
        var pe = pt(svgEl, ev), ok = false;
        try { ok = onDrop(pe, p0, ev) === true; } catch (err) { if (window.console) console.error(err); }
        if (ok) { if (ghost.parentNode) ghost.remove(); return; }
        var dx = pe.x - p0.x, dy = pe.y - p0.y;
        anim(ghost, { tx: dx, ty: dy }, { tx: 0, ty: 0 }, 300, function () { ghost.remove(); node.style.opacity = ''; });
      }
      node.addEventListener('pointermove', mv); node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
    });
  }
  /* ghostDrag(svg, node, busy, drop, mk, onMove): drag a clone; drop(targetElement, p, p0) returns true when it changed the state.
     mk() can build a custom ghost {el, hide:[nodes], par} (used for lasso groups). */
  function ghostDrag(svgEl, node, busy, drop, mk, onMove) {
    node.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || (busy && busy())) return;
      e.preventDefault(); e.stopPropagation();
      var id = e.pointerId, p0 = pt(svgEl, e), moved = false, ghost = null, hide = [node];
      try { node.setPointerCapture(id); } catch (x) {}
      function mv(ev) {
        if (ev.pointerId !== id) return;
        if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) > 6) {
          moved = true; var m = mk ? mk() : null;
          ghost = m ? m.el : node.cloneNode(true); if (m && m.hide) hide = m.hide;
          ghostify(ghost); if (ghost.removeAttribute) { ghost.removeAttribute('tabindex'); ghost.removeAttribute('data-k'); }
          ((m && m.par) || node.parentNode).appendChild(ghost); hide.forEach(function (h) { h.style.opacity = '.3'; });
        }
        if (ghost) { var p = pt(svgEl, ev); ghost._tx = p.x - p0.x; ghost._ty = p.y - p0.y; ghost.setAttribute('transform', 'translate(' + ghost._tx + ' ' + ghost._ty + ')'); if (onMove) onMove(p, ev); }
      }
      function up(ev) {
        if (ev.pointerId !== id) return;
        node.removeEventListener('pointermove', mv); node.removeEventListener('pointerup', up); node.removeEventListener('pointercancel', up);
        if (!moved) return;
        dragDone();
        var t = ev.type === 'pointercancel' ? null : document.elementFromPoint(ev.clientX, ev.clientY);
        if (drop(t, pt(svgEl, ev), p0)) { ghost.remove(); return; }
        anim(ghost, { tx: ghost._tx, ty: ghost._ty }, { tx: 0, ty: 0 }, 220, function () { ghost.remove(); hide.forEach(function (h) { h.style.opacity = ''; }); });
      }
      node.addEventListener('pointermove', mv); node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
    });
  }
  /* lasso: drag on an empty spot of `area` to draw a box; done(list of nodes whose centers are inside) */
  function lasso(svgEl, area, getNodes, done) {
    area.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      var id = e.pointerId, p0 = pt(svgEl, e), c0 = [e.clientX, e.clientY], box = null;
      try { area.setPointerCapture(id); } catch (x) {}
      function mv(ev) {
        if (ev.pointerId !== id) return;
        var p = pt(svgEl, ev);
        if (!box && Math.hypot(ev.clientX - c0[0], ev.clientY - c0[1]) > 6) box = s('rect', { fill: 'rgba(242,183,5,.15)', stroke: '#F2B705', 'stroke-width': 2, 'stroke-dasharray': '6 4', rx: 6, 'pointer-events': 'none' }, svgEl);
        if (box) { box.setAttribute('x', Math.min(p.x, p0.x)); box.setAttribute('y', Math.min(p.y, p0.y)); box.setAttribute('width', Math.abs(p.x - p0.x)); box.setAttribute('height', Math.abs(p.y - p0.y)); }
      }
      function up(ev) {
        if (ev.pointerId !== id) return;
        area.removeEventListener('pointermove', mv); area.removeEventListener('pointerup', up); area.removeEventListener('pointercancel', up);
        var x1 = Math.min(c0[0], ev.clientX), x2 = Math.max(c0[0], ev.clientX), y1 = Math.min(c0[1], ev.clientY), y2 = Math.max(c0[1], ev.clientY);
        if (box) { box.remove(); dragDone(); }
        done(box ? getNodes().filter(function (n) { var r = n.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2; }) : []);
      }
      area.addEventListener('pointermove', mv); area.addEventListener('pointerup', up); area.addEventListener('pointercancel', up);
    });
  }
  /* a group of clones of nodes, for dragging several pieces at once */
  function cloneGroup(nodes, par) { var g = s('g', {}); nodes.forEach(function (n) { var c = n.cloneNode(true); c.removeAttribute('tabindex'); c.removeAttribute('data-k'); if (n._tx || n._ty) c.removeAttribute('transform'); g.appendChild(c); }); return { el: g, hide: nodes, par: par }; }
  /* rootDrag(svg, {down(p,e)->ctx|null, move(p,ctx,moved), up(p,ctx,moved)}): pointer drag on the svg root so children can be redrawn mid-drag */
  function rootDrag(v, h) {
    var ctx = null, id = null, sx, sy, moved;
    v.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || ctx) return; var c = h.down(pt(v, e), e); if (c == null) return;
      e.preventDefault(); ctx = c; id = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false; try { v.setPointerCapture(id); } catch (x) {}
    });
    v.addEventListener('pointermove', function (e) { if (e.pointerId !== id || !ctx) return; if (Math.hypot(e.clientX - sx, e.clientY - sy) > 4) moved = true; if (h.move) h.move(pt(v, e), ctx, moved); });
    function up(e) { if (e.pointerId !== id || !ctx) return; var c = ctx; ctx = null; id = null; if (moved) dragDone(); if (h.up) h.up(pt(v, e), c, moved); }
    v.addEventListener('pointerup', up); v.addEventListener('pointercancel', up);
  }
  /* focus memory: before a redraw remember which piece had focus (by data-k, else by label + index); after, focus the matching new node */
  function focusKey(stage) {
    var a = document.activeElement; if (!a || !stage || !stage.contains(a)) return null;
    var k = a.getAttribute('data-k'); if (k != null) return { k: k };
    var lab = a.getAttribute('aria-label'); if (!lab) return null;
    var same = [].slice.call(stage.querySelectorAll('[aria-label]')).filter(function (n) { return n.getAttribute('aria-label') === lab; });
    return { lab: lab, i: same.indexOf(a) };
  }
  function refocus(stage, f) {
    if (!f || !stage) return;
    var n = null;
    if (f.k != null) n = stage.querySelector('[data-k="' + String(f.k).replace(/"/g, '\\"') + '"]');
    else { var same = [].slice.call(stage.querySelectorAll('[aria-label]')).filter(function (x) { return x.getAttribute('aria-label') === f.lab; }); n = same[f.i] || same[0]; }
    if (n && n.focus) { try { n.focus({ preventScroll: true }); } catch (e) { n.focus(); } }
  }

  /* ---------- state <-> url ---------- */
  function b64(bytes) { return btoa(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64(t) { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; return atob(t); }
  /* LZW (12-bit codes) over the byte string, so long states (pen ink, whiteboard, problem sets) make shorter links and smaller QR codes.
     Compressed links start with '~'; plain base64url JSON links (every link made before Nov 2026) still decode. */
  function lzw(str) {
    var dict = {}, next = 256, w = '', out = [], i, c;
    for (i = 0; i < 256; i++) dict[String.fromCharCode(i)] = i;
    for (i = 0; i < str.length; i++) {
      c = str.charAt(i);
      if (dict[w + c] !== undefined) w += c;
      else { out.push(dict[w]); if (next < 4096) dict[w + c] = next++; else { dict = {}; for (var k = 0; k < 256; k++) dict[String.fromCharCode(k)] = k; next = 256; } w = c; }
    }
    if (w !== '') out.push(dict[w]);
    var bytes = '', acc = 0, bits = 0;
    out.forEach(function (code) { acc = (acc << 12) | code; bits += 12; while (bits >= 8) { bits -= 8; bytes += String.fromCharCode((acc >> bits) & 255); } });
    if (bits > 0) bytes += String.fromCharCode((acc << (8 - bits)) & 255);
    return bytes;
  }
  function unlzw(bytes) {
    var codes = [], acc = 0, bits = 0, i;
    for (i = 0; i < bytes.length; i++) { acc = ((acc << 8) | bytes.charCodeAt(i)) & 0xFFFFF; bits += 8; if (bits >= 12) { bits -= 12; codes.push((acc >> bits) & 4095); } }
    var dict = [], next = 256, w, out = '', entry;
    for (i = 0; i < 256; i++) dict[i] = String.fromCharCode(i);
    w = dict[codes[0]]; out = w;
    for (i = 1; i < codes.length; i++) {
      var code = codes[i];
      if (next >= 4096) { dict.length = 256; next = 256; w = dict[code]; if (w === undefined) throw new Error('bad code'); out += w; continue; } /* the encoder reset its table here */
      if (dict[code] !== undefined) entry = dict[code]; else if (code === next) entry = w + w.charAt(0); else throw new Error('bad code');
      out += entry;
      dict[next++] = w + entry.charAt(0);
      w = entry;
    }
    return out;
  }
  function enc(o) {
    var raw = unescape(encodeURIComponent(JSON.stringify(o))), plain = b64(raw);
    if (raw.length < 120) return plain;
    try { var z = '~' + b64(lzw(raw)); return z.length < plain.length ? z : plain; } catch (e) { return plain; }
  }
  function dec(t) {
    try {
      if (t.charAt(0) === '~') return JSON.parse(decodeURIComponent(escape(unlzw(unb64(t.slice(1))))));
      return JSON.parse(decodeURIComponent(escape(unb64(t))));
    } catch (e) { return null; }
  }
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
    if (o.steps && o.steps.length) h += '<p style="margin:6px 0 2px"><strong>' + (o.es ? 'Cómo se usa:' : 'How to use it:') + '</strong></p><ol style="margin:0 0 6px 20px;padding:0">' + o.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>';
    if (o.tries && o.tries.length) h += '<p style="margin:6px 0 2px"><strong>' + (o.es ? 'Tus herramientas:' : 'Your tools:') + '</strong></p><ul style="margin:0 0 6px 20px;padding:0">' + o.tries.map(function (t) { return '<li>' + (t[0] ? '<strong>' + esc(t[0]) + ':</strong> ' : '') + esc(t[1]) + '</li>'; }).join('') + '</ul>';
    h += '<p style="margin:6px 0 0;font-size:.9em">' + (o.es ? 'Si te equivocas, toca <strong>Empezar de nuevo</strong>. Si necesitas más espacio, toca <strong>Pantalla completa</strong>.' : 'Made a mistake? Tap <strong>Start over</strong>. Want more room? Tap <strong>Full screen</strong>.') + '</p></div>';
    return h;
  }
  /* Spanish copies of the student directions live in OAOM_DATA.howEs; a link with &lang=es shows them */
  function howFor(m) { return (params.get('lang') === 'es' && window.OAOM_DATA && OAOM_DATA.howEs && OAOM_DATA.howEs[m.id]) || m.how || []; }
  function whatFor(m) { return (params.get('lang') === 'es' && window.OAOM_DATA && OAOM_DATA.whatEs && OAOM_DATA.whatEs[m.id]) || m.what || ''; }

  /* ---------- share modal (used by tool page + library) ---------- */
  var modal;
  /* ---------- My saved setups (teacher, this browser only) ----------
     localStorage 'oaom.saved' = [{id, name, t, s, at}]  (t = tool id, s = tool state) */
  var saved = {
    list: function () { try { return JSON.parse(localStorage.getItem('oaom.saved') || '[]'); } catch (e) { return []; } },
    put: function (arr) { try { localStorage.setItem('oaom.saved', JSON.stringify(arr)); return true; } catch (e) { return false; } },
    add: function (name, t, s) { var a = saved.list(); var it = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: name, t: t, s: s, at: new Date().toISOString() }; a.unshift(it); return saved.put(a) ? it : null; },
    remove: function (id) { saved.put(saved.list().filter(function (x) { return x.id !== id; })); },
    rename: function (id, name) { saved.put(saved.list().map(function (x) { if (x.id === id) x.name = name; return x; })); }
  };
  function addSt(u) { return /[?&]st=1/.test(u) ? u : u.replace(/(\?[^#]*)/, '$1&st=1'); }
  /* ---------- Turn in my work (students): a picture + a link to their exact work ---------- */
  /* picture of the tool: every svg drawn where it sits on the stage (pen ink on top); opts = {title, date, totals} */
  function workPicture(done, opts) {
    opts = Object.assign({ title: true, date: true, totals: true, clean: false }, opts || {});
    var stage = $('#om-stage'), sr = stage.getBoundingClientRect();
    var svgs = [].slice.call(stage.querySelectorAll('svg')).filter(function (v) { var r = v.getBoundingClientRect(); return r.width > 30 && r.height > 20 && v.parentNode.closest('svg') === null && (v.id !== 'om-ink' || (cur && cur.S._ink && cur.S._ink.length)); });
    svgs.sort(function (a, b) { return (a.id === 'om-ink') - (b.id === 'om-ink'); });
    var title = (cur ? meta(cur.id).name : 'Math tool');
    var readout = !opts.totals || document.body.classList.contains('hide-nums') || !$('#om-readout') ? '' : ([].map.call($('#om-readout').children, function (x) { return x.textContent.trim(); }).filter(Boolean).join('    ') || $('#om-readout').textContent.trim());
    var sc = 2, pad = 24, parts = [], minX = 1e9, minY = 1e9, maxX = 0, maxY = 0;
    svgs.forEach(function (v) { var r = v.getBoundingClientRect(), x = r.left - sr.left, y = r.top - sr.top;
      if (v.id === 'om-ink') { parts.push({ v: v, x: x, y: y, w: r.width, h: r.height, ink: true }); return; }
      parts.push({ v: v, x: x, y: y, w: r.width, h: r.height }); minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x + r.width); maxY = Math.max(maxY, y + r.height); });
    if (minX > maxX) { minX = 0; minY = 0; maxX = 420; maxY = 200; }
    var head = (opts.title ? 34 : 0) + (opts.date ? 20 : 0) + (opts.title || opts.date ? 12 : 0);
    var W = Math.max(maxX - minX, 300) + pad * 2, H = head + (maxY - minY) + (readout ? 56 : 0) + pad * 2;
    var cv = document.createElement('canvas'); cv.width = W * sc; cv.height = H * sc; var g = cv.getContext('2d'); g.scale(sc, sc);
    g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
    var ty = pad; if (opts.title) { g.fillStyle = '#0E1C42'; g.font = 'bold 22px Nunito, Arial, sans-serif'; g.fillText(title, pad, ty + 22); ty += 34; }
    if (opts.date) { g.font = '13px Nunito, Arial, sans-serif'; g.fillStyle = '#5B6478'; g.fillText(new Date().toLocaleString(), pad, ty + 14); ty += 20; }
    var oy = pad + head - minY, ox = pad - minX, i = 0;
    (function next() {
      if (i >= parts.length) {
        if (readout) { var ry = oy + maxY + 14; g.fillStyle = '#EFE9FB'; g.fillRect(pad, ry, W - pad * 2, 40); g.fillStyle = '#0E1C42'; g.font = 'bold 17px Nunito, Arial, sans-serif'; g.fillText(readout.slice(0, 95), pad + 12, ry + 27); }
        done(cv); return;
      }
      var p = parts[i++], cl = p.v.cloneNode(true); cl.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); cl.setAttribute('width', p.w); cl.setAttribute('height', p.h);
      /* clean picture: no tray, no small buttons (tools mark those with data-ui="tray" / data-ui="btn") */
      if (opts.clean) [].slice.call(cl.querySelectorAll('[data-ui]')).forEach(function (n) { n.remove(); });
      var st = document.createElementNS('http://www.w3.org/2000/svg', 'style'); st.textContent = 'text{font-family:Nunito,Arial,sans-serif;font-weight:700}'; cl.insertBefore(st, cl.firstChild);
      var img = new Image(); img.onload = function () { g.drawImage(img, ox + p.x, oy + p.y, p.w, p.h); next(); }; img.onerror = function () { next(); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(cl));
    })();
  }
  /* ---------- Download picture (teacher): PNG or JPEG for slides and anchor charts ---------- */
  function picture() {
    if (!cur) return;
    if (!modal) { modal = el('div', { class: 'om-modal', hidden: '' }); document.body.appendChild(modal); modal.addEventListener('click', function (e) { if (e.target === modal) closeShare(); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeShare(); }); }
    var opt = { title: false, date: false, totals: true, clean: true };
    modal.innerHTML = '<div class="om-dialog" role="dialog" aria-modal="true" aria-labelledby="om-pic-t"><h2 id="om-pic-t">Download a picture</h2>' +
      '<p class="sub">A picture of the tool just as it looks now, for slides, anchor charts or a Canvas page.</p>' +
      '<div class="om-row" style="margin:0 0 .4rem"><label class="om-check"><input type="checkbox" data-o="title"> Tool name on top</label><label class="om-check"><input type="checkbox" data-o="totals" checked> Totals under the tool</label><label class="om-check"><input type="checkbox" data-o="clean" checked> Clean picture (no tray or buttons)</label></div>' +
      '<div class="om-tipic"><p class="om-hint">Making the picture…</p></div>' +
      '<div class="om-row"><button class="om-btn small primary" data-k="png">Download PNG</button><button class="om-btn small" data-k="jpg">Download JPEG</button><button class="om-btn small" data-k="copy">Copy picture</button></div>' +
      '<p class="om-hint">PNG stays sharp in slides. JPEG makes a smaller file. Tip: Hide totals first if the picture should not show the answer.</p>' +
      '<div class="om-row" style="justify-content:flex-end"><button class="om-btn small" data-x>Close</button></div></div>';
    modal.hidden = false; modal.querySelector('[data-x]').onclick = closeShare;
    var canvas = null, name = meta(cur.id).name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    function render() { workPicture(function (cv) { canvas = cv; var box = modal.querySelector('.om-tipic'); box.innerHTML = ''; var im = new Image(); im.src = cv.toDataURL('image/png'); im.alt = 'Picture of the tool'; box.appendChild(im); }, opt); }
    [].forEach.call(modal.querySelectorAll('[data-o]'), function (b) { b.onchange = function () { opt[b.dataset.o] = b.checked; render(); }; });
    function dl(type, ext) { if (!canvas) return; var a = el('a', { href: canvas.toDataURL(type, 0.92), download: name + '.' + ext }); document.body.appendChild(a); a.click(); a.remove(); }
    modal.querySelector('[data-k="png"]').onclick = function () { dl('image/png', 'png'); };
    modal.querySelector('[data-k="jpg"]').onclick = function () { dl('image/jpeg', 'jpg'); };
    modal.querySelector('[data-k="copy"]').onclick = function () { if (!canvas) return; if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) canvas.toBlob(function (b) { navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]).then(function () { toast('Picture copied. Paste it into your slide.'); }, function () { toast('Copying didn’t work here. Use Download PNG.'); }); }); else toast('Use Download PNG in this browser.'); };
    render();
  }
  function turnIn() {
    if (!cur) return;
    if (!modal) { modal = el('div', { class: 'om-modal', hidden: '' }); document.body.appendChild(modal); modal.addEventListener('click', function (e) { if (e.target === modal) closeShare(); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeShare(); }); }
    var link = addSt(toolURL(cur.id, cur.S));
    modal.innerHTML = '<div class="om-dialog" role="dialog" aria-modal="true" aria-labelledby="om-ti-t"><h2 id="om-ti-t">' + (document.body.classList.contains('student') ? 'Turn in my work' : 'Save this work') + '</h2>' +
      '<p class="sub">Send your teacher a picture of your work, or a link that opens it just the way it is now. Paste it where your teacher asked: a Canvas assignment, a discussion, or the chat.</p>' +
      '<div class="om-tipic"><p class="om-hint">Making your picture…</p></div>' +
      '<div class="om-row"><button class="om-btn small primary" data-k="copyimg">Copy picture</button><button class="om-btn small" data-k="dl">Download picture</button><button class="om-btn small primary" data-k="copylink">Copy link to my work</button></div>' +
      '<p class="om-hint">Tip: in a Canvas assignment, choose <b>File Upload</b> for the picture, or <b>Website URL</b> for the link.</p>' +
      '<div class="om-row" style="justify-content:flex-end"><button class="om-btn small" data-x>Close</button></div></div>';
    modal.hidden = false; modal.querySelector('[data-x]').onclick = closeShare;
    modal.querySelector('[data-k="copylink"]').onclick = function () { copy(link, 'Link to your work copied'); };
    workPicture(function (cv) {
      var box = modal.querySelector('.om-tipic'); box.innerHTML = ''; var im = new Image(); im.src = cv.toDataURL('image/png'); im.alt = 'Picture of my work'; box.appendChild(im);
      var name = meta(cur.id).name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '-my-work.png';
      modal.querySelector('[data-k="dl"]').onclick = function () { var a = el('a', { href: im.src, download: name }); document.body.appendChild(a); a.click(); a.remove(); };
      modal.querySelector('[data-k="copyimg"]').onclick = function () {
        if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) cv.toBlob(function (b) { navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]).then(function () { toast('Picture copied. Paste it with Ctrl+V.'); }, function () { toast('Copying didn’t work here. Use Download picture.'); }); });
        else toast('Copying pictures doesn’t work in this browser. Use Download picture.');
      };
    }, { clean: true });
  }

  function share(o) { /* o = {title, url, boardUrl, embedUrl} */
    if (!modal) { modal = el('div', { class: 'om-modal', hidden: '' }); document.body.appendChild(modal); modal.addEventListener('click', function (e) { if (e.target === modal) closeShare(); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeShare(); }); }
    /* every link a teacher shares is a student link: it opens without the way back to the library */
    o = Object.assign({}, o, { url: addSt(o.url) });
    var orig = o; if (o.plain) { o = Object.assign({}, o, { url: o.url.replace(/(\?[^#]*)/, '$1&plain=1'), dir: null, note: 'A plain tool: no directions, ready for students to explore.' }); }
    var embedUrl = o.embedUrl || (o.url + (o.url.indexOf('#') > -1 ? '' : '')).replace(/(\?[^#]*)/, '$1&embed=1');
    var boardUrl = o.boardUrl || o.url.replace(/(\?[^#]*)/, '$1&board=1');
    var iframe = '<iframe src="' + embedUrl + '" title="' + esc(o.title) + '" width="100%" height="680" style="border:0;max-width:100%" allow="fullscreen; clipboard-write" allowfullscreen></iframe>';
    var isEs = /[?&]lang=es/.test(o.url), d = isEs && o.dirEs ? o.dirEs : o.dir;
    var dirs = d ? directions(Object.assign({}, d, { es: isEs })) : '';
    var embed = dirs + iframe;
    modal.innerHTML = '<div class="om-dialog" role="dialog" aria-modal="true" aria-labelledby="om-sh-t">' +
      '<h2 id="om-sh-t">Share: ' + esc(o.title) + '</h2><p class="sub">' + (o.note || 'The link opens the tool set up exactly the way it looks right now.') + '</p>' +
      '<div class="om-row" style="margin:0 0 .5rem;gap:.3rem 1rem"><label class="om-check" style="margin:0"><input type="checkbox" id="om-incdir"' + (orig.plain ? '' : ' checked') + '> Include the how-to directions</label>' +
      (o.hasState ? '<label class="om-check" style="margin:0" title="The total stays hidden until the student taps “I said it”"><input type="checkbox" id="om-sayfirst"' + (o.sayFirst ? ' checked' : '') + '> Students say it before they see the total</label>' : '') +
      (o.hasEs ? '<label class="om-check" style="margin:0"><input type="checkbox" id="om-es"' + (/[?&]lang=es/.test(o.url) ? ' checked' : '') + '> Directions in Spanish</label>' : '') + '</div>' +
      '<div class="om-sharegrid"><div>' +
      '<div class="om-label">Student link</div><div class="om-copy"><input readonly value="' + esc(o.url) + '" aria-label="Student link"><button class="om-btn small primary" data-c="0">Copy</button></div>' +
      '<div class="om-label">Big-screen link (for live class)</div><div class="om-copy"><input readonly value="' + esc(boardUrl) + '" aria-label="Big-screen link"><button class="om-btn small" data-c="1">Copy</button></div>' +
      '<div class="om-label">Canvas embed code (student directions + tool)</div><div class="om-copy"><textarea rows="4" readonly aria-label="Canvas embed code">' + esc(embed) + '</textarea><button class="om-btn small" data-c="2">Copy</button></div>' +
      '<p class="om-hint">In Canvas: Edit the page → open the HTML editor (&lt;/&gt;) → paste. The directions show above the tool.</p>' +
      (dirs ? '<details class="om-dirprev"><summary class="om-label">See the student directions</summary>' + dirs + '<div class="om-row"><button class="om-btn small" data-c="3">Copy directions only</button></div></details>' : '') +
      '</div><div class="om-qr"><div class="om-label">QR code</div><div class="qrbox"></div><button class="om-btn small" data-dl>Download QR</button></div></div>' +
      '<div class="om-row" style="justify-content:flex-end"><a class="om-btn small" target="_blank" rel="noopener" href="' + esc(o.url) + '">Open in new tab ↗</a><button class="om-btn small" data-x>Close</button></div></div>';
    var vals = [o.url, boardUrl, embed, dirs];
    modal.querySelector('#om-incdir').onchange = function () { share(Object.assign({}, orig, { plain: !this.checked })); };
    var sf = modal.querySelector('#om-sayfirst'); if (sf) sf.onchange = function () { share(Object.assign({}, orig, { sayFirst: this.checked, url: orig.rebuild(this.checked) })); };
    var esb = modal.querySelector('#om-es'); if (esb) esb.onchange = function () { var on = this.checked, u = orig.url.replace(/&lang=es/, ''); share(Object.assign({}, orig, { url: on ? u.replace(/(\?[^#]*)/, '$1&lang=es') : u })); };
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

  /* undo / redo: snapshots of the tool's state, per tool */
  var hist = { id: null, past: [], future: [], last: null };
  function histReset(id, S) { hist = { id: id, past: [], future: [], last: JSON.stringify(S) }; paintHist(); }
  function histCommit() { if (!cur) return; var now = JSON.stringify(cur.S); if (now === hist.last) return; hist.past.push(hist.last); if (hist.past.length > 60) hist.past.shift(); hist.future = []; hist.last = now; paintHist(); }
  function paintHist() { var u = $('#om-undo'), r = $('#om-redo'); if (u) u.disabled = !hist.past.length; if (r) r.disabled = !hist.future.length; }
  function undo() { if (!cur || !hist.past.length) return; hist.future.push(hist.last); var s = hist.past.pop(); hist.last = s; mount(cur.id, JSON.parse(s), true); saveNow(); }
  function redo() { if (!cur || !hist.future.length) return; hist.past.push(hist.last); var s = hist.future.pop(); hist.last = s; mount(cur.id, JSON.parse(s), true); saveNow(); }
  function saveNow() { if (!cur) return; if (!params.get('lesson')) history.replaceState(null, '', '#s=' + enc(cur.S)); else if (cur.lessonStates) cur.lessonStates[cur.tab] = clone(cur.S); paintHist(); }

  /* one window resize listener owned by core; tools register with api.onResize and core forgets them on the next mount */
  var resizeFns = [], cleanupFns = [];
  window.addEventListener('resize', function () { resizeFns.slice().forEach(function (f) { try { f(); } catch (e) { if (window.console) console.error(e); } }); });
  function mount(id, state, keepHist) {
    var def = tools[id]; var m = meta(id);
    var stage = $('#om-stage'), side = $('#om-setup'), sayEl = $('#om-say'), out = $('#om-readout');
    cleanupFns.splice(0).forEach(function (f) { try { f(); } catch (e) {} }); resizeFns.length = 0;
    stage.innerHTML = ''; side.innerHTML = ''; sayEl.innerHTML = ''; out.innerHTML = '';
    if (!def) { stage.innerHTML = '<p>That tool was not found. <a href="index.html">Go to the library</a>.</p>'; return; }
    var S = Object.assign(clone(def.defaults || {}), state || {});
    var prevInitial = keepHist && cur ? cur.initial : null, prevL = cur ? { lessonId: cur.lessonId, lessonStates: cur.lessonStates, tab: cur.tab } : {};
    cur = { id: id, def: def, S: S, initial: prevInitial || clone(S) };
    if (keepHist) Object.assign(cur, prevL);
    if (!keepHist) histReset(id, S);
    document.title = m.name + ' · OAO Math Tools';
    $('#om-title').textContent = m.name;
    var hl = $('#om-howlist'); if (hl) hl.innerHTML = howFor(m).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    var hll = $('#om-howlinks');
    if (hll) { var D = window.OAOM_DATA || {}, isStu = document.body.classList.contains('student'), links = '';
      if (D.gifs && D.gifs.indexOf(m.id) > -1) links += '<a class="om-howlink gif" href="howto.html#' + m.id + '" target="_blank" rel="noopener">\u25B6 Watch how it works</a>';
      if (!isStu && D.teach && D.teach[m.id]) links += '<a class="om-howlink teach" href="' + esc(D.teach[m.id].url) + '" target="_blank" rel="noopener">\uD83D\uDCD8 ' + esc(D.teach[m.id].label) + ' \u2197</a>';
      hll.innerHTML = links; }
    var lrn = $('#om-learn'), lv = $('#om-learnv');
    if (lrn && lv) { var SV = (window.OAOM_DATA || {}).stuvid || {}, vf = SV[m.id];
      lrn.hidden = !vf; if (!vf) { lrn.open = false; lv.removeAttribute('src'); lv.load(); }
      else if (lv.getAttribute('src') !== 'videos/student/' + vf + '.mp4') { lv.setAttribute('src', 'videos/student/' + vf + '.mp4'); lv.setAttribute('aria-label', 'One-minute video: how to use ' + m.name);
        if (params.get('learn') === '1') { lrn.open = true; var hw = $('#om-how'); if (hw) hw.open = false; } }
      if (!lrn._wired) { lrn._wired = 1; lrn.addEventListener('toggle', function () { if (!lrn.open) lv.pause(); }); } }
    document.body.classList.toggle('hide-nums', S._r === 0);
    var bt = $('#om-nums'); if (bt) bt.setAttribute('aria-pressed', S._r === 0 ? 'true' : 'false');
    var redrawFn = function () {}, into = side, isStu = document.body.classList.contains('student');
    var sayFirst = isStu && S._say === 1, said = false, lastSay = '';
    var api = {
      S: S, stage: stage, setup: side, board: document.body.classList.contains('board'), student: isStu,
      /* the one line of directions over the tool, with a 🔊 button that reads it (and the total) aloud */
      say: function (t) { t = t || ''; if (t === lastSay) return; lastSay = t; sayEl.innerHTML = t ? '<span class="om-saytext">' + t + '</span> <button type="button" class="om-speak om-noprint" aria-label="Read this to me" title="Read to me">🔊</button>' : '';
        var b = sayEl.querySelector('.om-speak'); if (b) b.onclick = function () { speak((sayEl.querySelector('.om-saytext') || sayEl).textContent + '. ' + ((!document.body.classList.contains('hide-nums') && out.textContent) || '')); }; },
      /* the live readout. With "say it first" on a student link it stays covered until the student taps "I said it", and covers again after each change */
      readout: function (h) {
        h = h || ''; if (!sayFirst) { out.innerHTML = h; return; }
        if (!h) { out.innerHTML = ''; return; }
        if (said && out.dataset.html === h) return;
        out.dataset.html = h; said = false;
        out.innerHTML = '<button type="button" class="om-btn small primary om-said">I said it. Show me.</button><span class="om-hint" style="margin:0">Say what the tool shows first.</span>';
        out.querySelector('.om-said').onclick = function () { said = true; out.innerHTML = h; };
      },
      /* onResize(fn): redraw when the window changes size; core removes it when the tool is remounted (no leaks, no cross-talk between tabs) */
      onResize: function (f) { resizeFns.push(f); },
      onCleanup: function (f) { cleanupFns.push(f); },
      /* teacherOnly(el): a setup field that holds an answer (a mystery weight, a target angle). Hidden on student links and when totals are hidden. */
      teacherOnly: function (n) { var f = n && n.closest ? (n.closest('.om-field, .om-check') || n) : n; if (f) f.classList.add('om-teach'); return n; },
      /* report(o): the tool's current answer(s) as strings, e.g. {v:'2407'}; checked against the goal S._g */
      report: function (o) { cur.rep = o || {}; goalCheck(); },
      changed: function () { clearTimeout(saveT); saveT = setTimeout(function () { histCommit(); saveNow(); }, 250); },
      onRedraw: function (f) { redrawFn = f; },
      /* redraw keeps keyboard focus on the same piece (by data-k, else by label) even though the tool rebuilds its svg */
      redraw: function () { var f = focusKey(stage); redrawFn(); refocus(stage, f); api.changed(); },
      /* quick(presets): one-tap setups shown at the top of Set up. presets = [[label, {state keys}], ...] */
      quick: function (presets, label) {
        var box = el('div', { class: 'om-quick' }, '<h3>' + (label || 'Quick setup') + '</h3>'); var g = el('div', { class: 'om-seg' });
        presets.forEach(function (p) { var b = el('button', { type: 'button' }, p[0]); b.onclick = function () { var ns = Object.assign(clone(S), clone(p[1])); mount(id, ns); cur.initial = clone(cur.S); if (!params.get('lesson')) history.replaceState(null, '', '#s=' + enc(cur.S)); }; g.appendChild(b); });
        box.appendChild(g); side.insertBefore(box, side.firstChild); return box;
      },
      /* more(label): everything added after this goes in a folded "More options" box until endMore() */
      more: function (label) { var d = el('details', { class: 'om-more' }, '<summary>' + (label || 'More options') + '</summary>'); side.appendChild(d); into = d; return d; },
      endMore: function () { into = side; },
      heading: function (t) { into.appendChild(el('h3', null, t)); },
      hint: function (t) { into.appendChild(el('p', { class: 'om-hint' }, t)); },
      num: function (label, key, min, max, step, after) {
        var f = el('label', { class: 'om-field' }, '<span>' + label + '</span>'); var i = el('input', { type: 'number', min: min, max: max, step: step || 1, value: S[key] });
        i.addEventListener('change', function () { var v = parseFloat(i.value); if (isNaN(v)) v = S[key]; v = clamp(v, min, max); i.value = v; S[key] = v; if (after) after(v); api.redraw(); });
        f.appendChild(i); into.appendChild(f); return i;
      },
      text: function (label, key, after, ph) {
        var f = el('label', { class: 'om-field' }, '<span>' + label + '</span>'); var i = el('input', { type: 'text', value: S[key] == null ? '' : S[key], placeholder: ph || '' });
        i.addEventListener('input', function () { S[key] = i.value; if (after) after(i.value); api.redraw(); }); f.appendChild(i); into.appendChild(f); return i;
      },
      select: function (label, key, opts, after) {
        var f = el('label', { class: 'om-field' }, '<span>' + label + '</span>'); var i = el('select');
        opts.forEach(function (o) { var op = el('option', { value: o[0] }, o[1]); if (String(S[key]) === String(o[0])) op.selected = true; i.appendChild(op); });
        i.addEventListener('change', function () { var v = i.value; S[key] = isNaN(+v) || v === '' ? v : +v; if (after) after(S[key]); api.redraw(); }); f.appendChild(i); into.appendChild(f); return i;
      },
      seg: function (label, key, opts, after, parent) {
        var wrap = el('div', { class: 'om-field' }, label ? '<span>' + label + '</span>' : ''); var g = el('div', { class: 'om-seg', role: 'group' });
        function paint() { [].forEach.call(g.children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.v) === String(S[key]) ? 'true' : 'false'); }); }
        opts.forEach(function (o) { var b = el('button', { type: 'button' }, o[1]); b.dataset.v = o[0]; b.addEventListener('click', function () { S[key] = typeof o[0] === 'number' ? o[0] : o[0]; paint(); if (after) after(S[key]); api.redraw(); }); g.appendChild(b); });
        paint(); wrap.appendChild(g); (parent || into).appendChild(wrap); return { paint: paint, el: wrap };
      },
      check: function (label, key, after) {
        var f = el('label', { class: 'om-check' }); var i = el('input', { type: 'checkbox' }); i.checked = !!S[key];
        i.addEventListener('change', function () { S[key] = i.checked; if (after) after(i.checked); api.redraw(); }); f.appendChild(i); f.appendChild(document.createTextNode(label)); into.appendChild(f); return i;
      },
      button: function (label, fn, cls, parent) { var b = el('button', { type: 'button', class: 'om-btn small ' + (cls || '') }, label); b.addEventListener('click', fn); (parent || into).appendChild(b); return b; },
      row: function (parent) { var r = el('div', { class: 'om-row' }); (parent || into).appendChild(r); return r; }
    };
    goalBar();
    def.mount(api);
    redrawFn();
    /* kit note */
    if (m.kit) side.appendChild(el('details', { class: 'om-kit' }, '<summary>Use the real thing</summary><p><b>Hands-on:</b> ' + m.kit + (m.home ? '<br><b>At home:</b> ' + m.home : '') + '</p>'));
    var qs = window.OAOM_DATA && OAOM_DATA.questions && OAOM_DATA.questions[id];
    if (qs && !document.body.classList.contains('student')) side.appendChild(el('details', { class: 'om-qs' }, '<summary>Questions to ask (teacher only)</summary><ul>' + qs.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul>'));
    if (!isStu && !document.body.classList.contains('board')) {
      var DD = window.OAOM_DATA || {}, tips = '';
      if (DD.metacog) tips += '<p style="margin:.1rem 0 .3rem"><b>Make them think about their thinking.</b> Ask:</p><ul>' + DD.metacog.prompts.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul><p style="margin:.1rem 0 .5rem"><a href="' + DD.metacog.url + '" target="_blank" rel="noopener">More on metacognition \u2197</a></p>';
      if (DD.multdiv && DD.multdiv.ids.indexOf(m.id) > -1) tips += '<p style="margin:.1rem 0 .3rem"><b>For \u00d7 and \u00f7:</b> ' + esc(DD.multdiv.note) + ' <a href="' + DD.multdiv.url + '" target="_blank" rel="noopener">Manipulatives for \u00d7 and \u00f7 \u2197</a></p>';
      if (tips) side.appendChild(el('details', { class: 'om-qs om-teachtips', open: '' }, '<summary>Teacher tips (not shown to students)</summary>' + tips));
    }
    inkMount();
    var sb = $('#om-surprise'); if (sb) sb.hidden = !(window.OAOM_DATA && OAOM_DATA.surprise && OAOM_DATA.surprise[id]);
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

  /* ---------- Pen: draw on top of any tool (strokes saved in S._ink, as fractions of the stage width) ---------- */
  var penOn = false, penCol = '#0E1C42';
  function inkMount() {
    var stage = $('#om-stage'); if (!stage) return; stage.style.position = 'relative';
    var old = $('#om-ink'); if (old) old.remove();
    var v = s('svg', { id: 'om-ink', class: 'om-ink' + (penOn ? ' on' : '') }); stage.appendChild(v); inkDraw();
    var pts = null, path = null;
    v.addEventListener('pointerdown', function (e) { if (!penOn) return; e.preventDefault(); try { v.setPointerCapture(e.pointerId); } catch (x) {}
      var r = v.getBoundingClientRect(); pts = [penCol]; path = s('polyline', { fill: 'none', stroke: penCol, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, v);
      add(e); function add(ev) { var w = r.width; pts.push(+((ev.clientX - r.left) / w).toFixed(4), +((ev.clientY - r.top) / w).toFixed(4)); path.setAttribute('points', toPts(pts, w)); }
      v.onpointermove = function (ev) { if (pts) add(ev); };
      v.onpointerup = v.onpointercancel = function () { if (pts && pts.length > 3) { cur.S._ink = (cur.S._ink || []).concat([pts]); if (JSON.stringify(cur.S._ink).length > 6000) { cur.S._ink.shift(); toast('Older pen marks were cleared to keep the link short.'); } histCommit(); saveNow(); } pts = null; v.onpointermove = null; };
    });
  }
  function toPts(a, w) { var o = []; for (var i = 1; i < a.length; i += 2) o.push((a[i] * w).toFixed(1) + ',' + (a[i + 1] * w).toFixed(1)); return o.join(' '); }
  function inkDraw() { var v = $('#om-ink'); if (!v || !cur) return; var st = $('#om-stage'), w = st.clientWidth, h = Math.max(st.scrollHeight, 200);
    v.setAttribute('width', w); v.setAttribute('height', h); v.setAttribute('viewBox', '0 0 ' + w + ' ' + h); [].slice.call(v.querySelectorAll('polyline')).forEach(function (p) { p.remove(); });
    (cur.S._ink || []).forEach(function (a) { s('polyline', { points: toPts(a, w), fill: 'none', stroke: a[0], 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, v); }); }
  window.addEventListener('resize', function () { inkDraw(); });
  function setPen(on) { penOn = on; var v = $('#om-ink'); if (v) v.classList.toggle('on', on); var b = $('#om-pen'); if (b) b.setAttribute('aria-pressed', on); var tb = $('#om-penbar'); if (tb) tb.hidden = !on; if (on) inkDraw(); }

  /* ---------- Flash it (teacher): show the tool for a few seconds, then cover it ---------- */
  function flash() {
    var card = document.querySelector('.om-stagecard'); if (!card) return; var secs = +(($('#om-flashs') || {}).value || 3);
    var old = $('#om-flashcover'); if (old) old.remove();
    var badge = el('div', { class: 'om-flashbadge' }, 'Look! ' + secs); card.appendChild(badge);
    var n = secs, t = setInterval(function () { n--; badge.textContent = 'Look! ' + n; if (n <= 0) { clearInterval(t); badge.remove(); cover(); } }, 1000);
    function cover() {
      var cv = el('div', { class: 'om-flashcover', id: 'om-flashcover' }, '<div><p class="big">What did you see?</p><p>How many? How did you see it?</p><div class="om-row" style="justify-content:center"><button class="om-btn" data-a="again">Show again</button><button class="om-btn primary" data-a="reveal">Reveal</button></div></div>');
      card.appendChild(cv); cv.querySelector('[data-a="reveal"]').onclick = function () { cv.remove(); }; cv.querySelector('[data-a="again"]').onclick = function () { cv.remove(); flash(); };
    }
  }
  /* ---------- Surprise me: a random problem from OAOM_DATA.surprise[tool] (returns {set, g:[text, answer, mistakes, key]}) ---------- */
  function surprise() {
    var f = window.OAOM_DATA && OAOM_DATA.surprise && OAOM_DATA.surprise[cur.id]; if (!f) return;
    var p = f(cur.S) || {}; var ns = Object.assign(clone(cur.initial), clone(p.set || {}));
    if (p.g) ns._g = { t: p.g[0], v: p.g[1], m: p.g[2] || [], k: p.g[3] || 'v' }; else delete ns._g;
    mount(cur.id, ns, true); histCommit(); saveNow();
  }
  /* ---------- Read to me ---------- */
  function speak(text) {
    if (!window.speechSynthesis) { toast('Read aloud does not work in this browser.'); return; }
    speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(String(text).replace(/\s+/g, ' ')); u.rate = 0.92; if (params.get('lang') === 'es') u.lang = 'es'; speechSynthesis.speak(u);
  }
  function readAloud() { var m = meta(cur.id); speak([m.name + '.', whatFor(m)].concat(howFor(m)).join(' ')); }
  /* ---------- Save setup (teacher) ---------- */
  function saveSetup() {
    if (!modal) { modal = el('div', { class: 'om-modal', hidden: '' }); document.body.appendChild(modal); modal.addEventListener('click', function (e) { if (e.target === modal) closeShare(); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeShare(); }); }
    var m = meta(cur.id);
    modal.innerHTML = '<div class="om-dialog" role="dialog" aria-modal="true" aria-labelledby="om-sv-t"><h2 id="om-sv-t">Save this setup</h2><p class="sub">It goes in <b>My setups</b> in the library, on this computer and browser. Open it, share it, or put it in a problem set later.</p>' +
      '<label class="om-field"><span>Name</span><input type="text" id="om-svname" value="' + esc(m.name + ' ' + new Date().toLocaleDateString()) + '"></label>' +
      '<div class="om-row" style="justify-content:flex-end"><button class="om-btn small" data-x>Cancel</button><button class="om-btn small primary" data-ok>Save</button></div></div>';
    modal.hidden = false; var inp = $('#om-svname'); inp.select();
    modal.querySelector('[data-x]').onclick = closeShare;
    function go() { var st = clone(cur.S); delete st._g; var it = saved.add(inp.value.trim() || m.name, cur.id, st); closeShare(); toast(it ? 'Saved to My setups' : 'Could not save in this browser.'); }
    modal.querySelector('[data-ok]').onclick = go; inp.onkeydown = function (e) { if (e.key === 'Enter') go(); };
  }

  function boot() {
    var id = params.get('t'), lid = params.get('lesson');
    var isBoard = params.get('board') === '1', isEmbed = params.get('embed') === '1', isStudent = params.get('st') === '1';
    document.body.classList.toggle('student', isStudent);
    document.body.classList.toggle('plain', params.get('plain') === '1');
    document.body.classList.toggle('board', isBoard); document.body.classList.toggle('embed', isEmbed);
    var app = $('#app');
    app.innerHTML =
      '<header class="om-top">' + (isStudent ? '' : '<a class="back om-noprint" href="index.html" ' + (isEmbed ? 'target="_blank"' : '') + '>← ' + (isEmbed ? 'All tools' : 'Library') + '</a>') + '<h1 id="om-title">Math Tool</h1><div class="om-actions">' +
      '<button class="om-btn small" id="om-nums" aria-pressed="false" aria-label="Hide totals" title="Hide or show the totals"><span class="lbl">Hide totals</span><span aria-hidden="true">👁</span></button>' +
      '<button class="om-btn small" id="om-reset" aria-label="Start over" title="Start over"><span aria-hidden="true">↺</span><span class="lbl">Start over</span></button>' +
      '<button class="om-btn small om-sidetoggle" id="om-setbtn" aria-pressed="false" aria-label="Set up"><span class="lbl">Set up</span><span aria-hidden="true">⚙</span></button>' +
      (isBoard ? '<button class="om-btn small" id="om-dark" aria-pressed="false" aria-label="Dark mode"><span class="lbl">Dark</span><span aria-hidden="true">◐</span></button>' : '') +
      (isBoard || isEmbed ? '<button class="om-btn small" id="om-full" aria-label="Full screen"><span class="lbl">Full screen</span><span aria-hidden="true">⛶</span></button>' : '') +
      (isBoard ? '' : '<details class="om-menu om-noprint"><summary class="om-btn small" aria-label="More">More ▾</summary><div class="om-menuitems">' +
        (isEmbed ? '' : '<button class="om-btn small" id="om-big" aria-label="Big-screen mode"><span aria-hidden="true">⛶</span> <span class="lbl">Big screen</span></button>') +
        '<button class="om-btn small" id="om-print" aria-label="Print"><span aria-hidden="true">🖨</span> <span class="lbl">Print</span></button>' +
        (isStudent ? '' : '<button class="om-btn small" id="om-pic" aria-label="Download a picture" title="Download a picture (PNG or JPEG)"><span aria-hidden="true">🖼</span> <span class="lbl">Picture</span></button><button class="om-btn small" id="om-save" aria-label="Save this setup" title="Save this setup to My setups"><span aria-hidden="true">💾</span> <span class="lbl">Save setup</span></button>') + '</div></details>') +
      (isBoard ? '<button class="om-btn small" id="om-print" aria-label="Print" title="Print"><span class="lbl">Print</span><span aria-hidden="true">🖨</span></button>' + (isStudent ? '' : '<button class="om-btn small" id="om-pic" aria-label="Download a picture"><span class="lbl">Picture</span><span aria-hidden="true">🖼</span></button><button class="om-btn small" id="om-save" aria-label="Save this setup"><span class="lbl">Save setup</span><span aria-hidden="true">💾</span></button>') : '') +
      (isStudent ? '<button class="om-btn small primary" id="om-turnin" aria-label="Turn in my work"><span class="lbl">Turn in my work</span><span aria-hidden="true">📤</span></button>' : '<button class="om-btn small primary" id="om-share" aria-label="Share"><span class="lbl">Share</span><span aria-hidden="true">🔗</span></button>') + '</div></header>' +
      '<nav class="om-tabs" id="om-tabs" role="tablist" hidden></nav><p class="om-lessonnote" id="om-lnote" hidden></p>' +
      '<main class="om-main" id="om-main"><section class="om-stagecard"><div class="om-printhead" id="om-printhead"></div><details class="om-how" id="om-how"' + (isEmbed ? '' : ' open') + '><summary>How to use this tool</summary><button type="button" class="om-btn small om-read" id="om-read">🔊 Read to me</button><ol id="om-howlist"></ol><div class="om-howlinks" id="om-howlinks"></div></details><details class="om-learn" id="om-learn" hidden><summary><span class="om-learn-ic" aria-hidden="true">▶</span> Learn to use this tool <span class="om-learn-len">1-minute video</span></summary><video id="om-learnv" controls preload="metadata" playsinline></video></details>' +
      '<div class="om-toolbar om-noprint" role="toolbar" aria-label="Tool actions"><button type="button" class="om-btn small" id="om-undo" aria-label="Undo" title="Undo (Ctrl+Z)" disabled>↶ <span class="lbl">Undo</span></button><button type="button" class="om-btn small" id="om-redo" aria-label="Redo" title="Redo (Ctrl+Y)" disabled>↷ <span class="lbl">Redo</span></button>' +
      '<button type="button" class="om-btn small" id="om-pen" aria-pressed="false">✏️ <span class="lbl">Pen</span></button><span class="om-penbar" id="om-penbar" hidden><button type="button" class="om-sw" data-c="#0E1C42" style="background:#0E1C42" aria-label="Navy pen"></button><button type="button" class="om-sw" data-c="#D2453B" style="background:#D2453B" aria-label="Red pen"></button><button type="button" class="om-sw" data-c="#23915A" style="background:#23915A" aria-label="Green pen"></button><button type="button" class="om-btn small" id="om-penclear">Clear ink</button></span>' +
      '<button type="button" class="om-btn small" id="om-surprise" hidden>🎲 <span class="lbl">Surprise me</span></button>' +
      (isStudent ? '' : '<span class="om-flashgrp"><button type="button" class="om-btn small" id="om-flash" title="Show the tool for a few seconds, then hide it">⚡ <span class="lbl">Flash it</span></button><select id="om-flashs" aria-label="Seconds to show"><option value="2">2 s</option><option value="3" selected>3 s</option><option value="5">5 s</option><option value="10">10 s</option></select></span>') + '</div><p class="om-say" id="om-say" aria-live="polite"></p><div class="om-goal" id="om-goal" hidden></div><div class="om-stage" id="om-stage"></div><div class="om-readout om-num" id="om-readout" aria-live="polite"></div></section>' +
      '<aside class="om-side"><h2>Set up</h2><div id="om-setup"></div></aside></main>';

    $('#om-reset').onclick = function () { if (!cur) return; mount(cur.id, clone(cur.initial)); if (!lid) history.replaceState(null, '', '#s=' + enc(cur.initial)); };
    $('#om-nums').onclick = function () { if (!cur) return; cur.S._r = cur.S._r === 0 ? 1 : 0; document.body.classList.toggle('hide-nums', cur.S._r === 0); this.setAttribute('aria-pressed', cur.S._r === 0 ? 'true' : 'false'); goalBar(); goalCheck(); if (!lid) history.replaceState(null, '', '#s=' + enc(cur.S)); };
    $('#om-print').onclick = function () { window.print(); };
    $('#om-setbtn').onclick = function () { var on = document.body.classList.toggle('show-setup'); this.setAttribute('aria-pressed', on); };
    var big = $('#om-big'); if (big) big.onclick = function () { location.href = currentURL('&board=1'); };
    /* the More menu closes after a choice or a click elsewhere */
    var menu = document.querySelector('.om-menu'); if (menu) { menu.addEventListener('click', function (e) { if (e.target.closest('button')) menu.removeAttribute('open'); }); document.addEventListener('pointerdown', function (e) { if (menu.open && !menu.contains(e.target)) menu.removeAttribute('open'); }); }
    var dark = $('#om-dark'); if (dark) dark.onclick = function () { var on = document.body.classList.toggle('dark'); this.setAttribute('aria-pressed', on); };
    var full = $('#om-full'); if (full) full.onclick = function () { if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) { var pr = document.documentElement.requestFullscreen(); if (pr && pr.catch) pr.catch(function () { toast('Full screen is not allowed here. Open the tool in a new tab instead.'); }); } else toast('Full screen is not available in this browser.'); };
    if ($('#om-turnin')) $('#om-turnin').onclick = turnIn;
    if ($('#om-save')) $('#om-save').onclick = saveSetup;
    if ($('#om-pic')) $('#om-pic').onclick = picture;
    $('#om-undo').onclick = undo; $('#om-redo').onclick = redo;
    $('#om-pen').onclick = function () { setPen(!penOn); };
    [].forEach.call(document.querySelectorAll('.om-sw'), function (b) { b.onclick = function () { penCol = b.dataset.c; [].forEach.call(document.querySelectorAll('.om-sw'), function (x) { x.classList.toggle('sel', x === b); }); }; });
    $('#om-penclear').onclick = function () { if (cur && cur.S._ink) { delete cur.S._ink; inkDraw(); histCommit(); saveNow(); } };
    $('#om-surprise').onclick = surprise;
    if ($('#om-flash')) $('#om-flash').onclick = flash;
    $('#om-read').onclick = function (e) { e.preventDefault(); readAloud(); };
    document.addEventListener('keydown', function (e) { var tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) { e.preventDefault(); redo(); } });
    if ($('#om-share')) $('#om-share').onclick = function () {
      if (!cur) return;
      if (lid) { share(lessonShare(lid)); return; }
      var mm = meta(cur.id); share(Object.assign(toolShare(cur.id, cur.S), { plain: document.body.classList.contains('plain') }));
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
    if (isStudent && cur && cur.S._r === 0) { var nb = $('#om-nums'); if (nb) nb.hidden = true; } /* the teacher hid the totals: students use Check my answer instead of a toggle */
  }
  function lessonShare(lid) {
    var L = lesson(lid); if (!L) return null;
    var names = L.tools.map(function (t) { return meta(t.t).name; });
    return { title: 'Math tools for Lesson ' + lid, url: lessonURL(lid), note: 'One link opens the tools that fit this lesson (' + names.join(', ') + ') as tabs. They are open tools, ready for any problem.',
      dir: { title: 'Math tools', intro: 'Use these tools on any problem while you work. Tap a tab at the top to switch tools. Each tool has a “How to use this tool” box.', tries: L.tools.map(function (t) { return [meta(t.t).name, meta(t.t).what]; }) } };
  }
  function toolShare(id, state) {
    var mm = meta(id), es = window.OAOM_DATA && OAOM_DATA.howEs && OAOM_DATA.howEs[id], lang = params.get('lang') === 'es';
    function build(sayFirst) { var S2 = state ? clone(state) : {}; if (sayFirst) S2._say = 1; else delete S2._say; return toolURL(id, Object.keys(S2).length ? S2 : null, lang ? '&lang=es' : ''); }
    return { title: mm.name, url: build(!!(state && state._say)), hasState: true, sayFirst: !!(state && state._say), rebuild: build, hasEs: !!es,
      dir: { title: 'Math tool: ' + mm.name, intro: mm.what, steps: mm.how },
      dirEs: es ? { title: 'Herramienta de matemáticas: ' + mm.name, intro: (OAOM_DATA.whatEs && OAOM_DATA.whatEs[id]) || mm.what, steps: es } : null };
  }
  function currentURL(extra) { if (params.get('st') === '1') extra = (extra || '') + '&st=1'; if (params.get('lesson')) return lessonURL(params.get('lesson'), extra); return toolURL(cur.id, cur.S, extra); }

  /* offline: keep a copy of the tools once they have loaded (sw.js, network first) */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) { try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {} }
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
  return { reduce: reduce, anim: anim, register: register, boot: boot, tools: tools, s: s, svg: svg, hit: hit, el: el, pt: pt, tap: tap, keys: keys, dragTap: dragTap, ghostDrag: ghostDrag, lasso: lasso, cloneGroup: cloneGroup, rootDrag: rootDrag, dragDone: dragDone, focusKey: focusKey, refocus: refocus, speak: speak, clone: clone, clamp: clamp, gcd: gcd, fmt: fmt, frac: frac, mixed: mixed, esc: esc,
    saved: saved, addSt: addSt, enc: enc, dec: dec, directions: directions, lessonShare: lessonShare, toolShare: toolShare, toolURL: toolURL, lessonURL: lessonURL, share: share, copy: copy, toast: toast, meta: meta };
})();
