# Round317 Website Optimization Experience

- version: round317-website-optimization-experience-20260614
- scope: reusable gates for lghui fluid-learning site optimization
- source rounds: Round301, Round303, Round305, Round307, Round312-Round316
- code/data changed: none

This note is an optimization memory artifact. It does not claim deployment, live
freshness, real-account QA, private-video production recovery, or any new source
content correction. Future release gates may cite the rule IDs below directly.

## R317-G1: 181103 Must Be In-Site HTML Content

The 181103 protected-material surface is accepted only when every official
material is a direct, readable, in-site HTML page.

Required acceptance shape:

- official material pages: 38/38
- raw PDF/PPT/DOC/ZIP hrefs on the official surface: 0
- local path leaks: 0
- iframe/embed/object wrapper tags: 0
- legacy viewer, preview-wrapper, conversion-fallback, and manual-refine wording: 0
- reader navigation, study bridge, resources return path, and current real-exam return path are present
- old viewer routes are not treated as the accepted public route

Reusable gates:

- `node tools/check-round312-181103-html-quality-ledger.mjs --write --json`
- `node tools/check-round313-181103-all-html-contract.mjs --write --json`
- `node tools/check-round315-181103-all-html-direct-pages.mjs --write --json`
- `node tools/check-round316-181103-reader-polish.mjs --write --json`

Fail wording to preserve:

- "38 pages exist" is not enough if the pages are download shells, wrappers,
  iframe/object embeds, raw-file indexes, or local-path views.
- A legacy source file that previously needed manual refinement is not closed by
  removing the warning; it must be checked on the live/content page for real
  course text and absence of fallback markers.

## R317-G2: Reader Polish Cannot Loosen The HTML Contract

Reader polish is allowed only on top of the direct-HTML contract. Page-image
documents may add jump rails, anchors, lazy loading, and async decoding, but
they must not reintroduce a viewer shell or binary download path.

Required acceptance shape:

- all 38 official material entries remain independent HTML pages
- all declared page images exist
- long page-image materials expose stable page anchors and jump controls
- page images use lazy loading and async decoding
- malformed intro markup is 0
- mobile overflow guards remain in place

Reusable gate:

- `node tools/check-round316-181103-reader-polish.mjs --write --json`

Fail wording to preserve:

- Performance work that preloads or embeds heavy 181103 artifacts into the
  critical path is a regression, even if it makes a screenshot look complete.

## R317-G3: Real-Exam Counts Must Be Source-Locked, Not Merged

Optimization rounds must not collapse grouped original source sections into
one parent question. The count truth must come from the current real-exam
source-granularity gate, not from stale public copy or a previous round's
summary.

Required acceptance shape:

- source/web atom counts match the current expected version
- grouped sections are split to the current expected count
- grouped child/subquestion count remains visible
- high-risk four-question, five-question, and larger grouped source sections
  stay named or represented in a visible ledger
- mismatch rows are 0
- generated downstream indexes, public shell copy, browser checks, and release
  monitors use the same current count layer

Known recent examples:

- Round303 no-merge evidence locked 176/176 source rows, 325/325 atoms, 68
  grouped sections, and 217 grouped atoms.
- Round314-Round316 kept the current visible count layer at 325/325 atoms,
  68/68 grouped sections, and 217 grouped subquestions.

Reusable gates:

- `node tools/check-round303-real-exam-no-merge-evidence.mjs --write --json`
- `node tools/check-round314-answer-source-layering.mjs --write --json`
- `node tools/check-round315-181103-all-html-direct-pages.mjs --write --json`
- `node tools/check-round316-181103-reader-polish.mjs --write --json`

Fail wording to preserve:

- Do not hard-code 316/61 or 325/68 as timeless truth. A gate must read the
  current expected version and then verify that all public surfaces use that
  same layer.
- A JSON-only pass is not enough if the student-facing page, public shell, or
  browser gate can silently show merged or stale counts.

## R317-G4: Answer Provenance Must Stay Layered

Answer and source optimization must keep provenance layers separate. A visible
answer may be useful for learning while still not being strict original-answer
PDF proof.

Required acceptance shape:

- question PDF proof is labeled as question/stem provenance only
- reference or derived answers remain marked as derived/unproven
- strict original-answer PDF proof remains explicit, including when the count is 0
- textbook support is visible as support, not as original exam-answer proof
- 181103 HTML materials are supplemental learning content, not answer-PDF proof

Reusable gate:

- `node tools/check-round314-answer-source-layering.mjs --write --json`

Fail wording to preserve:

- Do not convert "derived/reference answer exists" into "original answer PDF
  proven".
- Do not use 181103 supplemental materials or textbook support to erase the
  strict-answer-PDF boundary.

## R317-G5: Private Video Production Recovery Has A Hard Boundary

Private-video UI, mock safety, anonymous 401 safety, and public monitor checks
do not prove production media recovery.

Required acceptance shape before production recovery may be claimed:

- production Cloudflare Pages has `FM_AUDIT` KV bound
- production Cloudflare Pages has `FM_PRIVATE_MEDIA` R2 bound
- `tools/check-cloudflare-pages-private-video-bindings.mjs --json` reports the binding truth
- real teacher and student browser QA pass without printing credentials
- reports name whether the media store is R2, fallback/mock, blocked, or not run

Reusable gates:

- `node tools/check-cloudflare-pages-private-video-bindings.mjs --json`
- `node tools/check-private-video-management-browser.mjs`
- `FLUID_GATE_MODE=production FLUID_REQUIRED_RELEASE_VERSION=<expected-version> node tools/verify-fluid-release-gate.mjs`

Fail wording to preserve:

- `401 authentication_required` proves unauthenticated mutation safety only.
- Missing `.auth-browser.env`, missing real QA account flow, or missing
  `FM_PRIVATE_MEDIA` must be reported as blocked/not run, not "production ready".
- UI copy must not hide this blocker behind successful local/mock controls.

## R317-G6: Release Freshness Is A Multi-Facet Proof

Source push, Cloudflare Pages deployment, authenticated app freshness, and
`lghui.top` public-shell freshness are separate facts. A release is not "latest"
until the relevant facets agree on the expected version.

Required acceptance shape:

- source repo version authority names the expected release
- public shell repo/version authority names the same expected release, when the shell is in scope
- Cloudflare Pages deployment or `_edge-status` shows the expected version
- `https://lghui.top/site-updates.json` and key shell routes preserve the expected public record
- `lghui.top` public-shell proof is separate from pages.dev authenticated-app proof
- real QA teacher/student proof is named as passed, blocked, or not run

Reusable gates:

- `node tools/monitor-fluid-public-release.mjs`
- `FLUID_EXPECTED_EDGE_VERSION=<expected-version> node tools/check-public-entry-browser.mjs`
- `FLUID_GATE_MODE=production FLUID_REQUIRED_RELEASE_VERSION=<expected-version> node tools/verify-fluid-release-gate.mjs`
- `node tools/check-round296-public-shell-freshness.mjs`
- `node tools/check-round301-public-release-proof-contract.mjs --write --json`
- `node tools/check-round307-release-readiness.mjs --write --json`

Fail wording to preserve:

- "source pushed" means source pushed; it does not mean `lghui.top` is fresh.
- An anonymous monitor pass is not a substitute for logged-in QA.
- A worker-local readiness artifact must not claim live deployment, browser
  proof, R2 recovery, or real-account QA unless the live gate actually ran.

## R317-G7: Mobile And Performance Claims Need Budget Evidence

Mobile/performance work is accepted only when the budget checks stay visible
and repeatable. It is not enough for a page to render on one desktop viewport.

Required acceptance shape:

- 390px viewport overflow guard passes
- 44px tap-target guard passes
- heavy JSON, 181103 source data, and large evidence artifacts are not eagerly loaded in the critical path
- resource and auth data loads are settled in parallel where possible
- search/filter/status controls have persistent accessible names and status regions
- repeated cards do not carry persistent `will-change`
- MathJax and long formula/content blocks remain mobile-safe
- browser proof is added when the change touches visible layout

Reusable gates:

- `node tools/check-fluid-mobile-performance-budget.mjs`
- `node tools/check-fluid-public-load-budget.mjs --json --limit 8`
- `node tools/check-round301-mobile-a11y-performance-ledger.mjs --json`
- `node tools/check-round307-resources-a11y-performance.mjs --write --json`

Fail wording to preserve:

- Warnings about large public JSON are budget pressure, not automatic release
  failure, but they must stay visible and cannot be omitted from the report.
- Lazy loading and compression evidence are required before accepting public JSON
  growth or heavy route additions.

## R317-G8: Report Boundary Vocabulary

Future optimization reports should use these exact boundary states so gates can
parse them consistently:

| state | meaning |
| --- | --- |
| `passed-local` | static/source check passed; no live production claim |
| `passed-public-anonymous` | public unauthenticated monitor/browser proof passed |
| `passed-authenticated` | real teacher/student or teacher-admin browser proof passed |
| `blocked-credential` | required credential env is unavailable or not used |
| `blocked-r2-binding` | `FM_PRIVATE_MEDIA` production R2 binding is absent or unproven |
| `blocked-freshness` | source is newer than live/public proof, or expected version mismatch remains |
| `not-run` | gate was intentionally not executed and must not be implied |

Required report shape:

- name the expected version
- name changed files or state that no code/data changed
- name all gates run and all gates intentionally not run
- separate local/source, public anonymous, authenticated browser, Cloudflare
  binding, and public-shell freshness proof
- preserve hard blockers instead of turning them into optimistic wording

## Minimal Gate Bundle For Future Rounds

Use this bundle when a future worker needs a compact but meaningful optimization
gate set:

```bash
node tools/check-fluid-optimization-playbook.mjs
node tools/check-fluid-mobile-performance-budget.mjs
node tools/check-round314-answer-source-layering.mjs --write --json
node tools/check-round315-181103-all-html-direct-pages.mjs --write --json
node tools/check-round316-181103-reader-polish.mjs --write --json
node tools/check-round305-private-video-blocker-ui-a11y.mjs --write --json
node tools/check-round307-release-readiness.mjs --write --json
```

For production closeout, add the live chain with the expected version:

```bash
NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
AUTH_BROWSER_CHROME_EXECUTABLE=bundled \
FLUID_GATE_MODE=production \
FLUID_REQUIRED_RELEASE_VERSION=<expected-version> \
node tools/verify-fluid-release-gate.mjs
```

This bundle is a floor, not a replacement for specialized gates when a round
touches new routes, source counts, answer provenance, private video, or public
shell deployment.
