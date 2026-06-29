export const round572 = {
  round: 572,
  date: '2026-06-29',
  version: 'round572-answer-depth-tenth-pass-proof-ui-refresh-20260629',
  previousVersion: 'round571-answer-depth-ninth-pass-proof-ui-refresh-20260629',
  realExamPreviousAnswerDepthRows: 133,
  realExamCumulativeAnswerDepthRows: 145,
  realExamRoundUpgradeRows: 12,
  realExamNewUniqueRows: 12,
  proofDepthRows181103: 422,
  referencePracticeRows181103: 400,
  sourceClueOnlyRows181103: 122,
  strictAnswerPdfProofRows: 0
};

export const realExamUpgrades = [
  {
    id: 'ocean-2020-02-01',
    diagnosis: '现有答案能给出积分结果，但过程层偏薄：没有先说明迹线是同一质点随时间运动的 Lagrange 曲线，也没有把速度场、初始条件、积分常数和消参检查分开写；旧 answer-check 字段还曾把同组第 2、3 小题的流线和方向角混入本 id，容易让学生混淆迹线、瞬时流线和运动方向。',
    referenceAnswer: String.raw`本小题求质点 A 的迹线。迹线是同一流体质点的位置随时间形成的曲线，所以要对该质点的运动方程积分，而不是固定某一时刻直接写流线。题给速度场对应的质点运动方程为 \(dx/dt=u=t+1\)、\(dy/dt=v=1\)，并给出质点 A 在 \(t=0\) 时位于原点 \((0,0)\)。由 \(dx/dt=t+1\) 积分得 \(x=t^2/2+t+C_1\)；由 \(dy/dt=1\) 积分得 \(y=t+C_2\)。代入初始条件 \(t=0,x=0,y=0\)，得 \(C_1=0,C_2=0\)。因此质点 A 的迹线参数式为 \(x=t^2/2+t,\ y=t\)。若需要写成平面曲线方程，由 \(y=t\) 消去时间参数 \(t\)，得到 \(x=y^2/2+y\)。结论检查：当 \(t=0\) 时曲线过原点；对参数式求导有 \(dx/dt=t+1\)、\(dy/dt=1\)，与题给速度分量一致；曲线开口方向与 \(x\) 随时间加速增大的物理图像一致。由于速度场含时间，本题的迹线不能直接等同于某一瞬时流线。`,
    boundaryNote: String.raw`strictAnswerPdfProof=false；题面原子拆分中 ocean-2020-02-01 只问第 1 小题质点 A 的迹线方程。若旧页面仍合并展示同组题，第 2 小题 \(t=0\) 过原点流线 \(y=x\) 和第 3 小题 \(t=1\) 方向角 \(\arctan(1/2)\) 应另列，不应作为本 id 主答案。`
  },
  {
    id: 'ocean-2012-06-01',
    diagnosis: '现有答案只给 \(W=m\ln(z^4+4a^4)\) 的结论，缺少镜像法为什么放四个同号源、源强归一化口径、复势乘积如何化成 \(z^4+4a^4\)，以及固壁无穿透边界检查。',
    referenceAnswer: String.raw`设 \(z=x+iy\)，物理区域为两条互相垂直固壁围成的第一象限，真实点源位于 \(z_0=a+ia\)。在理想、不可压、无旋平面势流中，固壁不可穿透，因此固壁应成为流线。若二维点源强度按 \(W_s=m\ln(z-z_0)\) 记号书写；若题面用体积源强 \(q\)，则 \(m=q/(2\pi)\)。为使 \(x=0\) 与 \(y=0\) 两条固壁都满足零法向速度，对点源作同号镜像：关于 \(y=0\) 得 \(a-ia\)，关于 \(x=0\) 得 \(-a+ia\)，再关于两轴得 \(-a-ia\)。扩展平面中的复势为
\[
W(z)=m\{\ln[z-(a+ia)]+\ln[z-(a-ia)]+\ln[z-(-a+ia)]+\ln[z-(-a-ia)]\}+C .
\]
合并对数可得
\[
W(z)=m\ln\{[(z-a)^2+a^2][(z+a)^2+a^2]\}+C .
\]
展开乘积：
\[
[(z-a)^2+a^2][(z+a)^2+a^2]=(z^2-2az+2a^2)(z^2+2az+2a^2)=z^4+4a^4 .
\]
因此可取 \(W(z)=m\ln(z^4+4a^4)+C\)，常数 \(C\) 不影响速度。结论检查：复速度 \(dW/dz=4mz^3/(z^4+4a^4)\)；在物理第一象限内只有 \(z=a+ia\) 是真实点源，其余三个是满足固壁边界的镜像点；两坐标轴因同号对称而无穿透速度，符合固壁条件。`,
    boundaryNote: String.raw`strictAnswerPdfProof=false；本答案是教材/笔记推导型参考答案，不是原答案 PDF 逐字证明。题面源强记号可能有归一化歧义：若原题把点源复势定义为 \(q/(2\pi)\ln z\)，需把本文 \(m\) 替换为 \(q/(2\pi)\)；若点源位置或固壁所在象限与本地整理口径不同，镜像点和符号也要随题图调整。`
  },
  {
    id: 'ocean-2012-05-02',
    diagnosis: '现有答案结论正确但太短，需要交代点位定义、高程基准、同径管速度相等，以及两次 Bernoulli 方程的代入链。',
    referenceAnswer: String.raw`取上游大水池自由液面为 1 点，虹吸管最高点为 2 点，出口为 3 点。以 1 点自由液面高程为零，则出口 3 比自由液面低 \(h\)，最高点 2 比自由液面高 \(y\)。忽略能量损失，水为不可压，流动近似定常；大水池自由液面速度 \(V_1\approx0\)，1 点和出口 3 均通大气，所以 \(p_1=p_3=p_a\)。先在 1、3 间列伯努利方程：
\[
\frac{p_a}{\rho}+0+g\cdot0=\frac{p_a}{\rho}+\frac{V_3^2}{2}+g(-h).
\]
因此 \(V_3^2/2=gh\)，管内出口速度 \(V_3=\sqrt{2gh}\)。管径不变且水不可压，最高点与出口处平均速度相同，故 \(V_2=V_3\)。再在 1、2 间列伯努利方程：
\[
\frac{p_a}{\rho}+0+g\cdot0=\frac{p_2}{\rho}+\frac{V_2^2}{2}+gy .
\]
代入 \(V_2^2/2=gh\)，得 \(p_2/\rho=p_a/\rho-gh-gy\)，所以 \(p_2=p_a-\rho g(h+y)\)。题给 \(h=6\,\mathrm m\)，\(y=2\,\mathrm m\)，故 \(p_2=p_a-8\rho g\)。若写成表压，则 \(p_2-p_a=-8\rho g\)；若取水 \(\rho\approx1000\,\mathrm{kg/m^3}\)、\(g\approx9.8\,\mathrm{m/s^2}\)，表压约为 \(-7.84\times10^4\,\mathrm{Pa}\)。`,
    boundaryNote: String.raw`这是基于无损 Bernoulli 和同径管内速度相等的派生参考答案；若考虑沿程或局部损失，最高点压强会更低。当前证据仍是 derived/reference-answer 层，不提升 strictAnswerPdfProof。`
  },
  {
    id: 'ocean-2020-05-02',
    diagnosis: '现有答案数值 \(1/9\) 正确，但需要分开说明 Reynolds 相似和 Strouhal 数相等，否则学生只记住比例而看不到频率比来源。',
    referenceAnswer: String.raw`圆柱绕流的交替脱涡频率可看作由来流速度 \(U\)、圆柱直径 \(d\)、运动黏度 \(\nu\) 和频率 \(f\) 控制。对应两个关键无量纲数为 Reynolds 数 \(Re=Ud/\nu\) 和 Strouhal 数 \(St=fd/U\)。同一种流体中 \(\nu_1=\nu_2\)。动力相似首先要求 \(Re_1=Re_2\)，即 \(U_1d_1/\nu=U_2d_2/\nu\)，所以 \(U_1/U_2=d_2/d_1\)。题给 \(d_1/d_2=3\)，于是 \(d_2/d_1=1/3\)，得到 \(U_1/U_2=1/3\)。相似状态下脱涡规律相同，Strouhal 数也相同：\(St_1=St_2\)，即 \(f_1d_1/U_1=f_2d_2/U_2\)。整理得 \(f_1/f_2=(U_1/U_2)(d_2/d_1)\)。代入 \(U_1/U_2=1/3\) 和 \(d_2/d_1=1/3\)，得到 \(f_1/f_2=1/9\)。等价地，在 \(Re\) 已相等时 \(St\) 为常数，\(f=St\cdot U/d\)；又由 \(U=Re\cdot\nu/d\)，可写成 \(f=St\cdot Re\cdot\nu/d^2\)，同流体且 \(Re\) 相同，所以 \(f_1/f_2=(d_2/d_1)^2=1/9\)。`,
    boundaryNote: String.raw`本题主控相似是黏性绕流的 Reynolds 相似，并用 Strouhal 数连接频率；不是自由面重力主导的 Froude 相似。结论依赖同流体、几何相似和相同 Re 区间；仍属 derived/reference-answer，不是 strict original answer PDF proof。`
  },
  {
    id: 'ocean-2020-04-03',
    diagnosis: '现有答案只有流线方程结论，需要从复势、流函数、角度定义、反正切分支和源汇奇点边界逐步证明。',
    referenceAnswer: String.raw`假设二维定常不可压无旋势流，均匀来流速度为 \(U\)，点源强度为 \(Q\) 位于 \((-a,0)\)，等强点汇位于 \((a,0)\)。令 \(z=x+iy\)，取复势
\[
W(z)=Uz+\frac{Q}{2\pi}\ln(z+a)-\frac{Q}{2\pi}\ln(z-a),
\]
其中 \(W=\phi+i\psi\)。均匀流 \(Uz\) 的流函数为 \(Uy\)；点源的流函数为 \((Q/2\pi)\theta_-\)，点汇的贡献为 \(-(Q/2\pi)\theta_+\)，这里 \(\theta_-=\arg[z+a]\)，\(\theta_+=\arg[z-a]\)。因此总流函数为
\[
\psi=Uy+\frac{Q}{2\pi}(\theta_- - \theta_+).
\]
定常二维流线满足 \(dx/u=dy/v\)，等价于 \(\psi=C\)，所以流线方程为
\[
Uy+\frac{Q}{2\pi}(\theta_- - \theta_+)=C .
\]
若写成坐标显式式，由
\[
\tan(\theta_- - \theta_+)=\frac{y/(x+a)-y/(x-a)}{1+y^2/[(x+a)(x-a)]}
=-\frac{2ay}{x^2+y^2-a^2},
\]
可得 \(Uy+(Q/2\pi)\arctan[-2ay/(x^2+y^2-a^2)]=C\)。这里反正切形式必须按象限选连续分支，不能把多值角度直接压成单值反正切。物理意义上，\(z=-a\) 与 \(z=a\) 是源、汇奇点，流线可在源汇处发出或终止；远处源汇贡献趋于偶极量级，流线趋近均匀流的水平直线。结论检查：方程量纲为流函数量纲，\(C\) 代表不同流线；令 \(C=0\) 可得到零流线，但作图时仍需处理角度分支和源汇附近的奇异性。`,
    boundaryNote: String.raw`这是基于站内题面和复势模型的派生完整参考答案；未新增 strictAnswerPdfProof。反正切压缩式只在分支连续选取后等价，不能替代 \(\theta_- - \theta_+\) 的全局表达。`
  },
  {
    id: 'ocean-2020-05-01',
    diagnosis: '现有答案列出了相关物理量和速度比，但没有完整说明量纲组、同流体假设和本小问只求速度相似，不应提前混入频率比。',
    referenceAnswer: String.raw`题目讨论圆柱绕流及卡门涡街。若模型、来流方向和圆柱形状相似，主要物理量可取来流速度 \(V\)、圆柱特征直径 \(d\)、流体运动黏度 \(\nu\) 以及放涡频率 \(f\)；若用动力黏度 \(\mu\)，则还需密度 \(\rho\)，且 \(\nu=\mu/\rho\)。量纲分析给出两个常用无量纲数：\(Re=Vd/\nu\) 和 \(St=fd/V\)。第一问只要求保证动力相似时的速度比，因此关键条件是几何相似并令 \(Re_1=Re_2\)。于是
\[
\frac{V_1d_1}{\nu_1}=\frac{V_2d_2}{\nu_2}.
\]
若题设为同一流体，\(\nu_1=\nu_2\)，故 \(V_1/V_2=d_2/d_1\)。题中若 \(d_1/d_2=3\)，则 \(V_1/V_2=1/3\)。物理意义是：大直径模型若要与小直径模型处在相同惯性力与黏性力比值下，来流速度必须相应降低。结论检查：速度比无量纲；若直径放大 3 倍而 \(\nu\) 不变，速度降为 \(1/3\) 后 \(Re\) 保持不变。频率比应在下一小问用 \(St\) 相等或量纲关系继续求，不应混入本小问作为主要结论。`,
    boundaryNote: String.raw`答案默认同一不可压牛顿流体、几何相似、无自由面和可压缩效应；若不同流体，则应写 \(V_1/V_2=(\nu_1/\nu_2)(d_2/d_1)\)。这是派生参考答案，不是原卷严格答案 PDF 证明。`
  },
  {
    id: 'ocean-2019-03-01',
    diagnosis: '原答案只给定义和适用条件概要，缺少从 Euler 方程到 Bernoulli 积分、从无旋势流到 Lagrange 积分的证明链，也没有说明沿流线常数与全场常数的区别。',
    referenceAnswer: String.raw`正压流体指密度只由压强决定的流体，可写为 \(\rho=\rho(p)\)，等价地也常写为 \(p=p(\rho)\)。这个条件的关键作用是使 \(dp/\rho\) 成为只依赖压强或密度状态的全微分，因此可定义压力函数或单位质量压强势 \(H(p)=\int^p dp/\rho(p)\)。例如不可压流体 \(\rho=\text{常数}\) 时，\(H=p/\rho\)；绝热理想气体若 \(p=K\rho^\gamma\)，则 \(H=\int dp/\rho=\gamma p/[(\gamma-1)\rho]\)。对理想流体，在单位质量体力有势、记体力势为 \(\Phi\) 且体力 \(\mathbf f=-\nabla\Phi\) 时，Euler 方程可写为
\[
\frac{\partial\mathbf V}{\partial t}+(\mathbf V\cdot\nabla)\mathbf V=-\nabla H-\nabla\Phi .
\]
利用恒等式 \((\mathbf V\cdot\nabla)\mathbf V=\nabla(V^2/2)-\mathbf V\times\boldsymbol\omega\)，其中 \(\boldsymbol\omega=\nabla\times\mathbf V\)，得
\[
\frac{\partial\mathbf V}{\partial t}+\nabla(V^2/2+H+\Phi)-\mathbf V\times\boldsymbol\omega=0 .
\]
若流动定常，沿同一条流线取线元 \(d\mathbf r\parallel\mathbf V\)，则 \((\mathbf V\times\boldsymbol\omega)\cdot d\mathbf r=0\)，于是 \(d(V^2/2+H+\Phi)=0\)，得到 Bernoulli 积分
\[
V^2/2+\int dp/\rho+\Phi=C .
\]
常数通常只沿同一流线不变；若流动还无旋，即 \(\boldsymbol\omega=0\)，则该常数可在同一连通无奇点区域内推广为全场常数。不可压重力场中取 \(\Phi=gz\)，即 \(p/\rho+V^2/2+gz=C\)。因此 Bernoulli 积分的基本条件是：理想无粘、正压或不可压、体力有势、定常；一般沿流线使用，无旋时才可跨流线使用，且不应跨越粘性耗散显著区、泵轮作功区、激波、强分离或非保守外力区硬套。Lagrange 积分是非定常势流的能量积分。若流动无旋，可引入速度势 \(\mathbf V=\nabla\varphi\)，则 \(\partial\mathbf V/\partial t=\nabla(\partial\varphi/\partial t)\)，Euler 方程化为
\[
\nabla[\partial\varphi/\partial t+V^2/2+H+\Phi]=0,
\]
故 \(\partial\varphi/\partial t+V^2/2+\int dp/\rho+\Phi=F(t)\)。通过给速度势加只随时间变化的函数，可把右端并入势函数，也可保留为 \(F(t)\)。所以 Lagrange 积分的适用条件比普通沿流线 Bernoulli 更强：理想流体、正压流体、体力有势，并且流动为无旋势流；它允许非定常，但要求研究区域内速度势可定义、场量光滑、没有奇点或需在去掉奇点和支割后的区域内局部使用。`,
    boundaryNote: String.raw`这是派生参考答案深度升级，不等同 strictAnswerPdfProof；适用条件按理想正压有势力流动表述，若教材采用不同体力势符号，公式中 \(\Phi\) 项符号可随约定调整。`
  },
  {
    id: 'ocean-2019-01-05',
    diagnosis: '原答案只有 Reynolds 应力公式和混合长形式，缺少 Reynolds 分解、时均动量方程中附加应力的来源、与分子黏性应力的区别，以及闭合问题说明。',
    referenceAnswer: String.raw`Reynolds 应力是湍流脉动速度相关项在时均动量方程中表现出的附加动量通量。对湍流速度作 Reynolds 分解：\(u_i=\overline{u_i}+u_i'\)，其中 \(\overline{u_i'}=0\)。把瞬时 Navier-Stokes 方程代入并取时间平均时，线性项可直接平均，但非线性惯性项 \(u_j\partial u_i/\partial x_j\) 会产生脉动相关量 \(\overline{u_i'u_j'}\)。在常密度不可压流体中，平均动量方程可写成
\[
\rho\left(\frac{\partial\overline{u_i}}{\partial t}+\overline{u_j}\frac{\partial\overline{u_i}}{\partial x_j}\right)
=-\frac{\partial\overline p}{\partial x_i}+\mu\nabla^2\overline{u_i}-\frac{\partial(\rho\overline{u_i'u_j'})}{\partial x_j}.
\]
把最后一项看成某个附加应力的散度，就定义 Reynolds 应力张量 \(\tau^R_{ij}=-\rho\overline{u_i'u_j'}\)。在二维平行剪切流或边界层中，最常用的剪切分量为 \(\tau_R=-\rho\overline{u'v'}\)，它表示法向脉动 \(v'\) 携带不同层的 streamwise 动量 \(u'\) 进行交换而形成的平均剪切动量通量。若平均速度 \(\overline u\) 随 \(y\) 增大，典型湍流边界层中常有 \(\overline{u'v'}<0\)，于是 \(-\rho\overline{u'v'}>0\)，与正的平均速度梯度对应的剪切输运方向一致。它与普通分子粘性应力不同：分子粘性应力来自分子热运动造成的相邻流层动量交换，牛顿流体中常写为 \(\tau_\mu=\mu d\overline u/dy\) 或 \(\sigma_{ij}=-p\delta_{ij}+2\mu e_{ij}\)；Reynolds 应力来自湍流涡团和速度脉动的统计输运，不是新的真实分子力，而是平均化以后出现在方程中的表观应力。总剪切应力常写为 \(\tau=\mu d\overline u/dy-\rho\overline{u'v'}\)。由于 \(-\rho\overline{u_i'u_j'}\) 不是仅由平均速度自动决定的新未知量，时均方程会出现闭合问题，因此需要湍流模型或实验关系。常见的 Boussinesq 涡粘模型写作 \(\tau_R=\rho\nu_t d\overline u/dy\)，Prandtl 混合长模型进一步取 \(\nu_t=l_m^2|d\overline u/dy|\)，于是 \(\tau_R=\rho l_m^2|d\overline u/dy|d\overline u/dy\)。该混合长式主要适用于简单二维平行剪切湍流的工程近似，不能当成 Reynolds 应力的一般定义。`,
    boundaryNote: String.raw`这是派生参考答案深度升级，不等同 strictAnswerPdfProof；常密度 Reynolds 平均写法适用于普通不可压湍流，变密度湍流通常需说明 Favre 平均或密度脉动项。`
  },
  {
    id: 'ocean-2022-04',
    diagnosis: '现有答案只给复势题答题路线，缺少 Cauchy-Riemann 关系、复速度符号约定、具体复势求速度分量的可执行步骤，以及流线、通量、边界条件和 Bernoulli 压强检查。',
    referenceAnswer: String.raw`设二维势流区域内 \(z=x+iy\)，复势为 \(W(z)=\phi(x,y)+i\psi(x,y)\)，其中 \(\phi\) 为速度势，\(\psi\) 为流函数。若 \(W\) 在研究区域内解析，则满足 Cauchy-Riemann 条件 \(\phi_x=\psi_y\)，\(\phi_y=-\psi_x\)。速度由速度势给出：\(u=\phi_x\)，\(v=\phi_y\)，因此也可写成 \(u=\psi_y\)，\(v=-\psi_x\)。对复势求导得复速度 \(dW/dz=\phi_x+i\psi_x=u-iv\)。所以拿到具体 \(W(z)\) 后，先计算 \(W'(z)\)，再按 \(u=\operatorname{Re}W'(z)\)，\(v=-\operatorname{Im}W'(z)\) 读出速度分量，速度大小为 \(V=|W'(z)|=\sqrt{u^2+v^2}\)。流线由 \(\psi(x,y)=C\) 给出，等势线由 \(\phi(x,y)=C\) 给出，二者在解析且非驻点处正交。若两条流线的流函数值为 \(\psi_1\)、\(\psi_2\)，则单位厚度体积流量为 \(Q=\psi_2-\psi_1\)，通常取大小 \(|\psi_2-\psi_1|\)。固壁或对称边界若不可穿透，应成为一条流线，即边界上 \(\psi\) 为常数；远场条件、源汇强度、环量或驻点条件用来确定待定常数。若还要求压强，在定常、不可压、无粘、无旋且同一水平面或势能项已知时，用 Bernoulli 方程 \(p+\frac12\rho V^2+\rho gz=C\) 代入 \(V=|W'|\) 求压强。边界检查是：\(W\) 必须在所求区域内解析，奇点、物面角点、对数分支和环量要单独说明；若教材采用 \(W=\phi-i\psi\) 的相反约定，则复速度读数中的虚部符号相应改变。`,
    boundaryNote: String.raw`本题站内题干是复势方法题而非给定具体 \(W(z)\) 的数值题；若原卷有具体复势表达式，应把该表达式代入 \(W'(z)\) 后再给最终速度和流线方程。适用范围限于二维、不可压、无旋、理想势流。`
  },
  {
    id: 'ocean-2011-02-01',
    diagnosis: '现有答案抓住连续介质假设和 \(Kn\ll1\) 的核心，但没有说明代表性体元尺度、Knudsen 数分区，以及绕流固体时应取最小相关长度尺度而非只取物体外形尺度。',
    referenceAnswer: String.raw`连续介质假设是把由大量分子组成的流体看作在空间和时间上连续分布的介质，而不是逐个跟踪分子。也就是说，在一个代表性小体积 \(\Delta V\) 内，分子数要足够多，使密度、速度、压强、温度等宏观平均量有稳定意义；同时 \(\Delta V\) 又要远小于流动特征尺度，使这些量可以写成连续函数 \(\rho(x,y,z,t)\)、\(\mathbf u(x,y,z,t)\)、\(p(x,y,z,t)\)、\(T(x,y,z,t)\)，并可使用微分方程描述。判别连续介质是否适用，常用 Knudsen 数 \(Kn=\lambda/L\)，其中 \(\lambda\) 是分子平均自由程，\(L\) 是流动中最小的相关宏观长度尺度，如物体尺度、缝隙宽度、边界层厚度或曲率半径。若 \(Kn\ll1\)，通常 \(Kn<0.01\) 时，连续介质模型和 Navier-Stokes 方程配合无滑移边界条件较可靠；当 \(0.01\lesssim Kn\lesssim0.1\) 时可能进入滑移流，需要速度滑移和温度跳跃修正；当 \(Kn\) 更大时，流动逐渐进入过渡流或自由分子流，连续介质假设和局部热力学平衡都会失效。对于气体绕流固体，若处在高空低压、稀薄气体、微纳尺度器件、很小缝隙、强稀薄边界层或激波厚度与物体局部尺度同量级的情形，\(\lambda\) 与 \(L\) 不再相差很多，此时连续介质假设不实用，应改用 Boltzmann 方程、DSMC 等分子运动论方法，或至少采用滑移边界修正。边界检查是：不能只看物体总长，还要看局部最小尺度；液体通常 \(\lambda\) 极小，连续介质假设更容易成立；气体在常压大尺度绕流中通常成立，但在稀薄或微尺度条件下会失效。`,
    boundaryNote: String.raw`这是简答题升级稿，属于 derived/reference answer；未声称有严格原卷答案 PDF 跨页 bbox/hash 证明。答题时可按分值压缩为“定义 + \(Kn=\lambda/L\ll1\) + 稀薄/高空/微尺度失效”三段。`
  },
  {
    id: 'ocean-2013-08',
    diagnosis: '原答案只概括边界层理论和湍流定义，需要说明高 Reynolds 数内外区划分、边界层方程的量级思想、边界层外势流匹配，以及湍流定义与特征。',
    referenceAnswer: String.raw`边界层理论的基本思想是：在高 Reynolds 数 \(Re=UL/\nu\gg1\) 的固体绕流中，黏性并不是在全流场都同等重要，而是主要集中在紧贴固体表面的一层很薄区域内。设外流特征长度为 \(L\)，边界层厚度为 \(\delta\)，通常有 \(\delta\ll L\)。边界层内由于无滑移条件，壁面速度为零，而外缘速度接近外部势流速度，故法向速度梯度很大，黏性切应力和惯性项同量级，必须按黏性流体处理；边界层外速度梯度较小，黏性项相对惯性项可忽略，可近似按理想流体或势流处理。这样就把外部无黏主流与近壁黏性薄层分开求解：外流给边界层外缘速度或压强分布，边界层方程在壁面满足无滑移和不可穿透条件，在外缘与外流匹配。该思想解释了高 Reynolds 数下阻力、分离和尾流等现象：虽然黏性区域薄，但壁面剪切和边界层分离会显著影响整体绕流。湍流是速度、压强、涡量等物理量在时均值附近作不规则、随机、三维、非定常脉动的流动状态。它不是简单的层流波动，而是含有多尺度涡结构、强烈掺混、强动量和热量交换，并伴随能量从大尺度向小尺度级联并最终由黏性耗散的流动。工程上常用 Reynolds 分解 \(u_i=\overline{u_i}+u_i'\) 描述湍流平均量和脉动量；湍流使平均动量方程中出现 Reynolds 应力 \(-\rho\overline{u_i'u_j'}\)，因此会带来闭合问题。结论上，边界层理论是高 Reynolds 数黏性流动的内外分区近似，湍流则是具有随机脉动和多尺度涡旋的复杂流动状态，两者在实际高 Reynolds 数壁面流中经常同时出现。`,
    boundaryNote: String.raw`这是基于站内真题库与知识页的推导型参考答案；不等同于严格原始答案 PDF 证明。考试作答可压缩为“内外分区+方程/条件+湍流定义与特征”。`
  },
  {
    id: 'ocean-2021-01-full',
    diagnosis: '原答案只写出 Helmholtz 速度分解公式，需要从邻域 Taylor 展开出发，说明速度梯度张量分解为对称变形率张量与反对称转动张量，并解释各项物理意义。',
    referenceAnswer: String.raw`Helmholtz 速度分解定理说明：在连续可微流场中，邻近某一点 \(M_0\) 的流体微团运动可分解为平动、刚体转动和变形运动三部分。设 \(M\) 相对 \(M_0\) 的位移为 \(\Delta\mathbf r\)，速度场在 \(M_0\) 处作一阶 Taylor 展开：
\[
\mathbf V(M)=\mathbf V(M_0)+(\nabla\mathbf V)_{M_0}\Delta\mathbf r+o(|\Delta\mathbf r|).
\]
把速度梯度张量分解为对称部分和反对称部分：
\[
\nabla\mathbf V=\mathbf S+\mathbf A,\qquad
S_{ij}=\frac12\left(\frac{\partial V_i}{\partial x_j}+\frac{\partial V_j}{\partial x_i}\right),\quad
A_{ij}=\frac12\left(\frac{\partial V_i}{\partial x_j}-\frac{\partial V_j}{\partial x_i}\right).
\]
其中 \(\mathbf S\) 是变形率张量，表示线元伸长、压缩和剪切变形；\(\mathbf A\) 是反对称张量，可等价表示为角速度向量 \(\boldsymbol\Omega=\frac12\nabla\times\mathbf V\) 造成的刚体转动，即 \(\mathbf A\Delta\mathbf r=\boldsymbol\Omega\times\Delta\mathbf r\)。因此忽略高阶小量时，
\[
\mathbf V(M)=\mathbf V(M_0)+\boldsymbol\Omega\times\Delta\mathbf r+\mathbf S\Delta\mathbf r .
\]
第一项是微团随中心点 \(M_0\) 的平动速度；第二项是微团绕 \(M_0\) 的局部刚体转动速度；第三项是由变形率产生的相对速度，包括伸缩和剪切。若 \(\mathbf S=0\)，邻域运动近似为刚体平动加转动；若 \(\boldsymbol\Omega=0\)，局部无旋但仍可有纯变形。该定理的适用条件是速度场在研究点附近连续可微，且只保留一阶邻域近似；距离 \(M_0\) 较远时，高阶项不能忽略。`,
    boundaryNote: String.raw`这里的 Helmholtz 速度分解定理是局部运动分解，不要和 Helmholtz 涡管/涡线定理混为一谈；该答案为推导型补强，不是严格原始答案 PDF 证明。`
  }
];

