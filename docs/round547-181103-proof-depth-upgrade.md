# Round547 181103 Proof Depth Upgrade

Version: `round547-181103-proof-depth-upgrade-20260627`
Generated: `2026-06-27T06:27:38.146Z`
Overall: **PASS**

## Scope

- Upgraded rows: 10
- Minimum answer length: 1053
- Minimum sentence count: 16
- Minimum formula/dependency count: 57
- Minimum proof signal count: 12
- Failed IDs: none
- Boundary: this is the fourteenth proof/process/explanation-depth batch after Round531-Round545.
- QA rule: an answer that only names a formula, velocity field, flow rate, or final number is not enough for proof questions.
- Correction rule: proof answers must show assumptions, governing equation, transformations, boundary/sign conventions, and a conclusion check.
- Source-clue rule: strict PDF proof remains a separate ledger; these are student-facing derived reference answers.

## Upgraded IDs

- `181103-material-extracted-0071`
- `181103-material-extracted-0059`
- `181103-material-extracted-0154`
- `181103-material-extracted-0231`
- `181103-material-extracted-0145`
- `181103-material-extracted-0512`
- `181103-material-extracted-0517`
- `181103-material-extracted-0160`
- `181103-material-extracted-0173`
- `181103-material-extracted-0249`

## Records

```json
[
  {
    "id": "181103-material-extracted-0071",
    "sourcePage": 85,
    "diagnosis": "旧答案只给静水压分布画法，未证明为什么压力只随竖直深度变、为什么曲面压力要分解为水平投影力和上覆液体重量。",
    "afterScore": {
      "chars": 1058,
      "sentenceCount": 18,
      "formulaCount": 57,
      "proofSignalCount": 26
    },
    "htmlUpdated": true,
    "boundaryNote": "本题补的是静水压分布与曲面合力的参考证明；严格原卷答案 PDF 页框证据仍为 0，不把图示说明冒充原卷逐字答案。"
  },
  {
    "id": "181103-material-extracted-0059",
    "sourcePage": 73,
    "diagnosis": "旧答案只写出 τ=μ k 和方向，缺少牛顿黏性本构、应力面法向、上下板作用-反作用方向和符号检查。",
    "afterScore": {
      "chars": 1053,
      "sentenceCount": 16,
      "formulaCount": 80,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "本题只确认线性剪切流的牛顿黏性参考答案；上下板力方向随法向和“板对流体/流体对板”约定改变，已显式写出。"
  },
  {
    "id": "181103-material-extracted-0154",
    "sourcePage": 188,
    "diagnosis": "旧答案只列润滑近似结果，未从连续方程、径向动量方程、无滑移边界和压力积分推出挤压力公式。",
    "afterScore": {
      "chars": 1197,
      "sentenceCount": 18,
      "formulaCount": 99,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "公式采用间隙为 h、相对闭合速度为 U 的约定；若教材把 h 定义为半间隙或两板各自速度，会出现等价系数换算，不能混用。"
  },
  {
    "id": "181103-material-extracted-0231",
    "sourcePage": 282,
    "diagnosis": "旧答案直接引用各向同性湍流相关函数关系，没有证明不可压条件怎样把纵向相关 f 与横向相关 g 联系起来。",
    "afterScore": {
      "chars": 1488,
      "sentenceCount": 17,
      "formulaCount": 101,
      "proofSignalCount": 17
    },
    "htmlUpdated": true,
    "boundaryNote": "本题证明使用均匀、各向同性、不可压和相关函数可微假设；若压缩性或各向异性存在，f/g 关系不能直接套用。"
  },
  {
    "id": "181103-material-extracted-0145",
    "sourcePage": 176,
    "diagnosis": "旧答案只把净重功率等于 6πμaU²，没有展示 Stokes 阻力、终端平衡和耗散积分之间的能量闭合。",
    "afterScore": {
      "chars": 1286,
      "sentenceCount": 17,
      "formulaCount": 85,
      "proofSignalCount": 19
    },
    "htmlUpdated": true,
    "boundaryNote": "本题证明的是低雷诺数、定常、不可压 Stokes 流的能量闭合；不把耗散校验推广到惯性显著或尾流分离的情形。"
  },
  {
    "id": "181103-material-extracted-0512",
    "sourcePage": 11,
    "diagnosis": "旧答案给出速度式和零下壁剪切条件，但没有说明重力分量、压强梯度符号、边界条件积分和剪应力方向。",
    "afterScore": {
      "chars": 1076,
      "sentenceCount": 21,
      "formulaCount": 90,
      "proofSignalCount": 18
    },
    "htmlUpdated": true,
    "boundaryNote": "答案采用 x 向下坡、y 自下板指向上板的符号约定；若题图坐标相反，U 与 S 的符号需要整体转换。"
  },
  {
    "id": "181103-material-extracted-0517",
    "sourcePage": 11,
    "diagnosis": "旧答案只列圆环泊肃叶和移动管叠加，未从柱坐标方程、双壁无滑移和流量积分推出完整表达。",
    "afterScore": {
      "chars": 1290,
      "sentenceCount": 20,
      "formulaCount": 90,
      "proofSignalCount": 22
    },
    "htmlUpdated": true,
    "boundaryNote": "本题默认内管运动；外管运动时已给出替换项，避免把“某一管动”的题图约定误写成唯一答案。"
  },
  {
    "id": "181103-material-extracted-0160",
    "sourcePage": 194,
    "diagnosis": "旧答案只说涡管拉长 N 倍半径变小、涡度增大，缺少体积守恒、Kelvin 环流守恒和涡量通量守恒的证明链。",
    "afterScore": {
      "chars": 1077,
      "sentenceCount": 23,
      "formulaCount": 70,
      "proofSignalCount": 22
    },
    "htmlUpdated": true,
    "boundaryNote": "证明限于理想、不可压、无黏或黏性扩散可忽略的随体涡管；真实黏性流中还会有涡扩散和边界生成涡量。"
  },
  {
    "id": "181103-material-extracted-0173",
    "sourcePage": 214,
    "diagnosis": "旧答案列复势和流线方程，但未证明无限涡列由周期点涡叠加得到，也没有展开单排与 Karman 涡街流线常数式。",
    "afterScore": {
      "chars": 1444,
      "sentenceCount": 19,
      "formulaCount": 82,
      "proofSignalCount": 25
    },
    "htmlUpdated": true,
    "boundaryNote": "本题给出同列与反号双列的标准复势推导；错列 Karman 涡街需按题图半周期位移替换，不把未给图的几何约定写死。"
  },
  {
    "id": "181103-material-extracted-0249",
    "sourcePage": 307,
    "diagnosis": "旧答案只对总阻力公式求导并给出动量损失厚度，缺少壁面剪应力、动量积分方程和初值积分说明。",
    "afterScore": {
      "chars": 1090,
      "sentenceCount": 22,
      "formulaCount": 72,
      "proofSignalCount": 16
    },
    "htmlUpdated": true,
    "boundaryNote": "本题使用零压梯度平板动量积分关系；题给阻力系数作为已知经验/理论输入，不再反推速度剖面。"
  }
]
```
