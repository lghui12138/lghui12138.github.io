# Round324 Resources Discovery A11y Audit

版本：`round324-resources-discovery-a11y-20260615`

Round324 worker E 做的是静态 UI/a11y 设计审计：检查资源页和首页是否能直接发现 181103 全 HTML、522 资料内题、历年真题新版、私有视频状态四个入口，并确认它们没有把用户带到 download/viewer/raw/local-path 语义。

## 摘要

- 静态检查：17/17 通过
- 资源页四入口：4/4
- 首页四入口：4/4
- 181103 HTML 页：38/38
- 522 资料内题：522
- 历年真题粒度：325 原文小题 / 68 组题
- 私有视频生产恢复：blocked
- 入口危险 href：0

## 资源页入口

| 入口 | 存在 | href | 文案达标 | aria-label | 安全 href |
|---|---:|---|---:|---:|---:|
| 181103-all-html | yes | /resources/fluid-181103-html/index.html | yes | yes | yes |
| 181103-522-bank | yes | /modules/question-bank.html?focus=181103-material-extracted#questionBanksList | yes | yes | yes |
| real-exam-current | yes | /modules/real-exams-dynamic.html?edge_refresh=round358-181103-522-html-practice-release-20260616&from=round325-resource-finder | yes | yes | yes |
| private-video-status | yes | #sourceStatus | yes | yes | yes |

## 首页入口

| 入口 | 存在 | href | 文案达标 | aria-label | 安全 href |
|---|---:|---|---:|---:|---:|
| 181103-all-html | yes | /resources/fluid-181103-html/index.html | yes | yes | yes |
| 181103-522-bank | yes | /modules/question-bank.html?focus=181103-material-extracted#questionBanksList | yes | yes | yes |
| real-exam-current | yes | /modules/real-exams-dynamic.html?edge_refresh=round358-181103-522-html-practice-release-20260616&from=round358-home-shortcut | yes | yes | yes |
| private-video-status | yes | /resources.html?from=round358-home-shortcut#sourceStatus | yes | yes | yes |

## 关键数值

| 指标 | 值 |
|---|---:|
| 181103 materialPageCount | 38 |
| 181103 htmlPassCount | 38 |
| 181103 viewer/download href | 0 |
| 181103 iframe/embed/object | 0 |
| 181103 local path leaks | 0 |
| 522 extracted questions | 522 |
| 522 source anchors found | 522 |
| real-exam atomic questions | 325 |
| real-exam grouped sections | 68 |
| real-exam grouped web IDs | 217 |
| 181103 route families | 30 |
| FM_PRIVATE_MEDIA R2 ready | false |
| production recovery eligible | false |

## 机器检查

