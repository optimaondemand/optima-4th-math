# Lesson 4.11.01 · Area of Rectangles, Part 1 · the classical-guide layer (Leonardo da Vinci's workshop, Milan 1495)
# Dimensions 4B Chapter 11 Lesson 1 (find area by converting the side lengths to the same unit first; two ways) + the IP.
# The old page re-taught Grade 3 (count unit squares); the three tabs are rebuilt around the guide's Think → Learn → Do.
# One hands-on job per IP section, new numbers (IP results avoided, see notes.md). Run: python3 tools/sparkle/build_lesson.py 11-01
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

GOLD = '#8a5a00;color:#fff'; RUST = '#9e4552'; NAVYC = '#1f2f55'; SLATE = '#3A6B9A'

# ── header: clean top (the layer adds Standards, Read aloud and the windows switch)
for mk in ['<div class="quote-strip">', '<div class="standards-toggle-bar"', '<div class="info-strip">', '<div class="explorer-strip">', '<div class="need-strip">']:
    replace_block(mk, '')
m = re.search(r'<div class="intro-2col">', s); i = m.start(); j = block_end(s, i)
INTRO = ('<div class="intro-2col"><div class="intro-card theme-question"><div class="intro-card-head"><div class="intro-card-head-icon">❓</div><div><div class="intro-card-head-label">Essential Question</div>'
  '<div class="intro-card-head-title">How can you find the area when the sides use different units?</div></div></div>'
  '<div class="intro-card-body cw-eq-body">'
  '<svg class="cw-eq-pic" viewBox="0 0 330 92" role="img" aria-label="A rectangle 1 foot 2 inches long and 4 inches wide.">'
  '<text x="125" y="16" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="16" fill="#0E1C42">1 ft 2 in</text>'
  '<line x1="0" y1="24" x2="250" y2="24" stroke="#0E1C42" stroke-width="2"/><rect x="0" y="34" width="250" height="52" rx="2" fill="#fff" stroke="#0E1C42" stroke-width="3"/>'
  '<text x="260" y="66" font-family="Nunito,sans-serif" font-weight="900" font-size="16" fill="#0E1C42">4 in</text></svg>'
  '<p class="pq-eq-note" style="margin-top:6px;">One side is in <strong>feet and inches</strong>. The other side is in <strong>inches</strong>. Today you will find out how to find the area.</p></div></div>'
  '<div class="intro-card theme-objectives"><div class="intro-card-head"><div class="intro-card-head-icon">🎯</div><div><div class="intro-card-head-label">Today\'s Objectives</div><div class="intro-card-head-title">You will…</div></div></div><div class="intro-card-body">'
  '<div class="obj-line"><span class="obj-icon">🟨</span><span><strong>Find area</strong> by covering a rectangle with square units, and by multiplying length × width.</span></div>'
  '<div class="obj-line"><span class="obj-icon">🔁</span><span><strong>Put both sides in the same unit first:</strong> change feet to inches, or yards to feet.</span></div>'
  '<div class="obj-line"><span class="obj-icon">▭</span><span><strong>Find rectangles and squares</strong> that cover the same area.</span></div></div></div></div>')
s = s[:i] + '<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>' + INTRO + '</details>' + s[j:]

# ── the fact warm-up: inches in feet, feet in yards, a few squares (no IP fact, no Think answer)
FACTS = [('12 × 4', '48'), ('12 × 6', '72'), ('12 × 7', '84'), ('12 × 10', '120'), ('3 × 5', '15'),
         ('3 × 8', '24'), ('3 × 9', '27'), ('7 × 7', '49'), ('4 × 4', '16'), ('10 × 10', '100')]
