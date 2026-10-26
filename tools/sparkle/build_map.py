#!/usr/bin/env python3
"""Write assets/sparkle/map-data.js (the level list My Math Map reads). Run after adding lessons:
    python3 tools/sparkle/build_map.py
Levels = units with the Pixel Quest story (10–17). Names come from the story arc (claude/g4-math-pixel-quest-story-arc.md)."""
import glob, html, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(os.path.dirname(HERE))
LEVELS = {10: ('Metric Market', 'Measurement', 'Brick Golem'), 11: ('Greenhollow Gardens', 'Area and Perimeter', 'Thornwall Maze'),
          12: ('Tenthwater Harbor', 'Decimals', 'Fog Kraken'), 13: ('Festival Square', 'Adding and Subtracting Decimals', 'Price-Tag Prankster'),
          14: ("Bakers' Row", 'Multiplying and Dividing Decimals', 'Sourdough Beast'), 15: ('Sunset Skate Park', 'Angles', 'Twister'),
          16: ('Blueprint Town', 'Lines and Shapes', 'Mirror Maze'), 17: ('Toy Workshop', 'Properties of Cuboids', 'Box Fortress')}
out = []
for u, (name, topic, boss) in LEVELS.items():
    ls = []
    for p in sorted(glob.glob(os.path.join(REPO, 'math-lesson-4-%02d-*.html' % u))):
        uu, ll = re.search(r'math-lesson-4-(\d\d)-(\d\d)', p).groups()
        s = open(p, encoding='utf8').read()
        t = re.search(r'class="header-title"[^>]*>(.*?)</', s) or re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S)
        title = html.unescape(re.sub(r'<[^>]+>', '', t.group(1))).strip() if t else os.path.basename(p)
        ls.append({'id': '4.%s.%s' % (uu, ll), 'title': title, 'file': os.path.basename(p),
                   'sparkled': 'assets/sparkle/' in s})
    out.append({'unit': u, 'name': name, 'topic': topic, 'boss': boss, 'lessons': ls})
open(os.path.join(REPO, 'assets', 'sparkle', 'map-data.js'), 'w', encoding='utf8').write(
    '/* built by tools/sparkle/build_map.py */\nwindow.PQ_MAP=' + json.dumps(out, ensure_ascii=False, indent=0) + ';\n')
print('levels:', ', '.join('%d (%d lessons)' % (l['unit'], len(l['lessons'])) for l in out))
