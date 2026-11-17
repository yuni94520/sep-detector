/* ======== 電影式字幕＋土星錨點特效＋經濟效益天幕（參考 FABLE 簡報導覽版的鏡頭語言；數字與註記不變） ======== */
var CINE_OK=true;
const CN={el:document.getElementById('cine'),num:null,shown:0,shock:-1e9,shockCol:"190,245,255",flash:-1e9,flashCol:"255,250,228"};
const cnEl=CN.el.querySelector('.cn');
function cineSet(k,h,s,o){const e=CN.el;e.querySelector('.ck').textContent=k;e.querySelector('.ch').textContent=h;e.querySelector('.cs').textContent=s;
  e.querySelector('.cu').textContent=o.unit||"";cnEl.className='cn'+(o.cls?' '+o.cls:'');
  if(o.text!=null){CN.num=null;cnEl.textContent=o.text}else{CN.num={from:o.from!=null?o.from:CN.shown,to:o.to,t0:performance.now(),dur:o.dur||1500,fmt:o.fmt||(v=>Math.round(v).toLocaleString())}}
  e.classList.remove('in');void e.offsetWidth;e.classList.add('in')}
function cineTick(now){const n=CN.num;if(!n)return;const q=Math.min(1,(now-n.t0)/n.dur),ez=1-Math.pow(1-q,4),v=n.from+(n.to-n.from)*ez;CN.shown=v;const tx=n.fmt(v);if(cnEl.textContent!==tx)cnEl.textContent=tx;if(q>=1)CN.num=null}
function cinePlace(){CN.el.style.top=(TOPB+(W<860?50:48))+'px'}
function cineMode(m){const on=m==="saturn"||m==="eco";CN.el.hidden=!on;document.body.classList.toggle('cine',on);cinePlace();
  document.getElementById('satPlay').hidden=m!=="saturn";if(m!=="saturn")satStop();
  if(m==="saturn")cineSat(phase,phase,true)}
const cineBottom=()=>{const r=CN.el.getBoundingClientRect();return CN.el.hidden?TOPB:Math.max(r.bottom,TOPB+90)};

/* ---------- 土星錨點 ---------- */
const SFX={t0:-1e9,ph:4,prev:4,parts:[],beams:[],play:null};
function cineSat(i,prev,quiet){if(!window.CINE_OK)return;const c=SAT_CINE[i];
  const o=Object.assign({},c[3]);if(quiet)o.from=o.to;else if(i===4&&prev===3)o.from=4407;cineSet(c[0],c[1],c[2],o);
  if(quiet)return;SFX.t0=performance.now();SFX.prev=prev;SFX.ph=i;
  const R=SAT.R,P=(x,y,col,sp,life,sz)=>SFX.parts.push({x,y,vx:(x-SAT.x)/R*sp+(Math.random()-.5)*sp*.6,vy:(y-SAT.y)/R*sp*.6+(Math.random()-.5)*sp*.6,life:1,dec:1/life,col,sz});
  if(i>prev&&i<=2){for(const f of noise){if(f.alpha<.3||Math.random()>.35)continue;P(f.x,f.y,"150,165,180",1.6,70,1.6)}}
  if(i===4&&prev<4){const rf=fish.filter(f=>f.who==="q"&&!f.ghost&&f.role!=="core"&&f.alpha>.3);for(let k=0;k<260&&rf.length;k++){const f=rf[Math.floor(Math.random()*rf.length)];P(f.x,f.y,"255,95,135",2.2,80,2.2)}}
  if(i>=3)SFX.beams=fish.filter(f=>f.who==="q"&&!f.ghost&&f.role!=="core"&&f.jit<.045)}
