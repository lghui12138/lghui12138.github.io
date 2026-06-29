export const round570 = {
  round: 570,
  version: 'round570-answer-depth-eighth-pass-proof-ui-sync-20260629',
  previousVersion: 'round569-answer-depth-seventh-pass-workbench-proof-sync-20260629',
  generatedAt: '2026-06-29T07:25:00.000Z',
  realExamPreviousAnswerDepthRows: 110,
  realExamCumulativeAnswerDepthRows: 122,
  proofDepthRows181103: 422,
  referencePracticeRows181103: 400,
  sourceClueOnlyRows181103: 122,
  strictAnswerPdfProofRows: 0
};

export const realExamUpgrades = [
  {
    id: 'ocean-2010-01-02',
    diagnosis: '当前答案只给出“选 C”和一句镜像法结论，证明链太短：没有写出固壁边界条件、偶极子方向分解、镜像偶极子同向/反向规则，也没有说明为什么 A/B/D 不成立。',
    referenceAnswer: String.raw`选 C。

条件：平板为不可穿透直固壁，可取为 \(y=0\)；偶极子位于 \(z=ib\)，方向与 \(x\) 轴夹角为 \(\alpha\)，箭头指向点源；流体无粘、不可压缩，平板上方流动可用势流复势表示。固壁边界的核心要求是平板上法向速度为零，等价于在 \(z=x\) 为实数时流函数 \(\psi\) 为常数。

把偶极子方向分解为平行壁面的分量和法向壁面的分量。平行壁面分量大小为 \(\cos\alpha\)，镜像偶极子与原偶极子同向；法向壁面分量大小为 \(\sin\alpha\)，镜像偶极子与原偶极子反向。于是上半平面总复势可写为
\[
W=-\frac{ml}{2\pi}\left[\cos\alpha\left(\frac{1}{z-ib}+\frac{1}{z+ib}\right)+i\sin\alpha\left(\frac{1}{z-ib}-\frac{1}{z+ib}\right)\right].
\]
利用
\[
\frac{1}{z-ib}+\frac{1}{z+ib}=\frac{2z}{z^2+b^2},\qquad
\frac{1}{z-ib}-\frac{1}{z+ib}=\frac{2ib}{z^2+b^2},
\]
得到
\[
W=-\frac{ml}{\pi}\frac{z\cos\alpha-b\sin\alpha}{z^2+b^2}.
\]
这正是 C。

再检查边界：当 \(z=x\) 为实数时，\(z^2+b^2\) 和 \(z\cos\alpha-b\sin\alpha\) 都为实数，所以 \(W\) 在平板上为实函数，\(\psi=\text{常数}\)，满足无穿透条件。A 把方向直接写成 \(ze^{i\alpha}\)，一般会使平板上的 \(W\) 带有随 \(x\) 变化的虚部，壁面条件不对；B 只保留原偶极子 \((z-bi)^{-1}\)，缺少镜像奇点；D 只含法向部分且同样缺少完整镜像组合，也不能表示一般角度 \(\alpha\) 的偶极子。因此应选 C。`,
    boundaryNote: '本只读材料中未见原卷题图和原答案 PDF 的逐字 span/bbox/hash 证明；当前记录 strictAnswerPdfProof=false。以上为按题干文字、选项和固壁镜像法给出的派生参考答案。'
  },
  {
    id: 'ocean-2007-03-03',
    diagnosis: '当前答案“定常运动表示 Euler 场量不显含时间”方向正确，但过短：没有从一般密度场写起，也没有区分固定空间点的时间导数与随体导数。',
    referenceAnswer: String.raw`在 Euler 描述下，密度场一般写为
\[
\rho=\rho(x,y,z,t).
\]
定常运动的定义是：在固定空间点观察，流场量不显含时间。因此速度、压强、密度等场量均满足相应的局地时间导数为零，特别是
\[
\frac{\partial \rho}{\partial t}=0.
\]
所以定常运动时密度场应写为
\[
\rho=\rho(x,y,z).
\]

需要注意，\(\rho=\rho(x,y,z)\) 仍允许空间分布不均匀，即 \(\nabla\rho\) 可以不为零；它只说明固定点处密度不随时间变化，不说明各点密度相同。若观察某一流体质点，其密度变化率为
\[
\frac{D\rho}{Dt}=\frac{\partial\rho}{\partial t}+\mathbf{v}\cdot\nabla\rho.
\]
在定常运动中第一项为零，但若 \(\mathbf{v}\cdot\nabla\rho\ne0\)，随体密度仍可变化。只有再加上不可压缩或均质等条件时，才可能进一步得到 \(D\rho/Dt=0\) 或 \(\rho=\rho_0=\text{常数}\)。

结论：定常运动对应的密度表达式是 \(\rho=\rho(x,y,z)\)，并满足 \(\partial\rho/\partial t=0\)；它本身不等价于均质流体，也不等价于不可压缩流体。`,
    boundaryNote: '本题为真题组题拆分后的第 3 小题，本只读材料未见原答案 PDF 逐字证明；当前记录 strictAnswerPdfProof=false。'
  },
  {
    id: 'ocean-2011-01-06',
    diagnosis: '现有答案选 B 的方向正确，但推导太薄：缺少旋转圆柱柱面速度公式、Bernoulli 判压强最大值、选项排除逻辑，也没有说明默认存在驻点这一边界条件。',
    referenceAnswer: String.raw`选 B。大雷诺数绕圆柱的外流通常按不可压、定常、无粘外部势流近似处理，旋转圆柱可等效为均匀来流、圆柱绕流偶极子和环流的叠加。在柱面 \(r=R\) 上无穿透，切向速度可写为
\[
q_\theta=-2V_\infty\sin\theta+R\Omega .
\]
符号只决定最大速度出现在哪一侧，不影响最大速度的大小。因此柱面流速最大值为
\[
|q_\theta|_{\max}=2V_\infty+R\Omega,
\]
而不是不旋转圆柱的 \(2V_\infty\)。

压强用同一外流中的 Bernoulli 式判断：
\[
p+\frac12\rho q^2=p_\infty+\frac12\rho V_\infty^2.
\]
压强最大对应速度最小；在真题常规默认的中等转速范围 \(R\Omega\le 2V_\infty\) 内，柱面上存在 \(q_\theta=0\) 的驻点，所以
\[
p_{\max}=p_\infty+\frac12\rho V_\infty^2.
\]

排除 A、C：它们的最大流速仍写成 \(2V_\infty\)，漏掉了旋转诱导环流速度 \(R\Omega\)。排除 C、D 的压强项：\(p_\infty+\frac12\rho V_\infty^2[1-(R\Omega/V_\infty)^2]\) 是把局部速度 \(R\Omega\) 代入 Bernoulli 得到的某点压强，不是最大压强。B 同时给出最大速度和驻点总压，故选 B。`,
    boundaryNote: '这是派生参考答案，不是 strictAnswerPdfProof。若允许强旋转 \(R\Omega>2V_\infty\) 且柱面无驻点，则最大压强要按最小速度另行修正。'
  },
  {
    id: 'ocean-2007-01-01',
    diagnosis: '现有答案基本正确，但作为名词解释还偏短：应补出代表性体积元、尺度条件、场变量连续化以及失效边界。',
    referenceAnswer: String.raw`连续介质假设是流体力学把微观分子体系转化为宏观场论模型的基本假设。它承认流体真实上由分子组成，但在研究尺度远大于分子平均自由程时，可取一个“足够小但仍含大量分子”的代表性流体微团：它相对管径、物体尺度等宏观长度很小，因而可看作一个空间点；同时它又远大于分子尺度，内部包含足够多分子，统计平均量稳定。

于是密度、压强、温度、速度等量可写成
\[
\rho(x,y,z,t),\quad p(x,y,z,t),\quad T(x,y,z,t),\quad \mathbf u(x,y,z,t)
\]
等连续场变量，并可对空间和时间求导。例如密度不是逐个分子质量的跳变值，而是代表性体积元上的平均值
\[
\rho\approx \frac{\Delta m}{\Delta V};
\]
速度也不是单个分子的热运动速度，而是流体微团的宏观平均速度。

这个假设使连续方程、Euler 方程、Navier-Stokes 方程和边界条件写成微分形式成为可能。它的适用判据常用 Knudsen 数
\[
Kn=\frac{\lambda}{L}
\]
表示，\(\lambda\) 为分子平均自由程，\(L\) 为宏观特征长度；\(Kn\) 很小时连续介质模型通常成立。若研究对象是稀薄气体、高空低压流、微纳尺度流动或分子尺度附近的局部结构，连续介质假设可能失效，需要用分子运动论、Boltzmann 方程或滑移边界等修正模型。`,
    boundaryNote: '本题是概念题，重点是写清“微观离散、宏观连续”的尺度桥接；当前仍属于派生参考答案。'
  },
  {
    id: 'ocean-2007-01-03',
    diagnosis: '现有答案方向正确，但仍偏名词标签化：只说“对应力比例相同”和列 Re、Fr、Eu、St，缺少从控制方程无量纲化推出相似准则的链条。',
    referenceAnswer: String.raw`流动动力学相似，是指模型流动与原型流动在几何相似和运动相似已经成立的基础上，对应点处各种主要力的比例相同，因此无量纲控制方程具有同一形式、同一组无量纲参数。第一层是几何相似：对应长度满足固定比例 \(L_m/L_p=\lambda\)，角度、外形、边界几何一致。第二层是运动相似：对应点速度方向相同，速度大小成固定比例，且用 \(x^*=x/L,\ t^*=tU/L,\ \mathbf v^*=\mathbf v/U\) 表示后，两流动的无量纲速度场相同。第三层才是动力相似：惯性力、黏性力、压力力、重力、非定常力等主控力之间的比值相同。

以不可压流动的 Navier-Stokes 方程为例，
\[
\rho\left(\frac{\partial\mathbf V}{\partial t}+\mathbf V\cdot\nabla\mathbf V\right)
=-\nabla p+\mu\nabla^2\mathbf V+\rho\mathbf g .
\]
取特征量 \(U,L,\Delta p\) 无量纲化，并除以惯性力尺度 \(\rho U^2/L\)，可得
\[
St\,\frac{\partial\mathbf V^*}{\partial t^*}
+\mathbf V^*\cdot\nabla^*\mathbf V^*
=-Eu\,\nabla^*p^*
+\frac1{Re}\nabla^{*2}\mathbf V^*
+\frac1{Fr^2}\mathbf g^* .
\]
其中
\[
Re=\frac{\rho UL}{\mu},\qquad
Fr=\frac{U}{\sqrt{gL}},\qquad
Eu=\frac{\Delta p}{\rho U^2},\qquad
St=\frac{L}{UT}.
\]
它们分别表示惯性力与黏性力、惯性力与重力、压力力与惯性力、非定常效应与对流惯性的相对大小。若存在自由面表面张力，还要考虑 \(We=\rho U^2L/\sigma\)；若可压缩，还要考虑 \(Ma=U/c\)。

由此可见，动力相似的判据不是机械地让所有准则数都相等，而是让实际控制该问题的主导准则数相等，并保持无量纲初始条件、边界条件一致。结论检查：若两个流动几何外形相似、无量纲速度场相似，并且主控的 \(Re,Fr,Eu,St\) 等相等，则对应点的力多边形相似，模型结果才可以按比例换算到原型；若只满足几何相似而主控数不同，只能说外形相似，不能说动力学相似。`,
    boundaryNote: '本站派生参考答案深度稿；不是 strictAnswerPdfProof。'
  },
  {
    id: 'ocean-2007-02-03',
    diagnosis: '现有答案选 A 正确，但推导太短：只分别断言势函数和流函数满足 Laplace 方程，未展开不可压条件如何作用于势函数、无旋条件如何作用于流函数。',
    referenceAnswer: String.raw`应选 A，即
\[
\nabla^2\Phi=0,\qquad \nabla^2\Psi=0.
\]
设平面速度场为 \(\mathbf V=(u,v)\)。平面无旋运动可引入速度势 \(\Phi\)，使
\[
u=\frac{\partial\Phi}{\partial x},\qquad
v=\frac{\partial\Phi}{\partial y},
\]
也就是 \(\mathbf V=\nabla\Phi\)。不可压缩条件为 \(\nabla\cdot\mathbf V=0\)，即
\[
\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}=0.
\]
代入速度势定义得
\[
\frac{\partial^2\Phi}{\partial x^2}+\frac{\partial^2\Phi}{\partial y^2}=0,
\]
因此 \(\nabla^2\Phi=0\)。

另一方面，对二维不可压流动可引入流函数 \(\Psi\)，按常用约定
\[
u=\frac{\partial\Psi}{\partial y},\qquad
v=-\frac{\partial\Psi}{\partial x}.
\]
这一定义自动满足连续方程，因为
\[
\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}
=\frac{\partial^2\Psi}{\partial x\partial y}
-\frac{\partial^2\Psi}{\partial y\partial x}=0.
\]
再看无旋条件，平面涡量为
\[
\omega_z=\frac{\partial v}{\partial x}-\frac{\partial u}{\partial y}.
\]
代入流函数定义得到
\[
\omega_z=-\frac{\partial^2\Psi}{\partial x^2}
-\frac{\partial^2\Psi}{\partial y^2}
=-\nabla^2\Psi.
\]
题设无旋，所以 \(\omega_z=0\)，故 \(\nabla^2\Psi=0\)。

物理意义分层看：\(\Phi\) 满足 Laplace 方程来自体积守恒，即不可压缩微团不发生体积膨胀或收缩；\(\Psi\) 满足 Laplace 方程来自无旋，即微团没有局部刚体转动。二者同为调和函数，所以等势线与流线构成正交网。结论检查：A 同时保留了不可压缩推出的 \(\nabla^2\Phi=0\) 和无旋推出的 \(\nabla^2\Psi=0\)；C 漏掉流函数的无旋约束，D 漏掉速度势的不可压约束，B 则与题设相反。`,
    boundaryNote: '按平面、不可压、无旋、无奇点区域内的常规势流结论作答；非 strictAnswerPdfProof。'
  },
  {
    id: 'ocean-2012-01-01',
    diagnosis: '现有答案方向正确，但偏简略；应补出 Reynolds 数作为无量纲判据、扰动/粗糙度等转捩条件，以及层流抛物线剖面和湍流时均丰满剖面的公式化对比。',
    referenceAnswer: String.raw`圆管内讨论层流向湍流转化时，通常以管径 \(D\)、截面平均速度 \(U\)、密度 \(\rho\) 和动力黏度 \(\mu\) 组成 Reynolds 数：
\[
Re=\frac{\rho UD}{\mu}.
\]
量纲检查为
\[
[\rho UD/\mu]=(ML^{-3})(LT^{-1})L/(ML^{-1}T^{-1})=1,
\]
所以 \(Re\) 是比较惯性效应与黏性效应的无量纲数。对光滑圆管中的充分发展内流，\(Re\) 较小时黏性作用能抑制扰动，流动保持层流；工程上常取 \(Re\approx2300\) 附近为临界量级，\(Re<2000\) 多为层流，\(Re>4000\) 多为湍流，中间为过渡区。严格说，转捩不只由 \(Re\) 决定，还受入口扰动、壁面粗糙度、振动和初始扰动强度影响。

层流时，在不可压 Newton 流体、定常、轴对称、充分发展、壁面无滑移条件下，圆管 Poiseuille 解为
\[
u(r)=u_{\max}\left(1-\frac{r^2}{R^2}\right)
=2U\left(1-\frac{r^2}{R^2}\right).
\]
速度剖面是抛物线，中心线速度最大，管壁速度为零。湍流时，瞬时速度有不规则脉动，通常比较时均速度剖面；由于湍流混合增强动量交换，管中心附近速度分布较平坦、剖面更丰满，近壁速度梯度大，可分为粘性底层、缓冲层和对数层，常写
\[
u^+=y^+,\qquad
u^+=\frac1\kappa\ln y^+ + B.
\]
结论检查：本题要同时答出转捩条件和速度剖面差别；不能只写“Re 大就湍流”，也不能把湍流瞬时脉动剖面误当成稳定抛物线。`,
    boundaryNote: '只读审稿参考答案；该 real-exam 条目现有边界仍是 derived/original-answer-PDF 未严格证明。'
  },
  {
    id: 'ocean-2012-01-03',
    diagnosis: '现有答案抓住了尺度判断，但可补成 Knudsen 数判据：连续介质假设的成立取决于分子平均自由程与问题特征长度的比值。',
    referenceAnswer: String.raw`连续介质假设是指：在研究尺度上，流体的速度、压强、密度、温度等宏观量可看作空间和时间中的连续函数，而不逐个追踪分子。其核心条件是特征长度 \(L\) 要远大于分子平均自由程 \(\lambda\)，常用 Knudsen 数
\[
Kn=\frac{\lambda}{L}
\]
判断。量纲检查为 \([Kn]=[\lambda]/[L]=1\)，因此 \(Kn\) 是无量纲尺度比。通常 \(Kn\ll1\)，特别是 \(Kn<0.01\) 时，经典连续介质模型较可靠；\(Kn\) 达到 0.1 或更大时，就会进入滑移、过渡或自由分子流范畴。

题设稀薄气体的分子自由程为米的量级，即 \(\lambda=O(1\,\mathrm m)\)。A 情况，人造卫星进入稀薄气体层时，卫星特征尺寸 \(L_{\rm sat}\) 往往也是米到十米量级，则
\[
Kn=\frac{\lambda}{L_{\rm sat}}
\]
可能为 \(O(1)\) 或至少不是远小于 1，分子碰撞不足以在卫星尺度上形成局部平衡，连续介质假设一般不成立，或只能作滑移/稀薄气体修正，不能直接套用普通无滑移 Navier-Stokes 模型。

B 情况，假想地球在这样的稀薄气体中运动，地球特征尺度 \(L_E\) 约为 \(10^6\) 到 \(10^7\,\mathrm m\)，
\[
Kn\approx 10^{-6}\sim 10^{-7},
\]
远小于 1，因此从地球整体绕流尺度看可近似看作连续介质。结论检查：同一种稀薄气体，对卫星可能不满足连续介质假设，对地球却可以满足；判断关键是 \(\lambda/L\)，不是“稀薄气体”四个字本身。`,
    boundaryNote: '只读审稿参考答案；该 real-exam 条目现有边界仍是 derived/original-answer-PDF 未严格证明。'
  },
  {
    id: 'ocean-2011-01-01',
    diagnosis: '现有结论选 B 正确，但解释偏短；应补出欧拉描述下物质导数分解、空间均匀的判据，并逐项排除 A、C、D。',
    referenceAnswer: String.raw`选 B。设欧拉描述速度场为 \(\mathbf V=\mathbf V(x,y,z,t)\)。空间均匀流动的判据是同一时刻各空间点速度相同，即速度对空间坐标的梯度为零：
\[
\nabla \mathbf V=0,
\qquad
\frac{\partial V_i}{\partial x_j}=0.
\]
欧拉加速度分解为
\[
\frac{D\mathbf V}{Dt}
=\frac{\partial\mathbf V}{\partial t}
+(\mathbf V\cdot\nabla)\mathbf V,
\]
其中 \((\mathbf V\cdot\nabla)\mathbf V\) 是对流加速度。因为空间均匀使所有空间导数为零，所以
\[
(\mathbf V\cdot\nabla)\mathbf V=0,
\]
故 B 必满足。

A 不必成立：若 \(\mathbf V=U(t)\mathbf i\)，流场仍空间均匀，但 \(D\mathbf V/Dt=(dU/dt)\mathbf i\) 可不为零。C 不必成立：\(\partial\mathbf V/\partial t=0\) 是定常流条件，空间均匀不排除整体随时间加速或改变方向。D 也不必成立：若 \(\mathbf V(t)\) 的方向随时间变，质点轨迹可弯曲；只有速度方向固定时轨迹才必为直线。本题是运动学判据题，没有固壁边界条件；若引入无滑移固壁，非零空间均匀速度场通常会与壁面条件冲突。`,
    boundaryNote: '真题拆题派生答案；当前材料未见 strictAnswerPdfProof。'
  },
  {
    id: 'ocean-2012-01-02',
    diagnosis: '现有答案方向正确，但应区分涡管定义、涡管强度在不同截面上的不变性，以及随流体运动时强度守恒所需的 Helmholtz/Kelvin 条件。',
    referenceAnswer: String.raw`涡量定义为
\[
\boldsymbol\omega=\nabla\times\mathbf V.
\]
涡线是在每一点都与 \(\boldsymbol\omega\) 相切的曲线，满足
\[
d\mathbf r\times\boldsymbol\omega=0,
\]
或在分量非零处写成
\[
\frac{dx}{\omega_x}=\frac{dy}{\omega_y}=\frac{dz}{\omega_z}.
\]
取一条不与涡线重合的封闭曲线 \(C\)，通过 \(C\) 上每一点作涡线，这些涡线围成的管状曲面称为涡管。

涡管强度是任一横截面 \(S\) 上的涡量通量：
\[
I=\int_S\boldsymbol\omega\cdot\mathbf n\,dS.
\]
\(\mathbf n\) 的方向决定 \(I\) 的正负；反向取法会使符号反号，但强度大小不变。由于
\[
\nabla\cdot\boldsymbol\omega
=\nabla\cdot(\nabla\times\mathbf V)=0,
\]
且涡管侧面由涡线组成，侧面满足 \(\boldsymbol\omega\cdot\mathbf n=0\)，所以对同一根涡管的两个截面 \(S_1,S_2\)，有
\[
\int_{S_1}\boldsymbol\omega\cdot\mathbf n\,dS
=\int_{S_2}\boldsymbol\omega\cdot\mathbf n\,dS.
\]
也就是说，涡管强度沿管不随截面改变。

若再问随时间保持守恒，则需流体为理想无黏流体、正压流体 \(p=p(\rho)\)，体力有势，涡管为随流体运动的物质涡管，且流场光滑、无涡量穿过侧边界。在这些条件下由 Kelvin 环量定理或 Helmholtz 涡定理，
\[
I=\int_S\boldsymbol\omega\cdot\mathbf n\,dS
=\oint_{\partial S}\mathbf V\cdot d\mathbf l
\]
随时间保持不变。若存在黏性扩散、斜压项 \(\nabla\rho\times\nabla p\ne0\)、非保守体力、壁面涡量产生或奇异间断，涡管强度守恒不能直接使用。`,
    boundaryNote: '真题拆题派生答案；当前材料未见 strictAnswerPdfProof。'
  },
  {
    id: 'ocean-2013-02-02',
    diagnosis: '现有答案定义正确但偏短，缺少从局部速度梯度分解推出涡度等于两倍微团自转角速度的证明链。',
    referenceAnswer: String.raw`设连续介质速度场 \(\mathbf u(\mathbf x,t)\) 在考察点邻域内一阶可微。取随微团平移的局部坐标 \(\mathbf r\)，邻近质点的相对速度可作一阶展开：
\[
\delta\mathbf u=L\mathbf r,\qquad L=\nabla\mathbf u.
\]
把速度梯度张量分解为对称部分和反对称部分：
\[
D=\frac{L+L^T}{2},\qquad
W=\frac{L-L^T}{2}.
\]
\(D\) 描述线变形和角变形，会改变微小线元的长度或夹角；\(W\) 对线元长度的一阶变化无贡献，只相当于局部刚体自旋。反对称张量可写成
\[
W\mathbf r=\boldsymbol\Omega\times\mathbf r,
\qquad
\boldsymbol\Omega=\frac12\nabla\times\mathbf u.
\]
因此涡度
\[
\boldsymbol\omega=\nabla\times\mathbf u=2\boldsymbol\Omega,
\]
它的物理意义就是流体微团局部刚体式自转角速度的两倍。涡度方向按右手定则给出局部旋转轴方向，大小 \(|\boldsymbol\omega|\) 表示局部自旋强弱的两倍。

在直角坐标中，
\[
\boldsymbol\omega=
\left(
\frac{\partial w}{\partial y}-\frac{\partial v}{\partial z},
\frac{\partial u}{\partial z}-\frac{\partial w}{\partial x},
\frac{\partial v}{\partial x}-\frac{\partial u}{\partial y}
\right).
\]
二维 \(x-y\) 流动中主要看
\[
\omega_z=\frac{\partial v}{\partial x}-\frac{\partial u}{\partial y},
\]
\(\omega_z>0\) 表示微团有逆时针自旋趋势。也可由 Stokes 定理理解：某方向涡度分量等于趋于零的微小面积上环量与面积之比，
\[
\boldsymbol\omega\cdot\mathbf n=\lim_{A\to0}\frac{\Gamma}{A}.
\]
因此涡度度量的是局部微团自旋或局部环量密度，而不是流线是否弯曲；流线绕弯并不必然有旋，涡度为零也不等于速度处处为零。结论：涡度既给出局部旋转轴方向，又给出局部自转强度，是速度场局部旋转性质的核心量。`,
    boundaryNote: '派生过程参考答案；要求速度场局部一阶可微并采用右手坐标约定。未提升 strictAnswerPdfProof。'
  },
  {
    id: 'ocean-2010-02-02',
    diagnosis: '现有答案抓住了边界层厚度和零压梯度平板通常不分离，但缺少边界层方程的尺度推导、壁面剪应力判据以及转捩与分离的边界区分。',
    referenceAnswer: String.raw`讨论对象是光滑半无限长平板、均匀来流 \(U_\infty\) 平行于平板、不可压牛顿流体、层流边界层且外缘压力梯度为零的情形。取 \(x\) 为离前缘的距离，\(y\) 为法向坐标，运动黏性系数为
\[
\nu=\frac{\mu}{\rho}.
\]
层流边界层内有连续方程
\[
\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}=0
\]
和零压梯度边界层动量方程
\[
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
=\nu\frac{\partial^2u}{\partial y^2},
\]
边界条件为壁面 \(u=v=0\)，外缘 \(u\to U_\infty\)。用尺度估计，惯性项量级约为 \(U_\infty^2/x\)，黏性扩散项量级约为 \(\nu U_\infty/\delta^2\)，二者平衡得到
\[
\delta\sim\sqrt{\frac{\nu x}{U_\infty}}.
\]
若按 \(u=0.99U_\infty\) 定义名义边界层厚度，Blasius 解给出
\[
\delta_{99}\approx 5\sqrt{\frac{\nu x}{U_\infty}}
=\frac{5x}{\sqrt{Re_x}},
\qquad Re_x=\frac{U_\infty x}{\nu}.
\]
位移厚度和动量厚度也分别与 \(\sqrt{\nu x/U_\infty}\) 同量级。因此厚度主要由下游距离、来流速度、运动黏性系数以及采用的厚度定义决定；真实实验中还会受来流扰动、壁面粗糙度、前缘形状和是否已转捩影响。

是否分离要看壁面剪应力
\[
\tau_w=\mu\left(\frac{\partial u}{\partial y}\right)_w
\]
是否降为零并反号。分离通常需要逆压梯度 \(dp_e/dx>0\)，使近壁低动量流体被迫减速甚至回流。均匀来流绕平板时外缘速度 \(U_e=U_\infty\) 为常数，\(dp_e/dx=0\)，Blasius 层流解中局部摩擦系数
\[
C_f=\frac{0.664}{\sqrt{Re_x}},
\]
故 \(\tau_w=\frac12\rho U_\infty^2C_f>0\)。于是边界层会沿程增厚，但在理想零压梯度层流平板上不发生边界层分离；若 \(Re_x\) 很大，可能发生层流向湍流的转捩，但转捩不等同于分离。`,
    boundaryNote: '派生过程参考答案；结论限于光滑平板、零压梯度、未受强外界扰动的经典平板边界层。'
  }
];

