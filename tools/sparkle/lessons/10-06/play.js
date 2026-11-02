// Full play-through of 4.10.06 (every quest, every job, tap and drag, a wrong answer per model, hints, writing, clean mode). node tools/sparkle/lessons/10-06/play.js
const H=require('../../test/harness.js');const path=require('path');const OUT=path.join(H.REPO,'tools/sparkle/out/10-06');require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errs,failed}=await H('math-lesson-4-10-06-fractions-and-measurement.html',1150,900);let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log((c?'ok   ':'FAIL ')+m);};
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
const crewSays=id=>p.evaluate(id=>{let said=null;PQ_DATA.talk(id,{S:PQ._state(),say:l=>{said=l[0].t;},save:()=>{},goal:()=>{}});return said;},id);
// ribbon cutter helpers
const cut=async(r,n)=>{await p.click(`${r} .ok-cut-btn[data-n="${n}"]`);await p.waitForTimeout(60);};
const take=async(r,ks)=>{for(const k of ks)await p.click(`${r} .ok-part[data-k="${k}"]`);await p.waitForTimeout(60);};
// drag across parts or marks from index a to index z (pointer painting)
const sweep=async(r,cls,a,z)=>{const A=await p.$(`${r} .${cls}[data-k="${a}"]`);await A.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await p.waitForTimeout(120);const ra=await A.boundingBox();const Z=await p.$(`${r} .${cls}[data-k="${z}"]`);const rz=await Z.boundingBox();
  await p.mouse.move(ra.x+4,ra.y+ra.height/2);await p.mouse.down();await p.mouse.move(rz.x+rz.width-4,rz.y+rz.height/2,{steps:Math.max(6,(z-a+1)*3)});await p.mouse.up();await p.waitForTimeout(80);};
