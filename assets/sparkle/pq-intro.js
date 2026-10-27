/* ═══════════════════════════════════════════════════════════════════════════
   Pixel Quest · the cinematic opening  (assets/sparkle/pq-intro.js)
   A full-screen 8-bit curtain that DRAWS THE LESSON'S MATH before the page
   appears, then lands a title card and dissolves into the lesson pixel by pixel.

   A lesson turns it on with PQ_LESSON.intro:
     intro:{
       kicker:'LEVEL 10 · METRIC MARKET',    // small line over the title
       card:false,                           // false = no title card: pure picture, straight into the lesson
       title:'Metric Units of Measurement',  // defaults to PQ_LESSON.title
       ask:'How long is Amy\'s counter?',    // today's puzzle (yellow). Never the answer to Think.
       alt:'A ruler fills with ten 10 cm pieces…', // what the animation shows, for screen readers
       len:6,                                // seconds of math before the title card (it sits in the lower part of the
                                             // screen: slide the math up into the top ~40% once t > len)
       scene:function(g,t){ … }              // draws one frame; t = seconds since start
     }
   g (the drawing kit, all in logical pixels; the canvas is scaled up crisp):
     g.W g.H g.cx g.cy g.s (css px per pixel)  g.portrait  g.clean (clean mode: no characters)  g.x (2d context)
     g.p(t,a,b) 0→1 between a and b · g.ease(p) · g.back(p) overshoot · g.lerp(a,b,p)
     g.rect(x,y,w,h,col) · g.box(x,y,w,h,fill,outline) · g.text(s,x,y,{size,col,align,shadow,font:'dot'})
     g.type(s,t,a,cps) typewriter · g.char(id,x,y,dir,frame) a PQ_DATA npc · g.owl(x,y,t)
     g.sparkle(x,y,t,col) · g.blip(hz) once per id: g.once(id)&&g.blip(660)
     g.C  the fixed place-value colors {1000 violet,100 blue,10 green,1 orange} + navy, gold, wood
   Plays once per lesson per browser session; "🎬 Replay intro" sits in the header tools.
   Skip: the button, a tap/click, Enter, Space or Esc. Never autoplays under
   prefers-reduced-motion (Replay then shows the finished picture, still).
   ?intro forces it, ?nointro (and automated test browsers) skip the autoplay.
   ═══════════════════════════════════════════════════════════════════════════ */
