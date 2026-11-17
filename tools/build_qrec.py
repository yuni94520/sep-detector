#!/usr/bin/env python3
"""把《合併去重主表》Excel 轉成 demo/data/qrec.js（高通魚群滑鼠提示用的真實家族清單）。
用法：python3 tools/build_qrec.py 路徑/清單.xlsx        需要：pip install openpyxl
欄位順序（工作表「合併去重主表」）：公告號, 標題, 優先權日, IPC, 權利人, 被引次數, DI, 首次貢獻 Unit, 所有 Unit, 章節, 家族成員
輸出每筆：[公告號, 標題(≤72字), 最早優先權日, 被引次數, 首次貢獻Unit, 所有Unit("|"分隔), 家族件數]"""
import json, re, sys, pathlib
import openpyxl

src = sys.argv[1]
rows = [r for r in list(openpyxl.load_workbook(src, read_only=True, data_only=True)["合併去重主表"].iter_rows(values_only=True))[1:] if r[0]]
out = []
for no, title, pd, ipc, asg, cit, di, unit, units, sec, fam in rows:
    d = str(pd).split("|")[0].strip()
    t = re.sub(r"\s+", " ", str(title or "")).strip()
    if len(t) > 72:
        t = t[:70].rstrip() + "…"
    famn = 0 if fam in (None, "nan") else len(str(fam).split("|"))
    out.append([no, t, d if d[:4].isdigit() else "", int(float(cit or 0)), unit, "|".join(u.strip() for u in str(units).split("|")), famn])
dst = pathlib.Path(__file__).resolve().parent.parent / "demo/data/qrec.js"
head = "/* ======== 高通專利家族清單：由 tools/build_qrec.py 從《合併去重主表》產生，請勿手改、請勿整檔讀取 ======== */\n"
dst.write_text(head + "const QREC=" + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
print(f"{len(out)} 筆 → {dst}")