export const proofDepthRewrites181103 = [
  {
    id: '181103-material-extracted-0015',
    diagnosis: '当前答案已有 \(x^2+y^2=C\) 的结论和简单微分式，但仍偏短：没有明确 \(a\ne0\) 的条件、积分常数范围、原点驻点、作图箭头方向随 \(a\) 正负变化，也缺少用速度场反查半径不变的结论检查。',
    referenceAnswer: String.raw`题给二维欧拉速度场 \(u=ay,\ v=-ax\)，其中 \(a\) 为常数。求流线时固定同一时刻，使曲线切线方向与速度矢量一致，故流线微分方程为 \(dy/dx=v/u\)，等价地也可写 \(dx/u=dy/v\)。当 \(a\ne0\) 且不在速度分量同时为零的原点处，代入得
\[
\frac{dy}{dx}=\frac{-ax}{ay}=\frac{-x}{y}.
\]
移项得 \(y\,dy=-x\,dx\)，也就是 \(x\,dx+y\,dy=0\)。两边积分：
\[
\int x\,dx+\int y\,dy=0,
\]
得到 \((x^2+y^2)/2=C\)，即 \(x^2+y^2=C_1\)。通常写成 \(x^2+y^2=R^2\)，其中 \(R\ge0\)。所以流线是一族以原点为圆心的同心圆；\(R=0\) 对应原点驻点。作图时画若干同心圆，并沿圆周切向标箭头：若 \(a>0\)，在正 \(x\) 轴上 \(v=-ax<0\)，速度向下，因此整体为顺时针；若 \(a<0\)，方向相反。还可用不变量直接检查：令 \(F=x^2+y^2\)，则
\[
\mathbf V\cdot\nabla F=(ay)(2x)+(-ax)(2y)=0,
\]
说明沿速度方向半径平方不变，确为圆形流线。速度大小为 \(|\mathbf V|=|a|\sqrt{x^2+y^2}\)，在原点为零，离原点越远越大。若 \(a=0\)，全场静止，速度方向不定，此时不应再画有方向的同心圆流线。`,
    boundaryNote: String.raw`strictAnswerPdfProof=false；本题源页 OCR/人工源图复核置信度较高，但仍不是严格答案 PDF 逐字证明。若题面未给 \(a\) 的符号，作图方向必须条件化说明；若 \(a=0\)，全场静止，除速度为零、方向不定的退化情况外，不应再画有方向的同心圆流线。`
  },
  {
    id: '181103-material-extracted-0427',
    diagnosis: '原答案基本正确，但需要加入速度场不变量检查和坐标轴退化流线边界，避免只靠除法推导覆盖不了 \(x=0\) 或 \(y=0\) 的情形。',
    referenceAnswer: String.raw`二维定常速度场为 \(u=x,\ v=-y\)。流线定义为同一时刻处处与速度矢量相切的曲线，因此在普通点上有 \(dx/u=dy/v\)，等价于 \(dy/dx=v/u\)。代入本题速度分量得
\[
\frac{dy}{dx}=-\frac{y}{x}.
\]
对 \(x\ne0,\ y\ne0\) 的区域分离变量：
\[
\frac{dy}{y}=-\frac{dx}{x}.
\]
两边积分得 \(\ln|y|=-\ln|x|+C\)，移项为 \(\ln|x|+\ln|y|=C\)，即 \(\ln|xy|=C\)。因此一般流线族为 \(xy=C_1\)。也可用不变量校验：令 \(F(x,y)=xy\)，则 \(\nabla F=(y,x)\)，速度矢量 \(\mathbf V=(x,-y)\)，于是
\[
\mathbf V\cdot\nabla F=x\cdot y+(-y)\cdot x=0.
\]
这说明 \(F\) 沿流线不变，故 \(xy=\text{常数}\) 确为流线。通过点 \((2,3)\) 时，常数 \(C_1=2\times3=6\)，所以该点所在流线为 \(xy=6\)，或写成 \(y=6/x\)。从图形上看，\(C_1>0\) 的流线位于第一、第三象限，\(C_1<0\) 的流线位于第二、第四象限，并以坐标轴为渐近线。推导中 \(dy/dx=v/u\) 的除法在 \(x=0\) 或 \(y=0\) 上需单独理解；不变量形式 \(xy=C_1\) 可连续覆盖退化情形，\(C_1=0\) 对应坐标轴流线，原点为驻点。`,
    boundaryNote: String.raw`该条已 source-verified/html-question 层可用，但 noOriginalAnswerClaim 仍成立，strictAnswerPdfProof 不提升。`
  },
  {
    id: '181103-material-extracted-0087',
    diagnosis: '当前答案公式正确，但应从 Bernoulli 出流速度和水平抛射时间两步证明，并补定义域、极限和最大射程检查。',
    referenceAnswer: String.raw`题设为顶端开口水箱，侧壁小孔离自由水面深度为 \(h\)，自由水面离地面高度为 \(H\)，因此小孔离地面高度为 \(H-h\)，并要求 \(0<h<H\)。假设水为不可压理想流体，流动准定常，水箱截面积远大于小孔面积，自由水面速度近似为 0；水面与孔口均通大气，忽略孔口收缩、局部损失、水面下降和空气阻力。先由自由水面 1 到孔口 2 列伯努利方程：
\[
\frac{p_1}{\rho g}+\frac{V_1^2}{2g}+z_1=\frac{p_2}{\rho g}+\frac{V_2^2}{2g}+z_2 .
\]
取表压 \(p_1=p_2=0\)，\(V_1\approx0\)，\(z_1=H\)，\(z_2=H-h\)，得
\[
H=\frac{V_2^2}{2g}+H-h,
\]
所以 \(V_2=\sqrt{2gh}\)。水流离开小孔后近似作水平抛射，初始水平速度为 \(V_2\)，竖直初速度为 0，竖直下落距离为 \(H-h\)。竖直方向有
\[
H-h=\frac12gt^2,
\]
故 \(t=\sqrt{2(H-h)/g}\)。水平方向忽略空气阻力，速度保持 \(V_2\)，所以射程
\[
S=V_2t=\sqrt{2gh}\sqrt{\frac{2(H-h)}{g}}=2\sqrt{h(H-h)}.
\]
物理意义是 \(h\) 决定孔口出流速度，\(H-h\) 决定飞行时间，射程由二者乘积共同控制。结论检查：\(S\) 的量纲为长度；当 \(h\to0\) 时速度趋零，当 \(h\to H\) 时落距趋零，射程都趋零；在 \(h=H/2\) 时达到最大值 \(H\)，与后续同类结论一致。`,
    boundaryNote: String.raw`这是 181103 HTML/来源页核对后的资料题参考答案；按理想孔口水平出流处理。若考虑实际孔口收缩、能量损失或空气阻力，应引入速度系数/流量系数，射程会小于理想值。`
  },
  {
    id: '181103-material-extracted-0491',
    diagnosis: '原答案给出复势结论，但需要证明 \(\Log z=\ln r+i\theta\) 的分支条件、由速度势恢复流函数、再用速度和流量检查它确为点源流。',
    referenceAnswer: String.raw`采用常用二维势流复势约定 \(W(z)=\phi+i\psi\)，并有 \(dW/dz=u-iv\)，其中 \(\phi\) 为速度势，\(\psi\) 为流函数。题给 \(\phi=(m/2\pi)\ln r\)。令 \(z=x+iy=re^{i\theta}\)，在不穿过原点和支割线的单连通区域内选定复对数支路，则 \(\Log z=\ln r+i\theta\)。为了使复势的实部等于题给速度势，可直接取
\[
W(z)=\frac{m}{2\pi}\Log z+C,
\]
其中 \(C\) 是任意复常数。展开得
\[
W=\frac{m}{2\pi}(\ln r+i\theta)+C,
\]
所以 \(\Re W=(m/2\pi)\ln r+\Re C\)，\(\Im W=(m/2\pi)\theta+\Im C\)。速度势允许相差一个常数，因此这正对应题给 \(\phi\)，并得到流函数 \(\psi=(m/2\pi)\theta+\Im C\)。再作速度检验：由柱坐标势函数关系 \(u_r=\partial\phi/\partial r\)、\(u_\theta=(1/r)\partial\phi/\partial\theta\)，有 \(u_r=m/(2\pi r)\)、\(u_\theta=0\)。由流函数关系 \(u_r=(1/r)\partial\psi/\partial\theta\)、\(u_\theta=-\partial\psi/\partial r\)，同样得到 \(u_r=m/(2\pi r)\)、\(u_\theta=0\)，说明复势、速度势和流函数彼此一致。绕任一半径为 \(r\) 的圆周计算体积流量：
\[
Q=\int_0^{2\pi}u_r r\,d\theta=\int_0^{2\pi}\frac{m}{2\pi}\,d\theta=m.
\]
所以该流动是原点处强度为 \(m\) 的二维点源；若 \(m<0\)，则为点汇。最终答案为 \(W(z)=\frac{m}{2\pi}\Log z+C\)。常数 \(C\) 不改变速度场，只改变势函数和流函数的零点。`,
    boundaryNote: String.raw`本题为 181103 资料内题的站内 HTML/页图核对参考答案，不声称原始答案逐字证明；\(\Log z\) 必须选定支路，原点为奇点，绕原点一周 \(\theta\) 增加 \(2\pi\)、\(\psi\) 增加 \(m\)，但速度场单值。若教材采用 \(W=\phi-i\psi\) 或 \(dW/dz=u+iv\) 的相反约定，虚部符号需相应调整。`
  },
  {
    id: '181103-material-extracted-0086',
    diagnosis: '当前站内答案已经基本正确，能用 Bernoulli 方程推出托里拆利公式并说明 \(H\) 抵消；Round572 审稿进一步补强有限水箱修正、孔口损失系数和定义域检查，避免把理想流速公式误当成实际流量公式。',
    referenceAnswer: String.raw`取自由水面为 1 点，小孔出口为 2 点。水箱顶端开口，小孔射流出口也与大气相通，因此可取 \(p_1=p_2=p_a\)，或用表压写作 \(p_1=p_2=0\)。以地面为高程零点，水面高程为 \(z_1=H\)，小孔离水面深度为 \(h\)，所以小孔高程为 \(z_2=H-h\)。若水箱横截面积远大于小孔面积，自由水面下降速度可忽略，取 \(V_1\approx0\)。沿自由水面到小孔出口列理想伯努利方程：
\[
\frac{p_1}{\rho g}+\frac{V_1^2}{2g}+z_1=\frac{p_2}{\rho g}+\frac{V_2^2}{2g}+z_2 .
\]
代入条件得
\[
\frac{p_a}{\rho g}+0+H=\frac{p_a}{\rho g}+\frac{V_2^2}{2g}+(H-h),
\]
于是 \(V_2^2/(2g)=h\)，故小孔理想出流速度为 \(V_2=\sqrt{2gh}\)。这说明本小问的速度只由孔口在自由水面下的水头 \(h\) 决定，\(H\) 在速度计算中抵消；\(H\) 只会在后续求射程时通过孔口离地高度 \(H-h\) 出现。若水箱截面积 \(A\) 不是远大于孔口面积 \(a\)，由连续方程 \(A V_1=a V_2\)，伯努利方程给出修正式
\[
V_2=\sqrt{\frac{2gh}{1-a^2/A^2}},
\]
当 \(a/A\to0\) 时才退化为 \(\sqrt{2gh}\)。若考虑实际孔口收缩和能量损失，速度应写成 \(V=C_v\sqrt{2gh}\)，流量写成 \(Q=C_d a\sqrt{2gh}\)。边界检查：要求不可压、无粘或损失忽略、准定常、两端同为大气压，且 \(h>0\)、\(H\ge h\)；当 \(h=0\) 时速度为 0，量纲 \(\sqrt{gh}\) 为 \(\mathrm{m/s}\)，与速度量纲一致。`,
    boundaryNote: String.raw`本条为 181103 资料内题，来源页为第 101 页 2.39(1)，当前是 reference-answer-ready/proof-depth-upgraded 层级；本次只读审稿未增加 strictAnswerPdfProof。`
  },
  {
    id: '181103-material-extracted-0009',
    diagnosis: '原答案给出 \(xy=ab\) 的轨迹结论，但需要明确这是拉格朗日表示下同一流点的运动轨迹，说明初始标号保持不变、如何消去时间参数，以及退化情形与作图方式。',
    referenceAnswer: String.raw`本题承接 1.8 给出的拉格朗日表示：\(x=ae^t,\ y=be^{-t},\ z=c\)，其中 \(a,b,c\) 是同一流点的初始标号，沿该流点保持不变。求某一流点的轨迹曲线时，应固定 \(a,b,c\)，让时间 \(t\) 变化，而不是把 \(a,b,c\) 当作新的空间变量。于是该流点的轨迹参数式为
\[
x(t)=ae^t,\qquad y(t)=be^{-t},\qquad z(t)=c.
\]
由前两式分别得到
\[
\frac{x}{a}=e^t,\qquad \frac{y}{b}=e^{-t}.
\]
相乘即可消去时间参数：
\[
\frac{x}{a}\frac{y}{b}=1,\qquad xy=ab.
\]
第三式直接给出 \(z=c\)。所以轨迹位于平面 \(z=c\) 内，是以坐标轴为渐近线的矩形双曲线 \(xy=ab\)。若 \(ab>0\)，轨迹分支在第一、第三象限；若 \(ab<0\)，分支在第二、第四象限；若 \(a=0\) 或 \(b=0\)，轨迹退化到相应坐标轴上的直线。作图时固定某一组初始标号 \(a,b,c\)，在平面 \(z=c\) 内画出对应的双曲线，并可用参数方向标明运动趋势：随 \(t\) 增大，\(e^t\) 增大而 \(e^{-t}\) 减小，因此 \(x\) 的绝对值沿初始符号方向增大，\(y\) 的绝对值沿初始符号方向减小。结论检查：对参数式求导得 \(dx/dt=ae^t=x\)、\(dy/dt=-be^{-t}=-y\)、\(dz/dt=0\)，与该拉格朗日表示导出的欧拉速度一致；且 \(d(xy)/dt=x\,dy/dt+y\,dx/dt=x(-y)+y(x)=0\)，说明 \(xy=ab\) 沿同一流点保持不变。`,
    boundaryNote: String.raw`依据站内 181103 HTML 第 10 页同题和 1.8 上文条件整理；来源页图只作核对证据。本条是推导型参考答案/证明深度升级，不声明 strictAnswerPdfProof。`
  }
];