i = s.index('<div class="fluency-box" data-timed="false">'); j = block_end(s, i); FL = s[i:j]
gi = FL.index('<div class="fluency-grid" id="fluencyGrid">'); gj = block_end(FL, gi)
FL = FL[:gi] + '<div class="fluency-grid" id="fluencyGrid">' + ''.join(
    '<div class="fluency-item"><span class="fluency-q">%s =</span><input autocomplete="off" class="fluency-input" data-answer="%s" inputmode="numeric" type="text" aria-label="%s"/></div>\n' % (q, a, q)
    for q, a in FACTS) + '</div>' + FL[gj:]
FL = FL.replace('<div class="fluency-head-icon">✍️</div>', '<div class="fluency-head-icon">📏</div>')
FL = FL.replace('<div class="fluency-head-label">FLUENCY WARM-UP</div><div class="fluency-head-title">Mental Math — Efficient Strategies</div>', '<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">Twelves and Threes</div>')
FL = FL.replace('Warm up your fact fluency before today’s lesson. Work through these, then check your answers.', '1 foot is 12 inches and 1 yard is 3 feet, so the twelves and threes help today. Type each answer, then check.')
FL = FL.replace('data-label="Fluency Warm-Up (Mental Math — Efficient Strategies)"', 'data-label="Fact Warm-Up (Twelves and Threes)"')
s = s.replace('var FLUENCY_TITLE = "Mental Math — Efficient Strategies";', 'var FLUENCY_TITLE = "Twelves and Threes";')
# the middle tab holds three stations, so it is the Lesson tab (Bethany, 3 Nov 2026)
s = s.replace('onclick="switchTab(\'learn\')">📐 Learn ', 'onclick="switchTab(\'learn\')">📐 Lesson ')
s = s.replace('<em>Area of Rectangles — Part 1</em>', '<em>Area of Rectangles, Part 1</em>')   # no em dash in the student title (audit, 10 Nov 2026)

# keep the journal, What's Next and checklist blocks from the original Show What You Know
def grab(marker):
    i = s.index(marker); return s[i:block_end(s, i)]
GATHER = grab('<div class="gathered-box">')
TURNIN = grab('<div class="turn-in-card">')
for a, b in [('<span>I completed both quick checks above.</span>', '<span>I finished all six workshop jobs.</span>'),
             ('<span>I showed my model or my steps for each problem.</span>', '<span>I answered every Show What You Know question. (The number bonds and the bonus are optional.)</span>'),
             ('<span>I checked that each answer makes sense.</span>', '<span>I checked the units: same units first, square units in the answer.</span>')]:
    assert a in TURNIN; TURNIN = TURNIN.replace(a, b)

def panel(tab, inner):
    global s
    k = s.index('<div class="tab-panel%s" id="tab-%s">' % (' active' if tab == 'warmup' else '', tab)); e = block_end(s, k)
    if tab == 'assignment':   # the original never closes this panel (the footer and scripts sat inside it): stop at the footer
        e = s.index('<div class="footer">')
    head = s[k:s.index('>', k) + 1]
    s = s[:k] + head + inner + '</div>' + s[e:]

def nextbtn(text, tab, label):
    return '<div class="tab-next-wrap"><p class="tab-transition-voice">%s</p><button class="tab-next-btn" onclick="switchTab(\'%s\')">%s</button></div>' % (text, tab, label)

# ═════════ WARM-UP (Dimensions Think) ═════════
THINK = act('mk-think', '#F2B705;color:#0E1C42', '🤔', 'Think About It: Bernardo\'s Gold', 'Try it your way first',
  '<div class="callout callout-think"><span class="callout-icon">🟨</span><p>Each gold sheet is a square, <strong>1 inch</strong> on every side. '
  'The strip is <strong>1 ft 6 in</strong> long and <strong>2 in</strong> wide. The square panel is <strong>6 in</strong> on each side. '
  '<strong>How many gold sheets cover each panel?</strong></p></div>'
  + jbox('notice', '👀 What do you notice about the strip and the square panel? What do you wonder?', 'Warm-Up — I notice, I wonder', 'I notice… I wonder…')
  + tip('leo', 'Before you count, make a guess. Then find out any way you like: lay the gold sheets, or work it out on paper.')
  + model('think')
  + jbox('think', '✏️ How did you find the number of sheets? Tell your steps.', 'Warm-Up — Think: Bernardo\'s gold'),
  cls='bl-yellow')
