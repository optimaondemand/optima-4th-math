# Lesson 4.10.06 · Fractions and Measurement · Level 10 "Metric Market", the Night Market (lesson 6 of 7)
# Dimensions 4B Chapter 10 Lesson 7 + the IP (2 Nov 2026): a fraction of a unit in small units (ft, lb, h, metric), two ways
# (cut the small units into equal parts and take some · multiply the fraction by the small units); the reverse (part over
# whole in the SAME unit, then simplify by making bigger equal parts); a word problem that halves a fraction of a foot.
# One hands-on Ribbon Cutter job per IP direction, new numbers (every IP result avoided, see notes.md).
# Run with: python3 tools/sparkle/build_lesson.py 10-06   (never run this file directly)
import re

def job(story, steps):
    return ('<div class="task-box"><div class="task-label">Your job</div><p>%s</p></div>' % story
            + '<div class="mk-todo"><b>What to do</b><ol>' + ''.join('<li>%s</li>' % x for x in steps) + '</ol></div>')

def act(id, color, icon, title, sub, body, cls='bl-slate', extra=''):
    return ('<div class="activity %s" id="%s"%s><div class="activity-head"><div class="activity-num" style="background:%s;">%s</div><div><div class="activity-title">%s</div>'
            '<div class="activity-sub">%s</div></div></div><div class="activity-body">%s</div></div>') % (cls, id, extra, color, icon, title, sub, body)

def F(n, d):
    return '<span class="frac"><span class="num">%s</span><span class="den">%s</span></span>' % (n, d)

# ── header: pixel town strip, clean top
ins_before('<div class="quote-strip">', '<div class="pq-town-strip" aria-hidden="true"></div>')
for mk in ['<div class="quote-strip">', '<div class="standards-toggle-bar"', '<div class="info-strip">', '<div class="explorer-strip">', '<div class="need-strip">']:
    replace_block(mk, '')
m = re.search(r'<div class="intro-2col">', s); i = m.start(); j = block_end(s, i); intro = s[i:j]
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-head-title">).*?(</div>)', r'\1A lantern ribbon is ' + F(5, 6) + r' of a foot long. How many inches is that?\2', intro, count=1, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-body">).*?(</div></div><div class="intro-card theme-objectives">)',
  r'\1<p class="pq-eq-note">A fraction of a unit is part of one whole unit, like part of one foot. You will find two ways to measure it in small units, and a way to go backward. You will prove the answer by the end of the lesson.</p>\2', intro, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-objectives">.*?<div class="intro-card-body">).*$',
  r'\1<div class="obj-line"><span class="obj-icon">✂️</span><span><strong>Find a fraction of a unit</strong> in small units: cut the unit into equal parts and take some, or multiply.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">🔁</span><span><strong>Write small units as a fraction of the big unit</strong>: the part over the whole, in the same unit.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">✨</span><span><strong>Simplify the fraction</strong> by making bigger equal parts.</span></div></div></div></div>', intro, flags=re.S)
s = s[:i] + '<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>' + intro + '</details>' + s[j:]

# ── A. Think video + the market board
replace_block('<div class="video-placeholder-wrap">\n<!-- slot: g4math-10-06 -->', video('think') + '\n<div class="mk-board-mount"></div>')

# ── B. the timed all-operations check → an untimed fact warm-up: one equal part of 12, 16, 60, 100 and 1,000
FACTS = [('12 ÷ 3', '4'), ('12 ÷ 6', '2'), ('16 ÷ 8', '2'), ('16 ÷ 4', '4'), ('60 ÷ 6', '10'),
         ('60 ÷ 10', '6'), ('60 ÷ 5', '12'), ('100 ÷ 5', '20'), ('100 ÷ 10', '10'), ('1,000 ÷ 10', '100')]
i = s.index('<div class="fluency-grid" id="fluencyGrid">'); j = block_end(s, i)
s = s[:i] + '<div class="fluency-grid" id="fluencyGrid">' + ''.join(
    '<div class="fluency-item"><span class="fluency-q">%s =</span><input autocomplete="off" class="fluency-input" data-answer="%s" inputmode="numeric" type="text" aria-label="%s"/></div>\n' % (q, a, q)
    for q, a in FACTS) + '</div>' + s[j:]
