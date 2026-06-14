# Round306 Public Proof Checklist

Purpose: make the public proof scout result auditable without deployment, pushes,
VPN/proxy changes, credential disclosure, or fake production claims.

## Source Anchors

- Worktree: `/Users/kili/Documents/Codex/lghui-source-private-video-work`
- Current source version: `round307-source-row-181103-video-management-proof-20260614`
- Required local authorities:
  - `site-updates.json[0].version` is the current Round306 source version.
  - `functions/_middleware.js` has `EDGE_HOME_VERSION` equal to the current Round306 source version.
  - `functions/_middleware.js` has `EDGE_RUNTIME_JS_VERSION` equal to the current Round306 source version.

Do not call a Round306 public proof current unless all three authorities match
before any live check is interpreted.

## Public Proof Stack

Run only read-only checks. Do not deploy, push, restart services, change
network/VPN/proxy state, or print credentials.

1. Local source authority check:

   ```sh
   node tools/check-round306-release-readiness.mjs --json --no-write
   ```

   Pass condition: `expectedVersion`, `site-updates top`, `middleware edge
   version`, and generated readiness artifacts all point at the current source
   version while preserving hard blockers.

2. Anonymous public shell/source check:

   ```sh
   node tools/check-round302-public-shell-proof.mjs \
     --expected-version round307-source-row-181103-video-management-proof-20260614 \
     --json
   ```

   Pass condition: `https://lghui.top/site-updates.json` top record matches the
   current Round306 source version, public shell routes do not leak stale round markers,
   and `https://lghui-fluid-learning.pages.dev/_edge-status` reports
   `edgeHomeVersion` equal to the current Round306 source version.

3. Browser public entry check:

   ```sh
   NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
   PUBLIC_ENTRY_BROWSER_CHROME_EXECUTABLE=bundled \
   node tools/check-public-entry-browser.mjs \
     --expected-edge-version round307-source-row-181103-video-management-proof-20260614
   ```

   Pass condition: `lghui.top` public shell and pages.dev entry routes render
   with the current version markers and without stale public-shell drift.

4. Full production gate, only when credentials and Cloudflare audit access are
   intentionally available:

   ```sh
   NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
   AUTH_BROWSER_CHROME_EXECUTABLE=bundled \
   FLUID_GATE_MODE=production \
   FLUID_REQUIRED_RELEASE_VERSION=round307-source-row-181103-video-management-proof-20260614 \
   FLUID_GATE_SUMMARY_PATH=docs/round306/public-proof-summary.local.json \
   node tools/verify-fluid-release-gate.mjs
   ```

   Pass condition: the summary has `authenticatedBrowserChecked=true`,
   `lghuiTopAuthChainChecked=true`, `privateVideoManagementBrowserChecked=true`,
   and `cloudflarePrivateVideoR2BindingAuditChecked=true`. If
   `FM_PRIVATE_MEDIA` is missing, report production private-video recovery as
   blocked even when public shell and browser checks pass.

## Honest Reporting Rules

- `lghui.top` HTTP 200 is not enough. The public shell must be checked against
  the current version and paired with pages.dev `_edge-status.edgeHomeVersion`.
- `site-updates.json` is an array; inspect the first element, not an object
  wrapper or a history search.
- Anonymous `401` JSON from protected pages proves access control only. It is
  not real teacher/student QA.
- Mock, dry-run, public monitor, or local readiness checks do not prove private
  video upload, publish, authorization change, archive, or delete recovery.
- Missing `.auth-browser.env`, missing QA account inputs, skipped browser auth,
  or missing `FM_PRIVATE_MEDIA` R2 binding must be written as `blocked` or
  `not run`, not as pass.

## Round306 Report Template

- Current version checked:
- Local authorities matched: yes/no
- `lghui.top/site-updates.json` top version:
- pages.dev `_edge-status.edgeHomeVersion`:
- Public browser entry result:
- Real teacher QA:
- Real student QA:
- Private-video browser management:
- Cloudflare `FM_PRIVATE_MEDIA` R2 binding:
- Production recovery claim allowed: yes/no
- Residual blockers:
