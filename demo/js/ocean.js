/* ======== 四大洋全景：專利池生命週期 ======== */
const phaseOf=y=>{let m=MILES[0][1];for(const[yy,t]of MILES)if(y>=yy)m=t;return m};
const OC={fish:[],tr:[],schools:[],tt:0,built:false,q:{},yf:OC_NOW};
const OCEANS=[
 {k:"h264",name:"H.264／AVC 洋",x0:0,x1:.17,col:[30,140,160]},
 {k:"hevc",name:"HEVC／H.265 洋",x0:.17,x1:.56,col:[40,90,255]},
 {k:"vvc",name:"VVC／H.266 洋",x0:.56,x1:.84,col:[100,80,255]},
 {k:"next",name:"H.267／6G 未知海域",x0:.84,x1:1,col:[90,110,130]}];
const OCK=Object.fromEntries(OCEANS.map(o=>[o.k,o]));
const TOPY=()=>Math.max(W<860?150:140,TOPB+(W<860?44:64)), BOTY=()=>H-(mode==="ocean"&&W>=860?150:W<860?96:70);
const WALLX=()=>W*OCK.h264.x1, SEAMX=()=>W*OCK.vvc.x0;
const straitK=()=>OC.yf<2015?0:OC.yf<2018?.3:1;
const velosOn=()=>OC.yf>=2017&&OC.yf<2022;
function hsh(i,j,k){let h=Math.imul(i|0,374761393)^Math.imul(j|0,668265263)^Math.imul(k|0,1440662683);h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296}
function vn(x,y,z){const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),u0=x-xi,v0=y-yi,w0=z-zi;const sm=t=>t*t*(3-2*t),u=sm(u0),v=sm(v0),w=sm(w0),L=(a,b,t)=>a+(b-a)*t,c=(a,b,d)=>hsh(xi+a,yi+b,zi+d);
  return L(L(L(c(0,0,0),c(1,0,0),u),L(c(0,1,0),c(1,1,0),u),v),L(L(c(0,0,1),c(1,0,1),u),L(c(0,1,1),c(1,1,1),u),v),w)}
// 洋流：H.264 是封閉環流（撞到世代邊界就折返）；HEVC 自 2015（JVET 探索）起出現往 VVC 的海峽流，2018（JVET 標準化）後增強
function flowAt(x,y,t){const a=vn(x/300,y/300,t*.00009)*12.566+vn(x/110+40,y/110,t*.00022)*2.2;let fx=Math.cos(a),fy=Math.sin(a);
  const wx=WALLX(),sx=SEAMX(),top=TOPY(),bot=BOTY(),mid=(top+bot)/2,half=(bot-top)/2;
  if(x<wx){const d=wx-x;if(d<50)fx-=(50-d)/50*1.8}
  else{const d=x-wx;if(d<50)fx+=(50-d)/50*1.8;
    if(x<sx+W*.05){const g=Math.exp(-(((y-mid)/(half*.42))**2));fx+=straitK()*1.25*g*Math.min(1,(x-wx)/(W*.12))}else if(x>W*OCK.next.x0-W*.06)fx-=.5}
  return [fx,fy]}
