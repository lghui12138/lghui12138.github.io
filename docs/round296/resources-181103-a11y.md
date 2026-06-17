# Round296 Resources / 181103 A11y Handoff

## Scope

Worker D touched the resources center only:

- `resources.html`
- `tools/check-resources-181103-browser.mjs`
- `docs/round296/resources-181103-a11y.md`

No deployment, push, VPN/proxy change, or `/Volumes/mac_2T` execution was performed.

## User-Visible Changes

- The 181103 quick entry now announces the Round296 workbench and specifically names the real-exam, courseware, and workbook review path.
- The 181103 station-learning panel now shows six protected station entries: knowledge review, formula conditions, real-exam review, courseware route, workbook mistake review, and animation support.
- The courseware route uses the existing resource filter path (`data-open-tab="docs"`, `data-filter-tag="课件"`) instead of exposing protected local files.
- The 181103 status pill is a polite, atomic live region and says whether the Round296 protected index is connected or still pending.
- The return-path marker is now Round296-specific while preserving the existing 316/61 true-exam boundary and the no raw-file/no local-path policy.

## Accessibility / Responsive Notes

- The 181103 region remains `role="region"` with `aria-labelledby`, `aria-describedby`, `tabindex="-1"`, and keyboard focus transfer from the quick-entry button.
- All station links keep accessible labels and minimum touch target expectations under the existing mobile browser gate.
- The six station links use a 3-column desktop grid, 2-column tablet grid, and 1-column mobile grid to avoid cramped mobile text.
- The live status uses `role="status"`, `aria-live="polite"`, and `aria-atomic="true"` so status updates are announced as a complete phrase.

## Verification

Run from `/Users/kili/Documents/Codex/lghui-source-private-video-work`:

```bash
node --check tools/check-resources-181103-browser.mjs
NODE_PATH=/Users/kili/Documents/Codex/lghui-source-private-video-work/node_modules node tools/check-resources-181103-browser.mjs --widths 390,768,1280
```

The browser gate checks no horizontal overflow, Round296 markers, six protected station links, no local path exposure, no raw download links, keyboard focus transfer, and 44 px mobile targets.
