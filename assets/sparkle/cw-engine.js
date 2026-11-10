/* ═══ CLASSICAL GUIDE · window engine ═══
   A cinematic window into the guide's workshop. Students watch, read along, pick replies and touch objects.
   Reads window.CW_DATA (the lesson's own file). Mounts every <div class="cw-slot" data-win="id"> on the page.

   CW_DATA = { key, room:'workshop', place:{t1,t2,t3},
     windows:{ id:{ title, people:['leo'], objects:[obj], spots:[spot], script:[step], end:{task, go:{tab, sel, label}} } } }
   obj  = { id, kind:'panel'|'note'|'stack'|'mirror', x, y, w, h, name, dims:{w:'1 ft 6 in', h:'2 in'}, split:{at:48, labels:['1 ft','6 in']} }   (canvas px, to scale)
   spot = { id, x, y, w, h, lines:[…], card:'html' }      (clickable things during an explore step)
   step = { w:'leo', t:'…', wonder:'…' } · { narr:'…' } · { enter:'bern' } · { leave:'bern' } · { focus:['strip'] | null }
          { tags:['strip:name','strip:w','strip:h'], on:true|false } · { split:'strip' } · { card:'html' | null }
          { explore:{need:2} } · { prompt:'…', choice:[{say, id, then:[steps]}], save:'predict' } · { pause:ms }
   Rules (Bethany, Nov 2026): every directive is written in a gold box; what students look at is lit, outlined and labeled;
   the window never does the math for students; dialogue is short and at a 4th-grade level. */
