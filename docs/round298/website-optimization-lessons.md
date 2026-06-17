# Round298 Website Optimization Lessons

Version: `round298-website-optimization-lessons-drift-gate-20260614`

Round298 Worker F distills Rounds 287-297 into a drift gate. The artifact is not a deployment claim; it is route material that says which proof must exist before a later public release can be called current.

## Source Anchors

- Current release feed: `round298-lghui-top-pagesdev-auth-facet-proof-20260614`
- Edge constants: `round298-lghui-top-pagesdev-auth-facet-proof-20260614` / `round298-lghui-top-pagesdev-auth-facet-proof-20260614`
- Real-exam truth: 316/316 source atoms and 61/61 grouped sections remain visible-ledger facts, not hidden JSON-only facts.
- 181103 truth: 38 protected materials, 30 study routes, and 61 review tasks stay path-safe.
- Real QA account browser state: blocked/not-run
- Public JSON budget: 250.0 KiB with gzip sidecars.

## Lessons And Drift Gates

### Public shell and authenticated source stay separate

- Rounds: 287-297
- Lesson: A public proof must name lghui.top, while authenticated browser proof belongs to lghui-fluid-learning.pages.dev. Passing one facet does not silently prove the other.
- Drift gate: Keep separate public-shell and authenticated-source evidence rows; fail release language when the origins are merged.
- Artifacts: `data/fluid-round297-dual-origin-proof.json`, `docs/round297/website-optimization-lessons.md`, `tools/check-public-entry-browser.mjs`

### Visible ledgers beat hidden JSON

- Rounds: 287-297
- Lesson: Counts that affect study trust must appear in the page or gate report, not only in a data file or aria label. The durable anchors are 316/316, 61/61, 181103 38/30/61, and visible blocked states.
- Drift gate: Reject any upgrade that moves the count truth back into hidden JSON without a visible learner/teacher-facing ledger.
- Artifacts: `data/fluid-round297-real-exam-visible-locks.json`, `data/fluid-round294-website-optimization-ledger.json`, `docs/round294/website-optimization-lessons.md`

### No fake account QA

- Rounds: 287-297
- Lesson: Anonymous pages, mock gates, dry runs, 401s, and local readiness checks are not real teacher/student browser proof.
- Drift gate: When real QA account inputs or browser artifacts are absent, the only valid machine state is blocked/not-run.
- Artifacts: `data/fluid-round297-auth-readiness-ledger.json`, `docs/round297/auth-readiness-ledger.md`

### R2 is an infrastructure boundary

- Rounds: 287-297
- Lesson: Private-video UI hardening can improve safety, but storage-backed upload, publish, archive, delete, and access-change recovery require FM_PRIVATE_MEDIA R2 proof.
- Drift gate: Keep production recovery false until real teacher browser proof and Cloudflare Production FM_PRIVATE_MEDIA R2 binding are both proven.
- Artifacts: `data/fluid-round297-auth-readiness-ledger.json`, `docs/round296/website-optimization-lessons.md`

### JSON growth needs a gzip budget

- Rounds: 289-297
- Lesson: Large evidence belongs behind intent-driven links; new public round ledgers need byte budgets and gzip sidecars that inflate byte-for-byte to the JSON.
- Drift gate: Round298 output stays under the 250 KiB round budget, writes a gzip sidecar, and records byte-for-byte gzip verification.
- Artifacts: `data/fluid-round297-public-json-budget.json`, `data/fluid-round298-optimization-lessons.json`

### Mobile and a11y are release gates

- Rounds: 287-297
- Lesson: Route chips, counters, and blocker panels need 390px overflow checks, 44px targets, focus-visible states, and screen-reader labels before they are release-ready.
- Drift gate: Carry mobile/a11y expectations as gate language, not optional polish.
- Artifacts: `docs/round294/website-optimization-lessons.md`, `data/fluid-round297-public-json-budget.json`

### Deployment evidence must collapse to one public version

- Rounds: 287-297
- Lesson: Worker-local passes are route material until site-updates, EDGE_HOME_VERSION, public shell, browser entry proof, monitor output, and authenticated-source evidence agree.
- Drift gate: Do not call a release current from local checks alone; require concrete deployment evidence and one visible versioned public surface.
- Artifacts: `site-updates.json`, `functions/_middleware.js`, `tools/check-public-entry-browser.mjs`, `tools/monitor-fluid-public-release.mjs`

## Round298 Acceptance

- Public/auth origin separation: `lghui.top` public shell proof and `lghui-fluid-learning.pages.dev` authenticated source proof are separate gates.
- Visible ledgers not hidden JSON: learner and teacher surfaces must show the counts and blockers they depend on.
- No fake account QA: real QA account claims require the browser gate; absent inputs remain blocked/not-run.
- R2 boundary: `FM_PRIVATE_MEDIA` R2 is required before storage-backed private-video production recovery can be claimed.
- Gzip/json budget: `data/fluid-round298-optimization-lessons.json` must stay below 250 KiB, and `data/fluid-round298-optimization-lessons.json.gz` must inflate byte-for-byte to the JSON.
- Mobile a11y: 390px layout, 44px targets, focus-visible states, and screen reader labels stay release-gate language.
- Deployment evidence: site-updates.json, EDGE_HOME_VERSION, monitor-fluid-public-release.mjs, and check-public-entry-browser.mjs must converge before release wording.

## Output Budget

- JSON bytes: 25851
- Gzip bytes: 4078
- Markdown bytes: 5402
- Acceptance: pass
