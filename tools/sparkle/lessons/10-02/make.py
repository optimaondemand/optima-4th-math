# Lesson 4.10.02 · Customary Units of Length · Level 10 "Metric Market", the Foot Bridge (lesson 2 of 7)
# Dimensions 4B Chapter 10 Lesson 2 shape (28 Oct 2026): compare and compute with feet and inches, two methods
# (change to inches vs number bond to feet and inches), feet → yards and feet. No IP problem is solved on the page.
# Run with: python3 tools/sparkle/build_lesson.py 10-02   (never run this file directly)
import re

def job(story, steps):
    # every Learn job opens with the story it solves and what to do, so students know the goal before touching the model
    return ('<div class="task-box"><div class="task-label">Your job</div><p>%s</p></div>' % story
            + '<div class="mk-todo"><b>What to do</b><ol>' + ''.join('<li>%s</li>' % x for x in steps) + '</ol></div>')

def act(id, color, icon, title, sub, body, cls='bl-slate', extra=''):
    return ('<div class="activity %s" id="%s"%s><div class="activity-head"><div class="activity-num" style="background:%s;">%s</div><div><div class="activity-title">%s</div>'
            '<div class="activity-sub">%s</div></div></div><div class="activity-body">%s</div></div>') % (cls, id, extra, color, icon, title, sub, body)

def ruler(feet, extra, label, w=600):
    # a plain picture ruler: whole feet (green, 12 in each) + leftover inches (orange), to scale
    tot = feet * 12 + extra; u = (w - 60) / 60.0; x = 30; out = ''
    for k in range(feet):
        out += '<rect x="%.1f" y="30" width="%.1f" height="30" fill="#2DB87A" stroke="#3B2417" stroke-width="2"/><text x="%.1f" y="50" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#fff">1 ft</text>' % (x, 12 * u, x + 6 * u); x += 12 * u
    if extra:
        out += '<rect x="%.1f" y="30" width="%.1f" height="30" fill="#F28C28" stroke="#3B2417" stroke-width="2"/>' % (x, extra * u)
    return out + '<text x="30" y="20" font-family="Nunito" font-weight="900" font-size="15" fill="#5B2E10">%s</text>' % label

# ── header: pixel town strip, clean top
ins_before('<div class="quote-strip">', '<div class="pq-town-strip" aria-hidden="true"></div>')
for mk in ['<div class="quote-strip">', '<div class="standards-toggle-bar"', '<div class="info-strip">', '<div class="explorer-strip">', '<div class="need-strip">']:
    replace_block(mk, '')
m = re.search(r'<div class="intro-2col">', s); i = m.start(); j = block_end(s, i); intro = s[i:j]
intro = re.sub(r'<div class="intro-card-head-title">Coach Daniels.*?</div>', '<div class="intro-card-head-title">Which is longer, 6 ft 5 in or 79 in? How can you be sure?</div>', intro, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-body">).*?(</div></div><div class="intro-card theme-objectives">)',
  r'\1<p class="pq-eq-note">Some lengths use two units at once, like 6 ft 5 in. You will find two ways to work with them. You will prove the answer by the end of the lesson.</p>\2', intro, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-objectives">.*?<div class="intro-card-body">).*$',
  r'\1<div class="obj-line"><span class="obj-icon">📏</span><span><strong>Change</strong> feet and inches to inches, and inches to feet and inches.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">🔁</span><span><strong>Add and subtract</strong> feet and inches, trading 12 inches for 1 foot.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">🌉</span><span><strong>Change yards, feet and inches</strong> to inches, one step at a time.</span></div></div></div></div>', intro, flags=re.S)
s = s[:i] + '<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>' + intro + '</details>' + s[j:]

# ── A. Think video + the bridge board (the first game window comes after Build a Foot, which it needs)
replace_block('<div class="video-placeholder-wrap">\n<!-- slot: g4math-10-02 -->', video('think') + '\n<div class="mk-board-mount"></div>')

