# Round337 Learning A11y Flow

- version: `round337-learning-a11y-flow-20260615`
- generated: `2026-06-15T11:20:00+08:00`
- scope: `index.html`, `index-complete.html`, `question-bank-home.html`, `modules/question-bank.html`, `practice.html`, `modules/knowledge-detail.html`
- boundary: Node/shell-only static proof; no Python, no VPN/proxy changes, no 181103 or real-exam data edits.

## What Changed

- Home fallback, question-bank home, practice start, and knowledge detail now expose the same visible route set: 181103, real exam, formula route, mistake review, and resources/private-course state.
- The route entries are native links with visible focus styling and stable `data-round337-intent` hooks.
- Route/status text is tied to polite live/status regions where the page already has loading or start-state announcements.

## Page Evidence

| page | intents | focus evidence | live/status evidence |
|---|---:|---|---|
| index.html | 5/5 | yes | yes |
| index-complete.html | 5/5 | yes | yes |
| question-bank-home.html | 5/5 | yes | yes |
| modules/question-bank.html | 5/5 | yes | yes |
| practice.html | 5/5 | yes | yes |
| modules/knowledge-detail.html | 5/5 | yes | yes |

## Checks

| check | status |
|---|---|
| round337-pages-expose-learning-flow-markers | PASS |
| round337-five-intents-visible-on-home-question-practice-knowledge | PASS |
| round337-focus-states-are-static-and-keyboard-visible | PASS |
| round337-live-status-regions-record-route-state | PASS |
| round337-links-avoid-raw-download-viewer-and-local-paths | PASS |
| round337-count-boundary-stays-181103-and-real-exam-ledger-only | PASS |
| round337-doc-cross-references-prior-intent-and-keyboard-gates | PASS |

## Data Boundary

- 181103 material-question ledger observed: `522`
- real-exam index observed: `325`
- data sources edited here: `false`
- private-video production recovery claimed: `false`

## Verification

```bash
node --check tools/check-round337-learning-a11y-flow.mjs
node tools/check-round337-learning-a11y-flow.mjs --write --json
```
