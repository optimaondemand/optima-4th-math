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
var DROP='.ok-col,.ok-zone,.ok-bar,.ok-tray,.ok-barrow';
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
      var ticks='';if(r.ticks){for(var t=r.ticks.every;t<max;t+=r.ticks.every){var maj=r.ticks.major&&t%r.ticks.major===0;ticks+='<i style="left:'+(t/max*100)+'%;height:'+(maj?'45%':'22%')+'"></i>';}}
      var pieces=st.fill[i].map(function(v,k){var w=v/max*100;var lab=(r.pieceLabel?r.pieceLabel(v):fmt(v)+' '+r.unit);return '<span class="ok-piece'+(k%2?' alt':'')+(anim.pop===i&&k===st.fill[i].length-1?' ok-in':'')+'" data-c="'+colorOf(v,r.base)+'" style="width:'+w+'%" title="'+lab+'">'+(w/100*bw>=46?lab:'')+'</span>';}).join('');
      var targetMark=r.max&&r.max!==r.target?'<i style="position:absolute;top:-3px;bottom:-3px;left:'+(r.target/max*100)+'%;width:0;border-left:3px dashed #2B3040"></i>':'';
      row.innerHTML='<div class="ok-barlab"><span>'+r.label+'</span><span class="val">'+fmt(s)+' '+r.unit+(r.target!==s?' <span style="color:#8A90A6;font-size:14px">of '+fmt(r.target)+' '+r.unit+'</span>':' ✓')+'</span></div>'+
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
      askEl.innerHTML='<p class="bm-qtext">'+esc(cfg.question)+'</p><form class="bm-form"><input type="text" inputmode="numeric" autocomplete="off" aria-label="Your answer" value="'+esc(st.ans||'')+'">'+(cfg.unit?'<span class="bm-u">'+esc(cfg.unit)+'</span>':'')+'<button type="submit" class="ok-btn">Check</button></form>'+(st.answered?'<div class="ok-sym"><span class="big">'+esc(cfg.sym||'')+'</span></div>':'');
      var f=$('form',askEl),inp=$('input',f);
      f.onsubmit=function(e){e.preventDefault();var v=num(inp.value);st.ans=inp.value;save();
        if(v==null){say('Type a number first.','hint');return;}
        var ok=[cfg.answer].concat(cfg.accept||[]).some(function(a){return num(a)===v;});
        if(ok){st.answered=true;save();snd.done();say(cfg.doneText||'Yes! The bar model shows it.','good');render();if(cfg.onDone&&!st.fired){st.fired=1;save();cfg.onDone(m);}return;}
        var mk=(cfg.mistakes||[]).filter(function(z){return num(z.value)===v;})[0];snd.no();say(mk?mk.text:(cfg.hint||'Look at the bar again. Is the ? the whole bar or one part?'),'hint');};
      if(st.answered)inp.disabled=true;
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
      return '<form class="mm-p" data-i="'+i+'"><label for="'+id+'">'+esc(p.q)+' ='+(p.lead?' '+esc(p.lead):'')+'</label><input id="'+id+'" type="text" inputmode="numeric" autocomplete="off" value="'+esc(st.a[i]||'')+'">'+(p.post?'<span class="mm-post">'+esc(p.post)+'</span>':'')+'<button type="submit" class="ok-btn">Check</button><span class="mm-fb" aria-live="polite"></span></form>';}).join('')+'</div>';
  $$('.mm-p',m).forEach(function(f){var i=+f.dataset.i,ins=$$('input',f),fb=$('.mm-fb',f),p=P[i];
    function mark(){f.classList.add('ok');ins.forEach(function(x){x.disabled=true;});fb.textContent='✓';}
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
K.unitMat=unitMat;K.stamps=stamps;K.barModel=barModel;K.numberBond=numberBond;K.mentalMath=mentalMath;K.challenge=challenge;
})(OAOKit);
