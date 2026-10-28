/* ═══ PQ_DATA · Lesson 4.10.02 Customary Units of Length · Level 10 "Metric Market" · the Foot Bridge (lesson 2 of 7) ═══
   Everything lesson-specific lives here. The engine (pq-engine.js) and art kit (pq-art.js) hold no lesson content. */
var PQ_DATA = (function(){
var TS=16;

/* the Foot Bridge: the west bank (Rosa's rope shed, Gus's posts, the Crew), the river with the footbridge, the east bank and Eastside's gate */
function mkMap(){
  var W=32,H=22,g=[],i,j;
  for(j=0;j<H;j++){g.push([]);for(i=0;i<W;i++)g[j].push((j===0||j===H-1||i===0||i===W-1)?'T':'.');}
  for(j=1;j<H-1;j++)for(i=14;i<=18;i++)g[j][i]='w';
  for(i=1;i<=13;i++)g[10][i]='p';
  for(i=14;i<=18;i++)g[10][i]='b';
  for(i=19;i<=30;i++)g[10][i]='p';
  g[8][4]='p';g[9][4]='p';
  for(j=1;j<H-1;j++)if(j!==10)g[j][27]='T';
  for(j=7;j<=13;j++)for(i=28;i<=30;i++)g[j][i]='s';
  for(j=11;j<=17;j++)g[j][9]='p';
  [[6,1],[10,3],[2,19],[12,19],[21,3],[24,17],[20,14],[25,5]].forEach(function(p){g[p[1]][p[0]]='f';});
  [[1,1],[2,1],[1,2],[29,1],[30,1],[28,1],[29,2],[30,2],[30,3],[28,20],[29,20],[30,20],[29,19],[30,19],[30,18],[1,20],[2,20]].forEach(function(p){g[p[1]][p[0]]='T';});
  return g.map(function(r){return r.join('');});
}

var D = {
  key:'g4-4-10-02-pq',
  levelLabel:'LV 10 · FOOT BRIDGE',
  map:mkMap(),
  speakers:{
    sys:{name:'',color:'#3B2417',pitch:440,noface:true},
    me:{name:'You',color:'#6B3FA0',pitch:600},
    opti:{name:'OPTI',color:'#0E1C42',pitch:760},
    atlas:{name:'ATLAS',color:'#1F8FB4',pitch:420},
    felix:{name:'FELIX',color:'#1E8C5A',pitch:500},
    hazel:{name:'HAZEL',color:'#B08A0A',pitch:680},
    cora:{name:'CORA',color:'#C2601F',pitch:600},
    gus:{name:'GUS',color:'#5B4636',pitch:300},
    rosa:{name:'ROSA',color:'#B0476A',pitch:660},
    penny:{name:'PENNY',color:'#8E4FBF',pitch:620},
    smudge:{name:'THE SMUDGE',color:'#55505E',pitch:220},
    sign:{name:'SIGN',color:'#8A5A33',pitch:480,noface:true},
    'item-rope':{name:'',color:'#3B2417',pitch:520,icon:'rope'}
  },
  npcs:[
    {id:'opti',owl:true,x:2,y:11,fixed:true},
    {id:'atlas',x:8,y:13,dir:'right',look:{skin:['#EBC09A','#CF9A6F'],hair:['#5A3A22','#3E2716'],style:'short',shirt:'#55C8E8',acc:'hat',acc2:'#D8B575'}},
    {id:'felix',x:10,y:13,dir:'left',look:{skin:['#9C6640','#7C4C2C'],hair:['#1E1E28','#0E0E16'],style:'spiky',shirt:'#2DB87A',acc:'goggles'}},
    {id:'hazel',x:8,y:16,dir:'right',look:{skin:['#F6D3B3','#E2AE88'],hair:['#C4512E','#963A1E'],style:'long',shirt:'#F5C518',acc:'beret',acc2:'#C93A4A'}},
    {id:'cora',x:10,y:16,dir:'left',look:{skin:['#C98E5E','#A86E42'],hair:['#2A1D18','#160E0A'],style:'puffs',shirt:'#E07B39',acc:'glasses',frame:'#5B2E10'}},
    {id:'rosa',x:6,y:8,look:{skin:['#C98E5E','#A86E42'],hair:['#3B2A20','#24180F'],style:'curly',shirt:'#D96A8E',acc:'apron',acc2:'#F7E7C8'}},
    {id:'gus',x:12,y:9,look:{skin:['#EBC09A','#CF9A6F'],hair:['#B9B9C4','#8E8E9C'],style:'short',shirt:'#5B7A4A',acc:'hat',acc2:'#7A5230'}},
    {id:'penny',x:4,y:15,dir:'left',look:{skin:['#EBC09A','#CF9A6F'],hair:['#8E6BD0','#6A48A8'],style:'puffs',shirt:'#6B3FA0'}},
    {id:'smudge',smudge:true,x:16,y:10,show:function(S){var q=S.q.chase||{};return !!(q.started&&(!S.world.east||q.fleeing));}}
  ],
  items:[
    {id:'scrapA',kind:'rope',x:3,y:13,len:10},
    {id:'scrapB',kind:'rope',x:7,y:3,len:12},
    {id:'scrapC',kind:'rope',x:12,y:17,len:15},
    {id:'scrapD',kind:'rope',x:5,y:19,len:12}
  ],
  labels:{opti:'Opti',atlas:'Atlas',felix:'Felix',hazel:'Hazel',cora:'Cora',rosa:'Rosa',gus:'Gus',penny:'Penny',smudge:'The Smudge',
    binShort:'SHORT bin',binFoot:'1 FOOT bin',binLong:'LONG bin',postN:'north post',postS:'south post',item:'Rope scrap'},
  objects:[],
  quests:{},
  transcripts:{}
};
var BINS={binShort:'short',binFoot:'foot',binLong:'long'};
function kindOf(len){return len<12?'short':len===12?'foot':'long';}
D.items.forEach(function(it){
  it.show=function(S){var q=S.q.sort;return !!(q&&q.met&&!(q.sorted||{})[it.id]&&q.hold!==it.id);};
  it.take=function(api){var q=api.S.q.sort;
    if(q.hold){api.snd.bump();api.say([{who:'sys',t:'Your hands are full. Put the scrap you are holding in a bin first.'}]);return;}
    q.hold=it.id;api.save();api.snd.item();
    api.say([{who:'item-rope',t:'You picked up a rope scrap. Its tag says '+it.len+' in.'},{who:'sys',t:'Take it to Rosa\'s bins: SHORT, 1 FOOT or LONG.'}],function(a){a.goal(D.quests.sort.goal(a.S));});};
});
function scrap(id){return D.items.filter(function(z){return z.id===id;})[0];}

/* ───────── objects (art + footprints) ───────── */
function O(o){D.objects.push({build:function(A){var r=o.make(A);r.id=o.id;r.solid=o.solid;r.hidden=o.hidden;r.mx=o.mx;r.my=o.my;return r;}});}
function W(){return PQ._state().world;}
O({id:'shed',mx:4*TS,my:5*TS,make:function(A){return {spr:A.shed(),dx:2*TS,dy:8*TS-52,base:7*TS+15,fp:[[2,5],[3,5],[4,5],[5,5],[2,6],[3,6],[4,6],[5,6],[2,7],[3,7],[4,7],[5,7]]};}});
// Rosa's three bins: a crate with a flag showing a short rope, a 1-foot rope with a tick, or a long rope
[['binShort',8,5,'#E04F4F'],['binFoot',10,5,'#F5C518'],['binLong',12,5,'#2DB87A']].forEach(function(b,k){
  O({id:b[0],mx:b[1]*TS+8,my:b[2]*TS-8,make:function(A){var c=A.cv(16,30),x=c.getContext('2d');x.drawImage(A.crate(),0,14);
    A.R(x,A.P.ol,2,0,1,16);A.R(x,A.P.ol,3,0,12,9);A.R(x,b[3],4,1,10,7);var L=[4,7,10][k];A.R(x,'#3B2417',5,4,L,1);if(k===1){A.R(x,'#3B2417',5,2,1,3);A.R(x,'#3B2417',5+L-1,2,1,3);}
    return {spr:c,dx:b[1]*TS,dy:b[2]*TS-14,base:b[2]*TS+15,fp:[[b[1],b[2]]]};}});});
// Gus's two rope posts at the west end of the bridge (the rope rail ties between them and the far side)
function post(A,tag){var c=A.cv(16,26),x=c.getContext('2d');A.ell(x,8,24,4,1,'rgba(0,0,0,.22)');A.R(x,A.P.ol,5,2,6,22);A.R(x,'#A97A47',6,3,4,20);A.R(x,'#DDB27C',6,3,1,20);A.R(x,A.P.ol,4,0,8,3);A.R(x,'#C99A63',5,1,6,1);
  if(tag){A.R(x,A.P.ol,2,8,12,7);A.R(x,'#D7D3DD',3,9,10,5);A.R(x,'#8F8A98',4,10,8,1);A.R(x,'#8F8A98',4,12,6,1);}return c;}
O({id:'postN',mx:13*TS+8,my:9*TS-6,make:function(A){var a=post(A,true),b=post(A,false);return {spr:null,dx:13*TS,dy:9*TS-10,base:9*TS+15,fp:[[13,9]],anim:function(x,X,Y){x.drawImage(W().tagFixed?b:a,Math.round(X),Math.round(Y));}};}});
O({id:'postS',mx:13*TS+8,my:11*TS-6,make:function(A){var a=post(A,false);return {spr:a,dx:13*TS,dy:11*TS-10,base:11*TS+15,fp:[[13,11]]};}});
[[19,9],[19,11]].forEach(function(p){O({make:function(A){return {spr:post(A,false),dx:p[0]*TS,dy:p[1]*TS-10,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});
// the rope rail: snapped and dangling until the build quest (or the splice job in clean mode), then tight on both sides
function rail(x,X0,X1,Y,t,ok){if(ok){for(var px=X0;px<X1;px++){var sag=Math.round(Math.sin((px-X0)/(X1-X0)*Math.PI)*3);x.fillStyle='#3B2417';x.fillRect(px,Y+sag,1,3);x.fillStyle='#D9B27A';x.fillRect(px,Y+sag+1,1,1);}}
  else{var mid=X0+Math.round((X1-X0)*.45);for(var p2=X0;p2<mid;p2++){var d=Math.round((p2-X0)/(mid-X0)*9);x.fillStyle='#3B2417';x.fillRect(p2,Y+d,1,3);x.fillStyle='#D9B27A';x.fillRect(p2,Y+d+1,1,1);}
    var sw=Math.round(Math.sin(t*2)*1.5);for(var p3=mid+12;p3<X1;p3++){var d2=Math.round((X1-p3)/(X1-mid-12)*8);x.fillStyle='#3B2417';x.fillRect(p3+sw,Y+d2,1,3);x.fillStyle='#D9B27A';x.fillRect(p3+sw,Y+d2+1,1,1);}}}
O({make:function(A){return {spr:null,dx:13*TS+8,dy:10*TS-6,base:10*TS-1,fp:[],anim:function(x,X,Y,t){rail(x,Math.round(X),Math.round(X)+6*TS,Math.round(Y),t,!!W().rail);}};}});
O({make:function(A){return {spr:null,dx:13*TS+8,dy:11*TS-8,base:11*TS+2,fp:[],anim:function(x,X,Y,t){rail(x,Math.round(X),Math.round(X)+6*TS,Math.round(Y),t+1,!!W().rail);}};}});
O({id:'gate',hidden:function(){return !!W().rail;},make:function(A){return {spr:A.barrier(),dx:14*TS,dy:10*TS,base:10*TS+15,fp:[[14,10]]};}});
O({id:'heightPost',mx:7*TS+8,my:9*TS-14,make:function(A){var c=A.cv(12,40),x=c.getContext('2d');A.ell(x,6,38,4,1,'rgba(0,0,0,.22)');A.R(x,A.P.ol,3,0,7,38);A.R(x,'#F5E6C8',4,1,5,36);
  for(var k=0;k<36;k+=2)A.R(x,'#3B2417',4,1+k,k%6===0?4:2,1);A.R(x,'#E04F4F',4,1,5,1);return {spr:c,dx:7*TS+2,dy:9*TS-24,base:9*TS+15,fp:[[7,9]]};}});
O({id:'westSign',make:function(A){return {spr:A.signpost('wood'),dx:1*TS,dy:9*TS-6,base:9*TS+15,fp:[[1,9]]};}});
O({id:'eastSign',make:function(A){return {spr:A.signpost('wood'),dx:25*TS,dy:9*TS-6,base:9*TS+15,fp:[[25,9]]};}});
O({id:'eastGate',hidden:function(){return !!W().east;},make:function(A){return {spr:A.barrier(),dx:27*TS,dy:10*TS,base:10*TS+15,fp:[[27,10]]};}});
O({id:'outfitters',make:function(A){return {spr:A.hatStall(),dx:1*TS,dy:15*TS-40,base:14*TS+15,fp:[[1,14],[2,14],[3,14]]};}});
O({id:'stallEast',make:function(A){return {spr:A.stall('bread'),dx:28*TS,dy:13*TS-24,base:13*TS+15,fp:[[28,13],[29,13],[30,13]]};}});
[[11,11],[20,9],[28,7]].forEach(function(p){O({make:function(A){return {spr:A.lamp(),dx:p[0]*TS+3,dy:p[1]*TS-14,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});
O({make:function(A){return {spr:A.bench(),dx:22*TS+1,dy:12*TS+2,base:12*TS+15,fp:[[22,12],[23,12]]};}});
[[2,4],[11,1],[22,6],[25,13],[6,17],[12,14],[20,18]].forEach(function(p){O({make:function(A){return {spr:A.bush(),dx:p[0]*TS,dy:p[1]*TS,base:p[1]*TS+14,fp:[[p[0],p[1]]]};}});});
O({id:'logs',make:function(A){return {spr:A.logs(),dx:23*TS-1,dy:16*TS-26,base:15*TS+15,fp:[[23,14],[24,14],[23,15],[24,15]]};}});

/* ───────── quests ───────── */
function job(id){return !!(window.PQM&&PQM.jobDone(id));}
D.quests.sort={
  title:'Rosa\'s Rope Scraps',spawn:[3,10,'right'],next:{tab:'warmup',sel:'#mk-mental',label:'Mental Math'},
  teaser:'The Smudge snapped the rope rail on the Foot Bridge and blew Rosa\'s rope scraps all over the riverbank.',
  lockText:'Finish Build a Foot above to unlock this quest. Rosa needs helpers who know how long a foot is.',
  locked:function(){return !job('j1');},
  doneText:'Shorter than 12 in, exactly 12 in, or longer: you sorted every scrap. Next: Mental Math, then the Think puzzle at Gus\'s height post.',
  goal:function(S){var q=S.q.sort||{},n=Object.keys(q.sorted||{}).length;
    if(!q.met)return 'Talk to <b>Rosa</b> outside her rope shed.';
    if(q.hold)return 'Put the '+scrap(q.hold).len+' in scrap in the right bin.';
    return n<4?'Find the sparkly rope scraps and sort them <b>('+n+'/4)</b>':'Tell <b>Rosa</b> you\'re done.';},
  markers:function(S){var q=S.q.sort||{};if(!q.met)return [{id:'rosa'}];if(q.hold)return [{id:'binShort'},{id:'binFoot'},{id:'binLong'}];return Object.keys(q.sorted||{}).length>=4?[{id:'rosa'}]:[];},
  start:function(api){var q=api.q();if(!q.seen){q.seen=1;api.save();api.banner('LEVEL 10','FOOT BRIDGE · LESSON 2 OF 7');
    api.say([{who:'opti',t:'Hoo! Welcome to the Foot Bridge, {name}. Last time you opened Amy\'s juice stand.'},
      {who:'opti',t:'People here measure in inches and feet. But the Smudge got here first. It snapped the rope rail on the bridge!'},
      {who:'opti',t:'Rosa makes all the rope in town. Her shed is just up the path. Go say hello.'}],function(a){a.goal(D.quests.sort.goal(a.S));});}},
  reset:function(S){S.q.sort={};},
  transcript:['Opti: Welcome to the Foot Bridge. The Smudge snapped the rope rail on the bridge!','Rosa: The Smudge blew my rope scraps all over the riverbank. Please sort them into my bins: SHORT, 1 FOOT or LONG.','Scraps: 10 in (short), 12 in (1 foot), 15 in (long), 12 in (1 foot).','Cora: A foot is not 10 inches. A foot is 12 inches.','Rosa: Every scrap is sorted. The 1-foot pieces go to Gus for the rail.']
};
D.quests.build={
  title:'Gus Ties the Rail',spawn:[10,10,'right'],next:{tab:'learn',sel:'#mk-board-kc',label:'The Foot Bridge Board'},
  teaser:'Rosa tied your two ropes into one. Now Gus needs it on his posts, but the Smudge left a tag on one of them.',
  lockText:'Finish Join the Ropes on the Learn tab above to unlock this quest.',
  locked:function(){return !job('j3');},
  doneText:'3 ft 15 in = 4 ft 3 in, because 12 in make 1 foot. You fixed the Smudge\'s tag and tied the rail. Next: the Foot Bridge Board.',
  goal:function(S){var q=S.q.build||{};return !q.met?'Talk to <b>Gus</b> by the bridge.':!S.world.tagFixed?'Read the tag on the <b>north post</b>.':!S.world.rail?'Tie the rope to the <b>south post</b>.':'The rail is back!';},
  markers:function(S){var q=S.q.build||{};return !q.met?[{id:'gus'}]:!S.world.tagFixed?[{id:'postN'}]:!S.world.rail?[{id:'postS'}]:[];},
  reset:function(S){S.world.tagFixed=false;S.world.rail=false;S.q.build={};},
  skip:function(S){S.world.tagFixed=true;S.world.rail=true;},
  transcript:['Gus: Rosa tied your two ropes into one: 2 ft 8 in + 1 ft 7 in = 3 ft 15 in of rope for the broken gap in my rail.','Tag on the post: 3 ft 15 in = 4 ft 5 in. (signed, the Smudge)','Felix: The Smudge treated inches like tens and ones. A foot is 12 inches, not 10. 15 in is 12 in and 3 in.','Tag: 3 ft 15 in = 4 ft 3 in.','Gus: The rail is tight again. Thank you!']
};
D.quests.chase={
  title:'Chase the Smudge',spawn:[11,10,'right'],next:{tab:'assignment',sel:'.gathered-box',label:'Gather your answers'},
  teaser:'The rail is fixed, but the Smudge is blocking the bridge with wrong measures. Chase it all the way to Eastside!',
  lockText:'Finish Measure the Rail on the Learn tab first. You\'ll need yards and feet to catch the Smudge.',
  locked:function(){return !job('j4');},
  doneText:'29 ft = 9 yd 2 ft. 80 in = 6 ft 8 in. 3 yd = 9 ft. You chased the Smudge across the bridge, and Eastside is open!',
  goal:function(S){var q=S.q.chase||{},k=q.stop||0;return S.world.east?'Eastside is open!':'Catch <b>the Smudge</b> ('+k+'/3).';},
  markers:function(S){return S.world.east?[]:[{id:'smudge'}];},
  start:function(api){var q=api.q();if(!api.S.world.rail){api.S.world.rail=true;api.S.world.tagFixed=true;}
    if(!q.started&&!api.S.world.east){q.started=1;q.stop=0;api.save();placeSmudge(api);
      api.say([{who:'gus',t:'The rail is tight, {name}. But look! The Smudge is sitting right on my bridge.'},{who:'smudge',t:'Heh heh heh. Nobody crosses MY bridge. My measures are PERFECT!'},{who:'sys',t:'Walk up to the Smudge and press A (or Space).'}],function(a){a.goal(D.quests.chase.goal(a.S));});}
    else placeSmudge(api);},
  reset:function(S){S.world.east=false;S.q.chase={};},
  skip:function(S){S.world.east=true;S.world.rail=true;S.world.tagFixed=true;},
  transcript:['The Smudge: Your rail is 29 feet. That\'s 2 yards 9 feet!','Cora: Count the yards first. Each yard is 3 feet: 3, 6, 9 … 27. That\'s 9 yards, and 2 feet are left over.','The Smudge: Your rope is 80 inches. That\'s 8 feet!','You: 80 in = 6 ft 8 in.','The Smudge: The Eastside gate is 3 yards wide. That\'s 6 feet!','You: 3 yd = 9 ft.','Opti: Eastside is open! Next lesson, the Eastside General Store weighs things in pounds and ounces.']
};
var STOPS=[[16,10],[22,10],[26,10]];
function placeSmudge(api){var e=api.ent('smudge');if(!e)return;var k=Math.min((api.S.q.chase||{}).stop||0,2);e.x=STOPS[k][0];e.y=STOPS[k][1];e.alpha=1;e.flyOff=0;e.dxOff=0;e.tick=null;}
function hop(api,k){var e=api.ent('smudge');api.snd.poof();e.alpha=1;var from=e.x,to=STOPS[k][0],tt=0;e.tick=function(dt,z){tt+=dt;var p=Math.min(1,tt/0.7);z.dxOff=(to-from)*16*p;if(p>=1){z.x=to;z.dxOff=0;z.tick=null;}};}

/* ───────── talk ───────── */
/* The Crew says hello and talks about today's place first (HELLO). Their method lines (IDLE) unlock only after the page
   teaches the methods: CREW_TAUGHT is the job that does it (Measure Rosa's Rope, right after the Crew card on Learn). */
var CREW_TAUGHT='j2';
var HELLO={
  atlas:'Hi, I\'m Atlas! Eastside is right across that river, and I\'ve never been there. I can\'t wait to explore it!',
  felix:'Hey, I\'m Felix! I stomped on every board of this bridge to test it. The boards are strong. It\'s the rope rail that broke.',
  hazel:'Hi! I\'m Hazel. I\'m drawing the river today. Look how the water sparkles under the bridge!',
  cora:'Hello, I\'m Cora. Gus says nobody crosses until the rail is fixed. That\'s a good rule.'
};
var IDLE={
  atlas:'I take out whole feet with a number bond. 46 inches is 36 inches and 10 inches, so it\'s 3 feet 10 inches.',
  felix:'I change it all to inches first. 2 feet is 24 inches. Add 8 more inches: 32 inches in all. Then I work and change back.',
  hazel:'I picture a ruler. Every 12 little inch marks make one big foot.',
  cora:'When the inches reach 12, trade them for 1 foot. Not 10. Twelve!'
};
var SHOP=[['cap','Explorer cap',10],['scarf','Market scarf',8],['flower','Hair flower',6],['pack','Travel pack',15]];
function shop(api){
  var Wl=PQM.wallet();
  var ch=SHOP.map(function(it){var own=Wl.gear[it[0]];return [it[1]+(own?(Wl.wear[it[0]]?' · wearing':' · put on'):' · '+it[2]+' 🪙'),function(a){
    if(own){Wl.wear[it[0]]=!Wl.wear[it[0]];PQM.saveWallet();PQ._rebuild();a.snd.sel();a.say([{who:'penny',t:Wl.wear[it[0]]?'Looking sharp!':'Off it comes. I\'ll keep it safe in your pack.'}]);return;}
    if(PQM.spend(it[2])){Wl.gear[it[0]]=1;Wl.wear[it[0]]=1;PQM.saveWallet();PQ._rebuild();a.snd.item();a.say([{who:'penny',t:'One '+it[1].toLowerCase()+', coming right up! It\'ll go with you to every lesson.'}]);}
    else{a.snd.bad();a.say([{who:'penny',t:'That costs '+it[2]+' coins, and you have '+Wl.coins+'. Earn more with correct work on the lesson page, like Build a Foot and the Rope Ruler.'}]);}}];});
  ch.push(['Just looking',function(a){a.say([{who:'penny',t:'Come back any time!'}]);}]);
  api.say([{who:'penny',t:'I brought my cart to the bridge! You have '+Wl.coins+' coins. Anything catch your eye?',choices:ch}]);
}
function curQuest(){var s=document.querySelector('.pq-slot.pq-live');return s&&s.dataset.quest;}
function padOf(who,t,eq,unit,check){var p={who:who,t:t,pad:{eq:eq,unit:unit,check:function(v,a){check(v,a,p);}}};return p;}
D.talk=function(id,api){
  var S=api.S,q=curQuest();
  if(id==='opti'){
    if(S.world.east)return api.say([{who:'opti',t:'Eastside is open, {name}! Next time we visit the General Store over there.'}]);
    return api.say([{who:'opti',t:'Hoo! Every bridge job on the page gets us one step closer to Eastside.'}]);
  }
  if(IDLE[id])return api.say([{who:id,t:(PQM.jobDone(CREW_TAUGHT)?IDLE:HELLO)[id]}]);
  if(id==='rosa'){
    if(q==='sort'){var R=S.q.sort;
      if(!R.met){return api.say([{who:'rosa',t:'Hi, {name}! I\'m Rosa. I make all the rope in town.'},{who:'rosa',t:'Last night the Smudge snapped the rope rail on the bridge. Then it blew my rope scraps all over the riverbank!'},
        {who:'rosa',t:'Every scrap has a tag in inches. Please sort them into my three bins: SHORT, 1 FOOT and LONG.'},{who:'rosa',t:'A scrap that is exactly 1 foot goes in the 1 FOOT bin. Walk onto a sparkle to pick one up.'}],
        function(a){a.S.q.sort.met=1;a.save();a.goal(D.quests.sort.goal(a.S));});}
      var n=Object.keys(R.sorted||{}).length;
      if(n<4)return api.say([{who:'rosa',t:R.hold?'Which bin does that one go in? Remember, 1 foot is 12 inches.':'Still '+(4-n)+' to go! Look for sparkles along the riverbank.'}]);
      return api.say([{who:'rosa',t:'Every scrap is sorted. Thank you, {name}!'},{who:'rosa',t:'The 1-foot pieces go to Gus to help fix the rail. The rest I\'ll tie into new rope.'}],function(a){a.complete();});}
    if(S.world.rail)return api.say([{who:'rosa',t:'That rope you spliced is holding tight. Good knots and good math!'}]);
    return api.say([{who:'rosa',t:'I measure every rope in feet and inches. 12 inches make 1 foot, every time.'}]);
  }
  if(BINS[id]){
    var lab={binShort:'SHORT: shorter than 1 foot',binFoot:'1 FOOT: exactly 12 inches',binLong:'LONG: longer than 1 foot'}[id];
    if(q!=='sort'||!S.q.sort.hold)return api.say([{who:'sign',t:lab+'.'}]);
    var sc=scrap(S.q.sort.hold),want=kindOf(sc.len);
    if(BINS[id]===want){S.q.sort.sorted=S.q.sort.sorted||{};S.q.sort.sorted[sc.id]=1;S.q.sort.hold=null;api.save();api.snd.good();
      var left=4-Object.keys(S.q.sort.sorted).length;
      return api.say([{who:'sys',t:'Into the '+lab.split(':')[0]+' bin! '+(left?left+' to go.':'That\'s all 4. Go tell Rosa.')}],function(a){a.goal(D.quests.sort.goal(a.S));});}
    api.snd.bad();
    if(sc.len===10&&BINS[id]==='foot')return api.say([{who:'cora',t:'Careful! A foot is not 10 inches. A foot is 12 inches, so 10 inches is shorter than a foot.'}]);
    if(sc.len<12)return api.say([{who:'felix',t:'I tested it: '+sc.len+' inches is less than 12 inches. It\'s shorter than a foot.'}]);
    if(sc.len===12)return api.say([{who:'hazel',t:'Picture the ruler: 12 inch marks make exactly 1 foot. This scrap is exactly 12 inches.'}]);
    return api.say([{who:'atlas',t:sc.len+' inches is more than 12 inches. It\'s longer than a foot.'}]);
  }
  if(id==='gus'){
    if(q==='build'){var B=S.q.build;
      if(!B.met)return api.say([{who:'gus',t:'So you\'re the explorer Rosa told me about! I\'m Gus. I keep the Foot Bridge.'},{who:'gus',t:'Rosa tied your two ropes into one: 2 ft 8 in + 1 ft 7 in = 3 ft 15 in of rope for the broken gap in my rail.'},
        {who:'gus',t:'But look at my north post. The Smudge stuck a tag on it. Go read it.'}],function(a){a.S.q.build.met=1;a.save();a.goal(D.quests.build.goal(a.S));});
      if(!S.world.tagFixed)return api.say([{who:'gus',t:'Read that tag on the north post. Something about it looks wrong to me.'}]);
      if(!S.world.rail)return api.say([{who:'gus',t:'Now tie the other end to the south post.'}]);
      return api.say([{who:'gus',t:'Tight as a drum! Thank you, {name}.'}]);}
    if(q==='chase'&&!S.world.east)return api.say([{who:'gus',t:'Go on, {name}! Chase that cloud right across my bridge.'}]);
    if(S.world.east)return api.say([{who:'gus',t:'Eastside is open, and my rail is the best on the river. Come back any time!'}]);
    return api.say([{who:'gus',t:'I\'m Gus, the bridgekeeper. Nobody crosses until my rope rail is fixed. Safety first!'}]);
  }
  if(id==='postN'){
    if(q==='build'&&S.q.build.met&&!S.world.tagFixed){var ask=padOf('sign','Fix the tag. Type the inches, then press OK.','3 ft 15 in = 4 ft','in',function(v,a,me){
        if(v===3){a.snd.good();a.S.world.tagFixed=true;a.save();a.say([{who:'sign',t:'3 ft 15 in = 4 ft 3 in.'},{who:'gus',t:'That\'s right! 15 inches is 1 foot and 3 inches. Now tie the rope to the south post.'}],function(b){b.goal(D.quests.build.goal(b.S));});}
        else if(v===5){a.snd.bad();a.say([{who:'felix',t:'That\'s what the Smudge wrote. It treated inches like tens and ones. A foot is 12 inches, not 10. 15 inches take away 12 inches is?'},me]);}
        else {a.snd.bad();a.say([{who:'atlas',t:'Split 15 inches with a number bond: 12 inches and 3 inches. The 12 inches make the new foot. What is left?'},me]);}});
      return api.say([{who:'sign',t:'3 ft 15 in = 4 ft 5 in. (signed, the Smudge)'},{who:'me',t:'Hmm. Does 15 inches make 1 foot and 5 inches?'},ask]);}
    if(S.world.tagFixed)return api.say([{who:'sys',t:'A strong post. The tag now says 3 ft 15 in = 4 ft 3 in.'}]);
    return api.say([{who:'sys',t:'A gray tag is stuck to the post, covered in fuzz.'}]);
  }
  if(id==='postS'){
    if(q==='build'&&S.world.tagFixed&&!S.world.rail){return api.say([{who:'sys',t:'You tie the rope tight around the post.'},{fn:function(b){b.snd.item();b.S.world.rail=true;b.save();if(window.PQM)PQM.renderBoard();
        b.fx({t:0,update:function(dt){this.t+=dt;return this.t<1.2;},draw:function(x,cx,cy,tt){for(var k=0;k<8;k++){var px=14*16+k*12-cx,py=10*16-cy+(k%2?14:0);b.A.sparkle(x,px,py,tt+k,k%2?'#F5C518':'#FFFFFF');}}});}},
        {who:'gus',t:'The rail is back! Now people can hold on all the way across.'},{who:'gus',t:'Eastside has a question about my whole rail. Read the Foot Bridge Board on your page, then help me measure it.'}],function(a){a.goal(D.quests.build.goal(a.S));a.complete();});}
    return api.say([{who:'sys',t:'The south post of the Foot Bridge.'}]);
  }
  if(id==='smudge'){
    if(q!=='chase'||S.world.east)return;
    var C=S.q.chase,k=C.stop||0;
    if(k===0){var y2=padOf('me','How many feet are left over?','29 ft = 9 yd','ft',function(v,a,me){
          if(v===2){a.snd.good();a.S.q.chase.stop=1;a.save();hop(a,1);a.say([{who:'smudge',t:'Grr! 9 yards 2 feet. Fine! Catch me if you can!'}],function(b){b.goal(D.quests.chase.goal(b.S));});}
          else {a.snd.bad();a.say([{who:'hazel',t:'9 yards is 9 × 3 = 27 feet. How many more feet make 29?'},me]);}}),
        y1=padOf('me','How many yards? Type it, then press OK.','29 ft =','yd',function(v,a,me){
          if(v===9){a.snd.good();a.say([y2]);}
          else if(v===2){a.snd.bad();a.say([{who:'cora',t:'That\'s the Smudge\'s trick: it swapped them! Yards are the big 3-foot pieces. Count them: 3, 6, 9 … 27 is 9 yards. The leftover feet must be less than 3.'},me]);}
          else {a.snd.bad();a.say([{who:'atlas',t:'Each yard is 3 feet. How many 3-foot pieces fit in 29 feet? Skip-count by 3s.'},me]);}});
      return api.say([{who:'smudge',t:'Your rail is 29 feet. That\'s 2 yards 9 feet! Heh heh!'},{who:'me',t:'9 feet is more than a yard. Something\'s wrong.'},y1]);}
    if(k===1){var f2=padOf('me','How many inches are left over?','80 in = 6 ft','in',function(v,a,me){
          if(v===8){a.snd.good();a.S.q.chase.stop=2;a.save();hop(a,2);a.say([{who:'smudge',t:'6 feet 8 inches?! Ugh. You\'ll never get past the gate!'}],function(b){b.goal(D.quests.chase.goal(b.S));});}
          else {a.snd.bad();a.say([{who:'felix',t:'6 feet is 72 inches. 72 and how many more make 80?'},me]);}}),
        f1=padOf('me','How many whole feet? Type it, then press OK.','80 in =','ft',function(v,a,me){
          if(v===6){a.snd.good();a.say([f2]);}
          else if(v===8){a.snd.bad();a.say([{who:'cora',t:'That\'s the Smudge\'s trick! 8 feet would be 96 inches, way too many. A foot is 12 inches, not 10. Count by 12s.'},me]);}
          else {a.snd.bad();a.say([{who:'atlas',t:'Count by 12s until the next one is too big. When you pass 80, stop and go back one.'},me]);}});
      return api.say([{who:'smudge',t:'Your rope is 80 inches. That\'s 8 feet!'},f1]);}
    var g1=padOf('me','How many feet wide? Type it, then press OK.','3 yd =','ft',function(v,a,me){
        if(v===9){a.snd.good();a.S.world.east=true;a.S.q.chase.stop=3;a.S.q.chase.fleeing=1;a.save();
          a.say([{who:'smudge',t:'NINE feet?! You measured everything right!'},{who:'smudge',t:'Fine. Keep your silly bridge. My Brick Golem will be ready at the end of Level 10. Heh heh heh…'},
            {fn:function(b){b.snd.poof();var sm=b.ent('smudge');sm.tick=function(dt,e){e.flyOff=(e.flyOff||0)+dt*30;e.dxOff=(e.dxOff||0)+dt*40;e.alpha=Math.max(0,1-(e.flyOff/40));if(e.alpha<=0){e.tick=null;b.S.q.chase.fleeing=0;b.save();}};}},
            {who:'sys',t:'Something small drops out of the cloud: a gray brick chip, stamped with a letter G.'},
            {who:'opti',t:'Hoo! A brick chip? I wonder what the Smudge is building. Keep it, {name}. It\'s a clue.'},
            {who:'opti',t:'The gate is open. Eastside is ours to explore! Next lesson we visit the General Store, where they weigh things in pounds and ounces.'}],function(b){b.goal(D.quests.chase.goal(b.S));b.complete();});}
        else if(v===6){a.snd.bad();a.say([{who:'hazel',t:'Picture 3 yardsticks end to end. Each one is 3 feet: 3 + 3 + 3.'},me]);}
        else {a.snd.bad();a.say([{who:'felix',t:'1 yard is 3 feet. So 3 yards is 3 × 3 feet.'},me]);}});
    return api.say([{who:'smudge',t:'The Eastside gate is 3 yards wide. That\'s 6 feet! Wrong measure, no entry!'},g1]);
  }
  if(id==='penny'||id==='outfitters')return shop(api);
  var SIGNS={
    westSign:[{who:'sign',t:'← METRIC MARKET'}],
    eastSign:[{who:'sign',t:S.world.east?'EASTSIDE → Welcome! General Store just ahead.':'EASTSIDE → Gate closed until the bridge is safe.'}],
    heightPost:[{who:'sign',t:'GUS\'S HEIGHT POST. A mark for every inch, all the way up to 5 feet.'}],
    shed:[{who:'sys',t:'Rosa\'s rope shed. Coils of rope hang on hooks, each one tagged in feet and inches.'}],
    gate:[{who:'sys',t:'A barrier blocks the bridge. A sign says: CLOSED UNTIL THE RAIL IS FIXED.'}],
    eastGate:[{who:'sys',t:'The Eastside gate is shut tight.'}],
    logs:[{who:'sys',t:'A stack of logs. Each one is tagged "6 ft".'}],
    stallEast:[{who:'sys',t:'An Eastside bakery stall. The sign says: BREAD BY THE FOOT!'}]
  };
  if(SIGNS[id])return api.say(SIGNS[id]);
};
D.afterQuest=function(q,api){
  if(window.PQM){var slot=document.querySelector('.pq-slot[data-quest="'+q+'"]');PQM.earn('quest-'+q,5,10,slot,'Quest clear!');PQM.renderBoard();}
  if(q==='chase'){try{var y=JSON.parse(localStorage.getItem('oao.pq.year')||'{}');y.L10=y.L10||{};y.L10['10.02']=1;localStorage.setItem('oao.pq.year',JSON.stringify(y));}catch(e){}}
};
return D;
})();

/* ═══ PQ_LESSON · the page side of 4.10.02 (jobs, scene, models). The shared layer is assets/sparkle/pq-layer.js ═══ */
var PQ_LESSON=(function(){
var api;
function fmt(n){return n.toLocaleString('en-US');}
function jobDone(id){return api.jobDone(id);}
function setJob(id,src){api.setJob(id,src);}
function earn(k,c,x,s,l){return api.earn(k,c,x,s,l);}
function ls(k,d){return api.ls(k,d);}
function lsSet(k,v){return api.lsSet(k,v);}
function num(v){var t=String(v==null?'':v).replace(/[,\s]/g,'');return t===''||isNaN(+t)?null:+t;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

/* the cinematic opening (assets/sparkle/pq-intro.js): pictures and one counter in inches, no sentences.
   twelve 1-inch pieces fill a ruler (1 … 12 in) → they snap into 1 foot → 3 more feet slide in end to end (24, 36, 48 in) →
   5 more feet and a 5-inch piece (77 in, the north post) → Gus walks up and wonders "?" (the Think puzzle; never its answer). */
function introScene(g,t){
  var C=g.C,W=g.W,H=g.H,m=12,i,a,p;
  var F1=Math.min(Math.floor((W-2*m)/1.2),170),F2=Math.floor((W-2*m)/6.6),bh=g.portrait?9:10;
  var z=g.ease(g.p(t,2.6,3.2)),F=g.lerp(F1,F2,z),inch=F/12;
  var x0=Math.round(g.lerp(g.cx-F1/2,g.cx-6.42*F2/2,z)),y0=Math.round(H*.38),capY=y0-24;
  function px(n){return Math.round(n*inch);}
  g.owl(W-30,H-30-Math.ceil(52/g.s),t);
  var cnt=0;
  // ── an empty 1-foot ruler fills with twelve 1-inch pieces
  if(t<2.4){
    var ra=g.ease(g.p(t,.1,.45));
    g.rect(x0-1,y0-1,F+2,bh+2,'rgba(255,255,255,'+(.6*ra)+')');g.rect(x0,y0,F,bh,'rgba(10,21,51,'+ra+')');
    for(i=0;i<=12;i++)g.rect(Math.min(x0+px(i),x0+F-1),y0+bh-(i%6?3:5),1,i%6?3:5,'rgba(255,255,255,'+(.45*ra)+')');
    for(i=0;i<12;i++){a=.4+i*.13;p=g.p(t,a,a+.18);if(p<=0)continue;if(p>=1){cnt++;if(g.once('in'+i))g.blip(392+i*36);}
      g.box(x0+px(i),Math.round(g.lerp(y0-30,y0,g.back(p))),Math.max(1,px(i+1)-px(i)-1),bh,C[1]);}
    if(cnt)g.text(cnt+' in',g.cx,capY,{col:cnt===12?C.gold:C.white});
    return;
  }
  // ── they snap into one foot; the camera pulls back; 3 more feet and a 5-inch piece (counter stays in inches)
  cnt=12;
  var full=t>2.4;
  g.box(x0,y0,Math.round(F),bh,C[10]);g.text('1 ft',x0+F/2,y0+Math.round((bh-8)/2)+1,{shadow:false});
  var fl=1-g.p(t,2.4,2.65);if(fl>0){g.rect(x0,y0,F,bh,'rgba(255,255,255,'+fl+')');if(g.once('ft'))g.blip(988,.18);}
  for(i=1;i<6;i++){a=3.3+(i-1)*.3;p=g.p(t,a,a+.3);if(p<=0)continue;if(p>=1){cnt+=12;if(g.once('f'+i))g.blip(523+i*40);}
    var tx=x0+Math.round(i*F);g.box(Math.round(g.lerp(W+4,tx,g.ease(p))),y0,Math.round(F)-1,bh,C[10]);g.text('1 ft',Math.round(g.lerp(W+4,tx,g.ease(p)))+F/2,y0+Math.round((bh-8)/2)+1,{shadow:false});}
  p=g.p(t,4.95,5.2);if(p>0){if(p>=1){cnt+=5;if(g.once('five'))g.blip(784,.1);}g.box(x0+Math.round(6*F),Math.round(g.lerp(y0-26,y0,g.back(p))),px(5),bh,C[1]);}
  g.text(cnt+' in',g.cx,capY,{col:cnt===77?C.gold:C.white});
  // ── Gus walks up beside the north post's length and wonders "?" (is the south post taller?)
  if(t>5.4){var wp=g.ease(g.p(t,5.4,6.1)),ax=Math.round(g.lerp(-18,g.cx-8,wp));g.char('gus',ax,H-30,wp<1?'right':'up',wp<1?Math.floor(t*8)%4:0);
    if(t>6.2&&!g.clean){var bp=g.back(g.p(t,6.2,6.45)),by=H-50-Math.round(4*bp);if(g.once('q'))g.blip(660,.2);
      g.box(ax+3,by,10,11,C.white);g.text('?',ax+8,by+2,{col:Math.floor(t*3)%2?C.ink:'#C56C3F',shadow:false});}}
}

function bridgeSVG(){
  var r=jobDone('j3')||!!api.state().world.rail,y=jobDone('j4'),op=jobDone('j5')||!!api.state().world.east,rope=jobDone('j2');
  var s='<svg viewBox="0 0 190 120" class="mk-svg" role="img" aria-label="The Foot Bridge over the river">';
  s+='<rect width="190" height="120" fill="#BDE7F7"/><rect y="70" width="190" height="50" fill="#5FB3E0"/>';
  for(var w=0;w<6;w++)s+='<rect x="'+(10+w*30)+'" y="'+(92+(w%2)*10)+'" width="14" height="2" fill="#A9DDF5"/>';
  s+='<rect x="0" y="60" width="30" height="60" fill="#8CCF6B"/><rect x="160" y="60" width="30" height="60" fill="#8CCF6B"/>';
  s+='<rect x="24" y="66" width="142" height="9" fill="#C99A63" stroke="#3B2417" stroke-width="2"/>';
  for(var k=0;k<14;k++)s+='<rect x="'+(28+k*10)+'" y="68" width="1.5" height="5" fill="#8A5E35"/>';
  [26,160].forEach(function(px){s+='<rect x="'+px+'" y="44" width="5" height="26" fill="#A97A47" stroke="#3B2417" stroke-width="1.5"/>';});
  if(r)s+='<path d="M31 48 Q95 60 160 48" fill="none" stroke="#3B2417" stroke-width="3.5"/><path d="M31 48 Q95 60 160 48" fill="none" stroke="#D9B27A" stroke-width="1.5"/>';
  else s+='<path d="M31 48 Q55 58 70 64" fill="none" stroke="#3B2417" stroke-width="3"/><path d="M160 48 Q140 58 128 66" fill="none" stroke="#3B2417" stroke-width="3"/>';
  if(y)for(var m=0;m<9;m++){var mx=31+m*16;s+='<rect x="'+mx+'" y="'+(49+Math.round(Math.sin(m/8*Math.PI)*8))+'" width="2" height="5" fill="#2DB87A"/>';}
  if(rope&&!r)s+='<g transform="translate(6,74)"><circle cx="10" cy="10" r="9" fill="#D9B27A" stroke="#3B2417" stroke-width="2"/><circle cx="10" cy="10" r="4" fill="none" stroke="#B88A50" stroke-width="1.5"/></g>';
  s+='<rect x="66" y="8" width="58" height="18" rx="3" fill="'+(op?'#2DB87A':'#FFF3DE')+'" stroke="#3B2417" stroke-width="2.5"/><text x="95" y="21" font-family="DotGothic16,Nunito" font-weight="400" font-size="10" text-anchor="middle" fill="'+(op?'#fff':'#C56C3F')+'">'+(op?'EASTSIDE OPEN':'FOOT BRIDGE')+'</text>';
  return s+'</svg>';
}

/* a two-box answer under a model (ft + in, or yd + ft), with a regroup nudge and mistake hints */
function twoBox(el,cfg){
  var st=ls(cfg.key,null)||{a:['',''],ok:false};
  el.innerHTML='<form class="bm-form mk-two"><span class="mk-two-q">'+cfg.q+'</span>'+cfg.units.map(function(u,k){return '<input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(cfg.aria[k])+'" value="'+esc(st.a[k]||'')+'"><span class="bm-u">'+esc(u)+'</span>';}).join('')+'<button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=el.querySelector('form'),ins=[].slice.call(f.querySelectorAll('input')),msg=el.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t;}
  function lock(){ins.forEach(function(x){x.disabled=true;});say(cfg.doneText,'good');}
  if(st.ok)lock();
  f.onsubmit=function(e){e.preventDefault();var v=ins.map(function(x){return num(x.value);});st.a=ins.map(function(x){return x.value;});lsSet(cfg.key,st);
    if(v.some(function(x){return x==null;}))return say('Type a number in each box.','hint');
    if(v[0]===cfg.answer[0]&&v[1]===cfg.answer[1]){st.ok=true;lsSet(cfg.key,st);OAOKit._snd.done();lock();if(cfg.onDone)cfg.onDone(el);return;}
    OAOKit._snd.no();
    var mk=(cfg.mistakes||[]).filter(function(z){return z.v[0]===v[0]&&z.v[1]===v[1];})[0];if(mk)return say(mk.text,'hint');
    if(v[0]*cfg.rate+v[1]===cfg.answer[0]*cfg.rate+cfg.answer[1])return say('That\'s the right amount! But '+v[1]+' '+cfg.units[1]+' is '+cfg.rate+' '+cfg.units[1]+' or more. Trade '+cfg.rate+' '+cfg.units[1]+' for 1 '+cfg.units[0]+'.','hint');
    say(cfg.hint,'hint');};
}
function mount(m,cls){var d=document.createElement('div');d.className=cls||'';m.appendChild(d);return d;}
var FT7={ticks:{every:1,major:12},scale:[0,12,24,36,48,60,72,84],scaleLabel:function(v){return v?(v/12)+' ft':'0';},pieceLabel:function(v){return v===12?'1 ft':'1 in';},pieces:[12,1],unit:'in',max:84};
var FT={ticks:{every:1,major:12},scale:[0,12,24,36,48,60],scaleLabel:function(v){return v?(v/12)+' ft':'0';},pieceLabel:function(v){return v===12?'1 ft':'1 in';},pieces:[12,1],unit:'in',max:60};
function copy(a,b){var o={};for(var k in a)o[k]=a[k];for(var j in b)o[j]=b[j];return o;}
function count(st,i,v){return (st.fill[i]||[]).filter(function(x){return x===v;}).length;}
function ftSym(st,i){var f=count(st,i,12),n=count(st,i,1),s=f*12+n;if(!s)return '0 in';return (f?f+' × 12 in':'')+(f&&n?' + ':'')+(n?n+' in':'')+' = '+s+' in';}

/* Job 1 · Build a Foot (Bar Strip): 12 one-inch pieces fill 1 foot, then 2 one-foot pieces are 24 inches */
function modelFoot(m){
  OAOKit.barStrip(m,{key:'g4-4-10-02-ok-foot',
    rounds:[{name:'1 foot',label:'Gus\'s ruler: 1 foot',bigLabel:'1 ft',target:12,unit:'in',pieces:[1],pieceLabel:function(){return '1 in';},ticks:{every:1,major:6},scale:[0,6,12],scaleLabel:function(v){return v+' in';},
       text:'Gus\'s ruler is <b>1 foot</b> long. Fill it with 1-inch pieces. How many does it take?',doneText:'Twelve 1-inch pieces fill the ruler. <b>12 in = 1 ft.</b>'},
      {name:'2 feet',label:'Gus\'s tape: 2 feet',bigLabel:'2 ft',target:24,unit:'in',pieces:[12],pieceLabel:function(){return '1 ft';},ticks:{every:1,major:12},scale:[0,12,24],scaleLabel:function(v){return v+' in';},
       text:'Now use 1-foot pieces. Fill Gus\'s 2-foot tape. How many inches long is it?',doneText:'Two feet. Count by 12s: 12, 24. <b>2 ft = 24 in.</b>'}],
    onRound:function(i,root){earn('foot-'+i,2,0,root,'');},
    onDone:function(root){setJob('j1',root);}});
}
/* Warm-Up · Mental Math: make a foot (a known skill: making 12, like 10.01's Make 100) */
function modelMental(m){
  OAOKit.mentalMath(m,{key:'g4-4-10-02-mm',name:'Make a foot',
    how:'1 foot is 12 inches. Find the inches that go with the inches you have to make 12.',
    example:{q:'8 in + ? = 1 ft',bond:{whole:12,parts:[8,4]},steps:['1 ft is 12 in.','8 + 4 = 12','So 8 in + 4 in = 1 ft.']},
    problems:[{q:'7 in + ? = 1 ft',pre:'7 in +',post:'in = 1 ft',a:5,hint:'Count up from 7 to 12: 8, 9, 10, 11, 12.'},
              {q:'3 in + ? = 1 ft',pre:'3 in +',post:'in = 1 ft',a:9,hint:'3 and what make 12? Think 3 + 7 = 10, then 2 more.'},
              {q:'11 in + ? = 1 ft',pre:'11 in +',post:'in = 1 ft',a:1,hint:'11 is right next to 12.'},
              {q:'5 in + ? = 1 ft',pre:'5 in +',post:'in = 1 ft',a:7,hint:'5 and 5 make 10. Then 2 more make 12.'}],
    onRight:function(i,el){earn('mm-'+i,1,0,el,'');},onDone:function(root){earn('mm-all',2,3,root,'Mental math done!');}});
}
/* Warm-Up · Think: which of Gus's posts is taller, north (6 ft 5 in) or south (79 in)? Try it any way, before any teaching */
function modelThink(m){
  var a=mount(m,'mk-think-strip'),b=mount(m,'mk-think-ans');
  OAOKit.barStrip(a,{key:'g4-4-10-02-ok-think',
    intro:'Build each height with 1-foot pieces and 1-inch pieces, or work it out your own way.',
    rows:[copy(FT7,{label:'North post: 6 ft 5 in',target:77,hideTarget:true,overMsg:'That piece makes the bar taller than the north post.',trayText:'Drag pieces (or tap them):'}),
          copy(FT7,{label:'South post tag: 79 in',target:79,hideTarget:true,overMsg:'That piece makes the bar taller than the south post.',trayText:'Drag pieces (or tap them):'})],
    sym:function(s,st){return '<span class="exp">North: '+ftSym(st,0)+' · South: '+ftSym(st,1)+'</span>';}});
  var st=ls('g4-4-10-02-think-ans',null)||{a:['',''],ok:false};
  b.innerHTML='<form class="bm-form mk-two"><label class="mk-two-q" for="thinkWho">Which post is taller, north or south?</label><input id="thinkWho" type="text" autocomplete="off" aria-label="Which post is taller, north or south" value="'+esc(st.a[0])+'" style="width:7em">'+
    '<label class="mk-two-q" for="thinkBy">By how many inches?</label><input id="thinkBy" type="text" inputmode="numeric" autocomplete="off" aria-label="By how many inches" value="'+esc(st.a[1])+'"><span class="bm-u">in</span><button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=b.querySelector('form'),msg=b.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.textContent=t;}
  var DONE='Yes! The south post is taller, by 2 inches. On the Learn tab, the Math Crew shows two ways to find it. Did one match yours?';
  if(st.ok){say(DONE,'good');[].forEach.call(f.querySelectorAll('input'),function(x){x.disabled=true;});}
  f.onsubmit=function(e){e.preventDefault();var who=f.thinkWho.value.trim().toLowerCase(),by=num(f.thinkBy.value);st.a=[f.thinkWho.value,f.thinkBy.value];lsSet('g4-4-10-02-think-ans',st);
    if(!who||by==null)return say('Type north or south, and a number of inches.','hint');
    if(/south/.test(who)&&by===2){st.ok=true;lsSet('g4-4-10-02-think-ans',st);OAOKit._snd.done();say(DONE,'good');[].forEach.call(f.querySelectorAll('input'),function(x){x.disabled=true;});earn('think',4,4,b,'You tried it first!');return;}
    OAOKit._snd.no();
    if(by===14)return say('Is 6 ft 5 in the same as 65 in? Build it: 6 one-foot pieces and 5 one-inch pieces. Each foot is 12 inches, not 10.','hint');
    if(/north/.test(who))return say('Look at the two bars. Which one is longer? Build both posts to check.','hint');
    if(/south/.test(who))return say('The south post is taller, yes! Now count how many more inches its bar has than the north post\'s bar.','hint');
    say('Build both heights on the bars, then compare them.','hint');};
}
/* Job 2 · Measure Rosa's Rope (Rope Ruler + Number Bond): 46 in = 3 ft 10 in */
function modelRope(m){
  var a=mount(m),b=mount(m,'mk-bond-wrap'),c=mount(m);
  OAOKit.barStrip(a,{key:'g4-4-10-02-ok-rope',
    intro:'Rosa\'s rope is <b>46 in</b> long. Build it with 1-foot pieces first, then 1-inch pieces.',
    rows:[copy(FT,{label:'Rosa\'s rope: 46 in',target:46,overMsg:'That piece would go past 46 in. Try 1-inch pieces now.',trayText:'Drag pieces (or tap them):'})],
    sym:function(s,st){return '<span class="big">'+ftSym(st,0)+'</span>'+(s[0]===46&&count(st,0,12)===3?'<span class="exp">3 whole feet fit, and some inches are left over.</span>':s[0]===46&&count(st,0,12)<3?'<span class="exp">Can more 1-foot pieces fit? Take off 12 one-inch pieces and put on a 1-foot piece instead.</span>':'');}});
  OAOKit.numberBond(b,{key:'g4-4-10-02-nb-rope',text:'Split 46 inches into whole feet and leftover inches.',
    rounds:[{whole:46,parts:[36,10],hide:1,unit:'in',note:'36 in is 3 ft. 10 in are left over.'}]});
  twoBox(c,{key:'g4-4-10-02-two-rope',q:'46 in =',units:['ft','in'],aria:['Rosa\'s rope, feet','Rosa\'s rope, inches'],answer:[3,10],rate:12,
    mistakes:[{v:[4,6],text:'That treats inches like tens and ones. A foot is 12 inches, not 10: 12, 24, 36, and the next one is past 46. How many whole feet?'},
              {v:[3,46],text:'46 inches is the whole rope. After you take out 3 feet (36 in), how many inches are left?'}],
    hint:'Look at the bond: 36 in make 3 ft. The other part is the leftover inches.',
    doneText:'46 in = <b>3 ft 10 in</b>. 36 inches make 3 feet, and 10 inches are left over.',
    onDone:function(root){setJob('j2',root);}});
}
/* Job 3 · Splice the Rope: make the next foot, then the Story Bar Model (2 ft 8 in + 1 ft 7 in = 4 ft 3 in) */
function modelNext(m){
  OAOKit.mentalMath(m,{key:'g4-4-10-02-mm-next',name:'Make the next foot',
    how:'Split the inches you add with a number bond. Use part of them to make 12 inches, a whole new foot. Then add what is left.',
    example:{q:'2 ft 9 in + 5 in',bond:{whole:5,parts:[3,2]},steps:['9 in + 3 in = 12 in = 1 ft, so 2 ft 9 in + 3 in = 3 ft.','3 ft + 2 in = 3 ft 2 in.']},
    problems:[{q:'1 ft 9 in + 4 in',units:['ft','in'],a:[2,1],rate:12,hint:'9 in + 3 in make a foot. Split 4 into 3 and 1.'},
              {q:'3 ft 8 in + 6 in',units:['ft','in'],a:[4,2],rate:12,hint:'8 in + 4 in make a foot. Split 6 into 4 and 2.'},
              {q:'2 ft 7 in + 9 in',units:['ft','in'],a:[3,4],rate:12,hint:'7 in + 5 in make a foot. Split 9 into 5 and 4.'}],
    onRight:function(i,el){earn('next-'+i,1,0,el,'');},onDone:function(root){earn('next-all',2,3,root,'Next foot made!');}});
}
function modelSplice(m){
  OAOKit.barModel(m,{key:'g4-4-10-02-bm-splice',kind:'part-whole',units:['ft','in'],rate:12,
    story:['Rosa ties two ropes end to end. ',{t:'The first rope is 2 ft 8 in.',put:'p0',label:'2 ft 8 in'},' ',{t:'The second rope is 1 ft 7 in.',put:'p1',label:'1 ft 7 in'},' How long is the new rope?'],
    whole:{name:'new rope',unknown:true},partsName:'ropes',
    parts:[{id:'p0',value:32,name:'rope 1'},{id:'p1',value:19,name:'rope 2'}],
    question:'How long is the new rope?',answer:[4,3],
    mistakes:[{value:53,text:'4 ft 5 in treats inches like tens and ones. A foot is 12 inches, not 10: 15 in = 12 in + 3 in.'},
              {value:41,text:'A foot is 12 inches, not 10, and the new foot needs adding too. 15 in = 1 ft 3 in, and 3 ft + 1 ft = 4 ft.'},
              {value:39,text:'You traded 12 inches for a foot. Now add that new foot to the 3 feet you already have.'}],
    hint:'Add the feet: 2 ft + 1 ft. Add the inches: 8 in + 7 in. If the inches reach 12, trade 12 in for 1 ft.',
    sym:'2 ft 8 in + 1 ft 7 in = 3 ft 15 in = 4 ft 3 in',
    doneText:'Yes! 3 ft 15 in = 4 ft 3 in. Felix\'s way gives the same: 32 in + 19 in = 51 in = 4 ft 3 in.',
    onDone:function(root){setJob('j3',root);}});
}
/* Job 4 · Measure the Rail (Bar Strip with yard pieces): 29 ft = 9 yd 2 ft */
function modelYards(m){
  var a=mount(m),c=mount(m);
  OAOKit.barStrip(a,{key:'g4-4-10-02-ok-yards',
    intro:'The rail is <b>29 ft</b> long. Lay 1-yard pieces (3 ft each) until no more fit. Fill the rest with 1-foot pieces.',
    rows:[{label:'Bridge rail: 29 ft',target:29,max:29,unit:'ft',pieces:[3,1],base:0.03,pieceLabel:function(v){return v===3?'1 yd':'1 ft';},ticks:{every:1,major:3},scale:[0,6,12,18,24],scaleLabel:function(v){return v+' ft';},
      overMsg:'That piece would go past 29 ft. Try a 1-foot piece.',trayText:'Drag pieces (or tap them):'}],
    sym:function(s,st){var y=count(st,0,3),f=count(st,0,1);return '<span class="big">'+(y?y+' × 3 ft':'')+(y&&f?' + ':'')+(f?f+' ft':'')+(s[0]?' = '+s[0]+' ft':'0 ft')+'</span>'+(s[0]===29&&f>=3?'<span class="exp">3 of those 1-foot pieces make another yard. Take off 3 one-foot pieces and put on a 1-yard piece instead.</span>':'');}});
  twoBox(c,{key:'g4-4-10-02-two-yards2',q:'29 ft =',units:['yd','ft'],aria:['Bridge rail, yards','Bridge rail, feet'],answer:[9,2],rate:3,
    mistakes:[{v:[2,9],text:'Careful, the yards and feet swapped places! Yards are the 3-foot pieces you counted. The leftover feet must be less than 3.'},
              {v:[9,29],text:'29 ft is the whole rail. After you count the whole yards, how many feet are left?'}],
    hint:'Count the 1-yard pieces on the bar. Each one is 3 feet. Then count the leftover feet.',
    doneText:'29 ft = <b>9 yd 2 ft</b>. 9 yards is 27 feet, and 2 feet are left over.',
    onDone:function(root){setJob('j4',root);}});
}
/* Last job · Prove the Smudge wrong: is 2 ft 15 in the same as 3 ft 5 in? Same scale, fair compare */
function modelProve(m){
  OAOKit.barStrip(m,{key:'g4-4-10-02-ok-prove',
    intro:'Build both lengths with 1-foot and 1-inch pieces. Both bars use the same ruler, so you can compare them fairly.',
    rows:[copy(FT,{label:'The Smudge\'s banner: 2 ft 15 in',target:39,max:48,scale:[0,12,24,36,48],trayText:'Drag pieces (or tap them):'}),
          copy(FT,{label:'What it says it equals: 3 ft 5 in',target:41,max:48,scale:[0,12,24,36,48],trayText:'Drag pieces (or tap them):'})],
    sym:function(s){return s[0]===39&&s[1]===41?'<span class="big">39 in is not 41 in. The banner is wrong!</span><span class="exp">15 in = 12 in + 3 in, so 2 ft 15 in = 3 ft 3 in.</span>':'<span class="exp">Top: '+s[0]+' in · Bottom: '+s[1]+' in</span>';},
    onDone:function(root){earn('prove',5,5,root,'You proved it!');setJob('j5',root);}});
}
function modelBonus(m){
  OAOKit.challenge(m,{key:'g4-4-10-02-bonus',title:'Bonus quest: the rope cutter',
    text:'<p>Rosa has a rope <strong>2 yd</strong> long. She cuts it into pieces that are each <strong>8 in</strong> long. How many pieces does she get?</p>',
    answer:9,unit:'pieces',hint:'Change 2 yards to inches first. 1 yd = 3 ft, and 1 ft = 12 in.',
    explain:'<p>2 yd = 6 ft. 6 ft = 6 × 12 = 72 in. 72 ÷ 8 = <strong>9 pieces</strong>.</p>',
    onDone:function(root){earn('bonus',8,8,root,'Bonus quest!');}});
}
function bind(f){return function(m,a){api=a;return f(m);};}
return {
  id:'4.10.02', key:'g4-4-10-02', title:'Customary Units of Length', unit:10, level:'Metric Market', standard:'MA.4.M.1.2', boss:null,
  problem:{title:'Fix the Foot Bridge rail so Eastside can open',text:'The Smudge snapped Gus\'s rope rail. Each job below uses today\'s math. Finish all five and the bridge opens.',jobWord:'Bridge job',jobsTitle:'Bridge jobs'},
  jobs:[
    {id:'j1',t:'Build a foot',w:'Warm-Up · Build a Foot',go:'#mk-foot',tab:'warmup',r:'-2deg',coins:5},
    {id:'j2',t:'Measure Rosa\'s rope',w:'Learn · Rope Ruler',go:'#mk-rope',tab:'learn',r:'1.5deg',coins:8},
    {id:'j3',t:'Join the two ropes',w:'Learn · Join the Ropes',go:'#mk-splice',tab:'learn',r:'-1deg',coins:6},
    {id:'j4',t:'Measure the rail for Eastside',w:'Learn · Measure the Rail',go:'#mk-yards',tab:'learn',r:'2deg',coins:6},
    {id:'j5',t:'Prove the Smudge\'s banner wrong',w:'Show What You Know',go:'#mk-prove',tab:'assignment',r:'-1.5deg',coins:10}],
  scene:function(a){api=a;return bridgeSVG();},
  hints:[
    {sel:'#mk-think .callout-think',rungs:['You want to compare two heights. One is in feet and inches, and one is only in inches. Try to get them in the same unit.','Build each post on the bars: 1-foot pieces are 12 inches, and 1-inch pieces fill in the rest. Which bar is longer?','Here are different numbers: 2 ft 1 in is 12 + 12 + 1 = 25 in. That is taller than 23 in, by 2 in.']},
    {sel:'#tab-assignment .q-block',i:0,inside:true,rungs:['Feet to inches is a step down to a smaller unit, so multiply by 12. Yards to feet: multiply by 3.','For (c), count by 12s to find the whole feet in 67 inches. What is left stays in inches.','Here are different numbers: 3 ft = 3 × 12 = 36 in. 4 yd = 4 × 3 = 12 ft. And 30 in is 2 ft 6 in, because 24 in make 2 feet.']},
    {sel:'#tab-assignment .q-block',i:1,inside:true,rungs:['Add (or subtract) the feet, then the inches.','If the inches reach 12 or more, trade 12 in for 1 ft. If you can\'t take away the inches, trade 1 ft for 12 in first.','Here are different numbers: 1 ft 9 in + 1 ft 5 in = 2 ft 14 in = 3 ft 2 in. And 4 ft 1 in − 1 ft 6 in: trade first, 3 ft 13 in − 1 ft 6 in = 2 ft 7 in.']},
    {sel:'#tab-assignment .q-block',i:2,inside:true,rungs:['Yards are groups of 3 feet. How many groups of 3 fit in 34?','Skip-count by 3s: 3, 6, 9 … Stop before you pass 34. The leftover feet must be less than 3.','Here are different numbers: 20 ft. 6 yards is 18 ft, and 2 ft are left. So 20 ft = 6 yd 2 ft.']},
    {sel:'#mk-rope .activity-body > .mk-todo',rungs:['Start with 1-foot pieces. Each one is 12 inches. How many fit before you pass 46?','3 feet is 36 inches. A 4th foot would make 48 inches, and that is past 46. Fill the rest with 1-inch pieces.','Here are different numbers: 29 in. Two feet is 24 in, and 5 in are left. So 29 in = 2 ft 5 in.']},
    {sel:'#mk-splice .activity-body > .mk-todo',rungs:['Add the feet first: 2 ft + 1 ft. Then add the inches: 8 in + 7 in.','15 inches is more than a foot. Trade 12 inches for 1 foot. What is left over?','Here are different numbers: 1 ft 6 in + 2 ft 10 in = 3 ft 16 in. 16 in = 1 ft 4 in, so that is 4 ft 4 in.']},
    {sel:'#mk-yards .activity-body > .mk-todo',rungs:['Use the 1-yard pieces first. Each one is 3 feet.','Count by 3s: 3, 6, 9 … 27. One more yard would be 30, past 29. Fill the rest with 1-foot pieces.','Here are different numbers: 17 ft. 5 yards is 15 ft, and 2 ft are left. So 17 ft = 5 yd 2 ft.']},
    {sel:'#mk-foot .activity-body > .mk-todo',rungs:['Tap the 1-inch piece over and over, or drag it onto the ruler. Count each one.','The ruler is full at 12 pieces. For round 2, each piece is a whole foot: 12 inches.','Here are different numbers: 3 one-foot pieces make 12 + 12 + 12 = 36 inches.']},
    {sel:'#mk-prove .activity-body > .mk-todo',rungs:['Build each length with 1-foot pieces first, then 1-inch pieces. 15 inches is more than one foot, so the top bar needs some extra inches.','2 ft 15 in is 12 + 12 + 15 inches. 3 ft 5 in is 12 + 12 + 12 + 5 inches. Which is longer?','Here are different numbers: 1 ft 14 in is 26 in, and 2 ft 4 in is 28 in. They are not the same. 14 in = 1 ft 2 in, so 1 ft 14 in = 2 ft 2 in.']}],
  writing:{
    'journal-think':{min:10,chips:[{label:'which post is taller',words:['south']},{label:'by how much',words:['2','two','2 in','2 inches']},{label:'how you knew',words:['12','72','77','79','inches','inch','feet','foot','ft','bar','bars','built','build','changed','change','turned','times','added','plus','minus','subtract','compare','compared','bigger','longer','taller']}]},
    'journal-soc':{min:12,chips:[{label:'yes or no',words:['yes','yeah','right','correct','same','equal','true','she is','she\'s right']},{label:'14 in = 1 ft 2 in',words:['14','12','1 ft 2','1 foot 2','1 foot and 2','foot and 2','trade','traded','regroup']},{label:'4 ft 2 in',words:['4 ft 2','4 feet 2','4ft 2','4 feet and 2','4 ft and 2','50']}]}},
  words:[{w:'customary',d:'the measuring system that uses inches, feet and other units like them'},{w:'splice',d:'join two ropes end to end into one rope'},
    {w:'yard',d:'3 feet, about one big step'},{w:'mile',d:'5,280 feet, about a 20-minute walk'}],
  intendedWrong:['3 ft 15 in = 4 ft 5 in','3 ft 15 in = 4 ft','15 in make 1 ft and 5 in','2 ft 15 in = 3 ft 5 in','29 ft = 2 yd 9 ft','3 yd = 6 ft','2 yards 9 feet','80 in = 8 ft','29 ft = 9 yd','80 in = 6 ft','6 ft 5 in is the same as 65 in'],
  intro:{card:false,len:7.2,
    alt:'Twelve 1-inch pieces fill a ruler: 12 inches make 1 foot. Five more feet and a 5-inch piece slide in end to end, 77 inches in all, as tall as Gus\'s north post. Gus walks up and wonders which of his posts is taller.',
    scene:introScene},
  models:{foot:bind(modelFoot),mental:bind(modelMental),think:bind(modelThink),rope:bind(modelRope),next:bind(modelNext),splice:bind(modelSplice),yards:bind(modelYards),prove:bind(modelProve),bonus:bind(modelBonus)}
};
})();
