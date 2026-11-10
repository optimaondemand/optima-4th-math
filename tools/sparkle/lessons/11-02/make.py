# Lesson 4.11.02 · Area of Rectangles, Part 2 (a missing side) · the classical-guide layer (Leonardo da Vinci's workshop, Milan 1495)
# Dimensions 4B Chapter 11 Lesson 2 (the area and one side are known: build rows of the known side, see it as "side × ? = area",
# divide, check by multiplying; convert the side first) + the IP. The old page solved IP 1(a), 1(b), all of IP 2 and IP 3(a) on
# the page, used multiple choice and a "fact triangle"; the three tabs are rebuilt around the guide's Think → Learn → Do.
# One hands-on job per IP operation, new numbers (see notes.md). Run: python3 tools/sparkle/build_lesson.py 11-02
import re

def job(story, steps):
    return ('<div class="task-box"><div class="task-label">Your job</div><p>%s</p></div>' % story
            + '<div class="mk-todo"><b>What to do</b><ol>' + ''.join('<li>%s</li>' % x for x in steps) + '</ol></div>')

def act(id, color, icon, title, sub, body, cls='bl-slate', extra=''):
    return ('<div class="activity %s" id="%s"%s><div class="activity-head"><div class="activity-num" style="background:%s;">%s</div><div><div class="activity-title">%s</div>'
            '<div class="activity-sub">%s</div></div></div><div class="activity-body">%s</div></div>') % (cls, id, extra, color, icon, title, sub, body)

def jbox(id, prompt, data, ph=''):
    return ('<div class="journal-label">%s <span class="saved-dot" id="dot-%s"></span></div>'
            '<textarea class="journal-box" data-label="%s" id="journal-%s" oninput="autoSave(this,\'dot-%s\')" placeholder="%s"></textarea>') % (prompt, id, data, id, id, ph)

def F(n, d):
    return '<span class="frac"><span class="num">%s</span><span class="den">%s</span></span>' % (n, d)

RUST = '#9e4552'; SLATE = '#3A6B9A'

# ── header: clean top (the layer adds Standards, Read aloud and the windows switch)
for mk in ['<div class="quote-strip">', '<div class="standards-toggle-bar"', '<div class="info-strip">', '<div class="explorer-strip">', '<div class="need-strip">']:
    replace_block(mk, '')
m = re.search(r'<div class="intro-2col">', s); i = m.start(); j = block_end(s, i)
INTRO = ('<div class="intro-2col"><div class="intro-card theme-question"><div class="intro-card-head"><div class="intro-card-head-icon">❓</div><div><div class="intro-card-head-label">Essential Question</div>'
  '<div class="intro-card-head-title">If you know the area and one side, how can you find the other side?</div></div></div>'
  '<div class="intro-card-body cw-eq-body">'
  '<svg class="cw-eq-pic" viewBox="0 0 330 104" role="img" aria-label="A rectangle 4 inches wide. The other side is a question mark. Area = 32 square inches is written inside.">'
  '<text x="40" y="16" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="16" fill="#0E1C42">4 in</text>'
  '<line x1="0" y1="24" x2="80" y2="24" stroke="#0E1C42" stroke-width="2"/><rect x="0" y="32" width="80" height="68" rx="2" fill="#fff" stroke="#0E1C42" stroke-width="3"/>'
  '<text x="40" y="71" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#0E1C42">32 sq in</text>'
  '<text x="92" y="72" font-family="Nunito,sans-serif" font-weight="900" font-size="20" fill="#9E4552">?</text></svg>'
  '<p class="pq-eq-note" style="margin-top:6px;">You know the <strong>area</strong> and <strong>one side</strong>. The other side is missing. Today you will find out how to find it.</p></div></div>'
  '<div class="intro-card theme-objectives"><div class="intro-card-head"><div class="intro-card-head-icon">🎯</div><div><div class="intro-card-head-label">Today\'s Objectives</div><div class="intro-card-head-title">You will…</div></div></div><div class="intro-card-body">'
  '<div class="obj-line"><span class="obj-icon">🟨</span><span><strong>Find a missing side</strong> by building rows of the side you know.</span></div>'
  '<div class="obj-line"><span class="obj-icon">➗</span><span><strong>Think "side × ? = area"</strong>, divide the area by the side you know, and multiply to check.</span></div>'
  '<div class="obj-line"><span class="obj-icon">🔁</span><span><strong>Put the side in the same unit as the area first:</strong> change feet to inches.</span></div></div></div></div>')