function ocBuild(){
  OC.fish=[];OC.schools=[];OC.q={};
  const mkS=(who,oc,rad,fix)=>{const s={who,oc:OCK[oc],rad,fix,seed:OC.schools.length*13.7+3.1,hx:0,hy:0};OC.schools.push(s);return s};
  const add=o=>{OC.fish.push(Object.assign({x:0,y:0,vx:(rnd()-.5)*2,vy:(rnd()-.5)*2,ph:rnd()*6.28,alpha:0,seen:false,jit:rnd()},o))};
  const as=[mkS("a","h264",42),mkS("a","h264",42)];
  Object.entries(AVC_FY).forEach(([y,n])=>{for(let i=0;i<n;i++)add({who:"a",fy:+y+rnd(),cites:citeSample(),school:as[i%2]})});
  const ss=[mkS("s","hevc",80),mkS("s","hevc",80),mkS("s","hevc",80)],os=[mkS("o","hevc",90),mkS("o","hevc",90),mkS("o","hevc",90),mkS("o","hevc",90)];
  Object.entries(HEVC_FY).forEach(([y,n])=>{for(let i=0;i<Math.round(n/HEVC_PER);i++){const sam=rnd()<2381/13506;add({who:sam?"s":"o",geo:pickW(HEVC_GEO,g=>g[1])[0],fy:+y+rnd(),cites:citeSample(),school:sam?ss[i%3]:os[i%4]})}});
  const vwait=mkS("v","hevc",60,[.72,.62]),vs=[mkS("v","vvc",80),mkS("v","vvc",80),mkS("v","vvc",80)];
  Object.entries(VVC_FY).forEach(([y,n])=>{for(let i=0;i<Math.round(n/VVC_PER);i++){const own=pickW(VVC_OWN,o=>o[1]);const home=vs[i%3];
    add({who:"v",vk:own[0],vcol:own[2],geo:pickW(VVC_GEO,g=>g[1])[0],fy:+y+rnd(),cites:citeSample(),vhome:home,wait:vwait,early:+y<=2017,school:+y<=2017?vwait:home})}});
  ARMS.forEach(([k])=>{OC.q[k]=mkS("q","hevc",55)});
  const qv=[mkS("q","vvc",70),mkS("q","vvc",70)];
  qFish.forEach(f=>add({who:"q",rec:f.rec,arm:f.arm,geo:f.geo,year:f.year,fy:f.year+rnd(),cites:f.cites,star:f.star,school:f.year>=2018?qv[f.jit<.5?0:1]:OC.q[f.arm],migr:f.year>=2018}));
  ghosts.forEach(g=>add({who:"q",arm:g.arm,year:g.year,fy:g.year+rnd(),ghost:true,cites:0,school:qv[g.jit<.5?0:1]}));
  STARS.forEach(([pool,rank,no,own,cites,fy,yr,sum])=>{const sch=pool==="hevc"?os[rank%4]:pool==="vvc"?(fy<=2017?vwait:vs[rank%3]):OC.q["2B"];
    add({who:pool==="hevc"?"o":pool==="vvc"?"v":"q",big:{pool,rank,no,own,cites,yr,sum},fy:fy+.5,cites,school:sch,vhome:pool==="vvc"?vs[rank%3]:undefined,wait:vwait,early:pool==="vvc"&&fy<=2017,vk:own,vcol:"#ffd166",migr:false})});
  OC.tr=[];for(let i=0;i<1700;i++)OC.tr.push({x:rnd()*W,y:TOPY()+rnd()*(BOTY()-TOPY()),life:rnd()*200});
  OC.built=true;OC.w=W;OC.h=H}
const ocBorn=f=>OC.yf>=f.fy-1, ocDead=f=>!f.ghost&&OC.yf>=f.fy+20;
function ocColor(f){if(ocDead(f))return "#4a5b69";if(COLORBY==="geo"&&f.who!=="a"&&f.who!=="q")return GEO_COL[f.geo]||"#4d6578";if(f.who==="v")return f.vcol;if(f.who==="q")return qCol(f);if(f.who==="a")return "#46c3b4";
  if(f.who==="s")return S_COLS[Math.floor(f.jit*S_COLS.length)];return O_COLS[Math.floor(f.jit*O_COLS.length)]}
function ocCounts(){const c={hevcB:0,hevcD:0,vvcB:0,vvcD:0,avcB:0,avcD:0,q:0,qv:0};
  for(const f of OC.fish){if(!ocBorn(f)||f.big)continue;const d=ocDead(f);
    if(f.who==="s"||f.who==="o"){c.hevcB+=HEVC_PER;if(d)c.hevcD+=HEVC_PER}else if(f.who==="v"){c.vvcB+=VVC_PER;if(d)c.vvcD+=VVC_PER}
    else if(f.who==="a"){c.avcB++;if(d)c.avcD++}else if(f.who==="q"&&!f.ghost){c.q++;if(f.migr)c.qv++}}
  c.hevcB=Math.min(13506,c.hevcB);c.vvcB=Math.min(3076,c.vvcB);return c}
