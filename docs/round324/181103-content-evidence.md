# Round324 181103 Content Evidence Ledger

- version: round324-181103-content-evidence-20260615
- HTML resources: 38/38
- PDF page images: 774
- HTML slides: 0
- DOC/DOCX HTML materials: 0
- ZIP HTML directory materials: 2
- question anchors: 522/522
- raw download/viewer/local path hits: 0

## Boundary

This ledger is generated from existing Round323/181103 data artifacts only. It records content evidence for the 181103 all-HTML resource surface and the extracted question-anchor surface; it does not change UI files and does not publish raw PDF/PPT/DOC/ZIP downloads, viewer wrappers, or local filesystem paths.

## Content Evidence

| Metric | Value |
|---|---:|
| Source files accounted | 38 |
| Indexed materials | 38 |
| Direct in-site HTML materials | 38 |
| PDF page images | 774 |
| HTML slides | 0 |
| DOC/DOCX HTML materials | 0 |
| ZIP HTML directory materials | 2 |
| No-download notices | 38 |
| Forbidden hrefs | 0 |
| Local path markers | 0 |
| Embedded viewer elements | 0 |
| Viewer wrapper markers | 0 |

## Source Type Ledger

| Type | Count |
|---|---:|
| doc | 1 |
| docx | 2 |
| pdf | 27 |
| ppt | 1 |
| pptx | 5 |
| zip | 2 |

## Question Anchor Ledger

| Metric | Value |
|---|---:|
| Question anchors | 522 |
| In-site HTML anchors | 522 |
| Source materials with extracted questions | 21 |
| Default practice questions | 522 |
| OCR review questions | 379 |
| Hidden review questions | 0 |
| Anchor boundary hits | 0 |

## Top Question Sources

| Material | Title | Type | Anchors |
|---|---|---|---:|
| fluid-181103-01 | 流体力学习题解 余志豪 | pdf | 289 |
| fluid-181103-03 | 练习册 | pdf | 111 |
| fluid-181103-09 | 流体力学习题册答案2010修改版 | doc | 50 |
| fluid-181103-38 | 未命名 3 | pdf | 42 |
| fluid-181103-05 | 1 流体的物理性质 2 | pptx | 5 |
| fluid-181103-29 | 湍流讲义3 | docx | 5 |
| fluid-181103-04 | 1 流体的物理性质 1 | pptx | 3 |
| fluid-181103-06 | 2 理想流体流动 | pptx | 2 |
| fluid-181103-07 | 2 理想流体流动 | pptx | 2 |
| fluid-181103-28 | 期末总复习16 | docx | 2 |

## Checks

| Check | Result |
|---|---|
| round323-source-parity-accepted | PASS |
| round324-content-evidence-targets | PASS |
| round324-question-anchor-ledger | PASS |
| materials-accounting-stays-38-and-published-html-boundary | PASS |
| no-raw-download-viewer-or-local-path-boundary | PASS |
| round324-output-boundary-is-clean | PASS |

## Gate

```bash
node tools/check-round324-181103-content-evidence.mjs --write --json
node tools/check-round324-181103-content-evidence.mjs --check-only --json
```
