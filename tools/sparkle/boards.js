// Video boards: one picture per [ON SCREEN: Board: …] cue, shown full screen in the Video Studio with Bethany in a corner
// bubble, and drawn on with the studio pen. Reads every part with "kind":"board" in tools/sparkle/lessons/<UU-LL>/video.json
// and writes assets/video/boards/<UU-LL>/<pic>.png (1600×900). Then run build_lesson.py so the studio shot list picks them up.
//   node tools/sparkle/boards.js 10-01            (all boards)        node tools/sparkle/boards.js 10-01 <pic>   (one)
//
// Board types ("board":{…}):
//   problem  {title, sub?, model?}  a problem to solve live with the pen. model is one of
//            {bar:{parts:3, labels:["1 m 65 cm",…], whole:"?", name:"counter"}}   empty or labeled bar model
//            {chart:{cols:["m","cm"], rows:3, given:[["2","150"]]}}            a two-unit chart (blank rows to fill)
//            {twoway:[{who:"atlas", title, lines:["3 × 1 m = ___ m",…]}, …]}  two methods side by side, blanks to fill
//            {bond:{whole:"", parts:["",""]}}                                 an empty number bond
//   mistake  {title, say, who?}                                  a wrong answer to circle and fix
//   page     {sel, tab?, clicks?:[[selector, times],…], setup?}   a clean capture of something on the lesson page
//            (clicks are real clicks, so models build the way a student would)
// The bottom-right corner (where the studio puts the teacher) is always left empty.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const REPO=path.resolve(__dirname,'..','..');
const code=process.argv[2];if(!code){console.error('usage: node tools/sparkle/boards.js UU-LL [pic]');process.exit(1);}
const only=process.argv[3];
const V=JSON.parse(fs.readFileSync(path.join(REPO,'tools/sparkle/lessons',code,'video.json'),'utf8'));
const OUT=path.join(REPO,'assets/video/boards',code);fs.mkdirSync(OUT,{recursive:true});
const CREW={atlas:['Atlas','#1F8FB4','#E6F6FB'],felix:['Felix','#1E8C5A','#E6F7EE'],hazel:['Hazel','#B08A0A','#FDF6DC'],cora:['Cora','#C2601F','#FCEDE2'],opti:['Opti','#0E1C42','#EEF1F8']};
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const blank=s=>esc(s).replace(/_{2,}/g,'<span class="bl"></span>');
const CSS=`*{box-sizing:border-box;margin:0}body{width:1600px;height:900px;background:#FFFDF8;font-family:'Nunito','Segoe UI',Arial,sans-serif;color:#0E1C42;position:relative;overflow:hidden}
.top{position:absolute;left:0;right:0;top:0;height:14px;background:#0E1C42}.top i{position:absolute;left:0;top:0;height:14px;width:220px;background:#F5C518}
.tag{position:absolute;left:60px;top:40px;font:900 20px/1 'Nunito',Arial;letter-spacing:2px;text-transform:uppercase;color:#6B3FA0}
.ttl{position:absolute;left:60px;top:76px;width:1180px;font:900 54px/1.15 Georgia,'Lora',serif}.sub{position:absolute;left:62px;top:150px;width:1150px;font:700 26px/1.35 'Nunito',Arial;color:#3A4A6B}
.area{position:absolute;left:60px;top:215px;width:1180px;bottom:50px}
.lines{position:absolute;inset:0;background:repeating-linear-gradient(#fff0 0 69px,#E6E9F2 69px 71px)}
.corner{position:absolute;right:0;bottom:0;width:360px;height:360px}
.bar{display:flex;height:96px;border:4px solid #0E1C42;border-radius:6px;overflow:hidden;background:#fff}.bar div{flex:1;border-right:4px solid #0E1C42;display:flex;align-items:center;justify-content:center;font:800 30px 'Nunito',Arial}.bar div:last-child{border-right:0}
.brace{height:46px;border:4px solid #0E1C42;border-top:0;border-radius:0 0 24px 24px;margin-top:14px;position:relative}.brace b{position:absolute;left:50%;top:44px;transform:translateX(-50%);font:900 40px Georgia,serif;background:#FFFDF8;padding:0 14px}
.bname{font:800 24px 'Nunito',Arial;color:#3A4A6B;margin-bottom:10px}
table{border-collapse:collapse;width:760px;font:800 34px 'Nunito',Arial}th{background:#0E1C42;color:#fff;padding:12px;font-size:30px}td{border:4px solid #0E1C42;height:84px;text-align:center}
.tw{display:flex;gap:34px}.tw>div{flex:1;border:4px solid var(--c);border-radius:16px;background:var(--bg);padding:20px 24px}.tw h3{font:900 28px 'Nunito',Arial;color:var(--c);margin-bottom:6px}.tw h4{font:800 22px 'Nunito',Arial;color:#3A4A6B;margin-bottom:14px}
.tw p{font:800 30px/1.25 'Nunito',Arial;margin:14px 0;white-space:nowrap}.bl{display:inline-block;width:84px;border-bottom:4px solid #0E1C42;margin:0 6px;transform:translateY(-6px)}
.bond{position:relative;width:640px;height:420px}.bond .c{position:absolute;width:170px;height:170px;border:5px solid #0E1C42;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font:900 34px 'Nunito',Arial;text-align:center}
.say{display:flex;gap:22px;align-items:flex-start}.say .who{width:120px;height:120px;border-radius:20px;background:var(--bg);border:4px solid var(--c);display:flex;align-items:center;justify-content:center;font:900 24px 'Nunito',Arial;color:var(--c)}
.say .q{flex:1;border:4px solid #0E1C42;border-radius:18px;background:#fff;padding:24px 30px;font:800 40px/1.3 'Nunito',Arial}.fix{margin-top:40px;font:800 30px 'Nunito',Arial;color:#3A4A6B}
.pg{position:absolute;left:60px;top:150px;width:1120px;bottom:40px;display:flex;align-items:flex-start;justify-content:center}.pg img{max-width:100%;max-height:100%;border-radius:12px;box-shadow:0 6px 24px rgba(14,28,66,.18)}`;
function model(m){
  if(!m)return '<div class="lines"></div>';
  if(m.bar){const n=m.bar.parts||3,L=m.bar.labels||[];return `<div class="bname">${esc(m.bar.name||'')}</div><div class="bar" style="width:${Math.min(1080,300*n)}px">${Array.from({length:n},(_,i)=>`<div>${esc(L[i]||'')}</div>`).join('')}</div>`
    +`<div class="brace" style="width:${Math.min(1080,300*n)}px"><b>${esc(m.bar.whole||'?')}</b></div>`;}
  if(m.chart){const c=m.chart,g=c.given||[];return `<table><tr>${c.cols.map(x=>`<th>${esc(x)}</th>`).join('')}</tr>${Array.from({length:c.rows||3},(_,r)=>`<tr>${c.cols.map((_,k)=>`<td>${esc((g[r]||[])[k]||'')}</td>`).join('')}</tr>`).join('')}</table>`;}
  if(m.twoway)return `<div class="tw">${m.twoway.map(w=>{const C=CREW[w.who]||CREW.opti;return `<div style="--c:${C[1]};--bg:${C[2]}"><h3>${C[0]}'s way</h3><h4>${esc(w.title||'')}</h4>${w.lines.map(l=>`<p>${blank(l)}</p>`).join('')}</div>`;}).join('')}</div>`;
  if(m.bond){const b=m.bond;return `<div class="bond"><svg width="640" height="420" style="position:absolute;inset:0"><path d="M320 120 L150 300 M320 120 L490 300" stroke="#0E1C42" stroke-width="5"/></svg>`
    +`<div class="c" style="left:235px;top:0">${esc(b.whole||'')}</div><div class="c" style="left:65px;top:240px">${esc((b.parts||[])[0]||'')}</div><div class="c" style="left:405px;top:240px">${esc((b.parts||[])[1]||'')}</div></div>`;}
  return '<div class="lines"></div>';
}
function page(b,tag,inner){return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="top"><i></i></div>${tag?`<div class="tag">${esc(tag)}</div>`:''}${inner}<div class="corner"></div></body></html>`;}
function html(p){const b=p.board,tag=p.tag||'';
  if(b.type==='mistake'){const C=CREW[b.who]||['Sam','#C2601F','#FCEDE2'];return page(b,tag||'Spot the mistake',`<div class="ttl">${esc(b.title||'Is this right?')}</div><div class="area" style="top:190px"><div class="say" style="--c:${C[1]};--bg:${C[2]}"><div class="who">${esc(C[0])}</div><div class="q">${esc(b.say)}</div></div><div class="fix">${esc(b.fix||'Circle the mistake. Then fix it.')}</div></div>`);}
  return page(b,tag,`<div class="ttl">${b.title}</div>${b.sub?`<div class="sub">${b.sub}</div>`:''}<div class="area" style="top:${b.sub?235:180}px">${model(b.model)}</div>`);}
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:1600,height:900}});let n=0;
  const parts=Object.entries(V.slots).flatMap(([slot,S])=>(S.parts||[]).filter(x=>x.kind==='board').map(x=>({...x,slot})));
  for(const P of parts){if(only&&P.pic!==only)continue;const file=path.join(OUT,P.pic+'.png');
    if(P.board.type==='page'){
      const lp=await br.newPage({viewport:{width:1150,height:1400},deviceScaleFactor:2});await lp.route(/^https?:/,r=>r.abort());
      const lf=fs.readdirSync(REPO).find(f=>f.startsWith('math-lesson-4-'+code+'-')&&f.endsWith('.html'));
      await lp.goto('file://'+path.join(REPO,lf),{waitUntil:'domcontentloaded'});await lp.waitForTimeout(1200);
      await lp.evaluate(()=>{try{localStorage.clear();}catch(e){}document.body.classList.add('pq-clean');});
      if(P.board.tab)await lp.evaluate(t=>window.switchTab&&switchTab(t),P.board.tab);
      for(const [sel,k] of (P.board.clicks||[])){for(let i=0;i<(k||1);i++){await lp.click(sel);await lp.waitForTimeout(60);}}
      if(P.board.setup)await lp.evaluate(P.board.setup);await lp.waitForTimeout(500);
      const el=await lp.$(P.board.sel);if(!el)throw new Error(P.pic+': nothing matches '+P.board.sel);
      const shot=await el.screenshot({type:'png'});await lp.close();
      await p.setContent(page(P.board,P.tag||'On your page',`<div class="ttl">${P.board.title||''}</div><div class="pg"><img src="data:image/png;base64,${shot.toString('base64')}"></div>`));
    }else await p.setContent(html(P));
    await p.waitForTimeout(150);await p.screenshot({path:file});n++;console.log('board',P.slot,P.pic,'→',path.relative(REPO,file));}
  await br.close();console.log(n+' boards written');})().catch(e=>{console.error(e.message);process.exit(1);});