MENTAL = ('<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F2B705;color:#0E1C42;">🧠</div>'
  '<div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, three quick problems</div></div></div><div class="activity-body">'
  + tip('felix', 'Tens are easy to multiply. Split the number, multiply each part, and add. Then check it!') + model('mental') + '</div></div>')
# order (Bethany, 3 Nov 2026): welcome video, fact warm-up, Mental Math, the job board, the window, then the Think problem
# right under it, so "Go to the panels" skips nothing
panel('warmup', video('think') + FL + MENTAL + BOARD + win('gold') + THINK
      + nextbtn('Next: on the Lesson tab, the Math Crew shows their ways, and you take on the workshop jobs.', 'learn', 'Continue to 📐 Lesson →'))

# ═════════ LEARN ═════════
def bub(who, name, text):
    return '<div class="bubble %s"><div class="bubble-avatar">%s</div><div class="bubble-body"><div class="bubble-name">%s</div><div class="bubble-text">"%s"</div></div></div>' % (who, who[0].upper(), name, text)

def ways_card():
    # kept short: one line of math per Crew member, no summary rule (Bethany, 3 Nov 2026: less to sift through)
    return ('<div class="activity bl-violet" id="mk-ways"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div><div><div class="activity-title">The Math Crew: Four Ways</div>'
     '<div class="activity-sub">The strip (1 ft 6 in by 2 in) and the square panel (6 in by 6 in)</div></div></div><div class="activity-body">'
     '<p>Here is how the Math Crew counted the gold. Which way would you pick?</p>'
     '<div class="bubble-row">' + bub('atlas', 'Atlas: same units first', '1 ft 6 in is 18 in. 18 × 2 = 36.')
     + bub('felix', 'Felix: split at the foot', '12 × 2 = 24 and 6 × 2 = 12. 24 + 12 = 36.') + '</div>'
     '<div class="bubble-row">' + bub('hazel', 'Hazel: picture the square', '6 rows of 6. 6 × 6 = 36. Same gold as the strip!')
     + bub('cora', 'Cora: check the units', 'Feet and inches? Make both inches first. Then multiply.') + '</div>'
     + jbox('compare', '✏️ Which Crew way is most like yours? Why?', 'Lesson — My way and the Crew\'s ways')
     + '</div></div>')

# the explicit teaching (Bethany, 3 Nov 2026): one guided build, concrete → picture → number sentence, each step opens after
# the student does the one before it. Then the rules, then the Do video.
GUIDED = act('mk-guided', '#2DB87A', '🧱', 'Your Turn', 'Build a new panel, step by step: same unit first, then length × width',
  '<p style="font-weight:700;">A gold strip is <strong>1 ft 3 in</strong> long and <strong>4 in</strong> wide. Each gold sheet is 1 inch on every side. Follow the steps. Each step opens when you finish the one before it.</p>'
  + tip('cora', 'Step 1 is always the same: look at the units. 1 ft 3 in is feet AND inches. The gold sheets are inches.')
  + model('guided'), cls='bl-green', extra=' style="margin-top:16px;"')
KEY = ('<div class="key-concept" id="mk-key" style="margin-top:16px;"><div class="key-concept-label">📐 Leonardo\'s Measuring Rules</div>'
  '<p>Area is always in <strong>square units</strong>, like square inches (in²) or square feet (ft²). So the two sides must be in the <strong>same unit</strong> before you multiply.</p>'
  '<ol style="margin:6px 0 6px 20px;font-weight:700;"><li>Are the lengths in the same units? If not, convert to the smaller unit.</li><li>Multiply length × width.</li><li>Write the area in square units.</li></ol>'
  '<p><strong>1 ft = 12 in</strong> · <strong>1 yd = 3 ft</strong></p>'
  + tip('leo', 'Ask it every time: are the lengths in the same units? I write it in my notebook: measure twice.')
  + '</div>' + video('do'))