function satStop(){if(SFX.play){SFX.play.forEach(clearTimeout);SFX.play=null}const b=document.getElementById('satPlay');if(b)b.textContent="▶ 播放四步驟 Phase 0 → 4"}
function satPlay(){if(SFX.play){satStop();return}setPhase(0);SFX.play=[1,2,3,4].map(i=>setTimeout(()=>{setPhase(i);if(i===4)satStop()},3400*i));document.getElementById('satPlay').textContent="■ 停止"}
const SHOCK_COL=["170,185,200","95,243,255","220,252,255","143,123,255","255,209,102"];
function drawSatFX(t,now){const R=SAT.R,x=SAT.x,y=SAT.y;ctx.save();ctx.globalCompositeOperation="lighter";
  // 換階段衝擊波：一圈沿環面、一圈沿球面
  const p=(now-SFX.t0)/1500;if(p>=0&&p<1){const c=SHOCK_COL[SFX.ph],e=1-p;
    ctx.strokeStyle=`rgba(${c},${.75*e})`;ctx.lineWidth=1+6*e;ctx.beginPath();ctx.ellipse(x,y,R*(.4+3.4*p),R*(.4+3.4*p)*.3,-.09,0,6.283);ctx.stroke();
    ctx.strokeStyle=`rgba(${c},${.4*e})`;ctx.lineWidth=1+3*e;ctx.beginPath();ctx.arc(x,y,R*(.3+2.2*p),0,6.283);ctx.stroke()}
  // Phase 2：核心點燃（白熱閃光＋放射光芒）
  const q=(now-SFX.t0)/1800;if(SFX.ph===2&&q>=0&&q<1){const e=Math.pow(1-q,1.6),rr=R*(.5+1.8*q);
    const g=ctx.createRadialGradient(x,y,0,x,y,rr);g.addColorStop(0,`rgba(255,255,255,${.9*e})`);g.addColorStop(.25,`rgba(160,245,255,${.45*e})`);g.addColorStop(1,"rgba(95,243,255,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rr,0,6.283);ctx.fill();
    ctx.strokeStyle=`rgba(220,252,255,${.55*e})`;ctx.lineWidth=1.2;ctx.beginPath();for(let k=0;k<14;k++){const a=k/14*6.283+now*.0004,l=R*(1.1+.9*(k%2))*(.6+q);ctx.moveTo(x+Math.cos(a)*R*.35,y+Math.sin(a)*R*.35);ctx.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l)}ctx.stroke()}
  // 核心常亮的脈動光暈（Phase ≥ 2）
  if(phase>=2){const br=.5+.5*Math.sin(now*.0021),g=ctx.createRadialGradient(x,y,R*.1,x,y,R*1.15);g.addColorStop(0,`rgba(120,240,255,${.16+.08*br})`);g.addColorStop(1,"rgba(120,240,255,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R*1.15,0,6.283);ctx.fill()}
  // Phase 3–4：錨點輻射光束——由核心射向環上的家族，光點沿線往外跑
  if(phase>=3&&SFX.beams.length){const k3=phase===3?1:.4;ctx.lineWidth=1.3;
    for(const f of SFX.beams){if(f.alpha<.4)continue;const dx=f.x-x,dy=f.y-y,d=Math.hypot(dx,dy)||1,sx=x+dx/d*R*.8,sy=y+dy/d*R*.8,c=f.role==="B"?"95,243,255":"160,140,255";
      const lg=ctx.createLinearGradient(sx,sy,f.x,f.y);lg.addColorStop(0,`rgba(255,226,160,${.75*k3})`);lg.addColorStop(1,`rgba(255,226,160,${.1*k3})`);ctx.strokeStyle=lg;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(f.x,f.y);ctx.stroke();
      const u=(now*.00055+f.jit*37)%1,px=sx+(f.x-sx)*u,py=sy+(f.y-sy)*u;ctx.fillStyle=`rgba(${c},${k3*(1-u*.5)})`;ctx.beginPath();ctx.arc(px,py,2.4,0,6.283);ctx.fill();ctx.fillStyle=`rgba(255,255,255,${.8*k3*(1-u)})`;ctx.beginPath();ctx.arc(px,py,1.1,0,6.283);ctx.fill()}}
  // Phase 4：被 2+ Unit 同時找到的金魚閃爍星芒
  if(phase===4){ctx.strokeStyle="#fff3c9";ctx.lineWidth=1;for(const f of qFish){if(!f.multi||f.jit>.16||f.alpha<.5||(f.z??0)<0)continue;const tw=Math.sin(now*.004+f.jit*260);if(tw<.4)continue;const l=2+8*tw;
    ctx.globalAlpha=tw*.85;ctx.beginPath();ctx.moveTo(f.x-l,f.y);ctx.lineTo(f.x+l,f.y);ctx.moveTo(f.x,f.y-l);ctx.lineTo(f.x,f.y+l);ctx.stroke()}ctx.globalAlpha=1}
  // 粒子：雜訊被甩出（灰）、跨 Unit 重複被刪除（紅）
  for(let i=SFX.parts.length-1;i>=0;i--){const s=SFX.parts[i];s.x+=s.vx;s.y+=s.vy;s.vx*=.985;s.vy*=.985;s.life-=s.dec;if(s.life<=0){SFX.parts.splice(i,1);continue}
    ctx.fillStyle=`rgba(${s.col},${s.life*.9})`;ctx.fillRect(s.x-s.sz/2,s.y-s.sz/2,s.sz,s.sz)}
  ctx.restore();
  if(phase===4&&now-SFX.t0<4200&&SFX.prev===3){const a=Math.min(1,(4200-(now-SFX.t0))/800);ctx.globalAlpha=a;label(x+R*2.1,y+R*1.05,"刪除跨 Unit 重複 1,363 筆","4,407 → 3,044（30.9%）","#ff5f87");ctx.globalAlpha=1}}

/* ---------- 經濟效益：暮色天幕＋衝擊波＋大數字 ---------- */
const ESKY={w:0,h:0,cols:[],parts:[]};
function eskyBuild(){ESKY.w=W;ESKY.h=H;ESKY.cols=[];let x=0,s=7;const R=()=>{s=(s*16807)%2147483647;return s/2147483647};
  while(x<W){const bw=5+R()*10,u=x/W,base=u<.2?.78*(1-u/.2)**.7+.1:u>.84?.62*((u-.84)/.16)**.8+.08:.04+.04*Math.sin(u*40)+.02*Math.sin(u*97);ESKY.cols.push([x,bw+.6,Math.max(.03,base*(.72+R()*.5))]);x+=bw}
  ESKY.parts=[];for(let i=0;i<90;i++)ESKY.parts.push({x:R(),y:R(),s:.5+R()*1.4,sp:.3+R(),ph:R()*6.28})}
const ECO_PAL=[[[26,22,62],[122,58,120],[255,128,92]],[[6,12,34],[16,46,92],[60,170,220]],[[8,20,30],[20,70,70],[80,220,160]],[[54,38,76],[176,96,64],[255,198,110]]];
const EP={c:ECO_PAL[0].map(a=>a.slice())};
const rgbS=(c,a)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;
function drawEcoSky(now){if(ESKY.w!==W||ESKY.h!==H)eskyBuild();const tg=ECO_PAL[ECO.step]||ECO_PAL[0];EP.c.forEach((c,i)=>{for(let k=0;k<3;k++)c[k]+=(tg[i][k]-c[k])*.04});
  const [c0,c1,c2]=EP.c,hz=ECO.hz||H*.25,sx=W*.43;
  let g=ctx.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgbS(c0,1));g.addColorStop(.62,rgbS(c1,1));g.addColorStop(1,rgbS(c2,1));ctx.fillStyle=g;ctx.fillRect(0,0,W,hz);
  g=ctx.createRadialGradient(sx,hz,0,sx,hz,hz*1.4);g.addColorStop(0,rgbS(c2,.85));g.addColorStop(.18,rgbS(c2,.35));g.addColorStop(1,rgbS(c2,0));ctx.fillStyle=g;ctx.fillRect(0,0,W,hz);
  ctx.fillStyle=rgbS([c1[0]*.3+4,c1[1]*.3+6,c1[2]*.3+14],1);ctx.beginPath();for(const k of ESKY.cols)ctx.rect(k[0],hz-k[2]*hz*.7,k[1],k[2]*hz*.7+1);ctx.fill();
  // 燈塔剪影；總帳時點亮
  const lx=W*.5,lh=hz*.42,lw=Math.max(4,hz*.035);ctx.fillStyle="rgb(7,9,20)";ctx.beginPath();ctx.moveTo(lx-lw,hz);ctx.lineTo(lx-lw*.6,hz-lh);ctx.lineTo(lx+lw*.6,hz-lh);ctx.lineTo(lx+lw,hz);ctx.fill();
  ctx.fillRect(lx-lw*.5,hz-lh-lw*1.1,lw,lw*1.1);ctx.beginPath();ctx.moveTo(lx-lw*.75,hz-lh-lw*1.1);ctx.lineTo(lx,hz-lh-lw*2);ctx.lineTo(lx+lw*.75,hz-lh-lw*1.1);ctx.fill();
  if(ECO.step===3){const ly=hz-lh-lw*.55,th=now*.0011,cs=Math.cos(th);ctx.save();ctx.globalCompositeOperation="lighter";
    for(const d of[1,-1]){const L=W*.42*cs*d,a=.2+.45*Math.abs(cs),bg=ctx.createLinearGradient(lx,0,lx+L,0);bg.addColorStop(0,`rgba(255,240,200,${a})`);bg.addColorStop(1,"rgba(255,240,200,0)");ctx.fillStyle=bg;ctx.beginPath();ctx.moveTo(lx,ly-1.5);ctx.lineTo(lx+L,ly-hz*.12);ctx.lineTo(lx+L,ly+hz*.12);ctx.lineTo(lx,ly+1.5);ctx.fill()}
    g=ctx.createRadialGradient(lx,ly,0,lx,ly,hz*.3);g.addColorStop(0,"rgba(255,250,225,.9)");g.addColorStop(1,"rgba(255,220,150,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(lx,ly,hz*.3,0,6.283);ctx.fill();ctx.restore()}
  // 水面反光
  const SB=H*.03;g=ctx.createLinearGradient(0,hz,0,hz+SB*1.6);g.addColorStop(0,rgbS([c2[0]*.42+4,c2[1]*.42+8,c2[2]*.42+18],.95));g.addColorStop(1,rgbS(c2,0));ctx.fillStyle=g;ctx.fillRect(0,hz,W,SB*1.6);
  ctx.fillStyle=rgbS(c2,.9);ctx.fillRect(0,hz-.5,W,1);
  for(let i=0;i<9;i++){const y=hz+2+i*(SB*1.25/9),w=hz*.7*(1-.5*i/9)*(.55+.45*Math.sin(now*.0028+i*1.9));ctx.globalAlpha=.75*(1-i/9);ctx.fillRect(sx-w/2+Math.sin(now*.0017+i*2.3)*4,y,w,Math.max(1.5,SB*.07))}ctx.globalAlpha=1;
  // 水下天光
  ctx.save();ctx.globalCompositeOperation="lighter";g=ctx.createRadialGradient(sx,hz,0,sx,hz,H*.9);g.addColorStop(0,rgbS(c2,.12));g.addColorStop(1,rgbS(c2,0));ctx.fillStyle=g;ctx.beginPath();
  for(let i=0;i<7;i++){const a=Math.PI/2+(i-3)*.21+Math.sin(now*.00023+i*1.3)*.035,hw=.02+.016*Math.sin(now*.0004+i*2.1)**2,L=H*1.2;ctx.moveTo(sx,hz);ctx.lineTo(sx+Math.cos(a-hw)*L,hz+Math.sin(a-hw)*L);ctx.lineTo(sx+Math.cos(a+hw)*L,hz+Math.sin(a+hw)*L);ctx.closePath()}ctx.fill();
  ctx.fillStyle=rgbS(c2,1);for(const p of ESKY.parts){const yy=hz+H*.03+(((p.y-now*.0000085*p.sp)%1)+1)%1*(H-hz),xx=(p.x+Math.sin(now*.0003*p.sp+p.ph)*.012)*W;ctx.globalAlpha=.35*(.3+.7*Math.max(0,Math.sin(now*.0012*p.sp+p.ph)));ctx.fillRect(xx,yy,p.s,p.s)}
  ctx.restore();ctx.globalAlpha=1}
function ecoFX(now){const p=(now-CN.shock)/1200;if(p>=0&&p<1){const cx=W/2,cy=(ECO.top+ECO.bot)/2,r=p*Math.hypot(W,H)*.62;ctx.save();ctx.globalCompositeOperation="lighter";
    ctx.strokeStyle=`rgba(${CN.shockCol},${.55*(1-p)})`;ctx.lineWidth=1+8*(1-p);ctx.beginPath();ctx.arc(cx,cy,r,0,6.283);ctx.stroke();
    ctx.fillStyle=`rgba(${CN.shockCol},${.12*(1-p)**3})`;ctx.fillRect(0,0,W,H);ctx.restore()}
  const q=(now-CN.flash)/1700;if(q>=0&&q<1){const lx=W*.5,ly=ECO.hz||H*.25,r=(.08+q)*Math.hypot(W,H),g=ctx.createRadialGradient(lx,ly,0,lx,ly,r);
    g.addColorStop(0,`rgba(${CN.flashCol},${.75*(1-q)**1.5})`);g.addColorStop(.5,`rgba(${CN.flashCol},${.25*(1-q)**1.5})`);g.addColorStop(1,`rgba(${CN.flashCol},0)`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}}
function cineEco(i){if(!window.CINE_OK)return;const N=ECO.base,per=ECO.per,mh=N*H_PER,mc=N*per,ac=N*AI_PER,yrs=(mh/H_YEAR).toFixed(1),now=performance.now();
  const usd=v=>"$"+Math.round(v).toLocaleString();
  if(i===0)cineSet("驗證成本 · TCL v. Ericsson (2017)","便宜的驗不準，驗得準的付不起","專利池等級每件 US$"+per.toLocaleString()+"（Via Licensing，判決 p.30）；人工時間假設每件 0.5 小時",{from:0,to:mc,dur:2600,cls:"red",fmt:usd,unit:N.toLocaleString()+" 件全部人工驗證 · "+Math.round(mh).toLocaleString()+" 小時（約 "+yrs+" 年）"});
  if(i===1)cineSet("工具三階段漏斗","同一池專利，工具 72 小時掃完","語意向量＋8 維度評分；費用依 API 帳單 $11,035／1.7 萬件換算",{from:0,to:AI_H,dur:2200,fmt:v=>Math.round(v)+" h",unit:"人工需 "+Math.round(mh).toLocaleString()+" h · 快 "+(mh/AI_H).toFixed(0)+" 倍 · 費用約 "+money(ac)});
  if(i===2)cineSet("三星黃金集 · 同方法未調權重","拿專利池公告當答案卷","準確率 88% 是黃金集驗證高通名單；三星公告名單是另一份答卷",{from:0,to:56,dur:2200,fmt:v=>Math.round(v)+"%",unit:"重現率 · 工具未漏檢 "+TP.toLocaleString()+" / "+GOLD.toLocaleString()+" 件"});
  if(i===3)cineSet("總帳 · 同一批 "+N.toLocaleString()+" 件","省下 "+money(mc-ac)+"，約 "+yrs+" 年","人工每件 US$"+per.toLocaleString()+"、假設 0.5 小時；工具 72 小時、約 "+money(ac),{from:0,to:mc-ac,dur:2800,cls:"gold",fmt:usd,unit:"省下的驗證費用 · "+Math.round(mh-AI_H).toLocaleString()+" 小時"});
  CN.shock=now;CN.shockCol=["255,140,140","95,243,255","77,255,154","255,209,102"][i];if(i===3||i===0){CN.flash=now+200;CN.flashCol=i===3?"255,236,190":"255,120,110"}
  requestAnimationFrame(()=>{ECO.hz=cineBottom()+12;if(ECO.built&&Math.abs((ECO.top||0)-(ECO.hz+50))>4)ECO.built=false})}
document.getElementById('satPlay').onclick=satPlay;
(function cineLoop(now){cineTick(now);requestAnimationFrame(cineLoop)})(performance.now());
cineMode(mode);
