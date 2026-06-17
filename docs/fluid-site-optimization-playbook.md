# Fluid Site Optimization Playbook

Date: 2026-06-13 Asia/Shanghai

Scope: lghui fluid-learning site engineering. This playbook turns the last real upgrade rounds into repeatable rules for future rounds. It is not a release diary and does not authorize UI rewrites, middleware changes, question-body edits, deploys, credential search, or network/proxy changes.

## Rule 1: Real Exam Source Parity

Treat a real-exam upgrade as incomplete until the web surface can be checked against source-side evidence, not just against its own rendered counts.

Required evidence before claiming a real-exam round is accepted:

- `data/fluid-real-exam-source-granularity-audit.json` has matching `expectedAtomicQuestionCount` and `webQuestionCount`; weak, missing, and over-split rows are zero.
- `data/fluid-real-exam-alignment-audit.json` shows the same aligned/split totals as the current source-granularity round.
- `data/fluid-real-exam-pdf-fidelity-audit.json` or `data/real-exam-source-index.json` identifies the source year/section/question family used for the comparison.
- For grouped original sections, the acceptance text names the year, source section, expected atomic count, and first/last generated question id.

Do not edit true question stems or answers as part of an optimization round. If a source mismatch is found, create a separate source-fix task and keep the optimization result blocked until the source-fix audit passes.

## Rule 2: Source Index Privacy

Public data indexes must be safe to ship. A source index may expose public route paths, stable source ids, relative resource paths, hashes, byte counts, and non-secret provenance labels. It must not expose local machine paths, local temp paths, `.auth-browser.env`, browser credential variable values, keychain names, cookies, or tokens.

Apply this rule to the public index family:

- `data/fluid-source-materials.json`
- `data/fluid-source-search-index.json`
- `data/fluid-question-source-packs.json`
- `data/fluid-section-source-packs.json`
- `data/fluid-chapter-source-packs.json`
- `data/resource-manifest-large-assets.json`
- `data/real-exam-source-index.json`

If a builder needs local files, keep those paths in the builder input layer or environment variables. The generated public JSON should say `source markdown path redacted`, `protected source document`, or a repo-relative public route instead of a developer-local path.

## Rule 3: Private Video Binding Proof

Private-video management is not verified by an anonymous `401 authentication_required` response alone. That only proves unauthenticated mutation safety.

Before claiming private-video upload, publish, access-change, archive, or streaming recovery is production-ready, collect all of the following:

- `tools/check-cloudflare-pages-private-video-bindings.mjs --json` reports production `FM_AUDIT` KV and `FM_PRIVATE_MEDIA` R2 bindings.
- `tools/smoke-student-access.mjs` still passes local ACL and fallback behavior.
- A logged-in teacher or student browser check reaches the private-video management or viewing surface without leaking credentials.
- Any report names whether the media store is R2, KV fallback, or blocked; a missing R2 binding is an external production blocker, not a UI success.

When the Cloudflare token is unavailable, write the result as `binding audit not run: missing token`, not as verified. Do not look for alternative credentials outside the project.

## Rule 4: Production Facet Split

Production verification has two different facets and both must be named separately.

- `https://lghui.top` is the public shell facet. Verify entry, public shell route hints, `site-updates.json`, shell service-worker behavior, and the handoff from `/_edge-login`.
- `https://lghui-fluid-learning.pages.dev` is the authenticated application facet. Verify teacher/student login state, app routes, module data, and protected JSON from this origin.

Do not use `lghui.top` as the auth base for the authenticated browser gate. Use `tools/check-lghui-top-auth-chain.mjs --production` for the shell-to-auth handoff and use `tools/check-authenticated-browser-gate.mjs` or `tools/check-real-exam-integrity-browser.mjs` against the pages.dev auth origin for logged-in app checks.

Production acceptance wording must include the release version, which facet was checked, and whether QA teacher/student accounts actually completed the browser flow.

## Rule 5: Credential-Available Claims Only

Missing real QA credentials are a hard evidence boundary. If `.auth-browser.env` or `AUTH_BROWSER_*` / `FLUID_AUTH_*` values are unavailable, the only valid conclusions are:

- local static checks passed;
- anonymous production checks passed;
- logged-in QA browser checks are blocked or not run.

Never write `real account verified`, `teacher/student QA passed`, `productionReady: true`, or equivalent closure language when the browser gate reports missing credential env. A skipped browser gate is acceptable only for local/offline development reports and must stay out of production acceptance.

## Rule 6: Source Push Is Not Production Latest

