# 流体力学站点内容补全交接

更新时间：2026-05-20 16:01 Asia/Shanghai

## 内容来源

- 最新笔记 Markdown：`/Volumes/mac_2T/output/06_autopilot_outputs/codex_mainline/fluid_notes_2026-05-03/中国海洋大学流体力学笔记_逐页校录_round117.md`
- 站内可复现笔记源：`source-materials/fluid-mechanics/中国海洋大学流体力学笔记_逐页校录_round117.md`
- 精修笔记 文档：`/Volumes/mac_2T/output/fluid_notes_work/中国海洋大学流体力学笔记_逐页校录_round117_精修公式版.docx`
- 精修真题 文档：`/Volumes/mac_2T/output/fluid_notes_work/中国海洋大学流体力学2000-2024真题_精修公式版_当前最新版.docx`
- 课件 课件：第 1、2、3、5、6、8 章流体力学课件
- 当前部署仓库：`/Volumes/mac_2T/work/github/lghui12138.github.io`
- 远端仓库：`git@github.com:lghui12138/lghui-fluid-learning-private.git`
- 部署方式：Cloudflare Pages / ESA 边缘门禁沿用现有配置。

## 已上线内容口径

- 知识点库：`data/fluid-knowledge-points.json` 已更新为 `course-notes-round117-2026-05-04`，共 202 页、10 类，来源为 round117 逐页校录笔记。
- 站内资料源：`data/fluid-source-materials.json` 已纳入 9 个源文件，包括 6 套 课件、最新版 Markdown 笔记、round117 精修笔记文档、精修真题文档；最新版笔记同步到 `resources/fluid-sources/fluid-notes-current.md` 和 `resources/fluid-sources/fluid-notes-current.docx`。
- 章节体系：`data/fluid-chapter-sections.json` 覆盖 6 章、182 个课件小节；每个小节都有正文要点、首屏精修要点、笔记支撑、真题练习、公式摘记、课件证据、节级精讲、复习阶梯和微训练。
- 知识点反链：`data/fluid-knowledge-links.json` 覆盖 202 页知识点，当前有 1142 条课件小节反链、1586 条真题练习反链；首页和边缘极速首页也显示同一口径。
- 公式体系：`data/fluid-formula-index.json` 当前 2183 条公式，其中 2080 条已关联真题；公式训练、公式应用轻量包和复习计划均已按这个口径重建。
- 真题主库：`question-banks/真题_中国海洋大学_2000-2024_fixed.json` 保留 289 条原始来源行，0 条占位/缺解析；其中 285 道为可练真题，4 条为源材料说明行。
- 真题分年懒加载：`question-banks/real-exams-index.json` 与 `question-banks/real-exam-years/*.json` 覆盖 24 个年份、285 道可练题，保留线上性能优化。
- 真题资料源包：`data/fluid-question-source-packs.json` 为 285 道可练真题全部接入精修真题 文档、最新版 笔记、精修笔记 文档、分年题库、关联笔记、公式/方法、课件小节、答案证据和核对路线。
- 知识点页面：`modules/knowledge-detail.html` 使用侧边目录、页目录和题库入口；卡片可跳真题页、练习页、章节页和资料源。
- 资源中心：`resources.html` 从资料源 JSON 动态读取 最新版 标签和站内资源，不写死旧版本。
- 安全入口：未登录状态仍由 Cloudflare Functions 拦截，数据、资料源、模块页面都需要会话。
- 学生注册：`/_edge-register` + `/api/auth/register` 默认只开放 `chenlei`、`anxin`、`sunruze` 自助注册；`qi` 保留为预配置/专属课账号，不开放自助注册。
- 学生准入：默认只有 `qi`、`chenlei`、`anxin`、`sunruze` 能看通用内容；其他学生默认锁住。老师可在 `teacher-panel.html` 学生管理页通过 `/api/admin/student-access` 执行 `unlock` / `lock` / `remove` / `allow`。版本 3 会忽略旧 KV 里误写到 `lockedUsers` 的默认四人；从现在开始，老师主动锁默认四人会写入 `lockedDefaultUsers` 并立即生效，旧会话会在下一次请求被拦下。
- 教师账号：老师可在 `teacher-panel.html` 设置页通过 `/api/auth/change-password` 修改自己的站点登录密码，密码以 PBKDF2 哈希写入 KV；同账号一旦有 KV 新密码，旧环境变量密码不再作为备用入口生效。后台监控时间统一显示北京时间，已登录账号/IP 置顶，陌生 IP 保留在异常画像里。
- 专属视频：`qi` 的专属课只给 `qi` 和教师账号；`chenlei`、`anxin`、`sunruze` 能看通用内容，但不能看到或直链访问 `qi` 的专属视频。老师上传本地一对一视频时只能指定 1 个学生，多段视频会合并为同一节课连续播放。同一 `courseId` 的所有分段必须属于同一学生，旧 `private-video:*` entitlement 不再能绕过一对一 ACL。
- 专属课总控：`/api/admin/private-videos` 会返回课程级 `courses`/`staticCourses`，`teacher-panel.html` 的“专属课权限总表”可看到每节课授权学生、分段数、发布状态和存储类型；错传或需要撤回时调用 `/api/admin/private-videos/course/:courseId/archive` 整节下架。下架后的专属课从学生目录消失，直打 `status`/`stream` 也隐藏。
- 专属课改授权：老师可在“专属课权限总表”修改一节上传课的授权学生；后端调用 `/api/admin/private-videos/course/:courseId/access`，一次性更新同一 `courseId` 的全部分段。改授权后旧学生目录和直链立即失效，新学生登录后才能看到和播放。

