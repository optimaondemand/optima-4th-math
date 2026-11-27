# Lesson 4.11.04 · Perimeter Part 1 · the classical-guide layer (Leonardo da Vinci, Milan 1495)
# Dimensions 4B Chapter 11 Lesson 4 (perimeter of rectangles, and a missing side from the perimeter: M1 take both given
# lengths away and halve what is left, M2 half the perimeter = length + width) + the IP.
# The old page was an answer key for the IP: IP 1(a)(b)(c) were the whole Warm-Up, IP 3(a) was the Think AND the Picture It,
# IP 2(a) was Show What You Know 1, and IP 5(a)(b) was the "Worked Example" word for word (Theo's square dog pen, 136 cm).
# Every one of those spots is rebuilt with new numbers (see notes.md). Run: python3 tools/sparkle/build_lesson.py 11-04
import re

def job(story, steps):
    return ('<div class="task-box"><div class="task-label">Your job</div><p>%s</p></div>' % story
            + '<div class="mk-todo"><b>What to do</b><ol>' + ''.join('<li>%s</li>' % x for x in steps) + '</ol></div>')

def act(id, color, icon, title, sub, body, cls='bl-slate', extra=''):
    return ('<div class="activity %s" id="%s"%s><div class="activity-head"><div class="activity-num" style="background:%s;">%s</div><div><div class="activity-title">%s</div>'
            '<div class="activity-sub">%s</div></div></div><div class="activity-body">%s</div></div>') % (cls, id, extra, color, icon, title, sub, body)

def jbox(id, prompt, data, ph=''):
    data = data.replace(' — ', ' · ')   # no em dash in the journal labels students see in their gathered answers
    return ('<div class="journal-label">%s <span class="saved-dot" id="dot-%s"></span></div>'
            '<textarea class="journal-box" data-label="%s" id="journal-%s" oninput="autoSave(this,\'dot-%s\')" placeholder="%s"></textarea>') % (prompt, id, data, id, id, ph)

RUST = '#9e4552'; SLATE = '#3A6B9A'; GREEN = '#2DB87A'

# ── header: clean top (the layer adds Standards, Read aloud and the windows switch)
for mk in ['<div class="quote-strip">', '<div class="standards-toggle-bar"', '<div class="info-strip">', '<div class="explorer-strip">', '<div class="need-strip">']:
    replace_block(mk, '')
m = re.search(r'<div class="intro-2col">', s); i = m.start(); j = block_end(s, i)
# the EQ card: a plain labelled rectangle with an arrow walking the edge. No story names (students haven't met anyone yet).
INTRO = ('<div class="intro-2col"><div class="intro-card theme-question"><div class="intro-card-head"><div class="intro-card-head-icon">❓</div><div><div class="intro-card-head-label">Essential Question</div>'
  '<div class="intro-card-head-title">How far is it all the way around a shape?</div></div></div>'
  '<div class="intro-card-body cw-eq-body">'
  '<svg class="cw-eq-pic" viewBox="0 0 330 118" role="img" aria-label="A rectangle 9 feet long and 4 feet wide. Each side has its length written on it, and an arrow walks all the way around the edge.">'
  '<rect x="60" y="22" width="150" height="68" fill="#EAF6EC" stroke="#0E1C42" stroke-width="3"/>'
  '<path d="M60 14 H210" stroke="#A2703F" stroke-width="3" fill="none" marker-end="url(#eqa)"/>'
  '<defs><marker id="eqa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#A2703F"/></marker></defs>'
  '<text x="135" y="44" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="15" fill="#0E1C42">9 ft</text>'
  '<text x="135" y="82" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="15" fill="#0E1C42">9 ft</text>'
  '<text x="76" y="62" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="15" fill="#0E1C42">4 ft</text>'
  '<text x="194" y="62" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="15" fill="#0E1C42">4 ft</text>'
  '<text x="238" y="60" font-family="Nunito,sans-serif" font-weight="900" font-size="20" fill="#9E4552">?</text></svg>'
  '<p class="pq-eq-note" style="margin-top:6px;">Walk every side once and add how far you went. That distance is the <strong>perimeter</strong>.</p></div></div>'
  '<div class="intro-card theme-objectives"><div class="intro-card-head"><div class="intro-card-head-icon">🎯</div><div><div class="intro-card-head-label">Today\'s Objectives</div><div class="intro-card-head-title">You will…</div></div></div><div class="intro-card-body">'
  '<div class="obj-line"><span class="obj-icon">🚧</span><span><strong>Find the perimeter</strong> of a rectangle or a square by adding every side once.</span></div>'
  '<div class="obj-line"><span class="obj-icon">✌️</span><span><strong>Use the quicker way:</strong> add the length and the width, then double it.</span></div>'
  '<div class="obj-line"><span class="obj-icon">🔙</span><span><strong>Work backward:</strong> find a missing side when you know the perimeter and one side.</span></div></div></div></div>')
