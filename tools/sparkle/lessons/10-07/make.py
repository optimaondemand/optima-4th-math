# Lesson 4.10.07 · Fractions and Measurement, Part 2 · Level 10 "Metric Market", the Farmers' Market (lesson 7 of 7, the boss)
# Dimensions 4B Chapter 10 Lesson 8 + the IP (2 Nov 2026): a mixed number of a unit split into whole units + a fraction of a
# unit. "What needs converting, the fraction or the whole number?" For two units only the fraction changes; for all small
# units both pieces change. Backward: count whole units, leftover over the factor, simplify. Two-unit form ↔ mixed number,
# and a word problem that changes, adds, regroups and simplifies in lb oz. One hands-on Mixed-Number Splitter job per IP
# section, new numbers (every IP and summative result avoided, see notes.md). Ends with the Brick Golem boss fight.
# Run with: python3 tools/sparkle/build_lesson.py 10-07   (never run this file directly)
import re

def job(story, steps):
    return ('<div class="task-box"><div class="task-label">Your job</div><p>%s</p></div>' % story
            + '<div class="mk-todo"><b>What to do</b><ol>' + ''.join('<li>%s</li>' % x for x in steps) + '</ol></div>')

def act(id, color, icon, title, sub, body, cls='bl-slate', extra=''):
    return ('<div class="activity %s" id="%s"%s><div class="activity-head"><div class="activity-num" style="background:%s;">%s</div><div><div class="activity-title">%s</div>'
            '<div class="activity-sub">%s</div></div></div><div class="activity-body">%s</div></div>') % (cls, id, extra, color, icon, title, sub, body)

def F(n, d):
    return '<span class="frac"><span class="num">%s</span><span class="den">%s</span></span>' % (n, d)

def MX(w, n, d):
    return '%s %s' % (w, F(n, d))

# ── header: pixel town strip, clean top
ins_before('<div class="quote-strip">', '<div class="pq-town-strip" aria-hidden="true"></div>')
for mk in ['<div class="quote-strip">', '<div class="standards-toggle-bar"', '<div class="info-strip">', '<div class="explorer-strip">', '<div class="need-strip">']:
    replace_block(mk, '')
m = re.search(r'<div class="intro-2col">', s); i = m.start(); j = block_end(s, i); intro = s[i:j]
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-head-title">).*?(</div>)', r'\1A scarecrow is ' + MX(2, 5, 6).replace('\\', '\\\\') + r' feet tall. How do you write that in feet and inches, or all in inches?\2', intro, count=1, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-body">).*?(</div></div><div class="intro-card theme-objectives">)',
  r'\1<p class="pq-eq-note">A mixed number of a unit has two pieces: whole units and a fraction of a unit. You will learn which piece to change, and how to go backward. You will prove the answer by the end of the lesson.</p>\2', intro, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-objectives">.*?<div class="intro-card-body">).*$',
  r'\1<div class="obj-line"><span class="obj-icon">✂️</span><span><strong>Split a mixed number of a unit</strong> into whole units and a fraction of a unit, and change each piece.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">🔁</span><span><strong>Go backward</strong>: count the whole units, put the leftover over the small units in one whole unit, and simplify.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">⚖️</span><span><strong>Add two weights</strong>, regroup the ounces, and write the total as a mixed number.</span></div></div></div></div>', intro, flags=re.S)
s = s[:i] + '<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>' + intro + '</details>' + s[j:]

# ── A. Think video + the market board (the old welcome video placeholder goes)
replace_block('<div class="video-placeholder-wrap">\n<!-- slot: g4math-10-07 -->', video('think') + '\n<div class="mk-board-mount"></div>')

# ── B. the timed fraction-facts check (IP and summative facts) → an untimed fact warm-up: whole units × the factor, one equal part
FACTS = [('4 × 12', '48'), ('5 × 12', '60'), ('4 × 16', '64'), ('5 × 60', '300'), ('12 ÷ 6', '2'),
         ('12 ÷ 12', '1'), ('16 ÷ 8', '2'), ('16 ÷ 16', '1'), ('60 ÷ 10', '6'), ('60 ÷ 12', '5')]