s = s[:i] + '<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>' + INTRO + '</details>' + s[j:]

# ── the fact warm-up: division and missing-factor facts (no IP fact, no job answer)
FACTS = [('32 ÷ 4', '8'), ('42 ÷ 6', '7'), ('45 ÷ 5', '9'), ('21 ÷ 3', '7'), ('81 ÷ 9', '9'),
         ('6 × ___ = 48', '8'), ('4 × ___ = 28', '7'), ('3 × ___ = 33', '11'), ('7 × ___ = 35', '5'), ('12 × ___ = 36', '3')]
i = s.index('<div class="fluency-box" data-timed="false">'); j = block_end(s, i); FL = s[i:j]
gi = FL.index('<div class="fluency-grid" id="fluencyGrid">'); gj = block_end(FL, gi)
FL = FL[:gi] + '<div class="fluency-grid" id="fluencyGrid">' + ''.join(
    '<div class="fluency-item"><span class="fluency-q">%s%s</span><input autocomplete="off" class="fluency-input" data-answer="%s" inputmode="numeric" type="text" aria-label="%s"/></div>\n'
    % (q, '' if '___' in q else ' =', a, q.replace('___', 'what number'))
    for q, a in FACTS) + '</div>' + FL[gj:]
FL = FL.replace('<div class="fluency-head-icon">✍️</div>', '<div class="fluency-head-icon">➗</div>')
FL = FL.replace('<div class="fluency-head-label">FLUENCY WARM-UP</div><div class="fluency-head-title">Fact Families — All Four Operations</div>', '<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">Division Facts</div>')
FL = FL.replace('Warm up your fact fluency before today’s lesson. Work through these, then check your answers.', 'Today you will find a missing side, and that takes division. Type each answer, then check. A blank means "what number?"')
FL = FL.replace('data-label="Fluency Warm-Up (Fact Families — All Four Operations)"', 'data-label="Fact Warm-Up (Division Facts)"')
s = s.replace('var FLUENCY_TITLE = "Fact Families — All Four Operations";', 'var FLUENCY_TITLE = "Division Facts";')
s = s.replace('onclick="switchTab(\'learn\')">📐 Learn ', 'onclick="switchTab(\'learn\')">📐 Lesson ')
s = s.replace('<em>Area of Rectangles — Part 2</em>', '<em>Area of Rectangles, Part 2</em>')   # no em dash in the student title (audit, 10 Nov 2026)

def grab(marker):
    i = s.index(marker); return s[i:block_end(s, i)]
GATHER = grab('<div class="gathered-box">')
TURNIN = grab('<div class="turn-in-card">')
for a, b in [('<span>I completed both quick checks above.</span>', '<span>I finished all six workshop jobs.</span>'),
             ('<span>I showed my model or my steps for each problem.</span>', '<span>I answered every Show What You Know question. (The number bonds and the bonus are optional.)</span>'),
             ('<span>I checked that each answer makes sense.</span>', '<span>I checked each missing side by multiplying it by the side I knew.</span>')]:
    assert a in TURNIN; TURNIN = TURNIN.replace(a, b)

def panel(tab, inner):
    global s
    k = s.index('<div class="tab-panel%s" id="tab-%s">' % (' active' if tab == 'warmup' else '', tab)); e = block_end(s, k)
    if tab == 'assignment':
        e = s.index('<div class="footer">')
    head = s[k:s.index('>', k) + 1]
    s = s[:k] + head + inner + '</div>' + s[e:]

def nextbtn(text, tab, label):
    return '<div class="tab-next-wrap"><p class="tab-transition-voice">%s</p><button class="tab-next-btn" onclick="switchTab(\'%s\')">%s</button></div>' % (text, tab, label)

def nudge(tool, name, text):
    import base64, json   # the tool opens ready for this lesson: inch squares for the Color Tiles
    st = {'tiles': {'cols': 20, 'rows': 8, 'unit': 'in'}}.get(tool)
    tool = tool + ('&amp;st=1#s=' + base64.urlsafe_b64encode(json.dumps(st, separators=(',', ':')).encode()).decode().rstrip('=') if st else '&amp;st=1')
    return ('<div class="cw-nudge"><a class="cw-tool" href="manipulatives/tool.html?t=%s" target="_blank" rel="noopener" title="%s">'
            '<span aria-hidden="true">🧮</span> Try the <b>%s</b> ↗</a></div>' % (tool, text.replace('"', '&quot;'), name))

