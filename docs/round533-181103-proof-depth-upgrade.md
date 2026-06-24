# Round533 181103 Proof Depth Upgrade

Version: `round533-181103-proof-depth-upgrade-20260624`
Generated: `2026-06-24T06:14:11.242Z`
Overall: **PASS**

## Scope

- Upgraded rows: 30
- Minimum answer length: 468
- Minimum sentence count: 8
- Minimum formula/dependency count: 15
- Minimum proof signal count: 7
- Failed IDs: none
- Boundary: this is the third high-priority proof-depth batch, not a claim that every proof-like row is fully closed.
- Student-facing answers keep the proof chain; formula/source ambiguity notes stay in this QA ledger.
- Correctness rule: ambiguous or physically inconsistent prompts are not forced into false proofs.

## Upgraded IDs

- `181103-material-extracted-0025`
- `181103-material-extracted-0033`
- `181103-material-extracted-0050`
- `181103-material-extracted-0054`
- `181103-material-extracted-0062`
- `181103-material-extracted-0116`
- `181103-material-extracted-0135`
- `181103-material-extracted-0137`
- `181103-material-extracted-0159`
- `181103-material-extracted-0164`
- `181103-material-extracted-0202`
- `181103-material-extracted-0205`
- `181103-material-extracted-0206`
- `181103-material-extracted-0214`
- `181103-material-extracted-0216`
- `181103-material-extracted-0217`
- `181103-material-extracted-0259`
- `181103-material-extracted-0432`
- `181103-material-extracted-0434`
- `181103-material-extracted-0449`
- `181103-material-extracted-0450`
- `181103-material-extracted-0467`
- `181103-material-extracted-0468`
- `181103-material-extracted-0474`
- `181103-material-extracted-0478`
- `181103-material-extracted-0495`
- `181103-material-extracted-0496`
- `181103-material-extracted-0504`
- `181103-material-extracted-0507`
- `181103-material-extracted-0510`

## Records

