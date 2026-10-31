# Lesson 4.10.03 · Customary Units of Weight · Level 10 "Metric Market", the Eastside General Store (lesson 3 of 7)
# Dimensions 4B Chapter 10 Lesson 3 shape (31 Oct 2026): read a platform scale, compare and compute with pounds and ounces,
# two methods (pounds and ounces with a 16-ounce trade vs all ounces). Aligned to the IP: lb oz → oz, oz → lb oz,
# add with a trade, subtract with a trade, one hands-on job each. No IP problem is solved on the page.
# Run with: python3 tools/sparkle/build_lesson.py 10-03   (never run this file directly)
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
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-head-title">).*?(</div>)', r'\1Which is heavier, 2 lb 9 oz or 43 oz? How can you be sure?\2', intro, count=1, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-body">).*?(</div></div><div class="intro-card theme-objectives">)',
  r'\1<p class="pq-eq-note">Some weights use two units at once, like 2 lb 9 oz. You will find two ways to work with them. You will prove the answer by the end of the lesson.</p>\2', intro, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-objectives">.*?<div class="intro-card-body">).*$',
  r'\1<div class="obj-line"><span class="obj-icon">⚖️</span><span><strong>Read a scale</strong> in pounds and ounces.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">🔁</span><span><strong>Change</strong> pounds and ounces to ounces, and ounces to pounds and ounces.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">➕</span><span><strong>Add and subtract</strong> pounds and ounces, trading ounces for pounds when you need to.</span></div></div></div></div>', intro, flags=re.S)
s = s[:i] + '<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>' + intro + '</details>' + s[j:]

# ── A. Think video + the store board (the first game window comes after Read the Scale, which it needs)
replace_block('<div class="video-placeholder-wrap">\n<!-- slot: g4math-10-03 -->', video('think') + '\n<div class="mk-board-mount"></div>')

# ── B. the fact warm-up: the multiple-choice estimates become typed multiplication facts
FACTS = [('16 × 6', '96'), ('14 × 3', '42'), ('16 × 7', '112'), ('18 × 2', '36'), ('16 × 8', '128'),
         ('12 × 6', '72'), ('16 × 9', '144'), ('25 × 4', '100'), ('15 × 5', '75'), ('16 × 10', '160')]
i = s.index('<div class="fluency-grid" id="fluencyGrid">'); j = block_end(s, i)
s = s[:i] + '<div class="fluency-grid" id="fluencyGrid">' + ''.join(
    '<div class="fluency-item"><span class="fluency-q">%s =</span><input autocomplete="off" class="fluency-input" data-answer="%s" inputmode="numeric" type="text" aria-label="%s"/></div>\n' % (q, a, q)
    for q, a in FACTS) + '</div>' + s[j:]

# ── C. the old Math Crew card leaves the Warm-Up (their methods move to Learn, after the Think)
i = s.index('<div class="activity bl-violet"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div>'); j = block_end(s, i); s = s[:i] + s[j:]
CREW = ('<div class="activity bl-violet" id="mk-crew"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div><div><div class="activity-title">The Math Crew: Two Ways</div>'
 '<div class="activity-sub">Which is heavier: the pineapple at 2 lb 9 oz, or the melon at 43 oz?</div></div></div><div class="activity-body">'
 '<p>The Crew found the answer two different ways. Read both. Which way would you pick?</p>'
 '<div class="bubble-row">'
 '<div class="bubble atlas"><div class="bubble-avatar">A</div><div class="bubble-body"><div class="bubble-name">Atlas: pounds and ounces</div><div class="bubble-text">"I change the melon\'s 43 oz to pounds and ounces. I count by 16s: 16, 32. The next one, 48, is too many. So I split 43 into 32 and 11. 32 oz is 2 lb, so the melon is 2 lb 11 oz. Both are 2 pounds, and 11 ounces is 2 more than 9 ounces. The melon is heavier by 2 oz."</div></div></div>'
 '<div class="bubble felix"><div class="bubble-avatar">F</div><div class="bubble-body"><div class="bubble-name">Felix: all ounces</div><div class="bubble-text">"I change the pineapple to ounces. 2 lb is 2 × 16 = 32 oz. 32 oz + 9 oz = 41 oz. The melon is 43 oz, and 43 − 41 = 2. The melon is heavier by 2 oz. Same answer!"</div></div></div>'
 '</div><div class="bubble-row">'
 '<div class="bubble hazel"><div class="bubble-avatar">H</div><div class="bubble-body"><div class="bubble-name">Hazel: picture the dial</div><div class="bubble-text">"I picture Mrs. Mabel\'s scale. Every pound has 16 little marks, one for each ounce. So 2 pounds is 2 groups of 16 marks."</div></div></div>'
 '<div class="bubble cora"><div class="bubble-avatar">C</div><div class="bubble-body"><div class="bubble-name">Cora: trade 16, not 10</div><div class="bubble-text">"With feet we traded 12 inches. Here we trade 16 ounces for 1 pound. When the ounces reach 16, trade them!"</div></div></div>'
 '</div><div class="callout callout-tip" style="margin-top:8px;"><span class="callout-icon">💡</span><p>Crew rule: <em>Picture the dial (Hazel). Pick a way: pounds and ounces, or all ounces (Atlas, Felix). Trade 16 ounces for a pound and check the units (Cora).</em></p></div>'
 '<div class="journal-label">✏️ Which Crew way is most like yours? Which way would you use for a bigger number, like 150 oz, and why? <span class="saved-dot" id="dot-compare"></span></div>'
 '<textarea class="journal-box" data-label="Learn — My way and the Crew\'s ways" id="journal-compare" oninput="autoSave(this,\'dot-compare\')" placeholder=""></textarea></div></div>')

