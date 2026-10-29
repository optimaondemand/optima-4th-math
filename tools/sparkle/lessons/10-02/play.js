// Full play-through of 4.10.02 (every quest, every job, tap and drag, a wrong answer per model, hints, writing, clean mode). node tools/sparkle/lessons/10-02/play.js
const H=require('../../test/harness.js');const path=require('path');const OUT=path.join(H.REPO,'tools/sparkle/out/10-02');require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errs,failed}=await H('math-lesson-4-10-02-customary-length.html',1150,900);let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log((c?'ok   ':'FAIL ')+m);};
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
{const t=await crewSays('felix');ok(/I'm Felix/.test(t)&&!/inch|12/.test(t),'crew before Learn: Felix says hello about the bridge (no math yet)');}
ok((await p.$eval('.pq-slot[data-quest="sort"]',e=>e.className)).includes('lock'),'sort quest locked before Build a Foot');
// ── Warm-Up: job 1 build a foot (tap + drag), mental math, Think
const F='#mk-foot';await tapN(`${F} .ok-src-piece[data-v="1"]`,11);await drag(`${F} .ok-src-piece[data-v="1"]`,`${F} .ok-bar`);
ok((await msg(`${F} .ok-sym`)).includes('12 × 1 in = 12 in'),'foot round 1: twelve 1-inch pieces (11 taps + 1 drag) = 12 in');
await p.click(`${F} .ok-next`);await tapN(`${F} .ok-src-piece[data-v="12"]`,3);ok((await msg(`${F} .ok-msg`)).includes('full'),'foot round 2: a 3rd foot after 2 says the bar is full');
ok((await msg(`${F} .ok-sym`)).includes('2 × 1 ft = 24 in')&&await job('j1'),'job 1: 2 ft = 24 in');
await p.fill('#mm-g4-4-10-02-mm-0','4');await p.click('#mk-mental .mm-p[data-i="0"] button');ok((await msg('#mk-mental .mm-p[data-i="0"] .mm-fb')).includes('Count up'),'mental math: a wrong answer gets the count-up hint');
for(const [i,a] of [[0,'5'],[1,'9'],[2,'1'],[3,'7']]){await p.fill(`#mm-g4-4-10-02-mm-${i}`,a);await p.click(`#mk-mental .mm-p[data-i="${i}"] button`);}
ok(await p.$$eval('#mk-mental .mm-p.ok',x=>x.length)===4,'mental math: make a foot, 4 right');
const T='#mk-think';ok(!(await msg(`${T} .ok-barlab`)).includes('77'),'think: the bar label hides the target (no 77 in shown)');
await tapN(`${T} .ok-barrow[data-i="0"] .ok-src-piece[data-v="12"]`,6);await tapN(`${T} .ok-barrow[data-i="0"] .ok-src-piece[data-v="1"]`,5);
ok((await msg(`${T} .ok-sym`)).includes('6 × 12 in + 5 in = 77 in'),'think: north post built as 6 × 12 in + 5 in = 77 in');
await p.fill('#thinkWho','south');await p.fill('#thinkBy','14');await p.click(`${T} .mk-two button`);ok((await msg(`${T} .mk-think-ans .ok-msg`)).includes('65 in'),'think: "by 14" (6 ft 5 in read as 65 in) gets the 12-not-10 hint');
await p.fill('#thinkBy','2');await p.click(`${T} .mk-two button`);ok((await p.$eval(`${T} .mk-think-ans .ok-msg`,e=>e.className)).includes('good'),'think: south post by 2 in accepted before Learn, any method');
// ── sort quest (opener: sort)
await p.waitForTimeout(1300);ok(!(await p.$eval('.pq-slot[data-quest="sort"]',e=>e.className)).includes('lock'),'sort quest unlocks after job 1');
await p.evaluate(()=>PQ._play('sort'));await p.waitForTimeout(600);await drain();
await talkTo(5,8,'right');ok(await p.evaluate(()=>!!PQ._state().q.sort.met),'sort: Rosa explains the bins');
const grab=async(x,y,k)=>{const d={ArrowUp:[0,1],ArrowDown:[0,-1],ArrowLeft:[1,0],ArrowRight:[-1,0]}[k];await p.evaluate(([x,y])=>PQ._tp(x,y,'up'),[x+d[0],y+d[1]]);await p.keyboard.down(k);await p.waitForTimeout(140);await p.keyboard.up(k);await p.waitForTimeout(400);await drain();};
await grab(3,13,'ArrowLeft');ok(await p.evaluate(()=>PQ._state().q.sort.hold==='scrapA'),'sort: picked up the 10 in scrap');
await talkTo(10,6,'up');ok((await lastLog('sort')).includes('A foot is not 10 inches'),'sort: 10 in in the 1 FOOT bin → Cora\'s 12-not-10 hint');
await talkTo(8,6,'up');
for(const [x,y,bx,k] of [[7,3,10,'ArrowUp'],[12,17,12,'ArrowUp'],[5,19,10,'ArrowDown']]){await grab(x,y,k);await talkTo(bx,6,'up');}
ok(await p.evaluate(()=>Object.keys(PQ._state().q.sort.sorted||{}).length===4),'sort: all 4 scraps in the right bins');
await talkTo(6,9,'up');await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.sort),'sort quest clear');
// ── Learn: job 2 rope ruler + bond + boxes
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(400);
const R='#mk-rope';await tapN(`${R} .ok-src-piece[data-v="12"]`,4);ok((await msg(`${R} .ok-msg`)).includes('past 46'),'rope: a 4th foot goes past 46 in (hint)');
await drag(`${R} .ok-src-piece[data-v="1"]`,`${R} .ok-bar`);await tapN(`${R} .ok-src-piece[data-v="1"]`,9);
ok((await msg(`${R} .ok-sym`)).includes('3 × 12 in + 10 in = 46 in'),'rope: 3 × 12 in + 10 in = 46 in (tap + drag)');
await p.fill(`${R} .nb-c input`,'8');await p.click(`${R} .nb-check`);ok((await msg(`${R} .nb-wrap + .ok-msg`)).length>0,'rope bond: a wrong part gets a hint');
await p.fill(`${R} .nb-c input`,'10');await p.click(`${R} .nb-check`);
ok((await two(R,'4','6')).includes('12 inches'),'rope: 4 ft 6 in (trading 10) gets the 12-inch hint');
ok((await two(R,'2','22')).includes('right amount'),'rope: 2 ft 22 in gets the regroup nudge');
await two(R,'3','10');ok(await job('j2'),'job 2: 46 in = 3 ft 10 in');
{const t=await crewSays('felix');ok(/24 inches/.test(t),'crew after job 2: Felix shares his all-inches way');}
// job 3: make the next foot + splice bar model
const X='#mk-splice';const mm=async(i,a,c)=>{const I=await p.$$(`${X} .mm-p[data-i="${i}"] input`);await I[0].fill(a);await I[1].fill(c);await p.click(`${X} .mm-p[data-i="${i}"] button`);};
await mm(0,'3','14');ok((await msg(`${X} .mm-p[data-i="0"] .mm-fb`)).includes('Trade each 12'),'next foot: 3 ft 14 in gets the trade nudge');
await mm(0,'4','2');ok(await p.$$eval(`${X} .mm-p.ok`,x=>x.length)===1,'make the next foot: 3 ft 8 in + 6 in = 4 ft 2 in');
await p.click(`${X} .bm-fact[data-i="1"]`);await p.click(`${X} .bm-seg[data-seg="p0"]`);await drag(`${X} .bm-fact[data-i="3"]`,`${X} .bm-seg[data-seg="p1"]`);
const sb=async(a,c)=>{const I=await p.$$(`${X} .bm-form input`);await I[0].fill(a);await I[1].fill(c);await p.click(`${X} .bm-form button`);await p.waitForTimeout(60);return msg(`${X} .bm-ask + .ok-msg`);};
ok((await sb('4','5')).includes('tens and ones'),'splice: 4 ft 5 in (trade-10) gets the hint');
ok((await sb('3','15')).includes('right amount'),'splice: 3 ft 15 in gets the regroup nudge');
await sb('4','3');ok(await job('j3'),'job 3: 2 ft 8 in + 1 ft 7 in = 4 ft 3 in');
// build quest: Gus, the Smudge's tag (5 → Felix), tie the rail
await p.waitForTimeout(1300);ok(!(await p.$eval('.pq-slot[data-quest="build"]',e=>e.className)).includes('lock'),'build quest unlocks after job 3');
await p.evaluate(()=>PQ._play('build'));await p.waitForTimeout(600);await drain();
await p.evaluate(()=>PQ._tp(5,15,'left'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(1500);await adv();await p.waitForTimeout(300);await shot('build','g-shop.png');
await p.click('.pq-choices button:nth-child(1)');await p.waitForTimeout(1200);await drain();ok(await p.evaluate(()=>!!PQM.wallet().gear.cap),'shop: bought the explorer cap at Penny\'s cart');
await talkTo(12,10,'up');await talkTo(13,10,'up');ok(await padOn(),'build: the tag asks 3 ft 15 in = 4 ft ? in');
await pad(5);await drain();ok((await lastLog('build')).includes('tens and ones'),'build: 5 → Felix\'s trade-10 hint');await pad(3);await drain();
await talkTo(13,10,'down');await p.waitForTimeout(2900);ok(await p.evaluate(()=>!!PQ._state().world.rail&&!!PQ._state().done.build),'build quest: tag fixed, rail tied');
await p.evaluate(()=>PQ._play('build'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(13,10,'right'));await p.waitForTimeout(300);await shot('build','g-rail.png');await p.evaluate(()=>PQ._stop());
// job 4: Cut the Rope on the Trade Mat (build, take away feet, break a foot, take away inches), two boxes, the quick ones in inches
const C='#mk-cut';await tapN(`${C} .ok-tray .ok-disc[data-k="big"]`,4);await drag(`${C} .ok-tray .ok-disc[data-k="big"]`,`${C} .ok-col[data-k="big"]`);await tapN(`${C} .ok-tray .ok-disc[data-k="small"]`,1);
ok((await msg(`${C} .ok-sym`)).includes('5 ft 1 in')&&(await msg(`${C} .ok-do`)).includes('Step 2'),'cut: built 5 ft 1 in (tap + drag), step 2 asks for the feet');
await p.click(`${C} .ok-col[data-k="big"] .ok-colbtns .ok-btn:last-child`);await drag(`${C} .ok-col[data-k="big"] .ok-well .ok-disc`,`${C} .ok-zone`);
ok((await msg(`${C} .ok-ztot`)).includes('2 ft 0 in')&&(await msg(`${C} .ok-do`)).includes('Step 3'),'cut: 2 feet in the take-away box (button + drag)');
await p.click(`${C} .ok-col[data-k="big"] .ok-colbtns .ok-btn:last-child`);ok((await msg(`${C} .ok-ztot`)).includes('2 ft 0 in')&&(await msg(`${C} .ok-msg`)).includes('exactly'),'cut: a 3rd foot into the box is refused (exactly 2 ft 6 in)');
await p.click(`${C} .ok-col[data-k="small"] .ok-colbtns .ok-btn:last-child`);ok(await p.$eval(`${C} .ok-col[data-k="small"] .ok-count`,e=>e.textContent==='0'),'cut: the 1 inch is taken, none left');
await p.click(`${C} .ok-col[data-k="big"] .ok-colbtns .ok-btn:first-child`);ok(await p.$eval(`${C} .ok-col[data-k="small"] .ok-count`,e=>e.textContent==='12'),'cut: break 1 ft → 12 in');
for(let i=0;i<5;i++)await p.click(`${C} .ok-col[data-k="small"] .ok-colbtns .ok-btn:last-child`);
ok((await msg(`${C} .ok-do`)).includes('Done')&&(await msg(`${C} .ok-sym`)).includes('2 ft 7 in is left'),'cut: 5 ft 1 in − 2 ft 6 in leaves 2 ft 7 in on the mat');
ok((await two(C,'2','5')).includes('tens and ones'),'cut boxes: 2 ft 5 in (tens-and-ones) gets the hint');ok((await two(C,'3','7')).includes('used up 1 foot'),'cut boxes: 3 ft 7 in gets the forgot-the-trade hint');
await two(C,'2','7');ok(await job('j4'),'job 4: 5 ft 1 in − 2 ft 6 in = 2 ft 7 in');
const qk=async(k,v)=>{const f=(await p.$$(`${C} .mk-quick form`))[k];await (await f.$('input')).fill(v);await (await f.$('button')).click();await p.waitForTimeout(60);return f.$eval('.ok-msg',e=>e.textContent);};
ok((await qk(0,'5')).includes('12'),'quick: 1 ft − 5 in = 5 gets the 12-inch hint');ok((await qk(0,'7'))==='✓','quick: 1 ft − 5 in = 7 in');
ok((await qk(1,'29')).includes('not 20'),'quick: 2 ft + 9 in = 29 gets the 24-not-20 hint');ok((await qk(1,'33'))==='✓','quick: 2 ft + 9 in = 33 in');
// job 5 yards
const Y='#mk-order';await tapN(`${Y} .ok-src-piece[data-v="36"]`,3);ok((await msg(`${Y} .ok-msg`)).includes('past the order'),'order: a 3rd yard goes past the order (hint)');
await tapN(`${Y} .ok-src-piece[data-v="12"]`,2);await drag(`${Y} .ok-src-piece[data-v="1"]`,`${Y} .ok-bar`);await tapN(`${Y} .ok-src-piece[data-v="1"]`,6);ok((await msg(`${Y} .ok-sym`)).includes('2 yd 2 ft 7 in'),'order: built 2 yd 2 ft 7 in (tap + drag)');
const ch=async v=>{const I=await p.$$(`${Y} .mk-chain input`);for(let k=0;k<4;k++)await I[k].fill(v[k]);await p.click(`${Y} .mk-chain button`);await p.waitForTimeout(80);return msg(`${Y} .mk-chain + .ok-msg`);};ok((await ch(['24','8','96','103'])).includes('2 × 12'),'order: 2 yd = 24 ft gets the ×3 hint');ok((await ch(['6','8','80','103'])).includes('tens'),'order: 8 ft = 80 in gets the 12-not-10 hint');
await ch(['6','8','96','103']);ok(await job('j5'),'job 5: 2 yd 2 ft 7 in = 103 in');
// ── Show What You Know: prove it, chase, bonus
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(800);
const P='#mk-prove';await tapN(`${P} .ok-barrow[data-i="0"] .ok-src-piece[data-v="12"]`,3);await tapN(`${P} .ok-barrow[data-i="0"] .ok-src-piece[data-v="1"]`,3);
await tapN(`${P} .ok-barrow[data-i="1"] .ok-src-piece[data-v="12"]`,3);await tapN(`${P} .ok-barrow[data-i="1"] .ok-src-piece[data-v="1"]`,5);
ok(!(await msg(`${P} .ok-barlab`)).includes('of 39')&&(await msg(`${P} .ok-sym`)).includes('39 in is not 41 in')&&await job('j6'),'job 6: targets hidden; 2 ft 15 in (39 in) ≠ 3 ft 5 in (41 in)');
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('chase'));await p.waitForTimeout(800);await drain();
await talkTo(15,10,'right');await pad(12);await drain();ok((await lastLog('chase')).includes('inches in a foot'),'chase: 9 yd = 12 ft → Cora\'s 3-not-12 hint');
await pad(27);await drain();await p.waitForTimeout(900);
await talkTo(21,10,'right');await pad(8);await drain();ok((await lastLog('chase')).includes('96 inches'),'chase: 8 ft (80 in read as tens) → Cora\'s hint');await pad(6);await drain();await pad(8);await drain();await p.waitForTimeout(900);
await talkTo(25,10,'right');await pad(26);await drain();ok((await lastLog('chase')).includes('not 20'),'chase: 26 in → Hazel\'s 12-not-10 hint');await pad(30);for(let i=0;i<8;i++){await adv();await p.waitForTimeout(200);}await p.evaluate(()=>PQ._tp(26,10,'right'));await p.waitForTimeout(500);await shot('chase','g-east.png');await drain();await p.waitForTimeout(3000);
ok(await p.evaluate(()=>!!PQ._state().world.east&&!!PQ._state().done.chase),'chase quest: 3 stops, Eastside open');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(400);const bd=await p.$('.mk-board');await bd.scrollIntoViewIfNeeded();await bd.screenshot({path:path.join(OUT,'g-board.png')});
await p.evaluate(()=>switchTab('assignment'));await p.click('.ch-card summary');await p.fill('.ch-form input','8');await p.click('.ch-form button[type=submit]');const hint=await p.$eval('.ch-hint',e=>!e.hidden);await p.fill('.ch-form input','12');await p.click('.ch-form button[type=submit]');
ok(hint&&await p.$eval('.ch-explain',e=>!e.hidden),'bonus: hint after a miss, 12 pieces solves it');
// ── helpers: defined words, hint ladders, writing chips + counter
const defs=await p.$$eval('.pq-def b',x=>x.map(e=>e.textContent));ok(defs.length===4,'defined words: '+defs.join(', '));
for(let i=0;i<3;i++)await p.click('.pq-hint[data-hint="1"] .pq-hint-btn');ok(await p.$$eval('.pq-hint[data-hint="1"] li',x=>x.length)===3,'hint ladder: 3 rungs');
ok(!(await msg('#mk-foot .ok-barlab')).includes('of 12'),'build a foot: round 1 hides the 12 in target');
ok(await p.$$eval('#tab-assignment .q-block .pq-hint',x=>x.length)===3,'every Show What You Know problem has a hint ladder');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(300);
for(const [sel,name] of [['#mk-rope','rope'],['#mk-splice','splice'],['#mk-cut','cut'],['#mk-order','order']]){const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$(`${sel} .mk-todo`),'Learn job '+name+': Your job + What to do + a hint ladder');}
for(const [tab,sel] of [['warmup','#mk-foot'],['assignment','#mk-prove']]){await p.evaluate(t=>switchTab(t),tab);await p.waitForTimeout(250);const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$(`${sel} .mk-todo`),'job '+sel+': Your job + What to do + a hint ladder');}
const chipsFor=async(id,txt)=>{await p.fill('#'+id,txt);await p.dispatchEvent('#'+id,'input');return p.$$eval('#'+id+' + .pq-write .pq-chip',x=>x.filter(e=>e.classList.contains('on')).length);};
await p.evaluate(()=>switchTab('warmup'));
for(const t of ['The south post is taller by 2 inches because 6 ft is 72 in and 5 more is 77','I built both bars and the south bar was longer by two inches']){const n=await chipsFor('journal-think',t);ok(n===3,'journal-think natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-think','idk')===0,'journal-think: "idk" lights nothing');
for(const t of ['I notice one post is in feet and inches and the other is only inches. I wonder which is taller','i see that 79 has no feet in it, i wonder how to compare them']){const n=await chipsFor('journal-notice',t);ok(n===2,'journal-notice natural answer lights '+n+' of 2');}
ok(await chipsFor('journal-notice','idk')===0,'journal-notice: "idk" lights nothing');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(250);
for(const t of ['My way was like Felix because I changed it all to inches. For 150 in I would use a number bond like Atlas because it is faster','I did it like Atlas with a number bond. For 150 inches I would count by 12s because that makes sense to me']){const n=await chipsFor('journal-compare',t);ok(n===3,'journal-compare natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-compare','idk')===0,'journal-compare: "idk" lights nothing');
ok(await p.$$eval('#mk-splice .mk-todo',x=>x.length)===1,'join the ropes: one What to do list, not two');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(250);for(const t of ['You can trade 12 inches for a foot or change it all to inches, both ways work. Like 2 ft 8 in + 7 in is 3 ft 3 in','either turn everything into inches, times 12 for feet, or stay in feet and inches and trade. For example 1 yd 2 ft = 60 in. Pick any way']){const n=await chipsFor('journal-big',t);ok(n===3,'journal-big natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-big','idk')===0,'journal-big: "idk" lights nothing');
ok((await msg('#journal-big + .pq-write .pq-count')).length>0,'word counter');
await p.evaluate(()=>gatherAnswers());{const g=await p.$eval('#gatheredOutput',e=>e.value);ok(g.includes('Words I learned today')&&g.indexOf('Today\'s big idea')>0&&g.indexOf('Today\'s big idea')<200,'journal: big idea at the top, words at the end');}
// ── board mode for the Learn video's live board
const p2=await p.context().newPage();await p2.goto('file://'+path.join(H.REPO,'math-lesson-4-10-02-customary-length.html')+'?board=rope');await p2.waitForTimeout(900);
await p2.click('#pq-boardhost .ok-src-piece[data-v="12"]');ok((await p2.$eval('#pq-boardhost .ok-sym',e=>e.textContent)).includes('1 × 12 in = 12 in'),'board mode ?board=rope: the Rope Ruler alone, taps work');await p2.screenshot({path:path.join(OUT,'board-rope.png')});await p2.close();
// ── clean mode: every job is on the page
ok(await p.evaluate(()=>['j1','j2','j3','j4','j5','j6'].every(j=>PQM.jobDone(j))),'all six jobs done on the page (clean mode can finish without the game)');
const f=await failed();console.log(JSON.stringify(await p.evaluate(()=>PQM.wallet().coins)),'coins');
console.log(!bad&&!errs.length&&!f.length?'PLAY PASSED':'PLAY FAILED '+bad+' '+errs.join('\n')+f.join('|'));await b.close();})();
