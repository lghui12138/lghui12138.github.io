# Round307 Public Proof Checklist

Purpose: prevent Round307 optimization work from being reported as released
until the public proof stack is visible, versioned, and backed by real
account/storage evidence where required.

## Source And Version Authorities

Do not call a Round307 release current unless all relevant authorities point at
the same release version:

- `site-updates.json[0].version`
- `functions/_middleware.js` `EDGE_HOME_VERSION`
- `functions/_middleware.js` `EDGE_RUNTIME_JS_VERSION`
- public shell current version on `https://lghui.top/`
- pages.dev `_edge-status.edgeHomeVersion`
- release-gate expected version

## Required Proof Stack

| proof class | required evidence | can close release alone |
|---|---|---:|
| source authority | source feed top plus edge constants match the expected version | no |
| public shell | `lghui.top` visible routes and public JSON expose the expected version without stale current markers | no |
| authenticated origin | `lghui-fluid-learning.pages.dev/_edge-status` reports the expected `edgeHomeVersion` | no |
| public browser entry | bundled-browser gate renders public entry routes with current markers | no |
| release gate | production release gate runs with explicit expected version | no |
| real teacher QA | credential-backed teacher browser flow passes | no |
| real student QA | credential-backed student browser flow passes | no |
| Cloudflare storage audit | `FM_PRIVATE_MEDIA` R2 exists, while `FM_AUDIT` KV remains present | no |
| private-video recovery | R2 audit plus real teacher/student QA plus browser management gate pass together | yes, for private-video recovery only |

## Read-Only Commands

These commands are proof requirements or proof-prep commands. Run them only
when the current operator intentionally has the required credentials and cloud
read access. Missing credentials or missing R2 is a blocker, not a pass.

```sh
node tools/check-round307-optimization-playbook.mjs
```

```sh
node tools/check-round306-release-readiness.mjs --json --no-write
```

```sh
node tools/check-round302-public-shell-proof.mjs --expected-version <expected-version> --json
```

```sh
NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
PUBLIC_ENTRY_BROWSER_CHROME_EXECUTABLE=bundled \
node tools/check-public-entry-browser.mjs --expected-edge-version <expected-version>
```

```sh
NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
AUTH_BROWSER_CHROME_EXECUTABLE=bundled \
FLUID_GATE_MODE=production \
FLUID_REQUIRED_RELEASE_VERSION=<expected-version> \
node tools/verify-fluid-release-gate.mjs
```

```sh
node tools/check-lghui-top-auth-chain.mjs --expected-version <expected-version>
```

```sh
node tools/check-cloudflare-pages-private-video-bindings.mjs --json
```

## Report Template

- Expected version:
- Source authorities matched:
- `lghui.top` top public version:
- pages.dev `_edge-status.edgeHomeVersion`:
- Public browser entry:
- Release gate summary:
- Real teacher QA:
- Real student QA:
- `FM_AUDIT` KV:
- `FM_PRIVATE_MEDIA` R2:
- Public ledger counts visible: 316/61/201, 38/30/61, 916/232
- Worker-local artifacts integrated into one public version:
- Production release claim allowed:
- Private-video recovery claim allowed:
- Blocked/not-run items:

## Hard Stop Rules

- `lghui.top` HTTP 200 is not a current-release proof.
- Source pushed is not production latest until public shell sync and live public
  proof name the same version.
- Anonymous protected-route `401` proves access control only; it is not real
  teacher/student QA.
- Mock, dry-run, or local private-video checks do not prove storage-backed
  upload, publish, access-change, archive, or delete recovery.
- Missing `.auth-browser.env`, missing QA account inputs, skipped authenticated
  browser proof, or missing `FM_PRIVATE_MEDIA` R2 must be written as `blocked`
  or `not run`.
- Worker-local passes must be integrated into one visible public surface before
  release closure.
- Public count ledgers are release evidence only when they are visible and
  version-aligned; hidden JSON-only count fixes are not enough.