OC.pops=[];
function ocYearPops(y){const top=TOPY(),bot=BOTY(),hx=W*(OCK.hevc.x0+OCK.hevc.x1)/2,vx=W*(OCK.vvc.x0+OCK.vvc.x1)/2,ax=W*OCK.h264.x1/2,now=performance.now();
  const P=(x,yy,txt,col,big)=>OC.pops.push({x,y:yy,txt,col,big,t0:now});
  const hb=HEVC_FY[y]||0,vb=VVC_FY[y]||0,qi=YEARS.indexOf(y),qb=qi>=0?PER_YEAR[qi]:0,he=HEVC_FY[y-21]||0,ve=VVC_FY[y-21]||0,ab=AVC_FY[y]||0,ae=AVC_FY[y-21]||0;
  if(hb)P(hx,top+(bot-top)*.42,"+"+hb.toLocaleString()+" 件","#7fd3ff",hb>=1000);
  if(qb)P(hx,top+(bot-top)*.42+30,"高通 +"+qb.toLocaleString()+" 族","#00e5ff",false);
  if(vb){if(y<=2017)P(W*(OCK.hevc.x0+(OCK.hevc.x1-OCK.hevc.x0)*.72),top+(bot-top)*.62,"VVC 池 +"+vb.toLocaleString()+"（HEVC 世代申請）","#d9c8ff",false);else P(vx,top+(bot-top)*.42,"+"+vb.toLocaleString()+" 件","#d9c8ff",vb>=300)}
  if(he)P(hx,top+(bot-top)*.72,(y-1)+" 年到期 −"+he.toLocaleString()+" 件","#ff9a9a",he>=1000);
  if(ve)P(vx,top+(bot-top)*.72,(y-1)+" 年到期 −"+ve.toLocaleString()+" 件","#ff9a9a",false);
  if(ab&&y>=2001)P(ax,top+(bot-top)*.42,"+"+ab,"#7fe0d0",false);if(ae)P(ax,top+(bot-top)*.72,"到期 −"+ae,"#9aa9b4",false)}
function ocDrawPops(now){OC.pops=OC.pops.filter(p=>now-p.t0<2600);ctx.textAlign="center";
  for(const p of OC.pops){const k=(now-p.t0)/2600,a=k<.15?k/.15:1-(k-.15)/.85;ctx.globalAlpha=Math.max(0,a);
    ctx.font=`700 ${p.big?26:16}px 'IBM Plex Mono','Noto Sans TC',monospace`;ctx.fillStyle="rgba(5,16,36,.55)";const tw=ctx.measureText(p.txt).width;
    const yy=p.y-k*40;ctx.fillRect(p.x-tw/2-8,yy-(p.big?24:16),tw+16,p.big?32:22);ctx.fillStyle=p.col;ctx.fillText(p.txt,p.x,yy)}
  ctx.globalAlpha=1}
