// Playwright harness for sparkled lessons. Usage: const H=require('./harness.js'); const {b,p,errs}=await H('math-lesson-4-10-01-metric-units.html',1150,900)
// Fonts: if @fontsource packages are installed (npm i @fontsource/nunito @fontsource/lora @fontsource/dotgothic16) they are served offline; otherwise fonts are skipped.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const REPO=path.resolve(__dirname,'../../..');
function fontCSS(){const nm=[path.join(process.cwd(),'node_modules'),path.join(REPO,'node_modules'),'/home/claude/gm/node_modules'].find(d=>fs.existsSync(path.join(d,'@fontsource')));if(!nm)return '';
  const F=(fam,dir,w,st='normal')=>{const f=path.join(nm,`@fontsource/${dir}/files/${dir}-latin-${w}-${st}.woff2`);return fs.existsSync(f)?`@font-face{font-family:'${fam}';font-style:${st};font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(f).toString('base64')}) format('woff2');}`:'';};
  return [F('DotGothic16','dotgothic16',400),...[400,600,700,800,900].map(w=>F('Nunito','nunito',w)),...[400,600,700].map(w=>F('Lora','lora',w)),F('Lora','lora',400,'italic')].join('\n');}
module.exports=async function(page,vw,vh,opts={}){const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:vw,height:vh},...opts});
  const css=fontCSS();await ctx.route(/fonts\.googleapis\.com/,r=>css?r.fulfill({status:200,contentType:'text/css',body:css}):r.abort());
  await ctx.route(/youtube|gstatic|githubusercontent/,r=>r.abort());
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('ERR '+e.message+' '+(e.stack||'').split('\n').slice(1,3).join(' | ')));
  await p.goto('file://'+path.join(REPO,page)+(opts.query||''));await p.waitForTimeout(800);
  const failed=async()=>p.evaluate(()=>window.PQ_FAILED||[]);
  return {b,p,errs,failed,ctx};};
module.exports.REPO=REPO;
