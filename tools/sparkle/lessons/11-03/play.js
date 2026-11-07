// 4.11.03 play-through: every workshop window, every Shape Cutter (cuts by click AND keyboard, lift, border sides), a wrong
// answer per kind of box, hints, writing, the guide, clean mode. node tools/sparkle/lessons/11-03/play.js  (screenshots → tools/sparkle/out/11-03/)
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const REPO=path.resolve(__dirname,'../../../..'),OUT=path.join(REPO,'tools/sparkle/out/11-03');fs.mkdirSync(OUT,{recursive:true});
const PAGE=process.env.PAGE_URL||('file://'+path.join(REPO,'math-lesson-4-11-03-area-of-composite-figures.html'));
let fails=0;function ok(c,m){console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++;}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1150,height:900},reducedMotion:'reduce'});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(PAGE);await p.waitForTimeout(800);
  ok((await p.evaluate(()=>(window.PQ_FAILED||[]).length))===0,'page layer started with no failures '+JSON.stringify(await p.evaluate(()=>window.PQ_FAILED||[])));
  async function playWin(id,shot){
    const sel='.cw-slot[data-win="'+id+'"]';await p.locator(sel).scrollIntoViewIfNeeded();
    await p.click(sel+' .cw-play');await p.waitForTimeout(1300);
    for(let i=0;i<200;i++){
      const st=await p.evaluate(s=>{const r=document.querySelector(s),t=r.querySelector('.cw-task');return {task:t.classList.contains('on')?t.textContent:'',reply:r.querySelectorAll('.cw-reply').length,kb:r.querySelectorAll('.cw-task.on .cw-kb button:not(.seen)').length,go:!!r.querySelector('.cw-task.on .cw-go'),next:r.querySelector('.cw-next').classList.contains('on')};},sel);
      if(st.kb&&!st.go){await p.click(sel+' .cw-kb button:not(.seen) >> nth=0');await p.waitForTimeout(150);if(shot&&i<40)await p.screenshot({path:path.join(OUT,'win-'+id+'-explore.png')});continue;}
      if(st.go&&(/\d of \d/.test(st.task)||st.kb)){await p.click(sel+' .cw-task .cw-go');await p.waitForTimeout(300);continue;}
      if(st.go){if(shot)await p.screenshot({path:path.join(OUT,'win-'+id+'.png')});return st.task;}
      if(st.reply){if(shot)await p.screenshot({path:path.join(OUT,'win-'+id+'-choice.png')});await p.click(sel+' .cw-reply >> nth=0');await p.waitForTimeout(1200);continue;}
      await p.click(sel+' .cw-dlg',{force:true});await p.waitForTimeout(st.next?150:1600);
    }
    return null;}
  const M=n=>'[data-mk-model="'+n+'"]';
  const msg=root=>p.evaluate(s=>{const m=document.querySelectorAll(s+' .ok-msg');return m[m.length-1].textContent;},root);
  async function center(root){await p.evaluate(s=>document.querySelector(s+' .sc-svg').scrollIntoView({block:'center',behavior:'instant'}),root);await p.waitForTimeout(60);}
  async function cutLine(root,id){await center(root);await p.click(root+' .sc-cut[data-cut="'+id+'"]');await p.waitForTimeout(60);}
  async function cutKey(root,id){await center(root);await p.focus(root+' .sc-cut[data-cut="'+id+'"]');await p.keyboard.press('Enter');await p.waitForTimeout(60);}
  async function ans(root,id,vals){const f=root+' .sc-ask[data-id="'+id+'"]';const ins=await p.$$(f+' input');for(let i=0;i<vals.length;i++)await ins[i].fill(String(vals[i]));await p.click(f+' button');await p.waitForTimeout(70);return msg(root);}
  const isOk=(root,id)=>p.$eval(root+' .sc-ask[data-id="'+id+'"]',e=>e.classList.contains('ok'));
  async function wrongRight(root,id,wrong,right,what,re){const m=await ans(root,id,wrong);ok(m.length>10&&(!re||re.test(m)),what+': wrong '+wrong.join(',')+' gets a hint ("'+m.slice(0,70)+'…")');
    await ans(root,id,right);ok(await isOk(root,id),what+': '+right.join(',')+' is accepted');}
  async function sides(root){for(const s of ['left','right','top','bottom']){await center(root);await p.click(root+' .sc-side[data-side="'+s+'"]');}}
  const job=id=>p.evaluate(i=>{try{return !!JSON.parse(localStorage.getItem('g4-4-11-03-world')).world.jobs[i];}catch(e){return false;}},id);

  // ── Warm-Up
  const t1=await playWin('mirror',true);ok(t1&&/8 in/.test(t1)&&/2 in/.test(t1),'window "mirror" ends with the written job');
  ok(JSON.parse(await p.evaluate(()=>localStorage.getItem('g4-4-11-03-predict'))||'{}').id==='border','mirror window: the prediction is saved for the page');
  const TH=M('think');
  ok(!!(await p.$(TH+' .sc-ask[data-id="c0"]')),'Think: the answer box is there before any building (try it your own way)');
  await center(TH);await p.click(TH+' .sc-side[data-side="left"]');ok(/Border tiles laid: 20/.test(await p.textContent(TH+' .sc-sym')),'Think: the left border lays 2 × 10 = 20 sheets (the corners go with the sides)');
  ok(/2 \+ 8 in/.test(await p.textContent(TH+' .sc-svg')),'Think: the top line grows as a sum (2 + 8 in)');
  for(const s of ['right','top','bottom'])await p.click(TH+' .sc-side[data-side="'+s+'"]');
  ok(/Border tiles laid: 72/.test(await p.textContent(TH+' .sc-sym')),'Think: four sides lay 72 sheets');
  ok(/2 \+ 8 \+ 2 in/.test(await p.textContent(TH+' .sc-svg')),'Think: the top line shows 2 + 8 + 2, never the total');
  await wrongRight(TH,'c0',[48],[72],'Think border',/covers the mirror|cover the mirror/);ok(await job('j1'),'job 1 done');
  await p.waitForTimeout(900);ok(await p.$eval('.cw-same36',e=>!e.hidden),'Think solved: the two-ways payoff appears');
  ok(/border needed more gold/.test(await p.textContent('.cw-same36')),'Leonardo comes back to the prediction');
  await p.locator(TH).screenshot({path:path.join(OUT,'think.png')});
  await p.fill('#journal-notice','I notice the mirror is 8 by 6 and the border goes around it. I wonder how many sheets?');
  ok((await p.$$eval('#journal-notice ~ .pq-write .pq-chip.on',x=>x.length))===2,'notice box: a natural answer lights both chips');
  await p.fill('#journal-notice','idk');ok((await p.$$eval('#journal-notice ~ .pq-write .pq-chip.on',x=>x.length))===0,'notice box: "idk" lights none');
  for(let k=0;k<3;k++)await p.click('#mk-think .pq-hint-btn');
  ok((await p.$$eval('#mk-think .pq-hint-list li',x=>x.length))===3,'Think hint ladder: 3 rungs');
  const mm=await p.$$(M('mental')+' .mm-bondp');ok(mm.length===3,'Mental Math: 3 problems, each with a blank bond');
  const B0=M('mental')+' .mm-bondp >> nth=0';
  await p.fill(B0+' >> [data-k="p0"]','10');await p.fill(B0+' >> [data-k="p1"]','6');await p.fill(B0+' >> [data-k="q0"]','50');await p.fill(B0+' >> [data-k="q1"]','30');
  ok((await p.$$eval(M('mental')+' .mm-bondp:first-child .mm-sm.good',x=>x.length))===4,'Mental Math: a right × bond turns green');
  await p.fill(B0+' >> .mm-ans','80');await p.click(B0+' >> button[type=submit]');ok(await p.$eval(M('mental')+' .mm-bondp',e=>e.classList.contains('ok')),'Mental Math: 16 × 5 = 80 accepted');

  // ── Lesson
  await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(1200);
  const vis=()=>p.$$eval('.cw-station',x=>x.map(e=>!e.hidden));
  ok(JSON.stringify(await vis())==='[true,false,false]','Lesson: only station 1 shows at first');
  const GD=M('guided');ok(!(await p.$(GD+' .sc-ask')),'Your Turn: no number boxes until the frame is laid');
  await sides(GD);await wrongRight(GD,'ow',[10],[11],'Your Turn outer length',/both|BOTH/);
  ok(!(await p.$(GD+' .sc-ask[data-id="oa"]')),'Your Turn: the next box waits for the one before');
  await p.evaluate(s=>document.querySelector(s+' .sc-ask[data-id="ow"]').requestSubmit(),GD);await p.waitForTimeout(60);ok(!(await p.$(GD+' .sc-ask[data-id="oa"]')),'Your Turn: a second check does not unlock the next step');
  await ans(GD,'oh',[6]);await ans(GD,'oa',[66]);await ans(GD,'ia',[36]);await wrongRight(GD,'bd',[102],[30],'Your Turn frame',/not part|take/);
  ok(/30 sheets/.test(await msg(GD)),'Your Turn: the done message names 30 sheets');
  await p.locator('#mk-guided').screenshot({path:path.join(OUT,'learn-guided.png')});
  await p.click('.cw-station[data-st="1"] .cw-st-next button',{force:true});await p.waitForTimeout(1200);
  ok(JSON.stringify(await vis())==='[false,true,false]','Next station opens station 2');
  // Job 2: the L, two splits, then take away
  const EA=M('ell')+' > div:nth-child(1) > div:nth-child(2)',EB=M('ell')+' > div:nth-child(2) > div:nth-child(2)';
  await cutLine(EA,'h5');ok(/not a rectangle/.test(await msg(EA)),'L: a cut that leaves an L part says one part is not a rectangle');
  await cutLine(EA,'h5');await cutLine(EA,'v4');ok(/every part is a rectangle/.test(await p.textContent(EA+' .sc-sym')),'L: the cut at the inside corner makes 2 rectangles (click)');
  await wrongRight(EA,'w0p0',[4,4,16],[4,9,36],'L way 1 part A',/subtract/);
  await ans(EA,'w0p1',[6,5,30]);await wrongRight(EA,'w0t',[90],[66],'L way 1 total',/whole/);
  ok(!!(await p.$(EA+' .sc-again')),'L: the second-way button shows');await p.click(EA+' .sc-again');
  await center(EA);await p.focus(EA+' .sc-cut[data-cut="v4"]');await p.keyboard.press('Enter');
  ok(/already split it that way/.test(await msg(EA)),'L: the same split again (by keyboard) is refused');
  await p.focus(EA+' .sc-cut[data-cut="h4"]');await p.keyboard.press(' ');
  ok(/every part is a rectangle/.test(await p.textContent(EA+' .sc-sym')),'L: a keyboard cut across makes 2 rectangles');
  await ans(EA,'w1p0',[4,4,16]);await ans(EA,'w1p1',[10,5,50]);await ans(EA,'w1t',[66]);
  ok(await p.$eval(M('ell')+' > div:nth-child(2)',e=>!e.hidden),'L: round 2 (take away) opens after two splits');
  await wrongRight(EB,'whole',[19],[90],'L whole',/adds the sides/);
  await center(EB);await p.click(EB+' .sc-lift');ok(!!(await p.$(EB+' .sc-ask[data-id="h0"]')),'L: Lift out moves the corner out and asks its area');
  await ans(EB,'h0',[24]);await wrongRight(EB,'left',[114],[66],'L take away',/NOT part/);ok(await job('j2'),'job 2 done');
  await p.locator('#mk-ell').screenshot({path:path.join(OUT,'job2-ell.png')});
  // Job 3: the T, then three boards
  const PA=M('parts')+' > div:nth-child(1) > div:nth-child(2)',PB=M('parts')+' > div:nth-child(2) > div:nth-child(2)';
  await cutKey(PA,'v3');ok(/not a rectangle/.test(await msg(PA)),'T: one side cut leaves a non-rectangle');await cutKey(PA,'v6');
  ok(/3 parts|only 2/.test(await msg(PA)),'T: three parts says only 2 are needed');await cutKey(PA,'v3');await cutKey(PA,'v6');await cutLine(PA,'h2');
  await ans(PA,'w0p0',[9,2,18]);await ans(PA,'w0p1',[3,6,18]);await wrongRight(PA,'w0t',[72],[36],'T total',/empty corners/);
  ok(/18 and 18/.test(await msg(PA)),'T: the done message points at the matching parts');
  await ans(PB,'w0p0',[4,7,28]);await ans(PB,'w0p1',[6,7,42]);await ans(PB,'w0p2',[2,7,14]);await ans(PB,'w0t',[84]);ok(await job('j3'),'job 3 done');
  await p.click('.cw-station[data-st="2"] .cw-st-next button',{force:true});await p.waitForTimeout(1200);
  ok(JSON.stringify(await vis())==='[false,false,true]','Next station opens station 3');
  // Job 4: the wall
  const WL=M('wall');await ans(WL,'whole',[108]);await center(WL);await p.click(WL+' .sc-lift');
  await ans(WL,'h0',[28]);await ans(WL,'h1',[4]);await wrongRight(WL,'left',[80],[76],'Wall',/window/);ok(await job('j4'),'job 4 done');
  await p.locator('#mk-wall').screenshot({path:path.join(OUT,'job4-wall.png')});
  const t3=await playWin('note',true);ok(t3&&/mistake/.test(t3),'window "note" ends with the written job');
  const FX=M('fix');await sides(FX);await wrongRight(FX,'ow',[11],[13],'Frame length',/Bernardo/);
  await ans(FX,'oh',[11]);await ans(FX,'oa',[143]);await ans(FX,'ia',[63]);await ans(FX,'bd',[80]);ok(await job('j5'),'job 5 done');
  await p.fill('#journal-fix','He added the frame on one side only. It is on both sides so 2 + 9 + 2 = 13, not 11.');
  ok((await p.$$eval('#journal-fix ~ .pq-write .pq-chip.on',x=>x.length))===2,'fix box: lights both chips');
  await p.fill('#journal-big','See the rectangles. Split it and add the parts, or take the missing part away from the whole. Like 6 × 5 = 30 − 4 = 26 sq ft.');
  ok((await p.$$eval('#journal-big ~ .pq-write .pq-chip.on',x=>x.length))===3,'big idea box: a natural answer lights all 3 chips');
  for(const s of ['#mk-wall','#mk-fix']){await p.click(s+' .pq-hint-btn');}
  ok((await p.$$eval('#tab-learn .pq-hint-list li',x=>x.length))>=2,'Lesson hint ladders open');
  // ── Show What You Know
  await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(300);
  const t4=await playWin('wrap',true);ok(t4&&/next lesson/.test(t4),'window "wrap" ends with the next-lesson note');
  const PR=M('prove');const pf=PR+' .ag-ask';
  await p.fill(pf+' >> nth=0 >> input','99');await p.click(pf+' >> nth=0 >> button');ok(/take the corner away/.test(await p.$eval(PR+' .ok-msg',e=>e.textContent)),'Prove: 99 gets the take-away hint');
  await p.fill(pf+' >> nth=0 >> input','63');await p.click(pf+' >> nth=0 >> button');await p.fill(pf+' >> nth=1 >> input','63');await p.click(pf+' >> nth=1 >> button');
  ok((await p.$$eval(pf,x=>x.filter(e=>e.classList.contains('ok')).length))===2,'Prove: both ways accepted');
  await p.fill('#journal-prove','Take away: 99 − 36 = 63. Split: 45 + 18 = 63. Both ways are the same so you don\'t have to count.');
  ok((await p.$$eval('#journal-prove ~ .pq-write .pq-chip.on',x=>x.length))===3,'prove box: lights all 3 chips');
  await p.fill('#ans-1a','88');await p.evaluate(()=>gatherAnswers());const g=await p.inputValue('#gatheredOutput');
  ok(/Today's big idea/.test(g)&&/Words I learned today/.test(g),'journal opens with the big idea and lists the words');
  await p.click('.pq-mode');ok(await p.evaluate(()=>getComputedStyle(document.querySelector('.cw-slot')).display==='none'),'windows switch hides the windows');await p.click('.pq-mode');
  await p.reload();await p.waitForTimeout(700);await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(400);
  ok(JSON.stringify(await vis())==='[false,false,true]','Lesson: the open station is remembered after a reload');
  ok(await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('g4-4-11-03-ell-a'));return s.done&&s.ways.length===2;}),'L: both splits restore after a reload');
  ok((await p.$$eval(M('fix')+' .sc-ask.ok',x=>x.length))===5,'Frame: every answer restores after a reload');
  ok(await p.evaluate(()=>CW_DATA.guide.spots.every(s=>document.querySelector(s.sel))),'guide: every spot is on the page');
  await p.evaluate(()=>{CW_SHOWSTATION(document.querySelector('#mk-guided'));document.querySelector('#mk-guided').scrollIntoView({block:'center',behavior:'instant'});});await p.waitForTimeout(300);
  await p.click('.cwg-man');await p.waitForTimeout(150);
  ok(/one side at a time/i.test(await p.$eval('.cwg-say',e=>e.textContent)),'guide: knows the student is at Your Turn');
  await p.click('.cwg-q >> nth=0');ok(await p.$eval('.cwg-a',e=>!e.hidden),'guide: a question gets his answer');
  await p.keyboard.press('Escape');ok(await p.$eval('.cwg-panel',e=>e.hidden),'guide: Escape closes him');
  ok(errs.length===0,'no page errors '+JSON.stringify(errs));
  await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(500);await p.screenshot({path:path.join(OUT,'warmup-1150.png'),fullPage:true});
  const q=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await q.goto(PAGE);await q.waitForTimeout(600);
  ok(await q.evaluate(()=>document.documentElement.scrollWidth<=392),'390 px: no sideways scroll');
  await q.evaluate(()=>switchTab('learn'));await q.waitForTimeout(800);ok(await q.evaluate(()=>document.documentElement.scrollWidth<=392),'390 px Lesson: no sideways scroll');
  await q.screenshot({path:path.join(OUT,'phone-lesson.png'),fullPage:true});
  console.log('\n'+(fails?fails+' FAIL':'all ok'));await b.close();process.exit(fails?1:0);})();
