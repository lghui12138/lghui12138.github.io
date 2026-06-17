# Round298 Auth Facet Proof Ledger

Version: `round298-lghui-top-pagesdev-auth-facet-proof-20260614`

Generated at: `2026-06-13T22:19:22.476Z`

Expected static version: `round298-lghui-top-pagesdev-auth-facet-proof-20260614`

Current released version from worker context: `round297-real-qa-account-readiness-ledger-20260614`

Status: PASS

This checker does not require credentials, does not perform a credentialed browser login, and does not print sensitive values.

## Summary

- Static Round298 source ready: yes
- lghui.top public facet: `checked`
- pages.dev auth facet: `checked`
- Live target version visible: no
- Live current released version visible: yes
- Real QA session: `blocked-missing-credentials`
- Production ready: no

## Checks

| Result | Check |
| --- | --- |
| PASS | static source authorities are Round298 |
| PASS | lghui.top and pages.dev origins are distinct |
| PASS | public origin is lghui.top |
| PASS | source origin is pages.dev |
| PASS | AUTH_BROWSER_BASE_URL origin guard passes |
| PASS | public shell routes and site-updates were checked |
| PASS | pages.dev auth JSON facets were checked |
| PASS | real-account status is explicit and non-secret |

## Static Authorities

| Authority | Result | Observed |
| --- | --- | --- |
| site-updates-top-version | PASS | `round298-lghui-top-pagesdev-auth-facet-proof-20260614` |
| edge-home-version | PASS | `round298-lghui-top-pagesdev-auth-facet-proof-20260614` |
| edge-runtime-js-version | PASS | `round298-lghui-top-pagesdev-auth-facet-proof-20260614` |
| public-home-static-marker | PASS | `round298-lghui-top-pagesdev-auth-facet-proof-20260614` |
| source-entry-static-marker | PASS | `round298-lghui-top-pagesdev-auth-facet-proof-20260614` |

## Live Versions

- public-site-updates: `round297-real-qa-account-readiness-ledger-20260614`
- source-edge-status: `round297-real-qa-account-readiness-ledger-20260614`

## lghui.top Public Facet

| Route | Status | HTTP | Expectation | Version |
| --- | --- | --- | --- | --- |
| GET `/` | `checked` | 200 | `matches-expectation` | n/a |
| GET `/site-updates.json` | `checked` | 200 | `matches-expectation` | `round297-real-qa-account-readiness-ledger-20260614` |
| GET `/real-exams.html` | `checked` | 200 | `matches-expectation` | n/a |
| GET `/_edge-status` | `checked` | 301 | `matches-expectation` | n/a |

## pages.dev Auth Facet

| Route | Status | HTTP | Expectation | Version |
| --- | --- | --- | --- | --- |
| GET `/_edge-status` | `checked` | 200 | `matches-expectation` | `round297-real-qa-account-readiness-ledger-20260614` |
| GET `/_edge-login` | `checked` | 200 | `matches-expectation` | n/a |
| GET `/api/auth/me` | `checked` | 401 | `matches-expectation` | n/a |
| GET `/api/private-videos` | `checked` | 401 | `matches-expectation` | n/a |

## AUTH_BROWSER_BASE_URL Guard

- Status: `configured-by-default`
- Configured origin: `default pages.dev`
- Expected origin: `https://lghui-fluid-learning.pages.dev`
- Refused origin: `https://lghui.top`

## Real QA Session

- Status: `blocked-missing-credentials`
- Reason: Required teacher/student QA account labels are missing.
- Credential values printed: no

| Label | Present | Present key |
| --- | --- | --- |
| teacher sign-in name | no | not present |
| teacher sign-in verifier | no | not present |
| student sign-in name | no | not present |
| student sign-in verifier | no | not present |
| expected QA teacher identity | no | not present |
| expected QA student identity | no | not present |

Missing required labels:

- teacher sign-in name
- teacher sign-in verifier
- student sign-in name
- student sign-in verifier
- expected QA teacher identity
- expected QA student identity

## Boundary

- Round298 static source authorities can be staged while live lghui.top/pages.dev still report the current released Round297 version.
- lghui.top is the public shell facet; pages.dev is the authenticated source facet.
- Anonymous 401 JSON from /api/auth/me and /api/private-videos proves only the protected/auth boundary, not real account login.
- Missing credentials or an unrun browser session must remain blocked/not-run and must not be described as real QA completion.
- This checker records no credential values, cookie values, session payloads, local absolute paths, or VPN/proxy state changes.

## Outputs

- `data/fluid-round298-auth-facet-proof.json`
- `data/fluid-round298-auth-facet-proof.json.gz`
- `docs/round298/auth-facet-proof.md`
