# Round300 Optimization Experience Ledger

Version: `round300-optimization-experience-ledger-20260614`

Round300 worker E records Rounds 287-299 website optimization experience as machine-checkable release memory. This is not a deployment claim; it is a guardrail ledger for later workers.

## Source Facts

- Current feed top: `round300-real-exam-depth-181103-ops-contract-20260614`
- Edge constants: `round300-real-exam-depth-181103-ops-contract-20260614` / `round300-real-exam-depth-181103-ops-contract-20260614`
- Real-exam truth: 316/316 atomic questions, 61/61 grouped sections, stale signatures 0
- 181103 truth: 38 files, 30 routes, 61 review tasks
- Private-video production recovery allowed: no
- Release surface status: `ready-for-production-proof`

## Category Summary

- public proof: 10
- real-exam SoT: 10
- 181103 privacy: 10
- private-video boundary: 10
- browser fallback: 10
- mobile/a11y/perf: 10
- release-gate: 10

## Experience Items

### public proof

- `public-proof-public-origin-named`: A public release proof must name lghui.top, not just a local file or source-origin URL.
  - Anti-regression gate: Fail release wording when the public origin is absent from the proof row.
  - Evidence command: `node tools/check-public-entry-browser.mjs`
  - Next target: Collapse source, shell, monitor, and browser evidence into one visible current-version proof.
- `public-proof-local-pass-is-route-material`: Local static checks and generated ledgers are route material until the public shell proves the same version.
  - Anti-regression gate: Reject any completion summary that promotes local-only checks to public completion.
  - Evidence command: `node tools/monitor-fluid-public-release.mjs`
  - Next target: Keep public shell proof fresh whenever release copy mentions lghui.top.
- `public-proof-feed-top-is-not-enough`: site-updates.json top version is a necessary anchor, but it is not a browser proof by itself.
  - Anti-regression gate: Require feed version plus public entry browser or monitor evidence.
  - Evidence command: `jq -r ".[0].version" site-updates.json`
  - Next target: Make stale round leakage fail before a release note is published.
- `public-proof-edge-version-pair`: EDGE_HOME_VERSION and EDGE_RUNTIME_JS_VERSION must travel with the release feed.
  - Anti-regression gate: Fail if edge constants and site-updates top version drift apart.
  - Evidence command: `node tools/check-round299-release-surface.mjs --json --no-write`
  - Next target: Collapse source, shell, monitor, and browser evidence into one visible current-version proof.
- `public-proof-http-to-https-path`: The public entry chain includes the http to https path, because CDN drift can hide behind HTTPS-only checks.
  - Anti-regression gate: Keep public browser checks covering the public entry path instead of one direct HTTPS URL.
  - Evidence command: `node tools/check-public-entry-browser.mjs`
  - Next target: Keep public shell proof fresh whenever release copy mentions lghui.top.
- `public-proof-monitor-counts-as-public-evidence`: monitor-fluid-public-release.mjs is release evidence because it checks many public routes together.
  - Anti-regression gate: Do not replace the public monitor with one hand-picked route.
  - Evidence command: `node tools/monitor-fluid-public-release.mjs`
  - Next target: Make stale round leakage fail before a release note is published.
- `public-proof-shell-and-source-distinct`: The public shell and pages.dev source answer different proof questions.
  - Anti-regression gate: Store public-shell and source-origin rows separately until the release surface converges.
  - Evidence command: `jq -r ".[0].version" site-updates.json`
  - Next target: Collapse source, shell, monitor, and browser evidence into one visible current-version proof.
- `public-proof-stale-round-marker-blocks`: A stale round marker on any visible public entry blocks current-release language.
  - Anti-regression gate: Scan for old round signatures before accepting a fresh version claim.
  - Evidence command: `node tools/check-round299-release-surface.mjs --json --no-write`
  - Next target: Keep public shell proof fresh whenever release copy mentions lghui.top.
