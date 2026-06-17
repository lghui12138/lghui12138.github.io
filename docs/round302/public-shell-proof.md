# Round302 Public Shell Proof

Version: `round302-public-shell-proof-helper-20260614`

Expected version: `round302-question-count-181103-enrichment-video-proof-20260614`

Generated at: `2026-06-14T00:32:49.062Z`

This helper separates `lghui.top` public-shell proof from `pages.dev` protected-source proof and from real-account browser QA.

## Status

- Overall pass: `false`
- Anonymous public/source proof ready: `true`
- Real-account proof: `blocked-missing-credentials`
- Boundary: Round302 public-shell proof is not a real-account authentication claim unless the separate credential-bearing browser gate is supplied and passed.

## Live Routes

| route | result | status | detail |
|---|---:|---:|---|
| public-site-updates-top-version | PASS | 200 | top=round302-question-count-181103-enrichment-video-proof-20260614 |
| public-home-no-stale-rounds | PASS | 200 | expectedMarker=yes, stale=0, currentMarkers=1, body=html |
| public-edge-status-shell-no-stale-rounds | PASS | 200 | expectedMarker=yes, stale=0, currentMarkers=1, body=html |
| source-edge-status-current | PASS | 200 | edgeHomeVersion=round302-question-count-181103-enrichment-video-proof-20260614, protected=true |
| source-auth-me-json-401 | PASS | 401 | status=401, contentType=application/json; charset=utf-8, json=yes, html=no |
| source-private-videos-json-401 | PASS | 401 | status=401, contentType=application/json; charset=utf-8, json=yes, html=no |
| source-181103-study-routes-json-401 | PASS | 401 | status=401, contentType=application/json; charset=utf-8, json=yes, html=no |

## Checks

| check | result | detail |
|---|---:|---|
| local-source-authorities-match-expected | PASS | source-site-updates-top-version=round302-question-count-181103-enrichment-video-proof-20260614; source-edge-home-version=round302-question-count-181103-enrichment-video-proof-20260614; source-edge-runtime-js-version=round302-question-count-181103-enrichment-video-proof-20260614 |
| site-updates-top-version | PASS | top=round302-question-count-181103-enrichment-video-proof-20260614 |
| public-shell-no-stale-round264-round300 | PASS | public-home-no-stale-rounds: expectedMarker=yes, stale=0, currentMarkers=1, body=html; public-edge-status-shell-no-stale-rounds: expectedMarker=yes, stale=0, currentMarkers=1, body=html |
| pages-dev-protected-json-401-not-html | PASS | source-auth-me-json-401: status=401, contentType=application/json; charset=utf-8, json=yes, html=no; source-private-videos-json-401: status=401, contentType=application/json; charset=utf-8, json=yes, html=no; source-181103-study-routes-json-401: status=401, contentType=application/json; charset=utf-8, json=yes, html=no |
| edge-status-current | PASS | edgeHomeVersion=round302-question-count-181103-enrichment-video-proof-20260614, protected=true |
| browser-url-count | PASS | checked 60/58+ URLs |
| real-account-proof | FAIL | real teacher/student proof requires the separate authenticated browser gate with credentials supplied outside this helper |

## Commands

- `node --check tools/check-round302-public-shell-proof.mjs`
- `node tools/check-round302-public-shell-proof.mjs --expected-version round302-question-count-181103-enrichment-video-proof-20260614 --json`
- `node tools/check-round302-public-shell-proof.mjs --expected-version round302-question-count-181103-enrichment-video-proof-20260614 --real-account-proof passed --real-account-proof-command "node tools/check-authenticated-browser-gate.mjs"`
