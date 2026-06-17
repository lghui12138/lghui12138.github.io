# Round325 Optimization Experience Ledger

Version: `round325-optimization-experience-ledger-20260615`
Generated: `2026-06-15T02:05:00+08:00`

This is Round325 worker F output. It records reusable website optimization lessons from the Round324/Round325 handoff and does not claim deployment, live public freshness, authenticated browser QA, or private-video R2 recovery.

## Source Facts

- Round324 worker ledgers: 5/5 (ready-for-main-thread-integration)
- Live proof claimed here: no
- Real-account QA claimed here: no
- Private-video R2 recovery claimed here: no
- 181103 direct HTML materials: 38/38
- 181103 extracted questions: 522
- Real-exam source locks: 325 atoms, 68 grouped sections, 217 grouped subquestions
- Resources discovery checks: 17/17

## Lessons

### stable-generatedAt

- Category: artifact reproducibility
- Source rounds: Round324, Round325
- Rule: Generated ledgers should preserve an existing generatedAt and otherwise use a fixed fallback timestamp, so rerunning --write does not create meaningless churn.
- Anti-regression gate: A checker should fail if generatedAt is based on a fresh wall-clock value instead of an existing value or stable fallback.
- Boundary state: `passed-local`
- Evidence: `tools/check-round324-release-readiness.mjs`, `data/fluid-round325-optimization-experience.json`
- Commands:
  - `node --check tools/check-round325-optimization-experience.mjs`
  - `node tools/check-round325-optimization-experience.mjs --write --json`

### public-shell-sync

- Category: release proof
- Source rounds: Round323, Round324, Round325
- Rule: A source-side Round worker can prepare ledgers, but completion language must wait until the public shell and pages.dev proof agree on the same expected version.
- Anti-regression gate: Reject release-current wording when public shell proof is missing, stale, or merged with source-only checks.
- Boundary state: `not-run`
- Evidence: `data/fluid-round324-release-readiness.json`, `docs/round324/release-readiness.md`, `docs/round306/public-proof-checklist.md`
- Commands:
  - `node tools/monitor-fluid-public-release.mjs --json --expected-version <expected-version>`
  - `node tools/check-public-entry-browser.mjs --expected-edge-version <expected-version>`

### node-path-playwright

- Category: browser runtime
- Source rounds: Round306, Round323, Round325
- Rule: When Playwright/browser gates run from this lightweight source tree, carry the bundled runtime through NODE_PATH instead of weakening browser proof into static proof.
- Anti-regression gate: Browser proof remains blocked/not-run if the Playwright runtime is unavailable; static JSON checks do not replace it.
- Boundary state: `not-run`
- Evidence: `docs/round306/public-proof-checklist.md`, `tools/check-authenticated-browser-gate.mjs`
- Commands:
  - `NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tools/check-public-entry-browser.mjs --expected-edge-version <expected-version>`
  - `NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tools/check-authenticated-browser-gate.mjs --expected-version <expected-version>`

### no-overclaim-private-video-r2

- Category: private-video boundary
- Source rounds: Round323, Round324, Round325
- Rule: Private-video UI/action readiness is local hardening only until real-account QA and FM_PRIVATE_MEDIA R2 binding proof both pass.
- Anti-regression gate: Any production-recovery claim must name real-account browser proof and FM_PRIVATE_MEDIA R2 proof; otherwise status stays blocked.
- Boundary state: `blocked-r2-binding`
- Evidence: `data/fluid-round323-observability-release-readiness.json`, `data/fluid-round324-release-readiness.json`, `data/fluid-round324-private-video-action-matrix.json`
- Commands:
  - `node tools/check-private-video-management-browser.mjs --production --json`
  - `node tools/check-cloudflare-pages-private-video-bindings.mjs --json`

### live-proof-before-completion

- Category: completion discipline
- Source rounds: Round323, Round324, Round325
- Rule: Do not close a round from worker-local output. Completion needs live proof for the public surface and explicit not-run/blocked states for auth, browser, and storage facets.
- Anti-regression gate: Final reports must list gates run and gates intentionally not run; missing live proof cannot be implied by a passing local checker.
- Boundary state: `not-run`
- Evidence: `docs/round317/optimization-experience.md`, `docs/round324/release-readiness.md`
- Commands:
  - `node tools/verify-fluid-release-gate.mjs`
  - `node tools/monitor-fluid-public-release.mjs --json --expected-version <expected-version>`

### mathjax-cachebuster-guard

- Category: rendering freshness
- Source rounds: Round301, Round306, Round325
- Rule: MathJax rendering checks must guard both readiness and cache-busted local script URLs, because stale script caches can mimic a content or formula failure.
- Anti-regression gate: Knowledge/formula browser gates should assert MathJax ready, no merror nodes, and versioned local MathJax script paths.
- Boundary state: `not-run`
- Evidence: `tools/check-authenticated-browser-gate.mjs`, `docs/round301/mobile-a11y-performance-ledger.md`
- Commands:
  - `NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tools/check-authenticated-browser-gate.mjs --expected-version <expected-version>`

