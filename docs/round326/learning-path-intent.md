# Round326 Learning Path Intent Gate

版本：`round326-learning-path-intent-20260615`

Round326 一号 worker 做的是学习路径和站内搜索意图加载升级：让学生输入或点击 `181103`、`真题`、`公式`、`专属课`、`错题/复盘` 时，更快进入正确页面。

## 摘要

- 搜索意图首位命中：6/6
- 题库入口意图链接：5/5
- Round325 release readiness：ready
- 私有视频生产恢复声明：not claimed

## 搜索意图

| 查询 | 状态 | 首位结果 | href |
|---|---|---|---|
| 181103 | PASS | 181103 资料题库与练习入口 | /modules/question-bank.html?focus=181103-material-extracted#questionBanksList |
| 真题 | PASS | 历年真题新版入口 | /modules/real-exams-dynamic.html?edge_refresh=round402-server-health-production-boundary-20260619&from=round342-home-search |
| 公式 | PASS | 公式回查表 | /index-complete.html#formula-checklist |
| 专属课 | PASS | 私有课程 / 专属课状态直选 | /resources.html?from=round342-intent-private-course#sourceStatus |
| 错题 | PASS | 错题订正入口 | /index-complete.html#tabsW |
| 复盘 | PASS | 错题复盘直选 | /index-complete.html#tabsW |

## 题库入口

| 意图 | 存在 | href | 目标正确 | 安全 href |
|---|---:|---|---:|---:|
| 181103 | yes | ./resources/fluid-181103-html/index.html | yes | yes |
| real-exam | yes | ./modules/real-exams-dynamic.html?edge_refresh=round410-181103-practice-status-cardinality-20260620&from=round337-question-bank-intent | yes | yes |
| formula | yes | ./index-complete.html#formula-checklist | yes | yes |
| private-course | yes | ./resources.html?from=round326-intent-private-course#sourceStatus | yes | yes |
| mistake-review | yes | ./index-complete.html#tabsW | yes | yes |

## 机器检查

