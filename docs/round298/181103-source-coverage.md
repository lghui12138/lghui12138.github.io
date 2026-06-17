# Round298 181103 Source Coverage

Version: `round298-181103-source-coverage-20260614`

## Summary

- Read-only source packet label: `181103流体力学`; absolute source path is intentionally not published in this ledger.
- Current protected index coverage: 38/38 source files represented by 38 material rows.
- Current route layer: 30 routes across 5 route families.
- Current review layer: 61 review tasks linked to 316/61 real-exam truth.
- Unrepresented source files: 0; extra index rows: 0; size mismatches: 0.

## Extension Coverage

| Extension | Source Files | Indexed Materials | Source Size |
| --- | ---: | ---: | ---: |
| doc | 1 | 1 | 3.31 MiB |
| docx | 2 | 2 | 0.51 MiB |
| pdf | 27 | 27 | 132.78 MiB |
| ppt | 1 | 1 | 1.47 MiB |
| pptx | 5 | 5 | 8.82 MiB |
| zip | 2 | 2 | 18.11 MiB |

## Public Material Groups

| Material group | Count | Size | Extensions | Sample materialIds |
| --- | ---: | ---: | --- | --- |
| 181103 补充资料 | 1 | 52.18 MiB | pdf:1 | fluid-181103-38 |
| 考研真题/名词解释 | 5 | 66.90 MiB | doc:1, pdf:4 | fluid-181103-01, fluid-181103-02, fluid-181103-03, fluid-181103-09, fluid-181103-10 |
| 流体力学 I 课件 | 16 | 25.57 MiB | pdf:15, zip:1 | fluid-181103-11, fluid-181103-12, fluid-181103-13, fluid-181103-14, fluid-181103-15, fluid-181103-16, fluid-181103-17, fluid-181103-18 |
| 流体力学 II 湍流资料 | 9 | 9.75 MiB | docx:2, pdf:6, zip:1 | fluid-181103-26, fluid-181103-28, fluid-181103-29, fluid-181103-30, fluid-181103-32, fluid-181103-34, fluid-181103-35, fluid-181103-36 |
| 暑期课件 | 7 | 10.62 MiB | pdf:1, ppt:1, pptx:5 | fluid-181103-04, fluid-181103-05, fluid-181103-06, fluid-181103-07, fluid-181103-08, fluid-181103-27, fluid-181103-31 |

## Redacted Source Groups

| Redacted group | Group kind | File count | Size | Extensions |
| --- | --- | ---: | ---: | --- |
| srcgrp-177adf5b5cc0 | root-files | 6 | 74.50 MiB | doc:1, pdf:3, zip:2 |
| srcgrp-185779bb2118 | nested-directory | 11 | 6.49 MiB | docx:2, pdf:8, ppt:1 |
| srcgrp-29d5eb2b5d35 | nested-directory | 2 | 62.69 MiB | pdf:2 |
| srcgrp-a87d6e0b11fb | nested-directory | 14 | 12.51 MiB | pdf:14 |
| srcgrp-e32d41a53b89 | nested-directory | 5 | 8.82 MiB | pptx:5 |

## Route Coverage

| Route family | Route count | Covered material count |
| --- | ---: | ---: |
| byGroup | 5 | 38 |
| byChapter | 6 | 38 |
| byResourceType | 6 | 38 |
| byStudyGoal | 7 | 38 |
| byQuestionType | 6 | 38 |

## Review Task Coverage

- Queue tasks: 61
- Source atomic expected / web atomic / grouped sections: 316 / 316 / 61

| Question type | Task count |
| --- | ---: |
| 计算题 | 19 |
| 简答综合 | 9 |
| 名词解释题 | 3 |
| 填空题 | 1 |
| 图像与流动判断 | 22 |
| 推导证明 | 4 |
| 选择题 | 3 |

## Source Files Not Represented

| Redacted source ref | Extension | Size | Redacted group |
| --- | --- | ---: | --- |
| none | 0 | 0.00 MiB | none |

## Privacy Boundary

- Public JSON and this ledger do not contain absolute local paths.
- Public JSON and this ledger do not publish raw relative source filenames or downloadable private file paths.
- Missing-source evidence uses short hashes, extension, size bucket/bytes, and redacted group refs only.
- 181103 answer-like materials remain supplemental review aids; this ledger does not claim original answer-PDF evidence.

## Gate Evidence

- PASS: source-count-locked - source=38, indexed=38
- PASS: extension-counts-locked - extensions={"doc":1,"docx":2,"pdf":27,"ppt":1,"pptx":5,"zip":2}
- PASS: public-family-counts-locked - families={"pdf":27,"pptOrPptx":6,"docOrDocx":3,"zip":2}
- PASS: source-representation-closed - missing=0, extra=0, sizeMismatch=0
- PASS: route-coverage-present - routes=30, covered=byGroup:38,byChapter:38,byResourceType:38,byStudyGoal:38,byQuestionType:38
- PASS: review-task-coverage-present - tasks=61, atoms=316, grouped=61, mismatch=0, sourceIndexMissing=0
- PASS: inherited-protected-index-gates-pass - {"materialAccountingGatePass":true,"routeAccountingGatePass":true,"routeCoveredMaterialCount":38,"fullAuditPass":true,"reviewQueueSourceIndexMissingRowCount":0,"reviewQueueMismatchRowCount":0}

## Re-run

```bash
node tools/check-round298-181103-source-coverage.mjs --write
```

