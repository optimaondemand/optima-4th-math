#!/usr/bin/env python3
"""Build one sparkled lesson in place.

    python3 tools/sparkle/build_lesson.py 10-01

Reads   tools/sparkle/lessons/<UU-LL>/  original.html (saved the first time) · make.py · lesson.js · video.json
Writes  math-lesson-4-<UU>-<LL>-*.html                  (the live page, rebuilt from original.html every time)
        assets/sparkle/lessons/lesson-4-<UU>-<LL>.js    (PQ_VIDEO + PQ_DATA + PQ_LESSON)
        data/videos/lesson-<UU>-<LL>.json               (the video plan the Video Studio reads)
The shared layer (assets/sparkle/*.js, pq.css) is linked with a ?v= stamp so browsers pick up changes.
"""
import glob, hashlib, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import sparkle_lib as L  # noqa: E402

SHARED_JS = ['pq-art.js', 'pq-engine.js', 'oao-kit.js', 'pq-music.js', 'pq-layer.js']


def main(code):
    uu, ll = code.split('-')
    d = os.path.join(HERE, 'lessons', code)
    pages = glob.glob(os.path.join(REPO, 'math-lesson-4-%s-%s-*.html' % (uu, ll)))
    assert len(pages) == 1, 'need exactly one page for %s, found %s' % (code, pages)
    page = pages[0]
    orig = os.path.join(d, 'original.html')
    if not os.path.exists(orig):
        src = open(page, encoding='utf8').read()
        assert 'assets/sparkle/' not in src, 'page is already sparkled but original.html is missing'
        open(orig, 'w', encoding='utf8').write(src)
        print('saved original.html')
    s = open(orig, encoding='utf8').read()

    # 1. the lesson's own page edits
    G = {'s': s, 're': re, 'block_end': L.block_end, 'game': L.game, 'slot': L.slot, 'video': L.video, 'tip': L.tip,
         'model': L.model, 'BOARD': L.BOARD, 'TOWN': L.TOWN, 'box': L.box, 'part': L.part, 'problem': L.problem}
    G.update(L.helpers(G))
    exec(compile(open(os.path.join(d, 'make.py'), encoding='utf8').read(), 'make.py', 'exec'), G)
    s = G['s']

    # 2. the lesson data file
    video = json.load(open(os.path.join(d, 'video.json'), encoding='utf8'))
    lesson_js = open(os.path.join(d, 'lesson.js'), encoding='utf8').read()
    data_rel = 'assets/sparkle/lessons/lesson-4-%s-%s.js' % (uu, ll)
    data = '/* built by tools/sparkle/build_lesson.py from tools/sparkle/lessons/%s — edit there, not here */\n' % code
    data += 'window.PQ_VIDEO=' + json.dumps(video, ensure_ascii=False) + ';\n' + lesson_js
    open(os.path.join(REPO, data_rel), 'w', encoding='utf8').write(data)
    os.makedirs(os.path.join(REPO, 'data', 'videos'), exist_ok=True)
    json.dump(video, open(os.path.join(REPO, 'data', 'videos', 'lesson-%s-%s.json' % (uu, ll)), 'w', encoding='utf8'),
              ensure_ascii=False, indent=1)

    # 3. inject the shared layer (stamp = hash of every file the page loads)
    h = hashlib.sha1()
    for f in ['pq.css'] + SHARED_JS:
        h.update(open(os.path.join(REPO, 'assets', 'sparkle', f), 'rb').read())
    h.update(data.encode('utf8'))
    v = h.hexdigest()[:8]
    s = re.sub(r'<title>\[GAME MOCKUP\] ', '<title>', s)
    s = s.replace('</head>', '<link rel="stylesheet" href="assets/sparkle/pq.css?v=%s">\n</head>' % v, 1)
    tags = ''.join('<script src="assets/sparkle/%s?v=%s"></script>\n' % (f, v) for f in SHARED_JS)
    tags += '<script src="%s?v=%s"></script>\n' % (data_rel, v)
    tags += '<script>try{PQ.init(PQ_DATA);}catch(e){(window.PQ_FAILED=window.PQ_FAILED||[]).push("game: "+e.message);}PQM.init();</script>\n'
    i = s.rindex('</body>')
    s = s[:i] + tags + s[i:]
    open(page, 'w', encoding='utf8').write(s)
    print('built', os.path.relpath(page, REPO), 'v=' + v, '%d KB' % (len(s) // 1024))


if __name__ == '__main__':
    main(sys.argv[1])
