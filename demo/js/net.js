/* ======== 撒網 vs 燈塔 ======== */
const NET={step:0,tt:0,fish:[],bagX:0,bagY:0};
const NET_ORDER=[0,1,2,3];
const netBox=document.getElementById('netSteps');
NET_ORDER.forEach(i=>{const s=NET_STEPS[i];const b=document.createElement('button');b.type='button';b.className='ph';b.dataset.i=i;
  b.innerHTML=`<span class="n">${s[0]}</span><span class="t"></span><span class="c">${s[2]}</span>`;b.querySelector('.t').textContent=s[1];b.onclick=()=>netStart(i);netBox.appendChild(b)});
document.getElementById('netReplay').onclick=()=>netStart(NET.step);
const zone=()=>({sTop:H*.2,sBot:H*.5,ceil:H*.535,dTop:H*.58,dBot:H*.93});
function netBuild(){
  NET.fish=[];const z=zone(),xs=()=>W*(.04+rnd()*.92);
  const roles=[];for(let i=0;i<1744;i++)roles.push(i%2?"A":"B");
  for(let i=0;i<1300;i++)NET.fish.push({kind:"core",hx:xs(),hy:z.sTop+rnd()*(z.sBot-z.sTop)});
  roles.forEach(r=>NET.fish.push({kind:"deep",role:r,hx:xs(),hy:z.dTop+rnd()*(z.dBot-z.dTop)}));
  for(let i=0;i<1956;i++){const deep=rnd()<.3;NET.fish.push({kind:"noise",hx:xs(),hy:deep?z.dTop+rnd()*(z.dBot-z.dTop):z.sTop+rnd()*(z.sBot-z.sTop)})}
  NET.fish.forEach(f=>{f.x=f.hx;f.y=f.hy;f.vx=0;f.vy=0;f.ph=rnd()*6.28;f.jit=rnd();f.th=rnd()*6.28});
  const real=NET.fish.filter(f=>f.kind!=="noise").sort(()=>rnd()-.5);
  real.forEach((f,i)=>{f.multi=i<1112;f.hot=false});
  /* 撒網情境：IPC＋時間段撈到的魚中真 SEP 極少（示意） */NET.fish.forEach(f=>{f.sep0=rnd()<.08;f.keep=rnd()<.1;f.col0=Object.values(ARM_COL)[Math.floor(rnd()*6)]});[...real].sort(()=>rnd()-.5).slice(0,152).forEach((f,i)=>{f.hot=true;f.hi=i});NET.ex=real.find(f=>f.hot&&f.kind==="deep")}
function netStart(i){NET.step=i;NET.tt=0;NET.checked=0;if(!NET.fish.length||NET.lastW!==W||NET.lastH!==H){netBuild();NET.lastW=W;NET.lastH=H}
  NET.fish.forEach(f=>{f.caught=false;f.esc=0;f.lit=null;f.bx=(rnd()-.5);f.by=rnd()});
  if(i>=2&&i<4)NET.fish.forEach(f=>{if(f.kind==="core")f.caught=true});
  if(i===3)NET.fish.forEach(f=>{if(f.kind==="deep")f.lit=f.multi?"AB":f.role});
  [...netBox.children].forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===i));
  document.getElementById('netNote').textContent=NET_STEPS[i][3];
  document.getElementById('nl1').textContent=i===3?"優先人工驗證":i===2?"入軌真 SEP":"網中魚數";
  document.getElementById('nl2').textContent=i===0?"抽驗 100 篇中的 SEP":i===1?"深水未撈到的真 SEP":i===2?"被 2+ 個 Unit 找到（金）":"驗證費用（每件 1 萬美元）"}
