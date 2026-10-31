/* ═══ PQ_DATA · Lesson 4.10.03 Customary Units of Weight · Level 10 "Metric Market" · the Eastside General Store (lesson 3 of 7) ═══
   Everything lesson-specific lives here. The engine (pq-engine.js) and art kit (pq-art.js) hold no lesson content. */
var PQ_DATA = (function(){
var TS=16;

/* Eastside: the main street from the Foot Bridge gate (west), Mrs. Mabel's General Store with its big scale on the plaza,
   Baker Lou's bakery up a little path (north-east), the Crew by the trees (south-west), Penny's cart (south-east) */
function mkMap(){
  var W=32,H=22,g=[],i,j;
  for(j=0;j<H;j++){g.push([]);for(i=0;i<W;i++)g[j].push((j===0||j===H-1||i===0||i===W-1)?'T':'.');}
  for(i=1;i<=30;i++)g[13][i]='p';
  g[13][0]='p';
  for(j=9;j<=12;j++)for(i=10;i<=21;i++)g[j][i]='s';
  for(j=8;j<=12;j++)g[j][26]='p';
  for(j=14;j<=17;j++)g[j][6]='p';
  for(j=14;j<=16;j++)g[j][24]='p';
  [[4,3],[8,5],[3,8],[22,3],[29,10],[12,18],[19,19],[27,19]].forEach(function(p){g[p[1]][p[0]]='f';});
  [[1,1],[2,1],[1,2],[29,1],[30,1],[30,2],[1,20],[2,20],[1,19],[30,20],[29,20],[30,19]].forEach(function(p){g[p[1]][p[0]]='T';});
  return g.map(function(r){return r.join('');});
}

var D = {
  key:'g4-4-10-03-pq',
  levelLabel:'LV 10 · GENERAL STORE',
  map:mkMap(),
  speakers:{
    sys:{name:'',color:'#3B2417',pitch:440,noface:true},
    me:{name:'You',color:'#6B3FA0',pitch:600},
    opti:{name:'OPTI',color:'#0E1C42',pitch:760},
    atlas:{name:'ATLAS',color:'#1F8FB4',pitch:420},
    felix:{name:'FELIX',color:'#1E8C5A',pitch:500},
    hazel:{name:'HAZEL',color:'#B08A0A',pitch:680},
    cora:{name:'CORA',color:'#C2601F',pitch:600},
    mabel:{name:'MRS. MABEL',color:'#8E3B5E',pitch:640},
    lou:{name:'BAKER LOU',color:'#A0632A',pitch:340},
    penny:{name:'PENNY',color:'#8E4FBF',pitch:620},
    sign:{name:'LABEL',color:'#8A5A33',pitch:480,noface:true},
    'item-sack':{name:'',color:'#3B2417',pitch:520,icon:'sack'}
  },
  npcs:[
    {id:'opti',owl:true,x:2,y:14,fixed:true},
    {id:'atlas',x:5,y:15,dir:'right',look:{skin:['#EBC09A','#CF9A6F'],hair:['#5A3A22','#3E2716'],style:'short',shirt:'#55C8E8',acc:'hat',acc2:'#D8B575'}},
    {id:'felix',x:7,y:15,dir:'left',look:{skin:['#9C6640','#7C4C2C'],hair:['#1E1E28','#0E0E16'],style:'spiky',shirt:'#2DB87A',acc:'goggles'}},
    {id:'hazel',x:5,y:17,dir:'right',look:{skin:['#F6D3B3','#E2AE88'],hair:['#C4512E','#963A1E'],style:'long',shirt:'#F5C518',acc:'beret',acc2:'#C93A4A'}},
    {id:'cora',x:7,y:17,dir:'left',look:{skin:['#C98E5E','#A86E42'],hair:['#2A1D18','#160E0A'],style:'puffs',shirt:'#E07B39',acc:'glasses',frame:'#5B2E10'}},
    {id:'mabel',x:15,y:10,look:{skin:['#F1C9A5','#D9A47E'],hair:['#D9D4DE','#AFA8B8'],style:'puffs',shirt:'#B5527A',acc:'apron',acc2:'#FFF3DE'}},
    {id:'lou',x:25,y:9,dir:'right',look:{skin:['#8A5A3B','#6E432A'],hair:['#2A1D18','#160E0A'],style:'short',shirt:'#F7E7C8',acc:'hat',acc2:'#FFFFFF'}},
    {id:'penny',x:22,y:16,dir:'left',look:{skin:['#EBC09A','#CF9A6F'],hair:['#8E6BD0','#6A48A8'],style:'puffs',shirt:'#6B3FA0'}}
  ],
  items:[
    {id:'tagA',kind:'sack',x:23,y:11},
    {id:'tagB',kind:'sack',x:3,y:18},
    {id:'tagC',kind:'sack',x:28,y:17}
  ],
  labels:{opti:'Opti',atlas:'Atlas',felix:'Felix',hazel:'Hazel',cora:'Cora',mabel:'Mrs. Mabel',lou:'Baker Lou',penny:'Penny',
    scale:'the store scale',fuzzy:'the odd sack',bakery:'the bakery',item:'Smudged label'},
  objects:[],
  quests:{},
  transcripts:{}
};

/* the three smudged labels (find quest): each one is fixed with the Warm-Up facts only (1 lb = 16 oz, making 16, half of 16) */
var TAGS={
  tagA:{what:'a crate of apples',fixed:'1 lb = 16 oz.',say:'The label on the apple crate says: 1 lb = 10 oz.',eq:'1 lb =',unit:'oz',a:16,
    miss:function(v){return v===10?{who:'cora',t:'That\'s the Smudge\'s label! A pound isn\'t 10 ounces. Count the little marks between 0 and 1 lb on the scale.'}:{who:'hazel',t:'Picture the scale. 1-ounce weights filled it all the way to 1 lb. How many weights was that?'};}},
  tagB:{what:'a jar of honey',fixed:'9 oz + 7 oz = 16 oz, a full pound.',say:'The honey jar\'s label is half rubbed off: 9 oz. Mrs. Mabel wants to sell it with more honey to make a full pound.',eq:'9 oz + ___ = 1 lb',unit:'oz',a:7,
    miss:function(v){return v===1?{who:'felix',t:'9 + 1 makes 10. But a pound is 16 ounces, not 10. Count up from 9 to 16.'}:{who:'felix',t:'Count up from 9 to 16: 10, 11, 12 … How many did you count?'};}},
  tagC:{what:'a block of butter',fixed:'Each piece = 8 oz.',say:'A 1-pound block of butter is cut into 2 equal pieces. The label for each piece is smudged.',eq:'Each piece =',unit:'oz',a:8,
    miss:function(v){return v===5?{who:'cora',t:'Half of 10 is 5, but a pound is 16 ounces. What is half of 16?'}:{who:'atlas',t:'1 pound is 16 ounces. Split 16 into 2 equal parts.'};}}
};
D.items.forEach(function(it){
  it.show=function(S){var q=S.q.find;return !!(q&&q.met&&!(q.fixed||{})[it.id]);};
  it.take=function(api){var T=TAGS[it.id];api.snd.item();
    var ask=padOf('me','Fix the label. Type the ounces, then press OK.',T.eq,T.unit,function(v,a,me){
      if(v===T.a){a.snd.good();var q=a.S.q.find;q.fixed=q.fixed||{};q.fixed[it.id]=1;a.save();var n=3-Object.keys(q.fixed).length;
        a.say([{who:'sign',t:T.fixed+' Fixed!'},{who:'sys',t:n?n+' more to find.':'That\'s all 3! Go tell Mrs. Mabel.'}],function(b){b.goal(D.quests.find.goal(b.S));});}
      else{a.snd.bad();a.say([T.miss(v),me]);}});
    api.say([{who:'item-sack',t:'You found '+T.what+'. '+T.say},ask]);};
});

/* ───────── objects (art + footprints) ───────── */
function O(o){D.objects.push({build:function(A){var r=o.make(A);r.id=o.id;r.solid=o.solid;r.hidden=o.hidden;r.mx=o.mx;r.my=o.my;return r;}});}
function W(){return PQ._state().world;}
// the General Store: a wide house with a striped awning sign
O({id:'store',mx:14*TS+8,my:5*TS,make:function(A){var c=A.house({w:96,h:72,roof:'#7A4E8E',wall:'#FFF3DE',sign:true,signC:'#F5C518',signDots:function(x,X,Y){for(var i=0;i<26;i+=3){x.fillStyle=i%6?'#B5527A':'#FFFFFF';x.fillRect(X+i,Y+1,2,3);}}});
  var fp=[];for(var j=5;j<=8;j++)for(var i=12;i<=17;i++)fp.push([i,j]);return {spr:c,dx:12*TS,dy:9*TS-72,base:8*TS+15,fp:fp};}});
// the big platform scale on the plaza: a dial on a post with a platform; the needle is crooked until the build quest
function scaleArt(A,ok){var c=A.cv(20,30),x=c.getContext('2d');A.ell(x,10,28,8,2,'rgba(0,0,0,.22)');
  A.R(x,A.P.ol,2,20,16,6);A.R(x,'#B9B0A2',3,21,14,4);A.R(x,'#DAD3C6',3,21,14,1);A.R(x,A.P.ol,8,12,4,9);A.R(x,'#C9A24A',9,13,2,8);
  A.disc(x,10,8,7.5,A.P.ol);A.disc(x,10,8,6.4,'#FFF8EF');for(var k=0;k<9;k++){var a=Math.PI-k*Math.PI/8;A.R(x,'#3B2417',Math.round(10+5.5*Math.cos(a)),Math.round(8-5.5*Math.sin(a)),1,1);}
  if(ok){A.R(x,'#D8344A',10,4,1,4);}else{A.R(x,'#D8344A',11,8,1,1);A.R(x,'#D8344A',12,9,1,1);A.R(x,'#D8344A',13,10,1,1);}
  A.R(x,'#3B2417',9,8,2,2);A.R(x,'#C9A24A',4,18,12,2);A.R(x,A.P.ol,3,17,14,1);return c;}
O({id:'scale',mx:19*TS+8,my:9*TS-14,make:function(A){var a=scaleArt(A,false),b=scaleArt(A,true);return {spr:null,dx:19*TS-2,dy:10*TS-18,base:10*TS+15,fp:[[19,10]],anim:function(x,X,Y){x.drawImage(W().scaleFixed?b:a,Math.round(X),Math.round(Y));}};}});
// the odd sack by the store door: gray fuzz shows once its label is fixed (fix quest)
O({id:'fuzzy',mx:11*TS+8,my:10*TS-8,make:function(A){var s=A.item('sack');return {spr:null,dx:11*TS,dy:10*TS-2,base:10*TS+15,fp:[[11,10]],anim:function(x,X,Y,t){x.drawImage(s,Math.round(X),Math.round(Y));
  if(W().fuzz){for(var k=0;k<5;k++){x.fillStyle=k%2?'#8F8A98':'#B9B5C2';x.fillRect(Math.round(X)+4+k*2,Math.round(Y)+2+Math.round(Math.sin(t*3+k)),2,2);}}
  else{x.fillStyle='#D7D3DD';x.fillRect(Math.round(X)+5,Math.round(Y)+8,6,4);x.fillStyle='#55505E';x.fillRect(Math.round(X)+6,Math.round(Y)+9,4,1);}}};}});
O({id:'bakery',mx:25*TS+8,my:5*TS,make:function(A){return {spr:A.house({w:64,h:56,roof:'#C8894F',chimney:true}),dx:23*TS,dy:8*TS-56,base:7*TS+15,fp:[[23,5],[24,5],[25,5],[26,5],[23,6],[24,6],[25,6],[26,6],[23,7],[24,7],[25,7],[26,7]]};}});
O({id:'board',make:function(A){return {spr:A.signpost('wood'),dx:10*TS,dy:9*TS-6,base:9*TS+15,fp:[[10,9]]};}});
O({id:'westSign',make:function(A){return {spr:A.signpost('wood'),dx:1*TS,dy:12*TS-6,base:12*TS+15,fp:[[1,12]]};}});
[[11,8],[18,8],[20,11],[21,9]].forEach(function(p){O({make:function(A){return {spr:A.crate(),dx:p[0]*TS,dy:p[1]*TS,base:p[1]*TS+14,fp:[[p[0],p[1]]]};}});});
O({id:'outfitters',make:function(A){return {spr:A.hatStall(),dx:27*TS,dy:16*TS-40,base:15*TS+15,fp:[[27,15],[28,15],[29,15]]};}});
[[9,12],[22,12],[28,12],[3,12]].forEach(function(p){O({make:function(A){return {spr:A.lamp(),dx:p[0]*TS+3,dy:p[1]*TS-14,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});
O({make:function(A){return {spr:A.bench(),dx:15*TS+1,dy:15*TS+2,base:15*TS+15,fp:[[15,15],[16,15]]};}});
[[3,5],[9,3],[20,5],[29,6],[11,16],[18,17],[25,18],[2,10]].forEach(function(p){O({make:function(A){return {spr:A.bush(),dx:p[0]*TS,dy:p[1]*TS,base:p[1]*TS+14,fp:[[p[0],p[1]]]};}});});
[[4,7],[30,14]].forEach(function(p){O({make:function(A){return {spr:A.tree(),dx:p[0]*TS-8,dy:p[1]*TS-24,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});

/* ───────── quests ───────── */
function job(id){return !!(window.PQM&&PQM.jobDone(id));}
D.quests.find={
  title:'Mrs. Mabel\'s Smudged Labels',spawn:[3,13,'right'],next:{tab:'warmup',sel:'#mk-mental',label:'Mental Math'},
  teaser:'The Smudge came through Eastside last night. It knocked Mrs. Mabel\'s scale and smudged her labels.',
  lockText:'Finish Read the Scale above to unlock this quest. Mrs. Mabel needs helpers who know how many ounces make a pound.',
  locked:function(){return !job('j1');},
  doneText:'1 lb = 16 oz, 9 oz and 7 oz make a pound, and half a pound is 8 oz. You fixed all three labels. Next: Mental Math, then the Think puzzle.',
  goal:function(S){var q=S.q.find||{},n=Object.keys(q.fixed||{}).length;
    if(!q.met)return 'Talk to <b>Mrs. Mabel</b> in front of her store.';
    return n<3?'Find the sparkly smudged labels and fix them <b>('+n+'/3)</b>':'Tell <b>Mrs. Mabel</b> you\'re done.';},
  markers:function(S){var q=S.q.find||{};if(!q.met)return [{id:'mabel'}];return Object.keys(q.fixed||{}).length>=3?[{id:'mabel'}]:[];},
  start:function(api){var q=api.q();if(!q.seen){q.seen=1;api.save();api.banner('LEVEL 10','GENERAL STORE · LESSON 3 OF 7');
    api.say([{who:'opti',t:'Hoo! Welcome to Eastside, {name}. Last time you fixed the Foot Bridge and chased the Smudge across it.'},
      {who:'opti',t:'Do you still have that gray brick chip stamped with a G? Keep it safe. I think the Smudge came this way.'},
      {who:'opti',t:'That big building is the General Store. Mrs. Mabel weighs everything she sells. Go say hello.'}],function(a){a.goal(D.quests.find.goal(a.S));});}},
  reset:function(S){S.q.find={};},
  transcript:['Opti: Welcome to Eastside. Keep the gray brick chip stamped G. I think the Smudge came this way.','Mrs. Mabel: The Smudge knocked my scale and smudged three of my labels. Please find them and fix them.','Apple crate: 1 lb = 10 oz → 1 lb = 16 oz.','Honey: 9 oz + 7 oz = 16 oz, a full pound.','Butter: a 1-pound block cut into 2 equal pieces is 8 oz each.','Mrs. Mabel: Every label is right again. Thank you!']
};
D.quests.build={
  title:'Fix the Store Scale',spawn:[16,12,'up'],next:{tab:'learn',sel:'#mk-board-kc',label:'Mrs. Mabel\'s Scale Board'},
  teaser:'Your basket order is ready, but Mrs. Mabel\'s big scale still has a crooked needle from the Smudge.',
  lockText:'Finish Fill the Order on the Learn tab above to unlock this quest.',
  locked:function(){return !job('j4');},
  doneText:'You set the needle with a 1-pound weight (16 oz) and weighed the order: 1 lb 10 oz + 9 oz = 2 lb 3 oz. Next: Mrs. Mabel\'s Scale Board.',
  goal:function(S){var q=S.q.build||{};return !q.met?'Talk to <b>Mrs. Mabel</b>.':!S.world.scaleFixed?'Fix the needle on <b>the store scale</b>.':!q.weighed?'Weigh the bag on <b>the store scale</b>.':'The scale works!';},
  markers:function(S){var q=S.q.build||{};return !q.met?[{id:'mabel'}]:!q.weighed?[{id:'scale'}]:[];},
  reset:function(S){S.world.scaleFixed=false;S.q.build={};},
  skip:function(S){S.world.scaleFixed=true;},
  transcript:['Mrs. Mabel: The Smudge bent my scale\'s needle. Put the 1-pound test weight on and set the needle.','You: 1 lb = 16 oz, so the needle points to the 16th ounce mark: 1 lb.','Mrs. Mabel: Now weigh this bag: 1 lb 10 oz of cashews and 9 oz of pecans.','Felix: 19 ounces is 16 ounces and 3 ounces. Trade 16 ounces for 1 pound, not 10.','You: 1 lb 10 oz + 9 oz = 2 lb 3 oz.','Mrs. Mabel: My scale is as good as new!']
};
D.quests.deliver={
  title:'Rice for Baker Lou',spawn:[16,12,'up'],next:{tab:'learn',sel:'#mk-onepic',label:'The Whole Lesson in One Picture'},
  teaser:'Mrs. Mabel saved the rice that was left in the sack for Baker Lou. Can you carry it up to the bakery?',
  lockText:'Finish Split the Rice on the Learn tab above to unlock this quest.',
  locked:function(){return !job('j5');},
  doneText:'2 lb 12 oz = 44 oz: 2 × 16 = 32, and 12 more. Baker Lou has his rice. Next: the whole lesson in one picture.',
  goal:function(S){var q=S.q.deliver||{};return !q.carry&&!q.done?'Get the rice from <b>Mrs. Mabel</b>.':!q.done?'Take the rice to <b>Baker Lou</b> by the bakery.':'Delivered!';},
  markers:function(S){var q=S.q.deliver||{};return !q.carry&&!q.done?[{id:'mabel'}]:!q.done?[{id:'lou'}]:[];},
  reset:function(S){S.q.deliver={};},
  transcript:['Mrs. Mabel: Here is the rice that was left in the sack: 2 lb 12 oz. Please take it to Baker Lou.','Baker Lou: My recipe card only uses ounces. How many ounces is 2 lb 12 oz?','Hazel: 2 lb 12 oz isn\'t 212 ounces. 2 pounds is 2 groups of 16, then 12 more.','You: 2 lb 12 oz = 44 oz.','Baker Lou: 44 ounces, just right for my rice bread!']
};
D.quests.fix={
  title:'The Odd Sack',spawn:[13,12,'up'],next:{tab:'assignment',sel:'.gathered-box',label:'Gather your answers'},
  teaser:'The price board is right again. But one sack by the store door has a strange label that nobody wrote.',
  lockText:'Finish the last job above (the Smudge\'s price board) to unlock this quest.',
  locked:function(){return !job('j6');},
  doneText:'2 lb 19 oz = 3 lb 3 oz, because 16 oz make 1 pound. Under the label you found gray fuzz: a clue! Next lesson: the Hilltop Dairy.',
  goal:function(S){var q=S.q.fix||{};return !q.met?'Talk to <b>Mrs. Mabel</b>.':!S.world.fuzz?'Fix the label on <b>the odd sack</b> by the door.':'You found a clue!';},
  markers:function(S){var q=S.q.fix||{};return !q.met?[{id:'mabel'}]:!S.world.fuzz?[{id:'fuzzy'}]:[];},
  reset:function(S){S.world.fuzz=false;S.q.fix={};},
  skip:function(S){S.world.fuzz=true;},
  transcript:['Mrs. Mabel: That sack by the door has a label I never wrote: 2 lb 19 oz. Can a label even say that?','Cora: 19 ounces is more than 16. Trade 16 ounces for 1 pound.','You: 2 lb 19 oz = 3 lb 3 oz.','Under the label: a tuft of gray fuzz.','Opti: Gray fuzz, like the Smudge. It smells like hay. Hay means cows, and cows mean the Hilltop Dairy!']
};

/* ───────── talk ───────── */
/* The Crew says hello and talks about Eastside first (HELLO). Their method lines (IDLE) unlock only after the page teaches
   both methods: CREW_TAUGHT is Relabel the Flour (Job 3), the second Learn job after the Crew card. */
var CREW_TAUGHT='j3';
var HELLO={
  atlas:'Hi, I\'m Atlas! We made it to Eastside! I want to peek down every street in this town.',
  felix:'Hey, I\'m Felix! I tapped on every barrel by the store. They\'re all full. And something in there smells like cinnamon!',
  hazel:'Hi! I\'m Hazel. I\'m drawing the General Store. Look at that purple roof and the big brass scale out front!',
  cora:'Hello, I\'m Cora. Mrs. Mabel puts a label on every sack in her store. I love a good label.'
};
var IDLE={
  atlas:'I change ounces to pounds and ounces. I count by 16s and keep the leftover. 45 ounces is 32 ounces and 13 ounces, so it\'s 2 pounds 13 ounces.',
  felix:'I change it all to ounces first. 5 pounds is 5 times 16, so 80 ounces. Add 11 more: 91 ounces.',
  hazel:'I picture the scale. Every 16 little ounce marks make one big pound.',
  cora:'When the ounces reach 16, trade them for 1 pound. Not 10. Sixteen!'
};
var SHOP=[['cap','Explorer cap',10],['scarf','Market scarf',8],['flower','Hair flower',6],['pack','Travel pack',15]];
function shop(api){
  var Wl=PQM.wallet();
  var ch=SHOP.map(function(it){var own=Wl.gear[it[0]];return [it[1]+(own?(Wl.wear[it[0]]?' · wearing':' · put on'):' · '+it[2]+' 🪙'),function(a){
    if(own){Wl.wear[it[0]]=!Wl.wear[it[0]];PQM.saveWallet();PQ._rebuild();a.snd.sel();a.say([{who:'penny',t:Wl.wear[it[0]]?'Looking sharp!':'Off it comes. I\'ll keep it safe in your pack.'}]);return;}
    if(PQM.spend(it[2])){Wl.gear[it[0]]=1;Wl.wear[it[0]]=1;PQM.saveWallet();PQ._rebuild();a.snd.item();a.say([{who:'penny',t:'One '+it[1].toLowerCase()+', coming right up! It\'ll go with you to every lesson.'}]);}
    else{a.snd.bad();a.say([{who:'penny',t:'That costs '+it[2]+' coins, and you have '+Wl.coins+'. Earn more with correct work on the lesson page, like Read the Scale and Repack the Raisins.'}]);}}];});
  ch.push(['Just looking',function(a){a.say([{who:'penny',t:'Come back any time!'}]);}]);
  api.say([{who:'penny',t:'I rolled my cart all the way to Eastside! You have '+Wl.coins+' coins. Anything catch your eye?',choices:ch}]);
}
function curQuest(){var s=document.querySelector('.pq-slot.pq-live');return s&&s.dataset.quest;}
function padOf(who,t,eq,unit,check){var p={who:who,t:t,pad:{eq:eq,unit:unit,check:function(v,a){check(v,a,p);}}};return p;}
D.talk=function(id,api){
  var S=api.S,q=curQuest();
  if(id==='opti'){
    if(S.world.fuzz)return api.say([{who:'opti',t:'Gray fuzz that smells like hay. Next time we climb to the Hilltop Dairy, {name}.'}]);
    return api.say([{who:'opti',t:'Hoo! Every store job on the page helps Mrs. Mabel open for the day.'}]);
  }
  if(IDLE[id])return api.say([{who:id,t:(PQM.jobDone(CREW_TAUGHT)?IDLE:HELLO)[id]}]);
  if(id==='mabel'){
    if(q==='find'){var F=S.q.find;
      if(!F.met)return api.say([{who:'mabel',t:'Oh, hello, dear! I\'m Mrs. Mabel. This is my General Store.'},{who:'mabel',t:'Last night the Smudge came through. It knocked my scale and smudged three of my labels!'},
        {who:'mabel',t:'Every label shows a weight in pounds and ounces. Please find the three smudged ones and fix them. Walk onto a sparkle to read one.'}],
        function(a){a.S.q.find.met=1;a.save();a.goal(D.quests.find.goal(a.S));});
      var n=Object.keys(F.fixed||{}).length;
      if(n<3)return api.say([{who:'mabel',t:'Still '+(3-n)+' to go! Look for sparkles around Eastside.'}]);
      return api.say([{who:'mabel',t:'Every label is right again. Thank you, {name}!'},{who:'mabel',t:'Now I can open the store. Come back and help me with orders later.'}],function(a){a.complete();});}
    if(q==='build'){var B=S.q.build;
      if(!B.met)return api.say([{who:'mabel',t:'Your basket order was perfect! But my big scale still has a crooked needle.'},{who:'mabel',t:'The Smudge bent it. Please set it right with my 1-pound test weight. The scale is out front on the plaza.'}],
        function(a){a.S.q.build.met=1;a.save();a.goal(D.quests.build.goal(a.S));});
      return api.say([{who:'mabel',t:S.world.scaleFixed?'Now weigh that bag on the scale, dear.':'The scale is right out front on the plaza.'}]);}
    if(q==='deliver'){var V=S.q.deliver;
      if(!V.carry&&!V.done)return api.say([{who:'mabel',t:'Here is the rice that was left in the sack: 2 lb 12 oz.'},{who:'mabel',t:'Baker Lou bakes rice bread. Please take it to him by the bakery, up the little path.'},{who:'sys',t:'You carry the rice sack.'}],
        function(a){a.S.q.deliver.carry=1;a.save();a.snd.item();a.goal(D.quests.deliver.goal(a.S));});
      return api.say([{who:'mabel',t:V.done?'Thank you for the delivery, dear!':'Baker Lou is up the little path, by the bakery.'}]);}
    if(q==='fix'){var X=S.q.fix;
      if(!X.met)return api.say([{who:'mabel',t:'Thank you for fixing my price board! But look at that sack by my door.'},{who:'mabel',t:'Its label says 2 lb 19 oz. I never wrote that. Can a label even say that? Please fix it.'}],
        function(a){a.S.q.fix.met=1;a.save();a.goal(D.quests.fix.goal(a.S));});
      return api.say([{who:'mabel',t:S.world.fuzz?'Gray fuzz? In my store? Oh my.':'The odd sack is right by my door.'}]);}
    return api.say([{who:'mabel',t:'Welcome to the General Store, dear! Everything here is weighed in pounds and ounces.'}]);
  }
  if(id==='lou'){
    if(q==='deliver'&&S.q.deliver.carry&&!S.q.deliver.done){
      var ask=padOf('me','How many ounces? Type it, then press OK.','2 lb 12 oz =','oz',function(v,a,me){
        if(v===44){a.snd.good();a.S.q.deliver.done=1;a.S.q.deliver.carry=0;a.save();a.say([{who:'lou',t:'44 ounces, just right for my rice bread! Thank you, {name}.'},{who:'lou',t:'Tell Mrs. Mabel the first loaf is hers.'}],function(b){b.goal(D.quests.deliver.goal(b.S));b.complete();});}
        else if(v===212){a.snd.bad();a.say([{who:'hazel',t:'2 lb 12 oz isn\'t 212 ounces. Picture the scale: 2 pounds is 2 groups of 16 ounce marks, then 12 more.'},me]);}
        else if(v===32){a.snd.bad();a.say([{who:'cora',t:'You changed the 2 pounds: 2 × 16 = 32 ounces. Now add the 12 extra ounces too.'},me]);}
        else{a.snd.bad();a.say([{who:'felix',t:'Change the pounds first: 2 × 16 = 32 ounces. Then add the 12 extra ounces.'},me]);}});
      return api.say([{who:'lou',t:'Rice from Mrs. Mabel? Wonderful! I\'m Baker Lou.'},{who:'lou',t:'But my recipe card only uses ounces. How many ounces is 2 lb 12 oz?'},ask]);}
    return api.say([{who:'lou',t:'I\'m Baker Lou. Smell that? Fresh bread, every morning!'}]);
  }
  if(id==='scale'){
    if(q==='build'&&S.q.build.met&&!S.world.scaleFixed){var s1=padOf('me','Set the needle. Type the ounces, then press OK.','1 lb test weight =','oz',function(v,a,me){
        if(v===16){a.snd.good();a.S.world.scaleFixed=true;a.save();if(window.PQM)PQM.renderBoard();a.say([{who:'sys',t:'You set the needle on the 16th ounce mark, right at 1 lb. The needle is straight again!'},{who:'mabel',t:'Good as new! Now weigh this bag: 1 lb 10 oz of cashews, and I\'m adding 9 oz of pecans.'}],function(b){b.goal(D.quests.build.goal(b.S));});}
        else if(v===10){a.snd.bad();a.say([{who:'cora',t:'A pound isn\'t 10 ounces. Count the little ounce marks from 0 to 1 lb.'},me]);}
        else {a.snd.bad();a.say([{who:'hazel',t:'Picture the dial: 1 pound has one little mark for every ounce. How many marks?'},me]);}});
      return api.say([{who:'sys',t:'The needle is bent. You put the 1-pound test weight on the platform.'},s1]);}
    if(q==='build'&&S.world.scaleFixed&&!S.q.build.weighed){var s2=padOf('me','How many ounces? Type it, then press OK.','1 lb 10 oz + 9 oz = 2 lb','oz',function(v,a,me){
        if(v===3){a.snd.good();a.S.q.build.weighed=1;a.save();
          a.say([{who:'sys',t:'The needle points to 2 lb 3 oz.'},{fn:function(b){b.snd.item();b.fx({t:0,update:function(dt){this.t+=dt;return this.t<1.2;},draw:function(x,cx,cy,tt){for(var k=0;k<8;k++){var px=19*16-8+k*4-cx,py=9*16-cy+(k%2?10:0);b.A.sparkle(x,px,py,tt+k,k%2?'#F5C518':'#FFFFFF');}}});}},
            {who:'mabel',t:'2 pounds 3 ounces on the dot! My scale is as good as new.'},{who:'mabel',t:'Read my Scale Board on your page, then help me with the rice sack.'}],function(b){b.goal(D.quests.build.goal(b.S));b.complete();});}
        else if(v===9){a.snd.bad();a.say([{who:'felix',t:'That trades 10 ounces, like tens and ones. 10 + 9 = 19 ounces, and 16 of them make the new pound. How many are left?'},me]);}
        else if(v===19){a.snd.bad();a.say([{who:'atlas',t:'19 ounces is more than 16. Split it with a number bond: 16 and 3. The 16 make the new pound. What is left?'},me]);}
        else {a.snd.bad();a.say([{who:'atlas',t:'Add the ounces: 10 + 9 = 19. Then trade 16 of them for 1 pound.'},me]);}});
      return api.say([{who:'sys',t:'You put the bag on the scale.'},s2]);}
    return api.say([{who:'sys',t:S.world.scaleFixed?'Mrs. Mabel\'s big scale. The needle sits right on 0.':'Mrs. Mabel\'s big scale. The needle is bent!'}]);
  }
  if(id==='fuzzy'){
    if(q==='fix'&&S.q.fix.met&&!S.world.fuzz){var f1=padOf('me','Fix the label. Type the ounces, then press OK.','2 lb 19 oz = 3 lb','oz',function(v,a,me){
        if(v===3){a.snd.good();a.S.world.fuzz=true;a.save();
          a.say([{who:'sign',t:'2 lb 19 oz = 3 lb 3 oz. Fixed!'},{who:'sys',t:'As you fix it, the old label peels off. Under it is a tuft of gray fuzz.'},
            {who:'opti',t:'Hoo! Gray fuzz, just like the Smudge. And it smells like hay.'},{who:'opti',t:'Hay means cows, and cows mean the Hilltop Dairy. Keep the fuzz with your brick chip, {name}. Next lesson, we climb the hill.'}],function(b){b.goal(D.quests.fix.goal(b.S));b.complete();});}
        else if(v===9){a.snd.bad();a.say([{who:'cora',t:'That trades 10 ounces. A pound is 16 ounces, not 10. 19 take away 16 is?'},me]);}
        else if(v===19){a.snd.bad();a.say([{who:'atlas',t:'19 ounces is more than a pound. Trade 16 ounces for 1 pound. How many ounces are left?'},me]);}
        else {a.snd.bad();a.say([{who:'hazel',t:'Split 19 ounces with a number bond: 16 and 3. The 16 ounces make the new pound.'},me]);}});
      return api.say([{who:'sign',t:'2 lb 19 oz'},{who:'me',t:'Hmm. 19 ounces is more than a pound. Let\'s fix it.'},f1]);}
    return api.say([{who:'sys',t:S.world.fuzz?'A sack of cornmeal. A little gray fuzz is still stuck to it.':'A sack of cornmeal by the store door.'}]);
  }
  if(id==='penny'||id==='outfitters')return shop(api);
  var SIGNS={
    westSign:[{who:'sign',t:'← FOOT BRIDGE'}],
    board:[{who:'sign',t:job('j6')?'MABEL\'S PRICE BOARD: everything weighed fair and square.':'MABEL\'S PRICE BOARD. Someone chalked a note on it. Check it on your page in the last job.'}],
    store:[{who:'sys',t:'The Eastside General Store. Sacks, jars and barrels fill the windows.'}],
    bakery:[{who:'sys',t:'Baker Lou\'s bakery. It smells like fresh bread.'}]
  };
  if(SIGNS[id])return api.say(SIGNS[id]);
};
D.afterQuest=function(q,api){
  if(window.PQM){var slot=document.querySelector('.pq-slot[data-quest="'+q+'"]');PQM.earn('quest-'+q,5,10,slot,'Quest clear!');PQM.renderBoard();}
  if(q==='fix'){try{var y=JSON.parse(localStorage.getItem('oao.pq.year')||'{}');y.L10=y.L10||{};y.L10['10.03']=1;localStorage.setItem('oao.pq.year',JSON.stringify(y));}catch(e){}}
};
return D;
})();

/* ═══ PQ_LESSON · the page side of 4.10.03 (jobs, scene, models). The shared layer is assets/sparkle/pq-layer.js ═══ */
var PQ_LESSON=(function(){
var api;
function jobDone(id){return api.jobDone(id);}
function setJob(id,src){api.setJob(id,src);}
function earn(k,c,x,s,l){return api.earn(k,c,x,s,l);}
function ls(k,d){return api.ls(k,d);}
function lsSet(k,v){return api.lsSet(k,v);}
function num(v){var t=String(v==null?'':v).replace(/[,\s]/g,'');return t===''||isNaN(+t)?null:+t;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var LB={unit:'lb',name:['pound','pounds']},OZ={unit:'oz',name:['ounce','ounces']};

/* the cinematic opening: pictures and one counter in ounces, no sentences.
   1-ounce weights drop onto a scale one by one (1 … 16 oz) and the pointer slides to 1 lb → the camera pulls back:
   one more pound and a 9-ounce chunk (41 oz, the pineapple) → Mrs. Mabel walks up and wonders "?" (the Think puzzle). */
function introScene(g,t){
  var C=g.C,W=g.W,H=g.H,m=14,i,a,p;
  var z=g.ease(g.p(t,3.0,3.6)),maxOz=g.lerp(16,48,z);
  var gx=m+4,gw=W-2*m-8,gy=Math.round(H*.48),bh=g.portrait?8:9;
  function X(oz){return Math.round(gx+gw*oz/maxOz);}
  g.owl(W-30,H-30-Math.ceil(52/g.s),t);
  // the gauge: a long strip with a tick for every ounce and a big tick for every pound
  g.rect(gx-1,gy-1,gw+2,bh+2,'rgba(255,255,255,.65)');g.rect(gx,gy,gw,bh,'rgba(10,21,51,1)');
  for(i=0;i<=Math.floor(maxOz);i++){var big=i%16===0;g.rect(Math.min(X(i),gx+gw-1),gy+bh-(big?bh:3),1,big?bh:3,'rgba(255,255,255,'+(big?.9:.45)+')');
    if(big&&i)g.text(i/16+' lb',X(i),gy+bh+4,{col:C[10],shadow:false});}
  g.text('0',gx,gy+bh+4,{col:C.white,shadow:false});
  var oz=0;
  // ── 1-ounce weights drop onto the platform above the gauge, one by one
  var py=gy-30,ws=Math.max(3,Math.floor(Math.min(gw*16/maxOz/16,10)));
  for(i=0;i<16;i++){a=.3+i*.15;p=g.p(t,a,a+.16);if(p<=0)continue;if(p>=1){oz++;if(g.once('w'+i))g.blip(392+i*30);}
    var wx=Math.round(g.cx-8*(ws+1)+i*(ws+1));if(t<2.8)g.box(wx,Math.round(g.lerp(py-24,py,g.back(p))),ws,ws,C[1]);}
  // ── at 1 lb they snap into one pound weight
  if(t>=2.8){g.box(Math.round(g.cx-14),py-4,28,ws+4,C[10]);g.text('1 lb',g.cx,py-2,{shadow:false});var fl=1-g.p(t,2.8,3.05);if(fl>0){g.rect(Math.round(g.cx-14),py-4,28,ws+4,'rgba(255,255,255,'+fl+')');if(g.once('lb'))g.blip(988,.18);}}
  // ── the camera pulls back; one more pound and a 9-ounce chunk land (41 oz)
  p=g.p(t,3.9,4.3);if(p>0){if(p>=1){oz+=16;if(g.once('lb2'))g.blip(600);}g.box(Math.round(g.cx+18),Math.round(g.lerp(py-28,py-4,g.back(p))),28,ws+4,C[10]);g.text('1 lb',g.cx+32,Math.round(g.lerp(py-26,py-2,g.back(p))),{shadow:false});}
  p=g.p(t,4.6,4.95);if(p>0){if(p>=1){oz+=9;if(g.once('nine'))g.blip(784,.1);}g.box(Math.round(g.cx+50),Math.round(g.lerp(py-28,py-1,g.back(p))),18,ws+1,C[1]);}
  // the pointer under the gauge follows the weight
  var px=X(oz);g.rect(px-1,gy-6,3,6,C.red);g.rect(px-3,gy-8,7,2,C.red);
  if(oz)g.text(oz+' oz',g.cx,Math.round(H*.18),{col:oz===16||oz===41?C.gold:C.white});
  // ── Mrs. Mabel walks up and wonders "?" (is her melon heavier?)
  if(t>5.3){var wp=g.ease(g.p(t,5.3,6.0)),ax=Math.round(g.lerp(-18,g.cx-30,wp));g.char('mabel',ax,H-30,wp<1?'right':'up',wp<1?Math.floor(t*8)%4:0);
    if(t>6.1&&!g.clean){var bp=g.back(g.p(t,6.1,6.35)),by=H-50-Math.round(4*bp);if(g.once('q'))g.blip(660,.2);
      g.box(ax+3,by,10,11,C.white);g.text('?',ax+8,by+2,{col:Math.floor(t*3)%2?C.ink:'#B5527A',shadow:false});}}
}

function storeSVG(){
  var sc=jobDone('j1')||!!api.state().world.scaleFixed,fl=jobDone('j3'),ord=jobDone('j4'),pb=jobDone('j6'),open=pb&&jobDone('j5');
  var s='<svg viewBox="0 0 190 120" class="mk-svg" role="img" aria-label="Mrs. Mabel\'s General Store with its scale out front">';
  s+='<rect width="190" height="120" fill="#BDE7F7"/><rect y="88" width="190" height="32" fill="#EBD2A6"/>';
  s+='<rect x="30" y="38" width="100" height="52" fill="#FFF3DE" stroke="#3B2417" stroke-width="2.5"/><path d="M24 40 L80 14 L136 40 Z" fill="#7A4E8E" stroke="#3B2417" stroke-width="2.5"/>';
  for(var k=0;k<6;k++)s+='<rect x="'+(30+k*17)+'" y="40" width="9" height="8" fill="'+(k%2?'#FFFFFF':'#B5527A')+'"/>';
  s+='<rect x="70" y="62" width="20" height="28" fill="#8A5A33" stroke="#3B2417" stroke-width="2"/>';
  s+='<rect x="38" y="58" width="22" height="16" fill="#8FD3F0" stroke="#3B2417" stroke-width="2"/><rect x="100" y="58" width="22" height="16" fill="#8FD3F0" stroke="#3B2417" stroke-width="2"/>';
  if(fl)s+='<rect x="40" y="78" width="14" height="12" rx="2" fill="#F2E6CC" stroke="#3B2417" stroke-width="1.5"/><rect x="43" y="81" width="8" height="4" fill="#2DB87A"/>';
  if(ord)s+='<path d="M104 80 h16 l-2 10 h-12 z" fill="#C8894F" stroke="#3B2417" stroke-width="1.5"/><circle cx="108" cy="79" r="2.5" fill="#D8344A"/><circle cx="114" cy="79" r="2.5" fill="#8B5A2B"/>';
  // the scale out front: needle crooked until Read the Scale is done
  s+='<rect x="150" y="70" width="4" height="20" fill="#C9A24A" stroke="#3B2417" stroke-width="1"/><circle cx="152" cy="64" r="11" fill="#FFF8EF" stroke="#3B2417" stroke-width="2.5"/><rect x="138" y="88" width="28" height="5" fill="#B9B0A2" stroke="#3B2417" stroke-width="1.5"/>';
  s+=sc?'<path d="M152 64 V55" stroke="#D8344A" stroke-width="2.5"/>':'<path d="M152 64 L160 70" stroke="#D8344A" stroke-width="2.5"/>';
  s+='<rect x="52" y="20" width="56" height="13" rx="3" fill="'+(open?'#2DB87A':'#FFF3DE')+'" stroke="#3B2417" stroke-width="2"/><text x="80" y="30" font-family="DotGothic16,Nunito" font-size="8.5" text-anchor="middle" fill="'+(open?'#fff':'#8E3B5E')+'">'+(open?'OPEN!':'GENERAL STORE')+'</text>';
  return s+'</svg>';
}

/* a two-box answer under a model (lb + oz), with a regroup nudge and mistake hints */
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
    if(v[0]*cfg.rate+v[1]===cfg.answer[0]*cfg.rate+cfg.answer[1])return say('That\'s the right weight! But '+v[1]+' '+cfg.units[1]+' is '+cfg.rate+' '+cfg.units[1]+' or more. Trade '+cfg.rate+' '+cfg.units[1]+' for 1 '+cfg.units[0]+'.','hint');
    say(cfg.hint,'hint');};
}
function mount(m,cls){var d=document.createElement('div');d.className=cls||'';m.appendChild(d);return d;}

/* Job 1 · Read the Scale (Store Scale): 16 one-ounce weights fill 1 pound, then read the oats at 2 lb 10 oz */
function modelScale(m){
  OAOKit.scale(m,{key:'g4-4-10-03-ok-scale',rate:16,big:LB,small:OZ,
    rounds:[{name:'Fill 1 pound',item:'1 lb mark',max:1,target:16,weights:['small'],trayText:'Drag a 1-ounce weight onto the scale (or tap it):',
       overMsg:'The needle is already at 1 lb. That would go past it.',
       text:'Put 1-ounce weights on Mrs. Mabel\'s scale until the needle points to <b>1 lb</b>. Count the weights.',
       ask:{q:'1 lb =',units:['oz'],answer:[16],mistakes:[{v:[10],text:'Count the weights on the platform again, one at a time. Are there 10?'}],hint:'Count every weight on the platform.',doneText:'Sixteen 1-ounce weights balance 1 pound. <b>1 lb = 16 oz.</b>'},
       doneText:'Sixteen 1-ounce weights. <b>1 lb = 16 oz.</b>'},
      {name:'Read the oats',item:'oats',itemLabel:'a bag of oats',max:3,at:42,
       text:'A bag of oats is on the scale. Read the needle: first the pounds, then the little ounce marks after them.',
       ask:{q:'The oats weigh',units:['lb','oz'],answer:[2,10],mistakes:[{v:[3,0],text:'Look closely: the needle hasn\'t reached 3 lb yet. It is past 2 lb. Count the little marks after 2 lb.'},{v:[2,5],text:'Each little mark is 1 ounce. Count every mark after 2 lb, not every other one.'}],
         hint:'Find the last pound number the needle passed. Then count the little marks after it.',doneText:'The oats weigh <b>2 lb 10 oz</b>.'},
       doneText:'2 lb 10 oz of oats.'}],
    onRound:function(i,root){earn('scale-'+i,2,0,root,'');},
    onDone:function(root){setJob('j1',root);}});
}
/* Warm-Up · Mental Math: make a pound (making 16, like 10.02's make a foot; 16 is taught in Job 1 above) */
function modelMental(m){
  OAOKit.mentalMath(m,{key:'g4-4-10-03-mm',name:'Make a pound',
    how:'1 pound is 16 ounces. Find the ounces that go with the ounces you have to make 16.',
    example:{q:'10 oz + ? = 1 lb',bond:{whole:16,parts:[10,6]},steps:['1 lb is 16 oz.','10 + 6 = 16','So 10 oz + 6 oz = 1 lb.']},
    problems:[{q:'11 oz + ? = 1 lb',pre:'11 oz +',post:'oz = 1 lb',a:5,hint:'Count up from 11 to 16: 12, 13, 14, 15, 16.'},
              {q:'4 oz + ? = 1 lb',pre:'4 oz +',post:'oz = 1 lb',a:12,hint:'4 and 6 make 10. Then 6 more make 16.'},
              {q:'13 oz + ? = 1 lb',pre:'13 oz +',post:'oz = 1 lb',a:3,hint:'13 is close to 16. Count up: 14, 15, 16.'},
              {q:'6 oz + ? = 1 lb',pre:'6 oz +',post:'oz = 1 lb',a:10,hint:'6 and what make 16? Think 6 + 10.'}],
    onRight:function(i,el){earn('mm-'+i,1,0,el,'');},onDone:function(root){earn('mm-all',2,3,root,'Mental math done!');}});
}
/* Warm-Up · Think: which is heavier, the pineapple (2 lb 9 oz) or the melon (43 oz)? Try it any way, before any teaching */
function modelThink(m){
  var a=mount(m,'mk-think-scale'),b=mount(m,'mk-think-ans');
  OAOKit.scale(a,{key:'g4-4-10-03-ok-think',rate:16,big:LB,small:OZ,
    rounds:[{name:'Pineapple',item:'pineapple',itemLabel:'pineapple: 2 lb 9 oz',max:3,target:41,
       overMsg:'That makes it heavier than the pineapple. Take one off.',
       text:'Put weights on the scale to match the <b>pineapple: 2 lb 9 oz</b>. Use the 1 lb and 1 oz weights, or work it out your own way.',doneText:'The needle shows the pineapple\'s weight. Now the melon.'},
      {name:'Melon',item:'melon',itemLabel:'melon: 43 oz',max:3,target:43,ghost:[0],cap:47,
       overMsg:'That makes it heavier than the melon. Take one off.',
       text:'Now match the <b>melon: 43 oz</b>. The dashed needle is the pineapple.',doneText:'Compare the two needles. Which fruit is heavier, and by how many ounce marks?'}]});
  var st=ls('g4-4-10-03-think-ans',null)||{a:['',''],ok:false};
  b.innerHTML='<form class="bm-form mk-two"><label class="mk-two-q" for="thinkWho">Which fruit is heavier, the pineapple or the melon?</label><input id="thinkWho" type="text" autocomplete="off" aria-label="Which fruit is heavier" value="'+esc(st.a[0])+'" style="width:8em">'+
    '<label class="mk-two-q" for="thinkBy">By how many ounces?</label><input id="thinkBy" type="text" inputmode="numeric" autocomplete="off" aria-label="By how many ounces" value="'+esc(st.a[1])+'"><span class="bm-u">oz</span><button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=b.querySelector('form'),msg=b.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.textContent=t;}
  var DONE='Yes! The melon is heavier, by 2 ounces. On the Learn tab, the Math Crew shows two ways to find it. Did one match yours?';
  if(st.ok){say(DONE,'good');[].forEach.call(f.querySelectorAll('input'),function(x){x.disabled=true;});}
  f.onsubmit=function(e){e.preventDefault();var who=f.thinkWho.value.trim().toLowerCase(),by=num(f.thinkBy.value);st.a=[f.thinkWho.value,f.thinkBy.value];lsSet('g4-4-10-03-think-ans',st);
    if(!who||by==null)return say('Type pineapple or melon, and a number of ounces.','hint');
    if(/melon/.test(who)&&by===2){st.ok=true;lsSet('g4-4-10-03-think-ans',st);OAOKit._snd.done();say(DONE,'good');[].forEach.call(f.querySelectorAll('input'),function(x){x.disabled=true;});earn('think',4,4,b,'You tried it first!');return;}
    OAOKit._snd.no();
    if(by===14)return say('Is 2 lb 9 oz the same as 29 oz? Build it on the scale: 2 one-pound weights and 9 one-ounce weights. Each pound is 16 ounces, not 10.','hint');
    if(/pineapple/.test(who))return say('Look at the two needles on the scale. Which one points to a heavier weight? Match both fruits to check.','hint');
    if(/melon/.test(who))return say('The melon is heavier, yes! Now count the little ounce marks between the two needles.','hint');
    say('Match both fruits on the scale, then compare the needles.','hint');};
}
/* Job 2 · Repack the Raisins (count by 16s + Number Bond): 45 oz = 2 lb 13 oz (IP 1b, 2, 4a's direction) */
function modelRaisins(m){
  var a=mount(m,'mk-bags ok-tool'),b=mount(m,'mk-bond-wrap'),c=mount(m);
  var key='g4-4-10-03-bags',st=ls(key,null)||{n:0};
  function draw(msgT,k){var tot=st.n*16;
    a.innerHTML='<div class="mk-bagrow" aria-live="polite">'+(st.n?Array.apply(null,{length:st.n}).map(function(_,i){return '<span class="mk-bag"><b>1 lb</b><small>'+((i+1)*16)+' oz</small></span>';}).join(''):'<span class="mk-bag-empty">No bags filled yet.</span>')+'</div>'
      +'<div class="ok-row"><button type="button" class="ok-btn mk-fill">+ Fill a 1 lb bag (16 oz)</button><button type="button" class="ok-btn mk-empty">↶ Empty one</button></div>'
      +'<div class="ok-sym"><span class="big">'+st.n+' full bag'+(st.n===1?'':'s')+' = '+tot+' oz</span><span class="exp">of the 45 oz of raisins</span></div><div class="ok-msg'+(k?' '+k:'')+'" aria-live="polite">'+(msgT||'')+'</div>';
    a.querySelector('.mk-fill').onclick=function(){if((st.n+1)*16>45){OAOKit._snd.no();return draw('Another bag needs '+((st.n+1)*16)+' oz in all, but there are only 45 oz of raisins. The rest stay loose.','hint');}st.n++;lsSet(key,st);OAOKit._snd.click();draw('');};
    a.querySelector('.mk-empty').onclick=function(){if(st.n){st.n--;lsSet(key,st);OAOKit._snd.click();}draw('');};}
  draw('');
  OAOKit.numberBond(b,{key:'g4-4-10-03-nb-raisins',text:'Split 45 ounces into the ounces in full bags and the leftover ounces.',
    rounds:[{whole:45,parts:[32,13],hide:1,unit:'oz',note:'32 oz is 2 lb. 13 oz are left over.'}]});
  twoBox(c,{key:'g4-4-10-03-two-raisins',q:'45 oz =',units:['lb','oz'],aria:['Raisins, pounds','Raisins, ounces'],answer:[2,13],rate:16,
    mistakes:[{v:[4,5],text:'That treats ounces like tens and ones. A pound is 16 ounces, not 10: 16, 32, and the next one is past 45. How many full pounds?'},
              {v:[2,45],text:'45 ounces is all the raisins. After you take out 2 pounds (32 oz), how many ounces are left?'},
              {v:[3,0],text:'3 pounds would be 48 ounces. That is more than 45. How many full bags can you really fill?'}],
    hint:'Look at the bond: 32 oz make 2 lb. The other part is the leftover ounces.',
    doneText:'45 oz = <b>2 lb 13 oz</b>. 32 ounces make 2 pounds, and 13 ounces are left over.',
    onDone:function(root){setJob('j2',root);}});
}
/* Job 3 · Relabel the Flour (Store Scale + a step chain): 5 lb 11 oz = 91 oz (IP 1a, 3, 4b's direction) */
function modelFlour(m){
  var a=mount(m),c=mount(m);
  OAOKit.scale(a,{key:'g4-4-10-03-ok-flour',rate:16,big:LB,small:OZ,
    rounds:[{name:'Flour',item:'flour',itemLabel:'the flour sack',max:6,at:91,text:'Read the scale: first the pounds, then the ounce marks after them.',
      ask:{q:'The flour weighs',units:['lb','oz'],answer:[5,11],mistakes:[{v:[6,0],text:'The needle hasn\'t reached 6 lb yet. Find the last pound number it passed.'}],hint:'Find the last pound number the needle passed, then count the little marks after it.',doneText:'The flour weighs <b>5 lb 11 oz</b>. Now change it to ounces below.'},
      doneText:'5 lb 11 oz of flour.'}]});
  var S=[{q:'Change the pounds to ounces: 5 × 16 =',u:'oz',a:80,miss:{50:'That treats a pound like 10 ounces. Each pound is 16 ounces, so multiply 5 × 16.',21:'Multiply, don\'t add: 5 pounds is 5 groups of 16 ounces.',5:'Each pound is 16 ounces. 5 pounds is 5 × 16 ounces.'}},
         {q:'Add the 11 extra ounces:',u:'oz',a:91,miss:{80:'Don\'t forget the 11 extra ounces on the label.',511:'5 lb 11 oz isn\'t 511 ounces. Use your answer to step 1 and add the 11 extra ounces.',61:'5 pounds is 80 ounces, not 50. A pound is 16 ounces.'}}];
  var st=ls('g4-4-10-03-flour-steps',null)||{a:['',''],ok:false};
  c.innerHTML='<form class="bm-form mk-two mk-chain">'+S.map(function(x,k){return '<div class="mk-step"><span class="mk-two-q">'+(k+1)+'. '+x.q+'</span><input type="text" inputmode="numeric" autocomplete="off" aria-label="Step '+(k+1)+': '+esc(x.q)+' how many ounces" value="'+esc(st.a[k]||'')+'"><span class="bm-u">'+x.u+'</span></div>';}).join('')+'<button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=c.querySelector('form'),ins=[].slice.call(f.querySelectorAll('input')),msg=c.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t;}
  var DONE='5 lb 11 oz = <b>91 oz</b>. Pounds to ounces (× 16), then add the extra ounces.';
  function lock(){ins.forEach(function(x){x.disabled=true;});say(DONE,'good');}
  if(st.ok)lock();
  f.onsubmit=function(e){e.preventDefault();var v=ins.map(function(x){return num(x.value);});st.a=ins.map(function(x){return x.value;});lsSet('g4-4-10-03-flour-steps',st);
    for(var k=0;k<S.length;k++){if(v[k]==null)return say('Fill in step '+(k+1)+'.','hint');if(v[k]!==S[k].a){OAOKit._snd.no();return say('Step '+(k+1)+': '+(S[k].miss[v[k]]||'Try that step again. Each pound is 16 ounces.'),'hint');}}
    st.ok=true;lsSet('g4-4-10-03-flour-steps',st);OAOKit._snd.done();lock();setJob('j3',c);};
}
/* Job 4 · Fill the Order: make the next pound, the Trade Mat, then the Story Bar Model (1 lb 12 oz + 2 lb 9 oz = 4 lb 5 oz; IP 5's shape) */
function modelNext(m){
  OAOKit.mentalMath(m,{key:'g4-4-10-03-mm-next',name:'Make the next pound',
    how:'Split the ounces you add with a number bond. Use part of them to make 16 ounces, a whole new pound. Then add what is left.',
    example:{q:'2 lb 14 oz + 3 oz',bond:{whole:3,parts:[2,1]},steps:['14 oz + 2 oz = 16 oz = 1 lb, so 2 lb 14 oz + 2 oz = 3 lb.','3 lb + 1 oz = 3 lb 1 oz.']},
    problems:[{q:'1 lb 15 oz + 6 oz',units:['lb','oz'],a:[2,5],rate:16,hint:'15 oz + 1 oz make a pound. Split 6 into 1 and 5.'},{q:'3 lb 12 oz + 4 oz',units:['lb','oz'],a:[4,0],rate:16,hint:'12 oz + 4 oz make exactly 16 oz, a whole pound. How many ounces are left over?'}],
    onRight:function(i,el){earn('next-'+i,1,0,el,'');},onDone:function(root){earn('next-all',2,3,root,'Next pound made!');}});
}
function modelOrderMat(m){
  OAOKit.tradeMat(m,{key:'g4-4-10-03-tm-order',rate:16,big:LB,small:OZ,tray:true,perRow:{big:2,small:6},
    steps:[{text:'Build the nuts: <b>1 lb 12 oz</b> (1 pound disc, 12 ounce discs).',done:function(st,api){return api.value()>=28;}},
           {text:'Add the apples: <b>2 lb 9 oz</b> more (2 pound discs, 9 ounce discs).',done:function(st,api){return api.value()===69;}},
           {text:'The ounces are 16 or more. Trade 16 ounces for 1 pound.',done:function(st,api){return api.value()===69&&st.s<16;}}],
    doneText:'The mat shows the whole order. Now tap the facts on the bar model below and type the answer.'});
}
function modelOrder(m){
  OAOKit.barModel(m,{key:'g4-4-10-03-bm-order',kind:'part-whole',units:['lb','oz'],rate:16,todo:[],
    story:['A customer\'s basket holds nuts and dried apples. ',{t:'The nuts weigh 1 lb 12 oz.',put:'p0',label:'1 lb 12 oz'},' ',{t:'The apples weigh 2 lb 9 oz.',put:'p1',label:'2 lb 9 oz'},' How much does the whole order weigh?'],
    whole:{name:'whole order',unknown:true},partsName:'foods',
    parts:[{id:'p0',value:28,name:'nuts'},{id:'p1',value:41,name:'apples'}],
    question:'How much does the whole order weigh?',answer:[4,5],
    mistakes:[{value:75,text:'4 lb 11 oz treats ounces like tens and ones. A pound is 16 ounces, not 10: 21 oz = 16 oz + 5 oz.'},
              {value:53,text:'You traded 16 ounces for a pound. Now add that new pound to the 3 pounds you already have.'},
              {value:59,text:'A pound is 16 ounces, not 10, and the new pound needs adding too. 21 oz = 1 lb 5 oz, and 3 lb + 1 lb = 4 lb.'}],
    hint:'Add the pounds: 1 lb + 2 lb. Add the ounces: 12 oz + 9 oz. If the ounces reach 16, trade 16 oz for 1 lb.',
    sym:'1 lb 12 oz + 2 lb 9 oz = 3 lb 21 oz = 4 lb 5 oz',
    doneText:'Yes! 3 lb 21 oz = 4 lb 5 oz. Felix\'s way gives the same: 28 oz + 41 oz = 69 oz = 4 lb 5 oz.',
    onDone:function(root){setJob('j4',root);}});
}
/* Job 5 · Split the Rice (Trade Mat, rate 16): 5 lb 3 oz − 2 lb 7 oz = 2 lb 12 oz, hands-on take-away with a trade (IP 6's shape) */
function modelRice(m){
  var a=mount(m),b=mount(m);
  OAOKit.tradeMat(a,{key:'g4-4-10-03-tm-rice',rate:16,big:LB,small:OZ,tray:true,perRow:{big:2,small:6},
    zone:{title:'Take away 2 lb 7 oz',btn:'Take away 1 →',want:{big:2,small:7},over:function(){return 'Mrs. Mabel scoops out exactly 2 lb 7 oz. That would take away too much.';}},
    steps:[{text:'Build the rice sack: <b>5 lb 3 oz</b> (5 pound discs, 3 ounce discs).',done:function(st,api){return !!(st.zb||st.zs)||(api.value()===83&&st.s<16);}},
           {text:'Take away the pounds first: move <b>2 pound discs</b> to the take-away box.',done:function(st){return st.zb>=2;}},
           {text:'Now take away <b>7 ounces</b>. Only 3 ounces are there. Break 1 pound into 16 ounces, then move 7 ounces to the box.',done:function(st){return st.zb===2&&st.zs===7;}}],
    sym:function(api){var st=api.st;if(st.zb===2&&st.zs===7)return '<span class="big">'+api.text()+' is left</span><span class="exp">5 lb 3 oz − 2 lb 7 oz: trade 1 lb for 16 oz, then take away.</span>';
      return '<span class="big">'+api.text()+(st.zb||st.zs?' on the mat</span><span class="exp">Taken away so far: '+api.zoneText()+'</span>':'</span>'+(api.value()?'<span class="exp">= '+api.value()+' oz in all</span>':''));},
    doneText:'The mat shows what is left. Type it below.'});
  twoBox(b,{key:'g4-4-10-03-two-rice',q:'5 lb 3 oz − 2 lb 7 oz =',units:['lb','oz'],aria:['Rice left, pounds','Rice left, ounces'],answer:[2,12],rate:16,
    mistakes:[{v:[2,6],text:'That treats ounces like tens and ones. A pound is 16 ounces, not 10: after the trade there are 19 ounces, and 19 − 7 = ?'},
              {v:[3,12],text:'The trade used up 1 pound. 5 lb became 4 lb before you took 2 lb away. How many pounds are left on the mat?'},
              {v:[3,4],text:'You can\'t take 7 ounces from 3 ounces by turning it around. Break 1 pound into 16 ounces first.'}],
    hint:'Read the mat: count the pound discs and the ounce discs that are left.',
    doneText:'5 lb 3 oz − 2 lb 7 oz = <b>2 lb 12 oz</b>. Felix\'s check: 83 oz − 39 oz = 44 oz = 2 lb 12 oz.',
    onDone:function(root){setJob('j5',root);}});
}
/* Last job · Prove the Smudge's price board wrong: is 3 lb 19 oz the same as 4 lb 9 oz? The scale shows the real weight */
function modelProve(m){
  OAOKit.scale(m,{key:'g4-4-10-03-ok-prove',rate:16,big:LB,small:OZ,
    rounds:[{name:'The note',item:'note',itemLabel:'the Smudge\'s note: 3 lb 19 oz',max:5,target:67,cap:31,
      overMsg:'That is more than 3 lb 19 oz. Take one off.',
      text:'Put <b>3 lb 19 oz</b> on the scale: 3 one-pound weights and 19 one-ounce weights.',
      ask:{q:'The needle shows',units:['lb','oz'],answer:[4,3],
        mistakes:[{v:[4,9],text:'That\'s what the Smudge wrote! It treated ounces like tens and ones. Look at the needle: how many ounce marks past 4 lb?'},
                  {v:[3,19],text:'That\'s the weight you put on. Now read the needle: it shows the weight in whole pounds and the ounces left over.'}],
        hint:'Find the last pound number the needle passed, then count the little marks after it.',
        doneText:'The needle shows <b>4 lb 3 oz</b>, not 4 lb 9 oz. 19 oz = 16 oz + 3 oz, so 3 lb 19 oz = 4 lb 3 oz. The price board is wrong!'},
      doneText:'3 lb 19 oz = 4 lb 3 oz. You proved the Smudge wrong!'}],
    onDone:function(root){earn('prove',5,5,root,'You proved it!');setJob('j6',root);}});
}
function modelBonus(m){
  OAOKit.challenge(m,{key:'g4-4-10-03-bonus',title:'Bonus quest: the balance puzzle',
    text:'<p>Mrs. Mabel also has an old balance scale with two pans. When the pans are level, both sides weigh the same. She puts a <strong>1-pound</strong> weight on the left pan. On the right pan she puts a <strong>4-ounce</strong> weight, a <strong>2-ounce</strong> weight and some tea. The pans are level. How much does the tea weigh?</p>',
    answer:10,unit:'oz',hint:'Change 1 pound to ounces first. Both pans weigh the same, so the right pan weighs 16 ounces in all.',
    explain:'<p>The left pan is 1 lb = 16 oz. The right pan has 4 oz + 2 oz = 6 oz of weights, plus the tea. 16 − 6 = 10, so the tea weighs <strong>10 oz</strong>.</p>',
    onDone:function(root){earn('bonus',8,8,root,'Bonus quest!');}});
}
function bind(f){return function(m,a){api=a;return f(m);};}
return {
  id:'4.10.03', key:'g4-4-10-03', title:'Customary Units of Weight', unit:10, level:'Metric Market', standard:'MA.4.M.1.2', boss:null,
  problem:{title:'Fix Mrs. Mabel\'s General Store',text:'The Smudge knocked Mrs. Mabel\'s scale and smudged her labels. Each job below uses today\'s math. Finish all six and the store opens for the day.',jobWord:'Store job',jobsTitle:'Store jobs'},
  jobs:[
    {id:'j1',t:'Read the scale',w:'Warm-Up · Read the Scale',go:'#mk-scale',tab:'warmup',r:'-2deg',coins:5},
    {id:'j2',t:'Repack the raisins',w:'Learn · Repack the Raisins',go:'#mk-raisins',tab:'learn',r:'1.5deg',coins:8},
    {id:'j3',t:'Relabel the flour',w:'Learn · Relabel the Flour',go:'#mk-flour',tab:'learn',r:'-1deg',coins:6},
    {id:'j4',t:'Fill a basket order',w:'Learn · Fill the Order',go:'#mk-order',tab:'learn',r:'1deg',coins:6},
    {id:'j5',t:'Split the rice sack',w:'Learn · Split the Rice',go:'#mk-rice',tab:'learn',r:'2deg',coins:6},
    {id:'j6',t:'Prove the price board wrong',w:'Show What You Know',go:'#mk-prove',tab:'assignment',r:'-1.5deg',coins:10}],
  scene:function(a){api=a;return storeSVG();},
  hints:[
    {sel:'#mk-think .callout-think',rungs:['You want to compare two weights. One is in pounds and ounces, and one is only in ounces. Try to get them in the same unit.','Match each fruit on the scale: a 1-pound weight is 16 ounces, and 1-ounce weights fill in the rest. Which needle points farther?','Here are different numbers: 1 lb 4 oz is 16 + 4 = 20 oz. That is heavier than 18 oz, by 2 oz.']},
    {sel:'#tab-assignment .q-block',i:0,inside:true,rungs:['Pounds to ounces: multiply the pounds by 16, then add the extra ounces.','For (b) and (c), count by 16s to find the whole pounds. What is left stays in ounces.','Here are different numbers: 7 lb 1 oz = 7 × 16 + 1 = 113 oz. And 20 oz is 1 lb 4 oz, because 16 oz make 1 pound.']},
    {sel:'#tab-assignment .q-block',i:1,inside:true,rungs:['Add (or subtract) the pounds, then the ounces.','If the ounces reach 16 or more, trade 16 oz for 1 lb. If you can\'t take away the ounces, trade 1 lb for 16 oz first.','Here are different numbers: 1 lb 9 oz + 2 lb 8 oz = 3 lb 17 oz = 4 lb 1 oz. 6 lb 3 oz − 2 lb 6 oz: trade first, 5 lb 19 oz − 2 lb 6 oz = 3 lb 13 oz.']},
    {sel:'#tab-assignment .q-block',i:2,inside:true,rungs:['This is a take-away story: the whole sack, minus the scoop.','5 lb 2 oz has only 2 ounces. Trade 1 lb for 16 oz first: 4 lb 18 oz. Then subtract.','Here are different numbers: 4 lb 1 oz − 2 lb 5 oz. Trade: 3 lb 17 oz − 2 lb 5 oz = 1 lb 12 oz. In ounces: 16 + 12 = 28 oz.']},
    {sel:'#mk-raisins .activity-body > .mk-todo',rungs:['Fill bags one at a time. Each full bag is 16 ounces. How many fit before you pass 45?','2 bags are 32 ounces. A 3rd bag would need 48 ounces, which is too many. So 32 ounces go in bags.','Here are different numbers: 37 oz. Two bags is 32 oz, and 5 oz are left. So 37 oz = 2 lb 5 oz.']},
    {sel:'#mk-flour .activity-body > .mk-todo',rungs:['Read the needle: the last pound number it passed, then the little marks after it.','Pounds to ounces: multiply the pounds by 16. Then add the extra ounces.','Here are different numbers: 7 lb 6 oz. 7 × 16 = 112 oz, and 112 oz + 6 oz = 118 oz.']},
    {sel:'#mk-order .activity-body > .mk-todo',rungs:['Add the pounds first: 1 lb + 2 lb. Then add the ounces: 12 oz + 9 oz.','21 ounces is more than a pound. Trade 16 ounces for 1 pound. What is left over?','Here are different numbers: 4 lb 10 oz + 1 lb 9 oz = 5 lb 19 oz. 19 oz = 1 lb 3 oz, so that is 6 lb 3 oz.']},
    {sel:'#mk-scale .activity-body > .mk-todo',rungs:['Tap the 1-ounce weight over and over, or drag it onto the scale. Count each one.','The needle reaches 1 lb at the 16th weight. For round 2, find the last pound number the needle passed, then count the small marks.','Here are different numbers: a needle 4 marks past 1 lb shows 1 lb 4 oz.']},
    {sel:'#mk-rice .activity-body > .mk-todo',rungs:['Build 5 lb 3 oz first: tap the 1 lb disc 5 times and the 1 oz disc 3 times. Then move 2 pound discs to the take-away box.','You need 7 ounces but only 3 are there. Tap Break 1 into 16 on the pounds column: now there are 19 ounces. Move 7 of them to the box.','Here are different numbers: 3 lb 4 oz − 1 lb 9 oz. Trade 1 lb for 16 oz: 2 lb 20 oz. Take away 1 lb 9 oz: 1 lb 11 oz.']},
    {sel:'#mk-prove .activity-body > .mk-todo',rungs:['Put 3 one-pound weights on the scale first, then 1-ounce weights until you have 19 of them.','Read the needle: which pound number did it pass last? How many ounce marks after that?','Here are different numbers: 1 lb 18 oz. 18 oz = 16 oz + 2 oz, so 1 lb 18 oz is 2 lb 2 oz, not 2 lb 8 oz.']}],
  writing:{
    'journal-notice':{min:6,chips:[{label:'I notice',words:['notice','see','one is','one has','pounds','ounces','two units','only ounces','lb','oz','heavier','different','pineapple','melon']},{label:'I wonder',words:['wonder','how','which','why','?','if','what']}]},
    'journal-compare':{min:12,chips:[{label:'a Crew member\'s way',words:['atlas','felix','hazel','cora','number bond','bond','all ounces','pounds and ounces','dial','scale','trade']},{label:'what you would do for 150 oz',words:['150','ounces','ounce','pounds','pound','lb','oz','bond','16','sixteen','times','multiply','count','split']},{label:'why',words:['because','so','easier','faster','since','simpler','makes sense','quick','like','better']}]},
    'journal-think':{min:10,chips:[{label:'which fruit is heavier',words:['melon']},{label:'by how much',words:['2','two','2 oz','2 ounces']},{label:'how you knew',words:['16','32','41','43','ounces','ounce','pounds','pound','lb','oz','scale','needle','weights','built','changed','change','turned','times','added','plus','minus','subtract','compare','compared','bigger','heavier','more']}]},
    'journal-big':{min:12,chips:[{label:'trade 16, or change to ounces',words:['trade','16','sixteen','ounces','ounce','oz','all ounces','same unit','change','turn','multiply','times','×']},{label:'an example of your own',words:['lb','pound','pounds','=','equals','is']},{label:'both ways work',words:['both','two ways','same answer','either','or','pick','choose','any way']}]}},
  bigIdea:'To compare, add or subtract weights with two units, pick a way: work in pounds and ounces and trade 16 ounces for 1 pound when you need to, or change everything to ounces first (pounds × 16, then add the extra ounces). Both ways give the same answer.',
  words:[{w:'weight',d:'how heavy something is'},{w:'pound',d:'a bigger unit of weight, about as heavy as a loaf of bread'},
    {w:'ounce',d:'a small unit of weight, about as heavy as a slice of bread'}],
  intendedWrong:['1 lb = 10 oz','2 lb 19 oz = 3 lb','1 lb 10 oz + 9 oz = 2 lb','3 lb 19 oz = 4 lb 9 oz','2 lb 19 oz = 3 lb 9 oz','2 lb 9 oz the same as 29 oz','2 lb 12 oz isn\'t 212 ounces','5 lb 11 oz isn\'t 511 ounces','1 lb 18 oz is 2 lb 2 oz, not 2 lb 8 oz'],
  intro:{card:false,len:7.2,
    alt:'One-ounce weights drop onto a scale one by one until the pointer reaches 1 pound: 16 ounces. They snap into a 1-pound weight. Another pound and a 9-ounce piece land, 41 ounces in all, as heavy as Mrs. Mabel\'s pineapple. Mrs. Mabel walks up and wonders whether her melon is heavier.',
    scene:introScene},
  models:{scale:bind(modelScale),mental:bind(modelMental),think:bind(modelThink),raisins:bind(modelRaisins),flour:bind(modelFlour),next:bind(modelNext),ordermat:bind(modelOrderMat),order:bind(modelOrder),rice:bind(modelRice),prove:bind(modelProve),bonus:bind(modelBonus)}
};
})();
