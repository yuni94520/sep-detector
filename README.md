# SEP Detector

HEVC / VVC 標準必要專利（SEP）必要性檢測工具，以 8 維度向量比對專利請求項與規格書章節。

## 頁面

| 頁面 | 檔案 | 用途 |
|---|---|---|
| 必要性檢測工具 | `index.html` | 單項檢測、批量模式、驗證資料庫 |
| 海洋視覺化 Demo | `demo/ocean.html` | 簡報與比賽展示用：四大洋全景、權利人漩渦、土星錨點、撒網 vs 燈塔、經濟效益 |

兩個頁面互相連結：工具頁首的「🌊 海洋 Demo ↗」開啟 Demo，Demo 標題下的「← 回檢測工具」回到工具。

## 線上展示（GitHub Pages）

1. 到 repo 的 **Settings → Pages**。
2. Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾 `/ (root)`，按 Save。
3. 約一分鐘後可開啟：
   - 工具：`https://yuni94520.github.io/sep-detector/`
   - Demo：`https://yuni94520.github.io/sep-detector/demo/ocean.html`

## 資料說明

- `data/`：HEVC 規格書章節、術語橋接規則、已驗證案例。
- Demo 中的魚為依簡報統計分布生成的示意個體，並非真實專利清單；VVC、H.264 海域標示「待匯入」。
- 母數依期末報告（HEVC Advance 原始 43,095 → 分析母數 13,506；VVC Advance 3,076；高通 3,044 族）。
- 經濟效益數字來自《SEP 必要性檢測系統》簡報（人工每件 0.5 h、43,095 筆約 21,548 h vs 系統 72 h、API 帳單 $11,035／1.7 萬件、回測準確率 89.2%、精確率 88%、F1 85.5%）；人工單件驗證費用預設 US$10,000（Via Licensing 收費，見 TCL v. Ericsson, C.D. Cal. 2017 判決第 30 頁），可在頁面上調整。召回率由精確率與 F1 換算。