- `public-proof-public-json-safe-only`: Public proof may expose safe audit JSON, but protected source data must remain protected.
  - Anti-regression gate: Keep protected-source checks separate from safe public audit output.
  - Evidence command: `node tools/check-public-entry-browser.mjs`
  - Next target: Make stale round leakage fail before a release note is published.
- `public-proof-current-version-visible`: A release is current only when the visible public surface shows the current version, not only a hidden JSON value.
  - Anti-regression gate: Require a visible marker or public monitor result for current-version claims.
  - Evidence command: `node tools/monitor-fluid-public-release.mjs`
  - Next target: Collapse source, shell, monitor, and browser evidence into one visible current-version proof.

### real-exam SoT

- `real-exam-SoT-atomic-316-anchor`: The 316 atomic real-exam questions are the source-aligned SoT after the 308 to 316 correction.
  - Anti-regression gate: Fail any ledger that falls back to 308 or hides the 316 anchor.
  - Evidence command: `node tools/check-round299-real-exam-count-audit.mjs`
  - Next target: Keep 316 atomic questions and 61 grouped sections as the no-merge source truth.
- `real-exam-SoT-grouped-61-anchor`: The 61 grouped source sections are a separate truth from atomic question count.
  - Anti-regression gate: Fail when grouped sections are merged away or counted only as atomic rows.
  - Evidence command: `node tools/check-round298-real-exam-answer-count-boundary.mjs`
  - Next target: Expose count truth in learner-facing or gate-visible surfaces.
- `real-exam-SoT-source-section-granularity`: Source-section granularity prevents grouped subquestions from being flattened into one vague item.
  - Anti-regression gate: Keep source-section signatures checked in every real-exam count gate.
  - Evidence command: `node tools/check-round297-real-exam-visible-locks.mjs`
  - Next target: Keep answer evidence provenance separate from source-count truth.
- `real-exam-SoT-visible-ledger-required`: Real-exam counts that affect study trust must be visible, not only stored in JSON.
  - Anti-regression gate: Reject count fixes that do not surface a visible ledger or gate report.
  - Evidence command: `jq ".summary" data/fluid-round299-real-exam-count-audit.json`
  - Next target: Keep 316 atomic questions and 61 grouped sections as the no-merge source truth.
- `real-exam-SoT-four-five-locks`: Four-item and five-item grouped locks protect historical source structure.
  - Anti-regression gate: Fail if risky grouped sections lose their lock rows or signatures.
  - Evidence command: `node tools/check-round299-real-exam-count-audit.mjs`
  - Next target: Expose count truth in learner-facing or gate-visible surfaces.
- `real-exam-SoT-web-count-matches-source`: Web atomic question count must match the source atomic count before learner copy can cite it.
  - Anti-regression gate: Compare web atomic rows with source atomic rows and block mismatches.
  - Evidence command: `node tools/check-round298-real-exam-answer-count-boundary.mjs`
  - Next target: Keep answer evidence provenance separate from source-count truth.
- `real-exam-SoT-stale-count-signatures-zero`: Stale count signatures are regressions even when the new JSON looks correct.
  - Anti-regression gate: Require staleCountSignatureCount to stay zero in count audits.
  - Evidence command: `node tools/check-round297-real-exam-visible-locks.mjs`
  - Next target: Keep 316 atomic questions and 61 grouped sections as the no-merge source truth.
- `real-exam-SoT-review-queue-tied-to-counts`: Review navigation and 181103 tasks must stay tied to the 316/61 surface.
  - Anti-regression gate: Fail review queues that drift from current real-exam source counts.
  - Evidence command: `jq ".summary" data/fluid-round299-real-exam-count-audit.json`
  - Next target: Expose count truth in learner-facing or gate-visible surfaces.
- `real-exam-SoT-answer-count-not-answer-proof`: Having 316 answer rows does not prove original answer-PDF provenance.
  - Anti-regression gate: Keep answer-count boundary separate from original answer-PDF evidence.
  - Evidence command: `node tools/check-round299-real-exam-count-audit.mjs`
  - Next target: Keep answer evidence provenance separate from source-count truth.
