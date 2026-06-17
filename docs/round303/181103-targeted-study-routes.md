# Round303 181103 Targeted Study Routes

- version: round303-181103-targeted-study-routes-20260614
- materials: 38/38
- chapter queues: 6
- question-type queues: 6
- use-goal queues: 11
- protected boundary pass: 38/38
- local path leaks: 0
- pass: true

Creates derived queue artifacts only. It does not edit shared version files, public shell files, answer evidence, private-video behavior, or raw protected materials.

## Checks

- PASS input-materials-38: source=38, routes=38
- PASS audit-and-round302-aligned-38: audit=38, round302=38
- PASS queue-materials-38: queue=38/38
- PASS chapter-links-complete: chapterQueue=6
- PASS question-type-links-complete: questionTypes=6
- PASS use-goal-links-complete: useGoals=11
- PASS protected-public-boundary-clean: safe=38/38, exposed=0
- PASS no-leakage-in-round303-output: findings=0

## Chapter Queues

- 第1章 流体的物理性质: 12 materials, 6 question-type labels, 11 use-goal labels
- 第2章 理想流体流动: 11 materials, 5 question-type labels, 11 use-goal labels
- 第3章 流体运动的基本方程组: 11 materials, 6 question-type labels, 11 use-goal labels
- 第5章 流体的涡旋运动: 8 materials, 6 question-type labels, 9 use-goal labels
- 第6章 理想不可压缩流体无旋运动: 10 materials, 6 question-type labels, 10 use-goal labels
- 第8章 黏性不可压缩流动: 21 materials, 5 question-type labels, 10 use-goal labels

## Question-Type Queues

- 计算与例题: 6 materials, chapters 6
- 简答综合: 16 materials, chapters 6
- 名词解释: 5 materials, chapters 6
- 图像与流动判断: 16 materials, chapters 6
- 推导证明: 6 materials, chapters 4
- 资料整理题: 4 materials, chapters 6

## Use-Goal Queues

- 抽取整理队列: 8 materials, question types 6
- 答案/讲义摘录与人工复核: 3 materials, question types 4
- 公式条件核对: 10 materials, question types 4
- 考前总复习: 6 materials, question types 5
- 课件主线浏览和章节入口: 6 materials, question types 2
- 名词解释冲刺: 5 materials, question types 4
- 目录级精读、页码抽样和后续 OCR: 27 materials, question types 6
- 受保护解包队列，不做公开下载入口: 2 materials, question types 3
- 湍流与黏性拓展: 13 materials, question types 3
- 习题答案复盘: 4 materials, question types 3
- 章节主线速读: 22 materials, question types 4

## Protected-Public Boundary

- public allowed: safe metadata, counts, chapter labels, question type labels, study goal labels, station-internal route hints
- public forbidden: raw protected files, absolute local paths, raw download URLs, private auth material, unverified answer evidence
- answer evidence: 181103 materials may guide chapter/type review, but answer evidence remains owned by the real-exam answer-evidence boundary.

## Material Queue

