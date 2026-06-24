# Round535 181103 Proof Depth Upgrade

Version: `round535-181103-proof-depth-upgrade-20260624`
Generated: `2026-06-24T11:00:03.702Z`
Overall: **PASS**

## Scope

- Upgraded rows: 30
- Minimum answer length: 410
- Minimum sentence count: 6
- Minimum formula/dependency count: 18
- Minimum proof signal count: 6
- Failed IDs: none
- Boundary: this is the fifth proof/process/explanation-depth batch after Round531-Round534, not a claim that every proof-like row is closed.
- QA rule: source-clue cards still need student-usable derivations when they are exposed as answer-bearing proof rows.
- Correction rule: a proof answer must show assumptions, governing equations or identities, transformations, boundary/regularity conditions where relevant, and a conclusion check.

## Upgraded IDs

- `181103-material-extracted-0395`
- `181103-material-extracted-0401`
- `181103-material-extracted-0402`
- `181103-material-extracted-0406`
- `181103-material-extracted-0407`
- `181103-material-extracted-0409`
- `181103-material-extracted-0371`
- `181103-material-extracted-0372`
- `181103-material-extracted-0373`
- `181103-material-extracted-0379`
- `181103-material-extracted-0382`
- `181103-material-extracted-0437`
- `181103-material-extracted-0438`
- `181103-material-extracted-0444`
- `181103-material-extracted-0451`
- `181103-material-extracted-0453`
- `181103-material-extracted-0457`
- `181103-material-extracted-0459`
- `181103-material-extracted-0460`
- `181103-material-extracted-0464`
- `181103-material-extracted-0465`
- `181103-material-extracted-0481`
- `181103-material-extracted-0484`
- `181103-material-extracted-0490`
- `181103-material-extracted-0492`
- `181103-material-extracted-0493`
- `181103-material-extracted-0503`
- `181103-material-extracted-0412`
- `181103-material-extracted-0422`
- `181103-material-extracted-0425`

## Records

