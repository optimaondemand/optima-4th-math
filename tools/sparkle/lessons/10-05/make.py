# Lesson 4.10.05 · Units of Time · Level 10 "Metric Market", the Clock Tower (lesson 5 of 7)
# Dimensions 4B Chapter 10 Lesson 5 + the IP (1 Nov 2026): seconds, minutes, hours, days; going down (× 60, × 24, chained),
# going up (group by 60 with a leftover), compound h min ↔ min, and a "half as long" word problem. One hands-on Clock Hands
# job per IP direction, new numbers. Dividing by 60 isn't taught yet, so going up counts full turns (groups of 60).
# Run with: python3 tools/sparkle/build_lesson.py 10-05   (never run this file directly)
import re

def job(story, steps):
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
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-head-title">).*?(</div>)', r'\1Which is longer, 2 hours 10 minutes or 125 minutes? How can you be sure?\2', intro, count=1, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-body">).*?(</div></div><div class="intro-card theme-objectives">)',
  r'\1<p class="pq-eq-note">Some amounts of time use two units at once, like 2 hours 10 minutes (we write 2 h 10 min). You will find two ways to work with them. You will prove the answer by the end of the lesson.</p>\2', intro, flags=re.S)
intro = re.sub(r'(<div class="intro-card theme-objectives">.*?<div class="intro-card-body">).*$',
  r'\1<div class="obj-line"><span class="obj-icon">🕐</span><span><strong>Know the time facts</strong> for seconds, minutes, hours and days.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">⬇️</span><span><strong>Change to a smaller unit</strong> by multiplying, one step at a time.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">⬆️</span><span><strong>Change minutes to hours and minutes</strong> by counting full hours and keeping the leftover minutes.</span></div></div></div></div>', intro, flags=re.S)
s = s[:i] + '<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>' + intro + '</details>' + s[j:]

# ── A. Think video + the tower board
replace_block('<div class="video-placeholder-wrap">\n<!-- slot: g4math-10-05 -->', video('think') + '\n<div class="mk-board-mount"></div>')

# ── B. the fact warm-up: fraction comparisons (another unit's skill) → facts that make 60 and 24
FACTS = [('2 × 60', '120'), ('5 × 60', '300'), ('7 × 60', '420'), ('10 × 60', '600'), ('15 × 4', '60'),
         ('12 × 5', '60'), ('30 × 2', '60'), ('2 × 24', '48'), ('4 × 24', '96'), ('20 × 3', '60')]
i = s.index('<div class="fluency-grid" id="fluencyGrid">'); j = block_end(s, i)
s = s[:i] + '<div class="fluency-grid" id="fluencyGrid">' + ''.join(
    '<div class="fluency-item"><span class="fluency-q">%s =</span><input autocomplete="off" class="fluency-input" data-answer="%s" inputmode="numeric" type="text" aria-label="%s"/></div>\n' % (q, a, q)
    for q, a in FACTS) + '</div>' + s[j:]

