# Round306 181103 Protected-Material Study Atlas

- version: round306-181103-study-atlas-20260614
- protected materials: 38/38
- study routes: 30/30
- question-review tasks: 61/61
- chapter routes: 6
- local path leaks: 0
- raw download exposure: 0
- pass: true

This atlas is student-facing metadata only. It maps protected 181103 material ids into groups, file types, chapter routes, and review tasks without exposing raw files, local paths, or raw downloads.

## Checks

- PASS protected-materials-proved-38: protected=38, atlas=38, accounted=38
- PASS student-atlas-covers-every-material: every atlas row has group, file type, and chapter routes
- PASS study-routes-proved-30: routes=30, families={"byGroup":5,"byChapter":6,"byResourceType":6,"byStudyGoal":7,"byQuestionType":6}
- PASS review-tasks-proved-61: tasks=61
- PASS chapter-routes-present: chapters=6
- PASS question-count-boundary-unchanged: source/web/grouped=316/316/61
- PASS no-local-path-leaks: pathFindings=0, forbiddenKeys=0
- PASS no-raw-download-exposure: rawDownloadFindings=0

## Material Groups

| group | materials | file types | chapter routes | review tasks | student use |
|---|---:|---|---|---:|---|
| 181103 补充资料 | 1 | pdf | 第3章 流体运动的基本方程组 | 0 | Use as supplementary metadata until a teacher validates the exact study placement. |
| 考研真题/名词解释 | 5 | doc, pdf | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 53 | Use after attempting questions to check concepts, definitions, and worked-example traps. |
| 流体力学 I 课件 | 16 | pdf, zip | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 61 | Use as chapter-route support inside the protected study atlas. |
| 流体力学 II 湍流资料 | 9 | docx, pdf, zip | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 53 | Use for viscosity, boundary-layer, and turbulence extension review. |
| 暑期课件 | 7 | pdf, ppt, pptx | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第8章 黏性不可压缩流动 | 55 | Use as a fast chapter-first pass before real-exam review. |

## File Types

| type | materials | groups | chapter routes | review tasks | handling |
|---|---:|---|---|---:|---|
| Word 答案/讲义 | 1 | 考研真题/名词解释 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 53 | 答案/讲义摘录与人工复核 |
| Word 讲义 | 2 | 流体力学 II 湍流资料 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 53 | 答案/讲义摘录与人工复核 |
| PDF 讲义/扫描件 | 27 | 181103 补充资料；考研真题/名词解释；流体力学 I 课件；流体力学 II 湍流资料；暑期课件 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 61 | 目录级精读、页码抽样和后续 OCR |
| PPT 课件 | 1 | 暑期课件 | 第3章 流体运动的基本方程组 | 3 | 课件主线浏览和章节入口 |
| PPTX 课件 | 5 | 暑期课件 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组 | 47 | 课件主线浏览和章节入口 |
| 压缩包原件 | 2 | 流体力学 I 课件；流体力学 II 湍流资料 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 43 | 受保护解包队列，不做公开下载入口 |

## Chapter Routes

| chapter | materials | review tasks | grouped atoms | groups |
|---|---:|---:|---:|---|
| 第1章 流体的物理性质 | 12 | 29 | 99 | 考研真题/名词解释；流体力学 I 课件；流体力学 II 湍流资料；暑期课件 |
| 第2章 理想流体流动 | 11 | 26 | 104 | 考研真题/名词解释；流体力学 I 课件；流体力学 II 湍流资料；暑期课件 |
| 第3章 流体运动的基本方程组 | 11 | 6 | 19 | 181103 补充资料；考研真题/名词解释；流体力学 I 课件；流体力学 II 湍流资料；暑期课件 |
| 第5章 流体的涡旋运动 | 8 | 9 | 42 | 考研真题/名词解释；流体力学 I 课件；流体力学 II 湍流资料 |
| 第6章 理想不可压缩流体无旋运动 | 10 | 29 | 112 | 考研真题/名词解释；流体力学 I 课件；流体力学 II 湍流资料 |
| 第8章 黏性不可压缩流动 | 21 | 28 | 104 | 考研真题/名词解释；流体力学 I 课件；流体力学 II 湍流资料；暑期课件 |

## Atlas Materials

