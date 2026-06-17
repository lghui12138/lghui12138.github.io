# Round304 Real-Exam Original-Text Expansion Ledger

Version: `round304-real-exam-original-text-expansion-20260614`

Worker A output only. This ledger is built from existing source/granularity/count artifacts and does not invent question counts or read raw PDFs directly.

## Summary

- Source years / active years: 25/24
- Source sections / appendix sections: 176/2
- Source/web atomic questions: 325/325
- Grouped source sections / grouped web atoms: 68/217
- Four-question locks: 13/13
- Five-question locks: 5/5
- Current mismatches: 0
- Watch rows: 77 (critical 8, high 13, watch 56)
- Next manual source-PDF comparison targets: 77
- Grouped rows would lose 149 atoms if collapsed to parent rows.
- Acceptance: pass

## Year Coverage

| year | source status | source sections | source/web atoms | grouped sections/atoms | 4-lock/5-lock | watch rows | status |
|---:|---|---:|---:|---:|---:|---:|---|
| 2000 | available | 8 | 16/16 | 5/13 | 1/0 | 5 | locked |
| 2001 | available | 8 | 11/11 | 1/4 | 1/0 | 1 | locked |
| 2002 | available | 8 | 9/9 | 1/2 | 0/0 | 1 | locked |
| 2003 | available | 7 | 9/9 | 1/3 | 0/0 | 1 | locked |
| 2004 | available | 6 | 18/18 | 2/14 | 1/0 | 2 | locked |
| 2005 | available | 8 | 16/16 | 6/14 | 0/0 | 6 | locked |
| 2006 | available | 7 | 14/14 | 3/10 | 2/0 | 3 | locked |
| 2007 | available | 8 | 22/22 | 6/20 | 3/0 | 6 | locked |
| 2008 | available | 4 | 9/9 | 2/7 | 1/0 | 2 | locked |
| 2009 | available | 8 | 8/8 | 0/0 | 0/0 | 2 | locked |
| 2010 | available | 6 | 21/21 | 3/18 | 0/1 | 3 | locked |
| 2011 | available | 6 | 18/18 | 2/14 | 1/0 | 2 | locked |
| 2012 | available | 7 | 16/16 | 5/14 | 1/0 | 5 | locked |
| 2013 | available | 8 | 10/10 | 2/4 | 0/0 | 3 | locked |
| 2014 | available | 6 | 13/13 | 3/10 | 1/0 | 3 | locked |
| 2015 | available | 5 | 14/14 | 4/13 | 0/1 | 4 | locked |
| 2016 | available | 9 | 9/9 | 0/0 | 0/0 | 0 | locked |
| 2017 | source-missing | 0 | 0/0 | 0/0 | 0/0 | 0 | source-missing |
| 2018 | available | 6 | 14/14 | 4/12 | 0/1 | 4 | locked |
| 2019 | available | 5 | 13/13 | 5/13 | 0/1 | 5 | locked |
| 2020 | available | 6 | 17/17 | 5/16 | 1/1 | 5 | locked |
| 2021 | available | 10 | 12/12 | 2/4 | 0/0 | 7 | locked |
| 2022 | available | 10 | 10/10 | 0/0 | 0/0 | 1 | locked |
| 2023 | available | 10 | 11/11 | 1/2 | 0/0 | 1 | locked |
| 2024 | available | 10 | 15/15 | 5/10 | 0/0 | 5 | locked |

## Grouped Buckets

| atoms per source row | grouped sections | web atoms | atoms lost if collapsed | sample keys |
|---:|---:|---:|---:|---|
| 2 | 31 | 62 | 31 | 2000-02, 2000-03, 2000-08, 2002-08, 2005-01, 2005-03, 2005-07, 2005-08, 2006-06, 2007-04, 2012-05, 2012-07 |
| 3 | 16 | 48 | 32 | 2000-06, 2003-07, 2005-02, 2005-06, 2007-03, 2007-08, 2008-03, 2010-05, 2012-01, 2012-02, 2014-01, 2014-02 |
| 4 | 13 | 52 | 39 | 2000-07, 2001-06, 2004-02, 2006-01, 2006-02, 2007-01, 2007-02, 2007-07, 2008-01, 2011-02, 2012-06, 2014-03 |
| 5 | 5 | 25 | 20 | 2010-02, 2015-01, 2018-01, 2019-01, 2020-01 |
| 10 | 3 | 30 | 27 | 2004-01, 2010-01, 2011-01 |

## Four-Question Locks

