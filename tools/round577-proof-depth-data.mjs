export const round577 = {
  round: 577,
  date: '2026-06-29',
  version: 'round577-181103-proof-depth-second-pass-20260629',
  previousVersion: 'round576-direct-shell-consistency-20260629',
  contentFrontierVersion: 'round576-direct-shell-consistency-20260629',
  previousAnswerContentFrontierVersion: 'round572-answer-depth-tenth-pass-proof-ui-refresh-20260629',
  answerContentFrontierVersion: 'round577-181103-proof-depth-second-pass-20260629',
  materialHtmlPages181103: 38,
  sourceHtmlCards181103: 522,
  referencePracticeRows181103: 400,
  sourceClueOnlyRows181103: 122,
  proofDepthRows181103: 422,
  round577ProofDepthRewriteRows181103: 8,
  cumulativeSecondPassProofDepthRows181103: 26,
  realExamAnswerDepthRows: 145,
  realExamOriginalAtomicRows: 325,
  realExamSourceSections: 68,
  groupedRealExamRows: 217,
  strictAnswerPdfProofRows: 0,
  minChars: 850,
  minSentenceCount: 8,
  minFormulaCount: 8,
  minProofSignalCount: 8,
  scope: 'second-pass proof-depth rewrite for eight existing 181103 reference-answer-ready rows plus current resource copy count cleanup'
};

