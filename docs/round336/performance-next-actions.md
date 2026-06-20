# Round336 Performance Next Actions

Version: `round336-performance-next-actions-20260615`
Generated: `2026-06-15T04:05:00+08:00`

Round336 converts the Round330 performance/cache WARN state into an executable next-action ledger. It does not claim the warnings are fixed; it records the first safe cuts, fallback behavior, and gates that must pass before warning closure.

## Summary

- Round330 status consumed: `warn` with 12 warnings and 8/8 hard checks passed
- Deploy dry-run package: 266 MB across 2063 files
- Action rows: 8; open: 8; high priority: 5
- Impacted warning bytes represented: 89 MB
- Visibility gates passed: yes
- Source/public-shell version aligned in Round330: yes
- Service worker kill switch pass in Round330: yes

## Action Ledger

| Priority | Action | Warn paths | Next step | Degrade strategy | Gate |
|---|---|---|---|---|---|
| P0 | `site-updates-split-current-history` | site-updates.json (786 KB)<br>site-updates.json (749 KB) | Introduce a tiny current-release manifest for top-version checks and move historical update rows behind a paged or lazy history endpoint/file. | If the split is not ready, keep the current `site-updates.json` path as the fallback authority and cap UI history rendering to the newest rows. | Release gates must still prove source/public-shell version alignment and no stale-current wording. |
| P1 | `edge-json-warmup-manifest` | js/edge-fluid-*.js (7.5 MB) | Replace broad hard-coded warmup lists with a small manifest of critical JSON plus route-level optional packs. | On constrained networks, disable optional warmup and fetch only the route-visible JSON needed for the current screen. | The edge script must not hide 181103 HTML entry links, 522 question counts, or real-exam current links when optional warmup is skipped. |
| P1 | `formula-index-applications-shard` | data/fluid-formula-index.json (3.0 MB)<br>data/fluid-formula-applications.json (15 MB) | Split formula data into a compact searchable index and chapter/formula-id application shards loaded after user intent. | If a shard fetch fails, render the compact formula card and show applications as unavailable without blocking formula search. | Formula search and MathJax readiness checks must still pass without eager loading all application details. |
| P1 | `source-search-index-shard` | data/fluid-source-search-index.json (5.6 MB) | Create a compact source-search manifest plus chapter/material/source-type shards; keep supplemental 181103 routing as safe in-site HTML links. | If full-text shards are unavailable, keep material cards and chapter filters working from the compact manifest. | 181103 material routes must remain 38/38 direct in-site HTML and 522 anchors must remain visible. |
| P2 | `static-pptx-delivery-policy` | resources/physical-oceanography/ppt/物理海洋学导论_学生挖空版.pptx (12 MB)<br>resources/fluid-sources/chapter-8-viscous-incompressible-flow.pptx (6.3 MB)<br>resources/physical-oceanography/ppt/物理海洋学导论_学生挖空版.pptx (12 MB) | Document and enforce a static-file policy: PPTX stays lazy/manual-download only, with lightweight HTML/PDF/metadata previews for discovery. | When bandwidth is constrained, show the preview/metadata and require an explicit user click before requesting PPTX. | Large PPTX mitigation must not delete protected source coverage or turn 181103 content back into raw-download-only routes. |
| P2 | `formula-drills-lazy-pack` | data/fluid-formula-drills.json (5.6 MB) | Route formula drills through chapter-level packs with a small manifest of counts and availability. | If drill packs are unavailable, keep formula index/search visible and show drill mode as deferred. | No formula drill optimization may lower formula index discoverability or mask MathJax failures. |
| P2 | `gzip-and-cache-negotiation` | data/fluid-formula-applications.json (15 MB)<br>resources/physical-oceanography/ppt/物理海洋学导论_学生挖空版.pptx (12 MB)<br>resources/fluid-sources/chapter-8-viscous-incompressible-flow.pptx (6.3 MB)<br>data/fluid-source-search-index.json (5.6 MB)<br>data/fluid-formula-drills.json (5.6 MB)<br>question-banks/181103-material-extracted.json (5.5 MB)<br>data/fluid-formula-applications.json (15 MB)<br>resources/physical-oceanography/ppt/物理海洋学导论_学生挖空版.pptx (12 MB) | Make gzip/static cache expectations visible in the deployment gate and distinguish compressible JSON from already-compressed binary assets. | Serve existing full JSON with current gzip sidecars until sharded assets and gate checks both pass. | A gzip pass alone cannot mark user-facing performance fixed while boot/discoverable JSON warnings remain. |
| P0 | `visibility-regression-gates` | visibility guard | Run content and discovery gates after each payload split and before public release language. | If a split would hide counts or routes, keep the old full JSON/data path and ship only documentation/ledger changes. | Reject any optimization whose local gates pass but 181103 direct HTML, 522 question visibility, or real-exam source locks fail. |

## Detailed Actions

### site-updates-split-current-history