var CW = (function(){
'use strict';
var D, A=window.CWART, W=320, H=180, reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function ls(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function R(g,c,x,y,w,h){g.fillStyle=c;g.fillRect(x|0,y|0,w|0,h|0);}
var POS={leo:{x:256,y:116},salai:{x:188,y:128},bern:{x:296,y:120},atlas:{x:62,y:131},felix:{x:92,y:131},hazel:{x:170,y:131},cora:{x:200,y:131}};
function fnv(str){var h=0x811c9dc5;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return ('0000000'+h.toString(16)).slice(-8);}
function doneKey(){return (D.key||'cw')+'-cw-done';}

function Win(slot,id,def){
  var self=this;this.id=id;this.def=def;this.slot=slot;slot._win=this;this.guideIn=false;
  slot.innerHTML='<div class="cw" tabindex="-1"><div class="cw-stage"><div class="cw-cam"><canvas width="320" height="180" role="img" aria-label="'+esc(def.alt||def.title||'The workshop')+'"></canvas><div class="cw-tags"></div></div>'+
    '<div class="cw-vig"></div><div class="cw-bar top"></div><div class="cw-bar bot"></div><div class="cw-card"></div>'+
    '<div class="cw-title"><div class="t1"></div><div class="t2"></div><div class="t3"></div></div>'+
    '<div class="cw-cover"><button type="button" class="cw-play">▶ <span></span></button></div>'+
    '<div class="cw-tools"><button type="button" class="cw-again" hidden>↺ Start over</button></div></div>'+
    '<div class="cw-dlg"><canvas class="cw-portrait" width="24" height="24" aria-hidden="true"></canvas><div class="cw-box"><div class="cw-name"></div><div class="cw-text" aria-live="polite"></div>'+
    '<div class="cw-wonder"><span class="dots"><span></span><span></span><span></span></span><span class="wt"></span></div><div class="cw-replies"></div><div class="cw-next">▼ Tap to go on</div></div>'+
    '<div class="cw-task"></div></div></div>';
  var q=function(s){return slot.querySelector(s);};
  this.el=q('.cw');this.cv=q('canvas');this.g=this.cv.getContext('2d');this.g.imageSmoothingEnabled=false;this.cam=q('.cw-cam');
  this.dlg=q('.cw-dlg');this.tx=q('.cw-text');this.nm=q('.cw-name');this.nx=q('.cw-next');this.rp=q('.cw-replies');this.wd=q('.cw-wonder');this.wdt=q('.wt');
  this.por=q('.cw-portrait');this.card=q('.cw-card');this.tagsEl=q('.cw-tags');this.task=q('.cw-task');this.titleEl=q('.cw-title');this.cover=q('.cw-cover');this.again=q('.cw-again');
  q('.cw-play span').textContent=def.play||'Step into the workshop';
  q('.t1').textContent=(D.place&&D.place.t1)||'';q('.t2').textContent=def.title||'';q('.t3').textContent=def.sub||'';
  this.objs={};(def.objects||[]).forEach(function(o){self.objs[o.id]=o;});
  this.buildTags();
  this.reset();
  var done=ls(doneKey(),{})[id];
  q('.cw-play').onclick=function(){self.start();};
  this.again.onclick=function(e){e.stopPropagation();self.start();};
  q('.cw-stage').addEventListener('click',function(e){if(e.target.closest('.cw-tools,.cw-cover'))return;if(self.exploring){self.hit(e);return;}self.advance();});
  this.dlg.addEventListener('click',function(e){if(e.target.closest('button'))return;self.advance();});
  this.el.addEventListener('keydown',function(e){if((e.key===' '||e.key==='Enter')&&!(e.target.closest&&e.target.closest('button'))){e.preventDefault();self.advance();}});
  this.cv.addEventListener('mousemove',function(e){if(!self.exploring){self.cv.style.cursor='';return;}var p=self.xy(e),sp=self.spotAt(p);self.cv.style.cursor=sp&&!self.visited[sp.id]?'pointer':'';});
  if(done){this.showEnd(true);this.cover.querySelector('span').textContent='Watch again';}
  if(window.IntersectionObserver){new IntersectionObserver(function(es){es.forEach(function(e){self.vis=e.isIntersecting&&!!self.slot.offsetParent;});}).observe(slot);}   /* only draw what's on screen (audit) */
  this.draw();Win.all.push(this);
}
Win.all=[];
var P=Win.prototype;
/* the page's guide (CW_DATA.guide) is not in the window until the student presses play: then he walks in from the
   side, and he leaves again when he goes back to his lift (Bethany, 3 Nov 2026: never two of him at once) */
function guideWho(){return D.guide?(D.guide.who||'leo'):null;}
P.reset=function(){if(this.audio)try{this.audio.pause();}catch(e){}this.people={};var self=this,gw=guideWho();(this.def.people||['leo']).forEach(function(w){if(w===gw&&!self.guideIn)return;self.people[w]={x:POS[w].x,to:POS[w].x};});
  this.focus=null;this.dim=0;this.dimT=0;this.shown={};this.splitOn={};this.visited={};this.exploring=false;this.speaker=null;this.talk=0;this.typing=null;this.waitFn=null;this.lock=false;
  this.camTo();this.card.classList.remove('on');this.task.classList.remove('on');this.task.innerHTML='';this.rp.innerHTML='';this.dlg.classList.remove('on','tasking');this.paintTags();};
P.guideEnter=function(){var gw=guideWho();if(!gw||this.guideIn||(this.def.people||['leo']).indexOf(gw)<0)return;
  var self=this;this.wanted=true;var walk=function(){self.guideIn=true;self.people[gw]={x:reduce?POS[gw].x:336,to:POS[gw].x};if(!reduce)self.door=40;self.draw();};
  if(window.CWGUIDE&&CWGUIDE.enterWindow)CWGUIDE.enterWindow(this.slot,walk);else walk();};
P.guideBack=function(){var gw=guideWho();if(!gw||this.guideIn||!this.wanted)return;this.guideIn=true;this.people[gw]={x:POS[gw].x,to:POS[gw].x};this.draw();};  /* scrolled back to a window he was in */
P.guideLeave=function(){if(this.audio)try{this.audio.pause();}catch(e){}var gw=guideWho();if(!gw||!this.guideIn)return;this.guideIn=false;delete this.people[gw];this.draw();};
P.start=function(){var self=this;this.guideIn=false;this.reset();this.unlock();this.guideEnter();this.running=true;this.cover.hidden=true;this.again.hidden=false;this.el.classList.add('playing');
  this.el.classList.remove('cine');this.titleEl.classList.add('on');try{this.el.focus({preventScroll:true});}catch(e){}
  setTimeout(function(){self.el.classList.add('cine');},200);
  setTimeout(function(){self.titleEl.classList.remove('on');},reduce?900:2400);
  setTimeout(function(){self.run(self.def.script,function(){self.finish();});},reduce?1000:3000);
  if(!Win.loop){Win.loop=true;(function L(){Win.t=(Win.t||0)+1;var off=document.hidden||document.body.classList.contains('pq-clean');Win.all.forEach(function(w){if((w.running||w.exploring)&&w.vis!==false&&!off)w.draw();});requestAnimationFrame(L);})();}};
P.finish=function(){var d=ls(doneKey(),{});d[this.id]=1;lsSet(doneKey(),d);this.showEnd(false);if(window.CW_ONDONE)window.CW_ONDONE(this.id);};
P.showEnd=function(quiet){var e=this.def.end||{},self=this;this.dlg.classList.add('on','tasking');
  this.task.innerHTML='<span class="lead">'+(e.lead||'📜 Your job')+'</span>'+(e.task||'')+(e.go?'<div><button type="button" class="cw-go">'+esc(e.go.label||'Go on ↓')+'</button></div>':'');
  this.task.classList.add('on');var b=this.task.querySelector('.cw-go');
  if(b)b.onclick=function(ev){ev.stopPropagation();go(e.go);};
  if(quiet){this.cover.hidden=false;}else{this.running=true;if(b)try{b.focus({preventScroll:true});}catch(x){}}};
function go(g){if(g.tab&&window.switchTab){var a=document.querySelector('.tab-btn.active');if(!a||a.dataset.tab!==g.tab)window.switchTab(g.tab);}
  setTimeout(function(){var t=g.sel&&document.querySelector(g.sel);if(t&&window.CW_SHOWSTATION)window.CW_SHOWSTATION(t);if(t){t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});t.classList.add('cw-flash');setTimeout(function(){t.classList.remove('cw-flash');},1600);}},80);}

/* ───── drawing ───── */
P.draw=function(){var g=this.g,t=Win.t||0,self=this;
  g.drawImage(A.room(D.room||'workshop'),0,0);
  g.save();g.globalAlpha=.10;g.fillStyle='#fff1c4';g.beginPath();g.moveTo(24,40);g.lineTo(70,40);g.lineTo(168,176);g.lineTo(96,176);g.closePath();g.fill();g.restore();
  if(!this.motes){this.motes=[];for(var i=0;i<14;i++)this.motes.push({x:40+Math.random()*80,y:40+Math.random()*120,v:.04+Math.random()*.06,p:Math.random()*6});}
  if(!reduce)this.motes.forEach(function(m){m.y-=m.v;m.x+=Math.sin(t/60+m.p)*.05;if(m.y<36){m.y=170;m.x=50+Math.random()*80;}
    if(m.x>24+(m.y-40)*.6&&m.x<70+(m.y-40)*.72){g.globalAlpha=.5+.35*Math.sin(t/20+m.p);R(g,'#fff6d8',m.x,m.y,1,1);g.globalAlpha=1;}});
  var sway=reduce?0:Math.round(Math.sin(t/90)*1.2);R(g,'#2b2118',190+sway,10,1,8);R(g,'#2b2118',218+sway,10,1,8);g.drawImage(A.bench.wings,173+sway,14);
  g.drawImage(A.bench.notebook,174,101);g.drawImage(A.bench.ink,201,97);g.drawImage(A.bench.gold,224,104);
  R(g,'#efe3c6',215,100,4,10);R(g,'#d7c59d',218,100,1,10);R(g,'#5a3a22',213,109,8,2);
  var fl=reduce?0:Math.floor(t/6)%3;R(g,'#f2c94c',216,95+(fl===1?1:0),2,5-(fl===1?1:0));R(g,'#fff1a8',216,97,1,2);
  g.save();g.globalAlpha=.08+.02*fl;g.fillStyle='#ffd27a';g.beginPath();g.arc(217,98,22,0,6.283);g.fill();g.restore();
  // the lesson's math objects (plain, to scale)
  Object.keys(this.objs).forEach(function(k){var o=self.objs[k];if(o.hidden)return;
    if(o.kind==='note'){R(g,'#3f2716',o.x-1,o.y-1,o.w+2,o.h+2);R(g,'#fbf3dc',o.x,o.y,o.w,o.h);for(var r=0;r<3;r++)R(g,'#a8916a',o.x+2,o.y+3+r*3,o.w-4,1);return;}
    /* a stack of square floor tiles seen from the side (4.11.02): plain terracotta slabs, o.w = one tile's side, o.h = the stack */
    /* a plain mirror (4.11.03): glass with a frame line and one shine stroke, to scale like every object */
    if(o.kind==='mirror'){R(g,'#3f2716',o.x-1,o.y-1,o.w+2,o.h+2);R(g,'#8fa8c4',o.x,o.y,o.w,o.h);R(g,'#c4d5e8',o.x+1,o.y+1,o.w-2,o.h-2);
      for(var k=0;k<Math.min(o.w,o.h)/2;k++){R(g,'#f2f7fc',o.x+3+k,o.y+o.h-4-k,2,1);R(g,'#e1ebf5',o.x+7+k,o.y+o.h-4-k,1,1);}return;}
    if(o.kind==='stack'){for(var sy=o.y+o.h-3;sy>=o.y;sy-=3){R(g,'#7a3f22',o.x,sy,o.w,3);R(g,'#c4703f',o.x,sy,o.w,2);R(g,'#de8b55',o.x,sy,o.w,1);}return;}
    R(g,'#3f2716',o.x-1,o.y-1,o.w+2,o.h+2);R(g,'#8a5a32',o.x,o.y,o.w,o.h);R(g,'#fbf6ea',o.x+1,o.y+1,o.w-2,o.h-2);
    if(self.splitOn[k]&&o.split){for(var y=o.y;y<o.y+o.h;y+=2)R(g,'#9e4552',o.x+o.split.at,y,1,1);}});
  if(this.door>0){R(g,'#2b2118',291,56,24,78);this.door--;}
  // people
  Object.keys(this.people).forEach(function(w){var p=self.people[w];if(p.x!==p.to){p.x+=(p.to>p.x?.4:-.4);if(Math.abs(p.to-p.x)<.5)p.x=p.to;}
    var walking=p.x!==p.to,br=walking?Math.floor(t/8)%2:Math.floor((t+(w==='bern'?30:0))/75)%2,bl=(t+(w==='salai'?90:0))%260<8,tk=self.speaker===w&&self.talk?Math.floor(t/7)%2:0;
    var s=A.person(w,br,bl,tk);g.drawImage(s,Math.round(p.x-s.width/2),POS[w].y);});
  // glow on clickable things (explore)
  if(this.exploring){(this.def.spots||[]).forEach(function(s){var a=.55+.45*Math.sin(t/12),seen=self.visited[s.id];
    g.fillStyle=seen?'rgba(210,190,150,.7)':'rgba(255,214,90,'+a+')';
    g.fillRect(s.x,s.y,s.w,1);g.fillRect(s.x,s.y+s.h-1,s.w,1);g.fillRect(s.x,s.y,1,s.h);g.fillRect(s.x+s.w-1,s.y,1,s.h);
    if(!seen){g.fillRect(s.x+1,s.y+1,s.w-2,1);g.fillRect(s.x+1,s.y+s.h-2,s.w-2,1);g.fillRect(s.x+1,s.y+1,1,s.h-2);g.fillRect(s.x+s.w-2,s.y+1,1,s.h-2);
      var ax=s.x+s.w/2|0,ay=s.y-9+(reduce?0:Math.floor(t/12)%2);g.fillStyle='#2b2118';g.fillRect(ax-4,ay-1,9,6);g.fillStyle='#f2c94c';g.fillRect(ax-3,ay,7,1);g.fillRect(ax-2,ay+1,5,1);g.fillRect(ax-1,ay+2,3,1);g.fillRect(ax,ay+3,1,1);}});}
  // spotlight on what students should look at
  if(this.focus&&this.focus.length){g.save();g.fillStyle='rgba(20,10,0,.5)';g.beginPath();g.rect(0,0,W,H);
    this.focus.forEach(function(k){var o=self.objs[k];if(o)g.rect(o.x-1+o.w+2,o.y-1,-(o.w+2),o.h+2);});g.fill('evenodd');g.restore();
    var a2=.6+.4*Math.sin(t/12);g.fillStyle='rgba(255,214,90,'+a2+')';
    this.focus.forEach(function(k){var o=self.objs[k];if(!o)return;g.fillRect(o.x-3,o.y-3,o.w+6,2);g.fillRect(o.x-3,o.y+o.h+1,o.w+6,2);g.fillRect(o.x-3,o.y-1,2,o.h+2);g.fillRect(o.x+o.w+1,o.y-1,2,o.h+2);});}
  this.dim+=(this.dimT-this.dim)*.08;if(this.dim>.004){g.fillStyle='rgba(20,10,0,'+this.dim+')';g.fillRect(0,0,W,H);}
};
/* tags live inside the camera layer, so they stay on their objects when the view leans in or zooms (Bethany, Nov 2026)
   tags: name (navy), width (← a →, above), height (↕ b, right), split parts (above, each part) */
P.buildTags=function(){var self=this,h='';
  Object.keys(this.objs).forEach(function(k){var o=self.objs[k],cx=(o.x+o.w/2)/W*100,cy=(o.y+o.h/2)/H*100;
    if(o.name)h+='<div class="cw-tag name l" data-t="'+k+':name" style="left:'+((o.x-6)/W*100)+'%;top:'+cy+'%">'+esc(o.name)+'</div>';
    if(o.dims&&o.dims.w)h+='<div class="cw-tag" data-t="'+k+':w" style="left:'+cx+'%;top:'+((o.y-8)/H*100)+'%">← '+esc(o.dims.w)+' →</div>';
    if(o.dims&&o.dims.h)h+='<div class="cw-tag r" data-t="'+k+':h" style="left:'+((o.x+o.w+5)/W*100)+'%;top:'+cy+'%">↕ '+esc(o.dims.h)+'</div>';
    if(o.split)o.split.labels.forEach(function(lb,i){var x0=i?o.x+o.split.at:o.x,x1=i?o.x+o.w:o.x+o.split.at;
      h+='<div class="cw-tag part" data-t="'+k+':part'+i+'" style="left:'+((x0+x1)/2/W*100)+'%;top:'+((o.y+o.h+8)/H*100)+'%">← '+esc(lb)+' →</div>';});});
  this.tagsEl.innerHTML=h;};
P.paintTags=function(){var self=this;[].forEach.call(this.tagsEl.children,function(t){t.classList.toggle('on',!!self.shown[t.dataset.t]);});};
P.camTo=function(x,y,z){if(!x){this.cam.style.transform='none';return;}var m=(z-1)/2*100,tx=Math.max(-m,Math.min(m,(W/2-x)/W*100*z)),ty=Math.max(-m,Math.min(m,(H/2-y)/H*100*z));
  this.cam.style.transform='translate('+tx+'%,'+ty+'%) scale('+z+')';};

/* ───── dialogue ───── */
P.say=function(who,text,opts,done){opts=opts||{};var self=this,i=0;
  this.dlg.classList.add('on');this.dlg.classList.remove('tasking');this.task.classList.remove('on');this.rp.innerHTML='';this.wd.classList.remove('on');this.nx.classList.remove('on');
  this.nm.className='cw-name '+(who||'none');this.nm.textContent=who==='you'?'You':(A.names[who]||'');if(A.colors[who])this.nm.style.background=A.colors[who];else this.nm.style.background='';
  this.tx.className='cw-text'+(who?'':' narr');var face=!!A.names[who];this.por.classList.toggle('hide',!face);
  this.speaker=who;this.talk=1;if(face)A.portrait(this.por,who,0);this.tx.textContent='';clearInterval(this.typing);
  if(D.voice&&who&&who!=='you'){var vk=fnv(who+'|'+text);if(D.voice.clips[vk])this.play(vk);else if(this.audio)this.audio.pause();}   /* voiced lines (voice.py keys: FNV-1a of who|line) */
  var fin=function(){clearInterval(self.typing);self.typing=null;self.tx.textContent=text;self.talk=0;if(face)A.portrait(self.por,who,0);
    if(opts.wonder)self.wonder(opts.wonder,done);else if(opts.noNext)done&&done();else{self.nx.classList.add('on');self.waitFn=done;}};
  this.skip=fin;
  if(reduce){fin();return;}
  this.typing=setInterval(function(){i++;self.tx.textContent=text.slice(0,i);if(face&&i%3===0)A.portrait(self.por,who,(i/3)%2);if(i>=text.length)fin();},30);};
P.play=function(clip){try{var f=D.voice.clips[clip];if(!f)return;var a=this.audio||(this.audio=new Audio());a.pause();a.src=D.voice.dir.replace(/\/$/,'')+'/'+f;var pr=a.play();if(pr&&pr.catch)pr.catch(function(){});}catch(e){}};
/* iPad / Safari only lets an audio element play after a tap on it has played once. Lines often start on a timer (someone
   walks in, a reply), so the play press unlocks ONE element with a silent clip and every line reuses it (audit, 10 Nov 2026) */
P.unlock=function(){try{if(!D.voice||this._unl)return;this._unl=1;var a=this.audio||(this.audio=new Audio());a.src='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';var pr=a.play();if(pr&&pr.catch)pr.catch(function(){});}catch(e){}};
/* the Mr. Rogers pause: ask, lean in, wait; Continue only after a few quiet seconds */
P.wonder=function(prompt,done){var self=this;this.lock=true;this.wd.classList.add('on');this.wdt.textContent='Take a moment to wonder.';
  this.dimT=.18;var L=this.people.leo;this.camTo(L?L.x:160,128,1.12);
  setTimeout(function(){self.wdt.textContent=prompt;},reduce?300:2400);
  setTimeout(function(){self.lock=false;self.nx.classList.add('on');self.waitFn=function(){self.dimT=0;self.camTo();done&&done();};},reduce?1500:5200);};
P.advance=function(){if(!this.running)return;if(this.typing){this.skip();return;}if(this.lock)return;if(this.waitFn){var f=this.waitFn;this.waitFn=null;this.nx.classList.remove('on');f();}};
P.run=function(steps,done){var self=this,k=0;(function next(){if(!self.running)return;if(k>=steps.length){done&&done();return;}var s=steps[k++],clip=self.id+':'+(s.clip||'');
  if(s.enter){var p=self.people[s.enter]={x:330,to:POS[s.enter].x};self.door=40;setTimeout(next,reduce?100:1800);return;}
  if(s.leave){self.people[s.leave].to=340;setTimeout(function(){delete self.people[s.leave];next();},reduce?100:1600);return;}
  if('focus' in s){self.focus=s.focus;next();return;}
  if(s.tags){s.tags.forEach(function(t){self.shown[t]=s.on!==false;});self.paintTags();next();return;}
  if(s.split){self.splitOn[s.split]=true;next();return;}
  if('card' in s){if(s.card){self.card.innerHTML=s.card;self.card.classList.add('on');}else self.card.classList.remove('on');next();return;}
  if(s.pause){setTimeout(next,reduce?50:s.pause);return;}
  if(s.explore){self.explore(s.explore,next);return;}
  if(s.choice){self.choice(s,next);return;}
  self.say(s.w||null,s.t||s.narr,{wonder:s.wonder,clip:s.clip?clip:null},next);})();};
P.choice=function(s,done){var self=this;this.nx.classList.remove('on');this.rp.innerHTML='<div class="cw-ask"><span class="lead">👉 Your turn</span>'+(s.prompt||'Pick one.')+'</div>';
  s.choice.forEach(function(o,k){var b=document.createElement('button');b.type='button';b.className='cw-reply';b.textContent=o.say;
    b.onclick=function(ev){ev.stopPropagation();self.rp.innerHTML='';if(s.save)lsSet((D.key||'cw')+'-'+s.save,{i:k,id:o.id||String(k),say:o.say});   /* a prediction the page comes back to */self.say('you',o.say,{noNext:true},function(){setTimeout(function(){self.run(o.then||[],done);},800);});};self.rp.appendChild(b);});
  setTimeout(function(){var f=self.rp.querySelector('.cw-reply');if(f)try{f.focus({preventScroll:true});}catch(e){}},60);};
/* explore: click the glowing things; a written counter says how many are left */
P.xy=function(e){var r=this.cv.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};};
P.spotAt=function(p){return (this.def.spots||[]).filter(function(s){return p.x>=s.x&&p.x<=s.x+s.w&&p.y>=s.y&&p.y<=s.y+s.h;})[0];};
P.explore=function(cfg,done){var self=this;this.exNeed=cfg.need||2;this.exDone=done;this.exploring=true;this.exTask();
  // keyboard and screen-reader users get buttons for the same things
  var kb=document.createElement('div');kb.className='cw-kb';(this.def.spots||[]).forEach(function(s){var b=document.createElement('button');b.type='button';b.dataset.spot=s.id;b.textContent=s.label||s.id;b.onclick=function(ev){ev.stopPropagation();if(!self.visited[s.id])self.open(s);};kb.appendChild(b);});
  this.task.appendChild(kb);};
