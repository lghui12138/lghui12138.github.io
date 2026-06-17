# Source clean replay runbook

Date: 2026-05-24 Asia/Shanghai

Scope: preparation only for `/Volumes/mac_2T/work/github/lghui12138.github.io`. This runbook documents the safe source clean replay shape for a later authorized branch. It does not authorize or perform branch creation, branch switching, push, deploy, history rewrite, Git cleanup, or network/proxy changes.

## Current facts

- Local source branch after the route-rendering hotfix: `main...origin/main [ahead 15]`.
- Base for clean replay: local `origin/main` at `533a0377781e`.
- Latest committed runtime/deploy hotfix before this artifact-integration note: `09d6eef3` (`Fix knowledge detail route rendering`).
- Local committed range at that point: 15 commits from `10ec12e9` through `09d6eef3`.
- Current range is not push-ready: it still contains `private-media/` paths and private-media history blobs.
- Current clean replay candidate set: 68 non-private paths, 5.57 MiB (5,842,584 B) at the route-rendering hotfix.
- Required exclusion set: 705 `private-media/` paths, 352.10 MiB (369,204,139 B) at `HEAD`.
- History blocker in local range: 882 private-media blobs, 704.13 MiB (738,329,253 B), inside 984 total blobs / 713.09 MiB (747,723,940 B).

## Scripts reviewed

- `tools/audit-source-sync-readiness.mjs`: canonical detailed audit for `origin/main..HEAD`; read-only local Git inspection; reports replayable paths, private-media blockers, and history payload.
- `tools/audit-large-git-history.mjs`: read-only blob/history size audit; confirms the blocker is accumulated private-media history rather than a single 100 MiB GitHub-limit blob.
- `tools/prepare-fluid-pages-deploy.mjs`: Pages staging/deploy preparation; relevant only to deploy packaging, not source Git push readiness.
- `docs/source-sync-clean-branch-plan.md`, `docs/main-push-recovery.md`, and `output/qa/source-sync-readiness-20260524.md`: earlier recovery notes; they predate the route-rendering hotfix, so the newer count is 15 commits / 68 replayable paths before this artifact-integration note is committed.
- `tools/list-source-clean-replay-paths.mjs`: compact read-only path manifest added for this preparation pass.

## Safe replay paths

Replay only these non-private path groups on a future clean branch:

- Website/runtime code: `functions/_middleware.js`, `index-complete.html`, `js/edge-fluid-learning-upgrade.js`, `modules/fluid-intensive-training.html`, `modules/knowledge-upgrade-2026.html`, `modules/real-exams-dynamic.html`, `styles/edge-fluid-upgrade.css`.
- Public compressed vendor assets: `js/vendor/pdfjs/pdf.worker.min.mjs.gz`, `vendor/mathjax/es5/tex-chtml-full.js.gz`.
- Public data and manifests: `data/fluid-*.json`, `data/fluid-*.json.gz`, `data/resource-manifest-large-assets.json`.
- Docs already in the committed range: `docs/fluid-pages-staging-deploy.md`, `docs/fluid-public-release-monitoring.md`, `docs/fluid-resource-hosting-plan.md`, `docs/main-push-recovery.md`, `docs/source-sync-clean-branch-plan.md`.
- Tooling/tests: `.assetsignore`, `tests/edge-fluid-upgrade-check.js`, `tools/audit-fluid-public-formulas.mjs`, `tools/audit-fluid-resource-hosting.mjs`, `tools/audit-large-git-history.mjs`, `tools/audit-source-sync-readiness.mjs`, `tools/check-public-entry-browser.mjs`, `tools/monitor-fluid-public-release.mjs`, `tools/prepare-fluid-pages-deploy.mjs`, `tools/smoke-student-access.mjs`, `tools/validate-site-content.mjs`, `tools/verify-fluid-public-deployment.mjs`.
- QA evidence in the committed range: `output/qa/*20260524.md` entries listed by `tools/list-source-clean-replay-paths.mjs`.

Use this command for the exact current manifest:

```sh
node tools/list-source-clean-replay-paths.mjs --base origin/main --head HEAD --text
```

## Excluded paths

Do not replay these paths:

- `private-media/qi-meeting-01/chunks/chunk-0000.bin` through `private-media/qi-meeting-01/chunks/chunk-0703.bin` (704 files).
- `private-media/qi-meeting-01/manifest.json`.

Do not replay public-shell-only commits from `/Volumes/mac_2T/work/github/lghui12138-public-shell`; `63c950c` and earlier public-shell redirects belong to that separate repository, not this source clean replay.

## Preconditions before any later branch work

All of these are checks, not actions to perform in this preparation pass:

1. The user explicitly authorizes branch creation/switching in the current turn.
2. The multi-agent worktree is quiet, or unrelated in-flight edits are preserved by their owners.
3. `git status --short --branch` is reviewed immediately before branch movement.
4. `origin/main` resolves locally and is still the intended clean base.
5. `origin/main` is an ancestor of the source `HEAD` being replayed, or any divergence is reviewed before proceeding.
6. The path manifest is regenerated with `node tools/list-source-clean-replay-paths.mjs --base origin/main --head HEAD`.
7. No VPN/proxy/DNS/route/system proxy/env proxy changes are needed or attempted.

## Future authorized command order

This is the safe order after explicit authorization; it was not run in this preparation pass.

1. Read status and preserve in-flight work: `git status --short --branch`.
2. Create/switch a clean branch from local `origin/main`.
3. Replay only the safe paths from `tools/list-source-clean-replay-paths.mjs`; keep `private-media/` absent.
4. Run syntax checks one file at a time:
   - `node --check tools/list-source-clean-replay-paths.mjs`
   - `node --check tools/audit-source-sync-readiness.mjs`
   - `node --check tools/audit-large-git-history.mjs`
5. Run path audit on the clean branch: `node tools/list-source-clean-replay-paths.mjs --base origin/main --head HEAD`.
6. Run canonical readiness audit on the clean branch: `node tools/audit-source-sync-readiness.mjs --base origin/main --head HEAD --json`.
7. Require `privateMediaPathCount = 0`, `historyPrivateMediaBlobCount = 0`, and `cleanReplayRequired = false` before any source push or PR.

## Explicit non-actions in this pass

- No branch was created or switched.
- No checkout/reset/rebase/filter/clean/gc was run.
- No source `main` push, clean-branch push, PR, deploy, or Cloudflare mutation was run.
- No VPN/proxy/DNS/route/TUN/system proxy/proxy environment state was changed.
