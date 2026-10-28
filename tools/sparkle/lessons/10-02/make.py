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
intro = re.sub(r'<div class="intro-card-head-title">Coach Daniels.*?</div>', '<div class="intro-card-head-title">How do you compare and add lengths like 4 ft 5 in?</div>', intro, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-body">).*?(</div></div><div class="intro-card theme-objectives">)',
  r'\1<p class="pq-eq-note">Some lengths use two units at once, like 4 ft 5 in. You will find two ways to work with them. You will prove the answer by the end of the lesson.</p>\2', intro, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-objectives">.*?<div class="intro-card-body">).*$',
  r'\1<div class="obj-line"><span class="obj-icon">📏</span><span><strong>Change</strong> feet and inches to inches, and inches to feet and inches.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">🔁</span><span><strong>Add and subtract</strong> feet and inches, trading 12 inches for 1 foot.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">🌉</span><span><strong>Measure the bridge rail</strong> in yards and feet.</span></div></div></div></div>', intro, flags=re.S)
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
 '</div><div class="callout callout-tip" style="margin-top:8px;"><span class="callout-icon">💡</span><p>Crew rule: <em>Picture the ruler (Hazel). Pick a way: feet and inches, or all inches (Atlas, Felix). Trade 12 inches for a foot and check the units (Cora).</em></p></div></div></div>')

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
       ['Warm up with the three "make the next foot" problems.',
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
 '<text x="60" y="174" font-family="Nunito" font-weight="900" font-size="15" fill="#2DB87A">Smaller unit → multiply: 3 ft = 3 × 12 in = 36 in</text>'
 '<text x="60" y="198" font-family="Nunito" font-weight="900" font-size="15" fill="#C56C3F">Bigger unit → count by 12s (or 3s), keep the leftover: 46 in = 36 in + 10 in = 3 ft 10 in</text></svg>')
replace_block('<div class="key-concept" style="margin-top:16px;"><div class="key-concept-label">📐 The Customary Length Chart',
 '<div class="key-concept" id="mk-board-kc" style="margin-top:16px;"><div class="key-concept-label">📐 The Foot Bridge Board</div>' + BOARDSVG
 + '<p>Two more units of length are the yard and the mile. We write yd for yards and mi for miles.</p>'
 '<p><strong>Length:</strong> 12 in = 1 ft. 3 ft = 1 yd, so 1 yd = 36 in. 1 mi = 5,280 ft.</p>'
 '<p><strong>Two units at once?</strong> Pick a way. <em>Feet and inches:</em> work on each unit, then trade 12 inches for 1 foot. <em>All inches:</em> change it all to inches, work, then change back.</p>'
 + tip('cora', 'Exact words: <b>regroup</b> means trading small units for a big one (12 in for 1 ft) or a big one for small ones (1 ft for 12 in).') + '</div><div class="pq-vslot" data-slot="do"></div><!--WE-->')

# ── G. Picture It (it solved an IP problem) → Job 4 Measure the Rail (yard pieces) + the think question
pic_start = '<div class="activity bl-violet" style="margin-top:16px;"><div class="activity-head">'
i = s.index(pic_start); j = block_end(s, i); blk = s[i:j]
soc = re.search(r'<div class="socratic-box">.*?</textarea></div>', blk, re.S).group(0)
soc = soc.replace('🧠 Socratic — Think Like a Mathematician', '🧠 Think Like a Mathematician')
soc = re.sub(r'<p class="socratic-q">.*?</p>', '<p class="socratic-q">Rosa says 3 ft 14 in and 4 ft 2 in are the same length. Is she right? How do you know?</p>', soc, flags=re.S)
soc = soc.replace('data-label="Learn — Socratic: 2 yd 1 ft 5 in"', 'data-label="Learn — Think: 3 ft 14 in"')
s = s[:i] + act('mk-yards', '#3A6B9A', '🌉', 'Measure the Rail: 29 ft = ? yd ? ft', 'Job 4 · Lay yard pieces on the rail',
  job('Eastside orders rope by the yard. Gus\'s whole rail is <strong>29 ft</strong> long. <strong>How many yards and feet is that?</strong>',
      ['Lay 1-yard pieces (3 ft each) on the rail until no more fit.',
       'Fill the rest with 1-foot pieces.',
       'Count the yard pieces. That is the number of yards. The 1-foot pieces left over are the feet.',
       'Type the length in yards and feet.'])
  + tip('hazel', 'The yard pieces are the big ones. The leftover feet must be fewer than 3, or they would make another yard.')
  + model('yards') + soc, cls='bl-slate', extra=' style="margin-top:16px;"') + s[j:]

