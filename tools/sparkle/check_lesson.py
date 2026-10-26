#!/usr/bin/env python3
"""Check one sparkled lesson before Bethany sees it.   python3 tools/sparkle/check_lesson.py 10-01

FAIL = must fix before showing her. WARN = look at it and decide. Exit code 1 if any FAIL.

 1. JS syntax (page scripts, the lesson file, the shared layer)
 2. Math: answer keys, wrong arithmetic, false unit claims anywhere (page, game, tips, models, video scripts)
 3. "What's Next" names the real next lesson (the 4.10.06 "next unit" bug)
 4. Student words: jargon, slash fractions, "notebook" / "go back", leftover placeholders
 5. Independent Practice overlap: numbers from the IP must not be solved anywhere students are taught
 6. Show What You Know: one answer box per part (a big text box only for a short-answer question)
 7. Videos: think / learn / do (+ optional wrap), each script under 2 minutes, every [ON SCREEN] cue matches a card
 8. Wiring: every model, game window, tip, job target and quest exists
 9. Duplicates across the unit (Math Crew quotes, worked examples) and the lean budget
"""
import glob, html, json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import unit_check  # noqa: E402

JARGON = ['socratic', 'maintenance', 'fluency', 'reasonableness', 'powers of 10', 'power of 10', 'scaffold', 'cpa',
          'concrete-pictorial', 'pictorial', 'abstract', 'metacognit', 'manipulative', 'benchmark', 'formative',
          'summative', 'mastery', 'rigor', 'dok', 'readiness', 'differentiat', 'remediat', 'enrichment', 'i do, we do',
          'gradual release', 'productive struggle', 'heuristic', 'systematic variation', 'connection forward']
PLACEHOLDERS = ['message from your teacher', 'video-placeholder', '[game mockup]', 'recording script', 'lorem', 'todo', 'tbd',
                'in your notebook', 'go back to', 'click here to']
MAX_WORDS = 230      # a 2-minute script at a calm pace
WANT_WORDS = 160     # most scripts should be shorter
VISIBLE_BUDGET = 2600

res = {'FAIL': [], 'WARN': [], 'ok': []}


def out(kind, msg):
    res[kind].append(msg)


def strip(x):
    x = re.sub(r'<(script|style|svg)\b.*?</\1>', ' ', x, flags=re.S)
    x = re.sub(r'<[^>]+>', ' ', x)
    return re.sub(r'\s+', ' ', html.unescape(x))


def tab(s, name):
    m = re.search(r'<div class="tab-panel[^"]*" id="tab-%s">' % name, s)
    if not m:
        return ''
    nxt = re.search(r'<div class="tab-panel[^"]*" id="tab-', s[m.end():])
    return s[m.start(): m.end() + (nxt.start() if nxt else len(s))]


