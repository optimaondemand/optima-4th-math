# Lesson 4.11.03 · Area of Composite Figures · the classical-guide layer (Leonardo da Vinci's workshop, Milan 1495)
# Dimensions 4B Chapter 11 Lesson 3 (borders and paths: M1 the whole rectangle − the inner one, M2 split into rectangles and add;
# "see the rectangles") + the IP. The old page solved IP 2 word for word ("Theo's T-shaped patio"), used multiple choice, a
# bar-splitting leftover and vocabulary flip cards; the three tabs are rebuilt around the guide's Think → Learn → Do.
# One hands-on job per IP operation, new numbers (see notes.md). Run: python3 tools/sparkle/build_lesson.py 11-03
import re

def job(story, steps):
    return ('<div class="task-box"><div class="task-label">Your job</div><p>%s</p></div>' % story
            + '<div class="mk-todo"><b>What to do</b><ol>' + ''.join('<li>%s</li>' % x for x in steps) + '</ol></div>')

def act(id, color, icon, title, sub, body, cls='bl-slate', extra=''):
    return ('<div class="activity %s" id="%s"%s><div class="activity-head"><div class="activity-num" style="background:%s;">%s</div><div><div class="activity-title">%s</div>'
            '<div class="activity-sub">%s</div></div></div><div class="activity-body">%s</div></div>') % (cls, id, extra, color, icon, title, sub, body)

def jbox(id, prompt, data, ph=''):
    data = data.replace(' — ', ' · ')   # no em dash in the journal labels students see in their gathered answers (audit, 11 Nov 2026)
    return ('<div class="journal-label">%s <span class="saved-dot" id="dot-%s"></span></div>'
            '<textarea class="journal-box" data-label="%s" id="journal-%s" oninput="autoSave(this,\'dot-%s\')" placeholder="%s"></textarea>') % (prompt, id, data, id, id, ph)

RUST = '#9e4552'; SLATE = '#3A6B9A'

# ── header: clean top (the layer adds Standards, Read aloud and the windows switch)
for mk in ['<div class="quote-strip">', '<div class="standards-toggle-bar"', '<div class="info-strip">', '<div class="explorer-strip">', '<div class="need-strip">']:
    replace_block(mk, '')
m = re.search(r'<div class="intro-2col">', s); i = m.start(); j = block_end(s, i)
INTRO = ('<div class="intro-2col"><div class="intro-card theme-question"><div class="intro-card-head"><div class="intro-card-head-icon">❓</div><div><div class="intro-card-head-label">Essential Question</div>'
  '<div class="intro-card-head-title">How can you find the area of a shape that isn\'t a simple rectangle?</div></div></div>'
  '<div class="intro-card-body cw-eq-body">'
  '<svg class="cw-eq-pic" viewBox="0 0 330 112" role="img" aria-label="An L-shaped figure drawn on a grid, with a dashed line that could cut it into two rectangles. A question mark is beside it.">'
  '<path d="M4 8 H64 V52 H124 V104 H4 Z" fill="#FFF1BF" stroke="#0E1C42" stroke-width="3"/>'
  '<line x1="64" y1="52" x2="64" y2="104" stroke="#9E4552" stroke-width="2.5" stroke-dasharray="6 4"/>'
  '<text x="140" y="66" font-family="Nunito,sans-serif" font-weight="900" font-size="22" fill="#9E4552">?</text></svg>'
  '<p class="pq-eq-note" style="margin-top:6px;">This shape is not one rectangle. Can you find the <strong>rectangles</strong> hiding inside it?</p></div></div>'
  '<div class="intro-card theme-objectives"><div class="intro-card-head"><div class="intro-card-head-icon">🎯</div><div><div class="intro-card-head-label">Today\'s Objectives</div><div class="intro-card-head-title">You will…</div></div></div><div class="intro-card-body">'
  '<div class="obj-line"><span class="obj-icon">✂️</span><span><strong>Split a shape into rectangles</strong>, find each area, and add.</span></div>'
  '<div class="obj-line"><span class="obj-icon">➖</span><span><strong>Find the whole rectangle and take away</strong> the part that is missing.</span></div>'
  '<div class="obj-line"><span class="obj-icon">🖼️</span><span><strong>Find the area of a border:</strong> add it on both sides first, then take away the middle.</span></div></div></div></div>')
