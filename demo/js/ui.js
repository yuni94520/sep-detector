/* ======== UI ======== */
const phBox=document.getElementById('phases');
PHASES.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.className='ph';b.setAttribute('aria-pressed',i===phase);
  b.innerHTML=`<span class="n">${p[0]}</span><span class="t"></span><span class="c">${p[2]}</span>`;b.querySelector('.t').textContent=p[1];
  b.onclick=()=>{if(window.CINE_OK)satStop();setPhase(i)};phBox.appendChild(b)});
function setPhase(i,auto){const prev=phase;phase=i;if(window.CINE_OK&&mode==="saturn"){cineSat(i,prev);}[...phBox.children].forEach((b,j)=>b.setAttribute('aria-pressed',j===i));document.getElementById('phaseNote').textContent=PHASES[i][3]}
setPhase(4);
document.getElementById('armKeys').innerHTML=ARMS.map(([k,l,c])=>`<div class="key"><i style="background:${ARM_COL[k]}"></i><span>${k} ${l}</span><em>~${c.toLocaleString()}</em></div>`).join('');
function setMode(m){mode=m;if(typeof CAM!=='undefined'){camReset();CAM.s=1;CAM.x=CAM.y=0}const zm=document.getElementById('zoom');if(zm)zm.hidden=m==="eco";document.getElementById('mEco').setAttribute('aria-pressed',m==="eco");document.getElementById('eco').hidden=m!=="eco";
  document.getElementById('desk').hidden=m==="eco";document.getElementById('prov').textContent=m==="ocean"?"池內申請年依期末報告到期結構回推（到期＝申請＋20 年，中間年份內插）；高通依合併去重儀表板；H.264 為示意；2027 年後為推演。":m==="eco"?"母數依期末報告；單件 US$10,000 依 TCL v. Ericsson 判決 p.30（Via Licensing）。魚為示意個體。":"模擬個體依簡報統計分布生成，非真實專利清單；匯入家族清單後可換成真實魚群。";
  document.getElementById('mOcean').setAttribute('aria-pressed',m==="ocean");document.getElementById('mVortex').setAttribute('aria-pressed',m==="vortex");document.getElementById('mSaturn').setAttribute('aria-pressed',m==="saturn");
  document.getElementById('mNet').setAttribute('aria-pressed',m==="net");document.getElementById('deskNet').hidden=m!=="net";
  document.getElementById('deskVortex').hidden=!(m==="vortex"||m==="ocean");document.getElementById('deskSaturn').hidden=m!=="saturn";
  document.querySelector('.clock').style.visibility=(m==="vortex"||m==="ocean")?"visible":"hidden";
  if(timer){clearInterval(timer);timer=null}
  const [y0,y1]=m==="ocean"?[OC_Y0,OC_Y1]:[2008,2023];yr.min=y0;yr.max=y1;play.textContent=`▶ 播放 ${y0}→${y1}`;
  if(m==="ocean"||m==="vortex")setYear(Math.max(y0,Math.min(y1,year)));
  document.getElementById('colorBy').hidden=!(m==="ocean"||m==="vortex");if(typeof setColorBy==="function"&&document.getElementById('cbLeg'))setColorBy(COLORBY);
  if(m==="net"){hover=null;tip.hidden=true;netStart(NET.step)}
  if(window.CINE_OK)cineMode(m);
  if(m==="eco"){hover=null;tip.hidden=true;ecoStart(ECO.step)}}
