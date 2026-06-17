# Round338 181103 Content Depth Gate

- version: round338-181103-content-depth-20260615
- resource entry: `/resources.html#round323ResourceFinder`
- HTML index: `/resources/fluid-181103-html/index.html`
- question bank: `/modules/question-bank.html?focus=181103-material-extracted#questionBanksList`
- direct HTML content pages: 38/38
- visible content pages: 38/38
- question-bank material questions: 522/522
- materials with question anchors: 21/38
- no viewer/download/local-file/embed hits: 0
- public digest: `3f5e86f24d5721a4c1cc7cc6a7db186f55dd67313d79d84e544f76cf9056aa55`

## Boundary

Round338 is a static, Node-only gate. It reads the resource center, 181103 HTML index, 38 material pages, the 522-question material bank, and Round317/Round332 ledgers. It does not rebuild private source files, does not use Python, and does not inspect or touch the external panic-isolation volume.

## Proof Surface

| Surface | Evidence |
| --- | ---: |
| HTML material pages found | 38 |
| Source-index direct HTML entrypoints | 38 |
| Pages with HTML content section | 38 |
| Pages with visible in-site content | 38 |
| PDF page-image materials | 36 |
| Total PDF page images | 774 |
| PPT HTML slide materials | 0 |
| Total PPT HTML slides | 0 |
| Text / child-HTML index materials | 2 |
| Material questions in bank | 522 |
| Questions with existing source anchors | 522 |
| Materials with at least one source question anchor | 21 |
| Materials missing source question anchors | 17 |

## Hard Checks

| Check | Result |
| --- | --- |
| refuses-mac2t-run-and-uses-internal-repo-root | PASS |
| round317-and-round332-baselines-still-pass | PASS |
| source-index-exposes-38-direct-html-entrypoints | PASS |
| all-38-material-pages-have-visible-in-site-html-content | PASS |
| question-bank-exposes-522-material-questions | PASS |
| all-522-questions-have-existing-source-html-anchors | PASS |
| zero-viewer-download-iframe-object-local-file-risks | PASS |

## Risk Scan

| Risk | Count | Status |
| --- | ---: | --- |
| empty-content-materials | 0 | clear |
| too-short-materials-for-human-review | 0 | clear |
| materials-without-question-bank-source-anchors | 17 | risk |

## Missing Question-Anchor Risks

These pages are visible in-site HTML, but the current 522-question bank has no `sourceHtmlUrl` pointing into them.

| Material | Title | PDF Pages | Images | Meaningful Text Chars | File |
| --- | --- | ---: | ---: | ---: | --- |
| fluid-181103-02 | 中国海大 流体力学名词解释 扫描版 | 19 | 19 | 949 | `resources/fluid-181103-html/materials/02-fluid-181103-02-material/index.html` |
| fluid-181103-10 | 流体力学习题册答案2010修改版 | 52 | 52 | 2599 | `resources/fluid-181103-html/materials/10-fluid-181103-10-2010/index.html` |
| fluid-181103-11 | 流体力学I课件 | 0 | 0 | 134 | `resources/fluid-181103-html/materials/11-fluid-181103-11-i/index.html` |
| fluid-181103-16 | 2理想流体运动 | 36 | 36 | 1799 | `resources/fluid-181103-html/materials/16-fluid-181103-16-2/index.html` |
| fluid-181103-17 | 3基本方程组 | 40 | 40 | 1999 | `resources/fluid-181103-html/materials/17-fluid-181103-17-3/index.html` |
| fluid-181103-21 | 8 1 | 29 | 29 | 1449 | `resources/fluid-181103-html/materials/21-fluid-181103-21-8-1/index.html` |
| fluid-181103-22 | 8 | 12 | 12 | 599 | `resources/fluid-181103-html/materials/22-fluid-181103-22-8/index.html` |
| fluid-181103-24 | 流体的涡旋运动 | 25 | 25 | 1249 | `resources/fluid-181103-html/materials/24-fluid-181103-24-material/index.html` |
| fluid-181103-26 | 流体力学II课件 | 0 | 0 | 144 | `resources/fluid-181103-html/materials/26-fluid-181103-26-ii/index.html` |
| fluid-181103-30 | 走近湍流 | 9 | 9 | 449 | `resources/fluid-181103-html/materials/30-fluid-181103-30-1/index.html` |
| fluid-181103-31 | turbulence14 2.ppt | 12 | 12 | 599 | `resources/fluid-181103-html/materials/31-fluid-181103-31-turbulence14-2-ppt/index.html` |
| fluid-181103-32 | turbulence16 2 | 13 | 13 | 649 | `resources/fluid-181103-html/materials/32-fluid-181103-32-turbulence16-2-1/index.html` |
| fluid-181103-33 | turbulent14 1 1 | 8 | 8 | 399 | `resources/fluid-181103-html/materials/33-fluid-181103-33-turbulent14-1-1/index.html` |
| fluid-181103-34 | turbulent14 1 2 | 15 | 15 | 749 | `resources/fluid-181103-html/materials/34-fluid-181103-34-turbulent14-1-2/index.html` |
| fluid-181103-35 | turbulent14 1 3 | 6 | 6 | 299 | `resources/fluid-181103-html/materials/35-fluid-181103-35-turbulent14-1-3/index.html` |
| fluid-181103-36 | turbulent15 4 | 8 | 8 | 399 | `resources/fluid-181103-html/materials/36-fluid-181103-36-turbulent15-4-1/index.html` |
| fluid-181103-37 | turbulent16 3 | 8 | 8 | 399 | `resources/fluid-181103-html/materials/37-fluid-181103-37-turbulent16-3-1/index.html` |

## Short-Page Risks

| Material | Title | Meaningful Text Chars | PDF Pages | Images | Source Questions | File |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| none | none | 0 | 0 | 0 | 0 | n/a |

## Shortest Materials Sample

| Material | Title | Meaningful Text Chars | PDF Pages | Images | Source Questions | Status |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| fluid-181103-11 | 流体力学I课件 | 134 | 0 | 0 | 0 | ok |
| fluid-181103-26 | 流体力学II课件 | 144 | 0 | 0 | 0 | ok |
| fluid-181103-35 | turbulent14 1 3 | 299 | 6 | 6 | 0 | ok |
| fluid-181103-28 | 期末总复习16 | 372 | 4 | 4 | 2 | ok |
| fluid-181103-20 | 6.7绕流物体受力 | 399 | 8 | 8 | 1 | ok |
| fluid-181103-33 | turbulent14 1 1 | 399 | 8 | 8 | 0 | ok |
| fluid-181103-36 | turbulent15 4 | 399 | 8 | 8 | 0 | ok |
| fluid-181103-37 | turbulent16 3 | 399 | 8 | 8 | 0 | ok |
| fluid-181103-30 | 走近湍流 | 449 | 9 | 9 | 0 | ok |
| fluid-181103-03 | 练习册 | 599 | 12 | 12 | 111 | ok |

## Gate

```bash
node tools/check-round338-181103-content-depth.mjs --write --json
node tools/check-round338-181103-content-depth.mjs --check-only --json
node tools/check-round332-181103-html-question-visibility.mjs --check-only --json
node tools/check-round317-181103-live-html-depth.mjs --json
```
