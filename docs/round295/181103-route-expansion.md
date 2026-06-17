# Round295 181103 Route Expansion

Version: `round295-181103-route-expansion-20260614`

This artifact enriches the 181103 protected-material study routes from the Round293/Round294 audits. It is metadata-only: it uses material IDs, counts, safe labels, route families, review-task links by ID, and processing queues. It does not expose source files, source filenames, local machine paths, absolute URLs, or raw file access points.

## Summary

- Materials: 38/38
- Study routes: 30/30 across 5 route families
- Review queue: 61 grouped-section tasks tied to 316 source atoms and 61 grouped sections
- Safe coverage: 38/38 materials appear in all five inherited route families
- Source artifacts: data/fluid-181103-study-routes.json, data/fluid-181103-full-material-audit.json, data/fluid-round294-181103-protected-material-digest.json, data/fluid-181103-question-review-queue.json

## Route Families

| Family | Routes | Covered Materials | Review Steps |
| --- | ---: | ---: | ---: |
| byChapter | 6 | 38 | 18 |
| byGroup | 5 | 38 | 15 |
| byQuestionType | 6 | 38 | 12 |
| byResourceType | 6 | 38 | 12 |
| byStudyGoal | 7 | 38 | 21 |

## Group Routes

| Group | Materials | Chapters | Step Count |
| --- | ---: | --- | ---: |
| 流体力学 I 课件 | 16 | 1, 2, 3, 5, 6, 8 | 3 |
| 流体力学 II 湍流资料 | 9 | 1, 2, 3, 5, 6, 8 | 3 |
| 暑期课件 | 7 | 1, 2, 3, 8 | 3 |
| 考研真题/名词解释 | 5 | 1, 2, 3, 5, 6, 8 | 3 |
| 181103 补充资料 | 1 | 3 | 3 |

## Chapter Routes

| Chapter | Materials | Step Count | Sample IDs |
| --- | ---: | ---: | --- |
| 第8章 黏性不可压缩流动 | 21 | 3 | fluid-181103-01, fluid-181103-02, fluid-181103-03, fluid-181103-09, fluid-181103-10 |
| 第1章 流体的物理性质 | 12 | 3 | fluid-181103-01, fluid-181103-02, fluid-181103-03, fluid-181103-04, fluid-181103-05 |
| 第2章 理想流体流动 | 11 | 3 | fluid-181103-01, fluid-181103-02, fluid-181103-03, fluid-181103-06, fluid-181103-07 |
| 第3章 流体运动的基本方程组 | 11 | 3 | fluid-181103-01, fluid-181103-02, fluid-181103-03, fluid-181103-08, fluid-181103-09 |
| 第6章 理想不可压缩流体无旋运动 | 10 | 3 | fluid-181103-01, fluid-181103-02, fluid-181103-03, fluid-181103-09, fluid-181103-10 |
| 第5章 流体的涡旋运动 | 8 | 3 | fluid-181103-01, fluid-181103-02, fluid-181103-03, fluid-181103-09, fluid-181103-10 |

## Review Coverage Hotspots

### By Question Type

| Question Type | Tasks | Source Atoms | Materials |
| --- | ---: | ---: | ---: |
| 图像与流动判断 | 22 | 59 | 31 |
| 计算题 | 19 | 46 | 25 |
| 简答综合 | 9 | 37 | 18 |
| 推导证明 | 4 | 12 | 21 |

### By Chapter

| Chapter | Tasks | Source Atoms | Question Types |
| ---: | ---: | ---: | --- |
| 1 | 29 | 99 | 计算题, 简答综合, 名词解释题, 填空题, 图像与流动判断, 推导证明, 选择题 |
| 6 | 29 | 112 | 计算题, 简答综合, 填空题, 图像与流动判断, 推导证明, 选择题 |
| 8 | 28 | 104 | 计算题, 简答综合, 名词解释题, 图像与流动判断, 推导证明, 选择题 |
| 2 | 26 | 104 | 计算题, 简答综合, 名词解释题, 填空题, 图像与流动判断, 推导证明, 选择题 |

## Processing Lanes

| Lane | Materials | Sample IDs | Public Handling |
| --- | ---: | --- | --- |
| 大扫描件 OCR/抽页 | 2 | fluid-181103-02, fluid-181103-38 | metadata-only processing queue; no raw source copy or file link |
| ZIP 原包解包清单 | 2 | fluid-181103-11, fluid-181103-26 | metadata-only processing queue; no raw source copy or file link |
| Office 文本抽取 | 9 | fluid-181103-04, fluid-181103-05, fluid-181103-06, fluid-181103-07, fluid-181103-08, fluid-181103-09 | metadata-only processing queue; no raw source copy or file link |
| 湍流资料深索引 | 13 | fluid-181103-23, fluid-181103-25, fluid-181103-26, fluid-181103-28, fluid-181103-29, fluid-181103-30 | metadata-only processing queue; no raw source copy or file link |

## Gates

- PASS: inherited-round293-round294-sources-present - round293Acceptance=true, round294Rows=38, round294Routes=30
- PASS: route-family-counts-match-round293 - families={"byGroup":5,"byChapter":6,"byResourceType":6,"byStudyGoal":7,"byQuestionType":6}, routes=30
- PASS: all-materials-covered-by-route-expansion - covered=38, fiveFamilies=38
- PASS: review-queue-316-61-baseline-preserved - tasks=61, sourceAtoms=316, groupedSections=61
- PASS: round295-json-safe-no-paths-or-absolute-urls - no blocked local path, absolute URL, or sensitive marker found
- PASS: round295-doc-safe-no-paths-or-absolute-urls - no blocked local path, absolute URL, or sensitive marker found

## Boundary

- This is a study-route and coverage artifact only.
- It does not update the public shell, answer-evidence ledger, private-video business logic, or real-exam source text.
- 181103 materials may guide chapter, question-type, and grouped-section review; they are not promoted as source-answer proof.
