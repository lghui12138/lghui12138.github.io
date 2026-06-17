# Fluid Pages Deploy Observability Runbook

Date: 2026-05-25

This runbook prevents future Cloudflare Pages deploy incidents from being misread as website load, source-code, or package failures when the failure is actually in Wrangler's remote Cloudflare API phase.

Safety boundary: the commands below are read-only unless a human/parent process explicitly chooses to run the documented deploy command. Do not change VPN, proxy, DNS, route, Network Extension, TUN, system proxy, or proxy environment state while diagnosing these failures.

## Known Failure Pattern

The 2026-05-24 source deploy failures for commit `7208bb1b` were remote Wrangler/Cloudflare API failures:

- local staging dry-run succeeded;
- Wrangler compiled the Worker successfully;
- one attempt reached `/upload-token`, uploaded or reused all assets, then failed while posting the Pages deployment record to `/deployments`;
- another attempt stalled/faulted while waiting for the `/upload-token` request;
- a later deploy for commit `649849fb` succeeded from the same workspace without VPN/proxy/DNS/route changes.

Treat this pattern as a Cloudflare API/upload-token/deployment-record/fetch failure, not as proof that the site is too heavy or the source tree is broken.

## First Triage

1. Confirm local package preparation.

```sh
node --check tools/prepare-fluid-pages-deploy.mjs
node tools/prepare-fluid-pages-deploy.mjs --dry-run --json
```

Local package trouble is likely only if syntax fails, the dry-run returns `ok=false`, `missingRequired` is non-empty, asset selection is unexpectedly huge, or Wrangler reports a package-size/file-count problem before Cloudflare API interaction.

2. Classify the Wrangler log.

```sh
node --check tools/classify-pages-deploy-log.mjs
node tools/classify-pages-deploy-log.mjs /Users/kili/Library/Preferences/.wrangler/logs/<wrangler-log>.log
```

For copied excerpts:

```sh
pbpaste | node tools/classify-pages-deploy-log.mjs
```

JSON form for QA notes:

```sh
node tools/classify-pages-deploy-log.mjs --json /Users/kili/Library/Preferences/.wrangler/logs/<wrangler-log>.log
```

The classifier is local-only: it reads stdin or local files, uses no credentials, makes no network requests, and never deploys.

3. Compare against the failure classes below.

| Class | Typical decisive signals | Meaning | Next action |
|---|---|---|---|
| `build-package-failure` | `npm ERR!`, missing module, syntax/transform error, build failed, missing required control files, package too large | Local build, dependency, syntax, staging, or package-selection problem | Fix local source/package issue before another deploy |
| `cloudflare-api-failure` | `Compiled Worker successfully` followed by `/upload-token`, `/deployments`, `TypeError: fetch failed`, `SocketError`, `UND_ERR_SOCKET`, `other side closed`, timeout/API 5xx/429 | Wrangler reached remote Pages/API work and failed on Cloudflare API/transport/deployment-record creation | Do not blame website load or package; preserve log, re-check local staging, retry only when explicitly authorized |
| `runtime-auth-redirect-issue` | `ERR_TOO_MANY_REDIRECTS`, post-login not auto-redirecting, `/_edge-login`, `fm_auth_session_v2`, `fm_session_v2`, login bridge storage wipe signals | Deploy may have completed, but browser auth handoff or protected-route navigation is still broken | Do not accept 200/deploy success alone; verify `/_edge-login`, `Clear-Site-Data`, localStorage session keys, protected `next`, and real-browser login screenshot |
| `success` | `Deployment complete` or equivalent success with no failure signal | Deploy command completed | Run live release verification |
| `mixed-or-ambiguous` | both local build/package and remote API failure signals, or too little context | Need the first fatal error and last successful phase | Capture more log context before deciding |

## Remote API Failure Checklist

Use this checklist when the classifier reports `cloudflare-api-failure` or the log manually matches that class:

