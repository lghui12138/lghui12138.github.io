#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const version = 'round537-181103-proof-depth-upgrade-20260625';
const generatedAt = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round537 proof-depth upgrade from /Volumes/mac_2T during lifs isolation.');
}

const bankRel = 'question-banks/181103-material-extracted.json';
const ledgerRel = 'data/fluid-round537-181103-proof-depth-upgrade.json';
const docRel = 'docs/round537-181103-proof-depth-upgrade.md';

const upgrades = {
  '181103-material-extracted-0001': {
    diagnosis: '原答案只有概念结论，缺少连续介质假设的尺度证明、适用条件和为什么能把流体量写成场函数。',
    answer: String.raw`流点不是数学上无限小的分子点，而是在连续介质假设下取出的流体微团。设分子平均自由程或分子尺度为 \\(\ell_m\\)，宏观流动特征长度为 \\(L\\)，可以选取一个中间尺度 \\(\\delta l\\)，使
\\[
\\ell_m\\ll \\delta l\\ll L.
\\]
这个微团内仍含大量分子，因而密度、速度、压强、温度等统计平均量有稳定意义；同时它相对宏观长度又足够小，可以近似看成几何点。这样的物质微团通常称为流点或流体质点。空间点则只是欧拉描述中的固定几何位置 \\((x,y,z)\\)，不随某一团流体一起运动。连续介质处理的必要性在于，若直接追踪分子运动，未知量数量巨大，无法用 \\(\\rho,\\mathbf v,p,T\\) 这样的场变量建立连续方程和动量方程。连续介质处理的可能性在于上述尺度分离成立，故可写
\\[
\\rho=\\rho(x,y,z,t),\\quad \\mathbf v=\\mathbf v(x,y,z,t),\\quad p=p(x,y,z,t).
\\]
由此才能定义 \\(dV\\)、\\(dS\\)、\\(\\nabla\\cdot\\mathbf v\\)、\\(D\\rho/Dt\\) 等微分量，并用质量守恒、动量守恒和能量守恒推导流体力学方程。若气体极稀薄、\\(\\ell_m/L\\) 不再很小，连续介质假设就要修正。`,
    boundaryNote: '按连续介质尺度分离补全；此题是概念证明，不涉及原答案 PDF 严格页框证明。'
  },
  '181103-material-extracted-0472': {
    diagnosis: '原答案只说连续方程和 Bernoulli 方程可闭合，没有写出变量、符号约定、微分方程和积分形式。',
    answer: String.raw`设竖直管截面积为 \\(S\\)，每个水平支管截面积为 \\(S/2\\)，液面到分岔处高度为 \\(y(t)\\)，初值为 \\(y(0)=a\\)。两支管完全对称，所以两支管平均速度相同，记为 \\(u(t)\\)。竖管液面下降速度为 \\(-dy/dt\\)。由体积守恒，竖管减少的流量等于两支管流量之和：
\\[
-S\\frac{dy}{dt}=2\\frac S2 u=Su,
\\qquad u=-\\frac{dy}{dt}.
\\]
若按理想流体、忽略局部损失和支管附加惯性，并把出口压强取为大气压，则自由液面到出口的非定常能量关系可化为水头转动能的运动方程。常用近似为
\\[
\\frac{u^2}{2g}=y,
\\qquad -\\frac{dy}{dt}=\\sqrt{2gy}.
\\]
分离变量积分：
\\[
\\int_a^{y(t)}\\frac{dy}{\\sqrt y}=-\\sqrt{2g}\\int_0^t dt,
\\]
故
\\[
2\\sqrt{y}-2\\sqrt a=-\\sqrt{2g}\,t,
\\quad
\\sqrt y=\\sqrt a-\\sqrt{\\frac g2}\,t.
\\]
于是
\\[
y(t)=\\left(\\sqrt a-\\sqrt{\\frac g2}\,t\\right)^2,
\\quad
u(t)=\\sqrt{2g y(t)}=\\sqrt{2ga}-gt,
\\]
直到 \\(t=\\sqrt{2a/g}\\) 排空为止。若题图要求保留水平管内水柱惯性或局部损失，则只需在 Bernoulli 方程中加入相应惯性水头或损失水头，连续方程 \\(u=-dy/dt\\) 不变。`,
    boundaryNote: '无原图细节时采用对称双支管、理想无损出口近似；若源页图给出水平管长度，应把附加惯性项加入运动方程。'
  },
  '181103-material-extracted-0497': {
    diagnosis: '原答案只有镜像法提示，没有给出复势叠加、第一象限边界条件、流线式和速度代入。',
    answer: String.raw`第一象限的两坐标轴作为固壁时，边界条件是轴线上法向速度为零，因此可用同号镜像源保证轴线为流线。令源强约定为 \\(m\\)，源位于 \\(z_0=1+i\\)。对两轴反射后，镜像点为 \\(-1+i,1-i,-1-i\\)。若把原点处汇理解为第一象限内吸入强度为 \\(m\\) 的角点汇，则在全平面镜像表达中可写成等效 \\(4m\\) 的角点汇。于是一个常用复势写法为
\\[
W(z)=\\frac{m}{2\\pi}\{\\log(z-1-i)+\\log(z+1-i)+\\log(z-1+i)+\\log(z+1+i)-4\\log z\}.
\\]
流函数为 \\(\\psi=\\operatorname{Im}W\\)。在极坐标 \\(z=re^{i\\theta}\\) 中，流线方程就是
\\[
\\operatorname{Im}\{\\log(re^{i\\theta}-1-i)+\\log(re^{i\\theta}+1-i)+\\log(re^{i\\theta}-1+i)+\\log(re^{i\\theta}+1+i)-4\\log(re^{i\\theta})\}=C.
\\]
速度由复速度求得：
\\[
\\frac{dW}{dz}=\\frac{m}{2\\pi}\left(\\frac1{z-1-i}+\\frac1{z+1-i}+\\frac1{z-1+i}+\\frac1{z+1+i}-\\frac4z\\right).
\\]
代入 \\(z=1\\) 有
\\[
\\frac1{-i}+\\frac1{2-i}+\\frac1{i}+\\frac1{2+i}-4
=i+\\frac{2+i}{5}-i+\\frac{2-i}{5}-4=-\\frac{16}{5}.
\\]
故按此强度约定，\\(dW/dz|_{z=1}=-8m/(5\\pi)\\)，速度沿负 \\(x\\) 方向。若教材把角点汇强度定义为全平面强度而非象限内通量，则只需把 \\(-4\\log z\\) 的系数同步改成题面约定。`,
    boundaryNote: '角点汇强度有象限通量和全平面强度两种约定，本答案显式记录采用象限内汇强为 m。'
  },
  '181103-material-extracted-0200': {
    diagnosis: '原答案只列三个结论，缺少变量选择、量纲矩阵和三种主导物理机制的推导。',
    answer: String.raw`设无限深小振幅正弦波波速 \\(c\\) 与波长 \\(\\lambda\\)、流体密度 \\(\\rho\\)、重力加速度 \\(g\\)、表面张力系数 \\(\\Sigma\\) 有关，粘性忽略。量纲为
\\[
[c]=LT^{-1},\\quad [\\lambda]=L,\\quad [\\rho]=ML^{-3},\\quad [g]=LT^{-2},\\quad [\\Sigma]=MT^{-2}.
\\]
若表面张力主要，变量取 \\(c,\\Sigma,\\rho,\\lambda\\)。令 \\(c\\sim \\Sigma^a\\rho^b\\lambda^d\\)，比较 \\(M,L,T\\) 指数：
\\[
a+b=0,\\quad -3b+d=1,\\quad -2a=-1.
\\]
得 \\(a=1/2,b=-1/2,d=-1/2\\)，所以
\\[
c=C_1\\sqrt{\\frac{\\Sigma}{\\rho\\lambda}}.
\\]
若重力主要，变量取 \\(c,g,\\lambda\\)，由 \\(LT^{-1}=(LT^{-2})^aL^b\\) 得 \\(a=1/2,b=1/2\\)，故
\\[
c=C_2\\sqrt{g\\lambda}.
\\]
若重力和表面张力都重要，可用 \\(g,\\lambda\\) 给出基准速度，剩余无量纲组为
\\[
\\Pi=\\frac{\\Sigma}{\\rho g\\lambda^2}.
\\]
因此
\\[
c=\\sqrt{g\\lambda}\,f\\left(\\frac{\\Sigma}{\\rho g\\lambda^2}\\right).
\\]
这只给出尺度形式，常数和函数需由完整色散关系或实验确定。`,
    boundaryNote: '量纲分析只能判定幂律和无量纲参数，不能替代波动方程给出精确系数。'
  },
  '181103-material-extracted-0463': {
    diagnosis: '原答案给数值但未证明为什么波速按平方根尺度比缩放，也未说明港池模型应取 Froude 相似。',
    answer: String.raw`港池波浪模型以重力和惯性为主，通常采用 Froude 相似而不是 Reynolds 相似。设原型长度尺度为 \\(L_p\\)，模型长度尺度为 \\(L_m\\)，题给尺度比 \\(L_p/L_m=280\\)。Froude 数定义为
\\[
Fr=\\frac{V}{\\sqrt{gL}}.
\\]
相似要求
\\[
Fr_m=Fr_p,
\\qquad \\frac{V_m}{\\sqrt{gL_m}}=\\frac{V_p}{\\sqrt{gL_p}}.
\\]
因两边均在地球重力下，\\(g\\) 相同，于是
\\[
V_m=V_p\\sqrt{\\frac{L_m}{L_p}}=\\frac{V_p}{\\sqrt{280}}.
\\]
波幅作为长度量，按几何相似直接缩放：
\\[
A_m=\\frac{A_p}{280}=\\frac{1.524}{280}=0.00544\\text{ m}.
\\]
波速为
\\[
V_m=\\frac{9.144}{\\sqrt{280}}=0.546\\text{ m/s}.
\\]
所以模型实验中的波幅约 \\(5.44\\text{ mm}\\)，波速约 \\(0.546\\text{ m/s}\\)。若题目研究的是毛细波或黏性主导小尺度波，则相似准则需改用 Weber 或 Reynolds 数；本题港池 storm wave 采用 Froude 相似。`,
    boundaryNote: '明确采用重力波 Froude 相似；未声称同时满足黏性摩阻相似。'
  },
  '181103-material-extracted-0117': {
    diagnosis: '原答案直接写 Nu=f(Re,Pr)，没有从变量量纲和 Buckingham Π 定理推出三个无量纲组。',
    answer: String.raw`设热量输送系数为 \\(h\\)，与圆管直径 \\(D\\)、平均速度 \\(w\\)、密度 \\(\\rho\\)、动力黏度 \\(\\mu\\)、热传导系数 \\(k\\)、定压比热 \\(c_p\\) 有关。各量量纲可写为
\\[
[h]=MT^{-3}\\Theta^{-1},\\ [D]=L,\\ [w]=LT^{-1},\\ [\\rho]=ML^{-3},\\ [\\mu]=ML^{-1}T^{-1},\\ [k]=MLT^{-3}\\Theta^{-1},\\ [c_p]=L^2T^{-2}\\Theta^{-1}.
\\]
共有 7 个变量，基本量纲为 \\(M,L,T,\\Theta\\)，故有 3 个无量纲组。取 \\(D,w,\\rho,k\\) 为重复变量，热传输系数构成
\\[
\\Pi_1=\\frac{hD}{k}=Nu.
\\]
黏性系数组合为
\\[
\\Pi_2=\\frac{\\rho wD}{\\mu}=Re.
\\]
比热与导热、黏性构成
\\[
\\Pi_3=\\frac{\\mu c_p}{k}=Pr.
\\]
于是 Buckingham \\(\\Pi\\) 定理给出
\\[
F(Nu,Re,Pr)=0,
\\qquad Nu=\\Phi(Re,Pr).
\\]
即
\\[
\\frac{hD}{k}=\\Phi\\left(\\frac{\\rho wD}{\\mu},\\frac{\\mu c_p}{k}\\right).
\\]
它说明圆管强迫对流传热由惯性/黏性比和动量扩散/热扩散比共同控制，具体函数要由理论解或实验关联式确定。`,
    boundaryNote: '按题面变量推导 Nu-Re-Pr 关系；不把经验关联式当作题目给定答案。'
  },
  '181103-material-extracted-0201': {
    diagnosis: '原答案只写解析式，没有解释图解法中切线斜率、相速点斜率和波长导数符号的关系。',
    answer: String.raw`令波长为 \\(L\\)，圆波数 \\(k=2\\pi/L\\)，圆频率 \\(\\sigma=kc=2\\pi c/L\\)。群速定义为色散曲线 \\(\\sigma(k)\\) 上的切线斜率：
\\[
c_g=\\frac{d\\sigma}{dk}.
\\]
为了用 \\(L\\) 表示，先对 \\(L\\) 求导：
\\[
\\frac{dk}{dL}=-\\frac{2\\pi}{L^2}=-\\frac{k}{L},
\\qquad \\sigma=\\frac{2\\pi c(L)}{L}.
\\]
于是
\\[
\\frac{d\\sigma}{dL}=2\\pi\\left(\\frac1L\\frac{dc}{dL}-\\frac{c}{L^2}\\right).
\\]
相除得
\\[
c_g=\\frac{d\\sigma/dL}{dk/dL}=c-L\\frac{dc}{dL}.
\\]
图解时，\\(c=\\sigma/k\\) 是原点到色散曲线上该点的割线斜率，\\(c_g=d\\sigma/dk\\) 是该点切线斜率。上式说明二者差为
\\[
c_g-c=-L\\frac{dc}{dL}.
\\]
因此若 \\(dc/dL>0\\)，则 \\(c_g<c\\)；若 \\(dc/dL<0\\)，则 \\(c_g>c\\)；若 \\(dc/dL=0\\)，则 \\(c_g=c\\)。这与图上切线相对割线的斜率高低完全一致。`,
    boundaryNote: '解析推导补足图解法逻辑；图形结论以色散曲线足够光滑为前提。'
  },
  '181103-material-extracted-0461': {
    diagnosis: '原答案只给 F∝L，没有利用 Stokes 方程的无量纲化说明为什么不出现密度和二次速度项。',
    answer: String.raw`低 Reynolds 数下控制方程为
\\[
\\nabla\\cdot\\mathbf V=0,
\\qquad \\nabla p=\\mu\\nabla^2\\mathbf V,
\\]
远处速度为 \\(V_\\infty\\)，物体特征尺寸为 \\(L\\)。取
\\[
\\mathbf x=L\\mathbf x^*,\\quad \\mathbf V=V_\\infty\\mathbf V^*,\\quad p=\\frac{\\mu V_\\infty}{L}p^*.
\\]
代入后得
\\[
\\nabla^*\\cdot\\mathbf V^*=0,
\\qquad \\nabla^*p^*=\\nabla^{*2}\\mathbf V^*.
\\]
无量纲方程和边界 \\(z/L=f(x/L,y/L)\\)、\\(\\mathbf V^*=0\\)、\\(\\mathbf V^*\\to\\mathbf e_x\\) 中已不含 \\(L\\)、\\(\\rho\\) 或 \\(V_\\infty\\) 的额外组合。因此物面应力尺度为
\\[
\\tau\\sim \\mu\\frac{V_\\infty}{L},
\\]
受力为应力乘面积尺度 \\(L^2\\)：
\\[
F=C\\left(\\mu\\frac{V_\\infty}{L}\\right)L^2=C\\mu V_\\infty L.
\\]
常数 \\(C\\) 只由无量纲几何形状和受力方向决定。故在 Stokes 极限中，阻力与特征尺寸 \\(L\\) 的一次方成正比，而不是惯性主导流动中常见的 \\(\\rho V_\\infty^2L^2\\) 量级。`,
    boundaryNote: '这里证明的是 Stokes 方程支配下的尺度律；若 Reynolds 数不小，惯性项会重新引入 Re 依赖。'
  },
  '181103-material-extracted-0469': {
    diagnosis: '原答案没有给自由面常数、体积守恒和底部总压力积分，导致第三问缺失。',
    answer: String.raw`稳定刚体旋转时速度为
\\[
v_r=0,\\qquad v_z=0,\\qquad v_\\theta=\\omega r.
\\]
柱坐标 Euler 平衡方程化为
\\[
\\frac{\\partial p}{\\partial r}=\\rho\\omega^2r,
\\qquad
\\frac{\\partial p}{\\partial z}=-\\rho g.
\\]
积分得
\\[
p=\\frac12\\rho\\omega^2r^2-\\rho gz+C.
\\]
自由表面上 \\(p=0\\)，故
\\[
z_s(r)=\\frac{C}{\\rho g}+\\frac{\\omega^2r^2}{2g}.
\\]
常数由体积守恒确定：旋转前液面平均高度为 \\(h\\)，旋转后圆盘平均高度仍为 \\(h\\)。由于
\\[
\\overline{r^2}=\\frac{2}{a^2}\\int_0^a r^3dr=\\frac{a^2}{2},
\\]
有
\\[
h=\\frac{C}{\\rho g}+\\frac{\\omega^2a^2}{4g},
\\quad
C=\\rho gh-\\frac14\\rho\\omega^2a^2.
\\]
所以自由面为
\\[
z_s=h+\\frac{\\omega^2}{2g}\\left(r^2-\\frac{a^2}{2}\\right),
\\]
压强分布为
\\[
p=\\rho g(h-z)+\\rho\\omega^2\\left(\\frac{r^2}{2}-\\frac{a^2}{4}\\right).
\\]
底部 \\(z=0\\) 总压力
\\[
P=\\int_0^a p(r,0)2\\pi r\\,dr=\\rho g h\\pi a^2,
\\]
因为旋转附加项对底面积分正负相抵。`,
    boundaryNote: '不计大气压时使用表压；若需绝对压力，应整体加上大气压项。'
  },
  '181103-material-extracted-0470': {
    diagnosis: '原答案给自由面式但缺少从速度势到速度、再到 Bernoulli 常数的推导。',
    answer: String.raw`柱坐标中速度势为 \\(\\varphi=k\\theta\\)。速度分量由
\\[
v_r=\\frac{\\partial\\varphi}{\\partial r},\\qquad
v_\\theta=\\frac1r\\frac{\\partial\\varphi}{\\partial\\theta},\\qquad
v_z=\\frac{\\partial\\varphi}{\\partial z}
\\]
给出，因此
\\[
v_r=0,\\qquad v_\\theta=\\frac{k}{r},\\qquad v_z=0.
\\]
这是绕轴的自由涡，速度大小为 \\(V^2=k^2/r^2\\)。自由表面压强为常值，定常无黏无旋流可沿自由面写 Bernoulli 方程：
\\[
\\frac{p}{\\rho}+gz+\\frac{V^2}{2}=C.
\\]
自由面上 \\(p\\) 为同一常值，可并入常数，得
\\[
gz+\\frac{k^2}{2r^2}=C_1.
\\]
题给 \\(r\\to\\infty\\) 处水面高度为 \\(h\\)，此时 \\(k^2/(2r^2)\\to0\\)，故 \\(C_1=gh\\)。于是自由表面方程为
\\[
z=h-\\frac{k^2}{2gr^2}.
\\]
这说明靠近旋涡中心速度增大，动能水头增大，压力水头或位置水头必须下降，所以自由面下凹。若中心处存在涡核，公式只适用于涡核外的势涡区域。`,
    boundaryNote: '速度势 kθ 多值，物理速度单值；中心奇点附近需用有限涡核修正。'
  },
  '181103-material-extracted-0487': {
    diagnosis: '原答案只说非定常 Bernoulli，没有给刚打开和打开后的压强计算框架。',
    answer: String.raw`设折管截面积为 1，沿管轴从自由端 \\(C\\) 经过转折点 \\(A\\) 到开口 \\(B\\) 取弧长坐标 \\(s\\)，两段长度均为 \\(h\\)。刚打开开关时，速度尚为零，但液柱立即获得加速度，所以不能用定常 Bernoulli 只看 \\(V^2/2\\)。对无旋一维运动写非定常 Bernoulli：
\\[
\\frac{p}{\\rho}+gz+\\frac{u^2}{2}+\\frac{\\partial\\phi}{\\partial t}=C(t).
\\]
由于截面均匀且不可压，任一时刻管内轴向速度 \\(u(t)\\) 在同一液柱内相同，速度势可取 \\(\\phi=u(t)s\\)，故 \\(\\partial\\phi/\\partial t=\\dot u(t)s\\)。在开口 \\(B\\) 处取表压 \\(p_B=0\\)，即可得
\\[
\\frac{p(s,t)}{\\rho}=g[z_B-z(s)]+\\dot u(t)[s_B-s]
\\]
在 \\(t=0^+\\) 时令 \\(u=0\\)，压强分布只由重力项和瞬时加速度项决定。加速度由整段液柱动量方程确定：外力为可用水头产生的压力差和重力分量，惯性为 \\(2h\\rho\\dot u\\)。打开后 \\(t>0\\)，仍用
\\[
\\frac{p}{\\rho}=C(t)-gz-\\frac{u^2}{2}-\\dot u s
\\]
并配合端点压强条件与整体动量方程求 \\(u(t)\\)。因此压强沿每一管段为关于弧长的线性分布，转折处压强连续；若题图的 \\(CA,AB\\) 相对高度不同，只需把 \\(z(s)\\) 按图代入。`,
    boundaryNote: '缺少图 5-2 的端点高度和开口压强细节时，给出可代入图形数据的非定常 Bernoulli 通式。'
  },
  '181103-material-extracted-0114': {
    diagnosis: '原答案给量纲但没有区分热量、热流率与传热系数定义，容易漏掉时间量纲。',
    answer: String.raw`球体对流体的热传输系数通常由总传热率定义：
\\[
\\dot Q=C_h A\\Delta T.
\\]
这里 \\(A\\) 是球表面积，\\(\\Delta T\\) 是物体与流体温差，\\(\\dot Q\\) 是单位时间传递的热量，不是单纯热量。热量的量纲为能量，\\([Q]=ML^2T^{-2}\\)，故热流率量纲为
\\[
[\\dot Q]=ML^2T^{-3}.
\\]
表面积量纲
\\[
[A]=L^2,
\\]
温差量纲记为
\\[
[\\Delta T]=\\Theta.
\\]
由定义式解出
\\[
[C_h]=\\frac{[\\dot Q]}{[A][\\Delta T]}
=\\frac{ML^2T^{-3}}{L^2\\Theta}=MT^{-3}\\Theta^{-1}.
\\]
在 SI 单位中就是
\\[
\\mathrm{W\\,m^{-2}\\,K^{-1}},
\\]
因为 \\(1\\mathrm{W}=1\\mathrm{kg\\,m^2s^{-3}}\\)。如果某教材把 \\(Q\\) 直接写成单位面积单位温差的热流密度，则它已经等于 \\(C_h\\Delta T\\)，但本题从 \\(Q/(A\\Delta T)\\) 推导时必须把 \\(Q\\) 理解为热流率。`,
    boundaryNote: '保留热量与热流率的定义边界，防止把 T^{-2} 与 T^{-3} 混淆。'
  },
  '181103-material-extracted-0043': {
    diagnosis: '原答案符号较跳跃，没有从源汇势函数叠加求速度和流函数，也没有解释流线常数。',
    answer: String.raw`取均匀来流沿 \\(+x\\) 方向，速度为 \\(U\\)。原点点汇强度记为 \\(Q>0\\)，则在平面极坐标中点汇径向速度为
\\[
v_r^{(s)}=-\\frac{Q}{2\\pi r}.
\\]
均匀流速度势和流函数为
\\[
\\phi_U=Ux=Ur\\cos\\theta,
\\qquad
\\psi_U=Uy=Ur\\sin\\theta.
\\]
点汇速度势和流函数可取
\\[
\\phi_s=-\\frac{Q}{2\\pi}\\ln r,
\\qquad
\\psi_s=-\\frac{Q}{2\\pi}\\theta.
\\]
叠加得
\\[
\\phi=Ux-\\frac{Q}{2\\pi}\\ln r,
\\qquad
\\psi=Uy-\\frac{Q}{2\\pi}\\theta.
\\]
速度分量由 \\(u=\\partial\\phi/\\partial x\\)、\\(v=\\partial\\phi/\\partial y\\) 得
\\[
u=U-\\frac{Q}{2\\pi}\\frac{x}{x^2+y^2},
\\qquad
v=-\\frac{Q}{2\\pi}\\frac{y}{x^2+y^2}.
\\]
在 \\((1,1)\\) 处，\\(x^2+y^2=2\\)，故
\\[
u(1,1)=U-\\frac{Q}{4\\pi},
\\qquad
v(1,1)=-\\frac{Q}{4\\pi}.
\\]
流线为 \\(\\psi=C\\)，即
\\[
Uy-\\frac{Q}{2\\pi}\\arctan\\frac{y}{x}=C.
\\]
若教材将点汇强度带负号记入 \\(Q\\)，上述 \\(Q\\) 的符号需同步反向。`,
    boundaryNote: '采用 Q>0 表示吸入强度；不同教材的源汇符号约定可能相反。'
  },
  '181103-material-extracted-0485': {
    diagnosis: '原答案只有公式框架，没有完成流量、最高点压强和失效高度数值。',
    answer: String.raw`忽略损失并取上下游自由面与出口均为大气压。出口低于上游水面 \\(h=6\\mathrm{m}\\)，由 Bernoulli 方程
\\[
\\frac{p_0}{\\rho g}+0+0=\\frac{p_0}{\\rho g}-h+\\frac{V^2}{2g}
\\]
得
\\[
V=\\sqrt{2gh}=\\sqrt{2\\times9.81\\times6}=10.85\\mathrm{m/s}.
\\]
管径 \\(d=0.15\\mathrm{m}\\)，截面积
\\[
A=\\frac{\\pi d^2}{4}=1.767\\times10^{-2}\\mathrm{m^2}.
\\]
因此流量
\\[
Q=AV=0.1917\\mathrm{m^3/s}.
\\]
最高点 \\(s\\) 高出上游水面 \\(y=2\\mathrm{m}\\)，管内速度仍为 \\(V\\)。在上游自由面和 \\(s\\) 点列 Bernoulli：
\\[
\\frac{p_0}{\\rho g}=\\frac{p_s}{\\rho g}+y+\\frac{V^2}{2g}.
\\]
所以
\\[
p_s=p_0-\\rho g(y+h)=p_0-\\rho g(8).
\\]
若取 \\(p_0=101.3\\mathrm{kPa}\\)，水的 \\(\\rho=1000\\mathrm{kg/m^3}\\)，则 \\(p_s\\approx22.8\\mathrm{kPa}\\) 绝对压强。虹吸不能维持时最高点压强降到汽化压或近似降到零绝对压强。忽略汽化压时
\\[
y_{max}=\\frac{p_0}{\\rho g}-h\\approx10.33-6=4.33\\mathrm{m}.
\\]
计入水汽压时该值还要略小。`,
    boundaryNote: '数值按无损虹吸和标准大气压计算；真实失效高度应扣除汽化压和沿程/局部损失。'
  },
  '181103-material-extracted-0433': {
    diagnosis: '原答案结论正确但过短，没有展示不可压条件、积分常数和边界条件如何决定。',
    answer: String.raw`平面不可压流动的连续方程为
\\[
\\frac{\\partial u}{\\partial x}+\\frac{\\partial v}{\\partial y}=0.
\\]
题给
\\[
u=ax^2+by.
\\]
先对 \\(x\\) 求偏导：
\\[
\\frac{\\partial u}{\\partial x}=2ax.
\\]
代入连续方程得
\\[
2ax+\\frac{\\partial v}{\\partial y}=0,
\\qquad
\\frac{\\partial v}{\\partial y}=-2ax.
\\]
对 \\(y\\) 积分时，\\(x\\) 视为常数，因此
\\[
v=-2axy+f(x).
\\]
这里 \\(f(x)\\) 是关于 \\(x\\) 的积分函数，不是常数。再用边界条件 \\(y=0\\) 时 \\(v=0\\)：
\\[
0=-2ax\\cdot0+f(x),
\\]
所以 \\(f(x)=0\\)。最终
\\[
v=-2axy.
\\]
可以回代验证：\\(\\partial v/\\partial y=-2ax\\)，与 \\(\\partial u/\\partial x=2ax\\) 相加为零，故满足不可压连续方程。题中 \\(by\\) 对 \\(x\\) 的偏导为零，所以不会进入 \\(v\\) 的表达式。`,
    boundaryNote: '补全积分函数而非只写最终式，适合学生检查偏导方向。'
  },
  '181103-material-extracted-0141': {
    diagnosis: '原答案只把 Stokes 公式嵌入量纲式，缺少完整 Π 定理构造和小 Re 极限说明。',
    answer: String.raw`设阻力 \\(F\\) 与球直径 \\(d\\)、速度 \\(U\\)、流体密度 \\(\\rho\\)、动力黏度 \\(\\mu\\) 有关。量纲为
\\[
[F]=MLT^{-2},\\quad [d]=L,\\quad [U]=LT^{-1},\\quad [\\rho]=ML^{-3},\\quad [\\mu]=ML^{-1}T^{-1}.
\\]
5 个变量、3 个基本量纲，故有 2 个无量纲组。取 \\(\\mu,U,d\\) 为重复变量，令
\\[
\\Pi_1=F\\mu^aU^bd^c.
\\]
比较指数得 \\(1+a=0\\)、\\(1-a+b+c=0\\)、\\(-2-a-b=0\\)，所以
\\[
\\Pi_1=\\frac{F}{\\mu Ud}.
\\]
密度组成的组为
\\[
\\Pi_2=\\frac{\\rho Ud}{\\mu}=Re.
\\]
于是
\\[
\\frac{F}{\\mu Ud}=\\Phi(Re),
\\qquad
F=\\mu Ud\\,\\Phi(Re).
\\]
Stokes 阻力适用于 \\(Re\\ll1\\)。若球半径为 \\(a\\)，则 \\(d=2a\\)，Stokes 公式
\\[
F=6\\pi\\mu Ua=3\\pi\\mu Ud.
\\]
这正是量纲表达在小 Reynolds 数极限下 \\(\\Phi(Re)\\to3\\pi\\) 的特例。因此 Stokes 公式不仅量纲一致，而且给出了量纲分析无法确定的常数。`,
    boundaryNote: '证明量纲形式并说明 Stokes 常数来自方程解，不由量纲分析单独决定。'
  },
  '181103-material-extracted-0195': {
    diagnosis: '原答案一句话跳到 Maxwell 关系，缺少热力学势函数选择和混合偏导条件。',
    answer: String.raw`对简单可压缩系统，单位质量内能满足
\\[
du=Tds-pdv.
\\]
定义单位质量焓
\\[
h=u+pv.
\\]
求全微分：
\\[
dh=du+p\\,dv+v\\,dp.
\\]
把 \\(du=Tds-pdv\\) 代入，得到
\\[
dh=Tds+vdp.
\\]
因此若把焓看作状态函数 \\(h=h(s,p)\\)，则它的全微分也可写为
\\[
dh=\\left(\\frac{\\partial h}{\\partial s}\\right)_p ds+
\\left(\\frac{\\partial h}{\\partial p}\\right)_s dp.
\\]
比较两个全微分的系数，有
\\[
\\left(\\frac{\\partial h}{\\partial s}\\right)_p=T,
\\qquad
\\left(\\frac{\\partial h}{\\partial p}\\right)_s=v.
\\]
只要状态函数二阶偏导连续，就有混合偏导相等：
\\[
\\frac{\\partial}{\\partial p}\left(\\frac{\\partial h}{\\partial s}\\right)_p
=
\\frac{\\partial}{\\partial s}\left(\\frac{\\partial h}{\\partial p}\\right)_s.
\\]
于是
\\[
\\left(\\frac{\\partial T}{\\partial p}\\right)_s=
\\left(\\frac{\\partial v}{\\partial s}\\right)_p.
\\]
这就是由焓势函数导出的 Maxwell 型关系，等熵和等压的下标来自对应偏导的保持变量。`,
    boundaryNote: '证明依赖 h(s,p) 为良态状态函数；相变间断点处不能直接使用混合偏导交换。'
  },
  '181103-material-extracted-0220': {
    diagnosis: '原答案只有量级结论，没有把雷诺应力与耗散的速度尺度、长度尺度分开说明。',
    answer: String.raw`把瞬时速度分解为平均值和脉动：
\\[
u_i=\\overline u_i+u_i'.
\\]
Reynolds 平均后的动量方程中出现雷诺应力
\\[
-\\rho\\overline{u_i'u_j'}.
\\]
若某类脉动速度尺度为 \\(V'\\)，则雷诺应力量级为
\\[
\\tau_R\\sim\\rho V'^2.
\\]
分子黏性应力量级可写为
\\[
\\tau_\\mu\\sim\\mu\\frac{V}{L}.
\\]
二者之比约为
\\[
\\frac{\\tau_R}{\\tau_\\mu}\\sim\\frac{\\rho V'^2}{\\mu V/L}=Re\\left(\\frac{V'}{V}\\right)^2.
\\]
所以速度尺度越大的脉动，对平均动量输运贡献的雷诺应力通常越大。另一方面，湍动能耗散率由小尺度速度梯度控制：
\\[
\\varepsilon\\sim\\nu\\overline{\\left(\\frac{\\partial u_i'}\\partial x_j\\right)^2}.
\\]
若某一涡团速度尺度为 \\(V'\\)、长度尺度为 \\(L'\\)，则耗散量级为
\\[
\\varepsilon'\\sim\\nu\\left(\\frac{V'}{L'}\\right)^2.
\\]
大尺度脉动虽然可能 \\(V'\\) 大，但 \\(L'\\) 也大，速度梯度 \\(V'/L'\\) 较小，因此直接黏性耗散不强。湍流能量通常先由大尺度产生和输运，再经能量级串传到小尺度，在小尺度因梯度大而耗散。`,
    boundaryNote: '这是尺度分析说明；不同湍流模型中常数和谱分布需由实验或闭合模型确定。'
  },
  '181103-material-extracted-0442': {
    diagnosis: '原答案直接写曲面连续方程，没有从圆柱面面积元和质量守恒推导。',
    answer: String.raw`设流体质点被约束在半径为 \\(R\\) 的共轴圆柱面上运动，曲面坐标取 \\(\\theta,z\\)。若周向角速度为 \\(\\omega=d\\theta/dt\\)，轴向速度为 \\(w=dz/dt\\)，则沿周向的实际线速度为 \\(R\\omega\\)。圆柱面上一小块面积为
\\[
dS=R\\,d\\theta\\,dz.
\\]
对固定曲面微元列质量守恒：微元内质量变化率加上周向、轴向净流出为零。质量为
\\[
\\rho R\\,d\\theta\\,dz.
\\]
周向两侧净流出为
\\[
\\frac{\\partial(\\rho\\omega)}{\\partial\\theta}R\\,d\\theta\\,dz,
\\]
轴向净流出为
\\[
\\frac{\\partial(\\rho w)}{\\partial z}R\\,d\\theta\\,dz.
\\]
除以共同面积因子 \\(R\\,d\\theta\\,dz\\)，得曲面连续方程
\\[
\\frac{\\partial\\rho}{\\partial t}
+\\frac{\\partial(\\rho\\omega)}{\\partial\\theta}
+\\frac{\\partial(\\rho w)}{\\partial z}=0.
\\]
若改用周向线速度 \\(v_\\theta=R\\omega\\)，则等价写为
\\[
\\frac{\\partial\\rho}{\\partial t}
+\\frac1R\\frac{\\partial(\\rho v_\\theta)}{\\partial\\theta}
+\\frac{\\partial(\\rho w)}{\\partial z}=0.
\\]
不可压时 \\(\\rho\\) 为常数，上式表示圆柱面上面积通量守恒。`,
    boundaryNote: '半径 R 为常数时可约去；若在不同半径圆柱面间运动，应回到完整柱坐标连续方程。'
  },
  '181103-material-extracted-0219': {
    diagnosis: '原答案联立两式过快，没有证明圆管剪应力线性分布和混合长式的来源。',
    answer: String.raw`圆管半径为 \\(R\\)，离壁距离为 \\(y\\)，则到管轴的半径位置为 \\(r=R-y\\)。定常充分发展管流中，取半径 \\(r\\)、长度 \\(L\\) 的圆柱流体作轴向力平衡：
\\[
\\Delta p\\,\\pi r^2=\\tau(r)\\,2\\pi rL.
\\]
所以
\\[
\\tau(r)=\\frac{\\Delta p}{2L}r.
\\]
壁面 \\(r=R\\) 处
\\[
\\tau_0=\\frac{\\Delta p}{2L}R.
\\]
相除得
\\[
\\frac{\\tau(r)}{\\tau_0}=\\frac rR=1-\\frac yR.
\\]
Prandtl 混合长理论把湍流剪应力写为
\\[
\\tau=\\rho l^2\\left(\\frac{d\\overline u}{dy}\\right)^2,
\\]
其中 \\(d\\overline u/dy\\) 是离壁法向速度梯度。由此解出
\\[
l=\\frac{\\sqrt{\\tau/\\rho}}{d\\overline u/dy}.
\\]
再把剪应力线性分布代入：
\\[
l=\\frac{\\sqrt{\\tau_0(1-y/R)/\\rho}}{d\\overline u/dy}
=\\frac{\\sqrt{\\tau_0/\\rho}}{d\\overline u/dy}\\sqrt{1-\\frac yR}.
\\]
这正是题中所要求的表达式。该证明默认平均流充分发展、剪应力方向与速度梯度符号已用大小表示。`,
    boundaryNote: '公式按剪应力大小写出；若保留符号，需同步规定 y 方向和速度梯度方向。'
  },
  '181103-material-extracted-0150': {
    diagnosis: '原答案只说内部流线闭合和阻力较小，没有展示流函数形式、边界条件和阻力公式比较。',
    answer: String.raw`设球形流体滴半径为 \\(a\\)，外部黏度为 \\(\\mu_e\\)，内部黏度为 \\(\\mu_i\\)，远处相对速度为 \\(U\\)。轴对称 Stokes 流可用流函数描述：
\\[
u_r=\\frac1{r^2\\sin\\theta}\\frac{\\partial\\psi}{\\partial\\theta},
\\qquad
u_\\theta=-\\frac1{r\\sin\\theta}\\frac{\\partial\\psi}{\\partial r}.
\\]
利用上题已得的内外 Stokes 解，内部流函数可写成
\\[
\\psi_i=C r^2(a^2-r^2)\\sin^2\\theta
\\]
这一类形式，其中常数 \\(C\\) 由界面速度连续和切应力连续决定。流线由 \\(\\psi_i=C_0\\) 给出，所以
\\[
r^2(a^2-r^2)\\sin^2\\theta=\\text{常数}
\\]
表示滴内闭合循环流线。阻力比较用 Hadamard-Rybczynski 结果：
\\[
D_d=2\\pi\\mu_eaU\\frac{2\\mu_e+3\\mu_i}{\\mu_e+\\mu_i}.
\\]
固体小球 Stokes 阻力为
\\[
D_s=6\\pi\\mu_eaU.
\\]
二者比值为
\\[
\\frac{D_d}{D_s}=\\frac{2\\mu_e+3\\mu_i}{3(\\mu_e+\\mu_i)}.
\\]
当 \\(0\\le\\mu_i<\\infty\\) 时该比值小于 1；当 \\(\\mu_i\\to\\infty\\) 时界面近似无滑移，\\(D_d\\to D_s\\)。因此有限内黏度的流体滴阻力小于同半径固体小球。`,
    boundaryNote: '内部流函数常数依赖上一题完整 Stokes 解；本题保留用于确定流线形状和阻力比较的必要形式。'
  },
  '181103-material-extracted-0171': {
    diagnosis: '原答案给最终流函数但没有证明来流速度如何抵消点涡互诱导速度。',
    answer: String.raw`设 \\((h,0)\\) 处点涡强度为 \\(+\\Gamma\\)，\\((-h,0)\\) 处为 \\(-\\Gamma\\)。单个点涡在距其 \\(r\\) 处诱导速度大小为
\\[
\\frac{|\\Gamma|}{2\\pi r}.
\\]
两涡相距 \\(2h\\)，所以一个涡在另一个涡处诱导的速度大小为
\\[
U_i=\\frac{\\Gamma}{2\\pi(2h)}=\\frac{\\Gamma}{4\\pi h}.
\\]
为了使两个点涡停留不动，远处均匀来流必须大小为
\\[
U=\\frac{\\Gamma}{4\\pi h}
\\]
且方向与互诱导迁移方向相反。均匀流的流函数可写为 \\(\\psi_U=Uy\\)（若来流反向则取负号）。点涡流函数叠加为
\\[
\\psi_v=\\frac{\\Gamma}{2\\pi}\\ln r_+ -\\frac{\\Gamma}{2\\pi}\\ln r_-
=\\frac{\\Gamma}{4\\pi}\\ln\\frac{(x-h)^2+y^2}{(x+h)^2+y^2},
\\]
其中 \\(r_+^2=(x-h)^2+y^2\\)、\\(r_-^2=(x+h)^2+y^2\\)。故总流线方程为
\\[
\\psi=Uy+\\frac{\\Gamma}{4\\pi}\\ln\\frac{(x-h)^2+y^2}{(x+h)^2+y^2}=C.
\\]
若题图中正负涡位置或来流方向与这里相反，只需把 \\(Uy\\) 和对数项整体符号相应反向，流线族不变。`,
    boundaryNote: '符号按 +Γ 在 (h,0)、-Γ 在 (-h,0) 约定；题图若相反则同步换号。'
  },
  '181103-material-extracted-0462': {
    diagnosis: '原答案给 300 knot 但没有说明为什么摩阻相似必须令 Reynolds 数相等，以及结果为何不可行。',
    answer: String.raw`研究潜艇摩阻时，主导相似准则是 Reynolds 数相似，因为壁面摩擦与黏性边界层有关。Reynolds 数为
\\[
Re=\\frac{VL}{\\nu}
\\]
其中 \\(V\\) 为速度，\\(L\\) 为特征长度，\\(\\nu\\) 为运动黏度。若模型和原型都在水中，\\(\\nu_m=\\nu_p\\)，相似条件
\\[
Re_m=Re_p
\\]
给出
\\[
\\frac{V_mL_m}{\\nu}=\\frac{V_pL_p}{\\nu}.
\\]
模型比例为 \\(1:30\\)，即
\\[
L_m=\\frac{L_p}{30}.
\\]
代入得
\\[
V_m=V_p\\frac{L_p}{L_m}=30V_p.
\\]
实际潜艇速度 \\(V_p=10\\) knot，因此
\\[
V_m=300\\text{ knot}.
\\]
换成 SI 单位，\\(1\\text{ knot}=0.5144\\text{ m/s}\\)，故
\\[
V_m\\approx154\\text{ m/s}.
\\]
这远高于普通水槽可实现速度，也会引入空化、自由面和压缩性等新问题。因此该计算同时说明：若模型仍用水作为工作流体，单独严格满足摩阻 Reynolds 相似通常不现实，工程上常需用修正公式或改变介质黏度。`,
    boundaryNote: '本题只针对摩阻 Reynolds 相似；若研究波浪阻力则会采用 Froude 相似，速度缩放完全不同。'
  },
  '181103-material-extracted-0203': {
    diagnosis: '原答案只有结论，没有用三维平面波相位面、坐标截距速度和法向相速区别来证明。',
    answer: String.raw`三维平面波可写为
\\[
\\phi=A\\cos(\\mathbf K\\cdot\\mathbf x-\\sigma t),
\\qquad
\\mathbf K=(k_x,k_y,k_z).
\\]
等相位面满足
\\[
\\mathbf K\\cdot\\mathbf x-\\sigma t=C.
\\]
其法向方向为 \\(\\mathbf K\\)。若沿法向移动距离 \\(dn\\)，则 \\(\\mathbf K\\cdot d\\mathbf x=|\\mathbf K|dn\\)，保持相位不变给出
\\[
|\\mathbf K|\\frac{dn}{dt}-\\sigma=0,
\\]
所以真实法向相速为
\\[
c_n=\\frac{\\sigma}{|\\mathbf K|}.
\\]
但若只看相位面与 \\(x\\) 轴的交点，令 \\(y,z\\) 不变，则
\\[
k_x\\frac{dx}{dt}=\\sigma,
\\qquad c_x=\\frac{\\sigma}{k_x}.
\\]
同理有 \\(c_y=\\sigma/k_y\\)、\\(c_z=\\sigma/k_z\\)。这些 \\(c_x,c_y,c_z\\) 是相位面截线在坐标轴上的扫过速度，不是同一质点或同一波包速度的三个分量。若把它们按普通矢量合成，会得到
\\[
(c_x^2+c_y^2+c_z^2)^{1/2},
\\]
这一般不等于 \\(\\sigma/|\\mathbf K|\\)。正确的相速矢量应沿 \\(\\mathbf K\\) 方向写为
\\[
\\mathbf c_p=\\frac{\\sigma}{|\\mathbf K|^2}\\mathbf K,
\\]
其模才是 \\(\\sigma/|\\mathbf K|\\)。因此相速不满足把坐标截距速度当作分速度的通常矢量合成法。`,
    boundaryNote: '区分法向相速和坐标轴截距速度，避免把几何交点运动误当作物理速度分量。'
  },
  '181103-material-extracted-0439': {
    diagnosis: '原答案过短，没有从球壳质量守恒推出中心对称连续方程和不可压物理意义。',
    answer: String.raw`固定中心对称表示所有物理量只与半径 \\(r\\) 和时间 \\(t\\) 有关，速度只有径向分量
\\[
\\mathbf V=V_r(r,t)\\mathbf e_r.
\\]
取半径 \\(r\\) 到 \\(r+dr\\) 的薄球壳，体积为 \\(4\\pi r^2dr\\)。球壳内质量变化率为
\\[
\\frac{\\partial}{\\partial t}(\\rho 4\\pi r^2dr).
\\]
通过半径 \\(r\\) 球面的质量通量为 \\(4\\pi r^2\\rho V_r\\)，通过 \\(r+dr\\) 球面的通量为其在 \\(r\\) 方向的增量。质量守恒给出
\\[
\\frac{\\partial}{\\partial t}(\\rho 4\\pi r^2dr)+
\\frac{\\partial}{\\partial r}(4\\pi r^2\\rho V_r)dr=0.
\\]
除以 \\(4\\pi r^2dr\\)，得到
\\[
\\frac{\\partial\\rho}{\\partial t}+\\frac1{r^2}\\frac{\\partial}{\\partial r}(r^2\\rho V_r)=0.
\\]
若流体不可压，\\(\\rho\\) 为常数，化为
\\[
\\frac{\\partial}{\\partial r}(r^2V_r)=0,
\\qquad r^2V_r=f(t).
\\]
物理意义是任意同心球面上的体积流量
\\[
4\\pi r^2V_r=4\\pi f(t)
\\]
相同；流线向外扩散时面积按 \\(r^2\\) 增大，所以径向速度必须按 \\(1/r^2\\) 衰减。`,
    boundaryNote: '中心处若无源汇且速度有限，则不可压中心对称径向运动只能为零。'
  },
  '181103-material-extracted-0440': {
    diagnosis: '原答案直接给柱坐标式，没有说明“通过 OZ 轴的诸平面”意味着无周向速度和轴对称通量形式。',
    answer: String.raw`流体质点始终在通过 \\(OZ\\) 轴的平面内运动，说明没有穿出该子午面的周向运动，可取柱坐标速度
\\[
\\mathbf V=v_r(r,z,t)\\mathbf e_r+v_z(r,z,t)\\mathbf e_z,
\\qquad v_\\theta=0.
\\]
柱坐标中一般连续方程为
\\[
\\frac{\\partial\\rho}{\\partial t}
+\\frac1r\\frac{\\partial(r\\rho v_r)}{\\partial r}
+\\frac1r\\frac{\\partial(\\rho v_\\theta)}{\\partial\\theta}
+\\frac{\\partial(\\rho v_z)}{\\partial z}=0.
\\]
由于运动限制在子午面且对周向无独立输运，取 \\(v_\\theta=0\\)，并且变量不显含 \\(\\theta\\)，上式化为
\\[
\\frac{\\partial\\rho}{\\partial t}
+\\frac1r\\frac{\\partial(r\\rho v_r)}{\\partial r}
+\\frac{\\partial(\\rho v_z)}{\\partial z}=0.
\\]
也可从环形控制体推导：半径为 \\(r\\) 的环面面积随 \\(r\\) 成正比，因此径向质量通量必须写成 \\(r\\rho v_r\\) 的导数。若不可压，\\(\\rho\\) 为常数，得
\\[
\\frac1r\\frac{\\partial(rv_r)}{\\partial r}+\\frac{\\partial v_z}{\\partial z}=0.
\\]
这表示子午面运动中的体积通量守恒，其中 \\(1/r\\) 项来自绕轴旋转形成的环形面积变化。`,
    boundaryNote: '若题目并不要求轴对称，只能保留 θ 导数项；本答案按“通过 OZ 轴的诸平面”常见轴对称解释。'
  },
  '181103-material-extracted-0446': {
    diagnosis: '原答案只写积分常数，没有用原点速度条件把速度分布显式确定。',
    answer: String.raw`设直管内为一维运动，流体速度记为 \\(u(x,t)\\)。连续方程为
\\[
\\frac{\\partial\\rho}{\\partial t}+\\frac{\\partial(\\rho u)}{\\partial x}=0.
\\]
题给密度波
\\[
\\rho=\\rho_0\\Phi(vt-x).
\\]
令
\\[
\\xi=vt-x,
\\]
则
\\[
\\frac{\\partial\\rho}{\\partial t}=v\\rho_\\xi,
\\qquad
\\frac{\\partial(\\rho u)}{\\partial x}=-(\\rho u)_\\xi.
\\]
代入连续方程得
\\[
v\\rho_\\xi-(\\rho u)_\\xi=0.
\\]
对 \\(\\xi\\) 积分：
\\[
\\rho u-v\\rho=C_1,
\\qquad
\\rho(u-v)=C_1.
\\]
因此
\\[
u=v+\\frac{C_1}{\\rho_0\\Phi(vt-x)}.
\\]
若原点处质点速度为 \\(v_0\\)，并取该条件在 \\(x=0,t=0\\) 处给定，则
\\[
rho(0,0)=\\rho_0\\Phi(0),
\\qquad
C_1=\\rho_0\\Phi(0)(v_0-v).
\\]
于是速度分布为
\\[
u(x,t)=v+(v_0-v)\\frac{\\Phi(0)}{\\Phi(vt-x)}.
\\]
若题目给定的是任意原点时刻 \\(t=t_0\\)，只需把 \\(\\Phi(0)\\) 改为 \\(\\Phi(vt_0)\\)。该式说明密度较大的脉冲区中，相对波速 \\(u-v\\) 的大小按 \\(1/\\rho\\) 调整，以保持一维质量通量积分常数。`,
    boundaryNote: '原点速度条件的时刻若源页另有说明，应按该时刻修正常数。'
  },
  '181103-material-extracted-0445': {
    diagnosis: '原答案只有结论，没有解释圆锥面度量因子为什么产生 l^{-1}∂(lρu)/∂l。',
    answer: String.raw`设圆锥顶点在原点，轴线为 \\(z\\) 轴，半顶角为常数 \\(\\alpha\\)。在圆锥面上取母线距离 \\(l\\) 和周向角 \\(\\theta\\) 为坐标。距轴半径为
\\[
r=l\\sin\\alpha.
\\]
曲面小面积元为
\\[
dS=(dl)(r\\,d\\theta)=l\\sin\\alpha\\,dl\\,d\\theta.
\\]
设沿母线速度为 \\(u=dl/dt\\)，周向角速度为 \\(\\omega=d\\theta/dt\\)，则周向线速度为 \\(l\\sin\\alpha\\,\\omega\\)。对曲面微元列质量守恒：质量变化加上母线方向、周向方向净流出为零。因面积度量含 \\(l\\)，母线通量项必须写成
\\[
\\frac1l\\frac{\\partial(l\\rho u)}{\\partial l}.
\\]
周向方向若使用角速度 \\(\\omega\\)，常数 \\(l\\sin\\alpha\\) 在同一 \\(l\\) 截线上作为度量因子处理，得到
\\[
\\frac{\\partial(\\rho\\omega)}{\\partial\\theta}.
\\]
所以圆锥面连续方程为
\\[
\\frac{\\partial\\rho}{\\partial t}
+\\frac1l\\frac{\\partial(l\\rho u)}{\\partial l}
+\\frac{\\partial(\\rho\\omega)}{\\partial\\theta}=0.
\\]
若改用周向线速度 \\(v_\\theta=l\\sin\\alpha\\,\\omega\\)，等价形式为
\\[
\\frac{\\partial\\rho}{\\partial t}
+\\frac1l\\frac{\\partial(l\\rho u)}{\\partial l}
+\\frac1{l\\sin\\alpha}\\frac{\\partial(\\rho v_\\theta)}{\\partial\\theta}=0.
\\]
不可压时去掉 \\(\\rho\\)，表示圆锥面上的面积通量守恒。`,
    boundaryNote: '半顶角为常数才可把 sinα 作为常数约去；变形圆锥面需重写度量因子。'
  },
  '181103-material-extracted-0471': {
    diagnosis: '原答案把问题说成简谐形式但没有给出一维 Euler 方程、速度分布假设和压强积分式。',
    answer: String.raw`取管中点为原点，\\(x\\) 轴沿管长方向。设单位质量吸引力为
\\[
f_x=-\\lambda x,
\\]
其中 \\(\\lambda>0\\)。对水平细管内不可压一维运动，连续方程给出
\\[
\\frac{\\partial u}{\\partial x}=0,
\\]
所以同一时刻管内速度只随时间变，记为 \\(u(t)\\)。一维 Euler 方程为
\\[
\\frac{\\partial u}{\\partial t}+u\\frac{\\partial u}{\\partial x}
=-\\frac1\\rho\\frac{\\partial p}{\\partial x}+f_x.
\\]
因 \\(u_x=0\\)，化为
\\[
\\dot u=-\\frac1\\rho p_x-\\lambda x,
\\qquad
p_x=-\\rho(\\dot u+\\lambda x).
\\]
对 \\(x\\) 积分得
\\[
p(x,t)=-\\rho\\dot u\\,x-\\frac12\\rho\\lambda x^2+C(t).
\\]
若两自由端位于 \\(x=\\pm L\\) 且表压为零，则要求
\\[
p(L,t)=p(-L,t)=0.
\\]
这在完全对称且两端同时为自由表压时推出 \\(\\dot u=0\\)，压强为
\\[
p(x)=\\frac12\\rho\\lambda(L^2-x^2).
\\]
若题图实际表示一段液柱整体相对中点偏移 \\(X(t)\\)，则整体动量方程为
\\[
\\ddot X+\\lambda X=0,
\\]
速度 \\(u=\\dot X\\)，并把 \\(\\dot u=-\\lambda X\\) 代回上面的压强积分式。这样即可按源图端点条件得到速度和压强分布。`,
    boundaryNote: '题面图形/端点约束不足时给出两种常见解释；最终压强常数应由实际自由端或壁端条件确定。'
  },
  '181103-material-extracted-0429': {
    diagnosis: '原答案列公式但没有导出坐标尺度因子与流线/轨迹定义的区别。',
    answer: String.raw`流线是在同一时刻与速度矢量处处相切的曲线；轨迹是同一流体质点随时间走过的路径。平面极坐标中，位移微元为
\\[
d\\mathbf r=dr\\mathbf e_r+r\\,d\\theta\\mathbf e_\\theta,
\\]
速度为
\\[
\\mathbf V=v_r\\mathbf e_r+v_\\theta\\mathbf e_\\theta.
\\]
流线相切要求位移分量与速度分量成比例，故
\\[
\\frac{dr}{v_r}=\\frac{r\\,d\\theta}{v_\\theta}.
\\]
柱坐标中
\\[
d\\mathbf r=dr\\mathbf e_r+r\\,d\\theta\\mathbf e_\\theta+dz\\mathbf e_z,
\\]
所以流线方程为
\\[
\\frac{dr}{v_r}=\\frac{r\\,d\\theta}{v_\\theta}=\\frac{dz}{v_z}.
\\]
球坐标 \\((r,\\theta,\\phi)\\) 的位移尺度因子为 \\(1,r,r\\sin\\theta\\)，即
\\[
d\\mathbf r=dr\\mathbf e_r+r\\,d\\theta\\mathbf e_\\theta+r\\sin\\theta\\,d\\phi\\mathbf e_\\phi,
\\]
因此流线方程为
\\[
\\frac{dr}{v_r}=\\frac{r\\,d\\theta}{v_\\theta}=\\frac{r\\sin\\theta\\,d\\phi}{v_\\phi}.
\\]
轨迹方程则必须保留时间：极坐标为 \\(dr/dt=v_r,\\ r\\,d\\theta/dt=v_\\theta\\)；柱坐标再加 \\(dz/dt=v_z\\)；球坐标为
\\[
\\frac{dr}{dt}=v_r,
\\quad r\\frac{d\\theta}{dt}=v_\\theta,
\\quad r\\sin\\theta\\frac{d\\phi}{dt}=v_\\phi.
\\]
非定常流中流线和轨迹通常不同，只有定常流中才可能重合。`,
    boundaryNote: '球坐标角符号按常见 θ 为极角、φ 为方位角；若教材互换，尺度因子也要随符号互换。'
  }
};

