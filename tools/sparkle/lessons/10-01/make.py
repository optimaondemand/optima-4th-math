# Lesson 4.10.01 · Metric Units of Measurement · Level 10 "Metric Market" (lesson 1 of 7)
# Dimensions 4B Chapter 10 Lesson 1 shape (rebuilt 26 Oct 2026): computing with two-unit amounts, two methods.
# Run with: python3 tools/sparkle/build_lesson.py 10-01   (never run this file directly)
# Every helper (rep, ins_before, replace_block, block_end, video, game/slot, tip, model, box, part) asserts its anchor once.
import re
CLEAN_SIGN=('<div class="pq-clean-sign" data-mk-model="cleanSign"><h4>Fix the Liter Well sign</h4><p>Clean mode: fix the sign right here so Amy can open her stand.</p>'
 '<div class="cs-board"><small>LITER WELL</small><span class="cs-eq">2 L = <span>200</span> mL</span></div>'
 '<form><label for="csIn">2 L =</label><input id="csIn" inputmode="numeric" autocomplete="off" aria-label="Milliliters in 2 liters"> mL <button type="submit">Fix it</button></form><div class="cs-msg" aria-live="polite"></div></div>')

def act(id, color, icon, title, sub, body, cls='bl-slate', extra=''):
    return ('<div class="activity %s" id="%s"%s><div class="activity-head"><div class="activity-num" style="background:%s;">%s</div><div><div class="activity-title">%s</div>'
            '<div class="activity-sub">%s</div></div></div><div class="activity-body">%s</div></div>') % (cls, id, extra, color, icon, title, sub, body)

# ── header: pixel town strip, clean top
ins_before('<div class="quote-strip">','<div class="pq-town-strip" aria-hidden="true"></div>')
for mk in ['<div class="quote-strip">','<div class="standards-toggle-bar"','<div class="info-strip">','<div class="explorer-strip">','<div class="need-strip">']:
    replace_block(mk,'')
m=re.search(r'<div class="intro-2col">',s);i=m.start();j=block_end(s,i);intro=s[i:j]
intro=re.sub(r'<div class="intro-card-head-title">A water bottle label.*?</div>','<div class="intro-card-head-title">How do you add or multiply amounts like 1 m 65 cm?</div>',intro,flags=re.S)
intro=re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-body">).*?(</div></div><div class="intro-card theme-objectives">)',r'\1<p class="pq-eq-note">Some amounts use two units at once, like 1 m 65 cm or 2 L 750 mL. You will find two ways to work with them.</p>\2',intro,flags=re.S)
intro=re.sub(r'(<div class="intro-card theme-objectives">.*?<div class="intro-card-body">).*$',
  r'\1<div class="obj-line"><span class="obj-icon">➕</span><span><strong>Add, subtract and multiply</strong> amounts with two units, like 1 m 65 cm.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">🔁</span><span><strong>Regroup:</strong> trade 100 cm for 1 m, or 1,000 g for 1 kg.</span></div>'
  r'<div class="obj-line"><span class="obj-icon">🧃</span><span><strong>Solve market word problems</strong> with a bar model.</span></div></div></div></div>',intro,flags=re.S)
s=s[:i]+'<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>'+intro+'</details>'+s[j:]

# ── A. Think video + Market Day board + first game window
replace_block('<div class="video-placeholder-wrap">\n<!-- slot: g4math-10-01 -->', video('think')+'\n<div class="mk-board-mount"></div>'+slot('arrive'))

