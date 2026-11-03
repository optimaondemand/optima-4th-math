/* ═══ OAO MATH KIT · Disc Mat + Bar Strip ═══
   Shared, lesson-agnostic. A lesson calls OAOKit.discMat(el, cfg) or OAOKit.barStrip(el, cfg) with its own numbers.
   Design rules (audit, Oct 2026): plain pieces, always to scale, labels on the model, one line of directions,
   live symbols beside the model, drag AND tap, fixed place-value colors (1,000 violet · 100 blue · 10 green · 1 orange). */
var OAOKit = (function(){
'use strict';
function fmt(n){return Number(n).toLocaleString('en-US');}
function $(s,r){return (r||document).querySelector(s);} function $$(s,r){return [].slice.call((r||document).querySelectorAll(s));}
function ls(k,d){if(!k)return d;try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function lsSet(k,v){if(!k)return;try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/* soft sounds (WebAudio, no files; respects the game's mute) */
function tone(f,d,type,v,w){try{if(localStorage.getItem('oao.pq.mute')==='true')return;}catch(e){}var a=window.__okAC||(window.__okAC=new (window.AudioContext||window.webkitAudioContext)());
  var o=a.createOscillator(),g=a.createGain();o.type=type||'triangle';o.frequency.value=f;var s=a.currentTime+(w||0);g.gain.setValueAtTime(v||0.05,s);g.gain.exponentialRampToValueAtTime(0.0001,s+d);o.connect(g);g.connect(a.destination);o.start(s);o.stop(s+d+0.02);}
var snd={click:function(){tone(520,0.06,'triangle',0.05);},merge:function(){tone(440,0.08,'triangle',0.05);tone(660,0.12,'triangle',0.05,0.08);},
  split:function(){for(var i=0;i<4;i++)tone(800-i*90,0.05,'triangle',0.04,i*0.04);},no:function(){tone(200,0.12,'square',0.03);},
  done:function(){[523,659,784,1047].forEach(function(f,i){tone(f,0.14,'triangle',0.05,i*0.08);});}};

/* ───────── drag + tap helper ───────── */
var DROP='.ok-col,.ok-zone,.ok-bar,.ok-tray,.ok-barrow,.ok-plat,.ok-pourrow';
function draggable(el,payload,onDrop,onTap){
  var sx,sy,ghost=null,moved=false,over=null,id=null;
  el.addEventListener('pointerdown',function(e){if(e.button>0)return;sx=e.clientX;sy=e.clientY;moved=false;id=e.pointerId;try{el.setPointerCapture(id);}catch(x){}e.preventDefault();});
  el.addEventListener('pointermove',function(e){if(id!==e.pointerId)return;
    if(!moved&&Math.hypot(e.clientX-sx,e.clientY-sy)>6){moved=true;ghost=el.cloneNode(true);ghost.classList.add('ok-ghost');ghost.classList.remove('lift');document.body.appendChild(ghost);el.classList.add('lift');}
    if(ghost){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';var t=document.elementFromPoint(e.clientX,e.clientY);t=t&&t.closest(DROP);if(t!==over){if(over)over.classList.remove('over');over=t;if(over&&!over.classList.contains('ok-tray'))over.classList.add('over');}}});
  function end(e){if(id!==e.pointerId)return;id=null;if(over)over.classList.remove('over');
    if(ghost){ghost.remove();ghost=null;el.classList.remove('lift');var t=document.elementFromPoint(e.clientX,e.clientY);onDrop(t,payload(),e);}
    else if(!moved&&onTap&&e.type==='pointerup')onTap(payload());over=null;}
  el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
  el.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&onTap){e.preventDefault();onTap(payload());}});
}
function fly(fromRect,toRect,el,delay){if(reduce||!fromRect||!toRect)return;var c=el.cloneNode(true);c.classList.add('ok-fly');c.style.left=fromRect.left+'px';c.style.top=fromRect.top+'px';c.style.width=fromRect.width+'px';c.style.height=fromRect.height+'px';c.style.margin='0';
  document.body.appendChild(c);setTimeout(function(){c.style.transform='translate('+(toRect.left-fromRect.left)+'px,'+(toRect.top-fromRect.top)+'px)';},20+(delay||0));setTimeout(function(){c.remove();},520+(delay||0));}

/* ═══════════ DISC MAT ═══════════
   cfg = { places:[1000,100,10,1], unit:'mL', headSub:{1000:'1,000 mL'}, start:{1000:0,…}, tray:true,
           zone:{kind:'convert'|'away', title, place, accept:[…], label:(p)=>'1 L', total:(z)=>html},
           steps:[{text, done:(st,api)=>bool}], sym:(st,api)=>html, key:'localStorage key', onDone, onChange } */
var NAMES={1000:'Thousands',100:'Hundreds',10:'Tens',1:'Ones'};
function discMat(root,cfg){
  var P=cfg.places, key=cfg.key, saved=ls(key,null);
  /* optional wording for unit mats: names {p:['meter','meters']}, short {p:'m'}, discLabel(p) */
  function one(p){return cfg.names?cfg.names[p][0]:NAMES[p].toLowerCase().replace(/s$/,'');} function many(p){return cfg.names?cfg.names[p][1]:NAMES[p].toLowerCase();}
  function dl(p){return cfg.discLabel?cfg.discLabel(p):fmt(p);}
  var st=saved||{c:{},z:{},doneFired:false};P.forEach(function(p){if(st.c[p]==null)st.c[p]=(cfg.start&&cfg.start[p])||0;if(st.z[p]==null)st.z[p]=0;});
  var api={value:function(){return P.reduce(function(s,p){return s+p*st.c[p];},0);},zoneValue:function(){return P.reduce(function(s,p){return s+p*st.z[p];},0);},st:st,fmt:fmt};
  root.classList.add('ok-tool');
  root.innerHTML='<p class="ok-do" aria-live="polite"></p>'+(cfg.groups?'<div class="ok-groups" style="grid-template-columns:'+cfg.groups.map(function(g){return g.span+'fr';}).join(' ')+'">'+cfg.groups.map(function(g){return '<span>'+g.label+'</span>';}).join('')+'</div>':'')+'<div class="ok-matwrap"><div class="ok-mat" style="grid-template-columns:repeat('+P.length+',1fr)">'+
    P.map(function(p){return '<div class="ok-col" data-p="'+p+'"><div class="ok-head"><b><span class="ok-full">'+(cfg.names?cfg.names[p][1]:NAMES[p])+'</span><span class="ok-short">'+((cfg.short&&cfg.short[p])||{1000:'Th',100:'H',10:'T',1:'O'}[p])+'</span></b><span>'+((cfg.headSub&&cfg.headSub[p])||fmt(p)+(cfg.unit?' '+cfg.unit:''))+'</span></div><div class="ok-count">0</div><div class="ok-well" style="--per:'+(cfg.perRow||2)+'"></div><div class="ok-colbtns"></div></div>';}).join('')+
    '</div>'+(cfg.zone?'<div class="ok-zone '+(cfg.zone.kind==='away'?'away':'')+'"><h5>'+cfg.zone.title+'</h5><div class="ok-zwell"></div><div class="ok-ztot"></div></div>':'')+'</div>'+
    (cfg.tray?'<div class="ok-tray"><span class="lbl">Drag a disc onto the mat (or tap it):</span>'+P.map(function(p){return '<span class="ok-src"><span class="ok-disc'+(p>=1000?' small':'')+'" data-p="'+p+'" data-src="1" tabindex="0" role="button" aria-label="Add '+(cfg.names?'a '+one(p):'a '+fmt(p)+' disc')+'">'+dl(p)+'</span></span>';}).join('')+'</div>':'')+
    '<div class="ok-sym" aria-live="polite"></div><div class="ok-msg" aria-live="polite"></div><div class="ok-row">'+(cfg.adds?'<button class="ok-btn ok-add" type="button"></button>':'')+'<button class="ok-btn ok-reset" type="button">↺ Start over</button></div>';
  var msg=$('.ok-msg',root);
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.textContent=t||'';}
  function save(){lsSet(key,st);}
  function colOf(p){return $('.ok-col[data-p="'+p+'"]',root);}
  function bigger(p){return P.indexOf(p*10)>=0?p*10:null;} function smaller(p){return P.indexOf(p/10)>=0?p/10:null;}
  /* actions */
  function add(p){if(st.c[p]>=19){say('That column is full. Trade 10 of them for 1 bigger disc.','hint');snd.no();return;}st.c[p]++;snd.click();after({pop:[p]});}
  function remove(p){if(cfg.noRemove){say('Keep every disc on the mat for this one.','hint');snd.no();render();return;}st.c[p]--;snd.click();after({});}
  function group(p){var b=bigger(p);if(!b){say('There\'s no bigger column on this mat.','hint');snd.no();render();return;}
    if(st.c[p]<10){say('You need 10 '+many(p)+' to make 1 '+one(b)+'. You have '+st.c[p]+'.','hint');snd.no();render();return;}
    var from=$$('.ok-well .ok-disc',colOf(p)).slice(-10).map(function(d){return d.getBoundingClientRect();}),tmpl=$('.ok-well .ok-disc',colOf(p));
    st.c[p]-=10;st.c[b]++;snd.merge();after({pop:[b],flyFrom:from,flyTo:b,tmpl:tmpl});say('10 '+many(p)+' → 1 '+one(b)+'. Same amount, fewer pieces.','good');}
  function brk(p){var s=smaller(p);if(!s){say('There\'s no smaller column on this mat.','hint');snd.no();render();return;}if(!st.c[p])return;
    if(st.c[s]+10>19){say('Trade some '+many(s)+' first. That column is too full.','hint');snd.no();return;}
    var src=$$('.ok-well .ok-disc',colOf(p)).slice(-1)[0];var r=src&&src.getBoundingClientRect();
    st.c[p]--;st.c[s]+=10;snd.split();after({popMany:[s,10],flyFrom:r?[r]:null,flyTo:s,tmpl:src});say('1 '+one(p)+' → 10 '+many(s)+'. Same amount, more pieces.','good');}
  function toZone(p){var z=cfg.zone;if(!z)return;if(z.accept&&z.accept.indexOf(p)<0){say(z.wrong?z.wrong(p,api):'That disc doesn\'t go there.','hint');snd.no();render();return;}
    if(z.max&&api.zoneValue()+p>z.max){say(z.over?z.over(api):'That\'s too much.','hint');snd.no();render();return;}
    st.c[p]--;st.z[p]++;snd.click();after({});}
  function fromZone(p){st.z[p]--;st.c[p]++;snd.click();after({});}
  function dropDisc(target,pl){
    if(!target){if(pl.from==='col')remove(pl.p);render();return;}
    var col=target.closest('.ok-col'),zone=target.closest('.ok-zone'),tray=target.closest('.ok-tray');
    if(pl.from==='src'){if(col||target.closest('.ok-mat'))add(pl.p);return;}
    if(pl.from==='zone'){if(col||target.closest('.ok-mat')){fromZone(pl.p);}return;}
    if(zone){toZone(pl.p);return;}
    if(col){var q=+col.dataset.p;if(q===pl.p){render();return;}if(q===pl.p*10)return group(pl.p);if(q===pl.p/10)return brk(pl.p);
      say(q>pl.p?'Trade one column at a time: 10 of these make 1 in the next column.':'Break one column at a time: 1 of these makes 10 in the next column.','hint');snd.no();render();return;}
    if(tray||!target.closest('.ok-tool'))return remove(pl.p);
    render();
  }
  /* render */
  var last={};
  function after(anim){save();render(anim);if(cfg.onChange)cfg.onChange(api);}
  function render(anim){anim=anim||{};
    P.forEach(function(p){var col=colOf(p),w=$('.ok-well',col),n=st.c[p];
      w.innerHTML='';for(var i=0;i<n;i++){var d=document.createElement('span');d.className='ok-disc'+(p>=1000?' small':'');d.dataset.p=p;d.textContent=dl(p);d.tabIndex=-1;
        if(anim.pop&&anim.pop.indexOf(p)>=0&&i===n-1&&!anim.flyFrom)d.classList.add('ok-in');
        if(anim.popMany&&anim.popMany[0]===p&&i>=n-anim.popMany[1]){d.classList.add('ok-in');d.style.animationDelay=((i-(n-anim.popMany[1]))*35+(anim.flyFrom?380:0))+'ms';}
        if(anim.flyTo===p&&anim.pop&&i===n-1){d.style.visibility='hidden';(function(dd){setTimeout(function(){dd.style.visibility='';dd.classList.add('ok-in');},reduce?0:470);})(d);}
        (function(dd){draggable(dd,function(){return {p:p,from:'col'};},dropDisc,null);})(d);w.appendChild(d);}
      $('.ok-count',col).textContent=n;col.classList.toggle('full',n>=10&&!!bigger(p));
      var bb=$('.ok-colbtns',col);bb.innerHTML='';
      if(n>=10&&bigger(p)){var g=document.createElement('button');g.className='ok-btn';g.type='button';g.textContent='← Trade 10 for 1';g.onclick=function(){group(p);};bb.appendChild(g);}
      if(n>0&&smaller(p)&&!cfg.noBreak){var k=document.createElement('button');k.className='ok-btn';k.type='button';k.textContent='Break 1 into 10 →';k.onclick=function(){brk(p);};bb.appendChild(k);}
      if(n>0&&cfg.zone&&(!cfg.zone.accept||cfg.zone.accept.indexOf(p)>=0)){var zb=document.createElement('button');zb.className='ok-btn';zb.type='button';zb.textContent=cfg.zone.btn||'Move 1 →';zb.onclick=function(){toZone(p);};bb.appendChild(zb);}
    });
    if(anim.flyFrom&&anim.tmpl){var tw=$('.ok-well',colOf(anim.flyTo)),tl=$$('.ok-disc',tw);var tr=(tl[tl.length-1]||tw).getBoundingClientRect();anim.flyFrom.forEach(function(r,i){fly(r,tr,anim.tmpl,i*25);});}
    if(cfg.zone){var zw=$('.ok-zwell',root);zw.innerHTML='';P.forEach(function(p){for(var i=0;i<st.z[p];i++){var d=document.createElement('span');d.className='ok-disc'+(cfg.zone.kind==='convert'?' conv':'')+(p>=1000?' small':'');d.dataset.p=p;
        d.textContent=cfg.zone.label?cfg.zone.label(p):fmt(p);(function(dd){draggable(dd,function(){return {p:p,from:'zone'};},dropDisc,null);})(d);zw.appendChild(d);}});
      $('.ok-ztot',root).innerHTML=cfg.zone.total?cfg.zone.total(api):fmt(api.zoneValue());}
    $('.ok-sym',root).innerHTML=cfg.sym?cfg.sym(api):defaultSym();
    if(cfg.adds){var ab=$('.ok-add',root),na=cfg.adds[st.adds||0];ab.hidden=!na;if(na)ab.textContent=na.label;}
    // steps
    var steps=cfg.steps||[],i=0;while(i<steps.length&&steps[i].done(st,api))i++;
    var doEl=$('.ok-do',root);
    if(i<steps.length){doEl.innerHTML=(steps.length>1?'<span class="ok-step">Step '+(i+1)+' of '+steps.length+'</span>':'')+steps[i].text;}
    else{doEl.innerHTML='<span class="ok-step" style="background:#1E8C5A">Done</span>'+(cfg.doneText||'Nice work.');
      if(!st.doneFired){st.doneFired=true;save();snd.done();say(cfg.doneMsg||'',cfg.doneMsg?'good':'');if(cfg.onDone)cfg.onDone(api,root);}}
  }
  function defaultSym(){var v=api.value();var parts=P.filter(function(p){return st.c[p];}).map(function(p){var cls={1000:'k',100:'h',10:'t',1:'o'}[p];return '<span class="'+cls+'">'+fmt(st.c[p]*p)+'</span>';});
    return '<span class="big">'+fmt(v)+(cfg.unit?' '+cfg.unit:'')+'</span>'+(parts.length>1?'<span class="exp">= '+parts.join(' + ')+'</span>':'');}
  $$('.ok-tray .ok-disc',root).forEach(function(d){var p=+d.dataset.p;draggable(d,function(){return {p:p,from:'src'};},dropDisc,function(){add(p);});});
  $('.ok-reset',root).onclick=function(){P.forEach(function(p){st.c[p]=(cfg.start&&cfg.start[p])||0;st.z[p]=0;});st.adds=0;st.doneFired=false;say('');after({});};
  if(cfg.adds){$('.ok-add',root).onclick=function(){var a=cfg.adds[st.adds||0];if(!a)return;
      if(a.when&&!a.when(st,api)){say(a.notYet||'Finish the step above first.','hint');snd.no();return;}
      if(P.some(function(p){return st.c[p]+((a.of&&a.of[p])||0)>19;})){say('A column is too full. Trade 10 small pieces for 1 bigger one first.','hint');snd.no();return;}
      var pops=[];P.forEach(function(p){var n=(a.of&&a.of[p])||0;if(n){st.c[p]+=n;pops.push(p);}});st.adds=(st.adds||0)+1;snd.merge();say(a.said||'','good');after({pop:pops});};}
  render();
  if(st.doneFired&&cfg.onDone&&cfg.restoreDone)cfg.onDone(api,root);
  return api;
}

/* ═══════════ BAR STRIP ═══════════
   One or more bars on a shared, to-scale axis. Students drag (or tap) equal pieces onto a bar until it reaches its target.
   row = {label, target, max, unit, pieces:[value…], pieceLabel:(v)=>'10 cm', ticks:{every, major}, scale:[values], scaleLabel:(v)=>str,
          bigLabel:'1 m', doneLine:(row)=>html}
   cfg = { rounds:[row…]  (one bar at a time with round tabs)  OR  rows:[row…] (all bars together, compare),
           key, intro, onRound(i), onDone } */
function colorOf(v,unitBase){var n=v/(unitBase||1);return n>=1000?1000:n>=100?100:n>=10?10:1;}
function barStrip(root,cfg){
  var compare=!!cfg.rows, rows=cfg.rows||cfg.rounds, key=cfg.key;
  var st=ls(key,null)||{cur:0,fill:rows.map(function(){return [];}),won:rows.map(function(){return false;}),doneFired:false};
  root.classList.add('ok-tool');
  root.innerHTML=(cfg.rounds?'<div class="ok-rounds" role="tablist">'+rows.map(function(r,i){return '<button type="button" data-i="'+i+'">'+r.name+'</button>';}).join('')+'</div>':'')+
    '<p class="ok-do" aria-live="polite"></p><div class="ok-bars"></div><div class="ok-sym" aria-live="polite"></div><div class="ok-msg" aria-live="polite"></div><div class="ok-row"><button class="ok-btn ok-undo" type="button">↶ Take one off</button><button class="ok-btn ok-reset" type="button">↺ Start over</button></div>';
  var msg=$('.ok-msg',root);function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.textContent=t||'';}
  function save(){lsSet(key,st);}
  function sum(i){return st.fill[i].reduce(function(a,b){return a+b;},0);}
  function visible(){return compare?rows.map(function(r,i){return i;}):[st.cur];}
  function place(i,v){var r=rows[i];if(st.won[i]&&!compare){say('This bar is full. Try the next round.','');return;}
    if(sum(i)+v>r.target){say(r.overMsg||('That piece would go past '+r.bigLabel+'.'),'hint');snd.no();render();return;}
    st.fill[i].push(v);snd.click();
    if(sum(i)===r.target&&!st.won[i]){st.won[i]=true;snd.done();if(cfg.onRound)cfg.onRound(i,root);}
    save();render({pop:i});check();}
  function undo(){var vis=visible();for(var k=vis.length-1;k>=0;k--){var i=vis[k];if(st.fill[i].length){st.fill[i].pop();st.won[i]=sum(i)===rows[i].target;save();render();return;}}}
  function check(){if(st.won.every(Boolean)&&!st.doneFired){st.doneFired=true;save();if(cfg.onDone)cfg.onDone(root);render();}}
  function render(anim){anim=anim||{};
    if(cfg.rounds)$$('.ok-rounds button',root).forEach(function(b,k){b.classList.toggle('on',k===st.cur);b.classList.toggle('won',!!st.won[k]);b.setAttribute('aria-selected',k===st.cur);});
    var bars=$('.ok-bars',root);bars.innerHTML='';
    var bw=Math.max(200,bars.clientWidth-12);visible().forEach(function(i){var r=rows[i],s=sum(i),max=r.max||r.target;
      var row=document.createElement('div');row.className='ok-barrow';row.dataset.i=i;
      var ticks='';if(r.ticks){for(var t=r.ticks.every;t<max;t+=r.ticks.every){var maj=r.ticks.major&&t%r.ticks.major===0;ticks+='<i'+(maj?' class="maj"':'')+' style="left:'+(t/max*100)+'%;height:'+(maj?'45%':'22%')+'"></i>';}}
      var pieces=st.fill[i].map(function(v,k){var w=v/max*100;var lab=(r.pieceLabel?r.pieceLabel(v):fmt(v)+' '+r.unit);return '<span class="ok-piece'+(k%2?' alt':'')+(anim.pop===i&&k===st.fill[i].length-1?' ok-in':'')+'" data-c="'+colorOf(v,r.base)+'" style="width:'+w+'%" title="'+lab+'">'+(w/100*bw>=46?lab:'')+'</span>';}).join('');
      var targetMark=r.max&&r.max!==r.target&&!r.hideTarget?'<i style="position:absolute;top:-3px;bottom:-3px;left:'+(r.target/max*100)+'%;width:0;border-left:3px dashed #2B3040"></i>':'';
      row.innerHTML='<div class="ok-barlab"><span>'+r.label+'</span><span class="val">'+fmt(s)+' '+r.unit+(r.target!==s?(r.hideTarget?'':' <span style="color:#8A90A6;font-size:14px">of '+fmt(r.target)+' '+r.unit+'</span>'):' ✓')+'</span></div>'+
        '<div class="ok-bar'+(st.won[i]?' done':'')+'" data-i="'+i+'" style="width:'+(compare&&r.width?r.width:'100%')+'"><div class="ok-ticks">'+ticks+'</div><div class="ok-fill">'+pieces+'</div>'+targetMark+'</div>'+
        (r.scale?'<div class="ok-scale">'+r.scale.map(function(v){return '<span style="left:'+(v/max*100)+'%">'+(r.scaleLabel?r.scaleLabel(v):fmt(v))+'</span>';}).join('')+'</div>':'')+
        '<div class="ok-tray" style="margin-top:8px"><span class="lbl">'+(r.trayText||'Drag a piece onto the bar (or tap it):')+'</span>'+r.pieces.map(function(v){var w=Math.max(58,Math.round(v/max*(bars.clientWidth||560)));return '<span class="ok-src-piece" data-c="'+colorOf(v,r.base)+'" data-v="'+v+'" data-i="'+i+'" tabindex="0" role="button" aria-label="Add a '+(r.pieceLabel?r.pieceLabel(v):fmt(v)+' '+r.unit)+' piece" style="width:'+w+'px">'+(w>=40?(r.pieceLabel?r.pieceLabel(v):fmt(v)+' '+r.unit):'')+'</span>';}).join('')+'</div>';
      bars.appendChild(row);
      $$('.ok-src-piece',row).forEach(function(pc){var v=+pc.dataset.v;draggable(pc,function(){return {v:v,i:i};},function(target,pl){var b=target&&target.closest('.ok-barrow');if(b&&+b.dataset.i===pl.i)place(pl.i,pl.v);else if(b){say('That piece belongs on its own bar.','hint');snd.no();}},function(pl){place(pl.i,pl.v);});});
      $$('.ok-piece',row).forEach(function(pc,k){draggable(pc,function(){return {k:k,i:i};},function(target,pl){if(!target||!target.closest('.ok-barrow')){st.fill[pl.i].splice(pl.k,1);if(!compare)st.won[pl.i]=sum(pl.i)===rows[pl.i].target;save();render();}else render();},null);});
    });
    var cur=compare?null:rows[st.cur];
    var doEl=$('.ok-do',root),symEl=$('.ok-sym',root);
    if(compare){doEl.innerHTML=cfg.intro||'';symEl.innerHTML=cfg.sym?cfg.sym(rows.map(function(r,i){return sum(i);}),st):'';}
    else{var s=sum(st.cur),n=st.fill[st.cur].length,pv=cur.pieces[0];
      doEl.innerHTML=st.won[st.cur]?'<span class="ok-step" style="background:#1E8C5A">Full</span>'+cur.doneText:cur.text;
      symEl.innerHTML='<span class="big">'+n+' × '+(cur.pieceLabel?cur.pieceLabel(pv):fmt(pv)+' '+cur.unit)+' = '+fmt(s)+' '+cur.unit+'</span>'+(st.won[st.cur]?'<span class="exp">= '+cur.bigLabel+'</span>':'');
      if(st.won[st.cur]&&st.cur<rows.length-1&&!$('.ok-next',root)){var nb=document.createElement('button');nb.className='ok-btn ok-next';nb.type='button';nb.textContent='Next round →';nb.onclick=function(){st.cur++;save();say('');render();};$('.ok-row',root).appendChild(nb);}
      if((!st.won[st.cur]||st.cur>=rows.length-1)&&$('.ok-next',root))$('.ok-next',root).remove();}
  }
  if(cfg.rounds)$$('.ok-rounds button',root).forEach(function(b){b.onclick=function(){st.cur=+b.dataset.i;save();say('');render();};});
  $('.ok-undo',root).onclick=undo;
  $('.ok-reset',root).onclick=function(){visible().forEach(function(i){st.fill[i]=[];st.won[i]=false;});st.doneFired=false;save();say('');render();};
  render();
  return {state:st,sum:sum};
}
return {discMat:discMat,barStrip:barStrip,fmt:fmt,_draggable:draggable,_snd:snd,_ls:ls,_lsSet:lsSet,_fly:fly,_reduce:reduce};
})();

