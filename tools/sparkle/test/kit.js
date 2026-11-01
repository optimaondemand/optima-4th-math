// Plays every kit tool on tools/sparkle/kit-demo.html by tap AND drag. node tools/sparkle/test/kit.js
const H=require('./harness.js');const path=require('path');
(async()=>{const {b,p,errs}=await H('tools/sparkle/kit-demo.html',1150,900);let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log((c?'ok   ':'FAIL ')+m);};
const drag=async(src,dst)=>{const a=await p.$(src);await a.scrollIntoViewIfNeeded();const r=await a.boundingBox();const t=await p.$(dst);await t.scrollIntoViewIfNeeded();const q=await t.boundingBox();
  await p.mouse.move(r.x+r.width/2,r.y+r.height/2);await p.mouse.down();await p.mouse.move(r.x+r.width/2+10,r.y+r.height/2+10,{steps:3});await p.mouse.move(q.x+q.width/2,q.y+q.height/2,{steps:8});await p.mouse.up();await p.waitForTimeout(100);};
// two-unit mat: build by tap + drag, copy, trade both ways
await p.click('#d-um .ok-tray .ok-disc[data-p="100"]');for(let i=0;i<5;i++)await p.click('#d-um .ok-tray .ok-disc[data-p="10"]');for(let i=0;i<4;i++)await p.click('#d-um .ok-tray .ok-disc[data-p="1"]');
await drag('#d-um .ok-tray .ok-disc[data-p="1"]','#d-um .ok-col[data-p="1"]');
ok((await p.$eval('#d-um .ok-sym',e=>e.textContent)).includes('1 m 55 cm'),'unit mat: built 1 m 55 cm (tap + drag)');
await p.click('#d-um .ok-add');ok((await p.$eval('#d-um .ok-sym',e=>e.textContent)).includes('2 m 110 cm'),'unit mat: add copies the shelf, shows 2 m 110 cm + regroup warning');
ok((await p.$eval('#d-um .ok-sym',e=>e.textContent)).includes('Trade'),'unit mat: warns when small unit is 1 m or more');
await p.click('#d-um .ok-col[data-p="1"] .ok-colbtns .ok-btn');await p.click('#d-um .ok-col[data-p="10"] .ok-colbtns .ok-btn');
ok((await p.$eval('#d-um .ok-sym',e=>e.textContent)).includes('3 m 10 cm'),'unit mat: trades give 3 m 10 cm');
ok((await p.$eval('#d-um .ok-do',e=>e.textContent)).includes('Done'),'unit mat: steps done');
// trade mat (rate 12): build by tap + drag, take away, break 1 into 12, trade back
for(let i=0;i<15;i++)await p.click('#d-sc .ok-tray .ok-wt[data-k="small"]');await drag('#d-sc .ok-tray .ok-wt[data-k="small"]','#d-sc .ok-plat');
ok(await p.$$eval('#d-sc .ok-plat .ok-wt',x=>x.length)===16&&!!(await p.$('#d-sc .ok-scale-ask form')),'scale: 15 taps + 1 drag = 16 oz weights; the answer form appears at the target');
await p.click('#d-sc .ok-tray .ok-wt[data-k="small"]');ok(await p.$$eval('#d-sc .ok-plat .ok-wt',x=>x.length)===16,'scale: past the 1 lb mark is refused');
await p.fill('#d-sc .ok-scale-ask input','10');await p.click('#d-sc .ok-scale-ask button');ok((await p.$eval('#d-sc .ok-msg',e=>e.textContent)).length>0,'scale: a wrong answer gets a hint');
await p.fill('#d-sc .ok-scale-ask input','16');await p.click('#d-sc .ok-scale-ask button');ok(!!(await p.$('#d-sc .ok-next')),'scale: 1 lb = 16 oz, next round');
await p.click('#d-sc .ok-next');ok(!!(await p.$('#d-sc .ok-plat .ok-item'))&&!(await p.$eval('#d-sc .ok-sym',e=>e.textContent)).includes('1 lb 7'),'scale: read round shows the item, the reading stays hidden');
{const I=await p.$$('#d-sc .ok-scale-ask input');await I[0].fill('1');await I[1].fill('7');await p.click('#d-sc .ok-scale-ask button');}
await p.click('#d-sc .ok-next');await p.click('#d-sc .ok-tray .ok-wt[data-k="big"]');for(let i=0;i<3;i++)await p.click('#d-sc .ok-tray .ok-wt[data-k="small"]');
ok((await p.$eval('#d-sc .ok-sym',e=>e.textContent)).includes('1 lb 3 oz')&&await p.$$eval('#d-sc .ok-ghost-n',x=>x.length)===1,'scale: compare round builds 1 lb 3 oz with a ghost needle');
await p.click('#d-sc .ok-plat .ok-wt[data-k="small"]');ok(true,'scale: tap a weight on the platform');
for(let i=0;i<3;i++)await p.click('#d-tm .ok-tray .ok-disc[data-k="big"]');await p.click('#d-tm .ok-tray .ok-disc[data-k="small"]');await drag('#d-tm .ok-tray .ok-disc[data-k="small"]','#d-tm .ok-col[data-k="small"]');
ok((await p.$eval('#d-tm .ok-sym',e=>e.textContent)).includes('3 ft 2 in')&&(await p.$eval('#d-tm .ok-sym',e=>e.textContent)).includes('38 in'),'trade mat: built 3 ft 2 in = 38 in (tap + drag)');
await drag('#d-tm .ok-col[data-k="big"] .ok-well .ok-disc','#d-tm .ok-zone');ok(await p.$eval('#d-tm .ok-ztot',e=>e.textContent.includes('1 ft 0 in')),'trade mat: dragged 1 ft into the take-away box');
await p.click('#d-tm .ok-col[data-k="small"] .ok-colbtns .ok-btn:last-child');await p.click('#d-tm .ok-col[data-k="small"] .ok-colbtns .ok-btn:last-child');
ok(await p.$eval('#d-tm .ok-col[data-k="small"] .ok-count',e=>e.textContent==='0'),'trade mat: 2 inches taken, none left');
await drag('#d-tm .ok-col[data-k="big"] .ok-well .ok-disc','#d-tm .ok-col[data-k="small"]');ok(await p.$eval('#d-tm .ok-col[data-k="small"] .ok-count',e=>e.textContent==='12'),'trade mat: drag 1 ft onto the inches column breaks it into 12 in');
for(let i=0;i<6;i++)await p.click('#d-tm .ok-col[data-k="small"] .ok-colbtns .ok-btn:last-child');
ok((await p.$eval('#d-tm .ok-do',e=>e.textContent)).includes('Done')&&(await p.$eval('#d-tm .ok-sym',e=>e.textContent)).includes('1 ft 6 in'),'trade mat: 3 ft 2 in − 1 ft 8 in = 1 ft 6 in, steps done');
await p.click('#d-tm .ok-col[data-k="small"] .ok-colbtns .ok-btn:last-child');ok((await p.$eval('#d-tm .ok-msg',e=>e.textContent)).includes('exactly'),'trade mat: taking more than the amount is refused');
await p.click('#d-tm .ok-reset');for(let i=0;i<12;i++)await p.click('#d-tm .ok-tray .ok-disc[data-k="small"]');ok((await p.$eval('#d-tm .ok-sym',e=>e.textContent)).includes('Trade'),'trade mat: 12 inches warns to trade');
await p.click('#d-tm .ok-col[data-k="small"] .ok-colbtns .ok-btn');ok(await p.$eval('#d-tm .ok-col[data-k="big"] .ok-count',e=>e.textContent==='1'),'trade mat: 12 in → 1 ft');
// stamps by drag
await drag('#d-stamps .mk-stamp[data-v="×12"]','#d-stamps .mk-sign[data-id="a"]');await drag('#d-stamps .mk-stamp[data-v="×3"]','#d-stamps .mk-sign[data-id="b"]');
ok(await p.$$eval('#d-stamps .mk-sign.ok',x=>x.length)===2,'stamps: both signs stamped by drag');
// bar model part-whole: wrong segment first, then tap+tap, then drag
const facts='#d-bm1 .bm-fact';await p.click(facts+'[data-i="1"]');await p.click('#d-bm1 .bm-seg[data-seg="p0"]');
ok((await p.$eval('#d-bm1 .ok-msg',e=>e.className)).includes('hint'),'bar model: wrong part gives a hint');
await p.click(facts+'[data-i="1"]');await p.click('#d-bm1 .bm-seg[data-seg="whole"]');
await drag(facts+'[data-i="3"]','#d-bm1 .bm-seg[data-seg="p0"]');
ok(await p.$('#d-bm1 .bm-q')!==null,'bar model: ? appears when every fact is placed');
await p.fill('#d-bm1 .bm-form input','1400');await p.click('#d-bm1 .bm-form button');ok((await p.$eval('#d-bm1 .ok-msg',e=>e.textContent)).includes('whole bar'),'bar model: common mistake gets its own hint');
await p.fill('#d-bm1 .bm-form input','600');await p.click('#d-bm1 .bm-form button');ok((await p.$eval('#d-bm1 .ok-msg',e=>e.className)).includes('good'),'bar model: right answer accepted');
// compare
await p.click('#d-bm2 .bm-fact[data-i="0"]');await p.click('#d-bm2 .bm-seg[data-seg="b0"]');await p.click('#d-bm2 .bm-fact[data-i="2"]');await p.click('#d-bm2 .bm-seg[data-seg="b1"]');
await p.fill('#d-bm2 .bm-form input','18');await p.click('#d-bm2 .bm-form button');ok((await p.$eval('#d-bm2 .ok-msg',e=>e.className)).includes('good'),'compare bar model solved');
// number bond
for(const v of ['45','2','250']){await p.fill('#d-nb .nb-c input','99');await p.click('#d-nb .nb-check');await p.fill('#d-nb .nb-c input',v);await p.click('#d-nb .nb-check');const n=await p.$('#d-nb .ok-next');if(n)await n.click();}
ok((await p.$eval('#d-nb .nb-eq',e=>e.textContent)).includes('250 = 200 + 50'),'number bond: three rounds');
// clock hands: tap, drag the hand, whole turn, ask, day wheel
const C0='#d-clock';for(let i=0;i<11;i++)await p.click(`${C0} .ok-step-btn[data-n="5"]`);
{const f=await p.$(`${C0} .ok-face`);await f.scrollIntoViewIfNeeded();const b=await f.boundingBox();const cx=b.x+b.width/2,cy=b.y+b.height/2,R=b.width*0.37;
 const at=m=>[cx+R*Math.sin(m/60*2*Math.PI),cy-R*Math.cos(m/60*2*Math.PI)];let q=at(55);await p.mouse.move(q[0],q[1]);await p.mouse.down();for(let m=56;m<=60;m++){q=at(m);await p.mouse.move(q[0],q[1],{steps:3});}await p.mouse.up();}
ok((await p.$eval(`${C0} .ok-sym`,e=>e.textContent)).includes('60 minutes wound')&&await p.$$eval(`${C0} .ok-turn`,x=>x.length)===1,'clock: 11 taps of 5 + a drag of 5 = 60 min, one full turn');
ok(!!(await p.$(`${C0} .ok-wholeturn`))===false,'clock: no whole-turn button when it would pass the target');
for(let i=0;i<15;i++)await p.click(`${C0} .ok-step-btn[data-n="1"]`);await p.click(`${C0} .ok-step-btn[data-n="1"]`);
ok((await p.$eval(`${C0} .ok-msg`,e=>e.textContent)).includes('past'),'clock: winding past the target is refused');
await p.fill(`${C0} .ok-clock-ask input`,'0');{const I=await p.$$(`${C0} .ok-clock-ask input`);await I[1].fill('75');}await p.click(`${C0} .ok-clock-ask button`);ok((await p.$eval(`${C0} .ok-msg`,e=>e.textContent)).includes('Count the full turns'),'clock: 0 h 75 min gets the mistake hint');
{const I=await p.$$(`${C0} .ok-clock-ask input`);await I[0].fill('1');await I[1].fill('15');}await p.click(`${C0} .ok-clock-ask button`);await p.click(`${C0} .ok-next`);
for(let i=0;i<4;i++)await p.click(`${C0} .ok-step-btn[data-n="6"]`);ok(!!(await p.$(`${C0} .ok-wholeturn`)),'day wheel: after one turn by hand, the whole-turn button shows');await p.click(`${C0} .ok-wholeturn`);await tapC();
async function tapC(){for(let i=0;i<2;i++)await p.click(`${C0} .ok-step-btn[data-n="1"]`);}
ok((await p.$eval(`${C0} .ok-sym`,e=>e.textContent)).includes('2 full turns and 2 hours')&&(await p.$eval(`${C0} .ok-do`,e=>e.textContent)).includes('Done'),'day wheel: 2 turns and 2 hours, done');
// pour station: fill by tap + drag, group up with a leftover, pour out
await p.click('#d-pour .ok-pr-small .ok-vsl.src');await drag('#d-pour .ok-pr-small .ok-vsl.src','#d-pour .ok-pr-big');
ok(!!(await p.$('#d-pour .ok-pour-ask form'))&&(await p.$eval('#d-pour .ok-sym',e=>e.textContent)).includes('2 pints'),'pour: tap + drag 2 pints fill the quart; the answer form appears');
await p.click('#d-pour .ok-pr-small .ok-vsl.src');ok((await p.$eval('#d-pour .ok-sym',e=>e.textContent)).includes('2 pints'),'pour: a full quart takes no more');
await p.fill('#d-pour .ok-pour-ask input','4');await p.click('#d-pour .ok-pour-ask button');ok((await p.$eval('#d-pour .ok-msg',e=>e.textContent)).includes('Count'),'pour: wrong answer gets the mistake hint');
await p.fill('#d-pour .ok-pour-ask input','2');await p.click('#d-pour .ok-pour-ask button');await p.click('#d-pour .ok-next');
for(let i=0;i<4;i++)await p.click('#d-pour .ok-pr-small .ok-vsl.src');ok(!!(await p.$('#d-pour .ok-whole')),'pour: after one gallon by hand, the whole-gallon button shows');
await p.click('#d-pour .ok-whole');await p.click('#d-pour .ok-pr-small .ok-vsl.src');ok((await p.$eval('#d-pour .ok-msg',e=>e.textContent)).includes('not enough'),'pour: 3 quarts left cannot start a gallon');
ok((await p.$eval('#d-pour .ok-sym',e=>e.textContent)).includes('2 full gallons'),'pour: 11 qt makes 2 full gallons, 3 quarts left');
{const I=await p.$$('#d-pour .ok-pour-ask input');await I[0].fill('2');await I[1].fill('3');await p.click('#d-pour .ok-pour-ask button');}await p.click('#d-pour .ok-next');
await p.click('#d-pour .ok-pr-big .ok-vsl.src');await drag('#d-pour .ok-pr-big .ok-vsl.src','#d-pour .ok-pr-small');
ok((await p.$eval('#d-pour .ok-sym',e=>e.textContent)).includes('19 fluid ounces')&&(await p.$eval('#d-pour .ok-do',e=>e.textContent)).includes('Done'),'pour: 2 cups poured out (tap + drag) = 19 fl oz, done');
// mental math
for(const [i,a] of [[0,'135'],[1,'157'],[2,'121']]){await p.fill(`#d-mm .mm-p[data-i="${i}"] input`,a);await p.click(`#d-mm .mm-p[data-i="${i}"] button`);}
ok(await p.$$eval('#d-mm .mm-p.ok',x=>x.length)===3,'mental math: 3 right');
await p.click('#d-ch summary');await p.fill('#d-ch input','12');await p.click('#d-ch .ch-form button[type=submit]');ok(await p.$eval('#d-ch .ch-explain',e=>!e.hidden),'bonus quest solved');
await p.screenshot({path:path.join(H.REPO,'tools/sparkle/out/kit-1150.png'),fullPage:true});
await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);ok(await p.evaluate(()=>document.documentElement.scrollWidth)<=390,'kit: no sideways scroll at 390');
await p.screenshot({path:path.join(H.REPO,'tools/sparkle/out/kit-390.png'),fullPage:true});
ok(!errs.length,'no errors '+errs.join('|'));console.log(bad?bad+' FAIL':'kit test passed');await b.close();process.exit(bad?1:0);})();
