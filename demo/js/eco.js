/* ======== 經濟效益 ======== */
const ECO={step:0,tt:0,base:43095,per:10000,fish:[],floats:[],insp:null,done:0,built:false};
const money=v=>v>=1e6?"$"+(v/1e6).toFixed(v>=1e8?0:1)+"M":v>=1e3?"$"+Math.round(v).toLocaleString():"$"+v.toFixed(2);
const ecoSteps=document.getElementById('ecoSteps');
ECO_STEPS.forEach((st,i)=>{const b=document.createElement('button');b.type='button';b.className='ph';b.innerHTML=`<span class="n">${st[0]}</span><span class="t"></span>`;b.querySelector('.t').textContent=st[1];b.onclick=()=>ecoStart(i);ecoSteps.appendChild(b)});
const ecoBase=document.getElementById('ecoBase');
BASES.forEach(([n,l])=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.setAttribute('aria-pressed',n===ECO.base);b.onclick=()=>{ECO.base=n;[...ecoBase.children].forEach(x=>x.setAttribute('aria-pressed',x===b));ecoStart(ECO.step)};ecoBase.appendChild(b)});
document.getElementById('ecoPer').addEventListener('input',e=>{const v=+e.target.value;if(v>0){ECO.per=v;ecoStart(ECO.step)}});
function ecoBuild(){ECO.fish=[];const top=ECO.hz?ECO.hz+50:TOPY()-30,bot=H-(W<860?H*.5:260);
  const add=(o)=>ECO.fish.push(Object.assign({x:W*(.05+rnd()*.9),y:top+rnd()*(bot-top),vx:0,vy:0,ph:rnd()*6.28,jit:rnd(),score:rnd()},o));
  for(let i=0;i<GOLD;i++)add({gold:true,cls:i<TP?"TP":"FN"});
  for(let i=0;i<1800;i++)add({gold:false,cls:i<FP?"FP":"TN"});
  ECO.built=true;ECO.w=W;ECO.h=H;ECO.top=top;ECO.bot=bot}
function ecoStart(i){ECO.step=i;ECO.tt=0;ECO.done=0;ECO.floats=[];ECO.insp={x:W*.5,y:H*.35,tgt:null};
  if(!ECO.built||ECO.w!==W||ECO.h!==H)ecoBuild();ECO.fish.forEach(f=>{f.chk=false;f.scan=false});
  [...ecoSteps.children].forEach((b,j)=>b.setAttribute('aria-pressed',j===i));
  document.getElementById('eBars').style.display=i===3?'grid':'none';const eg=document.querySelector('.ecoGrid');eg.style.display=i===3?'none':'grid';eg.classList.toggle('four',i===2);document.getElementById('eR').style.display=i===2?'block':'none';
  document.getElementById('poolCost').innerHTML=`<span>原始池 43,095 件全部以人工驗證</span><b>$${(43095*ECO.per).toLocaleString()}</b><span>43,095 件 × $${ECO.per.toLocaleString()} · ${Math.round(43095*H_PER).toLocaleString()} 小時（約 ${(43095*H_PER/H_YEAR).toFixed(1)} 年）</span>`;
  const N=ECO.base,mh=N*H_PER;
  const notes=["一位專家一次看一件，人工時間以「假設每件 0.5 小時」估算，專利池等級驗證每件 $"+ECO.per.toLocaleString()+"（Via Licensing 收費，見 TCL v. Ericsson 判決）；法院案中的 Concur IP 快篩平均每件約 20 分鐘、$100，只算粗篩。白點是已驗證的家族，飄起的金額是每一件的費用。照這個速度，"+N.toLocaleString()+" 件要 "+Math.round(mh).toLocaleString()+" 小時，約 "+(mh/H_YEAR).toFixed(1)+" 年。",
    "本工具以語意向量＋8 維度評分的三階段漏斗一次掃過全池，聲納掃到的魚依必要性分數上色。瓶頸在資料清洗，不在算力，全池 72 小時完成。",
    "兩個數字要分開看：準確率 88%（F1 85.5%、換算召回率約 83%、回測 89.2%）是黃金集驗證高通名單的結果；再用同樣的方法、不調整權重，拿專利池公告的三星 2,381 件當答案卷，重現率 56%（工具未漏檢 1,333 件）。綠魚＝工具未漏檢，暗金框＝漏檢的 1,048 件。答案卷是公告清單，不需人工標註。",
    "同一批專利，兩種做法的時間與費用。人工時間假設每件 0.5 小時；工具費用為運算帳單換算；人工費用依你設定的單件金額。"];
  document.getElementById('eNote').textContent=notes[i];
  if(i===3)renderBars();if(window.CINE_OK&&mode==="eco")cineEco(i)}
