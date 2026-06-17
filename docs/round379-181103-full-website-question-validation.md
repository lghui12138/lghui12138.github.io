# Round379 181103 Full Website Question Validation

Status: PASS

Version: round379-181103-full-website-question-validation-20260617
Previous: round378-181103-question-answer-website-verification-20260617

| Item | Value |
| --- | --- |
| Total website cards | 522 |
| Default practice questions | 381 |
| Display-only source/content cards | 141 |
| Static failures | 0 |
| Browser attempted | 522 |
| Browser problems | 0 |
| Live JSON checked | yes |

## Acceptance Rules

- Every question must match the final source-correction ledger, not an OCR draft.
- Every website HTML card must show the same question and answer text as the question bank.
- Every source anchor and source page image must resolve in-site.
- Runtime practice must not show stale OCR-review, hidden-review, quality-score, viewer, or bad-token warnings for validated cards.
- Runtime frontends must fetch bare `.json`; `.json.gz` is treated as a sidecar integrity artifact, not a browser JSON endpoint.

## Command

`node tools/check-round379-181103-full-website-question-validation.mjs --apply-current-status --write --json`