# ── B. Math Crew leaves the Warm-Up (their methods move to Learn, after the Think)
i=s.index('<div class="activity bl-violet"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div>');j=block_end(s,i);s=s[:i]+s[j:]
CREW=('<div class="activity bl-violet" id="mk-crew"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">👋</div><div><div class="activity-title">The Math Crew: Two Ways</div>'
 '<div class="activity-sub">How long is Amy\'s counter: 3 × 1 m 65 cm?</div></div></div><div class="activity-body">'
 '<p>The Crew found the length of Amy\'s counter two different ways. Read both. Which way would you pick?</p>'
 '<div class="bubble-row">'
 '<div class="bubble atlas"><div class="bubble-avatar">A</div><div class="bubble-body"><div class="bubble-name">Atlas: split the units</div><div class="bubble-text">"I split 1 m 65 cm into 1 m and 65 cm. 3 × 1 m = 3 m. 3 × 65 cm = 195 cm. That\'s 3 m 195 cm, but 195 cm is more than 1 m. 195 cm = 1 m 95 cm, so the counter is 4 m 95 cm."</div></div></div>'
 '<div class="bubble felix"><div class="bubble-avatar">F</div><div class="bubble-body"><div class="bubble-name">Felix: one unit first</div><div class="bubble-text">"I change it all to centimeters. 1 m 65 cm = 165 cm. 3 × 165 cm = 495 cm. Then I change back: 495 cm = 4 m 95 cm. Same answer as Atlas!"</div></div></div>'
 '</div><div class="bubble-row">'
 '<div class="bubble hazel"><div class="bubble-avatar">H</div><div class="bubble-body"><div class="bubble-name">Hazel: draw it</div><div class="bubble-text">"I draw a bar with 3 equal parts, one for each plank. Each part is 1 m 65 cm. The whole bar is the counter."</div></div></div>'
 '<div class="bubble cora"><div class="bubble-avatar">C</div><div class="bubble-body"><div class="bubble-name">Cora: trade when it gets too big</div><div class="bubble-text">"When the small unit reaches 100 cm, trade it for 1 m. For grams and milliliters, trade 1,000 for 1 kg or 1 L. That trade is how you regroup."</div></div></div>'
 '</div><div class="callout callout-tip" style="margin-top:8px;"><span class="callout-icon">💡</span><p>Crew rule: <em>Draw the story (Hazel). Pick a way: split or one unit (Atlas, Felix). Regroup and check the units (Cora).</em></p></div></div></div>')

# ── C. readiness → Market Measures (stamps, a short review of the factors)
m=re.search(r'<div class="journal-label">✏️ Which pairs of units use ×1,000\?.*?</textarea>',s,re.S);journal_r1=m.group(0)
reveal=re.search(r'<div class="reveal-box" id="readinessReveal">.*?</div>',s,re.S).group(0)
reveal='<div class="reveal-box" id="readinessReveal">10 mm make 1 cm. 100 cm make 1 m. 1,000 m make 1 km. And 1,000 g make 1 kg, and 1,000 mL make 1 L.</div>'
replace_block('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🔎</div>',
 '<div class="activity bl-yellow" id="mk-measures"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🔎</div><div><div class="activity-title">Warm-Up: Market Measures</div><div class="activity-sub">Job 1 · Stamp each stall sign with its factor</div></div><span class="activity-time" style="background:#F5C518;color:#0E1C42;">~4 min</span></div><div class="activity-body">'
 +tip('atlas','Count how many of the small unit fit inside the big one. The pictures show you. Every metric unit uses 10, 100 or 1,000.')
 +'<div data-mk-model="stamps"></div>'+reveal+journal_r1+'</div></div>')

# ── D. Think About It → Amy's counter (3 planks), Story Bar Model, no teaching yet
i=s.index('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🤔</div>');j=block_end(s,i)
s=s[:i]+act('mk-think','#F5C518;color:#0E1C42','🤔','Think About It: Amy\'s Counter','Try it your way first',
  '<div class="callout callout-think"><span class="callout-icon">🪵</span><p>Mo is building Amy\'s counter from <strong>3 planks</strong>, end to end. Each plank is <strong>1 m 65 cm</strong> long. How long is the counter?</p></div>'
  +'<svg viewBox="0 0 600 110" class="mk-svg" role="img" aria-label="Three equal planks laid end to end. Each plank is labeled 1 m 65 cm."><rect width="600" height="110" rx="10" fill="#FFF8EF"/>'
  +''.join('<rect x="%d" y="34" width="180" height="30" rx="3" fill="#C98A4E" stroke="#3B2417" stroke-width="3"/><rect x="%d" y="38" width="172" height="5" fill="#E2AC70"/><path d="M%d 52h60M%d 46h40" stroke="#9A6334" stroke-width="2"/><text x="%d" y="26" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#5B2E10">1 m 65 cm</text>'%(30+k*180,34+k*180,50+k*180,120+k*180,120+k*180) for k in range(3))
  +'<path d="M30 78v10M570 78v10M30 83h540" stroke="#C56C3F" stroke-width="3"/><text x="300" y="104" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#C56C3F">counter: ?</text></svg>'
  +tip('hazel','Put each fact from the story on the bar. Then find the ?.')
  +model('think')
  +'<div class="journal-label">✏️ How did you find the length? Tell your steps. <span class="saved-dot" id="dot-think"></span></div>'
  +'<textarea class="journal-box" data-label="Warm-Up — Think: Amy\'s counter" id="journal-think" oninput="autoSave(this,\'dot-think\')" placeholder=""></textarea>',
  cls='bl-yellow')+s[j:]
