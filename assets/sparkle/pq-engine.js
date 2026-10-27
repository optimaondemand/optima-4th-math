/* ═══ OAO PIXEL QUEST · engine (lesson-agnostic). Lesson content lives in PQ_DATA. ═══ */
var PQ = (function(){
'use strict';
var A = PQART, TS = 16, VW = 15, VH = 10, BW = VW*TS, BH = VH*TS, SCALE = 3;
var D, MAP, W, H, ground, objs = [], ents = [], items = [], S, avatar, pSheet, sheets = {};
var live, cvs, ctx, buf, bx, hud, goalEl, dlgEl, nameEl, txtEl, faceEl, choiceEl, padEl, banEl, makerEl, srEl;
var curSlot = null, curQ = null, running = false, focused = false, t = 0, last = 0, raf = 0;
var held = [], path = [], pathTarget = null, bumpT = 0, fx = [];
var player = {x:4,y:3,px:64,py:48,dir:'down',moving:false,mt:0,fx:0,fy:0,frame:0,anim:0};

/* ───────── storage ───────── */
var store = {
  get:function(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},
  set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
};
function save(){store.set(D.key, S);}

/* ───────── sound (WebAudio, no files) ───────── */
var Snd = (function(){
  var ac=null, muted=store.get('oao.pq.mute',false);
  function ctx0(){if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(ac&&ac.state==='suspended')ac.resume();return ac;}
  function tone(f,d,type,vol,when){var a=ctx0();if(!a||muted)return;var o=a.createOscillator(),g=a.createGain();o.type=type||'square';o.frequency.value=f;
    var s=a.currentTime+(when||0);g.gain.setValueAtTime(vol||0.04,s);g.gain.exponentialRampToValueAtTime(0.0001,s+d);o.connect(g);g.connect(a.destination);o.start(s);o.stop(s+d+0.02);}
  return {
    blip:function(p){tone(p||520,0.035,'square',0.025);},
    bump:function(){tone(110,0.06,'square',0.03);},
    sel:function(){tone(880,0.05,'square',0.03);},
    good:function(){[660,880,1320].forEach(function(f,i){tone(f,0.12,'square',0.035,i*0.08);});},
    bad:function(){tone(300,0.12,'square',0.03);tone(220,0.18,'square',0.03,0.1);},
    item:function(){[523,659,784,1047].forEach(function(f,i){tone(f,0.13,'square',0.035,i*0.09);});tone(1047,0.35,'triangle',0.04,0.36);},
    clear:function(){[523,523,523,659,784,659,784,1047].forEach(function(f,i){tone(f,0.14,i<3?'square':'square',0.035,[0,.12,.24,.36,.6,.84,.96,1.2][i]);});tone(1047,0.5,'triangle',0.05,1.2);},
    poof:function(){var a=ctx0();if(!a||muted)return;for(var i=0;i<8;i++)tone(200-i*15,0.08,'sawtooth',0.02,i*0.04);},
    get muted(){return muted;}, toggle:function(){muted=!muted;store.set('oao.pq.mute',muted);return muted;}
  };
})();

/* ───────── kind names ───────── */
/* Names students can't use. Stored ROT13 so the list isn't readable in the page source.
   ANY: blocked anywhere in the name; WHOLE: blocked only as a whole word (so Cassidy, Dickens, Analise still work).
   Checked on the name with spaces/punctuation removed and repeated letters squashed ("f u u c k" → "fuck"). */
function r13(s){return s.replace(/[a-z]/g,function(c){return String.fromCharCode((c.charCodeAt(0)-97+13)%26+97);});}
var BAD_ANY=r13('shpx shx spx cuhpx fuvg fuvvg ovgpu ovngpu phag chffl cravf intvan obbo gvggl avtt avtn snttbg fyhg juber jnax gjng cbea frkl anmv uvgyre ergneq xvxr genaal wvmm onfgneq qbhpur nffubyr nefrubyr qhzonff wnpxnff ohggubyr qvyqb ubeal ahqr anxrq cvff cbbc gheq sneg fghcvq vqvbg qhzo ybfre htyl xvyy zheqre fhvpvqr ungr fuhghc penc qnza tbqqnz zbgures fxnax pbpxfhpx oybjwbo unaqwbo obare rerpgvba betnfz frzra fcrez grfgvp fpebghz pyvg erpghz jgs fgsh yznb bzst crqb zbyrfg greebevf jrrq pbpnvar incr pbpx qvpxurnq qvpxsnpr ohggsnpr ohggsneg').split(' '), BAD_WHOLE=r13('nff nefr qvpx gvg gvgf phz frk encr uryy ubr ubrf ub snt sntf qlxr fcvp puvax tbbx pbba jbc anmv ohgg ohggf crr qvr qrnq fhpx fhpxf tnl xxx ohz penc cbb chxr ones nahf ahg ahgf onyyf fperj zrgu qeht qehtf tha thaf obzo nany').split(' ');
function badName(n){var l=String(n||'').toLowerCase(),words=l.split(/[^a-z]+/).filter(Boolean),flat=words.join(''),sq=flat.replace(/(.)\1+/g,'$1');
  for(var i=0;i<BAD_ANY.length;i++){var b=BAD_ANY[i];if(flat.indexOf(b)>=0||sq.indexOf(b.replace(/(.)\1+/g,'$1'))>=0)return true;}
  var cands=words.concat([flat,sq]);for(var j=0;j<BAD_WHOLE.length;j++)if(cands.indexOf(BAD_WHOLE[j])>=0||words.map(function(w){return w.replace(/(.)\1+/g,'$1');}).indexOf(BAD_WHOLE[j].replace(/(.)\1+/g,'$1'))>=0)return true;
  return false;}
function nameProblem(n){n=(n||'').trim();if(!n)return 'Type a name first.';if(n.length>14)return 'Keep it to 14 letters or fewer.';
  if(!/^[A-Za-z][A-Za-z '\-]*$/.test(n))return 'Use letters only.';if(badName(n))return 'Pick a kind name for your explorer.';return '';}
function guessName(){var p=store.get('oao.ff.profile',null)||store.get('oao.profile',null);return p&&p.name&&!nameProblem(p.name)?p.name:'';}

/* ───────── world ───────── */
function tileAt(i,j){if(i<0||j<0||i>=W||j>=H)return 'T';return MAP[j][i];}
function objAt(i,j){for(var k=0;k<objs.length;k++){var o=objs[k];if(o.hidden&&o.hidden())continue;if(o.fp)for(var f=0;f<o.fp.length;f++)if(o.fp[f][0]===i&&o.fp[f][1]===j)return o;}return null;}
function entAt(i,j){for(var k=0;k<ents.length;k++){var e=ents[k];if(e.show&&!e.show(S))continue;if(e.x===i&&e.y===j)return e;}return null;}
function blocked(i,j){var c=tileAt(i,j);if(c==='T'||c==='='||c==='w')return true;var o=objAt(i,j);if(o&&o.solid!==false)return true;if(entAt(i,j))return true;return false;}
function buildWorld(){
  MAP=D.map.map(function(r){return (r+'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT').slice(0,D.map[0].length);});
  H=MAP.length;W=MAP[0].length;ground=A.groundCanvas(MAP,W,H,11);
  objs=[];var tk=0;
  for(var j=0;j<H;j++)for(var i=0;i<W;i++)if(MAP[j][i]==='T'){var spr=A.tree((i*3+j*5)%4===0);objs.push({spr:spr,dx:i*TS-2,dy:j*TS-12,base:j*TS+15,fp:[[i,j]]});tk++;}
  D.objects.forEach(function(o){objs.push(o.build(A));});
  ents=D.npcs.map(function(n){var e=Object.assign({},n);if(n.look)e.sheet=A.buildChar(n.look);if(n.owl)e.owlSheet=A.buildOwl();e.dir0=n.dir||'down';e.dir=e.dir0;return e;});
  items=D.items||[];
}
function posOf(id){var e=ents.filter(function(z){return z.id===id&&(!z.show||z.show(S));})[0];if(e)return {x:e.x*TS+8,y:e.y*TS+10,lab:(D.labels&&D.labels[id])||((D.speakers[id]||{}).name||'').replace(/^\w/,function(c){return c;})};
  var o=objs.filter(function(z){return z.id===id&&z.mx!=null;})[0];if(o)return {x:o.mx,y:o.my+14,lab:(D.labels&&D.labels[id])||id};return null;}
function guideTarget(){
  var Q=D.quests[curQ];var mk=Q.markers?Q.markers(S):[];var c=[];
  mk.forEach(function(m){var p=posOf(m.id);if(p)c.push(p);});
  items.forEach(function(it){if(it.show(S))c.push({x:it.x*TS+8,y:it.y*TS+8,lab:(D.labels&&D.labels.item)||'Sparkle'});});
  if(!c.length||dlg.open)return null;var px=player.px+8,py=player.py+8;
  c.sort(function(a,b){return (Math.abs(a.x-px)+Math.abs(a.y-py))-(Math.abs(b.x-px)+Math.abs(b.y-py));});
  var g=c[0];if(Math.abs(g.x-px)+Math.abs(g.y-py)<20)return null;return g;}
var arrowEl=null,arrowKey='';
function guideArrow(g,cx,cy){
  if(!arrowEl)return;if(!g){if(arrowKey){arrowEl.style.display='none';arrowKey='';}return;}
  var gx=g.x-cx,gy=g.y-cy;var on=gx>4&&gx<BW-4&&gy>4&&gy<BH-4;
  if(on){if(arrowKey){arrowEl.style.display='none';arrowKey='';}return;}
  var mx=BW/2,my=BH/2,dx=gx-mx,dy=gy-my,sc=Math.min((BW/2-16)/Math.abs(dx||1e-6),(BH/2-18)/Math.abs(dy||1e-6));
  var ax=mx+dx*sc,ay=my+dy*sc,ang=Math.atan2(dy,dx)*180/Math.PI;
  var k=Math.round(ax)+','+Math.round(ay)+','+Math.round(ang)+g.lab;if(k===arrowKey)return;arrowKey=k;
  arrowEl.style.display='flex';arrowEl.style.left=(ax/BW*100)+'%';arrowEl.style.top=(ay/BH*100)+'%';
  arrowEl.querySelector('.ar').style.transform='rotate('+ang+'deg)';arrowEl.querySelector('.lb').textContent=g.lab;
  arrowEl.classList.toggle('lft',ax>BW*0.6);
}
function charFrame(sheet,dir,frame){return {sx:frame*16,sy:A.DIRI[dir]*20};}

/* ───────── scene render ───────── */
function camFor(px,py){var cx=Math.round(px+8-BW/2),cy=Math.round(py+8-BH/2);cx=Math.max(0,Math.min(W*TS-BW,cx));cy=Math.max(0,Math.min(H*TS-BH,cy));return [cx,cy];}
function drawScene(x,cx,cy,tt,withPlayer){
  x.imageSmoothingEnabled=false;
  x.drawImage(ground,cx,cy,BW,BH,0,0,BW,BH);
  var i0=Math.floor(cx/TS),j0=Math.floor(cy/TS);
  for(var j=j0;j<=j0+VH;j++)for(var i=i0;i<=i0+VW;i++)if(tileAt(i,j)==='w')A.waterAnim(x,i*TS-cx,j*TS-cy,tt,i,j);
  var list=[];
  objs.forEach(function(o){if(o.hidden&&o.hidden())return;if(o.dx-cx>BW+40||o.dx-cx<-130||o.dy-cy>BH+40||o.dy-cy<-80)return;list.push({k:o.base,f:function(){if(o.spr)x.drawImage(o.spr,Math.round(o.dx-cx),Math.round(o.dy-cy));if(o.anim)o.anim(x,o.dx-cx,o.dy-cy,tt);}});});
  items.forEach(function(it){if(!it.show(S))return;list.push({k:it.y*TS+8,f:function(){var bob=Math.round(Math.sin(tt*4+it.x)*1.5);if(!it.spr)it.spr=A.item(it.kind);x.drawImage(it.spr,it.x*TS-cx,it.y*TS-cy-2+bob);A.sparkle(x,it.x*TS-cx+12,it.y*TS-cy+1+bob,tt+it.x,'#FFF7C2');}});});
  ents.forEach(function(e){if(e.show&&!e.show(S))return;list.push({k:e.y*TS+15+(e.fly?20:0),f:function(){drawEnt(x,e,cx,cy,tt);}});});
  if(withPlayer&&pSheet)list.push({k:player.py+15.5,f:function(){drawChar(x,pSheet,player.dir,player.moving?player.frame:0,player.px-cx,player.py-cy-4);}});
  var gt=withPlayer&&curQ?guideTarget():null;
  if(gt){var gx=gt.x-cx,gy=gt.y-cy;if(gx>-8&&gx<BW+8&&gy>-8&&gy<BH+8){var pr=Math.sin(tt*5)*0.5+0.5;x.globalAlpha=0.35+pr*0.35;A.ell(x,Math.round(gx),Math.round(gy+6),9+Math.round(pr*2),3+Math.round(pr),'#F5C518');x.globalAlpha=1;}}
  list.sort(function(a,b){return a.k-b.k;});list.forEach(function(d){d.f();});
  if(withPlayer&&curQ)guideArrow(gt,cx,cy);
  // markers
  var mk=curQ&&D.quests[curQ].markers?D.quests[curQ].markers(S):[];
  mk.forEach(function(m){var e=ents.filter(function(z){return z.id===m.id;})[0];var X,Y;if(e){X=e.x*TS+8-cx;Y=e.y*TS-cy-(e.fly?14:6);}else{var o=objs.filter(function(z){return z.id===m.id;})[0];if(!o)return;X=o.mx-cx;Y=o.my-cy;}A.bubble(x,X,Y,tt,m.k||'!');});
  fx.forEach(function(f){f.draw(x,cx,cy,tt);});
}
function drawChar(x,sheet,dir,frame,X,Y){A.ell(x,Math.round(X+8),Math.round(Y+19),5,1,'rgba(0,0,0,0.22)');x.drawImage(sheet,frame*16,A.DIRI[dir]*20,16,20,Math.round(X),Math.round(Y),16,20);}
function drawEnt(x,e,cx,cy,tt){
  var X=e.x*TS-cx,Y=e.y*TS-cy-4;
  if(e.owl){var blink=(Math.floor(tt*10)%37===0)?1:0;var hop=Math.round(Math.abs(Math.sin(tt*2.2))*1.2);A.ell(x,X+8,Y+19,5,1,'rgba(0,0,0,0.22)');x.drawImage(e.owlSheet,blink*16,0,16,20,X,Y-hop,16,20);return;}
  if(e.smudge){var oy=e.flyOff||0;x.globalAlpha=e.alpha==null?1:e.alpha;A.drawSmudge(x,X-4+(e.dxOff||0),Y-10+Math.round(Math.sin(tt*2)*2)-oy,tt,true);x.globalAlpha=1;return;}
  drawChar(x,e.sheet,e.dir,0,X,Y);
}

/* ───────── loop ───────── */
function loop(now){
  if(!running)return;raf=requestAnimationFrame(loop);
  var dt=Math.min(0.05,(now-last)/1000||0);last=now;t+=dt;
  update(dt);
  var c=camFor(player.px,player.py);bx.fillStyle='#000';bx.fillRect(0,0,BW,BH);drawScene(bx,c[0],c[1],t,true);
  ctx.imageSmoothingEnabled=false;ctx.drawImage(buf,0,0,BW*SCALE,BH*SCALE);
}
var SPEED=6.2;
var DV={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function update(dt){
  fx=fx.filter(function(f){return !f.update||f.update(dt)!==false;});
  ents.forEach(function(e){if(e.tick)e.tick(dt,e);});
  if(player.moving){
    player.mt+=dt*SPEED;player.anim+=dt*SPEED;
    player.frame=[1,0,3,0][Math.floor(player.anim*2)%4];
    var p=Math.min(1,player.mt);player.px=(player.fx+(player.x-player.fx)*p)*TS;player.py=(player.fy+(player.y-player.fy)*p)*TS;
    if(p>=1){player.moving=false;player.px=player.x*TS;player.py=player.y*TS;arrived();}
  }
  if(!player.moving&&!dlg.open&&!modalOpen()){
    var d=held.length?held[held.length-1]:null;
    if(!d&&path.length){var nx=path.shift();d=nx[0]>player.x?'right':nx[0]<player.x?'left':nx[1]>player.y?'down':'up';}
    if(d){tryMove(d);}else{player.frame=0;
      if(pathTarget&&!path.length){var tg=pathTarget;pathTarget=null;face(tg.x,tg.y);interact();}}
  }
  bumpT-=dt;
}
function face(i,j){if(i>player.x)player.dir='right';else if(i<player.x)player.dir='left';else if(j>player.y)player.dir='down';else player.dir='up';}
function tryMove(d){
  player.dir=d;var nx=player.x+DV[d][0],ny=player.y+DV[d][1];
  if(blocked(nx,ny)){path=[];if(bumpT<=0){Snd.bump();bumpT=0.35;}return;}
  player.fx=player.x;player.fy=player.y;player.x=nx;player.y=ny;player.mt=0;player.moving=true;
}
function arrived(){
  items.forEach(function(it){if(it.show(S)&&it.x===player.x&&it.y===player.y){it.take(api());}});
  if(curQ&&D.quests[curQ].onStep)D.quests[curQ].onStep(api(),player.x,player.y);
}
function interact(){
  if(dlg.open){advance();return;}
  var nx=player.x+DV[player.dir][0],ny=player.y+DV[player.dir][1];
  var e=entAt(nx,ny);
  if(e){if(!e.fixed&&!e.owl&&!e.smudge){e.dir=player.dir==='up'?'down':player.dir==='down'?'up':player.dir==='left'?'right':'left';}D.talk(e.id,api());return;}
  var o=objAt(nx,ny);if(o&&o.id){D.talk(o.id,api());return;}
}
/* tap-to-walk (BFS) */
function bfs(tx,ty,adjacent){
  var q=[[player.x,player.y]],seen={},prev={};seen[player.x+','+player.y]=1;
  while(q.length){var c=q.shift();
    if(adjacent?(Math.abs(c[0]-tx)+Math.abs(c[1]-ty)===1):(c[0]===tx&&c[1]===ty)){var out=[];var k=c[0]+','+c[1];while(prev[k]){out.unshift(k.split(',').map(Number));k=prev[k];}return out;}
    for(var d in DV){var n=[c[0]+DV[d][0],c[1]+DV[d][1]],nk=n[0]+','+n[1];if(seen[nk]||blocked(n[0],n[1]))continue;seen[nk]=1;prev[nk]=c[0]+','+c[1];q.push(n);if(q.length>3000)return null;}}
  return null;
}
function tapAt(ev){
  if(dlg.open){advance();return;}if(modalOpen())return;
  var r=cvs.getBoundingClientRect();var c=camFor(player.px,player.py);
  var tx=Math.floor(((ev.clientX-r.left)/r.width*BW+c[0])/TS),ty=Math.floor(((ev.clientY-r.top)/r.height*BH+c[1])/TS);
  var target=entAt(tx,ty)||(objAt(tx,ty)&&objAt(tx,ty).id?objAt(tx,ty):null);
  if(target){var p=(Math.abs(player.x-tx)+Math.abs(player.y-ty)===1)?[]:bfs(tx,ty,true);if(p){path=p;pathTarget={x:tx,y:ty};}}
  else if(!blocked(tx,ty)){var p2=bfs(tx,ty,false);if(p2){path=p2;pathTarget=null;}}
}

/* ───────── character voices ─────────
   PQ_DATA.voice = {dir:'assets/audio/lessons/10-01/', clips:{'<key>':'mo-1a2b3c4d.mp3'}} (built by tools/sparkle/voice/voice.py).
   key = FNV-1a hash of who + '|' + the line exactly as written in lesson.js ({name} included), so a reworded line simply goes quiet
   until it is re-voiced. Lines with no clip (or with the game muted) keep the typing blips. */
var Voice=(function(){var cur=null;
  function key(who,t){var h=0x811c9dc5,s=who+'|'+t;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return ('0000000'+h.toString(16)).slice(-8);}
  function stop(){if(cur){try{cur.pause();}catch(e){}cur=null;}}
  function play(who,t){stop();var V=D.voice;if(!V||!V.clips||Snd.muted||!t)return false;var f=V.clips[key(who,t)];if(!f)return false;
    try{cur=new Audio(V.dir+f);cur.volume=0.9;var pr=cur.play();if(pr&&pr.catch)pr.catch(function(){});}catch(e){return false;}return true;}
  return {play:play,stop:stop,key:key};})();

/* ───────── dialog ───────── */
var dlg={open:false,q:[],cur:null,n:0,typing:false,timer:0};
function modalOpen(){return padEl.classList.contains('on')||makerEl.classList.contains('on')||choiceEl.classList.contains('on');}
function say(lines,then){lines=lines.slice();if(then)lines.push({fn:then});dlg.q=dlg.q.concat(lines);if(!dlg.open&&!dlg.inFn)next();}
function fill(s){return s.replace(/\{name\}/g,avatar&&avatar.name||'Explorer');}
function next(){
  clearInterval(dlg.timer);choiceEl.classList.remove('on');
  var it=dlg.q.shift();
  if(!it){Voice.stop();dlg.open=false;dlgEl.classList.remove('on');return;}
  if(it.fn){dlg.inFn=true;try{it.fn(api());}finally{dlg.inFn=false;}if(padEl.classList.contains('on')||makerEl.classList.contains('on'))return;next();return;}
  dlg.open=true;dlg.cur=it;dlgEl.classList.add('on','typing');
  var sp=D.speakers[it.who]||D.speakers.sys;nameEl.textContent=it.who==='me'?(avatar&&avatar.name||'You'):sp.name;nameEl.style.setProperty('--nc',sp.color);
  nameEl.style.display=sp.name||it.who==='me'?'':'none';
  drawFace(it.who);
  var voiced=Voice.play(it.who,it.t);
  var s=fill(it.t);dlg.full=s;dlg.n=0;txtEl.textContent='';srEl.textContent=(nameEl.textContent?nameEl.textContent+': ':'')+s;
  logLine((nameEl.textContent?nameEl.textContent+': ':'')+s);
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){txtEl.textContent=s;endType();return;}
  dlg.typing=true;
  dlg.timer=setInterval(function(){dlg.n+=1;txtEl.textContent=s.slice(0,dlg.n);if(!voiced&&dlg.n%2===0&&s[dlg.n-1]!==' ')Snd.blip(sp.pitch);if(dlg.n>=s.length)endType();},26);
}
function endType(){clearInterval(dlg.timer);dlg.typing=false;txtEl.textContent=dlg.full;dlgEl.classList.remove('typing');
  var it=dlg.cur;
  if(it.choices){choiceEl.innerHTML='';it.choices.forEach(function(c,i){var b=document.createElement('button');b.type='button';b.textContent=c[0];if(i===0)b.className='sel';
    b.onclick=function(e){e.stopPropagation();Snd.sel();choiceEl.classList.remove('on');logLine('  → '+c[0]);var fnc=c[1];dlg.q=[];dlg.open=false;dlgEl.classList.remove('on');fnc(api());};choiceEl.appendChild(b);});
    choiceEl.classList.add('on');choiceEl.querySelector('button').focus({preventScroll:true});}
  if(it.pad){openPad(it.pad);}
}
function advance(){if(dlg.typing){endType();return;}if(dlg.cur&&(dlg.cur.choices||dlg.cur.pad))return;Snd.blip(700);next();}
function drawFace(who){
  var fc=faceEl.getContext('2d');fc.imageSmoothingEnabled=false;fc.clearRect(0,0,16,16);
  var sp=D.speakers[who]||{};faceEl.style.display=sp.noface?'none':'';fc.fillStyle='#F5D4BC';fc.fillRect(0,0,16,16);
  if(who==='me'&&pSheet){fc.drawImage(pSheet,0,0,16,16,0,1,16,16);return;}
  var e=ents.filter(function(z){return z.id===who;})[0];
  if(sp.icon){faceEl.style.display='';fc.fillStyle='#FFF3C4';fc.fillRect(0,0,16,16);fc.drawImage(A.item(sp.icon),0,0);return;}
  if(e&&e.sheet)fc.drawImage(e.sheet,0,0,16,16,0,1,16,16);
  else if(e&&e.owlSheet)fc.drawImage(e.owlSheet,0,2,16,16,0,0,16,16);
  else if(e&&e.smudge){fc.fillStyle='#E4E0EA';fc.fillRect(0,0,16,16);fc.save();fc.scale(0.62,0.62);A.drawSmudge(fc,1,-2,0,true);fc.restore();}
  else faceEl.style.display='none';
}
/* number pad */
var padCfg=null,padVal='';
function openPad(cfg){padCfg=cfg;padVal='';renderPad();padEl.classList.add('on');}
function renderPad(){padEl.querySelector('.pq-eq').innerHTML=padCfg.eq+' <span>'+(padVal?Number(padVal).toLocaleString('en-US'):'&nbsp;')+'</span> '+padCfg.unit;}
function padKey(k){if(!padCfg)return;Snd.blip(600);
  if(k==='⌫'){padVal=padVal.slice(0,-1);}else if(k==='OK'){if(!padVal)return;var v=Number(padVal);padEl.classList.remove('on');var c=padCfg;padCfg=null;logLine('  → '+v.toLocaleString('en-US')+' '+c.unit);dlg.open=false;dlgEl.classList.remove('on');dlg.q=[];c.check(v,api());return;}
  else if(padVal.length<6){padVal+=k;}renderPad();}

/* ───────── API given to lesson DATA ───────── */
function api(){return {
  S:S,save:save,say:say,snd:Snd,name:function(){return avatar&&avatar.name||'Explorer';},
  q:function(){return S.q[curQ]||(S.q[curQ]={});},
  goal:setGoal,complete:complete,banner:banner,fx:function(f){fx.push(f);},A:A,
  ent:function(id){return ents.filter(function(e){return e.id===id;})[0];},
  page:function(fn){try{fn(document);}catch(e){}},
  player:player,t:function(){return t;}
};}
function setGoal(html){goalEl.innerHTML='<small>★ QUEST</small>'+html;}
function banner(txt,sub,ms){banEl.innerHTML='<div>'+txt+(sub?'<small>'+sub+'</small>':'')+'</div>';banEl.classList.remove('on');void banEl.offsetWidth;banEl.classList.add('on');}

/* ───────── slots (one window per lesson section) ───────── */
function logLine(s){if(!curQ)return;S.logs=S.logs||{};var L=S.logs[curQ]=S.logs[curQ]||[];if(L[L.length-1]!==s)L.push(s);save();renderLog(curSlot);}
function renderLog(slot){if(!slot)return;var q=slot.dataset.quest,L=(S.logs||{})[q]||[];var ol=slot.querySelector('.pq-log ol');var det=slot.querySelector('.pq-log');
  det.style.display=L.length?'':'none';ol.innerHTML=L.map(function(s){return '<li>'+s.replace(/[<>&]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c];})+'</li>';}).join('');}
function buildSlot(slot){
  var q=slot.dataset.quest,Q=D.quests[q];
  slot.innerHTML='<div class="pq-shell"><div class="pq-top"><span class="pq-led"></span><span class="pq-lvl">'+D.levelLabel+'</span><span class="pq-qt">'+Q.title+'</span></div>'+
   '<div class="pq-screen"><canvas class="pq-poster-c" width="'+BW+'" height="'+BH+'"></canvas>'+
   '<div class="pq-poster" role="button" tabindex="0" aria-label="Play quest: '+Q.title+'"><div class="pq-ptitle">'+Q.title.toUpperCase()+'</div><div class="pq-pgoal">'+Q.teaser+'</div><button class="pq-play" type="button">▶ PLAY</button></div>'+
   '<div class="pq-lock"><b>🔒 LOCKED</b><span>'+(Q.lockText||'')+'</span></div></div>'+
   '<div class="pq-ctl"><div class="pq-dpad" aria-hidden="true"><button class="u" data-d="up">▲</button><button class="l" data-d="left">◀</button><span class="c"></span><button class="r" data-d="right">▶</button><button class="d" data-d="down">▼</button></div>'+
   '<div class="pq-help"><span class="pq-kb"><kbd>←↑↓→</kbd> walk &nbsp; <kbd>SPACE</kbd> talk · read<br></span>or tap the map to walk there<br><button class="pq-skip" type="button">Skip the game and just read it</button></div>'+
   '<button class="pq-ab" type="button" aria-label="Talk or read (A button)">A</button></div></div>'+
   '<div class="pq-done"><span class="pq-star">★</span><div class="pq-dt"><b>QUEST CLEAR · ALL QUESTS HERE DONE</b>'+Q.doneText+(Q.next?'<button type="button" class="pq-next">Next: '+Q.next.label+' ↓</button>':'')+'</div><button type="button" class="pq-replay">↺ PLAY AGAIN</button></div>'+
   '<details class="pq-log"><summary>📜 Quest log: read what everyone said</summary><ol></ol></details>';
  var start=function(){play(slot);};
  slot.querySelector('.pq-poster').addEventListener('click',start);
  slot.querySelector('.pq-poster').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();start();}});
  var nb=slot.querySelector('.pq-next');if(nb)nb.addEventListener('click',function(){var n=Q.next;if(n.tab&&window.switchTab)switchTab(n.tab);setTimeout(function(){var e=document.querySelector(n.sel);if(e){e.scrollIntoView({behavior:'smooth',block:'center'});e.classList.add('pq-nudge');setTimeout(function(){e.classList.remove('pq-nudge');},4000);}},n.tab?450:0);});
  slot.querySelector('.pq-replay').addEventListener('click',function(){delete S.done[q];S.q[q]={};if(Q.reset)Q.reset(S);save();slot.classList.remove('pq-cleared');paintPoster(slot);play(slot);});
  slot.querySelector('.pq-skip').addEventListener('click',function(){
    if(curSlot===slot)stop();
    if(Q.skip)Q.skip(S);S.done[q]=true;S.logs=S.logs||{};S.logs[q]=(Q.transcript||[]).map(fill);save();slot.classList.add('pq-cleared');renderLog(slot);slot.querySelector('.pq-log').open=true;D.afterQuest&&D.afterQuest(q,api());});
  var dp=slot.querySelector('.pq-dpad');
  dp.querySelectorAll('button').forEach(function(b){
    function on(e){e.preventDefault();if(curSlot!==slot)return;held=held.filter(function(z){return z!==b.dataset.d;});held.push(b.dataset.d);path=[];b.classList.add('down');}
    function off(){held=held.filter(function(z){return z!==b.dataset.d;});b.classList.remove('down');}
    b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointerleave',off);b.addEventListener('pointercancel',off);});
  slot.querySelector('.pq-ab').addEventListener('click',function(){if(curSlot===slot){focused=true;if(!modalOpen())interact();}else play(slot);});
  if(S.done[q])slot.classList.add('pq-cleared');
  renderLog(slot);paintPoster(slot);
}
function paintPoster(slot){
  var Q=D.quests[slot.dataset.quest],c=slot.querySelector('.pq-poster-c'),x=c.getContext('2d');
  var sp=Q.spawn,cam=camFor(sp[0]*TS,sp[1]*TS);var keep={x:player.x,y:player.y,px:player.px,py:player.py,dir:player.dir};
  player.x=sp[0];player.y=sp[1];player.px=sp[0]*TS;player.py=sp[1]*TS;player.dir=sp[2]||'down';
  var prev=curQ;curQ=null;drawScene(x,cam[0],cam[1],1.3,!!pSheet);curQ=prev;
  Object.assign(player,keep);
}
function refreshLocks(){document.querySelectorAll('.pq-slot').forEach(function(s){var Q=D.quests[s.dataset.quest];var lk=Q.locked&&Q.locked();s.classList.toggle('pq-locked',!!lk&&!S.done[s.dataset.quest]);});}

function mountLive(slot){
  var scr=slot.querySelector('.pq-screen');scr.appendChild(live);slot.classList.add('pq-live');
}
function play(slot){
  var q=slot.dataset.quest,Q=D.quests[q];
  if(Q.locked&&Q.locked()&&!S.done[q])return;
  Snd.blip(800);
  if(curSlot&&curSlot!==slot)stop();
  curSlot=slot;curQ=q;mountLive(slot);focused=true;
  var rr=slot.getBoundingClientRect();if(rr.top<90||rr.bottom>window.innerHeight){var y=window.scrollY+rr.top-Math.max(90,(window.innerHeight-rr.height)/2);window.scrollTo({top:y,behavior:'smooth'});}
  if(!avatar){openMaker(function(){begin(slot);});return;}
  begin(slot);
}
function begin(slot){
  var q=slot.dataset.quest,Q=D.quests[q];S.q[q]=S.q[q]||{};
  player.x=Q.spawn[0];player.y=Q.spawn[1];player.px=player.x*TS;player.py=player.y*TS;player.dir=Q.spawn[2]||'down';player.moving=false;path=[];held=[];
  ents.forEach(function(e){e.dir=e.dir0;});
  dlg.q=[];dlg.open=false;dlgEl.classList.remove('on');
  setGoal(Q.goal(S));hudCoins();
  running=true;last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
  slot.querySelector('.pq-screen').focus&&live.focus({preventScroll:true});
  if(Q.start)Q.start(api());
}
function stop(){Voice.stop();
  running=false;cancelAnimationFrame(raf);held=[];path=[];dlg.q=[];dlg.open=false;clearInterval(dlg.timer);
  [dlgEl,choiceEl,padEl,makerEl,banEl].forEach(function(e){e.classList.remove('on');});
  if(curSlot){curSlot.classList.remove('pq-live','pq-making');paintPoster(curSlot);}
  if(live.parentNode)live.parentNode.removeChild(live);
  curSlot=null;curQ=null;focused=false;
}
function complete(){
  var q=curQ,slot=curSlot;if(!q)return;S.done[q]=true;save();Snd.clear();
  var nx=D.quests[q].next;banner('QUEST CLEAR!',nx?'Next: '+nx.label+' ↓':D.quests[q].title);
  if(D.afterQuest)D.afterQuest(q,api());
  setTimeout(function(){if(curSlot!==slot)return;stop();slot.classList.add('pq-cleared');refreshLocks();
    var nxt=D.quests[q].next;if(nxt){var el=document.querySelector(nxt.sel);if(el&&el.offsetParent){el.classList.add('pq-nudge');setTimeout(function(){el.classList.remove('pq-nudge');},4000);}}},2600);
}

/* ───────── avatar maker ───────── */
var LOOKS={skins:[['#F6D3B3','#E2AE88'],['#EBC09A','#CF9A6F'],['#C98E5E','#A86E42'],['#9C6640','#7C4C2C'],['#6E4528','#52321C']],
  hairs:[['#3B2A20','#24180F'],['#7A4A26','#5A3318'],['#E0B04A','#B88420'],['#C4512E','#963A1E'],['#1E1E28','#0E0E16'],['#8E6BD0','#6A48A8']],
  styles:[['short','Short'],['long','Long'],['puffs','Puffs'],['spiky','Spiky'],['curly','Curly']],
  shirts:['#55C8E8','#2DB87A','#F5C518','#E07B39','#6B3FA0','#3A6B9A','#E04F6A','#F2F2F2']};
function lookOf(av){var w=(window.PQM&&PQM.wallet&&PQM.wallet())||{};return {gear:Object.keys(w.wear||{}).filter(function(k){return w.wear[k];}),skin:LOOKS.skins[av.skin],hair:LOOKS.hairs[av.hair],style:LOOKS.styles[av.style][0],shirt:LOOKS.shirts[av.shirt],pants:'#3E4C74'};}
function openMaker(done){
  var av=Object.assign({name:guessName(),skin:1,hair:0,style:0,shirt:4},avatar||{});
  makerEl.innerHTML='<h3>NEW EXPLORER</h3><canvas class="pq-prev" width="16" height="20" style="aspect-ratio:16/20"></canvas><div class="pq-rows">'+
   '<div class="pq-row"><span>Name</span><input maxlength="14" aria-label="Your explorer name" value="'+(av.name||'').replace(/"/g,'')+'"></div>'+
   '<div class="pq-row" data-k="skin"><span>Skin</span></div><div class="pq-row" data-k="hair"><span>Hair</span></div><div class="pq-row" data-k="style"><span>Style</span></div><div class="pq-row" data-k="shirt"><span>Shirt</span></div>'+
   '<div class="pq-err" aria-live="polite"></div></div><button class="pq-play pq-go" type="button">START ▶</button>';
  var prev=makerEl.querySelector('.pq-prev'),pc=prev.getContext('2d'),sheet,spin=0,iv;
  function redraw(){sheet=A.buildChar(lookOf(av));}
  function paint(){pc.imageSmoothingEnabled=false;pc.clearRect(0,0,16,20);var d=['down','left','up','right'][Math.floor(spin)%4];pc.drawImage(sheet,(Math.floor(spin*4)%2)?16:0,A.DIRI[d]*20,16,20,0,0,16,20);spin+=0.05;}
  function sw(k,arr,isText){var rowEl=makerEl.querySelector('[data-k="'+k+'"]');arr.forEach(function(v,i){var b=document.createElement('button');b.type='button';
    if(isText){b.className='pq-opt';b.textContent=v[1];}else{b.className='pq-sw';b.style.background=Array.isArray(v)?v[0]:v;b.setAttribute('aria-label',k+' '+(i+1));}
    if(av[k]===i)b.classList.add('sel');b.onclick=function(){av[k]=i;rowEl.querySelectorAll('button').forEach(function(z){z.classList.remove('sel');});b.classList.add('sel');Snd.sel();redraw();};rowEl.appendChild(b);});}
  sw('skin',LOOKS.skins);sw('hair',LOOKS.hairs);sw('style',LOOKS.styles,true);sw('shirt',LOOKS.shirts);
  redraw();paint();iv=setInterval(paint,60);makerEl.classList.add('on');if(curSlot)curSlot.classList.add('pq-making');
  var inp=makerEl.querySelector('input');setTimeout(function(){inp.focus({preventScroll:true});},50);
  makerEl.querySelector('.pq-go').onclick=function(){var n=inp.value.trim();var pr=nameProblem(n);if(pr){makerEl.querySelector('.pq-err').textContent=pr;Snd.bad();return;}
    av.name=n.charAt(0).toUpperCase()+n.slice(1);avatar=av;store.set('oao.pq.avatar',avatar);pSheet=A.buildChar(lookOf(avatar));clearInterval(iv);makerEl.classList.remove('on');if(curSlot)curSlot.classList.remove('pq-making');Snd.good();
    document.querySelectorAll('.pq-slot').forEach(function(s){if(s!==curSlot)paintPoster(s);});done&&done();};
}

/* ───────── keyboard ───────── */
var KEYS={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',W:'up',S:'down',A:'left',D:'right'};
function onKey(e,down){
  if(!running||!focused)return;
  var tag=(e.target&&e.target.tagName)||'';
  if(padEl.classList.contains('on')&&down){if(/^[0-9]$/.test(e.key)){padKey(e.key);e.preventDefault();return;}if(e.key==='Backspace'){padKey('⌫');e.preventDefault();return;}if(e.key==='Enter'){padKey('OK');e.preventDefault();return;}}
  if(tag==='INPUT'||tag==='TEXTAREA')return;
  if(choiceEl.classList.contains('on')&&down){var bs=[].slice.call(choiceEl.querySelectorAll('button')),i=bs.findIndex(function(b){return b.classList.contains('sel');});
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();bs[i].classList.remove('sel');i=(i+(e.key==='ArrowDown'?1:-1)+bs.length)%bs.length;bs[i].classList.add('sel');bs[i].focus({preventScroll:true});Snd.blip(500);return;}
    if(e.key===' '||e.key==='Enter'||e.key==='z'){e.preventDefault();bs[i].click();return;}}
  var d=KEYS[e.key];
  if(d){e.preventDefault();if(down){if(held.indexOf(d)<0)held.push(d);path=[];}else held=held.filter(function(z){return z!==d;});return;}
  if(down&&(e.key===' '||e.key==='Enter'||e.key==='z'||e.key==='Z')){e.preventDefault();if(!e.repeat)interact();return;}
  if(down&&e.key==='Escape'){focused=false;held=[];}
}

/* ───────── init ───────── */
function init(data){
  D=data;S=store.get(D.key,null)||{done:{},q:{},world:{},logs:{}};S.q=S.q||{};S.world=S.world||{};S.done=S.done||{};
  avatar=store.get('oao.pq.avatar',null);if(avatar&&avatar.name&&nameProblem(avatar.name)){avatar.name='';store.set('oao.pq.avatar',avatar);}if(avatar&&!avatar.name)avatar=null;if(avatar)pSheet=A.buildChar(lookOf(avatar));
  buildWorld();
  live=document.createElement('div');live.className='pq-live-layer';live.tabIndex=-1;live.style.cssText='position:absolute;inset:0;outline:none';
  live.innerHTML='<canvas width="'+BW*SCALE+'" height="'+BH*SCALE+'"></canvas>'+
   '<div class="pq-hud"><div class="pq-goal"></div><div class="pq-hbtns"><span class="pq-btn pq-coins" aria-label="My coins">🪙 0</span><button type="button" class="pq-btn pq-mute" aria-label="Sound on or off">♪</button><button type="button" class="pq-btn pq-av" aria-label="Change my explorer">✎</button><button type="button" class="pq-btn pq-x" aria-label="Pause and close the game">✕</button></div></div>'+
   '<div class="pq-banner" aria-hidden="true"></div><div class="pq-arrow" aria-hidden="true"><span class="ar">➜</span><span class="lb"></span></div>'+
   '<div class="pq-dlg" role="dialog" aria-label="Story"><canvas class="pq-face" width="16" height="16"></canvas><div class="pq-name"></div><div class="pq-txt"></div><div class="pq-more">▼</div></div>'+
   '<div class="pq-choices"></div>'+
   '<div class="pq-pad"><div class="pq-eq"></div><div class="pq-keys"></div></div>'+
   '<div class="pq-maker"></div><div class="pq-sr" aria-live="polite"></div>';
  cvs=live.querySelector('canvas');ctx=cvs.getContext('2d');buf=A.cv(BW,BH);bx=buf.getContext('2d');
  hud=live.querySelector('.pq-hud');goalEl=live.querySelector('.pq-goal');dlgEl=live.querySelector('.pq-dlg');nameEl=live.querySelector('.pq-name');txtEl=live.querySelector('.pq-txt');faceEl=live.querySelector('.pq-face');
  choiceEl=live.querySelector('.pq-choices');padEl=live.querySelector('.pq-pad');banEl=live.querySelector('.pq-banner');makerEl=live.querySelector('.pq-maker');srEl=live.querySelector('.pq-sr');arrowEl=live.querySelector('.pq-arrow');
  var kp=padEl.querySelector('.pq-keys');['1','2','3','⌫','4','5','6','0','7','8','9','OK'].forEach(function(k){var b=document.createElement('button');b.type='button';b.textContent=k;if(k==='OK')b.className='ok';b.onclick=function(e){e.stopPropagation();padKey(k);};kp.appendChild(b);});
  dlgEl.addEventListener('click',function(e){e.stopPropagation();advance();});
  cvs.addEventListener('pointerdown',function(e){focused=true;tapAt(e);});
  live.querySelector('.pq-mute').onclick=function(e){e.stopPropagation();var m=Snd.toggle();if(m)Voice.stop();this.textContent=m?'♪̸':'♪';this.style.opacity=m?.6:1;};
  if(Snd.muted){live.querySelector('.pq-mute').style.opacity=.6;}
  live.querySelector('.pq-av').onclick=function(e){e.stopPropagation();openMaker(function(){});};
  live.querySelector('.pq-x').onclick=function(e){e.stopPropagation();stop();};
  document.addEventListener('keydown',function(e){onKey(e,true);});
  document.addEventListener('keyup',function(e){onKey(e,false);});
  document.addEventListener('pointerdown',function(e){if(running&&curSlot&&!curSlot.contains(e.target)){focused=false;held=[];}});
  document.addEventListener('visibilitychange',function(){if(document.hidden&&running){held=[];}});
  document.querySelectorAll('.pq-slot').forEach(buildSlot);
  refreshLocks();setInterval(refreshLocks,1200);
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting&&curSlot===en.target&&running&&!dlg.open){focused=false;held=[];}});},{threshold:0.15});document.querySelectorAll('.pq-slot').forEach(function(s){io.observe(s);});}
  window.PQ_FAILED=[];
}
function hudCoins(){var c=live&&live.querySelector('.pq-coins');if(c&&window.PQM&&PQM.wallet)c.textContent='🪙 '+PQM.wallet().coins;}
return {_voiceKey:Voice.key,_voiceStop:Voice.stop,nameProblem:nameProblem,badName:badName,_lookOf:lookOf,_hud:hudCoins,_save:save,_rebuild:function(){if(avatar)pSheet=A.buildChar(lookOf(avatar));},_full:function(){var c=A.cv(W*TS,H*TS),x=c.getContext('2d');for(var cy=0;cy<H*TS;cy+=BH)for(var cx=0;cx<W*TS;cx+=BW){var b=A.cv(BW,BH),bxx=b.getContext('2d');var X=Math.min(cx,W*TS-BW),Y=Math.min(cy,H*TS-BH);drawScene(bxx,X,Y,1.3,true);x.drawImage(b,X,Y);}return c.toDataURL();},_ents:function(){return ents;},init:init,_api:api,_state:function(){return S;},_player:player,_play:function(q){var s=document.querySelector('.pq-slot[data-quest="'+q+'"]');if(s)play(s);},_interact:function(){interact();},_advance:function(){advance();},_stop:stop,_padKey:padKey,_tp:function(x,y,d){player.x=x;player.y=y;player.px=x*16;player.py=y*16;player.dir=d||player.dir;}};
})();