# ── D. the old balance-pick warm-up → Job 1 Read Mabel's Scale (Store Scale) + the first game window + Mental Math "Make a pound"
replace_block('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🔎</div>',
 act('mk-scale', '#F5C518;color:#0E1C42', '⚖️', 'Warm-Up: Read the Scale', 'Job 1 · Check Mrs. Mabel\'s scale',
   job('Mrs. Mabel weighs everything she sells on her big store scale. It shows <strong>weight</strong> in two units: the pound (lb) is the big unit, and the ounce (oz) is the small one. The Smudge knocked the scale, so first, check it. <strong>How many ounces make 1 pound?</strong>',
       ['Round 1: drag or tap 1-ounce weights onto the scale until the needle points to <strong>1 lb</strong>. Watch the small marks light up and count them.',
        'Type how many ounces make 1 pound.',
        'Round 2: weigh the beans. Put on the 1-pound weight, then 1-ounce weights, and watch the needle move past 1 lb.',
        'Round 3: read the oats. Find the last pound number the needle passed, then count the small marks after it. Type the weight in pounds and ounces.'])
   + tip('hazel', 'Look at the dial. The little marks between 0 and 1 lb are ounces. Count them!') + model('scale')
   , cls='bl-yellow')
 + slot('find')
 + '<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🧠</div><div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, four quick problems</div></div></div><div class="activity-body">'
 + tip('felix', '16 ounces make 1 pound. So find the number that goes with yours to make 16.') + model('mental') + '</div></div>')

# ── E. Think About It → Mabel's pineapple and melon (which is heavier?), any method, no teaching yet
i = s.index('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🤔</div>'); j = block_end(s, i)
s = s[:i] + act('mk-think', '#F5C518;color:#0E1C42', '🤔', 'Think About It: The Pineapple and the Melon', 'Try it your way first',
  '<div class="callout callout-think"><span class="callout-icon">🍍</span><p>Mrs. Mabel\'s pineapple weighs <strong>2 lb 9 oz</strong>. The tag on her melon says <strong>43 oz</strong>. Which fruit is heavier, and by how many ounces?</p></div>'
  + '<div class="journal-label">👀 What do you notice about the two weights? What do you wonder? <span class="saved-dot" id="dot-notice"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — I notice, I wonder" id="journal-notice" oninput="autoSave(this,\'dot-notice\')" placeholder="I notice… I wonder…"></textarea>'
  + tip('atlas', 'One weight is in pounds and ounces. The other is only in ounces. How can you compare them fairly?')
  + model('think')
  + '<div class="journal-label">✏️ How did you find out which fruit is heavier? Tell your steps. <span class="saved-dot" id="dot-think"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — Think: which fruit is heavier?" id="journal-think" oninput="autoSave(this,\'dot-think\')" placeholder=""></textarea>',
  cls='bl-yellow') + s[j:]
rep('Now build weights on a balance scale.', 'Next: on the Learn tab, the Math Crew shows two ways, and you repack Mrs. Mabel\'s raisins.')

