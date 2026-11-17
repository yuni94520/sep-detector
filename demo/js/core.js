/* ======== deterministic random ======== */
let seed=20260105;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const pickW=(arr,wf)=>{const t=arr.reduce((s,a)=>s+wf(a),0);let r=rnd()*t;for(const a of arr){r-=wf(a);if(r<=0)return a}return arr[arr.length-1]};

/* ======== canvas ======== */
const cv=document.getElementById('sea');let ctx=cv.getContext('2d');const MAIN=ctx;let W=0,H=0,DPR=1,TOPB=0,LQ=false;
const trail=document.createElement('canvas'),trx=trail.getContext('2d');let SPEED=2,simT=0,lastNow=0;
function resize(){DPR=LQ?1:Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;MAIN.setTransform(DPR,0,0,DPR,0,0);trail.width=W*DPR;trail.height=H*DPR;trx.setTransform(DPR,0,0,DPR,0,0);if(typeof CAM!=='undefined')camClamp();layout();const hb=document.getElementById('top').getBoundingClientRect().bottom;TOPB=hb||0;if(window.CINE_OK)cinePlace();document.getElementById('ledger').style.top=(hb+8)+'px';if(W>=860)document.getElementById('desk').style.top=(hb+8)+'px';else document.getElementById('desk').style.top=''}
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ======== vortices ======== */
const COL={q:"#22e3ff",s:"#4f7bff",o:"#6a5cff",gold:"#ffd166",B:"#5ff3ff",A:"#8f7bff",noise:"#3b4b5c",case:"#ffffff"};
const ARM_COL={"6B":"#22e3ff","PNS":"#7af0ff","2B":"#00b8d9","7A":"#6ff2d6","2B_v1":"#9ad9ff","2A":"#2ec4b6"};
const S_COLS=["#4f7bff","#3d6bff","#6b8fff","#2f5bff"],O_COLS=["#6a5cff","#5546e8","#7f73ff","#4a3fd0","#8b80ff"];
const VX={q:{n:3044,label:"Qualcomm（池外）",col:COL.q},s:{n:2381,label:"Samsung（池內）",col:COL.s},o:{n:11125,label:"其他池內權利人",col:COL.o}};
const OTHER_PER_FISH=8; // draw 1 fish per 4 families for 「其他權利人」 to keep the page fluid
function layout(){
  const m=Math.min(W,H),narrow=W<860;
  const L=narrow?0:280,Rr=narrow?W:W-330,top=narrow?120:90,bot=narrow?H*.62:H-40;
  const aw=Rr-L,ah=bot-top;
  const base=Math.min(aw/(narrow?2.6:3.7),ah/(narrow?3.2:2.6));
  VX.q.R=base;VX.s.R=base*Math.sqrt(2381/3044)*.9;VX.o.R=base*1.05;
  if(narrow){VX.q.x=W*.32;VX.q.y=top+ah*.3;VX.s.x=W*.74;VX.s.y=top+ah*.32;VX.o.x=W*.52;VX.o.y=top+ah*.76}
  else{VX.q.x=L+aw*.28;VX.q.y=top+ah*.5;VX.s.x=L+aw*.74;VX.s.y=top+ah*.25;VX.o.x=L+aw*.72;VX.o.y=top+ah*.76}
  SAT.x=narrow?W*.5:L+aw*.5;SAT.y=narrow?H*.36:top+ah*.5;SAT.R=Math.min(aw/6.2,ah/2.2)*(narrow?.9:1);
}
const SAT={x:0,y:0,R:100};

