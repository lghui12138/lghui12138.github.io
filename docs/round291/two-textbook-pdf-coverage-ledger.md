# Round291 两本书 PDF 覆盖与 181103 来源账本

版本：round291-two-textbook-pdf-181103-source-coverage-20260613

Round291 把两本教材 PDF、181103 受保护资料、真题源文拆题风险放进同一个只读账本。它不复制 PDF 正文，不公开本机路径，也不把教材推导答案写成原卷答案。

## 总数

- 教材：2 本
- PDF OCR 页：916/916
- 教材小节：232/232
- 真题 aligned 原文小题：325
- 吴望一链接：325/325（100%）
- 王洪伟链接：287/325（88.3%）
- 强双教材链接：276/325（84.9%）
- 181103 受保护资料：38/38
- 真题 grouped section：68/68
- 五小问短答锁：5，失败 0

## 验收门

| gate | 状态 | 说明 |
|---|---|---|
| two-textbook-pdf-pages | pass | bookCount=2, OCR=916/916 |
| two-textbook-section-match | pass | matched=232/232, weak=0, pending=0 |
| real-exam-two-book-evidence | pass | aligned=325, Wu=325, Wang=287, strongBoth=276 |
| answer-boundary-not-original-pdf | pass | strictOriginal=0, answerPdfProvable=0, improperOriginal=0 |
| real-exam-source-expansion-locks | pass | atomic=325/325, grouped=68/68, subquestions=217/217 |
| supplemental-181103-all-materials | pass | materials=38/38, groups=5, routes=30, reviewTasks=68 |
| public-privacy-boundary | pass | noLocalPathLeak=true |

## 下一步队列

| id | 任务 | owner | 原因 |
|---|---|---|---|
| round292-formula-condition-crosscheck | 两本书公式适用条件差异提示 | formula-math | 65 个教材/公式补证点继续进入公式条件交叉核对。 |
| round293-181103-ocr-sampling | 181103 大 PDF/OCR 抽样复核 | content-evidence | 27 个 PDF 已进入受保护索引，后续按页抽样补更细章节证据。 |
| round294-private-video-r2-production | 私有视频 R2 生产绑定验收 | resources-video | UI 和 mock 只能证明流程；生产删除/上传/发布仍需 FM_PRIVATE_MEDIA R2 binding 与真实教师账号。 |
| round295-real-exam-original-text-spotcheck | 真题原文逐年抽样复核 | exam-quality | 继续重点抽查简答题、简述题、概念题、名词解释题，防止 5 小题或连续编号小问回退合并。 |

## 边界

- 此账本证明两本教材和 181103 材料对学习/复核的覆盖，不证明答案是原卷逐字答案。
- 181103 资料仍是受保护索引，只展示材料组、章节、题型和站内复习入口。
- 私有视频生产删除/上传/发布仍以 Cloudflare `FM_PRIVATE_MEDIA` R2 binding 和真实教师登录为准。
