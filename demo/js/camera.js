/* ======== 畫質：自動偵測慢電腦 → 流暢模式（魚改簡化三角形、關光暈、解析度 1×；魚的數量不變） ======== */
const QUAL={pref:"auto",n:0,sum:0};try{QUAL.pref=localStorage.getItem('qcomQual')||"auto"}catch(e){}
function setLQ(v){if(LQ===v)return;LQ=v;resize();if(typeof cosmosBuild==="function"&&COS.w)cosmosBuild();const b=document.getElementById('qBtn');if(b){b.textContent=LQ?"流暢":"精緻";b.setAttribute('aria-pressed',LQ)}}
function qualTick(dt){if(QUAL.pref!=="auto"||LQ||document.hidden)return;if(dt<=0||dt>=200)return;QUAL.n++;QUAL.sum+=dt;
  if(QUAL.n>=40){const avg=QUAL.sum/QUAL.n;QUAL.n=0;QUAL.sum=0;if(avg>30)setLQ(true)}}
/* ======== camera：拉遠拉近（滾輪／拖曳／雙擊復位／觸控雙指） ======== */
const CAM={s:1,x:0,y:0,ts:1,tx:0,ty:0,MIN:1,MAX:4};
function camClamp(){CAM.ts=Math.max(CAM.MIN,Math.min(CAM.MAX,CAM.ts));CAM.tx=Math.min(0,Math.max(W-W*CAM.ts,CAM.tx));CAM.ty=Math.min(0,Math.max(H-H*CAM.ts,CAM.ty))}
function camZoomAt(sx,sy,f){const wx=(sx-CAM.tx)/CAM.ts,wy=(sy-CAM.ty)/CAM.ts;CAM.ts*=f;CAM.ts=Math.max(CAM.MIN,Math.min(CAM.MAX,CAM.ts));CAM.tx=sx-wx*CAM.ts;CAM.ty=sy-wy*CAM.ts;camClamp()}
function camReset(){CAM.ts=1;CAM.tx=0;CAM.ty=0}
function camApply(dt){const k=reduce?1:1-Math.pow(.0005,dt/1000*2.2);CAM.s+=(CAM.ts-CAM.s)*k;CAM.x+=(CAM.tx-CAM.x)*k;CAM.y+=(CAM.ty-CAM.y)*k;
  if(Math.abs(CAM.ts-CAM.s)<.0005){CAM.s=CAM.ts;CAM.x=CAM.tx;CAM.y=CAM.ty}
  /* 限制實際鏡頭也不露出畫外 */
  CAM.x=Math.min(0,Math.max(W-W*CAM.s,CAM.x));CAM.y=Math.min(0,Math.max(H-H*CAM.s,CAM.y));
  const a=DPR*CAM.s;MAIN.setTransform(a,0,0,a,DPR*CAM.x,DPR*CAM.y);trx.setTransform(a,0,0,a,DPR*CAM.x,DPR*CAM.y);
  const z=document.getElementById('zmTxt');if(z){const t=CAM.ts.toFixed(1)+"×";if(z.textContent!==t)z.textContent=t}
  document.getElementById('zoom')?.classList.toggle('on',CAM.ts>1.01)}
const toWorld=(cx,cy)=>[(cx-CAM.x)/CAM.s,(cy-CAM.y)/CAM.s];