# ── B. the old Math Crew card leaves the Warm-Up (their methods move to Learn, after the Think)
i = s.index('<div class="activity bl-violet"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div>'); j = block_end(s, i); s = s[:i] + s[j:]
CREW = ('<div class="activity bl-violet" id="mk-crew"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div><div><div class="activity-title">The Math Crew: Two Ways</div>'
 '<div class="activity-sub">Which post is taller: north at 6 ft 5 in, or south at 79 in?</div></div></div><div class="activity-body">'
 '<p>The Crew found the answer two different ways. Read both. Which way would you pick?</p>'
 '<div class="bubble-row">'
 '<div class="bubble atlas"><div class="bubble-avatar">A</div><div class="bubble-body"><div class="bubble-name">Atlas: feet and inches</div><div class="bubble-text">"I change the south post\'s 79 in to feet and inches. I use a number bond to split 79 into 72 and 7. 72 in is 6 ft, so the south post is 6 ft 7 in. Both are 6 feet, and 7 inches is 2 more than 5 inches. The south post is taller by 2 in."</div></div></div>'
 '<div class="bubble felix"><div class="bubble-avatar">F</div><div class="bubble-body"><div class="bubble-name">Felix: all inches</div><div class="bubble-text">"I change the north post to inches. 6 ft is 6 × 12 = 72 in. 72 in + 5 in = 77 in. The south post is 79 in, and 79 − 77 = 2. The south post is taller by 2 in. Same answer!"</div></div></div>'
 '</div><div class="bubble-row">'
 '<div class="bubble hazel"><div class="bubble-avatar">H</div><div class="bubble-body"><div class="bubble-name">Hazel: picture a ruler</div><div class="bubble-text">"I picture a ruler. Every 12 little inch marks make one foot. So 6 feet is 6 groups of 12 inches."</div></div></div>'
 '<div class="bubble cora"><div class="bubble-avatar">C</div><div class="bubble-body"><div class="bubble-name">Cora: trade 12, not 10</div><div class="bubble-text">"In meters we traded 100 centimeters. Here we trade 12 inches for 1 foot. When the inches reach 12, trade them!"</div></div></div>'
 '</div><div class="callout callout-tip" style="margin-top:8px;"><span class="callout-icon">💡</span><p>Crew rule: <em>Picture the ruler (Hazel). Pick a way: feet and inches, or all inches (Atlas, Felix). Trade 12 inches for a foot and check the units (Cora).</em></p></div>'
 '<div class="journal-label">✏️ Which Crew way is most like yours? Which way would you use for a bigger number, like 150 in, and why? <span class="saved-dot" id="dot-compare"></span></div>'
 '<textarea class="journal-box" data-label="Learn — My way and the Crew\'s ways" id="journal-compare" oninput="autoSave(this,\'dot-compare\')" placeholder=""></textarea></div></div>')

# ── C. readiness chart → Job 1 Build a Foot (Bar Strip) + the first game window + Mental Math "Make a foot"
replace_block('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🔎</div>',
 act('mk-foot', '#F5C518;color:#0E1C42', '📏', 'Warm-Up: Build a Foot', 'Job 1 · How many inches make 1 foot?',
   job('At the Foot Bridge, people use <strong>customary</strong> units: inches, feet and more. The inch (in) is the small unit. The foot (ft) is the bigger one. Gus can\'t fix his rail until everyone agrees how long a foot is. <strong>How many inches make 1 foot?</strong>',
       ['Round 1: drag or tap 1-inch pieces onto Gus\'s ruler until it is full. Count them.',
        'Round 2: fill Gus\'s 2-foot tape with 1-foot pieces. Read how many inches long it is.',
        'Read the number sentence under the bar. It shows how many inches you used.'])
   + tip('hazel', 'Count every piece you add. The ruler is exactly 1 foot long.') + model('foot')
   , cls='bl-yellow')
 + slot('sort')
 + '<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🧠</div><div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, four quick problems</div></div></div><div class="activity-body">'
 + tip('felix', '12 inches make 1 foot. So find the number that goes with yours to make 12.') + model('mental') + '</div></div>')