# ═════════ WARM-UP (Dimensions Think) ═════════
THINK = act('mk-think', '#F2B705;color:#0E1C42', '🤔', 'Think About It: The Storeroom Floor', 'Try it your way first',
  '<div class="callout callout-think"><span class="callout-icon">🟨</span><p>Each floor tile is a square, <strong>1 foot</strong> on every side, so it covers 1 square foot. '
  'The storeroom floor is <strong>7 ft</strong> wide. <strong>56</strong> tiles cover the whole floor, with none left over. '
  '<strong>How long is the floor?</strong></p></div>'
  + jbox('notice', '👀 What do you notice about the floor and the tiles? What do you wonder?', 'Warm-Up — I notice, I wonder', 'I notice… I wonder…')
  + tip('leo', 'Before you start, make a guess. Then find out any way you like: lay the tiles, count by 7s, or use a fact you know.')
  + model('think'), cls='bl-yellow')
MENTAL = ('<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F2B705;color:#0E1C42;">🧠</div>'
  '<div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, three quick problems</div></div></div><div class="activity-body">'
  + tip('felix', 'Tens are easy to divide. Split the number so one part is a ten-fact, like 40 ÷ 4. Then check by multiplying!') + model('mental') + '</div></div>')
panel('warmup', video('think') + FL + MENTAL + BOARD + win('floor') + THINK
      + nextbtn('Next: on the Lesson tab, you watch how to find a missing side, and you take on the workshop jobs.', 'learn', 'Continue to 📐 Lesson →'))

# ═════════ LESSON ═════════
def bub(who, name, text):
    return '<div class="bubble %s"><div class="bubble-avatar">%s</div><div class="bubble-body"><div class="bubble-name">%s</div><div class="bubble-text">"%s"</div></div></div>' % (who, who[0].upper(), name, text)

WAYS = ('<div class="activity bl-violet" id="mk-ways"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div><div><div class="activity-title">The Math Crew: Four Ways</div>'
     '<div class="activity-sub">The storeroom floor: 7 ft wide, 56 tiles</div></div></div><div class="activity-body">'
     '<p>Here is how the Math Crew found the length of the floor. Which way is most like yours?</p>'
     '<div class="bubble-row">' + bub('atlas', 'Atlas: rows of 7', '7, 14, 21, and on to 56. That is 8 rows.')
     + bub('felix', 'Felix: what times 7?', '7 × ? = 56. I know 7 × 8 = 56.') + '</div>'
     '<div class="bubble-row">' + bub('hazel', 'Hazel: picture the floor', '8 rows of 7 tiles. Each row is 1 foot of the length.')
     + bub('cora', 'Cora: divide, then check', '56 ÷ 7 = 8. Check: 8 × 7 = 56. The floor is 8 ft long.') + '</div>'
     + jbox('compare', '✏️ Which Crew way is most like yours? Why?', 'Lesson — My way and the Crew\'s ways')
     + '</div></div>')

GUIDED = act('mk-guided', '#2DB87A', '🧱', 'Your Turn', 'A new panel, step by step: build rows, then side × ? = area',
  '<p style="font-weight:700;">Bernardo has <strong>90</strong> gold sheets for a panel that is <strong>6 in</strong> wide. Each gold sheet is 1 inch on every side. How long will the panel be? Follow the steps. Each step opens when you finish the one before it.</p>'
  + tip('cora', 'Step 1: look at the units. The area is in square inches, and the width is in inches. They match, so you can start.')
  + model('guided'), cls='bl-green', extra=' style="margin-top:16px;"')
KEY = ('<div class="key-concept" id="mk-key" style="margin-top:16px;"><div class="key-concept-label">📐 Leonardo\'s Measuring Rules</div>'
  '<p>Area = length × width. So if you know the area and one side, ask: <strong>the side I know × ? = the area</strong>. The ? is a missing factor, and you find a missing factor by dividing.</p>'
  '<ol style="margin:6px 0 6px 20px;font-weight:700;"><li>Are the area and the side in the same units? If not, change the side to the smaller unit, like feet to inches.</li><li>Divide: the area ÷ the side you know = the missing side.</li><li>Check: multiply the two sides. You should get the area.</li></ol>'
  '<p>The missing side is a <strong>length</strong>, in inches or feet. Only the area is in square units.</p>'
  + tip('leo', 'I always check by multiplying. If I get the area back, I know my side is right.')
  + '</div>' + video('do'))
FREE = ('<details class="cw-extra" style="margin-top:16px;"><summary>🧰 An extra tile grid, for your own tries</summary>'
  + model('free') + '</details>')

