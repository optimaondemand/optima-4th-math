#!/usr/bin/env python3
"""Character voices for one lesson's game dialog.

  python3 tools/sparkle/voice/voice.py lines 10-01            # list every voiced line, write lessons/10-01/voice-lines.json
  python3 tools/sparkle/voice/voice.py split 10-01 mo take.mp3  # cut one character's take into clips (lines in order), update voice.json

How a take is made: one ElevenLabs generation per character with all of that character's lines in order,
joined by <break time="1.5s" /> (model eleven_multilingual_v2), so the take splits cleanly on the long pauses.
Clips go to assets/audio/lessons/<UU-LL>/<who>-<key>.mp3; the engine plays a clip when the line's key matches
(key = FNV-1a of who|line as written in lesson.js), so a reworded line goes quiet until it is re-voiced."""
import re, sys, os, json, subprocess
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
VOICES = json.load(open(os.path.join(REPO, 'tools/sparkle/voice/voices.json'), encoding='utf8'))

def key(who, t):
    h = 0x811c9dc5
    b = (who + '|' + t).encode('utf-16-le')
    for i in range(0, len(b), 2):
        h ^= b[i] | (b[i + 1] << 8)
        h = (h * 16777619) & 0xffffffff
    return '%08x' % h

def unesc(s): return re.sub(r"\\(.)", r"\1", s)

def lines(code):
    js = open(os.path.join(REPO, 'tools/sparkle/lessons', code, 'lesson.js'), encoding='utf8').read()
    js = js[:js.index('var PQ_LESSON')]                       # game dialog only
    out, seen = [], set()
    def add(who, t):
        k = key(who, t)
        if k in seen: return
        seen.add(k); out.append({'who': who, 't': t, 'key': k})
    for m in re.finditer(r"\{who:'([\w-]+)',t:'((?:[^'\\]|\\.)*)'\s*(?=[,}])", js):
        add(m.group(1), unesc(m.group(2)))
    for idle in re.finditer(r"var (?:IDLE|HELLO)=\{(.*?)\n\};", js, re.S):
        for m in re.finditer(r"(\w+):'((?:[^'\\]|\\.)*)'", idle.group(1)): add(m.group(1), unesc(m.group(2)))
    return out

def speaker(who):
    """The voice key for a speaker: a cast member, a key character mapped in _cast, or the narrator; None = sprite garble."""
    if who in VOICES.get('_cast', {}): return who
    if who in VOICES and not who.startswith('_'): return who if VOICES[who] else None
    if who in VOICES.get('_narrated', []) and VOICES.get('narrator'): return 'narrator'
    return None   # 'me' (the student) and anyone without a voice keep the sprite garble

def voice_id(sp):
    return VOICES.get(VOICES.get('_cast', {}).get(sp, sp), '')

UNITS = {'mm': 'millimeter', 'cm': 'centimeter', 'km': 'kilometer', 'm': 'meter', 'mL': 'milliliter', 'L': 'liter',
         'kg': 'kilogram', 'g': 'gram', 'in': 'inch', 'ft': 'foot', 'yd': 'yard', 'mi': 'mile', 'lb': 'pound', 'oz': 'ounce'}
PLURAL = {'inch': 'inches', 'foot': 'feet'}
SAY = {'Liter Well': 'Leeter Well'}  # names the voices misread (Opti said 'lighter', Cora 'litter'); eleven_v4 can take IPA instead: /ˈliːtər/

def spoken(t):
    """What the voice actor reads: units spelled out (TTS says "em" for m), symbols in words, no {name}."""
    t = t.replace('{name}', 'explorer')
    for w, say in SAY.items(): t = t.replace(w, say)
    t = re.sub(r'\s*\((?:calling[^)]*)\)\s*', ' ', t)
    def unit(m):
        n, u = m.group(1), m.group(2); w = UNITS[u]
        return '%s %s' % (n, w if n == '1' else PLURAL.get(w, w + 's'))
    t = re.sub(r'(\d[\d,]*) ?(mm|cm|km|mL|kg|lb|oz|yd|ft|mi|m|L|g)\b', unit, t)
    t = t.replace(' + ', ' plus ').replace(' × ', ' times ').replace(' = ?', ' equals what?').replace(' = ', ' equals ').replace('…', '...')
    t = t.replace('→', '').replace('↓', '').replace('____', 'blank').strip()
    return t[:1].upper() + t[1:]

