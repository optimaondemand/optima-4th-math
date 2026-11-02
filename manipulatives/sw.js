/* OAO Math Manipulatives — offline support.
   Network first, cache fallback: a tool that loaded once keeps working on a bad connection, and updates arrive as soon as the network does. */
var CACHE = 'oaom-v1';
var CORE = ['index.html', 'tool.html', 'set.html', 'duo.html', 'fluency.html', 'puzzle.html', 'games.html', 'lib.css', 'core.js', 'data.js', 'icons.js', 'talks.js', 'puzzles.js', 'games.js', 'fluency.js', 'vendor/qrcode.js',
  'tools/discs.js', 'tools/number.js', 'tools/fraction-measure.js', 'tools/geometry.js', 'tools/trade.js', 'tools/early.js'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return; /* fonts and lesson pages on other hosts go straight to the network */
  e.respondWith(fetch(e.request).then(function (r) {
    if (r && r.ok) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
    return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }).then(function (m) { return m || caches.match('tool.html'); }); }));
});