# ── F. Learn: drop the flip cards and the leftover "SPLIT the bar" line and the old Balance Scale; video, the Crew, Jobs 2–4
i = s.index('<div aria-label="Daily vocabulary flash cards" class="vocab-section">'); j = block_end(s, i); s = s[:i] + s[j:]
i = s.index('<div class="callout callout-think" style="margin-bottom:14px;"><span class="callout-icon">🧠</span><p><strong>Try before the rule:</strong>')
j = block_end(s, i); k = s.index('<div class="activity bl-slate">', j); kend = block_end(s, k)
assert 'Balance Scale' in s[k:kend]
s = s[:i] + (video('learn') + CREW
 + act('mk-raisins', '#C56C3F', '🍇', 'Repack the Raisins: 45 oz = ? lb ? oz', 'Job 2 · Count by 16s and use a number bond',
   job('The Smudge dumped Mrs. Mabel\'s raisins into one big bin: <strong>45 oz</strong> of them. She sells raisins in 1-pound bags, and her labels use pounds and ounces. <strong>How many pounds and ounces is 45 oz?</strong>',
       ['Fill 1-pound bags: tap <strong>+ Fill a 1 lb bag</strong>. Each bag holds 16 oz. Stop before you go past 45.',
        'Fill in the number bond: 45 oz splits into the ounces in full bags and the leftover ounces.',
        'Type the weight in pounds and ounces.'])
   + tip('cora', 'Each bag is 16 ounces. Count by 16s: 16, 32 … and stop before you go past 45.') + model('raisins'))
 + act('mk-flour', '#3A6B9A', '🌾', 'Relabel the Flour: 5 lb 11 oz = ? oz', 'Job 3 · Read the scale, then change it to ounces',
   job('The flour sack\'s label is smudged. Mrs. Mabel\'s baker friend needs it in ounces, because his recipes only use ounces. <strong>How many ounces does the flour weigh?</strong>',
       ['Read the scale: type the flour\'s weight in pounds and ounces.',
        'Change the pounds to ounces. Each pound is 16 ounces, so multiply.',
        'Add the extra ounces. Type each answer in its box.'])
   + tip('felix', 'Pounds to ounces: multiply the pounds by 16. Then don\'t forget the extra ounces!') + model('flour'), cls='bl-slate', extra=' style="margin-top:16px;"')
 + act('mk-order', '#6B3FA0', '🧺', 'Fill the Order: 1 lb 12 oz + 2 lb 9 oz', 'Job 4 · Make the next pound, then add on the Trade Mat',
   job('A customer wants nuts and dried apples in one basket. The nuts weigh <strong>1 lb 12 oz</strong>. The apples weigh <strong>2 lb 9 oz</strong>. <strong>How much does the whole order weigh?</strong>',
       ['Warm up with the two "make the next pound" problems: use part of the ounces to fill the next pound.',
        'Build both weights on the Trade Mat. If the ounces reach 16 or more, trade 16 oz for 1 lb.',
        'Tap each fact in the story, then tap the part of the bar it tells about.',
        'Type the weight of the whole order in pounds and ounces.'])
   + tip('felix', 'Watch the ounces when you add. 16 ounces make a new pound. Not 10!') + model('next') + model('ordermat') + model('order'), cls='bl-violet', extra=' style="margin-top:16px;"')
 + slot('build')) + s[kend:]

# ── G. the weight chart → Mabel's Scale Board (the facts, the two ways), then the Do video, Study It, Job 5
BOARDSVG = ('<svg viewBox="0 0 640 230" class="mk-svg" role="img" aria-label="One pound split into 16 equal ounce boxes. 1 pound is 16 ounces.">'
 '<rect width="640" height="230" rx="12" fill="#FFF8EF"/>'
 '<rect x="40" y="40" width="560" height="36" fill="#2DB87A" stroke="#3B2417" stroke-width="3"/>'
 + ''.join('<path d="M%d 40v36" stroke="#3B2417" stroke-width="1.5"/>' % (40 + n * 35) for n in range(1, 16))
 + ''.join('<text x="%d" y="63" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="12" fill="#fff">1 oz</text>' % (57 + n * 35) for n in range(16))
 + '<path d="M40 92v12M600 92v12M40 98h560" stroke="#3A6B9A" stroke-width="3"/><text x="320" y="124" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="18" fill="#3A6B9A">1 lb = 16 oz</text>'
 '<text x="40" y="28" font-family="DotGothic16,Nunito" font-size="16" fill="#3B2417">one pound</text>'
 '<rect x="40" y="148" width="560" height="62" rx="10" fill="#FFFFFF" stroke="#F5D4BC" stroke-width="2"/>'
 '<text x="60" y="174" font-family="Nunito" font-weight="900" font-size="15" fill="#2DB87A">To ounces, multiply: pounds × 16 = ounces, then add the extra ounces</text>'
 '<text x="60" y="198" font-family="Nunito" font-weight="900" font-size="15" fill="#C56C3F">To pounds and ounces, count by 16s and keep the leftover ounces</text></svg>')
