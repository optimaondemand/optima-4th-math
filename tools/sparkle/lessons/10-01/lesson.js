/* ═══ PQ_DATA · Lesson 4.10.01 Metric Units · Level 10 "Metric Market" (lesson 1 of 7) ═══
   Everything lesson-specific lives here. The engine (pq-engine.js) and art kit (pq-art.js) hold no lesson content. */
var PQ_DATA = (function(){
var TS=16;

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
    'item-plank':{name:'',color:'#3B2417',pitch:520,icon:'plank'},'item-sack':{name:'',color:'#3B2417',pitch:520,icon:'sack'}
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
    {id:'plank1',kind:'plank',x:11,y:18},
    {id:'plank2',kind:'plank',x:1,y:4},
    {id:'plank3',kind:'plank',x:29,y:7}
  ],
  labels:{opti:'Opti',atlas:'Atlas',felix:'Felix',hazel:'Hazel',cora:'Cora',amy:'Amy',mo:'Mo',millie:'Millie',penny:'Penny',wellSign:'Liter Well sign',stand:'Amy\'s stand',item:'Sparkle'},
  objects:[],
  quests:{},
  transcripts:{}
};
D.items.forEach(function(it){
  it.show=function(S){var q=S.q.planks;return !!(q&&q.started&&!(q.got||{})[it.id]);};
  it.take=function(api){var q=api.S.q.planks;q.got=q.got||{};q.got[it.id]=true;api.save();api.snd.item();
    var n=Object.keys(q.got).length;
    api.say([{who:'item-plank',t:'You found a plank! It is stamped 1 m 65 cm.'},{who:'sys',t:n<3?('That\'s '+n+' of 3. Keep looking for sparkles.'):'That\'s all 3! Take them back to Mo outside the Lumberyard.'}],function(a){a.goal(D.quests.planks.goal(a.S));});};
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
  anim:function(x,X,Y,t){var S=PQ._state(),J=S.world.jobs||{};var f={counter:!!S.world.counter,jugs:!!J.j3,flour:!!S.world.flour,open:!!S.world.open};var k=JSON.stringify(f);if(!cache[k])cache[k]=A.stand(f);x.drawImage(cache[k],Math.round(X),Math.round(Y));
    if(f.open&&Math.floor(t*3)%2===0){A.sparkle(x,X+6,Y+4,t,'#FFFFFF');A.sparkle(x,X+50,Y+10,t+1,'#F5C518');}}};}});
O({id:'outfitters',make:function(A){return {spr:A.hatStall(),dx:21*TS,dy:15*TS-40,base:14*TS+15,fp:[[21,14],[22,14],[23,14]]};}});


