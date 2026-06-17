# Round295 Upgrade Bundle

Version: `round295-evidence-boundary-resource-upgrade-20260614`

Round295 integrates the six worker tracks into one release gate. It updates the visible public version, keeps the real-exam count contract at 316/316 and 61/61, preserves five independent short-answer rows for 2010-02, 2015-01, 2018-01, 2019-01, and 2020-01, and keeps the private-video production blocker explicit.

## Evidence

- Real exam count visibility: 316/316, grouped sections 61/61, five-item locks 2010-02, 2015-01, 2018-01, 2019-01, 2020-01.
- Answer/PDF boundary: original question PDF proof 316, strict answer PDF proof 0, derived/textbook-supported answers 316.
- 181103 route expansion: 38 protected materials, 30 routes, 61 review tasks.
- Resources a11y: `round295-resources-mobile-a11y-20260614`, 390/768/1280 viewport gate, 44px mobile target check.
- Private video: source and mock checks pass; production recovery remains blocked by missing real-account QA and missing `FM_PRIVATE_MEDIA` R2.

## Blocked Claims

- Do not claim real teacher/student browser QA until the auth env is present and the public browser check passes.
- Do not claim storage-backed private-video management recovery until Cloudflare Pages has `FM_PRIVATE_MEDIA` R2 and the real-account delete/manage path passes.
- Do not describe derived textbook/notes answers as original answer PDF proof.
