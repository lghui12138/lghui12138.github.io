# Round317 Release Freshness Audit

- date: 2026-06-14
- worker: Round317 release freshness / public surface
- current source version: `round317-real-exam-source-cardinality-20260614`
- inherited no-viewer base: `round316-181103-reader-polish-20260614`
- public shell: `https://lghui.top`
- source origin: `https://lghui-fluid-learning.pages.dev`

## Findings

1. `verify-fluid-release-gate.mjs` still had a stale hard fallback to `round289-answer-evidence-pdf-181103-review-20260613`. The gate now refuses to run if it cannot read `EDGE_HOME_VERSION` from `functions/_middleware.js`.
2. `verify-fluid-public-deployment.mjs` used `round264-formula-condition-checklist-20260522` as ordinary source `edge_refresh` probes. Those probes are now current-version probes, and old Round264 refresh URLs are kept only as explicit stale-upgrade probes.
3. Public history checks previously accepted retained history even when the latest public record could be stale. Public deployment verification now requires `lghui.top/site-updates.json` top record to equal the expected version for both no-cache and ordinary-cache requests.
4. `monitor-fluid-public-release.mjs` now runs a local freshness gate over middleware, root `site-updates.json`, roadmap current version, Round316 no-viewer ledger, and Round317 source-cardinality ledger.
5. `monitor-fluid-public-release.mjs` no longer includes `/Volumes/mac_2T/...` as a public-shell repo candidate.
6. `validate-site-content.mjs` now derives current release from middleware instead of a hardcoded round label and rejects any public-shell current round older than the source current round.
7. `verify-fluid-public-deployment.mjs` now includes 181103 HTML routes and fails those routes if they regress to viewer/wrapper/raw-file surfaces.

## Current Drift Requiring Main Thread Integration

- Local public shell repo currently reports `round316-181103-reader-polish-20260614` while source/middleware/site-updates report `round317-real-exam-source-cardinality-20260614`. This worker did not deploy or push.
- `tools/check-real-exam-integrity-browser.mjs` is still pinned to `DEFAULT_EXPECTED_VERSION = 'round316-181103-reader-polish-20260614'`. It is outside this worker's allowed edit range; update it before treating Round317 browser integrity proof as closed.
- `validate-site-content.mjs` with `FLUID_SKIP_PUBLIC=1` now only fails on that browser-gate pin, after the Round317 current-surface checks pass.

## Verification

```bash
node --check tools/verify-fluid-release-gate.mjs
node --check tools/monitor-fluid-public-release.mjs
node --check tools/verify-fluid-public-deployment.mjs
node --check tools/validate-site-content.mjs
node tools/monitor-fluid-public-release.mjs --dry-run --json
FLUID_SKIP_PUBLIC=1 node tools/validate-site-content.mjs
```

`validate-site-content` remains non-passing until the Round317 browser integrity gate is integrated.
