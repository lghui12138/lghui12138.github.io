# Round325 Public/Auth Proof Ledger

- version: round325-public-auth-proof-ledger-20260615
- expectedVersion: round358-181103-522-html-practice-release-20260616
- source current round: 358
- site version: round358-181103-522-html-practice-release-20260616
- live proof claimed here: false
- real-account QA claimed here: false

This ledger proves source authority wiring only. It intentionally does not print credentials and does not replace the production browser gates.

## Checks

| Check | Result |
| --- | --- |
| site-updates-current-version-round325 | PASS |
| site-updates-tag-focus-current-release | PASS |
| roadmap-current-release-authority | PASS |
| middleware-edge-versions-round325 | PASS |
| home-resource-realexam-carry-current-version | PASS |
| 181103-and-real-exam-counts-visible | PASS |
| default-student-baseline-preserved | PASS |
| production-auth-browser-required-not-claimed-here | PASS |

## Required Production Commands

- `node tools/monitor-fluid-public-release.mjs --json --expected-version round358-181103-522-html-practice-release-20260616`
- `node tools/check-public-entry-browser.mjs --expected-edge-version round358-181103-522-html-practice-release-20260616`
- `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version round358-181103-522-html-practice-release-20260616`
- `node tools/check-authenticated-browser-gate.mjs --expected-version round358-181103-522-html-practice-release-20260616`
- `node tools/check-private-video-management-browser.mjs --production --json`
