#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const version = 'round538-181103-proof-depth-upgrade-20260625';
const generatedAt = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round538 proof-depth upgrade from /Volumes/mac_2T during lifs isolation.');
}

const bankRel = 'question-banks/181103-material-extracted.json';
const ledgerRel = 'data/fluid-round538-181103-proof-depth-upgrade.json';
const docRel = 'docs/round538-181103-proof-depth-upgrade.md';

const upgrades = JSON.parse(String.raw`{
  "181103-material-extracted-0009": {
    "diagnosis": "当前答案只写了消参后的结论，没有把本小问承接的拉格朗日表示写出来，也没有说明如何由参数曲线消去时间、图形在哪个平面、双曲线分支和退化情形。",
    "answer": "本题承接 1.8 给出的拉格朗日表示：\\(x=ae^t,\\ y=be^{-t},\\ z=c\\)，其中 \\(a,b,c\\) 是同一流点的初始标号，沿该流点保持不变。因此某一流点的轨迹参数式为\n\\[\nx(t)=ae^t,\\qquad y(t)=be^{-t},\\qquad z(t)=c.\n\\]\n由前两式得\n\\[\n\\frac{x}{a}=e^t,\\qquad \\frac{y}{b}=e^{-t}.\n\\]\n相乘即可消去时间参数：\n\\[\n\\frac{x}{a}\\frac{y}{b}=1,\n\\qquad xy=ab.\n\\]\n第三式直接给出 \\(z=c\\)。所以轨迹位于平面 \\(z=c\\) 内，是矩形双曲线 \\(xy=ab\\)。若 \\(ab>0\\)，分支在第一、第三象限；若 \\(ab<0\\)，分支在第二、第四象限；若 \\(a=0\\) 或 \\(b=0\\)，轨迹退化为相应坐标轴上的直线。作图时固定不同的 \\(ab\\) 和 \\(c\\)，在各 \\(z=c\\) 平面内画出以坐标轴为渐近线的双曲线族即可。",
    "boundaryNote": "推导依据站内 HTML 同题 1.8 的上文条件；若该卡片脱离上文单独展示，应在答案中补明拉格朗日表示。"
  },
  "181103-material-extracted-0086": {
    "diagnosis": "当前答案给出托里拆利公式，但没有明确伯努利两点、压强、高程、速度近似条件，也没有说明 H 为什么在速度结果中抵消。",
    "answer": "设自由水面为点 1，小孔出口为点 2。水箱顶端开口，故两点均与大气相通，表压可取\n\\[\np_1=p_2=0.\n\\]\n若水箱截面积远大于小孔面积，则自由水面下降速度可忽略，取 \\(V_1\\approx0\\)。以地面为高程零点，水面高程为 \\(z_1=H\\)，小孔离水面深度为 \\(h\\)，故小孔高程为 \\(z_2=H-h\\)。沿自由水面到小孔出口列伯努利方程：\n\\[\n\\frac{p_1}{\\rho g}+\\frac{V_1^2}{2g}+z_1\n=\n\\frac{p_2}{\\rho g}+\\frac{V_2^2}{2g}+z_2.\n\\]\n代入上述条件得\n\\[\n0+0+H=0+\\frac{V_2^2}{2g}+(H-h),\n\\]\n所以\n\\[\n\\frac{V_2^2}{2g}=h,\n\\qquad V_2=\\sqrt{2gh}.\n\\]\n可见本小问的流速只由孔口在水面下的深度 \\(h\\) 决定，\\(H\\) 在求速度时抵消；\\(H\\) 会在后续求射程时通过孔口离地高度 \\(H-h\\) 起作用。",
    "boundaryNote": "按理想、无损、准定常、大水箱近似处理；实际孔口若考虑收缩和损失，应乘速度系数或流量系数。"
  },
  "181103-material-extracted-0491": {
    "diagnosis": "当前答案只写“对应流函数”而未说明复势定义、复对数的实部虚部、分支多值性和常数差异。",
    "answer": "按常用约定取复势 \\(W(z)=\\phi+i\\psi\\)，其中实部为速度势。令\n\\[\nz=re^{i\\theta},\n\\]\n则复对数在选定分支上满足\n\\[\n\\Log z=\\ln r+i\\theta.\n\\]\n已知\n\\[\n\\phi=\\frac{m}{2\\pi}\\ln r.\n\\]\n为了使复势实部等于该速度势，可取\n\\[\nW(z)=\\frac{m}{2\\pi}\\Log z+C,\n\\]\n其中 \\(C\\) 为任意复常数。此时\n\\[\n\\operatorname{Re}W=\\frac{m}{2\\pi}\\ln r,\n\\qquad\n\\psi=\\frac{m}{2\\pi}\\theta+\\operatorname{Im}C.\n\\]\n因此该流动是原点处强度为 \\(m\\) 的二维点源流，其复势可写为\n\\[\n\\boxed{W(z)=\\frac{m}{2\\pi}\\Log z+C}.\n\\]\n若只关心速度场，常数 \\(C\\) 不影响结果。",
    "boundaryNote": "复对数需选定分支；绕原点一周流函数会相差 m。若教材采用 W=phi-i psi 等相反号约定，虚部符号可相应改变。"
  },
  "181103-material-extracted-0024": {
    "diagnosis": "当前答案只写结论，没有展示从拉格朗日表示求速度、改写欧拉速度场、再计算旋度和散度的过程。",
    "answer": "给定\n\\[\nx=ae^{-2t/k},\\quad y=b(1+t/k)^2,\\quad z=ce^{2t/k}(1+t/k)^{-2},\n\\]\n其中 \\(a,b,c\\) 为流点标号，\\(k\\ne0\\)，并要求 \\(t\\ne-k\\)。先对时间求导：\n\\[\nu=\\frac{dx}{dt}=-\\frac{2}{k}ae^{-2t/k}=-\\frac{2x}{k},\n\\]\n\\[\nv=\\frac{dy}{dt}=\\frac{2b}{k}(1+t/k)=\\frac{2y}{k+t},\n\\]\n\\[\nw=\\frac{dz}{dt}=z\\left(\\frac2k-\\frac{2}{k+t}\\right)=\\frac{2tz}{k(k+t)}.\n\\]\n所以欧拉速度场为\n\\[\n\\mathbf V=\\left(-\\frac{2x}{k},\\frac{2y}{k+t},\\frac{2tz}{k(k+t)}\\right).\n\\]\n第一，速度分量在固定空间点处仍显含 \\(t\\)，故流动为非定常流。第二，\\(u\\) 只含 \\(x\\)，\\(v\\) 只含 \\(y,t\\)，\\(w\\) 只含 \\(z,t\\)，交叉空间偏导均为零，因此\n\\[\n\\nabla\\times\\mathbf V=\\mathbf0,\n\\]\n流动无旋。第三，散度为\n\\[\n\\nabla\\cdot\\mathbf V\n=\\frac{\\partial u}{\\partial x}+\\frac{\\partial v}{\\partial y}+\\frac{\\partial w}{\\partial z}\n=-\\frac2k+\\frac{2}{k+t}+\\frac{2t}{k(k+t)}.\n\\]\n通分得\n\\[\n\\frac{-2(k+t)+2k+2t}{k(k+t)}=0,\n\\]\n故满足不可压条件。也可由变换 Jacobian\n\\[\nJ=e^{-2t/k}(1+t/k)^2e^{2t/k}(1+t/k)^{-2}=1\n\\]\n看出体积不变。综上：该流场非定常、无旋、不可压。",
    "boundaryNote": "推导默认在 k 不为 0 且 t 不为 -k 的定义域内进行；旋度和散度按固定 t 的欧拉空间偏导计算。"
  },
  "181103-material-extracted-0038": {
    "diagnosis": "当前答案概括了复势和解析函数，但没有把不可压和无旋分别转化为连续方程、旋度方程，再推出 Cauchy-Riemann 条件。",
    "answer": "设平面速度场为 \\(u(x,y),v(x,y)\\)。不可压条件给出连续方程\n\\[\n\\frac{\\partial u}{\\partial x}+\\frac{\\partial v}{\\partial y}=0.\n\\]\n因此在适当区域内可引入流函数 \\(\\psi\\)，使\n\\[\nu=\\frac{\\partial\\psi}{\\partial y},\n\\qquad\nv=-\\frac{\\partial\\psi}{\\partial x}.\n\\]\n无旋条件为\n\\[\n\\frac{\\partial v}{\\partial x}-\\frac{\\partial u}{\\partial y}=0.\n\\]\n因此可引入速度势 \\(\\varphi\\)，使\n\\[\nu=\\frac{\\partial\\varphi}{\\partial x},\n\\qquad\nv=\\frac{\\partial\\varphi}{\\partial y}.\n\\]\n把两组关系合并，得到\n\\[\n\\frac{\\partial\\varphi}{\\partial x}=\\frac{\\partial\\psi}{\\partial y},\n\\qquad\n\\frac{\\partial\\varphi}{\\partial y}=-\\frac{\\partial\\psi}{\\partial x}.\n\\]\n这正是 \\(F(z)=\\varphi+i\\psi\\) 成为解析函数的 Cauchy-Riemann 条件。因此平面不可压无旋流动可用解析函数 \\(F(z)\\) 描述，且按此约定\n\\[\n\\frac{dF}{dz}=u-iv.\n\\]\n反过来，解析函数的实部和虚部均为调和函数，自动满足势流的连续条件和无旋条件。于是可用复变函数中的解析函数、奇点叠加、保角变换等方法处理这类平面势流问题。",
    "boundaryNote": "严格地说，速度势或单值流函数的全局存在还受区域连通性、环量和奇点影响；不同复势符号约定会改变复速度符号。"
  },
  "181103-material-extracted-0018": {
    "diagnosis": "原答案判断方向正确，但没有用坐标变换说明实验室系非定常、圆柱随体系可定常。",
    "answer": "设圆柱以恒定速度 \\(\\mathbf U\\) 平移，实验室固定坐标为 \\(\\mathbf x\\)，随圆柱平移的坐标为\n\\[\n\\mathbf x'=\\mathbf x-\\mathbf U t.\n\\]\n若在圆柱坐标系中绕流场达到相对稳定，速度相对场可写成 \\(\\mathbf u'=\\mathbf u'(\\mathbf x')\\)，圆柱边界也是固定曲面。换回实验室系时，速度场一般写成\n\\[\n\\mathbf u(\\mathbf x,t)=\\mathbf U+\\mathbf u'(\\mathbf x-\\mathbf U t).\n\\]\n于是固定空间点处的时间变化为\n\\[\n\\frac{\\partial\\mathbf u}{\\partial t}=-(\\mathbf U\\cdot\\nabla')\\mathbf u'(\\mathbf x').\n\\]\n只要绕流场在空间中不是处处均匀，这一项就不为零。因此，在地面固定坐标系中，圆柱位置和绕流边界随时间移动，流型不是定常。若采用随圆柱一起匀速平移的坐标系，则圆柱边界固定，远处静水等效为速度 \\(-\\mathbf U\\) 的均匀来流，边界条件不显含时间；在忽略启动瞬变、只讨论匀速相对绕流时，可把流型看作定常。结论是：定常性不是绝对说法，而取决于参考系；实验室系非定常，圆柱随体系可定常。",
    "boundaryNote": "若题意包含刚由静止开始启动的瞬变阶段，则启动阶段仍应列为非定常。"
  },
  "181103-material-extracted-0419": {
    "diagnosis": "原答案只给对流加速度名称，缺少质点加速度与定常条件的公式链条。",
    "answer": "流体质点可以具有加速度。流体质点的加速度不是单纯的局部时间导数，而是速度场沿质点轨迹的物质导数。若速度场为 \\(\\mathbf V(x,y,z,t)\\)，质点位置满足 \\(d\\mathbf x/dt=\\mathbf V\\)，则由链式法则得\n\\[\n\\mathbf a=\\frac{D\\mathbf V}{Dt}\n=\\frac{\\partial\\mathbf V}{\\partial t}\n+\\frac{dx}{dt}\\frac{\\partial\\mathbf V}{\\partial x}\n+\\frac{dy}{dt}\\frac{\\partial\\mathbf V}{\\partial y}\n+\\frac{dz}{dt}\\frac{\\partial\\mathbf V}{\\partial z}.\n\\]\n代入 \\(d\\mathbf x/dt=\\mathbf V\\)，有\n\\[\n\\mathbf a=\\frac{\\partial\\mathbf V}{\\partial t}+(\\mathbf V\\cdot\\nabla)\\mathbf V.\n\\]\n定常流场只表示在固定空间点处速度不随时间变，即 \\(\\partial\\mathbf V/\\partial t=0\\)，但这并不要求空间各点速度相同。因此定常流中仍有\n\\[\n\\mathbf a=(\\mathbf V\\cdot\\nabla)\\mathbf V.\n\\]\n若流线弯曲，即使速率大小不变，也有法向加速度 \\(V^2/R\\)；若沿流线速度大小变化，还会有切向加速度 \\(VdV/ds\\)。例如一维定常场 \\(u=\\alpha x, v=w=0\\) 中，\\(\\partial u/\\partial t=0\\)，但\n\\[\n\\frac{Du}{Dt}=u\\frac{\\partial u}{\\partial x}=\\alpha x\\cdot\\alpha=\\alpha^2x,\n\\]\n一般不为零。所以定常流场内运动的流体质点完全可能有加速度。",
    "boundaryNote": "本题边界是“定常不等于无加速度”；只有速度沿质点运动方向无空间变化且流线不弯曲时，加速度才可能为零。"
  },
  "181103-material-extracted-0158": {
    "diagnosis": "原答案方向正确，但需要把 Kelvin 定理、初始涡量、局部无旋和全局环流的差别展开。",
    "answer": "理想不可压流体在有势力作用下，若质量力可写成 \\(-\\nabla\\Phi\\)，且无粘性力，则满足 Kelvin 环流定理：对随流体一起运动的任意闭合曲线 \\(C(t)\\)，\n\\[\n\\Gamma=\\oint_{C(t)}\\mathbf u\\cdot d\\mathbf l\n\\]\n保持不变，即 \\(d\\Gamma/dt=0\\)。等价地，在无粘、无非保守体力的条件下，原来有涡的流体质点不会自动变成无涡，原来无涡的单连通区域也不会凭空产生涡量。\n\n(1) 无穷远处切变流可写成 \\(u=U(y),\\ v=0\\)。其涡量为\n\\[\n\\omega_z=\\frac{\\partial v}{\\partial x}-\\frac{\\partial u}{\\partial y}=-\\frac{dU}{dy}.\n\\]\n只要 \\(dU/dy\\ne0\\)，来流本身就是有旋流。静止物体在理想流体中不能通过粘性扩散把已有涡量消除，故绕物体后的运动仍应判为有旋。\n\n(2) 无穷远均匀来流可写成 \\(u=U_0,\\ v=0\\)，其涡量 \\(\\omega=0\\)。若流体为理想流体，圆柱表面允许切向滑移，旋转圆柱不会像真实粘性流体那样通过无滑移边界层向外生成涡量。因此从无穷远均匀无旋来流出发，流体区域内仍可保持无旋。若人为给圆柱绕流叠加环流 \\(\\Gamma\\)，速度中可有势涡项 \\(v_\\theta=\\Gamma/(2\\pi r)\\)，在圆柱外部流体区域局部仍有 \\(\\nabla\\times\\mathbf u=0\\)，只是绕圆柱的闭合曲线有非零环流，属于多连通区域的全局环流问题。故本题按理想流体判断：(1) 有旋；(2) 无旋。",
    "boundaryNote": "结论严格依赖理想不可压、有势力假设；真实粘性流体中的旋转圆柱会因无滑移边界和边界层产生涡量。"
  },
  "181103-material-extracted-0163": {
    "diagnosis": "原答案引用点涡扩散速度式，但没有展示粘性如何通过涡量扩散改变有限半径内环流。",
    "answer": "题 3.12 给出的典型结果是：半径可近似为零的旋转圆柱突然停止后，原先集中的环流 \\(\\Gamma_0\\) 不会以理想点涡形式保持在中心，而是在粘性作用下向外扩散，速度场可写成\n\\[\nv_\\theta(r,t)=\\frac{\\Gamma_0}{2\\pi r}\\left[1-\\exp\\left(-\\frac{r^2}{4\\nu t}\\right)\\right].\n\\]\n由此可直接计算半径 \\(r\\) 的圆周上的环流：\n\\[\n\\Gamma(r,t)=\\oint \\mathbf v\\cdot d\\mathbf l=2\\pi r v_\\theta\n=\\Gamma_0\\left[1-\\exp\\left(-\\frac{r^2}{4\\nu t}\\right)\\right].\n\\]\n这说明对固定有限半径 \\(r\\) 而言，环流随时间 \\(t\\) 改变。\\(t\\) 增大时，\\(r^2/(4\\nu t)\\) 变小，指数项变大，故 \\(\\Gamma(r,t)\\) 减小，表示原来集中在小半径内的环流向更外层扩散。再由圆柱坐标中涡量公式\n\\[\n\\omega_z=\\frac1r\\frac{\\partial(rv_\\theta)}{\\partial r}\n\\]\n可得\n\\[\n\\omega_z=\\frac{\\Gamma_0}{4\\pi\\nu t}\\exp\\left(-\\frac{r^2}{4\\nu t}\\right).\n\\]\n该式表明涡量不是集中在 \\(r=0\\) 的奇异点涡，而是形成随时间扩宽的粘性涡核，扩散尺度约为 \\(\\sqrt{\\nu t}\\)。在 \\(r\\to0\\) 附近，\\(v_\\theta\\approx \\Gamma_0 r/(8\\pi\\nu t)\\)，中心速度有限；在 \\(r\\) 很大或 \\(t\\) 很小时，\\(v_\\theta\\approx\\Gamma_0/(2\\pi r)\\)，接近原来的点涡速度。由此可见，粘性项通过涡量扩散改变各个有限闭合曲线所围住的环流分布；若取包围全部涡量的无限大闭合曲线，且外边界无外加力矩或涡量通量，总环流仍可保持为 \\(\\Gamma_0\\)。",
    "boundaryNote": "按题 3.12 的无界粘性流体、轴对称点涡扩散模型展开；有限半径圆柱壁面细节需另列边界条件。"
  },
  "181103-material-extracted-0181": {
    "diagnosis": "原答案点表正确，但需要把 t=0、t=2 的相位代入、周期和位移关系写清楚，说明如何据点表画波形。",
    "answer": "波动方程为\n\\[\ny=2\\cos\\left(\\frac{\\pi}{3}x-\\frac{\\pi}{6}t\\right).\n\\]\n其振幅 \\(A=2\\)，波数 \\(k=\\pi/3\\)，角频率 \\(\\omega=\\pi/6\\)，波长\n\\[\n\\lambda=\\frac{2\\pi}{k}=6,\n\\]\n周期\n\\[\nT=\\frac{2\\pi}{\\omega}=12,\n\\]\n波速\n\\[\nc=\\frac{\\omega}{k}=\\frac12.\n\\]\n因为相位写成 \\(kx-\\omega t\\)，所以波沿 \\(x\\) 正方向传播。\\(t=0\\) 时，\n\\[\ny=2\\cos\\frac{\\pi x}{3}.\n\\]\n取一个波长内的整数点 \\(x=0,1,2,3,4,5,6\\)，逐点代入，得到\n\\[\n(0,2),(1,1),(2,-1),(3,-2),(4,-1),(5,1),(6,2).\n\\]\n\\(t=2\\) 秒时，\n\\[\ny=2\\cos\\left(\\frac{\\pi x}{3}-\\frac{\\pi}{3}\\right)\n=2\\cos\\frac{\\pi(x-1)}{3}.\n\\]\n这正是 \\(t=0\\) 的波形向右平移\n\\[\nct=\\frac12\\times2=1\n\\]\n个长度单位。仍取 \\(x=0,1,2,3,4,5,6\\)，得到\n\\[\n(0,1),(1,2),(2,1),(3,-1),(4,-2),(5,-1),(6,1).\n\\]\n作图时在同一坐标系中标出上述两组点，并用光滑余弦曲线连接；两条曲线形状相同，后一条相对于前一条向右平移 1。",
    "boundaryNote": "题库字段仍有低 OCR/章节待定标记；本次只补足波形推导，不新增来源页严格框选证明。"
  },
  "181103-material-extracted-0073": {
    "diagnosis": "现有结论正确，但证明深度不足；应补明静力平衡方向、重力随半径线性变化以及地表压力边界。",
    "answer": "设 \\(r\\) 为从地心向外的径向坐标，地球为静止、不可压缩、密度均匀的流体球。题设单位质量所受重力大小与 \\(r\\) 成正比，且地表 \\(r=R\\) 处为 \\(g\\)，故\n\\[\ng(r)=g\\frac{r}{R},\n\\]\n方向指向地心。径向向外为正时，静力平衡方程为\n\\[\n\\frac{dp}{dr}=-\\rho g(r)=-\\rho g\\frac{r}{R}.\n\\]\n以地表压力 \\(p(R)=p_R\\) 为边界，从 \\(R\\) 积分到任意 \\(r\\)：\n\\[\np(r)-p_R=\\int_R^r -\\rho g\\frac{s}{R}\\,ds\n=\\frac{\\rho g}{2R}(R^2-r^2).\n\\]\n因此\n\\[\np(r)=p_R+\\frac{\\rho g}{2R}(R^2-r^2).\n\\]\n中心处 \\(r=0\\)，所以\n\\[\n\\boxed{p(0)=p_R+\\frac12\\rho gR}.\n\\]\n若以地表压力为零表压，则中心表压为 \\(\\rho gR/2\\)。这个结果也可由重力势 \\(\\Pi=gr^2/(2R)\\) 下的静力积分 \\(p+\\rho\\Pi=\\) 常数得到。",
    "boundaryNote": "只适用于密度常数、球对称静止流体且 g(r) 与 r 成正比的模型；真实地球分层、自引力非线性和材料强度不在本题范围内。"
  },
  "181103-material-extracted-0286": {
    "diagnosis": "源页六个小项可由页图闭合；题库原答案只列部分结果，需补出旧式记法含义和每项推导。",
    "answer": "令\n\\[\n\\vec r=x\\vec i+y\\vec j+z\\vec k,\n\\qquad r=|\\vec r|=(x^2+y^2+z^2)^{1/2},\n\\qquad r\\ne0.\n\\]\n先有\n\\[\n\\nabla r=\\frac{x\\vec i+y\\vec j+z\\vec k}{r}=\\frac{\\vec r}{r}.\n\\]\n因此 (1)\n\\[\n\\nabla r^m=mr^{m-1}\\nabla r=mr^{m-2}\\vec r.\n\\]\n(2)\n\\[\n\\nabla\\cdot\\vec r=\\frac{\\partial x}{\\partial x}+\\frac{\\partial y}{\\partial y}+\\frac{\\partial z}{\\partial z}=3.\n\\]\n(3) 源页旧式 \\(1/\\vec r\\) 按解法等同于 \\(\\vec r/(\\vec r\\cdot\\vec r)=\\vec r/r^2\\)，故\n\\[\n\\nabla\\cdot\\left(\\frac1{\\vec r}\\right)\n=\\nabla\\cdot(r^{-2}\\vec r)\n=r^{-2}\\nabla\\cdot\\vec r+\\vec r\\cdot\\nabla(r^{-2}).\n\\]\n又 \\(\\nabla(r^{-2})=-2r^{-4}\\vec r\\)，所以\n\\[\n\\nabla\\cdot(r^{-2}\\vec r)=\\frac3{r^2}-\\frac{2r^2}{r^4}=\\frac1{r^2}.\n\\]\n(4)\n\\[\n\\nabla\\wedge\\vec r\n=\\begin{vmatrix}\n\\vec i&\\vec j&\\vec k\\\\\n\\partial_x&\\partial_y&\\partial_z\\\\\nx&y&z\n\\end{vmatrix}=0.\n\\]\n(5)\n\\[\n\\nabla^2\\left(\\frac1r\\right)=\\nabla\\cdot\\nabla(r^{-1})\n=\\nabla\\cdot\\left(-\\frac{\\vec r}{r^3}\\right)\n=-\\frac3{r^3}+\\frac{3(\\vec r\\cdot\\vec r)}{r^5}=0.\n\\]\n(6) 若 \\(f=f(r)\\)，则\n\\[\n\\nabla\\wedge[f(r)\\vec r]\n=\\nabla f(r)\\wedge\\vec r+f(r)\\nabla\\wedge\\vec r\n=f'(r)\\frac{\\vec r}{r}\\wedge\\vec r+0=0.\n\\]\n这些公式都依赖 \\(r\\ne0\\)；原点处 \\(1/r\\) 类函数存在奇性。",
    "boundaryNote": "所有结论均在 r 不等于 0 的经典意义下成立；nabla^2(1/r) 若按分布理论讨论，原点会产生奇异项。"
  },
  "181103-material-extracted-0209": {
    "diagnosis": "现有答案方向正确，但需要区分源书的单位深度质量流量与按压力势写成的体积流量；符号取决于积分方向和等压线标号。",
    "answer": "按源页记号，设 \\(p\\) 为实际压力，\\(\\rho\\) 与柯氏参数 \\(f=2\\Omega\\sin\\alpha\\) 在所考察区域内近似为常数。地转流满足\n\\[\n\\vec V_g=\\frac{1}{f\\rho}\\vec k\\wedge\\nabla_h p.\n\\]\n取连接两条等压线的曲线从 \\(N\\) 到 \\(M\\)，其中 \\(N\\) 在 \\(p=p_1\\)，\\(M\\) 在 \\(p=p_2\\)。源书定义的单位垂直距离质量流量为\n\\[\nQ=\\int_N^M \\vec k\\cdot\\rho(\\vec V_g\\wedge d\\vec r).\n\\]\n代入地转关系并用三重积恒等式：\n\\[\nQ=\\int_N^M \\frac{1}{f}\\vec k\\cdot[(\\vec k\\wedge\\nabla_h p)\\wedge d\\vec r].\n\\]\n等价化简为\n\\[\nQ=-\\frac1f\\int_N^M \\nabla_h p\\cdot d\\vec r.\n\\]\n沿曲线积分有 \\(\\nabla_h p\\cdot d\\vec r=dp\\)，故\n\\[\nQ=-\\frac1f\\int_N^M dp=\\frac{p(N)-p(M)}{f}=\\frac{p_1-p_2}{f}.\n\\]\n所以该质量流量只由两端等压线压力差决定，与连接 \\(M,N\\) 的具体路径无关。若改用压力势\n\\[\nP=\\frac{p}{\\rho}\n\\]\n并把 \\(q=Q/\\rho\\) 称为单位深度体积流量，则\n\\[\nq=\\frac{P_1-P_2}{f}=\\frac{p_1-p_2}{\\rho f}.\n\\]\n反向取曲线或互换 \\(P_1,P_2\\) 时符号随之改变，报告大小时取绝对值。",
    "boundaryNote": "源页公式实际含 rho V_g，因此对应质量输运；题库若用 P 表示单位质量压力势，则可写成 (P1-P2)/f。"
  },
  "181103-material-extracted-0040": {
    "diagnosis": "现有数值正确；关键是源书采用 V*=u-iv=-dF/dz 的复流速约定，若误用另一套约定会造成速度分量符号差异。",
    "answer": "源页采用复流速\n\\[\nV^*=u-iv=-\\frac{dF}{dz}.\n\\]\n已知\n\\[\nF(z)=-3\\left(z+\\frac5z\\right),\n\\]\n故\n\\[\n\\frac{dF}{dz}=-3+\\frac{15}{z^2},\n\\qquad\nV^*=3-\frac{15}{z^2}.\n\\]\n令 \\(z=x+iy\\)，则\n\\[\n\\frac1{z^2}=\\frac{x^2-y^2-2ixy}{(x^2+y^2)^2}.\n\\]\n所以\n\\[\nV^*=3-\\frac{15(x^2-y^2)}{(x^2+y^2)^2}\n+\\frac{30xy}{(x^2+y^2)^2}i\n=u-iv.\n\\]\n因此\n\\[\nu=3-\\frac{15(x^2-y^2)}{(x^2+y^2)^2},\n\\qquad\nv=-\\frac{30xy}{(x^2+y^2)^2}.\n\\]\n在 \\(x=3,y=4\\) 处，\\((x^2+y^2)^2=25^2=625\\)，\\(x^2-y^2=-7\\)，故\n\\[\nu=3-\\frac{15(-7)}{625}=3.168,\n\\qquad\nv=-\\frac{30\\cdot3\\cdot4}{625}=-0.576.\n\\]\n速度大小为\n\\[\nV=\\sqrt{u^2+v^2}=\\sqrt{3.168^2+0.576^2}\\approx3.22.\n\\]\n流向角取相对于 \\(+x\\) 轴为\n\\[\n\\alpha=\\arctan\\frac{v}{u}=\\arctan\\frac{-0.576}{3.168}\\approx-10^\\circ18'.\n\\]",
    "boundaryNote": "本答案按源书 u-iv=-dF/dz 约定给出；若按常见 dF/dz=u-iv 约定，分量方向会不同，不能混用。"
  },
  "181103-material-extracted-0260": {
    "diagnosis": "现有答案数值正确，但应补出光滑壁面对数律、两点相减消去 nu 的步骤以及单位换算。",
    "answer": "设两测点均处于光滑平板湍流边界层的对数律区，采用源页尼古拉兹光滑壁公式\n\\[\n\\frac{u}{u^*}=2.5\\ln\\left(\\frac{u^*y}{\\nu}\\right)+5.5.\n\\]\n给定\n\\[\ny_1=6.35\\times10^{-3}\\,\\mathrm m,\n\\quad u_1=1.83\\,\\mathrm{m/s},\n\\]\n\\[\ny_2=12.7\\times10^{-3}\\,\\mathrm m,\n\\quad u_2=1.98\\,\\mathrm{m/s}.\n\\]\n对两点分别写式：\n\\[\n\\frac{u_2}{u^*}=2.5\\ln\\left(\\frac{u^*y_2}{\\nu}\\right)+5.5,\n\\]\n\\[\n\\frac{u_1}{u^*}=2.5\\ln\\left(\\frac{u^*y_1}{\\nu}\\right)+5.5.\n\\]\n两式相减消去 \\(\\nu\\)，得\n\\[\n\\frac{u_2-u_1}{u^*}=2.5\\ln\\frac{y_2}{y_1}=2.5\\ln2.\n\\]\n故\n\\[\nu^*=\\frac{0.15}{2.5\\ln2}=8.67\\times10^{-2}\\,\\mathrm{m/s}.\n\\]\n再代回第二个测点：\n\\[\n\\frac{1.98}{u^*}=2.5\\ln\\left(\\frac{u^*\\cdot12.7\\times10^{-3}}{\\nu}\\right)+5.5.\n\\]\n于是\n\\[\n\\nu=\\frac{u^*\\cdot12.7\\times10^{-3}}{\n\\exp[(1.98/u^*-5.5)/2.5]}\n\\approx1.07\\times10^{-6}\\,\\mathrm{m^2/s}.\n\\]\n换成厘米制为\n\\[\n\\nu=1.07\\times10^{-2}\\,\\mathrm{cm^2/s}.\n\\]\n故\n\\[\n\\boxed{u^*=8.67\\times10^{-2}\\,\\mathrm{m/s}},\n\\qquad\n\\boxed{\\nu=1.07\\times10^{-6}\\,\\mathrm{m^2/s}}.\n\\]",
    "boundaryNote": "本条只回答题目第 (1) 问；结果依赖光滑壁面对数律和两测点处于同一对数律区的假设。"
  },
  "181103-material-extracted-0072": {
    "diagnosis": "当前答案结论正确，但需要把等温关系、体积比、底部与水面绝对压强关系逐步展开。",
    "answer": "设气泡在水底时直径为 \\(d_B=1\\,\\mathrm{cm}\\)，浮到水面时直径为 \\(d_T=2\\,\\mathrm{cm}\\)。球体体积与直径三次方成正比，所以\n\\[\n\\frac{V_T}{V_B}=\\left(\\frac{d_T}{d_B}\\right)^3=2^3=8.\n\\]\n气泡内空气质量不变，且按等温变化，理想气体满足\n\\[\npV=\\text{常数}.\n\\]\n因此水底与水面两状态满足\n\\[\np_BV_B=p_TV_T.\n\\]\n水面处气泡内压强取为大气压 \\(p_T=p_0\\)，于是\n\\[\np_B=p_T\\frac{V_T}{V_B}=8p_0.\n\\]\n水底深度为 \\(H\\) 时，静水压给出底部气泡绝对压强\n\\[\np_B=p_0+\\rho gH.\n\\]\n联立两式：\n\\[\np_0+\\rho gH=8p_0,\n\\]\n所以\n\\[\n\\rho gH=7p_0,\n\\qquad\nH=\\frac{7p_0}{\\rho g}.\n\\]\n取 \\(p_0=1.013\\times10^5\\,\\mathrm{Pa}\\)、\\(\\rho=1000\\,\\mathrm{kg/m^3}\\)、\\(g=9.81\\,\\mathrm{m/s^2}\\)，得\n\\[\nH\\approx\\frac{7\\times1.013\\times10^5}{1000\\times9.81}\\approx72.3\\,\\mathrm m.\n\\]\n故水深约为 \\(72\\,\\mathrm m\\)。",
    "boundaryNote": "按题意忽略表面张力、气泡上升过程的动力效应和水温变化；压强必须用绝对压强，不能只用表压。"
  },
  "181103-material-extracted-0015": {
    "diagnosis": "当前答案结论正确，但可以补出流线微分方程、积分过程和图形方向说明。",
    "answer": "定常平面速度场为\n\\[\nu=ay,\n\\qquad v=-ax.\n\\]\n流线是在同一时刻处处与速度矢量相切的曲线，故满足\n\\[\n\\frac{dy}{dx}=\\frac{v}{u}=\\frac{-ax}{ay}=-\\frac{x}{y}\\qquad(a\\ne0).\n\\]\n整理得\n\\[\ny\\,dy=-x\\,dx,\n\\]\n即\n\\[\nx\\,dx+y\\,dy=0.\n\\]\n两边积分：\n\\[\n\\int x\\,dx+\\int y\\,dy=0,\n\\]\n得到\n\\[\n\\frac{x^2}{2}+\\frac{y^2}{2}=C_1,\n\\]\n或写成\n\\[\nx^2+y^2=C.\n\\]\n因此流线是一族以原点为圆心的同心圆。原点处 \\(u=v=0\\)，为驻点；除原点外，速度方向沿圆的切线方向。若 \\(a>0\\)，在点 \\((r,0)\\) 处有 \\(v=-ar<0\\)，流动沿顺时针方向；若 \\(a<0\\)，方向相反。",
    "boundaryNote": "本题只需给出流线族和图形特征；若作图，可画若干同心圆并按 a 的符号标出切向箭头。"
  },
  "181103-material-extracted-0087": {
    "diagnosis": "当前答案结论正确，但证明应显式连接上一小问孔口流速、水平抛体时间和射程公式。",
    "answer": "水箱顶端开口，侧壁小孔距水面深度为 \\(h\\)，水面距地面高度为 \\(H\\)，所以小孔距地面高度为\n\\[\nH-h.\n\\]\n由上一小问或由水面到小孔列伯努利方程，在水面速度可忽略、两处均为大气压时，孔口水平出流速度为\n\\[\nV_A=\\sqrt{2gh}.\n\\]\n水从小孔射出后按水平抛射处理。竖直方向初速度为零，落地时下降距离为 \\(H-h\\)，故\n\\[\nH-h=\\frac12gt^2.\n\\]\n由此得飞行时间\n\\[\nt=\\sqrt{\\frac{2(H-h)}{g}}.\n\\]\n水平方向速度近似保持为 \\(V_A\\)，所以射程为\n\\[\nS=V_A t.\n\\]\n代入 \\(V_A=\\sqrt{2gh}\\)：\n\\[\nS=\\sqrt{2gh}\\sqrt{\\frac{2(H-h)}{g}}=2\\sqrt{h(H-h)}.\n\\]\n故由小孔射出的水流射程为\n\\[\n\\boxed{S=2\\sqrt{h(H-h)}}.\n\\]",
    "boundaryNote": "按理想孔口出流处理，忽略收缩系数、能量损失、空气阻力和水面下降；H 是水面离地高度，不是孔口离地高度。"
  },
  "181103-material-extracted-0055": {
    "diagnosis": "当前答案只给结论，需要把黏性合力来自 nu nabla^2 V，以及顶、底面面力方向由外法向决定这两点写清。",
    "answer": "两种速度场都只有 \\(x\\) 方向速度，记\n\\[\n\\mathbf V=(u(z),0,0).\n\\]\n对不可压牛顿流体，单位质量上的黏性力为\n\\[\n\\mathbf f_\\nu=\\nu\\nabla^2\\mathbf V.\n\\]\n因 \\(u\\) 只随 \\(z\\) 变，\n\\[\n\\nabla^2\\mathbf V=\\frac{d^2u}{dz^2}\\mathbf i.\n\\]\n(1) 当 \\(u=z^2\\) 时，\n\\[\n\\frac{du}{dz}=2z,\n\\qquad\n\\frac{d^2u}{dz^2}=2,\n\\]\n故 \\(\\mathbf f_\\nu=2\\nu\\mathbf i\\)。(2) 当 \\(u=(z-1)^2\\) 时，\n\\[\n\\frac{du}{dz}=2(z-1),\n\\qquad\n\\frac{d^2u}{dz^2}=2,\n\\]\n故同样有 \\(\\mathbf f_\\nu=2\\nu\\mathbf i\\)。因此两种情形下，位于 \\(z=1\\) 处的单位质量长方体流点所受黏性合力矢均为\n\\[\n\\boxed{2\\nu\\mathbf i}.\n\\]\n再求顶面和底面上的黏性面力。设长方体微团中心在 \\(z=1\\)，高度为 \\(\\delta z\\)，顶面位置为 \\(z=1+\\delta z/2\\)，底面位置为 \\(z=1-\\delta z/2\\)。水平面上的剪应力分量为\n\\[\n\\tau_{xz}=\\mu\\frac{du}{dz}.\n\\]\n顶面外法向为 \\(+\\mathbf k\\)，其黏性面力密度为 \\(+\\tau_{xz}\\mathbf i\\)；底面外法向为 \\(-\\mathbf k\\)，其黏性面力密度为 \\(-\\tau_{xz}\\mathbf i\\)。\n\n对 (1) \\(u=z^2\\)，\\(\\tau_{xz}=2\\mu z\\)。顶面面力密度为\n\\[\n2\\mu\\left(1+\\frac{\\delta z}{2}\\right)\\mathbf i=(2\\mu+\\mu\\delta z)\\mathbf i.\n\\]\n底面应力分量为 \\(2\\mu(1-\\delta z/2)\\)，但作用在微团上的底面面力要乘外法向符号，所以为\n\\[\n-(2\\mu-\\mu\\delta z)\\mathbf i.\n\\]\n两者方向相反、大小不同，其差额给出正 \\(x\\) 方向合力。\n\n对 (2) \\(u=(z-1)^2\\)，\\(\\tau_{xz}=2\\mu(z-1)\\)。顶面面力密度为\n\\[\n+\\mu\\delta z\\mathbf i.\n\\]\n底面应力分量为 \\(-\\mu\\delta z\\)，乘底面外法向符号后作用在微团上的面力密度为\n\\[\n-(-\\mu\\delta z)\\mathbf i=+\\mu\\delta z\\mathbf i.\n\\]\n所以第 (2) 种情形顶、底面黏性面力大小相等、方向相同，均沿正 \\(x\\) 方向；二者合成产生 \\(2\\nu\\mathbf i\\) 的单位质量黏性合力。",
    "boundaryNote": "这里把“顶面和底面上的黏性应力”按作用在微团表面的黏性面力密度解释；若只列应力张量分量，底面还需另乘外法向符号。"
  },
  "181103-material-extracted-0519": {
    "diagnosis": "当前答案结论正确，但缺少从圆柱 Couette 流通解、边界条件、剪应力和力矩积分到结果的完整推导。",
    "answer": "这是内圆柱半径为 \\(a\\)、角速度为 \\(\\omega\\)，外边界取 \\(b\\to\\infty\\) 的轴对称定常旋转黏性流。速度只有周向分量，设\n\\[\n\\mathbf V=v_\\theta(r)\\mathbf e_\\theta,\n\\qquad v_r=0.\n\\]\n圆柱坐标下，这类定常圆周 Couette 流的周向速度满足通解\n\\[\nv_\\theta=Ar+\\frac{B}{r}.\n\\]\n当流体区域无限大时，远处速度不能随 \\(r\\) 增大而发散，并且应有 \\(v_\\theta(\\infty)=0\\)，所以必须取 \\(A=0\\)。圆柱壁面满足无滑移条件：\n\\[\nv_\\theta(a)=a\\omega.\n\\]\n由 \\(v_\\theta=B/r\\) 得\n\\[\n\\frac{B}{a}=a\\omega,\n\\qquad B=a^2\\omega.\n\\]\n故无限流体中圆柱外的速度分布为\n\\[\n\\boxed{v_\\theta(r)=\\frac{a^2\\omega}{r}},\n\\qquad v_r=0.\n\\]\n再求维持匀速转动所需力矩。圆柱坐标中周向剪应力为\n\\[\n\\tau_{r\\theta}=\\mu\\left(\\frac{dv_\\theta}{dr}-\\frac{v_\\theta}{r}\\right).\n\\]\n代入 \\(v_\\theta=a^2\\omega/r\\)：\n\\[\n\\frac{dv_\\theta}{dr}=-\\frac{a^2\\omega}{r^2},\n\\qquad\n\\frac{v_\\theta}{r}=\\frac{a^2\\omega}{r^2},\n\\]\n所以\n\\[\n\\tau_{r\\theta}=-\\frac{2\\mu a^2\\omega}{r^2}.\n\\]\n在圆柱表面 \\(r=a\\) 处，\\(\\tau_{r\\theta}(a)=-2\\mu\\omega\\)。负号表示流体对圆柱的黏性阻力矩方向与圆柱转动方向相反。单位长度圆柱表面积为 \\(2\\pi a\\)，单位长度上切向阻力大小为\n\\[\n2\\pi a\\cdot2\\mu\\omega=4\\pi\\mu a\\omega.\n\\]\n再乘力臂 \\(a\\)，得单位长度阻力矩大小\n\\[\nM'=4\\pi\\mu a^2\\omega.\n\\]\n因此，为维持圆柱以角速度 \\(\\omega\\) 匀速转动，外加在圆柱上的单位长度力矩大小应为\n\\[\n\\boxed{4\\pi\\mu a^2\\omega},\n\\]\n方向与圆柱转动方向相同，用以平衡流体施加的反向黏性阻力矩。若圆柱长度为 \\(L\\)，总力矩为 \\(M=4\\pi\\mu a^2\\omega L\\)。",
    "boundaryNote": "题库当前答案给的是单位长度力矩；若题目或图中另给圆柱长度，应乘以长度 L。推导默认定常层流、无端部效应、无限远流体静止。"
  },
  "181103-material-extracted-0168": {
    "diagnosis": "现有答案结论正确，但需要明确点涡只受点源速度场平移、自身诱导速度不计入，并写出运动方程到极坐标轨迹的推导。",
    "answer": "设点源在原点，源强采用二维势流常用约定，即点源势函数为\n\\[\n\\phi_s=\\frac{m}{2\\pi}\\ln r.\n\\]\n因此速度场为\n\\[\n\\mathbf u_s=\\nabla\\phi_s=\\frac{m}{2\\pi r}\\mathbf e_r.\n\\]\n点涡是集中涡量奇点，它不由自身诱导速度推动；其位置只随其他奇点产生的速度场运动。令点涡位置为 \\((x(t),y(t))\\)，\\(r^2=x^2+y^2\\)，则\n\\[\n\\dot x=\\frac{m}{2\\pi}\\frac{x}{x^2+y^2},\n\\qquad\n\\dot y=\\frac{m}{2\\pi}\\frac{y}{x^2+y^2}.\n\\]\n转为极坐标，有\n\\[\n\\dot\\theta=\\frac{x\\dot y-y\\dot x}{r^2}=0,\n\\qquad\n\\dot r=\\frac{x\\dot x+y\\dot y}{r}=\\frac{m}{2\\pi r}.\n\\]\n所以点涡的极角保持为初始值 \\(\\theta_0\\)，即轨迹始终在过原点和初始点 \\((x_0,y_0)\\) 的直线上。积分\n\\[\nr\\dot r=\\frac{m}{2\\pi}\n\\]\n得\n\\[\nr^2=r_0^2+\\frac{m}{\\pi}t,\n\\qquad r_0^2=x_0^2+y_0^2.\n\\]\n由于 \\(m>0\\) 是点源，运动方向沿该直线射线向外，离原点越来越远。若写成直角坐标轨迹，就是\n\\[\nxy_0-yx_0=0,\n\\]\n且 \\(r\\) 随上式增大。",
    "boundaryNote": "常数 2pi 依赖源强定义；若资料把点源速度定义为 m/r，则时间系数相应改变，但径向直线射线结论不变。"
  },
  "181103-material-extracted-0096": {
    "diagnosis": "现有答案给出附加质量结果，但缺少速度势、能量积分和为什么取扰动速度的说明。",
    "answer": "设圆柱半径为 \\(a\\)，讨论单位厚度。圆柱沿 \\(x\\) 轴负向以速度 \\(U\\) 运动，而远处流体原来静止。转到随圆柱运动的坐标系，问题等价于静止圆柱外有速度大小为 \\(U\\) 的均匀来流。半径为 \\(a\\) 的圆柱外势流速度势可写为\n\\[\n\\phi'=U\\left(r+\\frac{a^2}{r}\\right)\\cos\\theta.\n\\]\n回到实验室系时，远处均匀平移部分不代表流体相对静止空间的实际运动，应扣除 \\(Ur\\cos\\theta\\)，所以圆柱运动诱导的扰动势为\n\\[\n\\phi=U\\frac{a^2}{r}\\cos\\theta.\n\\]\n于是\n\\[\nu_r=\\frac{\\partial\\phi}{\\partial r}=-U\\frac{a^2}{r^2}\\cos\\theta,\n\\qquad\nu_\\theta=\\frac1r\\frac{\\partial\\phi}{\\partial\\theta}=-U\\frac{a^2}{r^2}\\sin\\theta.\n\\]\n从而\n\\[\nu_r^2+u_\\theta^2=U^2\\frac{a^4}{r^4}.\n\\]\n单位厚度流体动能为\n\\[\nT=\\frac{\\rho}{2}\\int_a^\\infty\\int_0^{2\\pi}(u_r^2+u_\\theta^2)r\\,d\\theta\\,dr\n=\\frac{\\rho}{2}U^2a^4(2\\pi)\\int_a^\\infty r^{-3}\\,dr\n=\\frac12\\rho\\pi a^2U^2.\n\\]\n这也可写成附加质量形式\n\\[\nT=\\frac12m_aU^2,\n\\qquad m_a=\\rho\\pi a^2.\n\\]\n单位厚度圆柱的附加质量数值上等于被圆柱排开的流体质量。物理意义是：理想流体虽无粘性，但圆柱运动时必须带动周围一部分流体形成势流运动，这部分动能表现为附加质量动能。",
    "boundaryNote": "题干未显式给半径，推导中以 a 表示圆柱半径；这是参考答案数学展开，不等同于严格 PDF bbox/page-span 证明。"
  },
  "181103-material-extracted-0235": {
    "diagnosis": "现有答案公式正确，但需要补出从三维高斯核积分到一维面源解的过程，并说明质量守恒与单位。",
    "answer": "斐克扩散方程为\n\\[\n\\frac{\\partial C}{\\partial t}=\\kappa\\nabla^2C,\n\\]\n其中 \\(C\\) 为浓度，\\(\\kappa\\) 为扩散系数。瞬时面源位于 \\(z=0\\) 平面，强度为 \\(Q\\,\\mathrm{kg/m^2}\\)，表示在 \\(t=0\\) 时单位面积释放质量 \\(Q\\)。由于源在整个 \\(z=0\\) 平面内均匀分布，解不依赖 \\(x,y\\)，只依赖 \\(z,t\\)。因此初始条件可写为\n\\[\nC(z,0^+)=Q\\delta(z).\n\\]\n一维热核为\n\\[\nG(z,t)=\\frac{1}{\\sqrt{4\\pi\\kappa t}}\\exp\\left(-\\frac{z^2}{4\\kappa t}\\right),\n\\qquad t>0,\n\\]\n所以\n\\[\nC(z,t)=QG(z,t)=\\frac{Q}{2\\sqrt{\\pi\\kappa t}}\\exp\\left(-\\frac{z^2}{4\\kappa t}\\right).\n\\]\n也可从三维瞬时点源解\n\\[\n(4\\pi\\kappa t)^{-3/2}\\exp\\left[-\\frac{x^2+y^2+z^2}{4\\kappa t}\\right]\n\\]\n在 \\(z=0\\) 平面上对所有 \\((x,y)\\) 面源叠加得到：\n\\[\nC(z,t)=Q\\iint_{-\\infty}^{\\infty}(4\\pi\\kappa t)^{-3/2}\n\\exp\\left[-\\frac{\\xi^2+\\eta^2+z^2}{4\\kappa t}\\right]d\\xi d\\eta\n=\\frac{Q}{2\\sqrt{\\pi\\kappa t}}\\exp\\left(-\\frac{z^2}{4\\kappa t}\\right).\n\\]\n检验质量守恒：\n\\[\n\\int_{-\\infty}^{\\infty}C(z,t)\\,dz=Q,\n\\]\n说明释放的单位面积质量没有丢失。\\(Q\\) 的单位是 \\(\\mathrm{kg/m^2}\\)，除以扩散厚度量级 \\(\\sqrt{\\kappa t}\\) 后，\\(C\\) 的单位为 \\(\\mathrm{kg/m^3}\\)。",
    "boundaryNote": "按无界空间中无限平面瞬时面源处理；若题目限定半空间或有不可透壁边界，需另加镜像条件。"
  },
  "181103-material-extracted-0494": {
    "diagnosis": "现有答案方向正确，但题面很短，容易把“求偶的像”讲成记忆规则；应补出直线壁面和不可穿透边界条件来源。",
    "answer": "把给定直线经过平移和旋转化为 \\(x\\) 轴，即壁面为 \\(y=0\\)。设原偶位于 \\(P_0=(x_0,y_0)\\)，偶极矩为\n\\[\n\\boldsymbol\\mu=\\mu_t\\mathbf t+\\mu_n\\mathbf n,\n\\]\n其中 \\(\\mathbf t\\) 为沿直线的切向，\\(\\mathbf n\\) 为法向。对不可穿透直线壁面，边界条件是壁面法向速度为零，即\n\\[\nv_n=\\frac{\\partial\\phi}{\\partial n}=0.\n\\]\n像法的做法是把原偶关于直线反射到\n\\[\nP_0^*=(x_0,-y_0),\n\\]\n并令像偶的切向分量与原偶同向、法向分量与原偶反向：\n\\[\n\\boldsymbol\\mu^*=\\mu_t\\mathbf t-\\mu_n\\mathbf n.\n\\]\n这样叠加原偶和像偶后，壁面两侧由法向分量造成的法向速度在 \\(y=0\\) 上相互抵消，而切向速度可以相加，因为固壁只要求不可穿透，并不要求切向速度为零。换句话说，若偶轴平行于直线，像偶同向同强；若偶轴垂直于直线，像偶反向同强；一般方向则先分解为切向和法向，再分别按这两个规则处理。若采用复势表示，把直线取为实轴，位于 \\(z_0\\) 的偶的像点为 \\(\\bar z_0\\)，偶极矩方向按上述切向保持、法向反号的规则确定。对任意直线，先把坐标旋转到该直线为实轴，求像后再旋回原坐标即可。",
    "boundaryNote": "按势流像法中的不可穿透直线边界理解；若题目只问纯几何镜像，位置仍取镜像点，方向等价于向量关于该直线反射。"
  },
  "181103-material-extracted-0161": {
    "diagnosis": "现有答案数值合理，但推导缺少上题环流公式、温差换算、压强层积分和回路长度估算。",
    "answer": "利用上题的环流定理。对理想气体，可把热力造成的环流增长写成\n\\[\n\\frac{d\\Gamma}{dt}=-\\oint \\alpha\\,dp,\n\\qquad \\alpha=\\frac1\\rho=\\frac{RT}{p},\n\\]\n其中 \\(R\\approx287\\,\\mathrm{J/(kg\\cdot K)}\\)。取矩形环流回路：水平方向从海岸向海洋约 \\(10\\,\\mathrm{km}\\)，向大陆约 \\(10\\,\\mathrm{km}\\)，总水平跨度约 \\(20\\,\\mathrm{km}\\)；垂直方向从 \\(p_1=1000\\,\\mathrm{hPa}\\) 到 \\(p_2=980\\,\\mathrm{hPa}\\)，高度约 \\(200\\,\\mathrm m\\)。气层水平平均温度梯度为 \\(0.3\\,\\mathrm{K/km}\\)，所以海陆两端总温差约为\n\\[\n\\Delta T=0.3\\times20=6\\,\\mathrm K.\n\\]\n沿闭合回路积分时，主要贡献来自两侧竖直段在不同温度下跨越同一压强差，由 \\(\\alpha=RT/p\\) 得环流增长率的量级\n\\[\n\\left|\\frac{d\\Gamma}{dt}\\right|=R\\Delta T\\ln\\frac{p_1}{p_2}\n=287\\times6\\times\\ln\\frac{1000}{980}\n\\approx34.8\\,\\mathrm{m^2/s^2}.\n\\]\n温差维持一小时 \\(t=3600\\,\\mathrm s\\) 后，环流大小约为\n\\[\n\\Gamma\\approx34.8\\times3600\\approx1.25\\times10^5\\,\\mathrm{m^2/s}.\n\\]\n回路长度近似为\n\\[\nL\\approx2(20\\,\\mathrm{km}+0.2\\,\\mathrm{km})=40.4\\,\\mathrm{km}=4.04\\times10^4\\,\\mathrm m.\n\\]\n把总环流平均分配到回路上，平均风速为\n\\[\n\\bar V\\approx\\frac{\\Gamma}{L}\n\\approx\\frac{1.25\\times10^5}{4.04\\times10^4}\n\\approx3.1\\,\\mathrm{m/s}.\n\\]\n物理意义是：海陆受热差异造成水平温度差，在有垂直压强差的气层中形成斜压项，环流随时间增长；该环流除以回路长度，就给出环流回路上的平均海风速度量级。",
    "boundaryNote": "本题依赖“上题结果”。方向正负取决于环流路径取向，最终报告平均风速大小。"
  },
  "181103-material-extracted-0006": {
    "diagnosis": "现有答案公式正确，但需要补出物质导数计算，以及沿质点轨迹将 x^2+y^2+z^2 写成拉格朗日常数的过程。",
    "answer": "记\n\\[\nr^2=x^2+y^2+z^2.\n\\]\n流体质点的温度随时间变化应取物质导数：\n\\[\n\\frac{DT}{Dt}=\\frac{\\partial T}{\\partial t}+u\\frac{\\partial T}{\\partial x}+v\\frac{\\partial T}{\\partial y}+w\\frac{\\partial T}{\\partial z}.\n\\]\n由 \\(T=At^2/r^2\\)，有\n\\[\n\\frac{\\partial T}{\\partial t}=\\frac{2At}{r^2},\n\\qquad\n\\frac{\\partial T}{\\partial x}=-\\frac{2At^2x}{r^4},\n\\]\n\\[\n\\frac{\\partial T}{\\partial y}=-\\frac{2At^2y}{r^4},\n\\qquad\n\\frac{\\partial T}{\\partial z}=-\\frac{2At^2z}{r^4}.\n\\]\n又 \\(u=xt,\\ v=yt,\\ w=zt\\)，所以对流项为\n\\[\n-\\frac{2At^2}{r^4}(xt\\,x+yt\\,y+zt\\,z)=-\\frac{2At^3}{r^2}.\n\\]\n因此\n\\[\n\\frac{DT}{Dt}=\\frac{2At}{r^2}-\\frac{2At^3}{r^2}=\\frac{2At(1-t^2)}{x^2+y^2+z^2}.\n\\]\n若用质点轨迹表示，质点满足\n\\[\n\\frac{dx}{dt}=xt,\n\\quad\n\\frac{dy}{dt}=yt,\n\\quad\n\\frac{dz}{dt}=zt.\n\\]\n积分得\n\\[\nx=ae^{t^2/2},\n\\quad y=be^{t^2/2},\n\\quad z=ce^{t^2/2},\n\\]\n故\n\\[\nr^2=(a^2+b^2+c^2)e^{t^2}.\n\\]\n代入得该质点温度变化率为\n\\[\n\\frac{DT}{Dt}=\\frac{2At(1-t^2)}{(a^2+b^2+c^2)e^{t^2}}.\n\\]\n等价地，沿迹线\n\\[\nT(t)=\\frac{At^2}{(a^2+b^2+c^2)e^{t^2}},\n\\]\n直接对 \\(t\\) 求导也得到同一结果。",
    "boundaryNote": "基于 JSON 题面和既有参考答案做推导扩写；未做原 PDF 页图或 bbox 严格证明。"
  },
  "181103-material-extracted-0247": {
    "diagnosis": "现有答案给出三个数值，但缺少一般 n 的积分公式和三种边界层厚度定义。",
    "answer": "令\n\\[\n\\eta=\\frac{y}{\\delta},\n\\qquad \\frac{u}{U}=\\eta^n,\n\\]\n积分区间为 \\(0\\le\\eta\\le1\\)。位移厚度定义为\n\\[\n\\delta^*=\\int_0^\\delta\\left(1-\\frac{u}{U}\\right)dy.\n\\]\n所以\n\\[\n\\frac{\\delta^*}{\\delta}=\\int_0^1(1-\\eta^n)d\\eta\n=1-\\frac{1}{n+1}=\\frac{n}{n+1}.\n\\]\n动量厚度定义为\n\\[\n\\delta^{**}=\\int_0^\\delta\\frac{u}{U}\\left(1-\\frac{u}{U}\\right)dy.\n\\]\n所以\n\\[\n\\frac{\\delta^{**}}{\\delta}=\\int_0^1(\\eta^n-\\eta^{2n})d\\eta\n=\\frac{1}{n+1}-\\frac{1}{2n+1}\n=\\frac{n}{(n+1)(2n+1)}.\n\\]\n按题中第三种厚度所对应的能量损失厚度定义，\n\\[\n\\delta^{****}=\\int_0^\\delta\\frac{u}{U}\\left[1-\\left(\\frac{u}{U}\\right)^2\\right]dy.\n\\]\n于是\n\\[\n\\frac{\\delta^{****}}{\\delta}=\\int_0^1(\\eta^n-\\eta^{3n})d\\eta\n=\\frac{1}{n+1}-\\frac{1}{3n+1}\n=\\frac{2n}{(n+1)(3n+1)}.\n\\]\n当 \\(n=1/7\\) 时，\n\\[\n\\frac{\\delta^*}{\\delta}=\\frac{1/7}{8/7}=\\frac18,\n\\]\n\\[\n\\frac{\\delta^{**}}{\\delta}=\\frac{1/7}{(8/7)(9/7)}=\\frac{7}{72},\n\\]\n\\[\n\\frac{\\delta^{****}}{\\delta}=\\frac{2/7}{(8/7)(10/7)}=\\frac{7}{40}.\n\\]",
    "boundaryNote": "第三个厚度按与现有答案数值一致的能量损失厚度定义展开；若教材符号定义不同，应以教材定义为准。"
  },
  "181103-material-extracted-0051": {
    "diagnosis": "现有答案结果正确，但需要说明圆锥相似截面面积关系、不可压连续性，以及加速度局部项和对流项来源。",
    "answer": "取从顶点 \\(O\\) 沿圆锥管轴线向外的距离为 \\(x\\)，距顶点 \\(l\\) 处截面积为 \\(S_l\\)，距顶点 \\(x\\) 处截面积为 \\(S_x\\)。圆锥形管的相似截面满足\n\\[\n\\frac{S_x}{S_l}=\\frac{x^2}{l^2}.\n\\]\n不可压流体在任一截面的体积流量相同，因此\n\\[\nS_lU(t)=S_xu(x,t).\n\\]\n由此得到\n\\[\nu(x,t)=\\frac{S_l}{S_x}U(t)=\\frac{l^2}{x^2}U(t).\n\\]\n流动按轴向一维处理时，流点加速度为物质导数\n\\[\na=\\frac{Du}{Dt}=\\frac{\\partial u}{\\partial t}+u\\frac{\\partial u}{\\partial x}.\n\\]\n其中\n\\[\n\\frac{\\partial u}{\\partial t}=\\frac{l^2}{x^2}\\frac{dU}{dt},\n\\qquad\n\\frac{\\partial u}{\\partial x}=-\\frac{2l^2}{x^3}U(t).\n\\]\n所以\n\\[\na=\\frac{l^2}{x^2}\\frac{dU}{dt}\n+\\frac{l^2U}{x^2}\\left(-\\frac{2l^2U}{x^3}\\right)\n=\\frac{l^2}{x^2}\\frac{dU}{dt}-\\frac{2l^4U^2}{x^5}.\n\\]\n若用向量表示，方向沿圆锥管轴线，\n\\[\n\\mathbf a=\\left(\\frac{l^2}{x^2}\\frac{dU}{dt}-\\frac{2l^4U^2}{x^5}\\right)\\mathbf e_x.\n\\]",
    "boundaryNote": "采用题目隐含的一维平均速度模型；若真实截面速度分布不均匀，需要额外给定分布后才能求截面内各点加速度。"
  },
  "181103-material-extracted-0420": {
    "diagnosis": "现有答案给出主要结果，但缺少 z 方向、固定时刻流线与质点迹线的区别，以及拉格朗日速度/加速度完整表达。",
    "answer": "固定某一时刻 \\(t=t_0\\) 看流线。由\n\\[\n\\frac{dy}{dx}=\\frac{v}{u}=\\frac{yt_0^2}{xt_0^2}=\\frac{y}{x},\n\\]\n得\n\\[\n\\ln y=\\ln x+C,\n\\qquad y=Cx.\n\\]\n又 \\(w=0\\)，所以流线还满足 \\(z=C_z\\)。当 \\(t_0=0\\) 时全场瞬时速度为零，流线方向退化，通常按 \\(t_0\\ne0\\) 给出上述族线。\n\n质点轨迹需解\n\\[\n\\frac{dx}{dt}=xt^2,\n\\qquad\n\\frac{dy}{dt}=yt^2,\n\\qquad\n\\frac{dz}{dt}=0.\n\\]\n取拉格朗日标号为初始位置 \\((a,b,c)=(x(0),y(0),z(0))\\)，积分得\n\\[\nx=ae^{t^3/3},\n\\qquad\ny=be^{t^3/3},\n\\qquad z=c.\n\\]\n欧拉形式的加速度为\n\\[\na_x=\\frac{\\partial u}{\\partial t}+u\\frac{\\partial u}{\\partial x}+v\\frac{\\partial u}{\\partial y}+w\\frac{\\partial u}{\\partial z}.\n\\]\n因 \\(u=xt^2\\)，有 \\(\\partial u/\\partial t=2tx\\)、\\(\\partial u/\\partial x=t^2\\)，其余相关偏导为零，所以\n\\[\na_x=2tx+xt^4=x(t^4+2t).\n\\]\n同理\n\\[\na_y=y(t^4+2t),\n\\qquad a_z=0.\n\\]\n用拉格朗日变数表示速度，将轨迹代入速度场，得\n\\[\nu_L=at^2e^{t^3/3},\n\\qquad v_L=bt^2e^{t^3/3},\n\\qquad w_L=0.\n\\]\n用拉格朗日变数表示加速度，得\n\\[\na_{xL}=ae^{t^3/3}(t^4+2t),\n\\qquad\na_{yL}=be^{t^3/3}(t^4+2t),\n\\qquad a_{zL}=0.\n\\]\n这也可由对 \\(u_L,v_L,w_L\\) 直接对时间求导得到。",
    "boundaryNote": "补充了三维坐标中的 z 常数和 t=0 退化说明；该输出是推导增强，不是对原 PDF 的逐字校勘。"
  },
  "181103-material-extracted-0511": {
    "diagnosis": "现有答案结论正确，但需要补出库埃特流控制方程、边界条件和上下板摩擦应力方向约定。",
    "answer": "设两平板间距为 \\(h\\)，下板位于 \\(y=0\\) 并固定，上板位于 \\(y=h\\) 并沿 \\(+x\\) 方向以速度 \\(U\\) 匀速运动。对无限长平行板间定常层流，取速度形式为\n\\[\n\\mathbf V=(u(y),0,0).\n\\]\n若无外加压强梯度，定常不可压 Navier-Stokes 方程在 \\(x\\) 方向化为\n\\[\n0=\\mu\\frac{d^2u}{dy^2}.\n\\]\n因此\n\\[\nu=C_1y+C_2.\n\\]\n由无滑移边界条件\n\\[\nu(0)=0,\n\\qquad u(h)=U,\n\\]\n得 \\(C_2=0\\)、\\(C_1=U/h\\)，所以速度分布为\n\\[\nu=\\frac{Uy}{h}.\n\\]\n牛顿内摩擦定律给出剪应力\n\\[\n\\tau_{xy}=\\mu\\frac{du}{dy}=\\mu\\frac{U}{h},\n\\]\n在两板间为常数。若问流体作用在平板上的摩擦应力，并取 \\(+x\\) 为上板运动方向，则流体对下固定板的摩擦应力方向为 \\(+x\\)，大小为 \\(\\mu U/h\\)；流体对上运动板的摩擦应力方向为 \\(-x\\)，大小同为 \\(\\mu U/h\\)。若改问平板作用在流体上的摩擦应力，则方向与上述相反。",
    "boundaryNote": "答案采用纯库埃特流假设，即没有给定额外压强梯度；若题目另加压强梯度，应叠加平板泊肃叶流项。"
  }
}`);
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
    '# Round538 181103 Proof Depth Upgrade',
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
    '- Boundary: this is the eighth proof/process/explanation-depth batch after Round531-Round537, not a claim that every proof-like row is closed.',
    '- QA rule: visible answer blocks that only say "use a theorem" or "same as above" are insufficient for proof questions.',
    '- Correction rule: a proof answer must show assumptions, governing equations or identities, transformations, boundary/regularity conditions where relevant, and a conclusion check.',
    '- Source-clue rule: default practice cards are prioritized before source-clue cards; source clues remain a separate lane.',
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
    row.round538ProofDepthUpgrade = true;
    row.round538ProofDepthUpgradeVersion = version;
    row.round538ProofDepthUpgradeAt = generatedAt;
    row.round538ProofDepthSource = 'six-agent-proof-depth-audit-plus-local-derivation';
    row.round538ProofDepthDiagnosis = payload.diagnosis;
    row.round538ProofDepthBoundaryNote = payload.boundaryNote;
    row.qualityFlags = Array.from(new Set([...(row.qualityFlags || []), 'round538-proof-depth-upgraded']));
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
    studentAnswerBoundary: 'Round538 stores student-facing proof/process answers in the bank and keeps diagnosis/boundary notes in the QA ledger; these notes are not strict original-answer PDF proof.',
    remainingBoundary: 'Round538 eighth batch upgrades 30 proof/process/practice rows after Round531-Round537; remaining suspicious proof rows stay in the next-round queue and must not be claimed complete.',
    qualityBoundary: 'Round538 treats conclusion-only proof answers, short formula-only answers, missing-boundary derivations, and method-only answer blocks as insufficient whenever a student-facing answer block is visible.',
    correctnessBoundary: 'Round538 records sign conventions, missing source parameters, source-equation discrepancies, and dimensional-boundary notes instead of forcing false certainty.',
    strictAnswerPdfProofBoundary: 'strictAnswerPdfProof remains separate; Round538 does not claim original-answer-PDF span/bbox/hash proof.'
  };
  writeJsonAndGzip(ledgerRel, ledger);
  writeText(docRel, buildDoc(ledger));
  console.log(JSON.stringify(ledger, null, 2));
  if (!ledger.ok) process.exitCode = 1;
}

main();
