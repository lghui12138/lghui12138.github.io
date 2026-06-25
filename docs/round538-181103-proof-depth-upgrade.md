# Round538 181103 Proof Depth Upgrade

Version: `round538-181103-proof-depth-upgrade-20260625`
Generated: `2026-06-25T02:20:48.062Z`
Overall: **PASS**

## Scope

- Upgraded rows: 30
- Minimum answer length: 396
- Minimum sentence count: 7
- Minimum formula/dependency count: 19
- Minimum proof signal count: 5
- Failed IDs: none
- Boundary: this is the eighth proof/process/explanation-depth batch after Round531-Round537, not a claim that every proof-like row is closed.
- QA rule: visible answer blocks that only say "use a theorem" or "same as above" are insufficient for proof questions.
- Correction rule: a proof answer must show assumptions, governing equations or identities, transformations, boundary/regularity conditions where relevant, and a conclusion check.
- Source-clue rule: default practice cards are prioritized before source-clue cards; source clues remain a separate lane.

## Upgraded IDs

- `181103-material-extracted-0009`
- `181103-material-extracted-0086`
- `181103-material-extracted-0491`
- `181103-material-extracted-0024`
- `181103-material-extracted-0038`
- `181103-material-extracted-0018`
- `181103-material-extracted-0419`
- `181103-material-extracted-0158`
- `181103-material-extracted-0163`
- `181103-material-extracted-0181`
- `181103-material-extracted-0073`
- `181103-material-extracted-0286`
- `181103-material-extracted-0209`
- `181103-material-extracted-0040`
- `181103-material-extracted-0260`
- `181103-material-extracted-0072`
- `181103-material-extracted-0015`
- `181103-material-extracted-0087`
- `181103-material-extracted-0055`
- `181103-material-extracted-0519`
- `181103-material-extracted-0168`
- `181103-material-extracted-0096`
- `181103-material-extracted-0235`
- `181103-material-extracted-0494`
- `181103-material-extracted-0161`
- `181103-material-extracted-0006`
- `181103-material-extracted-0247`
- `181103-material-extracted-0051`
- `181103-material-extracted-0420`
- `181103-material-extracted-0511`

## Records