FREE = ('<details class="cw-extra" style="margin-top:16px;"><summary>🧰 An extra tile grid, for your own tries</summary>'
  + model('free') + '</details>')

def nudge(tool, name, text):
    # a small "try a tool" button; the page moves it next to "Need a hint?" (Bethany, 3 Nov 2026: less to read)
    import base64, json   # the tool opens ready for this lesson: inch squares for the Color Tiles (audit, 3 Nov 2026)
    st = {'tiles': {'cols': 20, 'rows': 8, 'unit': 'in'}}.get(tool)
    tool = tool + ('&amp;st=1#s=' + base64.urlsafe_b64encode(json.dumps(st, separators=(',', ':')).encode()).decode().rstrip('=') if st else '&amp;st=1')
    return ('<div class="cw-nudge"><a class="cw-tool" href="manipulatives/tool.html?t=%s" target="_blank" rel="noopener" title="%s">'
            '<span aria-hidden="true">🧮</span> Try the <b>%s</b> ↗</a></div>' % (tool, text.replace('"', '&quot;'), name))

STUDY = ('<div class="activity bl-slate" id="mk-worked" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:%s;">🔍</div><div><div class="activity-title">Study It: Leonardo\'s Mirror Frame</div>'
 '<div class="activity-sub">Already solved for you. Read it, then try the jobs.</div></div></div><div class="activity-body">'
 '<p style="margin:0 0 10px;font-weight:700;color:#3A4A6B;">👀 Nothing to type here. This problem is solved two ways. Both ways get the same answer. Read the one that makes more sense to you.</p>'
 '<div class="task-box"><div class="task-label">Problem</div><p>A gold strip for a mirror frame is <strong>1 ft 2 in</strong> long and <strong>6 in</strong> wide. How many 1-inch gold sheets cover it?</p></div>'
 '<div class="we-two"><div class="we-way"><h5>Way 1: all inches first</h5><ol><li>Change the length to inches. 1 ft 2 in is 14 in. (12 + 2 = 14)</li><li>Now both sides are in inches: 14 in by 6 in.</li><li>14 × 6 = 84. It needs <b>84 sheets</b>.</li></ol></div>'
 '<div class="we-way"><h5>Way 2: split where the units change</h5><ol><li>Split the strip at the 1-foot mark.</li><li>The 1-foot part is 12 in by 6 in: 12 × 6 = 72.</li><li>The 2-inch part is 2 in by 6 in: 2 × 6 = 12. 72 + 12 = 84. It needs <b>84 sheets</b>.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Check it: 6 rows of 14 sheets. 14 + 14 + 14 + 14 + 14 + 14 = 84. ✓</p></div></div>') % SLATE

FRAME = act('mk-frame', SLATE, '🖼️', 'Same Units First: a Frame Piece and a Floor', 'Job 2 · Convert first, then multiply',
  job('The Duke\'s new painting needs a gold frame piece <strong>1 ft 4 in</strong> long and <strong>3 in</strong> wide. Then Atlas must tile the storeroom floor, <strong>1 yd 2 ft</strong> long and <strong>3 ft</strong> wide, with 1-foot square tiles. <strong>How many gold sheets for the frame piece? How many tiles for the floor?</strong>',
      ['Round 1: lay one row of gold sheets along the top of the frame piece and one column down the side. Each square is 1 inch.',
       'Type the length in inches. Then type how many sheets cover the whole piece.',
       'Round 2: do the same for the floor. Each square is now 1 foot. Type the length in feet, then the number of tiles.'])
  + tip('atlas', 'You don\'t have to fill every square! One row tells how many in each row. One column tells how many rows. That\'s the pattern.') + model('frame'), cls='bl-slate', extra=' style="margin-top:16px;"')

