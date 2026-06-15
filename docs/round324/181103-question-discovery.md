# Round324 181103 题库可发现性审计

- 版本：round324-181103-question-discovery-20260615
- 生成命令：`node tools/check-round324-181103-question-discovery.mjs --write --json`
- 题库总数：411
- 资源入口可发现：411/411
- 题库入口可发现：411/411
- 来源 HTML 锚点可发现：411/411
- 默认可练净池 / 历史 show 候选 / 回源复核 / OCR 复核 / 隐藏复核 / 章节待复核：0 / 119 / 411 / 268 / 24 / 181
- 默认练习 OCR/公式乱码：0；已挡出默认练习的 OCR/公式复核题：268
- 缺失来源 HTML / 缺失锚点 / 桶异常：0 / 0 / 0

## 三层入口

1. 资源入口：`/resources.html#round323ResourceFinder`，对应 `resources.html` 中的 Round323 finder 与 181103 返回路径。
2. 题库入口：`/modules/question-bank.html?focus=181103-material-extracted#questionBanksList`，对应 `modules/question-bank.html` 和 `question-banks/index.json` 的 `181103-material-extracted` 条目。
3. 来源 HTML：每题使用 `sourceHtmlUrl` 回到 `/resources/fluid-181103-html/materials/*/index.html#page-*`；本轮 411 个锚点全部存在。

## 可复盘路径

- default：从 `/modules/question-bank.html?focus=181103-material-extracted#questionBanksList` 进入，默认练习净池 0 题；181103 当前全部按来源 HTML 页图回源复核，不把历史 OCR 候选直接放入默认练习。
- source-first：从同一题库入口进入“查看/练习全部 411 题（含 OCR 复核）”，每题用“打开来源 HTML 页”回到页图；回源复核 411 题。
- OCR：从同一题库入口进入“查看/练习全部 411 题（含 OCR 复核）”，再按题卡的“打开来源 HTML 页”回查；OCR 复核 268 题。
- hidden：隐藏复核题不进默认练习，但保留在全部 411 模式和来源 HTML 锚点中；隐藏复核 24 题。
- chapter pending：章节待复核是叠加标记，仍有题库入口和来源 HTML；章节待复核 181 题。

## 边界

- 本账本只证明 411 个 181103 资料内题可从资源入口、题库入口、来源 HTML 发现。
- 它不把资料题冒充历年真题原卷，也不提供 PDF/PPT/DOC/ZIP 原件下载证明。
- Round324 未修改 `resources.html`；现有 Round323 resource finder 已满足发现性审计。

## 产物

- `data/fluid-round324-181103-question-discovery.json`
- `data/fluid-round324-181103-question-discovery.json.gz`
- `docs/round324/181103-question-discovery.md`
