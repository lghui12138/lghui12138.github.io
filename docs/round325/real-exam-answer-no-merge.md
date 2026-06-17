# Round325 Real-Exam Answer No-Merge Boundary

Version: `round325-real-exam-answer-no-merge-20260615`

This is Worker B's local data checker. It proves the current real-exam source/web no-merge counts and the answer evidence boundary from existing ledgers only. It does not edit pages, routes, site-updates, roadmap, release gates, tests, public shell files, answer text, or version constants.

## Key Counts

- source/web atomic questions: 325/325
- grouped sections / grouped ids: 68/217
- four/five split locks: 18/18
- five-item short-answer locks: 5/5
- strict/verbatim answer PDF proof: 0
- strict answer evidence on aligned rows: 0
- answer PDF provable rows: 0
- derived/unproven reference answer rows: 325
- failed checks: 0

## No-Merge Locks

| lock | expected/current | keys |
|---|---:|---|
| source/web atomic questions | 325 / 325-325 | current source + web ledgers |
| grouped sections | 68 / 68 | 217 grouped web ids; 149 ids would collapse if merged |
| four/five split locks | 18 / 18 | 2000-07, 2001-06, 2004-02, 2006-01, 2006-02, 2007-01, 2007-02, 2007-07, 2008-01, 2010-02, 2011-02, 2012-06, 2014-03, 2015-01, 2018-01, 2019-01, 2020-01, 2020-04 |
| five-item short-answer locks | 5 / 5 | 2010-02, 2015-01, 2018-01, 2019-01, 2020-01 |

## Answer Boundary

| layer | count | claim |
|---|---:|---|
| strict/verbatim original answer PDF proof | 0 | forbidden for current answers |
| answer PDF provable rows | 0 | no current row may be promoted |
| strict answer evidence on aligned rows | 0 | remains zero |
| derived/unproven reference answers | 325 | allowed study/reference boundary |
| improper original-answer claims | 0 | must remain zero |

## Checks

| check | status |
|---|---|
| round324-current-source-no-merge-pass | PASS |
| real-exam-source-web-cardinality-325-325 | PASS |
| grouped-section-and-id-locks-68-217 | PASS |
| four-five-split-locks-18 | PASS |
| five-item-short-answer-locks-5 | PASS |
| strict-answer-pdf-verbatim-proof-remains-zero | PASS |
| derived-unproven-answer-boundary-325 | PASS |
| round314-answer-layering-pass-without-promoting-answers | PASS |
| no-public-or-release-surface-claim | PASS |

## Boundary

- Read-only sources: `data/fluid-round324-real-exam-expanded-count-guard.json`, `data/fluid-round314-answer-source-layering.json`, `data/fluid-real-exam-answer-evidence-boundary.json`, `data/fluid-evidence-matrix-audit.json`, and `tools/check-round324-real-exam-expanded-count-guard.mjs`.
- Wrote only `data/fluid-round325-real-exam-answer-no-merge.json`, `data/fluid-round325-real-exam-answer-no-merge.json.gz`, and `docs/round325/real-exam-answer-no-merge.md`.
- This is not a production, release-gate, browser, public-shell, route, site-update, roadmap, private-video, or answer-text claim.