SQUARE = act('mk-square', RUST, '⬛', 'A Square Panel: 9 in on Each Side', 'Job 3 · Squares: side × side',
  job('Leonardo wants a small square panel for a portrait. Each side is <strong>9 in</strong>. <strong>How many gold sheets cover it? Why does a square need only one measurement?</strong>',
      ['Build the square on the grid: drag across the squares to lay the tiles.',
       'Type how many gold sheets cover it.',
       'Write why one side is enough to know for a square.'])
  + tip('leo', 'A square has 4 equal sides. If you know one side, you know them all.') + model('square')
  + nudge('geoboard', 'Geoboard', 'This might be a good time to try making a square on a geoboard. Stretch a band so all 4 sides are the same length.')
  + jbox('square', '✏️ Why does a square need only one measurement?', 'Lesson — Why a square needs one measurement'), cls='bl-violet', extra=' style="margin-top:16px;"')

SAME = act('mk-same', '#23915A', '▭', 'Same Gold, Different Shape', 'Job 4 · Rectangles with the same area',
  job('Hazel has <strong>18 gold sheets</strong> left. Leonardo wants a rectangle panel that uses all 18, with none left over. <strong>What rectangles could the panel be?</strong>',
      ['Build a rectangle with exactly 18 tiles. No holes, straight sides.',
       'Clear the tiles and build a different rectangle. Turning a rectangle sideways doesn\'t count as new.',
       'Find all 3 rectangles with whole-number sides.'])
  + tip('hazel', 'Picture them side by side. Bernardo thought longer means more, but these panels all look different and all use 18 sheets!') + nudge('tiles', 'Color Tiles', 'This might be a good time to try the Color Tiles. Build each rectangle with 18 tiles, then count its rows and columns.')
  + model('same'), cls='bl-slate', extra=' style="margin-top:16px;"')

FIX = act('mk-fix', RUST, '📝', 'Bernardo\'s Note: 1 × 5 = 5 sheets?', 'Job 5 · Find and fix a unit mistake',
  job('Bernardo\'s note says the jewelry box lid is <strong>1 ft</strong> long and <strong>5 in</strong> wide, and needs <strong>1 × 5 = 5</strong> gold sheets. <strong>What is wrong with his note? How many sheets does the lid really need?</strong>',
      ['Lay one row along the top of the lid and one column down the side. Each square is 1 inch.',
       'Type the lid\'s length in inches, then how many sheets it really needs.',
       'Write what Bernardo did wrong and how to fix it.'])
  + tip('cora', 'His times table is fine. Look at the units in his note. Are they the same?') + model('fix')
  + jbox('fix', '✏️ What was Bernardo\'s mistake? How do you fix it?', 'Lesson — Bernardo\'s mistake'), cls='bl-violet', extra=' style="margin-top:16px;"')

PLASTER = act('mk-plaster', SLATE, '🪣', 'Plaster for the Wall', 'Job 6 · A word problem with two steps',
  job('Before Leonardo paints on a wall, the wall gets fresh plaster. The wall section is <strong>9 ft</strong> long and <strong>6 ft</strong> high. One bucket of plaster covers <strong>10 square feet</strong>. <strong>How many buckets must Felix carry?</strong>',
      ['Lay one row and one column on the wall. Each square is 1 square foot.',
       'Type the area of the wall.',
       'Each bucket covers 10 square feet. Type how many buckets cover the whole wall, with no bare spots.'])
  + tip('felix', 'Check for bare wall! If 5 buckets leave some wall bare, I need one more bucket.') + model('plaster'), cls='bl-slate', extra=' style="margin-top:16px;"')