s = s[:i] + '<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>' + INTRO + '</details>' + s[j:]

# ── the fact warm-up: times facts and take-aways (no IP fact, no job answer)
FACTS = [('9 × 8', '72'), ('6 × 7', '42'), ('8 × 4', '32'), ('9 × 6', '54'), ('7 × 8', '56'),
         ('80 − 16', '64'), ('90 − 36', '54'), ('70 − 28', '42'), ('100 − 64', '36'), ('56 − 18', '38')]
i = s.index('<div class="fluency-box" data-timed="false">'); j = block_end(s, i); FL = s[i:j]
gi = FL.index('<div class="fluency-grid" id="fluencyGrid">'); gj = block_end(FL, gi)
FL = FL[:gi] + '<div class="fluency-grid" id="fluencyGrid">' + ''.join(
    '<div class="fluency-item"><span class="fluency-q">%s =</span><input autocomplete="off" class="fluency-input" data-answer="%s" inputmode="numeric" type="text" aria-label="%s"/></div>\n'
    % (q, a, q) for q, a in FACTS) + '</div>' + FL[gj:]
FL = FL.replace('<div class="fluency-head-icon">✍️</div>', '<div class="fluency-head-icon">✖️</div>')
FL = FL.replace('<div class="fluency-head-label">FLUENCY WARM-UP</div><div class="fluency-head-title">Mixed All-Operations Facts — Maintenance</div>', '<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">Times Facts and Take-Aways</div>')
FL = FL.replace('Warm up your fact fluency before today’s lesson. Work through these, then check your answers.', 'Today you will multiply to find areas, and sometimes take one area away from another. Type each answer, then check.')
FL = FL.replace('data-label="Fluency Warm-Up (Mixed All-Operations Facts — Maintenance)"', 'data-label="Fact Warm-Up (Times Facts and Take-Aways)"')
s = s.replace('var FLUENCY_TITLE = "Mixed All-Operations Facts — Maintenance";', 'var FLUENCY_TITLE = "Times Facts and Take-Aways";')
s = s.replace('onclick="switchTab(\'learn\')">📐 Learn ', 'onclick="switchTab(\'learn\')">📐 Lesson ')

def grab(marker):
    i = s.index(marker); return s[i:block_end(s, i)]
GATHER = grab('<div class="gathered-box">')
TURNIN = grab('<div class="turn-in-card">')
for a, b in [('<span>I completed both quick checks above.</span>', '<span>I finished all five workshop jobs.</span>'),
             ('<span>I showed my model or my steps for each problem.</span>', '<span>I answered every Show What You Know question and the Prove It. (The number bonds and the bonus are optional.)</span>'),
             ('<span>I checked that each answer makes sense.</span>', '<span>For each border, I added it on both sides before I multiplied.</span>')]:
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
    st = {'tiles': {'cols': 20, 'rows': 12, 'unit': 'in'}}.get(tool)
    tool = tool + ('&amp;st=1#s=' + base64.urlsafe_b64encode(json.dumps(st, separators=(',', ':')).encode()).decode().rstrip('=') if st else '&amp;st=1')
    return ('<div class="cw-nudge"><a class="cw-tool" href="manipulatives/tool.html?t=%s" target="_blank" rel="noopener" title="%s">'
            '<span aria-hidden="true">🧮</span> Try the <b>%s</b> ↗</a></div>' % (tool, text.replace('"', '&quot;'), name))

# ═════════ WARM-UP (Dimensions Think) ═════════
THINK = act('mk-think', '#F2B705;color:#0E1C42', '🤔', 'Think About It: The Duke\'s Mirror', 'Try it your way first',
  '<div class="callout callout-think"><span class="callout-icon">🪞</span><p>The Duke\'s mirror is <strong>8 in</strong> long and <strong>6 in</strong> wide. '
  'He wants a gold border around it, <strong>2 in</strong> wide on <strong>every</strong> side. Each gold sheet is a square, 1 inch on every side. '
  '<strong>How many gold sheets will the border need?</strong></p></div>'
  + jbox('notice', '👀 What do you notice about the mirror and the border? What do you wonder?', 'Warm-Up — I notice, I wonder', 'I notice… I wonder…')
  + tip('leo', 'Before you start, make a guess. Then find out any way you like: lay the border and count, or work it out.')
  + model('think'), cls='bl-yellow')
