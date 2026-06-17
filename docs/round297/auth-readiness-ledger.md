# Round297 Auth Readiness Ledger

Version: `round297-real-qa-account-readiness-ledger-20260614`

Generated at: `2026-06-13T21:57:13.962Z`

Previous public version from worker context: `round296-private-video-browser-proof-budget-20260614`

Source site-updates top version observed locally: `round297-real-qa-account-readiness-ledger-20260614`

This ledger records readiness only. It does not run a browser login and does not print sensitive sign-in values or local paths.

## Result

- Auth env readiness: blocked-missing-required-auth-env
- lghui.top proof: not-run-or-missing
- pages.dev proof: not-run-or-missing
- Production recovery allowed: no

## Required Account Inputs

| Label | Present | Present key |
| --- | --- | --- |
| teacher sign-in name | no | not present |
| teacher sign-in verifier | no | not present |
| student sign-in name | no | not present |
| student sign-in verifier | no | not present |
| expected QA teacher identity | no | not present |
| expected QA student identity | no | not present |

## Missing Required Labels

- teacher sign-in name
- teacher sign-in verifier
- student sign-in name
- student sign-in verifier
- expected QA teacher identity
- expected QA student identity

## Origin Split

| Origin | Role | Claim allowed | Browser proof |
| --- | --- | --- | --- |
| https://lghui.top | public shell and auth-chain handoff | no | lghui.top auth-chain browser proof: not-run-missing-artifact |
| https://lghui-fluid-learning.pages.dev | authenticated application and protected QA origin | no | pages.dev authenticated browser gate proof: not-run-missing-artifact; pages.dev private-video management browser proof: not-run-missing-artifact |

## Browser Proof Artifacts

| Proof | Required for productionRecoveryAllowed | Status | Present |
| --- | --- | --- | --- |
| lghui.top auth-chain browser proof | yes | `not-run-missing-artifact` | no |
| pages.dev authenticated browser gate proof | yes | `not-run-missing-artifact` | no |
| pages.dev private-video management browser proof | no | `not-run-missing-artifact` | no |

## Blockers

- Required teacher/student QA account inputs are missing; real-account proof is blocked/not-run.
- Required lghui.top and pages.dev browser proof artifacts are missing for Round297.

## Boundary

- `presentKey` names prove only that an environment label exists; they do not prove the account can log in.
- `lghui.top` and `lghui-fluid-learning.pages.dev` remain separate proof origins.
- Missing credentials or missing browser proof artifacts must be reported as blocked/not-run, never as production ready.

## Commands

- `node tools/check-round297-auth-readiness-ledger.mjs --json`
- `node tools/check-fluid-auth-env-readiness.mjs --json --production --require-private-video`
- `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version round297-real-qa-account-readiness-ledger-20260614`
- `node tools/check-authenticated-browser-gate.mjs --production --expected-version round297-real-qa-account-readiness-ledger-20260614`
