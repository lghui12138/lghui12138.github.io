# Round335 Public/Auth Proof

- version: round335-public-auth-proof-20260615
- expectedVersion: round358-181103-522-html-practice-release-20260616
- generatedAt: 2026-06-15T17:36:37.000Z
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

- lghui.top site-updates latest: `round358-181103-522-html-practice-release-20260616`
- pages.dev edgeHomeVersion: `round358-181103-522-html-practice-release-20260616`

## HTTP Redirect Probe

- status: `passed`
- accepted as warning: `false`
- finalUrl: `https://lghui.top/`
- note: Plain HTTP probe passed without needing warning classification.

## Authenticated Accounts

| Role | QA account | QA kind | Role surface |
| --- | --- | --- | --- |
| teacher | yes | qa-teacher | PASS |
| student | yes | qa-student | PASS |

## Commands

- `NODE_PATH=<codex-runtime-node-modules> node tools/check-public-entry-browser.mjs --expected-edge-version round358-181103-522-html-practice-release-20260616 --urls '["http://lghui.top/","https://lghui.top/","https://lghui-fluid-learning.pages.dev/","https://lghui-fluid-learning.pages.dev/index-complete?edge_refresh=round358-181103-522-html-practice-release-20260616"]'`
- `NODE_PATH=<codex-runtime-node-modules> node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version round358-181103-522-html-practice-release-20260616`
- `NODE_PATH=<codex-runtime-node-modules> node tools/check-authenticated-browser-gate.mjs --production --expected-version round358-181103-522-html-practice-release-20260616`
