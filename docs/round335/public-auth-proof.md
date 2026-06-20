# Round335 Public/Auth Proof

- version: round335-public-auth-proof-20260615
- expectedVersion: round411-server-progress-monotonic-no-drift-20260620
- generatedAt: 2026-06-20T06:49:44.010Z
- pass: true
- public shell: https://lghui.top
- auth origin: https://lghui-fluid-learning.pages.dev

Round335 is a live public/auth proof. It requires the current HTTPS public shell, pages.dev edge version, lghui.top-to-pages.dev QA auth chain, and real teacher/student authenticated browser gate. Credential values are not printed or stored.

## Acceptance

| Check | Result |
| --- | --- |
| lghui-top-site-updates-version | PASS |
| pages-dev-edge-status-version | PASS |
| public-browser-https-lghui-top | PASS |
| public-browser-pages-dev-edge-refresh | PASS |
| http-redirect-probe-separated | PASS |
| auth-chain-dedicated-qa-teacher | PASS |
| auth-chain-dedicated-qa-student | PASS |
| authenticated-browser-gate-ok | PASS |
| authenticated-browser-qa-teacher | PASS |
| authenticated-browser-qa-student | PASS |

## Live Version

- lghui.top site-updates latest: `round411-server-progress-monotonic-no-drift-20260620`
- pages.dev edgeHomeVersion: `round411-server-progress-monotonic-no-drift-20260620`

## HTTP Redirect Probe

- status: `passed`
- accepted as warning: `false`
- finalUrl: `http://lghui.top/`
- note: Plain HTTP probe passed without needing warning classification.

## Authenticated Accounts

| Role | QA account | QA kind | Role surface |
| --- | --- | --- | --- |
| teacher | yes | qa-teacher | PASS |
| student | yes | qa-student | PASS |

## Commands

- `NODE_PATH=<codex-runtime-node-modules> node tools/check-public-entry-browser.mjs --expected-edge-version round411-server-progress-monotonic-no-drift-20260620 --urls '["http://lghui.top/","https://lghui.top/","https://lghui-fluid-learning.pages.dev/","https://lghui-fluid-learning.pages.dev/index-complete?edge_refresh=round411-server-progress-monotonic-no-drift-20260620"]'`
- `NODE_PATH=<codex-runtime-node-modules> node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version round411-server-progress-monotonic-no-drift-20260620`
- `NODE_PATH=<codex-runtime-node-modules> node tools/check-authenticated-browser-gate.mjs --production --expected-version round411-server-progress-monotonic-no-drift-20260620 --timeout-ms 120000`
