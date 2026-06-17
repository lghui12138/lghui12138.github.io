# Round344 181103 Production HTML Gate

- version: round344-181103-production-html-20260615
- generatedAt: 2026-06-14T21:14:15.708Z
- local material pages: 38/38
- live 200 text/html routes: 4/4
- direct public content routes: 2/4
- pages.dev protected source shell routes: 2
- forbidden viewer/download/raw/local-path risks: 0
- production origins: https://lghui.top, https://lghui-fluid-learning.pages.dev
- sample material route: `/resources/fluid-181103-html/materials/01-fluid-181103-01-material/index.html`

## Boundary

This is a read-only Node gate. It uses `node:http` / `node:https` for public routes and local file reads for the repository copy. It does not use Python, Playwright, browser automation, VPN/proxy mutation, or any external-volume path.

The gate proves route shape, not private-account recovery. The `lghui.top` public routes must return direct 181103 HTML content; `pages.dev` is recorded separately as the authenticated source origin and must at least return `200` + `text/html` without viewer/download/raw/local-path leakage. The local 38/38 material pages must remain direct in-site HTML pages.

## Live Routes

| Origin | Route | Status | text/html | Shape | Result | Final URL |
| --- | --- | ---: | --- | --- | --- | --- |
| https://lghui.top | index | 200 | yes | direct-181103-html | PASS | `https://lghui.top/resources/fluid-181103-html/index.html` |
| https://lghui.top | sample-material | 200 | yes | direct-181103-html | PASS | `https://lghui.top/resources/fluid-181103-html/materials/01-fluid-181103-01-material/index.html` |
| https://lghui-fluid-learning.pages.dev | index | 200 | yes | protected-source-shell | PASS | `https://lghui-fluid-learning.pages.dev/resources/fluid-181103-html/index.html` |
| https://lghui-fluid-learning.pages.dev | sample-material | 200 | yes | protected-source-shell | PASS | `https://lghui-fluid-learning.pages.dev/resources/fluid-181103-html/materials/01-fluid-181103-01-material/index.html` |

## Checks

| Check | Result |
| --- | --- |
| local-index-links-38-material-html-pages | PASS |
| local-38-material-pages-exist-and-are-direct-html | PASS |
| local-index-and-material-pages-have-no-viewer-download-raw-or-local-path | PASS |
| production-origins-return-200-text-html-for-index-and-sample | PASS |
| lghui-top-public-routes-are-direct-181103-html-not-shell | PASS |
| pages-dev-source-routes-are-text-html-and-not-viewer-download-raw-local | PASS |

## Replay

```bash
node --check tools/check-round344-181103-production-html.mjs
node tools/check-round344-181103-production-html.mjs --write --json
```