Treat source, Cloudflare Pages, and `lghui.top` as three separate release facts. A commit pushed to `origin/main` only proves the source repository state. It does not prove the current Cloudflare Pages deployment or the public-shell domain.

Before saying a release is live on `lghui.top`, require all of the following:

- the source commit or tag that was deployed is named;
- Cloudflare Pages deployment evidence names the deployment URL or deployment id;
- `site-updates.json`, `/_edge-status`, or the public browser check shows the expected release version from the production origin;
- public-shell verification checks `https://lghui.top` separately from the authenticated `https://lghui-fluid-learning.pages.dev` origin.

If any of these are missing, write `source pushed, production freshness not proven` or `public shell refresh not proven`. Do not collapse that state into `latest`.

## Rule 7: Release Gate Quality Budget

Every new upgrade round must fit inside a small evidence budget unless the report explicitly says why it exceeded it:

- no new production gate skips are allowed in production mode;
- public JSON growth should stay under `qualityBudget.maxPublicJsonGrowthKbPerRound` unless lazy-load or compression evidence is included;
- mobile/performance budget checks must keep the 390px viewport, 44px tap target, no-horizontal-overflow CSS guards, and intent-based heavy JSON loading visible in a static check before browser proof is claimed;
- active or queued roadmap entries must have at least four concrete acceptance checks, not only generic phrases such as `首页有入口`;
- each round must map to at least one script, JSON artifact, browser proof, or documented blocker;
- gzip sidecars for roadmap data must inflate byte-for-byte to the JSON source.

Use `data/fluid-upgrade-roadmap-100.json` as the route budget, `tools/check-fluid-mobile-performance-budget.mjs` as the mobile/performance static budget check, `tools/check-fluid-optimization-playbook.mjs` as the fast local check, and `tools/verify-fluid-release-gate.mjs` as the production gate consumer.

## Rule 8: Round289 Evidence Boundary Queue

Round289 is not allowed to become a content rewrite round. It is a boundary-and-budget round that records what later workers may prove, what must stay blocked, and what must remain static-only until credentials or production bindings exist.

The queue must preserve these six workstreams:

- answer evidence boundary: answers may be labeled as `derivedOrUnproven` or supported by teaching derivations, but not as original-PDF verbatim answers while strict answer evidence remains zero;
- two textbook PDF coverage: Wu/Wang/both-book coverage may be counted from audit artifacts, but missing Wang or both-book links must stay in the gap queue instead of being promoted by wording;
- 181103 review queue: protected material routes may guide review, but source PDFs are not published and insufficient matches stay `needs-review`;
- private-video blocker: missing `FM_PRIVATE_MEDIA` R2 binding remains an external production blocker, regardless of anonymous 401 safety or local UI readiness;
- real account readiness: teacher/student QA can be claimed only after the readiness check and authenticated browser gates run with available credentials;
- mobile performance budget: mobile and performance claims need at least the static budget check plus a browser proof when the change touches visible layout.

Round289 acceptance reports must name which of these streams are checked, queued, blocked, or not run. Do not edit true exam answers, private-video business code, or the public shell to close this round.

## Round 287 Status

Current released site version: `round289-answer-evidence-pdf-181103-review-20260613`.

Round287 is closed only for the surfaces that were actually proven:

- source repo and public-shell repo were pushed;
- `lghui.top` and `lghui-fluid-learning.pages.dev` surfaced the round287 version;
- public monitor, public-entry browser, static gate, and local release gate passed;
- real-exam source-section ledger reached 25 source years, 176 source sections, 316/316 source/web atomic questions, 61/61 grouped sections split, and 0 mismatches;
- 181103 protected study routes surfaced 38 materials, 6 chapter routes, 5 group routes, and 6 type routes.

Two statements remain blocked and must not be upgraded by wording:

- real teacher/student login QA was not run when credential env files were absent;
- private-video production recovery is blocked while Cloudflare Pages production lacks the `FM_PRIVATE_MEDIA` R2 binding.

## Round 288 Target

Next target: `round288-optimization-playbook-quality-budget`.

Acceptance for that round:

- This playbook states executable rules for real-exam source parity, source-index privacy, private-video binding proof, production facet split, credential-available claims, source/production freshness, and quality budget.
- `tools/check-fluid-optimization-playbook.mjs` passes.
- Public source indexes contain no local absolute paths or auth-env markers.
- `data/fluid-upgrade-roadmap-100.json` marks round287 done, round288 active, and the next batch covers real exams, answers, two textbook PDFs, 181103 materials, private video, account verification, performance, mobile, and release gates.
- `data/fluid-upgrade-roadmap-100.json` and `data/fluid-upgrade-roadmap-100.json.gz` are byte-equivalent after gzip inflation.
- The release gate runs the optimization playbook check before production acceptance.