i = s.index('<div class="fluency-grid" id="fluencyGrid">'); j = block_end(s, i)
s = s[:i] + '<div class="fluency-grid" id="fluencyGrid">' + ''.join(
    '<div class="fluency-item"><span class="fluency-q">%s =</span><input autocomplete="off" class="fluency-input" data-answer="%s" inputmode="numeric" type="text" aria-label="%s"/></div>\n' % (q, a, q)
    for q, a in FACTS) + '</div>' + s[j:]
rep('<div class="fluency-box" data-timed="true">', '<div class="fluency-box">')
replace_block('<div class="fluency-timer-ui">', '')
rep('<button class="fluency-check-btn" disabled="" id="fluencyCheckBtn"', '<button class="fluency-check-btn" id="fluencyCheckBtn"')
rep("  var timeStr = ' in ' + (60 - fluencySecondsLeft) + ' seconds';", "  var timeStr = '';")
for a, b in [('<div class="fluency-head-icon">⏳</div>', '<div class="fluency-head-icon">🧺</div>'),
             ('<div class="fluency-head-label">TIMED FLUENCY CHECK</div><div class="fluency-head-title">Fraction of a Unit — One-Minute Check</div>', '<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">Whole Units and Equal Parts</div>'),
             ('Unit 10 fluency. Click Start, then answer as many as you can in 60 seconds. Every answer is a whole number.', 'The first four change whole units (12 inches in a foot, 16 ounces in a pound, 60 minutes in an hour). The rest find the size of one equal part. Type each answer, then check.'),
             ('data-label="Fluency Warm-Up (Fraction of a Unit — One-Minute Check)"', 'data-label="Fact Warm-Up (Whole Units and Equal Parts)"')]:
    rep(a, b)
rep('var FLUENCY_TITLE = "Fraction of a Unit — One-Minute Check";', 'var FLUENCY_TITLE = "Whole Units and Equal Parts";')

# ── C. the old Math Crew, Readiness Check and Think (pumpkin, multiple choice) → Job 1, the find window, Mental Math, the Think
i = s.index('<div class="activity bl-violet"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div>')
j = s.index('<div class="tab-next-wrap">', i)
WARM = (act('mk-pieces', '#F5C518;color:#0E1C42', '🧺', 'Warm-Up: Two Pieces', 'Job 1 · Whole units, then a fraction of a unit',
   job('Dawn at the farmers\' market. Goldie, who keeps the market, writes her tags as a mixed number: a whole number and a fraction together, like <strong>' + MX(4, 1, 6) + ' ft</strong>. That tag has two pieces: <strong>4 whole feet</strong> and <strong>' + F(1, 6) + ' of one more foot</strong>. Today, change each piece on its own. <strong>How many small units is each piece?</strong>',
       ['Tap <em>+ 1 whole</em> until the blue bars match the whole number.',
        'Cut one more bar into the equal parts the bottom number says. Take the parts the top number says.',
        'Type the whole units in small units, then the fraction part. Do all three rounds: feet, pounds and hours.'])
   + tip('hazel', 'Each blue bar is one whole unit. The last bar is the fraction part: only some of it is taken.') + model('pieces'), cls='bl-yellow')
 + slot('find')
 + '<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🧠</div><div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, four quick problems</div></div></div><div class="activity-body">'
 + tip('felix', 'Tenths means 10 equal groups. Think: 10 times what makes the number? Do the same for sixths, twelfths and eighths.') + model('mental') + '</div></div>'
 + act('mk-think', '#F5C518;color:#0E1C42', '🤔', 'Think About It: Goldie\'s Scarecrow', 'Try it your way first',
  '<div class="callout callout-think"><span class="callout-icon">🎃</span><p>Goldie\'s scarecrow is <strong>' + MX(2, 5, 6) + ' ft</strong> tall. Her measuring tape shows feet and inches. <strong>How tall is the scarecrow?</strong> Write it any way you like.</p></div>'
  + '<div class="journal-label">👀 What do you notice about the tag ' + MX(2, 5, 6) + ' ft? What do you wonder? <span class="saved-dot" id="dot-notice"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — I notice, I wonder" id="journal-notice" oninput="autoSave(this,\'dot-notice\')" placeholder="I notice… I wonder…"></textarea>'
  + tip('atlas', 'The tag has two pieces, just like your Two Pieces job. Try it any way you like.')
  + model('think')
  + '<div class="journal-label">✏️ How did you find the height? Tell your steps. <span class="saved-dot" id="dot-think"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — Think: Goldie\'s scarecrow" id="journal-think" oninput="autoSave(this,\'dot-think\')" placeholder=""></textarea>',
  cls='bl-yellow'))
