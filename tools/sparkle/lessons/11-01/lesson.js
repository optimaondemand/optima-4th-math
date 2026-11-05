/* Lesson 4.11.01 · Area of Rectangles, Part 1 · the classical-guide layer (Leonardo da Vinci, Milan 1495)
   Dimensions 4B Ch 11 Lesson 1 (convert the side lengths first, two ways) + the IP (the IP wins). New numbers everywhere.
   Scale in every window: 4 canvas px = 1 inch, so the strip, the square panel and the lid compare fairly by eye. */
var CW_DATA = {
  key:'g4-4-11-01', room:'workshop',
  place:{t1:'MILAN, ITALY · 1495'},
  windows:{
    /* Warm-Up opener: why Leonardo, the room, Bernardo's gold, the Think problem (no math is done for students) */
    gold:{title:'Leonardo da Vinci', sub:'Painter, inventor, and careful measurer', play:'Step into the workshop',
      alt:'Leonardo da Vinci\'s workshop in Milan: an arched window, an easel with a small square panel, a long thin strip on wall pegs, and a workbench with a notebook, ink and a stack of gold sheets.',
      people:['leo'],
      objects:[{id:'strip',kind:'panel',x:92,y:46,w:72,h:8,name:'the strip',dims:{w:'1 ft 6 in',h:'2 in'}},
               {id:'square',kind:'panel',x:127,y:81,w:24,h:24,name:'the square panel',dims:{w:'6 in',h:'6 in'}}],
      exploreText:'Click the 2 things that glow gold to look up close.',
      /* only things that carry the math are clickable (3 Nov 2026): the panels and one gold sheet */
      spots:[
        {id:'panels',label:'The panels',x:88,y:42,w:80,h:66,zoom:1.5,lines:['These two wooden panels are for the Duke\'s hall.','One is a long, thin strip. One is a square. Both will be covered in gold.']},
        {id:'gold',label:'The gold',x:221,y:99,w:17,h:13,card:'<b class="h">1 gold sheet</b>Each sheet is a square, 1 inch on every side. On your page, a yellow tile like this stands for 1 sheet.<div class="cw-leaf"><div class="sq"><span class="side b">1 in</span><span class="side r">1 in</span></div></div>',
         lines:['This is gold leaf. It\'s real gold, pounded very flat.','Each sheet is a square, 1 inch on every side. See?']}],
      /* under a minute: why Leonardo, the panels, a prediction the page comes back to, the units question */
      script:[
        {w:'leo',t:'Hello! I\'m Leonardo da Vinci. I paint pictures, and before I paint anything, I measure it.'},
        {w:'leo',t:'The Duke of Milan wants two panels covered in gold. I need a helper who is good with numbers. That\'s you!'},
        {explore:{need:2}},
        {narr:'Someone knocks. The door opens.'},
        {enter:'bern'},
        {w:'bern',t:'Master Leonardo! The Duke\'s gold is here. It cost a lot, so we can\'t waste a single sheet.'},
        {focus:['strip','square']},{tags:['strip:name','square:name','strip:w','square:w','square:h']},
        {w:'bern',t:'The strip is 1 foot 6 inches long. The square is 6 inches on each side. The strip will need way more gold!'},
        {w:'leo',t:'Hmm. What do you think?'},
        {prompt:'Which panel needs more gold? Pick what you think now. You will find out soon.',save:'predict',choice:[
          {id:'strip',say:'The strip needs more.',then:[{w:'leo',t:'It does look that way. The strip is very long. But it\'s also very thin.'}]},
          {id:'square',say:'The square panel needs more.',then:[{w:'leo',t:'Interesting! The square is short, but it\'s much wider than the strip.'}]},
          {id:'same',say:'They need the same.',then:[{w:'leo',t:'Maybe! We\'ll have to check.'}]},
          {id:'unsure',say:'I\'m not sure yet.',then:[{w:'leo',t:'Good. "Not sure yet" is a fine place to start.'}]}]},
        {tags:['strip:h']},
        {w:'bern',t:'Oh, and the strip is 2 inches wide.'},
        {w:'leo',t:'Look at the tags. The strip\'s length is in feet and inches. The gold sheets are in inches.',wonder:'Are all the lengths in the same units?'},
        {w:'leo',t:'Let\'s count the gold for each panel. Then we\'ll know for sure.'}],
      end:{task:'Find out how many 1-inch gold sheets cover <b>the strip</b> (1 ft 6 in by 2 in) and how many cover <b>the square panel</b> (6 in by 6 in).',go:{tab:'warmup',sel:'#mk-think',label:'Go to the panels ↓'}}},

    /* Learn, before Job 4: Bernardo's note (the unit mistake from the guide and the IP's find-and-fix) */
    note:{title:'Bernardo\'s Note', sub:'Something is wrong. What?', play:'Back to the workshop',
      alt:'Bernardo holds a note about the lid of the Duke\'s jewelry box. The lid sits on the easel: 1 foot long and 5 inches wide.',
      people:['leo','bern'],
      objects:[{id:'lid',kind:'panel',x:115,y:85,w:48,h:20,name:'the lid',dims:{w:'1 ft',h:'5 in'}}],
      script:[
        {w:'bern',t:'Master Leonardo, I measured the lid of the Duke\'s jewelry box myself. I wrote a note for the gold.'},
        {card:'<b class="h">Bernardo\'s note</b><span class="hand">Lid: 1 ft long, 5 in wide.<br>Gold: 1 × 5 = 5 sheets.<br>— Bernardo</span>'},
        {focus:['lid']},{tags:['lid:name','lid:w','lid:h']},
        {w:'leo',t:'Five sheets? Hmm. Look at the lid. Then look at the note.',wonder:'Are all the lengths in the same units?'},
        {w:'bern',t:'1 times 5 is 5. I\'m sure of it!'},
        {w:'leo',t:'Your times table is right, my friend. But something else is not.'},
        {w:'leo',t:'I think I see it. Do you?'}],
      end:{task:'Find Bernardo\'s mistake. Then find how many gold sheets the lid really needs.',go:{tab:'learn',sel:'#mk-fix',label:'Go to the lid ↓'}}},

    /* Show What You Know, at the end: the gold was just right; a wonder about home; the Duke's next wish (11.02) */
    wrap:{title:'Not One Sheet Wasted', sub:'The panels are finished', play:'Back to the workshop',
      alt:'Leonardo and Bernardo in the workshop. A letter from the Duke of Milan arrives.',
      people:['leo','bern'],
      objects:[{id:'strip',kind:'panel',x:92,y:46,w:72,h:8,name:'the strip'},{id:'square',kind:'panel',x:127,y:81,w:24,h:24,name:'the square panel'}],
      script:[
        {w:'bern',t:'Master Leonardo! The gold was just right. Not one sheet wasted!'},
        {w:'leo',t:'Because you measured, and you put every length in the same unit first.'},
        {w:'bern',t:'Now the Duke has a new wish. He sent a letter.'},
        {card:'<b class="h">A letter from the Duke</b><span class="hand">Leonardo, make me a gold panel that uses exactly 48 gold sheets. It must be 4 inches wide. How long will it be?<br>— Ludovico, Duke of Milan</span>'},
        {w:'leo',t:'How long must it be? That is a puzzle for next time.'}],
      end:{lead:'📜 Next time',task:'In the next lesson, you will help Leonardo find a missing side: how long the Duke\'s panel must be.',go:{tab:'assignment',sel:'#mk-next',label:'See what\'s next ↓'}}}
  },
  /* the guide on a ladder (sparkle only): a tip for the part of the page you are on, and a question to ask him.
     Hints, never answers: no Think, job or Show What You Know answer appears here. */
  guide:{who:'leo',name:'Leonardo',role:'Painter and inventor',ride:'lift',
    hello:'Buongiorno! That means good morning. I am up here if you need me.',
    top:'Buongiorno!',bottom:'Ben fatto! Well done!',fast:'Whoa, not so fast!',
    decor:[{at:0.45,kind:'mona',say:'My favorite painting!'}],   /* one keepsake per lesson; Unit 11 hands out the rest (flyer, note) */
    tabs:{
      warmup:{say:'Warm up your brain first. A painter warms up his hand, too.',ask:[{q:'Why do the facts use 12s and 3s?',a:'1 foot is 12 inches, and 1 yard is 3 feet. Today you will change feet to inches and yards to feet, so 12s and 3s help a lot.'}]},
      learn:{say:'One station at a time. Use the bar at the top to see where you are.',ask:[{q:'What are the three stations?',a:'Learn it, Practice together, and On your own. Finish one, then press Next station.'}]},
      assignment:{say:'Now you show what you know. Take your time and check your units.',ask:[{q:'What do I check before I multiply?',a:'Ask: are the lengths in the same units? If not, change the bigger unit to the smaller one first.'}]}},
    spots:[
      {sel:'.fluency-box',say:'Twelves and threes! You will use them all lesson.',ask:[{q:'How many inches are in 1 foot?',a:'12 inches. A ruler is 1 foot long. Count its inch marks: 12.'}]},
      {sel:'#mk-mental',say:'Do it in your head first. Then check.',ask:[{q:'Is there a quick way to do 12 × 6?',a:'Split the 12: 10 × 6 and 2 × 6. Then add the two parts.'}]},
      {sel:'.mk-board-mount',say:'These are today\'s workshop jobs. Each one uses the same big idea.',ask:[{q:'Do I have to do the jobs in order?',a:'Yes, please. Each job gets you ready for the next one.'}]},
      {sel:'#mk-think',say:'Look at both panels before you count. What is different about their sides?',ask:[{q:'What does each gold sheet cover?',a:'Each gold sheet is a square, 1 inch on every side. It covers 1 square inch.'},{q:'Can I just count?',a:'Yes! Counting is a fine way to start. Then look for a faster way, like rows.'}]},
      {sel:'#mk-ways',say:'Four friends, four ways. Which one is like yours?',ask:[{q:'Which way is the right way?',a:'All four ways work. Pick the one that makes the most sense to you, and say why.'}]},
      {sel:'#mk-guided',say:'Let\'s build it together, one step at a time.',ask:[{q:'Why do I lay only one row and one column?',a:'One row tells how many sheets fit along the length. One column tells how many rows there are. That is all you need to multiply.'}]},
      {sel:'#mk-key',say:'These are my measuring rules. I keep them in my notebook.',ask:[{q:'Which unit do I change to?',a:'Change to the smaller unit. Feet to inches, or yards to feet.'}]},
      {sel:'#mk-worked',say:'Read this one slowly. It is already solved.',ask:[{q:'Why are there two ways?',a:'To show you that both ways get the same answer. Use the one you like best.'}]},
      {sel:'#mk-frame',say:'Lay the top row first. How many sheets fit along it?',ask:[{q:'How do I change feet and inches to inches?',a:'1 foot is 12 inches. Add the extra inches to 12.'}]},
      {sel:'#mk-square',say:'A square! Look at its sides.',ask:[{q:'What is special about a square?',a:'All 4 sides are the same length. So if you know one side, you know them all.'}]},
      {sel:'#mk-same',say:'Same gold, different shape. How many can you find?',ask:[{q:'Does turning it sideways count?',a:'No. A rectangle turned sideways is the same rectangle. Look for different side lengths.'}]},
      {sel:'#mk-fix',say:'Bernardo made a mistake. Can you find it?',ask:[{q:'Where should I look first?',a:'Look at the units in his note. Are both lengths in the same unit?'}]},
      {sel:'#mk-plaster',say:'This job has two steps. Find the area first.',ask:[{q:'What if the last bucket is not full?',a:'You still need that bucket! You cannot buy part of a bucket.'}]},
      {sel:'#mk-onepic',say:'The whole lesson in one picture.',ask:[{q:'How do I say the big idea?',a:'Try: first, make the units the same. Then multiply length × width. Then write square units.'}]},
      {sel:'#mk-prove',say:'Prove it! A picture can help.',ask:[{q:'What makes a good proof?',a:'Tell what to do first, show your numbers, and write the unit at the end.'}]}
    ]}
};