rep('<div class="fluency-box" data-timed="true">', '<div class="fluency-box">')
replace_block('<div class="fluency-timer-ui">', '')
rep('<button class="fluency-check-btn" disabled="" id="fluencyCheckBtn"', '<button class="fluency-check-btn" id="fluencyCheckBtn"')
rep('var FLUENCY_TIMED = true;', 'var FLUENCY_TIMED = false;')
for a, b in [('<div class="fluency-head-icon">⏳</div>', '<div class="fluency-head-icon">✂️</div>'),
             ('<div class="fluency-head-label">TIMED FLUENCY CHECK</div><div class="fluency-head-title">Mixed All-Operations — One-Minute Check</div>', '<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">One Equal Part</div>'),
             ('Unit check — Quarter 4 timed fluency. Click Start, then answer as many as you can in 60 seconds. Answers lock in automatically when time is up.', 'Each fact cuts a unit into equal parts: 12 inches, 16 ounces, 60 minutes, 100 centimeters or 1,000 milliliters. Type the size of one part, then check.'),
             ('data-label="Fluency Warm-Up (Mixed All-Operations — One-Minute Check)"', 'data-label="Fact Warm-Up (One Equal Part)"')]:
    rep(a, b)
s = re.sub(r'var FLUENCY_TITLE = "Mixed All-Operations — One-Minute Check";', 'var FLUENCY_TITLE = "One Equal Part";', s)

# ── C. the old Math Crew card leaves the Warm-Up; the new one (two ways for the Think problem) goes on Learn
i = s.index('<div class="activity bl-violet"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div>'); j = block_end(s, i); s = s[:i] + s[j:]
CREW = ('<div class="activity bl-violet" id="mk-crew"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div><div><div class="activity-title">The Math Crew: Two Ways</div>'
 '<div class="activity-sub">How many inches is a ribbon ' + F(5, 6) + ' of a foot long?</div></div></div><div class="activity-body">'
 '<p>The Crew found the answer two different ways. Walk to each of them in the game above to hear their way, or read it here. Which way would you pick?</p>'
 '<div class="bubble-row">'
 '<div class="bubble atlas"><div class="bubble-avatar">A</div><div class="bubble-body"><div class="bubble-name">Atlas: multiply</div><div class="bubble-text">"A foot is 12 inches, so I multiply the fraction by 12. ' + F(5, 6) + ' × 12: first 5 × 12 = 60, then 60 ÷ 6 = 10. The ribbon is 10 inches."</div></div></div>'
 '<div class="bubble felix"><div class="bubble-avatar">F</div><div class="bubble-body"><div class="bubble-name">Felix: cut the foot</div><div class="bubble-text">"Sixths means 6 equal parts. I cut 12 inches into 6 equal parts: 2 inches each. Then I take 5 parts. 5 × 2 = 10 inches. Same answer!"</div></div></div>'
 '</div><div class="bubble-row">'
 '<div class="bubble hazel"><div class="bubble-avatar">H</div><div class="bubble-body"><div class="bubble-name">Hazel: picture the ruler</div><div class="bubble-text">"I picture a foot ruler with its 12 inch marks. Cut into 6 equal pieces, every piece is 2 inches. Five pieces reach 10 inches, just 2 short of the end."</div></div></div>'
 '<div class="bubble cora"><div class="bubble-avatar">C</div><div class="bubble-body"><div class="bubble-name">Cora: same unit</div><div class="bubble-text">"Going backward, from inches to a fraction of a foot, the part and the whole must be in the same unit. 10 inches out of a foot is 10 out of 12 inches, never 10 out of 1."</div></div></div>'
 '</div><div class="callout callout-tip" style="margin-top:8px;"><span class="callout-icon">💡</span><p>Crew rule: <em>Picture the whole unit (Hazel). Pick a way: cut into equal parts and take some, or multiply the fraction by the small units (Felix, Atlas). Going backward, same unit on top and bottom (Cora).</em></p></div>'
 '<div class="journal-label">✏️ Which Crew way is most like yours? Which way would you use for ' + F(7, 8) + ' of a pound, and why? <span class="saved-dot" id="dot-compare"></span></div>'
 '<textarea class="journal-box" data-label="Learn — My way and the Crew\'s ways" id="journal-compare" oninput="autoSave(this,\'dot-compare\')" placeholder=""></textarea></div></div>')

