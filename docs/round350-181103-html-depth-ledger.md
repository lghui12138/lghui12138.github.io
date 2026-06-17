# Round350 181103 HTML 深度台账

- version: round350-181103-html-depth-ledger-20260615
- generatedAt: 2026-06-14T22:03:32.432Z
- ok: true

## 结论

- 站内 HTML 材料页: 38/38
- 可直接站内阅读且无下载/viewer 壳: 38/38
- 题库锚点: 522/411
- 图片页为主、文字层弱材料: 0
- 暂无题库题目锚点材料: 17

## 边界

- 不提供原始 PDF/PPT/DOC/ZIP 下载，不使用 viewer/wrapper/iframe/object 壳。
- 这不是 OCR 完整度承诺；图片页已经站内可读，但文字层弱的材料仍进入待补强队列。
- 522 个资料题锚点只代表已抽取题库项，18 个无题库锚点材料仍然需要继续人工抽题或 OCR 复核。

## 图片页为主、文字层弱材料

| materialId | title | pages/images | source questions | sitePath |
| --- | --- | ---: | ---: | --- |

## 暂无题库题目锚点材料

| materialId | title | pages/images | sitePath |
| --- | --- | ---: | --- |
| fluid-181103-02 | 中国海大 流体力学名词解释 扫描版 | 19/19 | /resources/fluid-181103-html/materials/02-fluid-181103-02-material/index.html |
| fluid-181103-10 | 流体力学习题册答案2010修改版 | 52/52 | /resources/fluid-181103-html/materials/10-fluid-181103-10-2010/index.html |
| fluid-181103-11 | 流体力学I课件 | 0/0 | /resources/fluid-181103-html/materials/11-fluid-181103-11-i/index.html |
| fluid-181103-16 | 2理想流体运动 | 36/36 | /resources/fluid-181103-html/materials/16-fluid-181103-16-2/index.html |
| fluid-181103-17 | 3基本方程组 | 40/40 | /resources/fluid-181103-html/materials/17-fluid-181103-17-3/index.html |
| fluid-181103-21 | 8 1 | 29/29 | /resources/fluid-181103-html/materials/21-fluid-181103-21-8-1/index.html |
| fluid-181103-22 | 8 | 12/12 | /resources/fluid-181103-html/materials/22-fluid-181103-22-8/index.html |
| fluid-181103-24 | 流体的涡旋运动 | 25/25 | /resources/fluid-181103-html/materials/24-fluid-181103-24-material/index.html |
| fluid-181103-26 | 流体力学II课件 | 0/0 | /resources/fluid-181103-html/materials/26-fluid-181103-26-ii/index.html |
| fluid-181103-30 | 走近湍流 | 9/9 | /resources/fluid-181103-html/materials/30-fluid-181103-30-1/index.html |
| fluid-181103-31 | turbulence14 2.ppt | 12/12 | /resources/fluid-181103-html/materials/31-fluid-181103-31-turbulence14-2-ppt/index.html |
| fluid-181103-32 | turbulence16 2 | 13/13 | /resources/fluid-181103-html/materials/32-fluid-181103-32-turbulence16-2-1/index.html |
| fluid-181103-33 | turbulent14 1 1 | 8/8 | /resources/fluid-181103-html/materials/33-fluid-181103-33-turbulent14-1-1/index.html |
| fluid-181103-34 | turbulent14 1 2 | 15/15 | /resources/fluid-181103-html/materials/34-fluid-181103-34-turbulent14-1-2/index.html |
| fluid-181103-35 | turbulent14 1 3 | 6/6 | /resources/fluid-181103-html/materials/35-fluid-181103-35-turbulent14-1-3/index.html |
| fluid-181103-36 | turbulent15 4 | 8/8 | /resources/fluid-181103-html/materials/36-fluid-181103-36-turbulent15-4-1/index.html |
| fluid-181103-37 | turbulent16 3 | 8/8 | /resources/fluid-181103-html/materials/37-fluid-181103-37-turbulent16-3-1/index.html |

## Checks

| check | pass |
| --- | --- |
| safe-internal-apfs-execution | pass |
| source-index-exposes-38-direct-html-entrypoints | pass |
| all-38-material-pages-are-in-site-readable-html | pass |
| zero-viewer-wrapper-download-shells | pass |
| all-522-material-questions-return-to-html-anchors | pass |
| source-index-shows-quality-ledger-and-boundary | pass |

## Verify

```bash
node tools/check-round350-181103-html-depth-ledger.mjs --write --json
node tools/check-round350-181103-html-depth-ledger.mjs --check-only --json
```