s = s[:i] + '<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>' + INTRO + '</details>' + s[j:]

# ── the fact warm-up: the sixes (so the 2-minute fact check has a family), plus the doubles and halves perimeter leans on.
# No fact the IP needs (12 × 7, 4 × 7, 4 × 8, 84 ÷ 12, 136 ÷ 4) and no job answer.
FACTS = [('6 × 7', '42'), ('6 × 9', '54'), ('6 × 4', '24'), ('6 × 8', '48'), ('6 × 6', '36'),
         ('Double 15', '30'), ('Double 24', '48'), ('Half of 46', '23'), ('Half of 90', '45'), ('Double 35', '70')]
i = s.index('<div class="fluency-box" data-timed="false">'); j = block_end(s, i); FL = s[i:j]
gi = FL.index('<div class="fluency-grid" id="fluencyGrid">'); gj = block_end(FL, gi)
FL = FL[:gi] + '<div class="fluency-grid" id="fluencyGrid">' + ''.join(
    '<div class="fluency-item"><span class="fluency-q">%s =</span><input autocomplete="off" class="fluency-input" data-answer="%s" inputmode="numeric" type="text" aria-label="%s"/></div>\n'
    % (q, a, q) for q, a in FACTS) + '</div>' + FL[gj:]
FL = FL.replace('<div class="fluency-head-icon">✍️</div>', '<div class="fluency-head-icon">✖️</div>')
FL = FL.replace('<div class="fluency-head-label">FLUENCY WARM-UP</div><div class="fluency-head-title">Mixed Multiplication Facts — Maintenance</div>',
                '<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">The Sixes, Doubles and Halves</div>')
FL = FL.replace('Warm up your fact fluency before today’s lesson. Work through these, then check your answers.',
                'Today you will double a lot and halve a lot. Type each answer, then check.')
FL = FL.replace('data-label="Fluency Warm-Up (Mixed Multiplication Facts — Maintenance)"', 'data-label="Fact Warm-Up (The Sixes, Doubles and Halves)"')
s = s.replace('var FLUENCY_TITLE = "Mixed Multiplication Facts — Maintenance";', 'var FLUENCY_TITLE = "The Sixes, Doubles and Halves";')
s = s.replace('onclick="switchTab(\'learn\')">📐 Learn ', 'onclick="switchTab(\'learn\')">📐 Lesson ')

def grab(marker):
    i = s.index(marker); return s[i:block_end(s, i)]
GATHER = grab('<div class="gathered-box">')
TURNIN = grab('<div class="turn-in-card">')
for a, b in [('<span>I completed both quick checks above.</span>', '<span>I finished all five garden jobs.</span>'),
             ('<span>I showed my model or my steps for each problem.</span>', '<span>I answered every Show What You Know question and the Prove It. (The number bonds and the bonus are optional.)</span>'),
             ('<span>I checked that each answer makes sense.</span>', '<span>Every perimeter answer is in plain units (ft, m, cm), not square units.</span>')]:
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
    import base64, json   # the tool opens ready for this lesson
    st = {'tiles': {'cols': 14, 'rows': 10, 'unit': 'ft'}}.get(tool)
    tool = tool + ('&amp;st=1#s=' + base64.urlsafe_b64encode(json.dumps(st, separators=(',', ':')).encode()).decode().rstrip('=') if st else '&amp;st=1')
    return ('<div class="cw-nudge"><a class="cw-tool" href="manipulatives/tool.html?t=%s" target="_blank" rel="noopener" title="%s">'
            '<span aria-hidden="true">🧮</span> Try the <b>%s</b> ↗</a></div>' % (tool, text.replace('"', '&quot;'), name))