rep('You built the bar. Now practice with new units.','Four jobs down. One to go: open Amy\'s stand.')
rep('Now build a meter from smaller pieces.','Next: find Mo\'s planks, then build the counter on the Learn tab.')
ins_before('<div class="tab-next-wrap"><p class="tab-transition-voice">Next: find Mo',slot('planks'))

# ── E. Learn: video, the Crew's two ways, then the Two-Unit Mat jobs
i=s.index('<div class="callout callout-think" style="margin-bottom:14px;"><span class="callout-icon">🧠</span><p><strong>Try before the rule:</strong>')
j=block_end(s,i); k=s.index('<div class="activity bl-slate">',j); kend=block_end(s,k)
assert 'Unit Builder' in s[k:kend]
s=s[:i]+(video('learn')+CREW
 +act('mk-counter','#C56C3F','🪵','Build the Counter: 3 × 1 m 65 cm','Job 2 · Use the Two-Unit Mat',
   tip('cora','Meters on the left, centimeters on the right. When a small column gets 10 pieces, trade them for 1 bigger piece.')+model('counter'))
 +slot('counter')
 +act('mk-juice','#6B3FA0','🧃','Juice Orders: 2 L 750 mL + 1 L 400 mL','Job 3 · Add two orders on the mat',
   tip('felix','1 L = 1,000 mL. So 10 pieces of 100 mL make 1 L. Watch the milliliters when you add.')+model('juice'),cls='bl-violet'))+s[kend:]

# ── F. Metric Chart → Market Measures Board (staircase review + the two ways)
stairs=('<svg viewBox="0 0 640 250" class="mk-svg" role="img" aria-label="Staircase: kilometer at the top, then meter, centimeter, millimeter. Going down, multiply by 1,000, 100, 10. Going up, regroup."><rect width="640" height="250" rx="12" fill="#FFF8EF"/>')
steps=[('km','kilometer','#6B3FA0'),('m','meter','#3A6B9A'),('cm','centimeter','#2DB87A'),('mm','millimeter','#E07B39')]
fac=['×1,000','×100','×10']
for n,(u,name,col) in enumerate(steps):
    x=24+n*120;y=24+n*46
    stairs+='<rect x="%d" y="%d" width="120" height="%d" fill="%s" stroke="#3B2417" stroke-width="3"/>'%(x,y,226-y,col)
    stairs+='<text x="%d" y="%d" text-anchor="middle" font-family="Lora,serif" font-weight="900" font-size="24" fill="#fff">%s</text><text x="%d" y="%d" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="12" fill="#fff">%s</text>'%(x+60,y+30,u,x+60,y+46,name)
    if n<3:
        stairs+='<path d="M%d %d q34 0 40 34" fill="none" stroke="#C56C3F" stroke-width="3.5" marker-end="url(#mkar)"/><text x="%d" y="%d" font-family="Nunito" font-weight="900" font-size="15" fill="#C56C3F">%s</text>'%(x+92,y-6,x+112,y-10,fac[n])