/* ═══ OAO MATH KIT, part 2 · Stamp Signs · Story Bar Model · Number Bond · Mental Math · Bonus Quest ═══
   Same rules as the Disc Mat and Bar Strip: plain pieces, labels on the model, one line of directions,
   drag AND tap, live symbols, gentle hints that point where to look, no motion under reduced motion. */
(function(K){
'use strict';
var fmt=K.fmt,draggable=K._draggable,snd=K._snd,ls=K._ls,lsSet=K._lsSet;
function $(s,r){return (r||document).querySelector(s);} function $$(s,r){return [].slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function num(v){var t=String(v==null?'':v).replace(/[,\s]/g,'');return t===''||isNaN(+t)?null:+t;}
function todo(lines){return lines&&lines.length?'<div class="mk-todo"><b>What to do</b><ol>'+lines.map(function(l){return '<li>'+l+'</li>';}).join('')+'</ol></div>':'';}

/* ═══════════ STAMP SIGNS ═══════════
   cfg = { key, todo:[…], signs:[{id, stall, q, ans, svg}], stamps:['×10','×100','×1,000'],
           miss:(sign)=>text, doneText, onStamp(signEl), onDone(root) } */
function stamps(m,cfg){
  var S=cfg.signs,st=ls(cfg.key,{})||{},sel=null,done={};
  m.innerHTML=todo(cfg.todo||['Look at each picture. How many of the small unit fit inside the big one?','Drag a stamp onto the sign it matches, or tap a stamp and then tap the sign.'])+
   '<div class="mk-signs">'+S.map(function(s){return '<div class="mk-sign" data-id="'+s.id+'" data-ans="'+esc(s.ans)+'" tabindex="0" role="button" aria-label="'+esc(s.stall+': '+s.q)+'"><div class="stall">'+s.stall+'</div>'+(s.svg||'')+'<div class="q">'+s.q+'</div><div class="slot">?</div></div>';}).join('')+'</div>'+
   '<div class="mk-stamps">'+(cfg.stamps||S.map(function(s){return s.ans;})).map(function(v){return '<button class="mk-stamp" type="button" data-v="'+esc(v)+'" aria-label="Stamp '+esc(v)+'"><span class="h"></span><span class="f">'+v+'</span></button>';}).join('')+'</div>'+
   '<div class="mk-fb" aria-live="polite"></div>';
  var fb=$('.mk-fb',m);
  Object.keys(st).forEach(function(k){var s=$('.mk-sign[data-id="'+k+'"]',m);if(!s)return;s.classList.add('ok');$('.slot',s).textContent=s.dataset.ans;done[k]=1;});
  function finish(){if(Object.keys(done).length===S.length){fb.className='mk-fb good';fb.textContent=cfg.doneText||'All signs stamped.';if(!st._fired){st._fired=1;lsSet(cfg.key,st);}if(cfg.onDone)cfg.onDone(m);}}
  function clearSel(){sel=null;$$('.mk-stamp',m).forEach(function(b){b.classList.remove('sel');});$$('.mk-sign',m).forEach(function(s){s.classList.remove('ready');});}
  function drop(sign,v){if(!sign||sign.classList.contains('ok'))return;
    if(v===sign.dataset.ans){sign.classList.add('ok');$('.slot',sign).textContent=v;snd.merge();done[sign.dataset.id]=1;st[sign.dataset.id]=1;lsSet(cfg.key,st);if(cfg.onStamp)cfg.onStamp(sign);
      var left=S.length-Object.keys(done).length;fb.className='mk-fb good';fb.textContent=left?'Stamped! '+left+' to go.':'';finish();}
    else{sign.classList.remove('no');void sign.offsetWidth;sign.classList.add('no');snd.no();fb.className='mk-fb hint';
      var s=S.filter(function(z){return z.id===sign.dataset.id;})[0];fb.textContent=cfg.miss?cfg.miss(s):'Not that stamp. Look at the '+s.stall.toLowerCase()+' picture again.';}
    clearSel();}
  $$('.mk-sign',m).forEach(function(s){s.addEventListener('click',function(){if(sel)drop(s,sel);});s.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&sel){e.preventDefault();drop(s,sel);}});});
  $$('.mk-stamp',m).forEach(function(b){
    draggable(b,function(){return b.dataset.v;},function(t,v){drop(t&&t.closest('.mk-sign'),v);},function(v){var was=sel===v;clearSel();if(!was){sel=v;b.classList.add('sel');$$('.mk-sign:not(.ok)',m).forEach(function(s){s.classList.add('ready');});fb.className='mk-fb';fb.textContent='Now tap the sign that needs '+v+'.';}});
  });
  if(Object.keys(done).length===S.length)finish();
  return {done:function(){return Object.keys(done).length===S.length;}};
}

/* ═══════════ STORY BAR MODEL ("draw the story") ═══════════
   Students tap (or drag) each fact in the story onto the part of the bar it describes, find the "?", then answer.
   cfg = { key, kind:'part-whole'|'compare', unit:'m',
           story:[ 'plain text', {t:'Amy\'s road is 1 km long.', put:'whole', label:'1 km = 1,000 m'}, … ],
           units:['m','cm'] + answer:[4,95] + rate:100 → two answer boxes; mistakes are matched on the total in the small unit
           part-whole → whole:{label}, parts:[{id:'p0', value:400, name:'already driven'}, {id:'p1', value:600, name:'still to go', unknown:true}]
           compare    → bars:[{id:'b0', name:'Amy', value:900}, {id:'b1', name:'Mo', value:600}], diff:{value:300, unknown:true}
           question, answer, accept:[…], mistakes:[{value:1400, text:'…'}], hint, sym:'1,000 − 400 = 600', doneText, onDone(root) }
   Ids you can `put` onto: 'whole', each part id, each bar id, 'diff'. */
function barModel(m,cfg){
  var key=cfg.key,st=ls(key,null)||{placed:{},answered:false,ans:''};st.placed=st.placed||{};
  var chunks=cfg.story.map(function(c,i){return typeof c==='string'?{t:c}:Object.assign({i:i},c);});
  var facts=chunks.filter(function(c){return c.put;});
  var sel=null,unit=cfg.unit?' '+cfg.unit:'';
  var segs=[];
  if(cfg.kind==='compare'){cfg.bars.forEach(function(b){segs.push(b.id);});if(cfg.diff)segs.push('diff');}
  else{segs.push('whole');cfg.parts.forEach(function(p){segs.push(p.id);});}
  m.innerHTML=todo(cfg.todo||['Tap a fact in the story, then tap the part of the bar it tells about. You can drag it there too.','When every fact is on the bar, find the <b>?</b> and answer the question.'])+
    '<div class="bm-story"></div><div class="bm-model" aria-label="Bar model"></div><div class="bm-ask"></div><div class="ok-msg" aria-live="polite"></div>';
  var storyEl=$('.bm-story',m),modelEl=$('.bm-model',m),askEl=$('.bm-ask',m),msg=$('.ok-msg',m);
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.textContent=t||'';}
  function save(){lsSet(key,st);}
  function allPlaced(){return facts.every(function(f){return st.placed[f.i];});}
  function segLabel(id){var f=facts.filter(function(x){return x.put===id&&st.placed[x.i];})[0];return f?(f.label||f.t):'';}
  function isUnknown(id){if(id==='diff')return cfg.diff&&cfg.diff.unknown;var p=(cfg.parts||cfg.bars||[]).filter(function(z){return z.id===id;})[0];return p&&p.unknown;}
  function render(){
    storyEl.innerHTML='<p>'+chunks.map(function(c){if(!c.put)return esc(c.t)+' ';var on=st.placed[c.i];return '<button type="button" class="bm-fact'+(on?' used':'')+(sel===c.i?' sel':'')+'" data-i="'+c.i+'"'+(on?' disabled':'')+'>'+esc(c.t)+'</button> ';}).join('')+'</p>';
    var h='';
    if(cfg.kind==='compare'){
      var max=Math.max.apply(null,cfg.bars.map(function(b){return b.value;}));
      cfg.bars.forEach(function(b,k){var w=b.value/max*100;
        h+='<div class="bm-row"><div class="bm-name">'+esc(b.name)+'</div><div class="bm-track"><div class="bm-seg bm-c'+k+(st.placed&&segLabel(b.id)?' filled':'')+'" data-seg="'+b.id+'" style="width:'+w+'%">'+(segLabel(b.id)?esc(segLabel(b.id)):(isUnknown(b.id)&&allPlaced()?'<b class="bm-q">?</b>':'<span class="bm-empty">tap here</span>'))+'</div>';
        if(cfg.diff&&k===cfg.bars.length-1){var lo=Math.min.apply(null,cfg.bars.map(function(z){return z.value;}));var dw=(max-lo)/max*100;
          h+='<div class="bm-seg bm-diff'+(segLabel('diff')?' filled':'')+'" data-seg="diff" style="left:'+(lo/max*100)+'%;width:'+dw+'%">'+(segLabel('diff')?esc(segLabel('diff')):(isUnknown('diff')&&allPlaced()?'<b class="bm-q">?</b>':'<span class="bm-empty">tap here</span>'))+'</div>';}
        h+='</div></div>';});
    }else{
      var tot=cfg.parts.reduce(function(a,p){return a+p.value;},0);
      h+='<div class="bm-row"><div class="bm-name">'+esc(cfg.whole&&cfg.whole.name||'whole')+'</div><div class="bm-track"><div class="bm-brace bm-seg'+(segLabel('whole')?' filled':'')+'" data-seg="whole" style="width:100%">'+(segLabel('whole')?esc(segLabel('whole')):(cfg.whole&&cfg.whole.unknown&&allPlaced()?'<b class="bm-q">?</b>':'<span class="bm-empty">tap here</span>'))+'</div></div></div>';
      h+='<div class="bm-row"><div class="bm-name">'+esc(cfg.partsName||'parts')+'</div><div class="bm-track bm-split">'+cfg.parts.map(function(p,k){return '<div class="bm-seg bm-c'+k+(segLabel(p.id)?' filled':'')+'" data-seg="'+p.id+'" style="width:'+(p.value/tot*100)+'%"><span class="bm-pn">'+esc(p.name||'')+'</span>'+(segLabel(p.id)?esc(segLabel(p.id)):(p.unknown&&allPlaced()?'<b class="bm-q">?</b>':'<span class="bm-empty">tap here</span>'))+'</div>';}).join('')+'</div></div>';
    }
    modelEl.innerHTML=h;
    $$('.bm-fact',storyEl).forEach(function(b){var i=+b.dataset.i;if(b.disabled)return;
      draggable(b,function(){return i;},function(t,ii){var s=t&&t.closest('.bm-seg');if(s)put(ii,s.dataset.seg);},function(ii){sel=sel===ii?null:ii;render();if(sel!=null)say('Now tap the part of the bar this fact tells about.','');});});
    $$('.bm-seg',modelEl).forEach(function(s){s.setAttribute('tabindex','0');s.setAttribute('role','button');
      s.onclick=function(){if(sel!=null)put(sel,s.dataset.seg);else if(!allPlaced())say('First tap a fact in the story.','hint');};
      s.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();s.onclick();}};});
    if(allPlaced()){
      var U=cfg.units,sa=st.ans||(U?[]:'');
      askEl.innerHTML='<p class="bm-qtext">'+esc(cfg.question)+'</p><form class="bm-form">'+(U?U.map(function(u,k){return '<input type="text" inputmode="numeric" autocomplete="off" aria-label="Your answer, '+esc(u)+'" value="'+esc(sa[k]||'')+'"><span class="bm-u">'+esc(u)+'</span>';}).join(''):'<input type="text" inputmode="numeric" autocomplete="off" aria-label="Your answer" value="'+esc(sa)+'">'+(cfg.unit?'<span class="bm-u">'+esc(cfg.unit)+'</span>':''))+'<button type="submit" class="ok-btn">Check</button></form>'+(st.answered?'<div class="ok-sym"><span class="big">'+esc(cfg.sym||'')+'</span></div>':'');
      var f=$('form',askEl),inp=$('input',f);
      f.onsubmit=function(e){e.preventDefault();var v,ok,ins=$$('input',f);
        if(U){var vs=ins.map(function(x){return num(x.value);});st.ans=ins.map(function(x){return x.value;});save();
          if(vs.some(function(x){return x==null;})){say('Type a number in each box.','hint');return;}
          var rate=cfg.rate||100;v=vs[0]*rate+vs[1];var want=cfg.answer[0]*rate+cfg.answer[1];
          ok=vs[0]===cfg.answer[0]&&vs[1]===cfg.answer[1];
          if(!ok&&v===want&&cfg.anyForm){st.answered=true;save();snd.done();say(cfg.anyFormText||cfg.doneText||'Yes! That is the right amount.','good');render();if(cfg.onDone&&!st.fired){st.fired=1;save();cfg.onDone(m);}return;}
          if(!ok&&v===want){snd.no();say('That\'s the right amount! But '+fmt(vs[1])+' '+U[1]+' is '+fmt(rate)+' '+U[1]+' or more. Can you trade '+fmt(rate)+' '+U[1]+' for 1 '+U[0]+'?','hint');return;}}
        else{v=num(inp.value);st.ans=inp.value;save();
          if(v==null){say('Type a number first.','hint');return;}
          ok=[cfg.answer].concat(cfg.accept||[]).some(function(a){return num(a)===v;});}
        if(ok){st.answered=true;save();snd.done();say(cfg.doneText||'Yes! The bar model shows it.','good');render();if(cfg.onDone&&!st.fired){st.fired=1;save();cfg.onDone(m);}return;}
        var mk=(cfg.mistakes||[]).filter(function(z){return num(z.value)===v;})[0];snd.no();say(mk?mk.text:(cfg.hint||'Look at the bar again. Is the ? the whole bar or one part?'),'hint');};
      if(st.answered)$$('input',f).forEach(function(x){x.disabled=true;});
    }else askEl.innerHTML='';
  }
  function put(i,seg){var f=facts.filter(function(x){return x.i===i;})[0];if(!f)return;
    if(f.put!==seg){snd.no();say(f.miss||'Read that fact again. Which part of the bar does it tell about?','hint');sel=null;render();return;}
    st.placed[i]=1;sel=null;snd.merge();save();say(allPlaced()?'Every fact is on the bar. Find the ?':'Good. Place the next fact.','good');render();}
  render();
  return {state:st};
}

/* ═══════════ NUMBER BOND ═══════════
   cfg = { key, text, rounds:[{whole:46, parts:[1,45], hide:'whole'|0|1, unit:'', note:'…'}], onRound(i,root), onDone(root) } */
function numberBond(m,cfg){
  var st=ls(cfg.key,null)||{cur:0,won:[]};var R=cfg.rounds;
  m.innerHTML=(cfg.text?'<p class="nb-text">'+cfg.text+'</p>':'')+'<div class="nb-wrap"></div><div class="ok-msg" aria-live="polite"></div><div class="nb-nav"></div>';
  var wrap=$('.nb-wrap',m),msg=$('.ok-msg',m),nav=$('.nb-nav',m);
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.textContent=t||'';}
  function circ(cls,val,hidden,i){var u=R[i].unit?'<small>'+esc(R[i].unit)+'</small>':'';
    return '<div class="nb-c '+cls+(hidden&&!st.won[i]?' nb-hide':'')+'">'+(hidden&&!st.won[i]?'<input type="text" inputmode="numeric" aria-label="Missing number" autocomplete="off">':'<span>'+fmt(val)+'</span>')+u+'</div>';}
  function render(){var i=st.cur,r=R[i];
    wrap.innerHTML='<div class="nb"><svg class="nb-lines" viewBox="0 0 300 150" aria-hidden="true"><path d="M150 52 L70 112 M150 52 L230 112" stroke="#3B2417" stroke-width="4"/></svg>'+
      circ('nb-whole',r.whole,r.hide==='whole',i)+circ('nb-p0',r.parts[0],r.hide===0,i)+circ('nb-p1',r.parts[1],r.hide===1,i)+'</div>'+
      '<div class="nb-eq">'+(st.won[i]?fmt(r.whole)+' = '+fmt(r.parts[0])+' + '+fmt(r.parts[1])+(r.note?'<small>'+esc(r.note)+'</small>':''):'Find the missing number.')+'</div>';
    var inp=$('input',wrap);
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();check(inp);}});}
    nav.innerHTML='<span class="nb-count">Bond '+(i+1)+' of '+R.length+'</span>'+(inp?'<button type="button" class="ok-btn nb-check">Check</button>':'')+(st.won[i]&&i<R.length-1?'<button type="button" class="ok-btn ok-next">Next bond →</button>':'');
    var c=$('.nb-check',nav);if(c)c.onclick=function(){check(inp);};
    var n=$('.ok-next',nav);if(n)n.onclick=function(){st.cur++;lsSet(cfg.key,st);say('');render();};
  }
  function check(inp){var r=R[st.cur],v=num(inp.value),want=r.hide==='whole'?r.whole:r.parts[r.hide];
    if(v==null){say('Type a number.','hint');return;}
    if(v===want){st.won[st.cur]=true;lsSet(cfg.key,st);snd.merge();say(st.cur===R.length-1?(cfg.doneText||'All bonds done!'):'Yes!','good');if(cfg.onRound)cfg.onRound(st.cur,m);render();
      if(st.won.filter(Boolean).length===R.length&&cfg.onDone&&!st.fired){st.fired=1;lsSet(cfg.key,st);cfg.onDone(m);}}
    else{snd.no();say(r.hide==='whole'?'The whole is both parts put together. Add them.':'The two parts make the whole. What goes with '+fmt(r.parts[r.hide===0?1:0])+' to make '+fmt(r.whole)+'?','hint');}}
  render();return {state:st};
}

