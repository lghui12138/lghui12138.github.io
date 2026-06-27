# Round545 181103 Proof Depth Upgrade

Version: `round545-181103-proof-depth-upgrade-20260627`
Generated: `2026-06-27T05:07:06.317Z`
Overall: **PASS**

## Scope

- Upgraded rows: 10
- Minimum answer length: 865
- Minimum sentence count: 15
- Minimum formula/dependency count: 56
- Minimum proof signal count: 12
- Failed IDs: none
- Boundary: this is the thirteenth proof/process/explanation-depth batch after Round531-Round544, not a claim that every proof-like row is closed.
- QA rule: an answer that only names a formula, integral, velocity field, or final number is not enough for proof questions.
- Correction rule: proof answers must show assumptions, governing equation, transformations, boundary/sign conventions, and a conclusion check.
- Source-clue rule: strict PDF proof remains a separate ledger; these are student-facing derived reference answers.

## Upgraded IDs

- `181103-material-extracted-0475`
- `181103-material-extracted-0058`
- `181103-material-extracted-0488`
- `181103-material-extracted-0031`
- `181103-material-extracted-0155`
- `181103-material-extracted-0417`
- `181103-material-extracted-0045`
- `181103-material-extracted-0435`
- `181103-material-extracted-0103`
- `181103-material-extracted-0210`

## Records

```json
[
  {
    "id": "181103-material-extracted-0475",
    "sourcePage": 7,
    "diagnosis": "旧答案只说由连续方程和非定常 Bernoulli 积分，缺少球对称速度势、压力边界、Rayleigh 型微分方程和闭合时间积分常数。",
    "afterScore": {
      "chars": 1783,
      "sentenceCount": 25,
      "formulaCount": 130,
      "proofSignalCount": 30
    },
    "htmlUpdated": true,
    "boundaryNote": "按不可压、无黏、球对称、空穴内压可忽略且无穷远压强为 P0 的 Rayleigh 空泡闭合模型推导；若空穴内有气体压强或表面张力，边界压力项需相应修改。"
  },
  {
    "id": "181103-material-extracted-0058",
    "sourcePage": 73,
    "diagnosis": "旧答案只列壁面剪应力方向，缺少牛顿黏性定律、法向选择、两种速度分布的导数和作用-反作用方向说明。",
    "afterScore": {
      "chars": 1198,
      "sentenceCount": 21,
      "formulaCount": 82,
      "proofSignalCount": 16
    },
    "htmlUpdated": true,
    "boundaryNote": "按平板法向 z、速度沿 x、牛顿黏性定律 tau_xz=mu du/dz 推导；若教材坐标原点或板面法向取向不同，板面对水的正负号会随法向约定改变，但大小和作用-反作用关系不变。"
  },
  {
    "id": "181103-material-extracted-0488",
    "sourcePage": 9,
    "diagnosis": "旧答案只写 q=s sqrt(2gh) 和数值，缺少稳态流量平衡、伯努利适用条件、单位统一和结果合理性检查。",
    "afterScore": {
      "chars": 865,
      "sentenceCount": 24,
      "formulaCount": 56,
      "proofSignalCount": 20
    },
    "htmlUpdated": true,
    "boundaryNote": "按理想小孔出流、自由面速度可忽略、流量系数取 1 推导；实际小孔若考虑收缩或损失，应将 q=C_d s sqrt(2gh)，高度会变为 q^2/(2g C_d^2 s^2)。"
  },
  {
    "id": "181103-material-extracted-0031",
    "sourcePage": 36,
    "diagnosis": "旧答案只列直角坐标和柱坐标公式，没有证明这些定义如何自动满足可压缩定常连续方程。",
    "afterScore": {
      "chars": 1875,
      "sentenceCount": 15,
      "formulaCount": 164,
      "proofSignalCount": 17
    },
    "htmlUpdated": true,
    "boundaryNote": "按二维定常可压缩流的质量守恒定义流函数；若是不可压且 rho 为常数，可把 rho 吸收入流函数，退化为通常的体积流函数形式。"
  },
  {
    "id": "181103-material-extracted-0155",
    "sourcePage": 190,
    "diagnosis": "旧答案只给点涡结论、环流和加速度环流为零，没有证明极坐标涡度公式、原点奇性和加速度环流为何为零。",
    "afterScore": {
      "chars": 1196,
      "sentenceCount": 21,
      "formulaCount": 89,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "按 v_theta=m/r 的自由涡模型推导；原点处速度奇异，不能用普通函数涡度判断，只能用环流或分布意义说明点涡强度。"
  },
  {
    "id": "181103-material-extracted-0417",
    "sourcePage": 2,
    "diagnosis": "旧答案列出刚体旋转速度、轨迹和加速度，没有逐项证明欧拉/拉格朗日形式、流线迹线一致性和极坐标表达。",
    "afterScore": {
      "chars": 1448,
      "sentenceCount": 21,
      "formulaCount": 81,
      "proofSignalCount": 18
    },
    "htmlUpdated": true,
    "boundaryNote": "按刚体匀角速度旋转推导；若角速度随时间变化，速度场仍为 omega(t) x r，但会额外出现切向加速度 r d omega/dt。"
  },
  {
    "id": "181103-material-extracted-0045",
    "sourcePage": 52,
    "diagnosis": "旧答案只把复势结果写出，缺少极坐标代入、势函数/流函数分离、速度大小求导和不同 n 对应流线形状说明。",
    "afterScore": {
      "chars": 1409,
      "sentenceCount": 20,
      "formulaCount": 111,
      "proofSignalCount": 18
    },
    "htmlUpdated": true,
    "boundaryNote": "按复势约定 F=phi+i psi 和 dF/dz=u-iv 推导；若教材采用 F=phi-i psi，流函数符号会整体相反，但流线族不变。"
  },
  {
    "id": "181103-material-extracted-0435",
    "sourcePage": 4,
    "diagnosis": "旧答案只给欧拉和拉格朗日形式，缺少从细管物质段质量守恒到两种坐标表达的完整推导。",
    "afterScore": {
      "chars": 1469,
      "sentenceCount": 19,
      "formulaCount": 82,
      "proofSignalCount": 21
    },
    "htmlUpdated": true,
    "boundaryNote": "按细管一维平均流推导；若截面积沿截面内变化强烈或存在显著横向速度，需回到三维连续方程再截面积分。"
  },
  {
    "id": "181103-material-extracted-0103",
    "sourcePage": 124,
    "diagnosis": "旧答案给出 Couette-Poiseuille 速度分布，但没有从定常 N-S 方程、边界条件和常数求解证明出来。",
    "afterScore": {
      "chars": 1306,
      "sentenceCount": 21,
      "formulaCount": 108,
      "proofSignalCount": 26
    },
    "htmlUpdated": true,
    "boundaryNote": "按压力梯度 G=partial p/partial x 的符号约定推导；若教材令 -dp/dx 为正驱动力，公式中压力项会改写为 +(h^2/2mu)(-dp/dx)(1-z^2/h^2)。"
  },
  {
    "id": "181103-material-extracted-0210",
    "sourcePage": 258,
    "diagnosis": "旧答案把三个雷诺平均性质写成结论，缺少平均算子的定义、交换条件和面积积分逐点证明。",
    "afterScore": {
      "chars": 1364,
      "sentenceCount": 20,
      "formulaCount": 65,
      "proofSignalCount": 30
    },
    "htmlUpdated": true,
    "boundaryNote": "按固定平均区间、固定面积域和足够光滑/可积条件证明；移动边界、非平稳短样本或条件平均下，交换微分和积分时需检查端点项。"
  }
]
```