BIG = 'To find the area of a rectangle, first put both sides in the same unit: change feet to inches, or yards to feet. Then multiply length × width, or split the long side where the units change and add the parts. The area is in square units.'
PIC = ('<svg viewBox="0 0 600 250" class="mk-svg" role="img" aria-label="A rectangle 2 yd 1 ft long and 2 ft wide. Same units first: 2 yd 1 ft is 7 ft, and 7 × 2 = 14 square feet. Or split at the yard marks: 6 ft by 2 ft is 12, 1 ft by 2 ft is 2, and 12 + 2 = 14 square feet.">'
 '<rect width="600" height="250" rx="12" fill="#FFF8EF"/>'
 '<defs><marker id="opA" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#0E1C42"/></marker></defs>'
 + ''.join('<rect x="%d" y="%d" width="40" height="40" fill="#fff" stroke="#D9DEEA" stroke-width="1.5"/>' % (100 + c * 40, 60 + r * 40) for r in range(2) for c in range(7))
 + '<rect x="100" y="60" width="280" height="80" fill="none" stroke="#0E1C42" stroke-width="3"/>'
 '<line x1="340" y1="52" x2="340" y2="148" stroke="#9E4552" stroke-width="2.5" stroke-dasharray="6 5"/>'
 '<line x1="100" y1="40" x2="380" y2="40" stroke="#0E1C42" stroke-width="1.6" marker-start="url(#opA)" marker-end="url(#opA)"/>'
 '<text x="240" y="32" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="17" fill="#0E1C42">2 yd 1 ft</text>'
 '<line x1="396" y1="60" x2="396" y2="140" stroke="#0E1C42" stroke-width="1.6" marker-start="url(#opA)" marker-end="url(#opA)"/>'
 '<text x="405" y="106" font-family="Nunito" font-weight="900" font-size="17" fill="#0E1C42">2 ft</text>'
 '<text x="220" y="168" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#9E4552">6 ft (2 yd)</text><text x="360" y="168" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#9E4552">1 ft</text>'
 '<text x="300" y="200" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#0E1C42">Same units first: 2 yd 1 ft = 7 ft, and 7 × 2 = 14 square feet.</text>'
 '<text x="300" y="228" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#9E4552">Or split: 6 × 2 = 12, then 1 × 2 = 2, and 12 + 2 = 14 square feet.</text></svg>')
ONEPIC = ('<div class="key-concept pq-onepic" id="mk-onepic" style="margin-top:16px;"><div class="key-concept-label">🖼️ The Whole Lesson in One Picture</div>'
 '<p class="op-big"><strong>' + BIG + '</strong></p>' + PIC
 + jbox('big', '✏️ Put the big idea in your own words. Use an example of your own.', 'Lesson — The big idea in my own words') + '</div>')

def station(n, title, sub, inner):
    return '<div class="cw-station" data-st="%d" data-title="%s" data-sub="%s">%s</div>' % (n, title, sub, inner)
# three stations, one open at a time (Bethany, 3 Nov 2026: the Learn tab felt like a scroll marathon)
panel('learn', station(1, 'Learn it', 'Watch, compare the Crew\'s ways, build it together', video('learn') + ways_card() + GUIDED + KEY)
      + station(2, 'Practice together', 'Study a solved one, then convert and multiply', STUDY + FRAME + SQUARE + FREE)
      + station(3, 'On your own', 'Same area, Bernardo\'s note, the plaster, the big idea', SAME + win('note') + FIX + PLASTER + ONEPIC)
      + nextbtn('Six workshop jobs. Now show what you know.', 'assignment', 'Continue to 🌟 Show What You Know →'))

