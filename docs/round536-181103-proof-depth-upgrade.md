# Round536 181103 Proof Depth Upgrade

Version: `round536-181103-proof-depth-upgrade-20260624`
Generated: `2026-06-24T13:43:28.140Z`
Overall: **PASS**

## Scope

- Upgraded rows: 30
- Minimum answer length: 471
- Minimum sentence count: 7
- Minimum formula/dependency count: 30
- Minimum proof signal count: 5
- Failed IDs: none
- Boundary: this is the sixth proof/process/explanation-depth batch after Round531-Round535, not a claim that every proof-like row is closed.
- QA rule: visible answer blocks that only say "use a theorem" or "same as above" are insufficient for proof questions.
- Correction rule: a proof answer must show assumptions, governing equations or identities, transformations, boundary/regularity conditions where relevant, and a conclusion check.
- Source-clue rule: display-only source cards may receive better reference answers without being counted as default practice questions.

## Upgraded IDs

- `181103-material-extracted-0118`
- `181103-material-extracted-0049`
- `181103-material-extracted-0134`
- `181103-material-extracted-0013`
- `181103-material-extracted-0035`
- `181103-material-extracted-0046`
- `181103-material-extracted-0099`
- `181103-material-extracted-0132`
- `181103-material-extracted-0151`
- `181103-material-extracted-0153`
- `181103-material-extracted-0306`
- `181103-material-extracted-0317`
- `181103-material-extracted-0318`
- `181103-material-extracted-0324`
- `181103-material-extracted-0325`
- `181103-material-extracted-0326`
- `181103-material-extracted-0344`
- `181103-material-extracted-0349`
- `181103-material-extracted-0350`
- `181103-material-extracted-0351`
- `181103-material-extracted-0378`
- `181103-material-extracted-0386`
- `181103-material-extracted-0396`
- `181103-material-extracted-0399`
- `181103-material-extracted-0403`
- `181103-material-extracted-0408`
- `181103-material-extracted-0499`
- `181103-material-extracted-0500`
- `181103-material-extracted-0501`
- `181103-material-extracted-0521`

## Records

