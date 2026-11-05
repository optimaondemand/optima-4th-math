// 4.11.02 play-through: every workshop window, every model (tap, drag AND the row buttons), a wrong answer per box, hints,
// writing, the guide, clean mode. node tools/sparkle/lessons/11-02/play.js   (screenshots → tools/sparkle/out/11-02/)
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const REPO=path.resolve(__dirname,'../../../..'),OUT=path.join(REPO,'tools/sparkle/out/11-02');fs.mkdirSync(OUT,{recursive:true});
const PAGE='file://'+path.join(REPO,'math-lesson-4-11-02-area-of-rectangles-pt-2.html');
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
  async function center(root){await p.evaluate(s=>document.querySelector(s+' .ag-svg').scrollIntoView({block:'center',behavior:'instant'}),root);}
  async function drag(root,x0,y0,x1,y1){await center(root);
    const r=await p.evaluate(([s,a,b,c,d])=>{const g=document.querySelector(s+' .ag-svg');const q=k=>{const e=g.querySelector('rect[data-c="'+k+'"]').getBoundingClientRect();return [e.left+e.width/2,e.top+e.height/2];};return [q(a+'_'+b),q(c+'_'+d)];},[root,x0,y0,x1,y1]);
    await p.mouse.move(r[0][0],r[0][1]);await p.mouse.down();await p.mouse.move((r[0][0]+r[1][0])/2,(r[0][1]+r[1][1])/2,{steps:6});await p.mouse.move(r[1][0],r[1][1],{steps:6});await p.mouse.up();await p.waitForTimeout(80);}
  async function tap(root,x,y){await center(root);const c=await p.evaluate(([s,k])=>{const e=document.querySelector(s+' .ag-svg rect[data-c="'+k+'"]').getBoundingClientRect();return [e.left+e.width/2,e.top+e.height/2];},[root,x+'_'+y]);await p.mouse.click(c[0],c[1]);await p.waitForTimeout(60);}
  async function addRows(root,n){for(let k=0;k<n;k++){await p.click(root+' .ag-addrow');await p.waitForTimeout(30);}}
  const msg=root=>p.evaluate(s=>document.querySelector(s).querySelector('.ok-msg').textContent,root);
  const sym=root=>p.evaluate(s=>document.querySelector(s+' .ag-sym').textContent,root);
  async function answer(root,i,v){const f=root+' .ag-ask >> nth='+i;await p.fill(f+' >> input',String(v));await p.click(f+' >> button');await p.waitForTimeout(80);return msg(root);}
  async function wrongThenRight(root,i,wrong,right,what){const m=await answer(root,i,wrong);ok(m.length>10,what+': wrong '+wrong+' gets a hint ("'+m.slice(0,60)+'…")');await answer(root,i,right);
    ok(await p.evaluate(([s,k])=>document.querySelectorAll(s+' .ag-ask')[k].classList.contains('ok'),[root,i]),what+': '+right+' is accepted');}
  const job=id=>p.evaluate(i=>{try{return !!JSON.parse(localStorage.getItem('g4-4-11-02-world')).world.jobs[i];}catch(e){return false;}},id);

  // ── Warm-Up
  const t1=await playWin('floor',true);ok(t1&&/7 ft/.test(t1)&&/56/.test(t1),'window "floor" ends with the written job');
  ok(JSON.parse(await p.evaluate(()=>localStorage.getItem('g4-4-11-02-predict'))||'{}').id==='longer','floor window: the prediction is saved for the page');
  const TH='[data-mk-model="think"]';
  await drag(TH,0,0,6,0);ok(/7 of 56/.test(await sym(TH)),'Think: a dragged row lays 7 of 56 tiles, and says how many are left');
  ok(!/rows?\b.*8/.test(await sym(TH)),'Think: the count never shows the number of rows');
  await tap(TH,0,1);ok(/8 of 56/.test(await sym(TH)),'Think: a tap lays one tile');
  await addRows(TH,8);ok(/56 of 56/.test(await sym(TH)),'Think: + Add a row fills rows until the tiles run out');
  await p.click(TH+' .ag-addrow');ok(/none left|all 56|Not enough/.test(await msg(TH)),'Think: no tiles left for another row says so');
  await p.click(TH+' .ag-droprow');ok(/49 of 56/.test(await sym(TH)),'Think: − Take away a row lifts a whole row');await addRows(TH,1);
  await wrongThenRight(TH,0,392,8,'Think length');ok(await job('j1'),'job 1 done');
  await p.waitForTimeout(900);ok(await p.$eval('.cw-same36',e=>!e.hidden),'Think solved: the turned-floor payoff appears');
  ok(/longer than it is wide/.test(await p.textContent('.cw-same36')),'Leonardo comes back to the prediction');
  await p.click('.cw-same-go');await p.waitForTimeout(50);ok(/8 ft wide/.test(await p.textContent('.cw-same-n')),'payoff: the floor turns');
  await p.locator('[data-mk-model="think"]').screenshot({path:path.join(OUT,'think.png')});
  await p.fill('#journal-notice','I notice the floor is 7 feet wide and there are 56 tiles. I wonder how long it is?');
  ok((await p.$$eval('#journal-notice ~ .pq-write .pq-chip.on',x=>x.length))===2,'notice box: a natural answer lights both chips');
  await p.fill('#journal-notice','idk');ok((await p.$$eval('#journal-notice ~ .pq-write .pq-chip.on',x=>x.length))===0,'notice box: "idk" lights none');
  for(let k=0;k<3;k++)await p.click('#mk-think .pq-hint-btn');
  ok((await p.$$eval('#mk-think .pq-hint-list li',x=>x.length))===3,'Think hint ladder: 3 rungs');
  // Mental Math with ÷ bonds
  const mm=await p.$$('[data-mk-model="mental"] .mm-bondp');ok(mm.length===3,'Mental Math: 3 problems, each with a blank bond');
  ok(/÷ 4 =/.test(await p.textContent('[data-mk-model="mental"] .mm-bondp >> nth=0')),'Mental Math: the blank bond says ÷ 4');
  const B0='[data-mk-model="mental"] .mm-bondp >> nth=0';
  await p.fill(B0+' >> [data-k="p0"]','40');await p.fill(B0+' >> [data-k="p1"]','12');await p.fill(B0+' >> [data-k="q0"]','10');await p.fill(B0+' >> [data-k="q1"]','3');
  ok((await p.$$eval('[data-mk-model="mental"] .mm-bondp:first-child .mm-sm.good',x=>x.length))===4,'Mental Math: a right ÷ bond turns green');
  await p.fill(B0+' >> .mm-ans','13');await p.click(B0+' >> button[type=submit]');ok(await p.$eval('[data-mk-model="mental"] .mm-bondp',e=>e.classList.contains('ok')),'Mental Math: 52 ÷ 4 = 13 accepted');

  // ── Lesson
  await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(1200);
  const vis=()=>p.$$eval('.cw-station',x=>x.map(e=>!e.hidden));
  ok(JSON.stringify(await vis())==='[true,false,false]','Lesson: only station 1 shows at first');
  const GS=n=>'[data-mk-model="guided"] .cw-gstep[data-n="'+n+'"]';
  ok(!(await p.$eval(GS(2),e=>e.classList.contains('open'))),'Your Turn: step 2 is locked until step 1 is done');
  const G1=GS(1)+' .cw-gstep-b > div';await addRows(G1,14);await drag(G1,0,14,5,14);
  ok(/90 of 90/.test(await sym(G1)),'Your Turn: rows by button and by drag reach 90');
  await wrongThenRight(G1,0,6,15,'Your Turn rows');
  ok(await p.$eval(GS(2),e=>e.classList.contains('open')),'Your Turn: step 2 opens after step 1');
  const ask=async(sel,i,v)=>{const f=p.locator(sel+' .ag-ask').nth(i);await f.locator('input').fill(String(v));await f.locator('button').click();await p.waitForTimeout(60);};
  await ask(GS(2),0,540);ok(/multiplies/.test(await p.$eval(GS(2)+' .ok-msg',e=>e.textContent)),'Your Turn step 2: 540 gets the multiplies hint');
  await ask(GS(2),0,15);ok(await p.$eval(GS(2)+' .gl',e=>e.textContent==='15 in'),'Your Turn step 2: the drawing gets its 15 in label');
  await p.evaluate(s=>document.querySelector(s+' .ag-ask').requestSubmit(),GS(2));await p.waitForTimeout(60);ok(!(await p.$eval('[data-mk-model="guided"] .cw-gdone',e=>!e.hidden)),'Your Turn: a second check does not unlock the end');
  await ask(GS(3),0,15);await ask(GS(3),1,21);ok(/adds/.test(await p.$eval(GS(3)+' .ok-msg >> nth=1',e=>e.textContent)),'Your Turn check: 21 gets the adding hint');
  await ask(GS(3),1,90);ok(await p.$eval('[data-mk-model="guided"] .cw-gdone',e=>!e.hidden),'Your Turn: done box shows');
  await p.locator('#mk-guided').screenshot({path:path.join(OUT,'learn-guided.png')});
  await p.click('.cw-station[data-st="1"] .cw-st-next button',{force:true});await p.waitForTimeout(1200);
  ok(JSON.stringify(await vis())==='[false,true,false]','Next station opens station 2');
  const DK='[data-mk-model="duke"]';await addRows(DK,11);await drag(DK,0,11,3,11);
  await wrongThenRight(DK,0,192,12,'Duke length');await wrongThenRight(DK,1,12,1,'Duke feet');ok(await job('j2'),'job 2 done');
  const SQ='[data-mk-model="square"]';for(let y=0;y<8;y++)await drag(SQ,0,y,7,y);
  ok(/square of 64|all 64/.test(await msg(SQ)),'Square: an 8 by 8 square of 64 is recognized');
  await wrongThenRight(SQ,0,32,8,'Square side');ok(await job('j3'),'job 3 done');
  await p.click('.cw-station[data-st="2"] .cw-st-next button',{force:true});await p.waitForTimeout(1200);
  ok(JSON.stringify(await vis())==='[false,false,true]','Next station opens station 3');
  // Job 4: convert first, then the grid appears
  const CV='[data-mk-model="convert"]';
  ok(await p.$eval(CV+' > div:nth-child(1) > div:nth-child(3)',e=>e.hidden),'Convert: the grid waits for the conversion');
  await ask(CV+' > div:nth-child(1)',0,3);ok(/12 inches/.test(await p.$eval(CV+' > div:nth-child(1) .ok-msg',e=>e.textContent)),'Convert 1: 3 gets the feet-and-inches hint');
  await ask(CV+' > div:nth-child(1)',0,14);const CA=CV+' > div:nth-child(1) > div:nth-child(3)';
  ok(await p.$eval(CA,e=>!e.hidden),'Convert 1: the grid opens');
  await wrongThenRight(CA,0,84,7,'Convert 1 width');
  await ask(CV+' > div:nth-child(2)',0,4);await ask(CV+' > div:nth-child(2)',0,9);const CB=CV+' > div:nth-child(2) > div:nth-child(3)';
  await addRows(CB,13);await wrongThenRight(CB,0,39,13,'Convert 2 length');ok(await job('j4'),'job 4 done');
  const t3=await playWin('note',true);ok(t3&&/mistake/.test(t3),'window "note" ends with the written job');
  const FX='[data-mk-model="fix"]';await wrongThenRight(FX,0,576,9,'Fix side');ok(await job('j5'),'job 5 done');
  const CT='[data-mk-model="cartoon"]';
  await ask(CT+' > div:nth-child(1)',0,21);await ask(CT+' > div:nth-child(1)',0,108);
  const CT2=CT+' > div:nth-child(2) > div:nth-child(2)';ok(await p.$eval(CT+' > div:nth-child(2)',e=>!e.hidden),'Big paper: step 2 opens after the area');
  await addRows(CT2,18);await wrongThenRight(CT2,0,12,18,'Big paper length');ok(await job('j6'),'job 6 done');
  await p.fill('#journal-big','Ask the side I know times what makes the area, then divide and multiply to check. Like 6 × ? = 30 so 30 ÷ 6 = 5 in.');
  ok((await p.$$eval('#journal-big ~ .pq-write .pq-chip.on',x=>x.length))===3,'big idea box: a natural answer lights all 3 chips');
  await p.fill('#journal-fix','He multiplied 72 × 8 but he should divide. 8 × 9 = 72 so the side is 9.');
  ok((await p.$$eval('#journal-fix ~ .pq-write .pq-chip.on',x=>x.length))===2,'fix box: lights both chips');
  // ── Show What You Know
  await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(300);
  const t4=await playWin('wrap',true);ok(t4&&/next lesson/.test(t4),'window "wrap" ends with the next-lesson note');
  await ask('[data-mk-model="prove"]',0,48);ok(/subtracted/.test(await p.$eval('[data-mk-model="prove"] .ok-msg',e=>e.textContent)),'Prove: 48 gets Bernardo hint');
  await ask('[data-mk-model="prove"]',0,9);await ask('[data-mk-model="prove"]',1,54);
  await p.fill('#journal-prove','Bernardo subtracted 54 − 6. You have to divide: 54 ÷ 6 = 9. Check 9 × 6 = 54.');
  ok((await p.$$eval('#journal-prove ~ .pq-write .pq-chip.on',x=>x.length))===2,'prove box: lights both chips');
  await p.fill('#ans-1a','9');await p.evaluate(()=>gatherAnswers());const g=await p.inputValue('#gatheredOutput');
  ok(/Today's big idea/.test(g)&&/Words I learned today/.test(g),'journal opens with the big idea and lists the words');
  await p.click('.pq-mode');ok(await p.evaluate(()=>getComputedStyle(document.querySelector('.cw-slot')).display==='none'),'windows switch hides the windows');await p.click('.pq-mode');
  await p.reload();await p.waitForTimeout(600);await p.evaluate(()=>switchTab('learn'));
  ok(JSON.stringify(await vis())==='[false,false,true]','Lesson: the open station is remembered after a reload');
  ok(await p.$eval('[data-mk-model="guided"] .cw-gdone',e=>!e.hidden),'Your Turn: done after a reload');
  ok(/90 of 90/.test(await sym('[data-mk-model="guided"] .cw-gstep[data-n="1"] .cw-gstep-b > div')),'Your Turn: rows restore after a reload');
  ok(await p.evaluate(()=>CW_DATA.guide.spots.every(s=>document.querySelector(s.sel))),'guide: every spot is on the page');
  await p.evaluate(()=>{CW_SHOWSTATION(document.querySelector('#mk-guided'));document.querySelector('#mk-guided').scrollIntoView({block:'center',behavior:'instant'});});await p.waitForTimeout(300);
  await p.click('.cwg-man');await p.waitForTimeout(150);
  ok(/one step at a time/i.test(await p.$eval('.cwg-say',e=>e.textContent)),'guide: knows the student is at Your Turn');
  await p.click('.cwg-q >> nth=0');ok(await p.$eval('.cwg-a',e=>!e.hidden),'guide: a question gets his answer');
  await p.keyboard.press('Escape');ok(await p.$eval('.cwg-panel',e=>e.hidden),'guide: Escape closes him');
  ok(errs.length===0,'no page errors '+JSON.stringify(errs));
  await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(500);await p.screenshot({path:path.join(OUT,'warmup-1150.png'),fullPage:true});
  const q=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await q.goto(PAGE);await q.waitForTimeout(600);
  ok(await q.evaluate(()=>document.documentElement.scrollWidth<=392),'390 px: no sideways scroll');
  await q.screenshot({path:path.join(OUT,'phone-warmup.png'),fullPage:true});
  console.log('\n'+(fails?fails+' FAIL':'all ok'));await b.close();process.exit(fails?1:0);})();
