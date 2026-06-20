# Round348 Search Alias Coverage

版本：`round348-search-alias-coverage-20260615`

Round348 只审计学习发现 / 搜索别名覆盖，不改首页、不重建搜索索引。检查输入为 `data/fluid-home-search-index.json`、`index-complete.html`、`resources.html`、`modules/question-bank.html`。

## 摘要

- 别名命中：7/7
- failed：0
- recommendations：1
- merged search entries：776

## 关键词覆盖

| 查询 | 状态 | 站内入口 | href | exact phrase hits |
|---|---|---|---|---:|
| 181103去哪了 | PASS | 181103 资料题库直选 | /modules/question-bank.html?focus=181103-material-extracted#questionBanksList | 2 |
| 资料题库 | PASS | 181103 资料题库直选 | /modules/question-bank.html?focus=181103-material-extracted#questionBanksList | 1 |
| 不能下载 | PASS | 181103 全资料 HTML 总表 | /resources/fluid-181103-html/index.html | 1 |
| 历年真题新版 | PASS | 历年真题新版直选 | /modules/real-exams-dynamic.html?edge_refresh=round411-server-progress-monotonic-no-drift-20260620&from=round342-intent-real-exam | 1 |
| round264不是当前 | PASS | 公式条件直选 | /index-complete.html#formula-checklist | 0 |
| 私有课程状态 | PASS | 私有课程 / 专属课状态直选 | /resources.html?from=round342-intent-private-course#sourceStatus | 1 |
| FM_PRIVATE_MEDIA | PASS | 私有课程 / 专属课状态直选 | /resources.html?from=round342-intent-private-course#sourceStatus | 1 |

## Failed

- 无 failed alias。

## Recommendations

- `round264不是当前`：No exact phrase hit for "round264不是当前"; current coverage depends on alias terms: round264 / 公式条件 / 公式回查 / 适用条件 / 边界条件 / 单位方向.

## 机器检查

| 检查 | 状态 |
|---|---|
| round348-required-inputs-readable | PASS |
| round348-search-index-has-current-entries | PASS |
| round348-required-aliases-hit-in-site-entry | PASS |
| round348-page-evidence-supports-alias-routes | PASS |
| round348-no-unsafe-entry-targets-for-required-aliases | PASS |
| round348-boundary-phrases-remain-visible | PASS |

## 边界

- 181103 只验证站内 HTML / 资料题库 / 真题回流入口，不引入原件下载、viewer、raw 或本机路径。
- `FM_PRIVATE_MEDIA` 只作为 R2 blocker / 账号状态边界，不声明生产恢复。
- `round264不是当前` 只路由到公式适用条件入口；本轮不改首页文案。
