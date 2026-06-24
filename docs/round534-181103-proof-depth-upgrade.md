# Round534 181103 Proof Depth Upgrade

Version: `round534-181103-proof-depth-upgrade-20260624`
Generated: `2026-06-24T07:59:26.887Z`
Overall: **PASS**

## Scope

- Upgraded rows: 30
- Minimum answer length: 401
- Minimum sentence count: 9
- Minimum formula/dependency count: 18
- Minimum proof signal count: 7
- Failed IDs: none
- Boundary: this is the fourth proof/process/explanation-depth batch after Round531-Round533, not a claim that every proof-like row is closed.
- QA rule: a visible answer is not enough. A proof row must include assumptions, governing equations or definitions, transformations, and a conclusion check.
- Correction rule: when a previous conclusion is wrong or ambiguous, the ledger records the diagnosis instead of silently overwriting.

## Upgraded IDs

- `181103-material-extracted-0115`
- `181103-material-extracted-0176`
- `181103-material-extracted-0065`
- `181103-material-extracted-0292`
- `181103-material-extracted-0447`
- `181103-material-extracted-0416`
- `181103-material-extracted-0011`
- `181103-material-extracted-0427`
- `181103-material-extracted-0036`
- `181103-material-extracted-0479`
- `181103-material-extracted-0454`
- `181103-material-extracted-0100`
- `181103-material-extracted-0509`
- `181103-material-extracted-0034`
- `181103-material-extracted-0296`
- `181103-material-extracted-0441`
- `181103-material-extracted-0057`
- `181103-material-extracted-0191`
- `181103-material-extracted-0480`
- `181103-material-extracted-0436`
- `181103-material-extracted-0125`
- `181103-material-extracted-0120`
- `181103-material-extracted-0177`
- `181103-material-extracted-0023`
- `181103-material-extracted-0053`
- `181103-material-extracted-0070`
- `181103-material-extracted-0366`
- `181103-material-extracted-0060`
- `181103-material-extracted-0105`
- `181103-material-extracted-0230`

## Records

