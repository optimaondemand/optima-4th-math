#!/usr/bin/env python3
"""Sparkle math check: finds every 'N unit = M unit' and 'a op b = c' claim in the page,
the game data, the tips and the video scripts, and recomputes it. Usage: python3 unit_check.py lesson.html [extra files...]"""
import re, sys, html, json
U = {'mm': ('len', 1), 'cm': ('len', 10), 'm': ('len', 1000), 'km': ('len', 1000000),
     'g': ('mass', 1), 'kg': ('mass', 1000), 'mL': ('vol', 1), 'L': ('vol', 1000),
     'in': ('clen', 1), 'ft': ('clen', 12), 'yd': ('clen', 36), 'mi': ('clen', 63360),
     'oz': ('wt', 1), 'lb': ('wt', 16), 'fl oz': ('cap', 1), 'c': ('cap', 8), 'pt': ('cap', 16), 'qt': ('cap', 32), 'gal': ('cap', 128)}
WORDS = {'millimeters?': 'mm', 'centimeters?': 'cm', 'kilometers?': 'km', 'meters?': 'm', 'milliliters?': 'mL', 'liters?': 'L',
         'kilograms?': 'kg', 'grams?': 'g', 'inch(?:es)?': 'in', 'feet|foot': 'ft', 'yards?': 'yd', 'miles?': 'mi',
         'pounds?': 'lb', 'ounces?': 'oz', 'gallons?': 'gal', 'quarts?': 'qt', 'pints?': 'pt', 'cups?': 'c'}
NUMW = {'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10}
def norm(t):
    t = re.sub(r'<(?:br|/p|/div|/li|/td|/th|/h\d)\b[^>]*>', ' | ', t)
    t = html.unescape(re.sub(r'<[^>]+>', ' ', t)).replace('\\\'', "'").replace('−', '-').replace(' ', ' ')
    for w, u in WORDS.items(): t = re.sub(r'(?<=\d)\s*(?:' + w + r')\b', ' ' + u, t)
    for w, n in NUMW.items(): t = re.sub(r'\b' + w + r'(?= (?:' + '|'.join(re.escape(k) for k in U) + r')\b)', str(n), t, flags=re.I)
    return re.sub(r'\s+', ' ', t)
N = r'(\d{1,3}(?:,\d{3})+|\d+)'
UN = r'(fl oz|mm|cm|km|kg|mL|gal|qt|pt|yd|mi|ft|in|lb|oz|m|g|L|c)\b'
QTY = N + r' ?' + UN + r'(?: (?:and )?' + N + r' ?' + UN + r')?'
def val(m, i):
    a, ua = m.group(i), m.group(i + 1)
    if a is None: return None
    v = int(a.replace(',', '')) * U[ua][1]; kind = U[ua][0]
    if m.group(i + 2):
        ub = m.group(i + 3); b = int(m.group(i + 2).replace(',', ''))
        if U[ub][0] == kind and (U[ub][1] < U[ua][1] or (U[ub][1] == U[ua][1] and 'and' in m.string[m.end(i + 1):m.start(i + 2)])): v += b * U[ub][1]  # 2 m 120 cm (not yet regrouped) is still 320 cm
    return kind, v
QTY0 = N + r' ?' + UN + r'(?: ' + N + r' ?' + UN + r')?'
EQS = [re.compile(q1 + r' ?(?:=|is|makes?|equals) ' + q2 + r'(?! ?[×÷+\-])') for q1, q2 in ((QTY0, QTY0), (QTY0, QTY))]
ar = re.compile(r'(?<![\d,.])' + N + r'(?: ?' + UN + r')? ?([×÷+\-]) ?' + N + r'(?: ?' + UN + r')? ?= ?' + N + r'(?: ?' + UN + r')?(?![\d,])')
INTENDED = []
COMPOUND_TAIL = re.compile(r'\d ?' + UN + r' ?$')  # '2 kg ' just before a number: that number is the 2nd half of an amount


def check(src, text):
    out = []
    t = norm(text)
    byStart = {}
    for e in EQS:
        for m in e.finditer(t): byStart.setdefault(m.start(), []).append(m)
    for st, ms in byStart.items():
        if re.search(r'([×÷+\-] ?|\bof |\d[ ,]?)$', t[max(0, st - 4):st]) or COMPOUND_TAIL.search(t[max(0, st - 9):st]): continue
        verdicts = []
        for m in ms:
            a, b = val(m, 1), val(m, 5)
            if a and b and a[0] == b[0]: verdicts.append((a[1] == b[1], m))
        if not verdicts or any(ok for ok, _ in verdicts): continue
        m = max((m for _, m in verdicts), key=lambda m: len(m.group(0)))
        if any(x in m.group(0) for x in INTENDED):
            out.append((src, 'INTENDED WRONG (story mistake students fix)', m.group(0), '')); continue
        out.append((src, 'UNIT CLAIM IS FALSE', m.group(0), t[max(0, st - 50):m.end() + 20]))
    for m in ar.finditer(t):
        if re.search(r'[×÷+\-(] ?$', t[max(0, m.start() - 3):m.start()]) or COMPOUND_TAIL.search(t[max(0, m.start() - 9):m.start()]): continue
        a, ua, op, b, ub, c, uc = m.groups()
        A, B, C = (int(x.replace(',', '')) for x in (a, b, c))
        if ua and ub and ua != ub: continue  # mixed units: covered by unit check
        if op in '+-' and ua and uc and ua != uc:   # 70 cm + 30 cm = 1 m: compare in the smaller unit
            if U[ua][0] != U[uc][0]: continue
            A, B, C = A * U[ua][1], B * U[ub or ua][1], C * U[uc][1]
        r = {'×': A * B, '÷': A / B if B else None, '+': A + B, '-': A - B}[op]
        if r is not None and r != C:
            out.append((src, 'ARITHMETIC IS WRONG', m.group(0), t[max(0, m.start() - 50):m.end() + 20]))
    return out
def strings(js):
    return [m.group(1) for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'", js)] + [m.group(1) for m in re.finditer(r'"((?:[^"\\\n]|\\.)*)"', js)]

