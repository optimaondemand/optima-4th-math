/* ═══ PIXEL QUEST · page layer (shared by every sparkled G4 math lesson) ═══
   Reads window.PQ_LESSON (the lesson's own file in assets/sparkle/lessons/). Holds no lesson content.
   - the lesson's real problem board (jobs), wallet (coins, XP, rank), gear panel
   - pixel tip-givers (.mk-tip[data-who]), models ([data-mk-model]) built from PQ_LESSON.models with OAOKit
   - clean top: 8-bit Opti on the lesson tag, standards bubble, Game/Clean switch, study music
   - Essential Question drawer (open on the first tab only), section video slots (hidden until a video exists)
   - progress for My Math Map (oao.pq.progress) */
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
function earn(key,coins,xp,src,label){
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
function jobDone(id){if(!S)S=PQ._state();return !!(S.world.jobs&&S.world.jobs[id]);}
function setJob(id,src){S.world.jobs=S.world.jobs||{};if(S.world.jobs[id])return;S.world.jobs[id]=1;PQ._save();
  var j=(L.jobs||[]).filter(function(z){return z.id===id;})[0]||{coins:5};earn('job-'+id,j.coins,5,src||$('.mk-board'),(L.problem&&L.problem.jobWord||'Job')+' done!');renderBoard();progress();}
function renderBoard(){
  var J=L.jobs||[],P=L.problem||{};if(!J.length)return;
  var n=J.filter(function(j){return jobDone(j.id);}).length,scene=L.scene?L.scene(api):'';
  $$('.mk-board-mount').forEach(function(m){
    m.innerHTML='<div class="mk-board"><div class="mk-board-top"><div class="mk-bt"><div class="mk-q">★ TODAY\'S REAL PROBLEM · '+n+' of '+J.length+' jobs done</div><h3>'+P.title+'</h3><p>'+P.text+'</p></div>'+(scene?'<div class="mk-stand-wrap">'+scene+'</div>':'')+'</div>'+
      '<div class="mk-jobs">'+J.map(function(j,i){return '<div class="mk-job'+(jobDone(j.id)?' done':'')+'" style="--r:'+(j.r||((i%2?1:-1)*(1+i%3*0.5))+'deg')+'" role="button" tabindex="0" data-go="'+esc(j.go)+'" data-tab="'+j.tab+'"><span class="n">JOB '+(i+1)+' · +'+j.coins+' 🪙</span><b>'+j.t+'</b><span class="w">'+j.w+'</span><span class="stamp">DONE</span></div>';}).join('')+'</div></div>';
  });
  $$('.mk-stand-mount').forEach(function(m){m.innerHTML=scene;});
  $$('.mk-job').forEach(function(b){function go(){var t=b.dataset.tab;if(window.switchTab)switchTab(t);setTimeout(function(){var e=$(b.dataset.go);if(e)e.scrollIntoView({behavior:'smooth',block:'center'});},350);}b.onclick=go;b.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}};});
}