### 181103-all-html-policy

- Category: 181103 protected materials
- Source rounds: Round312, Round315, Round317, Round324
- Rule: 181103 materials are accepted only as standalone in-site HTML content: 38/38 direct pages, no viewer shell, no raw binary href, no local path, no iframe/embed/object wrapper.
- Anti-regression gate: A route exists pass is insufficient unless the route exposes direct readable HTML content and zero raw/download/viewer/local-path hits.
- Boundary state: `passed-local`
- Evidence: `data/fluid-round324-181103-content-evidence.json`, `docs/round317/optimization-experience.md`
- Commands:
  - `node tools/check-round324-181103-content-evidence.mjs --check-only --json`
  - `node tools/check-round315-181103-all-html-direct-pages.mjs --write --json`

### real-exam-no-merge-locks

- Category: real-exam source truth
- Source rounds: Round303, Round307, Round324
- Rule: Real-exam optimization must preserve source-section locks: 325 atomic questions, 68 grouped sections, 217 grouped subquestions, and zero failed high-risk split locks.
- Anti-regression gate: Any UI or generated index that lowers count visibility or merges four/five-item source rows is a regression even when total cards still render.
- Boundary state: `passed-local`
- Evidence: `data/fluid-round324-real-exam-expanded-count-guard.json`, `docs/round303/real-exam-no-merge-evidence.md`
- Commands:
  - `node tools/check-round324-real-exam-expanded-count-guard.mjs --check-only --json`
  - `node tools/check-round303-real-exam-no-merge-evidence.mjs --write --json`

### worker-ledgers-are-inputs-not-release

- Category: worker coordination
- Source rounds: Round324, Round325
- Rule: Worker A-E/F ledgers are integration inputs. A main-thread release pass must collapse them into one visible public versioned surface before user-facing release language.
- Anti-regression gate: A worker ledger can be ready-for-main-thread-integration while live/public/auth proof remains required.
- Boundary state: `passed-local`
- Evidence: `data/fluid-round324-release-readiness.json`
- Commands:
  - `node tools/check-round324-release-readiness.mjs --require-ready --expected-version <expected-version>`

### resources-discovery-keeps-boundaries-visible

- Category: resources discovery
- Source rounds: Round324, Round325
- Rule: Resources and home discovery can improve navigation only if it keeps 181103 all-HTML, 522 material questions, real-exam locks, and private-video blockers visible together.
- Anti-regression gate: Discovery UI should not route users to raw 181103 files, hidden stale counts, or private-video copy that masks R2/account blockers.
- Boundary state: `passed-local`
- Evidence: `data/fluid-round324-resources-discovery-a11y.json`
- Commands:
  - `node tools/check-round324-resources-discovery-a11y.mjs --write --json`

### gzip-json-doc-triplet

- Category: artifact reproducibility
- Source rounds: Round300, Round324, Round325
- Rule: Durable optimization memory should ship as checker + JSON + gzip parity + Markdown so future workers can consume machine facts or human context without re-reading session notes.
- Anti-regression gate: Fail if the gzip sidecar does not inflate exactly to JSON or if Markdown omits the same acceptance boundary.
- Boundary state: `passed-local`
- Evidence: `tools/check-round300-optimization-experience-ledger.mjs`, `tools/check-round325-optimization-experience.mjs`
- Commands:
  - `node tools/check-round325-optimization-experience.mjs --write --json`

### anonymous-auth-safety-is-not-qa

- Category: auth proof
- Source rounds: Round306, Round323, Round325
- Rule: Anonymous 401/403 safety and public monitor checks are useful, but they do not prove logged-in teacher/student workflows.
- Anti-regression gate: Reports should separate public anonymous proof, authenticated browser proof, and private-video browser proof as different rows.
- Boundary state: `not-run`
- Evidence: `docs/round306/public-proof-checklist.md`, `data/fluid-round323-observability-release-readiness.json`
- Commands:
  - `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version <expected-version>`
  - `node tools/check-private-video-management-browser.mjs --production --json`

## Boundaries

- Local Round325 output is an optimization-experience ledger, not a deployment or production recovery proof.
- Public freshness remains open until public shell, pages.dev, browser, and release-gate proof run against the expected version.
- Private-video production recovery remains blocked unless real-account QA and FM_PRIVATE_MEDIA R2 proof both pass.
- 181103 material policy remains direct in-site HTML content only: no viewer shell, no raw download route, no local path.
- Real-exam count truth remains source-locked and no-merge: grouped source rows must not be collapsed into fewer visible items.

## Acceptance

- JSON bytes: 16874
- Gzip bytes: 3843
- Markdown bytes: 10497
- Gzip byte exact: pass
- Checks: 16/16
- Acceptance: pass

## Commands

- `node --check tools/check-round325-optimization-experience.mjs`
- `node tools/check-round325-optimization-experience.mjs --write --json`
