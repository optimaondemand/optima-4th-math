/* ═══ PQ_DATA · Lesson 4.10.06 Fractions and Measurement · Level 10 "Metric Market" · the Night Market (lesson 6 of 7) ═══
   Everything lesson-specific lives here. The engine (pq-engine.js) and art kit (pq-art.js) hold no lesson content. */
var PQ_DATA = (function(){
var TS=16;

/* The night market square: the road along the bottom (from the Clock Tower, west), a lantern plaza in the middle with
   Ivy's ribbon stall, the tea stall and the oil stall, the Crew by the road (south-west), Penny's cart (south-east), and an
   alley north-east that ends at a gray brick wall with a barred gate: the Smudge's brick factory. */
function mkMap(){
  var W=32,H=22,g=[],i,j;
  for(j=0;j<H;j++){g.push([]);for(i=0;i<W;i++)g[j].push((j===0||j===H-1||i===0||i===W-1)?'T':'.');}
  for(i=1;i<=30;i++)g[17][i]='p';
  g[17][0]='p';
  for(j=8;j<=13;j++)for(i=8;i<=22;i++)g[j][i]='s';
  for(j=14;j<=16;j++)g[j][15]='p';
  for(i=23;i<=26;i++)g[10][i]='p';
  for(j=4;j<=10;j++)g[j][26]='p';
  [[3,13],[6,11],[25,14],[28,12],[11,19],[22,20],[2,8],[29,16],[20,5],[12,5]].forEach(function(p){g[p[1]][p[0]]='f';});
  [[1,1],[2,1],[1,2],[1,20],[2,20],[30,20],[29,20],[30,19]].forEach(function(p){g[p[1]][p[0]]='T';});
  return g.map(function(r){return r.join('');});
}

var IVY={skin:['#F6D3B3','#E2AE88'],hair:['#2A1D18','#160E0A'],style:'long',shirt:'#E04F6A',acc:'flower',acc2:'#F5C518'};
var D = {
  key:'g4-4-10-06-pq',
  levelLabel:'LV 10 · NIGHT MARKET',
  map:mkMap(),
  speakers:{
    sys:{name:'',color:'#3B2417',pitch:440,noface:true},
    me:{name:'You',color:'#6B3FA0',pitch:600},
    opti:{name:'OPTI',color:'#0E1C42',pitch:760},
    atlas:{name:'ATLAS',color:'#1F8FB4',pitch:420},
    felix:{name:'FELIX',color:'#1E8C5A',pitch:500},
    hazel:{name:'HAZEL',color:'#B08A0A',pitch:680},
    cora:{name:'CORA',color:'#C2601F',pitch:600},
    ivy:{name:'IVY',color:'#C93A5A',pitch:640},
    tea:{name:'TEA SELLER',color:'#2F5D8A',pitch:380},
    oil:{name:'LAMP SELLER',color:'#7A4A2A',pitch:340},
    smudge:{name:'THE SMUDGE',color:'#55505E',pitch:220,noface:true},
    penny:{name:'PENNY',color:'#8E4FBF',pitch:620},
    sign:{name:'SIGN',color:'#8A5A33',pitch:480,noface:true},
    gate:{name:'THE GATE',color:'#55505E',pitch:260,noface:true},
    'item-tag':{name:'',color:'#3B2417',pitch:520,icon:'tag'}
  },
  npcs:[
    {id:'opti',owl:true,x:2,y:16,fixed:true},
    {id:'atlas',x:5,y:14,dir:'right',look:{skin:['#EBC09A','#CF9A6F'],hair:['#5A3A22','#3E2716'],style:'short',shirt:'#55C8E8',acc:'hat',acc2:'#D8B575'}},
    {id:'felix',x:8,y:14,dir:'left',look:{skin:['#9C6640','#7C4C2C'],hair:['#1E1E28','#0E0E16'],style:'spiky',shirt:'#2DB87A',acc:'goggles'}},
    {id:'hazel',x:5,y:16,dir:'right',look:{skin:['#F6D3B3','#E2AE88'],hair:['#C4512E','#963A1E'],style:'long',shirt:'#F5C518',acc:'beret',acc2:'#C93A4A'}},
    {id:'cora',x:8,y:16,dir:'left',look:{skin:['#C98E5E','#A86E42'],hair:['#2A1D18','#160E0A'],style:'puffs',shirt:'#E07B39',acc:'glasses',frame:'#5B2E10'}},
    {id:'ivy',x:12,y:11,dir:'down',look:IVY},
    {id:'tea',x:19,y:11,dir:'down',look:{skin:['#8A5A3B','#6E432A'],hair:['#E8E4EE','#BDB6C8'],style:'short',shirt:'#2F5D8A'}},
    {id:'oil',x:23,y:16,dir:'left',look:{skin:['#EBC09A','#CF9A6F'],hair:['#5A3A22','#3E2716'],style:'short',shirt:'#7A4A2A',acc:'hat',acc2:'#3B2417'}},
    {id:'penny',x:27,y:19,dir:'left',look:{skin:['#EBC09A','#CF9A6F'],hair:['#8E6BD0','#6A48A8'],style:'puffs',shirt:'#6B3FA0'}}
  ],
  items:[
    {id:'tA',kind:'tag',x:4,y:10,say:'one third of a foot',bin:'bin4in',a:'4 inches'},
    {id:'tB',kind:'tag',x:17,y:15,say:'one half of a foot',bin:'bin6in',a:'6 inches'},
    {id:'tC',kind:'tag',x:27,y:14,say:'five twelfths of a foot',bin:'bin5in',a:'5 inches'},
    {id:'tD',kind:'tag',x:10,y:19,say:'one fourth of a pound of tea',bin:'bin4oz',a:'4 ounces'}
  ],
  labels:{opti:'Opti',atlas:'Atlas',felix:'Felix',hazel:'Hazel',cora:'Cora',ivy:'Ivy',tea:'the tea seller',oil:'the lamp seller',penny:'Penny',
    bin4in:'4 IN bin',bin5in:'5 IN bin',bin6in:'6 IN bin',bin4oz:'4 OZ bin',string:'the lantern string',gate:'the brick gate',item:'A fallen tag'},
  objects:[],
  quests:{},
  transcripts:{}
};

/* the sort quest: Ivy's tag box tipped over. Each tag names a fraction of a unit; the bins are the amounts. */
D.items.forEach(function(it){
  it.show=function(S){var q=S.q.sort;return !!(q&&q.met&&!(q.sorted||{})[it.id]&&q.hold!==it.id);};
  it.take=function(api){var q=api.S.q.sort;
    if(q.hold){api.snd.bump();api.say([{who:'sys',t:'Your hands are full. Put the tag you are holding in a bin first.'}]);return;}
    q.hold=it.id;api.save();api.snd.item();
    api.say([{who:'item-tag',t:'You picked up a tag. It says: '+it.say+'.'},{who:'sys',t:'Take it to Ivy\'s bins by her stall. Each bin is an amount: 4 IN, 5 IN, 6 IN or 4 OZ.'}],function(a){a.goal(D.quests.sort.goal(a.S));});};
});
function itemOf(id){return D.items.filter(function(z){return z.id===id;})[0];}

/* ───────── objects (art + footprints) ───────── */
function O(o){D.objects.push({build:function(A){var r=o.make(A);r.id=o.id;r.solid=o.solid;r.hidden=o.hidden;r.mx=o.mx;r.my=o.my;return r;}});}
function W(){return PQ._state().world;}
function jd(id){return !!(window.PQM&&PQM.jobDone(id));}
// Ivy's ribbon stall, the tea stall (jars) and the lamp-oil stall (jars)
O({id:'ivyStall',make:function(A){return {spr:A.stall('ribbon'),dx:10*TS,dy:9*TS-24,base:9*TS+15,fp:[[10,9],[11,9],[12,9]]};}});
O({id:'teaStall',make:function(A){return {spr:A.stall('jars'),dx:17*TS,dy:9*TS-24,base:9*TS+15,fp:[[17,9],[18,9],[19,9]]};}});
O({id:'oilStall',make:function(A){return {spr:A.stall('bread'),dx:23*TS,dy:14*TS-24,base:14*TS+15,fp:[[23,14],[24,14],[25,14]]};}});
// the four sorting bins by Ivy's stall
[['bin4in',8,12,'#55C8E8','4'],['bin5in',9,12,'#2DB87A','5'],['bin6in',10,12,'#E07B39','6'],['bin4oz',11,12,'#6B3FA0','4']].forEach(function(b){
  O({id:b[0],mx:b[1]*TS+8,my:b[2]*TS-8,make:function(A){var c=A.cv(16,30),x=c.getContext('2d');x.drawImage(A.crate(),0,14);
    A.R(x,A.P.ol,2,0,1,16);A.R(x,A.P.ol,3,0,12,9);A.R(x,b[3],4,1,10,7);
    // dots on the flag: as many as the amount (2, 4 or 6), gold flag for the ounces bin
    var n=+b[4];for(var q=0;q<n;q++)A.R(x,'#FFFFFF',5+(q%3)*3,2+Math.floor(q/3)*3,2,2);
    return {spr:c,dx:b[1]*TS,dy:b[2]*TS-14,base:b[2]*TS+15,fp:[[b[1],b[2]]]};}});});
// the lantern string across the plaza: empty hooks until the build quest; lit lanterns after
O({id:'string',mx:15*TS+8,my:7*TS,make:function(A){var lan=A.item('lantern');var fp=[];for(var i=12;i<=18;i++)fp.push([i,7]);
  return {spr:null,dx:12*TS,dy:7*TS-10,base:7*TS+15,fp:fp,anim:function(x,X,Y,t){X=Math.round(X);Y=Math.round(Y);var lit=W().lit;
    x.fillStyle='#3B2417';x.fillRect(X,Y+4,7*TS,2);
    for(var k=0;k<4;k++){var lx=X+8+k*32;if(lit){x.drawImage(lan,lx,Y+6);if(Math.floor(t*3+k)%3){x.fillStyle='rgba(245,197,24,.18)';x.fillRect(lx-3,Y+3,22,20);}}else{x.fillStyle='#3B2417';x.fillRect(lx+7,Y+6,2,4);}}}};}});
// the brick factory: a gray wall at the top of the alley with a barred gate; the gate swings open when the quest is solved
O({id:'factory',make:function(A){var c=A.house({w:112,h:64,roof:'#55505E',wall:'#8C8C92',sign:true,signC:'#3B2417',signDots:function(x,X,Y){for(var i=1;i<25;i+=3){x.fillStyle='#B9B5C2';x.fillRect(X+i,Y+1,2,3);}}});
  var fp=[];for(var j=1;j<=3;j++)for(var i=23;i<=29;i++)fp.push([i,j]);return {spr:c,dx:23*TS,dy:4*TS-64,base:3*TS+15,fp:fp,anim:function(x,X,Y,t){if(W().factoryOpen&&Math.floor(t*2)%2){x.fillStyle='#F5C518';x.fillRect(Math.round(X)+52,Math.round(Y)+30,8,8);}}};}});
O({id:'gate',mx:26*TS+8,my:4*TS,hidden:function(){return !!W().factoryOpen;},make:function(A){var c=A.cv(16,20),x=c.getContext('2d');A.R(x,A.P.ol,1,0,14,20);A.R(x,'#55505E',2,1,12,18);for(var k=3;k<14;k+=4)A.R(x,'#B9B5C2',k,2,2,16);A.R(x,'#F5C518',6,9,4,3);
  return {spr:c,dx:26*TS,dy:4*TS-4,base:4*TS+15,fp:[[26,4]]};}});
[[25,5],[27,5]].forEach(function(p){O({make:function(A){return {spr:A.barrier(),dx:p[0]*TS,dy:p[1]*TS,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});
O({id:'westSign',make:function(A){return {spr:A.signpost('wood'),dx:1*TS,dy:16*TS-6,base:16*TS+15,fp:[[1,16]]};}});
O({id:'alleySign',make:function(A){return {spr:A.signpost('wood'),dx:24*TS,dy:9*TS-6,base:9*TS+15,fp:[[24,9]]};}});
O({id:'outfitters',make:function(A){return {spr:A.hatStall(),dx:27*TS,dy:20*TS-40,base:19*TS+15,fp:[[27,19],[28,19],[29,19]]};}});
O({make:function(A){return {spr:A.bench(),dx:13*TS+1,dy:13*TS+2,base:13*TS+15,fp:[[13,13],[14,13]]};}});
O({make:function(A){return {spr:A.bench(),dx:19*TS+1,dy:13*TS+2,base:13*TS+15,fp:[[19,13],[20,13]]};}});
[[9,7],[21,7],[12,16],[18,16],[24,16],[6,18]].forEach(function(p){O({make:function(A){return {spr:A.lamp(),dx:p[0]*TS+3,dy:p[1]*TS-14,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});
[[3,11],[9,3],[16,4],[29,9],[13,15],[18,19],[24,18],[6,19],[30,13]].forEach(function(p){O({make:function(A){return {spr:A.bush(),dx:p[0]*TS,dy:p[1]*TS,base:p[1]*TS+14,fp:[[p[0],p[1]]]};}});});
[[4,6],[30,6],[2,18],[11,3],[19,3]].forEach(function(p){O({make:function(A){return {spr:A.tree(),dx:p[0]*TS-8,dy:p[1]*TS-24,base:p[1]*TS+15,fp:[[p[0],p[1]]]};}});});

/* ───────── quests ───────── */
function job(id){return !!(window.PQM&&PQM.jobDone(id));}
D.quests.sort={
  title:'Ivy\'s Fallen Tags',spawn:[15,15,'up'],next:{tab:'warmup',sel:'#mk-mental',label:'Mental Math'},
  teaser:'The Smudge tipped over Ivy\'s tag box. Her ribbon and tea tags are scattered across the market, and each one names a fraction of a unit.',
  lockText:'Finish Cut the Foot above to unlock this quest. Ivy needs helpers who can cut a foot into equal parts.',
  locked:function(){return !job('j1');},
  doneText:'One third of a foot is 4 inches, one half is 6, five twelfths is 5, and one fourth of a pound of tea is 4 ounces. Every tag is in its bin. Next: Mental Math, then the Think puzzle.',
  goal:function(S){var q=S.q.sort||{},n=Object.keys(q.sorted||{}).length;
    if(!q.met)return 'Talk to <b>Ivy</b> at the ribbon stall.';
    if(q.hold)return 'Put the tag that says <b>'+itemOf(q.hold).say+'</b> in the right bin.';
    return n<4?'Find the sparkly tags and sort them <b>('+n+'/4)</b>':'Tell <b>Ivy</b> you\'re done.';},
  markers:function(S){var q=S.q.sort||{};if(!q.met)return [{id:'ivy'}];if(q.hold)return [{id:'bin4in'},{id:'bin5in'},{id:'bin6in'},{id:'bin4oz'}];return Object.keys(q.sorted||{}).length>=4?[{id:'ivy'}]:[];},
  start:function(api){var q=api.q();if(!q.seen){q.seen=1;api.save();api.banner('LEVEL 10','NIGHT MARKET · LESSON 6 OF 7');
    api.say([{who:'opti',t:'Hoo! Welcome to the night market, {name}. The clock chimed this morning: the Golem comes in 30 hours.'},
      {who:'opti',t:'Tonight the market hangs its lanterns. Every lantern needs a ribbon, and the ribbons are measured in parts of a foot.'},
      {who:'opti',t:'That\'s Ivy, the lantern-keeper, at the ribbon stall. She looks worried. Go say hello.'}],function(a){a.goal(D.quests.sort.goal(a.S));});}},
  reset:function(S){S.q.sort={};},
  transcript:['Opti: Welcome to the night market. The clock said the Golem comes in 30 hours. Tonight the market hangs its lanterns.','Ivy: The Smudge tipped over my tag box. Please sort the tags into my bins: 4 IN, 5 IN, 6 IN and 4 OZ.','Tag: one third of a foot → 4 IN.','Tag: one half of a foot → 6 IN.','Tag: five twelfths of a foot → 5 IN.','Tag: one fourth of a pound of tea → 4 OZ.','Ivy: Every tag is back. Thank you!']
};
var RIBBONS=[{say:'five twelfths of a foot',eq:'five twelfths of 1 ft =',unit:'in',a:5,wrong:{60:'five times twelve is 60. But a twelfth means the foot is cut into 12 equal parts. Each part is 1 inch.',1:'That is one part, one twelfth. You need 5 of them.'}},
  {say:'one sixth of a foot',eq:'one sixth of 1 ft =',unit:'in',a:2,wrong:{6:'A sixth means 6 equal parts. Cut 12 inches into 6 equal parts. How long is each part?',72:'Twelve times six is 72. But a sixth is one of 6 equal parts of the foot, so it is smaller than 12 inches.'}},
  {say:'one twelfth of a foot',eq:'one twelfth of 1 ft =',unit:'in',a:1,wrong:{12:'Twelve is the number of equal parts. A twelfth is ONE of those parts. How long is one?',144:'Twelve times twelve is 144, bigger than a whole foot. A twelfth is one of 12 equal parts of the foot.'}}];
D.quests.build={
  title:'String the Lanterns',spawn:[14,10,'up'],next:{tab:'learn',sel:'#mk-orders',label:'Ivy\'s Order List'},
  teaser:'The lantern string hangs empty over the plaza. Ivy has three ribbons to cut, each tagged as a fraction of a foot, but her ruler only shows inches.',
  lockText:'Finish Ribbons for the Lanterns on the Learn tab above to unlock this quest.',
  locked:function(){return !job('j2');},
  doneText:'Five twelfths of a foot is 5 inches, one sixth is 2 inches, one twelfth is 1 inch. The lanterns are up and glowing! Next: Ivy\'s Order List.',
  goal:function(S){var q=S.q.build||{},n=q.cut||0;if(!q.met)return 'Talk to <b>Ivy</b>.';return n<3?'Cut the ribbons at <b>the lantern string</b> ('+n+'/3).':'The lanterns are lit!';},
  markers:function(S){var q=S.q.build||{};if(!q.met)return [{id:'ivy'}];return (q.cut||0)<3?[{id:'string'}]:[];},
  start:function(api){api.save();},
  reset:function(S){S.world.lit=false;S.q.build={};},
  skip:function(S){S.world.lit=true;},
  transcript:['Ivy: The lantern string is empty. Each ribbon tag is a fraction of a foot, but my ruler shows inches. Cut them for me at the string.','You: five twelfths of a foot is 5 inches.','You: one sixth of a foot is 2 inches.','You: one twelfth of a foot is 1 inch.','Ivy: The lanterns are up! The market glows.']
};
var ORDERS=[
  {ask:'The tea seller ordered seven tenths of a liter of lamp oil for his stall lamp. My jug pours milliliters. How many milliliters?',eq:'seven tenths of 1 L =',unit:'mL',a:700,
   miss:function(v){return v===7000?{who:'cora',t:'Seven times 1,000 is 7,000. But a tenth means the liter is cut into 10 equal parts. One part is 100 milliliters.'}:v===100?{who:'felix',t:'That is one tenth. Ivy wants 7 of them.'}:{who:'felix',t:'Cut 1,000 milliliters into 10 equal parts. One part is 100. Take 7 parts.'};}},
  {ask:'The tea seller needs one half of a meter of wick string. My string is marked in centimeters. How many centimeters?',eq:'one half of 1 m =',unit:'cm',a:50,
   miss:function(v){return v===200?{who:'hazel',t:'Picture the meter cut in half. Half of 100 centimeters is less than 100, not more.'}:{who:'atlas',t:'A meter is 100 centimeters. Half means 2 equal parts.'};}},
  {ask:'Penny wants one fourth of a liter of oil for her little cart lamp. How many milliliters?',eq:'one fourth of 1 L =',unit:'mL',a:250,
   miss:function(v){return v===4000?{who:'cora',t:'Four times 1,000 is 4,000. A fourth is one of 4 equal parts of the liter, so it is smaller than 1,000.'}:v===25?{who:'felix',t:'Close! A liter is 1,000 milliliters, not 100. Cut 1,000 into 4 equal parts.'}:{who:'felix',t:'Cut 1,000 milliliters into 4 equal parts. How big is one part?'};}}];
D.quests.deliver={
  title:'Lamp Oil for the Stalls',spawn:[14,10,'up'],next:{tab:'learn',sel:'#mk-scraps',label:'Label the Scraps'},
  teaser:'The lamp seller has three orders for oil and wick, each written as a fraction of a liter or a meter. His jug and string are marked in milliliters and centimeters.',
  lockText:'Finish Ivy\'s Order List on the Learn tab above to unlock this quest.',
  locked:function(){return !job('j3');},
  doneText:'Seven tenths of a liter is 700 mL, one half of a meter is 50 cm, and one fourth of a liter is 250 mL. Every stall has its oil. Next: Label the Scraps.',
  goal:function(S){var q=S.q.deliver||{},n=q.done||0;return !q.met?'Talk to <b>the lamp seller</b> by his stall.':n<3?'Fill the orders with <b>the lamp seller</b> ('+n+'/3).':'All three orders filled!';},
  markers:function(S){var q=S.q.deliver||{};return (q.done||0)<3?[{id:'oil'}]:[];},
  start:function(api){api.save();},
  reset:function(S){S.q.deliver={};},
  transcript:['Lamp seller: Three orders, all written as fractions. My jug pours milliliters and my string is marked in centimeters.','You: seven tenths of a liter is 700 mL.','You: one half of a meter is 50 cm.','You: one fourth of a liter is 250 mL.','Lamp seller: Every stall has its oil tonight. Thank you!']
};
D.quests.factory={
  title:'The Brick Factory',spawn:[14,10,'up'],next:{tab:'assignment',sel:'.gathered-box',label:'Gather your answers'},
  teaser:'The lanterns are lit, and their light reaches the alley behind the market. There is a trail of gray brick dust on the ground.',
  lockText:'Finish the last job above (the Smudge\'s tag) to unlock this quest.',
  locked:function(){return !job('j6');},
  doneText:'One third of an hour is 20 minutes, not 3. The gate opened, and the Smudge\'s brick factory is found: GOLEM PART 2. Next lesson, the farmers\' market, and the Golem itself.',
  goal:function(S){var q=S.q.factory||{};return !q.met?'Talk to <b>Ivy</b>.':!S.world.factoryOpen?'Follow the brick dust up the alley to <b>the brick gate</b>.':'The factory is found!';},
  markers:function(S){var q=S.q.factory||{};return !q.met?[{id:'ivy'}]:!S.world.factoryOpen?[{id:'gate'}]:[];},
  start:function(api){api.S.world.lit=true;api.save();},
  reset:function(S){S.world.factoryOpen=false;S.q.factory={};},
  skip:function(S){S.world.factoryOpen=true;},
  transcript:['Ivy: With the lanterns lit, I can see brick dust in the alley. Follow it!','The gate: GATE OPENS ONE THIRD OF AN HOUR AFTER DARK. THAT IS 3 MINUTES, HEH.','You: one third of an hour is 20 minutes.','The gate swings open. Inside: brick molds, and a stamp that says GOLEM PART 2.','The Smudge: You found my factory! But my Golem is almost finished. Heh heh heh!','Opti: Tomorrow, the farmers\' market. We will be ready for the Golem.']
};

D.quests.crew={
  title:'Hear the Crew\'s Ways',spawn:[6,15,'down'],next:{tab:'learn',sel:'#journal-compare',label:'Which way is like yours?'},
  teaser:'The Math Crew worked out Ivy\'s ribbon puzzle. Walk to each of them and hear how they did it.',
  doneText:'Atlas multiplied the fraction by 12. Felix cut the foot into 6 equal parts and took 5. Hazel pictured the ruler, and Cora kept the part and the whole in the same unit. Next: which way is most like yours?',
  goal:function(S){var q=S.q.crew||{},n=Object.keys(q.heard||{}).length;return n<4?'Walk to each Math Crew member and hear their way <b>('+n+'/4)</b>':'Tell <b>Opti</b> what you heard.';},
  markers:function(S){var h=(S.q.crew||{}).heard||{};var m=['atlas','felix','hazel','cora'].filter(function(c){return !h[c];}).map(function(c){return {id:c};});return m.length?m:[{id:'opti'}];},
  start:function(api){var q=api.q();if(!q.seen){q.seen=1;api.save();
    api.say([{who:'opti',t:'Hoo! The Math Crew worked out Ivy\'s ribbon puzzle. They each found the answer their own way.'},
      {who:'opti',t:'Walk up to each of them and listen. Then come back and tell me.'}],function(a){a.goal(D.quests.crew.goal(a.S));});}},
  reset:function(S){S.q.crew={};},
  transcript:['Atlas (multiply): five sixths times 12. 5 times 12 is 60, and 60 divided by 6 is 10. So 10 inches.','Felix (cut the foot): cut 12 inches into 6 equal parts. Each part is 2 inches. Take 5 parts: 10 inches.','Hazel (picture the ruler): a foot ruler has 12 inch marks. Five sixths of it stops 2 inches before the end.','Cora (same unit): to go backward, write the part over the whole in the same unit, inches over inches.','Opti: Two ways, one answer: 10 inches.']
};
var WAYS={
  atlas:[{who:'atlas',t:'My way is to multiply the fraction by 12, because a foot is 12 inches.'},
    {who:'atlas',t:'Five sixths times 12. First 5 times 12, that\'s 60. Then 60 divided by 6, that\'s 10.'},
    {who:'atlas',t:'So five sixths of a foot is 10 inches!'}],
  felix:[{who:'felix',t:'My way is to cut the foot into equal parts first.'},
    {who:'felix',t:'Sixths means 6 equal parts. 12 inches cut into 6 equal parts is 2 inches each.'},
    {who:'felix',t:'Then I take 5 of the parts. 5 times 2 inches is 10 inches. Same answer as Atlas!'}],
  hazel:[{who:'hazel',t:'I picture a foot ruler with its 12 inch marks.'},
    {who:'hazel',t:'If I cut it into 6 equal pieces, every piece is 2 inches long. Five of those pieces reach 10 inches, just 2 inches short of the end.'}],
  cora:[{who:'cora',t:'Here is my rule for going backward, from inches to a fraction of a foot.'},
    {who:'cora',t:'The part and the whole must be in the same unit. 10 inches out of a foot is 10 inches out of 12 inches, never 10 out of 1.'}]
};
/* ───────── talk ───────── */
/* The Crew says hello and talks about the night market first (HELLO). Their method lines (IDLE) unlock only after the page
   teaches the two ways: CREW_TAUGHT is Ribbons for the Lanterns (Job 2). */
var CREW_TAUGHT='j2';
var HELLO={
  atlas:'Hi, I\'m Atlas! A night market! I\'ve never seen so many lanterns in one place. Well, I will, once they\'re hung.',
  felix:'Hey, I\'m Felix! I counted the hooks on the lantern string. Every one of them is empty.',
  hazel:'Hi! I\'m Hazel. I\'m drawing Ivy\'s ribbon stall. Look at all the colors!',
  cora:'Hello, I\'m Cora. Every ribbon here has a tag, and some of the tags look smudged. I don\'t trust them.'
};
var IDLE={
  atlas:'To find a fraction of a unit, I multiply the fraction by the number of small units. Five sixths of a foot is 5 times 12, that\'s 60, divided by 6: 10 inches.',
  felix:'I cut the whole into equal parts first. Twelfths means 12 parts of 1 inch each. Seven parts is 7 inches.',
  hazel:'I picture the ruler cut into equal pieces. Then I count the pieces I need.',
  cora:'Going backward, write the part over the whole in the same unit. Then make bigger equal parts to simplify.'
};
var SHOP=[['cap','Explorer cap',10],['scarf','Market scarf',8],['flower','Hair flower',6],['pack','Travel pack',15]];
function shop(api){
  var Wl=PQM.wallet();
  var ch=SHOP.map(function(it){var own=Wl.gear[it[0]];return [it[1]+(own?(Wl.wear[it[0]]?' · wearing':' · put on'):' · '+it[2]+' 🪙'),function(a){
    if(own){Wl.wear[it[0]]=!Wl.wear[it[0]];PQM.saveWallet();PQ._rebuild();a.snd.sel();a.say([{who:'penny',t:Wl.wear[it[0]]?'Looking sharp!':'Off it comes. I\'ll keep it safe in your pack.'}]);return;}
    if(PQM.spend(it[2])){Wl.gear[it[0]]=1;Wl.wear[it[0]]=1;PQM.saveWallet();PQ._rebuild();a.snd.item();a.say([{who:'penny',t:'One '+it[1].toLowerCase()+', coming right up! It\'ll go with you to every lesson.'}]);}
    else{a.snd.bad();a.say([{who:'penny',t:'That costs '+it[2]+' coins, and you have '+Wl.coins+'. Earn more with correct work on the lesson page, like Cut the Foot and Ribbons for the Lanterns.'}]);}}];});
  ch.push(['Just looking',function(a){a.say([{who:'penny',t:'Come back any time!'}]);}]);
  api.say([{who:'penny',t:'I set up by the lanterns tonight! You have '+Wl.coins+' coins. Anything catch your eye?',choices:ch}]);
}
function curQuest(){var s=document.querySelector('.pq-slot.pq-live');return s&&s.dataset.quest;}
function padOf(who,t,eq,unit,check){var p={who:who,t:t,pad:{eq:eq,unit:unit,check:function(v,a){check(v,a,p);}}};return p;}
D.talk=function(id,api){
  var S=api.S,q=curQuest();
  if(q==='crew'&&WAYS[id]){return api.say(WAYS[id],function(a){var C=a.S.q.crew;C.heard=C.heard||{};C.heard[id]=1;a.save();
      var n=Object.keys(C.heard).length;a.say([{who:'sys',t:n<4?'That\'s '+n+' of 4. Find the next Crew member.':'You heard all four! Go back to Opti.'}],function(b){b.goal(D.quests.crew.goal(b.S));});});}
  if(q==='crew'&&id==='opti'){var CC=S.q.crew||{};if(Object.keys(CC.heard||{}).length>=4)return api.say([{who:'opti',t:'Hoo! Two ways, and one answer: five sixths of a foot is 10 inches.'},{who:'opti',t:'Which way is most like yours? Write about it on your page, right under the Crew\'s card.'}],function(a){a.complete();});
    return api.say([{who:'opti',t:'Walk up to each Crew member and listen to their way first.'}]);}
  if(id==='opti'){
    if(S.world.factoryOpen)return api.say([{who:'opti',t:'The factory is found. Tomorrow the farmers\' market, {name}, and the Golem.'}]);
    return api.say([{who:'opti',t:'Hoo! Every lantern job on the page helps Ivy light the night market.'}]);
  }
  if(IDLE[id])return api.say([{who:id,t:(PQM.jobDone(CREW_TAUGHT)?IDLE:HELLO)[id]}]);
  if(id==='ivy'){
    if(q==='sort'){var R=S.q.sort;
      if(!R.met)return api.say([{who:'ivy',t:'Oh, hello! I\'m Ivy. I keep the lanterns for the night market.'},{who:'ivy',t:'The Smudge tipped over my tag box, and the tags blew all over the square. Each tag names a fraction of a unit.'},
        {who:'ivy',t:'Please sort them into my bins. Each bin is an amount: 4 inches, 5 inches, 6 inches or 4 ounces. Walk onto a sparkle to pick up a tag.'}],
        function(a){a.S.q.sort.met=1;a.save();a.goal(D.quests.sort.goal(a.S));});
      var n=Object.keys(R.sorted||{}).length;
      if(n<4)return api.say([{who:'ivy',t:R.hold?'Read the tag. Cut the unit into that many equal parts, like you did on your page. How big is the piece?':'Still '+(4-n)+' to go! Look for sparkles around the square.'}]);
      return api.say([{who:'ivy',t:'Every tag is in its bin. Thank you, {name}!'},{who:'felix',t:'A fraction of a unit is a fraction of its small units. One third of a foot is one third of 12 inches.'}],function(a){a.complete();});}
    if(q==='build'){var B=S.q.build;
      if(!B.met)return api.say([{who:'ivy',t:'The lantern string is still empty, and it\'s getting dark!'},{who:'ivy',t:'Here are three ribbons. Each tag is a fraction of a foot, but my ruler only shows inches.'},
        {who:'ivy',t:'Walk to the lantern string and cut each ribbon to the right number of inches.'}],
        function(a){a.S.q.build.met=1;a.save();a.goal(D.quests.build.goal(a.S));});
      return api.say([{who:'ivy',t:S.world.lit?'Look at them glow!':'The string hangs over the plaza, just north of my stall.'}]);}
    if(q==='factory'){var F=S.q.factory;
      if(!F.met)return api.say([{who:'ivy',t:'The lanterns light up the whole square now. And look, behind the market!'},{who:'ivy',t:'There is gray dust on the ground in the alley. Brick dust. Follow it, {name}!'}],
        function(a){a.S.q.factory.met=1;a.save();a.goal(D.quests.factory.goal(a.S));});
      return api.say([{who:'ivy',t:S.world.factoryOpen?'A brick factory, right behind my market!':'The alley starts by the lamp stall and goes north.'}]);}
    return api.say([{who:'ivy',t:'Welcome to the night market! Ribbons, lanterns and tea. Everything here comes in parts of a unit.'}]);
  }
  if(id==='string'){
    if(q==='build'&&S.q.build.met&&!S.world.lit){var B2=S.q.build,k=B2.cut||0,RB=RIBBONS[k];
      var p1=padOf('me','How many inches? Type it, then press OK.',RB.eq,RB.unit,function(v,a,me){
        if(v===RB.a){a.snd.good();B2.cut=k+1;a.save();
          if(k<2)return a.say([{who:'sys',t:'Snip! '+RB.a+' inches. One lantern goes up.'}],function(b){b.goal(D.quests.build.goal(b.S));});
          a.S.world.lit=true;a.save();a.say([{who:'sys',t:'Snip! The last lantern goes up, and the whole string lights the plaza.'},{who:'ivy',t:'They\'re beautiful! Thank you, {name}.'}],function(b){b.goal(D.quests.build.goal(b.S));b.complete();});}
        else{a.snd.bad();var w=RB.wrong[v];a.say([{who:w?'cora':'felix',t:w||'Cut the 12 inches into equal parts first: the bottom number says how many. Then take the top number of parts.'},me]);}});
      return api.say([{who:'sign',t:'The ribbon tag says: '+RB.say+'.'},p1]);}
    return api.say([{who:'sys',t:S.world.lit?'The lantern string glows over the plaza.':'The lantern string. Every hook is empty.'}]);
  }
  if(id==='oil'){
    if(q==='deliver'){var V=S.q.deliver,n2=V.done||0;
      if(!V.met)return api.say([{who:'oil',t:'Evening! I sell lamp oil and wick string.'},{who:'oil',t:'I have three orders written as fractions, but my jug pours milliliters and my string is marked in centimeters. Can you work them out?'}],
        function(a){a.S.q.deliver.met=1;a.save();a.goal(D.quests.deliver.goal(a.S));});
      if(n2<3){var OD=ORDERS[n2];var pd=padOf('me','Type the number, then press OK.',OD.eq,OD.unit,function(v,a,me){
          if(v===OD.a){a.snd.good();V.done=n2+1;a.save();a.say([{who:'oil',t:n2<2?OD.a+' '+OD.unit+'. Poured and packed! Next order.':OD.a+' '+OD.unit+'. That\'s every order. The stalls will glow all night. Thank you!'}],function(b){b.goal(D.quests.deliver.goal(b.S));if(n2===2)b.complete();});}
          else{a.snd.bad();a.say([OD.miss(v),me]);}});
        return api.say([{who:'oil',t:OD.ask},pd]);}
      return api.say([{who:'oil',t:'Every order is filled. Thank you!'}]);}
    return api.say([{who:'oil',t:'Lamp oil and wick! Everything by the part: a tenth of a liter, half a meter.'}]);
  }
  if(id==='tea'){return api.say([{who:'tea',t:job('j3')?'Three eighths of a pound of tea, 6 ounces. You weighed it just right.':'Tea by the bag! My bags are weighed in parts of a pound.'}]);}
  if(id==='gate'){
    if(q==='factory'&&S.q.factory.met&&!S.world.factoryOpen){var g1=padOf('me','How many minutes is one third of an hour? Type it, then press OK.','one third of 1 h =','min',function(v,a,me){
        if(v===20){a.snd.good();a.S.world.factoryOpen=true;a.save();
          a.say([{fn:function(b){b.snd.item();b.fx({t:0,update:function(dt){this.t+=dt;return this.t<1.2;},draw:function(x,cx,cy,tt){for(var k=0;k<8;k++){var px=26*16+k*5-cx-10,py=3*16-cy+(k%2?6:0);b.A.sparkle(x,px,py,tt+k,k%2?'#F5C518':'#FFFFFF');}}});}},
            {who:'sys',t:'The gate swings open. Inside: rows of brick molds, and a stamp on the wall that says GOLEM PART 2.'},
            {who:'smudge',t:'You found my factory! Too late, too late. My Golem is almost finished. Heh heh heh!'},
            {who:'opti',t:'Hoo! Part 1 at the dairy, part 2 here. The Golem is being built, {name}.'},{who:'opti',t:'Tomorrow, the farmers\' market. We\'ll be ready for it.'}],function(b){b.goal(D.quests.factory.goal(b.S));b.complete();});}
        else if(v===3){a.snd.bad();a.say([{who:'cora',t:'That\'s what the Smudge wrote! A third of an hour isn\'t 3 minutes. An hour is 60 minutes. Cut 60 into 3 equal parts.'},me]);}
        else if(v===180){a.snd.bad();a.say([{who:'felix',t:'3 times 60 is 180. But a third is one of 3 equal parts of the hour, so it is less than 60 minutes.'},me]);}
        else{a.snd.bad();a.say([{who:'felix',t:'An hour is 60 minutes. A third means 3 equal parts. How many minutes in one part?'},me]);}});
      return api.say([{who:'gate',t:'A smudged sign on the gate: GATE OPENS ONE THIRD OF AN HOUR AFTER DARK. THAT IS 3 MINUTES, HEH.'},{who:'me',t:'Three minutes? That can\'t be right. How many minutes is one third of an hour?'},g1]);}
    return api.say([{who:'sys',t:S.world.factoryOpen?'The gate stands open. Brick molds line the walls.':'A barred gate in a gray brick wall. Gray dust everywhere.'}]);
  }
  if(id==='bin4in'||id==='bin5in'||id==='bin6in'||id==='bin4oz'){
    var B=S.q.sort;var lab={bin4in:'4 IN: 4 inches',bin5in:'5 IN: 5 inches',bin6in:'6 IN: 6 inches',bin4oz:'4 OZ: 4 ounces'}[id];
    if(q!=='sort'||!B||!B.hold)return api.say([{who:'sign',t:lab}]);
    var it=itemOf(B.hold);
    if(it.bin!==id){api.snd.bad();var hintT=it.id==='tD'?{who:'cora',t:'This tag is about a pound of tea, not a foot. A pound is 16 ounces. One fourth of 16 ounces is how many ounces?'}:
        {who:'felix',t:'The tag says '+it.say+'. A foot is 12 inches. Cut 12 into that many equal parts, like on your page. How long is one part?'};
      return api.say([hintT]);}
    B.sorted=B.sorted||{};B.sorted[it.id]=1;B.hold=null;api.save();api.snd.good();var left=4-Object.keys(B.sorted).length;
    return api.say([{who:'sys',t:'Into the '+lab.split(':')[0]+' bin: '+it.say+' is '+it.a+'. '+(left?left+' to go.':'That\'s all 4. Go tell Ivy.')}],function(a){a.goal(D.quests.sort.goal(a.S));});
  }
  if(id==='penny'||id==='outfitters')return shop(api);
  var SIGNS={
    westSign:[{who:'sign',t:'← CLOCK TOWER'}],
    alleySign:[{who:'sign',t:job('j6')?'ALLEY ↑ Brick dust on the ground.':'ALLEY ↑ Too dark to see past the first lamp.'}],
    ivyStall:[{who:'sys',t:'Ivy\'s ribbon stall. Ribbons in every color, each with a tag.'}],
    teaStall:[{who:'sys',t:'The tea stall. Jars of tea, and little bags weighed in parts of a pound.'}],
    oilStall:[{who:'sys',t:'The lamp stall. Jugs of oil and coils of wick string.'}],
    factory:[{who:'sys',t:S.world.factoryOpen?'The Smudge\'s brick factory. GOLEM PART 2.':'A gray brick building. Its gate is barred.'}]
  };
  if(SIGNS[id])return api.say(SIGNS[id]);
};
D.afterQuest=function(q,api){
  if(window.PQM){var slot=document.querySelector('.pq-slot[data-quest="'+q+'"]');PQM.earn('quest-'+q,5,10,slot,'Quest clear!');PQM.renderBoard();}
  if(q==='factory'){try{var y=JSON.parse(localStorage.getItem('oao.pq.year')||'{}');y.L10=y.L10||{};y.L10['10.06']=1;localStorage.setItem('oao.pq.year',JSON.stringify(y));}catch(e){}}
};
return D;
})();

/* ═══ PQ_LESSON · the page side of 4.10.06 (jobs, scene, models). The shared layer is assets/sparkle/pq-layer.js ═══ */
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
var FT={unit:'ft',name:['foot','feet']},IN={unit:'in',name:['inch','inches']},LB={unit:'lb',name:['pound','pounds']},OZ={unit:'oz',name:['ounce','ounces']},
    HR={unit:'h',name:['hour','hours']},MIN={unit:'min',name:['minute','minutes']},L={unit:'L',name:['liter','liters']},ML={unit:'mL',name:['milliliter','milliliters']},
    M={unit:'m',name:['meter','meters']},CM={unit:'cm',name:['centimeter','centimeters']};

/* the cinematic opening: pictures and one counter in inches, no sentences.
   A ribbon unrolls across the screen to a full foot (counter 0 … 12 in) → snips cut it into 6 equal pieces, each labeled 2 →
   5 pieces slide down to a lantern and light it (one piece stays) → Ivy walks up and wonders "?" (the Think puzzle). */
function introScene(g,t){
  var C0=g.C,W=g.W,H=g.H,i;
  g.owl(W-30,H-30-Math.ceil(52/g.s),t);
  var bw=Math.round(W*.72),bx=Math.round((W-bw)/2),by=Math.round(H*.30),bh=Math.max(14,Math.round(H*.10));
  // the ribbon unrolls to a full foot
  var un=g.ease(g.p(t,0.3,2.2)),len=Math.round(bw*un);
  g.rect(bx-2,by-2,bw+4,bh+4,'rgba(255,255,255,.08)');
  if(len>0)g.rect(bx,by,len,bh,C0.red);
  var inches=Math.round(12*un);
  if(un>0&&un<1)g.text(inches+' in',Math.round(g.cx),Math.round(H*.12),{col:C0.white});
  if(un>=1&&t<3.0){g.text('12 in = 1 ft',Math.round(g.cx),Math.round(H*.12),{col:C0.gold});if(g.once('full'))g.blip(660,.2);}
  // six snips cut it into equal parts, each labeled 2
  var cuts=Math.min(5,Math.floor(g.p(t,2.6,4.2)*6));
  for(i=1;i<=cuts;i++){var cx=bx+Math.round(bw*i/6);g.rect(cx-1,by-4,2,bh+8,C0.white);if(g.once('cut'+i))g.blip(880+i*40,.08);}
  if(cuts>=1)for(i=0;i<=cuts;i++){if(i<6)g.text('2',bx+Math.round(bw*(i+0.5)/6),by+Math.round(bh/2)-4,{col:C0.white,shadow:false});}
  if(cuts>=5&&t<5.0)g.text('6 equal parts',Math.round(g.cx),Math.round(H*.12),{col:C0.gold});
  // five parts slide down to a lantern; one part stays behind
  if(t>5.0){var sl=g.ease(g.p(t,5.0,6.0)),ly=by+Math.round(sl*H*.30);
    g.rect(bx,by,bw,bh,'rgba(255,255,255,.06)');g.rect(bx+Math.round(bw*5/6),by,Math.round(bw/6),bh,C0.red);
    for(i=0;i<5;i++)g.rect(bx+Math.round(bw*i/6),ly,Math.round(bw/6)-2,bh,C0.red);
    if(sl>=1){g.box(Math.round(g.cx)-8,ly+bh+2,16,18,C0.gold);if(g.once('lit'))g.blip(523,.2);g.text('? in',Math.round(g.cx),Math.round(H*.12),{col:C0.gold});}}
  // Ivy walks up with a "?"
  if(t>6.0){var wp=g.ease(g.p(t,6.0,6.8)),ox=Math.round(g.lerp(-18,bx-26,wp));g.char('ivy',ox,H-26,wp<1?'right':'up',wp<1?Math.floor(t*8)%4:0);
    if(t>6.9&&!g.clean){var bp=g.back(g.p(t,6.9,7.15)),qy=H-46-Math.round(4*bp);if(g.once('q'))g.blip(660,.2);
      g.box(ox+3,qy,10,11,C0.white);g.text('?',ox+8,qy+2,{col:Math.floor(t*3)%2?C0.ink:'#C93A5A',shadow:false});}}
}

function marketSVG(){
  var lit=!!api.state().world.lit,n=['j2','j3','j4','j5'].filter(jobDone).length,open=jobDone('j6');
  var s='<svg viewBox="0 0 190 120" class="mk-svg" role="img" aria-label="The night market: Ivy\'s stall, the lantern string and the alley">';
  s+='<rect width="190" height="120" fill="'+(lit?'#2A3560':'#1E2748')+'"/><rect y="96" width="190" height="24" fill="#4A4A5A"/>';
  s+='<path d="M20 30 Q95 48 170 30" stroke="#3B2417" stroke-width="2" fill="none"/>';
  for(var k=0;k<5;k++){var x=35+k*30,y=37+Math.round(6*Math.sin(k/4*Math.PI));s+='<rect x="'+(x-5)+'" y="'+y+'" width="10" height="13" rx="3" fill="'+(k<n?'#F5C518':'#55505E')+'" stroke="#3B2417" stroke-width="1.5"/>'+(k<n?'<circle cx="'+x+'" cy="'+(y+6)+'" r="9" fill="rgba(245,197,24,.18)"/>':'');}
  s+='<rect x="18" y="62" width="54" height="34" fill="#E04F6A" stroke="#3B2417" stroke-width="2.5"/><path d="M14 64 L45 48 L76 64Z" fill="#F5C518" stroke="#3B2417" stroke-width="2.5"/>';
  s+='<rect x="100" y="66" width="46" height="30" fill="#5E9FD6" stroke="#3B2417" stroke-width="2"/><path d="M96 68 L123 52 L150 68Z" fill="#2F5D8A" stroke="#3B2417" stroke-width="2"/>';
  s+='<rect x="158" y="40" width="28" height="56" fill="#8C8C92" stroke="#3B2417" stroke-width="2"/><rect x="167" y="70" width="10" height="26" fill="'+(open?'#F5C518':'#55505E')+'" stroke="#3B2417" stroke-width="1.5"/>';
  s+='<rect x="60" y="8" width="70" height="13" rx="3" fill="'+(open?'#2DB87A':'#FFF3DE')+'" stroke="#3B2417" stroke-width="2"/><text x="95" y="18" font-family="DotGothic16,Nunito" font-size="8.5" text-anchor="middle" fill="'+(open?'#fff':'#5B3A7A')+'">'+(open?'LANTERNS LIT!':'NIGHT MARKET')+'</text>';
  return s+'</svg>';
}

/* answer boxes under a model (any number of units), with mistake hints */
function boxes(el,cfg){
  var st=ls(cfg.key,null)||{a:[],ok:false};
  el.innerHTML='<form class="bm-form mk-two"><span class="mk-two-q">'+cfg.q+'</span>'+cfg.units.map(function(u,k){return '<input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(cfg.aria[k])+'" value="'+esc(st.a[k]||'')+'"><span class="bm-u">'+esc(u)+'</span>';}).join('')+'<button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=el.querySelector('form'),ins=[].slice.call(f.querySelectorAll('input')),msg=el.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t;}
  function lock(){ins.forEach(function(x){x.disabled=true;});say(cfg.doneText,'good');}
  if(st.ok)lock();
  f.onsubmit=function(e){e.preventDefault();var v=ins.map(function(x){return num(x.value);});st.a=ins.map(function(x){return x.value;});lsSet(cfg.key,st);
    if(v.some(function(x){return x==null;}))return say(ins.length>1?'Type a number in each box.':'Type a number first.','hint');
    if(v.every(function(x,k){return x===cfg.answer[k];})){st.ok=true;lsSet(cfg.key,st);OAOKit._snd.done();lock();if(cfg.onDone)cfg.onDone(el);return;}
    OAOKit._snd.no();
    var mk=(cfg.mistakes||[]).filter(function(z){return z.v.every(function(x,k){return x===v[k];});})[0];if(mk)return say(mk.text,'hint');
    say(cfg.hint,'hint');};
}
/* a stacked-fraction answer: top box over bottom box, checked as a pair; `accept` lists other equal pairs with their own message */
function fracBox(el,cfg){
  var st=ls(cfg.key,null)||{a:['',''],ok:false};
  el.innerHTML='<form class="bm-form mk-two ok-fracform"><span class="mk-two-q">'+cfg.q+'</span><span class="ok-frac ok-frac-in"><input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(cfg.aria)+', top number" value="'+esc(st.a[0])+'"><i></i><input type="text" inputmode="numeric" autocomplete="off" aria-label="'+esc(cfg.aria)+', bottom number" value="'+esc(st.a[1])+'"></span><span class="bm-u">'+esc(cfg.unit)+'</span><button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=el.querySelector('form'),ins=[].slice.call(f.querySelectorAll('input')),msg=el.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t;}
  function lock(){ins.forEach(function(x){x.disabled=true;});say(cfg.doneText,'good');}
  if(st.ok)lock();
  f.onsubmit=function(e){e.preventDefault();var n=num(ins[0].value),d=num(ins[1].value);st.a=[ins[0].value,ins[1].value];lsSet(cfg.key,st);
    if(n==null||d==null)return say('Type the top number and the bottom number.','hint');
    if(n===cfg.n&&d===cfg.d){st.ok=true;lsSet(cfg.key,st);OAOKit._snd.done();lock();if(cfg.onDone)cfg.onDone(el);return;}
    OAOKit._snd.no();
    var mk=(cfg.mistakes||[]).filter(function(z){return z.n===n&&z.d===d;})[0];if(mk)return say(mk.text,'hint');
    if(d===1)return say('The bottom number is the whole. The whole is 1 '+cfg.whole+', but written in '+cfg.smallName+'. How many is that?','hint');
    if(n*cfg.d===d*cfg.n)return say(F(n,d)+' names the same amount, but it is not the simplest form. Make bigger equal parts.','hint');
    say(cfg.hint,'hint');};
}
/* a step chain: one box per step, each checked on its own */
function chain(el,cfg){
  var S=cfg.steps,st=ls(cfg.key,null)||{a:[],ok:false};
  el.innerHTML='<form class="bm-form mk-two mk-chain">'+S.map(function(x,k){return '<div class="mk-step"><span class="mk-two-q">'+(S.length>1?(k+1)+'. ':'')+x.q+'</span><input type="text" inputmode="numeric" autocomplete="off" aria-label="'+(S.length>1?'Step '+(k+1)+': ':'')+esc(x.q.replace(/<[^>]+>/g,''))+' how many '+esc(x.uname||x.u)+'" value="'+esc(st.a[k]||'')+'"><span class="bm-u">'+x.u+'</span></div>';}).join('')+'<button type="submit" class="ok-btn">Check</button></form><div class="ok-msg" aria-live="polite"></div>';
  var f=el.querySelector('form'),ins=[].slice.call(f.querySelectorAll('input')),msg=el.querySelector('.ok-msg');
  function say(t,k){msg.className='ok-msg'+(k?' '+k:'');msg.innerHTML=t;}
  function lock(){ins.forEach(function(x){x.disabled=true;});say(cfg.doneText,'good');}
  if(st.ok)lock();
  f.onsubmit=function(e){e.preventDefault();var v=ins.map(function(x){return num(x.value);});st.a=ins.map(function(x){return x.value;});lsSet(cfg.key,st);
    for(var k=0;k<S.length;k++){if(v[k]==null)return say(S.length>1?'Fill in step '+(k+1)+'.':'Type a number first.','hint');if(v[k]!==S[k].a){OAOKit._snd.no();return say((S.length>1?'Step '+(k+1)+': ':'')+(S[k].miss[v[k]]||S[k].hint),'hint');}}
    st.ok=true;lsSet(cfg.key,st);OAOKit._snd.done();lock();if(cfg.onDone)cfg.onDone(el);};
}
function mount(m,cls){var d=document.createElement('div');d.className=cls||'';m.appendChild(d);return d;}
function both(keys,id,el){if(keys.every(function(k){var s=ls(k,null);return s&&(s.ok||s.fired);}))setJob(id,el);}

/* Job 1 · Cut the Foot (Ribbon Cutter): 1/3 ft = 4 in, 1/2 ft = 6 in. Teaches reading the strip: cut, then take. */
function modelCut(m){
  OAOKit.ribbon(m,{key:'g4-4-10-06-ok-cut',rounds:[
    {name:'One third',mode:'take',rate:12,big:FT,small:IN,num:1,den:3,cuts:[2,3,4,6,12],
     text:'Ivy\'s first tag says <b>'+F(1,3)+' ft</b>. The bottom number, 3, tells how many equal parts to cut the foot into. Cut it, then take 1 part.',
     cutHint:'The tag says thirds, so cut the foot into 3 equal parts.',
     ask:{q:F(1,3)+' ft =',units:['in'],answer:[4],mistakes:[{v:[3],text:'3 is how many parts you cut. Read the number written on the part you took: that is its length in inches.'},{v:[36],text:'3 × 12 = 36 is bigger than a whole foot. A third is one of 3 equal parts, so it is smaller than 12 inches.'}],hint:'Look at the part you took. How many inches are written on it?',doneText:F(1,3)+' ft = <b>4 in</b>. 12 inches cut into 3 equal parts is 4 inches each.'},
     doneText:'One third of a foot is 4 inches.'},
    {name:'One half',mode:'take',rate:12,big:FT,small:IN,num:1,den:2,cuts:[2,3,4,6,12],
     text:'The next tag says <b>'+F(1,2)+' ft</b>. Cut the foot into 2 equal parts and take 1.',
     cutHint:'The tag says halves, so cut the foot into 2 equal parts.',
     ask:{q:F(1,2)+' ft =',units:['in'],answer:[6],mistakes:[{v:[2],text:'2 is how many parts you cut. Read the inches written on the part you took.'},{v:[24],text:'2 × 12 = 24 is two whole feet. A half is one of 2 equal parts, so it is smaller than 12 inches.'}],hint:'Look at the part you took. How many inches are written on it?',doneText:F(1,2)+' ft = <b>6 in</b>. 12 inches cut into 2 equal parts is 6 inches each.'},
     doneText:'One half of a foot is 6 inches.'}],
    onRound:function(i,root){earn('cut-'+i,2,0,root,'');},
    onDone:function(root){setJob('j1',root);}});
}
/* Warm-Up · Mental Math: a unit fraction of a number (Unit 8's skill: cut into equal groups, one group) */
function modelMental(m){
  OAOKit.mentalMath(m,{key:'g4-4-10-06-mm',name:'One equal part',
    how:'A fraction with 1 on top, like one fourth, means one of that many equal parts. Cut the number into equal groups, then take one group.',
    example:{q:'one fourth of 20',bond:{whole:20,parts:[5,15]},steps:['Fourths means 4 equal groups.','20 cut into 4 equal groups is 5 in each group.','So one fourth of 20 is 5.']},
    problems:[{q:'one sixth of 12',a:2,hint:'Sixths means 6 equal groups. 12 cut into 6 equal groups: how many in each?'},
              {q:'one fifth of 60',a:12,hint:'Fifths means 5 equal groups. 5 × ? = 60.'},
              {q:'one eighth of 16',a:2,hint:'Eighths means 8 equal groups. 8 × ? = 16.'},
              {q:'one tenth of 1,000',a:100,hint:'Tenths means 10 equal groups. 10 × ? = 1,000.'}],
    onRight:function(i,el){earn('mm-'+i,1,0,el,'');},onDone:function(root){earn('mm-all',2,3,root,'Mental math done!');}});
}
/* Warm-Up · Think: 5/6 ft = ? in. Any method: cut the strip any way, or work it out on paper, then type the inches. */
function modelThink(m){
  var a=mount(m,'mk-think-strip'),b=mount(m,'mk-think-ans');
  OAOKit.ribbon(a,{key:'g4-4-10-06-ok-think',rounds:[
    {name:'Try it',mode:'take',free:true,rate:12,big:FT,small:IN,num:5,den:6,cuts:[2,3,4,6,12],
     text:'Try it your way. You can cut the foot into any number of equal parts and take some, or work it out on paper.',doneText:'Now type your answer below.'}]});
  boxes(b,{key:'g4-4-10-06-think-ans',q:'Each lantern ribbon, '+F(5,6)+' ft, is',units:['in'],aria:['five sixths of a foot, in inches'],answer:[10],
    mistakes:[{v:[60],text:'5 × 12 = 60 is a good first step, but 60 inches is 5 whole feet! The ribbon is part of ONE foot. 60 still has to be cut into 6 equal parts.'},
              {v:[2],text:'2 inches is one sixth of a foot, one part. The ribbon is five of those parts.'},
              {v:[5],text:'5 inches would be five twelfths of a foot. The tag says five SIXTHS: cut the foot into 6 equal parts, not 12.'},
              {v:[11],text:'Not quite. Try cutting the foot into 6 equal parts on the strip and taking 5 of them.'}],
    hint:'Cut the strip into 6 equal parts (the bottom number) and take 5 (the top number). Or multiply and divide on paper.',
    doneText:'Yes! '+F(5,6)+' ft = <b>10 in</b>. On the Learn tab, the Math Crew shows two ways to find it. Did one match yours?',
    onDone:function(el){earn('think',4,4,el,'You tried it first!');}});
}
/* Job 2 · Ribbons for the Lanterns (CREW_TAUGHT): 5/6 ft = 10 in with the two ways named, then 7/12 ft = 7 in (IP 1's direction) */
function modelRibbons(m){
  OAOKit.ribbon(m,{key:'g4-4-10-06-ok-ribbons',rounds:[
    {name:'Five sixths',mode:'take',rate:12,big:FT,small:IN,num:5,den:6,cuts:[2,3,4,6,12],
     text:'Felix\'s way: the bottom number says <b>6 equal parts</b>. Cut the foot, read one part, then take <b>5</b> parts. Atlas\'s way checks it: '+F(5,6)+' × 12.',
     cutHint:'Sixths: cut the foot into 6 equal parts.',
     ask:{q:F(5,6)+' ft =',units:['in'],answer:[10],mistakes:[{v:[2],text:'2 inches is one part. You took 5 parts: 5 × 2.'},{v:[60],text:'5 × 12 = 60 is the top of Atlas\'s way. Now divide by the bottom number: 60 ÷ 6.'},{v:[5],text:'That counts the parts, not the inches. Each part is 2 inches.'}],hint:'5 parts, and each part is 2 inches. 5 × 2 = ?',doneText:F(5,6)+' ft = <b>10 in</b>. Felix: 5 parts of 2 in. Atlas: 5 × 12 = 60, and 60 ÷ 6 = 10. Same answer.'},
     doneText:'Five sixths of a foot is 10 inches.'},
    {name:'Seven twelfths',mode:'take',rate:12,big:FT,small:IN,num:7,den:12,cuts:[2,3,4,6,12],
     text:'The long ribbon\'s tag says <b>'+F(7,12)+' ft</b>. Pick a way: cut and take, or multiply and divide.',
     cutHint:'Twelfths: cut the foot into 12 equal parts.',
     ask:{q:F(7,12)+' ft =',units:['in'],answer:[7],mistakes:[{v:[84],text:'7 × 12 = 84 would be 7 whole feet. Twelfths are 1 inch each, so take 7 of them.'},{v:[1],text:'1 inch is one twelfth, one part. You need 7 parts.'}],hint:'Twelfths of a foot are 1 inch each. 7 parts is how many inches?',doneText:F(7,12)+' ft = <b>7 in</b>. Each twelfth of a foot is 1 inch, so 7 twelfths is 7 inches.'},
     doneText:'Seven twelfths of a foot is 7 inches.'}],
    onRound:function(i,root){earn('rib-'+i,2,0,root,'');},
    onDone:function(root){setJob('j2',root);}});
}
/* Job 3 · Ivy's Order List: a fraction of a pound, an hour, a liter and a meter (IP 2, 3, 4's direction), new numbers */
function modelOrders(m){
  OAOKit.ribbon(m,{key:'g4-4-10-06-ok-orders',rounds:[
    {name:'Tea',mode:'take',rate:16,big:LB,small:OZ,num:3,den:8,cuts:[2,4,8,16],
     text:'The tea seller weighs bags in ounces. Ivy wants <b>'+F(3,8)+' lb</b> of tea. Cut the pound into 8 equal parts and take 3.',
     cutHint:'Eighths: cut the pound into 8 equal parts.',
     ask:{q:F(3,8)+' lb =',units:['oz'],answer:[6],mistakes:[{v:[2],text:'2 ounces is one eighth, one part. Take 3 parts.'},{v:[48],text:'3 × 16 = 48 is the top of Atlas\'s way. Divide by 8: 48 ÷ 8.'},{v:[3],text:'That counts the parts. Each part is 2 ounces.'}],hint:'3 parts of 2 ounces each.',doneText:F(3,8)+' lb = <b>6 oz</b>. 16 ounces cut into 8 equal parts is 2 ounces each, and 3 × 2 = 6.'},
     doneText:'Three eighths of a pound is 6 ounces.'},
    {name:'Lighting',mode:'take',rate:60,big:HR,small:MIN,num:5,den:6,cuts:[2,3,4,5,6,10,12],
     text:'Lighting every lantern takes <b>'+F(5,6)+' of an hour</b>. Ivy wants it in minutes. Cut the hour into 6 equal parts and take 5.',
     cutHint:'Sixths: cut the hour into 6 equal parts.',
     ask:{q:F(5,6)+' h =',units:['min'],answer:[50],mistakes:[{v:[10],text:'10 minutes is one sixth, one part. Take 5 parts.'},{v:[300],text:'5 × 60 = 300 is the top of Atlas\'s way. Divide by 6: 300 ÷ 6.'},{v:[5],text:'That counts the parts. Each part is 10 minutes.'}],hint:'5 parts of 10 minutes each.',doneText:F(5,6)+' h = <b>50 min</b>. 60 minutes cut into 6 equal parts is 10 minutes each, and 5 × 10 = 50.'},
     doneText:'Five sixths of an hour is 50 minutes.'},
    {name:'Oil',mode:'take',rate:1000,big:L,small:ML,num:3,den:10,cuts:[2,4,5,10],
     text:'Each big lantern burns <b>'+F(3,10)+' L</b> of oil. The jug pours milliliters. Cut the liter into 10 equal parts and take 3.',
     cutHint:'Tenths: cut the liter into 10 equal parts.',
     ask:{q:F(3,10)+' L =',units:['mL'],answer:[300],mistakes:[{v:[100],text:'100 milliliters is one tenth, one part. Take 3 parts.'},{v:[3000],text:'3 × 1,000 = 3,000 is the top of Atlas\'s way. Divide by 10: 3,000 ÷ 10.'},{v:[30],text:'A liter is 1,000 milliliters, not 100. Each tenth is 100 milliliters.'}],hint:'3 parts of 100 milliliters each.',doneText:F(3,10)+' L = <b>300 mL</b>. 1,000 milliliters cut into 10 equal parts is 100 each, and 3 × 100 = 300.'},
     doneText:'Three tenths of a liter is 300 milliliters.'},
    {name:'Wick',mode:'take',rate:100,big:M,small:CM,num:2,den:5,cuts:[2,4,5,10],
     text:'Each lantern needs <b>'+F(2,5)+' m</b> of wick string, marked in centimeters. Cut the meter into 5 equal parts and take 2.',
     cutHint:'Fifths: cut the meter into 5 equal parts.',
     ask:{q:F(2,5)+' m =',units:['cm'],answer:[40],mistakes:[{v:[20],text:'20 centimeters is one fifth, one part. Take 2 parts.'},{v:[200],text:'2 × 100 = 200 is the top of Atlas\'s way. Divide by 5: 200 ÷ 5.'},{v:[2],text:'That counts the parts. Each part is 20 centimeters.'}],hint:'2 parts of 20 centimeters each.',doneText:F(2,5)+' m = <b>40 cm</b>. 100 centimeters cut into 5 equal parts is 20 each, and 2 × 20 = 40.'},
     doneText:'Two fifths of a meter is 40 centimeters.'}],
    onRound:function(i,root){earn('ord-'+i,2,0,root,'');},
    onDone:function(root){setJob('j3',root);}});
}
/* Job 4 · Label the Scraps (reverse, IP 5's direction): 4 in → 4/12 → 1/3 ft; 6 oz → 6/16 → 3/8 lb; 10 min → 10/60 → 1/6 h */
function modelScraps(m){
  OAOKit.ribbon(m,{key:'g4-4-10-06-ok-scraps',rounds:[
    {name:'4-inch scrap',mode:'name',rate:12,big:FT,small:IN,shade:4,groups:[2,3,4,6],raw:{n:4,d:12},answer:{n:1,d:3},
     text:'A ribbon scrap is <b>4 inches</b> long. Shade 4 inches on the foot. Write the part over the whole, both in inches. Then make bigger equal parts to find the simplest form.',
     rawQ:'Part over whole: the scrap is',simpQ:'In simplest form, the scrap is',
     rawMistakes:[{n:4,d:1,text:'That is the Smudge\'s kind of label: 4 inches over 1 foot mixes two units. Write the whole in inches too: how many inches make 1 foot?'},{n:12,d:4,text:'The part goes on top and the whole on the bottom. 4 inches is the part; 12 inches is the whole foot.'}],
     simpMistakes:[{n:4,d:12,text:'That is the same fraction. Make bigger equal parts: tap a Parts button so the shaded part fills whole parts.'}],
     doneText:'4 in = '+F(4,12)+' ft = '+F(1,3)+' ft.'},
    {name:'6-ounce bag',mode:'name',rate:16,big:LB,small:OZ,shade:6,groups:[2,4,8],raw:{n:6,d:16},answer:{n:3,d:8},
     text:'A tea bag holds <b>6 ounces</b>. Shade 6 ounces on the pound, write the part over the whole, then simplify.',
     rawQ:'Part over whole: the bag is',simpQ:'In simplest form, the bag is',
     rawMistakes:[{n:6,d:1,text:'6 ounces over 1 pound mixes two units. Write the whole in ounces: how many ounces make 1 pound?'}],
     doneText:'6 oz = '+F(6,16)+' lb = '+F(3,8)+' lb.'},
    {name:'10 minutes',mode:'name',rate:60,big:HR,small:MIN,shade:10,groups:[2,5,10,15],raw:{n:10,d:60},answer:{n:1,d:6},
     text:'Lighting the small lanterns took <b>10 minutes</b>. Shade 10 minutes on the hour, write the part over the whole, then simplify.',
     rawQ:'Part over whole: the time is',simpQ:'In simplest form, the time is',
     rawMistakes:[{n:10,d:1,text:'10 minutes over 1 hour mixes two units. Write the whole in minutes: how many minutes make 1 hour?'},{n:10,d:100,text:'An hour is 60 minutes, not 100.'}],
     doneText:'10 min = '+F(10,60)+' h = '+F(1,6)+' h.'}],
    onRound:function(i,root){earn('scr-'+i,2,0,root,'');},
    onDone:function(root){setJob('j4',root);}});
}
/* Job 5 · Halve the Ribbon (IP 6's shape): 10 in = 5/6 ft; cut in half, 5 in = 5/12 ft. Story Bar Model for the halving */
function modelHalve(m){
  var a=mount(m),b=mount(m),c=mount(m);
  var K=['g4-4-10-06-fr-ten','g4-4-10-06-bm-halve','g4-4-10-06-fr-five'];
  fracBox(a,{key:K[0],q:'Ivy\'s ribbon is 10 in long. In simplest form, that is',unit:'ft',aria:'10 inches as a fraction of a foot',n:5,d:6,whole:'foot',smallName:'inches',
    mistakes:[{n:10,d:12,text:F(10,12)+' is right, but not in simplest form. Think of parts of 2 inches: a foot is 6 of them, and 10 inches is 5 of them.'},{n:10,d:1,text:'10 inches over 1 foot mixes two units. Write the whole in inches: 12.'}],
    hint:'Part over whole, both in inches: 10 out of 12. Then simplify.',doneText:'10 in = '+F(10,12)+' ft = <b>'+F(5,6)+' ft</b>. Now cut it in half on the bar.',
    onDone:function(el){both(K.slice(1),'j5',el);}});
  OAOKit.barModel(b,{key:K[1],kind:'part-whole',unit:'in',todo:[],
    story:['The ribbon ',{t:'is 10 inches long.',put:'whole',label:'10 in'},' Ivy cuts it exactly in half, ',{t:'so the two pieces are equal.',put:'p1',label:'1 piece'},' How many inches is each piece?'],
    whole:{name:'ribbon'},partsName:'piece',
    parts:[{id:'p0',value:5,name:'piece',unknown:true},{id:'p1',value:5,name:'piece'}],
    question:'How many inches is each piece?',answer:5,
    mistakes:[{value:10,text:'That is the whole ribbon. Each piece is half of it: one of the 2 equal parts.'},{value:20,text:'That doubles the ribbon. Cutting in half makes it shorter: split 10 into 2 equal parts.'}],
    hint:'The bar is cut into 2 equal parts. Half of 10 inches is 10 ÷ 2.',
    sym:'10 in ÷ 2 = 5 in',doneText:'Each piece is 5 inches. Now write 5 inches as a fraction of a foot below.',
    onDone:function(root){both([K[0],K[2]],'j5',root);}});
  fracBox(c,{key:K[2],q:'Each 5-in piece is',unit:'ft',aria:'5 inches as a fraction of a foot',n:5,d:12,whole:'foot',smallName:'inches',
    mistakes:[{n:5,d:6,text:'That is the whole 10-inch ribbon. Each piece is half of it: 5 inches out of 12.'},{n:5,d:3,text:'Halving the bottom number makes the fraction bigger, not smaller. Each piece is 5 inches of the 12 in a foot.'},{n:5,d:1,text:'5 inches over 1 foot mixes two units. Write the whole in inches: 12.'}],
    hint:'Part over whole, both in inches. The whole foot is 12 inches. Then check: does a bigger equal part fit both numbers?',doneText:'Each piece is <b>'+F(5,12)+' ft</b>. Half of '+F(5,6)+' is '+F(5,12)+': the pieces got half as long, so twice as many fit in a foot.',
    onDone:function(el){both(K.slice(0,2),'j5',el);}});
}
/* Last job · the Smudge's tag: "5/1 ft" on a 5-inch ribbon. Same unit for part and whole: 5/12 ft, already in simplest form */
function modelProve(m){
  OAOKit.ribbon(m,{key:'g4-4-10-06-ok-prove',rounds:[
    {name:'The tag',mode:'name',rate:12,big:FT,small:IN,shade:5,groups:[2,3,4,6],raw:{n:5,d:12},answer:{n:5,d:12},
     text:'The ribbon measures <b>5 inches</b>. Shade 5 inches on the foot, then write what the tag should say: the part over the whole, both in inches.',
     rawQ:'The tag should say',
     rawMistakes:[{n:5,d:1,text:'That is what the Smudge wrote! 5 inches over 1 foot mixes two units. Write the whole foot in inches: how many inches make 1 foot?'},{n:12,d:5,text:'The part goes on top. 5 inches is the part; 12 inches is the whole foot.'}],
     rawDone:'The tag should say <b>'+F(5,12)+' ft</b>: 5 inches out of the 12 in a foot. No bigger equal part fits both 5 and 12, so it is already in simplest form.',
     doneText:'5 in = '+F(5,12)+' ft. You fixed the tag!'}],
    onDone:function(root){earn('prove',5,5,root,'You proved it!');setJob('j6',root);}});
}
function modelBonus(m){
  OAOKit.challenge(m,{key:'g4-4-10-06-bonus',title:'Bonus quest: fold the strip',
    text:'<p>Ivy folds a paper strip exactly <strong>1 foot</strong> long in half. Then she folds each half into <strong>3 equal parts</strong>. She unfolds it. How many equal parts does the strip have, and how many inches long is one part?</p><p>Type the inches in one part.</p>',
    answer:2,unit:'in',hint:'Half of the strip is 6 inches. Each half is folded into 3 equal parts. 6 inches cut into 3 equal parts is how long?',
    explain:'<p>Folding in half makes 2 parts. Folding each half into 3 makes 2 × 3 = <strong>6 equal parts</strong>. 12 inches cut into 6 equal parts is <strong>2 inches</strong> each. One part is one sixth of a foot.</p>',
    onDone:function(root){earn('bonus',8,8,root,'Bonus quest!');}});
}
function bind(f){return function(m,a){api=a;return f(m);};}
return {
  id:'4.10.06', key:'g4-4-10-06', title:'Fractions and Measurement', unit:10, level:'Metric Market', standard:'MA.4.M.2.1', boss:null,
  problem:{title:'Hang the Night Market Lanterns',text:'Lantern-keeper Ivy has ribbons to cut, tea to weigh and oil to pour, and every tag is a fraction of a unit. Each job below uses today\'s math. Finish all six and the lanterns light the way to the Smudge\'s factory.',jobWord:'Lantern job',jobsTitle:'Lantern jobs'},
  jobs:[
    {id:'j1',t:'Cut the foot',w:'Warm-Up · Cut the Foot',go:'#mk-cut',tab:'warmup',r:'-2deg',coins:5},
    {id:'j2',t:'Cut the lantern ribbons',w:'Learn · Ribbons for the Lanterns',go:'#mk-ribbons',tab:'learn',r:'1.5deg',coins:8},
    {id:'j3',t:'Fill Ivy\'s order list',w:'Learn · Ivy\'s Order List',go:'#mk-orders',tab:'learn',r:'-1deg',coins:8},
    {id:'j4',t:'Label the scraps',w:'Learn · Label the Scraps',go:'#mk-scraps',tab:'learn',r:'1deg',coins:8},
    {id:'j5',t:'Halve the ribbon',w:'Learn · Halve the Ribbon',go:'#mk-halve',tab:'learn',r:'2deg',coins:6},
    {id:'j6',t:'Fix the Smudge\'s tag',w:'Show What You Know',go:'#mk-prove',tab:'assignment',r:'-1.5deg',coins:10}],
  scene:function(a){api=a;return marketSVG();},
  hints:[
    {sel:'#mk-think .callout-think',rungs:['The tag is a fraction of ONE foot. A foot is 12 inches, so the ribbon is part of 12 inches.','The bottom number of the fraction tells how many equal parts to cut the foot into. The top number tells how many parts to take.','Here are different numbers: three tenths of an hour. Cut 60 minutes into 10 equal parts: 6 minutes each. Take 3 parts: 18 minutes.']},
    {sel:'#tab-assignment .q-block',i:0,inside:true,rungs:['Cut the small units of the whole into equal parts: the bottom number says how many.','Find one part first, then take as many parts as the top number says. Or multiply the fraction by the number of small units.','Here are different numbers: nine tenths of a liter. 1,000 milliliters cut into 10 equal parts is 100 each. 9 parts is 900 milliliters.']},
    {sel:'#tab-assignment .q-block',i:1,inside:true,rungs:['Write the part over the whole. Both must be in the same unit, the small one.','The whole is 1,000 milliliters, 100 centimeters or 60 minutes. Then make bigger equal parts to simplify.','Here are different numbers: 20 centimeters of a meter is 20 over 100. Parts of 20 centimeters: 1 of 5. One fifth of a meter.']},
    {sel:'#tab-assignment .q-block',i:2,inside:true,rungs:['First write the sample as ounces over the 16 ounces in a pound, and simplify.','Half the sample means half as many ounces. Then write the new ounces over 16.','Here are different numbers: a 6-ounce bag is 6 over 16, three eighths of a pound. Half of it is 3 ounces, which is 3 over 16 of a pound.']},
    {sel:'#mk-cut .activity-body > .mk-todo',rungs:['Tap the Cut button that matches the bottom number of the fraction.','Each part shows its inches. Tap the number of parts the top number says.','Here are different numbers: one eighth of a pound. Cut 16 ounces into 8 equal parts: 2 ounces each. Take 1 part: 2 ounces.']},
    {sel:'#mk-ribbons .activity-body > .mk-todo',rungs:['Cut first: the bottom number says how many equal parts.','Read the inches on one part, then multiply by the top number. Atlas\'s check: top × 12, then ÷ bottom.','Here are different numbers: three tenths of an hour. 60 ÷ 10 = 6 minutes a part, and 3 × 6 = 18 minutes. Or 3 × 60 = 180, and 180 ÷ 10 = 18.']},
    {sel:'#mk-orders .activity-body > .mk-todo',rungs:['Each round has a different whole: 16 ounces, 60 minutes, 1,000 milliliters or 100 centimeters. Cut that whole.','One part is the whole divided by the bottom number. Take as many parts as the top number.','Here are different numbers: nine tenths of a meter. 100 ÷ 10 = 10 centimeters a part, and 9 × 10 = 90 centimeters.']},
    {sel:'#mk-scraps .activity-body > .mk-todo',rungs:['Shade the small units first, then write them over the whole in the same small unit.','To simplify, make bigger equal parts. Try a Parts button; the shaded part must fill whole parts.','Here are different numbers: 20 minutes of an hour is 20 over 60. Parts of 20 minutes: 1 shaded of 3. One third of an hour.']},
    {sel:'#mk-halve .activity-body > .mk-todo',rungs:['Start with the whole ribbon: 10 inches out of 12. Simplify it.','Half the ribbon is half the inches. Put the facts on the bar and divide by 2.','Here are different numbers: a 14-ounce bag is seven eighths of a pound. Half of it is 7 ounces: 7 over 16 of a pound.']},
    {sel:'#mk-prove .activity-body > .mk-todo',rungs:['Shade the 5 inches on the strip.','A fraction of a foot compares inches to inches. The whole foot is 12 inches, not 1.','Here are different numbers: a 7-inch ribbon is 7 over 12 of a foot, not 7 over 1.']}],
  writing:{
    'journal-notice':{min:6,chips:[{label:'I notice',words:['notice','see','fraction','part','parts','sixths','sixth','foot','inches','inch','ribbon','tag','12','five','5','6','equal','cut','smaller','less than']},{label:'I wonder',words:['wonder','how','which','why','?','if','what']}]},
    'journal-compare':{min:12,chips:[{label:'a Crew member\'s way',words:['atlas','felix','hazel','cora','multiply','times','cut','parts','part','ruler','picture','same unit','divide']},{label:'what you would do for seven eighths of a pound',words:['pound','ounces','ounce','16','sixteen','oz','lb','cut','parts','part','multiply','times','divide','8','eighths','7','seven','14','2']},{label:'why',words:['because','so','easier','faster','since','simpler','makes sense','quick','like','better']}]},
    'journal-think':{min:10,chips:[{label:'the inches',words:['10','ten','10 in','10 inches']},{label:'how you found it',words:['cut','parts','part','equal','2','two','5','five','6','six','12','twelve','60','multiply','multiplied','times','divide','divided','strip','ruler','counted','count','added','picture']}]},
    'journal-big':{min:12,chips:[{label:'cut into equal parts, or multiply',words:['cut','parts','part','equal','multiply','times','divide','bottom','top','one part','take']},{label:'an example of your own',words:['ft','in','lb','oz','h','min','m','cm','l','ml','foot','inches','inch','pound','ounces','hour','minutes','meter','liter','=','equals','is']},{label:'going backward',words:['backward','back','part over whole','over','same unit','simplest','simplify','simpler','bigger parts','out of']}]}},
  bigIdea:'To find a fraction of a unit, cut the unit\'s small units into equal parts: the bottom number says how many. Then take as many parts as the top number says. Or multiply the fraction by the number of small units. Both ways give the same answer. To go backward, write the small units you have over the small units in the whole, the same unit on top and bottom, then make bigger equal parts to simplify.',
  words:[{w:'fraction of a unit',d:'a part of one whole unit, like part of one foot or one hour'},{w:'equal parts',d:'pieces that are all the same size'},{w:'simplest form',d:'a fraction written with the fewest, biggest equal parts'},{w:'scrap',d:'a small leftover piece'}],
  intendedWrong:['5 inches over 1 foot','one third of an hour isn\'t 3 minutes','4 inches over 1 foot','6 ounces over 1 pound','10 minutes over 1 hour','60 inches is 5 whole feet'],
  intro:{card:false,len:7.6,
    alt:'A red ribbon unrolls to a full foot, 12 inches. Five snips cut it into 6 equal parts, each labeled 2. Five of the parts slide down and light a lantern, while one part stays behind. Ivy the lantern-keeper walks up and wonders how many inches the five parts are.',
    scene:introScene},
  models:{cut:bind(modelCut),mental:bind(modelMental),think:bind(modelThink),ribbons:bind(modelRibbons),orders:bind(modelOrders),scraps:bind(modelScraps),halve:bind(modelHalve),prove:bind(modelProve),bonus:bind(modelBonus)}
};
})();