s = s[:i] + WARM + s[j:]
rep('Keep your prediction. You’ll build the pumpkin next.', 'Next: on the Learn tab, the Math Crew writes the scarecrow two ways, and you measure the market.')

# ── D. Learn: everything from the flip cards to the last Socratic question is rebuilt
CREW = ('<div class="activity bl-violet" id="mk-crew"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div><div><div class="activity-title">The Math Crew: Two Ways</div>'
 '<div class="activity-sub">How tall is a scarecrow ' + MX(2, 5, 6) + ' ft tall?</div></div></div><div class="activity-body">'
 '<p>The Crew wrote the height two different ways. Walk to each of them in the game above to hear their way, or read it here. Which way would you pick?</p>'
 '<div class="bubble-row">'
 '<div class="bubble atlas"><div class="bubble-avatar">A</div><div class="bubble-body"><div class="bubble-name">Atlas: change just the fraction</div><div class="bubble-text">"The 2 whole feet stay. Only the fraction part changes: ' + F(5, 6) + ' of a foot is 10 inches. So the scarecrow is 2 ft 10 in."</div></div></div>'
 '<div class="bubble felix"><div class="bubble-avatar">F</div><div class="bubble-body"><div class="bubble-name">Felix: change it all to inches</div><div class="bubble-text">"2 feet is 2 × 12 = 24 inches. ' + F(5, 6) + ' of a foot is 10 inches. 24 + 10 = 34 inches. Same height, one unit!"</div></div></div>'
 '</div><div class="bubble-row">'
 '<div class="bubble hazel"><div class="bubble-avatar">H</div><div class="bubble-body"><div class="bubble-name">Hazel: picture the bars</div><div class="bubble-text">"I picture two whole foot bars, 12 inches each, and one more bar cut into 6 equal parts with 5 of them shaded."</div></div></div>'
 '<div class="bubble cora"><div class="bubble-avatar">C</div><div class="bubble-body"><div class="bubble-name">Cora: ask first</div><div class="bubble-text">"Before I change anything, I ask: what needs changing, the fraction or the whole number? For feet and inches, just the fraction. For all inches, both pieces."</div></div></div>'
 '</div><div class="callout callout-tip" style="margin-top:8px;"><span class="callout-icon">💡</span><p>Crew rule: <em>Split it into whole units and a fraction of a unit (Hazel). Ask what needs changing (Cora). Two units: change just the fraction (Atlas). All small units: change both pieces and add (Felix).</em></p></div>'
 '<div class="journal-label">✏️ Which Crew way is most like yours? How would you write ' + MX(5, 1, 6) + ' ft, and why? <span class="saved-dot" id="dot-compare"></span></div>'
 '<textarea class="journal-box" data-label="Learn — My way and the Crew\'s ways" id="journal-compare" oninput="autoSave(this,\'dot-compare\')" placeholder=""></textarea></div></div>')