```json
[
  {
    "id": "181103-material-extracted-0025",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 26,
    "afterScore": {
      "chars": 574,
      "sentenceCount": 9,
      "formulaCount": 47,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "本条为按题面和涡度定义推导的参考答案，非严格 PDF 原文答案。"
  },
  {
    "id": "181103-material-extracted-0033",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 39,
    "afterScore": {
      "chars": 718,
      "sentenceCount": 10,
      "formulaCount": 58,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "推导在 r>0 的区域成立；源点处速度奇异，theta 为多值角函数。若教材采用相反流函数约定，psi 的符号相应改变。"
  },
  {
    "id": "181103-material-extracted-0050",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 64,
    "afterScore": {
      "chars": 593,
      "sentenceCount": 10,
      "formulaCount": 25,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "本条为按积分连续方程推导的参考答案，平均速度含义在答案末尾单独说明。"
  },
  {
    "id": "181103-material-extracted-0054",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 67,
    "afterScore": {
      "chars": 473,
      "sentenceCount": 8,
      "formulaCount": 30,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "结论基于经典连续介质假设：没有体偶力、偶应力或微结构自旋效应。"
  },
  {
    "id": "181103-material-extracted-0062",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 76,
    "afterScore": {
      "chars": 1177,
      "sentenceCount": 9,
      "formulaCount": 71,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "这里的拉格朗日型是随体质点标号描述；若再假设体力有势且流体正压，还可进一步积分。"
  },
  {
    "id": "181103-material-extracted-0116",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 143,
    "afterScore": {
      "chars": 468,
      "sentenceCount": 10,
      "formulaCount": 39,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "量纲分析只能确定比例形式，常数 C 需由更具体的波动方程或实验决定。"
  },
  {
    "id": "181103-material-extracted-0135",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 166,
    "afterScore": {
      "chars": 693,
      "sentenceCount": 10,
      "formulaCount": 62,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "推导采用 mu 为常数、z=x+iy、zeta=v_x-u_y 的约定；有势体力可先并入修正压力。"
  },
  {
    "id": "181103-material-extracted-0137",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 168,
    "afterScore": {
      "chars": 747,
      "sentenceCount": 14,
      "formulaCount": 66,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "这是局部微分恒等式，不依赖边界条件；只需 H 在题域内足够光滑。"
  },
  {
    "id": "181103-material-extracted-0159",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 193,
    "afterScore": {
      "chars": 878,
      "sentenceCount": 11,
      "formulaCount": 40,
      "proofSignalCount": 18
    },
    "htmlUpdated": true,
    "boundaryNote": "本条为按 Kelvin 定理和 Stokes 定理推导的参考答案，非严格 PDF 原文答案。"
  },
  {
    "id": "181103-material-extracted-0164",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 200,
    "afterScore": {
      "chars": 784,
      "sentenceCount": 10,
      "formulaCount": 55,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "本条从欧拉方程取旋度展开消项，避免只引用涡度守恒结论。"
  },
  {
    "id": "181103-material-extracted-0202",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 247,
    "afterScore": {
      "chars": 735,
      "sentenceCount": 11,
      "formulaCount": 36,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "本条为相速与群速定义的标准小振幅波推导，非严格 PDF 原文答案。"
  },
  {
    "id": "181103-material-extracted-0205",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 251,
    "afterScore": {
      "chars": 938,
      "sentenceCount": 10,
      "formulaCount": 42,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "常数 C 一般只沿同一流线保持不变；若再满足相对无旋等更强条件，才可推广为全场同一常数。"
  },
  {
    "id": "181103-material-extracted-0206",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 252,
    "afterScore": {
      "chars": 498,
      "sentenceCount": 8,
      "formulaCount": 34,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "结论依赖无水平气压梯度力、无摩擦且 f 取常数。"
  },
  {
    "id": "181103-material-extracted-0214",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 269,
    "afterScore": {
      "chars": 658,
      "sentenceCount": 9,
      "formulaCount": 47,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "此结论依赖两平行固壁、充分发展二维平均流和无展向平均压强梯度；有二次流或展向压强梯度时不能直接套用。"
  },
  {
    "id": "181103-material-extracted-0216",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 270,
    "afterScore": {
      "chars": 811,
      "sentenceCount": 14,
      "formulaCount": 63,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "雷诺数可用半径或直径定义，差别只会被吸收到函数 Phi 的自变量标度中。"
  },
  {
    "id": "181103-material-extracted-0217",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 271,
    "afterScore": {
      "chars": 1004,
      "sentenceCount": 8,
      "formulaCount": 71,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "边界是任意控制体闭合表面，n 取外法线；推导需场量光滑、不可压、牛顿流体且 mu 为常数。"
  },
  {
    "id": "181103-material-extracted-0259",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 315,
    "afterScore": {
      "chars": 749,
      "sentenceCount": 15,
      "formulaCount": 51,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "该推导采用经典对数层近似；靠近管中心或粘性底层时不应理解为严格精确解。"
  },
  {
    "id": "181103-material-extracted-0432",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 3,
    "afterScore": {
      "chars": 495,
      "sentenceCount": 10,
      "formulaCount": 36,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "本条为按定常连续方程展开的参考证明，非严格 PDF 原文答案。"
  },
  {
    "id": "181103-material-extracted-0434",
    "type": "简答题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 3,
    "afterScore": {
      "chars": 686,
      "sentenceCount": 10,
      "formulaCount": 48,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "结论要求映射局部非奇异，即 J=1-R^2 k^2 e^{2kb} 不为 0。"
  },
  {
    "id": "181103-material-extracted-0449",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 5,
    "afterScore": {
      "chars": 758,
      "sentenceCount": 9,
      "formulaCount": 37,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "本条为局部一阶运动学证明，忽略 dt 的二阶高阶项。"
  },
  {
    "id": "181103-material-extracted-0450",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 5,
    "afterScore": {
      "chars": 596,
      "sentenceCount": 11,
      "formulaCount": 15,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "本条为按匀变形的仿射运动映射推导的参考答案，非严格 PDF 原文答案。"
  },
  {
    "id": "181103-material-extracted-0467",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 6,
    "afterScore": {
      "chars": 780,
      "sentenceCount": 13,
      "formulaCount": 48,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "按不可压、无旋、球对称爆炸模型，能严格推出的是压强扰动主项与 1/r 成正比，而不是与 r 成正比；题面疑似有漏字。"
  },
  {
    "id": "181103-material-extracted-0468",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 6,
    "afterScore": {
      "chars": 802,
      "sentenceCount": 15,
      "formulaCount": 67,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "采用通常图示假设：管截面相同、不可压、A 端与开启后的 C 端均为大气压且大气压取零；若边界不同结论会改变。"
  },
  {
    "id": "181103-material-extracted-0474",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 7,
    "afterScore": {
      "chars": 976,
      "sentenceCount": 9,
      "formulaCount": 67,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "若题面压力式交叉项确为 (beta+gamma)xy，则它与 d omega/dt=(gamma-beta)/2 不能同时满足 Euler 方程；标准推导给出 1/2(beta+gamma)xy。"
  },
  {
    "id": "181103-material-extracted-0478",
    "type": "简答题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 7,
    "afterScore": {
      "chars": 1177,
      "sentenceCount": 13,
      "formulaCount": 69,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "该式假定轴对称、无 theta 与 z 方向速度，且剪应力项不参与径向平衡；应力符号按题面分量约定。"
  },
  {
    "id": "181103-material-extracted-0495",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 9,
    "afterScore": {
      "chars": 806,
      "sentenceCount": 13,
      "formulaCount": 52,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "题面未说明偶极方向；这里取原偶极在实轴 z=F 且偶极轴沿实轴，强度模比值仍为 a^2/F^2。"
  },
  {
    "id": "181103-material-extracted-0496",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 9,
    "afterScore": {
      "chars": 1029,
      "sentenceCount": 17,
      "formulaCount": 69,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "按当前题面，z1=1 与 z2=0.5 都在正实轴上，连接线段是流线，所以净通量为零；若原资料漏写 i，通量需重算。"
  },
  {
    "id": "181103-material-extracted-0504",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 10,
    "afterScore": {
      "chars": 1013,
      "sentenceCount": 14,
      "formulaCount": 65,
      "proofSignalCount": 17
    },
    "htmlUpdated": true,
    "boundaryNote": "四个源汇点本身为奇点，速度公式在这些点不适用；若源强定义含 2pi，m 需按同一约定换算。"
  },
  {
    "id": "181103-material-extracted-0507",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 10,
    "afterScore": {
      "chars": 1018,
      "sentenceCount": 15,
      "formulaCount": 61,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "以上为无穷长圆柱的单位长度结果；若取有限长度 L 且忽略端部效应，附加质量改为 rho pi a^2 L。"
  },
  {
    "id": "181103-material-extracted-0510",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 11,
    "afterScore": {
      "chars": 1182,
      "sentenceCount": 15,
      "formulaCount": 74,
      "proofSignalCount": 15
    },
    "htmlUpdated": true,
    "boundaryNote": "边界条件采用两壁无滑移；p 按压强降梯度取正，若定义为 dp/dz 则符号需相应改变。"
  }
]
```