| material | title | group | type | chapters | review tasks |
|---|---|---|---|---|---:|
| fluid-181103-01 | 流体力学习题解 余志豪 | 考研真题/名词解释 | PDF 讲义/扫描件 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 53 |
| fluid-181103-02 | 中国海大 流体力学名词解释 扫描版 | 考研真题/名词解释 | PDF 讲义/扫描件 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 51 |
| fluid-181103-03 | 练习册 | 考研真题/名词解释 | PDF 讲义/扫描件 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 53 |
| fluid-181103-04 | 1 流体的物理性质 1 | 暑期课件 | PPTX 课件 | 第1章 流体的物理性质 | 25 |
| fluid-181103-05 | 1 流体的物理性质 2 | 暑期课件 | PPTX 课件 | 第1章 流体的物理性质 | 24 |
| fluid-181103-06 | 2 理想流体流动 | 暑期课件 | PPTX 课件 | 第2章 理想流体流动 | 25 |
| fluid-181103-07 | 2 理想流体流动 | 暑期课件 | PPTX 课件 | 第2章 理想流体流动 | 24 |
| fluid-181103-08 | 3 流体运动的基本方程组 | 暑期课件 | PPTX 课件 | 第3章 流体运动的基本方程组 | 10 |
| fluid-181103-09 | 流体力学习题册答案2010修改版 | 考研真题/名词解释 | Word 答案/讲义 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 53 |
| fluid-181103-10 | 流体力学习题册答案2010修改版 | 考研真题/名词解释 | PDF 讲义/扫描件 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 53 |
| fluid-181103-11 | 流体力学I课件 | 流体力学 I 课件 | 压缩包原件 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 43 |
| fluid-181103-12 | 1.1流体物理性质 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第1章 流体的物理性质 | 23 |
| fluid-181103-13 | 1.2欧拉和拉氏描述 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第2章 理想流体流动 | 11 |
| fluid-181103-14 | 1.3速度分解定理 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第1章 流体的物理性质 | 18 |
| fluid-181103-15 | 1.4 1.5作用在流体上的力 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第1章 流体的物理性质 | 9 |
| fluid-181103-16 | 2理想流体运动 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第2章 理想流体流动 | 11 |
| fluid-181103-17 | 3基本方程组 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第3章 流体运动的基本方程组 | 4 |
| fluid-181103-18 | 6.1 6.4平面无旋流动 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第6章 理想不可压缩流体无旋运动 | 29 |
| fluid-181103-19 | 6.5圆柱绕流 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第6章 理想不可压缩流体无旋运动 | 24 |
| fluid-181103-20 | 6.7绕流物体受力 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第6章 理想不可压缩流体无旋运动 | 24 |
| fluid-181103-21 | 8 1 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 10 |
| fluid-181103-22 | 8 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 4 |
| fluid-181103-23 | 层流边界层理论 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 12 |
| fluid-181103-24 | 流体的涡旋运动 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第5章 流体的涡旋运动 | 5 |
| fluid-181103-25 | turbulent | 流体力学 I 课件 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 10 |
| fluid-181103-26 | 流体力学II课件 | 流体力学 II 湍流资料 | 压缩包原件 | 第8章 黏性不可压缩流动 | 1 |
| fluid-181103-27 | 0数学预备 场论 | 暑期课件 | PPT 课件 | 第3章 流体运动的基本方程组 | 3 |
| fluid-181103-28 | 期末总复习16 | 流体力学 II 湍流资料 | Word 讲义 | 第1章 流体的物理性质；第2章 理想流体流动；第3章 流体运动的基本方程组；第5章 流体的涡旋运动；第6章 理想不可压缩流体无旋运动；第8章 黏性不可压缩流动 | 53 |
| fluid-181103-29 | 湍流讲义3 | 流体力学 II 湍流资料 | Word 讲义 | 第8章 黏性不可压缩流动 | 10 |
| fluid-181103-30 | 走近湍流 | 流体力学 II 湍流资料 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 10 |
| fluid-181103-31 | turbulence14 2.ppt | 暑期课件 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 8 |
| fluid-181103-32 | turbulence16 2 | 流体力学 II 湍流资料 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 8 |
| fluid-181103-33 | turbulent14 1 1 | 流体力学 I 课件 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 8 |
| fluid-181103-34 | turbulent14 1 2 | 流体力学 II 湍流资料 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 8 |
| fluid-181103-35 | turbulent14 1 3 | 流体力学 II 湍流资料 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 5 |
| fluid-181103-36 | turbulent15 4 | 流体力学 II 湍流资料 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 5 |
| fluid-181103-37 | turbulent16 3 | 流体力学 II 湍流资料 | PDF 讲义/扫描件 | 第8章 黏性不可压缩流动 | 5 |
| fluid-181103-38 | 未命名 3 | 181103 补充资料 | PDF 讲义/扫描件 | 第3章 流体运动的基本方程组 | 0 |

## Boundary

- no local source folder read
- no raw protected files copied
- no local relative or absolute paths emitted
- no raw download URLs emitted
- no answer-evidence claim added