BOARDSVG = ('<svg viewBox="0 0 640 250" class="mk-svg" role="img" aria-label="Goldie\'s mixed number board. Two and five sixths feet split into 2 whole feet and five sixths of a foot. Two whole foot bars of 12 inches and one more bar cut into 6 parts of 2 inches with 5 shaded. Feet and inches: change just the fraction, 2 feet 10 inches. All inches: change both pieces, 24 plus 10 is 34 inches. Backward: count the whole units, put the leftover over the factor, simplify.">'
 '<rect width="640" height="250" rx="12" fill="#FFF8EF"/>'
 '<text x="20" y="26" font-family="DotGothic16,Nunito" font-size="16" fill="#3B2417">Goldie\'s board: 2 and five sixths ft = 2 ft + five sixths of a foot</text>'
 '<rect x="20" y="40" width="190" height="34" rx="5" fill="#1F8FB4" stroke="#3B2417" stroke-width="3"/><text x="115" y="63" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#fff">1 ft = 12 in</text>'
 '<rect x="220" y="40" width="190" height="34" rx="5" fill="#1F8FB4" stroke="#3B2417" stroke-width="3"/><text x="315" y="63" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#fff">1 ft = 12 in</text>'
 + ''.join('<rect x="%d" y="40" width="34" height="34" fill="%s" stroke="#3B2417" stroke-width="2.5"/>' % (420 + k * 33, '#6B3FA0' if k < 5 else '#FFF3DE') for k in range(6))
 + '<text x="519" y="92" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="13" fill="#3B2417">5 of 6 parts of 2 in</text>'
 '<rect x="20" y="104" width="190" height="130" rx="10" fill="#FFFFFF" stroke="#BCE3F2" stroke-width="2"/>'
 '<text x="32" y="128" font-family="Nunito" font-weight="900" font-size="15" fill="#1F8FB4">Two units (ft and in)</text>'
 '<text x="32" y="152" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">The whole feet stay.</text>'
 '<text x="32" y="174" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">Change just the fraction.</text>'
 '<text x="32" y="210" font-family="Nunito" font-weight="900" font-size="16" fill="#3B2417">2 ft 10 in</text>'
 '<rect x="225" y="104" width="190" height="130" rx="10" fill="#FFFFFF" stroke="#BDE8CF" stroke-width="2"/>'
 '<text x="237" y="128" font-family="Nunito" font-weight="900" font-size="15" fill="#1E8C5A">All small units (in)</text>'
 '<text x="237" y="152" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">Change both pieces,</text>'
 '<text x="237" y="174" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">then add them.</text>'
 '<text x="237" y="210" font-family="Nunito" font-weight="900" font-size="16" fill="#3B2417">24 in + 10 in = 34 in</text>'
 '<rect x="430" y="104" width="190" height="130" rx="10" fill="#FFFFFF" stroke="#F5D4BC" stroke-width="2"/>'
 '<text x="442" y="128" font-family="Nunito" font-weight="900" font-size="15" fill="#C96512">Backward</text>'
 '<text x="442" y="152" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">Count whole units: 12,</text>'
 '<text x="442" y="174" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">24, 36… The leftover</text>'
 '<text x="442" y="196" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">goes over 12 (or 16, 60).</text>'
 '<text x="442" y="218" font-family="Nunito" font-weight="800" font-size="14" fill="#3B2417">Then simplify.</text></svg>')
