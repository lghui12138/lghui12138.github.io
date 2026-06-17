# Round295 resources mobile accessibility gate

Worker E added a focused browser gate for the protected 181103/resource surfaces without changing `resources.html`.

Marker: `round295-resources-mobile-a11y-20260614`

Command:

```bash
NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules node tools/check-resources-181103-browser.mjs --widths=390,768,1280 --timeout-ms=45000
```

Coverage:

- serves `resources.html` from the internal source clone and stubs the auth guard plus `/api/auth/me`
- checks mobile/tablet/desktop widths for no horizontal overflow
- keeps the 181103 protected-material contract locked: 38 protected files, 30 routes, 61 review tasks, 316/61 real-exam return path, no raw downloads, and no local absolute paths
- adds Round295 accessibility checks for page language/title, semantic `main`, duplicate IDs, named region/status metadata, quick-entry `aria-describedby`, keyboard focus transfer into the 181103 region, accessible names, and 44 px mobile touch targets

Boundary:

- This is a source-worktree browser gate only. It does not touch the public shell and does not claim production release proof.
