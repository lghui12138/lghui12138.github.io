# 学生端已登录工作流 QA 清单

日期：2026-05-24
范围：学生端登录后首页工作台、练习、题库、资源、知识升级、集训页的可用性回归。
安全边界：不获取、不猜测、不记录账号密码；人工项由已有授权测试账号执行。不得修改 VPN、proxy、DNS、route、system proxy 或 env proxy 状态。

## 目标

这份清单用于防止“公开入口能打开，但学生登录后点进去空白、无数据、无焦点、无法继续练习”的回归。自动项只覆盖无需真实凭据的静态和合成 smoke；真实登录后的页面渲染、交互、焦点和授权资源必须人工或半自动浏览器验证。

## 源码依据

- `js/security/auth-guard.js`：受保护 HTML 的登录守卫、`next` 回跳、`/api/auth/me` 周期校验、失效后重定向。
- `index-complete.html`：学生登录后的首页入口、round263/round264 学习入口、搜索索引和边缘会话同步。
- `js/edge-fluid-learning-upgrade.js`：首页学习工作台 7 个 tab、`tabpanel`、roving focus、公式/题目路线/复习本交互。
- `modules/real-exams-dynamic.html`：历年真题索引、筛选、分年预热、进入 `modules/practice-dynamic.html` 的 `currentRealExam` 工作流。
- `modules/practice-dynamic.html` 和 `practice.html`：真实题库练习、简易练习、答题、错题、进度和本地存储。
- `resources.html`：资源中心、`/resources.json`、`/data/fluid-source-materials.json`、`/api/private-videos`、受保护播放器和播放进度。
- `modules/fluid-intensive-training.html`：章节集训、五步训练、公式卡、真题起笔、答案核对、教材入口。
- `modules/knowledge-upgrade-2026.html` 与 `modules/knowledge-detail.html`：知识升级、公式条件、知识点全库和跨页入口。
- 既有记录：`output/qa/student-workbench-a11y-20260524.md`、`output/qa/student-workbench-browser-a11y-20260524.md`。

## 无需凭据的自动检查

每次提交前至少运行下列只读命令。任何 FAIL、非 0 退出码、JSON 解析失败、受保护静态资源误放行、私有资源泄漏都阻断发布。

| 检查 | 命令 | 通过标准 | 频率 |
|---|---|---|---|
| 登录和受保护资源合成 smoke | `node tools/smoke-student-access.mjs` | 输出 `ok: true`，学生静态 JSON/资源可访问，缺失账号、锁定用户、私有视频越权和 private-media traversal 均 fail closed | 每次触及 auth、middleware、资源、题库、私有课 |
| 站点内容和引用完整性 | `node tools/validate-site-content.mjs` | `jsonParseFailures: []`、`missingRequired: []`、`knowledgeScriptErrors/realExamScriptErrors/practiceScriptErrors: []` | 每次触及 data、HTML、题库、资源索引 |
| 首页工作台静态回归 | `node tests/edge-fluid-upgrade-check.js` | `FAIL 0`；WARN 需逐条确认不是新增风险 | 每次触及 `index-complete.html`、`js/edge-fluid-learning-upgrade.js`、相关 CSS/data |
| 集训页数据覆盖 | `node tools/audit-fluid-intensive-training.mjs` | 输出 `ok: true`，6 章、公式卡、真题起笔、答案核对、教材卡均有覆盖 | 每次触及集训页或其 data |
| 关键 JS 语法 | `node --check js/security/auth-guard.js`；`node --check js/edge-fluid-learning-upgrade.js`；`node --check tools/smoke-student-access.mjs`；`node --check tools/validate-site-content.mjs` | 全部 exit 0 | 每次触及对应文件或 QA 脚本 |

自动检查不能替代真实登录。它能证明守卫、数据文件、静态脚本和私有资源合成路径没有明显断裂，但不能证明浏览器中登录后的所有 tab、按钮、焦点、播放器和跨页跳转可用。

## 人工登录前置条件