const ask=async(r,vals)=>{const I=await p.$$(`${r} .ok-ribbon-ask input`);for(let k=0;k<vals.length;k++)await I[k].fill(vals[k]);await p.click(`${r} .ok-ribbon-ask button`);await p.waitForTimeout(80);return msg(`${r} .ok-ribbon-ask ~ .ok-msg`);};
const frac=async(r,n,d)=>ask(r,[n,d]);
const grp=async(r,g)=>{await p.click(`${r} .ok-grp-btn[data-n="${g}"]`);await p.waitForTimeout(60);};
const sym=r=>msg(`${r} .ok-sym`);
const bx=async(root,vals,idx)=>{const F=await p.$$(`${root} form.mk-two:not(.mk-chain)`).then(a=>Promise.all(a.map(async e=>[e,await e.evaluate(x=>!x.closest('.ok-ribbon-ask'))]))).then(a=>a.filter(x=>x[1]).map(x=>x[0]));const f=idx==null?F.pop():F[idx];const I=await f.$$('input');for(let k=0;k<vals.length;k++)await I[k].fill(vals[k]);await (await f.$('button')).click();await p.waitForTimeout(80);return f.evaluate(x=>x.nextElementSibling.textContent);};
{const t=await crewSays('felix');ok(/I'm Felix/.test(t)&&!/inch|twelfth|×|12/.test(t),'crew before Learn: Felix says hello about the night market (no math yet)');}
ok((await p.$eval('.pq-slot[data-quest="sort"]',e=>e.className)).includes('lock'),'sort quest locked before Cut the Foot');
// ── Warm-Up: job 1 cut the foot (wrong cut, tap, ask), mental math, Think
const C='#mk-cut';await cut(C,4);ok((await msg(`${C} .ok-msg`)).includes('3 equal parts'),'cut: cutting into 4 for thirds gets the hint');
await cut(C,3);ok((await sym(C)).includes('each part is 4 inches'),'cut round 1: 3 equal parts of 4 in');await take(C,[0]);
ok((await ask(C,['3'])).includes('how many parts'),'cut round 1: 3 (the number of parts) gets its hint');await ask(C,['4']);await p.click(`${C} .ok-next`);
await cut(C,2);await sweep(C,'ok-part',0,0);ok((await sym(C)).includes('1 of 2 parts'),'cut round 2: a drag takes 1 of 2 parts');await take(C,[1]);ok((await msg(`${C} .ok-msg`)).includes('already'),'cut round 2: a second part is refused');
await ask(C,['6']);ok(await job('j1'),'job 1: one third of a foot = 4 in, one half = 6 in');
await p.fill('#mm-g4-4-10-06-mm-0','6');await p.click('#mk-mental .mm-p[data-i="0"] button');ok((await msg('#mk-mental .mm-p[data-i="0"] .mm-fb')).includes('6 equal groups'),'mental math: a wrong answer gets the equal-groups hint');
for(const [i,a] of [[0,'2'],[1,'12'],[2,'2'],[3,'100']]){await p.fill(`#mm-g4-4-10-06-mm-${i}`,a);await p.click(`#mk-mental .mm-p[data-i="${i}"] button`);}
ok(await p.$$eval('#mk-mental .mm-p.ok',x=>x.length)===4,'mental math: one equal part, 4 right');
const T='#mk-think';ok((await sym(T)).includes('any way')&&!(await msg(`${T} .ok-do`)).includes('6 equal'),'think: the free strip names no method');
await cut(T,4);ok(!(await msg(`${T} .ok-msg`)).includes('bottom number'),'think: any cut is allowed (no wrong-cut hint)');await cut(T,6);await take(T,[0,1,2,3,4]);
ok((await sym(T)).includes('5 of 6 parts'),'think: 5 of 6 parts taken on the free strip');
ok((await bx(T,['60'])).includes('5 whole feet'),'think: 60 (5 × 12 without the cut) gets its hint');ok((await bx(T,['2'])).includes('one part'),'think: 2 (one sixth) gets its hint');
await bx(T,['10']);ok((await p.$eval(`${T} .mk-think-ans .ok-msg`,e=>e.className)).includes('good'),'think: 10 in accepted before Learn, any method');
// ── sort quest (opener: sort)
await p.waitForTimeout(1300);ok(!(await p.$eval('.pq-slot[data-quest="sort"]',e=>e.className)).includes('lock'),'sort quest unlocks after job 1');
await p.evaluate(()=>PQ._play('sort'));await p.waitForTimeout(600);await drain();
await talkTo(12,12,'up');ok(await p.evaluate(()=>!!PQ._state().q.sort.met),'sort: Ivy explains the fallen tags');
const grab=async(x,y)=>{await p.evaluate(([x,y])=>PQ._tp(x,y,'up'),[x,y+1]);await p.keyboard.down('ArrowUp');await p.waitForTimeout(140);await p.keyboard.up('ArrowUp');await p.waitForTimeout(400);await drain();};
await grab(4,10);ok(await p.evaluate(()=>PQ._state().q.sort.hold==='tA'),'sort: picked up the one-third tag');
await talkTo(10,13,'up');ok((await lastLog('sort')).includes('one part'),'sort: the wrong bin (6 IN) gets Felix\'s cut hint');
await talkTo(8,13,'up');ok(await p.evaluate(()=>!!PQ._state().q.sort.sorted.tA),'sort: one third of a foot → 4 IN');
await grab(17,15);await talkTo(10,13,'up');await grab(27,14);await talkTo(9,13,'up');await grab(10,19);await talkTo(8,13,'up');ok((await lastLog('sort')).includes('pound'),'sort: tea tag in an inch bin gets Cora\'s pound hint');await talkTo(11,13,'up');
ok(await p.evaluate(()=>Object.keys(PQ._state().q.sort.sorted).length===4),'sort: all four tags in their bins');
await talkTo(12,12,'up');await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.sort),'sort quest clear');
await p.evaluate(()=>PQ._play('sort'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(12,13,'up'));await p.waitForTimeout(400);await shot('sort','g-market.png');await p.evaluate(()=>PQ._stop());
// ── Learn: crew window, job 2 ribbons
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(400);
await p.evaluate(()=>PQ._play('crew'));await p.waitForTimeout(600);await drain();
await talkTo(3,16,'left');ok(!(await p.evaluate(()=>!!PQ._state().done.crew)),'crew: Opti waits until all four are heard');
for(const [x,y,d] of [[5,15,'up'],[5,15,'down'],[8,15,'up'],[8,15,'down']])await talkTo(x,y,d);
ok(await p.evaluate(()=>Object.keys(PQ._state().q.crew.heard||{}).length===4),'crew: heard all four ways');
ok(await p.evaluate(()=>{const L=(PQ._state().logs||{}).crew||[];return L.some(l=>/60 divided by 6/.test(l))&&L.some(l=>/2 inches each/.test(l));}),'crew: Atlas\'s and Felix\'s ways are in the quest log');
await talkTo(3,16,'left');await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.crew),'crew quest clear');
const RB='#mk-ribbons';await cut(RB,6);await sweep(RB,'ok-part',0,4);ok((await sym(RB)).includes('5 of 6 parts'),'ribbons: a drag takes 5 of 6 parts');
ok((await ask(RB,['60'])).includes('60 ÷ 6'),'ribbons: 60 gets the divide-by-the-bottom hint');ok((await ask(RB,['2'])).includes('5 × 2'),'ribbons: 2 (one part) gets its hint');await ask(RB,['10']);await p.click(`${RB} .ok-next`);
await cut(RB,12);await sweep(RB,'ok-part',0,6);ok((await ask(RB,['84'])).includes('whole feet'),'ribbons: 84 gets its hint');await ask(RB,['7']);ok(await job('j2'),'job 2: five sixths of a foot = 10 in, seven twelfths = 7 in');
{const t=await crewSays('felix');ok(/12 parts of 1 inch/.test(t),'crew after job 2: Felix shares his cut-first way');}
// build quest
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('build'));await p.waitForTimeout(600);await drain();
await talkTo(12,12,'up');ok(await p.evaluate(()=>!!PQ._state().q.build.met),'build: Ivy hands over the three ribbons');
await talkTo(15,8,'up');ok(await padOn(),'build: the string asks five twelfths of a foot');await pad(60);await drain();ok((await lastLog('build')).includes('1 inch'),'build: 60 → Cora\'s twelfths hint');await pad(5);await drain();
await talkTo(15,8,'up');await pad(2);await drain();await talkTo(15,8,'up');await pad(12);await drain();ok((await lastLog('build')).includes('ONE of those'),'build: 12 for one twelfth gets its hint');await pad(1);await drain();await p.waitForTimeout(2800);
ok(await p.evaluate(()=>!!PQ._state().world.lit&&!!PQ._state().done.build),'build quest clear: the lanterns are lit');
await p.evaluate(()=>PQ._play('build'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(15,9,'up'));await p.waitForTimeout(400);await shot('build','g-lanterns.png');await p.evaluate(()=>PQ._stop());
// job 3: the order list (lb, h, L, m)
const OD='#mk-orders';await cut(OD,8);await take(OD,[0,1,2]);ok((await ask(OD,['2'])).includes('Take 3'),'orders: 2 oz (one part) gets its hint');await ask(OD,['6']);await p.click(`${OD} .ok-next`);
await cut(OD,6);await sweep(OD,'ok-part',0,4);ok((await sym(OD)).includes('each part is 10 minutes'),'orders: 60 minutes in 6 parts of 10');ok((await ask(OD,['300'])).includes('300 ÷ 6'),'orders: 300 min gets its hint');await ask(OD,['50']);await p.click(`${OD} .ok-next`);
await cut(OD,10);await take(OD,[0,1,2]);ok((await ask(OD,['30'])).includes('1,000 milliliters'),'orders: 30 mL (liter as 100) gets its hint');await ask(OD,['300']);await p.click(`${OD} .ok-next`);
await cut(OD,5);await take(OD,[0,1]);await ask(OD,['40']);ok(await job('j3'),'job 3: 6 oz, 50 min, 300 mL, 40 cm');
// deliver quest
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('deliver'));await p.waitForTimeout(600);await drain();
await talkTo(22,16,'right');ok(await p.evaluate(()=>!!PQ._state().q.deliver.met),'deliver: the lamp seller explains the orders');
await talkTo(22,16,'right');ok(await padOn(),'deliver: order 1 asks seven tenths of a liter');await pad(7000);await drain();ok((await lastLog('deliver')).includes('100 milliliters'),'deliver: 7,000 → Cora\'s tenth hint');await pad(700);await drain();
await talkTo(22,16,'right');await pad(200);await drain();ok((await lastLog('deliver')).includes('less than 100'),'deliver: 200 cm → Hazel\'s half hint');await pad(50);await drain();
await talkTo(22,16,'right');await pad(25);await drain();ok((await lastLog('deliver')).includes('not 100'),'deliver: 25 mL → Felix\'s liter hint');await pad(250);await drain();await p.waitForTimeout(2800);
ok(await p.evaluate(()=>!!PQ._state().done.deliver),'deliver quest clear: 700 mL, 50 cm, 250 mL');
await p.evaluate(()=>PQ._play('deliver'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(26,19,'right'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(1500);await adv();await p.waitForTimeout(300);
if(await p.$('.pq-choices.on')){await p.evaluate(()=>document.querySelector('.pq-choices.on button').click());await p.waitForTimeout(1200);await drain();}ok(await p.evaluate(()=>!!PQM.wallet().gear.cap),'shop: bought the explorer cap at Penny\'s cart');await p.evaluate(()=>PQ._stop());
// job 4: label the scraps (name mode: shade, raw fraction, group, simplest)
const SC='#mk-scraps';await sweep(SC,'ok-mark',0,3);ok((await sym(SC)).includes('4 of 12 inches'),'scraps: a drag shades 4 of 12 inches');await p.click(`${SC} .ok-mark[data-k="7"]`);ok((await msg(`${SC} .ok-msg`)).includes('all 4'),'scraps: a 5th inch is refused');
ok((await frac(SC,'4','1')).includes('Smudge'),'scraps: 4 over 1 gets the same-unit hint');ok((await frac(SC,'1','3')).includes('simplest form'),'scraps: 1 over 3 first is sent back to part over whole');
await frac(SC,'4','12');ok(!!(await p.$(`${SC} .ok-grp-btn`)),'scraps: 4 over 12 accepted, Parts buttons appear');
await grp(SC,6);ok((await msg(`${SC} .ok-msg`)).includes('middle of a part'),'scraps: parts of 6 refused for 4 inches');await grp(SC,2);ok((await frac(SC,'2','6')).includes('not the simplest'),'scraps: 2 over 6 is equal but not simplest');
await grp(SC,4);await frac(SC,'1','3');await p.click(`${SC} .ok-next`);
await sweep(SC,'ok-mark',0,5);await frac(SC,'6','16');await grp(SC,2);await frac(SC,'3','8');await p.click(`${SC} .ok-next`);
await sweep(SC,'ok-mark',0,9);ok((await frac(SC,'10','100')).includes('60 minutes'),'scraps: 10 over 100 gets the 60-minute hint');await frac(SC,'10','60');await grp(SC,10);await frac(SC,'1','6');
ok(await job('j4'),'job 4: 4 in = one third ft, 6 oz = three eighths lb, 10 min = one sixth h');
// job 5: halve the ribbon
const HV='#mk-halve';const fb=async(idx,n,d)=>{const F=await p.$$(`${HV} form.ok-fracform`);const I=await F[idx].$$('input');await I[0].fill(n);await I[1].fill(d);await (await F[idx].$('button')).click();await p.waitForTimeout(80);return F[idx].evaluate(x=>x.nextElementSibling.textContent);};
ok((await fb(0,'10','12')).includes('not in simplest form'),'halve: 10 over 12 gets the simplify hint');ok((await fb(0,'10','1')).includes('mixes two units'),'halve: 10 over 1 gets the same-unit hint');await fb(0,'5','6');
await p.click(`${HV} .bm-fact[data-i="1"]`);await p.click(`${HV} .bm-seg[data-seg="p1"]`);ok((await msg(`${HV} .bm-ask + .ok-msg`)).length>0,'halve bar: a fact on the wrong part gets a hint');
await p.click(`${HV} .bm-fact[data-i="1"]`);await p.click(`${HV} .bm-seg[data-seg="whole"]`);await drag(`${HV} .bm-fact[data-i="3"]`,`${HV} .bm-seg[data-seg="p1"]`);
const sb=async v=>{await p.fill(`${HV} .bm-ask input`,v);await p.click(`${HV} .bm-ask button`);await p.waitForTimeout(60);return msg(`${HV} .bm-ask + .ok-msg`);};
ok((await sb('10')).includes('whole ribbon'),'halve bar: 10 gets the whole-ribbon hint');await sb('5');
ok((await fb(1,'5','3')).includes('bigger, not smaller'),'halve: 5 over 3 (halving the bottom) gets its hint');ok((await fb(1,'5','6')).includes('whole 10-inch'),'halve: 5 over 6 gets the whole-ribbon hint');await fb(1,'5','12');
ok(await job('j5'),'job 5: 10 in = five sixths ft, half = 5 in = five twelfths ft');
// ── Show What You Know: prove it, the factory quest, bonus
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(800);
const P='#mk-prove';ok(!(await p.$(`${P} .ok-ribbon-ask form`)),'prove: no answer box before the 5 inches are shaded');
await sweep(P,'ok-mark',0,4);ok((await sym(P)).includes('5 of 12 inches'),'prove: 5 of 12 inches shaded');
ok((await frac(P,'5','1')).includes('Smudge wrote'),'prove: 5 over 1 (the Smudge\'s tag) gets the hint');ok((await frac(P,'12','5')).includes('part goes on top'),'prove: 12 over 5 gets the part-on-top hint');
await frac(P,'5','12');ok((await msg(`${P} .ok-msg`)).includes('already in simplest form')&&await job('j6'),'job 6: the tag should say five twelfths ft, already simplest');
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('factory'));await p.waitForTimeout(800);await drain();
await talkTo(12,12,'up');await talkTo(26,5,'up');ok(await padOn(),'factory: the gate asks one third of an hour');
await pad(3);await drain();ok((await lastLog('factory')).includes('Smudge wrote'),'factory: 3 → Cora\'s hint');await pad(180);await drain();ok((await lastLog('factory')).includes('less than 60'),'factory: 180 → Felix\'s hint');
await pad(20);for(let i=0;i<4;i++){await adv();await p.waitForTimeout(200);}await shot('factory','g-factory.png');await drain();await p.waitForTimeout(3000);
ok(await p.evaluate(()=>!!PQ._state().world.factoryOpen&&!!PQ._state().done.factory),'factory quest: the brick factory is found (GOLEM PART 2)');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(400);const bd=await p.$('.mk-board');await bd.scrollIntoViewIfNeeded();await bd.screenshot({path:path.join(OUT,'g-board.png')});
await p.evaluate(()=>switchTab('assignment'));await p.click('.ch-card summary');await p.fill('.ch-form input','6');await p.click('.ch-form button[type=submit]');const hint=await p.$eval('.ch-hint',e=>!e.hidden);await p.fill('.ch-form input','2');await p.click('.ch-form button[type=submit]');
ok(hint&&await p.$eval('.ch-explain',e=>!e.hidden),'bonus: hint after a miss, 2 inches solves it');
// ── helpers: defined words, hint ladders, writing chips + counter
const defs=await p.$$eval('.pq-def b',x=>x.map(e=>e.textContent));ok(defs.length===4,'defined words: '+defs.join(', '));
ok(!(await p.$$eval('.activity-sub .pq-def, .activity-title .pq-def, .task-label .pq-def',x=>x.length)),'no defined word sits in a heading');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(250);{const d=await p.$('.pq-def');await d.scrollIntoViewIfNeeded();ok(!(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on'))),'word meaning hidden in the sentence');
await d.hover();await p.waitForTimeout(100);ok(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on')),'hover shows the meaning as a tooltip');{const r=await p.evaluate(()=>{const t=document.querySelector('.pq-def-m.pq-tip-on').getBoundingClientRect();return [t.left,t.right,document.documentElement.clientWidth];});ok(r[0]>=0&&r[1]<=r[2],'tooltip stays inside the window');}
await (await p.$('#mk-cut .ok-cutbtns')).hover();await d.focus();ok(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on')),'keyboard focus shows the tooltip');await d.screenshot({path:path.join(OUT,'def-tip.png')});}
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(250);
for(let i=0;i<3;i++)await p.click('.pq-hint[data-hint="1"] .pq-hint-btn');ok(await p.$$eval('.pq-hint[data-hint="1"] li',x=>x.length)===3,'hint ladder: 3 rungs');
ok(await p.$$eval('#tab-assignment .q-block .pq-hint',x=>x.length)===3,'every Show What You Know problem has a hint ladder');
{const fr=await p.$$eval('#tab-assignment .q-block .ok-frac-in',x=>x.map(e=>e.querySelectorAll('input.ans-box').length));ok(fr.length===5&&fr.every(n=>n===2),'Show What You Know: five stacked fraction answers, two boxes each ('+fr.join(',')+')');}
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(300);
for(const sel of ['#mk-ribbons','#mk-orders','#mk-scraps','#mk-halve']){const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$$eval(`${sel} .mk-todo`,x=>x.length)===1,'Learn job '+sel+': Your job + one What to do + a hint ladder');}
for(const [tab,sel] of [['warmup','#mk-cut'],['assignment','#mk-prove']]){await p.evaluate(t=>switchTab(t),tab);await p.waitForTimeout(250);const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$(`${sel} .mk-todo`),'job '+sel+': Your job + What to do + a hint ladder');}
const chipsFor=async(id,txt)=>{await p.fill('#'+id,txt);await p.dispatchEvent('#'+id,'input');return p.$$eval('#'+id+' + .pq-write .pq-chip',x=>x.filter(e=>e.classList.contains('on')).length);};
await p.evaluate(()=>switchTab('warmup'));
for(const t of ['It is 10 inches because I cut the foot into 6 equal parts of 2 inches and took 5','10 in. I did 5 times 12 is 60 and divided by 6']){const n=await chipsFor('journal-think',t);ok(n===2,'journal-think natural answer lights '+n+' of 2');}
ok(await chipsFor('journal-think','idk')===0,'journal-think: "idk" lights nothing');
for(const t of ['I notice the tag is a fraction of a foot and sixths means 6 parts. I wonder how many inches that is','i see it is less than a foot, i wonder if it is 5 inches']){const n=await chipsFor('journal-notice',t);ok(n===2,'journal-notice natural answer lights '+n+' of 2');}
ok(await chipsFor('journal-notice','idk')===0,'journal-notice: "idk" lights nothing');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(250);
for(const t of ['My way was like Felix because I cut the foot into parts. For a pound I would cut 16 ounces into 6 parts because that makes sense','I did it like Atlas and multiplied. For five sixths of a pound I would do 5 times 16 and divide by 6 since it is faster']){const n=await chipsFor('journal-compare',t);ok(n===3,'journal-compare natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-compare','idk')===0,'journal-compare: "idk" lights nothing');
for(const t of ['Cut the unit into equal parts and take some, or multiply the fraction. Like one fourth of a pound is 4 oz. Going backward you write part over whole in the same unit','you can cut into parts or multiply by the small units, for example one half of an hour is 30 min, and to go back you put the part out of the whole and simplify']){const n=await chipsFor('journal-big',t);ok(n===3,'journal-big natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-big','idk')===0,'journal-big: "idk" lights nothing');
ok((await msg('#journal-big + .pq-write .pq-count')).length>0,'word counter');
await p.evaluate(()=>gatherAnswers());{const g=await p.$eval('#gatheredOutput',e=>e.value);ok(g.includes('Words I learned today')&&g.indexOf('Today\'s big idea')>0&&g.indexOf('Today\'s big idea')<200,'journal: big idea at the top, words at the end');}
// ── board mode for the Learn video's live board
const p2=await p.context().newPage();await p2.goto('file://'+path.join(H.REPO,'math-lesson-4-10-06-fractions-and-measurement.html')+'?board=ribbons');await p2.waitForTimeout(900);
await p2.click('#pq-boardhost .ok-cut-btn[data-n="6"]');ok((await p2.$eval('#pq-boardhost .ok-sym',e=>e.textContent)).includes('each part is 2 inches'),'board mode ?board=ribbons: the Ribbon Cutter alone, taps work');await p2.screenshot({path:path.join(OUT,'board-ribbons.png')});await p2.close();
// ── clean mode: every job is on the page
ok(await p.evaluate(()=>['j1','j2','j3','j4','j5','j6'].every(j=>PQM.jobDone(j))),'all six jobs done on the page (clean mode can finish without the game)');
const f=await failed();console.log(JSON.stringify(await p.evaluate(()=>PQM.wallet().coins)),'coins');
console.log(!bad&&!errs.length&&!f.length?'PLAY PASSED':'PLAY FAILED '+bad+' '+errs.join('\n')+f.join('|'));await b.close();})();
