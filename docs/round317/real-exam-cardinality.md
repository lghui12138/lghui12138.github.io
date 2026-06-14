# Round317 真题原文题数防合并账本

版本：`round317-real-exam-source-cardinality-20260614`

这一轮只做一件很硬的事：把原文父题的小问基数做成当前门禁。凡原文父题含连续小问，站内必须保留等量题卡；特别是 4 题、5 题和 10 题这类高风险父题，不能被合并成一条综合题。

## 摘要

- 原文父题：176
- 原文原子题 / 站内原子题：325 / 325
- 多小问父题：68
- 多小问站内题卡：217
- 4/5 小问题数锁：18
- 4 题及以上高风险父题：21
- 简答/简述/概念/名词解释 4/5 小问锁：16
- 失败项：0
- fixed 候选源题数：294
- fixed 候选源父题/多小问诊断 watch：15

## 当前站内加载路径

- 模块：`modules/real-exams-dynamic.html`
- 状态：`current-site-primary-loader-is-year-packs`
- 结论边界：站内主路径读取 `real-exams-index.json` 与 `real-exam-years/*.json`；`fixed.json` 仅作候选/legacy fallback 诊断，不作为当前站内合并判定。

## 重点锁定的简答/概念/名词解释父题

| 年份 | 父题 | 期望小问 | 站内题卡 | 题号范围 | fixed 候选诊断 | 状态 |
|---:|---|---:|---:|---|---|---|
| 2000 | 7(20 分) | 4 | 4 | ocean-2000-07-01 -> ocean-2000-07-04 | candidate-parent-merged-watch | locked |
| 2001 | 6(15 分) | 4 | 4 | ocean-2001-06-01 -> ocean-2001-06-04 | candidate-parent-merged-watch | locked |
| 2004 | 二、名词解释（20 分，每小题 5 分） | 4 | 4 | ocean-2004-02-01 -> ocean-2004-02-04 | candidate-parent-merged-watch | locked |
| 2006 | 二、(20 分) | 4 | 4 | ocean-2006-02-01 -> ocean-2006-02-04 | candidate-parent-merged-watch | locked |
| 2007 | 一、名词解释（20 分，各 5 分） | 4 | 4 | ocean-2007-01-01 -> ocean-2007-01-04 | candidate-parent-merged-watch | locked |
| 2007 | 七、（25 分） | 4 | 4 | ocean-2007-07-01 -> ocean-2007-07-04 | candidate-parent-merged-watch | locked |
| 2008 | 一、简述题 | 4 | 4 | ocean-2008-01-01 -> ocean-2008-01-04 | candidate-unresolved-watch | locked |
| 2010 | 二、简答题(每题 8 分,共 40 分) | 5 | 5 | ocean-2010-02-01 -> ocean-2010-02-05 | candidate-legacy-child-like | locked |
| 2011 | 二、简答题（每题 10 分，40 分） | 4 | 4 | ocean-2011-02-01 -> ocean-2011-02-04 | candidate-parent-merged-watch | locked |
| 2012 | 六、(30 分) | 4 | 4 | ocean-2012-06-01 -> ocean-2012-06-04 | candidate-parent-merged-watch | locked |
| 2014 | 三、(20 分) | 4 | 4 | ocean-2014-03-01 -> ocean-2014-03-04 | candidate-parent-merged-watch | locked |
| 2015 | 一、简答题(1-5) | 5 | 5 | ocean-2015-01-01 -> ocean-2015-01-05 | candidate-unresolved-watch | locked |
| 2018 | 一、简答题(每题 10 分,共 50 分) | 5 | 5 | ocean-2018-01-01 -> ocean-2018-01-05 | candidate-unresolved-watch | locked |
| 2019 | 一、名词解释(每个名词 10 分,共 50 分) | 5 | 5 | ocean-2019-01-01 -> ocean-2019-01-05 | candidate-unresolved-watch | locked |
| 2020 | 一、概念与简答题(每题 10 分,共 50 分) | 5 | 5 | ocean-2020-01-01 -> ocean-2020-01-05 | candidate-parent-merged-watch | locked |
| 2020 | 四、(20 分) | 4 | 4 | ocean-2020-04-01 -> ocean-2020-04-04 | candidate-unresolved-watch | locked |

## fixed 候选源 watch

