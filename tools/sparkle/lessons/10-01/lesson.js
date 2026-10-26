/* ═══ PQ_DATA · Lesson 4.10.01 Metric Units · Level 10 "Metric Market" (lesson 1 of 7) ═══
   Everything lesson-specific lives here. The engine (pq-engine.js) and art kit (pq-art.js) hold no lesson content. */
var PQ_DATA = (function(){
var TS=16;
var CREW={atlas:'#55C8E8',felix:'#2DB87A',hazel:'#F5C518',cora:'#E07B39'};
function lit(id){document.querySelectorAll('.bubble.'+id).forEach(function(b){b.classList.add('pq-lit');});}

var D = {
  key:'g4-4-10-01-pq',
  levelLabel:'LV 10 · METRIC MARKET',
  map:[
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
"================================",
"T___________......f.......TTTTTT",
"T___________pppppppppppppp.TTTTT",
"T......p.........p.......p...TTT",
"T......p...f.....p.......p....TT",
"T......p.........p.......p....TT",
"T......p.........p.......p....TT",
"T..pppppp........p.......p....TT",
"Tpppppppppppsssssssssppppppppppp",
"T......p....sssssssss....p....TT",
"T......p....sssssssss....p....TT",
"T......p....sssssssss....p....TT",
"T......p....sssssssss....p....TT",
"T......p....sssssssss....p....TT",
"T......p........p........p....TT",
"T......ppppppppppppppppppp.ww.TT",
"T.dddd..........p........wwww.TT",
"T.dddd.....f....p.......wwwww.TT",
"T.dddd..........p........www..TT",
"TTTTTTTTTTTTTTTpppTTTTTTTTTTTTTT",
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"],
  speakers:{
    sys:{name:'',color:'#3B2417',pitch:440,noface:true},
    me:{name:'You',color:'#6B3FA0',pitch:600},
    opti:{name:'OPTI',color:'#0E1C42',pitch:760},
    atlas:{name:'ATLAS',color:'#1F8FB4',pitch:420},
    felix:{name:'FELIX',color:'#1E8C5A',pitch:500},
    hazel:{name:'HAZEL',color:'#B08A0A',pitch:680},
    cora:{name:'CORA',color:'#C2601F',pitch:600},
    millie:{name:'MILLIE',color:'#A44F2C',pitch:640},
    mo:{name:'MO',color:'#3A6B9A',pitch:340},
    amy:{name:'AMY',color:'#D9661E',pitch:700},
    penny:{name:'PENNY',color:'#8E4FBF',pitch:620},
    v1:{name:'SHOPPER',color:'#3A6B9A',pitch:520},
    smudge:{name:'THE SMUDGE',color:'#55505E',pitch:220},
    sign:{name:'SIGN',color:'#8A5A33',pitch:480,noface:true},
    'item-mm':{name:'',color:'#3B2417',pitch:520,icon:'mm'},'item-cm':{name:'',color:'#3B2417',pitch:520,icon:'cm'},'item-m':{name:'',color:'#3B2417',pitch:520,icon:'m'}
  },
  npcs:[
    {id:'opti',owl:true,x:9,y:3,fixed:true},
    {id:'atlas',x:13,y:10,dir:'right',look:{skin:['#EBC09A','#CF9A6F'],hair:['#5A3A22','#3E2716'],style:'short',shirt:'#55C8E8',acc:'hat',acc2:'#D8B575'}},
    {id:'felix',x:19,y:10,dir:'left',look:{skin:['#9C6640','#7C4C2C'],hair:['#1E1E28','#0E0E16'],style:'spiky',shirt:'#2DB87A',acc:'goggles'}},
    {id:'hazel',x:13,y:13,dir:'right',look:{skin:['#F6D3B3','#E2AE88'],hair:['#C4512E','#963A1E'],style:'long',shirt:'#F5C518',acc:'beret',acc2:'#C93A4A'}},
    {id:'cora',x:19,y:13,dir:'left',look:{skin:['#C98E5E','#A86E42'],hair:['#2A1D18','#160E0A'],style:'puffs',shirt:'#E07B39',acc:'glasses',frame:'#5B2E10'}},
    {id:'millie',x:5,y:8,look:{skin:['#F6D3B3','#E2AE88'],hair:['#E0B04A','#B88420'],style:'long',shirt:'#E89A6B',acc:'apron',acc2:'#F7F3EA'}},
    {id:'mo',x:22,y:8,look:{skin:['#6E4528','#52321C'],hair:['#1E1E28','#0E0E16'],style:'short',shirt:'#E04F4F',acc:'straps',acc2:'#4A6FA5'}},
    {id:'amy',x:27,y:12,look:{skin:['#9C6640','#7C4C2C'],hair:['#2A1D18','#160E0A'],style:'curly',shirt:'#F28C28',acc:'apron',acc2:'#FFF3DE'}},
    {id:'penny',x:24,y:14,dir:'left',look:{skin:['#EBC09A','#CF9A6F'],hair:['#8E6BD0','#6A48A8'],style:'puffs',shirt:'#6B3FA0'}},
    {id:'v1',x:26,y:13,dir:'up',look:{skin:['#C98E5E','#A86E42'],hair:['#7A4A26','#5A3318'],style:'short',shirt:'#3A6B9A'},show:function(S){return !!S.world.open;}},
    {id:'v2',x:28,y:13,dir:'up',look:{skin:['#F6D3B3','#E2AE88'],hair:['#E0B04A','#B88420'],style:'long',shirt:'#E04F6A'},show:function(S){return !!S.world.open;}},
    {id:'smudge',smudge:true,x:21,y:10,show:function(S){return (S.q.sign&&S.q.sign.started&&!S.world.signFixed)||(S.q.sign&&S.q.sign.fleeing);}}
  ],
  items:[
    {id:'mm',kind:'mm',x:11,y:18},
    {id:'cm',kind:'cm',x:1,y:4},
    {id:'m',kind:'m',x:29,y:7}
  ],
  labels:{opti:'Opti',atlas:'Atlas',felix:'Felix',hazel:'Hazel',cora:'Cora',amy:'Amy',mo:'Mo',millie:'Millie',penny:'Penny',wellSign:'Liter Well sign',stand:'Amy\'s stand',item:'Sparkle'},
  objects:[],
  quests:{},
  transcripts:{}
};
D.items.forEach(function(it){
  it.show=function(S){var q=S.q.pieces;return !!(q&&q.started&&!(q.got||{})[it.id]);};
  it.take=function(api){var q=api.S.q.pieces;q.got=q.got||{};q.got[it.id]=true;api.save();api.snd.item();
    var n=Object.keys(q.got).length;
    var lines={mm:'You found the MILLIMETER bead! 1 mm is about as thick as a dime.',
               cm:'You found the CENTIMETER block! 1 cm is about as wide as your fingernail.',
               m:'You found the METER stick! 1 m is about as high as a doorknob.'};
    api.say([{who:'item-'+it.id,t:lines[it.id]},{who:'sys',t:n<3?('That\'s '+n+' of 3. Keep looking for sparkles.'):'That\'s all 3! Take them back to Amy at her juice stand.'}],function(a){a.goal(D.quests.pieces.goal(a.S));});};
});

/* ───────── objects (art + footprints) ───────── */
function O(o){D.objects.push({build:function(A){var r=o.make(A);r.id=o.id;r.solid=o.solid;r.hidden=o.hidden;r.mx=o.mx;r.my=o.my;return r;}});}
O({make:function(A){var spr=A.train();return {spr:spr,dx:40,dy:-6,base:20,anim:function(x,X,Y,t){A.smoke(x,X+103,Y+2,t);}};}});
O({id:'stationSign',make:function(A){return {spr:A.signpost('wood'),dx:6*TS,dy:2*TS-6,base:2*TS+15,fp:[[6,2]]};}});
O({id:'millDoor',mx:4*TS,my:4*TS,make:function(A){var spr=A.house({w:64,h:60,stone:true,roof:'#B85A34',sign:true,signC:'#F7EBD3',signDots:function(x,X,Y){for(var i=0;i<24;i+=2)x.fillStyle='#5B2E10',x.fillRect(X+1+i,Y+3,1,i%10===0?2:1);}});
  return {spr:spr,dx:2*TS,dy:8*TS-60,base:7*TS+15,fp:[[2,5],[3,5],[4,5],[5,5],[2,6],[3,6],[4,6],[5,6],[2,7],[3,7],[4,7],[5,7]],anim:function(x,X,Y,t){A.sails(x,X+32,Y+9,t);}};}});
O({id:'shed',make:function(A){return {spr:A.shed(),dx:20*TS,dy:8*TS-52,base:7*TS+15,fp:[[20,5],[21,5],[22,5],[23,5],[20,6],[21,6],[22,6],[23,6],[20,7],[21,7],[22,7],[23,7]]};}});
O({id:'logs',make:function(A){return {spr:A.logs(),dx:27*TS-1,dy:7*TS-26,base:6*TS+15,fp:[[27,5],[28,5],[27,6],[28,6]]};}});
O({id:'crate',make:function(A){return {spr:A.crate(),dx:24*TS,dy:5*TS,base:5*TS+15,fp:[[24,5]]};}});
O({id:'houseA',make:function(A){return {spr:A.house({w:64,h:54,chimney:true}),dx:1*TS,dy:14*TS-54,base:13*TS+15,fp:[[1,11],[2,11],[3,11],[4,11],[1,12],[2,12],[3,12],[4,12],[1,13],[2,13],[3,13],[4,13]]};}});
O({id:'houseB',make:function(A){return {spr:A.house({w:64,h:54,roof:'#D9774A',wall:'#FFF3DE'}),dx:8*TS,dy:14*TS-54,base:13*TS+15,fp:[[8,11],[9,11],[10,11],[11,11],[8,12],[9,12],[10,12],[11,12],[8,13],[9,13],[10,13],[11,13]]};}});
O({id:'fountain',make:function(A){return {spr:null,dx:15*TS,dy:13*TS-40,base:12*TS+15,fp:[[15,11],[16,11],[17,11],[15,12],[16,12],[17,12]],anim:function(x,X,Y,t){x.save();x.translate(Math.round(X),Math.round(Y));A.fountain(x,t);x.restore();}};}});
O({id:'well',mx:22*TS+16,my:11*TS-22,make:function(A){var a=A.well(),b=A.well();return {spr:null,dx:22*TS,dy:13*TS-40,base:12*TS+15,fp:[[22,11],[23,11],[22,12],[23,12]],anim:function(x,X,Y){x.drawImage(a,Math.round(X),Math.round(Y));}};}});
O({id:'wellSign',mx:21*TS+8,my:12*TS-12,make:function(A){var bad=A.signpost('well',false),good=A.signpost('well',true);return {spr:null,dx:21*TS,dy:13*TS-22,base:12*TS+15,fp:[[21,12]],
  anim:function(x,X,Y,t){var S=PQ._state();x.drawImage(S.world.signFixed?good:bad,Math.round(X),Math.round(Y));if(S.world.signFixed&&Math.floor(t*2)%3===0)A.sparkle(x,X+14,Y+1,t,'#F5C518');}};}});
[[12,14],[20,14],[12,2]].forEach(function(p){O({make:function(A){return {spr:A.lamp(),dx:p[0]*TS+3,dy:p[1]*TS-14,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});
[[13,14],[18,14]].forEach(function(p){O({make:function(A){return {spr:A.bench(),dx:p[0]*TS+1,dy:p[1]*TS+2,base:p[1]*TS+15,fp:[[p[0],p[1]],[p[0]+1,p[1]]]};}});});
O({id:'eastSign',make:function(A){return {spr:A.signpost('wood'),dx:29*TS,dy:8*TS-6,base:8*TS+15,fp:[[29,8]]};}});
O({make:function(A){return {spr:A.barrier(),dx:30*TS,dy:9*TS,base:9*TS+15,fp:[[30,9]]};}});
O({make:function(A){return {spr:A.barrier(),dx:31*TS,dy:9*TS,base:9*TS+15,fp:[[31,9]]};}});
O({id:'southSign',make:function(A){return {spr:A.signpost('wood'),dx:18*TS,dy:19*TS-6,base:19*TS+15,fp:[[18,19]]};}});
[15,16,17].forEach(function(i){O({make:function(A){return {spr:A.barrier(),dx:i*TS,dy:20*TS,base:20*TS+15,fp:[[i,20]]};}});});
O({id:'stallBread',make:function(A){return {spr:A.stall('bread'),dx:9*TS,dy:6*TS-24,base:6*TS+15,fp:[[9,6],[10,6],[11,6]]};}});
O({id:'stallRibbon',make:function(A){return {spr:A.stall('ribbon'),dx:12*TS+8,dy:6*TS-24,base:6*TS+15,fp:[[13,6],[14,6],[15,6]]};}});
O({id:'stallJars',make:function(A){return {spr:A.stall('jars'),dx:19*TS,dy:13*TS-24+16,base:13*TS+15,fp:[]};},hidden:function(){return true;}});
[[8,4],[14,7],[29,14],[22,15]].forEach(function(p){O({make:function(A){return {spr:A.bush(),dx:p[0]*TS,dy:p[1]*TS,base:p[1]*TS+14,fp:[[p[0],p[1]]]};}});});
// Amy's juice stand: changes with the student's work on the page (counter → jugs → cart → open)
O({id:'stand',mx:27*TS+8,my:10*TS-12,make:function(A){var cache={};return {spr:null,dx:26*TS,dy:12*TS-48,base:11*TS+15,fp:[[26,11],[27,11],[28,11],[29,11]],
  anim:function(x,X,Y,t){var S=PQ._state(),J=S.world.jobs||{};var f={counter:!!S.world.counter,jugs:!!J.j3,cart:!!J.j4,open:!!S.world.open};var k=JSON.stringify(f);if(!cache[k])cache[k]=A.stand(f);x.drawImage(cache[k],Math.round(X),Math.round(Y));
    if(f.open&&Math.floor(t*3)%2===0){A.sparkle(x,X+6,Y+4,t,'#FFFFFF');A.sparkle(x,X+50,Y+10,t+1,'#F5C518');}}};}});
O({id:'outfitters',make:function(A){return {spr:A.hatStall(),dx:21*TS,dy:15*TS-40,base:14*TS+15,fp:[[21,14],[22,14],[23,14]]};}});


/* ───────── quests ───────── */
function crewCount(S){var c=S.q.crew&&S.q.crew.met||{};return ['atlas','felix','hazel','cora'].filter(function(k){return c[k];}).length;}
function job(id){return !!(window.PQM&&PQM.jobDone(id));}
D.quests.arrive={
  title:'Welcome to Metric Market',spawn:[4,3,'down'],next:{tab:'warmup',sel:'.fluency-box',label:'Fact warm-up'},
  teaser:'Your train just pulled in on Market Day. Something strange happened here last night…',
  doneText:'You met Opti, heard about Amy\'s juice stand and found the smudged sign. Is 2 L really 200 mL? Keep that question in your pocket.',
  goal:function(S){var s=(S.q.arrive||{}).step||0;return s===0?'Talk to <b>Opti the owl</b> on the train platform.':'Read the sign at the <b>Liter Well</b>, east of the fountain.';},
  markers:function(S){var s=(S.q.arrive||{}).step||0;return s===0?[{id:'opti'}]:[{id:'wellSign'}];},
  start:function(api){if(!api.S.q.arrive.seenCard){api.S.q.arrive.seenCard=1;api.save();api.banner('LEVEL 10','METRIC MARKET · LESSON 1 OF 7');}},
  transcript:['Opti: Hoo! You made it, {name}! Today is Market Day in Metric Market.','Opti: Amy wants to open her juice stand, but the Smudge rolled through last night and mixed up every measure in town.','Opti: The Market Day board on this page lists the jobs. Your teacher\'s message is at the top too.','Sign: LITER WELL. Fill your jug! 2 L = 200 mL.','You: Is 2 liters really the same as 200 milliliters?']
};
D.quests.crew={
  title:'Meet the Math Crew',spawn:[16,9,'down'],next:{tab:'warmup',sel:'#mk-measures',label:'Market Measures'},
  teaser:'Four explorers are waiting by the fountain. Talk to each one.',
  doneText:'You met Atlas, Felix, Hazel and Cora. Their ideas are on the cards below.',
  goal:function(S){var c=S.q.crew&&S.q.crew.met||{};return 'Talk to each person <b>('+crewCount(S)+'/4)</b><span class="pq-heads">'+['atlas','felix','hazel','cora'].map(function(k){return '<i style="--c:'+CREW[k]+'" class="'+(c[k]?'on':'')+'"></i>';}).join('')+'</span>';},
  markers:function(S){var c=S.q.crew&&S.q.crew.met||{};return ['atlas','felix','hazel','cora'].filter(function(k){return !c[k];}).map(function(k){return {id:k,k:'…'};});},
  skip:function(S){['atlas','felix','hazel','cora'].forEach(lit);},
  transcript:['Atlas: Every pair of metric units is linked by a factor: 10, 100 or 1,000. Going to a smaller unit? Multiply. Going to a bigger unit? Divide.','Felix: 4,350 mL is 4 L 350 mL. That\'s a bit more than 4 L, so I know it makes sense.','Hazel: I picture the units as a staircase. Each step is 10, 100 or 1,000 times bigger than the one below.','Cora: The number you multiply or divide by is called the conversion factor. For centimeters and meters, it\'s 100.']
};
D.quests.pieces={
  title:'Amy\'s Lost Tools',spawn:[25,13,'right'],
  teaser:'The wind blew Amy\'s measuring tools all over town. Can you find all 3?',
  doneText:'You found the millimeter bead, the centimeter block and the meter stick. Next job: build bigger units in the Market Builder on the Learn tab.',
  goal:function(S){var q=S.q.pieces||{},n=Object.keys(q.got||{}).length;return n<3?'Find Amy\'s 3 sparkly measuring tools <b>('+n+'/3)</b>':'Bring the tools to <b>Amy</b> at her juice stand.';},
  markers:function(S){var q=S.q.pieces||{};return Object.keys(q.got||{}).length>=3?[{id:'amy'}]:[];},
  start:function(api){var q=api.q();if(!q.started){q.started=1;api.save();
    api.say([{who:'amy',t:'Oh no, oh no. Hi! I\'m Amy. This is going to be my juice stand.'},{who:'amy',t:'The Smudge blew my measuring tools all over town: a millimeter bead, a centimeter block and a meter stick.'},{who:'amy',t:'Look for anything that sparkles, {name}. Walk right onto it to pick it up.'}],function(a){a.goal(D.quests.pieces.goal(a.S));});}},
  next:{tab:'learn',sel:'#mk-builder',label:'Market Builder on the Learn tab'},
  transcript:['Amy: The Smudge blew my measuring tools all over town.','You found the MILLIMETER bead! 1 mm is about as thick as a dime.','You found the CENTIMETER block! 1 cm is about as wide as your fingernail.','You found the METER stick! 1 m is about as high as a doorknob.','Amy: It takes 10 millimeters to make 1 centimeter. Build bigger units in the Market Builder on the Learn tab.']
};
D.quests.counter={
  title:'Mo Builds the Counter',spawn:[24,9,'left'],next:{tab:'learn',sel:'#mk-board-kc',label:'Market Measures Board'},
  teaser:'Amy\'s stand needs a counter, but Mo\'s saw only reads centimeters.',
  lockText:'Finish all 4 rounds of the Market Builder above to unlock this quest.',
  locked:function(){return !job('j2');},
  doneText:'3 m = 300 cm. Big unit to small unit, so you multiply by 100. Amy\'s stand has a counter now.',
  goal:function(S){var q=S.q.counter||{};return q.solved?'Go see the new counter at <b>Amy\'s stand</b>.':'Talk to <b>Mo</b> outside the Lumberyard.';},
  markers:function(S){var q=S.q.counter||{};return q.solved?[{id:'amy'}]:[{id:'mo'}];},
  reset:function(S){S.world.counter=false;},
  skip:function(S){S.world.counter=true;},
  transcript:['Mo: Amy\'s counter has to be 3 m long. My saw only shows centimeters. How many centimeters do I cut?','Hazel: Picture 3 meter sticks in a row. Each one is 100 cm long. Count by hundreds.','Mo: 300 cm! Big unit to small unit, so we multiply. 3 × 100 = 300.','Amy: My counter! Next I need juice in jugs. That\'s the Bottle the Juice job on the Learn tab.']
};
D.quests.sign={
  title:'Fix the Sign, Open the Stand',spawn:[19,9,'right'],next:{tab:'assignment',sel:'.gathered-box',label:'Gather your answers'},
  teaser:'The Smudge is back at the Liter Well. Fix its sign and Amy can open for Market Day.',
  lockText:'Finish Bottle the Juice and the Delivery Cart on the Learn tab first. Amy needs juice and a plan before she can open.',
  locked:function(){return !(job('j3')&&job('j4'));},
  doneText:'2 L = 2,000 mL, because 1 L = 1,000 mL. You fixed the sign, Amy\'s stand is open, and Market Day is saved. Lesson 1 of Level 10 is clear!',
  goal:function(S){return S.world.open?'Market Day is saved!':'Fix the sign at the <b>Liter Well</b>.';},
  markers:function(S){return S.world.signFixed?[]:[{id:'wellSign'}];},
  start:function(api){var q=api.q();if(!q.started&&!api.S.world.signFixed){q.started=1;api.save();
    api.say([{who:'amy',t:'{name}! My jugs are filled and my cart plan is ready. But I can\'t sell water with that wrong sign on the well.'},{who:'smudge',t:'Heh heh heh. Don\'t touch my sign. It\'s PERFECT. 2 L is 200 mL. Everybody knows that!'},{who:'sys',t:'Walk to the sign by the Liter Well and press the A button (or Space) to fix it.'}]);}},
  reset:function(S){S.world.signFixed=false;S.world.open=false;S.q.sign={};},
  skip:function(S){S.world.signFixed=true;S.world.open=true;},
  transcript:['The Smudge: My sign is PERFECT. 2 L is 200 mL!','Sign: 2 L = ____ mL','Cora: Check the conversion factor. 1 L = 1,000 mL, not 100 mL.','Amy: Clean water and the right measures. My stand is OPEN!','Opti: You proved it. 1 L is 1,000 mL, so 2 L is 2,000 mL.','The Smudge: At the end of Level 10, my Brick Golem is coming. It will mix up EVERY unit in Metric Market!']
};

/* ───────── talk ───────── */
var IDLE={
  atlas:'Every metric pair has a factor: 10, 100 or 1,000. Find the factor first.',
  felix:'Got an answer? Test it. Does the size make sense?',
  hazel:'I picture a meter stick as 100 little centimeter blocks lined up.',
  cora:'1 kilometer is exactly 1,000 meters. Exact words matter!'
};
var CREWLINES={
  atlas:[{who:'atlas',t:'Hey, {name}! I\'m Atlas. I look for patterns.'},{who:'atlas',t:'Here\'s one. Every pair of metric units is linked by a factor: 10, 100 or 1,000.'},{who:'atlas',t:'Going to a smaller unit? Multiply. Going to a bigger unit? Divide.'}],
  felix:[{who:'felix',t:'I\'m Felix. I test everything.'},{who:'felix',t:'Say I turn 4,350 mL into 4 L 350 mL. I check: is that a little more than 4 L? Yes! So it makes sense.'}],
  hazel:[{who:'hazel',t:'Hi! I\'m Hazel. I see math as pictures.'},{who:'hazel',t:'I picture the metric units like a staircase. Each step up is 10, 100 or 1,000 times bigger than the one below.'}],
  cora:[{who:'cora',t:'I\'m Cora. I like using the exact words.'},{who:'cora',t:'The number you multiply or divide by has a name. It\'s the conversion factor.'},{who:'cora',t:'For centimeters and meters, the conversion factor is 100.'}]
};
var SHOP=[['cap','Explorer cap',10],['scarf','Market scarf',8],['flower','Hair flower',6],['pack','Travel pack',15]];
function shop(api){
  var W=PQM.wallet();
  var ch=SHOP.map(function(it){var own=W.gear[it[0]];return [it[1]+(own?(W.wear[it[0]]?' · wearing':' · put on'):' · '+it[2]+' 🪙'),function(a){
    if(own){W.wear[it[0]]=!W.wear[it[0]];PQM.saveWallet();PQ._rebuild();a.snd.sel();a.say([{who:'penny',t:W.wear[it[0]]?'Looking sharp!':'Off it comes. I\'ll keep it safe in your pack.'}]);return;}
    if(PQM.spend(it[2])){W.gear[it[0]]=1;W.wear[it[0]]=1;PQM.saveWallet();PQ._rebuild();a.snd.item();a.say([{who:'penny',t:'One '+it[1].toLowerCase()+', coming right up! It\'ll go with you to every lesson.'}]);}
    else{a.snd.bad();a.say([{who:'penny',t:'That costs '+it[2]+' coins, and you have '+W.coins+'. Earn more with correct work on the lesson page, like the warm-up facts and the Market Builder.'}]);}}];});
  ch.push(['Just looking',function(a){a.say([{who:'penny',t:'Come back any time!'}]);}]);
  api.say([{who:'penny',t:'Welcome to Penny\'s Outfitters! You have '+W.coins+' coins. Anything catch your eye?',choices:ch}]);
}
function curQuest(){var s=document.querySelector('.pq-slot.pq-live');return s&&s.dataset.quest;}
D.talk=function(id,api){
  var S=api.S,q=curQuest();
  if(id==='opti'){
    if(q==='arrive'){var A0=S.q.arrive;if(!A0.step){api.say([
      {who:'opti',t:'Hoo! You made it, {name}! Today is Market Day in Metric Market.'},
      {who:'opti',t:'I\'m Opti. I\'ll travel with you and the Math Crew all year.'},
      {who:'opti',t:'Amy wants to open her juice stand today. But last night the Smudge rolled through town.'},
      {who:'opti',t:'The Smudge is a grumpy gray cloud. It mixed up every measure in town.'},
      {who:'opti',t:'See the Market Day board on the page? Those are the jobs that will get Amy\'s stand open. Your teacher left you a message at the top, too.'},
      {who:'opti',t:'Let\'s start here. Walk over to the Liter Well and read its sign. Tell me if it looks right.'}],function(a){A0.step=1;a.save();a.goal(D.quests.arrive.goal(a.S));});}
      else api.say([{who:'opti',t:'The Liter Well is east of the fountain. Look for the stone well with the little red roof.'}]);return;}
    if(S.world.open)return api.say([{who:'opti',t:'Listen to that line at Amy\'s stand! Nice work, {name}.'}]);
    return api.say([{who:'opti',t:'Hoo! Every job on the Market Day board gets Amy one step closer to opening.'}]);
  }
  if(CREWLINES[id]){
    if(q==='crew'){var c=S.q.crew;c.met=c.met||{};var first=!c.met[id];api.say(CREWLINES[id],function(a){c.met[id]=1;a.save();lit(id);a.goal(D.quests.crew.goal(a.S));
      if(first&&crewCount(a.S)===4)a.say([{who:'sys',t:'You met the whole Math Crew! They\'ll help you all lesson. Look for them on the page, too.'}],function(b){b.complete();});else if(first)a.snd.sel();});return;}
    return api.say([{who:id,t:IDLE[id]}]);
  }
  if(id==='amy'){
    if(q==='pieces'){var P0=S.q.pieces;var n=Object.keys(P0.got||{}).length;
      if(n<3)return api.say([{who:'amy',t:'Still '+(3-n)+' to go! Look for sparkles around town.'}]);
      return api.say([{who:'amy',t:'My tools! Thank you, {name}.'},{who:'amy',t:'Look how tiny the millimeter bead is. It takes 10 of them to make 1 centimeter.'},
        {who:'amy',t:'To sell juice I need bigger units too: meters, kilometers, liters. Can you build them? Use the Market Builder on the Learn tab.'}],function(a){a.complete();});}
    if(S.world.open)return api.say([{who:'amy',t:'Fresh juice! Four 1 L jugs, plus 350 mL more in a little pitcher. Thanks for everything, {name}!'}]);
    if(!S.world.counter)return api.say([{who:'amy',t:'I don\'t even have a counter yet. Mo the builder can help once you finish the Market Builder.'}]);
    if(!job('j3'))return api.say([{who:'amy',t:'Nice counter, right? Now I need my 4,350 mL of juice poured into 1 L jugs. That\'s the Bottle the Juice job.'}]);
    if(!job('j4'))return api.say([{who:'amy',t:'Jugs are full! My delivery cart broke down after 400 m. How far is left to the 1 km mark? Check the Delivery Cart job.'}]);
    return api.say([{who:'amy',t:'Almost ready. I just need that Liter Well sign fixed so people trust my measures.'}]);
  }
  if(id==='penny')return shop(api);
  if(id==='v1'||id==='v2')return api.say([{who:'v1',t:id==='v1'?'Two liters of orange juice, please! That\'s 2,000 mL, right?':'I love Market Day. Everything is measured right again!'}]);
  if(id==='millie')return api.say([{who:'millie',t:'I grind flour, and I measure everything twice. Each bag weighs 1 kg, which is 1,000 g. Hi, {name}!'}]);
  if(id==='mo'){
    if(q==='counter'&&!S.q.counter.solved){var ask={who:'mo',t:'So how many centimeters should I cut for a 3 m counter?',choices:[['30 cm',wrong30],['300 cm',right],['3,000 cm',wrong3000]]};
      function wrong30(a){a.snd.bad();a.say([{who:'hazel',t:'Hmm. Picture 3 meter sticks in a row. Each one is 100 cm long. Count by hundreds.'},ask]);}
      function wrong3000(a){a.snd.bad();a.say([{who:'felix',t:'I tested that one. 3,000 cm would be 30 meter sticks. That counter would stretch right out of the market!'},ask]);}
      function right(a){a.snd.good();a.S.q.counter.solved=1;a.save();a.say([{who:'mo',t:'300 cm! Big unit to small unit, so we multiply. 3 × 100 = 300.'},{who:'mo',t:'Stand back. Counter time!'}],function(b){buildCounter(b);});}
      return api.say([{who:'mo',t:'You built a whole meter out of little pieces? Then you\'re just the helper I need.'},{who:'mo',t:'Amy\'s stand needs a counter that\'s 3 m long.'},{who:'mo',t:'But my saw only shows centimeters.'},ask]);}
    if(S.world.counter)return api.say([{who:'mo',t:'That counter came out just right. 300 cm, measured twice!'}]);
    return api.say([{who:'mo',t:'I\'m Mo. I build things around town. Wood comes in meters, but my saw reads centimeters. Tricky!'}]);
  }
  if(id==='stand')return D.talk('amy',api);
  if(id==='outfitters')return shop(api);
  if(id==='smudge')return api.say([{who:'smudge',t:'Go ahead. Try to fix my sign. You can\'t!'}]);
  if(id==='wellSign'){
    if(q==='arrive'&&S.q.arrive.step===1){return api.say([{who:'sign',t:'LITER WELL. Fill your jug! 2 L = 200 mL.'},{who:'sys',t:'Gray fuzz is smeared all over the sign.'},
      {who:'me',t:'Hmm. Are 2 liters really the same as 200 milliliters?'},{who:'opti',t:'(calling from the platform) Keep that question in your pocket, {name}. By the end of this lesson, you\'ll prove the answer.'}],function(a){a.complete();});}
    if(q==='sign'&&!S.world.signFixed){var pad={who:'sign',t:'Fix the blank. Type the number of milliliters, then press OK.',pad:{eq:'2 L =',unit:'mL',check:function(v,a){
      if(v===2000){a.snd.good();a.S.world.signFixed=true;var qq=a.S.q.sign;qq.fleeing=1;a.save();
        a.fx({t:0,update:function(dt){this.t+=dt;return this.t<1.2;},draw:function(x,cx,cy,tt){for(var k=0;k<10;k++){var an=k/10*6.28+this.t*3,r=this.t*26;a.A.sparkle(x,21*16+8-cx+Math.cos(an)*r,12*16-6-cy+Math.sin(an)*r*0.6,tt+k,k%2?'#F5C518':'#FFFFFF');}}});
        a.say([{who:'sign',t:'LITER WELL. Fill your jug! 2 L = 2,000 mL.'},{who:'smudge',t:'WHAT?! You fixed it!'},{who:'smudge',t:'Fine. Enjoy your one little sign.'},
          {who:'smudge',t:'At the end of Level 10, my Brick Golem is coming. It will mix up EVERY unit in Metric Market! Heh heh heh…'},
          {fn:function(b){b.snd.poof();var sm=b.ent('smudge');sm.tick=function(dt,e){e.flyOff=(e.flyOff||0)+dt*30;e.dxOff=(e.dxOff||0)+dt*40;e.alpha=Math.max(0,1-(e.flyOff/40));if(e.alpha<=0){e.tick=null;b.S.q.sign.fleeing=0;b.save();}};}},
          {who:'amy',t:'Clean water and the right measures. Market Day is ON! My stand is OPEN!'},
          {fn:function(b){b.S.world.open=true;b.save();PQM.setJob('j5');b.snd.clear();}},
          {who:'opti',t:'You proved it, {name}. 1 L is 1,000 mL, so 2 L is 2,000 mL. Not 200!'},
          {who:'opti',t:'Rest up. Next lesson we cross the Foot Bridge, where people measure in inches and feet.'}],function(b){b.goal(D.quests.sign.goal(b.S));b.complete();});}
      else if(v===200){a.snd.bad();a.say([{who:'cora',t:'That\'s what the Smudge wrote! Check the conversion factor. 1 L = 1,000 mL, not 100 mL. So what is 2 L?'},pad]);}
      else {a.snd.bad();a.say([{who:'atlas',t:'Liters to milliliters is a big unit to a small unit, so multiply. What do you multiply 2 by?'},pad]);}
    }}};
      return api.say([{who:'sign',t:'LITER WELL. Fill your jug! 2 L = ____ mL.'},{who:'sys',t:'The Smudge left the number blank. What belongs there?'},pad]);}
    if(S.world.signFixed)return api.say([{who:'sign',t:'LITER WELL. Fill your jug! 2 L = 2,000 mL.'}]);
    return api.say([{who:'sign',t:'LITER WELL. Fill your jug! 2 L = 200 mL.'},{who:'sys',t:'Gray fuzz is smeared all over it.'}]);
  }
  var SIGNS={
    stationSign:[{who:'sign',t:'METRIC MARKET STATION. Next train: the Foot Bridge line.'}],
    eastSign:[{who:'sign',t:'→ FOOT BRIDGE. Closed for repairs. Opens next lesson.'}],
    southSign:[{who:'sign',t:'↓ GREENHOLLOW GARDENS. This road opens in Level 11.'}],
    millDoor:[{who:'sys',t:'The Mill door is shut. A sign says: BACK SOON, OUT MEASURING.'}],
    shed:[{who:'sys',t:'The Lumberyard. Every log is stamped with its length in meters.'}],
    logs:[{who:'sys',t:'A stack of logs. Each one is stamped "3 m".'}],
    houseA:[{who:'sys',t:'A note on the door: "Gone to buy 2 L of milk. Back soon!"'}],
    houseB:[{who:'sys',t:'The door is locked. Someone inside is practicing the trumpet.'}],
    fountain:[{who:'sys',t:'The fountain splashes and sparkles. Coins glint at the bottom.'}],
    well:[{who:'sys',t:'The water in the Liter Well is cool and clear.'}],
    crate:[{who:'sys',t:'A crate of meter sticks, ready to sell.'}],
    stallBread:[{who:'sys',t:'The bread stall. Every bag of flour weighs exactly 1 kg. That\'s 1,000 grams!'}],
    stallRibbon:[{who:'sys',t:'The ribbon stall. A sign says: RIBBON SOLD BY THE CENTIMETER.'}]
  };
  if(SIGNS[id])return api.say(SIGNS[id]);
};
function buildCounter(api){
  var k=0;var iv=setInterval(function(){k++;api.snd.blip(300+k*60);
    api.fx({t:0,update:function(dt){this.t+=dt;return this.t<0.5;},draw:function(x,cx,cy){var r=2+this.t*12;x.fillStyle='rgba(240,225,200,'+(1-this.t*2).toFixed(2)+')';x.fillRect((26+k%4)*16+8-r-cx,11*16+12-cy,r*2,2);}});
    if(k>=6){clearInterval(iv);api.S.world.counter=true;api.save();if(window.PQM)PQM.renderBoard();
      api.say([{who:'amy',t:'My counter! It\'s perfect. Next I need juice in jugs. That\'s the Bottle the Juice job on the Learn tab.'}],function(a){a.goal(D.quests.counter.goal(a.S));a.complete();});}},160);
}
D.afterQuest=function(q,api){
  if(q==='crew')['atlas','felix','hazel','cora'].forEach(lit);
  if(window.PQM){var slot=document.querySelector('.pq-slot[data-quest="'+q+'"]');PQM.earn('quest-'+q,5,10,slot,'Quest clear!');PQM.renderBoard();}
  if(q==='sign'){try{var y=JSON.parse(localStorage.getItem('oao.pq.year')||'{}');y.L10=y.L10||{};y.L10['10.01']=1;localStorage.setItem('oao.pq.year',JSON.stringify(y));}catch(e){}}
};
return D;
})();

/* ═══ PQ_LESSON · the page side of 4.10.01 (jobs, scene, models). The shared layer is assets/sparkle/pq-layer.js ═══ */
var PQ_LESSON=(function(){
var S,api;
function fmt(n){return n.toLocaleString('en-US');}
function jobDone(id){return api.jobDone(id);}
function setJob(id,src){api.setJob(id,src);}
function earn(k,c,x,s,l){return api.earn(k,c,x,s,l);}
function ls(k,d){return api.ls(k,d);} function lsSet(k,v){return api.lsSet(k,v);}
function standSVG(){S=api.state();
  var cl=document.body.classList.contains('pq-clean');var c=!!S.world.counter||(cl&&jobDone('j2')),jg=jobDone('j3'),ct=jobDone('j4'),op=!!S.world.open||jobDone('j5');
  var s='<svg viewBox="0 0 190 120" class="mk-svg" role="img" aria-label="Amy\'s juice stand">';
  s+='<rect width="190" height="120" fill="#BDE7F7"/><rect y="88" width="190" height="32" fill="#8CCF6B"/><rect y="88" width="190" height="3" fill="#79C05A"/>';
  s+='<rect x="0" y="96" width="190" height="10" fill="#EBD2A6"/>';
  if(!c){s+='<rect x="58" y="60" width="4" height="34" fill="#8A5A33"/><rect x="128" y="60" width="4" height="34" fill="#8A5A33"/><rect x="48" y="44" width="94" height="26" rx="3" fill="#FFF3DE" stroke="#3B2417" stroke-width="3"/><text x="95" y="56" font-family="DotGothic16,Nunito" font-weight="400" font-size="10" text-anchor="middle" fill="#C56C3F">AMY\'S JUICE</text><text x="95" y="66" font-family="DotGothic16,Nunito" font-weight="400" font-size="9" text-anchor="middle" fill="#3B2417">COMING SOON</text>';}
  else{
    if(op){s+='<rect x="40" y="26" width="5" height="62" fill="#8A5A33" stroke="#3B2417" stroke-width="1.5"/><rect x="135" y="26" width="5" height="62" fill="#8A5A33" stroke="#3B2417" stroke-width="1.5"/>';
      for(var i=0;i<8;i++)s+='<rect x="'+(34+i*14)+'" y="18" width="14" height="14" fill="'+(i%2?'#FFF3DE':'#F28C28')+'" stroke="#3B2417" stroke-width="1.5"/>';
      for(var k=0;k<8;k++)s+='<path d="M'+(34+k*14)+' 32 q7 8 14 0" fill="'+(k%2?'#FFF3DE':'#F28C28')+'" stroke="#3B2417" stroke-width="1.5"/>';
      s+='<rect x="74" y="4" width="34" height="13" rx="2" fill="#2DB87A" stroke="#3B2417" stroke-width="2"/><text x="91" y="14" font-family="DotGothic16,Nunito" font-weight="400" font-size="10" text-anchor="middle" fill="#fff">OPEN</text>';}
    s+='<rect x="36" y="66" width="108" height="26" rx="2" fill="#B57E4C" stroke="#3B2417" stroke-width="3"/><rect x="36" y="66" width="108" height="6" fill="#D49E68" stroke="#3B2417" stroke-width="3"/><path d="M60 72v20M84 72v20M108 72v20M132 72v20" stroke="#8A5A33" stroke-width="2"/>';
    s+='<text x="90" y="86" font-family="DotGothic16,Nunito" font-weight="400" font-size="9" text-anchor="middle" fill="#FFF3DE">AMY\'S JUICE</text>';
    if(jg){for(var j=0;j<4;j++){var x=46+j*22;s+='<path d="M'+x+' 64 v-14 q0-4 4-4 h6 v-4 h4 v4 h1 q4 0 4 4 v14z" fill="#F28C28" stroke="#3B2417" stroke-width="2"/><rect x="'+(x+3)+'" y="52" width="3" height="8" fill="#FFC27A"/>';}
      s+='<rect x="130" y="54" width="9" height="11" fill="#FDE1B8" stroke="#3B2417" stroke-width="2"/><rect x="131" y="59" width="7" height="5" fill="#F28C28"/>';}
  }
  if(ct){s+='<g transform="translate(150,70)"><rect x="0" y="0" width="34" height="16" fill="#C56C3F" stroke="#3B2417" stroke-width="2"/><rect x="3" y="-7" width="12" height="8" fill="#F28C28" stroke="#3B2417" stroke-width="1.5"/><rect x="17" y="-7" width="12" height="8" fill="#F28C28" stroke="#3B2417" stroke-width="1.5"/><circle cx="8" cy="20" r="5" fill="#4A4A58" stroke="#3B2417" stroke-width="2"/><circle cx="27" cy="20" r="5" fill="#4A4A58" stroke="#3B2417" stroke-width="2"/><path d="M34 6h8" stroke="#3B2417" stroke-width="3"/></g>';}
  return s+'</svg>';
}
function svgBead(){var s='<svg viewBox="0 0 170 64" class="mk-svg" style="max-width:190px" aria-hidden="true"><rect x="10" y="10" width="150" height="26" rx="3" fill="#FFF3DE" stroke="#3B2417" stroke-width="2.5"/>';
  for(var i=0;i<10;i++)s+='<rect x="'+(13+i*14.6)+'" y="14" width="11" height="18" rx="3" fill="'+(i%2?'#F5C518':'#F2A93B')+'" stroke="#3B2417" stroke-width="1.5"/>';
  return s+'<path d="M10 44v6M160 44v6M10 47h150" stroke="#C56C3F" stroke-width="2"/><text x="85" y="61" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="11" fill="#5B2E10">1 cm of beads, zoomed in</text></svg>';}
function svgStick(){var s='<svg viewBox="0 0 170 64" class="mk-svg" style="max-width:190px" aria-hidden="true"><rect x="8" y="12" width="154" height="20" rx="2" fill="#F5C518" stroke="#3B2417" stroke-width="2.5"/>';
  for(var i=0;i<=100;i++){var x=10+i*1.5;s+='<path d="M'+x.toFixed(1)+' 12v'+(i%10===0?10:4)+'" stroke="#3B2417" stroke-width="'+(i%10===0?1.4:.6)+'"/>';}
  s+='<path d="M10 22 q20 14 40 2 t40 2 t40 -2 t30 4" fill="none" stroke="#E04F6A" stroke-width="4"/>';
  return s+'<text x="85" y="52" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="11" fill="#5B2E10">100 tiny cm marks on 1 m</text></svg>';}
function svgRoad(){var s='<svg viewBox="0 0 170 64" class="mk-svg" style="max-width:190px" aria-hidden="true"><rect x="8" y="16" width="154" height="14" fill="#EBD2A6" stroke="#3B2417" stroke-width="2.5"/>';
  for(var i=0;i<=10;i++){var x=8+i*15.4;s+='<path d="M'+x.toFixed(1)+' 10v26" stroke="#3B2417" stroke-width="1.6"/>';if(i<10)s+='<rect x="'+(x+3).toFixed(1)+'" y="21" width="8" height="3" fill="#fff"/>';}
  return s+'<text x="85" y="52" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="11" fill="#5B2E10">1 km of road, 100 m pieces</text><text x="85" y="62" text-anchor="middle" font-family="Nunito" font-size="9" fill="#7A5A40">count by 100s: 100, 200 … 1,000</text></svg>';}

function modelStamps(m){
  OAOKit.stamps(m,{key:'g4-4-10-01-mk-stamps',
    todo:['Look at each picture. How many of the small unit fit inside the big one? Skip-count when a piece is bigger than 1.','Drag a stamp onto the sign it matches, or tap a stamp and then tap the sign.'],
    signs:[{id:'mmcm',stall:'Bead stall',q:'How many mm fit in 1 cm?',ans:'×10',svg:svgBead()},
           {id:'cmm',stall:'Ribbon stall',q:'How many cm fit in 1 m?',ans:'×100',svg:svgStick()},
           {id:'mkm',stall:'Market road',q:'How many m fit in 1 km?',ans:'×1,000',svg:svgRoad()}],
    stamps:['×10','×100','×1,000'],
    miss:function(s){return 'Look at the '+s.stall.toLowerCase()+' picture again. How many of the small unit fill the big one?';},
    doneText:'All three signs stamped. ×10, ×100 and ×1,000 are the market\'s measures.',
    onStamp:function(sign){earn('stamp-'+sign.dataset.id,2,0,sign,'');},
    onDone:function(root){var rv=document.getElementById('readinessReveal');if(rv)rv.classList.add('show');setJob('j1',root);}});
}
function modelBuilder(m){
  var rv=function(){var e=document.getElementById('learnReveal');if(e)e.classList.add('show');};
  OAOKit.barStrip(m,{key:'g4-4-10-01-ok-bars',
    rounds:[
      {name:'mm → cm',label:'1 centimeter',bigLabel:'1 cm',target:10,unit:'mm',pieces:[1],pieceLabel:function(){return '1 mm';},ticks:{every:1},scale:[0,5,10],scaleLabel:function(v){return v+' mm';},
       text:'How many millimeters fill 1 centimeter? Drag 1 mm pieces onto the bar until it\'s full.',doneText:'10 mm = 1 cm.'},
      {name:'cm → m',label:'1 meter',bigLabel:'1 m',target:100,unit:'cm',pieces:[10],pieceLabel:function(){return '10 cm';},ticks:{every:1,major:10},scale:[0,50,100],scaleLabel:function(v){return v+' cm';},
       text:'How many centimeters fill 1 meter? Each piece is 10 cm, so count by 10s: 10, 20, 30…',doneText:'10 pieces of 10 cm make 100 cm. 100 cm = 1 m.'},
      {name:'m → km',label:'1 kilometer',bigLabel:'1 km',target:1000,unit:'m',pieces:[100],pieceLabel:function(){return '100 m';},ticks:{every:100},scale:[0,500,1000],scaleLabel:function(v){return fmt(v)+' m';},
       text:'How many meters fill 1 kilometer? Each piece is 100 m, so count by 100s.',doneText:'10 pieces of 100 m make 1,000 m. 1,000 m = 1 km.'},
      {name:'mL → L',label:'1 liter',bigLabel:'1 L',target:1000,unit:'mL',pieces:[100],pieceLabel:function(){return '100 mL';},ticks:{every:100},scale:[0,500,1000],scaleLabel:function(v){return fmt(v)+' mL';},
       text:'How many milliliters fill 1 liter? Each piece is 100 mL, so count by 100s.',doneText:'1,000 mL = 1 L. Same ×1,000 as kilometers and meters!'}],
    onRound:function(i,root){earn('build-r'+(i+1),4,0,root,['10 mm = 1 cm','100 cm = 1 m','1,000 m = 1 km','1,000 mL = 1 L'][i]);},
    onDone:function(root){rv();setJob('j2',root);}});
  if(ls('g4-4-10-01-ok-bars',{}).doneFired)rv();
}

function modelBottle(m){
  OAOKit.discMat(m,{key:'g4-4-10-01-ok-bottle',places:[1000,100,10,1],unit:'mL',tray:true,
    headSub:{1000:'1,000 mL',100:'100 mL',10:'10 mL',1:'1 mL'},
    zone:{kind:'convert',title:'1 L jugs<br><span style="font-weight:700;font-size:12px">Each 1,000 mL disc fills one jug</span>',accept:[1000],btn:'Fill a jug →',
      label:function(){return '1 L';},total:function(api){return api.st.z[1000]+' L';},
      wrong:function(p){return 'A jug holds 1,000 mL. A '+fmt(p)+' mL disc can\'t fill it alone.';}},
    steps:[
      {text:'Amy made 4,350 mL of juice. Build 4,350 mL on the mat with the fewest discs you can.',done:function(st,api){return api.value()+api.zoneValue()===4350&&[1000,100,10,1].every(function(p){return st.c[p]<10;});}},
      {text:'Each 1,000 mL disc fills one 1 L jug. Drag every thousands disc into the jugs.',done:function(st,api){return st.z[1000]===4&&st.c[1000]===0&&api.value()+api.zoneValue()===4350;}}],
    sym:function(api){var st=api.st,v=api.value(),z=st.z[1000];
      var parts=[1000,100,10,1].filter(function(p){return st.c[p];}).map(function(p){var c={1000:'k',100:'h',10:'t',1:'o'}[p];return '<span class="'+c+'">'+fmt(st.c[p]*p)+' mL</span>';});
      return z?'<span class="big"><span class="k">'+z+' L</span> '+fmt(v)+' mL</span><span class="exp">'+fmt(z*1000+v)+' mL in all</span>':'<span class="big">'+fmt(v)+' mL</span>'+(parts.length>1?'<span class="exp">= '+parts.join(' + ')+'</span>':'');},
    doneText:'4,350 mL = 4 L 350 mL. That\'s 4 full jugs plus 350 mL more.',
    onDone:function(api,root){setJob('j3',root);}});
}

function modelCart(m){
  OAOKit.discMat(m,{key:'g4-4-10-01-ok-cart',perRow:5,places:[1000,100],unit:'m',tray:false,noRemove:true,start:{1000:1},
    headSub:{1000:'1,000 m',100:'100 m'},
    zone:{kind:'away',title:'Road the cart already drove',accept:[100],max:400,btn:'Drive 100 m →',
      total:function(api){return fmt(api.zoneValue())+' m';},
      wrong:function(){return 'The cart drove 100 m at a time. Break the 1,000 m disc into hundreds first.';},
      over:function(){return 'The cart only drove 400 m before it broke down.';}},
    steps:[
      {text:'Amy\'s road is 1 km, which is 1,000 m. Break the 1,000 m disc into ten 100 m discs.',done:function(st){return st.c[1000]===0;}},
      {text:'The cart broke down after 400 m. Move 400 m of discs to the road it already drove.',done:function(st,api){return api.zoneValue()===400;}}],
    sym:function(api){return '<span class="big">1,000 m − '+fmt(api.zoneValue())+' m = '+fmt(api.value())+' m</span>';},
    doneText:'1 km − 400 m = 1,000 m − 400 m = 600 m still to go.',
    onDone:function(api,root){setJob('j4',root);}});
}

function modelProve(m){
  var sc=[0,500,1000,1500,2000],tk={every:100,major:500},lab=function(v){return fmt(v)+' mL';};
  OAOKit.barStrip(m,{key:'g4-4-10-01-ok-prove',
    intro:'Build both amounts. Both bars use the same scale, so you can compare them fairly.',
    rows:[{label:'Amy\'s jug: 2 L',target:2000,max:2000,unit:'mL',pieces:[1000],pieceLabel:function(){return '1 L';},ticks:tk,scale:sc,scaleLabel:lab,trayText:'Drag 1 L pieces:'},
          {label:'The Smudge\'s sign: 200 mL',target:200,max:2000,unit:'mL',pieces:[100],pieceLabel:function(){return '100 mL';},ticks:tk,scale:sc,scaleLabel:lab,trayText:'Drag 100 mL pieces:'}],
    sym:function(s){return s[0]===2000&&s[1]===200?'<span class="big">2 L = 2,000 mL</span><span class="exp">200 mL is only one tenth of that. The sign is wrong!</span>':'<span class="exp">Top: '+fmt(s[0])+' mL · Bottom: '+fmt(s[1])+' mL</span>';},
    onDone:function(root){earn('prove',5,5,root,'You proved it!');}});
}

function modelMental(m){
  OAOKit.mentalMath(m,{key:'g4-4-10-01-mm',name:'Times 10, 100 or 1,000',
    how:'Each digit moves one place to the left for every zero in 10, 100 or 1,000. The digits stay the same.',
    example:{q:'34 × 100',steps:['34 × 10 = 340','340 × 10 = 3,400','So 34 × 100 = 3,400.']},
    problems:[{q:'9 × 100',a:900,hint:'Two zeros in 100, so 9 moves two places left.'},{q:'25 × 10',a:250,hint:'One zero in 10, so each digit moves one place left.'},
              {q:'7 × 1,000',a:7000,hint:'Three zeros in 1,000.'},{q:'48 × 100',a:4800,hint:'48 × 10 = 480. Times 10 again?'}],
    onRight:function(i,el){earn('mm-'+i,1,0,el,'');},onDone:function(root){earn('mm-all',2,3,root,'Mental math done!');}});
}
function modelBonus(m){
  OAOKit.challenge(m,{key:'g4-4-10-01-bonus',title:'Bonus quest: Amy\'s little cups',
    text:'<p>Amy has <strong>3 L</strong> of juice left. She pours it into small cups that each hold <strong>200 mL</strong>. How many cups can she fill?</p>',
    answer:15,unit:'cups',hint:'How many 200 mL cups fill 1 L? 1 L is 1,000 mL.',
    explain:'<p>1 L = 1,000 mL, and 5 cups of 200 mL make 1,000 mL. So each liter fills 5 cups, and 3 L fills 3 × 5 = <strong>15 cups</strong>.</p>',
    onDone:function(root){earn('bonus',8,8,root,'Bonus quest!');}});
}
function modelCleanSign(box){
  var S=api.state();
  function done(){box.classList.add('fixed');box.querySelector('.cs-msg').innerHTML='<b>Fixed!</b> 1 L = 1,000 mL, so 2 L = 2,000 mL. Amy\'s stand is open. Market Day is saved!';box.querySelector('.cs-eq span').textContent='2,000';}
  if(S.world.signFixed)done();
  box.querySelector('form').onsubmit=function(e){e.preventDefault();var v=+String(box.querySelector('input').value).replace(/[^0-9]/g,'');var msg=box.querySelector('.cs-msg');
    if(v===2000){S.world.signFixed=true;S.world.open=true;api.save();setJob('j5',box);done();}
    else if(v===200){msg.textContent='That\'s what the Smudge wrote! Check the conversion factor: 1 L = 1,000 mL, not 100 mL. So what is 2 L?';}
    else{msg.textContent='Liters to milliliters is a big unit to a small unit, so multiply. What do you multiply 2 by?';}};
}
function bind(f){return function(m,a){api=a;return f(m);};}
return {
  id:'4.10.01', key:'g4-4-10-01', title:'Metric Units of Measurement', unit:10, level:'Metric Market', standard:'MA.4.M.1.2', boss:null,
  problem:{title:'Help Amy open her juice stand for Market Day',text:'The Smudge mixed up every measure in town. Each job below uses today\'s math. Finish all five and the stand opens.',jobWord:'Market Day job',jobsTitle:'Market Day jobs'},
  jobs:[
    {id:'j1',t:'Learn the market\'s measures',w:'Warm-Up · Market Measures',go:'#mk-measures',tab:'warmup',r:'-2deg',coins:5},
    {id:'j2',t:'Build the measuring tools',w:'Learn · Market Builder',go:'#mk-builder',tab:'learn',r:'1.5deg',coins:8},
    {id:'j3',t:'Bottle Amy\'s juice',w:'Learn · Bottle the Juice',go:'#mk-bottle',tab:'learn',r:'-1deg',coins:6},
    {id:'j4',t:'Plan the delivery cart',w:'Learn · Delivery Cart',go:'#mk-cart',tab:'learn',r:'2deg',coins:6},
    {id:'j5',t:'Fix the Liter Well sign',w:'Show What You Know',go:'.pq-slot[data-quest="sign"]',tab:'assignment',r:'-1.5deg',coins:10}],
  scene:function(a){api=a;return standSVG();},
  intendedWrong:['2 L = 200 mL','2 L is 200 mL'],
  models:{stamps:bind(modelStamps),builder:bind(modelBuilder),bottle:bind(modelBottle),cart:bind(modelCart),prove:bind(modelProve),mental:bind(modelMental),bonus:bind(modelBonus),cleanSign:bind(modelCleanSign)}
};
})();