```json
[
  {
    "id": "181103-material-extracted-0118",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 148,
    "diagnosis": "原答案只列两个最终相似式，没有展示量纲矩阵、重复变量选择和无量纲数组构造，学生看不出 Π 定理怎么用。",
    "afterScore": {
      "chars": 760,
      "sentenceCount": 9,
      "formulaCount": 54,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "按题面变量作 Buckingham Π 定理补全；量纲分析只能确定无量纲结构，不能给出经验函数。"
  },
  {
    "id": "181103-material-extracted-0049",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 60,
    "diagnosis": "原答案只给柱坐标结论，球坐标用“相应式”带过，缺少固定微元质量守恒推导。",
    "afterScore": {
      "chars": 922,
      "sentenceCount": 7,
      "formulaCount": 64,
      "proofSignalCount": 5
    },
    "htmlUpdated": true,
    "boundaryNote": "球坐标中 (\theta,phi) 的命名随教材可互换，但尺度因子与散度结构不能省略。"
  },
  {
    "id": "181103-material-extracted-0134",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 162,
    "diagnosis": "原答案把涌浪槽连续方程、非定常动量方程和模型相似条件压缩成几句，缺少逐步证明。",
    "afterScore": {
      "chars": 621,
      "sentenceCount": 15,
      "formulaCount": 39,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "数值结论依赖源页表格；若缺表格，只能证明两个方程和相似无量纲组。"
  },
  {
    "id": "181103-material-extracted-0013",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 14,
    "diagnosis": "原答案直接给流线和迹线公式，没有说明固定时刻积分、质点积分以及 (ku_0=alpha) 的特殊极限。",
    "afterScore": {
      "chars": 663,
      "sentenceCount": 11,
      "formulaCount": 50,
      "proofSignalCount": 16
    },
    "htmlUpdated": true,
    "boundaryNote": "迹线结论默认质点从原点出发；若初始点不同，只需加入积分常数。"
  },
  {
    "id": "181103-material-extracted-0035",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 41,
    "diagnosis": "原答案未说明极坐标积分、多值速度势和环量符号约定，只给出结论。",
    "afterScore": {
      "chars": 703,
      "sentenceCount": 10,
      "formulaCount": 45,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "若教材把正点涡速度写为 (+Gamma/(2pi r))，速度势与环量符号需同步反向。"
  },
  {
    "id": "181103-material-extracted-0046",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 52,
    "diagnosis": "原答案只给流函数和流量，没有检查速度场、调和性、流量方向和正负号边界。",
    "afterScore": {
      "chars": 700,
      "sentenceCount": 10,
      "formulaCount": 62,
      "proofSignalCount": 15
    },
    "htmlUpdated": true,
    "boundaryNote": "保留有向流量和流量大小两种口径，避免把符号约定误当成计算错误。"
  },
  {
    "id": "181103-material-extracted-0099",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 117,
    "diagnosis": "原答案没有统一 (y) 的定义，也没有写出截面平均速度和皮托读数误差公式。",
    "afterScore": {
      "chars": 688,
      "sentenceCount": 15,
      "formulaCount": 51,
      "proofSignalCount": 5
    },
    "htmlUpdated": true,
    "boundaryNote": "若源页原式写作 (u_0(1-y/R)^{1/m})，则 (y) 应改解为距轴距离；本答案显式按题面“距管壁”修正。"
  },
  {
    "id": "181103-material-extracted-0132",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 160,
    "diagnosis": "原答案只写“约 6%”，没有把经验指数 2.47 与黏性相似项联系起来。",
    "afterScore": {
      "chars": 670,
      "sentenceCount": 18,
      "formulaCount": 32,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "这是按经验指数反推黏性修正的近似证明，不是由理论唯一确定系数。"
  },
  {
    "id": "181103-material-extracted-0151",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 181,
    "diagnosis": "原答案写“同 0150”式描述，单独打开题卡时缺少流线形式、阻力公式和固体小球极限比较。",
    "afterScore": {
      "chars": 535,
      "sentenceCount": 9,
      "formulaCount": 30,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "本条是重复题卡的独立可读答案，避免学生从单题入口看到“同 0150”后无从作答。"
  },
  {
    "id": "181103-material-extracted-0153",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题解 余志豪",
    "sourcePage": 182,
    "diagnosis": "原答案只给最终力矩，没有切向速度解、边界条件、剪应力和球面积分。",
    "afterScore": {
      "chars": 672,
      "sentenceCount": 9,
      "formulaCount": 37,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "答案给出力矩大小和方向；符号若按外力矩维持转动则与阻力矩相反。"
  },
  {
    "id": "181103-material-extracted-0306",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题册答案2010修改版",
    "sourcePage": 3,
    "diagnosis": "当前为 source-clue 定位卡，题面要求证明反对称张量，缺少必要性和充分性。",
    "afterScore": {
      "chars": 727,
      "sentenceCount": 13,
      "formulaCount": 47,
      "proofSignalCount": 17
    },
    "htmlUpdated": true,
    "boundaryNote": "证明要求“任意向量”成立；若只对某一个向量成立，不能推出 (P) 反对称。"
  },
  {
    "id": "181103-material-extracted-0317",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题册答案2010修改版",
    "sourcePage": 14,
    "diagnosis": "当前为 source-clue 定位卡，题面要求量纲分析关系，但没有无量纲组和比例结论。",
    "afterScore": {
      "chars": 621,
      "sentenceCount": 11,
      "formulaCount": 45,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "保持量纲分析与精确管流解的边界；常数不能靠 Π 定理单独推出。"
  },
  {
    "id": "181103-material-extracted-0318",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题册答案2010修改版",
    "sourcePage": 15,
    "diagnosis": "当前为 source-clue 定位卡，题面要求水跃高度比的无量纲关系，答案只提示页码。",
    "afterScore": {
      "chars": 471,
      "sentenceCount": 9,
      "formulaCount": 38,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "答案区分量纲关系和动量方程精确共轭水深公式，避免过claim。"
  },
  {
    "id": "181103-material-extracted-0324",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题册答案2010修改版",
    "sourcePage": 23,
    "diagnosis": "当前为 source-clue 定位卡，题面要求柱坐标径向动量方程推导，没有给方程。",
    "afterScore": {
      "chars": 682,
      "sentenceCount": 9,
      "formulaCount": 50,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "按“平面辐射流动”取 (v_\theta=0)；有周向速度时需另加向心项。"
  },
  {
    "id": "181103-material-extracted-0325",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题册答案2010修改版",
    "sourcePage": 24,
    "diagnosis": "当前为 source-clue 定位卡，题面要求推导能量守恒最简形式，缺少总能、动能和内能方程相减。",
    "afterScore": {
      "chars": 713,
      "sentenceCount": 7,
      "formulaCount": 47,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "该式为理想流体、绝热且无黏性耗散形式；若源题包含热量或黏性项，应补入相应项。"
  },
  {
    "id": "181103-material-extracted-0326",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题册答案2010修改版",
    "sourcePage": 26,
    "diagnosis": "当前为 source-clue 定位卡，题面要求不定常平板流动的应力、方程和边界条件，答案只有定位。",
    "afterScore": {
      "chars": 644,
      "sentenceCount": 9,
      "formulaCount": 52,
      "proofSignalCount": 15
    },
    "htmlUpdated": true,
    "boundaryNote": "按 Stokes 第一问题补全；题面未给 (U(t)) 时不强行固定瞬时启动解。"
  },
  {
    "id": "181103-material-extracted-0344",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题册答案2010修改版",
    "sourcePage": 44,
    "diagnosis": "当前为 source-clue 定位卡，题面给自由面无切应力条件但没有速度分布和流量公式。",
    "afterScore": {
      "chars": 535,
      "sentenceCount": 10,
      "formulaCount": 51,
      "proofSignalCount": 16
    },
    "htmlUpdated": true,
    "boundaryNote": "符号取决于 (z) 轴正向和压强梯度定义；答案显式用 (G) 收纳驱动力。"
  },
  {
    "id": "181103-material-extracted-0349",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题册答案2010修改版",
    "sourcePage": 49,
    "diagnosis": "当前为 source-clue 定位卡，题面要求旋转圆柱外速度、应力和力矩，缺少完整推导。",
    "afterScore": {
      "chars": 659,
      "sentenceCount": 11,
      "formulaCount": 44,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "按无限长圆柱单位长度给出；有限长度需另乘长度并考虑端部效应。"
  },
  {
    "id": "181103-material-extracted-0350",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题册答案2010修改版",
    "sourcePage": 50,
    "diagnosis": "当前为 source-clue 定位卡，题面要求证明动量积分并讨论厚度关系，答案仅定位页码。",
    "afterScore": {
      "chars": 836,
      "sentenceCount": 8,
      "formulaCount": 72,
      "proofSignalCount": 19
    },
    "htmlUpdated": true,
    "boundaryNote": "未给具体速度剖面时只给通用积分关系，不伪造唯一厚度比例。"
  },
  {
    "id": "181103-material-extracted-0351",
    "type": "名词解释",
    "sourceMaterialTitle": "流体力学习题册答案2010修改版",
    "sourcePage": 50,
    "diagnosis": "当前为 source-clue 定位卡，题面要求相似变量、流函数、方程和边界条件，缺少可学习推导。",
    "afterScore": {
      "chars": 664,
      "sentenceCount": 8,
      "formulaCount": 65,
      "proofSignalCount": 17
    },
    "htmlUpdated": true,
    "boundaryNote": "相似变量系数依教材定义可差常数；方程结构和边界条件应保持一致。"
  },
  {
    "id": "181103-material-extracted-0378",
    "type": "填空题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 7,
    "diagnosis": "当前为 source-clue 定位卡，题面要求由定常不可压证明速度沿等密度面，并说明反向命题。",
    "afterScore": {
      "chars": 640,
      "sentenceCount": 10,
      "formulaCount": 53,
      "proofSignalCount": 16
    },
    "htmlUpdated": true,
    "boundaryNote": "反向命题依赖定常和非零密度；不定常密度场中速度沿等密度面不足以推出不可压。"
  },
  {
    "id": "181103-material-extracted-0386",
    "type": "填空题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 16,
    "diagnosis": "当前为 source-clue 定位卡，题面要求运动边界面法向速度，但答案没有物质面条件。",
    "afterScore": {
      "chars": 700,
      "sentenceCount": 9,
      "formulaCount": 63,
      "proofSignalCount": 24
    },
    "htmlUpdated": true,
    "boundaryNote": "按物质面运动学边界条件补全；若题面给特殊面方程，直接代入 (F) 即可。"
  },
  {
    "id": "181103-material-extracted-0396",
    "type": "填空题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 31,
    "diagnosis": "当前为 source-clue 定位卡，题面要求圆外偶极像、强度比和圆柱受力，答案没有复势框架。",
    "afterScore": {
      "chars": 589,
      "sentenceCount": 9,
      "formulaCount": 37,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "当前 JSON 题面缺偶极位置/方向；本答案给出可计算框架并明确不能凭空给唯一数值。"
  },
  {
    "id": "181103-material-extracted-0399",
    "type": "填空题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 36,
    "diagnosis": "当前为 source-clue 定位卡，题面要求运动圆柱势函数、速度、动能和惯性阻力。",
    "afterScore": {
      "chars": 741,
      "sentenceCount": 9,
      "formulaCount": 48,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "按无限域、单位长度圆柱给出；有限边界或不同运动方向需重写边界条件。"
  },
  {
    "id": "181103-material-extracted-0403",
    "type": "填空题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 43,
    "diagnosis": "当前为 source-clue 定位卡，题面要求同轴圆筒旋转流速度、压强、应力和力矩，缺少完整公式。",
    "afterScore": {
      "chars": 749,
      "sentenceCount": 9,
      "formulaCount": 51,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "用通式覆盖内管固定/外管固定；若源页采用相反角速度符号，(B) 与力矩方向同步变号。"
  },
  {
    "id": "181103-material-extracted-0408",
    "type": "证明推导题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 48,
    "diagnosis": "当前为 source-clue 定位卡，题面要求边界层相似方程，答案没有速度表达、ODE 和边界条件。",
    "afterScore": {
      "chars": 608,
      "sentenceCount": 9,
      "formulaCount": 48,
      "proofSignalCount": 20
    },
    "htmlUpdated": true,
    "boundaryNote": "若源题写成无 (+m) 项的方程，应核对其压力梯度项或归一化定义；本答案按标准 Falkner-Skan 推导。"
  },
  {
    "id": "181103-material-extracted-0499",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 10,
    "diagnosis": "可见答案只有“用像法/积分”的方法句，缺少像系、速度、压强积分和单位高度受力表达。",
    "afterScore": {
      "chars": 604,
      "sentenceCount": 9,
      "formulaCount": 34,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "按外源在实轴 (b>a) 和常见二维源强约定给出；不同源强规范只改变系数。"
  },
  {
    "id": "181103-material-extracted-0500",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 10,
    "diagnosis": "可见答案只说用圆定理，缺少像偶强度、边界验证、受力积分以及参数不足边界。",
    "afterScore": {
      "chars": 567,
      "sentenceCount": 8,
      "formulaCount": 37,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "不伪造缺失参数下的唯一力；给出可代入的完整复势和受力公式。"
  },
  {
    "id": "181103-material-extracted-0501",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 10,
    "diagnosis": "可见答案只有方法轮廓，缺少源汇复势、像点和特殊情形化简。",
    "afterScore": {
      "chars": 571,
      "sentenceCount": 9,
      "formulaCount": 36,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "假设源汇均在圆外且采用常见二维源强 (m/(2pi)log) 规范。"
  },
  {
    "id": "181103-material-extracted-0521",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 12,
    "diagnosis": "原答案虽较长，但对外压梯度项与题设 ODE 的差异提示不够清晰，学生容易把缺项方程当作已证明。",
    "afterScore": {
      "chars": 676,
      "sentenceCount": 8,
      "formulaCount": 47,
      "proofSignalCount": 16
    },
    "htmlUpdated": true,
    "boundaryNote": "把题设方程疑点直接写入答案，防止学生背下缺外压梯度项的错误证明。"
  }
]
```
