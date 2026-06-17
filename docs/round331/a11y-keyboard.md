# Round331 A11y Keyboard Entry

- version: `round331-a11y-keyboard-entry-20260615`
- worker: Round326+ worker 6
- scope: `practice.html` plus static baseline read of `modules/practice-dynamic.html`
- boundary: did not edit `index.html`, `resources.html`, `real-exams-dynamic.html`, or `modules/practice-dynamic.html`

## Patch

- Added a keyboard-visible skip link to jump directly to the practice main region.
- Added a polite screen-reader status node for start, question, answer, empty-wrong-bank, and finish state updates.
- Converted the start preset cards and question options to native `button` controls with `aria-disabled` / `aria-pressed` state.
- Added 44 px minimum touch-target guards and `overflow-wrap:anywhere` on the new keyboard/touch entry points.

## Verification

```bash
node --check tools/check-round331-a11y-keyboard.mjs
node tools/check-round331-a11y-keyboard.mjs --write --json
```

## Residual

`modules/practice-dynamic.html` already exposes the practice main/container and a 44 px target baseline, but it is a large single-line file and was left untouched in this small patch. The Round331 checker records missing `:focus-visible` there as a warning rather than claiming a full dynamic-page keyboard pass.