- `real-exam-SoT-source-count-not-deploy-proof`: A real-exam count audit is not public deployment, auth, or browser proof.
  - Anti-regression gate: Require release-gate evidence before using count gates as release closure.
  - Evidence command: `node tools/check-round298-real-exam-answer-count-boundary.mjs`
  - Next target: Keep 316 atomic questions and 61 grouped sections as the no-merge source truth.

### 181103 privacy

- `181103-privacy-materials-38-anchor`: The 181103 protected-material inventory has 38 accounted source files.
  - Anti-regression gate: Fail if indexed, accounted, and source material counts diverge from 38.
  - Evidence command: `node tools/check-round299-181103-downloads-inventory.mjs`
  - Next target: Preserve 38 guarded materials, 30 study routes, and 61 review tasks without raw path leakage.
- `181103-privacy-routes-30-anchor`: The 30 study routes are the safe learner-facing bridge from protected material to site learning.
  - Anti-regression gate: Fail if protected inventory exists without route-level study intent.
  - Evidence command: `node tools/check-round298-181103-source-coverage.mjs`
  - Next target: Route protected material through study intent rather than raw downloads.
- `181103-privacy-review-61-anchor`: The 61 review tasks connect 181103 material back to the real-exam grouped surface.
  - Anti-regression gate: Fail if review tasks drift from the 61 grouped sections.
  - Evidence command: `node tools/check-fluid-181103-accounting.mjs`
  - Next target: Keep redacted inventories byte-consistent with source accounting.
- `181103-privacy-no-local-paths`: 181103 output must not expose local paths, file URLs, or raw private route details.
  - Anti-regression gate: Scan generated docs and JSON for local path and file URL leakage.
  - Evidence command: `jq ".summary" data/fluid-round299-181103-downloads-inventory.json`
  - Next target: Preserve 38 guarded materials, 30 study routes, and 61 review tasks without raw path leakage.
- `181103-privacy-safe-source-refs`: Guarded inventories should use safe refs, public families, counts, hashes, and byte totals.
  - Anti-regression gate: Reject raw filenames when a safe source reference is enough.
  - Evidence command: `node tools/check-round299-181103-downloads-inventory.mjs`
  - Next target: Route protected material through study intent rather than raw downloads.
- `181103-privacy-no-raw-download-route`: A protected file inventory is not permission to publish raw download routes.
  - Anti-regression gate: Fail docs or JSON that advertise raw download endpoints.
  - Evidence command: `node tools/check-round298-181103-source-coverage.mjs`
  - Next target: Keep redacted inventories byte-consistent with source accounting.
- `181103-privacy-extension-counts-safe`: Extension and family counts are safe metadata when detached from raw protected paths.
  - Anti-regression gate: Keep extension summaries while suppressing direct local identifiers.
  - Evidence command: `node tools/check-fluid-181103-accounting.mjs`
  - Next target: Preserve 38 guarded materials, 30 study routes, and 61 review tasks without raw path leakage.
- `181103-privacy-byte-total-consistency`: Byte totals help prove accounting without exposing protected paths.
  - Anti-regression gate: Fail when source and indexed byte totals mismatch.
  - Evidence command: `jq ".summary" data/fluid-round299-181103-downloads-inventory.json`
  - Next target: Route protected material through study intent rather than raw downloads.
- `181103-privacy-study-native-routing`: 181103 material should return users to knowledge lookup, formulas, review, and textbook support.
  - Anti-regression gate: Reject isolated file lists that do not connect to site-native workflows.
  - Evidence command: `node tools/check-round299-181103-downloads-inventory.mjs`
  - Next target: Keep redacted inventories byte-consistent with source accounting.
- `181103-privacy-privacy-boundary-visible`: Privacy boundary language must be visible in the report, not buried in code comments.
  - Anti-regression gate: Require docs to state summary-only output and non-public source boundaries.
  - Evidence command: `node tools/check-round298-181103-source-coverage.mjs`
  - Next target: Preserve 38 guarded materials, 30 study routes, and 61 review tasks without raw path leakage.