# ── C. the old Math Crew card leaves the Warm-Up
i = s.index('<div class="activity bl-violet"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div>'); j = block_end(s, i); s = s[:i] + s[j:]
CREW = ('<div class="activity bl-violet" id="mk-crew"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div><div><div class="activity-title">The Math Crew: Two Ways</div>'
 '<div class="activity-sub">Which is longer: Time A at 2 h 10 min, or Time B at 125 min?</div></div></div><div class="activity-body">'
 '<p>The Crew found the answer two different ways. Walk to each of them in the game above to hear their way, or read it here. Which way would you pick?</p>'
 '<div class="bubble-row">'
 '<div class="bubble atlas"><div class="bubble-avatar">A</div><div class="bubble-body"><div class="bubble-name">Atlas: hours and minutes</div><div class="bubble-text">"I wind Time B\'s 125 minutes and count the full turns: 60, 120. That\'s 2 hours, and 5 minutes are left. So Time B is 2 h 5 min. Both are 2 hours, and 10 minutes is 5 more than 5 minutes. Time A is longer by 5 minutes."</div></div></div>'
 '<div class="bubble felix"><div class="bubble-avatar">F</div><div class="bubble-body"><div class="bubble-name">Felix: all minutes</div><div class="bubble-text">"I change Time A to minutes. 2 h is 2 × 60 = 120 min, and 10 more makes 130 min. 130 − 125 = 5. Time A is longer by 5 minutes. Same answer!"</div></div></div>'
 '</div><div class="bubble-row">'
 '<div class="bubble hazel"><div class="bubble-avatar">H</div><div class="bubble-body"><div class="bubble-name">Hazel: picture the clock</div><div class="bubble-text">"I picture the tower clock. Every full turn of the minute hand is 1 hour, 60 little marks. So 2 hours is 2 full turns. Time A goes 10 marks past 2 turns, and Time B only 5."</div></div></div>'
 '<div class="bubble cora"><div class="bubble-avatar">C</div><div class="bubble-body"><div class="bubble-name">Cora: 60, not 100</div><div class="bubble-text">"An hour is 60 minutes, not 100. So 2 h 10 min is not 210 minutes. Time trades 60 at a time."</div></div></div>'
 '</div><div class="callout callout-tip" style="margin-top:8px;"><span class="callout-icon">💡</span><p>Crew rule: <em>Picture the clock (Hazel). Pick a way: count full hours, or change everything to minutes (Atlas, Felix). Trade 60, not 100 (Cora).</em></p></div>'
 '<div class="journal-label">✏️ Which Crew way is most like yours? Which way would you use for a bigger number, like 150 min, and why? <span class="saved-dot" id="dot-compare"></span></div>'
 '<textarea class="journal-box" data-label="Learn — My way and the Crew\'s ways" id="journal-compare" oninput="autoSave(this,\'dot-compare\')" placeholder=""></textarea></div></div>')

# ── D. the old "Time Comparisons" pick warm-up → Job 1 Wind the Clock (Clock Hands) + the fix window + Mental Math "Make an hour"
replace_block('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🔎</div>',
 act('mk-wind', '#F5C518;color:#0E1C42', '🕐', 'Warm-Up: Wind the Clock', 'Job 1 · Wake up the Clock Tower',
   job('The Smudge stopped the Clock Tower, and clockkeeper Otto needs it running again. The clock counts time in seconds, minutes and hours. Its day wheel counts hours into days: 24 hours make a day, and 7 days make a week. <strong>How many seconds make a minute? How many minutes make an hour?</strong>',
       ['Round 1: wind the second hand. Drag the red hand clockwise, or tap the buttons, until it makes one full turn. Type how many seconds that was.',
        'Round 2: wind the minute hand the same way, one full turn. Type how many minutes make an hour.',
        'Write the facts on paper as you go. You will use them all lesson.'])
   + tip('cora', 'Careful: an hour is 60 minutes, not 100. Time doesn\'t trade by tens and hundreds.') + model('wind')
   , cls='bl-yellow')
 + slot('fix')
 + '<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🧠</div><div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, four quick problems</div></div></div><div class="activity-body">'
 + tip('felix', '60 minutes make an hour. So find the number that goes with yours to make 60.') + model('mental') + '</div></div>')

