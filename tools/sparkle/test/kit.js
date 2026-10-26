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
// mental math
for(const [i,a] of [[0,'135'],[1,'157'],[2,'121']]){await p.fill(`#d-mm .mm-p[data-i="${i}"] input`,a);await p.click(`#d-mm .mm-p[data-i="${i}"] button`);}
ok(await p.$$eval('#d-mm .mm-p.ok',x=>x.length)===3,'mental math: 3 right');
await p.click('#d-ch summary');await p.fill('#d-ch input','12');await p.click('#d-ch .ch-form button[type=submit]');ok(await p.$eval('#d-ch .ch-explain',e=>!e.hidden),'bonus quest solved');
await p.screenshot({path:path.join(H.REPO,'tools/sparkle/out/kit-1150.png'),fullPage:true});
await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);ok(await p.evaluate(()=>document.documentElement.scrollWidth)<=390,'kit: no sideways scroll at 390');
await p.screenshot({path:path.join(H.REPO,'tools/sparkle/out/kit-390.png'),fullPage:true});
ok(!errs.length,'no errors '+errs.join('|'));console.log(bad?bad+' FAIL':'kit test passed');await b.close();process.exit(bad?1:0);})();