def cmd_lines(code):
    L = lines(code); by = {}
    for l in L:
        sp = speaker(l['who'])
        if sp: by.setdefault(sp, []).append(l)
    plan = {sp: {'voice_id': voice_id(sp), 'lines': ls,
                 'prompt': ' <break time="1.5s" /> '.join(spoken(l['t']) for l in ls)} for sp, ls in by.items()}
    json.dump(plan, open(os.path.join(REPO, 'tools/sparkle/lessons', code, 'voice-lines.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    for sp, p in plan.items():
        print('%-9s %2d lines %5d chars  voice=%s' % (sp, len(p['lines']), len(p['prompt']), p['voice_id'] or '(none yet)'))
    print('total chars', sum(len(p['prompt']) for p in plan.values()))

FX = {  # 8-bit treatments, chosen per character in voices.json "_fx" (Bethany picked "handheld", 27 Oct 2026)
    'handheld': 'rubberband=pitch=1.12,highpass=f=250,lowpass=f=3800,aresample=11025,acrusher=bits=8:mode=lin:mix=1:aa=1,aresample=44100',
    'robot': 'highpass=f=320,lowpass=f=5200,equalizer=f=2400:t=q:w=1:g=4,acrusher=bits=10:mode=lin:mix=0.45:aa=1',  # Opti: a little tinny (Bethany, 28 Oct 2026)
    '': ''}

def fx_for(sp):
    f = json.load(open(os.path.join(REPO, 'tools/sparkle/voice/voices.json'), encoding='utf8')).get('_fx', {})
    return FX[f.get(sp, f.get('default', ''))]

def cmd_split(code, sp, take):
    plan = json.load(open(os.path.join(REPO, 'tools/sparkle/lessons', code, 'voice-lines.json'), encoding='utf8'))[sp]
    n = len(plan['lines'])
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', take, '-af', 'silencedetect=n=-40dB:d=0.35', '-f', 'null', '-'], capture_output=True, text=True)
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r.stderr)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r.stderr)]
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r.stderr); dur = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    gaps = [(b - a, a, b) for a, b in zip(st, en) if a > 0.05 and b < dur - 0.05]       # inner silences only
    if len(gaps) < n - 1: sys.exit('%s: only %d pauses for %d lines' % (sp, len(gaps), n))
    cut = sorted(sorted(gaps, reverse=True)[:n - 1], key=lambda g: g[1])                 # the n-1 longest pauses are the 1.5 s breaks
    if n > 1 and min(g[0] for g in cut) < 0.9: print('%s: warning, shortest break is %.2fs; listen to the clips' % (sp, min(g[0] for g in cut)))
    lead = en[0] if st and st[0] <= 0.05 else 0.0
    tail = st[-1] if st and en and en[-1] >= dur - 0.05 and st[-1] > (cut[-1][2] if cut else 0) else dur
    edges = [lead] + [x for g in cut for x in (g[1], g[2])] + [tail]
    cuts = [(edges[i], edges[i + 1]) for i in range(0, len(edges), 2)]
    outdir = os.path.join(REPO, 'assets/audio/lessons', code); os.makedirs(outdir, exist_ok=True)
    vp = os.path.join(REPO, 'tools/sparkle/lessons', code, 'voice.json')
    V = json.load(open(vp, encoding='utf8')) if os.path.exists(vp) else {'dir': 'assets/audio/lessons/%s/' % code, 'clips': {}}
    fx = fx_for(sp)
    for (a, b), l in zip(cuts, plan['lines']):
        f = '%s-%s.mp3' % (l['who'], l['key'])
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', '%.3f' % max(0, a - 0.05), '-to', '%.3f' % (b + 0.12), '-i', take,
                        '-af', 'afade=t=in:d=0.02,areverse,afade=t=in:d=0.08,areverse,' + (fx + ',' if fx else '') + 'loudnorm=I=-18:TP=-2', '-ac', '1', '-ar', '44100', '-b:a', '64k', os.path.join(outdir, f)], check=True)
        V['clips'][l['key']] = f
    json.dump(V, open(vp, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print('%s: %d clips written' % (sp, n))

def cmd_one(code, who, text_start, take):
    """Add ONE line from its own take (no splitting): voice.py one 10-01 atlas "Hi, I'm Atlas" take.mp3"""
    plan = json.load(open(os.path.join(REPO, 'tools/sparkle/lessons', code, 'voice-lines.json'), encoding='utf8'))[who]
    hit = [l for l in plan['lines'] if l['t'].startswith(text_start)]
    if len(hit) != 1: sys.exit('%s: %d lines start with %r' % (who, len(hit), text_start))
    l = hit[0]; f = '%s-%s.mp3' % (l['who'], l['key'])
    outdir = os.path.join(REPO, 'assets/audio/lessons', code)
    fx = fx_for(who)
    trim = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', take, '-af', trim + 'afade=t=in:d=0.02,' + (fx + ',' if fx else '') + 'loudnorm=I=-18:TP=-2',
                    '-ac', '1', '-ar', '44100', '-b:a', '64k', os.path.join(outdir, f)], check=True)
    vp = os.path.join(REPO, 'tools/sparkle/lessons', code, 'voice.json')
    V = json.load(open(vp, encoding='utf8')); V['clips'][l['key']] = f
    json.dump(V, open(vp, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print('%s: wrote %s' % (who, f))

if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'lines': cmd_lines(a[1])
    elif a[0] == 'split': cmd_split(a[1], a[2], a[3])
    elif a[0] == 'one': cmd_one(a[1], a[2], a[3], a[4])
