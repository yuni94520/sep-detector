/* ======== 土星錨點：宇宙背景（預先繪製星場＋星雲＋銀河帶＋遠方巨行星；每幀只做視差、閃爍、流星、環面塵埃） ======== */
const COS={cv:document.createElement('canvas'),w:0,h:0,tw:[],dust:[],met:null,nextMet:0};
function cosmosBuild(){const c=COS.cv,pad=60;c.width=(W+pad*2)*DPR;c.height=(H+pad*2)*DPR;const g=c.getContext('2d');g.setTransform(DPR,0,0,DPR,0,0);
  const w=W+pad*2,h=H+pad*2,R=(a,b)=>a+Math.random()*(b-a);
  g.fillStyle="#02060f";g.fillRect(0,0,w,h);
  // 星雲（冷色、低飽和）
  [[.18,.28,.55,"40,60,90",.18],[.82,.72,.5,"18,90,120",.12],[.62,.18,.35,"120,90,50",.07],[.3,.85,.4,"30,60,90",.10]].forEach(([x,y,r,c,a])=>{
    const gr=g.createRadialGradient(w*x,h*y,0,w*x,h*y,Math.max(w,h)*r);gr.addColorStop(0,`rgba(${c},${a})`);gr.addColorStop(.5,`rgba(${c},${a*.35})`);gr.addColorStop(1,`rgba(${c},0)`);g.fillStyle=gr;g.fillRect(0,0,w,h)});
  // 銀河帶（斜向）
  g.save();g.translate(w/2,h/2);g.rotate(-.42);
  const band=g.createLinearGradient(0,-h*.22,0,h*.22);band.addColorStop(0,"rgba(150,170,230,0)");band.addColorStop(.5,"rgba(150,170,230,.07)");band.addColorStop(1,"rgba(150,170,230,0)");g.fillStyle=band;g.fillRect(-w,-h*.22,w*2,h*.44);
  // 銀河光雲：柔光團沿帶狀分布，中間一道暗色塵埃帶（參考銀河照片）
  for(let i=0;i<520;i++){const gx=R(-w,w),gy=(Math.random()+Math.random()-1)*h*.09,r=R(18,70),warm=Math.random()<.35,cg=g.createRadialGradient(gx,gy,0,gx,gy,r);
    cg.addColorStop(0,warm?"rgba(255,228,200,.06)":"rgba(170,190,255,.055)");cg.addColorStop(1,"rgba(170,190,255,0)");g.fillStyle=cg;g.fillRect(gx-r,gy-r,r*2,r*2)}
  for(let i=0;i<7000;i++){const gx=R(-w,w),gy=(Math.random()+Math.random()+Math.random()-1.5)*h*.12;g.globalAlpha=R(.08,.55);g.fillStyle=Math.random()<.8?"#d7e2ff":"#ffe9d6";const z=R(.4,1.2);g.fillRect(gx,gy,z,z)}
  g.globalAlpha=1;for(let i=0;i<260;i++){const gx=R(-w,w),gy=Math.sin(gx*.004)*h*.018+R(-1,1)*h*.012,r=R(10,34),dg=g.createRadialGradient(gx,gy,0,gx,gy,r);dg.addColorStop(0,"rgba(2,4,10,.22)");dg.addColorStop(1,"rgba(2,4,10,0)");g.fillStyle=dg;g.fillRect(gx-r,gy-r,r*2,r*2)}
  g.restore();g.globalAlpha=1;
  // 背景星場
  for(let i=0;i<1500;i++){const s=Math.pow(Math.random(),3)*1.6+.3;g.globalAlpha=R(.15,.85);g.fillStyle=["#ffffff","#d8e4ff","#bcd2ff","#ffeedd"][Math.floor(Math.random()*4)];g.beginPath();g.arc(R(0,w),R(0,h),s*.6,0,6.283);g.fill()}
  g.globalAlpha=1;
  // 遠方巨行星（右下，只露出被照亮的弧邊）
  const pr=Math.min(w,h)*.42,px=w*.98,py=h*1.08;const body=g.createRadialGradient(px-pr*.35,py-pr*.45,pr*.1,px,py,pr);
  body.addColorStop(0,"rgba(60,70,140,.55)");body.addColorStop(.7,"rgba(18,22,52,.9)");body.addColorStop(1,"rgba(6,9,22,1)");g.fillStyle=body;g.beginPath();g.arc(px,py,pr,0,6.283);g.fill();
  g.strokeStyle="rgba(150,175,255,.35)";g.lineWidth=2;g.beginPath();g.arc(px,py,pr,Math.PI*1.08,Math.PI*1.55);g.stroke();
  const atm=g.createRadialGradient(px,py,pr,px,py,pr*1.12);atm.addColorStop(0,"rgba(120,150,255,.18)");atm.addColorStop(1,"rgba(120,150,255,0)");g.fillStyle=atm;g.beginPath();g.arc(px,py,pr*1.12,0,6.283);g.fill();
  // 會閃爍的亮星
  COS.tw=[];for(let i=0;i<46;i++)COS.tw.push({x:Math.random(),y:Math.random(),s:R(.8,1.8),ph:Math.random()*6.28,sp:R(.6,1.6)});
  // 環面塵埃
  COS.dust=[];for(let i=0;i<900;i++)COS.dust.push({k:1.25+Math.pow(Math.random(),.8)*1.6,a:Math.random()*6.283,sp:R(.6,1.2),s:R(.4,1.1),o:R(.15,.55)});
  COS.w=W;COS.h=H;COS.pad=pad}
