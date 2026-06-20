# Round341 Performance Action Closure

Version: `round341-performance-action-closure-20260615`
Generated: `2026-06-15T04:41:00+08:00`

Round341 closes two low-risk Round336 performance next actions with source changes and a repeatable Node gate. It does not claim the remaining boot/discoverable JSON warnings are fixed.

## Summary

- Status: `pass`
- Closed actions: 2 / 8
- Remaining open actions: 6
- PPTX preload/prefetch findings: 0
- Gzip targets byte-exact: 3 / 3

## Closed Actions

| Action | Status | Implementation | Boundary |
|---|---|---|---|
| `static-pptx-delivery-policy` | `closed-by-round341` | `js/edge-fluid-performance.js blocks manual document assets from runtime prefetch.`<br>`modules/physical-oceanography-home.html marks PPTX links as download-only and data-no-prefetch.`<br>`public-shell:_headers gives PPTX restore paths an explicit manual-download cache policy.` | PPTX files are still large repo-wide static candidates; Round341 only prevents eager/preload/prefetch delivery and makes explicit-click behavior gateable. |
| `gzip-and-cache-negotiation` | `closed-by-round341` | `public-shell:_headers distinguishes JSON, precompressed JSON sidecars, and PPTX restore paths.`<br>`Target large JSON gzip sidecars inflate byte-for-byte to current JSON payloads.`<br>`PPTX cache policy deliberately does not use Content-Encoding: gzip.` | This is a cache/negotiation gate closure, not a user-facing payload-sharding closure. |

## Remaining Open Round336 Actions

- `site-updates-split-current-history`
- `edge-json-warmup-manifest`
- `formula-index-applications-shard`
- `source-search-index-shard`
- `formula-drills-lazy-pack`
- `visibility-regression-gates`

## Checks

| Check | Status |
|---|---|
| round336-source-ledger-present | PASS |
| closed-action-ids-are-round336-actions | PASS |
| edge-runtime-blocks-manual-download-prefetch | PASS |
| pptx-links-marked-manual-download | PASS |
| round336-pptx-targets-exist | PASS |
| no-pptx-preload-or-prefetch-in-critical-files | PASS |
| headers-json-and-gzip-cache-policy-present | PASS |
| headers-pptx-manual-cache-policy-present | PASS |
| gzip-target-json-sidecars-byte-exact | PASS |
| round330-gzip-state-clean | PASS |
| visibility-gates-still-inherited | PASS |

## Verification

- `node --check tools/check-round341-performance-action-closure.mjs`
- `node tools/check-round341-performance-action-closure.mjs --write --json`
- `node --check js/edge-fluid-performance.js`
- `node tools/check-round330-performance-cache.mjs --write --json`
- `node tools/check-fluid-public-load-budget.mjs --json --limit 20`

## Boundary

- Round341 closes exactly two Round336 actions and leaves six open.
- No data shard rewrite, public deploy, VPN/proxy change, or Python execution is part of this closure.
- Static PPTX mitigation means no eager/preload/prefetch delivery plus explicit manual-download/cache policy; it does not remove large files from the repository.
- Gzip/cache closure means byte-exact JSON sidecars and visible headers; it does not close boot/discoverable JSON size warnings or user-facing sharding actions.

## Output Budget

- JSON bytes: 15007
- Gzip bytes: 3026
- Markdown bytes: 3105
- Gzip byte exact: yes
