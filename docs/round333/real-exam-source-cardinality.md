# Round333 Real-Exam Source Cardinality Gate

Version: `round333-real-exam-source-cardinality-20260615`

This worker turns the "some original short-answer years really have five questions and must not be merged" rule into a stronger local gate. It rebuilds the current Round324 no-merge audit, cross-checks the Round325 authority ledger, and materializes the key year structures that reviewers keep asking about.

## Summary

- source/web atomic questions: 325/325
- grouped sections / grouped subquestions: 68/217
- 4/5 source-row locks: 18 rows / 77 atoms
- five-item short-answer locks: 5 rows / 25 atoms
- critical structures listed: 9 years / 27 grouped sections
- failed checks: 0

## Non-Merge Policy

- source/web atomic questions must stay 325/325
- grouped source sections must stay 68 and grouped web subquestions must stay 217
- all 18 four/five source rows must stay locked
- the five-item short-answer keys 2010-02, 2015-01, 2018-01, 2019-01, 2020-01 must each expose item numbers 1-5
- critical year structures for 2000, 2001, 2004, 2008, 2010, 2015, 2018, 2020, and 2023 must be materialized in this ledger

## Five-Item Short-Answer Locks

| key | anchor | status | expected | actual | question-id span |
|---|---|---|---:|---:|---|
| 2010-02 | 2010 二、简答题×5 | locked | 5 | 5 | ocean-2010-02-01 -> ocean-2010-02-05 |
| 2015-01 | 2015 一、简答题×5 | locked | 5 | 5 | ocean-2015-01-01 -> ocean-2015-01-05 |
| 2018-01 | 2018 一、简答题×5 | locked | 5 | 5 | ocean-2018-01-01 -> ocean-2018-01-05 |
| 2019-01 | 2019 一、名词解释×5 | locked | 5 | 5 | ocean-2019-01-01 -> ocean-2019-01-05 |
| 2020-01 | 2020 一、概念与简答题×5 | locked | 5 | 5 | ocean-2020-01-01 -> ocean-2020-01-05 |

## Critical Year Structures

| year | status | year count expected/actual | grouped expected/actual | locked section structure |
|---:|---|---:|---:|---|
| 2000 | locked | 16/16 | 5/5 | 2000-02 x2, 2000-03 x2, 2000-06 x3, 2000-07 x4, 2000-08 x2 |
| 2001 | locked | 11/11 | 1/1 | 2001-06 x4 |
| 2004 | locked | 18/18 | 2/2 | 2004-01 x10, 2004-02 x4 |
| 2008 | locked | 9/9 | 2/2 | 2008-01 x4, 2008-03 x3 |
| 2010 | locked | 21/21 | 3/3 | 2010-01 x10, 2010-02 x5, 2010-05 x3 |
| 2015 | locked | 14/14 | 4/4 | 2015-01 x5, 2015-02 x3, 2015-04 x3, 2015-05 x2 |
| 2018 | locked | 14/14 | 4/4 | 2018-01 x5, 2018-04 x2, 2018-05 x3, 2018-06 x2 |
| 2020 | locked | 17/17 | 5/5 | 2020-01 x5, 2020-02 x3, 2020-04 x4, 2020-05 x2, 2020-06 x2 |
| 2023 | locked | 11/11 | 1/1 | 2023-09 x2 |

## All Four/Five Source Rows

| key | anchor | status | expected | actual | question-id span |
|---|---|---|---:|---:|---|
| 2000-07 | 2000 连续小问×4 | locked | 4 | 4 | ocean-2000-07-01 -> ocean-2000-07-04 |
| 2001-06 | 2001 连续小问×4 | locked | 4 | 4 | ocean-2001-06-01 -> ocean-2001-06-04 |
| 2004-02 | 2004 名词解释题×4 | locked | 4 | 4 | ocean-2004-02-01 -> ocean-2004-02-04 |
| 2006-01 | 2006 选择题×4 | locked | 4 | 4 | ocean-2006-01-01 -> ocean-2006-01-04 |
| 2006-02 | 2006 连续小问×4 | locked | 4 | 4 | ocean-2006-02-01 -> ocean-2006-02-04 |
| 2007-01 | 2007 名词解释题×4 | locked | 4 | 4 | ocean-2007-01-01 -> ocean-2007-01-04 |
| 2007-02 | 2007 选择题×4 | locked | 4 | 4 | ocean-2007-02-01 -> ocean-2007-02-04 |
| 2007-07 | 2007 连续小问×4 | locked | 4 | 4 | ocean-2007-07-01 -> ocean-2007-07-04 |
| 2008-01 | 2008 简述题×4 | locked | 4 | 4 | ocean-2008-01-01 -> ocean-2008-01-04 |
| 2010-02 | 2010 简答题×5 | locked | 5 | 5 | ocean-2010-02-01 -> ocean-2010-02-05 |
| 2011-02 | 2011 简答题×4 | locked | 4 | 4 | ocean-2011-02-01 -> ocean-2011-02-04 |
| 2012-06 | 2012 连续小问×4 | locked | 4 | 4 | ocean-2012-06-01 -> ocean-2012-06-04 |
| 2014-03 | 2014 连续小问×4 | locked | 4 | 4 | ocean-2014-03-01 -> ocean-2014-03-04 |
| 2015-01 | 2015 简答题×5 | locked | 5 | 5 | ocean-2015-01-01 -> ocean-2015-01-05 |
| 2018-01 | 2018 简答题×5 | locked | 5 | 5 | ocean-2018-01-01 -> ocean-2018-01-05 |
| 2019-01 | 2019 名词解释题×5 | locked | 5 | 5 | ocean-2019-01-01 -> ocean-2019-01-05 |
| 2020-01 | 2020 简答题×5 | locked | 5 | 5 | ocean-2020-01-01 -> ocean-2020-01-05 |
| 2020-04 | 2020 连续小问×4 | locked | 4 | 4 | ocean-2020-04-01 -> ocean-2020-04-04 |

## Checks

| check | status |
|---|---|
| round325-authority-baseline-still-325-325-68-217 | PASS |
| rebuilt-round324-expanded-count-guard-still-passes | PASS |
| all-68-grouped-sections-remain-217-web-subquestions | PASS |
| four-five-source-rows-remain-18-locks | PASS |
| five-item-short-answer-keys-are-exact-and-unmerged | PASS |
| critical-year-structures-listed-and-locked | PASS |
| round333-scope-is-local-data-doc-only | PASS |

## Boundary

- Read-only sources: `data/fluid-round307-real-exam-source-row-year-count-lock.json`, `data/fluid-round324-real-exam-expanded-count-guard.json`, `data/fluid-round325-real-exam-answer-no-merge.json`, `tools/check-round324-real-exam-expanded-count-guard.mjs`, and `question-banks/real-exam-years/*.json`.
- Wrote only `data/fluid-round333-real-exam-source-cardinality.json`, `data/fluid-round333-real-exam-source-cardinality.json.gz`, and `docs/round333/real-exam-source-cardinality.md`.
- No page, route, answer text, deployment, browser proof, release-gate, public-shell, VPN/proxy, or private-video production claim is included.
