# Round324 181103 题库可发现性审计

- 版本：round324-181103-question-discovery-20260615
- 生成命令：`node tools/check-round324-181103-question-discovery.mjs --write --json`
- 题库总数：522
- 资源入口可发现：522/522
- 题库入口可发现：522/522
- 来源 HTML 锚点可发现：522/522
- 可刷全集 / 历史 show 候选 / 回源复核 / OCR 复核 / 隐藏复核 / 章节待复核：522 / 119 / 522 / 379 / 24 / 181
- 乱码/EMBED/CID/font noise 标记与来源兜底：98/98 标记，98/98 来源兜底；裸噪声 0
- 缺失来源 HTML / 缺失锚点 / 桶异常：0 / 0 / 0

## 三层入口

1. 资源入口：`/resources.html#round323ResourceFinder`，对应 `resources.html` 中的 Round323 finder 与 181103 返回路径。
2. 题库入口：`/modules/question-bank.html?focus=181103-material-extracted#questionBanksList`，对应 `modules/question-bank.html` 和 `question-banks/index.json` 的 `181103-material-extracted` 条目。
3. 来源 HTML：每题使用 `sourceHtmlUrl` 回到 `/resources/fluid-181103-html/materials/*/index.html#page-*`；本轮 522 个锚点全部存在。

## 可复盘路径

- all-material practice：从 `/modules/question-bank.html?focus=181103-material-extracted#questionBanksList` 进入“练习 181103 全部 522 题”或“来源页图模式刷全部 522 题”；可刷全集 522 题。
- source-first：source-first 不再拦截做题入口；它是 522 题的回源质量提示，每题用“打开来源 HTML 页”回到页图。
- OCR：OCR 提示题仍在 522 可刷题入口中；不可靠文本只作定位辅助，OCR 提示 379 题。
- hidden：hidden 不再让做题入口归零；hidden 提示题仍在 522 入口中，并要求来源 HTML 锚点；hidden 24 题。
- chapter pending：章节待复核是叠加标记，仍有题库入口和来源 HTML；章节待复核 181 题。

## 边界

- 本账本只证明 522 个 181103 资料内题可从资源入口、题库入口、来源 HTML 发现。
- 它不把资料题冒充历年真题原卷，也不提供 PDF/PPT/DOC/ZIP 原件下载证明。
- Round324 未修改 `resources.html`；现有 Round323 resource finder 已满足发现性审计。

## 产物

- `data/fluid-round324-181103-question-discovery.json`
- `data/fluid-round324-181103-question-discovery.json.gz`
- `docs/round324/181103-question-discovery.md`