MENTAL = ('<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F2B705;color:#0E1C42;">🧠</div>'
  '<div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, three quick problems</div></div></div><div class="activity-body">'
  + tip('felix', 'Split the big number into tens and ones. Multiply each part, then add. It is like cutting a rectangle in two!') + model('mental') + '</div></div>')
panel('warmup', video('think') + FL + MENTAL + BOARD + win('mirror') + THINK
      + nextbtn('Next: on the Lesson tab, you watch two ways to find the area of a shape that is not one rectangle, and you take on the workshop jobs.', 'learn', 'Continue to 📐 Lesson →'))

# ═════════ LESSON ═════════
def bub(who, name, text):
    return '<div class="bubble %s"><div class="bubble-avatar">%s</div><div class="bubble-body"><div class="bubble-name">%s</div><div class="bubble-text">"%s"</div></div></div>' % (who, who[0].upper(), name, text)

WAYS = ('<div class="activity bl-violet" id="mk-ways"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div><div><div class="activity-title">The Math Crew: Four Ways</div>'
     '<div class="activity-sub">The Duke\'s mirror: 8 in by 6 in, a border 2 in wide</div></div></div><div class="activity-body">'
     '<p>Here is how the Math Crew found the gold for the border. Which way is most like yours?</p>'
     '<div class="bubble-row">' + bub('atlas', 'Atlas: count them', 'I laid the border and counted every sheet. 72.')
     + bub('felix', 'Felix: whole, then take away', 'The whole thing is 12 × 10 = 120. The mirror is 8 × 6 = 48. 120 − 48 = 72.') + '</div>'
     '<div class="bubble-row">' + bub('hazel', 'Hazel: four strips', 'Top and bottom: 12 × 2 = 24 each. The sides: 2 × 6 = 12 each. 24 + 24 + 12 + 12 = 72.')
     + bub('cora', 'Cora: both sides first', 'The border is on both ends. 2 + 8 + 2 = 12 and 2 + 6 + 2 = 10. Then I took the mirror away.') + '</div>'
     + jbox('compare', '✏️ Which Crew way is most like yours? Why?', 'Lesson — My way and the Crew\'s ways')
     + '</div></div>')

GUIDED = act('mk-guided', '#2DB87A', '🖼️', 'Your Turn', 'A frame around a drawing, step by step: lay it, find the outside, take away',
  '<p style="font-weight:700;">Leonardo\'s drawing is <strong>9 in</strong> long and <strong>4 in</strong> wide. It gets a gold frame <strong>1 in</strong> wide on every side. How many gold sheets does the frame need? Each step opens when you finish the one before it.</p>'
  + tip('cora', 'Watch the line along the top as you lay the frame. The frame is on both ends!')
  + model('guided'), cls='bl-green', extra=' style="margin-top:16px;"')
KEY = ('<div class="key-concept" id="mk-key" style="margin-top:16px;"><div class="key-concept-label">📐 Leonardo\'s Measuring Rules</div>'
  '<p>A shape made of rectangles put together is a <strong>composite figure</strong>. When a shape is not one rectangle, <strong>see the rectangles</strong> inside it. Then pick the way with easier steps.</p>'
  '<ol style="margin:6px 0 6px 20px;font-weight:700;"><li><b>Split and add:</b> cut the shape into rectangles. Find each area. Add them.</li><li><b>Whole, then take away:</b> find the whole rectangle. Take away the part that is missing, like a corner, a door, or a mirror.</li>'
  '<li><b>A border or a path:</b> it goes on both sides. Add it twice to find the outside size: 2 + 8 + 2. Then take away the middle.</li></ol>'
  '<p>If a side has no label, it is part of a longer side. Subtract to find it. Every area is in square units.</p>'
  + tip('leo', 'For a border, I find the whole first and take the middle away. Fewer steps!')
  + '</div>' + video('do'))

