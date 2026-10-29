// Full play-through of 4.10.01 (every quest, every job, the shop, tap and drag). node tools/sparkle/lessons/10-01/play.js
const H=require('../../test/harness.js');const path=require('path');const OUT=path.join(H.REPO,'tools/sparkle/out/10-01');require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errs,failed}=await H('math-lesson-4-10-01-metric-units.html',1150,900);let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log((c?'ok   ':'FAIL ')+m);};
await p.evaluate(()=>{localStorage.setItem('oao.pq.avatar',JSON.stringify({name:'Maya',skin:2,hair:3,style:1,shirt:4}));localStorage.setItem('oao.pq.wallet',JSON.stringify({coins:30,xp:20,gear:{},wear:{},earned:{}}));});await p.reload();await p.waitForTimeout(700);
const shot=async(q,n)=>{const s=await p.$(`.pq-slot[data-quest="${q}"]`);await s.screenshot({path:path.join(OUT,n)});};
const adv=async()=>{await p.evaluate(()=>{PQ._advance();PQ._advance();});await p.waitForTimeout(60);};
const drain=async()=>{for(let i=0;i<40;i++){if(!await p.evaluate(()=>!!document.querySelector('.pq-dlg.on')))return;if(await p.$('.pq-choices.on')||await p.$('.pq-pad.on'))return;await adv();}};
const pad=async v=>{for(const k of String(v))await p.evaluate(k=>PQ._padKey(k),k);await p.evaluate(()=>PQ._padKey('OK'));await p.waitForTimeout(300);};
const job=id=>p.evaluate(id=>PQM.jobDone(id),id);
const msg=sel=>p.$eval(sel,e=>e.textContent);
const drag=async(src,dst)=>{const a=await p.$(src);await a.evaluate(e=>{(e.closest('.oao-kit,.activity')||e).scrollIntoView({block:'center',behavior:'instant'});});await p.waitForTimeout(150);const r=await a.boundingBox();const t=await p.$(dst);const q=await t.boundingBox();
  await p.mouse.move(r.x+r.width/2,r.y+r.height/2);await p.mouse.down();await p.mouse.move(r.x+r.width/2+10,r.y+r.height/2+10,{steps:3});await p.mouse.move(q.x+q.width/2,q.y+q.height/2,{steps:8});await p.mouse.up();await p.waitForTimeout(100);};
