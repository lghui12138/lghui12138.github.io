import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const defaultSourceDir = '/Users/kili/Downloads/CamScanner-260329192148203/精修输出';
const notesSource = process.env.FLUID_NOTES_MD || path.join(defaultSourceDir, '中国海洋大学流体力学笔记_逐页校录_当前最新版.md');
const examSource = process.env.FLUID_EXAM_MD || path.join('/Users/kili/Documents/Codex/2026-05-01/23-41-1-3-openclaw-2/work', 'latest-exam.md');

const now = '2026-05-01T23:59:00+08:00';
const knowledgeCategories = [
  ['运动学', ['欧拉', '拉格朗日', '流线', '迹线', '物质导数', '速度梯度', '涡量', '环量']],
  ['控制方程', ['连续方程', 'Euler', 'Navier', '动量', '能量', 'Bernoulli', 'Lagrange']],
  ['势流与复势', ['势流', '复势', '流函数', '速度势', '点源', '点涡', '偶极子', '圆柱绕流', '镜像']],
  ['黏性与管流', ['粘性', '黏性', 'Couette', 'Poiseuille', '平板', '圆管', '剪切', '雷诺']],
  ['边界层与湍流', ['边界层', '位移厚度', '动量厚度', '湍流', '雷诺应力', 'Prandtl']],
  ['自由面与实验', ['自由面', '表面张力', '波浪', '量纲', '相似', '实验', 'Froude', 'Strouhal']],
  ['综合复习', ['真题', '例题', '复习', '总结', '考试']]
];

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function normalizeText(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[（）【】\[\]{}《》“”"'‘’`·,，.。;；:：!?！？、/\\|_—\-]+/g, '')
    .trim()
    .toLowerCase();
}

function stripMathTicks(value) {
  return String(value || '').replace(/\$`([^`]+)`\$/g, '$$$1$$').replace(/`([^`]+)`/g, '$1');
}

function classifyKnowledge(text) {
  const haystack = normalizeText(text);
  const found = knowledgeCategories.find(([, words]) => words.some(word => haystack.includes(normalizeText(word))));
  return found ? found[0] : '综合复习';
}

function extractKeywords(text) {
  const pool = [
    '连续介质', '欧拉', '拉格朗日', '物质导数', '流线', '迹线', '连续方程', '散度', '涡量',
    '环量', 'Kelvin', 'Bernoulli', 'Lagrange', '动量方程', '能量方程', 'Navier-Stokes',
    '边界层', '位移厚度', '动量厚度', '雷诺数', '湍流', '雷诺应力', '管道流动', 'Couette',
    'Poiseuille', '势流', '速度势', '流函数', '复势', '点源', '点涡', '偶极子', '镜像法',
    '圆柱绕流', '自由面', '量纲分析', '相似准则'
  ];
  const haystack = normalizeText(text);
  return pool.filter(word => haystack.includes(normalizeText(word))).slice(0, 8);
}

function buildKnowledgeData() {
  const source = readText(notesSource).replace(/\r\n/g, '\n');
  const matches = [...source.matchAll(/^### 第\s*(\d+)(?:\s*[-–—]\s*\d+)?\s*(?:页|张图)(?:（[^）]+）)?[:：]\s*(.+)$/gm)];
  const points = matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : source.length;
    const markdown = source.slice(start, end).trim();
    const title = match[2].trim();
    const full = `${title}\n${markdown}`;
    return {
      id: `page-${String(match[1]).padStart(3, '0')}`,
      page: Number(match[1]),
      title,
      category: classifyKnowledge(full),
      headings: [...markdown.matchAll(/^#{4,6}\s+(.+)$/gm)].map(item => item[1].trim()).slice(0, 12),
      keywords: extractKeywords(full),
      markdown
    };
  });

  const categoryCounts = Object.fromEntries(knowledgeCategories.map(([key]) => [key, 0]));
  points.forEach(point => {
    categoryCounts[point.category] = (categoryCounts[point.category] || 0) + 1;
  });

  const data = {
    version: 'round46-notes-2026-05-01',
    generatedAt: now,
    source: path.basename(notesSource),
    totalPages: points.length,
    categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
    points
  };

  writeJson(path.join(repoRoot, 'data/fluid-knowledge-points.json'), data);
  return data;
}

function splitExamArchive() {
  if (!fs.existsSync(examSource)) return null;
  const source = stripMathTicks(readText(examSource).replace(/\r\n/g, '\n'));
  const matches = [...source.matchAll(/^# 中国海洋大学\s+(\d{4})\s+年硕士研究生招生考试试题.*$/gm)];
  const years = matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : source.length;
    const markdown = source.slice(start, end).trim();
    const sections = [...markdown.matchAll(/^###\s+(.+)$/gm)].map((item, sectionIndex, arr) => {
      const sectionStart = item.index + item[0].length;
      const sectionEnd = sectionIndex + 1 < arr.length ? arr[sectionIndex + 1].index : markdown.length;
      return {
        title: item[1].trim(),
        markdown: markdown.slice(sectionStart, sectionEnd).trim()
      };
    });
    return {
      year: Number(match[1]),
      title: match[0].replace(/^#\s*/, ''),
      status: markdown.includes('未检出完整 2017 年试题页') ? 'source-missing' : 'available',
      sectionCount: sections.length,
      sections
    };
  });

  const archive = {
    version: 'source-exam-2000-2024-2026-05-01',
    generatedAt: now,
    source: path.basename(examSource),
    yearCount: years.length,
    years
  };
  writeJson(path.join(repoRoot, 'data/real-exam-source-index.json'), archive);
  return archive;
}

function answerCouette2007() {
  return [
    '设两板间距为 h，下板 y=0 静止，上板 y=h 以速度 u0 沿 x 方向运动，水平方向压强梯度为零。定常充分发展时 N-S 方程化为 d²u/dy²=0，结合 u(0)=0、u(h)=u0，得速度场 u(y)=u0 y/h，v=w=0。',
    '单位体积内能增加率等于黏性耗散率 Φ=μ(du/dy)²=μ(u0/h)²。',
    '流体作用在上平板上的切应力大小 τ=μu0/h，方向与上板运动方向相反；为了维持匀速，外力应沿运动方向施加同等大小的切应力。',
    '单位面积外力做功功率为 τu0=μu0²/h；单位面积板间流体柱总机械能耗散率为 ∫0^h μ(u0/h)²dy=μu0²/h，二者相等。'
  ].join('\n');
}

function answerWallSource2007() {
  return [
    '取平面边界为 y=0，点源位于 (0,h)，强度为 m。为满足固壁无穿透条件，在 (0,-h) 放置同强度镜像源，复势可写为 W(z)=m/(2π)ln(z-ih)+m/(2π)ln(z+ih)。',
    '壁面速度只有切向分量，u(x,0)=m x/[π(x²+h²)]，其绝对值在 |x|=h 处达到最大，|u|max=m/(2πh)。',
    '沿壁面用 Bernoulli 式 p(x)=p∞-ρu(x,0)²/2，因此压强最低点也在 |x|=h 处。',
    '单位宽度边界所受相对压力合力的量级为 ∫(p∞-p)dx=ρm²/(4πh)，方向表现为源与边界之间的吸引效应；写题时应先说明 h 为源到边界的距离。'
  ].join('\n');
}

const replacements = {
  'ocean-2007-07-couette-dissipation': {
    id: 'ocean-2007-07-couette-dissipation',
    title: '两个无限大的平行平板间充满着不可压缩的粘性流体。已知粘性系数和密度分别为 μ 和 ρ。设下板静止，上板以速度 u0 沿水平方向匀速移动。当流动达到定常状态后，求速度场、单位体积内能增加率、上平板切应力、外力做功功率与总机械能耗散率。',
    year: 2007,
    school: '中国海洋大学',
    score: 25,
    type: '计算题',
    category: '历年真题',
    tags: ['粘性', 'Couette流', '能量耗散', '流体力学基础'],
    options: [],
    answer: answerCouette2007(),
    explanation: '本题是零压强梯度平板 Couette 流。关键是把速度分布、剪应力、局部黏性耗散率和功率平衡放在同一条链上：线性速度剖面带来常剪应力，外力输入功率全部转化为黏性耗散。',
    question: '两个无限大的平行平板间充满着不可压缩的粘性流体。已知粘性系数和密度分别为 μ 和 ρ。设下板静止，上板以速度 u0 沿水平方向匀速移动。当流动达到定常状态后，求：1）速度场；2）流场中每单位体积内能增加率；3）流体作用在上平板上的切应力；4）拖动单位面积上平板外力做功功率和单位面积平板间流体柱内的总机械能耗散率。设水平方向压强梯度为零。',
    analysis: '看到“上板匀速、下板静止、无压强梯度”应立即识别 Couette 流。若题面未给两板间距，可设为 h 并在答案开头声明。'
  },
  'ocean-2007-08-wall-source': {
    id: 'ocean-2007-08-wall-source',
    title: '平面边界附近有强度为 m 的源，求边界上的速度分布及最大值点、压强分布及最小值点，并求源对单位宽度无限长边界的作用力。',
    year: 2007,
    school: '中国海洋大学',
    score: 30,
    type: '计算题',
    category: '历年真题',
    tags: ['势流', '镜像法', '点源', '压力'],
    options: [],
    answer: answerWallSource2007(),
    explanation: '固壁附近点源题的核心是镜像法：同强度镜像源保证 y=0 上法向速度为零，再由复速度读壁面切向速度，最后用 Bernoulli 方程把速度极值转成压强极值。',
    question: '平面边界附近有强度为 m 的源，求：1）边界上的速度分布及最大值点；2）边界上的压强分布及压强最小值点；3）设边界为单位宽度且无限长，求源对边界的作用力。',
    analysis: '若题目图中给源到边界距离，直接把本文中的 h 替换为图示距离；若图中符号不同，保持“镜像源 + 壁面速度 + Bernoulli + 压力积分”的链条不变。'
  },
  'ocean-2010-02-dipole-wall': {
    title: '偶极子由一对无限靠近的等强度点源和点汇构成。一个偶极子位于无限大平板边界上方 h 处，箭头指向点源且与 x 轴夹角为 α，求平板上方流场复势的镜像法表达。',
    year: 2010,
    school: '中国海洋大学',
    score: 4,
    type: '选择题',
    category: '历年真题',
    tags: ['势流', '镜像法', '偶极子', '复势'],
    options: [],
    answer: '为满足平板 y=0 的无穿透边界条件，应把原偶极子与关于平板的镜像偶极子叠加。若原偶极子位置为 z0=ih，偶极轴方向与 x 轴夹角为 α，可按偶极子复势 W_d(z)=κ e^{iα}/(z-z0) 与镜像项组合；判别选择题时重点检查：镜像点在 -ih，镜像偶极子的法向分量取相反、切向分量取相同，从而使壁面法向速度相互抵消。',
    explanation: '这道题不是普通点源镜像，而是偶极子镜像。偶极子的方向必须随镜像一起变换：平行于壁面的分量保持，垂直于壁面的分量反向。选项中只要镜像位置、方向和符号任一处错误，就不能满足固壁无穿透条件。',
    question: '偶极子由一对无限靠近的等强度点源和点汇构成。一个偶极子位于无限大平板边界上方 h 处，图中箭头代表偶极子，箭头指向点源，箭头与 x 轴夹角为 α。设流体无粘、不可压缩，忽略体力，则平板上方流场的复势为哪一项？',
    analysis: '按“原偶极子 + 镜像偶极子”判断选项，不要把点源镜像公式直接套到偶极子上。'
  },
  'ocean-2010-04-potential-flux': {
    title: '在 x-y 平面上的二维无旋流动，已知速度势 φ=2xy-y²，求流函数并说明两条流线之间的单位厚度体积通量。',
    year: 2010,
    school: '中国海洋大学',
    score: 4,
    type: '选择题',
    category: '历年真题',
    tags: ['势流', '速度势', '流函数', '流量'],
    options: [],
    answer: '由 φ=2xy-y² 得 u=∂φ/∂x=2y，v=∂φ/∂y=2x-2y。流函数满足 ∂ψ/∂y=u、∂ψ/∂x=-v，积分可取 ψ=y²-2xy+C。任意两条流线之间的单位厚度体积通量等于流函数差的绝对值 |Δψ|，与所取截面无关。',
    explanation: '二维不可压无旋流中，速度势与流函数互为共轭关系。流函数的差值就是两流线之间的体积流量，因此不需要沿不同截面重复做速度积分。',
    question: '在 x-y 平面上的二维无旋流动，已知速度势 φ=2xy-y²，求两条流线之间的单位厚度体积通量如何表示。',
    analysis: '先从速度势求 u、v，再由 Cauchy-Riemann 型关系积分出 ψ，最后用 Δψ 读流量。'
  },
  'ocean-2008-01-short-answer': {
    id: 'ocean-2008-01-short-answer',
    title: '2008 年简述题：Bernoulli 方程与 Lagrange 积分、连续介质假设、边界层理论、流动相似与 Re/St/Eu/Fr 的作用。',
    year: 2008,
    school: '中国海洋大学',
    score: 40,
    type: '简答题',
    category: '历年真题',
    tags: ['能量方程', '流体力学基础', '边界层', '实验与量纲'],
    options: [],
    question: '1. Bernoulli 方程与 Lagrange 积分的适用条件及物理意义。2. 连续介质假设的适用条件。3. 边界层理论。4. 流动相似应满足的条件；说明 Re、St、Eu、Fr 等无量纲数的作用。',
    answer: 'Bernoulli 方程适用于理想、不可压、定常、沿同一流线且体力有势的流动，表达机械能沿流线守恒；Lagrange 积分适用于无旋非定常理想流，把速度势的时间项、动能项、压强势和体力势联系起来。连续介质假设要求研究尺度远大于分子平均自由程，使密度、压强、速度等可视为连续场。边界层理论指出大 Reynolds 数绕流中黏性主要集中在壁面附近薄层，外部可近似理想势流，层内需满足无滑移并保留黏性剪切。流动相似要求几何、运动和动力相似；Re 比较惯性力与黏性力，St 表征非定常特征，Eu 表征压强力与惯性力，Fr 表征惯性力与重力。',
    explanation: '这组简述题覆盖基础概念、能量积分、边界层和量纲相似，是考纲骨架题。答题时要写清适用条件，不要只背公式。',
    analysis: '可以按“条件 → 方程/定义 → 物理意义 → 常见失分点”的顺序写。'
  },
  'ocean-2008-02-acceleration-data': {
    id: 'ocean-2008-02-acceleration-data',
    title: '2008 年二维非定常流场离散速度数据：求 t=0、(0,0) 处流体质点在 x、y 方向上的加速度分量。',
    year: 2008,
    school: '中国海洋大学',
    score: 20,
    type: '计算题',
    category: '历年真题',
    tags: ['物质导数', '流线轨迹', '流体力学基础'],
    options: [],
    question: 't>0 时刻测得二维非定常流场离散速度数据：在 (0,0) 处 u=20,v=10；(1,0) 处 u=22,v=15；(0,1) 处 u=14,v=5。另有同一点附近时间差分数据：t=0 时 u=20,v=10，t=1/2 时 u=30,v=10。求 t=0、(0,0) 处流体质点在 x,y 两方向上的加速度分量。',
    answer: '用物质导数 a_x=∂u/∂t+u∂u/∂x+v∂u/∂y，a_y=∂v/∂t+u∂v/∂x+v∂v/∂y。差分得 ∂u/∂t=(30-20)/(1/2)=20，∂v/∂t=0；∂u/∂x=22-20=2，∂u/∂y=14-20=-6；∂v/∂x=15-10=5，∂v/∂y=5-10=-5。代入 (u,v)=(20,10)，得 a_x=20+20×2+10×(-6)=0，a_y=0+20×5+10×(-5)=50。',
    explanation: '这题考物质导数的局部项与对流项。离散数据只给近邻点，按一阶差分近似空间导数和时间导数即可。',
    analysis: '最常见错误是只算 ∂u/∂t、∂v/∂t，漏掉 u∂/∂x+v∂/∂y 的对流加速度。'
  },
  'ocean-2008-03-potential-stream': {
    id: 'ocean-2008-03-potential-stream',
    title: '2008 年速度场 u=x²-y²-x, v=-2xy+y, w=0：判断不可压缩和无旋，并求速度势函数与流函数。',
    year: 2008,
    school: '中国海洋大学',
    score: 20,
    type: '计算题',
    category: '历年真题',
    tags: ['势流', '速度势', '流函数', '流线轨迹'],
    options: [],
    question: '已知流场 u=x²-y²-x, v=-2xy+y, w=0。求：1）该流动是否不可压缩；2）该流动是否无旋；3）若条件满足，求速度势函数与流函数。',
    answer: '散度 ∂u/∂x+∂v/∂y=(2x-1)+(-2x+1)=0，故不可压缩。二维涡量 ω_z=∂v/∂x-∂u/∂y=(-2y)-(-2y)=0，故无旋。速度势由 ∂φ/∂x=u 积分得 φ=x³/3-xy²-x²/2+f(y)，再由 ∂φ/∂y=v 得 f′(y)=y，所以 φ=x³/3-xy²-x²/2+y²/2+C。流函数满足 ∂ψ/∂y=u、∂ψ/∂x=-v，可取 ψ=(x²-x)y-y³/3+C。',
    explanation: '不可压缩看散度，无旋看旋度；二者满足后，可分别积分得到速度势和流函数，并用另一个速度分量校正常数函数。',
    analysis: '积分时不要把常数写成普通常数，应先保留 f(y) 或 g(x)，再由另一分量确定。'
  },
  'ocean-2008-04-tube-continuity': {
    id: 'ocean-2008-04-tube-continuity',
    title: '2008 年细管自然坐标连续方程证明：∂(ρσ)/∂t+∂(ρσv)/∂s=0。',
    year: 2008,
    school: '中国海洋大学',
    score: 20,
    type: '证明题',
    category: '历年真题',
    tags: ['连续方程', '控制体', '流体力学基础'],
    options: [],
    question: '流体在细管中流动，沿自然坐标 s 取一段微元，截面积为 σ，流体密度为 ρ，轴向速度为 v。证明 ∂(ρσ)/∂t+∂(ρσv)/∂s=0。',
    answer: '沿细管取长度 ds 的微元控制体，其质量为 ρσ ds。质量守恒写成：控制体内质量变化率 + 净流出质量流率 =0，即 ∂(ρσ ds)/∂t + [(ρσv)|_{s+ds}-(ρσv)|_s]=0。两边除以 ds 并令 ds→0，得 ∂(ρσ)/∂t+∂(ρσv)/∂s=0。',
    explanation: '这是三维连续方程在细长管束/自然坐标下的积分平均形式。截面积 σ 可以随 s 和 t 变化，因此必须放进时间项与通量项。',
    analysis: '证明题要清楚写出微元质量、入口/出口质量流率以及极限过程。'
  }
};

function applyQuestionPatch(q) {
  const id = String(q.id || '');
  const titleNorm = normalizeText(q.title || q.question);

  if (id === 'ocean-2006-51' || (titleNorm.includes('两个无限大的平行平板间充满着不可压缩的粘性流体') && titleNorm.includes('上板以速度'))) {
    return { ...q, ...replacements['ocean-2007-07-couette-dissipation'] };
  }
  if (id === 'ocean-2006-57' || titleNorm.includes('平面边界附近有强度为m的源')) {
    return { ...q, ...replacements['ocean-2007-08-wall-source'] };
  }
  if (id === 'ocean-2010-05' || titleNorm.includes('偶极子由一对无限靠近')) {
    return { ...q, id: q.id || 'ocean-2010-02-dipole-wall', ...replacements['ocean-2010-02-dipole-wall'] };
  }
  if (id === 'ocean-2010-11' || (titleNorm.includes('二维无旋流动') && titleNorm.includes('速度势'))) {
    return { ...q, id: q.id || 'ocean-2010-04-potential-flux', ...replacements['ocean-2010-04-potential-flux'] };
  }
  if (id === 'ocean-2006-62' || titleNorm === normalizeText('中国海洋大学 2007 年硕士研究生招生考试试题')) {
    return { ...q, ...replacements['ocean-2008-01-short-answer'] };
  }
  if (id.startsWith('ocean-2006-') && [
    '体积流量和质量流量都守恒',
    '只有体积流量守恒',
    '已知地中海含盐分比黑海大',
    '理想不可压缩流体做平面无旋运动则其势函数',
    '流体可以承受切向应力而保持静止',
    '流体静止时只有法向应力没有切向应力',
    '流体静止时不能承受法向应力',
    '流体静止时不能承受任何力',
    '用euler观点写出下列情况下流体密度',
    '一维收缩管内的不可压缩流动',
    '已知某二维流动速度场ux',
    '以及t0时刻通过该点的流体质点的轨迹方程',
    '文托利管测流'
  ].some(pattern => titleNorm.includes(pattern))) {
    return { ...q, year: 2007, school: '中国海洋大学' };
  }
  return q;
}

function isBadQuestion(q) {
  const blob = JSON.stringify(q);
  return !String(q.question || q.title || q.stem || q.content || '').trim()
    || !String(q.answer || '').trim()
    || !String(q.explanation || '').trim()
    || /待完善|暂无|需完善|TODO|待补|未提供|内容不完整|标题待补/.test(blob);
}

function patchQuestionBank(file) {
  const full = path.join(repoRoot, 'question-banks', file);
  if (!fs.existsSync(full)) return { file, changed: false, count: 0, bad: 0 };
  const parsed = JSON.parse(readText(full));
  const array = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.data || []);
  if (!Array.isArray(array)) return { file, changed: false, count: 0, bad: 0 };

  let changed = false;
  const patched = array.map((q) => {
    const next = applyQuestionPatch(q);
    if (JSON.stringify(next) !== JSON.stringify(q)) changed = true;
    return next;
  });

  if (file === '真题_中国海洋大学_2000-2024_fixed.json') {
    for (const key of ['ocean-2008-02-acceleration-data', 'ocean-2008-03-potential-stream', 'ocean-2008-04-tube-continuity']) {
      if (!patched.some(q => q.id === key)) {
        patched.push(replacements[key]);
        changed = true;
      }
    }
  }

  if (changed) {
    if (Array.isArray(parsed)) {
      writeJson(full, patched);
    } else if (parsed.questions) {
      parsed.questions = patched;
      writeJson(full, parsed);
    } else {
      parsed.data = patched;
      writeJson(full, parsed);
    }
  }

  return { file, changed, count: patched.length, bad: patched.filter(isBadQuestion).length };
}

function patchAllQuestionBanks() {
  const bankDir = path.join(repoRoot, 'question-banks');
  const files = fs.readdirSync(bankDir).filter(file => file.endsWith('.json'));
  const results = files.map(patchQuestionBank);
  return results;
}

function updateQuestionBankIndex() {
  const indexPath = path.join(repoRoot, 'question-banks/index.json');
  const index = JSON.parse(readText(indexPath));
  const questionBanks = index.questionBanks || [];

  for (const bank of questionBanks) {
    const file = bank.filename && path.join(repoRoot, 'question-banks', bank.filename);
    if (file && fs.existsSync(file)) {
      const parsed = JSON.parse(readText(file));
      const questions = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.data || []);
      bank.questionCount = questions.length;
      bank.count = questions.length;
    }
    if (bank.category === '真题' || /真题/.test(bank.filename || '')) {
      bank.recommended = bank.filename === '真题_中国海洋大学_2000-2024_fixed.json';
      if (bank.recommended) {
        delete bank.archived;
        bank.priority = 1;
        bank.name = '中国海洋大学真题集（2000-2024 精修主库）';
        bank.description = '2000-2024 年中国海洋大学 803 流体力学真题精修主库，已补 2007/2008 年缺口与残留占位题，按真实 year/type/tags 归档。';
        bank.lastUpdated = now;
      } else {
        bank.archived = true;
      }
    }
  }

  index.lastUpdated = now;
  index.real = questionBanks
    .filter(bank => bank.category === '真题' && bank.recommended)
    .map(bank => ({ file: bank.filename, intro: bank.description, count: bank.count }));
  index.chapter = questionBanks
    .filter(bank => bank.filename && bank.filename.startsWith('分类_'))
    .map(bank => ({ file: bank.filename, intro: bank.description || '', count: bank.count }));
  index.wrong = questionBanks
    .filter(bank => bank.category === '易错题')
    .map(bank => ({ file: bank.filename, intro: bank.description || '', count: bank.count }));

  writeJson(indexPath, index);
  return index;
}

function knowledgePageHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <style data-auth-boot>html[data-auth-pending="1"] body{visibility:hidden!important;opacity:0!important}[v-cloak]{display:none!important}</style>
  <script data-auth-boot>document.documentElement.setAttribute('data-auth-pending','1');</script>
  <script src="/js/security/auth-guard.js"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>流体力学知识点全库</title>
  <script>
    window.MathJax = {
      tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']], processEscapes: true },
      options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'] }
    };
  </script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  <style>
    :root{--bg:#f5f7fb;--panel:#fff;--ink:#172033;--muted:#667085;--line:#d9e1ec;--blue:#1f78d1;--green:#17805a;--amber:#b7791f;--rose:#b4235a}
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.65}
    .top{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.94);border-bottom:1px solid var(--line);backdrop-filter:blur(16px)}
    .top-inner{max-width:1180px;margin:0 auto;padding:14px 20px;display:flex;gap:16px;align-items:center;justify-content:space-between}
    .brand{font-weight:800;font-size:18px}
    .nav{display:flex;gap:10px;flex-wrap:wrap}
    .nav a{color:var(--blue);text-decoration:none;font-weight:700;font-size:14px}
    .wrap{max-width:1180px;margin:0 auto;padding:28px 20px 56px}
    .hero{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:22px;align-items:stretch;margin-bottom:22px}
    .hero-main,.panel{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:22px;box-shadow:0 10px 30px rgba(15,23,42,.06)}
    h1{font-size:32px;line-height:1.18;margin:0 0 10px}
    .sub{color:var(--muted);margin:0;max-width:760px}
    .stats{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
    .stat{border:1px solid var(--line);border-radius:8px;padding:14px;background:#fbfcff}
    .stat b{display:block;font-size:24px}
    .stat span{color:var(--muted);font-size:13px}
    .tools{display:grid;grid-template-columns:minmax(0,1fr) 190px;gap:12px;margin-bottom:18px}
    input,select{width:100%;border:1px solid var(--line);border-radius:8px;padding:12px 14px;background:white;color:var(--ink);font-size:15px}
    .layout{display:grid;grid-template-columns:260px minmax(0,1fr);gap:20px}
    .side{position:sticky;top:78px;align-self:start}
    .cat{display:flex;justify-content:space-between;gap:10px;width:100%;border:1px solid var(--line);background:white;border-radius:8px;padding:10px 12px;margin-bottom:8px;cursor:pointer;text-align:left;color:var(--ink);font-weight:700}
    .cat.active{border-color:var(--blue);background:#eef6ff;color:#0f5ca8}
    .cat span:last-child{color:var(--muted);font-weight:600}
    .cards{display:grid;gap:14px}
    .card{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:20px;box-shadow:0 8px 24px rgba(15,23,42,.05)}
    .card-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px}
    .card h2{margin:0;font-size:22px;line-height:1.25}
    .badge{display:inline-flex;align-items:center;border-radius:999px;padding:5px 10px;background:#eef6ff;color:#0f5ca8;font-weight:700;font-size:12px;white-space:nowrap}
    .chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px}
    .chip{border:1px solid var(--line);border-radius:999px;padding:4px 9px;color:var(--muted);font-size:12px;background:#fbfcff}
    .content h4{font-size:17px;margin:18px 0 8px;color:#111827}
    .content h5,.content h6{font-size:15px;margin:14px 0 6px;color:#344054}
    .content p{margin:8px 0}
    .content ul,.content ol{padding-left:22px;margin:8px 0}
    .formula{overflow-x:auto;border:1px solid var(--line);border-radius:8px;background:#fbfcff;padding:12px 14px;margin:12px 0}
    code{background:#eef2f7;border-radius:5px;padding:1px 4px}
    pre{overflow-x:auto;background:#111827;color:white;border-radius:8px;padding:12px}
    .empty{padding:28px;text-align:center;color:var(--muted)}
    mark{background:#fff0b8;padding:0 2px;border-radius:3px}
    @media(max-width:860px){.hero,.layout,.tools{grid-template-columns:1fr}.side{position:static}.top-inner{align-items:flex-start;flex-direction:column}.stats{grid-template-columns:repeat(2,1fr)}h1{font-size:26px}}
  </style>
</head>
<body>
  <header class="top">
    <div class="top-inner">
      <div class="brand">流体力学知识点全库</div>
      <nav class="nav">
        <a href="../index-complete.html">返回首页</a>
        <a href="./real-exams-dynamic.html">历年真题</a>
        <a href="./practice-dynamic.html">题库练习</a>
      </nav>
    </div>
  </header>
  <main class="wrap">
    <section class="hero">
      <div class="hero-main">
        <h1>按 round46 精修笔记生成的知识点母库</h1>
        <p class="sub">覆盖逐页校录笔记的 124 页内容，保留原公式、推导线索与真题复习口径。可按分类和关键词检索，再跳到真题页练对应题。</p>
      </div>
      <aside class="panel">
        <div class="stats">
          <div class="stat"><b id="statPages">0</b><span>页知识点</span></div>
          <div class="stat"><b id="statCats">0</b><span>知识分类</span></div>
          <div class="stat"><b id="statShown">0</b><span>当前显示</span></div>
          <div class="stat"><b id="statSource">round46</b><span>精修来源</span></div>
        </div>
      </aside>
    </section>
    <section class="tools">
      <input id="search" type="search" placeholder="搜索知识点、公式、关键词，例如：物质导数、边界层、复势、Bernoulli">
      <select id="sort">
        <option value="page">按页码排序</option>
        <option value="title">按标题排序</option>
      </select>
    </section>
    <section class="layout">
      <aside class="side">
        <div id="categories"></div>
      </aside>
      <section>
        <div id="cards" class="cards"></div>
      </section>
    </section>
  </main>
  <script>
    const state={data:null,category:'全部',query:'',sort:'page'};
    const esc=(s)=>String(s??'').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function inline(md){return esc(md).replace(/\\*\\*([^*]+)\\*\\*/g,'<strong>$1</strong>').replace(/\\\`([^\\\`]+)\\\`/g,'<code>$1</code>');}
    function renderMarkdown(markdown){
      const lines=String(markdown||'').split('\\n');
      const out=[]; let list=null; let para=[]; let fence=null;
      const flushPara=()=>{if(para.length){out.push('<p>'+inline(para.join(' '))+'</p>');para=[];}};
      const closeList=()=>{if(list){out.push('</'+list+'>');list=null;}};
      for(const raw of lines){
        const line=raw.trimEnd();
        const fenceMatch=line.match(/^\\\`\\\`\\\`(.*)$/);
        if(fenceMatch){
          flushPara(); closeList();
          if(fence!==null){
            const body=fence.body.join('\\n');
            out.push(fence.lang==='math'?'<div class="formula">$$'+esc(body)+'$$</div>':'<pre><code>'+esc(body)+'</code></pre>');
            fence=null;
          }else{
            fence={lang:fenceMatch[1].trim(),body:[]};
          }
          continue;
        }
        if(fence){fence.body.push(line);continue;}
        if(!line.trim()){flushPara();closeList();continue;}
        const h=line.match(/^(#{4,6})\\s+(.+)$/);
        if(h){flushPara();closeList();out.push('<h'+h[1].length+'>'+inline(h[2])+'</h'+h[1].length+'>');continue;}
        const bullet=line.match(/^[-*]\\s+(.+)$/);
        if(bullet){flushPara();if(list!=='ul'){closeList();out.push('<ul>');list='ul';}out.push('<li>'+inline(bullet[1])+'</li>');continue;}
        const ordered=line.match(/^\\d+[.)、]\\s+(.+)$/);
        if(ordered){flushPara();if(list!=='ol'){closeList();out.push('<ol>');list='ol';}out.push('<li>'+inline(ordered[1])+'</li>');continue;}
        para.push(line.trim());
      }
      flushPara(); closeList();
      return out.join('');
    }
    function markText(html){
      const q=state.query.trim();
      if(!q)return html;
      const safe=q.split('').map(ch=>'\\\\^$.*+?()[]{}|'.includes(ch)?'\\\\'+ch:ch).join('');
      return html.replace(new RegExp('('+safe+')','gi'),'<mark>$1</mark>');
    }
    function filtered(){
      let points=[...state.data.points];
      if(state.category!=='全部')points=points.filter(p=>p.category===state.category);
      if(state.query.trim()){
        const q=state.query.trim().toLowerCase();
        points=points.filter(p=>[p.title,p.category,(p.keywords||[]).join(' '),(p.headings||[]).join(' '),p.markdown].join(' ').toLowerCase().includes(q));
      }
      points.sort(state.sort==='title'?(a,b)=>a.title.localeCompare(b.title,'zh'):(a,b)=>a.page-b.page);
      return points;
    }
    function renderCategories(){
      const host=document.getElementById('categories');
      const rows=[{name:'全部',count:state.data.totalPages},...state.data.categories];
      host.innerHTML=rows.map(c=>'<button class="cat '+(state.category===c.name?'active':'')+'" data-cat="'+esc(c.name)+'"><span>'+esc(c.name)+'</span><span>'+c.count+'</span></button>').join('');
      host.querySelectorAll('.cat').forEach(btn=>btn.addEventListener('click',()=>{state.category=btn.dataset.cat;render();}));
    }
    function renderCards(){
      const host=document.getElementById('cards');
      const points=filtered();
      document.getElementById('statShown').textContent=points.length;
      if(!points.length){host.innerHTML='<div class="card empty">没有匹配的知识点。</div>';return;}
      host.innerHTML=points.map(p=>'<article class="card" id="'+p.id+'"><div class="card-head"><div><h2>第 '+p.page+' 页：'+markText(esc(p.title))+'</h2><div class="chips">'+(p.keywords||[]).map(k=>'<span class="chip">'+esc(k)+'</span>').join('')+'</div></div><span class="badge">'+esc(p.category)+'</span></div><div class="content">'+markText(renderMarkdown(p.markdown))+'</div></article>').join('');
      if(window.MathJax?.typesetPromise) window.MathJax.typesetPromise();
    }
    function render(){renderCategories();renderCards();}
    async function init(){
      const res=await fetch('../data/fluid-knowledge-points.json',{cache:'no-store'});
      state.data=await res.json();
      document.getElementById('statPages').textContent=state.data.totalPages;
      document.getElementById('statCats').textContent=state.data.categories.length;
      document.getElementById('search').addEventListener('input',e=>{state.query=e.target.value;renderCards();});
      document.getElementById('sort').addEventListener('change',e=>{state.sort=e.target.value;renderCards();});
      render();
    }
    init().catch(err=>{document.getElementById('cards').innerHTML='<div class="card empty">知识点数据加载失败：'+esc(err.message)+'</div>';});
  </script>
</body>
</html>
`;
}

function writeKnowledgePage() {
  fs.writeFileSync(path.join(repoRoot, 'modules/knowledge-detail.html'), knowledgePageHtml());
}

function patchRealExamLoader() {
  const file = path.join(repoRoot, 'modules/real-exams-dynamic.html');
  let html = readText(file);
  const needle = "const realExamFiles = index.questionBanks.filter(bank => bank.category === '真题' || bank.filename.includes('真题') ); console.log('📋 找到真题文件:', realExamFiles.map(f => f.filename));";
  const replacement = "const allRealExamFiles = index.questionBanks.filter(bank => bank.category === '真题' || bank.filename.includes('真题') ); const recommendedRealExamFiles = allRealExamFiles.filter(bank => bank.recommended || bank.filename === '真题_中国海洋大学_2000-2024_fixed.json'); const realExamFiles = recommendedRealExamFiles.length ? recommendedRealExamFiles : allRealExamFiles; console.log('📋 找到真题文件:', realExamFiles.map(f => f.filename));";
  if (html.includes(needle)) {
    html = html.replace(needle, replacement);
    fs.writeFileSync(file, html);
    return true;
  }
  return false;
}

function patchIndexLinks() {
  const file = path.join(repoRoot, 'index-complete.html');
  let html = readText(file);
  const card = `<a class="mod" href="/modules/knowledge-detail.html">
<div class="mod-i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/></svg></div>
<h3>流体力学知识点全库</h3><p>按 round46 精修笔记生成的 124 页知识点母库，支持检索、公式渲染和分类复习。</p>
<div class="tags"><span class="chip">124 页</span><span class="chip">round46</span></div>
<div class="arr">进入 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
</a>
`;
  if (!html.includes('/modules/knowledge-detail.html')) {
    const marker = '<a class="mod" href="/modules/real-exams-dynamic.html">\n<div class="mod-i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6';
    if (html.includes(marker)) {
      html = html.replace(marker, card + marker);
    }
    fs.writeFileSync(file, html);
    return true;
  }
  return false;
}

function writeHandoff(summary) {
  const doc = `# 站点内容补全交接

更新时间：2026-05-01 23:59 Asia/Shanghai

## 内容来源

- 笔记母本：${path.basename(notesSource)}
- 真题母本：${path.basename(examSource)}
- 主站仓库：${repoRoot}

## 已整理进站点的内容

- 知识点：生成 data/fluid-knowledge-points.json，共 ${summary.knowledge.totalPages} 页，来源为 round46 逐页校录笔记。
- 知识点页面：重建 modules/knowledge-detail.html，支持分类、搜索、公式渲染。
- 真题主库：修补 question-banks/真题_中国海洋大学_2000-2024_fixed.json，主库现为 ${summary.fixedCount} 题，残留占位 ${summary.fixedBad} 条。
- 年份缺口：补入 2008 年 4 组原题；2017 年按源稿说明保留为“原始资料未检出完整页”，未伪造题面。
- 真题入口：modules/real-exams-dynamic.html 只加载推荐主库，避免 cleaned/comprehensive/fixed 多库重复混入。
- 索引：question-banks/index.json 已同步 count/recommended，并补上旧页面需要的 real/chapter/wrong 数组。

## 复跑方式

    cd ${repoRoot}
    node tools/build-site-content.mjs
    node tools/validate-site-content.mjs

若换机器，设置这两个环境变量即可替换源文件位置：

    export FLUID_NOTES_MD=/path/to/中国海洋大学流体力学笔记_逐页校录_当前最新版.md
    export FLUID_EXAM_MD=/path/to/latest-exam.md

## 推送

当前变更可以直接提交并推送到 GitHub Pages 仓库：

    git add .
    git commit -m "Restore and refresh fluid mechanics study content"
    git push origin main
`;
  fs.writeFileSync(path.join(repoRoot, 'docs/site-content-handoff.md'), doc);
}

function main() {
  const knowledge = buildKnowledgeData();
  splitExamArchive();
  const bankResults = patchAllQuestionBanks();
  const index = updateQuestionBankIndex();
  writeKnowledgePage();
  const loaderPatched = patchRealExamLoader();
  const indexPatched = patchIndexLinks();
  const fixedResult = bankResults.find(row => row.file === '真题_中国海洋大学_2000-2024_fixed.json');
  writeHandoff({
    knowledge,
    fixedCount: fixedResult?.count || 0,
    fixedBad: fixedResult?.bad || 0
  });
  console.log(JSON.stringify({
    knowledgePages: knowledge.totalPages,
    patchedBanks: bankResults.filter(row => row.changed).map(row => row.file),
    fixed: fixedResult,
    realExamLoaderPatched: loaderPatched,
    indexPatched,
    indexQuestionBanks: index.questionBanks?.length || 0
  }, null, 2));
}

main();
