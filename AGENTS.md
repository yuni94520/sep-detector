# 維護規則（給之後接手的任何模型或人）

改這個專案前先讀完本檔。目標：**不改變使用者看到的畫面與操作**、每次只讀必要的檔、不讓系統變肥。

## 1. 架構

純靜態網站，放在 GitHub Pages。沒有建置步驟、沒有套件、沒有框架；瀏覽器直接載入檔案。

```
index.html          分頁外框（兩個 iframe）：#tool → tool.html、#qcom → demo/ocean.html
tool.html           必要性檢測工具（獨立單檔，讀 data/ 下的規格書資料）
data/               工具用的規格書、術語橋接、已驗證案例
demo/ocean.html     魚群動畫的 HTML 骨架（只有 DOM 與載入順序，9 KB）
demo/css/ocean.css  動畫的全部樣式
demo/data/constants.js  動畫的全部數字與文字（唯一來源）
demo/data/qrec.js   高通 3,044 筆家族清單（327 KB，機器產生）
demo/js/*.js        動畫程式，依下表分工
tools/build_qrec.py Excel → qrec.js
tools/check.js      改完後的檢查
```

三個頁面互不相依，只靠網址連結：外框用 `#tool`／`#qcom` 切換；內頁要切分頁時用 `target="_top"` 連到 `index.html#tool` 或 `index.html#qcom`。不要讓內頁用 JavaScript 去操作外框，也不要反過來。

### 動畫的檔案分工（載入順序固定，寫在 ocean.html 最下面）

| 順序 | 檔案 | 大小 | 內容 |
|---|---|---|---|
| 1 | `data/constants.js` | 13 KB | 數字、標題、註記、里程碑、名魚（STARS）、各階段文字 |
| 2 | `data/qrec.js` | 327 KB | `QREC` 陣列。**不要整檔讀取** |
| 3 | `js/core.js` | 18 KB | 亂數、畫布、版面 `layout()`、建魚、魚對應清單、`step()`、魚形與批次繪製、漩渦繪製、共用工具 `label()`／`hexA()`／`fadeTrail()` |
| 4 | `js/saturn.js` | 16 KB | 土星頁的背景：星空、銀河、流星、金色環儀 |
| 5 | `js/camera.js` | 2 KB | 畫質（精緻／流暢）與鏡頭縮放平移 |
| 6 | `js/ui.js` | 15 KB | 面板、按鈕、`setMode()`／`setPhase()`／`setYear()`、滑鼠提示、鏡頭操作事件 |
| 7 | `js/net.js` | 14 KB | 「撒網 vs 燈塔」頁 |
| 8 | `js/ocean.js` | 21 KB | 「四大洋全景」頁 |
| 9 | `js/eco.js` | 10 KB | 「經濟效益」頁的魚與面板 |
| 10 | `js/cine.js` | 13 KB | 電影式字幕、土星換階段特效、經濟效益的天幕與衝擊波 |
| 11 | `js/main.js` | 3 KB | 每幀進入點 `frame()` 與啟動順序 |

## 2. 要改什麼 → 只讀哪個檔

| 需求 | 只需要讀 |
|---|---|
| 改數字、標題、註記、里程碑、階段說明 | `demo/data/constants.js` |
| 換高通清單 | 不讀檔，執行 `python3 tools/build_qrec.py 清單.xlsx` |
| 改顏色、字體、面板版面 | `demo/css/ocean.css` |
| 改某一頁的動畫 | 該頁的 js（見上表）＋必要時 `core.js` |
| 改字幕或特效 | `demo/js/cine.js` |
| 加按鈕、改面板內容 | `demo/ocean.html`＋`demo/js/ui.js` |
| 改分頁外框 | `index.html` |
| 改檢測工具 | `tool.html`（與動畫無關，不要順手改動畫） |

省 token 的做法：先用搜尋找函式名再讀那一段，不要整個資料夾讀一遍；`qrec.js` 和 `data/*.json`、`data/*.csv` 一律不讀內容。

## 3. 不可更動的內容

1. 數據常數的值，除非使用者明確給新數字。來源是期末報告與《合併去重主表》。
2. 這些註記必須原樣保留：「假設每件 0.5 小時」、US$10,000（TCL v. Ericsson 判決 p.30，Via Licensing）、「黃金集驗證高通名單」（88%、F1 85.5%、回測 89.2%、召回率 ≈83%）、三星公告名單重現率 56% 要分開陳述、「工具未漏檢」、「推演」、「示意」。
3. 經濟效益頁不出現「AI」，一律寫「工具」。
4. 只有兩種魚可以顯示公告號：高通魚（來自 `QREC`）和 `STARS` 的 21 件。其他魚不可掛任何號碼。
5. 背景裝飾不可用資料色：青 `#22e3ff`、金 `#ffd166`、靛 `#6a5cff`。
6. 畫面配置、操作方式、五個分頁的順序與名稱。