replace_block('<div class="key-concept" style="margin-top:16px;"><div class="key-concept-label">📐 The Weight Facts',
 '<div class="key-concept" id="mk-board-kc" style="margin-top:16px;"><div class="key-concept-label">📐 Mrs. Mabel\'s Scale Board</div>' + BOARDSVG
 + '<p><strong>Weight:</strong> 16 oz = 1 lb. Counting by 16s: 16, 32, 48, 64, 80, 96 …</p>'
 + tip('cora', 'Exact words: <b>trade</b> means swapping 16 oz for 1 lb, or 1 lb for 16 oz. The weight stays the same.') + '</div><div class="pq-vslot" data-slot="do"></div><!--WE-->')

# ── H. Picture It (it solved an IP problem) goes; Study It (subtracting with a trade) + Job 5 + the One Picture
i = s.index('<div class="activity bl-violet" style="margin-top:16px;"><div class="activity-head">'); j = block_end(s, i)
assert 'Picture It' in s[i:j]
s = s[:i] + s[j:]
i = s.index('<div class="activity bl-slate"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Worked Example:'); j = block_end(s, i)
WE = ('<div class="activity bl-slate" id="mk-worked"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Study It: How Mrs. Mabel Split Her Sugar</div><div class="activity-sub">Already solved for you. Read it, then split a sack yourself.</div></div></div><div class="activity-body">'
 '<p style="margin:0 0 10px;font-weight:700;color:#3A4A6B;">👀 Nothing to type here. This problem is solved two ways. Both ways get the same answer. Read the one that makes more sense to you.</p>'
 '<div class="task-box"><div class="task-label">Problem</div><p>Mrs. Mabel has a sack of sugar that weighs <strong>8 lb 3 oz</strong>. She scoops out <strong>1 lb 10 oz</strong>. How much sugar is left in the sack?</p></div>'
 + tip('atlas', 'You can\'t take 10 ounces away from 3 ounces. So first, trade 1 pound for 16 ounces.') +
 '<div class="we-two"><div class="we-way"><h5>Way 1: pounds and ounces</h5><ol><li>Trade 1 pound for 16 ounces. 8 lb 3 oz becomes 7 lb 19 oz.</li><li>Take away the ounces: 19 oz − 10 oz = 9 oz.</li><li>Take away the pounds: 7 lb − 1 lb = 6 lb.</li><li>The sugar left is <b>6 lb 9 oz</b>.</li></ol></div>'
 '<div class="we-way"><h5>Way 2: all ounces</h5><ol><li>8 lb 3 oz is 131 oz. (8 × 16 = 128, and 3 more)</li><li>1 lb 10 oz is 26 oz. (1 × 16 = 16, and 10 more)</li><li>Take away: 131 oz − 26 oz = 105 oz.</li><li>Change back: 96 oz make 6 lb, and 9 oz are left. The sugar left is <b>6 lb 9 oz</b>.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Check it: put the scoop back. 6 lb 9 oz + 1 lb 10 oz = 7 lb 19 oz. 19 oz is 1 lb 3 oz, so that is 8 lb 3 oz, the whole sack. ✓</p>')