/* ======== build fish ======== */
const fish=[];
const armTotal=ARMS.reduce((s,a)=>s+a[2],0);
let armStart=0;const ARM_SECT={};
ARMS.forEach(([k,l,c])=>{ARM_SECT[k]={a0:armStart,a1:armStart+c/armTotal*6.283,label:l,count:c};armStart+=c/armTotal*6.283});
// year pool for Qualcomm: deck chart (2,944) + 100 spread over 2011–2014 to reach 3,044 families
const yearPool=[];YEARS.forEach((y,i)=>{for(let k=0;k<PER_YEAR[i];k++)yearPool.push(y)});
for(let i=yearPool.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[yearPool[i],yearPool[j]]=[yearPool[j],yearPool[i]]}
function citeSample(){const b=pickW(CITE_BINS,x=>x[2]);return Math.round(b[0]+Math.pow(rnd(),b[1]>70?2.2:1)*(b[1]-b[0]))}
function mk(o){return Object.assign({x:W/2+(rnd()-.5)*W,y:H/2+(rnd()-.5)*H,vx:0,vy:0,ph:rnd()*6.28,alpha:0,r0:0,th:rnd()*6.28},o)}
// Qualcomm
const qFish=[];
// 期末報告：1–10 次 50.9%、被引 51+ 共 152 件、平均 13.6、最高 727
const CITE_PLAN=[];for(let i=0;i<3044;i++){const r=Math.pow(rnd(),6);CITE_PLAN.push(i<1549?1+Math.floor(r*10):i<2481?11+Math.floor(r*20):i<2892?31+Math.floor(r*20):51+Math.floor(Math.pow(rnd(),12)*300))}
for(let i=0;i<3044;i++){
  const arm=pickW(ARMS,a=>a[2])[0],cites=CITE_PLAN[i];
  const f=mk({who:"q",arm,year:yearPool[i],cites,r0:Math.pow(rnd(),.75),jit:rnd()});
  qFish.push(f);fish.push(f)}
// one standout family: highest single citation 727 (affine motion prediction)
qFish.sort((a,b)=>b.cites-a.cites);qFish[0].cites=727;qFish[0].star="最高被引單件 727 次";qFish[0].arm="2B";
// Saturn roles: 1,300 core（簡報）/ A、B 環合計 1,744；金色＝被 2 個以上 Unit 同時涵蓋 1,112（合併去重儀表板）
{const order=[...qFish].sort(()=>rnd()-.5);
 order.forEach((f,i)=>{f.role=i<1300?"core":i%2?"A":"B"});
 const o2=[...qFish].sort(()=>rnd()-.5);o2.forEach((f,i)=>{f.multi=i<1112})}
// Samsung & others (no year data in the deck)
for(let i=0;i<2381;i++)fish.push(mk({who:"s",r0:Math.pow(rnd(),.7),cites:citeSample(),jit:rnd()}));
for(let i=0;i<Math.round(11125/OTHER_PER_FISH);i++)fish.push(mk({who:"o",r0:Math.pow(rnd(),.65),cites:citeSample(),jit:rnd()}));
// keyword/IPC look-alikes that the method filters out (Phase 0: ~5,000 total)
const noise=[];for(let i=0;i<1956;i++){const f=mk({who:"n",r0:rnd(),role:"noise",cites:citeSample(),jit:(i*.618034)%1});noise.push(f);fish.push(f)}
qFish.forEach(f=>{const s=ARM_SECT[f.arm];f.armA=s.a0+rnd()*(s.a1-s.a0)});
{const gp=[];GEO.forEach(([k,n])=>{for(let i=0;i<n;i++)gp.push(k)});const ord=[...qFish].sort(()=>rnd()-.5);ord.forEach((f,i)=>f.geo=gp[i])}
/* 每條高通魚對應主表中的一筆真實家族：先比 Unit＋優先權年，同組內依被引次數排序配對；被 2+ Unit 涵蓋、公告國改用主表實值 */
{const yOf=r=>Math.max(2008,Math.min(2019,+String(r[2]).slice(0,4)||2008)),used=new Uint8Array(QREC.length),byCite=(a,b)=>b.cites-a.cites;
 const top=QREC.reduce((b,r,i)=>r[3]>QREC[b][3]?i:b,0);qFish[0].rec=QREC[top];used[top]=1;
 const take=(fs,ids)=>{fs.sort(byCite);ids.sort((a,b)=>QREC[b][3]-QREC[a][3]);const n=Math.min(fs.length,ids.length);for(let i=0;i<n;i++){fs[i].rec=QREC[ids[i]];used[ids[i]]=1}};
 const grp=(key,fk)=>{const F=new Map(),Rm=new Map();qFish.forEach(f=>{if(f.rec)return;const k=fk(f);(F.get(k)||F.set(k,[]).get(k)).push(f)});
   QREC.forEach((r,i)=>{if(used[i])return;const k=key(r);(Rm.get(k)||Rm.set(k,[]).get(k)).push(i)});for(const[k,fs]of F)if(Rm.has(k))take(fs,Rm.get(k))};
 grp(r=>r[4]+"|"+yOf(r),f=>f.arm+"|"+f.year);grp(r=>r[4],f=>f.arm);grp(()=>1,()=>1);
 const top10=new Set(GEO.slice(0,10).map(g=>g[0]));
 qFish.forEach(f=>{const r=f.rec;if(!r)return;f.multi=r[5].indexOf("|")>=0;const cc=r[0].slice(0,2);f.geo=top10.has(cc)?cc:"其他"})}
