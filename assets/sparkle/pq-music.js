/* ═══ OAO STUDY MUSIC · 10 original lo-fi chiptune loops, made live with WebAudio ═══
   Written for OAO (no outside recordings, so no licensing to track). Quiet, slow, loopable.
   PQMusic.mount(buttonParent) adds a "♫ Study music" button + a small player. Choice is remembered. */
var PQMusic = (function(){
'use strict';
var N={C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11};
function midi(name,oct){return 12*(oct+1)+N[name];}
function hz(m){return 440*Math.pow(2,(m-69)/12);}
// chord = root + quality; progression of 4 chords, 1 bar each (4 beats)
var Q={maj:[0,4,7,11],min:[0,3,7,10],dom:[0,4,7,10],sus:[0,5,7,10],add9:[0,4,7,14],m9:[0,3,7,14]};
function ch(root,q){return {r:N[root],q:Q[q]};}
var TRACKS=[
 {name:'Market Morning',bpm:78,key:'C',prog:[ch('C','maj'),ch('A','min'),ch('F','maj'),ch('G','dom')],lead:'square',seed:3,swing:.12},
 {name:'Rainy Ruler',bpm:70,key:'A',prog:[ch('A','min'),ch('F','maj'),ch('C','maj'),ch('E','min')],lead:'triangle',seed:7,swing:.18},
 {name:'Owl Lights',bpm:74,key:'D',prog:[ch('D','m9'),ch('G','dom'),ch('C','maj'),ch('A','min')],lead:'square',seed:11,swing:.15},
 {name:'Juice Stand Shuffle',bpm:84,key:'F',prog:[ch('F','maj'),ch('D','min'),ch('A#','maj'),ch('C','sus')],lead:'triangle',seed:19,swing:.2},
 {name:'Meter Stick Moon',bpm:66,key:'E',prog:[ch('E','min'),ch('C','maj'),ch('G','maj'),ch('D','add9')],lead:'square',seed:23,swing:.1},
 {name:'Fountain Plaza',bpm:72,key:'G',prog:[ch('G','maj'),ch('E','min'),ch('C','add9'),ch('D','dom')],lead:'triangle',seed:31,swing:.14},
 {name:'Quiet Quest',bpm:68,key:'B',prog:[ch('B','min'),ch('G','maj'),ch('D','maj'),ch('A','sus')],lead:'square',seed:41,swing:.16},
 {name:'Train Window',bpm:80,key:'C',prog:[ch('A','m9'),ch('D','min'),ch('G','dom'),ch('C','maj')],lead:'triangle',seed:53,swing:.12},
 {name:'Lantern Steps',bpm:64,key:'F',prog:[ch('D','min'),ch('A#','maj'),ch('F','maj'),ch('C','dom')],lead:'square',seed:61,swing:.18},
 {name:'Last Light',bpm:76,key:'G',prog:[ch('E','min'),ch('A','min'),ch('D','sus'),ch('G','add9')],lead:'triangle',seed:73,swing:.12}
];
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
// build a 4-bar loop: melody motif of 8 eighths per bar, A A' B A'' shape for a "song" feel
function compose(T){
  var R=rng(T.seed),bars=[];
  function tones(c,o){return c.q.map(function(i){return 12*(o+1)+c.r+i;});}
  var motif=[];for(var i=0;i<8;i++)motif.push(R()<0.68?Math.floor(R()*4):-1); // chord-tone index or rest
  if(motif[0]<0)motif[0]=0;
  var motifB=motif.map(function(v){return v<0?(R()<0.5?Math.floor(R()*4):-1):(v+(R()<0.5?1:0))%4;});
  T.prog.forEach(function(c,b){
    var lead=[],m=b===2?motifB:motif,t=tones(c,5);
    for(var k=0;k<8;k++){var v=m[k];if(b===3&&k>5)v=-1;lead.push(v<0?null:t[v%t.length]);}
    bars.push({c:c,lead:lead,bass:[12*3+c.r,null,12*3+c.r+7,null,12*3+c.r,null,12*3+c.r+(c.q[1]),12*3+c.r+7],pad:tones(c,4)});
  });
  return bars;
}
var ac=null,master=null,lp=null,timer=0,cur=-1,step=0,nextT=0,loop=null,vol=0.5,playing=false;
function ensure(){if(ac)return;ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;lp.Q.value=0.4;
  master.gain.value=0;lp.connect(master);master.connect(ac.destination);}
function note(f,t,d,type,v,dest){var o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;o.detune.value=(Math.random()-.5)*8;
  g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+0.015);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(dest||lp);o.start(t);o.stop(t+d+0.05);}
var noiseBuf=null;
function noise(t,d,v,hp){if(!noiseBuf){noiseBuf=ac.createBuffer(1,ac.sampleRate*0.5,ac.sampleRate);var a=noiseBuf.getChannelData(0);for(var i=0;i<a.length;i++)a[i]=Math.random()*2-1;}
  var s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=noiseBuf;f.type='highpass';f.frequency.value=hp||6000;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(f);f.connect(g);g.connect(lp);s.start(t);s.stop(t+d+0.02);}
function kick(t){var o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(42,t+0.18);g.gain.setValueAtTime(0.5,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.25);o.connect(g);g.connect(lp);o.start(t);o.stop(t+0.3);}
function vinyl(t,d){noise(t,d,0.012,9000);}
function schedule(){
  var T=TRACKS[cur],e=60/T.bpm/2; // eighth note
  while(nextT<ac.currentTime+0.25){
    var bar=Math.floor(step/8)%4,k=step%8,B=loop[bar],t=nextT+(k%2?T.swing*e:0);
    if(B.lead[k]!=null)note(hz(B.lead[k]),t,e*1.6,T.lead,T.lead==='square'?0.035:0.07);
    if(B.bass[k]!=null)note(hz(B.bass[k]),t,e*1.8,'triangle',0.16);
    if(k===0){B.pad.forEach(function(m,i){note(hz(m),t+i*0.02,e*7.5,'sine',0.028);});}
    if(k===0||k===5)kick(t);
    if(k===2||k===6)noise(t,0.12,0.05,1800);
    if(k%2===1)noise(t,0.04,0.025,7000);
    if(k===0&&bar===0)vinyl(t,e*8);
    step++;nextT+=e;
  }
}
function play(i){ensure();if(ac.state==='suspended')ac.resume();cur=i;loop=compose(TRACKS[i]);step=0;nextT=ac.currentTime+0.08;
  master.gain.cancelScheduledValues(ac.currentTime);master.gain.linearRampToValueAtTime(vol*0.55,ac.currentTime+0.6);
  clearInterval(timer);timer=setInterval(schedule,60);playing=true;save();render();}
function stop(){if(!ac)return;master.gain.linearRampToValueAtTime(0,ac.currentTime+0.3);setTimeout(function(){clearInterval(timer);},320);playing=false;save();render();}
function setVol(v){vol=v;if(ac&&playing)master.gain.linearRampToValueAtTime(vol*0.55,ac.currentTime+0.1);save();}
function save(){try{localStorage.setItem('oao.pq.music',JSON.stringify({t:cur,v:vol}));}catch(e){}}
var btn,panel;
function render(){if(!panel)return;
  btn.innerHTML=(playing?'♫ '+TRACKS[cur].name:'♫ Study music');btn.classList.toggle('on',playing);
  panel.querySelector('.pm-list').innerHTML=TRACKS.map(function(T,i){return '<button type="button" class="pm-t'+(i===cur&&playing?' on':'')+'" data-i="'+i+'"><span>'+(i===cur&&playing?'▮▮':'▶')+'</span>'+T.name+'</button>';}).join('');
  [].forEach.call(panel.querySelectorAll('.pm-t'),function(b){b.onclick=function(){var i=+b.dataset.i;if(i===cur&&playing)stop();else play(i);};});}
function mount(host){
  try{var s=JSON.parse(localStorage.getItem('oao.pq.music')||'{}');if(s.v!=null)vol=s.v;if(s.t!=null)cur=s.t;}catch(e){}
  btn=document.createElement('button');btn.type='button';btn.className='pm-btn';btn.setAttribute('aria-label','Study music');
  panel=document.createElement('div');panel.className='pm-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Study music');
  panel.innerHTML='<div class="pm-top"><b>♫ Study music</b><button type="button" class="pm-x" aria-label="Close">✕</button></div><p class="pm-note">Calm 8-bit songs made for OAO. Pick one. It loops until you stop it.</p><div class="pm-list"></div>'+
    '<label class="pm-vol">Volume <input type="range" min="0" max="1" step="0.05" value="'+vol+'"></label><button type="button" class="pm-stop">■ Stop music</button>';
  host.appendChild(btn);document.body.appendChild(panel);
  btn.onclick=function(){panel.classList.toggle('on');render();};
  panel.querySelector('.pm-x').onclick=function(){panel.classList.remove('on');};
  panel.querySelector('.pm-stop').onclick=stop;
  panel.querySelector('input').oninput=function(){setVol(+this.value);};
  render();
}
return {mount:mount,tracks:TRACKS,play:play,stop:stop,_state:function(){return {playing:playing,cur:cur};}};
})();