### private-video boundary

- `private-video-boundary-ui-mock-not-production`: Private-video UI/mock readiness improves safety but does not prove production recovery.
  - Anti-regression gate: Fail production-ready claims when only mock gates have run.
  - Evidence command: `node tools/check-round299-private-video-management-state.mjs --json --no-write`
  - Next target: Keep UI/mock readiness separate from real-account browser proof and storage-backed recovery.
- `private-video-boundary-real-account-required`: Real teacher browser proof is required before private-video management is called recovered.
  - Anti-regression gate: Keep missing credentials as blocked/not-run instead of inferred success.
  - Evidence command: `node tools/check-private-video-management-mock.mjs --json`
  - Next target: Require FM_PRIVATE_MEDIA R2 before private-video production recovery language.
- `private-video-boundary-r2-required`: FM_PRIVATE_MEDIA R2 is the storage-backed recovery boundary.
  - Anti-regression gate: Fail upload, publish, archive, delete, or access-change recovery claims without R2 proof.
  - Evidence command: `node tools/check-cloudflare-pages-private-video-bindings.mjs --json`
  - Next target: Make destructive private-video actions typed, dry-run-first, and auditable.
- `private-video-boundary-audit-kv-not-storage`: FM_AUDIT KV alone is useful audit plumbing but is not private media storage.
  - Anti-regression gate: Reject wording that treats KV readiness as media recovery.
  - Evidence command: `jq ".claims" data/fluid-round299-private-video-management-state.json`
  - Next target: Keep UI/mock readiness separate from real-account browser proof and storage-backed recovery.
- `private-video-boundary-typed-delete-confirmation`: Permanent delete needs typed course-id confirmation and detailed course status.
  - Anti-regression gate: Fail destructive UI if delete can proceed without typed identity confirmation.
  - Evidence command: `node tools/check-round299-private-video-management-state.mjs --json --no-write`
  - Next target: Require FM_PRIVATE_MEDIA R2 before private-video production recovery language.
- `private-video-boundary-dry-run-first`: Delete dry-run preflight is a safety gate, not decorative copy.
  - Anti-regression gate: Require dry-run route coverage before delete action readiness is accepted.
  - Evidence command: `node tools/check-private-video-management-mock.mjs --json`
  - Next target: Make destructive private-video actions typed, dry-run-first, and auditable.
- `private-video-boundary-busy-guard-per-course`: Course-level busy guards prevent overlapping publish, archive, access, and delete actions.
  - Anti-regression gate: Fail row actions that can race on the same course id.
  - Evidence command: `node tools/check-cloudflare-pages-private-video-bindings.mjs --json`
  - Next target: Keep UI/mock readiness separate from real-account browser proof and storage-backed recovery.
- `private-video-boundary-student-denial-smoke`: Student denial smoke proves access boundaries better than admin-only happy paths.
  - Anti-regression gate: Keep student access denial checks in private-video regression gates.
  - Evidence command: `jq ".claims" data/fluid-round299-private-video-management-state.json`
  - Next target: Require FM_PRIVATE_MEDIA R2 before private-video production recovery language.
- `private-video-boundary-credential-values-never-written`: Auth readiness may check labels and presence, but must not print credential values.
  - Anti-regression gate: Scan outputs for sensitive markers and credential-value leakage.
  - Evidence command: `node tools/check-round299-private-video-management-state.mjs --json --no-write`
  - Next target: Make destructive private-video actions typed, dry-run-first, and auditable.
- `private-video-boundary-blocked-state-user-visible`: Private-video blocked states must be visible to teachers and release reports.
  - Anti-regression gate: Reject hidden JSON-only blocked state for storage or real-account blockers.
  - Evidence command: `node tools/check-private-video-management-mock.mjs --json`
  - Next target: Keep UI/mock readiness separate from real-account browser proof and storage-backed recovery.

### browser fallback