BIG = 'To compare, add or subtract weights with two units, pick a way: work in pounds and ounces and trade 16 ounces for 1 pound when you need to, or change everything to ounces first (pounds × 16, then add the extra ounces). Both ways give the same answer.'
CHAIN = ('<svg viewBox="0 0 520 150" class="mk-svg" role="img" aria-label="Pounds times 16 make ounces. Example: 7 pounds 3 ounces is 112 ounces plus 3 ounces, 115 ounces. Or stay in pounds and ounces and trade 16 ounces for a pound.">'
 '<rect width="520" height="150" rx="12" fill="#FFF8EF"/>'
 '<rect x="60" y="24" width="130" height="44" rx="8" fill="#2DB87A" stroke="#3B2417" stroke-width="3"/><text x="125" y="53" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="20" fill="#fff">pounds</text>'
 '<rect x="330" y="24" width="130" height="44" rx="8" fill="#F28C28" stroke="#3B2417" stroke-width="3"/><text x="395" y="53" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="20" fill="#fff">ounces</text>'
 '<path d="M200 38h118" stroke="#C56C3F" stroke-width="4" marker-end="url(#opar)"/><text x="259" y="22" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#C56C3F">× 16</text>'
 '<path d="M320 58h-118" stroke="#3A6B9A" stroke-width="4" marker-end="url(#opar2)"/><text x="259" y="82" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#3A6B9A">count by 16s</text>'
 '<defs><marker id="opar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#C56C3F"/></marker><marker id="opar2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#3A6B9A"/></marker></defs>'
 '<text x="260" y="112" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#3B2417">7 lb 3 oz → 7 × 16 = 112 oz → 112 oz + 3 oz = 115 oz</text>'
 '<text x="260" y="136" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#3A6B9A">Or stay in pounds and ounces: trade 16 oz for 1 lb when you need to.</text></svg>')
ONEPIC = ('<div class="key-concept pq-onepic" id="mk-onepic" style="margin-top:14px;"><div class="key-concept-label">⚖️ The Whole Lesson in One Picture</div>'
 '<p class="op-big"><strong>' + BIG + '</strong></p>' + CHAIN
 + '<div class="journal-label">✏️ Put the big idea in your own words. Use an example of your own. <span class="saved-dot" id="dot-big"></span></div>'
 '<textarea class="journal-box" data-label="Learn — The big idea in my own words" id="journal-big" oninput="autoSave(this,\'dot-big\')" placeholder=""></textarea></div>')
s = s[:i] + slot('deliver') + ONEPIC + s[j:]
SPLIT = act('mk-rice', '#C56C3F', '🍚', 'Split the Rice: 5 lb 3 oz − 2 lb 7 oz', 'Job 5 · Take away on the Trade Mat',
  job('A sack of rice weighs <strong>5 lb 3 oz</strong>. Mrs. Mabel scoops out <strong>2 lb 7 oz</strong> for the school kitchen. <strong>How much rice is left in the sack?</strong>',
      ['Build the sack on the mat: 5 pound discs and 3 ounce discs.',
       'Take away the pounds first: move 2 pound discs to the take-away box.',
       'Take away 7 ounces. There are only 3, so break 1 pound into 16 ounces first, then move 7.',
       'Read what is left on the mat. Type it in pounds and ounces.'])
  + tip('cora', 'Not enough ounces to take away? Break 1 pound into 16 ounces. Then there are plenty.')
  + model('rice'), cls='bl-slate', extra=' style="margin-top:16px;"')
s = s.replace('<!--WE-->', WE + '</div></div>' + SPLIT, 1)  # Study It right after the Do video, then Split the Rice, then the deliver window and the One Picture
rep('You balanced the scale. Now practice more weights.', 'Five store jobs down. One to go: prove the Smudge\'s price board wrong.')

# ── I. Show What You Know: per-part answer boxes, bonus, prove it, the last game window, What's Next
for a, b in [('<div class="activity-sub">For each problem, convert between customary units of weight. Show your work.</div>', '<div class="activity-sub">Type each answer in its own box.</div>'),
             ('<p>Use the chart: 16 oz = 1 lb, 2,000 lb = 1 ton.</p>', '<p>Use the board: 16 oz = 1 lb. To change pounds to ounces, multiply by 16.</p>'),
             ('<p><strong>Before each problem, ask:</strong> Am I converting ounces to pounds, or pounds to tons? Does my answer make sense for something that heavy or that light?</p>', '<p>Show your thinking on paper if it helps, then type each answer.</p>')]:
    rep(a, b)
