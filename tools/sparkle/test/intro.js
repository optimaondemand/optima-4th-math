// The cinematic opening: node tools/sparkle/test/intro.js 10-01
// Plays it at 1150 and 390 px (frames → tools/sparkle/out/<UU-LL>/intro-<w>-<sec>.png), then checks:
// it closes on its own and gives the page back, Esc skips it, it plays once per session, the Replay button
// brings it back, reduced motion never autoplays (Replay shows the still picture), and nothing throws.
const H=require('./harness.js');const fs=require('fs'),path=require('path');
(async()=>{const code=process.argv[2];const [uu,ll]=code.split('-');
const page=fs.readdirSync(H.REPO).find(f=>f.startsWith(`math-lesson-4-${uu}-${ll}-`)&&f.endsWith('.html'));
const out=path.join(H.REPO,'tools/sparkle/out',code);fs.mkdirSync(out,{recursive:true});let bad=0;
const log=(ok,m)=>{if(!ok)bad++;console.log((ok?'ok   ':'FAIL ')+m);};
const on=p=>p.evaluate(()=>!!document.querySelector('.pqi'));
for(const [w,h] of [[1150,900],[390,844]]){
  const {b,p,errs,failed}=await H(page,w,h,{query:'?intro'});
  log(await on(p),`${w}px: ?intro plays the opening`);
  const t0=Date.now();
  for(const s of [1.2,2.5,3.4,4.4,5.4,6.3,7.8]){const wait=s*1000-(Date.now()-t0)+800;if(wait>0)await p.waitForTimeout(wait);
    await p.screenshot({path:path.join(out,`intro-${w}-${String(s).replace('.','_')}.png`)});}
  const nocard=await p.evaluate(()=>PQ_LESSON.intro.card===false);const card=await p.$eval('.pqi',c=>c.classList.contains('title')).catch(()=>false);log(nocard||card,`${w}px: ${nocard?'no title card (picture only)':'the title card lands'}`);
  await p.waitForTimeout(2600);log(!(await on(p)),`${w}px: it closes on its own`);
  const scroll=await p.evaluate(()=>getComputedStyle(document.body).overflow);log(scroll!=='hidden',`${w}px: the page scrolls again`);
  const rb=await p.$('.pqi-replay');log(!!rb,`${w}px: Replay intro button in the header`);
  if(rb){await rb.click();await p.waitForTimeout(400);log(await on(p),`${w}px: Replay plays it again`);
    await p.keyboard.press('Escape');await p.waitForTimeout(900);log(!(await on(p)),`${w}px: Esc skips it`);}
  await p.goto(p.url().replace('?intro',''));await p.waitForTimeout(900);
  log(!(await on(p)),`${w}px: test browsers (and a second visit) skip the autoplay`);
  const f=await failed();log(!f.length&&!errs.length,`${w}px: no errors ${[...f,...errs].join(' | ')}`);
  await b.close();}
{const {b,p,errs}=await H(page,1150,900,{reducedMotion:'reduce'});
  log(!(await on(p)),'reduced motion: no autoplay');
  await p.click('.pqi-replay');await p.waitForTimeout(500);
  const still=await p.$eval('.pqi',c=>/Start the lesson/.test(c.textContent)).catch(()=>false);
  log(still,'reduced motion: Replay shows the finished picture with a Start button');
  await p.screenshot({path:path.join(out,'intro-reduced.png')});
  await p.click('.pqi-skip');await p.waitForTimeout(300);log(!(await on(p)),'reduced motion: Start closes it');
  log(!errs.length,'reduced motion: no errors '+errs.join(' | '));await b.close();}
console.log(bad?`${bad} FAIL`:'intro test passed');process.exit(bad?1:0);})();
