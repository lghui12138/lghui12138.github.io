# Round349 Optimization Lessons Ledger

Version: `round349-optimization-lessons-ledger-20260615`
Generated: `2026-06-15T05:42:00+08:00`

This ledger distills reusable website optimization lessons only from existing proof and gate artifacts. It does not claim a deploy, live freshness, private-video production recovery, or new real-account QA.

## Source Facts

- 181103 HTML: 38/38 direct pages, viewer tokens 0, binary hrefs 0
- Real account proof: Round302 real-account status `blocked-missing-credentials`; Round305 readiness pass yes
- Private-video R2: recovery blocked; blocker `missing-FM_PRIVATE_MEDIA-production-R2-binding`
- Real exam split: 325 atoms, 68 grouped sections, 217 grouped ids
- Gzip: Round341 byte-exact targets 3; Round330 mismatches 0
- Dual origin: public shell `https://lghui.top`; source/auth `https://lghui-fluid-learning.pages.dev`

## Lessons

### 181103-html-content-not-viewer

- Category: 181103 materials
- Rule: Treat 181103 as standalone in-site HTML content only; route-present or viewer-wrapper output is not enough.
- Current proof: Round313 and Round315 both record 38/38 HTML pages with zero binary hrefs, viewer/wrapper hits, iframe/embed/object hits, and local path leaks.
- Anti-regression gate: Fail if any official 181103 material page falls back to viewer wording, iframe/embed/object, raw binary href, or local path.
- Encoded in: `data/fluid-round313-181103-all-html-contract.json`, `data/fluid-round315-181103-all-html-direct-pages.json`, `tools/check-round313-181103-all-html-contract.mjs`, `tools/check-round315-181103-all-html-direct-pages.mjs`

### real-account-proof-priority

- Category: auth proof
- Rule: Anonymous public proof and source status checks cannot replace real teacher/student account browser proof.
- Current proof: Round302 keeps local/live anonymous proof separate from credential-bearing real-account proof, and Round305 has a dedicated real-account readiness ledger.
- Anti-regression gate: Reports must name whether authenticated browser QA passed, blocked, or was not run before making authenticated workflow claims.
- Encoded in: `data/fluid-round302-public-shell-proof.json`, `data/fluid-round305-real-account-qa-readiness.json`, `tools/check-round302-public-shell-proof.mjs`, `tools/check-authenticated-browser-gate.mjs`

### private-video-r2-blocker-not-recovery

- Category: private-video boundary
- Rule: Missing FM_PRIVATE_MEDIA R2 is a hard blocker, not a recoverable detail hidden by local UI/mock success.
- Current proof: Round305 records productionPrivateVideoRecovery=false, missing-FM_PRIVATE_MEDIA-production-R2-binding, and localMockIsProductionProof=false.
- Anti-regression gate: Any production recovery claim must require both FM_PRIVATE_MEDIA R2 proof and real teacher/student browser QA.
- Encoded in: `data/fluid-round305-r2-binding-hard-stop.json`, `tools/check-round305-r2-binding-hard-stop.mjs`, `tools/check-cloudflare-pages-private-video-bindings.mjs`

### real-exam-source-subquestion-split

- Category: real-exam source truth
- Rule: Real questions stay split by original source subquestion/item, including four/five-item source rows.
- Current proof: Round303 and Round324 preserve 325 source/web atoms, 68 grouped sections, 217 grouped web ids, 18 four/five locks, and zero group-ledger failures.
- Anti-regression gate: Fail if generated banks, UI ledgers, or source rows collapse grouped prompts into parent-only questions.
- Encoded in: `data/fluid-round303-real-exam-no-merge-evidence.json`, `data/fluid-round324-real-exam-expanded-count-guard.json`, `tools/check-round303-real-exam-no-merge-evidence.mjs`, `tools/check-round324-real-exam-expanded-count-guard.mjs`

### gzip-sidecars-byte-exact

- Category: artifact reproducibility
- Rule: Generated JSON sidecars must be regenerated together and gzip must inflate byte-for-byte to the JSON.
- Current proof: Round341 closes gzip/cache negotiation with three byte-exact targets, and Round330 records zero gzip mismatches and zero missing large sidecars.
- Anti-regression gate: Fail if a tracked JSON artifact has a stale .gz sidecar or a large JSON lacks the expected gzip companion.
- Encoded in: `data/fluid-round341-performance-action-closure.json`, `data/fluid-round330-performance-cache.json`, `tools/check-round341-performance-action-closure.mjs`, `tools/check-round330-performance-cache.mjs`

### public-shell-pages-dev-separated-proof

- Category: release proof
- Rule: Prove lghui.top public shell and pages.dev source/auth origin separately; do not merge them into one generic production proof.
- Current proof: Round302 names publicShell=https://lghui.top and sourceAuth=https://lghui-fluid-learning.pages.dev, while Round301 marks live proof as required after local contract checks.
- Anti-regression gate: Fail if public shell checks are used as pages.dev auth proof, or if pages.dev status is reported without a separate lghui.top shell chain.
- Encoded in: `data/fluid-round302-public-shell-proof.json`, `data/fluid-round301-public-release-proof-contract.json`, `tools/check-round302-public-shell-proof.mjs`, `tools/check-round301-public-release-proof-contract.mjs`

## Checks

| Check | Status |
|---|---|
| source-artifacts-present | PASS |
| required-lessons-present | PASS |
| 181103-html-policy-encoded | PASS |
| real-account-proof-priority-encoded | PASS |
| r2-blocker-hard-stop-encoded | PASS |
| real-exam-source-split-encoded | PASS |
| gzip-sidecar-policy-encoded | PASS |
| public-shell-pages-dev-proof-separated | PASS |
| scope-limited-to-round349-artifacts | PASS |
| ledger-output-gzip-byte-exact | PASS |
| json-and-markdown-avoid-secret-like-output | PASS |
| json-shape-valid | PASS |

## Boundaries

- 181103 acceptance means standalone in-site HTML content, not viewer, wrapper, iframe, embed, raw download, or local path.
- Real account proof has priority over anonymous/public proof for authenticated teacher/student claims.
- Private-video production recovery remains blocked when FM_PRIVATE_MEDIA R2 proof is missing, even if UI or mock gates pass.
- Real exam rows must preserve original source subquestions and four/five-item locks instead of merging grouped prompts.
- JSON gzip sidecars are part of the contract and must inflate byte-for-byte to the JSON payload.
- lghui.top public shell proof and pages.dev authenticated/source proof are separate proof classes.

## Verification

- `node --check tools/check-round349-optimization-lessons-ledger.mjs`
- `node tools/check-round349-optimization-lessons-ledger.mjs --write --json`

## Output Budget

- JSON bytes: 14305
- Gzip bytes: 3342
- Markdown bytes: 6043
- Gzip byte exact: yes
