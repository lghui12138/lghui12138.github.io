# Round319 资源/视频到练习链路

版本：`round319-resources-video-practice-chain-20260614`

Round319 把资源页收成一个学生可执行链路：181103 资料必须是站内 HTML 内容页，资源/视频看完后回真实真题与章节练习，私有视频只报告管理边界，不冒充生产恢复。

## 摘要

- 181103 HTML 资料页：38
- 站内 HTML 深度通过：38
- Round319 资源页章节练习入口：1
- Round319 真题入口：2
- 真题题数基线：325/68/217
- 章节练习覆盖：6 个章节，325 道原题
- 禁止 href：0
- 私有视频生产恢复允许：false

## 机器检查

| 检查 | 状态 | 细节 |
|---|---|---|
| 181103-all-materials-are-in-site-html | PASS | {"materialPageCount":38,"indexMaterialCards":38,"liveHtmlPassCount":38,"liveHtmlContentMapCount":38,"liveHtmlContentStartIdCount":38} |
| round319-visible-practice-chain | PASS | {"practiceHrefs":["/modules/practice-dynamic.html?type=real&chapter=1&mode=normal&from=round319-resource-route"],"realExamHrefs":["/modules/real-exams-dynamic.html?from=round319-resources-181103-return-path","/modules/real-exams-dynamic.html?chapter=1&from=round319-resource-true-exam"],"runtimeChapterCount":6,"hasRuntimePracticeTemplate":true,"hasRuntimeRealExamTemplate":true} |
| real-exam-no-merge-counts-preserved | PASS | {"sourceAtomicQuestionCount":325,"groupedSectionCount":68,"groupedWebQuestionIdCount":217,"chapterShortcutCount":6,"shortcutPrimaryQuestionCount":325,"chapterPracticeQuestionCount":302} |
| 181103-bridge-still-reaches-real-exam | PASS | {"bridgeMaterialPagesWithRealExamBridge":38,"bridgeRouteFamilyTotal":30,"bridgeChapterPracticeHrefCount":6} |
| no-viewer-download-raw-binary-hrefs | PASS | {"forbiddenHrefCount":0,"forbiddenWrapperTokenCount":0,"sample":[],"tokenSample":[]} |
| private-video-production-recovery-not-overclaimed | PASS | {"productionRecoveryAllowed":false,"r2ProductionRecovery":false,"productionRecoveryEligible":false} |

## 边界

- 这是站内 HTML 阅读与学习链路证明，不是原件下载证明。
- 181103 公开面不得出现 viewer、iframe/embed/object、原始二进制 href、本机路径、download/raw 路由。
- 真实私有视频生产恢复仍要同时具备 FM_PRIVATE_MEDIA R2 binding 和真实教师/学生账号 QA。
