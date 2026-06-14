# Round318 Optimization Experience

- version: round318-optimization-experience-20260614
- scope: reusable website optimization lessons from Round317/Round318
- source context: Round317 direct HTML/content-map proof, Round304/Round315 181103 routing contracts, current chapter practice route builders
- code/data changed: none

This artifact records reusable delivery rules only. It does not claim deploy
freshness, public browser proof, real-account QA, private-video production
recovery, or new protected-source extraction.

## R318-G1: Full HTML Content Beats Viewer Shells

The accepted 181103 pattern is direct, readable, in-site HTML content, not a
route that merely points at a binary, iframe, preview wrapper, or old viewer.
Round317's stronger bar is worth keeping: every official material page should
carry real body content plus content-map/navigation affordances, while raw
PDF/PPT/DOC/ZIP hrefs, local paths, `iframe`, `embed`, and `object` remain zero.

Reusable gate commands:

```bash
node tools/check-round315-181103-all-html-direct-pages.mjs --write --json
node tools/check-round316-181103-reader-polish.mjs --write --json
```

Regression wording:

- "38 pages exist" is not enough if they are shells.
- Removing old warning copy is not proof; the live page must show usable course
  content without fallback/viewer markers.

## R318-G2: Chapter Practice Shortcuts Must Preserve Source Locks

Chapter practice shortcuts are useful only when they enter the same source-locked
practice surface as the rest of the real-exam system. Prefer the existing route
shape:

```text
/modules/practice-dynamic.html?type=real&chapter=<chapter>&mode=normal
/modules/practice-dynamic.html?type=real&chapter=<chapter>&mode=normal&from=chapter-topic-focus
./practice-dynamic.html?type=real&chapter=<chapter>&mode=normal&q=<question-id>
```

Do not replace these with static fake anchors or shortcut pages that bypass the
current chapter/question filters, grouped-section count locks, or generated
chapter packs. A shortcut label may say chapter/topic/formula practice, but it
must not imply that 181103 supplemental material is original exam-answer proof.

Reusable source checks:

```bash
node tools/check-round314-answer-source-layering.mjs --write --json
node tools/check-round315-181103-all-html-direct-pages.mjs --write --json
```

## R318-G3: Private-Video Claims Stay Layered

Private-video UI, mock management, anonymous 401 JSON, and source-level action
contracts can be reported as local hardening. They do not prove production media
recovery. Production recovery remains blocked until all required layers are
named and passed: production `FM_AUDIT`, production `FM_PRIVATE_MEDIA`, real
teacher/student browser QA, and the expected release gate.

Use explicit states in reports: `passed-local`, `passed-public-anonymous`,
`passed-authenticated`, `blocked-credential`, `blocked-r2-binding`,
`blocked-freshness`, or `not-run`.

Reusable gate commands:

```bash
node tools/check-cloudflare-pages-private-video-bindings.mjs --json
node tools/check-private-video-management-browser.mjs
FLUID_GATE_MODE=production FLUID_REQUIRED_RELEASE_VERSION=<expected-version> node tools/verify-fluid-release-gate.mjs
```

Boundary wording to preserve:

- Anonymous auth safety is not logged-in QA.
- `FM_AUDIT` is not media storage recovery.
- Missing `FM_PRIVATE_MEDIA` must stay visible as a blocker, not softened into
  "production ready".