# ── H. the track-lap worked example (IP 5) → Study It (subtracting with a trade) + the whole lesson in one picture
i = s.index('<div class="activity bl-slate"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Worked Example: Track Lap</div>'); j = block_end(s, i)
WE = ('<div class="activity bl-slate" id="mk-worked"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Study It: How Gus Cut His Rope</div><div class="activity-sub">Already solved for you. Read it, then measure the rail.</div></div></div><div class="activity-body">'
 '<p style="margin:0 0 10px;font-weight:700;color:#3A4A6B;">👀 Nothing to type here. Read each step and see how Atlas and Felix each solve it. Subtracting works like adding: you may need to trade.</p>'
 '<div class="task-box"><div class="task-label">Problem</div><p>Gus has a rope <strong>6 ft 2 in</strong> long. He cuts off <strong>2 ft 10 in</strong>. How long is the piece that is left?</p></div>'
 + tip('atlas', '2 in − 10 in won\'t work. Regroup first: trade 1 ft for 12 in.') +
 '<div class="we-two"><div class="we-way"><h5>Feet and inches (Atlas)</h5><ol><li>Regroup: 6 ft 2 in = 5 ft 14 in.</li><li>Inches: 14 in − 10 in = 4 in.</li><li>Feet: 5 ft − 2 ft = 3 ft.</li><li>Answer: <b>3 ft 4 in</b>.</li></ol></div>'
 '<div class="we-way"><h5>All inches (Felix)</h5><ol><li>Change: 6 ft 2 in = 72 in + 2 in = 74 in. 2 ft 10 in = 24 in + 10 in = 34 in.</li><li>Subtract: 74 in − 34 in = 40 in.</li><li>Change back: 36 in make 3 ft, and 4 in are left. 40 in = <b>3 ft 4 in</b>.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Check (Cora): 3 ft 4 in + 2 ft 10 in = 5 ft 14 in = 6 ft 2 in ✓</p>')
ONEPIC = ("<div class=\"key-concept pq-onepic\" style=\"margin-top:14px;\"><div class=\"key-concept-label\">⚖️ The Whole Lesson in One Picture</div>"
 "<div class=\"op-grid\"><figure class=\"op-stairs\"><svg viewBox=\"0 0 300 120\" role=\"img\" aria-label=\"A ruler 2 feet 7 inches long: two green 1-foot pieces of 12 inches and 7 orange inches. Under it: 2 feet 7 inches equals 31 inches.\">"
 + ruler(2, 7, '2 ft 7 in', 300).replace('y="30"', 'y="34"').replace('y="50"', 'y="54"')
 + "<text x=\"150\" y=\"100\" text-anchor=\"middle\" font-family=\"Nunito\" font-weight=\"900\" font-size=\"16\" fill=\"#3B2417\">12 + 12 + 7 = 31 in</text></svg>"
 "<figcaption><span class=\"op-dn\">⬇ To inches: <b>multiply the feet by 12</b>, add the inches</span><span class=\"op-up\">⬆ To feet: <b>count by 12s</b> (12 in → 1 ft), keep the leftover</span></figcaption></figure>"
 "<div class=\"op-ex\"><div class=\"op-h\" style=\"margin-bottom:6px\">1 ft 9 in + 1 ft 10 in, two ways</div>"
 "<div class=\"op-card\"><div class=\"op-h\">Feet and inches, then trade</div><p>1 ft + 1 ft = 2 ft. 9 in + 10 in = 19 in.</p><div class=\"op-eq\">2 ft 19 in = <b>3 ft 7 in</b></div></div>"
 "<div class=\"op-card\"><div class=\"op-h\">All inches first</div><p>21 in + 22 in = 43 in.</p><div class=\"op-eq\">36 in make 3 ft, 7 in left: <b>3 ft 7 in</b></div></div></div></div></div>")
