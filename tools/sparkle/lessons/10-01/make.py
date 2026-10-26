# Lesson 4.10.01 · Metric Units of Measurement · Level 10 "Metric Market" (lesson 1 of 7)
# Run with: python3 tools/sparkle/build_lesson.py 10-01   (never run this file directly)
# Every helper (rep, ins_before, replace_block, block_end, video, game/slot, tip, model, box, part) asserts its anchor once.
import re
CLEAN_SIGN=('<div class="pq-clean-sign" data-mk-model="cleanSign"><h4>Fix the Liter Well sign</h4><p>Clean mode: fix the sign right here so Amy can open her stand.</p>'
 '<div class="cs-board"><small>LITER WELL</small><span class="cs-eq">2 L = <span>200</span> mL</span></div>'
 '<form><label for="csIn">2 L =</label><input id="csIn" inputmode="numeric" autocomplete="off" aria-label="Milliliters in 2 liters"> mL <button type="submit">Fix it</button></form><div class="cs-msg" aria-live="polite"></div></div>')
# ── header: pixel town strip
ins_before('<div class="quote-strip">','<div class="pq-town-strip" aria-hidden="true"></div>')
for mk in ['<div class="quote-strip">','<div class="standards-toggle-bar"','<div class="info-strip">','<div class="explorer-strip">','<div class="need-strip">']:
    replace_block(mk,'')
m=re.search(r'<div class="intro-2col">',s);i=m.start();j=block_end(s,i);intro=s[i:j]
intro=re.sub(r'<div class="intro-card-head-title">A water bottle label.*?</div>','<div class="intro-card-head-title">Is 2 liters the same as 200 milliliters? How can you prove it?</div>',intro,flags=re.S)
intro=re.sub(r'(<div class="intro-card theme-question">.*?<div class="intro-card-body">).*?(</div></div><div class="intro-card theme-objectives">)',r'\1<p class="pq-eq-note">You will prove the answer by the end of the lesson.</p>\2',intro,flags=re.S)
intro=re.sub(r'(<div class="intro-card theme-objectives">.*?<div class="intro-card-body">).*$',r'\1<div class="obj-line"><span class="obj-icon">📏</span><span><strong>Convert</strong> between metric units of length, mass and liquid volume.</span></div><div class="obj-line"><span class="obj-icon">🔟</span><span><strong>Use the pattern</strong> ×10, ×100, ×1,000 that links metric units.</span></div><div class="obj-line"><span class="obj-icon">🧃</span><span><strong>Solve word problems</strong> with metric units.</span></div></div></div></div>',intro,flags=re.S)
s=s[:i]+'<details class="pq-intro" open><summary>❓ Essential Question &amp; 🎯 Objectives</summary>'+intro+'</details>'+s[j:]

# ── A. welcome video → teacher transmission + Market Day board + first game window
old=replace_block('<div class="video-placeholder-wrap">\n<!-- slot: g4math-10-01 -->',
  video('think')
  +'\n<div class="mk-board-mount"></div>'+slot('arrive'))

# ── crew window (cards stay; they light up as students talk to each Crew member)
ins_before('<div class="bubble-row">\n<div class="bubble atlas">',slot('crew'))

# ── B. readiness → Market Measures (stamps)
m=re.search(r'<div class="journal-label">✏️ Which pairs of units use ×1,000\?.*?</textarea>',s,re.S);journal_r1=m.group(0)
reveal=re.search(r'<div class="reveal-box" id="readinessReveal">.*?</div>',s,re.S).group(0)
replace_block('<div class="activity bl-yellow"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🔎</div>',
 '<div class="activity bl-yellow" id="mk-measures"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🔎</div><div><div class="activity-title">Warm-Up: Market Measures</div><div class="activity-sub">Job 1 · Stamp each stall sign with its factor</div></div><span class="activity-time" style="background:#F5C518;color:#0E1C42;">~5 min</span></div><div class="activity-body">'
 +tip('atlas','How many of the small unit fit inside the big one? That number is the factor.')
 +'<div data-mk-model="stamps"></div>'+reveal+journal_r1+'</div></div>')