STUDY = ('<div class="activity bl-slate" id="mk-worked" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:%s;">🔍</div><div><div class="activity-title">Study It: The Window Shutter</div>'
 '<div class="activity-sub">Already solved for you. Read it, then try the jobs.</div></div></div><div class="activity-body">'
 '<p style="margin:0 0 10px;font-weight:700;color:#3A4A6B;">👀 Nothing to type here. This problem is solved two ways. Both ways get the same answer. Read the one that makes more sense to you.</p>'
 '<div class="task-box"><div class="task-label">Problem</div><p>A window shutter is <strong>7 in</strong> wide. It takes <strong>91</strong> gold sheets to cover it. How long is the shutter?</p></div>'
 '<div class="we-two"><div class="we-way"><h5>Way 1: count up by rows of 7</h5><ol><li>One row across the shutter takes 7 sheets.</li><li>Count by 7s: 7, 14, 21, … all the way to 91.</li><li>That is 13 rows. Each row is 1 inch, so the shutter is <b>13 in</b> long.</li></ol></div>'
 '<div class="we-way"><h5>Way 2: divide</h5><ol><li>7 × ? = 91, so divide: 91 ÷ 7.</li><li>Split 91 into 70 and 21. (70 ÷ 7 = 10 and 21 ÷ 7 = 3)</li><li>10 + 3 = 13. The shutter is <b>13 in</b> long.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Check it: 13 rows of 7. 13 × 7 = 91. ✓ It is 13 inches, not 13 square inches, because it is a length.</p></div></div>') % SLATE

DUKE = act('mk-duke', SLATE, '📜', 'The Duke\'s Letter: 48 Sheets, 4 in Wide', 'Job 2 · Find the missing side',
  job('Remember the Duke\'s letter? He wants a gold panel that uses exactly <strong>48</strong> gold sheets, and it must be <strong>4 in</strong> wide. <strong>How long must the panel be?</strong>',
      ['Lay rows of 4 gold sheets, or press <b>+ Add a row</b>, until all 48 are used.',
       'Count the rows. Type the length in inches.',
       'Then type that length in feet.'])
  + tip('atlas', 'Each row of 4 sheets adds 1 inch to the length. Count the rows, and you know the length!') + model('duke'), cls='bl-slate', extra=' style="margin-top:16px;"')

SQUARE = act('mk-square', RUST, '⬛', 'A Square Panel of 64 Sheets', 'Job 3 · Squares: ? × ? = area',
  job('Leonardo wants a square panel that uses exactly <strong>64</strong> gold sheets. <strong>How long is each side?</strong>',
      ['Build a square with exactly 64 tiles. Drag across the squares to lay them.',
       'All 4 sides must be the same length.',
       'Type how long each side is.'])
  + tip('leo', 'A square has 4 equal sides. So ask: what number times itself makes 64?') + model('square')
  + nudge('geoboard', 'Geoboard', 'This might be a good time to try making squares on a geoboard. Count the squares inside each one.'),
  cls='bl-violet', extra=' style="margin-top:16px;"')

CONVERT = act('mk-convert', SLATE, '🔁', 'Same Units First: a Lid and a Shelf', 'Job 4 · Convert the side, then divide',
  job('Two more pieces need gold. Each area is in <strong>square inches</strong>, but each side Leonardo measured uses <strong>feet</strong>. <strong>How long is each missing side?</strong>',
      ['Change the side to inches first. Type it.',
       'Then lay rows of that many sheets, or think: side × ? = area.',
       'Type the missing side. Do both rounds.'])
  + tip('cora', 'Look at the units before you divide. 1 foot is 12 inches. For ' + F(3, 4) + ' ft, split 12 inches into 4 equal parts.')
  + '<p class="cw-conv-note" style="font-weight:700;">Round 2 uses a fraction of a foot: <strong>' + F(3, 4) + ' ft</strong>.</p>'
  + model('convert'), cls='bl-slate', extra=' style="margin-top:16px;"')

FIX = act('mk-fix', RUST, '📝', 'Bernardo\'s Note: 72 × 8 = 576?', 'Job 5 · Find and fix the mistake',
  job('Bernardo\'s note says the lid has an area of <strong>72 square inches</strong> and one side of <strong>8 in</strong>, so the other side is <strong>72 × 8 = 576 in</strong>. <strong>What did he do wrong? How long is the other side really?</strong>',
      ['Lay rows of 8 sheets until all 72 are used, or think: 8 × ? = 72.',
       'Type the other side.',
       'Write what Bernardo did wrong and how to fix it.'])
  + tip('felix', 'His times table is fine. But is times the right thing to do when you already know the area?') + model('fix')
  + jbox('fix', '✏️ What was Bernardo\'s mistake? How do you fix it?', 'Lesson — Bernardo\'s mistake'), cls='bl-violet', extra=' style="margin-top:16px;"')

