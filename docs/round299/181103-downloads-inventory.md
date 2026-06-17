# Round299 181103 Downloads Inventory Gap Check

Version: `round299-181103-downloads-inventory-gap-check-20260614`

## Summary

- Source packet was checked from the local download tree, but the absolute path and raw private filenames are intentionally omitted.
- Current local inventory: 38 files, 165.01 MiB, extensions doc:1, docx:2, pdf:27, ppt:1, pptx:5, zip:2.
- Current protected index: 38 material rows, 38/38 source files represented.
- Current ledgers: 38/38 materials covered, 30/30 routes covered, 61/61 review tasks covered.
- Gaps found: 0. Newly relevant bucket status: all redacted semantic buckets are covered by the current 38/30/61 ledgers.

## Redacted Source Groups

| Redacted source group | Kind | Files | Represented | Size | Extensions | Size buckets |
| --- | --- | ---: | ---: | ---: | --- | --- |
| srcgrp-77ea75a06571 | nested-directory | 14 | 14 | 12.51 MiB | pdf:14 | medium:3, small:11 |
| srcgrp-879a821b1f48 | nested-directory | 11 | 11 | 6.49 MiB | docx:2, pdf:8, ppt:1 | medium:1, small:10 |
| srcgrp-8a075b6c60b1 | nested-directory | 5 | 5 | 8.82 MiB | pptx:5 | medium:2, small:3 |
| srcgrp-c06a8a9be200 | root-files | 6 | 6 | 74.50 MiB | doc:1, pdf:3, zip:2 | large:1, medium:3, small:2 |
| srcgrp-fc60c500089b | nested-directory | 2 | 2 | 62.69 MiB | pdf:2 | large:1, medium:1 |

## Material Relevance Buckets

| Redacted semantic bucket | Materials | Source represented | Extensions | Review support tasks | 38 / 30 / 61 covered | Status |
| --- | ---: | ---: | --- | ---: | --- | --- |
| advanced-viscous-flow | 17 | 17 | docx:2, pdf:13, zip:2 | 61 | yes / yes / yes | covered-by-current-38-30-61-ledgers |
| supplemental-reference | 13 | 13 | pdf:9, ppt:1, pptx:3 | 61 | yes / yes / yes | covered-by-current-38-30-61-ledgers |
| exam-review-or-answer-aid | 8 | 8 | doc:1, pdf:5, pptx:2 | 61 | yes / yes / yes | covered-by-current-38-30-61-ledgers |

## Route Ledger Coverage

| Route family | Routes | Covered materials |
| --- | ---: | ---: |
| byGroup | 5 | 38 |
| byChapter | 6 | 38 |
| byResourceType | 6 | 38 |
| byStudyGoal | 7 | 38 |
| byQuestionType | 6 | 38 |

## Gap Groups

- No unindexed source groups, extra index groups, or size-mismatch groups were found in the current local inventory.

## Privacy Boundary

- This Markdown and its JSON pair publish redacted source refs, redacted group refs, counts, type buckets, byte totals, and inventory hashes only.
- They do not publish absolute local paths, raw private filenames, raw relative source paths, raw download URLs, or copied original files.
- Answer-like 181103 files remain supplemental review aids; this checker does not upgrade them into original answer-PDF evidence.

## Gate Evidence

- PASS: download-counts-match-current-index - source=38, indexed=38, bytes=173028556, extensions={"doc":1,"docx":2,"pdf":27,"ppt":1,"pptx":5,"zip":2}
- PASS: no-source-index-gaps - unindexed=0, extra=0, sizeMismatch=0
- PASS: current-38-30-61-ledgers-cover-redacted-buckets - materials38=true, routes30=true, review61=true, buckets=3
- PASS: round298-and-full-audit-inherited - round298=true, fullAudit=true
- PASS: privacy-boundary-redacted-output - output uses redacted source refs, redacted group refs, counts, buckets, byte totals, and hashes only

## Re-run

```bash
node tools/check-round299-181103-downloads-inventory.mjs --write
```