# ── C. Think About It → Amy's ribbon spool
rep('<div class="callout callout-think"><span class="callout-icon">📏</span><p>If a fence','<div class="callout callout-think"><span class="callout-icon">📏</span><p>If a fence')
rep('<p>If a fence is <strong>5,000 mm</strong> long, how many centimeters is that? How many meters?</p></div>',
 '<p>Amy\'s ribbon spool says <strong>5,000 mm</strong>. How many centimeters is that? How many meters?</p></div>'
 '<svg viewBox="0 0 600 120" class="mk-svg" role="img" aria-label="A spool of ribbon labeled 5,000 mm, unrolled across the stall"><rect width="600" height="120" rx="10" fill="#FFF8EF"/>'
 '<circle cx="80" cy="60" r="40" fill="#E04F6A" stroke="#3B2417" stroke-width="4"/><circle cx="80" cy="60" r="28" fill="#F27A93" stroke="#3B2417" stroke-width="2"/><circle cx="80" cy="60" r="10" fill="#FFF3DE" stroke="#3B2417" stroke-width="3"/>'
 '<path d="M110 86 C200 100 260 70 330 84 S470 96 560 82" fill="none" stroke="#3B2417" stroke-width="18" stroke-linecap="round"/><path d="M110 86 C200 100 260 70 330 84 S470 96 560 82" fill="none" stroke="#E04F6A" stroke-width="12" stroke-linecap="round"/>'
 '<rect x="40" y="6" width="80" height="22" rx="3" fill="#FFF3DE" stroke="#3B2417" stroke-width="2.5"/><text x="80" y="22" text-anchor="middle" font-family="DotGothic16,Nunito" font-weight="400" font-size="14" fill="#3B2417">5,000 mm</text>'
 '<text x="340" y="40" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="15" fill="#5B2E10">How many cm? How many m?</text></svg>'
 +tip('hazel','Go one step at a time. Turn the millimeters into centimeters first, then the centimeters into meters.'))

# ── D. Unit Builder → teacher message + Market Builder + Mo's counter quest
learn_reveal=re.search(r'<div class="reveal-box" id="learnReveal">.*?</div>',s,re.S).group(0)
i=s.index('<div class="callout callout-think" style="margin-bottom:14px;"><span class="callout-icon">🧠</span><p><strong>Try before the rule:</strong>')
j=block_end(s,i); k=s.index('<div class="activity bl-slate">',j); kend=block_end(s,k)
assert 'Unit Builder' in s[k:kend]
new=(video('learn')
 +'<div class="callout callout-think" style="margin-bottom:14px;"><span class="callout-icon">🧠</span><p><strong>Try before the rule:</strong> Fill each big unit with small pieces. Count how many it takes.</p></div>'
 +'<div class="activity bl-slate" id="mk-builder"><div class="activity-head"><div class="activity-num" style="background:#C56C3F;">🏗️</div><div><div class="activity-title">Market Builder</div><div class="activity-sub">Job 2 · Fill each big unit with small pieces</div></div></div><div class="activity-body">'
 +tip('felix','Count by the piece size as you go: 1s, 10s or 100s. When the bar is full, that total is the factor.')
 +'<div data-mk-model="builder"></div>'+learn_reveal+'</div></div>'+slot('counter'))
s=s[:i]+new+s[kend:]

# ── E. Metric Chart → Market Measures Board (staircase)
stairs=('<svg viewBox="0 0 640 250" class="mk-svg" role="img" aria-label="Staircase: kilometer at the top, then meter, centimeter, millimeter. Going down, multiply by 1,000, 100, 10. Going up, divide."><rect width="640" height="250" rx="12" fill="#FFF8EF"/>')
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
stairs+='<text x="520" y="88" text-anchor="middle" font-family="DotGothic16,Nunito" font-weight="400" font-size="15" fill="#3B2417">UP the stairs:</text><text x="520" y="108" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="14" fill="#3A6B9A">bigger unit → divide</text></svg>'
replace_block('<div class="key-concept" style="margin-top:16px;"><div class="key-concept-label">📐 The Metric Chart',
 '<div class="key-concept" id="mk-board-kc" style="margin-top:16px;"><div class="key-concept-label">📐 The Market Measures Board</div>'+stairs+
 '<p><strong>Length:</strong> 10 mm = 1 cm. 100 cm = 1 m. 1,000 m = 1 km.</p><p><strong>Mass:</strong> 1,000 g = 1 kg. (Millie\'s flour bag)</p><p><strong>Volume:</strong> 1,000 mL = 1 L. (Amy\'s juice jug)</p><p><strong>To convert:</strong> small → big, divide. Big → small, multiply.</p>'
 +tip('cora','Exact words: the number you multiply or divide by is the conversion factor. For liters and milliliters, it\'s 1,000.')+'</div><div class="pq-vslot" data-slot="do"></div>')