stairs+='<defs><marker id="mkar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#C56C3F"/></marker></defs>'
stairs+='<text x="520" y="40" text-anchor="middle" font-family="DotGothic16,Nunito" font-weight="400" font-size="15" fill="#3B2417">DOWN the stairs:</text><text x="520" y="60" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#C56C3F">smaller unit → multiply</text>'
stairs+='<text x="520" y="88" text-anchor="middle" font-family="DotGothic16,Nunito" font-weight="400" font-size="15" fill="#3B2417">UP the stairs:</text><text x="520" y="108" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#3A6B9A">bigger unit → regroup</text><text x="520" y="126" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="12" fill="#3A6B9A">every 100 cm makes 1 m</text></svg>'
replace_block('<div class="key-concept" style="margin-top:16px;"><div class="key-concept-label">📐 The Metric Chart',
 '<div class="key-concept" id="mk-board-kc" style="margin-top:16px;"><div class="key-concept-label">📐 The Market Measures Board</div>'+stairs+
 '<p><strong>Length:</strong> 10 mm = 1 cm. 100 cm = 1 m. 1,000 m = 1 km.</p><p><strong>Mass:</strong> 1,000 g = 1 kg. (Millie\'s flour)</p><p><strong>Capacity:</strong> 1,000 mL = 1 L. (Amy\'s juice jugs)</p>'
 '<p><strong>Two units at once?</strong> Pick a way. <em>Split:</em> work on each unit, then regroup. <em>One unit:</em> change it all to the small unit, work, then change back.</p>'
 +tip('cora','Exact words: <b>regroup</b> means trading small units for a big one (100 cm for 1 m) or a big one for small ones (1 kg for 1,000 g).')+'</div><div class="pq-vslot" data-slot="do"></div><!--WE-->')

# ── G. Picture It → Millie's flour (Story Bar Model, subtracting two-unit amounts)
pic_start='<div class="activity bl-violet" style="margin-top:16px;"><div class="activity-head">'
i=s.index(pic_start);j=block_end(s,i);blk=s[i:j]
soc=re.search(r'<div class="socratic-box">.*?</textarea></div>',blk,re.S).group(0)
soc=re.sub(r'<p class="socratic-q">.*?</p>','<p class="socratic-q">Felix\'s little brother says 6 kg 5 g is the same as 65 g. What would you tell him?</p>',soc,flags=re.S)
s=s[:i]+act('mk-flour','#6B3FA0','🌾','Millie\'s Flour: 6 kg 5 g − 2 kg 750 g','Job 4 · Draw the story, then subtract',
  tip('hazel','The sack is the whole bar. What Millie sold is one part. The ? is the part left.')+model('flour')+soc,cls='bl-violet',extra=' style="margin-top:16px;"')+slot('flour')+s[j:]

# ── H. Worked example (new numbers, both ways) + one-picture summary
i=s.index('<div class="activity bl-slate"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Worked Example: 1 km − 300 m</div>');j=block_end(s,i)
WE=('<div class="activity bl-slate" id="mk-worked"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Worked Example: Mo\'s Board</div><div class="activity-sub">Subtract two-unit amounts, two ways</div></div></div><div class="activity-body">'
 '<div class="task-box"><div class="task-label">Problem</div><p>Mo has a board <strong>3 m 20 cm</strong> long. He cuts off <strong>1 m 45 cm</strong>. How long is the piece that is left?</p></div>'
 +tip('atlas','20 cm − 45 cm won\'t work. Regroup first: trade 1 m for 100 cm.')+
 '<div class="we-two"><div class="we-way"><h5>Split the units (Atlas)</h5><ol><li>Regroup: 3 m 20 cm = 2 m 120 cm.</li><li>Centimeters: 120 cm − 45 cm = 75 cm.</li><li>Meters: 2 m − 1 m = 1 m.</li><li>Answer: <b>1 m 75 cm</b>.</li></ol></div>'
 '<div class="we-way"><h5>One unit first (Felix)</h5><ol><li>Change: 3 m 20 cm = 320 cm. 1 m 45 cm = 145 cm.</li><li>Subtract: 320 cm − 145 cm = 175 cm.</li><li>Change back: 175 cm = <b>1 m 75 cm</b>.</li></ol></div></div>'
 '<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Check (Cora): 1 m 75 cm + 1 m 45 cm = 2 m 120 cm = 3 m 20 cm ✓</p>')
