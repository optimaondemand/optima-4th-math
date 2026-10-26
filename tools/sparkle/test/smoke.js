// Smoke test any sparkled lesson: node tools/sparkle/test/smoke.js 10-01
// Loads the page at 1150 and 390 px, every tab, game ON and clean mode, ?review; screenshots into tools/sparkle/out/<UU-LL>/.
const H=require('./harness.js');const fs=require('fs'),path=require('path');
(async()=>{const code=process.argv[2];const [uu,ll]=code.split('-');
const page=fs.readdirSync(H.REPO).find(f=>f.startsWith(`math-lesson-4-${uu}-${ll}-`)&&f.endsWith('.html'));
const out=path.join(H.REPO,'tools/sparkle/out',code);fs.mkdirSync(out,{recursive:true});let bad=0;const log=(ok,m)=>{if(!ok)bad++;console.log((ok?'ok   ':'FAIL ')+m);};
for(const [w,h] of [[1150,900],[390,844]]){const {b,p,errs,failed}=await H(page,w,h,{query:'?review'});
  const tabs=await p.$$eval('.tab-btn',bs=>bs.map(b=>b.dataset.tab));
  log(tabs.length===3,`${w}px: ${tabs.length} tabs (${tabs.join(', ')})`);
  for(const t of tabs){await p.evaluate(t=>switchTab(t),t);await p.waitForTimeout(400);
    await p.screenshot({path:path.join(out,`${w}-${t}.png`),fullPage:true});
    const open=await p.$eval('details.pq-intro',d=>d.open).catch(()=>null);
    if(open!==null)log(open===(t===tabs[0]),`${w}px ${t}: question drawer ${open?'open':'closed'}`);}
  const sw=await p.evaluate(()=>document.documentElement.scrollWidth);log(sw<=w,`${w}px: no sideways scroll (${sw})`);
  const v=await p.$$eval('.pq-vslot',x=>x.map(e=>e.dataset.slot+(e.classList.contains('review')||e.classList.contains('has')?'':'(hidden)')));log(v.length>=3&&v.length<=4,`${w}px: ${v.length} video slots: ${v.join(', ')}`);
  const models=await p.$$eval('[data-mk-model]',x=>x.map(e=>e.dataset.mkModel+(e.innerHTML.trim()?'':'(EMPTY)')));log(!models.some(m=>m.includes('EMPTY')),`${w}px: models ${models.join(', ')}`);
  const tips=await p.$$eval('.mk-tip',x=>x.filter(e=>!e.querySelector('canvas')).length);log(tips===0,`${w}px: every tip has its pixel character`);
  await p.evaluate(()=>PQM.setClean(true));await p.waitForTimeout(300);const vis=await p.$$eval('.pq-slot',x=>x.filter(e=>e.offsetParent).length);log(vis===0,`${w}px: clean mode hides the game (${vis} visible)`);
  await p.screenshot({path:path.join(out,`${w}-clean.png`)});await p.evaluate(()=>PQM.setClean(false));
  const f=await failed();log(!f.length&&!errs.length,`${w}px: no errors ${[...f,...errs].join(' | ')}`);
  await b.close();}
// without ?review only real videos show
{const {b,p}=await H(page,1150,900);const shown=await p.$$eval('.pq-vslot',x=>x.filter(e=>e.offsetParent).map(e=>e.dataset.slot));log(true,`live: visible video slots = ${shown.join(', ')||'none'}`);await b.close();}
console.log(bad?`${bad} FAIL`:'smoke test passed');process.exit(bad?1:0);})();