# ── F. Picture It → Bottle the Juice
pic_start='<div class="activity bl-violet" style="margin-top:16px;"><div class="activity-head">'
i=s.index(pic_start);j=block_end(s,i);blk=s[i:j]
soc=re.search(r'<div class="socratic-box">.*?</textarea></div>',blk,re.S).group(0)
s=s[:i]+('<div class="activity bl-violet" style="margin-top:16px;" id="mk-bottle"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">🧃</div><div><div class="activity-title">Bottle the Juice: 4,350 mL = ?</div><div class="activity-sub">Job 3 · Pour Amy\'s juice into 1 L jugs</div></div></div><div class="activity-body">'
  +tip('amy','Each jug holds exactly 1,000 mL. Count the full jugs, then the milliliters that don\'t fill a whole jug.')
  +'<div data-mk-model="bottle"></div>'+soc+'</div></div>')+s[j:]

# ── G. Worked example → Amy's delivery cart
rep('<div class="activity bl-slate"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🔍</div><div><div class="activity-title">Worked Example: 1 km − 300 m</div><div class="activity-sub">Convert first. Then subtract.</div></div></div>',
    '<div class="activity bl-slate" id="mk-cart"><div class="activity-head"><div class="activity-num" style="background:#3A6B9A;">🛒</div><div><div class="activity-title">Worked Example: Amy\'s Delivery Cart</div><div class="activity-sub">Job 4 · Same units first. Then subtract.</div></div></div>')
rep('<p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Watch the Math Crew solve it together:</p>',
    tip('atlas','Kilometers and meters are different units. Make them match before you subtract.')+'<div data-mk-model="cart"></div><p style="margin:8px 0;font-weight:700;color:#3A4A6B;">Now write it with numbers, the way the Math Crew does:</p>')

# ── H. Show What You Know: teacher message, tips, final quest
ins_before('<div class="q-block"><p class="q-text"><span class="q-num">1</span>',tip('opti','Hoo! Before each problem, ask: am I going to a smaller unit (multiply) or a bigger unit (divide)?'))
ins_before('<div class="activity bl-slate" style="margin-top:18px;border-left-color:#0E8A8C;">','<div class="activity bl-violet" id="mk-prove"><div class="activity-head"><div class="activity-num" style="background:#6B3FA0;">⚖️</div><div><div class="activity-title">Prove It: Is 2 L the same as 200 mL?</div><div class="activity-sub">The Essential Question, answered with bars</div></div></div><div class="activity-body">'+tip('cora','Same scale, fair compare. If the bars are different lengths, the amounts are different.')+'<div data-mk-model="prove"></div></div></div>'+CLEAN_SIGN+slot('sign')+video('wrap'))
ins_before('<div class="gathered-box">',tip('cora','Check every answer for a unit. "600" isn\'t finished. "600 m" is.'))

# ── I. end of Warm-Up: Amy's lost tools
ins_before('<div class="tab-next-wrap"><p class="tab-transition-voice">Now build a meter',slot('pieces'))
rep('Now build a meter from smaller pieces.','Next job: build Amy\'s measuring tools in the Market Builder.')
rep('You built the bar. Now practice with new units.','Four jobs down. One to go: open Amy\'s stand.')