const fmtNo=n=>{const m=/^([A-Z]{2})(\d+)([A-Z]\d?)$/.exec(n);return m?m[1]+" "+m[2]+" "+m[3]:n};
function recHTML(f){const r=f.rec;if(!r)return "";const us=r[5].split("|");
  return `<b style="font-family:var(--f-mono);color:var(--gold)">${esc(fmtNo(r[0]))}</b><br><span style="color:#e4f1f7">${esc(r[1])}</span><br>`+
   `最早優先權 ${esc(r[2]||"—")} · 被引 <b>${r[3]}</b> 次${r[6]?" · 家族 "+r[6]+" 件":""}<br>首次貢獻 Unit：${esc(r[4])}${us.length>1?"（共 "+us.length+" 個 Unit 涵蓋："+esc(us.join("、"))+"）":""}`}

/* ======== forecast: log-linear fit on 2015–2019 (2020 excluded: 18-month publication lag) ======== */
const FIT_Y=[2015,2016,2017,2018,2019],FIT_V=[308,228,200,168,120];
const fit=(()=>{const n=5,xs=FIT_Y.map(y=>y-2015),ys=FIT_V.map(v=>Math.log(v));const mx=xs.reduce((a,b)=>a+b)/n,my=ys.reduce((a,b)=>a+b)/n;
  let sxy=0,sxx=0;xs.forEach((x,i)=>{sxy+=(x-mx)*(ys[i]-my);sxx+=(x-mx)**2});const b=sxy/sxx,a=my-b*mx;return {a,b,at:y=>Math.exp(a+b*(y-2015))}})();
const FC={2021:Math.round(fit.at(2021)),2022:Math.round(fit.at(2022)),2023:Math.round(fit.at(2023))};
const ghosts=[];[2021,2022,2023].forEach(y=>{for(let i=0;i<FC[y];i++){const f=mk({who:"q",ghost:true,year:y,arm:pickW(ARMS.filter(a=>a[0]!=="PNS"),a=>a[2])[0],r0:.85+rnd()*.35,cites:0,jit:rnd()});
  const s=ARM_SECT[f.arm];f.armA=s.a0+rnd()*(s.a1-s.a0);ghosts.push(f);fish.push(f)}});
document.getElementById('fcNote').innerHTML=
 `以 2015–2019 年高通申請量做對數線性迴歸（2020 年因公開延遲不納入），年衰減率 ${Math.round((1-Math.exp(fit.b))*100)}%。外推 2021 / 2022 / 2023 年約 <b>${FC[2021]} / ${FC[2022]} / ${FC[2023]}</b> 個新家族，播放到 2021 後以金色虛線魚顯示。這是動量推演，不是預測事實。`;