# ── D. Think About It → Gus's height post (who is taller?), any method, no teaching yet
i = s.index('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🤔</div>'); j = block_end(s, i)
s = s[:i] + act('mk-think', '#F5C518;color:#0E1C42', '🤔', 'Think About It: Gus\'s Two Posts', 'Try it your way first',
  '<div class="callout callout-think"><span class="callout-icon">📏</span><p>Gus has two tall posts at the ends of his bridge. The north post is <strong>6 ft 5 in</strong> tall. The tag on the south post says <strong>79 in</strong>. Which post is taller, and by how many inches?</p></div>'
  + '<div class="journal-label">👀 What do you notice about the two heights? What do you wonder? <span class="saved-dot" id="dot-notice"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — I notice, I wonder" id="journal-notice" oninput="autoSave(this,\'dot-notice\')" placeholder="I notice… I wonder…"></textarea>'
  + tip('atlas', 'One height is in feet and inches. The other is only in inches. How can you compare them fairly?')
  + model('think')
  + '<div class="journal-label">✏️ How did you find out which post is taller? Tell your steps. <span class="saved-dot" id="dot-think"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — Think: which post is taller?" id="journal-think" oninput="autoSave(this,\'dot-think\')" placeholder=""></textarea>',
  cls='bl-yellow') + s[j:]
rep('Now stack inch-tiles to build a foot — then a yard.', 'Next: on the Learn tab, the Math Crew shows two ways, and you measure Rosa\'s rope.')

# ── E. Learn: drop the flip cards and the leftover "SPLIT the bar" line; video, the Crew's two ways, the Rope Ruler, the splice
i = s.index('<div aria-label="Daily vocabulary flash cards" class="vocab-section">'); j = block_end(s, i); s = s[:i] + s[j:]
i = s.index('<div class="callout callout-think" style="margin-bottom:14px;"><span class="callout-icon">🧠</span><p><strong>Try before the rule:</strong>')
j = block_end(s, i); k = s.index('<div class="activity bl-slate">', j); kend = block_end(s, k)
assert 'Ruler Stacker' in s[k:kend]
s = s[:i] + (video('learn') + CREW
 + act('mk-rope', '#C56C3F', '🪢', 'Rope Ruler: 46 in = ? ft ? in', 'Job 2 · Use the Rope Ruler and a number bond',
   job('Rosa\'s rope is <strong>46 in</strong> long. Gus needs its length in feet and inches. <strong>How many feet and inches is 46 in?</strong>',
       ['Build the rope on the ruler. Use 1-foot pieces first (12 in each), as many as fit.',
        'Fill the rest with 1-inch pieces until the bar reaches 46 in.',
        'Fill in the number bond: 46 in splits into whole feet (in inches) and leftover inches.',
        'Type the length in feet and inches in the boxes.'])
   + tip('cora', 'Each 1-foot piece is 12 inches. Count by 12s: 12, 24, 36 … and stop before you go past 46.') + model('rope'))
 + act('mk-splice', '#6B3FA0', '🧶', 'Join the Ropes: 2 ft 8 in + 1 ft 7 in', 'Job 3 · Make the next foot, then draw the story',
   job('The snapped rail has a gap. Rosa will <strong>splice</strong> two short ropes to make the piece that fills it. One rope is <strong>2 ft 8 in</strong>. The other is <strong>1 ft 7 in</strong>. <strong>How long is the new rope?</strong>',
       ['Warm up with the "make the next foot" problem.',
        'Tap each fact in the story, then tap the part of the bar it tells about.',
        'Add the feet, then add the inches. If the inches reach 12 or more, trade 12 in for 1 ft.',
        'Type the length of the new rope in feet and inches.'])
   + tip('felix', 'Watch the inches when you add. 12 inches make a new foot. Not 10!') + model('next') + model('splice'), cls='bl-violet')
 + slot('build')) + s[kend:]