# ── J. math-check fixes (independent solve, 2026-10-25)
ONEPIC=("<div class=\"key-concept pq-onepic\" style=\"margin-top:14px;\"><div class=\"key-concept-label\">⚖️ The Whole Lesson in One Picture</div>"
 "<div class=\"op-grid\"><figure class=\"op-stairs\"><svg viewBox=\"0 0 300 196\" role=\"img\" aria-label=\"Metric staircase: kilometer, meter, centimeter, millimeter. Going down a step you multiply by 1,000, then 100, then 10.\">"
 +''.join('<rect x="%d" y="%d" width="74" height="%d" fill="%s" stroke="#3B2417" stroke-width="2.5"/><text x="%d" y="%d" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="17" fill="#0E1C42">%s</text>'%(4+i*74,14+i*42,180-i*42,c,41+i*74,40+i*42,u) for i,(u,c) in enumerate([('km','#FCE7C8'),('m','#FDEFD9'),('cm','#FFF6E8'),('mm','#FFFBF3')]))
 +''.join('<rect x="%d" y="%d" width="62" height="20" rx="10" fill="#C56C3F"/><text x="%d" y="%d" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#fff">%s</text>'%(10+(i+1)*74,(i+1)*42-14,41+(i+1)*74,(i+1)*42+1,f) for i,f in enumerate(['×1,000','×100','×10']))
 +"</svg><figcaption><span class=\"op-dn\">⬇ Down to a smaller unit: <b>multiply</b></span><span class=\"op-up\">⬆ Up to a bigger unit: <b>divide</b></span></figcaption></figure>"
 "<div class=\"op-ex\"><div class=\"op-card\"><div class=\"op-h\">2 L = ? mL</div><p>Liters to milliliters is a step down, so multiply by 1,000.</p><div class=\"op-eq\">2 × 1,000 = <b>2,000 mL</b></div></div>"
 "<div class=\"op-card\"><div class=\"op-h\">1 km − 400 m</div><div class=\"op-bar\" aria-hidden=\"true\"><span class=\"op-used\">400 m</span><span class=\"op-left\">600 m</span></div><p>Different units? Make them match first.</p><div class=\"op-eq\">1,000 m − 400 m = <b>600 m</b></div></div></div></div></div>")
i=s.find('<div class="key-concept" style="margin-top:14px;"><div class="key-concept-label">⚖️ Lesson 10.01 in One Image</div>');assert i>0
j=s.find('</div>\n</div>',i)+len('</div>\n</div>');s=s[:i]+ONEPIC+s[j:]
rep('<div class="activity-title">Worked Example: Amy\'s Delivery Cart</div>','<div class="activity-title">Worked Example: Amy\'s Delivery Cart</div>')
rep('<p>Find <strong>1 km − 300 m</strong>. Express in meters.</p>','<p>Amy\'s road is <strong>1 km</strong>. Her cart broke down after <strong>400 m</strong>. How many meters are left? Find <strong>1 km − 400 m</strong>.</p>')
rep('Subtract: 1,000 m − 300 m = <span style="color:#C56C3F;font-weight:900;">700 m</span>','Subtract: 1,000 m − 400 m = <span style="color:#C56C3F;font-weight:900;">600 m</span>')
i=s.find('<div class="bubble-name">Felix — method-tester</div><div class="bubble-text">');j=s.find('</div>',i+80)
s=s[:i]+'<div class="bubble-name">Felix — method-tester</div><div class="bubble-text">"I test my conversion by checking the size. 4,350 mL should be a little more than 4 L, and 4 L 350 mL is exactly that, so my answer makes sense."'+s[j:]
for a,b in [('🧠 Socratic — Think Like a Mathematician','🧠 Think Like a Mathematician'),('Learn — Socratic: 1,000 vs 100','Learn — Think: 1,000 vs 100'),
            ('<div class="fluency-head-label">FLUENCY WARM-UP</div><div class="fluency-head-title">Mixed Multiplication Facts — Maintenance</div>','<div class="fluency-head-label">FACT WARM-UP</div><div class="fluency-head-title">Mixed Multiplication Facts</div>'),
            ('Warm up your fact fluency before today’s lesson.','Warm up with these multiplication facts before today’s lesson.'),
            ('data-label="Fluency Warm-Up (Mixed Multiplication Facts — Maintenance)"','data-label="Fact Warm-Up (Mixed Multiplication Facts)"'),
            ('var FLUENCY_TITLE = "Mixed Multiplication Facts — Maintenance";','var FLUENCY_TITLE = "Mixed Multiplication Facts";'),
            ('Warm-Up — Readiness: conversion factors','Warm-Up — Conversion factors'),
            ('Check units and reasonableness (Cora).','Check the units and make sure the answer makes sense (Cora).'),
            ('<div class="activity-title">Connection Forward: Metric Units</div><div class="activity-sub">What comes next in Unit 10</div>','<div class="activity-title">What\'s Next</div><div class="activity-sub">Coming up in Unit 10</div>'),
            ('but the factors are 12, 3, and 5,280 instead of powers of 10.','but the numbers are different: 12 inches in a foot, 3 feet in a yard and 5,280 feet in a mile, instead of 10, 100 and 1,000.'),
            ('<span>I completed both quick checks above.</span>','<span>I finished all five Market Day jobs.</span>'),
            ('<span>I showed my model or my steps for each problem.</span>','<span>I typed an answer in every box.</span>'),
            ('For each problem, convert between metric units. Show your work.','Type each answer in its own box.')]:
    rep(a,b)