ONEPIC=("<div class=\"key-concept pq-onepic\" style=\"margin-top:14px;\"><div class=\"key-concept-label\">⚖️ The Whole Lesson in One Picture</div>"
 "<div class=\"op-grid\"><figure class=\"op-stairs\"><svg viewBox=\"0 0 300 196\" role=\"img\" aria-label=\"Metric staircase: kilometer, meter, centimeter, millimeter. Going down a step you multiply by 1,000, then 100, then 10. Going up, you regroup.\">"
 +''.join('<rect x="%d" y="%d" width="74" height="%d" fill="%s" stroke="#3B2417" stroke-width="2.5"/><text x="%d" y="%d" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="17" fill="#0E1C42">%s</text>'%(4+i*74,14+i*42,180-i*42,c,41+i*74,40+i*42,u) for i,(u,c) in enumerate([('km','#FCE7C8'),('m','#FDEFD9'),('cm','#FFF6E8'),('mm','#FFFBF3')]))
 +''.join('<rect x="%d" y="%d" width="62" height="20" rx="10" fill="#C56C3F"/><text x="%d" y="%d" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#fff">%s</text>'%(10+(i+1)*74,(i+1)*42-14,41+(i+1)*74,(i+1)*42+1,f) for i,f in enumerate(['×1,000','×100','×10']))
 +"</svg><figcaption><span class=\"op-dn\">⬇ Down to a smaller unit: <b>multiply</b></span><span class=\"op-up\">⬆ Up to a bigger unit: <b>regroup</b> (100 cm → 1 m)</span></figcaption></figure>"
 "<div class=\"op-ex\"><div class=\"op-h\" style=\"margin-bottom:6px\">2 × 1 m 70 cm, two ways</div>"
 "<div class=\"op-card\"><div class=\"op-h\">Split, then regroup</div><p>2 × 1 m = 2 m. 2 × 70 cm = 140 cm.</p><div class=\"op-eq\">2 m 140 cm = <b>3 m 40 cm</b></div></div>"
 "<div class=\"op-card\"><div class=\"op-h\">One unit first</div><p>1 m 70 cm = 170 cm. 2 × 170 cm = 340 cm.</p><div class=\"op-eq\">340 cm = <b>3 m 40 cm</b></div></div></div></div></div>")
s=s[:i]+ONEPIC+s[j:]
s=s.replace('<!--WE-->',WE+'</div></div>',1)  # worked example right after the Do video, before Millie's Flour

# ── I. Show What You Know: tips, per-part answer boxes, bonus, prove it, final quest
for a,b in [('<div class="activity-sub">For each problem, convert between metric units. Show your work.</div>','<div class="activity-sub">Type each answer in its own box.</div>'),
            ('<p>Use the chart: 10 mm = 1 cm, 100 cm = 1 m, 1,000 m = 1 km, 1,000 g = 1 kg, 1,000 mL = 1 L.</p>','<p>Use the board: 100 cm = 1 m, 1,000 g = 1 kg, 1,000 mL = 1 L. Split the units or change to one unit, whichever you like.</p>'),
            ('<p><strong>Before each problem, ask:</strong> Am I converting to a SMALLER unit (multiply) or a LARGER unit (divide)? Which line on the chart connects these two units?</p>','<p><strong>Before each problem, ask:</strong> Do I need to regroup? Is the small unit 100 cm (or 1,000 g or 1,000 mL) or more?</p>')]:
    rep(a,b)
SW=('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Convert.</strong> <span class="saved-dot" id="dot-1"></span></p><div class="ans-parts">'
 +part('Problem 1 (a)','(a) 8 m = '+box('1a','Problem 1 a, centimeters','cm'))
 +part('Problem 1 (b)','(b) 3,270 cm = '+box('1b1','Problem 1 b, meters','m')+' '+box('1b2','Problem 1 b, centimeters','cm'))+'</div></div>'
 +'<div class="q-block"><p class="q-text"><span class="q-num">2</span><strong>Add and multiply lengths.</strong> <span class="saved-dot" id="dot-2"></span></p><div class="ans-parts">'
 +part('Problem 2 (a)','(a) 2 m 40 cm + 1 m 85 cm = '+box('2a1','Problem 2 a, meters','m')+' '+box('2a2','Problem 2 a, centimeters','cm'))
 +part('Problem 2 (b)','(b) 3 × 1 m 35 cm = '+box('2b1','Problem 2 b, meters','m')+' '+box('2b2','Problem 2 b, centimeters','cm'))+'</div></div>'
 +'<div class="q-block"><p class="q-text"><span class="q-num">3</span><strong>Word problem: Amy\'s juice.</strong> Amy bought 6 bottles of juice. Each bottle holds 450 mL. <span class="saved-dot" id="dot-3"></span></p><div class="ans-parts">'
 +part('Problem 3 (a) total mL','(a) How many milliliters in all? '+box('3a','Problem 3 a, milliliters','mL'))
 +part('Problem 3 (b) in L and mL','(b) Write that amount in liters and milliliters. '+box('3b1','Problem 3 b, liters','L')+' '+box('3b2','Problem 3 b, milliliters','mL'))+'</div></div>'
 +'<div class="q-block"><p class="q-text"><span class="q-num">4</span><strong>Millie\'s new sack.</strong> A sack of flour has a mass of 5 kg 8 g. <span class="saved-dot" id="dot-4"></span></p><div class="ans-parts">'
 +part('Problem 4','How many grams is that? '+box('4','Problem 4, grams','g'))+'</div></div>')