const LH=()=>({x:W<860?W*.5:280+(W-610)*.5,y:H*.33,R:Math.min(W,H)*.07});
function netFrame(now){
  const t=NET.tt,z=zone(),st=NET.step,L=LH();
  ctx.fillStyle="#050c18";ctx.fillRect(0,0,W,H);
  // water layers
  const g=ctx.createLinearGradient(0,z.sTop,0,H);g.addColorStop(0,"#0a1f3c");g.addColorStop(.42,"#071630");g.addColorStop(1,"#040b18");ctx.fillStyle=g;ctx.fillRect(0,z.sTop-30,W,H);
  ctx.font="500 11px 'Noto Sans TC',sans-serif";ctx.textAlign="left";ctx.fillStyle="#6f8b99";
  ctx.fillText("技術語言區（規格書用語：CTU、AMVP、Merge…）",W<860?16:296,z.sTop-10);
  ctx.fillText("法律語言區（請求項上位化：encoding unit、prediction means…）",W<860?16:296,z.dTop-10);
  // ceiling
  ctx.strokeStyle=st===1?"rgba(255,209,102,.7)":"rgba(255,255,255,.12)";ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(0,z.ceil);ctx.lineTo(W,z.ceil);ctx.stroke();ctx.setLineDash([]);
  if(st===1){ctx.fillStyle="#ffd166";ctx.textAlign="right";ctx.fillText("結構性天花板 ~1,300",W-(W<860?16:346),z.ceil-6)}
  // net geometry
  const dur=6500,p=Math.min(t/dur,1),haul=Math.max(0,Math.min((t-dur)/1800,1));
  const front=-W*.25+p*W*1.35,netW=W*.3,netTop=z.sTop-10,netBot=st===0?z.dBot+10:z.ceil-4;
  NET.bagX=front-netW*.45;NET.bagY=(netTop+netBot)/2;
  if(st<2&&haul>0){NET.bagX=NET.bagX+(L.x-NET.bagX)*haul;NET.bagY=NET.bagY+(H*.4-NET.bagY)*haul}
  // fish update
  let caught=0,real=0,deepLeft=0,orbit=0,ab=0;const beams=st===2?[{a:Math.PI*.5+Math.sin(t*.00055)*1.32,col:"159,216,255",key:"B"},{a:Math.PI*.5+Math.sin(t*.00055+2.2)*1.32,col:"185,166,255",key:"A"}]:[];
  for(const f of NET.fish){
    let tx,ty;
    if(st<2&&!f.caught&&!f.esc&&p<1&&f.x<front&&f.x>front-netW&&f.y>netTop&&f.y<netBot){
      if(st===0&&f.sep0&&!f.keep){f.esc=t;{let x=20+rnd()*(W-40);if(x>W*.3&&x<W*.62)x=rnd()<.5?W*.3-rnd()*W*.25:W*.62+rnd()*W*.33;f.ex=x}f.ey=Math.max(z.sTop,Math.min(z.dBot,f.y+(rnd()-.5)*240))}
      else if(st===0||f.kind==="core")f.caught=true}
    if(st===2&&f.kind==="deep"&&!f.lit){for(const b of beams){const dx=f.x-L.x,dy=f.y-L.y;const a=Math.atan2(dy,dx);let d=Math.abs(a-b.a);d=Math.min(d,6.283-d);
      if(d<.11&&Math.hypot(dx,dy)<Math.max(W,H)){if(f.role===b.key||f.multi){f.lit=f.multi?"AB":f.role}}}}
    if(f.caught&&st<2){const r=Math.min(W,H)*(st===0?.2*(1-haul*.15):.1*(1-haul*.5));tx=NET.bagX+f.bx*r*1.6;ty=NET.bagY+(f.by-.5)*r*2}
    else if(st===3&&f.hot){const a=f.th+t*.0005,rr=L.R*(1.15+.55*f.jit);tx=L.x+Math.cos(a)*rr;ty=L.y+Math.sin(a)*rr*.62;if(f===NET.ex){tx=L.x+L.R*2.6;ty=L.y+L.R*.9}}
    else if(st>=2&&f.kind==="core"){const a=f.th+t*.0004,rr=L.R*(.35+.65*f.jit);tx=L.x+Math.cos(a)*rr;ty=L.y+Math.sin(a*1.3)*rr*.9}
    else if(st>=2&&f.lit){const ring=f.role==="B"?1.9:f.role==="A"?2.9:2.4;const a=f.th+t*.00025*(3.2-ring);const r=L.R*(ring+(f.jit-.5)*.4);tx=L.x+Math.cos(a)*r;ty=L.y+Math.sin(a)*r*.28}
    else if(st===0&&f.sep0){const bx=f.esc?f.ex:f.hx,by=f.esc?f.ey:f.hy;tx=bx+Math.cos(t*.0009+f.ph)*70+Math.sin(t*.0004+f.jit*9)*40;ty=by+Math.sin(t*.0011+f.ph*1.3)*28}
    else{tx=f.hx+Math.cos(t*.0004+f.ph)*14;ty=f.hy+Math.sin(t*.0006+f.ph*1.3)*6;if(st===1&&f.kind==="noise"&&Math.abs(f.x-front+netW*.5)<netW*.6&&f.y<z.ceil)tx+=12}
    const kk=st===0&&f.esc&&t-f.esc<600?.16:.07;f.vx=f.vx*.8+(tx-f.x)*kk;f.vy=f.vy*.8+(ty-f.y)*kk;f.x+=f.vx+Math.cos(f.ph+t*.003)*.2;f.y+=f.vy;f.ph+=.12;
    if(f.caught&&st<2){caught++;if(f.kind!=="noise")real++}
    if(st===1&&f.kind==="deep")deepLeft++;
    if(st===2&&(f.kind==="core"||f.lit)){orbit++;if(f.lit==="AB")ab++}}
  if(st===3){orbit=152}
  // draw fish
  const grp={dim:[],grey:[],blue:[],B:[],A:[],AB:[],gold0:[]};
  for(const f of NET.fish){
    if(st===0)(f.sep0?grp.gold0:f.caught?grp.grey:grp.dim).push(f);
    else if(st===1)(f.caught?grp.blue:grp.dim).push(f);
    else if(st===3)(f.hot?grp.AB:grp.dim).push(f);
    else (f.kind==="core"?grp.blue:f.lit==="AB"?grp.AB:f.lit==="A"?grp.A:f.lit==="B"?grp.B:grp.dim).push(f)}
  const paint=(arr,col,a,s)=>{if(!arr.length)return;ctx.globalAlpha=a;ctx.fillStyle=col;ctx.beginPath();arr.forEach(f=>fishPath(f,s));ctx.fill();ctx.globalAlpha=1};
  paint(grp.dim,"#5f7584",st===3?.35:st===2?.55:.8,2.6);paint(grp.grey,"#7d8b95",st===0&&haul>.6?.45:.8,2.4);
  fadeTrail();ctx=trx;ctx.globalCompositeOperation="lighter";
  const AC=Object.values(ARM_COL);const byc=new Map();grp.blue.forEach(f=>{const c=AC[Math.floor(f.jit*6)];(byc.get(c)||byc.set(c,[]).get(c)).push(f)});
  for(const[c,arr]of byc)paint(arr,c,.55,2.6);
  paint(grp.B,COL.B,.6,2.6);paint(grp.A,COL.A,.6,2.6);paint(grp.AB,COL.gold,st===3?.95:.75,st===3?3.4:2.9);
  ctx.globalCompositeOperation="source-over";ctx=MAIN;ctx.globalCompositeOperation="lighter";ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.drawImage(trail,0,0,W,H);ctx.restore();ctx.globalCompositeOperation="source-over";
  // net
  if(st<2){const nx=haul>0?NET.bagX-netW*.5:front-netW,ny=haul>0?NET.bagY-(netBot-netTop)*(.5-haul*.25):netTop,nh=(netBot-netTop)*(1-haul*.5),nw=netW*(1-haul*.4);
    ctx.strokeStyle=st===0?"rgba(220,230,236,.35)":"rgba(127,224,208,.55)";ctx.lineWidth=1;const mesh=st===0?26:12;
    ctx.beginPath();for(let x=0;x<=nw;x+=mesh){ctx.moveTo(nx+x,ny);ctx.quadraticCurveTo(nx+x-14,ny+nh*.5,nx+x,ny+nh)}
    for(let y=0;y<=nh;y+=mesh){ctx.moveTo(nx,ny+y);ctx.lineTo(nx+nw,ny+y)}ctx.stroke();
    ctx.strokeStyle="rgba(220,230,236,.7)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(nx+nw,ny);ctx.lineTo(nx+nw,ny+nh);ctx.stroke();
    ctx.beginPath();ctx.moveTo(nx+nw,ny);ctx.lineTo(nx+nw+40,0);ctx.stroke();
    if(st===0&&haul>.6){const gold=NET.fish.filter(f=>f.caught&&f.sep0).length,all=NET.fish.filter(f=>f.sep0).length;label(NET.bagX,NET.bagY-Math.min(W,H)*.17-40,"撈到 "+caught.toLocaleString()+" 筆，有色 SEP 只有 "+gold+" 條","海裡 "+all+" 條有色 SEP，其餘都從網邊溜走（示意）",COL.gold)}
    if(st===1&&p>=1){label(NET.bagX,NET.bagY-80,"高純度，但只有 "+caught.toLocaleString(),"深水仍有 "+deepLeft.toLocaleString()+" 條真 SEP",COL.q)}}
  if(st===0&&grp.gold0.length){const bc=new Map();grp.gold0.forEach(f=>{(bc.get(f.col0)||bc.set(f.col0,[]).get(f.col0)).push(f)});
    ctx.save();ctx.shadowBlur=LQ?0:(8);for(const[c,arr]of bc){ctx.shadowColor=c;paint(arr,c,1,3.4)}ctx.restore();
    NET.fish.forEach(f=>{if(f.esc&&t-f.esc<700){ctx.strokeStyle=`rgba(255,255,255,${1-(t-f.esc)/700})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(f.x,f.y,6+(t-f.esc)/60,0,6.28);ctx.stroke()}})}
  // 上岸抽驗：100 篇人工判讀，0 篇是 SEP
  if(st===0&&t>dur+1800){const k=Math.min(1,(t-dur-1800)/6500),n=Math.floor(k*100),cs=W<860?14:22,gx=W<860?16:Math.min(W-cs*10-60,NET.bagX+Math.min(W,H)*.2*.85*1.6+60),gy=H*.24;
    NET.checked=n;ctx.fillStyle="rgba(4,11,22,.86)";ctx.fillRect(gx-12,gy-46,cs*10+24,cs*10+104);
    ctx.font="700 13px 'Noto Sans TC',sans-serif";ctx.textAlign="left";ctx.fillStyle="#e6eff3";ctx.fillText("抽 100 篇人工判讀",gx,gy-26);
    ctx.font="400 11px 'IBM Plex Mono',monospace";ctx.fillStyle="#8ea6b2";ctx.fillText("已驗 "+n+" / 100",gx,gy-10);
    for(let i=0;i<100;i++){const cx=gx+(i%10)*cs+cs/2,cy=gy+Math.floor(i/10)*cs+cs/2;
      ctx.fillStyle=i<n?"rgba(255,95,95,.18)":"rgba(255,255,255,.05)";ctx.fillRect(cx-cs/2+1,cy-cs/2+1,cs-2,cs-2);
      ctx.fillStyle=i<n?"#7d8b95":"#56636c";ctx.beginPath();fishPath({x:cx,y:cy,vx:1,vy:0,ph:i},cs*.17);ctx.fill();
      if(i<n){ctx.strokeStyle="#ff6b6b";ctx.lineWidth=1.6;const r=cs*.28;ctx.beginPath();ctx.moveTo(cx-r,cy-r);ctx.lineTo(cx+r,cy+r);ctx.moveTo(cx+r,cy-r);ctx.lineTo(cx-r,cy+r);ctx.stroke()}}
    const by=gy+cs*10+22;ctx.font="700 "+(W<860?16:22)+"px 'IBM Plex Mono',monospace";ctx.fillStyle=n>=100?"#ff6b6b":"#e6eff3";ctx.fillText("SEP："+"0 / "+n,gx,by);
    ctx.font="400 11px 'Noto Sans TC',sans-serif";ctx.fillStyle="#9fb4bf";ctx.fillText(n>=100?"100 篇裡沒有一篇是 SEP":"判讀中…",gx,by+18);
    if(n>=100){ctx.fillStyle="#ffd166";ctx.fillText("整網委外驗證 ≈ 5,000 × US$10,000＝US$5,000 萬",gx,by+34)}}
  // lighthouse + darkness
  if(st>=2){
    const dk=NET.dk||(NET.dk=document.createElement('canvas'));if(dk.width!==W||dk.height!==H){dk.width=W;dk.height=H}const d=dk.getContext('2d');d.globalCompositeOperation='source-over';d.clearRect(0,0,W,H);
    d.fillStyle="rgba(5,16,36,.8)";d.fillRect(0,0,W,H);d.globalCompositeOperation="destination-out";
    beams.forEach(b=>{const len=Math.max(W,H)*.9;const gg=d.createRadialGradient(L.x,L.y,0,L.x,L.y,len);gg.addColorStop(0,"rgba(0,0,0,1)");gg.addColorStop(1,"rgba(0,0,0,.2)");d.fillStyle=gg;
      d.beginPath();d.moveTo(L.x,L.y);d.arc(L.x,L.y,len,b.a-.11,b.a+.11);d.closePath();d.fill()});
    const GR=L.R*(st===3?2.2:3.4);const gl=d.createRadialGradient(L.x,L.y,0,L.x,L.y,GR);gl.addColorStop(0,"rgba(0,0,0,1)");gl.addColorStop(1,"rgba(0,0,0,0)");d.fillStyle=gl;d.beginPath();d.arc(L.x,L.y,GR,0,6.28);d.fill();
    if(st===3&&NET.ex){const e=NET.ex,ge=d.createRadialGradient(e.x,e.y,0,e.x,e.y,46);ge.addColorStop(0,"rgba(0,0,0,1)");ge.addColorStop(1,"rgba(0,0,0,0)");d.fillStyle=ge;d.beginPath();d.arc(e.x,e.y,46,0,6.28);d.fill()}
    ctx.drawImage(dk,0,0);
    beams.forEach(b=>{const len=Math.max(W,H)*.9;const gg=ctx.createRadialGradient(L.x,L.y,0,L.x,L.y,len);gg.addColorStop(0,`rgba(${b.col},.28)`);gg.addColorStop(1,`rgba(${b.col},0)`);ctx.fillStyle=gg;
      ctx.beginPath();ctx.moveTo(L.x,L.y);ctx.arc(L.x,L.y,len,b.a-.11,b.a+.11);ctx.closePath();ctx.fill()});
    if(st===3){ctx.globalAlpha=.95;ctx.fillStyle=COL.gold;ctx.beginPath();NET.fish.forEach(f=>{if(f.hot)fishPath(f,3.2)});ctx.fill();ctx.globalAlpha=1;
      const e=NET.ex;label(L.x,L.y-L.R*1.25-18,"聚光燈：先驗 152 件","被引 51 次以上 · 約 US$152 萬",COL.gold);
      if(e){ctx.strokeStyle=COL.gold;ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(e.x,e.y,11+Math.sin(t*.005)*2,0,6.28);ctx.stroke();
        const bx=Math.min(e.x+18,W-(W<860?250:600)),by=e.y+16;ctx.fillStyle="rgba(4,11,22,.92)";ctx.fillRect(bx,by,232,66);ctx.fillStyle=COL.gold;ctx.fillRect(bx,by,3,66);
        ctx.textAlign="left";ctx.font="700 12px 'IBM Plex Mono',monospace";ctx.fillStyle="#fff";ctx.fillText("US 2014/0286413 A1",bx+10,by+17);
        ctx.font="400 11px 'Noto Sans TC',sans-serif";ctx.fillStyle="#cfe0e8";ctx.fillText("Disabling sign data hiding · 2014",bx+10,by+33);
        ctx.fillText("被引 88 次（核心）· H04N19",bx+10,by+48);ctx.fillStyle="#ff8a8a";ctx.fillText("法律狀態：Abandoned → 需人工複核",bx+10,by+62)}}
    else{
    ctx.strokeStyle="rgba(159,216,255,.25)";[1.9,2.9].forEach(k=>{ctx.beginPath();ctx.ellipse(L.x,L.y,L.R*k,L.R*k*.28,0,0,6.28);ctx.stroke()});
    const core=ctx.createRadialGradient(L.x,L.y,0,L.x,L.y,L.R);core.addColorStop(0,"rgba(255,244,214,.95)");core.addColorStop(.3,"rgba(79,179,255,.5)");core.addColorStop(1,"rgba(79,179,255,0)");ctx.fillStyle=core;ctx.beginPath();ctx.arc(L.x,L.y,L.R,0,6.28);ctx.fill();
    label(L.x,L.y-L.R*1.25-18,"核心球體＝燈塔","1,300 條 PQAI 錨點","#fff4d6");
    ctx.font="500 11px 'Noto Sans TC',sans-serif";ctx.textAlign="center";ctx.fillStyle="#9fd8ff";
    const bl=(b,txt)=>{const r=H*.5;ctx.fillStyle=`rgb(${b.col})`;ctx.fillText(txt,L.x+Math.cos(b.a)*r,L.y+Math.sin(b.a)*r)};bl(beams[0],"B 光束 · 引用網絡");bl(beams[1],"A 光束 · JCT-VC 提案人")}}
  NET.tick=(NET.tick||0)+1;
  if(NET.tick%6===0){document.getElementById('nc1').textContent=(st>=2?orbit:caught).toLocaleString();document.getElementById('nc2').textContent=st===3?"$1.52M":st===0?"0 / "+(NET.checked||0):(st===1?deepLeft:ab).toLocaleString()}
}
netStart(0);