# ═════════ WARM-UP (Dimensions Think) ═════════
# The guide's Think: fence a garden with a set length of fencing, one side given. 30 ft, long side 11 ft → 4 ft.
THINK = act('mk-think', '#F2B705;color:#0E1C42', '🤔', 'Think About It: The Duke\'s Garden', 'Try it your way first',
  '<div class="callout callout-think"><span class="callout-icon">🌿</span><p>The Duke sent <strong>30 feet</strong> of fencing for his new garden. '
  'The garden is a rectangle, and the long side along the wall is <strong>11 feet</strong>. The fence has to go all the way around, '
  'and every foot of it must be used. <strong>How long is the short side?</strong></p></div>'
  + jbox('notice', '👀 What do you notice about the fencing and the garden? What do you wonder?', 'Warm-Up — I notice, I wonder', 'I notice… I wonder…')
  + tip('leo', 'Make a guess before you start. Then find out any way you like: lay the rails one at a time, or work it out on paper.')
  + model('think'), cls='bl-yellow')
MENTAL = ('<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F2B705;color:#0E1C42;">🧠</div>'
  '<div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, three quick problems</div></div></div><div class="activity-body">'
  + tip('felix', 'To double a 2-digit number, split it into tens and ones. Double each part, then put them back together.') + model('mental') + '</div></div>')
panel('warmup', FL + MENTAL + BOARD + win('garden') + THINK
      + nextbtn('Next: on the Lesson tab, you watch two ways to find the distance around a rectangle, and you take on the garden jobs.', 'learn', 'Continue to 📐 Lesson →'))

# ═════════ LESSON ═════════
def bub(who, name, text):
    return '<div class="bubble %s"><div class="bubble-avatar">%s</div><div class="bubble-body"><div class="bubble-name">%s</div><div class="bubble-text">"%s"</div></div></div>' % (who, who[0].upper(), name, text)

WAYS = ('<div class="activity bl-violet" id="mk-ways"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div><div><div class="activity-title">The Math Crew: Four Ways</div>'
     '<div class="activity-sub">The Duke\'s garden: 30 feet of fencing, long side 11 feet</div></div></div><div class="activity-body">'
     '<p>Here is how the Math Crew found the short side. Which way is most like yours?</p>'
     '<div class="bubble-row">' + bub('atlas', 'Atlas: take the long sides away', 'Two long sides use 11 + 11 = 22 feet. 30 − 22 = 8 feet left. The two short sides share it: 8 ÷ 2 = 4.')
     + bub('felix', 'Felix: halve first', 'Half of 30 is 15. Half a fence is one long side and one short side. 15 − 11 = 4.') + '</div>'
     '<div class="bubble-row">' + bub('hazel', 'Hazel: lay the rails', 'I laid 11 rails on the top and 11 on the bottom. Eight rails were left, so four went on each side.')
     + bub('cora', 'Cora: check the units', 'The answer is 4 feet, not 4 square feet. Fence is a length. You measure it in plain feet.') + '</div>'
     + jbox('compare', '✏️ Which Crew way is most like yours? Why?', 'Lesson — My way and the Crew\'s ways')
     + '</div></div>')

GUIDED = act('mk-guided', GREEN, '🌱', 'Your Turn', 'The herb bed: 24 feet of fencing, long side 7 feet',
  '<p style="font-weight:700;">Now the kitchen herb bed. There is <strong>24 feet</strong> of fencing and the long side is <strong>7 feet</strong>. '
  'Every rail must be used. <strong>How long is the short side?</strong> Each step opens when you finish the one before it.</p>'
  + tip('cora', 'Watch the coil as you lay the rails. When it is empty, the garden has to close.')
  + model('guided'), cls='bl-green', extra=' style="margin-top:16px;"')

# the two methods in the guide's words, plus the IP's short way shown ONCE so the practice page isn't a surprise
KEY = ('<div class="key-concept" id="mk-key" style="margin-top:16px;"><div class="key-concept-label">📐 Leonardo\'s Measuring Rules</div>'
  '<p>The <strong>perimeter</strong> is the distance all the way around a shape. Walk every side once and add how far you went.</p>'
  '<ol style="margin:6px 0 6px 20px;font-weight:700;"><li><b>Add every side:</b> length + width + length + width.</li>'
  '<li><b>The quicker way:</b> add the length and the width, then <b>double it</b>. Opposite sides of a rectangle match, so you only need one of each.</li>'
  '<li><b>A square:</b> all four sides are the same, so double the side, then double it again.</li>'
  '<li><b>Working backward:</b> take both long sides away from the perimeter, then halve what is left. Or halve the perimeter first and take the long side away.</li></ol>'
  '<p>Perimeter is a <strong>length</strong>, so the answer is in plain units: feet, meters, centimeters. Never square units.</p>'
  '<div class="cw-aside"><b>Written short.</b> On your practice page the quicker way is written <b>P = 2 × (L + W)</b>, and working backward is written <b>(P − 2L) ÷ 2</b>. '
  'They say exactly what you just did: <em>add the length and the width, then double</em>, and <em>take the two long sides away, then halve</em>.</div>'
  + tip('leo', 'I use the quicker way for a long fence. Two numbers to add instead of four.')
  + '</div>')