```json
[
  {
    "id": "181103-material-extracted-0395",
    "type": "证明推导题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 30,
    "diagnosis": "原 referenceAnswer 是资料定位卡，不是证明；缺少由连续方程推出流函数存在、再反证连续方程自动满足的过程。",
    "afterScore": {
      "chars": 410,
      "sentenceCount": 7,
      "formulaCount": 39,
      "proofSignalCount": 15
    },
    "htmlUpdated": true,
    "boundaryNote": "依据第30页题卡与 sourceSemanticEvidence 补写 proof-depth 文本；仍不是 strictAnswerPdfProof。"
  },
  {
    "id": "181103-material-extracted-0401",
    "type": "证明推导题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 38,
    "diagnosis": "原答案只定位页码；缺少从柱坐标连续方程证明 (v_z=q(r))，再由 N-S 方程和边界条件积分得到 Poiseuille 分布与流量。",
    "afterScore": {
      "chars": 511,
      "sentenceCount": 9,
      "formulaCount": 43,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "采用页内圆管 Poiseuille 约定 (G=-dp/dz)；来源页为第38页，未声明严格原 PDF 逐字证明。"
  },
  {
    "id": "181103-material-extracted-0402",
    "type": "证明推导题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 39,
    "diagnosis": "原 referenceAnswer 是资料线索；缺少同轴圆环中允许 (ln r) 项、用内外壁无滑移确定常数并积分求平均速度的推导。",
    "afterScore": {
      "chars": 564,
      "sentenceCount": 7,
      "formulaCount": 40,
      "proofSignalCount": 6
    },
    "htmlUpdated": true,
    "boundaryNote": "依据第39页题卡的 (q(r),Q) 线索补足；半径记号按常见 (b=na) 解释。"
  },
  {
    "id": "181103-material-extracted-0406",
    "type": "证明推导题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 46,
    "diagnosis": "原答案仅给页码定位；缺少把压强梯度与重力沿管分量合成驱动力，再套用管流边界条件的完整推导。",
    "afterScore": {
      "chars": 559,
      "sentenceCount": 8,
      "formulaCount": 42,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "第46页为 medium 来源，符号正负取决于 (z) 轴与 (alpha) 定义；这里显式给出总驱动力。"
  },
  {
    "id": "181103-material-extracted-0407",
    "type": "证明推导题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 47,
    "diagnosis": "原 referenceAnswer 是资料定位；缺少由给定速度型计算动量厚度、壁面剪应力、再代入动量积分方程求 (delta) 与位移厚度的步骤。",
    "afterScore": {
      "chars": 719,
      "sentenceCount": 10,
      "formulaCount": 53,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "依据第47页题卡和 OCR 中正弦速度分布线索补写；这是 proof-depth 参考推导，不是原 PDF 严格逐字证据。"
  },
  {
    "id": "181103-material-extracted-0409",
    "type": "填空题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 49,
    "diagnosis": "旧条目仍是资料线索卡；源页49-51实际给出了两平板间湍流平均运动的 Reynolds 分解、边界条件、压力最大与总剪应力线性变化推导。",
    "afterScore": {
      "chars": 722,
      "sentenceCount": 11,
      "formulaCount": 58,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "答案按目标 ID 源页49-51补成独立推导，并与已题库化的习题九第14题口径保持一致。"
  },
  {
    "id": "181103-material-extracted-0371",
    "type": "证明推导题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 1,
    "diagnosis": "旧条目为资料线索卡；页图第1页可见习题一第1题要求用 Hamilton 记号和张量记号证明 ((operatorname{rot}mathbf n)\timesmathbf n=(mathbf ncdot\nabla)mathbf n)。",
    "afterScore": {
      "chars": 839,
      "sentenceCount": 8,
      "formulaCount": 36,
      "proofSignalCount": 11
    },
    "htmlUpdated": true,
    "boundaryNote": "源页只给证明目标和页图公式，本答案按页图可见恒等式补全，不扩展到同页后续第2题。"
  },
  {
    "id": "181103-material-extracted-0372",
    "type": "证明推导题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 2,
    "diagnosis": "旧条目为资料线索卡；页图第2-3页给出张量证明目标：证明 (mathbf ucdot(Pcdotmathbf v)-mathbf vcdot(Pcdotmathbf u)=-2\boldsymbolomegacdot(mathbf u\timesmathbf v))。",
    "afterScore": {
      "chars": 650,
      "sentenceCount": 7,
      "formulaCount": 18,
      "proofSignalCount": 6
    },
    "htmlUpdated": true,
    "boundaryNote": "答案依据目标源页第2-3页的指标定义和等式补全，保留源页的 (omega) 符号约定。"
  },
  {
    "id": "181103-material-extracted-0373",
    "type": "填空题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 4,
    "diagnosis": "旧条目为资料线索卡；页图第4页及同题条目均指向充要性证明：(P) 反对称当且仅当任意 (mathbf a) 满足 (mathbf acdot(Pcdotmathbf a)=0)。",
    "afterScore": {
      "chars": 523,
      "sentenceCount": 7,
      "formulaCount": 34,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "目标旧 ID 仍为资料线索卡，本答案按源页第4页和同题完整条目补为独立参考答案。"
  },
  {
    "id": "181103-material-extracted-0379",
    "type": "填空题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 9,
    "diagnosis": "旧条目为资料线索卡；页图第9页可见薄球壳控制体、球对称径向流连续方程及不可压通量相等结论。",
    "afterScore": {
      "chars": 599,
      "sentenceCount": 8,
      "formulaCount": 40,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "这里的边界条件是薄球壳两侧球面通量守恒和不可压约束，结论仅针对球对称径向流。"
  },
  {
    "id": "181103-material-extracted-0382",
    "type": "填空题",
    "sourceMaterialTitle": "未命名 3",
    "sourcePage": 12,
    "diagnosis": "当前条目是资料线索卡，原 referenceAnswer 不是独立解答；页图可见 a)-d) 的散度、旋度和速度势，应补为逐项判别推导。",
    "afterScore": {
      "chars": 640,
      "sentenceCount": 7,
      "formulaCount": 54,
      "proofSignalCount": 15
    },
    "htmlUpdated": true,
    "boundaryNote": "0382 的 JSON 源题面未列出 a)-d) 原速度场；本答案按 page-012 可见答案式和速度势反推展开，不把资料线索卡提升为默认刷题题。"
  },
  {
    "id": "181103-material-extracted-0437",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 4,
    "diagnosis": "现有答案只写最终连续方程，缺少控制体、不可压约束和底/侧壁边界条件的推导链。",
    "afterScore": {
      "chars": 507,
      "sentenceCount": 9,
      "formulaCount": 38,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "这里的边界条件是渠底、侧壁无穿透；(bsigma) 按源式作为截面体积通量，不额外假设平底。"
  },
  {
    "id": "181103-material-extracted-0438",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 4,
    "diagnosis": "现有答案接近正确，但仍偏结论式；应明确细流管侧面无通量和端面质量通量差。",
    "afterScore": {
      "chars": 501,
      "sentenceCount": 7,
      "formulaCount": 31,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "推导只需细流管侧面无穿透；(s) 为沿管轴线坐标，端面方向按速度正向取通量符号。"
  },
  {
    "id": "181103-material-extracted-0444",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 4,
    "diagnosis": "现有答案只有度量因子结论，缺少球面面积元和两方向通量差的来源。",
    "afterScore": {
      "chars": 629,
      "sentenceCount": 7,
      "formulaCount": 38,
      "proofSignalCount": 6
    },
    "htmlUpdated": true,
    "boundaryNote": "半径常数因子已约去；符号按题式的两个通量项书写，避免把经纬变化率文字顺序另行改写。"
  },
  {
    "id": "181103-material-extracted-0451",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 5,
    "diagnosis": "现有答案给了方向向量结论，但未把线元伸长率公式、剪切子张量和三个坐标面的对应关系展开。",
    "afterScore": {
      "chars": 520,
      "sentenceCount": 6,
      "formulaCount": 21,
      "proofSignalCount": 8
    },
    "htmlUpdated": true,
    "boundaryNote": "这是局部一阶小变形证明，忽略 (dt^2) 高阶项；若把两条对角线伸长率相减，则差为 (2A_{ij})。"
  },
  {
    "id": "181103-material-extracted-0453",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 5,
    "diagnosis": "现有答案偏结论式，且漏列 b) 的速度势；需逐项给出散度、旋度与势函数。",
    "afterScore": {
      "chars": 787,
      "sentenceCount": 12,
      "formulaCount": 76,
      "proofSignalCount": 20
    },
    "htmlUpdated": true,
    "boundaryNote": "按题面二维速度场判断；若常数取特殊值如 (k=0) 会退化为静止或部分退化情形。"
  },
  {
    "id": "181103-material-extracted-0457",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 5,
    "diagnosis": "现有答案思路正确，但需补足单连通保证势函数存在、封闭曲面外法向与无奇点条件。",
    "afterScore": {
      "chars": 519,
      "sentenceCount": 6,
      "formulaCount": 40,
      "proofSignalCount": 12
    },
    "htmlUpdated": true,
    "boundaryNote": "结论依赖封闭曲面内速度势光滑、无源汇奇点；若曲面包围源点或区域非单连通且势函数多值，需另作说明。"
  },
  {
    "id": "181103-material-extracted-0459",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 5,
    "diagnosis": "结论正确，但需要展示量纲指数求解，以及从平均速度 (U) 转到体积流量 (Q) 的步骤。",
    "afterScore": {
      "chars": 503,
      "sentenceCount": 8,
      "formulaCount": 31,
      "proofSignalCount": 6
    },
    "htmlUpdated": true,
    "boundaryNote": "无量纲常数 (C_1) 由半圆截面形状和精确流动解决定，量纲分析只能给出比例关系，不能给出数值系数。"
  },
  {
    "id": "181103-material-extracted-0460",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 6,
    "diagnosis": "现有答案方向正确，但需明确单位宽流量的量纲并写出 Buckingham 推导。",
    "afterScore": {
      "chars": 608,
      "sentenceCount": 8,
      "formulaCount": 39,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "该关系按题面只保留重力、黏性、密度和几何尺度；若考虑表面张力、坝面粗糙或空气影响，会增加相应无量纲数。"
  },
  {
    "id": "181103-material-extracted-0464",
    "type": "计算与分析题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 6,
    "diagnosis": "现有答案方法正确但未化出显式法向速度，且 (\nabla F) 处有多余逗号；需补充活动边界运动学条件和符号约定。",
    "afterScore": {
      "chars": 679,
      "sentenceCount": 6,
      "formulaCount": 53,
      "proofSignalCount": 13
    },
    "htmlUpdated": true,
    "boundaryNote": "若法向取反，(V_n) 符号随之取反；上式默认 (mathbf n) 指向 (F) 增大的方向，并要求 (\tan t,cot t) 有定义。"
  },
  {
    "id": "181103-material-extracted-0465",
    "type": "简答题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 6,
    "diagnosis": "当前答案给出了平移后的椭圆柱面，但偏结论型；需要补出随体坐标变换、物质面条件以及运动方向约定。",
    "afterScore": {
      "chars": 490,
      "sentenceCount": 8,
      "formulaCount": 33,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "题面未给半轴记号和具体平动方向；以上取运动方向为 (x) 轴。若方向另取，只需换成沿该方向的移动坐标。"
  },
  {
    "id": "181103-material-extracted-0481",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 8,
    "diagnosis": "当前答案有 Bernoulli 积分雏形，但收缩管中 (V) 增大、(p/\rho) 减小的部分仍偏口头；需要由连续方程和声速条件推出符号。",
    "afterScore": {
      "chars": 774,
      "sentenceCount": 10,
      "formulaCount": 59,
      "proofSignalCount": 10
    },
    "htmlUpdated": true,
    "boundaryNote": "本题按可压缩等熵细管流处理；结论依赖定常、无摩擦、无冲击、无质量力和准一维假设。"
  },
  {
    "id": "181103-material-extracted-0484",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 8,
    "diagnosis": "当前答案是结论型：只提到格林公式和侧壁无通量，没有展开边界积分、质量通量符号和题式 (c_1-c_2) 的来源。",
    "afterScore": {
      "chars": 660,
      "sentenceCount": 9,
      "formulaCount": 42,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "源题写“两断面间流体总质量为 (M)”，但公式量纲更像质量流量或单位时间动能通量；此处按题式取势降 (c_1-c_2)。"
  },
  {
    "id": "181103-material-extracted-0490",
    "type": "简答题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 9,
    "diagnosis": "当前答案基本正确，但 proof-depth 层面应显式从 (W=phi+ipsi) 匹配实部、虚部推出，而不是只给结果。",
    "afterScore": {
      "chars": 527,
      "sentenceCount": 7,
      "formulaCount": 36,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "(log z) 需选定支路，绕原点跨支路时体现环量；若教材采用相反的 (W=phi-ipsi) 约定，符号会相应改变。"
  },
  {
    "id": "181103-material-extracted-0492",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 9,
    "diagnosis": "当前答案有连续方程链条，但应明确二维可压缩流函数对应的是质量通量 ((\rho u,\rho v))，并澄清“定常”的必要/充分边界。",
    "afterScore": {
      "chars": 655,
      "sentenceCount": 7,
      "formulaCount": 60,
      "proofSignalCount": 15
    },
    "htmlUpdated": true,
    "boundaryNote": "严格地说，流函数存在推出的是 (partial\rho/partial t=0)，不单独推出 (u,v,p) 全部不随时变；反向需教材语境中的定常约定。"
  },
  {
    "id": "181103-material-extracted-0493",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 9,
    "diagnosis": "原答案方向正确，但加速度只写成量级结论，未把复速度、速度分量和随体加速度逐步算出。",
    "afterScore": {
      "chars": 601,
      "sentenceCount": 8,
      "formulaCount": 35,
      "proofSignalCount": 9
    },
    "htmlUpdated": true,
    "boundaryNote": "适用于除原点外的势流区域；若教材采用另一复速度符号约定，分量符号可整体调整，但速度、加速度大小结论不变。"
  },
  {
    "id": "181103-material-extracted-0503",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 10,
    "diagnosis": "现有答案只写“令流函数为常数并化简”，缺少从源汇复势到流线方程、再到速度模公式的代数过程。",
    "afterScore": {
      "chars": 687,
      "sentenceCount": 9,
      "formulaCount": 47,
      "proofSignalCount": 6
    },
    "htmlUpdated": true,
    "boundaryNote": "结论在三个奇点 (z=-a,0,a) 之外成立；若另采用 (2pi) 源强 convention，系数会随定义改变。"
  },
  {
    "id": "181103-material-extracted-0412",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 2,
    "diagnosis": "原答案引用恒等式可用，但 proof-depth 可补出恒等式来源，避免只靠一句公式跳到结论。",
    "afterScore": {
      "chars": 718,
      "sentenceCount": 7,
      "formulaCount": 35,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "只需 (mathbf n) 的大小为空间常量，不要求方向不变；若 (|mathbf n|) 非常量，右侧会多出 (\nabla(|mathbf n|^2/2)) 项。"
  },
  {
    "id": "181103-material-extracted-0422",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 2,
    "diagnosis": "现有答案基本正确，但可明确区分固定时刻流线方程与带初值的质点轨迹方程，并说明退化情形。",
    "afterScore": {
      "chars": 469,
      "sentenceCount": 8,
      "formulaCount": 46,
      "proofSignalCount": 14
    },
    "htmlUpdated": true,
    "boundaryNote": "题面结论“轨迹为抛物线”按非退化情形 (BC\ne0) 理解；退化常数取值会给出直线或退化抛物线。"
  },
  {
    "id": "181103-material-extracted-0425",
    "type": "证明题",
    "sourceMaterialTitle": "练习册",
    "sourcePage": 3,
    "diagnosis": "原答案只说“投影即得”，可补足基矢定义、点积投影和逆变换展开。",
    "afterScore": {
      "chars": 719,
      "sentenceCount": 7,
      "formulaCount": 21,
      "proofSignalCount": 7
    },
    "htmlUpdated": true,
    "boundaryNote": "本题是坐标基变换，无物理边界条件；公式依赖标准约定 (\theta) 自 (x) 轴逆时针计、(mathbf e_\theta) 指向 (\theta) 增大方向。"
  }
]
```
