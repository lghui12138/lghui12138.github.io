# Round325 Private-Video R2 Remediation

Version: `round325-private-video-r2-remediation-20260615`

Generated at: `2026-06-14T17:58:39.396Z`

This checker consumes existing private-video browser/action evidence and the current Cloudflare binding audit. It does not change Cloudflare, deploy Pages, mutate private-video courses, or claim production recovery.

## Summary

- ready: 2
- limited: 1
- blocked: 3
- real-account management browser: `passed-from-available-evidence`
- FM_PRIVATE_MEDIA R2 binding: `blocked-missing-fm-private-media-r2`
- production recovery claim allowed: `false`

## Action Matrix

| Action id | Label | State | Real-account browser | FM_PRIVATE_MEDIA R2 | Production recovery claim |
| --- | --- | --- | --- | --- | --- |
| `list` | 列表刷新 | `ready` | passed | missing-or-not-proven | no |
| `same-access-save` | 重复保存当前授权 | `ready` | passed | missing-or-not-proven | no |
| `delete-course` | 永久删除专属课 | `limited` | passed | missing-or-not-proven | no |
| `upload-publish` | 上传/发布专属课 | `blocked` | passed | missing-or-not-proven | no |
| `change-access` | 改授权学生 | `blocked` | passed | missing-or-not-proven | no |
| `archive-course` | 下架专属课 | `blocked` | passed | missing-or-not-proven | no |

## R2 Boundary

- hasAuditKv: `true`
- hasPrivateMediaR2: `false`
- current audit exit code: `2`
- blocker: Cloudflare Pages production lacks or has not proven FM_PRIVATE_MEDIA R2; upload/publish/access-change/archive/delete storage recovery remains blocked.

## Real-Account Boundary

- status: `passed-from-available-evidence`
- consumed here: `false`
- browser gate run here: `false`
- credentials printed: `false`

## Production Blockers

- FM_PRIVATE_MEDIA R2 production binding is missing or unproven; upload/change/archive and storage-backed delete cleanup remain blocked.

## Remediation

Binding can be changed locally by this checker: `false`

No current repo-local wrangler production binding file was found. The observed blocker is remote Cloudflare Pages project state, so Round325 records remediation instructions instead of changing the binding locally.

- `dashboard-bind-r2` (required): Cloudflare dashboard -> Workers & Pages -> Pages project lghui-fluid-learning -> Settings -> Bindings -> Add -> R2 bucket -> Variable name FM_PRIVATE_MEDIA -> select the production bucket -> save.
- `redeploy-pages-after-binding` (required-after-dashboard-save): command-after-binding-saved `npx wrangler pages deploy <OUTPUT_DIR> --project-name=lghui-fluid-learning`
- `verify-binding` (required): verification-command `node tools/check-cloudflare-pages-private-video-bindings.mjs --json`
- `verify-real-account-private-video-browser` (required-after-r2): verification-command `NODE_PATH=<codex primary runtime node_modules> node tools/check-private-video-management-browser.mjs --production --json`

## Documentation

- Cloudflare Pages bindings: R2 buckets: https://developers.cloudflare.com/pages/functions/bindings/#r2-buckets
- Cloudflare Pages Wrangler configuration: https://developers.cloudflare.com/pages/functions/wrangler-configuration/#r2-buckets