/* ======== state ======== */
let mode="ocean",year=2020,phase=4,caseFish=null,hover=null,t0=performance.now();
const vis=f=>{
  if(mode==="saturn"){
    if(f.who==="n")return phase<=1&&(phase===0||f.jit<.204); // 400 of 1,956 remain at Phase 1 (1,700 total)
    if(f.who!=="q"||f.ghost)return false;
    if(phase===0)return true;if(phase===1)return f.role==="core"||(f.role!=="core"&&f.jit<0);
    if(phase===2)return f.role==="core";if(phase===3)return f.role==="core"||f.jit<.69; return true}
  if(f.who==="n")return false;
  if(f.who==="q"){if(f.ghost)return year>=f.year;return f.year<=Math.min(year,2020)}
  return true};

/* ======== motion ======== */
function target(f,t){
  if(mode==="saturn"&&f.who!=="n"){
    const R=SAT.R;
    if(f.role==="core"||phase<=1){ // sphere: orbit on a tilted great circle
      if(!f.u){const a=rnd()*6.28,b=Math.acos(2*rnd()-1);f.u=[Math.cos(a)*Math.sin(b),Math.sin(a)*Math.sin(b),Math.cos(b)];
        let v=[-f.u[1],f.u[0],0];const l=Math.hypot(...v)||1;v=v.map(c=>c/l);f.v=[f.u[1]*v[2]-f.u[2]*v[1],f.u[2]*v[0]-f.u[0]*v[2],f.u[0]*v[1]-f.u[1]*v[0]];f.rr=.35+.65*Math.cbrt(rnd())}
      const a=f.th+t*.00035*(1.3-f.rr*.5),r=R*f.rr*(phase===0?1.9:phase===1?1.25:1);
      const p=[f.u[0]*Math.cos(a)+f.v[0]*Math.sin(a),f.u[1]*Math.cos(a)+f.v[1]*Math.sin(a),f.u[2]*Math.cos(a)+f.v[2]*Math.sin(a)];
      f.z=p[2];return [SAT.x+p[0]*r,SAT.y+p[1]*r*.92]}
    const ring=f.role==="B"?1.65:2.35;const spread=.22;
    const a=f.th+t*.00022*(2.6-ring);const r=R*(ring+(f.jit-.5)*spread*2);
    f.z=Math.sin(a);return [SAT.x+Math.cos(a)*r,SAT.y+Math.sin(a)*r*.27-Math.cos(a)*r*.06]}
  if(f.who==="n"){const r=SAT.R*(2.4+f.r0*1.6);const a=f.th+t*.0002;f.z=0;return [SAT.x+Math.cos(a)*r*1.1,SAT.y+Math.sin(a)*r*.62]}
  const V=VX[f.who];f.z=0;
  if(f.who==="q"){ // arms: each HEVC section is a spiral arm rotating with the vortex
    const r=V.R*(.12+f.r0*.88)*(f.ghost?1:1);const twist=Math.log(.12+f.r0*.88+.02)*1.25;
    const a=f.armA+twist+t*.00018+(f.jit-.5)*.12;return [V.x+Math.cos(a)*r,V.y+Math.sin(a)*r*.86]}
  const r=V.R*(.1+f.r0*.9),a=f.th+t*.00028/(.35+f.r0)+Math.log(.1+f.r0)*1.6*(f.who==="s"?1:-1);
  return [V.x+Math.cos(a)*r,V.y+Math.sin(a)*r*.86]}
function step(t){
  for(const f of fish){
    const on=vis(f);f.alpha+=((on?1:0)-f.alpha)*.05;if(f.alpha<.01&&!on)continue;
    const [tx,ty]=target(f,t);
    const k=f.born?.02:.075;f.vx=f.vx*.8+(tx-f.x)*k;f.vy=f.vy*.8+(ty-f.y)*k;
    f.ph+=.15;f.x+=f.vx+Math.cos(f.ph*.21+f.jit*9)*.15;f.y+=f.vy+Math.sin(f.ph*.17+f.jit*7)*.15}
  if(caseFish){const tgt=caseFish.tgt?target(caseFish.tgt,t):[VX.q.x+VX.q.R*1.3,VX.q.y];caseFish.vx=caseFish.vx*.9+(tgt[0]-caseFish.x)*.02;caseFish.vy=caseFish.vy*.9+(tgt[1]-caseFish.y)*.02;caseFish.x+=caseFish.vx;caseFish.y+=caseFish.vy;caseFish.ph+=.2}
}

