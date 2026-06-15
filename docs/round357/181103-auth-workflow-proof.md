# Round357 181103 Authenticated Workflow Proof

- Version: `round357-181103-auth-workflow-proof-20260615`
- Expected release: `round357-181103-auth-workflow-proof-20260615`
- Generated at: `2026-06-15T12:57:28.000Z`
- Acceptance: **PASS**
- Browser runs skipped: `false`

## Local Data

- Question bank: 411 total / 0 default practice / 411 source-first review / 268 OCR review / 24 hidden review
- Source anchors: 411/411
- Default garble hits: 0
- Big workbook: 365 images, 3 eager, 362 lazy

## Live Public Shell

- `lghui.top/site-updates.json`: 200, current=true
- `lghui.top/resources/fluid-181103-html/index.html`: 38/38 material links, binary links=0
- `lghui.top/question-banks/181103-material-extracted.json`: 411 total / 0 default / 411 source-first / 268 OCR / 24 hidden
- Public big workbook: 365 images, 3 eager, 362 lazy

## Real Student Account Browser

- Auth chain: started on lghui.top=true, reached source=true, role=student, qa=qa-student, credentials=credentials-redacted
- Bank ledger: 默认净题 0 回源复核 411 原 OCR show 119 OCR池 268 隐藏复核 24 公式/乱码全回源 重复簇 1
- Practice dialog: 411 total / 0 default / 411 source-first / 268 OCR / 24 hidden / default garble 0
- Rendered question: bad tokens=false, formula bridge=true, source link=/resources/fluid-181103-html/materials/01-fluid-181103-01-material/index.html#page-003
- Authenticated source index: 38/38 material links, binary links=0
- Authenticated big workbook: 365 images, 3 eager, 362 lazy, binary links=0

## Optimization Lessons

- Large PDF-derived workbooks must render as direct in-site HTML page images and lazy-load after the first few pages; eager-loading hundreds of page images is treated as a release blocker.
- OCR-derived question banks must default to source-first review until each item is source-verified; formula placeholders and symbol noise stay viewable only behind a source HTML link.
- Production closure needs both public-shell proof and authenticated source proof because lghui.top may expose static HTML while pages.dev returns a protected login shell to anonymous requests.
- Real-account QA must write redacted counts and routes, not credentials or screenshots with secrets.

## Acceptance Checks

- PASS local-latest-version-matches-expected
- PASS local-question-bank-counts-411-0-411-source-first
- PASS local-question-bank-default-garble-zero
- PASS local-question-bank-source-anchors-411
- PASS local-big-workbook-lazy-budget
- PASS public-lghui-top-site-updates-current
- PASS pages-dev-edge-status-current
- PASS public-181103-index-38-html-links
- PASS public-181103-bank-counts-411-0-411-source-first
- PASS public-181103-default-garble-zero
- PASS public-big-workbook-lazy-budget
- PASS browser-auth-starts-on-lghui-top-and-reaches-source
- PASS browser-auth-dedicated-student-qa
- PASS browser-181103-bank-card-visible-with-ledger
- PASS browser-181103-dialog-counts-411-0-source-first
- PASS browser-default-practice-garble-zero
- PASS browser-practice-no-default-mislabel
- PASS browser-practice-formula-bridge-and-source-link
- PASS browser-authenticated-source-index-38-no-downloads
- PASS browser-authenticated-big-workbook-lazy-budget