const crewSays=id=>p.evaluate(id=>{let said=null;PQ_DATA.talk(id,{S:PQ._state(),say:l=>{said=l[0].t;},save:()=>{},goal:()=>{}});return said;},id);
{const t=await crewSays('felix');ok(/I'm Felix/.test(t)&&!/165|cm/.test(t),'crew before Learn: Felix says hello and talks about the market (no math yet)');}
// ── Warm-Up: job 1 stamps (tap), mental math, Think bar model
for(const [v,id] of [['×10','mmcm'],['×100','cmm'],['×1,000','mkm']]){await p.click(`.mk-stamp[data-v="${v}"]`);await p.click(`.mk-sign[data-id="${id}"]`);}
ok(await job('j1'),'job 1: stamps');
await p.fill('#mm-g4-4-10-01-mm3-0','30');await p.click('.mm-p[data-i="0"] button');ok((await msg('.mm-p[data-i="0"] .mm-fb')).includes('Count up'),'mental math: a wrong answer gets the count-up hint');
for(const [i,a] of [[0,'35'],[1,'55'],[2,'18'],[3,'62']]){await p.fill(`#mm-g4-4-10-01-mm3-${i}`,a);await p.click(`.mm-p[data-i="${i}"] button`);}
ok(await p.$$eval('.mm-p.ok',x=>x.length)===4,'mental math: make 100, 4 right');
const T='#mk-think';for(const i of [1,3,5]){await p.click(`${T} .bm-fact[data-i="${i}"]`);await p.click(`${T} .bm-seg[data-seg="p${(i-1)/2}"]`);}
const tb=async(mv,cv)=>{const I=await p.$$(`${T} .bm-form input`);await I[0].fill(mv);await I[1].fill(cv);await p.click(`${T} .bm-form button`);};
await tb('1','95');ok((await msg(`${T} .ok-msg`)).includes('1 m in it'),'think: 1 m 95 cm (195 cm) gets the "forgot the meters" hint');
await tb('0','495');ok((await p.$eval(`${T} .ok-msg`,e=>e.className)).includes('good')&&(await msg(`${T} .ok-msg`)).includes('4 m 95 cm'),'think: 0 m 495 cm (all centimeters) accepted before Learn, any method');
// ── planks quest
await p.evaluate(()=>PQ._play('planks'));await p.waitForTimeout(600);await drain();
for(const [x,y,k] of [[11,17,'ArrowDown'],[1,5,'ArrowUp'],[29,8,'ArrowDown']]){await p.evaluate(([x,y])=>PQ._tp(x,y,'down'),[x,y]);if(x==29){await p.evaluate(()=>PQ._tp(29,6,'down'));}await p.keyboard.down(k);await p.waitForTimeout(140);await p.keyboard.up(k);await p.waitForTimeout(400);await drain();}
await p.evaluate(()=>PQ._tp(22,9,'up'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(300);await drain();await p.waitForTimeout(2800);
ok(await p.evaluate(()=>!!PQ._state().done.planks),'planks quest: 3 planks found, brought to Mo');
// ── shop (crew window gone; use planks window)
await p.evaluate(()=>PQ._play('arrive'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(23,15,'up'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(1500);await adv();await p.waitForTimeout(300);await shot('arrive','g-shop.png');
await p.click('.pq-choices button:nth-child(1)');await p.waitForTimeout(1200);await drain();
// ── Learn: job 2 counter on the Two-Unit Mat (tap + drag, adds, trades)
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(400);
ok((await p.$eval('.pq-slot[data-quest="counter"]',e=>e.className)).includes('lock'),'counter quest locked before job 2');
const C='#mk-counter';await p.click(`${C} .ok-add`);ok((await msg(`${C} .ok-msg`)).includes('Build one plank'),'counter: add is held until plank 1 is built');
await p.click(`${C} .ok-tray .ok-disc[data-p="100"]`);for(let i=0;i<6;i++)await p.click(`${C} .ok-tray .ok-disc[data-p="10"]`);for(let i=0;i<4;i++)await p.click(`${C} .ok-tray .ok-disc[data-p="1"]`);
await drag(`${C} .ok-tray .ok-disc[data-p="1"]`,`${C} .ok-col[data-p="1"]`);
await p.click(`${C} .ok-add`);await p.click(`${C} .ok-add`);
await p.waitForFunction(s=>(document.querySelector(s)||{}).textContent.includes('Trade'),`${C} .ok-sym`,{timeout:3000}).catch(()=>{});
const sym=await msg(`${C} .ok-sym`);ok(sym.includes('3 × 1 m 65 cm')&&sym.includes('3 m 195 cm')&&sym.includes('Trade'),'counter: 3 planks show 3 × 1 m 65 cm = 3 m 195 cm + regroup warning');
await p.screenshot({path:path.join(OUT,'counter-before.png'),clip:await (await p.$(C)).boundingBox()});
await p.click(`${C} .ok-col[data-p="1"] .ok-colbtns .ok-btn`);await p.click(`${C} .ok-col[data-p="10"] .ok-colbtns .ok-btn`);
ok((await msg(`${C} .ok-sym`)).includes('4 m 95 cm')&&await job('j2'),'job 2: counter = 4 m 95 cm');
{const t=await crewSays('felix');ok(/165 cm/.test(t),'crew after the counter job: Felix shares his one-unit method');}
await p.waitForTimeout(1200);ok(!(await p.$eval('.pq-slot[data-quest="counter"]',e=>e.className)).includes('lock'),'counter quest unlocks');
await p.evaluate(()=>PQ._play('counter'));await p.waitForTimeout(700);await p.evaluate(()=>PQ._tp(22,9,'up'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(300);await drain();
await pad(195);await drain();await pad(495);await drain();await p.waitForTimeout(1500);await drain();await p.waitForTimeout(2800);
ok(await p.evaluate(()=>!!PQ._state().world.counter),'counter quest: 195 → Atlas hint, 495 → counter built');
await p.evaluate(()=>PQ._tp(27,13,'up'));await p.waitForTimeout(300);await shot('counter','g-counter.png');
// job 3 juice
const J='#mk-juice';await p.click(`${J} .ok-tray .ok-disc[data-p="1000"]`);await p.click(`${J} .ok-tray .ok-disc[data-p="1000"]`);for(let i=0;i<7;i++)await p.click(`${J} .ok-tray .ok-disc[data-p="100"]`);for(let i=0;i<5;i++)await p.click(`${J} .ok-tray .ok-disc[data-p="10"]`);
await p.click(`${J} .ok-add`);ok((await msg(`${J} .ok-sym`)).includes('3 L 1,150 mL'),'juice: two orders show 3 L 1,150 mL');
await p.click(`${J} .ok-col[data-p="100"] .ok-colbtns .ok-btn`);ok((await msg(`${J} .ok-sym`)).includes('4 L 150 mL')&&await job('j3'),'job 3: juice = 4 L 150 mL');
// job 4 flour
const F='#mk-flour';await p.click(`${F} .bm-fact[data-i="1"]`);await p.click(`${F} .bm-seg[data-seg="whole"]`);await drag(`${F} .bm-fact[data-i="3"]`,`${F} .bm-seg[data-seg="p0"]`);
await p.fill(`${F} .bm-form input`,'3300');await p.click(`${F} .bm-form button`);ok((await msg(`${F} .ok-msg`)).includes('6,005'),'flour: 3,300 gets the 6,005 g hint');
await p.fill(`${F} .bm-form input`,'3,255');await p.click(`${F} .bm-form button`);ok(await job('j4'),'job 4: flour = 3,255 g');
await p.waitForTimeout(1200);await p.evaluate(()=>PQ._play('flour'));await p.waitForTimeout(700);await p.evaluate(()=>PQ._tp(5,9,'up'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(300);await drain();
await pad(65);await drain();await pad(6005);await drain();await p.evaluate(()=>PQ._tp(27,13,'up'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(300);await drain();await p.waitForTimeout(2800);
ok(await p.evaluate(()=>!!PQ._state().world.flour&&!!PQ._state().done.flour),'flour quest: 65 → Cora hint, 6,005 → delivered to Amy');
// ── sign
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(1200);
await p.evaluate(()=>PQ._play('sign'));await p.waitForTimeout(800);await drain();await p.evaluate(()=>PQ._tp(21,13,'up'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(300);await drain();await p.waitForTimeout(700);
await pad(2000);for(let i=0;i<5;i++){await adv();await p.waitForTimeout(250);}await p.evaluate(()=>PQ._tp(26,14,'up'));await p.waitForTimeout(900);await shot('sign','g-open.png');await drain();await p.waitForTimeout(3000);
ok(await job('j5'),'job 5: sign fixed, stand open');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(400);const bd=await p.$('.mk-board');await bd.scrollIntoViewIfNeeded();await bd.screenshot({path:path.join(OUT,'g-board.png')});
// ── bonus
await p.evaluate(()=>switchTab('assignment'));await p.click('.ch-card summary');await p.fill('.ch-form input','4');await p.click('.ch-form button[type=submit]');const hint=await p.$eval('.ch-hint',e=>!e.hidden);await p.fill('.ch-form input','5');await p.click('.ch-form button[type=submit]');
ok(hint&&await p.$eval('.ch-explain',e=>!e.hidden),'bonus: hint after a miss, 5 L solves it');
// ── helpers: defined words, hint ladder, writing chips + counter
const defs=await p.$$eval('.pq-def b',x=>x.map(e=>e.textContent));ok(defs.length===5,'defined words: '+defs.join(', '));
for(let i=0;i<3;i++)await p.click('.pq-hint[data-hint="1"] .pq-hint-btn');ok(await p.$$eval('.pq-hint[data-hint="1"] li',x=>x.length)===3,'hint ladder: 3 rungs');
ok(await p.$$eval('#tab-assignment .q-block .pq-hint',x=>x.length)===4,'every Show What You Know problem has a hint ladder');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(300);
for(const [sel,name] of [['#mk-counter','counter'],['#mk-juice','juice'],['#mk-flour','flour'],['#mk-prove','sign']]){const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box, ${sel} .mk-todo`),'Learn job '+name+': story/what-to-do + a hint ladder');}
const chipsFor=async(id,txt)=>{await p.fill('#'+id,txt);await p.dispatchEvent('#'+id,'input');return p.$$eval('#'+id+' + .pq-write .pq-chip',x=>x.filter(e=>e.classList.contains('on')).length);};
await p.evaluate(()=>switchTab('warmup'));
for(const [id,t] of [['journal-r1','km and m, kg and g, and L and mL'],['journal-think','each plank is 165 cm so I did 165 times 3 and got 495 cm'],['journal-think','I added 1 m 65 cm three times and got 4 m 95 cm']]){const n=await chipsFor(id,t);ok(n===3,id+' natural answer lights '+n+' of 3');}
for(const id of ['journal-r1','journal-think']){ok(await chipsFor(id,'idk')===0,id+': "idk" lights nothing');}
await p.evaluate(()=>switchTab('learn'));for(const t of ['6 kg is 6,000 g so it is 6,005 g not 65 g','no because 6 kg is 6000 grams and 5 more is 6005 so 65 is way too small']){const n=await chipsFor('journal-soc',t);ok(n===3,'journal-soc natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-soc','idk')===0,'journal-soc: "idk" lights nothing');
await chipsFor('journal-soc','6 kg is 6,000 g so it is 6,005 g not 65 g because the zeros matter');ok((await msg('#journal-soc + .pq-write .pq-count')).includes('✓'),'word counter');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(250);for(const t of ['you work on the meters and the centimeters and trade 100 cm for 1 m when there are too many','add each unit then regroup, like 1,000 g make 1 kg so 1 kg 900 g plus 200 g is 2 kg 100 g']){const n=await chipsFor('journal-big',t);ok(n===3,'journal-big natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-big','idk')===0,'journal-big: "idk" lights nothing');ok(await p.$('#mk-onepic .op-big'),'one picture: the big idea sentence');
await p.evaluate(()=>gatherAnswers());{const g=await p.$eval('#gatheredOutput',e=>e.value);ok(g.includes('Words I learned today')&&g.indexOf("Today's big idea")>0&&g.indexOf("Today's big idea")<200,'journal: big idea at the top, words at the end');}
const P=await p.evaluate(()=>JSON.parse(localStorage.getItem('oao.pq.progress')||'{}'));console.log('progress',JSON.stringify(P.lessons&&P.lessons['4.10.01']));
const f=await failed();console.log(JSON.stringify(await p.evaluate(()=>PQM.wallet().coins)),'coins');
console.log(!bad&&!errs.length&&!f.length?'PLAY PASSED':'PLAY FAILED '+bad+' '+errs.join('\n')+f.join('|'));await b.close();})();
