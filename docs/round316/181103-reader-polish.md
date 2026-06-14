# Round316 181103 Reader Polish

- version: round316-181103-reader-polish-20260614
- official material pages: 38/38
- PDF/page-image materials with jump tools: 27/27
- anchored PDF pages: 902/902
- lazy/async page images: 902/902
- malformed intro tags: 0
- malformed intro: 0
- raw binary hrefs: 0
- iframe/embed/object tags: 0
- preview-wrapper tokens: 0

## Contract

Round316 does not loosen the Round315 all-HTML rule. It improves the same 38 in-site HTML body pages so long page-image documents have page anchors, quick jump controls, lazy loading, and valid intro markup.

## Checks

| check | status |
| --- | --- |
| official-38-materials | PASS |
| all-pages-pass-reader-polish | PASS |
| all-pdf-pages-anchored-and-lazy | PASS |
| all-pdf-materials-have-page-jump | PASS |
| no-malformed-intro-or-wrapper-downloads | PASS |

## Gate

```bash
node tools/check-round316-181103-reader-polish.mjs --write --json
```
