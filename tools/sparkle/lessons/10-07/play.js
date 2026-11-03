// Full play-through of 4.10.07 (every quest incl. the Brick Golem boss, every job, tap and drag, a wrong answer per model, hints, writing, clean mode). node tools/sparkle/lessons/10-07/play.js
const H=require('../../test/harness.js');const path=require('path');const OUT=path.join(H.REPO,'tools/sparkle/out/10-07');require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errs,failed}=await H('math-lesson-4-10-07-fractions-and-measurement-pt-2.html',1150,900);let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log((c?'ok   ':'FAIL ')+m);};
await p.evaluate(()=>{localStorage.setItem('oao.pq.avatar',JSON.stringify({name:'Maya',skin:2,hair:3,style:1,shirt:4}));localStorage.setItem('oao.pq.wallet',JSON.stringify({coins:30,xp:20,gear:{},wear:{},earned:{}}));});await p.reload();await p.waitForTimeout(700);
const shot=async(q,n)=>{const s=await p.$(`.pq-slot[data-quest="${q}"]`);await s.screenshot({path:path.join(OUT,n)});};
const adv=async()=>{await p.evaluate(()=>{PQ._advance();PQ._advance();});await p.waitForTimeout(60);};
const drain=async()=>{for(let i=0;i<40;i++){if(!await p.evaluate(()=>!!document.querySelector('.pq-dlg.on')))return;if(await p.$('.pq-choices.on')||await p.$('.pq-pad.on'))return;await adv();}};
const pad=async v=>{for(const k of String(v))await p.evaluate(k=>PQ._padKey(k),k);await p.evaluate(()=>PQ._padKey('OK'));await p.waitForTimeout(300);};
const padOn=()=>p.evaluate(()=>!!document.querySelector('.pq-pad.on'));
const padEq=()=>p.$eval('.pq-pad .pq-eq',e=>e.textContent);
const lastLog=q=>p.evaluate(q=>{const L=(PQ._state().logs||{})[q]||[];return L.slice(-3).join(' | ');},q);
const job=id=>p.evaluate(id=>PQM.jobDone(id),id);
const msg=sel=>p.$eval(sel,e=>e.textContent);
const talkTo=async(x,y,d)=>{await p.evaluate(([x,y,d])=>PQ._tp(x,y,d),[x,y,d]);await p.evaluate(()=>PQ._interact());await p.waitForTimeout(300);await drain();};
const drag=async(src,dst)=>{const a=await p.$(src);await a.evaluate(e=>{e.scrollIntoView({block:'center',behavior:'instant'});});await p.waitForTimeout(150);const r=await a.boundingBox();const t=await p.$(dst);const q=await t.boundingBox();
  await p.mouse.move(r.x+r.width/2,r.y+r.height/2);await p.mouse.down();await p.mouse.move(r.x+r.width/2+10,r.y+r.height/2+10,{steps:3});await p.mouse.move(q.x+q.width/2,q.y+q.height/2,{steps:8});await p.mouse.up();await p.waitForTimeout(100);};
const crewSays=id=>p.evaluate(id=>{let said=null;PQ_DATA.talk(id,{S:PQ._state(),say:l=>{said=l[0].t;},save:()=>{},goal:()=>{}});return said;},id);
// splitter helpers
const add=async(r,n)=>{for(let i=0;i<n;i++)await p.click(`${r} .ok-sp-add`);await p.waitForTimeout(40);};
const cut=async(r,n)=>{await p.click(`${r} .ok-cut-btn[data-n="${n}"]`);await p.waitForTimeout(60);};
const take=async(r,ks)=>{for(const k of ks)await p.click(`${r} .ok-part[data-k="${k}"]`);await p.waitForTimeout(60);};
const sweep=async(r,a,z)=>{const A=await p.$(`${r} .ok-part[data-k="${a}"]`);await A.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await p.waitForTimeout(120);const ra=await A.boundingBox();const Z=await p.$(`${r} .ok-part[data-k="${z}"]`);const rz=await Z.boundingBox();
  await p.mouse.move(ra.x+4,ra.y+ra.height/2);await p.mouse.down();await p.mouse.move(rz.x+rz.width-4,rz.y+rz.height/2,{steps:Math.max(6,(z-a+1)*3)});await p.mouse.up();await p.waitForTimeout(80);};