CARTOON = act('mk-cartoon', SLATE, '🖼️', 'The Big Drawing Paper', 'Job 6 · Two steps: the same area',
  job('Before Leonardo paints on a wall, he draws the whole picture on big paper. His first paper is <strong>12 ft</strong> long and <strong>9 ft</strong> wide. A second paper must have <strong>the same area</strong>, but it can only be <strong>6 ft</strong> wide. <strong>How long must the second paper be?</strong>',
      ['Step 1: find the area of the first paper. Type it.',
       'Step 2: the second paper has the same area. Lay rows of 6, or think: 6 × ? = that area.',
       'Type how long the second paper must be.'])
  + tip('hazel', 'Picture both papers. The second one is skinnier, so it has to be longer to cover the same area.') + model('cartoon'),
  cls='bl-slate', extra=' style="margin-top:16px;"')

BIG = 'To find a missing side, ask: the side I know × ? = the area. Divide the area by the side you know, then multiply to check. If the side and the area use different units, change the side first (feet to inches). The missing side is a length, in inches or feet.'
PIC = ('<svg viewBox="0 0 600 260" class="mk-svg" role="img" aria-label="A rectangle 5 feet wide with a question mark for the other side and 55 square feet written inside. 5 × ? = 55, so 55 ÷ 5 = 11 feet. Check: 11 × 5 = 55.">'
 '<rect width="600" height="260" rx="12" fill="#FFF8EF"/>'
 '<defs><marker id="opA" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#0E1C42"/></marker></defs>'
 + ''.join('<rect x="%d" y="40" width="22" height="22" fill="#F2B705" stroke="#B98A00"/>' % (60 + c * 22) for c in range(5))
 + '<rect x="60" y="40" width="110" height="180" fill="none" stroke="#0E1C42" stroke-width="3"/>'
 '<line x1="60" y1="26" x2="170" y2="26" stroke="#0E1C42" stroke-width="1.6" marker-start="url(#opA)" marker-end="url(#opA)"/>'
 '<text x="115" y="20" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="17" fill="#0E1C42">5 ft</text>'
 '<line x1="186" y1="40" x2="186" y2="220" stroke="#0E1C42" stroke-width="1.6" marker-start="url(#opA)" marker-end="url(#opA)"/>'
 '<text x="196" y="136" font-family="Nunito" font-weight="900" font-size="20" fill="#9E4552">?</text>'
 '<rect x="70" y="118" width="90" height="26" rx="4" fill="#fff" stroke="#0E1C42"/><text x="115" y="136" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="13" fill="#0E1C42">55 sq ft</text>'
 '<text x="240" y="80" font-family="Nunito" font-weight="900" font-size="18" fill="#0E1C42">1. Ask: 5 × ? = 55</text>'
 '<text x="240" y="122" font-family="Nunito" font-weight="900" font-size="18" fill="#0E1C42">2. Divide: 55 ÷ 5 = 11 ft</text>'
 '<text x="240" y="164" font-family="Nunito" font-weight="900" font-size="18" fill="#9E4552">3. Check: 11 × 5 = 55 ✓</text>'
 '<text x="240" y="206" font-family="Nunito" font-weight="800" font-size="15" fill="#3A4A6B">The side is 11 ft, a length (not square feet).</text></svg>')
ONEPIC = ('<div class="key-concept pq-onepic" id="mk-onepic" style="margin-top:16px;"><div class="key-concept-label">🖼️ The Whole Lesson in One Picture</div>'
 '<p class="op-big"><strong>' + BIG + '</strong></p>' + PIC
 + jbox('big', '✏️ Put the big idea in your own words. Use an example of your own.', 'Lesson — The big idea in my own words') + '</div>')

def station(n, title, sub, inner):
    return '<div class="cw-station" data-st="%d" data-title="%s" data-sub="%s">%s</div>' % (n, title, sub, inner)
