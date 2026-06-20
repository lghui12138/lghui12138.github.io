# Round371 181103 Authenticated Workflow Proof

- Version: `round410-181103-practice-status-cardinality-20260620`
- Expected release: `round410-181103-practice-status-cardinality-20260620`
- Generated at: `2026-06-20T05:33:16.522Z`
- Acceptance: **PASS**
- Browser runs skipped: `false`

## Local Data

- Question bank: 522 total / 381 source-semantic practice / 141 source-content display-only / 522 source-first review / 379 OCR review / 24 hidden review
- Index source-first count: 522; practice=381; source-content=141; default diagnostic=381
- Source anchors: 522/522
- Raw OCR/noise hits in source-backed practice pool: 0
- Big workbook: 40 first-window images, 3 eager, 37 lazy, total pages=365, static anchors=325

## Live Public Shell

- `lghui.top/site-updates.json`: 200, current=true
- `lghui.top/resources/fluid-181103-html/index.html`: 38/38 material links, binary links=0
- `lghui.top/question-banks/181103-material-extracted.json`: 522 total / 381 source-semantic practice / 141 source-content display-only / 522 source-first / 379 OCR / 24 hidden
- `lghui.top/question-banks/index.json`: source-first=522, total=522, practice=381, source-content=141, default diagnostic=381
- Public big workbook: 40 first-window images, 3 eager, 37 lazy, total pages=365, page anchors=365

## Real Student Account Browser

- Auth chain: started on lghui.top=true, reached source=true, role=student, qa=qa-student, credentials=credentials-redacted
- Bank ledger: 可刷题 381 HTML题面 522 高置信 352 低置信 0 来源证据 522 源文线索 141 纯占位 0 重复簇 1
- Practice dialog: 522 total / 381 source-semantic practice / 141 source-content display-only / 522 source-first / 379 OCR / 24 hidden / default garble 0
- Rendered question: launched=381, counter=题目 1 / 381, bad tokens=false, formula bridge=true, source link=/resources/fluid-181103-html/materials/01-fluid-181103-01-material/index.html#page-003, source image=1946x2858
- Authenticated source index: 38/38 material links, binary links=0
- Authenticated big workbook: 40 first-window images, 3 eager, 37 lazy, total pages=365, page anchors=365, binary links=0
- User-pointed 03 material page: 12 images / 12 decoded, page ids=12, binary links=0, replacements=0, qmark runs=0

## Optimization Lessons

- Large PDF-derived workbooks must render as direct in-site HTML page images and lazy-load after the first few pages; eager-loading hundreds of page images is treated as a release blocker.
- The 181103 bank must expose 522 source-verified HTML cards while starting only 381 source-semantic practice questions; 141 source/content cards stay display-only.
- Production closure needs both public-shell proof and authenticated source proof because lghui.top may expose static HTML while pages.dev returns a protected login shell to anonymous requests.
- Real-account QA must write redacted counts and routes, not credentials or screenshots with secrets.

## Acceptance Checks

- PASS local-latest-version-matches-expected
- PASS local-question-bank-counts-current-source-backed-playable
- PASS local-181103-default-practice-garble-zero
- PASS local-question-bank-index-source-first-current
- PASS local-question-bank-source-anchors-current
- PASS local-big-workbook-windowed-lazy-policy
- PASS public-lghui-top-site-updates-current
- PASS pages-dev-edge-status-current
- PASS public-181103-index-38-html-links-no-binaries
- PASS public-181103-bank-counts-current-source-backed-playable
- PASS public-181103-default-practice-garble-zero
- PASS public-181103-bank-index-source-first-current
- PASS public-big-workbook-windowed-lazy-budget-no-binaries
- PASS browser-auth-starts-on-lghui-top-and-reaches-source
- PASS browser-auth-dedicated-student-qa
- PASS browser-181103-bank-card-visible-with-source-first-current-ledger
- PASS browser-181103-dialog-counts-current-source-first
- PASS browser-practice-starts-181103-all-current
- PASS browser-rendered-practice-bad-tokens-hidden
- PASS browser-practice-no-default-mislabel
- PASS browser-practice-formula-bridge-and-source-link
- PASS browser-practice-source-page-image-rendered
- PASS browser-authenticated-source-index-38-no-downloads
- PASS browser-authenticated-big-workbook-windowed-lazy-budget-no-binaries
- PASS browser-user-pointed-03-html-renders-all-images