STUDY = ('<div class="activity bl-slate" id="mk-worked" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:%s;">🔍</div><div><div class="activity-title">Study It: The L-Shaped Rug</div>'
 '<div class="activity-sub">Already solved for you. Read it, then try the jobs.</div></div></div><div class="activity-body">'
 '<p style="margin:0 0 10px;font-weight:700;color:#3A4A6B;">👀 Nothing to type here. This rug is solved two ways. Both ways get the same answer. Read the one that makes more sense to you.</p>'
 '<div class="task-box"><div class="task-label">Problem</div><p>A rug is an L. It is a <strong>12 ft</strong> by <strong>8 ft</strong> rectangle with an <strong>8 ft</strong> by <strong>4 ft</strong> corner missing. What is its area?</p></div>'
 '<svg viewBox="0 0 300 200" class="mk-svg" role="img" aria-label="An L-shaped rug: 12 feet along the bottom, 8 feet up the left side, with an 8 foot by 4 foot corner missing at the top right."><path d="M20 20 H100 V100 H260 V180 H20 Z" fill="#FFF1BF" stroke="#0E1C42" stroke-width="3"/>'
 '<rect x="100" y="20" width="160" height="80" fill="#F6D9DD" stroke="#9E4552" stroke-width="2" stroke-dasharray="6 4"/>'
 '<text x="140" y="196" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#0E1C42">12 ft</text><text x="6" y="104" font-family="Nunito" font-weight="900" font-size="14" fill="#0E1C42" transform="rotate(-90 12 104)">8 ft</text>'
 '<text x="180" y="64" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="13" fill="#9E4552">missing: 8 ft by 4 ft</text>'
 '<line x1="20" y1="100" x2="100" y2="100" stroke="#3A6B9A" stroke-width="2" stroke-dasharray="5 4"/></svg>'
 '<div class="we-two"><div class="we-way"><h5>Way 1: whole, then take away</h5><ol><li>The whole rectangle: 12 × 8 = 96 square feet.</li><li>The missing corner: 8 × 4 = 32 square feet.</li><li>96 − 32 = <b>64 square feet</b>.</li></ol></div>'
 '<div class="we-way"><h5>Way 2: split and add</h5><ol><li>Cut along the blue line. The bottom part is 12 ft by 4 ft: 12 × 4 = 48.</li><li>The top part is 4 ft by 4 ft (12 − 8 = 4): 4 × 4 = 16.</li><li>48 + 16 = <b>64 square feet</b>.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Both ways: 64 square feet. ✓ Which way has easier steps for this rug?</p></div></div>') % SLATE

ELL = act('mk-ell', SLATE, '✂️', 'The L-Shaped Floor: Three Ways', 'Job 2 · Split it two ways, then take away',
  job('The paint room floor is an L. Leonardo wants to know its area before he buys tiles. <strong>What is the area of the floor? Find it three ways. Do you get the same area each time?</strong>',
      ['Click a dashed line to cut the L into two rectangles. Find each part\'s sides and area, then add.',
       'Press “Split it a different way” and cut along a different line. Add again.',
       'Then find the whole rectangle and take the missing corner away.'])
  + tip('hazel', 'One side has no label. It is part of a longer side. What do you take away to find it?') + model('ell'),
  cls='bl-slate', extra=' style="margin-top:16px;"')

PARTS = act('mk-parts', RUST, '➕', 'Add the Parts: a T and Three Boards', 'Job 3 · Find each part, then add',
  job('Leonardo is building a T-shaped table top, and Bernardo glued three boards in a row for a shelf. <strong>What is the area of each one?</strong>',
      ['Round 1: cut the T into two rectangles. Find each part\'s area and add.',
       'Round 2: the three boards are already cut. Find each board\'s area.',
       'Add all three areas.'])
  + tip('atlas', 'Look at the two parts of the T after you cut it. What do you notice about their areas?') + model('parts')
  + nudge('tiles', 'Color Tiles', 'Try building the T with Color Tiles. Make each part a different color.'),
  cls='bl-violet', extra=' style="margin-top:16px;"')

WALL = act('mk-wall', SLATE, '🚪', 'The Workshop Wall', 'Job 4 · The whole, minus the cut-outs',
  job('The workshop wall gets fresh paint. The paint does not go on the door or the window. <strong>How many square feet of wall need paint?</strong>',
      ['Find the area of the whole wall.',
       'Press “Lift out”. Find the door\'s area and the window\'s area.',
       'Take both away from the whole wall.'])
  + tip('cora', 'Two cut-outs this time. Take away both of them!') + model('wall'),
  cls='bl-slate', extra=' style="margin-top:16px;"')