panel('learn', station(1, 'Learn it', 'Watch, compare the Crew\'s ways, then your turn', video('learn') + WAYS + GUIDED + KEY)
      + station(2, 'Practice together', 'Study a solved one, the Duke\'s letter, a square', STUDY + DUKE + SQUARE + FREE)
      + station(3, 'On your own', 'Convert first, Bernardo\'s note, the big paper, the big idea', CONVERT + win('note') + FIX + CARTOON + ONEPIC)
      + nextbtn('Six workshop jobs. Now show what you know.', 'assignment', 'Continue to 🌟 Show What You Know →'))

# ═════════ SHOW WHAT YOU KNOW ═════════
SW = ('<div class="activity bl-navy"><div class="activity-head"><div class="activity-num" style="background:#0E1C42;">📬</div><div><div class="activity-title">Show What You Know</div><div class="activity-sub">Type each answer in its own box.</div></div></div><div class="activity-body">'
 + tip('leo', 'Before each problem, ask: are the side and the area in the same units? Then divide, and multiply to check.')
 + problem(1, 'Find the missing side.', part('Problem 1 (a)', '(a) A rectangle has an area of 63 square cm. Its width is 7 cm. Length = ' + box('1a', 'Problem 1 a, centimeters', 'cm'))
        + part('Problem 1 (b)', '(b) A square has an area of 36 square inches. Each side = ' + box('1b', 'Problem 1 b, inches', 'in')))
 + nudge('whiteboard', 'Grid Whiteboard', 'Stuck? Draw the rectangle on the Grid Whiteboard. Write the side you know on top and the area inside.')
 + problem(2, 'Convert first.', part('Problem 2 (a)', '(a) A tray covers 68 square inches. Its width is ' + F(1, 3) + ' ft. First, ' + F(1, 3) + ' ft = ' + box('2a', 'Problem 2 a, inches', 'in'))
        + part('Problem 2 (b)', '(b) The tray\'s length = ' + box('2b', 'Problem 2 b, inches', 'in')))
 + nudge('tiles', 'Color Tiles', 'This might be a good time to try the Color Tiles. Build the 8 by 3 rectangle, then move the same tiles into rows of 2.')
 + problem(3, 'The same area.', part('Problem 3 (a)', '(a) Rectangle A is 8 in long and 3 in wide. Area of A = ' + box('3a', 'Problem 3 a, square inches', 'sq in'))
        + part('Problem 3 (b)', '(b) Rectangle B has the same area as A. Its width is 2 in. Length of B = ' + box('3b', 'Problem 3 b, inches', 'in')))
 + model('bonus')
 + act('mk-prove', RUST, '🧾', 'Prove It: Is Bernardo Right?', 'Answer the Essential Question',
     job('A panel covers <strong>54 square inches</strong> and is <strong>6 in</strong> wide. Bernardo says it is <strong>48 in</strong> long, because 54 − 6 = 48. <strong>Prove him wrong. Show the right way to find the missing side, and check it.</strong>',
         ['Ask: 6 × ? = 54.', 'Fill in the two boxes: the missing side, then the check.', 'Write your proof: what Bernardo did wrong, the right way, and how your check shows it.'])
     + model('prove')
     + nudge('whiteboard', 'Grid Whiteboard', 'A picture can prove it. Draw rows of 6 squares on the Grid Whiteboard until you have 54.')
     + jbox('prove', '✏️ My proof', 'Show What You Know — Prove it: Bernardo\'s panel'), cls='bl-violet', extra=' style="margin-top:16px;"')
 + win('wrap') + video('wrap')
 + ('<div class="cw-howto" id="mk-howto"><h4>📮 How to turn in your work</h4><ol>'
    '<li>Check the list at the bottom: all six jobs and every Show What You Know question.</li>'
    '<li>Press <b>Gather My Answers</b>, then <b>Copy All Answers</b>. (Or print it or save it as a PDF.)</li>'
    '<li>Open this lesson\'s assignment in Canvas.</li>'
    '<li>Paste your answers (or upload the PDF), then press <b>Submit</b>.</li></ol></div>')
 + GATHER
 + '<div class="activity bl-slate" id="mk-next" style="margin-top:18px;border-left-color:#0E8A8C;"><div class="activity-head"><div class="activity-num" style="background:#0E8A8C;color:#fff;">🗺️</div><div><div class="activity-title">What\'s Next</div><div class="activity-sub">Coming up in Unit 11</div></div></div>'
   '<div class="activity-body"><p>Next lesson, <strong>Area of Composite Figures</strong>: some shapes are made of more than one rectangle, like a gold border around the Duke\'s mirror. You will split them into rectangles, or take one rectangle away from another.</p></div></div>'
 + TURNIN + '</div></div>')
panel('assignment', SW)
answer_boxes_save()
