# Lesson 4.10.04 · Customary Units of Capacity · Level 10 "Metric Market", Hilltop Dairy (lesson 4 of 7)
# Dimensions 4B Chapter 10 Lesson 4 + the IP (31 Oct 2026): the capacity ladder (fl oz, c, pt, qt, gal), going down the
# ladder by multiplying (one step at a time, chained), going up by grouping (with a leftover), compound gal qt <-> qt,
# and a multi-step word problem. One hands-on Pour Station job per IP direction, new numbers. No IP problem or chained
# IP fact (1 pt = 16 fl oz, 1 qt = 4 c, 1 gal = 8 pt = 16 c = 128 fl oz) is solved on the page.
# Run with: python3 tools/sparkle/build_lesson.py 10-04   (never run this file directly)
import re

def job(story, steps):
    # every job opens with the story it solves and what to do, so students know the goal before touching the model
    return ('<div class="task-box"><div class="task-label">Your job</div><p>%s</p></div>' % story
            + '<div class="mk-todo"><b>What to do</b><ol>' + ''.join('<li>%s</li>' % x for x in steps) + '</ol></div>')

def act(id, color, icon, title, sub, body, cls='bl-slate', extra=''):
    return ('<div class="activity %s" id="%s"%s><div class="activity-head"><div class="activity-num" style="background:%s;">%s</div><div><div class="activity-title">%s</div>'
            '<div class="activity-sub">%s</div></div></div><div class="activity-body">%s</div></div>') % (cls, id, extra, color, icon, title, sub, body)

# ── header: pixel town strip, clean top
ins_before('<div class="quote-strip">', '<div class="pq-town-strip" aria-hidden="true"></div>')
for mk in ['<div class="quote-strip">', '<div class="standards-toggle-bar"', '<div class="info-strip">', '<div class="explorer-strip">', '<div class="need-strip">']:
    replace_block(mk, '')
m = re.search(r'<div class="intro-2col">', s); i = m.start(); j = block_end(s, i); intro = s[i:j]
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-head-title">).*?(</div>)', r'\1Which holds more, 2 gal 1 qt or 10 qt? How can you be sure?\2', intro, count=1, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-body">).*?(</div></div><div class="intro-card theme-objectives">)',
  r'\1<p class="pq-eq-note">Milk is measured with a ladder of units, from tiny to big. You will find two ways to climb it. You will prove the answer by the end of the lesson.</p>\2', intro, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-objectives">.*?<div class="intro-card-body">).*$',
  r'\1<div class="obj-line"><span class="obj-icon">🪜</span><span><strong>Build the ladder</strong> of fluid ounces, cups, pints, quarts and gallons.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">⬇️</span><span><strong>Go down the ladder</strong> to a smaller unit by multiplying, one step at a time.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">⬆️</span><span><strong>Go up the ladder</strong> to a bigger unit by grouping, and keep any leftover in the smaller unit.</span></div></div></div></div>', intro, flags=re.S)
s = s[:i] + '<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>' + intro + '</details>' + s[j:]

# ── A. Think video + the dairy board (the first game window comes after Climb the Ladder, which it needs)
replace_block('<div class="video-placeholder-wrap">\n<!-- slot: g4math-10-04 -->', video('think') + '\n<div class="mk-board-mount"></div>')

# ── B. the fact warm-up: multi-digit division → the × and ÷ facts for 2, 4 and 8 that today's ladder uses
FACTS = [('8 × 6', '48'), ('36 ÷ 4', '9'), ('4 × 12', '48'), ('48 ÷ 8', '6'), ('8 × 9', '72'),
         ('28 ÷ 4', '7'), ('2 × 15', '30'), ('72 ÷ 8', '9'), ('4 × 6', '24'), ('18 ÷ 2', '9')]
i = s.index('<div class="fluency-grid" id="fluencyGrid">'); j = block_end(s, i)
s = s[:i] + '<div class="fluency-grid" id="fluencyGrid">' + ''.join(
    '<div class="fluency-item"><span class="fluency-q">%s =</span><input autocomplete="off" class="fluency-input" data-answer="%s" inputmode="numeric" type="text" aria-label="%s"/></div>\n' % (q, a, q)
    for q, a in FACTS) + '</div>' + s[j:]