# Show What You Know: one answer box per part
def box(id,lab,unit=''):
    return '<input class="ans-box" id="ans-%s" type="text" inputmode="numeric" autocomplete="off" aria-label="%s" oninput="autoSave(this,\'dot-%s\')"/>%s'%(id,lab,id[0],(' '+unit) if unit else '')
def part(lab,html):return '<div class="ans-part" data-label="%s">%s</div>'%(lab,html)
SW=('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Convert.</strong> <span class="saved-dot" id="dot-1"></span></p><div class="ans-parts">'
 +part('Problem 1 (a)','(a) 8 m = '+box('1a','Problem 1 a, centimeters','cm'))
 +part('Problem 1 (b)','(b) 3,270 cm = '+box('1b1','Problem 1 b, meters','m')+' '+box('1b2','Problem 1 b, centimeters','cm'))+'</div></div>'
 +'<div class="q-block"><p class="q-text"><span class="q-num">2</span><strong>Multiply lengths.</strong> <span class="saved-dot" id="dot-2"></span></p><div class="ans-parts">'
 +part('Problem 2 (a)','(a) 4 × 9 m = '+box('2a','Problem 2 a, meters','m'))
 +part('Problem 2 (b)','(b) 3 × 35 cm = '+box('2b','Problem 2 b, centimeters','cm'))+'</div></div>'
 +'<div class="q-block"><p class="q-text"><span class="q-num">3</span><strong>Word problem: Amy\'s juice.</strong> Amy bought 6 bottles of juice. Each bottle holds 450 mL. <span class="saved-dot" id="dot-3"></span></p><div class="ans-parts">'
 +part('Problem 3 (a) total mL','(a) How many milliliters in all? '+box('3a','Problem 3 a, milliliters','mL'))
 +part('Problem 3 (b) in L and mL','(b) Write that amount in liters and milliliters. '+box('3b1','Problem 3 b, liters','L')+' '+box('3b2','Problem 3 b, milliliters','mL'))+'</div></div>')
i=s.find('<div class="q-block"><p class="q-text"><span class="q-num">1</span><strong>Convert length.</strong>');j=s.find('<div class="activity bl-violet" id="mk-prove">',i);assert i>0 and j>i
s=s[:i]+SW+s[j:]
rep("function restoreJournals(){document.querySelectorAll('textarea.journal-box')","function restoreJournals(){document.querySelectorAll('textarea.journal-box, input.ans-box')")
rep("document.querySelectorAll('textarea.journal-box').forEach(t=>{out+=t.dataset.label+'\\n'+(t.value.trim()||'[No answer yet]')+'\\n\\n'});",
    "document.querySelectorAll('textarea.journal-box, .ans-part').forEach(t=>{if(t.classList.contains('ans-part')){let c=t.cloneNode(true),empty=false;c.querySelectorAll('input').forEach((x,k)=>{let v=t.querySelectorAll('input')[k].value.trim();if(!v)empty=true;x.replaceWith(v||'___')});out+=t.dataset.label+'\\n'+c.textContent.replace(/^\\([a-z]\\)\\s*/,'').trim()+(empty?'  [not finished]':'')+'\\n\\n';return;}out+=t.dataset.label+'\\n'+(t.value.trim()||'[No answer yet]')+'\\n\\n'});")


# ── K. mental-math warm-up (after the fact grid) + bonus quest (after the SWYK problems)
fb=s.index('<div class="fluency-box"');fe=block_end(s,fb)
s=s[:fe]+('<div class="activity bl-yellow" id="mk-mental" style="margin-top:16px;"><div class="activity-head"><div class="activity-num" style="background:#F5C518;color:#0E1C42;">🧠</div><div><div class="activity-title">Mental Math</div><div class="activity-sub">One strategy, four quick problems</div></div></div><div class="activity-body">'+model('mental')+'</div></div>')+s[fe:]
ins_before('<div class="activity bl-violet" id="mk-prove">',model('bonus'))