WE = ('<div class="activity bl-slate" id="mk-worked"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Study It: Goldie\'s Two Bags of Beans</div><div class="activity-sub">Already solved for you. Read it now; you will use it in the last job.</div></div></div><div class="activity-body">'
 '<p style="margin:0 0 10px;font-weight:700;color:#3A4A6B;">👀 Nothing to type here. This problem is solved two ways. Both ways get the same answer. Read the one that makes more sense to you.</p>'
 '<div class="task-box"><div class="task-label">Problem</div><p>Goldie has two bags of beans. One weighs <strong>' + MX(1, 15, 16) + ' lb</strong>. The other weighs <strong>1 lb 3 oz</strong>. How much do they weigh together? Write it in pounds and ounces, then as a mixed number in simplest form.</p></div>'
 + tip('cora', 'Change the mixed number first! You can\'t add ' + F(15, 16) + ' of a pound to 3 ounces until they are both ounces.') +
 '<div class="we-two"><div class="we-way"><h5>Way 1: pounds and ounces</h5><ol>'
 '<li>' + MX(1, 15, 16) + ' lb is 1 lb 15 oz. (' + F(15, 16) + ' of 16 oz is 15 oz)</li>'
 '<li>Add: 1 lb 15 oz + 1 lb 3 oz = 2 lb 18 oz.</li>'
 '<li>Regroup: 18 oz is 1 lb 2 oz. So it is 3 lb 2 oz.</li>'
 '<li>Simplify: 2 oz is ' + F(2, 16) + ' lb, which is ' + F(1, 8) + ' lb. The total is <b>' + MX(3, 1, 8) + ' lb</b>.</li></ol></div>'
 '<div class="we-way"><h5>Way 2: all ounces</h5><ol>'
 '<li>' + MX(1, 15, 16) + ' lb is 31 oz. (16 + 15)</li>'
 '<li>1 lb 3 oz is 19 oz. (16 + 3)</li>'
 '<li>Add: 31 oz + 19 oz = 50 oz.</li>'
 '<li>Count whole pounds: 16, 32, 48. That is 3 lb, with 2 oz left: 3 lb 2 oz = <b>' + MX(3, 1, 8) + ' lb</b>.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Check it: 18 ounces is more than a pound, so 16 of them become 1 more pound and 2 ounces are left. 3 lb is 48 oz, and 48 + 2 = 50 oz, the same as Way 2. ✓</p></div></div>')
BIG = ('To change a mixed number of a unit, split it into whole units and a fraction of a unit. For two units, like feet and inches, keep the whole units and change only the fraction part. '
       'For all small units, change both pieces and add them. To go backward, count the whole units that fit, put the leftover over the small units in one whole unit, and simplify.')
PIC = ('<svg viewBox="0 0 600 236" class="mk-svg" role="img" aria-label="Four and five twelfths feet split on a number bond into 4 feet and five twelfths of a foot. Feet and inches: 4 feet 5 inches. All inches: 48 plus 5 is 53 inches. Backward: 53 inches, count 4 whole feet, 48 inches, leftover 5 over 12: four and five twelfths feet.">'
 '<rect width="600" height="236" rx="12" fill="#FFF8EF"/>'
 '<rect x="190" y="14" width="220" height="40" rx="20" fill="#FFF3C4" stroke="#3B2417" stroke-width="3"/><text x="300" y="41" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="17" fill="#3B2417">4 and five twelfths ft</text>'
 '<line x1="270" y1="54" x2="200" y2="80" stroke="#3B2417" stroke-width="3"/><line x1="330" y1="54" x2="405" y2="80" stroke="#3B2417" stroke-width="3"/>'
 '<rect x="130" y="80" width="140" height="36" rx="18" fill="#fff" stroke="#1F8FB4" stroke-width="3"/><text x="200" y="104" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#3B2417">4 ft = 48 in</text>'
 '<rect x="310" y="80" width="190" height="36" rx="18" fill="#fff" stroke="#C2601F" stroke-width="3"/><text x="405" y="104" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#3B2417">five twelfths ft = 5 in</text>'
 '<text x="300" y="150" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#1F8FB4">Feet and inches: keep the 4 ft, change the fraction → 4 ft 5 in</text>'
 '<text x="300" y="176" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#1E8C5A">All inches: change both pieces → 48 in + 5 in = 53 in</text>'
 '<text x="300" y="212" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#C96512">Backward: 53 in, count 12, 24, 36, 48 (4 ft), 5 in left over: 4 and five twelfths ft</text></svg>')
ONEPIC = ('<div class="key-concept pq-onepic" id="mk-onepic" style="margin-top:14px;"><div class="key-concept-label">🎃 The Whole Lesson in One Picture</div>'
 '<p class="op-big"><strong>' + BIG + '</strong></p>' + PIC
 + '<div class="journal-label">✏️ Put the big idea in your own words. Use an example of your own. <span class="saved-dot" id="dot-big"></span></div>'
 '<textarea class="journal-box" data-label="Learn — The big idea in my own words" id="journal-big" oninput="autoSave(this,\'dot-big\')" placeholder=""></textarea></div>')
