/* ═══ OAO PIXEL QUEST · art kit (sprites, tiles, objects) ═══ */
var PQART = (function(){
'use strict';
var TS = 16;
function cv(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function shade(hex,f){var n=parseInt(hex.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;
  function m(v){return Math.max(0,Math.min(255,Math.round(f<1?v*f:v+(255-v)*(f-1))));}
  return '#'+((1<<24)|(m(r)<<16)|(m(g)<<8)|m(b)).toString(16).slice(1);}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function R(x,c,X,Y,W,H){x.fillStyle=c;x.fillRect(X,Y,W,H);}
function disc(x,cx,cy,r,c){x.fillStyle=c;for(var y=-Math.ceil(r);y<=Math.ceil(r);y++)for(var i=-Math.ceil(r);i<=Math.ceil(r);i++)if(i*i+y*y<=r*r+r*0.6)x.fillRect(Math.round(cx+i),Math.round(cy+y),1,1);}
function ell(x,cx,cy,rx,ry,c){x.fillStyle=c;for(var y=-ry;y<=ry;y++)for(var i=-rx;i<=rx;i++)if((i*i)/(rx*rx)+(y*y)/(ry*ry)<=1.05)x.fillRect(cx+i,cy+y,1,1);}

/* ───────── palette ───────── */
var P = {
  ol:'#2E1C12',
  g1:'#8CCF6B', g2:'#79C05A', g3:'#5EA548', g4:'#B1E386', gd:'#4A8C3B',
  path:'#EBD2A6', path2:'#DDBC8A', path3:'#C69C68', pathHi:'#F7E6C4',
  tile:'#E9A47A', tile2:'#DB8E62', tileHi:'#F4C3A0', grout:'#C77B52',
  w1:'#4FA8E2', w2:'#3A8DCB', w3:'#2C73AE', wHi:'#BCE6FA',
  bank:'#C9B48A',
  leaf1:'#2F8A40', leaf2:'#47A94C', leaf3:'#6CC45B', leaf4:'#9BDB72', leafD:'#1E5E2C',
  trunk:'#8A5A3B', trunkD:'#5E3A24',
  roof:'#CC6A3E', roofD:'#A44F2C', roofHi:'#E68E5E',
  wall:'#FBEAD0', wallD:'#E9CFA9', wood:'#B57E4C', woodD:'#8A5A33', woodHi:'#D49E68',
  stone:'#B9B0A2', stoneD:'#8E8476', stoneHi:'#DAD3C6',
  glass:'#8FD3F0', glassD:'#4C9CC9',
  navy:'#0E1C42', gold:'#F5C518', cyan:'#55C8E8'
};

/* ───────── characters (16×20, chibi) ───────── */
var T_DOWN = [
"................",
".....OOOOOO.....",
"...OOHHHHHHOO...",
"..OHHHHHHHHHHO..",
"..OHHHHHHHHHHO..",
".OHHHHHHHHHHHhO.",
".OHhHHhHHhHHhhO.",
".OhKKKKKKKKKKhO.",
".OKKEWKKKKEWKKO.",
".OKKEEKKKKEEKKO.",
"..OKRKKKKKKRKO..",
"...OOkKKKKkOO...",
"...OTTTTTTTTO...",
"..OKtTTTTTTtKO..",
"..OKOTTTTTTOKO..",
"...OOtTTTTtOO...",
"....OPPPPPPO....",
"....OPPOOPPO....",
"....OBBOOBBO....",
"................"];
var T_UP = [
"................",
".....OOOOOO.....",
"...OOHHHHHHOO...",
"..OHHHHHHHHHHO..",
"..OHHHHHHHHHHO..",
".OHHHHHHHHHHHhO.",
".OHHHHHHHHHHHhO.",
".OhHHHHHHHHHHhO.",
".OhHHHHHHHHHhhO.",
".OhhHHHHHHHHhhO.",
"..OhhhhhhhhhhO..",
"...OOkkkkkkOO...",
"...OTTTTTTTTO...",
"..OKTTTTTTTTKO..",
"..OKOtTTTTtOKO..",
"...OOttttttOO...",
"....OPPPPPPO....",
"....OPPOOPPO....",
"....OBBOOBBO....",
"................"];
var T_LEFT = [
"................",
".....OOOOOO.....",
"...OOHHHHHHOO...",
"..OHHHHHHHHHHO..",
"..OHHHHHHHHHHO..",
".OHHHHHHHHHHHhO.",
".OHHhHHHHHHHHhO.",
".OKKKKKKHHHHhhO.",
".OKEWKKKKKHHhhO.",
".OKEEKKKKKkHhhO.",
"..OKRKKKKKkhhO..",
"...OOkKKKkOOO...",
"....OTTTTTTO....",
"....OTKKTTtO....",
"....OTKKTttO....",
"....OOttttOO....",
".....OPPPPO.....",
".....OPPPPO.....",
".....OBBBBO.....",
"................"];
var LEGS = {
  down:[["....OPPPPPPO....","....OPPOOBBO....","....OBBO.OO.....","................"],
        ["....OPPPPPPO....","....OBBOOPPO....",".....OO.OBBO....","................"]],
  up:  [["....OPPPPPPO....","....OPPOOBBO....","....OBBO.OO.....","................"],
        ["....OPPPPPPO....","....OBBOOPPO....",".....OO.OBBO....","................"]],
  left:[[".....OPPPPO.....","....OPPOOPPO....","...OBBO..OBBO...","................"],
        [".....OPPPPO.....","....OPPOPPO.....","....OBBOOBBO....","................"]]
};
function grid(t){return t.map(function(r){r=(r+'................').slice(0,16);return r.split('');});}
function put(g,r,c,ch){if(r>=0&&r<20&&c>=0&&c<16)g[r][c]=ch;}
function row(g,r,s){for(var i=0;i<s.length&&i<16;i++)if(s[i]!==' ')g[r][i]=s[i];}

function hairStyle(g,dir,style){
  if(style==='long'){
    if(dir==='down'){for(var r=7;r<=13;r++){put(g,r,0,'O');put(g,r,1,'H');put(g,r,14,'h');put(g,r,15,'O');}
      for(r=10;r<=13;r++){put(g,r,2,'H');put(g,r,13,'h');}put(g,14,1,'O');put(g,14,2,'O');put(g,14,13,'O');put(g,14,14,'O');}
    if(dir==='up'){for(var r2=11;r2<=13;r2++){for(var c=3;c<=12;c++)put(g,r2,c,r2===13?'h':'H');put(g,r2,2,'O');put(g,r2,13,'O');}
      for(var c2=3;c2<=12;c2++)put(g,14,c2,c2%3===0?'O':g[14][c2]);row(g,14,"..OK OOOOOO OKO");}
    if(dir==='left'){for(var r3=9;r3<=13;r3++){put(g,r3,11,'H');put(g,r3,12,'h');put(g,r3,13,'h');put(g,r3,14,'O');}row(g,14,"           OOOO ");}
  }
  if(style==='puffs'){
    var pf=[".OO.","OHHO","OhhO",".OO."];
    function puff(r0,c0){for(var i=0;i<4;i++)for(var j=0;j<4;j++)if(pf[i][j]!=='.')put(g,r0+i,c0+j,pf[i][j]);}
    if(dir==='left'){puff(0,11);} else {puff(0,0);puff(0,12);}
  }
  if(style==='spiky'){
    row(g,0,"....O..O..O.....");row(g,1,"....HO.HO.HO....");
    if(dir!=='up'){put(g,2,2,'O');put(g,3,1,'O');put(g,3,2,'H');}
  }
  if(style==='curly'){
    row(g,1,"....OOOOOOOO....");row(g,2,"..OOHHHHHHHHOO..");row(g,3,".OHHHHHHHHHHHHO.");row(g,4,".OHHHHHHHHHHHHO.");
    if(dir==='down'){row(g,6,".OHHhHHhHHhHHHO.");row(g,7,"OHhKKKKKKKKKKhHO");row(g,8,"OHKKEWKKKKEWKKhO");row(g,9,".OKKEEKKKKEEKKO.");}
  }
}
function accessory(g,dir,acc){
  if(acc==='hat'){
    row(g,0,"................");row(g,1,"....OOOOOOOO....");row(g,2,"...OAAAAAAAAO...");row(g,3,"...OaaaaaaaaO...");row(g,4,"OOAAAAAAAAAAAAOO");
    if(dir==='left')row(g,4,"OAAAAAAAAAAAAAO.");
  }
  if(acc==='goggles'){
    if(dir==='up'){row(g,5,".OGGGGGGGGGGGGO.");}
    else if(dir==='left'){row(g,4,"..GGGGGGGGGGG...");row(g,5,".OLLGGGGGGGGGhO.");put(g,4,2,'L');put(g,4,3,'L');}
    else {row(g,4,"..OGGGGGGGGGGO..");row(g,5,".OGLLGGGGGLLGGO.");put(g,4,4,'L');put(g,4,5,'L');put(g,4,10,'L');put(g,4,11,'L');}
  }
  if(acc==='beret'){
    row(g,0,"........OO......");row(g,1,"....OOOOAAOOO...");row(g,2,"..OOAAAAAAAAAOO.");row(g,3,"..OaaaaaaaaaaaO.");
  }
  if(acc==='glasses'){
    if(dir==='down'){row(g,7,".OhFFFFKKFFFFhO.");row(g,8,".OKFEWFFFFEWFKO.");row(g,9,".OKFEEFKKFEEFKO.");row(g,10,"..OKFFFFFFFFKO..");}
    if(dir==='left'){row(g,7,".OFFFFKKHHHHhhO.");row(g,8,".OFEWFFKKKHHhhO.");row(g,9,".OFEEFKKKKkHhhO.");row(g,10,"..OFFKKKKKkhhO..");}
  }
  if(acc==='apron'){ // Millie the miller
    if(dir!=='up'){row(g,12,"...OTAAAAAATO...");row(g,13,"..OKtAAAAAAtKO..");row(g,14,"..OKOAAAAAAOKO..");row(g,15,"...OOAAAAAAOO...");}
    row(g,0,"................");row(g,1,"....OOOOOOOO....");row(g,2,"...OAAAAAAAAO...");row(g,3,"...OAAAAAAAAO...");
  }
  if(acc==='straps'){ // Mo the builder: overalls + cap
    if(dir!=='up'){row(g,12,"...OTAATTAATO...");row(g,13,"..OKtAAAAAAtKO..");row(g,14,"..OKOAAAAAAOKO..");row(g,15,"...OOAAAAAAOO...");}
    row(g,1,"....OOOOOOO.....");row(g,2,"...OaaaaaaaO....");row(g,3,"..OaaaaaaaaaO...");if(dir==='left')row(g,4,"OaaaaaHHHHHHhO..");else if(dir==='down')row(g,4,"..OOaaaaaaaaaOO.");
    if(dir==='down'){row(g,10,"..OKRHHHHHHRKO..");row(g,11,"...OOHHHHHHOO...");}
  }
}
function gear(g,dir,k){
  if(k==='scarf'){if(dir==='up'){row(g,11,"...OXXXXXXO.....");}else if(dir==='left'){row(g,11,"....OXXXXXXO....");row(g,12,"........XxO.....");}else{row(g,11,"...OXXXXXXXXO...");row(g,12,"...OxXX     O...");put(g,13,4,'X');put(g,13,5,'x');}}
  if(k==='flower'){var c=dir==='left'?10:3;if(dir==='right')c=10;put(g,2,c,'Y');put(g,3,c-1,'Y');put(g,3,c+1,'Y');put(g,4,c,'Y');put(g,3,c,'y');}
  if(k==='cap'){row(g,0,"................");row(g,1,".....OOOOOO.....");row(g,2,"...OOCCCCCCOO...");row(g,3,"..OCCCCcCCCCCO..");
    if(dir==='down')row(g,4,"..OccccccccccO..");else if(dir==='left')row(g,4,"OOCCCCCCCCCCCO..");else if(dir==='up')row(g,4,"..OCCCCCCCCCCO..");}
  if(k==='pack'){if(dir==='up'){row(g,12,"...OZZZZZZZZO...");row(g,13,"..OKZzzzzzzZKO..");row(g,14,"..OKZZZZZZZZKO..");row(g,15,"...OZZZZZZZZO...");}
    else if(dir==='left'){put(g,12,11,'Z');put(g,13,11,'Z');put(g,14,11,'Z');put(g,12,12,'O');put(g,13,12,'Z');put(g,14,12,'z');put(g,15,11,'O');put(g,13,13,'O');put(g,14,13,'O');}
    else{put(g,12,5,'Z');put(g,13,5,'z');put(g,12,10,'Z');put(g,13,10,'z');}}
}
function buildChar(look){
  var dirs=['down','up','left'], sheet=cv(16*4,20*4), x=sheet.getContext('2d');
  var shirt=look.shirt, map={O:P.ol,H:look.hair[0],h:look.hair[1],K:look.skin[0],k:look.skin[1],R:shade(look.skin[0],0.9),
    E:'#24160E',W:'#FFFFFF',T:shirt,t:shade(shirt,0.78),P:look.pants||'#3E4C74',B:look.shoes||'#6B3A22',
    A:look.acc2||'#D8B575',C:'#3A6BC4',c:'#24478A',X:'#2DB87A',x:'#1E7E50',Y:'#F27A93',y:'#F5C518',Z:'#8E5B3A',z:'#6B3F22',a:shade(look.acc2||'#D8B575',0.72),G:'#3B3B46',L:'#8FE3F7',F:look.frame||'#7A2E14'};
  if(look.blushOff)map.R=look.skin[0];
  dirs.forEach(function(d,di){
    var base=d==='down'?T_DOWN:d==='up'?T_UP:T_LEFT;
    for(var f=0;f<4;f++){
      var g=grid(base);
      if(f===1||f===3){var lg=LEGS[d][f===1?0:1];for(var i=0;i<4;i++)g[16+i]=(lg[i]+'................').slice(0,16).split('');}
      hairStyle(g,d,look.style||'short');
      if(look.acc)accessory(g,d,look.acc);
      (look.gear||[]).forEach(function(k){gear(g,d,k);});
      var bob=(f===1||f===3)?1:0;
      for(var r=0;r<20;r++)for(var c=0;c<16;c++){var ch=g[r][c];if(ch==='.'||ch===' ')continue;var col=map[ch];if(!col)continue;
        x.fillStyle=col;x.fillRect(f*16+c,di*20+r-(r<16?bob:0),1,1);}
    }
  });
  // right = mirror of left
  for(var f2=0;f2<4;f2++){x.save();x.translate(f2*16+16,0);x.scale(-1,1);x.drawImage(sheet,f2*16,40,16,20,0,60,16,20);x.restore();}
  return sheet;
}
var DIRI={down:0,up:1,left:2,right:3};

/* ───────── Opti the owl ───────── */
function buildOwl(){
  var T=[
"................",
".....NNNNNN.....",
"..NNNNNNNNNNNN..",
"...ONNNNNNNNOY..",
"..OBOOOOOOOOBOY.",
"..OBBBBBBBBBBOY.",
".OBCCCBBBBCCCBO.",
".OCWWWCBBCWWWCO.",
".OCWEECBBCWEECO.",
".OCWEECYYCWEECO.",
".OBCCCBYYBCCCBO.",
".OBBBBBBBBBBBBO.",
"OBbBFFFFFFFFBbBO",
"OBbFfFFfFFfFFbBO",
"OBbFFFFFFFFFFbBO",
".OBbFfFFfFFfbBO.",
"..OBbFFFFFFbBO..",
"...OOOYOOYOOO...",
".....YY..YY.....",
"................"];
  var map={O:P.ol,N:P.navy,Y:P.gold,B:'#9A6A44',b:'#7A4F30',C:'#F3DDB8',W:'#FFFFFF',E:'#24160E',F:'#E9C997',f:'#C9A272'};
  var c=cv(32,20),x=c.getContext('2d');
  for(var k=0;k<2;k++){for(var r=0;r<20;r++){var s=(T[r]+'................').slice(0,16);for(var i=0;i<16;i++){var ch=s[i];
    if(k===1&&(r===7||r===8)&&ch!=='O'&&ch!=='.'&&(i>=3&&i<=5||i>=10&&i<=12))ch='b';
    if(map[ch]){x.fillStyle=map[ch];x.fillRect(k*16+i,r,1,1);}}}}
  return c;
}
/* ───────── the Smudge ───────── */
function drawSmudge(x,ox,oy,t,mad){
  var w=Math.sin(t*3)*1.2;
  ell(x,ox+12,oy+21,9,2,'rgba(0,0,0,0.18)');
  var puffs=[[5,11,6],[12,8,7.5],[19,11,6],[8,15,5.5],[16,15,5.5]];
  puffs.forEach(function(p,i){disc(x,ox+p[0]+(i%2?w:-w)*0.5,oy+p[1],p[2]+1,'#3D3A44');});
  puffs.forEach(function(p,i){disc(x,ox+p[0]+(i%2?w:-w)*0.5,oy+p[1],p[2],'#77727F');});
  puffs.forEach(function(p,i){disc(x,ox+p[0]-1+(i%2?w:-w)*0.5,oy+p[1]-1.5,p[2]-2.5,'#9A95A3');});
  // eyes
  R(x,'#FFFFFF',ox+8,oy+10,3,4);R(x,'#FFFFFF',ox+14,oy+10,3,4);
  R(x,'#1A1520',ox+9,oy+11,2,3);R(x,'#1A1520',ox+14,oy+11,2,3);
  R(x,'#1A1520',ox+7,oy+9,4,1);R(x,'#1A1520',ox+14,oy+9,4,1);
  if(mad){R(x,'#1A1520',ox+8,oy+8,2,1);R(x,'#1A1520',ox+15,oy+8,2,1);}
  R(x,'#1A1520',ox+10,oy+16,5,1);R(x,'#1A1520',ox+9,oy+15,1,1);R(x,'#1A1520',ox+15,oy+15,1,1);
}

/* ───────── tiles ───────── */
function groundCanvas(map,W,H,seed){
  var c=cv(W*TS,H*TS),x=c.getContext('2d'),rnd=rng(seed||7);
  function at(i,j){if(i<0||j<0||i>=W||j>=H)return 'T';return map[j][i];}
  function isG(ch){return ch==='.'||ch==='T'||ch==='f'||ch==='d';}
  for(var j=0;j<H;j++)for(var i=0;i<W;i++){
    var ch=at(i,j),X=i*TS,Y=j*TS;
    // grass base everywhere first
    R(x,P.g1,X,Y,16,16);
    var v=rnd();
    for(var k=0;k<5;k++){var gx=X+Math.floor(rnd()*14)+1,gy=Y+Math.floor(rnd()*13)+2;R(x,P.g2,gx,gy,1,2);R(x,P.g2,gx+1,gy-1,1,1);}
    if(v<0.35){var tx=X+3+Math.floor(rnd()*9),ty=Y+4+Math.floor(rnd()*8);R(x,P.g3,tx,ty,1,2);R(x,P.g3,tx+2,ty,1,2);R(x,P.g3,tx+1,ty+1,1,2);R(x,P.g4,tx+1,ty-1,1,1);}
    if(v>0.85){R(x,P.g4,X+Math.floor(rnd()*14),Y+Math.floor(rnd()*14),2,1);}
    if(ch==='f'){ // flower patch
      var cols=['#F25C6E','#FFFFFF','#F5C518','#B784F0'];
      for(var q=0;q<5;q++){var fx=X+2+Math.floor(rnd()*11),fy=Y+2+Math.floor(rnd()*11),fc=cols[Math.floor(rnd()*cols.length)];
        R(x,P.gd,fx+1,fy+2,1,2);R(x,fc,fx,fy+1,3,1);R(x,fc,fx+1,fy,1,3);R(x,'#FFF3B0',fx+1,fy+1,1,1);}
    }
    if(ch==='d'){ // garden soil with sprouts
      R(x,'#8E5B3A',X,Y,16,16);for(var s=0;s<16;s+=4){R(x,'#7A4B2E',X,Y+s+3,16,1);}
      for(var s2=0;s2<3;s2++){var sx=X+2+s2*5,sy=Y+5+((i+j+s2)%2)*5;R(x,'#3E8A3A',sx+1,sy,1,3);R(x,'#6CC45B',sx,sy,1,1);R(x,'#6CC45B',sx+2,sy-1,1,1);}
    }
    if(ch==='p'){
      R(x,P.path,X,Y,16,16);
      // cobbles
      for(var cy2=0;cy2<16;cy2+=5){var off=((cy2/5)%2)*3;for(var cx2=-3+off;cx2<16;cx2+=6){
        var sx2=X+cx2,sy2=Y+cy2;var w2=5,h2=4;
        var x0=Math.max(X,sx2),x1=Math.min(X+16,sx2+w2);if(x1<=x0)continue;
        R(x,P.path2,x0,sy2+h2-1,x1-x0,1);R(x,P.path3,x0,Math.min(sy2+h2,Y+15),x1-x0,1);R(x,P.pathHi,x0,sy2,Math.min(2,x1-x0),1);
      }}
      // edges into grass
      if(isG(at(i,j-1))){R(x,P.path3,X,Y,16,1);for(var e=0;e<16;e+=3)R(x,P.g2,X+e,Y,2,1);}
      if(isG(at(i,j+1))){R(x,P.path3,X,Y+15,16,1);}
      if(isG(at(i-1,j))){R(x,P.path3,X,Y,1,16);for(var e2=1;e2<16;e2+=4)R(x,P.g2,X,Y+e2,1,2);}
      if(isG(at(i+1,j))){R(x,P.path3,X+15,Y,1,16);}
    }
    if(ch==='s'){ // terracotta plaza pavers
      R(x,P.tile,X,Y,16,16);
      for(var py=0;py<16;py+=8)for(var px=0;px<16;px+=8){R(x,P.tileHi,X+px,Y+py,7,1);R(x,P.tileHi,X+px,Y+py,1,7);R(x,P.tile2,X+px+1,Y+py+6,6,1);R(x,P.tile2,X+px+6,Y+py+1,1,6);}
      R(x,P.grout,X+7,Y,1,16);R(x,P.grout,X+15,Y,1,16);R(x,P.grout,X,Y+7,16,1);R(x,P.grout,X,Y+15,16,1);
      if(isG(at(i,j-1))||at(i,j-1)==='p')R(x,P.grout,X,Y,16,1);
      if(isG(at(i-1,j))||at(i-1,j)==='p')R(x,P.grout,X,Y,1,16);
    }
    if(ch==='w'){
      R(x,P.w1,X,Y,16,16);R(x,P.w2,X,Y+11,16,5);
      if(at(i,j-1)!=='w'){R(x,P.bank,X,Y,16,3);R(x,P.stoneD,X,Y+3,16,1);R(x,P.w3,X,Y+4,16,1);}
      if(at(i,j+1)!=='w'){R(x,P.bank,X,Y+14,16,2);R(x,P.stoneHi,X,Y+13,16,1);}
      if(at(i-1,j)!=='w'){R(x,P.bank,X,Y,3,16);R(x,P.stoneD,X+3,Y,1,16);}
      if(at(i+1,j)!=='w'){R(x,P.bank,X+13,Y,3,16);R(x,P.stoneD,X+12,Y,1,16);}
    }
    if(ch==='b'){ // wooden footbridge over water (planks run across the river)
      R(x,P.w1,X,Y,16,16);R(x,'#7A5230',X,Y+1,16,14);
      for(var bp=0;bp<16;bp+=4){R(x,'#C99A63',X+bp,Y+2,3,12);R(x,'#DDB27C',X+bp,Y+2,3,1);R(x,'#A97A47',X+bp,Y+13,3,1);}
      R(x,'#5E3E22',X,Y+1,16,1);R(x,'#5E3E22',X,Y+14,16,1);
    }
    if(ch==='='){ // railway
      R(x,'#9C8C78',X,Y,16,16);
      for(var g2=0;g2<10;g2++)R(x,rnd()<.5?'#867563':'#B3A48F',X+Math.floor(rnd()*16),Y+Math.floor(rnd()*16),1,1);
      for(var tie=1;tie<16;tie+=5){R(x,'#6E4A2E',X+tie,Y+2,3,12);R(x,'#8A6040',X+tie,Y+2,3,1);}
      R(x,'#5E636E',X,Y+4,16,2);R(x,'#C9CED8',X,Y+4,16,1);R(x,'#5E636E',X,Y+10,16,2);R(x,'#C9CED8',X,Y+10,16,1);
    }
    if(ch==='_'){ // wooden platform
      R(x,'#C99A63',X,Y,16,16);for(var pl=0;pl<16;pl+=4){R(x,'#A97A47',X,Y+pl+3,16,1);R(x,'#DDB27C',X,Y+pl,16,1);}
      R(x,'#8A5E35',X+((i*7)%13),Y+1,1,2);
      if(at(i,j-1)==='='){R(x,P.gold,X,Y,16,2);R(x,'#C9A20F',X,Y+2,16,1);}
      if(at(i,j+1)!=='_'){R(x,'#7A5230',X,Y+15,16,1);}
      if(at(i+1,j)!=='_'&&at(i+1,j)!=='='){R(x,'#7A5230',X+15,Y,1,16);}
    }
  }
  return c;
}
function waterAnim(x,X,Y,t,i,j){
  var ph=(t*2+i*0.7+j*1.3);
  var a=Math.floor((Math.sin(ph)+1)*3);
  x.fillStyle=P.wHi;x.fillRect(X+3+a,Y+6,4,1);x.fillRect(X+9-a,Y+10,3,1);
}

/* ───────── objects ───────── */
function tree(kind){
  var c=cv(20,28),x=c.getContext('2d');
  ell(x,10,25,7,2,'rgba(0,0,0,0.22)');
  R(x,P.trunkD,7,17,6,9);R(x,P.trunk,8,17,4,8);R(x,'#A8754F',8,18,1,6);R(x,P.ol,6,25,8,1);
  var L=kind?['#245F2E','#3B8F42','#5BB650','#8ED46A']:[P.leafD,P.leaf1,P.leaf2,P.leaf3];
  disc(x,10,10,9.4,P.ol);disc(x,10,10,8.6,L[0]);disc(x,9,9,7.4,L[1]);disc(x,8,8,5.6,L[2]);disc(x,7,6,3,L[3]);
  // leaf clusters
  [[4,12],[15,12],[12,4],[6,4],[14,8]].forEach(function(p){R(x,L[0],p[0],p[1]+1,3,1);R(x,L[2],p[0],p[1]-1,2,1);});
  R(x,P.leaf4,6,5,2,1);R(x,P.leaf4,5,6,1,1);R(x,'#C9F29A',6,5,1,1);
  return c;
}
function house(opt){
  var w=opt.w||64,h=opt.h||56,c=cv(w,h),x=c.getContext('2d');var roof=opt.roof||P.roof;
  var rh=Math.round(h*0.48),wy=rh-2;
  ell(x,w/2,h-2,w/2-2,3,'rgba(0,0,0,0.2)');
  // wall
  R(x,P.ol,1,wy,w-2,h-wy-3);R(x,opt.wall||P.wall,2,wy+1,w-4,h-wy-5);R(x,P.wallD,2,h-8,w-4,4);
  for(var b=wy+5;b<h-8;b+=5)R(x,shade(opt.wall||P.wall,0.96),2,b,w-4,1);
  if(opt.stone){for(var sy=h-14;sy<h-4;sy+=4)for(var sx=2+(sy%8?0:3);sx<w-3;sx+=7){R(x,P.stone,sx,sy,6,3);R(x,P.stoneD,sx,sy+3,6,1);R(x,P.stoneHi,sx,sy,6,1);}}
  // roof
  for(var r=0;r<rh;r++){var inset=Math.max(0,Math.round((rh-r)*0.22));R(x,P.ol,inset,r,w-inset*2,1);
    R(x,(r%4===3)?shade(roof,0.82):(r<3?shade(roof,1.18):roof),inset+1,r,w-inset*2-2,1);}
  R(x,shade(roof,0.62),1,rh-2,w-2,2);R(x,P.ol,0,rh,w,1);
  for(var k=4;k<w-4;k+=8)R(x,shade(roof,1.25),k,2,3,1);
  if(opt.chimney){R(x,P.ol,w-18,0,8,10);R(x,P.stone,w-17,1,6,8);R(x,P.stoneD,w-17,7,6,2);}
  // door
  var dx=Math.round(w/2-6);R(x,P.ol,dx-1,h-22,14,19);R(x,P.woodD,dx,h-21,12,18);R(x,P.wood,dx+1,h-20,10,16);R(x,P.woodD,dx+5,h-20,1,16);R(x,P.gold,dx+8,h-12,2,2);
  // windows
  [[8],[w-22]].forEach(function(p){var X=p[0],Y=wy+6;R(x,P.ol,X-1,Y-1,16,12);R(x,P.glassD,X,Y,14,10);R(x,P.glass,X+1,Y+1,6,4);R(x,P.glass,X+8,Y+1,5,4);R(x,P.glass,X+1,Y+6,6,3);R(x,P.glass,X+8,Y+6,5,3);R(x,'#FFFFFF',X+2,Y+2,2,1);
    R(x,P.woodD,X-2,Y+10,18,3);R(x,'#F25C6E',X,Y+9,2,2);R(x,'#F5C518',X+5,Y+9,2,2);R(x,'#F25C6E',X+10,Y+9,2,2);R(x,P.leaf2,X+3,Y+9,2,1);R(x,P.leaf2,X+8,Y+9,2,1);});
  if(opt.sign){var sx2=dx-2,sy2=wy+1;R(x,P.ol,sx2-6,sy2,28,7);R(x,opt.signC||P.gold,sx2-5,sy2+1,26,5);if(opt.signDots)opt.signDots(x,sx2-5,sy2+1);}
  return c;
}
var BLADE=null;
function blade(){if(BLADE)return BLADE;var c=cv(9,26),x=c.getContext('2d');
  R(x,P.ol,3,0,3,26);R(x,P.woodD,4,0,1,26);
  R(x,P.ol,0,7,9,19);R(x,'#FFF6E6',1,8,7,17);R(x,'#EADBC0',1,8,1,17);
  for(var k=11;k<25;k+=4)R(x,'#C9B48A',1,k,7,1);R(x,'#C9B48A',4,8,1,17);
  return BLADE=c;}
function sails(x,cx,cy,t){
  var b=blade(),step=Math.floor(t*6)%8,an=step*Math.PI/16;
  x.save();x.imageSmoothingEnabled=false;x.translate(Math.round(cx),Math.round(cy));
  for(var k=0;k<4;k++){x.save();x.rotate(an+k*Math.PI/2);x.drawImage(b,-4,-27);x.restore();}
  x.restore();
  disc(x,cx,cy,3,P.ol);disc(x,cx,cy,2,P.gold);R(x,'#FFF3B0',cx-1,cy-1,1,1);
}
function stall(kind){
  var c=cv(48,40),x=c.getContext('2d');ell(x,24,37,22,2,'rgba(0,0,0,0.2)');
  R(x,P.ol,3,10,3,26);R(x,P.ol,42,10,3,26);R(x,P.wood,4,11,1,24);R(x,P.wood,43,11,1,24);
  R(x,P.ol,1,24,46,13);R(x,P.wood,2,25,44,4);R(x,P.woodHi,2,25,44,1);R(x,P.woodD,2,29,44,7);for(var k=6;k<46;k+=8)R(x,'#7A4E2C',k,29,1,7);
  // goods
  if(kind==='bread'){for(var i=0;i<5;i++){var X=6+i*8;R(x,P.ol,X,19,7,6);R(x,'#D9A15A',X+1,20,5,4);R(x,'#F2C98A',X+1,20,5,1);R(x,'#B9803E',X+2,22,1,1);R(x,'#B9803E',X+4,22,1,1);}}
  if(kind==='ribbon'){var cols=['#E04F6A','#55C8E8','#F5C518','#2DB87A','#6B3FA0'];for(var j=0;j<5;j++){var Y=6+j*8;disc(x,Y+2,21,3.4,P.ol);disc(x,Y+2,21,2.5,cols[j]);R(x,'#FFFFFF',Y+1,20,1,1);}R(x,cols[0],12,24,10,2);}
  if(kind==='jars'){for(var q=0;q<5;q++){var Z=6+q*8;R(x,P.ol,Z,16,7,9);R(x,'#BFE8F8',Z+1,17,5,7);R(x,q%2?'#F5C518':'#E07B39',Z+1,20,5,4);R(x,'#9A6A44',Z,15,7,2);}}
  // awning
  for(var r=0;r<11;r++){R(x,P.ol,0,r,48,1);for(var s2=0;s2<46;s2+=6)R(x,(s2/6)%2?'#FFF3DE':(r<2?'#E68E5E':'#CC6A3E'),1+s2,r,6,1);}
  for(var s3=0;s3<48;s3+=6){R(x,P.ol,s3,11,6,2);R(x,(s3/6)%2?'#FFF3DE':'#CC6A3E',s3+1,11,4,1);R(x,P.ol,s3+2,13,2,1);}
  R(x,'rgba(0,0,0,0.12)',4,14,40,3);
  return c;
}
function stand(f){
  var c=cv(64,48),x=c.getContext('2d');ell(x,28,45,26,2,'rgba(0,0,0,0.2)');
  if(!f.counter){ // an empty stall frame, clearly a stand waiting to be built
    R(x,P.ol,3,4,4,42);R(x,P.wood,4,5,2,40);R(x,P.ol,49,4,4,42);R(x,P.wood,50,5,2,40);
    R(x,P.ol,1,2,54,6);R(x,P.woodHi,2,3,52,4);
    R(x,P.ol,10,10,36,13);R(x,'#FFF3DE',11,11,34,11);
    for(var q=0;q<5;q++){R(x,'#F28C28',14+q*6,13,4,6);R(x,P.ol,14+q*6,13,4,1);}
    R(x,P.ol,8,33,40,3);R(x,'#D9BFA6',8,36,40,8);for(var z=10;z<46;z+=6)R(x,'#C9A383',z,37,3,6);
    return c;}
  if(f.open){R(x,P.ol,3,4,3,40);R(x,P.ol,50,4,3,40);R(x,P.wood,4,5,1,38);R(x,P.wood,51,5,1,38);
    for(var r=0;r<9;r++){R(x,P.ol,0,r,56,1);for(var s=0;s<54;s+=6)R(x,(s/6)%2?'#FFF3DE':'#F28C28',1+s,r,6,1);}
    for(var s2=0;s2<56;s2+=6){R(x,P.ol,s2,9,6,2);R(x,(s2/6)%2?'#FFF3DE':'#F28C28',s2+1,9,4,1);}
    R(x,P.ol,20,0,16,1);R(x,'#2DB87A',22,-1,12,0);}
  R(x,P.ol,1,30,54,15);R(x,P.wood,2,31,52,4);R(x,P.woodHi,2,31,52,1);R(x,P.woodD,2,35,52,9);for(var k=8;k<54;k+=10)R(x,'#7A4E2C',k,35,1,9);
  R(x,'#F28C28',18,38,20,3);
  if(f.jugs){for(var j=0;j<4;j++){var X=5+j*11;R(x,P.ol,X,19,9,12);R(x,'#F28C28',X+1,20,7,10);R(x,'#FFC27A',X+2,21,2,6);R(x,P.ol,X+3,16,3,4);R(x,'#FDE1B8',X+4,17,1,2);}R(x,P.ol,47,23,7,8);R(x,'#FDE1B8',48,24,5,6);R(x,'#F28C28',48,27,5,3);}
  if(f.flour){R(x,P.ol,54,31,10,13);R(x,'#F2E6CC',55,32,8,11);R(x,'#FFFFFF',56,33,2,6);R(x,P.ol,55,30,8,2);R(x,'#C9A26B',57,37,4,3);}
  if(f.cart){R(x,P.ol,54,30,10,9);R(x,'#C56C3F',55,31,8,7);disc(x,57,41,2.6,P.ol);disc(x,57,41,1.4,'#8E8E9A');disc(x,62,41,2.6,P.ol);}
  return c;
}
function hatStall(){var c=stall('jars'),x=c.getContext('2d');R(x,'#FFF3DE',3,15,42,9);
  var cols=['#D9443B','#2DB87A','#F27A93','#8E5B3A'];for(var i=0;i<4;i++){var X=5+i*10;R(x,P.ol,X,16,9,8);R(x,cols[i],X+1,17,7,6);R(x,'#FFFFFF',X+2,18,2,1);}return c;}
function bush(){var c=cv(16,16),x=c.getContext('2d');ell(x,8,14,7,2,'rgba(0,0,0,0.2)');disc(x,8,9,6.6,P.ol);disc(x,8,9,5.8,P.leaf1);disc(x,7,8,4.2,P.leaf2);disc(x,6,7,2,P.leaf3);R(x,'#F25C6E',10,8,1,1);R(x,'#F25C6E',5,11,1,1);R(x,'#FFFFFF',11,11,1,1);return c;}
function shed(){
  var c=cv(64,52),x=c.getContext('2d');
  ell(x,32,49,30,3,'rgba(0,0,0,0.2)');
  R(x,P.ol,2,18,60,30);R(x,'#4A3424',3,19,58,27);
  // logs inside
  for(var r=0;r<3;r++)for(var k=0;k<6;k++){var cx=10+k*9+(r%2)*4,cy=40-r*7;if(cx>56)continue;disc(x,cx,cy,3.6,P.ol);disc(x,cx,cy,2.8,'#D9A86E');R(x,'#B98450',cx-1,cy,3,1);}
  for(var p=2;p<62;p+=58){R(x,P.ol,p,14,5,34);R(x,P.wood,p+1,15,3,32);}
  for(var rr=0;rr<16;rr++){R(x,P.ol,0,rr,64,1);R(x,rr%4===3?'#8A6B4A':(rr<3?'#C9A57A':'#A8845C'),1,rr,62,1);}
  R(x,'#6E5136',1,14,62,3);R(x,P.ol,0,17,64,1);
  R(x,P.ol,20,4,24,9);R(x,P.gold,21,5,22,7);R(x,P.woodD,24,7,16,1);R(x,P.woodD,24,9,12,1);
  return c;
}
function logs(){
  var c=cv(34,26),x=c.getContext('2d');ell(x,17,23,15,2,'rgba(0,0,0,0.2)');
  var pos=[[6,19],[15,19],[24,19],[10,12],[19,12],[14.5,5]];
  pos.forEach(function(p){R(x,P.ol,p[0]-1,p[1]-4,10,9);R(x,'#9A6A40',p[0],p[1]-3,8,7);disc(x,p[0]+1,p[1],3.6,P.ol);disc(x,p[0]+1,p[1],2.8,'#E2B67E');R(x,'#B98450',p[0],p[1],3,1);R(x,'#B98450',p[0]+1,p[1]-1,1,3);});
  return c;
}
function fountain(x,t){ // drawn at 48×40 local
  ell(x,24,34,22,4,'rgba(0,0,0,0.2)');
  R(x,P.ol,1,14,46,22);R(x,P.stone,2,15,44,19);R(x,P.stoneHi,2,15,44,2);R(x,P.stoneD,2,31,44,3);
  for(var k=6;k<44;k+=8)R(x,P.stoneD,k,18,1,13);
  R(x,P.ol,4,17,40,8);R(x,P.w2,5,18,38,6);
  var a=Math.floor(t*6)%3;R(x,P.wHi,8+a*3,20,4,1);R(x,P.wHi,26+a*2,22,5,1);R(x,P.wHi,17-a,19,3,1);
  R(x,P.ol,20,4,8,16);R(x,P.stone,21,5,6,14);R(x,P.stoneHi,21,5,2,14);
  // jets
  var j=Math.floor(t*8)%2;
  R(x,P.wHi,23,0,2,5);R(x,P.w1,22,1+j,1,4);R(x,P.w1,25,1+(1-j),1,4);
  for(var s=0;s<5;s++){R(x,P.w1,19-s,2+s*2+j,1,2);R(x,P.w1,28+s,2+s*2+(1-j),1,2);}
  R(x,'#FFFFFF',14+j*2,12,1,1);R(x,'#FFFFFF',32-j*2,11,1,1);
}
function well(fixed){
  var c=cv(32,40),x=c.getContext('2d');
  ell(x,16,37,14,3,'rgba(0,0,0,0.2)');
  R(x,P.ol,3,24,26,14);R(x,P.stone,4,25,24,11);R(x,P.stoneHi,4,25,24,2);
  for(var k=4;k<28;k+=6){R(x,P.stoneD,k,28,1,8);}R(x,P.stoneD,4,31,24,1);
  R(x,P.ol,6,22,20,5);R(x,P.w3,7,23,18,3);R(x,P.w2,9,23,8,1);
  R(x,P.ol,4,6,3,20);R(x,P.wood,5,7,1,18);R(x,P.ol,25,6,3,20);R(x,P.wood,26,7,1,18);
  R(x,P.ol,9,12,14,1);R(x,P.woodD,10,10,12,2);
  R(x,P.ol,14,13,1,7);R(x,P.ol,12,19,6,5);R(x,'#9AA6B2',13,20,4,3);
  for(var r=0;r<8;r++){var ins=Math.round((8-r)*1.1);R(x,P.ol,ins,r,32-ins*2,1);R(x,r%3===2?P.roofD:P.roof,ins+1,r,30-ins*2,1);}
  R(x,P.roofD,1,7,30,2);R(x,P.ol,0,9,32,1);
  return c;
}
function signpost(kind,fixed){
  var c=cv(16,22),x=c.getContext('2d');
  ell(x,8,20,5,1,'rgba(0,0,0,0.2)');
  R(x,P.ol,6,9,4,12);R(x,P.wood,7,10,2,10);
  R(x,P.ol,0,1,16,10);R(x,kind==='well'?'#F7EBD3':P.woodHi,1,2,14,8);R(x,P.woodD,1,9,14,1);
  if(kind==='well'){
    if(fixed){R(x,'#3A6B9A',3,4,3,1);R(x,'#3A6B9A',7,4,6,1);R(x,'#2DB87A',3,6,10,1);R(x,P.gold,12,2,2,2);}
    else {R(x,'#5B2E10',3,4,3,1);R(x,'#5B2E10',7,4,6,1);R(x,'#5B2E10',3,6,4,1);disc(x,10,6,2.6,'rgba(90,86,100,0.9)');R(x,'#9A95A3',9,5,2,1);}
  } else {R(x,P.woodD,3,4,10,1);R(x,P.woodD,3,6,7,1);}
  return c;
}
function lamp(){var c=cv(10,30),x=c.getContext('2d');ell(x,5,28,3,1,'rgba(0,0,0,0.2)');R(x,P.ol,4,8,3,21);R(x,'#3E4C74',5,9,1,19);R(x,P.ol,1,1,9,9);R(x,'#FFE89A',2,3,7,5);R(x,'#FFF8D6',3,4,3,2);R(x,'#3E4C74',1,0,9,2);R(x,P.ol,2,27,7,2);return c;}
function bench(){var c=cv(30,16),x=c.getContext('2d');ell(x,15,14,13,1,'rgba(0,0,0,0.2)');R(x,P.ol,1,2,28,10);R(x,P.wood,2,3,26,3);R(x,P.woodHi,2,3,26,1);R(x,P.wood,2,7,26,3);R(x,P.woodD,2,9,26,1);R(x,P.ol,3,11,3,4);R(x,P.ol,24,11,3,4);return c;}
function barrier(){var c=cv(16,16),x=c.getContext('2d');R(x,P.ol,0,4,16,7);for(var i=0;i<14;i+=4){R(x,'#F2F2F2',1+i,5,2,5);R(x,'#E04F4F',3+i,5,2,5);}R(x,P.ol,2,11,2,5);R(x,P.ol,12,11,2,5);return c;}
function crate(){var c=cv(16,16),x=c.getContext('2d');R(x,P.ol,1,2,14,13);R(x,P.wood,2,3,12,11);R(x,P.woodD,2,8,12,1);R(x,P.woodD,7,3,1,11);R(x,P.woodHi,2,3,12,1);return c;}
function fencePiece(h,v){var c=cv(16,20),x=c.getContext('2d');R(x,P.ol,6,4,4,14);R(x,'#D9AE76',7,5,2,12);R(x,'#F0CFA0',7,5,1,3);if(h){R(x,P.ol,0,7,16,3);R(x,'#C99A63',0,8,16,1);R(x,P.ol,0,12,16,3);R(x,'#C99A63',0,13,16,1);}if(v){R(x,P.ol,6,0,4,4);R(x,'#D9AE76',7,0,2,4);}return c;}
function train(t){ // 112×36 steam engine + car
  var c=cv(112,40),x=c.getContext('2d');
  ell(x,56,37,54,2,'rgba(0,0,0,0.25)');
  // passenger car
  R(x,P.ol,4,8,52,26);R(x,'#3A6B9A',5,9,50,22);R(x,'#2C5378',5,27,50,4);R(x,P.gold,5,13,50,1);
  for(var k=9;k<50;k+=11){R(x,P.ol,k,15,8,8);R(x,'#BFE8F8',k+1,16,6,6);R(x,'#FFFFFF',k+1,16,2,1);}
  R(x,P.ol,4,5,52,4);R(x,'#2C5378',5,6,50,2);
  // engine
  R(x,P.ol,60,2,22,30);R(x,'#C9443A',61,3,20,25);R(x,'#9E3028',61,24,20,4);R(x,P.ol,64,6,14,9);R(x,'#BFE8F8',65,7,12,7);R(x,P.gold,61,17,20,1);
  R(x,P.ol,80,12,30,20);R(x,P.navy,81,13,28,15);R(x,'#22346B',81,24,28,4);for(var b=84;b<108;b+=6)R(x,P.gold,b,13,1,15);
  R(x,P.ol,100,0,7,13);R(x,'#22346B',101,1,5,11);R(x,P.ol,98,0,11,3);R(x,'#3A3A46',99,1,9,1);
  R(x,P.ol,107,22,5,8);R(x,'#C9443A',108,23,3,6);
  // wheels
  [[12,32],[44,32],[68,31],[86,31],[100,31]].forEach(function(p){disc(x,p[0],p[1],4.4,P.ol);disc(x,p[0],p[1],3.4,'#4A4A58');disc(x,p[0],p[1],1.4,P.gold);});
  R(x,P.ol,66,30,36,2);
  return c;
}
function smoke(x,ox,oy,t){for(var k=0;k<4;k++){var ph=(t*0.6+k*0.25)%1;var r=2+ph*5;var a=(1-ph)*0.8;
  x.fillStyle='rgba(240,240,245,'+a.toFixed(2)+')';var cx=ox+ph*-14+Math.sin(ph*6+k)*2,cy=oy-ph*26;disc(x,cx,cy,r,'rgba(240,240,245,'+a.toFixed(2)+')');}}
function item(kind){
  var c=cv(16,16),x=c.getContext('2d');
  if(kind==='mm'){R(x,P.ol,6,5,4,8);R(x,'#F5C518',7,6,2,6);R(x,'#FFF3B0',7,6,1,6);}
  if(kind==='cm'){R(x,P.ol,4,4,9,9);R(x,'#55C8E8',5,5,7,7);R(x,'#A9E9F8',5,5,7,1);R(x,'#2D8DB0',5,11,7,1);for(var i=6;i<12;i+=2)R(x,'#1F6F8F',i,8,1,2);}
  if(kind==='plank'){R(x,P.ol,0,5,16,6);R(x,'#C98A4E',1,6,14,4);R(x,'#E2AC70',1,6,14,1);R(x,'#9A6334',3,8,5,1);R(x,'#9A6334',9,7,4,1);R(x,P.ol,12,9,1,1);}
  if(kind==='sack'){R(x,P.ol,3,3,10,12);R(x,'#F2E6CC',4,4,8,10);R(x,P.ol,5,2,6,2);R(x,'#C9A26B',6,8,4,3);R(x,'#FFFFFF',5,5,2,4);}
  if(kind==='rope'){R(x,P.ol,3,4,10,9);R(x,'#D9B27A',4,5,8,7);R(x,'#B88A50',5,7,6,1);R(x,'#B88A50',5,9,6,1);R(x,'#F0D3A0',6,6,4,1);R(x,P.ol,6,8,4,1);R(x,P.ol,12,10,3,2);R(x,'#D9B27A',13,10,2,1);}
  if(kind==='m'){R(x,P.ol,1,6,15,5);R(x,'#E07B39',2,7,13,3);R(x,'#F4A974',2,7,13,1);for(var j=3;j<15;j+=2)R(x,P.ol,j,9,1,1);for(var j2=4;j2<15;j2+=4)R(x,P.ol,j2,8,1,2);}
  return c;
}
function sparkle(x,X,Y,t,col){var f=Math.floor(t*6)%4;var s=[0,1,2,1][f];x.fillStyle=col||'#FFFFFF';
  x.fillRect(X,Y-s-1,1,s*2+3);x.fillRect(X-s-1,Y,s*2+3,1);if(s>1){x.fillRect(X-1,Y-1,3,3);}}
function bubble(x,X,Y,t,kind){
  var bob=Math.round(Math.sin(t*5)*1);Y+=bob;
  R(x,P.ol,X-5,Y-10,11,10);R(x,'#FFFFFF',X-4,Y-9,9,8);R(x,P.ol,X-1,Y,3,2);R(x,'#FFFFFF',X,Y-1,1,2);
  if(kind==='!'){R(x,'#E04F4F',X,Y-8,1,4);R(x,'#E04F4F',X,Y-3,1,1);}
  else {R(x,P.ol,X-2,Y-5,1,1);R(x,P.ol,X,Y-5,1,1);R(x,P.ol,X+2,Y-5,1,1);}
}
return {P:P,TS:TS,cv:cv,shade:shade,R:R,disc:disc,ell:ell,buildChar:buildChar,buildOwl:buildOwl,drawSmudge:drawSmudge,DIRI:DIRI,
  groundCanvas:groundCanvas,stall:stall,bush:bush,stand:stand,hatStall:hatStall,waterAnim:waterAnim,tree:tree,house:house,sails:sails,shed:shed,logs:logs,fountain:fountain,well:well,
  signpost:signpost,lamp:lamp,bench:bench,barrier:barrier,crate:crate,fencePiece:fencePiece,train:train,smoke:smoke,item:item,sparkle:sparkle,bubble:bubble};
})();