# ── D. the old "What Fraction Equals?" pick warm-up → Job 1 Cut the Foot (Ribbon Cutter) + the sort window + Mental Math
replace_block('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🔎</div>',
 act('mk-cut', '#F5C518;color:#0E1C42', '✂️', 'Warm-Up: Cut the Foot', 'Job 1 · A fraction of a foot, in inches',
   job('Tonight the night market hangs its lanterns, and lantern-keeper Ivy cuts a ribbon for each one. Her tags say things like <strong>' + F(1, 3) + ' ft</strong>, but her ruler only shows inches. A fraction of a unit is part of one whole unit, so <strong>' + F(1, 3) + ' ft is part of one foot: part of 12 inches</strong>. <strong>How many inches is ' + F(1, 3) + ' ft? How many is ' + F(1, 2) + ' ft?</strong>',
       ['Round 1: the bottom number of the fraction says how many equal parts. Tap <em>Cut into 3</em>. Each part shows its inches.',
        'The top number says how many parts to take. Tap 1 part. Type its inches.',
        'Round 2: do the same for ' + F(1, 2) + ' ft: cut into 2 equal parts, take 1, type the inches.'])
   + tip('hazel', 'A fraction of a foot is a piece of a foot ruler. Cut the ruler into equal parts and look at one piece.') + model('cut')
   , cls='bl-yellow')
 + slot('sort')
 + '<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🧠</div><div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, four quick problems</div></div></div><div class="activity-body">'
 + tip('felix', 'One sixth means one of 6 equal groups. Think: 6 times what makes the number?') + model('mental') + '</div></div>')

# ── E. Think About It → Ivy's ribbon: 5/6 ft in inches, any method, no teaching yet
i = s.index('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🤔</div>'); j = block_end(s, i)
s = s[:i] + act('mk-think', '#F5C518;color:#0E1C42', '🤔', 'Think About It: Ivy\'s Lantern Ribbons', 'Try it your way first',
  '<div class="callout callout-think"><span class="callout-icon">🏮</span><p>Every lantern on the big string hangs from a ribbon <strong>' + F(5, 6) + ' ft</strong> long. Ivy\'s ruler shows inches. <strong>How many inches long is each ribbon?</strong></p></div>'
  + '<div class="journal-label">👀 What do you notice about the tag ' + F(5, 6) + ' ft? What do you wonder? <span class="saved-dot" id="dot-notice"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — I notice, I wonder" id="journal-notice" oninput="autoSave(this,\'dot-notice\')" placeholder="I notice… I wonder…"></textarea>'
  + tip('atlas', 'The tag is a fraction of ONE foot, and a foot is 12 inches. Try it any way you like.')
  + model('think')
  + '<div class="journal-label">✏️ How did you find the inches? Tell your steps. <span class="saved-dot" id="dot-think"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — Think: Ivy\'s ribbon" id="journal-think" oninput="autoSave(this,\'dot-think\')" placeholder=""></textarea>',
  cls='bl-yellow') + s[j:]
rep('Now slice a unit into the fraction you want.', 'Next: on the Learn tab, the Math Crew shows two ways, and you cut the lantern ribbons.')

