# Round299 Release Surface

Version: `round299-source-count-audit-private-video-release-20260614`

Generated at: `2026-06-13T22:57:08.070Z`

This is a lightweight local checker. It does not run browser automation, fetch production, read credential values, deploy, use Python, or touch VPN/proxy state.

## Local Readiness

- Status: `ready-for-production-proof`
- Local release surface ready: `true`
- Boundary: Local source constants and release feed point at Round299; public completion still requires production proofs below.

| Authority | Actual | Expected | Result |
|---|---:|---:|---|
| site-updates-top-version | `round299-source-count-audit-private-video-release-20260614` | `round299-source-count-audit-private-video-release-20260614` | pass |
| edge-home-version | `round299-source-count-audit-private-video-release-20260614` | `round299-source-count-audit-private-video-release-20260614` | pass |
| edge-runtime-js-version | `round299-source-count-audit-private-video-release-20260614` | `round299-source-count-audit-private-video-release-20260614` | pass |

## Required Production Proofs

| Proof | Origin | Status | Requirement |
|---|---|---|---|
| lghui-top-public-shell-proof | https://lghui.top | required-not-run-by-this-checker | Fresh public-shell proof that lghui.top serves the Round299 release feed and entry routes without stale round leakage. |
| pages-dev-source-status-proof | https://lghui-fluid-learning.pages.dev | required-not-run-by-this-checker | Fresh pages.dev source-origin status proof for _edge-status and protected-source routing. |
| authenticated-real-account-browser-proof | https://lghui-fluid-learning.pages.dev | required-not-run-by-this-checker | Real QA teacher and student browser sessions on pages.dev, with credential values supplied only through the approved env file or current shell. |
| lghui-top-auth-chain-proof | https://lghui.top -> https://lghui-fluid-learning.pages.dev | required-not-run-by-this-checker | Public-shell-to-auth-source chain proof: start at lghui.top, then prove the authenticated handoff belongs to pages.dev. |
| cloudflare-private-video-r2-proof | Cloudflare Pages production bindings | required-not-run-by-this-checker | Production Cloudflare binding proof for FM_AUDIT KV and FM_PRIVATE_MEDIA R2 before private-video production recovery is claimed. |

## Public Completion Policy

- Do not treat this checker as lghui.top production proof.
- Do not treat this checker as pages.dev authenticated browser proof.
- Do not treat HTTP 200, anonymous 401, mock routes, or local JSON as real QA-account proof.
- Do not claim private-video production recovery until FM_PRIVATE_MEDIA R2 and real teacher browser QA are both proven.

## Commands

- `node --check tools/check-round299-release-surface.mjs`
- `node tools/check-round299-release-surface.mjs --json`
- `node tools/check-round299-release-surface.mjs --json --require-ready --expected-version round299-source-count-audit-private-video-release-20260614`