STUDY = ('<div class="activity bl-slate" id="mk-worked" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:%s;">🔍</div><div><div class="activity-title">Study It: The Rose Bed</div>'
 '<div class="activity-sub">Already solved for you. Read it, then try the jobs.</div></div></div><div class="activity-body">'
 '<p style="margin:0 0 10px;font-weight:700;color:#3A4A6B;">👀 Nothing to type here. This rose bed is solved two ways. Both ways get the same answer. Read the one that makes more sense to you.</p>'
 '<div class="task-box"><div class="task-label">Problem</div><p>The rose bed is <strong>12 m</strong> long and <strong>9 m</strong> wide. How much fence goes around it?</p></div>'
 '<svg viewBox="0 0 320 170" class="mk-svg" role="img" aria-label="A rose bed drawn as a rectangle, 12 meters along the top and bottom and 9 meters up each side."><rect x="46" y="34" width="190" height="92" fill="#EAF6EC" stroke="#0E1C42" stroke-width="3"/>'
 '<text x="141" y="26" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#0E1C42">12 m</text>'
 '<text x="141" y="144" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#0E1C42">12 m</text>'
 '<text x="26" y="85" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#0E1C42">9 m</text>'
 '<text x="258" y="85" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#0E1C42">9 m</text></svg>'
 '<div class="we-two"><div class="we-way"><h5>Way 1: add every side</h5><ol><li>Walk the top: 12 m.</li><li>Down the side: 9 m. Along the bottom: 12 m. Up the last side: 9 m.</li>'
 '<li>12 + 9 + 12 + 9 = <b>42 meters</b>.</li></ol></div>'
 '<div class="we-way"><h5>Way 2: add one of each, then double</h5><ol><li>One long side and one short side: 12 + 9 = 21 m.</li><li>That is half the fence.</li>'
 '<li>Double it: 21 + 21 = <b>42 meters</b>.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Both ways: 42 meters. ✓ Which way has fewer steps?</p></div></div>') % SLATE

WALK = act('mk-walk', SLATE, '🚧', 'Fence Three Beds', 'Job 2 · Add every side, then try the quicker way',
  job('Three beds in the castle garden need fencing: a long vegetable bed, a square mint bed, and a wide flower bed. <strong>How much fence does each one need?</strong>',
      ['Round 1: the vegetable bed, 14 m by 6 m. Lay the rails all the way around, then add every side.',
       'Round 2: the mint bed is a square, 5 m on every side.',
       'Round 3: the flower bed, 18 ft by 7 ft. Try adding the length and the width and doubling it this time.'])
  + tip('atlas', 'In round 3, you only need two numbers: one long side and one short side. Then double.') + model('walk'),
  cls='bl-slate', extra=' style="margin-top:16px;"')

BACK = act('mk-back', RUST, '🔙', 'Working Backward', 'Job 3 · The perimeter is known, one side is missing',
  job('The Duke orders fencing by the foot, and the gardener writes down how much came and one side of each bed. <strong>How long is the missing side each time?</strong>',
      ['A bed with 30 cm of edging around it and one side 4 cm. Find the other side.',
       'A bed with 150 cm of edging and one side 48 cm.',
       'A square bed with 92 cm of edging. Find one side.'])
  + tip('hazel', 'Take the two sides you know away first. What is left belongs to the other two sides, and they share it evenly.')
  + model('back'), cls='bl-violet', extra=' style="margin-top:16px;"')

MIX = act('mk-mix', SLATE, '⚖️', 'Around It and Inside It', 'Job 4 · Perimeter and area in the same garden',
  job('Two beds. For the first one the gardener knows both sides. For the second he knows how much ground it covers and how long it is. '
      '<strong>Find what goes around each bed and what it holds inside.</strong>',
      ['Bed A is 17 ft long and 6 ft wide. Find the area, then the perimeter.',
       'Bed B covers 54 square centimeters and is 9 cm long. Find its width first.',
       'Then find Bed B\'s perimeter.'])
  + tip('cora', 'Watch your units. Area is in square units. Perimeter is in plain units.') + model('mix')
  + nudge('tiles', 'Color Tiles', 'Build Bed A with Color Tiles. Count the tiles for the area, then count the edge for the perimeter.'),
  cls='bl-slate', extra=' style="margin-top:16px;"')