P.exTask=function(){var n=Object.keys(this.visited).length,need=this.exNeed,self=this;this.dlg.classList.add('on','tasking');this.task.classList.add('on');
  var kb=this.task.querySelector('.cw-kb');this.task.innerHTML='<span class="lead">👉 Your turn</span>'+(this.def.exploreText||'Click the things that glow gold to look up close.')+' <span class="prog">'+Math.min(n,need)+' of '+need+'</span>';
  if(n>=need){var b=document.createElement('button');b.type='button';b.className='cw-go ready';b.textContent='Go on ▶';setTimeout(function(){try{b.focus({preventScroll:true});}catch(x){}},60);
    b.onclick=function(ev){ev.stopPropagation();self.exploring=false;self.task.classList.remove('on');var f=self.exDone;self.exDone=null;f&&f();};
    var d=document.createElement('div');d.appendChild(b);if(n<(this.def.spots||[]).length)this.task.insertAdjacentHTML('beforeend',' You can look at one more, or go on.');this.task.appendChild(d);}
  if(kb)this.task.appendChild(kb);};
/* a seen spot stays seen: a second click never restarts it (pilot feedback, 10 Nov 2026: "it went back to the 1×1 square") */
P.hit=function(e){var s=this.spotAt(this.xy(e));if(s&&!this.visited[s.id])this.open(s);};
P.open=function(s){if(this.busy)return;var self=this;this.busy=true;this.visited[s.id]=1;var kbb=this.task.querySelector('.cw-kb [data-spot="'+s.id+'"]');if(kbb){kbb.classList.add('seen');kbb.disabled=true;kbb.textContent='✓ '+(s.label||s.id);}this.exploring=false;this.task.classList.remove('on');
  this.camTo(s.x+s.w/2,s.y+s.h/2,s.zoom||1.8);if(s.card){this.card.innerHTML=s.card;this.card.classList.add('on');}
  this.run(s.lines.map(function(l){return typeof l==='string'?{w:'leo',t:l}:l;}),function(){self.card.classList.remove('on');self.camTo();self.busy=false;self.exploring=true;self.exTask();});};

function init(data){D=data;if(!A){(window.PQ_FAILED=window.PQ_FAILED||[]).push('windows: no art');return;}
  [].forEach.call(document.querySelectorAll('.cw-slot[data-win]'),function(s){var id=s.dataset.win,def=(D.windows||{})[id];
    if(!def){(window.PQ_FAILED=window.PQ_FAILED||[]).push('window '+id+': not in CW_DATA');return;}
    try{s._cw=new Win(s,id,def);}catch(e){console.error(e);(window.PQ_FAILED=window.PQ_FAILED||[]).push('window '+id+': '+e.message);}});}
return {init:init,_wins:Win.all};
})();
