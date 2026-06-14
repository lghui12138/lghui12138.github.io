# Round318 Release/Public Proof Audit

Audit time: 2026-06-14 18:49:16 CST
Concurrent-local-update pass: 2026-06-14 18:50 CST

Scope: Worker E release/public proof audit only. No files or commands touched
`/Volumes/mac_2T`. This audit keeps `lghui.top` public-shell proof separate
from `lghui-fluid-learning.pages.dev` source/auth proof.

## Current Verdict

Round318 is not publicly releasable yet from this checkout.

Reason: concurrent local Round318 artifacts appeared while this audit was
running, but the public release stack is not converged. The local edge constants
now point to `round318-chapter-practice-shortcuts-20260614`, while
`site-updates.json[0]`, the roadmap current round, `lghui.top`, Pages live
`_edge-status`, and the public shell repo still prove
`round317-real-exam-source-cardinality-20260614`. Treat Round318 as local
artifact/gate evidence only until the source feed, roadmap, Pages deploy,
public shell, and live monitors all name the same Round318 version.

## Fresh Evidence Collected

### Source authority

- Source git state: `main...origin/main`, clean before this audit; concurrent
  Round318 worker files appeared afterward and were not reverted.
- Source `HEAD`: `1c5d8ed Accept full 181103 HTML public proof`.
- `site-updates.json[0].version`:
  `round317-real-exam-source-cardinality-20260614`.
- Initial `functions/_middleware.js` `EDGE_HOME_VERSION` and
  `EDGE_RUNTIME_JS_VERSION` during the public proof run were Round317.
- After the concurrent local update, `functions/_middleware.js` edge constants
  are `round318-chapter-practice-shortcuts-20260614`; this creates a local
  source-authority drift because `site-updates.json[0]` and roadmap current
  remain Round317.
- `node tools/validate-site-content.mjs`: pass, with
  `publicShellSync.sourceLatestVersion` and
  `publicShellSync.publicShellLatestVersion` both equal to Round317.
- `node tools/check-round317-real-exam-source-cardinality.mjs --json`: pass,
  locking `176/325/68/217`, `failedCount=0`.
- `node tools/check-round317-181103-live-html-depth.mjs --json`: pass,
  locking `38/38` HTML material pages and zero viewer/download/embed/local
  leaks.
- `node --check tools/check-round318-*.mjs`: pass.
- `node tools/check-round318-chapter-practice-shortcuts.mjs --json`: pass,
  covering 325 real-exam atoms across 6 chapter shortcuts.
- `node tools/check-round318-real-exam-chapter-practice.mjs --no-write --json`:
  pass, `325` mapped original questions, `failedCount=0`.
- `node tools/check-round318-181103-practice-bridge.mjs --json`: pass,
  `38/38` material pages with study/real-exam bridges, no forbidden hrefs.
- `node tools/check-round318-private-video-boundary.mjs --json`: pass, but it
  explicitly keeps production recovery ineligible.

### `lghui.top` public shell proof

- Live `https://lghui.top/site-updates.json` top version:
  `round317-real-exam-source-cardinality-20260614`.
- `http://lghui.top/` redirects to `https://lghui.top/` with HTTP 301.
- Public deployment verifier: `ok: true`; checked public shell routes such as
  `/`, `/site-updates.json`, `/real-exams`, `/resources.html`, and textbook
  routes independently from the Pages origin.

### Public shell sync proof

- Public shell repo inspected read-only:
  `/Users/kili/Documents/Codex/lghui-private-video-fix`.
- Public shell `HEAD`: `572cae3 Add round317 shell dependencies`.
- Public shell `HEAD == origin/main`, `ahead=0`, `behind=0`.
- Public shell `site-updates.json[0].version`:
  `round317-real-exam-source-cardinality-20260614`.
- Monitor public-shell repo check: `HEAD 572cae3 matches origin/main` and
  eight checked shell HTML files expose the expected Round317 version.

### `pages.dev` source/auth origin proof

- Live `https://lghui-fluid-learning.pages.dev/_edge-status` returned
  `ok=true`, `protected=true`, `edgeHomeVersion=round317-real-exam-source-cardinality-20260614`.
- `FLUID_EXPECTED_EDGE_VERSION=round317-real-exam-source-cardinality-20260614
  FLUID_PUBLIC_SHELL_REPO=/Users/kili/Documents/Codex/lghui-private-video-fix
  node tools/monitor-fluid-public-release.mjs --json`: `PASS`,
  `1041` pass, `0` warn, `0` fail.
- `FLUID_EXPECTED_EDGE_VERSION=round317-real-exam-source-cardinality-20260614
  FLUID_PUBLIC_SHELL_REPO=/Users/kili/Documents/Codex/lghui-private-video-fix
  node tools/verify-fluid-public-deployment.mjs --json`: `ok: true`.

## Round318 Integration Requirements

Before anyone can call Round318 released/current:

1. Converge the existing local Round318 source authorities:
   `site-updates.json[0]`, `functions/_middleware.js` edge constants,
   roadmap/current entry surfaces, and Round318 data/docs/checkers must name
   one Round318 version.
2. Deploy the source app to Cloudflare Pages and prove
   `pages.dev/_edge-status.edgeHomeVersion` equals the Round318 version.
3. Regenerate/sync the public shell so `lghui.top/site-updates.json`,
   shell HTML entry routes, and shell git `HEAD == origin/main` all expose the
   same Round318 version.
4. Re-run public monitor and public deployment verifier with explicit
   `FLUID_EXPECTED_EDGE_VERSION=<round318-version>`.
5. Keep real-account QA and private-video storage claims blocked unless the
   credential-backed teacher/student gates and `FM_PRIVATE_MEDIA` R2 binding
   proof pass in their own evidence layer.