# ═════════ SHOW WHAT YOU KNOW ═════════
SW = ('<div class="activity bl-navy"><div class="activity-head"><div class="activity-num" style="background:#0E1C42;">📬</div><div><div class="activity-title">Show What You Know</div><div class="activity-sub">Type each answer in its own box.</div></div></div><div class="activity-body">'
 + tip('leo', 'Before each problem, ask: are the lengths in the same units? Then multiply, and write the answer in square units.')
 + problem(1, 'Length × width.', part('Problem 1 (a)', '(a) A rectangle 8 cm long and 7 cm wide. Area = ' + box('1a', 'Problem 1 a, square centimeters', 'sq cm'))
        + part('Problem 1 (b)', '(b) A square 4 in on each side. Area = ' + box('1b', 'Problem 1 b, square inches', 'sq in')))
 + nudge('whiteboard', 'Grid Whiteboard', 'Stuck on a problem with two units? Draw the rectangle on the Grid Whiteboard and label both sides in the same unit.')
 + problem(2, 'Convert first.', part('Problem 2 (a)', '(a) A rectangle 1 ft 1 in long and 6 in wide. Area = ' + box('2a', 'Problem 2 a, square inches', 'sq in'))
        + part('Problem 2 (b)', '(b) A rug 2 yd long and 4 ft wide. Area = ' + box('2b', 'Problem 2 b, square feet', 'sq ft')))
 + nudge('tiles', 'Color Tiles', 'This might be a good time to try the Color Tiles. Build the 4 by 5 rectangle, then move the same tiles into a new rectangle.')
 + problem(3, 'Same area, different shape.', part('Problem 3 (a)', '(a) Area of a rectangle 4 in by 5 in = ' + box('3a', 'Problem 3 a, square inches', 'sq in'))
        + part('Problem 3 (b)', '(b) A different rectangle with the same area: ' + box('3b', 'Problem 3 b, length in inches', 'in') + ' by ' + box('3c', 'Problem 3 b, width in inches', 'in')),
        intro='')
 + model('bonus')
 + act('mk-prove', RUST, '🧾', 'Prove It: Is Bernardo Right?', 'Answer the Essential Question',
     job('Bernardo says a strip <strong>1 ft</strong> long and <strong>3 in</strong> wide needs <strong>3 gold sheets</strong>. <strong>Prove him wrong. Tell what to do first, and find the right number of sheets.</strong>',
         ['Ask: are the lengths in the same units?', 'Fill in the two boxes: the inches, then the number of sheets.', 'Write your proof: what to do first, and how you found the sheets.'])
     + model('prove')
     + nudge('whiteboard', 'Grid Whiteboard', 'A picture can prove it. Draw the strip on the Grid Whiteboard, 1 square for each inch.')
     + jbox('prove', '✏️ My proof', 'Show What You Know — Prove it: Bernardo\'s strip'), cls='bl-violet', extra=' style="margin-top:16px;"')
 + win('wrap') + video('wrap')
 + ('<div class="cw-howto" id="mk-howto"><h4>📮 How to turn in your work</h4><ol>'
    '<li>Check the list at the bottom: all six jobs and every Show What You Know question.</li>'
    '<li>Press <b>Gather My Answers</b>, then <b>Copy All Answers</b>. (Or print it or save it as a PDF.)</li>'
    '<li>Open this lesson\'s assignment in Canvas.</li>'
    '<li>Paste your answers (or upload the PDF), then press <b>Submit</b>.</li></ol></div>')
 + GATHER
 + '<div class="activity bl-slate" id="mk-next" style="margin-top:18px;border-left-color:#0E8A8C;"><div class="activity-head"><div class="activity-num" style="background:#0E8A8C;color:#fff;">🗺️</div><div><div class="activity-title">What\'s Next</div><div class="activity-sub">Coming up in Unit 11</div></div></div>'
   '<div class="activity-body"><p>Next lesson, <strong>Area of Rectangles, Part 2</strong>: you know the area and one side. Can you find the missing side? Leonardo needs to know how long the Duke\'s panel must be.</p></div></div>'
 + TURNIN + '</div></div>')
panel('assignment', SW)
answer_boxes_save()
