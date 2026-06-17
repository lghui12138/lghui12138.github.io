# Round302 181103 Material Enrichment Ledger

- version: round302-181103-material-enrichment-ledger-20260614
- materials: 38/38
- types: 6
- chapters: 6
- use cases: 17
- review tasks: 61
- source atoms: 316
- missing core route links: 0
- missing future route links: 38
- local path leaks: 0
- pass: true

Visible metadata only: material IDs, titles, type/chapter/use-case labels, counts, and station routes. No raw local file paths, no download URLs, no protected source files.

## Checks

- PASS materials-classified-38: materials=38, source=38, routes=38
- PASS type-classification-complete: types=6
- PASS chapter-classification-complete: chapterLedger=6
- PASS use-case-classification-complete: useCases=17
- PASS core-route-links-complete: missingCoreRouteLinks=0
- PASS route-link-gaps-detected: futureRouteGaps=38
- PASS local-path-leakage-clear: localPathLeaks=0
- PASS visible-safe-metadata: visibleSafe=38/38

## Type Ledger

- Word 答案/讲义: 1 materials, chapters 1/2/3/5/6/8
- Word 讲义: 2 materials, chapters 1/2/3/5/6/8
- PDF 讲义/扫描件: 27 materials, chapters 1/2/3/5/6/8
- PPT 课件: 1 materials, chapters 3
- PPTX 课件: 5 materials, chapters 1/2/3
- 压缩包原件: 2 materials, chapters 1/2/3/5/6/8

## Chapter Ledger

- 第1章 流体的物理性质: 12 materials, 17 use-case buckets, route /modules/knowledge-detail.html?chapter=1
- 第2章 理想流体流动: 11 materials, 16 use-case buckets, route /modules/knowledge-detail.html?chapter=2
- 第3章 流体运动的基本方程组: 11 materials, 17 use-case buckets, route /modules/knowledge-detail.html?chapter=3
- 第5章 流体的涡旋运动: 8 materials, 15 use-case buckets, route /modules/knowledge-detail.html?chapter=5
- 第6章 理想不可压缩流体无旋运动: 10 materials, 16 use-case buckets, route /modules/knowledge-detail.html?chapter=6
- 第8章 黏性不可压缩流动: 21 materials, 15 use-case buckets, route /modules/knowledge-detail.html?chapter=8

## Use-Case Ledger

- 章节主线速读: 22 materials, family study-goal
- 习题答案复盘: 4 materials, family study-goal
- 考前总复习: 6 materials, family study-goal
- 公式条件核对: 10 materials, family study-goal
- 抽取整理队列: 8 materials, family study-goal
- 名词解释冲刺: 5 materials, family study-goal
- 湍流与黏性拓展: 13 materials, family study-goal
- 答案/讲义摘录与人工复核: 3 materials, family resource-handling
- 受保护解包队列，不做公开下载入口: 2 materials, family resource-handling
- 目录级精读、页码抽样和后续 OCR: 27 materials, family resource-handling
- 课件主线浏览和章节入口: 6 materials, family resource-handling
- 计算与例题: 6 materials, family question-type

## Route-Link Audit

- registered routes: 47
- missing core links: 0
- missing future-use links: 38

The future-use gaps are kept as explicit metadata so the next UI worker can decide whether to create dedicated use-case routes or keep those keys as card facets only.

## Leakage Audit

- checked inputs: 5
- findings: 0
- public safe: true