| key | source kind | atoms | question id span | reason |
|---|---|---:|---|---|
| 2000-07 | calculation-subparts | 4 | ocean-2000-07-01 -> ocean-2000-07-04 | four-item-original-section-lock |
| 2001-06 | calculation-subparts | 4 | ocean-2001-06-01 -> ocean-2001-06-04 | four-item-original-section-lock |
| 2004-02 | short-answer-family | 4 | ocean-2004-02-01 -> ocean-2004-02-04 | four-item-original-section-lock |
| 2006-01 | objective-family | 4 | ocean-2006-01-01 -> ocean-2006-01-04 | four-item-original-section-lock |
| 2006-02 | calculation-subparts | 4 | ocean-2006-02-01 -> ocean-2006-02-04 | four-item-original-section-lock |
| 2007-01 | short-answer-family | 4 | ocean-2007-01-01 -> ocean-2007-01-04 | four-item-original-section-lock |
| 2007-02 | objective-family | 4 | ocean-2007-02-01 -> ocean-2007-02-04 | four-item-original-section-lock |
| 2007-07 | calculation-subparts | 4 | ocean-2007-07-01 -> ocean-2007-07-04 | four-item-original-section-lock |
| 2008-01 | short-answer-family | 4 | ocean-2008-01-01 -> ocean-2008-01-04 | four-item-original-section-lock |
| 2011-02 | short-answer-family | 4 | ocean-2011-02-01 -> ocean-2011-02-04 | four-item-original-section-lock |
| 2012-06 | calculation-subparts | 4 | ocean-2012-06-01 -> ocean-2012-06-04 | four-item-original-section-lock |
| 2014-03 | calculation-subparts | 4 | ocean-2014-03-01 -> ocean-2014-03-04 | four-item-original-section-lock |
| 2020-04 | calculation-subparts | 4 | ocean-2020-04-01 -> ocean-2020-04-04 | four-item-original-section-lock |

## Five-Question Locks

| key | source kind | atoms | question id span | reason |
|---|---|---:|---|---|
| 2010-02 | short-answer-family | 5 | ocean-2010-02-01 -> ocean-2010-02-05 | five-item-original-short-answer-lock |
| 2015-01 | short-answer-family | 5 | ocean-2015-01-01 -> ocean-2015-01-05 | five-item-original-short-answer-lock |
| 2018-01 | short-answer-family | 5 | ocean-2018-01-01 -> ocean-2018-01-05 | five-item-original-short-answer-lock |
| 2019-01 | short-answer-family | 5 | ocean-2019-01-01 -> ocean-2019-01-05 | five-item-original-short-answer-lock |
| 2020-01 | short-answer-family | 5 | ocean-2020-01-01 -> ocean-2020-01-05 | five-item-original-short-answer-lock |

## Current Mismatches

| key | expected atoms | question ids | reason |
|---|---:|---:|---|
| none | 0 | 0 | none |

## Next Manual Source-PDF Comparison Targets

First 60 rows are shown here; the complete target list is in `data/fluid-round304-real-exam-original-text-expansion.json` under `nextManualPdfComparisonTargets`.

