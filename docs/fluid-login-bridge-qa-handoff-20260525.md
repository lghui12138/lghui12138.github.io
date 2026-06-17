# Fluid Login Bridge QA Handoff

Date: 2026-05-25 Asia/Shanghai

Role: Agent 6 - QA record, regression checklist, and handoff. Scope is documentation and local log classification only. No runtime site code, deploy package, DNS, VPN, proxy, route, or Cloudflare remote state was changed in this pass.

## Incident Summary

The user reported three concrete production symptoms:

- `https://lghui-fluid-learning.pages.dev/modules/knowledge-detail` and other protected detail pages could return HTTP 200 while showing no useful content.
- Pages could fail with `ERR_TOO_MANY_REDIRECTS` / "重定向的次数过多".
- After login, the site did not automatically enter the requested page, leaving the user on an empty or useless transition state.

Important lesson: for this incident class, HTTP 200, `Deployment complete`, or a successful static route fetch is not enough. The acceptance signal must include post-login browser navigation into the protected target.

## Root Cause

Parent fix commit: `71cc2df3 Fix edge login bridge storage persistence`.

The edge login bridge was responsible for turning a valid edge session into the legacy browser-side session expected by the existing auth guard. Two problems made the handoff fragile:

- The bridge response could send `Clear-Site-Data: "cache", "storage"`, which allowed the browser to clear the same local storage state that the bridge had just written.
- The bridge did not fully persist both legacy session shapes needed by the protected app flow. The auth guard and home shell paths expect `fm_auth_session_v2` and the signed `fm_session_v2` shape, with `fluidMechanicsUser` retained for older UI compatibility.

Net effect: a valid login could still arrive at a protected route with missing browser-side auth state, causing another auth bounce, redirect loop, or blank transition.

## Fixed Behavior

Commit `71cc2df3` changed the bridge contract:

- `functions/_middleware.js`
  - `edgeSessionBridgeResponse()` now clears cache without clearing storage on the login bridge response.
  - `renderEdgeSessionBridge()` writes `fm_auth_session_v2`, signed `fm_session_v2`, and `fluidMechanicsUser`.
  - The bridge keeps `location.replace(target)` after storage sync.
  - A manual fallback link is visible if auto navigation stalls.
- `tests/edge-fluid-upgrade-check.js`
  - Asserts bridge writes both legacy session keys.
  - Asserts login bridge avoids storage-clearing headers while recovery paths can still clear stale storage.
- `tools/smoke-student-access.mjs`
  - Verifies `/_edge-login?next=/modules/knowledge-detail` returns the bridge, writes both keys, avoids wiping storage, and enters the requested target.

## Deployment And Live Evidence

- Source commit: `71cc2df3`.
- Production Pages deployment listed by Wrangler: `https://a30d3ca6.lghui-fluid-learning.pages.dev`.
- Production source alias: `https://lghui-fluid-learning.pages.dev`.
- Public shell domain: `https://lghui.top`.
- Current edge version from `/_edge-status`: `round265-redirect-loop-recovery-20260524`.
- Screenshot evidence from parent verification: `/Volumes/mac_2T/output/qa/fluid-knowledge-login-after-fix-20260525.png`.

Read-only evidence commands used for this Agent 6 handoff:

```sh
/Users/kili/.local/bin/wrangler-lghui pages deployment list --project-name lghui-fluid-learning --environment production --json
curl -fsSL --max-time 20 https://lghui-fluid-learning.pages.dev/_edge-status
curl -fsSL --max-time 20 https://a30d3ca6.lghui-fluid-learning.pages.dev/_edge-status
curl -fsSI --max-time 20 https://lghui-fluid-learning.pages.dev/modules/knowledge-detail
curl -fsSI --max-time 20 https://lghui.top/
ls -l /Volumes/mac_2T/output/qa/fluid-knowledge-login-after-fix-20260525.png
```

Observed:

- Wrangler lists production deployment `a30d3ca6` for source `71cc2df`.
- Both the production alias and deployment URL `/_edge-status` return `ok=true` and `edgeHomeVersion=round265-redirect-loop-recovery-20260524`.
- The screenshot artifact exists and is non-empty.

Parent release gate result to preserve in handoff:

```sh
FLUID_GATE_MODE=production FLUID_REQUIRED_RELEASE_VERSION=round265-redirect-loop-recovery-20260524 FLUID_GATE_VERBOSE=0 node tools/verify-fluid-release-gate.mjs
```

Result: PASS per parent task context after commit `71cc2df3` and deployment. This Agent 6 pass did not rerun the full heavy gate because the worktree intentionally contains QA documentation and classifier changes.

## Manual Login Boundary

The remaining boundary is a real credential/browser-state check. Automated local gates can validate the bridge HTML and storage contract, but they cannot prove every human browser profile, cookie jar, and paid account path unless a real account/session is used.

Manual confirmation should use a clean browser profile and at least one existing logged-in profile:

1. Open `https://lghui-fluid-learning.pages.dev/_edge-reset?next=/modules/knowledge-detail`.
2. Log in with a valid student account.
3. Confirm the bridge page auto-enters `/modules/knowledge-detail` without returning to login.
4. Confirm visible protected content, not just a login shell or blank page.
5. Confirm local storage contains `fm_auth_session_v2`, `fm_session_v2`, and `fluidMechanicsUser`.
6. Repeat from `https://lghui.top/` and one deep public shell link to catch custom-domain cache behavior.
7. If auto navigation stalls, click the bridge fallback link and record whether it succeeds.

## Six-Agent Regression Checklist

Use this checklist before the next "all aspects" site upgrade:

| Agent | Focus | Must Pass |
| --- | --- | --- |
| Agent 1 | Routes/auth | Protected extensionless and `.html` paths preserve `next`, login bridge writes both session keys, no auth bounce after login. |
| Agent 2 | Performance/cache | Login bridge never clears freshly written storage; recovery/reset paths can clear stale storage; route load budget does not hide blank-render failures. |
| Agent 3 | Knowledge content | `/modules/knowledge-detail`, knowledge upgrade, formula, variable, and dimension pages render real content after auth, not only a shell. |
| Agent 4 | Practice/exam flows | Question bank, dynamic practice, real-exam links, and remediation pages survive auth handoff and deep-link hash/query preservation. |
| Agent 5 | Mobile/a11y | Login bridge fallback link is visible and tappable; protected target has no mobile overlap or unreadable empty state. |
| Agent 6 | QA/observability | Release gate records deployment URL, edge version, browser screenshot, redirect-loop check, manual-login boundary, and rollback/reset path. |

## Recurrence Triage

If this failure reappears, classify it as runtime auth redirect first, not deploy success:

```sh
pbpaste | node tools/classify-pages-deploy-log.mjs
```

Look for:

- `ERR_TOO_MANY_REDIRECTS` or repeated login/protected route bounces.
- `/_edge-login` bridge response with `Clear-Site-Data` clearing storage.
- Missing `fm_session_v2` or `fm_auth_session_v2` after bridge completion.
- `next` losing `/modules/knowledge-detail` or its hash/query.

Immediate safe user-facing recovery path:

```text
https://lghui-fluid-learning.pages.dev/_edge-reset?next=/modules/knowledge-detail
```

Do not change VPN/proxy/DNS/route state while diagnosing this class.