# ── C. the old Math Crew card leaves the Warm-Up (their methods move to Learn, after the Think)
i = s.index('<div class="activity bl-violet"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div>'); j = block_end(s, i); s = s[:i] + s[j:]
CREW = ('<div class="activity bl-violet" id="mk-crew"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div><div><div class="activity-title">The Math Crew: Two Ways</div>'
 '<div class="activity-sub">Which holds more: Can A at 2 gal 1 qt, or Can B at 10 qt?</div></div></div><div class="activity-body">'
 '<p>The Crew found the answer two different ways. Walk to each of them in the game above to hear their way, or read it here. Which way would you pick?</p>'
 '<div class="bubble-row">'
 '<div class="bubble atlas"><div class="bubble-avatar">A</div><div class="bubble-body"><div class="bubble-name">Atlas: gallons and quarts</div><div class="bubble-text">"I pour Can B\'s 10 quarts into gallon jugs. 4 quarts fill a jug, so 8 quarts fill 2 jugs, and 2 quarts are left. Can B holds 2 gal 2 qt. Both cans have 2 gallons, and 2 quarts is 1 more than 1 quart. Can B holds 1 quart more."</div></div></div>'
 '<div class="bubble felix"><div class="bubble-avatar">F</div><div class="bubble-body"><div class="bubble-name">Felix: all quarts</div><div class="bubble-text">"I change Can A to quarts. 2 gal is 2 × 4 = 8 qt, and 1 more makes 9 qt. Can B holds 10 qt, and 10 − 9 = 1. Can B holds 1 quart more. Same answer!"</div></div></div>'
 '</div><div class="bubble-row">'
 '<div class="bubble hazel"><div class="bubble-avatar">H</div><div class="bubble-body"><div class="bubble-name">Hazel: picture the Gallon-Man</div><div class="bubble-text">"I picture the Gallon-Man. His gallon jug holds 4 quart bottles. So Can A is 2 groups of 4 bottles and 1 more, and Can B is 10 bottles."</div></div></div>'
 '<div class="bubble cora"><div class="bubble-avatar">C</div><div class="bubble-body"><div class="bubble-name">Cora: the right step number</div><div class="bubble-text">"Every step on the ladder has its own number. Gallons to quarts is 4. Quarts to pints is 2, pints to cups is 2, and cups to fluid ounces is 8."</div></div></div>'
 '</div><div class="callout callout-tip" style="margin-top:8px;"><span class="callout-icon">💡</span><p>Crew rule: <em>Picture the containers (Hazel). Pick a way: group up into the bigger unit, or multiply down into the smaller unit (Atlas, Felix). Use the right step number (Cora).</em></p></div>'
 '<div class="journal-label">✏️ Which Crew way is most like yours? Which way would you use for a bigger number, like 150 qt, and why? <span class="saved-dot" id="dot-compare"></span></div>'
 '<textarea class="journal-box" data-label="Learn — My way and the Crew\'s ways" id="journal-compare" oninput="autoSave(this,\'dot-compare\')" placeholder=""></textarea></div></div>')

# ── D. the old "Pour Comparisons" pick warm-up → Job 1 Climb the Ladder (Pour Station) + the door window + Mental Math "Make a cup"
replace_block('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🔎</div>',
 act('mk-ladder', '#F5C518;color:#0E1C42', '🪜', 'Warm-Up: Climb the Ladder', 'Job 1 · Put Farmer Hank\'s measuring set back together',
   job('Every pail, bottle and jug at Hilltop Dairy is measured by its capacity. Farmer Hank uses five sizes, from small to big: the fluid ounce, the cup, the pint, the quart and the gallon. The Smudge scattered his measuring set. <strong>How many of each size fill the next size up?</strong>',
       ['Round 1: drag or tap 1-fluid-ounce creamers into the cup until it is full. Count your pours, then type how many fill 1 cup.',
        'Rounds 2, 3 and 4: do the same with cups into a pint, pints into a quart, and quarts into a gallon.',
        'Write the four facts on paper as you go, from the smallest size to the biggest. They are the ladder you will use all lesson.'])
   + tip('cora', 'Careful: a fluid ounce isn\'t the ounce from Mrs. Mabel\'s scale. Fluid ounces tell how much a container holds. Ounces tell how heavy something is.') + model('ladder')
   , cls='bl-yellow')
 + slot('door')
 + '<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🧠</div><div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, four quick problems</div></div></div><div class="activity-body">'
 + tip('felix', '8 fluid ounces fill a cup. So find the number that goes with yours to make 8.') + model('mental') + '</div></div>')

