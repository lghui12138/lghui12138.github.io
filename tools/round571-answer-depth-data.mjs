export const round571 = {
  round: 571,
  version: 'round571-answer-depth-ninth-pass-proof-ui-refresh-20260629',
  previousVersion: 'round570-answer-depth-eighth-pass-proof-ui-sync-20260629',
  generatedAt: '2026-06-29T08:45:00.000Z',
  realExamPreviousAnswerDepthRows: 122,
  realExamCumulativeAnswerDepthRows: 133,
  realExamRoundUpgradeRows: 12,
  realExamNewUniqueRows: 11,
  proofDepthRows181103: 422,
  referencePracticeRows181103: 400,
  sourceClueOnlyRows181103: 122,
  strictAnswerPdfProofRows: 0
};

export const realExamUpgrades = [
  {
    id: 'ocean-2025-04-source-02',
    diagnosis: '当前答案是提纲式串讲，只说要写控制方程、厚度、雷诺应力和复势，没有把边界层近似从 N-S 方程推到 Prandtl 方程，也没有给出压强梯度、von Karman 动量积分式、雷诺应力来源、相似准则和象方法的具体判据。',
    referenceAnswer: String.raw`设二维定常不可压 Newton 流体绕光滑壁面流动，\(x\) 沿壁面、\(y\) 为法向，外层速度为 \(U_e(x)\)，边界层厚度满足 \(\delta/L\ll1\)，Reynolds 数很大但壁面无滑移仍必须满足。由连续方程和 Navier-Stokes 方程作边界层量级近似，得
\[
\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}=0,
\qquad
u\frac{\partial u}{\partial x}+v\frac{\partial u}{\partial y}
=-\frac1\rho\frac{dp_e}{dx}+\nu\frac{\partial^2u}{\partial y^2}.
\]
外层近似无黏，Euler/Bernoulli 关系给出
\[
\frac{dp_e}{dx}=-\rho U_e\frac{dU_e}{dx},
\]
所以边界层动量方程也可写成
\[
u u_x+v u_y=U_e\frac{dU_e}{dx}+\nu u_{yy}.
\]
边界条件为：壁面 \(y=0\) 处 \(u=v=0\)，外缘 \(y\to\infty\) 处 \(u\to U_e(x)\)，并且 \(\partial p/\partial y\approx0\)，所以层内压力 \(p=p_e(x)\) 由外流给定。

位移厚度和动量厚度分别为
\[
\delta^*=\int_0^\infty\left(1-\frac{u}{U_e}\right)dy,
\qquad
\theta=\int_0^\infty\frac{u}{U_e}\left(1-\frac{u}{U_e}\right)dy.
\]
前者表示黏性减速造成的等效流量亏损，后者表示动量通量亏损。将动量方程沿 \(y\) 积分，并利用连续方程、壁面无穿透、外缘匹配和壁面剪应力
\[
\tau_w=\mu\left(\frac{\partial u}{\partial y}\right)_{y=0},
\]
可得 von Karman 动量积分式
\[
\frac{\tau_w}{\rho}=\frac{d(U_e^2\theta)}{dx}
+U_e\frac{dU_e}{dx}\delta^*,
\]
等价地
\[
\frac{C_f}{2}=\frac{d\theta}{dx}
+\left(2+\frac{\delta^*}{\theta}\right)\frac{\theta}{U_e}\frac{dU_e}{dx}.
\]
这说明壁面剪应力由动量厚度增长和外流加减速共同决定。

湍流中作 Reynolds 分解 \(u_i=U_i+u_i'\)，平均动量方程出现
\[
-\rho\overline{u_i'u_j'},
\]
它来自脉动速度相关造成的湍动动量输运；黏性剪应力 \(\mu\,dU/dy\) 来自分子黏性，两者来源不同但都贡献总剪应力。相似方面，几何相似要求长度比例一致，运动相似要求对应速度和加速度场成比例，动力相似要求无量纲控制方程中的主要参数相同，如 \(Re,Fr,Eu\) 等。

势流中若 \(\nabla\times\mathbf V=0\)，则 \(\mathbf V=\nabla\phi\)；若又不可压，则 \(\nabla\cdot\mathbf V=0\) 推出 \(\nabla^2\phi=0\)。二维流可取复势 \(W=\phi+i\psi\)，固壁无穿透要求 \(\mathbf V\cdot\mathbf n=0\)，即壁面为 \(\psi=\) 常数的流线。象方法是在边界另一侧布置镜像源、汇、涡或偶极，使壁面法向速度相互抵消，从而满足无穿透条件。

结论检查：边界层内保留黏性剪切而外层可近似势流，雷诺应力不等于黏性应力，相似不能只写形状相似；这正是第 99-100 页综合短答的主线。`,
    boundaryNote: 'strictAnswerPdfProof=false；该题为 2025 补充派生行，当前记录也标明不属于 2000-2024 原题册答案 PDF 逐字证明，只能作为独立推导型参考答案。'
  },
  {
    id: 'ocean-2005-02-03',
    diagnosis: '当前答案结论正确但偏短：没有先写原组题速度场，也没有从质量守恒说明为什么散度为零就是不可压缩判据。',
    referenceAnswer: String.raw`原组题速度场为
\[
u=y+2x,\qquad v=1-x-2y,\qquad w=0.
\]
流体质量守恒的微分式为
\[
\frac{D\rho}{Dt}+\rho\nabla\cdot\mathbf V=0.
\]
不可压缩流动的运动学含义是流体微团体积不变；对密度恒定或沿质点 \(D\rho/Dt=0\) 的流动，连续方程化为
\[
\nabla\cdot\mathbf V=0.
\]
现在对该光滑二维速度场逐项求导：
\[
\frac{\partial u}{\partial x}=2,\qquad
\frac{\partial v}{\partial y}=-2.
\]
又因 \(w=0\) 且无 \(z\) 向速度变化，
\[
\frac{\partial w}{\partial z}=0.
\]
因此
\[
\nabla\cdot\mathbf V
=\frac{\partial u}{\partial x}
+\frac{\partial v}{\partial y}
+\frac{\partial w}{\partial z}
=2-2+0=0.
\]
代回连续方程得 \(D\rho/Dt=0\)，说明任一随体微团没有净体积膨胀率，密度沿质点不变，故该流动满足不可压缩条件。

结论检查：这只证明不可压缩，不证明无旋；速度分量随坐标变化并不妨碍散度为零。`,
    boundaryNote: 'strictAnswerPdfProof=false；该记录为原文组题拆分，未见原答案 PDF 逐字证明，速度场依据同年相邻拆题采分点与当前偏导关系确认。'
  },
  {
    id: 'ocean-2021-07-full',
    diagnosis: '当前答案方向对，但显示过压缩：没有清楚定义坐标、端点压强、等截面与无损假设，也没有逐步说明为何开启瞬间速度为零但加速度不为零。',
    referenceAnswer: String.raw`按常见图示设 \(AB\) 为竖直段、\(BC\) 为水平段，\(AB=BC=H\)。取 \(A\) 为竖直段上端，表压 \(p_A=0\)；\(C\) 开启后表压 \(p_C=0\)。令 \(z\) 自 \(B\) 向上量，则 \(A\) 点 \(z=H\)，\(B,C\) 高程 \(z=0\)。

忽略黏性和局部损失，管径相同，液体不可压，因此开启瞬间全管具有同一速度 \(v(t)\) 和同一切向加速度
\[
a=\frac{dv}{dt}.
\]
在 \(t=0^+\) 时 \(v=0\)，所以动能项 \(v^2/2\) 为零，但 \(a\) 不为零。Euler 方程沿管轴积分可写为
\[
\int_1^2 a\,ds+\frac{p_2-p_1}{\rho}+g(z_2-z_1)=0.
\]
先从 \(A\) 到 \(C\) 积分。此时 \(s_{AC}=AB+BC=2H\)，\(p_A=p_C=0\)，\(z_C-z_A=-H\)，故
\[
2Ha-gH=0,
\qquad a=\frac g2.
\]
再取竖直段中高度为 \(z\) 的点 \(P\)，从 \(A\) 到 \(P\) 积分。管轴距离为 \(H-z\)，\(p_A=0\)，\(z_P-z_A=z-H\)，于是
\[
a(H-z)+\frac{p(z)}{\rho}+g(z-H)=0.
\]
代入 \(a=g/2\)，得
\[
\frac{p(z)}{\rho}=(g-a)(H-z)=\frac{g(H-z)}{2},
\qquad
p(z)=\frac12\rho g(H-z).
\]
\(C\) 尚未开启、液体静止时，同一点静压满足
\[
\frac{p_0(z)}{\rho}+g(z-H)=0,
\qquad
p_0(z)=\rho g(H-z).
\]
因此
\[
p(z)=\frac12p_0(z),
\]
竖直管内任一点在开启瞬间的表压均为原来的一半。

结论检查：开启瞬间速度为零不代表加速度为零；压强减半来自总管长 \(2H\) 共同分摊竖直重力水头 \(H\)。`,
    boundaryNote: 'strictAnswerPdfProof=false；当前题面文本没有配图，A/B/C 相对位置和表压零端点需以原题图为准；上述按现有答案脉络采用 AB 竖直、BC 水平、等截面、无损失、端点表压为 0 的常见模型推导。'
  },
  {
    id: 'ocean-2016-02',
    diagnosis: '现有答案已指出外区无旋、内区有旋，但证明链仍偏薄：没有从稳态无粘 Euler 方程推出沿流线成立与无旋区域跨流线成立的区别，内外区涡量计算也不够完整。',
    referenceAnswer: String.raw`假设流体为定常、不可压、无黏，体力势能项可忽略或已并入常数，且讨论区域不跨越速度场奇点。稳态无粘 Euler 方程可写成
\[
\nabla\left(\frac{p}{\rho}+\frac{V^2}{2}\right)
=\mathbf V\times(\nabla\times\mathbf V).
\]
因此 Bernoulli 函数
\[
B=\frac{p}{\rho}+\frac{V^2}{2}
\]
一般只沿同一条流线为常数；若某连通区域内 \(\nabla\times\mathbf V=0\)，则 \(\nabla B=0\)，可在该无旋区域内取同一个 Bernoulli 常数。

对轴对称纯环向流
\[
\mathbf V=V_\theta(r)\mathbf e_\theta,
\]
轴向涡量为
\[
\omega_z=\frac1r\frac{d(rV_\theta)}{dr}.
\]
内区 \(r<R\) 中 \(V_\theta=\omega r\)，所以
\[
\omega_z=\frac1r\frac{d(\omega r^2)}{dr}=2\omega\ne0.
\]
内区是刚体旋转的有旋流，不能把 \(p/\rho+V^2/2=C\) 作为跨流线统一常数使用。由于流线是半径固定的圆 \(r=\text{常数}\)，沿单条圆形流线速度和压强不随 \(\theta\) 变，沿线 Bernoulli 只给出平凡常数，不能推出径向压强分布。内区压强应由径向动量平衡
\[
\frac{dp}{dr}=\rho\frac{V_\theta^2}{r}=\rho\omega^2r
\]
积分得到
\[
p=p(0)+\frac12\rho\omega^2r^2.
\]
外区 \(r\ge R\) 中
\[
V_\theta=\frac{\omega R^2}{r},
\]
所以
\[
\omega_z=\frac1r\frac{d(\omega R^2)}{dr}=0.
\]
除中心奇点不属于外区外，外区为无旋自由涡，故在外部连通流场内可用同一个 Bernoulli 常数：
\[
\frac{p}{\rho}+\frac{V_\theta^2}{2}=C,
\qquad
\frac{p}{\rho}+\frac{\omega^2R^4}{2r^2}=C.
\]

结论检查：外区无旋，Bernoulli 可跨流线使用；内区有旋，只能沿各自圆形流线作沿线判断，径向压力不能靠统一 Bernoulli 常数得到，而应靠径向平衡方程得到。`,
    boundaryNote: '这是 derived/reference-answer 证明深度升级，不是 strictAnswerPdfProof；若后续入库，应保留“外区无旋跨流线、内区有旋仅沿流线”的边界。'
  },
  {
    id: 'ocean-2000-07-03',
    diagnosis: '现有答案只给出了 von Karman 动量积分方程和两个厚度定义，几乎没有导出过程，缺少边界层方程、外流 Bernoulli 关系、边界条件、积分恒等式与壁面剪应力项来源。',
    referenceAnswer: String.raw`假设为定常二维不可压边界层，\(x\) 沿壁面、\(y\) 垂直壁面，外缘速度为 \(U_e(x)\)，边界层内压强沿法向近似不变，即 \(p(x,y)=p_e(x)\)。壁面满足无滑移、无穿透 \(u=v=0\)，外缘满足 \(u\to U_e\)、\(\partial u/\partial y\to0\)。边界层连续方程和动量方程为
\[
\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}=0,
\qquad
u\frac{\partial u}{\partial x}+v\frac{\partial u}{\partial y}
=-\frac1\rho\frac{dp_e}{dx}
+\nu\frac{\partial^2u}{\partial y^2}.
\]
外层无粘流满足 Bernoulli 关系
\[
U_e\frac{dU_e}{dx}=-\frac1\rho\frac{dp_e}{dx},
\]
故边界层动量方程可写成
\[
\nu u_{yy}=u u_x+v u_y-U_eU_e'.
\]
从 \(0\) 到 \(\infty\) 积分，并用 \(\nu u_y|_\infty=0\)、\(\tau_w=\mu u_y|_0=\rho\nu u_y|_0\)，得
\[
\int_0^\infty (u u_x+v u_y-U_eU_e')\,dy
=-\frac{\tau_w}{\rho}.
\]
处理含 \(v\) 的项时，用连续方程 \(v_y=-u_x\)，并对 \(v(u-U_e)\) 分部积分；由于壁面 \(v=0\)、外缘 \(u-U_e\to0\)，边界项为零，因此
\[
\int_0^\infty v u_y\,dy
=\int_0^\infty (u-U_e)u_x\,dy.
\]
代回并整理，可得
\[
\frac{\tau_w}{\rho}
=\int_0^\infty\left[U_eU_e'+(U_e-2u)u_x\right]dy.
\]
另一方面定义动量亏损积分
\[
U_e^2\theta=\int_0^\infty u(U_e-u)\,dy,
\]
则
\[
\frac{d}{dx}(U_e^2\theta)+U_eU_e'\delta^*
=\int_0^\infty\left[U_eU_e'+(U_e-2u)u_x\right]dy.
\]
于是得到 von Karman 动量积分方程
\[
\boxed{\frac{d}{dx}(U_e^2\theta)+U_e\frac{dU_e}{dx}\delta^*
=\frac{\tau_w}{\rho}}.
\]
展开也可写成
\[
\boxed{U_e^2\frac{d\theta}{dx}
+U_e\frac{dU_e}{dx}(2\theta+\delta^*)
=\frac{\tau_w}{\rho}}.
\]
其中
\[
\delta^*=\int_0^\infty\left(1-\frac{u}{U_e}\right)dy,
\qquad
\theta=\int_0^\infty\frac{u}{U_e}\left(1-\frac{u}{U_e}\right)dy.
\]
排移厚度表示边界层内速度亏损造成的等效流量亏损，动量厚度表示边界层造成的动量通量亏损。

结论检查：零压梯度 \(U_e'=0\) 时方程退化为 \(\tau_w/\rho=U_e^2d\theta/dx\)，说明壁面剪应力正对应下游动量亏损厚度增加，量纲也均为 \(m^2/s^2\)。`,
    boundaryNote: '这是补足推导链的参考答案；默认无吹吸、定常二维不可压边界层，若原题另有压力梯度或边界条件，应按题面修正。'
  },
  {
    id: 'ocean-2023-06',
    diagnosis: '现有答案主要计算结果基本正确，但拉格朗日观点求加速度没有单独展开，流线固定时刻条件、速度场奇点、t=0 退化和 Euler/Lagrange 一致性检查也不够明确。',
    referenceAnswer: String.raw`速度场为
\[
\mathbf V=(u,v,w)
=\left(\frac{t}{1+x},\frac{2t}{1+x},\frac{3t}{1+x}\right),
\qquad x\ne-1.
\]
一、Euler 观点。加速度场为
\[
\mathbf a=\frac{\partial\mathbf V}{\partial t}+(\mathbf V\cdot\nabla)\mathbf V.
\]
各分量只依赖 \(x,t\)。对任一分量 \(q_c=ct/(1+x)\)，其中 \(c=1,2,3\)，有
\[
\frac{\partial q_c}{\partial t}=\frac{c}{1+x},
\qquad
\frac{\partial q_c}{\partial x}=-\frac{ct}{(1+x)^2}.
\]
又 \(u=t/(1+x)\)，所以
\[
a_c=\frac{c}{1+x}+u\left(-\frac{ct}{(1+x)^2}\right)
=c\left[\frac{1}{1+x}-\frac{t^2}{(1+x)^3}\right].
\]
因此
\[
a_x=\frac{1}{1+x}-\frac{t^2}{(1+x)^3},
\]
\[
a_y=\frac{2}{1+x}-\frac{2t^2}{(1+x)^3},
\qquad
a_z=\frac{3}{1+x}-\frac{3t^2}{(1+x)^3}.
\]

二、流线。流线是在固定时刻 \(t=t_s\) 的空间曲线；当 \(t_s\ne0\) 时，
\[
\frac{dx}{u}=\frac{dy}{v}=\frac{dz}{w}.
\]
于是
\[
\frac{dy}{dx}=\frac{v}{u}=2,
\qquad
\frac{dz}{dx}=\frac{w}{u}=3,
\]
积分得
\[
y-2x=C_1,\qquad z-3x=C_2.
\]
当 \(t_s=0\) 时速度场处处为零，流线方向退化，不宜按方向场唯一确定；上式可视为 \(t_s\ne0\) 时的结果。

三、迹线与 Lagrange 观点。迹线是某一质点随时间的轨迹，满足
\[
\frac{dx}{dt}=\frac{t}{1+x},
\qquad
\frac{dy}{dt}=\frac{2t}{1+x},
\qquad
\frac{dz}{dt}=\frac{3t}{1+x}.
\]
由第一式得
\[
(1+x)dx=t\,dt,
\qquad
\frac12d[(1+x)^2]=\frac12d(t^2),
\]
所以
\[
(1+x)^2-t^2=C_3.
\]
再由
\[
\frac{dy}{dt}=2\frac{dx}{dt},
\qquad
\frac{dz}{dt}=3\frac{dx}{dt}
\]
得到
\[
y-2x=C_1,\qquad z-3x=C_2.
\]
若质点在 \(t=t_0\) 时位于 \((x_0,y_0,z_0)\)，则
\[
C_1=y_0-2x_0,\quad C_2=z_0-3x_0,\quad C_3=(1+x_0)^2-t_0^2.
\]
沿该质点轨迹直接求 Lagrange 加速度：
\[
\frac{d^2x}{dt^2}
=\frac{d}{dt}\left(\frac{t}{1+x}\right)
=\frac{1}{1+x}-\frac{t}{(1+x)^2}\frac{dx}{dt}
=\frac{1}{1+x}-\frac{t^2}{(1+x)^3}.
\]
又 \(y-2x=C_1\)、\(z-3x=C_2\)，故
\[
\frac{d^2y}{dt^2}=2\frac{d^2x}{dt^2},
\qquad
\frac{d^2z}{dt^2}=3\frac{d^2x}{dt^2}.
\]
这正与 Euler 加速度场在质点当前位置处的取值一致。

结论检查：流线是固定时刻的空间方向线，迹线是质点随时间积分得到的轨迹；本题因速度方向比例始终为 \(1:2:3\)，二者共享 \(y-2x\)、\(z-3x\) 两个空间关系，但迹线还必须包含时间关系 \((1+x)^2-t^2=C_3\)。`,
    boundaryNote: '这是回忆版题目的 derived/reference-answer 深化；需保留 \(x\ne-1\)、固定时刻流线、\(t=0\) 退化和初始标号常数说明。'
  },
  {
    id: 'ocean-2008-02',
    diagnosis: '现有数值结论 \((a_x,a_y)=(0,50)\) 正确；证明深度需要补明物质导数公式、一阶差分来源、空间步长/时间步长、正负号和题面时间边界。',
    referenceAnswer: String.raw`采用 Euler 描述，流体质点加速度等于速度场的物质导数。二维速度 \(\mathbf V=(u,v)\) 时，
\[
a_x=\frac{\partial u}{\partial t}
+u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y},
\]
\[
a_y=\frac{\partial v}{\partial t}
+u\frac{\partial v}{\partial x}
+v\frac{\partial v}{\partial y}.
\]
题目要求 \(t=0,(0,0)\) 处，故代入该点速度 \(u=20,\ v=10\)。

把题给离散空间数据视作该点附近的一阶差分，且 \(\Delta x=\Delta y=1\)，则
\[
\frac{\partial u}{\partial x}\approx u(1,0)-u(0,0)=22-20=2,
\]
\[
\frac{\partial u}{\partial y}\approx u(0,1)-u(0,0)=14-20=-6,
\]
\[
\frac{\partial v}{\partial x}\approx v(1,0)-v(0,0)=15-10=5,
\]
\[
\frac{\partial v}{\partial y}\approx v(0,1)-v(0,0)=5-10=-5.
\]
时间差分在同一点给出 \(\Delta t=1/2\)，故
\[
\frac{\partial u}{\partial t}\approx\frac{30-20}{1/2}=20,
\qquad
\frac{\partial v}{\partial t}\approx\frac{10-10}{1/2}=0.
\]
于是
\[
a_x=20+20\cdot2+10(-6)=0,
\]
\[
a_y=0+20\cdot5+10(-5)=50.
\]
因此 \(t=0,(0,0)\) 处质点加速度为
\[
(a_x,a_y)=(0,50).
\]
结论检查：\(a_x\) 中局地加速度 20、\(x\) 向对流加速度 40 与 \(y\) 向对流项 -60 正好相消；\(a_y\) 由 \(x\) 向对流 100 和 \(y\) 向对流 -50 得 50。`,
    boundaryNote: '按题库现有答案边界，这是独立差分推导，不是严格答案 PDF 逐字证明；若原题明确三点空间数据不是 t=0 邻域数据，则 t=0 的空间导数不能由题面唯一确定。'
  },
  {
    id: 'ocean-2025-01',
    diagnosis: '现有答案主干正确，但仍应补足 Prandtl 方程适用条件、压力匹配、厚度物理意义、Re 数尺度解释、雷诺应力张量含义和复势/象方法的边界条件逻辑。',
    referenceAnswer: String.raw`1）取 \(x\) 沿壁面、\(y\) 垂直壁面，讨论二维、定常、不可压、常物性、高 Reynolds 数、边界层厚度 \(\delta\) 远小于特征长度 \(L\) 的近壁流动。Prandtl 边界层近似的基本方程为
\[
\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}=0,
\]
\[
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
=-\frac1\rho\frac{dp_e}{dx}
+\nu\frac{\partial^2u}{\partial y^2},
\qquad
\frac{\partial p}{\partial y}=0.
\]
因此边界层内压力 \(p(x,y)\approx p_e(x)\)，由外部无黏流决定。边界条件为壁面 \(y=0\) 处无滑移、无穿透，即 \(u=v=0\)；边界层外缘 \(y\to\infty\) 或 \(y=\delta\) 处与外流匹配，即 \(u\to U_e(x),\ p\to p_e(x)\)。

位移厚度和动量厚度为
\[
\delta^*=\int_0^\infty\left(1-\frac{u}{U_e}\right)dy,
\qquad
\theta=\int_0^\infty\frac{u}{U_e}\left(1-\frac{u}{U_e}\right)dy.
\]
\(\delta^*\) 表示边界层速度亏损使外流等效向外位移的厚度；\(\theta\) 表示因速度亏损造成的动量通量损失。

2）\(Re\) 很大时，整体黏性项相对惯性项可小，但壁面无滑移要求速度从 0 在很薄距离 \(\delta\) 内变到外流速度 \(U_e\)，法向速度梯度很大，\(\nu\partial^2u/\partial y^2\) 可与 \(u\partial u/\partial x\) 同量级。因此外部可近似为理想流，近壁仍必须保留黏性，边界层理论正是用来连接外部势流、壁面阻力、分离和传热传质问题。黏性应力来自分子运动造成的剪切动量输运，层流中典型形式为
\[
\tau=\mu\frac{\partial u}{\partial y}.
\]
雷诺应力来自湍流脉动对平均动量的统计输运，二维剪切项常写为
\[
-\rho\overline{u'v'},
\]
一般张量为 \(-\rho\overline{u_i'u_j'}\)。它不是分子黏性应力，而是湍流平均方程中的表观动量通量，需要湍流模型闭合。

3）对常密度不可压流，连续方程给出 \(\nabla\cdot\mathbf V=0\)；无旋流的判据是 \(\nabla\times\mathbf V=0\)。二维不可压流可引入流函数 \(\psi\)，使
\[
u=\frac{\partial\psi}{\partial y},\qquad
v=-\frac{\partial\psi}{\partial x},
\]
自动满足连续方程；无旋流可引入速度势 \(\phi\)，使 \(\mathbf V=\nabla\phi\)。若流动同时二维、不可压、无旋，则 \(\phi\) 和 \(\psi\) 是调和共轭函数，可组成复势
\[
W(z)=\phi+i\psi,
\]
且在常用约定下 \(dW/dz=u-iv\)。象方法处理无穿透边界的思想是：在实际流域外放置镜像源、汇、涡或偶极，使固壁成为 \(\psi=\) 常数的流线，从而壁面法向速度为零。

结论检查：本题要把边界层、湍流应力、相似准则和势流边界法分层说明；不能把雷诺应力当黏性应力，也不能只列复势符号不说明无穿透条件。`,
    boundaryNote: '这是 2025 补充派生题的独立推导型参考答案；可称 verified-derived，但不能称原始 2000-2024 题册答案或严格答案 PDF 逐字证明。'
  },
  {
    id: 'ocean-2003-06',
    diagnosis: '现有答案方向正确，覆盖分区思想、Prandtl 方程和边界条件；升级点是把适用假设、尺度推理、外流压力关系、边界条件完整性和非定常变式说清。',
    referenceAnswer: String.raw`边界层理论的基本内容是：在大 Reynolds 数绕固体壁面流动中，流场可分为近壁薄黏性边界层和边界层外的主流区。外部主流区黏性影响较小，可近似按无黏流、势流或 Euler 方程处理；但壁面必须满足无滑移和无穿透条件，速度从壁面处的 0 在很薄的边界层内迅速过渡到外流速度 \(U_e(x)\)，所以法向速度梯度很大，黏性剪切不能忽略。

边界层内法向尺度 \(\delta\) 远小于流向尺度 \(L\)，通常有 \(\delta/L\ll1\)，\(u\) 的量级远大于 \(v\)。法向二阶黏性扩散 \(\nu\partial^2u/\partial y^2\) 保留，而流向二阶黏性扩散相对较小可忽略；压力沿法向近似不变，边界层压力由外部主流给定。

以二维、定常、不可压、常物性流动为基本情形，Prandtl 边界层方程为
\[
\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}=0,
\]
\[
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
=-\frac1\rho\frac{\partial p}{\partial x}
+\nu\frac{\partial^2u}{\partial y^2},
\]
\[
\frac{\partial p}{\partial y}=0.
\]
因为 \(\partial p/\partial y=0\)，边界层内 \(p(x,y)=p_e(x)\)，且外部定常无黏流给出
\[
\frac{dp_e}{dx}=-\rho U_e\frac{dU_e}{dx},
\]
所以动量方程也可写为
\[
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
=U_e\frac{dU_e}{dx}
+\nu\frac{\partial^2u}{\partial y^2}.
\]
边界条件为：壁面 \(y=0\) 处无滑移、无穿透，\(u=0,\ v=0\)；外缘 \(y\to\infty\) 或 \(y=\delta\) 处与外流匹配，\(u\to U_e(x),\ p\to p_e(x)\)。若题目讨论非定常边界层，则在流向动量方程左侧再加 \(\partial u/\partial t\)，其余分区思想和边界条件不变。

答题时应同时写出分区思想、方程组、压力匹配和壁面/外缘边界条件；只写“边界层很薄”或只写一条动量方程不完整。`,
    boundaryNote: '按当前题库记录，此题题面来自 2003 年第 6 题整理，答案为教材/笔记型独立复核参考；当前对象未给出 strictAnswerPdfProof 字段，不能升级为严格答案 PDF 逐字证明。'
  },
  {
    id: 'ocean-2002-08-01',
    diagnosis: '当前答案抓住了边界层分区、Prandtl 方程和应用例子，但仍像合并题母答案：边界层方程缺少由高 Re 薄层尺度推出的闭合说明，也没有交代各量量纲、外缘压力如何由外部势流给定、边界条件为什么足够。',
    referenceAnswer: String.raw`边界层理论的核心是：在大 Reynolds 数
\[
Re=\frac{UL}{\nu}\gg1
\]
的绕流中，黏性并非处处都可忽略。由于固壁无滑移条件，壁面附近形成厚度 \(\delta\) 远小于物体特征长度 \(L\) 的薄层，层内速度由壁面 \(u=0\) 迅速过渡到外部主流 \(U_e(x)\)，速度梯度很大，黏性剪切与惯性项同量级；层外速度梯度较小，可近似按无黏 Euler 流或势流求压力分布。

量纲上，\(u,v,U_e\) 的量纲为 \(L/T\)，\(x,y,\delta,L\) 为 \(L\)，\(p\) 为 \(M/(LT^2)\)，\(\rho\) 为 \(M/L^3\)，\(\nu\) 为 \(L^2/T\)。二维定常不可压边界层中，由连续方程
\[
\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}=0
\]
可知若 \(u\sim U,\ x\sim L,\ y\sim\delta\)，则 \(v\sim U\delta/L\)。\(x\) 动量方程中惯性量级为 \(U^2/L\)，法向黏性项 \(\nu\partial^2u/\partial y^2\) 的量级为 \(\nu U/\delta^2\)；在边界层内二者同阶，得到
\[
\frac{\delta}{L}\sim Re^{-1/2},
\]
这说明边界层很薄但不能忽略黏性。

Prandtl 边界层基本方程可写为
\[
\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}=0,
\]
\[
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
=-\frac1\rho\frac{dp_e}{dx}
+\nu\frac{\partial^2u}{\partial y^2},
\]
\[
\frac{\partial p}{\partial y}=0.
\]
也就是说层内压力沿法向近似不变，\(p(x,y)=p_e(x)\)，压力梯度由外部无黏主流决定，常写为
\[
\frac{dp_e}{dx}=-\rho U_e\frac{dU_e}{dx}.
\]
边界条件为壁面 \(y=0\) 处无滑移、无穿透：
\[
u=0,\qquad v=0;
\]
外缘 \(y\to\infty\) 或 \(y=\delta\) 处
\[
u\to U_e(x),\qquad \frac{\partial u}{\partial y}\to0,
\]
并结合入口或前缘条件确定解。

应用上，平板边界层可求壁面切应力
\[
\tau_w=\mu\left(\frac{\partial u}{\partial y}\right)_{y=0}
\]
和摩擦阻力；翼型、圆柱、扩压管中可用逆压梯度下壁面剪切趋零判断分离；管道入口段、船体和水工结构表面阻力估算也依赖边界层思想。

结论检查：边界层理论把高 \(Re\) 流动拆成“外部无黏压力场”和“近壁黏性动量扩散层”两个相互匹配的问题，从而既保留无滑移条件，又避免直接求解完整 N-S 方程。`,
    boundaryNote: '这是派生参考答案/证明深度建议，只覆盖 2002 年第 8 题第 1 小题的边界层理论；不把题母中的 Bernoulli 第 2 小题并入本答案，也不等同 strictAnswerPdfProof。'
  },
  {
    id: 'ocean-2018-01-01',
    diagnosis: '当前答案已有 Re 表达式、惯性/黏性量级比和 Reynolds 染色实验现象，但证明闭合还可加强：量纲消去、从 N-S 方程无量纲化得到 Re 的位置、圆管临界值适用边界和物理判据仍偏简写。',
    referenceAnswer: String.raw`Reynolds 数是表示惯性作用与黏性作用相对强弱的无量纲数。取特征速度 \(V_c\)、特征长度 \(L\)、密度 \(\rho\)、动力黏度 \(\mu\)、运动黏度 \(\nu=\mu/\rho\)，则
\[
Re=\frac{\rho V_cL}{\mu}=\frac{V_cL}{\nu}.
\]
量纲检验为：\(\rho\) 的量纲 \(M/L^3\)，\(V_c\) 为 \(L/T\)，\(L\) 为 \(L\)，\(\mu\) 为 \(M/(LT)\)，因此
\[
\left[\frac{\rho V_cL}{\mu}\right]
=\frac{(M/L^3)(L/T)L}{M/(LT)}=1,
\]
故 \(Re\) 无量纲。

其来源可由不可压 N-S 方程量级化看出：惯性项 \(\rho(\mathbf V\cdot\nabla)\mathbf V\) 的量级约为 \(\rho V_c^2/L\)，黏性项 \(\mu\nabla^2\mathbf V\) 的量级约为 \(\mu V_c/L^2\)，二者之比为
\[
\frac{\rho V_c^2/L}{\mu V_c/L^2}
=\frac{\rho V_cL}{\mu}=Re.
\]
若将方程无量纲化，黏性项前常出现 \(1/Re\)，因此 \(Re\) 大表示惯性和扰动保持能力强、黏性相对弱；\(Re\) 小表示黏性扩散和阻尼强，流动更易保持层流。

圆管流中常取 \(V_c\) 为截面平均速度 \(U\)，\(L\) 为管径 \(d\)，故
\[
Re=\frac{Ud}{\nu}.
\]
Reynolds 实验是在透明圆管中让水流通过，并从管轴附近注入细染色液观察流态：流速小、\(Re\) 小时，染色线细直稳定，流层互不强烈混合，为层流；增大流速后，染色线开始摆动、弯曲并间歇扩散，为过渡流；继续增大流速，染色液迅速弥散到全管断面，速度出现三维脉动和涡团，为湍流。

实验结论是：流态主要受 \(Re\) 控制，圆管中通常把 \(Re\approx2000\) 附近看作层流开始失稳的经验下临界范围，\(Re\) 足够大时趋于湍流；但临界 \(Re\) 不是普适常数，会受入口扰动、管壁粗糙度、初始条件、管道长度和实验安静程度影响。\(Re\) 也是相似准则：几何相似且主导力为惯性与黏性时，模型与原型 \(Re\) 相等，才可保证对应黏性流动形态相似。`,
    boundaryNote: '这是派生参考答案深度升级；临界值只按圆管经典实验给经验边界，不推广到所有外流、明渠流或强扰动装置；不等同 strictAnswerPdfProof。'
  },
  {
    id: 'ocean-2004-03',
    diagnosis: '当前答案列出了 Cauchy 方程、本构方程和不可压 N-S 形式，但仍偏公式罗列：没有从动量守恒说明应力散度含义，量纲和符号约定不足，本构方程适用前提、压应力/黏性偏应力分解、可压与不可压简化边界还不够闭合。',
    referenceAnswer: String.raw`运动方程本质上是连续介质微元的 Newton 第二定律，即“质量 × 加速度 = 质量力 + 表面力”。以速度矢量 \(\mathbf v=(u_1,u_2,u_3)\) 表示流速，物质导数
\[
\frac{D\mathbf v}{Dt}
=\frac{\partial\mathbf v}{\partial t}
+(\mathbf v\cdot\nabla)\mathbf v,
\]
则一般 Cauchy 运动方程为
\[
\rho\frac{D\mathbf v}{Dt}
=\rho\mathbf f+\nabla\cdot\boldsymbol\sigma.
\]
指标式为
\[
\rho\left(\frac{\partial u_i}{\partial t}
+u_j\frac{\partial u_i}{\partial x_j}\right)
=\rho f_i+\frac{\partial\sigma_{ij}}{\partial x_j}.
\]
其中 \(\rho D\mathbf v/Dt\) 是单位体积惯性力，量纲为 \(N/m^3\)；\(\rho\mathbf f\) 是单位体积质量力，例如重力 \(\rho\mathbf g\)；\(\sigma_{ij}\) 是应力张量，量纲 \(Pa=N/m^2\)，\(\partial\sigma_{ij}/\partial x_j\) 是应力对微元表面的合力密度。

将应力分为各向同性压应力和黏性应力：
\[
\sigma_{ij}=-p\delta_{ij}+\tau_{ij}.
\]
对各向同性 Newton 流体，黏性应力与变形率线性相关，本构方程为
\[
\tau_{ij}=2\mu e_{ij}+\lambda e_{kk}\delta_{ij},
\]
\[
e_{ij}=\frac12\left(\frac{\partial u_i}{\partial x_j}
+\frac{\partial u_j}{\partial x_i}\right),
\qquad
e_{kk}=\nabla\cdot\mathbf v.
\]
\(\mu,\lambda\) 的量纲均为 \(Pa\cdot s\)，\(e_{ij}\) 的量纲为 \(1/s\)，故 \(\tau_{ij}\) 量纲为 \(Pa\)。代入运动方程并取常黏度，可得
\[
\rho\frac{D\mathbf v}{Dt}
=\rho\mathbf f-\nabla p+\mu\nabla^2\mathbf v
+(\lambda+\mu)\nabla(\nabla\cdot\mathbf v).
\]
其中 \(\partial\mathbf v/\partial t\) 是当地加速度，\((\mathbf v\cdot\nabla)\mathbf v\) 是迁移加速度，\(-\nabla p\) 是压强梯度力，\(\mu\nabla^2\mathbf v\) 表示由速度曲率引起的剪切黏性扩散，\((\lambda+\mu)\nabla(\nabla\cdot\mathbf v)\) 表示体积变形或可压缩效应相关的黏性作用。

若流体不可压，\(\nabla\cdot\mathbf v=0\)，且 \(\mu\) 为常数，则化为不可压 Navier-Stokes 方程：
\[
\rho\frac{D\mathbf v}{Dt}
=\rho\mathbf f-\nabla p+\mu\nabla^2\mathbf v.
\]
再若黏性可忽略，则退化为 Euler 方程。适用边界是：以上本构关系要求连续介质、各向同性 Newton 流体、小尺度上应力与变形率线性相关；非 Newton 流体、强稀薄气体、强各向异性介质不能直接套用。求具体流动时还必须配合连续方程以及壁面无滑移/无穿透、自由面或远场等边界条件。`,
    boundaryNote: '这是派生参考答案/说明，不宣称来自原卷答案 PDF；若教材采用 Stokes 假设，可进一步令 λ=-2μ/3 或改写为含体黏度形式，但本题核心仍是 Cauchy 动量方程 + Newton 流体本构 + 不可压 N-S 简化。'
  }
];

