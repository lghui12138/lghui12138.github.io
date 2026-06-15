# Round316 181103 Reader Polish

- version: round316-181103-reader-polish-20260614
- official material pages: 38/38
- PDF/page-image materials with jump tools: 36/36
- anchored PDF pages: 1099/1099
- eager/async page images: 108/108
- lazy/async page images: 991/991
- malformed intro tags: 0
- raw binary hrefs: 0
- iframe/embed/object tags: 0
- preview-wrapper tokens: 0

## Contract

Round316 does not loosen the all-HTML rule. It improves the same 38 in-site HTML body pages so long page-image documents have page anchors, quick jump controls, three eager images per page-image material, lazy loading for the remaining page images, and valid intro markup. Current learner-facing pages may show the newer Round357 version instead of the older Round315 continuity string.

## Checks

| check | status |
| --- | --- |
| official-38-materials | PASS |
| all-pages-pass-reader-polish | PASS |
| all-pdf-pages-anchored-and-lazy-budgeted | PASS |
| all-pdf-materials-have-page-jump | PASS |
| no-malformed-intro-or-wrapper-downloads | PASS |

## Gate

```bash
node tools/check-round316-181103-reader-polish.mjs --write --json
```