# ── E. Think About It → Hank's two milk cans (which holds more?), any method, no teaching yet
i = s.index('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🤔</div>'); j = block_end(s, i)
s = s[:i] + act('mk-think', '#F5C518;color:#0E1C42', '🤔', 'Think About It: The Two Milk Cans', 'Try it your way first',
  '<div class="callout callout-think"><span class="callout-icon">🥛</span><p>Farmer Hank has two milk cans. Can A holds <strong>2 gal 1 qt</strong>. Can B holds <strong>10 qt</strong>. Which can holds more milk, and by how many quarts?</p></div>'
  + '<div class="journal-label">👀 What do you notice about the two cans? What do you wonder? <span class="saved-dot" id="dot-notice"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — I notice, I wonder" id="journal-notice" oninput="autoSave(this,\'dot-notice\')" placeholder="I notice… I wonder…"></textarea>'
  + tip('atlas', 'One can is in gallons and quarts. The other is only in quarts. How can you compare them fairly?')
  + model('think')
  + '<div class="journal-label">✏️ How did you find out which can holds more? Tell your steps. <span class="saved-dot" id="dot-think"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — Think: which can holds more?" id="journal-think" oninput="autoSave(this,\'dot-think\')" placeholder=""></textarea>',
  cls='bl-yellow') + s[j:]
rep('Now pour fluids into a measuring tower.', 'Next: on the Learn tab, the Math Crew shows two ways, and you fill Hank\'s cream bottles.')

# ── F. Learn: drop the flip cards, the leftover "SPLIT the bar" line and the old Pour Lab; video, the Crew, Jobs 2–4
i = s.index('<div aria-label="Daily vocabulary flash cards" class="vocab-section">'); j = block_end(s, i); s = s[:i] + s[j:]
i = s.index('<div class="callout callout-think" style="margin-bottom:14px;"><span class="callout-icon">🧠</span><p><strong>Try before the rule:</strong>')
j = block_end(s, i); k = s.index('<div class="activity bl-slate">', j); kend = block_end(s, k)
assert 'Pour Lab' in s[k:kend]
s = s[:i] + (video('learn') + slot('crew') + CREW
 + act('mk-cream', '#5E9FD6', '🥛', 'Fill the Cream Bottles: 3 qt = ? pt = ? c = ? fl oz', 'Job 2 · Go down the ladder: multiply',
   job('Mrs. Mabel ordered cream for her store, and she sells it in small bottles. Hank has <strong>3 qt</strong> of cream. <strong>How many pints is that? How many cups? How many fluid ounces?</strong> Then help him with his big milk vat.',
       ['Pour each quart bottle out into pint bottles (drag or tap it). Type how many pints.',
        'Pour each pint out into cups. Type how many cups.',
        'Write the whole chain below, one step per box: quarts, then pints, then cups, then fluid ounces.',
        'Hank\'s milk vat holds <strong>9 gal</strong>. Change it to quarts.'])
   + tip('felix', 'Going down the ladder to a smaller unit, multiply by that step\'s number. Smaller containers, so more of them!') + model('cream'))
 + slot('sort')
 + act('mk-milk', '#3A6B9A', '🍼', 'Bottle the Milk: 40 fl oz = ? c · 28 qt = ? gal', 'Job 3 · Go up the ladder: group',
   job('Fresh milk is ready to bottle. Hank has <strong>40 fl oz</strong> of milk in little creamers and <strong>28 qt</strong> in quart bottles. His shop sells cups and gallon jugs. <strong>How many cups? How many gallon jugs?</strong>',
       ['Pour the creamers into cup measures. After one full cup, you can fill a whole cup at once. Type how many cups.',
        'Pour the 28 quart bottles into gallon jugs. Type how many gallons.',
        'Last, Hank pours <strong>18 c</strong> into pint bottles. Group the cups by 2s and type how many pints.'])
   + tip('atlas', 'Going up the ladder to a bigger unit, group. Bigger containers, so fewer of them!') + model('milk'), cls='bl-slate', extra=' style="margin-top:16px;"')
 + act('mk-cans', '#6B3FA0', '🪣', 'Count the Milk Cans: 4 gal 2 qt = ? qt · 27 qt = ? gal ? qt', 'Job 4 · Make the next gallon, then pour both ways',
   job('Two milk cans stand by the barn, and the Smudge rubbed off their labels. Can 1 holds <strong>4 gal 2 qt</strong>, and Hank wants its label in quarts. Can 2 holds <strong>27 qt</strong>, and he wants its label in gallons and quarts. <strong>What should each new label say?</strong>',
       ['Warm up with the two "make the next gallon" problems: use part of the quarts to fill the next gallon.',
        'Can 1: pour each gallon jug out into quart bottles. Count all the quarts and type the label.',
        'Can 2: pour quart bottles into gallon jugs until there aren\'t enough left to fill one. Type the gallons and the leftover quarts.'])
   + tip('cora', 'A leftover can never be 4 quarts or more. 4 quarts always fill another gallon.') + model('next') + model('cans'), cls='bl-violet', extra=' style="margin-top:16px;"')
 + slot('escort')) + s[kend:]