- Priority: P0
- Owner: release/version authority
- Status: `open`
- Impact: The source and public-shell site-updates feeds are both over the critical JSON warning threshold; they are version authority files and may be fetched early.
- Next step: Introduce a tiny current-release manifest for top-version checks and move historical update rows behind a paged or lazy history endpoint/file.
- Implementation sketch:
  - Keep `site-updates.json[0]` semantics stable until public shell and source gates are updated together.
  - Add a compact `site-current.json` or equivalent manifest only after release-gate readers know which authority to check.
  - Load history on demand in the update UI instead of treating all 850 rows as boot-critical data.
- Degrade strategy: If the split is not ready, keep the current `site-updates.json` path as the fallback authority and cap UI history rendering to the newest rows.
- Anti-regression gate: Release gates must still prove source/public-shell version alignment and no stale-current wording.
- Verification:
  - `node tools/check-round330-performance-cache.mjs --write --json`
  - `node tools/check-fluid-public-load-budget.mjs --json --limit 20`
  - `node tools/verify-fluid-release-gate.mjs`

### edge-json-warmup-manifest

- Priority: P1
- Owner: edge performance runtime
- Status: `open`
- Impact: Critical JS currently exposes discoverable JSON references totalling more than 7 MB, which makes prefetch/warmup behavior hard to reason about.
- Next step: Replace broad hard-coded warmup lists with a small manifest of critical JSON plus route-level optional packs.
- Implementation sketch:
  - Default warmup should include only small entry metadata and version/status probes.
  - Formula, source-search, 181103, and real-exam data should be route-triggered or user-intent-triggered.
  - Respect Save-Data, slow connections, and failed fetch backoff as first-class gates.
- Degrade strategy: On constrained networks, disable optional warmup and fetch only the route-visible JSON needed for the current screen.
- Anti-regression gate: The edge script must not hide 181103 HTML entry links, 522 question counts, or real-exam current links when optional warmup is skipped.
- Verification:
  - `node tools/check-fluid-public-load-budget.mjs --json --limit 20`
  - `node tools/check-round324-resources-discovery-a11y.mjs --write --json`

### formula-index-applications-shard

- Priority: P1
- Owner: formula data pipeline
- Status: `open`
- Impact: Formula index/applications combine boot/discovery data with heavy application/question-link data; the applications file alone is about 15 MB.
- Next step: Split formula data into a compact searchable index and chapter/formula-id application shards loaded after user intent.
- Implementation sketch:
  - Keep formula id, title, chapter, and minimal search tokens in the compact index.
  - Move worked applications, question links, mistakes, and remediation tasks into chapter or formula shards.
  - Add a manifest with shard sizes and gzip availability so the UI can choose a smaller request.
- Degrade strategy: If a shard fetch fails, render the compact formula card and show applications as unavailable without blocking formula search.
- Anti-regression gate: Formula search and MathJax readiness checks must still pass without eager loading all application details.
- Verification:
  - `node tools/check-fluid-public-load-budget.mjs --json --limit 20`
  - `NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tools/check-authenticated-browser-gate.mjs --expected-version <expected-version>`

### source-search-index-shard

- Priority: P1
- Owner: source search/data pipeline
- Status: `open`
- Impact: The source-search index is a large static JSON candidate and likely mixes route-discovery fields with deep searchable text.
- Next step: Create a compact source-search manifest plus chapter/material/source-type shards; keep supplemental 181103 routing as safe in-site HTML links.
- Implementation sketch:
  - Keep material id, safe route, chapter, source type, and counts in the compact manifest.
  - Move full notes/search text and formula cues into lazy shards.
  - Preserve path-safety filters so no local paths, raw downloads, or viewer wrappers reappear.
- Degrade strategy: If full-text shards are unavailable, keep material cards and chapter filters working from the compact manifest.
- Anti-regression gate: 181103 material routes must remain 38/38 direct in-site HTML and 522 anchors must remain visible.
- Verification:
  - `node tools/check-round324-181103-content-evidence.mjs --check-only --json`
  - `node tools/check-round324-resources-discovery-a11y.mjs --write --json`
  - `node tools/check-fluid-public-load-budget.mjs --json --limit 20`

### static-pptx-delivery-policy

- Priority: P2
- Owner: resources/static assets
- Status: `open`
- Impact: Two PPTX files are public static candidates above the repository-wide warning threshold; they inflate deploy size and can be accidentally discovered by broad prefetch.
- Next step: Document and enforce a static-file policy: PPTX stays lazy/manual-download only, with lightweight HTML/PDF/metadata previews for discovery.
- Implementation sketch:
  - Do not preload or prefetch PPTX from home/resources critical paths.
  - Expose file size and file type before download.
  - Prefer derived HTML/PDF preview pages for study flow, while retaining original files where required.
- Degrade strategy: When bandwidth is constrained, show the preview/metadata and require an explicit user click before requesting PPTX.
- Anti-regression gate: Large PPTX mitigation must not delete protected source coverage or turn 181103 content back into raw-download-only routes.
- Verification:
  - `node tools/check-fluid-public-load-budget.mjs --json --limit 20`
  - `node tools/check-round324-181103-content-evidence.mjs --check-only --json`

### formula-drills-lazy-pack

