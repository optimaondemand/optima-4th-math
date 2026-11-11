/* One step at a time for the math sparkle layers (G3 Storybook, G4 classical guide, G5 Master Builders). 11 Nov 2026.
   Bethany: "the steps approach in ELA where they click Next through it all. Apply that to math."
   Same idea as onestep.js in the ELA repos, one level up, because math jobs already gate their own steps:
   - in each tab (or station) ONE part is open at a time; every other part is a short row (number, title, ✓ when done)
   - under the open part: ◂ Back · "Step 3 of 21" · 👆 Next: <the next part's title>
   - the tab's own way forward (Next station, Continue, Next: the Lesson) shows only on the last part
   Nothing is removed: closed parts keep their answers, so saving, Gather, progress and printing still work.
   Loaded by lesson-tools.js on every page that has one of the three layers. ?steps=0 turns it off.
   A part is every direct child of the tab/station except: LEAD (rides with the part after it: a guide's note, a video
   slot, a window label), TAIL (rides with the part before it), FOOT (the way forward) and KEEP (never touched). */
(function () {
  if (window.__osMath) return; window.__osMath = true;
  if (/[?&]steps=0\b/.test(location.search)) return;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function mk(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function cfg() {
    if (document.body.classList.contains('sb') && $('.sb-panel')) return { g: 3, panel: '.sb-panel', station: '.sb-station', lead: '.sb-opti, .sb-video, .video-placeholder-wrap', tail: '', foot: '.sb-next', keep: '.sb-path, .oao-lesson-tools-top' };
    if ($('.bd-panel')) return { g: 5, panel: '.bd-panel', station: '.bd-station', lead: '.bd-say2, .video-placeholder-wrap', tail: '', foot: '.bd-nextst, .bd-contw', keep: '.bd-path, .oao-lesson-tools-top' };
    if ($('.tab-panel .cw-slot, .tab-panel .cw-station')) return { g: 4, panel: '.tab-panel', station: '.cw-station', lead: '.pq-vslot, .cw-sec, .cw-st-head, .mk-tip', tail: '.cw-extra', foot: '.cw-st-next, .tab-next-wrap', keep: '.cw-path, .oao-lesson-tools-top' };
    return null;
  }
  var C = null, LANES = [], KEY = 'osm:' + location.pathname.split('/').pop(), ST = { cur: {}, done: {} }, busy = false;
  try { ST = JSON.parse(localStorage.getItem(KEY)) || ST; ST.cur = ST.cur || {}; ST.done = ST.done || {}; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) {} }
  var nativeSIV = Element.prototype.scrollIntoView;

  function off(el, yes) {
    if (yes) { if (!el.classList.contains('osm-off')) { el.classList.add('osm-off'); if (!el.hidden) { el.hidden = true; el.setAttribute('data-osm-h', '1'); } } }
    else if (el.classList.contains('osm-off')) { el.classList.remove('osm-off'); if (el.getAttribute('data-osm-h')) { el.hidden = false; el.removeAttribute('data-osm-h'); } }
  }
  function mine(k) { return k.classList && (k.classList.contains('osm-row') || k.classList.contains('osm-bar')); }
  function titleOf(g) {
    var el = g.el, t = '';
    if (el.matches('.cw-slot')) {                                    /* a workshop window: its own title from the lesson data */
      var w = window.CW_DATA && CW_DATA.windows && CW_DATA.windows[el.getAttribute('data-win')];
      t = 'Workshop window' + (w && w.title ? ': ' + w.title : '');
    }
    var bn = el.matches('.bd-sec') && el.querySelector(':scope > h2 > .n');   /* G5: "WARM-UP The builder's window" keeps its kicker; "JOB 3" does not */
    var kick = bn && !/^\s*JOB\b/i.test(bn.textContent) ? bn.textContent.replace(/\s+/g, ' ').trim() : '';
    var pick = ['.sb-jh h3', ':scope > .key-concept-label', ':scope > h3', ':scope > .activity-head .activity-title', '.fluency-head-title', ':scope > h2', '.bd-mdet summary b', '.ch-card summary', '.q-text strong',
      ':scope > .bd-k + h3', 'h2', 'h3', '.activity-title', '[class*="title"]', 'h4', '.task-label', 'summary', 'b, strong'];
    for (var i = 0; !t && i < pick.length; i++) {
      var h = null; try { h = el.querySelector(pick[i]); } catch (e) {}
      if (!h) continue; var c = h.cloneNode(true);
      $$('.n, .ch-opt, .ch-star, [class*="kind"], .saved-dot, .q-num, button, small', c).forEach(function (x) { x.remove(); });
      t = c.textContent;
    }
    t = (t || el.textContent || '').replace(/\s+/g, ' ').replace(/^[^A-Za-z0-9×]+/, '').trim();
    if (kick) t = kick.charAt(0) + kick.slice(1).toLowerCase() + ': ' + t;
    if (t.length > 58) t = t.slice(0, 56).replace(/\s+\S*$/, '') + '…';
    return t || 'Next part';
  }
  function kidsOf(l) { return [].slice.call(l.children).filter(function (k) { return !mine(k) && !(C.keep && k.matches(C.keep)) && k.tagName !== 'SCRIPT' && k.tagName !== 'STYLE'; }); }
  function group(lane) {
    var groups = [], pend = [], foot = [];
    kidsOf(lane.el).forEach(function (k) {
      if (C.foot && k.matches(C.foot)) { foot.push(k); return; }
      if (C.lead && k.matches(C.lead)) { pend.push(k); return; }
      if (C.tail && k.matches(C.tail)) { if (groups.length) groups[groups.length - 1].members.push(k); else pend.push(k); return; }
      groups.push({ el: k, members: pend.concat([k]) }); pend = [];
    });
    if (pend.length && groups.length) groups[groups.length - 1].members = groups[groups.length - 1].members.concat(pend);
    groups.forEach(function (g, i) { g.i = i; g.members.forEach(function (m) { m._osm = [lane, g]; }); });
    lane.groups = groups; lane.foot = foot.concat(lane.pfoot || []);
  }
  function findLanes() {
    var out = [];
    $$(C.panel).forEach(function (p) {
      var sts = $$(C.station, p).filter(function (s) { return s.tagName !== 'BUTTON'; });
      var pfoot = sts.length && C.foot ? [].slice.call(p.children).filter(function (k) { return k.matches(C.foot); }) : [];
      (sts.length ? sts : [p]).forEach(function (l, li, arr) {
        var parts = [].slice.call(l.children).filter(function (k) { return !(C.keep && k.matches(C.keep)) && !(C.lead && k.matches(C.lead)) && !(C.foot && k.matches(C.foot)); });
        var body = parts.length === 1 && parts[0].matches('.activity') ? parts[0].querySelector(':scope > .activity-body') : null;
        out.push({ el: body && body.children.length > 3 ? body : l, id: out.length, pfoot: li === arr.length - 1 ? pfoot : [] });
      });
    });
    return out;
  }
  /* is this part really there (a video slot with no video, a retired card)? measured with our own hiding lifted */
  function live(g) { var was = g.el.classList.contains('osm-off'); if (was) off(g.el, false); var ok = getComputedStyle(g.el).display !== 'none' && !g.el.hidden; if (was) off(g.el, true); return ok; }
  function doneOf(lane, g) { return g.el.matches('[data-job]') && g.el.classList.contains('sb-job') ? g.el.classList.contains('done') : !!ST.done[lane.id + ':' + g.i]; }

  var OPEN = false;   /* a "Show me around" tour (or printing) shows every part */
  function paint() {
    var tot = 0; busy = true;
    if (OPEN) {
      LANES.forEach(function (lane) { lane.groups.forEach(function (g) { g.members.forEach(function (m) { off(m, false); }); if (g.row && g.row.parentNode) g.row.remove(); }); lane.foot.forEach(function (f) { off(f, false); }); if (lane.bar && lane.bar.parentNode) lane.bar.remove(); });
      busy = false; try { window.dispatchEvent(new Event('resize')); } catch (e) {} return;
    }
    LANES.forEach(function (lane) { lane.act = lane.groups.filter(live); tot += lane.act.length; });
    var n = 0;
    LANES.forEach(function (lane) {
      var act = lane.act; if (!act.length) return;
      var cur = lane.groups[ST.cur[lane.id] || 0]; if (!cur || act.indexOf(cur) < 0) cur = act[0];
      var ci = act.indexOf(cur), last = ci === act.length - 1;
      lane.groups.forEach(function (g) {
        var isAct = act.indexOf(g) >= 0, open = g === cur;
        g.members.forEach(function (m) { off(m, isAct && !open); m.classList.toggle('osm-first', open && m === g.members[0]); });
        if (!g.row) { g.row = mk('button', 'osm-row'); g.row.type = 'button'; g.row.innerHTML = '<span class="n"></span><span class="t"></span><span class="ck" aria-hidden="true">✓</span>';
          g.row.addEventListener('click', function () { go(lane, g, true); }); }
        if (isAct) { n++; g.num = n; }
        g.row.hidden = !isAct || open;
        if (isAct && !open) {
          if (g.row.parentNode !== lane.el || g.row.nextSibling !== g.members[0]) lane.el.insertBefore(g.row, g.members[0]);
          var d = doneOf(lane, g); g.row.classList.toggle('done', d);
          $('.n', g.row).textContent = g.num; $('.t', g.row).textContent = g.title || (g.title = titleOf(g));
          g.row.setAttribute('aria-label', 'Step ' + g.num + ': ' + g.title + (d ? ', done' : '') + '. Open it.');
        } else if (g.row.parentNode) g.row.remove();
      });
      lane.foot.forEach(function (f) { off(f, !last); });
      if (!lane.bar) {
        lane.bar = mk('div', 'osm-bar'); lane.bar.innerHTML = '<button type="button" class="osm-back">◂ Back</button><span class="osm-count" role="status"></span><button type="button" class="osm-next"></button>';
        $('.osm-back', lane.bar).addEventListener('click', function () { var a = lane.act, k = a.indexOf(lane.cur); if (k > 0) go(lane, a[k - 1], true); });
        $('.osm-next', lane.bar).addEventListener('click', function () {
          var a = lane.act, k = a.indexOf(lane.cur); ST.done[lane.id + ':' + lane.cur.i] = 1; save();
          if (k < a.length - 1) go(lane, a[k + 1], true); else paint();
        });
      }
      lane.cur = cur;
      var after = cur.members[cur.members.length - 1];
      if (lane.bar.previousSibling !== after) lane.el.insertBefore(lane.bar, after.nextSibling);
      $('.osm-back', lane.bar).style.visibility = ci > 0 ? 'visible' : 'hidden';
      $('.osm-count', lane.bar).textContent = 'Step ' + cur.num + ' of ' + tot;
      var nx = $('.osm-next', lane.bar), nextG = act[ci + 1];
      if (nextG) { nx.hidden = false; nx.textContent = '👆 Next: ' + (nextG.title || (nextG.title = titleOf(nextG))); }
      else if (lane.foot.length) nx.hidden = true;                       /* the tab's own button is the way forward */
      else { nx.hidden = false; nx.textContent = ST.done[lane.id + ':' + cur.i] ? '✓ Done' : '👆 Done'; }
    });
    busy = false;
    try { window.dispatchEvent(new Event('resize')); } catch (e) {}
  }
  function go(lane, g, scroll) {
    ST.cur[lane.id] = g.i; save(); paint();
    if (scroll) { var t = g.members[0]; try { nativeSIV.call(t, { block: 'start', behavior: 'instant' }); } catch (e) { try { nativeSIV.call(t, true); } catch (x) {} } }
  }
  /* anything that scrolls to a closed part (a window's "Go to the panels", the tour, a hint link) opens it first */
  Element.prototype.scrollIntoView = function () {
    try { var o = this.closest && this.closest('.osm-off'); if (o && o._osm && C) { ST.cur[o._osm[0].id] = o._osm[1].i; save(); paint(); } } catch (e) {}
    return nativeSIV.apply(this, arguments);
  };
  function css() {
    var s = document.createElement('style'); s.id = 'osm-css';
    s.textContent = '.osm-off{display:none!important}' +
      '.osm-row{display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;margin:10px 0;padding:10px 14px;border:1.5px solid #DAD3BD;border-radius:14px;background:#FFFDF6;color:#24324F;font:800 16px/1.3 Nunito,system-ui,sans-serif;text-align:left;cursor:pointer;opacity:.88;scroll-margin-top:110px}' +
      '.osm-row[hidden]{display:none}.osm-row:hover,.osm-row:focus-visible{opacity:1;border-color:#C8A850;outline:none;box-shadow:0 0 0 3px rgba(200,168,80,.3)}' +
      '.osm-row .n{flex:0 0 auto;width:28px;height:28px;border-radius:50%;background:#E9E2CC;color:#24324F;display:inline-flex;align-items:center;justify-content:center;font-size:14px}' +
      '.osm-row .t{flex:1;min-width:0}.osm-row .ck{flex:0 0 auto;width:26px;height:26px;border-radius:50%;background:#2E7D4F;color:#fff;display:none;align-items:center;justify-content:center;font-size:14px}' +
      '.osm-row.done .ck{display:inline-flex}.osm-row.done .n{background:#DCEFE3}' +
      '.osm-first{scroll-margin-top:110px}' +
      '.osm-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:16px 0 14px;padding-top:14px;border-top:2px dashed #E2DCC8}' +
      '.osm-back{border:0;background:none;color:#5B6785;font:800 15px Nunito,system-ui,sans-serif;cursor:pointer;padding:8px 6px}' +
      '.osm-count{flex:1;text-align:center;font:800 14px Nunito,system-ui,sans-serif;color:#5B6785;white-space:nowrap}' +
      '.osm-next{border:0;border-radius:12px;background:#0E1C42;color:#fff;font:900 16px/1.25 Nunito,system-ui,sans-serif;padding:11px 18px;cursor:pointer;box-shadow:0 4px 0 #060d24;max-width:100%;text-align:left}' +
      '.osm-next:active{transform:translateY(3px);box-shadow:0 1px 0 #060d24}.osm-next[hidden]{display:none}.osm-next:focus-visible,.osm-back:focus-visible{outline:3px solid #F2B705;outline-offset:2px}' +
      '@media(max-width:560px){.osm-count{flex-basis:100%;order:-1;text-align:left}.osm-next{flex:1}}';
    document.head.appendChild(s);
  }
  function boot() {
    C = cfg(); if (!C) return;
    css(); LANES = findLanes(); LANES.forEach(group);
    document.documentElement.classList.add('osm-on');
    paint();
    /* parts a layer adds later (a Continue card, a drawer) join in */
    if (window.MutationObserver) LANES.forEach(function (lane) {
      new MutationObserver(function (ms) {
        if (busy) return;
        if (!ms.some(function (m) { return [].some.call(m.addedNodes, function (x) { return x.nodeType === 1 && !mine(x); }); })) return;
        var keep = lane.cur && lane.cur.el; lane.groups.forEach(function (g) { g.members.forEach(function (m) { off(m, false); }); if (g.row && g.row.parentNode) g.row.remove(); });
        group(lane); lane.groups.forEach(function (g) { if (g.el === keep) ST.cur[lane.id] = g.i; }); paint();
      }).observe(lane.el, { childList: true });
    });
    /* printing shows the whole lesson */
    window.addEventListener('beforeprint', function () { OPEN = true; paint(); });
    window.addEventListener('afterprint', function () { OPEN = false; paint(); });
    /* "Show me around": the tour points at things in several parts, so every part shows until its ring is gone */
    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('.tour-go')) return;
      OPEN = true; paint(); var seen = false, n = 0;
      var iv = setInterval(function () {
        var ring = document.querySelector('.sb-ring, .bd-ring, .cw-ring, .cw-tour-ring, [class*="tourtip"]'); n++;
        if (ring) seen = true;
        if ((seen && !ring) || (!seen && n > 12)) { clearInterval(iv); OPEN = false; paint(); }
      }, 300);
    }, true);
    window.OSM = { lanes: LANES, paint: paint, go: go };
  }
  if (document.readyState === 'complete') setTimeout(boot, 500); else window.addEventListener('load', function () { setTimeout(boot, 500); });
})();