FIX = act('mk-fix', RUST, '📝', 'Bernardo\'s Frame: 36 Sheets?', 'Job 5 · Find and fix the mistake',
  job('Bernardo\'s note says the frame around the <strong>9 in</strong> by <strong>7 in</strong> painting, <strong>2 in</strong> wide, needs <strong>36</strong> sheets. He wrote: outside 9 + 2 = 11 and 7 + 2 = 9, then 11 × 9 = 99 and 99 − 63 = 36. <strong>What did he do wrong? How many sheets does the frame really need?</strong>',
      ['Lay the frame on all four sides.',
       'Find the real outside length and width, then the frame\'s sheets.',
       'Write what Bernardo did wrong and how to fix it.'])
  + tip('felix', 'His times table is fine. Look at the left side and the right side of the frame.') + model('fix')
  + jbox('fix', '✏️ What was Bernardo\'s mistake? How do you fix it?', 'Lesson — Bernardo\'s mistake'), cls='bl-violet', extra=' style="margin-top:16px;"')

BIG = 'To find the area of a shape that is not one rectangle, see the rectangles inside it. Split it into rectangles and add their areas, or find the whole rectangle and take away the part that is missing. For a border, add it on BOTH sides first, then take away the middle.'
PIC = ('<svg viewBox="0 0 600 250" class="mk-svg" role="img" aria-label="Two pictures. Left: an L split by a dashed line into parts A and B, A + B. Right: the same L as a whole rectangle with the missing corner tinted, whole minus corner.">'
 '<rect width="600" height="250" rx="12" fill="#FFF8EF"/>'
 '<path d="M40 40 H120 V110 H240 V200 H40 Z" fill="#FFE39A" stroke="#0E1C42" stroke-width="3"/><rect x="40" y="110" width="200" height="90" fill="#BFDDF6" stroke="#0E1C42" stroke-width="3"/>'
 '<line x1="40" y1="110" x2="120" y2="110" stroke="#9E4552" stroke-width="3" stroke-dasharray="7 5"/>'
 '<text x="80" y="82" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="20" fill="#9A7400">A</text><text x="140" y="162" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="20" fill="#2C5B88">B</text>'
 '<text x="140" y="232" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="18" fill="#0E1C42">Split: A + B</text>'
 '<rect x="340" y="40" width="200" height="160" fill="#FFF1BF" stroke="#0E1C42" stroke-width="3"/><rect x="420" y="40" width="120" height="70" fill="#F6D9DD" stroke="#9E4552" stroke-width="2.5" stroke-dasharray="6 4"/>'
 '<text x="480" y="80" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#9E4552">missing</text>'
 '<text x="440" y="232" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="18" fill="#0E1C42">Whole − missing part</text></svg>')
ONEPIC = ('<div class="key-concept pq-onepic" id="mk-onepic" style="margin-top:16px;"><div class="key-concept-label">🖼️ The Whole Lesson in One Picture</div>'
 '<p class="op-big"><strong>' + BIG + '</strong></p>' + PIC
 + jbox('big', '✏️ Put the big idea in your own words. Use an example of your own.', 'Lesson — The big idea in my own words') + '</div>')

def station(n, title, sub, inner):
    return '<div class="cw-station" data-st="%d" data-title="%s" data-sub="%s">%s</div>' % (n, title, sub, inner)
panel('learn', station(1, 'Learn it', 'Watch, compare the Crew\'s ways, then your turn', video('learn') + WAYS + GUIDED + KEY)
      + station(2, 'Practice together', 'Study a solved one, the L-shaped floor, add the parts', STUDY + ELL + PARTS)
      + station(3, 'On your own', 'The wall, Bernardo\'s frame, the big idea', WALL + win('note') + FIX + ONEPIC)
      + nextbtn('Five workshop jobs. Now show what you know.', 'assignment', 'Continue to 🌟 Show What You Know →'))

