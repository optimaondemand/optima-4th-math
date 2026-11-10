/* ═══ CLASSICAL GUIDE · page layer (copied from pq-layer.js, Nov 2026: no game, no coins, the guide's portraits) ═══
   Pixel Quest lessons keep pq-layer.js; lessons with CW_DATA load this file instead.
   Reads window.PQ_LESSON (the lesson's own file in assets/sparkle/lessons/). Holds no lesson content.
   - the lesson's real problem board (jobs), wallet (coins, XP, rank), gear panel
   - pixel tip-givers (.mk-tip[data-who]), models ([data-mk-model]) built from PQ_LESSON.models with OAOKit
   - clean top: 8-bit Opti on the lesson tag, standards bubble, Game/Clean switch, study music
   - Essential Question drawer (open on the first tab only), section video slots (hidden until a video exists)
   - progress for My Math Map (oao.pq.progress) */
/* Live board mode (?board=<model>): the Video Studio shows one model of this page, big, while the teacher uses it live.
   Nothing the teacher does there touches a student's saved work: storage goes to memory for this page load. */
var PQ_BOARD=(location.search.match(/[?&]board=([\w-]+)/)||[])[1]||'';
if(PQ_BOARD){(function(){var mem={},P=Storage.prototype,g=P.getItem,st=P.setItem,rm=P.removeItem;
  P.getItem=function(k){return Object.prototype.hasOwnProperty.call(mem,k)?mem[k]:(k==='oao.pq.mute'?g.call(this,k):null);};
  P.setItem=function(k,v){mem[k]=String(v);};P.removeItem=function(k){delete mem[k];};})();
  document.documentElement.classList.add('pq-boardmode');}
