# Round301 Private-Video Action Contract

Version: `round301-private-video-action-contract-20260614`

Generated at: `2026-06-13T23:54:47.459Z`

This is a machine-readable action-availability and production-blocker contract. It audits source wiring and local/mock readiness for private-video list, publish, access, archive, delete dry-run, delete, and student-deny behavior. It does not claim production recovery.

## Result

- Contract pass: yes
- Local actions ready: 7 / 7
- Production-ready actions: 0 / 7
- `productionRecovery`: false
- Production recovery reason: FM_PRIVATE_MEDIA R2 and/or real-account browser proof are missing, so production recovery remains blocked
- Credential values read or printed: no
- Auth/Cloudflare credential-reading scripts executed: no

## Gates

| Gate | State | Ready | Production claim allowed |
| --- | --- | --- | --- |
| Source action contract | `ready-source-covered` | yes | no |
| Mock/static gate | `ready-mock-only` | yes | no |
| FM_AUDIT KV | `ready-present` | yes | yes |
| FM_PRIVATE_MEDIA R2 | `blocked-missing-or-not-proven` | no | no |
| Real-account browser proof | `blocked-missing-credentials` | no | no |

## Actions

| Action | Local contract ready | Production ready | Production recovery claim allowed | Blockers |
| --- | --- | --- | --- | --- |
| List private-video courses | yes | no | no | Real-account browser proof is missing or blocked.; FM_PRIVATE_MEDIA R2 is missing or not proven. |
| Publish uploaded private-video course | yes | no | no | Real-account browser proof is missing or blocked.; FM_PRIVATE_MEDIA R2 is missing or not proven. |
| Save/change private-video access | yes | no | no | Real-account browser proof is missing or blocked.; FM_PRIVATE_MEDIA R2 is missing or not proven. |
| Archive private-video course | yes | no | no | Real-account browser proof is missing or blocked.; FM_PRIVATE_MEDIA R2 is missing or not proven. |
| Delete dry-run preflight | yes | no | no | Real-account browser proof is missing or blocked.; FM_PRIVATE_MEDIA R2 is missing or not proven. |
| Delete private-video course | yes | no | no | Real-account browser proof is missing or blocked.; FM_PRIVATE_MEDIA R2 is missing or not proven. |
| Reject student/non-admin admin API access | yes | no | no | Real student-account browser deny proof is missing or blocked. |

## Real-Account Blockers

- `teacher-user`: teacher username
- `teacher-password`: teacher password
- `student-user`: student username
- `student-password`: student password
- `expected-qa-teacher`: expected QA teacher username
- `expected-qa-student`: expected QA student username
- `private-video-teacher-user`: private-video teacher username
- `private-video-teacher-password`: private-video teacher password

## Browser Proof Artifacts

| Proof | Status | Present | Required for production recovery |
| --- | --- | --- | --- |
| lghui.top auth-chain browser proof | `not-run-missing-artifact` | no | yes |
| pages.dev authenticated browser gate proof | `not-run-missing-artifact` | no | yes |
| pages.dev private-video management browser proof | `not-run-missing-artifact` | no | no |

## Blockers

- list: Real-account browser proof is missing or blocked.
- list: FM_PRIVATE_MEDIA R2 is missing or not proven.
- publish: Real-account browser proof is missing or blocked.
- publish: FM_PRIVATE_MEDIA R2 is missing or not proven.
- access: Real-account browser proof is missing or blocked.
- access: FM_PRIVATE_MEDIA R2 is missing or not proven.
- archive: Real-account browser proof is missing or blocked.
- archive: FM_PRIVATE_MEDIA R2 is missing or not proven.
- delete-dry-run: Real-account browser proof is missing or blocked.
- delete-dry-run: FM_PRIVATE_MEDIA R2 is missing or not proven.
- delete: Real-account browser proof is missing or blocked.
- delete: FM_PRIVATE_MEDIA R2 is missing or not proven.
- student-deny: Real student-account browser deny proof is missing or blocked.
- Real-account browser proof is missing or blocked.
- Cloudflare Pages production FM_PRIVATE_MEDIA R2 is missing or not proven.
- productionRecovery=false; true private-video management recovery is not claimed by Round301.

## Boundary

- `productionRecovery=false` is mandatory while `FM_PRIVATE_MEDIA` R2 is missing or real-account browser proof is missing.
- UI/mock readiness, disabled reasons, live/status visibility, delete dry-run, and typed course-ID confirmation are local safety evidence only.
- `FM_AUDIT` readiness alone does not restore storage-backed publish/access/archive/delete recovery.
- This checker does not deploy, mutate Cloudflare, run Python/lxml, change VPN/proxy state, read credential values, or print credential values.

## Commands

- `node --check tools/check-round301-private-video-action-contract.mjs`
- `node tools/check-round301-private-video-action-contract.mjs --json`
- `node tools/check-private-video-management-mock.mjs --json`
