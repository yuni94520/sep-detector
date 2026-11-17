/* ======== 主迴圈與啟動（最後載入）========
   frame() 是唯一的每幀進入點：依 mode 分派到各模式的 xxxFrame()。
   新增模式時只改三處：這裡的 frame()、ui.js 的 setMode()、ocean.html 的分頁按鈕。 */
function frame(now){
  const dtt=Math.min(50,now-(lastNow||now));lastNow=now;const sp=SPEED*(reduce?.3:1);camApply(dtt);qualTick(now-(QUAL.last||now));QUAL.last=now;
  if(mode==="net"){NET.tt+=dtt*sp;netFrame(now);requestAnimationFrame(frame);return}
  if(mode==="ocean"){OC.tt+=dtt*sp;ocFrame(OC.tt,now);requestAnimationFrame(frame);return}
  if(mode==="eco"){ECO.tt+=dtt*sp;ecoFrame(ECO.tt,dtt*sp);if(window.CINE_OK)ecoFX(now);requestAnimationFrame(frame);return}
  simT+=dtt*sp;const t=simT;step(t);
  ctx.fillStyle="#050c18";ctx.fillRect(0,0,W,H);
  if(mode==="vortex")drawVortexBg(t);else{drawCosmos(t,now);drawThalBack(t,now);drawRingDust(t,false);drawSaturnBg();}
  fadeTrail();ctx=trx;ctx.globalCompositeOperation="lighter";
  if(mode==="vortex")drawStreams(t);
  if(mode==="saturn"){const back=[],front=[];for(const f of fish)((f.z??0)<0?back:front).push(f);drawBatch(back,.28);drawBatch(front,.62)}
  else drawBatch(fish,1);
  ctx.globalCompositeOperation="source-over";ctx=MAIN;ctx.globalCompositeOperation="lighter";ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.drawImage(trail,0,0,W,H);ctx.restore();ctx.globalCompositeOperation="source-over";
  if(mode==="saturn"){drawRingDust(t,true);drawThalFront(t,now);if(window.CINE_OK)drawSatFX(t,now)}
  if(mode==="vortex")drawVortexWaves(t);
  for(const f of fish){if(!f.big||f.alpha<.3)continue;const B=f.big,sz=4.4+Math.min(2,Math.sqrt(B.cites)/15),br=.5+.5*Math.sin(now*.0032+B.rank*1.7),c=B.pool==="q"?["#22e3ff","#c9fbff"]:["#ffd166","#fff1c2"];
    ctx.strokeStyle=c[0];ctx.globalAlpha=.6*(1-br);ctx.lineWidth=1;ctx.beginPath();ctx.arc(f.x,f.y,sz*(1.4+2.6*br),0,6.28);ctx.stroke();ctx.globalAlpha=1;
    ctx.save();ctx.shadowColor=c[0];ctx.shadowBlur=LQ?0:(16+12*br);ctx.beginPath();fishPath(f,sz);ctx.fillStyle=c[0];ctx.fill();ctx.restore();ctx.beginPath();fishPath(f,sz*.55);ctx.fillStyle=c[1];ctx.fill();
    if(W>=860&&mode==="vortex"){ctx.font="500 9px 'IBM Plex Mono',monospace";ctx.textAlign="left";ctx.fillStyle=c[1];ctx.fillText(B.pool==="q"?"QCOM · 88":"HEVC #"+B.rank,f.x+sz*1.6,f.y-sz*1.4)}}
  // star family
  const st=qFish[0];if(st.alpha>.3){ctx.strokeStyle=COL.gold;ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(st.x,st.y,9+Math.sin(now*.004)*2,0,6.28);ctx.stroke()}
  if(caseFish&&mode==="vortex"){ctx.save();ctx.shadowColor="#fff";ctx.shadowBlur=LQ?0:(16);ctx.fillStyle="#fff";ctx.beginPath();fishPath(caseFish,6);ctx.fill();ctx.restore();
    const br=.5+.5*Math.sin(now*.004);ctx.strokeStyle=`rgba(255,255,255,${.7*(1-br)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(caseFish.x,caseFish.y,10+18*br,0,6.28);ctx.stroke();
    ctx.font="500 10px 'IBM Plex Mono',monospace";ctx.fillStyle="#fff";ctx.textAlign="left";ctx.fillText("CASE · 本案",caseFish.x+14,caseFish.y-10)}
  if(hover){ctx.strokeStyle="#fff";ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(hover.x,hover.y,8,0,6.28);ctx.stroke()}
  requestAnimationFrame(frame)}

/* 啟動：順序不可調換（resize 先算版面，setMode 再建場景） */
addEventListener('resize',resize);resize();setColorBy('arm');setMode('ocean');setYear(OC_NOW);
/* 魚的初始位置：放在各自目標點附近，避免開場從畫面外飛入 */
fish.forEach(f=>{const p=target(f,0);f.x=p[0]+(rnd()-.5)*40;f.y=p[1]+(rnd()-.5)*40});
requestAnimationFrame(frame);
