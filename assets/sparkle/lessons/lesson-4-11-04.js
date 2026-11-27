/* built by tools/sparkle/build_lesson.py from tools/sparkle/lessons/11-04 — edit there, not here */
window.PQ_VIDEO={"lesson": "11.04", "grade": 4, "prefix": "g4math-11-04", "manifestKey": "g4math-11-04", "title": "Perimeter, Part 1", "other": [], "pics": {}, "redo": [], "slots": {"learn": {"label": "Lesson · the main video: walk every side, and work backward (produced: Claire + Leonardo)", "title": "Walk Every Side: Perimeter, and a Missing Side", "length": "about 2½ min", "want": true, "produced": true, "where": "Lesson tab, Learn it station, top", "parts": [{"label": "The rose bed", "tag": "LEARN", "title": "18 ft × 6 ft", "col": "#3A6B9A", "body": "Walk every side once and add. Then add one of each and double."}, {"label": "The herb bed", "tag": "BACKWARD", "title": "52 ft of fencing, long side 17 ft", "col": "#9E4552", "body": "Take the two long sides away, then halve what is left."}], "script": "[Leonardo] Come out to the garden. The Duke sent fencing for a rose bed, and I must know how much before the gardener digs. A careful worker knows before he starts. Would you?\n\n[ON SCREEN: The rose bed]\nHere is the rose bed, 18 feet long and 6 feet wide. The fence does not cover the bed. It goes around the edge. That distance all the way around is the perimeter.\n\nWalk it with me. Top, 18. Side, 6. Bottom, 18. Last side, 6. Back where we started.\n\nAdd every side once. 18 plus 6 plus 18 plus 6 is 48. The fence is 48 feet.\n\nNow a quicker way. Opposite sides of a rectangle match, so one long side and one short side is exactly half the way around. 18 plus 6 is 24. Double it. 48 again.\n\nSay the units carefully. 48 feet, not 48 square feet. Perimeter is a length.\n\n[ON SCREEN: The herb bed]\nNow backward. The Duke sends 52 feet of fencing for the herb bed, and the long side must be 17 feet. How long is the short side?\n\nTwo long sides use 17 and 17, which is 34. Take it away. 52 minus 34 is 18.\n\nThose 18 feet belong to the two short sides, and they share them evenly. 18 divided by 2 is 9.\n\nWatch out. Do not stop at 18. That is both short sides together, not one.\n\nOr halve first. Half of 52 is 26. Half a fence is one long side and one short side. 26 minus 17 is 9. The same answer.\n\nSo: walk every side once and add. Or add the length and the width and double. For a missing side, take away the sides you know, then halve what is left.\n\n[Leonardo] Nine feet. The gardener may dig. Next the Duke wants a pen that bends around the old well, with sides that carry no number. Your turn first: 24 feet of fencing, long side 7 feet. Find the short side."}}};
/* Lesson 4.11.04 · Perimeter Part 1 · the classical-guide layer (Leonardo da Vinci, Milan 1495)
   Dimensions 4B Ch 11 Lesson 4 (perimeter of rectangles; a missing side from the perimeter. M1: take both given lengths
   away, then halve what is left. M2: half the perimeter = length + width, then subtract) + the IP (the IP wins).
   The old page solved five of five IP sections word for word; every one of those spots has new numbers here.
   No IP problem and no single IP fact (12+6+12+6, 4×8, 15+7+15+7, 2×(9+4)=26, 4×7, 2×(20+13), 40−14, 26÷2, 160−90,
   70÷2, 136÷4, 12×7, 2×(12+7)=38, 84÷12, 136−80, 56÷2, 40×28, 34×34) appears where students are taught.
   The tool is the Fence Builder (OAOKit.fenceBuilder): rails laid one unit at a time, like the guide's toothpicks. */