- 使用已有授权学生测试账号，由账号持有人或被授权测试者输入凭据。QA 文档只记录账号角色和权限类型，不记录用户名、密码、cookie、token、session、设备指纹。
- 推荐至少覆盖两个学生权限形态：普通学生、拥有专属私有视频权益的学生。如没有后者，只记录“未覆盖专属视频权益账号”。
- 浏览器建议覆盖桌面 1366px 或 1440px、移动宽度 390px 左右、Safari 或 Chrome 至少一种真实浏览器。
- 打开 DevTools Console 和 Network，只记录错误类别、URL、HTTP 状态和页面可见症状，不粘贴 cookie 或认证头。

## 已登录核心路径

| 路径 | 必查入口 | 关键验收点 | 失败判定 |
|---|---|---|---|
| 登录和深链回跳 | 未登录访问 `/resources.html`、`/modules/real-exams-dynamic.html`、`/modules/knowledge-upgrade-2026.html#round264FormulaChecklist` 后登录 | 登录后回到原 `next` 路径和 hash；无登录页内容闪现；`html[data-auth-pending]` 被移除；退出后再次访问受保护页回登录 | 登录后留在首页且丢 deep link；页面一直隐藏；退出后仍可看保护页 |
| 首页学习工作台 | `/index-complete.html` | 学生欢迎区和工作台出现；`仪表盘/知识路径/题目路线/公式速查/条件回查/站内搜索/复习状态` 7 个 tab 可切换；加载态消失或显示明确 fallback | 工作台空白；tab 按钮无反应；面板 id/ARIA 指向不存在；数据加载失败但无提示 |
| 题目路线 | 首页工作台 `题目路线` | 输入 `弯管 受力`、`Bernoulli 水头`、`Re 相似` 能更新建议；快捷 chip 可选；`加入复习本` 可见并进入复习状态 | 输入后页面卡死；建议不变且无空态；加入复习本无反馈 |
| 公式和条件回查 | 首页工作台 `公式速查`、`条件回查` | 搜索 `伯努利`、`连续方程`、`动量方程`；分类筛选生效；从公式卡进入条件卡；知识页链接能打开 | 搜索框失焦后内容丢失；条件卡为空且没有 fallback；公式链接 404 |
| 复习本 | 首页工作台 `复习状态` | 从知识点、题目路线、公式、条件卡添加复习项；手动记录错题；评分、移除、刷新后仍按本机存储保留 | 本地状态不持久；移除错误项；评分后页面重排导致不可用 |
| 历年真题 | `/modules/real-exams-dynamic.html` | 指标不再是 `--`；年份卡渲染；搜索、年份、题型、考点筛选有效；点击 `开始练习` 跳到 `/modules/practice-dynamic.html?type=real...` 并写入 `currentRealExam` | 年份卡空白；筛选后无空态；点击开始练习无跳转；练习页不知道题库来源 |
| 智能题库练习 | `/modules/practice-dynamic.html?type=real&year=2024` 或从真题页进入 | 题目、选项/填空、解析、下一题、进度、错题/收藏、本地 AI 兜底批改可用；刷新后能恢复合理状态 | 题目一直加载；提交后无结果；上一题/下一题失效；外部 AI 不可用时无本地兜底 |
| 简易练习 | `/practice.html` | 起始卡显示预设题量；选择套题、答题、提交、跳过、上一题、完成页、错题复习、键盘 Enter/左右键可用 | 预设题量为 0；错题复习空状态误报；键盘触发重复提交 |
| 流体力学集训 | `/modules/fluid-intensive-training.html` | 6 章可切换；阶段、题型、章节选择联动；小节练习、核心公式、第一行方程、真题起笔、答案核对、完整答案展开、教材入口均有内容或明确空态 | 任一选择导致整页白屏；完整答案无法展开；链接到真题/知识点 404 |
| 知识升级入口 | `/modules/knowledge-upgrade-2026.html#formula-condition-checklist` | round263/round264 内容、公式条件表、真题入口、资源入口、材料列表渲染；部分 data 失败时仍显示 fallback | hash 丢失；条件表不显示；入口链接回登录循环或 404 |
| 知识点全库 | `/modules/knowledge-detail.html?chapter=3` | 搜索、章节筛选、知识卡、公式、真题链接、当前锚点高亮可用；MathJax 或 formula-lite 不阻塞正文 | 搜索后空白；章节切换不更新；公式超出屏幕遮挡操作 |
| 资源中心 | `/resources.html` | 视频、文档、标签、搜索均渲染；普通文档可打开；无权限私有视频不可见或明确拒绝；有专属权益账号能打开专属视频 | 资源计数为 0 且无说明；文档点击无效；普通学生看见他人专属课 |
| 受保护播放器 | 资源中心视频卡 | 打开后焦点到关闭按钮；播放、暂停、前后跳、音量、倍速、全屏、Esc 关闭、关闭后保存进度；私有视频 HEAD 失败时显示可理解错误 | 模态无法关闭；错误提示泄漏 `/private-media/`、R2、KV、对象 key；加载失败后不能重试 |

