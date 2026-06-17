# Worker 5 Round287 Learning UX Report

Date: 2026-06-13 05:16 CST

Scope: index-complete, resources, real-exams, non-data-core UI/CSS/ARIA/mobile checks. Private video backend and real-exam ledger builders were not touched.

## What changed

- `index-complete.html` + `styles/fluid-home-complete.css`: added a compact `round287` workbench strip after the sticky subnav. It gives keyboard-focusable entry points for the real-exam source ledger, the `181103` supplemental resource entry, and the teacher review route without creating a marketing hero.
- `modules/real-exams-dynamic.html`: added a visible "真题原文账本学习路线" under the current ledger and inside the loaded source-granularity panel. The links route from ledger -> current filtered questions -> `181103` resources -> formula-condition checklist, with mobile single-column collapse.
- `resources.html`: fixed the `181103` study-route family mapping to match the real JSON (`byGroup`, `byResourceType`) instead of stale `byStudyGoal` / `byQuestionType`, so the protected index workbench no longer shows route columns as pending when route data exists.
- `tools/check-worker5-learning-ux.mjs`: added a Worker 5 check. It verifies the new homepage, real-exam, and resource entry text/links statically, and can use Playwright or Chrome screenshots when the local browser runtime is available.

## Checks Run

- `node --check tools/check-worker5-learning-ux.mjs`: pass.
- `WORKER5_SKIP_CHROME=1 node tools/check-worker5-learning-ux.mjs`: pass.
  - Mode: static-plus-chrome-screenshots.
  - Static files checked: 4.
  - Verified: homepage workbench entry, real-exam ledger route, resources `181103` route families.
  - Chrome screenshot substep skipped intentionally with `WORKER5_SKIP_CHROME=1` after direct Chrome CLI calls hung in this session.
- `node tests/edge-fluid-upgrade-check.js`: failed on existing data/gate drift, not on this UI patch.
  - PASS 590, WARN 0, FAIL 4.
  - Failures: two gzip JSON mismatches plus round283/round284 real-exam ledger/navigation assertions.
- `node tools/validate-site-content.mjs`: failed on existing round287 data-chain drift.
  - Main pattern: current verified real-exam count is 316 while several generated sidecars/indexes/gates still expect or cover 308; also gzip mismatches and category/source-pack coverage issues.

## Screenshot Status

No fresh screenshots were produced in this run. The Chrome executable hung even for `--version`, so headless screenshot capture was not reliable from this shell session. The Worker 5 script retains screenshot support for environments where Playwright or Chrome CLI works.

## Residual Risks

- The repository already had many dirty files before this closeout, including data, tools, middleware, and generated real-exam artifacts. This report only covers the files touched for Worker 5.
- The real-exam data layer appears mid-transition from 308 to 316 atomic questions. UI copy now follows the current visible 316/61 page state where touched, but release gates still need a data-owner pass.
- Browser screenshot evidence remains missing because of the local Chrome CLI hang; rerun `node tools/check-worker5-learning-ux.mjs` once Playwright or a working Chrome executable is available.