# ── F. the chart → the Foot Bridge Board (the units, the two ways, the mile), then the Do video, Study It, Job 4
BOARDSVG = ('<svg viewBox="0 0 640 230" class="mk-svg" role="img" aria-label="A yard is 3 feet laid end to end, and each foot is 12 inches. 1 yard is 36 inches.">'
 '<rect width="640" height="230" rx="12" fill="#FFF8EF"/>'
 + ''.join('<rect x="%d" y="40" width="180" height="34" fill="#2DB87A" stroke="#3B2417" stroke-width="3"/>' % (40 + k * 180) for k in range(3))
 + ''.join('<path d="M%d 74v-%d" stroke="#3B2417" stroke-width="1.5"/>' % (40 + n * 15, 12 if n % 12 == 0 else 7) for n in range(37))
 + ''.join('<text x="%d" y="64" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#fff">1 ft = 12 in</text>' % (130 + k * 180) for k in range(3))
 + '<path d="M40 92v12M580 92v12M40 98h540" stroke="#3A6B9A" stroke-width="3"/><text x="310" y="124" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="18" fill="#3A6B9A">1 yd = 3 ft = 36 in</text>'
 '<text x="40" y="28" font-family="DotGothic16,Nunito" font-size="16" fill="#3B2417">a yardstick</text>'
 '<rect x="40" y="148" width="560" height="62" rx="10" fill="#FFFFFF" stroke="#F5D4BC" stroke-width="2"/>'
 '<text x="60" y="174" font-family="Nunito" font-weight="900" font-size="15" fill="#2DB87A">To a smaller unit, multiply: yards × 3 = feet, feet × 12 = inches</text>'
 '<text x="60" y="198" font-family="Nunito" font-weight="900" font-size="15" fill="#C56C3F">To a bigger unit, count by 12s (or 3s) and keep the leftover</text></svg>')
replace_block('<div class="key-concept" style="margin-top:16px;"><div class="key-concept-label">📐 The Customary Length Chart',
 '<div class="key-concept" id="mk-board-kc" style="margin-top:16px;"><div class="key-concept-label">📐 The Foot Bridge Board</div>' + BOARDSVG
 + '<p>Two more units of length are the yard and the mile. We write yd for yards and mi for miles.</p>'
 '<p><strong>Length:</strong> 12 in = 1 ft. 3 ft = 1 yd, so 1 yd = 36 in. 1 mi = 5,280 ft.</p>'
 + tip('cora', 'Exact words: <b>regroup</b> means trading small units for a big one (12 in for 1 ft) or a big one for small ones (1 ft for 12 in).') + '</div><div class="pq-vslot" data-slot="do"></div><!--WE-->')

# ── G. Picture It (it solved an IP problem) → Job 4 Rope Order: yards → feet → inches (IP 3's direction, new numbers)
pic_start = '<div class="activity bl-violet" style="margin-top:16px;"><div class="activity-head">'
i = s.index(pic_start); j = block_end(s, i)
s = s[:i] + act('mk-order', '#3A6B9A', '🧵', 'Rope Order: 2 yd 2 ft 7 in = ? in', 'Job 5 · Change yards and feet to inches',
  job('Eastside wants rope for its side of the bridge: <strong>2 yd 2 ft 7 in</strong>. Rosa\'s cutting machine only reads inches. <strong>How many inches long should she cut it?</strong>',
      ['Build the order on the ruler: yard pieces first, then foot pieces, then inch pieces.',
       'Change the yards to feet. Each yard is 3 feet.',
       'Change all the feet to inches. Each foot is 12 inches.',
       'Add the extra inches. Type each answer in its box.'])
  + tip('hazel', 'A yard is 3 feet, and each foot is 12 inches. Go one step at a time: yards to feet, then feet to inches.')
  + model('order'), cls='bl-slate', extra=' style="margin-top:16px;"') + s[j:]

