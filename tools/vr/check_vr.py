#!/usr/bin/env python3
"""Rules check for one G4 MATH VR week. Must print 0 FAIL before Bethany sees the page.
  python3 check_vr.py weeks/20/week.json [built.html]
Ported from the G3 math kit, with the rules from the g4-math-vr-activity skill.
"""
import csv, html, json, os, re, sys

KIT = os.path.dirname(os.path.abspath(__file__))
fails, warns = [], []
def F(m): fails.append(m)
def Wn(m): warns.append(m)

wp = sys.argv[1]
wdir = os.path.dirname(os.path.abspath(wp))
W = json.load(open(wp, encoding='utf-8'))
cred = json.load(open(os.path.join(wdir, 'credits.json'), encoding='utf-8'))

# ---- the app's asset list: exact names only ----
rows = list(csv.reader(open(os.path.join(KIT, 'vr-assets.csv'), encoding='utf-8-sig')))[1:]
maps = {r[0] for r in rows if r[1] != 'IFX Object'}
objs = {r[0] for r in rows if r[1] == 'IFX Object'}
if W['map'] not in maps: F('map not in vr-assets.csv (exact name): ' + W['map'])
if W['mapWord'].lower() not in W['map'].lower(): F('mapWord must be part of the map name')
if sum(1 for m in maps if W['mapWord'].lower() in m.lower()) > 1 and W['map'] not in json.dumps(W['vr']['steps']):
    F('mapWord "%s" matches more than one map: the Go in step must name the exact map' % W['mapWord'])

# ---- week + lesson: last teaching lesson of the week (planning table), unless a logged pilot exception ----
pace = json.load(open(os.path.join(KIT, 'pacing-g4.json'), encoding='utf-8'))
days = pace['weeks'].get(str(W['week']), [])
teach = [c for c in days if not re.search(r'\.(CC|SA)$', c)]
exc = pace.get('pilotException', {}).get(str(W['week']))
if not teach: F('week %s has no teaching lesson in the planning table' % W['week'])
elif W['lesson'] != teach[-1]:
    if exc and exc['lesson'] == W['lesson']: Wn('pilot exception: VR on %s, rule says %s (%s)' % (W['lesson'], teach[-1], exc['why']))
    else: F('VR goes on the last teaching lesson of week %s (%s), not %s' % (W['week'], teach[-1], W['lesson']))
if W['lesson'] not in days: F('%s is not in week %s' % (W['lesson'], W['week']))
if not re.match(r'^%s VR · ' % re.escape(W['lesson']), W['canvasName']): F('canvasName must look like "<lesson code> VR · <Title>"')
if W.get('scope') not in ('review', 'lesson'): F('scope must be "review" or "lesson" (asked every run)')

# ---- the build ----
steps = W['vr']['steps']
if len(steps) != 7: F('VR path needs exactly 7 steps (has %d)' % len(steps))
if [i for i, s in enumerate(steps) if s.get('optional')] != [4]: F('only step 5 (index 4) is optional: the VR-only Extra')
models = [m for g in W['vr']['groups'] for m in g['models']]
if not 4 <= len(models) <= 7: F('4 to 7 model kinds (has %d)' % len(models))
if not 1 <= len(W['vr']['groups']) <= 2: F('1 or 2 model groups')
pieces = sum(m['count'] for m in models if isinstance(m['count'], int)) + W['vr'].get('answerPieces', 0)
if pieces > 20: F('20 pieces or fewer, digits and signs included (has %d)' % pieces)
if not any(m.get('family') == 'Number' or m['name'].startswith('Number ') for m in models): F('the answer must be written with Number models')
if not any('Equal' in m['name'] for m in models): F('the answer needs an Equal Sign model')
for m in models:
    if m['name'] not in objs: F('model name not in vr-assets.csv (exact): ' + m['name'])
    if not m.get('word'): F('model without a search word: ' + m['name'])
    elif m['word'].lower() not in m['name'].lower(): F('search word "%s" is not part of "%s"' % (m['word'], m['name']))
    if not m.get('count'): F('model without a count: ' + m['name'])
vrtxt = json.dumps(W['vr'])
if '@CANVAS@' not in vrtxt: F('a step must name the Canvas assignment (@CANVAS@)')
if not re.search(r'Video', vrtxt) or '30 seconds' not in vrtxt: F('the submit step must offer a photo OR a video of 30 seconds or less')
if re.search(r'\b(type|caption)\b[^.]*\b(Canvas|comment)\b', vrtxt, re.I): Wn('VR path mentions typing in Canvas: nothing is typed on the VR path')
if re.search(r'\bfind\b(?! the area)', json.dumps(W['vr']['steps']), re.I): Wn('"find" in the VR path: students place models, never find them on a map')

# ---- voice: 3 clips only (brief, build, sketchbook; one take each); no step-by-step or done/badge clips ----
G = W['guide']
need = ['brief', 'build', 'sketchbook']
for c in need:
    if c not in W['voice']: F('missing voice line: ' + c)
for c, t in W['voice'].items():
    if c not in need: F('extra voice clip not allowed (3 clips only: brief, build, sketchbook): ' + c)
    n = len(t.split())
    if not 10 <= n <= 28: F('voice %s is %d words (10 to 28)' % (c, n))
    if not os.path.exists(os.path.join(wdir, 'audio', '%s-%s.mp3' % (G['key'], c))): Wn('audio not recorded yet: ' + c)
for c in ('brief', 'sketchbook'):
    if W['say'][c] != W['voice'][c]: F('%s bubble text must match the voice line' % c)
