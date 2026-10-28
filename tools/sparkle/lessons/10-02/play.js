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
await mm(0,'1','13');ok((await msg(`${X} .mm-p[data-i="0"] .mm-fb`)).includes('Trade each 12'),'next foot: 1 ft 14 in gets the trade nudge');
for(const [i,a,c] of [[0,'2','1'],[1,'4','2'],[2,'3','4']])await mm(i,a,c);ok(await p.$$eval(`${X} .mm-p.ok`,x=>x.length)===3,'make the next foot: 3 right');
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
// job 4 yards
const Y='#mk-yards';await tapN(`${Y} .ok-src-piece[data-v="3"]`,10);ok((await msg(`${Y} .ok-msg`)).includes('past 29'),'yards: a 10th yard goes past 29 ft (hint)');
await drag(`${Y} .ok-src-piece[data-v="1"]`,`${Y} .ok-bar`);await tapN(`${Y} .ok-src-piece[data-v="1"]`,1);ok((await msg(`${Y} .ok-sym`)).includes('9 × 3 ft + 2 ft = 29 ft'),'yards: 9 × 3 ft + 2 ft = 29 ft');
ok((await two(Y,'2','9')).includes('swapped'),'yards: 2 yd 9 ft (swapped) gets the remainder hint');
await two(Y,'9','2');ok(await job('j4'),'job 4: 29 ft = 9 yd 2 ft');
// ── Show What You Know: prove it, chase, bonus
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(800);
const P='#mk-prove';await tapN(`${P} .ok-barrow[data-i="0"] .ok-src-piece[data-v="12"]`,3);await tapN(`${P} .ok-barrow[data-i="0"] .ok-src-piece[data-v="1"]`,3);
await tapN(`${P} .ok-barrow[data-i="1"] .ok-src-piece[data-v="12"]`,3);await tapN(`${P} .ok-barrow[data-i="1"] .ok-src-piece[data-v="1"]`,5);
ok((await msg(`${P} .ok-sym`)).includes('39 in is not 41 in')&&await job('j5'),'job 5: 2 ft 15 in (39 in) ≠ 3 ft 5 in (41 in)');
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('chase'));await p.waitForTimeout(800);await drain();
await talkTo(15,10,'right');await pad(2);await drain();ok((await lastLog('chase')).includes('swapped them'),'chase: 2 yd → Cora\'s swapped-remainder hint');
await pad(9);await drain();await pad(1);await drain();ok((await lastLog('chase')).includes('27 feet'),'chase: 9 yd 1 ft → Hazel hint');await pad(2);await drain();await p.waitForTimeout(900);
await talkTo(21,10,'right');await pad(8);await drain();ok((await lastLog('chase')).includes('96 inches'),'chase: 8 ft (80 in read as tens) → Cora\'s hint');await pad(6);await drain();await pad(8);await drain();await p.waitForTimeout(900);
await talkTo(25,10,'right');await pad(6);await drain();await pad(9);for(let i=0;i<8;i++){await adv();await p.waitForTimeout(200);}await p.evaluate(()=>PQ._tp(26,10,'right'));await p.waitForTimeout(500);await shot('chase','g-east.png');await drain();await p.waitForTimeout(3000);
ok(await p.evaluate(()=>!!PQ._state().world.east&&!!PQ._state().done.chase),'chase quest: 3 stops, Eastside open');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(400);const bd=await p.$('.mk-board');await bd.scrollIntoViewIfNeeded();await bd.screenshot({path:path.join(OUT,'g-board.png')});
await p.evaluate(()=>switchTab('assignment'));await p.click('.ch-card summary');await p.fill('.ch-form input','6');await p.click('.ch-form button[type=submit]');const hint=await p.$eval('.ch-hint',e=>!e.hidden);await p.fill('.ch-form input','9');await p.click('.ch-form button[type=submit]');
ok(hint&&await p.$eval('.ch-explain',e=>!e.hidden),'bonus: hint after a miss, 9 pieces solves it');
// ── helpers: defined words, hint ladders, writing chips + counter
const defs=await p.$$eval('.pq-def b',x=>x.map(e=>e.textContent));ok(defs.length===4,'defined words: '+defs.join(', '));
for(let i=0;i<3;i++)await p.click('.pq-hint[data-hint="1"] .pq-hint-btn');ok(await p.$$eval('.pq-hint[data-hint="1"] li',x=>x.length)===3,'hint ladder: 3 rungs');
ok(await p.$$eval('#tab-assignment .q-block .pq-hint',x=>x.length)===3,'every Show What You Know problem has a hint ladder');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(300);
for(const [sel,name] of [['#mk-rope','rope'],['#mk-splice','splice'],['#mk-yards','yards']]){const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$(`${sel} .mk-todo`),'Learn job '+name+': Your job + What to do + a hint ladder');}
for(const [tab,sel] of [['warmup','#mk-foot'],['assignment','#mk-prove']]){await p.evaluate(t=>switchTab(t),tab);await p.waitForTimeout(250);const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$(`${sel} .mk-todo`),'job '+sel+': Your job + What to do + a hint ladder');}
const chipsFor=async(id,txt)=>{await p.fill('#'+id,txt);await p.dispatchEvent('#'+id,'input');return p.$$eval('#'+id+' + .pq-write .pq-chip',x=>x.filter(e=>e.classList.contains('on')).length);};
await p.evaluate(()=>switchTab('warmup'));
for(const t of ['The south post is taller by 2 inches because 6 ft is 72 in and 5 more is 77','I built both bars and the south bar was longer by two inches']){const n=await chipsFor('journal-think',t);ok(n===3,'journal-think natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-think','idk')===0,'journal-think: "idk" lights nothing');
await p.evaluate(()=>switchTab('learn'));for(const t of ['yes she is right because 14 in is 1 ft 2 in so 3 ft 14 in is 4 ft 2 in','yes they are the same, trade 12 inches for a foot and you get 4 feet 2 inches']){const n=await chipsFor('journal-soc',t);ok(n===3,'journal-soc natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-soc','idk')===0,'journal-soc: "idk" lights nothing');
ok((await msg('#journal-soc + .pq-write .pq-count')).length>0,'word counter');
await p.evaluate(()=>gatherAnswers());ok((await p.$eval('#gatheredOutput',e=>e.value)).includes('Words I learned today'),'journal lists the words');
// ── board mode for the Learn video's live board
const p2=await p.context().newPage();await p2.goto('file://'+path.join(H.REPO,'math-lesson-4-10-02-customary-length.html')+'?board=rope');await p2.waitForTimeout(900);
await p2.click('#pq-boardhost .ok-src-piece[data-v="12"]');ok((await p2.$eval('#pq-boardhost .ok-sym',e=>e.textContent)).includes('1 × 12 in = 12 in'),'board mode ?board=rope: the Rope Ruler alone, taps work');await p2.screenshot({path:path.join(OUT,'board-rope.png')});await p2.close();
// ── clean mode: every job is on the page
ok(await p.evaluate(()=>['j1','j2','j3','j4','j5'].every(j=>PQM.jobDone(j))),'all five jobs done on the page (clean mode can finish without the game)');
const f=await failed();console.log(JSON.stringify(await p.evaluate(()=>PQM.wallet().coins)),'coins');
console.log(!bad&&!errs.length&&!f.length?'PLAY PASSED':'PLAY FAILED '+bad+' '+errs.join('\n')+f.join('|'));await b.close();})();