# ── H. the track-lap worked example (IP 5) → Study It (subtracting with a trade) + the whole lesson in one picture
i = s.index('<div class="activity bl-slate"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Worked Example: Track Lap</div>'); j = block_end(s, i)
WE = ('<div class="activity bl-slate" id="mk-worked"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Study It: How Gus Cut His Rope</div><div class="activity-sub">Already solved for you. Read it, then cut a rope yourself.</div></div></div><div class="activity-body">'
 '<p style="margin:0 0 10px;font-weight:700;color:#3A4A6B;">👀 Nothing to type here. This problem is solved two ways. Both ways get the same answer. Read the one that makes more sense to you.</p>'
 '<div class="task-box"><div class="task-label">Problem</div><p>Gus has a rope <strong>6 ft 2 in</strong> long. He cuts off <strong>2 ft 10 in</strong>. How long is the piece that is left?</p></div>'
 + tip('atlas', 'You can\'t take 10 inches away from 2 inches. So first, trade 1 foot for 12 inches.') +
 '<div class="we-two"><div class="we-way"><h5>Way 1: feet and inches</h5><ol><li>Trade 1 foot for 12 inches. 6 ft 2 in becomes 5 ft 14 in.</li><li>Take away the inches: 14 in − 10 in = 4 in.</li><li>Take away the feet: 5 ft − 2 ft = 3 ft.</li><li>The piece left is <b>3 ft 4 in</b>.</li></ol></div>'
 '<div class="we-way"><h5>Way 2: all inches</h5><ol><li>6 ft 2 in is 74 in. (6 × 12 = 72, and 2 more)</li><li>2 ft 10 in is 34 in. (2 × 12 = 24, and 10 more)</li><li>Take away: 74 in − 34 in = 40 in.</li><li>Change back: 36 in make 3 ft, and 4 in are left. The piece left is <b>3 ft 4 in</b>.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Check it: put the cut piece back. 3 ft 4 in + 2 ft 10 in = 5 ft 14 in. 14 in is 1 ft 2 in, so that is 6 ft 2 in, the whole rope. ✓</p>')
BIG = 'To compare, add or subtract lengths with two units, pick a way: work in feet and inches and trade 12 inches for 1 foot when you need to, or change everything to inches first (yards × 3 = feet, feet × 12 = inches). Both ways give the same answer.'
CHAIN = ('<svg viewBox="0 0 520 150" class="mk-svg" role="img" aria-label="Yards times 3 make feet. Feet times 12 make inches. Example: 3 yards 1 foot 4 inches is 9 feet plus 1 foot, 10 feet, which is 120 inches plus 4 inches, 124 inches.">'
 '<rect width="520" height="150" rx="12" fill="#FFF8EF"/>'
 + ''.join('<rect x="%d" y="24" width="110" height="44" rx="8" fill="%s" stroke="#3B2417" stroke-width="3"/><text x="%d" y="53" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="20" fill="#fff">%s</text>' % (20 + k * 180, c, 75 + k * 180, u) for k, (u, c) in enumerate([('yards', '#3A7BD5'), ('feet', '#2DB87A'), ('inches', '#F28C28')]))
 + ''.join('<path d="M%d 46h44" stroke="#C56C3F" stroke-width="4" marker-end="url(#opar)"/><text x="%d" y="14" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="17" fill="#C56C3F">%s</text>' % (136 + k * 180, 158 + k * 180, f) for k, f in enumerate(['× 3', '× 12']))
 + '<defs><marker id="opar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#C56C3F"/></marker></defs>'
 '<text x="260" y="98" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#3B2417">3 yd 1 ft 4 in → 9 ft + 1 ft = 10 ft → 120 in + 4 in = 124 in</text>'
 '<text x="260" y="128" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#3A6B9A">Or stay in feet and inches: trade 12 in for 1 ft when you need to.</text></svg>')
