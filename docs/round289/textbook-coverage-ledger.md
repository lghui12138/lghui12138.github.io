# Round289 教材覆盖账本

## 范围

本轮只核对两本教材整理稿和覆盖账本：

- 吴望一《流体力学（第二版）》
- 王洪伟《我所理解的流体力学》

账本只记录教材章节、PDF 页码线索、式号、改写卡和覆盖缺口，不复制教材 PDF 正文，也不写入本机 OCR 路径。

## 当前可支撑部分

- 整书 OCR 对照：`data/fluid-textbook-full-compare-audit.json`
- 整书 OCR 对照 gzip：`data/fluid-textbook-full-compare-audit.json.gz`
- 知识点/公式覆盖账本：`data/fluid-textbook-formula-match-audit.json`
- 知识点/公式覆盖账本 gzip：`data/fluid-textbook-formula-match-audit.json.gz`

整书对照结果：

- 两本书合计 PDF 页数：916
- OCR 页对照：916/916
- 小节标题对照：232/232
- weak/pending 小节：0/0
- 本机路径泄露：0

知识点/公式覆盖结果：

- 知识点总数：202
- 已有教材补充卡的知识点：88
- 吴望一支持知识点：74
- 王洪伟支持知识点：41
- 双教材同时支持知识点：27
- 有公式索引的知识点：128
- 有公式索引且已有教材卡的知识点：84
- 有公式索引且已有原书式号的知识点：79

真题证据矩阵侧：

- aligned split 真题：316
- 吴望一候选链接：316
- 王洪伟候选链接：281
- 双教材候选链接：281
- 双教材强链接：270

## 覆盖缺口

- 未有任何教材卡的知识点：114
- 未有吴望一支持的知识点：128
- 未有王洪伟支持的知识点：161
- 双教材都未覆盖的知识点：175
- 有公式索引但没有教材卡的知识点：44
- 有公式索引但缺原书式号的知识点：49

## 补充队列

下一步补充队列写在 `data/fluid-textbook-formula-match-audit.json.nextSupplementQueue`：

- P1：有公式索引但没有教材卡的知识点，先补章节/页码线索。
- P2：已有吴望一或其他卡但缺王洪伟候选的知识点，补王洪伟候选或保留缺口说明。
- P3：已有教材卡但缺原书式号的公式点，补式号或标注为网页公式索引推导式。

## 门禁

本轮把教材覆盖账本接入两层检查：

- `tools/validate-site-content.mjs`：要求整书对照通过、两个 gzip sidecar 存在、知识点/公式账本通过、无本机路径和 PDF 正文复制标记。
- `tests/edge-fluid-upgrade-check.js`：要求 916/916 OCR 页、232/232 小节、gzip 与 JSON 完全一致、公式覆盖账本含缺口队列和真题证据矩阵双教材计数。