if [s.get('clip') for s in steps].count('build') != 1: F('the build clip goes on the Build step only')
if not os.path.exists(os.path.join(KIT, 'shared', 'guides', G['key'] + '.png')): F('guide portrait missing: shared/guides/%s.png' % G['key'])

# ---- the math: the sketch, the parts and the total agree ----
K = W['sketch']
A, B = K['partA'], K['partB']
if [A['w'] * A['h'], B['w'] * B['h']] != K['parts']: F('sketch parts %s do not match their rectangles (%d, %d)' % (K['parts'], A['w'] * A['h'], B['w'] * B['h']))
if sum(K['parts']) != K['total']: F('parts do not add to the total')
size = {'flat': 100, 'rod': 10, 'unit': 1}
for P in (A, B):
    if size[P['piece']] * P['count'] != P['w'] * P['h']: F('%s: %d %s do not cover %d squares' % (P['label'], P['count'], P['piece'], P['w'] * P['h']))
vrc = {m['draw'].get('b10'): m['count'] for m in models if m.get('draw', {}).get('b10')}
for P in (A, B):
    if vrc.get(P['piece']) != P['count']: F('parity: the VR build and Sketchbook Day use different %s counts' % P['piece'])

# ---- Sketchbook Day must not be easier than VR ----
S = W['sketchbook']; wr = S['write']
if wr['min'] < 45 or wr['sentences'] < 4: F('paragraph bar is 45 words and 4 sentences')
labels = ' '.join(c['label'] for c in wr['checks']).lower()
for k in ('answer', 'solved', 'right', 'math words'):
    if k not in labels: F('paragraph checks need: ' + k)
if str(K['total']) not in wr['checks'][0].get('re', ''): F('the answer check must look for the total %d' % K['total'])
if S.get('options') or S.get('choices'): F('Sketchbook Day must not be multiple choice')
for k in ('noPlus', 'notTrue', 'wrongParts'):
    if str(K['total']) in S['eq'][k]: F('feedback "%s" shows the answer' % k)
if re.search(r'\b%d\b' % K['total'], json.dumps({k: v for k, v in S.items() if k != 'write'})): F('Sketchbook Day text shows the answer %d' % K['total'])
if re.search(r'\b%d\b' % K['total'], json.dumps(W['vr']) + json.dumps(W['voice']) + json.dumps(W['hook'])): F('VR text or a voice line shows the answer %d' % K['total'])

# ---- numbers: no IP / CC / SA / lesson fact ----
facts = set(W.get('facts', []))
for b in W.get('bannedNumbers', []):
    if b in facts: F('banned number or fact used: ' + b)
if not W.get('bannedNumbers'): F('bannedNumbers is empty: list the IP/CC/SA numbers')

# ---- images + credits ----
imgs = set()
def walk(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == 'img' and isinstance(v, str): imgs.add(v)
            walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(W)
for k in imgs:
    if not os.path.exists(os.path.join(wdir, 'img', k + '.jpg')): F('image file missing: ' + k)
    if k not in cred: F('no credit for image: ' + k)
for m in models:
    if not m.get('alt'): F('model without alt text: ' + m['name'])
if not W['hook'].get('alt'): F('hook image without alt text')

# ---- banned words + dashes + Math Crew ----
txt = json.dumps({k: v for k, v in W.items() if k not in ('id', 'bannedNumbers', 'facts')}, ensure_ascii=False)
for bad in ['bonus', 'notebook entry', 'go back', 'multiple choice', 'Math Crew', 'Atlas', 'Felix', 'Hazel', 'Cora', 'XP', 'coins']:
    if re.search(r'\b%s\b' % bad, txt): F('banned word: ' + bad)
txt_nomodel = txt
for m in models: txt_nomodel = txt_nomodel.replace(m['name'], '')
if re.search(r' [—–] |—|–', txt_nomodel): F('dash in student text')

# ---- built page: reading load per path ----
if len(sys.argv) > 2:
    s = open(sys.argv[2], encoding='utf-8').read()
    s = re.sub(r'(?s)<details class="vr-help".*?</details>', '', s)
    s = re.sub(r'(?s)<style.*?</style>|<script.*?</script>|<svg.*?</svg>|<footer.*?</footer>|<textarea.*?</textarea>|<div class="bub">.*?</div>|<span class="vr-word">.*?</span>|<div class="vr-video".*?</video></div></div>|<div class="vr-badge".*?</div></div>|<div class="wl-details".*?</div>', '', s)
    def wc(x): return len(re.findall(r"[A-Za-z0-9’']+", html.unescape(re.sub(r'<[^>]+>', ' ', x))))
    a = s.find('<section class="vr-pane on"'); b = s.find('<section class="vr-pane" id="vr-post"')
    top, vr, st = wc(s[:a]), wc(s[a:b]), wc(s[b:])
    print('reading words: top %d + VR %d = %d; top + Sketchbook Day %d = %d (game text added by the engine not counted)' % (top, vr, top + vr, st, top + st))
    for name, n in (('VR', top + vr), ('Sketchbook Day', top + st)):
        if n > 700: F('%s reading load %d words (limit 700)' % (name, n))
        elif n > 600: Wn('%s reading load %d words (aim <= 600)' % (name, n))

print('pieces: %d · kinds: %d · week %s = %s · VR lesson %s' % (pieces, len(models), W['week'], ', '.join(days), W['lesson']))
for m in warns: print('warn:', m)
for m in fails: print('FAIL:', m)
print('%d FAIL, %d warn' % (len(fails), len(warns)))
sys.exit(1 if fails else 0)
