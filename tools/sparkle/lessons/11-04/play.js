// 4.11.04 play-through: every garden window, every Fence Builder (rails by tap, by side button and by keyboard; the coil
// running out; opposite sides that don't match), a wrong answer per kind of box, hints, writing, the guide, clean mode.
// node tools/sparkle/lessons/11-04/play.js   (screenshots → tools/sparkle/out/11-04/)
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const REPO=path.resolve(__dirname,'../../../..'),OUT=path.join(REPO,'tools/sparkle/out/11-04');fs.mkdirSync(OUT,{recursive:true});
const FILE='file://'+path.join(REPO,'math-lesson-4-11-04-perimeter-pt-1.html');
// the walk-through runs with the one-part-at-a-time view off, so every part is reachable;
// the step view itself is checked at the end (onestep-math.js, ?steps=0 turns it off)
const PAGE=process.env.PAGE_URL||(FILE+'?steps=0');
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
      if(st.kb&&!st.go){await p.click(sel+' .cw-kb button:not(.seen) >> nth=0');await p.waitForTimeout(150);continue;}
      if(st.go&&(/\d of \d/.test(st.task)||st.kb)){await p.click(sel+' .cw-task .cw-go');await p.waitForTimeout(300);continue;}
      if(st.go){if(shot)await p.screenshot({path:path.join(OUT,'win-'+id+'.png')});return st.task;}
      if(st.reply){if(shot)await p.screenshot({path:path.join(OUT,'win-'+id+'-choice.png')});await p.click(sel+' .cw-reply >> nth=0');await p.waitForTimeout(1200);continue;}
      await p.click(sel+' .cw-dlg',{force:true});await p.waitForTimeout(st.next?150:1600);
    }
    return null;}

  const M=n=>'[data-mk-model="'+n+'"]';
  const msg=root=>p.evaluate(s=>{const m=document.querySelectorAll(s+' .ok-msg');return m[m.length-1].textContent;},root);
  const sym=root=>p.textContent(root+' .fb-sym');
  async function center(root){await p.evaluate(s=>document.querySelector(s+' .fb-svg').scrollIntoView({block:'center',behavior:'instant'}),root);await p.waitForTimeout(60);}
  async function rails(root,side,n){await center(root);for(let i=0;i<n;i++)await p.click(root+' .fb-side[data-s="'+side+'"]');await p.waitForTimeout(60);}
  async function build(root,w,h){for(const s of ['t','b'])await rails(root,s,w);for(const s of ['r','l'])await rails(root,s,h);}
  // an ask inside a Fence Builder: by its id, or by index for an ask1 list
  async function ansFB(root,id,v){const f=root+' .fb-ask[data-id="'+id+'"]';await p.fill(f+' input',String(v));await p.click(f+' button');await p.waitForTimeout(70);return msg(root);}
  const isOkFB=(root,id)=>p.$eval(root+' .fb-ask[data-id="'+id+'"]',e=>e.classList.contains('ok'));
  async function wrongRightFB(root,id,wrong,right,what,re){const m=await ansFB(root,id,wrong);
    ok(m.length>10&&(!re||re.test(m)),what+': wrong '+wrong+' gets a hint ("'+m.slice(0,70)+'…")');
    await ansFB(root,id,right);ok(await isOkFB(root,id),what+': '+right+' is accepted');}
  // an ask1 box (the paper jobs): by index within the model
  async function ans1(root,i,v){const f=await p.$$(root+' .cw-asks .ag-ask');await (await f[i].$('input')).fill(String(v));await (await f[i].$('button')).click();await p.waitForTimeout(70);
    return p.evaluate(a=>document.querySelectorAll(a.s+' .cw-asks .ok-msg')[a.k].textContent,{s:root,k:i});}
  const isOk1=(root,i)=>p.$$eval(root+' .cw-asks .ag-ask',(x,k)=>x[k].classList.contains('ok'),i);
  const job=id=>p.evaluate(i=>{try{return !!JSON.parse(localStorage.getItem('g4-4-11-04-world')).world.jobs[i];}catch(e){return false;}},id);

  // ══ Warm-Up ══════════════════════════════════════════════════════════
  const t1=await playWin('garden',true);
  ok(t1&&/30 ft/.test(t1)&&/11 ft/.test(t1),'window "garden" ends with the written job');
  ok(!!JSON.parse(await p.evaluate(()=>localStorage.getItem('g4-4-11-04-predict'))||'{}').id,'garden window: the prediction is saved for the page');

  const TH=M('think');
  ok(!!(await p.$(TH+' .fb-ask[data-id="two"]')),'Think: the boxes are there before any building (try it your own way)');
  await rails(TH,'t',11);
  ok(/11 feet/.test(await sym(TH))&&/on the coil: 19/.test(await sym(TH)),'Think: 11 rails on the top leave 19 ft on the coil');
  ok(/\?/.test(await p.textContent(TH+' .fb-svg')),'Think: the short side shows "?" while it is unknown');
  await rails(TH,'b',11);
  ok(/still 8 feet/.test(await msg(TH)),'Think: after both long sides, the coil holds 8 ft');
  await rails(TH,'r',5);await rails(TH,'l',3);
  ok(/do not match/.test(await msg(TH)),'Think: 5 and 3 use every rail but do not close the garden');
  await p.click(TH+' .fb-side[data-s="l"]');
  ok(/not enough fencing/.test(await msg(TH)),'Think: a rail more than the coil holds is refused');
  await p.click(TH+' .ok-reset');await build(TH,11,4);
  ok(/on the coil: 0/.test(await sym(TH)),'Think: 11 + 4 + 11 + 4 uses all 30 ft');
  ok(/4 ft/.test(await p.textContent(TH+' .fb-svg')),'Think: the short side stops saying "?" once the garden closes');
  await wrongRightFB(TH,'two',30,22,'Think two long sides',/ALL the fencing|part of it/);
  await ansFB(TH,'left',8);
  await wrongRightFB(TH,'short',11,4,'Think short side',/long side|square/);
  ok(await job('j1'),'job 1 done');
  await p.waitForTimeout(900);
  ok(await p.$eval('.cw-same36',e=>!e.hidden),'Think solved: the same-fence payoff appears');
  ok(/56 square feet/.test(await p.textContent('.cw-same36')),'payoff: Plan B holds 56 square feet on the same 30 ft of fence');
  ok(/Before you worked it out/.test(await p.textContent('.cw-same36')),'Leonardo comes back to the prediction');
  await p.locator(TH).screenshot({path:path.join(OUT,'think.png')});

  await p.fill('#journal-notice','I notice there is 30 feet of fencing and the long side is 11 feet. I wonder how long the short side is.');
  ok((await p.$$eval('#journal-notice ~ .pq-write .pq-chip.on',x=>x.length))===2,'notice box: a natural answer lights both chips');
  await p.fill('#journal-notice','idk');
  ok((await p.$$eval('#journal-notice ~ .pq-write .pq-chip.on',x=>x.length))===0,'notice box: "idk" lights none');
  for(let k=0;k<3;k++)await p.click('#mk-think .pq-hint-btn');
  ok((await p.$$eval('#mk-think .pq-hint-list li',x=>x.length))===3,'Think hint ladder: 3 rungs');

  const mm=await p.$$(M('mental')+' .mm-bondp');ok(mm.length===3,'Mental Math: 3 problems, each with a blank bond');
  const B0=M('mental')+' .mm-bondp >> nth=0';
  await p.fill(B0+' >> .mm-ans','46');await p.click(B0+' >> button[type=submit]');
  ok(await p.$eval(M('mental')+' .mm-bondp',e=>e.classList.contains('ok')),'Mental Math: double 23 = 46 accepted');

  // ══ Lesson ═══════════════════════════════════════════════════════════
  await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(1200);
  const vis=()=>p.$$eval('.cw-station',x=>x.map(e=>!e.hidden));
  ok(JSON.stringify(await vis())==='[true,false,false]','Lesson: only station 1 shows at first');

  const GD=M('guided');
  ok(!(await p.$(GD+' .fb-ask:not([hidden])'))||await p.$eval(GD+' .fb-asks',e=>e.hidden),'Your Turn: no number boxes until the bed is fenced');
  await build(GD,7,5);
  ok(await p.$eval(GD+' .fb-asks',e=>!e.hidden),'Your Turn: the boxes open once the fence closes');
  await wrongRightFB(GD,'two',24,14,'Your Turn two long sides',/all the fencing|part of it/);
  await wrongRightFB(GD,'left',17,10,'Your Turn what is left',/ONE long side|both/);
  await wrongRightFB(GD,'short',10,5,'Your Turn short side',/BOTH|share/);
  ok(/5 feet/.test(await msg(GD)),'Your Turn: the done message names 5 feet');
  await p.locator('#mk-guided').screenshot({path:path.join(OUT,'learn-guided.png')});
  ok(/2 × \(L \+ W\)/.test(await p.textContent('#mk-key')),'rules card: the IP\'s short way is shown once');

  await p.click('.cw-station:not([hidden]) .cw-st-next, .cw-st-next:visible');await p.waitForTimeout(1200);

  const WK=M('walk');
  await build(WK,14,6);
  await wrongRightFB(WK,'p',84,40,'Job 2 round 1',/ground inside|area/);
  await p.waitForTimeout(300);
  ok(await p.$$eval('[data-mk-model="walk"] .fb-svg',x=>x.length)>=2,'Job 2: round 2 opens when round 1 is done');
  const WK2='[data-mk-model="walk"] > div:nth-child(2)';
  await build(WK2,5,5);await wrongRightFB(WK2,'p',25,20,'Job 2 round 2 (square)',/ground inside|four/);
  await p.waitForTimeout(300);
  const WK3='[data-mk-model="walk"] > div:nth-child(3)';
  await build(WK3,18,7);await ansFB(WK3,'half',25);await wrongRightFB(WK3,'p',25,50,'Job 2 round 3',/half the way around/);
  ok(await job('j2'),'job 2 done');

  const BK=M('back');
  await build(BK,4,11);
  await ansFB(BK,'two',8);await ansFB(BK,'left',22);
  await wrongRightFB(BK,'short',22,11,'Job 3 round 1',/BOTH|share/);
  await p.waitForTimeout(300);
  const BK2='[data-mk-model="back"] > div:nth-child(2)';
  ok(!(await p.$eval(BK2,e=>e.hidden)),'Job 3: round 2 opens when round 1 is done');
  for(const [i,v] of [[0,96],[1,54],[2,27],[3,23]])await ans1(BK2,i,v);
  ok(await isOk1(BK2,3),'Job 3 round 2: the square bed is 23 cm a side');
  ok(await job('j3'),'job 3 done');

  await p.click('.cw-station:not([hidden]) .cw-st-next, .cw-st-next:visible');await p.waitForTimeout(1200);
  const MX=M('mix');
  ok(/46 feet is the distance around|around the edge/.test(await ans1(MX,0,46)),'Job 4: the perimeter as the area gets a hint');
  for(const [i,v] of [[0,102],[1,46],[2,6],[3,30]])await ans1(MX,i,v);
  ok(await job('j4'),'job 4 done');

  const t2=await playWin('note',true);
  ok(t2&&/mistake/i.test(t2),'window "note" ends with the written job');
  const FX=M('fix');
  ok(/96 ft|far more fencing/.test(await ans1(FX,0,24)),'Job 5: Bernardo\'s own answer is shown to be too much fence');
  for(const [i,v] of [[0,12],[1,144],[2,8],[3,128]])await ans1(FX,i,v);
  ok(await job('j5'),'job 5 done');
  await p.fill('#journal-fix','He divided by 2 but a square has 4 sides. 48 divided by 4 is 12 feet.');
  ok((await p.$$eval('#journal-fix ~ .pq-write .pq-chip.on',x=>x.length))===2,'fix box: both chips light');

  // ══ Show What You Know ═══════════════════════════════════════════════
  await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(1000);
  for(const [id,v] of [['1a',50],['1b',25],['1c',50],['2a',40],['2b',8],['3a',18],['3b',324]])await p.fill('#ans-'+id,String(v));
  const BN=M('bonus');
  for(const [w,h] of [[5,1],[4,2],[3,3]]){await p.click(BN+' .ok-reset');await build(BN,w,h);}
  ok(/3 of 3/.test(await p.textContent(BN+' .fb-found')),'bonus: three different gardens from the same 12 rails');
  ok(/9 sq ft/.test(await p.textContent(BN+' .fb-found')),'bonus: the 3 by 3 garden holds the most');
  const PV=M('prove');
  for(const [i,v] of [[0,2],[1,16],[2,4],[3,24]])await ans1(PV,i,v);
  ok(await isOk1(PV,3),'Prove It: both gardens worked out');
  await p.fill('#journal-prove','The 8 by 2 garden holds 16 square feet and the 6 by 4 garden holds 24. Both use 20 feet of fence, so the same fence does not mean the same ground.');
  ok((await p.$$eval('#journal-prove ~ .pq-write .pq-chip.on',x=>x.length))===3,'prove box: all three chips light');
  const t3=await playWin('wrap',true);
  ok(t3&&/bends|number/.test(t3),'window "wrap" ends looking forward to 4.11.05');

  // ══ the guide, progress, reload ══════════════════════════════════════
  const spots=await p.evaluate(()=>CW_DATA.guide.spots.map(s=>[s.sel,!!document.querySelector(s.sel)]));
  ok(spots.every(s=>s[1]),'every guide spot selector exists: '+spots.filter(s=>!s[1]).map(s=>s[0]).join(', '));
  ok((await p.$$eval('.cwg-man, .cwg-btn',x=>x.length))>0,'the guide is on the page');
  // he walks into a window while one plays; scrolling away sends him back to the lift
  await p.evaluate(()=>switchTab('warmup'));await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(1200);
  await p.evaluate(()=>(document.querySelector('.cwg-btn')||document.querySelector('.cwg-man')).click());await p.waitForTimeout(500);
  ok((await p.$$eval('.cwg-panel .cwg-q',x=>x.length))>0,'the guide\'s card opens with questions to ask');
  await p.click('.cwg-panel .cwg-q >> nth=0');await p.waitForTimeout(250);
  ok((await p.$$eval('.cwg-panel .cwg-a',x=>x.length))>0,'a question opens its answer under it');
  await p.keyboard.press('Escape');await p.waitForTimeout(200);
  ok((await p.$$eval('.cwg-panel.on',x=>x.length))===0,'Escape closes the guide\'s card');
  ok((await p.$$eval('.cw-dlg .cwg-man',x=>x.length))===0,'never two guides at once');
  ok(/Garden jobs/.test(await p.textContent('.progress-label')),'the progress label uses this lesson\'s word for its jobs');
  ok(/5 of 5 jobs/.test(await p.textContent('#progressPct')),'progress counts jobs, not tabs: '+await p.textContent('#progressPct'));

  await p.reload();await p.waitForTimeout(900);
  ok(await p.$eval(M('think')+' .fb-ask[data-id="short"] input',e=>e.disabled),'reload: the Think answers are still there');
  ok(await p.$eval('#ans-3b',e=>e.value==='324'),'reload: the Show What You Know boxes restore');
  await p.screenshot({path:path.join(OUT,'page.png'),fullPage:true});

  // the one-part-at-a-time view: about 22 steps, and no step that is only a label
  await p.goto(FILE);await p.waitForTimeout(1200);
  const steps=await p.evaluate(()=>document.querySelectorAll('#tab-warmup .osm-row, #tab-warmup .osm-first, #tab-warmup .osm-off').length
    +document.querySelectorAll('#tab-learn .osm-row, #tab-learn .osm-first, #tab-learn .osm-off').length);
  ok(steps>0,'one part at a time is on ('+steps+' parts across the first two tabs)');
  ok(await p.evaluate(()=>!!document.querySelector('.osm-bar')),'the step bar is there');
  // clean mode is a saved toggle, not a URL flag
  await p.evaluate(()=>localStorage.setItem('oao.pq.clean','true'));
  await p.goto(FILE+'?steps=0');await p.waitForTimeout(900);
  ok((await p.$$eval('.cwg-man, .cwg-btn',x=>x.filter(e=>e.offsetParent!==null).length))===0,'clean mode: the guide is hidden');
  await p.evaluate(()=>localStorage.setItem('oao.pq.clean','false'));
  await p.setViewportSize({width:390,height:844});await p.goto(PAGE);await p.waitForTimeout(900);
  ok(await p.evaluate(()=>document.documentElement.scrollWidth)<=392,'no sideways scroll at 390 px');
  await p.screenshot({path:path.join(OUT,'page-390.png'),fullPage:true});

  ok(!errs.length,'no page errors '+errs.join(' | '));
  console.log(fails?fails+' FAIL':'play-through passed');
  await b.close();process.exit(fails?1:0);
})();
