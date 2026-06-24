# Round537 181103 Proof Depth Upgrade

Version: `round537-181103-proof-depth-upgrade-20260625`
Generated: `2026-06-24T16:47:45.518Z`
Overall: **PASS**

## Scope

- Upgraded rows: 30
- Minimum answer length: 568
- Minimum sentence count: 6
- Minimum formula/dependency count: 30
- Minimum proof signal count: 6
- Failed IDs: none
- Boundary: this is the seventh proof/process/explanation-depth batch after Round531-Round536, not a claim that every proof-like row is closed.
- QA rule: visible answer blocks that only say "use a theorem" or "same as above" are insufficient for proof questions.
- Correction rule: a proof answer must show assumptions, governing equations or identities, transformations, boundary/regularity conditions where relevant, and a conclusion check.
- Source-clue rule: display-only source cards may receive better reference answers without being counted as default practice questions.

## Upgraded IDs

- `181103-material-extracted-0001`
- `181103-material-extracted-0472`
- `181103-material-extracted-0497`
- `181103-material-extracted-0200`
- `181103-material-extracted-0463`
- `181103-material-extracted-0117`
- `181103-material-extracted-0201`
- `181103-material-extracted-0461`
- `181103-material-extracted-0469`
- `181103-material-extracted-0470`
- `181103-material-extracted-0487`
- `181103-material-extracted-0114`
- `181103-material-extracted-0043`
- `181103-material-extracted-0485`
- `181103-material-extracted-0433`
- `181103-material-extracted-0141`
- `181103-material-extracted-0195`
- `181103-material-extracted-0220`
- `181103-material-extracted-0442`
- `181103-material-extracted-0219`
- `181103-material-extracted-0150`
- `181103-material-extracted-0171`
- `181103-material-extracted-0462`
- `181103-material-extracted-0203`
- `181103-material-extracted-0439`
- `181103-material-extracted-0440`
- `181103-material-extracted-0446`
- `181103-material-extracted-0445`
- `181103-material-extracted-0471`
- `181103-material-extracted-0429`

## Records