var CW_DATA = {
  key:'g4-4-11-04', room:'garden',
  place:{t1:'MILAN, ITALY · 1495'},
  windows:{
    /* Warm-Up opener: the castle garden at first light. The guide's Think: fence a garden with a set length of fencing. */
    garden:{title:'The Duke\'s Garden', sub:'Thirty feet of fencing, and two plans', play:'Step into the garden',
      alt:'The garden behind the Duke of Milan\'s castle, early morning. A rectangle of ground is staked out along a long stone wall. A coil of fencing lies on the grass with a tag reading 30 feet. Bernardo stands by the gardener\'s board, where two garden plans are drawn.',
      people:['leo'],
      objects:[{id:'plot',kind:'plot',x:104,y:124,w:68,h:14,name:'the staked ground',dims:{w:'11 ft'}}],
      exploreText:'Click the 2 things that glow gold to look up close.',
      spots:[
        {id:'wall',label:'The stone wall',x:96,y:50,w:80,h:20,zoom:1.5,
         lines:['The Duke\'s wall. The garden runs right along it.','That long side is 11 feet. The gardener measured it twice.']},
        {id:'coil',label:'The fencing',x:146,y:132,w:30,h:26,zoom:1.7,
         card:'<b class="h">The coil of fencing</b>It is one long roll, 30 feet of it. On your page it comes apart into rails. Each rail is 1 foot long, and a rail looks like this.<div class="cw-leaf"><div class="rail"><span class="side b">1 ft</span></div></div>',
         lines:['Thirty feet of fencing. Not one foot more.']}],
      script:[
        {w:'leo',t:'Buongiorno! Out here with me today. The Duke wants a garden.'},
        {explore:{need:2}},
        {narr:'Boots on the gravel. Bernardo comes around the hedge.'},
        {enter:'bern'},
        {w:'bern',t:'Master Leonardo! The gardener drew two plans. Both use every foot of the fencing.'},
        {card:'<b class="h">The gardener\'s board</b><span class="hand">Plan A: a long thin garden along the wall.<br>Plan B: a garden almost square.<br>Both use all 30 feet of fencing.</span>'},
        {focus:['plot']},{tags:['plot:name','plot:w']},
        {w:'leo',t:'The same fence, bent two different ways. One is long and thin. One is almost a square.'},
        {prompt:'Which plan do you think holds more plants? Pick what you think now. You will find out soon.',save:'predict',choice:[
          {id:'thin',say:'The long thin one.',then:[{w:'leo',t:'Maybe. It does stretch a long way.'}]},
          {id:'square',say:'The almost-square one.',then:[{w:'leo',t:'Maybe. It does look fatter.'}]},
          {id:'same',say:'The same. The fence is the same.',then:[{w:'leo',t:'That would be tidy. Let\'s see if it is true.'}]},
          {id:'unsure',say:'I\'m not sure yet.',then:[{w:'leo',t:'Good. "Not sure yet" is a fine place to start.'}]}]},
        {w:'leo',t:'First, the plan along the wall. Thirty feet of fencing, and the long side is eleven.',wonder:'If both long sides are 11 feet, how much fencing is left for the two short sides?'},
        {w:'leo',t:'Let\'s find out how long the short side has to be.'}],
      end:{task:'Find the short side of the garden. There is <b>30 ft</b> of fencing, and the long side is <b>11 ft</b>. Every foot must be used.',
        go:{tab:'warmup',sel:'#mk-think',label:'Go to the garden ↓'}}},

    /* Lesson, before Job 5: Bernardo fenced two sides and called it done (the trap the quicker way sets) */
    note:{title:'Bernardo\'s Note', sub:'Something is wrong. What?', play:'Back to the garden',
      alt:'Bernardo holds a note beside a bed of bay trees staked out as a square. A short run of fence stands along two sides of it. The other two sides are open ground.',
      people:['leo','bern'],
      objects:[{id:'plot',kind:'plot',x:112,y:122,w:46,h:16,name:'the bay tree bed'}],
      script:[
        {w:'bern',t:'Master Leonardo, I worked out the bay tree bed. It is a square.'},
        {card:'<b class="h">Bernardo\'s note</b><span class="hand">Fencing: 48 ft. The bed is a square.<br>48 ÷ 2 = 24.<br>Each side is 24 ft.<br>— Bernardo</span>'},
        {focus:['plot']},{tags:['plot:name']},
        {w:'leo',t:'You halved the fencing. I can see why. Half of forty-eight is twenty-four.'},
        {w:'bern',t:'And a square is a square! So every side is twenty-four.'},
        {w:'leo',t:'Walk it with me. One side, two sides, three sides…',wonder:'How many sides does a square have? How many did Bernardo pay for?'},
        {w:'leo',t:'I think I see it. Do you?'}],
      end:{task:'Find Bernardo\'s mistake. Then find how long each side of the square bed really is.',
        go:{tab:'learn',sel:'#mk-fix',label:'Go to the note ↓'}}},

    /* Show What You Know, at the end: the garden is fenced; the Duke's hounds set up 4.11.05 (composite perimeter) */
    wrap:{title:'The Garden Is Fenced', sub:'And a letter arrives', play:'Back to the garden',
      alt:'Leonardo and Bernardo beside the finished garden fence in the evening light. A messenger has left a letter from the Duke of Milan about a pen for his hunting hounds.',
      people:['leo','bern'],
      objects:[{id:'plot',kind:'plot',x:104,y:124,w:68,h:14,name:'the garden'}],
      script:[
        {w:'bern',t:'Done! Every rail used, and the fence meets itself at the corner.'},
        {w:'leo',t:'Because you walked every side once. That is all a perimeter is.'},
        {w:'bern',t:'Another letter came while we worked.'},
        {card:'<b class="h">A letter from the Duke</b><span class="hand">Leonardo, my hounds need a pen. It must bend around the old well, so it will not be a plain rectangle. How much fence must I buy?<br>— Ludovico, Duke of Milan</span>'},
        {w:'leo',t:'A shape that bends. Some of its sides will have no number on them at all. That is next time.'}],
      end:{lead:'📜 Next time',task:'In the next lesson, you will find the distance around a shape that bends around a corner, where some sides have no number written on them.',
        go:{tab:'assignment',sel:'#mk-next',label:'See what\'s next ↓'}}}
  },
  /* the guide on the lift: a tip for the part of the page you are on, and a question to ask him. Hints, never answers. */
  guide:{who:'leo',name:'Leonardo',role:'Painter and inventor',ride:'lift',
    hello:'Buongiorno! That means good morning. I am up here if you need me.',
    top:'Buongiorno!',bottom:'Ben fatto! Well done!',
    /* one keepsake per lesson (11.01 Mona Lisa, 11.02 flying machine, 11.03 notebook) */
    decor:[{at:0.45,kind:'horse',say:'The Duke\'s great horse. I built the whole thing in clay first, bigger than a house.'}],
    tabs:{
      warmup:{say:'Warm up your brain first. A gardener sharpens his tools first, too.',
        ask:[{q:'Why are there doubles and halves in the facts?',a:'Today you will double a lot and halve a lot. A rectangle has two of every side.'}]},
      learn:{say:'One station at a time. Use the bar at the top to see where you are.',
        ask:[{q:'What are the three stations?',a:'Learn it, Practice together, and On your own. Finish one, then press Next station.'}]},
      assignment:{say:'Now you show what you know. Ask yourself each time: around the edge, or inside?',
        ask:[{q:'How do I know which units to use?',a:'If you are walking the edge, use plain units. If you are covering the inside, use square units.'}]}},
    spots:[
      {sel:'.fluency-box',say:'The sixes, and some doubles and halves. You will use all of them today.',
        ask:[{q:'Why doubles?',a:'A rectangle has two long sides and two short sides. Doubling saves you steps.'}]},
      {sel:'#mk-mental',say:'Split the number into tens and ones, then double each part.',
        ask:[{q:'Why does splitting work?',a:'Double 20 and double 3 is the same as double 23. The parts add back up.'}]},
      {sel:'.mk-board-mount',say:'These are today\'s garden jobs. Each one uses the same big idea.',
        ask:[{q:'Do I have to do the jobs in order?',a:'Yes, please. Each job gets you ready for the next one.'}]},
      {sel:'#mk-think',say:'Look at the fencing and the long side. What do you notice?',
        ask:[{q:'Can I lay the rails myself?',a:'Yes! Tap a gap in the fence to lay a rail, or use the buttons under the picture.'},
             {q:'Where do I start?',a:'Lay the two long sides first. Then look at what is left on the coil.'}]},
      {sel:'#mk-ways',say:'Four friends, four ways. Which one is like yours?',
        ask:[{q:'Which way is the right way?',a:'All four ways work. Pick the one that makes the most sense to you, and say why.'}]},
      {sel:'#mk-guided',say:'Your turn. One step at a time.',
        ask:[{q:'How much is left for the short sides?',a:'Lay both long sides first. The coil tells you what is left, and the two short sides share it.'}]},
      {sel:'#mk-key',say:'These are my measuring rules. I keep them in my notebook.',
        ask:[{q:'Why can I double instead of adding four numbers?',a:'Opposite sides of a rectangle are the same length. One long side and one short side is exactly half the way around.'}]},
      {sel:'#mk-worked',say:'Read this one slowly. It is already solved, two ways.',
        ask:[{q:'Why are there two ways?',a:'To show you they give the same answer. Use the one with fewer steps for you.'}]},
      {sel:'#mk-walk',say:'Three beds, three fences. Walk every side once.',
        ask:[{q:'What about the square?',a:'All four sides of a square are the same length. So one side, four times.'}]},
      {sel:'#mk-back',say:'Now backward: you know the fence, you need a side.',
        ask:[{q:'What do I take away first?',a:'The two sides you already know. What is left belongs to the other two, and they share it evenly.'}]},
      {sel:'#mk-mix',say:'One bed, two questions: around it, and inside it.',
        ask:[{q:'What is the difference again?',a:'Around the edge is perimeter, in plain units. Covering the inside is area, in square units.'}]},
      {sel:'#mk-fix',say:'Bernardo made a mistake. Can you find it?',
        ask:[{q:'How many sides does a square have?',a:'Four, and they are all the same length. Count them on the picture before you divide.'}]},
      {sel:'#mk-onepic',say:'The whole lesson in one picture.',
        ask:[{q:'How do I say the big idea?',a:'Try: walk every side once and add. Or add one of each and double.'}]},
      {sel:'#mk-prove',say:'Prove it! The same fence, two different gardens.',
        ask:[{q:'What makes a good proof?',a:'Show both gardens with real numbers. If the ground they hold is different, you have proved it.'}]}
    ]}
};

