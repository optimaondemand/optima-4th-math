#!/usr/bin/env python3
"""G4 Math VR kit (the Commission with the unit's classical guide): weeks/<WW>/week.json -> one page.

  python3 build_vr.py weeks/20/week.json out/G4-Math-Week-20-VR-mockup.html      (mockup: everything inline)
  python3 build_vr.py weeks/20/week.json ../../vr-20.html --repo                  (repo: assets referenced)

Ported 9 Nov 2026 from the G3 math kit (optima-3rd-math/tools/vr). Repo mode expects, from the repo root:
  assets/vr/base.css (= shared/wf-lesson.css), assets/vr/vr.css, assets/vr/vr.js, assets/vr/optima-logo.png
  assets/vr/guides/<guide>.png                          (the unit guide's pixel portrait)
  assets/vr-<W>/img/<key>.jpg, assets/vr-<W>/audio/<guide>-<clip>.mp3
  images/vr-canvas-help-*.jpg                           (help drawer, same as G4 science)
The engine holds no week words. All words live in week.json. Models and the floor sketch are drawn here.
"""
import base64, html, json, os, sys

KIT = os.path.dirname(os.path.abspath(__file__))
E = html.escape
ORANGE, RED, GOLD, INK, SEP = '#E8892B', '#C0392B', '#C99204', '#2B1D12', '#9e4552'


def kitfile(*cands):
    for c in cands:
        p = os.path.join(KIT, c)
        if os.path.exists(p):
            return p
    raise FileNotFoundError(cands[0])


def b64(path, mime):
    with open(path, 'rb') as f:
        return 'data:%s;base64,%s' % (mime, base64.b64encode(f.read()).decode())


def grid(x, y, w, h, s, fill, line='#ffffff'):
    out = ['<rect x="%g" y="%g" width="%g" height="%g" fill="%s" stroke="#7a3c10" stroke-width="1.5"/>' % (x, y, w * s, h * s, fill)]
    for i in range(1, w):
        out.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-opacity=".55"/>' % (x + i * s, y, x + i * s, y + h * s, line))
    for j in range(1, h):
        out.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-opacity=".55"/>' % (x, y + j * s, x + w * s, y + j * s, line))
    return ''.join(out)


def draw(spec, alt):
    """A clean drawn model for a model card (each caption says 'drawn models')."""
    head = '<svg viewBox="0 0 160 120" role="img" aria-label="%s"><rect width="160" height="120" fill="#F7F0E1"/>' % E(alt)
    if spec.get('b10') == 'flat':
        return head + grid(35, 15, 10, 10, 9, ORANGE) + '</svg>'
    if spec.get('b10') == 'rod':
        return head + grid(75, 15, 1, 10, 9, RED) + '</svg>'
    if 'digit' in spec:
        return head + ('<text x="80" y="92" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="84" fill="%s">%s</text></svg>'
                       % (SEP, E(spec['digit'])))
    s = spec['sign']
    if s == '+':
        body = '<path d="M80 30v60M50 60h60" stroke="%s" stroke-width="14" stroke-linecap="round"/>' % SEP
    elif s == '=':
        body = '<path d="M48 48h64M48 74h64" stroke="%s" stroke-width="14" stroke-linecap="round"/>' % SEP
    else:
        body = '<path d="M56 36l48 48M104 36l-48 48" stroke="%s" stroke-width="14" stroke-linecap="round"/>' % SEP
    return head + body + '</svg>'


def sketch_svg(K, alt, filled=False):
    """Leonardo's sketch of the floor: the outline of each part on a square grid (empty) or tiled (filled)."""
    A, B = K['partA'], K['partB']
    W = max(A['x'] + A['w'], B['x'] + B['w']); H = max(A['y'] + A['h'], B['y'] + B['h'])
    s, pad, lab = 12, 6, 70
    out = ['<svg class="sk-svg" viewBox="0 0 %d %d" role="img" aria-label="%s"><rect width="100%%" height="100%%" fill="#F7F0E1"/>' % (W * s + pad * 2 + lab, H * s + pad * 2, E(alt))]
    for P in (A, B):
        x, y = pad + P['x'] * s, pad + P['y'] * s
        if filled:
            col = ORANGE if P['piece'] == 'flat' else RED
            out.append(grid(x, y, P['w'], P['h'], s, col))
            if P['piece'] == 'rod':
                for i in range(1, P['w']):
                    out.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="#7a3c10" stroke-width="1.5"/>' % (x + i * s, y, x + i * s, y + P['h'] * s))
        else:
            out.append(grid(x, y, P['w'], P['h'], s, '#fffaf0', '#c9b48f'))
        out.append('<rect x="%g" y="%g" width="%g" height="%g" fill="none" stroke="%s" stroke-width="3"/>' % (x, y, P['w'] * s, P['h'] * s, INK))
        out.append('<text x="%g" y="%g" font-family="Georgia,serif" font-size="15" font-weight="700" fill="%s">%s</text>'
                   % (pad + W * s + 8 if P['x'] + P['w'] >= W else pad + (P['x'] + P['w']) * s + 8, y + P['h'] * s / 2 + 5, SEP, E(P['label'])))
    return ''.join(out) + '</svg>'


