#!/usr/bin/env node
/* 改完程式後的檢查：node tools/check.js
   1) 每個 JS 檔做語法檢查；2) 若有安裝 playwright，實際開頁面、點過五個分頁，確認主控台沒有錯誤。 */
const {execFileSync}=require('child_process'),fs=require('fs'),path=require('path'),http=require('http');
const root=path.resolve(__dirname,'..'),demo=path.join(root,'demo');
const html=fs.readFileSync(path.join(demo,'ocean.html'),'utf8');
const files=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
for(const f of files){execFileSync(process.execPath,['--check',path.join(demo,f)]);}
console.log('語法檢查通過：'+files.length+' 個檔，載入順序 '+files.map(f=>path.basename(f)).join(' → '));
let pw;try{pw=require('playwright')}catch(e){console.log('（未安裝 playwright，略過實際開頁測試）');process.exit(0)}
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.csv':'text/csv'};
const srv=http.createServer((q,s)=>{const p=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(p,(e,d)=>{if(e){s.writeHead(404);s.end()}else{s.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});s.end(d)}})}).listen(0,async()=>{
  const b=await pw.chromium.launch(),p=await b.newPage({viewport:{width:1440,height:860}}),errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  await p.goto(`http://127.0.0.1:${srv.address().port}/demo/ocean.html`);await p.waitForTimeout(1200);
  for(const m of['mVortex','mSaturn','mNet','mEco','mOcean']){await p.click('#'+m);await p.waitForTimeout(1200)}
  const bad=await p.evaluate(()=>fish.filter(f=>!isFinite(f.x)||!isFinite(f.y)).length);
  await b.close();srv.close();
  if(errs.length||bad){console.error('失敗：',errs,'座標異常的魚：'+bad);process.exit(1)}
  console.log('實際開頁測試通過：五個分頁無錯誤');
});