```json
[
  {
    "id": "181103-material-extracted-0115",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 143,
    "diagnosis": "旧答案只逐项核对量纲，没有说明量纲分析只能证明关系式量纲上可能成立，也没有把 H 的量纲和伯努利式适用边界闭合。",
    "afterScore": {
      "chars": 589,
      "sentenceCount": 9,
      "formulaCount": 40,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "本条为按题面做出的推导型参考答案，非严格 PDF 原文答案；量纲分析只给必要一致性，不替代伯努利方程动力学证明。"
  },
  {
    "id": "181103-material-extracted-0176",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 219,
    "diagnosis": "旧答案只给四个标签，没有展开 F=0 的运动学含义，也没有说明两侧法向速度差如何改变过渡区厚度和间断强弱。",
    "afterScore": {
      "chars": 563,
      "sentenceCount": 11,
      "formulaCount": 33,
      "proofSignalCount": 23
    },
    "htmlUpdated": true,
    "boundaryNote": "本条未取得严格 PDF 原答案；第 4 项的加强/减弱方向依赖图 5.18 的法向与两侧编号。"
  },
  {
    "id": "181103-material-extracted-0065",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 78,
    "diagnosis": "旧答案直接写压力积分式，缺少从欧拉方程到压力梯度的推导，也没有说明常密度和 ab=0 的退化情况。",
    "afterScore": {
      "chars": 786,
      "sentenceCount": 9,
      "formulaCount": 72,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "推导默认常密度不可压无黏流；题干未显式给出密度条件，所以常密度是假定边界。"
  },
  {
    "id": "181103-material-extracted-0292",
    "type": "计算与分析题",
    "sourceMaterialTitle": "1 流体的物理性质 1",
    "sourcePage": 15,
    "diagnosis": "旧答案只是方法提示，没有给出拉格朗日运动方程、速度和加速度的显式表达，不能作为可直接核查的参考答案。",
    "afterScore": {
      "chars": 959,
      "sentenceCount": 11,
      "formulaCount": 62,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "题库备注说明源页为 w=0，非 OCR 误读的 omega=0；本答案按题面微分方程独立推导。"
  },
  {
    "id": "181103-material-extracted-0447",
    "type": "简答题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 4,
    "diagnosis": "旧答案结论正确但证明太短，没有明确用二维不可压连续方程，也没有说明 f(x) 的任意性来自边界条件缺失。",
    "afterScore": {
      "chars": 613,
      "sentenceCount": 10,
      "formulaCount": 62,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "本答案按二维题面推导；若扩展为三维速度场，需要额外给出 w 或边界条件。"
  },
  {
    "id": "181103-material-extracted-0416",
    "type": "简答题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 2,
    "diagnosis": "旧答案方向正确但证明过于压缩，充分性和必要性的基向量取法没有展开。",
    "afterScore": {
      "chars": 803,
      "sentenceCount": 15,
      "formulaCount": 47,
      "proofSignalCount": 17
    },
    "htmlUpdated": true,
    "boundaryNote": "本证明按有限维直角正交基下的通常张量分量展开。"
  },
  {
    "id": "181103-material-extracted-0011",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 12,
    "diagnosis": "旧答案有流线方程结论，但没有补出三维条件、竖直径向流线、原点驻点和 k=0 的退化边界。",
    "afterScore": {
      "chars": 573,
      "sentenceCount": 12,
      "formulaCount": 50,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "图形部分用文字描述；实际绘图时应在 z=常数平面画过原点的径向直线族。"
  },
  {
    "id": "181103-material-extracted-0427",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 3,
    "diagnosis": "旧答案基本正确，但可补充流线定义、绝对值积分、坐标轴退化流线和指定点代入过程。",
    "afterScore": {
      "chars": 401,
      "sentenceCount": 10,
      "formulaCount": 40,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "指定点不在坐标轴上，因此 xy=6 无退化歧义。"
  },
  {
    "id": "181103-material-extracted-0036",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 42,
    "diagnosis": "旧答案结论正确，但应展开流函数约定、速度分量、涡度计算和等势线相容条件。",
    "afterScore": {
      "chars": 841,
      "sentenceCount": 13,
      "formulaCount": 79,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "本条保留流函数符号约定边界；不同教材约定只影响符号，不影响有旋结论。"
  },
  {
    "id": "181103-material-extracted-0479",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 7,
    "diagnosis": "旧答案只给主平衡式，没有说明物质导数、压力功、热传导、黏性耗散和重力项如何从能量方程中化简。",
    "afterScore": {
      "chars": 1313,
      "sentenceCount": 15,
      "formulaCount": 109,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "本推导为内能/温度方程；若从总能量方程出发，扣除机械能方程后得到同一热平衡式。"
  },
  {
    "id": "181103-material-extracted-0454",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 5,
    "diagnosis": "旧答案有结论，但不可压、无旋和速度势积分过程过短。",
    "afterScore": {
      "chars": 982,
      "sentenceCount": 12,
      "formulaCount": 91,
      "proofSignalCount": 15
    },
    "htmlUpdated": true,
    "boundaryNote": "速度势全局存在默认所讨论区域单连通；非单连通区域至少可作局部速度势讨论。"
  },
  {
    "id": "181103-material-extracted-0100",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 119,
    "diagnosis": "旧答案思路正确，但运动边界符号约定没有写清，容易和“沿 x 轴反向运动”发生符号歧义。",
    "afterScore": {
      "chars": 519,
      "sentenceCount": 11,
      "formulaCount": 44,
      "proofSignalCount": 25
    },
    "htmlUpdated": true,
    "boundaryNote": "原题文字含“沿 x 轴反向运动”，符号依赖 U 的有符号定义；本答案按待证式 v/(u-U) 选取边界方程。"
  },
  {
    "id": "181103-material-extracted-0509",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 11,
    "diagnosis": "旧答案正确但略去控制方程来源，应从定常充分发展圆管流的轴向 Navier-Stokes 方程推到泊肃叶流量。",
    "afterScore": {
      "chars": 852,
      "sentenceCount": 13,
      "formulaCount": 69,
      "proofSignalCount": 16
    },
    "htmlUpdated": true,
    "boundaryNote": "题中 p 按正的压降梯度解释；若 p 定义为有符号的 dP/dz，公式符号需相应改写。"
  },
  {
    "id": "181103-material-extracted-0034",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 40,
    "diagnosis": "旧答案方向正确，但需要严格区分局部方向微分方程和流函数等值线的存在条件。",
    "afterScore": {
      "chars": 733,
      "sentenceCount": 12,
      "formulaCount": 55,
      "proofSignalCount": 22
    },
    "htmlUpdated": true,
    "boundaryNote": "本答案按二维流动和 u=psi_y, v=-psi_x 约定说明；相反号约定不改变等值线结论。"
  },
  {
    "id": "181103-material-extracted-0296",
    "type": "计算与分析题",
    "sourceMaterialTitle": "1 流体的物理性质 2",
    "sourcePage": 23,
    "diagnosis": "旧答案正确但略短，应从质点运动方程积分得到轨迹，而不是只写轨迹结论。",
    "afterScore": {
      "chars": 590,
      "sentenceCount": 9,
      "formulaCount": 41,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "本答案假设等角速旋转指绕圆桶轴线的刚体式旋转，求的是流体质点轨迹，不是自由液面形状。"
  },
  {
    "id": "181103-material-extracted-0441",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 4,
    "diagnosis": "旧答案没有说明 sigma 与 rho omega 的一维角向守恒含义，容易被误读成普通三维柱坐标连续方程。",
    "afterScore": {
      "chars": 828,
      "sentenceCount": 10,
      "formulaCount": 43,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "本证明按源题符号解释；若 rho 改作普通三维体密度，半径、截面积或雅可比因子需并入 sigma 和通量项。"
  },
  {
    "id": "181103-material-extracted-0057",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 72,
    "diagnosis": "旧答案的体膨胀条件正确，但剪应力 tau_xy 写错；由速度梯度应为 mu(mn+l)，代入不可压条件后为 mu l(1-n^2)。",
    "afterScore": {
      "chars": 1161,
      "sentenceCount": 9,
      "formulaCount": 107,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "本条修正旧答案中的剪应力公式；这里给的是黏性应力，非含压力的总应力。"
  },
  {
    "id": "181103-material-extracted-0191",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 233,
    "diagnosis": "旧答案只引用压力扰动指数衰减，缺少深水波速度势和线性伯努利方程推导。",
    "afterScore": {
      "chars": 1002,
      "sentenceCount": 13,
      "formulaCount": 69,
      "proofSignalCount": 16
    },
    "htmlUpdated": true,
    "boundaryNote": "本证明采用线性深水波一阶近似；二阶动压和自由面实际位置的高阶修正未计入。"
  },
  {
    "id": "181103-material-extracted-0480",
    "type": "简答题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 8,
    "diagnosis": "旧答案抓住 Stokes 第一问题方程，但未完整列出应力分量，也没有从微元受力推出运动方程。",
    "afterScore": {
      "chars": 1470,
      "sentenceCount": 16,
      "formulaCount": 128,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "题目要求画图处用坐标系和微元文字替代；前端若加图，应画 y=0 平板、x 向 U、y 向流体内部。"
  },
  {
    "id": "181103-material-extracted-0436",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 4,
    "diagnosis": "旧答案守恒式正确但过短，没有从渠段控制体质量守恒推出保守形式。",
    "afterScore": {
      "chars": 966,
      "sentenceCount": 14,
      "formulaCount": 86,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "本式假设无侧向入流、无渗漏、自由面单值且截面平均速度代表整截面速度；若 v=v(x,t)，保守形式仍成立。"
  },
  {
    "id": "181103-material-extracted-0125",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 155,
    "diagnosis": "旧答案结论较短，未完整展示 Buckingham pi 分析，也没有清楚说明高速风洞模型 Re 与 Ma 同时相似的困难。",
    "afterScore": {
      "chars": 1006,
      "sentenceCount": 18,
      "formulaCount": 68,
      "proofSignalCount": 19
    },
    "htmlUpdated": true,
    "boundaryNote": "题中 mu 按动力黏度解释，K 按体积弹性模量解释；本答案为量纲与相似准则推导。"
  },
  {
    "id": "181103-material-extracted-0120",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 149,
    "diagnosis": "旧答案方向正确，但应补足连续方程、伯努利方程、面积直径代换和理想/实际流量系数边界。",
    "afterScore": {
      "chars": 878,
      "sentenceCount": 10,
      "formulaCount": 52,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "默认 Delta p=p1-p2>0 且 D1>D2；若原图有高度差或损失项，本 JSON 题干未要求纳入。"
  },
  {
    "id": "181103-material-extracted-0177",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 219,
    "diagnosis": "旧答案只并入 5.28 第 4 项，没有完整解释两侧法向速度大小与过渡层厚度的关系。",
    "afterScore": {
      "chars": 512,
      "sentenceCount": 13,
      "formulaCount": 18,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "本 ID 与 0176 同属 5.28；页末 5.29 只露出题首，不能在本条中扩展为 5.29 完整解。"
  },
  {
    "id": "181103-material-extracted-0023",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 25,
    "diagnosis": "旧答案直接给定常、无旋、不可压结论，缺少从拉格朗日表示求欧拉速度、旋度、散度和 Jacobian 的过程。",
    "afterScore": {
      "chars": 1098,
      "sentenceCount": 17,
      "formulaCount": 88,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "结论以 k 为非零常数且速度场由该拉格朗日映射直接给出为前提。"
  },
  {
    "id": "181103-material-extracted-0053",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 66,
    "diagnosis": "旧答案说明了物理意义，但没有把箭号方向和 Cauchy 应力公式的两个分解层次系统展开。",
    "afterScore": {
      "chars": 1276,
      "sentenceCount": 13,
      "formulaCount": 75,
      "proofSignalCount": 21
    },
    "htmlUpdated": true,
    "boundaryNote": "图示箭头按常见坐标约定文字说明；最终图形方向仍应与源页图的坐标箭头一致。"
  },
  {
    "id": "181103-material-extracted-0070",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 84,
    "diagnosis": "旧答案给出必要条件但没有从静力平衡方程和可积性推出，也没有区分一般流体和不可压流体。",
    "afterScore": {
      "chars": 757,
      "sentenceCount": 13,
      "formulaCount": 50,
      "proofSignalCount": 17
    },
    "htmlUpdated": true,
    "boundaryNote": "未引入状态方程或具体边界压力；本条只讨论静力平衡存在的必要可积条件。"
  },
  {
    "id": "181103-material-extracted-0366",
    "type": "计算与分析题",
    "sourceMaterialTitle": "湍流讲义3",
    "sourcePage": 4,
    "diagnosis": "旧答案只写出湍动能衰减结论，需要解释均匀、无剪切条件下生产项和输运项为何消失。",
    "afterScore": {
      "chars": 808,
      "sentenceCount": 10,
      "formulaCount": 56,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "结论依赖均匀和无剪切平均流场；若存在平均速度梯度、壁面或非均匀输运，生产项和扩散项不能删去。"
  },
  {
    "id": "181103-material-extracted-0060",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 73,
    "diagnosis": "旧答案方向基本正确，但题面 u=sin kz 与来源解答按 u=sin z 处理之间存在因子 k 的边界风险。",
    "afterScore": {
      "chars": 578,
      "sentenceCount": 11,
      "formulaCount": 43,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "本条明确保留题面/来源因子 k 的边界；严格按 u=sin(kz) 时应力含 k。"
  },
  {
    "id": "181103-material-extracted-0105",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 127,
    "diagnosis": "旧答案正确但略去相似变量代换、常微分方程和积分常数由边界条件确定的过程。",
    "afterScore": {
      "chars": 986,
      "sentenceCount": 15,
      "formulaCount": 83,
      "proofSignalCount": 20
    },
    "htmlUpdated": true,
    "boundaryNote": "这是 Stokes 第一问题；默认半无限不可压黏性流体、无压强梯度、无滑移边界和层流非定常扩散模型。"
  },
  {
    "id": "181103-material-extracted-0230",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 281,
    "diagnosis": "旧答案结论正确但太短，需要说明坐标轴可旋到两点连线方向，并由纵向/横向相关函数分别求 Q1、Q2。",
    "afterScore": {
      "chars": 681,
      "sentenceCount": 13,
      "formulaCount": 35,
      "proofSignalCount": 15
    },
    "htmlUpdated": true,
    "boundaryNote": "推导对 r>0 直接成立；r=0 处需用相关函数光滑性取极限。"
  }
]
```