s = s[:i] + ONEPIC + s[j:]
s = s.replace('<!--WE-->', WE + '</div></div>', 1)  # Study It right after the Do video, before Measure the Rail
rep('You stacked inches and feet. Now practice.', 'Four bridge jobs down. One to go: prove the Smudge wrong.')

# ── I. Show What You Know: per-part answer boxes, bonus, prove it, the chase, What's Next
for a, b in [('<div class="activity-sub">For each problem, convert between customary units of length. Show your work.</div>', '<div class="activity-sub">Type each answer in its own box.</div>'),
             ('<p>Use the chart: 12 in = 1 ft, 3 ft = 1 yd, 36 in = 1 yd, 5,280 ft = 1 mi.</p>', '<p>Use the board: 12 in = 1 ft, 3 ft = 1 yd. Work in feet and inches or all in inches, whichever you like.</p>'),
             ('<p><strong>Before each problem, ask:</strong> Which units am I converting between, and how many of the smaller unit fit inside the bigger one?</p>', '<p>Show your thinking on paper if it helps, then type each answer.</p>')]:
    rep(a, b)
SW = ('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Change the units.</strong> <span class="saved-dot" id="dot-1"></span></p><div class="ans-parts">'
 + part('Problem 1 (a)', '(a) 7 ft = ' + box('1a', 'Problem 1 a, inches', 'in'))
 + part('Problem 1 (b)', '(b) 6 yd = ' + box('1b', 'Problem 1 b, feet', 'ft'))
 + part('Problem 1 (c)', '(c) 67 in = ' + box('1c1', 'Problem 1 c, feet', 'ft') + ' ' + box('1c2', 'Problem 1 c, inches', 'in')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">2</span><strong>Add and subtract lengths.</strong> <span class="saved-dot" id="dot-2"></span></p><div class="ans-parts">'
 + part('Problem 2 (a)', '(a) 3 ft 9 in + 2 ft 6 in = ' + box('2a1', 'Problem 2 a, feet', 'ft') + ' ' + box('2a2', 'Problem 2 a, inches', 'in'))
 + part('Problem 2 (b)', '(b) 6 ft 4 in − 2 ft 8 in = ' + box('2b1', 'Problem 2 b, feet', 'ft') + ' ' + box('2b2', 'Problem 2 b, inches', 'in')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">3</span><strong>Word problem: Eastside\'s fence.</strong> The fence by the Eastside gate is 34 ft long. How long is it in yards and feet? <span class="saved-dot" id="dot-3"></span></p><div class="ans-parts">'
 + part('Problem 3', '34 ft = ' + box('3a', 'Problem 3, yards', 'yd') + ' ' + box('3b', 'Problem 3, feet', 'ft')) + '</div></div>')
i = s.find('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Single conversions.</strong>'); j = s.find('<div class="activity bl-slate" style="margin-top:18px;border-left-color:#0E8A8C;">', i); assert i > 0 and j > i
s = s[:i] + tip('opti', 'Hoo! Before each problem, ask: do I need to trade? 12 or more inches make a new foot. Too few inches to take away? Trade 1 foot for 12 inches.') + SW + model('bonus') + (
 '<div class="activity bl-violet" id="mk-prove"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">⚖️</div><div><div class="activity-title">Last Job: Is 2 ft 15 in the same as 3 ft 5 in?</div><div class="activity-sub">Job 5 · Check the Smudge\'s banner with bars</div></div></div><div class="activity-body">'
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
             ('<span>I completed both quick checks above.</span>', '<span>I finished all five bridge jobs.</span>'),
             ('<span>I showed my model or my steps for each problem.</span>', '<span>I typed an answer in every box.</span>')]:
    rep(a, b)
s = re.sub(r'var FLUENCY_TITLE = "Mixed Division Facts — Maintenance";', 'var FLUENCY_TITLE = "Mixed Division Facts";', s)
answer_boxes_save()
