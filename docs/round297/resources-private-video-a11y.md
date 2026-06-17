# Round297 Resources Private-Video Accessibility Proof

Version: `round297-real-qa-account-readiness-ledger-20260614`

Generated at: `2026-06-14T22:13:11.958Z`

This is a static resources-page proof. It does not claim production private-video recovery; production recovery still requires `FM_PRIVATE_MEDIA` R2 plus real teacher/student browser QA.

## Result

- Checker result: pass
- Private-video production recovery claim allowed: no
- Real QA account pass claimed: no
- Local path leak check: pass
- 181103 visible count chain: 38 protected materials / 30 routes / 68 review tasks / 325/68 real-exam return path

## Resources Page Checks

| Check | Status | Category |
| --- | --- | --- |
| private-video-entry-has-text-and-accessible-target | `pass` | text-plus-semantics |
| status-region-announces-changes | `pass` | text-plus-semantics |
| blocked-state-is-visible-text-not-color-only | `pass` | text-plus-semantics |
| ready-and-pending-state-copy-visible | `pass` | text-plus-semantics |
| 181103-counts-visible-in-resources-state | `pass` | visible-counts |
| private-video-delete-boundary-visible-where-applicable | `pass` | delete-language |
| protected-materials-do-not-expose-downloads-or-local-paths | `pass` | privacy-boundary |

## Existing Private-Video Ledgers

| Check | Status | Source |
| --- | --- | --- |
| round296-private-video-blockers-preserved | `pass` | data/fluid-round296-private-video-readiness-ledger.json |
| round296-delete-dry-run-language-preserved | `pass` | data/fluid-round296-private-video-readiness-ledger.json |
| round295-private-video-boundary-preserved | `pass` | data/fluid-round295-private-video-management-boundary.json |

## 181103 Source Counts

| Check | Status | Source |
| --- | --- | --- |
| 181103-material-count-lock | `pass` | data/fluid-181103-materials.json |
| 181103-route-count-lock | `pass` | data/fluid-181103-study-routes.json |
| 181103-review-queue-count-lock | `pass` | data/fluid-181103-question-review-queue.json |
| 181103-full-audit-count-lock | `pass` | data/fluid-181103-full-material-audit.json |

## Boundaries

- Blocked/ready private-video states must have visible text plus semantic hooks such as `aria-live`, `role="status"`, `aria-label`, `aria-describedby`, and stable data attributes.
- Delete proof stays limited to visible boundary wording plus prior dry-run ledger evidence: `delete?dryRun=1&writeProbe=1` and exact course-id confirmation.
- No local filesystem paths, raw download URLs, or original 181103 file lists are allowed in the public resources proof.
- This worker did not deploy, did not touch VPN/proxy state, and did not run Python.

## Problems

- none

## Commands

- `node --check tools/check-round297-resources-private-video-a11y.mjs`
- `node tools/check-round297-resources-private-video-a11y.mjs --json`
