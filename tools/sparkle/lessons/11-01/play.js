// 4.11.01 play-through: every workshop window, every model (tap AND drag), a wrong answer per box, hints, writing, clean mode.
// node tools/sparkle/lessons/11-01/play.js   (screenshots → tools/sparkle/out/11-01/)
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const REPO=path.resolve(__dirname,'../../../..'),OUT=path.join(REPO,'tools/sparkle/out/11-01');fs.mkdirSync(OUT,{recursive:true});
const PAGE='file://'+path.join(REPO,'math-lesson-4-11-01-area-of-rectangles-pt-1.html');
let fails=0;function ok(c,m){console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++;}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1150,height:900},reducedMotion:'reduce'});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(PAGE);await p.waitForTimeout(800);
  ok((await p.evaluate(()=>(window.PQ_FAILED||[]).length))===0,'page layer started with no failures '+JSON.stringify(await p.evaluate(()=>window.PQ_FAILED||[])));
  // ── a window from start to end: advance, explore, choose, then the end task
  async function playWin(id,shot){
    const sel='.cw-slot[data-win="'+id+'"]';await p.locator(sel).scrollIntoViewIfNeeded();
    await p.click(sel+' .cw-play');await p.waitForTimeout(1300);
    for(let i=0;i<200;i++){
      const st=await p.evaluate(s=>{const r=document.querySelector(s),t=r.querySelector('.cw-task');return {task:t.classList.contains('on')?t.textContent:'',reply:r.querySelectorAll('.cw-reply').length,kb:r.querySelectorAll('.cw-task.on .cw-kb button:not(.seen)').length,go:!!r.querySelector('.cw-task.on .cw-go'),next:r.querySelector('.cw-next').classList.contains('on'),text:r.querySelector('.cw-text').textContent};},sel);
      if(st.kb&&!st.go){await p.click(sel+' .cw-kb button:not(.seen) >> nth=0');await p.waitForTimeout(150);continue;}
      if(st.go&&(/\d of \d/.test(st.task)||st.kb))   /* the explore step's Go on (its task shows the "2 of 2" counter) */{await p.click(sel+' .cw-task .cw-go');await p.waitForTimeout(300);continue;}
      if(st.go){if(shot)await p.screenshot({path:path.join(OUT,'win-'+id+'.png')});return st.task;}
      if(st.reply){await p.click(sel+' .cw-reply >> nth=0');await p.waitForTimeout(1200);continue;}
      await p.click(sel+' .cw-dlg',{force:true});await p.waitForTimeout(st.next?150:1600);
    }
    return null;}
  // ── lay tiles by dragging across cells (x0,y0)→(x1,y1) in a grid
  async function drag(root,x0,y0,x1,y1){await p.evaluate(s=>document.querySelector(s+' .ag-svg').scrollIntoView({block:'center',behavior:'instant'}),root);  // center: the sticky tab bar can cover the top rows
    const r=await p.evaluate(([s,a,b,c,d])=>{const g=document.querySelector(s+' .ag-svg');const q=k=>{const e=g.querySelector('rect[data-c="'+k+'"]').getBoundingClientRect();return [e.left+e.width/2,e.top+e.height/2];};return [q(a+'_'+b),q(c+'_'+d)];},[root,x0,y0,x1,y1]);
    await p.mouse.move(r[0][0],r[0][1]);await p.mouse.down();await p.mouse.move((r[0][0]+r[1][0])/2,(r[0][1]+r[1][1])/2,{steps:6});await p.mouse.move(r[1][0],r[1][1],{steps:6});await p.mouse.up();await p.waitForTimeout(80);}
  async function tap(root,x,y){await p.evaluate(s=>document.querySelector(s+' .ag-svg').scrollIntoView({block:'center',behavior:'instant'}),root);const c=await p.evaluate(([s,k])=>{const e=document.querySelector(s+' .ag-svg rect[data-c="'+k+'"]').getBoundingClientRect();return [e.left+e.width/2,e.top+e.height/2];},[root,x+'_'+y]);await p.mouse.click(c[0],c[1]);await p.waitForTimeout(60);}
  async function answer(root,i,v){const f=root+' .ag-ask >> nth='+i;await p.fill(f+' >> input',String(v));await p.click(f+' >> button');await p.waitForTimeout(80);return p.evaluate(s=>document.querySelector(s).querySelector('.ok-msg').textContent,root);}
  async function wrongThenRight(root,i,wrong,right,what){const m=await answer(root,i,wrong);ok(m.length>10,what+': wrong '+wrong+' gets a hint ("'+m.slice(0,60)+'…")');await answer(root,i,right);
    ok(await p.evaluate(([s,k])=>document.querySelectorAll(s+' .ag-ask')[k].classList.contains('ok'),[root,i]),what+': '+right+' is accepted');}
  const job=id=>p.evaluate(i=>{try{return !!JSON.parse(localStorage.getItem('g4-4-11-01-world')).world.jobs[i];}catch(e){return false;}},id);

  // Warm-Up
  const t1=await playWin('gold',true);ok(t1&&/1 ft 6 in by 2 in/.test(t1),'window "gold" ends with the written job');
  ok(JSON.parse(await p.evaluate(()=>localStorage.getItem('g4-4-11-01-predict'))||'{}').id==='strip','gold window: the prediction is saved for the page');
  ok(await p.evaluate(()=>document.querySelector('.cw-slot[data-win="gold"] .cw-tag.on')!==null),'gold window: measure tags shown on the panels');
  const TA='[data-mk-model="think"] .cw-think-a',TB='[data-mk-model="think"] .cw-think-b';
  await drag(TA,0,0,17,0);await drag(TA,0,1,17,1);
  ok((await p.evaluate(s=>document.querySelector(s+' .ag-sym').textContent,TA)).includes('36'),'Think strip: dragging lays 36 tiles');
  await tap(TB,0,0);ok((await p.evaluate(s=>document.querySelector(s+' .ag-sym').textContent,TB)).includes('1'),'Think square: a tap lays a tile');
  await wrongThenRight(TA,0,32,36,'Think strip');await wrongThenRight(TB,0,24,36,'Think square');
  ok(await job('j1'),'job 1 done');
  await p.waitForTimeout(900);ok(await p.$eval('.cw-same36',e=>!e.hidden),'Think solved: the same 36 tiles appear');
  ok(/you thought the strip needed more gold/.test(await p.textContent('.cw-same36')),'Leonardo comes back to the prediction');
  await p.locator('.cw-same36').screenshot({path:path.join(OUT,'same36.png')});
  await p.fill('#journal-notice','I notice the strip is long and thin and it uses feet. I wonder which needs more gold?');
  ok((await p.$$eval('#journal-notice ~ .pq-write .pq-chip.on',x=>x.length))===2,'notice box: a natural answer lights both chips');
  await p.fill('#journal-notice','idk');ok((await p.$$eval('#journal-notice ~ .pq-write .pq-chip.on',x=>x.length))===0,'notice box: "idk" lights none');
  await p.click('#mk-think .pq-hint-btn');await p.click('#mk-think .pq-hint-btn');await p.click('#mk-think .pq-hint-btn');
  ok((await p.$$eval('#mk-think .pq-hint-list li',x=>x.length))===3,'Think hint ladder: 3 rungs');
  // Learn
  await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(1200);  // let the tab's smooth scroll finish
  // stations: a path bar, one station open at a time
  const vis=()=>p.$$eval('.cw-station',x=>x.map(e=>!e.hidden));
  ok((await p.$$eval('.cw-path-b',x=>x.length))===3,'Learn: path bar with 3 stations');
  ok(JSON.stringify(await vis())==='[true,false,false]','Learn: only station 1 shows at first');
  ok(await p.evaluate(()=>document.querySelector('#tab-learn > .tab-next-wrap').hidden),'Learn: the tab Continue button waits for the last station');
  await p.screenshot({path:path.join(OUT,'learn-station1.png')});
  // guided build: gated steps, concrete → picture → number sentence
  const GS=n=>'[data-mk-model="guided"] .cw-gstep[data-n="'+n+'"]';
  ok(!(await p.$eval(GS(2),e=>e.classList.contains('open'))),'Guided: step 2 is locked until step 1 is done');
  const G1=GS(1)+' .cw-gstep-b > div';await drag(G1,0,0,16,0);await drag(G1,0,1,0,2);
  await wrongThenRight(G1,0,15,17,'Guided top row');await wrongThenRight(G1,1,17,3,'Guided rows');
  ok(await p.$eval(GS(2),e=>e.classList.contains('open')),'Guided: step 2 opens after step 1');
  const ask=async(sel,i,v)=>{const f=p.locator(sel+' .ag-ask').nth(i);await f.locator('input').fill(String(v));await f.locator('button').click();await p.waitForTimeout(60);};
  await ask(GS(2),0,1);ok(/feet/.test(await p.$eval(GS(2)+' .ok-msg',e=>e.textContent)),'Guided step 2: 1 gets the feet hint');
  await ask(GS(2),0,17);await ask(GS(2),1,3);
  ok(await p.$eval(GS(2)+' .gl',e=>e.textContent==='17 in'),'Guided step 2: the drawing gets its 17 in label');
  ok(await p.$eval(GS(3),e=>e.classList.contains('open')),'Guided: step 3 opens after step 2');
  await ask(GS(3),0,20);ok(/adds/.test(await p.$eval(GS(3)+' .ok-msg',e=>e.textContent)),'Guided step 3: 20 gets the adding hint');
  await ask(GS(3),0,51);ok(await p.$eval('[data-mk-model="guided"] .cw-gdone',e=>!e.hidden),'Guided: done box shows 51 square inches');
  await p.locator('#mk-guided').screenshot({path:path.join(OUT,'learn-guided.png')});
  await p.click('.cw-station[data-st="1"] .cw-st-next button',{force:true});await p.waitForTimeout(1200);
  ok(JSON.stringify(await vis())==='[false,true,false]','Learn: Next station opens station 2');
  ok((await p.$$eval('#tab-learn .pq-hint .cw-tool',x=>x.length))>=2,'Lesson: try-a-tool buttons sit beside the hint buttons');
  const FA='[data-mk-model="frame"] > div:nth-child(1)',FB='[data-mk-model="frame"] > div:nth-child(2)';
  await drag(FA,0,0,15,0);await drag(FA,0,1,0,2);
  await wrongThenRight(FA,0,14,16,'Frame length');await wrongThenRight(FA,1,12,48,'Frame sheets');
  await tap(FB,0,0);await tap(FB,1,0);await tap(FB,2,0);await tap(FB,3,0);await tap(FB,4,0);await tap(FB,0,1);await tap(FB,0,2);
  await wrongThenRight(FB,0,3,5,'Floor length');await wrongThenRight(FB,1,9,15,'Floor tiles');
  ok(await job('j2'),'job 2 done');
  const SQ='[data-mk-model="square"]';for(let y=0;y<9;y++)await drag(SQ,0,y,8,y);
  ok(/9 inches on each side|9 in by 9 in/.test(await p.evaluate(s=>document.querySelector(s+' .ok-msg').textContent,SQ)),'Square: a 9 by 9 square is recognized');
  await wrongThenRight(SQ,0,36,81,'Square sheets');ok(await job('j3'),'job 3 done');
  await p.click('.cw-station[data-st="2"] .cw-st-next button',{force:true});await p.waitForTimeout(1200);
  ok(JSON.stringify(await vis())==='[false,false,true]','Learn: Next station opens station 3');
  ok(!(await p.evaluate(()=>document.querySelector('#tab-learn > .tab-next-wrap').hidden)),'Learn: Continue shows on the last station');
  await p.click('.cw-path-b >> nth=0');ok(JSON.stringify(await vis())==='[true,false,false]','Learn: the path bar goes back to station 1');
  await p.evaluate(()=>CW_SHOWSTATION(document.querySelector('#mk-fix')));ok(JSON.stringify(await vis())==='[false,false,true]','Learn: a link to the lid opens station 3');
    const SA='[data-mk-model="same"]';
  async function clear(r){await p.click(r+' .ok-reset');}
  await drag(SA,0,0,17,0);await clear(SA);
  for(let y=0;y<2;y++)await drag(SA,0,y,8,y);
  await clear(SA);await drag(SA,0,0,0,8);await drag(SA,1,0,1,8);   // 2 by 9 again, turned: same rectangle
  ok(/already found/.test(await p.evaluate(s=>document.querySelector(s+' .ok-msg').textContent,SA)),'Same shape: a turned rectangle is not new');
  await clear(SA);for(let y=0;y<3;y++)await drag(SA,0,y,5,y);
  ok(await job('j4'),'job 4 done (all 3 rectangles for 18)');
  const t3=await playWin('note',true);ok(t3&&/mistake/.test(t3),'window "note" ends with the written job');
  const FX='[data-mk-model="fix"]';await drag(FX,0,0,11,0);await drag(FX,0,1,0,4);
  await wrongThenRight(FX,0,1,12,'Lid inches');await wrongThenRight(FX,1,5,60,'Lid sheets');ok(await job('j5'),'job 5 done');
  const PL='[data-mk-model="plaster"]';await drag(PL,0,0,8,0);await drag(PL,0,1,0,5);
  await wrongThenRight(PL,0,15,54,'Wall area');await wrongThenRight(PL,1,5,6,'Buckets');ok(await job('j6'),'job 6 done');
  await p.fill('#journal-big','First change the feet to inches so both sides are the same unit, then multiply length times width. Like 1 ft 2 in by 3 in is 14 × 3 = 42.');
  ok((await p.$$eval('#journal-big ~ .pq-write .pq-chip.on',x=>x.length))===3,'big idea box: a natural answer lights all 3 chips');
  // Show What You Know
  await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(300);
  const t4=await playWin('wrap',true);ok(t4&&/next lesson/.test(t4),'window "wrap" ends with the next-lesson note');
  await p.fill('#ans-1a','56');await p.fill('#journal-prove','He has to change 1 foot to 12 inches first. Then 12 × 3 = 36 sheets, not 3.');
  ok((await p.$$eval('#journal-prove ~ .pq-write .pq-chip.on',x=>x.length))===2,'prove box: lights both chips');
  await p.evaluate(()=>gatherAnswers());const g=await p.inputValue('#gatheredOutput');
  ok(/Today's big idea/.test(g)&&/Words I learned today/.test(g),'journal opens with the big idea and lists the words');
  // clean mode hides the windows, the page still works
  await p.click('.pq-mode');ok(await p.evaluate(()=>getComputedStyle(document.querySelector('.cw-slot')).display==='none'),'windows switch hides the windows');
  await p.click('.pq-mode');
  // a word tooltip
  await p.evaluate(()=>switchTab('warmup'));const d=await p.$('.tab-panel.active .pq-def');if(d){await d.hover();await p.waitForTimeout(100);ok(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on')),'a defined word shows its meaning on hover');}
  await p.reload();await p.waitForTimeout(600);await p.evaluate(()=>switchTab('learn'));
  ok(JSON.stringify(await vis())==='[false,false,true]','Learn: the open station is remembered after a reload');
  ok(await p.$eval('[data-mk-model="guided"] .cw-gstep[data-n="3"]',e=>e.classList.contains('open')),'Guided: steps stay open after a reload');
  ok((await p.$$eval('#tab-assignment .pq-hint .cw-tool',x=>x.length))>=2,'Show What You Know: try-a-tool buttons beside hints');
  ok((await p.$$eval('.olt-pro',x=>x.length))===1&&(await p.$$eval('.olt-full',x=>x.length))===0,'tools bar at the top only, with the pro tip');
  // the guide on a ladder: every spot points at something real; a click gives a tip and a question
  ok(await p.evaluate(()=>CW_DATA.guide.spots.every(s=>document.querySelector(s.sel))),'guide: every spot is on the page');
  await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(800);await p.evaluate(()=>{CW_SHOWSTATION(document.querySelector('#mk-guided'));document.querySelector('#mk-guided').scrollIntoView({block:'center',behavior:'instant'});});await p.waitForTimeout(300);
  await p.click('.cwg-man');await p.waitForTimeout(150);
  ok(/one step at a time/.test(await p.$eval('.cwg-say',e=>e.textContent)),'guide: knows the student is at the guided build');
  await p.click('.cwg-q >> nth=0');ok(await p.$eval('.cwg-a',e=>!e.hidden),'guide: a question gets his answer');
  await p.keyboard.press('Escape');ok(await p.$eval('.cwg-panel',e=>e.hidden),'guide: Escape closes him');
  await p.click('.pq-mode');ok(await p.evaluate(()=>getComputedStyle(document.querySelector('.cwg')).display==='none'),'guide: hidden when the windows are off');await p.click('.pq-mode');
  ok(errs.length===0,'no page errors '+JSON.stringify(errs));
  // phone width
  const q=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await q.goto(PAGE);await q.waitForTimeout(600);
  ok(await q.evaluate(()=>document.documentElement.scrollWidth<=392),'390 px: no sideways scroll');
  await q.screenshot({path:path.join(OUT,'phone-warmup.png'),fullPage:true});
  console.log('\n'+(fails?fails+' FAIL':'all ok'));await b.close();process.exit(fails?1:0);})();