- `browser-fallback-bundled-chromium-fallback`: When local browser discovery fails, bundled Chromium is the preferred fallback for site QA.
  - Anti-regression gate: Document the fallback command instead of dropping browser evidence silently.
  - Evidence command: `node tools/check-public-entry-browser.mjs`
  - Next target: Prefer bundled Chromium and explicit browser evidence when normal auth browser setup is missing.
- `browser-fallback-node-path-runtime-fallback`: Browser tooling may need the bundled runtime module path before weakening QA claims.
  - Anti-regression gate: Keep runtime fallback instructions with the browser gate command.
  - Evidence command: `node tools/check-real-exam-integrity-browser.mjs`
  - Next target: Record browser-not-run boundaries instead of translating process failures into success.
- `browser-fallback-screenshot-failure-is-open`: A screenshot-process failure leaves browser-image proof open, even if static validation passes.
  - Anti-regression gate: Report screenshot proof as open instead of green.
  - Evidence command: `node tools/check-private-video-management-browser.mjs --help`
  - Next target: Keep local route checks separate from real browser rendering and account proof.
- `browser-fallback-browser-proof-different-from-static`: Static link validation and browser rendering answer different questions.
  - Anti-regression gate: Require browser proof for claims about rendered entry surfaces.
  - Evidence command: `rg -n "AUTH_BROWSER_CHROME_EXECUTABLE|bundled|Playwright|browser" tools docs`
  - Next target: Prefer bundled Chromium and explicit browser evidence when normal auth browser setup is missing.
- `browser-fallback-auth-browser-different-from-public`: Authenticated browser proof on pages.dev is distinct from public shell browsing on lghui.top.
  - Anti-regression gate: Fail merged browser rows that hide the origin and account state.
  - Evidence command: `node tools/check-public-entry-browser.mjs`
  - Next target: Record browser-not-run boundaries instead of translating process failures into success.
- `browser-fallback-real-exam-browser-lock`: Real-exam integrity browser checks protect visible count and route behavior.
  - Anti-regression gate: Run the browser integrity gate after changing real-exam visible ledgers.
  - Evidence command: `node tools/check-real-exam-integrity-browser.mjs`
  - Next target: Keep local route checks separate from real browser rendering and account proof.
- `browser-fallback-private-video-browser-lock`: Private-video browser gates are required for production teacher workflows.
  - Anti-regression gate: Do not accept mock private-video gates as browser acceptance.
  - Evidence command: `node tools/check-private-video-management-browser.mjs --help`
  - Next target: Prefer bundled Chromium and explicit browser evidence when normal auth browser setup is missing.
- `browser-fallback-browser-env-absence-blocked`: Missing browser/auth env should produce blocked/not-run, not invented pass output.
  - Anti-regression gate: Require machine-readable blocked state when env inputs are absent.
  - Evidence command: `rg -n "AUTH_BROWSER_CHROME_EXECUTABLE|bundled|Playwright|browser" tools docs`
  - Next target: Record browser-not-run boundaries instead of translating process failures into success.
- `browser-fallback-public-entry-many-routes`: Public browser checks should cover entry pages, not only the homepage.
  - Anti-regression gate: Fail one-page-only public browser evidence for release-current claims.
  - Evidence command: `node tools/check-public-entry-browser.mjs`
  - Next target: Keep local route checks separate from real browser rendering and account proof.
- `browser-fallback-browser-output-summarized`: Browser gate output should be summarized into durable JSON or docs for later workers.
  - Anti-regression gate: Keep command evidence in the generated ledger so future workers can rerun it.
  - Evidence command: `node tools/check-real-exam-integrity-browser.mjs`
  - Next target: Prefer bundled Chromium and explicit browser evidence when normal auth browser setup is missing.

### mobile/a11y/perf

- `mobile-a11y-perf-mobile-390-overflow`: 390px overflow checks are required for route chips, counters, and blocker panels.
  - Anti-regression gate: Fail release-ready wording when narrow mobile overflow has not been checked.
  - Evidence command: `node tools/check-round297-public-json-budget.mjs`
  - Next target: Treat mobile overflow, targets, focus, screen-reader labels, and JSON budget as release gates.
