# Source sync clean branch plan

Date: 2026-05-24 Asia/Shanghai

Scope: planning note for building a clean source-sync branch later from the current local `origin/main..HEAD` delta. This plan is intentionally non-destructive: it does not require rewriting local `main`, pushing, fetching, resetting, rebasing, filtering history, pruning objects, changing branches in this round, or changing VPN/proxy/network state.

## Current local source-sync picture

Local `main` is twelve commits ahead of `origin/main`:

- `10ec12e9` Split private media chunks for Pages upload
- `81092550` Reduce private media chunk size for deployment
- `771c3af5` Serve large data JSON as gzip assets
- `c0505f7d` Serve large JS assets as gzip
- `147e0843` Compress remaining large data assets
- `ce02af55` Upgrade round264 site with six-agent QA
- `e51bc14e` Upgrade round264 second-pass six-agent hardening
- `e84f7395` Verify round264 deployment with public shell history
- `b3b7b905` Reduce unauthenticated login prefetch load
- `b72ea09b` Allow public favicon on login shell
- `7208bb1b` Integrate six-agent fluid site hardening
- `1343a298` Record final public shell convergence

The latest read-only audit reports 767 changed paths. The clean replay set is the 62 non-`private-media/` paths, totaling 5.53 MiB at `HEAD`. The excluded private media set remains 705 paths, totaling 352.10 MiB at `HEAD`. The local commit range still contains 967 unique blobs totaling 712.56 MiB, including 882 private-media blobs totaling 704.13 MiB, so pushing current `main` would carry the private-media history even though a clean branch can avoid it.

The source hotfix commits `b3b7b905` and `b72ea09b` are replayable through `functions/_middleware.js`; they do not add new `private-media/` paths, but they do increase the number of local commits that must be represented in the clean replay branch. The current latest source commits `7208bb1b` and `1343a298` also belong to the source clean replay candidate set because they add or update non-private docs, QA evidence, monitoring/audit tooling, and frontend/resource-hardening files. They do not remove the private-media history blocker from current `main`.

Public shell commit `61c0f36` (`Pin public home shells to stable round264`) was verified in `/Volumes/mac_2T/work/github/lghui12138-public-shell`, not this source repository. It updates `404.html`, `index.html`, and `site-updates.json` in the public shell repository and must not be replayed into this source clean branch.

Deployment or monitor failures do not change the clean replay assessment. Clean replay readiness is a source-history and path-classification decision: current `main` is not push-ready because the audited range still contains `private-media/` paths and private-media blob payload; a clean branch may still be built later by replaying only non-private paths after user authorization.

## Source of truth

Use the generated audit report and script as the source of truth:

- `output/qa/source-sync-readiness-20260524.md`
- `tools/audit-source-sync-readiness.mjs`

The script compares local refs only. It uses read-only Git commands and intentionally ignores uncommitted working-tree edits when classifying `origin/main..HEAD`.

## Replayable path groups

Replay these groups on a clean branch to reproduce the current source state (round264 plus the login-shell hotfixes) without private media:

- Website code: `functions/_middleware.js`, `index-complete.html`, `js/edge-fluid-learning-upgrade.js`, `modules/*.html`, and `styles/edge-fluid-upgrade.css`.
- Login-shell hotfixes: include the `functions/_middleware.js` changes from `b3b7b905` and `b72ea09b` so unauthenticated preload noise is reduced and `/favicon.ico` can be served publicly.
- Public data: `data/fluid-*.json`, `data/fluid-*.json.gz`, and `data/resource-manifest-large-assets.json`.
- Documentation: `docs/fluid-pages-staging-deploy.md`, `docs/fluid-resource-hosting-plan.md`, and `docs/main-push-recovery.md`.
- Tooling and tests: `.assetsignore`, `tests/edge-fluid-upgrade-check.js`, and the changed `tools/*.mjs` audit/deploy/validation scripts.
- QA evidence: the current committed `output/qa/*20260524.md` reports in the replay set, including the source-sync readiness report and six-agent integration/final monitoring evidence.
- Public compressed vendor assets: `js/vendor/pdfjs/pdf.worker.min.mjs.gz` and `vendor/mathjax/es5/tex-chtml-full.js.gz`.

Do not replay:

- `private-media/qi-meeting-01/chunks/chunk-0000.bin` through `private-media/qi-meeting-01/chunks/chunk-0703.bin`
- `private-media/qi-meeting-01/manifest.json`

## Safe future sequence

Only start this after the multi-agent worktree is quiet and the user explicitly authorizes branch switching in that turn.

1. Confirm `git status --short --branch` and preserve unrelated in-flight work.
2. After explicit user authorization in that same turn, create a new clean branch from the current local `origin/main`.
3. Replay only the non-private paths identified by `tools/audit-source-sync-readiness.mjs`.
4. Verify the clean branch with `node --check tools/audit-source-sync-readiness.mjs` and `node tools/audit-source-sync-readiness.mjs --base origin/main --head HEAD --json`.
5. Require zero changed paths under `private-media/` and zero private-media blob payload in the audit output before considering a source push or PR.

## Approval boundaries

These actions remain out of scope unless explicitly authorized in the current turn:

- `git switch`, `git checkout`, branch creation, or any other branch movement.
- `git fetch`, `git pull`, `git push`, or any remote mutation.
- `git reset`, `git rebase`, squashing, filtering, force-pushing, or rewriting history.
- `git gc`, object pruning, deleting `.git/objects` files, or other `.git` mutation.
- Any VPN/proxy/DNS/route/TUN/system proxy changes.