- Priority: P2
- Owner: formula drill data pipeline
- Status: `open`
- Impact: Formula drills are large enough to warn as static data and should not be part of a general discovery warmup.
- Next step: Route formula drills through chapter-level packs with a small manifest of counts and availability.
- Implementation sketch:
  - Keep chapter and count metadata in a compact manifest.
  - Load drill prompts only after the user opens a chapter/drill mode.
  - Cache per-chapter responses separately so one heavy pack does not block all formulas.
- Degrade strategy: If drill packs are unavailable, keep formula index/search visible and show drill mode as deferred.
- Anti-regression gate: No formula drill optimization may lower formula index discoverability or mask MathJax failures.
- Verification:
  - `node tools/check-fluid-public-load-budget.mjs --json --limit 20`

### gzip-and-cache-negotiation

- Priority: P2
- Owner: deployment/cache gate
- Status: `open`
- Impact: Round330 proves gzip sidecars match for JSON, but large JSON/PPTX delivery still needs explicit cache and negotiation policy before warning closure.
- Next step: Make gzip/static cache expectations visible in the deployment gate and distinguish compressible JSON from already-compressed binary assets.
- Implementation sketch:
  - For JSON shards, require byte-exact `.gz` sidecars before release.
  - For PPTX, do not treat gzip as the fix; use lazy delivery, preview pages, and cache headers.
  - Record cache-control expectations beside load-budget results.
- Degrade strategy: Serve existing full JSON with current gzip sidecars until sharded assets and gate checks both pass.
- Anti-regression gate: A gzip pass alone cannot mark user-facing performance fixed while boot/discoverable JSON warnings remain.
- Verification:
  - `node tools/check-round330-performance-cache.mjs --write --json`

### visibility-regression-gates

- Priority: P0
- Owner: release integration
- Status: `open`
- Impact: Performance fixes can reduce payloads by hiding or deferring content; Round336 makes 181103 and real-exam visibility a hard prerequisite before any warning closure.
- Next step: Run content and discovery gates after each payload split and before public release language.
- Implementation sketch:
  - Keep 181103 38/38 direct HTML materials visible.
  - Keep 522 material-question anchors and Resources/Home entry links visible.
  - Keep real-exam 325/68/217 source locks and no-merge rules visible.
- Degrade strategy: If a split would hide counts or routes, keep the old full JSON/data path and ship only documentation/ledger changes.
- Anti-regression gate: Reject any optimization whose local gates pass but 181103 direct HTML, 522 question visibility, or real-exam source locks fail.
- Verification:
  - `node tools/check-round324-181103-content-evidence.mjs --check-only --json`
  - `node tools/check-round324-real-exam-expanded-count-guard.mjs --check-only --json`
  - `node tools/check-round324-resources-discovery-a11y.mjs --write --json`

## 181103 And Real-Exam Protection

- 181103 direct HTML materials: 38/38
- 181103 material-question anchors: 522
- 181103 discovered questions: 522
- Real-exam locks: 325 atoms, 68 grouped sections, 217 grouped subquestions
- Resources discovery checks: 22/22

| Check | Status |
|---|---|
| 181103-direct-html-38-of-38 | PASS |
| 181103-no-raw-download-viewer-local-path | PASS |
| 181103-question-anchors-visible | PASS |
| real-exam-no-merge-locks-visible | PASS |
| resources-discovery-gate-passed | PASS |
| round325-boundary-facts-still-match | PASS |

## Checks

| Check | Status |
|---|---|
| source-artifacts-present | PASS |
| round330-warn-consumed | PASS |
| required-action-ids-present | PASS |
| every-action-is-executable | PASS |
| site-updates-action-has-two-warning-rows | PASS |
| large-json-actions-cover-known-warns | PASS |
| pptx-action-covers-static-warns | PASS |
| visibility-gates-pass | PASS |
| scope-is-readonly-except-round336-artifacts | PASS |
| json-has-no-unsafe-runtime-path | PASS |
| markdown-has-no-unsafe-runtime-path | PASS |
| gzip-byte-exact | PASS |
| json-parses-with-required-shape | PASS |

## Verification

- `node --check tools/check-round336-performance-next-actions.mjs`
- `node tools/check-round336-performance-next-actions.mjs --write --json`
- `node tools/check-round336-performance-next-actions.mjs --json --strict-warnings`
- `node tools/check-round330-performance-cache.mjs --write --json`
- `node tools/check-fluid-public-load-budget.mjs --json --limit 20`

## Boundary

- Round336 is an action ledger on top of Round330; it does not claim the warnings are fixed.
- Any optimization that moves or shards public data must keep 181103 direct HTML, 522 material questions, and real-exam source locks visible.
- Static PPTX mitigation should prefer discoverability and lazy delivery changes before deleting or moving source materials.
- Fallback behavior must keep current full JSON and static files reachable until replacement gates pass.
- Warnings may be promoted to a failing gate with --strict-warnings for planning or release-readiness use.
- JSON bytes: 38076
- Gzip bytes: 5903
- Markdown bytes: 15696
- Gzip byte exact: yes