LEARN = (video('learn') + slot('crew') + CREW
 + act('mk-split', '#C56C3F', '🧍', 'Measure the Scarecrows', 'Job 2 · A mixed number of feet, two ways',
   job('Goldie\'s two scarecrows guard the pumpkin patch. Their tags say <strong>' + MX(2, 5, 6) + ' ft</strong> and <strong>' + MX(1, 7, 12) + ' ft</strong>. Her tape shows feet and inches on one side and only inches on the other. <strong>What does each side of the tape read?</strong>',
       ['Round 1: split ' + MX(2, 5, 6) + ' ft on the strip: 2 whole feet, then one more foot cut into 6, take 5.',
        'Write it Atlas\'s way (feet and inches: change just the fraction), then Felix\'s way (all inches: change both pieces and add).',
        'Round 2: do the same for ' + MX(1, 7, 12) + ' ft.'])
   + tip('cora', 'Ask first: what needs changing? For feet and inches, the whole feet stay. Writing 2 ft 34 in counts the 2 feet twice!') + model('split'))
 + act('mk-weigh', '#3A6B9A', '⚖️', 'Weigh and Time the Market', 'Job 3 · A mixed number of pounds or hours, in ounces or minutes',
   job('The market scale shows ounces and the signs show minutes, but Goldie\'s notes are mixed numbers: a pumpkin of <strong>' + MX(2, 7, 8) + ' lb</strong>, a hay ride of <strong>' + MX(1, 2, 5) + ' h</strong>, and <strong>' + MX(2, 1, 10) + ' h</strong> of market time. <strong>How many ounces or minutes is each?</strong>',
       ['Split each mixed number on the strip: whole units, then one more unit cut into equal parts.',
        'Change the whole units (16 ounces in a pound, 60 minutes in an hour) and the fraction part.',
        'Add the two pieces and type the total, one round at a time.'])
   + tip('felix', 'All small units means both pieces change. Change the whole units, change the fraction part, then add.') + model('weigh'), cls='bl-slate', extra=' style="margin-top:16px;"')
 + slot('build')
 + '<div class="key-concept" id="mk-board-kc" style="margin-top:16px;"><div class="key-concept-label">📐 Goldie\'s Mixed Number Board</div>' + BOARDSVG
 + '<p><strong>The small units in one big unit:</strong> 1 ft = 12 in · 1 lb = 16 oz · 1 h = 60 min.</p>'
 + tip('cora', 'Watch the whole units! In 2 ft 10 in, the 2 feet stay feet. In 34 in, the 2 feet became 24 inches.') + '</div><div class="pq-vslot" data-slot="do"></div>'
 + WE
 + act('mk-crates', '#6B3FA0', '🏷️', 'Label the Crates: 26 in, 18 oz, 70 min', 'Job 4 · Backward: small units to a mixed number',
   job('Goldie\'s crates are labeled in small units, but her price list uses mixed numbers. A crate of bean poles is <strong>26 inches</strong> long, a bag of apples weighs <strong>18 ounces</strong>, and the pies bake for <strong>70 minutes</strong>. <strong>What mixed number should each label say, in simplest form?</strong>',
       ['Tap <em>Mark off</em> to move one whole unit at a time onto a blue bar. Stop when not enough is left for another.',
        'Write the whole number, then the leftover over the small units in one whole unit (12, 16 or 60).',
        'Simplify with the <em>Parts of</em> buttons, then write the simplest form.'])
   + tip('hazel', 'The leftover is part of ONE more unit. That\'s why it goes over 12, 16 or 60, not over the whole amount.') + model('crates'), cls='bl-violet', extra=' style="margin-top:16px;"')
 + act('mk-twoway', '#C56C3F', '🔁', 'Two Ways to Write It', 'Job 5 · Two units, or a mixed number',
   job('The ink-maker writes amounts in two units, like 5 ft 2 in, and Goldie writes mixed numbers. To trade orders, they need both. A rope is <strong>5 ft 2 in</strong>, a jar of honey is <strong>3 lb 14 oz</strong>, and the puppet show runs <strong>' + MX(1, 7, 12) + ' h</strong>. <strong>How does each one look written the other way?</strong>',
       ['Keep the whole units. Change only the other piece.',
        'Two units to a mixed number: put the small units over the small units in one big unit, then simplify.',
        'A mixed number to two units: cut the last unit into equal parts and take some.'])
   + tip('atlas', 'Two units and a mixed number both keep the whole units whole. Only the leftover piece is written a new way.') + model('twoway'), cls='bl-slate', extra=' style="margin-top:16px;"')
 + slot('deliver') + ONEPIC)
