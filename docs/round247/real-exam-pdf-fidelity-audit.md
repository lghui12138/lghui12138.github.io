# Round247 真题 PDF 一致性审计

版本标识: round247-real-exam-pdf-fidelity-audit-20260518
生成时间: 2026-06-12T21:23:36.746Z

这份审计只回答一个问题：网站里现在这些“真题”内容，哪些话能被源材料托住，哪些话还不能说满。我的看法是，题面和答案要分开判断；题面有 OCR/源索引可以逐层追，答案还没有原答案 PDF 的逐字证据。

## 证据链怎么读

- 主源题册 PDF: 存在；状态为 image-only-by-pypdf-sampling。路径只做本机证据线索，不复制进仓库。
- 补充答案/笔记 PDF: 存在；状态为 image-only-by-pypdf-sampling。它目前只能支持“答案/笔记链路”，不能自动推出“逐字原答案”。
- OCR/重建文本: `resources/fluid-mechanics/exam-archives/ouc-fluid-mechanics-2000-2024-complete.md`
- 当前源索引: `data/real-exam-source-index.json`（ok）
- 当前逐年题库: `question-banks/real-exam-years/*.json`

题面核对可以分三层看：第一层是本机扫描 PDF 是否还在；第二层是 OCR 重建文本和 `data/real-exam-source-index.json` 是否给出该年份、该题的源文本；第三层才是逐年题库里的题面能不能和源索引逐题对上。这个脚本主要做第二、三层核对，并把第一层 PDF 是否缺失如实写出来。

答案部分要更保守。现在题库里的答案、解析、讲解可以作为教学推导使用，但没有逐页答案 PDF OCR 或人工页码核验记录时，不能写成“逐字来自原答案 PDF”。所以本轮仍把答案证据标为 derived/unproven，而不是 original/verbatim。

## 总结
- 审计年份: 2000-2025
- 原题册范围: 2000-2024
- 活跃题目数: 353
- 题面可精确/包含式贴合 OCR 源: 79
- 题面仅达到模糊对齐: 246
- 当前没有可比源题面的题目: 28
- 答案缺原 PDF 逐字证据或为推导/笔记来源: 353
- 答案逐字原 PDF 证明状态: not-established
- 缺题年份: 2017
- 源索引缺失年份: 2017
- 不在 2000-2024 原题册索引内年份: 2025
- 脚本写入范围: `data/fluid-real-exam-pdf-fidelity-audit.json`、`docs/round247/real-exam-pdf-fidelity-audit.md`；不写 tmp，不保存 secret。

## 本轮结论

- 题面可按“本机 PDF 是否存在 -> OCR/重建文本 -> 源索引 -> 逐年题库题面”分层核对。 79 道题面为精确/包含式贴合，246 道达到既有模糊对齐。
- 答案目前不能说逐字来自原答案 PDF。 353 道现有答案缺少原答案 PDF 逐页 OCR 或人工页码核验记录。
- 2017 年缺源。 2017 年源索引状态为 source-missing，题库题数为 0。
- 2025 年不属于 2000-2024 原题册。 2025 年题库当前有 28 道，但源状态为 outside-source-index。
- 网站应把“题面原文”和“讲解/推导”分开。 题面字段只承载可回到 OCR/源索引的原文；答案、提示、推导放入讲解字段。

## 年份明细

| 年份 | 题数 | 源状态 | 题面精确/包含 | 模糊对齐 | 答案风险 | 年份问题 |
| --- | ---: | --- | ---: | ---: | ---: | --- |
| 2000 | 16 | available | 2 | 14 | 16 | answersNotPdfExact |
| 2001 | 11 | available | 2 | 9 | 11 | answersNotPdfExact |
| 2002 | 9 | available | 0 | 9 | 9 | answersNotPdfExact |
| 2003 | 9 | available | 2 | 7 | 9 | answersNotPdfExact |
| 2004 | 18 | available | 1 | 17 | 18 | answersNotPdfExact |
| 2005 | 16 | available | 0 | 16 | 16 | answersNotPdfExact |
| 2006 | 14 | available | 6 | 8 | 14 | answersNotPdfExact |
| 2007 | 22 | available | 5 | 17 | 22 | answersNotPdfExact |
| 2008 | 9 | available | 1 | 8 | 9 | answersNotPdfExact |
| 2009 | 8 | available | 4 | 4 | 8 | answersNotPdfExact |
| 2010 | 21 | available | 10 | 11 | 21 | answersNotPdfExact |
| 2011 | 18 | available | 11 | 7 | 18 | answersNotPdfExact |
| 2012 | 16 | available | 0 | 16 | 16 | answersNotPdfExact |
| 2013 | 10 | available | 2 | 8 | 10 | answersNotPdfExact |
| 2014 | 13 | available | 0 | 13 | 13 | answersNotPdfExact |
| 2015 | 14 | available | 0 | 14 | 14 | answersNotPdfExact |
| 2016 | 9 | available | 4 | 5 | 9 | answersNotPdfExact |
| 2017 | 0 | source-missing | 0 | 0 | 0 | sourceIndexMissing; emptyYearQuestions |
| 2018 | 14 | available | 0 | 14 | 14 | answersNotPdfExact |
| 2019 | 13 | available | 0 | 13 | 13 | answersNotPdfExact |
| 2020 | 17 | available | 0 | 17 | 17 | answersNotPdfExact |
| 2021 | 12 | available | 6 | 6 | 12 | answersNotPdfExact |
| 2022 | 10 | available | 9 | 1 | 10 | answersNotPdfExact |
| 2023 | 11 | available | 9 | 2 | 11 | answersNotPdfExact |
| 2024 | 15 | available | 5 | 10 | 15 | answersNotPdfExact |
| 2025 | 28 | outside-source-index | 0 | 0 | 28 | outsideOriginal2000To2024PdfIndex; answersNotPdfExact |

## 处理原则

- 网站排版可以更清楚，但题面字段不得为了讲解而改写；如果需要摘要，只能放在展示标题或提示里，题面正文保留可回到源索引的原文。
- “题面原文”和“讲解/推导”要拆开：题面用于保真，讲解用于教学，不要把讲解性改写塞回题面。
- 答案没有原答案 PDF OCR 或人工逐页核验时，只能标为推导/笔记来源；不能宣称与原答案一模一样，也不能说逐字来自原答案 PDF。
- 2017 当前源索引和逐年题库均为空；除非重新从扫描页人工核出，不应臆造题目。
- 2025 当前属于笔记/复习页派生题，不在 2000-2024 原题册源索引内，发布时应避免和 2000-2024 原题册混成同一种来源。