var PQM = (function(){
'use strict';
var L, W, S, pouch, panel;
var KEY='oao.pq.wallet', PKEY='oao.pq.progress';
var RANKS=[[0,'Rookie'],[40,'Scout'],[100,'Pathfinder'],[200,'Trailblazer'],[350,'Navigator'],[550,'Wayfinder'],[800,'Master Wayfinder']];
function ls(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function $(s,r){return (r||document).querySelector(s);} function $$(s,r){return [].slice.call((r||document).querySelectorAll(s));}
function el(h){var d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function fmt(n){return Number(n).toLocaleString('en-US');}
function fail(what,e){console.error(what,e);(window.PQ_FAILED=window.PQ_FAILED||[]).push(what+': '+(e&&e.message||e));}
function clean(){return document.body.classList.contains('pq-clean');}

/* sounds (WebAudio, no files, respects mute) */
function audio(){try{return window.__mkAC||(window.__mkAC=new (window.AudioContext||window.webkitAudioContext)());}catch(e){return null;}}
function beep(fs,type,v,d){if(ls('oao.pq.mute',false))return;var a=audio();if(!a)return;fs.forEach(function(f,i){var o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=f;var s=a.currentTime+i*0.07;g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(0.0001,s+d);o.connect(g);g.connect(a.destination);o.start(s);o.stop(s+d+0.02);});}
function ding(){beep([988,1319],'square',0.03,0.12);}

/* ───────── wallet ───────── */
function rankOf(xp){var r=RANKS[0],nx=null;for(var i=0;i<RANKS.length;i++){if(xp>=RANKS[i][0]){r=RANKS[i];nx=RANKS[i+1]||null;}}return {name:r[1],min:r[0],next:nx};}
function earn(key,coins,xp,src,label){return true; /* no coins or XP in the classical layer */
  key=L.id+':'+key;
  if(W.earned[key])return false;W.earned[key]=1;
  var before=rankOf(W.xp).name;W.coins+=coins||0;W.xp+=xp||0;lsSet(KEY,W);
  if(clean()){renderPouch(false);return true;}
  var r=src&&src.getBoundingClientRect?src.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0,height:0};
  if(coins)flyCoins(r,coins);ding();
  toast(r,(coins?'+'+coins+' 🪙 ':'')+(xp?'+'+xp+' XP ':'')+(label?'<span>'+label+'</span>':''));
  setTimeout(function(){renderPouch(true);var after=rankOf(W.xp).name;if(after!==before)toast({left:innerWidth/2-90,top:innerHeight/3,width:0},'⬆ NEW RANK: <b>'+after.toUpperCase()+'</b>');},900);
  if(window.PQ&&PQ._hud)PQ._hud();
  return true;
}
function spend(n){if(W.coins<n)return false;W.coins-=n;lsSet(KEY,W);renderPouch(true);if(window.PQ&&PQ._hud)PQ._hud();return true;}
function flyCoins(r,n){if(!pouch)return;var p=pouch.getBoundingClientRect();n=Math.min(6,n||1);
  for(var i=0;i<n;i++)(function(i){var c=el('<div class="mk-fly">🪙</div>');c.style.left=(r.left+r.width/2)+'px';c.style.top=(r.top+10)+'px';document.body.appendChild(c);
    setTimeout(function(){c.style.left=(p.left+p.width/2)+'px';c.style.top=(p.top+p.height/2)+'px';c.style.opacity='0.2';},30+i*70);setTimeout(function(){c.remove();},950+i*70);})(i);}
function toast(r,html){var t=el('<div class="mk-toast">'+html+'</div>');document.body.appendChild(t);var x=Math.min(innerWidth-260,Math.max(8,r.left+(r.width||0)/2-80));t.style.left=x+'px';t.style.top=Math.max(8,r.top+8)+'px';setTimeout(function(){t.remove();},1900);}
var COIN='<svg class="mk-coinsvg" viewBox="0 0 10 10" shape-rendering="crispEdges"><path fill="#3B2417" d="M3 0h4v1h1v1h1v1h1v4h-1v1h-1v1h-1v1H3v-1H2V8H1V7H0V3h1V2h1V1h1z"/><path fill="#F5C518" d="M3 1h4v1h1v1h1v4H8v1H7v1H3V8H2V7H1V3h1V2h1z"/><path fill="#FFF3B0" d="M3 2h2v1H4v2H3V3h0z"/><path fill="#C9A20F" d="M5 3h1v4H5z"/></svg>';
function renderPouch(bump){if(!pouch)return;
  var rk=rankOf(W.xp),pct=rk.next?Math.round((W.xp-rk.min)/(rk.next[0]-rk.min)*100):100;
  pouch.innerHTML='<span class="coin">'+COIN+'<span>'+W.coins+'</span></span><span class="xpw"><span class="rank">⭐ '+rk.name+' · '+W.xp+' XP</span><span class="bar"><i style="width:'+pct+'%"></i></span></span>';
  if(bump){pouch.classList.remove('bump');void pouch.offsetWidth;pouch.classList.add('bump');}
  if(panel&&panel.classList.contains('on'))renderPanel();
}
function renderPanel(){
  var rk=rankOf(W.xp),J=L.jobs||[];var jobs=J.map(function(j){return '<li>'+(jobDone(j.id)?'✅ ':'⬜ ')+j.t+'</li>';}).join('');
  panel.innerHTML='<button class="x" aria-label="Close">✕</button><h4>Your explorer pack</h4>'+
   '<div><b>'+W.coins+'</b> coins · <b>'+W.xp+'</b> XP · rank <b>'+rk.name+'</b>'+(rk.next?' ('+(rk.next[0]-W.xp)+' XP to '+rk.next[1]+')':'')+'</div>'+
   '<div class="ranks">'+RANKS.map(function(r){return '<span class="'+(W.xp>=r[0]?'on':'')+'">'+r[1]+'</span>';}).join('')+'</div>'+
   (J.length?'<b>'+esc((L.problem&&L.problem.jobsTitle)||'Today\'s jobs')+'</b><ul>'+jobs+'</ul>':'')+
   '<p style="margin-top:8px">Earn coins with correct work on the page. Earn XP by writing your thinking and watching your teacher. Spend coins in the game shop. Your rank carries over to every lesson.</p>'+
   '<p style="margin-top:6px"><a href="my-math-map.html" target="_blank" rel="noopener">🗺️ Open My Math Map</a> to see every level and print certificates.</p>';
  panel.querySelector('.x').onclick=function(){panel.classList.remove('on');};
}

/* ───────── progress for My Math Map ───────── */
function progress(){var P=ls(PKEY,{})||{};P.lessons=P.lessons||{};var me=P.lessons[L.id]=P.lessons[L.id]||{};
  me.title=L.title;me.unit=L.unit;me.level=L.level||'';me.seen=me.seen||Date.now();me.last=Date.now();
  me.jobs=(L.jobs||[]).filter(function(j){return jobDone(j.id);}).length;me.of=(L.jobs||[]).length;
  if(me.of&&me.jobs===me.of&&!me.done)me.done=Date.now();
  if(L.boss&&S&&S.world&&S.world[L.boss]&&!me.boss)me.boss=Date.now();
  lsSet(PKEY,P);}
function markDone(){var P=ls(PKEY,{})||{};P.lessons=P.lessons||{};var me=P.lessons[L.id]=P.lessons[L.id]||{};if(!me.done){me.done=Date.now();lsSet(PKEY,P);}}

/* ───────── the lesson's real problem: jobs ───────── */
function jobDone(id){if(!S)S=ls(L.key+'-world',null)||{world:{}};return !!(S.world.jobs&&S.world.jobs[id]);}
function setJob(id,src){S.world.jobs=S.world.jobs||{};if(S.world.jobs[id])return;S.world.jobs[id]=1;lsSet(L.key+'-world',S);
  var j=(L.jobs||[]).filter(function(z){return z.id===id;})[0]||{coins:5};earn('job-'+id,j.coins,5,src||$('.mk-board'),(L.problem&&L.problem.jobWord||'Job')+' done!');renderBoard();progress();}
function renderBoard(){
  var J=L.jobs||[],P=L.problem||{};if(!J.length)return;
  var n=J.filter(function(j){return jobDone(j.id);}).length,scene=L.scene?L.scene(api):'';
  $$('.mk-board-mount').forEach(function(m){
    m.innerHTML='<div class="mk-board"><div class="mk-board-top"><div class="mk-bt"><div class="mk-q">📜 TODAY\'S PROBLEM · '+n+' of '+J.length+' jobs done</div><h3>'+P.title+'</h3><p>'+P.text+'</p></div>'+(scene?'<div class="mk-stand-wrap">'+scene+'</div>':'')+'</div>'+
      '<div class="mk-jobs">'+J.map(function(j,i){return '<div class="mk-job'+(jobDone(j.id)?' done':'')+'" style="--r:'+(j.r||((i%2?1:-1)*(1+i%3*0.5))+'deg')+'"><span class="n">JOB '+(i+1)+'</span><b>'+j.t+'</b><span class="w">'+j.w+'</span>'+(jobDone(j.id)?'<span class="stamp">DONE</span><span class="ok-sr"> (done)</span>':'')+'</div>';}).join('')+'</div></div>';
  });
  $$('.mk-stand-mount').forEach(function(m){m.innerHTML=scene;});
  // job notes are the plan only: no links that let students skip ahead (Bethany, 28 Oct 2026)
}

/* ───────── pixel tip-givers on the page ───────── */
/* the Math Crew keep their original 8-bit Pixel Quest sprites (Bethany, Nov 2026); the guide's cast uses the window portraits */
var CREWLOOK={atlas:{skin:['#EBC09A','#CF9A6F'],hair:['#5A3A22','#3E2716'],style:'short',shirt:'#55C8E8',acc:'hat',acc2:'#D8B575'},
  felix:{skin:['#9C6640','#7C4C2C'],hair:['#1E1E28','#0E0E16'],style:'spiky',shirt:'#2DB87A',acc:'goggles'},
  hazel:{skin:['#F6D3B3','#E2AE88'],hair:['#C4512E','#963A1E'],style:'long',shirt:'#F5C518',acc:'beret',acc2:'#C93A4A'},
  cora:{skin:['#C98E5E','#A86E42'],hair:['#2A1D18','#160E0A'],style:'puffs',shirt:'#E07B39',acc:'glasses',frame:'#5B2E10'}};
function sprite(who){var c=document.createElement('canvas');
  if(CREWLOOK[who]&&window.PQART){c.width=16;c.height=20;c.className='cw-crew8';var x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(PQART.buildChar(CREWLOOK[who]),0,0,16,20,0,0,16,20);return c;}
  c.width=24;c.height=24;if(window.CWART&&CWART.names[who])CWART.portrait(c,who,0);return c;}
function tips(){
  $$('.bubble').forEach(function(b){var who=['atlas','felix','hazel','cora'].filter(function(w){return b.classList.contains(w);})[0],av=b.querySelector('.bubble-avatar');if(!who||!av||av.dataset.done)return;av.dataset.done=1;av.textContent='';var c=sprite(who);c.setAttribute('aria-hidden','true');av.appendChild(c);});
  $$('.cw-face').forEach(function(f){if(f.firstChild)return;var c=sprite(f.dataset.who);c.setAttribute('aria-hidden','true');f.appendChild(c);});
  $$('.mk-tip').forEach(function(t){if(t.dataset.done)return;t.dataset.done=1;var who=t.dataset.who;var sp={name:(CWART.names[who]||''),color:(CWART.colors[who]||'#3B2417')};
    var txt=t.innerHTML;t.innerHTML='';var cv=sprite(who);cv.className='mk-tip-sprite';cv.setAttribute('aria-hidden','true');
    var b=el('<div class="mk-tip-bubble"><span class="mk-tip-name" style="background:'+(sp.color||'#3B2417')+'">'+(sp.name||'')+'</span><span class="mk-tip-txt">'+txt+'</span></div>');
    t.appendChild(cv);t.appendChild(b);});
}

/* ───────── hooks: page work → coins & XP ───────── */
function hooks(){
  if(window.fluencyCheck){var f0=window.fluencyCheck;window.fluencyCheck=function(){f0.apply(this,arguments);var n=$$('#fluencyGrid .fluency-correct').length;if(n)earn('fluency',n,0,document.getElementById('fluencyResult'),n+' facts right');};}
  $$('.flip-card').forEach(function(c,i){c.addEventListener('click',function(){earn('flip-'+i,0,2,c,'new word');});});
  $$('textarea.journal-box').forEach(function(t){if(t.readOnly)return;function chk(){var w=(t.value.trim().match(/\S+/g)||[]).length;if(w>=8)earn('write-'+t.id,0,6,t,'for writing your thinking');}t.addEventListener('input',chk);});
  $$('.turn-in-item').forEach(function(it){it.addEventListener('click',function(){setTimeout(function(){if($$('.turn-in-item').every(function(z){return z.classList.contains('checked');})){earn('checklist',10,10,it,'Lesson turned in!');markDone();}},50);});});
}

/* ───────── models ───────── */
var api;
function models(){
  var M=L.models||{};
  $$('[data-mk-model]').forEach(function(m){var name=m.dataset.mkModel;if(!M[name]){fail('model '+name,'not in PQ_LESSON.models');return;}try{M[name](m,api);}catch(e){fail('model '+name,e);}});
}

/* ───────── clean top ───────── */
function header(){
  var ic=$('.header-badge-icon');
  if(ic&&window.PQART){var c=document.createElement('canvas');c.width=16;c.height=20;c.className='pq-opti-badge';c.setAttribute('aria-hidden','true');
    var x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(PQART.buildOwl(),0,0,16,20,0,0,16,20);ic.textContent='';ic.appendChild(c);}
  var badge=$('.header-badge');if(!badge)return;
  var row=document.createElement('div');row.className='pq-hdr-row';badge.parentNode.insertBefore(row,badge);row.appendChild(badge);
  var tools=document.createElement('div');tools.className='pq-hdr-tools';row.appendChild(tools);
  var sp=$('.standards-panel');
  if(sp){var std=document.createElement('button');std.type='button';std.className='pq-pill';std.setAttribute('aria-expanded','false');
    var code=L.standard||(($('.standards-panel .standards-code, .standards-panel .std-code')||{}).textContent)||'Standards';
    std.innerHTML='Standards · '+esc(code)+' <span aria-hidden="true">▾</span>';
    std.onclick=function(){var on=!sp.classList.contains('open');sp.classList.toggle('open',on);std.setAttribute('aria-expanded',on);};tools.appendChild(std);}
  if(window.CW_DATA){var mode=document.createElement('button');mode.type='button';mode.className='pq-pill pq-mode';tools.appendChild(mode);
    var paint=function(){var c=clean();mode.innerHTML=c?'🎬 Workshop windows <b>OFF</b>':'🎬 Workshop windows <b>ON</b>';mode.title=c?'Show the workshop windows again':'Hide the workshop windows: just the lesson';mode.setAttribute('aria-pressed',c);};
    mode.onclick=function(){setClean(!clean());paint();};paint();}
  var ra=document.getElementById('optima-read-aloud');
  if(ra){var hdr=$('.header'),strip=$('.pq-town-strip');var after=strip||hdr;if(after)after.parentNode.insertBefore(ra,after.nextSibling);  // opens right under the header
    ra.classList.add('pq-ra','pq-ra-closed');
    var rb=document.createElement('button');rb.type='button';rb.className='pq-pill pq-ra-btn';rb.setAttribute('aria-expanded','false');rb.setAttribute('aria-controls','optima-read-aloud');
    rb.innerHTML='🔊 Read aloud <span aria-hidden="true">▾</span>';rb.title='Open the read-aloud player';
    rb.onclick=function(){var on=ra.classList.contains('pq-ra-closed');ra.classList.toggle('pq-ra-closed',!on);rb.setAttribute('aria-expanded',on);
      rb.title=on?'Close the read-aloud player':'Open the read-aloud player';if(on){var pb=document.getElementById('ora-play');if(pb&&!pb.disabled)pb.focus();}};
    tools.insertBefore(rb,tools.firstChild);}
  if(window.PQMusic)PQMusic.mount(tools);
}
function setClean(on){
  document.body.classList.toggle('pq-clean',on);lsSet('oao.pq.clean',on);
  if(on&&window.PQ&&PQ._stop)try{PQ._stop();}catch(e){}
  renderBoard();
}
/* Essential Question + objectives: open on the first tab, a drawer on the others */
function drawer(){
  var d=$('details.pq-intro');if(!d)return;var first=($('.tab-btn')||{dataset:{}}).dataset.tab||'warmup';
  function onTab(t){d.open=(t===first);}
  var sw=window.switchTab;if(sw)window.switchTab=function(t){onTab(t);return sw.apply(this,arguments);};
  onTab(($('.tab-btn.active')||{dataset:{tab:first}}).dataset.tab);
}
/* section video slots: invisible until a video exists (?review shows the empty slots with their scripts) */
var V,REVIEW=/[?&]review\b/.test(location.search),MAN=null,wait=[];
function manifest(cb){if(MAN)return cb(MAN);wait.push(cb);if(wait.length>1)return;
  var urls=['video-manifest.json','https://raw.githubusercontent.com/optimaondemand/optima-4th-math/main/video-manifest.json'];
  (function next(i){if(i>=urls.length){MAN={};wait.forEach(function(f){f(MAN);});return;}
    try{fetch(urls[i]+'?v='+Date.now()).then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(j){MAN=j.videos||j;wait.forEach(function(f){f(MAN);});}).catch(function(){next(i+1);});}catch(e){next(i+1);}})(0);}
function probe(url,cb){var done=false;function fin(ok){if(!done){done=true;cb(ok);}}
  if(location.protocol==='file:'||!window.fetch){var v=document.createElement('video');v.preload='metadata';v.onloadedmetadata=function(){fin(true);};v.onerror=function(){fin(false);};setTimeout(function(){fin(false);},20000);v.src=url;return;}
  fetch(url,{method:'HEAD',cache:'no-cache'}).then(function(r){fin(r.ok);}).catch(function(){fin(false);});}
function slots(){
  V=window.PQ_VIDEO||{slots:{}};var pre=V.prefix,mk=V.manifestKey||pre,off=V.off||[];
  $$('.pq-vslot').forEach(function(box){
    var id=box.dataset.slot,info=V.slots[id]||{},title=info.title||id;
    box.innerHTML='<div class="pq-vhead"><span>▶ '+esc(title)+'</span></div><div class="pq-vbody"></div>';
    var body=$('.pq-vbody',box);
    function show(node){box.classList.add('has');body.innerHTML='';body.appendChild(node);}
    function reviewOnly(){if(!REVIEW)return;box.classList.add('review');
      body.innerHTML='<div class="pq-vreview"><b>🎥 Empty slot (only you see this with ?review)</b> · '+esc(pre+'-'+id)+' · '+esc(info.length||'')+(info.screen?' · screen recording':'')+'<div>'+esc((info.script||'').replace(/\[ON SCREEN:[^\]]*\]\s*/g,'')).replace(/\n\n/g,'<br>')+'</div></div>';}
    if(off.indexOf(id)>=0)return reviewOnly();
    var file='assets/video/teacher/'+pre+'-'+id+'.mp4';
    probe(file,function(ok){
      if(ok){var v=document.createElement('video');v.controls=true;v.playsInline=true;v.preload='metadata';v.poster=file.replace(/\.mp4$/,'.jpg');v.src=file;
        var tr=document.createElement('track');tr.kind='captions';tr.srclang='en';tr.label='English';tr.src=file.replace(/\.mp4$/,'.vtt');v.appendChild(tr);
        v.addEventListener('play',function(){earn('video-'+id,0,10,box,'for watching your teacher');});show(v);return;}
      manifest(function(m){var e=m[mk+'-'+id]||(V.welcomeSlot===id?m[mk]:null);if(!e||e.status!=='ready'||!e.embed)return reviewOnly();
        var t=document.createElement('div');t.innerHTML=e.embed;var f=t.querySelector('iframe');if(!f)return reviewOnly();
        f.removeAttribute('width');f.removeAttribute('height');f.style.cssText='display:block;width:100%;aspect-ratio:16/9;border:0;border-radius:10px;';show(f);});
    });
  });
  window.addEventListener('blur',function(){setTimeout(function(){var a=document.activeElement;if(a&&a.tagName==='IFRAME'){var b=a.closest('.pq-vslot');if(b)earn('video-'+b.dataset.slot,0,10,b,'for watching your teacher');}},0);});
}


/* ───────── helpers students can choose (the social studies set) ───────── */
/* 1. "Need a hint?" ladder: PQ_LESSON.hints = [{sel, i, rungs:[nudge, where to look, a start with different numbers]}] */
function hints(){
  (L.hints||[]).forEach(function(h,k){var c=$$(h.sel);if(h.text)c=c.filter(function(e){return e.textContent.indexOf(h.text)>=0;});var t=c[h.i||0];if(!t){fail('hint '+k,'no element '+h.sel+' #'+(h.i||0));return;}
    var box=el('<div class="pq-hint" data-hint="'+k+'"><button type="button" class="pq-hint-btn">💡 Need a hint?</button><ol class="pq-hint-list" aria-live="polite"></ol></div>');
    var at=h.after?$(h.after,t)||t:t;if(h.inside)at.appendChild(box);else at.parentNode.insertBefore(box,at.nextSibling);
    var n=0,btn=$('.pq-hint-btn',box),list=$('.pq-hint-list',box),R=h.rungs;
    btn.onclick=function(){if(n>=R.length)return;list.insertAdjacentHTML('beforeend','<li><b>Hint '+(n+1)+' of '+R.length+'.</b> '+R[n]+'</li>');n++;
      btn.textContent=n<R.length?'💡 Another hint':'That\'s every hint';btn.disabled=n>=R.length;};
  });
}
/* 2. writing help: PQ_LESSON.writing = {'<textarea id>': {min:10, chips:[{label, words:[…]}]}} → live word counter + "Your answer needs" chips */
function norm(t){return ' '+String(t||'').toLowerCase().replace(/(\d),(?=\d{3})/g,'$1').replace(/[’']/g,"'").replace(/\s+/g,' ')+' ';}
function hit(text,w){w=norm(w).trim();if(!w)return false;var esc2=w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp('(^|[^a-z0-9])'+esc2+'(?=[^a-z0-9]|$)').test(text);}
function writing(){
  var Wr=L.writing||{};Object.keys(Wr).forEach(function(id){var t=document.getElementById(id),cfg=Wr[id];if(!t){fail('writing','no box #'+id);return;}
    var ui=el('<div class="pq-write"><span class="pq-count"></span>'+(cfg.chips&&cfg.chips.length?'<span class="pq-needs">Remember to tell:</span>'+cfg.chips.map(function(c,i){return '<span class="pq-chip" data-i="'+i+'">'+esc(c.label)+'</span>';}).join(''):'')+'</div>');
    t.parentNode.insertBefore(ui,t.nextSibling);
    function upd(){var v=t.value,n=(v.trim().match(/\S+/g)||[]).length,txt=norm(v),min=cfg.min||8;
      var c=$('.pq-count',ui);c.textContent='📝 '+Math.min(n,min)+' of '+min+' words'+(n>=min?' ✓':n?'. Keep going…':'');c.classList.toggle('met',n>=min);
      $$('.pq-chip',ui).forEach(function(ch){var C=cfg.chips[+ch.dataset.i];ch.classList.toggle('on',C.words.some(function(w){return hit(txt,w);}));});}
    t.addEventListener('input',upd);setTimeout(upd,300);
  });
}
/* 3. new words defined in the sentence, the first time a student meets them: PQ_LESSON.words = [{w, d}] (reading order) */
var SKIP='script,style,textarea,input,button,select,svg,canvas,summary,.pq-slot,.pq-vslot,.mk-board-mount,[data-mk-model],.flip-card,.pq-def,.mk-tip-name,.header,.standards-panel,.gathered-box,.turn-in-card,.pq-hint,.pq-write';
function defTip(sp){var tip=$('.pq-def-m',sp);
  // the tooltip floats on <body> while it is open (position:fixed), so no card edge or scroll box can clip it;
  // it sits above the word, or below when there is no room, and stays inside the window
  function place(){var r=sp.getBoundingClientRect(),vw=document.documentElement.clientWidth,vh=window.innerHeight;
    tip.style.left='0px';tip.style.top='0px';var t=tip.getBoundingClientRect(),w=t.width,h=t.height,cx=r.left+r.width/2;
    var x=Math.max(8,Math.min(vw-8-w,cx-w/2)),below=r.top-h-12<8,y=below?r.bottom+10:r.top-h-10;
    if(below&&y+h>vh-8)y=Math.max(8,vh-8-h);
    tip.style.left=x+'px';tip.style.top=y+'px';tip.classList.toggle('below',below);tip.style.setProperty('--ax',(cx-x)+'px');}
  var at=0;
  function open(on){var was=sp.classList.contains('open');if(on&&!was)at=Date.now();sp.classList.toggle('open',on);sp.setAttribute('aria-expanded',on?'true':'false');
    if(on){if(tip.parentNode!==document.body)document.body.appendChild(tip);tip.classList.add('pq-tip-on');place();}
    else{tip.classList.remove('pq-tip-on');if(tip.parentNode!==sp)sp.appendChild(tip);}}
  sp.addEventListener('mouseenter',function(){open(true);});sp.addEventListener('mouseleave',function(){if(document.activeElement!==sp)open(false);});
  sp.addEventListener('focus',function(){open(true);});sp.addEventListener('blur',function(){open(false);});
  sp.addEventListener('click',function(e){e.preventDefault();if(Date.now()-at<400)return;open(!sp.classList.contains('open'));}); // a tap opens it (focus) and doesn't close it again
  sp.addEventListener('keydown',function(e){if(e.key==='Escape'){open(false);sp.blur();}if(e.key==='Enter'||e.key===' '){e.preventDefault();open(!sp.classList.contains('open'));}});
  window.addEventListener('scroll',function(){if(sp.classList.contains('open'))place();},{passive:true});
}
function defineWords(){
  var root=$('.tab-panel')?$('.tab-panel').parentNode:document.body,scope=$$('.tab-panel');
  (L.words||[]).forEach(function(W){
    var re=new RegExp('\\b('+W.w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')\\b','i'),done=false;
    scope.forEach(function(sc){if(done)return;
      var tw=document.createTreeWalker(sc,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentElement;return p&&!p.closest(SKIP)&&re.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
      var n=tw.nextNode();if(!n)return;done=true;var m=n.nodeValue.match(re),i=n.nodeValue.search(re);
      var after=n.splitText(i);after.nodeValue=after.nodeValue.slice(m[1].length);
      // the meaning is a tooltip (hover, keyboard focus, or a tap on touch screens), so the sentence stays easy to read
      var span=el('<span class="pq-def" tabindex="0" role="button" aria-expanded="false"><b>'+esc(m[1])+'</b><span class="pq-def-m" role="tooltip">'+esc(W.d)+'</span></span>');
      n.parentNode.insertBefore(span,after);defTip(span);});
    if(!done)fail('word','"'+W.w+'" not found on the page');
  });
  // the journal lists the words
  // the journal opens with the lesson's big idea (PQ_LESSON.bigIdea) and ends with the words
  var g=window.gatherAnswers;if(g&&((L.words||[]).length||L.bigIdea))window.gatherAnswers=function(){var r=g.apply(this,arguments);var o=document.getElementById('gatheredOutput');
    if(o&&L.bigIdea){var v=o.value,k=v.indexOf('\n');o.value=(k<0?v+'\n':v.slice(0,k+1))+'\nToday\'s big idea\n'+L.bigIdea+'\n'+(k<0?'':v.slice(k+1));}
    if(o&&(L.words||[]).length)o.value+='\nWords I learned today\n'+L.words.map(function(W){return '• '+W.w+': '+W.d;}).join('\n')+'\n';return r;};
}

/* show only one model, scaled to fill the window (the studio films this) */
function boardMode(){
  document.body.classList.add('pq-clean');
  var m=document.querySelector('[data-mk-model="'+PQ_BOARD+'"]');if(!m){fail('board mode','no model "'+PQ_BOARD+'"');return;}
  var host=document.createElement('div');host.id='pq-boardhost';var inner=document.createElement('div');inner.id='pq-boardin';
  host.appendChild(inner);document.body.appendChild(host);inner.appendChild(m);
  var css=document.createElement('style');css.textContent='html.pq-boardmode body>*:not(#pq-boardhost){display:none!important}'
    +'html.pq-boardmode,html.pq-boardmode body{margin:0;height:100%;overflow:hidden;background:#FFFDF8}'
    +'#pq-boardhost{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#FFFDF8}'
    +'#pq-boardin{width:1040px;padding:18px 22px;background:#fff;border-radius:16px}';
  document.head.appendChild(css);
  function fit(){inner.style.zoom=1;var w=inner.offsetWidth,h=inner.offsetHeight,z=Math.min((innerWidth-24)/w,(innerHeight-24)/h);inner.style.zoom=Math.max(.3,z);}
  fit();addEventListener('resize',fit);new MutationObserver(function(){clearTimeout(fit.t);fit.t=setTimeout(fit,60);}).observe(inner,{childList:true,subtree:true});
}

function init(){
  L=window.PQ_LESSON;if(!L){fail('layer','no PQ_LESSON');return;}
  if(ls('oao.pq.clean',false))document.body.classList.add('pq-clean');
  S=ls(L.key+'-world',null)||{world:{}};S.world=S.world||{};S.world.jobs=S.world.jobs||{};
  W=ls(KEY,null)||{coins:0,xp:0,gear:{},wear:{},earned:{}};W.gear=W.gear||{};W.wear=W.wear||{};W.earned=W.earned||{};
  api={earn:earn,setJob:setJob,jobDone:jobDone,state:function(){return S;},save:function(){lsSet(L.key+'-world',S);},fmt:fmt,ls:ls,lsSet:lsSet,clean:clean,renderBoard:renderBoard,progress:progress,key:function(k){return L.key+'-'+k;}};
  try{header();}catch(e){fail('header',e);}
  try{drawer();}catch(e){fail('drawer',e);}
  try{slots();}catch(e){fail('slots',e);}
  renderPouch(false);try{renderBoard();}catch(e){fail('board',e);}
  try{tips();}catch(e){fail('tips',e);}
  models();hooks();progress();
  try{defineWords();}catch(e){fail('words',e);}
  try{hints();}catch(e){fail('hints',e);}
  if(PQ_BOARD)try{boardMode();}catch(e){fail('board mode',e);}
  try{writing();}catch(e){fail('writing',e);}
}
return {init:init,earn:earn,spend:spend,wallet:function(){return W;},saveWallet:function(){lsSet(KEY,W);renderPouch(true);},jobDone:jobDone,setJob:setJob,renderBoard:renderBoard,rankOf:rankOf,setClean:setClean,progress:progress};
})();

/* Flow fix (Oct 28 2026, parent feedback): remember the open tab, so a
   Canvas reload (after Submit) reopens where the student was instead of
   on the first tab. One key per lesson page. */
(function () {
  var KEY = 'oao-tab-' + location.pathname;
  function put(v) { try { localStorage.setItem(KEY, v); } catch (e) { try { sessionStorage.setItem(KEY, v); } catch (e2) {} } }
  function get() { try { return localStorage.getItem(KEY); } catch (e) { try { return sessionStorage.getItem(KEY); } catch (e2) { return null; } } }
  function tabIdOf(b) {
    return b.getAttribute('data-tab') || (b.id || '').replace(/^btn-/, '') ||
      ((b.getAttribute('onclick') || '').match(/switchTab\(\s*['"]([\w-]+)/) || [])[1] || '';
  }
  function hook() {
    var cur = window.switchTab;
    if (typeof cur !== 'function' || cur._remembers) return;
    var wrapped = function (id) { var r = cur.apply(this, arguments); put(id); return r; };
    wrapped._remembers = true;
    window.switchTab = wrapped;
    var b = document.querySelector('.tab-btn'), first = b ? tabIdOf(b) : '', last = get();
    if (!last || last === first) return;
    if (!document.getElementById('tab-' + last) && !document.getElementById('panel-' + last)) return;
    setTimeout(function () {                 /* after the page's own layers have set up */
      var sT = window.scrollTo, sIV = Element.prototype.scrollIntoView;
      window.scrollTo = function () {}; Element.prototype.scrollIntoView = function () {};  /* no jump on restore */
      try { window.switchTab(last); } catch (e) {}
      window.scrollTo = sT; Element.prototype.scrollIntoView = sIV;
    }, 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook);
  else hook();
})();

/* Learn stations (Bethany, 3 Nov 2026: the Learn tab felt like a scroll marathon).
   A path bar of titled steps; one station shows at a time; "Next station" at the
   bottom of each; the page remembers the open station. CW_SHOWSTATION(el) opens
   the station holding el (used by window go-buttons and hints). */
(function () {
  var KEY = 'cw-st-' + location.pathname;
  function setup() {
    var S = [].slice.call(document.querySelectorAll('.cw-station'));
    if (!S.length) return;
    var host = S[0].parentNode, N = S.length;
    var after = [].slice.call(host.children).filter(function (c) { return c.classList.contains('tab-next-wrap'); });
    var bar = document.createElement('nav');
    bar.className = 'cw-path'; bar.setAttribute('aria-label', 'Learn stations');
    bar.innerHTML = S.map(function (s, i) {
      return '<button type="button" class="cw-path-b" data-i="' + i + '"><span class="cw-path-n">' + (i + 1) +
        '</span><span class="cw-path-t"><b>' + s.dataset.title + '</b><small>' + s.dataset.sub + '</small></span></button>';
    }).join('<span class="cw-path-ar" aria-hidden="true">→</span>');
    host.insertBefore(bar, S[0]);
    var B = [].slice.call(bar.querySelectorAll('.cw-path-b'));
    S.forEach(function (s, i) {
      s.insertAdjacentHTML('afterbegin', '<div class="cw-st-head"><span>Station ' + (i + 1) + ' of ' + N + '</span> ' + s.dataset.title + '</div>');
      if (i < N - 1) {
        var w = document.createElement('div'); w.className = 'cw-st-next';
        w.innerHTML = '<p>Done with this station?</p><button type="button" class="tab-next-btn">Next station: ' + S[i + 1].dataset.title + ' →</button>';
        w.querySelector('button').onclick = function () { show(i + 1, true); };
        s.appendChild(w);
      }
    });
    var seen = {};
    function show(i, scroll) {
      S.forEach(function (s, k) { s.hidden = k !== i; });
      seen[i] = 1;
      B.forEach(function (b, k) {
        b.classList.toggle('on', k === i); b.classList.toggle('seen', !!seen[k] && k !== i);
        if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      after.forEach(function (a) { a.hidden = i < N - 1; });
      try { localStorage.setItem(KEY, String(i)); } catch (e) {}
      if (scroll) bar.scrollIntoView({ block: 'start', behavior: 'smooth' });
      try { window.dispatchEvent(new Event('resize')); } catch (e) {}
    }
    B.forEach(function (b, k) { b.onclick = function () { show(k, true); }; });
    window.CW_SHOWSTATION = function (el) {
      var s = el && el.closest && el.closest('.cw-station'); if (!s) return;
      var i = S.indexOf(s); if (i >= 0 && s.hidden) show(i, false);
    };
    var last = 0; try { last = parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) {}
    if (last < 0 || last >= N) last = 0;
    for (var k = 0; k < last; k++) seen[k] = 1;
    show(last, false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
})();

/* "Try a tool" buttons sit beside "Need a hint?" on the problem they help with, so help lives in one row */
(function () {
  function move() {
    [].slice.call(document.querySelectorAll('.cw-nudge')).forEach(function (n) {
      var nx = n.nextElementSibling, host = (nx && nx.querySelector && nx.querySelector('.pq-hint')) ? nx : n.closest('.activity, .q-block');
      var h = host && host.querySelector('.pq-hint'); if (!h) return;
      var a = n.querySelector('.cw-tool'); if (!a) return;
      h.classList.add('cw-help'); h.insertBefore(a, h.querySelector('.pq-hint-list')); n.remove();
    });
  }
  /* one card shape (Bethany, 3 Nov 2026: crowded cards, too much to sift through):
     job box (with its steps inside) → the work → one quiet help row (hint · tool · Crew tip) → writing */
  function tidy() {
    [].slice.call(document.querySelectorAll('.activity-body')).forEach(function (body) {
      var kids = function (sel) { return [].slice.call(body.children).filter(function (c) { return c.matches(sel); }); };
      var job = kids('.task-box')[0], todo = kids('.mk-todo')[0];
      if (job && todo) { todo.classList.add('cw-in-job'); job.appendChild(todo); }
      if (!job) return;   /* only job cards get the help row; tips on other cards stay where they are (Bethany, 3 Nov 2026) */
      var hint = kids('.pq-hint')[0], loose = kids('.cw-nudge'), tipsHere = kids('.mk-tip');
      if (!hint && !loose.length && !tipsHere.length) return;
      var row = hint || document.createElement('div'), list = hint ? hint.querySelector('.pq-hint-list') : null;
      row.classList.add('cw-helprow');
      body.insertBefore(row, kids('.journal-label')[0] || null);       /* after the work, before the writing */
      var add = function (el) { row.insertBefore(el, list); };
      loose.forEach(function (n) { var a = n.querySelector('.cw-tool'); if (a) add(a); n.remove(); });
      var after = row;
      tipsHere.forEach(function (t) {
        var who = (t.querySelector('.mk-tip-name') || {}).textContent || 'A friend';
        var b = document.createElement('button'); b.type = 'button'; b.className = 'cw-tipbtn';
        var col = window.CWART && CWART.colors && CWART.colors[t.getAttribute('data-who')]; if (col) { b.style.setProperty('--who', col); b.classList.add('cw-who'); }   /* the tip-giver's own color, softly */
        b.setAttribute('aria-expanded', 'false'); b.textContent = '💬 ' + who + ' has a tip';
        t.classList.add('cw-tip-tucked'); t.hidden = true;
        b.onclick = function () { var on = t.hidden; t.hidden = !on; b.setAttribute('aria-expanded', String(on)); b.classList.toggle('on', on); };
        add(b); body.insertBefore(t, after.nextSibling); after = t;
      });
    });
    /* writing boxes: the word count and "Your answer needs" show once a student starts typing */
    [].slice.call(document.querySelectorAll('.pq-write')).forEach(function (w) {
      var ta = w.previousElementSibling; if (!ta || ta.tagName !== 'TEXTAREA') return;
      var sync = function () { w.classList.toggle('cw-quiet', !ta.value.trim()); };
      ta.addEventListener('input', sync); sync();
    });
  }
  function later() { setTimeout(function () { move(); tidy(); }, 0); }
  if (document.readyState === 'complete') later(); else window.addEventListener('load', later);
})();

/* ═══ Audit fixes (3 Nov 2026): recovery, honest progress, a complete journal, a clear turn-in, labels ═══ */
(function () {
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function L() { return window.PQ_LESSON || {}; }
  function store(k, v) { var key = (L().key || location.pathname) + '-' + k;
    try { if (arguments.length < 2) return JSON.parse(localStorage.getItem(key)); localStorage.setItem(key, JSON.stringify(v)); } catch (e) { return null; } }
  function jobDone(id) { return !!(window.PQM && PQM.jobDone && PQM.jobDone(id)); }
  function fixes() {
    if (!document.body.classList.contains('cw-page')) return;
    var J = L().jobs || [];
    /* 1. the fact warm-up: answers save; a blank check doesn't score; students can fix and check again */
    var fc = window.fluencyCheck, btn = $('#fluencyCheckBtn'), grid = $('#fluencyGrid');
    if (fc && btn && grid) {
      var ins = $$('.fluency-input', grid), sv = store('fl') || {};
      ins.forEach(function (x, i) { if (sv[i] != null) x.value = sv[i];
        x.addEventListener('input', function () { var o = store('fl') || {}; o[i] = x.value; store('fl', o); var it = x.closest('.fluency-item'); if (it) it.classList.remove('fluency-wrong', 'fluency-correct'); }); });
      var again = function () { btn.disabled = false; btn.textContent = 'Check again'; ins.forEach(function (x) { x.disabled = false; }); };
      window.fluencyCheck = function () {
        if (ins.every(function (x) { return !x.value.trim(); })) { var r = $('#fluencyResult'); if (r) r.textContent = 'Type your answers first, then check.'; return; }
        fc.apply(this, arguments); again();
      };
      if (ins.some(function (x) { return x.value.trim(); })) { fc(); again(); }
    }
    /* 2. progress means work done: jobs finished, not tabs visited; a tab gets its check when its jobs are done */
    var lab = $('.progress-label'); if (lab) lab.textContent = '📐 Workshop jobs';
    var swyk = function () { var a = $$('#tab-assignment input.ans-box'); return a.length && a.every(function (x) { return x.value.trim(); }); };
    window.updateProgress = function () {
      var d = J.filter(function (j) { return jobDone(j.id); }).length, n = J.length || 1, f = $('#progressFill'), p = $('#progressPct');
      if (f) f.style.width = Math.round(d / n * 100) + '%'; if (p) p.textContent = d + ' of ' + n + ' jobs';
      $$('.tab-btn').forEach(function (b) { var t = b.getAttribute('data-tab'), js = J.filter(function (j) { return j.tab === t; });
        var done = js.length ? js.every(function (j) { return jobDone(j.id); }) && (t !== 'assignment' || swyk()) : (t === 'assignment' && swyk());
        b.classList.remove('visited'); b.classList.toggle('cw-done', !!done); });
    };
    window.updateProgress(); setInterval(window.updateProgress, 1500);
    /* 3. the journal records the work, not just the writing: every job's answers, Mental Math, the guided build */
    var g = window.gatherAnswers;
    var nums = function (el) { var out = [];
      $$('form', el).forEach(function (f) { var vis = $$('input', f).filter(function (x) { return !x.classList.contains('mm-sm'); }); if (!vis.length) return;
        var lb = f.querySelector('label') || f, c = lb.cloneNode(true);
        $$('input', c).forEach(function (x, k) { var src = $$('input', lb)[k]; x.replaceWith((src && src.value.trim()) || '___'); });
        $$('button,.ag-fb,.mm-fb', c).forEach(function (x) { x.remove(); });
        var t = c.textContent.replace(/\s+/g, ' ').trim(); if (lb === f) t = t.replace(/Check/g, '').trim();
        if (lb !== f && !lb.contains(vis[0])) t += ' ' + vis.map(function (x) { return x.value.trim() || '___'; }).join(', ');
        out.push('   ' + t + (f.classList.contains('ok') ? '  ✓' : '')); });
      var fd = $('.ag-found', el); if (fd && fd.textContent.trim()) out.push('   ' + fd.textContent.replace(/\s+/g, ' ').trim());
      return out; };
    if (g) window.gatherAnswers = function () {
      var r = g.apply(this, arguments), o = $('#gatheredOutput'); if (!o) return r;
      var lines = ['', '— MY WORKSHOP JOBS —'];
      J.forEach(function (j, i) { var el = j.go && $(j.go); lines.push('Job ' + (i + 1) + ': ' + j.t + (jobDone(j.id) ? '  ✓ done' : '  [not finished]')); if (el) lines = lines.concat(nums(el)); });
      [['#mk-mental', 'Mental Math'], ['#mk-guided', 'Let\'s Build It Together'], ['#mk-prove', 'Prove It: the numbers']].forEach(function (a) { var el = $(a[0]); if (el) { var n = nums(el); if (n.length) lines = lines.concat([a[1]], n); } });
      o.value = o.value.replace(/\s*$/, '') + '\n' + lines.join('\n') + '\n'; return r; };
    /* 4. say what the buttons really do; add a plain text download */
    $$('button').forEach(function (b) { var oc = b.getAttribute('onclick') || '';
      if (/downloadJournal/.test(oc) && !$('.cw-dltxt')) { b.textContent = '🖨️ Print or save as PDF';
        var t = document.createElement('button'); t.type = 'button'; t.className = b.className + ' cw-dltxt'; t.textContent = '⬇️ Download as text';
        t.onclick = function () { window.gatherAnswers(); var v = ($('#gatheredOutput') || {}).value || ''; var a = document.createElement('a');
          a.href = URL.createObjectURL(new Blob([v], { type: 'text/plain' })); a.download = 'math-journal-' + (L().id || 'lesson') + '.txt'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000); };
        b.parentNode.insertBefore(t, b.nextSibling); } });
    var pn = $('.practice-note'); if (pn) pn.textContent = 'Your answers and your work on this page save on this device as you go.';
    /* 5. accessibility: real checkbox semantics, labeled writing boxes, headings, quiet stamps */
    $$('.turn-in-item').forEach(function (it) { var ck = $('.turn-in-check', it);
      var upd = function () { it.setAttribute('aria-checked', it.classList.contains('checked') ? 'true' : 'false'); if (ck) ck.textContent = it.classList.contains('checked') ? '✓' : ''; };
      it.setAttribute('role', 'checkbox'); it.tabIndex = 0; if (ck) ck.setAttribute('aria-hidden', 'true'); upd();
      it.addEventListener('click', function () { setTimeout(upd, 0); });
      it.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); it.click(); } }); });
    $$('textarea.journal-box').forEach(function (t, i) { var l = t.previousElementSibling;
      if (l && l.classList.contains('journal-label')) { if (!l.id) l.id = 'jl-' + (t.id || i); t.setAttribute('aria-labelledby', l.id); } });
    $$('.activity-title,.key-concept-label,.turn-in-header-title,.fluency-head-title,.cw-st-head').forEach(function (h) { h.setAttribute('role', 'heading'); h.setAttribute('aria-level', '3'); });
  }
  window.addEventListener('load', function () { setTimeout(fixes, 0); });
})();

/* The task in front of the student stands out (audit, 3 Nov 2026): the card being worked on (focus inside it, or the card at
   the reading line) gets the strong frame; every card says up front what kind of work it is: Read, Do or Write. */
(function () {
  function go() {
    if (!document.body.classList.contains('cw-page')) return;
    var cards = [].slice.call(document.querySelectorAll('.tab-panel .activity, #tab-assignment .q-block'));
    cards.forEach(function (c) {
      var head = c.querySelector('.activity-head > div:last-child') || c.querySelector('.q-text'); if (!head || c.querySelector('.cw-kind')) return;
      var doIt = c.querySelector('[data-mk-model], .mm-p, .ag-ask, input.ans-box, .fluency-grid'), write = c.querySelector('textarea.journal-box:not([readonly])');
      var k = doIt ? ['do', '🔨 Do'] : write ? ['write', '✏️ Write'] : ['read', '📖 Read'];
      var t = document.createElement('span'); t.className = 'cw-kind cw-kind-' + k[0]; t.textContent = k[1]; head.appendChild(t);
    });
    var now = null;
    function pick() {
      var a = document.activeElement, f = a && a.closest && a.closest('.activity, .q-block');
      if (!f || !f.offsetParent) { var line = innerHeight * 0.4, best = 1e9; f = null;
        cards.forEach(function (c) { if (!c.offsetParent) return; var r = c.getBoundingClientRect(); if (r.bottom < 80 || r.top > innerHeight) return;
          var d = r.top <= line && r.bottom >= line ? 0 : Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line)); if (d < best) { best = d; f = c; } }); }
      if (f && f.parentElement && f.parentElement.closest('.activity')) f = f.parentElement.closest('.activity');   /* the outer card */
      if (f !== now) { if (now) now.classList.remove('cw-now'); now = f; if (now) now.classList.add('cw-now'); }
    }
    var t0 = 0; addEventListener('scroll', function () { if (!t0) t0 = setTimeout(function () { t0 = 0; pick(); }, 120); }, { passive: true });
    document.addEventListener('focusin', pick); document.addEventListener('click', function () { setTimeout(pick, 0); }); pick();
  }
  window.addEventListener('load', function () { setTimeout(go, 50); });
})();

/* ── click cues + "How this works" (pilot-week feedback, 10 Nov 2026; same idea as G3 ELA and G3 math) ──────────
   Students weren't sure what to click or what order to go in. The same cues on every lesson:
   1. a key line under the header: 👆 click it · 🔊 listen · dotted word · 🔒 opens next;
   2. a small hand inside every button, and buttons press down; labels (Do / Write / Read, "Remember to tell") are plain text;
   3. a bouncing hand on a grid nobody has touched yet (the first one in each card); gone on the first touch;
   4. "❓ How this works": Opti's how-to video (shown once the mp4 exists) + a Show-me-around tour, and a first-visit note.
   Also: tabs and Next go to the very top of the lesson in Canvas (the lesson sits in a tall iframe, so the Canvas page
   is what scrolls). Nothing uses position:fixed: in Canvas's tall iframe it would land at the bottom of the lesson. */
(function () {
  var HAND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 2.6a1.5 1.5 0 0 1 3 0V10h.6V8.2a1.5 1.5 0 0 1 3 0V10h.6V9.2a1.5 1.5 0 0 1 3 0v1.5h.3a1.4 1.4 0 0 1 2.8 0V16c0 3.6-2.6 6-6 6h-1.6c-2.2 0-3.8-.9-5-2.7l-4.1-5.5a1.6 1.6 0 0 1 2.5-2L9 14.6V2.6z"/></svg>';
  var VID = 'assets/video/g4math-howto.mp4', SEEN = 'g4cw-howto-seen';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }
  function shown(n) { var r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !n.closest('[hidden]'); }

  /* back to the top: the frame, then scrollIntoView (carried up to the Canvas page), then Canvas itself */
  function toTop() {
    try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
    try { if (window.top !== window.self) (document.body.firstElementChild || document.body).scrollIntoView({ block: 'start', behavior: 'instant' }); } catch (e) {}
    try { if (window.parent !== window) window.parent.postMessage(JSON.stringify({ subject: 'lti.scrollToTop' }), '*'); } catch (e) {}
  }
  window.CW_TOTOP = toTop;

  function key() {
    if ($('.cw-key')) return; var hdr = $('.header'); if (!hdr) return;
    var k = el('div', 'cw-key', '<span><i class="cw-key-hand">' + HAND + '</i> You can click it.</span><span><b>🔊</b> You can listen.</span>' +
      '<span><b class="cw-key-dot">dotted word</b> Click it to see what it means.</span><span><b>🔒</b> Opens when you finish the step before.</span>');
    var ra = document.getElementById('optima-read-aloud'), after = ra && ra.previousElementSibling === hdr ? ra : hdr;
    after.parentNode.insertBefore(k, after.nextSibling);
  }

  /* the bouncing hand on a grid no one has touched yet: one per card */
  function cue() {
    $$('.cw-hand').forEach(function (h) { if (!h._g || !h._g.isConnected) h.remove(); });
    $$('.tab-panel.active .activity, .tab-panel.active .q-block').forEach(function (card) {
      if (!shown(card) || card._cwCued) return;
      var g = $$('.ag-wrap', card).filter(function (w) { return shown(w) && !w._cwTouched; })[0]; if (!g) return;
      var svg = $('svg', g), cell = svg && ($('rect[data-c], rect.ag-c, g rect', svg) || svg); if (!cell) return;
      card._cwCued = true;
      if (getComputedStyle(g).position === 'static') g.style.position = 'relative';
      var h = el('span', 'cw-hand', HAND); h.setAttribute('aria-hidden', 'true'); h._g = g; h._t = cell; g.appendChild(h); place(h);
      function gone() { g._cwTouched = true; h.remove(); g.removeEventListener('pointerdown', gone, true); g.removeEventListener('keydown', gone, true); }
      g.addEventListener('pointerdown', gone, true); g.addEventListener('keydown', gone, true);
    });
  }
  function place(h) {
    var g = h._g, t = h._t, gr = g.getBoundingClientRect(), r = t.getBoundingClientRect();
    if (!gr.width || !r.width) { h.hidden = true; return; }
    var w = Math.min(r.width, 30), hh = Math.min(r.height, 30);
    h.hidden = false; h.style.left = (r.left - gr.left + w / 2 - 6) + 'px'; h.style.top = (r.top - gr.top + hh / 2) + 'px';
  }
  function recue() { $$('.cw-hand').forEach(place); cue(); }

  /* the order inside a Mental Math card, written before the problems */
  function mentalOrder() {
    $$('[data-mk-model="mental"]').forEach(function (m) {
      if (m.querySelector('.cw-order') || !m.querySelector('.mm-sm')) return;
      var first = m.querySelector('.mm-p') || m.querySelector('.mm-sm').closest('div');
      var o = el('p', 'cw-order', '<b>👉 Your turn, one problem at a time:</b> 1. Fill in the number bond. 2. Multiply each part. 3. Type the answer and press <b>Check</b>.');
      var ex = m.querySelector('.mm-card'); (ex && ex.nextSibling ? ex.parentNode.insertBefore(o, ex.nextSibling) : m.insertBefore(o, first));
    });
  }

  /* ❓ How this works: a pill in the header opens a small panel (video when it exists + the tour) */
  function howTo() {
    var tools = $('.pq-hdr-tools'); if (!tools || $('.cw-howchip')) return;
    var chip = el('button', 'pq-pill cw-howchip', '❓ How this works'); chip.type = 'button'; chip.setAttribute('aria-expanded', 'false');
    tools.appendChild(chip);
    var pane = el('div', 'cw-howpane'); pane.hidden = true;
    pane.innerHTML = '<div class="hv" hidden><video controls playsinline preload="metadata"></video></div>' +
      '<p class="ht">New to these lessons? Take a quick tour. Opti shows you where to click.</p>' +
      '<div class="cw-row"><button type="button" class="cw-tbtn gold tour-go">🧭 Show me around</button><button type="button" class="cw-tbtn ghost how-x">Close</button></div>';
    $('.header').appendChild(pane);
    var v = $('video', pane), hv = $('.hv', pane);
    v.addEventListener('loadedmetadata', function () { hv.hidden = false; $('.ht', pane).textContent = 'Watch Opti show how a lesson works. Or take the tour and click along.'; });
    v.src = VID; v.poster = VID.replace(/\.mp4$/, '.jpg');
    function open(o) { pane.hidden = !o; chip.setAttribute('aria-expanded', o); if (!o && !v.paused) v.pause(); }
    chip.addEventListener('click', function () { open(pane.hidden); });
    $('.how-x', pane).addEventListener('click', function () { open(false); });
    $('.tour-go', pane).addEventListener('click', function () { open(false); tour(); });
    var seen = false; try { seen = !!localStorage.getItem(SEEN); } catch (e) {}
    var first = $('#tab-warmup') || $('.tab-panel');
    if (!seen && first) {
      var n = el('div', 'cw-newhere', '<span class="ow">🧭</span><div><b>New to these lessons?</b> Watch Opti for 1 minute, or take the tour. It shows you what to click.</div>' +
        '<button type="button" class="cw-tbtn gold watch">▶ Watch how</button><button type="button" class="cw-tbtn gold go">Show me around</button><button type="button" class="cw-tbtn ghost no">No thanks</button>');
      $('.watch', n).hidden = true; v.addEventListener('loadedmetadata', function () { $('.watch', n).hidden = false; });
      first.insertBefore(n, first.firstChild);
      function done() { n.remove(); try { localStorage.setItem(SEEN, '1'); } catch (e) {} }
      $('.watch', n).addEventListener('click', function () { done(); open(true); toTop(); try { v.play(); } catch (e) {} });
      $('.go', n).addEventListener('click', function () { done(); tour(); });
      $('.no', n).addEventListener('click', done);
    }
  }

  function owl() {
    var c = document.createElement('canvas'); c.width = 16; c.height = 20; c.className = 'cw-tour-owl';
    if (window.PQART) { var x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(PQART.buildOwl(), 0, 0, 16, 20, 0, 0, 16, 20); }
    return c;
  }
  /* the tour: a ring around one thing at a time, Opti's note right under it (Warm-Up tab) */
  function tour() {
    $$('.cw-newhere').forEach(function (n) { n.remove(); });
    var t0 = ($('.tab-btn') || { dataset: {} }).dataset.tab; if (t0 && window.switchTab) window.switchTab(t0);
    function vis(sel) { return $$(sel).filter(shown)[0]; }
    var S = [
      ['.tab-bar', 'Your lesson has 3 tabs. Do them in order: <b>Warm-Up</b>, then <b>Lesson</b>, then <b>Show What You Know</b>.'],
      ['.pq-ra-btn', 'Press <b>🔊 Read aloud</b> to hear the page read to you.'],
      ['.cw-key', 'This key tells you what things mean. <b>See a little hand? You can click it.</b>'],
      ['.cw-slot .cw-play', 'Press play to step into the workshop. Read along, and click to go on. Do what the gold box says.', '.cw-slot'],
      ['.pq-def', 'A word with <b>dots under it</b> is a key word. Click it to see what it means.'],
      ['.cw-hand', 'The <b>bouncing hand</b> shows you where to click or drag first.', '.ag-wrap'],
      ['.pq-hint-btn', 'Stuck? Press <b>💡 Need a hint?</b> Each press gives a bigger hint.'],
      ['.cwg-btn, .cwg-man', 'You can ask Leonardo, too. Click him for a tip about the part you are on.'],
      ['.tab-next-btn', 'Done with this tab? Press <b>Continue</b>. The page goes back to the top for you.'],
      ['.progress-wrap', 'This bar fills up as you finish your jobs. You are ready. Let\'s go!']
    ].map(function (s) { var n = vis(s[0]); if (n && s[2]) n = n.closest(s[2]) || n; return { n: n, t: s[1] }; }).filter(function (s) { return s.n; });
    if (!S.length) return;
    var ring = el('div', 'cw-ring'), tip = el('div', 'cw-tourtip'); ring.setAttribute('aria-hidden', 'true');
    tip.setAttribute('role', 'dialog'); tip.setAttribute('aria-label', 'Lesson tour');
    document.body.appendChild(ring); document.body.appendChild(tip);
    var i = 0;
    function go(k) {
      i = k; var s = S[i], n = s.n, pad = 8, stuck = /sticky|fixed/.test(getComputedStyle(n).position);
      if (stuck) { var ps = n.style.position; n.style.position = 'relative'; n.scrollIntoView({ block: 'center', behavior: 'instant' }); n.style.position = ps; }
      else n.scrollIntoView({ block: 'center', behavior: 'instant' });
      var r = n.getBoundingClientRect(), y = r.top + window.scrollY, x = r.left + window.scrollX;
      ring.style.cssText = 'left:' + (x - pad) + 'px;top:' + (y - pad) + 'px;width:' + (r.width + pad * 2) + 'px;height:' + (r.height + pad * 2) + 'px';
      tip.innerHTML = '<div class="tx"><div class="nn">Opti · ' + (i + 1) + ' of ' + S.length + '</div><p>' + s.t + '</p>' +
        '<div class="cw-row">' + (i ? '<button type="button" class="cw-tbtn ghost bk">← Back</button>' : '') +
        '<button type="button" class="cw-tbtn nx">' + (i < S.length - 1 ? 'Next →' : '✓ Done') + '</button>' +
        (i < S.length - 1 ? '<button type="button" class="cw-tbtn ghost sk">Skip tour</button>' : '') + '</div></div>';
      tip.insertBefore(owl(), tip.firstChild);
      var below = y + r.height + pad + 14, w = Math.min(420, document.documentElement.clientWidth - 24);
      tip.style.width = w + 'px'; tip.style.left = Math.max(12, Math.min(x, document.documentElement.clientWidth - w - 12)) + 'px'; tip.style.top = below + 'px';
      var th = tip.offsetHeight, docH = document.documentElement.scrollHeight;
      if (below + th > Math.min(docH, window.scrollY + innerHeight) && y - pad - 14 - th > 0) tip.style.top = (y - pad - 14 - th) + 'px';
      try { tip.scrollIntoView({ block: 'nearest', behavior: 'instant' }); } catch (e) {}
      $('.nx', tip).onclick = function () { if (i < S.length - 1) go(i + 1); else end(); };
      if ($('.bk', tip)) $('.bk', tip).onclick = function () { go(i - 1); };
      if ($('.sk', tip)) $('.sk', tip).onclick = end;
      try { $('.nx', tip).focus({ preventScroll: true }); } catch (e) {}
    }
    function esc(e) { if (e.key === 'Escape') end(); }
    function end() { ring.remove(); tip.remove(); document.removeEventListener('keydown', esc); try { localStorage.setItem(SEEN, '1'); } catch (e) {} toTop(); }
    document.addEventListener('keydown', esc);
    go(0);
  }
  window.CW_TOUR = tour;

  function init() {
    if (!document.body.classList.contains('cw-page')) return;
    key(); howTo(); mentalOrder();
    var sw = window.switchTab;
    if (sw && !sw._cwTop) { window.switchTab = function () { var r = sw.apply(this, arguments); toTop(); setTimeout(recue, 120); return r; }; window.switchTab._cwTop = true; }
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.cw-path-b, .cw-station .tab-next-btn')) setTimeout(recue, 150); });
    addEventListener('resize', function () { requestAnimationFrame(recue); });
    setTimeout(recue, 300);
    if (window.MutationObserver) { var t = 0; new MutationObserver(function () { clearTimeout(t); t = setTimeout(function () { mentalOrder(); cue(); }, 120); }).observe(document.body, { childList: true, subtree: true }); }
  }
  window.addEventListener('load', function () { setTimeout(init, 120); });
})();