const ask=async(r,vals)=>{const I=await p.$$(`${r} .ok-sp-ask form input`);for(let k=0;k<vals.length;k++)await I[k].fill(vals[k]);await p.click(`${r} .ok-sp-ask form button`);await p.waitForTimeout(80);return msg(`${r} .ok-sp-ask ~ .ok-msg`);};
const mark=async(r,n)=>{for(let i=0;i<n;i++)await p.click(`${r} .ok-sp-mark`);await p.waitForTimeout(60);};
const mix=async(r,w,n,d)=>{const I=await p.$$(`${r} .ok-mixform input`);await I[0].fill(w);await I[1].fill(n);await I[2].fill(d);await p.click(`${r} .ok-mixform button`);await p.waitForTimeout(80);return msg(`${r} .ok-sp-ask ~ .ok-msg`);};
const grp=async(r,g)=>{await p.click(`${r} .ok-grp-btn[data-n="${g}"]`);await p.waitForTimeout(60);};
const sym=r=>msg(`${r} .ok-sym`);
const next=async r=>{await p.click(`${r} .ok-next`);await p.waitForTimeout(60);};
const bx=async(root,vals,idx)=>{const F=await p.$$(`${root} form.mk-two:not(.mk-chain)`).then(a=>Promise.all(a.map(async e=>[e,await e.evaluate(x=>!x.closest('.ok-sp-ask'))]))).then(a=>a.filter(x=>x[1]).map(x=>x[0]));const f=idx==null?F.pop():F[idx];const I=await f.$$('input');for(let k=0;k<vals.length;k++)await I[k].fill(vals[k]);await (await f.$('button')).click();await p.waitForTimeout(80);return f.evaluate(x=>x.nextElementSibling.textContent);};
{const t=await crewSays('felix');ok(/I'm Felix/.test(t)&&!/inch|twelfth|×|12/.test(t),'crew before Learn: Felix says hello about the market and the Golem (no math yet)');}
ok((await p.$eval('.pq-slot[data-quest="find"]',e=>e.className)).includes('lock'),'find quest locked before Two Pieces');
ok((await p.$eval('.pq-slot[data-quest="boss"]',e=>e.className)).includes('lock'),'boss locked from the start');
// ── Warm-Up: job 1 two pieces (too many wholes, wrong cut, tap + drag, each piece asked on its own)
const PC='#mk-pieces';await add(PC,5);ok((await msg(`${PC} .ok-msg`)).includes('only 4 whole'),'pieces: a fifth whole foot is refused');
await cut(PC,4);ok((await msg(`${PC} .ok-msg`)).includes('6 equal parts'),'pieces: cutting into 4 for sixths gets the hint');
await cut(PC,6);await sweep(PC,0,0);ok((await sym(PC)).includes('4 whole feet + 1 of 6 parts'),'pieces round 1: 4 whole feet + 1 of 6 parts (drag)');
ok((await ask(PC,['16'])).includes('there are 4 of them'),'pieces: 4 + 12 = 16 gets the multiply hint');await ask(PC,['48']);
ok((await ask(PC,['72'])).includes('six whole feet'),'pieces: 72 for one sixth gets its hint');await ask(PC,['2']);await next(PC);
await add(PC,3);await cut(PC,16);await take(PC,[0,1,2,3,4,5,6]);await ask(PC,['48']);ok((await ask(PC,['16'])).includes('1 ounce'),'pieces round 2: 16 for seven sixteenths gets its hint');await ask(PC,['7']);await next(PC);
await add(PC,1);await cut(PC,10);await take(PC,[0,1,2]);await ask(PC,['60']);ok((await ask(PC,['30'])).includes('100 minutes'),'pieces round 3: 30 (hour as 100) gets its hint');await ask(PC,['18']);
ok(await job('j1'),'job 1: 4 ft = 48 in + one sixth ft = 2 in; 3 lb = 48 oz + 7 oz; 1 h = 60 min + 18 min');
await p.fill('#mm-g4-4-10-07-mm-0','6');await p.click('#mk-mental .mm-p[data-i="0"] button');ok((await msg('#mk-mental .mm-p[data-i="0"] .mm-fb')).includes('6 equal groups'),'mental math: a wrong answer gets the equal-groups hint');
for(const [i,a] of [[0,'10'],[1,'6'],[2,'5'],[3,'2']]){await p.fill(`#mm-g4-4-10-07-mm-${i}`,a);await p.click(`#mk-mental .mm-p[data-i="${i}"] button`);}
ok(await p.$$eval('#mk-mental .mm-p.ok',x=>x.length)===4,'mental math: one equal part, 4 right');
const T='#mk-think';ok((await msg(`${T} .ok-do`)).includes('your way'),'think: the free strip names no method');
await add(T,2);await cut(T,4);ok(!(await msg(`${T} .ok-msg`)).includes('bottom number'),'think: any cut is allowed (no wrong-cut hint)');await cut(T,6);await take(T,[0,1,2,3,4]);
ok((await sym(T)).includes('2 whole feet + 5 of 6 parts'),'think: 2 whole feet + 5 of 6 parts on the free strip');
ok((await bx(T,['2','34'])).includes('only the fraction part'),'think: 2 ft 34 in (counts the feet twice) gets its hint');ok((await bx(T,['0','10'])).includes('2 whole feet'),'think: 10 in (drops the wholes) gets its hint');
await bx(T,['0','34']);ok((await p.$eval(`${T} .mk-think-ans .ok-msg`,e=>e.className)).includes('good')&&(await msg(`${T} .mk-think-ans .ok-msg`)).includes('same height'),'think: 0 ft 34 in accepted before Learn (any equal form)');
// ── find quest (opener: find)
await p.waitForTimeout(1300);ok(!(await p.$eval('.pq-slot[data-quest="find"]',e=>e.className)).includes('lock'),'find quest unlocks after job 1');
await p.evaluate(()=>PQ._play('find'));await p.waitForTimeout(600);await drain();
await talkTo(11,12,'up');ok(await p.evaluate(()=>!!PQ._state().q.find.met),'find: Goldie explains the Re-Stamper');
const grab=async(x,y)=>{await p.evaluate(([x,y])=>PQ._tp(x,y,'up'),[x,y+1]);await p.keyboard.down('ArrowUp');await p.waitForTimeout(140);await p.keyboard.up('ArrowUp');await p.waitForTimeout(400);await drain();};
await grab(23,14);ok(await padOn(),'find: a smudged pumpkin tag asks 5 ft in inches');await pad(17);await drain();ok((await lastLog('find')).includes('adds them'),'find: 17 → the adds-them hint');await pad(60);await drain();
await grab(26,15);await pad(8);await drain();ok((await lastLog('find')).includes('equal parts'),'find: 8 → Cora\'s equal-parts hint');await pad(2);await drain();
await grab(4,9);await pad(5);await drain();ok(await p.evaluate(()=>!!PQ._state().world.handle),'find: the handle is under the last pumpkin');
await talkTo(11,12,'up');await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.find),'find quest clear');
await p.evaluate(()=>PQ._play('find'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(14,6,'up'));await p.waitForTimeout(400);await shot('find','g-market.png');await p.evaluate(()=>PQ._stop());
// ── Learn: crew window, job 2 scarecrows
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(400);
await p.evaluate(()=>PQ._play('crew'));await p.waitForTimeout(600);await drain();
await talkTo(3,16,'left');ok(!(await p.evaluate(()=>!!PQ._state().done.crew)),'crew: Opti waits until all four are heard');
for(const [x,y,d] of [[5,15,'up'],[5,15,'down'],[8,15,'up'],[8,15,'down']])await talkTo(x,y,d);
ok(await p.evaluate(()=>Object.keys(PQ._state().q.crew.heard||{}).length===4),'crew: heard all four ways');
ok(await p.evaluate(()=>{const L=(PQ._state().logs||{}).crew||[];return L.some(l=>/2 feet 10 inches/.test(l))&&L.some(l=>/24 plus 10 is 34/.test(l));}),'crew: Atlas\'s and Felix\'s ways are in the quest log');
await talkTo(3,16,'left');await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.crew),'crew quest clear');
const SP='#mk-split';await add(SP,2);await cut(SP,6);await take(SP,[0,1]);await sweep(SP,2,4);ok((await sym(SP)).includes('5 of 6 parts'),'scarecrows: tap + drag take 5 of 6 parts');
ok((await ask(SP,['2','34'])).includes('Only the fraction part changes'),'scarecrows: 2 ft 34 in (converts the whole too) gets the mistake hint');ok((await ask(SP,['0','10'])).includes('2 whole feet are still there'),'scarecrows: 0 ft 10 in (drops the wholes) gets its hint');
await ask(SP,['2','10']);ok(!!(await p.$(`${SP} .ok-sp-old`)),'scarecrows: Atlas\'s way done, Felix\'s ask appears under it');
ok((await ask(SP,['10'])).includes('only the fraction part'),'scarecrows: 10 in for all inches gets its hint');await ask(SP,['34']);await next(SP);
await add(SP,1);await cut(SP,12);await sweep(SP,0,6);ok((await ask(SP,['1','19'])).includes('already counts'),'scarecrows round 2: 1 ft 19 in gets its hint');await ask(SP,['1','7']);await ask(SP,['19']);
ok(await job('j2'),'job 2: 2 5/6 ft = 2 ft 10 in = 34 in; 1 7/12 ft = 1 ft 7 in = 19 in');
{const t=await crewSays('felix');ok(/change both pieces/.test(t),'crew after job 2: Felix shares his all-inches way');}
// job 3: weigh and time
const WG='#mk-weigh';await add(WG,2);await cut(WG,8);await take(WG,[0,1,2,3,4,5,6]);ok((await ask(WG,['39'])).includes('number of parts'),'weigh: 39 (parts as ounces) gets its hint');ok((await ask(WG,['9'])).includes('before changing'),'weigh: 9 (adds before changing) gets its hint');await ask(WG,['46']);await next(WG);
await add(WG,1);await cut(WG,5);await take(WG,[0,1]);ok((await ask(WG,['24'])).includes('only the fraction'),'weigh: 24 min (drops the hour) gets its hint');await ask(WG,['84']);await next(WG);
await add(WG,2);await cut(WG,10);await take(WG,[0]);ok((await ask(WG,['121'])).includes('6 minutes'),'weigh: 121 gets the tenth-of-an-hour hint');await ask(WG,['126']);
ok(await job('j3'),'job 3: 46 oz, 84 min, 126 min');
// build quest
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('build'));await p.waitForTimeout(600);await drain();
await talkTo(11,12,'up');ok(await p.evaluate(()=>!!PQ._state().q.build.met),'build: Goldie sends you to the stamp shed');
await talkTo(18,8,'up');ok(await padOn(),'build: the first dial asks one and five twelfths feet');await pad(5);await drain();ok((await lastLog('build')).includes('only the fraction'),'build: 5 → Cora\'s "only the fraction" hint');await pad(17);await drain();
await talkTo(18,8,'up');await pad(32);await drain();ok((await lastLog('build')).includes('only the 2 whole'),'build: 32 → the whole-pounds hint');await pad(33);await drain();await talkTo(18,8,'up');await pad(65);await drain();await p.waitForTimeout(2800);
ok(await p.evaluate(()=>!!PQ._state().world.face&&!!PQ._state().done.build),'build quest clear: the stamp face is on the handle');
// Do board + Study It present
ok(!!(await p.$('#mk-board-kc'))&&!!(await p.$('#mk-worked .we-two')),'Learn: Goldie\'s board and the Study It (two ways)');
// job 4: label the crates (group mode: mark off, leftover refused, raw, parts, simplest)
const CR='#mk-crates';await mark(CR,1);ok((await sym(CR)).includes('14 inches still on the tape'),'crates: 1 foot marked off, 14 inches on the tape');await mark(CR,1);
ok(!(await p.$(`${CR} .ok-sp-mark`)),'crates: no more mark-off once fewer than 12 are left');
ok((await mix(CR,'2','2','26')).includes('12, not 26'),'crates: 2 2/26 (over the whole amount) gets its hint');ok((await mix(CR,'2','1','6')).includes('long way'),'crates: 2 1/6 first is sent back to the long way');
await mix(CR,'2','2','12');ok(!!(await p.$(`${CR} .ok-grp-btn`)),'crates: 2 2/12 accepted, Parts buttons appear');await grp(CR,4);ok((await msg(`${CR} .ok-msg`)).includes('middle of a part'),'crates: parts of 4 refused for 2 inches');
await grp(CR,2);ok((await mix(CR,'2','2','12')).includes('same fraction'),'crates: 2 2/12 again (not simplified) gets its hint');await mix(CR,'2','1','6');await next(CR);
await mark(CR,1);await mix(CR,'1','2','16');await grp(CR,2);await mix(CR,'1','1','8');await next(CR);
await mark(CR,1);ok((await mix(CR,'1','10','100')).includes('not 100'),'crates: 10 over 100 gets the 60-minute hint');await mix(CR,'1','10','60');await grp(CR,10);await mix(CR,'1','1','6');
ok(await job('j4'),'job 4: 26 in = 2 1/6 ft, 18 oz = 1 1/8 lb, 70 min = 1 1/6 h');
// job 5: two ways to write it
const TW='#mk-twoway';ok((await sym(TW)).includes('5 whole feet'),'twoway: 5 whole feet already on the bars');ok((await mix(TW,'5','2','1')).includes('mixes two units'),'twoway: 5 2/1 gets the same-unit hint');
await mix(TW,'5','2','12');await grp(TW,2);await mix(TW,'5','1','6');await next(TW);
ok((await mix(TW,'3','14','100')).includes('not 100'),'twoway: 3 14/100 gets its hint');await mix(TW,'3','14','16');await grp(TW,2);await mix(TW,'3','7','8');await next(TW);
await add(TW,1);await cut(TW,12);await sweep(TW,0,6);ok((await ask(TW,['1','95'])).includes('already counts'),'twoway: 1 h 95 min gets its hint');await ask(TW,['1','35']);
ok(await job('j5'),'job 5: 5 ft 2 in = 5 1/6 ft, 3 lb 14 oz = 3 7/8 lb, 1 7/12 h = 1 h 35 min');
// deliver quest
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('deliver'));await p.waitForTimeout(600);await drain();
await talkTo(24,12,'up');ok(await p.evaluate(()=>!!PQ._state().q.deliver.met),'deliver: the ink-maker explains the orders');
await talkTo(24,12,'up');ok(await padOn(),'deliver: order 1');await pad(9);await drain();ok((await lastLog('deliver')).includes('fraction part'),'deliver: 9 → the fraction-part hint');await pad(25);await drain();
await talkTo(24,12,'up');await pad(36);await drain();ok((await lastLog('deliver')).includes('Picture 3 whole'),'deliver: 36 → Hazel\'s picture hint');await pad(37);await drain();
await talkTo(24,12,'up');await pad(65);await drain();ok((await lastLog('deliver')).includes('isn\'t 5 minutes'),'deliver: 65 → Felix\'s fifth hint');await pad(72);await drain();
await talkTo(18,8,'up');await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().world.ink&&!!PQ._state().done.deliver),'deliver quest clear: the ink is in the shed');
await p.evaluate(()=>PQ._play('deliver'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(7,19,'left'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(1500);await adv();await p.waitForTimeout(300);
if(await p.$('.pq-choices.on')){await p.evaluate(()=>document.querySelector('.pq-choices.on button').click());await p.waitForTimeout(1200);await drain();}ok(await p.evaluate(()=>!!PQM.wallet().gear.cap),'shop: bought the explorer cap at Penny\'s cart');await p.evaluate(()=>PQ._stop());
// ── Show What You Know: job 6 the pumpkin order, the boss, bonus
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(800);
const OR='#mk-order';ok(await p.$eval(`${OR} .bm-story`,e=>e.parentElement.style.display==='none'),'order: the bar waits for Step 1');ok((await bx(OR,['1','7'],0)).includes('top number'),'order: 1 lb 7 oz (the 7 as ounces) gets its hint');await bx(OR,['1','14'],0);
await p.click(`${OR} .bm-fact[data-i="1"]`);await p.click(`${OR} .bm-seg[data-seg="p1"]`);ok((await msg(`${OR} .bm-ask + .ok-msg`)).length>0,'order bar: a fact on the wrong part gets a hint');
await p.click(`${OR} .bm-fact[data-i="1"]`);await p.click(`${OR} .bm-seg[data-seg="p0"]`);await drag(`${OR} .bm-fact[data-i="3"]`,`${OR} .bm-seg[data-seg="p1"]`);
const ob=async v=>{const I=await p.$$(`${OR} .bm-ask input`);await I[0].fill(v[0]);await I[1].fill(v[1]);await p.click(`${OR} .bm-ask button`);await p.waitForTimeout(60);return msg(`${OR} .bm-ask + .ok-msg`);};
ok((await ob(['4','11'])).includes('adds the 7'),'order bar: 4 lb 11 oz (adds before changing) gets its hint');ok((await ob(['4','18'])).includes('trade'),'order bar: 4 lb 18 oz gets the regroup nudge');await ob(['5','2']);
const mb=async(w,n,d)=>{const f=await p.$(`${OR} .ok-mixform`);const I=await f.$$('input');await I[0].fill(w);await I[1].fill(n);await I[2].fill(d);await (await f.$('button')).click();await p.waitForTimeout(80);return f.evaluate(x=>x.nextElementSibling.textContent);};
ok((await mb('5','2','16')).includes('not in simplest form'),'order: 5 2/16 gets the simplify hint');ok((await mb('5','1','2')).includes('8 out of 16'),'order: 5 1/2 gets its hint');await mb('5','1','8');
ok(await job('j6'),'job 6: 1 7/8 lb + 3 lb 4 oz = 5 lb 2 oz = 5 1/8 lb');
// the boss: every phase, a wrong answer in each, the HP bar, the defeat
await p.waitForTimeout(1300);ok(!(await p.$eval('.pq-slot[data-quest="boss"]',e=>e.className)).includes('lock'),'boss unlocks after the last page job');
await p.evaluate(()=>PQ._play('boss'));await p.waitForTimeout(800);await drain();
await talkTo(11,12,'up');ok(await p.evaluate(()=>!!PQ._state().q.boss.met),'boss: Goldie hands over the Re-Stamper');
await talkTo(14,6,'up');ok(await padOn()&&(await padEq()).includes('4 m 6 cm'),'boss phase 1: the first brick (4 m 6 cm)');
const WR=[['46','place'],['2003','300'],['31','4 quarts'],['16','Trade 12'],['405','60 minutes'],['7','6 minutes'],['41','stay'],['7','added 4 and 3']];
const RT=['406','2300','13','4','245','42','5','67'];
for(let k=0;k<8;k++){await pad(WR[k][0]);await drain();ok(await padOn()&&(await lastLog('boss')).length>0,'boss brick '+(k+1)+': wrong answer '+WR[k][0]+' gets a hint, same brick again (no damage)');
  ok(await p.evaluate(k=>(PQ._state().q.boss.hit||0)===k,k),'boss brick '+(k+1)+': HP unchanged after a miss');
  await pad(RT[k]);if(k===3){await p.waitForTimeout(200);await shot('boss','g-boss.png');}for(let i=0;i<8&&!(await padOn());i++){await adv();await p.waitForTimeout(80);if(await p.evaluate(()=>!!PQ._state().world.golem))break;}}
for(let i=0;i<12;i++){await adv();await p.waitForTimeout(120);}await p.waitForTimeout(3000);
ok(await p.evaluate(()=>!!PQ._state().world.golem&&!!PQ._state().done.boss),'boss: the Brick Golem is beaten after 8 bricks');
ok(await p.evaluate(()=>{const L=(PQ._state().logs||{}).boss||[];return L.some(l=>/GREENHOLLOW/.test(l))&&L.some(l=>/haven't seen the last/.test(l));}),'boss: the seed packet (Greenhollow) and the Smudge\'s line');
ok(await p.evaluate(()=>{try{return !!JSON.parse(localStorage.getItem('oao.pq.progress')||'{}').lessons['4.10.07'].boss;}catch(e){return false;}}),'My Math Map progress records the boss');
await p.evaluate(()=>PQ._play('boss'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(14,7,'up'));await p.waitForTimeout(400);await shot('boss','g-boss-beaten.png');await p.evaluate(()=>PQ._stop());
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(400);const bd=await p.$('.mk-board');await bd.scrollIntoViewIfNeeded();await bd.screenshot({path:path.join(OUT,'g-board.png')});
// bonus: the triangle of equals
await p.evaluate(()=>switchTab('assignment'));await p.click('#tab-assignment .ch-card summary');{const I=await p.$$('.ch-tri input');await I[0].fill('23');await I[1].fill('25');await I[2].fill('114');}await p.click('.ch-tri button');
ok((await msg('.ch-tri + .ok-msg')).includes('pounds side'),'bonus: a wrong card gets a side hint');{const I=await p.$$('.ch-tri input');await I[1].fill('41');}await p.click('.ch-tri button');ok((await msg('.ch-tri + .ok-msg')).includes('All three'),'bonus: 23 in, 41 oz, 114 min');
// ── helpers: defined words, hint ladders, writing chips + counter
const defs=await p.$$eval('.pq-def b',x=>x.map(e=>e.textContent));ok(defs.length===4,'defined words: '+defs.join(', '));
ok(!(await p.$$eval('.activity-sub .pq-def, .activity-title .pq-def, .task-label .pq-def',x=>x.length)),'no defined word sits in a heading');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(250);{const d=await p.$('#tab-warmup .pq-def');await d.scrollIntoViewIfNeeded();ok(!(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on'))),'word meaning hidden in the sentence');
await d.hover();await p.waitForTimeout(100);ok(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on')),'hover shows the meaning as a tooltip');{const r=await p.evaluate(()=>{const t=document.querySelector('.pq-def-m.pq-tip-on').getBoundingClientRect();return [t.left,t.right,document.documentElement.clientWidth];});ok(r[0]>=0&&r[1]<=r[2],'tooltip stays inside the window');}
await (await p.$('#mk-pieces .ok-sym')).hover();await d.focus();ok(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on')),'keyboard focus shows the tooltip');await d.screenshot({path:path.join(OUT,'def-tip.png')});}
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(250);
for(let i=0;i<3;i++)await p.click('.pq-hint[data-hint="1"] .pq-hint-btn');ok(await p.$$eval('.pq-hint[data-hint="1"] li',x=>x.length)===3,'hint ladder: 3 rungs');
ok(await p.$$eval('#tab-assignment .q-block .pq-hint',x=>x.length)===3,'every Show What You Know problem has a hint ladder');
{const fr=await p.$$eval('#tab-assignment .q-block .ok-mixed',x=>x.map(e=>e.querySelectorAll('input.ans-box').length));ok(fr.length===5&&fr.every(n=>n===3),'Show What You Know: five mixed-number answers, three boxes each ('+fr.join(',')+')');}
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(300);
for(const sel of ['#mk-split','#mk-weigh','#mk-crates','#mk-twoway']){const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$$eval(`${sel} .mk-todo`,x=>x.length)===1,'Learn job '+sel+': Your job + one What to do + a hint ladder');}
for(const [tab,sel] of [['warmup','#mk-pieces'],['assignment','#mk-order']]){await p.evaluate(t=>switchTab(t),tab);await p.waitForTimeout(250);const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$$eval(`${sel} .mk-todo`,x=>x.length)===1,'job '+sel+': Your job + one What to do + a hint ladder');}
const chipsFor=async(id,txt)=>{await p.fill('#'+id,txt);await p.dispatchEvent('#'+id,'input');return p.$$eval('#'+id+' + .pq-write .pq-chip',x=>x.filter(e=>e.classList.contains('on')).length);};
await p.evaluate(()=>switchTab('warmup'));
for(const t of ['It is 2 ft 10 in because 2 whole feet stay and five sixths of a foot is 10 inches','34 inches. I did 2 times 12 is 24 and added 10 from the parts']){const n=await chipsFor('journal-think',t);ok(n===2,'journal-think natural answer lights '+n+' of 2');}
ok(await chipsFor('journal-think','idk')===0,'journal-think: "idk" lights nothing');
for(const t of ['I notice the tag has a whole number and a fraction. I wonder how many inches that is','i see it is more than 2 feet, i wonder if it is 3 feet']){const n=await chipsFor('journal-notice',t);ok(n===2,'journal-notice natural answer lights '+n+' of 2');}
ok(await chipsFor('journal-notice','idk')===0,'journal-notice: "idk" lights nothing');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(250);
for(const t of ['My way was like Atlas because I changed just the fraction. I would write 5 ft 2 in because it is easier to read','I did it like Felix with all inches. For 5 and one sixth feet I would do 60 plus 2 is 62 inches since it is faster']){const n=await chipsFor('journal-compare',t);ok(n===3,'journal-compare natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-compare','idk')===0,'journal-compare: "idk" lights nothing');
for(const t of ['Split it into whole units and a fraction. Like 3 and one twelfth feet is 3 ft 1 in. Going backward you count the whole feet and put the leftover over 12','you change the two pieces, for example 1 and one fifth hours is 72 minutes, and to go back you skip count and simplify']){const n=await chipsFor('journal-big',t);ok(n===3,'journal-big natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-big','idk')===0,'journal-big: "idk" lights nothing');
ok((await msg('#journal-big + .pq-write .pq-count')).length>0,'word counter');
await p.evaluate(()=>switchTab('assignment'));await p.fill('#ans-1a','38');await p.dispatchEvent('#ans-1a','input');
await p.evaluate(()=>gatherAnswers());{const g=await p.$eval('#gatheredOutput',e=>e.value);ok(g.includes('Words I learned today')&&g.indexOf('Today\'s big idea')>0&&g.indexOf('Today\'s big idea')<200&&g.includes('38 in'),'journal: big idea at the top, SWYK boxes gathered, words at the end');}
// ── board mode for the Learn video's live board
const p2=await p.context().newPage();await p2.goto('file://'+path.join(H.REPO,'math-lesson-4-10-07-fractions-and-measurement-pt-2.html')+'?board=split');await p2.waitForTimeout(900);
await p2.click('#pq-boardhost .ok-sp-add');await p2.click('#pq-boardhost .ok-cut-btn[data-n="6"]');ok((await p2.$eval('#pq-boardhost .ok-sym',e=>e.textContent)).includes('each part is 2 inches'),'board mode ?board=split: the Splitter alone, taps work');await p2.screenshot({path:path.join(OUT,'board-split.png')});await p2.close();
ok(await p.evaluate(()=>['j1','j2','j3','j4','j5','j6'].every(j=>PQM.jobDone(j))),'all six jobs done on the page (clean mode can finish without the game)');
const f=await failed();console.log(JSON.stringify(await p.evaluate(()=>PQM.wallet().coins)),'coins');
console.log(!bad&&!errs.length&&!f.length?'PLAY PASSED':'PLAY FAILED '+bad+' '+errs.join('\n')+f.join('|'));await b.close();})();