# ── E. Think About It → how long was the clock stopped? (any method, no teaching yet)
i = s.index('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🤔</div>'); j = block_end(s, i)
s = s[:i] + act('mk-think', '#F5C518;color:#0E1C42', '🤔', 'Think About It: How Long Was It Stopped?', 'Try it your way first',
  '<div class="callout callout-think"><span class="callout-icon">⏱</span><p>The tower\'s log says the clock was stopped for <strong>2 h 10 min</strong>. Call that Time A. Otto thinks it was stopped for <strong>125 min</strong>. Call that Time B. Which time is longer, and by how many minutes?</p></div>'
  + '<div class="journal-label">👀 What do you notice about the two times? What do you wonder? <span class="saved-dot" id="dot-notice"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — I notice, I wonder" id="journal-notice" oninput="autoSave(this,\'dot-notice\')" placeholder="I notice… I wonder…"></textarea>'
  + tip('atlas', 'One time is in hours and minutes. The other is only in minutes. How can you compare them fairly?')
  + model('think')
  + '<div class="journal-label">✏️ How did you find out which time is longer? Tell your steps. <span class="saved-dot" id="dot-think"></span></div>'
  + '<textarea class="journal-box" data-label="Warm-Up — Think: which time is longer?" id="journal-think" oninput="autoSave(this,\'dot-think\')" placeholder=""></textarea>',
  cls='bl-yellow') + s[j:]
rep('Now stack time on the timeline.', 'Next: on the Learn tab, the Math Crew shows two ways, and you restart the clock\'s hands.')

# ── F. Learn: drop the flip cards, the leftover "SPLIT the bar" line and the old Time Stacker; video, the Crew, Jobs 2–4
i = s.index('<div aria-label="Daily vocabulary flash cards" class="vocab-section">'); j = block_end(s, i); s = s[:i] + s[j:]
i = s.index('<div class="callout callout-think" style="margin-bottom:14px;"><span class="callout-icon">🧠</span><p><strong>Try before the rule:</strong>')
j = block_end(s, i); k = s.index('<div class="activity bl-slate">', j); kend = block_end(s, k)
assert 'Time Stacker' in s[k:kend]
s = s[:i] + (video('learn') + slot('crew') + CREW
 + act('mk-hands', '#C56C3F', '⏱', 'Restart the Hands: 7 min 25 s = ? s · 5 h 15 min = ? min', 'Job 2 · Change to a smaller unit: multiply',
   job('Otto\'s winding key only counts small units. The second hand must be wound forward <strong>7 min 25 s</strong>, and the minute hand must be wound forward <strong>5 h 15 min</strong>. <strong>How many seconds, and how many minutes, should he wind?</strong>',
       ['Second hand: wind 7 full turns and 25 more seconds. After one turn by hand, you can add a whole turn at once. Type the total seconds.',
        'Minute hand: wind 5 full turns and 15 more minutes. Type the total minutes.',
        'Two quick ones below: 8 min in seconds, and 10 h in minutes.'])
   + tip('felix', 'To change to a smaller unit, multiply the big unit by 60. Then add the extra small units!') + model('hands'))
 + slot('find')
 + act('mk-group', '#3A6B9A', '🧮', 'Group the Minutes: 145 min = ? h ? min', 'Job 3 · Change to hours and minutes: count full hours',
   job('The train clerk wrote the noon train\'s trip as <strong>145 min</strong>. The new timetable shows hours and minutes. <strong>How many hours and minutes is 145 min?</strong>',
       ['Warm up with the two "make the next hour" problems: use part of the minutes to fill the next hour.',
        'Wind 145 minutes on the clock. Watch for each full turn: that is 1 hour.',
        'Count the full turns and the minutes left over. Type the hours and minutes.'])
   + tip('atlas', 'Count by 60s: 60, 120 … stop before you go past. The full turns are the hours.') + model('next') + model('group'), cls='bl-slate', extra=' style="margin-top:16px;"')
 + act('mk-days', '#6B3FA0', '📅', 'The Day Wheel and the Long Chain', 'Job 4 · Days to hours, then hours to seconds',
   job('The tower\'s day wheel must turn forward <strong>3 days</strong>. Then the chime gear needs <strong>2 hours</strong> of winding, and it counts only in seconds. <strong>How many hours is 3 days? How many seconds is 2 hours?</strong>',
       ['Turn the day wheel 3 full turns. Each turn is 1 day, 24 hours. Type the hours.',
        'Change 2 hours to minutes, then change those minutes to seconds. One step per box.',
        'One more: 150 minutes in seconds.'])
   + tip('cora', 'Days use 24, not 60! Hours to minutes and minutes to seconds use 60.') + model('days'), cls='bl-violet', extra=' style="margin-top:16px;"')
 + slot('deliver')) + s[kend:]