function abs(rel) {
  return path.join(repoRoot, rel);
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(abs(rel), 'utf8'));
}

function writeText(rel, text) {
  const target = abs(rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text.endsWith('\n') ? text : `${text}\n`);
}

function writeJsonAndGzip(rel, payload) {
  const text = `${JSON.stringify(payload, null, 2)}\n`;
  writeText(rel, text);
  fs.writeFileSync(abs(`${rel}.gz`), zlib.gzipSync(text, { level: 9 }));
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sourceHtmlRel(row) {
  return String(row.sourceHtmlUrl || '').replace(/^\/+/, '').split('#')[0];
}

function updateHtmlAnswer(rel, id, answer) {
  const file = abs(rel);
  if (!rel || !fs.existsSync(file)) return { updated: false, reason: 'missing-html' };
  const html = fs.readFileSync(file, 'utf8');
  const articleRe = new RegExp(`(<article\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>[\\s\\S]*?<\\/article>)`, 'i');
  const articleMatch = html.match(articleRe);
  if (!articleMatch) return { updated: false, reason: 'missing-article' };
  const article = articleMatch[1];
  const bodyRe = /(<div\b(?=[^>]*\bdata-round388-reference-answer-body=["']1["'])[^>]*>)([\s\S]*?)(<\/div>)/i;
  if (!bodyRe.test(article)) return { updated: false, reason: 'missing-answer-body' };
  const nextArticle = article.replace(bodyRe, `$1${htmlEscape(answer)}$3`);
  fs.writeFileSync(file, html.replace(article, nextArticle));
  return { updated: true, reason: '' };
}

function proofScore(answer) {
  const text = String(answer || '');
  const chars = [...text].length;
  const sentenceCount = text.split(/[。；;.!！？?]/).map((part) => part.trim()).filter(Boolean).length;
  const formulaCount = (text.match(/\\\(|\\\[|\\frac|\\nabla|\\partial|=|积分|方程|边界|代入|微分|动量|连续|Bernoulli|Euler|Navier|Stokes|Reynolds|Cauchy|Buckingham|散度|旋度|涡度|无量纲|流函数|速度势|应力|量纲|法向|耗散|相似|通量|守恒|复势|力矩/g) || []).length;
  const proofSignalCount = (text.match(/先|再|于是|因此|故|代入|积分|微分|整理|联立|由|因为|所以|证明|即得|推出|边界|条件|设|令|可写|满足|利用|得到|表示|化为|移项|相减|相加|展开|合并|定义|代回|比较|取|应用|说明|得证|等价|必须|反过来|同理|验证|故有|注意|若|则|所以/g) || []).length;
  return { chars, sentenceCount, formulaCount, proofSignalCount };
}

function proofDepthPass(record) {
  const score = record.afterScore;
  return score.chars >= 360
    && score.sentenceCount >= 4
    && score.formulaCount >= 8
    && score.proofSignalCount >= 5
    && record.htmlUpdated === true;
}

function buildDoc(ledger) {
  return [
    '# Round537 181103 Proof Depth Upgrade',
    '',
    `Version: \`${ledger.version}\``,
    `Generated: \`${ledger.generatedAt}\``,
    `Overall: **${ledger.ok ? 'PASS' : 'FAIL'}**`,
    '',
    '## Scope',
    '',
    `- Upgraded rows: ${ledger.upgradedRows}`,
    `- Minimum answer length: ${ledger.minChars}`,
    `- Minimum sentence count: ${ledger.minSentenceCount}`,
    `- Minimum formula/dependency count: ${ledger.minFormulaCount}`,
    `- Minimum proof signal count: ${ledger.minProofSignalCount}`,
    `- Failed IDs: ${ledger.failedIds.length ? ledger.failedIds.join(', ') : 'none'}`,
    '- Boundary: this is the seventh proof/process/explanation-depth batch after Round531-Round536, not a claim that every proof-like row is closed.',
    '- QA rule: visible answer blocks that only say "use a theorem" or "same as above" are insufficient for proof questions.',
    '- Correction rule: a proof answer must show assumptions, governing equations or identities, transformations, boundary/regularity conditions where relevant, and a conclusion check.',
    '- Source-clue rule: display-only source cards may receive better reference answers without being counted as default practice questions.',
    '',
    '## Upgraded IDs',
    '',
    ledger.upgradedIds.map((id) => `- \`${id}\``).join('\n'),
    '',
    '## Records',
    '',
    '```json',
    JSON.stringify(ledger.records.map((record) => ({
      id: record.id,
      type: record.type,
      sourceMaterialTitle: record.sourceMaterialTitle,
      sourcePage: record.sourcePage,
      diagnosis: record.diagnosis,
      afterScore: record.afterScore,
      htmlUpdated: record.htmlUpdated,
      boundaryNote: record.boundaryNote
    })), null, 2),
    '```',
    ''
  ].join('\n');
}

function main() {
  const rows = readJson(bankRel);
  const byId = new Map(rows.map((row) => [row.id, row]));
  const records = [];
  for (const [id, payload] of Object.entries(upgrades)) {
    const row = byId.get(id);
    if (!row) throw new Error(`Missing row ${id}`);
    const answer = payload.answer;
    const before = String(row.answer || row.referenceAnswer || '').slice(0, 260);
    for (const key of ['answer', 'answerHtml', 'referenceAnswer', 'referenceAnswerHtml', 'ocrDraftAnswerText', 'ocrDraftAnswerHtml']) {
      if (Object.prototype.hasOwnProperty.call(row, key) || key.startsWith('reference') || key === 'answer' || key === 'answerHtml') {
        row[key] = answer;
      }
    }
    row.answerTrustState = 'reference-answer-ready';
    row.answerTrustLabel = '参考答案';
    row.answerReviewBoundary = 'proof-depth-upgraded';
    row.answerUiStatus = 'reference-answer-ready';
    row.round537ProofDepthUpgrade = true;
    row.round537ProofDepthUpgradeVersion = version;
    row.round537ProofDepthUpgradeAt = generatedAt;
    row.round537ProofDepthSource = 'six-agent-proof-depth-audit-plus-local-derivation';
    row.round537ProofDepthDiagnosis = payload.diagnosis;
    row.round537ProofDepthBoundaryNote = payload.boundaryNote;
    row.qualityFlags = Array.from(new Set([...(row.qualityFlags || []), 'round537-proof-depth-upgraded']));
    const htmlRel = sourceHtmlRel(row);
    const htmlResult = updateHtmlAnswer(htmlRel, id, answer);
    records.push({
      id,
      sourceHtmlUrl: row.sourceHtmlUrl,
      sourceMaterialTitle: row.sourceMaterialTitle,
      sourcePage: row.sourcePage,
      type: row.type,
      question: row.question,
      diagnosis: payload.diagnosis,
      before,
      boundaryNote: payload.boundaryNote,
      afterScore: proofScore(answer),
      htmlRel,
      htmlUpdated: htmlResult.updated,
      htmlUpdateReason: htmlResult.reason
    });
  }
  for (const record of records) record.proofDepthPass = proofDepthPass(record);
  writeJsonAndGzip(bankRel, rows);

  const ledger = {
    ok: records.every((record) => record.proofDepthPass),
    version,
    generatedAt,
    upgradedRows: records.length,
    upgradedIds: records.map((record) => record.id),
    minChars: Math.min(...records.map((record) => record.afterScore.chars)),
    minSentenceCount: Math.min(...records.map((record) => record.afterScore.sentenceCount)),
    minFormulaCount: Math.min(...records.map((record) => record.afterScore.formulaCount)),
    minProofSignalCount: Math.min(...records.map((record) => record.afterScore.proofSignalCount)),
    failedIds: records.filter((record) => !record.proofDepthPass).map((record) => record.id),
    records,
    studentAnswerBoundary: 'Round537 stores student-facing proof/process answers in the bank and keeps diagnosis/boundary notes in the QA ledger; these notes are not strict original-answer PDF proof.',
    remainingBoundary: 'Round537 seventh batch upgrades 30 proof/process/source-clue rows after Round531-Round536; remaining suspicious proof rows stay in the next-round queue and must not be claimed complete.',
    qualityBoundary: 'Round537 treats source-clue cards, conclusion-only proof answers, method-only answer blocks, and same-as-above references as insufficient whenever a student-facing answer block is visible.',
    correctnessBoundary: 'Round537 records sign conventions, missing source parameters, source-equation discrepancies, and dimensional-boundary notes instead of forcing false certainty.',
    strictAnswerPdfProofBoundary: 'strictAnswerPdfProof remains separate; Round537 does not claim original-answer-PDF span/bbox/hash proof.'
  };
  writeJsonAndGzip(ledgerRel, ledger);
  writeText(docRel, buildDoc(ledger));
  console.log(JSON.stringify(ledger, null, 2));
  if (!ledger.ok) process.exitCode = 1;
}

main();