export const proofDepthRewrites181103 = [
  {
    id: '181103-material-extracted-0444',
    diagnosis: '旧答案已经列出面积元和通量差，但仍像提纲：没有把球面两组边界长度、切向速度、储存项、净流出项和纬度/经度符号约定逐项说明，学生不容易复查为什么两个通量项都带 cos theta。',
    requiredSnippets: ['dA=R^2\\cos\\theta', 'R\\dot\\theta', 'R\\cos\\theta\\dot\\phi', '储存率 + 净流出率 = 0', '符号约定'],
    boundaryNote: String.raw`strictAnswerPdfProof=false；本答案按题中目标公式的记号取 \(\dot\theta=\omega,\ \dot\phi=\omega'\)。若原资料文字把“经度变化率/纬度变化率”的顺序写反，应以待证公式中的两个通量项为准，否则需要同时交换 \(\omega,\omega'\) 的定义。`,
    referenceAnswer: String.raw`设球半径为常数 \(R\)，流体质点被限制在球面上运动，所以法向速度为零，只需在球面坐标 \((\theta,\phi)\) 上写二维质量守恒。按题中待证公式的记号取纬度变化率 \(\dot\theta=\omega\)，经度变化率 \(\dot\phi=\omega'\)。在纬度 \(\theta\) 与经度 \(\phi\) 附近取小曲面元 \([\theta,\theta+d\theta]\times[\phi,\phi+d\phi]\)。纬圈方向长度为 \(R\cos\theta\,d\phi\)，子午线方向长度为 \(R\,d\theta\)，故面积元为
\[
dA=R^2\cos\theta\,d\theta d\phi .
\]
小元内质量为
\[
dm=\rho R^2\cos\theta\,d\theta d\phi .
\]
因此质量储存率为
\[
\frac{\partial}{\partial t}dm
=R^2\frac{\partial\rho}{\partial t}\cos\theta\,d\theta d\phi .
\]
先看 \(\theta\) 方向。穿过 \(\theta=\text{常数}\) 边界的法向切向速度为 \(R\dot\theta=R\omega\)，边界长度为 \(R\cos\theta\,d\phi\)，所以该方向的质量流率可写为
\[
\rho (R\omega)(R\cos\theta\,d\phi)
=\rho\omega R^2\cos\theta\,d\phi .
\]
两条 \(\theta\) 边界的流出差为
\[
R^2\frac{\partial}{\partial\theta}(\rho\omega\cos\theta)\,d\theta d\phi .
\]
再看 \(\phi\) 方向。穿过 \(\phi=\text{常数}\) 边界的法向切向速度为 \(R\cos\theta\,\dot\phi=R\cos\theta\,\omega'\)，边界长度为 \(R\,d\theta\)，质量流率为
\[
\rho(R\cos\theta\,\omega')(R\,d\theta)
=\rho\omega'R^2\cos\theta\,d\theta .
\]
两条 \(\phi\) 边界的流出差为
\[
R^2\frac{\partial}{\partial\phi}(\rho\omega'\cos\theta)\,d\theta d\phi .
\]
质量守恒就是“储存率 + 净流出率 = 0”，即
\[
R^2\left[
\frac{\partial\rho}{\partial t}\cos\theta
+\frac{\partial}{\partial\theta}(\rho\omega\cos\theta)
+\frac{\partial}{\partial\phi}(\rho\omega'\cos\theta)
\right]d\theta d\phi=0 .
\]
由于 \(R^2d\theta d\phi\ne0\)，约去公共因子，得到
\[
\frac{\partial\rho}{\partial t}\cos\theta
+\frac{\partial}{\partial\theta}(\rho\omega\cos\theta)
+\frac{\partial}{\partial\phi}(\rho\omega'\cos\theta)=0 .
\]
结论检查：若 \(\rho\) 为常数且流动不可压，则式子化为球面速度场的散度为零；若靠近极区 \(\cos\theta\to0\)，经纬坐标本身退化，公式应理解为非极点局部坐标下的守恒式。`
  },
  {
    id: '181103-material-extracted-0324',
    diagnosis: '旧答案给了径向 Euler 方程，但把柱形微元压力合力的几何项、周向面压力分量抵消、纯辐射流的加速度假设都压缩掉了，属于“有结论但证明不够”的控制体题。',
    requiredSnippets: ['p(R)R d\\theta dz', '柱形微元还有两张', '补回由面积随', '物质加速度', 'v_\\theta=0'],
    boundaryNote: String.raw`strictAnswerPdfProof=false；本答案按理想流体/无黏 Euler 动量方程推导。若题目要求 Navier-Stokes 形式，应另加径向黏性项；若存在周向速度 \(v_\theta\)，径向加速度还必须包含 \(-v_\theta^2/R\)。`,
    referenceAnswer: String.raw`取柱坐标 \((R,\theta,z)\)，平面辐射流动的速度只有径向分量
\[
v_R=u(R,t),\qquad v_\theta=0,\qquad v_z=0 .
\]
取半径从 \(R\) 到 \(R+dR\)、夹角为 \(d\theta\)、高度为 \(dz\) 的柱形微元作为欧拉控制体，其体积为
\[
dV=R\,dR\,d\theta\,dz .
\]
先写左端惯性项。因为速度只随 \(R,t\) 变化，且无周向速度，径向物质加速度为
\[
a_R=\frac{Du}{Dt}
=\frac{\partial u}{\partial t}
+u\frac{\partial u}{\partial R}.
\]
若有旋转分量，柱坐标径向加速度会多出 \(-v_\theta^2/R\)，但本题纯辐射流中 \(v_\theta=0\)，所以没有该项。单位体积惯性力为
\[
\rho a_R=\rho\left(\frac{\partial u}{\partial t}
+u\frac{\partial u}{\partial R}\right).
\]
再看径向压力合力。内圆柱面面积为 \(R\,d\theta dz\)，外圆柱面面积为 \((R+dR)d\theta dz\)。仅把这两面相减会出现一个与 \(p/R\) 有关的几何项：
\[
p(R)R\,d\theta dz-p(R+dR)(R+dR)d\theta dz .
\]
但柱形微元还有两张 \(\theta\) 方向侧面，侧面压力的法向不完全沿径向，其径向分量正好补回由面积随 \(R\) 改变带来的 \(p/R\) 项。把四个侧面的径向压力分量合并并保留一阶小量后，单位体积压力力只剩
\[
-\frac{\partial p}{\partial R}.
\]
这也是柱坐标中压力梯度的径向分量，不应误写成 \(-R^{-1}\partial(Rp)/\partial R\)。若径向单位质量体力为 \(F_R\)，体力项为 \(\rho F_R\)。由微元径向动量定理，
\[
\rho\left(\frac{\partial u}{\partial t}
+u\frac{\partial u}{\partial R}\right)
=\rho F_R-\frac{\partial p}{\partial R}.
\]
若无体力或体力势已并入压强，则化为
\[
\frac{\partial u}{\partial t}
+u\frac{\partial u}{\partial R}
=-\frac1\rho\frac{\partial p}{\partial R}.
\]
结论检查：每一项量纲都是加速度乘密度或单位体积力；当 \(u\) 不随 \(R,t\) 变化且无体力时，式子要求 \(\partial p/\partial R=0\)，符合均匀径向运动中无压力梯度驱动的情形。`
  },
  {
    id: '181103-material-extracted-0099',
    diagnosis: '旧答案已指出题面速度分布和“距管壁/轴线速度”存在冲突，但证明仍太短：没有把冲突来源、截面积积分、皮托读数、端点误差和全区间误差界逐步写清。',
    requiredSnippets: ['若照字面采用', 'dA=2\\pi r\\,dr', '\\bar V', 'E(m)', 'm & \\bar V/u_0'],
    boundaryNote: String.raw`strictAnswerPdfProof=false；源页题面写 \(u=u_0(1-y/R)^{1/m}\) 且又说 \(y\) 为距管壁距离、\(u_0\) 为轴线速度，这三者不能同时成立。本答案按“\(y\) 为距管壁距离且 \(u_0\) 为轴线速度”的物理口径修正为 \(u=u_0(y/R)^{1/m}\) 后证明误差界。若教材实际把 \(y\) 定义为距轴距离，应按距轴坐标重写。`,
    referenceAnswer: String.raw`题面有一个必须先处理的符号边界：若 \(y\) 真是“距管壁距离”，则管轴处 \(y=R\)。题面又说 \(u_0\) 是轴线速度，所以轴线处应有 \(u=u_0\)。但若照字面采用
\[
u=u_0(1-y/R)^{1/m},
\]
代入 \(y=R\) 会得到 \(u=0\)，与“\(u_0\) 为轴线速度”矛盾。因此按物理一致的管流幂律分布，应理解为
\[
u=u_0\left(\frac yR\right)^{1/m},
\]
其中 \(y=0\) 为壁面、\(y=R\) 为管轴。截面平均速度定义为
\[
\bar V=\frac1{\pi R^2}\int_A u\,dA .
\]
用距壁坐标 \(y\) 积分时，到管轴的半径位置为 \(r=R-y\)，半径为 \(r\) 的薄环面积可写成
\[
dA=2\pi r\,dr=2\pi(R-y)\,dy ,
\]
其中符号已按 \(y\) 从壁面向轴线增加取正面积。于是
\[
\bar V=\frac{1}{\pi R^2}\int_0^R
u_0\left(\frac yR\right)^{1/m}2\pi(R-y)\,dy .
\]
令 \(\eta=y/R\)，得
\[
\bar V
=2u_0\int_0^1 \eta^{1/m}(1-\eta)\,d\eta
=2u_0\left(\frac{m}{m+1}-\frac{m}{2m+1}\right)
=\frac{2m^2}{(m+1)(2m+1)}u_0 .
\]
皮托管放在距管壁 \(0.25R\) 处，即 \(\eta=0.25\)，所测局部速度为
\[
u_p=u_0(0.25)^{1/m}.
\]
相对平均速度误差为
\[
E(m)=\frac{u_p-\bar V}{\bar V}
=\frac{(1/4)^{1/m}}{2m^2/[(m+1)(2m+1)]}-1 .
\]
代入区间内几个代表值：
\[
\begin{array}{c|c|c|c}
m & \bar V/u_0 & u_p/u_0 & E(m)\\
\hline
4 & 32/45=0.7111 & 0.7071 & -0.56\%\\
6 & 72/91=0.7912 & 0.7937 & 0.31\%\\
8 & 128/153=0.8366 & 0.8409 & 0.51\%\\
10& 200/231=0.8658 & 0.8706 & 0.55\%
\end{array}
\]
\(E(m)\) 在 \(m=4\sim10\) 的常用经验范围内变化平缓，上表端点和中间值均远小于 \(5\%\)，因此把皮托管放在距壁 \(0.25R\) 处时，用其读数近似截面平均速度的相对误差约在 \(\pm5\%\) 内，实际按上述模型只有约 \(0.6\%\) 量级。结论检查：若 \(m\) 增大，速度分布更平坦，局部读数和平均速度自然更接近；若不先修正题面坐标定义，则轴线速度条件无法满足，后续“证明”没有物理意义。`
  },
  {
    id: '181103-material-extracted-0503',
    diagnosis: '旧答案的复势路线基本正确，但把流线常数、反正切/arg 分支、特殊流线、复速度求模和三个距离的对应关系写得太跳，证明题应从复势逐步闭合到两个待证式。',
    requiredSnippets: ['W=m\\Log(z+a)', '\\arg', '\\operatorname{Re}S', '新的任意常数', 'V=\\left|\\frac{dW}{dz}\\right|'],
    boundaryNote: String.raw`strictAnswerPdfProof=false；本答案采用二维点源复势 \(m\Log(z-z_0)\) 的记号。若教材把源强定义为 \(q/(2\pi)\Log z\)，则本文 \(m\) 应替换为对应归一化源强；对数分支和奇点处不作为普通流线点处理。`,
    referenceAnswer: String.raw`令 \(z=x+iy\)。两个强度为 \(m\) 的源位于 \(z=-a\) 与 \(z=a\)，强度为 \(2m\) 的汇位于原点。按二维点源/点汇复势记号可取
\[
W=m\Log(z+a)+m\Log(z-a)-2m\Log z
=m\Log\frac{z^2-a^2}{z^2}.
\]
其中对数应在不穿过源汇奇点和支割线的局部区域内选定分支。流线是流函数 \(\psi=\operatorname{Im}W\) 为常数的曲线，因此
\[
\arg\frac{z^2-a^2}{z^2}=C .
\]
设
\[
S=\frac{z^2-a^2}{z^2}=1-\frac{a^2}{z^2}.
\]
由于
\[
\frac1{z^2}
=\frac{(x-iy)^2}{(x^2+y^2)^2}
=\frac{x^2-y^2-2ixy}{(x^2+y^2)^2},
\]
可得
\[
\operatorname{Re}S
=1-\frac{a^2(x^2-y^2)}{(x^2+y^2)^2},
\qquad
\operatorname{Im}S
=\frac{2a^2xy}{(x^2+y^2)^2}.
\]
\(\arg S=C\) 等价于 \(\operatorname{Im}S=k\,\operatorname{Re}S\)，其中 \(k=\tan C\) 是流线常数。于是
\[
\frac{2a^2xy}{(x^2+y^2)^2}
=k\left[
1-\frac{a^2(x^2-y^2)}{(x^2+y^2)^2}
\right].
\]
两边乘以 \((x^2+y^2)^2\) 并整理，得
\[
k(x^2+y^2)^2
=ka^2(x^2-y^2)+2a^2xy .
\]
当 \(k\ne0\) 时除以 \(k\)，并把 \(2/k\) 记为新的任意常数 \(\lambda\)，得到
\[
(x^2+y^2)^2=a^2(x^2-y^2+\lambda xy).
\]
\(k=0\) 或 \(k=\infty\) 对应的特殊流线可看成上述常数族的极限或需单独由 \(\operatorname{Im}S=0\)、\(\operatorname{Re}S=0\) 讨论；普通流线族即为题中形式。再求速度。复速度大小等于
\[
V=\left|\frac{dW}{dz}\right|.
\]
对复势求导：
\[
\frac{dW}{dz}
=\frac{m}{z+a}+\frac{m}{z-a}-\frac{2m}{z}
=\frac{2mz}{z^2-a^2}-\frac{2m}{z}
=\frac{2ma^2}{z(z^2-a^2)}.
\]
令该点到原点、\(-a\) 和 \(a\) 的距离分别为
\[
r_3=|z|,\qquad r_1=|z+a|,\qquad r_2=|z-a|.
\]
又 \(|z^2-a^2|=|z-a||z+a|=r_1r_2\)，所以
\[
V=\left|\frac{2ma^2}{z(z^2-a^2)}\right|
=\frac{2|m|a^2}{r_1r_2r_3}.
\]
若题中 \(m>0\) 表示源强大小，就写为
\[
V=\frac{2ma^2}{r_1r_2r_3}.
\]
结论检查：在源和汇奇点处某个 \(r_i=0\)，速度趋于无穷，符合理想点奇点模型；远处 \(r_1,r_2,r_3\) 均随距离增大，速度快速衰减，符合两个源与一个等强汇组成的零净源强流动。`
  },
  {
    id: '181103-material-extracted-0134',
    diagnosis: '旧答案虽然列出两个方程和直径数值，但符号约定不清，连续方程的正负号、非定常惯性水头、相似无量纲组和表格数值代入仍像摘要，不足以支撑证明题。',
    requiredSnippets: ['y=H_0-H_s', 'A\\,dH_s=aVdt', 'l/g', '\\Pi_1', 'D_m=0.05\\sqrt{6.67}'],
    boundaryNote: String.raw`strictAnswerPdfProof=false；数值直径依赖源页跨页表格给出的模型管径与相似比。若教材把 \(y\) 定义为槽水位高于水库水位，则连续方程和动量方程中的 \(y\) 项会同时改号；本答案按题式 \(dy=-(aV/A)dt\) 固定符号。`,
    referenceAnswer: String.raw`为使题给
\[
dy=-\frac{aV}{A}dt
\]
的符号成立，先明确符号：令 \(V\) 为管内水流从水库流向涡轮机的平均速度，令 \(H_s\) 为涌浪槽水位，\(H_0\) 为水库水位，并取
\[
y=H_0-H_s .
\]
因此槽水位升高时 \(H_s\) 增加，\(y\) 反而减小。管道截面积为 \(a\)，涌浪槽截面积为 \(A\)。阀门突然关紧后，管内水柱因惯性继续把水送入涌浪槽，时间 \(dt\) 内进入槽内的体积为 \(aVdt\)。槽水位增量满足
\[
A\,dH_s=aVdt .
\]
又 \(dy=d(H_0-H_s)=-dH_s\)，水库水位短时近似不变，所以
\[
A(-dy)=aVdt,\qquad dy=-\frac{aV}{A}dt .
\]
这就是连续方程。再推第二式。沿水库到涡轮机方向，对长度为 \(l\) 的管内水柱列一维非定常动量方程。单位重量水柱的非定常惯性水头为
\[
\frac{l}{g}\frac{dV}{dt},
\]
因为 \(l\,dV/dt\) 是单位质量沿程加速度势差，除以 \(g\) 后成为水头。驱动水柱加速的净水头等于水库与涌浪槽之间的水头差 \(y\)，扣除与速度平方成正比的损失水头 \(cV^2\)。因此
\[
y-cV^2=\frac{l}{g}\frac{dV}{dt}.
\]
若 \(y-cV^2<0\)，则 \(dV/dt<0\)，表示阀门关闭后的流速衰减，符号与物理图像一致。为了得到模型与原型相似关系，把两式用特征尺度 \(Y,V_0,T\) 无量纲化。由连续方程得到系数
\[
\Pi_1=\frac{aV_0T}{AY}.
\]
由动量方程得到两个系数
\[
\Pi_2=\frac{cV_0^2}{Y},\qquad
\Pi_3=\frac{lV_0}{gTY}.
\]
模型与原型的水位变化曲线、流速变化曲线相似，要求几何相似并使
\[
\left(\frac{aV_0T}{AY}\right)_m
=\left(\frac{aV_0T}{AY}\right)_p,\quad
\left(\frac{cV_0^2}{Y}\right)_m
=\left(\frac{cV_0^2}{Y}\right)_p,\quad
\left(\frac{lV_0}{gTY}\right)_m
=\left(\frac{lV_0}{gTY}\right)_p .
\]
这些关系说明涌浪槽面积不能只按长度比例随意缩放，而必须同时满足水量连续和水柱惯性相似。源页表格代入后可得到模型涌浪槽与模型管道截面积比
\[
\frac{A_m}{a_m}=6.67 .
\]
若模型管径为 \(0.05\,\mathrm m\)，则
\[
a_m=\frac{\pi(0.05)^2}{4},\qquad
A_m=6.67\,a_m .
\]
涌浪槽若为圆截面，直径 \(D_m\) 满足 \(A_m=\pi D_m^2/4\)，所以
\[
D_m=0.05\sqrt{6.67}\approx0.129\,\mathrm m .
\]
结论检查：\(\Pi_1,\Pi_2,\Pi_3\) 均为无量纲量；\(D_m\) 的单位为米；若缺少源页表格，只能证明两个控制方程和相似准则，不能凭空得到 \(6.67\) 与 \(0.129\,\mathrm m\)。`
  },
  {
    id: '181103-material-extracted-0460',
    diagnosis: '旧答案给出了量纲组，但没有展示 Buckingham 配平矩阵、重复变量选择理由、第一问和第二问变量组变化，也没有说明等价倒数形式与 Reynolds/Froude 数的关系。',
    requiredSnippets: ['[Q]=L^2T^{-1}', 'H^\\alpha g^\\beta\\rho^\\gamma', '\\Pi_1', 'Re_H', 'Fr'],
    boundaryNote: String.raw`strictAnswerPdfProof=false；本答案按单位宽溢流、不可压水、重力与黏性共同可能起作用处理。若题图还给出堰顶形状、迎角、粗糙度或表面张力等变量，应增加相应几何比、相对粗糙度或 Weber 数。`,
    referenceAnswer: String.raw`第一问只给水坝溢流、单位宽流量 \(Q\)、上游水头尺度 \(H\)、坝高或几何尺度 \(h\)、重力 \(g\)、密度 \(\rho\) 与动力黏度 \(\mu\)。单位宽体积流量的量纲为
\[
[Q]=L^2T^{-1}.
\]
各变量量纲为
\[
[H]=[h]=L,\qquad [g]=LT^{-2},\qquad
[\rho]=ML^{-3},\qquad [\mu]=ML^{-1}T^{-1}.
\]
共有 \(6\) 个变量和 \(3\) 个基本量纲，因此应有 \(6-3=3\) 个无量纲组。取 \(H,g,\rho\) 为重复变量，因为它们分别提供长度、时间和质量量纲，且不包含待求量 \(Q\)。令
\[
\Pi_1=QH^\alpha g^\beta\rho^\gamma .
\]
配平
\[
L^2T^{-1}\,L^\alpha\,(LT^{-2})^\beta\,(ML^{-3})^\gamma
=M^0L^0T^0 .
\]
由质量量纲得 \(\gamma=0\)，由时间量纲得 \(-1-2\beta=0\)，故 \(\beta=-1/2\)；由长度量纲得 \(2+\alpha+\beta=0\)，故 \(\alpha=-3/2\)。所以
\[
\Pi_1=\frac{Q}{\sqrt{gH^3}} .
\]
几何尺度给出
\[
\Pi_2=\frac{H}{h}
\]
或其倒数 \(h/H\)。黏性项令
\[
\Pi_3=\mu H^\alpha g^\beta\rho^\gamma .
\]
配平可得 \(\gamma=-1,\ \beta=-1/2,\ \alpha=-3/2\)，因此
\[
\Pi_3=\frac{\mu}{\rho\sqrt g\,H^{3/2}}
=\frac{1}{\rho\sqrt{gH}\,H/\mu}.
\]
后一个倒数就是以速度尺度 \(\sqrt{gH}\)、长度尺度 \(H\) 构成的 Reynolds 数 \(Re_H=\rho\sqrt{gH}\,H/\mu\)。于是单位宽流量关系可写为
\[
\frac{Q}{\sqrt{gH^3}}
=\Phi\left(\frac{H}{h},\,Re_H\right),
\qquad
Re_H=\frac{\rho\sqrt{gH}\,H}{\mu}.
\]
也可把 \(Re_H\) 换成它的倒数，函数形式相应改变但物理内容相同。第二问若已知来流速度 \(V_\infty\)，并要求 \(H/h\) 与哪些无量纲量有关，应把 \(h,V_\infty,\rho\) 作为更自然的重复变量。此时重力给出 Froude 数
\[
Fr=\frac{V_\infty}{\sqrt{gh}},
\]
黏性给出 Reynolds 数
\[
Re=\frac{\rho V_\infty h}{\mu}.
\]
因此
\[
\frac{H}{h}=\Psi(Fr,Re).
\]
结论检查：\(Q/\sqrt{gH^3}\) 中分母量纲为 \(\sqrt{(LT^{-2})L^3}=L^2T^{-1}\)，确为单位宽流量量纲；若 \(Re\) 很大，黏性影响可在近似中弱化，但量纲分析本身不能预先删除它。`
  },
  {
    id: '181103-material-extracted-0201',
    diagnosis: '旧答案推导了 \(c_g=c-Ldc/dL\)，但源码中存在双重转义/显示风险，且题面最关键的 \(dc/dL>0\Rightarrow c_g<c\) 在页面上容易缺失小于号；本轮重写为单层 MathJax 并补足图解斜率说明。',
    requiredSnippets: ['c-L\\frac{dc}{dL}', 'c_g<c', 'c_g>c', '割线斜率', '切线斜率'],
    boundaryNote: String.raw`strictAnswerPdfProof=false；本答案按波长 \(L>0\)、波数 \(k=2\pi/L\)、圆频率 \(\sigma=kc\) 的常用定义推导。若教材用 \(\omega\) 表示圆频率，直接把本文 \(\sigma\) 改写为 \(\omega\) 即可。`,
    referenceAnswer: String.raw`令波长为 \(L\)，圆波数为
\[
k=\frac{2\pi}{L},
\]
相速为 \(c=c(L)\)，圆频率为
\[
\sigma=kc=\frac{2\pi}{L}c(L).
\]
群速定义为色散曲线 \(\sigma(k)\) 上该点的切线斜率：
\[
c_g=\frac{d\sigma}{dk}.
\]
为了比较 \(c_g\) 与 \(c\)，把 \(\sigma\) 和 \(k\) 都看作 \(L\) 的函数。先求
\[
\frac{dk}{dL}=-\frac{2\pi}{L^2}=-\frac{k}{L}.
\]
再对 \(\sigma=2\pi c(L)/L\) 求导：
\[
\frac{d\sigma}{dL}
=2\pi\left(\frac1L\frac{dc}{dL}-\frac{c}{L^2}\right).
\]
由链式法则
\[
c_g=\frac{d\sigma/dL}{dk/dL}
=\frac{2\pi\left(L^{-1}dc/dL-cL^{-2}\right)}
{-2\pi L^{-2}}
=c-L\frac{dc}{dL}.
\]
因此
\[
c_g-c=-L\frac{dc}{dL}.
\]
由于 \(L>0\)，两者大小完全由 \(dc/dL\) 的符号决定：若
\[
\frac{dc}{dL}>0,
\]
则 \(-Ldc/dL<0\)，所以
\[
c_g<c.
\]
若
\[
\frac{dc}{dL}<0,
\]
则 \(-Ldc/dL>0\)，所以
\[
c_g>c.
\]
若
\[
\frac{dc}{dL}=0,
\]
则
\[
c_g=c.
\]
图解也能看出同一结论。在 \(\sigma-k\) 图上，相速
\[
c=\frac{\sigma}{k}
\]
是原点到曲线上该点的割线斜率，群速
\[
c_g=\frac{d\sigma}{dk}
\]
是该点切线斜率。因为 \(k=2\pi/L\)，当 \(L\) 增大时 \(k\) 减小；若 \(c\) 随 \(L\) 增大而增大，换到 \(\sigma-k\) 图上对应切线斜率低于割线斜率，即 \(c_g<c\)。若 \(c\) 随 \(L\) 增大而减小，则切线斜率高于割线斜率，即 \(c_g>c\)。若 \(c\) 与 \(L\) 无关，色散曲线为 \(\sigma=ck\) 的直线，切线斜率和割线斜率相同，故 \(c_g=c\)。`
  },
  {
    id: '181103-material-extracted-0219',
    diagnosis: '旧答案能给出公式，但力平衡、剪应力线性分布、离壁坐标 \(y\) 与半径 \(r\) 的转换、Prandtl 混合长公式的符号/绝对值约定都写得太短。',
    requiredSnippets: ['r=R-y', '\\Delta p\\pi r^2', '\\tau(r)=\\tau_0\\left(1-\\frac yR\\right)', 'Prandtl', '大小形式'],
    boundaryNote: String.raw`strictAnswerPdfProof=false；本答案按定常、不可压、充分发展圆管湍流和 Prandtl 混合长的大小形式推导。若保留剪应力方向，公式中应使用 \(\tau_t=\rho l^2|d\bar u/dy|(d\bar u/dy)\)。`,
    referenceAnswer: String.raw`设圆管半径为 \(R\)，离壁距离为 \(y\)，则该点到管轴的半径为
\[
r=R-y.
\]
管流为定常、不可压、充分发展湍流，平均速度只随 \(r\) 或 \(y\) 变化。先由整体力平衡求管内总剪应力分布。取半径为 \(r\)、长度为 \(L\) 的同轴圆柱流体作为控制体。两端压差为 \(\Delta p\)，轴向压力推动力为
\[
\Delta p\,\pi r^2.
\]
圆柱侧面上剪应力阻力大小为
\[
\tau(r)\,2\pi rL.
\]
充分发展时该控制体不发生轴向加速，两者平衡：
\[
\Delta p\,\pi r^2=\tau(r)\,2\pi rL.
\]
因此
\[
\tau(r)=\frac{\Delta p}{2L}r.
\]
在壁面 \(r=R\) 处，
\[
\tau_0=\frac{\Delta p}{2L}R.
\]
二式相除得
\[
\frac{\tau(r)}{\tau_0}=\frac rR=1-\frac yR,
\]
即
\[
\tau(r)=\tau_0\left(1-\frac yR\right).
\]
这一步说明剪应力从壁面最大值 \(\tau_0\) 向管轴线性减小，到 \(y=R\) 即 \(r=0\) 处为零。再用 Prandtl 混合长理论。若采用剪应力大小形式，并且 \(y\) 从壁面指向管轴、\(\bar u\) 随 \(y\) 增大而增大，则可写
\[
\tau=\rho l^2\left(\frac{d\bar u}{dy}\right)^2.
\]
更严格地保留符号时应写
\[
\tau=\rho l^2\left|\frac{d\bar u}{dy}\right|
\frac{d\bar u}{dy},
\]
本题目标式显然使用的是正梯度下的大小形式。由大小形式解出混合长：
\[
l=\frac{\sqrt{\tau/\rho}}{d\bar u/dy}.
\]
把圆管剪应力分布代入：
\[
l=\frac{\sqrt{\tau_0(1-y/R)/\rho}}{d\bar u/dy}
=\frac{\sqrt{\tau_0/\rho}}{d\bar u/dy}
\sqrt{1-\frac yR}.
\]
这就是题中所要求的表达式。结论检查：\(\sqrt{\tau_0/\rho}\) 的量纲为速度，除以速度梯度 \(d\bar u/dy\) 的量纲 \(T^{-1}\)，得到长度量纲；当 \(y\to R\) 接近管轴时，\(\tau\to0\)，该公式给 \(l\to0\)，说明该简单推导只是在剪应力大小分布与混合长模型下的形式结果，不能替代完整湍流闭合模型。`
  }
];
