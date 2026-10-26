// Full play-through of 4.10.01 (every quest, every job, the shop, tap and drag). node tools/sparkle/lessons/10-01/play.js
const H=require('../../test/harness.js');const path=require('path');const OUT=path.join(H.REPO,'tools/sparkle/out/10-01');require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errs,failed}=await H('math-lesson-4-10-01-metric-units.html',1150,900);
await p.evaluate(()=>{localStorage.setItem('oao.pq.avatar',JSON.stringify({name:'Maya',skin:2,hair:3,style:1,shirt:4}));localStorage.setItem('oao.pq.wallet',JSON.stringify({coins:30,xp:20,gear:{},wear:{},earned:{}}));});await p.reload();await p.waitForTimeout(700);
const shot=async(q,n)=>{const s=await p.$(`.pq-slot[data-quest="${q}"]`);await s.screenshot({path:path.join(OUT,n)});};
const adv=async()=>{await p.evaluate(()=>{PQ._advance();PQ._advance();});await p.waitForTimeout(60);};
const drain=async()=>{for(let i=0;i<40;i++){if(!await p.evaluate(()=>!!document.querySelector('.pq-dlg.on')))return;if(await p.$('.pq-choices.on')||await p.$('.pq-pad.on'))return;await adv();}};
// job 1: stamp the signs (tap a stamp, tap its sign)
for(const [v,id] of [['×10','mmcm'],['×100','cmm'],['×1,000','mkm']]){await p.click(`.mk-stamp[data-v="${v}"]`);await p.click(`.mk-sign[data-id="${id}"]`);}
// pieces quest
await p.evaluate(()=>PQ._play('pieces'));await p.waitForTimeout(600);await drain();
for(const [x,y,k] of [[11,17,'ArrowDown'],[1,5,'ArrowUp'],[29,8,'ArrowDown']]){await p.evaluate(([x,y])=>PQ._tp(x,y,'down'),[x,y]);if(x==29){await p.evaluate(()=>PQ._tp(29,6,'down'));}await p.keyboard.down(k);await p.waitForTimeout(140);await p.keyboard.up(k);await p.waitForTimeout(400);await drain();}
await p.evaluate(()=>PQ._tp(27,13,'up'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(300);await drain();await p.waitForTimeout(2800);
console.log('done',JSON.stringify(PQ_done=await p.evaluate(()=>PQ._state().done)));
// shop
await p.evaluate(()=>PQ._play('crew'));await p.waitForTimeout(500);await p.evaluate(()=>PQ._tp(23,15,'up'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(1500);await adv();await p.waitForTimeout(300);await shot('crew','g-shop.png');
await p.click('.pq-choices button:nth-child(1)');await p.waitForTimeout(1200);await drain();await p.waitForTimeout(300);await shot('crew','g-cap.png');
// counter: locked until j2
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(400);
console.log('counter locked?',await p.$eval('.pq-slot[data-quest="counter"]',e=>e.className));
for(let r=0;r<4;r++){await p.click(`#mk-builder .ok-rounds button[data-i="${r}"]`);for(let i=0;i<10;i++)await p.click('#mk-builder .ok-src-piece');}
await p.waitForTimeout(1500);console.log('counter after',await p.$eval('.pq-slot[data-quest="counter"]',e=>e.className));
await p.evaluate(()=>PQ._play('counter'));await p.waitForTimeout(700);await p.evaluate(()=>PQ._tp(22,9,'up'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(300);await drain();
await p.click('.pq-choices button:nth-child(2)');await p.waitForTimeout(300);await drain();await p.waitForTimeout(1500);await p.evaluate(()=>PQ._tp(27,13,'up'));await p.waitForTimeout(300);await shot('counter','g-counter.png');await drain();await p.waitForTimeout(2800);
// sign: locked until j3,j4
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(500);console.log('sign locked?',await p.$eval('.pq-slot[data-quest="sign"]',e=>e.className));
await p.evaluate(()=>switchTab('learn'));await p.waitForTimeout(300);
for(let i=0;i<4;i++)await p.click('#mk-bottle .ok-tray .ok-disc[data-p="1000"]');for(let i=0;i<3;i++)await p.click('#mk-bottle .ok-tray .ok-disc[data-p="100"]');for(let i=0;i<5;i++)await p.click('#mk-bottle .ok-tray .ok-disc[data-p="10"]');for(let i=0;i<4;i++)await p.click('#mk-bottle .ok-col[data-p="1000"] .ok-colbtns .ok-btn:last-child');await p.click('#mk-cart .ok-col[data-p="1000"] .ok-colbtns .ok-btn');for(let i=0;i<4;i++)await p.click('#mk-cart .ok-col[data-p="100"] .ok-colbtns .ok-btn:last-child');
await p.evaluate(()=>switchTab('assignment'));await p.waitForTimeout(1500);console.log('sign after',await p.$eval('.pq-slot[data-quest="sign"]',e=>e.className));
await p.evaluate(()=>PQ._play('sign'));await p.waitForTimeout(800);await drain();await p.evaluate(()=>PQ._tp(21,13,'up'));await p.evaluate(()=>PQ._interact());await p.waitForTimeout(300);await drain();await p.waitForTimeout(700);
for(const k of '2000')await p.evaluate(k=>PQ._padKey(k),k);await p.evaluate(()=>PQ._padKey('OK'));await p.waitForTimeout(300);
for(let i=0;i<5;i++){await adv();await p.waitForTimeout(250);}await p.evaluate(()=>PQ._tp(26,14,'up'));await p.waitForTimeout(900);await shot('sign','g-open.png');await drain();await p.waitForTimeout(3000);
await p.evaluate(()=>switchTab('warmup'));await p.waitForTimeout(400);const bd=await p.$('.mk-board');await bd.scrollIntoViewIfNeeded();await bd.screenshot({path:path.join(OUT,'g-board.png')});
console.log(JSON.stringify(await p.evaluate(()=>[PQ._state().done,PQ._state().world,PQM.wallet()])));
// new kit tools on this page: mental math + bonus quest + answer boxes
await p.evaluate(()=>switchTab('warmup'));for(const [i,a] of [[0,'900'],[1,'250'],[2,'7000'],[3,'4,800']]){await p.fill(`#mm-g4-4-10-01-mm-${i}`,a);await p.click(`.mm-p[data-i="${i}"] button`);}
const mm=await p.$$eval('.mm-p.ok',x=>x.length);console.log('mental math right:',mm);
await p.evaluate(()=>switchTab('assignment'));await p.click('.ch-card summary');await p.fill('.ch-form input','10');await p.click('.ch-form button[type=submit]');const hint=await p.$eval('.ch-hint',e=>!e.hidden);await p.fill('.ch-form input','15');await p.click('.ch-form button[type=submit]');
console.log('bonus: hint after miss',hint,'| done',await p.$eval('.ch-explain',e=>!e.hidden));
const J=await p.evaluate(()=>PQ._state().world.jobs);const ok=['j1','j2','j3','j4','j5'].every(k=>J[k]);
const P=await p.evaluate(()=>JSON.parse(localStorage.getItem('oao.pq.progress')||'{}'));console.log('progress',JSON.stringify(P.lessons&&P.lessons['4.10.01']));
const f=await failed();console.log(ok&&mm===4&&!errs.length&&!f.length?'PLAY PASSED':'PLAY FAILED '+JSON.stringify(J)+errs.join('\n')+f.join('|'));await b.close();})();
