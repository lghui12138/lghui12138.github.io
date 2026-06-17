# Fluid Public Release Monitoring

Date: 2026-05-25

`tools/monitor-fluid-public-release.mjs` is a read-only live release monitor for the fluid mechanics Pages deployment and the `lghui.top` public shell. It performs anonymous GET requests only and does not deploy, write remote state, use credentials, or change VPN/proxy/network settings.

This monitor is only the anonymous public/shell layer. Real production acceptance is chained in `tools/verify-fluid-release-gate.mjs`, which also records the dedicated QA teacher/student auth chain, the private-video management browser gate, and the Cloudflare Pages `FM_PRIVATE_MEDIA` R2 binding audit without printing credentials.

## Default Check

```sh
node tools/monitor-fluid-public-release.mjs
```

By default the monitor:

- reads `EDGE_HOME_VERSION` from `functions/_middleware.js`;
- checks `https://lghui-fluid-learning.pages.dev/_edge-status` for that exact edge version;
- checks `https://lghui.top/site-updates.json` with both no-cache and ordinary cached requests;
- verifies the expected public history record is preserved;
- checks key public shell URLs with both no-cache and ordinary cached requests, including the concrete public paths that previously risked 404 or redirect drift:
  - `https://lghui.top/`
  - `https://lghui.top/index-complete.html`
  - `https://lghui.top/question-bank-home.html`
  - `https://lghui.top/practice.html`
  - `https://lghui.top/404.html`
  - `https://lghui.top/site-updates.json`
  - `https://lghui.top/modules/knowledge-upgrade-2026.html`
  - `https://lghui.top/modules/real-exams-dynamic.html`
  - `https://lghui.top/resources/fluid-original-animations.html`
- checks key static assets with both no-cache and ordinary cached requests:
  - `https://lghui.top/favicon.ico`
  - `https://lghui-fluid-learning.pages.dev/favicon.ico`
- records each public URL's final URL and HTTP redirect count;
- verifies monitored HTML pages carry route-specific signals, so a 200 response from the wrong shell page does not pass as a concrete page. The `/question-bank-home.html`, `/practice.html`, and `/404.html` checks accept either the public redirect shell's concrete route marker or the source page's own page copy, avoiding false failures while still detecting route drift.
- checks concrete extensionless source routes such as `/modules/knowledge-detail`, `/modules/question-bank`, `/modules/practice-dynamic`, and `/modules/real-exams-dynamic`, including an old `edge_refresh=round264-formula-condition-checklist-20260522` request.
- verifies login HTML has visible login text, not just a 200 response, and that the hidden `next` input points at the canonical `.html` target such as `/modules/knowledge-detail.html`.
- verifies the `lghui.top` public migration shell stays manual-only and its target route points to the expected canonical Pages route with the current `edge_refresh`.

For the legacy round264 history check, the expected history record must preserve the round264 version plus the formula-condition checklist terms: formula applicability, boundary conditions, unit/direction checks, common mistakes, remedial or real-exam training, and custom animation.

## Browser Smoke Check

Use the browser smoke check when a report says "200 but blank", "login does not jump", or "too many redirects". It opens the live page in Playwright and fails on render-visible problems that plain fetch cannot see:

```sh
FLUID_EXPECTED_EDGE_VERSION=round265-redirect-loop-recovery-20260524 node tools/check-public-entry-browser.mjs
```

The browser check covers:

- concrete extensionless Pages routes and old `edge_refresh` URLs;
- `lghui.top` public shell pages and their Pages target links;
- visible body text length, hidden/transparent body states, and active Service Worker leftovers;
- visible login text and canonical hidden `next`;
- browser console errors, failed requests, and redirect-loop symptoms such as `ERR_TOO_MANY_REDIRECTS`.

For a focused incident probe:

```sh
FLUID_EXPECTED_EDGE_VERSION=round265-redirect-loop-recovery-20260524 node tools/check-public-entry-browser.mjs --urls 'https://lghui-fluid-learning.pages.dev/modules/knowledge-detail,https://lghui-fluid-learning.pages.dev/modules/knowledge-detail?edge_refresh=round264-formula-condition-checklist-20260522,https://lghui.top/question-bank.html'
```

## Warning vs Failure

Failures mean the live release is not acceptable for public monitoring:

- `/_edge-status` is unreachable, invalid JSON, or reports a different `edgeHomeVersion`;
- `site-updates.json` is unreachable, invalid, empty, or missing the expected public history record;
- a key public URL is unreachable;
- a monitored public URL resolves to a different path, hits the redirect limit, or requires more than one HTTP redirect by default;
- a monitored concrete HTML path returns a body missing its route-specific signals;
- a login page returns 200 but has too little visible text, missing login copy, or a hidden `next` that still points to an extensionless route;
- a public shell target points to the wrong route or stale `edge_refresh`;
- a public shell page is older than the expected release and cannot be accepted through retained history;
- an ordinary cached response does not preserve an acceptable release/history condition for public users.
- a monitored static asset such as `favicon.ico` returns non-2xx or an unexpected content type.

Warnings are intentional drift or cache observations that should be visible but do not fail the monitor by default:

- the public shell current page or latest history entry is newer than the expected Pages release, while the expected history record is retained;
- a monitored public URL requires exactly one HTTP redirect but lands on the same concrete path;
- ordinary cached and no-cache response bodies differ but both remain accepted;
- a page is accepted via `site-updates.json` history rather than by directly containing the expected version token.

Use strict mode when warnings should fail an automation:

```sh
node tools/monitor-fluid-public-release.mjs --strict-warnings
```

## Useful Overrides

```sh
FLUID_EXPECTED_EDGE_VERSION=round264-formula-condition-checklist-20260522 node tools/monitor-fluid-public-release.mjs
FLUID_PUBLIC_MONITOR_JSON=1 node tools/monitor-fluid-public-release.mjs
FLUID_PUBLIC_MONITOR_URLS=https://lghui.top/,https://lghui.top/index-complete.html node tools/monitor-fluid-public-release.mjs
FLUID_PUBLIC_MONITOR_ASSET_URLS=https://lghui.top/favicon.ico node tools/monitor-fluid-public-release.mjs
```

## Production Evidence Chain

For a production closeout, use the release gate rather than the anonymous monitor alone:

```sh
NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
AUTH_BROWSER_CHROME_EXECUTABLE=bundled \
FLUID_GATE_MODE=production \
FLUID_REQUIRED_RELEASE_VERSION=<expected-version> \
node tools/verify-fluid-release-gate.mjs
```

The gate output includes `keyChecks.productionEvidenceChain`:

- `publicReleaseMonitor`: anonymous `lghui.top` and Pages public release monitor result.
- `lghuiTopQaAuth`: real QA teacher/student proof through `lghui.top` into `lghui-fluid-learning.pages.dev`.
- `privateVideoManagementBrowser`: authenticated teacher browser proof for private-video management.
- `cloudflareR2BindingAudit`: Cloudflare Pages production binding status for `FM_AUDIT` KV and `FM_PRIVATE_MEDIA` R2.

If `FM_PRIVATE_MEDIA` is missing, the gate records it as an external binding blocker. Do not weaken or skip the QA login checks to compensate, and do not print, commit, or store the QA credentials.

Optional environment variables:

- `FLUID_EXPECTED_EDGE_VERSION`: expected Pages edge version; defaults to `functions/_middleware.js`.
- `FLUID_EDGE_STATUS_URL`: live Pages status URL; defaults to `https://lghui-fluid-learning.pages.dev/_edge-status`.
- `FLUID_PUBLIC_SITE_UPDATES_URL`: public history URL; defaults to `https://lghui.top/site-updates.json`.
- `FLUID_PUBLIC_MONITOR_URLS`: comma-separated public URLs to check.
- `FLUID_PUBLIC_MONITOR_ASSET_URLS`: comma-separated static asset URLs to check by HTTP status and content type; defaults to public shell and source `favicon.ico`.
- `FLUID_PUBLIC_HISTORY_REQUIRED_TERMS`: comma-separated terms for non-round264 expected history checks.
- `FLUID_PUBLIC_MONITOR_ATTEMPTS`: fetch attempts before curl fallback; defaults to `3`.
- `FLUID_PUBLIC_MONITOR_RETRY_MS`: retry base delay; defaults to `1500`.
- `FLUID_PUBLIC_MONITOR_MAX_REDIRECTS`: maximum HTTP redirects to follow before failure; defaults to `5`.
- `FLUID_PUBLIC_MONITOR_REDIRECT_FAILURE_AFTER`: redirect count that becomes a failure when exceeded; defaults to `1`, so one same-path redirect is a warning and two or more redirects are failures.

## Repeat Safety

The monitor is safe to run repeatedly from cron, local QA, or release handoff scripts. It writes no files unless the caller redirects output, uses no secrets, and does not run Wrangler, Git push/fetch, DNS commands, VPN commands, proxy commands, or route/DNS mutation commands.