## 复跑方式

```bash
cd /Volumes/mac_2T/work/github/lghui12138.github.io

export FLUID_NOTES_MD='/Volumes/mac_2T/output/06_autopilot_outputs/codex_mainline/fluid_notes_2026-05-03/中国海洋大学流体力学笔记_逐页校录_round117.md'
export FLUID_NOTES_文档='/Volumes/mac_2T/output/fluid_notes_work/中国海洋大学流体力学笔记_逐页校录_round117_精修公式版.docx'
export FLUID_EXAM_文档='/Volumes/mac_2T/output/fluid_notes_work/中国海洋大学流体力学2000-2024真题_精修公式版_当前最新版.docx'
export FLUID_EXAM_MD='/Volumes/mac_2T/work/github/lghui12138.github.io/resources/fluid-mechanics/exam-archives/ouc-fluid-mechanics-2000-2024-complete.md'

node tools/build-site-content.mjs
node tools/build-fluid-source-materials.mjs
node tools/build-fluid-formula-index.mjs
node tools/build-fluid-chapter-sections.mjs
node tools/build-fluid-source-search-index.mjs
node tools/build-fluid-formula-drills.mjs
node tools/build-fluid-formula-applications.mjs
node tools/build-fluid-exam-topic-map.mjs
node tools/build-real-exam-index.mjs
node tools/build-fluid-year-exam-packs.mjs
node tools/build-fluid-year-mastery.mjs
node tools/build-fluid-exam-type-packs.mjs
node tools/build-fluid-chapter-source-packs.mjs
node tools/build-fluid-section-source-packs.mjs
node tools/build-fluid-chapter-exam-packs.mjs
node tools/build-fluid-chapter-mastery.mjs
node tools/build-fluid-section-remediation.mjs
node tools/build-fluid-question-remediation.mjs
node tools/build-fluid-question-source-packs.mjs
node tools/build-fluid-knowledge-links.mjs
node tools/build-fluid-knowledge-remediation.mjs
node tools/build-fluid-knowledge-card-packs.mjs
node tools/build-fluid-review-plan.mjs
node tools/build-fluid-mistake-diagnostics.mjs
node tools/build-fluid-home-search-index.mjs
node tools/validate-site-content.mjs
```

若换机器，优先更新上面四个环境变量；课件路径可用 `FLUID_CHAPTER_1_PPTX`、`FLUID_CHAPTER_2_PPTX`、`FLUID_CHAPTER_3_PPTX`、`FLUID_CHAPTER_5_PPTX`、`FLUID_CHAPTER_6_PPTX`、`FLUID_CHAPTER_8_PPTX` 指定。

## 发布检查

- `node tools/validate-site-content.mjs`
- `node tools/smoke-student-access.mjs`
- `git diff --check`
- 全量 JSON 解析
- 本地 HTTP 烟测知识点页、资源中心、最新版 笔记、章节 JSON、fixed 主库和分年真题索引
- 上线后再用未登录请求确认 `/knowledge#1-4`、模块页、数据 JSON、资料源 笔记 都不能直接泄露内容。