SW = ('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Change the units.</strong> <span class="saved-dot" id="dot-1"></span></p><div class="ans-parts">'
 + part('Problem 1 (a)', '(a) 6 lb 5 oz = ' + box('1a', 'Problem 1 a, ounces', 'oz'))
 + part('Problem 1 (b)', '(b) 85 oz = ' + box('1b1', 'Problem 1 b, pounds', 'lb') + ' ' + box('1b2', 'Problem 1 b, ounces', 'oz'))
 + part('Problem 1 (c)', '(c) 30 oz = ' + box('1c1', 'Problem 1 c, pounds', 'lb') + ' ' + box('1c2', 'Problem 1 c, ounces', 'oz')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">2</span><strong>Add and subtract weights.</strong> <span class="saved-dot" id="dot-2"></span></p><div class="ans-parts">'
 + part('Problem 2 (a)', '(a) 3 lb 10 oz + 1 lb 13 oz = ' + box('2a1', 'Problem 2 a, pounds', 'lb') + ' ' + box('2a2', 'Problem 2 a, ounces', 'oz'))
 + part('Problem 2 (b)', '(b) 6 lb 1 oz − 2 lb 6 oz = ' + box('2b1', 'Problem 2 b, pounds', 'lb') + ' ' + box('2b2', 'Problem 2 b, ounces', 'oz')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">3</span><strong>Word problem: the bean sack.</strong> Mrs. Mabel\'s sack of beans weighs 5 lb 2 oz. She scoops out 1 lb 6 oz for a customer. <span class="saved-dot" id="dot-3"></span></p><div class="ans-parts">'
 + part('Problem 3 (a) in pounds and ounces', '(a) How much is left in the sack? ' + box('3a1', 'Problem 3 a, pounds', 'lb') + ' ' + box('3a2', 'Problem 3 a, ounces', 'oz'))
 + part('Problem 3 (b) in ounces', '(b) How many ounces is that? ' + box('3b', 'Problem 3 b, ounces', 'oz')) + '</div></div>')
i = s.find('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Composite to ounces.</strong>'); j = s.find('<div class="activity bl-slate" style="margin-top:18px;border-left-color:#0E8A8C;">', i); assert i > 0 and j > i
s = s[:i] + tip('opti', 'Hoo! Before each problem, ask: do I need to trade? 16 or more ounces make a new pound. Too few ounces to take away? Trade 1 pound for 16 ounces.') + SW + model('bonus') + (
 '<div class="activity bl-violet" id="mk-prove"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">⚖️</div><div><div class="activity-title">Last Job: Is 3 lb 19 oz the same as 4 lb 9 oz?</div><div class="activity-sub">Job 6 · Check the Smudge\'s price board on the scale</div></div></div><div class="activity-body">'
 + job('The Smudge chalked a note on Mrs. Mabel\'s price board: <strong>3 lb 19 oz = 4 lb 9 oz</strong>. If customers believe it, every bag in the store will be weighed wrong. <strong>Is 3 lb 19 oz really the same as 4 lb 9 oz?</strong>',
      ['Put <strong>3 lb 19 oz</strong> on the scale: 3 one-pound weights and 19 one-ounce weights.',
       'Read where the needle stops: first the pounds, then the ounce marks after them.',
       'Type the reading in pounds and ounces. Is it 4 lb 9 oz?'])
 + tip('cora', 'The scale doesn\'t care how you stack the weights. It shows the real weight.') + model('prove') + '</div></div>' + slot('fix') + video('wrap')) + s[j:]
ins_before('<div class="gathered-box">', tip('cora', 'Check every answer for a unit. "4 3" isn\'t finished. "4 lb 3 oz" is.'))

# ── J. small text fixes (jargon, What's Next, checklist)
for a, b in [('<div class="fluency-head-label">FLUENCY WARM-UP</div><div class="fluency-head-title">Estimation — Choose the Best Estimate</div>', '<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">Multiplication Facts</div>'),
             ('Warm up your fact fluency before today’s lesson. Work through these, then check your answers.', 'Warm up with these multiplication facts before today’s lesson. Type each answer, then check.'),
             ('data-label="Fluency Warm-Up (Estimation — Choose the Best Estimate)"', 'data-label="Fact Warm-Up (Multiplication Facts)"'),
             ('<div class="activity-title">Connection Forward: Customary Weight</div><div class="activity-sub">What comes next in Unit 10</div>', '<div class="activity-title">What\'s Next</div><div class="activity-sub">Coming up in Unit 10</div>'),
             ('Next lesson, we measure CAPACITY — how much liquid something holds — with cups, pints, quarts, and gallons all nested inside each other.',
              'Next lesson, you\'ll climb to the Hilltop Dairy and measure capacity: how much a jug or a pail can hold, in cups, pints, quarts and gallons. The trades change again, and the two ways you used today still work.'),
             ('<span>I completed both quick checks above.</span>', '<span>I finished all six store jobs.</span>'),
             ('<span>I showed my model or my steps for each problem.</span>', '<span>I typed an answer in every box.</span>')]:
    rep(a, b)
s = re.sub(r'var FLUENCY_TITLE = "Estimation — Choose the Best Estimate";', 'var FLUENCY_TITLE = "Multiplication Facts";', s)
answer_boxes_save()