This round should remain documentation/data/tooling only. Do not touch UI, middleware, or true question-body content while closing it.

## Round 289 Worker 6 Target

Current target: `round289-real-exam-answer-evidence-boundary`.

Worker 6 acceptance for the mobile/performance/release-quality slice:

- `data/fluid-upgrade-roadmap-100.json` advances round289 as the active boundary round while preserving the round288 released site version.
- The roadmap records answer evidence boundary, two textbook PDF coverage, 181103 review queue, private-video blocker, real-account readiness, and mobile/performance budget without editing the underlying answer or video business surfaces.
- `tools/check-fluid-mobile-performance-budget.mjs` passes and remains wired through `tools/check-fluid-optimization-playbook.mjs` and `tools/verify-fluid-release-gate.mjs`.
- `data/fluid-upgrade-roadmap-100.json.gz` inflates byte-for-byte to the JSON source.

## Round 311 Agent6 Target

Current target: `round311-all-html-current-counts-guard-20260614`.

This is an optimization-memory and anti-regression round, not a private-video production recovery claim.

Acceptance:

- The current real-exam truth is 325/325 source/web atomic questions, 68/68 split grouped sections, 217 grouped child questions, and 149 lost atoms if grouped parents are merged back.
- The 181103 package remains 38/38 standalone HTML content pages. Public surfaces must not expose raw downloads, local paths, or old wrapper metadata.
- The public shell serves sanitized Round310 181103 metadata, and any legacy Round309 public JSON that remains online must also be sanitized.
- Private-video management may report UI/mock/typed-delete hardening only. Production recovery still requires `FM_PRIVATE_MEDIA` on Cloudflare Pages production and real teacher/student browser QA.
- Local checker success is not a live release proof. `lghui.top`, `lghui-fluid-learning.pages.dev`, release gate, and browser gate must stay separate proof facets.

Primary gate: `node tools/check-round311-optimization-experience-ledger.mjs`.

## Round 312 HTML Quality Target

Current target: `round312-181103-html-quality-current-surface-20260614`.

This is a content-quality and current-surface guard. It does not claim private-video production recovery.

Acceptance:

- 181103 remains 38/38 in-site HTML pages, but Round312 now checks readable quality, not only page existence.
- Every 181103 material page must have a title, H1, back link, keyboard focus style, no raw PDF/PPT/DOC/ZIP href, no local path, and no legacy viewer token.
- ZIP source rows must link to generated HTML body pages instead of showing mojibake directory shells.
- PDF page-image rows must keep every declared page image present.
- The LibreOffice PPT HTML row must remove conversion metadata noise and keep the mobile overflow guard.
- Public current-entry wording must use 325 real-exam atoms, 68 grouped sections, and 68 review tasks instead of stale 308 or 61 defaults.

Primary gate: `node tools/check-round312-181103-html-quality-ledger.mjs --write --json`.

## Round 313 All-HTML Contract Target

Current target: `round313-181103-all-html-content-contract-20260614`.

This is a stricter 181103 publication contract. It does not claim private-video production recovery.

Acceptance:

- All 38 materials from `181103流体力学` must be direct in-site HTML content pages, not viewer shells.
- Every material page must carry previous/next reader navigation, a study bridge, a resources workbench return path, and a 325/68 real-exam review return path.
- The index must be a compact HTML study workbench with search, group/type scan signals, and 30 routes / 68 review tasks visible.
- No material page may include `viewer`, `iframe`, `embed`, `object`, `converted-frame`, a raw PDF/PPT/DOC/ZIP href, or a local path leak.
- Round312 HTML quality must still pass, including page images, ZIP HTML body links, LibreOffice PPT cleanup, 0 mojibake, and 0 missing image.
- Public current-entry wording must use Round313 while preserving 325 real-exam atoms, 68 grouped sections, and 68 review tasks.

Primary gate: `node tools/check-round313-181103-all-html-contract.mjs --write --json`.

## Round 314 Answer Source Layering Target

Current target: `round314-answer-source-layering-20260614`.

This is an answer-provenance and current-count guard. It inherits the Round313 all-HTML contract but does not claim original answer-PDF proof or private-video production recovery.

Acceptance:

- The visible real-exam answer layer must separate question-PDF proof, reference/derived answers, strict original-answer PDF proof, two-textbook support, and 181103 HTML supplemental materials.
- Strict original-answer PDF proof remains 0; 325 reference answers stay in the derived/unproven layer and must not be written as original exam answers.
- Current real-exam counts remain 325/68/217, and merged parent rows must not replace the original subquestion count.
- Two-textbook support remains visible as 916/916 OCR pages, 232/232 sections, Wu 325, Wang 287, and strong two-textbook support 276.
- 181103 remains 38/38 direct in-site HTML content pages, with no raw file download, local path leak, or preview shell.
- Private-video management copy must keep FM_PRIVATE_MEDIA R2 binding and real teacher/student account QA as production blockers.

Primary gate: `node tools/check-round314-answer-source-layering.mjs --write --json`.

## Round 315 All-HTML Direct Pages Target

Current target: `round315-181103-all-html-direct-pages-20260614`.

This is a publication-contract and regression-proof round for the 181103 package. It does not claim private-video production recovery or real-account QA.

Acceptance:

- The 38 official 181103 material entries must be independent in-site HTML pages, not preview shells, wrappers, iframes, embeds, objects, or raw-file links.
- Each official material page must carry the Round315 version, an HTML content badge, reader navigation, a study bridge, a resources return path, and a current Round315 real-exam return link.
- The full `resources/fluid-181103-html` tree must have zero raw PDF/PPT/DOC/ZIP hrefs, zero local path leaks, and zero iframe/embed/object tags.
- The 181103 index must have real HTML filters that target the material list, not fake `#kind-*` anchors.
- The real-exam surface must show Round315 while preserving 325/325 real-exam atoms, 68/68 grouped sections, 217 grouped subquestions, and strict answer-PDF proof 0.
- Builders and generated indexes must use the same current Round315 version so the next rebuild cannot silently fall back to an older round.

Primary gate: `node tools/check-round315-181103-all-html-direct-pages.mjs --write --json`.

## Round 316 Reader Polish Target

Current target: `round316-181103-reader-polish-20260614`.

This is a reader-polish and regression-proof round for the 181103 package. It keeps the material as native in-site HTML content, not as a viewer or download shell.

Acceptance:

- The 38 official 181103 material entries remain independent in-site HTML pages, with zero viewer, iframe, embed, object, raw-file href, or local path exposure.
- The malformed intro paragraph regression is zeroed out across the official material pages.
- Page-image materials provide an in-page jump rail and stable page anchors.
- All 1099 page-image figures use lazy loading and async decoding after Round354 adds the Office-rendered pages to the reader-polish contract.
- The visible current release advances to Round316 while the Round315 direct-page contract remains a historical gate.
- Real-exam counts remain 325/325, 68/68, and 217 grouped subquestions; grouped parent rows must not replace original source subquestions.
- Private-video management remains a source/UI/mock claim only until `FM_PRIVATE_MEDIA` R2 binding and real teacher/student browser QA pass.

Primary gate: `node tools/check-round316-181103-reader-polish.mjs --write --json`.

## Round 317 Real-Exam Cardinality And 181103 HTML Depth Target

Current target: `round317-real-exam-source-cardinality-20260614`.

This is a no-merge and no-viewer regression round. It treats the user-reported real-exam question-count risk and the 181103 publication contract as current release blockers, not as historical notes.

Acceptance:

- Real exams must lock 176/176 source sections, 325/325 source atoms, 68/68 grouped parent sections, and 217 grouped subquestions.
- Four/five-subquestion parent rows stay split: 18 four/five locks, 21 high-cardinality parents, and 16 short-answer/concept/name-explanation four/five locks all pass with `failedRows=0`.
- The 38 official `181103流体力学` materials must be native in-site HTML content pages, not viewer shells or downloads.
- PDF-derived materials expose all 902 page figures as page anchors; the PPT HTML material exposes 26 HTML slides; the document rows expose 10 in-site text bodies.
- Every 181103 material page must have a structure/content map and `#round317-html-content-start` anchor so audits can prove there is readable HTML body content.
- The official material pages and full 181103 tree must keep zero viewer/download/iframe/embed/object/local-path counters.
- Private-video management remains source/UI/mock only until `FM_PRIVATE_MEDIA` R2 binding and real teacher/student browser QA pass.

Primary gates:

- `node tools/check-round317-real-exam-source-cardinality.mjs --write --json`
- `node tools/check-round317-181103-live-html-depth.mjs --write --json`
