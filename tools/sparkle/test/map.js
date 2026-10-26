// My Math Map + certificates. node tools/sparkle/test/map.js
const H=require('./harness.js');const path=require('path');
(async()=>{const {b,p,errs}=await H('my-math-map.html',1000,900);let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log((c?'ok   ':'FAIL ')+m);};
await p.evaluate(()=>{localStorage.setItem('oao.pq.avatar',JSON.stringify({name:'Maya',skin:2,hair:3,style:1,shirt:4}));localStorage.setItem('oao.pq.wallet',JSON.stringify({coins:92,xp:120,wear:{cap:1},gear:{cap:1},earned:{}}));
  const L={};PQ_MAP[0].lessons.forEach((x,i)=>L[x.id]={done:i<7?1:0,title:x.title});L['4.11.01']={seen:1};localStorage.setItem('oao.pq.progress',JSON.stringify({lessons:L}));});
await p.reload();await p.waitForTimeout(600);
ok((await p.textContent('#hello')).includes('Maya'),'greets the explorer by name');
ok(await p.$('.lvl[data-unit="10"].clear')!==null,'Level 10 shows as clear');
ok(await p.$('.lvl[data-unit="11"] li.seen')!==null,'started lesson shows as started');
await p.screenshot({path:path.join(H.REPO,'tools/sparkle/out/map.png'),fullPage:true});
await p.click('[data-cert="0"]');await p.waitForTimeout(300);ok(await p.$eval('#cert',e=>getComputedStyle(e).display!=='none'),'certificate opens');
await p.fill('#cn','Maya R.');ok((await p.textContent('#cw'))==='Maya R.','name edits on the certificate');
await p.emulateMedia({media:'print'});const c=await p.$('.cert-sheet');await c.screenshot({path:path.join(H.REPO,'tools/sparkle/out/cert.png')});
ok(await p.$eval('#path',e=>getComputedStyle(e).display)==='none','print shows only the certificate');
await p.emulateMedia({media:'screen'});await p.setViewportSize({width:390,height:844});ok(await p.evaluate(()=>document.documentElement.scrollWidth)<=390,'no sideways scroll at 390');
ok(!errs.length,'no errors '+errs.join('|'));console.log(bad?bad+' FAIL':'map test passed');await b.close();process.exit(bad?1:0);})();