/* ───────── pixel tip-givers on the page ───────── */
function sprite(who){
  var c=document.createElement('canvas');c.width=16;c.height=20;var x=c.getContext('2d');x.imageSmoothingEnabled=false;
  if(who==='opti'){x.drawImage(PQART.buildOwl(),0,0,16,20,0,0,16,20);return c;}
  var n=(PQ_DATA.npcs||[]).filter(function(z){return z.id===who;})[0];if(n&&n.look){x.drawImage(PQART.buildChar(n.look),0,0,16,20,0,0,16,20);}return c;
}
function tips(){
  $$('.mk-tip').forEach(function(t){if(t.dataset.done)return;t.dataset.done=1;var who=t.dataset.who;var sp=(PQ_DATA.speakers[who]||{});
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
  if(window.PQ_DATA){var mode=document.createElement('button');mode.type='button';mode.className='pq-pill pq-mode';tools.appendChild(mode);
    var paint=function(){var c=clean();mode.innerHTML=c?'🧘 Clean mode <b>ON</b>':'🎮 Game <b>ON</b>';mode.title=c?'Turn the game back on':'Turn on clean mode: just the lesson, no game';mode.setAttribute('aria-pressed',c);};
    mode.onclick=function(){setClean(!clean());paint();};paint();}
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
    box.innerHTML='<div class="pq-vhead"><span>▶ '+esc(title)+'</span><span class="xp">+10 XP</span></div><div class="pq-vbody"></div>';
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
    var ui=el('<div class="pq-write"><span class="pq-count"></span>'+(cfg.chips&&cfg.chips.length?'<span class="pq-needs">Your answer needs:</span>'+cfg.chips.map(function(c,i){return '<span class="pq-chip" data-i="'+i+'">'+esc(c.label)+'</span>';}).join(''):'')+'</div>');
    t.parentNode.insertBefore(ui,t.nextSibling);
    function upd(){var v=t.value,n=(v.trim().match(/\S+/g)||[]).length,txt=norm(v),min=cfg.min||8;
      var c=$('.pq-count',ui);c.textContent='📝 '+Math.min(n,min)+' of '+min+' words'+(n>=min?' ✓':n?'. Keep going…':'');c.classList.toggle('met',n>=min);
      $$('.pq-chip',ui).forEach(function(ch){var C=cfg.chips[+ch.dataset.i];ch.classList.toggle('on',C.words.some(function(w){return hit(txt,w);}));});}
    t.addEventListener('input',upd);setTimeout(upd,300);
  });
}
/* 3. new words defined in the sentence, the first time a student meets them: PQ_LESSON.words = [{w, d}] (reading order) */
var SKIP='script,style,textarea,input,button,select,svg,canvas,summary,.pq-slot,.pq-vslot,.mk-board-mount,[data-mk-model],.flip-card,.pq-def,.mk-tip-name,.header,.standards-panel,.gathered-box,.turn-in-card,.pq-hint,.pq-write';
function defineWords(){
  var root=$('.tab-panel')?$('.tab-panel').parentNode:document.body,scope=$$('.tab-panel');
  (L.words||[]).forEach(function(W){
    var re=new RegExp('\\b('+W.w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')\\b','i'),done=false;
    scope.forEach(function(sc){if(done)return;
      var tw=document.createTreeWalker(sc,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentElement;return p&&!p.closest(SKIP)&&re.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
      var n=tw.nextNode();if(!n)return;done=true;var m=n.nodeValue.match(re),i=n.nodeValue.search(re);
      var after=n.splitText(i);after.nodeValue=after.nodeValue.slice(m[1].length);
      var span=el('<span class="pq-def"><b>'+esc(m[1])+'</b> <span class="pq-def-m">('+esc(W.d)+')</span></span>');
      n.parentNode.insertBefore(span,after);});
    if(!done)fail('word','"'+W.w+'" not found on the page');
  });
  // the journal lists the words
  var g=window.gatherAnswers;if(g&&(L.words||[]).length)window.gatherAnswers=function(){var r=g.apply(this,arguments);var o=document.getElementById('gatheredOutput');
    if(o)o.value+='\nWords I learned today\n'+L.words.map(function(W){return '• '+W.w+': '+W.d;}).join('\n')+'\n';return r;};
}

function init(){
  L=window.PQ_LESSON;if(!L){fail('layer','no PQ_LESSON');return;}
  if(ls('oao.pq.clean',false))document.body.classList.add('pq-clean');
  S=window.PQ?PQ._state():{world:{}};S.world.jobs=S.world.jobs||{};
  W=ls(KEY,null)||{coins:0,xp:0,gear:{},wear:{},earned:{}};W.gear=W.gear||{};W.wear=W.wear||{};W.earned=W.earned||{};
  api={earn:earn,setJob:setJob,jobDone:jobDone,state:function(){return S;},save:function(){if(window.PQ)PQ._save();},fmt:fmt,ls:ls,lsSet:lsSet,clean:clean,renderBoard:renderBoard,progress:progress,key:function(k){return L.key+'-'+k;}};
  pouch=el('<button class="mk-pouch" type="button" aria-label="My coins, XP and rank"></button>');document.body.appendChild(pouch);
  panel=el('<div class="mk-panel" role="dialog" aria-label="Explorer pack"></div>');document.body.appendChild(panel);
  pouch.onclick=function(){panel.classList.toggle('on');if(panel.classList.contains('on'))renderPanel();};
  try{header();}catch(e){fail('header',e);}
  try{drawer();}catch(e){fail('drawer',e);}
  try{slots();}catch(e){fail('slots',e);}
  renderPouch(false);try{renderBoard();}catch(e){fail('board',e);}
  try{tips();}catch(e){fail('tips',e);}
  models();hooks();progress();
  try{defineWords();}catch(e){fail('words',e);}
  try{hints();}catch(e){fail('hints',e);}
  try{writing();}catch(e){fail('writing',e);}
}
return {init:init,earn:earn,spend:spend,wallet:function(){return W;},saveWallet:function(){lsSet(KEY,W);renderPouch(true);},jobDone:jobDone,setJob:setJob,renderBoard:renderBoard,rankOf:rankOf,setClean:setClean,progress:progress};
})();