/* ======== draw ======== */

function fishPath(f,s){
  if(LQ){const a=Math.atan2(f.vy,f.vx)||0,c=Math.cos(a),sn=Math.sin(a),x=f.x,y=f.y,h=s*1.75,b=s*1.9,w=s*.62;
    ctx.moveTo(x+h*c,y+h*sn);ctx.lineTo(x-b*c+w*sn,y-b*sn-w*c);ctx.lineTo(x-b*c-w*sn,y-b*sn+w*c);ctx.closePath();return}
  const ang=Math.atan2(f.vy,f.vx)||0,c=Math.cos(ang),sn=Math.sin(ang);const wag=Math.sin(f.ph*.9)*s*.5;
  const P=(x,y)=>[f.x+x*c-y*sn,f.y+x*sn+y*c];
  // 流線型仿生魚身：頭圓、腹收、尾鰭隨擺動（二次貝茲）
  const n=P(s*1.75,0),u1=P(s*.9,-s*.62),u2=P(-s*.55,-s*.5),k=P(-s*1.05,wag*.35),l2=P(-s*.55,s*.5),l1=P(s*.9,s*.62),
    t1=P(-s*1.95,-s*.78+wag),t2=P(-s*1.95,s*.78+wag),tc=P(-s*1.55,wag*.7);
  ctx.moveTo(n[0],n[1]);ctx.quadraticCurveTo(u1[0],u1[1],u2[0],u2[1]);ctx.quadraticCurveTo(k[0],k[1],t1[0],t1[1]);
  ctx.quadraticCurveTo(tc[0],tc[1],t2[0],t2[1]);ctx.quadraticCurveTo(k[0],k[1],l2[0],l2[1]);ctx.quadraticCurveTo(l1[0],l1[1],n[0],n[1]);ctx.closePath()}
const qCol=f=>COLORBY==='geo'?(GEO_COL[f.geo]||COL.q):COLORBY==='cite'?CITE_COL(f.cites):(ARM_COL[f.arm]||COL.q);
const sizeOf=f=>f.who==="o"?2.1:(1.7+Math.min(Math.log10(f.cites+1),2.9)*.75);
function colorOf(f){
  if(f.who==="n")return COL.noise;
  if(f.who==="q"){if(mode==="saturn"){if(phase>=4&&f.multi)return COL.gold;if(f.role!=="core")return f.role==="A"?COL.A:COL.B}return qCol(f)}
  if(f.who==="s")return S_COLS[Math.floor(f.jit*S_COLS.length)];
  return O_COLS[Math.floor(f.jit*O_COLS.length)]}
function drawBatch(list,alphaMul){
  const groups=new Map();
  for(const f of list){if(f.alpha<.02)continue;const key=colorOf(f)+'|'+(f.ghost?'g':'')+'|'+Math.round(f.alpha*alphaMul*(f.jit<.4?3.5:5));
    (groups.get(key)||groups.set(key,[]).get(key)).push(f)}
  for(const[key,arr]of groups){const[col,g,a]=key.split('|');ctx.globalAlpha=Math.min(1,a/5);
    ctx.beginPath();arr.forEach(f=>fishPath(f,sizeOf(f)));
    if(g){ctx.setLineDash([2,2]);ctx.strokeStyle=COL.gold;ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([])}else{ctx.fillStyle=col;ctx.fill()}}
  ctx.globalAlpha=1}
