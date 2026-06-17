# Main Push Recovery Runbook

Date: 2026-05-24 Asia/Shanghai

Scope: non-destructive recovery planning for `/Volumes/mac_2T/work/github/lghui12138.github.io` local `main`, which is currently ahead of `origin/main` by six commits. This note is for GitHub source push recovery only. It does not change Cloudflare Pages deployment state and does not require changing VPN, proxy, route, DNS, TUN, or system proxy state.

## Current Diagnosis

Local read-only audit commands show:

- `main` is six commits ahead of `origin/main`; `origin/main` is `533a0377` (`Trim Pages asset upload set`) and local `HEAD` is `ce02af55` (`Upgrade round264 site with six-agent QA`).
- The push range `origin/main..HEAD` contains 928 unique blob objects totaling about 710.23 MiB uncompressed.
- 882 of those blobs, about 704.13 MiB, are under `private-media/`.
- No audited blob is at or above GitHub's 100 MiB single-file hard limit. The largest blob in the ahead range is a 2.00 MiB private media chunk. The largest reachable blob in all local history is about 16.81 MiB.
- Current `HEAD` still tracks 705 files under `private-media/`, totaling about 352.10 MiB.
- `git count-objects -vH` reports local AppleDouble garbage sidecars under `.git/objects` (`garbage: 995`, `size-garbage: 3.89 MiB`). Those warnings are local object-store hygiene, not a remote history cleanup.

Interpretation: the clean-push blocker is not one giant file. It is the binary media history in the six local commits. A normal push must send the old 2 MiB chunk objects from `10ec12e9` and the later 512 KiB chunk objects from `81092550`, even though later commits exclude `private-media/` from Pages uploads. `.assetsignore` keeps files out of Cloudflare Pages direct upload; it does not remove Git objects already committed to local history.

## Audit Commands

Run from the repo root:

```sh
git status --short --branch
git log --oneline --decorate origin/main..HEAD
node tools/audit-large-git-history.mjs --range origin/main..HEAD --limit 15
node tools/audit-large-git-history.mjs --all --limit 15
```

For a machine-readable report:

```sh
node tools/audit-large-git-history.mjs --range origin/main..HEAD --limit 25 --json
```

The script is read-only. It runs local `git rev-list`, `git cat-file`, `git diff-tree`, `git status`, and `git count-objects` inspections. It does not fetch, push, prune, reset, rebase, filter, or touch network/proxy state.

## Safe Options Without History Rewrite

1. Keep deploying from the staged Pages package while source push recovery is pending.

   Use the existing `docs/fluid-pages-staging-deploy.md` path. This keeps the site deployable without pushing the heavy Git history. It does not solve source synchronization.

2. Attempt an ordinary push only if the user accepts the payload and repository-history consequence.

   Local evidence suggests GitHub's 100 MiB single-blob limit should not be the immediate rejection reason, but the push would still upload roughly 710 MiB of new blob objects, mostly private media chunks. It would also preserve those private media chunks in the private GitHub repo history. Do this only after explicit user confirmation that this is acceptable.

3. Create a clean recovery branch from `origin/main` and replay only non-media changes.

   This avoids rewriting existing local `main`. Do this only after active agents have finished or their work has been saved, and `git status --short` shows no unrelated worktree changes. The safe shape is:

   ```sh
   git switch -c push-recovery/round264-clean origin/main
   ```

   Then reapply the website, middleware, gzip, docs, tools, tests, and QA changes while excluding `private-media/`. Verify with the audit script before any push. This can be pushed as a separate branch and merged by PR, keeping remote `main` free of the local media-heavy commits. It does not automatically repair local `main`; replacing local `main` with the clean branch would require a separately approved reset/rebase/switch plan.

4. Add a future-facing no-rewrite cleanup commit on current `main`.

   A commit such as `git rm --cached -r private-media` plus `.gitignore` coverage can remove private media from the tip of `main`, but it cannot make the six existing local commits light. A normal push would still send their media blobs. This option is useful only if the user has already accepted pushing the existing heavy history.

## Actions Requiring Explicit Current-Turn Approval

These actions are state-changing or history-changing and should not be performed implicitly:

- `git filter-repo`, `git filter-branch`, `git lfs migrate import`, or any equivalent history rewrite to remove `private-media/` or large blobs.
- Any `git reset`, `git rebase`, squash rewrite, branch replacement, or `git push --force` / `--force-with-lease`.
- Deleting `.git/objects/**/._*`, running `git gc --prune`, or otherwise cleaning the local object store. This is not a commit-history rewrite, but it mutates `.git` internals and should be done only after an explicit backup/approval step.
- Any VPN/proxy/network-state change to make a push work.

## Recommended Next Step

The lowest-risk source recovery path is option 3 after the multi-agent worktree is quiet: build a clean branch from `origin/main`, replay the six-commit website changes without `private-media/`, and verify that `node tools/audit-large-git-history.mjs --range origin/main..HEAD` reports no media-heavy payload before pushing that branch or opening a PR. Keep local `main` untouched until the user decides whether to archive, reset, or rewrite it.
