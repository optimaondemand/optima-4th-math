// Full play-through of 4.10.04 (every quest, every job, tap and drag, a wrong answer per model, hints, writing, clean mode). node tools/sparkle/lessons/10-04/play.js
const H=require('../../test/harness.js');const path=require('path');const OUT=path.join(H.REPO,'tools/sparkle/out/10-04');require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errs,failed}=await H('math-lesson-4-10-04-customary-capacity.html',1150,900);let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log((c?'ok   ':'FAIL ')+m);};
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
const ask=async(root,vals)=>{const I=await p.$$(`${root} .ok-pour-ask input`);for(let k=0;k<vals.length;k++)await I[k].fill(vals[k]);await p.click(`${root} .ok-pour-ask button`);await p.waitForTimeout(80);return msg(`${root} .ok-pour-ask ~ .ok-msg`);};
const bx=async(root,vals)=>{const F=(await p.$$(`${root} form.mk-two:not(.mk-chain)`)).pop();const I=await F.$$('input');for(let k=0;k<vals.length;k++)await I[k].fill(vals[k]);await (await F.$('button')).click();await p.waitForTimeout(80);return F.evaluate(f=>f.nextElementSibling.textContent);};
const ch=async(root,vals)=>{const I=await p.$$(`${root} .mk-chain input`);for(let k=0;k<vals.length;k++)await I[k].fill(vals[k]);await p.click(`${root} .mk-chain button`);await p.waitForTimeout(80);return msg(`${root} .mk-chain + .ok-msg`);};
const small=r=>`${r} .ok-pr-small .ok-vsl.src`,big=r=>`${r} .ok-pr-big .ok-vsl.src`;
const next=r=>p.click(`${r} .ok-next`);
{const t=await crewSays('felix');ok(/I'm Felix/.test(t)&&!/quart|gallon|×/.test(t),'crew before Learn: Felix says hello about Hilltop (no math yet)');}
ok((await p.$eval('.pq-slot[data-quest="door"]',e=>e.className)).includes('lock'),'door quest locked before Climb the Ladder');
ok(!(await p.$$eval('#tab-warmup .pq-def',x=>x.length?x[0].closest('.mk-board-mount,.fluency-grid')!==null:false)),'first defined word is not in the board or the fact grid');
// ── Warm-Up: job 1 climb the ladder (fill rounds, tap + drag), mental math, Think
const L='#mk-ladder';ok(!(await p.$(`${L} .ok-pour-ask form`)),'ladder: no answer box before the cup is full');
await tapN(small(L),7);await drag(small(L),`${L} .ok-pr-big`);ok((await msg(`${L} .ok-sym`)).includes('8 fluid ounces poured'),'ladder round 1: 8 creamers poured (7 taps + 1 drag)');
await p.click(small(L));ok((await msg(`${L} .ok-sym`)).includes('8 fluid ounces'),'ladder round 1: a full cup takes no more');
ok((await ask(L,['10'])).includes('Are there 10'),'ladder round 1: 10 gets the count-again hint');
await ask(L,['8']);await next(L);
await tapN(small(L),2);ok((await ask(L,['8'])).includes('8 is the number'),'ladder round 2: 8 (wrong step) gets the step hint');await ask(L,['2']);await next(L);
await tapN(small(L),2);await ask(L,['2']);await next(L);
await tapN(small(L),4);ok((await ask(L,['2'])).includes('Is it 2'),'ladder round 4: 2 gets the count hint');await ask(L,['4']);
ok(await job('j1'),'job 1: 1 c = 8 fl oz, 1 pt = 2 c, 1 qt = 2 pt, 1 gal = 4 qt');
await p.fill('#mm-g4-4-10-04-mm-0','5');await p.click('#mk-mental .mm-p[data-i="0"] button');ok((await msg('#mk-mental .mm-p[data-i="0"] .mm-fb')).includes('Count up'),'mental math: a wrong answer gets the count-up hint');
for(const [i,a] of [[0,'3'],[1,'7'],[2,'4'],[3,'6']]){await p.fill(`#mm-g4-4-10-04-mm-${i}`,a);await p.click(`#mk-mental .mm-p[data-i="${i}"] button`);}
ok(await p.$$eval('#mk-mental .mm-p.ok',x=>x.length)===4,'mental math: make a cup, 4 right');
const T='#mk-think';await p.click(big(T));await drag(big(T),`${T} .ok-pr-small`);ok((await msg(`${T} .ok-sym`)).includes('9 quarts'),'think: Can A poured out (tap + drag) = 9 quart bottles');
await p.click(`${T} .ok-rounds button[data-i="1"]`);await tapN(small(T),4);await p.click(`${T} .ok-whole`);await p.click(small(T));
ok((await msg(`${T} .ok-sym`)).includes('2 full gallons')&&(await msg(`${T} .ok-msg`)).includes('not enough'),'think: Can B = 2 full gallons, 2 quarts left (not enough for another)');
await p.fill('#thinkWho','A');await p.fill('#thinkBy','11');await p.click(`${T} .mk-think-ans button`);ok((await msg(`${T} .mk-think-ans .ok-msg`)).includes('21 quarts'),'think: "A by 11" (2 gal 1 qt read as 21 qt) gets the 4-not-10 hint');
await p.fill('#thinkWho','B');await p.fill('#thinkBy','1');await p.click(`${T} .mk-think-ans button`);ok((await p.$eval(`${T} .mk-think-ans .ok-msg`,e=>e.className)).includes('good'),'think: Can B by 1 qt accepted before Learn, any method');
// ── door quest (opener: puzzle door)
await p.waitForTimeout(1300);ok(!(await p.$eval('.pq-slot[data-quest="door"]',e=>e.className)).includes('lock'),'door quest unlocks after job 1');
await p.evaluate(()=>PQ._play('door'));await p.waitForTimeout(600);await drain();
ok(!(await p.evaluate(()=>!!PQ._state().world.gateOpen)),'door: the gate starts closed');
await talkTo(15,13,'up');ok(await p.evaluate(()=>!!PQ._state().q.door.met),'door: Hank calls through the locked gate');
await talkTo(15,13,'up');ok(await padOn(),'door: lock 1 asks 5 fl oz + ? = 1 c');await pad(5);await drain();ok((await lastLog('door')).includes('not 10'),'door: 5 → Cora\'s 8-not-10 hint');await pad(3);await drain();
await talkTo(15,13,'up');await pad(8);await drain();ok((await lastLog('door')).includes('own number'),'door: lock 2, 8 → wrong-step hint');await pad(2);await drain();
await talkTo(15,13,'up');await pad(1);await drain();
await talkTo(15,13,'up');await pad(2);await drain();ok((await lastLog('door')).includes('own number'),'door: lock 4, 2 → wrong-step hint');await pad(4);await drain();await p.waitForTimeout(2800);
ok(await p.evaluate(()=>!!PQ._state().world.gateOpen&&!!PQ._state().done.door),'door quest clear: the gate is open');
await p.evaluate(()=>PQ._play('door'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(15,10,'up'));await p.waitForTimeout(400);await shot('door','g-yard.png');await p.evaluate(()=>PQ._stop());
// ── Learn: the crew window, job 2 cream
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(400);
await p.evaluate(()=>PQ._play('crew'));await p.waitForTimeout(600);await drain();
await talkTo(3,16,'left');ok(!(await p.evaluate(()=>!!PQ._state().done.crew)),'crew: Opti waits until all four are heard');
for(const [x,y,d] of [[5,15,'up'],[5,15,'down'],[8,15,'up'],[8,15,'down']])await talkTo(x,y,d);
ok(await p.evaluate(()=>Object.keys(PQ._state().q.crew.heard||{}).length===4),'crew: heard all four ways');
ok(await p.evaluate(()=>{const L=(PQ._state().logs||{}).crew||[];return L.some(l=>/10 quarts into gallon jugs/.test(l))&&L.some(l=>/9 quarts/.test(l));}),'crew: Atlas\'s and Felix\'s ways are in the quest log');
await talkTo(3,16,'left');await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.crew),'crew quest clear');
const CR='#mk-cream';await p.click(big(CR));await drag(big(CR),`${CR} .ok-pr-small`);await p.click(big(CR));
ok((await msg(`${CR} .ok-sym`)).includes('6 pints'),'cream: 3 quarts poured out (tap + drag) = 6 pints');
ok((await ask(CR,['12'])).includes('gallon number'),'cream: 12 pt (× 4) gets the wrong-step hint');await ask(CR,['6']);await next(CR);
await tapN(big(CR),6);ok((await ask(CR,['3'])).includes('MORE'),'cream: 3 c (dividing going down) gets the going-down hint');await ask(CR,['12']);
ok((await ch(CR,['6','12','24'])).includes('step with 8'),'cream chain: 12 × 2 for fluid ounces gets the step-8 hint');
ok((await ch(CR,['6','12','120'])).includes('not 10'),'cream chain: 120 fl oz gets the 8-not-10 hint');await ch(CR,['6','12','96']);
ok(!(await job('j2')),'job 2 waits for the milk vat');ok((await bx(CR,['18'])).includes('step with 4'),'vat: 18 qt (× 2) gets the wrong-step hint');await bx(CR,['36']);
ok(await job('j2'),'job 2: 3 qt = 6 pt = 12 c = 96 fl oz; 9 gal = 36 qt');
{const t=await crewSays('felix');ok(!/12 cups/.test(t),'crew after job 2: methods still wait for job 3');}
// sort quest: fluid ounces or ounces?
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('sort'));await p.waitForTimeout(600);await drain();
await talkTo(14,10,'up');ok(await p.evaluate(()=>!!PQ._state().q.sort.met),'sort: Hank explains HOLDS and WEIGHS');
const grab=async(x,y)=>{await p.evaluate(([x,y])=>PQ._tp(x,y,'up'),[x,y+1]);await p.keyboard.down('ArrowUp');await p.waitForTimeout(140);await p.keyboard.up('ArrowUp');await p.waitForTimeout(400);await drain();};
await grab(21,10);ok(await p.evaluate(()=>PQ._state().q.sort.hold==='bottle'),'sort: picked up the cream (12 fl oz)');
await talkTo(12,10,'up');ok((await lastLog('sort')).includes('how much a container holds'),'sort: cream in WEIGHS → Cora\'s fl oz hint');
await talkTo(10,10,'up');await grab(4,9);await talkTo(10,10,'up');ok((await lastLog('sort')).includes('how heavy'),'sort: cheese (12 oz) in HOLDS → Felix\'s oz hint');await talkTo(12,10,'up');
await grab(27,15);await talkTo(10,10,'up');await grab(12,19);await talkTo(12,10,'up');
ok(await p.evaluate(()=>Object.keys(PQ._state().q.sort.sorted||{}).length===4),'sort: all 4 labels sorted');
await talkTo(14,10,'up');await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.sort),'sort quest clear');
// job 3: bottle the milk (group up)
const MK='#mk-milk';await tapN(small(MK),7);await drag(small(MK),`${MK} .ok-pr-big`);ok(!!(await p.$(`${MK} .ok-whole`)),'milk: after one cup by hand (7 taps + 1 drag), the whole-cup button shows');
await tapN(`${MK} .ok-whole`,4);ok((await msg(`${MK} .ok-sym`)).includes('5 full cups'),'milk: 40 fl oz = 5 full cups');
ok((await ask(MK,['320'])).includes('FEWER'),'milk: 320 (multiplying going up) gets the going-up hint');await ask(MK,['5']);await next(MK);
await tapN(small(MK),4);await tapN(`${MK} .ok-whole`,6);ok((await ask(MK,['112'])).includes('FEWER'),'milk: 112 gal gets the going-up hint');await ask(MK,['7']);
ok((await bx(MK,['36'])).includes('FEWER'),'pints: 36 (× 2 going up) gets the going-up hint');await bx(MK,['9']);
ok(await job('j3'),'job 3: 40 fl oz = 5 c, 28 qt = 7 gal, 18 c = 9 pt');
{const t=await crewSays('felix');ok(/12 cups/.test(t),'crew after job 3: Felix shares his multiply-down way');}
// job 4: make the next gallon + the milk cans
const X='#mk-cans';const mm=async(i,a,c)=>{const I=await p.$$(`${X} .mm-p[data-i="${i}"] input`);await I[0].fill(a);await I[1].fill(c);await p.click(`${X} .mm-p[data-i="${i}"] button`);};
await mm(0,'2','6');ok((await msg(`${X} .mm-p[data-i="0"] .mm-fb`)).length>0,'next gallon: 2 gal 6 qt gets a nudge');await mm(0,'3','2');await mm(1,'3','4');ok((await msg(`${X} .mm-p[data-i="1"] .mm-fb`)).length>0,'next gallon: 3 gal 4 qt gets a nudge');await mm(1,'4','0');
ok(await p.$$eval(`${X} .mm-p.ok`,x=>x.length)===2,'make the next gallon: 2 gal 3 qt + 3 qt = 3 gal 2 qt, 3 gal 2 qt + 2 qt = 4 gal 0 qt');
await tapN(big(X),3);await drag(big(X),`${X} .ok-pr-small`);ok((await msg(`${X} .ok-sym`)).includes('18 quarts'),'cans: 4 gal 2 qt poured out = 18 quarts');
ok((await ask(X,['42'])).includes('isn\'t 42'),'cans: 42 qt (place-value join) gets its hint');ok((await ask(X,['16'])).includes('Now add the 2'),'cans: 16 gets the forgot-the-extra hint');await ask(X,['18']);await next(X);
await tapN(small(X),4);await tapN(`${X} .ok-whole`,5);await p.click(small(X));ok((await msg(`${X} .ok-msg`)).includes('not enough'),'cans: 3 quarts left can\'t fill another jug');
ok((await ask(X,['5','7'])).includes('more than a gallon'),'cans: 5 gal 7 qt gets the leftover-too-big hint');ok((await ask(X,['2','7'])).includes('tens and ones'),'cans: 2 gal 7 qt gets the group-by-10 hint');
await ask(X,['6','3']);ok(await job('j4'),'job 4: 4 gal 2 qt = 18 qt; 27 qt = 6 gal 3 qt');
// escort quest: the milk wagon, 3 orders
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('escort'));await p.waitForTimeout(600);await drain();
await talkTo(17,17,'right');ok(await padOn(),'escort: order 1 asks 9 qt = ? pt');await pad(36);await drain();ok((await lastLog('escort')).includes('gallon number'),'escort: 36 → Cora\'s wrong-step hint');await pad(18);await drain();await p.waitForTimeout(1100);
await talkTo(22,17,'right');ok(await padOn(),'escort: Hank rolled on; order 2 asks 12 pt = ? qt');await pad(24);await drain();ok((await lastLog('escort')).includes('FEWER'),'escort: 24 → Atlas\'s going-up hint');await pad(6);await drain();await p.waitForTimeout(1100);
await talkTo(27,17,'right');await pad(71);await drain();ok((await lastLog('escort')).includes('71'),'escort: 71 → Hazel\'s place-value hint');await pad(29);await drain();await p.waitForTimeout(2800);
ok(await p.evaluate(()=>!!PQ._state().world.milkrun&&!!PQ._state().done.escort),'escort quest clear: every order delivered');
await p.evaluate(()=>PQ._tp(25,19,'right'));await p.evaluate(()=>PQ._play('escort'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(25,19,'right'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(1500);await adv();await p.waitForTimeout(300);
if(await p.$('.pq-choices.on')){await p.evaluate(()=>document.querySelector('.pq-choices.on button').click());await p.waitForTimeout(1200);await drain();}ok(await p.evaluate(()=>!!PQM.wallet().gear.cap),'shop: bought the explorer cap at Penny\'s cart');await p.evaluate(()=>PQ._stop());
// job 5: the picnic (bar model + chain)
const PC='#mk-picnic';await p.click(`${PC} .bm-fact[data-i="1"]`);await p.click(`${PC} .bm-seg[data-seg="p1"]`);ok((await msg(`${PC} .bm-ask + .ok-msg`)).length>0,'picnic: a fact on the wrong part gets a hint');
await p.click(`${PC} .bm-fact[data-i="1"]`);await p.click(`${PC} .bm-seg[data-seg="p0"]`);await drag(`${PC} .bm-fact[data-i="3"]`,`${PC} .bm-seg[data-seg="p1"]`);
await p.click(`${PC} .bm-fact[data-i="5"]`);await p.click(`${PC} .bm-seg[data-seg="p2"]`);await p.click(`${PC} .bm-fact[data-i="7"]`);await p.click(`${PC} .bm-seg[data-seg="p3"]`);
const sb=async v=>{await p.fill(`${PC} .bm-form input`,v);await p.click(`${PC} .bm-form button`);await p.waitForTimeout(60);return msg(`${PC} .bm-ask + .ok-msg`);};
ok((await sb('8')).includes('not 2'),'picnic bar model: 8 qt (× 2) gets the wrong-step hint');await sb('16');
ok((await ch(PC,['32','64','16'])).includes('quarts'),'picnic chain: 16 children gets the use-the-cups hint');await ch(PC,['32','64','64']);
ok(await job('j5'),'job 5: 4 gal = 16 qt = 32 pt = 64 c → 64 glasses');
// ── Show What You Know: prove it, the trough quest, bonus
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(800);
const P='#mk-prove';ok(!(await p.$(`${P} .ok-pour-ask form`)),'prove: no answer box before the quarts are poured');await tapN(small(P),3);await drag(small(P),`${P} .ok-pr-big`);
ok((await msg(`${P} .ok-sym`)).includes('4 full gallons'),'prove: 3 gal 5 qt poured = 4 full gallons, 1 quart left');
ok((await ask(P,['3','5'])).includes('Smudge wrote'),'prove: 3 gal 5 qt (the Smudge\'s plaque) gets the hint');ok((await ask(P,['4','5'])).includes('4 of the 5'),'prove: 4 gal 5 qt gets the used-quarts hint');
await ask(P,['4','1']);ok(await job('j6'),'job 6: the plaque should say 4 gal 1 qt');
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('trough'));await p.waitForTimeout(800);await drain();
await talkTo(14,10,'up');await talkTo(23,9,'up');ok(await padOn(),'trough: asks 6 gal 1 qt = ? qt');
await pad(61);await drain();ok((await lastLog('trough')).includes('61'),'trough: 61 → Hazel\'s place-value hint');await pad(24);await drain();ok((await lastLog('trough')).includes('extra quart'),'trough: 24 → Felix\'s forgot-the-extra hint');
await pad(25);for(let i=0;i<4;i++){await adv();await p.waitForTimeout(200);}await p.evaluate(()=>PQ._tp(23,9,'up'));await p.waitForTimeout(500);await shot('trough','g-trough.png');await drain();await p.waitForTimeout(3000);
ok(await p.evaluate(()=>!!PQ._state().world.trough&&!!PQ._state().done.trough),'trough quest: full, GOLEM PART 1 stamp found');
ok(await p.evaluate(()=>{const L=(PQ._state().logs||{}).trough||[];return L.some(l=>/GOLEM PART 1/.test(l));}),'trough: the GOLEM PART 1 beat is in the log');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(400);const bd=await p.$('.mk-board');await bd.scrollIntoViewIfNeeded();await bd.screenshot({path:path.join(OUT,'g-board.png')});
await p.evaluate(()=>switchTab('assignment'));await p.click('.ch-card summary');await p.fill('.ch-form input','2');await p.click('.ch-form button[type=submit]');const hint=await p.$eval('.ch-hint',e=>!e.hidden);await p.fill('.ch-form input','3');await p.click('.ch-form button[type=submit]');
ok(hint&&await p.$eval('.ch-explain',e=>!e.hidden),'bonus: hint after a miss, 3 fills solve it');
// ── helpers: defined words, hint ladders, writing chips + counter
const defs=await p.$$eval('.pq-def b',x=>x.map(e=>e.textContent));ok(defs.length===6,'defined words: '+defs.join(', '));
ok(!(await p.$$eval('.activity-sub .pq-def, .activity-title .pq-def, .task-label .pq-def',x=>x.length)),'no defined word sits in a heading');
ok(await p.$$eval('.pq-def',x=>x.every(e=>e.closest('#mk-ladder .task-box'))),'every defined word first appears in Job 1\'s Your job sentence');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(250);{const d=await p.$('.pq-def');await d.scrollIntoViewIfNeeded();ok(!(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on'))),'word meaning hidden in the sentence');
await d.hover();await p.waitForTimeout(100);ok(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on')),'hover shows the meaning as a tooltip');{const r=await p.evaluate(()=>{const t=document.querySelector('.pq-def-m.pq-tip-on').getBoundingClientRect();return [t.left,t.right,document.documentElement.clientWidth];});ok(r[0]>=0&&r[1]<=r[2],'tooltip stays inside the window');}
await (await p.$('#mk-ladder .ok-pourbox')).hover();await d.focus();ok(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on')),'keyboard focus shows the tooltip');await d.screenshot({path:path.join(OUT,'def-tip.png')});}
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(250);
for(let i=0;i<3;i++)await p.click('.pq-hint[data-hint="1"] .pq-hint-btn');ok(await p.$$eval('.pq-hint[data-hint="1"] li',x=>x.length)===3,'hint ladder: 3 rungs');
ok(await p.$$eval('#tab-assignment .q-block .pq-hint',x=>x.length)===3,'every Show What You Know problem has a hint ladder');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(300);
for(const sel of ['#mk-cream','#mk-milk','#mk-cans','#mk-picnic']){const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$$eval(`${sel} .mk-todo`,x=>x.length)===1,'Learn job '+sel+': Your job + one What to do + a hint ladder');}
for(const [tab,sel] of [['warmup','#mk-ladder'],['assignment','#mk-prove']]){await p.evaluate(t=>switchTab(t),tab);await p.waitForTimeout(250);const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$(`${sel} .mk-todo`),'job '+sel+': Your job + What to do + a hint ladder');}
const chipsFor=async(id,txt)=>{await p.fill('#'+id,txt);await p.dispatchEvent('#'+id,'input');return p.$$eval('#'+id+' + .pq-write .pq-chip',x=>x.filter(e=>e.classList.contains('on')).length);};
await p.evaluate(()=>switchTab('warmup'));
for(const t of ['Can B holds more by 1 quart because 2 gallons is 8 quarts and 1 more is 9','I poured them into jugs and can b had one more bottle than can a']){const n=await chipsFor('journal-think',t);ok(n===3,'journal-think natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-think','idk')===0,'journal-think: "idk" lights nothing');
for(const t of ['I notice one is in gallons and quarts and the other is only quarts. I wonder which is more','i see can b has no gallons, i wonder how to compare them']){const n=await chipsFor('journal-notice',t);ok(n===2,'journal-notice natural answer lights '+n+' of 2');}
ok(await chipsFor('journal-notice','idk')===0,'journal-notice: "idk" lights nothing');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(250);
for(const t of ['My way was like Felix because I changed it all to quarts. For 150 qt I would group by 4 like Atlas because it is faster','I did it like Atlas and poured into jugs. For 150 quarts I would divide by four since that makes sense to me']){const n=await chipsFor('journal-compare',t);ok(n===3,'journal-compare natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-compare','idk')===0,'journal-compare: "idk" lights nothing');
for(const t of ['Going down the ladder you multiply by the step number and going up you group. Like 3 qt is 6 pt because each quart is 2 pints','when you go to a smaller unit you times by 4 or 2 or 8, and when you go up you divide. For example 12 cups = 6 pints']){const n=await chipsFor('journal-big',t);ok(n===3,'journal-big natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-big','idk')===0,'journal-big: "idk" lights nothing');
ok((await msg('#journal-big + .pq-write .pq-count')).length>0,'word counter');
await p.evaluate(()=>gatherAnswers());{const g=await p.$eval('#gatheredOutput',e=>e.value);ok(g.includes('Words I learned today')&&g.indexOf('Today\'s big idea')>0&&g.indexOf('Today\'s big idea')<200,'journal: big idea at the top, words at the end');}
// ── board mode for the Learn video's live board
const p2=await p.context().newPage();await p2.goto('file://'+path.join(H.REPO,'math-lesson-4-10-04-customary-capacity.html')+'?board=cream');await p2.waitForTimeout(900);
await p2.click('#pq-boardhost .ok-pr-big .ok-vsl.src');ok((await p2.$eval('#pq-boardhost .ok-sym',e=>e.textContent)).includes('2 pints'),'board mode ?board=cream: the Pour Station alone, taps work');await p2.screenshot({path:path.join(OUT,'board-cream.png')});await p2.close();
// ── clean mode: every job is on the page
ok(await p.evaluate(()=>['j1','j2','j3','j4','j5','j6'].every(j=>PQM.jobDone(j))),'all six jobs done on the page (clean mode can finish without the game)');
ok(await p.evaluate(()=>!!PQ_DATA.voice),'voice clips are wired (PQ_DATA.voice)');
const f=await failed();console.log(JSON.stringify(await p.evaluate(()=>PQM.wallet().coins)),'coins');
console.log(!bad&&!errs.length&&!f.length?'PLAY PASSED':'PLAY FAILED '+bad+' '+errs.join('\n')+f.join('|'));await b.close();})();