| key | risk | source kind | atoms | question id span | target |
|---|---|---|---:|---|---|
| 2004-01 | critical | calculation-subparts | 10 | ocean-2004-01-01 -> ocean-2004-01-10 | manually compare original source PDF row against every visible atom |
| 2010-01 | critical | objective-family | 10 | ocean-2010-01-01 -> ocean-2010-01-10 | manually compare original source PDF row against every visible atom |
| 2010-02 | critical | short-answer-family | 5 | ocean-2010-02-01 -> ocean-2010-02-05 | manually compare original source PDF row against every visible atom |
| 2011-01 | critical | objective-family | 10 | ocean-2011-01-01 -> ocean-2011-01-10 | manually compare original source PDF row against every visible atom |
| 2015-01 | critical | short-answer-family | 5 | ocean-2015-01-01 -> ocean-2015-01-05 | manually compare original source PDF row against every visible atom |
| 2018-01 | critical | short-answer-family | 5 | ocean-2018-01-01 -> ocean-2018-01-05 | manually compare original source PDF row against every visible atom |
| 2019-01 | critical | short-answer-family | 5 | ocean-2019-01-01 -> ocean-2019-01-05 | manually compare original source PDF row against every visible atom |
| 2020-01 | critical | short-answer-family | 5 | ocean-2020-01-01 -> ocean-2020-01-05 | manually compare original source PDF row against every visible atom |
| 2000-07 | high | calculation-subparts | 4 | ocean-2000-07-01 -> ocean-2000-07-04 | manually compare original source PDF row against every visible atom |
| 2001-06 | high | calculation-subparts | 4 | ocean-2001-06-01 -> ocean-2001-06-04 | manually compare original source PDF row against every visible atom |
| 2004-02 | high | short-answer-family | 4 | ocean-2004-02-01 -> ocean-2004-02-04 | manually compare original source PDF row against every visible atom |
| 2006-01 | high | objective-family | 4 | ocean-2006-01-01 -> ocean-2006-01-04 | manually compare original source PDF row against every visible atom |
| 2006-02 | high | calculation-subparts | 4 | ocean-2006-02-01 -> ocean-2006-02-04 | manually compare original source PDF row against every visible atom |
| 2007-01 | high | short-answer-family | 4 | ocean-2007-01-01 -> ocean-2007-01-04 | manually compare original source PDF row against every visible atom |
| 2007-02 | high | objective-family | 4 | ocean-2007-02-01 -> ocean-2007-02-04 | manually compare original source PDF row against every visible atom |
| 2007-07 | high | calculation-subparts | 4 | ocean-2007-07-01 -> ocean-2007-07-04 | manually compare original source PDF row against every visible atom |
| 2008-01 | high | short-answer-family | 4 | ocean-2008-01-01 -> ocean-2008-01-04 | manually compare original source PDF row against every visible atom |
| 2011-02 | high | short-answer-family | 4 | ocean-2011-02-01 -> ocean-2011-02-04 | manually compare original source PDF row against every visible atom |
| 2012-06 | high | calculation-subparts | 4 | ocean-2012-06-01 -> ocean-2012-06-04 | manually compare original source PDF row against every visible atom |
| 2014-03 | high | calculation-subparts | 4 | ocean-2014-03-01 -> ocean-2014-03-04 | manually compare original source PDF row against every visible atom |
| 2020-04 | high | calculation-subparts | 4 | ocean-2020-04-01 -> ocean-2020-04-04 | manually compare original source PDF row against every visible atom |
| 2003-07 | watch | short-answer-family | 3 | ocean-2003-07-01 -> ocean-2003-07-03 | manually confirm whether original wording contains hidden list items |
| 2005-08 | watch | short-answer-family | 2 | ocean-2005-08-01 -> ocean-2005-08-02 | manually confirm whether original wording contains hidden list items |
| 2012-01 | watch | short-answer-family | 3 | ocean-2012-01-01 -> ocean-2012-01-03 | manually confirm whether original wording contains hidden list items |
| 2013-02 | watch | short-answer-family | 2 | ocean-2013-02-01 -> ocean-2013-02-02 | manually confirm whether original wording contains hidden list items |
| 2014-01 | watch | short-answer-family | 3 | ocean-2014-01-01 -> ocean-2014-01-03 | manually confirm whether original wording contains hidden list items |
| 2000-02 | watch | calculation-subparts | 2 | ocean-2000-02-01 -> ocean-2000-02-02 | sample original source PDF to keep grouped item split intact |
| 2000-03 | watch | calculation-subparts | 2 | ocean-2000-03-01 -> ocean-2000-03-02 | sample original source PDF to keep grouped item split intact |
| 2000-06 | watch | calculation-subparts | 3 | ocean-2000-06-01 -> ocean-2000-06-03 | sample original source PDF to keep grouped item split intact |
| 2000-08 | watch | calculation-subparts | 2 | ocean-2000-08-01 -> ocean-2000-08-02 | sample original source PDF to keep grouped item split intact |
| 2002-08 | watch | calculation-subparts | 2 | ocean-2002-08-01 -> ocean-2002-08-02 | sample original source PDF to keep grouped item split intact |
| 2005-01 | watch | calculation-subparts | 2 | ocean-2005-01-01 -> ocean-2005-01-02 | sample original source PDF to keep grouped item split intact |
| 2005-02 | watch | calculation-subparts | 3 | ocean-2005-02-01 -> ocean-2005-02-03 | sample original source PDF to keep grouped item split intact |
| 2005-03 | watch | calculation-subparts | 2 | ocean-2005-03-01 -> ocean-2005-03-02 | sample original source PDF to keep grouped item split intact |
| 2005-06 | watch | calculation-subparts | 3 | ocean-2005-06-01 -> ocean-2005-06-03 | sample original source PDF to keep grouped item split intact |
| 2005-07 | watch | calculation-subparts | 2 | ocean-2005-07-01 -> ocean-2005-07-02 | sample original source PDF to keep grouped item split intact |
| 2006-06 | watch | calculation-subparts | 2 | ocean-2006-06-01 -> ocean-2006-06-02 | sample original source PDF to keep grouped item split intact |
| 2007-03 | watch | calculation-subparts | 3 | ocean-2007-03-01 -> ocean-2007-03-03 | sample original source PDF to keep grouped item split intact |
| 2007-04 | watch | calculation-subparts | 2 | ocean-2007-04-01 -> ocean-2007-04-02 | sample original source PDF to keep grouped item split intact |
| 2007-08 | watch | calculation-subparts | 3 | ocean-2007-08-01 -> ocean-2007-08-03 | sample original source PDF to keep grouped item split intact |
| 2008-03 | watch | calculation-subparts | 3 | ocean-2008-03-01 -> ocean-2008-03-03 | sample original source PDF to keep grouped item split intact |
| 2010-05 | watch | calculation-subparts | 3 | ocean-2010-05-01 -> ocean-2010-05-03 | sample original source PDF to keep grouped item split intact |
| 2012-02 | watch | calculation-subparts | 3 | ocean-2012-02-01 -> ocean-2012-02-03 | sample original source PDF to keep grouped item split intact |
| 2012-05 | watch | calculation-subparts | 2 | ocean-2012-05-01 -> ocean-2012-05-02 | sample original source PDF to keep grouped item split intact |
| 2012-07 | watch | calculation-subparts | 2 | ocean-2012-07-01 -> ocean-2012-07-02 | sample original source PDF to keep grouped item split intact |
| 2013-03 | watch | calculation-subparts | 2 | ocean-2013-03-01 -> ocean-2013-03-02 | sample original source PDF to keep grouped item split intact |
| 2014-02 | watch | calculation-subparts | 3 | ocean-2014-02-01 -> ocean-2014-02-03 | sample original source PDF to keep grouped item split intact |
| 2015-02 | watch | calculation-subparts | 3 | ocean-2015-02-01 -> ocean-2015-02-03 | sample original source PDF to keep grouped item split intact |
| 2015-04 | watch | calculation-subparts | 3 | ocean-2015-04-01 -> ocean-2015-04-03 | sample original source PDF to keep grouped item split intact |
| 2015-05 | watch | calculation-subparts | 2 | ocean-2015-05-01 -> ocean-2015-05-02 | sample original source PDF to keep grouped item split intact |
| 2018-04 | watch | calculation-subparts | 2 | ocean-2018-04-01 -> ocean-2018-04-02 | sample original source PDF to keep grouped item split intact |
| 2018-05 | watch | calculation-subparts | 3 | ocean-2018-05-01 -> ocean-2018-05-03 | sample original source PDF to keep grouped item split intact |
| 2018-06 | watch | calculation-subparts | 2 | ocean-2018-06-01 -> ocean-2018-06-02 | sample original source PDF to keep grouped item split intact |
| 2019-02 | watch | calculation-subparts | 2 | ocean-2019-02-01 -> ocean-2019-02-02 | sample original source PDF to keep grouped item split intact |
| 2019-03 | watch | calculation-subparts | 2 | ocean-2019-03-01 -> ocean-2019-03-02 | sample original source PDF to keep grouped item split intact |
| 2019-04 | watch | calculation-subparts | 2 | ocean-2019-04-01 -> ocean-2019-04-02 | sample original source PDF to keep grouped item split intact |
| 2019-05 | watch | calculation-subparts | 2 | ocean-2019-05-01 -> ocean-2019-05-02 | sample original source PDF to keep grouped item split intact |
| 2020-02 | watch | calculation-subparts | 3 | ocean-2020-02-01 -> ocean-2020-02-03 | sample original source PDF to keep grouped item split intact |
| 2020-05 | watch | calculation-subparts | 2 | ocean-2020-05-01 -> ocean-2020-05-02 | sample original source PDF to keep grouped item split intact |
| 2020-06 | watch | calculation-subparts | 2 | ocean-2020-06-01 -> ocean-2020-06-02 | sample original source PDF to keep grouped item split intact |

## Checks

| check | status |
|---|---|
| upstream-count-audits-pass | pass |
| all-source-years-and-sections-covered | pass |
| source-web-atomic-counts-match | pass |
| grouped-original-sections-stay-expanded | pass |
| four-five-locks-separated-for-manual-pdf-review | pass |
| manual-source-pdf-targets-ready | pass |

## Boundary

Round304 Worker A proves the current derived source/count ledger is internally consistent and identifies manual source-PDF comparison targets. It is not itself a direct PDF OCR rerun, answer-PDF proof, public deployment, browser proof, or real-account QA.
