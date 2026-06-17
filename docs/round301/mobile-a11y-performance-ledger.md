# Round301 Mobile/A11y/Performance Ledger

Version: `round301-mobile-a11y-performance-ledger-20260614`

Generated at: `2026-06-13T23:54:47.838Z`

This ledger is a static continuation audit for mobile layout, accessibility, performance budgets, MathJax loading, resources/video controls, and private-video visible blockers. It does not deploy and does not claim private-video production recovery.

## Result

- Overall pass: yes
- Mobile budget: 46 pass / 0 fail
- Public load budget: warn (10 warnings / 0 failures)
- Legacy resources a11y exact-marker check: drift-detected (6 drift item(s))
- Private-video production recovery: false
- Gzip sidecar verified: yes

## Gates

| Gate | Status | Checks |
| --- | --- | ---: |
| mobile-390-and-44px | pass | 3/3 |
| heavy-json-and-public-load-budget | pass | 4/4 |
| mathjax-local-only | pass | 3/3 |
| resources-video-controls-a11y | pass | 6/6 |
| private-video-visible-blockers | pass | 3/3 |

## Checks

| Gate | Check | Status | Blockers |
| --- | --- | --- | --- |
| mobile-390-and-44px | viewport-meta | pass | none |
| mobile-390-and-44px | 390-overflow-static-guards | pass | none |
| mobile-390-and-44px | 44px-tap-targets | pass | none |
| heavy-json-and-public-load-budget | heavy-json-not-critical-prefetch | pass | none |
| heavy-json-and-public-load-budget | intent-search-formula-loading | pass | none |
| heavy-json-and-public-load-budget | public-load-budget-no-failures | pass | none |
| heavy-json-and-public-load-budget | legacy-mobile-budget-pass | pass | none |
| mathjax-local-only | local-mathjax-loader | pass | none |
| mathjax-local-only | core-pages-no-external-mathjax-cdn | pass | none |
| mathjax-local-only | mathjax-mobile-overflow | pass | none |
| resources-video-controls-a11y | video-dialog-semantics | pass | none |
| resources-video-controls-a11y | video-control-labels | pass | none |
| resources-video-controls-a11y | video-keyboard-controls | pass | none |
| resources-video-controls-a11y | video-private-safety-controls | pass | none |
| resources-video-controls-a11y | video-focus-and-touch | pass | none |
| resources-video-controls-a11y | video-cards-accessible | pass | none |
| private-video-visible-blockers | resources-visible-private-video-blocker | pass | none |
| private-video-visible-blockers | prior-ledgers-block-production-recovery | pass | none |
| private-video-visible-blockers | teacher-admin-visible-readiness | pass | none |

## Key Counts

- 390px static no-overflow guard: pass
- 44px tap-target guard: pass
- Heavy JSON eager hits: 0
- Core MathJax external CDN hits: 0
- Resources/video a11y checks: 6/6
- Private-video blocker checks: 3/3

## Warnings

- source:site-updates.json critical JSON size 590 KB
- public-shell:site-updates.json critical JSON size 551 KB
- source:resources.html rel=preload fetch payload 1.2 MB (6 JSON assets)
- source critical JS discoverable JSON refs 7.3 MB (13 files)
- source boot/discoverable JSON data/fluid-formula-index.json 3.0 MB
- source large public static candidate data/fluid-formula-applications.json 15 MB
- source large public static candidate resources/physical-oceanography/ppt/物理海洋学导论_学生挖空版.pptx 12 MB
- source large public static candidate resources/fluid-sources/chapter-8-viscous-incompressible-flow.pptx 6.3 MB
- Legacy Round297 resources a11y exact-marker check drifted with 6 problem(s).

## Boundary

- The public load budget can warn without failing; current warnings are size-budget pressure, not hard failures.
- The legacy Round297 resources a11y script is preserved as a drift signal because it matched exact older copy. Round301 uses current source semantics for the active resources/video a11y audit.
- Private-video upload, publish, access change, archive, delete, and production recovery remain blocked until `FM_PRIVATE_MEDIA` R2 and real teacher/student browser QA are proven elsewhere.
- This script uses Node only, does not run Python/lxml, does not touch VPN/proxy state, and does not read or print credential values.

## Commands

- `node --check tools/check-round301-mobile-a11y-performance-ledger.mjs`
- `node tools/check-round301-mobile-a11y-performance-ledger.mjs --json`
- `node tools/check-fluid-mobile-performance-budget.mjs`
- `node tools/check-fluid-public-load-budget.mjs --json --limit 8`
- `node tools/check-round297-resources-private-video-a11y.mjs --json --no-write`