## 4. 程式寫法

**全域與載入**
- 全部是一般 `<script>`，共用全域範圍，不用 `import`／`export`、不加打包工具。
- 後面的檔可以用前面檔的東西；前面的檔在「載入當下」不可呼叫後面檔的函式（放在函式裡、等執行時才呼叫則可以）。
- 需要在載入時執行的啟動動作，一律加在 `main.js` 最後的啟動區，並維持現有順序：`resize()` → `setColorBy` → `setMode` → `setYear` → 魚的初始位置。
- 新增檔案時在 `ocean.html` 加一行 `<script>`，並更新本檔的表格。

**模式（分頁）**
- 每個模式自己擁有狀態物件與三個函式：`xxxBuild()` 建場景、`xxxStart(i)` 切步驟、`xxxFrame()` 畫一幀。現有：`OC`、`NET`、`ECO`；漩渦與土星共用 `fish` 與 `step()`。
- 模式之間不可互相讀寫對方的狀態物件。共用的東西放 `core.js`。
- 新增模式只改三處：`main.js` 的 `frame()`、`ui.js` 的 `setMode()`、`ocean.html` 的分頁按鈕。

**可拔除的模組**
- `cine.js` 是外掛：別的檔呼叫它之前都先檢查 `window.CINE_OK`。拿掉 `cine.js` 那一行 `<script>`，頁面仍須正常運作。新增外掛照這個做法。

**亂數**
- `rnd()` 是固定種子的亂數，決定每條魚的屬性與位置，所以每次開頁都一樣。**不要在建魚流程中新增或移除 `rnd()` 呼叫**，否則後面所有魚都會變。
- 純裝飾（星星、流星、粒子）用 `Math.random()`。

**繪圖**
- 魚一律用 `drawBatch()` 依顏色成批畫，不要一條一條 `fill()`。
- 耗效能的效果（`shadowBlur`、大量曲線）要看 `LQ`：`LQ` 為真時關掉或簡化。魚的數量不可因效能而減少。
- 不會變的背景先畫到離屏畫布，每幀只貼圖（參考 `cosmosBuild()`、`galBuild()`）。
- 不要在每幀裡建立畫布或呼叫 `getBoundingClientRect()`。
- 主畫布有鏡頭變換。滑鼠座標要先用 `toWorld()` 轉成場景座標再比對魚。貼整張離屏畫布前要先 `setTransform(DPR,0,0,DPR,0,0)`。

**文字與資料**
- 面板與字幕的文字放 `constants.js`，程式裡不寫死數字。
- 放進 `innerHTML` 的資料一律經過 `esc()`。
- 不引入外部函式庫；唯一的外部資源是 Google Fonts。

## 5. 改完之後

1. 執行 `node tools/check.js`。語法檢查一定會跑；有安裝 playwright 時會實際開頁、點五個分頁。有錯就不要推送。
2. 沒有 playwright 時，用瀏覽器直接開 `demo/ocean.html`（雙擊即可），五個分頁各點一次、主控台不可有錯誤。
3. 推送：`git push origin main main:ocean-shallows-ui`。兩個分支內容必須相同，一律在 `main` 上改。
4. 提交訊息用一句話說明改了什麼、為什麼。

## 6. 已知且接受的耦合

這些地方是刻意保留的集中點，不要為了「解耦」重寫：

- `frame()` 與 `setMode()` 用 `if(mode===…)` 分派。五個模式而已，集中在兩個函式比做註冊機制更省。
- 漩渦與土星共用 `fish`、`step()`、`vis()`、`target()`，因為同一批魚要在兩頁之間變形。
- `ui.js` 的滑鼠提示知道各模式的魚長什麼樣。
- 全域變數 `mode`、`phase`、`year`、`W`、`H`、`ctx`、`LQ`、`CAM` 是共用狀態，只能經由 `setMode`／`setPhase`／`setYear`／`resize`／`setLQ`／`camZoomAt` 改，不要直接指定。

## 7. 不要做的事

- 不要把檔案合併回單一 HTML，也不要把資料貼回程式裡。
- 不要加建置流程、TypeScript、框架、npm 相依。
- 不要為了整理而改函式名或搬動程式；搬動會改變載入順序，可能讓魚的位置全部變掉。
- 不要新增第二份資料來源或第二份動畫副本。claude.ai 上的舊版頁面已停止更新，以這個 repo 為準。
- 不要修使用者沒有要求的東西。發現問題先回報。