/* ======== 土星錨點旁的銀河系：預先畫一張旋臂星系貼圖，每幀只做傾斜＋緩慢自轉 ======== */
const GAL={cv:null,S:640};
function galBuild(){const S=GAL.S=900,c=document.createElement('canvas');c.width=c.height=S;const g=c.getContext('2d'),C=S/2;let sd=11;const R=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
  const blob=(x,y,r,col,a)=>{const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${col},${a})`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)};
  const NA=2,armPt=(arm,u,sc)=>{const r=C*(.05+.9*u),th=arm*6.283/NA+(arm>1?.8:0)+Math.log(r/(C*.05))*2.3,x=C+Math.cos(th)*r+Math.cos(th+1.57)*sc,y=C+Math.sin(th)*r+Math.sin(th+1.57)*sc;return [x,y]};
  g.globalCompositeOperation="lighter";
  // 藍色外盤暈光
  blob(C,C,C,"70,110,200",.22);blob(C,C,C*.6,"120,150,230",.16);
  for(let i=0;i<420;i++){const a=R()*6.283,r=C*(.35+.6*Math.sqrt(R()));blob(C+Math.cos(a)*r,C+Math.sin(a)*r,R()*40+16,"90,150,230",.05)}
  // 旋臂雲團：內白、中粉、外藍
  for(let arm=0;arm<2;arm++)for(let i=0;i<2600;i++){const u=Math.pow(R(),.85),[x,y]=armPt(arm,u,(R()-.5)*(R()-.5)*C*(.9+.5*u)),col=u<.2?"255,232,205":u<.6?(R()<.55?"235,170,200":"250,215,230"):(R()<.65?"120,170,255":"220,170,210");
    blob(x,y,(8+R()*24)*(1-u*.25),col,.028+.03*(1-u))}
  for(let i=0;i<900;i++){const u=.15+.8*R(),a=R()*6.283,rr=C*(.05+.9*u);blob(C+Math.cos(a)*rr,C+Math.sin(a)*rr,6+R()*16,u<.5?"235,190,215":"110,160,250",.03)}
  // 細星點
  for(let arm=0;arm<2;arm++)for(let i=0;i<9000;i++){const u=Math.pow(R(),.75),[x,y]=armPt(arm,u,(R()-.5)*(R()-.5)*C*(1+.4*u)),k=R();g.globalAlpha=.15+.45*R();
    g.fillStyle=k<.1?"#9cc8ff":k<.16?"#ff8fb4":u<.3?"#fff0dc":"#f2e6ff";const z=.6+R()*1.2;g.fillRect(x,y,z,z)}
  g.globalAlpha=1;
  // 粉紅星雲結（HII 區）
  for(let arm=0;arm<2;arm++)for(let i=0;i<90;i++){const u=.25+.6*R(),[x,y]=armPt(arm,u,(R()-.5)*C*.12);blob(x,y,3+R()*7,"255,80,130",.5)}
  // 塵埃帶：沿旋臂內緣的紅褐色暗紋
  g.globalCompositeOperation="source-over";
  for(let arm=0;arm<2;arm++)for(let i=0;i<1400;i++){const u=.06+.8*Math.pow(R(),.9),[x,y]=armPt(arm,u,-C*.09+(R()-.5)*C*.12);blob(x,y,3+R()*10,R()<.5?"40,12,20":"80,32,36",.2)}
  // 核心
  g.globalCompositeOperation="lighter";g.save();g.translate(C,C);g.rotate(.5);g.scale(1,.72);
  let gr=g.createRadialGradient(0,0,0,0,0,C*.48);gr.addColorStop(0,"rgba(255,255,250,1)");gr.addColorStop(.1,"rgba(255,248,225,.95)");gr.addColorStop(.3,"rgba(255,222,180,.45)");gr.addColorStop(.6,"rgba(240,190,180,.12)");gr.addColorStop(1,"rgba(255,200,150,0)");g.fillStyle=gr;g.beginPath();g.arc(0,0,C*.48,0,6.283);g.fill();g.restore();
  GAL.cv=c;
  // 遠方側向小星系
  const e=document.createElement('canvas');e.width=240;e.height=60;const q=e.getContext('2d');q.globalCompositeOperation="lighter";q.translate(120,30);q.scale(1,.18);
  gr=q.createRadialGradient(0,0,0,0,0,110);gr.addColorStop(0,"rgba(255,248,230,1)");gr.addColorStop(.2,"rgba(255,215,170,.55)");gr.addColorStop(1,"rgba(200,170,140,0)");q.fillStyle=gr;q.beginPath();q.arc(0,0,110,0,6.283);q.fill();
  q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation="source-over";q.fillStyle="rgba(30,12,10,.55)";q.fillRect(30,29,180,2);GAL.edge=e}
function drawGalaxy(t,dx,dy){if(!GAL.cv)galBuild();const narrow=W<860,r=Math.min(W,H)*(narrow?.22:.29),
    gx=narrow?W*.78:Math.min(W-r*.85,Math.max(SAT.x+SAT.R*2.6+r*.85,W*.83)),gy=narrow?H*.78:H*.42;
  ctx.save();ctx.translate(gx+dx*.8,gy+dy*.8);ctx.rotate(-.45);ctx.scale(1,.5);ctx.rotate(t*.000035);ctx.globalCompositeOperation="lighter";ctx.globalAlpha=1;
  ctx.drawImage(GAL.cv,-r,-r,r*2,r*2);ctx.restore();
  // 側向小星系＋十字星芒亮星
  ctx.save();ctx.globalCompositeOperation="lighter";ctx.translate(gx-r*.55+dx*.5,gy+r*1.05+dy*.5);ctx.rotate(-.12);ctx.globalAlpha=.8;ctx.drawImage(GAL.edge,-r*.32,-r*.08,r*.64,r*.16);ctx.restore();
  const now=performance.now();ctx.save();ctx.globalCompositeOperation="lighter";ctx.strokeStyle="#eaf2ff";
  for(const [ox,oy,sz,ph] of [[-.7,-.55,1,0],[.55,-.35,.8,2],[.25,.5,.9,4],[-.35,.25,.6,1],[.85,.2,.7,3]]){const tw=.6+.4*Math.sin(now*.0018+ph),x=gx+ox*r+dx*.8,y=gy+oy*r*.6+dy*.8,l=r*.09*sz*tw;
    ctx.globalAlpha=.85*tw;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-l,y);ctx.lineTo(x+l,y);ctx.moveTo(x,y-l);ctx.lineTo(x,y+l);ctx.stroke();ctx.beginPath();ctx.fillStyle="#fff";ctx.arc(x,y,1.6*sz,0,6.283);ctx.fill()}
  ctx.restore()}
function drawCosmos(t,now){if(COS.w!==W||COS.h!==H)cosmosBuild();const pad=COS.pad;
  // 緩慢視差漂移：像鏡頭在太空中呼吸
  const dx=Math.sin(t*.000045)*pad*.6,dy=Math.cos(t*.00003)*pad*.4;ctx.drawImage(COS.cv,-pad+dx,-pad+dy,W+pad*2,H+pad*2);
  for(const s of COS.tw){const a=.35+.65*Math.max(0,Math.sin(now*.0016*s.sp+s.ph));const x=s.x*W+dx*.6,y=s.y*H+dy*.6,r=s.s*(1+a);
    ctx.globalAlpha=a*.85;ctx.fillStyle="#eef4ff";ctx.beginPath();ctx.arc(x,y,r*.7,0,6.283);ctx.fill();
    ctx.globalAlpha=a*.35;ctx.fillRect(x-r*4,y-.4,r*8,.8);ctx.fillRect(x-.4,y-r*4,.8,r*8)}
  ctx.globalAlpha=1;
  drawGalaxy(t,dx,dy);
  // 流星：每 1.5–4 秒一顆，約 15% 是帶火花的火流星，偶爾一次來 3–4 顆的流星雨
  if(!COS.mets)COS.mets=[];
  if(now>COS.nextMet){const shower=Math.random()<.15,n=shower?3+Math.floor(Math.random()*2):1,a0=.35+Math.random()*.5,sx=Math.random()*W*.75,sy=-20+Math.random()*H*.3;
    for(let k=0;k<n;k++){const fire=!shower&&Math.random()<.15;COS.mets.push({x:sx+(Math.random()-.5)*W*.25,y:sy+(Math.random()-.5)*H*.15,a:a0+(Math.random()-.5)*.06,t0:now+k*(150+Math.random()*350),dur:fire?1500:650+Math.random()*500,sp:(fire?.55:.38+Math.random()*.2)*Math.hypot(W,H),len:fire?260:90+Math.random()*150,w:fire?2.6:1+Math.random()*.8,fire,sparks:[]})}
    COS.nextMet=now+1500+Math.random()*2500}
  ctx.save();ctx.globalCompositeOperation="lighter";
  for(let i=COS.mets.length-1;i>=0;i--){const m=COS.mets[i],k=(now-m.t0)/m.dur;if(k<0)continue;if(k>1&&!m.sparks.length){COS.mets.splice(i,1);continue}
    if(k<=1){const fade=k<.15?k/.15:1-Math.pow((k-.15)/.85,2),d=k*m.sp,hx=m.x+Math.cos(m.a)*d,hy=m.y+Math.sin(m.a)*d,tx=hx-Math.cos(m.a)*m.len,ty=hy-Math.sin(m.a)*m.len;
      const lg=ctx.createLinearGradient(tx,ty,hx,hy);lg.addColorStop(0,"rgba(150,190,255,0)");lg.addColorStop(.7,`rgba(200,225,255,${.35*fade})`);lg.addColorStop(1,`rgba(255,255,255,${.95*fade})`);
      ctx.strokeStyle=lg;ctx.lineWidth=m.w;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(hx,hy);ctx.stroke();
      const hr=m.fire?14:6,hg=ctx.createRadialGradient(hx,hy,0,hx,hy,hr);hg.addColorStop(0,`rgba(255,255,255,${fade})`);hg.addColorStop(.35,m.fire?`rgba(255,200,120,${.6*fade})`:`rgba(190,220,255,${.45*fade})`);hg.addColorStop(1,"rgba(190,220,255,0)");ctx.fillStyle=hg;ctx.beginPath();ctx.arc(hx,hy,hr,0,6.283);ctx.fill();
      if(m.fire&&Math.random()<.8)m.sparks.push({x:hx,y:hy,vx:(Math.random()-.5)*1.2-Math.cos(m.a)*.6,vy:(Math.random()-.5)*1.2-Math.sin(m.a)*.6+.2,l:1})}
    for(let j=m.sparks.length-1;j>=0;j--){const p=m.sparks[j];p.x+=p.vx;p.y+=p.vy;p.vy+=.02;p.l-=.03;if(p.l<=0){m.sparks.splice(j,1);continue}ctx.fillStyle=`rgba(255,${180+60*p.l|0},120,${p.l})`;ctx.fillRect(p.x,p.y,1.6,1.6)}}
  ctx.restore()}
function drawRingDust(t,front){const R=SAT.R;ctx.fillStyle="#f3e2bd";
  for(const d of COS.dust){const a=d.a+t*.00009*d.sp/d.k;const z=Math.sin(a);if((z>=0)!==front)continue;
    const x=SAT.x+Math.cos(a)*R*d.k,y=SAT.y+Math.sin(a)*R*d.k*.27-Math.cos(a)*R*d.k*.06;ctx.globalAlpha=d.o*(front?1:.5);ctx.fillRect(x,y,d.s,d.s)}
  ctx.globalAlpha=1}
/* ======== 土星錨點：金色機械環儀（參考 THALASSA 風格）——暗色行星＋金色邊光、細密金環、直立刻度環、全息底座、漂浮碎片 ======== */
const GOLDC=(a)=>`rgba(232,194,122,${a})`,WARM=(a)=>`rgba(255,236,196,${a})`;
const DEB=[];for(let i=0;i<26;i++)DEB.push({x:Math.random(),y:Math.random(),s:3+Math.random()*9,a:Math.random()*6.28,va:(Math.random()-.5)*.0006,vx:(Math.random()-.5)*.00002,sides:3+Math.floor(Math.random()*3),z:Math.random()});
function satEllipse(k,flat,a0,a1){ctx.beginPath();ctx.ellipse(SAT.x,SAT.y,SAT.R*k,SAT.R*k*flat,-.09,a0,a1)}
function drawThalBack(t,now){const R=SAT.R,x=SAT.x,y=SAT.y;
  // 漂浮碎片（遠層）
  for(const d of DEB){if(d.z>.5)continue;drawDebris(d,t)}
  // 全息底座
  const by=y+R*1.95;ctx.save();ctx.translate(x,by);
  for(let i=0;i<5;i++){const r=R*(1.05+i*.22),p=((now*.00012)+i*.2)%1;ctx.strokeStyle=i%2?`rgba(120,220,255,${.22+.12*Math.sin(now*.002+i)})`:GOLDC(.5-.07*i);ctx.lineWidth=i===0?1.6:1;
    ctx.beginPath();ctx.ellipse(0,0,r,r*.2,0,0,6.28);ctx.stroke()}
  const bg=ctx.createRadialGradient(0,0,0,0,0,R*1.4);bg.addColorStop(0,"rgba(120,200,255,.12)");bg.addColorStop(1,"rgba(120,200,255,0)");ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,R*1.4,R*.28,0,0,6.28);ctx.fill();
  ctx.strokeStyle=GOLDC(.18);ctx.setLineDash([2,6]);ctx.beginPath();ctx.moveTo(0,-R*.15);ctx.lineTo(0,-(by-y)+R*1.02);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  // 細密金環（後半）
  drawFineRings(false,now);
  // 直立刻度環（後半）
  drawGate(false,now);
  // 行星本體：暗色球＋金色邊光＋大氣
  const body=ctx.createRadialGradient(x-R*.3,y-R*.35,R*.05,x,y,R);body.addColorStop(0,"rgba(52,78,86,.95)");body.addColorStop(.7,"rgba(12,22,30,.97)");body.addColorStop(1,"rgba(4,8,14,1)");
  ctx.fillStyle=body;ctx.beginPath();ctx.arc(x,y,R*1.08,0,6.28);ctx.fill();
  ctx.save();ctx.shadowColor="#ffd9a0";ctx.shadowBlur=LQ?0:(22);ctx.strokeStyle=WARM(.9);ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(x,y,R*1.075,Math.PI*.62,Math.PI*1.42);ctx.stroke();
  ctx.lineWidth=1;ctx.strokeStyle=GOLDC(.55);ctx.beginPath();ctx.arc(x,y,R*1.02,Math.PI*.5,Math.PI*1.6);ctx.stroke();ctx.restore();
  const atm=ctx.createRadialGradient(x,y,R*.95,x,y,R*1.35);atm.addColorStop(0,GOLDC(.14));atm.addColorStop(1,GOLDC(0));ctx.fillStyle=atm;ctx.beginPath();ctx.arc(x,y,R*1.35,0,6.28);ctx.fill()}
function drawFineRings(front,now){const a0=front?0:Math.PI,a1=front?Math.PI:Math.PI*2;
  for(let i=0;i<34;i++){const k=1.3+i*.04,bright=i===6||i===15||i===27;ctx.strokeStyle=bright?WARM(front?.9:.5):GOLDC((front?.4:.2)*(1-i/50));ctx.lineWidth=bright?1.6:.7;
    if(bright){ctx.save();ctx.shadowColor="#ffd9a0";ctx.shadowBlur=LQ?0:(8)}satEllipse(k,.2,a0,a1);ctx.stroke();if(bright)ctx.restore()}
  // 掃過環面的光點
  const p=(now*.00008)%1,ang=a0+(a1-a0)*p,k=1.9;const px=SAT.x+Math.cos(ang)*SAT.R*k,py=SAT.y+Math.sin(ang)*SAT.R*k*.2;
  const g=ctx.createRadialGradient(px,py,0,px,py,18);g.addColorStop(0,WARM(front?.8:.4));g.addColorStop(1,WARM(0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,18,0,6.28);ctx.fill()}
function drawGate(front,now){const R=SAT.R,x=SAT.x,y=SAT.y,rx=R*.5,ry=R*1.62,cx=x-R*.22;
  ctx.save();ctx.translate(cx,y);ctx.rotate(-.05);
  const a0=front?-Math.PI/2:Math.PI/2,a1=front?Math.PI/2:Math.PI*1.5;
  ctx.save();ctx.shadowColor="#e8c27a";ctx.shadowBlur=LQ?0:(front?14:4);ctx.strokeStyle=GOLDC(front?.95:.5);ctx.lineWidth=R*.09;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,a0,a1);ctx.stroke();ctx.restore();
  ctx.strokeStyle="rgba(10,14,20,.75)";ctx.lineWidth=R*.035;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,a0,a1);ctx.stroke();
  // 刻度
  ctx.strokeStyle=WARM(front?.8:.35);ctx.lineWidth=1;const off=now*.00005;ctx.beginPath();
  for(let i=0;i<96;i++){const a=i/96*6.283+off;const inF=Math.cos(a)>=0;if(inF!==front)continue;const c=Math.cos(a),s=Math.sin(a),L=i%8===0?.11:.05;
    ctx.moveTo(c*rx*(1-L*1.6),s*ry*(1-L));ctx.lineTo(c*rx*(1-L*.4),s*ry*(1-L*.25))}ctx.stroke();
  ctx.strokeStyle="rgba(150,210,255,"+(front?.5:.25)+")";ctx.setLineDash([4,5]);ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(0,0,rx*.82,ry*.9,0,a0,a1);ctx.stroke();ctx.setLineDash([]);
  if(front){ctx.shadowColor="#ffd9a0";ctx.shadowBlur=LQ?0:(18);ctx.strokeStyle=WARM(.9);ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(0,0,rx*1.06,ry*1.03,0,-Math.PI*.42,-Math.PI*.12);ctx.stroke()}
  ctx.restore()}
function drawDebris(d,t){const x=(d.x+t*d.vx+10)%1*W,y=d.y*H,s=d.s*(.6+d.z*.8);d.a+=d.va*16;
  ctx.save();ctx.translate(x,y);ctx.rotate(d.a);ctx.beginPath();for(let i=0;i<d.sides;i++){const a=i/d.sides*6.283,r=s*(.7+.3*((i*7)%3)/2);i?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();
  ctx.fillStyle=d.z>.5?"rgba(26,30,36,.95)":"rgba(18,22,28,.8)";ctx.fill();ctx.strokeStyle=GOLDC(d.z>.5?.55:.3);ctx.lineWidth=.8;ctx.stroke();ctx.restore()}
function drawThalFront(t,now){drawFineRings(true,now);drawGate(true,now);for(const d of DEB){if(d.z<=.5)continue;drawDebris(d,t)}}
function drawSaturnBg(){
  const R=SAT.R;
  [[1.65,"衛星環 B · 引用網絡"],[2.35,"外環 A · JCT-VC 提案人"]].forEach(([k,l])=>{if(phase>=3){ctx.font="500 11px 'Noto Sans TC',sans-serif";ctx.fillStyle="#d9c49a";ctx.textAlign="left";ctx.fillText(l,SAT.x+R*k*.72,SAT.y+R*k*.27*.75+14)}});
  const n=fish.filter(f=>vis(f)&&f.who==="q").length+fish.filter(f=>vis(f)&&f.who==="n").length;
  label(SAT.x,SAT.y-R*(phase===0?2.1:1.95)-14,PHASES[phase][1],n.toLocaleString()+" 條",COL.q)}