| 检查 | 状态 | 细节 |
|---|---|---|
| resources-four-entry-block-is-above-resource-tabs | PASS | {"resourcesLine":535,"resourcesTabsLine":584,"resourcesSourceStatusLine":647,"homeLine":255,"homeHeroLine":87} |
| home-four-entry-block-is-near-top-of-main | PASS | {"resourcesLine":535,"resourcesTabsLine":584,"resourcesSourceStatusLine":647,"homeLine":255,"homeHeroLine":87} |
| resources-section-has-name-and-description | PASS | {"sectionFound":true} |
| home-section-has-name-and-description | PASS | {"sectionFound":true} |
| resources-exposes-all-four-required-entry-links | PASS | [{"surface":"resources","entry":"181103-all-html","label":"181103 HTML","present":true,"href":"/resources/fluid-181103-html/index.html","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"resources","entry":"181103-522-bank","label":"522 material bank","present":true,"href":"/modules/question-bank.html?focus=181103-material-extracted#questionBanksList","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"resources","entry":"real-exam-current","label":"real exams","present":true,"href":"/modules/real-exams-dynamic.html?edge_refresh=round358-181103-522-html-practice-release-20260616&from=round325-resource-finder","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"resources","entry":"private-video-status","label":"private video status","present":true,"href":"#sourceStatus","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":"sourceStatus"}] |
| home-exposes-all-four-required-entry-links | PASS | [{"surface":"home","entry":"181103-all-html","label":"181103 HTML","present":true,"href":"/resources/fluid-181103-html/index.html","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"home","entry":"181103-522-bank","label":"522 material bank","present":true,"href":"/modules/question-bank.html?focus=181103-material-extracted#questionBanksList","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"home","entry":"real-exam-current","label":"real exams","present":true,"href":"/modules/real-exams-dynamic.html?edge_refresh=round358-181103-522-html-practice-release-20260616&from=round358-home-shortcut","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"home","entry":"private-video-status","label":"private video status","present":true,"href":"/resources.html?from=round358-home-shortcut#sourceStatus","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""}] |
| resources-entry-copy-and-aria-name-disambiguate-purpose | PASS | [{"surface":"resources","entry":"181103-all-html","label":"181103 HTML","present":true,"href":"/resources/fluid-181103-html/index.html","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"resources","entry":"181103-522-bank","label":"522 material bank","present":true,"href":"/modules/question-bank.html?focus=181103-material-extracted#questionBanksList","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"resources","entry":"real-exam-current","label":"real exams","present":true,"href":"/modules/real-exams-dynamic.html?edge_refresh=round358-181103-522-html-practice-release-20260616&from=round325-resource-finder","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"resources","entry":"private-video-status","label":"private video status","present":true,"href":"#sourceStatus","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":"sourceStatus"}] |
| home-entry-copy-and-aria-name-disambiguate-purpose | PASS | [{"surface":"home","entry":"181103-all-html","label":"181103 HTML","present":true,"href":"/resources/fluid-181103-html/index.html","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"home","entry":"181103-522-bank","label":"522 material bank","present":true,"href":"/modules/question-bank.html?focus=181103-material-extracted#questionBanksList","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"home","entry":"real-exam-current","label":"real exams","present":true,"href":"/modules/real-exams-dynamic.html?edge_refresh=round358-181103-522-html-practice-release-20260616&from=round358-home-shortcut","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"home","entry":"private-video-status","label":"private video status","present":true,"href":"/resources.html?from=round358-home-shortcut#sourceStatus","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""}] |
| entry-hrefs-route-to-current-discovery-surfaces | PASS | [{"surface":"resources","entry":"181103-all-html","label":"181103 HTML","present":true,"href":"/resources/fluid-181103-html/index.html","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"resources","entry":"181103-522-bank","label":"522 material bank","present":true,"href":"/modules/question-bank.html?focus=181103-material-extracted#questionBanksList","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"resources","entry":"real-exam-current","label":"real exams","present":true,"href":"/modules/real-exams-dynamic.html?edge_refresh=round358-181103-522-html-practice-release-20260616&from=round325-resource-finder","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"resources","entry":"private-video-status","label":"private video status","present":true,"href":"#sourceStatus","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":"sourceStatus"},{"surface":"home","entry":"181103-all-html","label":"181103 HTML","present":true,"href":"/resources/fluid-181103-html/index.html","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"home","entry":"181103-522-bank","label":"522 material bank","present":true,"href":"/modules/question-bank.html?focus=181103-material-extracted#questionBanksList","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"home","entry":"real-exam-current","label":"real exams","present":true,"href":"/modules/real-exams-dynamic.html?edge_refresh=round358-181103-522-html-practice-release-20260616&from=round358-home-shortcut","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""},{"surface":"home","entry":"private-video-status","label":"private video status","present":true,"href":"/resources.html?from=round358-home-shortcut#sourceStatus","hrefOk":true,"safeHref":true,"visibleTextOk":true,"ariaLabelOk":true,"copyOk":true,"ariaControls":""}] |
| entry-hrefs-avoid-download-viewer-raw-and-local-paths | PASS | [] |
| resources-focus-mobile-grid-and-touch-targets-static | PASS | {"desktopColumns":4,"tabletColumns":2,"mobileColumns":1,"minTouchHeightPx":92,"focusVisible":true} |
| home-focus-mobile-grid-and-touch-targets-static | PASS | {"desktopColumns":4,"mobileColumns":1,"minTouchHeightPx":52,"focusVisible":true} |
| private-video-status-target-is-programmatically-reachable | PASS | {"sourceStatusFound":true,"resourcesPrivateVideoControls":"sourceStatus"} |
| 181103-ledgers-confirm-direct-html-no-viewer-download-or-local-path | PASS | {"materialPageCount":38,"htmlPassCount":38,"htmlContentMapCount":38,"htmlContentStartIdCount":38,"htmlBinaryHrefCount":0,"htmlViewerDownloadHrefCount":0,"htmlIframeEmbedObjectCount":0,"htmlLocalPathLeakCount":0,"sourceFileCount":38,"indexedMaterialCount":38,"directHtmlPassCount":38,"sourceParityForbiddenHrefCount":0,"sourceParityViewerWrapperMarkerCount":0,"sourceParityEmbeddedViewerElementCount":0} |
| 522-material-question-entry-is-backed-by-complete-separated-bank | PASS | {"extractedQuestionCount":522,"questionLedgerTotal":522,"sourceHtmlQuestionCount":522,"sourceAnchorFoundQuestionCount":522,"extractedNoRawDownloads":true,"extractedNoLocalPathLeak":true,"extractedNoOriginalAnswerClaim":true} |
| real-exam-entry-keeps-current-source-granularity-counts | PASS | {"sourceAtomicQuestionCount":325,"groupedSectionCount":68,"groupedWebQuestionIdCount":217,"routeFamilyTotal":30,"realExamBridgeMaterialPages":38,"round319ForbiddenHrefCount":0,"round319ForbiddenWrapperTokenCount":0} |
| private-video-entry-stays-status-not-production-recovery-claim | PASS | {"privateVideoFmPrivateMediaR2Ready":false,"privateVideoProductionRecoveryEligible":false,"r2ProductionPrivateVideoRecovery":false,"productionBlockersEligible":false} |

## 边界

- 这是静态 DOM/CSS/账本审计，不是浏览器截图或真实账号 QA。
- 私有视频入口只证明状态可发现和 blocker 文案清晰；没有解除 `FM_PRIVATE_MEDIA` R2 binding 时，不宣称生产恢复。
- 181103 入口必须保持站内 HTML 内容和题库/真题回流语义，不引入原始文件下载、viewer 壳、raw 路由或本机路径。
