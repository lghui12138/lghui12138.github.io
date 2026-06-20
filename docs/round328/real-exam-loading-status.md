# Round328 Real-Exam Loading Status Gate

Version: `round328-real-exam-loading-status-20260615`

This local gate checks the real-exam page loading state after the Round328 worker change. It verifies that slow loading and data failure states stay explicit while the current successor version and the Round325 no-merge source locks remain visible.

## Key Proof

- current successor version visible: yes (Round410)
- visible no-merge locks: 325/68/217/5
- source/web atomic questions: 325/325
- grouped sections / grouped ids: 68/217
- five-item short-answer locks: 5/5
- source no-merge failures: 0
- failed checks: 0

## Loading States

| state | visible |
|---|---|
| slow loading timeout explains nonblank state | yes |
| fallback from light index to full year bank is explicit | yes |
| final data failure names both failed sources | yes |
| no-merge warning stays in loading/failure text | yes |
| retry keeps the loading proof text | yes |

## Checks

| check | status |
|---|---|
| current-successor-version-remains-visible | PASS |
| real-exam-count-locks-remain-visible-325-68-217-5 | PASS |
| round325-no-merge-data-still-passes | PASS |
| slow-loading-status-is-explicit-and-not-blank | PASS |
| data-failure-status-is-explicit | PASS |
| retry-rearms-loading-watchdog | PASS |
| retry-actions-remain-available | PASS |
| scope-boundary-no-index-resources-private-video-edit-claim | PASS |

## Boundary

- Read-only source ledger: `data/fluid-round325-real-exam-answer-no-merge.json`.
- Edited user surface: `modules/real-exams-dynamic.html`.
- Wrote this gate output only to `data/fluid-round328-real-exam-loading.json`, `data/fluid-round328-real-exam-loading.json.gz`, and `docs/round328/real-exam-loading-status.md`.
- This is not a production, release-gate, public-shell, private-video, index, or resources-page claim.