export const proofDepthRewrites181103 = [
  {
    id: '181103-material-extracted-0465',
    diagnosis: '当前答案已经给出了一个可用的平移椭圆柱面式和运动学检查，但可更稳：明确半轴、初始中心、运动方向约定、侧曲面属性和一般坐标形式。',
    referenceAnswer: String.raw`设椭圆柱轴线沿 \(z\) 轴，柱体以速度 \(u\) 沿 \(+x\) 方向作直线平动；取 \(t=0\) 时椭圆截面中心在原点，沿运动方向的半轴为 \(a\)，垂直运动方向的半轴为 \(b\)。由于题目问的是椭圆柱曲面，轴向坐标 \(z\) 不受限制。

在随椭圆柱一起平动的坐标系中取
\[
X=x-ut,\qquad Y=y.
\]
随体坐标中椭圆截面形状不随时间改变，因此截面方程为
\[
\frac{X^2}{a^2}+\frac{Y^2}{b^2}=1.
\]
代回实验室坐标，椭圆柱侧曲面方程可写为
\[
F(x,y,z,t)=\frac{(x-ut)^2}{a^2}+\frac{y^2}{b^2}-1=0,\qquad -\infty<z<\infty.
\]
若初始中心不在原点，只需把 \(x-ut\) 改为 \(x-x_c(0)-ut\)。

作运动学检查：柱体速度为
\[
\mathbf U=u\mathbf e_x.
\]
对
\[
F=\frac{(x-ut)^2}{a^2}+\frac{y^2}{b^2}-1
\]
有
\[
F_t=-\frac{2u(x-ut)}{a^2},\qquad
\nabla F=\left(\frac{2(x-ut)}{a^2},\frac{2y}{b^2},0\right).
\]
于是
\[
F_t+\mathbf U\cdot\nabla F
=-\frac{2u(x-ut)}{a^2}+u\frac{2(x-ut)}{a^2}=0.
\]
这说明 \(F=0\) 是随椭圆柱一起运动的物质曲面，满足活动固壁的运动学条件。

若不想固定坐标方向，可写成一般形式：令 \(\mathbf r_c(t)=\mathbf r_c(0)+ut\mathbf e\)，其中 \(\mathbf e\) 为垂直于柱轴的运动方向，\(\mathbf n\) 为截面内与 \(\mathbf e\) 垂直的方向，则
\[
\frac{[(\mathbf r_\perp-\mathbf r_c(t))\cdot\mathbf e]^2}{a^2}
+\frac{[(\mathbf r_\perp-\mathbf r_c(t))\cdot\mathbf n]^2}{b^2}=1
\]
就是同一曲面的坐标无关写法。`,
    boundaryNote: '题面来自 181103 练习册第 6 页的 HTML/页图核对材料，但记录中 noOriginalAnswerClaim=true，未见原书标准答案 PDF 逐字证明。'
  },
  {
    id: '181103-material-extracted-0100',
    diagnosis: '题型标签虽显示名词解释，但题干实为运动边界运动学证明题。关键审稿点是把 U 的有符号约定讲清楚。',
    referenceAnswer: String.raw`要证明的是运动边界上的不可穿透运动学条件。初始边界为
\[
y=kx^{1/2},
\]
等价写成
\[
y^2=k^2x.
\]
若边界以沿 \(x\) 方向的有符号速度 \(U\) 作平移，则时刻 \(t\) 的边界可写为
\[
F(x,y,t)=y^2-k^2(x-Ut)=0.
\]
这里采用题目待证式所隐含的符号约定：\(U\) 是边界在 \(x\) 方向的代数速度；若 \(U\) 本身取负值，就表示沿负 \(x\) 方向运动。

边界面是物质面，边界上的流体质点不能穿过边界，所以沿流体质点轨迹必须满足
\[
\frac{DF}{Dt}=0,
\]
即
\[
F_t+uF_x+vF_y=0.
\]
逐项求偏导：
\[
F_t=k^2U,\qquad F_x=-k^2,\qquad F_y=2y.
\]
代入运动学条件得
\[
k^2U-k^2u+2yv=0,
\]
整理为
\[
2yv=k^2(u-U).
\]
在边界上且 \(y\ne0\) 时，两边同除以 \(2y(u-U)\)，得到
\[
\frac{v}{u-U}=\frac{k^2}{2y}.
\]

也可以从几何斜率理解：边界斜率
\[
\frac{dy}{dx}=\frac{k}{2\sqrt{x-Ut}}=\frac{k^2}{2y},
\]
流体点相对运动边界的水平速度为 \(u-U\)，因此为保持在同一边界曲线上，竖直速度必须满足
\[
v=\frac{dy}{dx}(u-U),
\]
仍得到同一关系。题中“流体开始时静止”只说明初始状态，不改变这个瞬时运动学约束；证明核心是物质面条件而不是动量方程。`,
    boundaryNote: '若把 U 理解为“沿负 x 方向的正速度大小”，边界应写成 \(y^2=k^2(x+Ut)\)，公式会相应变成 \(v/(u+U)=k^2/(2y)\)。'
  },
  {
    id: '181103-material-extracted-0176',
    diagnosis: '现有答案已覆盖四个式子的基本含义，但应更显式地区分几何层、运动学层、定常形状层和两侧相对法向运动。',
    referenceAnswer: String.raw`设间断面由 \(F(x,y,z,t)=0\) 表示。几何上，\(F\) 是一个标量函数，\(F=0\) 给出某一瞬时的曲面；其单位法向量可写为
\[
\mathbf n=\frac{\nabla F}{|\nabla F|},
\]
法向正方向按图 5.18 的两侧编号约定。

第一式 \(dF/dt=0\) 的含义是：跟随间断面上的点运动时，该点始终满足 \(F=0\)。展开为
\[
\frac{dF}{dt}
=\frac{\partial F}{\partial t}
+\mathbf V_s\cdot\nabla F=0,
\]
其中 \(\mathbf V_s\) 是间断面自身的运动速度。因此间断面的法向速度满足
\[
V_{sn}=\mathbf V_s\cdot\mathbf n
=-\frac{\partial F/\partial t}{|\nabla F|}.
\]
若把某侧流体质点速度 \(\mathbf V_i\) 代入同一关系，即 \(\partial F/\partial t+\mathbf V_i\cdot\nabla F=0\)，则表示该侧流体质点不穿过间断面，间断面相对该侧是物质面。

第二式 \(\partial F/\partial t=0\) 的含义是：间断面方程不显含时间，在所选坐标系中曲面的位置或形状为定常；此时由 \(V_{sn}=-(\partial F/\partial t)/|\nabla F|\) 可知面本身没有法向传播速度，但这不等于面两侧一定没有切向流动。

第三式 \(V_{1n}=V_{2n}\) 的含义是：两侧沿同一法向的速度相等，过渡区两侧边界没有相对靠近或远离。若把间断面看成有限厚度 \(\delta\) 的薄过渡层，并令 \(\delta\) 沿正法向从 1 侧量到 2 侧，则厚度变化率可理解为
\[
\frac{d\delta}{dt}=V_{2n}-V_{1n},
\]
所以 \(V_{1n}=V_{2n}\) 时 \(d\delta/dt=0\)，过渡域厚度不变，间断强度不因法向压缩或拉伸而改变。

第四组不等式说明间断强弱的变化。若 \(V_{1n}>V_{2n}\)，则
\[
\frac{d\delta}{dt}=V_{2n}-V_{1n}<0,
\]
两侧边界沿法向相互追近，过渡域变窄；同一物理量跃变 \(\Delta q\) 分布在更小厚度内，梯度量级 \(|\Delta q|/\delta\) 增大，所以间断趋于加强。若 \(V_{1n}<V_{2n}\)，则 \(d\delta/dt>0\)，过渡域被拉宽，梯度 \(|\Delta q|/\delta\) 减小，突变性被抹平，间断趋于减弱。

结论检查：这四个式子不是四个孤立标签，而是从曲面几何、曲面运动、定常形状、两侧相对法向速度到间断强弱变化的一条运动学解释链。`,
    boundaryNote: '第 4 项加强或减弱方向依赖图 5.18 的法向正方向和 1、2 两侧编号；若法向约定反向，不等号解释需同步反向。'
  },
  {
    id: '181103-material-extracted-0114',
    diagnosis: '当前答案已属 proof-depth-reference-answer；关键审稿点是必须区分热量、热流率和传热系数，否则会漏掉时间量纲。',
    referenceAnswer: String.raw`设球形物体表面积为 \(A\)，与周围流体的温差为 \(\Delta T\)，球面对流体的热传输系数 \(C_h\) 按总传热率定义为
\[
\dot Q=C_h A\Delta T.
\]
这里 \(\dot Q\) 是单位时间传递的热量；若教材把 \(Q\) 写作传热量，则严格应写
\[
Q=C_h A\Delta T\,t.
\]
取基本量纲 \(M,L,T,\Theta\)，其中 \(\Theta\) 表示温度量纲。热量是能量，
\[
[Q]=ML^2T^{-2},
\]
因此热流率
\[
[\dot Q]=\frac{[Q]}{T}=ML^2T^{-3}.
\]
面积 \([A]=L^2\)，温差 \([\Delta T]=\Theta\)。由定义式解出
\[
[C_h]=\frac{[\dot Q]}{[A][\Delta T]}
=\frac{ML^2T^{-3}}{L^2\Theta}
=MT^{-3}\Theta^{-1}.
\]
若用 SI 单位表示，\(C_h\) 的单位为
\[
\mathrm{W\,m^{-2}\,K^{-1}},
\]
因为 \(1\,\mathrm W=1\,\mathrm{kg\,m^2\,s^{-3}}\)，所以
\[
\mathrm{W\,m^{-2}\,K^{-1}}
=\mathrm{kg\,s^{-3}\,K^{-1}},
\]
正对应 \(MT^{-3}\Theta^{-1}\)。也可从局部热流密度 \(q''=C_h\Delta T\) 检查：
\[
[q'']=\mathrm{W\,m^{-2}}=MT^{-3},
\]
除以温差 \(\Theta\) 后仍得 \([C_h]=MT^{-3}\Theta^{-1}\)。

结论检查：面积量纲 \(L^2\) 会与热流率中的 \(L^2\) 抵消；答案中必须保留 \(T^{-3}\)，若写成 \(MT^{-2}\Theta^{-1}\)，说明把总热量误当成单位时间热量了。`,
    boundaryNote: 'verifiedDerived/objectiveReady 为真；但 strictAnswerPdfProof 仍为 false/0，来源页图只作题面核对。'
  },
  {
    id: '181103-material-extracted-0060',
    diagnosis: '本题有符号边界风险：同页父题卡/来源摘录显示第(2)问为 u=sin z，而当前子题题面写成 u=sin(kz)。两种写法相差速度梯度因子 k。',
    referenceAnswer: String.raw`取 \(x\) 为流动方向，\(z\) 为垂直平板方向，板距记为 \(L\)；若沿用父题卡，\(L=k\) cm，坐标原点在中面，板面为 \(z=\pm L/2\)。水为牛顿流体，速度场
\[
\mathbf V=(u(z),0,0).
\]
黏性应力张量满足
\[
\tau_{ij}=\mu\left(\frac{\partial u_i}{\partial x_j}
+\frac{\partial u_j}{\partial x_i}\right),
\]
本题唯一相关剪切项为
\[
\tau_{xz}=\tau_{zx}=\mu\frac{du}{dz}.
\]
它表示法向为 \(+z\) 的面上沿 \(x\) 方向的黏性切应力；不是压强正应力。

按来源父题卡第(2)问 \(u=\sin z\)，则
\[
\frac{du}{dz}=\cos z,
\qquad
\tau_{xz}=\mu\cos z.
\]
两板处 \(z=\pm L/2\)，剪应力大小为
\[
|\tau_w|=\mu|\cos(L/2)|.
\]
若 \(L=k\)，则为 \(\mu|\cos(k/2)|\)。若 \(\cos(L/2)>0\)，上板对水沿 \(+x\)，水对上板沿 \(-x\)；下板对水沿 \(-x\)，水对下板沿 \(+x\)。若 \(\cos(L/2)<0\)，上述方向全部反向。\(z=0\) 内部截面上
\[
\tau_{xz}(0)=\mu\cos0=\mu.
\]
以 \(z=0\) 面把流体分成上下两部分时，上部流体对下部流体的切向应力沿 \(+x\)，下部流体对上部流体沿 \(-x\)，大小均为 \(\mu\)；题给 20°C 水 \(\mu=0.01\) 克/(厘米·秒) 时，数值大小为 \(0.01\,\mathrm{dyn/cm^2}\) 乘以速度梯度的相应单位换算。

若严格按当前子题文字 \(u=\sin(kz)\) 处理，应写
\[
\frac{du}{dz}=k\cos(kz),
\qquad
\tau_{xz}=\mu k\cos(kz),
\]
板面大小为 \(\mu|k\cos(kL/2)|\)，\(z=0\) 处大小为 \(\mu|k|\)；方向判据仍按 \(\tau_{xz}\) 的符号和作用-反作用关系确定。`,
    boundaryNote: '建议保留来源边界：父题卡/来源口径为 \(u=\sin z\)，当前子题 \(u=\sin(kz)\) 只作为严格按现题面时的派生分支。'
  },
  {
    id: '181103-material-extracted-0450',
    diagnosis: '现有 Round533 证明答案已基本满足 proof-depth；可补明匀变形条件、非奇异/退化情形和几何意义。',
    referenceAnswer: String.raw`设 \(\mathbf X\) 为某一初始时刻的物质坐标，\(\mathbf x\) 为运动后的空间坐标。匀变形的核心条件是变形在空间上均匀，即变形梯度
\[
F(t)=\frac{\partial\mathbf x}{\partial\mathbf X}
\]
不依赖于具体质点位置；等价地，流体质点的运动映射可写成仿射形式
\[
\mathbf x=\mathbf b(t)+F(t)\mathbf X,
\]
其中 \(\mathbf b(t)\) 表示整体平移，\(F(t)\) 表示统一的伸长、压缩、剪切和转动。

先证共线性。若初始质点位于同一直线上，则这条物质直线可写为
\[
\mathbf X(s)=\mathbf X_0+s\mathbf a,
\]
其中 \(s\) 为参数，\(\mathbf a\) 为直线方向向量。运动后有
\[
\mathbf x(s,t)=\mathbf b(t)+F(t)\mathbf X_0+sF(t)\mathbf a.
\]
令
\[
\mathbf x_0(t)=\mathbf b(t)+F(t)\mathbf X_0,\qquad
\mathbf a'(t)=F(t)\mathbf a,
\]
则
\[
\mathbf x(s,t)=\mathbf x_0(t)+s\mathbf a'(t),
\]
仍是一条以 \(s\) 为参数的直线；若 \(\mathbf a'(t)=0\)，则该直线退化为一点，但任意原来共线的质点仍保持共线关系。

再证共面性。若初始质点位于同一平面上，可取两个不平行方向 \(\mathbf a,\mathbf c\)，把平面写成
\[
\mathbf X(s,q)=\mathbf X_0+s\mathbf a+q\mathbf c.
\]
运动后
\[
\mathbf x(s,q,t)
=\mathbf b(t)+F(t)\mathbf X_0
+sF(t)\mathbf a+qF(t)\mathbf c.
\]
它仍由两个方向向量 \(F(t)\mathbf a\) 和 \(F(t)\mathbf c\) 张成，因此仍是一个平面；若两个方向向量退化为相关或某个为零，则平面至多退化为直线或点，仍不破坏共面性。若 \(F(t)\) 非奇异，也可从平面方程
\[
\mathbf n\cdot(\mathbf X-\mathbf X_0)=0
\]
出发，写成
\[
(F^{-T}\mathbf n)\cdot(\mathbf x-\mathbf x_0(t))=0,
\]
更直接说明平面被映到平面。

几何意义是：匀变形是仿射变换，只能整体平移、旋转、拉伸、压缩或剪切；它没有随空间变化的弯曲项，所以不能把一条直线弯成曲线，也不能把一个平面翘成曲面。故在匀变形情况下，同一直线上的质点永远保持共线，同一平面上的质点永远保持共面。`,
    boundaryNote: '181103 资料内题，Round533 已为 proof-depth-upgraded；本答案为仿射运动映射下的派生证明，非 strictAnswerPdfProof。'
  }
];