/* ───────── quests ───────── */
function job(id){return !!(window.PQM&&PQM.jobDone(id));}
D.quests.arrive={
  title:'Welcome to Metric Market',spawn:[4,3,'down'],next:{tab:'warmup',sel:'.fluency-box',label:'Fact warm-up'},
  teaser:'Your train just pulled in on Market Day. Something strange happened here last night…',
  doneText:'You met Opti, heard about Amy\'s juice stand and found the smudged sign. Is 2 L really 200 mL? Keep that question in your pocket.',
  goal:function(S){var s=(S.q.arrive||{}).step||0;return s===0?'Talk to <b>Opti the owl</b> on the train platform.':'Read the sign at the <b>Liter Well</b>, east of the fountain.';},
  markers:function(S){var s=(S.q.arrive||{}).step||0;return s===0?[{id:'opti'}]:[{id:'wellSign'}];},
  start:function(api){if(!api.S.q.arrive.seenCard){api.S.q.arrive.seenCard=1;api.save();api.banner('LEVEL 10','METRIC MARKET · LESSON 1 OF 7');}},
  transcript:['Opti: Hoo! You made it, {name}! Today is Market Day in Metric Market.','Opti: Amy wants to open her juice stand, but the Smudge rolled through last night and mixed up every measure in town.','Opti: Mo is building her counter, Millie is bringing flour, and Amy has juice orders to fill. The Market Day board on this page lists the jobs.','Sign: LITER WELL. Fill your jug! 2 L = 200 mL.','You: Is 2 liters really the same as 200 milliliters?']
};
D.quests.planks={
  title:'Mo\'s Lost Planks',spawn:[23,9,'down'],next:{tab:'learn',sel:'#mk-counter',label:'Build the Counter on the Learn tab'},
  teaser:'The wind blew Mo\'s counter planks all over town. Can you find all 3?',
  doneText:'You found all 3 planks. Each one is 1 m 65 cm. Next job: build the counter on the Two-Unit Mat on the Learn tab.',
  goal:function(S){var q=S.q.planks||{},n=Object.keys(q.got||{}).length;return n<3?'Find Mo\'s 3 sparkly planks <b>('+n+'/3)</b>':'Bring the planks to <b>Mo</b> outside the Lumberyard.';},
  markers:function(S){var q=S.q.planks||{};return Object.keys(q.got||{}).length>=3?[{id:'mo'}]:[];},
  start:function(api){var q=api.q();if(!q.started){q.started=1;api.save();
    api.say([{who:'mo',t:'Hi! I\'m Mo. I build things around town. Today I\'m building Amy\'s counter.'},{who:'mo',t:'But the Smudge blew my 3 planks all over the market. Each one is 1 m 65 cm long.'},{who:'mo',t:'Look for anything that sparkles, {name}. Walk right onto it to pick it up.'}],function(a){a.goal(D.quests.planks.goal(a.S));});}},
  transcript:['Mo: The Smudge blew my 3 planks all over the market. Each one is 1 m 65 cm long.','You found a plank! It is stamped 1 m 65 cm.','Mo: All 3! Laid end to end, how long will Amy\'s counter be? Build it on the Two-Unit Mat on the Learn tab.']
};
D.quests.counter={
  title:'Mo Builds the Counter',spawn:[24,9,'left'],next:{tab:'learn',sel:'#mk-juice',label:'Juice Orders'},
  teaser:'Mo has 3 planks of 1 m 65 cm. His saw only reads centimeters.',
  lockText:'Finish Build the Counter on the Two-Unit Mat above to unlock this quest.',
  locked:function(){return !job('j2');},
  doneText:'3 × 1 m 65 cm = 495 cm = 4 m 95 cm. Amy\'s stand has a counter now.',
  goal:function(S){var q=S.q.counter||{};return q.solved?'Go see the new counter at <b>Amy\'s stand</b>.':'Talk to <b>Mo</b> outside the Lumberyard.';},
  markers:function(S){var q=S.q.counter||{};return q.solved?[{id:'amy'}]:[{id:'mo'}];},
  reset:function(S){S.world.counter=false;},
  skip:function(S){S.world.counter=true;},
  transcript:['Mo: My saw only shows centimeters. How many centimeters long is the whole counter?','Atlas: Split it. 3 × 1 m = 3 m and 3 × 65 cm = 195 cm. Then regroup.','Mo: 495 cm! That\'s 4 m 95 cm. Stand back. Counter time!','Amy: My counter! Next I need my juice orders added up.']
};
D.quests.flour={
  title:'Millie\'s Flour Delivery',spawn:[6,9,'up'],next:{tab:'assignment',sel:'#tab-assignment .q-block',label:'Show What You Know'},
  teaser:'Millie\'s scale only reads grams. Help her label the sack, then deliver the flour to Amy.',
  lockText:'Finish Millie\'s Flour on the Learn tab above to unlock this quest.',
  locked:function(){return !job('j4');},
  doneText:'6 kg 5 g = 6,005 g. Keep the zeros! You delivered the flour, and Amy can bake muffins for Market Day.',
  goal:function(S){var q=S.q.flour||{};return !q.labeled?'Talk to <b>Millie</b> outside the Mill.':S.world.flour?'Flour delivered!':'Deliver the flour to <b>Amy</b> at her juice stand.';},
  markers:function(S){var q=S.q.flour||{};return !q.labeled?[{id:'millie'}]:S.world.flour?[]:[{id:'amy'}];},
  reset:function(S){S.world.flour=false;},
  skip:function(S){S.world.flour=true;},
  transcript:['Millie: My new scale only reads grams. My sack says 6 kg 5 g. How many grams is that?','Cora: 6 kg is 6,000 g. Then 5 g more is 6,005 g. Keep the zeros, or the 5 slides into the wrong place.','Millie: 6,005 g. Perfect! Please take this flour to Amy.','Amy: Flour! Now I can bake muffins to sell with my juice.']
};
D.quests.sign={
  title:'Fix the Sign, Open the Stand',spawn:[19,9,'right'],next:{tab:'assignment',sel:'.gathered-box',label:'Gather your answers'},
  teaser:'The Smudge is back at the Liter Well. Fix its sign and Amy can open for Market Day.',
  lockText:'Finish Juice Orders and Millie\'s Flour on the Learn tab first. Amy needs her juice and flour before she can open.',
  locked:function(){return !(job('j3')&&job('j4'));},
  doneText:'2 L = 2,000 mL, because 1 L = 1,000 mL. You fixed the sign, Amy\'s stand is open, and Market Day is saved. Lesson 1 of Level 10 is clear!',
  goal:function(S){return S.world.open?'Market Day is saved!':'Fix the sign at the <b>Liter Well</b>.';},
  markers:function(S){return S.world.signFixed?[]:[{id:'wellSign'}];},
  start:function(api){var q=api.q();if(!q.started&&!api.S.world.signFixed){q.started=1;api.save();
    api.say([{who:'amy',t:'{name}! My counter is built and my juice orders are ready. But I can\'t sell anything with that wrong sign on the well.'},{who:'smudge',t:'Heh heh heh. Don\'t touch my sign. It\'s PERFECT. 2 L is 200 mL. Everybody knows that!'},{who:'sys',t:'Walk to the sign by the Liter Well and press the A button (or Space) to fix it.'}]);}},
  reset:function(S){S.world.signFixed=false;S.world.open=false;S.q.sign={};},
  skip:function(S){S.world.signFixed=true;S.world.open=true;},
  transcript:['The Smudge: My sign is PERFECT. 2 L is 200 mL!','Sign: 2 L = ____ mL','Cora: Check the trade. 1 L = 1,000 mL, not 100 mL.','Amy: Clean water and the right measures. My stand is OPEN!','Opti: You proved it. 1 L is 1,000 mL, so 2 L is 2,000 mL.','The Smudge: At the end of Level 10, my Brick Golem is coming. It will mix up EVERY unit in Metric Market!']
};

