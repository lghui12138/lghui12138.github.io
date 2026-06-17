# 私有视频管理与删除 Runbook

本页记录专属课视频管理的验收边界。它不是账号或密钥存放处，不应写入密码、cookie、token 或 Cloudflare secret。

当前源码 gate 目标：`round322-181103-quality-private-video-admin-20260614`。本轮继续保留管理可见状态、删除预检和验收边界，并把 lghui.top 公开壳、pages.dev 认证源站、真实 QA 账号 readiness、双域证明、私有视频 blocker、真题原文 325/68/217、答案 PDF 边界、源码/生产同步证明、181103 全 HTML 内容页、411 个资料内题库、资源页 workbench 和 Round321 发布 readiness 拆成可审计分面；只有真实账号浏览器 gate 通过的部分才能写真实账号已验收，缺 FM_PRIVATE_MEDIA 时仍不能声明私有视频生产恢复。

当前线上待验收版本为 `round322-181103-quality-private-video-admin-20260614`；只有完成公开壳同步、Pages 部署、`lghui.top` proof、浏览器入口验证、`FM_PRIVATE_MEDIA` R2 binding 和真实教师/学生账号 QA 后，才能把私有视频生产恢复写成已通过。

## 生产面分工

- 公共入口：`https://lghui.top`，用于确认外层入口、跳转和学生可见路径。
- 认证源站：`https://lghui-fluid-learning.pages.dev`，用于教师后台、真实账号登录和私有视频 API。
- 元数据主存储：`FM_AUDIT` KV。
- 私有媒体与元数据 fallback：`FM_PRIVATE_MEDIA` R2 binding。

## 当前故障判定

如果 `node tools/check-cloudflare-pages-private-video-bindings.mjs --json` 显示：

- `production.hasAuditKv: true`
- `production.hasPrivateMediaR2: false`

则说明后台代码可以展示诊断、列表和 dry-run 预检，但上传、发布、真正改授权、下架，以及 KV 受限时的删除清理都可能被生产环境绑定阻塞。此时不能宣称私有视频管理完全恢复。

生产恢复的最低条件必须同时满足：

- Cloudflare Pages Production 绑定存在 `FM_AUDIT` KV。
- Cloudflare Pages Production 绑定存在 `FM_PRIVATE_MEDIA` R2 binding。
- 真实教师账号能打开教师后台并完成私有视频管理浏览器 gate。
- 验收报告明确区分“本地 mock/static 已通过”和“真实账号生产已通过”。

只要缺 `FM_PRIVATE_MEDIA R2 binding 和真实教师账号浏览器验收` 中任一项，报告只能写“UI/API 已硬化，生产恢复仍阻塞”，不能写“私有视频管理已恢复”。

## 教师后台应该显示什么

教师进入 `teacher-panel?view=resources#private-videos` 后应能看到：

- “元数据写入”状态。
- “R2 fallback”状态，缺绑定时显示 `FM_PRIVATE_MEDIA 未绑定`。
- “复制诊断”按钮，诊断只包含 binding 与写入健康，不包含账号或密钥。
- 动作 readiness：上传发布、保存授权、下架、删除上传课。
- 每个删除、下架、授权、发布按钮在禁用或受限时必须能看到原因；原因应来自同一套 action readiness，而不是只有隐藏 JSON。
- 每节课的行内状态必须可见展示授权、发布、下架、删除四类操作的 `ready` / `limited` / `blocked` 结果；按钮 `title` 或禁用态只是辅助，不能替代页面文案。
- 删除按钮在可尝试时必须先执行 dry-run 预检，再展示课程 ID、状态、分段、授权和缺片数。
- 删除最终执行前必须再输入完整课程 ID；前端只能把完全一致的课程 ID 作为 `confirmCourseId` 发送，后端收到的 `confirmCourseId` 不等于路径课程 ID 时必须返回 `confirm_course_id_mismatch`，不能发出真实删除请求。
- 删除确认必须明确写出“永久删除专属课”和“不可恢复”；`/_edge-admin` 和 `teacher-panel.html` 都不能回到只读列表或旧的含糊确认。

无真实凭据或真实账号 QA 尚未就绪时，也可以打开 `private-video.html` 做源码级管理合同检查。该页只能读取同源 `/api/admin/private-videos?includeArchived=1&refresh=1&writeProbe=1`，失败时仍必须可见显示：

- `FM_PRIVATE_MEDIA R2 production binding` 和真实教师账号浏览器 QA 是生产恢复 blocker。
- list、upload/publish、change-access、archive、delete dry-run、delete-course 六类动作的 `ready` / `limited` / `blocked`。
- 每个按钮的 `data-pv-disabled-reason` 和行内 `data-pv-row-action-reasons`。
- 删除必须先请求 `delete?dryRun=1&writeProbe=1`；dry-run 后确认“永久删除专属课”和“不可恢复”。
- 真删前必须输入完整课程 ID；前端只发送 `{confirmCourseId}`，课程 ID 不一致时不发送真实删除请求，后端仍以 `confirm_course_id_mismatch` 兜底。