# ── G. the time chart → Otto's Time Board, then the Do video, Study It, Job 5
def rung(x, lab, col):
    return ('<rect x="%d" y="86" width="132" height="40" rx="8" fill="%s" stroke="#3B2417" stroke-width="3"/>'
            '<text x="%d" y="113" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="18" fill="#fff">%s</text>') % (x, col, x + 66, lab)
UNITS = [('day', '#2F5D8A'), ('hour', '#3A6FB0'), ('minute', '#2DB87A'), ('second', '#E07B39')]
STEPS = ['24', '60', '60']
BOARDSVG = ('<svg viewBox="0 0 640 262" class="mk-svg" role="img" aria-label="The time steps: 1 day is 24 hours, 1 hour is 60 minutes, 1 minute is 60 seconds. Going down, multiply. Going up, count full groups and keep the leftover.">'
 '<rect width="640" height="262" rx="12" fill="#FFF8EF"/>'
 '<defs><marker id="tbd" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#C56C3F"/></marker><marker id="tbu" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#3A6B9A"/></marker></defs>'
 + ''.join(rung(20 + n * 156, lab, col) for n, (lab, col) in enumerate(UNITS))
 + ''.join('<text x="%d" y="52" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="17" fill="#C56C3F">× %s</text><path d="M%d 66 h96" stroke="#C56C3F" stroke-width="3" marker-end="url(#tbd)"/>'
           '<path d="M%d 146 h-96" stroke="#3A6B9A" stroke-width="3" marker-end="url(#tbu)"/><text x="%d" y="170" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#3A6B9A">groups of %s</text>'
           % (164 + n * 156, st, 116 + n * 156, 212 + n * 156, 164 + n * 156, st) for n, st in enumerate(STEPS))
 + '<text x="20" y="28" font-family="DotGothic16,Nunito" font-size="16" fill="#3B2417">Otto\'s time steps: big → small</text>'
 '<rect x="20" y="192" width="600" height="56" rx="10" fill="#FFFFFF" stroke="#F5D4BC" stroke-width="2"/>'
 '<text x="36" y="215" font-family="Nunito" font-weight="900" font-size="15" fill="#C56C3F">Going down (to a smaller unit): multiply, then add the extra small units.</text>'
 '<text x="36" y="238" font-family="Nunito" font-weight="900" font-size="15" fill="#3A6B9A">Going up (to a bigger unit): count full groups of 60 (or 24). The leftover stays.</text></svg>')
replace_block('<div class="key-concept" style="margin-top:16px;"><div class="key-concept-label">📐 The Time Chart',
 '<div class="key-concept" id="mk-board-kc" style="margin-top:16px;"><div class="key-concept-label">📐 Otto\'s Time Board</div>' + BOARDSVG
 + '<p><strong>The facts:</strong> 1 min = 60 s · 1 h = 60 min · 1 day = 24 h · 1 week = 7 days.</p>'
 + tip('cora', 'Each arrow is one step. To go from hours to seconds, do both steps, one after the other.') + '</div><div class="pq-vslot" data-slot="do"></div><!--WE-->')