# ── F. Learn: drop the flip cards, the "SPLIT the bar" line and the old Fraction Mat; video, the Crew, Jobs 2–3
i = s.index('<div aria-label="Daily vocabulary flash cards" class="vocab-section">'); j = block_end(s, i); s = s[:i] + s[j:]
i = s.index('<div class="callout callout-think" style="margin-bottom:14px;"><span class="callout-icon">🧠</span><p><strong>Try before the rule:</strong>')
j = block_end(s, i); k = s.index('<div class="activity bl-slate">', j); kend = block_end(s, k)
assert 'Fraction-of-a-Unit Mat' in s[k:kend]
s = s[:i] + (video('learn') + slot('crew') + CREW
 + act('mk-ribbons', '#C56C3F', '🎀', 'Ribbons for the Lanterns: ' + F(5, 6) + ' ft and ' + F(7, 12) + ' ft', 'Job 2 · A fraction of a foot, two ways',
   job('Ivy has two sizes of lantern ribbon to cut: <strong>' + F(5, 6) + ' ft</strong> for the big lanterns and <strong>' + F(7, 12) + ' ft</strong> for the long ones. Her ruler only shows inches. <strong>How many inches is each ribbon?</strong>',
       ['Round 1: Felix\'s way. Tap <em>Cut into 6</em>, read the inches on one part, then take 5 parts. Type the inches. Check it Atlas\'s way on paper: 5 × 12, then ÷ 6.',
        'Round 2: ' + F(7, 12) + ' ft. Pick either way, then type the inches.',
        'Say which way felt faster to you. Both are right.'])
   + tip('felix', 'Cut first, then take. The bottom number tells how many equal parts; the top number tells how many to take.') + model('ribbons'))
 + slot('build')
 + act('mk-orders', '#3A6B9A', '📝', 'Ivy\'s Order List: tea, time, oil and wick', 'Job 3 · A fraction of a pound, an hour, a liter and a meter',
   job('Ivy\'s order list is all fractions: <strong>' + F(3, 8) + ' lb</strong> of tea, <strong>' + F(5, 6) + ' h</strong> to light the lanterns, <strong>' + F(3, 10) + ' L</strong> of oil for each big lantern and <strong>' + F(2, 5) + ' m</strong> of wick string. The sellers measure in ounces, minutes, milliliters and centimeters. <strong>How much is each order in small units?</strong>',
       ['Each round is a different whole: 16 ounces, 60 minutes, 1,000 milliliters or 100 centimeters.',
        'Cut the whole into the equal parts the bottom number says. Read one part.',
        'Take the parts the top number says. Type the amount, one round at a time.'])
   + tip('cora', 'Watch the whole! A pound is 16 ounces and an hour is 60 minutes. The fraction stays the same, but the small units change.') + model('orders'), cls='bl-slate', extra=' style="margin-top:16px;"')
 + slot('deliver')) + s[kend:]

# ── G. "The Two Rules" → Ivy's Fraction Board, then the Do video
BOARDSVG = ('<svg viewBox="0 0 640 250" class="mk-svg" role="img" aria-label="Ivy\'s fraction board. One foot, 12 inches, cut into 6 equal parts of 2 inches, with 5 parts taken: five sixths of a foot is 10 inches. Going forward: cut into equal parts and take some, or multiply the fraction by the small units. Going backward: write the part over the whole in the same unit, then simplify.">'
 '<rect width="640" height="250" rx="12" fill="#FFF8EF"/>'
 '<text x="20" y="26" font-family="DotGothic16,Nunito" font-size="16" fill="#3B2417">Ivy\'s fraction board: one foot = 12 inches</text>'
 + ''.join('<rect x="%d" y="40" width="98" height="40" fill="%s" stroke="#3B2417" stroke-width="3"/><text x="%d" y="66" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="%s">2 in</text>' % (20 + k * 100, '#6B3FA0' if k < 5 else '#FFF3DE', 69 + k * 100, '#fff' if k < 5 else '#3B2417') for k in range(6))
 + '<text x="320" y="104" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#3B2417">6 equal parts of 2 in · 5 taken = 10 in</text>'
 '<rect x="20" y="122" width="290" height="110" rx="10" fill="#FFFFFF" stroke="#F5D4BC" stroke-width="2"/>'
 '<text x="34" y="146" font-family="Nunito" font-weight="900" font-size="15" fill="#C56C3F">Forward: a fraction of a unit → small units</text>'
 '<text x="34" y="170" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">Cut the small units into equal parts</text>'
 '<text x="34" y="190" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">(the bottom number), take some (the top).</text>'
 '<text x="34" y="216" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">Or multiply the fraction by the small units.</text>'
 '<rect x="330" y="122" width="290" height="110" rx="10" fill="#FFFFFF" stroke="#F5D4BC" stroke-width="2"/>'
 '<text x="344" y="146" font-family="Nunito" font-weight="900" font-size="15" fill="#3A6B9A">Backward: small units → a fraction</text>'
 '<text x="344" y="170" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">Write the part over the whole,</text>'
 '<text x="344" y="190" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">both in the SAME small unit (10 out of 12).</text>'
 '<text x="344" y="216" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">Then make bigger equal parts to simplify.</text></svg>')