const VWAVES=[];
function drawVortexWaves(t){
  // 水波紋：每個漩渦由中心持續外擴三道同心波；年份前進時，高通漩渦打出一道較強的衝擊波（畫在魚群上方）
  for(const k of["o","s","q"]){const V=VX[k],off=k==="q"?0:k==="s"?.33:.66;
    for(let i=0;i<3;i++){const p=((t*.00022)+i/3+off)%1,r=V.R*(.12+1.08*p);ctx.strokeStyle=hexA(V.col,.7*(1-p));ctx.lineWidth=2;ctx.save();ctx.shadowColor=V.col;ctx.shadowBlur=LQ?0:(8);ctx.beginPath();ctx.ellipse(V.x,V.y,r,r*.86,0,0,6.28);ctx.stroke();ctx.restore()}}
  for(let i=VWAVES.length-1;i>=0;i--){const w=VWAVES[i],p=(performance.now()-w.t0)/1600;if(p>1){VWAVES.splice(i,1);continue}
    const V=VX[w.k],r=V.R*(.2+1.2*p);ctx.strokeStyle=hexA(V.col,.95*(1-p));ctx.lineWidth=4*(1-p)+.8;ctx.beginPath();ctx.ellipse(V.x,V.y,r,r*.86,0,0,6.28);ctx.stroke();
    ctx.strokeStyle=`rgba(255,255,255,${.8*(1-p)})`;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(V.x,V.y,r*.94,r*.94*.86,0,0,6.28);ctx.stroke()}}