- preserve the log path and the first fatal error line;
- record whether `/upload-token`, asset upload, or `/deployments` was the last remote step;
- record whether `Compiled Worker successfully` appeared before the error;
- record whether `Success! Uploaded ...` or `already uploaded` appeared before the deployment-record failure;
- do not change network state to "prove" the theory;
- do not classify public 404/load/public-shell drift as the same incident unless live route checks also fail independently.

The minimum postmortem sentence should name the phase precisely, for example:

```text
Wrangler compiled the Worker and reached Cloudflare Pages remote API work; failure occurred while requesting /upload-token or creating the /deployments record with fetch/socket errors. This is not a build/package failure.
```

## Local Build Or Package Failure Checklist

Use this class only when the first fatal error happens before remote Cloudflare API work or when the staging/package checks fail:

- `node --check tools/prepare-fluid-pages-deploy.mjs` fails;
- `node tools/prepare-fluid-pages-deploy.mjs --dry-run --json` reports `ok=false` or missing required files;
- Wrangler reports a syntax, module resolution, package-manager, build command, package-size, or file-count failure;
- no successful `Compiled Worker successfully` line appears before the fatal error.

At this review, the source repo has no `package.json`, so there are no npm package scripts to treat as the deploy source of truth. The deploy package source of truth is `tools/prepare-fluid-pages-deploy.mjs`, `.assetsignore`, `wrangler.toml`, and the staged root described in `docs/fluid-pages-staging-deploy.md`.

For local production deploys, use the wrapper instead of a repo-root Wrangler command:

```sh
node tools/deploy-fluid-pages-staging.mjs --json
```

The wrapper rebuilds staging, removes macOS AppleDouble/Finder sidecars, and invokes Wrangler with the staged directory as its current working directory.

## After A Successful Retry

Once a deploy succeeds, separate deploy recovery from public/live verification:

```sh
FLUID_PUBLIC_SHELL_REPO=/Volumes/mac_2T/work/github/lghui12138-public-shell FLUID_EXPECTED_EDGE_VERSION=<expected-version> node tools/verify-fluid-public-deployment.mjs
FLUID_EXPECTED_EDGE_VERSION=<expected-version> node tools/monitor-fluid-public-release.mjs --json
FLUID_EXPECTED_EDGE_VERSION=<expected-version> node tools/check-public-entry-browser.mjs
```

Then record:

- preview URL reported by Wrangler;
- production `/_edge-status` version;
- public shell acceptance from `site-updates.json` or direct page body;
- browser smoke result for concrete extensionless pages, old `edge_refresh`, login visible text, canonical hidden `next`, console errors, and `ERR_TOO_MANY_REDIRECTS`;
- any cache warning separately from the deploy failure class.

## Blank Page Or Login Redirect Report

When a user reports a concrete page that returns HTTP 200 but shows no text, too many redirects, or login not jumping to the requested page, run the browser smoke check before classifying the deploy:

```sh
FLUID_EXPECTED_EDGE_VERSION=<expected-version> node tools/check-public-entry-browser.mjs --urls 'https://lghui-fluid-learning.pages.dev/modules/knowledge-detail,https://lghui-fluid-learning.pages.dev/modules/knowledge-detail?edge_refresh=round264-formula-condition-checklist-20260522,https://lghui.top/question-bank.html'
```

Treat these as public-entry failures even if curl returns 200:

- rendered body text is too short or the body is hidden/transparent;
- login visible text is missing;
- hidden `next` does not point to the canonical `.html` route;
- the browser reports console errors, failed document requests, Service Worker leftovers, or redirect-loop symptoms.

## Related Local Docs

- `docs/fluid-pages-staging-deploy.md` - staging package and manual deploy command.
- `docs/fluid-public-release-monitoring.md` - live public/source release monitor.
- `output/qa/source-deploy-fetch-failure-20260524.md` - original read-only diagnosis of the 2026-05-24 API fetch failures.
