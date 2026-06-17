# Round294 Private Video Management Copy Gate

Target version: `round294-targeted-management-exam-workbench-20260614`

## Scope

- Hardened visible private-video management states in `teacher-panel.html` and the embedded `/_edge-admin` surface.
- Kept delete behind `dryRun=1&writeProbe=1`, a destructive confirmation, and typed course-id confirmation.
- Exposed the same `ready` / `limited` / `blocked` readiness payload on delete dry-run responses.
- Preserved the production boundary: missing `FM_PRIVATE_MEDIA` R2 binding or missing real teacher-account browser QA remains a blocker.

## Evidence

```bash
node --check functions/_middleware.js
node --check tools/check-private-video-management-mock.mjs
node tools/check-private-video-management-mock.mjs --json
```

The mock gate is source/static only. It does not use production credentials, upload videos, delete real courses, deploy, or prove production recovery.

## Blockers

- Do not claim production private-video recovery until Cloudflare Pages Production has `FM_PRIVATE_MEDIA` R2 binding.
- Do not claim real-account acceptance until the authenticated teacher browser gate passes.