## 动作 readiness 矩阵

| 动作 | 教师端应显示 | 缺 `FM_PRIVATE_MEDIA` 时 | 可接受证明 |
|---|---|---|---|
| 列表刷新 | 课程列表、静态/动态数量、存储诊断 | 仍可显示列表与 blocker | `check-private-video-management-browser` 看到 `list: ready` |
| 上传发布 | 上传按钮和发布状态 | 标成 storage-dependent 或 blocked，不能写 productionReady | R2 绑定检查通过后再跑真实账号浏览器 gate |
| 保存授权 | 重复保存当前授权可用，真正改给其他学生需写入健康 | 写入 blocked 时只允许 no-op 授权确认 | 本地 smoke 覆盖 same-student no-op |
| 下架归档 | 下架按钮与 readiness | 写入 blocked 时禁用并显示修复原因 | 真实账号 gate 或本地 mock 的 archive readiness |
| 删除上传课 | dry-run、课程 ID、缺片、确认文案、`confirmCourseId` 后端强校验 | 删除预检可解释 blocker；不能静默失败 | 本地 smoke 覆盖 DELETE 清 KV/R2 与 mismatch 409，生产需 R2 binding |

按钮文案必须把 `FM_PRIVATE_MEDIA` 缺失表达成生产 blocker：缺 R2 时，上传、发布、真正改授权、下架和存储清理不能声明为生产恢复；删除只能按 dry-run 结果受限尝试。

教师端、API 和 release gate 必须使用同一套 readiness 词：`ready`、`limited`、`blocked`。如果页面按钮状态和 `/api/admin/private-videos?includeArchived=1&refresh=1&writeProbe=1` 的 action readiness 不一致，本轮不能发布为“私有视频管理已恢复”。

## 本地 mock 验收边界

本地 mock/smoke 不使用真实账号或 Cloudflare 凭据。它必须覆盖：

- 学生账号调用 `/api/admin/private-videos` 和课程删除接口时返回 `admin_required`。
- 教师账号用 `DELETE /api/admin/private-videos/course/:courseId` 能删除动态上传课。
- 删除后 KV/R2 分片和元数据被清理，学生端 `/api/private-videos/:id/status` 隐藏为 `404`。
- KV 写入受限但 R2 fallback 可写时，list/upload/publish/access/delete 仍按 readiness 工作；生产缺 R2 binding 时只显示明确 gate，不能宣称完全恢复。

无真实凭据的页面/路由静态门禁：

```bash
node tools/check-private-video-management-mock.mjs --json
```

这条命令只读源码和 runbook，不读取 `.auth-browser.env`，不登录生产账号，不上传/删除真实课程。它证明课程级 routes、按钮 selector、readiness 词、dry-run 删除预检、课程 ID 输入确认、刷新/重试入口和浏览器 gate 的“错误 ID 取消删除”探针仍存在。

通过这条命令只说明源码级 mock/static gate 通过；若生产仍缺 `FM_PRIVATE_MEDIA` 或真实教师账号验收，最终报告必须继续写 blocker。

## Cloudflare 绑定修复步骤

1. 在 Cloudflare Pages 项目 `lghui-fluid-learning` 的 Production 环境中添加 R2 binding。
2. 变量名必须是 `FM_PRIVATE_MEDIA`。
3. 绑定到私有媒体桶；对象前缀按代码约定使用 `private/videos/`。
4. 保存后重新部署或触发 Production 环境刷新。
5. 重新运行：

```bash
node tools/check-cloudflare-pages-private-video-bindings.mjs --json
```

验收目标是 `production.hasPrivateMediaR2: true`。

## 真实账号验收

真实账号浏览器验证需要本机具备：

- `AUTH_BROWSER_TEACHER_USER` 或 `FLUID_AUTH_TEACHER_USER`
- `AUTH_BROWSER_TEACHER_PASSWORD` 或 `FLUID_AUTH_TEACHER_PASSWORD`
- `AUTH_BROWSER_STUDENT_USER` 或 `FLUID_AUTH_STUDENT_USER`
- `AUTH_BROWSER_STUDENT_PASSWORD` 或 `FLUID_AUTH_STUDENT_PASSWORD`
- 生产验收还应提供 expected QA teacher/student username。

先运行：

```bash
node tools/check-fluid-auth-env-readiness.mjs --json --production --require-private-video
```

只有该脚本 `ok: true`，才可以继续运行：

```bash
NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
node tools/check-private-video-management-browser.mjs --production --json
```

如果 readiness 缺凭据，本轮只能报告“公开/未登录安全证明”和“环境阻塞”，不能写成真实账号已验证。