## A11y 和焦点专项

- 只用键盘从浏览器地址栏开始 Tab，焦点顺序应能到达登录表单、首页工作台 tab、搜索框、筛选控件、卡片操作、播放器关闭按钮。
- 首页工作台 `role="tablist"` 下，`ArrowLeft`、`ArrowRight`、`Home`、`End` 必须移动当前 tab；活跃 tab `tabindex="0"`，非活跃 tab `tabindex="-1"`；切换后焦点不应丢到 body。
- 所有可见按钮、链接、输入框、`role="button"` 卡片必须有可见焦点和可理解名称。资源页视频/文档卡带 `role="button"` 和 `tabindex="0"`，人工需确认 Enter/Space 是否能触发；不能触发即记为 a11y 失败。
- 弹窗和播放器打开后，初始焦点必须进入弹窗；Esc 能关闭；关闭后不应留下不可见遮罩或阻塞背景滚动。
- 移动宽度下按钮、tab、筛选和播放器控制不应互相遮挡；长公式和长题干必须横向滚动或换行，不能盖住提交按钮。

## 空白页和异常判定标准

下列任一情况按阻断级处理：

- 已登录访问受保护 HTML 后，正文空白超过 5 秒，且没有 loading、empty、error、fallback 文案。
- Console 出现未捕获 `ReferenceError`、`TypeError`、`SyntaxError`、Vue mount 失败、MathJax 阻塞正文渲染。
- Network 中核心 JSON 返回 401/403/404/5xx 后，页面没有保底提示或可返回路径。
- 学生端可见教师端、私有对象路径、R2/KV/storage 细节、`/private-media/` 静态路径或他人专属课。
- 登录失效后继续保留受保护内容，或跳转登录后丢失 `next`/hash。
- 键盘无法提交或关闭关键流程，例如 tab 无法切换、视频模态无法关闭、练习无法提交。

非阻断但必须记录：

- 已知 WARN，例如老 schema、可接受 public shell 历史漂移、可选 fallback data 缺失。
- 某些章节或考点确实无数据，但页面显示了明确空态和替代路径。
- 外部 AI、第三方视频源、浏览器自动播放限制导致的降级，只要本地兜底和提示可用。

## 回归频率

- 每次触及 `functions/_middleware.js`、`js/security/auth-guard.js`、登录页、cookie/session、学生访问策略：跑自动检查全套，并人工覆盖登录、深链回跳、退出、资源权限。
- 每次触及 `index-complete.html`、`js/edge-fluid-learning-upgrade.js`、`styles/edge-fluid-upgrade.css`：跑自动检查全套，并人工覆盖首页工作台 7 个 tab、搜索、复习本、键盘 roving focus。
- 每次触及题库、真题、练习相关 HTML/JS/data：跑 `validate-site-content` 和对应语法检查，并人工覆盖真题页到练习页的跨页流。
- 每次触及资源、私有视频、source materials：跑 `smoke-student-access` 和 `validate-site-content`，并人工覆盖资源搜索、文档打开、视频模态、专属视频权限。
- 每次大批量 data 生成或 round 升级：至少一次桌面和移动真实浏览器已登录走查。
- 发布前最终门禁：自动检查全套 + 1 个普通学生账号人工冒烟 + 如有条件再加 1 个专属视频权益账号。

## 记录模板

每次人工执行后，在 `output/qa/` 新增日期报告，至少记录：

- 测试日期、浏览器、视口、账号角色和权限类型，不记录凭据。
- 自动命令结果和 WARN 解释。
- 已登录路径矩阵，逐项写 `PASS`、`WARN`、`FAIL` 或 `NOT COVERED`。
- Console/Network 异常，记录 URL、HTTP 状态、错误类型和可见症状。
- a11y/focus 检查结论。
- 剩余风险和下轮必须补测的账号/路径。
