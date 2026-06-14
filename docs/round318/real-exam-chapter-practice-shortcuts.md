# Round318 Real-Exam Chapter-Practice Shortcut Ledger

- version: round318-real-exam-chapter-practice-20260614
- generatedAt: 2026-06-14T10:48:53.227Z
- scope: data/check ledger only; no shared page edits

## Result

- pass: true
- original verified questions: 325
- mapped original questions: 325
- chapter shortcuts locked: 6/6
- chapter-practice cards: 302
- needs-review/candidate cards inside chapter packs: 116
- failed rows: 0

## Source Boundary

Round318 reads the existing real-exam index, question-chapter map, chapter exam packs, Round317 cardinality ledger, and practice module. It does not rewrite question banks or shared pages.

## Chapter Shortcuts

| chapter | title | practice cards | years | warm/core/challenge | needsReview | status | shortcut |
|---:|---|---:|---:|---:|---:|---|---|
| 1 | 流体的物理性质 | 44 | 15 | 6/8/5 | 34 | locked | /modules/practice-dynamic.html?type=real&chapter=1&mode=normal |
| 2 | 理想流体流动 | 77 | 24 | 6/8/5 | 33 | locked | /modules/practice-dynamic.html?type=real&chapter=2&mode=normal |
| 3 | 流体运动的基本方程组 | 15 | 10 | 6/6/5 | 8 | locked | /modules/practice-dynamic.html?type=real&chapter=3&mode=normal |
| 5 | 流体的涡旋运动 | 16 | 9 | 6/8/5 | 5 | locked | /modules/practice-dynamic.html?type=real&chapter=5&mode=normal |
| 6 | 理想不可压缩流体无旋运动 | 35 | 21 | 6/8/5 | 3 | locked | /modules/practice-dynamic.html?type=real&chapter=6&mode=normal |
| 8 | 粘性不可压缩流动 | 115 | 24 | 6/8/5 | 33 | locked | /modules/practice-dynamic.html?type=real&chapter=8&mode=normal |

## Failed Rows

- none

## Verification

```bash
node tools/check-round318-real-exam-chapter-practice.mjs --write --json
```

## Integration Need

Optional only: shared pages may read data/fluid-round318-real-exam-chapter-practice.json to render a visible ledger, but existing chapter shortcut hrefs already route through practice-dynamic.