# ── H. Picture It (it solved IP 2b) goes; Study It (half of a time) + Job 5 + the One Picture
i = s.index('<div class="activity bl-violet" style="margin-top:16px;"><div class="activity-head">'); j = block_end(s, i)
assert 'Picture It' in s[i:j]
s = s[:i] + s[j:]
i = s.index('<div class="activity bl-slate"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Worked Example:'); j = block_end(s, i)
WE = ('<div class="activity bl-slate" id="mk-worked"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Study It: How Otto Split His Practice</div><div class="activity-sub">Already solved for you. Read it, then time the express train yourself.</div></div></div><div class="activity-body">'
 '<p style="margin:0 0 10px;font-weight:700;color:#3A4A6B;">👀 Nothing to type here. This problem is solved two ways. Both ways get the same answer. Read the one that makes more sense to you.</p>'
 '<div class="task-box"><div class="task-label">Problem</div><p>Otto rings the bells for <strong>1 h 40 min</strong> each day. His helper rings them for half as long. How long does the helper ring the bells?</p></div>'
 + tip('atlas', 'You can\'t split 1 hour and 40 minutes in half as easily as one number. So try changing it first.') +
 '<div class="we-two"><div class="we-way"><h5>Way 1: hours and minutes</h5><ol><li>Change the 1 hour to 60 minutes. 60 + 40 = 100, so 1 h 40 min is the same as 100 min.</li><li>Half of 100 min is 50 min.</li><li>The helper rings for <b>50 min</b>.</li></ol></div>'
 '<div class="we-way"><h5>Way 2: all minutes</h5><ol><li>1 h 40 min is 100 min. (1 × 60 = 60, and 40 more)</li><li>Half of 100 min: 100 ÷ 2 = 50 min.</li><li>The helper rings for <b>50 min</b>.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Check it: put the two halves back together. 50 min + 50 min = 100 min. 100 min is 60 min and 40 min, so it is 1 h 40 min, the whole practice. ✓</p>')
BIG = ('To change a time to another unit, pick a way. Going down to a smaller unit, multiply (hours × 60 = minutes, minutes × 60 = seconds, days × 24 = hours) '
       'and add the extra small units. Going up to a bigger unit, count full groups of 60 (or 24) and keep the leftover. Both ways give the same answer.')
def face(cx, cy, r, mins, lab):
    import math
    a = mins / 60 * 2 * math.pi
    return ('<circle cx="%d" cy="%d" r="%d" fill="#FFFFFF" stroke="#3B2417" stroke-width="3"/>' % (cx, cy, r)
            + ('<path d="M%d %d L%d %d A%d %d 0 %d 1 %.1f %.1f Z" fill="rgba(224,123,57,.3)"/>' % (cx, cy, cx, cy - r + 4, r - 4, r - 4, 1 if mins > 30 else 0, cx + (r - 4) * math.sin(a), cy - (r - 4) * math.cos(a)) if 0 < mins < 60 else '')
            + ('<circle cx="%d" cy="%d" r="%d" fill="rgba(47,93,138,.25)"/>' % (cx, cy, r - 4) if mins == 60 else '')
            + '<text x="%d" y="%d" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#3B2417">%s</text>' % (cx, cy + r + 18, lab))
PIC = ('<svg viewBox="0 0 600 230" class="mk-svg" role="img" aria-label="Three clock faces: two full turns of 60 minutes each and one face with 25 minutes shaded. 2 full turns and 25 minutes is 2 hours 25 minutes, or 145 minutes. Example: 7 h 35 min is 7 × 60 = 420 and 35 more, 455 minutes.">'
 '<rect width="600" height="230" rx="12" fill="#FFF8EF"/>'
 + face(70, 74, 46, 60, 'full turn: 60 min') + face(190, 74, 46, 60, 'full turn: 60 min') + face(310, 74, 46, 25, '25 min')
 + '<text x="190" y="164" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#3B2417">2 full turns + 25 min = 2 h 25 min</text>'
 '<text x="380" y="52" font-family="Nunito" font-weight="900" font-size="16" fill="#C56C3F">Down: × 60 (days × 24),</text>'
 '<text x="380" y="74" font-family="Nunito" font-weight="900" font-size="16" fill="#C56C3F">then add the extra</text>'
 '<text x="380" y="108" font-family="Nunito" font-weight="900" font-size="16" fill="#3A6B9A">Up: count full 60s,</text>'
 '<text x="380" y="130" font-family="Nunito" font-weight="900" font-size="16" fill="#3A6B9A">keep the leftover</text>'
 '<text x="300" y="200" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#3B2417">7 h 35 min → 7 × 60 = 420 → 420 + 35 = 455 min</text>'
 '<text x="300" y="222" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#3A6B9A">Back up: 455 min is 7 full 60s (420) and 35 left: 7 h 35 min.</text></svg>')