function ocStep(t){
  const top=TOPY(),bot=BOTY(),wx=WALLX(),vel=velosOn();
  {const d=year-OC.yf,stp=Math.max(Math.abs(d)*.03,.012)*SPEED;OC.yf=Math.abs(d)<=stp?year:OC.yf+Math.sign(d)*stp}

  for(const s of OC.schools){const O=s.oc,nx=vn(s.seed,1.3,t*.00007),ny=vn(2.7,s.seed,t*.00007);
    if(s.fix){s.hx=W*(O.x0+(O.x1-O.x0)*s.fix[0])+(nx-.5)*40;s.hy=top+(bot-top)*s.fix[1]+(ny-.5)*40}
    else if(s.who==="q"&&O.k==="hevc"&&vel){s.hx=W*(.33+.06*(nx-.5));s.hy=top+(bot-top)*(.26+.12*(ny-.5))}
    else{const r=O.k==="vvc"?[.18,.55]:O.k==="h264"?[.25,.35]:[.15,.7];s.hx=W*(O.x0+(O.x1-O.x0)*(r[0]+r[1]*nx));s.hy=top+(bot-top)*(.12+.76*ny)}}
  const CELL=36,grid=new Map();
  for(const f of OC.fish){if(f.alpha<.05)continue;const k=((f.x/CELL)|0)*4096+((f.y/CELL)|0);let a=grid.get(k);if(!a)grid.set(k,a=[]);a.push(f)}
  const sp=SPEED*.55;
  for(const f of OC.fish){
    const on=ocBorn(f),dead=on&&ocDead(f);f.alpha+=((on?(dead?.4:1):0)-f.alpha)*.05;if(!on&&f.alpha<.01){f.seen=false;continue}
    if(f.who==="v"&&f.early)f.school=OC.yf>=2018?f.vhome:f.wait; // HEVC 世代誕生的 VVC 專利：2018 JVET 標準化起游過海峽
    if(on&&!f.seen){f.seen=true;f.flash=1;f.x=f.school.hx+(rnd()-.5)*120;f.y=f.school.hy+(rnd()-.5)*120}
    if(dead&&!f.died){f.died=true;f.flash=-1}else if(!dead)f.died=false;
    let vx=f.vx,vy=f.vy;
    if(dead){vx*=.9;vy=vy*.9+.06;f.ph+=.02;if(f.y>bot-4)vy=-.05;f.x+=vx*sp;f.y+=vy*sp;continue}
    let ax=0,ay=0,cx=0,cy=0,n=0,sx=0,sy=0,checked=0;const gx=(f.x/CELL)|0,gy=(f.y/CELL)|0;
    outer:for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const arr=grid.get((gx+i)*4096+gy+j);if(!arr)continue;
      for(const o of arr){if(o===f)continue;if(++checked>28)break outer;const dx=o.x-f.x,dy=o.y-f.y,d2=dx*dx+dy*dy;
        if(d2<256&&d2>0){sx-=dx/d2;sy-=dy/d2}
        if(o.who===f.who&&d2<1600){ax+=o.vx;ay+=o.vy;cx+=o.x;cy+=o.y;n++}}}
    if(n){vx+=(ax/n-vx)*.07;vy+=(ay/n-vy)*.07;vx+=(cx/n-f.x)*.0015;vy+=(cy/n-f.y)*.0015}
    vx+=sx*2.6;vy+=sy*2.6;
    const fl=flowAt(f.x,f.y,t);vx+=fl[0]*.09;vy+=fl[1]*.09;
    const S=f.school,hx=S.hx-f.x,hy=S.hy-f.y,hd=Math.hypot(hx,hy)||1;
    if(hd>S.rad){const k=(f.who==="q"&&vel&&!f.migr?.07:.035)*Math.min(3,.3+(hd-S.rad)/S.rad);vx+=hx/hd*k;vy+=hy/hd*k}
    vx+=Math.cos(f.ph)*.04;vy+=Math.sin(f.ph*1.3)*.04;f.ph+=.05+f.jit*.03;
    if(f.y<top)vy+=.25;if(f.y>bot)vy-=.25;if(f.x<8)vx+=.25;if(f.x>W-8)vx-=.25;
    const v=Math.hypot(vx,vy),mx=2.4,mn=.7;if(v>mx){vx*=mx/v;vy*=mx/v}else if(v<mn){vx*=mn/v;vy*=mn/v}
    f.vx=vx;f.vy=vy;f.x+=vx*sp;f.y+=vy*sp;
    // 海峽：只有 VVC 池魚（2018 起）與高通遷移魚能過；其他魚留在原世代；未知海域無魚
    {const sx=SEAMX(),nx2=W*OCK.next.x0-6,inV=f.ghost||(f.who==="q"&&f.migr)||(f.who==="v"&&(!f.early||OC.yf>=2018));
     if(!inV&&f.who!=="a"){if(f.x>sx-40)f.vx-=.08*(f.x-sx+40)/40;if(f.x>sx-5){f.x=sx-5;f.vx=-Math.abs(f.vx)}}
     if(f.x>nx2-60)f.vx-=.08*(f.x-nx2+60)/60;if(f.x>nx2){f.x=nx2;f.vx=-Math.abs(f.vx)}}
    // 世代邊界：H.264 與 HEVC 之間不互通
    if(f.who==="a"){if(f.x>wx-5){f.x=wx-5;f.vx=-Math.abs(f.vx)}}else if(f.x<wx+5){f.x=wx+5;f.vx=Math.abs(f.vx)}}
  if(caseFish&&caseFish.arm){const S=OC.q[caseFish.arm];const tx=S.hx,ty=S.hy;caseFish.vx=caseFish.vx*.92+(tx-caseFish.x)*.004;caseFish.vy=caseFish.vy*.92+(ty-caseFish.y)*.004;caseFish.x+=caseFish.vx*sp;caseFish.y+=caseFish.vy*sp;caseFish.ph+=.2}
}
function ocStrip(top,bot){ // 生命週期時間軸＋每年申請量
  if(W<860)return;const x0=Math.max(290,W*.17),x1=W-330;if(x1-x0<300)return;
  const y=H-66,hMax=24,X=yv=>x0+(yv-OC_Y0)/(OC_Y1-OC_Y0)*(x1-x0),bw=(x1-x0)/(OC_Y1-OC_Y0)*.36;
  ctx.fillStyle="rgba(4,11,22,.72)";ctx.fillRect(x0-10,y-hMax-38,x1-x0+20,hMax+58);
  ctx.fillStyle="rgba(255,209,102,.08)";ctx.fillRect(X(OC_NOW),y-hMax-22,x1-X(OC_NOW),hMax+36);
  for(let yy=OC_Y0;yy<OC_Y1;yy++){const hv=(HEVC_FY[yy]||0)/4711*hMax,vv=(VVC_FY[yy]||0)/4711*hMax*3;
    ctx.fillStyle="rgba(63,169,230,.85)";ctx.fillRect(X(yy+.5)-bw,y-hv,bw,hv);ctx.fillStyle="rgba(200,182,255,.85)";ctx.fillRect(X(yy+.5),y-vv,bw,vv)}
  ctx.fillStyle="rgba(255,209,102,.5)";ctx.fillRect(X(2017),y+3,X(2022)-X(2017),4);
  ctx.strokeStyle="rgba(230,239,243,.35)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0,y+.5);ctx.lineTo(x1,y+.5);ctx.stroke();
  ctx.font="400 9px 'IBM Plex Mono',monospace";ctx.fillStyle="#8ea6b2";ctx.textAlign="center";
  for(let yy=OC_Y0;yy<=OC_Y1;yy+=5)if(yy!==2020)ctx.fillText(yy,X(yy),y+15);
  [[2003,"AVC 定案"],[2013,"H.265"],[2015,"HEVC Adv."],[2020,"H.266"],[2028.5,"H.267?"],[2032,"到期高峰"]].forEach(([yy,t],i)=>{ctx.fillStyle="#e6eff3";ctx.beginPath();ctx.arc(X(yy),y,2.5,0,6.28);ctx.fill();
    ctx.font="500 9px 'Noto Sans TC',sans-serif";ctx.fillStyle="#cfe0e8";ctx.fillText(t,X(yy),y-hMax-12)});
  ctx.font="400 9px 'Noto Sans TC',sans-serif";ctx.textAlign="center";ctx.fillStyle="#ffd166";ctx.fillText("Velos 2017–22",X(2019.5),y+16);
  ctx.textAlign="left";ctx.fillStyle="#3fa9e6";ctx.fillText("■ HEVC 池每年申請量",x0,y-hMax-26);ctx.fillStyle="#9d8fff";ctx.fillText("■ VVC 池（×3）",x0+104,y-hMax-26);ctx.fillStyle="#8ea6b2";ctx.fillText("專利池生命週期 · 白線＝目前年份",x0+190,y-hMax-26);
  const px=X(Math.min(OC_Y1,OC.yf));ctx.strokeStyle=OC.yf>OC_NOW?"#ffd166":"#fff";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px,y-hMax-6);ctx.lineTo(px,y+6);ctx.stroke()}
