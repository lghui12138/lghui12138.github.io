# Round296 Public Shell Freshness

Status: PASS

Expected current version: `round296-private-video-browser-proof-budget-20260614`

Source repo: `/Users/kili/Documents/Codex/lghui-source-private-video-work`

Public shell repo: `/Users/kili/Documents/Codex/lghui-private-video-fix`

## Checks

- PASS source site-updates top version is expected
- PASS source EDGE_HOME_VERSION matches expected
- PASS source EDGE_RUNTIME_JS_VERSION matches expected
- PASS public shell site-updates top version matches expected
- PASS public shell served files use only current edge_refresh/current version markers
- PASS source current-entry surface has no stale edge_refresh/current version markers
- PASS real-exams public shell route is version-bound to current release
- PASS question-bank public shell aliases are version-bound to current release
- PASS no forbidden round308 marker appears in public served shell files

## Old Version Leakage

- none

## Boundary

Round264 formula checklist records are allowed only as historical learning-content data. Public shell entry pages, edge_refresh URLs, auth JSON, and current source entry markers must match the expected current version.

## Next Round Behavior

Round296 is already the expected release; any public shell Round295 edge_refresh marker will fail this gate.
