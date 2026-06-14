# Round318 181103 Route-To-Practice Bridge

- version: round318-181103-practice-bridge-20260614
- material HTML pages with study bridge: 38/38
- material HTML pages with real-exam bridge: 38/38
- 181103 route families: 30/30
- source material coverage: 38/38
- review-route material coverage: 37/37 with 1 no-task supplemental material
- question review tasks inherited: 68/68
- chapter practice handoff chapters: 6/6
- viewer/wrapper/download/raw hrefs: 0

## Bridge Reading

The current bridge is a two-hop in-site path: each 181103 material page sends the learner from direct HTML body content to `/modules/real-exams-dynamic.html`, and the real-exam page owns the chapter-level practice entry to `/modules/practice-dynamic.html?type=real&chapter=...`.

This keeps the 181103 source material side as reading/reference HTML, while practice remains attached to the formal real-exam surface and its 325/68 count locks.

## Checks

| check | status |
| --- | --- |
| official-materials-38-with-study-bridge | PASS |
| route-families-cover-30-routes-and-38-materials | PASS |
| real-exam-page-owns-practice-handoff | PASS |
| index-cards-enter-html-not-raw-files | PASS |
| no-viewer-wrapper-download-raw-hrefs | PASS |

## Integration Needs

- If a future worker adds one-click practice from material pages, generate it from chapter metadata and keep `real-exams-dynamic.html` as the count-lock owner.
- Keep the hard no-escape rule in release gates: no viewer, wrapper, download, raw-file, binary-file, local-path, or `file://` hrefs from the 181103 HTML route.
- Promote this checker into the release-gate list only after the public surface is intentionally advanced to Round318.