```json
[
  {
    "id": "181103-material-extracted-0001",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 3,
    "diagnosis": "原答案只有概念结论，缺少连续介质假设的尺度证明、适用条件和为什么能把流体量写成场函数。",
    "afterScore": {
      "chars": 603,
      "sentenceCount": 10,
      "formulaCount": 30,
      "proofSignalCount": 15
    },
    "htmlUpdated": true,
    "boundaryNote": "按连续介质尺度分离补全；此题是概念证明，不涉及原答案 PDF 严格页框证明。"
  },
  {
    "id": "181103-material-extracted-0472",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 7,
    "diagnosis": "原答案只说连续方程和 Bernoulli 方程可闭合，没有写出变量、符号约定、微分方程和积分形式。",
    "afterScore": {
      "chars": 742,
      "sentenceCount": 9,
      "formulaCount": 42,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "无原图细节时采用对称双支管、理想无损出口近似；若源页图给出水平管长度，应把附加惯性项加入运动方程。"
  },
  {
    "id": "181103-material-extracted-0497",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 9,
    "diagnosis": "原答案只有镜像法提示，没有给出复势叠加、第一象限边界条件、流线式和速度代入。",
    "afterScore": {
      "chars": 883,
      "sentenceCount": 11,
      "formulaCount": 48,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "角点汇强度有象限通量和全平面强度两种约定，本答案显式记录采用象限内汇强为 m。"
  },
  {
    "id": "181103-material-extracted-0200",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 243,
    "diagnosis": "原答案只列三个结论，缺少变量选择、量纲矩阵和三种主导物理机制的推导。",
    "afterScore": {
      "chars": 766,
      "sentenceCount": 9,
      "formulaCount": 42,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "量纲分析只能判定幂律和无量纲参数，不能替代波动方程给出精确系数。"
  },
  {
    "id": "181103-material-extracted-0463",
    "type": "简答题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 6,
    "diagnosis": "原答案给数值但未证明为什么波速按平方根尺度比缩放，也未说明港池模型应取 Froude 相似。",
    "afterScore": {
      "chars": 615,
      "sentenceCount": 16,
      "formulaCount": 38,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "明确采用重力波 Froude 相似；未声称同时满足黏性摩阻相似。"
  },
  {
    "id": "181103-material-extracted-0117",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 144,
    "diagnosis": "原答案直接写 Nu=f(Re,Pr)，没有从变量量纲和 Buckingham Π 定理推出三个无量纲组。",
    "afterScore": {
      "chars": 704,
      "sentenceCount": 9,
      "formulaCount": 43,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "按题面变量推导 Nu-Re-Pr 关系；不把经验关联式当作题目给定答案。"
  },
  {
    "id": "181103-material-extracted-0201",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 246,
    "diagnosis": "原答案只写解析式，没有解释图解法中切线斜率、相速点斜率和波长导数符号的关系。",
    "afterScore": {
      "chars": 635,
      "sentenceCount": 11,
      "formulaCount": 46,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "解析推导补足图解法逻辑；图形结论以色散曲线足够光滑为前提。"
  },
  {
    "id": "181103-material-extracted-0461",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 6,
    "diagnosis": "原答案只给 F∝L，没有利用 Stokes 方程的无量纲化说明为什么不出现密度和二次速度项。",
    "afterScore": {
      "chars": 735,
      "sentenceCount": 7,
      "formulaCount": 47,
      "proofSignalCount": 6
    },
    "htmlUpdated": true,
    "boundaryNote": "这里证明的是 Stokes 方程支配下的尺度律；若 Reynolds 数不小，惯性项会重新引入 Re 依赖。"
  },
  {
    "id": "181103-material-extracted-0469",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 6,
    "diagnosis": "原答案没有给自由面常数、体积守恒和底部总压力积分，导致第三问缺失。",
    "afterScore": {
      "chars": 806,
      "sentenceCount": 8,
      "formulaCount": 53,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "不计大气压时使用表压；若需绝对压力，应整体加上大气压项。"
  },
  {
    "id": "181103-material-extracted-0470",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 7,
    "diagnosis": "原答案给自由面式但缺少从速度势到速度、再到 Bernoulli 常数的推导。",
    "afterScore": {
      "chars": 641,
      "sentenceCount": 9,
      "formulaCount": 43,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "速度势 kθ 多值，物理速度单值；中心奇点附近需用有限涡核修正。"
  },
  {
    "id": "181103-material-extracted-0487",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 9,
    "diagnosis": "原答案只说非定常 Bernoulli，没有给刚打开和打开后的压强计算框架。",
    "afterScore": {
      "chars": 733,
      "sentenceCount": 9,
      "formulaCount": 48,
      "proofSignalCount": 15
    },
    "htmlUpdated": true,
    "boundaryNote": "缺少图 5-2 的端点高度和开口压强细节时，给出可代入图形数据的非定常 Bernoulli 通式。"
  },
  {
    "id": "181103-material-extracted-0114",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 142,
    "diagnosis": "原答案给量纲但没有区分热量、热流率与传热系数定义，容易漏掉时间量纲。",
    "afterScore": {
      "chars": 568,
      "sentenceCount": 7,
      "formulaCount": 30,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "保留热量与热流率的定义边界，防止把 T^{-2} 与 T^{-3} 混淆。"
  },
  {
    "id": "181103-material-extracted-0043",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 49,
    "diagnosis": "原答案符号较跳跃，没有从源汇势函数叠加求速度和流函数，也没有解释流线常数。",
    "afterScore": {
      "chars": 758,
      "sentenceCount": 9,
      "formulaCount": 56,
      "proofSignalCount": 6
    },
    "htmlUpdated": true,
    "boundaryNote": "采用 Q>0 表示吸入强度；不同教材的源汇符号约定可能相反。"
  },
  {
    "id": "181103-material-extracted-0485",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 8,
    "diagnosis": "原答案只有公式框架，没有完成流量、最高点压强和失效高度数值。",
    "afterScore": {
      "chars": 778,
      "sentenceCount": 20,
      "formulaCount": 45,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "数值按无损虹吸和标准大气压计算；真实失效高度应扣除汽化压和沿程/局部损失。"
  },
  {
    "id": "181103-material-extracted-0433",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 3,
    "diagnosis": "原答案结论正确但过短，没有展示不可压条件、积分常数和边界条件如何决定。",
    "afterScore": {
      "chars": 603,
      "sentenceCount": 10,
      "formulaCount": 62,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "补全积分函数而非只写最终式，适合学生检查偏导方向。"
  },
  {
    "id": "181103-material-extracted-0141",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 173,
    "diagnosis": "原答案只把 Stokes 公式嵌入量纲式，缺少完整 Π 定理构造和小 Re 极限说明。",
    "afterScore": {
      "chars": 660,
      "sentenceCount": 11,
      "formulaCount": 49,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "证明量纲形式并说明 Stokes 常数来自方程解，不由量纲分析单独决定。"
  },
  {
    "id": "181103-material-extracted-0195",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 239,
    "diagnosis": "原答案一句话跳到 Maxwell 关系，缺少热力学势函数选择和混合偏导条件。",
    "afterScore": {
      "chars": 783,
      "sentenceCount": 9,
      "formulaCount": 56,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "证明依赖 h(s,p) 为良态状态函数；相变间断点处不能直接使用混合偏导交换。"
  },
  {
    "id": "181103-material-extracted-0220",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 273,
    "diagnosis": "原答案只有量级结论，没有把雷诺应力与耗散的速度尺度、长度尺度分开说明。",
    "afterScore": {
      "chars": 695,
      "sentenceCount": 10,
      "formulaCount": 35,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "这是尺度分析说明；不同湍流模型中常数和谱分布需由实验或闭合模型确定。"
  },
  {
    "id": "181103-material-extracted-0442",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 4,
    "diagnosis": "原答案直接写曲面连续方程，没有从圆柱面面积元和质量守恒推导。",
    "afterScore": {
      "chars": 810,
      "sentenceCount": 9,
      "formulaCount": 50,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "半径 R 为常数时可约去；若在不同半径圆柱面间运动，应回到完整柱坐标连续方程。"
  },
  {
    "id": "181103-material-extracted-0219",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 272,
    "diagnosis": "原答案联立两式过快，没有证明圆管剪应力线性分布和混合长式的来源。",
    "afterScore": {
      "chars": 686,
      "sentenceCount": 10,
      "formulaCount": 40,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "公式按剪应力大小写出；若保留符号，需同步规定 y 方向和速度梯度方向。"
  },
  {
    "id": "181103-material-extracted-0150",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 181,
    "diagnosis": "原答案只说内部流线闭合和阻力较小，没有展示流函数形式、边界条件和阻力公式比较。",
    "afterScore": {
      "chars": 767,
      "sentenceCount": 10,
      "formulaCount": 42,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "内部流函数常数依赖上一题完整 Stokes 解；本题保留用于确定流线形状和阻力比较的必要形式。"
  },
  {
    "id": "181103-material-extracted-0171",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 210,
    "diagnosis": "原答案给最终流函数但没有证明来流速度如何抵消点涡互诱导速度。",
    "afterScore": {
      "chars": 678,
      "sentenceCount": 8,
      "formulaCount": 38,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "符号按 +Γ 在 (h,0)、-Γ 在 (-h,0) 约定；题图若相反则同步换号。"
  },
  {
    "id": "181103-material-extracted-0462",
    "type": "简答题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 6,
    "diagnosis": "原答案给 300 knot 但没有说明为什么摩阻相似必须令 Reynolds 数相等，以及结果为何不可行。",
    "afterScore": {
      "chars": 574,
      "sentenceCount": 10,
      "formulaCount": 38,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "本题只针对摩阻 Reynolds 相似；若研究波浪阻力则会采用 Froude 相似，速度缩放完全不同。"
  },
  {
    "id": "181103-material-extracted-0203",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 248,
    "diagnosis": "原答案只有结论，没有用三维平面波相位面、坐标截距速度和法向相速区别来证明。",
    "afterScore": {
      "chars": 814,
      "sentenceCount": 10,
      "formulaCount": 37,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "区分法向相速和坐标轴截距速度，避免把几何交点运动误当作物理速度分量。"
  },
  {
    "id": "181103-material-extracted-0439",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 4,
    "diagnosis": "原答案过短，没有从球壳质量守恒推出中心对称连续方程和不可压物理意义。",
    "afterScore": {
      "chars": 745,
      "sentenceCount": 9,
      "formulaCount": 47,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "中心处若无源汇且速度有限，则不可压中心对称径向运动只能为零。"
  },
  {
    "id": "181103-material-extracted-0440",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 4,
    "diagnosis": "原答案直接给柱坐标式，没有说明“通过 OZ 轴的诸平面”意味着无周向速度和轴对称通量形式。",
    "afterScore": {
      "chars": 800,
      "sentenceCount": 6,
      "formulaCount": 54,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "若题目并不要求轴对称，只能保留 θ 导数项；本答案按“通过 OZ 轴的诸平面”常见轴对称解释。"
  },
  {
    "id": "181103-material-extracted-0446",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 4,
    "diagnosis": "原答案只写积分常数，没有用原点速度条件把速度分布显式确定。",
    "afterScore": {
      "chars": 782,
      "sentenceCount": 11,
      "formulaCount": 55,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "原点速度条件的时刻若源页另有说明，应按该时刻修正常数。"
  },
  {
    "id": "181103-material-extracted-0445",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 4,
    "diagnosis": "原答案只有结论，没有解释圆锥面度量因子为什么产生 l^{-1}∂(lρu)/∂l。",
    "afterScore": {
      "chars": 948,
      "sentenceCount": 11,
      "formulaCount": 61,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "半顶角为常数才可把 sinα 作为常数约去；变形圆锥面需重写度量因子。"
  },
  {
    "id": "181103-material-extracted-0471",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 7,
    "diagnosis": "原答案把问题说成简谐形式但没有给出一维 Euler 方程、速度分布假设和压强积分式。",
    "afterScore": {
      "chars": 790,
      "sentenceCount": 10,
      "formulaCount": 57,
      "proofSignalCount": 17
    },
    "htmlUpdated": true,
    "boundaryNote": "题面图形/端点约束不足时给出两种常见解释；最终压强常数应由实际自由端或壁端条件确定。"
  },
  {
    "id": "181103-material-extracted-0429",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 3,
    "diagnosis": "原答案列公式但没有导出坐标尺度因子与流线/轨迹定义的区别。",
    "afterScore": {
      "chars": 939,
      "sentenceCount": 10,
      "formulaCount": 41,
      "proofSignalCount": 6
    },
    "htmlUpdated": true,
    "boundaryNote": "球坐标角符号按常见 θ 为极角、φ 为方位角；若教材互换，尺度因子也要随符号互换。"
  }
]
```