def build(week_path, out_path, repo=False):
    wdir = os.path.dirname(os.path.abspath(week_path))
    W = json.load(open(week_path, encoding='utf-8'))
    wk, G = W['week'], W['guide']
    credits = json.load(open(os.path.join(wdir, 'credits.json'), encoding='utf-8'))
    used = []

    def img(key):
        if key not in used:
            used.append(key)
        if repo:
            return 'assets/vr-%s/img/%s.jpg' % (wk, key)
        return b64(os.path.join(wdir, 'img', key + '.jpg'), 'image/jpeg')

    def help_img(name):
        if repo:
            return 'images/' + name
        return b64(kitfile('images/' + name, '../../images/' + name), 'image/jpeg')

    clips = {}
    for c in W['voice']:
        p = os.path.join(wdir, 'audio', '%s-%s.mp3' % (G['key'], c))
        if os.path.exists(p):
            clips[c] = ('assets/vr-%s/audio/%s-%s.mp3' % (wk, G['key'], c)) if repo else b64(p, 'audio/mpeg')

    def play(c):
        if c in clips:
            return '<button class="vr-play" type="button" data-clip="%s" aria-label="Listen to %s">🔊 %s</button>' % (c, E(G['short']), E(G['short']))
        return ''

    canvas = E(W['canvasName'])
    K = W['sketch']
    sketch_alt = 'Leonardo\'s sketch of the L-shaped floor. %s is a %d by %d rectangle. %s is a %d by %d rectangle touching it.' % (
        K['partA']['label'], K['partA']['w'], K['partA']['h'], K['partB']['label'], K['partB']['w'], K['partB']['h'])
    sketch = '<figure class="vr-sketch">%s<figcaption>Leonardo\'s sketch of the floor</figcaption></figure>' % sketch_svg(K, sketch_alt)

    # ---------- models ----------
    mb = []
    for g in W['vr']['groups']:
        mb.append('<div class="vr-group"><h4>%s</h4><div class="vr-models">' % E(g['title']))
        for m in g['models']:
            pic = draw(m['draw'], m['alt']) if m.get('draw') else '<img src="%s" alt="%s" loading="lazy">' % (img(m['img']), E(m['alt']))
            cnt = ('× %d' % m['count']) if isinstance(m['count'], int) else E(m['count'])
            mb.append('<div class="vr-model"><div class="vr-pic">%s<span class="vr-cnt">%s</span></div><div><b>%s</b>'
                      '<span class="vr-word">%s</span></div></div>' % (pic, cnt, E(m['say']), E(m['word'])))
        mb.append('</div></div>')
    models_html = ''.join(mb)

    # ---------- steps (7; the optional one is the VR-only Extra) ----------
    steps = []
    n = len(W['vr']['steps'])
    for i, s in enumerate(W['vr']['steps']):
        if s.get('where'):
            steps.append('<div class="vr-where">%s</div>' % E(s['where']))
        body = s['html'].replace('@MODELS@', models_html).replace('@CANVAS@', canvas).replace('@SKETCH@', sketch)
        opt = s.get('optional')
        steps.append('<div class="vr-step%s" data-step="%d"%s><button class="vr-chk" type="button" aria-label="Mark step %d done" aria-pressed="false"></button>'
                     '<div><div class="sn">%sStep %d of %d · %s %s</div><div class="st">%s</div></div></div>'
                     % (' vr-opt' if opt else '', i, ' data-optional="1"' if opt else '', i + 1, '<span class="vr-tag">VR only</span>' if opt else '',
                        i + 1, n, E(s['title']), play(s.get('clip', '')), body))

    # ---------- hook: the commission letter ----------
    h = W['hook']
    guide_img = ('assets/vr/guides/%s.png' % G['key']) if repo else b64(kitfile('shared/guides/%s.png' % G['key']), 'image/png')
    rows = ''.join('<tr><td>%s</td><td>%s</td></tr>' % (E(a), E(b)) for a, b in h['rows'])
    hook = ('<div class="wl-card"><div class="wl-look"><b>👀 What am I looking at?</b> %s</div>'
            '<div class="vr-letter"><div class="seal" aria-hidden="true">%s</div><div class="hd"><b>%s</b><span>%s</span></div><table>%s</table>'
            '<div class="ph"><figure><img src="%s" alt="%s"><figcaption>%s</figcaption></figure>'
            '<div class="vr-note"><small>A note from %s</small>%s</div></div></div></div>'
            % (h['look'], W['emoji'], E(h['head']), E(h['sub']), rows, img(h['img']), E(h['alt']), E(h['cap']), E(G['short']), E(h['note'])))

    def guide(text, clip):
        return ('<div class="wl-opti vr-guide"><img src="%s" alt="%s"><div class="bub"><b class="who">%s · %s</b>%s %s</div></div>'
                % (guide_img, E(G['alt']), E(G['short']), E(G['role']), E(text), play(clip)))

    # ---------- VR pane ----------
    B = W['badge']
    req = sum(1 for s in W['vr']['steps'] if not s.get('optional'))
    vr = ('<section class="vr-pane on" id="vr-trip" aria-label="Commission in VR">'
          '<div class="wl-card"><div class="vr-kick">Commission in VR · about 15 minutes</div><h3 class="vr-h3">%s</h3>'
          '<div class="wl-look"><b>👀 What am I looking at?</b> %s</div>'
          '<div class="vr-job"><span><span class="n">1</span>Build it in VR</span><i>→</i><span><span class="n">2</span>Take a photo or a 30 second video</span><i>→</i><span><span class="n">3</span>Submit it to Canvas</span></div>'
          '<div class="vr-prog" aria-live="polite"><span id="vr-prog-t">0 of %d steps done</span> · tap the box when you finish a step<div class="bar"><i id="vr-prog-b"></i></div></div>'
          '%s'
          '<div class="vr-full">⭐ <b>Full points:</b> %s</div>'
          '<label class="vr-done"><input type="checkbox" id="vr-sent"> Submitted!</label>'
          '<div class="vr-badge" id="vr-badge" role="status"><span class="em">%s</span><div><b>%s earned!</b>%s</div></div>'
          '%s</div></section>'
          % (E(W['title']), W['vr']['look'], req, ''.join(steps), E(W['vr']['full']), B['emoji'], E(B['name']), E(B['line']), help_drawer(W, help_img)))

    # ---------- Sketchbook Day pane ----------
    S = W['sketchbook']; wr = S['write']
    starters = ''.join('<button type="button" class="st">%s…</button>' % E(c) for c in wr['starters'])
    chips = ''.join('<button type="button">%s</button>' % E(c) for c in wr['chips'])
    checks = ''.join('<li data-c="%d">%s</li>' % (i, E(c['label'])) for i, c in enumerate(wr['checks']))
    checks += '<li data-c="len">%d words and %d sentences</li>' % (wr['min'], wr['sentences'])
    post = ('<section class="vr-pane" id="vr-post" aria-label="Sketchbook Day">'
            '<div class="wl-card"><div class="vr-kick">%s</div><h3 class="vr-h3">%s</h3>%s'
            '<div class="wl-look"><b>👀 What am I looking at?</b> %s</div><div class="wl-do"><b>What to do:</b> %s</div>'
            '<div id="vr-game"></div>'
            '<div id="vr-write" hidden><div class="vr-gstep">✍️ Your math paragraph for %s</div>'
            '<div class="vr-prompt">%s</div>'
            '<div class="vr-chips"><span>Start with:</span>%s</div><div class="vr-chips"><span>Math words:</span>%s</div>'
            '<textarea id="vr-para" aria-label="Your math paragraph"></textarea>'
            '<ul class="vr-checks" id="vr-checks">%s</ul>'
            '<div class="vr-count" id="vr-count">0 of %d words</div>'
            '<div class="vr-stamp" id="vr-stamp">✔ %s</div></div>'
            '<div class="vr-full">⭐ <b>Full points:</b> %s</div>'
            '<div class="vr-gather"><b>📄 Gathered Answers</b><div style="margin:6px 0">First name: <input type="text" id="vr-name" maxlength="20" autocomplete="given-name"></div>'
            '<div class="ok-name" id="vr-name-msg"></div>'
            '<button class="vr-pdf" type="button" id="vr-pdf" disabled>📄 Download my answers (PDF)</button>'
            '<div class="vr-gate" id="vr-gate">Finish the floor, the equation and your paragraph first.</div>'
            '<div style="font-size:15.5px">Choose <b>Save as PDF</b>, then upload that file to the Canvas assignment.</div></div>'
            '</div></section>'
            % (E(S['kicker']), E(S['title']), guide(W['say']['sketchbook'], 'sketchbook'), S['look'], E(S['do']), E(G['short']), wr['prompt'],
               starters, chips, checks, wr['min'], E(W['stamp']), E(S['full'])))

    game = {'type': 'floor', 'sketch': K, 'names': S['pieceNames'], 'eq': S['eq'],
            'write': {k: wr[k] for k in ('min', 'sentences', 'checks')},
            'filledSvg': sketch_svg(K, sketch_alt, True), 'colors': {'flat': ORANGE, 'rod': RED}}
    cfg = {'pre': W['id'], 'clips': clips, 'game': game, 'canvas': W['canvasName'], 'title': W['title'], 'week': wk,
           'lesson': W['lesson'], 'stamp': W['stamp'], 'guide': G['short'],
           'video': 'assets/video/teacher/g4math-vr-%s.mp4' % wk if repo else ''}

    paths = ('<div class="vr-paths" role="group" aria-label="Pick your path">'
             '<button class="vr-path" type="button" data-path="vr-trip" aria-pressed="true"><span class="ic">🥽</span><span><b>Commission in VR</b><small>Earn the %s</small></span></button>'
             '<button class="vr-path" type="button" data-path="vr-post" aria-pressed="false"><span class="ic">📓</span><span><b>No headset today? Sketchbook Day</b><small>Do it on your computer</small></span></button></div>'
             % E(B['name']))

    video = '<div class="vr-video" id="vr-video" hidden><div class="wl-card"><div class="vr-kick">From your teacher</div><video controls preload="none"></video></div></div>'

    cred = []
    for k in used:
        c = credits[k]
        cred.append('%s: <a href="%s" target="_blank" rel="noopener">%s</a>, %s (%s)'
                    % (E(k), E(c['url']), E(c['title'].replace('File:', '')), E(c['artist'] or 'unknown'), E(c['license'])))
    credits_html = ('<footer class="vr-credits"><b>Photo credits</b> (Wikimedia Commons): ' + '; '.join(cred)
                    + '. Base 10 pieces, numbers, signs and the floor sketch are drawn models. The %s portrait © Optima Academy Online.</footer>' % E(G['short']))

    logo = 'assets/vr/optima-logo.png' if repo else b64(kitfile('shared/optima-logo.png'), 'image/png')
    header = ('<div class="header"><div class="header-brand"><div class="header-logo"><img src="%s" alt="Optima Academy"></div>'
              '<div><div class="header-org">Optima Academy Online</div><div class="header-sub">An Education Experience Company</div></div></div>'
              '<div class="header-title">%s VR: %s</div><div class="header-badge"><span>%s</span><span>Week %s · VR Commission</span></div></div>'
              % (logo, E(W['lesson']), E(W['title']), W['emoji'], wk))
    details = ''.join('<span>%s</span>' % E(d) for d in W['details'])
    top = ('<div class="wl-top"><div class="wl-hdr"><button class="wl-pill" id="wl-details-btn" aria-expanded="false">Activity details ▾</button></div>'
           '<div class="wl-details" id="wl-details">%s</div></div>' % details)

    if repo:
        css = '<link rel="stylesheet" href="assets/vr/base.css"><link rel="stylesheet" href="assets/vr/vr.css">'
        js = '<script src="assets/vr/vr.js"></script>'
    else:
        base = open(kitfile('shared/wf-lesson.css'), encoding='utf-8').read()
        css = '<style>%s</style><style>%s</style>' % (base, open(os.path.join(KIT, 'engine', 'vr.css'), encoding='utf-8').read())
        js = '<script>%s</script>' % open(os.path.join(KIT, 'engine', 'vr.js'), encoding='utf-8').read()

    page = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
            '<!-- G4 Math VR · Week %s · built by tools/vr/build_vr.py from weeks/%s/week.json. Edit the JSON, not this file. -->'
            '<title>%s VR · %s</title>%s</head><body class="g4m-vr"><div class="page-wrap">%s%s<main class="vr">%s%s%s%s%s</main>%s</div>'
            '<script>window.VR=%s;</script>%s</body></html>'
            % (wk, wk, E(W['lesson']), E(W['title']), css, header, top, hook, guide(W['say']['brief'], 'brief'), video, paths,
               vr + post, credits_html, json.dumps(cfg, ensure_ascii=False).replace('</', '<\\/'), js))
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    open(out_path, 'w', encoding='utf-8').write(page)
    missing = [k for k in used if k not in credits]
    print('built', out_path, '%.1f MB' % (len(page) / 1e6), 'clips:', len(clips), 'of', len(W['voice']), 'missing credits:', missing)


