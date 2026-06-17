# Round339 Real-Exam Source/Answer Boundary Gate

Version: `round339-real-exam-source-answer-boundary-20260615`

This gate tightens the real-exam integrity boundary without reducing any question count. It locks original four/five-item source rows, the five original short-answer/name/concept sections, subquestion item sequences, merged-prompt split status, and the answer/explanation evidence boundary.

## Summary

- source/web atomic questions: 325/325
- grouped sections / grouped web ids: 68/217
- four/five source locks: 18 rows / 77 atoms
- five-item short-answer/name/concept locks: 5 rows / 25 atoms
- high-risk years: 14; failed high-risk years: 0
- answer PDF provable rows: 0
- strict answer evidence on aligned rows: 0
- derived/unproven reference answer rows: 325
- failed checks: 0

## Policy

- Do not reduce question counts to pass this gate. Original four/five item source rows must remain split into their source item cards.
- 2010-02, 2015-01, 2018-01, 2019-01, and 2020-01 are original five-item short-answer/name/concept sections; each must expose item numbers 1-5.
- Question stems may be original-PDF provable, but current answers/explanations are derived-or-unproven reference answers unless strict original answer-PDF evidence exists. Current strict answer evidence must stay zero.

## High-Risk Year Table

| year | status | source locks | source atoms | four-item locks | five-item locks | five-item short/name/concept locks | original source locks |
|---:|---|---:|---:|---:|---:|---|---|
| 2000 | locked | 1 | 4 | 1 | 0 |  | 2000-07 概念题 x4 |
| 2001 | locked | 1 | 4 | 1 | 0 |  | 2001-06 概念题 x4 |
| 2004 | locked | 1 | 4 | 1 | 0 |  | 2004-02 名词解释题 x4 |
| 2006 | locked | 2 | 8 | 2 | 0 |  | 2006-01 选择题 x4; 2006-02 计算/连续小问 x4 |
| 2007 | locked | 3 | 12 | 3 | 0 |  | 2007-01 名词解释题 x4; 2007-02 客观/其他分小问 x4; 2007-07 计算/连续小问 x4 |
| 2008 | locked | 1 | 4 | 1 | 0 |  | 2008-01 简答题 x4 |
| 2010 | locked | 1 | 5 | 0 | 1 | 2010-02 | 2010-02 简答题 x5 |
| 2011 | locked | 1 | 4 | 1 | 0 |  | 2011-02 简答题 x4 |
| 2012 | locked | 1 | 4 | 1 | 0 |  | 2012-06 计算/连续小问 x4 |
| 2014 | locked | 1 | 4 | 1 | 0 |  | 2014-03 计算/连续小问 x4 |
| 2015 | locked | 1 | 5 | 0 | 1 | 2015-01 | 2015-01 简答题 x5 |
| 2018 | locked | 1 | 5 | 0 | 1 | 2018-01 | 2018-01 简答题 x5 |
| 2019 | locked | 1 | 5 | 0 | 1 | 2019-01 | 2019-01 名词解释题 x5 |
| 2020 | locked | 2 | 9 | 1 | 1 | 2020-01 | 2020-01 概念题 x5; 2020-04 计算/连续小问 x4 |

## Five-Item Short-Answer/Name/Concept Locks

| key | year | type | status | expected | actual | question-id span | original excerpt |
|---|---:|---|---|---:|---:|---|---|
| 2010-02 | 2010 | 简答题 | locked | 5 | 5 | ocean-2010-02-01 -> ocean-2010-02-05 | 1. 气体和液体的动力粘性系数随温度如何变化,为什么? 2. 均匀来流绕流半无限长平板,平板上方层流边界层的厚度由哪些因素决定?会发生边界层分离吗? 3. 什么是雷诺应力?雷诺应力与粘性应力产生机制有什么不同? 4. 为确定深水航行的潜艇所 |
| 2015-01 | 2015 | 简答题 | locked | 5 | 5 | ocean-2015-01-01 -> ocean-2015-01-05 | 1(10 分) - 流速的散度和旋度的物理意义分别是什么? 2(10 分) - 当满足什么条件时,流体自静止开始的流动始终是无旋流动?薄平板在原本静止的流体中平移,流场在哪些区域有旋,哪些区域无旋? 3(10 分) - 图 1 中三条曲线都 |
| 2018-01 | 2018 | 简答题 | locked | 5 | 5 | ocean-2018-01-01 -> ocean-2018-01-05 | 1. 写出 Reynolds 数的表达式,说明其物理含义,并简要描述 Reynolds 实验的结论。 2. 稳定转动的圆形转盘内水面如何分布?试用流体力学原理分析其原因。 3. 波浪引起的水质点如何运动?为何近岸传播的波浪都是向岸的? 4. |
| 2019-01 | 2019 | 名词解释题 | locked | 5 | 5 | ocean-2019-01-01 -> ocean-2019-01-05 | 要求写出定义的数学表达式和物理意义。 1. 应变率张量; 2. 边界层厚度; 3. 本构方程; 4. Reynolds 数; 5. Reynolds 应力。 |
| 2020-01 | 2020 | 概念题 | locked | 5 | 5 | ocean-2020-01-01 -> ocean-2020-01-05 | 1. 皮托管测速的原理。 2. 湍流的基本特征。 3. 牛顿流体。 4. 描述流体流动的两种方法,每种方法各举 1 个海洋观测的例子。 5. Rossby 数表征惯性力与地转科氏力之比,写出 Rossby 数的表达式。 |

