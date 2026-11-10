/* ── OAOFrame: what part of the lesson is on the student's screen, even inside Canvas (10 Nov 2026) ──
   Canvas can show a lesson in one tall iframe: the CANVAS page scrolls, not the lesson, so position:fixed lands at the
   bottom of the lesson and scroll events never fire. Strips of invisible markers down the page + IntersectionObserver
   (which measures against the real browser window, cross-origin too) tell us which band of the lesson is visible.
   OAOFrame.tall() is true in that case; OAOFrame.vis() = {top, bottom} of the visible band in page coordinates;
   OAOFrame.on(fn) calls fn whenever it changes. Outside a tall frame: {top: scrollY, bottom: scrollY + innerHeight}. */
window.OAOFrame = window.OAOFrame || (function () {
  var subs = [], tall = false, box = null, io = null, rects = {}, V = null, STRIP = 80, t = 0;
  function isTall() { try { if (window.top === window.self) return false; } catch (e) {} return document.documentElement.scrollHeight <= innerHeight + 8; }
  function fire() { subs.forEach(function (f) { try { f(vis()); } catch (e) {} }); }
  function vis() { return tall && V ? V : { top: window.scrollY, bottom: window.scrollY + innerHeight }; }
  function calc() { var top = 1e9, bot = -1; for (var k in rects) { var r = rects[k]; if (r) { top = Math.min(top, r[0]); bot = Math.max(bot, r[1]); } } V = bot < 0 ? null : { top: top, bottom: bot }; fire(); }
  function setup() {
    if (io) { io.disconnect(); io = null; } if (box) { box.remove(); box = null; } rects = {};   /* measure without our own markers */
    var was = tall; tall = isTall(); document.documentElement.classList.toggle('oao-tall', tall);
    if (!tall || !('IntersectionObserver' in window)) { if (was !== tall) fire(); return; }
    var H = Math.max(document.body.scrollHeight, innerHeight) - 2, n = Math.ceil(H / STRIP), th = [0, .25, .5, .75, 1];
    box = document.createElement('div'); box.setAttribute('aria-hidden', 'true');
    box.style.cssText = 'position:absolute;left:0;top:0;width:1px;height:' + H + 'px;pointer-events:none;visibility:hidden;z-index:-1';
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var i = e.target._i, y0 = i * STRIP; rects[i] = e.isIntersecting ? [y0 + (e.intersectionRect.top - e.boundingClientRect.top), y0 + (e.intersectionRect.bottom - e.boundingClientRect.top)] : null; });
      calc();
    }, { threshold: th });
    for (var i = 0; i < n; i++) { var s = document.createElement('div'); s._i = i; s.style.cssText = 'position:absolute;left:0;width:1px;top:' + (i * STRIP) + 'px;height:' + Math.min(STRIP, H - i * STRIP) + 'px'; box.appendChild(s); io.observe(s); }
    document.body.appendChild(box);
    if (was !== tall) fire();
  }
  function later() { clearTimeout(t); t = setTimeout(setup, 250); }
  addEventListener('resize', later); addEventListener('load', later);
  if (window.ResizeObserver) { try { new ResizeObserver(later).observe(document.documentElement); } catch (e) {} }
  if (document.readyState !== 'loading') later(); else document.addEventListener('DOMContentLoaded', later);
  addEventListener('scroll', fire, { passive: true });
  return { tall: function () { return tall; }, vis: vis, on: function (f) { subs.push(f); } };
})();
