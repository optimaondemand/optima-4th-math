/* Lesson 4.11.02 · Area of Rectangles, Part 2 (a missing side) · the classical-guide layer (Leonardo da Vinci, Milan 1495)
   Dimensions 4B Ch 11 Lesson 2 (the area and one side are known: build rows of the known side, then see it as
   "side × ? = area" and divide; convert the given side first) + the IP (the IP wins). New numbers everywhere: no IP problem
   or single IP fact (126 ÷ 9, 112 ÷ 8, 144 ÷ 8, 25 / 49 / 100, 104 ÷ 8, 2/3 ft = 8 in, 2 ft = 24 in, 240 ÷ 24, 10 × 6,
   60 ÷ 4, 60 ÷ 12, 96 ÷ 8, 96 ÷ 6) appears where students are taught. Scale in the windows: 4 canvas px = 1 inch. */
var CW_DATA = {
  key:'g4-4-11-02', room:'workshop',
  place:{t1:'MILAN, ITALY · 1495'},
  windows:{
    /* Warm-Up opener: the storeroom floor (the guide's Think: tiles cover a floor, the width is known, how long is it?) */
    floor:{title:'The Storeroom Floor', sub:'56 tiles and a missing length', play:'Step into the workshop',
      alt:'Leonardo da Vinci\'s workshop in Milan. A stack of square yellow floor tiles sits by the workbench. Bernardo brings a drawing of the storeroom floor: 7 feet wide, and the length is a question mark.',
      people:['leo'],
      objects:[{id:'stack',kind:'stack',x:186,y:88,w:16,h:20,name:'56 floor tiles'}],
      exploreText:'Click the 2 things that glow gold to look up close.',
      spots:[
        {id:'tile',label:'A floor tile',x:184,y:86,w:20,h:24,zoom:1.6,card:'<b class="h">1 floor tile</b>Each tile is a square, 1 foot on every side. It covers 1 square foot. On your page, a yellow tile like this stands for 1 floor tile.<div class="cw-leaf"><div class="sq"><span class="side b">1 ft</span><span class="side r">1 ft</span></div></div>',
         lines:['These are the new floor tiles for the storeroom.','Each tile is a square, 1 foot on every side.']},
        {id:'plan',label:'The plan',x:120,y:66,w:38,h:40,zoom:1.4,card:'<b class="h">The storeroom floor</b><svg viewBox="0 0 200 120" width="200" height="120" role="img" aria-label="A drawing of the floor: the side along the door is 7 feet. The other side has a question mark."><line x1="30" y1="18" x2="170" y2="18" stroke="#3f2716" stroke-width="2"/><text x="100" y="12" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="13" fill="#3f2716">7 ft</text><rect x="30" y="26" width="140" height="80" fill="#fbf6ea" stroke="#3f2716" stroke-width="2" stroke-dasharray="0"/><text x="182" y="72" font-family="Nunito,sans-serif" font-weight="900" font-size="18" fill="#9e4552">?</text></svg>',
         lines:['My drawing of the storeroom floor.','One side is 7 feet. The other side has a question mark.']}],
      script:[
        {w:'leo',t:'Welcome back, my helper! The Duke\'s gold panels are finished. Now they need a safe room to stay in.'},
        {w:'leo',t:'We are putting a new floor in the storeroom. Look around.'},
        {explore:{need:2}},
        {narr:'Someone knocks. The door opens.'},
        {enter:'bern'},
        {w:'bern',t:'Master Leonardo! I counted the tiles. There are 56. They will cover the whole floor, with none left over.'},
        {focus:['stack']},{tags:['stack:name']},
        {w:'bern',t:'The storeroom is 7 feet wide. But crates block the far wall. I can\'t measure how long the room is!'},
        {card:'<b class="h">The storeroom floor</b>Width: <b>7 ft</b> · Length: <b>?</b><br>Tiles that cover it: <b>56</b>, each 1 foot by 1 foot'},
        {w:'leo',t:'Hmm. We know the tiles and one side. Can the tiles tell us the other side?'},
        {prompt:'How long do you think the floor is? Pick what you think now. You will find out soon.',save:'predict',choice:[
          {id:'longer',say:'Longer than it is wide (more than 7 feet).',then:[{w:'leo',t:'Maybe! 56 is a lot of tiles.'}]},
          {id:'shorter',say:'Shorter than it is wide (less than 7 feet).',then:[{w:'leo',t:'Interesting. We\'ll have to check.'}]},
          {id:'square',say:'Exactly as long as it is wide. A square!',then:[{w:'leo',t:'A square room? That would be tidy. Let\'s see.'}]},
          {id:'unsure',say:'I\'m not sure yet.',then:[{w:'leo',t:'Good. "Not sure yet" is a fine place to start.'}]}]},
        {w:'leo',t:'One row across the room takes 7 tiles.',wonder:'What happens if we keep laying rows of 7?'},
        {w:'leo',t:'Let\'s find out how long the floor is.'}],
      end:{task:'Find how long the storeroom floor is. It is <b>7 ft</b> wide, and <b>56</b> one-foot tiles cover it with none left over.',go:{tab:'warmup',sel:'#mk-think',label:'Go to the floor ↓'}}},

    /* Lesson, before Job 5: Bernardo's note (the IP's find-and-fix: he multiplied when he should divide) */
    note:{title:'Bernardo\'s Note', sub:'Something is wrong. What?', play:'Back to the workshop',
      alt:'Bernardo holds a note about the lid of the Duke\'s new chest. The lid sits on the easel. One side is 8 inches. The other side has a question mark.',
      people:['leo','bern'],
      objects:[{id:'lid',kind:'panel',x:121,y:77,w:36,h:32,name:'the lid',dims:{w:'?',h:'8 in'}}],
      script:[
        {w:'bern',t:'Master Leonardo, the lid of the Duke\'s chest needs 72 gold sheets. One side is 8 inches. I found the other side!'},
        {card:'<b class="h">Bernardo\'s note</b><span class="hand">Lid: area 72 square inches.<br>One side: 8 in.<br>Other side: 72 × 8 = 576 in.<br>— Bernardo</span>'},
        {focus:['lid']},{tags:['lid:name','lid:w','lid:h']},
        {w:'leo',t:'576 inches? That is longer than this whole workshop.',wonder:'Can a little lid have a side that long?'},
        {w:'bern',t:'But 72 times 8 is 576. I checked it twice!'},
        {w:'leo',t:'Your times table is right, my friend. But is times the right thing to do here?'},
        {w:'leo',t:'I think I see it. Do you?'}],
      end:{task:'Find Bernardo\'s mistake. Then find the other side of the lid.',go:{tab:'learn',sel:'#mk-fix',label:'Go to the lid ↓'}}},

    /* Show What You Know, at the end: the floor is done; the Duke's next wish sets up 4.11.03 (a border around a mirror) */
    wrap:{title:'Every Tile in Its Place', sub:'The storeroom is finished', play:'Back to the workshop',
      alt:'Leonardo and Bernardo in the workshop. A letter from the Duke of Milan arrives about a gold border for a mirror.',
      people:['leo','bern'],
      objects:[{id:'mirror',kind:'panel',x:117,y:70,w:44,h:36,name:'the mirror'}],
      script:[
        {w:'bern',t:'Master Leonardo! The storeroom floor is done. Every tile fit, and not one was left over.'},
        {w:'leo',t:'Because you knew the area and one side, and you found the other side.'},
        {w:'bern',t:'Now the Duke has a new wish. He sent a letter.'},
        {focus:['mirror']},{tags:['mirror:name']},
        {card:'<b class="h">A letter from the Duke</b><span class="hand">Leonardo, put a gold border around my new mirror, 2 inches wide on every side. How many gold sheets will the border need?<br>— Ludovico, Duke of Milan</span>'},
        {w:'leo',t:'A border is not one plain rectangle. That is a puzzle for next time.'}],
      end:{lead:'📜 Next time',task:'In the next lesson, you will help Leonardo find the area of shapes made of rectangles, like a border around a mirror.',go:{tab:'assignment',sel:'#mk-next',label:'See what\'s next ↓'}}}
  },
  /* the guide on the lift: a tip for the part of the page you are on, and a question to ask him. Hints, never answers. */
  guide:{who:'leo',name:'Leonardo',role:'Painter and inventor',ride:'lift',
    hello:'Buongiorno! That means good morning. I am up here if you need me.',
    top:'Buongiorno!',bottom:'Ben fatto! Well done!',
    decor:[{at:0.45,kind:'flyer',say:'I drew machines that might fly. Drawing helps me think!'}],   /* one keepsake per lesson (11.01: the Mona Lisa) */
    tabs:{
      warmup:{say:'Warm up your brain first. A painter warms up his hand, too.',ask:[{q:'Why are there so many division facts today?',a:'Today you know the area and one side. Dividing helps you find the other side.'}]},
      learn:{say:'One station at a time. Use the bar at the top to see where you are.',ask:[{q:'What are the three stations?',a:'Learn it, Practice together, and On your own. Finish one, then press Next station.'}]},
      assignment:{say:'Now you show what you know. Take your time, and check by multiplying.',ask:[{q:'How do I check a missing side?',a:'Multiply the side you found by the side you knew. You should get the area.'}]}},
    spots:[
      {sel:'.fluency-box',say:'Division facts! You will use them all lesson.',ask:[{q:'How are 7 × ? = 35 and 35 ÷ 7 alike?',a:'They ask the same thing: what number times 7 makes 35?'}]},
      {sel:'#mk-mental',say:'Split the big number into parts that are easy to divide.',ask:[{q:'How do I pick the parts?',a:'Look for a part you can divide easily, like 40 ÷ 4 or 70 ÷ 7. The other part is what is left.'}]},
      {sel:'.mk-board-mount',say:'These are today\'s workshop jobs. Each one uses the same big idea.',ask:[{q:'Do I have to do the jobs in order?',a:'Yes, please. Each job gets you ready for the next one.'}]},
      {sel:'#mk-think',say:'One row across the floor takes 7 tiles. What happens if you keep going?',ask:[{q:'Can I just lay the tiles?',a:'Yes! Lay rows until the tiles run out. Then look at what you built.'},{q:'What does one row show?',a:'One row of 7 tiles covers 7 feet across and 1 foot of the length.'}]},
      {sel:'#mk-ways',say:'Four friends, four ways. Which one is like yours?',ask:[{q:'Which way is the right way?',a:'All four ways work. Pick the one that makes the most sense to you, and say why.'}]},
      {sel:'#mk-guided',say:'Your turn. One step at a time.',ask:[{q:'Why do the rows tell me the length?',a:'Each row is 1 inch of the length. So the number of rows is how many inches long it is.'}]},
      {sel:'#mk-key',say:'These are my measuring rules. I keep them in my notebook.',ask:[{q:'Is the missing side in square inches?',a:'No. A side is a length, so it is in inches or feet. Only the area is in square units.'}]},
      {sel:'#mk-worked',say:'Read this one slowly. It is already solved.',ask:[{q:'Why are there two ways?',a:'To show you that both ways get the same answer. Use the one you like best.'}]},
      {sel:'#mk-duke',say:'The Duke\'s letter! Rows of 4 this time.',ask:[{q:'How do I start?',a:'Lay one row of 4 sheets across the panel. Keep adding rows until the sheets run out.'}]},
      {sel:'#mk-square',say:'A square! Its sides are all the same length.',ask:[{q:'How do I find the side of a square?',a:'Ask: what number times itself makes the area? Try a few numbers.'}]},
      {sel:'#mk-convert',say:'Look at the units before you divide.',ask:[{q:'How many inches is part of a foot?',a:'1 foot is 12 inches. Split the 12 into equal parts. One fourth of 12 is 3.'}]},
      {sel:'#mk-fix',say:'Bernardo made a mistake. Can you find it?',ask:[{q:'Should I multiply or divide?',a:'You know the area and one side. Ask: 8 × what makes the area? That is a division.'}]},
      {sel:'#mk-cartoon',say:'This job has two steps. Find the area first.',ask:[{q:'What does "the same area" mean?',a:'Both papers are covered by the same number of square feet. Their shapes can be different.'}]},
      {sel:'#mk-onepic',say:'The whole lesson in one picture.',ask:[{q:'How do I say the big idea?',a:'Try: the side I know times what makes the area? Divide to find it, then multiply to check.'}]},
      {sel:'#mk-prove',say:'Prove it! Check by multiplying.',ask:[{q:'What makes a good proof?',a:'Show the right way to find the side, then multiply to check that you get the area.'}]}
    ]}
};

