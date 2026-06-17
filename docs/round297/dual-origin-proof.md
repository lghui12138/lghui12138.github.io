# Round297 Dual-Origin Proof Ledger

Status: PASS

Expected version: `round297-real-qa-account-readiness-ledger-20260614`
Public shell origin: `https://lghui.top`
Authenticated source origin: `https://lghui-fluid-learning.pages.dev`

## Checks

- PASS expected public origin is lghui.top
- PASS expected authenticated source origin is pages.dev
- PASS public shell and authenticated source origins are distinct
- PASS AUTH_BROWSER_BASE_URL is absent or points at the source origin
- PASS local source authorities are bound to expected version
- PASS route expectations keep public shell and authenticated source proof separate

## Public Shell Facet

Status: `checked`
- CHECKED GET `https://lghui.top/` -> 200
- CHECKED GET `https://lghui.top/_edge-status` -> 301
- CHECKED GET `https://lghui.top/site-updates.json` -> 200
- CHECKED GET `https://lghui.top/real-exams.html` -> 200

## Authenticated Source Facet

Status: `checked`
AUTH_BROWSER_BASE_URL: `configured-by-default`
- CHECKED GET `https://lghui-fluid-learning.pages.dev/_edge-login` -> 200
- CHECKED GET `https://lghui-fluid-learning.pages.dev/api/auth/me` -> 401
- CHECKED GET `https://lghui-fluid-learning.pages.dev/teacher-panel.html` -> 200
- CHECKED GET `https://lghui-fluid-learning.pages.dev/index-complete.html?full=1` -> 200

## Boundary

- HTTP 200 alone is not accepted as production proof.
- Public lghui.top shell evidence and pages.dev authenticated-source evidence are recorded as separate facets.
- Real QA-account browser proof still belongs to the authenticated browser gate on pages.dev with credentials supplied outside this ledger.
- This report intentionally stores no credential values, session material, or local filesystem paths.

## Outputs

- `data/fluid-round297-dual-origin-proof.json`
- `data/fluid-round297-dual-origin-proof.json.gz`
- `docs/round297/dual-origin-proof.md`

