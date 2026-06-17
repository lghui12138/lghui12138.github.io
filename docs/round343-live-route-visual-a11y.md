# Round343 Live Route Visual A11y

- version: `round343-live-route-visual-a11y-20260615`
- generatedAt: `2026-06-15T19:26:44.319Z`
- source origin: `https://lghui-fluid-learning.pages.dev`
- public origin: `https://lghui.top`
- pass: `true`

This is an anonymous live browser gate for visible route text, entry overlap/occlusion, keyboard focus evidence, ARIA references, live/status regions, and basic mobile/desktop usability. It does not claim real-account QA or private-video production recovery.

## Summary

- routes: `8`
- viewport checks: `24`
- checks: `14/14` pass, `0` warn, `0` fail
- pages.dev edgeHomeVersion: `round358-181103-522-html-practice-release-20260616`
- local login shell live/status source gate: `PASS` (functions/_middleware.js:2539)

## Routes

| Route | Result | URL | Viewports |
| --- | --- | --- | --- |
| public-home | PASS | https://lghui.top/ | 390: PASS<br>768: PASS<br>1280: PASS |
| public-resources | PASS | https://lghui.top/resources.html | 390: PASS<br>768: PASS<br>1280: PASS |
| source-login-home | PASS | https://lghui-fluid-learning.pages.dev/ | 390: PASS<br>768: PASS<br>1280: PASS |
| source-resources | PASS | https://lghui-fluid-learning.pages.dev/resources.html | 390: PASS<br>768: PASS<br>1280: PASS |
| source-question-bank | PASS | https://lghui-fluid-learning.pages.dev/modules/question-bank.html | 390: PASS<br>768: PASS<br>1280: PASS |
| source-practice | PASS | https://lghui-fluid-learning.pages.dev/practice.html | 390: PASS<br>768: PASS<br>1280: PASS |
| source-real-exams | PASS | https://lghui-fluid-learning.pages.dev/modules/real-exams-dynamic.html | 390: PASS<br>768: PASS<br>1280: PASS |
| source-knowledge | PASS | https://lghui-fluid-learning.pages.dev/modules/knowledge-detail.html | 390: PASS<br>768: PASS<br>1280: PASS |

## Checks

| Check | Status |
| --- | --- |
| source-edge-status-live-and-versioned | PASS |
| local-login-shell-source-has-live-status | PASS |
| public-home-all-viewports-pass | PASS |
| public-resources-all-viewports-pass | PASS |
| source-login-home-all-viewports-pass | PASS |
| source-resources-all-viewports-pass | PASS |
| source-question-bank-all-viewports-pass | PASS |
| source-practice-all-viewports-pass | PASS |
| source-real-exams-all-viewports-pass | PASS |
| source-knowledge-all-viewports-pass | PASS |
| all-live-routes-have-visible-text | PASS |
| desktop-and-mobile-widths-covered | PASS |
| no-live-route-horizontal-overflow | PASS |
| no-blocking-aria-or-focus-failures | PASS |

## Commands

```bash
NODE_PATH=/Applications/Codex.app/Contents/Resources/cua_node/lib/node_modules node --check tools/check-round343-live-route-visual-a11y.mjs
NODE_PATH=/Applications/Codex.app/Contents/Resources/cua_node/lib/node_modules node tools/check-round343-live-route-visual-a11y.mjs --write --json
```

## Boundary

- no Python
- no VPN/proxy mutation
- no real-account credential proof
- no FM_PRIVATE_MEDIA R2 proof
