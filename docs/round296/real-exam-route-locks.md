# Round296 Real-Exam Route Locks

Version: `round296-real-exam-route-locks-20260614`

This read-only gate locks the real-exam route count chain against the user-reported merge risk: some years have five short-answer or definition items, and other years have four or ten source items. They must stay independent question routes instead of collapsing into one parent.

## Gate Summary

- Real-exam index questions: 325/325
- Source/Web atomic questions: 325/325
- Grouped sections split: 68/68
- Grouped web question IDs: 217/217
- Route locks checked: 68/68
- Four/five-question locks: 18/18
- Five-item short-answer locks: 5/5
- Failed route locks: 0
- Visible old round264 hits on real-exam page: 0

## Five-Item Short-Answer / Definition Locks

| year | key | source section | expected items | independent question IDs | status |
|---:|---|---|---:|---|---|
| 2010 | 2010-02 | 二、简答题(每题 8 分,共 40 分) | 5 | ocean-2010-02-01<br>ocean-2010-02-02<br>ocean-2010-02-03<br>ocean-2010-02-04<br>ocean-2010-02-05 | locked |
| 2015 | 2015-01 | 一、简答题(1-5) | 5 | ocean-2015-01-01<br>ocean-2015-01-02<br>ocean-2015-01-03<br>ocean-2015-01-04<br>ocean-2015-01-05 | locked |
| 2018 | 2018-01 | 一、简答题(每题 10 分,共 50 分) | 5 | ocean-2018-01-01<br>ocean-2018-01-02<br>ocean-2018-01-03<br>ocean-2018-01-04<br>ocean-2018-01-05 | locked |
| 2019 | 2019-01 | 一、名词解释(每个名词 10 分,共 50 分) | 5 | ocean-2019-01-01<br>ocean-2019-01-02<br>ocean-2019-01-03<br>ocean-2019-01-04<br>ocean-2019-01-05 | locked |
| 2020 | 2020-01 | 一、概念与简答题(每题 10 分,共 50 分) | 5 | ocean-2020-01-01<br>ocean-2020-01-02<br>ocean-2020-01-03<br>ocean-2020-01-04<br>ocean-2020-01-05 | locked |

## Four/Five-Item And Ten-Item Risk Rows

| year | key | source section | expected | web | status |
|---:|---|---|---:|---:|---|
| 2000 | 2000-07 | 7(20 分) | 4 | 4 | locked |
| 2001 | 2001-06 | 6(15 分) | 4 | 4 | locked |
| 2004 | 2004-02 | 二、名词解释（20 分，每小题 5 分） | 4 | 4 | locked |
| 2006 | 2006-01 | 一、选择题(每小题 5 分,共 20 分) | 4 | 4 | locked |
| 2006 | 2006-02 | 二、(20 分) | 4 | 4 | locked |
| 2007 | 2007-01 | 一、名词解释（20 分，各 5 分） | 4 | 4 | locked |
| 2007 | 2007-02 | 二、选择正确答案（20 分，各 5 分，请在答案纸上写正确答案） | 4 | 4 | locked |
| 2007 | 2007-07 | 七、（25 分） | 4 | 4 | locked |
| 2008 | 2008-01 | 一、简述题 | 4 | 4 | locked |
| 2010 | 2010-02 | 二、简答题(每题 8 分,共 40 分) | 5 | 5 | locked |
| 2011 | 2011-02 | 二、简答题（每题 10 分，40 分） | 4 | 4 | locked |
| 2012 | 2012-06 | 六、(30 分) | 4 | 4 | locked |
| 2014 | 2014-03 | 三、(20 分) | 4 | 4 | locked |
| 2015 | 2015-01 | 一、简答题(1-5) | 5 | 5 | locked |
| 2018 | 2018-01 | 一、简答题(每题 10 分,共 50 分) | 5 | 5 | locked |
| 2019 | 2019-01 | 一、名词解释(每个名词 10 分,共 50 分) | 5 | 5 | locked |
| 2020 | 2020-01 | 一、概念与简答题(每题 10 分,共 50 分) | 5 | 5 | locked |
| 2020 | 2020-04 | 四、(20 分) | 4 | 4 | locked |

## Route Risk Groups

| group | keys | note |
|---|---|---|
| five-item short-answer-or-definition | 2010-02, 2015-01, 2018-01, 2019-01, 2020-01 | 2010, 2015, 2018, 2019, 2020 must each remain five independent routes. |
| four-item short-answer-or-definition | 2004-02, 2007-01, 2008-01, 2011-02 | These source sections are four separate definition/short-answer items and should not collapse. |
| ten-item objective sections | 2004-01, 2010-01, 2011-01 | Large objective sections are higher than the five-item risk and must remain ten independent routes. |
| four-item calculation subparts | 2000-07, 2001-06, 2006-02, 2007-07, 2012-06, 2014-03, 2020-04 | Calculation subparts also count as separate source items when the source carries A/B/C/D or continuous subparts. |
| all short-answer-family grouped rows | 2004-02, 2005-08, 2007-01, 2008-01, 2010-02, 2011-02, 2012-01, 2014-01, 2015-01, 2018-01, 2019-01, 2020-01 | Full short-answer-family route watch list from the Round290 expansion ledger. |

## Failed Route Locks

| year | key | source section | issues |
|---:|---|---|---|
| none | none | none | none |

## Main-Thread Integration Notes

- The page file `modules/real-exams-dynamic.html` still says Round295 in the current ledger. Worker B did not edit it by instruction; main Round296 integration should update the visible ledger and data links after this gate is wired in.
- The gate fails if the real-exam page visible text leaks old `round264`, or if any structured count drops below `316/61/201`, or if any grouped route loses independent question IDs.
- This does not prove original answer-PDF provenance; it only proves route count and source-section granularity.