def main(code):
    uu, ll = code.split('-')
    d = os.path.join(HERE, 'lessons', code)
    page_path = glob.glob(os.path.join(REPO, 'math-lesson-4-%s-%s-*.html' % (uu, ll)))[0]
    s = open(page_path, encoding='utf8').read()
    lesson_js = open(os.path.join(d, 'lesson.js'), encoding='utf8').read()
    video = json.load(open(os.path.join(d, 'video.json'), encoding='utf8'))
    vis = strip(s)

    # 1 JS syntax
    js = '\n;\n'.join(re.findall(r'<script(?![^>]*src)[^>]*>(.*?)</script>', s, re.S))
    for name, src in [('page scripts', js), ('lesson.js', lesson_js)] + [
            (f, open(os.path.join(REPO, 'assets/sparkle', f), encoding='utf8').read()) for f in
            ['pq-art.js', 'pq-engine.js', 'oao-kit.js', 'pq-music.js', 'pq-layer.js']]:
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
            f.write(src)
        r = subprocess.run(['node', '--check', f.name], capture_output=True, text=True)
        os.unlink(f.name)
        if r.returncode:
            out('FAIL', 'JS syntax error in %s: %s' % (name, next((l for l in r.stderr.splitlines() if 'Error' in l), '?')))
    out('ok', 'JS syntax')

    # 2 math everywhere
    intended = re.findall(r"intendedWrong:\[(.*?)\]", lesson_js)
    intended = re.findall(r"'([^']+)'", intended[0]) if intended else []
    extras = [('lesson.js', lesson_js)] + [('video:' + k, v.get('script', '') + ' ' + json.dumps(v.get('parts', []), ensure_ascii=False))
                                           for k, v in video['slots'].items()]
    n = 0
    for where, kind, claim, ctx in unit_check.scan(s, extras, intended):
        if kind.startswith('INTENDED'):
            out('WARN', 'Wrong on purpose (the story mistake students fix): "%s" [%s]' % (claim, where))
        else:
            n += 1; out('FAIL', '%s [%s]: "%s" …%s…' % (kind, where, claim, ctx.strip()[:120]))
    # answer-key cards (from the lesson checker)
    OPS = {'×': lambda a, b: a * b, '÷': lambda a, b: a / b if b else None, '+': lambda a, b: a + b, '−': lambda a, b: a - b, '-': lambda a, b: a - b}
    N = r'(\d{1,3}(?:,\d{3})+|\d+)'
    for m in re.finditer(r'>\s*(?:<span class="q-num">\w</span>)?[^<>]{0,60}?' + N + r'\s*([×÷+−-])\s*' + N + r'\s*=\s*\?\s*</p>(.{0,1500}?)(?:inline-feedback|</p>|$)', s, re.S):
        a, op, b, rest = m.groups(); tv = re.findall(r'\(this,\s*true[^)]*\)"[^>]*>\s*<div class="big"[^>]*>([^<]*)<', rest)
        if tv:
            want = OPS[op](int(a.replace(',', '')), int(b.replace(',', '')))
            try:
                if float(tv[0].replace(',', '')) != want:
                    out('FAIL', 'ANSWER KEY: "%s %s %s = ?" is keyed to %s (should be %g)' % (a, op, b, tv[0], want))
            except ValueError:
                pass
    if not n:
        out('ok', 'math: every equation and unit claim checks out')

    # 3 What's Next names the real next lesson
    codes = sorted(re.search(r'math-lesson-4-(\d\d)-(\d\d)', p).groups() for p in glob.glob(os.path.join(REPO, 'math-lesson-4-*.html')))
    i = codes.index((uu, ll)); nxt = codes[i + 1] if i + 1 < len(codes) else None
    m = re.search(r"(What's Next|Connection Forward)(.{0,600})", vis)
    if not m:
        out('WARN', 'no What\'s Next section')
    else:
        t = m.group(2).lower()
        if nxt and nxt[0] == uu and re.search(r'next unit', t) and 'unit %d' % int(uu) not in t:
            out('FAIL', "What's Next says \"next unit\" but the next lesson is %s.%s in this unit" % nxt)
        elif nxt and nxt[0] != uu and 'next lesson' in t and 'assessment' not in t and 'test' not in t:
            out('WARN', "What's Next says \"next lesson\"; the unit test comes next, then Unit %d" % int(nxt[0]))
        else:
            out('ok', "What's Next points the right way")

    # 4 student words
    low = vis.lower()
    for w in JARGON:
        if re.search(r'(?<![a-z])' + re.escape(w), low):
            out('FAIL', 'jargon a 4th grader sees: "%s" …%s…' % (w, vis[max(0, low.index(w) - 40): low.index(w) + 40]))
    for w in PLACEHOLDERS:
        body_html = re.sub(r'<(style|script)\b.*?</\1>', ' ', s, flags=re.S).lower()
        if w in low or (w in ('video-placeholder', '[game mockup]') and w in body_html):
            out('FAIL', 'leftover / not allowed: "%s"' % w)
    sl = set(re.findall(r'(?<![\d/])\d{1,2}/\d{1,3}(?![\d/])', vis))
    if sl:
        out('FAIL', 'slash fractions (use the stacked .frac): ' + ', '.join(sorted(sl)[:8]))
    if not any(r.startswith('jargon') or r.startswith('slash') for r in res['FAIL']):
        out('ok', 'student words: no jargon, no slash fractions')

    # 5 IP overlap
    ips = glob.glob(os.path.join(REPO, 'Grade 4', 'Independent Practice Drafts', 'Unit %d' % int(uu), 'math-lesson-4-%s-%s-*.pdf' % (uu, ll)))
    if not ips:
        out('WARN', 'no Independent Practice PDF found to compare against')
    else:
        ip = subprocess.run(['pdftotext', '-layout', ips[0], '-'], capture_output=True, text=True).stdout
        U = r'(?:mm|cm|km|kg|mL|m|g|L|ft|in|yd|mi|lb|oz|gal|qt|pt|c|h|min|s)\b'
        ip_items = set()
        for m in re.finditer(r'\d[\d,]*\s?%s(?:\s?[−\-+×÷]\s?\d[\d,]*\s?%s)?' % (U, U), ip):
            t = re.sub(r'\s+', ' ', m.group(0)).replace('-', '−')
            digits = re.sub(r'\D', '', t)
            if re.search(r'[−+×÷]', t) or (len(digits) >= 3 and digits not in ('100', '1000', '5280')):
                ip_items.add(t)
        teach = strip(s.replace(tab(s, 'assignment'), '')) + ' ' + ' '.join(v.get('script', '') for v in video['slots'].values()) + ' ' + lesson_js
        teach = teach.replace('-', '−')
        hits = sorted(t for t in ip_items if re.search(r'(?<![\d,])' + re.escape(t).replace(r'\ ', r'\s?') + r'(?![\d,])', teach))
        swyk = strip(tab(s, 'assignment'))
        swyk_hits = sorted(t for t in ip_items if t in swyk)
        if hits:
            out('FAIL', 'Independent Practice numbers taught on the page / in the game or videos (gives away the IP): ' + '; '.join(hits[:10]))
        else:
            out('ok', 'no Independent Practice problem is solved where students are taught')
        if swyk_hits:
            out('WARN', 'Show What You Know repeats IP numbers (%s). The IP is the practice; SWYK can use new numbers.' % '; '.join(swyk_hits[:6]))

    # 6 SWYK answer boxes
    a = tab(s, 'assignment')
    for qb in re.findall(r'<div class="q-block">.*?(?=<div class="q-block">|<div class="activity|<div class="gathered-box|$)', a, re.S):
        if '<textarea' in qb and 'short-answer' not in qb:
            out('FAIL', 'Show What You Know uses a big text box (give each part its own answer box, or mark a real short answer with class "short-answer"): ' + strip(qb)[:80])
        parts = re.findall(r'\(([a-h])\)', strip(qb))
        if len(parts) > 1 and qb.count('class="ans-box"') < len(set(parts)):
            out('FAIL', 'a problem has parts %s but fewer answer boxes' % ','.join(sorted(set(parts))))
    out('ok', 'Show What You Know answer boxes checked')

    # 7 videos
    slots = video['slots']
    names = list(slots)
    if [n for n in names if n not in ('think', 'learn', 'do', 'wrap')] or not all(k in names for k in ('think', 'learn', 'do')):
        out('FAIL', 'video slots must be think, learn, do (+ optional wrap); found ' + ', '.join(names))
    if not slots.get('do', {}).get('screen'):
        out('FAIL', 'the "do" video is the screen recording: set "screen": true')
    page_slots = re.findall(r'class="pq-vslot" data-slot="([a-z]+)"', s)
    for n in names:
        if n not in page_slots:
            out('FAIL', 'video slot "%s" is in video.json but not on the page' % n)
    for n in page_slots:
        if n not in slots:
            out('FAIL', 'page has a video slot "%s" with no script' % n)
    for n, v in slots.items():
        sc = v.get('script', '')
        w = len(re.sub(r'\[ON SCREEN:[^\]]*\]', '', sc).split())
        if w > MAX_WORDS:
            out('FAIL', 'video "%s" is %d words (over 2 minutes; keep it under %d)' % (n, w, MAX_WORDS))
        elif w > WANT_WORDS:
            out('WARN', 'video "%s" is %d words (about %d s); shorter is better' % (n, w, w * 60 // 120))
        labels = {re.sub(r'[^\w\s]', '', p.get('label', '')).strip().lower() for p in v.get('parts', [])}
        for cue in re.findall(r'\[ON SCREEN:\s*([^\]]+)\]', sc):
            for c in cue.split('·'):
                c2 = re.sub(r'[^\w\s]', '', c).strip().lower()
                if c2 and c2 not in labels and c2 != 'confetti':
                    out('FAIL', 'video "%s": [ON SCREEN: %s] matches no card label (%s)' % (n, c.strip(), ', '.join(sorted(labels))))
    out('ok', 'video plan: %s · %s words' % (', '.join(names), ', '.join(str(len(re.sub(r'\[ON SCREEN:[^\]]*\]', '', v.get('script', '')).split())) for v in slots.values())))

    # 8 wiring
    mounted = set(re.findall(r'data-mk-model="(\w+)"', s))
    defined = set(re.findall(r'(\w+):bind\(', lesson_js)) | set(re.findall(r'models:\{([^}]*)\}', lesson_js) and re.findall(r'(\w+):', re.findall(r'models:\{([^}]*)\}', lesson_js)[0]))
    for m in sorted(mounted - defined):
        out('FAIL', 'model "%s" is on the page but not in PQ_LESSON.models' % m)
    for m in sorted(defined - mounted):
        out('WARN', 'model "%s" is defined but not on the page' % m)
    quests = set(re.findall(r'data-quest="(\w+)"', s))
    qdef = set(re.findall(r"D\.quests\.(\w+)\s*=", lesson_js)) | set(re.findall(r"quests\[['\"](\w+)['\"]\]\s*=", lesson_js))
    for q in sorted(quests - qdef):
        out('FAIL', 'game window "%s" has no quest in PQ_DATA.quests' % q)
    for who in set(re.findall(r'class="mk-tip" data-who="(\w+)"', s)):
        if who != 'opti' and not re.search(r"id:'%s'[^}]*look:" % who, lesson_js):
            out('FAIL', 'tip-giver "%s" has no pixel character (needs an npc with a look)' % who)
    for go in re.findall(r"go:'([^']+)'", lesson_js):
        sel = go.replace("\\'", "'")
        idm = re.match(r'#([\w-]+)$', sel)
        if idm and 'id="%s"' % idm.group(1) not in s:
            out('FAIL', 'job target %s is not on the page' % sel)
    if len(quests) > 6:
        out('WARN', '%d game windows; 3–5 keeps the page calm' % len(quests))
    out('ok', 'wiring: %d models, %d game windows' % (len(mounted), len(quests)))


    # 8b helpers (the social studies set): hint ladders, writing help, defined words
    boxes = [i for i in re.findall(r'<textarea class="journal-box"[^>]*id="([\w-]+)"', s) if 'readonly' not in re.search(r'<textarea[^>]*id="%s"[^>]*>' % i, s).group(0)]
    wr = set(re.findall(r"'(journal-[\w-]+)':\{min:", lesson_js))
    for b in boxes:
        if b not in wr:
            out('WARN', 'writing box #%s has no word counter / "Your answer needs" chips (PQ_LESSON.writing)' % b)
    nq = len(re.findall(r'<div class="q-block">', tab(s, 'assignment')))
    nh = len(re.findall(r"sel:'#tab-assignment \.q-block'", lesson_js))
    if nh < nq:
        out('WARN', '%d Show What You Know problems but %d hint ladders (PQ_LESSON.hints)' % (nq, nh))
    for rung_set in re.findall(r"rungs:\[(.*?)\]\}", lesson_js, re.S):
        if len(re.findall(r"'(?:[^'\\]|\\.)*'", rung_set)) != 3:
            out('WARN', 'a hint ladder without exactly 3 rungs')
    if not re.search(r"words:\[\{w:", lesson_js):
        out('WARN', 'no new words defined in the sentence (PQ_LESSON.words)')
    out('ok', 'helpers: %d writing boxes with chips, %d hint ladders, %d defined words' % (len(wr), len(re.findall(r'rungs:\[', lesson_js)), len(re.findall(r"\{w:'", lesson_js))))
    # 9 duplicates across the unit + lean budget
    words = len(vis.split())
    (out('WARN', 'about %d words on the page (budget ~%d)' % (words, VISIBLE_BUDGET)) if words > VISIBLE_BUDGET
     else out('ok', 'about %d words on the page' % words))
    mine = set(re.findall(r'class="bubble-text">\s*"?([^<]{30,})<', s))
    for p in glob.glob(os.path.join(REPO, 'math-lesson-4-%s-*.html' % uu)):
        if p == page_path:
            continue
        other = open(p, encoding='utf8').read()
        for q in mine:
            if q in other:
                out('FAIL', 'Math Crew quote copied from %s: "%s…"' % (os.path.basename(p), q[:60]))

    for k in ('FAIL', 'WARN', 'ok'):
        for m in res[k]:
            print('%-4s %s' % (k, m))
    print('\n%d FAIL · %d WARN' % (len(res['FAIL']), len(res['WARN'])))
    sys.exit(1 if res['FAIL'] else 0)


if __name__ == '__main__':
    main(sys.argv[1])
