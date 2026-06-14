# Round306 Real-Exam Granularity Atlas

Version: `round306-real-exam-granularity-atlas-20260614`

This atlas proves the current real-exam surface still preserves original source-section granularity. It focuses on no-merge risk: grouped source sections remain split into web atomic question IDs, and short-answer sections with four or five original items stay separated.

## Summary

- Source/web atoms: 316/316
- Grouped sections: 61
- Grouped web question IDs: 201
- Short-answer four/five sections: 9 across years 2004, 2007, 2008, 2010, 2011, 2015, 2018, 2019, 2020
- High-risk grouped sections: 20 across years 2000, 2004, 2006, 2007, 2008, 2010, 2011, 2012, 2014, 2015, 2018, 2019, 2020
- Current merge-loss sections/atoms: 0/0
- Collapse loss if every grouped source section were merged to one parent: 140
- Acceptance: pass

## Grouped Buckets

| original items | grouped sections | web question IDs | collapse loss if merged | keys |
|---:|---:|---:|---:|---|
| 2 | 25 | 50 | 25 | 2000-02, 2000-03, 2000-08, 2002-08, 2005-01, 2005-03, 2005-07, 2005-08, 2006-06, 2007-04, 2012-05, 2012-07, 2013-02, 2013-03, 2015-05, 2018-04, 2018-06, 2019-02, 2019-03, 2019-04, 2019-05, 2020-05, 2020-06, 2021-06, 2021-09 |
| 3 | 16 | 48 | 32 | 2000-06, 2003-07, 2005-02, 2005-06, 2007-03, 2007-08, 2008-03, 2010-05, 2012-01, 2012-02, 2014-01, 2014-02, 2015-02, 2015-04, 2018-05, 2020-02 |
| 4 | 12 | 48 | 36 | 2000-07, 2004-02, 2006-01, 2006-02, 2007-01, 2007-02, 2007-07, 2008-01, 2011-02, 2012-06, 2014-03, 2020-04 |
| 5 | 5 | 25 | 20 | 2010-02, 2015-01, 2018-01, 2019-01, 2020-01 |
| 10 | 3 | 30 | 27 | 2004-01, 2010-01, 2011-01 |

## Short-Answer Four/Five Locks

| key | source title | source items | web atoms | question ID span | collapse loss if merged | status |
|---|---|---:|---:|---|---:|---|
| 2004-02 | 二、名词解释（20 分，每小题 5 分） | 4 | 4 | ocean-2004-02-01 -> ocean-2004-02-04 | 3 | locked |
| 2007-01 | 一、名词解释（20 分，各 5 分） | 4 | 4 | ocean-2007-01-01 -> ocean-2007-01-04 | 3 | locked |
| 2008-01 | 一、简述题 | 4 | 4 | ocean-2008-01-01 -> ocean-2008-01-04 | 3 | locked |
| 2010-02 | 二、简答题(每题 8 分,共 40 分) | 5 | 5 | ocean-2010-02-01 -> ocean-2010-02-05 | 4 | locked |
| 2011-02 | 二、简答题（每题 10 分，40 分） | 4 | 4 | ocean-2011-02-01 -> ocean-2011-02-04 | 3 | locked |
| 2015-01 | 一、简答题(1-5) | 5 | 5 | ocean-2015-01-01 -> ocean-2015-01-05 | 4 | locked |
| 2018-01 | 一、简答题(每题 10 分,共 50 分) | 5 | 5 | ocean-2018-01-01 -> ocean-2018-01-05 | 4 | locked |
| 2019-01 | 一、名词解释(每个名词 10 分,共 50 分) | 5 | 5 | ocean-2019-01-01 -> ocean-2019-01-05 | 4 | locked |
| 2020-01 | 一、概念与简答题(每题 10 分,共 50 分) | 5 | 5 | ocean-2020-01-01 -> ocean-2020-01-05 | 4 | locked |

## High-Risk Years And Sections

| key | severity | source kind | source items | question ID span | collapse loss if merged |
|---|---|---|---:|---|---:|
| 2004-01 | critical | calculation-subparts | 10 | ocean-2004-01-01 -> ocean-2004-01-10 | 9 |
| 2010-01 | critical | objective-family | 10 | ocean-2010-01-01 -> ocean-2010-01-10 | 9 |
| 2011-01 | critical | objective-family | 10 | ocean-2011-01-01 -> ocean-2011-01-10 | 9 |
| 2010-02 | critical | short-answer-family | 5 | ocean-2010-02-01 -> ocean-2010-02-05 | 4 |
| 2015-01 | critical | short-answer-family | 5 | ocean-2015-01-01 -> ocean-2015-01-05 | 4 |
| 2018-01 | critical | short-answer-family | 5 | ocean-2018-01-01 -> ocean-2018-01-05 | 4 |
| 2019-01 | critical | short-answer-family | 5 | ocean-2019-01-01 -> ocean-2019-01-05 | 4 |
| 2020-01 | critical | short-answer-family | 5 | ocean-2020-01-01 -> ocean-2020-01-05 | 4 |
| 2000-07 | high | calculation-subparts | 4 | ocean-2000-07-01 -> ocean-2000-07-04 | 3 |
| 2004-02 | high | short-answer-family | 4 | ocean-2004-02-01 -> ocean-2004-02-04 | 3 |
| 2006-01 | high | objective-family | 4 | ocean-2006-01-01 -> ocean-2006-01-04 | 3 |
| 2006-02 | high | calculation-subparts | 4 | ocean-2006-02-01 -> ocean-2006-02-04 | 3 |
| 2007-01 | high | short-answer-family | 4 | ocean-2007-01-01 -> ocean-2007-01-04 | 3 |
| 2007-02 | high | objective-family | 4 | ocean-2007-02-01 -> ocean-2007-02-04 | 3 |
| 2007-07 | high | calculation-subparts | 4 | ocean-2007-07-01 -> ocean-2007-07-04 | 3 |
| 2008-01 | high | short-answer-family | 4 | ocean-2008-01-01 -> ocean-2008-01-04 | 3 |
| 2011-02 | high | short-answer-family | 4 | ocean-2011-02-01 -> ocean-2011-02-04 | 3 |
| 2012-06 | high | calculation-subparts | 4 | ocean-2012-06-01 -> ocean-2012-06-04 | 3 |
| 2014-03 | high | calculation-subparts | 4 | ocean-2014-03-01 -> ocean-2014-03-04 | 3 |
| 2020-04 | high | calculation-subparts | 4 | ocean-2020-04-01 -> ocean-2020-04-04 | 3 |

## Current Merge-Loss Rows

| key | source items | web atoms | question IDs | reason |
|---|---:|---:|---:|---|
| none | 0 | 0 | 0 | none |

## Checks

| check | status |
|---|---|
| source-and-web-atomic-counts-316-316 | pass |
| grouped-section-counts-61-and-201 | pass |
| no-current-merge-loss | pass |
| four-five-short-answer-sections-present-and-preserved | pass |
| upstream-round303-round304-acceptance-pass | pass |

## Boundary

Round306 proves current real-exam granularity/no-merge preservation from existing source-aligned artifacts only. It is not a deploy, browser proof, answer-original-PDF provenance proof, or public release claim.