ONEPIC = ('<div class="key-concept pq-onepic" id="mk-onepic" style="margin-top:14px;"><div class="key-concept-label">⚖️ The Whole Lesson in One Picture</div>'
 '<p class="op-big"><strong>' + BIG + '</strong></p>' + CHAIN
 + '<div class="journal-label">✏️ Put the big idea in your own words. Use an example of your own. <span class="saved-dot" id="dot-big"></span></div>'
 '<textarea class="journal-box" data-label="Learn — The big idea in my own words" id="journal-big" oninput="autoSave(this,\'dot-big\')" placeholder=""></textarea></div>')
s = s[:i] + ONEPIC + s[j:]
CUT = act('mk-cut', '#C56C3F', '✂️', 'Cut the Rope: 5 ft 1 in − 2 ft 6 in', 'Job 4 · Take away on the Trade Mat',
  job('Gus has a spare rope <strong>5 ft 1 in</strong> long. He cuts off <strong>2 ft 6 in</strong> to tie the gate. <strong>How long is the piece that is left?</strong>',
      ['Build the spare rope on the mat: 5 foot discs and 1 inch disc.',
       'Take away the feet first: move 2 foot discs to the take-away box.',
       'Take away 6 inches. There is only 1 inch, so break 1 foot into 12 inches first, then move 6.',
       'Read what is left on the mat. Type it in feet and inches, then try the two quick ones in inches.'])
  + tip('cora', 'Not enough inches to take away? Break 1 foot into 12 inches. Then there are plenty.')
  + model('cut'), cls='bl-slate', extra=' style="margin-top:16px;"')
s = s.replace('<!--WE-->', WE + '</div></div>' + CUT, 1)  # Study It right after the Do video, then Cut the Rope, then the Rope Order
rep('You stacked inches and feet. Now practice.', 'Five bridge jobs down. One to go: prove the Smudge wrong.')

# ── I. Show What You Know: per-part answer boxes, bonus, prove it, the chase, What's Next
for a, b in [('<div class="activity-sub">For each problem, convert between customary units of length. Show your work.</div>', '<div class="activity-sub">Type each answer in its own box.</div>'),
             ('<p>Use the chart: 12 in = 1 ft, 3 ft = 1 yd, 36 in = 1 yd, 5,280 ft = 1 mi.</p>', '<p>Use the board: 12 in = 1 ft, 3 ft = 1 yd. To change to a smaller unit, multiply.</p>'),
             ('<p><strong>Before each problem, ask:</strong> Which units am I converting between, and how many of the smaller unit fit inside the bigger one?</p>', '<p>Show your thinking on paper if it helps, then type each answer.</p>')]:
    rep(a, b)
