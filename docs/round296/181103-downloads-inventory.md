# Round296 181103 Downloads Inventory

版本：`round296-181103-downloads-inventory-20260614`

## 摘要

- 真实下载目录只读核验：38 个文件，165.01 MiB。
- 站内受保护索引：38 个 materialId，30 条学习路线，61 个真题复核任务。
- 类型锁：27 PDF / 6 PPT-or-PPTX / 3 DOC-or-DOCX / 2 ZIP；精确扩展名锁为 doc:1, docx:2, pdf:27, ppt:1, pptx:5, zip:2。
- 隐私边界：公开 JSON 不包含本机绝对路径、不包含原始下载 URL、不复制原件、不把 181103 答案资料当作原卷答案 PDF 证据。

## 文件类型矩阵

| 类型 | 源文件数 | 源大小 | 样例 materialId |
| --- | ---: | ---: | --- |
| pdf | 27 | 132.78 MiB | fluid-181103-01, fluid-181103-02, fluid-181103-03, fluid-181103-10, fluid-181103-12, fluid-181103-13 |
| ppt | 1 | 1.47 MiB | fluid-181103-27 |
| pptx | 5 | 8.82 MiB | fluid-181103-04, fluid-181103-05, fluid-181103-06, fluid-181103-07, fluid-181103-08 |
| doc | 1 | 3.31 MiB | fluid-181103-09 |
| docx | 2 | 0.51 MiB | fluid-181103-28, fluid-181103-29 |
| zip | 2 | 18.11 MiB | fluid-181103-11, fluid-181103-26 |

## 下载目录分组矩阵

| 受保护目录组 | 文件数 | 大小 | 类型 | 对应站内资料组 |
| --- | ---: | ---: | --- | --- |
| 流体力学I课件 | 14 | 12.51 MiB | pdf:14 | 流体力学 I 课件 |
| 流体力学II课件 | 11 | 6.49 MiB | docx:2, pdf:8, ppt:1 | 流体力学 I 课件 / 流体力学 II 湍流资料 / 暑期课件 |
| root-files | 6 | 74.50 MiB | doc:1, pdf:3, zip:2 | 181103 补充资料 / 考研真题/名词解释 / 流体力学 I 课件 / 流体力学 II 湍流资料 |
| 流体力学暑期课ppt | 5 | 8.82 MiB | pptx:5 | 暑期课件 |
| 303中国海洋大学流体力学 | 2 | 62.69 MiB | pdf:2 | 考研真题/名词解释 |

## 站内覆盖

| route family | 路线数 | 覆盖 materialId 数 |
| --- | ---: | ---: |
| byGroup | 5 | 38 |
| byChapter | 6 | 38 |
| byResourceType | 6 | 38 |
| byStudyGoal | 7 | 38 |
| byQuestionType | 6 | 38 |

## 课件与题库线索

- 疑似课件/讲义覆盖：32 个 materialId，覆盖 流体力学 I 课件 / 流体力学 II 湍流资料 / 暑期课件。
- 疑似习题/答案/名词解释覆盖：9 个 materialId；边界：辅助习题、名词解释和答案核对；不升级为原卷答案 PDF 逐字证据。
- 湍流/边界层拓展覆盖：16 个 materialId。

## 仍未覆盖的资料边界

- 本轮只做目录清点、大小/类型 fingerprint 和站内索引覆盖，不读取或公开原文件正文。
- ZIP 仍只保留安全预览与后续解包队列，不输出压缩包内部完整清单。
- 大扫描件仍需后续 OCR/抽页人工复核；本轮不新增公开下载入口。
- 181103 答案类资料只辅助复盘，不替代历年真题页的原文题面和答案证据边界。

## 可复跑命令

```bash
node tools/check-round296-181103-downloads-inventory.mjs --write
```