# ═════════ SHOW WHAT YOU KNOW ═════════
SW = ('<div class="activity bl-navy"><div class="activity-head"><div class="activity-num" style="background:#0E1C42;">📬</div><div><div class="activity-title">Show What You Know</div><div class="activity-sub">Type each answer in its own box.</div></div></div><div class="activity-body">'
 + tip('leo', 'Before each problem, ask: where are the rectangles? Then split and add, or find the whole and take away.')
 + problem(1, 'Take away the corner.', part('Problem 1 (a)', 'An L is an 11 cm by 8 cm rectangle with a 6 cm by 5 cm corner missing. (a) The whole rectangle = ' + box('1a', 'Problem 1 a, square centimeters', 'sq cm'))
        + part('Problem 1 (b)', '(b) The missing corner = ' + box('1b', 'Problem 1 b, square centimeters', 'sq cm'))
        + part('Problem 1 (c)', '(c) The area of the L = ' + box('1c', 'Problem 1 c, square centimeters', 'sq cm')))
 + problem(2, 'Add the parts.', part('Problem 2 (a)', 'A garden is made of two rectangles: one is 9 m by 3 m, and one is 4 m by 6 m. (a) The first rectangle = ' + box('2a', 'Problem 2 a, square meters', 'sq m'))
        + part('Problem 2 (b)', '(b) The second rectangle = ' + box('2b', 'Problem 2 b, square meters', 'sq m'))
        + part('Problem 2 (c)', '(c) The whole garden = ' + box('2c', 'Problem 2 c, square meters', 'sq m')))
 + nudge('whiteboard', 'Grid Whiteboard', 'Stuck? Draw the pool and the path on the Grid Whiteboard. Add the path on every side.')
 + problem(3, 'A path around a pool.', part('Problem 3 (a)', 'A pool is 7 m long and 4 m wide. A path 1 m wide goes all the way around it. (a) The outside length = ' + box('3a', 'Problem 3 a, meters', 'm'))
        + part('Problem 3 (b)', '(b) The outside width = ' + box('3b', 'Problem 3 b, meters', 'm'))
        + part('Problem 3 (c)', '(c) The area of the path = ' + box('3c', 'Problem 3 c, square meters', 'sq m')))
 + model('bonus')
 + act('mk-prove', RUST, '🧾', 'Prove It: Is Bernardo Right?', 'Answer the Essential Question',
     job('An L is an <strong>11 in</strong> by <strong>9 in</strong> rectangle with a <strong>6 in</strong> by <strong>6 in</strong> corner missing. Bernardo says, "You can\'t find the area of an L. It isn\'t a rectangle. You have to count every square." <strong>Prove him wrong. Find the area two ways.</strong>',
         ['Way 1: find the whole rectangle and take the corner away.', 'Way 2: split the L into two rectangles and add.', 'Write your proof: both ways, and what it shows.'])
     + model('prove')
     + nudge('whiteboard', 'Grid Whiteboard', 'A picture can prove it. Draw the L on the Grid Whiteboard and draw the line where you split it.')
     + jbox('prove', '✏️ My proof', 'Show What You Know — Prove it: the L'), cls='bl-violet', extra=' style="margin-top:16px;"')
 + win('wrap') + video('wrap')
 + ('<div class="cw-howto" id="mk-howto"><h4>📮 How to turn in your work</h4><ol>'
    '<li>Check the list at the bottom: all five jobs, every Show What You Know question and the Prove It.</li>'
    '<li>Press <b>Gather My Answers</b>, then <b>Copy All Answers</b>. (Or print it or save it as a PDF.)</li>'
    '<li>Open this lesson\'s assignment in Canvas.</li>'
    '<li>Paste your answers (or upload the PDF), then press <b>Submit</b>.</li></ol></div>')
 + GATHER
 + '<div class="activity bl-slate" id="mk-next" style="margin-top:18px;border-left-color:#0E8A8C;"><div class="activity-head"><div class="activity-num" style="background:#0E8A8C;color:#fff;">🗺️</div><div><div class="activity-title">What\'s Next</div><div class="activity-sub">Coming up in Unit 11</div></div></div>'
   '<div class="activity-body"><p>Next lesson, <strong>Perimeter, Part 1</strong>: the Duke wants a fence around his new garden. A fence doesn\'t cover the garden. It goes around the edge. You will measure the distance around a rectangle.</p></div></div>'
 + TURNIN + '</div></div>')
panel('assignment', SW)
answer_boxes_save()

# audit, 11 Nov 2026: no em dash in the gathered journal's first line; footer year
s = re.sub(r"(let out='Lesson 4\.\d\d\.\d\d) — ([^']*?)(\\n\\n')", lambda m: m.group(1) + ' · ' + m.group(2).replace(' — ', ', ') + m.group(3), s)
s = s.replace('© 2025 Optima Academy Online', '© 2026 Optima Academy Online')
