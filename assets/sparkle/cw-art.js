/* ═══ CLASSICAL GUIDE · art (16-bit pixel scenes + guide sprites) ═══
   Shared by every lesson that uses the classical-guide layer (cw-engine.js). Holds no lesson content.
   Canvas is 320 × 180 logical pixels, scaled up with crisp pixels.
   Rules (Bethany, Nov 2026): plain scenes, minimal animation, anything a character mentions is drawn on screen,
   math objects are plain and to scale (the engine draws them from the lesson's data, not here). */
var CWART = (function(){
'use strict';
var W=320,H=180;
function R(c,x,y,w,h,ctx){ctx.fillStyle=c;ctx.fillRect(x|0,y|0,w|0,h|0);}
function dith(c1,c2,x,y,w,h,ctx){for(var j=0;j<h;j++)for(var i=0;i<w;i++){ctx.fillStyle=((i+j)&1)?c1:c2;ctx.fillRect(x+i,y+j,1,1);}}
function mk(w,h,fn,outline){var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');fn(x);
  if(outline){var d=x.getImageData(0,0,w,h),a=d.data,o=new Uint8ClampedArray(a);
    for(var y=0;y<h;y++)for(var i=0;i<w;i++){var k=(y*w+i)*4;if(a[k+3])continue;
      var n=(i>0&&a[k-1])||(i<w-1&&a[k+7])||(y>0&&a[k-w*4+3])||(y<h-1&&a[k+w*4+3]);
      if(n){o[k]=36;o[k+1]=22;o[k+2]=15;o[k+3]=255;}}
    d.data.set(o);x.putImageData(d,0,0);}
  return c;}

/* ───────── Leonardo's workshop, Milan 1495 ───────── */
function workshop(){return mk(W,H,function(c){
  for(var y=12;y<134;y++){R(y<73?'#cfab70':'#c49f63',0,y,W,1,c);}
  dith('#cfab70','#c49f63',0,72,W,4,c);
  [[96,30],[214,84],[176,112],[34,112]].forEach(function(p){for(var r=0;r<3;r++)for(var q=0;q<4;q++){R((r+q)%2?'#a8794a':'#b5864f',p[0]+q*7+(r%2)*3,p[1]+r*4,6,3,c);}});
  R('#a98451',0,128,W,6,c);R('#8c6a3f',0,133,W,1,c);
  R('#3f2716',0,0,W,12,c);for(var bx=4;bx<W;bx+=38){R('#5a3a22',bx,0,26,10,c);R('#7a5133',bx,0,26,2,c);R('#2e1c10',bx,10,26,2,c);}
  for(var fy=134;fy<H;fy++){R(((fy-134)>>2)%2?'#8a5a32':'#7f522d',0,fy,W,1,c);}
  for(var row=0;row<12;row++){var yy=134+row*4,off=(row%3)*17;for(var sx=-20+off;sx<W;sx+=52)R('#5e3a1f',sx,yy,1,4,c);R('#6f4527',0,yy,W,1,c);}
  // arched window with the Duke's castle outside
  var wx=20,wy=24,ww=52,wh=82,a,hw;
  R('#3f2716',wx-3,wy+20,ww+6,wh-17,c);
  for(a=0;a<=26;a++){hw=Math.round(Math.sqrt(Math.max(0,676-(26-a)*(26-a))));R('#3f2716',wx+23-hw,wy-6+a,hw*2+6,1,c);}
  for(var sy=0;sy<wh;sy++){var col=sy<30?'#9fc3d9':sy<52?'#b9d4e0':'#d6e5e4';var top=sy<26?Math.round(Math.sqrt(Math.max(0,676-(26-sy)*(26-sy)))):26;R(col,wx+26-top,wy-3+sy,top*2,1,c);}
  R('#93ad9a',wx,wy+56,ww,8,c);R('#7d9a86',wx,wy+62,ww,16,c);
  R('#7a8fa3',wx+20,wy+30,10,30,c);for(var cr=0;cr<5;cr++)R('#7a8fa3',wx+19+cr*2.4,wy+27,1.6,3,c);
  R('#6d8296',wx+8,wy+44,40,16,c);for(var cr2=0;cr2<10;cr2++)R('#6d8296',wx+8+cr2*4,wy+42,2,2,c);
  R('#3f2716',wx+25,wy-4,3,wh,c);R('#3f2716',wx,wy+38,ww,3,c);
  R('#5a3a22',wx-6,wy+wh-2,ww+12,5,c);R('#7a5133',wx-6,wy+wh-2,ww+12,1,c);
  // shelf
  R('#5a3a22',86,40,66,4,c);R('#7a5133',86,40,66,1,c);
  [['#6b8f71',90,30,7,10],['#a8553a',99,32,6,8],['#d9c9a3',107,26,5,14],['#7a5f9e',112,28,5,12],['#a35a3a',117,29,5,11],['#3f6d8a',124,33,8,7],['#c9a56b',134,31,6,9],['#8a4a3a',142,34,7,6]]
   .forEach(function(b){R(b[0],b[1],b[2],b[3],b[4],c);R('rgba(255,255,255,.25)',b[1],b[2],1,b[4],c);R('rgba(0,0,0,.2)',b[1]+b[3]-1,b[2],1,b[4],c);});
  // pinned sketches
  function sheet(x,y,w,h,draw){R('#efe3c6',x,y,w,h,c);R('#d7c59d',x+w-1,y,1,h,c);R('#d7c59d',x,y+h-1,w,1,c);R('#9e4552',x+w/2-1,y+1,2,2,c);draw(x,y);}
  sheet(180,46,24,20,function(x,y){for(var t=0;t<16;t++){var an=t/16*6.283;R('#6b4f35',x+12+Math.cos(an)*6,y+11+Math.sin(an)*6,1,1,c);if(t%2===0)R('#6b4f35',x+12+Math.cos(an)*8,y+11+Math.sin(an)*8,1,1,c);}R('#6b4f35',x+11,y+10,2,2,c);});
  sheet(208,50,22,18,function(x,y){R('#6b4f35',x+5,y+8,11,1,c);R('#6b4f35',x+4,y+9,1,5,c);R('#6b4f35',x+15,y+9,1,5,c);R('#6b4f35',x+7,y+9,1,5,c);R('#6b4f35',x+13,y+9,1,5,c);R('#6b4f35',x+15,y+5,1,3,c);R('#6b4f35',x+16,y+4,3,1,c);R('#6b4f35',x+3,y+8,1,2,c);});
  sheet(236,44,20,24,function(x,y){R('#6b4f35',x+6,y+5,8,1,c);R('#6b4f35',x+5,y+6,1,10,c);R('#6b4f35',x+14,y+6,1,10,c);R('#6b4f35',x+6,y+16,8,1,c);});
  // door
  R('#3f2716',288,50,30,84,c);R('#5a3a22',291,56,24,78,c);for(var dk=0;dk<4;dk++)R('#4a2e1a',294+dk*6,58,1,74,c);
  for(a=0;a<=12;a++){hw=Math.round(Math.sqrt(Math.max(0,144-(12-a)*(12-a))));R('#3f2716',300-hw,40+a,hw*2+6,1,c);R('#5a3a22',303-hw,44+a,hw*2,1,c);}
  R('#c9a56b',309,94,3,3,c);
  // wall pegs (for the long strip) + easel + workbench
  R('#3f2716',94,54,3,4,c);R('#3f2716',158,54,3,4,c);
  R('#5a3a22',126,70,3,66,c);R('#5a3a22',150,70,3,66,c);R('#4a2e1a',138,66,3,74,c);R('#6f4527',120,105,38,3,c);R('#7a5133',120,105,38,1,c);
  R('#6f4527',166,110,74,6,c);R('#8a5a32',166,110,74,1,c);R('#4a2e1a',166,116,74,2,c);
  R('#4a2e1a',170,118,4,24,c);R('#4a2e1a',232,118,4,24,c);R('#3f2716',170,130,66,2,c);
  [[150,150],[172,160],[110,158],[205,152]].forEach(function(p){R('#d9b382',p[0],p[1],3,1,c);R('#c49f63',p[0]+1,p[1]+1,2,1,c);});
},false);}

/* bench things (hotspot objects), drawn every frame by the engine at fixed spots */
var bench={
  notebook:mk(26,10,function(c){R('#efe3c6',1,2,11,7,c);R('#e6d6b2',13,2,11,7,c);R('#6b4f35',12,1,1,8,c);for(var i=0;i<3;i++){R('#8a7258',3,4+i*2,7,1,c);R('#8a7258',15,4+i*2,6,1,c);}},true),
  ink:mk(10,14,function(c){R('#2b2118',1,8,6,5,c);R('#4a3a2c',2,8,2,1,c);R('#f4efe2',5,1,1,8,c);R('#f4efe2',6,0,2,3,c);R('#dcd3be',4,2,1,3,c);},true),
  /* the gold sheets: plain kit-yellow squares (the same yellow as the page's unit tiles), no shine */
  gold:mk(12,7,function(c){for(var i=0;i<3;i++){R('#c99204',1,4-i,10,2,c);R('#F2B705',1,4-i,10,1,c);}},true),
  wings:mk(66,24,function(c){R('#5a3a22',31,6,4,12,c);R('#7a5133',31,6,1,12,c);R('#5a3a22',29,16,8,2,c);
    for(var s=-1;s<=1;s+=2){for(var i=0;i<30;i++){var x=s<0?30-i:35+i;var top=6+Math.round(-Math.sin(i/30*2.6)*4);var bot=top+Math.max(2,Math.round(12-i*0.33)-((i%7===6)?2:0));
      for(var y=top+1;y<bot;y++)R(((x+y)&1)?'#efe3c6':'#e2d2ae',x,y,1,1,c);R('#5a3a22',x,top,1,1,c);}
      for(var r=1;r<5;r++){var rx=s<0?30-r*7:35+r*7;var rt=6+Math.round(-Math.sin(r*7/30*2.6)*4);for(var y2=rt;y2<rt+Math.max(2,Math.round(12-r*7*0.33));y2++)R('#8a6a4a',rx,y2,1,1,c);}}},true)
};

/* ───────── people (front-facing, 3 frames: breath, blink, talk) ───────── */
function leo(breath,blink,talk){return mk(30,56,function(c){var cx=15,b=breath?1:0;
  R('#3b2a3a',cx-4,44,3,9,c);R('#3b2a3a',cx+1,44,3,9,c);R('#2a1c14',cx-5,52,4,2,c);R('#2a1c14',cx+1,52,4,2,c);
  for(var y=18;y<46;y++){var hw=6+Math.floor((y-18)/7),yy=y+(y<30?b:0);R('#c4626e',cx-hw,yy,hw*2+1,1,c);R('#9e4552',cx+hw-2,yy,2,1,c);R('#e08a92',cx-hw,yy,1,1,c);}
  R('#9e4552',cx,32,1,13,c);R('#4a2e1a',cx-8,30,17,2,c);R('#d4a62a',cx,30,1,2,c);
  R('#9e4552',cx-10,20+b,3,15,c);R('#c4626e',cx-10,20+b,2,14,c);R('#e8b98f',cx-10,35+b,3,3,c);
  R('#c4626e',cx+7,20+b,3,9,c);R('#9e4552',cx+9,20+b,1,9,c);R('#c4626e',cx+2,27+b,7,3,c);R('#e8b98f',cx+1,25+b,3,3,c);
  R('#f4efe2',cx-1,20+b,1,5,c);R('#f4efe2',cx-2,18+b,1,3,c);R('#f4efe2',cx-3,17+b,1,2,c);R('#c99470',cx-2,15+b,5,3,c);
  R('#e8b98f',cx-4,5+b,9,11,c);R('#c99470',cx+4,6+b,1,8,c);
  R('#6b4f35',cx-6,4+b,2,15,c);R('#6b4f35',cx+5,4+b,2,15,c);R('#8a6a4a',cx-6,5+b,1,12,c);R('#6b4f35',cx-5,3+b,11,3,c);
  R('#5b2a33',cx-6,1+b,13,3,c);R('#7a3a45',cx-4,0+b,9,2,c);R('#43202a',cx-6,3+b,13,1,c);
  R('#6b4f35',cx-3,7+b,2,1,c);R('#6b4f35',cx+1,7+b,2,1,c);
  if(blink){R('#c99470',cx-3,8+b,2,1,c);R('#c99470',cx+1,8+b,2,1,c);}else{R('#2b2118',cx-2,8+b,1,1,c);R('#2b2118',cx+2,8+b,1,1,c);R('#fff',cx-3,8+b,1,1,c);R('#fff',cx+1,8+b,1,1,c);}
  R('#c99470',cx,9+b,1,2,c);
  R('#8d7a66',cx-2,11+b,5,1,c);R('#9c8a76',cx-4,12+b,9,4,c);R('#8d7a66',cx-3,16+b,7,2,c);R('#8d7a66',cx-2,18+b,5,1,c);R('#b3a28e',cx-3,13+b,1,3,c);
  R(talk?'#3a2018':'#7a6856',cx-1,13+b,3,talk?2:1,c);},true);}
function bern(breath,blink,talk){return mk(30,50,function(c){var cx=15,b=breath?1:0;
  R('#8a2a2a',cx-4,40,3,8,c);R('#8a2a2a',cx+1,40,3,8,c);R('#1f1a17',cx-5,47,4,2,c);R('#1f1a17',cx+1,47,4,2,c);
  for(var y=17;y<41;y++){var hw=y<30?6+Math.floor((y-17)/3):10-Math.floor((y-30)/3),yy=y+(y<28?b:0);R('#2f5d4a',cx-hw,yy,hw*2+1,1,c);R('#224536',cx+hw-2,yy,2,1,c);R('#3f7a61',cx-hw,yy,1,1,c);}
  for(var k=0;k<5;k++)R('#d4a62a',cx,20+k*4+b,1,1,c);
  R('#224536',cx-11,19+b,3,12,c);R('#e6b48a',cx-11,31+b,3,3,c);
  R('#224536',cx+8,19+b,3,8,c);R('#224536',cx+4,26+b,6,3,c);R('#f4efe2',cx+1,23+b,4,7,c);R('#9e4552',cx+2,26+b,2,1,c);
  R('#e6b48a',cx-4,5+b,9,11,c);R('#c48e64',cx+4,6+b,1,9,c);R('#d99a7a',cx-4,11+b,2,2,c);R('#d99a7a',cx+3,11+b,2,2,c);
  R('#1f1a17',cx-5,1+b,11,4,c);R('#1f1a17',cx-6,4+b,13,2,c);R('#4a3a2c',cx-5,6+b,1,4,c);R('#4a3a2c',cx+5,6+b,1,4,c);
  if(blink){R('#c48e64',cx-2,9+b,1,1,c);R('#c48e64',cx+2,9+b,1,1,c);}else{R('#2b2118',cx-2,9+b,1,1,c);R('#2b2118',cx+2,9+b,1,1,c);}
  R('#c48e64',cx,10+b,1,2,c);R(talk?'#6a2a20':'#a0644a',cx-1,13+b,3,talk?2:1,c);R('#e6b48a',cx-2,15+b,5,2,c);},true);}
/* Salaì, Leonardo's young apprentice (he joined the workshop as a boy in 1490): curly hair, blue tunic */
function salai(breath,blink,talk){return mk(26,44,function(c){var cx=13,b=breath?1:0;
  R('#5a4a3a',cx-3,34,3,7,c);R('#5a4a3a',cx+1,34,3,7,c);R('#2a1c14',cx-4,40,4,2,c);R('#2a1c14',cx+1,40,4,2,c);
  for(var y=15;y<35;y++){var hw=5+Math.floor((y-15)/8),yy=y+(y<25?b:0);R('#3f6d9e',cx-hw,yy,hw*2+1,1,c);R('#2e5480',cx+hw-1,yy,2,1,c);R('#5b8cc0',cx-hw,yy,1,1,c);}
  R('#4a2e1a',cx-6,26,13,2,c);
  R('#2e5480',cx-8,17+b,3,11,c);R('#e8b98f',cx-8,28+b,3,3,c);R('#2e5480',cx+6,17+b,3,11,c);R('#e8b98f',cx+6,28+b,3,3,c);
  R('#f4efe2',cx-2,15+b,5,2,c);
  R('#ebc29a',cx-4,4+b,9,10,c);R('#d1a47c',cx+4,5+b,1,8,c);
  // curls
  [[-5,2],[-3,1],[-1,0],[1,0],[3,1],[5,2],[-6,4],[6,4],[-6,7],[6,7],[-5,10],[5,10]].forEach(function(p){R('#a8743a',cx+p[0]-1,p[1]+b,3,3,c);R('#c48a4a',cx+p[0]-1,p[1]+b,1,1,c);});
  if(blink){R('#d1a47c',cx-2,8+b,1,1,c);R('#d1a47c',cx+2,8+b,1,1,c);}else{R('#2b2118',cx-2,8+b,1,1,c);R('#2b2118',cx+2,8+b,1,1,c);}
  R('#d1a47c',cx,9+b,1,2,c);R(talk?'#6a2a20':'#b06a50',cx-1,11+b,3,talk?2:1,c);},true);}

/* the Math Crew: the year-long companions who visit each unit's guide with the student. Same people as Pixel Quest,
   drawn in the 16-bit style; outfit colors match their card colors (Atlas light blue, Felix green, Hazel yellow, Cora orange). */
var CREW={
  atlas:{skin:['#EBC09A','#CF9A6F'],hair:['#5A3A22','#3E2716'],shirt:['#55C8E8','#2f9cbf','#8adcf2'],pants:'#3b4a6b',hat:'#D8B575'},
  felix:{skin:['#9C6640','#7C4C2C'],hair:['#1E1E28','#0E0E16'],shirt:['#2DB87A','#1e8c5a','#5fd39c'],pants:'#3b3b4a',goggles:true},
  hazel:{skin:['#F6D3B3','#E2AE88'],hair:['#C4512E','#963A1E'],shirt:['#F5C518','#c99a06','#ffe066'],pants:'#5a4a6b',beret:'#C93A4A',long:true},
  cora:{skin:['#C98E5E','#A86E42'],hair:['#2A1D18','#160E0A'],shirt:['#E07B39','#b25a22','#f2a066'],pants:'#3b4a6b',puffs:true,glasses:'#5B2E10'}};
function kid(who){var K=CREW[who];return function(breath,blink,talk){return mk(26,44,function(c){var cx=13,b=breath?1:0,sk=K.skin,hr=K.hair,sh=K.shirt;
  R(K.pants,cx-3,34,3,7,c);R(K.pants,cx+1,34,3,7,c);R('#2a1c14',cx-4,40,4,2,c);R('#2a1c14',cx+1,40,4,2,c);
  for(var y=15;y<35;y++){var hw=5+Math.floor((y-15)/9),yy=y+(y<25?b:0);R(sh[0],cx-hw,yy,hw*2+1,1,c);R(sh[1],cx+hw-1,yy,2,1,c);R(sh[2],cx-hw,yy,1,1,c);}
  R(sh[1],cx-8,17+b,3,11,c);R(sk[0],cx-8,28+b,3,3,c);R(sh[1],cx+6,17+b,3,11,c);R(sk[0],cx+6,28+b,3,3,c);
  R(sk[1],cx-2,14+b,5,2,c);
  if(K.long){R(hr[0],cx-6,3+b,3,16,c);R(hr[0],cx+4,3+b,3,16,c);R(hr[1],cx+5,6+b,2,13,c);}
  R(sk[0],cx-4,4+b,9,10,c);R(sk[1],cx+4,5+b,1,8,c);
  R(hr[0],cx-5,2+b,11,3,c);R(hr[1],cx-5,4+b,2,3,c);R(hr[0],cx+4,4+b,2,3,c);
  if(K.puffs){R(hr[0],cx-8,1+b,4,4,c);R(hr[0],cx+5,1+b,4,4,c);R(hr[1],cx-8,4+b,4,1,c);R(hr[1],cx+5,4+b,4,1,c);}
  if(K.goggles){R(hr[0],cx-5,1+b,2,2,c);R(hr[0],cx-1,0+b,2,2,c);R(hr[0],cx+3,1+b,2,2,c);R('#c9a56b',cx-5,4+b,11,2,c);R('#9fd8ef',cx-4,4+b,3,2,c);R('#9fd8ef',cx+2,4+b,3,2,c);}
  if(K.hat){R(K.hat,cx-7,3+b,15,2,c);R(K.hat,cx-4,0+b,9,3,c);R('#b8955a',cx-4,2+b,9,1,c);}
  if(K.beret){R(K.beret,cx-6,1+b,11,3,c);R(K.beret,cx-3,0+b,6,1,c);R('#8e2633',cx-6,3+b,11,1,c);}
  if(blink){R(sk[1],cx-2,8+b,1,1,c);R(sk[1],cx+2,8+b,1,1,c);}else{R('#2b2118',cx-2,8+b,1,1,c);R('#2b2118',cx+2,8+b,1,1,c);}
  if(K.glasses){R(K.glasses,cx-3,7+b,3,3,c);R(K.glasses,cx+1,7+b,3,3,c);R(sk[0],cx-2,8+b,1,1,c);R(sk[0],cx+2,8+b,1,1,c);if(!blink){R('#2b2118',cx-2,8+b,1,1,c);R('#2b2118',cx+2,8+b,1,1,c);}R(K.glasses,cx,8+b,1,1,c);}
  R(sk[1],cx,9+b,1,2,c);R(talk?'#6a2a20':'#b06a50',cx-1,11+b,3,talk?2:1,c);},true);};}

/* Bethany (Nov 2026): the Crew look exactly like their Pixel Quest sprites (pq-art.js), shown at 2× so students recognize them */
var PQLOOK={atlas:{skin:['#EBC09A','#CF9A6F'],hair:['#5A3A22','#3E2716'],style:'short',shirt:'#55C8E8',acc:'hat',acc2:'#D8B575'},
  felix:{skin:['#9C6640','#7C4C2C'],hair:['#1E1E28','#0E0E16'],style:'spiky',shirt:'#2DB87A',acc:'goggles'},
  hazel:{skin:['#F6D3B3','#E2AE88'],hair:['#C4512E','#963A1E'],style:'long',shirt:'#F5C518',acc:'beret',acc2:'#C93A4A'},
  cora:{skin:['#C98E5E','#A86E42'],hair:['#2A1D18','#160E0A'],style:'puffs',shirt:'#E07B39',acc:'glasses',frame:'#5B2E10'}},SHEETS={};
function pqKid(who){return function(breath){if(!window.PQART)return kid(who)(breath);var sh=SHEETS[who]||(SHEETS[who]=PQART.buildChar(PQLOOK[who]));
  return mk(32,41,function(c){c.imageSmoothingEnabled=false;c.drawImage(sh,0,0,16,20,0,breath?1:0,32,40);},false);};}
var DRAW={leo:leo,bern:bern,salai:salai,atlas:pqKid('atlas'),felix:pqKid('felix'),hazel:pqKid('hazel'),cora:pqKid('cora')},CACHE={};
function person(who,breath,blink,talk){var k=who+(+!!breath)+(+!!blink)+(+!!talk);return CACHE[k]||(CACHE[k]=DRAW[who](breath,blink,talk));}
/* a head-and-shoulders portrait into a small canvas (dialogue box, page tips) */
function portrait(cnv,who,talk){var p=cnv.getContext('2d');p.imageSmoothingEnabled=false;var S=cnv.width;p.clearRect(0,0,S,S);
  R('#c9a56b',0,0,S,S,p);R('#b48c55',0,Math.round(S*0.66),S,S,p);var s=person(who,0,0,talk);
  p.drawImage(s,0,0,s.width,26,Math.round((S-s.width)/2),1,s.width,26);}

var ROOMS={};
function room(name){return ROOMS[name]||(ROOMS[name]=({workshop:workshop})[name]());}
return {W:W,H:H,R:R,mk:mk,room:room,bench:bench,person:person,portrait:portrait,
  heights:{leo:56,bern:50,salai:44,atlas:41,felix:41,hazel:41,cora:41},names:{leo:'Leonardo',bern:'Bernardo',salai:'Salaì',atlas:'Atlas',felix:'Felix',hazel:'Hazel',cora:'Cora'},colors:{leo:'#9e4552',bern:'#2f5d4a',salai:'#2e5480',atlas:'#1F8FB4',felix:'#1E8C5A',hazel:'#B08A0A',cora:'#C2601F'}};
})();