replace_block('<div class="key-concept" style="margin-top:16px;"><div class="key-concept-label">📐 The Two Rules',
 '<div class="key-concept" id="mk-board-kc" style="margin-top:16px;"><div class="key-concept-label">📐 Ivy\'s Fraction Board</div>' + BOARDSVG
 + '<p><strong>The wholes:</strong> 1 ft = 12 in · 1 lb = 16 oz · 1 h = 60 min · 1 m = 100 cm · 1 L = 1,000 mL.</p>'
 + tip('cora', 'A fraction of a foot compares inches to inches. 5 inches of a foot is 5 out of 12, never 5 out of 1.') + '</div><div class="pq-vslot" data-slot="do"></div><!--WE-->')

# ── H. Picture It (it solved IP 2c) goes; Study It (backward, two ways) + Jobs 4–5 + the One Picture
i = s.index('<div class="activity bl-violet" style="margin-top:16px;"><div class="activity-head">'); j = block_end(s, i)
assert 'Picture It' in s[i:j]
s = s[:i] + s[j:]
i = s.index('<div class="activity bl-slate"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Worked Example:'); j = block_end(s, i)
WE = ('<div class="activity bl-slate" id="mk-worked"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Study It: How Ivy Labeled the Tea</div><div class="activity-sub">Already solved for you. Read it, then label the scraps yourself.</div></div></div><div class="activity-body">'
 '<p style="margin:0 0 10px;font-weight:700;color:#3A4A6B;">👀 Nothing to type here. This problem is solved two ways. Both ways get the same answer. Read the one that makes more sense to you.</p>'
 '<div class="task-box"><div class="task-label">Problem</div><p>The tea seller weighs a bag: <strong>14 ounces</strong>. Ivy\'s tags are written as a fraction of a pound. What should the tag say, in simplest form?</p></div>'
 + tip('cora', 'Part over whole, in the same unit. The whole is 1 pound, but written in ounces: 16 ounces.') +
 '<div class="we-two"><div class="we-way"><h5>Way 1: bigger equal parts</h5><ol><li>Write the part over the whole in ounces: 14 ounces out of 16 is ' + F(14, 16) + ' lb.</li><li>Make bigger equal parts of 2 ounces. 16 ounces is 8 parts, and 14 ounces is 7 of them.</li><li>The tag should say <b>' + F(7, 8) + ' lb</b>.</li></ol></div>'
 '<div class="we-way"><h5>Way 2: divide top and bottom</h5><ol><li>14 ounces out of 16 is ' + F(14, 16) + ' lb.</li><li>Divide the top and the bottom by the same number, 2: 14 ÷ 2 = 7 and 16 ÷ 2 = 8.</li><li>The tag should say <b>' + F(7, 8) + ' lb</b>.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Check it: go forward again. ' + F(7, 8) + ' of 16 ounces: 16 cut into 8 equal parts is 2 ounces each, and 7 × 2 = 14 ounces, the bag. ✓</p>')
BIG = ('To find a fraction of a unit, cut the unit\'s small units into equal parts: the bottom number says how many. Then take as many parts as the top number says. '
       'Or multiply the fraction by the number of small units. Both ways give the same answer. To go backward, write the small units you have over the small units in the whole, '
       'the same unit on top and bottom, then make bigger equal parts to simplify.')
PIC = ('<svg viewBox="0 0 600 236" class="mk-svg" role="img" aria-label="One foot cut into 6 equal parts of 2 inches, 5 parts taken: five sixths of a foot is 10 inches, and 10 inches is ten twelfths, or five sixths, of a foot. Example: three tenths of an hour is 60 minutes cut into 10 parts of 6 minutes, 3 parts taken, 18 minutes.">'
 '<rect width="600" height="236" rx="12" fill="#FFF8EF"/>'
 + ''.join('<rect x="%d" y="24" width="92" height="38" fill="%s" stroke="#3B2417" stroke-width="3"/><text x="%d" y="49" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="%s">2 in</text>' % (20 + k * 94, '#6B3FA0' if k < 5 else '#FFF3DE', 66 + k * 94, '#fff' if k < 5 else '#3B2417') for k in range(6))
 + '<text x="300" y="86" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#C56C3F">Forward: 1 ft cut into 6 equal parts → 2 in each → take 5 → 10 in</text>'
 '<text x="300" y="112" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#3A6B9A">Backward: 10 in out of 12 in → 10 over 12 → bigger parts → 5 over 6</text>'
 '<text x="300" y="156" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#3B2417">Try: three tenths of an hour. 60 ÷ 10 = 6 min a part. 3 × 6 = 18 min.</text>'
 '<text x="300" y="180" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#3A6B9A">Or: 3 × 60 = 180, and 180 ÷ 10 = 18 min. Both ways, 18 minutes.</text>'
 '<text x="300" y="214" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">Back up: 18 min of an hour is 18 over 60. Parts of 6 min: 3 of 10. Three tenths.</text></svg>')
