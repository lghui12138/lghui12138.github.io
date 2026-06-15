# Round330 Performance Cache Package Ledger

Version: `round330-performance-cache-package-ledger-20260615`

Round330 worker 5 records the local deployment package, public load budget, gzip sidecar, cache-version authority, and service worker kill-switch state in one repeatable ledger. It does not deploy, edit page HTML, or repair historical artifacts.

## Summary

- Status: WARN
- Hard checks: 8/8
- Warnings recorded: 10
- Deploy dry-run package: 255 MB across 1985 files
- Large included assets in top list: 3
- Public load budget: warn, warnings 10, failures 0
- Gzip mismatches: 0
- Missing large gzip sidecars: 0
- Source cache version: `round358-181103-522-html-practice-release-20260616`
- Public-shell cache version: `round358-181103-522-html-practice-release-20260616`
- Source/public-shell version aligned: true
- Service worker kill switch pass: true

## Deploy Package

- Prepare script dry-run ok: true
- Included: 1985 files, 255 MB
- Ignored: 1423 files, 130 MB
- Missing required assets: 0

| Largest included | Size |
|---|---:|
| `resources/fluid-181103-html/materials/06-fluid-181103-06-2/media/slide13-1-image27.png` | 2.1 MB |
| `data/fluid-chapter-exam-packs.json` | 1.4 MB |
| `question-banks/181103-material-extracted.json` | 1.3 MB |
| `data/fluid-round324-181103-question-discovery.json` | 950 KB |
| `data/fluid-round323-181103-question-ledger.json` | 796 KB |
| `data/fluid-real-exam-source-granularity-audit.json` | 751 KB |
| `site-updates.json` | 664 KB |
| `resources/fluid-181103-html/materials/01-fluid-181103-01-material/pages021.jpg` | 640 KB |

## Public Load Budget

| Warning | Size | Message |
|---|---:|---|
| `site-updates.json` | 664 KB | source:site-updates.json critical JSON size 664 KB |
| `site-updates.json` | 664 KB | public-shell:site-updates.json critical JSON size 664 KB |
| `js/edge-fluid-*.js` | 7.3 MB | source critical JS discoverable JSON refs 7.3 MB (13 files) |
| `data/fluid-formula-index.json` | 3.0 MB | source boot/discoverable JSON data/fluid-formula-index.json 3.0 MB |
| `data/fluid-formula-applications.json` | 15 MB | source large public static candidate data/fluid-formula-applications.json 15 MB |
| `resources/physical-oceanography/ppt/物理海洋学导论_学生挖空版.pptx` | 12 MB | source large public static candidate resources/physical-oceanography/ppt/物理海洋学导论_学生挖空版.pptx 12 MB |
| `resources/fluid-sources/chapter-8-viscous-incompressible-flow.pptx` | 6.3 MB | source large public static candidate resources/fluid-sources/chapter-8-viscous-incompressible-flow.pptx 6.3 MB |
| `data/fluid-source-search-index.json` | 5.6 MB | source large public static candidate data/fluid-source-search-index.json 5.6 MB |

## Gzip Sidecars

- Checked rows: 215
- Matched sidecars: 215
- Mismatches: 0
- Missing large sidecars: 0

| Drift | Size | Detail |
|---|---:|---|
| none |  |  |

## Cache And Service Worker

- Source authority aligned: true
- Public-shell authority aligned to source: true
- Source SW kill switch: true
- Public-shell SW kill switch: true
- Source SW SHA-256: `b8a25b29f15d486f4ba60d374ab8f8015f6c1236930f96e915428dbeed8376b0`
- Public-shell SW SHA-256: `c51f50fe65519456359bef62edf8d06b7f3bbbf7690a68b8349c3f7c1c52c9fa`

## Checks

| Check | Status |
|---|---|
| prepare-deploy-dry-run-json-ok | PASS |
| deploy-package-size-ledger-under-hard-limit | PASS |
| deploy-package-required-assets-present | PASS |
| public-load-budget-has-no-failures | PASS |
| service-worker-kill-switch-visible | PASS |
| source-cache-version-authorities-aligned | PASS |
| gzip-sidecar-drift-is-measured | PASS |
| round330-artifact-budget-visible | PASS |

## Verification

- `node --check tools/check-round330-performance-cache.mjs`
- `node tools/check-round330-performance-cache.mjs --write --json`
- `node tools/prepare-fluid-pages-deploy.mjs --dry-run --json`
- `node tools/check-fluid-public-load-budget.mjs --json --limit 20`

## Boundary

- No page HTML was edited by this checker.
- No Cloudflare deployment or network proof is claimed here.
- Warning drift is visible by default; use `--strict-warnings` when you want warnings to fail the gate.