i=s.find('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Convert length.</strong>');j=s.find('<div class="activity bl-slate" style="margin-top:18px;border-left-color:#0E8A8C;">',i);assert i>0 and j>i
s=s[:i]+tip('opti','Hoo! Before each problem, ask: do I need to regroup?')+SW+model('bonus')+(
 '<div class="activity bl-violet" id="mk-prove"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">⚖️</div><div><div class="activity-title">Last Job: Is 2 L the same as 200 mL?</div><div class="activity-sub">The Liter Well sign, checked with bars</div></div></div><div class="activity-body">'
 +tip('cora','Same scale, fair compare. If the bars are different lengths, the amounts are different.')+model('prove')+'</div></div>'+CLEAN_SIGN+slot('sign')+video('wrap'))+s[j:]
ins_before('<div class="gathered-box">',tip('cora','Check every answer for a unit. "75" isn\'t finished. "1 m 75 cm" is.'))

# ── J. small text fixes (jargon, What's Next, checklist, vocabulary)
for a,b in [('<div class="fluency-head-label">FLUENCY WARM-UP</div><div class="fluency-head-title">Mixed Multiplication Facts — Maintenance</div>','<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">Mixed Multiplication Facts</div>'),
            ('Warm up your fact fluency before today’s lesson.','Warm up with these multiplication facts before today’s lesson.'),
            ('data-label="Fluency Warm-Up (Mixed Multiplication Facts — Maintenance)"','data-label="Fact Warm-Up (Mixed Multiplication Facts)"'),
            ('var FLUENCY_TITLE = "Mixed Multiplication Facts — Maintenance";','var FLUENCY_TITLE = "Mixed Multiplication Facts";'),
            ('Warm-Up — Readiness: conversion factors','Warm-Up — Conversion factors'),
            ('🧠 Socratic — Think Like a Mathematician','🧠 Think Like a Mathematician'),
            ('data-label="Learn — Socratic: 1,000 vs 100"','data-label="Learn — Think: 6 kg 5 g"'),
            ('changing one unit into another while keeping the same length, mass, or volume.','changing one unit into another while keeping the same length, mass or capacity.'),
            ('<div class="activity-title">Connection Forward: Metric Units</div><div class="activity-sub">What comes next in Unit 10</div>','<div class="activity-title">What\'s Next</div><div class="activity-sub">Coming up in Unit 10</div>'),
            ('Next lesson, we build the same kind of ladder for customary length — inches, feet, yards, and miles — but the factors are 12, 3, and 5,280 instead of powers of 10.',
             'Next lesson, you\'ll add and multiply amounts like 2 ft 7 in. The trades are different: 12 inches make a foot, 3 feet make a yard and 5,280 feet make a mile, instead of 10, 100 and 1,000.'),
            ('<span>I completed both quick checks above.</span>','<span>I finished all five Market Day jobs.</span>'),
            ('<span>I showed my model or my steps for each problem.</span>','<span>I typed an answer in every box.</span>')]:
    rep(a,b)
answer_boxes_save()

# ── K. mental-math warm-up after the fact grid: make the next meter
fb=s.index('<div class="fluency-box"');fe=block_end(s,fb)
s=s[:fe]+('<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🧠</div><div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, four quick problems</div></div></div><div class="activity-body">'+model('mental')+'</div></div>')+s[fe:]
