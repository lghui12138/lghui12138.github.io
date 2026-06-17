# Round302 Real-Exam Question-Count Audit

Version: `round302-real-exam-question-count-audit-20260614`

Worker A output only. This audit reads existing source/original-row metadata and question-bank rows; it does not edit site versions, release gates, public-shell files, question text, answer text, or source PDFs.

## Summary

- Source/original rows: 176/176
- Active exam years: 24/24
- Source/web atoms: 325/325
- Grouped sections / grouped atoms: 68/217
- Grouped-vs-atom mismatches: 0
- Four-question locks: 13
- Five-question locks: 5
- Risk rows reported: 35
- Stale round reference candidates reported: 11
- Acceptance: pass

## Per-Year Counts

| year | source sections | expected atoms | web atoms | question-bank atoms | grouped sections | status |
|---:|---:|---:|---:|---:|---:|---|
| 2000 | 8 | 16 | 16 | 16 | 5 | locked |
| 2001 | 8 | 11 | 11 | 11 | 1 | locked |
| 2002 | 8 | 9 | 9 | 9 | 1 | locked |
| 2003 | 7 | 9 | 9 | 9 | 1 | locked |
| 2004 | 6 | 18 | 18 | 18 | 2 | locked |
| 2005 | 8 | 16 | 16 | 16 | 6 | locked |
| 2006 | 7 | 14 | 14 | 14 | 3 | locked |
| 2007 | 8 | 22 | 22 | 22 | 6 | locked |
| 2008 | 4 | 9 | 9 | 9 | 2 | locked |
| 2009 | 8 | 8 | 8 | 8 | 0 | locked |
| 2010 | 6 | 21 | 21 | 21 | 3 | locked |
| 2011 | 6 | 18 | 18 | 18 | 2 | locked |
| 2012 | 7 | 16 | 16 | 16 | 5 | locked |
| 2013 | 8 | 10 | 10 | 10 | 2 | locked |
| 2014 | 6 | 13 | 13 | 13 | 3 | locked |
| 2015 | 5 | 14 | 14 | 14 | 4 | locked |
| 2016 | 9 | 9 | 9 | 9 | 0 | locked |
| 2017 | 0 | 0 | 0 | 0 | 0 | locked |
| 2018 | 6 | 14 | 14 | 14 | 4 | locked |
| 2019 | 5 | 13 | 13 | 13 | 5 | locked |
| 2020 | 6 | 17 | 17 | 17 | 5 | locked |
| 2021 | 10 | 12 | 12 | 12 | 2 | locked |
| 2022 | 10 | 10 | 10 | 10 | 0 | locked |
| 2023 | 10 | 11 | 11 | 11 | 1 | locked |
| 2024 | 10 | 15 | 15 | 15 | 5 | locked |

## Explicit Four/Five Locks

| key | label | expected atoms | web atoms | status | question id span |
|---|---|---:|---:|---|---|
| 2000-07 | 2000 连续小问×4 | 4 | 4 | locked | ocean-2000-07-01 -> ocean-2000-07-04 |
| 2001-06 | 2001 连续小问×4 | 4 | 4 | locked | ocean-2001-06-01 -> ocean-2001-06-04 |
| 2004-02 | 2004 名词解释题×4 | 4 | 4 | locked | ocean-2004-02-01 -> ocean-2004-02-04 |
| 2006-01 | 2006 选择题×4 | 4 | 4 | locked | ocean-2006-01-01 -> ocean-2006-01-04 |
| 2006-02 | 2006 连续小问×4 | 4 | 4 | locked | ocean-2006-02-01 -> ocean-2006-02-04 |
| 2007-01 | 2007 名词解释题×4 | 4 | 4 | locked | ocean-2007-01-01 -> ocean-2007-01-04 |
| 2007-02 | 2007 选择题×4 | 4 | 4 | locked | ocean-2007-02-01 -> ocean-2007-02-04 |
| 2007-07 | 2007 连续小问×4 | 4 | 4 | locked | ocean-2007-07-01 -> ocean-2007-07-04 |
| 2008-01 | 2008 简述题×4 | 4 | 4 | locked | ocean-2008-01-01 -> ocean-2008-01-04 |
| 2010-02 | 2010 简答题×5 | 5 | 5 | locked | ocean-2010-02-01 -> ocean-2010-02-05 |
| 2011-02 | 2011 简答题×4 | 4 | 4 | locked | ocean-2011-02-01 -> ocean-2011-02-04 |
| 2012-06 | 2012 连续小问×4 | 4 | 4 | locked | ocean-2012-06-01 -> ocean-2012-06-04 |
| 2014-03 | 2014 连续小问×4 | 4 | 4 | locked | ocean-2014-03-01 -> ocean-2014-03-04 |
| 2015-01 | 2015 简答题×5 | 5 | 5 | locked | ocean-2015-01-01 -> ocean-2015-01-05 |
| 2018-01 | 2018 简答题×5 | 5 | 5 | locked | ocean-2018-01-01 -> ocean-2018-01-05 |
| 2019-01 | 2019 名词解释题×5 | 5 | 5 | locked | ocean-2019-01-01 -> ocean-2019-01-05 |
| 2020-01 | 2020 简答题×5 | 5 | 5 | locked | ocean-2020-01-01 -> ocean-2020-01-05 |
| 2020-04 | 2020 连续小问×4 | 4 | 4 | locked | ocean-2020-04-01 -> ocean-2020-04-04 |