def help_drawer(W, help_img):
    m = E(W['map'])
    def s(n, img, title, text):
        return '<div class="vr-hs"><img src="%s" alt="%s" loading="lazy"><div class="t"><b class="k">%s</b><b>%s</b><br>%s</div></div>' % (help_img(img), E(title), n, E(title), text)
    return ('<details class="vr-help" id="vr-help"><summary><span>🛟 Having trouble in VR?<small>Steps with pictures, and a how-to video</small></span></summary><div class="in">'
            '<div class="vid"><iframe data-src="https://www.youtube-nocookie.com/embed/slDH-WN4scY?rel=0" title="How-to video: Optima On-Demand and Canvas" allowfullscreen></iframe></div>'
            '<p style="font-size:15px">These pictures come from other maps. Your map will be <b>%s</b>, but the buttons are the same.</p>'
            '<h5>🖥️ First time only: connect Canvas (on your computer)</h5>'
            + s(1, 'vr-canvas-help-01-login.jpg', 'Log in', 'Go to <b>xr.optimaed.com</b>. Log in with your VR login.')
            + s(2, 'vr-canvas-help-02-authorize.jpg', 'Connect to Canvas', 'Click <b>Connect to Canvas</b>. Log in to Canvas, then click <b>Authorize</b>. You will see <b>Canvas connection completed</b>.')
            + s(3, 'vr-canvas-help-03-connected.jpg', 'Find our class', 'Click <b>Canvas</b> on the left and pick our class. You only do this one time.')
            + '<h5>📄 Only if the assignment has a file</h5>'
            + s(4, 'vr-canvas-help-04-upload.jpg', 'Get the file ready', 'Open the assignment. Click <b>Open in Canvas</b> to download the file. Then click <b>My Files</b> and <b>Upload File</b>.')
            + '<h5>🥽 In the headset</h5>'
            + s(5, 'vr-canvas-help-05-explore.jpg', 'Explore tab', 'Click <b>Explore</b>. Type the map name in <b>Filter environments</b>.')
            + s(6, 'vr-canvas-help-06-begin-solo.jpg', 'Begin Solo', 'Click the map, then click <b>Begin Solo</b>.')
            + s(7, 'vr-canvas-help-07-canvas.jpg', 'Read the assignment', 'Press the <b>top button on your right controller</b>. Click the <b>Canvas</b> tab and pick our assignment. Tip: point at a mint side grip and squeeze to pull the tablet to your hand.')
            + s(8, 'vr-canvas-help-08-models.jpg', 'Bring out the models', 'Click <b>Models</b>. Type the gray word in the search box. Click a model to bring it out.')
            + s(9, 'vr-canvas-help-08b-move.jpg', 'Move and resize', 'Grab a model with the <b>palm trigger</b>. Use <b>both</b> palm triggers to make it bigger or smaller.')
            + s(10, 'vr-canvas-help-09-placed.jpg', 'Need a file?', 'Click <b>Library</b>, then <b>Files</b>. Pick your file to place it.')
            + s(11, 'vr-canvas-help-10-camera.jpg', 'Take a photo or record a video', 'Click <b>Library</b>, then <b>Camera</b>. Move the tablet until your build fits. Click <b>Take photo</b>, or switch to <b>Video</b> and record up to 30 seconds.')
            + s(12, 'vr-canvas-help-11-choose.jpg', 'Pick your photo or video', 'Click the <b>Canvas</b> tab and pick our assignment. Click <b>Choose from My Files</b>, pick your newest photo or video, then <b>Use this file</b>.')
            + s(13, 'vr-canvas-help-12-submitted.jpg', 'Submit to Canvas', 'Click <b>Submit to Canvas</b>. Look for the green <b>Submitted</b> tag. To leave, press the <b>Meta button</b>, then click <b>Quit</b>.')
            + '<h5>🔁 Didn’t work in VR? Two other ways</h5>'
            + s(14, 'vr-canvas-help-13-portal-submit.jpg', 'Use the website', 'Go to <b>xr.optimaed.com</b> and click <b>Canvas</b>. Pick our assignment, click <b>Choose from My Files</b>, pick your photo or video and submit it.')
            + '<p style="font-size:15px">Your photos and videos save to <b>My Files</b> at xr.optimaed.com. You can also download one there and upload it to the Canvas assignment yourself.</p>'
            '</div></details>') % m


if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    build(a[0], a[1], repo='--repo' in sys.argv)
