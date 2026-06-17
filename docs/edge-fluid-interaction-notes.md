# Edge Fluid Interaction Notes

Agent 3 delivered `js/edge-fluid-learning-upgrade.js` as a no-framework enhancement script for the Cloudflare Pages site behind `lghui.top`.

## Mounting

- Preferred root: `#edge-fluid-upgrade-root`
- Fallback root: auto-created `section#edge-fluid-upgrade-root`
- Fallback placement order: `#vAuthed` after `.hub`, then `main`, then `.container`, then `.wrap`, then `body`
- The script auto-initializes on `DOMContentLoaded`, so the mainline only needs to include it.

## Data Sources

The script first tries optional knowledge upgrade JSON files:

- `/data/edge-fluid-knowledge-upgrade.json`
- `/data/fluid-knowledge-upgrade-2026.json`
- `/data/fluid-knowledge-upgrade.json`
- `/data/fluid-learning-upgrade.json`
- `/data/fluid-knowledge-points-upgrade.json`

If none exists, it gracefully falls back to the current data already reviewed in this round:

- `/data/fluid-knowledge-points.json`
- `/data/fluid-home-search-index.json`
- `/data/fluid-formula-index.json`
- optional `/data/fluid-review-plan.json`
- optional `/data/fluid-knowledge-remediation.json`

## Global API

`window.EdgeFluidLearningUpgrade` and the alias `window.EFLU` expose:

- `init(options)` mounts and loads data. `options.root` may be a selector or element.
- `refresh()` reloads JSON data and rerenders.
- `destroy(keepRoot)` removes listeners and optionally clears the root.
- `search(query, options)` searches merged site, knowledge, and formula indexes.
- `markPoint(pointId, status)` marks `learning`, `done`, or `weak`.
- `addReview(item)` adds a knowledge point, formula, or custom item to local review state.
- `rateReview(itemId, quality)` applies SM-2 review scheduling.
- `removeReview(itemId)` removes local review items.
- `getState()` returns local state, event telemetry, and loaded data counts.
- `resetLocalState(userOnly)` clears all state or the current user's state.
- `track(action, payload)` writes local telemetry to localStorage and mirrors to `FMLog` when available.
- `data()` returns the normalized in-memory data object.

## Local Storage

- State key: `edge_fluid_learning_upgrade_state_v1`
- Telemetry key: `edge_fluid_learning_upgrade_events_v1`
- Reads existing `fm_wrong` for compatibility, without mutating it except when the user rates an `fm_wrong` item through the existing `FMSpacedRep.rate` API.
- Mirrors telemetry to `FMLog.add()` when `lib/fm-core.js` is present.

## Fault Tolerance

- Missing upgrade JSON: uses existing knowledge/search/formula data.
- Missing formula index: extracts formula blocks from knowledge markdown, then falls back to a small built-in formula set.
- Missing `FMCore`: uses local storage, local search, local toast, and local SM-2 implementation.
- Missing MathJax/formula renderer: formulas remain readable as escaped plain text.
- Missing mount root: creates one automatically.
- Duplicate script load: destroys the previous instance before replacing the global API.
- localStorage quota or denial: trims telemetry first, then falls back to in-memory state for the current session.