var PQIntro=(function(){
'use strict';
var L,I,cur=null,ac=null;
var C={1000:'#8E5BD0',100:'#3A7BD5',10:'#2DB87A',1:'#F28C28',navy:'#0E1C42',navy2:'#1A2D5A',gold:'#F5C518',ink:'#3B2417',
  cream:'#FFF3DE',wood:'#C8894F',woodHi:'#E3AE72',woodD:'#8A5A33',white:'#FFFFFF',sky:'#55C8E8',red:'#E04F4F'};
function q(n){try{return new URLSearchParams(location.search).has(n);}catch(e){return false;}}
function reduced(){return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);}
function skey(){return 'oao.pq.intro:'+(L.key||location.pathname);}
function seen(){try{return sessionStorage.getItem(skey())==='1';}catch(e){return false;}}
function mark(){try{sessionStorage.setItem(skey(),'1');}catch(e){}}
function muted(){try{return JSON.parse(localStorage.getItem('oao.pq.mute')||'false');}catch(e){return false;}}
function clamp(v){return v<0?0:v>1?1:v;}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

/* ───────── the drawing kit ───────── */
function kit(cv,W,H,S){
  var x=cv.getContext('2d');x.imageSmoothingEnabled=false;
  var looks={},sheets={},owl=null,fired={};
  ((window.PQ_DATA||{}).npcs||[]).forEach(function(n){if(n.look)looks[n.id]=n.look;});
  var g={W:W,H:H,s:S,cx:Math.round(W/2),cy:Math.round(H/2),portrait:H>W*1.15,x:x,C:C,
    clean:document.body.classList.contains('pq-clean'),
    p:function(t,a,b){return clamp((t-a)/(b-a));},
    ease:function(p){p=clamp(p);return 1-Math.pow(1-p,3);},
    back:function(p){p=clamp(p);var s=1.9;return 1+(s+1)*Math.pow(p-1,3)+s*Math.pow(p-1,2);},
    lerp:function(a,b,p){return a+(b-a)*p;},
    rect:function(X,Y,w,h,c){if(w<=0||h<=0)return;x.fillStyle=c;x.fillRect(Math.round(X),Math.round(Y),Math.round(w),Math.round(h));},
    box:function(X,Y,w,h,fill,ol){g.rect(X-1,Y-1,w+2,h+2,ol||C.ink);g.rect(X,Y,w,h,fill);g.rect(X,Y,w,1,'rgba(255,255,255,.28)');g.rect(X,Y+h-1,w,1,'rgba(0,0,0,.22)');},
    text:function(s,X,Y,o){o=o||{};var sz=o.size||8;x.font=sz+'px '+(o.font==='dot'?'"DotGothic16"':'"Press Start 2P"')+',monospace';
      x.textAlign=o.align||'center';x.textBaseline='top';X=Math.round(X);Y=Math.round(Y);
      if(o.shadow!==false){x.fillStyle=o.shadow||C.navy;x.fillText(s,X+1,Y+1);}
      x.fillStyle=o.col||C.white;x.fillText(s,X,Y);return x.measureText(s).width;},
    type:function(s,t,a,cps){var n=Math.floor((t-a)*(cps||24));return n<=0?'':s.slice(0,n);},
    char:function(id,X,Y,dir,f){if(g.clean||!window.PQART||!looks[id])return;
      if(!sheets[id])sheets[id]=PQART.buildChar(looks[id]);var r=PQART.DIRI[dir||'down']||0;
      x.drawImage(sheets[id],(f||0)*16,r*20,16,20,Math.round(X),Math.round(Y),16,20);},
    owl:function(X,Y,t){if(g.clean||!window.PQART)return;if(!owl)owl=PQART.buildOwl();var f=(Math.floor((t||0)*1.3)%5===0)?1:0;
      x.drawImage(owl,f*16,0,16,20,Math.round(X),Math.round(Y),16,20);},
    sparkle:function(X,Y,t,c){if(window.PQART)PQART.sparkle(x,Math.round(X),Math.round(Y),t,c);},
    once:function(id){if(fired[id])return false;fired[id]=1;return true;},
    blip:function(hz,len){if(!ac||muted()||ac.state!=='running')return;try{var o=ac.createOscillator(),v=ac.createGain();o.type='square';o.frequency.value=hz||660;
      v.gain.setValueAtTime(.04,ac.currentTime);v.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+(len||.09));o.connect(v);v.connect(ac.destination);o.start();o.stop(ac.currentTime+(len||.09));}catch(e){}}
  };
  return g;
}
/* night-market sky: navy, twinkling pixel stars, a dark rooftop line */
function backdrop(g,t){
  var x=g.x;x.fillStyle=C.navy;x.fillRect(0,0,g.W,g.H);
  for(var i=0;i<46;i++){var sx=(i*73.13)%g.W,sy=(i*41.7)%(g.H*0.8),tw=Math.sin(t*2.2+i)*.5+.5;
    x.fillStyle=i%7===0?'rgba(245,197,24,'+(.35+tw*.5)+')':'rgba(255,255,255,'+(.12+tw*.35)+')';x.fillRect(Math.round(sx),Math.round(sy),1,1);}
  var base=g.H-10;x.fillStyle='#0A1533';
  for(var k=0;k<g.W;k+=14){var h=6+((k*37)%11);x.fillRect(k,base-h,12,h+10);if(k%28===0)x.fillRect(k+3,base-h-4,6,4);}
  x.fillStyle='#16295A';x.fillRect(0,base,g.W,10);
}