function drawVortexBg(t){
  for(const k of["o","s","q"]){const V=VX[k];
    const g=ctx.createRadialGradient(V.x,V.y,0,V.x,V.y,V.R*1.15);
    g.addColorStop(0,hexA(V.col,.22));g.addColorStop(.55,hexA(V.col,.06));g.addColorStop(1,hexA(V.col,0));
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(V.x,V.y,V.R*1.15,V.R*1.15*.86,0,0,6.28);ctx.fill();
    // spiral current lines
    ctx.strokeStyle=hexA(V.col,.16);ctx.lineWidth=1;
    for(let arm=0;arm<5;arm++){ctx.beginPath();for(let s=0;s<=60;s++){const u=s/60;const r=V.R*(.06+u*1.02);
      const a=arm/5*6.283+Math.log(.06+u)*1.4*(k==="o"?-1:1)+t*.00025*(k==="q"?.72:1);
      const x=V.x+Math.cos(a)*r,y=V.y+Math.sin(a)*r*.86;s?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}
    // label
    const shown=k==="q"?fish.filter(f=>f.who==="q"&&!f.ghost&&f.year<=Math.min(year,2020)).length:V.n;
    label(V.x,V.y-V.R*.86-16,V.label,(k==="o"?"11,125 件 · 1 條＝8 件":k==="s"?"2,381 件":shown.toLocaleString()+" 族"),V.col)}
  // arm labels for Qualcomm
  const V=VX.q;ctx.font="500 11px 'Noto Sans TC',sans-serif";ctx.textAlign="center";
  ARMS.forEach(([k,,cnt])=>{if(cnt<50)return;const s=ARM_SECT[k],a=(s.a0+s.a1)/2+Math.log(1.02)*1.25+t*.00018;const r=V.R*1.08;
    const x=V.x+Math.cos(a)*r,y=V.y+Math.sin(a)*r*.86;ctx.fillStyle="rgba(4,11,22,.7)";const lab=ARM_SHORT[k]||k;const w=ctx.measureText(lab).width+10;ctx.fillRect(x-w/2,y-9,w,16);ctx.fillStyle="#cfe9ff";ctx.fillText(lab,x,y+3)})}
/* ======== 名魚：把 STARS（報告表 11、表 13 與高通 1 件）掛到魚上，只有這些魚顯示報告中的公告號 ======== */
{const os=fish.filter(f=>f.who==="o"&&f.r0>.25&&f.r0<.8);STARS.filter(x=>x[0]==="hevc").forEach((x,i)=>{const f=os[i*37%os.length];f.big={pool:"hevc",rank:x[1],no:x[2],own:x[3],cites:x[4],yr:x[6],sum:x[7]};f.cites=x[4]});
 const q=qFish.find(f=>f.year===2014&&!f.star&&f.r0>.3),x=STARS.find(x=>x[0]==="q");if(q){q.big={pool:"q",rank:0,no:x[2],own:x[3],cites:x[4],yr:x[6],sum:x[7]};q.cites=88;const o=qFish.find(f=>f.rec&&f.rec[0]==="US20140286413A1");if(o&&o!==q){const t=o.rec;o.rec=q.rec;q.rec=t}}}
/* ======== 共用繪圖小工具（各模式都會用）＋漩渦水流 ======== */
function hexA(h,a){const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`}
function label(x,y,title,sub,col){ // 儀器標籤：細框、角刻、主標題＋寬距等寬副標
  ctx.save();ctx.textAlign="center";ctx.font="600 13px 'Noto Sans TC',sans-serif";const tw=ctx.measureText(title).width;
  ctx.font="500 10px 'IBM Plex Mono',monospace";if("letterSpacing" in ctx)ctx.letterSpacing="1px";const sw=ctx.measureText(sub).width;
  const w=Math.max(tw,sw)+26,x0=x-w/2,y0=y-17,h=37;
  ctx.fillStyle="rgba(3,9,18,.78)";ctx.fillRect(x0,y0,w,h);ctx.strokeStyle="rgba(120,220,255,.16)";ctx.lineWidth=1;ctx.strokeRect(x0+.5,y0+.5,w-1,h-1);
  ctx.strokeStyle=col;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x0,y0+8);ctx.lineTo(x0,y0);ctx.lineTo(x0+8,y0);ctx.moveTo(x0+w,y0+h-8);ctx.lineTo(x0+w,y0+h);ctx.lineTo(x0+w-8,y0+h);ctx.stroke();
  ctx.fillStyle=col;ctx.globalAlpha=.9;ctx.fillRect(x0,y0+11,2,h-22);ctx.globalAlpha=1;
  ctx.fillStyle="#7f97a6";ctx.fillText(sub,x,y+14);if("letterSpacing" in ctx)ctx.letterSpacing="0px";ctx.font="600 13px 'Noto Sans TC',sans-serif";ctx.fillStyle="#e4f1f7";ctx.fillText(title,x,y);ctx.restore()}
function fadeTrail(){trx.globalCompositeOperation="destination-out";trx.fillStyle=`rgba(0,0,0,${SPEED>=3?.26:.19})`;trx.fillRect(0,0,W,H);trx.globalCompositeOperation="source-over"}
const STREAMS=[];for(let i=0;i<1100;i++){const k=i<520?"q":i<800?"s":"o";STREAMS.push({k,u:Math.random(),arm:Math.floor(Math.random()*5),off:(Math.random()-.5)*.25,sp:.6+Math.random()*.8,
  col:k==="q"?Object.values(ARM_COL)[i%6]:k==="s"?S_COLS[i%4]:O_COLS[i%5]})}
function drawStreams(t){const by=new Map();
  for(const p of STREAMS){p.u-=.0016*p.sp*SPEED;if(p.u<0)p.u=1;const V=VX[p.k];const r=V.R*(.06+p.u*1.05);
    const a=p.arm/5*6.283+p.off+Math.log(.06+p.u)*1.4*(p.k==="o"?-1:1)+t*.00025*(p.k==="q"?.72:1);
    (by.get(p.col)||by.set(p.col,[]).get(p.col)).push([V.x+Math.cos(a)*r,V.y+Math.sin(a)*r*.86,1+(1-p.u)*1.4])}
  for(const[col,arr]of by){ctx.fillStyle=col;ctx.globalAlpha=.85;ctx.beginPath();arr.forEach(([x,y,z])=>{ctx.moveTo(x+z,y);ctx.arc(x,y,z,0,6.283)});ctx.fill()}ctx.globalAlpha=1}