document.getElementById('mVortex').onclick=()=>setMode("vortex");document.getElementById('mSaturn').onclick=()=>setMode("saturn");
document.getElementById('mNet').onclick=()=>setMode("net");document.getElementById('mOcean').onclick=()=>setMode("ocean");document.getElementById('mEco').onclick=()=>setMode("eco");
document.querySelectorAll('#speeds button').forEach(b=>b.onclick=()=>{SPEED=+b.dataset.s;document.querySelectorAll('#speeds button').forEach(x=>x.setAttribute('aria-pressed',x===b))});
document.getElementById('ledgerBtn').onclick=()=>document.getElementById('ledger').classList.toggle('open');
const yr=document.getElementById('yr');
function setYear(y){y=+y;if(mode==="vortex"&&y>year&&typeof VWAVES!=="undefined"){VWAVES.push({k:"q",t0:performance.now()});if(y<=2014)VWAVES.push({k:"s",t0:performance.now()+200})}if(mode==="ocean"&&typeof OC!=="undefined"){if(y<year)OC.pops=[];else if(y>year&&y-year<=3)for(let k=year+1;k<=y;k++)ocYearPops(k)}year=y;yr.value=y;document.getElementById('yrTxt').textContent=y;
  if(mode==="ocean"){document.getElementById('yrBox').classList.toggle('ghost',year>OC_NOW);document.getElementById('yrLbl').textContent=phaseOf(year)+(year>OC_NOW?"（推演）":"");return}
  const g=year>2020;document.getElementById('yrBox').classList.toggle('ghost',g);document.getElementById('yrLbl').textContent=g?"推演年（外推）":"高通優先權年";
  fish.forEach(f=>{if(f.who==="q"&&f.year===year&&!f.born){f.born=true;const V=VX.q,a=rnd()*6.28;f.x=V.x+Math.cos(a)*V.R*1.6;f.y=V.y+Math.sin(a)*V.R*1.4;setTimeout(()=>f.born=false,2600)}})}
yr.oninput=()=>setYear(yr.value);
let timer=null;const play=document.getElementById('play');
const playLbl=()=>`▶ 播放 ${yr.min}→${yr.max}`;
play.onclick=()=>{if(timer){clearInterval(timer);timer=null;play.textContent=playLbl();return}
  const y0=+yr.min,y1=+yr.max;if(year>=y1)setYear(y0);else setYear(year);play.textContent="❚❚ 暫停";
  timer=setInterval(()=>{if(year>=y1){clearInterval(timer);timer=null;play.textContent=playLbl();return}setYear(year+1)},(mode==="ocean"?1700:1400)/SPEED)};