/* ───────── the curtain ───────── */
function sizes(){
  var vw=window.innerWidth,vh=window.innerHeight,tall=vh>(screen.height||900)*1.2;
  if(tall)vh=Math.min(vh,screen.height||900,900);              // a Canvas iframe stretched to the page height
  var s=Math.max(2,Math.round(Math.min(vw,vh)/190));
  return {vw:vw,vh:vh,tall:tall,s:s,W:Math.ceil(vw/s),H:Math.ceil(vh/s)};
}
function open(still){
  if(cur||!I)return;mark();
  try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();}catch(e){ac=null;}
  var z=sizes(),title=I.title||L.title||'';
  var c=document.createElement('div');c.className='pqi';c.setAttribute('role','dialog');c.setAttribute('aria-modal','true');c.setAttribute('aria-label','Lesson opening: '+title);
  if(z.tall){c.style.position='absolute';c.style.top=(window.scrollY||0)+'px';c.style.height=z.vh+'px';c.style.bottom='auto';}
  c.innerHTML='<canvas aria-hidden="true"></canvas>'+
    '<p class="pqi-sr">'+esc(I.alt||'')+'</p>'+
    (I.card===false?'':'<div class="pqi-card"><div class="pqi-kick">'+esc(I.kicker||'')+'</div><h2 class="pqi-title">'+esc(title)+'</h2>'+
      (I.ask?'<div class="pqi-ask"><span>Today\'s puzzle</span>'+esc(I.ask)+'</div>':'')+'</div>')+
    '<button type="button" class="pqi-skip">'+(still?'Start the lesson ▸':'Skip ▸▸')+'</button>';
  document.body.appendChild(c);document.body.classList.add('pqi-on');document.body.classList.remove('pqi-pre');
  var cv=c.querySelector('canvas');cv.width=z.W;cv.height=z.H;cv.style.width=(z.W*z.s)+'px';cv.style.height=(z.H*z.s)+'px';
  var g=kit(cv,z.W,z.H,z.s),len=I.len||6,hold=I.hold||(I.card===false?.8:2.6),t0=performance.now(),out=null,cells=null,last=document.activeElement;
  var st={c:c,raf:0,closing:false};cur=st;
  function frame(now){
    var t=still?len+hold:(now-t0)/1000;
    backdrop(g,t);try{I.scene(g,Math.min(t,len+hold));}catch(e){(window.PQ_FAILED=window.PQ_FAILED||[]).push('intro: '+e.message);close(true);return;}
    if(t>=len&&I.card!==false)c.classList.add('title');
    if(!still&&t>=len+hold&&!st.closing)close();
    if(out!==null){                                              // pixel dissolve: clear 8×8 cells in a shuffled order
      var pr=clamp((now-out)/650),n=Math.floor(pr*cells.length);
      for(var i=0;i<n;i++)g.x.clearRect(cells[i][0],cells[i][1],8,8);
      if(pr>=1){finish();return;}
    }
    st.raf=requestAnimationFrame(frame);
  }
  function close(fast){
    if(st.closing)return;st.closing=true;c.classList.add('out');
    if(fast||still){finish();return;}
    cells=[];for(var yy=0;yy<z.H;yy+=8)for(var xx=0;xx<z.W;xx+=8)cells.push([xx,yy]);
    for(var i=cells.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),tmp=cells[i];cells[i]=cells[j];cells[j]=tmp;}
    out=performance.now();
  }
  function finish(){cancelAnimationFrame(st.raf);c.remove();document.body.classList.remove('pqi-on');document.removeEventListener('keydown',key,true);cur=null;
    if(last&&last.focus&&document.contains(last))try{last.focus({preventScroll:true});}catch(e){}}
  function key(e){if(e.key==='Escape'||e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();close();}else if(e.key==='Tab'){e.preventDefault();c.querySelector('.pqi-skip').focus();}}
  c.addEventListener('click',function(){close();});
  document.addEventListener('keydown',key,true);
  st.raf=requestAnimationFrame(frame);
  setTimeout(function(){var b=c.querySelector('.pqi-skip');if(b)b.focus({preventScroll:true});},50);
  st.close=close;
}
function replayButton(){
  var tools=document.querySelector('.pq-hdr-tools')||document.querySelector('.header');if(!tools||document.querySelector('.pqi-replay'))return;
  var b=document.createElement('button');b.type='button';b.className='pq-pill pqi-replay';b.innerHTML='🎬 Replay intro';
  b.title='Watch the lesson opening again';b.onclick=function(){open(reduced());};
  tools.insertBefore(b,tools.firstChild);
}
function init(){
  L=window.PQ_LESSON;I=L&&L.intro;if(!I||typeof I.scene!=='function')return;
  try{replayButton();}catch(e){}
  var auto=q('intro')||(!seen()&&!reduced()&&!q('nointro')&&!navigator.webdriver);
  if(!auto)return;
  document.body.classList.add('pqi-pre');
  var go=function(){open(false);};
  // wait (briefly) for the pixel font so the first frames are crisp
  if(document.fonts&&document.fonts.load){var done=false,f=function(){if(!done){done=true;go();}};
    Promise.all([document.fonts.load('8px "Press Start 2P"'),document.fonts.load('16px "DotGothic16"')]).then(f,f);setTimeout(f,700);}
  else go();
}
return {init:init,open:function(){open(reduced());},close:function(){if(cur)cur.close(true);},C:C};
})();
