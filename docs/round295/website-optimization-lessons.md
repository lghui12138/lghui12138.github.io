# Round295 Website Optimization Lessons

Version target: `round295-release-gate-optimization-lessons-20260614`

This note converts the Round294 optimization ledger into Round295 release-gate integration guidance. It prepares the next gate shape without claiming a new public release and without weakening existing checks.

## Release Gate Carry-Forward

- Keep `lghui.top` public shell proof and `lghui-fluid-learning.pages.dev` protected app proof separate.
- A Round295 ledger is not a public release by itself. Public release closure still needs matching release history, edge status, browser entry, monitor output, and authenticated QA proof.
- Optional local ledger gates should only add stricter artifact checks. They must not skip public shell, browser, authenticated QA, or expected-version checks.

## Count And Privacy Locks

- Preserve the 316 source atoms and 61 grouped sections as the real-exam no-merge baseline.
- Preserve 181103 protected-material safe metadata: 38 materials, 30 study routes, and 61 review tasks.
- Keep answer evidence, textbook explanation, and protected material guidance separated. A study route is not original answer-PDF proof.
- Do not expose private source routes, local paths, raw download paths, or source package names in release ledgers.

## Private Video Boundary

- Private-video UI polish remains separate from production recovery.
- Production recovery stays blocked until real teacher browser QA and Cloudflare Pages `FM_PRIVATE_MEDIA` R2 binding are both proven.
- A disabled or limited teacher action needs visible reasoning in the UI and machine-readable blocked status in the gate output.

## Optimization Integration Pattern

- Treat optimization lessons as gate contracts: version binding, source counts, privacy boundary, auth boundary, and browser proof.
- Keep local artifacts reproducible: builder, JSON, gzip sidecar, and markdown report must agree.
- Shared monitor and validate scripts should be edited only when the new artifact needs production-gate visibility; when edited, add checks rather than relaxing old assertions.