def scan(page_html, extras=(), intended=()):
    """Return [(where, kind, claim, context)] for the page (visible text + every JS string) and extra (name, text) pairs."""
    global INTENDED
    INTENDED = list(intended)
    issues = []
    body = re.sub(r'<(style|svg)\b.*?</\1>', ' ', page_html, flags=re.S)
    vis = re.sub(r'<script\b.*?</script>', ' ', body, flags=re.S)
    issues += check('page', vis)
    for sc in re.findall(r'<script\b[^>]*>(.*?)</script>', body, flags=re.S):
        for st in strings(sc):
            issues += check('game/tips', st)
    for name, text in extras:
        if name.endswith('.js'):
            for st in strings(text):
                issues += check(name, st)
        else:
            issues += check(name, text)
    seen, out = set(), []
    for it in sorted(issues, key=lambda i: i[1].startswith('INTENDED')):
        if (it[1], it[2]) in seen:
            continue
        seen.add((it[1], it[2])); out.append(it)
    return out


if __name__ == '__main__':
    # python3 unit_check.py page.html [video.json …] [--intended "2 L = 200 mL;…"]
    intended = []
    if '--intended' in sys.argv:
        k = sys.argv.index('--intended'); intended = [x.strip() for x in sys.argv[k + 1].split(';')]; del sys.argv[k:k + 2]
    extras = []
    for f in sys.argv[2:]:
        if f.endswith('.json'):
            for k, v in json.load(open(f))['slots'].items():
                extras.append(('video:' + k, v.get('script', '') + ' ' + json.dumps(v.get('parts', []), ensure_ascii=False)))
        else:
            extras.append((f, open(f, encoding='utf8').read()))
    res = scan(open(sys.argv[1], encoding='utf8').read(), extras, intended)
    bad = 0
    for it in res:
        bad += not it[1].startswith('INTENDED')
        print('%s [%s]: "%s"  …%s…' % (it[1], it[0], it[2], it[3]))
    print('%d problems found.' % bad)
    sys.exit(1 if bad else 0)
