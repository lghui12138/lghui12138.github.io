# Round303 Source / Production Sync

Version: `round303-source-production-sync-20260614`

Expected site version: `round303-release-gate-source-production-sync-20260614`

Generated at: `2026-06-14T01:10:30.936Z`

## Status

- Status: `ready`
- Ready: `true`
- Failures: `0`
- Boundary: This gate separates source push, public shell sync, Pages deployment, and lghui.top freshness. It does not prove real teacher/student account QA or FM_PRIVATE_MEDIA R2 binding.

## Git And Version Checks

| check | result | detail |
|---|---:|---|
| expected-version-present | PASS | expectedVersion=round303-release-gate-source-production-sync-20260614 |
| source-site-updates-top-version | PASS | top=round303-release-gate-source-production-sync-20260614 |
| source-git-clean | PASS | branch=main, head=6d0db62b3096, upstreamHead=6d0db62b3096, releaseDirty=0, localNotes=0 |
| source-git-synced | PASS | branch=main, head=6d0db62b3096, upstreamHead=6d0db62b3096, releaseDirty=0, localNotes=0 |
| public-shell-repo-supplied | PASS | public shell repo supplied |
| public-shell-site-updates-top-version | PASS | top=round303-release-gate-source-production-sync-20260614 |
| public-shell-release-clean-or-not-required | PASS | branch=main, head=16d40498dbaf, upstreamHead=16d40498dbaf, releaseDirty=0, localNotes=1 |
| public-shell-git-synced-or-not-required | PASS | branch=main, head=16d40498dbaf, upstreamHead=16d40498dbaf, releaseDirty=0, localNotes=1 |

## Live Checks

| check | result | status | observed |
|---|---:|---:|---|
| skipped | WARN | 0 | live checks skipped |

## Required Proofs

- source git HEAD equals origin/main
- public shell git HEAD equals origin/main
- site-updates.json top version matches expectedVersion in both repos
- lghui.top public site-updates and homepage carry expectedVersion
- pages.dev _edge-status carries expectedVersion
- Pages deployment URL and source commit are recorded after deploy