function renderBars(){const N=ECO.base,mh=N*H_PER,mc=N*ECO.per,ac=N*AI_PER;
  const row=(lab,a,b,fa,fb,ca,cb)=>`<div class="brow"><span>${lab}</span><div class="btrack"><div class="bline"><i style="width:${fa}%;background:${ca}"></i><em>人工 ${a}</em></div><div class="bline"><i style="width:${fb}%;background:${cb}"></i><em>工具 ${b}</em></div></div></div>`;
  document.getElementById('eBars').innerHTML=
   row("耗時",Math.round(mh).toLocaleString()+" h（假設 0.5 h／件，"+(mh/H_YEAR).toFixed(1)+" 年）",AI_H+" h（"+(mh/AI_H).toFixed(0)+"× 快）",72,Math.max(.4,72*AI_H/mh),"#ff6b6b","#3ddcff")+
   row("費用",money(mc),money(ac)+"（依帳單 $11,035／1.7 萬件換算）",72,Math.max(.4,72*ac/mc),"#ff6b6b","#3ddcff")+
   `<div class="brow"><span>省下</span><div class="btrack"><div class="bline"><i style="width:72%;background:#ffd166"></i><em>${money(mc-ac)} · ${Math.round(mh-AI_H).toLocaleString()} 小時</em></div></div></div>`+
   row("可重驗性","< 30%","100%",21.6,72,"#ff6b6b","#3ddcff")+
   row("準確率","傳統交叉驗證 76%","回測 89.2%（精確率 88%、F1 85.5%；黃金集驗證高通名單）",72*.76,72*.892,"#ff6b6b","#3ddcff")+
   `<div class="brow"><span>召回率</span><div class="btrack"><div class="bline"><i style="width:${72*.83}%;background:#cdeeff"></i><em>工具 ≈ 83%（黃金集驗證高通名單，由 F1 換算）</em></div><div class="bline"><i style="width:${72*REC}%;background:#9fd0f0"></i><em>工具 56%（同方法未調權重，三星公告 2,381 件未漏檢 ${TP.toLocaleString()} 件）</em></div></div></div>`}
