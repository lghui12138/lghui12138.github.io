# Round303 Real-Exam No-Merge Evidence

Version: `round303-real-exam-no-merge-evidence-20260614`

Worker A output only. This artifact makes the existing Round294/Round302 real-exam no-merge evidence directly usable by UI and release gates. It does not edit shared version files, site UI, public shell, question text, answer text, deploy state, or raw source documents.

## Summary

- Source section rows: 176/176
- Source/web atoms: 325/325
- Grouped sections / grouped atoms: 68/217
- Split grouped sections: 68/68
- Four-question grouped locks: 13/13
- Five-question grouped locks: 5/5
- Current section/grouped mismatches: 0/0
- Action rows: high 21, watch 56, blocker 0
- Acceptance: pass

## Grouped Subquestion Buckets

| grouped subquestions | grouped sections | web atoms | high-risk keys | sample keys |
|---:|---:|---:|---:|---|
| 2 | 31 | 62 | 0 | 2000-02, 2000-03, 2000-08, 2002-08, 2005-01, 2005-03, 2005-07, 2005-08, 2006-06, 2007-04 |
| 3 | 16 | 48 | 0 | 2000-06, 2003-07, 2005-02, 2005-06, 2007-03, 2007-08, 2008-03, 2010-05, 2012-01, 2012-02 |
| 4 | 13 | 52 | 13 | 2000-07, 2001-06, 2004-02, 2006-01, 2006-02, 2007-01, 2007-02, 2007-07, 2008-01, 2011-02 |
| 5 | 5 | 25 | 5 | 2010-02, 2015-01, 2018-01, 2019-01, 2020-01 |
| 10 | 3 | 30 | 3 | 2004-01, 2010-01, 2011-01 |

## Four-Question Grouped Sections

| key | source kind | atoms | question id span | risk |
|---|---|---:|---|---|
| 2000-07 | calculation-subparts | 4 | ocean-2000-07-01 -> ocean-2000-07-04 | high |
| 2001-06 | calculation-subparts | 4 | ocean-2001-06-01 -> ocean-2001-06-04 | high |
| 2004-02 | short-answer-family | 4 | ocean-2004-02-01 -> ocean-2004-02-04 | high |
| 2006-01 | objective-family | 4 | ocean-2006-01-01 -> ocean-2006-01-04 | high |
| 2006-02 | calculation-subparts | 4 | ocean-2006-02-01 -> ocean-2006-02-04 | high |
| 2007-01 | short-answer-family | 4 | ocean-2007-01-01 -> ocean-2007-01-04 | high |
| 2007-02 | objective-family | 4 | ocean-2007-02-01 -> ocean-2007-02-04 | high |
| 2007-07 | calculation-subparts | 4 | ocean-2007-07-01 -> ocean-2007-07-04 | high |
| 2008-01 | short-answer-family | 4 | ocean-2008-01-01 -> ocean-2008-01-04 | high |
| 2011-02 | short-answer-family | 4 | ocean-2011-02-01 -> ocean-2011-02-04 | high |
| 2012-06 | calculation-subparts | 4 | ocean-2012-06-01 -> ocean-2012-06-04 | high |
| 2014-03 | calculation-subparts | 4 | ocean-2014-03-01 -> ocean-2014-03-04 | high |
| 2020-04 | calculation-subparts | 4 | ocean-2020-04-01 -> ocean-2020-04-04 | high |

## Five-Question Grouped Sections

| key | source kind | atoms | question id span | risk |
|---|---|---:|---|---|
| 2010-02 | short-answer-family | 5 | ocean-2010-02-01 -> ocean-2010-02-05 | high |
| 2015-01 | short-answer-family | 5 | ocean-2015-01-01 -> ocean-2015-01-05 | high |
| 2018-01 | short-answer-family | 5 | ocean-2018-01-01 -> ocean-2018-01-05 | high |
| 2019-01 | short-answer-family | 5 | ocean-2019-01-01 -> ocean-2019-01-05 | high |
| 2020-01 | short-answer-family | 5 | ocean-2020-01-01 -> ocean-2020-01-05 | high |