ONEPIC = ('<div class="key-concept pq-onepic" id="mk-onepic" style="margin-top:14px;"><div class="key-concept-label">🕐 The Whole Lesson in One Picture</div>'
 '<p class="op-big"><strong>' + BIG + '</strong></p>' + PIC
 + '<div class="journal-label">✏️ Put the big idea in your own words. Use an example of your own. <span class="saved-dot" id="dot-big"></span></div>'
 '<textarea class="journal-box" data-label="Learn — The big idea in my own words" id="journal-big" oninput="autoSave(this,\'dot-big\')" placeholder=""></textarea></div>')
s = s[:i] + ONEPIC + s[j:]
EXPRESS = act('mk-express', '#C56C3F', '🚂', 'The Express Train: half of 2 h 50 min', 'Job 5 · A word problem: change, halve, change back',
  job('The slow train to Eastside takes <strong>2 h 50 min</strong>. The new express train takes <strong>half as long</strong>. The timetable needs the express time in hours and minutes. <strong>How long is the express trip?</strong>',
      ['Change the slow train\'s time to minutes.',
       'Tap each fact in the story, then tap the part of the bar it tells about. Find half and type it in minutes.',
       'Change your answer back to hours and minutes.'])
  + tip('hazel', 'Picture the slow trip as one bar cut into 2 equal parts. One part is the express.')
  + model('express'), cls='bl-slate', extra=' style="margin-top:16px;"')
s = s.replace('<!--WE-->', WE + '</div></div>' + EXPRESS, 1)
rep('You stacked time. Now practice with new lengths.', 'Five tower jobs down. One to go: fix the Smudge\'s timetable.')

# ── I. Show What You Know
for a, b in [('<div class="activity-sub">For each problem, convert between units of time. Show your work.</div>', '<div class="activity-sub">Type each answer in its own box.</div>'),
             ('<p>Use the chart: 60 sec = 1 min, 60 min = 1 hr, 24 hr = 1 day, 7 days = 1 week.</p>', '<p>Use Otto\'s board: 1 min = 60 s, 1 h = 60 min, 1 day = 24 h.</p>'),
             ('<div class="callout callout-think"><span class="callout-icon">🧠</span><p><strong>Before each problem, ask:</strong> Which units am I converting between — seconds, minutes, hours, days, or weeks — and which fact on the chart connects them?</p></div>', '<p>Show your thinking on paper if it helps, then type each answer.</p>')]:
    rep(a, b)