## All Four/Five Source Locks

| key | year | type | status | expected | actual | item numbers | question-id span |
|---|---:|---|---|---:|---:|---|---|
| 2000-07 | 2000 | 概念题 | locked | 4 | 4 | 1,2,3,4 | ocean-2000-07-01 -> ocean-2000-07-04 |
| 2001-06 | 2001 | 概念题 | locked | 4 | 4 | 1,2,3,4 | ocean-2001-06-01 -> ocean-2001-06-04 |
| 2004-02 | 2004 | 名词解释题 | locked | 4 | 4 | 1,2,3,4 | ocean-2004-02-01 -> ocean-2004-02-04 |
| 2006-01 | 2006 | 选择题 | locked | 4 | 4 | 1,2,3,4 | ocean-2006-01-01 -> ocean-2006-01-04 |
| 2006-02 | 2006 | 计算/连续小问 | locked | 4 | 4 | 1,2,3,4 | ocean-2006-02-01 -> ocean-2006-02-04 |
| 2007-01 | 2007 | 名词解释题 | locked | 4 | 4 | 1,2,3,4 | ocean-2007-01-01 -> ocean-2007-01-04 |
| 2007-02 | 2007 | 客观/其他分小问 | locked | 4 | 4 | 1,2,3,4 | ocean-2007-02-01 -> ocean-2007-02-04 |
| 2007-07 | 2007 | 计算/连续小问 | locked | 4 | 4 | 1,2,3,4 | ocean-2007-07-01 -> ocean-2007-07-04 |
| 2008-01 | 2008 | 简答题 | locked | 4 | 4 | 1,2,3,4 | ocean-2008-01-01 -> ocean-2008-01-04 |
| 2010-02 | 2010 | 简答题 | locked | 5 | 5 | 1,2,3,4,5 | ocean-2010-02-01 -> ocean-2010-02-05 |
| 2011-02 | 2011 | 简答题 | locked | 4 | 4 | 1,2,3,4 | ocean-2011-02-01 -> ocean-2011-02-04 |
| 2012-06 | 2012 | 计算/连续小问 | locked | 4 | 4 | 1,2,3,4 | ocean-2012-06-01 -> ocean-2012-06-04 |
| 2014-03 | 2014 | 计算/连续小问 | locked | 4 | 4 | 1,2,3,4 | ocean-2014-03-01 -> ocean-2014-03-04 |
| 2015-01 | 2015 | 简答题 | locked | 5 | 5 | 1,2,3,4,5 | ocean-2015-01-01 -> ocean-2015-01-05 |
| 2018-01 | 2018 | 简答题 | locked | 5 | 5 | 1,2,3,4,5 | ocean-2018-01-01 -> ocean-2018-01-05 |
| 2019-01 | 2019 | 名词解释题 | locked | 5 | 5 | 1,2,3,4,5 | ocean-2019-01-01 -> ocean-2019-01-05 |
| 2020-01 | 2020 | 概念题 | locked | 5 | 5 | 1,2,3,4,5 | ocean-2020-01-01 -> ocean-2020-01-05 |
| 2020-04 | 2020 | 计算/连续小问 | locked | 4 | 4 | 1,2,3,4 | ocean-2020-04-01 -> ocean-2020-04-04 |

## Source-Lock Failure Table

| year | type | source lock | reason | expected | actual | original lock |
|---:|---|---|---|---:|---:|---|
| none | none | none | none | none | none | none |

## Answer-Boundary Failure Table

| year | type | question id | reason | answer status | strict answer evidence count |
|---:|---|---|---|---|---:|
| none | none | none | none | none | none |

## Checks

| check | status |
|---|---|
| source-web-cardinality-still-325-325 | PASS |
| grouped-source-sections-still-68-217-no-count-reduction | PASS |
| all-four-five-source-locks-have-original-source-and-item-sequence | PASS |
| five-item-short-answer-name-concept-locks-are-exact-5-of-5 | PASS |
| source-lock-failure-table-is-empty | PASS |
| answer-boundary-stays-derived-not-original-answer-proof | PASS |
| visible-ledger-sample-does-not-promote-original-answers | PASS |
| local-data-doc-only-no-page-or-release-claim | PASS |

## Boundary

- Read-only sources: `data/fluid-round307-real-exam-source-row-year-count-lock.json`, `data/fluid-round324-real-exam-expanded-count-guard.json`, `data/fluid-round325-real-exam-answer-no-merge.json`, `data/fluid-real-exam-answer-evidence-boundary.json`, `data/fluid-evidence-matrix-audit.json`, `tools/check-round324-real-exam-expanded-count-guard.mjs`, and `question-banks/real-exam-years/*.json`.
- Wrote only `data/fluid-round339-real-exam-source-answer-boundary.json`, `data/fluid-round339-real-exam-source-answer-boundary.json.gz`, and `docs/round339-real-exam-source-answer-boundary.md`.
- No page, route, question text, answer text, deployment, browser proof, release-gate, public-shell, VPN/proxy, private-video, or production recovery claim is included.