SW = ('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Change the units.</strong> <span class="saved-dot" id="dot-1"></span></p><div class="ans-parts">'
 + part('Problem 1 (a)', '(a) 7 ft = ' + box('1a', 'Problem 1 a, inches', 'in'))
 + part('Problem 1 (b)', '(b) 6 yd = ' + box('1b', 'Problem 1 b, feet', 'ft'))
 + part('Problem 1 (c)', '(c) 67 in = ' + box('1c1', 'Problem 1 c, feet', 'ft') + ' ' + box('1c2', 'Problem 1 c, inches', 'in')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">2</span><strong>Add and subtract lengths.</strong> <span class="saved-dot" id="dot-2"></span></p><div class="ans-parts">'
 + part('Problem 2 (a)', '(a) 3 ft 9 in + 2 ft 6 in = ' + box('2a1', 'Problem 2 a, feet', 'ft') + ' ' + box('2a2', 'Problem 2 a, inches', 'in'))
 + part('Problem 2 (b)', '(b) 6 ft 4 in − 2 ft 8 in = ' + box('2b1', 'Problem 2 b, feet', 'ft') + ' ' + box('2b2', 'Problem 2 b, inches', 'in'))
 + part('Problem 2 (c)', '(c) 1 ft − 4 in = ' + box('2c', 'Problem 2 c, inches', 'in'))
 + part('Problem 2 (d)', '(d) 3 ft + 2 in = ' + box('2d', 'Problem 2 d, inches', 'in')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">3</span><strong>Word problem: Eastside\'s fence.</strong> The fence by the Eastside gate is 4 yd 2 ft long. <span class="saved-dot" id="dot-3"></span></p><div class="ans-parts">'
 + part('Problem 3 (a) in feet', '(a) How many feet long is the fence? ' + box('3a', 'Problem 3 a, feet', 'ft'))
 + part('Problem 3 (b) in inches', '(b) How many inches long is it? ' + box('3b', 'Problem 3 b, inches', 'in')) + '</div></div>')
i = s.find('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Single conversions.</strong>'); j = s.find('<div class="activity bl-slate" style="margin-top:18px;border-left-color:#0E8A8C;">', i); assert i > 0 and j > i
s = s[:i] + tip('opti', 'Hoo! Before each problem, ask: do I need to trade? 12 or more inches make a new foot. Too few inches to take away? Trade 1 foot for 12 inches.') + SW + model('bonus') + (
 '<div class="activity bl-violet" id="mk-prove"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">⚖️</div><div><div class="activity-title">Last Job: Is 2 ft 15 in the same as 3 ft 5 in?</div><div class="activity-sub">Job 6 · Check the Smudge\'s banner with bars</div></div></div><div class="activity-body">'
 +job('The Smudge hung a banner on the bridge: <strong>2 ft 15 in = 3 ft 5 in</strong>. If people believe it, every rope cut in Eastside will be the wrong length. <strong>Is 2 ft 15 in really the same as 3 ft 5 in?</strong>',
      ['Top bar: build <strong>2 ft 15 in</strong> with 1-foot pieces and 1-inch pieces.',
       'Bottom bar: build <strong>3 ft 5 in</strong> the same way.',
       'Both bars use the same ruler. Compare them: are they the same length?',
       'Read the line under the bars. What should the banner say?'])
 + tip('cora', 'Same scale, fair compare. If the bars are different lengths, the amounts are different.') + model('prove') + '</div></div>' + slot('chase') + video('wrap')) + s[j:]
ins_before('<div class="gathered-box">', tip('cora', 'Check every answer for a unit. "3 5" isn\'t finished. "3 ft 5 in" is.'))

# ── J. small text fixes (jargon, What's Next, checklist)
for a, b in [('<div class="fluency-head-label">FLUENCY WARM-UP</div><div class="fluency-head-title">Mixed Division Facts — Maintenance</div>', '<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">Mixed Division Facts</div>'),
             ('Warm up your fact fluency before today’s lesson.', 'Warm up with these division facts before today’s lesson.'),
             ('data-label="Fluency Warm-Up (Mixed Division Facts — Maintenance)"', 'data-label="Fact Warm-Up (Mixed Division Facts)"'),
             ('<div class="activity-title">Connection Forward: Customary Length</div><div class="activity-sub">What comes next in Unit 10</div>', '<div class="activity-title">What\'s Next</div><div class="activity-sub">Coming up in Unit 10</div>'),
             ('Next lesson, we measure WEIGHT instead of length — ounces and pounds — using the exact same convert-then-compute strategy, but with a new factor: 16.',
              'Next lesson, you\'ll visit the Eastside General Store and measure weight in pounds and ounces. The trade changes again: 16 ounces make 1 pound. The two ways you used today still work.'),
             ('<span>I completed both quick checks above.</span>', '<span>I finished all six bridge jobs.</span>'),
             ('<span>I showed my model or my steps for each problem.</span>', '<span>I typed an answer in every box.</span>')]:
    rep(a, b)
s = re.sub(r'var FLUENCY_TITLE = "Mixed Division Facts — Maintenance";', 'var FLUENCY_TITLE = "Mixed Division Facts";', s)
answer_boxes_save()
