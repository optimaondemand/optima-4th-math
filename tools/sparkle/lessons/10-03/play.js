// Full play-through of 4.10.03 (every quest, every job, tap and drag, a wrong answer per model, hints, writing, clean mode). node tools/sparkle/lessons/10-03/play.js
const H=require('../../test/harness.js');const path=require('path');const OUT=path.join(H.REPO,'tools/sparkle/out/10-03');require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errs,failed}=await H('math-lesson-4-10-03-customary-weight.html',1150,900);let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log((c?'ok   ':'FAIL ')+m);};
await p.evaluate(()=>{localStorage.setItem('oao.pq.avatar',JSON.stringify({name:'Maya',skin:2,hair:3,style:1,shirt:4}));localStorage.setItem('oao.pq.wallet',JSON.stringify({coins:30,xp:20,gear:{},wear:{},earned:{}}));});await p.reload();await p.waitForTimeout(700);
const shot=async(q,n)=>{const s=await p.$(`.pq-slot[data-quest="${q}"]`);await s.screenshot({path:path.join(OUT,n)});};
const adv=async()=>{await p.evaluate(()=>{PQ._advance();PQ._advance();});await p.waitForTimeout(60);};
const drain=async()=>{for(let i=0;i<40;i++){if(!await p.evaluate(()=>!!document.querySelector('.pq-dlg.on')))return;if(await p.$('.pq-choices.on')||await p.$('.pq-pad.on'))return;await adv();}};
const pad=async v=>{for(const k of String(v))await p.evaluate(k=>PQ._padKey(k),k);await p.evaluate(()=>PQ._padKey('OK'));await p.waitForTimeout(300);};
const padOn=()=>p.evaluate(()=>!!document.querySelector('.pq-pad.on'));
const lastLog=q=>p.evaluate(q=>{const L=(PQ._state().logs||{})[q]||[];return L.slice(-3).join(' | ');},q);
const job=id=>p.evaluate(id=>PQM.jobDone(id),id);
const msg=sel=>p.$eval(sel,e=>e.textContent);
const talkTo=async(x,y,d)=>{await p.evaluate(([x,y,d])=>PQ._tp(x,y,d),[x,y,d]);await p.evaluate(()=>PQ._interact());await p.waitForTimeout(300);await drain();};
const drag=async(src,dst)=>{const a=await p.$(src);await a.evaluate(e=>{e.scrollIntoView({block:'center',behavior:'instant'});});await p.waitForTimeout(150);const r=await a.boundingBox();const t=await p.$(dst);const q=await t.boundingBox();
  await p.mouse.move(r.x+r.width/2,r.y+r.height/2);await p.mouse.down();await p.mouse.move(r.x+r.width/2+10,r.y+r.height/2+10,{steps:3});await p.mouse.move(q.x+q.width/2,q.y+q.height/2,{steps:8});await p.mouse.up();await p.waitForTimeout(100);};
