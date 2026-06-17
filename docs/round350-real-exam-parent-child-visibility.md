# Round350 Real-Exam Parent/Child Visibility

Version: `round350-real-exam-parent-child-visibility-20260615`

This is a page-visibility and source-lock gate for the user-facing confusion that real-exam counts can look higher after splitting original parent rows. It keeps the proof boundary narrow: source-row/year-pack/page visibility alignment only, not a claim that every original PDF page has been manually re-reviewed in this round.

## Summary

- source atomic questions: 325
- grouped sections / grouped child ids: 68/217
- four/five small-question locks: 18/18
- five-item parents: 5
- five-item atoms: 25
- visible five-item parent ranges: 5/5
- direct parent-card regressions: 0
- failed checks: 0

## Parent Rows

| key | parent | status | atoms | child id span | visible |
|---|---|---|---:|---|---|
| 2010-02 | ocean-2010-02 | locked | 5 | ocean-2010-02-01 -> ocean-2010-02-05 | yes |
| 2015-01 | ocean-2015-01 | locked | 5 | ocean-2015-01-01 -> ocean-2015-01-05 | yes |
| 2018-01 | ocean-2018-01 | locked | 5 | ocean-2018-01-01 -> ocean-2018-01-05 | yes |
| 2019-01 | ocean-2019-01 | locked | 5 | ocean-2019-01-01 -> ocean-2019-01-05 | yes |
| 2020-01 | ocean-2020-01 | locked | 5 | ocean-2020-01-01 -> ocean-2020-01-05 | yes |

## Checks

| check | status |
|---|---|
| round346-five-item-locks-still-green | PASS |
| round324-four-five-locks-still-green | PASS |
| page-explains-why-count-is-larger | PASS |
| five-item-parent-ranges-visible-on-page | PASS |
| no-direct-parent-card-regression | PASS |

## Boundary

- Page edited: `true`
- Question text edited: `false`
- Answer text edited: `false`
- Manual full original review claim: `false`
- Production claim: `false`
- Python used: `false`
