# Round293 Worker 2 Real-Exam Four/Five-Subquestion Granularity Locks

## Scope

- Workdir: `/Users/kili/Documents/Codex/lghui-source-private-video-work`.
- Touched only real-exam audit/gate files, source-expansion data, and this Round293 note.
- No resource page, video, middleware, question text, or answer text was edited.

## Findings

- Current real-exam source JSON is still at `316/316` atomic questions and `61/61` split grouped source sections.
- No grouped source section with 4 or 5 expected subquestions is currently merged in `question-banks/real-exam-years/*.json`.
- The full 4/5-subquestion lock set has 17 rows across 13 years:
  - `2000-07`, `2004-02`, `2006-01`, `2006-02`, `2007-01`, `2007-02`, `2007-07`, `2008-01`, `2010-02`, `2011-02`, `2012-06`, `2014-03`, `2015-01`, `2018-01`, `2019-01`, `2020-01`, `2020-04`.
- These rows cover short-answer-family, objective-family, and calculation-subparts. The previous focused five-item locks were useful but did not explicitly enumerate every 4/5-subquestion parent row.

## Changes

- `tools/audit-real-exam-source-granularity.mjs` now emits `fourFiveQuestionLocks` and summary counts:
  - `fourFiveQuestionLockCount = 17`
  - `failedFourFiveQuestionLockCount = 0`
  - `fourFiveQuestionYears = 13 years`
- `tools/build-round290-real-exam-source-expansion-ledger.mjs` now emits matching `fourFiveQuestionLocks`, includes the zero-failure condition in `acceptance.pass`, and supports `FLUID_ROUND290_SKIP_DOC_WRITE=1` so the JSON ledger can be refreshed without touching `docs/round290`.
- `tests/round293-real-exam-four-five-granularity-locks.mjs` verifies the full 17-row set against source audit, Round290 ledger, and the per-year real-exam JSON files.
- Refreshed:
  - `data/fluid-real-exam-source-granularity-audit.json(.gz)`
  - `data/fluid-round290-real-exam-source-expansion-ledger.json(.gz)`

## Answer Provenance Boundary

- This work proves question-stem/source-section granularity only.
- It does not prove that answer explanations are original exam answers.
- Answer evidence remains governed by the separate Round289 answer-evidence boundary ledger.

## Verification

- `node tools/audit-real-exam-source-granularity.mjs`
- `FLUID_ROUND290_SKIP_DOC_WRITE=1 node tools/build-round290-real-exam-source-expansion-ledger.mjs`
- `node --check tests/round293-real-exam-four-five-granularity-locks.mjs`
- `node tests/round293-real-exam-four-five-granularity-locks.mjs`
- `node tests/round292-real-exam-granularity-locks.mjs`