function ocFrame(t,now){
  if(!OC.built||OC.w!==W||OC.h!==H)ocBuild();
  ocStep(t);const top=TOPY(),bot=BOTY(),wx=WALLX(),sx=SEAMX(),mid=(top+bot)/2,K=straitK();
  ctx.fillStyle="#050c18";ctx.fillRect(0,0,W,H);
  const c=ocCounts(),live={h264:(c.avcB-c.avcD)/306,hevc:(c.hevcB-c.hevcD)/13506,vvc:(c.vvcB-c.vvcD)/3076,next:OC.yf>=2027?.25:0};
  const g=ctx.createLinearGradient(0,0,W,0);
  OCEANS.forEach(o=>{const cc=o.col,m=(o.x0+o.x1)/2,r=Math.max(0,live[o.k]);g.addColorStop(Math.max(0,o.x0+.02),`rgba(${cc[0]},${cc[1]},${cc[2]},${.03+.1*r})`);g.addColorStop(m,`rgba(${cc[0]},${cc[1]},${cc[2]},${.04+.32*r})`);g.addColorStop(Math.min(1,o.x1-.02),`rgba(${cc[0]},${cc[1]},${cc[2]},${.03+.1*r})`)});
  ctx.fillStyle=g;ctx.fillRect(0,top-20,W,bot-top+40);
  // 下一代海域：2027 起（推演）霧散開
  const fogA=OC.yf>=2027?.08:.16;
  for(let i=0;i<5;i++){const fx=W*(.85+.14*vn(i*7.1,.5,t*.00005)),fy=top+(bot-top)*vn(.3,i*5.3,t*.00005),r=Math.min(W,H)*.16;
    const fg=ctx.createRadialGradient(fx,fy,0,fx,fy,r);fg.addColorStop(0,`rgba(150,160,172,${fogA})`);fg.addColorStop(1,"rgba(150,160,172,0)");ctx.fillStyle=fg;ctx.beginPath();ctx.arc(fx,fy,r,0,6.283);ctx.fill()}
  // 世代邊界（H.264 | HEVC）
  ctx.save();ctx.shadowColor="#7fe0d0";ctx.shadowBlur=LQ?0:(10);ctx.strokeStyle="rgba(127,224,208,.65)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(wx,top-14);ctx.lineTo(wx,bot+2);ctx.stroke();ctx.restore();
  // HEVC | VVC 海峽：2015 前封閉，之後依 JVET 進度打開
  const gap=(bot-top)*.32*K;ctx.strokeStyle="rgba(200,182,255,.45)";ctx.setLineDash([5,6]);ctx.lineWidth=1.2;ctx.beginPath();
  ctx.moveTo(sx,top-14);ctx.lineTo(sx,mid-gap/2);ctx.moveTo(sx,mid+gap/2);ctx.lineTo(sx,bot+2);ctx.stroke();ctx.setLineDash([]);
  // Velos Media 圈（2017–2022）
  if(velosOn()||(OC.yf>=2022&&OC.yf<2024.5)){const on=velosOn();const vx0=W*.33,vy0=top+(bot-top)*.26,rx=W*.07,ry=(bot-top)*.16;
    ctx.strokeStyle=on?"rgba(255,209,102,.7)":"rgba(255,209,102,.25)";ctx.setLineDash(on?[6,4]:[2,6]);ctx.beginPath();ctx.ellipse(vx0,vy0,rx,ry,0,0,6.28);ctx.stroke();ctx.setLineDash([]);
    ctx.font="600 11px 'Noto Sans TC',sans-serif";ctx.textAlign="center";ctx.fillStyle=on?"#ffd166":"rgba(255,209,102,.6)";ctx.fillText(on?"Velos Media（2017–2022）· 高通加入":"Velos 解散 → 高通回到池外雙邊",vx0,vy0-ry-6)}
  OCEANS.forEach(o=>{const x=W*(o.x0+o.x1)/2;const col=`rgb(${o.col.join(',')})`;let sub;
    if(o.k==="h264")sub=`示意 · 已到期 ${c.avcB?Math.round(c.avcD/c.avcB*100):0}%`;
    else if(o.k==="hevc")sub=`池內 ${c.hevcB.toLocaleString()} 件 · 到期 ${c.hevcD.toLocaleString()} · 高通 ${(c.q-c.qv).toLocaleString()} 族`;
    else if(o.k==="vvc")sub=OC.yf<2015?"尚未開始（2015 JVET 探索）":`池內 ${c.vvcB.toLocaleString()} 件 · 到期 ${c.vvcD.toLocaleString()}${c.qv?` · 高通示意 ${c.qv}`:""}`;
    else sub=OC.yf>=2027?"H.267 預計 2028–29（推演）":"無黃金集 · 母數未知";
    if(W<860&&(o.k==="h264"||o.k==="next")){ctx.save();ctx.font="700 11px 'Noto Sans TC',sans-serif";ctx.fillStyle=col;ctx.textAlign="center";ctx.fillText(o.k==="h264"?"H.264":"H.267",x,top-6);ctx.restore();return}
    if(W<860){label(x,top-4,o.k==="hevc"?"HEVC":"VVC",o.k==="hevc"?`${c.hevcB.toLocaleString()} · 到期 ${c.hevcD.toLocaleString()}`:`${c.vvcB.toLocaleString()} · 到期 ${c.vvcD}`,col);return}
    label(x,top-4,o.name,sub,col)});
  // 線上的說明
  ctx.font="500 10px 'Noto Sans TC',sans-serif";ctx.textAlign="center";ctx.save();ctx.translate(wx-8,mid);ctx.rotate(-Math.PI/2);ctx.fillStyle="rgba(127,224,208,.9)";ctx.fillText("世代邊界：H.264 與 HEVC 專利不跨池",0,0);ctx.restore();
  if(K>0){ctx.fillStyle="rgba(200,182,255,.95)";ctx.font="600 11px 'Noto Sans TC',sans-serif";ctx.fillText(K<1?"JVET 探索 →":"技術外溢 →",sx,mid-gap/2-6);
    if(K>=1&&W>=860){ctx.font="400 10px 'Noto Sans TC',sans-serif";ctx.fillStyle="rgba(255,138,138,.85)";ctx.fillText("三星、Sony、LG、Canon、微軟、華為",sx,mid+gap/2+14);ctx.fillText("尚未加入 VVC 池",sx,mid+gap/2+27)}}
  fadeTrail();ctx=trx;ctx.globalCompositeOperation="lighter";
  const byO=new Map();
  for(const p of OC.tr){const fl=flowAt(p.x,p.y,t);const ox=p.x;p.x+=fl[0]*1.5*SPEED;p.y+=fl[1]*1.5*SPEED;p.life-=1;
    if(p.life<0||p.x<0||p.x>W||p.y<top-10||p.y>bot+10||(ox<wx)!==(p.x<wx)||Math.abs(p.x-wx)<4){p.x=rnd()*W;p.y=top+rnd()*(bot-top);p.life=120+rnd()*180}
    const o=OCEANS.find(o=>p.x/W<o.x1)||OCEANS[3];(byO.get(o)||byO.set(o,[]).get(o)).push(p)}
  for(const[o,arr]of byO){const cc=o.col;ctx.fillStyle=`rgba(${Math.min(255,cc[0]+90)},${Math.min(255,cc[1]+90)},${Math.min(255,cc[2]+60)},.55)`;ctx.beginPath();arr.forEach(p=>{ctx.moveTo(p.x+1.1,p.y);ctx.arc(p.x,p.y,1.1,0,6.283)});ctx.fill()}
  ctx.globalCompositeOperation="source-over";const groups=new Map();
  for(const f of OC.fish){if(f.alpha<.03||f.died||f.big)continue;const dep=f.jit<.34?0:f.jit<.67?1:2;const key=(f.ghost?"G":ocColor(f))+"|"+Math.round(f.alpha*4)+"|"+dep;(groups.get(key)||groups.set(key,[]).get(key)).push(f)}
  // 景深：遠層小而暗、近層大而亮
  for(const[key,arr]of groups){const[col,a,dp]=key.split("|");const D=+dp,am=[.45,.78,1][D],sm=[.78,1,1.2][D];ctx.globalAlpha=Math.min(1,a/4)*.9*am;ctx.beginPath();
    arr.forEach(f=>fishPath(f,sm*(f.who==="o"||f.who==="a"?2.2:(1.8+Math.min(Math.log10(f.cites+1),2.9)*.7))));
    if(col==="G"){ctx.strokeStyle=COL.gold;ctx.lineWidth=1;ctx.stroke()}else{ctx.fillStyle=col;ctx.fill()}}
  ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";ctx=MAIN;
  ctx.globalCompositeOperation="lighter";ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.drawImage(trail,0,0,W,H);ctx.restore();ctx.globalCompositeOperation="source-over";
  ctx.globalAlpha=.45;ctx.fillStyle="#56697a";ctx.beginPath();for(const f of OC.fish)if(f.died&&!f.big&&f.alpha>.03)fishPath(f,1.9);ctx.fill();ctx.globalAlpha=1;
  // 名魚：報告中被引用前 10 名（大魚、金邊；到期後變灰但仍保留大小）
  for(const f of OC.fish){if(!f.big||f.alpha<.05)continue;const B=f.big,dead=f.died;
    // 名魚：和一般魚同造型，只略大；活著時炫目發光，到期後轉為淡金
    const sz=4.4+Math.min(2,Math.sqrt(B.cites)/15),br=.5+.5*Math.sin(now*.0032+B.rank*1.7);
    const hue=B.pool==="vvc"?["#ff9cf2","#ffd6fb"]:B.pool==="q"?["#22e3ff","#c9fbff"]:["#ffd166","#fff1c2"];
    ctx.globalAlpha=Math.min(1,f.alpha/(dead?.4:1))*(dead?.75:1);
    if(!dead){ctx.strokeStyle=hue[0];ctx.globalAlpha=.6*(1-br);ctx.lineWidth=1;ctx.beginPath();ctx.arc(f.x,f.y,sz*(1.4+2.6*br),0,6.28);ctx.stroke();ctx.globalAlpha=1}
    ctx.save();if(!dead){ctx.shadowColor=hue[0];ctx.shadowBlur=LQ?0:(16+12*br)}else{ctx.shadowColor="#ffd166";ctx.shadowBlur=LQ?0:(4)}
    ctx.beginPath();fishPath(f,sz);ctx.fillStyle=dead?"#a99a6a":hue[0];ctx.fill();ctx.restore();
    if(!dead){ctx.globalAlpha=.85;ctx.beginPath();fishPath(f,sz*.55);ctx.fillStyle=hue[1];ctx.fill();ctx.globalAlpha=1}
    if(W>=860){const ax=f.x+sz*1.4,ay=f.y-sz*1.4,bx=ax+12,by=ay-10;ctx.globalAlpha=dead?.45:1;ctx.strokeStyle=hue[0];ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.lineTo(bx+44,by);ctx.stroke();
      ctx.font="500 9px 'IBM Plex Mono',monospace";ctx.textAlign="left";ctx.fillStyle=dead?"#c9c0a0":hue[1];
      ctx.fillText((B.pool==="q"?"QCOM":B.pool==="vvc"?"VVC #"+B.rank:"HEVC #"+B.rank)+" · "+B.cites,bx+2,by-3);ctx.globalAlpha=1}}
  ctx.globalAlpha=1;
  // 出生閃光（白）與到期閃光（紅灰）：年代切換時看得到增減
  for(const f of OC.fish){if(!f.flash)continue;const a=Math.abs(f.flash);if(a<.03){f.flash=0;continue}
    ctx.globalAlpha=a*.9;ctx.fillStyle=f.flash>0?"#ffffff":"#ff8a8a";ctx.beginPath();fishPath(f,(f.flash>0?3.4:2.8)*(1+a*.6));ctx.fill();f.flash*=.975}
  ctx.globalAlpha=1;ocDrawPops(now);
  // legend
  const lx=Math.max(16,W*OCK.hevc.x0+12),ly=bot+6;ctx.font="500 11px 'Noto Sans TC',sans-serif";ctx.textAlign="left";
  const qLeg=COLORBY==="geo"?"Qualcomm（依公告國家）":COLORBY==="cite"?"Qualcomm（依被引用）":"Qualcomm（依 Unit）";
  [["大魚＝被引用前 10 名（滑鼠看公告號）","#ffd166"],[qLeg+" · 1 條＝1 族",ARM_COL["6B"]],["Samsung · 1 條＝8 件",S_COLS[0]],["其他池內 · 1 條＝8 件",O_COLS[0]],["VVC 池 · 1 條＝4 件","#9d8fff"],["已到期（20 年）","#4a5b69"],["推演",COL.gold]]
    .reduce((x,[tt,cc])=>{if(x>W-40)return x;ctx.fillStyle=cc;ctx.fillRect(x,ly+4,10,4);ctx.fillStyle="#9fb4bf";ctx.fillText(tt,x+14,ly+10);return x+ctx.measureText(tt).width+30},lx);
  ocStrip(top,bot);
  const st=OC.fish.find(f=>f.star);if(st&&st.alpha>.3){ctx.strokeStyle=COL.gold;ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(st.x,st.y,9+Math.sin(now*.004)*2,0,6.28);ctx.stroke()}
  if(caseFish){const br=.5+.5*Math.sin(now*.004);ctx.save();ctx.shadowColor="#fff";ctx.shadowBlur=LQ?0:(16);ctx.fillStyle="#fff";ctx.beginPath();fishPath(caseFish,6);ctx.fill();ctx.restore();
    ctx.strokeStyle=`rgba(255,255,255,${.7*(1-br)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(caseFish.x,caseFish.y,10+18*br,0,6.28);ctx.stroke();
    ctx.font="500 10px 'IBM Plex Mono',monospace";ctx.fillStyle="#fff";ctx.textAlign="left";ctx.fillText("CASE · 本案",caseFish.x+14,caseFish.y-10)}
  if(hover){ctx.strokeStyle="#fff";ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(hover.x,hover.y,8,0,6.28);ctx.stroke()}
}