var PQ_LESSON=(function(){
var api;
function setJob(id,src){api.setJob(id,src);}
function grid(m,cfg){return OAOKit.areaGrid(m,cfg);}
function sub(m,cls){var d=document.createElement('div');d.className=cls||'';m.appendChild(d);return d;}
var IN={s:'in',one:'inch',many:'inches'},FT={s:'ft',one:'foot',many:'feet'};
function ask1(el,q,answer,mistakes,unit,onok,hint,keep){   /* keep = {get(), set(v)}: the box remembers its answer */
  var f=document.createElement('form');f.className='ag-ask';
  f.innerHTML='<label>'+q+' <input type="text" inputmode="numeric" autocomplete="off" aria-label="'+q.replace(/<[^>]+>/g,'')+'"> <span class="ag-u">'+(unit||'')+'</span></label> <button class="ok-btn" type="submit">Check</button><span class="ag-fb" aria-live="polite"></span>';
  var msg=document.createElement('div');msg.className='ok-msg';el.appendChild(f);el.appendChild(msg);var inp=f.querySelector('input');
  var solved=false;function okNow(){f.classList.add('ok');inp.disabled=true;f.querySelector('.ag-fb').textContent='✓';msg.className='ok-msg';msg.textContent='';}
  if(keep&&keep.get()!=null&&+keep.get()===answer){inp.value=keep.get();solved=true;okNow();}
  f.onsubmit=function(e){e.preventDefault();if(solved)return;if(keep)keep.set(inp.value);var v=+String(inp.value).replace(/[,\s]/g,'');if(!inp.value.trim()){msg.className='ok-msg hint';msg.textContent='Type a number.';return;}
    if(v===answer){solved=true;okNow();onok&&onok();return;}   /* counted once: a solved box never counts again */
    var m=(mistakes||[]).filter(function(x){return x.v===v;})[0];f.querySelector('.ag-fb').textContent='✗';msg.className='ok-msg hint';msg.textContent=m?m.text:(hint||'Not yet. Look at the step again.');};
  return f;}
function store(key){var st=OAOKit._ls(key,{})||{};return {st:st,save:function(){OAOKit._lsSet(key,st);},keep:function(k){return {get:function(){return st[k];},set:function(v){st[k]=v;OAOKit._lsSet(key,st);}};}};}

/* Warm-Up · Mental Math: split the number you divide into two easy parts (Unit 5, a known strategy). Blank bonds on each. */
function modelMental(m){
  OAOKit.mentalMath(m,{key:'g4-4-11-02-mm',name:'Split to divide',
    how:'To divide in your head, split the number into two parts that are easy to divide. Divide each part, then add the answers.',
    example:{q:'57 ÷ 3',bond:{whole:57,parts:[30,27]},steps:['Split 57 into 30 and 27.','30 ÷ 3 = 10 and 27 ÷ 3 = 9.','10 + 9 = 19. So 57 ÷ 3 = 19.']},
    work:'bond',
    problems:[{q:'52 ÷ 4',a:13,hint:'Split 52 into 40 and 12. 40 ÷ 4 = 10 and 12 ÷ 4 = 3. Add them.'},
              {q:'84 ÷ 7',a:12,hint:'Split 84 into 70 and 14. 70 ÷ 7 = 10 and 14 ÷ 7 = 2. Add them.'},
              {q:'85 ÷ 5',a:17,hint:'Split 85 into 50 and 35. 50 ÷ 5 = 10 and 35 ÷ 5 = 7. Add them.'}]});
}
/* Warm-Up · Think: the storeroom floor. Any method: lay rows of 7, count by 7s, or a fact. No rule is taught here. */
function modelThink(m){
  grid(m,{key:'g4-4-11-02-think',unit:FT,cols:7,rows:11,n:56,mode:'rows',dimW:'7 ft',dimH:'? ft',cell:34,
    todo:'<b>The storeroom floor.</b> Each square is 1 foot. Tap or drag to lay tiles, or press <b>+ Add a row</b>. You have 56 tiles. Or work it out your own way.',
    goalText:'All 56 tiles are on the floor, in full rows. None are left over.',
    ask:[{q:'The floor is how many feet long?',unit:'ft',answer:8,
      mistakes:[{v:392,text:'56 × 7 makes a much bigger number. You already know the tiles: 56. Think: rows of 7 tiles, how many rows use all 56?'},
                {v:49,text:'56 − 7 takes away one row. The tiles make many rows of 7. How many rows use all 56?'},
                {v:63,text:'56 + 7 adds the width. Lay rows of 7 until all 56 tiles are used. Count the rows.'},
                {v:7,text:'7 feet is the width, the side you already know. How many rows of 7 tiles use all 56?'}],
      hint:'Each row across the floor uses 7 tiles. Count the rows that use all 56.'}],askOnly:true,
    onDone:function(){setJob('j1',m);}});
  var ok=function(){var A=OAOKit._ls('g4-4-11-02-think',{});return A&&A.done;};
  if(ok())setJob('j1',m);
  /* the payoff, only after the Think is solved: Leonardo answers the prediction, and the same 56 tiles turn 7 by 8 → 8 by 7 */
  var same=sub(m,'cw-same36');same.hidden=true;
  var T=16,svgNS='http://www.w3.org/2000/svg',W=8*T+12,H=8*T+12;
  var PRED={longer:'Before you counted, you thought the floor was longer than it is wide. You were right!',shorter:'Before you counted, you thought the floor was shorter than it is wide.',square:'Before you counted, you thought the floor was a square.',unsure:'Before you counted, you weren\'t sure.'};
  same.innerHTML='<div class="cw-predict" hidden><canvas width="32" height="32" aria-hidden="true"></canvas><p></p></div><div class="cw-same-h">🔁 The same tiles, turned</div><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="56 tiles in 8 rows of 7 turn into 7 rows of 8. There are 56 tiles both times."></svg>'+
    '<div class="cw-same-row"><button type="button" class="ok-btn cw-same-go">▶ Turn the floor</button><span class="cw-same-n">56 tiles</span></div>'+
    '<p class="cw-same-q"><b>Think:</b> What changed? What stayed the same?</p>';
  var sv=same.querySelector('svg'),tiles=[],shape=0,rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function at(k,sh){var c=sh?8:7;return {x:6+(k%c)*T,y:6+Math.floor(k/c)*T};}
  for(var k=0;k<56;k++){var r=document.createElementNS(svgNS,'rect');var p0=at(k,0);r.setAttribute('x',p0.x+1);r.setAttribute('y',p0.y+1);r.setAttribute('width',T-2);r.setAttribute('height',T-2);r.setAttribute('rx',2);r.setAttribute('fill','#F2B705');r.setAttribute('stroke','#B88600');sv.appendChild(r);tiles.push(r);}
  function move(to){var t0=performance.now(),D=rm?0:1200;(function f(now){var q=D?Math.min(1,(now-t0)/D):1;
    tiles.forEach(function(r,k){var e=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2,a=at(k,1-to),b=at(k,to);r.setAttribute('x',a.x+(b.x-a.x)*e+1);r.setAttribute('y',a.y+(b.y-a.y)*e+1);});
    if(q<1)requestAnimationFrame(f);})(t0);}
  var go=same.querySelector('.cw-same-go');go.onclick=function(){shape=1-shape;move(shape);go.textContent=shape?'◀ Turn it back':'▶ Turn the floor';
    same.querySelector('.cw-same-n').textContent=shape?'56 tiles · 8 ft wide':'56 tiles · 7 ft wide';};
  function predict(){var pr=OAOKit._ls('g4-4-11-02-predict',null),box=same.querySelector('.cw-predict');
    if(!pr||!PRED[pr.id])return;box.querySelector('p').innerHTML='<b>Leonardo:</b> '+PRED[pr.id]+' The floor is 8 feet long and 7 feet wide. What do you think now?';box.hidden=false;
    var pc=box.querySelector('canvas');if(pc&&window.CWART)CWART.portrait(pc,'leo',true);}
  (function wait(){if(ok()){same.hidden=false;predict();return;}setTimeout(wait,700);})();
}
/* Lesson · Your Turn (gated): 90 square inches, 6 in wide. See it (rows) → picture it (6 × ? = 90) → write it (÷, then check) */
function modelGuided(m){
  var S=store('g4-4-11-02-guided'),st=S.st;
  function step(n,title,body){var d=document.createElement('div');d.className='cw-gstep';d.dataset.n=n;d.innerHTML='<div class="cw-gstep-h"><span class="cw-gstep-n">'+n+'</span><b>'+title+'</b><span class="cw-gstep-lock">🔒 opens when you finish step '+(n-1)+'</span></div><div class="cw-gstep-b">'+(body||'')+'</div>';m.appendChild(d);return d;}
  var s1=step(1,'See it: lay rows of 6','<p>The panel is <b>6 inches</b> wide. Lay rows of 6 gold sheets until all <b>90</b> are used. Then count the rows.</p>');
  var s2=step(2,'Picture it: 6 × ? = 90','<p>Each row is 1 inch of the length. Fill in the missing side. The label on the drawing fills in when you are right.</p>');
  var s3=step(3,'Write it: divide, then check','<p>Finding a missing side is a division. Then multiply to check that you get the area again.</p>');
  var done=document.createElement('div');done.className='cw-gdone';done.hidden=true;done.innerHTML='✅ <b>The panel is 15 inches long.</b> 6 × ? = 90, so 90 ÷ 6 = 15. Check: 15 × 6 = 90. ✓';m.appendChild(done);
  function open(d,on){d.classList.toggle('open',!!on);}
  var g=document.createElement('div');s1.querySelector('.cw-gstep-b').appendChild(g);
  OAOKit.areaGrid(g,{key:'g4-4-11-02-guided-tiles',unit:IN,cols:6,rows:18,n:90,mode:'rows',dimW:'6 in',dimH:'? in',cell:26,
    goalText:'All 90 sheets are laid, in full rows of 6.',
    ask:[{q:'Rows of gold sheets:',unit:'rows',answer:15,mistakes:[{v:6,text:'6 is how many sheets in each row. Count the rows going down.'},{v:84,text:'90 − 6 takes away one row. Count how many rows you built.'},{v:540,text:'90 × 6 is far too many. Count the rows you built.'}],hint:'Count the rows going down.'}],
    onDone:function(){st.s1=1;S.save();open(s2,1);}});
  var pic=document.createElement('div');pic.className='cw-gpic';
  pic.innerHTML='<svg viewBox="0 0 360 230" role="img" aria-label="The panel drawn as a rectangle. The top side is 6 inches. The long side has a question mark. Area = 90 square inches is written inside.">'
    +'<line x1="120" y1="18" x2="210" y2="18" stroke="#0E1C42" stroke-width="2"/><text x="165" y="13" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="16" fill="#0E1C42">6 in</text>'
    +'<rect x="120" y="26" width="90" height="196" fill="#fff" stroke="#0E1C42" stroke-width="3"/>'
    +'<rect x="125" y="110" width="80" height="28" rx="4" fill="#FFF8E1" stroke="#0E1C42"/><text x="165" y="129" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="13" fill="#0E1C42">90 sq in</text>'
    +'<line x1="226" y1="26" x2="226" y2="222" stroke="#0E1C42" stroke-width="2"/><text class="gl" x="236" y="130" font-family="Nunito" font-weight="900" font-size="18" fill="#9E4552">? in</text></svg>';
  s2.querySelector('.cw-gstep-b').appendChild(pic);var gl=pic.querySelector('.gl');
  ask1(s2.querySelector('.cw-gstep-b'),'6 × ? = 90. The missing side:',15,[{v:84,text:'90 − 6 subtracts. Ask: 6 times what number makes 90?'},{v:96,text:'90 + 6 adds. Ask: 6 times what number makes 90?'},{v:540,text:'90 × 6 multiplies the area by the side. Ask: 6 times what number makes 90?'}],'in',function(){gl.textContent='15 in';st.s2=1;S.save();open(s3,1);},null,S.keep('l'));
  var got={};function two(k){got[k]=1;if(got.d&&got.c){st.s3=1;S.save();done.hidden=false;}}
  ask1(s3.querySelector('.cw-gstep-b'),'90 ÷ 6 =',15,[{v:540,text:'That multiplies. Divide: how many 6s are in 90?'},{v:84,text:'That subtracts. Divide: how many 6s are in 90?'}],'in',function(){two('d');},null,S.keep('d'));
  ask1(s3.querySelector('.cw-gstep-b'),'Check: 15 × 6 =',90,[{v:21,text:'15 + 6 adds. Multiply: 15 rows of 6.'}],'square inches',function(){two('c');},null,S.keep('c'));
  open(s1,1);if(st.s1)open(s2,1);if(st.s2){open(s3,1);gl.textContent='15 in';}if(st.s3)done.hidden=false;
}
/* Lesson · Job 2: the Duke's letter from 4.11.01 (48 gold sheets, 4 in wide: how long?) */
function modelDuke(m){
  grid(m,{key:'g4-4-11-02-duke',unit:IN,cols:4,rows:15,n:48,mode:'rows',dimW:'4 in',dimH:'? in',cell:30,
    todo:'The panel is 4 inches wide. Lay rows of 4 gold sheets until all 48 are used.',
    goalText:'All 48 sheets are laid, in full rows of 4.',
    ask:[{q:'The panel is how many inches long?',unit:'in',answer:12,
      mistakes:[{v:192,text:'48 × 4 multiplies. Ask: 4 times what number makes 48? Count your rows.'},{v:44,text:'48 − 4 takes away one row. Count the rows you built.'},{v:4,text:'4 inches is the width. Count the rows going down.'}],hint:'Count the rows. Each row is 1 inch of the length.'},
         {q:'That is how many feet?',unit:'ft',answer:1,mistakes:[{v:12,text:'12 is the inches. How many feet is 12 inches?'}],hint:'12 inches make 1 foot.'}],
    onDone:function(r){setJob('j2',r);}});
}
/* Lesson · Job 3: a square of 64 sheets (IP 2: ? × ? = area) */
function modelSquare(m){
  grid(m,{key:'g4-4-11-02-square',unit:IN,cols:12,rows:10,mode:'free',cell:28,
    todo:'Build a square that uses exactly 64 gold sheets. All 4 sides must be the same length.',
    sym:function(n,s){return 'Sheets laid: <b>'+n+'</b> of 64';},
    check:function(s){if(!s.n)return {ok:false};if(s.n>64)return {ok:false,text:'That is more than 64 sheets. Take some away.'};
      if(!s.rect)return {ok:false,text:'Keep going. A panel has no holes and straight sides.'};
      if(s.n===64&&s.w===s.h)return {ok:true,text:'A square that uses all 64 sheets. Every side is the same length.'};
      if(s.n===64)return {ok:false,text:'That uses 64 sheets, but it is a rectangle '+s.w+' by '+s.h+'. Make all 4 sides the same length.'};
      if(s.w===s.h)return {ok:false,text:'That is a square of '+s.n+' sheets. Make it bigger or smaller to use exactly 64.'};
      return {ok:false};},
    goalText:'A square of 64 gold sheets.',
    ask:[{q:'Each side of the square is',unit:'in',answer:8,
      mistakes:[{v:32,text:'32 + 32 = 64, but a square multiplies a side by itself. What number times itself makes 64?'},{v:16,text:'64 ÷ 4 shares the sheets over the 4 sides, but area is rows × sheets in each row. What number times itself makes 64?'},{v:4,text:'A square has 4 sides, but 4 is not how long each side is. What number times itself makes 64?'}],hint:'What number times itself makes 64? Count the sheets along one side of your square.'}],
    onDone:function(r){setJob('j3',r);}});
}
/* Lesson · Job 4: convert the side first (IP 3), both directions folded in (Bethany, 5 Nov 2026: "Go, but trim") */
function modelConvert(m){
  var S=store('g4-4-11-02-convert'),st=S.st;
  function check(){var A=OAOKit._ls('g4-4-11-02-convert-a',{}),B=OAOKit._ls('g4-4-11-02-convert-b',{});if(st.a&&st.b&&A.done&&B.done)setJob('j4',m);}
  function round(title,q1,ans1,mis1,cfg,flag){var w=sub(m),h=document.createElement('h5');h.className='cw-round';h.innerHTML=title;w.appendChild(h);
    var c=sub(w,'cw-conv'),gd=sub(w);gd.hidden=!st[flag];
    ask1(c,q1,ans1,mis1,'in',function(){st[flag]=1;S.save();gd.hidden=false;grid(gd,cfg);check();},'1 foot is 12 inches.',S.keep(flag+'v'));
    if(st[flag])grid(gd,cfg);}
  round('Round 1 · A drawer front: area <b>98 square inches</b>, one side <b>1 ft 2 in</b>. How long is the other side?','First, 1 ft 2 in =',14,
    [{v:3,text:'1 + 2 adds feet and inches. 1 foot is 12 inches, then 2 more.'},{v:12,text:'12 is only the foot. Add the 2 more inches.'}],
    {key:'g4-4-11-02-convert-a',unit:IN,cols:14,rows:10,n:98,mode:'rows',dimW:'1 ft 2 in',dimH:'? in',cell:26,
     todo:'Now both are in inches. Lay rows of 14 sheets until all 98 are used, or work it out your own way.',goalText:'All 98 sheets are laid, in full rows of 14.',askOnly:true,
     ask:[{q:'The other side is how many inches?',unit:'in',answer:7,mistakes:[{v:84,text:'98 − 14 subtracts. Ask: 14 times what number makes 98?'},{v:98,text:'98 is the area. Ask: 14 times what number makes 98?'},{v:49,text:'98 ÷ 2 uses only the 2 inches. The side is 14 inches: divide 98 by 14.'}],hint:'14 × ? = 98. Count your rows, or count up by 14s: 14, 28, 42, …'}],
     onDone:function(){check();}},'a');
  round('Round 2 · A shelf: area <b>117 square inches</b>, width <b>¾ ft</b>. How long is it?','First, ¾ ft =',9,
    [{v:3,text:'3 inches is one fourth of a foot. The width is three fourths: 3 of those parts.'},{v:4,text:'4 is the number of parts. Split 12 inches into 4 equal parts: each is 3 inches. Take 3 parts.'},{v:34,text:'¾ is a fraction of a foot. Split 12 inches into 4 equal parts, and take 3 of them.'}],
    {key:'g4-4-11-02-convert-b',unit:IN,cols:9,rows:15,n:117,mode:'rows',dimW:'¾ ft',dimH:'? in',cell:26,
     todo:'Now both are in inches. Lay rows of 9 sheets until all 117 are used, or work it out your own way.',goalText:'All 117 sheets are laid, in full rows of 9.',askOnly:true,
     ask:[{q:'The shelf is how many inches long?',unit:'in',answer:13,mistakes:[{v:108,text:'117 − 9 subtracts. Ask: 9 times what number makes 117?'},{v:39,text:'117 ÷ 3 uses 3 inches. The width is 9 inches: divide by 9.'},{v:1053,text:'117 × 9 multiplies. Ask: 9 times what number makes 117?'}],hint:'Split 117 into 90 and 27. 90 ÷ 9 = 10 and 27 ÷ 9 = 3.'}],
     onDone:function(){check();}},'b');
  check();
}
/* Lesson · Job 5: fix Bernardo's note (IP 5: he multiplied when he should divide) */
function modelFix(m){
  grid(m,{key:'g4-4-11-02-fix',unit:IN,cols:8,rows:12,n:72,mode:'rows',dimW:'8 in',dimH:'? in',cell:28,
    todo:'Each square is 1 inch. Lay rows of 8 sheets until all 72 are used, or work it out your own way.',goalText:'All 72 sheets are laid, in full rows of 8.',askOnly:true,
    ask:[{q:'The other side of the lid really is',unit:'in',answer:9,
      mistakes:[{v:576,text:'That is Bernardo\'s answer. 72 × 8 multiplies the area by a side. Ask: 8 times what makes 72?'},{v:64,text:'72 − 8 subtracts. Ask: 8 times what makes 72?'},{v:80,text:'72 + 8 adds. Ask: 8 times what makes 72?'}],hint:'8 × ? = 72. Count your rows, or think of your 8s facts.'}],
    onDone:function(r){setJob('j5',r);}});
}
/* Lesson · Job 6: two steps, the same area (IP 4 and 6): the first cartoon's area, then the second cartoon's length */
function modelCartoon(m){
  var S=store('g4-4-11-02-cartoon'),st=S.st,a=sub(m),b=sub(m);b.hidden=!st.a;
  var h=document.createElement('h5');h.className='cw-round';h.innerHTML='Step 1 · The first paper: <b>12 ft</b> long and <b>9 ft</b> wide';a.appendChild(h);
  ask1(a,'Area of the first paper:',108,[{v:21,text:'12 + 9 adds the sides. Area multiplies: length × width.'},{v:42,text:'42 is the distance around. Area is the square feet that cover it.'}],'square feet',function(){st.a=1;S.save();b.hidden=false;mk();},'12 × 9. Split 12 into 10 and 2: 10 × 9 and 2 × 9.',S.keep('av'));
  var h2=document.createElement('h5');h2.className='cw-round';h2.innerHTML='Step 2 · The second paper: <b>the same area</b>, but only <b>6 ft</b> wide';b.appendChild(h2);var gb=sub(b),made=false;
  function mk(){if(made)return;made=true;grid(gb,{key:'g4-4-11-02-cartoon-b',unit:FT,cols:6,rows:20,n:108,mode:'rows',dimW:'6 ft',dimH:'? ft',cell:22,
    todo:'Each square is 1 square foot. Lay rows of 6 until all 108 are used, or work it out your own way.',goalText:'All 108 square feet are laid, in full rows of 6.',askOnly:true,
    ask:[{q:'The second paper is how many feet long?',unit:'ft',answer:18,mistakes:[{v:12,text:'12 feet is the first paper. The second one is narrower, so it must be longer. 6 × ? = 108.'},{v:102,text:'108 − 6 subtracts. Ask: 6 times what makes 108?'},{v:648,text:'108 × 6 multiplies. Ask: 6 times what makes 108?'}],hint:'Split 108 into 90 and 18. 90 ÷ 6 = 15 and 18 ÷ 6 = 3.'}],
    onDone:function(r){setJob('j6',r);}});}
  if(st.a)mk();
}
/* Lesson · a free tile grid (for students' own tries, and the live board in the Do video) */
function modelFree(m){
  grid(m,{key:'g4-4-11-02-free',unit:IN,cols:20,rows:10,mode:'free',cell:28,
    todo:'Try any rectangle you like. Each square is 1 inch.',
    sym:function(n,s){return 'Tiles laid: <b>'+n+'</b>'+(s.rect&&n?' · a rectangle '+s.w+' in by '+s.h+' in':'');}});
}
function modelBonus(m){
  OAOKit.challenge(m,{key:'g4-4-11-02-bonus',title:'Bonus quest (optional): the long panel',
    text:'<p>A panel covers <strong>36 square inches</strong>. Its length is <strong>4 times</strong> its width. Both sides are whole inches. How long is the panel?</p><p>Type the length in inches.</p>',
    answer:12,unit:'in',hint:'List the rectangles with an area of 36: 1 by 36, 2 by 18, 3 by 12, 4 by 9, 6 by 6. Which one has a length 4 times its width?',
    explain:'<p>Try the pairs that multiply to 36. For 3 by 12, 3 × 4 = 12, so the length is 4 times the width. The panel is <strong>12 inches</strong> long and 3 inches wide. Check: 12 × 3 = 36. ✓</p>'});
}
/* Show What You Know · Prove It: two exact checks; the proof box below is for the reasoning */
function modelProve(m){var S=store('g4-4-11-02-prove'),b=sub(m,'cw-prove-nums');
  ask1(b,'The right way: 54 ÷ 6 =',9,[{v:48,text:'That is Bernardo\'s answer. He subtracted. Ask: 6 times what makes 54?'},{v:324,text:'54 × 6 multiplies. Ask: 6 times what makes 54?'}],'in',null,null,S.keep('d'));
  ask1(b,'Check: 9 × 6 =',54,[{v:15,text:'9 + 6 adds. Multiply to check: 9 rows of 6.'}],'square inches',null,null,S.keep('c'));
}
function bind(f){return function(m,a){api=a;return f(m);};}
return {
  id:'4.11.02', key:'g4-4-11-02', title:'Area of Rectangles, Part 2', unit:11, level:'Leonardo\'s Workshop', standard:'MA.4.GR.2.1', boss:null,
  problem:{title:'A Missing Side',text:'In each job, Leonardo knows the area and one side. He needs the other side before anyone cuts wood or lays a tile. Each job below uses today\'s math.',jobWord:'Workshop job',jobsTitle:'Workshop jobs'},
  jobs:[
    {id:'j1',t:'Find how long the storeroom floor is',w:'Warm-Up · The Storeroom Floor',go:'#mk-think',tab:'warmup',coins:0},
    {id:'j2',t:'Answer the Duke\'s letter',w:'Lesson · The Duke\'s Panel',go:'#mk-duke',tab:'learn',coins:0},
    {id:'j3',t:'Build a square of 64 sheets',w:'Lesson · A Square Panel',go:'#mk-square',tab:'learn',coins:0},
    {id:'j4',t:'Change the side first, then divide',w:'Lesson · Same Units First',go:'#mk-convert',tab:'learn',coins:0},
    {id:'j5',t:'Fix Bernardo\'s note',w:'Lesson · Bernardo\'s Note',go:'#mk-fix',tab:'learn',coins:0},
    {id:'j6',t:'Size the second drawing paper',w:'Lesson · The Big Drawing Paper',go:'#mk-cartoon',tab:'learn',coins:0}],
  hints:[
    {sel:'#mk-think .callout-think',rungs:['One row across the floor uses 7 tiles. Lay a row, then another. Keep going until the tiles run out.','Count by 7s as you lay rows: 7, 14, 21, … Stop when you reach 56. Each row is 1 foot of the length.','Here are different numbers: 24 tiles on a floor 4 ft wide make rows of 4. 4, 8, 12, 16, 20, 24 is 6 rows, so the floor is 6 ft long.']},
    {sel:'#mk-guided .activity-body > p',rungs:['Start with Step 1: press + Add a row, or drag across a row of 6. Keep going until the sheets run out.','Each row is 1 inch of the length. 6 × ? = 90 asks how many rows of 6 make 90.','Here are different numbers: 42 sheets in rows of 6 make 7 rows, because 6 × 7 = 42.']},
    {sel:'#mk-duke .activity-body > .mk-todo',rungs:['Lay one row of 4 sheets across the top. Then add rows.','Count by 4s as you add rows: 4, 8, 12, … until you reach 48.','Here are different numbers: 20 sheets in rows of 4 make 5 rows, so that panel is 5 inches long.']},
    {sel:'#mk-square .activity-body > .mk-todo',rungs:['Start with a row. How long must one row be?','Try numbers times themselves. 6 × 6 = 36 is too small. 9 × 9 = 81 is too big. Try the numbers in between.','Here are different numbers: a square of 16 sheets has sides of 4, because 4 × 4 = 16.']},
    {sel:'#mk-convert .activity-body > .mk-todo',rungs:['Look at the units. The area is in square inches. Is the side in inches?','1 foot is 12 inches. For a fraction of a foot, split 12 inches into equal parts.','Here are different numbers: area 30 square inches, one side ½ ft. ½ ft is 6 in, and 30 ÷ 6 = 5 in.']},
    {sel:'#mk-fix .activity-body > .mk-todo',rungs:['Bernardo knows the area and one side. Should he multiply or divide?','Ask: 8 times what makes 72? That is a division.','Here are different numbers: area 35 square inches, one side 5 in. 35 ÷ 5 = 7 in, not 35 × 5.']},
    {sel:'#mk-cartoon .activity-body > .mk-todo',rungs:['Step 1 is a plain area: length × width.','The second paper has the same area. Ask: 6 × ? = that area.','Here are different numbers: a 4 ft by 6 ft paper has an area of 24 square feet. The same area 3 ft wide is 8 ft long.']},
    {sel:'#tab-assignment .q-block',i:0,inside:true,rungs:['You know the area and one side. Ask: the side × ? = the area.','For a square, ask: what number times itself makes the area?','Here are different numbers: area 40 square cm and one side 5 cm. 40 ÷ 5 = 8 cm.']},
    {sel:'#tab-assignment .q-block',i:1,inside:true,rungs:['Change the side to inches first. 1 foot is 12 inches.','To find a fraction of a foot, split 12 inches into equal parts.','Here are different numbers: ½ ft is 6 in. An area of 48 square inches with a 6-inch side is 8 in long.']},
    {sel:'#tab-assignment .q-block',i:2,inside:true,rungs:['First find the area of the 8 in by 3 in rectangle.','The second rectangle has that same area. Ask: 2 × ? = that area.','Here are different numbers: a 5 by 2 rectangle has an area of 10. The same area with a side of 1 is 10 long.']}],
  writing:{
    'journal-notice':{min:6,chips:[{label:'I notice',words:['notice','see','7','56','tiles','tile','wide','feet','foot','ft','side','long','one side','question','?','missing']},{label:'I wonder',words:['wonder','how','which','why','?','if','what','long']}]},
    'journal-compare':{min:8,chips:[{label:'a Crew member\'s way',words:['atlas','felix','hazel','cora','rows','row','count','counted','7s','by 7','times','×','fact','divide','÷','picture','check','checked']},{label:'why it is like yours',words:['because','like','same','i did','i also','me too','my way','mine']}]},
    'journal-fix':{min:10,chips:[{label:'the mistake',words:['multiplied','multiply','times','×','576','wrong','should','not times','instead']},{label:'the fix',words:['divide','divided','÷','9','8 ×','what times','check']}]},
    'journal-big':{min:12,chips:[{label:'side × ? = area',words:['times','×','?','what number','missing','side','factor']},{label:'divide, then check',words:['divide','divided','÷','check','multiply','multiplied']},{label:'an example of your own',words:['ft','in','cm','m','foot','inch','=','sq']}]},
    'journal-prove':{min:12,chips:[{label:'what Bernardo did wrong',words:['subtract','subtracted','minus','−','-','take away','took away','wrong','48']},{label:'the right way and the check',words:['divide','÷','9','times','×','multiply','check','54']}]}},
  bigIdea:'To find a missing side, ask: the side I know × ? = the area. Divide the area by the side you know, then multiply to check. If the side and the area use different units, change the side first (feet to inches). The missing side is a length, in inches or feet.',
  words:[{w:'missing factor',d:'the unknown number in a fact like 7 × ? = 56'},{w:'square foot',d:'a square 1 foot on each side, used to measure area'},{w:'convert',d:'change a measurement to a different unit, like feet to inches'}],
  intendedWrong:['72 × 8 = 576 in','54 − 6 = 48'],
  models:{mental:bind(modelMental),think:bind(modelThink),guided:bind(modelGuided),duke:bind(modelDuke),square:bind(modelSquare),convert:bind(modelConvert),fix:bind(modelFix),cartoon:bind(modelCartoon),prove:bind(modelProve),free:bind(modelFree),bonus:bind(modelBonus)}
};
})();
window.CW_ONDONE=function(){};
