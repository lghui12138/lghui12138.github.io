# Round340 Private Video UI Actions

- version: `round340-private-video-ui-actions-20260615`
- ready/limited/blocked: `3/1/3`
- FM_PRIVATE_MEDIA R2: `blocked-missing-fm-private-media-r2`
- productionRecoveryAllowed: `false`
- realDeleteAttempted: `false`

## Teacher Action Matrix

| Action | Label | State | Button expectation | Production recovery claim |
| --- | --- | --- | --- | --- |
| `list` | 列表刷新 | `ready` | enabled | no |
| `same-access-save` | 重复保存当前授权 | `ready` | enabled | no |
| `delete-dry-run` | 删除 dry-run 预检 | `ready` | enabled | no |
| `delete-course` | 永久删除专属课 | `limited` | enabled-with-limited-reason | no |
| `upload-publish` | 上传/发布专属课 | `blocked` | disabled-or-blocked-reason-visible | no |
| `change-access` | 改授权学生 | `blocked` | disabled-or-blocked-reason-visible | no |
| `archive-course` | 下架专属课 | `blocked` | disabled-or-blocked-reason-visible | no |

## Gate

- Dynamic teacher-uploaded courses expose management controls with action/state/reason attributes.
- System built-in courses stay read-only and do not show delete/manage buttons.
- Delete still runs `delete?dryRun=1&writeProbe=1`, shows the blocker in the confirmation dialog, and then requires the exact course ID.
- Missing or unproven `FM_PRIVATE_MEDIA` R2 keeps upload/publish, true access change, archive, and storage-backed delete cleanup out of production-recovery claims.

## Commands

```bash
node --check tools/check-round340-private-video-ui-actions.mjs
node tools/check-round340-private-video-ui-actions.mjs --write --json
```