| 检查 | 状态 | 细节 |
|---|---|---|
| search-index-declares-round326-intent-routing | PASS | {"intentRoutingVersion":"round342-learning-discovery-routes-20260615","intentEntryCount":8} |
| search-intents-rank-to-correct-first-result | PASS | [{"id":"181103","query":"181103","label":"181103 资料 HTML 正文","pass":true,"top":{"t":"入口","n":"181103 资料题库与练习入口","u":"/modules/question-bank.html?focus=181103-material-extracted#questionBanksList","d":"首页搜索 181103 可直接进入 522 张来源 HTML 卡，其中 381 道独立题可刷、141 条源文线索只展示；同时保留 38/38 HTML 资料总表和 68 个真题复核任务；用户搜“181103去哪了、181103那些资源去哪了、181103里面还有别的题目、资料题库”也直达这里。","sc":16},"topThree":[{"t":"入口","n":"181103 资料题库与练习入口","u":"/modules/question-bank.html?focus=181103-material-extracted#questionBanksList","sc":16},{"t":"入口","n":"181103 全资料 HTML 总表","u":"/resources/fluid-181103-html/index.html","sc":16},{"t":"意图入口","n":"181103 资料题库直选","u":"/modules/question-bank.html?focus=181103-material-extracted#questionBanksList","sc":16}]},{"id":"real-exam","query":"真题","label":"历年真题动态页","pass":true,"top":{"t":"入口","n":"历年真题新版入口","u":"/modules/real-exams-dynamic.html?edge_refresh=round402-server-health-production-boundary-20260619&from=round342-home-search","d":"2000-2024 历年真题；325 原文小题和 68 个已拆组题 section，适合从题库、练习和搜索直接进入；用户搜“历年真题新版、简答题五题、本来五题别合并”也直达这里。","sc":16},"topThree":[{"t":"入口","n":"历年真题新版入口","u":"/modules/real-exams-dynamic.html?edge_refresh=round402-server-health-production-boundary-20260619&from=round342-home-search","sc":16},{"t":"入口","n":"历年真题","u":"/modules/real-exams-dynamic.html","sc":16},{"t":"意图入口","n":"历年真题新版直选","u":"/modules/real-exams-dynamic.html?edge_refresh=round410-181103-practice-status-cardinality-20260620&from=round342-intent-real-exam","sc":16}]},{"id":"formula","query":"公式","label":"公式条件回查","pass":true,"top":{"t":"入口","n":"公式回查表","u":"/index-complete.html#formula-checklist","d":"首页第一屏复习路线：选出公式后核适用条件、边界条件、单位方向和常见错因，再回看对应例题和自制动画。","sc":16},"topThree":[{"t":"入口","n":"公式回查表","u":"/index-complete.html#formula-checklist","sc":16},{"t":"公式","n":"公式精排集","u":"/ultimate-beautiful-formulas.html","sc":16},{"t":"意图入口","n":"公式条件直选","u":"/index-complete.html#formula-checklist","sc":16}]},{"id":"private-course","query":"专属课","label":"专属课状态","pass":true,"top":{"t":"意图入口","n":"私有课程 / 专属课状态直选","u":"/resources.html?from=round342-intent-private-course#sourceStatus","d":"查看当前账号私有课程和专属课可见状态；生产私有视频恢复仍受 FM_PRIVATE_MEDIA R2 binding 边界约束。用户搜“无法删除视频”“不能管理视频”“私有视频管理不对”也直达这里。","sc":16},"topThree":[{"t":"意图入口","n":"私有课程 / 专属课状态直选","u":"/resources.html?from=round342-intent-private-course#sourceStatus","sc":16},{"t":"入口","n":"私有课程状态入口","u":"/resources.html?from=round342-home-search-private-course#sourceStatus","sc":11}]},{"id":"wrongbook","query":"错题","label":"错题本","pass":true,"top":{"t":"入口","n":"错题订正入口","u":"/index-complete.html#tabsW","d":"首页错题本、收藏和笔记；先按错因订正，再回同类真题或公式条件继续练。","sc":16},"topThree":[{"t":"入口","n":"错题订正入口","u":"/index-complete.html#tabsW","sc":16},{"t":"意图入口","n":"错题复盘直选","u":"/index-complete.html#tabsW","sc":16},{"t":"入口","n":"题库练习","u":"/modules/question-bank.html?from=home-search","sc":11}]},{"id":"review","query":"复盘","label":"错题复盘","pass":true,"top":{"t":"意图入口","n":"错题复盘直选","u":"/index-complete.html#tabsW","d":"进入首页错题本、收藏和笔记；先按错因订正，再重做同公式或同边界真题。","sc":16},"topThree":[{"t":"意图入口","n":"错题复盘直选","u":"/index-complete.html#tabsW","sc":16}]}] |
| question-bank-home-exposes-five-intent-links | PASS | [{"id":"181103","present":true,"href":"./resources/fluid-181103-html/index.html","hrefOk":true,"safeHref":true,"ariaOk":true},{"id":"real-exam","present":true,"href":"./modules/real-exams-dynamic.html?edge_refresh=round410-181103-practice-status-cardinality-20260620&from=round337-question-bank-intent","hrefOk":true,"safeHref":true,"ariaOk":true},{"id":"formula","present":true,"href":"./index-complete.html#formula-checklist","hrefOk":true,"safeHref":true,"ariaOk":true},{"id":"private-course","present":true,"href":"./resources.html?from=round326-intent-private-course#sourceStatus","hrefOk":true,"safeHref":true,"ariaOk":true},{"id":"mistake-review","present":true,"href":"./index-complete.html#tabsW","hrefOk":true,"safeHref":true,"ariaOk":true}] |
| index-shell-has-fallback-intent-entry-points | PASS | {"has181103":true,"hasFormula":true,"hasMistakeReview":true} |
| private-course-intent-stays-status-not-recovery-claim | PASS | {"searchDescription":"查看当前账号私有课程和专属课可见状态；生产私有视频恢复仍受 FM_PRIVATE_MEDIA R2 binding 边界约束。用户搜“无法删除视频”“不能管理视频”“私有视频管理不对”也直达这里。","productionPrivateVideoRecoveryClaimed":false,"r2RecoveryClaimedHere":false} |
| round325-release-readiness-remains-ready | PASS | {"expectedVersion":"round408-release-gate-public-consistency-20260620","expectedBaselineVersion":"round325-181103-real-exam-private-video-proof-20260615","acceptsSuccessorRelease":true,"ready":true,"status":"ready-for-production-release-gate"} |
| round326-intent-hrefs-avoid-download-viewer-raw-local-paths | PASS | {"unsafeSearchHrefs":[],"unsafeQuickHrefs":[]} |

## 边界

- 没有改 `resources.html`、`modules/real-exams-dynamic.html` 或 private-video 脚本。
- 专属课入口只指向账号状态和 `FM_PRIVATE_MEDIA` R2 边界，不宣称生产恢复。
- 181103 仍指向站内 HTML 和题库/真题回流，不引入原件下载、viewer、raw 路由或本机路径。
