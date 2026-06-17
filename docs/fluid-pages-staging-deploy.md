# Fluid Pages staging deploy note

Date: 2026-05-24

This note records the repeatable staging path for the fluid learning Pages project after repeated local Pages direct-upload failures. It does not require changing VPN, proxy, route, DNS, TUN, or system proxy state.

## What the staging command does

Run from the repo root:

```sh
node tools/prepare-fluid-pages-deploy.mjs
```

Default output:

```text
.wrangler/tmp/fluid-pages-staging
```

The script reads `.assetsignore`, copies deployable static assets into the staging directory, and always copies these control files when present:

- `.assetsignore`
- `_headers`
- `_redirects`
- `wrangler.toml`
- `CNAME`
- `functions/**`

`functions/**` is copied so Wrangler can still build Pages Functions from the staged root. The same `.assetsignore` remains in staging so `functions/**` is not uploaded as a static asset bucket payload.

On macOS external volumes, the script also removes generated AppleDouble sidecar files (`._*` / `.__*`) from the staging directory after copy.

Useful checks:

```sh
node tools/prepare-fluid-pages-deploy.mjs --dry-run
node tools/prepare-fluid-pages-deploy.mjs --dry-run --json
```

## Deploy from staging

Prefer the safe wrapper. It rebuilds the staging directory, removes macOS AppleDouble/Finder sidecar files from the source and staging trees, verifies the staged root is clean, then runs Wrangler from inside the staged root.

```sh
node tools/deploy-fluid-pages-staging.mjs --json
```

Dry-run form:

```sh
node tools/deploy-fluid-pages-staging.mjs --dry-run --json
```

Manual fallback: after the staging directory is prepared, deploy from inside the staged root. Wrangler compiles Pages Functions from the current working directory, so running from the repo root can accidentally pick up local-only files under `functions/`.

```sh
cd .wrangler/tmp/fluid-pages-staging
/Users/kili/.local/bin/wrangler-lghui pages deploy . --project-name lghui-fluid-learning --branch main --commit-hash "$(git -C /Volumes/mac_2T/work/github/lghui12138.github.io rev-parse --short HEAD)" --commit-message "$(git -C /Volumes/mac_2T/work/github/lghui12138.github.io log -1 --pretty=%s)"
```

If the local direct upload fails with socket close or a stuck queue, retry the same command after the remote/API condition recovers. Do not change VPN, proxy, Network Extension, route, DNS, or proxy environment state unless the user explicitly authorizes that exact action in the current turn.

## Default heavy-resource exclusions

The current `.assetsignore` keeps these classes out of the default Pages asset upload:

- `private-media/**` static video fallback chunks, currently about 353 MB locally.
- `*.pptx`, `*.docx`, and similar large binary teaching/source assets anywhere in the repo; `resources/fluid-sources/` alone is currently about 22 MB locally, and other resource folders also contain PPTX/DOCX originals.
- generated audit/data packs already listed in `.assetsignore`.
- local-only `docs/`, `tools/`, `tests/`, `source-materials/`, root Markdown reports, and `output/`.

This keeps the deployment package focused on the website runtime and avoids re-sending private media or source document archives through Pages direct upload.

## Restoring private media

Private video should be restored outside Pages static assets:

1. Prefer `FM_PRIVATE_MEDIA` R2 for private video chunks. The middleware already reads uploaded chunks from keys shaped like `private/videos/<id>/chunks/chunk-0000.bin` and uses `FM_AUDIT` KV for metadata/index records.
2. The teacher/admin upload flow at `/_edge-admin` writes private video metadata to `FM_AUDIT` and chunks to R2 when `FM_PRIVATE_MEDIA` is bound; it falls back to KV only when R2 is unavailable.
3. The legacy static fallback path `/private-media/qi-meeting-01/manifest.json` plus `/private-media/qi-meeting-01/chunks/chunk-*.bin` is intentionally excluded from default staging. Re-enable it only for an explicit emergency static fallback deploy, then remove it from the next normal deploy package.
4. Verify after restore with an authenticated request to `/api/private-videos/qi-meeting-01/status`; expected healthy sources are `r2: true` or `kv: true`. `static: false` is acceptable for the default lean deploy.

External condition: the Cloudflare Pages project must have the existing `FM_AUDIT` KV binding and, for the preferred path, an `FM_PRIVATE_MEDIA` R2 binding with the expected object keys.

## Restoring PPT/DOCX source files

PPT/DOCX and similar source files should not be in the default Pages deploy package. Restore them through one of these paths:

1. Preferred: convert source documents into derived public HTML/Markdown/data artifacts already served by the site, then keep the original PPT/DOCX in private storage or the source repo only.
2. If students must download originals, host them in R2 or another protected object store and add a signed/authenticated download route in Pages Functions in a separate change.
3. Temporary exception: remove the specific `**/*.pptx`, `**/*.docx`, or narrower resource-folder ignore line for a one-off deploy, run staging, deploy, then restore the ignore rule immediately after confirming the remote asset is no longer needed in Pages static storage.

External condition: any route that exposes originals must preserve the current authentication and source-download audit behavior for `/resources/fluid-sources/`.

## Verification checklist

Before deploy:

```sh
node --check tools/prepare-fluid-pages-deploy.mjs
node tools/prepare-fluid-pages-deploy.mjs --dry-run
FLUID_GATE_MODE=production \
FLUID_REQUIRED_RELEASE_VERSION=round268-auth-redirect-practice-20260526 \
node tools/verify-fluid-release-gate.mjs
```

The production gate is mandatory before a production deploy. It must use the
dedicated real QA teacher and QA student accounts against
`https://lghui-fluid-learning.pages.dev`; local-only checks are only preflight.
Do not print, commit, or store the credentials in the repo.

After deploy:

```sh
FLUID_PUBLIC_SHELL_REPO=/Volumes/mac_2T/work/github/lghui12138-public-shell FLUID_EXPECTED_EDGE_VERSION=<expected-version> node tools/verify-fluid-public-deployment.mjs
```

Also verify `https://lghui.top/`, `https://lghui.top/index-complete.html`, and the Pages preview URL for the current `EDGE_HOME_VERSION`.