- `mobile-a11y-perf-target-44`: Interactive controls should preserve 44px touch targets on mobile.
  - Anti-regression gate: Reject dense controls that shrink below the mobile target budget.
  - Evidence command: `node tools/check-round297-resources-private-video-a11y.mjs`
  - Next target: Keep large evidence behind intent-driven links and gzip sidecars.
- `mobile-a11y-perf-focus-visible`: Keyboard users need focus-visible states on new route chips and buttons.
  - Anti-regression gate: Scan UI changes for focus-visible handling before release.
  - Evidence command: `node tools/check-round296-upgrade-bundle.mjs`
  - Next target: Prevent visual count ledgers from breaking narrow screens.
- `mobile-a11y-perf-screen-reader-labels`: Icon, counter, and route controls need labels that still make sense to screen readers.
  - Anti-regression gate: Fail unlabeled controls when they carry gate-critical information.
  - Evidence command: `rg -n "390px|44px|focus-visible|screen reader|gzip|budget" docs data tools`
  - Next target: Treat mobile overflow, targets, focus, screen-reader labels, and JSON budget as release gates.
- `mobile-a11y-perf-visible-count-mobile`: Count ledgers must remain readable on mobile, not only on desktop tables.
  - Anti-regression gate: Require mobile-safe formatting for 316/61 and 38/30/61 counters.
  - Evidence command: `node tools/check-round297-public-json-budget.mjs`
  - Next target: Keep large evidence behind intent-driven links and gzip sidecars.
- `mobile-a11y-perf-json-budget`: Large public JSON should stay within the round budget or be explicitly exempted.
  - Anti-regression gate: Run the public JSON budget gate after adding public ledgers.
  - Evidence command: `node tools/check-round297-resources-private-video-a11y.mjs`
  - Next target: Prevent visual count ledgers from breaking narrow screens.
- `mobile-a11y-perf-gzip-sidecars`: Gzip sidecars are part of the public data contract for large ledgers.
  - Anti-regression gate: Require byte-for-byte gzip inflation to match the JSON.
  - Evidence command: `node tools/check-round296-upgrade-bundle.mjs`
  - Next target: Treat mobile overflow, targets, focus, screen-reader labels, and JSON budget as release gates.
- `mobile-a11y-perf-intent-links`: Large evidence belongs behind intent-driven links instead of dumping everything into one page.
  - Anti-regression gate: Reject pages that surface raw large evidence without navigation intent.
  - Evidence command: `rg -n "390px|44px|focus-visible|screen reader|gzip|budget" docs data tools`
  - Next target: Keep large evidence behind intent-driven links and gzip sidecars.
- `mobile-a11y-perf-perf-not-pretty-only`: Performance gates protect learner usability, not just bundle aesthetics.
  - Anti-regression gate: Tie budget evidence to learner routes and public JSON size.
  - Evidence command: `node tools/check-round297-public-json-budget.mjs`
  - Next target: Prevent visual count ledgers from breaking narrow screens.
- `mobile-a11y-perf-a11y-blocker-language`: A11y and mobile constraints should be release-gate language, not optional polish.
  - Anti-regression gate: Fail docs that demote mobile/a11y to future nice-to-have work.
  - Evidence command: `node tools/check-round297-resources-private-video-a11y.mjs`
  - Next target: Treat mobile overflow, targets, focus, screen-reader labels, and JSON budget as release gates.

### release-gate

- `release-gate-expected-version-required`: Release gates need an explicit expected version so stale defaults cannot pass accidentally.
  - Anti-regression gate: Fail gate runs that omit the expected version for current-release claims.
  - Evidence command: `node tools/verify-fluid-release-gate.mjs --expected-version round299-source-count-audit-private-video-release-20260614`
  - Next target: Make release claims converge across feed, edge constants, source ledgers, public shell, browser, monitor, and auth/storage blockers.