export const proofDepthRewrites181103 = [
  {
    id: '181103-material-extracted-0482',
    diagnosis: '当前答案主线正确，但证明链仍偏短：没有先说明稳态、无黏、同一绝热线/多方常数 k 不变、出口压强等于大气压 p0、大容器内速度近似为 0 等边界条件。',
    referenceAnswer: String.raw`设气体沿细导管作稳态、无黏、绝热且同一多方关系的流动，状态方程为
\[
p=k\rho^\gamma,\qquad \gamma>1,
\]
其中 \(k\) 沿同一流线不变。忽略势能差时，可压缩 Bernoulli 积分为
\[
\frac{V^2}{2}+\int\frac{dp}{\rho}=C.
\]
由 \(p=k\rho^\gamma\) 得
\[
dp=\gamma k\rho^{\gamma-1}d\rho,
\]
所以
\[
\int\frac{dp}{\rho}
=\int\gamma k\rho^{\gamma-2}d\rho
=\frac{\gamma k}{\gamma-1}\rho^{\gamma-1}
=\frac{\gamma}{\gamma-1}\frac{p}{\rho}.
\]
取容器内状态为 \(c\)，出口状态为 \(e\)。大容器截面远大于细管，故 \(V_c\approx0\)；出口通向大气，故
\[
p_e=p_0,\qquad \rho_e=\rho,\qquad V_e=V.
\]
容器内压强 \(p_c=np_0\)。又因为同一绝热线满足
\[
\frac{p_c}{\rho_c^\gamma}
=\frac{p_e}{\rho^\gamma},
\]
即
\[
\frac{np_0}{\rho_c^\gamma}
=\frac{p_0}{\rho^\gamma},
\]
所以
\[
\rho_c=\rho n^{1/\gamma}.
\]
把 \(c,e\) 两点代入 Bernoulli 积分：
\[
\frac{\gamma p_c}{(\gamma-1)\rho_c}
=\frac{V^2}{2}
+\frac{\gamma p_0}{(\gamma-1)\rho}.
\]
于是
\[
\frac{V^2}{2}
=\frac{\gamma}{\gamma-1}
\left(\frac{np_0}{\rho_c}-\frac{p_0}{\rho}\right)
=\frac{\gamma p_0}{(\gamma-1)\rho}
\left(n^{1-1/\gamma}-1\right).
\]
两边乘以 2，得到
\[
V^2=\frac{2\gamma p_0}{(\gamma-1)\rho}
\left(n^{1-1/\gamma}-1\right).
\]
结论检查：\(n=1\) 时内外压强相同，右端为 0，流速为 0；\(p_0/\rho\) 的量纲为速度平方；\(n\ge1\) 时右端非负，符合物理边界。`,
    boundaryNote: '这是基于题面、状态方程和流体力学方程的派生重证；未核对原答案 PDF 的页码、原文 span、截图/bbox、hash 或冲突排除证据，因此不是 strict 原答案 PDF proof。'
  },
  {
    id: '181103-material-extracted-0030',
    diagnosis: '当前答案给出了正确目标式，但证明链跳过了两处关键步骤：一是物质线元随体变化公式没有从相邻质点速度差推出；二是从叉乘微分到 Levi-Civita 结果只写结论。',
    referenceAnswer: String.raw`设速度场 \(\mathbf V(\mathbf x,t)\) 至少一阶连续，面元由同一组流体质点构成。取面元上两条随体微线元 \(\mathbf a,\mathbf b\)，定义有向面积矢量
\[
\delta\mathbf S=\mathbf a\times\mathbf b.
\]
相邻两质点间距 \(\mathbf a\) 的随体变化由速度差给出：
\[
\frac{Da_i}{Dt}
=V_i(\mathbf x+\mathbf a,t)-V_i(\mathbf x,t)
\approx\frac{\partial V_i}{\partial x_j}a_j.
\]
同理
\[
\frac{Db_i}{Dt}
=\frac{\partial V_i}{\partial x_j}b_j.
\]
于是
\[
\frac{D\delta\mathbf S}{Dt}
=\frac{D(\mathbf a\times\mathbf b)}{Dt}
=\frac{D\mathbf a}{Dt}\times\mathbf b
+\mathbf a\times\frac{D\mathbf b}{Dt}.
\]
令 \(A_{ij}=\partial V_i/\partial x_j\)，则
\[
\frac{D\delta\mathbf S}{Dt}
=(A\mathbf a)\times\mathbf b+\mathbf a\times(A\mathbf b).
\]
对任意 \(\mathbf a,\mathbf b\) 有恒等式
\[
(A\mathbf a)\times\mathbf b+\mathbf a\times(A\mathbf b)
=\left[(\operatorname{tr}A)I-A^T\right](\mathbf a\times\mathbf b).
\]
分量写法为
\[
\varepsilon_{ijk}A_{jl}a_lb_k
+\varepsilon_{ijk}a_jA_{kl}b_l
=(A_{kk}\delta_{im}-A_{mi})\varepsilon_{mnp}a_nb_p.
\]
因 \(\delta S_m=\varepsilon_{mnp}a_nb_p\)，得到
\[
\frac{D(\delta S_i)}{Dt}
=\left(\frac{\partial V_k}{\partial x_k}\right)\delta S_i
-\frac{\partial V_m}{\partial x_i}\delta S_m.
\]
写成向量式，若采用 \(A=\nabla\mathbf V\) 且 \(A_{ij}=\partial V_i/\partial x_j\) 的约定，则
\[
\frac{D\delta\mathbf S}{Dt}
=(\nabla\cdot\mathbf V)\delta\mathbf S-(\nabla\mathbf V)^T\delta\mathbf S.
\]
若教材把 \((\nabla\mathbf V)_{ij}=\partial V_j/\partial x_i\)，同一结果写作
\[
\frac{D\delta\mathbf S}{Dt}
=(\nabla\cdot\mathbf V)\delta\mathbf S-(\nabla\mathbf V)\delta\mathbf S.
\]
适用条件是面元随体运动、速度梯度有限、面元不撕裂。结论检查：若 \(\mathbf V=\alpha\mathbf x\)，则 \(\nabla\cdot\mathbf V=3\alpha\)、\((\nabla\mathbf V)^T\delta\mathbf S=\alpha\delta\mathbf S\)，故 \(D\delta\mathbf S/Dt=2\alpha\delta\mathbf S\)，正对应面积按长度平方放大；若为刚体旋转，则 \(\nabla\cdot\mathbf V=0\)，公式给出面积矢量随刚体旋转而大小不变。`,
    boundaryNote: '这是基于题面和张量恒等式的派生重证；未核对原答案 PDF 的页码、原文 span、截图/bbox、hash 或冲突排除证据，因此不是 strict 原答案 PDF proof。'
  },
  {
    id: '181103-material-extracted-0246',
    diagnosis: '当前答案有最终式，但中间的积分化简过薄，而且写出的中间式量纲不一致；正确的未除以 U² 之前应为 τ_w/ρ，并需展开连续方程如何消去 v、移动边界项如何抵消。',
    referenceAnswer: String.raw`考虑二维、定常、不可压边界层，壁面坐标为 \(x\)，法向为 \(y\)，外缘速度为 \(U(x)\)。Prandtl 边界层方程和连续方程为
\[
u u_x+v u_y=U U'+\nu u_{yy},
\qquad
u_x+v_y=0,
\]
其中 \(U'=dU/dx\)，外缘压强梯度已由外流 Bernoulli 关系写成 \(UU'\)。边界条件为壁面无滑移、无穿透：
\[
u(x,0)=0,\qquad v(x,0)=0;
\]
边界层外缘 \(y=\delta(x)\) 处
\[
u(x,\delta)=U(x),\qquad u_y(x,\delta)=0.
\]
壁面剪应力为
\[
\tau_w=\mu u_y(x,0)=\rho\nu u_y(x,0).
\]
先用连续方程改写对流项：
\[
u u_x+v u_y=\frac{\partial(u^2)}{\partial x}
+\frac{\partial(uv)}{\partial y}.
\]
对 \(0\) 到 \(\delta\) 积分，并用 Leibniz 公式，得
\[
\int_0^\delta (u u_x+v u_y)dy
=\frac{d}{dx}\int_0^\delta u^2dy-U^2\delta'+Uv_\delta.
\]
又由连续方程积分得
\[
v_\delta=-\frac{d}{dx}\int_0^\delta u\,dy+U\delta'.
\]
代回后，左端化为
\[
\frac{d}{dx}\int_0^\delta u^2dy
-U\frac{d}{dx}\int_0^\delta u\,dy.
\]
右端积分为
\[
\int_0^\delta (U U'+\nu u_{yy})dy
=U U'\delta+\nu[u_y(\delta)-u_y(0)]
=U U'\delta-\frac{\tau_w}{\rho}.
\]
两边相等并整理，得到
\[
\frac{\tau_w}{\rho}
=\frac{d}{dx}\int_0^\delta u(U-u)dy
+U'\int_0^\delta (U-u)dy.
\]
定义位移厚度和动量厚度：
\[
\delta^*=\int_0^\delta\left(1-\frac{u}{U}\right)dy,
\qquad
\theta=\int_0^\delta\frac{u}{U}\left(1-\frac{u}{U}\right)dy.
\]
则
\[
\int u(U-u)dy=U^2\theta,
\qquad
\int(U-u)dy=U\delta^*.
\]
代入得
\[
\frac{\tau_w}{\rho}
=\frac{d(U^2\theta)}{dx}+UU'\delta^*
=U^2\frac{d\theta}{dx}+UU'(2\theta+\delta^*).
\]
再除以 \(U^2\)，得
\[
\frac{\tau_w}{\rho U^2}
=\frac{d\theta}{dx}
+\frac{2\theta+\delta^*}{U}\frac{dU}{dx}.
\]
这就是 Karman 动量积分方程。结论检查：零压梯度 \(U'=0\) 时化为 \(\tau_w=\rho U^2d\theta/dx\)；各项量纲均为无量纲长度导数，和左端 \(\tau_w/(\rho U^2)\) 一致。`,
    boundaryNote: '这是基于 Prandtl 边界层方程的派生重证，并指出当前中间式的量纲问题；未核对原答案 PDF 的页码、原文 span、截图/bbox、hash 或冲突排除证据，因此不是 strict 原答案 PDF proof。'
  },
  {
    id: '181103-material-extracted-0413',
    diagnosis: '当前答案能到结论，但证明链仍薄：直接引用旋度恒等式，没有展开 Levi-Civita 缩并；也没有说明单位常矢量带来的逐项条件。',
    referenceAnswer: String.raw`设采用右手直角坐标系和 Einstein 求和约定，
\[
\mathbf a=a_i\mathbf e_i,\qquad \mathbf n=n_i\mathbf e_i,
\]
且 \(\mathbf n\) 为单位常矢量，所以
\[
n_i n_i=1,\qquad \partial_j n_i=0.
\]
先展开第一项：
\[
\operatorname{grad}(\mathbf a\cdot\mathbf n)_i
=\partial_i(a_jn_j)=n_j\partial_i a_j.
\]
因此
\[
\mathbf n\cdot\operatorname{grad}(\mathbf a\cdot\mathbf n)
=n_i n_j\partial_i a_j.
\]
再展开旋度项：
\[
[\operatorname{rot}(\mathbf a\times\mathbf n)]_i
=\varepsilon_{ijk}\partial_j(\varepsilon_{klm}a_ln_m).
\]
利用
\[
\varepsilon_{ijk}\varepsilon_{klm}
=\delta_{il}\delta_{jm}-\delta_{im}\delta_{jl},
\]
得
\[
[\operatorname{rot}(\mathbf a\times\mathbf n)]_i
=(\delta_{il}\delta_{jm}-\delta_{im}\delta_{jl})
\partial_j(a_ln_m)
=\partial_j(a_i n_j)-\partial_j(a_j n_i).
\]
由于 \(\mathbf n\) 为常矢量，这化为
\[
n_j\partial_j a_i-n_i\partial_j a_j,
\]
即
\[
\operatorname{rot}(\mathbf a\times\mathbf n)
=(\mathbf n\cdot\nabla)\mathbf a-\mathbf n\,\operatorname{div}\mathbf a.
\]
于是
\[
\mathbf n\cdot\operatorname{rot}(\mathbf a\times\mathbf n)
=n_i n_j\partial_j a_i-(n_i n_i)\partial_j a_j
=n_i n_j\partial_j a_i-\operatorname{div}\mathbf a.
\]
两项相减得
\[
\mathbf n\cdot[\operatorname{grad}(\mathbf a\cdot\mathbf n)
-\operatorname{rot}(\mathbf a\times\mathbf n)]
=n_i n_j(\partial_i a_j-\partial_j a_i)
+\operatorname{div}\mathbf a.
\]
因为 \(n_i n_j\) 关于 \(i,j\) 对称，而 \(\partial_i a_j-\partial_j a_i\) 关于 \(i,j\) 反对称，二者完全收缩为零；也可将求和指标 \(i,j\) 互换后得到该项等于其相反数，故只能为零。因此
\[
\mathbf n\cdot[\operatorname{grad}(\mathbf a\cdot\mathbf n)
-\operatorname{rot}(\mathbf a\times\mathbf n)]
=\operatorname{div}\mathbf a.
\]
原式得证。`,
    boundaryNote: '结论依赖 n 为单位常矢量、a 至少一阶可微，并采用普通欧氏三维 grad/rot/div 定义。若 n 不是常矢量，会出现含 ∂n 的附加项；若 n 不是单位矢量，div a 前的系数也会改变。'
  },
  {
    id: '181103-material-extracted-0083',
    diagnosis: '当前答案抓住了 Lamb 形式，但证明链仍有符号边界问题：先取一种流函数约定再用“教材符号相反”补救，且没有从定常 Euler 方程逐步推出 Lamb 形式。',
    referenceAnswer: String.raw`设流体理想、不可压、密度 \(\rho\) 为常数，体力为保守力且单位质量体力写作 \(-\nabla\Pi\)。定常 Euler 方程为
\[
(\mathbf V\cdot\nabla)\mathbf V
=-\frac1\rho\nabla p-\nabla\Pi.
\]
利用向量恒等式
\[
(\mathbf V\cdot\nabla)\mathbf V
=\nabla\left(\frac{V^2}{2}\right)-\mathbf V\times\boldsymbol\omega,
\qquad
\boldsymbol\omega=\operatorname{rot}\mathbf V,
\]
代入得
\[
\nabla\left(\frac{V^2}{2}\right)-\mathbf V\times\boldsymbol\omega
=-\frac1\rho\nabla p-\nabla\Pi.
\]
移项得到 Lamb 形式
\[
\nabla\left(\frac p\rho+\frac{V^2}{2}+\Pi\right)
-\mathbf V\times\boldsymbol\omega=0.
\]
现在取二维不可压流的流函数约定
\[
u=\psi_y,\qquad v=-\psi_x,
\]
即
\[
\mathbf V=(\psi_y,-\psi_x,0).
\]
涡度为 \(\boldsymbol\omega=(0,0,\zeta)\)，其中
\[
\zeta=\frac{\partial v}{\partial x}-\frac{\partial u}{\partial y}.
\]
逐项计算叉乘：
\[
\mathbf V\times\boldsymbol\omega
=(\psi_y,-\psi_x,0)\times(0,0,\zeta)
=(-\zeta\psi_x,-\zeta\psi_y,0)
=-\zeta\nabla\psi.
\]
代回 Lamb 形式得
\[
\nabla\left(\frac p\rho+\frac{V^2}{2}+\Pi\right)+\zeta\nabla\psi=0.
\]
题设 \(\zeta=F'(\psi)\)，而
\[
\nabla F(\psi)=F'(\psi)\nabla\psi=\zeta\nabla\psi.
\]
所以
\[
\nabla\left(\frac p\rho+\frac{V^2}{2}+\Pi+F(\psi)\right)=0.
\]
在同一连通流场区域内，梯度为零说明括号内为空间常数，因此
\[
\frac p\rho+\frac{V^2}{2}+\Pi+F(\psi)=\text{const}.
\]
这样题式中的 \(+F(\psi)\) 不是额外假设，而是由流函数约定 \(u=\psi_y,\ v=-\psi_x\) 与 \(\zeta=F'(\psi)\) 共同决定。`,
    boundaryNote: '本重证采用体力 -∇Π、流函数 u=ψ_y 且 v=-ψ_x 的约定；若改用 u=-ψ_y、v=ψ_x，或把体力势号反过来，F 项或 Π 项符号会随约定改变。常数只在光滑且连通的定常区域内成立；非定常、变密度或非保守体力情形需改写。'
  },
  {
    id: '181103-material-extracted-0415',
    diagnosis: '当前答案方向基本正确，但证明链仍薄：没有先明确定义反对称张量与轴向矢量的号约定，对称部分为什么完全抵消只写了一行，最后 Levi-Civita 与叉乘的指标顺序也未展开。',
    referenceAnswer: String.raw`把二阶张量 \(P\) 分解为对称部分 \(S\) 与反对称部分 \(A\)：
\[
P=S+A,\qquad
S_{ij}=\frac12(P_{ij}+P_{ji}),\qquad
A_{ij}=\frac12(P_{ij}-P_{ji}).
\]
于是 \(S_{ij}=S_{ji}\)，\(A_{ij}=-A_{ji}\)。要求证的左边为
\[
L=\mathbf u\cdot(P\cdot\mathbf v)-\mathbf v\cdot(P\cdot\mathbf u)
=u_iP_{ij}v_j-v_iP_{ij}u_j.
\]
先看对称部分：
\[
L_S=u_iS_{ij}v_j-v_iS_{ij}u_j.
\]
第二项中交换哑指标 \(i,j\)，得
\[
v_iS_{ij}u_j=u_iS_{ji}v_j.
\]
因 \(S_{ji}=S_{ij}\)，所以
\[
L_S=u_iS_{ij}v_j-u_iS_{ij}v_j=0.
\]
故只有反对称部分有贡献。反对称部分为
\[
L_A=u_iA_{ij}v_j-v_iA_{ij}u_j.
\]
对第二项交换哑指标 \(i,j\)，得
\[
v_iA_{ij}u_j=u_iA_{ji}v_j=-u_iA_{ij}v_j,
\]
因此
\[
L_A=u_iA_{ij}v_j-(-u_iA_{ij}v_j)=2u_iA_{ij}v_j.
\]
按题中目标式采用反对称张量对应轴向矢量的约定
\[
A_{ij}=-\varepsilon_{ijk}\omega_k,
\]
等价地
\[
\omega_k=-\frac12\varepsilon_{kij}A_{ij}.
\]
代入得
\[
L=2u_i(-\varepsilon_{ijk}\omega_k)v_j
=-2\varepsilon_{ijk}u_iv_j\omega_k.
\]
由于 \(\varepsilon_{ijk}=\varepsilon_{kij}\)，且
\[
(\mathbf u\times\mathbf v)_k=\varepsilon_{kij}u_iv_j,
\]
所以
\[
\varepsilon_{ijk}u_iv_j=(\mathbf u\times\mathbf v)_k.
\]
于是
\[
L=-2\omega_k(\mathbf u\times\mathbf v)_k
=-2\boldsymbol\omega\cdot(\mathbf u\times\mathbf v).
\]
因此
\[
\mathbf u\cdot(P\cdot\mathbf v)-\mathbf v\cdot(P\cdot\mathbf u)
=-2\boldsymbol\omega\cdot(\mathbf u\times\mathbf v),
\]
原式得证。`,
    boundaryNote: '符号依赖约定 A_ij=-ε_ijkω_k；若教材采用 A_ij=+ε_ijkω_k，右端会变为 +2ω·(u×v)。证明默认右手直角坐标系、Euclidean 点积和任意矢量 u、v。'
  }
];