/* ───────── talk ───────── */
var IDLE={
  atlas:'I split two-unit amounts: meters with meters, centimeters with centimeters. Then I regroup.',
  felix:'I change it all to one unit first. 1 m 65 cm is 165 cm. Then I work and change back.',
  hazel:'I draw a bar for every story. Equal planks get equal parts.',
  cora:'When the centimeters reach 100, trade them for 1 m. That\'s regrouping!'
};
var SHOP=[['cap','Explorer cap',10],['scarf','Market scarf',8],['flower','Hair flower',6],['pack','Travel pack',15]];
function shop(api){
  var W=PQM.wallet();
  var ch=SHOP.map(function(it){var own=W.gear[it[0]];return [it[1]+(own?(W.wear[it[0]]?' · wearing':' · put on'):' · '+it[2]+' 🪙'),function(a){
    if(own){W.wear[it[0]]=!W.wear[it[0]];PQM.saveWallet();PQ._rebuild();a.snd.sel();a.say([{who:'penny',t:W.wear[it[0]]?'Looking sharp!':'Off it comes. I\'ll keep it safe in your pack.'}]);return;}
    if(PQM.spend(it[2])){W.gear[it[0]]=1;W.wear[it[0]]=1;PQM.saveWallet();PQ._rebuild();a.snd.item();a.say([{who:'penny',t:'One '+it[1].toLowerCase()+', coming right up! It\'ll go with you to every lesson.'}]);}
    else{a.snd.bad();a.say([{who:'penny',t:'That costs '+it[2]+' coins, and you have '+W.coins+'. Earn more with correct work on the lesson page, like the warm-up facts and the Two-Unit Mat.'}]);}}];});
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
      {who:'opti',t:'Mo is building Amy\'s counter, Millie is bringing flour, and Amy has juice orders to fill. The Market Day board on the page lists every job.'},
      {who:'opti',t:'Let\'s start here. Walk over to the Liter Well and read its sign. Tell me if it looks right.'}],function(a){A0.step=1;a.save();a.goal(D.quests.arrive.goal(a.S));});}
      else api.say([{who:'opti',t:'The Liter Well is east of the fountain. Look for the stone well with the little red roof.'}]);return;}
    if(S.world.open)return api.say([{who:'opti',t:'Listen to that line at Amy\'s stand! Nice work, {name}.'}]);
    return api.say([{who:'opti',t:'Hoo! Every job on the Market Day board gets Amy one step closer to opening.'}]);
  }
  if(IDLE[id])return api.say([{who:id,t:IDLE[id]}]);
  if(id==='amy'){
    if(q==='flour'&&S.q.flour.labeled&&!S.world.flour){return api.say([{who:'amy',t:'Is that flour from Millie? 6,005 g of it! Thank you, {name}.'},{who:'amy',t:'Now I can bake muffins to sell with my juice.'},
      {fn:function(b){b.S.world.flour=true;b.save();if(window.PQM)PQM.renderBoard();}}],function(a){a.goal(D.quests.flour.goal(a.S));a.complete();});}
    if(S.world.open)return api.say([{who:'amy',t:'Fresh juice and warm muffins! Thanks for everything, {name}!'}]);
    if(!S.world.counter)return api.say([{who:'amy',t:'I don\'t even have a counter yet. Mo the builder is working on it.'}]);
    if(!job('j3'))return api.say([{who:'amy',t:'Nice counter, right? Now I have two juice orders to add up: 2 L 750 mL and 1 L 400 mL. That\'s the Juice Orders job.'}]);
    if(!job('j4'))return api.say([{who:'amy',t:'Millie is bringing flour for my muffins. Can you help her with her sack? That\'s Millie\'s Flour on the Learn tab.'}]);
    return api.say([{who:'amy',t:'Almost ready. I just need that Liter Well sign fixed so people trust my measures.'}]);
  }
  if(id==='penny')return shop(api);
  if(id==='v1'||id==='v2')return api.say([{who:'v1',t:id==='v1'?'Two liters of orange juice, please! That\'s 2,000 mL, right?':'I love Market Day. Everything is measured right again!'}]);
  if(id==='millie'){
    if(q==='flour'&&!S.q.flour.labeled){var pad={who:'millie',t:'Type the number of grams, then press OK.',pad:{eq:'6 kg 5 g =',unit:'g',check:function(v,a){
        if(v===6005){a.snd.good();a.S.q.flour.labeled=1;a.save();a.say([{who:'millie',t:'6,005 g. That matches my scale exactly!'},{who:'millie',t:'Please carry this sack to Amy at her juice stand.'}],function(b){b.goal(D.quests.flour.goal(b.S));});}
        else if(v===65||v===605){a.snd.bad();a.say([{who:'cora',t:'Careful! 6 kg is 6,000 g, not 60 g or 600 g. Then add the 5 g. The zeros hold the places.'},pad]);}
        else if(v===6050||v===6500){a.snd.bad();a.say([{who:'felix',t:'I tested that. 6,050 g would be 6 kg 50 g. The sack has only 5 g more than 6 kg.'},pad]);}
        else {a.snd.bad();a.say([{who:'atlas',t:'Split it: 6 kg = 6,000 g. Then 6,000 g + 5 g = ?'},pad]);}}}};
      return api.say([{who:'millie',t:'Hi, {name}! I\'m Millie. I grind the flour in town.'},{who:'millie',t:'My new scale only reads grams. My sack says 6 kg 5 g.'},{who:'millie',t:'How many grams is that?'},pad]);}
    if(S.world.flour)return api.say([{who:'millie',t:'Amy says the muffins smell wonderful. 6,005 g of flour, measured right!'}]);
    return api.say([{who:'millie',t:'I grind flour, and I measure everything twice. 1 kg is 1,000 g. Hi, {name}!'}]);
  }
  if(id==='mo'){
    if(q==='planks'){var P0=S.q.planks;var n=Object.keys(P0.got||{}).length;
      if(n<3)return api.say([{who:'mo',t:'Still '+(3-n)+' to go! Look for sparkles around town.'}]);
      return api.say([{who:'mo',t:'All 3 planks! Thank you, {name}.'},{who:'mo',t:'Each one is 1 m 65 cm. Laid end to end, how long will Amy\'s counter be?'},
        {who:'mo',t:'Work it out on the Two-Unit Mat on the Learn tab. Then come back and tell me.'}],function(a){a.complete();});}
    if(q==='counter'&&!S.q.counter.solved){var ask={who:'mo',t:'Type the length in centimeters, then press OK.',pad:{eq:'3 × 1 m 65 cm =',unit:'cm',check:function(v,a){
        if(v===495){a.snd.good();a.S.q.counter.solved=1;a.save();a.say([{who:'mo',t:'495 cm! That\'s 4 m 95 cm. Same as on your mat.'},{who:'mo',t:'Stand back. Counter time!'}],function(b){buildCounter(b);});}
        else if(v===195){a.snd.bad();a.say([{who:'atlas',t:'That\'s just the centimeters: 3 × 65 cm. Each plank has 1 m too. Add the 3 m.'},ask]);}
        else if(v===3195||v===395){a.snd.bad();a.say([{who:'cora',t:'Regroup first. 195 cm is 1 m 95 cm. So 3 m 195 cm is 4 m 95 cm. How many centimeters is that?'},ask]);}
        else {a.snd.bad();a.say([{who:'felix',t:'Try my way. 1 m 65 cm = 165 cm. What is 3 × 165?'},ask]);}}}};
      return api.say([{who:'mo',t:'You built the counter on the mat? Then you\'re just the helper I need.'},{who:'mo',t:'My saw only shows centimeters.'},{who:'mo',t:'How many centimeters long is the whole counter?'},ask]);}
    if(S.world.counter)return api.say([{who:'mo',t:'That counter came out just right. 4 m 95 cm, measured twice!'}]);
    return api.say([{who:'mo',t:'I\'m Mo. I build things around town. Wood comes in meters and centimeters, but my saw reads only centimeters. Tricky!'}]);
  }
  if(id==='stand')return D.talk('amy',api);
  if(id==='outfitters')return shop(api);
  if(id==='smudge')return api.say([{who:'smudge',t:'Go ahead. Try to fix my sign. You can\'t!'}]);
  if(id==='wellSign'){
    if(q==='arrive'&&S.q.arrive.step===1){return api.say([{who:'sign',t:'LITER WELL. Fill your jug! 2 L = 200 mL.'},{who:'sys',t:'Gray fuzz is smeared all over the sign.'},
      {who:'me',t:'Hmm. Are 2 liters really the same as 200 milliliters?'},{who:'opti',t:'(calling from the platform) Keep that question in your pocket, {name}. By the end of this lesson, you\'ll prove the answer.'}],function(a){a.complete();});}
    if(q==='sign'&&!S.world.signFixed){var pad2={who:'sign',t:'Fix the blank. Type the number of milliliters, then press OK.',pad:{eq:'2 L =',unit:'mL',check:function(v,a){
      if(v===2000){a.snd.good();a.S.world.signFixed=true;var qq=a.S.q.sign;qq.fleeing=1;a.save();
        a.fx({t:0,update:function(dt){this.t+=dt;return this.t<1.2;},draw:function(x,cx,cy,tt){for(var k=0;k<10;k++){var an=k/10*6.28+this.t*3,r=this.t*26;a.A.sparkle(x,21*16+8-cx+Math.cos(an)*r,12*16-6-cy+Math.sin(an)*r*0.6,tt+k,k%2?'#F5C518':'#FFFFFF');}}});
        a.say([{who:'sign',t:'LITER WELL. Fill your jug! 2 L = 2,000 mL.'},{who:'smudge',t:'WHAT?! You fixed it!'},{who:'smudge',t:'Fine. Enjoy your one little sign.'},
          {who:'smudge',t:'At the end of Level 10, my Brick Golem is coming. It will mix up EVERY unit in Metric Market! Heh heh heh…'},
          {fn:function(b){b.snd.poof();var sm=b.ent('smudge');sm.tick=function(dt,e){e.flyOff=(e.flyOff||0)+dt*30;e.dxOff=(e.dxOff||0)+dt*40;e.alpha=Math.max(0,1-(e.flyOff/40));if(e.alpha<=0){e.tick=null;b.S.q.sign.fleeing=0;b.save();}};}},
          {who:'amy',t:'Clean water and the right measures. Market Day is ON! My stand is OPEN!'},
          {fn:function(b){b.S.world.open=true;b.save();PQM.setJob('j5');b.snd.clear();}},
          {who:'opti',t:'You proved it, {name}. 1 L is 1,000 mL, so 2 L is 2,000 mL. Not 200!'},
          {who:'opti',t:'Rest up. Next lesson we cross the Foot Bridge, where people measure in inches and feet.'}],function(b){b.goal(D.quests.sign.goal(b.S));b.complete();});}
      else if(v===200){a.snd.bad();a.say([{who:'cora',t:'That\'s what the Smudge wrote! 1 L = 1,000 mL, not 100 mL. So what is 2 L?'},pad2]);}
      else {a.snd.bad();a.say([{who:'atlas',t:'Each liter is 1,000 mL. Two liters is two of those.'},pad2]);}
    }}};
      return api.say([{who:'sign',t:'LITER WELL. Fill your jug! 2 L = ____ mL.'},{who:'sys',t:'The Smudge left the number blank. What belongs there?'},pad2]);}
    if(S.world.signFixed)return api.say([{who:'sign',t:'LITER WELL. Fill your jug! 2 L = 2,000 mL.'}]);
    return api.say([{who:'sign',t:'LITER WELL. Fill your jug! 2 L = 200 mL.'},{who:'sys',t:'Gray fuzz is smeared all over it.'}]);
  }
  var SIGNS={
    stationSign:[{who:'sign',t:'METRIC MARKET STATION. Next train: the Foot Bridge line.'}],
    eastSign:[{who:'sign',t:'→ FOOT BRIDGE. Closed for repairs. Opens next lesson.'}],
    southSign:[{who:'sign',t:'↓ GREENHOLLOW GARDENS. This road opens in Level 11.'}],
    millDoor:[{who:'sys',t:'The Mill door is shut. A sign says: BACK SOON, OUT DELIVERING FLOUR.'}],
    shed:[{who:'sys',t:'The Lumberyard. Every board is stamped with its length in meters and centimeters.'}],
    logs:[{who:'sys',t:'A stack of logs. Each one is stamped "2 m 50 cm".'}],
    houseA:[{who:'sys',t:'A note on the door: "Gone to buy 1 L 500 mL of milk. Back soon!"'}],
    houseB:[{who:'sys',t:'The door is locked. Someone inside is practicing the trumpet.'}],
    fountain:[{who:'sys',t:'The fountain splashes and sparkles. Coins glint at the bottom.'}],
    well:[{who:'sys',t:'The water in the Liter Well is cool and clear.'}],
    crate:[{who:'sys',t:'A crate of meter sticks, ready to sell.'}],
    stallBread:[{who:'sys',t:'The bread stall. A loaf here weighs 750 g. Two loaves weigh 1 kg 500 g!'}],
    stallRibbon:[{who:'sys',t:'The ribbon stall. A sign says: RIBBON SOLD BY THE METER AND CENTIMETER.'}]
  };
  if(SIGNS[id])return api.say(SIGNS[id]);
};
function buildCounter(api){
  var k=0;var iv=setInterval(function(){k++;api.snd.blip(300+k*60);
    api.fx({t:0,update:function(dt){this.t+=dt;return this.t<0.5;},draw:function(x,cx,cy){var r=2+this.t*12;x.fillStyle='rgba(240,225,200,'+(1-this.t*2).toFixed(2)+')';x.fillRect((26+k%4)*16+8-r-cx,11*16+12-cy,r*2,2);}});
    if(k>=6){clearInterval(iv);api.S.world.counter=true;api.save();if(window.PQM)PQM.renderBoard();
      api.say([{who:'amy',t:'My counter! It\'s perfect. Next I need my two juice orders added up. That\'s the Juice Orders job on the Learn tab.'}],function(a){a.goal(D.quests.counter.goal(a.S));a.complete();});}},160);
}
D.afterQuest=function(q,api){
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
function ls(k,d){return api.ls(k,d);}
/* the cinematic opening (assets/sparkle/pq-intro.js): pictures and one counter, no sentences.
   ten 10 cm pieces fill a ruler (10 cm … 100 cm) → they snap into 1 m → 6 more tens and a 5 cm piece (110 … 165 cm, one unit the whole way)
   → it becomes a plank → the camera pulls back → 2 more planks slide in END TO END → Amy walks up and wonders "?" (the Think puzzle; never its answer). */
function introScene(g,t){
  var C=g.C,W=g.W,H=g.H,m=12,i,a,p;
  var M1=Math.min(Math.floor((W-2*m)/1.65),150),M2=Math.floor((W-2*m)/4.95),bh=g.portrait?9:10;
  var z=g.ease(g.p(t,4.7,5.4)),M=g.lerp(M1,M2,z),cm=M/100;                       // the camera pulls back
  var x0=Math.round(g.lerp(g.cx-1.65*M1/2,g.cx-4.95*M2/2,z)),y0=Math.round(H*.4),capY=y0-24,full=Math.round(1.65*M);
  function px(c){return Math.round(c*cm);}
  g.owl(W-30,H-30-Math.ceil(52/g.s),t);
  if(t>6.1){var wp=g.ease(g.p(t,6.1,6.9)),ax=Math.round(g.lerp(-18,g.cx-8,wp));g.char('amy',ax,H-30,wp<1?'right':'up',wp<1?Math.floor(t*8)%4:0);
    if(t>6.95&&!g.clean){var bp=g.back(g.p(t,6.95,7.2)),by=H-50-Math.round(4*bp);if(g.once('q'))g.blip(660,.2);
      g.box(ax+3,by,10,11,C.white);g.text('?',ax+8,by+2,{col:Math.floor(t*3)%2?C.ink:'#C56C3F',shadow:false});}}
  // ── an empty 1 m ruler fills with ten 10 cm pieces
  if(t<2.35){
    var ra=g.ease(g.p(t,.1,.5));
    g.rect(x0-1,y0-1,M+2,bh+2,'rgba(255,255,255,'+(.6*ra)+')');g.rect(x0,y0,M,bh,'rgba(10,21,51,'+ra+')');
    for(i=0;i<=10;i++)g.rect(Math.min(x0+px(i*10),x0+M-1),y0+bh-(i%5?3:5),1,i%5?3:5,'rgba(255,255,255,'+(.45*ra)+')');
    var n=0;
    for(i=0;i<10;i++){a=.4+i*.16;p=g.p(t,a,a+.22);if(p<=0)continue;if(p>=1){n++;if(g.once('ten'+i))g.blip(392+i*44);}
      g.box(x0+px(i*10),Math.round(g.lerp(y0-34,y0,g.back(p))),px((i+1)*10)-px(i*10)-1,bh,C[10]);}
    if(n)g.text(n*10+' cm',g.cx,capY,{col:n===10?C.gold:C.white});
    return;
  }
  // ── they snap into one meter; 6 more tens and one 5 cm piece make the plank (counter stays in cm)
  var pk=g.p(t,4.4,4.7),cnt=100;
  if(pk<1){
    for(i=0;i<6;i++){a=2.95+i*.14;p=g.p(t,a,a+.2);if(p<=0)continue;if(p>=1){cnt+=10;if(g.once('t2'+i))g.blip(523+i*30);}
      g.box(x0+M+px(i*10),Math.round(g.lerp(y0-26,y0,g.back(p))),px((i+1)*10)-px(i*10)-1,bh,C[10]);}
    p=g.p(t,3.9,4.12);if(p>0){if(p>=1){cnt+=5;if(g.once('five'))g.blip(784,.08);}
      g.box(x0+M+px(60),Math.round(g.lerp(y0-26,y0,g.back(p))),px(65)-px(60),bh,C[1]);}
    g.box(x0,y0,M,bh,C[100]);g.text('1 m',x0+M/2,y0+Math.round((bh-8)/2)+1,{shadow:false});
    var fl=1-g.p(t,2.35,2.6);if(fl>0){g.rect(x0,y0,M,bh,'rgba(255,255,255,'+fl+')');if(g.once('m'))g.blip(988,.18);}
    if(t<2.95){g.sparkle(x0-4,y0-4,t,C.gold);g.sparkle(x0+M+1,y0+bh,t+.5,C.white);}
  }else cnt=165;
  var ca=1-g.p(t,4.7,4.95);if(ca>0)g.text(cnt+' cm',g.cx,capY,{col:cnt===165?'rgba(245,197,24,'+ca+')':'rgba(255,255,255,'+ca+')'});
  // ── it becomes a plank; the camera pulls back; 2 more planks slide in end to end
  function plank(X,al){g.x.globalAlpha=al;g.box(X,y0,full,bh,C.wood);g.rect(X,y0+1,full,1,C.woodHi);
    for(var k=1;k<4;k++)g.rect(X+Math.round(full*k/4)+(k%2?2:-3),y0+3+(k%3),Math.max(3,Math.round(full/8)),1,C.woodD);g.x.globalAlpha=1;}
  if(pk>0)plank(x0,pk);
  for(i=1;i<3;i++){a=5.5+(i-1)*.45;p=g.p(t,a,a+.35);if(p<=0)continue;if(p>=1&&g.once('pl'+i))g.blip(196,.14);
    var to=x0+i*full;plank(Math.round(g.lerp(W+4,to,g.ease(p))),1);}
}
function standSVG(){S=api.state();
  var cl=document.body.classList.contains('pq-clean');var c=!!S.world.counter||(cl&&jobDone('j2')),jg=jobDone('j3'),fl=!!S.world.flour||(cl&&jobDone('j4')),op=!!S.world.open||jobDone('j5');
  var s='<svg viewBox="0 0 190 120" class="mk-svg" role="img" aria-label="Amy\'s juice stand">';
  s+='<rect width="190" height="120" fill="#BDE7F7"/><rect y="88" width="190" height="32" fill="#8CCF6B"/><rect y="88" width="190" height="3" fill="#79C05A"/>';
  s+='<rect x="0" y="96" width="190" height="10" fill="#EBD2A6"/>';
  if(!c){ // three planks waiting on the grass
    for(var p=0;p<3;p++)s+='<rect x="'+(40+p*4)+'" y="'+(80-p*7)+'" width="100" height="7" rx="1" fill="#C98A4E" stroke="#3B2417" stroke-width="2"/>';
    s+='<rect x="48" y="40" width="94" height="22" rx="3" fill="#FFF3DE" stroke="#3B2417" stroke-width="3"/><text x="95" y="50" font-family="DotGothic16,Nunito" font-weight="400" font-size="10" text-anchor="middle" fill="#C56C3F">AMY\'S JUICE</text><text x="95" y="59" font-family="DotGothic16,Nunito" font-weight="400" font-size="9" text-anchor="middle" fill="#3B2417">COMING SOON</text>';}
  else{
    if(op){s+='<rect x="40" y="26" width="5" height="62" fill="#8A5A33" stroke="#3B2417" stroke-width="1.5"/><rect x="135" y="26" width="5" height="62" fill="#8A5A33" stroke="#3B2417" stroke-width="1.5"/>';
      for(var i=0;i<8;i++)s+='<rect x="'+(34+i*14)+'" y="18" width="14" height="14" fill="'+(i%2?'#FFF3DE':'#F28C28')+'" stroke="#3B2417" stroke-width="1.5"/>';
      for(var k=0;k<8;k++)s+='<path d="M'+(34+k*14)+' 32 q7 8 14 0" fill="'+(k%2?'#FFF3DE':'#F28C28')+'" stroke="#3B2417" stroke-width="1.5"/>';
      s+='<rect x="74" y="4" width="34" height="13" rx="2" fill="#2DB87A" stroke="#3B2417" stroke-width="2"/><text x="91" y="14" font-family="DotGothic16,Nunito" font-weight="400" font-size="10" text-anchor="middle" fill="#fff">OPEN</text>';}
    // the counter: three planks, 4 m 95 cm
    s+='<rect x="36" y="66" width="108" height="26" rx="2" fill="#B57E4C" stroke="#3B2417" stroke-width="3"/><rect x="36" y="66" width="108" height="6" fill="#D49E68" stroke="#3B2417" stroke-width="3"/><path d="M72 66v26M108 66v26" stroke="#8A5A33" stroke-width="2"/>';
    s+='<text x="90" y="86" font-family="DotGothic16,Nunito" font-weight="400" font-size="9" text-anchor="middle" fill="#FFF3DE">AMY\'S JUICE</text>';
    if(jg){for(var j=0;j<4;j++){var x=46+j*22;s+='<path d="M'+x+' 64 v-14 q0-4 4-4 h6 v-4 h4 v4 h1 q4 0 4 4 v14z" fill="#F28C28" stroke="#3B2417" stroke-width="2"/><rect x="'+(x+3)+'" y="52" width="3" height="8" fill="#FFC27A"/>';}
      s+='<rect x="130" y="54" width="9" height="11" fill="#FDE1B8" stroke="#3B2417" stroke-width="2"/><rect x="131" y="59" width="7" height="5" fill="#F28C28"/>';}
  }
  if(fl){s+='<g transform="translate(152,62)"><path d="M2 4 q12 -6 24 0 v24 h-24z" fill="#F2E6CC" stroke="#3B2417" stroke-width="2"/><rect x="7" y="12" width="14" height="8" fill="#C9A26B"/><text x="14" y="18.5" font-family="Nunito" font-weight="900" font-size="5" text-anchor="middle" fill="#3B2417">FLOUR</text></g>';
}
  return s+'</svg>';
}
function svgBead(){var s='<svg viewBox="0 0 170 64" class="mk-svg" style="max-width:190px" aria-hidden="true"><rect x="10" y="10" width="150" height="26" rx="3" fill="#FFF3DE" stroke="#3B2417" stroke-width="2.5"/>';
  for(var i=0;i<10;i++)s+='<rect x="'+(13+i*14.6)+'" y="14" width="11" height="18" rx="3" fill="'+(i%2?'#F5C518':'#F2A93B')+'" stroke="#3B2417" stroke-width="1.5"/>';
  return s+'<path d="M10 44v6M160 44v6M10 47h150" stroke="#C56C3F" stroke-width="2"/><text x="85" y="61" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="11" fill="#5B2E10">1 cm · each bead = 1 mm</text></svg>';}
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
    signs:[{id:'mmcm',stall:'Bead stall',q:'Each bead is 1 millimeter (mm), a tiny unit. How many mm fit in 1 cm?',ans:'×10',svg:svgBead()},
           {id:'cmm',stall:'Ribbon stall',q:'How many cm fit in 1 m?',ans:'×100',svg:svgStick()},
           {id:'mkm',stall:'Market road',q:'How many m fit in 1 km?',ans:'×1,000',svg:svgRoad()}],
    stamps:['×10','×100','×1,000'],
    miss:function(s){return 'Look at the '+s.stall.toLowerCase()+' picture again. How many of the small unit fill the big one?';},
    doneText:'All three signs stamped. ×10, ×100 and ×1,000 are the market\'s measures.',
    onStamp:function(sign){earn('stamp-'+sign.dataset.id,2,0,sign,'');},
    onDone:function(root){var rv=document.getElementById('readinessReveal');if(rv)rv.classList.add('show');setJob('j1',root);}});
}
var PLANK={label:'1 m 65 cm'};
function modelThink(m){
  OAOKit.barModel(m,{key:'g4-4-10-01-bm-think2',kind:'part-whole',units:['m','cm'],rate:100,
    story:['Mo lays 3 planks end to end for Amy\'s counter. ',{t:'The first plank is 1 m 65 cm.',put:'p0',label:PLANK.label},' ',{t:'The second plank is the same length.',put:'p1',label:PLANK.label},' ',{t:'So is the third.',put:'p2',label:PLANK.label},' How long is the counter?'],
    whole:{name:'counter',unknown:true},partsName:'planks',
    parts:[{id:'p0',value:165,name:'plank 1'},{id:'p1',value:165,name:'plank 2'},{id:'p2',value:165,name:'plank 3'}],
    question:'How long is the counter? Use the boxes your way. (Worked in centimeters only? Put 0 in the m box.)',answer:[4,95],anyForm:true,
    anyFormText:'Yes! That\'s the whole counter. On the Learn tab, the Math Crew shows two ways to get there, and how to write it as 4 m 95 cm.',
    mistakes:[{value:195,text:'That\'s only the centimeter parts: 3 × 65 cm. Each plank also has 1 m in it.'},
              {value:365,text:'That\'s 3 m and only 65 cm. Each plank has 65 cm, so the centimeters need 3 times, too.'}],
    hint:'Look at the bar: 3 equal planks. Every plank has meters AND centimeters. Add all 3, or multiply one plank by 3.',
    sym:'1 m 65 cm + 1 m 65 cm + 1 m 65 cm = 4 m 95 cm',
    doneText:'Yes! 4 m 95 cm. On the Learn tab, the Math Crew shows two ways to get there.',
    onDone:function(root){earn('think',4,4,root,'You tried it first!');}});
}
var CM={places:[100,10,1],big:100,bigUnit:'m',smallUnit:'cm',tray:true,perRow:3,
  names:{100:['meter','meters'],10:['ten-cm piece','ten-cm pieces'],1:['one-cm piece','one-cm pieces']},short:{100:'m',10:'10 cm',1:'1 cm'},
  headSub:{100:'= 100 cm',10:'10 cm each',1:'1 cm each'},discLabel:function(p){return {100:'1 m',10:'10',1:'1'}[p];}};