FIX = act('mk-fix', RUST, '📝', 'Bernardo\'s Note: 24 Feet a Side?', 'Job 5 · Find and fix the mistake',
  job('Bernardo is building a <strong>square</strong> bed for the Duke\'s bay trees with <strong>48 feet</strong> of fencing. '
      'His note says each side is <strong>24 feet</strong>. He wrote: 48 ÷ 2 = 24. '
      '<strong>What did he do wrong? How long is each side really?</strong> Then help him compare it with a different plan.',
      ['Find Bernardo\'s mistake and the real side of the square bed.',
       'Find how much ground the square bed holds.',
       'The same 48 feet of fencing, but 16 feet long this time. Find its width and how much it holds. Which bed holds more?'])
  + tip('felix', 'How many sides does a square have? Count them on the picture.') + model('fix')
  + jbox('fix', '✏️ What was Bernardo\'s mistake? How do you fix it?', 'Lesson — Bernardo\'s mistake'), cls='bl-violet', extra=' style="margin-top:16px;"')

BIG = ('The perimeter is the distance all the way around a shape. Walk every side once and add how far you went. For a rectangle you can '
       'add the length and the width and double it, because opposite sides match. If you know the perimeter and one side, take the two sides '
       'you know away and halve what is left. Perimeter is a length, so the answer is in plain units, never square units.')
PIC = ('<svg viewBox="0 0 600 230" class="mk-svg" role="img" aria-label="Two pictures. Left: a rectangle 9 by 4 with every side labelled and an arrow walking around it, 9 plus 4 plus 9 plus 4. Right: the same rectangle with one long side and one short side highlighted, 9 plus 4 equals 13, doubled is 26.">'
 '<rect width="600" height="230" rx="12" fill="#F6FBF7"/>'
 '<rect x="50" y="56" width="180" height="80" fill="#EAF6EC" stroke="#0E1C42" stroke-width="3"/>'
 '<text x="140" y="48" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#0E1C42">9</text>'
 '<text x="140" y="154" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#0E1C42">9</text>'
 '<text x="34" y="102" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#0E1C42">4</text>'
 '<text x="246" y="102" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#0E1C42">4</text>'
 '<text x="140" y="196" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="17" fill="#0E1C42">Walk every side: 9 + 4 + 9 + 4</text>'
 '<rect x="360" y="56" width="180" height="80" fill="#EAF6EC" stroke="#0E1C42" stroke-width="3"/>'
 '<line x1="360" y1="56" x2="540" y2="56" stroke="#A2703F" stroke-width="7"/><line x1="540" y1="56" x2="540" y2="136" stroke="#A2703F" stroke-width="7"/>'
 '<text x="450" y="48" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#6E4A26">9</text>'
 '<text x="558" y="102" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#6E4A26">4</text>'
 '<text x="450" y="196" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="17" fill="#0E1C42">One of each, then double: 13 + 13</text></svg>')
ONEPIC = ('<div class="key-concept pq-onepic" id="mk-onepic" style="margin-top:16px;"><div class="key-concept-label">🖼️ The Whole Lesson in One Picture</div>'
 '<p class="op-big"><strong>' + BIG + '</strong></p>' + PIC
 + jbox('big', '✏️ Put the big idea in your own words. Use an example of your own.', 'Lesson — The big idea in my own words') + '</div>')

def station(n, title, sub, inner):
    return '<div class="cw-station" data-st="%d" data-title="%s" data-sub="%s">%s</div>' % (n, title, sub, inner)
panel('learn', station(1, 'Learn it', 'Watch, compare the Crew\'s ways, then your turn', video('learn') + WAYS + GUIDED + KEY)
      + station(2, 'Practice together', 'Study a solved one, fence three beds, work backward', STUDY + WALK + BACK)
      + station(3, 'On your own', 'Around it and inside it, Bernardo\'s note, the big idea', MIX + win('note') + FIX + ONEPIC)
      + nextbtn('Five garden jobs. Now show what you know.', 'assignment', 'Continue to 🌟 Show What You Know →'))

