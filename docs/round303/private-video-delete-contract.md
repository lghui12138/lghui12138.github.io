# Round303 Private-Video Delete Contract

Version: `round303-private-video-delete-contract-20260614`

Generated at: `2026-06-14T14:54:30.041Z`

This Round303 worker-D artifact checks local UI/API action coverage for private-video list, publish, access, archive, delete dry-run, and delete. It is intentionally not a production recovery claim.

## Result

- Contract pass: yes
- Local actions ready: 6 / 6
- Production-ready actions: 0 / 6
- `productionRecovery`: false
- Current UI proof surface: `functions/_middleware.js renderAdmin embedded admin UI`
- `modules/teacher-panel.html/js` owns current private-video management surface: no
- Credential/env values read: no
- Python/lxml used: no

## Gates

| Gate | State | Ready | Production claim allowed |
| --- | --- | --- | --- |
| Local API and embedded admin UI contract | `ready-source-covered` | yes | no |
| Existing no-credential private-video mock/static gate | `ready-mock-only` | yes | no |
| modules/teacher-panel.html/js private-video management boundary | `not-current-management-surface` | yes | no |
| Real teacher/student account browser QA | `blocked-not-run` | no | no |
| FM_PRIVATE_MEDIA R2 production binding | `blocked-not-proven` | no | no |

## Actions

| Action | Local contract ready | Production ready | Production claim allowed | Blockers |
| --- | --- | --- | --- | --- |
| List private-video courses | yes | no | no | Real teacher/student account browser QA was not run by Round303 and remains required before production recovery can be claimed.<br>FM_PRIVATE_MEDIA R2 production binding is missing or not proven by Round303, so storage-backed private-video recovery remains blocked. |
| Publish private-video course | yes | no | no | Real teacher/student account browser QA was not run by Round303 and remains required before production recovery can be claimed.<br>FM_PRIVATE_MEDIA R2 production binding is missing or not proven by Round303, so storage-backed private-video recovery remains blocked. |
| Save/change private-video access | yes | no | no | Real teacher/student account browser QA was not run by Round303 and remains required before production recovery can be claimed.<br>FM_PRIVATE_MEDIA R2 production binding is missing or not proven by Round303, so storage-backed private-video recovery remains blocked. |
| Archive private-video course | yes | no | no | Real teacher/student account browser QA was not run by Round303 and remains required before production recovery can be claimed.<br>FM_PRIVATE_MEDIA R2 production binding is missing or not proven by Round303, so storage-backed private-video recovery remains blocked. |
| Delete dry-run preflight | yes | no | no | Real teacher/student account browser QA was not run by Round303 and remains required before production recovery can be claimed.<br>FM_PRIVATE_MEDIA R2 production binding is missing or not proven by Round303, so storage-backed private-video recovery remains blocked. |
| Delete private-video course | yes | no | no | Real teacher/student account browser QA was not run by Round303 and remains required before production recovery can be claimed.<br>FM_PRIVATE_MEDIA R2 production binding is missing or not proven by Round303, so storage-backed private-video recovery remains blocked. |

## Source Checks

| Check | Label | Target | OK |
| --- | --- | --- | --- |
| `api-list` | Backend list route returns courses, static courses, limits, and audit | functions/_middleware.js | yes |
| `api-publish` | Backend course publish route validates segments, writes status, and audits | functions/_middleware.js | yes |
| `api-access` | Backend course access route supports no-op save and real access update | functions/_middleware.js | yes |
| `api-archive` | Backend course archive route writes archived status and audit | functions/_middleware.js | yes |
| `api-delete-dry-run` | Backend delete dry-run returns canDelete, readiness, limits, and course summary | functions/_middleware.js | yes |
| `api-delete` | Backend delete route removes uploaded storage and index only after readiness passes | functions/_middleware.js | yes |
| `api-admin-deny` | Admin private-video API remains admin-only | functions/_middleware.js | yes |
| `ui-list` | Embedded admin UI lists courses and renders storage/action readiness | functions/_middleware.js | yes |
| `ui-publish` | Embedded admin UI has publish control wired to course publish action | functions/_middleware.js | yes |
| `ui-access` | Embedded admin UI has access input and save control wired to access action | functions/_middleware.js | yes |
| `ui-archive` | Embedded admin UI has archive control wired to course archive action | functions/_middleware.js | yes |
| `ui-delete-dry-run` | Embedded admin UI performs delete dry-run before destructive confirmation | functions/_middleware.js | yes |
| `ui-delete` | Embedded admin UI requires irreversible warning and exact course ID before delete | functions/_middleware.js; teacher-panel.html | yes |
| `ui-delete-order` | Embedded admin UI orders dry-run, confirmation, typed ID, then delete POST | functions/_middleware.js; teacher-panel.html | yes |
| `module-teacher-boundary` | modules/teacher-panel.html is not the current private-video management surface | modules/teacher-panel.html | yes |
| `module-teacher-js-boundary` | modules/teacher-panel.js is absent, so no hidden module JS private-video surface is claimed | modules/teacher-panel.js | yes |
| `existing-mock-contract` | Existing no-credential mock checker covers private-video controls and dry-run delete | tools/check-private-video-management-mock.mjs | yes |
| `blocker-docs` | Existing docs preserve FM_PRIVATE_MEDIA and real-account blockers | docs/private-video-management-runbook.md, docs/round301/private-video-action-contract.md, docs/round302/private-video-management-readiness.md | yes |

## Preserved Blockers

- Real teacher/student account browser QA was not run by Round303 and remains required before production recovery can be claimed.
- `FM_PRIVATE_MEDIA` R2 production binding is missing or not proven by Round303, so storage-backed private-video recovery remains blocked.
- `FM_AUDIT` / `FM_PRIVATE_MEDIA` fields and local readiness wording are not live Cloudflare proof.
- UI/static/mock coverage is local evidence only.

## Delete Boundary

- Delete dry-run must run before destructive confirmation.
- The UI must display the irreversible warning and require exact course ID input.
- Wrong course ID cancels the delete before any real delete request.
- Round303 did not perform a real delete and did not deploy.

## Commands

- `node --check tools/check-round303-private-video-delete-contract.mjs`
- `node tools/check-round303-private-video-delete-contract.mjs --json`
- `node tools/check-private-video-management-mock.mjs --json`

## Command Outputs

- `node tools/check-private-video-management-mock.mjs --json` -> exit 0 (mock/static gate passed)
- `node tools/check-fluid-auth-env-readiness.mjs --json --production --require-private-video` -> skipped: Would inspect auth environment readiness; Round303 must not read secrets/env values.
- `node tools/check-cloudflare-pages-private-video-bindings.mjs --json` -> skipped: Would inspect Cloudflare credential/keychain-backed production bindings; Round303 must not read secrets/env values.