var PQ_LESSON=(function(){
var api;
function setJob(id,src){api.setJob(id,src);}
function fence(m,cfg){return OAOKit.fenceBuilder(m,cfg);}
function sub(m,cls){var d=document.createElement('div');d.className=cls||'';m.appendChild(d);return d;}
function head(m,text){var h=document.createElement('h5');h.className='cw-round';h.innerHTML=text;m.appendChild(h);return h;}
var FT={s:'ft',one:'foot',many:'feet'},M={s:'m',one:'meter',many:'meters'},CM={s:'cm',one:'centimeter',many:'centimeters'};
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
function done(k){var A=OAOKit._ls(k,{});return !!(A&&A.done);}
/* a set of ask1 boxes that counts itself: the job is finished when every box is right */
function asks(m,key,list,onAll){
  var S=store(key),n=0,el=sub(m,'cw-asks');
  list.forEach(function(q,i){
    ask1(el,q.q,q.a,q.m,q.u,function(){n++;if(n>=list.length){S.st.done=true;S.save();if(onAll)onAll();}},q.hint,S.keep('b'+i));
    if(S.keep('b'+i).get()!=null&&+S.keep('b'+i).get()===q.a)n++;});
  if(n>=list.length){S.st.done=true;S.save();if(onAll)onAll();}
  return el;}

/* Warm-Up · Mental Math: double a 2-digit number by splitting it (a known strategy, Unit 4). It is the quicker way in numbers. */
function modelMental(m){
  OAOKit.mentalMath(m,{key:'g4-4-11-04-mm',name:'Double it, part by part',
    how:'To double a 2-digit number in your head, split it into tens and ones. Double each part, then put the parts back together.',
    example:{q:'Double 14',bond:{whole:14,parts:[10,4]},steps:['Split 14 into 10 and 4.','Double 10 is 20. Double 4 is 8.','20 + 8 = 28. So double 14 is 28.']},
    work:'bond',
    problems:[{q:'Double 23',a:46,hint:'Split 23 into 20 and 3. Double 20 is 40, double 3 is 6. Add them.'},
              {q:'Double 27',a:54,hint:'Split 27 into 20 and 7. Double 20 is 40, double 7 is 14. Add them.'},
              {q:'Double 31',a:62,hint:'Split 31 into 30 and 1. Double 30 is 60, double 1 is 2. Add them.'}]});
}
/* Warm-Up · Think: 30 ft of fencing, long side 11 ft. Any method; no rule is taught here. */
function modelThink(m){
  fence(m,{key:'g4-4-11-04-think',unit:FT,mode:'missing',total:30,known:11,cell:26,askNow:true,name:'garden',
    todo:'<b>The Duke\'s garden.</b> Each rail is 1 foot of fence. Tap a gap to lay a rail, or use the buttons. Use every foot of the fencing.',
    mistakes:{two:[{v:30,text:'30 feet is ALL the fencing. The two long sides are only part of it.'}],
              short:[{v:11,text:'11 feet is the long side. The short side is shorter, or the garden would be a square.'},
                     {v:19,text:'That takes one long side away from the fencing. There are two long sides, and then two short ones.'}]},
    goalText:'The garden closes! Every foot of fencing is used.',
    doneText:'The short side is 4 feet. The garden is 11 feet by 4 feet, and 11 + 4 + 11 + 4 = 30.',
    onDone:function(){setJob('j1',m);}});
  if(done('g4-4-11-04-think'))setJob('j1',m);
  /* the payoff, only after the Think is solved: the gardener's other plan, the same 30 ft, more ground inside */
  var same=sub(m,'cw-same36');same.hidden=true;
  var PRED={thin:'Before you worked it out, you thought the long thin garden would hold more.',
            square:'Before you worked it out, you thought the almost-square garden would hold more. You were right!',
            same:'Before you worked it out, you thought they would hold the same.',
            unsure:'Before you worked it out, you weren\'t sure.'};
  var Z=12;
  function plan(w,h,fill){var S='<svg viewBox="0 0 '+(11*Z+16)+' '+(8*Z+16)+'" role="img" aria-label="A garden '+w+' feet by '+h+' feet drawn on a grid.">';
    S+='<rect x="8" y="8" width="'+(w*Z)+'" height="'+(h*Z)+'" fill="'+fill+'" stroke="#0E1C42" stroke-width="2.5"/>';
    for(var x=1;x<w;x++)S+='<line x1="'+(8+x*Z)+'" y1="8" x2="'+(8+x*Z)+'" y2="'+(8+h*Z)+'" stroke="#B9D4C0" stroke-width="1"/>';
    for(var y=1;y<h;y++)S+='<line x1="8" y1="'+(8+y*Z)+'" x2="'+(8+w*Z)+'" y2="'+(8+y*Z)+'" stroke="#B9D4C0" stroke-width="1"/>';
    return S+'</svg>';}
  same.innerHTML='<div class="cw-predict" hidden><canvas width="32" height="32" aria-hidden="true"></canvas><p></p></div>'
    +'<div class="cw-same-h">🔁 The same 30 feet of fence, two gardens</div>'
    +'<div class="cw-two"><div>'+plan(11,4,'#EAF6EC')+'<p><b>Plan A:</b> 11 ft by 4 ft. The fence is 11 + 4 + 11 + 4 = <b>30 ft</b>. The ground inside is 11 × 4 = <b>44 square feet</b>.</p></div>'
    +'<div>'+plan(8,7,'#FFF1BF')+'<p><b>Plan B:</b> 8 ft by 7 ft. The fence is 8 + 7 + 8 + 7 = <b>30 ft</b>. The ground inside is 8 × 7 = <b>56 square feet</b>.</p></div></div>'
    +'<p class="cw-same-q"><b>Think:</b> The fence is exactly the same. What changed? What stayed the same?</p>';
  function predict(){var pr=OAOKit._ls('g4-4-11-04-predict',null),box=same.querySelector('.cw-predict');
    if(!pr||!PRED[pr.id])return;
    box.querySelector('p').innerHTML='<b>Leonardo:</b> '+PRED[pr.id]+' Plan A holds 44 square feet. Plan B holds 56. What do you think now?';
    box.hidden=false;var pc=box.querySelector('canvas');if(pc&&window.CWART)CWART.portrait(pc,'leo',true);}
  (function wait(){if(done('g4-4-11-04-think')){same.hidden=false;predict();return;}setTimeout(wait,700);})();
}
/* Lesson · Your Turn (the tool's own gates): the herb bed, 24 ft of fencing, long side 7 ft → 5 ft */
function modelGuided(m){
  fence(m,{key:'g4-4-11-04-guided',unit:FT,mode:'missing',total:24,known:7,cell:26,name:'herb bed',
    todo:'<b>Step 1.</b> Lay both long sides. <b>Step 2.</b> Look at what is left on the coil. <b>Step 3.</b> Share it between the two short sides.',
    mistakes:{two:[{v:24,text:'24 feet is all the fencing. The two long sides use only part of it.'}],
              left:[{v:17,text:'That takes away ONE long side. Take both of them away.'}],
              short:[{v:10,text:'10 feet is what is left for BOTH short sides. They share it.'}]},
    goalText:'The herb bed closes. Every foot used.',
    doneText:'Each short side is 5 feet. 7 + 5 + 7 + 5 = 24.'});
}
/* Lesson · Job 2: three beds (IP 1 and IP 2: add every side, then the quicker way) */
function modelWalk(m){
  var a=sub(m),b=sub(m),c=sub(m);
  head(a,'Round 1 · The vegetable bed, 14 m by 6 m');
  head(b,'Round 2 · The mint bed, a square 5 m on every side');
  head(c,'Round 3 · The flower bed, 18 ft by 7 ft');
  var ga=sub(a),gb=sub(b),gc=sub(c);
  b.hidden=!done('g4-4-11-04-walk-a');c.hidden=!done('g4-4-11-04-walk-b');
  var madeB=false,madeC=false;
  function all(){if(done('g4-4-11-04-walk-a')&&done('g4-4-11-04-walk-b')&&done('g4-4-11-04-walk-c'))setJob('j2',m);}
  function mkC(){if(madeC)return;madeC=true;c.hidden=false;
    fence(gc,{key:'g4-4-11-04-walk-c',unit:FT,mode:'walk',w:18,h:7,cell:20,name:'flower bed',
      todo:'This time, try the quicker way: add one long side and one short side, then double it. Lay the fence to check yourself.',
      ask:[{id:'half',q:'One long side and one short side: 18 + 7 =',unit:'ft',answer:25,
             mistakes:[{v:50,text:'That is already doubled. First add just the two numbers.'}],hint:'Add the length and the width.'},
           {id:'p',q:'Double it. The fence all the way around =',unit:'ft',answer:50,
             mistakes:[{v:25,text:'25 feet is only half the way around. Double it.'},
                       {v:126,text:'126 is 18 × 7, the ground inside. Perimeter is the edge.'}],hint:'Double 25: double 20 is 40, double 5 is 10.'}],
      doneText:'50 feet, and only two numbers to add. That is the quicker way.',onDone:all});}
  function mkB(){if(madeB)return;madeB=true;b.hidden=false;
    fence(gb,{key:'g4-4-11-04-walk-b',unit:M,mode:'walk',w:5,h:5,cell:26,name:'mint bed',
      todo:'A square. Lay the fence all the way around, then add every side.',
      ask:[{id:'p',q:'The fence all the way around =',unit:'m',answer:20,
             mistakes:[{v:25,text:'25 is 5 × 5, the ground inside. Perimeter is the edge: add the four sides.'},
                       {v:10,text:'That is two sides. A square has four.'}],hint:'5 + 5 + 5 + 5. Or double 5, then double again.'}],
      doneText:'20 meters. A square is the easy one: one side, four times.',onDone:function(){mkC();all();}});}
  fence(ga,{key:'g4-4-11-04-walk-a',unit:M,mode:'walk',w:14,h:6,cell:22,name:'vegetable bed',
    todo:'Lay a rail on every side of the bed, then add every side once.',
    ask:[{id:'p',q:'The fence all the way around =',unit:'m',answer:40,
           mistakes:[{v:84,text:'84 is 14 × 6, the ground inside the bed. Perimeter is the distance around the edge.'},
                     {v:20,text:'That is one long side and one short side. That is only half the way around.'}],
           hint:'14 + 6 + 14 + 6. Walk every side once.'}],
    doneText:'40 meters of fence.',onDone:function(){mkB();all();}});
  if(done('g4-4-11-04-walk-a'))mkB();
  if(done('g4-4-11-04-walk-b'))mkC();
  all();
}
/* Lesson · Job 3: working backward (IP 3). Round 1 on the tool, then two on paper. */
function modelBack(m){
  var a=sub(m),b=sub(m);
  head(a,'Round 1 · 30 cm of edging, one side 4 cm');
  var ga=sub(a);b.hidden=!done('g4-4-11-04-back-a');var made=false;
  function both(){if(done('g4-4-11-04-back-a')&&done('g4-4-11-04-back-b'))setJob('j3',m);}
  function mkB(){if(made)return;made=true;b.hidden=false;
    head(b,'Round 2 · Two more, without the rails');
    var p=document.createElement('p');p.className='cw-round-note';
    p.innerHTML='Now do the same thinking on paper. <b>(a)</b> A bed has <b>150 cm</b> of edging and one side is <b>48 cm</b>. '
      +'<b>(b)</b> A <b>square</b> bed has <b>92 cm</b> of edging.';
    b.appendChild(p);
    asks(b,'g4-4-11-04-back-b',[
      {q:'(a) The two sides you know use',a:96,u:'cm',m:[{v:48,text:'That is one of them. There are two sides of 48 cm.'}],hint:'48 + 48.'},
      {q:'(a) What is left for the other two sides?',a:54,u:'cm',m:[{v:102,text:'That takes away only one 48. Take both away.'}],hint:'150 − 96.'},
      {q:'(a) So the other side is',a:27,u:'cm',m:[{v:54,text:'54 cm is what is left for BOTH sides. They share it.'}],hint:'Halve 54.'},
      {q:'(b) One side of the square bed is',a:23,u:'cm',m:[{v:46,text:'That halves it once. A square has four sides, not two.'},
        {v:88,text:'That takes 4 away instead of sharing into 4. Split the edging between four equal sides.'}],hint:'A square has four sides the same. Share 92 between four.'}],both);}
  fence(ga,{key:'g4-4-11-04-back-a',unit:CM,mode:'missing',total:30,known:4,cell:22,name:'bed',
    todo:'The short side is 4 cm and there is 30 cm of edging in all. Lay it and find the long side.',
    mistakes:{two:[{v:30,text:'30 cm is all the edging. The two sides you know use only part of it.'}],
              short:[{v:22,text:'22 cm is what is left for BOTH of the other sides. They share it.'}]},
    goalText:'It closes! Every centimeter used.',
    doneText:'The other side is 11 cm. 4 + 11 + 4 + 11 = 30.',
    onDone:function(){mkB();both();}});
  if(done('g4-4-11-04-back-a'))mkB();
  both();
}
/* Lesson · Job 4: around it and inside it (IP 4) */
function modelMix(m){
  var p=document.createElement('p');p.className='cw-round-note';
  p.innerHTML='<b>Bed A</b> is <b>17 ft</b> long and <b>6 ft</b> wide. <b>Bed B</b> covers <b>54 square centimeters</b> and is <b>9 cm</b> long.';
  m.appendChild(p);
  asks(m,'g4-4-11-04-mix',[
    {q:'Bed A, the ground inside =',a:102,u:'sq ft',m:[{v:46,text:'46 feet is the distance around the edge. The ground inside is length × width.'}],hint:'17 × 6. Split 17 into 10 and 7.'},
    {q:'Bed A, the fence around it =',a:46,u:'ft',m:[{v:102,text:'102 is the ground inside, in square feet. The fence goes around the edge.'},
      {v:23,text:'23 feet is one long side and one short side. That is half the way around.'}],hint:'17 + 6 = 23, then double it.'},
    {q:'Bed B, how wide is it?',a:6,u:'cm',m:[{v:45,text:'That subtracts. The ground inside is length × width, so work backward with division.'}],hint:'What number times 9 makes 54?'},
    {q:'Bed B, the fence around it =',a:30,u:'cm',m:[{v:15,text:'15 cm is one long side and one short side. Double it.'},
      {v:54,text:'54 is the ground inside, in square centimeters.'}],hint:'9 + 6 = 15, then double it.'}],
    function(){setJob('j4',m);});
}
/* Lesson · Job 5: Bernardo halved instead of quartering (IP 5: a square from its perimeter, then the same fence as a rectangle) */
function modelFix(m){
  var p=document.createElement('p');p.className='cw-round-note';
  p.innerHTML='Bernardo has <b>48 ft</b> of fencing for a <b>square</b> bed. His note says 48 ÷ 2 = 24, so every side is 24 ft.';
  m.appendChild(p);
  asks(m,'g4-4-11-04-fix',[
    {q:'Each side of the square bed is really',a:12,u:'ft',m:[{v:24,text:'That is Bernardo\'s answer. Walk a square with 24-foot sides: 24 + 24 + 24 + 24 is 96 ft, far more fencing than he has.'},
      {v:44,text:'That takes 4 away. The four sides share the fencing, so split it between them.'}],hint:'A square has four equal sides. Share 48 between four.'},
    {q:'So the square bed holds',a:144,u:'sq ft',m:[{v:48,text:'48 is the fencing around the edge. The ground inside is side × side.'}],hint:'12 × 12.'},
    {q:'Same 48 ft of fencing, but 16 ft long. How wide?',a:8,u:'ft',m:[{v:32,text:'32 ft is what is left for BOTH short sides. They share it.'},
      {v:12,text:'12 ft is the square bed\'s side. This bed is longer, so it must be narrower.'}],hint:'Two long sides use 32 ft. What is left, shared between two?'},
    {q:'And that bed holds',a:128,u:'sq ft',m:[{v:144,text:'144 is the square bed. This one is 16 by 8.'}],hint:'16 × 8.'}],
    function(){setJob('j5',m);});
}
/* Show What You Know · the optional bonus: the guide's toothpick puzzle, on the Fence Builder */
function modelBonus(m){
  var wrap=sub(m,'key-concept pq-bonus');
  wrap.innerHTML='<div class="key-concept-label">⭐ Bonus (optional): twelve rails</div>'
    +'<p>Leonardo hands Bernardo <b>12 rails</b> of fence, each 1 foot long. Every rail has to be used, and the garden has to be a rectangle. '
    +'<b>Build three different gardens. Which one holds the most ground? Which holds the least?</b></p>';
  var g=sub(wrap);
  fence(g,{key:'g4-4-11-04-bonus',unit:FT,mode:'free',rails:12,record:true,need:3,cell:24,name:'garden',
    todo:'Build a garden that uses all 12 rails. Then take the fence down and build a different one.',
    doneText:'Three gardens, the same 12 rails: 5, 8 and 9 square feet. The closer a rectangle gets to a square, the more it holds.'});
}
/* Show What You Know · Prove It: the same fence, two different gardens */
function modelProve(m){
  asks(m,'g4-4-11-04-prove',[
    {q:'The 8-foot garden: how wide is it?',a:2,u:'ft',m:[{v:12,text:'That is what is left for BOTH short sides. They share it.'},
      {v:6,text:'That takes one long side away. There are two long sides of 8 ft.'}],hint:'Two long sides use 16 ft of the 20. What is left, shared between two?'},
    {q:'So the 8-foot garden holds',a:16,u:'sq ft',m:[{v:20,text:'20 ft is the fence around the edge. The ground inside is length × width.'}],hint:'8 × 2.'},
    {q:'The 6-foot garden: how wide is it?',a:4,u:'ft',m:[{v:8,text:'That is what is left for BOTH short sides.'}],hint:'Two long sides use 12 ft. What is left, shared between two?'},
    {q:'So the 6-foot garden holds',a:24,u:'sq ft',m:[{v:16,text:'16 is the first garden. This one is 6 by 4.'}],hint:'6 × 4.'}]);
}
function bind(f){return function(m,a){api=a;return f(m);};}
return {
  id:'4.11.04', key:'g4-4-11-04', title:'Perimeter, Part 1', unit:11, level:'The Duke\'s Garden', standard:'MA.4.GR.2.1', boss:null,
  problem:{title:'Walk Every Side Once',text:'In each job, something needs a fence, an edging or a ribbon around its edge. Leonardo walks every side once. Each job below uses today\'s math.',jobWord:'Garden job',jobsTitle:'Garden jobs'},
  jobs:[
    {id:'j1',t:'Find the short side of the Duke\'s garden',w:'Warm-Up · The Duke\'s Garden',go:'#mk-think',tab:'warmup',coins:0},
    {id:'j2',t:'Fence three beds',w:'Lesson · Fence Three Beds',go:'#mk-walk',tab:'learn',coins:0},
    {id:'j3',t:'Work backward to a missing side',w:'Lesson · Working Backward',go:'#mk-back',tab:'learn',coins:0},
    {id:'j4',t:'Find what goes around a bed and what it holds',w:'Lesson · Around It and Inside It',go:'#mk-mix',tab:'learn',coins:0},
    {id:'j5',t:'Fix Bernardo\'s note',w:'Lesson · Bernardo\'s Note',go:'#mk-fix',tab:'learn',coins:0}],
  hints:[
    {sel:'#mk-think .callout-think',rungs:['Lay the two long sides first. Then look at the coil: how much fencing is left?',
      'What is left belongs to the two short sides, and they are the same length. So they share it.',
      'Here are different numbers: 18 ft of fencing with a long side of 6 ft. Two long sides use 12, leaving 6. Each short side is 3 ft.']},
    {sel:'#mk-guided .activity-body > p',rungs:['Lay both long sides of the herb bed first.',
      'Take the two long sides away from all the fencing. Then halve what is left.',
      'Here are different numbers: 20 ft of fencing with a long side of 8 ft. 20 − 16 = 4, and 4 ÷ 2 = 2 ft.']},
    {sel:'#mk-walk .activity-body > .mk-todo',rungs:['Start at one corner and walk all the way around, back to where you started.',
      'Add every side once: length + width + length + width.',
      'Here are different numbers: a bed 9 m by 3 m. 9 + 3 + 9 + 3 = 24 meters.']},
    {sel:'#mk-back .activity-body > .mk-todo',rungs:['You know two of the four sides. Find how much fence they use.',
      'Take that away from the whole perimeter. What is left belongs to the other two sides.',
      'Here are different numbers: 26 cm of edging with one side 5 cm. 5 + 5 = 10, 26 − 10 = 16, and 16 ÷ 2 = 8 cm.']},
    {sel:'#mk-mix .activity-body > .mk-todo',rungs:['Two different questions. One is about the edge. One is about the ground inside.',
      'Around the edge: add the sides, answer in plain units. Inside: length × width, answer in square units.',
      'Here are different numbers: a bed 7 ft by 4 ft holds 28 square feet, and 22 feet of fence goes around it.']},
    {sel:'#mk-fix .activity-body > .mk-todo',rungs:['Draw the square and count its sides before you divide anything.',
      'All four sides of a square are the same, so the fencing is shared between four, not two.',
      'Here are different numbers: a square with 36 ft of fencing has sides of 36 ÷ 4 = 9 ft.']},
    {sel:'#tab-assignment .q-block',i:0,inside:true,rungs:['Walk the rectangle: top, side, bottom, side.',
      'Way 1 adds all four. Way 2 adds one long and one short, then doubles.',
      'Here are different numbers: 12 cm by 5 cm. 12 + 5 + 12 + 5 = 34, and 12 + 5 = 17, doubled is 34.']},
    {sel:'#tab-assignment .q-block',i:1,inside:true,rungs:['You know two of the four sides: 20 cm and 20 cm.',
      'Take those away from 56. What is left belongs to the other two sides, and they share it.',
      'Here are different numbers: 24 cm around, one side 9 cm. 24 − 18 = 6, and 6 ÷ 2 = 3 cm.']},
    {sel:'#tab-assignment .q-block',i:2,inside:true,rungs:['A square has four sides, all the same length.',
      'Share the fence between the four sides. Then the ground inside is side × side.',
      'Here are different numbers: a square with 40 m of fence has 10 m sides and holds 100 square meters.']}],
  writing:{
    'journal-notice':{min:6,chips:[{label:'I notice',words:['notice','see','30','11','fence','fencing','garden','wall','long','short','side','sides','rails','feet','ft','plan','plans']},
                                   {label:'I wonder',words:['wonder','how','which','why','?','if','what','many','long']}]},
    'journal-compare':{min:8,chips:[{label:'a Crew member\'s way',words:['atlas','felix','hazel','cora','take away','took away','subtract','minus','−','22','half','halve','15','double','doubled','lay','laid','rails','units']},
                                    {label:'why it is like yours',words:['because','like','same','i did','i also','me too','my way','mine']}]},
    'journal-fix':{min:10,chips:[{label:'the mistake',words:['two','2','four','4','sides','halved','half','divided by 2','24','square','forgot','wrong','should']},
                                 {label:'the fix',words:['12','48 ÷ 4','divide by 4','four sides','share','quarter']}]},
    'journal-big':{min:12,chips:[{label:'walk every side',words:['around','edge','every side','all the sides','add','perimeter','walk','once']},
                                 {label:'the quicker way',words:['double','doubled','twice','opposite','match','same','length + width','one of each','half']},
                                 {label:'an example of your own',words:['ft','in','cm','m','foot','feet','inch','meter','=','+']}]},
    'journal-prove':{min:12,chips:[{label:'the 8-foot garden',words:['8','2','16','eight','two','sixteen']},
                                   {label:'the 6-foot garden',words:['6','4','24','six','four','twenty-four']},
                                   {label:'what it shows',words:['same fence','same perimeter','20','different','more','less','not the same','wrong','bigger','smaller','shape']}]}},
  bigIdea:'The perimeter is the distance all the way around a shape. Walk every side once and add how far you went. For a rectangle you can add the length and the width and double it, because opposite sides match. If you know the perimeter and one side, take the two sides you know away and halve what is left. Perimeter is a length, so the answer is in plain units, never square units.',
  words:[{w:'perimeter',d:'the distance all the way around the edge of a shape'},
         {w:'opposite sides',d:'the two sides of a rectangle that face each other. They are always the same length'},
         {w:'rail',d:'one piece of fence. On this page each rail is one unit long'}],
  intendedWrong:['48 ÷ 2 = 24','each side is 24 ft'],
  models:{mental:bind(modelMental),think:bind(modelThink),guided:bind(modelGuided),walk:bind(modelWalk),back:bind(modelBack),
          mix:bind(modelMix),fix:bind(modelFix),prove:bind(modelProve),bonus:bind(modelBonus)}
};
})();
window.CW_ONDONE=function(){};
