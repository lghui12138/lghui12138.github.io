# Round307 Optimization Experience Ledger

- version: round307-optimization-experience-ledger-20260614
- scope: Agent F playbook update and public proof checklist
- release claim here: false
- production private-video recovery claim here: false
- real-account QA claim here: false
- worker-local-only release allowed: false

Round307 distills the current website optimization lessons into release-gate
memory. It is not a deployment record. A future release may cite this ledger only
after the public shell, authenticated production origin, browser gates, real
teacher/student account checks, and Cloudflare storage audit all line up for the
same version.

## Public Ledger Counts

| ledger | current public count | gate meaning |
|---|---:|---|
| real-exam atomic source questions | 316/316 | The real-exam source of truth must not fall back to 308 or merge grouped sections. |
| real-exam grouped source sections | 61/61 | Grouped sections are a separate source ledger, not a display detail. |
| grouped web question ids | 201/201 | Web review routes must preserve grouped-question coverage without flattening. |
| risky four/five-item grouped locks | 17/17 | Historical short-answer structures stay explicit instead of normalized away. |
| 181103 protected materials | 38/38 | Only redacted summaries and safe counts belong in public artifacts. |
| 181103 study routes | 30/30 | Protected materials must point back to site-native study actions. |
| 181103 review tasks | 61/61 | Review tasks remain tied to the grouped real-exam source surface. |
| Wu textbook PDF coverage | 916/916 | Textbook coverage is a source-support ledger, not answer-PDF proof. |
| Wang textbook PDF coverage | 232/232 | Two-textbook support stays separate from original answer provenance. |
| stale public round leakage | 0 | Stale current-version markers block release-current wording. |

## Experience Items

| ID | lesson | anti-regression gate |
|---|---|---|
| R307-public-proof-01 | `lghui.top` proves the public shell only when the visible route and `site-updates.json[0].version` show the same current version. | Fail release wording that cites HTTP 200, source files, or a history search without the top feed version and visible public surface. |
| R307-public-proof-02 | `lghui-fluid-learning.pages.dev` is the authenticated production origin, and `_edge-status.edgeHomeVersion` is the edge authority to compare. | Keep pages.dev edge status separate from public-shell checks and fail merged-origin proof rows. |
| R307-public-proof-03 | A Cloudflare Pages deploy id is route material until `lghui.top`, pages.dev edge status, browser entry, and release gate evidence agree. | Reject deploy-only or source-push-only closure language. |
| R307-public-proof-04 | Browser proof is a different evidence class from static JSON checks. | Require `check-public-entry-browser.mjs` or an explicit browser-not-run boundary for visible-route claims. |
| R307-real-account-01 | Real teacher and student QA require credential-backed browser proof, not mock UI or anonymous `401` JSON. | Missing auth env or missing QA accounts must be reported as `blocked` or `not run`. |
| R307-real-account-02 | Authenticated proof belongs on pages.dev; the public shell can start the chain, but it cannot stand in for account-state QA. | Keep `check-lghui-top-auth-chain.mjs` and authenticated browser gate results as separate rows. |
| R307-r2-01 | `FM_AUDIT` KV is audit plumbing; it is not private media storage recovery. | Fail production recovery claims unless `FM_PRIVATE_MEDIA` R2 is present and audited. |
| R307-r2-02 | Private-video upload, publish, access change, archive, and delete remain blocked without R2 plus real-account browser proof. | Keep `productionPrivateVideoRecovery=false` when either R2 or real-account QA is missing. |
| R307-ledger-01 | Count fixes must be visible in a ledger or gate output, not hidden in JSON-only changes. | Require 316/61/201, 38/30/61, and textbook coverage counts in public-facing or release-report artifacts. |
| R307-ledger-02 | Answer rows, textbook support, and original answer-PDF proof are separate evidence layers. | Fail wording that treats textbook/PDF coverage as original answer provenance. |
| R307-worker-01 | Worker-local artifacts are route material, not a release. | Require main integration, public shell sync, deploy id, live public proof, and release-gate rerun before public closure. |
| R307-worker-02 | Split-agent work must collapse back to one visible versioned public surface. | Reject summaries that leave each worker's result local, partial, or unversioned. |
| R307-privacy-01 | Protected 181103 data can be summarized by counts, study goals, and safe source refs only. | Scan Round307 docs for local paths, file URLs, credential names with values, raw download routes, and protected path leakage. |
| R307-mobile-01 | Public ledgers must remain readable on narrow mobile screens. | Treat 390px overflow, focus, labels, tap targets, gzip sidecars, and public JSON budget as release gates. |
| R307-reporting-01 | Every release report must distinguish done, blocked, and not run. | Require residual blockers for real-account QA, `FM_PRIVATE_MEDIA`, and browser/deploy checks that were not executed. |

## Completion Boundary

Round307 Agent F is complete only when this ledger and the public proof checklist
are present and pass `node tools/check-round307-optimization-playbook.mjs`.
Passing that checker means the playbook is gated. It does not prove source push,
public shell sync, Cloudflare deployment, `lghui.top` freshness, pages.dev auth,
real teacher/student QA, `FM_PRIVATE_MEDIA` R2, or private-video production
recovery.