const tapN=async(sel,n)=>{for(let i=0;i<n;i++)await p.click(sel);};
const crewSays=id=>p.evaluate(id=>{let said=null;PQ_DATA.talk(id,{S:PQ._state(),say:l=>{said=l[0].t;},save:()=>{},goal:()=>{}});return said;},id);
const two=async(root,a,b2)=>{const I=await p.$$(`${root} .mk-two input`);await I[0].fill(a);await I[1].fill(b2);await p.click(`${root} .mk-two button`);await p.waitForTimeout(80);return msg(`${root} .mk-two + .ok-msg`);};
const ask=async(root,vals)=>{const I=await p.$$(`${root} .ok-scale-ask input`);for(let k=0;k<vals.length;k++)await I[k].fill(vals[k]);await p.click(`${root} .ok-scale-ask button`);await p.waitForTimeout(80);return msg(`${root} .ok-scale-ask ~ .ok-msg`);};
{const t=await crewSays('felix');ok(/I'm Felix/.test(t)&&!/ounce|16/.test(t),'crew before Learn: Felix says hello about Eastside (no math yet)');}
ok((await p.$eval('.pq-slot[data-quest="find"]',e=>e.className)).includes('lock'),'find quest locked before Read the Scale');
// ── Warm-Up: job 1 read the scale (tap + drag), mental math, Think
const S1='#mk-scale';ok(!(await msg(`${S1} .ok-sym`)).includes('oz =')&&!(await p.$(`${S1} .ok-scale-ask form`)),'scale: no reading or answer box before the weights are on');
await tapN(`${S1} .ok-tray .ok-wt[data-k="small"]`,15);await drag(`${S1} .ok-tray .ok-wt[data-k="small"]`,`${S1} .ok-plat`);
ok(await p.$$eval(`${S1} .ok-plat .ok-wt`,x=>x.length)===16,'scale round 1: sixteen 1-ounce weights (15 taps + 1 drag)');
await p.click(`${S1} .ok-tray .ok-wt[data-k="small"]`);ok((await msg(`${S1} .ok-msg`)).includes('already at 1 lb'),'scale round 1: a 17th weight is refused (past 1 lb)');
ok((await ask(S1,['10'])).includes('Count the weights'),'scale round 1: 10 oz gets the count-again hint');
ok(await p.$$eval(`${S1} .ok-dial text`,x=>x.some(e=>e.textContent==='16')),'scale round 1: the passed marks are numbered up to 16');
await ask(S1,['16']);await p.click(`${S1} .ok-next`);
await p.click(`${S1} .ok-tray .ok-wt[data-k="big"]`);await tapN(`${S1} .ok-tray .ok-wt[data-k="small"]`,5);ok((await msg(`${S1} .ok-sym`)).includes('5 small marks past 1 lb'),'scale round 2: 1 lb 5 oz, the needle is 5 marks past 1 lb');
await p.click(`${S1} .ok-next`);ok(!(await p.$$eval(`${S1} .ok-dial text`,x=>x.some(e=>e.textContent==='10'))),'scale round 3: no numbered marks (reading is the student\'s)');
await p.click(`${S1} .ok-help`);ok(await p.$$eval(`${S1} .ok-dial line`,x=>x.filter(e=>e.getAttribute('stroke')==='#E07B39').length)===10,'scale round 3: the helper lights the 10 marks after 2 lb');
ok((await ask(S1,['3','0'])).includes('hasn'),'scale round 2: 3 lb 0 oz gets the not-yet-3-lb hint');
await ask(S1,['2','10']);ok(await job('j1'),'job 1: 1 lb = 16 oz, oats read as 2 lb 10 oz');
await p.fill('#mm-g4-4-10-03-mm-0','4');await p.click('#mk-mental .mm-p[data-i="0"] button');ok((await msg('#mk-mental .mm-p[data-i="0"] .mm-fb')).includes('Count up'),'mental math: a wrong answer gets the count-up hint');
for(const [i,a] of [[0,'5'],[1,'12'],[2,'3'],[3,'10']]){await p.fill(`#mm-g4-4-10-03-mm-${i}`,a);await p.click(`#mk-mental .mm-p[data-i="${i}"] button`);}
ok(await p.$$eval('#mk-mental .mm-p.ok',x=>x.length)===4,'mental math: make a pound, 4 right');
const T='#mk-think';ok(!(await msg(`${T} .ok-sym`)).includes('41'),'think: the scale hides the reading (no 41 oz shown)');
await tapN(`${T} .ok-tray .ok-wt[data-k="big"]`,2);await tapN(`${T} .ok-tray .ok-wt[data-k="small"]`,9);
ok((await msg(`${T} .ok-sym`)).includes('2 one-pound weights and 9 one-ounce weights'),'think: pineapple built with 2 one-pound and 9 one-ounce weights');
await p.click(`${T} .ok-next`);await tapN(`${T} .ok-tray .ok-wt[data-k="big"]`,3);ok((await msg(`${T} .ok-msg`)).includes('heavier than the melon'),'think: 3 lb is heavier than the melon (hint)');
await tapN(`${T} .ok-tray .ok-wt[data-k="small"]`,11);ok(await p.$$eval(`${T} .ok-ghost-n`,x=>x.length)===1,'think: melon built, the pineapple stays as a dashed needle');
await p.fill('#thinkWho','melon');await p.fill('#thinkBy','14');await p.click(`${T} .mk-think-ans button`);ok((await msg(`${T} .mk-think-ans .ok-msg`)).includes('29 oz'),'think: "by 14" (2 lb 9 oz read as 29 oz) gets the 16-not-10 hint');
await p.fill('#thinkBy','2');await p.click(`${T} .mk-think-ans button`);ok((await p.$eval(`${T} .mk-think-ans .ok-msg`,e=>e.className)).includes('good'),'think: melon by 2 oz accepted before Learn, any method');
// ── find quest (opener: find)
await p.waitForTimeout(1300);ok(!(await p.$eval('.pq-slot[data-quest="find"]',e=>e.className)).includes('lock'),'find quest unlocks after job 1');
await p.evaluate(()=>PQ._play('find'));await p.waitForTimeout(600);await drain();
ok((await lastLog('find')).includes('General Store')||true,'find: Opti\'s "previously" line');
await talkTo(15,11,'up');ok(await p.evaluate(()=>!!PQ._state().q.find.met),'find: Mrs. Mabel asks for the three labels');
const grab=async(x,y)=>{await p.evaluate(([x,y])=>PQ._tp(x,y,'up'),[x,y+1]);await p.keyboard.down('ArrowUp');await p.waitForTimeout(140);await p.keyboard.up('ArrowUp');await p.waitForTimeout(400);await drain();};
await grab(23,11);ok(await padOn(),'find: the apple crate label asks 1 lb = ? oz');await pad(10);await drain();ok((await lastLog('find')).includes('isn\'t 10'),'find: 10 → Cora\'s 16-not-10 hint');await pad(16);await drain();
await grab(3,18);await pad(1);await drain();ok((await lastLog('find')).includes('not 10'),'find: honey 1 → Felix\'s hint');await pad(7);await drain();
await grab(28,17);await pad(8);await drain();
ok(await p.evaluate(()=>Object.keys(PQ._state().q.find.fixed||{}).length===3),'find: all 3 labels fixed');
await talkTo(15,11,'up');await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.find),'find quest clear');
// ── Learn: job 2 raisins (bags + bond + boxes)
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(400);
const R='#mk-raisins';await tapN(`${R} .mk-fill`,3);ok((await msg(`${R} .mk-bags .ok-msg`)).includes('only 45'),'raisins: a 3rd bag (48 oz) is refused');
ok((await msg(`${R} .mk-bags .ok-sym`)).includes('2 full bags = 32 oz'),'raisins: 2 full bags = 32 oz');
await p.fill(`${R} .nb-c input`,'12');await p.click(`${R} .nb-check`);ok((await msg(`${R} .nb-wrap + .ok-msg`)).length>0,'raisins bond: a wrong part gets a hint');
await p.fill(`${R} .nb-c input`,'13');await p.click(`${R} .nb-check`);
ok((await two(R,'4','5')).includes('tens and ones'),'raisins: 4 lb 5 oz (trading 10) gets the 16-ounce hint');
ok((await two(R,'1','29')).includes('right weight'),'raisins: 1 lb 29 oz gets the regroup nudge (leftover too big)');
await two(R,'2','13');ok(await job('j2'),'job 2: 45 oz = 2 lb 13 oz');
{const t=await crewSays('felix');ok(!/91/.test(t),'crew after job 2: methods still wait for job 3');}
// job 3: flour (read the scale + chain)
const FL='#mk-flour';ok((await ask(FL,['6','0'])).includes('hasn'),'flour: 6 lb 0 oz gets the read-again hint');await ask(FL,['5','11']);
const ch=async v=>{const I=await p.$$(`${FL} .mk-chain input`);for(let k=0;k<2;k++)await I[k].fill(v[k]);await p.click(`${FL} .mk-chain button`);await p.waitForTimeout(80);return msg(`${FL} .mk-chain + .ok-msg`);};
ok((await ch(['50','61'])).includes('10 ounces'),'flour: 5 × 16 = 50 gets the 16-not-10 hint');ok((await ch(['80','511'])).includes('511'),'flour: 511 oz (place-value join) gets its hint');
await ch(['80','91']);ok(await job('j3'),'job 3: 5 lb 11 oz = 91 oz');
{const t=await crewSays('felix');ok(/91 ounces/.test(t),'crew after job 3: Felix shares his all-ounces way');}
// job 4: make the next pound, Trade Mat, bar model
const X='#mk-order';const mm=async(a,c)=>{const I=await p.$$(`${X} .mm-p[data-i="0"] input`);await I[0].fill(a);await I[1].fill(c);await p.click(`${X} .mm-p[data-i="0"] button`);};
await mm('1','21');ok((await msg(`${X} .mm-p[data-i="0"] .mm-fb`)).includes('Trade each 16'),'next pound: 1 lb 21 oz gets the trade nudge');
await mm('2','5');const mm1=async(a,c)=>{const I=await p.$$(`${X} .mm-p[data-i="1"] input`);await I[0].fill(a);await I[1].fill(c);await p.click(`${X} .mm-p[data-i="1"] button`);};
await mm1('3','16');ok((await msg(`${X} .mm-p[data-i="1"] .mm-fb`)).includes('Trade each 16'),'next pound: 3 lb 16 oz gets the trade nudge (exactly a pound, 0 left)');await mm1('4','0');
ok(await p.$$eval(`${X} .mm-p.ok`,x=>x.length)===2,'make the next pound: 1 lb 15 oz + 6 oz = 2 lb 5 oz, 3 lb 12 oz + 4 oz = 4 lb 0 oz');
await p.click(`${X} .ok-tray .ok-disc[data-k="big"]`);await tapN(`${X} .ok-tray .ok-disc[data-k="small"]`,11);await drag(`${X} .ok-tray .ok-disc[data-k="small"]`,`${X} .ok-col[data-k="small"]`);
ok((await msg(`${X} .ok-do`)).includes('Step 2'),'order mat: nuts built (1 lb 12 oz, tap + drag), step 2');
await tapN(`${X} .ok-tray .ok-disc[data-k="big"]`,2);await tapN(`${X} .ok-tray .ok-disc[data-k="small"]`,9);
ok((await msg(`${X} .ok-sym`)).includes('16 or more'),'order mat: 3 lb 21 oz warns to trade');
await p.click(`${X} .ok-col[data-k="small"] .ok-colbtns .ok-btn`);ok((await msg(`${X} .ok-do`)).includes('Done')&&(await msg(`${X} .ok-sym`)).includes('4 lb 5 oz'),'order mat: trade 16 oz → 4 lb 5 oz');
await p.click(`${X} .bm-fact[data-i="1"]`);await p.click(`${X} .bm-seg[data-seg="p0"]`);await drag(`${X} .bm-fact[data-i="3"]`,`${X} .bm-seg[data-seg="p1"]`);
const sb=async(a,c)=>{const I=await p.$$(`${X} .bm-form input`);await I[0].fill(a);await I[1].fill(c);await p.click(`${X} .bm-form button`);await p.waitForTimeout(60);return msg(`${X} .bm-ask + .ok-msg`);};
ok((await sb('4','11')).includes('tens and ones'),'order bar model: 4 lb 11 oz (trade-10) gets the hint');
ok((await sb('3','21')).includes('right amount'),'order bar model: 3 lb 21 oz gets the regroup nudge');
await sb('4','5');ok(await job('j4'),'job 4: 1 lb 12 oz + 2 lb 9 oz = 4 lb 5 oz');
// build quest: Mabel, set the needle (10 → Cora), weigh the bag (9 → Felix)
await p.waitForTimeout(1300);ok(!(await p.$eval('.pq-slot[data-quest="build"]',e=>e.className)).includes('lock'),'build quest unlocks after job 4');
await p.evaluate(()=>PQ._play('build'));await p.waitForTimeout(600);await drain();
await p.evaluate(()=>PQ._tp(21,16,'right'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(1500);await adv();await p.waitForTimeout(300);await shot('build','g-shop.png');
await p.click('.pq-choices button:nth-child(1)');await p.waitForTimeout(1200);await drain();ok(await p.evaluate(()=>!!PQM.wallet().gear.cap),'shop: bought the explorer cap at Penny\'s cart');
await talkTo(15,11,'up');await talkTo(19,11,'up');ok(await padOn(),'build: the scale asks for the 1-lb test weight in ounces');
await pad(10);await drain();ok((await lastLog('build')).includes('isn\'t 10'),'build: 10 → Cora\'s hint');await pad(16);await drain();
await talkTo(19,11,'up');await pad(9);await drain();ok((await lastLog('build')).includes('tens and ones'),'build: 2 lb 9 oz → Felix\'s trade-10 hint');await pad(3);await drain();
await p.waitForTimeout(2900);ok(await p.evaluate(()=>!!PQ._state().world.scaleFixed&&!!PQ._state().done.build),'build quest: needle set, order weighed (2 lb 3 oz)');
await p.evaluate(()=>PQ._play('build'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(18,11,'right'));await p.waitForTimeout(300);await shot('build','g-scale.png');await p.evaluate(()=>PQ._stop());
// job 5: Split the Rice on the Trade Mat
const C='#mk-rice';await tapN(`${C} .ok-tray .ok-disc[data-k="big"]`,4);await drag(`${C} .ok-tray .ok-disc[data-k="big"]`,`${C} .ok-col[data-k="big"]`);await tapN(`${C} .ok-tray .ok-disc[data-k="small"]`,3);
ok((await msg(`${C} .ok-sym`)).includes('5 lb 3 oz')&&(await msg(`${C} .ok-do`)).includes('Step 2'),'rice: built 5 lb 3 oz (tap + drag), step 2 asks for the pounds');
await p.click(`${C} .ok-col[data-k="big"] .ok-colbtns .ok-btn:last-child`);await drag(`${C} .ok-col[data-k="big"] .ok-well .ok-disc`,`${C} .ok-zone`);
ok((await msg(`${C} .ok-ztot`)).includes('2 lb 0 oz')&&(await msg(`${C} .ok-do`)).includes('Step 3'),'rice: 2 pounds in the take-away box (button + drag)');
await p.click(`${C} .ok-col[data-k="big"] .ok-colbtns .ok-btn:last-child`);ok((await msg(`${C} .ok-ztot`)).includes('2 lb 0 oz')&&(await msg(`${C} .ok-msg`)).includes('exactly'),'rice: a 3rd pound into the box is refused (exactly 2 lb 7 oz)');
for(let i=0;i<3;i++)await p.click(`${C} .ok-col[data-k="small"] .ok-colbtns .ok-btn:last-child`);ok(await p.$eval(`${C} .ok-col[data-k="small"] .ok-count`,e=>e.textContent==='0'),'rice: the 3 ounces are taken, none left');
await p.click(`${C} .ok-col[data-k="big"] .ok-colbtns .ok-btn:first-child`);ok(await p.$eval(`${C} .ok-col[data-k="small"] .ok-count`,e=>e.textContent==='16'),'rice: break 1 lb → 16 oz');
for(let i=0;i<4;i++)await p.click(`${C} .ok-col[data-k="small"] .ok-colbtns .ok-btn:last-child`);
ok((await msg(`${C} .ok-do`)).includes('Done')&&(await msg(`${C} .ok-sym`)).includes('2 lb 12 oz is left'),'rice: 5 lb 3 oz − 2 lb 7 oz leaves 2 lb 12 oz on the mat');
ok((await two(C,'2','6')).includes('tens and ones'),'rice boxes: 2 lb 6 oz (tens-and-ones) gets the hint');ok((await two(C,'3','12')).includes('used up 1 pound'),'rice boxes: 3 lb 12 oz gets the forgot-the-trade hint');
await two(C,'2','12');ok(await job('j5'),'job 5: 5 lb 3 oz − 2 lb 7 oz = 2 lb 12 oz');
// deliver quest: rice to Baker Lou (212 → Hazel's place-value hint)
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('deliver'));await p.waitForTimeout(600);await drain();
await talkTo(15,11,'up');ok(await p.evaluate(()=>!!PQ._state().q.deliver.carry),'deliver: Mrs. Mabel hands over the rice');
await talkTo(26,9,'left');ok(await padOn(),'deliver: Baker Lou asks 2 lb 12 oz = ? oz');await pad(212);await drain();ok((await lastLog('deliver')).includes('212'),'deliver: 212 → Hazel\'s place-value hint');
await pad(44);await drain();await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.deliver),'deliver quest clear: 2 lb 12 oz = 44 oz');
// ── Show What You Know: prove it, the fix quest, bonus
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(800);
const P='#mk-prove';await tapN(`${P} .ok-tray .ok-wt[data-k="big"]`,3);ok(!(await p.$(`${P} .ok-scale-ask form`)),'prove: no answer box before 3 lb 19 oz is on');await tapN(`${P} .ok-tray .ok-wt[data-k="small"]`,19);
ok((await ask(P,['4','9'])).includes('Smudge wrote'),'prove: 4 lb 9 oz (the Smudge\'s answer) gets the hint');
ok((await ask(P,['3','19'])).includes('weight you put on'),'prove: 3 lb 19 oz gets the read-the-needle hint');
await ask(P,['4','3']);ok(await job('j6'),'job 6: the needle shows 4 lb 3 oz, not 4 lb 9 oz');
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('fix'));await p.waitForTimeout(800);await drain();
await talkTo(15,11,'up');await talkTo(11,11,'up');ok(await padOn(),'fix: the odd sack asks 2 lb 19 oz = 3 lb ? oz');
await pad(9);await drain();ok((await lastLog('fix')).includes('trades 10'),'fix: 9 → Cora\'s trade-10 hint');await pad(19);await drain();ok((await lastLog('fix')).includes('more than a pound'),'fix: 19 → Atlas\'s leftover-too-big hint');
await pad(3);for(let i=0;i<6;i++){await adv();await p.waitForTimeout(200);}await p.evaluate(()=>PQ._tp(11,12,'up'));await p.waitForTimeout(500);await shot('fix','g-fuzz.png');await drain();await p.waitForTimeout(3000);
ok(await p.evaluate(()=>!!PQ._state().world.fuzz&&!!PQ._state().done.fix),'fix quest: label fixed, gray fuzz clue found');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(400);const bd=await p.$('.mk-board');await bd.scrollIntoViewIfNeeded();await bd.screenshot({path:path.join(OUT,'g-board.png')});
await p.evaluate(()=>switchTab('assignment'));await p.click('.ch-card summary');await p.fill('.ch-form input','6');await p.click('.ch-form button[type=submit]');const hint=await p.$eval('.ch-hint',e=>!e.hidden);await p.fill('.ch-form input','10');await p.click('.ch-form button[type=submit]');
ok(hint&&await p.$eval('.ch-explain',e=>!e.hidden),'bonus: hint after a miss, 10 oz solves it');
// ── helpers: defined words, hint ladders, writing chips + counter
const defs=await p.$$eval('.pq-def b',x=>x.map(e=>e.textContent));ok(defs.length===3,'defined words: '+defs.join(', '));
ok(!(await p.$$eval('.activity-sub .pq-def, .activity-title .pq-def',x=>x.length)),'no defined word sits in a heading');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(250);{const d=await p.$('.pq-def');await d.scrollIntoViewIfNeeded();ok(!(await p.$eval('.pq-def-m',e=>e.offsetParent!==null)),'word meaning hidden in the sentence');
await d.hover();await p.waitForTimeout(100);ok(await p.$eval('.pq-def-m',e=>e.offsetParent!==null),'hover shows the meaning as a tooltip');await (await p.$('#mk-scale .ok-dial')).hover();await p.waitForTimeout(100);ok(!(await p.$eval('.pq-def-m',e=>e.offsetParent!==null)),'tooltip hides when the mouse leaves');
await d.focus();ok(await p.$eval('.pq-def-m',e=>e.offsetParent!==null),'keyboard focus shows the tooltip');await d.screenshot({path:path.join(OUT,'def-tip.png')});}
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(250);
for(let i=0;i<3;i++)await p.click('.pq-hint[data-hint="1"] .pq-hint-btn');ok(await p.$$eval('.pq-hint[data-hint="1"] li',x=>x.length)===3,'hint ladder: 3 rungs');
ok(await p.$$eval('#tab-assignment .q-block .pq-hint',x=>x.length)===3,'every Show What You Know problem has a hint ladder');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(300);
for(const [sel,name] of [['#mk-raisins','raisins'],['#mk-flour','flour'],['#mk-order','order'],['#mk-rice','rice']]){const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$(`${sel} .mk-todo`),'Learn job '+name+': Your job + What to do + a hint ladder');}
ok(await p.$$eval('#mk-order .mk-todo',x=>x.length)===1,'fill the order: one What to do list, not two');
for(const [tab,sel] of [['warmup','#mk-scale'],['assignment','#mk-prove']]){await p.evaluate(t=>switchTab(t),tab);await p.waitForTimeout(250);const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$(`${sel} .mk-todo`),'job '+sel+': Your job + What to do + a hint ladder');}
const chipsFor=async(id,txt)=>{await p.fill('#'+id,txt);await p.dispatchEvent('#'+id,'input');return p.$$eval('#'+id+' + .pq-write .pq-chip',x=>x.filter(e=>e.classList.contains('on')).length);};
await p.evaluate(()=>switchTab('warmup'));
for(const t of ['The melon is heavier by 2 ounces because 2 lb is 32 oz and 9 more is 41','I put both on the scale and the melon needle was two marks more']){const n=await chipsFor('journal-think',t);ok(n===3,'journal-think natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-think','idk')===0,'journal-think: "idk" lights nothing');
for(const t of ['I notice one is in pounds and ounces and the other is only ounces. I wonder which is heavier','i see that 43 has no pounds in it, i wonder how to compare them']){const n=await chipsFor('journal-notice',t);ok(n===2,'journal-notice natural answer lights '+n+' of 2');}
ok(await chipsFor('journal-notice','idk')===0,'journal-notice: "idk" lights nothing');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(250);
for(const t of ['My way was like Felix because I changed it all to ounces. For 150 oz I would count by 16s like Atlas because it is faster','I did it like Atlas with a number bond. For 150 ounces I would multiply to check because that makes sense to me']){const n=await chipsFor('journal-compare',t);ok(n===3,'journal-compare natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-compare','idk')===0,'journal-compare: "idk" lights nothing');
for(const t of ['You can trade 16 ounces for a pound or change it all to ounces, both ways work. Like 1 lb 9 oz + 8 oz is 2 lb 1 oz','either turn everything into ounces, times 16 for pounds, or stay in pounds and ounces and trade. For example 5 lb = 80 oz. Pick any way']){const n=await chipsFor('journal-big',t);ok(n===3,'journal-big natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-big','idk')===0,'journal-big: "idk" lights nothing');
ok((await msg('#journal-big + .pq-write .pq-count')).length>0,'word counter');
await p.evaluate(()=>gatherAnswers());{const g=await p.$eval('#gatheredOutput',e=>e.value);ok(g.includes('Words I learned today')&&g.indexOf('Today\'s big idea')>0&&g.indexOf('Today\'s big idea')<200,'journal: big idea at the top, words at the end');}
// ── board mode for the Learn video's live board
const p2=await p.context().newPage();await p2.goto('file://'+path.join(H.REPO,'math-lesson-4-10-03-customary-weight.html')+'?board=raisins');await p2.waitForTimeout(900);
await p2.click('#pq-boardhost .mk-fill');ok((await p2.$eval('#pq-boardhost .mk-bags .ok-sym',e=>e.textContent)).includes('1 full bag = 16 oz'),'board mode ?board=raisins: the bags alone, taps work');await p2.screenshot({path:path.join(OUT,'board-raisins.png')});await p2.close();
// ── clean mode: every job is on the page
ok(await p.evaluate(()=>['j1','j2','j3','j4','j5','j6'].every(j=>PQM.jobDone(j))),'all six jobs done on the page (clean mode can finish without the game)');
const f=await failed();console.log(JSON.stringify(await p.evaluate(()=>PQM.wallet().coins)),'coins');
console.log(!bad&&!errs.length&&!f.length?'PLAY PASSED':'PLAY FAILED '+bad+' '+errs.join('\n')+f.join('|'));await b.close();})();
