# Round347 Private Video Boundary Proof

Version: `round347-private-video-boundary-proof-20260615`

Generated at: `2026-06-14T20:58:25.190Z`

This proof records the private-video management boundary only. It does not change Cloudflare configuration, upload media, publish/archive courses, change student access, or delete data.

## Summary

- ready/limited/blocked: `3/1/3`
- FM_PRIVATE_MEDIA R2: `blocked-missing-fm-private-media-r2`
- productionRecoveryClaimed: `false`
- Cloudflare binding check exit code: `2`

## Available Actions And Blockers

| Action | Label | State | Visible | External blocker applied | Production recovery claim |
| --- | --- | --- | --- | --- | --- |
| `list` | 列表刷新 | `ready` | yes | no | no |
| `same-access-save` | 重复保存当前授权 | `ready` | yes | no | no |
| `delete-dry-run` | 删除 dry-run 预检 | `ready` | yes | no | no |
| `delete-course` | 永久删除专属课 | `limited` | yes | yes | no |
| `upload-publish` | 上传/发布专属课 | `blocked` | yes | yes | no |
| `change-access` | 改授权学生 | `blocked` | yes | yes | no |
| `archive-course` | 下架专属课 | `blocked` | yes | yes | no |

## Boundary

- `list`, `same-access-save`, and `delete-dry-run` are visible and usable action paths.
- `delete-course` remains limited because it requires dry-run, irreversible confirmation, and exact course-id confirmation, while storage cleanup is not a production recovery claim.
- `upload-publish`, `change-access`, and `archive-course` remain blocked while `FM_PRIVATE_MEDIA` is missing or unproven.
- When `FM_PRIVATE_MEDIA` is missing, `productionRecoveryClaimed=false`.

## External Blockers

- Cloudflare Pages production lacks FM_PRIVATE_MEDIA R2 in current proof; upload/publish, true access change, archive, and storage-backed cleanup remain blocked.

## Commands

```bash
node --check tools/check-round347-private-video-boundary-proof.mjs
node tools/check-round347-private-video-boundary-proof.mjs --write --json
```