function copy(a,b){var o={};for(var k in a)o[k]=a[k];for(var j in b)o[j]=b[j];return o;}
function modelCounter(m){
  var one={100:1,10:6,1:5};
  OAOKit.unitMat(m,copy(CM,{key:'g4-4-10-01-ok-counter',
    adds:[{label:'+ Add plank 2 (1 m 65 cm)',of:one,when:function(st,a){return a.value()===165;},notYet:'Build one plank first: 1 m 65 cm.',said:'Two planks on the mat.'},
          {label:'+ Add plank 3 (1 m 65 cm)',of:one,when:function(st,a){return a.value()===330;},notYet:'Keep both planks on the mat (that\'s 3 m 30 cm), then add the third.',said:'Three planks! Now look at the small columns.'}],
    lead:function(a){var n=(a.st.adds||0)+1;return n>1?'<span class="exp">'+n+' × 1 m 65 cm =</span> ':'';},
    steps:[{text:'Build one plank: <b>1 m 65 cm</b>. Drag or tap pieces from the tray.',done:function(st,a){return (st.adds||0)>0||a.value()===165;}},
           {text:'Tap <b>+ Add plank 2</b>, then <b>+ Add plank 3</b>.',done:function(st){return (st.adds||0)>=2;}},
           {text:'Count the 1 cm pieces. 10 of them make one 10 cm piece. Trade them.',done:function(st){return (st.adds||0)>=2&&st.c[1]<10;}},
           {text:'Now count the 10 cm pieces. 10 of them make 1 m. Trade them, so the centimeters are less than 100.',done:function(st,a){return (st.adds||0)>=2&&st.c[10]<10&&st.c[1]<10&&a.value()===495;}}],
    doneText:'3 × 1 m 65 cm = 3 m 195 cm = 4 m 95 cm. Felix\'s way gives the same: 3 × 165 cm = 495 cm.',
    onDone:function(a,root){setJob('j2',root);}}));
}
function modelJuice(m){
  OAOKit.unitMat(m,{key:'g4-4-10-01-ok-juice',places:[1000,100,10],big:1000,bigUnit:'L',smallUnit:'mL',tray:true,perRow:3,
    names:{1000:['liter','liters'],100:['100-mL piece','100-mL pieces'],10:['10-mL piece','10-mL pieces']},short:{1000:'L',100:'100 mL',10:'10 mL'},
    headSub:{1000:'= 1,000 mL',100:'100 mL each',10:'10 mL each'},discLabel:function(p){return {1000:'1 L',100:'100',10:'10'}[p];},
    adds:[{label:'+ Pour in order 2 (1 L 400 mL)',of:{1000:1,100:4},when:function(st,a){return a.value()===2750;},notYet:'Build order 1 first: 2 L 750 mL.',said:'Both orders are on the mat.'}],
    lead:function(a){return (a.st.adds||0)>0?'<span class="exp">2 L 750 mL + 1 L 400 mL =</span> ':'';},
    steps:[{text:'Build order 1: <b>2 L 750 mL</b>.',done:function(st,a){return (st.adds||0)>0||a.value()===2750;}},
           {text:'Tap <b>+ Pour in order 2</b> to add 1 L 400 mL.',done:function(st){return (st.adds||0)>=1;}},
           {text:'Count the 100 mL pieces. 10 of them make 1 L. Trade them, so the milliliters are less than 1,000.',done:function(st,a){return (st.adds||0)>=1&&st.c[100]<10&&st.c[10]<10&&a.value()===4150;}}],
    doneText:'2 L 750 mL + 1 L 400 mL = 3 L 1,150 mL = 4 L 150 mL.',
    onDone:function(a,root){setJob('j3',root);}});
}
function modelFlour(m){
  OAOKit.barModel(m,{key:'g4-4-10-01-bm-flour',kind:'part-whole',unit:'g',
    story:['Millie\'s sack of flour has ',{t:'a mass of 6 kg 5 g',put:'whole',label:'6 kg 5 g'},'. She sells ',{t:'2 kg 750 g',put:'p0',label:'2 kg 750 g'},' to the bakery. How much flour is left?'],
    whole:{name:'sack'},partsName:'flour',
    parts:[{id:'p0',value:2750,name:'sold'},{id:'p1',value:3255,name:'left',unknown:true}],
    question:'How many grams of flour are left?',answer:3255,
    mistakes:[{value:3300,text:'6 kg 5 g is 6,000 g and 5 g more: 6,005 g. Not 6,050 g.'},
              {value:8755,text:'Millie sold some flour, so less is left. The ? is a part. Subtract.'},
              {value:4255,text:'Check the thousands after you regroup: 6,005 − 2,750.'}],
    hint:'Change both to grams first: 6 kg 5 g = 6,005 g and 2 kg 750 g = 2,750 g.',
    sym:'6,005 g − 2,750 g = 3,255 g = 3 kg 255 g',
    doneText:'3,255 g is left. That\'s 3 kg 255 g.',
    onDone:function(root){setJob('j4',root);}});
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
  OAOKit.mentalMath(m,{key:'g4-4-10-01-mm3',name:'Make 100',
    how:'1 m is 100 cm. Find the number that goes with the centimeters to make 100. Count up to the next ten, then to 100.',
    example:{q:'70 cm + ? = 1 m',bond:{whole:100,parts:[70,30]},steps:['1 m is 100 cm.','70 + 30 = 100','So 70 cm + 30 cm = 1 m.']},
    problems:[{q:'65 cm + ? = 1 m',pre:'65 cm +',post:'cm = 1 m',a:35,hint:'Count up: 65 to 70 is 5, then 70 to 100 is 30. 5 + 30 = ?'},
              {q:'45 cm + ? = 1 m',pre:'45 cm +',post:'cm = 1 m',a:55,hint:'45 to 50 is 5, then 50 to 100 is 50.'},
              {q:'82 cm + ? = 1 m',pre:'82 cm +',post:'cm = 1 m',a:18,hint:'82 to 90 is 8, then 90 to 100 is 10.'},
              {q:'38 cm + ? = 1 m',pre:'38 cm +',post:'cm = 1 m',a:62,hint:'38 to 40 is 2, then 40 to 100 is 60.'}],
    onRight:function(i,el){earn('mm-'+i,1,0,el,'');},onDone:function(root){earn('mm-all',2,3,root,'Mental math done!');}});
}
function modelBonus(m){
  OAOKit.challenge(m,{key:'g4-4-10-01-bonus',title:'Bonus quest: the two jugs',
    text:'<p>Amy has a <strong>7 L</strong> jug, a <strong>3 L</strong> jug and a water tap. She fills the 7 L jug. She pours from it into the 3 L jug until the small jug is full, then empties the small jug. She does that one more time.</p>'
      +'<p>Next she pours what is left in the big jug into the empty small jug. She fills the 7 L jug again, then pours from it until the small jug is full.</p><p>How many liters are in the 7 L jug now?</p>',
    answer:5,unit:'L',hint:'Make a table with two columns, big jug and small jug. Write how much is in each after every step.',
    explain:'<p>Big jug 7 L → pour 3 L out twice → 1 L left. Pour that 1 L into the small jug. Fill the big jug: 7 L. The small jug needs 2 L more to be full, so 7 L − 2 L = <strong>5 L</strong>.</p>',
    onDone:function(root){earn('bonus',8,8,root,'Bonus quest!');}});
}
function modelCleanSign(box){
  var S=api.state();
  function done(){box.classList.add('fixed');box.querySelector('.cs-msg').innerHTML='<b>Fixed!</b> 1 L = 1,000 mL, so 2 L = 2,000 mL. Amy\'s stand is open. Market Day is saved!';box.querySelector('.cs-eq span').textContent='2,000';}
  if(S.world.signFixed)done();
  box.querySelector('form').onsubmit=function(e){e.preventDefault();var v=+String(box.querySelector('input').value).replace(/[^0-9]/g,'');var msg=box.querySelector('.cs-msg');
    if(v===2000){S.world.signFixed=true;S.world.open=true;api.save();setJob('j5',box);done();}
    else if(v===200){msg.textContent='That\'s what the Smudge wrote! 1 L = 1,000 mL, not 100 mL. So what is 2 L?';}
    else{msg.textContent='Each liter is 1,000 mL. Two liters is two of those.';}};
}
function bind(f){return function(m,a){api=a;return f(m);};}
return {
  id:'4.10.01', key:'g4-4-10-01', title:'Metric Units of Measurement', unit:10, level:'Metric Market', standard:'MA.4.M.1.2', boss:null,
  problem:{title:'Help Amy open her juice stand for Market Day',text:'The Smudge mixed up every measure in town. Each job below uses today\'s math. Finish all five and the stand opens.',jobWord:'Market Day job',jobsTitle:'Market Day jobs'},
  jobs:[
    {id:'j1',t:'Stamp the market\'s measures',w:'Warm-Up · Market Measures',go:'#mk-measures',tab:'warmup',r:'-2deg',coins:5},
    {id:'j2',t:'Build Amy\'s counter',w:'Learn · Build the Counter',go:'#mk-counter',tab:'learn',r:'1.5deg',coins:8},
    {id:'j3',t:'Add up the juice orders',w:'Learn · Juice Orders',go:'#mk-juice',tab:'learn',r:'-1deg',coins:6},
    {id:'j4',t:'Help Millie with her flour',w:'Learn · Millie\'s Flour',go:'#mk-flour',tab:'learn',r:'2deg',coins:6},
    {id:'j5',t:'Fix the Liter Well sign',w:'Show What You Know',go:'.pq-slot[data-quest="sign"]',tab:'assignment',r:'-1.5deg',coins:10}],
  scene:function(a){api=a;return standSVG();},
  hints:[
    {sel:'#mk-think .callout-think',rungs:['Each plank is 1 m 65 cm, and the counter is 3 planks long. You can add the planks or multiply by 3.','Picture the 3 planks in a row. Every plank has 1 m and 65 cm. Use any way you like to add them all up.','Here are different numbers: 2 ribbons are each 1 m 10 cm. Together they are 2 m and 20 cm.']},
    {sel:'#tab-assignment .q-block',i:0,inside:true,rungs:['Meters to centimeters is a step down to a smaller unit, so multiply. For (b), how many whole meters fit in 3,270 cm?','100 cm = 1 m. Every 100 cm makes 1 whole meter. What is left over stays in centimeters.','Here are different numbers: 6 m = 6 × 100 = 600 cm. And 1,480 cm is 14 m 80 cm, because 1,400 cm makes 14 whole meters.']},
    {sel:'#tab-assignment .q-block',i:1,inside:true,rungs:['Pick a way: split the meters and centimeters, or change everything to centimeters first.','If the centimeters reach 100 or more, regroup: 100 cm = 1 m.','Here are different numbers: 1 m 60 cm + 1 m 70 cm = 2 m 130 cm = 3 m 30 cm. And 2 × 1 m 55 cm = 2 m 110 cm = 3 m 10 cm.']},
    {sel:'#tab-assignment .q-block',i:2,inside:true,rungs:['Every bottle holds the same amount. To find the total, multiply.','For (b), 1,000 mL = 1 L. Count the whole thousands for liters. What is left is milliliters.','Here are different numbers: 3 × 400 mL = 1,200 mL. That is 1 L and 200 mL more: 1 L 200 mL.']},
    {sel:'#tab-assignment .q-block',i:3,inside:true,rungs:['Kilograms to grams is a step down to a smaller unit. 1 kg = 1,000 g.','Change the kilograms to grams, then add the extra grams. Careful with zeros: the grams need three places.','Here are different numbers: 3 kg 9 g = 3,000 g + 9 g = 3,009 g. Not 39 g, and not 309 g!']}],
  writing:{
    'journal-r1':{min:6,chips:[{label:'meters and kilometers',words:['km','kilometer','kilometers','kilometre']},{label:'grams and kilograms',words:['kg','kilogram','kilograms','gram','grams']},{label:'milliliters and liters',words:['ml','milliliter','milliliters','liter','liters','litre','l and ml','ml and l']}]},
    'journal-think':{min:10,chips:[{label:'one plank\'s length',words:['165','1 m 65','1m 65','65 cm','65','one plank','each plank']},{label:'3 planks',words:['3','three','times','×','x 3','plus','+','add','added','adding','multiply','multiplied']},{label:'your answer',words:['495','4 m 95','4m 95','4 m and 95']}]},
    'journal-soc':{min:12,chips:[{label:'6 kg is 6,000 g',words:['6000','6,000','thousand','1000','1,000']},{label:'the right amount',words:['6005','6,005']},{label:'why 65 g is wrong',words:['zero','zeros','0','too small','way less','much less','tiny','place','places','wrong','not right','isnt','isn\'t','not 65','not the same']}]}},
  words:[{w:'metric',d:'the measuring system that uses 10, 100 and 1,000, like meters, grams and liters'},{w:'factor',d:'the number you multiply by to change to a smaller unit, like ×100 for meters to centimeters'},
    {w:'regroup',d:'trade small units for a bigger one, like 100 cm for 1 m'},{w:'mass',d:'how heavy something is'},{w:'capacity',d:'how much a container can hold'}],
  intendedWrong:['2 L = 200 mL','2 L is 200 mL','6 kg 5 g is the same as 65 g'],
  intro:{card:false,len:7.7,
    alt:'Ten 10 cm pieces fill a ruler: 100 cm makes 1 meter. Six more 10 cm pieces and a 5 cm piece make a plank 165 cm long. Two more planks slide in end to end. Amy walks up and wonders how long the three planks are together.',
    scene:introScene},
  models:{stamps:bind(modelStamps),think:bind(modelThink),counter:bind(modelCounter),juice:bind(modelJuice),flour:bind(modelFlour),prove:bind(modelProve),mental:bind(modelMental),bonus:bind(modelBonus),cleanSign:bind(modelCleanSign)}
};
})();