ONEPIC = ('<div class="key-concept pq-onepic" id="mk-onepic" style="margin-top:14px;"><div class="key-concept-label">🏮 The Whole Lesson in One Picture</div>'
 '<p class="op-big"><strong>' + BIG + '</strong></p>' + PIC
 + '<div class="journal-label">✏️ Put the big idea in your own words. Use an example of your own. <span class="saved-dot" id="dot-big"></span></div>'
 '<textarea class="journal-box" data-label="Learn — The big idea in my own words" id="journal-big" oninput="autoSave(this,\'dot-big\')" placeholder=""></textarea></div>')
s = s[:i] + ONEPIC + s[j:]
SCRAPS = act('mk-scraps', '#6B3FA0', '🏷️', 'Label the Scraps: 4 in, 6 oz, 10 min', 'Job 4 · Backward: small units to a fraction of the unit',
  job('Ivy saves every leftover. A ribbon scrap is <strong>4 inches</strong>, a tea bag holds <strong>6 ounces</strong>, and lighting the small lanterns took <strong>10 minutes</strong>. She labels each one as a fraction of its big unit, in simplest form. <strong>What should the three labels say?</strong>',
      ['Shade the small units on the strip: tap or drag across the marks.',
       'Write the part over the whole, both in the same small unit. Check it.',
       'Make bigger equal parts with the <em>Parts of</em> buttons until the shaded part fills whole parts. Write the simplest form.'])
  + tip('cora', 'Same unit on top and bottom! 4 inches of a foot is 4 out of 12 inches, not 4 out of 1 foot.')
  + model('scraps'), cls='bl-violet', extra=' style="margin-top:16px;"')
HALVE = act('mk-halve', '#C56C3F', '✂️', 'Halve the Ribbon: a 10-inch ribbon, cut in half', 'Job 5 · A word problem: fraction, halve, fraction again',
  job('Ivy\'s last ribbon is <strong>10 inches</strong> long. She writes its tag as a fraction of a foot. Then she cuts the ribbon exactly in half for two small lanterns. <strong>What fraction of a foot is the whole ribbon? What fraction of a foot is each half?</strong>',
      ['Write 10 inches as a fraction of a foot, in simplest form.',
       'Tap each fact in the story, then tap the part of the bar it tells about. Find half of the ribbon in inches.',
       'Write the half as a fraction of a foot.'])
  + tip('hazel', 'Picture the ribbon as one bar cut into 2 equal parts. Half the inches, then ask: how many of those pieces fit in a foot?')
  + model('halve'), cls='bl-slate', extra=' style="margin-top:16px;"')
s = s.replace('<!--WE-->', WE + '</div></div>' + SCRAPS + HALVE, 1)
rep('You sliced and simplified. Now practice both directions.', 'Five lantern jobs down. One to go: fix the Smudge\'s tag.')

# ── I. Show What You Know
for a, b in [('<div class="activity-sub">For each problem, find the fraction of a unit (or express a measurement as a fraction).</div>', '<div class="activity-sub">Type each answer in its own box.</div>'),
             ('<div class="callout callout-think"><span class="callout-icon">🧠</span><p><strong>Before each problem, ask:</strong> What is the whole unit being measured, and what fraction of it does the measurement show?</p></div>', '<p>Show your thinking on paper if it helps, then type each answer. For a fraction, type the top number in the top box and the bottom number in the bottom box.</p>')]:
    rep(a, b)
def fbox(bid, aria, unit):
    return '<span class="ok-frac ok-frac-in">' + box(bid + '1', aria + ', top number') + '<i></i>' + box(bid + '2', aria + ', bottom number') + '</span> ' + unit
