# Round302 Public Shell Proof Plan

Version: `round302-public-shell-proof-plan-20260614`

This is the strict post-deploy proof helper for the split public surface:

- `https://lghui.top` proves the public shell, public release feed, and custom-domain entry routes.
- `https://lghui-fluid-learning.pages.dev` proves the source/auth origin, `_edge-status`, and anonymous protected JSON behavior.
- Real-account teacher/student proof is separate. Anonymous 401 JSON is not real-account proof.

## Required Gates

| Gate | Required Evidence | Failure Condition |
|---|---|---|
| `site-updates-top-version` | `https://lghui.top/site-updates.json` is JSON and `[0].version` equals the expected release version. | Missing JSON, wrong top version, or stale Round264/Round300 top version. |
| `public-shell-no-stale-rounds` | `https://lghui.top/` and `https://lghui.top/_edge-status` do not expose current-entry markers for `round264` or `round300`. | Any current shell route still contains `round264` or `round300` release markers after deploy. |
| `pages-dev-protected-json-401` | Anonymous `pages.dev` protected JSON routes return HTTP `401` with a non-HTML body. | `200`, redirect HTML, login HTML, or any HTML body masquerading as protected JSON. |
| `edge-status-current` | `https://lghui-fluid-learning.pages.dev/_edge-status` returns JSON with `ok: true`, `protected: true`, and `edgeHomeVersion` equal to the expected release version. | Missing status JSON, wrong version, or unprotected status payload. |
| `browser-url-count` | Existing `tools/check-public-entry-browser.mjs` passes and reports at least the minimum public URL count. | Browser gate skipped, fails, or checks too few URLs. |
| `real-account-proof` | Separate credential-bearing browser gate is declared as passed after real teacher/student credentials are supplied outside this helper. | Missing declaration; anonymous probes only; credential values embedded in helper output. |

## Helper Command

Use the source repo as cwd:

```bash
node tools/check-round302-public-shell-proof.mjs \
  --expected-version <released-round302-version> \
  --real-account-proof passed \
  --real-account-proof-command "node tools/check-authenticated-browser-gate.mjs"
```

For local syntax and contract review without live network or credentials:

```bash
node --check tools/check-round302-public-shell-proof.mjs
node tools/check-round302-public-shell-proof.mjs --no-network --skip-browser --json
```

The second command is expected to report `pass: false`; it verifies the helper shape, not production release closure.

## Boundaries

- Do not read `.env`, `.auth-browser.env`, shell history, or any credential file for this proof.
- Do not weaken the real-account row into anonymous `/api/auth/me` or `/api/private-videos` checks.
- Do not merge `lghui.top` and `pages.dev` into one generic origin. They answer different proof questions.
- Do not treat local source authorities as public proof after deploy; the live custom-domain and source-origin probes must both pass.