```json
[
  {
    "id": "181103-material-extracted-0009",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 10,
    "diagnosis": "当前答案只写了消参后的结论，没有把本小问承接的拉格朗日表示写出来，也没有说明如何由参数曲线消去时间、图形在哪个平面、双曲线分支和退化情形。",
    "afterScore": {
      "chars": 446,
      "sentenceCount": 11,
      "formulaCount": 35,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "推导依据站内 HTML 同题 1.8 的上文条件；若该卡片脱离上文单独展示，应在答案中补明拉格朗日表示。"
  },
  {
    "id": "181103-material-extracted-0086",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 101,
    "diagnosis": "当前答案给出托里拆利公式，但没有明确伯努利两点、压强、高程、速度近似条件，也没有说明 H 为什么在速度结果中抵消。",
    "afterScore": {
      "chars": 445,
      "sentenceCount": 8,
      "formulaCount": 28,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "按理想、无损、准定常、大水箱近似处理；实际孔口若考虑收缩和损失，应乘速度系数或流量系数。"
  },
  {
    "id": "181103-material-extracted-0491",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 9,
    "diagnosis": "当前答案只写“对应流函数”而未说明复势定义、复对数的实部虚部、分支多值性和常数差异。",
    "afterScore": {
      "chars": 407,
      "sentenceCount": 7,
      "formulaCount": 28,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "复对数需选定分支；绕原点一周流函数会相差 m。若教材采用 W=phi-i psi 等相反号约定，虚部符号可相应改变。"
  },
  {
    "id": "181103-material-extracted-0024",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 25,
    "diagnosis": "当前答案只写结论，没有展示从拉格朗日表示求速度、改写欧拉速度场、再计算旋度和散度的过程。",
    "afterScore": {
      "chars": 855,
      "sentenceCount": 9,
      "formulaCount": 67,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "推导默认在 k 不为 0 且 t 不为 -k 的定义域内进行；旋度和散度按固定 t 的欧拉空间偏导计算。"
  },
  {
    "id": "181103-material-extracted-0038",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 44,
    "diagnosis": "当前答案概括了复势和解析函数，但没有把不可压和无旋分别转化为连续方程、旋度方程，再推出 Cauchy-Riemann 条件。",
    "afterScore": {
      "chars": 756,
      "sentenceCount": 10,
      "formulaCount": 64,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "严格地说，速度势或单值流函数的全局存在还受区域连通性、环量和奇点影响；不同复势符号约定会改变复速度符号。"
  },
  {
    "id": "181103-material-extracted-0018",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 21,
    "diagnosis": "原答案判断方向正确，但没有用坐标变换说明实验室系非定常、圆柱随体系可定常。",
    "afterScore": {
      "chars": 563,
      "sentenceCount": 10,
      "formulaCount": 19,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "若题意包含刚由静止开始启动的瞬变阶段，则启动阶段仍应列为非定常。"
  },
  {
    "id": "181103-material-extracted-0419",
    "type": "简答题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 2,
    "diagnosis": "原答案只给对流加速度名称，缺少质点加速度与定常条件的公式链条。",
    "afterScore": {
      "chars": 838,
      "sentenceCount": 10,
      "formulaCount": 57,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "本题边界是“定常不等于无加速度”；只有速度沿质点运动方向无空间变化且流线不弯曲时，加速度才可能为零。"
  },
  {
    "id": "181103-material-extracted-0158",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 192,
    "diagnosis": "原答案方向正确，但需要把 Kelvin 定理、初始涡量、局部无旋和全局环流的差别展开。",
    "afterScore": {
      "chars": 704,
      "sentenceCount": 12,
      "formulaCount": 33,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "结论严格依赖理想不可压、有势力假设；真实粘性流体中的旋转圆柱会因无滑移边界和边界层产生涡量。"
  },
  {
    "id": "181103-material-extracted-0163",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 199,
    "diagnosis": "原答案引用点涡扩散速度式，但没有展示粘性如何通过涡量扩散改变有限半径内环流。",
    "afterScore": {
      "chars": 893,
      "sentenceCount": 11,
      "formulaCount": 38,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "按题 3.12 的无界粘性流体、轴对称点涡扩散模型展开；有限半径圆柱壁面细节需另列边界条件。"
  },
  {
    "id": "181103-material-extracted-0181",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 223,
    "diagnosis": "原答案点表正确，但需要把 t=0、t=2 的相位代入、周期和位移关系写清楚，说明如何据点表画波形。",
    "afterScore": {
      "chars": 668,
      "sentenceCount": 10,
      "formulaCount": 52,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "题库字段仍有低 OCR/章节待定标记；本次只补足波形推导，不新增来源页严格框选证明。"
  },
  {
    "id": "181103-material-extracted-0073",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 87,
    "diagnosis": "现有结论正确，但证明深度不足；应补明静力平衡方向、重力随半径线性变化以及地表压力边界。",
    "afterScore": {
      "chars": 494,
      "sentenceCount": 8,
      "formulaCount": 39,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "只适用于密度常数、球对称静止流体且 g(r) 与 r 成正比的模型；真实地球分层、自引力非线性和材料强度不在本题范围内。"
  },
  {
    "id": "181103-material-extracted-0286",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 357,
    "diagnosis": "源页六个小项可由页图闭合；题库原答案只列部分结果，需补出旧式记法含义和每项推导。",
    "afterScore": {
      "chars": 1114,
      "sentenceCount": 11,
      "formulaCount": 81,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "所有结论均在 r 不等于 0 的经典意义下成立；nabla^2(1/r) 若按分布理论讨论，原点会产生奇异项。"
  },
  {
    "id": "181103-material-extracted-0209",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 256,
    "diagnosis": "现有答案方向正确，但需要区分源书的单位深度质量流量与按压力势写成的体积流量；符号取决于积分方向和等压线标号。",
    "afterScore": {
      "chars": 721,
      "sentenceCount": 10,
      "formulaCount": 50,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "源页公式实际含 rho V_g，因此对应质量输运；题库若用 P 表示单位质量压力势，则可写成 (P1-P2)/f。"
  },
  {
    "id": "181103-material-extracted-0040",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 46,
    "diagnosis": "现有数值正确；关键是源书采用 V*=u-iv=-dF/dz 的复流速约定，若误用另一套约定会造成速度分量符号差异。",
    "afterScore": {
      "chars": 678,
      "sentenceCount": 16,
      "formulaCount": 52,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "本答案按源书 u-iv=-dF/dz 约定给出；若按常见 dF/dz=u-iv 约定，分量方向会不同，不能混用。"
  },
  {
    "id": "181103-material-extracted-0260",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 320,
    "diagnosis": "现有答案数值正确，但应补出光滑壁面对数律、两点相减消去 nu 的步骤以及单位换算。",
    "afterScore": {
      "chars": 888,
      "sentenceCount": 37,
      "formulaCount": 41,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "本条只回答题目第 (1) 问；结果依赖光滑壁面对数律和两测点处于同一对数律区的假设。"
  },
  {
    "id": "181103-material-extracted-0072",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 85,
    "diagnosis": "当前答案结论正确，但需要把等温关系、体积比、底部与水面绝对压强关系逐步展开。",
    "afterScore": {
      "chars": 625,
      "sentenceCount": 14,
      "formulaCount": 38,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "按题意忽略表面张力、气泡上升过程的动力效应和水温变化；压强必须用绝对压强，不能只用表压。"
  },
  {
    "id": "181103-material-extracted-0015",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 18,
    "diagnosis": "当前答案结论正确，但可以补出流线微分方程、积分过程和图形方向说明。",
    "afterScore": {
      "chars": 396,
      "sentenceCount": 9,
      "formulaCount": 32,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "本题只需给出流线族和图形特征；若作图，可画若干同心圆并按 a 的符号标出切向箭头。"
  },
  {
    "id": "181103-material-extracted-0087",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 101,
    "diagnosis": "当前答案结论正确，但证明应显式连接上一小问孔口流速、水平抛体时间和射程公式。",
    "afterScore": {
      "chars": 404,
      "sentenceCount": 9,
      "formulaCount": 25,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "按理想孔口出流处理，忽略收缩系数、能量损失、空气阻力和水面下降；H 是水面离地高度，不是孔口离地高度。"
  },
  {
    "id": "181103-material-extracted-0055",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 70,
    "diagnosis": "当前答案只给结论，需要把黏性合力来自 nu nabla^2 V，以及顶、底面面力方向由外法向决定这两点写清。",
    "afterScore": {
      "chars": 1240,
      "sentenceCount": 20,
      "formulaCount": 74,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "这里把“顶面和底面上的黏性应力”按作用在微团表面的黏性面力密度解释；若只列应力张量分量，底面还需另乘外法向符号。"
  },
  {
    "id": "181103-material-extracted-0519",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 12,
    "diagnosis": "当前答案结论正确，但缺少从圆柱 Couette 流通解、边界条件、剪应力和力矩积分到结果的完整推导。",
    "afterScore": {
      "chars": 1098,
      "sentenceCount": 16,
      "formulaCount": 66,
      "proofSignalCount": 18
    },
    "htmlUpdated": true,
    "boundaryNote": "题库当前答案给的是单位长度力矩；若题目或图中另给圆柱长度，应乘以长度 L。推导默认定常层流、无端部效应、无限远流体静止。"
  },
  {
    "id": "181103-material-extracted-0168",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 206,
    "diagnosis": "现有答案结论正确，但需要明确点涡只受点源速度场平移、自身诱导速度不计入，并写出运动方程到极坐标轨迹的推导。",
    "afterScore": {
      "chars": 651,
      "sentenceCount": 10,
      "formulaCount": 40,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "常数 2pi 依赖源强定义；若资料把点源速度定义为 m/r，则时间系数相应改变，但径向直线射线结论不变。"
  },
  {
    "id": "181103-material-extracted-0096",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 109,
    "diagnosis": "现有答案给出附加质量结果，但缺少速度势、能量积分和为什么取扰动速度的说明。",
    "afterScore": {
      "chars": 793,
      "sentenceCount": 11,
      "formulaCount": 41,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "题干未显式给半径，推导中以 a 表示圆柱半径；这是参考答案数学展开，不等同于严格 PDF bbox/page-span 证明。"
  },
  {
    "id": "181103-material-extracted-0235",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 287,
    "diagnosis": "现有答案公式正确，但需要补出从三维高斯核积分到一维面源解的过程，并说明质量守恒与单位。",
    "afterScore": {
      "chars": 919,
      "sentenceCount": 8,
      "formulaCount": 49,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "按无界空间中无限平面瞬时面源处理；若题目限定半空间或有不可透壁边界，需另加镜像条件。"
  },
  {
    "id": "181103-material-extracted-0494",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 9,
    "diagnosis": "现有答案方向正确，但题面很短，容易把“求偶的像”讲成记忆规则；应补出直线壁面和不可穿透边界条件来源。",
    "afterScore": {
      "chars": 594,
      "sentenceCount": 10,
      "formulaCount": 32,
      "proofSignalCount": 20
    },
    "htmlUpdated": true,
    "boundaryNote": "按势流像法中的不可穿透直线边界理解；若题目只问纯几何镜像，位置仍取镜像点，方向等价于向量关于该直线反射。"
  },
  {
    "id": "181103-material-extracted-0161",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 195,
    "diagnosis": "现有答案数值合理，但推导缺少上题环流公式、温差换算、压强层积分和回路长度估算。",
    "afterScore": {
      "chars": 1029,
      "sentenceCount": 22,
      "formulaCount": 38,
      "proofSignalCount": 5
    },
    "htmlUpdated": true,
    "boundaryNote": "本题依赖“上题结果”。方向正负取决于环流路径取向，最终报告平均风速大小。"
  },
  {
    "id": "181103-material-extracted-0006",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 7,
    "diagnosis": "现有答案公式正确，但需要补出物质导数计算，以及沿质点轨迹将 x^2+y^2+z^2 写成拉格朗日常数的过程。",
    "afterScore": {
      "chars": 951,
      "sentenceCount": 9,
      "formulaCount": 79,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "基于 JSON 题面和既有参考答案做推导扩写；未做原 PDF 页图或 bbox 严格证明。"
  },
  {
    "id": "181103-material-extracted-0247",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 302,
    "diagnosis": "现有答案给出三个数值，但缺少一般 n 的积分公式和三种边界层厚度定义。",
    "afterScore": {
      "chars": 886,
      "sentenceCount": 9,
      "formulaCount": 62,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "第三个厚度按与现有答案数值一致的能量损失厚度定义展开；若教材符号定义不同，应以教材定义为准。"
  },
  {
    "id": "181103-material-extracted-0051",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 65,
    "diagnosis": "现有答案结果正确，但需要说明圆锥相似截面面积关系、不可压连续性，以及加速度局部项和对流项来源。",
    "afterScore": {
      "chars": 715,
      "sentenceCount": 9,
      "formulaCount": 55,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "采用题目隐含的一维平均速度模型；若真实截面速度分布不均匀，需要额外给定分布后才能求截面内各点加速度。"
  },
  {
    "id": "181103-material-extracted-0420",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 2,
    "diagnosis": "现有答案给出主要结果，但缺少 z 方向、固定时刻流线与质点迹线的区别，以及拉格朗日速度/加速度完整表达。",
    "afterScore": {
      "chars": 909,
      "sentenceCount": 12,
      "formulaCount": 74,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "补充了三维坐标中的 z 常数和 t=0 退化说明；该输出是推导增强，不是对原 PDF 的逐字校勘。"
  },
  {
    "id": "181103-material-extracted-0511",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 11,
    "diagnosis": "现有答案结论正确，但需要补出库埃特流控制方程、边界条件和上下板摩擦应力方向约定。",
    "afterScore": {
      "chars": 516,
      "sentenceCount": 9,
      "formulaCount": 44,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "答案采用纯库埃特流假设，即没有给定额外压强梯度；若题目另加压强梯度，应叠加平板泊肃叶流项。"
  }
]
```
