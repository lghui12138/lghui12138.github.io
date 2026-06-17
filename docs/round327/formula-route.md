# Round327 Formula Route Guard

Generated: 2026-06-15T03:27:00+08:00

Round327 adds a visible route on each knowledge-detail formula card: formula meaning -> note or guide target -> condition checklist -> exam/application entry.

## Summary

- Checks: 9/9
- Formula count: 1965
- Routeable formulas: 1965
- Direct question formulas: 1933
- Application question formulas: 1965
- Condition cards: 10

## Source Signals

| Signal | Value |
|---|---|
| hasFormulaRouteFunction | `true` |
| formulaPanelCallsRoute | `true` |
| hasRouteContainer | `true` |
| hasNoteStep | `true` |
| hasConditionStep | `true` |
| hasExamStep | `true` |
| hasConditionFallback | `true` |
| hasConditionChecklistAnchor | `true` |
| hasRealExamFallbackSearch | `true` |
| hasPracticeQuestionResolver | `true` |
| referencesForbiddenEntryPageEdits | `false` |

## Checks

| Result | Check |
|---|---|
| PASS | `knowledge-detail-renders-formula-route-component` |
| PASS | `formula-route-exposes-note-condition-exam-steps` |
| PASS | `formula-route-keeps-condition-fallback-visible` |
| PASS | `formula-route-keeps-exam-fallback-search-visible` |
| PASS | `formula-index-has-routeable-knowledge-or-guide-targets` |
| PASS | `formula-index-keeps-direct-real-exam-links-for-most-formulas` |
| PASS | `formula-applications-cover-all-formulas-with-representative-questions` |
| PASS | `formula-training-and-condition-data-remain-available` |
| PASS | `round327-scope-stays-off-forbidden-entry-pages` |

## Verification

- `node --check tools/check-round327-formula-route.mjs`
- `node tools/check-round327-formula-route.mjs --write --json`
- `node --check tools/check-round325-knowledge-mathjax-cache.mjs`
- `node tools/check-round325-knowledge-mathjax-cache.mjs --json`