| queue | material | title | priority | chapters | question types | use goals | boundary |
|---|---|---|---|---|---|---|---|
| round303-181103-01 | fluid-181103-01 | 流体力学习题解 余志豪 | P1 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 名词解释；计算与例题；简答综合 | 习题答案复盘；名词解释冲刺；考前总复习 | safe metadata only |
| round303-181103-02 | fluid-181103-02 | 中国海大 流体力学名词解释 扫描版 | P1 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 名词解释；资料整理题 | 名词解释冲刺；抽取整理队列；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-03 | fluid-181103-03 | 练习册 | P1 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 名词解释；计算与例题；简答综合 | 习题答案复盘；名词解释冲刺；考前总复习 | safe metadata only |
| round303-181103-04 | fluid-181103-04 | 1 流体的物理性质 1 | P2 | 第1章 流体的物理性质 | 简答综合 | 章节主线速读；课件主线浏览和章节入口 | safe metadata only |
| round303-181103-05 | fluid-181103-05 | 1 流体的物理性质 2 | P2 | 第1章 流体的物理性质 | 简答综合 | 章节主线速读；课件主线浏览和章节入口 | safe metadata only |
| round303-181103-06 | fluid-181103-06 | 2 理想流体流动 | P2 | 第2章 理想流体流动 | 简答综合 | 章节主线速读；公式条件核对；课件主线浏览和章节入口 | safe metadata only |
| round303-181103-07 | fluid-181103-07 | 2 理想流体流动 | P2 | 第2章 理想流体流动 | 简答综合 | 章节主线速读；公式条件核对；课件主线浏览和章节入口 | safe metadata only |
| round303-181103-08 | fluid-181103-08 | 3 流体运动的基本方程组 | P2 | 第3章 流体运动的基本方程组 | 推导证明 | 章节主线速读；公式条件核对；课件主线浏览和章节入口 | safe metadata only |
| round303-181103-09 | fluid-181103-09 | 流体力学习题册答案2010修改版 | P1 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 名词解释；计算与例题 | 习题答案复盘；名词解释冲刺；考前总复习 | safe metadata only |
| round303-181103-10 | fluid-181103-10 | 流体力学习题册答案2010修改版 | P1 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 名词解释；计算与例题 | 习题答案复盘；名词解释冲刺；考前总复习 | safe metadata only |
| round303-181103-11 | fluid-181103-11 | 流体力学I课件 | P1 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 简答综合；资料整理题 | 抽取整理队列；受保护解包队列，不做公开下载入口 | safe metadata only |
| round303-181103-12 | fluid-181103-12 | 1.1流体物理性质 | P3 | 第1章 流体的物理性质 | 简答综合 | 章节主线速读；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-13 | fluid-181103-13 | 1.2欧拉和拉氏描述 | P3 | 第2章 理想流体流动 | 简答综合 | 章节主线速读；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-14 | fluid-181103-14 | 1.3速度分解定理 | P3 | 第1章 流体的物理性质 | 推导证明 | 章节主线速读；公式条件核对；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-15 | fluid-181103-15 | 1.4 1.5作用在流体上的力 | P3 | 第1章 流体的物理性质 | 简答综合 | 章节主线速读；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-16 | fluid-181103-16 | 2理想流体运动 | P3 | 第2章 理想流体流动 | 简答综合 | 章节主线速读；公式条件核对；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-17 | fluid-181103-17 | 3基本方程组 | P3 | 第3章 流体运动的基本方程组 | 推导证明 | 章节主线速读；公式条件核对；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-18 | fluid-181103-18 | 6.1 6.4平面无旋流动 | P3 | 第6章 理想不可压缩流体无旋运动 | 推导证明；图像与流动判断 | 章节主线速读；公式条件核对；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-19 | fluid-181103-19 | 6.5圆柱绕流 | P3 | 第6章 理想不可压缩流体无旋运动 | 计算与例题；图像与流动判断 | 章节主线速读；公式条件核对；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-20 | fluid-181103-20 | 6.7绕流物体受力 | P3 | 第6章 理想不可压缩流体无旋运动 | 计算与例题；图像与流动判断 | 章节主线速读；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-21 | fluid-181103-21 | 8 1 | P3 | 第8章 黏性不可压缩流动 | 简答综合 | 章节主线速读；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-22 | fluid-181103-22 | 8 | P3 | 第8章 黏性不可压缩流动 | 简答综合 | 章节主线速读；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-23 | fluid-181103-23 | 层流边界层理论 | P3 | 第8章 黏性不可压缩流动 | 图像与流动判断 | 章节主线速读；公式条件核对；湍流与黏性拓展 | safe metadata only |
| round303-181103-24 | fluid-181103-24 | 流体的涡旋运动 | P3 | 第5章 流体的涡旋运动 | 推导证明 | 章节主线速读；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-25 | fluid-181103-25 | turbulent | P3 | 第8章 黏性不可压缩流动 | 图像与流动判断 | 章节主线速读；湍流与黏性拓展；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-26 | fluid-181103-26 | 流体力学II课件 | P1 | 第8章 黏性不可压缩流动 | 图像与流动判断；简答综合；资料整理题 | 湍流与黏性拓展；抽取整理队列；受保护解包队列，不做公开下载入口 | safe metadata only |
| round303-181103-27 | fluid-181103-27 | 0数学预备 场论 | P1 | 第3章 流体运动的基本方程组 | 推导证明 | 章节主线速读；公式条件核对；抽取整理队列 | safe metadata only |
| round303-181103-28 | fluid-181103-28 | 期末总复习16 | P1 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 图像与流动判断；简答综合 | 湍流与黏性拓展；考前总复习；抽取整理队列 | safe metadata only |
| round303-181103-29 | fluid-181103-29 | 湍流讲义3 | P1 | 第8章 黏性不可压缩流动 | 图像与流动判断 | 湍流与黏性拓展；抽取整理队列；答案/讲义摘录与人工复核 | safe metadata only |
| round303-181103-30 | fluid-181103-30 | 走近湍流 | P3 | 第8章 黏性不可压缩流动 | 图像与流动判断 | 湍流与黏性拓展；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-31 | fluid-181103-31 | turbulence14 2.ppt | P3 | 第8章 黏性不可压缩流动 | 图像与流动判断 | 章节主线速读；湍流与黏性拓展；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-32 | fluid-181103-32 | turbulence16 2 | P3 | 第8章 黏性不可压缩流动 | 图像与流动判断 | 湍流与黏性拓展；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-33 | fluid-181103-33 | turbulent14 1 1 | P3 | 第8章 黏性不可压缩流动 | 图像与流动判断 | 章节主线速读；湍流与黏性拓展；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-34 | fluid-181103-34 | turbulent14 1 2 | P3 | 第8章 黏性不可压缩流动 | 图像与流动判断 | 湍流与黏性拓展；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-35 | fluid-181103-35 | turbulent14 1 3 | P3 | 第8章 黏性不可压缩流动 | 图像与流动判断 | 湍流与黏性拓展；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-36 | fluid-181103-36 | turbulent15 4 | P3 | 第8章 黏性不可压缩流动 | 图像与流动判断 | 湍流与黏性拓展；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-37 | fluid-181103-37 | turbulent16 3 | P3 | 第8章 黏性不可压缩流动 | 图像与流动判断 | 湍流与黏性拓展；目录级精读、页码抽样和后续 OCR | safe metadata only |
| round303-181103-38 | fluid-181103-38 | 未命名 3 | P1 | 第3章 流体运动的基本方程组 | 简答综合；资料整理题 | 考前总复习；抽取整理队列；目录级精读、页码抽样和后续 OCR | safe metadata only |
