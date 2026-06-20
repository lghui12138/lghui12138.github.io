# Round342 Learning Discovery Routes

版本：`round342-learning-discovery-routes-20260615`

Round342 检查学生端实际登录首页、题库页、练习页和 edge 学习工作台是否能直接发现 `181103`、历年真题、公式、错题和私有课程。

## 摘要

- 检查项：6/6
- 页面入口：3
- 搜索意图：5/5
- unsafe href：0

## 页面入口

| 页面 | 五类入口 | 可见提示 |
|---|---:|---:|
| student-home | 5/5 | 5/5 |
| question-bank | 5/5 | 3/3 |
| practice | 5/5 | 4/4 |

## 搜索意图

| 查询 | 状态 | 首位结果 | href |
|---|---|---|---|
| 181103 | PASS | 181103 资料题库与练习入口 | /modules/question-bank.html?focus=181103-material-extracted#questionBanksList |
| 历年真题 | PASS | 历年真题新版入口 | /modules/real-exams-dynamic.html?edge_refresh=round402-server-health-production-boundary-20260619&from=round342-home-search |
| 公式 | PASS | 公式回查表 | /index-complete.html#formula-checklist |
| 错题 | PASS | 错题订正入口 | /index-complete.html#tabsW |
| 私有课程 | PASS | 私有课程状态入口 | /resources.html?from=round342-home-search-private-course#sourceStatus |

## 机器检查

| 检查 | 状态 |
|---|---|
| round342-visible-route-sections-exist | PASS |
| round342-visible-anchors-cover-five-intents | PASS |
| round342-search-index-ranks-discovery-routes | PASS |
| round342-edge-workbench-has-visible-quicklinks-and-search-fallback | PASS |
| round342-hrefs-stay-in-site-and-not-raw-viewer-local | PASS |
| round342-private-course-stays-status-boundary | PASS |

## 边界

- 只验证内部 APFS 克隆上的静态页面、JS 和数据索引。
- 私有课程入口只指向账号状态和 `FM_PRIVATE_MEDIA` R2 边界，不声明生产恢复。
- 181103 入口保持站内 HTML / 题库 / 真题回流，不引入下载、viewer、raw 或本机路径。