- `release-gate-no-gate-weakening`: New optional local gates may add checks but must not weaken public shell, browser, auth, or expected-version gates.
  - Anti-regression gate: Diff gate behavior for weakened release requirements.
  - Evidence command: `node tools/check-round299-release-surface.mjs --json --require-ready --expected-version round299-source-count-audit-private-video-release-20260614`
  - Next target: Keep worker-local output as route material until the main release gate reruns.
- `release-gate-one-visible-public-surface`: Worker splits close only after one visible versioned public surface contains the result.
  - Anti-regression gate: Reject worker-local completion as full release closure.
  - Evidence command: `node --check tools/check-round300-optimization-experience-ledger.mjs`
  - Next target: Ship every machine ledger with JSON, gzip, Markdown, and a checker.
- `release-gate-json-md-gzip-agree`: Machine ledgers should ship JSON, gzip, Markdown, and checker together.
  - Anti-regression gate: Fail when gzip does not inflate byte-for-byte or docs omit the same acceptance facts.
  - Evidence command: `node tools/check-round300-optimization-experience-ledger.mjs --json --no-write`
  - Next target: Make release claims converge across feed, edge constants, source ledgers, public shell, browser, monitor, and auth/storage blockers.
- `release-gate-dirty-worktree-boundary`: Dirty worktree allowances are local-integration boundaries, not production proof.
  - Anti-regression gate: Require release summaries to name any dirty-checkout allowance.
  - Evidence command: `node tools/verify-fluid-release-gate.mjs --expected-version round299-source-count-audit-private-video-release-20260614`
  - Next target: Keep worker-local output as route material until the main release gate reruns.
- `release-gate-auth-storage-blockers-in-gate`: Auth and storage blockers must remain in the release gate when private-video claims are in scope.
  - Anti-regression gate: Fail release reports that remove blocked real-account or R2 states.
  - Evidence command: `node tools/check-round299-release-surface.mjs --json --require-ready --expected-version round299-source-count-audit-private-video-release-20260614`
  - Next target: Ship every machine ledger with JSON, gzip, Markdown, and a checker.
- `release-gate-privacy-in-release-gate`: Release gates must preserve privacy checks for protected 181103 data.
  - Anti-regression gate: Fail release gates that pass while exposing raw protected paths or downloads.
  - Evidence command: `node --check tools/check-round300-optimization-experience-ledger.mjs`
  - Next target: Make release claims converge across feed, edge constants, source ledgers, public shell, browser, monitor, and auth/storage blockers.
- `release-gate-source-of-truth-first`: Release work should patch the source of truth before consumers and mirrors.
  - Anti-regression gate: Reject consumer-only fixes when source ledgers still drift.
  - Evidence command: `node tools/check-round300-optimization-experience-ledger.mjs --json --no-write`
  - Next target: Keep worker-local output as route material until the main release gate reruns.
- `release-gate-no-public-claim-from-monitor-only`: Monitor output is necessary but not sufficient for authenticated or storage-backed claims.
  - Anti-regression gate: Keep monitor proof scoped to public release surfaces.
  - Evidence command: `node tools/verify-fluid-release-gate.mjs --expected-version round299-source-count-audit-private-video-release-20260614`
  - Next target: Ship every machine ledger with JSON, gzip, Markdown, and a checker.
- `release-gate-checker-self-verifies`: A checker should validate its own output budget, categories, fields, and gzip consistency.
  - Anti-regression gate: Run node --check and the checker after every ledger edit.
  - Evidence command: `node tools/check-round299-release-surface.mjs --json --require-ready --expected-version round299-source-count-audit-private-video-release-20260614`
  - Next target: Make release claims converge across feed, edge constants, source ledgers, public shell, browser, monitor, and auth/storage blockers.

## Acceptance

- JSON bytes: 44967
- Gzip bytes: 8051
- Markdown bytes: 30131
- Gzip byte-for-byte: pass
- Checks: 11/11
- Acceptance: pass

## Commands

- `node --check tools/check-round300-optimization-experience-ledger.mjs`
- `node tools/check-round300-optimization-experience-ledger.mjs --json --no-write`
- `node tools/check-round300-optimization-experience-ledger.mjs`
