# Round311 Optimization Experience Ledger

Round311 is a防回退 round. It does not claim private-video production recovery. It records the current public contract:

- Real exams use the current 325/325 source/web atomic count, 68/68 split grouped sections, 217 grouped child questions, and 149 collapse loss if grouped parents are merged back.
- 181103 is served as 38/38 standalone HTML content pages. Public surfaces must not expose raw downloads, local paths, or old wrapper metadata.
- The public shell must serve the sanitized Round310 ledger at `/data/fluid-round310-181103-html-content.json`; any legacy Round309 ledger that remains public must also be sanitized.
- Private-video UI/mock management and typed delete confirmation may be reported as source-level hardening only. Production recovery still requires `FM_PRIVATE_MEDIA` on Cloudflare Pages production plus real teacher/student browser QA.
- Live proof must keep `lghui.top`, `lghui-fluid-learning.pages.dev`, release gate, and browser gate as separate facets.

Primary commands:

```bash
node tools/check-round311-optimization-experience-ledger.mjs
node tools/check-round311-181103-live-html-content.mjs --json
node tools/check-fluid-optimization-playbook.mjs
node tests/edge-fluid-upgrade-check.js
```