# ═════════ SHOW WHAT YOU KNOW ═════════
SW = ('<div class="activity bl-navy"><div class="activity-head"><div class="activity-num" style="background:#0E1C42;">📬</div><div><div class="activity-title">Show What You Know</div><div class="activity-sub">Type each answer in its own box.</div></div></div><div class="activity-body">'
 + tip('leo', 'Before each problem, ask yourself: am I walking around the edge, or covering the inside?')
 + problem(1, 'Two ways around.', part('Problem 1 (a)', 'A rectangle is 18 cm long and 7 cm wide. (a) Add every side: 18 + 7 + 18 + 7 = ' + box('1a', 'Problem 1 a, centimeters', 'cm'))
        + part('Problem 1 (b)', '(b) Now the quicker way. One long side and one short side: 18 + 7 = ' + box('1b', 'Problem 1 b, centimeters', 'cm'))
        + part('Problem 1 (c)', '(c) Double it: ' + box('1c', 'Problem 1 c, centimeters', 'cm')))
 + problem(2, 'Work backward.', part('Problem 2 (a)', 'A rectangle has 56 cm of ribbon around the edge. One side is 20 cm. (a) The two sides you know use ' + box('2a', 'Problem 2 a, centimeters', 'cm'))
        + part('Problem 2 (b)', '(b) So the other side is ' + box('2b', 'Problem 2 b, centimeters', 'cm')))
 + nudge('whiteboard', 'Grid Whiteboard', 'Stuck? Draw the shape on the Grid Whiteboard and write a length on every side.')
 + problem(3, 'A square garden.', part('Problem 3 (a)', 'A square garden has 72 m of fence around it. (a) One side is ' + box('3a', 'Problem 3 a, meters', 'm'))
        + part('Problem 3 (b)', '(b) How much ground does it hold? ' + box('3b', 'Problem 3 b, square meters', 'sq m')))
 + model('bonus')
 + act('mk-prove', RUST, '🧾', 'Prove It: Same Fence, Same Garden?', 'Answer the Essential Question',
     job('Bernardo says, "If two gardens use the same amount of fence, they must hold the same amount of ground." '
         'Leonardo hands him <strong>20 feet</strong> of fencing and asks him to try it twice: once as a garden <strong>8 ft</strong> long, '
         'once as a garden <strong>6 ft</strong> long. <strong>Prove Bernardo wrong.</strong>',
         ['Find the short side and the ground held for the 8-foot garden.',
          'Do the same for the 6-foot garden.',
          'Write your proof: both gardens, both answers, and what it shows.'])
     + model('prove')
     + nudge('whiteboard', 'Grid Whiteboard', 'A picture can prove it. Draw both gardens on the Grid Whiteboard, side by side.')
     + jbox('prove', '✏️ My proof', 'Show What You Know — Prove it: the same fence'), cls='bl-violet', extra=' style="margin-top:16px;"')
 + win('wrap')
 + ('<div class="cw-howto" id="mk-howto"><h4>📮 How to turn in your work</h4><ol>'
    '<li>Check the list at the bottom: all five jobs, every Show What You Know question and the Prove It.</li>'
    '<li>Press <b>Gather My Answers</b>, then <b>Copy All Answers</b>. (Or print it or save it as a PDF.)</li>'
    '<li>Open this lesson\'s assignment in Canvas.</li>'
    '<li>Paste your answers (or upload the PDF), then press <b>Submit</b>.</li></ol></div>')
 + GATHER
 + '<div class="activity bl-slate" id="mk-next" style="margin-top:18px;border-left-color:#0E8A8C;"><div class="activity-head"><div class="activity-num" style="background:#0E8A8C;color:#fff;">🗺️</div><div><div class="activity-title">What\'s Next</div><div class="activity-sub">Coming up in Unit 11</div></div></div>'
   '<div class="activity-body"><p>Next lesson, <strong>Perimeter, Part 2</strong>: the Duke wants a pen for his hunting hounds, and it is not a plain rectangle. '
   'It bends around a corner. You will find the distance around shapes with a notch in them, where some sides have no number on them at all.</p></div></div>'
 + TURNIN + '</div></div>')
panel('assignment', SW)
answer_boxes_save()

# no em dash in the gathered journal's first line; footer year
s = re.sub(r"(let out='Lesson 4\.\d\d\.\d\d) — ([^']*?)(\\n\\n')", lambda m: m.group(1) + ' · ' + m.group(2).replace(' — ', ', ') + m.group(3), s)
s = s.replace('© 2025 Optima Academy Online', '© 2026 Optima Academy Online')