i = s.index('<div aria-label="Daily vocabulary flash cards" class="vocab-section">')
j = s.index('<div class="tab-next-wrap"><p class="tab-transition-voice">Two pieces, change each, put them back together. Your turn.</p>')
s = s[:i] + LEARN + s[j:]
rep('Two pieces, change each, put them back together. Your turn.', 'Five market jobs down. One to go: Goldie\'s pumpkin order. Then the Golem.')

# ── E. Show What You Know
def fbox(bid, aria, unit):
    return ('<span class="ok-mixed">' + box(bid + '1', aria + ', whole number') + '<span class="ok-frac ok-frac-in">' + box(bid + '2', aria + ', top number') + '<i></i>'
            + box(bid + '3', aria + ', bottom number') + '</span></span> ' + unit)
SW = ('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Change each mixed number to the small unit.</strong> <span class="saved-dot" id="dot-1"></span></p><div class="ans-parts">'
 + part('Problem 1 (a)', '(a) ' + MX(3, 1, 6) + ' ft = ' + box('1a', 'Problem 1 a, inches', 'in'))
 + part('Problem 1 (b)', '(b) ' + MX(1, 5, 16) + ' lb = ' + box('1b', 'Problem 1 b, ounces', 'oz'))
 + part('Problem 1 (c)', '(c) ' + MX(2, 3, 10) + ' h = ' + box('1c', 'Problem 1 c, minutes', 'min')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">2</span><strong>Go backward: write each amount as a mixed number of the big unit, in simplest form.</strong> <span class="saved-dot" id="dot-2"></span></p><div class="ans-parts">'
 + part('Problem 2 (a)', '(a) 46 in = ' + fbox('2a', 'Problem 2 a, feet', 'ft'))
 + part('Problem 2 (b)', '(b) 34 oz = ' + fbox('2b', 'Problem 2 b, pounds', 'lb'))
 + part('Problem 2 (c)', '(c) 130 min = ' + fbox('2c', 'Problem 2 c, hours', 'h')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">3</span><strong>Write each one the other way. Keep the whole units.</strong> <span class="saved-dot" id="dot-3"></span></p><div class="ans-parts">'
 + part('Problem 3 (a)', '(a) 6 ft 10 in = ' + fbox('3a', 'Problem 3 a, feet', 'ft'))
 + part('Problem 3 (b)', '(b) 5 lb 14 oz = ' + fbox('3b', 'Problem 3 b, pounds', 'lb'))
 + part('Problem 3 (c)', '(c) ' + MX(3, 1, 12) + ' h = ' + box('3c1', 'Problem 3 c, hours', 'h') + ' ' + box('3c2', 'Problem 3 c, minutes', 'min')) + '</div></div>')
ORDER = ('<div class="activity bl-violet" id="mk-order"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">🎃</div><div><div class="activity-title">Last Job: Goldie\'s Pumpkin Order</div><div class="activity-sub">Job 6 · Change, add, regroup, simplify</div></div></div><div class="activity-body">'
 + job('The baker buys two pumpkins for pies. One weighs <strong>' + MX(1, 7, 8) + ' lb</strong>. The other weighs <strong>3 lb 4 oz</strong>. Goldie\'s receipt needs the total in pounds and ounces, and as a mixed number. When this order is done, the Re-Stamper is ready for the Golem. <strong>How much do the pumpkins weigh together?</strong>',
      ['Change ' + MX(1, 7, 8) + ' lb to pounds and ounces (only the fraction part changes).',
       'Tap each fact in the story, then tap the part of the bar it tells about. Add and regroup.',
       'Write the total as a mixed number of pounds in simplest form.'])
 + tip('cora', 'Don\'t add the 7 from ' + F(7, 8) + ' to the 4 ounces! Change the fraction to ounces first, just like the Study It.') + model('order') + '</div></div>')
i = s.index('<div class="callout callout-think"><span class="callout-icon">🧠</span><p><strong>Before each problem, ask:</strong>')
j = s.index('<div class="gathered-box">', i)
k = s.rfind('</div></div>', i, j)
s = (s[:i] + tip('opti', 'Hoo! Before each problem, ask: what needs changing, the fraction or the whole number? Going backward, count the whole units first.') + SW
     + '</div></div>' + model('bonus') + ORDER + slot('boss') + video('wrap')
     + '<div class="activity bl-slate" style="margin-top:18px;border-left-color:#C56C3F;"><div class="activity-head"><div class="activity-num" style="background:#C56C3F;color:#fff;">🗺️</div><div><div class="activity-title">What\'s Next</div><div class="activity-sub">The end of Unit 10</div></div></div><div class="activity-body">'
     + '<p>You can change measurements between units, even mixed numbers. Next comes the Unit 10 check. Then Unit 11 opens with <strong>Area of Rectangles, Part 1</strong>, where you will measure the space inside a shape instead of the length along it.</p></div></div>\n'
     + s[j:])
rep('<div class="activity-sub">Two quick checks. Your full practice is in the Independent Practice PDF.</div>', '<div class="activity-sub">Type each answer in its own box. For a mixed number, type the whole number, then the top and bottom of the fraction.</div>')
ins_before('<div class="gathered-box">', tip('cora', 'Check every answer for a unit and the simplest form. ' + MX(2, 2, 12) + ' ft can still be simpler: ' + MX(2, 1, 6) + ' ft.'))

rep('<strong>= 4 quarts = 16 cups</strong>', '<strong>= 4 quarts</strong>')   # the chart's chained fact is a summative item (1 gal = 16 c)
# ── F. small text fixes (checklist)
for a, b in [('<span>I answered both quick checks.</span>', '<span>I finished all six market jobs.</span>'),
             ('<span>I wrote down both pieces: the whole units and the fraction part.</span>', '<span>I typed an answer in every box.</span>')]:
    rep(a, b)
rep('function initLesson(){ restoreJournals(); updateProgress(); mmRender("p"); mmRender("h"); bdRender(); }', 'function initLesson(){ restoreJournals(); updateProgress(); }')
# the page's own restore + gather (this page predates the shared ones): include the per-part answer boxes; drop the old SWYK ids
rep("function restoreJournals(){document.querySelectorAll('textarea.journal-box').forEach(function(t){if(t.readOnly)return;",
    "function restoreJournals(){document.querySelectorAll('textarea.journal-box, input.ans-box').forEach(function(t){if(t.readOnly)return;")
i = s.index('function gatherAnswers(){'); j = s.index("  document.getElementById('gatheredOutput').value = out;\n}", i)
s = s[:i] + ("function gatherAnswers(){\n  var out = LESSON_TITLE + '\\n\\n';\n"
  "  document.querySelectorAll('textarea.journal-box, .ans-part').forEach(function(t){if(t.classList.contains('ans-part')){var c=t.cloneNode(true),empty=false;"
  "c.querySelectorAll('input').forEach(function(x,k){var v=t.querySelectorAll('input')[k].value.trim();if(!v)empty=true;x.replaceWith(v||'___');});"
  "out+=t.dataset.label+'\\n'+c.textContent.replace(/^\\([a-z]\\)\\s*/,'').replace(/\\s+/g,' ').trim()+(empty?'  [not finished]':'')+'\\n\\n';return;}"
  "out+=t.dataset.label+'\\n'+(t.value.trim()||'[No answer yet]')+'\\n\\n';});\n") + s[j:]
