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
    if ($('.tab-panel .cw-slot, .tab-panel .cw-station')) return { g: 4, panel: '.tab-panel', station: '.cw-station', lead: '.pq-vslot, .cw-sec, .cw-st-head, .mk-tip', tail: '.cw-extra, .gathered-box, #mk-next, .turn-in-card', foot: '.cw-st-next, .tab-next-wrap', keep: '.cw-path, .oao-lesson-tools-top' };
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
  /* Is this part a job, and is the job finished? null = not a job. A job's row gets its ✓ only when the job is done
     (Bethany, 11 Nov 2026); any other part gets it when the student presses Next past it. */
  function jobState(g) {
    var el = g.el;
    try {
      if (C.g === 3) return el.matches('.sb-job[data-job]') ? el.classList.contains('done') : null;
      if (C.g === 4) {
        var J = (window.PQ_LESSON && PQ_LESSON.jobs) || [], hit = null;
        J.forEach(function (j) { if (!hit && j.go) { var t = document.querySelector(j.go); if (t && (t === el || el.contains(t))) hit = j; } });
        return hit ? !!(window.PQM && PQM.jobDone && PQM.jobDone(hit.id)) : null;
      }
      if (C.g === 5) {
        var st = $$('.bd-steps', el);
        if (st.length) return st.every(function (x) { return x.classList.contains('all'); });
        if (el.id === 'j8') { var pv = $('#prove', el); return $$('.bd-ans, .bd-sel', el).every(function (x) { return x.classList.contains('ok'); }) && (!pv || pv.value.trim().length > 15); }
      }
    } catch (e) {}
    return null;
  }
  function doneOf(lane, g) { var j = jobState(g); return j === null ? !!ST.done[lane.id + ':' + g.i] : j; }

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
  /* ── the tour (replaces each layer's own "Show me around" while one-step is on): a ring around one thing at a time, the
     part it lives in opened first, with stops for the rows and the Next bar. The words are the layers' own. ── */
  function tourStops() {
    var R = ['.osm-row', 'Your lesson shows <b>one part at a time</b>. Each row is another part. A <b>✓</b> means it is done. You can click a row to open it.'],
      N = ['.osm-next', 'Done with this part? Press <b>👆 Next</b>. It tells you what comes next. The step count shows how far you are.'];
    if (C.g === 3) return [
      ['.sb-tabs', 'Your lesson has 3 tabs. Do them in order: <b>Warm-Up</b>, then <b>Lesson</b>, then <b>Show What You Know</b>.'],
      ['.sb-opti .ctl', 'Press <b>▶ Listen to Opti</b> to hear me read. Press <b>📄 Read along</b> to see the words.'], R, N,
      ['.sb-step.now', 'The <b>gold box</b> tells you what to do now. Do one step at a time. The next step opens when you finish.', '.sb-job'],
      ['.sb-hand', 'The <b>bouncing hand</b> shows you where to tap or drag first.', '.sb-job'],
      ['.sb-job .sb-help', 'Stuck? Press <b>💡 Need a hint</b>. A friend from the Math Crew can give you a tip, too.', '.sb-job'],
      ['.sb-term', 'A word with <b>dots under it</b> is a key word. Tap it to see what it means.'],
      ['.sb-next', 'On the last part of a tab, this button takes you to the next tab. The page goes back to the top for you.'],
      ['.sb-prog', 'This bar fills up as you finish your jobs. You are ready. Let\'s go!']];
    if (C.g === 4) return [
      ['.tab-bar', 'Your lesson has 3 tabs. Do them in order: <b>Warm-Up</b>, then <b>Lesson</b>, then <b>Show What You Know</b>.'],
      ['.pq-ra-btn', 'Press <b>🔊 Read aloud</b> to hear the page read to you.'],
      ['.cw-key', 'This key tells you what things mean. <b>See a little hand? You can click it.</b>'], R, N,
      ['.cw-slot .cw-play', 'Press play to step into the workshop. Read along, and click to go on. Do what the gold box says.', '.cw-slot'],
      ['.cw-hand', 'The <b>bouncing hand</b> shows you where to click or drag first.', '#mk-think'],
      ['#mk-think .pq-hint-btn, .pq-hint-btn', 'Stuck? Press <b>💡 Need a hint?</b> Each press gives a bigger hint.', '#mk-think'],
      ['.pq-def', 'A word with <b>dots under it</b> is a key word. Click it to see what it means.'],
      ['.cwg-btn, .cwg-man', 'You can ask the guide, too. Click him for a tip about the part you are on.'],
      ['.tab-next-btn', 'On the last part of a tab, press <b>Continue</b>. The page goes back to the top for you.'],
      ['.progress-wrap', 'This bar fills up as you finish your jobs. You are ready. Let\'s go!']];
    return [
      ['.bd-tabs', 'Your lesson has 3 tabs. Do them in order: <b>Warm-Up</b>, then <b>Lesson</b>, then <b>Show What You Know</b>.'],
      ['.bd-key', 'This key tells you what things mean. <b>See a little hand? You can click it.</b>'],
      ['#bd-read', 'Press <b>🔊 Read aloud</b> to hear the page read to you.'], R, N,
      ['.bd-win .bd-play button', 'Press play to step into the builder\'s window. Then press <b>Next ▶</b> inside it to go on.', '.bd-win'],
      ['.bd-step.now .bd-stephd', 'The <b>gold box</b> tells you what to do now. Do one step at a time. The next step opens when you finish.', '.bd-steps'],
      ['.bd-hand', 'The <b>bouncing hand</b> shows you where to click first.', '.bd-steps'],
      ['.bd-step.now .hint, button.hint', 'Stuck? Press <b>💡 Hint</b>.', '.bd-steps'],
      ['.bd-helper .who', 'You can ask the builder, too. Click him for a tip about the part you are on.'],
      ['.bd-cont', 'On the last part of the Warm-Up, press <b>Continue</b>. The page goes back to the top for you.'],
      ['.bd-prog', 'This bar fills up as you finish your jobs. You are ready. Let\'s build!']];
  }
  var touring = false;
  function tour() {
    if (touring) return; touring = true;
    var tab0 = $(C.g === 3 ? '.sb-tab' : C.g === 4 ? '.tab-btn' : '.bd-tab'); if (tab0) tab0.click();
    var P = $(C.panel), lane0 = LANES.filter(function (l) { return P && P.contains(l.el); })[0], home = lane0 ? ST.cur[lane0.id] || 0 : 0;
    if (lane0 && lane0.act && lane0.act[0]) { ST.cur[lane0.id] = lane0.act[0].i; paint(); }
    var S = tourStops(), i = -1, wait = false, ring = mk('div', 'osm-ring'), tip = mk('div', 'osm-tip');
    ring.setAttribute('aria-hidden', 'true'); tip.setAttribute('role', 'dialog'); tip.setAttribute('aria-label', 'Lesson tour');
    document.body.appendChild(ring); document.body.appendChild(tip);
    function shownEl(n) { if (!n) return false; var r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0; }
    var TABS = $$(C.g === 3 ? '.sb-tab' : C.g === 4 ? '.tab-btn' : '.bd-tab');
    function panelNow() { return $$(C.panel).filter(shownEl)[0] || P; }
    function find(sel) { var p = panelNow(), a = (p ? $$(sel, p) : []).concat($$(sel)); return a.filter(shownEl)[0] || null; }
    /* bring a stop's target on screen: open its part, and if it lives on another tab, go to that tab */
    function showTabOf(n) {
      var pn = n.closest(C.panel); if (!pn || shownEl(pn)) return;
      for (var t = 0; t < TABS.length && !shownEl(pn); t++) TABS[t].click();
    }
    function openPart(n) {
      var o = n.closest('.osm-off'); if (!o) return;
      if (o._osm) { ST.cur[o._osm[0].id] = o._osm[1].i; paint(); return; }
      LANES.forEach(function (l) { if (l.foot.indexOf(o) >= 0 && l.act.length) { ST.cur[l.id] = l.act[l.act.length - 1].i; paint(); } });   /* a tab's own button: its last part */
    }
    function reach(s) {
      var c = (s[2] ? $$(s[2]) : []).concat($$(s[0])), here = panelNow();
      c.sort(function (a, b) { return (here && here.contains(b) ? 1 : 0) - (here && here.contains(a) ? 1 : 0); });
      for (var k = 0; k < c.length && k < 12; k++) {
        showTabOf(c[k]); openPart(c[k]);
        if (find(s[0])) return true;
      }
      if (TABS[0] && !find(s[0])) TABS[0].click();
      return false;
    }
    function end() { touring = false; ring.remove(); tip.remove(); document.removeEventListener('keydown', key, true); if (tab0) tab0.click(); if (lane0) { ST.cur[lane0.id] = home; save(); paint(); } var top = $('.oao-lesson-tools-top') || (tab0 && tab0.parentNode); if (top) try { nativeSIV.call(top, { block: 'start', behavior: 'instant' }); } catch (e) {} try { window.scrollTo(0, 0); } catch (e) {} }
    function key(e) { if (e.key === 'Escape') end(); }
    function place(n) {
      var r = n.getBoundingClientRect(), pad = 8, x = r.left + window.scrollX, y = r.top + window.scrollY, W = document.documentElement.clientWidth;
      var L = Math.max(2, x - pad), Rt = Math.min(W - 2, x + r.width + pad);
      ring.style.cssText = 'left:' + L + 'px;top:' + (y - pad) + 'px;width:' + Math.max(20, Rt - L) + 'px;height:' + (r.height + pad * 2) + 'px';
      var tw = Math.min(360, W - 24); tip.style.width = tw + 'px';
      tip.style.left = Math.max(12, Math.min(x + r.width / 2 - tw / 2, W - tw - 12)) + 'px'; tip.style.top = (y + r.height + pad + 12) + 'px';
      try { nativeSIV.call(tip, { block: 'nearest', behavior: 'instant' }); } catch (e) {}
    }
    function go(k, dir) {
      if (k < 0 || wait) return; if (k >= S.length) return end();
      wait = true;
      var s = S[k], openSel = s[2];
      if (!find(s[0])) reach(s);
      setTimeout(function () {
        wait = false; var n = find(s[0]); if (!n) return go(k + dir, dir);          /* not on this page: skip the stop */
        i = k;
        if (!/sticky|fixed/.test(getComputedStyle(n).position)) { try { nativeSIV.call(n, { block: 'center', behavior: 'instant' }); } catch (e) {} }
        tip.innerHTML = '<p class="t"></p><div class="r"><button type="button" class="b">◂ Back</button><span class="c"></span><button type="button" class="n"></button><button type="button" class="x" aria-label="Close the tour">✕</button></div>';
        $('.t', tip).innerHTML = s[1]; 
        var nb = $('.n', tip), bb = $('.b', tip); nb.textContent = k === S.length - 1 ? 'Done ✓' : 'Next ▶'; bb.style.visibility = k > 0 ? 'visible' : 'hidden';
        nb.addEventListener('click', function () { go(i + 1, 1); }); bb.addEventListener('click', function () { go(i - 1, -1); }); $('.x', tip).addEventListener('click', end);
        place(n); setTimeout(function () { if (touring && i === k) place(n); try { nb.focus({ preventScroll: true }); } catch (e) {} }, 60);
      }, 380);
    }
    document.addEventListener('keydown', key, true);
    go(0, 1);
  }

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
      '.osm-ring{position:absolute;box-sizing:border-box;z-index:9998;border:4px solid #F2B705;border-radius:14px;box-shadow:0 0 0 4px rgba(14,28,66,.25),0 0 0 9999px rgba(14,28,66,.28);pointer-events:none}' +
      '.osm-tip{position:absolute;z-index:9999;box-sizing:border-box;background:#fff;border:2px solid #0E1C42;border-radius:14px;padding:12px 14px;box-shadow:0 10px 28px rgba(14,28,66,.35);font:700 16px/1.45 Nunito,system-ui,sans-serif;color:#24324F}' +
      '.osm-tip .t{margin:0 0 10px}.osm-tip .r{display:flex;align-items:center;gap:8px}.osm-tip .c{flex:1;text-align:center;font-size:13px;color:#5B6785}' +
      '.osm-tip button{font:900 14px Nunito,system-ui,sans-serif;border-radius:10px;border:0;padding:8px 12px;cursor:pointer}.osm-tip .n{background:#0E1C42;color:#fff}.osm-tip .b{background:none;color:#5B6785}.osm-tip .x{background:#EEF1F7;color:#24324F}' +
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
    document.addEventListener('click', function (e) {              /* "Show me around" runs our tour, in the one-part view */
      var b = e.target.closest && e.target.closest('.tour-go'); if (!b) return;
      e.stopPropagation(); e.preventDefault();
      var d = b.closest('details'); if (d) { $$('video', d).forEach(function (v) { try { v.pause(); } catch (x) {} }); d.open = false; }
      tour();
    }, true);
    window.OSM = { lanes: LANES, paint: paint, go: go, job: jobState, tour: tour };
  }
  if (document.readyState === 'complete') setTimeout(boot, 500); else window.addEventListener('load', function () { setTimeout(boot, 500); });
})();
