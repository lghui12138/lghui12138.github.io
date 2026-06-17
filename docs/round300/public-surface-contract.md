# Round300 Public Surface Contract

Version: `round300-public-surface-contract-audit-20260614`
Generated at: `2026-06-13T23:21:45.247Z`
Expected version: `round300-real-exam-depth-181103-ops-contract-20260614`
Status: PASS

This audit keeps the lghui.top public shell, the pages.dev source origin, current/next version anchors, historical Round264 content, protected anonymous 401 routes, and public JSON allowlist as separate surfaces.

## Checks

| Result | Check |
|---|---|
| PASS | source authorities match expected version |
| PASS | public shell entry contract passes |
| PASS | current release and historical Round299 anchors are explicit |
| PASS | no round264 current-entry leakage on public shell |
| PASS | public JSON files are allowlisted and non-sensitive |
| PASS | live public/source routes satisfy release-surface contract |

## Source Authorities

| Authority | Result | Observed |
|---|---|---|
| source-site-updates-top-version | PASS | `round300-real-exam-depth-181103-ops-contract-20260614` |
| source-edge-home-version | PASS | `round300-real-exam-depth-181103-ops-contract-20260614` |
| source-edge-runtime-js-version | PASS | `round300-real-exam-depth-181103-ops-contract-20260614` |

## Public Shell

| Result | Contract |
|---|---|
| PASS | public shell repo exists |
| PASS | CNAME points to lghui.top |
| PASS | public shell site-updates top version matches expected |
| PASS | lghui.top home entry redirects to source origin with expected edge_refresh |
| PASS | public _edge-status shell redirects to source edge status with expected edge_refresh |
| PASS | public _edge-login shell redirects to source login with expected edge_refresh |
| PASS | public shell /api/auth/me is static-origin JSON, not an auth proof |

## Version Anchors

- Current top: `round300-real-exam-depth-181103-ops-contract-20260614`
- Roadmap version: `round300-real-exam-depth-181103-ops-contract-20260614`
- Round299 anchors: 6
- Round300 anchors: 8

## Live Routes

| Result | Origin | Path | HTTP/status | Observed version |
|---|---|---|---:|---|
| n/a | skipped | n/a | n/a | n/a |

## Public JSON Allowlist

- Checked files: 31
- Failures: 0

- none

## Round264 Current-Leak Defense

- Current-surface files checked: 90
- Historical JSON hits: 7

- none

## Boundary

- lghui.top is the public shell and static migration surface; it is not the authenticated QA proof origin.
- lghui-fluid-learning.pages.dev is the source/auth origin; anonymous 401 proves protection only, not a real account browser session.
- Round264 is allowed in historical learning-content JSON, but not as the current entry, edge_refresh, site-updates top version, or release marker.
- The public JSON allowlist is generated from the public-shell redirect/copy map plus explicit long-lived public learning ledgers.

## Commands

- `node --check tools/check-round300-public-surface-contract.mjs`
- `node tools/check-round300-public-surface-contract.mjs --expected-version round300-real-exam-depth-181103-ops-contract-20260614 --json`
- `node tools/check-round300-public-surface-contract.mjs --expected-version round300-real-exam-depth-181103-ops-contract-20260614 --write`
