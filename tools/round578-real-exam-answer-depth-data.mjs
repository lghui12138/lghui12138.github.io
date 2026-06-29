export const round578 = {
  round: 578,
  date: '2026-06-29',
  version: 'round578-real-exam-answer-depth-eleventh-pass-20260629',
  previousVersion: 'round577-181103-proof-depth-second-pass-20260629',
  realExamPreviousAnswerDepthRows: 145,
  realExamCumulativeAnswerDepthRows: 153,
  realExamRoundUpgradeRows: 8,
  realExamNewUniqueRows: 8,
  proofDepthRows181103: 422,
  referencePracticeRows181103: 400,
  sourceClueOnlyRows181103: 122,
  strictAnswerPdfProofRows: 0,
  minChars: 450,
  minFormulaCount: 3,
  minProofSignalCount: 5
};

export const realExamUpgrades = [
  {
    id: 'ocean-2010-01-08',
    diagnosis: '旧答案只给 Stokes 阻力平衡一句推导，缺少受力图、低 Reynolds 数条件、终速正负口径和雾滴/气泡模型边界。',
    referenceAnswer: String.raw`雾滴匀速下落时加速度为零，因此竖直方向合力为零。取向下为正，雾滴所受重力为
\[
G=\frac{4}{3}\pi a^3\rho_w g,
\]
空气浮力为
\[
B=\frac{4}{3}\pi a^3\rho_a g,
\]
方向向上。若雾滴半径很小、相对速度很低，使颗粒 Reynolds 数 \(Re=2aV/\nu_a\ll1\)，并把雾滴按刚性球或无内部环流近似处理，则空气对球的 Stokes 阻力大小为
\[
D=6\pi\mu aV,
\]
方向向上。终速条件为重力等于浮力加阻力：
\[
\frac{4}{3}\pi a^3\rho_w g=\frac{4}{3}\pi a^3\rho_a g+6\pi\mu aV .
\]
整理得
\[
6\pi\mu aV=\frac{4}{3}\pi a^3(\rho_w-\rho_a)g,
\]
所以
\[
V=\frac{2a^2(\rho_w-\rho_a)g}{9\mu}.
\]
若 \(\rho_w>\rho_a\)，该值为正，表示向下沉降；若密度差为零则没有净重，终速为零；若符号相反则运动方向相反。结论检查：右端量纲为
\[
\frac{L^2(ML^{-3})LT^{-2}}{ML^{-1}T^{-1}}=LT^{-1},
\]
确为速度量纲。该式只适用于低 \(Re\)、球形、稀薄效应可忽略、流体可视为连续介质并且 Stokes 阻力成立的情形；若题目明确讨论干净液滴内部环流，则阻力系数会因 Hadamard-Rybczynski 修正而改变。`,
    boundaryNote: 'derived/reference answer；未新增原答案 PDF 逐字证据。题面为选择题，本站补出完整受力证明以便复习。'
  },
  {
    id: 'ocean-2012-06-04',
    diagnosis: '旧答案只写了一个积分式，没有说明镜像法、壁面速度、Bernoulli 压强亏损、两条壁面对称积分和力的方向口径。',
    referenceAnswer: String.raw`本题承接第一象限内点源与两互相垂直平板边界的镜像法。设真实点源在第一象限内，坐标轴是固壁；通过同号镜像源使两坐标轴成为流线，从而满足固壁不可穿透条件。要求点源对平板边界的作用力时，可以先求壁面上的速度，再由 Bernoulli 方程求相对压强，最后沿壁面积分压力。以其中一条壁面为例，壁面切向速度可由复势导数在壁面上取切向分量得到；旧答案采用的记号把壁面坐标记为 \(s\)，得到壁面速度平方对应的压强亏损
\[
p_\infty-p(s)=\frac12\rho V^2(s)=\frac{8\rho m^2s^6}{(s^4+4a^4)^2}.
\]
这里 \(m\) 是点源强度所用的复势记号，若原题以 \(q/(2\pi)\) 定义点源强度，则需把 \(m\) 按该约定替换。平板所受压力相对远处均匀压强的合力大小可写为
\[
F_1=\int_0^\infty [p_\infty-p(s)]\,ds
=\int_0^\infty \frac{8\rho m^2s^6}{(s^4+4a^4)^2}\,ds .
\]
另一条垂直壁面因几何对称有同样大小的积分。若题目只要求“写出积分表达式”，可把两壁面对称贡献写成
\[
F=2\int_0^\infty \frac{8\rho m^2s^6}{(s^4+4a^4)^2}\,ds,
\]
再按两条壁面的外法线分解方向。物理方向上，壁面附近速度增大导致压强低于远处，所以壁面对流体表现为吸引，点源对边界的反作用方向与压力合力相反。结论检查：积分核量纲为压强，乘 \(ds\) 得单位厚度上的力；分母四次幂保证无穷远处收敛，\(s=0\) 附近也不发散。`,
    boundaryNote: 'derived/reference answer；本题原题允许只写积分式，但本站补出从镜像法到压力积分的证明链。源强归一化按本地旧答案记号保留。'
  },
  {
    id: 'ocean-2013-03-02',
    diagnosis: '旧答案把 Lagrange/Bernoulli 型积分写成结论，缺少从 Euler 方程积分、沿流线常数和物理意义的证明。',
    referenceAnswer: String.raw`定常运动时的 Lagrange 积分可从理想流体 Euler 方程推出。设流体为理想流体，密度与压强满足正压关系 \(\rho=\rho(p)\)，单位质量体力有势，记体力势为 \(\Pi\)，则可定义压力函数
\[
H(p)=\int^p\frac{dp}{\rho(p)}.
\]
定常 Euler 方程可写成
\[
(\mathbf V\cdot\nabla)\mathbf V=-\nabla H-\nabla\Pi .
\]
利用恒等式
\[
(\mathbf V\cdot\nabla)\mathbf V=\nabla\frac{V^2}{2}-\mathbf V\times(\nabla\times\mathbf V),
\]
得到
\[
\nabla\left(\frac{V^2}{2}+H+\Pi\right)-\mathbf V\times\boldsymbol\omega=0 .
\]
沿同一条流线取微元 \(d\mathbf r\parallel \mathbf V\)，有 \((\mathbf V\times\boldsymbol\omega)\cdot d\mathbf r=0\)，所以
\[
d\left(\frac{V^2}{2}+\int\frac{dp}{\rho}+\Pi\right)=0.
\]
因此定常运动时
\[
\frac{V^2}{2}+\int\frac{dp}{\rho}+\Pi=C
\]
沿同一条流线保持常数。若流动无旋且研究区域连通、无奇点，该常数可推广为全场同一常数。不可压流体中 \(\rho\) 为常数，于是
\[
\frac{V^2}{2}+\frac{p}{\rho}+\Pi=C.
\]
若取重力势 \(\Pi=gz\)，就是常见的 Bernoulli 形式。它的物理意义是：单位质量流体的动能、压强势能和体力势能在理想、无耗散、满足条件的运动中相互转化，总机械能沿流线守恒。适用时必须说明理想无粘、正压或不可压、体力有势、定常；若跨流线使用，还要有无旋条件。遇到泵、涡轮、粘性损失、激波、强分离或非保守力时，不能直接套用这个积分。`,
    boundaryNote: 'derived/reference answer；该题问“内容和物理意义”，本站补出推导以防只背公式。'
  },
  {
    id: 'ocean-2020-04-04',
    diagnosis: '旧答案给出零流线方程和作图口号，缺少如何由流函数、驻点和分界流线判断图形的步骤。',
    referenceAnswer: String.raw`本组题的流函数可写为
\[
\psi=Uy+\frac{Q}{2\pi}(\theta_- - \theta_+),
\]
其中点源位于 \((-a,0)\)，点汇位于 \((a,0)\)，\(\theta_-=\arg[z+a]\)，\(\theta_+=\arg[z-a]\)。定常二维流线就是 \(\psi=C\)，所以零流线满足
\[
Uy+\frac{Q}{2\pi}(\theta_- - \theta_+)=0.
\]
作图时先标出源、汇和均匀来流方向。源处流线发出，汇处流线终止；远离源汇对时，角度差趋小，流线趋近均匀流的水平直线。零流线通常是分隔“经过源汇对附近的闭合或半闭合回流区”和外侧均匀绕流的分界曲线。若要画得更准，应先求驻点：驻点满足复速度
\[
\frac{dW}{dz}=U+\frac{Q}{2\pi}\left(\frac{1}{z+a}-\frac{1}{z-a}\right)=0.
\]
整理为
\[
U-\frac{Qa}{\pi(z^2-a^2)}=0,
\]
故驻点位置由
\[
z^2=a^2+\frac{Qa}{\pi U}
\]
给出。位于 \(x\) 轴上的两个驻点是零流线常经过的关键点。绘图步骤为：第一，画 \(x\) 轴上的源 \((-a,0)\)、汇 \((a,0)\) 和驻点；第二，画过驻点的 \(\psi=0\) 分界流线，使其围住源汇对附近区域；第三，在外侧画从左到右近似平行的均匀流线，并在源附近发散、汇附近收束；第四，注意上下对称性和源汇奇点处流线可发出或终止。若用反正切式作图，\(\theta_- - \theta_+\) 必须按象限选连续分支，不能把多值角度压成单值反正切后直接连线。`,
    boundaryNote: 'derived/reference answer；作图题的文字答案给出可复现步骤，严格图形仍由页面绘图或手绘承担。'
  },
  {
    id: 'ocean-2018-06-01',
    diagnosis: '旧答案只列四条边界条件，缺少坐标、两层流体、速度/切应力连续来源，以及压力/法向速度边界的适用边界。',
    referenceAnswer: String.raw`设两层不可混溶牛顿流体夹在两平板之间，下层为流体 1，粘度 \(\mu_1\)，占 \(0\le y\le h_1\)；上层为流体 2，粘度 \(\mu_2\)，占 \(h_1\le y\le h_1+h_2\)。取 \(x\) 沿平板运动方向，速度分别为
\[
\mathbf V_1=(u_1(y),0,0),\qquad \mathbf V_2=(u_2(y),0,0).
\]
下平板固定时，无滑移条件给出
\[
u_1(0)=0.
\]
上平板以速度 \(V_0\) 沿 \(x\) 方向运动时，上壁无滑移给出
\[
u_2(h_1+h_2)=V_0.
\]
在两介质界面 \(y=h_1\) 处，若界面不破裂且两侧流体相互粘附，切向速度必须连续：
\[
u_1(h_1)=u_2(h_1).
\]
若界面上没有外加表面剪切力，界面两侧切向应力也必须连续。牛顿流体的一维剪切应力为
\[
\tau_{xy}=\mu\frac{du}{dy},
\]
因此
\[
\mu_1\left.\frac{du_1}{dy}\right|_{h_1}
=\mu_2\left.\frac{du_2}{dy}\right|_{h_1}.
\]
若题目还要求完整界面动力学条件，还应补充法向速度连续和法向应力平衡；但本题只问平板上和两介质界面处的速度边界条件时，上述四条就是求两层 Couette 流速度分布所需的主边界条件。结论检查：共有两个区域的二阶常微分方程，各有两个积分常数，总共四个未知常数，正好由四条边界/界面条件确定。`,
    boundaryNote: 'derived/reference answer；按本地题面“写出边界条件”补出来源说明，不宣称原答案 PDF 逐字证明。'
  },
  {
    id: 'ocean-2015-04-03',
    diagnosis: '旧答案只用流函数差给通量，没有说明有向通量、极角分支和线段穿过奇点与否的边界。',
    referenceAnswer: String.raw`二维不可压流中，任意两点之间跨过一条曲线的单位厚度体积通量可由端点流函数差给出：
\[
Q_{A\to B}=\psi(B)-\psi(A),
\]
前提是曲线不穿过源、汇等奇点，并且流函数分支在所取区域内连续。本题速度势或流函数对应点源/点汇形式，给出的流函数可写为
\[
\psi=m\theta,
\]
其中 \(\theta\) 为以奇点为极点的极角。点 \(A(1,-1)\) 的极角为
\[
\theta_A=-\frac{\pi}{4},
\]
点 \(B(1,1)\) 的极角为
\[
\theta_B=\frac{\pi}{4}.
\]
因此从 \(A\) 到 \(B\) 的有向体积通量为
\[
Q_{A\to B}=\psi_B-\psi_A
=m(\theta_B-\theta_A)
=m\left(\frac{\pi}{4}-\left(-\frac{\pi}{4}\right)\right)
=\frac{m\pi}{2}.
\]
若题目只问通量大小，则写
\[
|Q|=\frac{|m|\pi}{2}.
\]
这里的符号取决于端点顺序和流函数正方向约定：若改为从 \(B\) 到 \(A\)，有向通量变为 \(-m\pi/2\)。结论检查：流函数差本身具有单位厚度流量量纲；若线段跨越对数分支割线或奇点，必须重新选取连续角度分支，不能机械套用主值角。`,
    boundaryNote: 'derived/reference answer；本题用流函数差法补足符号与分支边界。'
  },
  {
    id: 'ocean-2023-08',
    diagnosis: '旧答案只核对 \(p\sim\rho\omega VL\) 一种写法，缺少基本量纲指数表、逐项相乘过程和错式判别方法。',
    referenceAnswer: String.raw`验证量纲一致性时，先统一基本量纲。压强是单位面积上的力，
\[
[p]=\frac{MLT^{-2}}{L^2}=ML^{-1}T^{-2}.
\]
题中旋转角速度、密度、速度和长度的基本量纲分别为
\[
[\omega]=T^{-1},\qquad [\rho]=ML^{-3},\qquad [V]=LT^{-1},\qquad [L]=L.
\]
若题给右端为
\[
\rho\omega VL,
\]
则逐项相乘：
\[
[\rho\omega VL]=(ML^{-3})(T^{-1})(LT^{-1})(L).
\]
把 \(M,L,T\) 指数合并，得
\[
M^1L^{-3+1+1}T^{-1-1}=ML^{-1}T^{-2}.
\]
这与 \([p]\) 完全相同，所以该关系式两边量纲一致。若题目给的是类似 \(\rho\omega V L^2\) 或 \(\rho\omega^2L^2\)，也要按同样方法比较指数：只要 \(M,L,T\) 三个指数与 \(ML^{-1}T^{-2}\) 不完全相同，就不能作为压强量纲式。量纲一致只能说明式子在量纲上可能成立，并不能证明系数、方向、适用物理模型一定正确；真正的物理关系还需要由控制方程、边界条件或实验确定。`,
    boundaryNote: 'derived/reference answer；本题为量纲核验题，严格答案 PDF 证据仍未新增。'
  },
  {
    id: 'ocean-2013-04',
    diagnosis: '旧答案直接用涡管强度守恒给结论，没有从不可压体积守恒和 Helmholtz 涡管定理逐步证明。',
    referenceAnswer: String.raw`理想不可压流体在有势力作用下，满足 Helmholtz 涡管定理：同一涡管的涡管强度
\[
\Gamma_\omega=\omega A
\]
随流体运动保持不变。这里 \(\omega\) 为涡度大小，\(A\) 为垂直于涡管轴线的截面积。题设竖直均匀涡旋半径为 \(r\)，初始截面积为
\[
A=\pi r^2.
\]
若在原地把涡旋拉长 \(K\) 倍，并且流体不可压缩，则同一涡管体积守恒。长度变为原来的 \(K\) 倍时，截面积必须变为原来的 \(1/K\)，即
\[
A'=\frac{A}{K}.
\]
由涡管强度守恒
\[
\omega'A'=\omega A,
\]
代入 \(A'=A/K\)，得
\[
\omega'\frac{A}{K}=\omega A,
\]
所以
\[
\omega'=K\omega.
\]
若用半径表示，新截面积 \(A'=\pi r'^2=\pi r^2/K\)，故
\[
r'=\frac{r}{\sqrt K}.
\]
物理意义是：拉伸涡管会减小横截面积，而涡管强度守恒要求涡度相应增大，这就是涡伸长增强涡度的基本机制。结论检查：当 \(K=1\) 时 \(\omega'=\omega\)；当 \(K>1\) 时涡旋被拉长、截面积变小、涡度增大；若 \(K<1\) 表示压缩，涡度减小。适用条件是理想、不可压、体力有势且没有粘性扩散和涡管破裂。`,
    boundaryNote: 'derived/reference answer；按 Helmholtz 涡管定理补全过程，不新增 strictAnswerPdfProof。'
  }
];