SW = ('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Change to a smaller unit.</strong> <span class="saved-dot" id="dot-1"></span></p><div class="ans-parts">'
 + part('Problem 1 (a)', '(a) 5 min = ' + box('1a', 'Problem 1 a, seconds', 's'))
 + part('Problem 1 (b)', '(b) 3 min 35 s = ' + box('1b', 'Problem 1 b, seconds', 's'))
 + part('Problem 1 (c)', '(c) 8 h 50 min = ' + box('1c', 'Problem 1 c, minutes', 'min'))
 + part('Problem 1 (d)', '(d) 5 days = ' + box('1d', 'Problem 1 d, hours', 'h')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">2</span><strong>Change to a bigger unit.</strong> <span class="saved-dot" id="dot-2"></span></p><div class="ans-parts">'
 + part('Problem 2 (a)', '(a) 110 min = ' + box('2a1', 'Problem 2 a, hours', 'h') + ' ' + box('2a2', 'Problem 2 a, minutes', 'min'))
 + part('Problem 2 (b)', '(b) 95 min = ' + box('2b1', 'Problem 2 b, hours', 'h') + ' ' + box('2b2', 'Problem 2 b, minutes', 'min')) + '</div></div>'
 + '<div class="q-block"><p class="q-text"><span class="q-num">3</span><strong>Word problem: the bell ringers.</strong> Mia practices the bells for 5 h 30 min. Her brother practices half as long. <span class="saved-dot" id="dot-3"></span></p><div class="ans-parts">'
 + part('Problem 3 (a) in minutes', '(a) How many minutes does Mia practice? ' + box('3a', 'Problem 3 a, minutes', 'min'))
 + part('Problem 3 (b) in hours and minutes', '(b) How long does her brother practice? ' + box('3b1', 'Problem 3 b, hours', 'h') + ' ' + box('3b2', 'Problem 3 b, minutes', 'min')) + '</div></div>')
i = s.find('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Small to big.</strong>'); j = s.find('<div class="activity bl-slate" style="margin-top:18px;border-left-color:#0E8A8C;">', i); assert i > 0 and j > i
s = s[:i] + tip('opti', 'Hoo! Before each problem, ask: am I going to a smaller unit (multiply) or a bigger one (count full 60s)? Hours and minutes trade 60, days and hours trade 24.') + SW + model('bonus') + (
 '<div class="activity bl-violet" id="mk-prove"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">🚉</div><div><div class="activity-title">Last Job: Is 1 h 75 min finished?</div><div class="activity-sub">Job 6 · Fix the Smudge\'s timetable</div></div></div><div class="activity-body">'
 + job('The Smudge scribbled on the station timetable: the river train now says <strong>1 h 75 min</strong>. The station master says a time is never written that way. <strong>What should the timetable say?</strong>',
      ['The clock already shows 1 hour. Wind 75 more minutes.',
       'Watch for each full turn of the minute hand. Each one is 1 hour.',
       'Count the full turns and the minutes past. Type what the timetable should say.'])
 + tip('cora', 'Every 60 minutes make another hour. A time is never written with 60 or more minutes in it.') + model('prove') + '</div></div>' + slot('chime') + video('wrap')) + s[j:]
ins_before('<div class="gathered-box">', tip('cora', 'Check every answer for a unit. "2 15" is missing its units. "2 h 15 min" is clear.'))

# ── J. small text fixes (jargon, What's Next, checklist)
for a, b in [('<div class="fluency-head-label">FLUENCY WARM-UP</div><div class="fluency-head-title">Fraction Comparisons</div>', '<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">Facts with 60 and 24</div>'),
             ('Warm up your fact fluency before today’s lesson. Work through these, then check your answers.', 'Warm up with these multiplication facts before today’s lesson. Type each answer, then check.'),
             ('data-label="Fluency Warm-Up (Fraction Comparisons)"', 'data-label="Fact Warm-Up (Facts with 60 and 24)"'),
             ('<div class="activity-title">Connection Forward: Units of Time</div><div class="activity-sub">What comes next in Unit 10</div>', '<div class="activity-title">What\'s Next</div><div class="activity-sub">Coming up in Unit 10</div>'),
             ('Next lesson, we bring fractions and measurement together — measuring to the nearest fraction of an inch on a real ruler.',
              'Next lesson, you\'ll visit the night market and bring fractions into measurement: a part of a foot in inches, or a part of a pound in ounces.'),
             ('<span>I completed both quick checks above.</span>', '<span>I finished all six tower jobs.</span>'),
             ('<span>I showed my model or my steps for each problem.</span>', '<span>I typed an answer in every box.</span>')]:
    rep(a, b)
s = re.sub(r'var FLUENCY_TITLE = "Fraction Comparisons";', 'var FLUENCY_TITLE = "Facts with 60 and 24";', s)
answer_boxes_save()