function setM(t,ts,c,cs,al,a,as,tl,cl){const g=id=>document.getElementById(id);g('eTl').textContent=tl||'耗時';g('eCl').textContent=cl||'驗證費用（USD）';g('eT').textContent=t;g('eTs').textContent=ts;g('eC').textContent=c;g('eCs').textContent=cs;g('eAl').textContent=al;g('eA').textContent=a;g('eAs').textContent=as}
function ecoFrame(t,dt){
  if(!ECO.built||ECO.w!==W||ECO.h!==H)ecoBuild();
  const st=ECO.step,N=ECO.base,cx=W*.5,cy=(ECO.top+ECO.bot)/2;
  ctx.fillStyle="#050c18";ctx.fillRect(0,0,W,H);
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.6);g.addColorStop(0,"#123a6e");g.addColorStop(1,"#050c18");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);if(window.CINE_OK)drawEcoSky(performance.now());
  // motion
  for(const f of ECO.fish){const fl=flowAt(f.x,f.y,t);f.vx=f.vx*.94+fl[0]*.08;f.vy=f.vy*.94+fl[1]*.08;f.x+=f.vx*SPEED*.6;f.y+=f.vy*SPEED*.6;f.ph+=.1;
    if(f.x<10)f.x=W-10;if(f.x>W-10)f.x=10;if(f.y<ECO.top||f.y>ECO.bot||rnd()<.0015){f.y=ECO.top+rnd()*(ECO.bot-ECO.top);f.x=W*(.03+rnd()*.94);f.vx=f.vy=0}}
  const scale=Math.max(1,Math.ceil(N/ECO.fish.length));
  let ringR=0;
  if(st===0){ // inspector
    const I=ECO.insp;if(!I.tgt||I.tgt.chk){let best=null,bd=1e12;for(const f of ECO.fish){if(f.chk)continue;const d=(f.x-I.x)**2+(f.y-I.y)**2;if(d<bd){bd=d;best=f}}I.tgt=best}
    if(I.tgt){I.x+=(I.tgt.x-I.x)*.06*SPEED;I.y+=(I.tgt.y-I.y)*.06*SPEED;if(Math.hypot(I.tgt.x-I.x,I.tgt.y-I.y)<5){I.tgt.chk=true;ECO.done++;ECO.floats.push({x:I.x,y:I.y,life:1,txt:"+$"+ECO.per.toLocaleString()})}}
    const k=ECO.done*scale,hh=k*H_PER;
    setM(Math.round(N*H_PER).toLocaleString()+" h",N.toLocaleString()+" 件 × 0.5 小時（假設）≈ "+(N*H_PER/H_YEAR).toFixed(1)+" 年；動畫中專家已驗 "+k.toLocaleString()+" 件",
      money(N*ECO.per),N.toLocaleString()+" 件 × $"+ECO.per.toLocaleString()+"；動畫中已花 "+money(k*ECO.per),"結論重現率","< 30%","不同專家判定常互相衝突","耗時（假設每件 0.5 h）")}
  else if(st===1){const p=Math.min(1,t/5200);ringR=p*Math.hypot(W,H)*.75;
    for(const f of ECO.fish)if(!f.scan&&Math.hypot(f.x-cx,f.y-cy)<ringR)f.scan=true;
    const ac=N*AI_PER;
    setM((p*AI_H).toFixed(0)+" h","全池 "+N.toLocaleString()+" 件 · 人工需 "+Math.round(N*H_PER).toLocaleString()+" h（"+(N*H_PER/AI_H).toFixed(0)+"×）",
      money(p*ac),"依 API 帳單 $11,035／1.7 萬件換算，約 $"+AI_PER.toFixed(2)+"／件","可重驗性","100%","同一參數檔重跑，結果誤差 0%")}
  else if(st===2){const p=Math.min(1,t/4500);
    setM(Math.round(p*TP).toLocaleString()+" / "+GOLD.toLocaleString(),"三星公告名單中工具未漏檢的件數（重現率 56%，同方法未調權重）",
      "$0","答案卷＝專利池公告清單，不需人工標註","準確率（黃金集驗證高通名單）","88%","F1 85.5%；回測準確率 89.2%（傳統方法 76%）","工具未漏檢的三星 SEP","人工標註成本");
    ECO.p2=p}
  else{setM("","","","","","","")}
  // draw fish into trail
  fadeTrail();ctx=trx;ctx.globalCompositeOperation="source-over";
  const grp=new Map(),put=(c,f)=>{(grp.get(c)||grp.set(c,[]).get(c)).push(f)};
  for(const f of ECO.fish){
    if(st===0)put(f.chk?"#ffffff":"#3e5566",f);
    else if(st===1)put(f.scan?(f.gold?"#3ddcff":"#7c6bff"):"#2a3a46",f);
    else if(st===2){const on=f.jit<ECO.p2;if(!on){put(f.gold?"#5b5030":"#2a3a46",f);continue}
      put(f.cls==="TP"?"#4dff9a":f.cls==="FP"?"#ff4f6d":f.cls==="FN"?"#5b5030":"#2f4150",f)}
    else put(f.gold?"#3ddcff":"#7c6bff",f)}
  for(const[c,arr]of grp){ctx.fillStyle=c;ctx.globalAlpha=.9;ctx.beginPath();arr.forEach(f=>fishPath(f,2.5));ctx.fill()}
  ctx.globalAlpha=1;ctx=MAIN;ctx.globalCompositeOperation="lighter";ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.drawImage(trail,0,0,W,H);ctx.restore();ctx.globalCompositeOperation="source-over";
  if(st===2){ctx.strokeStyle="rgba(255,209,102,.8)";ctx.lineWidth=1;ctx.beginPath();for(const f of ECO.fish)if(f.cls==="FN"&&f.jit<ECO.p2){ctx.moveTo(f.x+5,f.y);ctx.arc(f.x,f.y,5,0,6.283)}ctx.stroke()}
  if(st===0&&ECO.insp){const I=ECO.insp;const lg=ctx.createRadialGradient(I.x,I.y,0,I.x,I.y,40);lg.addColorStop(0,"rgba(255,230,160,.55)");lg.addColorStop(1,"rgba(255,230,160,0)");ctx.fillStyle=lg;ctx.beginPath();ctx.arc(I.x,I.y,40,0,6.283);ctx.fill();
    ctx.font="700 12px 'Noto Sans TC',sans-serif";ctx.fillStyle="#ffe6a0";ctx.textAlign="center";ctx.fillText("專家",I.x,I.y-22);
    ctx.font="500 12px 'IBM Plex Mono',monospace";ECO.floats.forEach(fl=>{fl.y-=.6*SPEED;fl.life-=.012*SPEED;ctx.globalAlpha=Math.max(0,fl.life);ctx.fillStyle="#ffd166";ctx.fillText(fl.txt,fl.x,fl.y)});ctx.globalAlpha=1;ECO.floats=ECO.floats.filter(f=>f.life>0)}
  if(st===1){ctx.strokeStyle="rgba(61,220,255,.6)";ctx.lineWidth=2;for(let k=0;k<3;k++){const r=ringR-k*60;if(r>0){ctx.globalAlpha=.6-k*.18;ctx.beginPath();ctx.arc(cx,cy,r,0,6.283);ctx.stroke()}}ctx.globalAlpha=1;
    label(cx,ECO.top-14,"工具三階段漏斗掃描",ringR>=Math.hypot(W,H)*.74?"完成 · 72 h":"掃描中…","#3ddcff")}
  if(st===2)label(cx,ECO.top-14,"黃金集：專利池三星公告 2,381 件","綠＝未漏檢 "+TP.toLocaleString()+" · 暗金＝漏檢 "+FN.toLocaleString()+" · 重現率 56%","#4dff9a");
  if(st===0)label(cx,ECO.top-14,"一條魚 ≈ "+scale+" 件 · 已驗證 "+(ECO.done*scale).toLocaleString()+" / "+N.toLocaleString(),"假設每件 0.5 小時，約 "+(N*H_PER/H_YEAR).toFixed(1)+" 年","#ffe6a0");
}
