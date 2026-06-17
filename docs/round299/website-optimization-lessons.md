# Round299 Website Optimization Lessons

Version: `round299-website-optimization-lessons-machine-gate-20260614`

Round299 Worker E distills the Round298 to Round299 website optimization lessons into a machine-checked artifact. This is not a deployment claim; it is a gate that keeps later release wording honest.

## Source Anchors

- Current feed top: `round299-source-count-audit-private-video-release-20260614`
- Edge constants: `round299-source-count-audit-private-video-release-20260614` / `round299-source-count-audit-private-video-release-20260614`
- Round298 lessons acceptance: pass
- Live proof state: production ready = false, real-account proof = blocked-missing-credentials
- Real-account/R2 blockers: real-account claim allowed = false, `FM_PRIVATE_MEDIA` R2 present = false
- Formula audit summary: issue count 0, equation numbers 152, OCR pages 916
- Bilibili no-mirror wording present: yes

## Lessons And Drift Gates

### Live proof is not local proof

- Lesson: Local static checks, mock routes, anonymous 401s, and worker-local files are route material. A release claim needs live proof from the public origin, current version visibility, browser/monitor evidence, and real-account proof when the claim touches authenticated behavior.
- Drift gate: Do not promote local proof into live proof. Require lghui.top or pages.dev evidence plus monitor-fluid-public-release.mjs or check-public-entry-browser.mjs output before writing release-current language.
- Artifacts: `data/fluid-round298-auth-facet-proof.json`, `data/fluid-round298-release-claim-boundary.json`, `tools/monitor-fluid-public-release.mjs`, `tools/check-public-entry-browser.mjs`

### Historical ledgers are versioned evidence

- Lesson: site-updates.json, EDGE_HOME_VERSION, and round data ledgers are a historical chain. A new worker may add a later version, but must not rewrite older round meaning or let stale local copies masquerade as the current public surface.
- Drift gate: Keep historical ledger versioning append-style: name the current top version, preserve older round versions as evidence, and record EDGE_HOME_VERSION separately when the source snapshot has moved ahead of the feed.
- Artifacts: `site-updates.json`, `functions/_middleware.js`, `data/fluid-round298-optimization-lessons.json`

### Formula audits need false-positive handling

- Lesson: Formula audit output is a triage ledger, not an automatic content verdict. Regex hits, OCR fragments, and formula-name matches must be classified as confirmed issue, candidate, or false positive before they drive release copy.
- Drift gate: A formula audit false positives section must keep candidate/false-positive language visible and preserve equation-number/OCR evidence instead of turning every match into a blocking defect.
- Artifacts: `data/fluid-textbook-formula-match-audit.json`

### Bilibili wording forbids mirroring

- Lesson: Bilibili material should be introduced through the original player or original link. The public wording must say no-download and no-reupload so no one treats a source link as permission to mirror the video into this site.
- Drift gate: Keep Bilibili no-download/no-reupload wording in the release lesson, and reject any wording that implies raw download, local hosting, or reupload of unauthorized video.
- Artifacts: `site-updates.json`

### Real-account and R2 blockers stay explicit

- Lesson: Private-video production recovery still depends on real teacher/student account browser proof and the Cloudflare Production FM_PRIVATE_MEDIA R2 binding. UI hardening, dry-run checks, and mock gates are not a substitute.
- Drift gate: When either the real-account proof or FM_PRIVATE_MEDIA R2 proof is absent, report blocked/not-run rather than production recovered.
- Artifacts: `data/fluid-round298-release-claim-boundary.json`, `docs/private-video-management-runbook.md`, `data/fluid-round298-auth-facet-proof.json`

### Public shell and source remain split

- Lesson: lghui.top is the public shell; lghui-fluid-learning.pages.dev is the authenticated source. Source repo checks, public-shell checks, and authenticated-source checks must stay as separate facets until one visible versioned public surface proves the release.
- Drift gate: Preserve the public shell/source split in JSON and docs. Fail when lghui.top and pages.dev evidence are merged into one undifferentiated release proof.
- Artifacts: `data/fluid-round297-dual-origin-proof.json`, `data/fluid-round298-auth-facet-proof.json`, `docs/round298/website-optimization-lessons.md`

## Round299 Acceptance

- Live proof vs local proof: `lghui.top` or pages.dev live proof must not be replaced by local proof; monitor-fluid-public-release.mjs and check-public-entry-browser.mjs stay release evidence tools, and real-account proof is required for authenticated claims.
- Historical ledger versioning: site-updates.json, EDGE_HOME_VERSION, and older round versions must be read as a versioned chain, not rewritten into a single flat current state.
- Formula audit false positives: candidate matches, false positive triage, equation numbers, and OCR evidence must stay visible before formula audit text becomes release copy.
- Bilibili no-download/no-reupload: Bilibili content uses the original player or original link only; no-download and no-reupload wording blocks raw mirroring.
- Real-account/R2 blockers: `FM_PRIVATE_MEDIA` R2 and real teacher/student browser proof are required before private-video production recovered language; absent proof stays blocked/not-run.
- Public shell/source split: `lghui.top` public shell/source split from `lghui-fluid-learning.pages.dev` authenticated source remains separate facets until one visible versioned public surface proves release convergence.

## Output Budget

- JSON bytes: 25948
- Gzip bytes: 4394
- Markdown bytes: 5844
- Acceptance: pass
