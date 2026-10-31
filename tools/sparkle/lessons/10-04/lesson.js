/* ═══ PQ_DATA · Lesson 4.10.04 Customary Units of Capacity · Level 10 "Metric Market" · Hilltop Dairy (lesson 4 of 7) ═══
   Everything lesson-specific lives here. The engine (pq-engine.js) and art kit (pq-art.js) hold no lesson content. */
var PQ_DATA = (function(){
var TS=16;

/* Hilltop: the road from Eastside along the bottom (west → east), a fence across the hill with the dairy gate in the middle,
   and the dairy yard above it: Farmer Hank's barn (north-west), the Gallon-Man statue on the plaza, the cows' trough (east)
   and the pasture. The Crew waits by the road (south-west), outside the gate. */
function mkMap(){
  var W=32,H=22,g=[],i,j;
  for(j=0;j<H;j++){g.push([]);for(i=0;i<W;i++)g[j].push((j===0||j===H-1||i===0||i===W-1)?'T':'.');}
  for(i=1;i<=30;i++)g[17][i]='p';
  g[17][0]='p';
  for(i=1;i<=30;i++)g[12][i]='=';
  for(j=6;j<=16;j++)g[j][15]='p';
  for(j=5;j<=8;j++)for(i=13;i<=18;i++)g[j][i]='s';
  for(i=6;i<=12;i++)g[8][i]='p';
  for(i=19;i<=23;i++)g[9][i]='p';
  [[3,14],[10,15],[20,14],[27,14],[11,19],[22,20],[2,10],[29,9]].forEach(function(p){g[p[1]][p[0]]='f';});
  [[1,1],[2,1],[1,2],[29,1],[30,1],[30,2],[1,20],[2,20],[30,20],[29,20],[30,19]].forEach(function(p){g[p[1]][p[0]]='T';});
  return g.map(function(r){return r.join('');});
}

var D = {
  key:'g4-4-10-04-pq',
  levelLabel:'LV 10 · HILLTOP DAIRY',
  map:mkMap(),
  speakers:{
    sys:{name:'',color:'#3B2417',pitch:440,noface:true},
    me:{name:'You',color:'#6B3FA0',pitch:600},
    opti:{name:'OPTI',color:'#0E1C42',pitch:760},
    atlas:{name:'ATLAS',color:'#1F8FB4',pitch:420},
    felix:{name:'FELIX',color:'#1E8C5A',pitch:500},
    hazel:{name:'HAZEL',color:'#B08A0A',pitch:680},
    cora:{name:'CORA',color:'#C2601F',pitch:600},
    hank:{name:'FARMER HANK',color:'#2F5D8A',pitch:330},
    smudge:{name:'THE SMUDGE',color:'#55505E',pitch:220,noface:true},
    penny:{name:'PENNY',color:'#8E4FBF',pitch:620},
    sign:{name:'SIGN',color:'#8A5A33',pitch:480,noface:true},
    gate:{name:'THE GATE',color:'#8A5A33',pitch:480,noface:true},
    'item-bottle':{name:'',color:'#3B2417',pitch:520,icon:'bottle'},
    'item-cheese':{name:'',color:'#3B2417',pitch:520,icon:'cheese'},
    'item-mug':{name:'',color:'#3B2417',pitch:520,icon:'mug'},
    'item-butter':{name:'',color:'#3B2417',pitch:520,icon:'butter'}
  },
  npcs:[
    {id:'opti',owl:true,x:2,y:16,fixed:true},
    {id:'atlas',x:5,y:14,dir:'right',look:{skin:['#EBC09A','#CF9A6F'],hair:['#5A3A22','#3E2716'],style:'short',shirt:'#55C8E8',acc:'hat',acc2:'#D8B575'}},
    {id:'felix',x:8,y:14,dir:'left',look:{skin:['#9C6640','#7C4C2C'],hair:['#1E1E28','#0E0E16'],style:'spiky',shirt:'#2DB87A',acc:'goggles'}},
    {id:'hazel',x:5,y:16,dir:'right',look:{skin:['#F6D3B3','#E2AE88'],hair:['#C4512E','#963A1E'],style:'long',shirt:'#F5C518',acc:'beret',acc2:'#C93A4A'}},
    {id:'cora',x:8,y:16,dir:'left',look:{skin:['#C98E5E','#A86E42'],hair:['#2A1D18','#160E0A'],style:'puffs',shirt:'#E07B39',acc:'glasses',frame:'#5B2E10'}},
    {id:'hank',x:14,y:9,dir:'down',look:HANK,show:function(S){var q=S.q.escort||{};return !(q.started&&!S.world.milkrun);}},
    {id:'hankw',x:18,y:17,dir:'right',look:HANK,show:function(S){var q=S.q.escort||{};return !!(q.started&&!S.world.milkrun);}},
    {id:'penny',x:26,y:19,dir:'left',look:{skin:['#EBC09A','#CF9A6F'],hair:['#8E6BD0','#6A48A8'],style:'puffs',shirt:'#6B3FA0'}}
  ],
  items:[
    {id:'bottle',kind:'bottle',x:21,y:10,what:'a bottle of cream',lab:'12 fl oz',bin:'binHold'},
    {id:'cheese',kind:'cheese',x:4,y:9,what:'a small wheel of cheese',lab:'12 oz',bin:'binWeigh'},
    {id:'mug',kind:'mug',x:27,y:15,what:'a mug of cocoa',lab:'8 fl oz',bin:'binHold'},
    {id:'butter',kind:'butter',x:12,y:19,what:'a block of butter',lab:'8 oz',bin:'binWeigh'}
  ],
  labels:{opti:'Opti',atlas:'Atlas',felix:'Felix',hazel:'Hazel',cora:'Cora',hank:'Farmer Hank',hankw:'Farmer Hank',penny:'Penny',
    gate:'the dairy gate',statue:'the Gallon-Man',trough:'the trough',binHold:'HOLDS bin',binWeigh:'WEIGHS bin',item:'Something with a label'},
  objects:[],
  quests:{},
  transcripts:{}
};
var HANK={skin:['#C98E5E','#A86E42'],hair:['#8A8A8A','#666666'],style:'short',shirt:'#3A6FB0',acc:'hat',acc2:'#E8C77A'};
D.npcs.forEach(function(n){if(n.id==='hank'||n.id==='hankw')n.look=HANK;});
D.speakers.hankw=D.speakers.hank;

/* the sort quest: fluid ounces (how much it holds) or ounces (how heavy it is)? The same numbers on purpose. */
D.items.forEach(function(it){
  it.show=function(S){var q=S.q.sort;return !!(q&&q.met&&!(q.sorted||{})[it.id]&&q.hold!==it.id);};
  it.take=function(api){var q=api.S.q.sort;
    if(q.hold){api.snd.bump();api.say([{who:'sys',t:'Your hands are full. Put what you are holding in a bin first.'}]);return;}
    q.hold=it.id;api.save();api.snd.item();
    api.say([{who:'item-'+it.kind,t:'You picked up '+it.what+'. Its label says '+it.lab+'.'},{who:'sys',t:'Take it to Hank\'s bins by the barn: HOLDS or WEIGHS.'}],function(a){a.goal(D.quests.sort.goal(a.S));});};
});
function itemOf(id){return D.items.filter(function(z){return z.id===id;})[0];}

/* ───────── objects (art + footprints) ───────── */
function O(o){D.objects.push({build:function(A){var r=o.make(A);r.id=o.id;r.solid=o.solid;r.hidden=o.hidden;r.mx=o.mx;r.my=o.my;return r;}});}
function W(){return PQ._state().world;}
function jd(id){return !!(window.PQM&&PQM.jobDone(id));}
// Hank's red barn
O({id:'barn',mx:5*TS+8,my:2*TS,make:function(A){var c=A.house({w:96,h:72,roof:'#8E2F2F',wall:'#C8483C',sign:true,signC:'#FFF3DE',signDots:function(x,X,Y){for(var i=1;i<25;i+=4){x.fillStyle='#2F5D8A';x.fillRect(X+i,Y+1,2,3);}}});
  var fp=[];for(var j=3;j<=6;j++)for(var i=3;i<=8;i++)fp.push([i,j]);return {spr:c,dx:3*TS,dy:7*TS-72,base:6*TS+15,fp:fp};}});
// the dairy gate (closed until the puzzle is solved): four little pails on it light up as the locks open
function gateArt(A,n){var c=A.cv(16,26),x=c.getContext('2d');A.ell(x,8,24,7,1,'rgba(0,0,0,.22)');
  A.R(x,A.P.ol,0,4,16,20);A.R(x,'#C99A63',1,5,14,18);for(var k=1;k<15;k+=3)A.R(x,'#A97A47',k,5,1,18);A.R(x,A.P.ol,0,12,16,2);
  for(var p=0;p<4;p++){var on=p<n;A.R(x,A.P.ol,1+p*4,1,3,4);A.R(x,on?'#F5C518':'#D7D3DD',2+p*4,2,1,2);}return c;}
O({id:'gate',mx:15*TS+8,my:12*TS-6,hidden:function(){return !!W().gateOpen;},make:function(A){var a=[0,1,2,3,4].map(function(n){return gateArt(A,n);});
  return {spr:null,dx:15*TS,dy:12*TS-10,base:12*TS+15,fp:[[15,12]],anim:function(x,X,Y){x.drawImage(a[Math.min(4,(PQ._state().q.door||{}).locks||0)],Math.round(X),Math.round(Y));}};}});
// the Gallon-Man statue: rebuilt piece by piece as the page jobs are done (plaque, body, quart legs, pint arms, cup hands)
function statueArt(A,n){var c=A.cv(32,48),x=c.getContext('2d');A.ell(x,16,46,13,2,'rgba(0,0,0,.22)');
  A.R(x,A.P.ol,3,36,26,11);A.R(x,'#B9B0A2',4,37,24,9);A.R(x,'#DAD3C6',4,37,24,2);
  if(n>=1){A.R(x,A.P.ol,9,40,14,5);A.R(x,'#C9A24A',10,41,12,3);}
  if(n>=3){A.R(x,A.P.ol,10,28,5,9);A.R(x,'#FFFFFF',11,29,3,7);A.R(x,'#5E9FD6',11,33,3,1);A.R(x,A.P.ol,17,28,5,9);A.R(x,'#FFFFFF',18,29,3,7);A.R(x,'#5E9FD6',18,33,3,1);}
  if(n>=2){A.R(x,A.P.ol,8,10,16,19);A.R(x,'#FFFFFF',9,11,14,17);A.R(x,'#EAF4FF',9,24,14,4);A.R(x,A.P.ol,12,6,8,5);A.R(x,'#3A6FB0',13,7,6,3);
    A.R(x,'#5E9FD6',10,19,12,4);A.R(x,'#FFFFFF',14,20,4,2);A.R(x,'#3B2417',12,14,2,2);A.R(x,'#3B2417',18,14,2,2);A.R(x,'#D8344A',14,17,4,1);}
  if(n>=4){A.R(x,A.P.ol,3,14,5,8);A.R(x,'#FFFFFF',4,15,3,6);A.R(x,A.P.ol,24,14,5,8);A.R(x,'#FFFFFF',25,15,3,6);}
  if(n>=5){A.R(x,A.P.ol,2,22,6,5);A.R(x,'#F5C518',3,23,4,3);A.R(x,A.P.ol,24,22,6,5);A.R(x,'#F5C518',25,23,4,3);A.R(x,A.P.ol,11,3,10,4);A.R(x,'#E8C77A',12,4,8,2);}
  if(n<2){for(var k=0;k<3;k++){A.R(x,A.P.ol,6+k*8,30,5,6);A.R(x,'#FFFFFF',7+k*8,31,3,4);}}
  return c;}
O({id:'statue',mx:16*TS,my:5*TS,make:function(A){var a=[0,1,2,3,4,5].map(function(n){return statueArt(A,n);});
  return {spr:null,dx:15*TS,dy:7*TS-32,base:6*TS+15,fp:[[15,6],[16,6]],anim:function(x,X,Y){var n=['j1','j2','j3','j4','j5'].filter(jd).length;x.drawImage(a[n],Math.round(X),Math.round(Y));}};}});
// the cows' trough: empty until the last quest; then the water shows the Smudge's brick stamp on its side
O({id:'trough',mx:23*TS+8,my:8*TS,make:function(A){function art(full){var c=A.cv(48,20),x=c.getContext('2d');A.ell(x,24,18,22,2,'rgba(0,0,0,.22)');
    A.R(x,A.P.ol,1,4,46,13);A.R(x,'#A97A47',2,5,44,11);A.R(x,'#DDB27C',2,5,44,1);A.R(x,A.P.ol,4,7,40,6);A.R(x,full?'#5EB8E6':'#6E4A2A',5,8,38,4);if(full){A.R(x,'#A9E3FA',6,8,10,1);A.R(x,'#A9E3FA',24,8,8,1);
      A.R(x,A.P.ol,18,13,12,4);A.R(x,'#8F8A98',19,14,10,2);A.R(x,'#3B2417',21,14,1,1);A.R(x,'#3B2417',25,14,1,1);}return c;}
  var e=art(false),f=art(true);return {spr:null,dx:22*TS,dy:8*TS-4,base:8*TS+15,fp:[[22,8],[23,8],[24,8]],anim:function(x,X,Y){x.drawImage(W().trough?f:e,Math.round(X),Math.round(Y));}};}});
// three cows in the pasture
function cowArt(A,flip){var c=A.cv(22,16),x=c.getContext('2d');A.ell(x,11,14,9,1,'rgba(0,0,0,.2)');A.R(x,A.P.ol,3,3,15,9);A.R(x,'#FFFFFF',4,4,13,7);A.R(x,'#2A2A2A',6,5,4,3);A.R(x,'#2A2A2A',12,7,3,3);
  var hx=flip?0:16;A.R(x,A.P.ol,hx,2,6,7);A.R(x,'#FFFFFF',hx+1,3,4,5);A.R(x,'#F2A6B0',hx+1,6,4,2);A.R(x,'#3B2417',hx+(flip?1:3),4,1,1);
  A.R(x,A.P.ol,4,12,2,3);A.R(x,A.P.ol,8,12,2,3);A.R(x,A.P.ol,12,12,2,3);A.R(x,A.P.ol,15,12,2,3);return c;}
[[25,3,0],[28,6,1],[22,4,1]].forEach(function(p,k){O({id:'cow'+k,make:function(A){return {spr:cowArt(A,!!p[2]),dx:p[0]*TS-3,dy:p[1]*TS,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});
// Hank's two sort bins by the barn: a crate with a flag (HOLDS: a drop of milk · WEIGHS: a little weight)
[['binHold',10,9,'#5E9FD6'],['binWeigh',12,9,'#C2601F']].forEach(function(b,k){
  O({id:b[0],mx:b[1]*TS+8,my:b[2]*TS-8,make:function(A){var c=A.cv(16,30),x=c.getContext('2d');x.drawImage(A.crate(),0,14);
    A.R(x,A.P.ol,2,0,1,16);A.R(x,A.P.ol,3,0,12,9);A.R(x,b[3],4,1,10,7);
    if(k===0){A.R(x,'#FFFFFF',8,2,2,1);A.R(x,'#FFFFFF',7,3,4,3);}else{A.R(x,'#3B2417',7,3,4,4);A.R(x,'#3B2417',8,2,2,1);}
    return {spr:c,dx:b[1]*TS,dy:b[2]*TS-14,base:b[2]*TS+15,fp:[[b[1],b[2]]]};}});});
O({id:'westSign',make:function(A){return {spr:A.signpost('wood'),dx:1*TS,dy:16*TS-6,base:16*TS+15,fp:[[1,16]]};}});
O({id:'eastSign',make:function(A){return {spr:A.signpost('wood'),dx:30*TS,dy:16*TS-6,base:16*TS+15,fp:[[30,16]]};}});
O({id:'outfitters',make:function(A){return {spr:A.hatStall(),dx:27*TS,dy:20*TS-40,base:19*TS+15,fp:[[27,19],[28,19],[29,19]]};}});
[[11,5],[19,4],[19,10]].forEach(function(p){O({make:function(A){return {spr:A.crate(),dx:p[0]*TS,dy:p[1]*TS,base:p[1]*TS+14,fp:[[p[0],p[1]]]};}});});
[[12,16],[18,16],[24,16]].forEach(function(p){O({make:function(A){return {spr:A.lamp(),dx:p[0]*TS+3,dy:p[1]*TS-14,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});
[[3,11],[9,3],[20,6],[27,10],[13,14],[18,19],[24,18],[6,19]].forEach(function(p){O({make:function(A){return {spr:A.bush(),dx:p[0]*TS,dy:p[1]*TS,base:p[1]*TS+14,fp:[[p[0],p[1]]]};}});});
[[4,7],[30,4],[2,18]].forEach(function(p){O({make:function(A){return {spr:A.tree(),dx:p[0]*TS-8,dy:p[1]*TS-24,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});

/* ───────── quests ───────── */
function job(id){return jd(id);}
function openGate(S){if(!S.world.gateOpen){S.world.gateOpen=true;}}
/* the puzzle gate: four locks, one per ladder step (Job 1 teaches all four) */
var LOCKS=[
  {say:'Lock 1 is a cup with 5 fluid ounces of milk in it.',eq:'5 fl oz + ___ = 1 c',unit:'fl oz',a:3,
   miss:function(v){return v===5?{who:'cora',t:'That would make 10 fluid ounces. A cup is 8 fluid ounces, not 10. Count up from 5 to 8.'}:{who:'felix',t:'8 fluid ounces fill a cup. Count up from 5: 6, 7, 8.'};}},
  {say:'Lock 2 is an empty pint pail and a row of cups.',eq:'1 pt = ___',unit:'c',a:2,
   miss:function(v){return v===8?{who:'cora',t:'8 is the number for fluid ounces in a cup. Each step on the ladder has its own number. How many cups fill a pint?'}:{who:'hazel',t:'Picture the pint pail on your page. How many cups did it take to fill it?'};}},
  {say:'Lock 3 is a quart pail with 1 pint of milk in it.',eq:'1 pt + ___ = 1 qt',unit:'pt',a:1,
   miss:function(v){return {who:'atlas',t:'2 pints fill a quart. The pail already has 1 pint in it. How many more?'};}},
  {say:'Lock 4 is an empty gallon jug and a row of quart bottles.',eq:'1 gal = ___',unit:'qt',a:4,
   miss:function(v){return v===2?{who:'cora',t:'2 is the number for pints in a quart. Gallons have their own number. How many quarts filled the gallon jug?'}:{who:'hazel',t:'Picture the gallon jug on your page. How many quart bottles filled it?'};}}];
D.quests.door={
  title:'The Puzzle Gate',spawn:[4,17,'right'],next:{tab:'warmup',sel:'#mk-mental',label:'Mental Math'},
  teaser:'The Smudge locked the Hilltop Dairy gate with a pouring puzzle. Farmer Hank is stuck on the other side!',
  lockText:'Finish Climb the Ladder above to unlock this quest. The gate\'s locks use the numbers on the ladder.',
  locked:function(){return !job('j1');},
  doneText:'5 fl oz + 3 fl oz fill a cup, 2 cups fill a pint, 1 more pint fills the quart, and 4 quarts fill the gallon. The gate is open! Next: Mental Math, then the Think puzzle.',
  goal:function(S){var q=S.q.door||{};return S.world.gateOpen?'The gate is open!':'Open the 4 locks on <b>the dairy gate</b> <b>('+(q.locks||0)+'/4)</b>';},
  markers:function(S){return S.world.gateOpen?[]:[{id:'gate'}];},
  start:function(api){var q=api.q();if(!q.seen){q.seen=1;api.save();api.banner('LEVEL 10','HILLTOP DAIRY · LESSON 4 OF 7');
    api.say([{who:'opti',t:'Hoo! Welcome to Hilltop, {name}. Last time you fixed Mrs. Mabel\'s store, and you found gray fuzz that smells like hay.'},
      {who:'opti',t:'Hay means cows, and cows mean the Hilltop Dairy. But look, the dairy gate is locked!'},
      {who:'opti',t:'Walk up to the gate and see what the locks need.'}],function(a){a.goal(D.quests.door.goal(a.S));});}},
  reset:function(S){S.world.gateOpen=false;S.q.door={};},
  skip:function(S){S.world.gateOpen=true;},
  transcript:['Opti: Welcome to Hilltop. The gray fuzz smells like hay, and hay means cows. The dairy gate is locked!','Farmer Hank: The Smudge locked my gate with a pouring puzzle.','Lock 1: 5 fl oz + 3 fl oz = 1 c.','Lock 2: 1 pt = 2 c.','Lock 3: 1 pt + 1 pt = 1 qt.','Lock 4: 1 gal = 4 qt.','Farmer Hank: You opened it! The Smudge knocked over our Gallon-Man statue and drained the cows\' trough.']
};
D.quests.sort={
  title:'Fluid Ounces or Ounces?',spawn:[14,10,'up'],next:{tab:'learn',sel:'#mk-milk',label:'Bottle the Milk'},
  teaser:'The Smudge blew the labels in Hank\'s dairy shop all around the yard. Some say fl oz, and some say oz.',
  lockText:'Finish Fill the Cream Bottles on the Learn tab above to unlock this quest.',
  locked:function(){return !job('j2');},
  doneText:'Cream and cocoa are measured in fluid ounces: how much they fill. Cheese and butter are measured in ounces: how heavy they are. Next: Bottle the Milk.',
  goal:function(S){var q=S.q.sort||{},n=Object.keys(q.sorted||{}).length;
    if(!q.met)return 'Talk to <b>Farmer Hank</b> by the Gallon-Man.';
    if(q.hold)return 'Put the '+itemOf(q.hold).lab+' in the right bin: HOLDS or WEIGHS.';
    return n<4?'Find the sparkly labels and sort them <b>('+n+'/4)</b>':'Tell <b>Farmer Hank</b> you\'re done.';},
  markers:function(S){var q=S.q.sort||{};if(!q.met)return [{id:'hank'}];if(q.hold)return [{id:'binHold'},{id:'binWeigh'}];return Object.keys(q.sorted||{}).length>=4?[{id:'hank'}]:[];},
  start:function(api){openGate(api.S);api.save();},
  reset:function(S){S.q.sort={};},
  transcript:['Farmer Hank: The Smudge mixed up my shop labels. Some say fl oz, some say oz. Sort them into my bins: HOLDS (fluid ounces) or WEIGHS (ounces).','Cream, 12 fl oz: HOLDS.','Cheese, 12 oz: WEIGHS.','Cocoa, 8 fl oz: HOLDS.','Butter, 8 oz: WEIGHS.','Cora: Fluid ounces tell how much a container holds. Ounces tell how heavy something is.']
};
var STOPS=[[18,17],[23,17],[28,17]];
var ORDERS=[
  {ask:'Rosa the rope maker wants 9 quarts of cream. All my cream bottles are pint bottles. How many pint bottles?',eq:'9 qt =',unit:'pt',a:18,
   miss:function(v){return v===36?{who:'cora',t:'You used the gallon number, 4. Quarts to pints is the step with 2. Each quart is 2 pints.'}:v<9?{who:'felix',t:'Going down the ladder, the bottles get smaller, so you need MORE of them. Multiply by 2.'}:{who:'felix',t:'Each quart fills 2 pint bottles. 9 quarts is 9 × 2 pints.'};}},
  {ask:'Baker Lou wants 12 pints of buttermilk, poured into quart jars. How many quart jars?',eq:'12 pt =',unit:'qt',a:6,
   miss:function(v){return v===24?{who:'atlas',t:'Going up the ladder, the jars get bigger, so you need FEWER of them. 2 pints fill each quart jar. Group the pints by 2s.'}:v===3?{who:'cora',t:'That groups by 4. Pints to quarts is the step with 2.'}:{who:'atlas',t:'2 pints fill a quart jar. How many groups of 2 are in 12?'};}},
  {ask:'The school ordered 7 gal 1 qt of milk, in quart jugs. How many quart jugs?',eq:'7 gal 1 qt =',unit:'qt',a:29,
   miss:function(v){return v===71?{who:'hazel',t:'7 gal 1 qt isn\'t 71 quarts. Each gallon is 4 quarts. 7 gallons is 7 groups of 4, then 1 more.'}:v===28?{who:'felix',t:'7 × 4 = 28 quarts for the gallons. Don\'t forget the 1 extra quart.'}:v===15?{who:'cora',t:'Gallons to quarts is the step with 4, not 2. 7 × 4 = ?'}:{who:'felix',t:'Change the gallons first: 7 × 4 quarts. Then add the 1 extra quart.'};}}];
D.quests.escort={
  title:'The Milk Wagon',spawn:[16,16,'down'],next:{tab:'learn',sel:'#mk-board-kc',label:'Hank\'s Ladder Board'},
  teaser:'The Gallon-Man has his legs back! Now Hank needs help with his milk run down the road. Walk with him.',
  lockText:'Finish Count the Milk Cans on the Learn tab above to unlock this quest.',
  locked:function(){return !job('j4');},
  doneText:'9 qt = 18 pt, 12 pt = 6 qt, and 7 gal 1 qt = 29 qt. Every order is delivered. Next: Hank\'s Ladder Board.',
  goal:function(S){var q=S.q.escort||{},k=q.stop||0;return S.world.milkrun?'Every order is delivered!':'Help <b>Farmer Hank</b> with each order on the road ('+k+'/3).';},
  markers:function(S){return S.world.milkrun?[]:[{id:'hankw'}];},
  start:function(api){var q=api.q();openGate(api.S);
    if(!q.started&&!api.S.world.milkrun){q.started=1;q.stop=0;api.save();placeHank(api);
      api.say([{who:'hank',t:'Time for my milk run, {name}! My wagon is out on the road.'},{who:'hank',t:'Folks will stop us with orders. Help me get each one right.'},{who:'sys',t:'Walk up to Farmer Hank and his wagon, then press A (or Space).'}],function(a){a.goal(D.quests.escort.goal(a.S));});}
    else placeHank(api);},
  reset:function(S){S.world.milkrun=false;S.q.escort={};},
  skip:function(S){S.world.milkrun=true;},
  transcript:['Farmer Hank: Rosa wants 9 quarts of cream in pint bottles. 9 qt = 18 pt.','Cora: Quarts to pints is the step with 2, not 4.','Farmer Hank: Baker Lou wants 12 pints of buttermilk in quart jars. 12 pt = 6 qt.','Atlas: Going up the ladder, the jars get bigger, so you need fewer of them.','Farmer Hank: The school ordered 7 gal 1 qt of milk in quart jugs. 7 gal 1 qt = 29 qt.','Farmer Hank: Every order delivered!']
};
function placeHank(api){var e=api.ent('hankw');if(!e)return;var k=Math.min((api.S.q.escort||{}).stop||0,2);e.x=STOPS[k][0];e.y=STOPS[k][1];e.dxOff=0;e.tick=null;}
function roll(api,k){var e=api.ent('hankw');var from=e.x,to=STOPS[k][0],tt=0;e.tick=function(dt,z){tt+=dt;var p=Math.min(1,tt/0.9);z.dxOff=(to-from)*16*p;if(p>=1){z.x=to;z.dxOff=0;z.tick=null;}};}
D.quests.trough={
  title:'Fill the Trough',spawn:[20,10,'right'],next:{tab:'assignment',sel:'.gathered-box',label:'Gather your answers'},
  teaser:'The Gallon-Man stands again, and his plaque is right. But the cows are thirsty: the Smudge drained their trough.',
  lockText:'Finish the last job above (the Gallon-Man\'s plaque) to unlock this quest.',
  locked:function(){return !job('j6');},
  doneText:'6 gal 1 qt = 25 qt: 6 × 4 = 24, and 1 more. The trough is full, and its side shows the Smudge\'s stamp: GOLEM PART 1. Next lesson: the Clock Tower.',
  goal:function(S){var q=S.q.trough||{};return !q.met?'Talk to <b>Farmer Hank</b>.':!S.world.trough?'Fill <b>the trough</b>.':'The cows have water!';},
  markers:function(S){var q=S.q.trough||{};return !q.met?[{id:'hank'}]:!S.world.trough?[{id:'trough'}]:[];},
  start:function(api){openGate(api.S);api.save();},
  reset:function(S){S.world.trough=false;S.q.trough={};},
  skip:function(S){S.world.trough=true;},
  transcript:['Farmer Hank: The trough holds 6 gal 1 qt. My pail holds 1 quart. How many pails will fill it?','You: 6 gal 1 qt = 25 qt.','On the side of the full trough: a brick stamp that says GOLEM PART 1.','The Smudge: Heh heh. Part 1 is done. My Brick Golem is coming together!','Opti: The Smudge is building something. Next lesson, the Clock Tower will tell us when it comes.']
};

D.quests.crew={
  title:'Hear the Crew\'s Ways',spawn:[6,15,'down'],next:{tab:'learn',sel:'#journal-compare',label:'Which way is like yours?'},
  teaser:'The Math Crew solved the milk can puzzle. Walk to each of them and hear how they did it.',
  doneText:'Atlas poured Can B into gallon jugs. Felix changed Can A to quarts. Hazel pictured the Gallon-Man, and Cora used the right step number. Next: which way is most like yours?',
  goal:function(S){var q=S.q.crew||{},n=Object.keys(q.heard||{}).length;return n<4?'Walk to each Math Crew member and hear their way <b>('+n+'/4)</b>':'Tell <b>Opti</b> what you heard.';},
  markers:function(S){var h=(S.q.crew||{}).heard||{};var m=['atlas','felix','hazel','cora'].filter(function(c){return !h[c];}).map(function(c){return {id:c};});return m.length?m:[{id:'opti'}];},
  start:function(api){var q=api.q();if(!q.seen){q.seen=1;api.save();
    api.say([{who:'opti',t:'Hoo! The Math Crew solved the milk can puzzle. They each found the answer their own way.'},
      {who:'opti',t:'Walk up to each of them and listen. Then come back and tell me.'}],function(a){a.goal(D.quests.crew.goal(a.S));});}},
  reset:function(S){S.q.crew={};},
  transcript:['Atlas (gallons and quarts): pour Can B\'s 10 quarts into gallon jugs. 8 quarts fill 2 jugs, and 2 quarts are left: 2 gal 2 qt. That is 1 quart more than 2 gal 1 qt.','Felix (all quarts): 2 gal = 2 × 4 = 8 qt. 8 + 1 = 9 qt. 10 − 9 = 1.','Hazel (picture the Gallon-Man): a gallon jug holds 4 quart bottles. 2 gallons is 2 groups of 4.','Cora (the right step number): gallons to quarts is 4. Use the right number for each step.','Opti: Two ways, one answer. Can B holds 1 quart more.']
};
var WAYS={
  atlas:[{who:'atlas',t:'My way is gallons and quarts.'},
    {who:'atlas',t:'I pour Can B\'s 10 quarts into gallon jugs. 4 quarts fill a jug, so 8 quarts fill 2 jugs, and 2 quarts are left.'},
    {who:'atlas',t:'So Can B holds 2 gallons 2 quarts. Can A holds 2 gallons 1 quart.'},
    {who:'atlas',t:'Both have 2 gallons, and 2 quarts is 1 more than 1 quart. Can B holds 1 quart more!'}],
  felix:[{who:'felix',t:'My way is all quarts.'},
    {who:'felix',t:'I change Can A to quarts. 2 gallons is 2 × 4, so 8 quarts. And 1 more quart makes 9 quarts.'},
    {who:'felix',t:'Can B holds 10 quarts. 10 − 9 = 1.'},
    {who:'felix',t:'Can B holds 1 quart more. Same answer as Atlas!'}],
  hazel:[{who:'hazel',t:'I picture the Gallon-Man.'},
    {who:'hazel',t:'His gallon jug holds 4 quart bottles. So 2 gallons is 2 groups of 4 quart bottles.'},
    {who:'hazel',t:'Can A is 2 groups of 4 bottles and 1 more. Can B is 10 bottles. Can B has 1 more bottle!'}],
  cora:[{who:'cora',t:'Every step on the ladder has its own number.'},
    {who:'cora',t:'Gallons to quarts is 4. Quarts to pints is 2. Pints to cups is 2. And cups to fluid ounces is 8.'},
    {who:'cora',t:'Use the right number for the step you are on!'}]
};
/* ───────── talk ───────── */
/* The Crew says hello and talks about Hilltop first (HELLO). Their method lines (IDLE) unlock only after the page teaches
   both ways: CREW_TAUGHT is Bottle the Milk (Job 3), the job that teaches going up the ladder. */
var CREW_TAUGHT='j3';
var HELLO={
  atlas:'Hi, I\'m Atlas! We climbed all the way up Hilltop. You can see the whole town from here!',
  felix:'Hey, I\'m Felix! I tried to count the cows. They keep walking around, so I keep starting over!',
  hazel:'Hi! I\'m Hazel. I want to draw the Gallon-Man statue. But the Smudge knocked him over!',
  cora:'Hello, I\'m Cora. Farmer Hank has a pail or a bottle for everything. Every one has a name. I love that.'
};
var IDLE={
  atlas:'Going up the ladder, I group. 28 quarts fill 7 gallon jugs, because every 4 quarts fill a jug.',
  felix:'Going down the ladder, I multiply. 3 quarts is 3 × 2, so 6 pints. And 6 pints is 6 × 2, so 12 cups.',
  hazel:'I picture the Gallon-Man. His gallon jug holds 4 quart bottles, and each quart holds 2 pints.',
  cora:'Each step on the ladder has its own number: 4, then 2, then 2, then 8. Use the right one!'
};
var SHOP=[['cap','Explorer cap',10],['scarf','Market scarf',8],['flower','Hair flower',6],['pack','Travel pack',15]];
function shop(api){
  var Wl=PQM.wallet();
  var ch=SHOP.map(function(it){var own=Wl.gear[it[0]];return [it[1]+(own?(Wl.wear[it[0]]?' · wearing':' · put on'):' · '+it[2]+' 🪙'),function(a){
    if(own){Wl.wear[it[0]]=!Wl.wear[it[0]];PQM.saveWallet();PQ._rebuild();a.snd.sel();a.say([{who:'penny',t:Wl.wear[it[0]]?'Looking sharp!':'Off it comes. I\'ll keep it safe in your pack.'}]);return;}
    if(PQM.spend(it[2])){Wl.gear[it[0]]=1;Wl.wear[it[0]]=1;PQM.saveWallet();PQ._rebuild();a.snd.item();a.say([{who:'penny',t:'One '+it[1].toLowerCase()+', coming right up! It\'ll go with you to every lesson.'}]);}
    else{a.snd.bad();a.say([{who:'penny',t:'That costs '+it[2]+' coins, and you have '+Wl.coins+'. Earn more with correct work on the lesson page, like Climb the Ladder and Bottle the Milk.'}]);}}];});
  ch.push(['Just looking',function(a){a.say([{who:'penny',t:'Come back any time!'}]);}]);
  api.say([{who:'penny',t:'I pushed my cart all the way up the hill! You have '+Wl.coins+' coins. Anything catch your eye?',choices:ch}]);
}
function curQuest(){var s=document.querySelector('.pq-slot.pq-live');return s&&s.dataset.quest;}
function padOf(who,t,eq,unit,check){var p={who:who,t:t,pad:{eq:eq,unit:unit,check:function(v,a){check(v,a,p);}}};return p;}
D.talk=function(id,api){
  var S=api.S,q=curQuest();
  if(q==='crew'&&WAYS[id]){return api.say(WAYS[id],function(a){var C=a.S.q.crew;C.heard=C.heard||{};C.heard[id]=1;a.save();
      var n=Object.keys(C.heard).length;a.say([{who:'sys',t:n<4?'That\'s '+n+' of 4. Find the next Crew member.':'You heard all four! Go back to Opti.'}],function(b){b.goal(D.quests.crew.goal(b.S));});});}
  if(q==='crew'&&id==='opti'){var CC=S.q.crew||{};if(Object.keys(CC.heard||{}).length>=4)return api.say([{who:'opti',t:'Hoo! Two ways, and one answer: Can B holds 1 quart more.'},{who:'opti',t:'Which way is most like yours? Write about it on your page, right under the Crew\'s card.'}],function(a){a.complete();});
    return api.say([{who:'opti',t:'Walk up to each Crew member and listen to their way first.'}]);}
  if(id==='opti'){
    if(S.world.trough)return api.say([{who:'opti',t:'GOLEM PART 1. Next time we climb the Clock Tower to find out when it comes, {name}.'}]);
    return api.say([{who:'opti',t:'Hoo! Every dairy job on the page helps put the Gallon-Man back together.'}]);
  }
  if(IDLE[id])return api.say([{who:id,t:(PQM.jobDone(CREW_TAUGHT)?IDLE:HELLO)[id]}]);
  if(id==='gate'){
    if(q!=='door'||S.world.gateOpen)return api.say([{who:'sys',t:'The dairy gate.'}]);
    var Q=S.q.door;
    if(!Q.met){Q.met=1;api.save();return api.say([{who:'hank',t:'Hello out there! I\'m Farmer Hank. I\'m stuck on this side of my own gate!'},{who:'hank',t:'The Smudge locked it with a pouring puzzle. Each lock is a pail. Fill each one exactly, and the gate opens.'},{who:'sys',t:'Talk to the gate again to try the first lock.'}],function(a){a.goal(D.quests.door.goal(a.S));});}
    var k=Q.locks||0,L=LOCKS[k];
    var ask=padOf('me','Type the number, then press OK.',L.eq,L.unit,function(v,a,me){
      if(v===L.a){a.snd.good();a.S.q.door.locks=k+1;a.save();
        if(k<3)return a.say([{who:'gate',t:'Click! Lock '+(k+1)+' opens. '+(3-k)+' to go.'}],function(b){b.goal(D.quests.door.goal(b.S));});
        a.S.world.gateOpen=true;a.save();a.say([{who:'gate',t:'Click! The last lock opens, and the gate swings wide.'},
          {who:'hank',t:'You opened it! Welcome to Hilltop Dairy, {name}.'},{who:'hank',t:'Last night the Smudge knocked over our Gallon-Man statue and drained the cows\' trough.'},
          {who:'hank',t:'Help me put him back together. Each dairy job on your page puts back one piece.'}],function(b){b.goal(D.quests.door.goal(b.S));b.complete();});}
      else{a.snd.bad();a.say([L.miss(v),me]);}});
    return api.say([{who:'gate',t:L.say},ask]);
  }
  if(id==='hank'){
    if(q==='door')return api.say([{who:'hank',t:'The locks are on the gate, {name}!'}]);
    if(q==='sort'){var R=S.q.sort;
      if(!R.met)return api.say([{who:'hank',t:'Thank you for the cream bottles! But the Smudge blew through my dairy shop.'},
        {who:'hank',t:'It mixed up my labels. Some say fl oz, and some say oz. Please sort them into my two bins by the barn.'},
        {who:'hank',t:'HOLDS is for fluid ounces: how much something holds. WEIGHS is for ounces: how heavy something is. Walk onto a sparkle to pick one up.'}],
        function(a){a.S.q.sort.met=1;a.save();a.goal(D.quests.sort.goal(a.S));});
      var n=Object.keys(R.sorted||{}).length;
      if(n<4)return api.say([{who:'hank',t:R.hold?'Look at that label. Does it say fl oz or oz?':'Still '+(4-n)+' to go! Look for sparkles around the yard.'}]);
      return api.say([{who:'hank',t:'Every label is in the right bin. Thank you, {name}!'},{who:'cora',t:'Fluid ounces tell how much a container holds. Ounces tell how heavy something is. Same word, different jobs!'}],function(a){a.complete();});}
    if(q==='trough'){var T=S.q.trough;
      if(!T.met)return api.say([{who:'hank',t:'The Gallon-Man stands again, and his plaque is right. Thank you!'},{who:'hank',t:'Now my cows are thirsty. The trough holds 6 gal 1 qt, and my pail holds 1 quart. How many pails will fill it? Go to the trough and fill it.'}],
        function(a){a.S.q.trough.met=1;a.save();a.goal(D.quests.trough.goal(a.S));});
      return api.say([{who:'hank',t:S.world.trough?'Look at my happy cows!':'The trough is over by the pasture.'}]);}
    if(!S.world.gateOpen&&!job('j1'))return api.say([{who:'hank',t:'Hello! I\'m Farmer Hank. My gate is locked, so I can\'t come out!'}]);
    return api.say([{who:'hank',t:'Welcome to Hilltop Dairy! We pour everything here: cups, pints, quarts and gallons.'}]);
  }
  if(id==='hankw'){
    if(q!=='escort'||S.world.milkrun)return api.say([{who:'hank',t:'My milk wagon!'}]);
    var E=S.q.escort,s=E.stop||0,Ord=ORDERS[s];
    var o1=padOf('me','How many? Type it, then press OK.',Ord.eq,Ord.unit,function(v,a,me){
      if(v===Ord.a){a.snd.good();a.S.q.escort.stop=s+1;a.save();
        if(s<2){roll(a,s+1);return a.say([{who:'hank',t:'Right! '+Ord.eq+' '+Ord.a+' '+Ord.unit+'. On to the next stop!'}],function(b){b.goal(D.quests.escort.goal(b.S));});}
        a.S.world.milkrun=true;a.save();a.say([{who:'hank',t:'Every order delivered, and every one exactly right!'},{who:'hank',t:'I\'ll head back up to the barn. See you at the Gallon-Man, {name}.'}],function(b){b.goal(D.quests.escort.goal(b.S));b.complete();});}
      else{a.snd.bad();a.say([Ord.miss(v),me]);}});
    return api.say([{who:'hank',t:Ord.ask},o1]);
  }
  if(id==='binHold'||id==='binWeigh'){
    var B=S.q.sort;var lab={binHold:'HOLDS: fluid ounces, how much it holds',binWeigh:'WEIGHS: ounces, how heavy it is'}[id];
    if(q!=='sort'||!B||!B.hold)return api.say([{who:'sign',t:lab}]);
    var it=itemOf(B.hold);
    if(it.bin!==id){api.snd.bad();return api.say([it.bin==='binHold'?{who:'cora',t:'Look at the label: '+it.lab+'. Fluid ounces tell how much a container holds, not how heavy it is.'}:{who:'felix',t:'This label says '+it.lab+', not fluid ounces. Ounces, like on Mrs. Mabel\'s scale, tell how heavy something is.'}]);}
    B.sorted=B.sorted||{};B.sorted[it.id]=1;B.hold=null;api.save();api.snd.good();var left=4-Object.keys(B.sorted).length;
    return api.say([{who:'sys',t:'Into the '+lab.split(':')[0]+' bin! '+(left?left+' to go.':'That\'s all 4. Go tell Farmer Hank.')}],function(a){a.goal(D.quests.sort.goal(a.S));});
  }
  if(id==='trough'){
    if(q==='trough'&&S.q.trough.met&&!S.world.trough){var t1=padOf('me','How many quart pails? Type it, then press OK.','6 gal 1 qt =','qt',function(v,a,me){
        if(v===25){a.snd.good();a.S.world.trough=true;a.save();
          a.say([{fn:function(b){b.snd.item();b.fx({t:0,update:function(dt){this.t+=dt;return this.t<1.2;},draw:function(x,cx,cy,tt){for(var k=0;k<8;k++){var px=22*16+k*6-cx,py=8*16-cy+(k%2?6:0);b.A.sparkle(x,px,py,tt+k,k%2?'#A9E3FA':'#FFFFFF');}}});}},
            {who:'sys',t:'You pour 25 quart pails. The trough fills right to the top, and the cows come running.'},
            {who:'sys',t:'As the water rises, a gray brick stamp shows on the side of the trough: GOLEM PART 1.'},
            {who:'smudge',t:'Heh heh heh. Part 1 is done. My Brick Golem is coming together!'},
            {who:'opti',t:'Hoo! GOLEM PART 1. The Smudge is building something big.'},{who:'opti',t:'Next lesson, we climb the Clock Tower. It will tell us when the Golem comes, {name}.'}],function(b){b.goal(D.quests.trough.goal(b.S));b.complete();});}
        else if(v===61){a.snd.bad();a.say([{who:'hazel',t:'6 gal 1 qt isn\'t 61 quarts. Picture 6 gallon jugs, each with 4 quart bottles, then 1 more bottle.'},me]);}
        else if(v===24){a.snd.bad();a.say([{who:'felix',t:'6 × 4 = 24 quarts for the gallons. Now add the 1 extra quart.'},me]);}
        else if(v===13){a.snd.bad();a.say([{who:'cora',t:'Gallons to quarts is the step with 4, not 2. 6 × 4 = ?'},me]);}
        else {a.snd.bad();a.say([{who:'felix',t:'Change the gallons first: 6 × 4 quarts. Then add the 1 extra quart.'},me]);}});
      return api.say([{who:'sys',t:'The trough is empty and dry. A quart pail sits next to it.'},t1]);}
    return api.say([{who:'sys',t:S.world.trough?'The trough is full of clear water. On its side: GOLEM PART 1.':'The cows\' trough. It\'s empty!'}]);
  }
  if(id==='statue'){var n=['j1','j2','j3','j4','j5','j6'].filter(jd).length;
    if(n<5)return api.say([{who:'sys',t:'The Gallon-Man statue. '+(n?n+' of his 6 pieces are back.':'He\'s in pieces!')+' Each dairy job on your page puts one back.'}]);
    return api.say([{who:'sign',t:job('j6')?'THE GALLON-MAN of Hilltop Dairy. He holds 4 gal 1 qt.':'THE GALLON-MAN. He holds 3 gal 5 qt. (Hmm. The Smudge wrote on this plaque. Check it in the last job on your page.)'}]);}
  if(id==='penny'||id==='outfitters')return shop(api);
  var SIGNS={
    westSign:[{who:'sign',t:'← EASTSIDE'}],
    eastSign:[{who:'sign',t:'TOWN ROAD →'}],
    barn:[{who:'sys',t:'Farmer Hank\'s red barn. It smells like hay in here.'}],
    cow0:[{who:'sys',t:'Moooo.'}],cow1:[{who:'sys',t:'The cow looks at the empty trough. Moo?'}],cow2:[{who:'sys',t:'Moo!'}]
  };
  if(SIGNS[id])return api.say(SIGNS[id]);
};
D.afterQuest=function(q,api){
  if(window.PQM){var slot=document.querySelector('.pq-slot[data-quest="'+q+'"]');PQM.earn('quest-'+q,5,10,slot,'Quest clear!');PQM.renderBoard();}
  if(q==='trough'){try{var y=JSON.parse(localStorage.getItem('oao.pq.year')||'{}');y.L10=y.L10||{};y.L10['10.04']=1;localStorage.setItem('oao.pq.year',JSON.stringify(y));}catch(e){}}
};
return D;
})();

/* ═══ PQ_LESSON · the page side of 4.10.04 (jobs, scene, models). The shared layer is assets/sparkle/pq-layer.js ═══ */
var PQ_LESSON=(function(){
var api;
function jobDone(id){return api.jobDone(id);}
function setJob(id,src){api.setJob(id,src);}
function earn(k,c,x,s,l){return api.earn(k,c,x,s,l);}
function ls(k,d){return api.ls(k,d);}
function lsSet(k,v){return api.lsSet(k,v);}
function num(v){var t=String(v==null?'':v).replace(/[,\s]/g,'');return t===''||isNaN(+t)?null:+t;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var FL={unit:'fl oz',name:['fluid ounce','fluid ounces']},C={unit:'c',name:['cup','cups']},PT={unit:'pt',name:['pint','pints']},
    QT={unit:'qt',name:['quart','quarts']},GAL={unit:'gal',name:['gallon','gallons']};

/* the cinematic opening: pictures and one counter in quarts, no sentences.
   The cows' trough drains (8 qt … 0 qt) → the Gallon-Man's gallon jug lands on his pedestal and 4 quart bottles pop up
   beside him → two milk cans slide in (2 gallon jugs + 1 quart bottle, and 10 quart bottles) → Hank walks up, "?". */
function introScene(g,t){
  var C0=g.C,W=g.W,H=g.H,i,p;
  g.owl(W-30,H-30-Math.ceil(52/g.s),t);
  var tw=Math.round(Math.min(W*.5,160)),tx=Math.round(g.cx-tw/2),ty=Math.round(H*.30),th=22;
  // ── the trough drains, a quart at a time
  var q=25-Math.min(25,Math.max(0,Math.floor((t-.5)/.1)));
  var fade=1-g.p(t,3.0,3.3);
  if(fade>0){g.rect(tx-2,ty-2,tw+4,th+4,'rgba(255,255,255,'+(.7*fade)+')');g.rect(tx,ty,tw,th,'rgba(201,154,99,'+fade+')');
    var lv=Math.round((th-4)*q/25);g.rect(tx+2,ty+th-2-lv,tw-4,lv,'rgba(94,184,230,'+fade+')');
    if(t>.4&&q>0&&Math.floor(t*10)%2)g.rect(tx+tw-4,ty+th+2,2,4,'rgba(94,184,230,'+fade+')');
    g.text(q+' qt',g.cx,Math.round(H*.14),{col:q===0?C0.gold:C0.white});
    if(q<25&&q%5===0&&g.once('d'+q))g.blip(400+q*8,.06);}
  // ── the Gallon-Man lands: a gallon jug, then 4 quart bottles pop up beside it
  var by=Math.round(H*.58);
  p=g.p(t,3.3,3.7);if(p>0){var jy=Math.round(g.lerp(by-60,by-30,g.back(p)));g.box(Math.round(g.cx-14),jy,28,30,C0.white);g.rect(Math.round(g.cx-6),jy-6,12,6,'#3A6FB0');g.rect(Math.round(g.cx-8),jy+12,16,6,'#5E9FD6');if(p>=1&&g.once('jug'))g.blip(392,.15);}
  for(i=0;i<4;i++){p=g.p(t,3.9+i*.2,4.1+i*.2);if(p<=0)continue;var bx=Math.round(g.cx+20+i*11),bh=Math.round(14*g.back(p));g.box(bx,by-bh,8,bh,C0.white);if(p>=1&&g.once('b'+i))g.blip(523+i*60,.08);}
  // ── two milk cans: Can A (2 gallon jugs + 1 quart bottle) and Can B (10 quart bottles)
  if(t>4.8){var s=g.ease(g.p(t,4.8,5.3)),ay=Math.round(H*.80);
    var ax=Math.round(g.lerp(-60,g.cx-90,s));g.box(ax,ay-24,16,24,C0.white);g.box(ax+19,ay-24,16,24,C0.white);g.box(ax+38,ay-12,7,12,C0.white);g.text('A',ax+20,ay+4,{col:C0.gold,shadow:false});
    var bx2=Math.round(g.lerp(W+20,g.cx+20,s));for(i=0;i<10;i++)g.box(bx2+(i%5)*9,ay-12-(i>4?13:0),7,12,C0.white);g.text('B',bx2+22,ay+4,{col:C0.gold,shadow:false});}
  // ── Farmer Hank walks up and wonders "?"
  if(t>5.6){var wp=g.ease(g.p(t,5.6,6.3)),hx=Math.round(g.lerp(-18,g.cx-8,wp));g.char('hank',hx,H-26,wp<1?'right':'up',wp<1?Math.floor(t*8)%4:0);
    if(t>6.4&&!g.clean){var bp=g.back(g.p(t,6.4,6.65)),qy=H-46-Math.round(4*bp);if(g.once('q'))g.blip(660,.2);
      g.box(hx+3,qy,10,11,C0.white);g.text('?',hx+8,qy+2,{col:Math.floor(t*3)%2?C0.ink:'#3A6FB0',shadow:false});}}
}

function dairySVG(){
  var n=['j1','j2','j3','j4','j5'].filter(jobDone).length,full=!!api.state().world.trough,open=jobDone('j6');
  var s='<svg viewBox="0 0 190 120" class="mk-svg" role="img" aria-label="Hilltop Dairy: the red barn, the Gallon-Man statue and the cows\' trough">';
  s+='<rect width="190" height="120" fill="#BDE7F7"/><path d="M0 70 Q60 40 120 58 T190 52 V120 H0Z" fill="#8FCB6B"/><rect y="96" width="190" height="24" fill="#EBD2A6"/>';
  s+='<rect x="10" y="46" width="46" height="38" fill="#C8483C" stroke="#3B2417" stroke-width="2.5"/><path d="M6 48 L33 26 L60 48Z" fill="#8E2F2F" stroke="#3B2417" stroke-width="2.5"/><rect x="26" y="62" width="14" height="22" fill="#FFF3DE" stroke="#3B2417" stroke-width="2"/>';
  // the Gallon-Man, rebuilt piece by piece
  s+='<rect x="80" y="84" width="34" height="10" fill="#B9B0A2" stroke="#3B2417" stroke-width="2"/>';
  if(n>=1)s+='<rect x="88" y="86" width="18" height="6" fill="#C9A24A" stroke="#3B2417" stroke-width="1"/>';
  if(n>=3)s+='<rect x="88" y="68" width="7" height="16" fill="#FFFFFF" stroke="#3B2417" stroke-width="1.5"/><rect x="99" y="68" width="7" height="16" fill="#FFFFFF" stroke="#3B2417" stroke-width="1.5"/>';
  if(n>=2)s+='<rect x="84" y="42" width="26" height="28" rx="3" fill="#FFFFFF" stroke="#3B2417" stroke-width="2"/><rect x="91" y="36" width="12" height="7" fill="#3A6FB0" stroke="#3B2417" stroke-width="1.5"/><circle cx="92" cy="51" r="1.8" fill="#3B2417"/><circle cx="102" cy="51" r="1.8" fill="#3B2417"/><path d="M93 57 q4 3 8 0" stroke="#D8344A" stroke-width="1.5" fill="none"/>';
  if(n>=4)s+='<rect x="74" y="48" width="8" height="12" fill="#FFFFFF" stroke="#3B2417" stroke-width="1.5"/><rect x="112" y="48" width="8" height="12" fill="#FFFFFF" stroke="#3B2417" stroke-width="1.5"/>';
  if(n>=5)s+='<rect x="72" y="61" width="9" height="7" fill="#F5C518" stroke="#3B2417" stroke-width="1.5"/><rect x="113" y="61" width="9" height="7" fill="#F5C518" stroke="#3B2417" stroke-width="1.5"/>';
  if(n<2)s+='<rect x="84" y="74" width="8" height="10" fill="#FFFFFF" stroke="#3B2417" stroke-width="1.5" transform="rotate(-20 88 79)"/><rect x="102" y="76" width="8" height="10" fill="#FFFFFF" stroke="#3B2417" stroke-width="1.5" transform="rotate(25 106 81)"/>';
  // the trough
  s+='<rect x="136" y="78" width="44" height="14" fill="#A97A47" stroke="#3B2417" stroke-width="2"/><rect x="139" y="81" width="38" height="6" fill="'+(full?'#5EB8E6':'#6E4A2A')+'"/>';
  s+='<rect x="62" y="12" width="70" height="13" rx="3" fill="'+(open?'#2DB87A':'#FFF3DE')+'" stroke="#3B2417" stroke-width="2"/><text x="97" y="22" font-family="DotGothic16,Nunito" font-size="8.5" text-anchor="middle" fill="'+(open?'#fff':'#2F5D8A')+'">'+(open?'GALLON-MAN IS BACK!':'HILLTOP DAIRY')+'</text>';
  return s+'</svg>';
}

/* answer boxes under a model (any number of units), with mistake hints */
function boxes(el,cfg){
  var st=ls(cfg.key,null)||{a:[],ok:false};
  el.innerHTML='<form class="bm-form mk-two"><span class="mk-two-q">'+cfg.q+'</span>'+cfg.units.map(function(u,k){return '<input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(cfg.aria[k])+'" value="'+esc(st.a[k]||'')+'"><span class="bm-u">'+esc(u)+'</span>';}).join('')+(cfg.post?'<span class="mk-two-q">'+cfg.post+'</span>':'')+'<button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=el.querySelector('form'),ins=[].slice.call(f.querySelectorAll('input')),msg=el.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t;}
  function lock(){ins.forEach(function(x){x.disabled=true;});say(cfg.doneText,'good');}
  if(st.ok)lock();
  f.onsubmit=function(e){e.preventDefault();var v=ins.map(function(x){return num(x.value);});st.a=ins.map(function(x){return x.value;});lsSet(cfg.key,st);
    if(v.some(function(x){return x==null;}))return say(ins.length>1?'Type a number in each box.':'Type a number first.','hint');
    if(v.every(function(x,k){return x===cfg.answer[k];})){st.ok=true;lsSet(cfg.key,st);OAOKit._snd.done();lock();if(cfg.onDone)cfg.onDone(el);return;}
    OAOKit._snd.no();
    var mk=(cfg.mistakes||[]).filter(function(z){return z.v.every(function(x,k){return x===v[k];});})[0];if(mk)return say(mk.text,'hint');
    if(cfg.rate&&v.length===2&&v[0]*cfg.rate+v[1]===cfg.answer[0]*cfg.rate+cfg.answer[1])return say('That\'s the right amount! But '+v[1]+' '+cfg.units[1]+' is '+cfg.rate+' or more. '+cfg.rate+' of them fill another '+cfg.units[0]+'.','hint');
    say(cfg.hint,'hint');};
}
/* a step chain: one box per step, each checked on its own */
function chain(el,cfg){
  var S=cfg.steps,st=ls(cfg.key,null)||{a:[],ok:false};
  el.innerHTML='<form class="bm-form mk-two mk-chain">'+S.map(function(x,k){return '<div class="mk-step"><span class="mk-two-q">'+(k+1)+'. '+x.q+'</span><input type="text" inputmode="numeric" autocomplete="off" aria-label="Step '+(k+1)+': '+esc(x.q.replace(/<[^>]+>/g,''))+' how many '+esc(x.uname||x.u)+'" value="'+esc(st.a[k]||'')+'"><span class="bm-u">'+x.u+'</span></div>';}).join('')+'<button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=el.querySelector('form'),ins=[].slice.call(f.querySelectorAll('input')),msg=el.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t;}
  function lock(){ins.forEach(function(x){x.disabled=true;});say(cfg.doneText,'good');}
  if(st.ok)lock();
  f.onsubmit=function(e){e.preventDefault();var v=ins.map(function(x){return num(x.value);});st.a=ins.map(function(x){return x.value;});lsSet(cfg.key,st);
    for(var k=0;k<S.length;k++){if(v[k]==null)return say('Fill in step '+(k+1)+'.','hint');if(v[k]!==S[k].a){OAOKit._snd.no();return say('Step '+(k+1)+': '+(S[k].miss[v[k]]||S[k].hint),'hint');}}
    st.ok=true;lsSet(cfg.key,st);OAOKit._snd.done();lock();if(cfg.onDone)cfg.onDone(el);};
}
function mount(m,cls){var d=document.createElement('div');d.className=cls||'';m.appendChild(d);return d;}
function both(keys,id,el){if(keys.every(function(k){var s=ls(k,null);return s&&(s.ok||s.fired);}))setJob(id,el);}

/* Job 1 · Climb the Ladder (Pour Station, fill): each step of the ladder, poured by hand (IP 1's printed facts) */
function modelLadder(m){
  function rung(name,big,small,rate,text,q,u,mist,done){return {name:name,mode:'fill',big:big,small:small,rate:rate,text:text,
    ask:{q:q,units:[u],answer:[rate],mistakes:mist,hint:'Count the '+small.name[1]+' you poured into the '+big.name[0]+'.',doneText:done},doneText:done};}
  OAOKit.pour(m,{key:'g4-4-10-04-ok-ladder',rounds:[
    rung('Fill a cup',C,FL,8,'Hank\'s smallest pour is <b>1 fluid ounce</b>, a little creamer. Drag or tap a creamer to pour it into the <b>cup</b>. Keep pouring until the cup is full.','1 c =','fl oz',[{v:[10],text:'Count the creamers you poured, one at a time. Are there 10?'}],'8 fluid ounces fill 1 cup. <b>1 c = 8 fl oz.</b>'),
    rung('Fill a pint',PT,C,2,'Now pour cups into the <b>pint</b> pail until it is full.','1 pt =','c',[{v:[8],text:'8 is the number of fluid ounces in a cup. Count the cups you poured into the pint.'}],'2 cups fill 1 pint. <b>1 pt = 2 c.</b>'),
    rung('Fill a quart',QT,PT,2,'Now pour pints into the <b>quart</b> bottle until it is full.','1 qt =','pt',[{v:[4],text:'Count the pints you poured into the quart. Each step on the ladder has its own number.'}],'2 pints fill 1 quart. <b>1 qt = 2 pt.</b>'),
    rung('Fill a gallon',GAL,QT,4,'Last step: pour quarts into the <b>gallon</b> jug until it is full.','1 gal =','qt',[{v:[2],text:'Count the quart bottles you poured into the gallon jug. Is it 2?'}],'4 quarts fill 1 gallon. <b>1 gal = 4 qt.</b> That\'s the whole ladder!')],
    onRound:function(i,root){earn('ladder-'+i,2,0,root,'');},
    onDone:function(root){setJob('j1',root);}});
}
/* Warm-Up · Mental Math: make a cup (number pairs for 8; 8 is taught in Job 1 above) */
function modelMental(m){
  OAOKit.mentalMath(m,{key:'g4-4-10-04-mm',name:'Make a cup',
    how:'1 cup is 8 fluid ounces. Find the fluid ounces that go with the ones you have to make 8.',
    example:{q:'6 fl oz + ? = 1 c',bond:{whole:8,parts:[6,2]},steps:['1 c is 8 fl oz.','6 + 2 = 8','So 6 fl oz + 2 fl oz = 1 c.']},
    problems:[{q:'5 fl oz + ? = 1 c',pre:'5 fl oz +',post:'fl oz = 1 c',a:3,hint:'Count up from 5 to 8: 6, 7, 8.'},
              {q:'1 fl oz + ? = 1 c',pre:'1 fl oz +',post:'fl oz = 1 c',a:7,hint:'1 and what make 8? Count up from 1.'},
              {q:'4 fl oz + ? = 1 c',pre:'4 fl oz +',post:'fl oz = 1 c',a:4,hint:'4 and 4 make 8. A double!'},
              {q:'2 fl oz + ? = 1 c',pre:'2 fl oz +',post:'fl oz = 1 c',a:6,hint:'2 and what make 8? Think 2 + 6.'}],
    onRight:function(i,el){earn('mm-'+i,1,0,el,'');},onDone:function(root){earn('mm-all',2,3,root,'Mental math done!');}});
}
/* Warm-Up · Think: which can holds more, Can A (2 gal 1 qt) or Can B (10 qt)? Try it any way, before any teaching */
function modelThink(m){
  var a=mount(m,'mk-think-pour'),b=mount(m,'mk-think-ans');
  OAOKit.pour(a,{key:'g4-4-10-04-ok-think',rounds:[
    {name:'Can A: 2 gal 1 qt',mode:'down',big:GAL,small:QT,rate:4,start:{big:2,small:1},
     text:'Can A holds <b>2 gal 1 qt</b>: 2 full gallon jugs and 1 quart bottle. You can pour a gallon jug out into quart bottles (drag or tap it), or work it out your own way.',
     doneText:'Every gallon jug is poured out into quart bottles. Count the bottles, then try Can B.'},
    {name:'Can B: 10 qt',mode:'up',big:GAL,small:QT,rate:4,start:{small:10},
     text:'Can B holds <b>10 qt</b>: 10 quart bottles. You can pour the bottles into gallon jugs (drag or tap one), or work it out your own way.',
     doneText:'Every full gallon jug is filled. Compare the two cans.'}]});
  var st=ls('g4-4-10-04-think-ans',null)||{a:['',''],ok:false};
  b.innerHTML='<form class="bm-form mk-two"><label class="mk-two-q" for="thinkWho">Which can holds more, A or B?</label><input id="thinkWho" type="text" autocomplete="off" aria-label="Which can holds more" value="'+esc(st.a[0])+'" style="width:5em">'+
    '<label class="mk-two-q" for="thinkBy">By how many quarts?</label><input id="thinkBy" type="text" inputmode="numeric" autocomplete="off" aria-label="By how many quarts" value="'+esc(st.a[1])+'"><span class="bm-u">qt</span><button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=b.querySelector('form'),msg=b.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.textContent=t;}
  var DONE='Yes! Can B holds more, by 1 quart. On the Learn tab, the Math Crew shows two ways to find it. Did one match yours?';
  if(st.ok){say(DONE,'good');[].forEach.call(f.querySelectorAll('input'),function(x){x.disabled=true;});}
  f.onsubmit=function(e){e.preventDefault();var who=f.thinkWho.value.trim().toLowerCase(),by=num(f.thinkBy.value);st.a=[f.thinkWho.value,f.thinkBy.value];lsSet('g4-4-10-04-think-ans',st);
    if(!who||by==null)return say('Type A or B, and a number of quarts.','hint');
    var isB=/\bb\b|can b/.test(who),isA=/\ba\b|can a/.test(who);
    if(isB&&by===1){st.ok=true;lsSet('g4-4-10-04-think-ans',st);OAOKit._snd.done();say(DONE,'good');[].forEach.call(f.querySelectorAll('input'),function(x){x.disabled=true;});earn('think',4,4,b,'You tried it first!');return;}
    OAOKit._snd.no();
    if(isA&&by===11)return say('Is 2 gal 1 qt the same as 21 quarts? Pour Can A out: each gallon jug fills 4 quart bottles, not 10.','hint');
    if(isA)return say('Pour Can A\'s gallon jugs out into quart bottles. Then count: which can has more quart bottles?','hint');
    if(isB)return say('Can B holds more, yes! Now count: how many more quart bottles does it have than Can A?','hint');
    say('Pour one of the cans so both are in the same unit, then compare.','hint');};
}
/* Job 2 · Fill the Cream Bottles (Pour Station, down): 3 qt → 6 pt → 12 c, then the chain to fl oz (IP 2's chain, IP 3a–c's direction) */
function modelCream(m){
  var a=mount(m),c=mount(m),d=mount(m);
  OAOKit.pour(a,{key:'g4-4-10-04-ok-cream',rounds:[
    {name:'Quarts → pints',mode:'down',big:QT,small:PT,rate:2,start:{big:3},text:'Hank has <b>3 quart</b> bottles of cream. Pour each quart out into pint bottles (drag or tap it).',
     ask:{q:'3 qt =',units:['pt'],answer:[6],mistakes:[{v:[12],text:'You used the gallon number, 4. Each quart fills 2 pint bottles. Count the pint bottles.'},{v:[1],text:'Going down the ladder, the bottles get smaller, so there are MORE of them. Count the pint bottles.'}],hint:'Count the pint bottles.',doneText:'3 qt = <b>6 pt</b>. Each quart filled 2 pints: 3 × 2 = 6.'},doneText:'3 qt = 6 pt.'},
    {name:'Pints → cups',mode:'down',big:PT,small:C,rate:2,start:{big:6},text:'Now pour each of the <b>6 pints</b> out into cups.',
     ask:{q:'6 pt =',units:['c'],answer:[12],mistakes:[{v:[24],text:'Pints to cups is a step with 2, not 4. Each pint fills 2 cups. Count the cups.'},{v:[3],text:'Going down the ladder, there are MORE of the smaller unit. Count the cups.'}],hint:'Count the cups.',doneText:'6 pt = <b>12 c</b>. Each pint filled 2 cups: 6 × 2 = 12.'},doneText:'6 pt = 12 c.'}],
    onDone:function(root){both(['g4-4-10-04-ch-cream','g4-4-10-04-bx-vat'],'j2',root);}});
  chain(c,{key:'g4-4-10-04-ch-cream',steps:[
      {q:'3 qt = 3 × 2 =',u:'pt',uname:'pints',a:6,hint:'Each quart is 2 pints.',miss:{12:'Quarts to pints is the step with 2, not 4.',1:'Going down the ladder, multiply.'}},
      {q:'6 pt = 6 × 2 =',u:'c',uname:'cups',a:12,hint:'Each pint is 2 cups.',miss:{24:'Pints to cups is the step with 2.',3:'Going down the ladder, multiply.'}},
      {q:'12 c = 12 × 8 =',u:'fl oz',uname:'fluid ounces',a:96,hint:'Each cup is 8 fluid ounces. Multiply 12 × 8.',miss:{24:'Cups to fluid ounces is the step with 8, not 2.',20:'Multiply, don\'t add: 12 groups of 8.',120:'That is 12 × 10. A cup is 8 fluid ounces, not 10.'}}],
    doneText:'3 qt = 6 pt = 12 c = <b>96 fl oz</b>. Down the ladder, one step at a time: × 2, × 2, × 8.',
    onDone:function(el){both(['g4-4-10-04-ok-cream','g4-4-10-04-bx-vat'],'j2',el);}});
  boxes(d,{key:'g4-4-10-04-bx-vat',q:'Hank\'s milk vat holds 9 gal. 9 gal =',units:['qt'],aria:['Milk vat, quarts'],answer:[36],
    mistakes:[{v:[18],text:'9 × 2 uses the pint number. Gallons to quarts is the step with 4.'},{v:[13],text:'Multiply, don\'t add: every gallon is 4 quarts, and there are 9 of them.'}],
    hint:'Each gallon is 4 quarts. Multiply 9 × 4.',doneText:'9 gal = <b>36 qt</b>. 9 × 4 = 36.',
    onDone:function(el){both(['g4-4-10-04-ok-cream','g4-4-10-04-ch-cream'],'j2',el);}});
}
/* Job 3 · Bottle the Milk (Pour Station, up): 40 fl oz → 5 c, 28 qt → 7 gal, then 18 c → 9 pt (IP 3d, 4a, 4b's direction) */
function modelMilk(m){
  var a=mount(m),d=mount(m);
  OAOKit.pour(a,{key:'g4-4-10-04-ok-milk',rounds:[
    {name:'Creamers → cups',mode:'up',big:C,small:FL,rate:8,start:{small:40},text:'Hank has <b>40</b> little creamers. Each holds <b>1 fluid ounce</b>. Pour them into cup measures (drag or tap a creamer). After one full cup, you can fill a whole cup at once.',
     ask:{q:'40 fl oz =',units:['c'],answer:[5],mistakes:[{v:[320],text:'Going up the ladder, the containers get bigger, so you get FEWER of them. Count the full cups.'},{v:[20],text:'Cups to fluid ounces is the step with 8, not 2. Count the full cups.'}],hint:'Count the full cups.',doneText:'40 fl oz = <b>5 c</b>. Every 8 fluid ounces filled a cup: 40 ÷ 8 = 5.'},doneText:'40 fl oz = 5 c.'},
    {name:'Quarts → gallons',mode:'up',big:GAL,small:QT,rate:4,start:{small:28},text:'Now <b>28 quart</b> bottles of milk. Pour them into gallon jugs.',
     ask:{q:'28 qt =',units:['gal'],answer:[7],mistakes:[{v:[112],text:'Going up the ladder, the jugs get bigger, so you get FEWER of them. Count the full gallon jugs.'},{v:[14],text:'Quarts to gallons is the step with 4, not 2. Count the full jugs.'}],hint:'Count the full gallon jugs.',doneText:'28 qt = <b>7 gal</b>. Every 4 quarts filled a jug: 28 ÷ 4 = 7.'},doneText:'28 qt = 7 gal.'}],
    onRound:function(i,root){earn('milk-'+i,2,0,root,'');},
    onDone:function(root){both(['g4-4-10-04-bx-pints'],'j3',root);}});
  boxes(d,{key:'g4-4-10-04-bx-pints',q:'Hank pours 18 cups of milk into pint bottles. 18 c =',units:['pt'],aria:['18 cups, in pints'],answer:[9],
    mistakes:[{v:[36],text:'Going up the ladder, the bottles get bigger, so you need FEWER of them. 2 cups fill each pint. Group by 2s.'},{v:[16],text:'Group the cups into pairs: how many pairs are in 18? (Don\'t subtract 2.)'}],
    hint:'2 cups fill a pint bottle. How many groups of 2 are in 18? (18 ÷ 2)',doneText:'18 c = <b>9 pt</b>. 18 ÷ 2 = 9.',
    onDone:function(el){both(['g4-4-10-04-ok-milk'],'j3',el);}});
}
/* Job 4 · Count the Milk Cans: make the next gallon, then 4 gal 2 qt → 18 qt and 27 qt → 6 gal 3 qt (IP 4c and 4d's shapes) */
function modelNext(m){
  OAOKit.mentalMath(m,{key:'g4-4-10-04-mm-next',name:'Make the next gallon',
    how:'Hank pours more quarts of milk into a can. Split the quarts he adds with a number bond. Use part of them to fill the open gallon, 4 quarts. Then add what is left.',
    example:{q:'1 gal 3 qt + 2 qt',bond:{whole:2,parts:[1,1]},steps:['3 qt + 1 qt = 4 qt = 1 gal, so 1 gal 3 qt + 1 qt = 2 gal.','2 gal + 1 qt = 2 gal 1 qt.']},
    problems:[{q:'2 gal 3 qt + 3 qt',units:['gal','qt'],a:[3,2],rate:4,hint:'3 qt + 1 qt fill a gallon. Split 3 into 1 and 2.'},{q:'3 gal 2 qt + 2 qt',units:['gal','qt'],a:[4,0],rate:4,hint:'2 qt + 2 qt fill exactly 1 gallon. How many quarts are left over?'}],
    onRight:function(i,el){earn('next-'+i,1,0,el,'');},onDone:function(root){earn('next-all',2,3,root,'Next gallon made!');}});
}
function modelCans(m){
  OAOKit.pour(m,{key:'g4-4-10-04-ok-cans',rounds:[
    {name:'Can 1: 4 gal 2 qt',mode:'down',big:GAL,small:QT,rate:4,start:{big:4,small:2},text:'Milk can 1 holds <b>4 gal 2 qt</b>: 4 gallon jugs and 2 quart bottles. Pour each gallon jug out into quart bottles.',
     ask:{q:'4 gal 2 qt =',units:['qt'],answer:[18],mistakes:[{v:[42],text:'4 gal 2 qt isn\'t 42 quarts. Count the quart bottles: each gallon jug filled 4 of them, then add the 2 that were already there.'},{v:[16],text:'That\'s the gallons: 4 × 4 = 16. Now add the 2 quarts that were already there.'},{v:[10],text:'Gallons to quarts is the step with 4, not 2. Count the quart bottles.'}],
       hint:'Count all the quart bottles.',doneText:'4 gal 2 qt = <b>18 qt</b>. 4 × 4 = 16, and 2 more.'},doneText:'4 gal 2 qt = 18 qt.'},
    {name:'Can 2: 27 qt',mode:'up',big:GAL,small:QT,rate:4,start:{small:27},text:'Milk can 2 holds <b>27 qt</b>. Pour the quart bottles into gallon jugs. When there aren\'t enough quarts left to fill a jug, they stay as quarts.',
     ask:{q:'27 qt =',units:['gal','qt'],answer:[6,3],mistakes:[{v:[5,7],text:'7 quarts is more than a gallon. 4 of them fill another jug. How many full jugs, and how many quarts are left?'},{v:[2,7],text:'That groups by 10, like tens and ones. A gallon is 4 quarts. Count the full jugs.'},{v:[6,0],text:'Look at the quart bottles that are left over. They count too!'},{v:[108,0],text:'Going up the ladder, you get FEWER, bigger jugs. Count the full gallon jugs.'}],
       hint:'Count the full gallon jugs, then the quart bottles left over.',doneText:'27 qt = <b>6 gal 3 qt</b>. 27 ÷ 4 gives 6 R 3: 6 full jugs, and 3 quarts left over.'},doneText:'27 qt = 6 gal 3 qt.'}],
    onRound:function(i,root){earn('cans-'+i,2,0,root,'');},
    onDone:function(root){setJob('j4',root);}});
}
/* Job 5 · Milk for the Picnic: Story Bar Model (4 equal gallons → 16 qt), then 16 qt → 32 pt → 64 c → 64 glasses (IP 5's shape) */
function modelPicnic(m){
  var a=mount(m),c=mount(m);
  OAOKit.barModel(a,{key:'g4-4-10-04-bm-picnic',kind:'part-whole',unit:'qt',todo:[],
    story:['Hank brings milk to the Hilltop School picnic. ',{t:'He fills a gallon jug with plain milk,',put:'p0',label:'1 gal = 4 qt'},' ',{t:'a gallon jug with chocolate milk,',put:'p1',label:'1 gal = 4 qt'},' ',{t:'a gallon jug with strawberry milk,',put:'p2',label:'1 gal = 4 qt'},' ',{t:'and one more gallon jug of plain milk.',put:'p3',label:'1 gal = 4 qt'},' How many quarts of milk does he bring?'],
    whole:{name:'all the milk',unknown:true},partsName:'jugs',
    parts:[{id:'p0',value:4,name:'plain'},{id:'p1',value:4,name:'chocolate'},{id:'p2',value:4,name:'strawberry'},{id:'p3',value:4,name:'plain'}],
    question:'How many quarts of milk does Hank bring?',answer:16,
    mistakes:[{value:8,text:'Each jug is 1 gallon, and 1 gallon is 4 quarts, not 2. 4 jugs × 4 quarts = ?'},{value:1,text:'Going down the ladder to quarts, there are MORE of them. Each gallon jug is 4 quarts.'},{value:4,text:'That\'s one jug. Hank brings 4 jugs.'}],
    hint:'Look at the bar: 4 equal jugs, and each one is 4 quarts. Add them, or multiply 4 × 4.',
    sym:'4 gal = 4 × 4 qt = 16 qt',
    doneText:'4 gal = 16 qt. Now go down the ladder to cups below.',
    onDone:function(root){both(['g4-4-10-04-ch-picnic'],'j5',root);}});
  chain(c,{key:'g4-4-10-04-ch-picnic',steps:[
      {q:'Change the quarts to pints: 16 qt =',u:'pt',uname:'pints',a:32,hint:'Each quart is 2 pints. Multiply 16 × 2.',miss:{64:'Quarts to pints is the step with 2, not 4.',8:'Going down the ladder, multiply.',18:'Multiply, don\'t add: 16 groups of 2.'}},
      {q:'Change the pints to cups: 32 pt =',u:'c',uname:'cups',a:64,hint:'Each pint is 2 cups. Multiply 32 × 2.',miss:{256:'Pints to cups is the step with 2, not 8.',16:'Going down the ladder, multiply.',34:'Multiply, don\'t add: 32 groups of 2.'}},
      {q:'Each child gets a 1-cup glass. How many children get a glass?',u:'children',uname:'children',a:64,hint:'1 glass for each cup.',miss:{16:'That\'s the quarts. Each child gets 1 cup, so use the cups.',32:'That\'s the pints. Each glass is 1 cup.'}}],
    doneText:'16 qt = 32 pt = <b>64 c</b>. That\'s <b>64</b> glasses of milk for the picnic!',
    onDone:function(el){both(['g4-4-10-04-bm-picnic'],'j5',el);}});
}
/* Last job · Fix the Gallon-Man's plaque: the Smudge wrote 3 gal 5 qt. Pour it: 5 quarts fill another gallon, 1 is left */
function modelProve(m){
  OAOKit.pour(m,{key:'g4-4-10-04-ok-prove',rounds:[
    {name:'The plaque',mode:'up',big:GAL,small:QT,rate:4,start:{big:3,small:5},
     text:'Pour out what the plaque says: <b>3 gal 5 qt</b> is 3 full gallon jugs and 5 quart bottles. Pour the quart bottles into a new gallon jug.',
     ask:{q:'The plaque should say',units:['gal','qt'],answer:[4,1],
       mistakes:[{v:[3,5],text:'That\'s what the Smudge wrote! 5 quarts is more than a gallon. Look at the jugs now: how many are full?'},
                 {v:[4,5],text:'You filled a new jug, so 4 of the 5 quarts went into it. How many quart bottles are left?'},
                 {v:[8,0],text:'That counts each quart bottle as a whole gallon. It takes 4 quarts to fill one gallon jug. Count the full jugs and the bottles left.'}],
       hint:'Count the full gallon jugs, then the quart bottles left over.',
       doneText:'The plaque should say <b>4 gal 1 qt</b>. 5 qt = 4 qt + 1 qt, and 4 qt fill a gallon. So 3 gal 5 qt = 4 gal 1 qt.'},
     doneText:'3 gal 5 qt = 4 gal 1 qt. You fixed the plaque!'}],
    onDone:function(root){earn('prove',5,5,root,'You proved it!');setJob('j6',root);}});
}
function modelBonus(m){
  OAOKit.challenge(m,{key:'g4-4-10-04-bonus',title:'Bonus quest: the two-pail puzzle',
    text:'<p>Hank has a big pail that holds <strong>10 cups</strong>, and a jug that holds <strong>3 cups</strong>. Neither one has any marks on it. The big pail is full of water. He fills the jug from the pail, then pours the jug into the trough. He does that again and again. How many times must he fill the jug to leave exactly <strong>1 cup</strong> in the big pail?</p>',
    answer:3,unit:'times',hint:'Each time, 3 cups leave the big pail. Start at 10 and take away 3 until 1 cup is left.',
    explain:'<p>10 − 3 = 7. 7 − 3 = 4. 4 − 3 = 1. He fills the jug <strong>3 times</strong>, and exactly 1 cup is left in the big pail.</p>',
    onDone:function(root){earn('bonus',8,8,root,'Bonus quest!');}});
}
function bind(f){return function(m,a){api=a;return f(m);};}
return {
  id:'4.10.04', key:'g4-4-10-04', title:'Customary Units of Capacity', unit:10, level:'Metric Market', standard:'MA.4.M.1.2', boss:null,
  problem:{title:'Rebuild the Gallon-Man',text:'The Smudge knocked over the Gallon-Man statue at Hilltop Dairy. Each job below uses today\'s math and puts one piece back. Finish all six and he stands again.',jobWord:'Dairy job',jobsTitle:'Dairy jobs'},
  jobs:[
    {id:'j1',t:'Climb the ladder',w:'Warm-Up · Climb the Ladder',go:'#mk-ladder',tab:'warmup',r:'-2deg',coins:5},
    {id:'j2',t:'Fill the cream bottles',w:'Learn · Fill the Cream Bottles',go:'#mk-cream',tab:'learn',r:'1.5deg',coins:8},
    {id:'j3',t:'Bottle the milk',w:'Learn · Bottle the Milk',go:'#mk-milk',tab:'learn',r:'-1deg',coins:6},
    {id:'j4',t:'Count the milk cans',w:'Learn · Count the Milk Cans',go:'#mk-cans',tab:'learn',r:'1deg',coins:6},
    {id:'j5',t:'Pour the picnic milk',w:'Learn · Milk for the Picnic',go:'#mk-picnic',tab:'learn',r:'2deg',coins:6},
    {id:'j6',t:'Fix the Gallon-Man\'s plaque',w:'Show What You Know',go:'#mk-prove',tab:'assignment',r:'-1.5deg',coins:10}],
  scene:function(a){api=a;return dairySVG();},
  hints:[
    {sel:'#mk-think .callout-think',rungs:['You want to compare two cans. One is in gallons and quarts, and one is only in quarts. Try to get them in the same unit.','4 quarts fill a gallon jug. Pour Can A\'s jugs out into quart bottles, or pour Can B\'s bottles into gallon jugs. Then compare.','Here are different numbers: 1 gal 3 qt is 4 + 3 = 7 qt. That is 1 quart less than 8 qt.']},
    {sel:'#tab-assignment .q-block',i:0,inside:true,rungs:['Going down to a smaller unit? Multiply. Going up to a bigger unit? Group, or divide.','Use the right number for the step: gallons and quarts 4, quarts and pints 2, pints and cups 2, cups and fluid ounces 8.','Here are different numbers: 9 pt = 9 × 2 = 18 c. And 24 fl oz = 24 ÷ 8 = 3 c.']},
    {sel:'#tab-assignment .q-block',i:1,inside:true,rungs:['For (a), change the gallons to quarts, then add the extra quarts. For (b), fill gallon jugs with 4 quarts each.','(a) gallons × 4, then add. (b) Divide by 4: the answer is the gallons, and the remainder is the quarts left over.','Here are different numbers: 2 gal 3 qt = 8 + 3 = 11 qt. And 14 qt = 3 gal 2 qt, because 14 ÷ 4 gives 3 R 2.']},
    {sel:'#tab-assignment .q-block',i:2,inside:true,rungs:['Go down the ladder one step at a time: gallons, then quarts, then pints.','Gallons to quarts: × 4. Quarts to pints: × 2.','Here are different numbers: 2 gal = 2 × 4 = 8 qt. 8 qt = 8 × 2 = 16 pt.']},
    {sel:'#mk-cream .activity-body > .mk-todo',rungs:['Tap a full quart bottle. It pours out into pint bottles. Do that for all 3, then count.','Each quart fills 2 pints, and each pint fills 2 cups: × 2, then × 2. For fluid ounces, each cup is 8: × 8.','Here are different numbers: 7 qt = 14 pt = 28 c = 224 fl oz.']},
    {sel:'#mk-milk .activity-body > .mk-todo',rungs:['Tap creamers to pour them into the open cup. When it is full, start the next one.','Going up the ladder, group. 8 fluid ounces fill a cup, and 4 quarts fill a gallon. Count the full ones.','Here are different numbers: 24 fl oz = 3 c, because 24 ÷ 8 = 3. And 20 c = 10 pt, because 20 ÷ 2 = 10.']},
    {sel:'#mk-cans .activity-body > .mk-todo',rungs:['Can 1: tap each gallon jug to pour it into quart bottles. Can 2: tap quart bottles to fill gallon jugs.','Gallons to quarts: × 4, then add the extra quarts. Quarts to gallons: group by 4s, and keep the leftover quarts.','Here are different numbers: 9 gal 2 qt = 36 + 2 = 38 qt. And 22 qt = 5 gal 2 qt.']},
    {sel:'#mk-ladder .activity-body > .mk-todo',rungs:['Tap the small container again and again, or drag it into the big one. Count each pour.','Stop when the big container is full to the top. The number of pours is the answer.','Each step has its own number. Write them on paper as you go: cup, pint, quart, gallon.']},
    {sel:'#mk-picnic .activity-body > .mk-todo',rungs:['Tap each sentence about a jug, then tap a part of the bar. Each part is 1 gallon.','Each gallon is 4 quarts. 4 jugs is 4 × 4 quarts. Then go down the ladder: quarts × 2 = pints, pints × 2 = cups.','Here are different numbers: 10 gal = 40 qt = 80 pt = 160 c. That fills 160 one-cup glasses.']},
    {sel:'#mk-prove .activity-body > .mk-todo',rungs:['Tap the quart bottles to pour them into the open gallon jug.','4 quarts fill the new jug. Count the full jugs and the bottles left over.','Here are different numbers: 1 gal 6 qt. 6 qt = 4 qt + 2 qt, so it is 2 gal 2 qt.']}],
  writing:{
    'journal-notice':{min:6,chips:[{label:'I notice',words:['notice','see','one is','one has','gallons','quarts','two units','only quarts','gal','qt','more','different','can a','can b','bigger']},{label:'I wonder',words:['wonder','how','which','why','?','if','what']}]},
    'journal-compare':{min:12,chips:[{label:'a Crew member\'s way',words:['atlas','felix','hazel','cora','all quarts','gallons and quarts','jug','jugs','pour','poured','group','gallon-man','step']},{label:'what you would do for 150 qt',words:['150','quarts','quart','gallons','gallon','gal','qt','divide','÷','4','four','group','groups','times','multiply','jugs']},{label:'why',words:['because','so','easier','faster','since','simpler','makes sense','quick','like','better']}]},
    'journal-think':{min:10,chips:[{label:'which can holds more',words:['b','can b']},{label:'by how much',words:['1','one','1 qt','1 quart','a quart']},{label:'how you knew',words:['4','8','9','10','quarts','quart','gallons','gallon','gal','qt','poured','pour','bottles','jugs','changed','change','turned','times','added','plus','minus','subtract','compare','compared','bigger','more','groups']}]},
    'journal-big':{min:12,chips:[{label:'down: multiply, up: group',words:['multiply','times','×','group','divide','÷','down','up','smaller','bigger','more','fewer']},{label:'an example of your own',words:['gal','qt','pt','fl oz','c','cup','cups','pint','pints','quart','quarts','gallon','gallons','=','equals','is']},{label:'the step number',words:['4','2','8','four','two','eight','step','ladder','number']}]}},
  bigIdea:'To change a capacity to another unit, use the ladder one step at a time. Going down to smaller units, multiply by the step\'s number (gallons × 4 = quarts, quarts × 2 = pints, pints × 2 = cups, cups × 8 = fluid ounces). Going up to bigger units, group by that number, and keep any leftover in the smaller unit.',
  words:[{w:'capacity',d:'how much a container can hold'},{w:'fluid ounce',d:'a tiny unit of capacity, about 2 tablespoons'},{w:'cup',d:'a unit of capacity, about a mug of cocoa'},
    {w:'pint',d:'a unit of capacity, about a big glass of milk'},{w:'quart',d:'a unit of capacity, a little less than a liter'},{w:'gallon',d:'a big unit of capacity, about a big jug of milk'}],
  intendedWrong:['3 gal 5 qt','2 gal 1 qt the same as 21 quarts','6 gal 1 qt isn\'t 61 quarts','7 gal 1 qt isn\'t 71 quarts','4 gal 2 qt isn\'t 42 quarts'],
  intro:{card:false,len:7.4,
    alt:'A cows\' trough drains, quart by quart, from 25 quarts to 0. A gallon jug lands on the Gallon-Man\'s pedestal, and 4 quart bottles pop up beside it. Two milk cans slide in: Can A is 2 gallon jugs and 1 quart bottle, and Can B is 10 quart bottles. Farmer Hank walks up and wonders which can holds more.',
    scene:introScene},
  models:{ladder:bind(modelLadder),mental:bind(modelMental),think:bind(modelThink),cream:bind(modelCream),milk:bind(modelMilk),next:bind(modelNext),cans:bind(modelCans),picnic:bind(modelPicnic),prove:bind(modelProve),bonus:bind(modelBonus)}
};
})();
