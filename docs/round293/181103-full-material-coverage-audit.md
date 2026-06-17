# Round293 181103 Full Material Coverage Audit

Date: 2026-06-13

## Scope

- Worker: Round293 Worker 1.
- Scope: 181103 protected material accounting, exact type/size/group coverage, and study-route coverage.
- Public-safety boundary: no raw files copied into the public bundle; no local absolute path, local file URL, or raw-file access URL is present in the public JSON payloads checked by the audit script.
- Files intentionally not touched: functions/_middleware.js, teacher-panel.html, modules/real-exams-dynamic.html, resources.html.

## Result

| Gate | Result |
|---|---:|
| Source folder files | 38 |
| Indexed material rows | 38 |
| Accounted files | 38 |
| Unaccounted source files | 0 |
| Extra index rows | 0 |
| Source total bytes | 173028556 |
| Indexed total bytes | 173028556 |
| Size mismatches | 0 |

## Exact Type Counts

| Type | Source | Indexed |
|---|---:|---:|
| PDF | 27 | 27 |
| PPT | 1 | 1 |
| PPTX | 5 | 5 |
| DOC | 1 | 1 |
| DOCX | 2 | 2 |
| ZIP | 2 | 2 |

## Material Groups

| Group | Indexed rows |
|---|---:|
| 考研真题/名词解释 | 5 |
| 暑期课件 | 7 |
| 流体力学 I 课件 | 16 |
| 流体力学 II 湍流资料 | 9 |
| 181103 补充资料 | 1 |

## Study Route Coverage

| Route family | Routes | Missing material IDs |
|---|---:|---|
| byGroup | 5 | none |
| byChapter | 6 | none |
| byResourceType | 6 | none |
| byStudyGoal | 7 | none |
| byQuestionType | 6 | none |

## Row-Level Audit

| ID | Type | Bytes | Group | Group route | Chapter route | Type route | Goal route | Question route |
|---|---|---:|---|---|---|---|---|---|
| fluid-181103-01 | PDF | 7755548 | 考研真题/名词解释 | yes | yes | yes | yes | yes |
| fluid-181103-02 | PDF | 57977105 | 考研真题/名词解释 | yes | yes | yes | yes | yes |
| fluid-181103-03 | PDF | 381540 | 考研真题/名词解释 | yes | yes | yes | yes | yes |
| fluid-181103-04 | PPTX | 1573842 | 暑期课件 | yes | yes | yes | yes | yes |
| fluid-181103-05 | PPTX | 3042916 | 暑期课件 | yes | yes | yes | yes | yes |
| fluid-181103-06 | PPTX | 3330194 | 暑期课件 | yes | yes | yes | yes | yes |
| fluid-181103-07 | PPTX | 631075 | 暑期课件 | yes | yes | yes | yes | yes |
| fluid-181103-08 | PPTX | 673525 | 暑期课件 | yes | yes | yes | yes | yes |
| fluid-181103-09 | DOC | 3472384 | 考研真题/名词解释 | yes | yes | yes | yes | yes |
| fluid-181103-10 | PDF | 558564 | 考研真题/名词解释 | yes | yes | yes | yes | yes |
| fluid-181103-11 | ZIP | 12739830 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-12 | PDF | 235047 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-13 | PDF | 195184 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-14 | PDF | 275665 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-15 | PDF | 203176 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-16 | PDF | 405073 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-17 | PDF | 398353 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-18 | PDF | 286559 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-19 | PDF | 4142341 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-20 | PDF | 174582 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-21 | PDF | 888893 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-22 | PDF | 225468 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-23 | PDF | 533136 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-24 | PDF | 3022008 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-25 | PDF | 2133103 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-26 | ZIP | 6253221 | 流体力学 II 湍流资料 | yes | yes | yes | yes | yes |
| fluid-181103-27 | PPT | 1539584 | 暑期课件 | yes | yes | yes | yes | yes |
| fluid-181103-28 | DOCX | 70795 | 流体力学 II 湍流资料 | yes | yes | yes | yes | yes |
| fluid-181103-29 | DOCX | 468383 | 流体力学 II 湍流资料 | yes | yes | yes | yes | yes |
| fluid-181103-30 | PDF | 2118702 | 流体力学 II 湍流资料 | yes | yes | yes | yes | yes |
| fluid-181103-31 | PDF | 344741 | 暑期课件 | yes | yes | yes | yes | yes |
| fluid-181103-32 | PDF | 255978 | 流体力学 II 湍流资料 | yes | yes | yes | yes | yes |
| fluid-181103-33 | PDF | 951699 | 流体力学 I 课件 | yes | yes | yes | yes | yes |
| fluid-181103-34 | PDF | 640240 | 流体力学 II 湍流资料 | yes | yes | yes | yes | yes |
| fluid-181103-35 | PDF | 148832 | 流体力学 II 湍流资料 | yes | yes | yes | yes | yes |
| fluid-181103-36 | PDF | 135513 | 流体力学 II 湍流资料 | yes | yes | yes | yes | yes |
| fluid-181103-37 | PDF | 131114 | 流体力学 II 湍流资料 | yes | yes | yes | yes | yes |
| fluid-181103-38 | PDF | 54714643 | 181103 补充资料 | yes | yes | yes | yes | yes |

## Verification Commands

```bash
node tools/build-fluid-181103-study-routes.mjs
node tools/check-fluid-181103-round293-coverage.mjs
node tools/check-fluid-181103-accounting.mjs
node tools/validate-site-content.mjs
```

## Notes

- The Round293 script compares file identity internally by protected relative path and byte size, but its pass output and this report use only labels, IDs, counts, types, groups, and route-coverage flags.
- The route fix makes question-type route coverage consistent with each material row question-type assignment; all five route families now cover all 38 material IDs.
