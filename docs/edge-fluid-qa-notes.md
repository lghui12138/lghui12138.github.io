# Edge Fluid QA Notes

Date: 2026-05-15

Round: `round243-reynolds-boundary-lab-20260515`

Scope: static QA and live-site release checks for the `lghui.top` public shell and the Cloudflare Pages source site.

## Regression Script

Run from the repository root:

```bash
node tests/edge-fluid-upgrade-check.js
```

The script keeps the existing gates:

- required upgraded CSS, JS, JSON, and page files
- `index-complete.html` static href/src/action targets
- Cloudflare Pages middleware entry routes and fast-home links
- JSON parseability for `data/`, `question-banks/`, root manifest/update files, and `public/api/data.json`
- core data field coverage for home search, knowledge points, chapter sections, formula index, knowledge links, real exams, question-bank index, and site updates
- obvious empty links and broken same-page hash anchors

Round243 adds hard checks for the Reynolds-number and boundary-condition hand board across the visible public surfaces:

- `data/fluid-knowledge-upgrade-2026.json`: exact round243 marker and `reynoldsBoundaryLab` data for Reynolds-number judgement, boundary-condition writing, formula selection, real-exam return, and animation use rules
- `functions/_middleware.js`: exact round243 marker, `EDGE_HOME_VERSION`, login/fast-login/fast-home copy, and visible study-route links
- `index-complete.html`: exact round243 marker, Reynolds/boundary copy, homepage search entry, and visible route labels
- `modules/knowledge-upgrade-2026.html`: exact round243 marker, knowledge-upgrade identity, teacher-note copy, data feed, route links, and upgrade root
- `styles/edge-fluid-upgrade.css`: exact round243 marker and `.r243-*` visual layer styles
- `site-updates.json`: newest record must describe round243 and must not present round240, round241, or round242 as the current release

## Copy Gate

The knowledge page has to read like a teacher's exam-prep note, not a product announcement:

- visible copy must contain human teaching cues: teacher/notes/class/problem-writing language
- the page must say the study order plainly: first Reynolds number, then boundary conditions, then formulas or real exam questions
- the first-screen order must put Reynolds number before boundary conditions before formulas before real exam questions
- the round243 surface must name `雷诺数`、`边界条件手算板`、`知识升级入口`、`真题训练`、`自制动画`、`公式`、`边界条件`、`错题`
- obvious product terms such as `赋能`、`闭环`、`驾驶舱`、`全链路`、`生态`、`质量门` must not remain in visible core pages
- obvious AI-tone labels such as `AI味`、`AIGC`、`大模型`、`智能生成`、`智能推荐`、`智能体`、`Prompt` must not remain in the visible knowledge page
- the old English product eyebrow `Visible fluid knowledge upgrade` must not remain in visible page copy

## Current Validation

Required local checks before deployment:

```bash
node --check functions/_middleware.js
node --check js/edge-fluid-learning-upgrade.js
node --check js/edge-fluid-performance.js
node --check tests/edge-fluid-upgrade-check.js
jq empty data/fluid-knowledge-upgrade-2026.json site-updates.json
node tests/edge-fluid-upgrade-check.js
git diff --check
```

Inline scripts in `index-complete.html` and `modules/knowledge-upgrade-2026.html` should also parse with `node:vm`; the public shell should parse `index.html`, `index-complete.html`, and `404.html` the same way.

## Real Site Gate

This round must not be closed on local tests alone. Final delivery has to confirm the real `lghui.top` path:

- open `https://lghui.top` with a fresh verification query if edge cache is sticky
- confirm the public shell is not the old round242 shell
- confirm the public shell shows `round243-reynolds-boundary-lab-20260515` and the words `雷诺数`、`边界条件手算板`、`知识升级入口`、`真题训练`、`自制动画`、`公式`、`边界条件`、`错题`
- confirm the final Cloudflare Pages landing URL and visible DOM include `round243-reynolds-boundary-lab-20260515`
- confirm the source site exposes the Reynolds-number hand board and the same eight learning signals
