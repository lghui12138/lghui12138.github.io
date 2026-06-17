# Round346 Real-Exam Five-Item Locks

Version: `round346-real-exam-five-item-locks-20260615`

This is a local source/data gate for the failure mode where an original five-item short-answer section is merged into fewer visible cards. It also locks the requested 2023 multi-subquestion parent separately, without redefining it as a five-item row.

## Summary

- source/web atomic questions: 325/325
- Round339 source/web atomic questions: 325/325
- grouped sections / grouped web ids: 68/217
- requested focus parents: 5/5
- five-item parents: 5/5 parents / 25 atoms
- tracked parent atoms: 27
- count mismatches: 0
- unexpanded groups: 0
- failed checks: 0

## Failure Policy

- Any tracked parent whose source count, year-pack child count, first/last id, parent id, or item-number sequence differs from the expected source row fails this gate.
- A tracked parent may not appear as one visible parent card while its atomic child items are missing.
- The real-exam web/source atom count must not drop below the existing 325 authority count.
- Do not pass by merging or reducing questions; the five-item source rows remain independent atomic cards.

## Parent Locks

| key | parent | family | status | expected atoms | actual atoms | first id | last id | source excerpt |
|---|---|---|---|---:|---:|---|---|---|
| 2010-02 | ocean-2010-02 | five-item-short-answer | locked | 5 | 5 | ocean-2010-02-01 | ocean-2010-02-05 | 1. 气体和液体的动力粘性系数随温度如何变化,为什么? 2. 均匀来流绕流半无限长平板,平板上方层流边界层的厚度由哪些因素决定?会发生边界层分离吗? 3. 什么是雷诺应力?雷诺应力与粘性应力产生机制有什么不同? 4. 为确定深水航行的潜艇所受的阻力,设计模型实验时要满足的相似性条件有哪些?实验结果应当如何定量表达? 5. 流体微团的基本运动形式有哪些,粘性应 |
| 2015-01 | ocean-2015-01 | five-item-short-answer | locked | 5 | 5 | ocean-2015-01-01 | ocean-2015-01-05 | 1(10 分) - 流速的散度和旋度的物理意义分别是什么? 2(10 分) - 当满足什么条件时,流体自静止开始的流动始终是无旋流动?薄平板在原本静止的流体中平移,流场在哪些区域有旋,哪些区域无旋? 3(10 分) - 图 1 中三条曲线都表示圆柱表面压强系数的分布,请问哪条是理想流体理论解,哪条是观测结果?试说明导致三条曲线差异的原因。 4(10 分) - |
| 2018-01 | ocean-2018-01 | five-item-short-answer | locked | 5 | 5 | ocean-2018-01-01 | ocean-2018-01-05 | 1. 写出 Reynolds 数的表达式,说明其物理含义,并简要描述 Reynolds 实验的结论。 2. 稳定转动的圆形转盘内水面如何分布?试用流体力学原理分析其原因。 3. 波浪引起的水质点如何运动?为何近岸传播的波浪都是向岸的? 4. 粗糙管道阻力与哪些物理量有关?试说明 Nikuradse 曲线绘制的是哪些物理量之间的关系曲线,以及关系如何。 5. |
| 2019-01 | ocean-2019-01 | five-item-name-concept | locked | 5 | 5 | ocean-2019-01-01 | ocean-2019-01-05 | 要求写出定义的数学表达式和物理意义。 1. 应变率张量; 2. 边界层厚度; 3. 本构方程; 4. Reynolds 数; 5. Reynolds 应力。 |
| 2020-01 | ocean-2020-01 | five-item-concept-short-answer | locked | 5 | 5 | ocean-2020-01-01 | ocean-2020-01-05 | 1. 皮托管测速的原理。 2. 湍流的基本特征。 3. 牛顿流体。 4. 描述流体流动的两种方法,每种方法各举 1 个海洋观测的例子。 5. Rossby 数表征惯性力与地转科氏力之比,写出 Rossby 数的表达式。 |
| 2023-09 | ocean-2023-09 | multi-subquestion-parent | locked | 2 | 2 | ocean-2023-09-01 | ocean-2023-09-02 | 9. 求解粘性流体沿倾斜平板下泻的流动: - (1)流动速度分布; - (2)上板速度多大时,下板的摩擦应力为 0。 |

## Failure Rows

| key | parent | reason | expected atoms | actual atoms | actual id span |
|---|---|---|---:|---:|---|
| none | none | none | none | none | none |

## Checks

| check | status |
|---|---|
| web-atomic-question-count-not-below-325 | PASS |
| round324-round339-cardinality-still-325-325-and-68-217 | PASS |
| requested-focus-parents-have-locked-atomic-counts-and-id-spans | PASS |
| five-item-parent-locks-remain-five-independent-items | PASS |
| no-target-parent-left-as-unexpanded-group-card | PASS |
| count-mismatch-table-is-empty | PASS |
| round346-scope-is-local-data-doc-only | PASS |

## Boundary

- Read-only sources: `data/fluid-round307-real-exam-source-row-year-count-lock.json`, `data/fluid-round324-real-exam-expanded-count-guard.json`, `data/fluid-round325-real-exam-answer-no-merge.json`, `data/fluid-round339-real-exam-source-answer-boundary.json`, `tools/check-round324-real-exam-expanded-count-guard.mjs`, and `question-banks/real-exam-years/*.json`.
- Wrote only `data/fluid-round346-real-exam-five-item-locks.json`, `data/fluid-round346-real-exam-five-item-locks.json.gz`, and `docs/round346-real-exam-five-item-locks.md`.
- No page, route, question text, answer text, deployment, browser proof, production claim, private-video claim, Python, VPN, or proxy action is included.
