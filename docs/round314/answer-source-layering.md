# Round314 Answer Source Layering

- version: round314-answer-source-layering-20260614
- real exam counts: 325/325 atoms, 68/68 grouped sections, 217/217 grouped subquestions
- strict original-answer PDF proof: 0
- derived/reference answer layer: 325
- strong two-textbook support: 276
- 181103 direct HTML pages: 38/38
- raw downloads / wrappers / local paths: 0 / 0 / 0

## Layers

| id | label | count | rule |
| --- | --- | ---: | --- |
| question-pdf | 题面原 PDF | 325 | 只证明题干/题面来源，不证明答案逐字来源。 |
| reference-answer | 参考解析/推导答案 | 325 | 用于学习和订正，必须保持 derived/unproven 标记。 |
| strict-answer-pdf | 原答案 PDF 逐字证据 | 0 | 当前为 0；没有逐字证据时不得写成原卷答案。 |
| two-textbooks | 两本教材支撑 | 276 | 用于公式、章节和推导支撑，不替代原答案 PDF。 |
| supplemental-181103-html | 181103 全 HTML 正文资料 | 38 | 只发布站内 HTML 正文，0 viewer、0 原件下载、0 本机路径。 |

## Checks

| check | status |
| --- | --- |
| current-release-version-round314 | PASS |
| roadmap-round314-active | PASS |
| question-source-counts-not-merged | PASS |
| strict-original-answer-pdf-proof-zero | PASS |
| derived-reference-answer-layer-visible | PASS |
| two-textbook-support-layer-visible | PASS |
| 181103-all-html-still-direct-content | PASS |
| real-exam-page-round314-source-layer-panel | PASS |
| 181103-index-round314-source-layer-panel | PASS |

## Gate

```bash
node tools/check-round314-answer-source-layering.mjs --write --json
```