| 年份 | 父题 | 期望小问 | fixed 诊断 | 证据 |
|---:|---|---:|---|---|
| 2000 | 7(20 分) | 4 | candidate-parent-merged-watch | parent=ocean-2000-07; multi=ocean-2000-07:2; textRows=1 |
| 2001 | 6(15 分) | 4 | candidate-parent-merged-watch | parent=ocean-2001-06; multi=ocean-2001-06:3; textRows=1 |
| 2004 | 二、名词解释（20 分，每小题 5 分） | 4 | candidate-parent-merged-watch | parent=ocean-2004-02; no-text-match |
| 2006 | 二、(20 分) | 4 | candidate-parent-merged-watch | parent=ocean-2006-02; no-text-match |
| 2007 | 一、名词解释（20 分，各 5 分） | 4 | candidate-parent-merged-watch | parent=ocean-2007-01; no-text-match |
| 2007 | 七、（25 分） | 4 | candidate-parent-merged-watch | multi=ocean-2007-07-couette-dissipation:3; textRows=1 |
| 2008 | 一、简述题 | 4 | candidate-unresolved-watch | textRows=1 |
| 2011 | 二、简答题（每题 10 分，40 分） | 4 | candidate-parent-merged-watch | parent=ocean-2011-02; no-text-match |
| 2012 | 六、(30 分) | 4 | candidate-parent-merged-watch | parent=ocean-2012-06; multi=ocean-2012-06:2; textRows=1 |
| 2014 | 三、(20 分) | 4 | candidate-parent-merged-watch | parent=ocean-2014-03; textRows=1 |
| 2015 | 一、简答题(1-5) | 5 | candidate-unresolved-watch | no-text-match |
| 2018 | 一、简答题(每题 10 分,共 50 分) | 5 | candidate-unresolved-watch | textRows=2 |
| 2019 | 一、名词解释(每个名词 10 分,共 50 分) | 5 | candidate-unresolved-watch | no-text-match |
| 2020 | 一、概念与简答题(每题 10 分,共 50 分) | 5 | candidate-parent-merged-watch | parent=ocean-2020-01; no-text-match |
| 2020 | 四、(20 分) | 4 | candidate-unresolved-watch | no-text-match |

## 全部 4 题及以上父题

| 年份 | 父题 | 小问数 | 题号范围 | 证据 | 状态 |
|---:|---|---:|---|---|---|
| 2000 | 7(20 分) | 4 | ocean-2000-07-01 -> ocean-2000-07-04 | source-alpha-items | locked |
| 2001 | 6(15 分) | 4 | ocean-2001-06-01 -> ocean-2001-06-04 | source-numbered-items | locked |
| 2004 | 一、填空题（50 分，共 10 小题，每小题 5 分） | 10 | ocean-2004-01-01 -> ocean-2004-01-10 | title-total, source-numbered-items | locked |
| 2004 | 二、名词解释（20 分，每小题 5 分） | 4 | ocean-2004-02-01 -> ocean-2004-02-04 | source-numbered-items | locked |
| 2006 | 一、选择题(每小题 5 分,共 20 分) | 4 | ocean-2006-01-01 -> ocean-2006-01-04 | score-ratio, source-numbered-items | locked |
| 2006 | 二、(20 分) | 4 | ocean-2006-02-01 -> ocean-2006-02-04 | source-numbered-items | locked |
| 2007 | 一、名词解释（20 分，各 5 分） | 4 | ocean-2007-01-01 -> ocean-2007-01-04 | source-numbered-items | locked |
| 2007 | 二、选择正确答案（20 分，各 5 分，请在答案纸上写正确答案） | 4 | ocean-2007-02-01 -> ocean-2007-02-04 | source-numbered-items | locked |
| 2007 | 七、（25 分） | 4 | ocean-2007-07-01 -> ocean-2007-07-04 | source-numbered-items | locked |
| 2008 | 一、简述题 | 4 | ocean-2008-01-01 -> ocean-2008-01-04 | source-numbered-items | locked |
| 2010 | 一、选择题(每小题 4 分,共 40 分) | 10 | ocean-2010-01-01 -> ocean-2010-01-10 | score-ratio, source-numbered-items | locked |
| 2010 | 二、简答题(每题 8 分,共 40 分) | 5 | ocean-2010-02-01 -> ocean-2010-02-05 | score-ratio, source-numbered-items | locked |
| 2011 | 一、选择题（每小题 4 分，共 40 分） | 10 | ocean-2011-01-01 -> ocean-2011-01-10 | score-ratio, source-numbered-items | locked |
| 2011 | 二、简答题（每题 10 分，40 分） | 4 | ocean-2011-02-01 -> ocean-2011-02-04 | score-ratio, source-numbered-items | locked |
| 2012 | 六、(30 分) | 4 | ocean-2012-06-01 -> ocean-2012-06-04 | source-numbered-items | locked |
| 2014 | 三、(20 分) | 4 | ocean-2014-03-01 -> ocean-2014-03-04 | source-numbered-items | locked |
| 2015 | 一、简答题(1-5) | 5 | ocean-2015-01-01 -> ocean-2015-01-05 | title-range, source-numbered-items | locked |
| 2018 | 一、简答题(每题 10 分,共 50 分) | 5 | ocean-2018-01-01 -> ocean-2018-01-05 | score-ratio, source-numbered-items | locked |
| 2019 | 一、名词解释(每个名词 10 分,共 50 分) | 5 | ocean-2019-01-01 -> ocean-2019-01-05 | source-numbered-items | locked |
| 2020 | 一、概念与简答题(每题 10 分,共 50 分) | 5 | ocean-2020-01-01 -> ocean-2020-01-05 | score-ratio, source-numbered-items | locked |
| 2020 | 四、(20 分) | 4 | ocean-2020-04-01 -> ocean-2020-04-04 | source-numbered-items | locked |

## 机器判定

通过。当前站内题库没有发现多小问父题被合并。