/* color-by toggle */
const CB_LEG={arm:()=>ARMS.map(([k,l,c])=>[`${k} ${l}`,ARM_COL[k],c]),geo:()=>GEO.map(([k,n,c])=>[k,c,n]),cite:()=>[["被引 51+（核心 152）","#ffd166",152],["31–50","#ff8a4c",411],["11–30","#3fa9e6",932],["1–10","#2b5d86",1549]]};
function setColorBy(k){COLORBY=k;document.querySelectorAll('#colorBy button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===k));
  if(k==="geo"&&mode==="ocean"){const pct=(T,c)=>{const t=T.reduce((a,b)=>a+b[1],0),r=T.find(x=>x[0]===c);return r?Math.round(r[1]/t*1000)/10+"%":"—"};
    const cs=["US","CN","JP","KR","TW","WO","其他"];
    document.getElementById('cbLeg').innerHTML='<table class="geoT"><tr><th></th><th>高通</th><th>HEVC 池</th><th>VVC 池</th></tr>'+cs.map(c=>`<tr><td><i style="background:${GEO_COL[c]}"></i>${c}</td><td>${pct(GEO,c)}</td><td>${pct(HEVC_GEO,c)}</td><td>${pct(VVC_GEO,c)}</td></tr>`).join('')+'</table><p class="note">「其他」各池定義不同：高通含 TOP10 以外國家；HEVC 池為美中韓日以外；VVC 池為 TOP10 以外。VVC 依 VVC 專利池儀表板（清洗前 3,742 件）比例。</p>';return}
  document.getElementById('cbLeg').innerHTML=CB_LEG[k]().map(([t,c,n])=>`<div class="key"><i style="background:${c}"></i><span>${esc(t)}</span><em>${n.toLocaleString()}</em></div>`).join('')}
document.querySelectorAll('#colorBy button').forEach(b=>b.onclick=()=>setColorBy(b.dataset.c));
document.getElementById('geoKeys').innerHTML=GEO.map(([k,n,c])=>`<div class="key"><i style="background:${c}"></i><span>${k}</span><em>${n.toLocaleString()}</em></div>`).join('');

/* claims → HEVC sections */
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
document.getElementById('drop').onclick=()=>{
  const txt=document.getElementById('claims').value.toLowerCase();const out=document.getElementById('matchOut');
  const sc=Object.entries(ARM_KW).map(([k,kws])=>{const hits=kws.filter(w=>txt.includes(w));return {k,hits,score:hits.reduce((s,w)=>s+(txt.split(w).length-1),0)}}).sort((a,b)=>b.score-a.score);
  if(!sc[0].score){out.innerHTML='<p class="note">沒有對到 HEVC 章節關鍵字（切片、編碼單元、AMVP、合併、POC/RPS、量化參數等），本案魚留在池外。</p>';caseFish=null;return}
  const best=ARM_SECT[sc[0].k]?sc[0].k:'6B';const mx=sc[0].score;
  out.innerHTML=sc.filter(s=>s.score).map(s=>`<span>${esc(s.k)} ${esc(KW_LABEL[s.k])}</span><span>${s.score}</span><div class="bar"><span style="width:${s.score/mx*100}%"></span></div><span style="grid-column:1/-1;color:var(--dim);font-size:.7rem">命中：${esc(s.hits.join('、'))}</span>`).join('');
  out.className='match';
  const pool=qFish.filter(f=>f.arm===best&&f.year<=Math.min(year,2020));const tgt=pool.sort((a,b)=>a.r0-b.r0)[Math.floor(pool.length*.5)]||qFish[0];
  caseFish={x:W*.97,y:H*.2,vx:-4,vy:2,ph:0,tgt,arm:best};if(mode!=="ocean")setMode("vortex")};
document.getElementById('clearCase').onclick=()=>{caseFish=null;const o=document.getElementById('matchOut');o.className='';o.innerHTML='<p class="note">本案魚已移除。</p>'};

/* hover */
const tip=document.getElementById('tip');
cv.addEventListener('pointermove',e=>{if(DRAG.on||mode==="net"||mode==="eco")return;const [WX,WY]=toWorld(e.clientX,e.clientY);const R2=1/(CAM.s*CAM.s);
  if(mode==="ocean"){let bb=null,bdd=900*R2;for(const f of OC.fish){if(!f.big||f.alpha<.3)continue;const d=(f.x-WX)**2+(f.y-WY)**2;if(d<bdd){bdd=d;bb=f}}
    if(bb){hover=bb;const B=bb.big,dead=ocDead(bb);const pl=B.pool==="hevc"?"HEVC 池 被引用第 "+B.rank+" 名":B.pool==="vvc"?"VVC 池 被引用第 "+B.rank+" 名":"高通 · 撒網 vs 燈塔示範案";
      tip.innerHTML=`<b style="font-family:var(--f-mono)">${esc(B.no)}</b><br>${esc(pl)}<br>權利人：${esc(B.own)}<br>被引用 <b>${B.cites}</b> 次${B.yr?" · 申請 "+esc(B.yr):""}<br>${esc(B.sum)}${B.pool!=="q"?"<br>"+(dead?"已屆 20 年，到期":"仍在有效期"):""}<br><span style="color:var(--dim)">出處：${B.pool==="q"?"Google Patents":"期末報告表 "+(B.pool==="hevc"?"11":"13")}</span>`;
      tip.hidden=false;tip.style.left=Math.min(e.clientX+14,W-290)+'px';tip.style.top=(e.clientY+14)+'px';return}}
  let best=null,bd=144*R2;for(const f of (mode==="ocean"?OC.fish:fish)){if(f.alpha<.35||(mode==="ocean"&&f.big))continue;const dx=f.x-WX,dy=f.y-WY,d=dx*dx+dy*dy;if(d<bd){bd=d;best=f}}
  hover=best;if(!best){tip.hidden=true;return}
  if(mode==="ocean"&&best.who!=="q"){const nm={a:"H.264 池（示意）",s:"Samsung · HEVC 池",o:"其他權利人 · HEVC 池",v:esc(best.vk||"")+" · VVC 池"}[best.who];
    const per=best.who==="v"?"1 條＝4 件":best.who==="a"?"示意個體":"1 條＝8 件";
    tip.innerHTML=`<b>${nm}</b>${COLORBY==="geo"&&best.geo?" · "+best.geo:""}<br>申請年約 ${Math.floor(best.fy)} · ${per}${ocDead(best)?"<br>已屆 20 年，到期":"<br>到期年約 "+Math.floor(best.fy+20)}${best.who==="v"&&best.early?"<br>HEVC 世代申請，2018 起流入 VVC":""}`;
    tip.hidden=false;tip.style.left=Math.min(e.clientX+14,W-250)+'px';tip.style.top=(e.clientY+14)+'px';return}
  if(best.big){const B=best.big;tip.innerHTML=`<b style="font-family:var(--f-mono)">${esc(B.no)}</b><br>${B.pool==="hevc"?"HEVC 池 被引用第 "+B.rank+" 名":"高通 · 撒網 vs 燈塔示範案"}<br>權利人：${esc(B.own)}<br>被引用 <b>${B.cites}</b> 次${B.yr?" · 申請 "+esc(B.yr):""}<br>${esc(B.sum)}<br><span style="color:var(--dim)">出處：${B.pool==="q"?"Google Patents":"期末報告表 11"}</span>`;
    tip.hidden=false;tip.style.left=Math.min(e.clientX+14,W-290)+'px';tip.style.top=(e.clientY+14)+'px';return}
  if(!best.ghost&&best.who!=="n"){const mono=t=>`<span style="font-family:var(--f-mono);color:var(--gold)">${esc(t)}</span>`;let h;
    if(best.who==="q"){const A=ARMS.find(a=>a[0]===best.arm);h=best.rec?recHTML(best)+`<br><span style="color:var(--dim)">${esc(A[0]+" "+A[1])} 群 ${A[2].toLocaleString()} 族 · 出處：合併去重主表</span>`:`<b>高通 · ${esc(A[0]+" "+A[1])}</b><br>本群 ${A[2].toLocaleString()} 族（3,044 族中）`}
    else if(best.who==="s")h=`<b>Samsung · HEVC 池</b><br>池內第一，2,381 件（17.6%）<br>期末報告未列三星個別公告號`;
    else h=`<b>其他池內權利人 · HEVC 池</b><br>11,125 件 · 1 條＝8 件<br>已知高被引：${mono("US 6728317 B1")}（杜比 880）、${mono("US 7266150 B2")}（杜比 513）、${mono("US 7003035 B2")}（微軟 374）`;
    if(mode==="saturn"&&best.role)h+=`<br>${{core:"核心球體",A:"外環 A",B:"衛星環 B",noise:"雜訊"}[best.role]}${best.multi?" · 被 2+ 個 Unit 涵蓋":""}`;
    tip.innerHTML=h+(best.who==="q"?"":`<br><span style="color:var(--dim)">金色大魚＝報告中有公告號的專利，滑鼠移上可看</span>`);tip.hidden=false;tip.style.left=Math.min(e.clientX+14,W-290)+'px';tip.style.top=(e.clientY+14)+'px';return}
  const who=best.who==="q"?"Qualcomm":best.who==="s"?"Samsung":best.who==="n"?"關鍵字雜訊（非 SEP）":"其他";
  const role=mode==="saturn"&&best.role?({core:"核心球體",A:"外環 A",B:"衛星環 B",noise:"雜訊"}[best.role]+(best.multi?" · 被 2+ 個 Unit 涵蓋":"")):"";
  tip.innerHTML=`<b>${best.ghost?"推演家族（外推）":"關鍵字雜訊"}</b> · ${who}${best.year?" · "+best.year:""}${best.geo?" · "+best.geo:""}<br>${best.arm?esc(best.arm+" "+ARM_SECT[best.arm].label)+"<br>":""}${best.ghost?"外推年份新家族":"被引 "+best.cites+" 次"}${best.star?"<br>"+best.star:""}${role?"<br>"+role:""}`;
  tip.hidden=false;tip.style.left=Math.min(e.clientX+14,W-250)+'px';tip.style.top=(e.clientY+14)+'px'});
cv.addEventListener('pointerleave',()=>{hover=null;tip.hidden=true});
const DRAG={on:false,id:null,x:0,y:0,moved:0,pts:new Map(),pinch:0};
cv.addEventListener('wheel',e=>{e.preventDefault();if(mode==="eco")return;const f=Math.exp(-e.deltaY*(e.ctrlKey?.01:.0015));camZoomAt(e.clientX,e.clientY,f)},{passive:false});
cv.addEventListener('pointerdown',e=>{DRAG.pts.set(e.pointerId,[e.clientX,e.clientY]);if(DRAG.pts.size===2){const [a,b]=[...DRAG.pts.values()];DRAG.pinch=Math.hypot(a[0]-b[0],a[1]-b[1])}
  if(mode==="eco"||(CAM.ts<=1.001&&e.pointerType==="mouse"))return;DRAG.on=true;DRAG.x=e.clientX;DRAG.y=e.clientY;DRAG.moved=0;cv.setPointerCapture(e.pointerId);cv.classList.add('grab');hover=null;tip.hidden=true});
cv.addEventListener('pointermove',e=>{if(!DRAG.pts.has(e.pointerId))return;DRAG.pts.set(e.pointerId,[e.clientX,e.clientY]);
  if(DRAG.pts.size===2){const [a,b]=[...DRAG.pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(DRAG.pinch)camZoomAt((a[0]+b[0])/2,(a[1]+b[1])/2,d/DRAG.pinch);DRAG.pinch=d;return}
  if(!DRAG.on)return;const dx=e.clientX-DRAG.x,dy=e.clientY-DRAG.y;DRAG.x=e.clientX;DRAG.y=e.clientY;DRAG.moved+=Math.abs(dx)+Math.abs(dy);
  CAM.tx+=dx;CAM.ty+=dy;camClamp();CAM.x=CAM.tx;CAM.y=CAM.ty});
const dragEnd=e=>{DRAG.pts.delete(e.pointerId);if(DRAG.pts.size<2)DRAG.pinch=0;if(DRAG.pts.size===0){DRAG.on=false;cv.classList.remove('grab')}};
cv.addEventListener('pointerup',dragEnd);cv.addEventListener('pointercancel',dragEnd);
cv.addEventListener('dblclick',e=>{if(mode==="eco")return;if(CAM.ts>1.01)camReset();else camZoomAt(e.clientX,e.clientY,2.5)});
document.getElementById('qBtn').onclick=()=>{const v=!LQ;QUAL.pref=v?"lq":"hq";try{localStorage.setItem('qcomQual',QUAL.pref)}catch(e){}setLQ(v)};
if(QUAL.pref==="lq")setLQ(true);
document.getElementById('zmIn').onclick=()=>camZoomAt(W/2,H/2,1.5);document.getElementById('zmOut').onclick=()=>camZoomAt(W/2,H/2,1/1.5);document.getElementById('zmReset').onclick=camReset;
addEventListener('keydown',e=>{if(mode==="eco"||e.target.closest('input,textarea,select'))return;if(e.key==="+"||e.key==="=")camZoomAt(W/2,H/2,1.4);else if(e.key==="-"||e.key==="_")camZoomAt(W/2,H/2,1/1.4);else if(e.key==="0")camReset();
  else if(CAM.ts>1.01&&e.key.startsWith("Arrow")){const st=60;if(e.key==="ArrowLeft")CAM.tx+=st;if(e.key==="ArrowRight")CAM.tx-=st;if(e.key==="ArrowUp")CAM.ty+=st;if(e.key==="ArrowDown")CAM.ty-=st;camClamp();e.preventDefault()}});
/* 左右面板可摺疊（預設摺起） */
[["ledger","簡報數字"],["desk","工具：本案比對 · 推演 · 階段"]].forEach(([id,title])=>{const el=document.getElementById(id);const body=document.createElement('div');body.className='foldBody';
  while(el.firstChild)body.appendChild(el.firstChild);const b=document.createElement('button');b.type='button';b.className='fold';b.textContent=title;b.setAttribute('aria-expanded','false');
  b.onclick=()=>{const open=el.classList.toggle('folded');b.setAttribute('aria-expanded',String(!open))};el.appendChild(b);el.appendChild(body);el.classList.add('folded')});
