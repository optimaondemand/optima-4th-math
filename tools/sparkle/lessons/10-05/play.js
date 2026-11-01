// Full play-through of 4.10.05 (every quest, every job, tap and drag, a wrong answer per model, hints, writing, clean mode). node tools/sparkle/lessons/10-05/play.js
const H=require('../../test/harness.js');const path=require('path');const OUT=path.join(H.REPO,'tools/sparkle/out/10-05');require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errs,failed}=await H('math-lesson-4-10-05-units-of-time.html',1150,900);let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log((c?'ok   ':'FAIL ')+m);};
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
const ask=async(root,vals)=>{const I=await p.$$(`${root} .ok-clock-ask input`);for(let k=0;k<vals.length;k++)await I[k].fill(vals[k]);await p.click(`${root} .ok-clock-ask button`);await p.waitForTimeout(80);return msg(`${root} .ok-clock-ask ~ .ok-msg`);};
const bx=async(root,vals,idx)=>{const F=await p.$$(`${root} form.mk-two:not(.mk-chain)`).then(a=>Promise.all(a.map(async e=>[e,await e.evaluate(x=>!x.closest('.ok-clock-ask'))]))).then(a=>a.filter(x=>x[1]).map(x=>x[0]));const f=idx==null?F.pop():F[idx];const I=await f.$$('input');for(let k=0;k<vals.length;k++)await I[k].fill(vals[k]);await (await f.$('button')).click();await p.waitForTimeout(80);return f.evaluate(x=>x.nextElementSibling.textContent);};
const ch=async(root,vals)=>{const I=await p.$$(`${root} .mk-chain input`);for(let k=0;k<vals.length;k++)await I[k].fill(vals[k]);await p.click(`${root} .mk-chain button`);await p.waitForTimeout(80);return msg(`${root} .mk-chain + .ok-msg`);};
const step=(r,n)=>`${r} .ok-step-btn[data-n="${n}"]`;
const turns=async r=>p.$$eval(`${r} .ok-turn`,x=>x.length);
// drag the clock hand clockwise by `n` ticks of a 60-tick face (from wherever it points)
const dragHand=async(r,n,rate=60)=>{const f=await p.$(`${r} .ok-face`);await f.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await p.waitForTimeout(100);const bb=await f.boundingBox();const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2,R=bb.width*0.37;
  const cur=await p.evaluate(r=>{const l=document.querySelector(r+' .ok-hand');const x=+l.getAttribute('x2')-150,y=150-+l.getAttribute('y2');let a=Math.atan2(x,y);if(a<0)a+=2*Math.PI;return a;},r);
  const at=k=>[cx+R*Math.sin(cur+k/rate*2*Math.PI),cy-R*Math.cos(cur+k/rate*2*Math.PI)];let q=at(0);await p.mouse.move(q[0],q[1]);await p.mouse.down();for(let k=1;k<=n;k++){q=at(k);await p.mouse.move(q[0],q[1],{steps:2});}await p.mouse.up();await p.waitForTimeout(80);};
{const t=await crewSays('felix');ok(/I'm Felix/.test(t)&&!/minute|hour|×|60/.test(t),'crew before Learn: Felix says hello about the Clock Tower (no math yet)');}
ok((await p.$eval('.pq-slot[data-quest="fix"]',e=>e.className)).includes('lock'),'fix quest locked before Wind the Clock');
// ── Warm-Up: job 1 wind the clock (tap + drag), mental math, Think
const Wd='#mk-wind';ok(!(await msg(`${Wd} .ok-sym`)).includes('60')&&!(await p.$eval(`${Wd} .ok-face`,e=>e.textContent)).includes('1 turn ='),'wind: the face and the readout hide the 60 (the round asks for it)');
await tapN(step(Wd,5),11);await dragHand(Wd,5);ok((await msg(`${Wd} .ok-sym`)).includes('60 seconds')&&await turns(Wd)===1,'wind round 1: 11 taps of 5 s + a 5-tick drag = one full turn');
await p.click(step(Wd,1));ok((await msg(`${Wd} .ok-msg`)).includes('past one full turn'),'wind round 1: past one turn is refused');
ok((await ask(Wd,['100'])).includes('100'),'wind round 1: 100 gets the look-at-the-count hint');await ask(Wd,['60']);await p.click(`${Wd} .ok-next`);
await tapN(step(Wd,5),12);ok((await ask(Wd,['12'])).includes('12 is the number'),'wind round 2: 12 (counting the big numbers) gets its hint');await ask(Wd,['60']);
ok(await job('j1'),'job 1: 1 min = 60 s, 1 h = 60 min');
await p.fill('#mm-g4-4-10-05-mm-0','25');await p.click('#mk-mental .mm-p[data-i="0"] button');ok((await msg('#mk-mental .mm-p[data-i="0"] .mm-fb')).includes('Count up'),'mental math: a wrong answer gets the count-up hint');
for(const [i,a] of [[0,'15'],[1,'40'],[2,'25'],[3,'10']]){await p.fill(`#mm-g4-4-10-05-mm-${i}`,a);await p.click(`#mk-mental .mm-p[data-i="${i}"] button`);}
ok(await p.$$eval('#mk-mental .mm-p.ok',x=>x.length)===4,'mental math: make an hour, 4 right');
const T='#mk-think';ok(!(await msg(`${T} .ok-sym`)).includes('130'),'think: Time A shows turns, not the minute total');
await tapN(step(T,5),12);ok(!!(await p.$(`${T} .ok-wholeturn`)),'think: after one turn by hand, the whole-turn button shows');await p.click(`${T} .ok-wholeturn`);await tapN(step(T,5),2);
ok((await msg(`${T} .ok-sym`)).includes('2 full turns and 10 minutes'),'think: Time A wound = 2 full turns and 10 minutes');
await p.click(`${T} .ok-rounds button[data-i="1"]`);await tapN(step(T,5),25);ok((await msg(`${T} .ok-sym`)).includes('125 minutes wound')&&await turns(T)===2,'think: Time B = 125 minutes, 2 full turns');
await p.fill('#thinkWho','A');await p.fill('#thinkBy','85');await p.click(`${T} .mk-think-ans button`);ok((await msg(`${T} .mk-think-ans .ok-msg`)).includes('210 minutes'),'think: "A by 85" (2 h 10 min read as 210) gets the 60-not-100 hint');
await p.fill('#thinkBy','5');await p.click(`${T} .mk-think-ans button`);ok((await p.$eval(`${T} .mk-think-ans .ok-msg`,e=>e.className)).includes('good'),'think: Time A by 5 min accepted before Learn, any method');
// ── fix quest (opener: fix)
await p.waitForTimeout(1300);ok(!(await p.$eval('.pq-slot[data-quest="fix"]',e=>e.className)).includes('lock'),'fix quest unlocks after job 1');
await p.evaluate(()=>PQ._play('fix'));await p.waitForTimeout(600);await drain();
await talkTo(13,10,'up');ok(await p.evaluate(()=>!!PQ._state().q.fix.met),'fix: Otto explains the smudged clock face');
await talkTo(15,8,'up');ok(await padOn(),'fix: the tower asks how many minutes past (hand at the 3)');await pad(3);await drain();ok((await lastLog('fix')).includes('5 minutes'),'fix: 3 → Hazel\'s count-by-5s hint');await pad(15);await drain();
await talkTo(15,8,'up');await pad(40);await drain();await talkTo(15,8,'up');await pad(55);await drain();await p.waitForTimeout(2800);
ok(await p.evaluate(()=>!!PQ._state().world.clockOn&&!!PQ._state().done.fix),'fix quest clear: the clock ticks again');
await p.evaluate(()=>PQ._play('fix'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(15,9,'up'));await p.waitForTimeout(400);await shot('fix','g-tower.png');await p.evaluate(()=>PQ._stop());
// ── Learn: crew window, job 2 restart the hands
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(400);
await p.evaluate(()=>PQ._play('crew'));await p.waitForTimeout(600);await drain();
await talkTo(3,16,'left');ok(!(await p.evaluate(()=>!!PQ._state().done.crew)),'crew: Opti waits until all four are heard');
for(const [x,y,d] of [[5,15,'up'],[5,15,'down'],[8,15,'up'],[8,15,'down']])await talkTo(x,y,d);
ok(await p.evaluate(()=>Object.keys(PQ._state().q.crew.heard||{}).length===4),'crew: heard all four ways');
ok(await p.evaluate(()=>{const L=(PQ._state().logs||{}).crew||[];return L.some(l=>/125 minutes/.test(l))&&L.some(l=>/130 minutes/.test(l));}),'crew: Atlas\'s and Felix\'s ways are in the quest log');
await talkTo(3,16,'left');await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.crew),'crew quest clear');
const HN='#mk-hands';await tapN(step(HN,5),11);await dragHand(HN,5);for(let i=0;i<6;i++)await p.click(`${HN} .ok-wholeturn`);await tapN(step(HN,5),5);
ok((await msg(`${HN} .ok-sym`)).includes('7 full turns and 25 seconds'),'hands: second hand wound 7 turns + 25 s (tap + drag + whole turns)');
ok((await ask(HN,['725'])).includes('isn\'t 725'),'hands: 725 s (place-value join) gets its hint');ok((await ask(HN,['420'])).includes('25 extra'),'hands: 420 s gets the forgot-the-extra hint');await ask(HN,['445']);await p.click(`${HN} .ok-next`);
await tapN(step(HN,5),12);for(let i=0;i<4;i++)await p.click(`${HN} .ok-wholeturn`);await tapN(step(HN,5),3);
ok((await ask(HN,['515'])).includes('not 100'),'hands: 515 min gets the 60-not-100 hint');await ask(HN,['315']);
ok((await bx(HN,['800'],0)).includes('100'),'hands: 8 min = 800 s gets the 100-trade hint');await bx(HN,['480'],0);
ok(!(await job('j2')),'job 2 waits for 10 h');await bx(HN,['600'],1);ok(await job('j2'),'job 2: 7 min 25 s = 445 s, 5 h 15 min = 315 min, 8 min = 480 s, 10 h = 600 min');
{const t=await crewSays('felix');ok(!/315/.test(t),'crew after job 2: methods still wait for job 3');}
// find quest
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('find'));await p.waitForTimeout(600);await drain();
await talkTo(13,10,'up');ok(await p.evaluate(()=>!!PQ._state().q.find.met),'find: Otto asks for the three gears');
const grab=async(x,y)=>{await p.evaluate(([x,y])=>PQ._tp(x,y,'up'),[x,y+1]);await p.keyboard.down('ArrowUp');await p.waitForTimeout(140);await p.keyboard.up('ArrowUp');await p.waitForTimeout(400);await drain();};
await grab(4,10);ok(await padOn(),'find: gear A asks 1 min = ? s');await pad(100);await drain();ok((await lastLog('find')).includes('isn\'t 100'),'find: 100 → Cora\'s hint');await pad(60);await drain();
await grab(20,14);await pad(65);await drain();ok((await lastLog('find')).includes('not 100'),'find: 65 → Felix\'s 60-not-100 hint');await pad(25);await drain();
await grab(28,15);await pad(60);await drain();ok((await lastLog('find')).includes('own number'),'find: day gear 60 → Cora\'s 24 hint');await pad(24);await drain();
await talkTo(13,10,'up');await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.find),'find quest clear');
// job 3: make the next hour + group the minutes
const G='#mk-group';const mm=async(i,a,c)=>{const I=await p.$$(`${G} .mm-p[data-i="${i}"] input`);await I[0].fill(a);await I[1].fill(c);await p.click(`${G} .mm-p[data-i="${i}"] button`);};
await mm(0,'1','65');ok((await msg(`${G} .mm-p[data-i="0"] .mm-fb`)).length>0,'next hour: 1 h 65 min gets a nudge');await mm(0,'2','5');await mm(1,'4','0');
ok(await p.$$eval(`${G} .mm-p.ok`,x=>x.length)===2,'make the next hour: 1 h 50 min + 15 min = 2 h 5 min, 3 h 45 min + 15 min = 4 h 0 min');
await tapN(step(G,5),12);await p.click(`${G} .ok-wholeturn`);await tapN(step(G,5),5);ok((await msg(`${G} .ok-sym`)).includes('145 minutes wound')&&await turns(G)===2,'group: 145 minutes wound, 2 full turns');
ok((await ask(G,['1','45'])).includes('100'),'group: 1 h 45 min (100-trade) gets its hint');ok((await ask(G,['2','0'])).includes('left over'),'group: 2 h 0 min gets the leftover hint');
await ask(G,['2','25']);ok(await job('j3'),'job 3: 145 min = 2 h 25 min');
{const t=await crewSays('felix');ok(/315 minutes/.test(t),'crew after job 3: Felix shares his multiply-down way');}
// job 4: day wheel + chain + 150 min
const DY='#mk-days';await tapN(step(DY,6),4);ok(!!(await p.$(`${DY} .ok-wholeturn`)),'day wheel: whole-turn button after one turn');await tapN(`${DY} .ok-wholeturn`,2);
ok((await msg(`${DY} .ok-sym`)).includes('3 full turns'),'day wheel: 3 full turns');ok((await ask(DY,['180'])).includes('60'),'day wheel: 180 h (using 60) gets its hint');await ask(DY,['72']);
ok((await ch(DY,['120','120'])).includes('still minutes'),'chain: 120 for seconds gets the next-step hint');await ch(DY,['120','7200']);
ok((await bx(DY,['15000'])).includes('not 100'),'150 min: 15,000 s gets the 60-not-100 hint');await bx(DY,['9000']);ok(await job('j4'),'job 4: 3 days = 72 h; 2 h = 120 min = 7,200 s; 150 min = 9,000 s');
// deliver quest
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('deliver'));await p.waitForTimeout(600);await drain();
await talkTo(13,10,'up');ok(await p.evaluate(()=>!!PQ._state().q.deliver.carry),'deliver: Otto hands over the timetable');
await talkTo(24,10,'up');ok(await padOn(),'deliver: the station master asks 5 h 5 min = ? min');await pad(505);await drain();ok((await lastLog('deliver')).includes('505'),'deliver: 505 → Hazel\'s place-value hint');
await pad(305);await drain();await p.waitForTimeout(2800);ok(await p.evaluate(()=>!!PQ._state().done.deliver),'deliver quest clear: 5 h 5 min = 305 min');
await p.evaluate(()=>PQ._play('deliver'));await p.waitForTimeout(500);await drain();await p.evaluate(()=>PQ._tp(25,19,'right'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(1500);await adv();await p.waitForTimeout(300);
if(await p.$('.pq-choices.on')){await p.evaluate(()=>document.querySelector('.pq-choices.on button').click());await p.waitForTimeout(1200);await drain();}ok(await p.evaluate(()=>!!PQM.wallet().gear.cap),'shop: bought the explorer cap at Penny\'s cart');await p.evaluate(()=>PQ._stop());
// job 5: the express train
const X='#mk-express';ok((await ch(X,['250'])).includes('not 100'),'express: 250 min gets the 60-not-100 hint');await ch(X,['170']);
await p.click(`${X} .bm-fact[data-i="1"]`);await p.click(`${X} .bm-seg[data-seg="p1"]`);ok((await msg(`${X} .bm-ask + .ok-msg`)).length>0,'express bar: a fact on the wrong part gets a hint');
await p.click(`${X} .bm-fact[data-i="1"]`);await p.click(`${X} .bm-seg[data-seg="whole"]`);await drag(`${X} .bm-fact[data-i="3"]`,`${X} .bm-seg[data-seg="p1"]`);
const sb=async v=>{await p.fill(`${X} .bm-ask input`,v);await p.click(`${X} .bm-ask button`);await p.waitForTimeout(60);return msg(`${X} .bm-ask + .ok-msg`);};
ok((await sb('125')).includes('250'),'express bar: 125 (half of 250) gets its hint');ok((await sb('170')).includes('half'),'express bar: 170 gets the whole-trip hint');await sb('85');
ok((await bx(X,['0','85'])).includes('more than an hour'),'express: 0 h 85 min gets the regroup hint');await bx(X,['1','25']);ok(await job('j5'),'job 5: 2 h 50 min = 170 min, half = 85 min = 1 h 25 min');
// ── Show What You Know: prove it, the chime quest, bonus
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(800);
const P='#mk-prove';ok(await turns(P)===1,'prove: the clock starts at 1 hour');ok(!(await p.$(`${P} .ok-clock-ask form`)),'prove: no answer box before the 75 minutes are wound');
await tapN(step(P,5),12);await p.click(`${P} .ok-wholeturn`).catch(()=>{});await tapN(step(P,5),3);
ok((await msg(`${P} .ok-sym`)).includes('2 full turns and 15 minutes'),'prove: 1 h + 75 min = 2 full turns and 15 minutes');
ok((await ask(P,['1','75'])).includes('Smudge wrote'),'prove: 1 h 75 min (the Smudge\'s note) gets the hint');ok((await ask(P,['1','15'])).includes('another full turn'),'prove: 1 h 15 min gets the count-the-turns hint');
await ask(P,['2','15']);ok(await job('j6'),'job 6: the timetable should say 2 h 15 min');
await p.waitForTimeout(1300);await p.evaluate(()=>PQ._play('chime'));await p.waitForTimeout(800);await drain();
await talkTo(13,10,'up');await talkTo(15,8,'up');ok(await padOn(),'chime: the clock asks 1 day 6 h = ? h');
await pad(66);await drain();ok((await lastLog('chime')).includes('24'),'chime: 66 → Cora\'s 24-not-60 hint');await pad(106);await drain();ok((await lastLog('chime')).includes('106'),'chime: 106 → Hazel\'s place-value hint');
await pad(30);for(let i=0;i<4;i++){await adv();await p.waitForTimeout(200);}await shot('chime','g-chime.png');await drain();await p.waitForTimeout(3000);
ok(await p.evaluate(()=>!!PQ._state().world.chimed&&!!PQ._state().done.chime),'chime quest: 30 hours until the Golem comes');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(400);const bd=await p.$('.mk-board');await bd.scrollIntoViewIfNeeded();await bd.screenshot({path:path.join(OUT,'g-board.png')});
await p.evaluate(()=>switchTab('assignment'));await p.click('.ch-card summary');await p.fill('.ch-form input','8');await p.click('.ch-form button[type=submit]');const hint=await p.$eval('.ch-hint',e=>!e.hidden);await p.fill('.ch-form input','7');await p.click('.ch-form button[type=submit]');
ok(hint&&await p.$eval('.ch-explain',e=>!e.hidden),'bonus: hint after a miss, 7 minutes solves it');
// ── helpers: defined words, hint ladders, writing chips + counter
const defs=await p.$$eval('.pq-def b',x=>x.map(e=>e.textContent));ok(defs.length===5,'defined words: '+defs.join(', '));
ok(!(await p.$$eval('.activity-sub .pq-def, .activity-title .pq-def, .task-label .pq-def',x=>x.length)),'no defined word sits in a heading');
ok(await p.$$eval('.pq-def',x=>x.every(e=>e.closest('#mk-wind .task-box'))),'every defined word first appears in Job 1\'s Your job sentence');
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(250);{const d=await p.$('.pq-def');await d.scrollIntoViewIfNeeded();ok(!(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on'))),'word meaning hidden in the sentence');
await d.hover();await p.waitForTimeout(100);ok(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on')),'hover shows the meaning as a tooltip');{const r=await p.evaluate(()=>{const t=document.querySelector('.pq-def-m.pq-tip-on').getBoundingClientRect();return [t.left,t.right,document.documentElement.clientWidth];});ok(r[0]>=0&&r[1]<=r[2],'tooltip stays inside the window');}
await (await p.$('#mk-wind .ok-clockbtns')).hover();await d.focus();ok(await p.evaluate(()=>!!document.querySelector('.pq-def-m.pq-tip-on')),'keyboard focus shows the tooltip');await d.screenshot({path:path.join(OUT,'def-tip.png')});}
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(250);
for(let i=0;i<3;i++)await p.click('.pq-hint[data-hint="1"] .pq-hint-btn');ok(await p.$$eval('.pq-hint[data-hint="1"] li',x=>x.length)===3,'hint ladder: 3 rungs');
ok(await p.$$eval('#tab-assignment .q-block .pq-hint',x=>x.length)===3,'every Show What You Know problem has a hint ladder');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(300);
for(const sel of ['#mk-hands','#mk-group','#mk-days','#mk-express']){const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$$eval(`${sel} .mk-todo`,x=>x.length)===1,'Learn job '+sel+': Your job + one What to do + a hint ladder');}
for(const [tab,sel] of [['warmup','#mk-wind'],['assignment','#mk-prove']]){await p.evaluate(t=>switchTab(t),tab);await p.waitForTimeout(250);const n=await p.$$eval(`${sel} .pq-hint`,x=>x.length);ok(n===1&&await p.$(`${sel} .task-box`)&&await p.$(`${sel} .mk-todo`),'job '+sel+': Your job + What to do + a hint ladder');}
const chipsFor=async(id,txt)=>{await p.fill('#'+id,txt);await p.dispatchEvent('#'+id,'input');return p.$$eval('#'+id+' + .pq-write .pq-chip',x=>x.filter(e=>e.classList.contains('on')).length);};
await p.evaluate(()=>switchTab('warmup'));
for(const t of ['Time A is longer by 5 minutes because 2 hours is 120 minutes and 10 more is 130','I wound them on the clock and time a went 5 more minutes past the 2 turns']){const n=await chipsFor('journal-think',t);ok(n===3,'journal-think natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-think','idk')===0,'journal-think: "idk" lights nothing');
for(const t of ['I notice one is in hours and minutes and the other is only minutes. I wonder which is longer','i see 125 has no hours, i wonder how to compare them']){const n=await chipsFor('journal-notice',t);ok(n===2,'journal-notice natural answer lights '+n+' of 2');}
ok(await chipsFor('journal-notice','idk')===0,'journal-notice: "idk" lights nothing');
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(250);
for(const t of ['My way was like Felix because I changed it all to minutes. For 150 min I would count by 60 like Atlas because it is faster','I did it like Atlas and counted the turns. For 150 minutes I would find 2 hours since that makes sense to me']){const n=await chipsFor('journal-compare',t);ok(n===3,'journal-compare natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-compare','idk')===0,'journal-compare: "idk" lights nothing');
for(const t of ['Going down you multiply by 60 and going up you count the 60s and keep the leftover. Like 2 h is 120 min','either change it all to minutes or count full hours, both ways work. For example 90 minutes = 1 hour 30 minutes']){const n=await chipsFor('journal-big',t);ok(n===3,'journal-big natural answer lights '+n+' of 3');}
ok(await chipsFor('journal-big','idk')===0,'journal-big: "idk" lights nothing');
ok((await msg('#journal-big + .pq-write .pq-count')).length>0,'word counter');
await p.evaluate(()=>gatherAnswers());{const g=await p.$eval('#gatheredOutput',e=>e.value);ok(g.includes('Words I learned today')&&g.indexOf('Today\'s big idea')>0&&g.indexOf('Today\'s big idea')<200,'journal: big idea at the top, words at the end');}
// ── board mode for the Learn video's live board
const p2=await p.context().newPage();await p2.goto('file://'+path.join(H.REPO,'math-lesson-4-10-05-units-of-time.html')+'?board=hands');await p2.waitForTimeout(900);
await p2.click('#pq-boardhost .ok-step-btn[data-n="5"]');ok((await p2.$eval('#pq-boardhost .ok-sym',e=>e.textContent)).includes('5 seconds'),'board mode ?board=hands: the clock alone, taps work');await p2.screenshot({path:path.join(OUT,'board-hands.png')});await p2.close();
// ── clean mode: every job is on the page
ok(await p.evaluate(()=>['j1','j2','j3','j4','j5','j6'].every(j=>PQM.jobDone(j))),'all six jobs done on the page (clean mode can finish without the game)');
ok(await p.evaluate(()=>!!PQ_DATA.voice),'voice clips are wired (PQ_DATA.voice)');
const f=await failed();console.log(JSON.stringify(await p.evaluate(()=>PQM.wallet().coins)),'coins');
console.log(!bad&&!errs.length&&!f.length?'PLAY PASSED':'PLAY FAILED '+bad+' '+errs.join('\n')+f.join('|'));await b.close();})();