/* ═══════════ MENTAL MATH WARM-UP ═══════════
   One strategy, shown once with a number bond, then 4–6 quick problems.
   cfg = { key, name:'Make a hundred', how:'one sentence', example:{q:'99 + 46', bond:{whole:46, parts:[1,45]}, steps:['99 + 1 = 100','100 + 45 = 145']},
           problems:[{q:'98 + 37', a:135, hint:'Take 2 from 37 to make 100.'}], onRight(i,el), onDone(root) }
   a problem may add lead:'1 m' (before the box) and post:'cm' (after it): 60 cm + 55 cm = 1 m [__] cm
   or the box in the middle: {pre:'65 cm +', post:'cm = 1 m', a:35}
   or a two-unit answer: {q:'60 cm + 55 cm', units:['m','cm'], a:[1,15], rate:100} → '60 cm + 55 cm = ?' then [__] m [__] cm */
function mentalMath(m,cfg){
  var st=ls(cfg.key,null)||{a:{},ok:{}};var P=cfg.problems,ex=cfg.example||{};
  var bond=ex.bond?'<div class="mm-bond" aria-label="'+fmt(ex.bond.whole)+' splits into '+fmt(ex.bond.parts[0])+' and '+fmt(ex.bond.parts[1])+'"><span class="w">'+fmt(ex.bond.whole)+'</span><svg viewBox="0 0 80 26" aria-hidden="true"><path d="M40 2 L14 24 M40 2 L66 24" stroke="#3B2417" stroke-width="3"/></svg><span class="p">'+fmt(ex.bond.parts[0])+'</span><span class="p">'+fmt(ex.bond.parts[1])+'</span></div>':'';
  m.innerHTML='<div class="mm-card"><div class="mm-name">🧠 Mental math: '+esc(cfg.name)+'</div><p class="mm-how">'+cfg.how+'</p>'+
    (ex.q?'<div class="mm-ex"><div class="mm-q">'+esc(ex.q)+'</div>'+bond+'<ol class="mm-steps">'+(ex.steps||[]).map(function(s){return '<li>'+esc(s)+'</li>';}).join('')+'</ol></div>':'')+'</div>'+
    '<div class="mm-probs">'+P.map(function(p,i){var id='mm-'+cfg.key+'-'+i;
      if(p.units){var sv=st.a[i]||[];return '<form class="mm-p mm-two" data-i="'+i+'"><div class="mm-q2">'+esc(p.q)+' = ?</div><div class="mm-ins">'+
        p.units.map(function(u,k){return '<input id="'+id+(k?'-'+k:'')+'" type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(p.q)+', '+(u==='m'?'meters':u==='cm'?'centimeters':u)+'" value="'+esc(sv[k]||'')+'"><span class="mm-u">'+esc(u)+'</span>';}).join('')+
        '<button type="submit" class="ok-btn">Check</button></div><span class="mm-fb" aria-live="polite"></span></form>';}
      if(p.pre)return '<form class="mm-p" data-i="'+i+'"><span class="mm-eq"><label for="'+id+'">'+esc(p.pre)+'</label><input id="'+id+'" type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(p.pre+' ? '+(p.post||''))+'" value="'+esc(st.a[i]||'')+'"><span class="mm-post">'+esc(p.post||'')+'</span></span><button type="submit" class="ok-btn">Check</button><span class="mm-fb" aria-live="polite"></span></form>';
      /* cfg.work:'bond' (Bethany, 3 Nov 2026): when the strategy is a number bond, every problem gets its own blank bond to use:
         the whole is given, the two parts are blank, and each part has a blank "× n =" under it. Optional help; only the answer is checked. */
      if(cfg.work==='bond'){var mt=/(\d+)\s*[×x]\s*(\d+)/.exec(p.q)||[],wh=p.whole||+mt[1],by=p.by||+mt[2],w=(st.w||{})[i]||{};
        var bi=function(k,lab){return '<input class="mm-sm" data-k="'+k+'" type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(lab)+'" value="'+esc(w[k]||'')+'">';};
        return '<form class="mm-p mm-bondp" data-i="'+i+'"><div class="mm-work" role="group" aria-label="Number bond for '+esc(p.q)+' (optional)">'+
          '<div class="mm-bond mm-bond-in"><span class="w">'+fmt(wh)+'</span><svg viewBox="0 0 80 26" aria-hidden="true"><path d="M40 2 L14 24 M40 2 L66 24" stroke="#3B2417" stroke-width="3"/></svg>'+
          '<span class="pc">'+bi('p0','first part of '+wh)+'<span class="mm-x">× '+fmt(by)+' =</span>'+bi('q0','first part times '+by)+'</span>'+
          '<span class="pc">'+bi('p1','second part of '+wh)+'<span class="mm-x">× '+fmt(by)+' =</span>'+bi('q1','second part times '+by)+'</span></div></div>'+
          '<div class="mm-row"><label for="'+id+'">'+esc(p.q)+' =</label><input class="mm-ans" id="'+id+'" type="text" inputmode="numeric" autocomplete="off" value="'+esc(st.a[i]||'')+'"><button type="submit" class="ok-btn">Check</button></div><span class="mm-fb" aria-live="polite"></span></form>';}
      return '<form class="mm-p" data-i="'+i+'"><label for="'+id+'">'+esc(p.q)+' ='+(p.lead?' '+esc(p.lead):'')+'</label><input id="'+id+'" type="text" inputmode="numeric" autocomplete="off" value="'+esc(st.a[i]||'')+'">'+(p.post?'<span class="mm-post">'+esc(p.post)+'</span>':'')+'<button type="submit" class="ok-btn">Check</button><span class="mm-fb" aria-live="polite"></span></form>';}).join('')+'</div>';
  $$('.mm-p',m).forEach(function(f){var i=+f.dataset.i,all=$$('input',f),ins=$$('input.mm-ans',f),fb=$('.mm-fb',f),p=P[i];if(!ins.length)ins=all;
    if(f.classList.contains('mm-bondp')){var mt=/(\d+)\s*[×x]\s*(\d+)/.exec(p.q)||[],wh=p.whole||+mt[1],by=p.by||+mt[2],W=function(k){return $('[data-k="'+k+'"]',f);};
      var paint=function(){var a=num(W('p0').value),b=num(W('p1').value),split=a!=null&&b!=null&&a+b===wh;
        W('p0').classList.toggle('good',split);W('p1').classList.toggle('good',split);
        ['0','1'].forEach(function(k){var pt=num(W('p'+k).value),q=num(W('q'+k).value);W('q'+k).classList.toggle('good',pt!=null&&q!=null&&q===pt*by);});};
      $$('.mm-sm',f).forEach(function(x){x.addEventListener('input',function(){st.w=st.w||{};var o=st.w[i]=st.w[i]||{};o[x.dataset.k]=x.value;lsSet(cfg.key,st);paint();});});paint();}
    function mark(){f.classList.add('ok');all.forEach(function(x){x.disabled=true;});fb.textContent='✓';}
    function miss(t){snd.no();f.classList.remove('no');void f.offsetWidth;f.classList.add('no');fb.textContent=t;}
    if(st.ok[i])mark();
    f.onsubmit=function(e){e.preventDefault();
      if(p.units){var vs=ins.map(function(x){return num(x.value);});st.a[i]=ins.map(function(x){return x.value;});lsSet(cfg.key,st);
        if(vs.some(function(v){return v==null;}))return miss('Type a number in each box.');
        var ok=vs.every(function(v,k){return v===p.a[k];});
        if(!ok){var rate=p.rate||100,tot=vs[0]*rate+vs[1],want=p.a[0]*rate+p.a[1];
          if(tot===want&&vs[1]>=rate)return miss('Right amount, but '+fmt(vs[1])+' '+p.units[1]+' is too many. Trade each '+fmt(rate)+' '+p.units[1]+' for 1 '+p.units[0]+'.');
          return miss(p.hint||('Try the strategy: '+cfg.name.toLowerCase()+'.'));}}
      else{var v=num(ins[0].value);st.a[i]=ins[0].value;lsSet(cfg.key,st);if(v==null)return miss('Type a number.');if(v!==p.a)return miss(p.hint||('Try the strategy: '+cfg.name.toLowerCase()+'.'));}
      st.ok[i]=1;lsSet(cfg.key,st);snd.merge();mark();if(cfg.onRight)cfg.onRight(i,f);
      if(Object.keys(st.ok).length===P.length&&cfg.onDone&&!st.fired){st.fired=1;lsSet(cfg.key,st);cfg.onDone(m);}};});
  return {state:st};
}

/* ═══════════ BONUS QUEST (optional challenge, the teacher's guide "Extend") ═══════════
   cfg = { key, title, text (html), answer, accept:[…], unit, hint, explain (html), onDone(root) } */
function challenge(m,cfg){
  var st=ls(cfg.key,null)||{ans:'',done:false,miss:0};
  m.innerHTML='<details class="ch-card"'+(st.done?' open':'')+'><summary><span class="ch-star">★</span> '+esc(cfg.title||'Bonus quest')+' <span class="ch-opt">optional · for when you want a harder one</span></summary>'+
    '<div class="ch-body"><div class="ch-text">'+cfg.text+'</div><form class="ch-form"><input type="text" inputmode="numeric" autocomplete="off" aria-label="Bonus answer" value="'+esc(st.ans)+'">'+(cfg.unit?'<span class="bm-u">'+esc(cfg.unit)+'</span>':'')+'<button type="submit" class="ok-btn">Check</button><button type="button" class="ok-btn ch-hint" hidden>Hint</button></form><div class="ok-msg" aria-live="polite"></div><div class="ch-explain"'+(st.done?'':' hidden')+'>'+(cfg.explain||'')+'</div></div></details>';
  var f=$('form',m),inp=$('input',f),msg=$('.ok-msg',m),hb=$('.ch-hint',m),exp=$('.ch-explain',m);
  if(st.done){inp.disabled=true;msg.className='ok-msg good';msg.textContent='Bonus quest complete!';}
  if(st.miss&&!st.done)hb.hidden=false;
  hb.onclick=function(){msg.className='ok-msg hint';msg.textContent=cfg.hint||'';};
  f.onsubmit=function(e){e.preventDefault();var v=num(inp.value);st.ans=inp.value;lsSet(cfg.key,st);if(v==null){msg.className='ok-msg hint';msg.textContent='Type a number.';return;}
    if([cfg.answer].concat(cfg.accept||[]).some(function(a){return num(a)===v;})){st.done=true;lsSet(cfg.key,st);snd.done();inp.disabled=true;msg.className='ok-msg good';msg.textContent='Bonus quest complete!';exp.hidden=false;if(cfg.onDone)cfg.onDone(m);}
    else{st.miss=(st.miss||0)+1;lsSet(cfg.key,st);snd.no();hb.hidden=false;msg.className='ok-msg hint';msg.textContent='Not yet. Try again, or tap Hint.';}};
  return {state:st};
}

/* ═══════════ TWO-UNIT MAT ═══════════
   A Disc Mat for amounts with two units (1 m 65 cm, 2 L 750 mL, 6 kg 5 g). The big unit is one column; the small unit
   is split into place-value pieces so students trade 10 small for 1 bigger, and 1 big = cfg.big small (100 or 1,000).
   cfg = discMat cfg + { big:100, bigUnit:'m', smallUnit:'cm', places:[100,10,1], names, short, discLabel,
           adds:[{label:'+ Add plank 2', of:{100:1,10:6,1:5}, when:(st,api)=>bool, notYet, said}], lead:(api)=>html } */
function unitMat(root,cfg){
  var big=cfg.big,bu=cfg.bigUnit,su=cfg.smallUnit;
  function split(api){var b=api.st.c[big]||0;return [b,api.value()-b*big];}
  var c2={};for(var k in cfg)c2[k]=cfg[k];
  if(!c2.groups)c2.groups=[{label:bu,span:1},{label:su,span:cfg.places.length-1}];
  if(!c2.sym)c2.sym=function(api){var x=split(api),v=api.value();
    var s=(cfg.lead?cfg.lead(api):'')+'<span class="big">'+x[0]+' '+bu+' '+fmt(x[1])+' '+su+'</span>';
    if(x[1]>=big)s+='<span class="exp warn">'+fmt(x[1])+' '+su+' is more than 1 '+bu+'. Trade to regroup.</span>';
    else if(v)s+='<span class="exp">= '+fmt(v)+' '+su+' in all</span>';
    return s;};
  var api=K.discMat(root,c2);root.classList.add('ok-unitmat');
  api.big=function(){return split(api)[0];};api.small=function(){return split(api)[1];};
  api.regrouped=function(){return split(api)[1]<big;};
  return api;
}
/* ═══════════ TRADE MAT (any rate: 12 in = 1 ft, 16 oz = 1 lb, 60 s = 1 min) ═══════════
   Two columns (the big unit and the small unit) and a trade rate that is not a power of ten. Students build an amount,
   trade `rate` small discs for 1 big one (or break 1 big into `rate` small), and take an amount away into the take-away box,
   so adding and subtracting with a trade is hands-on. Big discs are green (data-p 10), small discs orange (data-p 1).
   cfg = { key, rate:12, big:{unit:'ft', name:['foot','feet']}, small:{unit:'in', name:['inch','inches']},
           start:{big:0, small:0}, tray:true, perRow:{big:2, small:4}, noBreak, noAdd,
           zone:{title:'Take away', btn:'Take away 1 →', want:{big:2, small:6}, over:(api)=>text},   // optional take-away box
           steps:[{text, done:(st,api)=>bool}], sym:(api)=>html, doneText, doneMsg, onDone(api,root), onChange(api) } */
function tradeMat(root,cfg){
  var R=cfg.rate,B=cfg.big,Sm=cfg.small,key=cfg.key,Z=cfg.zone;
  var st=ls(key,null)||{b:(cfg.start&&cfg.start.big)||0,s:(cfg.start&&cfg.start.small)||0,zb:0,zs:0,doneFired:false};
  var CAP=2*R-1;
  function nm(u,n){return n===1?u.name[0]:u.name[1];}
  function amt(b,s){return b+' '+B.unit+' '+s+' '+Sm.unit;}
  var api={st:st,fmt:fmt,value:function(){return st.b*R+st.s;},zoneValue:function(){return st.zb*R+st.zs;},text:function(){return amt(st.b,st.s);},zoneText:function(){return amt(st.zb,st.zs);},rate:R};
  root.classList.add('ok-tool');root.classList.add('ok-trademat');
  root.innerHTML='<p class="ok-do" aria-live="polite"></p><div class="ok-matwrap"><div class="ok-mat" style="grid-template-columns:1fr 1fr">'
    +[['10',B,'big'],['1',Sm,'small']].map(function(c){var u=c[1];return '<div class="ok-col" data-p="'+c[0]+'" data-k="'+c[2]+'"><div class="ok-head"><b><span class="ok-full">'+esc(u.name[1])+'</span><span class="ok-short">'+esc(u.unit)+'</span></b><span>'+(c[2]==='big'?'1 '+esc(u.unit)+' = '+R+' '+esc(Sm.unit):'1 '+esc(u.unit)+' each')+'</span></div><div class="ok-count">0</div><div class="ok-well" style="--per:'+((cfg.perRow||{})[c[2]]||(c[2]==='big'?2:4))+'"></div><div class="ok-colbtns"></div></div>';}).join('')
    +'</div>'+(Z?'<div class="ok-zone away"><h5>'+Z.title+'</h5><div class="ok-zwell"></div><div class="ok-ztot"></div></div>':'')+'</div>'
    +(cfg.tray!==false?'<div class="ok-tray"><span class="lbl">'+(cfg.trayText||'Drag a disc onto the mat (or tap it):')+'</span><span class="ok-src"><span class="ok-disc" data-p="10" data-k="big" data-src="1" tabindex="0" role="button" aria-label="Add 1 '+esc(B.name[0])+'">1 '+esc(B.unit)+'</span></span><span class="ok-src"><span class="ok-disc" data-p="1" data-k="small" data-src="1" tabindex="0" role="button" aria-label="Add 1 '+esc(Sm.name[0])+'">1 '+esc(Sm.unit)+'</span></span></div>':'')
    +'<div class="ok-sym" aria-live="polite"></div><div class="ok-msg" aria-live="polite"></div><div class="ok-row"><button class="ok-btn ok-reset" type="button">↺ Start over</button></div>';
  var msg=$('.ok-msg',root);
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.textContent=t||'';}
  function save(){lsSet(key,st);}
  function col(k){return $('.ok-col[data-k="'+k+'"]',root);}
  function add(k){if(cfg.noAdd){say(cfg.noAddText||'This one starts with the amount already built. Trade, break or take away instead.','hint');snd.no();render();return;}
    if(k==='small'&&st.s>=CAP){say('That column is full. Trade '+R+' '+Sm.name[1]+' for 1 '+B.name[0]+'.','hint');snd.no();return;}
    if(k==='big'&&st.b>=19){say('That column is full.','hint');snd.no();return;}
    st[k==='big'?'b':'s']++;snd.click();after({pop:k});}
  function remove(k){if(cfg.noRemove){say('Keep every disc on the mat for this one.','hint');snd.no();render();return;}st[k==='big'?'b':'s']--;snd.click();after({});}
  function trade(){if(st.s<R){say('You need '+R+' '+Sm.name[1]+' to make 1 '+B.name[0]+'. You have '+st.s+'.','hint');snd.no();render();return;}
    var from=$$('.ok-well .ok-disc',col('small')).slice(-R).map(function(d){return d.getBoundingClientRect();}),tmpl=$('.ok-well .ok-disc',col('small'));
    st.s-=R;st.b++;snd.merge();after({pop:'big',flyFrom:from,flyTo:'big',tmpl:tmpl});say(R+' '+Sm.name[1]+' → 1 '+B.name[0]+'. Same amount, fewer pieces.','good');}
  function brk(){if(!st.b)return;if(st.s+R>CAP){say('Trade some '+Sm.name[1]+' first. That column is too full.','hint');snd.no();return;}
    var src=$$('.ok-well .ok-disc',col('big')).slice(-1)[0];var r=src&&src.getBoundingClientRect();
    st.b--;st.s+=R;snd.split();after({popMany:['small',R],flyFrom:r?[r]:null,flyTo:'small',tmpl:src});say('1 '+B.name[0]+' → '+R+' '+Sm.name[1]+'. Same amount, more pieces.','good');}
  function toZone(k){if(!Z)return;var want=Z.want;
    if(want){var nb=st.zb+(k==='big'?1:0),ns=st.zs+(k==='small'?1:0);
      if(nb>want.big||ns>want.small){say(Z.over?Z.over(api,k):'That is more than you need to take away. Take away exactly '+amt(want.big,want.small)+'.','hint');snd.no();render();return;}}
    if(k==='big'){if(!st.b)return;st.b--;st.zb++;}else{if(!st.s){say('There are no '+Sm.name[1]+' to take. Break 1 '+B.name[0]+' into '+R+' '+Sm.name[1]+' first.','hint');snd.no();render();return;}st.s--;st.zs++;}
    snd.click();after({});}
  function fromZone(k){if(k==='big'){st.zb--;st.b++;}else{st.zs--;st.s++;}snd.click();after({});}
  function dropDisc(target,pl){
    if(!target){if(pl.from==='col')remove(pl.k);render();return;}
    var c=target.closest('.ok-col'),zone=target.closest('.ok-zone'),tray=target.closest('.ok-tray');
    if(pl.from==='src'){if(c||target.closest('.ok-mat'))add(pl.k);return;}
    if(pl.from==='zone'){if(c||target.closest('.ok-mat'))fromZone(pl.k);return;}
    if(zone){toZone(pl.k);return;}
    if(c){var q=c.dataset.k;if(q===pl.k){render();return;}if(pl.k==='small'&&q==='big')return trade();if(pl.k==='big'&&q==='small')return brk();}
    if(tray||!target.closest('.ok-tool'))return remove(pl.k);
    render();
  }
  function after(anim){save();render(anim);if(cfg.onChange)cfg.onChange(api);}
  function render(anim){anim=anim||{};
    [['big','b','10'],['small','s','1']].forEach(function(c){var k=c[0],n=st[c[1]],cEl=col(k),w=$('.ok-well',cEl),u=k==='big'?B:Sm;
      w.innerHTML='';for(var i=0;i<n;i++){var d=document.createElement('span');d.className='ok-disc';d.dataset.p=c[2];d.dataset.k=k;d.textContent='1 '+u.unit;d.tabIndex=-1;
        if(anim.pop===k&&i===n-1&&!anim.flyFrom)d.classList.add('ok-in');
        if(anim.popMany&&anim.popMany[0]===k&&i>=n-anim.popMany[1]){d.classList.add('ok-in');d.style.animationDelay=((i-(n-anim.popMany[1]))*35+(anim.flyFrom?380:0))+'ms';}
        if(anim.flyTo===k&&anim.pop===k&&i===n-1){d.style.visibility='hidden';(function(dd){setTimeout(function(){dd.style.visibility='';dd.classList.add('ok-in');},K._reduce?0:470);})(d);}
        (function(dd){draggable(dd,function(){return {k:k,from:'col'};},dropDisc,null);})(d);w.appendChild(d);}
      $('.ok-count',cEl).textContent=n;cEl.classList.toggle('full',k==='small'&&n>=R);
      var bb=$('.ok-colbtns',cEl);bb.innerHTML='';
      if(k==='small'&&n>=R){var g=document.createElement('button');g.className='ok-btn';g.type='button';g.textContent='← Trade '+R+' for 1';g.onclick=trade;bb.appendChild(g);}
      if(k==='big'&&n>0&&!cfg.noBreak){var bk=document.createElement('button');bk.className='ok-btn';bk.type='button';bk.textContent='Break 1 into '+R+' →';bk.onclick=brk;bb.appendChild(bk);}
      if(Z&&n>0){var zb=document.createElement('button');zb.className='ok-btn';zb.type='button';zb.textContent=Z.btn||'Take away 1 →';zb.onclick=function(){toZone(k);};bb.appendChild(zb);}
    });
    if(anim.flyFrom&&anim.tmpl){var tw=$('.ok-well',col(anim.flyTo)),tl=$$('.ok-disc',tw);var tr=(tl[tl.length-1]||tw).getBoundingClientRect();anim.flyFrom.forEach(function(r,i){K._fly(r,tr,anim.tmpl,i*25);});}
    if(Z){var zw=$('.ok-zwell',root);zw.innerHTML='';[['big',st.zb,'10',B],['small',st.zs,'1',Sm]].forEach(function(c){for(var i=0;i<c[1];i++){var d=document.createElement('span');d.className='ok-disc';d.dataset.p=c[2];d.dataset.k=c[0];d.textContent='1 '+c[3].unit;(function(dd,k){draggable(dd,function(){return {k:k,from:'zone'};},dropDisc,null);})(d,c[0]);zw.appendChild(d);}});
      $('.ok-ztot',root).innerHTML=Z.total?Z.total(api):(st.zb||st.zs?amt(st.zb,st.zs):'');}
    $('.ok-sym',root).innerHTML=cfg.sym?cfg.sym(api):defaultSym();
    var steps=cfg.steps||[],i=0;while(i<steps.length&&steps[i].done(st,api))i++;
    var doEl=$('.ok-do',root);
    if(i<steps.length){doEl.innerHTML=(steps.length>1?'<span class="ok-step">Step '+(i+1)+' of '+steps.length+'</span>':'')+steps[i].text;}
    else{doEl.innerHTML='<span class="ok-step" style="background:#1E8C5A">Done</span>'+(cfg.doneText||'Nice work.');
      if(!st.doneFired){st.doneFired=true;save();snd.done();say(cfg.doneMsg||'',cfg.doneMsg?'good':'');if(cfg.onDone)cfg.onDone(api,root);}}
  }
  function defaultSym(){var s='<span class="big">'+amt(st.b,st.s)+'</span>';
    if(st.s>=R)s+='<span class="exp warn">'+st.s+' '+Sm.name[1]+' is '+R+' or more. Trade '+R+' '+Sm.name[1]+' for 1 '+B.name[0]+'.</span>';
    else if(st.b||st.s)s+='<span class="exp">= '+fmt(api.value())+' '+Sm.unit+' in all</span>';
    return s;}
  $$('.ok-tray .ok-disc',root).forEach(function(d){var k=d.dataset.k;draggable(d,function(){return {k:k,from:'src'};},dropDisc,function(){add(k);});});
  $('.ok-reset',root).onclick=function(){st.b=(cfg.start&&cfg.start.big)||0;st.s=(cfg.start&&cfg.start.small)||0;st.zb=0;st.zs=0;st.doneFired=false;say('');after({});};
  render();
  if(st.doneFired&&cfg.onDone&&cfg.restoreDone)cfg.onDone(api,root);
  return api;
}

/* ═══════════ STORE SCALE (a platform scale with a dial) ═══════════
   Weighing with two units (1 lb = 16 oz). The dial shows whole big units with a small tick for every small unit, so
   students SEE that 16 ounce marks fill a pound. Two kinds of round:
   · weights: drag (or tap) 1-lb and 1-oz weights onto the platform; the needle moves to the total. A round is done when the
     total reaches its target (any mix of weights). Earlier rounds can leave a dashed "ghost" needle for a fair compare.
   · read: an item sits on the platform at a fixed weight (`at`); students read the dial.
   Either kind can end with an answer form (`ask`). The reading under the dial is hidden unless `showReading:true`,
   so the model never gives the answer away.
   cfg = { key, rate:16, big:{unit:'lb',name:['pound','pounds']}, small:{unit:'oz',name:['ounce','ounces']},
           rounds:[{name, text, doneText, max (big units on the dial), item, itemLabel, at | target, ghost:[round indexes],
                    weights:['big','small'], showReading, cap (most small weights), ask:{q, units:['lb','oz'], answer:[2,10],
                    mistakes:[{v:[..], text}], hint, doneText}}],
           onRound(i, root), onDone(root) } */
function scale(root,cfg){
  var R=cfg.rate||16,B=cfg.big||{unit:'lb',name:['pound','pounds']},Sm=cfg.small||{unit:'oz',name:['ounce','ounces']},rounds=cfg.rounds,key=cfg.key;
  var st=ls(key,null)||{cur:0,w:rounds.map(function(){return {b:0,s:0};}),won:rounds.map(function(){return false;}),a:rounds.map(function(){return [];}),fired:false};
  if(!st.help)st.help=rounds.map(function(){return 0;});
  root.classList.add('ok-tool');root.classList.add('ok-wscale');
  root.innerHTML=(rounds.length>1?'<div class="ok-rounds" role="tablist">'+rounds.map(function(r,i){return '<button type="button" data-i="'+i+'">'+esc(r.name)+'</button>';}).join('')+'</div>':'')+
    '<p class="ok-do" aria-live="polite"></p><div class="ok-scalebox"><div class="ok-plat" aria-label="The scale platform"></div><svg class="ok-dial" viewBox="0 0 420 236" role="img"></svg></div>'+
    '<div class="ok-dialkey"><span><i class="k-big"></i>a number = 1 more '+esc(B.name[0])+'</span>'+(R%2===0?'<span><i class="k-mid"></i>middle mark = '+(R/2)+' '+esc(Sm.name[1])+' past it</span>':'')+'<span><i class="k-sm"></i>each small mark = 1 '+esc(Sm.name[0])+'</span></div><div class="ok-helprow"></div>'+
    '<div class="ok-tray"></div><div class="ok-sym" aria-live="polite"></div><div class="ok-scale-ask"></div><div class="ok-msg" aria-live="polite"></div>'+
    '<div class="ok-row"><button class="ok-btn ok-undo" type="button">↶ Take one off</button><button class="ok-btn ok-reset" type="button">↺ Start over</button></div>';
  var msg=$('.ok-msg',root),dial=$('.ok-dial',root),plat=$('.ok-plat',root),tray=$('.ok-tray',root),askEl=$('.ok-scale-ask',root);
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t||'';}
  function save(){lsSet(key,st);}
  function amt(v){var b=Math.floor(v/R),s=v%R;return b+' '+B.unit+' '+s+' '+Sm.unit;}
  function wn(n,u){return n+' one-'+u.name[0]+' weight'+(n===1?'':'s');}
  function onScale(w){if(!w.b&&!w.s)return 'Nothing on the scale yet.';return 'On the scale: '+[w.b?wn(w.b,B):'',w.s?wn(w.s,Sm):''].filter(Boolean).join(' and ')+'.';}
  function total(i){var r=rounds[i];return r.at!=null?r.at:st.w[i].b*R+st.w[i].s;}
  function cx(){return 210;} function cy(){return 206;}
  function ang(v,max){return Math.PI-(v/(max*R))*Math.PI;}
  function pt(a,rad){return [cx()+rad*Math.cos(a),cy()-rad*Math.sin(a)];}
  function needle(v,max,cls,col){var a=ang(Math.min(v,max*R),max),p=pt(a,150),deg=-(a*180/Math.PI)+180;
    return '<g class="'+cls+'"><line x1="'+cx()+'" y1="'+cy()+'" x2="'+cx()+'" y2="'+(cy()-150)+'" transform="rotate('+(deg-90).toFixed(2)+' '+cx()+' '+cy()+')" stroke="'+col+'" stroke-width="'+(cls==='ok-ghost-n'?3:4)+'" stroke-linecap="round"'+(cls==='ok-ghost-n'?' stroke-dasharray="7 5"':'')+'/></g>';}
  function drawDial(i){var r=rounds[i],max=r.max,n=max*R,s='<rect x="6" y="6" width="408" height="224" rx="18" fill="#FFF8EF" stroke="#3B2417" stroke-width="4"/>';
    s+='<path d="M'+(cx()-176)+' '+cy()+' A176 176 0 0 1 '+(cx()+176)+' '+cy()+'" fill="#FFFFFF" stroke="#3B2417" stroke-width="3"/>';
    // marks the needle has passed since the last whole big unit light up orange: numbered while a round teaches counting
    // (countMarks), lit only when the student asks for the helper on a reading round
    var tv=total(i),lit=(r.countMarks||st.help[i])&&tv>0,lb=tv%R===0?tv-R:Math.floor(tv/R)*R;
    for(var k=0;k<=n;k++){var a=ang(k,max),big=k%R===0,mid=!big&&R%2===0&&k%(R/2)===0,len=big?26:mid?17:10,p1=pt(a,172),p2=pt(a,172-len),on=lit&&k>lb&&k<=tv;
      s+='<line class="'+(big||mid?'mj':'mn')+'" x1="'+p1[0].toFixed(1)+'" y1="'+p1[1].toFixed(1)+'" x2="'+p2[0].toFixed(1)+'" y2="'+p2[1].toFixed(1)+'" stroke="'+(on?'#E07B39':'#2B3040')+'" stroke-width="'+(on?(big?4:3):(big?3:mid?2:1.3))+'"/>';
      if(on&&r.countMarks){var pc=pt(a,max>1?146:150);s+='<text x="'+pc[0].toFixed(1)+'" y="'+(pc[1]+4).toFixed(1)+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="'+(max>1?11:13)+'" fill="#C2601F">'+(k-lb)+'</text>';}
      if(big){var pl=pt(a,124);s+='<text x="'+pl[0].toFixed(1)+'" y="'+(pl[1]+6).toFixed(1)+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="'+(max>4?16:19)+'" fill="#1E8C5A">'+(k?k/R+' '+B.unit:'0')+'</text>';}}
    (r.ghost||[]).forEach(function(g){if(st.won[g]||rounds[g].at!=null)s+=needle(total(g),max,'ok-ghost-n','#8A90A6');});
    s+=needle(total(i),max,'ok-needle','#D8344A')+'<circle cx="'+cx()+'" cy="'+cy()+'" r="10" fill="#3B2417"/><circle cx="'+cx()+'" cy="'+cy()+'" r="4" fill="#F5C518"/>';
    var lab=(r.ghost||[]).filter(function(g){return st.won[g];}).map(function(g){return rounds[g].item;});
    if(lab.length)s+='<text x="20" y="30" font-family="Nunito,sans-serif" font-weight="800" font-size="14" fill="#6B7290">dashed needle: '+esc(lab.join(', '))+'</text>';
    dial.innerHTML=s;dial.setAttribute('aria-label','A scale dial from 0 to '+max+' '+B.name[1]+'. Each '+B.name[0]+' has '+R+' small marks, one for each '+Sm.name[0]+'.'+(r.showReading?' The needle points to '+amt(total(i))+'.':''));}
  function add(k){var i=st.cur,r=rounds[i],w=st.w[i];if(st.won[i]&&r.target!=null)return;
    var v=total(i)+(k==='big'?R:1);
    if(r.target!=null&&v>r.target){say(r.overMsg||'That is heavier than the '+esc(r.item)+'. Take one off, or try a smaller weight.','hint');snd.no();render();return;}
    if(v>r.max*R){say('The scale only goes up to '+r.max+' '+B.unit+'.','hint');snd.no();return;}
    if(k==='small'&&w.s>=(r.cap||47)){say('That is a lot of ounce weights! '+R+' '+Sm.name[1]+' weigh the same as 1 '+B.name[0]+'.','hint');snd.no();return;}
    w[k==='big'?'b':'s']++;snd.click();say('');
    if(r.target!=null&&total(i)===r.target&&!st.won[i]){if(!r.ask)win(i);else{snd.done();}}
    save();render({pop:k});}
  function remove(k){var w=st.w[st.cur];if(!w[k==='big'?'b':'s'])return;w[k==='big'?'b':'s']--;snd.click();save();render();}
  function win(i){st.won[i]=true;snd.done();save();if(cfg.onRound)cfg.onRound(i,root);
    if(st.won.every(Boolean)&&!st.fired){st.fired=true;save();if(cfg.onDone)cfg.onDone(root);}render();}
  function askReady(i){var r=rounds[i];return r.at!=null||total(i)===r.target;}
  function render(anim){anim=anim||{};var i=st.cur,r=rounds[i],w=st.w[i];
    if(rounds.length>1)$$('.ok-rounds button',root).forEach(function(b,k){b.classList.toggle('on',k===i);b.classList.toggle('won',!!st.won[k]);b.setAttribute('aria-selected',k===i);});
    $('.ok-do',root).innerHTML=st.won[i]?'<span class="ok-step" style="background:#1E8C5A">Done</span>'+(r.doneText||''):r.text;
    drawDial(i);
    var ph='';if(r.at!=null)ph='<span class="ok-item">'+esc(r.itemLabel||r.item)+'</span>';
    else{if(r.itemLabel)ph+='<span class="ok-item ghosty">'+esc(r.itemLabel)+'</span>';
      for(var b=0;b<w.b;b++)ph+='<span class="ok-disc ok-wt big'+(anim.pop==='big'&&b===w.b-1?' ok-in':'')+'" data-p="10" data-k="big" tabindex="0" role="button" aria-label="Take off a 1 '+B.name[0]+' weight">1 '+esc(B.unit)+'</span>';
      for(var c=0;c<w.s;c++)ph+='<span class="ok-disc ok-wt small'+(anim.pop==='small'&&c===w.s-1?' ok-in':'')+'" data-p="1" data-k="small" tabindex="0" role="button" aria-label="Take off a 1 '+Sm.name[0]+' weight">1 '+esc(Sm.unit)+'</span>';
      if(!w.b&&!w.s&&!r.itemLabel)ph+='<span class="ok-plat-empty">Put weights here</span>';}
    plat.innerHTML=ph;
    $$('.ok-wt',plat).forEach(function(d){var k=d.dataset.k;draggable(d,function(){return {k:k,from:'plat'};},function(t,pl){if(!t||!t.closest('.ok-plat'))remove(pl.k);else render();},function(pl){remove(pl.k);});});
    var ws=r.at!=null?[]:(r.weights||['big','small']);
    tray.style.display=ws.length?'':'none';
    tray.innerHTML=ws.length?'<span class="lbl">'+(r.trayText||'Drag a weight onto the scale (or tap it):')+'</span>'+ws.map(function(k){var u=k==='big'?B:Sm;return '<span class="ok-src"><span class="ok-disc ok-wt '+k+'" data-p="'+(k==='big'?10:1)+'" data-k="'+k+'" data-src="1" tabindex="0" role="button" aria-label="Add a 1 '+u.name[0]+' weight">1 '+esc(u.unit)+'</span>'+(k==='big'?'<small>= '+R+' '+esc(Sm.unit)+'</small>':'')+'</span>';}).join(''):'';
    $$('.ok-tray .ok-wt',root).forEach(function(d){var k=d.dataset.k;draggable(d,function(){return {k:k,from:'src'};},function(t,pl){if(t&&t.closest('.ok-scalebox'))add(pl.k);},function(pl){add(pl.k);});});
    var v=total(i);
    $('.ok-sym',root).innerHTML=r.sym?r.sym(v,st,i):(r.showReading?'<span class="big">'+amt(v)+'</span><span class="exp">= '+fmt(v)+' '+Sm.unit+'</span>':
      (r.at!=null?'<span class="exp">Find the last '+esc(B.name[0])+' number the needle passed. Then count the small marks after it.</span>':'<span class="exp">'+onScale(w)+(r.target!=null&&v===r.target&&r.reachText?' '+r.reachText:'')+'</span>'));
    var hr=$('.ok-helprow',root);hr.innerHTML='';
    if(!r.countMarks&&(r.at!=null||r.ask)&&!st.help[i]&&v>0){var hb=document.createElement('button');hb.type='button';hb.className='ok-btn ok-help';hb.textContent='💡 Light up the marks after the last '+B.name[0];
      hb.onclick=function(){st.help[st.cur]=1;save();render();};hr.appendChild(hb);}
    // the answer form
    if(r.ask&&askReady(i)){var A=r.ask,sa=st.a[i]||[];
      if(!askEl.dataset.r||askEl.dataset.r!==String(i)){askEl.dataset.r=i;
        askEl.innerHTML='<form class="bm-form mk-two"><span class="mk-two-q">'+A.q+'</span>'+A.units.map(function(u,k){return '<input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(A.q.replace(/<[^>]+>/g,''))+' '+(u===B.unit?B.name[1]:u===Sm.unit?Sm.name[1]:u)+'" value="'+esc(sa[k]||'')+'"><span class="bm-u">'+esc(u)+'</span>';}).join('')+'<button type="submit" class="ok-btn">Check</button></form>';
        var f=$('form',askEl),ins=$$('input',f);
        if(st.won[i])ins.forEach(function(x){x.disabled=true;});
        f.onsubmit=function(e){e.preventDefault();if(st.won[st.cur])return;var vs=ins.map(function(x){return num(x.value);});st.a[st.cur]=ins.map(function(x){return x.value;});save();
          if(vs.some(function(x){return x==null;}))return say('Type a number in each box.','hint');
          if(vs.every(function(x,k){return x===A.answer[k];})){ins.forEach(function(x){x.disabled=true;});say(A.doneText||'Yes!','good');win(st.cur);return;}
          snd.no();var mk=(A.mistakes||[]).filter(function(z){return z.v.every(function(x,k){return x===vs[k];});})[0];
          if(mk)return say(mk.text,'hint');
          if(A.units.length===2&&vs[0]*R+vs[1]===A.answer[0]*R+A.answer[1])return say('That is the right weight! But '+vs[1]+' '+Sm.unit+' is '+R+' or more. Trade '+R+' '+Sm.name[1]+' for 1 '+B.name[0]+'.','hint');
          say(A.hint||'Look at the dial again: count the big numbers first, then the small marks.','hint');};}
    }else{askEl.innerHTML='';askEl.dataset.r='';}
    var nx=$('.ok-next',root);
    if(st.won[i]&&i<rounds.length-1){if(!nx){nx=document.createElement('button');nx.className='ok-btn ok-next';nx.type='button';nx.textContent='Next →';nx.onclick=function(){st.cur++;save();say('');askEl.dataset.r='';render();};$('.ok-row',root).appendChild(nx);}}
    else if(nx)nx.remove();
    $('.ok-undo',root).style.display=r.at!=null?'none':'';
  }
  if(rounds.length>1)$$('.ok-rounds button',root).forEach(function(b){b.onclick=function(){st.cur=+b.dataset.i;save();say('');askEl.dataset.r='';render();};});
  $('.ok-undo',root).onclick=function(){var w=st.w[st.cur];if(st.won[st.cur]&&rounds[st.cur].target!=null)return;if(w.s)remove('small');else if(w.b)remove('big');};
  $('.ok-reset',root).onclick=function(){var i=st.cur;st.w[i]={b:0,s:0};st.won[i]=false;st.a[i]=[];st.help[i]=0;st.fired=st.won.every(Boolean)&&st.fired;save();say('');askEl.dataset.r='';render();};
  render();
  return {state:st,total:total};
}
/* ═══════════ POUR STATION ═══════════  (capacity: two containers at a time, drawn to scale by height)
   cfg = { key, rounds:[{ name, text, doneText,
             big:{unit:'qt',name:['quart','quarts'],what:'quart bottle'}, small:{…}, rate:2,
             mode:'fill'  → one empty big container; pour from an endless small source until it is full
             mode:'up'    → start.small full small containers (+ start.big full big ones); pour them into big containers
                            (one at a time, or "Fill a whole …" once one is done by hand); leftovers stay small
             mode:'down'  → start.big full big containers (+ start.small full small ones); tap/drag a big one to pour it out
             start:{big, small}, ask:{q, units, answer, mistakes:[{v,text}], hint, doneText}, sym(info) }], onRound, onDone } */
function pour(root,cfg){
  var rounds=cfg.rounds,key=cfg.key;
  function init(r){var s=r.start||{};return r.mode==='fill'?{full:0,cur:0,left:0,poured:0}:r.mode==='up'?{full:s.big||0,cur:0,left:s.small||0,open:false,poured:0}:{full:s.big||0,cur:0,left:s.small||0,poured:0};}
  var st=ls(key,null);if(!st||!st.p||st.p.length!==rounds.length)st={cur:0,p:rounds.map(init),won:rounds.map(function(){return false;}),a:rounds.map(function(){return [];}),fired:false};
  root.classList.add('ok-tool');root.classList.add('ok-pour');
  root.innerHTML=(rounds.length>1?'<div class="ok-rounds" role="tablist">'+rounds.map(function(r,i){return '<button type="button" data-i="'+i+'">'+esc(r.name)+'</button>';}).join('')+'</div>':'')+
    '<p class="ok-do" aria-live="polite"></p><div class="ok-pourbox"><div class="ok-pourrow ok-pr-big" aria-label="Big containers"></div><div class="ok-pourrow ok-pr-small" aria-label="Small containers"></div></div>'+
    '<div class="ok-sym" aria-live="polite"></div><div class="ok-pour-ask"></div><div class="ok-msg" aria-live="polite"></div>'+
    '<div class="ok-row"><button class="ok-btn ok-reset" type="button">↺ Start over</button></div>';
  var msg=$('.ok-msg',root),rowB=$('.ok-pr-big',root),rowS=$('.ok-pr-small',root),askEl=$('.ok-pour-ask',root);
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t||'';}
  function save(){lsSet(key,st);}
  function nm(u,n){return n===1?u.name[0]:u.name[1];}
  function cnt(n,u){return n+' '+nm(u,n);}
  function hs(r){var h=Math.max(16,Math.min(56,Math.round(150/r.rate)));return {s:h,b:h*r.rate};}
  function vessel(u,h,lvl,rate,cls,lab,extra){ // lvl = small units inside (0..rate) for a big one, 0/1 for a small one
    var pct=Math.round(100*lvl/rate);
    return '<span class="ok-vsl '+cls+'" style="height:'+h+'px" '+(extra||'')+'><span class="ok-vfill" style="height:'+pct+'%"></span>'+
      (rate>1?'<span class="ok-vticks" style="background-size:100% '+(100/rate)+'%"></span>':'')+'<span class="ok-vlab">'+esc(lab)+'</span></span>';}
  function info(i){var r=rounds[i],p=st.p[i];return {r:r,p:p,smallTotal:p.full*r.rate+p.cur+p.left,doneUp:r.mode==='up'&&!p.cur&&p.left<r.rate,doneDown:r.mode==='down'&&!p.full};}
  function finished(i){var r=rounds[i],p=st.p[i];return r.mode==='fill'?p.cur===r.rate:r.mode==='up'?(!p.cur&&p.left<r.rate):!p.full;}
  function pourSmall(){var i=st.cur,r=rounds[i],p=st.p[i];if(r.mode==='up'&&p.left&&!p.cur&&p.left<r.rate){say('Only '+cnt(p.left,r.small)+' left. That is not enough to fill another '+r.big.name[0]+', so they stay as '+r.small.name[1]+'.','hint');snd.no();return;}if(st.won[i]||finished(i))return;
    if(r.mode==='fill'){p.cur++;p.poured++;snd.click();say(p.cur===r.rate?'Full! The '+r.big.name[0]+' is filled to the top.':'');}
    else if(r.mode==='up'){if(!p.left)return;if(!p.cur&&p.left<r.rate){say('Only '+cnt(p.left,r.small)+' left. That is not enough to fill another '+r.big.name[0]+', so they stay as '+r.small.name[1]+'.','hint');snd.no();return;}
      p.left--;p.cur++;p.poured++;snd.click();say('');if(p.cur===r.rate){p.full++;p.cur=0;snd.split();say('That '+r.big.name[0]+' is full! '+(p.left>=r.rate?'Start the next one.':''));}}
    after();}
  function pourWhole(){var i=st.cur,r=rounds[i],p=st.p[i];if(r.mode!=='up'||st.won[i]||p.cur||p.left<r.rate)return;p.left-=r.rate;p.full++;p.poured+=r.rate;snd.split();say('');after();}
  function pourBig(){var i=st.cur,r=rounds[i],p=st.p[i];if(r.mode!=='down'||st.won[i]||!p.full)return;p.full--;p.left+=r.rate;p.poured++;snd.split();say('One '+r.big.name[0]+' poured out into '+r.rate+' '+r.small.name[1]+'.');after();}
  function after(){var i=st.cur,r=rounds[i];save();if(finished(i)&&!r.ask)win(i);else if(finished(i))snd.done();render();}
  function win(i){if(st.won[i])return;st.won[i]=true;save();if(cfg.onRound)cfg.onRound(i,root);
    if(st.won.every(Boolean)&&!st.fired){st.fired=true;save();if(cfg.onDone)cfg.onDone(root);}render();}
  function defSym(i){var r=rounds[i],p=st.p[i];
    if(r.mode==='fill')return '<span class="big">'+cnt(p.cur,r.small)+' poured in</span><span class="exp">'+(p.cur===r.rate?'The '+r.big.name[0]+' is full.':'Keep pouring until the '+r.big.name[0]+' is full.')+'</span>';
    if(r.mode==='up')return '<span class="big">'+p.full+' full '+nm(r.big,p.full)+(p.cur?' and 1 '+r.big.name[0]+' with '+cnt(p.cur,r.small)+' in it':'')+'</span><span class="exp">'+cnt(p.left,r.small)+' still to pour'+(finished(i)&&p.left?' (not enough for another '+r.big.name[0]+')':'')+'</span>';
    return '<span class="big">'+cnt(p.left,r.small)+(p.full?'':' in all')+'</span><span class="exp">'+(p.full?cnt(p.full,r.big)+' still to pour out':'Every '+r.big.name[0]+' is poured out.')+'</span>';}
  function render(){var i=st.cur,r=rounds[i],p=st.p[i],H=hs(r),k,b='',s='';
    if(rounds.length>1)$$('.ok-rounds button',root).forEach(function(x,j){x.classList.toggle('on',j===i);x.classList.toggle('won',!!st.won[j]);x.setAttribute('aria-selected',j===i);});
    $('.ok-do',root).innerHTML=st.won[i]?'<span class="ok-step" style="background:#1E8C5A">Done</span>'+(r.doneText||''):r.text;
    var BL='1 '+r.big.unit,SL='1 '+r.small.unit;
    if(r.mode==='fill')b=vessel(r.big,H.b,p.cur,r.rate,'big target','1 '+r.big.unit,'aria-label="'+esc('A '+r.big.name[0]+' with '+cnt(p.cur,r.small)+' in it')+'"');
    else if(r.mode==='up'){for(k=0;k<p.full;k++)b+=vessel(r.big,H.b,r.rate,r.rate,'big done',BL,'aria-label="A full '+esc(r.big.name[0])+'"');
      if(p.cur||(!finished(i)&&p.left))b+=vessel(r.big,H.b,p.cur,r.rate,'big target',BL,'aria-label="'+esc('A '+r.big.name[0]+' with '+cnt(p.cur,r.small)+' in it')+'"');
      if(!b)b='<span class="ok-plat-empty">Pour the '+esc(r.small.name[1])+' here</span>';}
    else{for(k=0;k<p.full;k++)b+=vessel(r.big,H.b,r.rate,r.rate,'big src',BL,'data-src="big" tabindex="0" role="button" aria-label="'+esc('Pour out a full '+r.big.name[0])+'"');
      if(!p.full)b='<span class="ok-plat-empty">All poured out.</span>';}
    rowB.innerHTML=b;rowB.style.minHeight=(H.b+30)+'px';
    if(r.mode==='fill'){s='<span class="ok-tap"><span class="ok-tap-lbl">Pour a '+esc(r.small.name[0])+':</span>'+vessel(r.small,H.s,1,1,'small src',SL,'data-src="small" tabindex="0" role="button" aria-label="'+esc('Pour 1 '+r.small.name[0])+'"')+'</span>';}
    else if(r.mode==='up'){for(k=0;k<p.left;k++)s+=vessel(r.small,H.s,1,1,'small src',SL,'data-src="small" tabindex="0" role="button" aria-label="'+esc('Pour 1 '+r.small.name[0]+' into the '+r.big.name[0])+'"');
      if(!p.left)s='<span class="ok-plat-empty">No '+esc(r.small.name[1])+' left to pour.</span>';}
    else{for(k=0;k<p.left;k++)s+=vessel(r.small,H.s,1,1,'small got',SL,'aria-label="A full '+esc(r.small.name[0])+'"');
      if(!p.left)s='<span class="ok-plat-empty">Pour a '+esc(r.big.name[0])+' out here</span>';}
    rowS.innerHTML=s;rowS.style.minHeight=(H.s+30)+'px';
    if(r.mode==='up'&&!st.won[i]&&!finished(i)&&p.poured>=r.rate&&!p.cur&&p.left>=r.rate){var w=document.createElement('button');w.type='button';w.className='ok-btn ok-whole';w.textContent='+ Fill a whole '+r.big.name[0]+' ('+r.rate+' '+r.small.unit+')';w.onclick=pourWhole;rowS.appendChild(w);}
    $$('.ok-vsl.src',root).forEach(function(d){var big=d.dataset.src==='big';draggable(d,function(){return {k:d.dataset.src};},function(t){if(!t)return render();if(!big&&t.closest('.ok-pr-big'))pourSmall();else if(big&&t.closest('.ok-pr-small'))pourBig();else render();},function(){big?pourBig():pourSmall();});});
    $('.ok-sym',root).innerHTML=r.sym?r.sym(info(i)):defSym(i);
    if(r.ask&&finished(i)){var A=r.ask,sa=st.a[i]||[];
      if(askEl.dataset.r!==String(i)){askEl.dataset.r=i;
        askEl.innerHTML='<form class="bm-form mk-two"><span class="mk-two-q">'+A.q+'</span>'+A.units.map(function(u,k){return '<input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(A.q.replace(/<[^>]+>/g,'')+' '+u)+'" value="'+esc(sa[k]||'')+'"><span class="bm-u">'+esc(u)+'</span>';}).join('')+'<button type="submit" class="ok-btn">Check</button></form>';
        var f=$('form',askEl),ins=$$('input',f);if(st.won[i])ins.forEach(function(x){x.disabled=true;});
        f.onsubmit=function(e){e.preventDefault();if(st.won[st.cur])return;var vs=ins.map(function(x){return num(x.value);});st.a[st.cur]=ins.map(function(x){return x.value;});save();
          if(vs.some(function(x){return x==null;}))return say('Type a number in each box.','hint');
          if(vs.every(function(x,k){return x===A.answer[k];})){ins.forEach(function(x){x.disabled=true;});say(A.doneText||'Yes!','good');win(st.cur);return;}
          snd.no();var mk=(A.mistakes||[]).filter(function(z){return z.v.every(function(x,k){return x===vs[k];});})[0];
          say(mk?mk.text:(A.hint||'Count the containers again.'),'hint');};}
    }else{askEl.innerHTML='';askEl.dataset.r='';}
    var nx=$('.ok-next',root);
    if(st.won[i]&&i<rounds.length-1){if(!nx){nx=document.createElement('button');nx.className='ok-btn ok-next';nx.type='button';nx.textContent='Next →';nx.onclick=function(){st.cur++;save();say('');askEl.dataset.r='';render();};$('.ok-row',root).appendChild(nx);}}
    else if(nx)nx.remove();}
  if(rounds.length>1)$$('.ok-rounds button',root).forEach(function(b){b.onclick=function(){st.cur=+b.dataset.i;save();say('');askEl.dataset.r='';render();};});
  $('.ok-reset',root).onclick=function(){var i=st.cur;st.p[i]=init(rounds[i]);st.won[i]=false;st.a[i]=[];save();say('');askEl.dataset.r='';render();};
  render();
  return {state:st,info:info};
}
/* ═══════════ CLOCK HANDS ═══════════  (time: wind a hand around a face of `rate` ticks; every full turn is 1 big unit)
   cfg = { key, rounds:[{ name, text, doneText, rate:60, big:{unit:'h',name:['hour','hours']}, small:{unit:'min',name:[…]},
             face:'clock'|'day', target (small units to wind), start (small units already wound), show:'count'|'turns',
             steps:[1,5] (tap buttons), ask:{q, units, answer, mistakes:[{v,text}], hint, doneText} }], onRound, onDone }
   'count' shows how many small units are wound (going up: read the full turns); 'turns' shows full turns + the part past
   (going down: work out the total). Drag the long hand clockwise, or tap the buttons; "+1 full turn" after one turn by hand. */
function clock(root,cfg){
  var rounds=cfg.rounds,key=cfg.key;
  var st=ls(key,null);if(!st||!st.w||st.w.length!==rounds.length)st={cur:0,w:rounds.map(function(r){return r.start||0;}),hand:rounds.map(function(){return 0;}),won:rounds.map(function(){return false;}),a:rounds.map(function(){return [];}),fired:false};
  root.classList.add('ok-tool');root.classList.add('ok-clock');
  root.innerHTML=(rounds.length>1?'<div class="ok-rounds" role="tablist">'+rounds.map(function(r,i){return '<button type="button" data-i="'+i+'">'+esc(r.name)+'</button>';}).join('')+'</div>':'')+
    '<p class="ok-do" aria-live="polite"></p><div class="ok-clockbox"><svg class="ok-face" viewBox="0 0 300 300" role="img"></svg><div class="ok-turns" aria-live="polite"></div></div>'+
    '<div class="ok-row ok-clockbtns"></div><div class="ok-sym" aria-live="polite"></div><div class="ok-clock-ask"></div><div class="ok-msg" aria-live="polite"></div>'+
    '<div class="ok-row"><button class="ok-btn ok-undo" type="button">↶ Back 1</button><button class="ok-btn ok-reset" type="button">↺ Start over</button></div>';
  var face=$('.ok-face',root),turnsEl=$('.ok-turns',root),btns=$('.ok-clockbtns',root),msg=$('.ok-msg',root),askEl=$('.ok-clock-ask',root);
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t||'';}
  function save(){lsSet(key,st);}
  function nm(u,n){return n===1?u.name[0]:u.name[1];}
  function R(){return rounds[st.cur];}
  function done(i){return st.w[i]===rounds[i].target;}
  function wind(n,fromDrag){var i=st.cur,r=rounds[i];if(st.won[i])return false;var v=st.w[i]+n,lo=r.start||0;
    if(v>r.target){if(!fromDrag){say(r.overMsg||(r.hideTarget?'That would go past one full turn. Wind a smaller step.':'That goes past '+r.target+' '+nm(r.small,r.target)+'. Wind a smaller step.'),'hint');snd.no();}return false;}
    if(v<lo)return false;
    var before=Math.floor(st.w[i]/r.rate),after=Math.floor(v/r.rate);st.w[i]=v;
    if(after>before){st.hand[i]=Math.max(st.hand[i],after-Math.floor(lo/r.rate));snd.split();say(r.hideTarget?'One full turn!':'One full turn! That is 1 '+r.big.name[0]+'.','good');}else{snd.click();if(!fromDrag)say('');}
    save();if(done(i)){if(!r.ask)win(i);else snd.done();}render();return true;}
  function win(i){if(st.won[i])return;st.won[i]=true;save();if(cfg.onRound)cfg.onRound(i,root);
    if(st.won.every(Boolean)&&!st.fired){st.fired=true;save();if(cfg.onDone)cfg.onDone(root);}render();}
  function pt(a,rad){return [150+rad*Math.sin(a),150-rad*Math.cos(a)];}
  function drawFace(){var r=R(),i=st.cur,w=st.w[i],n=r.rate,s='<circle cx="150" cy="150" r="140" fill="#FFF8EF" stroke="#3B2417" stroke-width="6"/>';
    var major=n===60?5:3;
    for(var k=0;k<n;k++){var a=k/n*2*Math.PI,big=k%major===0,p1=pt(a,132),p2=pt(a,big?116:124);
      s+='<line x1="'+p1[0].toFixed(1)+'" y1="'+p1[1].toFixed(1)+'" x2="'+p2[0].toFixed(1)+'" y2="'+p2[1].toFixed(1)+'" stroke="#2B3040" stroke-width="'+(big?3.5:1.6)+'"/>';
      if(big){var lab=r.face==='day'?String(k):(k===0?'12':String(k/5)),pl=pt(a,100);s+='<text x="'+pl[0].toFixed(1)+'" y="'+(pl[1]+7).toFixed(1)+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="'+(r.face==='day'?17:21)+'" fill="#1E3A6E">'+lab+'</text>';}}
    // the part of this turn already wound is shaded
    var part=w%n,fa=part/n*2*Math.PI;
    if(part){var e=pt(fa,60);s+='<path d="M150 150 L150 90 A60 60 0 '+(part>n/2?1:0)+' 1 '+e[0].toFixed(1)+' '+e[1].toFixed(1)+' Z" fill="rgba(224,123,57,.25)"/>';}
    var tip=pt(fa,112);
    s+='<line x1="150" y1="150" x2="'+tip[0].toFixed(1)+'" y2="'+tip[1].toFixed(1)+'" stroke="#D8344A" stroke-width="7" stroke-linecap="round" class="ok-hand"/>';
    s+='<circle cx="'+tip[0].toFixed(1)+'" cy="'+tip[1].toFixed(1)+'" r="13" fill="#D8344A" fill-opacity=".25" stroke="#D8344A" stroke-width="2" class="ok-grip"/>';
    s+='<circle cx="150" cy="150" r="9" fill="#3B2417"/><circle cx="150" cy="150" r="3.5" fill="#F5C518"/>';
    if(!r.hideRate)s+='<text x="150" y="196" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="#6B7290">1 turn = '+n+' '+esc(r.small.name[1])+'</text>';
    face.innerHTML=s;face.setAttribute('aria-label','A '+(r.face==='day'?'day wheel':'clock face')+(r.hideRate?' with small marks all the way around.':' with '+n+' small marks. One full turn of the red hand is '+n+' '+r.small.name[1]+', or 1 '+r.big.name[0]+'.'));}
  function render(){var i=st.cur,r=R(),w=st.w[i],n=r.rate,turns=Math.floor(w/n),past=w%n;
    if(rounds.length>1)$$('.ok-rounds button',root).forEach(function(b,k){b.classList.toggle('on',k===i);b.classList.toggle('won',!!st.won[k]);b.setAttribute('aria-selected',k===i);});
    $('.ok-do',root).innerHTML=st.won[i]?'<span class="ok-step" style="background:#1E8C5A">Done</span>'+(r.doneText||''):r.text;
    drawFace();
    var ch='';for(var k=0;k<turns;k++)ch+='<span class="ok-turn" title="a full turn">1 '+esc(r.big.unit)+'</span>';
    turnsEl.innerHTML='<span class="lbl">Full turns:</span>'+(ch||'<span class="ok-plat-empty">none yet</span>');
    var b='';(r.steps||[1,5]).forEach(function(sz){b+='<button type="button" class="ok-btn ok-step-btn" data-n="'+sz+'">+ '+sz+' '+esc(r.small.unit)+'</button>';});
    if(st.hand[i]>=1&&!st.won[i]&&w+n<=r.target)b+='<button type="button" class="ok-btn ok-wholeturn" data-n="'+n+'">+ 1 full turn ('+n+' '+esc(r.small.unit)+')</button>';
    btns.innerHTML=b;$$('button',btns).forEach(function(x){x.onclick=function(){wind(+x.dataset.n);};});
    $('.ok-sym',root).innerHTML=r.show==='count'?'<span class="big">'+w+' '+nm(r.small,w)+' wound</span><span class="exp">'+(r.hideTarget?(w===r.target?'One full turn!':'Keep going until the hand makes one full turn.'):'of '+r.target+' '+esc(r.small.name[1]))+'</span>':
      '<span class="big">'+turns+' full '+nm({name:['turn','turns']},turns)+' and '+past+' '+nm(r.small,past)+'</span><span class="exp">'+(w===r.target?'That is the whole time. ':'')+'Each full turn is 1 '+esc(r.big.name[0])+'.</span>';
    if(r.ask&&done(i)){var A=r.ask,sa=st.a[i]||[];
      if(askEl.dataset.r!==String(i)){askEl.dataset.r=i;
        askEl.innerHTML='<form class="bm-form mk-two"><span class="mk-two-q">'+A.q+'</span>'+A.units.map(function(u,k){return '<input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(A.q.replace(/<[^>]+>/g,'')+' '+u)+'" value="'+esc(sa[k]||'')+'"><span class="bm-u">'+esc(u)+'</span>';}).join('')+'<button type="submit" class="ok-btn">Check</button></form>';
        var f=$('form',askEl),ins=$$('input',f);if(st.won[i])ins.forEach(function(x){x.disabled=true;});
        f.onsubmit=function(e){e.preventDefault();if(st.won[st.cur])return;var vs=ins.map(function(x){return num(x.value);});st.a[st.cur]=ins.map(function(x){return x.value;});save();
          if(vs.some(function(x){return x==null;}))return say('Type a number in each box.','hint');
          if(vs.every(function(x,k){return x===A.answer[k];})){ins.forEach(function(x){x.disabled=true;});say(A.doneText||'Yes!','good');win(st.cur);return;}
          snd.no();var mk=(A.mistakes||[]).filter(function(z){return z.v.every(function(x,k){return x===vs[k];});})[0];
          if(mk)return say(mk.text,'hint');
          var rr=R();if(A.units.length===2&&vs[0]*rr.rate+vs[1]===A.answer[0]*rr.rate+A.answer[1])return say('That is the right amount of time! But '+vs[1]+' '+A.units[1]+' is '+rr.rate+' or more. '+rr.rate+' of them make another '+rr.big.name[0]+'.','hint');
          say(A.hint||'Count the full turns, then the part past the last turn.','hint');};}
    }else{askEl.innerHTML='';askEl.dataset.r='';}
    var nx=$('.ok-next',root);
    if(st.won[i]&&i<rounds.length-1){if(!nx){nx=document.createElement('button');nx.className='ok-btn ok-next';nx.type='button';nx.textContent='Next →';nx.onclick=function(){st.cur++;save();say('');askEl.dataset.r='';render();};$$('.ok-row',root).pop().appendChild(nx);}}
    else if(nx)nx.remove();}
  // drag the hand: each tick the pointer passes clockwise winds 1 small unit
  var drag=null;
  function tickAt(e){var b=face.getBoundingClientRect(),x=e.clientX-b.left-b.width/2,y=e.clientY-b.top-b.height/2,a=Math.atan2(x,-y);if(a<0)a+=2*Math.PI;return Math.round(a/(2*Math.PI)*R().rate)%R().rate;}
  face.style.touchAction='none';
  face.addEventListener('pointerdown',function(e){if(st.won[st.cur])return;drag={t:tickAt(e),id:e.pointerId};try{face.setPointerCapture(e.pointerId);}catch(x){}e.preventDefault();});
  face.addEventListener('pointermove',function(e){if(!drag||drag.id!==e.pointerId)return;var n=R().rate,t=tickAt(e),d=((t-drag.t)%n+n)%n;if(d>n/2)d-=n;
    while(d>0){if(!wind(1,true))break;d--;drag.t=(drag.t+1)%n;}
    while(d<0){var i=st.cur;if(st.w[i]<=(R().start||0))break;st.w[i]--;d++;drag.t=(drag.t-1+n)%n;save();render();}});
  function end(e){if(drag&&drag.id===e.pointerId)drag=null;}
  face.addEventListener('pointerup',end);face.addEventListener('pointercancel',end);
  if(rounds.length>1)$$('.ok-rounds button',root).forEach(function(b){b.onclick=function(){st.cur=+b.dataset.i;save();say('');askEl.dataset.r='';render();};});
  $('.ok-undo',root).onclick=function(){var i=st.cur;if(st.won[i]||st.w[i]<=(R().start||0))return;st.w[i]--;snd.click();save();render();};
  $('.ok-reset',root).onclick=function(){var i=st.cur;st.w[i]=rounds[i].start||0;st.hand[i]=0;st.won[i]=false;st.a[i]=[];save();say('');askEl.dataset.r='';render();};
  render();
  return {state:st};
}
/* ═══════════ RIBBON CUTTER (fractions of a unit) ═══════════
   One whole unit as a strip (1 ft, 1 lb, 1 h, 1 m, 1 L). Two modes:
   take: tap a cut button to cut the strip into equal parts (each part shows its small units), then tap or drag across
         parts to take some. Live line: "5 of 6 parts · each part is 2 in". Optional ask form for the total.
   name: the strip shows `rate` small-unit marks; shade `shade` of them (tap or drag), write the fraction (part over whole,
         stacked boxes), then group the marks into bigger equal parts and write the simplest form.
   round = {name, mode:'take'|'name', text, doneText, rate, big:{unit,name:[one,many]}, small:{unit,name:[one,many]},
            take: num, den, cuts:[…], free (any cut allowed, no wrong-cut hint), ask:{q, units, answer, mistakes:[{v,text}], hint, doneText}
            name: shade, groups:[…], raw:{n,d}, answer:{n,d}, rawMistakes:[{n,d,text}], simpMistakes, hint }
   cfg = { key, rounds, onRound(i, root), onDone(root) } */
function ribbon(root,cfg){
  var rounds=cfg.rounds,key=cfg.key;
  var st=ls(key,null);if(!st||!st.cut||st.cut.length!==rounds.length)st={cur:0,cut:rounds.map(function(){return 0;}),on:rounds.map(function(){return [];}),raw:rounds.map(function(){return false;}),grp:rounds.map(function(){return 0;}),won:rounds.map(function(){return false;}),a:rounds.map(function(){return [];}),fired:false};
  root.classList.add('ok-tool');root.classList.add('ok-ribbon');
  root.innerHTML=(rounds.length>1?'<div class="ok-rounds" role="tablist">'+rounds.map(function(r,i){return '<button type="button" data-i="'+i+'">'+esc(r.name)+'</button>';}).join('')+'</div>':'')+
    '<p class="ok-do" aria-live="polite"></p><div class="ok-row ok-cutbtns"></div><div class="ok-stripbox"><svg class="ok-strip" viewBox="0 0 640 110" role="img"></svg></div>'+
    '<div class="ok-sym" aria-live="polite"></div><div class="ok-ribbon-ask"></div><div class="ok-msg" aria-live="polite"></div>'+
    '<div class="ok-row"><button class="ok-btn ok-reset" type="button">↺ Start over</button></div>';
  var svg=$('.ok-strip',root),btns=$('.ok-cutbtns',root),msg=$('.ok-msg',root),askEl=$('.ok-ribbon-ask',root);
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t||'';}
  function save(){lsSet(key,st);}
  function nm(u,n){return n===1?u.name[0]:u.name[1];}
  function R(){return rounds[st.cur];}
  function taken(i){return st.on[i].filter(Boolean).length;}
  function win(i){if(st.won[i])return;st.won[i]=true;save();snd.done();if(cfg.onRound)cfg.onRound(i,root);
    if(st.won.every(Boolean)&&!st.fired){st.fired=true;save();if(cfg.onDone)cfg.onDone(root);}render();}
  function frac(n,d){return '<span class="ok-frac"><b>'+n+'</b><i></i><b>'+d+'</b></span>';}
  function per(r){return r.rate/st.cut[st.cur];}
  function setOn(i,k,v){var r=rounds[i];if(st.won[i])return;var arr=st.on[i];if(!!arr[k]===!!v)return;
    if(v&&r.mode==='take'&&!r.free&&taken(i)>=r.num){say('You have '+r.num+' parts already. The top number says how many parts to take.','hint');snd.no();return;}
    if(v&&r.mode==='name'&&taken(i)>=r.shade){say('That is all '+r.shade+' '+nm(r.small,r.shade)+'. The strip is shaded for the whole scrap.','hint');snd.no();return;}
    arr[k]=!!v;snd.click();save();render();
    if(r.mode==='take'&&!r.ask&&taken(i)===r.num&&st.cut[i]===r.den)win(i);}
  function cutTo(n){var i=st.cur,r=R();if(st.won[i])return;
    if(!r.free&&n!==r.den){snd.no();say((r.cutHint||'Look at the bottom number of the fraction. It tells how many equal parts to cut.')+' You cut '+n+'.','hint');}else say('');
    st.cut[i]=n;st.on[i]=[];save();snd.split();render();}
  function groupTo(g){var i=st.cur,r=R();if(st.won[i]||!st.raw[i])return;
    // the shaded marks must fill whole parts
    if(r.shade%g!==0){snd.no();say('Parts of '+g+' '+nm(r.small,g)+' don\'t fit: the shaded part would end in the middle of a part. Try another size.','hint');return;}
    st.grp[i]=g;save();snd.split();say('');render();}
  function drawStrip(){var r=R(),i=st.cur,n=r.rate,W=600,X=20,Y=28,H=46,s='';
    s+='<text x="'+X+'" y="18" font-family="Nunito,sans-serif" font-weight="900" font-size="15" fill="#1E3A6E">1 '+esc(r.big.name[0])+' = '+n+' '+esc(r.small.name[1])+'</text>';
    if(r.mode==='take'){var c=st.cut[i];
      s+='<rect x="'+X+'" y="'+Y+'" width="'+W+'" height="'+H+'" rx="6" fill="#FFF3DE" stroke="#3B2417" stroke-width="3"/>';
      if(!c){s+='<text x="320" y="'+(Y+29)+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="16" fill="#6B7290">one whole '+esc(r.big.name[0])+' · tap a cut button</text>';}
      else{var pw=W/c,pv=n/c;for(var k=0;k<c;k++){var on=!!st.on[i][k],x=X+k*pw;
          s+='<rect class="ok-part" data-k="'+k+'" x="'+x.toFixed(1)+'" y="'+Y+'" width="'+pw.toFixed(1)+'" height="'+H+'" fill="'+(on?'#6B3FA0':'#FFF3DE')+'" stroke="#3B2417" stroke-width="3" tabindex="0" role="button" aria-label="part '+(k+1)+' of '+c+(on?', taken':'')+'"/>';
          var lab=(Number.isInteger(pv)?pv:Math.round(pv*10)/10)+' '+esc(r.small.unit);
          s+='<text x="'+(x+pw/2).toFixed(1)+'" y="'+(Y+29)+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="'+(c>10?12:15)+'" fill="'+(on?'#fff':'#3B2417')+'" pointer-events="none">'+(pw>30?lab:'')+'</text>';}
        s+='<text x="320" y="'+(Y+H+24)+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="14" fill="#4A5068">'+c+' equal parts · tap a part to take it</text>';}
    }else{var g=st.grp[i]||1,parts=n/g,pw2=W/parts,shaded=taken(i);
      // small marks
      for(var m=0;m<n;m++){var on2=!!st.on[i][m],mx=X+m*(W/n),mw=W/n;
        s+='<rect class="ok-mark" data-k="'+m+'" x="'+mx.toFixed(1)+'" y="'+Y+'" width="'+mw.toFixed(1)+'" height="'+H+'" fill="'+(on2?'#2DB87A':'#FFF3DE')+'" stroke="'+(g>1?'#C9BFB0':'#3B2417')+'" stroke-width="'+(g>1?1:(n>30?1:2))+'" tabindex="0" role="button" aria-label="'+esc(r.small.name[0])+' '+(m+1)+(on2?', shaded':'')+'"/>';}
      if(g>1){for(var q=0;q<parts;q++){var qx=X+q*pw2;s+='<rect x="'+qx.toFixed(1)+'" y="'+Y+'" width="'+pw2.toFixed(1)+'" height="'+H+'" fill="none" stroke="#3B2417" stroke-width="3" pointer-events="none"/>';
          if(pw2>34)s+='<text x="'+(qx+pw2/2).toFixed(1)+'" y="'+(Y+H+17)+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#4A5068">'+g+' '+esc(r.small.unit)+'</text>';}}
      s+='<rect x="'+X+'" y="'+Y+'" width="'+W+'" height="'+H+'" rx="6" fill="none" stroke="#3B2417" stroke-width="3" pointer-events="none"/>';
      s+='<text x="320" y="'+(Y+H+(g>1?38:24))+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="14" fill="#4A5068">'+(g>1?parts+' equal parts of '+g+' '+esc(r.small.unit):n+' '+esc(r.small.name[1])+' · tap or drag to shade '+r.shade)+'</text>';}
    svg.innerHTML=s;svg.setAttribute('viewBox','0 0 640 '+(r.mode==='name'&&(st.grp[i]||1)>1?126:110));
    svg.setAttribute('aria-label',r.mode==='take'?'A strip for 1 '+r.big.name[0]+(st.cut[i]?' cut into '+st.cut[i]+' equal parts of '+per(r)+' '+r.small.name[1]+' each, '+taken(i)+' taken.':', not cut yet.'):'A strip for 1 '+r.big.name[0]+' with '+n+' '+r.small.name[1]+' marked, '+taken(i)+' shaded.');}
  function fracForm(id,q){return '<form class="bm-form mk-two ok-fracform" data-f="'+id+'"><span class="mk-two-q">'+q+'</span><span class="ok-frac ok-frac-in"><input type="text" inputmode="numeric" autocomplete="off" aria-label="top number"><i></i><input type="text" inputmode="numeric" autocomplete="off" aria-label="bottom number"></span><span class="bm-u">'+esc(R().big.unit)+'</span><button type="submit" class="ok-btn">Check</button></form>';}
  function render(){var i=st.cur,r=R(),n=r.rate;
    if(rounds.length>1)$$('.ok-rounds button',root).forEach(function(b,k){b.classList.toggle('on',k===i);b.classList.toggle('won',!!st.won[k]);b.setAttribute('aria-selected',k===i);});
    $('.ok-do',root).innerHTML=st.won[i]?'<span class="ok-step" style="background:#1E8C5A">Done</span>'+(r.doneText||''):r.text;
    var b='';
    if(r.mode==='take'){(r.cuts||[2,3,4,6,12]).forEach(function(c){b+='<button type="button" class="ok-btn ok-cut-btn'+(st.cut[i]===c?' on':'')+'" data-n="'+c+'">Cut into '+c+'</button>';});}
    else if(st.raw[i]&&!st.won[i]){(r.groups||[2,3,4,6]).forEach(function(g){b+='<button type="button" class="ok-btn ok-grp-btn'+(st.grp[i]===g?' on':'')+'" data-n="'+g+'">Parts of '+g+' '+esc(r.small.unit)+'</button>';});}
    btns.innerHTML=b;btns.style.display=b?'':'none';
    $$('.ok-cut-btn',btns).forEach(function(x){x.onclick=function(){cutTo(+x.dataset.n);};});
    $$('.ok-grp-btn',btns).forEach(function(x){x.onclick=function(){groupTo(+x.dataset.n);};});
    drawStrip();
    var sym=$('.ok-sym',root),t=taken(i);
    if(r.mode==='take'){var c=st.cut[i];
      sym.innerHTML=!c?'<span class="big">'+frac(r.num,r.den)+' of 1 '+esc(r.big.unit)+'</span><span class="exp">'+(r.free?'Try it any way you like.':'Cut the '+esc(r.big.name[0])+' into equal parts first.')+'</span>':
        '<span class="big">'+t+' of '+c+' parts</span><span class="exp">each part is '+per(r)+' '+nm(r.small,per(r))+(t?' · '+t+' × '+per(r)+' '+esc(r.small.unit):'')+'</span>';}
    else{var g=st.grp[i]||1;
      sym.innerHTML=g===1?'<span class="big">'+t+' of '+n+' '+esc(r.small.name[1])+' shaded</span><span class="exp">'+(st.raw[i]?'Now make bigger equal parts.':'part over whole, both in '+esc(r.small.name[1]))+'</span>':
        '<span class="big">'+(t/g)+' of '+(n/g)+' parts</span><span class="exp">parts of '+g+' '+esc(r.small.name[1])+'</span>';}
    // the ask
    var show='';
    if(r.mode==='take'&&r.ask&&(r.free?st.cut[i]>0:(st.cut[i]===r.den&&t===r.num)))show='ask';
    if(r.mode==='name'&&t===r.shade&&!st.raw[i])show='raw';
    if(r.mode==='name'&&st.raw[i]&&(st.grp[i]||1)>1)show='simp';
    if(st.won[i]&&r.mode==='name')show=(r.answer.n===r.raw.n&&r.answer.d===r.raw.d)?'raw':'simp';
    if(st.won[i]&&r.mode==='take'&&r.ask)show='ask';
    if(askEl.dataset.r!==i+':'+show){askEl.dataset.r=i+':'+show;askEl.innerHTML='';
      if(show==='ask'){var A=r.ask,sa=st.a[i]||[];
        askEl.innerHTML='<form class="bm-form mk-two"><span class="mk-two-q">'+A.q+'</span>'+A.units.map(function(u,k){return '<input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(A.q.replace(/<[^>]+>/g,'')+' '+u)+'" value="'+esc(sa[k]||'')+'"><span class="bm-u">'+esc(u)+'</span>';}).join('')+'<button type="submit" class="ok-btn">Check</button></form>';
        var f=$('form',askEl),ins=$$('input',f);if(st.won[i])ins.forEach(function(x){x.disabled=true;});
        f.onsubmit=function(e){e.preventDefault();if(st.won[st.cur])return;var vs=ins.map(function(x){return num(x.value);});st.a[st.cur]=ins.map(function(x){return x.value;});save();
          if(vs.some(function(x){return x==null;}))return say('Type a number first.','hint');
          if(vs.every(function(x,k){return x===A.answer[k];})){ins.forEach(function(x){x.disabled=true;});say(A.doneText||'Yes!','good');win(st.cur);return;}
          snd.no();var mk=(A.mistakes||[]).filter(function(z){return z.v.every(function(x,k){return x===vs[k];});})[0];
          if(mk)return say(mk.text,'hint');say(A.hint||'Count the parts you took. Each one is '+per(R())+' '+R().small.name[1]+'.','hint');};}
      if(show==='raw'||show==='simp'){var simp=show==='simp';
        askEl.innerHTML=fracForm(show,simp?(r.simpQ||'In simplest form, the scrap is'):(r.rawQ||'Part over whole: the scrap is'));
        var f2=$('form',askEl),ii=$$('input',f2),sv=st.a[i]||[];if(sv[simp?2:0]!=null){ii[0].value=sv[simp?2:0]||'';ii[1].value=sv[simp?3:1]||'';}
        if(st.won[i])ii.forEach(function(x){x.disabled=true;});
        f2.onsubmit=function(e){e.preventDefault();var rr=R(),j=st.cur;if(st.won[j])return;var a=num(ii[0].value),d=num(ii[1].value);st.a[j]=st.a[j]||[];st.a[j][simp?2:0]=ii[0].value;st.a[j][simp?3:1]=ii[1].value;save();
          if(a==null||d==null)return say('Type the top number and the bottom number.','hint');
          if(!simp){if(a===rr.raw.n&&d===rr.raw.d){st.raw[j]=true;save();if(rr.answer.n===a&&rr.answer.d===d){ii.forEach(function(x){x.disabled=true;});say(rr.rawDone||('Yes: '+a+' '+rr.small.name[1]+' out of the '+d+' in 1 '+rr.big.name[0]+'. No bigger equal part fits both numbers, so it is already in simplest form.'),'good');win(j);return;}snd.done();say(rr.rawDone||('Yes: '+a+' '+rr.small.name[1]+' out of the '+d+' in 1 '+rr.big.name[0]+'. Now make bigger equal parts to find the simplest form.'),'good');render();return;}
            snd.no();var m1=(rr.rawMistakes||[]).filter(function(z){return z.n===a&&z.d===d;})[0];if(m1)return say(m1.text,'hint');
            if(a===rr.answer.n&&d===rr.answer.d)return say('That is the simplest form, and it is right! First write it the long way: the shaded '+rr.small.name[1]+' over all the '+rr.small.name[1]+' in 1 '+rr.big.name[0]+'.','hint');
            if(d===1)return say('The bottom number is the whole. The whole is 1 '+rr.big.name[0]+', but in '+rr.small.name[1]+': how many '+rr.small.name[1]+' is that?','hint');
            return say(rr.rawHint||('Top: how many '+rr.small.name[1]+' are shaded? Bottom: how many '+rr.small.name[1]+' make the whole '+rr.big.name[0]+'?'),'hint');}
          var g=st.grp[j];
          if(a===rr.answer.n&&d===rr.answer.d){ii.forEach(function(x){x.disabled=true;});say(rr.doneText2||('Yes! '+a+' of '+d+' equal parts. '+rr.raw.n+'/'+rr.raw.d+' and '+a+'/'+d+' name the same amount, and '+a+'/'+d+' is the simplest form.'),'good');win(j);return;}
          snd.no();var m2=(rr.simpMistakes||[]).filter(function(z){return z.n===a&&z.d===d;})[0];if(m2)return say(m2.text,'hint');
          if(a*rr.answer.d===d*rr.answer.n)return say(a+'/'+d+' is equal, but it is not the simplest form yet. Try bigger parts so fewer of them fill the strip.','hint');
          if(d===rr.rate/g&&a!==rr.shade/g)return say('Count the shaded parts on the strip now, not the '+rr.small.name[1]+'.','hint');
          return say(rr.simpHint||('Read the strip: how many parts are shaded, out of how many parts in all?'),'hint');};}}
    if(show==='simp'&&!st.won[i]&&(st.grp[i]||1)>1){/* a bigger group than the one that fits is nudged by the message */}
    var nx=$('.ok-next',root);
    if(st.won[i]&&i<rounds.length-1){if(!nx){nx=document.createElement('button');nx.className='ok-btn ok-next';nx.type='button';nx.textContent='Next →';nx.onclick=function(){st.cur++;save();say('');askEl.dataset.r='';render();};$$('.ok-row',root).pop().appendChild(nx);}}
    else if(nx)nx.remove();}
  // tap a part or mark; drag across several (pointer events)
  var paint=null;
  function hitAt(e){var el=document.elementFromPoint(e.clientX,e.clientY);return el&&svg.contains(el)&&(el.classList.contains('ok-part')||el.classList.contains('ok-mark'))?el:null;}
  svg.style.touchAction='none';
  svg.addEventListener('pointerdown',function(e){var el=hitAt(e);if(!el)return;var k=+el.dataset.k,i=st.cur;paint={id:e.pointerId,v:!st.on[i][k],last:k};try{svg.setPointerCapture(e.pointerId);}catch(x){}e.preventDefault();setOn(i,k,paint.v);});
  svg.addEventListener('pointermove',function(e){if(!paint||paint.id!==e.pointerId)return;var el=hitAt(e);if(!el)return;var k=+el.dataset.k;if(k===paint.last)return;paint.last=k;setOn(st.cur,k,paint.v);});
  function end(e){if(paint&&paint.id===e.pointerId)paint=null;}
  svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  svg.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var el=e.target;if(!el.dataset||el.dataset.k==null)return;e.preventDefault();setOn(st.cur,+el.dataset.k,!st.on[st.cur][+el.dataset.k]);});
  if(rounds.length>1)$$('.ok-rounds button',root).forEach(function(b){b.onclick=function(){st.cur=+b.dataset.i;save();say('');askEl.dataset.r='';render();};});
  $('.ok-reset',root).onclick=function(){var i=st.cur;st.cut[i]=0;st.on[i]=[];st.raw[i]=false;st.grp[i]=0;st.won[i]=false;st.a[i]=[];save();say('');askEl.dataset.r='';render();};
  render();
  return {state:st};
}
/* ═══════════ MIXED-NUMBER SPLITTER (mixed numbers of a unit) ═══════════
   Whole-unit bars stacked to scale (each bar = 1 big unit = `rate` small units) and one more bar for the fraction part.
   split: a tag like 2 5/6 ft splits into whole units + a fraction of a unit. Tap "+ 1 whole" until the whole units match,
          cut the last bar into equal parts (the bottom number) and take some (the top number, tap or drag). Then the
          round's `asks` appear one after another (e.g. "2 5/6 ft = __ ft __ in", then "= __ in").
   group: `total` small units sit on a tape (same scale). "Mark off 1 whole …" moves `rate` of them into a whole-unit bar
          (skip-counting, no division). The leftover goes over `rate` on one more bar: whole + stacked fraction boxes. If
          that fraction is not in simplest form, Parts-of buttons regroup the leftover bar, then the simplest form is asked.
          `startWholes` puts whole bars there already (two-unit form like 5 ft 2 in → 5 1/6 ft).
   round = {name, mode:'split'|'group', text, doneText, rate, big:{unit,name:[one,many]}, small:{unit,name:[one,many]},
            split: w, n, d, cuts:[…], free (any wholes and any cut, no asks), asks:[{q, units, answer, mistakes:[{v,text}], hint, doneText}]
            group: total, startWholes, groups:[…], answer:{w,n,d}, rawMistakes:[{w,n,d,text}], simpMistakes, rawQ, simpQ }
   cfg = { key, rounds, onRound(i, root), onDone(root) } */
function splitter(root,cfg){
  var rounds=cfg.rounds,key=cfg.key,MAXW=7;
  function fresh(){return {cur:0,w:rounds.map(function(r){return r.mode==='group'?(r.startWholes||0):0;}),pile:rounds.map(function(r){return r.total||0;}),cut:rounds.map(function(){return 0;}),on:rounds.map(function(){return [];}),
    ask:rounds.map(function(){return 0;}),raw:rounds.map(function(){return false;}),grp:rounds.map(function(){return 0;}),won:rounds.map(function(){return false;}),a:rounds.map(function(){return {};}),fired:false};}
  var st=ls(key,null);if(!st||!st.pile||st.pile.length!==rounds.length)st=fresh();
  root.classList.add('ok-tool','ok-ribbon','ok-splitter');
  root.innerHTML=(rounds.length>1?'<div class="ok-rounds" role="tablist">'+rounds.map(function(r,i){return '<button type="button" data-i="'+i+'">'+esc(r.name)+'</button>';}).join('')+'</div>':'')+
    '<p class="ok-do" aria-live="polite"></p><div class="ok-sp-tag"></div><div class="ok-row ok-sp-wbtns"></div><div class="ok-row ok-cutbtns"></div>'+
    '<div class="ok-stripbox"><svg class="ok-strip" viewBox="0 0 640 120" role="img"></svg></div>'+
    '<div class="ok-sym" aria-live="polite"></div><div class="ok-ribbon-ask ok-sp-ask"></div><div class="ok-msg" aria-live="polite"></div>'+
    '<div class="ok-row"><button class="ok-btn ok-reset" type="button">↺ Start over</button></div>';
  var svg=$('.ok-strip',root),wb=$('.ok-sp-wbtns',root),btns=$('.ok-cutbtns',root),msg=$('.ok-msg',root),askEl=$('.ok-sp-ask',root),tagEl=$('.ok-sp-tag',root);
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t||'';}
  function save(){lsSet(key,st);}
  function nm(u,n){return n===1?u.name[0]:u.name[1];}
  function R(){return rounds[st.cur];}
  function taken(i){return st.on[i].filter(Boolean).length;}
  function frac(n,d){return '<span class="ok-frac"><b>'+n+'</b><i></i><b>'+d+'</b></span>';}
  function mixed(w,n,d,u){return '<span class="ok-mixed">'+(w?'<b>'+w+'</b>':'')+(n?frac(n,d):'')+' '+esc(u)+'</span>';}
  function gcd(a,b){return b?gcd(b,a%b):a;}
  function leftover(i){return st.pile[i];}
  function win(i){if(st.won[i])return;st.won[i]=true;save();snd.done();if(cfg.onRound)cfg.onRound(i,root);
    if(st.won.every(Boolean)&&!st.fired){st.fired=true;save();if(cfg.onDone)cfg.onDone(root);}render();}
  function ready(i){var r=rounds[i];return r.mode==='split'&&!r.free&&st.w[i]===r.w&&st.cut[i]===r.d&&taken(i)===r.n;}
  function addWhole(dx){var i=st.cur,r=R();if(st.won[i])return;var v=st.w[i]+dx;
    if(v<0)return;if(v>(r.free?6:r.w)){snd.no();say('The tag has only '+r.w+' whole '+nm(r.big,r.w)+'. The rest is the fraction part, on the last bar.','hint');return;}
    st.w[i]=v;save();snd.click();say('');render();}
  function cutTo(n){var i=st.cur,r=R();if(st.won[i])return;
    if(!r.free&&n!==r.d){snd.no();say((r.cutHint||'Look at the bottom number of the fraction. It tells how many equal parts to cut the last '+r.big.name[0]+' into.')+' You cut '+n+'.','hint');}else say('');
    st.cut[i]=n;st.on[i]=[];save();snd.split();render();}
  function setOn(i,k,v){var r=rounds[i];if(st.won[i]||r.mode!=='split')return;var arr=st.on[i];if(!!arr[k]===!!v)return;
    if(v&&!r.free&&taken(i)>=r.n){say('You have '+r.n+' parts already. The top number says how many parts to take.','hint');snd.no();return;}
    arr[k]=!!v;snd.click();save();render();}
  function markOff(){var i=st.cur,r=R();if(st.won[i])return;
    if(st.pile[i]<r.rate){snd.no();say('Only '+st.pile[i]+' '+nm(r.small,st.pile[i])+' are left: not enough for another whole '+r.big.name[0]+'. They are the leftover.','hint');return;}
    st.pile[i]-=r.rate;st.w[i]++;save();snd.merge();say(st.pile[i]<r.rate?(st.pile[i]?st.pile[i]+' '+nm(r.small,st.pile[i])+' left over: not enough for another whole '+r.big.name[0]+'.':'No '+r.small.name[1]+' left over.'):'');render();}
  function groupTo(g){var i=st.cur,r=R();if(st.won[i]||!st.raw[i])return;var lo=leftover(i);
    if(lo%g!==0||r.rate%g!==0){snd.no();say('Parts of '+g+' '+nm(r.small,g)+' don\'t fit: the leftover would end in the middle of a part. Try another size.','hint');return;}
    st.grp[i]=g;save();snd.split();say('');render();}
  function bar(s,x,y,w,h,fill,label,lc){s.push('<rect x="'+x.toFixed(1)+'" y="'+y+'" width="'+w.toFixed(1)+'" height="'+h+'" rx="5" fill="'+fill+'" stroke="#3B2417" stroke-width="3"/>');
    if(label)s.push('<text x="'+(x+w/2).toFixed(1)+'" y="'+(y+h/2+5)+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="15" fill="'+(lc||'#fff')+'" pointer-events="none">'+label+'</text>');}
  function drawStrip(){var r=R(),i=st.cur,n=r.rate,W=560,X=60,BH=32,G=8,s=[],y=26;
    s.push('<text x="20" y="18" font-family="Nunito,sans-serif" font-weight="900" font-size="15" fill="#1E3A6E">Each bar is 1 '+esc(r.big.name[0])+' = '+n+' '+esc(r.small.name[1])+'</text>');
    // whole-unit bars
    for(var k=0;k<st.w[i];k++){s.push('<text x="20" y="'+(y+BH/2+5)+'" font-family="Nunito,sans-serif" font-weight="900" font-size="14" fill="#3B2417">1 '+esc(r.big.unit)+'</text>');
      bar(s,X,y,W,BH,'#1F8FB4',n+' '+esc(r.small.unit));y+=BH+G;}
    if(r.mode==='split'){var c=st.cut[i];
      s.push('<text x="20" y="'+(y+BH/2+5)+'" font-family="Nunito,sans-serif" font-weight="900" font-size="14" fill="#C2601F">part</text>');
      if(!c){bar(s,X,y,W,BH,'#FFF3DE','one more '+esc(r.big.name[0])+' · tap a cut button','#6B7290');}
      else{var pw=W/c,pv=n/c;for(var q=0;q<c;q++){var on=!!st.on[i][q],px=X+q*pw;
          s.push('<rect class="ok-part" data-k="'+q+'" x="'+px.toFixed(1)+'" y="'+y+'" width="'+pw.toFixed(1)+'" height="'+BH+'" fill="'+(on?'#6B3FA0':'#FFF3DE')+'" stroke="#3B2417" stroke-width="3" tabindex="0" role="button" aria-label="part '+(q+1)+' of '+c+(on?', taken':'')+'"/>');
          if(pw>30)s.push('<text x="'+(px+pw/2).toFixed(1)+'" y="'+(y+BH/2+5)+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="'+(c>10?12:14)+'" fill="'+(on?'#fff':'#3B2417')+'" pointer-events="none">'+(Number.isInteger(pv)?pv:Math.round(pv*10)/10)+' '+esc(r.small.unit)+'</text>');}}
      y+=BH+G;}
    else{var lo=st.pile[i],mw=W/n;
      if(lo>=n){ // the tape of small units still to mark off, wrapped at one big unit per row (same scale)
        s.push('<text x="20" y="'+(y+BH/2+5)+'" font-family="Nunito,sans-serif" font-weight="900" font-size="14" fill="#2DB87A">tape</text>');
        for(var m=0;m<lo;m++){var row=Math.floor(m/n),col=m%n;s.push('<rect x="'+(X+col*mw).toFixed(1)+'" y="'+(y+row*(BH+G))+'" width="'+mw.toFixed(1)+'" height="'+BH+'" fill="#2DB87A" stroke="'+(n>30?'#1E8C5A':'#3B2417')+'" stroke-width="'+(n>30?0.6:1.5)+'"/>');}
        s.push('<text x="'+(X+W/2)+'" y="'+(y+Math.ceil(lo/n)*(BH+G)+10)+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="#4A5068">'+lo+' '+esc(r.small.name[1])+' to mark off</text>');
        y+=Math.ceil(lo/n)*(BH+G)+16;}
      else{ // the leftover over one whole unit
        var g=st.grp[i]||1;s.push('<text x="20" y="'+(y+BH/2+5)+'" font-family="Nunito,sans-serif" font-weight="900" font-size="14" fill="#C2601F">part</text>');
        for(var m2=0;m2<n;m2++){var sh=m2<lo;s.push('<rect x="'+(X+m2*mw).toFixed(1)+'" y="'+y+'" width="'+mw.toFixed(1)+'" height="'+BH+'" fill="'+(sh?'#2DB87A':'#FFF3DE')+'" stroke="'+(g>1?'#C9BFB0':'#3B2417')+'" stroke-width="'+(g>1||n>30?0.8:1.5)+'"/>');}
        if(g>1)for(var q2=0;q2<n/g;q2++)s.push('<rect x="'+(X+q2*g*mw).toFixed(1)+'" y="'+y+'" width="'+(g*mw).toFixed(1)+'" height="'+BH+'" fill="none" stroke="#3B2417" stroke-width="3" pointer-events="none"/>');
        s.push('<rect x="'+X+'" y="'+y+'" width="'+W+'" height="'+BH+'" rx="5" fill="none" stroke="#3B2417" stroke-width="3"/>');
        s.push('<text x="'+(X+W/2)+'" y="'+(y+BH+17)+'" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="#4A5068">'+(g>1?(lo/g)+' of '+(n/g)+' parts of '+g+' '+esc(r.small.unit):lo+' of the '+n+' '+esc(r.small.name[1])+' in one more '+esc(r.big.name[0]))+'</text>');
        y+=BH+26;}}
    svg.innerHTML=s.join('');svg.setAttribute('viewBox','0 0 640 '+Math.max(80,y));
    svg.setAttribute('aria-label',st.w[i]+' whole '+nm(r.big,st.w[i])+(r.mode==='split'?(st.cut[i]?' and one more '+r.big.name[0]+' cut into '+st.cut[i]+' equal parts, '+taken(i)+' taken':' and one more '+r.big.name[0]+', not cut yet'):', '+st.pile[i]+' '+r.small.name[1]+(st.pile[i]>=r.rate?' still to mark off':' left over')));}
  function mixForm(id,q,unit){return '<form class="bm-form mk-two ok-fracform ok-mixform" data-f="'+id+'"><span class="mk-two-q">'+q+'</span><input type="text" inputmode="numeric" autocomplete="off" class="ok-mix-w" aria-label="whole '+esc(R().big.name[1])+'"><span class="ok-frac ok-frac-in"><input type="text" inputmode="numeric" autocomplete="off" aria-label="top number"><i></i><input type="text" inputmode="numeric" autocomplete="off" aria-label="bottom number"></span><span class="bm-u">'+esc(unit)+'</span><button type="submit" class="ok-btn">Check</button></form>';}
  function render(){var i=st.cur,r=R(),n=r.rate;
    if(rounds.length>1)$$('.ok-rounds button',root).forEach(function(b,k){b.classList.toggle('on',k===i);b.classList.toggle('won',!!st.won[k]);b.setAttribute('aria-selected',k===i);});
    $('.ok-do',root).innerHTML=st.won[i]?'<span class="ok-step" style="background:#1E8C5A">Done</span>'+(r.doneText||''):r.text;
    // the tag, split on a bond
    if(r.mode==='split')tagEl.innerHTML='<span class="ok-sp-whole">'+mixed(r.w,r.n,r.d,r.big.unit)+'</span><span class="ok-sp-legs" aria-hidden="true">⟋ ⟍</span><span class="ok-sp-parts"><span>'+r.w+' '+esc(r.big.unit)+'</span><span>'+frac(r.n,r.d)+' '+esc(r.big.unit)+'</span></span>';
    else tagEl.innerHTML='<span class="ok-sp-whole">'+(r.startWholes?r.startWholes+' '+esc(r.big.unit)+' '+r.total+' '+esc(r.small.unit):r.total+' '+esc(r.small.unit))+'</span><span class="ok-sp-legs" aria-hidden="true">⟋ ⟍</span><span class="ok-sp-parts"><span>whole '+esc(r.big.name[1])+'</span><span>leftover</span></span>';
    var w='';if(!st.won[i]){
      if(r.mode==='split')w='<button type="button" class="ok-btn ok-sp-add">+ 1 whole '+esc(r.big.name[0])+'</button><button type="button" class="ok-btn ok-sp-sub">− 1</button>';
      else if(st.pile[i]>=n)w='<button type="button" class="ok-btn ok-sp-mark">Mark off 1 whole '+esc(r.big.name[0])+' ('+n+' '+esc(r.small.unit)+')</button>';}
    wb.innerHTML=w;wb.style.display=w?'':'none';
    var b='';
    if(r.mode==='split'&&!st.won[i])(r.cuts||[2,3,4,6,12]).forEach(function(c){b+='<button type="button" class="ok-btn ok-cut-btn'+(st.cut[i]===c?' on':'')+'" data-n="'+c+'">Cut into '+c+'</button>';});
    else if(r.mode==='group'&&st.raw[i]&&!st.won[i])(r.groups||[2,3,4,6]).forEach(function(g){b+='<button type="button" class="ok-btn ok-grp-btn'+(st.grp[i]===g?' on':'')+'" data-n="'+g+'">Parts of '+g+' '+esc(r.small.unit)+'</button>';});
    btns.innerHTML=b;btns.style.display=b?'':'none';
    var ad=$('.ok-sp-add',wb),sb=$('.ok-sp-sub',wb),mk=$('.ok-sp-mark',wb);if(ad)ad.onclick=function(){addWhole(1);};if(sb)sb.onclick=function(){addWhole(-1);};if(mk)mk.onclick=markOff;
    $$('.ok-cut-btn',btns).forEach(function(x){x.onclick=function(){cutTo(+x.dataset.n);};});
    $$('.ok-grp-btn',btns).forEach(function(x){x.onclick=function(){groupTo(+x.dataset.n);};});
    drawStrip();
    var sym=$('.ok-sym',root),t=taken(i);
    if(r.mode==='split'){var c=st.cut[i];
      sym.innerHTML='<span class="big">'+st.w[i]+' whole '+nm(r.big,st.w[i])+(c?' + '+t+' of '+c+' parts':'')+'</span><span class="exp">'+(st.w[i]?'each whole '+r.big.name[0]+' is '+n+' '+r.small.name[1]:'add the whole '+r.big.name[1]+' first')+(c?' · each part is '+(n/c)+' '+nm(r.small,n/c):'')+'</span>';}
    else{var g=st.grp[i]||1,lo=st.pile[i];
      sym.innerHTML=lo>=n?'<span class="big">'+st.w[i]+' whole '+nm(r.big,st.w[i])+' marked off</span><span class="exp">'+lo+' '+r.small.name[1]+' still on the tape</span>':
        '<span class="big">'+st.w[i]+' whole '+nm(r.big,st.w[i])+' + '+(g>1?(lo/g)+' of '+(n/g)+' parts':lo+' of '+n+' '+r.small.name[1])+'</span><span class="exp">'+(g>1?'parts of '+g+' '+r.small.name[1]:'the leftover over the whole '+r.big.name[0]+', in '+r.small.name[1])+'</span>';}
    // the ask
    var show='';
    if(r.mode==='split'&&(ready(i)||st.won[i])&&r.asks)show='ask'+Math.min(st.ask[i],r.asks.length-1);
    if(r.mode==='group'&&st.pile[i]<n){var simpleRaw=gcd(st.pile[i],n)===1||st.pile[i]===0;
      show=!st.raw[i]?'raw':st.won[i]?(simpleRaw?'raw':'simp'):(st.grp[i]||1)>1?'simp':'wait';}
    if(askEl.dataset.r!==i+':'+show){askEl.dataset.r=i+':'+show;askEl.innerHTML='';
      if(show.indexOf('ask')===0){var A=r.asks[+show.slice(3)],sa=st.a[i]['k'+show]||[];
        askEl.innerHTML='<form class="bm-form mk-two"><span class="mk-two-q">'+A.q+'</span>'+A.units.map(function(u,k){return '<input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(A.q.replace(/<[^>]+>/g,'')+' '+u)+'" value="'+esc(sa[k]||'')+'"><span class="bm-u">'+esc(u)+'</span>';}).join('')+'<button type="submit" class="ok-btn">Check</button></form>';
        var f=$('form',askEl),ins=$$('input',f),ai=+show.slice(3);if(st.won[i]||st.ask[i]>ai)ins.forEach(function(x){x.disabled=true;});
        f.onsubmit=function(e){e.preventDefault();var j=st.cur;if(st.won[j])return;var vs=ins.map(function(x){return num(x.value);});st.a[j]['k'+show]=ins.map(function(x){return x.value;});save();
          if(vs.some(function(x){return x==null;}))return say(ins.length>1?'Type a number in each box.':'Type a number first.','hint');
          if(vs.every(function(x,k){return x===A.answer[k];})){ins.forEach(function(x){x.disabled=true;});say(A.doneText||'Yes!','good');
            if(ai<r.asks.length-1){st.ask[j]=ai+1;save();snd.done();askEl.dataset.r='';render();say(A.doneText||'Yes!','good');return;}
            st.ask[j]=r.asks.length;save();win(j);return;}
          snd.no();var m=(A.mistakes||[]).filter(function(z){return z.v.every(function(x,k){return x===vs[k];});})[0];
          if(m)return say(m.text,'hint');say(A.hint||'Count the whole '+R().big.name[1]+' and the parts you took.','hint');};
        // earlier asks of this round stay on screen, filled in
        for(var pa=ai-1;pa>=0;pa--){var P=r.asks[pa],sv=st.a[i]['kask'+pa]||P.answer;var old2=document.createElement('div');old2.className='ok-sp-old';
          old2.innerHTML='<div class="bm-form mk-two"><span class="mk-two-q">'+P.q+'</span>'+P.units.map(function(u,k){return '<input type="text" disabled value="'+esc(sv[k]!=null?sv[k]:P.answer[k])+'"><span class="bm-u">'+esc(u)+'</span>';}).join('')+'</div>';askEl.insertBefore(old2,askEl.firstChild);}}
      if(show==='raw'||show==='simp'){var simp=show==='simp',lo2=st.pile[i];
        askEl.innerHTML=mixForm(show,simp?(r.simpQ||'In simplest form:'):(r.rawQ||'Whole '+r.big.name[1]+', then the leftover over '+n+':'),r.big.unit);
        var f2=$('form',askEl),ii=$$('input',f2),sv2=st.a[i][show]||[];ii.forEach(function(x,k){x.value=sv2[k]||'';});
        if(st.won[i]){ii.forEach(function(x){x.disabled=true;});var ans=simp?[r.answer.w,r.answer.n,r.answer.d]:[st.w[i],lo2,n];ii.forEach(function(x,k){x.value=ans[k];});}
        else if(simp){var o=document.createElement('div');o.className='ok-sp-old';o.innerHTML='<div class="bm-form mk-two"><span class="mk-two-q">'+(r.rawQ||'Whole '+r.big.name[1]+', then the leftover over '+n+':')+'</span><span class="ok-mixed"><b>'+st.w[i]+'</b>'+frac(lo2,n)+' '+esc(r.big.unit)+'</span></div>';askEl.insertBefore(o,askEl.firstChild);}
        f2.onsubmit=function(e){e.preventDefault();var rr=R(),j=st.cur;if(st.won[j])return;var v=ii.map(function(x){return num(x.value);});st.a[j][show]=ii.map(function(x){return x.value;});save();
          if(v.some(function(x){return x==null;}))return say('Type the whole number, the top number and the bottom number.','hint');
          var lo3=st.pile[j],wh=st.w[j],A2=rr.answer;
          if(!simp){if(v[0]===wh&&v[1]===lo3&&v[2]===rr.rate){st.raw[j]=true;save();
              if(gcd(lo3,rr.rate)===1||lo3===0){ii.forEach(function(x){x.disabled=true;});say(rr.rawDone||('Yes: '+wh+' whole '+nm(rr.big,wh)+' and '+lo3+' '+nm(rr.small,lo3)+' out of the '+rr.rate+' in one more '+rr.big.name[0]+'. No bigger equal part fits both numbers, so it is already in simplest form.'),'good');win(j);return;}
              snd.done();say(rr.rawDone||('Yes: '+wh+' whole '+nm(rr.big,wh)+' and '+lo3+' out of '+rr.rate+'. Now make bigger equal parts to find the simplest form.'),'good');askEl.dataset.r='';render();return;}
            snd.no();var m1=(rr.rawMistakes||[]).filter(function(z){return z.w===v[0]&&z.n===v[1]&&z.d===v[2];})[0];if(m1)return say(m1.text,'hint');
            if(v[0]===A2.w&&v[1]===A2.n&&v[2]===A2.d)return say('That is the simplest form, and it is right! First write the leftover the long way: the '+rr.small.name[1]+' left over, out of the '+rr.rate+' in one whole '+rr.big.name[0]+'.','hint');
            if(v[0]!==wh)return say('The whole number is how many whole '+rr.big.name[1]+' you marked off: count the blue bars.','hint');
            if(v[2]===1||v[2]===rr.total||v[2]!==rr.rate)return say('The bottom number is the whole: one '+rr.big.name[0]+', written in '+rr.small.name[1]+'. How many '+rr.small.name[1]+' make 1 '+rr.big.name[0]+'?','hint');
            return say('Top: how many '+rr.small.name[1]+' are left over (green on the last bar)?','hint');}
          if(v[0]===A2.w&&v[1]===A2.n&&v[2]===A2.d){ii.forEach(function(x){x.disabled=true;});say(rr.doneText2||('Yes! '+A2.w+' and '+A2.n+' of '+A2.d+' equal parts. That is the simplest form.'),'good');win(j);return;}
          snd.no();var m2=(rr.simpMistakes||[]).filter(function(z){return z.w===v[0]&&z.n===v[1]&&z.d===v[2];})[0];if(m2)return say(m2.text,'hint');
          if(v[0]!==A2.w)return say('The whole '+rr.big.name[1]+' stay the same: '+wh+'. Only the leftover gets simpler.','hint');
          if(v[1]*A2.d===v[2]*A2.n)return say(frac(v[1],v[2])+' is equal, but it is not the simplest form yet. Try bigger parts so fewer of them fill the bar.','hint');
          return say('Read the last bar: how many parts are green, out of how many parts in all?','hint');};}}
    var nx=$('.ok-next',root);
    if(st.won[i]&&i<rounds.length-1){if(!nx){nx=document.createElement('button');nx.className='ok-btn ok-next';nx.type='button';nx.textContent='Next →';nx.onclick=function(){st.cur++;save();say('');askEl.dataset.r='';render();};$$('.ok-row',root).pop().appendChild(nx);}}
    else if(nx)nx.remove();}
  // tap a part; drag across several (pointer events)
  var paint=null;
  function hitAt(e){var el=document.elementFromPoint(e.clientX,e.clientY);return el&&svg.contains(el)&&el.classList.contains('ok-part')?el:null;}
  svg.style.touchAction='none';
  svg.addEventListener('pointerdown',function(e){var el=hitAt(e);if(!el)return;var k=+el.dataset.k,i=st.cur;paint={id:e.pointerId,v:!st.on[i][k],last:k};try{svg.setPointerCapture(e.pointerId);}catch(x){}e.preventDefault();setOn(i,k,paint.v);});
  svg.addEventListener('pointermove',function(e){if(!paint||paint.id!==e.pointerId)return;var el=hitAt(e);if(!el)return;var k=+el.dataset.k;if(k===paint.last)return;paint.last=k;setOn(st.cur,k,paint.v);});
  function end(e){if(paint&&paint.id===e.pointerId)paint=null;}
  svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  svg.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var el=e.target;if(!el.dataset||el.dataset.k==null)return;e.preventDefault();setOn(st.cur,+el.dataset.k,!st.on[st.cur][+el.dataset.k]);});
  if(rounds.length>1)$$('.ok-rounds button',root).forEach(function(b){b.onclick=function(){st.cur=+b.dataset.i;save();say('');askEl.dataset.r='';render();};});
  $('.ok-reset',root).onclick=function(){var i=st.cur,r=R();st.w[i]=r.mode==='group'?(r.startWholes||0):0;st.pile[i]=r.total||0;st.cut[i]=0;st.on[i]=[];st.ask[i]=0;st.raw[i]=false;st.grp[i]=0;st.won[i]=false;st.a[i]={};save();say('');askEl.dataset.r='';render();};
  render();
  return {state:st};
}
K.splitter=splitter;K.ribbon=ribbon;K.clock=clock;K.pour=pour;K.scale=scale;K.unitMat=unitMat;K.tradeMat=tradeMat;K.stamps=stamps;K.barModel=barModel;K.numberBond=numberBond;K.mentalMath=mentalMath;K.challenge=challenge;
})(OAOKit);

/* ═══ OAO MATH KIT, part 3 · Area Grid (Nov 2026, Unit 11) ═══
   Square tiles on a grid, the way Dimensions draws area: a plain panel outline, side lengths on dimension lines OUTSIDE the
   shape (← 1 ft 6 in →), unit tiles that students lay with their own hand (tap a square, or drag across squares).
   It looks like the library's Color Tiles: white grid squares, plain yellow tiles (#F2B705). The tile count never shows
   rows × columns for the student; they do that part.
   cfg = { key, unit:{s:'in',one:'inch',many:'inches'}, cols, rows, rect:{x,y,w,h} (in squares), dimW, dimH (labels; '?' allowed),
           split:{at, labels:['1 ft','6 in']}, mode:'cover'|'edge'|'free', showCount:true, todo:'one line of directions',
           check:(shape)=>({ok, text}) (free mode; shape = {n, w, h, rect}), record:true + need:n (free mode: collect different rectangles),
           ask:[{q, unit, answer, accept:[…], mistakes:[{v, text}], hint}], goalText, doneText, onGoal(root), onDone(root) } */
(function(K){
'use strict';
var snd=K._snd,ls=K._ls,lsSet=K._lsSet,fmt=K.fmt;
var NS='http://www.w3.org/2000/svg',TILE='#F2B705',TILE_D='#B98A00',LINE='#D9DEEA',NAVY='#0E1C42';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function num(v){var t=String(v==null?'':v).replace(/[,\s]/g,'');return t===''||isNaN(+t)?null:+t;}
function S(tag,a,p){var e=document.createElementNS(NS,tag);for(var k in a){if(k==='text')e.textContent=a[k];else e.setAttribute(k,a[k]);}if(p)p.appendChild(e);return e;}
function areaGrid(root,cfg){
  var U=cfg.unit||{s:'',one:'unit',many:'units'},C=cfg.cols,Rw=cfg.rows,rect=cfg.rect||{x:0,y:0,w:C,h:Rw},mode=cfg.mode||'cover';
  var st=ls(cfg.key,null)||{t:{},a:{},ok:{},found:[],goal:false,done:false};st.t=st.t||{};st.a=st.a||{};st.ok=st.ok||{};st.found=st.found||[];
  var cur={x:rect.x,y:rect.y},asks=cfg.ask||[];
  root.classList.add('ok-tool','ag');
  root.innerHTML=(cfg.todo?'<p class="ok-do">'+cfg.todo+'</p>':'')+'<div class="ag-wrap"><svg class="ag-svg" tabindex="0" role="application" aria-label="Grid of 1-'+esc(U.one)+' squares. Tap a square to lay a tile, or drag across squares. Arrow keys move, Space lays or lifts a tile."></svg></div>'+
    '<div class="ok-sym ag-sym" aria-live="polite"></div>'+(cfg.record?'<div class="ag-found"></div>':'')+
    (asks.length?'<div class="ag-asks">'+asks.map(function(q,i){return '<form class="ag-ask" data-i="'+i+'"><label>'+q.q+' <input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(String(q.q).replace(/<[^>]+>/g,''))+'" value="'+esc(st.a[i]||'')+'"> <span class="ag-u">'+esc(q.unit||'')+'</span></label> <button class="ok-btn" type="submit">Check</button><span class="ag-fb" aria-live="polite"></span></form>';}).join('')+'</div>':'')+
    '<div class="ok-msg" aria-live="polite"></div><div class="ok-row"><button class="ok-btn ok-reset" type="button">↺ Clear the tiles</button></div>';
  var svg=root.querySelector('.ag-svg'),msg=root.querySelector('.ok-msg'),sym=root.querySelector('.ag-sym');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t||'';}
  function save(){lsSet(cfg.key,st);}
  function inRect(x,y){return x>=rect.x&&x<rect.x+rect.w&&y>=rect.y&&y<rect.y+rect.h;}
  function count(){return Object.keys(st.t).length;}
  function shape(){var ks=Object.keys(st.t);if(!ks.length)return {n:0,w:0,h:0,rect:false};var xs=ks.map(function(k){return +k.split('_')[0];}),ys=ks.map(function(k){return +k.split('_')[1];});
    var w=Math.max.apply(0,xs)-Math.min.apply(0,xs)+1,h=Math.max.apply(0,ys)-Math.min.apply(0,ys)+1;return {n:ks.length,w:w,h:h,rect:w*h===ks.length};}
  function goalMet(){var x,y;
    if(mode==='cover'){for(y=rect.y;y<rect.y+rect.h;y++)for(x=rect.x;x<rect.x+rect.w;x++)if(!st.t[x+'_'+y])return false;return true;}
    if(mode==='edge'){for(x=rect.x;x<rect.x+rect.w;x++)if(!st.t[x+'_'+rect.y])return false;for(y=rect.y;y<rect.y+rect.h;y++)if(!st.t[rect.x+'_'+y])return false;return true;}
    if(cfg.record)return st.found.length>=(cfg.need||1);
    var r=cfg.check?cfg.check(shape()):{ok:false};return !!r.ok;}
  function set(x,y,on){if(x<0||y<0||x>=C||y>=Rw)return false;var k=x+'_'+y;
    if(on&&mode!=='free'&&!inRect(x,y)){say(cfg.offText||'Keep the tiles on the panel, inside the dark outline.','hint');return false;}
    if(on===!!st.t[k])return false;if(on)st.t[k]=1;else delete st.t[k];return true;}
  function after(){save();render();var was=st.goal;
    if(mode==='free'){var sh=shape();if(cfg.record&&sh.rect&&sh.n===cfg.n){var id=Math.min(sh.w,sh.h)+'x'+Math.max(sh.w,sh.h);
        if(st.found.indexOf(id)<0){st.found.push(id);snd.done();say('A new rectangle: <b>'+sh.w+' by '+sh.h+'</b>. It uses '+sh.n+' tiles. '+(st.found.length<(cfg.need||1)?'Clear the tiles and build a different one.':''),'good');save();renderFound();}
        else say('You already found '+sh.w+' by '+sh.h+'. Turning it sideways makes the same rectangle. Try different side lengths.','hint');}
      else if(cfg.check&&!cfg.record){var r=cfg.check(sh);if(r&&r.text)say(r.text,r.ok?'good':'hint');}}
    if(!was&&goalMet()){st.goal=true;save();snd.done();if(cfg.goalText)say(cfg.goalText,'good');if(cfg.onGoal)cfg.onGoal(root);}
    finish();}
  function finish(){if(st.done)return;var allAsk=asks.every(function(q,i){return st.ok[i];});
    if((st.goal||cfg.askOnly)&&allAsk){st.done=true;save();if(cfg.doneText)say(cfg.doneText,'good');if(cfg.onDone)cfg.onDone(root);}}
  function renderFound(){var f=root.querySelector('.ag-found');if(!f)return;f.innerHTML='<b>Rectangles found ('+st.found.length+(cfg.need?' of '+cfg.need:'')+'):</b> '+
    (st.found.length?st.found.map(function(id){var p=id.split('x');return '<span class="ag-chip">'+p[0]+' '+U.s+' by '+p[1]+' '+U.s+'</span>';}).join(' '):'none yet');}
  var z=28,ML=58,MT=34,MB=cfg.split?30:12,MR=64;
  function render(){
    var avail=Math.max(260,(root.clientWidth||640)-8);z=Math.max(12,Math.min(cfg.cell||30,Math.floor((avail-ML-MR)/C)));
    var Wd=ML+C*z+MR,Ht=MT+Rw*z+MB;svg.setAttribute('viewBox','0 0 '+Wd+' '+Ht);svg.setAttribute('width',Wd);svg.style.maxWidth='100%';
    while(svg.firstChild)svg.removeChild(svg.firstChild);
    S('defs',{},svg).innerHTML='<marker id="agA'+cfg.key+'" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="'+NAVY+'"/></marker>';
    var x,y;for(y=0;y<Rw;y++)for(x=0;x<C;x++){var on=inRect(x,y)||mode==='free';
      S('rect',{x:ML+x*z,y:MT+y*z,width:z,height:z,fill:on?'#fff':'#F1F2F5',stroke:LINE,'stroke-width':1.2,'data-c':x+'_'+y},svg);
      if(st.t[x+'_'+y])S('rect',{x:ML+x*z+2,y:MT+y*z+2,width:z-4,height:z-4,rx:Math.max(2,z/7),fill:TILE,stroke:TILE_D,'stroke-width':1.2,'data-c':x+'_'+y},svg);}
    if(mode!=='free'){var rx=ML+rect.x*z,ry=MT+rect.y*z,rw=rect.w*z,rh=rect.h*z,mk='url(#agA'+cfg.key+')';
      S('rect',{x:rx,y:ry,width:rw,height:rh,fill:'none',stroke:NAVY,'stroke-width':3,style:'pointer-events:none'},svg);
      S('line',{x1:rx,y1:ry-16,x2:rx+rw,y2:ry-16,stroke:NAVY,'stroke-width':1.6,'marker-start':mk,'marker-end':mk},svg);
      var lw=cfg.dimW||rect.w+' '+U.s;S('rect',{x:rx+rw/2-(lw.length*4+8),y:ry-26,width:lw.length*8+16,height:20,rx:4,fill:'#fff'},svg);
      S('text',{x:rx+rw/2,y:ry-11,'text-anchor':'middle','font-size':15,'font-weight':800,fill:NAVY,'font-family':'Nunito,Arial,sans-serif',text:lw},svg);
      S('line',{x1:rx+rw+16,y1:ry,x2:rx+rw+16,y2:ry+rh,stroke:NAVY,'stroke-width':1.6,'marker-start':mk,'marker-end':mk},svg);
      var lh=cfg.dimH||rect.h+' '+U.s;S('text',{x:rx+rw+24,y:ry+rh/2+5,'font-size':15,'font-weight':800,fill:NAVY,'font-family':'Nunito,Arial,sans-serif',text:lh},svg);
      if(cfg.split){var sx=rx+cfg.split.at*z;S('line',{x1:sx,y1:ry-4,x2:sx,y2:ry+rh+4,stroke:'#9E4552','stroke-width':2.5,'stroke-dasharray':'5 4',style:'pointer-events:none'},svg);
        cfg.split.labels.forEach(function(lb,i){var a=i?sx:rx,b=i?rx+rw:sx;S('line',{x1:a,y1:ry+rh+12,x2:b,y2:ry+rh+12,stroke:'#9E4552','stroke-width':1.4,'marker-start':mk,'marker-end':mk},svg);
          S('text',{x:(a+b)/2,y:ry+rh+27,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#9E4552','font-family':'Nunito,Arial,sans-serif',text:lb},svg);});}}
    if(document.activeElement===svg)S('rect',{x:ML+cur.x*z+1,y:MT+cur.y*z+1,width:z-2,height:z-2,fill:'none',stroke:'#2F6FDE','stroke-width':3,style:'pointer-events:none'},svg);
    var n=count();sym.innerHTML=cfg.sym?cfg.sym(n,shape(),st):(cfg.showCount===false?'':'Tiles laid: <b>'+n+'</b>'+(n?' · each tile is 1 square '+esc(U.one):''));
  }
  function cellOf(e){var t=document.elementFromPoint(e.clientX,e.clientY);t=t&&t.closest&&t.closest('[data-c]');if(!t||!svg.contains(t))return null;var p=t.getAttribute('data-c').split('_');return {x:+p[0],y:+p[1]};}
  var paint=null,changed=false,last=null;
  svg.addEventListener('pointerdown',function(e){var c=cellOf(e);if(!c)return;e.preventDefault();try{svg.setPointerCapture(e.pointerId);}catch(x){}
    paint=!st.t[c.x+'_'+c.y];last=c;changed=set(c.x,c.y,paint)||changed;if(changed){snd.click();render();}});
  /* a fast swipe skips squares between two pointer events: fill every square on the line from the last one */
  svg.addEventListener('pointermove',function(e){if(paint===null)return;var c=cellOf(e);if(!c||!last||(c.x===last.x&&c.y===last.y))return;
    var n=Math.max(Math.abs(c.x-last.x),Math.abs(c.y-last.y)),any=false;
    for(var k=1;k<=n;k++){var x=Math.round(last.x+(c.x-last.x)*k/n),y=Math.round(last.y+(c.y-last.y)*k/n);if(set(x,y,paint))any=true;}
    last=c;if(any){changed=true;render();}});
  function up(){if(paint===null)return;paint=null;last=null;if(changed){changed=false;after();}}
  svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
  svg.addEventListener('keydown',function(e){var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(d){e.preventDefault();cur.x=Math.max(0,Math.min(C-1,cur.x+d[0]));cur.y=Math.max(0,Math.min(Rw-1,cur.y+d[1]));render();return;}
    if(e.key===' '||e.key==='Enter'){e.preventDefault();if(set(cur.x,cur.y,!st.t[cur.x+'_'+cur.y])){snd.click();after();}}});
  svg.addEventListener('focus',render);svg.addEventListener('blur',render);
  root.querySelector('.ok-reset').onclick=function(){st.t={};save();render();say('');};
  [].forEach.call(root.querySelectorAll('.ag-ask'),function(f){var i=+f.dataset.i,q=asks[i],inp=f.querySelector('input'),fb=f.querySelector('.ag-fb');
    function mark(){f.classList.add('ok');inp.disabled=true;fb.textContent='✓';}
    if(st.ok[i])mark();
    f.onsubmit=function(e){e.preventDefault();var v=num(inp.value);st.a[i]=inp.value;save();
      if(v==null){fb.textContent='';say('Type a number.','hint');return;}
      if([q.answer].concat(q.accept||[]).some(function(a){return num(a)===v;})){st.ok[i]=true;save();mark();snd.done();say(q.right||'','good');if(q.onRight)q.onRight(root);finish();return;}
      var m=(q.mistakes||[]).filter(function(x){return [].concat(x.v).some(function(a){return num(a)===v;});})[0];snd.no();fb.textContent='✗';
      say(m?m.text:(q.hint||'Not yet. Check your work and try again.'),'hint');};});
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(render,120);});
  render();renderFound();if(st.done&&cfg.doneText)say(cfg.doneText,'good');
  return {state:st,count:count,shape:shape};
}
K.areaGrid=areaGrid;
})(OAOKit);