## Risk Rows

First 40 rows from `riskRows`; full details are in `data/fluid-round302-real-exam-question-count-audit.json`.

| key | source kind | expected atoms | question ids | reason |
|---|---|---:|---:|---|
| 2000-07 | calculation-subparts | 4 | 4 | four-or-five-plus-original-items |
| 2001-06 | calculation-subparts | 4 | 4 | four-or-five-plus-original-items |
| 2003-07 | short-answer-family | 3 | 3 | short-answer-family-original-row |
| 2004-01 | calculation-subparts | 10 | 10 | four-or-five-plus-original-items |
| 2004-02 | short-answer-family | 4 | 4 | four-or-five-plus-original-items |
| 2005-08 | short-answer-family | 2 | 2 | short-answer-family-original-row |
| 2006-01 | objective-family | 4 | 4 | four-or-five-plus-original-items |
| 2006-02 | calculation-subparts | 4 | 4 | four-or-five-plus-original-items |
| 2007-01 | short-answer-family | 4 | 4 | four-or-five-plus-original-items |
| 2007-02 | objective-family | 4 | 4 | four-or-five-plus-original-items |
| 2007-07 | calculation-subparts | 4 | 4 | four-or-five-plus-original-items |
| 2008-01 | short-answer-family | 4 | 4 | four-or-five-plus-original-items |
| 2009-02 | short-answer-family | 1 | 1 | short-answer-family-original-row |
| 2009-04 | short-answer-family | 1 | 1 | short-answer-family-original-row |
| 2010-01 | objective-family | 10 | 10 | four-or-five-plus-original-items |
| 2010-02 | short-answer-family | 5 | 5 | four-or-five-plus-original-items |
| 2011-01 | objective-family | 10 | 10 | four-or-five-plus-original-items |
| 2011-02 | short-answer-family | 4 | 4 | four-or-five-plus-original-items |
| 2012-01 | short-answer-family | 3 | 3 | short-answer-family-original-row |
| 2012-06 | calculation-subparts | 4 | 4 | four-or-five-plus-original-items |
| 2013-02 | short-answer-family | 2 | 2 | short-answer-family-original-row |
| 2013-06 | short-answer-family | 1 | 1 | short-answer-family-original-row |
| 2014-01 | short-answer-family | 3 | 3 | short-answer-family-original-row |
| 2014-03 | calculation-subparts | 4 | 4 | four-or-five-plus-original-items |
| 2015-01 | short-answer-family | 5 | 5 | four-or-five-plus-original-items |
| 2018-01 | short-answer-family | 5 | 5 | four-or-five-plus-original-items |
| 2019-01 | short-answer-family | 5 | 5 | four-or-five-plus-original-items |
| 2020-01 | short-answer-family | 5 | 5 | four-or-five-plus-original-items |
| 2020-04 | calculation-subparts | 4 | 4 | four-or-five-plus-original-items |
| 2021-01 | short-answer-family | 1 | 1 | short-answer-family-original-row |
| 2021-02 | short-answer-family | 1 | 1 | short-answer-family-original-row |
| 2021-03 | short-answer-family | 1 | 1 | short-answer-family-original-row |
| 2021-04 | short-answer-family | 1 | 1 | short-answer-family-original-row |
| 2021-05 | short-answer-family | 1 | 1 | short-answer-family-original-row |
| 2022-06 | short-answer-family | 1 | 1 | short-answer-family-original-row |

## Stale Round Reference Candidates

These are reported for main-thread integration. Worker A did not rewrite them.

| file | token | matches | classification |
|---|---|---:|---|
| data/fluid-round300-real-exam-source-depth.json | round300 | 414 | expected-prior-round-artifact |
| data/fluid-round301-real-exam-original-row-audit.json | round300 | 2 | prior-round-input-reference |
| data/fluid-round301-real-exam-original-row-audit.json | round301 | 2 | expected-prior-round-artifact |
| docs/round300/real-exam-source-depth.md | round300 | 1 | expected-prior-round-artifact |
| docs/round301/real-exam-original-row-audit.md | round301 | 2 | expected-prior-round-artifact |
| modules/real-exams-dynamic.html | round300 | 4 | candidate-stale-active-surface-reference |
| modules/real-exams-dynamic.html | round301 | 6 | candidate-stale-active-surface-reference |
| index-complete.html | round264 | 9 | candidate-stale-active-surface-reference |
| site-updates.json | round264 | 35 | candidate-stale-active-surface-reference |
| site-updates.json | round300 | 5 | candidate-stale-active-surface-reference |
| site-updates.json | round301 | 7 | candidate-stale-active-surface-reference |

## Checks

| check | status |
|---|---|
| source-index-and-section-ledgers-align | pass |
| all-year-and-section-question-counts-lock | pass |
| grouped-vs-atom-counts-lock | pass |
| four-and-five-question-locks-present | pass |
| prior-round-count-gates-still-pass | pass |
| stale-round-reference-report-generated | pass |

## Boundary

Original-row/question-count audit only; not public release, browser QA, answer-PDF provenance, or site integration proof.
