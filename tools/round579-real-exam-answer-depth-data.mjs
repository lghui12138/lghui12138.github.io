export const round579 = {
  round: 579,
  date: '2026-06-29',
  version: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
  previousVersion: 'round578-real-exam-answer-depth-eleventh-pass-20260629',
  realExamPreviousAnswerDepthRows: 153,
  realExamCumulativeAnswerDepthRows: 163,
  realExamRoundUpgradeRows: 10,
  realExamNewUniqueRows: 10,
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
    id: 'ocean-2019-01-02',
    diagnosis: '旧答案只给 99% 厚度定义和 Blasius 量级，缺少无滑移来源、边界层方程量级推导、不同厚度定义的边界。',
    referenceAnswer: String.raw`边界层厚度描述的是粘性影响从固壁向外扩散到主流的特征距离。固壁上有无滑移条件
\[
u(x,0)=0,
\]
而边界层外缘速度趋近外流速度 \(U_e(x)\)。由于速度是渐近接近 \(U_e\)，不存在一个数学上唯一的“边界层边界”，工程上通常定义
\[
u(x,\delta)=0.99U_e(x),
\]
这时 \(\delta\) 称为 99% 边界层厚度。对平板零压梯度层流边界层，可由量级分析得到它的增长律。边界层方程中惯性项与法向粘性扩散项平衡：
\[
u\frac{\partial u}{\partial x}\sim \nu\frac{\partial^2u}{\partial y^2}.
\]
取 \(u\sim U_\infty\)、\(\partial/\partial x\sim1/x\)、\(\partial^2/\partial y^2\sim1/\delta^2\)，得
\[
\frac{U_\infty^2}{x}\sim \nu\frac{U_\infty}{\delta^2},
\]
所以
\[
\delta\sim \sqrt{\frac{\nu x}{U_\infty}}=\frac{x}{\sqrt{Re_x}},\qquad Re_x=\frac{U_\infty x}{\nu}.
\]
Blasius 解给出更具体的 99% 厚度近似
\[
\delta_{99}\approx 5\sqrt{\frac{\nu x}{U_\infty}}.
\]
需要区分的是：\(\delta\) 是按速度达到外流某一比例定义的几何厚度；位移厚度 \(\delta^*\) 和动量厚度 \(\theta\) 是积分厚度，分别衡量质量流量亏损和动量亏损，不能互相替代。若为湍流边界层、非零压强梯度或粗糙壁面，厚度增长规律和系数都会改变；因此写答案时要同时说明定义口径和适用条件。`,
    boundaryNote: 'derived/reference answer；补出边界层量级证明和定义边界，不声明原答案 PDF 逐字证明。'
  },
  {
    id: 'ocean-2010-02-04',
    diagnosis: '旧答案只列相似条件和阻力系数，没有说明深水潜艇为什么以 Reynolds 数为主、何时还需 Froude/空化/粗糙度修正，以及阻力换算公式。',
    referenceAnswer: String.raw`深水航行潜艇阻力模型实验首先要满足几何相似，即模型与实艇各线尺度成同一比例
\[
\lambda_L=\frac{L_p}{L_m},
\]
外形、迎角、附体和参考面积比例一致。其次要满足运动相似，即来流方向、姿态和相对速度场相似。动力相似要使主要力的无量纲比相同。潜艇在深水中远离自由面，兴波影响可以弱化，因此不像水面船那样首先要求 Froude 数相似；若题目强调深水匀速绕流，主控相似准则通常取 Reynolds 数
\[
Re=\frac{\rho UL}{\mu}=\frac{UL}{\nu}.
\]
理想要求
\[
Re_m=Re_p,
\]
这样惯性力与粘性力之比相同，边界层状态、摩阻和分离才有可比性。若模型和实艇不在同一 Reynolds 数范围，必须用阻力系数曲线、临界 Reynolds 数、表面粗糙度或边界层转捩修正，不能只按面积比例外推。若速度很高还要检查空化数；若离自由面不够远则还要考虑 Froude 数。实验结果应写成无量纲阻力系数，例如
\[
C_D=\frac{D}{\frac12\rho U^2S},
\]
其中 \(S\) 可取湿表面积或约定参考面积。若模型与实艇在相同相似准则下有相同 \(C_D\)，则
\[
D_p=C_D\frac12\rho_pU_p^2S_p,\qquad
D_m=C_D\frac12\rho_mU_m^2S_m,
\]
从而
\[
\frac{D_p}{D_m}=\frac{\rho_pU_p^2S_p}{\rho_mU_m^2S_m}.
\]
若同一流体且几何相似，\(S_p/S_m=\lambda_L^2\)。这个换算成立的边界是：阻力组成、流态和参考面积定义一致；否则必须把摩擦阻力、压差阻力、附体干扰阻力分项处理。`,
    boundaryNote: 'derived/reference answer；按模型相似理论补全推理和换算，不声明原答案 PDF 严格证据。'
  },
  {
    id: 'ocean-2015-01-01',
    diagnosis: '旧答案只给散度和旋度定义，缺少从微团体积变化、环量/自转角速度解释到不可压缩/无旋判别的完整链条。',
    referenceAnswer: String.raw`速度散度的数学形式为
\[
\nabla\cdot\mathbf V=\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}+\frac{\partial w}{\partial z}.
\]
它的物理意义可以从一个随流体运动的小控制体看出：小体积的相对膨胀率满足
\[
\frac{1}{\Delta V}\frac{D(\Delta V)}{Dt}=\nabla\cdot\mathbf V.
\]
也可用 Gauss 定理理解为单位体积的净流出量：
\[
\nabla\cdot\mathbf V=\lim_{\Delta V\to0}\frac{1}{\Delta V}\oint_{\partial\Delta V}\mathbf V\cdot\mathbf n\,dS.
\]
由这个定义可得，散度大于零表示局部像源一样膨胀或净流出，散度小于零表示局部汇聚或体积压缩。再由连续方程
\[
\frac{D\rho}{Dt}+\rho\nabla\cdot\mathbf V=0
\]
可见：若流体密度随质点不变，即 \(D\rho/Dt=0\)，则必须满足
\[
\nabla\cdot\mathbf V=0.
\]
因此不可压缩的判别不是“速度不变”，而是体积不变；结论检查时应看散度是否为零。
速度旋度为
\[
\nabla\times\mathbf V,
\]
在流体力学中称为涡量 \(\boldsymbol\omega\)。它表示流体微团的局部旋转强度和旋转轴方向；微团平均角速度为
\[
\boldsymbol\Omega=\frac12\nabla\times\mathbf V.
\]
例如平面流中
\[
\omega_z=\frac{\partial v}{\partial x}-\frac{\partial u}{\partial y},
\]
它衡量相邻流体线元剪切造成的局部自转。由 Stokes 定理还可得，旋度在某一面法向上的分量等于单位面积环量的极限，所以它也给出局部环量密度。若 \(\nabla\times\mathbf V=0\)，称为无旋流，此时在单连通区域内可引入速度势 \(\phi\)，使
\[
\mathbf V=\nabla\phi.
\]
适用前提是速度场足够光滑，若区域含有奇点或多连通障碍，即使局部旋度为零，环量仍可能需要单独讨论。需要注意：散度为零不等于没有速度变化，而是体积不变；旋度为零也不等于流线是直线，而是局部微团不自转。剪切流可以不可压但有旋，势流可以无旋但速度仍随空间变化。`,
    boundaryNote: 'derived/reference answer；概念题补出物理判别链和误区边界，不声明原答案 PDF 逐字证据。'
  },
  {
    id: 'ocean-2015-01-03',
    diagnosis: '旧答案只按曲线形态给判断，缺少理想圆柱势流压强系数推导、粘性分离导致曲线差异的机制和图号缺失边界。',
    referenceAnswer: String.raw`理想不可压无旋圆柱绕流可由均匀流叠加偶极子得到。圆柱表面 \(r=a\) 上切向速度为
\[
V_\theta=-2U_\infty\sin\theta,
\]
法向速度为零。沿同一高度用 Bernoulli 方程
\[
p+\frac12\rho V^2=p_\infty+\frac12\rho U_\infty^2
\]
得压强系数
\[
C_p=\frac{p-p_\infty}{\frac12\rho U_\infty^2}=1-\frac{V^2}{U_\infty^2}
=1-4\sin^2\theta.
\]
因此理想理论曲线有三个明显特征：前后驻点 \(\theta=0^\circ,180^\circ\) 处 \(C_p=1\)；上下对称位置 \(\theta=90^\circ,270^\circ\) 处 \(C_p=-3\)；关于前后方向完全对称，没有尾迹压差阻力。图中若有一条前后对称、最低点接近侧面、尾部又恢复到驻点高压的曲线，它就是理想流体理论解。实际观测曲线不同，是因为真实流体有粘性，圆柱表面形成边界层；在后半圆逆压梯度作用下，边界层动量不足会分离，分离后产生尾迹和低压区，所以后驻点附近压强不能恢复到理想值。若边界层为层流，抗逆压梯度能力弱，分离较早，尾部低压更强；若边界层转捩为湍流，近壁混合增强、动量较高，分离延后，尾部压强恢复较好。因此三条曲线通常可按“理想对称曲线、层流较早分离观测曲线、湍流延迟分离观测曲线”来解释。当前结构化题干没有保存图 1 的编号或线型颜色，所以不能负责任地写成“第几条曲线”；只能按曲线形态给出识别规则。`,
    boundaryNote: 'derived/reference answer；原图编号未进入结构化题干，保留源图复核边界。'
  },
  {
    id: 'ocean-2016-04',
    diagnosis: '旧答案只描述逆压梯度和切应力为零，缺少边界层动量方程、近壁流体动量亏损到回流的因果链。',
    referenceAnswer: String.raw`绕流脱体，也就是流动分离，发生在粘性边界层不能继续贴附固壁前进的时候。固壁上无滑移使近壁速度从
\[
u(x,0)=0
\]
开始向外层速度过渡，近壁流体的动量本来就比外层小。边界层沿壁方向的主要动量平衡可写成
\[
u\frac{\partial u}{\partial x}+v\frac{\partial u}{\partial y}
=-\frac{1}{\rho}\frac{dp}{dx}+\nu\frac{\partial^2u}{\partial y^2}.
\]
当物体后半部或扩压段出现逆压梯度
\[
\frac{dp}{dx}>0
\]
时，流体沿前进方向要爬升压强，惯性项被压强项持续减速。外层高速流体还可能越过该区域，但边界层内近壁低速流体动量小，又不断受壁面粘性耗散，速度梯度逐渐变小。壁面切应力为
\[
\tau_w=\mu\left(\frac{\partial u}{\partial y}\right)_{y=0}.
\]
在分离点，近壁速度梯度降为零，即
\[
\left(\frac{\partial u}{\partial y}\right)_{y=0}=0,\qquad \tau_w=0.
\]
再往后若逆压梯度仍强，近壁处会出现
\[
\left(\frac{\partial u}{\partial y}\right)_{y=0}<0
\]
对应的回流，外层流线从壁面脱开，形成分离剪切层、尾迹和旋涡区。由此可见，分离不是“理想流体绕不过去”，而是粘性边界层在逆压梯度下动量亏损的结果。延迟分离的常见办法包括使边界层转捩为湍流、吸除低速边界层、吹气增能或减小逆压梯度；但这些改变的是边界层动量供应，不改变分离判据的基本物理图像。`,
    boundaryNote: 'derived/reference answer；补出边界层方程和分离判据，不声明原答案 PDF 逐字证明。'
  },
  {
    id: 'ocean-2012-07-01',
    diagnosis: '旧答案只给 Couette 速度分布，缺少定常充分发展假设、N-S 方程化简、积分常数与坐标口径说明。',
    referenceAnswer: String.raw`这是两平行板间无压强梯度的平面 Couette 流。设两板间距为 \(h\)，取 \(x\) 沿运动板方向，\(y\) 垂直于平板。若上板静止位于 \(y=0\)，下板以速度 \(U\) 运动位于 \(y=h\)，速度场可设为
\[
\mathbf V=(u(y),0,0).
\]
定常、不可压、充分发展且无流向压强梯度时，\(x\) 向 Navier-Stokes 方程化为
\[
0=-\frac{dp}{dx}+\mu\frac{d^2u}{dy^2},
\]
而题设
\[
\frac{dp}{dx}=0,
\]
所以
\[
\frac{d^2u}{dy^2}=0.
\]
两次积分得
\[
u(y)=C_1y+C_2.
\]
无滑移条件给出
\[
u(0)=0,\qquad u(h)=U.
\]
代入得 \(C_2=0\)、\(C_1=U/h\)，于是
\[
u(y)=\frac{U}{h}y,\qquad v=w=0.
\]
该线性分布说明剪切率处处相同：
\[
\frac{du}{dy}=\frac{U}{h},
\]
剪应力也为常数
\[
\tau_{xy}=\mu\frac{U}{h}.
\]
若题目把坐标原点取在运动下板、向上为正，则边界条件变为 \(u(0)=U,\ u(h)=0\)，等价写成
\[
u(y)=U\left(1-\frac{y}{h}\right).
\]
两种表达没有物理矛盾，只是坐标方向不同。若存在压强梯度，则速度会叠加 Poiseuille 抛物线项，不能再只写线性 Couette 分布。`,
    boundaryNote: 'derived/reference answer；补出方程化简和坐标边界，不声明原答案 PDF 严格证据。'
  },
  {
    id: 'ocean-2006-02-03',
    diagnosis: '旧答案只给流线和轨迹结论，缺少由点源速度场写出流线微分方程与质点运动方程的积分过程。',
    referenceAnswer: String.raw`由前两小题可知，二维点源流的 Euler 速度场为
\[
v_r=\frac{m}{2\pi r},\qquad v_\theta=0,
\]
其中 \(m\) 为单位厚度体积流量强度。流线是在某一固定时刻处处与速度矢量相切的曲线。在极坐标中流线微分关系为
\[
\frac{dr}{v_r}=\frac{r\,d\theta}{v_\theta}.
\]
因为 \(v_\theta=0\)，速度没有切向分量，流线方向只能沿半径方向，所以
\[
d\theta=0,
\]
积分得到
\[
\theta=C.
\]
因此瞬时流线是从原点发出的径向直线；若 \(m>0\) 是点源，流向由内向外，若 \(m<0\) 是点汇，流向由外向内。轨迹线是某一个流体质点随时间走过的路径，应解 Lagrange 方程：
\[
\frac{dr}{dt}=\frac{m}{2\pi r},\qquad
\frac{d\theta}{dt}=0.
\]
第二式给出
\[
\theta(t)=\theta_0.
\]
第一式两边乘以 \(2r\)，得
\[
\frac{d(r^2)}{dt}=\frac{m}{\pi}.
\]
若 \(t=t_0\) 时 \(r=r_0\)，积分得
\[
r^2=r_0^2+\frac{m}{\pi}(t-t_0).
\]
这说明质点也沿固定极角的径向直线运动，只是半径随时间按上式变化。由于该速度场不显含时间，是定常流，轨迹线与流线的几何形状一致；如果速度场非定常，一般不能把二者直接等同。`,
    boundaryNote: 'derived/reference answer；补出流线方程与质点方程积分过程，不声明原答案 PDF 逐字证明。'
  },
  {
    id: 'ocean-2018-04-02',
    diagnosis: '旧答案只写积分和结果，缺少微元宽度、Bernoulli 出流速度、变量替换积分和流量系数边界。',
    referenceAnswer: String.raw`把三角形薄壁堰近似为理想自由出流来计算。设堰口半角为 \(\theta\)，水面到角尖的高度为 \(h\)，从角尖向上取坐标 \(y\)。高度为 \(y\) 的水平薄条宽度为
\[
b(y)=2y\tan\theta.
\]
该薄条距自由液面的水头为 \(h-y\)。若忽略粘性、收缩和局部损失，由自由液面到薄条出口用 Bernoulli 方程得出流速度
\[
v(y)=\sqrt{2g(h-y)}.
\]
厚度为 \(dy\) 的微元流量为
\[
dQ=b(y)v(y)\,dy=2y\tan\theta\sqrt{2g(h-y)}\,dy.
\]
总流量由角尖到水面积分：
\[
Q=\int_0^h2y\tan\theta\sqrt{2g(h-y)}\,dy.
\]
提出常数后
\[
Q=2\tan\theta\sqrt{2g}\int_0^h y(h-y)^{1/2}\,dy.
\]
令 \(s=h-y\)，则 \(y=h-s\)，积分变为
\[
\int_0^h (h-s)s^{1/2}\,ds
=h\frac{2}{3}h^{3/2}-\frac{2}{5}h^{5/2}
=\frac{4}{15}h^{5/2}.
\]
因此
\[
Q=\frac{8}{15}\sqrt{2g}\tan\theta\,h^{5/2}.
\]
若实际堰流存在收缩、粘性和速度分布修正，应写成
\[
Q=C_d\frac{8}{15}\sqrt{2g}\tan\theta\,h^{5/2},
\]
其中 \(C_d\) 为流量系数。该推导的边界是薄壁三角堰、自由液面速度相对可忽略、压强近似大气压、局部损失由 \(C_d\) 吸收；若题目要求工程公式，不能把 \(C_d=1\) 的理想结果直接当实测流量。`,
    boundaryNote: 'derived/reference answer；补出积分过程和工程修正边界，不声明原答案 PDF 严格证据。'
  },
  {
    id: 'ocean-2014-03-01',
    diagnosis: '旧答案只给一组速度分量，缺少由流线斜率与速度大小联立求解、整体反向不唯一的说明。',
    referenceAnswer: String.raw`题给流线族为
\[
x^2-y^2=C.
\]
沿同一条流线微分，得
\[
2x\,dx-2y\,dy=0,
\]
所以
\[
\frac{dy}{dx}=\frac{x}{y}.
\]
另一方面，二维流线的切线方向与速度方向一致，因此
\[
\frac{dy}{dx}=\frac{v}{u}.
\]
于是速度分量必须满足
\[
\frac{v}{u}=\frac{x}{y},
\]
即
\[
vy=ux.
\]
若题目还给速度大小
\[
V=\sqrt{x^2+y^2},
\]
则有
\[
u^2+v^2=x^2+y^2.
\]
由 \(v=(x/y)u\) 代入速度大小式：
\[
u^2+\frac{x^2}{y^2}u^2=x^2+y^2.
\]
整理得
\[
u^2\frac{x^2+y^2}{y^2}=x^2+y^2,
\]
因此
\[
u^2=y^2,\qquad u=\pm y.
\]
相应地
\[
v=\pm x,
\]
且二者必须取同号。若题目没有额外给定流向，一组与流线族和速度大小一致的速度场可取
\[
u=y,\qquad v=x.
\]
整体反向
\[
u=-y,\qquad v=-x
\]
也给出同一组流线和同一速度大小，只是流动方向相反。通常后续若要判断加速度、旋度或流函数，必须先固定这个符号约定；本答案以下默认取 \(u=y,\ v=x\)。在 \(y=0\) 处可用连续延拓理解结果，不能单独用斜率式除以零。`,
    boundaryNote: 'derived/reference answer；补出联立求解和方向不唯一边界，不声明原答案 PDF 逐字证明。'
  },
  {
    id: 'ocean-2007-07-04',
    diagnosis: '旧答案只写功率和耗散相等，缺少 Couette 速度场、壁面剪应力、耗散函数积分和能量守恒解释。',
    referenceAnswer: String.raw`本题承接两平行板间无压强梯度的 Couette 流。设下板固定在 \(y=0\)，上板在 \(y=h\) 处以速度 \(u_0\) 运动。由前面速度分布
\[
u(y)=u_0\frac{y}{h}
\]
可得剪切率为常数
\[
\frac{du}{dy}=\frac{u_0}{h}.
\]
牛顿流体的剪应力为
\[
\tau_{xy}=\mu\frac{du}{dy}=\mu\frac{u_0}{h}.
\]
为了保持上板匀速运动，外力对单位面积上板所做功率等于外力切向力乘以上板速度：
\[
P_A=\tau_{xy}u_0=\frac{\mu u_0^2}{h}.
\]
若只取大小，符号就是正的外部输入功率；若按流体对板的阻力方向计，剪应力方向与上板运动相反，外力必须取相反方向维持运动。流体内部的单位体积粘性耗散率，对这种一维剪切流可写为
\[
\Phi=\mu\left(\frac{du}{dy}\right)^2
=\mu\left(\frac{u_0}{h}\right)^2.
\]
单位面积平板间流体柱的总机械能耗散率为
\[
E_A=\int_0^h \Phi\,dy
=\int_0^h \mu\left(\frac{u_0}{h}\right)^2dy
=\frac{\mu u_0^2}{h}.
\]
因此
\[
P_A=E_A.
\]
物理意义是：在定常、无压强梯度、无动能积累的 Couette 流中，上板外力输入的机械功全部通过粘性剪切转化为热耗散。若有压强梯度、非定常加速或其它体力做功，能量收支还会包含压力功、动能储存和通量项，不能只用这个等式。`,
    boundaryNote: 'derived/reference answer；补出功率与耗散等式的完整推导，不声明原答案 PDF 严格证据。'
  }
];