## Source Section Action Rows

First 50 non-baseline rows are shown here. The complete 176-row gate matrix is in `data/fluid-round303-real-exam-no-merge-evidence.json` under `sourceSectionRows`.

| key | risk | source kind | atoms | question id span | UI/release cue |
|---|---|---|---:|---|---|
| 2000-02 | watch | calculation-subparts | 2 | ocean-2000-02-01 -> ocean-2000-02-02 | show grouped source count |
| 2000-03 | watch | calculation-subparts | 2 | ocean-2000-03-01 -> ocean-2000-03-02 | show grouped source count |
| 2000-06 | watch | calculation-subparts | 3 | ocean-2000-06-01 -> ocean-2000-06-03 | show grouped source count |
| 2000-07 | high | calculation-subparts | 4 | ocean-2000-07-01 -> ocean-2000-07-04 | pin as four/five grouped source section |
| 2000-08 | watch | calculation-subparts | 2 | ocean-2000-08-01 -> ocean-2000-08-02 | show grouped source count |
| 2001-06 | high | calculation-subparts | 4 | ocean-2001-06-01 -> ocean-2001-06-04 | pin as four/five grouped source section |
| 2002-08 | watch | calculation-subparts | 2 | ocean-2002-08-01 -> ocean-2002-08-02 | show grouped source count |
| 2003-07 | watch | short-answer-family | 3 | ocean-2003-07-01 -> ocean-2003-07-03 | show grouped source count |
| 2004-01 | high | calculation-subparts | 10 | ocean-2004-01-01 -> ocean-2004-01-10 | pin as four/five grouped source section |
| 2004-02 | high | short-answer-family | 4 | ocean-2004-02-01 -> ocean-2004-02-04 | pin as four/five grouped source section |
| 2005-01 | watch | calculation-subparts | 2 | ocean-2005-01-01 -> ocean-2005-01-02 | show grouped source count |
| 2005-02 | watch | calculation-subparts | 3 | ocean-2005-02-01 -> ocean-2005-02-03 | show grouped source count |
| 2005-03 | watch | calculation-subparts | 2 | ocean-2005-03-01 -> ocean-2005-03-02 | show grouped source count |
| 2005-06 | watch | calculation-subparts | 3 | ocean-2005-06-01 -> ocean-2005-06-03 | show grouped source count |
| 2005-07 | watch | calculation-subparts | 2 | ocean-2005-07-01 -> ocean-2005-07-02 | show grouped source count |
| 2005-08 | watch | short-answer-family | 2 | ocean-2005-08-01 -> ocean-2005-08-02 | show grouped source count |
| 2006-01 | high | objective-family | 4 | ocean-2006-01-01 -> ocean-2006-01-04 | pin as four/five grouped source section |
| 2006-02 | high | calculation-subparts | 4 | ocean-2006-02-01 -> ocean-2006-02-04 | pin as four/five grouped source section |
| 2006-06 | watch | calculation-subparts | 2 | ocean-2006-06-01 -> ocean-2006-06-02 | show grouped source count |
| 2007-01 | high | short-answer-family | 4 | ocean-2007-01-01 -> ocean-2007-01-04 | pin as four/five grouped source section |
| 2007-02 | high | objective-family | 4 | ocean-2007-02-01 -> ocean-2007-02-04 | pin as four/five grouped source section |
| 2007-03 | watch | calculation-subparts | 3 | ocean-2007-03-01 -> ocean-2007-03-03 | show grouped source count |
| 2007-04 | watch | calculation-subparts | 2 | ocean-2007-04-01 -> ocean-2007-04-02 | show grouped source count |
| 2007-07 | high | calculation-subparts | 4 | ocean-2007-07-01 -> ocean-2007-07-04 | pin as four/five grouped source section |
| 2007-08 | watch | calculation-subparts | 3 | ocean-2007-08-01 -> ocean-2007-08-03 | show grouped source count |
| 2008-01 | high | short-answer-family | 4 | ocean-2008-01-01 -> ocean-2008-01-04 | pin as four/five grouped source section |
| 2008-03 | watch | calculation-subparts | 3 | ocean-2008-03-01 -> ocean-2008-03-03 | show grouped source count |
| 2009-02 | watch | short-answer-family | 1 | ocean-2009-02 -> ocean-2009-02 | show original-row wording |
| 2009-04 | watch | short-answer-family | 1 | ocean-2009-04 -> ocean-2009-04 | show original-row wording |
| 2010-01 | high | objective-family | 10 | ocean-2010-01-01 -> ocean-2010-01-10 | pin as four/five grouped source section |
| 2010-02 | high | short-answer-family | 5 | ocean-2010-02-01 -> ocean-2010-02-05 | pin as four/five grouped source section |
| 2010-05 | watch | calculation-subparts | 3 | ocean-2010-05-01 -> ocean-2010-05-03 | show grouped source count |
| 2011-01 | high | objective-family | 10 | ocean-2011-01-01 -> ocean-2011-01-10 | pin as four/five grouped source section |
| 2011-02 | high | short-answer-family | 4 | ocean-2011-02-01 -> ocean-2011-02-04 | pin as four/five grouped source section |
| 2012-01 | watch | short-answer-family | 3 | ocean-2012-01-01 -> ocean-2012-01-03 | show grouped source count |
| 2012-02 | watch | calculation-subparts | 3 | ocean-2012-02-01 -> ocean-2012-02-03 | show grouped source count |
| 2012-05 | watch | calculation-subparts | 2 | ocean-2012-05-01 -> ocean-2012-05-02 | show grouped source count |
| 2012-06 | high | calculation-subparts | 4 | ocean-2012-06-01 -> ocean-2012-06-04 | pin as four/five grouped source section |
| 2012-07 | watch | calculation-subparts | 2 | ocean-2012-07-01 -> ocean-2012-07-02 | show grouped source count |
| 2013-02 | watch | short-answer-family | 2 | ocean-2013-02-01 -> ocean-2013-02-02 | show grouped source count |
| 2013-03 | watch | calculation-subparts | 2 | ocean-2013-03-01 -> ocean-2013-03-02 | show grouped source count |
| 2013-06 | watch | short-answer-family | 1 | ocean-2013-06 -> ocean-2013-06 | show original-row wording |
| 2014-01 | watch | short-answer-family | 3 | ocean-2014-01-01 -> ocean-2014-01-03 | show grouped source count |
| 2014-02 | watch | calculation-subparts | 3 | ocean-2014-02-01 -> ocean-2014-02-03 | show grouped source count |
| 2014-03 | high | calculation-subparts | 4 | ocean-2014-03-01 -> ocean-2014-03-04 | pin as four/five grouped source section |
| 2015-01 | high | short-answer-family | 5 | ocean-2015-01-01 -> ocean-2015-01-05 | pin as four/five grouped source section |
| 2015-02 | watch | calculation-subparts | 3 | ocean-2015-02-01 -> ocean-2015-02-03 | show grouped source count |
| 2015-04 | watch | calculation-subparts | 3 | ocean-2015-04-01 -> ocean-2015-04-03 | show grouped source count |
| 2015-05 | watch | calculation-subparts | 2 | ocean-2015-05-01 -> ocean-2015-05-02 | show grouped source count |
| 2018-01 | high | short-answer-family | 5 | ocean-2018-01-01 -> ocean-2018-01-05 | pin as four/five grouped source section |

## Current Mismatch Risks

| key | risk | expected atoms | question ids | reason |
|---|---|---:|---:|---|
| none | none | 0 | 0 | none |

Proactive watch rows inherited from Round302: 35. These are not current blockers; they are rows that should stay visible because they are easiest to accidentally merge back into one parent question.

## Checks

| check | status |
|---|---|
| prior-no-merge-and-count-audits-pass | pass |
| source-section-rows-actionable | pass |
| grouped-subquestion-counts-lock | pass |
| four-and-five-grouped-sections-separated | pass |
| mismatch-risks-report-ready-for-release-gate | pass |

## Boundary

Round303 is a derived real-exam no-merge evidence artifact only. It is not a deploy, public-shell proof, browser proof, answer-PDF provenance proof, or shared version update.