var PQ_LESSON=(function(){
var api;
function setJob(id,src){api.setJob(id,src);}
function grid(m,cfg){return OAOKit.areaGrid(m,cfg);}
function sub(m,cls){var d=document.createElement('div');d.className=cls||'';m.appendChild(d);return d;}
var IN={s:'in',one:'inch',many:'inches'},FT={s:'ft',one:'foot',many:'feet'};

/* Warm-Up · Mental Math: split a 2-digit number into tens and ones (4.04, a known strategy; it is Salaì's way later) */
function modelMental(m){
  OAOKit.mentalMath(m,{key:'g4-4-11-01-mm',name:'Split the tens and ones',
    how:'To multiply a 2-digit number in your head, split it into tens and ones. Multiply each part, then add the parts.',
    example:{q:'14 × 3',bond:{whole:14,parts:[10,4]},steps:['Split 14 into 10 and 4.','10 × 3 = 30 and 4 × 3 = 12.','30 + 12 = 42. So 14 × 3 = 42.']},
    work:'bond',   /* a blank bond on each problem; 3 problems max (Bethany, 3 Nov 2026) */
    problems:[{q:'13 × 4',a:52,hint:'Split 13 into 10 and 3. 10 × 4 = 40 and 3 × 4 = 12. Add them.'},
              {q:'17 × 2',a:34,hint:'Split 17 into 10 and 7. 10 × 2 = 20 and 7 × 2 = 14. Add them.'},
              {q:'19 × 3',a:57,hint:'Split 19 into 10 and 9. 10 × 3 = 30 and 9 × 3 = 27. Add them.'}]});
}
/* Warm-Up · Think: Bernardo's gold. Any method: lay the tiles, or work it out on paper. No rule is taught here. */
function modelThink(m){
  var row=sub(m,'cw-think-row'),a=sub(row,'cw-think-a'),b=sub(row,'cw-think-b');
  grid(a,{key:'g4-4-11-01-think-strip',unit:IN,cols:18,rows:2,dimW:'1 ft 6 in',dimH:'2 in',mode:'cover',cell:30,
    todo:'<b>The strip.</b> Each square of the grid is 1 inch. Tap or drag to lay gold sheets on it, or work it out your own way.',
    goalText:'The strip is covered. No gaps, no overlaps.',
    ask:[{q:'Gold sheets for the strip:',unit:'sheets',answer:36,
      mistakes:[{v:2,text:'1 × 2 multiplies a length in feet by a length in inches. Are the two sides in the same unit? A gold sheet is 1 inch on each side.'},
                {v:12,text:'6 × 2 = 12 covers only the 6-inch part. The strip is 1 foot AND 6 inches long. How many inches is the foot?'},
                {v:32,text:'1 ft 6 in is not 16 inches. 1 foot is 12 inches. How many inches is 12 inches and 6 more?'},
                {v:40,text:'40 is the distance around the strip. The gold covers the inside. Count the sheets that cover it.'},
                {v:20,text:'20 is the distance around in a mixed way. Count how many 1-inch sheets cover the inside of the strip.'}],
      hint:'Count the sheets in one row along the strip, then count the rows.'}],askOnly:true});
  grid(b,{key:'g4-4-11-01-think-square',unit:IN,cols:6,rows:6,dimW:'6 in',dimH:'6 in',mode:'cover',cell:30,
    todo:'<b>The square panel.</b> Each square is 1 inch.',goalText:'The square panel is covered.',
    ask:[{q:'Gold sheets for the square panel:',unit:'sheets',answer:36,
      mistakes:[{v:24,text:'6 + 6 + 6 + 6 = 24 is the distance around the panel. The gold covers the inside.'},
                {v:12,text:'6 + 6 = 12 adds two sides. The gold covers every square inside the panel.'}],
      hint:'How many sheets fit in one row? How many rows are there?'}],askOnly:true});
  // the job is done when both answers are right
  var ok=function(){var A=OAOKit._ls('g4-4-11-01-think-strip',{}),B=OAOKit._ls('g4-4-11-01-think-square',{});return A&&B&&A.done&&B.done;};
  m.addEventListener('submit',function(){setTimeout(function(){if(ok())setJob('j1',m);},50);},true);
  if(ok())setJob('j1',m);
  /* the payoff (audit, 3 Nov 2026): once both panels are counted, the SAME 36 tiles move from the strip into the square.
     Shown only after the Think is solved, so it never gives the answer away. */
  var same=sub(m,'cw-same36');same.hidden=true;
  var T=16,svgNS='http://www.w3.org/2000/svg',W=18*T+12,H=6*T+12;
  var PRED={strip:'Before you counted, you thought the strip needed more gold.',square:'Before you counted, you thought the square panel needed more gold.',same:'Before you counted, you thought they needed the same. You were right!',unsure:'Before you counted, you weren\'t sure.'};
  same.innerHTML='<div class="cw-predict" hidden><canvas width="32" height="32" aria-hidden="true"></canvas><p></p></div><div class="cw-same-h">🔁 The same gold, a new shape</div><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="36 gold tiles that cover the strip move into a 6 by 6 square. There are 36 tiles both times."></svg>'+
    '<div class="cw-same-row"><button type="button" class="ok-btn cw-same-go">▶ Move the 36 tiles into a square</button><span class="cw-same-n">36 tiles</span></div>'+
    '<p class="cw-same-q"><b>Think:</b> What changed? What stayed the same?</p>';
  var sv=same.querySelector('svg'),tiles=[],shape=0,rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function at(k,sh){return sh?{x:6+(W-12-6*T)/2+(k%6)*T,y:6+Math.floor(k/6)*T}:{x:6+(k%18)*T,y:6+Math.floor(k/18)*T};}
  for(var k=0;k<36;k++){var r=document.createElementNS(svgNS,'rect');var p0=at(k,0);r.setAttribute('x',p0.x+1);r.setAttribute('y',p0.y+1);r.setAttribute('width',T-2);r.setAttribute('height',T-2);r.setAttribute('rx',2);r.setAttribute('fill','#F2B705');r.setAttribute('stroke','#B88600');sv.appendChild(r);tiles.push(r);}
  function move(to){var t0=performance.now(),D=rm?0:1400;(function f(now){var q=D?Math.min(1,(now-t0)/D):1;
    tiles.forEach(function(r,k){var d=Math.min(1,Math.max(0,q*1.6-k/36*0.6)),e=d<.5?2*d*d:1-Math.pow(-2*d+2,2)/2,a=at(k,1-to),b=at(k,to);r.setAttribute('x',a.x+(b.x-a.x)*e+1);r.setAttribute('y',a.y+(b.y-a.y)*e+1);});
    if(q<1)requestAnimationFrame(f);})(t0);}
  var go=same.querySelector('.cw-same-go');go.onclick=function(){shape=1-shape;move(shape);go.textContent=shape?'◀ Move them back into the strip':'▶ Move the 36 tiles into a square';};
  function predict(){var pr=OAOKit._ls('g4-4-11-01-predict',null),box=same.querySelector('.cw-predict');   /* read when shown: the window may come after */
    if(!pr||!PRED[pr.id])return;box.querySelector('p').innerHTML='<b>Leonardo:</b> '+PRED[pr.id]+' You counted 36 sheets for each panel. What do you think now?';box.hidden=false;
    var pc=box.querySelector('canvas');if(pc&&window.CWART)CWART.portrait(pc,'leo',true);}
  (function wait(){if(ok()){same.hidden=false;predict();return;}setTimeout(wait,700);})();
}
/* Learn · Job 1: the frame piece (feet and inches) and the storeroom floor (yards and feet). Dimensions' model: tiles along one
   edge and down the other, then multiply. The tool never shows the total. */
function modelFrame(m){
  var a=sub(m),h=document.createElement('h5');h.className='cw-round';h.textContent='Round 1 · A frame piece: 1 ft 4 in long, 3 in wide';a.appendChild(h);var ga=sub(a);
  grid(ga,{key:'g4-4-11-01-frame-a',unit:IN,cols:16,rows:3,dimW:'1 ft 4 in',dimH:'3 in',mode:'edge',showCount:false,cell:30,
    todo:'Lay one row of gold sheets along the top, and one column down the left side. Each square is 1 inch.',
    goalText:'Your row and your column are laid. Now use them.',
    ask:[{q:'The frame piece is how many inches long?',unit:'in',answer:16,
      mistakes:[{v:14,text:'1 ft 4 in is not 14 inches. Count the sheets in your top row: 1 foot is 12 inches, then 4 more.'},{v:5,text:'1 + 4 adds feet and inches together. Change the foot to inches first: 1 foot is 12 inches.'}],hint:'Count the sheets in your top row.'},
         {q:'How many gold sheets cover the whole piece?',unit:'sheets',answer:48,
      mistakes:[{v:12,text:'4 × 3 = 12 forgets the foot. The piece is 16 inches long.'},{v:3,text:'1 × 3 uses feet for one side and inches for the other. Use inches for both.'},{v:19,text:'16 + 3 adds the sides. Area multiplies: rows × sheets in each row.'},{v:38,text:'38 is the distance around the piece. The gold covers the inside.'}],
      hint:'Your column shows the number of rows. Your top row shows the sheets in each row. Multiply.'}],
    onDone:function(){check();}});
  var b=sub(m),h2=document.createElement('h5');h2.className='cw-round';h2.textContent='Round 2 · The storeroom floor: 1 yd 2 ft long, 3 ft wide, covered with 1-foot square tiles';b.appendChild(h2);var gb=sub(b);
  grid(gb,{key:'g4-4-11-01-frame-b',unit:FT,cols:5,rows:3,dimW:'1 yd 2 ft',dimH:'3 ft',mode:'edge',showCount:false,cell:44,
    todo:'Now each square is 1 foot. Lay one row along the top and one column down the side.',
    goalText:'Row and column laid.',
    ask:[{q:'The floor is how many feet long?',unit:'ft',answer:5,
      mistakes:[{v:3,text:'3 feet is only the yard. The floor is 1 yard AND 2 feet long.'},{v:12,text:'12 is the inches in a foot. Here, 1 yard is 3 feet.'},{v:14,text:'1 yd 2 ft is not 14 feet. 1 yard is 3 feet, then 2 more.'}],hint:'1 yard is 3 feet. Add the 2 feet.'},
         {q:'How many 1-foot tiles cover the floor?',unit:'tiles',answer:15,
      mistakes:[{v:9,text:'3 × 3 = 9 forgets the 2 extra feet. The floor is 5 feet long.'},{v:6,text:'2 × 3 = 6 forgets the yard. Change the yard to feet first.'},{v:8,text:'5 + 3 adds the sides. Area multiplies.'},{v:16,text:'16 is the distance around the floor. The tiles cover the inside.'}],
      hint:'5 tiles in each row, and 3 rows.'}],
    onDone:function(){check();}});
  function check(){var A=OAOKit._ls('g4-4-11-01-frame-a',{}),B=OAOKit._ls('g4-4-11-01-frame-b',{});if(A.done&&B.done)setJob('j2',m);}
  check();
}
/* Learn · Job 2: a square panel, 9 in on each side (IP 2: side × side, why one measurement is enough) */
function modelSquare(m){
  grid(m,{key:'g4-4-11-01-square',unit:IN,cols:12,rows:10,mode:'free',cell:28,
    todo:'Build a square panel 9 inches on each side. Drag across the squares to lay the tiles.',
    check:function(s){if(!s.n)return {ok:false};if(!s.rect)return {ok:false,text:'Keep going. A panel has no holes and straight sides.'};
      if(s.w===9&&s.h===9)return {ok:true,text:'A square 9 inches on each side. Every side is the same length.'};
      if(s.w===s.h)return {ok:false,text:'That is a square, but each side is '+s.w+' inches. Make each side 9 inches.'};
      return {ok:false,text:'That is a rectangle '+s.w+' by '+s.h+'. A square has 4 equal sides: make both sides 9 inches.'};},
    goalText:'A square panel, 9 in by 9 in.',
    ask:[{q:'How many gold sheets cover the square panel?',unit:'sheets',answer:81,
      mistakes:[{v:36,text:'9 + 9 + 9 + 9 = 36 is the distance around. The gold covers the inside: 9 rows of 9.'},{v:18,text:'9 + 9 adds two sides. Area multiplies: 9 × 9.'}],hint:'9 rows, with 9 sheets in each row.'}],
    onDone:function(r){setJob('j3',r);}});
}
/* Learn · Job 3: same gold, different shape (IP 4). Every rectangle that uses all 18 sheets. */
function modelSame(m){
  grid(m,{key:'g4-4-11-01-same',unit:IN,cols:18,rows:9,mode:'free',record:true,n:18,need:3,cell:26,
    todo:'Use exactly 18 gold sheets to build a rectangle. Clear the tiles and build a different one. Find all 3.',
    sym:function(n){return 'Tiles laid: <b>'+n+'</b> of 18';},
    goalText:'You found all 3 rectangles. They look different, but each one uses 18 sheets: the same area.',
    onGoal:function(r){setJob('j4',r);}});
}
/* Learn · Job 4: fix Bernardo's note (IP 5: find and fix a unit mistake) */
function modelFix(m){
  grid(m,{key:'g4-4-11-01-fix',unit:IN,cols:12,rows:5,dimW:'1 ft',dimH:'5 in',mode:'edge',showCount:false,cell:30,
    todo:'Each square is 1 inch. Lay one row along the top and one column down the side of the lid.',goalText:'Row and column laid.',
    ask:[{q:'How many inches long is the lid?',unit:'in',answer:12,mistakes:[{v:1,text:'1 is the length in feet. Count the 1-inch sheets in your top row.'}],hint:'1 foot is how many inches?'},
         {q:'The lid really needs',unit:'sheets',answer:60,
      mistakes:[{v:5,text:'That is Bernardo\'s answer. 1 × 5 multiplies feet by inches. Change the foot to inches first.'},{v:17,text:'12 + 5 adds the sides. Area multiplies.'},{v:34,text:'34 is the distance around the lid. The gold covers the inside.'}],hint:'12 sheets in each row, and 5 rows.'}],
    onDone:function(r){setJob('j5',r);}});
}
/* Learn · Job 5: a word problem with a second step (IP 6): plaster for a wall, 1 bucket covers 10 square feet */
function modelPlaster(m){
  grid(m,{key:'g4-4-11-01-plaster',unit:FT,cols:9,rows:6,dimW:'9 ft',dimH:'6 ft',mode:'edge',showCount:false,cell:36,
    todo:'Each square is 1 square foot of wall. Lay one row along the top and one column down the side.',goalText:'Row and column laid.',
    ask:[{q:'Area of the wall:',unit:'square feet',answer:54,mistakes:[{v:15,text:'9 + 6 adds the sides. Area multiplies: rows × squares in each row.'},{v:30,text:'30 is the distance around the wall. The plaster covers the inside.'}],hint:'9 squares in each row, and 6 rows.'},
         {q:'Buckets of plaster Felix must carry:',unit:'buckets',answer:6,
      mistakes:[{v:5,text:'5 buckets cover 50 square feet. 4 square feet of wall would stay bare! Round up: one more bucket.'},{v:54,text:'54 is the area. Each bucket covers 10 square feet, so how many buckets cover 54?'},{v:4,text:'4 square feet are left over after 5 buckets. Those 4 still need plaster, so count the buckets.'}],
      hint:'5 buckets cover 50 square feet. Is that enough for 54?'}],
    onDone:function(r){setJob('j6',r);}});
}
/* Learn · the guided build (the explicit teaching): see it with tiles → picture it with labels → write the number sentence.
   Each step opens only after the student finishes the one before. New numbers: 1 ft 3 in by 4 in. */
function ask1(el,q,answer,mistakes,unit,onok,hint,keep){   /* keep = {get(), set(v)}: the box remembers its answer (audit, 3 Nov 2026) */
  var f=document.createElement('form');f.className='ag-ask';
  f.innerHTML='<label>'+q+' <input type="text" inputmode="numeric" autocomplete="off" aria-label="'+q.replace(/<[^>]+>/g,'')+'"> <span class="ag-u">'+(unit||'')+'</span></label> <button class="ok-btn" type="submit">Check</button><span class="ag-fb" aria-live="polite"></span>';
  var msg=document.createElement('div');msg.className='ok-msg';el.appendChild(f);el.appendChild(msg);var inp=f.querySelector('input');
  var solved=false;function okNow(){f.classList.add('ok');inp.disabled=true;f.querySelector('.ag-fb').textContent='✓';msg.className='ok-msg';msg.textContent='';}
  if(keep&&keep.get()!=null&&+keep.get()===answer){inp.value=keep.get();solved=true;okNow();}
  f.onsubmit=function(e){e.preventDefault();if(solved)return;if(keep)keep.set(inp.value);var v=+String(inp.value).replace(/[,\s]/g,'');if(!inp.value.trim()){msg.className='ok-msg hint';msg.textContent='Type a number.';return;}
    if(v===answer){solved=true;okNow();onok&&onok();return;}   /* counted once: a solved box never counts again */
    var m=(mistakes||[]).filter(function(x){return x.v===v;})[0];f.querySelector('.ag-fb').textContent='✗';msg.className='ok-msg hint';msg.textContent=m?m.text:(hint||'Not yet. Look at the step again.');};
  return f;}
function modelGuided(m){
  var key='g4-4-11-01-guided',st=OAOKit._ls(key,{})||{};function save(){OAOKit._lsSet(key,st);}
  function step(n,title,body){var d=document.createElement('div');d.className='cw-gstep';d.dataset.n=n;d.innerHTML='<div class="cw-gstep-h"><span class="cw-gstep-n">'+n+'</span><b>'+title+'</b><span class="cw-gstep-lock">🔒 opens when you finish step '+(n-1)+'</span></div><div class="cw-gstep-b">'+(body||'')+'</div>';m.appendChild(d);return d;}
  var s1=step(1,'See it: lay the gold sheets','<p>Lay <b>one row</b> of gold sheets along the top of the strip and <b>one column</b> down the side. Each square of the grid is 1 inch.</p>');
  var s2=step(2,'Picture it: same units on both sides','<p>Now write both sides in <b>inches</b>. The labels on the drawing fill in when you are right.</p>');
  var s3=step(3,'Write it: length × width','<p>Multiply the length by the width. Area is in <b>square inches</b>, because each gold sheet is 1 square inch.</p>');
  var done=document.createElement('div');done.className='cw-gdone';done.hidden=true;done.innerHTML='✅ <b>Area = 60 square inches.</b> 1 ft 3 in is 15 in, so the strip is 15 in by 4 in, and 15 × 4 = 60. Same units first, then length × width.';m.appendChild(done);
  function open(d,on){d.classList.toggle('open',!!on);}
  var g=document.createElement('div');s1.querySelector('.cw-gstep-b').appendChild(g);
  OAOKit.areaGrid(g,{key:key+'-tiles',unit:IN,cols:15,rows:4,dimW:'1 ft 3 in',dimH:'4 in',mode:'edge',cell:30,
    goalText:'Row and column laid. Count them.',
    ask:[{q:'Sheets in your top row: 1 ft 3 in =',unit:'in',answer:15,mistakes:[{v:13,text:'1 ft 3 in is not 13 inches. Count your row: 12 sheets make 1 foot, then 3 more.'},{v:4,text:'1 + 3 adds feet and inches. Count the sheets in your row.'},{v:3,text:'3 is only the inches part. The strip is 1 foot AND 3 inches.'}],hint:'Count the sheets in your top row.'},
         {q:'Rows of gold sheets:',unit:'rows',answer:4,mistakes:[{v:15,text:'15 is how many in each row. Count down the column: how many rows?'}],hint:'Count the sheets in your column.'}],
    onDone:function(){st.s1=1;save();open(s2,1);}});
  var pic=document.createElement('div');pic.className='cw-gpic';
  pic.innerHTML='<svg viewBox="0 0 560 172" role="img" aria-label="The strip drawn as a rectangle, 15 squares long and 4 squares wide."><rect x="40" y="36" width="420" height="112" fill="#fff" stroke="#0E1C42" stroke-width="3"/>'
    +Array.apply(null,{length:14}).map(function(_,i){return '<line x1="'+(40+28*(i+1))+'" y1="36" x2="'+(40+28*(i+1))+'" y2="148" stroke="#D9DEEA"/>';}).join('')
    +[1,2,3].map(function(k){return '<line x1="40" y1="'+(36+28*k)+'" x2="460" y2="'+(36+28*k)+'" stroke="#D9DEEA"/>';}).join('')
    +'<text class="gl" x="250" y="26" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="20" fill="#0E1C42">? in</text><text class="gw" x="470" y="98" font-family="Nunito" font-weight="900" font-size="20" fill="#0E1C42">? in</text></svg>';
  s2.querySelector('.cw-gstep-b').appendChild(pic);
  var gl=pic.querySelector('.gl'),gw=pic.querySelector('.gw');
  var got={};function two(k){got[k]=1;if(got.l&&got.w){st.s2=1;save();open(s3,1);}}
  function keep(k){return {get:function(){return (st.v||{})[k];},set:function(v){st.v=st.v||{};st.v[k]=v;save();}};}
  ask1(s2.querySelector('.cw-gstep-b'),'Length:',15,[{v:1,text:'1 is the feet. Write the whole length in inches: 12 + 3.'},{v:13,text:'1 foot is 12 inches. Add the 3 more inches.'}],'in',function(){gl.textContent='15 in';two('l');},null,keep('l'));
  ask1(s2.querySelector('.cw-gstep-b'),'Width:',4,[],'in',function(){gw.textContent='4 in';two('w');},null,keep('w'));
  ask1(s3.querySelector('.cw-gstep-b'),'15 × 4 =',60,[{v:19,text:'15 + 4 adds the sides. Area multiplies: 4 rows of 15.'},{v:38,text:'38 is the distance around the strip. Area counts the sheets that cover it.'},{v:12,text:'3 × 4 forgets the foot. The length is 15 inches.'}],'square inches',function(){st.s3=1;save();done.hidden=false;},null,keep('p'));
  open(s1,1);if(st.s1)open(s2,1);if(st.s2){open(s3,1);gl.textContent='15 in';gw.textContent='4 in';got.l=got.w=1;}if(st.s3)done.hidden=false;
}
/* Learn · a free tile grid (students try any rectangle; the teacher's live board in the videos) */
function modelFree(m){
  grid(m,{key:'g4-4-11-01-free',unit:IN,cols:20,rows:8,mode:'free',cell:28,
    todo:'Try any rectangle you like. Each square is 1 inch.',
    sym:function(n,s){return 'Tiles laid: <b>'+n+'</b>'+(s.rect&&n?' · a rectangle '+s.w+' in by '+s.h+' in':'');}});
}
function modelBonus(m){
  OAOKit.challenge(m,{key:'g4-4-11-01-bonus',title:'Bonus quest (optional): cut the gold',
    text:'<p>Hazel has one big sheet of gold, <strong>1 ft</strong> long and <strong>6 in</strong> wide. Leonardo needs small pieces that are <strong>3 in</strong> long and <strong>2 in</strong> wide. What is the greatest number of small pieces Hazel can cut from the big sheet?</p><p>Type the number of pieces.</p>',
    answer:12,unit:'pieces',hint:'Change 1 ft to inches first. How many 3-inch pieces fit along the 12-inch side? How many 2-inch pieces fit along the 6-inch side?',
    explain:'<p>1 ft = 12 in. Along the 12-inch side, 12 ÷ 3 = 4 pieces fit. Along the 6-inch side, 6 ÷ 2 = 3 pieces fit. 4 × 3 = <strong>12 pieces</strong>. Check with area: the big sheet is 12 × 6 = 72 square inches, each piece is 3 × 2 = 6 square inches, and 12 × 6 = 72. Nothing is left over.</p>'});
}
/* Show What You Know · Prove It: the two numbers get exact checks; the proof box below is for the reasoning */
function modelProve(m){var st=OAOKit._ls('g4-4-11-01-prove',{})||{};function keep(k){return {get:function(){return st[k];},set:function(v){st[k]=v;OAOKit._lsSet('g4-4-11-01-prove',st);}};}
  var b=sub(m,'cw-prove-nums');
  ask1(b,'First, 1 ft =',12,[{v:1,text:'1 is the feet. How many inches are in 1 foot?'},{v:10,text:'A foot is not 10 inches. Look at a ruler: 12 inch marks.'},{v:36,text:'36 inches is a yard. How many inches are in 1 foot?'}],'in',null,null,keep('ft'));
  ask1(b,'So Bernardo\'s strip needs',36,[{v:3,text:'That is Bernardo\'s answer. Change 1 ft to inches first.'},{v:15,text:'12 + 3 adds the sides. Area multiplies: 3 rows of 12.'},{v:30,text:'30 is the distance around. Count the sheets that cover the strip.'}],'gold sheets',null,null,keep('n'));
}
function bind(f){return function(m,a){api=a;return f(m);};}
return {
  id:'4.11.01', key:'g4-4-11-01', title:'Area of Rectangles, Part 1', unit:11, level:'Leonardo\'s Workshop', standard:'MA.4.GR.2.1', boss:null,
  problem:{title:'Not One Sheet Wasted',text:'The Duke\'s gold costs a lot. Leonardo needs to know exactly how many 1-inch gold sheets each job takes, and some measurements are in feet. Each job below uses today\'s math.',jobWord:'Workshop job',jobsTitle:'Workshop jobs'},
  jobs:[
    {id:'j1',t:'Count the gold for the two panels',w:'Warm-Up · Bernardo\'s Gold',go:'#mk-think',tab:'warmup',coins:0},
    {id:'j2',t:'Gild a frame piece and tile the storeroom',w:'Lesson · Same Units First',go:'#mk-frame',tab:'learn',coins:0},
    {id:'j3',t:'Build a square panel',w:'Lesson · A Square Panel',go:'#mk-square',tab:'learn',coins:0},
    {id:'j4',t:'Find every panel for 18 sheets',w:'Lesson · Same Gold, Different Shape',go:'#mk-same',tab:'learn',coins:0},
    {id:'j5',t:'Fix Bernardo\'s note',w:'Lesson · Bernardo\'s Note',go:'#mk-fix',tab:'learn',coins:0},
    {id:'j6',t:'Plaster the wall',w:'Lesson · Plaster for the Wall',go:'#mk-plaster',tab:'learn',coins:0}],
  hints:[
    {sel:'#mk-think .callout-think',rungs:['Each gold sheet is a square, 1 inch on every side. Count how many cover each panel, or find a faster way than counting.','Look at the strip\'s length: 1 ft 6 in. The gold sheets are measured in inches. A foot is 12 inches.','Here are different numbers: a panel 1 ft 2 in long and 1 in wide is 14 inches long, so 14 sheets cover it.']},
    {sel:'#mk-guided .activity-body > p',rungs:['Start with Step 1: lay the gold sheets in one row along the top. Count them.','12 sheets make 1 foot. 3 more make 1 ft 3 in. So the length in inches is 12 + 3.','Here are different numbers: a strip 1 ft 1 in long and 2 in wide is 13 in by 2 in, and 13 × 2 = 26 square inches.']},
    {sel:'#mk-frame .activity-body > .mk-todo',rungs:['Lay the top row first. Count the sheets in it: that is the length in inches.','1 foot is 12 inches. 1 yard is 3 feet. Change the bigger unit to the smaller one, then multiply length × width.','Here are different numbers: a strip 1 ft 1 in long and 2 in wide. 1 ft 1 in is 13 in, and 13 × 2 = 26 sheets.']},
    {sel:'#mk-square .activity-body > .mk-todo',rungs:['A square has 4 equal sides. Build a row of 9 first.','Then add rows until there are 9 rows. Area = side × side.','Here are different numbers: a square 4 inches on each side is 4 × 4 = 16 square inches.']},
    {sel:'#mk-same .activity-body > .mk-todo',rungs:['Try 1 long row of 18 first.','Think: what times what makes 18? Each pair is a rectangle.','Here are different numbers: 12 sheets make 1 by 12, 2 by 6 and 3 by 4.']},
    {sel:'#mk-fix .activity-body > .mk-todo',rungs:['Look at Bernardo\'s note. What units are the two lengths in?','The gold sheets are 1 inch on each side. Change 1 foot to inches before you multiply.','Here are different numbers: a lid 1 ft long and 2 in wide. 1 ft is 12 in, so it needs 12 × 2 = 24 sheets, not 2.']},
    {sel:'#mk-plaster .activity-body > .mk-todo',rungs:['First find the area of the wall in square feet.','Each bucket covers 10 square feet. Count by tens until you cover all of it, even if the last bucket isn\'t full.','Here are different numbers: 37 square feet needs 4 buckets: 3 buckets cover only 30.']},
    {sel:'#tab-assignment .q-block',i:0,inside:true,rungs:['Area = length × width when both sides are in the same unit.','A square has 4 equal sides, so its area is side × side.','Here are different numbers: 6 cm by 4 cm is 24 square centimeters.']},
    {sel:'#tab-assignment .q-block',i:1,inside:true,rungs:['Are the two sides in the same unit? If not, change the bigger unit first.','1 ft = 12 in and 1 yd = 3 ft.','Here are different numbers: a rectangle 1 ft 2 in long and 3 in wide. 1 ft 2 in is 14 in, and 14 × 3 = 42 square inches.']},
    {sel:'#tab-assignment .q-block',i:2,inside:true,rungs:['First find the area of the 4 in by 5 in rectangle.','Find two other numbers that multiply to the same area.','Here are different numbers: a 2 in by 6 in rectangle has the same area as a 3 in by 4 in rectangle: 12 square inches.']}],
  writing:{
    'journal-notice':{min:6,chips:[{label:'I notice',words:['notice','see','long','longer','thin','wide','square','strip','feet','foot','ft','inches','inch','in','6','2','1','same','different']},{label:'I wonder',words:['wonder','how','which','why','?','if','what','more']}]},
    'journal-think':{min:10,chips:[{label:'your answers',words:['36','thirty-six','thirty six','same']},{label:'how you found them',words:['count','counted','tile','tiles','rows','row','multiply','times','×','18','12','inches','foot','feet','split','added','add']}]},
    'journal-compare':{min:8,chips:[{label:'a Crew member\'s way',words:['atlas','felix','hazel','cora','change','changed','convert','inches first','split','1-foot','foot mark','parts','part','picture','pictured','rows','units']},{label:'why it is like yours',words:['because','like','same','i did','i also','me too','my way','mine']}]},
    'journal-square':{min:10,chips:[{label:'equal sides',words:['equal','same','all four','4 sides','four sides','every side','each side','all the sides']},{label:'side × side',words:['times','×','multiply','9 × 9','side','81','itself']}]},
    'journal-fix':{min:10,chips:[{label:'the mistake',words:['feet','foot','inches','inch','units','unit','same unit','different units','mixed','1 ft','5 in']},{label:'the fix',words:['12','change','changed','convert','60','12 × 5','first']}]},
    'journal-big':{min:12,chips:[{label:'same unit first',words:['same unit','same units','change','convert','feet to inches','yards to feet','inches','feet','first']},{label:'length × width',words:['times','×','multiply','length','width','rows','split','add']},{label:'an example of your own',words:['ft','in','yd','cm','m','foot','inch','yard','=']}]},
    'journal-prove':{min:12,chips:[{label:'what to do first',words:['change','convert','inches','12','same unit','same units','first','foot']},{label:'how you found the sheets',words:['multiply','times','×','rows','row']}]}},
  /* the opening (anchor animation, 3 Nov 2026): Leonardo's notebook draws the lesson's math, in his ink.
     A ruler: 12 in = 1 ft · one gold sheet = 1 square inch · the strip and the square panel, to one scale, with
     their measures (feet AND inches on one side) · Leonardo asks the Think question. It never tiles a panel or shows 36. */
  introDraft:{card:false,len:8.6,hold:1.4,   /* turned off (Bethany, 3 Nov 2026): rename back to intro to play it */
    alt:'Leonardo\'s notebook. A ruler draws itself and counts 12 inches: 12 inches is 1 foot. One yellow gold sheet lands on a 1-inch square: 1 square inch. Then two panels are drawn to the same scale: a long strip, 1 foot 6 inches by 2 inches, and a square, 6 inches by 6 inches. Leonardo asks: how many gold sheets cover each panel?',
    backdrop:function(g,t){var x=g.x,W=g.W,H=g.H;x.fillStyle='#efe2c0';x.fillRect(0,0,W,H);
      for(var i=0;i<W*H/90;i++){var a=(i*97.31)%W,b=(i*53.7)%H;x.fillStyle=i%3?'rgba(139,105,60,.07)':'rgba(255,255,255,.18)';x.fillRect(Math.round(a),Math.round(b),1,1);}
      x.fillStyle='rgba(107,79,53,.10)';for(var k=0;k<9;k++){var lx=((k*61)%(W-50))+8,ly=((k*37)%(H-20))+6;for(var j=0;j<4;j++)x.fillRect(lx,ly+j*3,12+((k*j*7)%18),1);}
      for(var e=0;e<6;e++){x.fillStyle='rgba(120,84,40,'+(0.05*(6-e))+')';x.fillRect(0,e,W,1);x.fillRect(0,H-1-e,W,1);x.fillRect(e,0,1,H);x.fillRect(W-1-e,0,1,H);}},
    scene:function(g,t){
      var INK='#5a3a22',GOLD='#F2B705',x=g.x,land=!g.portrait,W=g.W,H=g.H,cx=g.cx;
      var u=land?Math.max(6,Math.min(11,Math.floor((W-60)/26))):Math.max(5,Math.min(8,Math.floor((W-56)/18)));
      function line(x0,y0,x1,y1,p,c){var n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0)),m=Math.floor(n*g.ease(p));for(var k=0;k<=m;k++)g.rect(x0+(x1-x0)*k/(n||1),y0+(y1-y0)*k/(n||1),1,1,c||INK);}
      function trace(X,Y,w,h,p,c){var L=2*(w+h),d=L*p;function seg(a,b,c2,d2,len){var q=Math.max(0,Math.min(1,d/len));line(a,b,c2,d2,q,c);d-=len;}
        seg(X,Y,X+w,Y,w);seg(X+w,Y,X+w,Y+h,h);seg(X+w,Y+h,X,Y+h,w);seg(X,Y+h,X,Y,h);}
      function tag(s,X,Y,on,glow){if(on<=0)return;x.globalAlpha=Math.min(1,on);var wd=g.text(s,-999,-999,{size:8,font:'dot',shadow:false});
        g.rect(X-wd/2-3,Y-1,wd+6,11,glow?'#fff3c4':'#efe2c0');if(glow)g.rect(X-wd/2-3,Y+10,wd+6,1,GOLD);g.text(s,X,Y,{size:8,font:'dot',col:glow?'#7a4a00':INK,shadow:false});x.globalAlpha=1;}
      function dimH(X0,X1,Y,s,p,glow){if(p<=0)return;line(X0,Y,X1,Y,p);g.rect(X0,Y-2,1,5,INK);if(p>=1)g.rect(X1,Y-2,1,5,INK);tag(s,(X0+X1)/2,Y-5,g.p(p,.6,1)*1,glow);}
      function dimV(X,Y0,Y1,s,p,glow){if(p<=0)return;line(X,Y0,X,Y1,p);g.rect(X-2,Y0,5,1,INK);if(p>=1)g.rect(X-2,Y1,5,1,INK);var wd=g.text(s,-999,-999,{size:8,font:'dot',shadow:false});tag(s,X+5+wd/2,(Y0+Y1)/2-5,g.p(p,.6,1),glow);}
      // ── 1. the ruler: 12 inch marks, then "12 in = 1 ft" · 2. one gold sheet on a 1-inch square (its label beside it)
      var LB='1 gold sheet = 1 square inch',lw=g.text(LB,-999,-999,{size:8,font:'dot',shadow:false}),sq=Math.max(u,8),rl=12*u;
      var rx,ry,qx,qy;
      if(land){var gw=rl+u*3+sq+6+lw;rx=Math.round(cx-gw/2);ry=Math.round(H*0.13);qx=rx+rl+u*3;qy=ry-1;}
      else{rx=Math.round(cx-rl/2);ry=Math.round(H*0.15);var gw2=sq+6+lw;qx=Math.round(cx-gw2/2);qy=ry+30;}
      var rp=g.p(t,0.2,0.8);
      if(rp>0){g.rect(rx,ry,Math.round(rl*g.ease(rp)),8,'#d9b26a');g.rect(rx,ry,Math.round(rl*g.ease(rp)),1,'#f0d394');g.rect(rx,ry+7,Math.round(rl*g.ease(rp)),1,'#a07a3a');}
      for(var i=1;i<=12;i++){var at=0.8+i*0.11;if(t>=at){g.rect(rx+i*u-1,ry,1,i===12?7:4,INK);if(i%3===0||i===1)g.text(String(i),rx+i*u-1,ry+10,{size:6,font:'dot',col:INK,shadow:false});if(g.once('tick'+i))g.blip(380+i*30,.05);}}
      if(t>2.2)tag('12 in = 1 ft',rx+rl/2,ry-14,g.p(t,2.2,2.6),t<3.2);
      if(t>2.6){x.globalAlpha=g.p(t,2.6,2.9);g.rect(qx,qy,sq,sq,'#ffffff');trace(qx,qy,sq,sq,1,'#9fb0d0');x.globalAlpha=1;}
      if(t>2.9){var dp=g.back(g.p(t,2.9,3.3)),ty=g.lerp(qy-24,qy,dp);g.rect(qx+1,ty+1,sq-1,sq-1,GOLD);g.rect(qx+1,ty+1,sq-1,1,'#ffd84d');if(g.once('tile'))g.blip(880,.08);}
      if(t>3.3){x.globalAlpha=g.p(t,3.3,3.7);g.text(LB,qx+sq+6+lw/2,qy+Math.round(sq/2)-5,{size:8,font:'dot',col:INK,shadow:false});x.globalAlpha=1;}
      // ── 3. the two panels, to one scale, drawn in ink; plain white (nothing tiled)
      var sw=18*u,sh=2*u,pw=6*u,gap=land?Math.max(26,u*3):0,py=land?Math.round(H*0.42):Math.round(H*0.36);
      var sx=land?cx-Math.round((sw+gap+pw+34)/2):cx-Math.round((sw+30)/2),sy=py,px=land?sx+sw+gap:cx-Math.round(pw/2),pyy=land?py:py+sh+30;
      var a1=g.p(t,3.8,5.0),a2=g.p(t,4.3,5.5);
      if(a1>0){if(a1>=1)g.rect(sx+1,sy+1,sw-1,sh-1,'#fffdf6');trace(sx,sy,sw,sh,a1);}
      if(a2>0){if(a2>=1)g.rect(px+1,pyy+1,pw-1,pw-1,'#fffdf6');trace(px,pyy,pw,pw,a2);}
      var glow=t>6.4&&t<8.2&&Math.floor(t*3)%2===0;                       // the feet-and-inches side blinks gold: the units are not the same
      dimH(sx,sx+sw,sy-8,'1 ft 6 in',g.p(t,5.2,5.9),glow||t>=8.2);
      dimV(sx+sw+4,sy,sy+sh,'2 in',g.p(t,5.4,6.0));
      dimH(px,px+pw,pyy-8,'6 in',g.p(t,5.6,6.2));
      dimV(px+pw+4,pyy,pyy+pw,'6 in',g.p(t,5.8,6.4));
      if(t>3.8){x.globalAlpha=g.p(t,4.6,5.2);g.text('the strip',sx+sw/2,sy+sh+4,{size:7,font:'dot',col:INK,shadow:false});g.text('the square panel',px+pw/2,pyy+pw+4,{size:7,font:'dot',col:INK,shadow:false});x.globalAlpha=1;}
      // ── 4. Leonardo asks (never the answer)
      if(t>7.0&&window.CWART){var lp=g.ease(g.p(t,7.0,7.6)),sp=CWART.person('leo',Math.floor(t*1.6)%2,Math.floor(t*0.7)%6===0,t>7.6&&t<9.4&&Math.floor(t*7)%2===0);
        var lx=land?W-sp.width-10:Math.round(cx-sp.width/2),ly=Math.round(g.lerp(H+4,H-sp.height-6,lp));x.drawImage(sp,lx,ly);}
      if(t>7.6){var qs='How many gold sheets cover each panel?',bw=Math.min(W-(land?90:20),g.text(qs,-999,-999,{size:8,font:'dot',shadow:false})+16),bx=land?Math.round((W-56)/2-bw/2):Math.round(cx-bw/2),by=land?H-30:Math.round(H*0.74);
        g.rect(bx-1,by-1,bw+2,20,INK);g.rect(bx,by,bw,18,'#fffaf0');g.rect(bx,by,3,18,GOLD);
        g.text(g.type(qs,t,7.7,30),bx+bw/2+1,by+5,{size:8,font:'dot',col:'#2b2118',shadow:false});}
    }},
  bigIdea:'To find the area of a rectangle, first put both sides in the same unit: change feet to inches, or yards to feet. Then multiply length × width, or split the long side where the units change and add the parts. The area is in square units.',
  words:[{w:'area',d:'how many square units cover a flat shape'},{w:'square units',d:'squares used to measure area, like square inches or square feet'},{w:'convert',d:'change a measurement to a different unit, like feet to inches'}],
  intendedWrong:['1 × 5 = 5 sheets'],
  models:{mental:bind(modelMental),think:bind(modelThink),frame:bind(modelFrame),square:bind(modelSquare),same:bind(modelSame),fix:bind(modelFix),plaster:bind(modelPlaster),guided:bind(modelGuided),prove:bind(modelProve),free:bind(modelFree),bonus:bind(modelBonus)}
};
})();
/* the job list on the board updates when a window finishes, too */
window.CW_ONDONE=function(){};
