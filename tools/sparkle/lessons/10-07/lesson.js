/* ═══ PQ_DATA · Lesson 4.10.07 Fractions and Measurement, Part 2 · Level 10 "Metric Market" · the Farmers' Market (lesson 7 of 7, the boss) ═══
   Everything lesson-specific lives here. The engine (pq-engine.js) and art kit (pq-art.js) hold no lesson content.
   The Brick Golem fight is lesson code on the engine's own hooks (an object with its own art, HP bar and hit effect, the number pad). */
var PQ_DATA = (function(){
var TS=16;

/* The farmers' market at dawn: the road along the bottom (from the night market, west), a market square in the middle with
   Goldie's farm stand, a pumpkin patch, the ink-maker's stall and the stamp shed, the Crew by the road (south-west), Penny's
   cart (south-west corner), a path north up the hill where the Brick Golem stands, and the road south (east), blocked by a
   barrier until the Golem is beaten. */
function mkMap(){
  var W=32,H=22,g=[],i,j;
  for(j=0;j<H;j++){g.push([]);for(i=0;i<W;i++)g[j].push((j===0||j===H-1||i===0||i===W-1)?'T':'.');}
  for(i=1;i<=30;i++)g[17][i]='p';
  g[17][0]='p';
  for(j=8;j<=13;j++)for(i=7;i<=21;i++)g[j][i]='s';
  for(j=14;j<=16;j++)g[j][14]='p';
  for(j=3;j<=7;j++)g[j][14]='p';
  for(j=2;j<=5;j++)for(i=10;i<=18;i++)if(g[j][i]==='.')g[j][i]=(j===5&&(i<12||i>16))?'.':g[j][i];
  for(j=14;j<=15;j++)for(i=22;i<=26;i++)g[j][i]='d';
  for(j=18;j<=21;j++)g[j][28]='p';
  [[3,12],[6,10],[25,11],[28,9],[11,19],[20,20],[2,8],[29,15],[22,5],[7,5]].forEach(function(p){g[p[1]][p[0]]='f';});
  [[1,1],[2,1],[1,2],[1,20],[2,20],[30,20],[30,19],[29,1],[30,1],[30,2]].forEach(function(p){g[p[1]][p[0]]='T';});
  return g.map(function(r){return r.join('');});
}

var GOLDIE={skin:['#EBC09A','#CF9A6F'],hair:['#E0B04A','#B88420'],style:'curly',shirt:'#E07B39',acc:'hat',acc2:'#D8B575'};
var D = {
  key:'g4-4-10-07-pq',
  levelLabel:'LV 10 · FARMERS\' MARKET',
  map:mkMap(),
  speakers:{
    sys:{name:'',color:'#3B2417',pitch:440,noface:true},
    me:{name:'You',color:'#6B3FA0',pitch:600},
    opti:{name:'OPTI',color:'#0E1C42',pitch:760},
    atlas:{name:'ATLAS',color:'#1F8FB4',pitch:420},
    felix:{name:'FELIX',color:'#1E8C5A',pitch:500},
    hazel:{name:'HAZEL',color:'#B08A0A',pitch:680},
    cora:{name:'CORA',color:'#C2601F',pitch:600},
    goldie:{name:'GOLDIE',color:'#C96512',pitch:620},
    inkmaker:{name:'INK-MAKER',color:'#3A3A72',pitch:360},
    smudge:{name:'THE SMUDGE',color:'#55505E',pitch:220,noface:true},
    golem:{name:'THE BRICK GOLEM',color:'#9A3F28',pitch:140,noface:true},
    penny:{name:'PENNY',color:'#8E4FBF',pitch:620},
    sign:{name:'SIGN',color:'#8A5A33',pitch:480,noface:true},
    'item-pumpkin':{name:'',color:'#3B2417',pitch:520,icon:'pumpkin'}
  },
  npcs:[
    {id:'opti',owl:true,x:2,y:16,fixed:true},
    {id:'atlas',x:5,y:14,dir:'right',look:{skin:['#EBC09A','#CF9A6F'],hair:['#5A3A22','#3E2716'],style:'short',shirt:'#55C8E8',acc:'hat',acc2:'#D8B575'}},
    {id:'felix',x:8,y:14,dir:'left',look:{skin:['#9C6640','#7C4C2C'],hair:['#1E1E28','#0E0E16'],style:'spiky',shirt:'#2DB87A',acc:'goggles'}},
    {id:'hazel',x:5,y:16,dir:'right',look:{skin:['#F6D3B3','#E2AE88'],hair:['#C4512E','#963A1E'],style:'long',shirt:'#F5C518',acc:'beret',acc2:'#C93A4A'}},
    {id:'cora',x:8,y:16,dir:'left',look:{skin:['#C98E5E','#A86E42'],hair:['#2A1D18','#160E0A'],style:'puffs',shirt:'#E07B39',acc:'glasses',frame:'#5B2E10'}},
    {id:'goldie',x:11,y:11,dir:'down',look:GOLDIE},
    {id:'inkmaker',x:24,y:11,dir:'down',look:{skin:['#8A5A3B','#6E432A'],hair:['#1E1E28','#0E0E16'],style:'short',shirt:'#3A3A72',acc:'glasses',frame:'#1E1E28'}},
    {id:'penny',x:6,y:19,dir:'right',look:{skin:['#EBC09A','#CF9A6F'],hair:['#8E6BD0','#6A48A8'],style:'puffs',shirt:'#6B3FA0'}}
  ],
  items:[
    {id:'pA',kind:'pumpkin',x:23,y:14,tag:'5 FT = ? IN',eq:'5 ft =',unit:'in',a:60},
    {id:'pB',kind:'pumpkin',x:26,y:15,tag:'ONE EIGHTH OF A POUND = ? OZ',eq:'one eighth of 1 lb =',unit:'oz',a:2},
    {id:'pC',kind:'pumpkin',x:4,y:9,tag:'ONE TWELFTH OF AN HOUR = ? MIN',eq:'one twelfth of 1 h =',unit:'min',a:5}
  ],
  labels:{opti:'Opti',atlas:'Atlas',felix:'Felix',hazel:'Hazel',cora:'Cora',goldie:'Goldie',inkmaker:'the ink-maker',penny:'Penny',
    shed:'the stamp shed',golem:'the Brick Golem',item:'A smudged pumpkin tag'},
  objects:[],
  quests:{},
  transcripts:{}
};
function W(){return PQ._state().world;}
function jd(id){return !!(window.PQM&&PQM.jobDone(id));}

/* the find quest: three pumpkins with smudged tags; fixing each tag lifts the pumpkin. The stamp handle is under the last one. */
var PIECE_MISS={
  pA:function(v){return v===5?{who:'felix',t:'5 is the number of feet. Each foot is 12 inches: 5 times 12.'}:v===17?{who:'cora',t:'5 plus 12 adds them. Each foot is 12 inches, and there are 5 of them: 5 times 12.'}:{who:'felix',t:'A foot is 12 inches. 5 feet is 5 groups of 12 inches.'};},
  pB:function(v){return v===8?{who:'cora',t:'8 is how many equal parts. Cut 16 ounces into 8 equal parts. How big is one part?'}:v===128?{who:'felix',t:'8 times 16 is 128, more than a whole pound. One eighth is one of 8 equal parts of the pound.'}:{who:'felix',t:'A pound is 16 ounces. Eighths means 8 equal parts. How many ounces in one part?'};},
  pC:function(v){return v===12?{who:'cora',t:'12 is how many equal parts. Cut 60 minutes into 12 equal parts. How long is one part?'}:v===720?{who:'felix',t:'12 times 60 is 720, more than a whole hour. One twelfth is one of 12 equal parts of the hour.'}:{who:'felix',t:'An hour is 60 minutes. Twelfths means 12 equal parts. How many minutes in one part?'};}
};
D.items.forEach(function(it){
  it.show=function(S){var q=S.q.find;return !!(q&&q.met&&!(q.found||{})[it.id]);};
  it.take=function(api){var q=api.S.q.find;q.found=q.found||{};
    var p={who:'me',t:'Fix the tag. Type the number, then press OK.',pad:{eq:it.eq,unit:it.unit,check:function(v,a){
      if(v===it.a){a.snd.good();q.found[it.id]=1;a.save();var n=Object.keys(q.found).length;
        if(n<3)return a.say([{who:'sys',t:'The tag now says '+it.a+' '+it.unit+'. You lift the pumpkin. Nothing under this one. '+(3-n)+' to go.'}],function(b){b.goal(D.quests.find.goal(b.S));});
        a.S.world.handle=true;a.save();a.snd.item();return a.say([{who:'sys',t:'The tag now says '+it.a+' '+it.unit+'. You lift the pumpkin, and there it is: a wooden handle with a metal end. The Re-Stamper\'s handle!'}],function(b){b.goal(D.quests.find.goal(b.S));});}
      a.snd.bad();a.say([PIECE_MISS[it.id](v),p]);}}};
    api.say([{who:'item-pumpkin',t:'A pumpkin with a smudged tag: '+it.tag+'.'},p]);};
});

/* ───────── objects (art + footprints) ───────── */
function O(o){D.objects.push({build:function(A){var r=o.make(A);r.id=o.id;r.solid=o.solid;r.hidden=o.hidden;r.mx=o.mx;r.my=o.my;return r;}});}
O({id:'goldieStall',make:function(A){return {spr:A.stall('bread'),dx:9*TS,dy:9*TS-24,base:9*TS+15,fp:[[9,9],[10,9],[11,9]]};}});
O({id:'inkStall',make:function(A){return {spr:A.stall('jars'),dx:23*TS,dy:9*TS-24,base:9*TS+15,fp:[[23,9],[24,9],[25,9]]};}});
O({id:'shed',mx:19*TS+8,my:6*TS-8,make:function(A){return {spr:A.shed(),dx:17*TS,dy:7*TS-36,base:7*TS+15,fp:[[17,6],[18,6],[19,6],[20,6],[17,7],[18,7],[19,7],[20,7]],
  anim:function(x,X,Y,t){var w=W(),k=0;['handle','face','ink'].forEach(function(f,i){if(w[f]){x.drawImage(A.item(f==='face'?'stampface':f),Math.round(X)+6+i*18,Math.round(Y)+38);k++;}});
    if(k===3&&Math.floor(t*2)%2)A.sparkle(x,Math.round(X)+32,Math.round(Y)+34,t,'#F5C518');}};}});
// pumpkins in the patch (decoration)
[[22,14],[24,14],[25,15],[22,15],[24,15]].forEach(function(p){O({make:function(A){return {spr:A.item('pumpkin'),dx:p[0]*TS,dy:p[1]*TS,base:p[1]*TS+12,fp:[[p[0],p[1]]]};}});});
/* the Brick Golem on the hill: a dark shadow until the fight, bricks and glowing eyes during it, rubble and a seed packet after */
var GX=13,GY=3;
function golemArt(A,x,X,Y,t,mode,hit){
  var P=A.P,sh=mode==='shadow',c=function(col){return sh?'rgba(40,30,55,.55)':col;};
  var shake=hit?Math.round(Math.sin(t*60)*2):0;X+=shake;
  A.ell(x,X+24,Y+54,20,3,'rgba(0,0,0,0.25)');
  // legs
  A.R(x,c(P.ol),X+10,Y+40,11,14);A.R(x,c(P.ol),X+27,Y+40,11,14);A.R(x,c('#9A3F28'),X+11,Y+41,9,12);A.R(x,c('#9A3F28'),X+28,Y+41,9,12);
  // body of bricks
  A.R(x,c(P.ol),X+4,Y+14,40,28);
  for(var r=0;r<4;r++)for(var k=0;k<4;k++){var bx=X+5+k*10-(r%2?5:0),by=Y+15+r*7;if(bx<X+5)bx=X+5;var bw=Math.min(9,X+43-bx);if(bw<=0)continue;
    A.R(x,c(['#B5543A','#C6643F','#A84A33'][(r+k)%3]),bx,by,bw,6);if(!sh&&(r+k)%2===0)A.R(x,'#F2E6CC',bx+3,by+2,3,1);}
  // arms
  A.R(x,c(P.ol),X,Y+16,6,20);A.R(x,c(P.ol),X+42,Y+16,6,20);A.R(x,c('#A84A33'),X+1,Y+17,4,18);A.R(x,c('#A84A33'),X+43,Y+17,4,18);
  // head
  A.R(x,c(P.ol),X+12,Y,24,15);A.R(x,c('#C6643F'),X+13,Y+1,22,13);
  var eye=sh?'rgba(245,197,24,.7)':(hit?'#FFFFFF':'#F5C518');A.R(x,eye,X+17,Y+5,4,3);A.R(x,eye,X+27,Y+5,4,3);
  if(hit&&!sh){x.globalAlpha=0.5;A.R(x,'#FFFFFF',X+4,Y+14,40,28);x.globalAlpha=1;}
}
O({id:'golem',mx:GX*TS+24,my:GY*TS-6,make:function(A){var fp=[];for(var i=GX;i<GX+3;i++)for(var j=GY;j<GY+3;j++)fp.push([i,j]);
  return {spr:null,dx:GX*TS,dy:GY*TS-8,base:(GY+2)*TS+15,fp:fp,anim:function(x,X,Y,t){X=Math.round(X);Y=Math.round(Y);var w=W(),S=PQ._state(),B=S.q.boss||{};
    if(w.golem){ // rubble and the seed packet
      for(var k=0;k<9;k++)A.R(x,['#B5543A','#C6643F','#A84A33'][k%3],X+6+(k%5)*8,Y+40+Math.floor(k/5)*6,7,5);
      if(!w.seeds){x.drawImage(A.item('seeds'),X+16,Y+28);A.sparkle(x,X+30,Y+30,t,'#FFF7C2');}return;}
    var fight=!!B.fight,hit=B.hitAt&&(t-B.hitAt)<0.5&&(t-B.hitAt)>=0;
    golemArt(A,x,X,Y,t,fight?'full':'shadow',hit);
    if(fight){var hp=8-(B.hit||0),hx=X+40,hy=Y-2;A.R(x,'#3B2417',hx,hy,58,10);A.R(x,'#F5C518',hx+1,hy+1,56,1);for(var s=0;s<8;s++)A.R(x,s<hp?'#E04F4F':'#55505E',hx+2+s*7,hy+2,6,6);}}};}});
// the road south: a barrier until the Golem falls
O({id:'barrierS',hidden:function(){return !!W().golem;},make:function(A){return {spr:A.barrier(),dx:28*TS,dy:19*TS,base:19*TS+15,fp:[[28,19]]};}});
O({id:'westSign',make:function(A){return {spr:A.signpost('wood'),dx:1*TS,dy:16*TS-6,base:16*TS+15,fp:[[1,16]]};}});
O({id:'southSign',make:function(A){return {spr:A.signpost('wood'),dx:29*TS,dy:18*TS-6,base:18*TS+15,fp:[[29,18]]};}});
O({id:'hillSign',make:function(A){return {spr:A.signpost('wood'),dx:15*TS,dy:8*TS-6,base:8*TS+15,fp:[[15,8]]};}});
O({id:'outfitters',make:function(A){return {spr:A.hatStall(),dx:2*TS,dy:19*TS-24,base:19*TS+15,fp:[[2,19],[3,19],[4,19]]};}});
O({make:function(A){return {spr:A.bench(),dx:12*TS+1,dy:13*TS+2,base:13*TS+15,fp:[[12,13],[13,13]]};}});
O({make:function(A){return {spr:A.bench(),dx:18*TS+1,dy:13*TS+2,base:13*TS+15,fp:[[18,13],[19,13]]};}});
[[8,7],[21,7],[11,16],[17,16],[24,16]].forEach(function(p){O({make:function(A){return {spr:A.lamp(),dx:p[0]*TS+3,dy:p[1]*TS-14,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});
[[3,11],[9,3],[19,3],[29,8],[13,15],[18,19],[24,19],[30,13],[11,5],[17,5]].forEach(function(p){O({make:function(A){return {spr:A.bush(),dx:p[0]*TS,dy:p[1]*TS,base:p[1]*TS+14,fp:[[p[0],p[1]]]};}});});
[[4,5],[26,4],[2,14],[6,2],[23,2],[30,16]].forEach(function(p){O({make:function(A){return {spr:A.tree(),dx:p[0]*TS-8,dy:p[1]*TS-24,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});

/* ───────── quests ───────── */
D.quests.find={
  title:'The Stamp Handle',spawn:[14,15,'up'],next:{tab:'warmup',sel:'#mk-mental',label:'Mental Math'},
  teaser:'Dawn at the farmers\' market. A huge shadow stands on the hill. Goldie needs her old Re-Stamper, but the Smudge hid its pieces.',
  lockText:'Finish Two Pieces above to unlock this quest. Goldie needs helpers who can change whole units and fractions of a unit.',
  locked:function(){return !jd('j1');},
  doneText:'5 feet is 60 inches, one eighth of a pound is 2 ounces, and one twelfth of an hour is 5 minutes. Under the last pumpkin: the Re-Stamper\'s handle. Next: Mental Math, then the Think puzzle.',
  goal:function(S){var q=S.q.find||{},n=Object.keys(q.found||{}).length;
    if(!q.met)return 'Talk to <b>Goldie</b> at her farm stand.';
    if(!S.world.handle)return 'Find the pumpkins with smudged tags and fix them <b>('+n+'/3)</b>';
    return 'Bring the handle to <b>Goldie</b>.';},
  markers:function(S){var q=S.q.find||{};if(!q.met)return [{id:'goldie'}];return S.world.handle?[{id:'goldie'}]:[];},
  start:function(api){var q=api.q();if(!q.seen){q.seen=1;api.save();api.banner('LEVEL 10','FARMERS\' MARKET · LESSON 7 OF 7');
    api.say([{who:'opti',t:'Hoo! Welcome to the farmers\' market, {name}. The sun is just coming up.'},
      {who:'opti',t:'Look up at the hill. That giant shadow is the Brick Golem. It\'s here, just like the clock said.'},
      {who:'opti',t:'Goldie keeps the market. She\'ll know what to do. Go talk to her at her farm stand.'}],function(a){a.goal(D.quests.find.goal(a.S));});}},
  reset:function(S){S.world.handle=false;S.q.find={};},
  skip:function(S){S.world.handle=true;},
  transcript:['Opti: Welcome to the farmers\' market. That shadow on the hill is the Brick Golem.','Goldie: Every brick on the Golem has one of the Smudge\'s wrong stamps. My old Re-Stamper can fix them, but the Smudge hid its three pieces.','Pumpkin tag: 5 ft = 60 in.','Pumpkin tag: one eighth of a pound = 2 oz.','Pumpkin tag: one twelfth of an hour = 5 min.','You found the Re-Stamper\'s handle under the last pumpkin.','Goldie: The handle! Two pieces to go.']
};
var DIALS=[
  {say:'one and five twelfths feet',eq:'1 and five twelfths ft =',unit:'in',a:17,wrong:{5:'That\'s only the fraction part. The 1 whole foot is 12 inches too. Add both pieces.',12:'That\'s only the whole foot. Add the five twelfths of a foot: 5 more inches.',60:'Five times 12 is 60, but twelfths of a foot are 1 inch each. Five twelfths is 5 inches.'}},
  {say:'two and one sixteenth pounds',eq:'2 and one sixteenth lb =',unit:'oz',a:33,wrong:{1:'That\'s only the fraction part. The 2 whole pounds are 32 ounces. Add both pieces.',32:'That\'s only the 2 whole pounds. Add one sixteenth of a pound: 1 more ounce.',3:'2 plus 1 counts pieces, not ounces. Each whole pound is 16 ounces.'}},
  {say:'one and one twelfth hours',eq:'1 and one twelfth h =',unit:'min',a:65,wrong:{5:'That\'s only the fraction part. The 1 whole hour is 60 minutes. Add both pieces.',60:'That\'s only the whole hour. Add one twelfth of an hour: 60 cut into 12 equal parts is 5.',61:'One twelfth of an hour isn\'t 1 minute. Cut 60 minutes into 12 equal parts.'}}];
D.quests.build={
  title:'The Stamp Face',spawn:[18,9,'up'],next:{tab:'learn',sel:'#mk-crates',label:'Label the Crates'},
  teaser:'The Re-Stamper\'s face sits in the stamp shed. Its three number dials are stuck, and each one must be set in small units.',
  lockText:'Finish Weigh and Time the Market on the Learn tab above to unlock this quest.',
  locked:function(){return !jd('j3');},
  doneText:'One and five twelfths feet is 17 inches, two and one sixteenth pounds is 33 ounces, one and one twelfth hours is 65 minutes. The stamp face clicks onto the handle. Next: Label the Crates.',
  goal:function(S){var q=S.q.build||{},n=q.set||0;if(!q.met)return 'Talk to <b>Goldie</b>.';return n<3?'Set the dials at <b>the stamp shed</b> ('+n+'/3).':'The stamp face is ready!';},
  markers:function(S){var q=S.q.build||{};if(!q.met)return [{id:'goldie'}];return (q.set||0)<3?[{id:'shed'}]:[];},
  start:function(api){api.S.world.handle=true;api.save();},
  reset:function(S){S.world.face=false;S.q.build={};},
  skip:function(S){S.world.face=true;},
  transcript:['Goldie: The stamp face is in the shed, but its dials are stuck. Each one shows a mixed number. Set it in small units.','You: one and five twelfths feet is 17 inches.','You: two and one sixteenth pounds is 33 ounces.','You: one and one twelfth hours is 65 minutes.','Goldie: The face clicks onto the handle. One more piece: ink.']
};
var INK=[
  {ask:'First order: a sack of beans that weighs one and nine sixteenths pounds. My scale reads ounces. How many ounces?',eq:'1 and nine sixteenths lb =',unit:'oz',a:25,
   miss:function(v){return v===9?{who:'cora',t:'Nine ounces is only the fraction part. Change the whole pound too: 16 ounces, then add.'}:v===16?{who:'felix',t:'16 ounces is the whole pound. Add the nine sixteenths of a pound: 9 more ounces.'}:{who:'felix',t:'Two pieces: 1 whole pound is 16 ounces, and nine sixteenths of a pound is 9 ounces. Put them together.'};}},
  {ask:'Second order: a bean pole three and one twelfth feet tall. My tape only shows inches. How many inches?',eq:'3 and one twelfth ft =',unit:'in',a:37,
   miss:function(v){return v===36?{who:'hazel',t:'Picture 3 whole foot bars, 36 inches, and one more bar with just one twelfth shaded. Add that 1 inch.'}:v===1?{who:'cora',t:'One inch is only the fraction part. The 3 whole feet are inches too.'}:{who:'felix',t:'Change both pieces: 3 feet is 3 times 12 inches, and one twelfth of a foot is 1 inch.'};}},
  {ask:'Last order: my ink needs to stir for one and one fifth hours. How many minutes is that?',eq:'1 and one fifth h =',unit:'min',a:72,
   miss:function(v){return v===12?{who:'cora',t:'Twelve minutes is the fraction part. The 1 whole hour is 60 more minutes.'}:v===65?{who:'felix',t:'One fifth of an hour isn\'t 5 minutes. Cut 60 minutes into 5 equal parts: 12 minutes each.'}:v===61?{who:'felix',t:'One fifth of an hour is one of 5 equal parts of 60 minutes, not 1 minute.'}:{who:'felix',t:'Change both pieces: 1 hour is 60 minutes, and one fifth of an hour is 60 cut into 5 equal parts.'};}}];
D.quests.deliver={
  title:'Ink for the Stamp',spawn:[22,13,'up'],next:{tab:'assignment',sel:'#tab-assignment .q-block',label:'Show What You Know'},
  teaser:'The Re-Stamper needs ink. The ink-maker will trade a jar for help with three orders, all written as mixed numbers.',
  lockText:'Finish Two Ways to Write It on the Learn tab above to unlock this quest.',
  locked:function(){return !jd('j5');},
  doneText:'One and nine sixteenths pounds is 25 ounces, three and one twelfth feet is 37 inches, one and one fifth hours is 72 minutes. The ink is in the stamp shed. Next: Show What You Know, then Goldie\'s pumpkin order.',
  goal:function(S){var q=S.q.deliver||{},n=q.done||0;return !q.met?'Talk to <b>the ink-maker</b> at the ink stall.':n<3?'Help <b>the ink-maker</b> with the orders ('+n+'/3).':!S.world.ink?'Take the ink jar to <b>the stamp shed</b>.':'The ink is in the shed!';},
  markers:function(S){var q=S.q.deliver||{};if((q.done||0)<3)return [{id:'inkmaker'}];return S.world.ink?[]:[{id:'shed'}];},
  start:function(api){api.S.world.handle=true;api.S.world.face=true;api.save();},
  reset:function(S){S.world.ink=false;S.q.deliver={};},
  skip:function(S){S.world.ink=true;},
  transcript:['Ink-maker: Help me with three orders and the ink is yours. They\'re all mixed numbers.','You: one and nine sixteenths pounds is 25 ounces.','You: three and one twelfth feet is 37 inches.','You: one and one fifth hours is 72 minutes.','You put the ink jar in the stamp shed. The Re-Stamper is whole.']
};
/* the boss: 4 phases, 2 bricks each. A wrong answer gets a Crew hint and the same brick again (no damage, no timer). */
var BRICKS=[
  {phase:'PHASE 1 · METRIC',stamp:'4 m 6 cm = 46 cm',eq:'4 m 6 cm =',unit:'cm',a:406,miss:{46:{who:'cora',t:'That\'s the Smudge\'s stamp! 4 meters is 400 centimeters. Then add the 6.'},460:{who:'felix',t:'4 meters is 400 centimeters, and 6 more is 406. 460 would be 4 meters 60 centimeters.'}},hint:{who:'felix',t:'A meter is 100 centimeters. 4 meters is 400 centimeters. Add the 6.'}},
  {stamp:'2 kg 300 g = 230 g',eq:'2 kg 300 g =',unit:'g',a:2300,miss:{230:{who:'cora',t:'That\'s the Smudge\'s stamp! A kilogram is 1,000 grams, so 2 kilograms is 2,000 grams.'},2003:{who:'felix',t:'2,000 grams and 300 more grams. 300, not 3.'}},hint:{who:'felix',t:'A kilogram is 1,000 grams. 2 kilograms is 2,000 grams. Add the 300.'}},
  {phase:'PHASE 2 · CUSTOMARY',stamp:'3 gal 1 qt = 31 qt',eq:'3 gal 1 qt =',unit:'qt',a:13,miss:{31:{who:'cora',t:'That\'s the Smudge\'s stamp! It treats a gallon like 10 quarts. A gallon is 4 quarts.'},4:{who:'felix',t:'3 plus 1 counts the pieces. Each gallon is 4 quarts: 3 times 4, then add 1.'}},hint:{who:'felix',t:'A gallon is 4 quarts. 3 gallons is 12 quarts. Add the 1 quart.'}},
  {stamp:'3 ft 10 in + 1 ft 6 in = 4 ft 16 in',eq:'3 ft 10 in + 1 ft 6 in = 5 ft',unit:'in',a:4,miss:{16:{who:'cora',t:'16 inches is more than a foot. Trade 12 of the inches for 1 foot. How many inches are left?'},6:{who:'felix',t:'Add the inches: 10 plus 6 is 16. Trade 12 of them for the fifth foot. What is left?'}},hint:{who:'atlas',t:'Add the inches: 10 plus 6 is 16. Trade 12 inches for 1 foot. The leftover inches go in the box.'}},
  {phase:'PHASE 3 · TIME',stamp:'4 h 5 min = 405 min',eq:'4 h 5 min =',unit:'min',a:245,miss:{405:{who:'cora',t:'That\'s the Smudge\'s stamp! It treats an hour like 100 minutes. An hour is 60 minutes.'},9:{who:'felix',t:'4 plus 5 counts pieces. Each hour is 60 minutes: 4 times 60, then add 5.'}},hint:{who:'felix',t:'An hour is 60 minutes. 4 hours is 240 minutes. Add the 5.'}},
  {stamp:'seven tenths of an hour = 7 min',eq:'seven tenths of 1 h =',unit:'min',a:42,miss:{7:{who:'cora',t:'That\'s the Smudge\'s stamp! Tenths means the hour is cut into 10 equal parts of 6 minutes. Take 7 parts.'},420:{who:'felix',t:'7 times 60 is 420. Now divide by 10, because it\'s tenths.'},70:{who:'felix',t:'An hour is 60 minutes, not 100. Cut 60 into 10 equal parts: 6 minutes each.'}},hint:{who:'felix',t:'Cut 60 minutes into 10 equal parts: 6 minutes each. Take 7 parts.'}},
  {phase:'PHASE 4 · MIXED NUMBERS',stamp:'3 and five twelfths ft = 3 ft 41 in',eq:'3 and five twelfths ft = 3 ft',unit:'in',a:5,miss:{41:{who:'cora',t:'That\'s the Smudge\'s stamp! For feet AND inches, the 3 whole feet stay. Only the fraction part changes.'},36:{who:'cora',t:'The 3 feet are already written. Only five twelfths of a foot goes in the box.'}},hint:{who:'atlas',t:'Ask: what needs changing, the fraction or the whole number? Just the fraction: five twelfths of a foot.'}},
  {stamp:'4 and three sixteenths lb = 7 oz',eq:'4 and three sixteenths lb =',unit:'oz',a:67,miss:{7:{who:'cora',t:'That\'s the Smudge\'s stamp! It added 4 and 3. Change both pieces to ounces first.'},3:{who:'felix',t:'3 ounces is only the fraction part. The 4 whole pounds are ounces too.'},64:{who:'felix',t:'64 ounces is the 4 whole pounds. Add the fraction part: 3 more ounces.'}},hint:{who:'felix',t:'All ounces: 4 pounds is 4 times 16 ounces. Three sixteenths of a pound is 3 ounces. Add them.'}}];
D.quests.boss={
  title:'The Brick Golem',spawn:[14,8,'up'],next:{tab:'assignment',sel:'.gathered-box',label:'Gather your answers'},
  teaser:'The Re-Stamper is whole: handle, face and ink. The Brick Golem is stomping down the hill.',
  lockText:'Finish the last job above (Goldie\'s pumpkin order) to unlock the boss.',
  locked:function(){return !jd('j6');},
  doneText:'Every brick is re-stamped. The Brick Golem crumbled into a seed packet labeled GREENHOLLOW, and the road south is open. Next: gather your answers. Then the Unit 10 check.',
  goal:function(S){var q=S.q.boss||{},h=q.hit||0;if(!q.met)return 'Get the Re-Stamper from <b>Goldie</b>.';if(!S.world.golem)return 'Re-stamp <b>the Brick Golem</b>\'s bricks <b>('+h+'/8)</b>';return 'The Golem is beaten!';},
  markers:function(S){var q=S.q.boss||{};if(!q.met)return [{id:'goldie'}];return S.world.golem?[]:[{id:'golem'}];},
  start:function(api){api.S.world.handle=true;api.S.world.face=true;api.S.world.ink=true;api.save();var q=api.q();if(!q.seen){q.seen=1;api.save();
    api.say([{who:'opti',t:'Hoo! The ground is shaking, {name}. The Golem is coming down the hill!'},{who:'opti',t:'Goldie has the Re-Stamper ready. Go get it from her.'}],function(a){a.goal(D.quests.boss.goal(a.S));});}},
  reset:function(S){S.world.golem=false;S.world.seeds=false;S.q.boss={};},
  skip:function(S){S.world.golem=true;},
  transcript:['Goldie: Here is the Re-Stamper. Fix every wrong stamp on the Golem\'s bricks.','The Smudge: My Brick Golem is finished, and every brick has my stamp on it!','Phase 1, metric: 4 m 6 cm = 406 cm. 2 kg 300 g = 2,300 g.','Phase 2, customary: 3 gal 1 qt = 13 qt. 3 ft 10 in + 1 ft 6 in = 5 ft 4 in.','Phase 3, time: 4 h 5 min = 245 min. Seven tenths of an hour = 42 min.','Phase 4, mixed numbers: 3 and five twelfths ft = 3 ft 5 in. 4 and three sixteenths lb = 67 oz.','The Golem crumbles into a pile of bricks and a seed packet labeled GREENHOLLOW.','The Smudge: You haven\'t seen the last of me!','Opti: The road south is open. Next comes the Unit 10 check.']
};
function brickLine(k){var B=BRICKS[k];return [{who:'sys',t:'A brick glows. Its stamp says: '+B.stamp+'.'}];}
function brick(api,k){var Q=api.S.q.boss,B=BRICKS[k];
  var p={who:'me',t:'Re-stamp the brick. Type the number, then press OK.',pad:{eq:B.eq,unit:B.unit,check:function(v,a){
    if(v===B.a){a.snd.good();Q.hit=k+1;Q.hitAt=a.t();a.save();
      a.fx({t:0,update:function(dt){this.t+=dt;return this.t<0.6;},draw:function(x,cx,cy,tt){for(var s=0;s<6;s++){a.A.sparkle(x,GX*16+8+s*6-cx,GY*16+10+(s%2)*8-cy,tt+s,s%2?'#F5C518':'#FFFFFF');}}});
      if(k===7)return a.say([{who:'sys',t:'Stamp! The last brick reads 67 oz.'}],defeat);
      var N=BRICKS[k+1];
      return a.say([{who:'sys',t:'Stamp! The brick now reads the right amount. The Golem staggers.'}],function(b){if(N.phase)b.banner(N.phase.split(' · ')[0],N.phase.split(' · ')[1]);b.goal(D.quests.boss.goal(b.S));b.say(brickLine(k+1),function(c){brick(c,k+1);});});}
    a.snd.bad();var m=B.miss[v]||B.hint;a.say([m,p]);}}};
  api.say([p]);}
function defeat(a){a.S.world.golem=true;a.save();a.snd.item();
  a.fx({t:0,update:function(dt){this.t+=dt;return this.t<1.4;},draw:function(x,cx,cy,tt){for(var k=0;k<10;k++){a.A.sparkle(x,GX*16+4+k*5-cx,GY*16+20+(k%3)*8-cy,tt+k,k%2?'#F5C518':'#FFFFFF');}}});
  a.say([{who:'golem',t:'Rrrumble… crrrack…'},
    {who:'sys',t:'The Brick Golem crumbles into a pile of bricks. Something sparkles in the dust: a seed packet labeled GREENHOLLOW.'},
    {who:'smudge',t:'My Golem! You re-stamped every brick. Grr. You haven\'t seen the last of me, Wayfinder!'},
    {who:'opti',t:'Hoo! You did it, {name}! The farmers\' market is safe, and the barrier on the road south is gone.'},
    {who:'opti',t:'The seed packet says Greenhollow. That\'s where the road south goes. But first, the Unit 10 check. You\'re ready.'}],function(b){b.S.world.seeds=true;b.save();b.goal(D.quests.boss.goal(b.S));b.complete();});}

D.quests.crew={
  title:'Hear the Crew\'s Ways',spawn:[6,15,'down'],next:{tab:'learn',sel:'#journal-compare',label:'Which way is like yours?'},
  teaser:'The Math Crew worked out the scarecrow puzzle. Walk to each of them and hear how they did it.',
  doneText:'Atlas changed just the fraction: 2 ft 10 in. Felix changed it all to inches: 34 in. Hazel pictured the bars, and Cora asked what needs changing first. Next: which way is most like yours?',
  goal:function(S){var q=S.q.crew||{},n=Object.keys(q.heard||{}).length;return n<4?'Walk to each Math Crew member and hear their way <b>('+n+'/4)</b>':'Tell <b>Opti</b> what you heard.';},
  markers:function(S){var h=(S.q.crew||{}).heard||{};var m=['atlas','felix','hazel','cora'].filter(function(c){return !h[c];}).map(function(c){return {id:c};});return m.length?m:[{id:'opti'}];},
  start:function(api){var q=api.q();if(!q.seen){q.seen=1;api.save();
    api.say([{who:'opti',t:'Hoo! The Math Crew worked out the scarecrow puzzle. They each found the answer their own way.'},
      {who:'opti',t:'Walk up to each of them and listen. Then come back and tell me.'}],function(a){a.goal(D.quests.crew.goal(a.S));});}},
  reset:function(S){S.q.crew={};},
  transcript:['Atlas (change just the fraction): the 2 whole feet stay. Five sixths of a foot is 10 inches. 2 feet 10 inches.','Felix (change it all): 2 feet is 24 inches. 24 plus 10 is 34 inches.','Hazel (picture it): two whole foot bars and one more bar cut into 6 parts, 5 of them shaded.','Cora (ask first): what needs changing, the fraction or the whole number?','Opti: Two ways to write it, one height: 2 feet 10 inches is 34 inches.']
};
var WAYS={
  atlas:[{who:'atlas',t:'My way is to change just the fraction part.'},
    {who:'atlas',t:'Two and five sixths feet is 2 whole feet and five sixths of a foot. The 2 feet stay.'},
    {who:'atlas',t:'Five sixths of a foot is 10 inches. So the scarecrow is 2 feet 10 inches!'}],
  felix:[{who:'felix',t:'My way is to change it all to inches.'},
    {who:'felix',t:'2 feet is 2 times 12, that\'s 24 inches. Five sixths of a foot is 10 inches.'},
    {who:'felix',t:'24 plus 10 is 34 inches. Same height as Atlas, just written in one unit!'}],
  hazel:[{who:'hazel',t:'I picture two whole foot bars, 12 inches each.'},
    {who:'hazel',t:'Then one more bar cut into 6 equal parts, with 5 of them shaded. That\'s the part that isn\'t a whole foot.'}],
  cora:[{who:'cora',t:'Before I change anything, I ask: what needs changing, the fraction or the whole number?'},
    {who:'cora',t:'For feet and inches, only the fraction changes. For all inches, both pieces change.'}]
};
/* ───────── talk ───────── */
/* The Crew says hello and talks about the farmers' market and the Golem first (HELLO). Their method lines (IDLE) unlock only
   after the page teaches the two ways: CREW_TAUGHT is Measure the Scarecrows (Job 2). */
var CREW_TAUGHT='j2';
var HELLO={
  atlas:'Hi, I\'m Atlas! I climbed the hill at sunrise. There\'s a giant shadow up there, and I think it moved.',
  felix:'Hey, I\'m Felix! I tested every crate at Goldie\'s stand. Sturdy. But will they hold up against a brick monster?',
  hazel:'Hi! I\'m Hazel. I\'m drawing the pumpkins before the Golem gets here. So much orange!',
  cora:'Hello, I\'m Cora. The Golem\'s bricks have stamps on them. If the Smudge made those stamps, they\'re wrong.'
};
var IDLE={
  atlas:'For feet and inches, the whole feet stay. One and seven twelfths feet is 1 foot 7 inches.',
  felix:'For all inches, I change both pieces and add. 2 feet is 24 inches, and five sixths of a foot is 10 more: 34 inches.',
  hazel:'I picture whole bars for the whole units, and one more bar with only part of it shaded.',
  cora:'Ask first: what needs changing, the fraction or the whole number? Then change only that.'
};
var SHOP=[['cap','Explorer cap',10],['scarf','Market scarf',8],['flower','Hair flower',6],['pack','Travel pack',15]];
function shop(api){
  var Wl=PQM.wallet();
  var ch=SHOP.map(function(it){var own=Wl.gear[it[0]];return [it[1]+(own?(Wl.wear[it[0]]?' · wearing':' · put on'):' · '+it[2]+' 🪙'),function(a){
    if(own){Wl.wear[it[0]]=!Wl.wear[it[0]];PQM.saveWallet();PQ._rebuild();a.snd.sel();a.say([{who:'penny',t:Wl.wear[it[0]]?'Looking sharp!':'Off it comes. I\'ll keep it safe in your pack.'}]);return;}
    if(PQM.spend(it[2])){Wl.gear[it[0]]=1;Wl.wear[it[0]]=1;PQM.saveWallet();PQ._rebuild();a.snd.item();a.say([{who:'penny',t:'One '+it[1].toLowerCase()+', coming right up! It\'ll go with you to every lesson.'}]);}
    else{a.snd.bad();a.say([{who:'penny',t:'That costs '+it[2]+' coins, and you have '+Wl.coins+'. Earn more with correct work on the lesson page, like Two Pieces and Measure the Scarecrows.'}]);}}];});
  ch.push(['Just looking',function(a){a.say([{who:'penny',t:'Come back any time!'}]);}]);
  api.say([{who:'penny',t:'Even with a Golem on the hill, I\'m open! You have '+Wl.coins+' coins. Anything catch your eye?',choices:ch}]);
}
function curQuest(){var s=document.querySelector('.pq-slot.pq-live');return s&&s.dataset.quest;}
function padOf(who,t,eq,unit,check){var p={who:who,t:t,pad:{eq:eq,unit:unit,check:function(v,a){check(v,a,p);}}};return p;}
D.talk=function(id,api){
  var S=api.S,q=curQuest();
  if(q==='crew'&&WAYS[id]){return api.say(WAYS[id],function(a){var C=a.S.q.crew;C.heard=C.heard||{};C.heard[id]=1;a.save();
      var n=Object.keys(C.heard).length;a.say([{who:'sys',t:n<4?'That\'s '+n+' of 4. Find the next Crew member.':'You heard all four! Go back to Opti.'}],function(b){b.goal(D.quests.crew.goal(b.S));});});}
  if(q==='crew'&&id==='opti'){var CC=S.q.crew||{};if(Object.keys(CC.heard||{}).length>=4)return api.say([{who:'opti',t:'Hoo! Two ways to write it, and one height: 2 feet 10 inches is the same as 34 inches.'},{who:'opti',t:'Which way is most like yours? Write about it on your page, right under the Crew\'s card.'}],function(a){a.complete();});
    return api.say([{who:'opti',t:'Walk up to each Crew member and listen to their way first.'}]);}
  if(id==='opti'){
    if(S.world.golem)return api.say([{who:'opti',t:'The Golem is beaten and the road south is open. Next, the Unit 10 check, {name}.'}]);
    return api.say([{who:'opti',t:'Hoo! Every job on the page helps Goldie rebuild the Re-Stamper.'}]);
  }
  if(IDLE[id])return api.say([{who:id,t:(PQM.jobDone(CREW_TAUGHT)?IDLE:HELLO)[id]}]);
  if(id==='goldie'){
    if(q==='find'){var F=S.q.find;
      if(!F.met)return api.say([{who:'goldie',t:'Oh, you must be the Wayfinder! I\'m Goldie. I keep the farmers\' market.'},{who:'goldie',t:'Every brick on that Golem has one of the Smudge\'s wrong stamps. My old Re-Stamper can fix them, one brick at a time.'},
        {who:'goldie',t:'But the Smudge hid its three pieces. I think the handle is under a pumpkin. Fix the smudged pumpkin tags and look underneath.'}],
        function(a){a.S.q.find.met=1;a.save();a.goal(D.quests.find.goal(a.S));});
      if(!S.world.handle)return api.say([{who:'goldie',t:'Look for the sparkly pumpkins. Fix each tag, like the two pieces on your page.'}]);
      return api.say([{who:'goldie',t:'The handle! One piece found, two to go. Thank you, {name}.'}],function(a){a.complete();});}
    if(q==='build'){var B=S.q.build;
      if(!B.met)return api.say([{who:'goldie',t:'Next is the stamp face. It\'s in the stamp shed, but its three dials are stuck.'},{who:'goldie',t:'Each dial shows a mixed number. Set it in small units: inches, ounces or minutes.'}],
        function(a){a.S.q.build.met=1;a.save();a.goal(D.quests.build.goal(a.S));});
      return api.say([{who:'goldie',t:S.world.face?'The face is on the handle. Now it just needs ink.':'The stamp shed is north-east of my stand.'}]);}
    if(q==='boss'){var Q=S.q.boss;
      if(!Q.met)return api.say([{who:'goldie',t:'Here it is: the Re-Stamper, handle, face and ink. You built it, {name}.'},{who:'goldie',t:'Walk up the hill and fix every wrong stamp on the Golem. Take your time. Every brick you fix makes it weaker.'}],
        function(a){a.S.q.boss.met=1;a.save();a.goal(D.quests.boss.goal(a.S));});
      return api.say([{who:'goldie',t:S.world.golem?'The market is safe! Thank you, {name}.':'The Golem is up the hill. You can do this!'}]);}
    return api.say([{who:'goldie',t:'Welcome to the farmers\' market! Pumpkins, beans and apples. Everything by the pound.'}]);
  }
  if(id==='shed'){
    if(q==='build'&&S.q.build.met&&!S.world.face){var B2=S.q.build,k=B2.set||0,DL=DIALS[k];
      var p1=padOf('me','How many? Type it, then press OK.',DL.eq,DL.unit,function(v,a,me){
        if(v===DL.a){a.snd.good();B2.set=k+1;a.save();
          if(k<2)return a.say([{who:'sys',t:'Click! The dial turns to '+DL.a+' '+DL.unit+'. Next dial.'}],function(b){b.goal(D.quests.build.goal(b.S));});
          a.S.world.face=true;a.save();a.say([{who:'sys',t:'Click! The last dial turns, and the stamp face clicks onto the handle.'},{who:'goldie',t:'It fits! Now we just need ink.'}],function(b){b.goal(D.quests.build.goal(b.S));b.complete();});}
        else{a.snd.bad();var w=DL.wrong[v];a.say([{who:w?'cora':'felix',t:w||'Two pieces: change the whole units, change the fraction part, then put them together.'},me]);}});
      return api.say([{who:'sign',t:'A stuck dial. It shows '+DL.say+'.'},p1]);}
    if(q==='deliver'&&(S.q.deliver.done||0)>=3&&!S.world.ink){S.world.ink=true;api.save();api.snd.item();
      return api.say([{who:'sys',t:'You put the ink jar in the stamp shed. Handle, face and ink: the Re-Stamper is whole!'}],function(a){a.goal(D.quests.deliver.goal(a.S));a.complete();});}
    var parts=['handle','face','ink'].filter(function(f){return S.world[f];}).length;
    return api.say([{who:'sys',t:'The stamp shed. Re-Stamper pieces here: '+parts+' of 3.'}]);
  }
  if(id==='inkmaker'){
    if(q==='deliver'){var V=S.q.deliver,n2=V.done||0;
      if(!V.met)return api.say([{who:'inkmaker',t:'Morning! I make the ink for every stamp in this market.'},{who:'inkmaker',t:'Help me with three orders, and a jar of ink is yours. They\'re all written as mixed numbers.'}],
        function(a){a.S.q.deliver.met=1;a.save();a.goal(D.quests.deliver.goal(a.S));});
      if(n2<3){var OD=INK[n2];var pd=padOf('me','Type the number, then press OK.',OD.eq,OD.unit,function(v,a,me){
          if(v===OD.a){a.snd.good();V.done=n2+1;a.save();a.say([{who:'inkmaker',t:n2<2?OD.a+' '+OD.unit+'. Right! Next order.':OD.a+' '+OD.unit+'. All three! Here\'s your ink. Take it to the stamp shed.'}],function(b){b.goal(D.quests.deliver.goal(b.S));});}
          else{a.snd.bad();a.say([OD.miss(v),me]);}});
        return api.say([{who:'inkmaker',t:OD.ask},pd]);}
      return api.say([{who:'inkmaker',t:S.world.ink?'Good luck with that Golem!':'Take the ink to the stamp shed, north of the market.'}]);}
    return api.say([{who:'inkmaker',t:'Ink for every stamp in the market. Dark, dark blue.'}]);
  }
  if(id==='golem'){
    if(q==='boss'&&S.q.boss.met&&!S.world.golem){var Q2=S.q.boss;
      if(!Q2.fight){Q2.fight=1;Q2.hit=0;api.save();
        return api.say([{who:'golem',t:'GRRRRMMMM.'},{who:'smudge',t:'My Brick Golem is finished! Every brick has my stamp on it. Heh heh heh!'},{who:'sys',t:'The Golem has 8 bricks with wrong stamps. Re-stamp each one with the right amount.'}],
          function(a){a.banner('PHASE 1','METRIC');a.goal(D.quests.boss.goal(a.S));a.say(brickLine(0),function(b){brick(b,0);});});}
      var k2=Q2.hit||0;return api.say(brickLine(k2),function(a){brick(a,k2);});}
    if(S.world.golem&&!S.world.seeds){S.world.seeds=true;api.save();return api.say([{who:'sys',t:'A seed packet. It says GREENHOLLOW.'}]);}
    return api.say([{who:'sys',t:S.world.golem?'A pile of bricks. Every stamp on them is right now.':'The Brick Golem stands on the hill, still as a statue. For now.'}]);
  }
  if(id==='penny'||id==='outfitters')return shop(api);
  var SIGNS={
    westSign:[{who:'sign',t:'← NIGHT MARKET'}],
    southSign:[{who:'sign',t:S.world.golem?'ROAD SOUTH ↓ Greenhollow':'ROAD SOUTH ↓ Closed until the Golem is gone.'}],
    hillSign:[{who:'sign',t:'HILL ↑'}],
    goldieStall:[{who:'sys',t:'Goldie\'s farm stand. Baskets of apples and beans, and bread from the bakery.'}],
    inkStall:[{who:'sys',t:'The ink stall. Jars of dark blue ink.'}],
    barrierS:[{who:'sys',t:'A barrier. The road south is closed until the Golem is beaten.'}]
  };
  if(SIGNS[id])return api.say(SIGNS[id]);
};
D.afterQuest=function(q,api){
  if(window.PQM){var slot=document.querySelector('.pq-slot[data-quest="'+q+'"]');PQM.earn('quest-'+q,q==='boss'?15:5,q==='boss'?25:10,slot,q==='boss'?'Golem beaten!':'Quest clear!');PQM.renderBoard();}
  if(q==='boss'&&window.PQM&&PQM.progress)PQM.progress();
  if(q==='boss'){try{var y=JSON.parse(localStorage.getItem('oao.pq.year')||'{}');y.L10=y.L10||{};y.L10['10.07']=1;y.L10.boss=1;localStorage.setItem('oao.pq.year',JSON.stringify(y));}catch(e){}}
};
return D;
})();

/* ═══ PQ_LESSON · the page side of 4.10.07 (jobs, scene, models). The shared layer is assets/sparkle/pq-layer.js ═══ */
var PQ_LESSON=(function(){
var api;
function jobDone(id){return api.jobDone(id);}
function setJob(id,src){api.setJob(id,src);}
function earn(k,c,x,s,l){return api.earn(k,c,x,s,l);}
function ls(k,d){return api.ls(k,d);}
function lsSet(k,v){return api.lsSet(k,v);}
function num(v){var t=String(v==null?'':v).replace(/[,\s]/g,'');return t===''||isNaN(+t)?null:+t;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function F(n,d){return '<span class="frac"><span class="num">'+n+'</span><span class="den">'+d+'</span></span>';}
function MX(w,n,d){return w+' '+F(n,d);}
var FT={unit:'ft',name:['foot','feet']},IN={unit:'in',name:['inch','inches']},LB={unit:'lb',name:['pound','pounds']},OZ={unit:'oz',name:['ounce','ounces']},
    HR={unit:'h',name:['hour','hours']},MIN={unit:'min',name:['minute','minutes']};

/* the cinematic opening: pictures and one counter in inches, no sentences.
   Dawn over the market, a dark Golem shape on the hill → two whole-foot bars drop in (counter 0 … 12 … 24 in) → a third bar
   is snipped into 6 equal parts and 5 of them light up → the counter shows "24 in + ?" → Goldie walks up and wonders "?". */
function introScene(g,t){
  var C0=g.C,W=g.W,H=g.H,i;
  g.owl(W-30,H-30-Math.ceil(52/g.s),t);
  // the hill and the Golem's shadow
  var hy=Math.round(H*.86);g.rect(0,hy,W,H-hy,'rgba(46,92,50,.55)');
  var gs=Math.max(10,Math.round(H*.10)),gx=Math.round(W*.64),gyy=hy-gs*2;
  g.rect(gx,gyy,gs,gs,'rgba(40,30,55,.8)');g.rect(gx-Math.round(gs*.4),gyy+gs,Math.round(gs*1.8),gs,'rgba(40,30,55,.8)');
  if(Math.floor(t*2)%2)g.rect(gx+2,gyy+3,3,2,C0.gold);
  var bw=Math.round(W*.66),bx=Math.round((W-bw)/2)-Math.round(W*.04),bh=Math.max(12,Math.round(H*.08)),y0=Math.round(H*.24),gap=Math.round(bh*.5);
  // two whole feet
  var a1=g.ease(g.p(t,0.3,1.3)),a2=g.ease(g.p(t,1.6,2.6));
  if(a1>0){g.rect(bx,y0,Math.round(bw*a1),bh,C0.blue||'#1F8FB4');}
  if(a2>0){g.rect(bx,y0+bh+gap,Math.round(bw*a2),bh,C0.blue||'#1F8FB4');}
  var inches=Math.round(12*a1)+Math.round(12*a2);
  if(t<5.2&&inches>0)g.text(inches+' in',Math.round(g.cx),Math.round(H*.10),{col:inches%12===0?C0.gold:C0.white});
  if(a1>=1&&g.once('f1'))g.blip(660,.15);if(a2>=1&&g.once('f2'))g.blip(780,.15);
  // one more foot, cut into 6, five parts light up
  var y3=y0+2*(bh+gap);
  if(t>2.9){g.rect(bx,y3,bw,bh,'rgba(255,255,255,.12)');
    var cuts=Math.min(5,Math.floor(g.p(t,2.9,3.9)*6));for(i=1;i<=cuts;i++){var cx=bx+Math.round(bw*i/6);g.rect(cx-1,y3-3,2,bh+6,C0.white);if(g.once('c'+i))g.blip(880+i*40,.06);}
    var lit=Math.min(5,Math.floor(g.p(t,4.1,5.1)*6));for(i=0;i<lit;i++)g.rect(bx+Math.round(bw*i/6)+2,y3+2,Math.round(bw/6)-4,bh-4,C0.violet||'#6B3FA0');
    if(lit>=5&&g.once('lit'))g.blip(523,.2);}
  if(t>=5.2)g.text('24 in + ? in',Math.round(g.cx),Math.round(H*.10),{col:C0.gold});
  // Goldie walks up with a "?"
  if(t>5.6){var wp=g.ease(g.p(t,5.6,6.4)),ox=Math.round(g.lerp(-18,bx-26,wp));g.char('goldie',ox,H-26,wp<1?'right':'up',wp<1?Math.floor(t*8)%4:0);
    if(t>6.5&&!g.clean){var bp=g.back(g.p(t,6.5,6.75)),qy=H-46-Math.round(4*bp);if(g.once('q'))g.blip(660,.2);
      g.box(ox+3,qy,10,11,C0.white);g.text('?',ox+8,qy+2,{col:Math.floor(t*3)%2?C0.ink:'#C96512',shadow:false});}}
}

function marketSVG(){
  var w=api.state().world,n=['j1','j2','j3','j4','j5','j6'].filter(jobDone).length,beat=!!w.golem;
  var s='<svg viewBox="0 0 190 120" class="mk-svg" role="img" aria-label="The farmers\' market: Goldie\'s stand, the pumpkin patch, and the Brick Golem on the hill">';
  s+='<rect width="190" height="120" fill="'+(beat?'#BFE3F2':'#F6C98B')+'"/><path d="M0 70 Q60 40 120 58 T190 52 V120 H0Z" fill="#6CB85A"/><rect y="98" width="190" height="22" fill="#C9A57A"/>';
  if(!beat){s+='<rect x="128" y="22" width="18" height="16" fill="#9A3F28" stroke="#3B2417" stroke-width="2"/><rect x="122" y="38" width="30" height="20" fill="#B5543A" stroke="#3B2417" stroke-width="2"/><rect x="132" y="27" width="3" height="3" fill="#F5C518"/><rect x="139" y="27" width="3" height="3" fill="#F5C518"/>';}
  else{s+='<rect x="124" y="50" width="8" height="6" fill="#B5543A"/><rect x="134" y="52" width="8" height="5" fill="#C6643F"/><rect x="144" y="50" width="7" height="6" fill="#A84A33"/><rect x="130" y="40" width="10" height="12" fill="#FFF3DE" stroke="#3B2417" stroke-width="1.5"/>';}
  s+='<rect x="14" y="66" width="56" height="30" fill="#E07B39" stroke="#3B2417" stroke-width="2.5"/><path d="M10 68 L42 52 L74 68Z" fill="#F5C518" stroke="#3B2417" stroke-width="2.5"/>';
  for(var k=0;k<6;k++){var x=86+k*16;s+='<circle cx="'+x+'" cy="92" r="6" fill="'+(k<n?'#F28C28':'#C9A57A')+'" stroke="#3B2417" stroke-width="1.5"/>';}
  s+='<rect x="40" y="6" width="110" height="14" rx="3" fill="'+(beat?'#2DB87A':'#FFF3DE')+'" stroke="#3B2417" stroke-width="2"/><text x="95" y="16" font-family="DotGothic16,Nunito" font-size="8.5" text-anchor="middle" fill="'+(beat?'#fff':'#9A3F28')+'">'+(beat?'GOLEM BEATEN!':'FARMERS\' MARKET')+'</text>';
  return s+'</svg>';
}

/* answer boxes under a model (any number of units), with mistake hints; anyRate accepts any equal amount (the Think) */
function boxes(el,cfg){
  var st=ls(cfg.key,null)||{a:[],ok:false};
  el.innerHTML='<form class="bm-form mk-two"><span class="mk-two-q">'+cfg.q+'</span>'+cfg.units.map(function(u,k){return '<input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(cfg.aria[k])+'" value="'+esc(st.a[k]||'')+'"><span class="bm-u">'+esc(u)+'</span>';}).join('')+'<button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=el.querySelector('form'),ins=[].slice.call(f.querySelectorAll('input')),msg=el.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t;}
  function lock(t){ins.forEach(function(x){x.disabled=true;});say(t||cfg.doneText,'good');}
  if(st.ok)lock(st.t);
  f.onsubmit=function(e){e.preventDefault();var v=ins.map(function(x){return num(x.value);});st.a=ins.map(function(x){return x.value;});lsSet(cfg.key,st);
    if(v.some(function(x){return x==null;}))return say(ins.length>1?'Type a number in each box.':'Type a number first.','hint');
    var exact=v.every(function(x,k){return x===cfg.answer[k];});
    var same=cfg.anyRate&&v[0]*cfg.anyRate+v[1]===cfg.answer[0]*cfg.anyRate+cfg.answer[1]&&v[1]>=0;
    if(exact||same){st.ok=true;st.t=exact?cfg.doneText:(cfg.sameText||cfg.doneText);lsSet(cfg.key,st);OAOKit._snd.done();lock(st.t);if(cfg.onDone)cfg.onDone(el);return;}
    OAOKit._snd.no();
    var mk=(cfg.mistakes||[]).filter(function(z){return z.v.every(function(x,k){return x===v[k];});})[0];if(mk)return say(mk.text,'hint');
    say(cfg.hint,'hint');};
}
/* a mixed-number answer: whole box + a stacked fraction, checked together */
function mixBox(el,cfg){
  var st=ls(cfg.key,null)||{a:['','',''],ok:false};
  el.innerHTML='<form class="bm-form mk-two ok-fracform ok-mixform"><span class="mk-two-q">'+cfg.q+'</span><input type="text" inputmode="numeric" autocomplete="off" class="ok-mix-w" aria-label="'+esc(cfg.aria)+', whole number" value="'+esc(st.a[0])+'"><span class="ok-frac ok-frac-in"><input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(cfg.aria)+', top number" value="'+esc(st.a[1])+'"><i></i><input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(cfg.aria)+', bottom number" value="'+esc(st.a[2])+'"></span><span class="bm-u">'+esc(cfg.unit)+'</span><button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=el.querySelector('form'),ins=[].slice.call(f.querySelectorAll('input')),msg=el.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t;}
  function lock(){ins.forEach(function(x){x.disabled=true;});say(cfg.doneText,'good');}
  if(st.ok)lock();
  f.onsubmit=function(e){e.preventDefault();var v=ins.map(function(x){return num(x.value);});st.a=ins.map(function(x){return x.value;});lsSet(cfg.key,st);
    if(v.some(function(x){return x==null;}))return say('Type the whole number, the top number and the bottom number.','hint');
    var A=cfg.answer;if(v[0]===A[0]&&v[1]===A[1]&&v[2]===A[2]){st.ok=true;lsSet(cfg.key,st);OAOKit._snd.done();lock();if(cfg.onDone)cfg.onDone(el);return;}
    OAOKit._snd.no();
    var mk=(cfg.mistakes||[]).filter(function(z){return z.v.every(function(x,k){return x===v[k];});})[0];if(mk)return say(mk.text,'hint');
    if(v[0]===A[0]&&v[1]*A[2]===v[2]*A[1])return say(F(v[1],v[2])+' names the same amount, but it is not the simplest form. Make bigger equal parts.','hint');
    say(cfg.hint,'hint');};
}
function mount(m,cls){var d=document.createElement('div');d.className=cls||'';m.appendChild(d);return d;}
function both(keys,id,el){if(keys.every(function(k){var s=ls(k,null);return s&&(s.ok||s.fired||s.answered);}))setJob(id,el);}

/* Job 1 · Two Pieces (Warm-Up, known skills only): each piece of a mixed number on its own. Whole units × the factor
   (Grade 3 + 10.02–10.05) and a fraction of a unit (10.06). The pieces are NOT joined here: the Think does that, any way. */
function modelPieces(m){
  OAOKit.splitter(m,{key:'g4-4-10-07-sp-pieces',rounds:[
    {name:'Feet',mode:'split',rate:12,big:FT,small:IN,w:4,n:1,d:6,cuts:[2,3,4,6,12],
     text:'Goldie\'s bean pole tag says <b>'+MX(4,1,6)+' ft</b>. Add the <b>4</b> whole feet, then cut one more foot into <b>6</b> equal parts and take <b>1</b>. Then change each piece on its own.',
     cutHint:'The fraction part says sixths, so cut the last foot into 6 equal parts.',
     asks:[{q:'The whole feet: 4 ft =',units:['in'],answer:[48],mistakes:[{v:[4],text:'4 is the number of feet. Each blue bar is 12 inches: 4 × 12.'},{v:[16],text:'4 + 12 adds them. Each foot is 12 inches, and there are 4 of them: 4 × 12.'}],hint:'Count by 12 for each blue bar: 12, 24, 36, …',doneText:'4 ft = <b>48 in</b>. 4 × 12 = 48.'},
           {q:'The fraction part: '+F(1,6)+' ft =',units:['in'],answer:[2],mistakes:[{v:[6],text:'6 is how many equal parts. Read the inches written on the part you took.'},{v:[72],text:'6 × 12 = 72 is six whole feet. One sixth is one of 6 equal parts of a foot.'}],hint:'Read the inches on the part you took.',doneText:F(1,6)+' ft = <b>2 in</b>.'}],
     doneText:'The two pieces of '+MX(4,1,6)+' ft: 4 ft = 48 in, and '+F(1,6)+' ft = 2 in.'},
    {name:'Pounds',mode:'split',rate:16,big:LB,small:OZ,w:3,n:7,d:16,cuts:[2,4,8,16],
     text:'A sack of beans is <b>'+MX(3,7,16)+' lb</b>. Add the <b>3</b> whole pounds, then cut one more pound into <b>16</b> equal parts and take <b>7</b>. Change each piece.',
     cutHint:'Sixteenths: cut the last pound into 16 equal parts.',
     asks:[{q:'The whole pounds: 3 lb =',units:['oz'],answer:[48],mistakes:[{v:[3],text:'3 is the number of pounds. Each pound is 16 ounces.'},{v:[19],text:'3 + 16 adds them. Each pound is 16 ounces, and there are 3 of them: 3 × 16.'}],hint:'Count by 16 for each blue bar: 16, 32, …',doneText:'3 lb = <b>48 oz</b>.'},
           {q:'The fraction part: '+F(7,16)+' lb =',units:['oz'],answer:[7],mistakes:[{v:[16],text:'16 is how many equal parts. Each sixteenth of a pound is 1 ounce. How many did you take?'},{v:[112],text:'7 × 16 = 112 would be 7 whole pounds. Sixteenths of a pound are 1 ounce each.'}],hint:'Each sixteenth of a pound is 1 ounce. Count the parts you took.',doneText:F(7,16)+' lb = <b>7 oz</b>.'}],
     doneText:'The two pieces of '+MX(3,7,16)+' lb: 3 lb = 48 oz, and '+F(7,16)+' lb = 7 oz.'},
    {name:'Hours',mode:'split',rate:60,big:HR,small:MIN,w:1,n:3,d:10,cuts:[2,3,4,5,6,10,12],
     text:'Goldie\'s apple press runs for <b>'+MX(1,3,10)+' h</b>. Add the <b>1</b> whole hour, then cut one more hour into <b>10</b> equal parts and take <b>3</b>. Change each piece.',
     cutHint:'Tenths: cut the last hour into 10 equal parts.',
     asks:[{q:'The whole hour: 1 h =',units:['min'],answer:[60],mistakes:[{v:[1],text:'1 is the number of hours. An hour is 60 minutes.'},{v:[100],text:'An hour is 60 minutes, not 100.'}],hint:'One blue bar is one hour. How many minutes?',doneText:'1 h = <b>60 min</b>.'},
           {q:'The fraction part: '+F(3,10)+' h =',units:['min'],answer:[18],mistakes:[{v:[6],text:'6 minutes is one tenth, one part. You took 3 parts.'},{v:[30],text:'That treats an hour like 100 minutes. Each tenth of an hour is 6 minutes.'},{v:[180],text:'180 minutes is three whole hours. Each tenth of an hour is 6 minutes, and you took 3 of them.'}],hint:'3 parts of 6 minutes each.',doneText:F(3,10)+' h = <b>18 min</b>.'}],
     doneText:'The two pieces of '+MX(1,3,10)+' h: 1 h = 60 min, and '+F(3,10)+' h = 18 min.'}],
    onRound:function(i,root){earn('pc-'+i,2,0,root,'');},
    onDone:function(root){setJob('j1',root);}});
}
/* Warm-Up · Mental Math: one equal part of 12, 16 or 60 (10.06's skill), without halves, thirds or fourths */
function modelMental(m){
  OAOKit.mentalMath(m,{key:'g4-4-10-07-mm',name:'One equal part',
    how:'A fraction with 1 on top, like one fifth, means one of that many equal parts. Cut the number into equal groups, then take one group.',
    example:{q:'one fifth of 60',bond:{whole:60,parts:[12,48]},steps:['Fifths means 5 equal groups.','60 cut into 5 equal groups is 12 in each group.','So one fifth of 60 is 12.']},
    problems:[{q:'one sixth of 60',a:10,hint:'Sixths means 6 equal groups. 6 × ? = 60.'},
              {q:'one tenth of 60',a:6,hint:'Tenths means 10 equal groups. 10 × ? = 60.'},
              {q:'one twelfth of 60',a:5,hint:'Twelfths means 12 equal groups. 12 × ? = 60.'},
              {q:'one eighth of 16',a:2,hint:'Eighths means 8 equal groups. 8 × ? = 16.'}],
    onRight:function(i,el){earn('mm-'+i,1,0,el,'');},onDone:function(root){earn('mm-all',2,3,root,'Mental math done!');}});
}
/* Warm-Up · Think: the scarecrow is 2 5/6 ft. Any method, any equal form (2 ft 10 in, 1 ft 22 in, 0 ft 34 in). */
function modelThink(m){
  var a=mount(m,'mk-think-strip'),b=mount(m,'mk-think-ans');
  OAOKit.splitter(a,{key:'g4-4-10-07-sp-think',rounds:[
    {name:'Try it',mode:'split',free:true,rate:12,big:FT,small:IN,w:2,n:5,d:6,cuts:[2,3,4,6,12],
     text:'Try it your way. Add whole feet, cut one more foot any way you like and take parts, or work it out on paper.',doneText:'Now type your answer below.'}]});
  boxes(b,{key:'g4-4-10-07-think-ans',q:'The scarecrow, '+MX(2,5,6)+' ft, is',units:['ft','in'],aria:['the scarecrow\'s height, feet','the scarecrow\'s height, inches'],answer:[2,10],anyRate:12,
    mistakes:[{v:[2,5],text:'5 is the top number of the fraction, not inches. Five sixths of a foot: cut 12 inches into 6 equal parts and take 5.'},
              {v:[0,10],text:'10 inches is the fraction part. Don\'t forget the 2 whole feet!'},
              {v:[2,34],text:'34 inches already includes the 2 feet. If you write 2 ft, only the fraction part goes in the inches box.'},
              {v:[0,60],text:'5 × 12 = 60 is a good first step for the fraction part, but it still has to be cut into 6 equal parts. And the 2 whole feet need counting too.'}],
    hint:'The scarecrow is 2 whole feet and five sixths of one more foot. Try the strip: 2 whole feet, then cut one more foot into 6 equal parts and take 5.',
    doneText:'Yes! '+MX(2,5,6)+' ft = <b>2 ft 10 in</b>. On the Learn tab, the Math Crew writes it two ways. Did one match yours?',
    sameText:'Yes, that is the same height! The Crew will show two ways to write it on the Learn tab: in feet and inches, or all in inches.',
    onDone:function(el){earn('think',4,4,el,'You tried it first!');}});
}
/* Job 2 · Measure the Scarecrows (CREW_TAUGHT): 2 5/6 ft both ways (2 ft 10 in, 34 in), then 1 7/12 ft (1 ft 7 in, 19 in). IP 1's direction. */
function modelSplit(m){
  OAOKit.splitter(m,{key:'g4-4-10-07-sp-split',rounds:[
    {name:'Big scarecrow',mode:'split',rate:12,big:FT,small:IN,w:2,n:5,d:6,cuts:[2,3,4,6,12],
     text:'Split <b>'+MX(2,5,6)+' ft</b>: add the <b>2</b> whole feet, cut one more foot into <b>6</b> equal parts, take <b>5</b>. Then write it Atlas\'s way and Felix\'s way.',
     cutHint:'Sixths: cut the last foot into 6 equal parts.',
     asks:[{q:'Atlas\'s way, feet and inches: '+MX(2,5,6)+' ft =',units:['ft','in'],answer:[2,10],
            mistakes:[{v:[2,34],text:'34 inches already counts the 2 feet. For feet and inches, the 2 whole feet stay. Only the fraction part changes.'},{v:[2,5],text:'5 is the number of parts, not inches. Each part is 2 inches.'},{v:[0,10],text:'The 2 whole feet are still there! Write them in the feet box.'}],
            hint:'The whole feet stay. Change only the fraction part: 5 parts of 2 inches.',doneText:'Atlas: '+MX(2,5,6)+' ft = <b>2 ft 10 in</b>. Only the fraction changed.'},
           {q:'Felix\'s way, all inches: '+MX(2,5,6)+' ft =',units:['in'],answer:[34],
            mistakes:[{v:[10],text:'10 inches is only the fraction part. For all inches, change the 2 whole feet too: 24 inches.'},{v:[24],text:'24 inches is the 2 whole feet. Add the fraction part: 10 more inches.'},{v:[12],text:'2 + 10 mixes feet and inches. Change the 2 feet to inches first: 2 × 12.'}],
            hint:'Change both pieces: 2 ft = 24 in, and the fraction part is 10 in. Add them.',doneText:'Felix: 24 in + 10 in = <b>34 in</b>. Same height, one unit.'}],
     doneText:MX(2,5,6)+' ft = 2 ft 10 in = 34 in.'},
    {name:'Small scarecrow',mode:'split',rate:12,big:FT,small:IN,w:1,n:7,d:12,cuts:[2,3,4,6,12],
     text:'The small scarecrow\'s tag says <b>'+MX(1,7,12)+' ft</b>. Split it, then write it both ways.',
     cutHint:'Twelfths: cut the last foot into 12 equal parts.',
     asks:[{q:'Feet and inches: '+MX(1,7,12)+' ft =',units:['ft','in'],answer:[1,7],
            mistakes:[{v:[1,19],text:'19 inches already counts the whole foot. For feet and inches, only the fraction part changes.'},{v:[0,7],text:'The 1 whole foot is still there. Write it in the feet box.'},{v:[1,84],text:'7 × 12 = 84 would be 7 whole feet. Each twelfth of a foot is 1 inch.'}],
            hint:'The 1 whole foot stays. Seven twelfths of a foot: 7 parts of 1 inch.',doneText:MX(1,7,12)+' ft = <b>1 ft 7 in</b>.'},
           {q:'All inches: '+MX(1,7,12)+' ft =',units:['in'],answer:[19],
            mistakes:[{v:[7],text:'7 inches is only the fraction part. Change the whole foot too: 12 inches.'},{v:[12],text:'12 inches is the whole foot. Add the 7 inches.'},{v:[8],text:'1 + 7 mixes feet and inches. The whole foot is 12 inches.'}],
            hint:'12 inches for the whole foot, plus 7 inches.',doneText:'12 in + 7 in = <b>19 in</b>.'}],
     doneText:MX(1,7,12)+' ft = 1 ft 7 in = 19 in.'}],
    onRound:function(i,root){earn('spl-'+i,2,0,root,'');},
    onDone:function(root){setJob('j2',root);}});
}
/* Job 3 · Weigh and Time the Market (IP 2 and 3's direction): 2 7/8 lb = 46 oz, 1 2/5 h = 84 min, 2 1/10 h = 126 min */
function modelWeigh(m){
  OAOKit.splitter(m,{key:'g4-4-10-07-sp-weigh',rounds:[
    {name:'Pumpkin',mode:'split',rate:16,big:LB,small:OZ,w:2,n:7,d:8,cuts:[2,4,8,16],
     text:'Goldie\'s big pumpkin weighs <b>'+MX(2,7,8)+' lb</b>. The market scale shows ounces. Split it, then change everything to ounces.',
     cutHint:'Eighths: cut the last pound into 8 equal parts.',
     asks:[{q:MX(2,7,8)+' lb =',units:['oz'],answer:[46],
            mistakes:[{v:[14],text:'14 ounces is only the fraction part. Change the 2 whole pounds too: 32 ounces.'},{v:[32],text:'32 ounces is the 2 whole pounds. Add the fraction part: 7 parts of 2 ounces.'},{v:[39],text:'7 is the number of parts, not ounces. Each eighth of a pound is 2 ounces.'},{v:[9],text:'2 + 7 adds the pieces before changing them. Change each piece to ounces first.'}],
            hint:'2 pounds is 32 ounces. Seven eighths of a pound is 7 parts of 2 ounces. Add the two pieces.',doneText:'32 oz + 14 oz = <b>46 oz</b>.'}],
     doneText:MX(2,7,8)+' lb = 46 oz.'},
    {name:'Hay ride',mode:'split',rate:60,big:HR,small:MIN,w:1,n:2,d:5,cuts:[2,3,4,5,6,10,12],
     text:'The hay ride lasts <b>'+MX(1,2,5)+' h</b>. The sign shows minutes. Split it, then change everything to minutes.',
     cutHint:'Fifths: cut the last hour into 5 equal parts.',
     asks:[{q:MX(1,2,5)+' h =',units:['min'],answer:[84],
            mistakes:[{v:[24],text:'24 minutes is only the fraction part. The whole hour is 60 minutes too.'},{v:[60],text:'60 minutes is the whole hour. Add two fifths of an hour: 2 parts of 12 minutes.'},{v:[62],text:'2 is the number of parts, not minutes. Each fifth of an hour is 12 minutes.'},{v:[140],text:'That treats an hour like 100 minutes. An hour is 60 minutes, so each fifth is 12 minutes.'}],
            hint:'1 hour is 60 minutes. Two fifths of an hour is 2 parts of 12 minutes. Add the two pieces.',doneText:'60 min + 24 min = <b>84 min</b>.'}],
     doneText:MX(1,2,5)+' h = 84 min.'},
    {name:'Market day',mode:'split',rate:60,big:HR,small:MIN,w:2,n:1,d:10,cuts:[2,3,4,5,6,10,12],
     text:'The market stays open <b>'+MX(2,1,10)+' h</b> after the Golem is gone. How many minutes is that?',
     cutHint:'Tenths: cut the last hour into 10 equal parts.',
     asks:[{q:MX(2,1,10)+' h =',units:['min'],answer:[126],
            mistakes:[{v:[6],text:'6 minutes is only the fraction part. Change the 2 whole hours too: 120 minutes.'},{v:[120],text:'120 minutes is the 2 whole hours. Add one tenth of an hour: 6 minutes.'},{v:[121],text:'One tenth of an hour is 6 minutes, not 1. Cut 60 into 10 equal parts.'}],
            hint:'2 hours is 120 minutes. One tenth of an hour is 6 minutes. Add them.',doneText:'120 min + 6 min = <b>126 min</b>.'}],
     doneText:MX(2,1,10)+' h = 126 min.'}],
    onRound:function(i,root){earn('wgh-'+i,2,0,root,'');},
    onDone:function(root){setJob('j3',root);}});
}
/* Job 4 · Label the Crates (IP 4's direction): 26 in → 2 1/6 ft, 18 oz → 1 1/8 lb, 70 min → 1 1/6 h. Skip-count whole units, leftover over the factor, simplify. */
function modelCrates(m){
  OAOKit.splitter(m,{key:'g4-4-10-07-sp-crates',rounds:[
    {name:'Bean poles',mode:'group',rate:12,big:FT,small:IN,total:26,groups:[2,3,4,6],answer:{w:2,n:1,d:6},
     text:'A crate of bean poles is <b>26 inches</b> long. Mark off whole feet. Write the whole feet and the leftover over 12. Then simplify.',
     rawQ:'Whole feet, then the leftover over 12: 26 in =',simpQ:'In simplest form, 26 in =',
     rawMistakes:[{w:2,n:2,d:26,text:'The bottom number is one whole foot in inches: 12, not 26. The leftover is part of ONE more foot.'},{w:0,n:26,d:12,text:'That is right as a fraction, but you marked off 2 whole feet. Write them as the whole number.'}],
     simpMistakes:[{w:2,n:2,d:12,text:'That is the same fraction. Tap a Parts button so the leftover fills whole parts.'}],
     doneText:'26 in = '+MX(2,2,12)+' ft = '+MX(2,1,6)+' ft.'},
    {name:'Apples',mode:'group',rate:16,big:LB,small:OZ,total:18,groups:[2,4,8],answer:{w:1,n:1,d:8},
     text:'A bag of apples weighs <b>18 ounces</b>. Mark off whole pounds, write the leftover over 16, then simplify.',
     rawQ:'Whole pounds, then the leftover over 16: 18 oz =',simpQ:'In simplest form, 18 oz =',
     rawMistakes:[{w:1,n:2,d:18,text:'The bottom number is one whole pound in ounces: 16.'}],
     doneText:'18 oz = '+MX(1,2,16)+' lb = '+MX(1,1,8)+' lb.'},
    {name:'Pie baking',mode:'group',rate:60,big:HR,small:MIN,total:70,groups:[2,5,10,15],answer:{w:1,n:1,d:6},
     text:'The pies bake for <b>70 minutes</b>. Mark off whole hours, write the leftover over 60, then simplify.',
     rawQ:'Whole hours, then the leftover over 60: 70 min =',simpQ:'In simplest form, 70 min =',
     rawMistakes:[{w:1,n:10,d:100,text:'An hour is 60 minutes, not 100.'},{w:1,n:10,d:70,text:'The bottom number is one whole hour in minutes: 60.'}],
     doneText:'70 min = '+MX(1,10,60)+' h = '+MX(1,1,6)+' h.'}],
    onRound:function(i,root){earn('crt-'+i,2,0,root,'');},
    onDone:function(root){setJob('j4',root);}});
}
/* Job 5 · Two Ways to Write It (IP 5): 5 ft 2 in → 5 1/6 ft, 3 lb 14 oz → 3 7/8 lb, 1 7/12 h → 1 h 35 min. Keep the whole units; change the other piece. */
function modelTwoway(m){
  OAOKit.splitter(m,{key:'g4-4-10-07-sp-twoway',rounds:[
    {name:'Rope',mode:'group',rate:12,big:FT,small:IN,startWholes:5,total:2,groups:[2,3,4,6],answer:{w:5,n:1,d:6},
     text:'Goldie\'s rope is <b>5 ft 2 in</b>. The 5 whole feet are already on the bars. Write the 2 inches over 12, then simplify.',
     rawQ:'5 ft 2 in =',simpQ:'In simplest form, 5 ft 2 in =',
     rawMistakes:[{w:5,n:2,d:1,text:'2 inches over 1 foot mixes two units. Write the whole foot in inches: 12.'},{w:0,n:62,d:12,text:'That is the same length, but the 5 whole feet can stay whole. Only the 2 inches change.'}],
     doneText:'5 ft 2 in = '+MX(5,2,12)+' ft = '+MX(5,1,6)+' ft.'},
    {name:'Honey',mode:'group',rate:16,big:LB,small:OZ,startWholes:3,total:14,groups:[2,4,8],answer:{w:3,n:7,d:8},
     text:'A jar of honey weighs <b>3 lb 14 oz</b>. Keep the 3 whole pounds. Write the 14 ounces over 16, then simplify.',
     rawQ:'3 lb 14 oz =',simpQ:'In simplest form, 3 lb 14 oz =',
     rawMistakes:[{w:3,n:14,d:1,text:'14 ounces over 1 pound mixes two units. A pound is 16 ounces.'},{w:3,n:14,d:100,text:'A pound is 16 ounces, not 100.'}],
     doneText:'3 lb 14 oz = '+MX(3,14,16)+' lb = '+MX(3,7,8)+' lb.'},
    {name:'Puppet show',mode:'split',rate:60,big:HR,small:MIN,w:1,n:7,d:12,cuts:[2,3,4,5,6,10,12],
     text:'The puppet show runs <b>'+MX(1,7,12)+' h</b>. Write it in hours and minutes: keep the whole hour, change only the fraction part.',
     cutHint:'Twelfths: cut the last hour into 12 equal parts.',
     asks:[{q:MX(1,7,12)+' h =',units:['h','min'],answer:[1,35],
            mistakes:[{v:[1,95],text:'95 minutes already counts the whole hour. For hours and minutes, the 1 hour stays. Only the fraction part changes.'},{v:[1,7],text:'7 is the number of parts. Each twelfth of an hour is 5 minutes.'},{v:[0,35],text:'The 1 whole hour is still there. Write it in the hours box.'}],
            hint:'The 1 hour stays. Seven twelfths of an hour is 7 parts of 5 minutes.',doneText:MX(1,7,12)+' h = <b>1 h 35 min</b>.'}],
     doneText:MX(1,7,12)+' h = 1 h 35 min.'}],
    onRound:function(i,root){earn('two-'+i,2,0,root,'');},
    onDone:function(root){setJob('j5',root);}});
}
/* Job 6 (Show What You Know) · Goldie's Pumpkin Order (IP 6's shape): 1 7/8 lb + 3 lb 4 oz. Change to lb oz, add, regroup, simplify. */
function modelOrder(m){
  var a=mount(m),b=mount(m),c=mount(m);
  var K=['g4-4-10-07-order-1','g4-4-10-07-bm-order','g4-4-10-07-order-3'];
  function gate(){var s1=ls(K[0],null),s2=ls(K[1],null);b.style.display=s1&&s1.ok?'':'none';c.style.display=s2&&s2.answered?'':'none';}
  boxes(a,{key:K[0],q:'Step 1. Change the first pumpkin to pounds and ounces: '+MX(1,7,8)+' lb =',units:['lb','oz'],aria:['the first pumpkin, pounds','the first pumpkin, ounces'],answer:[1,14],
    mistakes:[{v:[1,7],text:'7 is the top number of the fraction, not ounces. Seven eighths of a pound: cut 16 ounces into 8 equal parts of 2 ounces and take 7.'},{v:[1,30],text:'30 ounces already counts the whole pound. For pounds and ounces, the 1 pound stays.'},{v:[0,14],text:'The 1 whole pound is still there.'}],
    hint:'The 1 whole pound stays. Change only the fraction part: seven eighths of 16 ounces.',doneText:MX(1,7,8)+' lb = <b>1 lb 14 oz</b>. Now put both pumpkins on the bar.',
    onDone:function(el){gate();both(K.slice(1),'j6',el);}});
  OAOKit.barModel(b,{key:K[1],kind:'part-whole',units:['lb','oz'],rate:16,todo:[],
    story:['Goldie sells two pumpkins to the baker. ',{t:'The first weighs 1 and seven eighths pounds.',put:'p0',label:'1 lb 14 oz'},' ',{t:'The second weighs 3 lb 4 oz.',put:'p1',label:'3 lb 4 oz'},' How much do they weigh together?'],
    whole:{name:'both pumpkins',unknown:true},partsName:'pumpkins',
    parts:[{id:'p0',value:30,name:'first'},{id:'p1',value:52,name:'second'}],
    question:'How much do the two pumpkins weigh together?',answer:[5,2],
    mistakes:[{value:75,text:'4 lb 11 oz adds the 7 from seven eighths as if it were 7 ounces. Use 1 lb 14 oz from Step 1.'},
              {value:66,text:'You traded 16 ounces for a pound. Now add that new pound to the 4 pounds: 5 pounds.'},
              {value:88,text:'A pound is 16 ounces, not 10. Trade 16 of the 18 ounces for 1 pound: 1 lb 2 oz.'}],
    hint:'Add the pounds: 1 lb + 3 lb. Add the ounces: 14 oz + 4 oz. If the ounces reach 16, trade 16 oz for 1 lb.',
    sym:'1 lb 14 oz + 3 lb 4 oz = 4 lb 18 oz = 5 lb 2 oz',
    doneText:'Yes! 4 lb 18 oz = 5 lb 2 oz. Last step: write it as a mixed number.',
    onDone:function(root){gate();both([K[0],K[2]],'j6',root);}});
  mixBox(c,{key:K[2],q:'Step 3. 5 lb 2 oz as a mixed number, in simplest form:',unit:'lb',aria:'5 pounds 2 ounces as a mixed number of pounds',answer:[5,1,8],
    mistakes:[{v:[5,2,16],text:MX(5,2,16)+' is right, but not in simplest form. Parts of 2 ounces: a pound is 8 of them, and 2 ounces is 1.'},{v:[5,2,1],text:'2 ounces over 1 pound mixes two units. A pound is 16 ounces.'},{v:[5,1,2],text:'One half would be 8 out of 16 parts. 2 ounces is much less than that: 2 out of 16.'}],
    hint:'Keep the 5 whole pounds. Write the 2 ounces over 16, then simplify.',doneText:'Both pumpkins weigh 5 lb 2 oz = '+MX(5,2,16)+' lb = <b>'+MX(5,1,8)+' lb</b>.',
    onDone:function(el){both(K.slice(0,2),'j6',el);}});
  gate();
}
/* Bonus · the Triangle of Equals (DM Brain Works idea, new numbers): each side names one amount three ways */
function modelBonus(m){
  var st=ls('g4-4-10-07-bonus',null)||{a:['','',''],ok:false};
  var S=[{side:'Feet side',cards:[MX(1,11,12)+' ft','1 ft 11 in'],u:'in',a:23},{side:'Pounds side',cards:[MX(2,9,16)+' lb','2 lb 9 oz'],u:'oz',a:41},{side:'Hours side',cards:[MX(1,9,10)+' h','1 h 54 min'],u:'min',a:114}];
  m.innerHTML='<details class="ch-card"'+(st.ok?' open':'')+'><summary>★ Bonus quest: the Triangle of Equals <span class="ch-opt">optional</span></summary><div class="ch-body">'
    +'<p>Goldie paints a triangle sign. Each side holds three cards that name the <strong>same amount</strong>. One card on each side is blank. What number goes on each blank card?</p>'
    +'<svg viewBox="0 0 420 210" class="mk-svg" role="img" aria-label="A triangle with three sides. Feet side: 1 and eleven twelfths feet, 1 foot 11 inches, and a blank inches card. Pounds side: 2 and nine sixteenths pounds, 2 pounds 9 ounces, and a blank ounces card. Hours side: 1 and nine tenths hours, 1 hour 54 minutes, and a blank minutes card."><path d="M210 18 L396 192 L24 192Z" fill="#FFF3DE" stroke="#3B2417" stroke-width="4"/><text x="88" y="98" font-family="Nunito" font-weight="900" font-size="15" fill="#1F8FB4" transform="rotate(-43 88 98)">feet side</text><text x="306" y="92" font-family="Nunito" font-weight="900" font-size="15" fill="#C96512" transform="rotate(43 306 92)">pounds side</text><text x="210" y="186" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="15" fill="#6B3FA0">hours side</text></svg>'
    +'<form class="bm-form ch-tri">'+S.map(function(x,k){return '<div class="mk-step"><span class="mk-two-q"><b>'+x.side+':</b> '+x.cards[0]+' = '+x.cards[1]+' =</span><input type="text" inputmode="numeric" autocomplete="off" aria-label="'+x.side+', the blank card in '+x.u+'" value="'+esc(st.a[k])+'"><span class="bm-u">'+x.u+'</span></div>';}).join('')
    +'<button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div></div></details>';
  var f=m.querySelector('form'),ins=[].slice.call(f.querySelectorAll('input')),msg=m.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t;}
  function lock(){ins.forEach(function(x){x.disabled=true;});say('All three sides match! 23 in, 41 oz and 114 min. Each blank card is the whole amount in the small unit: change the whole units, then add the rest.','good');}
  if(st.ok)lock();
  f.onsubmit=function(e){e.preventDefault();var v=ins.map(function(x){return num(x.value);});st.a=ins.map(function(x){return x.value;});lsSet('g4-4-10-07-bonus',st);
    var bad=S.map(function(x,k){return v[k]===x.a;}).indexOf(false);
    if(bad<0){st.ok=true;lsSet('g4-4-10-07-bonus',st);OAOKit._snd.done();lock();earn('bonus',8,8,m,'Bonus quest!');return;}
    OAOKit._snd.no();var x=S[bad];
    say(v[bad]==null?'Fill in the '+x.side.toLowerCase()+' card.':'Check the '+x.side.toLowerCase()+'. The middle card already shows the two pieces: change the whole units to '+x.u+', then add the rest.','hint');};
}
function bind(f){return function(m,a){api=a;return f(m);};}
return {
  id:'4.10.07', key:'g4-4-10-07', title:'Fractions and Measurement, Part 2', unit:10, level:'Metric Market', standard:'MA.4.M.1.2', boss:'golem',
  problem:{title:'Rebuild the Re-Stamper',text:'The Brick Golem stands on the hill above the farmers\' market, and every brick has one of the Smudge\'s wrong stamps. Goldie\'s old Re-Stamper can fix them, but its pieces are lost. Each job below uses today\'s math. Finish all six to face the Golem.',jobWord:'Market job',jobsTitle:'Market jobs'},
  jobs:[
    {id:'j1',t:'Change the two pieces',w:'Warm-Up · Two Pieces',go:'#mk-pieces',tab:'warmup',r:'-2deg',coins:5},
    {id:'j2',t:'Measure the scarecrows',w:'Learn · Measure the Scarecrows',go:'#mk-split',tab:'learn',r:'1.5deg',coins:8},
    {id:'j3',t:'Weigh and time the market',w:'Learn · Weigh and Time the Market',go:'#mk-weigh',tab:'learn',r:'-1deg',coins:8},
    {id:'j4',t:'Label the crates',w:'Learn · Label the Crates',go:'#mk-crates',tab:'learn',r:'1deg',coins:8},
    {id:'j5',t:'Write it two ways',w:'Learn · Two Ways to Write It',go:'#mk-twoway',tab:'learn',r:'2deg',coins:8},
    {id:'j6',t:'Fill the pumpkin order',w:'Show What You Know',go:'#mk-order',tab:'assignment',r:'-1.5deg',coins:10}],
  scene:function(a){api=a;return marketSVG();},
  hints:[
    {sel:'#mk-think .callout-think',rungs:['The scarecrow is 2 whole feet and five sixths of ONE more foot. A foot is 12 inches.','Change each piece: the whole feet, then the fraction of a foot. Then decide how to write it.','Here are different numbers: 5 and seven twelfths feet is 5 whole feet and seven twelfths of a foot. Seven twelfths of 12 inches is 7 inches, so it is 5 feet 7 inches.']},
    {sel:'#tab-assignment .q-block',i:0,inside:true,rungs:['Split each mixed number into whole units and a fraction of a unit.','Change both pieces to the small unit, then add them.','Here are different numbers: 2 and seven twelfths hours. 2 hours is 120 minutes. One twelfth of an hour is 5 minutes, so seven twelfths is 35. 120 + 35 = 155 minutes.']},
    {sel:'#tab-assignment .q-block',i:1,inside:true,rungs:['Count whole units first, by skip-counting: 12, 24, 36… or 16, 32, 48… or 60, 120, 180…','The leftover goes over the small units in ONE whole unit. Then simplify.','Here are different numbers: 39 ounces. 2 pounds is 32 ounces, and 7 are left: 2 and seven sixteenths pounds. No bigger part fits 7 and 16, so it is already simplest.']},
    {sel:'#tab-assignment .q-block',i:2,inside:true,rungs:['Keep the whole units. Change only the other piece.','Small units to a fraction: put them over the small units in one big unit (12, 16 or 60) and simplify. A fraction to small units: cut the whole into equal parts.','Here are different numbers: 4 h 24 min. Keep 4 hours. 24 minutes is 24 over 60, which is two fifths. So 4 and two fifths hours.']},
    {sel:'#mk-pieces .activity-body > .mk-todo',rungs:['Tap + 1 whole until the blue bars match the whole number. Then cut the last bar.','The whole units: multiply by 12, 16 or 60. The fraction part: read one part, then take as many as the top number.','Here are different numbers: 2 and one sixth feet. 2 feet is 24 inches, and one sixth of a foot is 2 inches.']},
    {sel:'#mk-split .activity-body > .mk-todo',rungs:['First ask: what needs changing, the fraction or the whole number?','For feet and inches, only the fraction part changes. For all inches, change both pieces and add.','Here are different numbers: 3 and seven twelfths feet. Feet and inches: 3 ft 7 in. All inches: 36 + 7 = 43 inches.']},
    {sel:'#mk-weigh .activity-body > .mk-todo',rungs:['Split it on the strip: whole units, then one more unit cut into equal parts.','Change the whole units (times 12, 16 or 60). Change the fraction part. Then add the two pieces.','Here are different numbers: 2 and five sixteenths pounds. 2 pounds is 32 ounces, plus 5 ounces: 37 ounces.']},
    {sel:'#mk-crates .activity-body > .mk-todo',rungs:['Tap Mark off until fewer than one whole unit is left on the tape.','The whole number is the number of blue bars. The leftover goes over 12, 16 or 60. Then try the Parts buttons.','Here are different numbers: 39 ounces. Mark off 2 pounds (32 ounces). 7 ounces are left: 2 and seven sixteenths pounds.']},
    {sel:'#mk-twoway .activity-body > .mk-todo',rungs:['Keep the whole units. Change only the other piece.','Small units to a fraction: over the small units in one big unit, then simplify. A fraction to small units: cut into equal parts and take some.','Here are different numbers: 4 h 24 min is 4 and twenty-four sixtieths hours, which simplifies to 4 and two fifths hours.']},
    {sel:'#mk-order .activity-body > .mk-todo',rungs:['Change the mixed number to pounds and ounces first. Only the fraction part changes.','Add pounds to pounds and ounces to ounces. If the ounces reach 16, trade 16 ounces for 1 pound.','Here are different numbers: 1 lb 15 oz + 1 lb 3 oz = 2 lb 18 oz = 3 lb 2 oz, which is 3 and one eighth pounds.']}],
  writing:{
    'journal-notice':{min:6,chips:[{label:'I notice',words:['notice','see','whole','2','two','feet','foot','fraction','sixths','five','5','6','mixed','part','parts','inches','more than','bigger']},{label:'I wonder',words:['wonder','how','which','why','?','if','what']}]},
    'journal-compare':{min:12,chips:[{label:'a Crew member\'s way',words:['atlas','felix','hazel','cora','fraction','all inches','inches','feet and inches','both','change','picture','bars']},{label:'what you would do for 5 and one sixth feet',words:['5','five','60','62','2','sixth','one sixth','feet','ft','inches','in','5 ft 2 in']},{label:'why',words:['because','so','easier','faster','since','simpler','makes sense','quick','like','better']}]},
    'journal-think':{min:10,chips:[{label:'the height',words:['34','2 ft 10 in','2 feet 10 inches','10','ten','thirty-four']},{label:'how you found it',words:['whole','feet','foot','12','twelve','24','cut','parts','part','6','six','5','five','2','multiply','times','added','add','plus','strip','bars','picture']}]},
    'journal-big':{min:12,chips:[{label:'split into whole units and a fraction',words:['split','whole','wholes','fraction','part','pieces','two pieces','change']},{label:'an example of your own',words:['ft','in','lb','oz','h','min','foot','feet','inches','inch','pound','pounds','ounces','hour','hours','minutes','=','equals','is']},{label:'going backward',words:['backward','back','leftover','left over','over','simplest','simplify','count','skip','mark off']}]}},
  bigIdea:'To change a mixed number of a unit, split it into whole units and a fraction of a unit. For two units, like feet and inches, keep the whole units and change only the fraction part. For all small units, change both pieces and add them. To go backward, count the whole units that fit, put the leftover over the small units in one whole unit, and simplify.',
  words:[{w:'mixed number',d:'a whole number and a fraction together, like 2 and five sixths'},{w:'whole units',d:'full units, like 2 whole feet'},{w:'leftover',d:'the small units left when no more whole units fit'},{w:'regroup',d:'trade small units for one big unit, like 16 ounces for 1 pound'}],
  intendedWrong:['2 ft 34 in','4 lb 11 oz','4 m 6 cm = 46 cm','2 kg 300 g = 230 g','3 gal 1 qt = 31 qt','3 ft 10 in + 1 ft 6 in = 4 ft 16 in','4 h 5 min = 405 min','seven tenths of an hour = 7 min','3 and five twelfths ft = 3 ft 41 in','4 and three sixteenths lb = 7 oz','4 ft 58 in'],
  intro:{card:false,len:7.4,
    alt:'Dawn over the farmers\' market, with a dark Golem shape on the hill. Two blue bars drop in, each one foot, and the counter climbs to 24 inches. A third bar is snipped into 6 equal parts and 5 of them light up. The counter shows 24 inches plus a question mark. Goldie walks up and wonders how tall that is.',
    scene:introScene},
  models:{pieces:bind(modelPieces),mental:bind(modelMental),think:bind(modelThink),split:bind(modelSplit),weigh:bind(modelWeigh),crates:bind(modelCrates),twoway:bind(modelTwoway),order:bind(modelOrder),bonus:bind(modelBonus)}
};
})();
