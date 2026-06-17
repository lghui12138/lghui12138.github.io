# Round293 181103 全资料核验

版本：`round293-181103-full-material-audit-20260613`

本轮把 181103 受保护资料补充从“已索引”提升为“全资料核验卡”。公开页面只展示受保护索引、资料类型、资料组、章节线索、站内路线和处理队列；不复制原始文件，不提供本机路径或原始资料入口。

## 锁定结果

- 资料数量：38/38
- 类型统计：27 PDF / 6 PPT 或 PPTX / 3 DOC 或 DOCX / 2 ZIP
- 路线覆盖：30 条细分路线，含章节、资料组、文件类型、复习目标和题型路线
- 真题复核：61 个 grouped-section 任务，仍绑定 316/316 原文小题和 61/61 组题基线
- 隐私边界：不公开本机绝对路径、本地文件 URL、原始资料入口或认证标记

## 新增产物

- `tools/build-round293-181103-full-material-audit.mjs`
- `data/fluid-181103-full-material-audit.json`
- `data/fluid-181103-full-material-audit.json.gz`
- `resources.html` 的“181103 全资料核验”卡片

## 使用边界

- 181103 资料只能辅助章节、题型、内容线索和真题题干复核。
- 答案证据仍回 `data/fluid-real-exam-answer-evidence-boundary.json` 与历年真题页，不因资料名含“答案”就标为原卷逐字答案。
- ZIP、Office 和大 PDF 只进入处理队列，后续可做 OCR、抽页、解包深索引，但原件不进入公开下载面。
