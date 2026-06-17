# Round317 Mobile A11y Audit

- worker: Round317 mobile/accessibility audit
- date: 2026-06-14
- scope: `index.html`, `question-bank-home.html`, `resources.html`, `resources/fluid-181103-html/index.html`, and one long 181103 material page sample

## Findings

- 181103 index and material reader already pass the main mobile contract in browser probes: no horizontal overflow at 390, 768, or 1440 px. The sampled 365-page material has 365/365 lazy async page images and no missing `alt`.
- `question-bank-home.html` had an updating status paragraph without a live region and allowed long chips/version labels to risk narrow-screen overflow.
- `index.html` redirects quickly, so the fallback page needs its progress surface to be announced and its links to keep visible focus/touch sizing before redirect.
- `resources.html` already had live loading status and keyboard tab behavior. The small patch adds a 390 px tab/card guard and lazy async decoding for generated video cover images.

## Patch

- Added polite status semantics to the question-bank index loader.
- Removed mobile zoom suppression from the question-bank viewport.
- Added visible focus rings, 44 px target preservation, and long-label wrapping guards on the audited entry pages.
- Added 390 px resource tab/card layout guards.
- Extended `tools/check-fluid-mobile-performance-budget.mjs` so these regressions are covered by the existing mobile/performance gate.

## Commands

```bash
node tools/check-fluid-mobile-performance-budget.mjs
node tools/check-round316-181103-reader-polish.mjs --json
```