# ── G. the capacity chain → Hank's Ladder Board (the steps, both directions), then the Do video, Study It, Job 5
def rung(x, y, w, lab, col):
    return ('<rect x="%d" y="%d" width="%d" height="40" rx="8" fill="%s" stroke="#3B2417" stroke-width="3"/>'
            '<text x="%d" y="%d" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="18" fill="#fff">%s</text>') % (x, y, w, col, x + w // 2, y + 27, lab)
UNITS = [('gallon', '#2F5D8A'), ('quart', '#3A6FB0'), ('pint', '#5E9FD6'), ('cup', '#2DB87A'), ('fluid ounce', '#E07B39')]
STEPS = ['4', '2', '2', '8']
BOARDSVG = ('<svg viewBox="0 0 640 262" class="mk-svg" role="img" aria-label="The capacity ladder: 1 gallon is 4 quarts, 1 quart is 2 pints, 1 pint is 2 cups, 1 cup is 8 fluid ounces. Going down, multiply by the step number. Going up, group by it.">'
 '<rect width="640" height="262" rx="12" fill="#FFF8EF"/>'
 '<defs><marker id="lbd" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#C56C3F"/></marker><marker id="lbu" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#3A6B9A"/></marker></defs>'
 + ''.join(rung(14 + n * 126, 86, 108, lab, col) for n, (lab, col) in enumerate(UNITS))
 + ''.join('<text x="%d" y="52" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="17" fill="#C56C3F">× %s</text><path d="M%d 66 h88" stroke="#C56C3F" stroke-width="3" marker-end="url(#lbd)"/>'
           '<path d="M%d 146 h-88" stroke="#3A6B9A" stroke-width="3" marker-end="url(#lbu)"/><text x="%d" y="170" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#3A6B9A">group by %s</text>'
           % (131 + n * 126, st, 82 + n * 126, 180 + n * 126, 131 + n * 126, st) for n, st in enumerate(STEPS))
 + '<text x="20" y="28" font-family="DotGothic16,Nunito" font-size="16" fill="#3B2417">Hank\'s ladder: big → small</text>'
 '<rect x="20" y="192" width="600" height="56" rx="10" fill="#FFFFFF" stroke="#F5D4BC" stroke-width="2"/>'
 '<text x="36" y="215" font-family="Nunito" font-weight="900" font-size="15" fill="#C56C3F">Going down (to a smaller unit): multiply by each step\'s number, one step at a time.</text>'
 '<text x="36" y="238" font-family="Nunito" font-weight="900" font-size="15" fill="#3A6B9A">Going up (to a bigger unit): group by that number. A leftover stays in the smaller unit.</text></svg>')
replace_block('<div class="key-concept" style="margin-top:16px;"><div class="key-concept-label">📐 The Capacity Chain',
 '<div class="key-concept" id="mk-board-kc" style="margin-top:16px;"><div class="key-concept-label">📐 Hank\'s Ladder Board</div>' + BOARDSVG
 + '<p><strong>The steps:</strong> 1 gal = 4 qt · 1 qt = 2 pt · 1 pt = 2 c · 1 c = 8 fl oz.</p>'
 + tip('cora', 'Each arrow is one step. To go two steps, do one step, then the next. Never skip a step.') + '</div><div class="pq-vslot" data-slot="do"></div><!--WE-->')

# ── H. Picture It (it solved IP 1–2) goes; Study It (a two-step trip down the ladder) + Job 5 + the One Picture
i = s.index('<div class="activity bl-violet" style="margin-top:16px;"><div class="activity-head">'); j = block_end(s, i)
assert 'Picture It' in s[i:j]
s = s[:i] + s[j:]
i = s.index('<div class="activity bl-slate"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Worked Example:'); j = block_end(s, i)
WE = ('<div class="activity bl-slate" id="mk-worked"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Study It: How Hank Filled the Pint Bottles</div><div class="activity-sub">Already solved for you. Read it, then pour the picnic milk yourself.</div></div></div><div class="activity-body">'
 '<p style="margin:0 0 10px;font-weight:700;color:#3A4A6B;">👀 Nothing to type here. This problem is solved two ways. Both ways get the same answer. Read the one that makes more sense to you.</p>'
 '<div class="task-box"><div class="task-label">Problem</div><p>Hank\'s milk can holds <strong>2 gal 3 qt</strong>. He pours all of it into pint bottles. How many pint bottles does he fill?</p></div>'
 + tip('atlas', 'Pints are two steps down from gallons. So go down one step at a time: gallons to quarts, then quarts to pints.') +
 '<div class="we-two"><div class="we-way"><h5>Way 1: gallons and quarts</h5><ol><li>2 gal is 8 qt. (2 × 4 = 8)</li><li>8 qt is 16 pt. (8 × 2 = 16)</li><li>The 3 extra qt are 6 pt. (3 × 2 = 6)</li><li>16 pt + 6 pt = 22 pt. He fills <b>22 pint bottles</b>.</li></ol></div>'
 '<div class="we-way"><h5>Way 2: all quarts</h5><ol><li>2 gal 3 qt is 11 qt. (2 × 4 = 8, and 3 more)</li><li>11 qt is 22 pt. (11 × 2 = 22)</li><li>He fills <b>22 pint bottles</b>.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Check it: pour the pints back up the ladder. 22 pt grouped by 2s is 11 qt. 11 qt = 8 qt + 3 qt, and 8 qt fill 2 gallon jugs. So it is 2 gal 3 qt, the whole can. ✓</p>')
BIG = ('To change a capacity to another unit, use the ladder one step at a time. Going down to smaller units, multiply by the step\'s number '
       '(gallons × 4 = quarts, quarts × 2 = pints, pints × 2 = cups, cups × 8 = fluid ounces). Going up to bigger units, group by that number, and keep any leftover in the smaller unit.')
def jug(x, y, w, h, lab, col, fs=15):
    return ('<rect x="%d" y="%d" width="%d" height="%d" rx="6" fill="%s" stroke="#3B2417" stroke-width="2.5"/>'
            '<text x="%d" y="%d" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="%d" fill="#3B2417">%s</text>') % (x, y, w, h, col, x + w // 2, y + 18, fs, lab)
PIC = ('<svg viewBox="0 0 600 240" class="mk-svg" role="img" aria-label="The Gallon-Man: his gallon jug holds 4 quart bottles. One quart holds 2 pints. One pint holds 2 cups. One cup holds 8 fluid ounces. Example: 7 pints is 14 cups, and 14 cups is 112 fluid ounces. Going back up, 14 cups grouped by 2s is 7 pints.">'
 '<rect width="600" height="240" rx="12" fill="#FFF8EF"/>'
 + jug(14, 12, 330, 166, '1 gallon jug: 4 quarts', '#EAF4FF', 15)
 + ''.join(jug(24 + n * 79, 38, 72, 128, 'quart', '#FFFFFF', 13) for n in range(4))
 + jug(28, 62, 32, 98, 'pt', '#DCEFFF', 12) + jug(62, 62, 32, 98, 'pt', '#DCEFFF', 12)
 + jug(31, 88, 13, 46, '', '#C9F0DB') + jug(45, 88, 13, 46, '', '#C9F0DB')
 + '<text x="44" y="150" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="11" fill="#1E8C5A">2 c</text>'
 '<text x="38" y="196" font-family="Nunito" font-weight="800" font-size="13" fill="#3B2417">each cup: 8 fl oz</text>'
 '<text x="362" y="52" font-family="Nunito" font-weight="900" font-size="16" fill="#C56C3F">Down the ladder:</text>'
 '<text x="362" y="76" font-family="Nunito" font-weight="900" font-size="16" fill="#C56C3F">× 4, × 2, × 2, × 8</text>'
 '<text x="362" y="112" font-family="Nunito" font-weight="900" font-size="16" fill="#3A6B9A">Up the ladder:</text>'
 '<text x="362" y="136" font-family="Nunito" font-weight="900" font-size="16" fill="#3A6B9A">group by 8, 2, 2, 4</text>'
 '<text x="300" y="214" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#3B2417">7 pt → 7 × 2 = 14 c → 14 × 8 = 112 fl oz</text>'
 '<text x="300" y="234" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#3A6B9A">Back up: 14 c grouped by 2s is 7 pt.</text></svg>')
ONEPIC = ('<div class="key-concept pq-onepic" id="mk-onepic" style="margin-top:14px;"><div class="key-concept-label">🪜 The Whole Lesson in One Picture</div>'
 '<p class="op-big"><strong>' + BIG + '</strong></p>' + PIC
 + '<div class="journal-label">✏️ Put the big idea in your own words. Use an example of your own. <span class="saved-dot" id="dot-big"></span></div>'
 '<textarea class="journal-box" data-label="Learn — The big idea in my own words" id="journal-big" oninput="autoSave(this,\'dot-big\')" placeholder=""></textarea></div>')
s = s[:i] + ONEPIC + s[j:]
PICNIC = act('mk-picnic', '#C56C3F', '🧺', 'Milk for the Picnic: 4 gal = ? qt = ? c', 'Job 5 · A word problem, down the ladder',
  job('Hilltop School\'s picnic is today, and Hank brings the milk: <strong>4 gallon jugs</strong>. Each child gets a <strong>1-cup</strong> glass. <strong>How many children get a glass of milk?</strong>',
      ['Tap each jug in the story, then tap the part of the bar it tells about.',
       'Type how many quarts of milk Hank brings in all.',
       'Go down the ladder below: quarts to pints, then pints to cups.',
       'Type how many children get a glass.'])
  + tip('hazel', 'Each jug is 1 gallon. Picture 4 quart bottles inside each one.')
  + model('picnic'), cls='bl-slate', extra=' style="margin-top:16px;"')
s = s.replace('<!--WE-->', WE + '</div></div>' + PICNIC, 1)  # Study It right after the Do video, then Milk for the Picnic, then the One Picture
rep('You poured and converted. Now practice with new capacities.', 'Five dairy jobs down. One to go: fix the Gallon-Man\'s plaque.')

# ── I. Show What You Know: per-part answer boxes, bonus, prove it, the last game window, What's Next
for a, b in [('<div class="activity-sub">For each problem, convert between customary units of capacity. Show your work.</div>', '<div class="activity-sub">Type each answer in its own box.</div>'),
             ('<p>Use the chart: 8 fl oz = 1 cup, 2 cups = 1 pint, 2 pints = 1 quart, 4 quarts = 1 gallon.</p>', '<p>Use Hank\'s ladder: 1 gal = 4 qt, 1 qt = 2 pt, 1 pt = 2 c, 1 c = 8 fl oz.</p>'),
             ('<div class="callout callout-think"><span class="callout-icon">🧠</span><p><strong>Before each problem, ask:</strong> How many of the smaller container fit inside the bigger one — cups in a pint, pints in a quart, quarts in a gallon?</p></div>', '<p>Show your thinking on paper if it helps, then type each answer.</p>')]:
    rep(a, b)
SW = ('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Change the units.</strong> <span class="saved-dot" id="dot-1"></span></p><div class="ans-parts">'
 + part('Problem 1 (a)', '(a) 6 qt = ' + box('1a', 'Problem 1 a, pints', 'pt'))
 + part('Problem 1 (b)', '(b) 7 c = ' + box('1b', 'Problem 1 b, fluid ounces', 'fl oz'))
 + part('Problem 1 (c)', '(c) 20 pt = ' + box('1c', 'Problem 1 c, quarts', 'qt'))
 + part('Problem 1 (d)', '(d) 64 fl oz = ' + box('1d', 'Problem 1 d, cups', 'c')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">2</span><strong>Gallons and quarts.</strong> <span class="saved-dot" id="dot-2"></span></p><div class="ans-parts">'
 + part('Problem 2 (a)', '(a) 7 gal 2 qt = ' + box('2a', 'Problem 2 a, quarts', 'qt'))
 + part('Problem 2 (b)', '(b) 23 qt = ' + box('2b1', 'Problem 2 b, gallons', 'gal') + ' ' + box('2b2', 'Problem 2 b, quarts', 'qt')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">3</span><strong>Word problem: the buttermilk.</strong> Hank has 6 gallons of buttermilk. <span class="saved-dot" id="dot-3"></span></p><div class="ans-parts">'
 + part('Problem 3 (a) in quarts', '(a) How many quarts is that? ' + box('3a', 'Problem 3 a, quarts', 'qt'))
 + part('Problem 3 (b) pint jars', '(b) He pours all of it into pint jars. How many jars does he fill? ' + box('3b', 'Problem 3 b, jars', 'jars')) + '</div></div>')
i = s.find('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Single-step conversions.</strong>'); j = s.find('<div class="activity bl-slate" style="margin-top:18px;border-left-color:#0E8A8C;">', i); assert i > 0 and j > i
s = s[:i] + tip('opti', 'Hoo! Before each problem, ask: am I going down the ladder (multiply) or up (group)? Then use that step\'s number.') + SW + model('bonus') + (
 '<div class="activity bl-violet" id="mk-prove"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">🪧</div><div><div class="activity-title">Last Job: Is 3 gal 5 qt finished?</div><div class="activity-sub">Job 6 · Fix the Gallon-Man\'s plaque</div></div></div><div class="activity-body">'
 + job('The Gallon-Man stands again! But the Smudge scratched a new label on his plaque: <strong>3 gal 5 qt</strong>. Hank says a label with gallons should never have 4 quarts or more. <strong>What should the plaque say?</strong>',
      ['Look at what the plaque says: 3 full gallon jugs and 5 quart bottles.',
       'Pour quart bottles into the open gallon jug until it is full.',
       'Count the full jugs and the bottles left over. Type what the plaque should say.'])
 + tip('cora', 'Every 4 quarts fill another gallon. A label with 5 quarts isn\'t finished.') + model('prove') + '</div></div>' + slot('trough') + video('wrap')) + s[j:]
ins_before('<div class="gathered-box">', tip('cora', 'Check every answer for a unit. "4 1" isn\'t finished. "4 gal 1 qt" is.'))

# ── J. small text fixes (jargon, What's Next, checklist)
for a, b in [('<div class="fluency-head-label">FLUENCY WARM-UP</div><div class="fluency-head-title">Multi-Digit Division</div>', '<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">Times and Divide by 2, 4 and 8</div>'),
             ('Warm up your fact fluency before today’s lesson. Work through these, then check your answers.', 'Warm up with these facts before today’s lesson. Type each answer, then check.'),
             ('data-label="Fluency Warm-Up (Multi-Digit Division)"', 'data-label="Fact Warm-Up (Times and Divide by 2, 4 and 8)"'),
             ('<div class="activity-title">Connection Forward: Customary Capacity</div><div class="activity-sub">What comes next in Unit 10</div>', '<div class="activity-title">What\'s Next</div><div class="activity-sub">Coming up in Unit 10</div>'),
             ('Next lesson, we measure TIME — seconds, minutes, hours, and days — chaining factors again, but now on a real clock face.',
              'Next lesson, you\'ll climb the Clock Tower and measure time: hours, minutes and seconds. The steps change again, and the two ways you used today still work.'),
             ('<span>I completed both quick checks above.</span>', '<span>I finished all six dairy jobs.</span>'),
             ('<span>I showed my model or my steps for each problem.</span>', '<span>I typed an answer in every box.</span>')]:
    rep(a, b)
# the shared Conversion Chart button lists chained capacity facts that are IP 1 and IP 2 answers (1 qt = 4 c, 1 gal = 16 c): one step per row here
rep('<strong>= 2 pints = 4 cups</strong>', '<strong>= 2 pints</strong>')
rep('<strong>= 4 quarts = 16 cups</strong>', '<strong>= 4 quarts</strong>')
s = re.sub(r'var FLUENCY_TITLE = "Multi-Digit Division";', 'var FLUENCY_TITLE = "Times and Divide by 2, 4 and 8";', s)
answer_boxes_save()
