# Round318 Mobile A11y Audit

- worker: Round318 frontend/a11y audit, worker D
- date: 2026-06-14
- scope: chapter-practice shortcut surface on the student workbench, knowledge detail links, and Round318 chapter-practice shortcut ledger
- code changed: none

## Summary

The Round318 chapter-practice shortcut data contract is healthy: the local Round318 checker passes, six chapter shortcuts cover all 325 current real-exam atoms, and no question is unlinked from a chapter shortcut. The broader mobile/performance gate also passes with 80 static checks, including viewport, focus-ring, 44 px target, wrapping, horizontal-overflow guard, and intent-based heavy JSON loading coverage.

## Checked Surface

- Student workbench hero exposes the six-chapter entry as a real link with an explicit label: `/modules/question-bank.html?from=student-workbench-chapters`.
- Route-detail chapter shortcuts call `chapterPracticeUrl(no)` and resolve to `/modules/practice-dynamic.html?type=real&chapter=<chapter>&mode=normal&from=edge-learning-workbench`.
- Knowledge detail pages expose `data-knowledge-chapter-practice-link` anchors, and the authenticated browser gate already asserts these are full-pool chapter practice links without `q=`.
- The Round318 ledger preserves the source-count boundary: 325 real questions, 24 active years, 68 grouped sections, 217 grouped web question IDs, six chapter shortcuts, zero unlinked questions.

## A11y Findings

- No blocker found in static audit. Shortcut buttons and chips have semantic button/link elements, ARIA labels, visible `:focus-visible` styles, `aria-pressed` where selection state matters, and mobile wrapping guards.
- Coarse-pointer sizing is covered for `.eflu-btn`, `.eflu-icon-btn`, `.eflu-clue-chip`, `.eflu-input`, tabs, anchors, and segment controls.
- Residual risk: route-detail chapter practice links are rendered as `.eflu-tag` anchors. They wrap safely, but `.eflu-tag` itself is not included in the coarse-pointer `min-height:44px` rule. On narrow touch devices this may make the inline "第 N 章练习" links less comfortable than the primary shortcut buttons. This should be fixed in CSS before turning it into a hard gate.

## Commands

```bash
node tools/check-round318-chapter-practice-shortcuts.mjs
node tools/check-fluid-mobile-performance-budget.mjs
node tools/validate-site-content.mjs
node --input-type=module <<'NODE'
// targeted static probe for chapter shortcut labels, URL shape, focus, and coarse target coverage
NODE
```

## Boundary

This audit does not claim public deploy freshness, live authenticated browser QA, answer-PDF verbatim proof, or private-video production recovery. It only records local frontend/a11y evidence for the Round318 chapter-practice shortcut surface.