SW = ('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>A fraction of a unit, in small units.</strong> <span class="saved-dot" id="dot-1"></span></p><div class="ans-parts">'
 + part('Problem 1 (a)', '(a) ' + F(11, 12) + ' ft = ' + box('1a', 'Problem 1 a, inches', 'in'))
 + part('Problem 1 (b)', '(b) ' + F(7, 16) + ' lb = ' + box('1b', 'Problem 1 b, ounces', 'oz'))
 + part('Problem 1 (c)', '(c) ' + F(7, 12) + ' h = ' + box('1c', 'Problem 1 c, minutes', 'min'))
 + part('Problem 1 (d)', '(d) ' + F(9, 10) + ' m = ' + box('1d', 'Problem 1 d, centimeters', 'cm')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">2</span><strong>Backward: write each amount as a fraction of the big unit, in simplest form.</strong> <span class="saved-dot" id="dot-2"></span></p><div class="ans-parts">'
 + part('Problem 2 (a)', '(a) 500 mL = ' + fbox('2a', 'Problem 2 a, fraction of a liter', 'L'))
 + part('Problem 2 (b)', '(b) 25 cm = ' + fbox('2b', 'Problem 2 b, fraction of a meter', 'm'))
 + part('Problem 2 (c)', '(c) 30 min = ' + fbox('2c', 'Problem 2 c, fraction of an hour', 'h')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">3</span><strong>Word problem: the tea sample.</strong> The tea seller gives Ivy a sample bag that holds 2 ounces. She pours exactly half into a second bag. <span class="saved-dot" id="dot-3"></span></p><div class="ans-parts">'
 + part('Problem 3 (a)', '(a) The whole sample is ' + fbox('3a', 'Problem 3 a, fraction of a pound', 'lb'))
 + part('Problem 3 (b)', '(b) Each half is ' + fbox('3b', 'Problem 3 b, fraction of a pound', 'lb')) + '</div></div>')
i = s.find('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Forward: fraction × factor.</strong>'); j = s.find('<div class="activity bl-slate" style="margin-top:18px;border-left-color:#0E8A8C;">', i); assert i > 0 and j > i
s = s[:i] + tip('opti', 'Hoo! Before each problem, ask: am I going from a fraction to small units (cut and take, or multiply), or from small units back to a fraction (part over whole, same unit, then simplify)?') + SW + model('bonus') + (
 '<div class="activity bl-violet" id="mk-prove"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">🏷️</div><div><div class="activity-title">Last Job: Can a tag say ' + F(5, 1) + ' ft?</div><div class="activity-sub">Job 6 · Fix the Smudge\'s tag</div></div></div><div class="activity-body">'
 + job('The Smudge scribbled a new tag on the last lantern ribbon: <strong>' + F(5, 1) + ' ft</strong>. Ivy measures the ribbon: it is <strong>5 inches</strong> long. Cora says a fraction of a foot is never written that way. <strong>What should the tag say?</strong>',
      ['Shade the 5 inches on the foot strip.',
       'Write the part over the whole. Both numbers must be in inches.',
       'Check whether bigger equal parts fit. If none do, the fraction is already in simplest form.'])
 + tip('cora', 'The Smudge put 5 inches on top and 1 foot on the bottom. Two different units in one fraction! Write the whole foot in inches.') + model('prove') + '</div></div>' + slot('factory') + video('wrap')) + s[j:]
ins_before('<div class="gathered-box">', tip('cora', 'Check every answer for a unit. "10" is missing its unit. "10 in" is clear. A fraction gets its unit too: ' + F(5, 6) + ' ft.'))

# ── J. small text fixes (What's Next, checklist)
for a, b in [('<div class="activity-title">Connection Forward: Fractions and Measurement</div><div class="activity-sub">What comes next in Unit 11</div>', '<div class="activity-title">What\'s Next</div><div class="activity-sub">Coming up in Unit 10</div>'),
             ('Next unit, we measure SPACE instead of length alone — finding the area and perimeter of rectangles and composite figures.',
              'Next lesson, the farmers\' market, and the Brick Golem: a length like 2 and a half feet becomes feet and inches, or all inches.'),
             ('<span>I completed both quick checks above.</span>', '<span>I finished all six lantern jobs.</span>'),
             ('<span>I showed my model or my steps for each problem.</span>', '<span>I typed an answer in every box.</span>')]:
    rep(a, b)
answer_boxes_save()
