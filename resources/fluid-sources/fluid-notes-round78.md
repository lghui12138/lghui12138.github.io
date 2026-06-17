# 流体力学笔记（逐页校录版）

---

### 第 1 页：绪言与连续介质假设

#### 绪言与课程导入
- 流体力学发展脉络：从阿基米德静力学到近现代动力学，再到边界层理论、粘性流体力学、计算流体力学。
- 课堂目标偏重物理图像、过程理解与公式推导的结合。

#### 连续介质假设
- 流体虽然由分子/原子构成，但在宏观分析中，把足够小而又包含大量分子的体元视作连续介质。
- 关键理解：
 1. 宏观控制体尺度远大于分子尺度；
 2. 在统计平均意义下，密度、压强、速度等物理量可视作连续场；
 3. 该假设是建立流体速度场、压强场和控制方程的基础。

### 第 2 页：欧拉/拉格朗日描述与加速度

#### 第一章 流体运动学

##### 1. 欧拉描述
- 以空间固定点为观察对象，用速度场表示流体运动：
- 公式：$U = U(x, y, z, t)$
- 适合描述整个流场分布，是本笔记采用的描述方式。

##### 2. 拉格朗日描述
- 以流体质点为跟踪对象，研究单个质点随时间的轨迹与速度变化。
- 强调“跟着质点走”，适合轨迹、历史效应和质点演化问题。

##### 3. 欧拉观点下的质点加速度
- 速度场：$U = U(x, y, z, t)$
- 物质导数（欧拉形式）可写为：
- $a = dU/dt = ∂U/∂t + u∂U/∂x + v∂U/∂y + w∂U/∂z$
- 其物理意义：
 - $∂U/∂t$：局部加速度；
 - $u∂U/∂x + v∂U/∂y + w∂U/∂z$：对流加速度。

#### 物质导数展开与表示形式
- 物质导数在矢量/标量表达上一致：
 - $Dρ/Dt = ∂ρ/∂t + u∂ρ/∂x + v∂ρ/∂y + w∂ρ/∂z$
 - $D\vec{U}/Dt = ∂\vec{U}/∂t + (u∂/∂x + v∂/∂y + w∂/∂z)\vec{U}$
- 该算符是连接控制体与质点的桥梁：先在空间变量上写局部变化，再加上随质点移动的对流变化。
- 加速度也可写成 $a = (Du/Dt, Dv/Dt, Dw/Dt)$，各分量展开后可直接带入 Euler 方程或 Navier–Stokes 方程的对流项部分。

##### 4. 速度梯度张量与应力意义
- 速度梯度张量 $∇v$ 拆为对称的应变率与反对称的旋转部分：$∇v = S + Ω$。
- 对称部分 $S_{ij} = 1/2(∂u_i/∂x_j + ∂u_j/∂x_i)$ 与粘性应力 $τ = 2μS$ 直接对应。
- 旋转部分 $Ω_{ij} = 1/2(∂u_i/∂x_j - ∂u_j/∂x_i)$ 与涡量 $ω = ∇ × v$ 保持一致，用于判断区域局部旋转强度。

---

### 第 3 页：旋转坐标系中的矢量导数与球坐标角速度

#### 旋转坐标系中的矢量导数
- 任一矢量可写为：

$$
\vec{A} = x\vec{i} + y\vec{j} + z\vec{k}
$$

- 在固定基矢下，时间导数可写为：

$$
\frac{d\vec{A}}{dt} = \frac{dx}{dt}\vec{i} + \frac{dy}{dt}\vec{j} + \frac{dz}{dt}\vec{k}
$$

- 当坐标系以角速度 $\vec{\omega}$ 旋转时，笔记给出的核心关系为：

$$
\left(\frac{d\vec{A}}{dt}\right)_{I} = \left(\frac{d\vec{A}}{dt}\right)_{R} + \vec{\omega} \times \vec{A}
$$

- 这是后续做相对运动、旋转参考系和曲线坐标系速度/加速度分解时的基础公式。

#### 球坐标下的速度与角速度线索
- 笔记写出的球坐标速度写法为：

$$
\vec{V} = \dot r\,\hat r + r\dot\theta\,\hat\theta + r\sin\theta\,\dot\varphi\,\hat\varphi
$$

- 由基矢随时间转动可得到一组角速度分解，笔记中较清楚的一式整理为：

$$
\vec{\omega} = \dot\varphi\cos\theta\,\hat r - \dot\varphi\sin\theta\,\hat\theta + \dot\theta\,\hat\varphi
$$

### 第 4 页：流线与迹线

#### 流线定义与方程
- 流线：某一时刻，曲线上各点切线方向与该点速度方向一致的曲线。
- 由 $d\vec r \times \vec u = 0$ 可得流线微分方程：

$$
\frac{dx}{u(x,y,z,t)} = \frac{dy}{v(x,y,z,t)} = \frac{dz}{w(x,y,z,t)}
$$

#### 迹线定义与方程
- 迹线：同一流体质点在不同时刻走过的真实路径。
- 迹线满足质点运动微分关系：

$$
dx = u(x,y,z,t)\,dt,\quad dy = v(x,y,z,t)\,dt,\quad dz = w(x,y,z,t)\,dt
$$

- 因而也可写成比例式：

$$
\frac{dx}{u(x,y,z,t)} = \frac{dy}{v(x,y,z,t)} = \frac{dz}{w(x,y,z,t)}
$$

---

### 第 5 页：例题与连续方程的积分/微分形式

#### 例 2：已知速度场 $u = kx, v = ky$
- 页首给出一题二维速度场例题，要求求流线方程，并求某一初始时刻指定质点的轨迹方程。
- 流线推导整理为：

$$
\frac{dx}{u} = \frac{dy}{v}
$$

$$
\frac{dx}{kx} = \frac{dy}{ky}
$$

$$
\frac{y}{x} = C
$$

- 轨迹方程部分写成：

$$
\frac{dx}{dt} = kx,\qquad \frac{dy}{dt} = ky
$$

$$
x = x_0 e^{kt},\qquad y = y_0 e^{kt}
$$

$$
\frac{y}{x} = \frac{y_0}{x_0}
$$

- 笔记中具体初值符号有一处改写痕迹，但“流线与轨迹在该例下都化为过原点射线族”的结构是清楚的。

#### 第四节：连续方程（质量守恒方程）
- 其中后部转入连续方程，引入控制体与控制面的质量守恒。
- 写出的积分形式为：

$$
\frac{d}{dt}\iiint_{cv} \rho\,dV + \iint_{cs} \rho\,\vec{u}\cdot d\vec{s} = 0
$$

- 结合高斯公式，笔记进一步转到微分形式：

$$
\frac{\partial \rho}{\partial t} + \nabla\cdot(\rho\vec{u}) = 0
$$

- 图示为一个控制体/控制面质量流入流出草图，用来说明“任意闭合控制体内的质量变化率 + 净流出质量流率 = 0”。

### 第 6 页：连续方程的物质导数形式与不可压条件

- 本页主要把连续方程改写成随体形式，并解释不可压缩条件。
- 可清晰辨认的核心式为：

$$
\frac{d\rho}{dt} + \rho(\nabla\cdot\vec{u}) = 0
$$

- 当密度不变，即

$$
\rho = \text{const}
$$

- 可进一步化为：

$$
\nabla\cdot\vec{u} = 0
$$

### 第 7 页：散度物理意义、流体分类与圆柱坐标连续方程

#### 散度定义
- 页首配有多幅“发散/汇聚/环流”示意图，用来解释散度的几何意义。
- 写出的定义式为：

$$
\nabla\cdot\vec{a} = \lim_{\Delta V\to 0}\frac{\iint \vec{a}\cdot d\vec{s}}{\Delta V}
$$

#### 流体分类笔记线索
- 笔记列出了若干按密度变化情况划分的情形，如“不均质可压”“不均质不可压”“均质可压”“均质不可压”等。

##### 分类补充
- 均质 vs. 不均质：均质流体每个时刻密度在空间上可视为常数（$\rho=\rho(t)$），不均质则允许 $\rho=\rho(\boldsymbol{x},t)$；第 7 页暗示水/空气可近似均质、海水层化则是典型不均质。
- 常见组合示例：均质+不可压对应多数液体近似，均质+可压常在可压气流/冲击中出现，不均质+不可压适用于多层海洋或含杂质流体，而不均质+可压则是最一般的动量控制体情况。

#### 圆柱坐标下的连续方程
- 页下半部通过圆柱坐标体积元质量平衡推导连续方程。
- 结合结构与质量通量项，整理出目标公式为：

$$
\frac{\partial \rho}{\partial t} + \frac{1}{r}\frac{\partial (\rho u_r r)}{\partial r} + \frac{1}{r}\frac{\partial (\rho u_\theta)}{\partial \theta} + \frac{\partial (\rho u_z)}{\partial z} = 0
$$

- 其中笔记中 $r$ 向项与 $\theta$ 向项旁边都有“流入/流出质量流率”标注。

### 第 8 页：流体微团运动分解与涡量—角速度关系

#### 第五节：变形及运动强度（Helmholtz 运动分解定理）
- 本页围绕流体微团在一点附近的局部运动展开，核心思想是：局部线性速度场可分解为平动、刚体转动与变形三部分。
- 写出的线性展开写法为：

$$
\vec{u}(\vec{r}) = \vec{U}(\vec{r}_0) + [\nabla \vec{U}]_0\cdot(\vec{r} - \vec{r}_0)
$$

#### 刚体转动分量与涡量
- 其中明确把局部刚体转动角速度与涡量联系起来，写出的关系为：

$$
\boldsymbol{\Omega} = \frac{1}{2}\nabla\times\vec{u} = \frac{1}{2}\boldsymbol{\omega}
$$

$$
\boldsymbol{\omega} = \nabla\times\vec{u} = 2\boldsymbol{\Omega}
$$

- 笔记还展开了刚体转动速度分量，说明 $\Omega_x, \Omega_y, \Omega_z$ 与速度梯度反对称部分的对应关系。

#### 局部速度梯度拆分

- 线性近似可写成 $\vec{u}(\vec{r}) = \vec{U}(\vec{r}_0) + [\nabla \vec{U}]_0 \cdot (\vec{r}-\vec{r}_0)$，其中 $[\nabla\vec U]$ 与位置偏差的乘积正是局部速度变化截面。
- 张量 $\nabla\vec U$ 可拆为对称部分 $E_{ij}=\frac{1}{2}(\partial u_i/\partial x_j + \partial u_j/\partial x_i)$（变形率）与反对称部分 $\Omega_{ij}=\frac{1}{2}(\partial u_i/\partial x_j - \partial u_j/\partial x_i)$（刚体转动）。
- 这一分解是 Helmholtz 运动定理的核心：局部流动等价于“平移+变形+旋转”，速度梯度矩阵给出 $\boldsymbol{\omega}=\nabla \times \vec{u}$、$\boldsymbol{\Omega}=\frac{1}{2}\boldsymbol{\omega}$ 的关系。

---

### 第 9 页：涡量说明、速度梯度矩阵与局部线性化

#### 涡量与局部转动
- 页首延续前页关于局部转动的讨论，用圆形微团示意图区分是否存在局部旋转。核心结论仍是涡量刻画流体微团的局部旋转强弱：

$$
\boldsymbol{\omega}=\nabla\times\mathbf{u}
$$

- 局部刚体转动角速度与涡量之间保持前页关系：

$$
\boldsymbol{\Omega}=\frac{1}{2}\boldsymbol{\omega}
$$

#### 速度梯度矩阵与局部线性化
- 其中后段转入一点邻域内速度场的线性近似：把局部速度写成平移项加上线性变化项。
- 速度梯度矩阵可写成

$$
A=\begin{bmatrix}
A_{11} & A_{12} & A_{13}\\
A_{21} & A_{22} & A_{23}\\
A_{31} & A_{32} & A_{33}
\end{bmatrix}
$$

- 本页的作用是为后续“线段伸长、夹角变化、主轴方向”铺垫：先把速度梯度写成矩阵，再分解为对称变形部分与反对称旋转部分。

---

### 第 10 页：梯度、散度、旋度算子复写

#### 梯度

$$
\nabla A = \left(
\frac{\partial A}{\partial x},\;
\frac{\partial A}{\partial y},\;
\frac{\partial A}{\partial z}
\right)
$$

#### 散度

$$
\nabla\cdot\mathbf{A} =
\frac{\partial a_x}{\partial x} +
\frac{\partial a_y}{\partial y} +
\frac{\partial a_z}{\partial z}
$$

#### 旋度

$$
\nabla\times\mathbf{A} =
\begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k}\\
\frac{\partial}{\partial x} &
\frac{\partial}{\partial y} &
\frac{\partial}{\partial z}\\
a_x & a_y & a_z
\end{vmatrix}
$$

- 本页几乎就是向量分析算子的课堂复写页，和连续方程、涡量定义、后续边界层/涡度题都能直接衔接。

### 第 11 页：线段相对变形、剪切应变与速度张量

#### 线段伸长与夹角变化
- 通过 $OM_1, OM_2$ 等线段在短时间 $dt$ 后的位置变化，讨论微团边长和夹角如何变化。
- 文字结构清楚：一部分对应法向伸长/压缩，另一部分对应剪切变形。

#### 剪切应变率关系
- 整理出的典型关系为：

$$
\varepsilon_{xy} =
\frac{1}{2}\left(
\frac{\partial u}{\partial y} +
\frac{\partial v}{\partial x}
\right)
$$

#### 二次型与速度张量线索
- 页下半部开始把局部线性速度场与二次型/速度张量联系起来，为下一页“主轴变换”做准备。
- 整理为：本页试图把局部变形状态写成关于 $x, y, z$ 的二次型，并借此寻找主方向。

### 第 12 页：二次曲面主轴、特征值与方向余弦

#### 一般二次型

$$
\Phi(x,y,z) = A_{11}x^2 + A_{22}y^2 + A_{33}z^2 + A_{12}xy + A_{13}xz + A_{23}yz = C
$$

#### 主轴条件
- 通过“把坐标轴转到主轴系”来消去混合项，其本质是对对称矩阵求特征值与特征向量。
- 整理出的方程组为：

$$
\begin{cases}
(A_{11}-\lambda)l + A_{12}m + A_{13}n = 0 \\
A_{12}l + (A_{22}-\lambda)m + A_{23}n = 0 \\
A_{13}l + A_{23}m + (A_{33}-\lambda)n = 0
\end{cases}
$$

- 对应的判据是：

$$
\det(A - \lambda I) = 0
$$

#### 方向余弦坐标变换
- 本页最后给出新旧坐标之间的方向余弦变换，说明主轴系下矩阵可对角化；这一思路与后续“主应变/主伸长率方向”完全一致。

---

### 第 13 页：坐标旋转、速度梯度张量与主轴分解

#### 新旧坐标速度分量关系
- 开头把速度分量写成方向余弦变换形式：

$$
u = l_1 u' + l_2 v' + l_3 w'
$$

$$
v = m_1 u' + m_2 v' + m_3 w'
$$

$$
w = n_1 u' + n_2 v' + n_3 w'
$$

- 配合 $x', y', z'$ 对 $x, y, z$ 的偏导关系，继续展开 $∂u/∂x, ∂v/∂x, ∂w/∂x$ 等项，目的是把速度梯度矩阵写到主轴系中。

#### 主值与矩阵对角化思路
- 整理出的核心结论是：当坐标轴沿主方向选取时，局部速度梯度（或变形率）矩阵可写成对角形式；回到原坐标系后可理解为相似变换。
- 整理出的矩阵结构为：

$$
A = L \Lambda L^T
$$

- 其中 $Λ = diag(λ_1, λ_2, λ_3)$ 表示主伸长率/主值，$L$ 由方向余弦组成。
- 页中还把方向余弦与偏导数链式关系写在一起。若用 $L$ 表示方向余弦矩阵，则速度梯度张量在新旧坐标间按相似变换改写：

$$
A' = L^T A L
$$

- 展开到分量时，可理解为“先把速度分量投影到新轴，再把空间偏导也投影到新轴”。典型项形如：

$$
\frac{\partial u'}{\partial x'}
=l_1l_1\frac{\partial u}{\partial x}
+l_1m_1\frac{\partial u}{\partial y}
+m_1l_1\frac{\partial v}{\partial x}
+m_1m_1\frac{\partial v}{\partial y}
+\cdots
$$

- 主轴选取的目的，是使新坐标系下的混合项消失，只留下三个主伸长率。

### 第 14 页：特征值、特征向量与相似对角化补充

#### 特征值定义
- 笔记显式写出：若存在非零向量 $x$ 使

$$
Ax = \lambda x
$$

则 $λ$ 为矩阵 $A$ 的特征值，$x$ 为对应特征向量。

#### 特征方程
- 随后把问题写成齐次线性方程组：

$$
(A - \lambda E)x = 0
$$

- 非零解存在的条件是：

$$
\det(A - \lambda E) = 0
$$

#### 相似矩阵与对角化
- 本页后半段转入“相似矩阵”与“由一组线性无关特征向量组成变换矩阵 $P$，从而把 $A$ 对角化”的思路。
- 本页实际上是在给上一页的“主轴变换”补线性代数基础：主方向就是特征向量，主值就是特征值。

### 第 15 页：典型平面剪切运动算例

#### 速度场设定
- 笔记以典型平面剪切运动为例，写出速度场主干：

$$
U = ay,\qquad V = 0,\qquad W = 0
$$

- 后续围绕该速度场讨论散度、旋度、速度梯度和主方向。

- 由该速度场可直接写出速度梯度矩阵：

$$
\nabla\mathbf{U}=
\begin{bmatrix}
0 & a & 0\\
0 & 0 & 0\\
0 & 0 & 0
\end{bmatrix}
$$

- 其散度为零：

$$
\nabla\cdot\mathbf{U}=0
$$

- 涡量只有 $z$ 向分量：

$$
\nabla\times\mathbf{U}=(0,0,-a)
$$

- 对称变形率张量和反对称旋转张量可分为：

$$
S=\frac{1}{2}
\begin{bmatrix}
0 & a & 0\\
a & 0 & 0\\
0 & 0 & 0
\end{bmatrix},
\qquad
\Omega=\frac{1}{2}
\begin{bmatrix}
0 & a & 0\\
-a & 0 & 0\\
0 & 0 & 0
\end{bmatrix}
$$

#### 例题
- 本页并不是单纯背公式，而是在做“从具体速度场出发，判断局部平移、刚体转动与变形”的完整算例。
- 从图示和演算顺序看，重点包括：
 - 由速度场求速度梯度矩阵；
 - 判断局部旋转项与对称变形项；
 - 用特征值/主轴思路解释微团几何变化。

### 第 16 页：第七节——无旋运动与速度势

#### 无旋运动定义
- 页首明确给出“无旋运动”的定义：

$$
\nabla \times \mathbf{U} = 0
$$

- 这意味着流场局部不存在净自旋，随后可引入速度势函数。

#### 速度势表示
- 本页把速度写成势函数梯度：

$$
\mathbf{U} = \nabla \phi
$$

- 并展开为分量式：

$$
 u = \frac{\partial \phi}{\partial x},\qquad v = \frac{\partial \phi}{\partial y},\qquad w = \frac{\partial \phi}{\partial z}
$$

#### Laplace 方程与边界条件提示
- 本页接下来强调：在无旋区域内，速度势不仅满足 $\vec{U}=\nabla\phi$，还必须是调和函数，即

$$
\nabla^2 \phi = 0
$$

- 若区域是多连通的，还要在势内叠加一个调和项来匹配各“洞”周围的循环量（例如角函数或对数函数），这正是页中“闭合曲线不能缩成点”的图示提示的关键：每一条回路都对应一个独立的常数差。

#### 单连通与多连通区域线索
- 下半页开始讨论单连通/多连通区域，并配图说明闭合曲线能否连续收缩成一点；这是后续判断速度势是否能在整个区域内单值成立的准备。
- 也就是说，这份笔记已经从“局部无旋”推进到“区域拓扑与势函数存在性”的层面。

---

### 第 17 页：无旋流与速度势

当区域内局部涡量为零且区域单连通时，速度势存在，围线积分为零，速度势满足路径无关：

$$
\varphi_P-\varphi_O=\int_O^P \vec{u}\cdot \mathrm{d}\vec{r},
\qquad
\oint \vec{u}\cdot \mathrm{d}\vec{r}=0
$$

- 若闭合曲线在区域内可连续缩成一点，则该闭合曲线上的环量为零；若区域内有孔洞或奇点，闭合曲线不能缩成一点时，围线积分可以保留为一个循环常数：

$$
\oint_{C_k}\vec{u}\cdot d\vec r=\Gamma_k
$$

- 因此多连通区域中的速度势可能出现多值性，需要单独记录每个孔洞对应的循环量。

### 第 18-19 页：不可压势流、平均值性质与唯一性

无旋且不可压时，速度势满足拉普拉斯方程：

$$
\nabla^2\varphi=0
$$

并可配合平均值性质与法向导数积分关系书写：

$$
\varphi(O)=\frac{1}{S}\int_S \varphi\,\mathrm{d}s,
\qquad
\oint_S \frac{\partial \varphi}{\partial n}\,\mathrm{d}s=0
$$

唯一性证明可写为两组解之差的能量式：

$$
\int_V \left|\nabla(\varphi-\varphi^*)\right|^2\mathrm{d}V=0
\Rightarrow
\varphi=\varphi^*+C
$$

- 这些式子共同说明：给定合适边界条件后，调和速度势的差只能是常数。

### 第 20 页：轨迹系统与物质导数例题

对速度场

$$
u=xt,
\qquad
v=yt,
\qquad
w=zt
$$

轨迹方程由

$$
\frac{\mathrm{d}x}{\mathrm{d}t}=xt,
\qquad
\frac{\mathrm{d}y}{\mathrm{d}t}=yt,
\qquad
\frac{\mathrm{d}z}{\mathrm{d}t}=zt
$$

积分得

$$
x(t)=x_0\mathrm{e}^{t^2/2},
\qquad
y(t)=y_0\mathrm{e}^{t^2/2},
\qquad
z(t)=z_0\mathrm{e}^{t^2/2}
$$

温度的物质导数为

$$
\frac{DT}{Dt}=\frac{\partial T}{\partial t}+xt\frac{\partial T}{\partial x}+yt\frac{\partial T}{\partial y}+zt\frac{\partial T}{\partial z}
$$

- 本页顺序为：先写欧拉速度场，再写质点轨迹微分方程，最后展开物质导数。

---

### 第 21 页：控制体上的标量输运关系

#### 例题
- 以“取一块流体，设 $\phi$ 为其上的标量”开头，目标是把随体积分形式改写为“局部变化 + 穿过控制面的通量”结构。
- 最终结论可以整理为：

$$
\frac{d}{dt}\int_V \rho\phi\,dV
= \int_V \frac{\partial (\rho\phi)}{\partial t}\,dV
+ \int_S \rho\phi\,\vec v\cdot\vec n\,dS
$$

#### 整理出的理解点
- 这一步本质上是控制体形式的输运定理写法，后面推连续方程、动量方程、能量方程都会反复用到。
- 本页推导里明确出现了“体积分项 + 散度/通量项”的拆法，最后借助 Gauss 公式改写成面积分。

### 第 22 页：第二章开始——作用在流体上的力

#### 体力与面力
- 标题可辨为：第二章 流体运动的基本方程，§1 作用在流体上的力。
- 首先把流体所受力分为两类：
 - 体力：作用在流体体积内部，例如重力；
 - 面力：通过接触面传递，包括法向作用和剪切作用。
 - 体力与流体所处空间位置有关，常按单位质量或单位体积给出；
 - 面力必须落在某个微小面元上讨论，因此要引入应力概念。

#### 压力与剪应力的进入方式
- 本页用示意图说明：对某一点附近的微小面元，既可能受法向压力，也可能受切向剪应力。

### 第 23 页：四面体受力分析与 Cauchy 应力定理

#### 方向余弦关系
- 本页明确画出了无穷小斜四面体，并将任意斜面 $S_n$ 与三个坐标面联系起来。
- 本页整理出的几何关系为：

$$
dS_x = n_x\,dS_n,\qquad dS_y = n_y\,dS_n,\qquad dS_z = n_z\,dS_n
$$

- 四面体高度趋于零时，体力和惯性力属于体积量，阶数为 $O(dV)$；面力属于面积量，阶数为 $O(dS)$。令小四面体收缩到一点后，体积量相对面积量可忽略，保留下来的就是各面应力向量的平衡关系。

#### 任意方向面上的应力向量
- 代入力平衡后，可以重录出核心式：

$$
\vec P_n = n_x\vec P_x + n_y\vec P_y + n_z\vec P_z
$$

- 这说明：只要知道经过该点的三个坐标面上的应力向量，就能确定任意方向斜面上的应力向量。

#### 分量展开与应力张量
- 本页接着把各向量分解到 $x,y,z$ 三轴，形成 9 个应力分量 $P_{ij}$。
- 整理为：

$$
P_{nx} = n_x P_{xx} + n_y P_{yx} + n_z P_{zx}
$$

$$
P_{ny} = n_x P_{xy} + n_y P_{yy} + n_z P_{zy}
$$

$$
P_{nz} = n_x P_{xz} + n_y P_{yz} + n_z P_{zz}
$$

- 因而任意方向面的应力向量可写成矩阵式：

$$
\begin{bmatrix}
P_{nx}\\
P_{ny}\\
P_{nz}
\end{bmatrix}
=
\begin{bmatrix}
P_{xx} & P_{xy} & P_{xz}\\
P_{yx} & P_{yy} & P_{yz}\\
P_{zx} & P_{zy} & P_{zz}
\end{bmatrix}
\begin{bmatrix}
n_x\\
n_y\\
n_z
\end{bmatrix}
$$

### 第 24 页：应力变换矩阵式与应力张量用法

#### 重点内容
- 继续归纳“应力变换矩阵式”，是对上一页结果的整理。
- 因而可写为：

$$
\vec P_n = \boldsymbol{P}\,\vec n
$$

- 其中 $\boldsymbol{P}$ 为应力张量，$\vec n=(n_x,n_y,n_z)^T$ 为斜面的单位法向量。

---

### 第 25 页：任意方向应力向量与主应力特征方程

#### 任意方向面上的应力向量
- 设受力面的单位法向量为

$$
\vec n = (l,m,n), \quad l^2+m^2+n^2=1
$$

- 该页把任意方向面的应力向量写成三个坐标面应力向量的线性组合：

$$
\vec P_n = l\vec P_x + m\vec P_y + n\vec P_z
$$

- 将坐标面应力向量分解到 $x,y,z$ 三轴，可得三条分量关系：

$$
lP_n = lP_{xx} + mP_{yx} + nP_{zx}
$$

$$
mP_n = lP_{xy} + mP_{yy} + nP_{zy}
$$

$$
nP_n = lP_{xz} + mP_{yz} + nP_{zz}
$$

#### 主应力条件
- 当某一方向上的应力向量与该方向法线同向时，该方向为主方向，对应法向应力为主应力。
- 因而本页的核心结论可以整理为：主应力满足应力张量的特征方程

$$
\det([P]-P_n I)=0
$$

### 第 26 页：主轴坐标系、应力变换与迹不变量

#### 主轴系下的应力矩阵
- 当坐标轴沿主方向选取时，应力张量退化为对角阵：

$$
[P]' = \operatorname{diag}(P_1, P_2, P_3)
$$

- 这说明主轴系中只有三个主应力，不再显式出现剪应力分量。

#### 坐标变换
- 笔记中用方向余弦矩阵把主轴系与原坐标系联系起来，其标准张量写法整理为：

$$
[P] = [L][P]'[L]^T
$$

- 展开后，原坐标系中的应力分量可由主应力和方向余弦表示，例如：

$$
P_{xx}=l_1^2P_1+l_2^2P_2+l_3^2P_3
$$

$$
P_{yy}=m_1^2P_1+m_2^2P_2+m_3^2P_3
$$

$$
P_{zz}=n_1^2P_1+n_2^2P_2+n_3^2P_3
$$

$$
P_{xy}=l_1m_1P_1+l_2m_2P_2+l_3m_3P_3
$$

#### 迹不变量
- 该页页末明确化为了一个很重要的不变量：

$$
P_{xx}+P_{yy}+P_{zz}=P_1+P_2+P_3
$$

- 这就是应力张量迹在坐标变换下保持不变的结论，可作为后续推导静压与平均正应力时的支点。

### 第 27 页：静止流体中的应力状态

#### 与压力的联系
- 若按常用流体力学符号约定，把压应力写成负号，则可写为：

$$
[P]=-p I
$$

- 这表明静止流体内部没有剪切应力，只有各向同性的静压。

### 第 28 页：应力—变形关系与线性各向同性本构式

#### 本构思想
- 页首已明显转入“应力和变形间的关系（本构）”主题。
- 笔记先回顾静压对应的各向同性部分，再把应力分解成“平均压力部分 + 偏应力部分”。

#### 线性各向同性假设
- 整理出的逻辑是假定：
 1. 应力与变形速率之间是线性关系；
 2. 材料在空间上各向同性；
 3. 偏应力与应变率张量共轴。

#### 标准整理式
- 结合这一路推导，整理为牛顿型流体的标准本构表达：

$$
P_{ij} = -p\delta_{ij} + 2\mu e_{ij} + \lambda e_{kk}\delta_{ij}
$$

- 其中应变率张量为：

$$
e_{ij}=\frac{1}{2}\left(\frac{\partial u_i}{\partial x_j}+\frac{\partial u_j}{\partial x_i}\right)
$$

- 对不可压缩流体，$e_{kk}=\nabla\cdot\vec v=0$，于是上式退化为：

$$
P_{ij}=-p\delta_{ij}+2\mu e_{ij}
$$

---

### 第 29 页：主应力、主方向与牛顿流体本构关系

#### 主应力与体膨胀项
- 本页把主方向上的三个主应力写成“静压项 + 体膨胀修正 + 线性粘性项”的结构，整理为：

$$
P_1 = -p - \frac{2}{3}\mu \nabla \cdot u + 2\mu \lambda_1
$$

$$
P_2 = -p - \frac{2}{3}\mu \nabla \cdot u + 2\mu \lambda_2
$$

$$
P_3 = -p - \frac{2}{3}\mu \nabla \cdot u + 2\mu \lambda_3
$$

- 这说明：在主轴坐标系下，应力张量可分解成各向同性压力部分与由主应变速率决定的粘性部分。

#### 从主轴系回到一般坐标系
- 中段把主应力对角阵通过方向余弦矩阵变换回一般坐标系，核心思想整理为：

$$
[P_{ij}] = [L] \, \operatorname{diag}(P_1,P_2,P_3) \, [L]^T
$$

- 继续把 $P_1,P_2,P_3$ 代回，可得到更直接的牛顿流体闭合关系：

$$
[P_{ij}] = (-p - \frac{2}{3}\mu \nabla \cdot u) I + 2\mu A_{ij}
$$

- 其中 $A_{ij}$ 表示与速度梯度对称部分相关的变形率张量；笔记下标细节按标准写法整理，但“各向同性压力 + 线性粘性张量”这一结构清楚。

### 第 30 页：应力矢量概念与动量方程

#### 应力矢量与张量表达
- 先强调“任意方向面上的面力不能只用一个标量压力描述”，因此必须引入应力矢量与应力张量。
- 结合控制体受力与高斯公式，可把动量方程整理成：

$$
\rho \frac{D u}{D t} = \nabla \cdot P + \rho f
$$

- 按分量展开，$x$ 方向可写成：

$$
\rho\frac{D u}{D t}=P_{fx}+\frac{\partial P_{xx}}{\partial x}+\frac{\partial P_{yx}}{\partial y}+\frac{\partial P_{zx}}{\partial z}
$$

- $y,z$ 方向可作同样写法；本页的重点不是背分量，而是明白“面力散度 + 体力”如何进入动量守恒。

#### 与 Navier–Stokes 的衔接
- 已经把后续 Navier–Stokes 方程的来源讲清：压强项来自各向同性法向应力，粘性项来自应力张量中的速度梯度部分。

### 第 31 页：动量方程常见简化与能量方程

#### 三类常见动量方程
- 本页顶部把同一条动量方程按流体模型做了三层简化：

$$
\rho\frac{D u}{D t}=\rho F-\nabla p+\mu\nabla^2 u+\frac{1}{3}\mu\nabla(\nabla\cdot u)
$$

$$
\rho\frac{D u}{D t}=\rho F-\nabla p+\mu\nabla^2 u
$$

$$
\rho\frac{D u}{D t}=\rho F-\nabla p
$$

- 第一式对应一般粘性流体，第二式对应不可压粘性流体，第三式对应理想流体/Euler 方程；这样一对照，后续做“是否可忽略粘性”“是否不可压”的题会更清楚。

#### 能量方程的推导
- 下半部分把动量方程与速度点乘，转入机械能/总能量守恒。
- 中间步骤围绕以下结构展开：
 - 先把动能变化率写成 $u \cdot Du/Dt$；
 - 再把压强功、体力功和粘性做功分别整理；
 - 最后得到控制体形式的能量方程。
- 重点是“动量方程 × 速度 = 能量方程基础”这条方法论，而不是孤立抄某一行中间变形。

### 第 32 页：运动边界条件与应力边界条件

#### 运动边界条件
- 先用一条随时间变化的边界面方程描述一般运动边界：

$$
F(x,y,z,t)=0
$$

- 对物质边界而言，边界点始终留在该曲面上，因此：

$$
\frac{dF}{dt}=0
$$

- 展开后得到关键的法向速度条件：

$$
\frac{\partial F}{\partial x}u + \frac{\partial F}{\partial y}v + \frac{\partial F}{\partial z}w + \frac{\partial F}{\partial t}=0
$$

- 本页文字还强调：对粘性流体与固壁，切向速度满足不滑移条件；对运动壁面，流体切向速度应与壁面切向速度相匹配。

#### 应力边界条件
- 本页后半部转入自由表面或两种流体交界面上的应力平衡，指出法向应力差与界面曲率、表面张力有关，切向应力则需满足界面切向平衡。

---

### 第 33 页：环流变化定理与压强梯度力影响（原 PDF 复校）

#### 第六节 环流变化定理

#### 一、环流定理

在流体中取一封闭物质线 $C$，环流定义为

$$
\Gamma=\oint_C\vec u\cdot d\vec r.
$$

考察该封闭物质线随时间的变化：

$$
\frac{d\Gamma}{dt}
=
\frac{d}{dt}\oint_C\vec u\cdot d\vec r
=
\oint_C\frac{d\vec u}{dt}\cdot d\vec r
+
\oint_C\vec u\cdot\frac{d}{dt}(d\vec r).
$$

右端第二项可化为

$$
\oint_C\vec u\cdot d\vec u
=
\oint_C d\left(\frac12u^2\right)
=0.
$$

于是

$$
\frac{d\Gamma}{dt}
=
\oint_C\frac{d\vec u}{dt}\cdot d\vec r.
$$

将均质流体的 Navier-Stokes 方程代入：

$$
\rho\frac{d\vec u}{dt}
=
\rho\vec F-\nabla p+\mu\nabla^2\vec u
+
\frac{\mu}{3}\nabla(\nabla\cdot\vec u).
$$

因此

$$
\frac{d\Gamma}{dt}
=
\oint_C\vec F\cdot d\vec r
-
\oint_C\frac{\nabla p}{\rho}\cdot d\vec r
+
\nu\oint_C\nabla^2\vec u\cdot d\vec r
+
\frac{\nu}{3}\oint_C\nabla(\nabla\cdot\vec u)\cdot d\vec r,
\qquad
\nu=\frac{\mu}{\rho}.
$$

若体积力有势，$\vec F=-\nabla\pi$，则

$$
\oint_C\vec F\cdot d\vec r
=
-\oint_C\nabla\pi\cdot d\vec r
=0.
$$

又因闭合曲线上梯度全微分积分为零，

$$
\oint_C\nabla(\nabla\cdot\vec u)\cdot d\vec r
=
\oint_C d(\nabla\cdot\vec u)
=0.
$$

故可得

$$
\frac{d\Gamma}{dt}
=
-
\oint_C\frac{\nabla p}{\rho}\cdot d\vec r
+
\nu\oint_C\nabla^2\vec u\cdot d\vec r.
$$

这说明环流变化主要由压强梯度力和粘性力控制；在均质、体积力有势且无粘情形，环流守恒。

#### 二、压强梯度力对环流的影响

记压强梯度项为

$$
I_p=-\oint_C\frac{\nabla p}{\rho}\cdot d\vec r.
$$

由 Stokes 公式，

$$
I_p=
-\iint_A\nabla\times\left(\frac{\nabla p}{\rho}\right)\cdot d\vec A.
$$

而

$$
\nabla\times\left(\frac{\nabla p}{\rho}\right)
=
\nabla\left(\frac1\rho\right)\times\nabla p
=
-\frac{\nabla\rho\times\nabla p}{\rho^2}.
$$

故

$$
I_p=
\iint_A\frac{\nabla\rho\times\nabla p}{\rho^2}\cdot d\vec A.
$$

因此若 $\nabla\rho$ 与 $\nabla p$ 不平行，压强梯度力可改变环流。

#### 三、正压流体与斜压流体

正压流体中密度只是压强的函数：

$$
\rho=\rho(p).
$$

此时等密面与等压面重合，

$$
\nabla\rho\parallel\nabla p,
$$

所以

$$
\nabla\rho\times\nabla p=0,
$$

压强梯度力不能改变环流。

斜压流体中密度不只是压强的函数，例如

$$
\rho=\rho(p,T),\qquad p=\rho RT.
$$

当温度变化不能忽略时，$\nabla\rho$ 与 $\nabla p$ 一般不平行，压强梯度力可能形成或改变环流。

### 第 34 页：影响环度的五大因素（原 PDF 复校）

原页标题为“主要影响涡度的五大因素”，并配有五个示意图。可辨认出的五项为：

1. 体积力无势；
2. 斜压流体；
3. 粘性扩散；
4. 变形惯量特性；
5. 斜截。

这五项分别对应前页环流方程中体积力项、压强梯度项、粘性项，以及物质线/面元随流体变形时对环量或涡量分布的改变。

### 第 35 页：理想流体中的应力与 Euler 方程（原 PDF 复校）

#### 第三章 理想流体动力学

#### 第一节 理想流体运动微分方程

#### 一、理想流体中的应力

理想流体中任意面上的切应力均为零：

$$
P_{xy}=P_{xz}=P_{yx}=P_{yz}=P_{zx}=P_{zy}=0.
$$

因此流体中只有法向应力。若面元外法向为 $\hat n$，则

$$
\vec P_n=P_n\hat n.
$$

由此有

$$
P_{nx}=P_n n_x,\qquad
P_{ny}=P_n n_y,\qquad
P_{nz}=P_n n_z.
$$

另一方面，应力矢量与应力张量的分量关系为

$$
\begin{cases}
P_{nx}=n_xP_{xx}+n_yP_{yx}+n_zP_{zx},\\
P_{ny}=n_xP_{xy}+n_yP_{yy}+n_zP_{zy},\\
P_{nz}=n_xP_{xz}+n_yP_{yz}+n_zP_{zz}.
\end{cases}
$$

因切应力为零，上式化为

$$
P_{nx}=n_xP_{xx},\qquad
P_{ny}=n_yP_{yy},\qquad
P_{nz}=n_zP_{zz}.
$$

与 $\vec P_n=P_n\hat n$ 比较，得

$$
P_{xx}=P_{yy}=P_{zz}=P_n.
$$

若把压强按压应力取正，则理想流体应力张量写为

$$
P_{xx}=P_{yy}=P_{zz}=-p,\qquad
\mathbf P=-p\mathbf I.
$$

#### 二、理想流体中的运动方程

由 Navier-Stokes 方程在理想流体条件下取极限，可得 Euler 方程：

$$
\frac{\partial\vec u}{\partial t}
+
(\vec u\cdot\nabla)\vec u
=
\vec F-\frac1\rho\nabla p.
$$

其分量形式为

$$
\begin{cases}
\dfrac{\partial u}{\partial t}
+u\dfrac{\partial u}{\partial x}
+v\dfrac{\partial u}{\partial y}
+w\dfrac{\partial u}{\partial z}
=F_x-\dfrac1\rho\dfrac{\partial p}{\partial x},\\[4pt]
\dfrac{\partial v}{\partial t}
+u\dfrac{\partial v}{\partial x}
+v\dfrac{\partial v}{\partial y}
+w\dfrac{\partial v}{\partial z}
=F_y-\dfrac1\rho\dfrac{\partial p}{\partial y},\\[4pt]
\dfrac{\partial w}{\partial t}
+u\dfrac{\partial w}{\partial x}
+v\dfrac{\partial w}{\partial y}
+w\dfrac{\partial w}{\partial z}
=F_z-\dfrac1\rho\dfrac{\partial p}{\partial z}.
\end{cases}
$$

#### 例：截面均匀直角管中的水柱运动

设直角管截面均匀，内盛不可压理想流体。打开 $B$ 后，管内速度只随时间变化，记为 $u=u(t)$。沿竖直段与水平段分别列 Euler 方程，可写为

$$
-\frac{du}{dt}
=
-g-\frac1\rho\frac{dP}{dy},
\qquad
\frac{du}{dt}
=
-\frac1\rho\frac{dP'}{dx}.
$$

积分得

$$
P=-\rho\left(g-\frac{du}{dt}\right)y+C_1,
\qquad
P'=-\rho\frac{du}{dt}x+C_2.
$$

由自由液面压力条件与连接处速度连续，可得液面高度 $y_0(t)$ 满足

$$
\frac{d^2y_0}{dt^2}
+
\frac{g}{a+b}y_0=0.
$$

因此

$$
y_0=A\cos\left(\sqrt{\frac{g}{a+b}}\,t+B\right).
$$

若初始条件为 $t=0$ 时 $y_0=a$、$\dot y_0=0$，则

$$
y_0=a\cos\left(\sqrt{\frac{g}{a+b}}\,t\right).
$$

### 第 36 页：Euler 方程的 Lamb 形式（原 PDF 复校）

#### 三、欧拉方程的变形：Lamb 方程

利用矢量恒等式

$$
\nabla(\vec A\cdot\vec B)
=
(\vec B\cdot\nabla)\vec A
+
(\vec A\cdot\nabla)\vec B
+
\vec B\times(\nabla\times\vec A)
+
\vec A\times(\nabla\times\vec B).
$$

令 $\vec A=\vec B=\vec u$，并记 $u=|\vec u|$，则

$$
\nabla\left(\frac{u^2}{2}\right)
=
(\vec u\cdot\nabla)\vec u
+
\vec u\times(\nabla\times\vec u).
$$

所以

$$
(\vec u\cdot\nabla)\vec u
=
\nabla\left(\frac{u^2}{2}\right)
+
(\nabla\times\vec u)\times\vec u.
$$

代入 Euler 方程得

$$
\frac{\partial\vec u}{\partial t}
+
\nabla\left(\frac{u^2}{2}\right)
+
(\nabla\times\vec u)\times\vec u
=
\vec F-\frac1\rho\nabla p.
$$

#### 正压流体中的压强函数

若要把 $\rho^{-1}\nabla p$ 写成一个梯度，需要满足正压条件：

$$
\rho=\rho(p).
$$

此时可定义压强函数

$$
P=\int\frac{dp}{\rho},
$$

从而

$$
\nabla P=\frac1\rho\nabla p.
$$

沿任意微元位移 $d\vec r$，也可写成

$$
\nabla P\cdot d\vec r
=
\frac1\rho\nabla p\cdot d\vec r
=
\frac1\rho\,dp.
$$

若体积力有势，

$$
\vec F=-\nabla\pi,
$$

则 Euler 方程化为

$$
\frac{\partial\vec u}{\partial t}
+
\nabla\left(\frac{u^2}{2}+P+\pi\right)
+
(\nabla\times\vec u)\times\vec u
=0.
$$

记

$$
E=\frac{u^2}{2}+P+\pi,
\qquad
\vec\omega=\nabla\times\vec u,
$$

便得到 Lamb 方程：

$$
\frac{\partial\vec u}{\partial t}
+
\nabla E
+
\vec\omega\times\vec u
=0.
$$

---

### 第 37 页：系统和控制体积，雷诺输运定理（原 PDF 复校）

#### 第二节 系统和控制体积，雷诺输运定理

前面多是微分方程，反映流场中每一点的变化。本节改用系统与控制体积的观点，便于处理进出口截面和工程守恒问题。

设 $\Phi(\vec r,t)$ 为某一流体物理量的体密度，物质系统在时刻 $t$ 占据体积 $\tau(t)$。要求

$$
\frac{d}{dt}\int_{\tau(t)}\Phi\,d\tau,
$$

即求该物理量在同一批流体质点中的变化率。

#### 雷诺输运定理推导

在 $t$ 与 $t+\delta t$ 两个时刻，物质系统所占据区域发生变化。图中把区域分为三部分：$I$ 为流入部分，$II$ 为控制体积内共同部分，$III$ 为流出部分。于是

$$
\frac{d}{dt}\int_{\tau(t)}\Phi\,d\tau
=
\lim_{\delta t\to 0}\frac{1}{\delta t}
\left[
\int_{\tau(t+\delta t)}\Phi(\vec r,t+\delta t)\,d\tau
-
\int_{\tau(t)}\Phi(\vec r,t)\,d\tau
\right].
$$

按图中 $I,II,III$ 分区展开。令

$$
\Delta_{\delta t}
=
\int_{II}\Phi(\vec r,t+\delta t)\,d\tau
+
\int_{III}\Phi(\vec r,t+\delta t)\,d\tau
-
\int_I\Phi(\vec r,t)\,d\tau
-
\int_{II}\Phi(\vec r,t)\,d\tau.
$$

则

$$
\frac{d}{dt}\int_{\tau(t)}\Phi\,d\tau
=
\lim_{\delta t\to 0}
\frac{\Delta_{\delta t}}{\delta t}.
$$

第一项的平均值定理给出控制体内的局地变化：

$$
\lim_{\delta t\to 0}
\frac{1}{\delta t}
\int_{II}
\left[\Phi(\vec r,t+\delta t)-\Phi(\vec r,t)\right]d\tau
=
\int_{CV}\frac{\partial \Phi}{\partial t}\,d\tau.
$$

$III$ 区表示经控制面流出的量，$I$ 区表示经控制面流入的量。若 $\hat n$ 为控制面的外法向，则两者合并为净流出通量：

$$
\int_{CS}\Phi\,\vec u\cdot\hat n\,dS.
$$

整理得雷诺输运定理：

$$
\frac{d}{dt}\int_{\tau(t)}\Phi\,d\tau
=
\int_{CV}\frac{\partial\Phi}{\partial t}\,d\tau
+
\int_{CS}\Phi\,\vec u\cdot\hat n\,dS.
$$

其中 $CV$ 为固定控制体积，$CS$ 为围定控制体积的控制面；当 $\vec u\cdot\hat n>0$ 时表示流出，$\vec u\cdot\hat n<0$ 时表示流入。

### 第 38 页：质量守恒与能量守恒（原 PDF 复校）

#### 一、用雷诺输运定理写质量守恒

总质量为

$$
M=\int_{\tau}\rho\,d\tau,
$$

质量守恒表述为

$$
\frac{dM}{dt}=0.
$$

令 $\Phi=\rho$，代入雷诺输运定理得

$$
\int_{CV}\frac{\partial\rho}{\partial t}\,d\tau
+
\int_{CS}\rho\,\vec u\cdot\hat n\,dS=0.
$$

这就是雷诺形式下的一般质量守恒。若为定常情形，$\partial\rho/\partial t=0$，于是

$$
\int_{CS}\rho\,\vec u\cdot\hat n\,dS=0.
$$

对细管取入口截面 $S_1$、出口截面 $S_2$ 和封闭管壁 $S_3$ 为控制面，管壁无穿透通量。若截面上物理量近似均匀，则

$$
-\rho_1u_1S_1+\rho_2u_2S_2=0,
$$

即

$$
\rho_1u_1S_1=\rho_2u_2S_2,
\qquad
\rho uS=\text{const}.
$$

#### 二、能量守恒

由热力学第一定律，

$$
\frac{dE}{dt}=\frac{\delta W}{dt}+\frac{\delta Q}{dt},
$$

其中 $\delta W/dt$ 为功率，$\delta Q/dt$ 为加热率。总能量写为

$$
E=\int_{\tau}\rho\left(e+\frac12u^2+\pi\right)d\tau,
$$

重力作用下取

$$
\pi=gz.
$$

理想流体边界压力做功为

$$
\frac{\delta W}{dt}
=
\int_S\vec P_n\cdot\vec u\,dS
=
-\int_S p\,\vec u\cdot\hat n\,dS.
$$

热通量项写为

$$
\frac{\delta Q}{dt}
=
-\int_S\vec q\cdot\hat n\,dS.
$$

因此系统能量方程为

$$
\frac{d}{dt}
\int_{\tau}\rho\left(e+\frac12u^2+\pi\right)d\tau
=
-\int_S p\,\vec u\cdot\hat n\,dS
-
\int_S\vec q\cdot\hat n\,dS.
$$

由雷诺输运定理得到控制体形式：

$$
\int_{CV}\frac{\partial}{\partial t}
\left[
\rho\left(e+\frac12u^2+gz\right)
\right]d\tau
+
\int_{CS}\rho\left(e+\frac12u^2+gz\right)
\vec u\cdot\hat n\,dS
=
-\int_{CS}p\,\vec u\cdot\hat n\,dS
-
\int_{CS}\vec q\cdot\hat n\,dS.
$$

特别地，在定常绝热，即 $\vec q=0$ 的情形，

$$
\int_{CS}\rho\left(e+\frac12u^2+gz\right)
\vec u\cdot\hat n\,dS
=
-\int_{CS}p\,\vec u\cdot\hat n\,dS.
$$

若两截面上物理量均匀，则

$$
-\rho_1S_1u_1\left(e_1+\frac12u_1^2+gz_1\right)
+
\rho_2S_2u_2\left(e_2+\frac12u_2^2+gz_2\right)
=
p_1S_1u_1-p_2S_2u_2.
$$

再由质量守恒 $\rho_1S_1u_1=\rho_2S_2u_2$，可化为

$$
e_1+\frac{p_1}{\rho_1}+\frac12u_1^2+gz_1
=
e_2+\frac{p_2}{\rho_2}+\frac12u_2^2+gz_2.
$$

### 第 39 页：动量定理、动量矩定理与弯管受力（原 PDF 复校）

#### 第四节 动量和动量矩定理

#### 一、动量定理

对物质体，动量定理写为

$$
\frac{d}{dt}\int_{\tau}\rho\vec u\,d\tau
=
\int_{\tau}\rho\vec F\,d\tau
+
\int_{S}\vec P_n\,dS.
$$

由雷诺输运定理可化为控制体形式：

$$
\int_{CV}\frac{\partial(\rho\vec u)}{\partial t}\,d\tau
+
\int_{CS}\rho\vec u(\vec u\cdot\hat n)\,dS
=
\int_{CV}\rho\vec F\,d\tau
+
\int_{CS}\vec P_n\,dS.
$$

对理想流体，面力为

$$
\vec P_n=-p\hat n,
$$

所以定常时常写成

$$
\int_{CS}\rho\vec u(\vec u\cdot\hat n)\,dS
=
\int_{CV}\rho\vec F\,d\tau
-
\int_{CS}p\hat n\,dS.
$$

#### 二、动量矩定理

对同一物质体取矩，有

$$
\frac{d}{dt}\int_{\tau}\rho\,\vec r\times\vec u\,d\tau
=
\int_{\tau}\rho\,\vec r\times\vec F\,d\tau
+
\int_S\vec r\times\vec P_n\,dS.
$$

用雷诺输运定理写成控制体形式：

$$
\int_{CV}\frac{\partial}{\partial t}
\left(\rho\,\vec r\times\vec u\right)d\tau
+
\int_{CS}\rho(\vec r\times\vec u)(\vec u\cdot\hat n)\,dS
=
\int_{CV}\rho\,\vec r\times\vec F\,d\tau
+
\int_{CS}\vec r\times\vec P_n\,dS.
$$

#### 例：水平弯管所受力

图中取管内流体为控制体，进出口截面为 $S_1,S_2$，管壁为 $S_3$，设进出口速度在各自截面上均匀。入口取

$$
\vec u_1=u_1\vec i,\qquad \hat n_1=-\vec i,
$$

出口方向与 $x$ 轴夹角为 $\varphi$，于是

$$
\hat n_2=\cos\varphi\,\vec i+\sin\varphi\,\vec j,\qquad
\vec u_2=u_2\hat n_2.
$$

管壁对控制体的作用力记为

$$
\vec R=R_x\vec i+R_y\vec j+R_z\vec k.
$$

定常动量方程可列为

$$
-\rho g\tau\,\vec k
-p_1(-\vec i)A_1
-p_2\hat n_2 A_2
-\vec R
=
\rho\vec u_1(\vec u_1\cdot\hat n_1)A_1
+
\rho\vec u_2(\vec u_2\cdot\hat n_2)A_2.
$$

整理得弯管反力分量：

$$
\begin{cases}
R_x=p_1A_1-p_2A_2\cos\varphi
+\rho\left(A_1u_1^2-A_2u_2^2\cos\varphi\right),\\[4pt]
R_y=-p_2A_2\sin\varphi-\rho A_2u_2^2\sin\varphi,\\[4pt]
R_z=-\rho g\tau.
\end{cases}
$$

### 第 40 页：定常正压运动中的伯努利方程（原 PDF 复校）

#### 第五节 定常正压运动中的伯努利方程

由 Lamb 方程

$$
\frac{\partial\vec u}{\partial t}
+
\nabla E
+
\vec\omega\times\vec u=0,
\qquad
E=\frac{u^2}{2}+P+\pi,
\qquad
P=\int\frac{dp}{\rho}.
$$

对定常运动，

$$
\frac{\partial\vec u}{\partial t}=0,
\qquad
\nabla E+\vec\omega\times\vec u=0.
$$

#### 1. 沿流线的 Bernoulli 常数

将上式与速度 $\vec u$ 点乘，有

$$
\vec u\cdot\nabla E=0.
$$

沿流线方向有

$$
\frac{\vec u}{u}\cdot\nabla E=\frac{dE}{ds},
$$

所以

$$
\frac{dE}{ds}=0.
$$

这说明在定常、正压、有势力的理想流体运动中，同一条流线上

$$
E=\frac{u^2}{2}+P+\pi=C.
$$

若为均质不可压流体，$P=p/\rho$；若体力为重力，$\pi=gz$，则

$$
\frac{u^2}{2}+\frac{p}{\rho}+gz=C.
$$

工程上常除以 $g$ 写成水头形式：

$$
H=\frac{E}{g}
=
\frac{u^2}{2g}+\frac{p}{\rho g}+z=C.
$$

#### 2. 沿涡线的 Bernoulli 常数

将定常 Lamb 方程与涡量 $\vec\omega$ 点乘，因为

$$
\vec\omega\cdot(\vec\omega\times\vec u)=0,
$$

可得

$$
\vec\omega\cdot\nabla E=0.
$$

沿涡线方向有

$$
\frac{\vec\omega}{\omega}\cdot\nabla E=\frac{dE}{dl},
$$

故

$$
\frac{dE}{dl}=0.
$$

即同一条涡线上 $E$ 也为常数。

#### 3. 全场同一常数的条件

本页图示强调：一般情形只能说沿同一流线或同一涡线 $E$ 不变；若要推广到整个连通区域，需要额外条件。常见充分条件为

$$
\vec\omega=0
$$

或

$$
\vec u\parallel\vec\omega.
$$

第一种是全场无旋；第二种是速度线与涡线重合的螺旋流情形。满足这些条件时，可在相应连通区域内取

$$
\nabla E=0,\qquad E=C.
$$

---

### 第 41-42 页：皮托测速、小孔出流与无旋非定常伯努利（原 PDF 复校）

### 一、皮托管测流速

若孔 1 为流经孔，孔 2 为皮托管测得的滞止压处，并取

$$
z_1\approx z_2,\qquad u_2=0,
$$

则伯努利方程给出

$$
\frac{p_1}{\rho g}+\frac{u_1^2}{2g}+z_1
=
\frac{p_2}{\rho g}+z_2.
$$

因此

$$
u_1=\sqrt{\frac{2(p_2-p_1)}{\rho}}.
$$

若总压与静压通过水银压差计读取，且两测点等高，则

$$
p_2-p_1=(\rho_{Hg}-\rho_w)g\,\Delta h,
$$

水管中的速度可写成

$$
u_1=\sqrt{2g\,\Delta h\left(\frac{\rho_{Hg}}{\rho_w}-1\right)}.
$$

### 二、小孔出流

若容器很大、自由面速度近似为零、孔口与自由面高度差为 $h$，则

$$
\frac12u_B^2=gh,
\qquad
u_B=\sqrt{2gh}.
$$

这里隐含的条件是：自由面与孔口同接大气压，忽略粘性损失，并沿同一条近似理想、不可压、定常流线使用伯努利方程。

#### 第六节 无旋运动中的伯努利方程

对无旋运动，速度可写为

$$
\vec u=\nabla\phi,
$$

从而

$$
\frac{\partial\vec u}{\partial t}
=\nabla\left(\frac{\partial\phi}{\partial t}\right),
\qquad
\vec\omega=0.
$$

代入 Lamb 方程得

$$
\nabla\left(\frac{\partial\phi}{\partial t}
+\frac12u^2+P+\pi\right)=0.
$$

因此

$$
\frac{\partial\phi}{\partial t}+\frac12u^2+P+\pi=F(t).
$$

由于速度势可差一个只含时间的函数，常把 $F(t)$ 吸收到势函数中，写成

$$
\frac{\partial\phi}{\partial t}+\frac12u^2+P+\pi=0.
$$

连续方程与速度势联立时，一般流体有

$$
\frac{\partial\rho}{\partial t}+\nabla\cdot(\rho\nabla\phi)=0.
$$

若均质不可压，则

$$
\nabla^2\phi=0.
$$

例：理想不可压流体在重力作用下从大容器经管道流出。沿管道取两点 $A,B$，若管内速度近似均匀为 $u(t)$，管长为 $l$，则可取

$$
\phi_B=\phi_A+\int_A^B u(t)\,dx,
$$

故

$$
\frac{\partial\phi_B}{\partial t}
=\frac{\partial\phi_A}{\partial t}+l\frac{du}{dt}.
$$

将无旋非定常伯努利方程用于 $A,B$ 两点，可得

$$
l\frac{du}{dt}+\frac12u^2=gh.
$$

若 $t=0$ 时 $u=0$，其解可写成

$$
u(t)=\sqrt{2gh}\tanh\left(\frac{\sqrt{2gh}}{2l}t\right).
$$

当 $t\to\infty$ 时，$u\to\sqrt{2gh}$，即趋于小孔出流速度。

### 第 43-44 页：流体力学平衡与平面势流引入（原 PDF 复校）

#### 第七节 流体力学平衡

### 一、平衡方程

在静止状态下，理想流体和粘性流体都不再区分粘性与非粘性。对静止流体微元，体积力和面积力平衡：

$$
\int_V \rho\vec F\,dV-\int_S p\hat n\,dS=0.
$$

由高斯公式

$$
\int_S p\hat n\,dS=\int_V\nabla p\,dV,
$$

因控制体任意，得到平衡方程

$$
\rho\vec F=\nabla p.
$$

写成分量形式即

$$
\frac{\partial p}{\partial x}=\rho F_x,\qquad
\frac{\partial p}{\partial y}=\rho F_y,\qquad
\frac{\partial p}{\partial z}=\rho F_z.
$$

要使压强场存在，相应的力场需满足相容条件。若体积力有势，

$$
\vec F=-\nabla\pi,
$$

则

$$
-\rho\,d\pi=dp,
$$

或写成

$$
d\pi=-\frac{1}{\rho}dp.
$$

积分形式为

$$
\pi+\int\frac{dp}{\rho}=C.
$$

对均质不可压流体，

$$
\pi+\frac{p}{\rho}=C.
$$

### 二、流体平衡状态实例

大气静力近似下，若重力势取

$$
\pi=gz,
$$

则

$$
gz+\int\frac{dp}{\rho}=C.
$$

等温大气中 $p/\rho$ 为常数，故可得

$$
g(z_2-z_1)=\frac{p_0}{\rho_0}\ln\frac{p_1}{p_2}.
$$

若把均质不可压流体球作为静平衡补例，径向平衡仍写为

$$
\frac{dp}{dr}=-\rho g(r).
$$

均质球内

$$
M(r)=\frac{4}{3}\pi\rho r^3,\qquad
g(r)=\frac{GM(r)}{r^2}=\frac{4}{3}\pi G\rho r,
$$

故

$$
\frac{dp}{dr}=-\frac{4}{3}\pi G\rho^2 r.
$$

若球半径为 $R$，表面压强为 $p_s$，则

$$
p(r)=p_s+\frac{2}{3}\pi G\rho^2(R^2-r^2),
\qquad
p(0)=p_s+\frac{2}{3}\pi G\rho^2R^2.
$$

对随容器等角速度 $\omega$ 绕铅直轴转动的均质不可压流体，在随体坐标中可视为静止。离轴线半径为 $r$ 处的离心力为

$$
\omega^2r\,\hat r.
$$

于是压强分布可写为

$$
p=-\rho gz+\frac12\rho\omega^2r^2+C.
$$

若在自由液面上 $p=\text{const}$，则有

$$
z=z_0+\frac{\omega^2r^2}{2g},
$$

即自由液面为绕轴对称抛物面。
若圆柱容器半径为 $a$，静止时液面高度为 $h$，由体积守恒

$$
\pi a^2h=\int_0^a 2\pi r z_s(r)\,dr
$$

得

$$
z_0=h-\frac{\omega^2a^2}{4g},
$$

从而自由液面也可写成

$$
z_s(r)=h+\frac{\omega^2}{2g}\left(r^2-\frac{a^2}{2}\right).
$$

#### 第四章 理想不可压流体平面无旋运动

本章讨论均质不可压流体的平面无旋运动。速度势满足拉普拉斯方程

$$
\nabla^2\phi=0.
$$

特别注意势函数的可叠加性：若

$$
\nabla^2\phi_1=0,\qquad \nabla^2\phi_2=0,
$$

则

$$
\nabla^2(\phi_1+\phi_2)=0.
$$

### 第 45-46 页：理想不可压平面无旋流动的流函数与 Stokes 流函数（原 PDF 复校）

#### 第一节 流函数

### 一、直角坐标中的流函数

对不可压平面运动，有连续方程

$$
\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}=0.
$$

可令

$$
d\psi=-v\,dx+u\,dy,
$$

即

$$
u=\frac{\partial\psi}{\partial y},\qquad
v=-\frac{\partial\psi}{\partial x}.
$$

于是

$$
\psi_P=\psi_O+\int_O^P (u\,dy-v\,dx).
$$

若曲线段的单位法向为 $\hat n$，则单位时间内自曲线 $OP$ 通过的流量为

$$
Q=\int_O^P \vec u\cdot \hat n\,ds
=\int_O^P (u n_x+v n_y)\,ds
=\int_O^P (u\,dy-v\,dx)
=\psi_P-\psi_O.
$$

因此，平面两条流线之间的流函数差等于单位厚度上的流量。

### 二、流函数的性质

流函数可相差一个常数而不改变速度场。

在同一条流线上，流函数为常数。由流线方程

$$
\frac{dx}{u}=\frac{dy}{v},
$$

得

$$
-v\,dx+u\,dy=0.
$$

又因

$$
d\psi=\frac{\partial\psi}{\partial x}\,dx+
\frac{\partial\psi}{\partial y}\,dy
=-v\,dx+u\,dy,
$$

故沿流线有

$$
d\psi=0,\qquad \psi=C.
$$

在单连通区域内，若

$$
\oint d\psi=\oint (u\,dy-v\,dx)=0,
$$

则 $\psi$ 为单值函数，且积分只与端点有关。

在多连通区域内，若闭曲线所围区域中存在源、汇等奇点，积分可与路径有关。此时不同路径 $C_1,C_2$ 由 $O$ 到 $P$ 得到的流函数值可能不同，其差值对应两路径之间夹带区域的流量。

### 三、Stokes 流函数：柱坐标、球坐标推广

#### 1. 柱坐标下的轴对称流动

对轴对称流动，若 $u_\theta=0$，连续方程为

$$
\frac{\partial u_z}{\partial z}
+\frac1r\frac{\partial (r u_r)}{\partial r}=0.
$$

可令

$$
d\psi=r u_z\,dr-r u_r\,dz,
$$

于是

$$
u_r=-\frac1r\frac{\partial\psi}{\partial z},
\qquad
u_z=\frac1r\frac{\partial\psi}{\partial r}.
$$

从 $O$ 到 $P$ 的 Stokes 流函数可写为

$$
\psi_P=\psi_O+\int_O^P (r u_z\,dr-r u_r\,dz).
$$

该式对应轴对称流动中通过旋转曲面的流量表达，和直角坐标中的平面流函数类似，但积分元中带有半径 $r$。

#### 2. 球坐标下的轴对称流动

在球坐标中，若 $u_\varphi=0$，连续方程可写成

$$
\frac1{R^2}\frac{\partial(R^2u_R)}{\partial R}
+\frac1{R\sin\theta}
\frac{\partial(u_\theta\sin\theta)}{\partial\theta}=0.
$$

相应地可取

$$
d\psi=u_R R^2\sin\theta\,d\theta
-u_\theta R\sin\theta\,dR,
$$

从而

$$
u_R=\frac1{R^2\sin\theta}\frac{\partial\psi}{\partial\theta},
\qquad
u_\theta=-\frac1{R\sin\theta}\frac{\partial\psi}{\partial R}.
$$

---

### 第 47-48 页：平面无旋流动的复位势、复速度与驻点流（原 PDF 复校）

#### 第二节 均质不可压平面无旋运动的复位势

### 一、速度势与流函数的关系

对平面无旋运动，速度势满足

$$
u=\frac{\partial\phi}{\partial x},\qquad
v=\frac{\partial\phi}{\partial y}.
$$

又由流函数定义

$$
u=\frac{\partial\psi}{\partial y},\qquad
v=-\frac{\partial\psi}{\partial x}.
$$

于是 $\phi$ 与 $\psi$ 满足 Cauchy-Riemann 条件：

$$
\frac{\partial\phi}{\partial x}
=\frac{\partial\psi}{\partial y},
\qquad
\frac{\partial\phi}{\partial y}
=-\frac{\partial\psi}{\partial x}.
$$

因此 $\phi$、$\psi$ 都满足拉普拉斯方程。对于同一平面势流问题，可以用 $\phi$ 解，也可以用 $\psi$ 解。典型边界条件可写成

$$
\begin{cases}
\nabla^2\phi=0,\\
\text{物面上 }\dfrac{\partial\phi}{\partial n}=0,\\
\text{无穷远处 } \dfrac{\partial\phi}{\partial x}=u_\infty,\quad
\dfrac{\partial\phi}{\partial y}=v_\infty,
\end{cases}
$$

或写成

$$
\begin{cases}
\nabla^2\psi=0,\\
\text{物面上 } \psi=C,\\
\text{无穷远处 } \dfrac{\partial\psi}{\partial y}=u_\infty,\quad
-\dfrac{\partial\psi}{\partial x}=v_\infty.
\end{cases}
$$

由 Cauchy-Riemann 条件还可得

$$
\nabla\phi\cdot\nabla\psi
=\frac{\partial\phi}{\partial x}\frac{\partial\psi}{\partial x}
+\frac{\partial\phi}{\partial y}\frac{\partial\psi}{\partial y}
=0.
$$

所以等势线与流线正交。

### 二、复位势与复速度

定义复位势

$$
W(z)=\phi(x,y)+i\psi(x,y),\qquad z=x+iy.
$$

若 $W(z)$ 解析，则其满足 Cauchy-Riemann 条件，并对应一个平面不可压无旋运动。

若

$$
W(z)=\phi+i\psi,
$$

则

$$
\frac{dW}{dz}
=\frac{\partial\phi}{\partial x}
+i\frac{\partial\psi}{\partial x}
=u-iv.
$$

若记复速度为

$$
U=u+iv,
$$

则

$$
\frac{dW}{dz}=\overline{U}.
$$

在极坐标中，若

$$
U=u+iv=|U|e^{i\theta},
$$

则

$$
\frac{dW}{dz}=u-iv=|U|e^{-i\theta}.
$$

### 三、复位势的性质

复位势可相差一个常数而不改变速度场。

沿任一闭曲线，环量和流量可写成

$$
\Gamma=\oint \vec u\cdot d\vec r
=\oint \nabla\phi\cdot d\vec r
=\oint d\phi,
$$

$$
Q=\oint \vec u\cdot \hat n\,ds
=\oint d\psi.
$$

因此

$$
\Gamma+iQ=\oint d\phi+i\oint d\psi
=\oint dW
=\oint \frac{dW}{dz}\,dz.
$$

若积分路径内无奇点，且 $W(z)$ 在该区域解析，则

$$
\Gamma+iQ=0.
$$

### 四、典型例子：$W(z)=Az^2$

页 48 给出的典型例子为

$$
W(z)=Az^2=A(x+iy)^2=A(x^2-y^2)+i(2Axy).
$$

因此

$$
\phi=A(x^2-y^2),\qquad
\psi=2Axy.
$$

两族曲线分别为

$$
\phi=C \Rightarrow x^2-y^2=\frac{C}{A},
$$

$$
\psi=C \Rightarrow xy=\frac{C}{2A}.
$$

复速度为

$$
\frac{dW}{dz}=2Az=2A(x+iy),
$$

所以

$$
u=2Ax,\qquad -v=2Ay\Rightarrow v=-2Ay.
$$

原点为驻点；当 $A>0$ 时，$x$ 轴方向外张，$y$ 轴方向向原点汇聚。又因

$$
\psi=2Axy,
$$

故 $x=0$ 与 $y=0$ 均为 $\psi=0$ 的特殊流线。

---

### 第 49-50 页：基本平面势流模板（原 PDF 复校）

#### 第三节 基本流动

正问题通常是由实际问题求解析函数 $W(z)$；反问题则是给定解析函数 $W(z)$，再判断其代表的流动。本节主要通过 $\phi,\psi,dW/dz,\Gamma,Q$ 来认识基本流动。

### 一、均匀流

令

$$
W=Az,\qquad A=a+bi.
$$

则

$$
W=(a+bi)(x+iy)=(ax-by)+i(ay+bx),
$$

即

$$
\phi=ax-by,\qquad \psi=ay+bx.
$$

又

$$
\frac{dW}{dz}=A,\qquad |U|=|A|=\sqrt{a^2+b^2}.
$$

对闭曲线有

$$
\Gamma+iQ=\oint \frac{dW}{dz}\,dz=\oint A\,dz=0.
$$

因此 $W=Az$ 表示均匀流。
若来流速度大小为 $U$，方向角为 $\alpha$，也常写作

$$
W=Ue^{-i\alpha}z.
$$

### 二、点源与点汇

令

$$
W=A\ln z,
$$

其中 $A$ 为实数，奇点在 $z=0$。因

$$
z=re^{i\theta},
$$

故

$$
W=A\ln(re^{i\theta})=A\ln r+iA\theta,
$$

于是

$$
\phi=A\ln r,\qquad \psi=A\theta.
$$

复速度为

$$
\frac{dW}{dz}=\frac{A}{z}
=\frac{A}{r}e^{-i\theta},
\qquad |U|=\frac{|A|}{r}.
$$

径向速度可由速度势得

$$
u_r=\frac{\partial\phi}{\partial r}=\frac{A}{r}.
$$

若 $A>0$，则为点源；若 $A<0$，则为点汇。

对围住原点的闭曲线，

$$
\Gamma+iQ=\oint \frac{A}{z}\,dz=2\pi Ai,
$$

故

$$
\Gamma=0,\qquad Q=2\pi A,\qquad A=\frac{Q}{2\pi}.
$$

点源可写作

$$
W=\frac{Q}{2\pi}\ln z.
$$

若点源移到 $z_0$ 处，则只需把奇点位置平移为

$$
W=\frac{Q}{2\pi}\ln(z-z_0).
$$

页边例式：

$$
W=m\ln\left(z-\frac12\right),\qquad m>0.
$$

此式表示 $z=\frac12$ 处的点源；若 $m<0$，则为同点的点汇。

点汇只需令 $Q<0$。
此时流线为 $\theta=\text{常数}$，等势线为 $r=\text{常数}$。

### 三、点涡

令

$$
W=iB\ln z,
$$

其中 $B$ 为实数，奇点在 $z=0$。则

$$
W=iB(\ln r+i\theta)=iB\ln r-B\theta,
$$

即

$$
\phi=-B\theta,\qquad \psi=B\ln r.
$$

又

$$
\frac{dW}{dz}=\frac{iB}{z}
=\frac{iB}{r}e^{-i\theta},
\qquad |U|=\frac{|B|}{r}.
$$

对围住原点的闭曲线，

$$
\Gamma+iQ=\oint \frac{iB}{z}\,dz=-2\pi B.
$$

故

$$
\Gamma=-2\pi B,\qquad Q=0.
$$

于是点涡可写作

$$
W=\frac{\Gamma}{2\pi i}\ln z.
$$

若点涡位于 $z_0$ 处，对应写成

$$
W=\frac{\Gamma}{2\pi i}\ln(z-z_0).
$$

点涡没有净源汇，流线为 $r=\text{常数}$，等势线为 $\theta=\text{常数}$。

### 四、偶极子

源与汇相距很近并使强度乘距离保持有限时，可得到偶极子。若令

$$
\mu=\frac{Q\,\delta z}{2\pi},
$$

则

$$
\frac{Q}{2\pi}\ln z-\frac{Q}{2\pi}\ln(z-\delta z)
=-\frac{Q}{2\pi}\ln\left(1-\frac{\delta z}{z}\right)
\approx \frac{Q\delta z}{2\pi}\frac1z
=\frac{\mu}{z}.
$$

因此偶极子的复位势为

$$
W=\frac{\mu}{z}.
$$

将其写为极坐标形式：

$$
\frac{\mu}{z}
=\frac{\mu}{r}e^{-i\theta}
=\frac{\mu}{r}(\cos\theta-i\sin\theta),
$$

故

$$
\phi=\frac{\mu}{r}\cos\theta,\qquad
\psi=-\frac{\mu}{r}\sin\theta.
$$

复速度为

$$
\frac{dW}{dz}=-\frac{\mu}{z^2},
\qquad |U|=\frac{|\mu|}{r^2}.
$$

对闭曲线有

$$
\Gamma+iQ=\oint -\frac{\mu}{z^2}\,dz=0,
$$

故

$$
\Gamma=0,\qquad Q=0.
$$

### 五、幂函数流动

令

$$
W=Az^n.
$$

在极坐标中

$$
W=Ar^n e^{in\theta}
=Ar^n\cos(n\theta)+iAr^n\sin(n\theta),
$$

故

$$
\phi=Ar^n\cos(n\theta),\qquad
\psi=Ar^n\sin(n\theta).
$$

若取 $\psi=0$ 的流线，则

$$
\sin(n\theta)=0.
$$

例如当 $n=3$ 时，$\psi=0$ 的流线可取 $\theta=0$ 与 $\theta=\pi/3$。

复速度为

$$
\frac{dW}{dz}=Anz^{n-1}
=Anr^{\,n-1}e^{i(n-1)\theta},
$$

从而

$$
|U|=\left|\frac{dW}{dz}\right|
=|An|r^{\,n-1}.
$$

当 $n>1$ 时，$r=0$ 处速度趋于 $0$；当 $n<1$ 时，$r=0$ 处速度趋于无穷大。若路径内无相应奇点，

$$
\Gamma+iQ=\oint Anz^{n-1}\,dz=0.
$$

---

### 第 51-52 页：圆柱绕流（无环流与有环流，原 PDF 复校）

#### 第四节 绕圆柱的无环流和有环流流动

### 一、无环流绕圆柱

均匀流和偶极子叠加可表示半径为 $a$ 的圆柱无环流绕流：

$$
W=U\left(z+\frac{a^2}{z}\right),\qquad |z|>a.
$$

取 $z=re^{i\theta}$，则

$$
z+\frac{a^2}{z}
=\left(r+\frac{a^2}{r}\right)\cos\theta
+i\left(r-\frac{a^2}{r}\right)\sin\theta.
$$

因此

$$
\phi=U\left(r+\frac{a^2}{r}\right)\cos\theta,
\qquad
\psi=U\left(r-\frac{a^2}{r}\right)\sin\theta.
$$

当 $r=a$ 时

$$
\psi=0,
$$

所以圆周 $r=a$ 是一条流线，满足圆柱壁面无穿透条件。

复速度为

$$
\frac{dW}{dz}=U\left(1-\frac{a^2}{z^2}\right).
$$

在圆柱表面 $z=ae^{i\theta}$ 上，

$$
\frac{dW}{dz}
=U(1-e^{-2i\theta})
=2iUe^{-i\theta}\sin\theta,
$$

故柱面速度大小为

$$
|U_s|=2U|\sin\theta|.
$$

若写成极坐标速度分量，则

$$
u_r=U\left(1-\frac{a^2}{r^2}\right)\cos\theta,
\qquad
u_\theta=-U\left(1+\frac{a^2}{r^2}\right)\sin\theta.
$$

在 $r=a$ 上，

$$
u_r=0,\qquad u_\theta=-2U\sin\theta.
$$

驻点由柱面切向速度为零给出：

$$
\sin\theta=0
\quad\Longrightarrow\quad
\theta=0,\ \pi.
$$

即圆柱迎风点和背风点为两个驻点。

由伯努利方程

$$
p+\frac{\rho u^2}{2}
=p_\infty+\frac{\rho U^2}{2},
$$

代入柱面速度 $u=|U_s|=2U|\sin\theta|$，得

$$
p(a,\theta)
=p_\infty+\frac12\rho U^2\left(1-4\sin^2\theta\right),
$$

即压强系数

$$
C_p=\frac{p-p_\infty}{\frac12\rho U^2}
=1-4\sin^2\theta.
$$

压强分布关于前后、上下均对称，积分后圆柱合阻力为零、升力也为零。这就是理想流体绕圆柱的达朗贝尔佯谬；实际粘性流动中，后方分离和尾流会带来阻力。

### 二、有环流绕圆柱

若在无环流绕圆柱基础上叠加点涡项，则

$$
W=U\left(z+\frac{a^2}{z}\right)
+\frac{\Gamma}{2\pi i}\ln z.
$$

复速度为

$$
\frac{dW}{dz}
=U\left(1-\frac{a^2}{z^2}\right)
+\frac{\Gamma}{2\pi i z}.
$$

圆柱表面切向速度变为

$$
u_\theta=-2U\sin\theta-\frac{\Gamma}{2\pi a}.
$$

因此柱面压强系数可写成

$$
C_p
=1-\left(2\sin\theta+\frac{\Gamma}{2\pi aU}\right)^2.
$$

驻点由

$$
\frac{dW}{dz}=0
$$

确定，即

$$
U\left(1-\frac{a^2}{z^2}\right)
+\frac{\Gamma}{2\pi i z}=0.
$$

整理得

$$
z^2+\frac{\Gamma}{2\pi iU}z-a^2=0.
$$

当 $|\Gamma|>4\pi aU$ 时，两个驻点中有一个移到圆柱外：

$$
z_{1,2}
=i\left[-\frac{\Gamma}{4\pi U}
\pm\sqrt{\frac{\Gamma^2}{16\pi^2U^2}-a^2}\right].
$$

当 $|\Gamma|=4\pi aU$ 时，两个驻点合并在圆柱表面：

$$
z_1=z_2=-\frac{\Gamma}{4\pi U}i.
$$

当 $|\Gamma|<4\pi aU$ 时，两个驻点在圆柱表面上：

$$
z=\pm\sqrt{a^2-\frac{\Gamma^2}{16\pi^2U^2}}
-\frac{\Gamma}{4\pi U}i.
$$

圆柱受到的合力可由压力积分表示：

$$
\vec R=-\oint p\hat n\,ds,
$$

即

$$
R_x=-\oint p\cos\theta\,a\,d\theta,
\qquad
R_y=-\oint p\sin\theta\,a\,d\theta.
$$

由

$$
p=C-\frac{\rho |U_s|^2}{2}
$$

并代入柱面切向速度，得

$$
R_x=0,\qquad R_y=\rho U\Gamma.
$$

所以无环流时无升力；有环流时出现垂直于来流方向的升力，大小与 $\rho U\Gamma$ 成正比，对应 Magnus 效应。

---

### 第 53-54 页：镜像法与圆定理（原 PDF 复校）

#### 一、平直边界上的镜像法与唯一性思路
这两页先把“有奇点的自由势流”推进到“遇到固壁边界怎么办”。如果边界取实轴 $y=0$，并且原始复势 $f(z)$ 的全部真实奇点都在上半平面，那么满足平板无穿透条件的组合复势可写成：
平板镜像公式

$$
W(z)=f(z)+\overline{f(\bar z)}
$$

其关键不是死背形式，而是看边界上发生了什么：当 $z=x$ 落在实轴上时，有 $\bar z=z$，故
边界流函数为零

$$
W(x)=f(x)+\overline{f(x)}=2\operatorname{Re}f(x)
$$

于是 $\psi=\operatorname{Im}W=0$，说明整个实轴本身就是一条流线；对理想不可压势流而言，这就等价于把实轴变成了一条不可穿透固壁。
本页其实是在用唯一性定理说明：
- 先在边界另一侧补一个“象奇点”；
- 只要补完以后边界变成流线；
- 那么边界外部的流场就被唯一确定了。

### 二、平板边界下两类最重要的象奇点
常见的是“源/汇”和“点涡”在平板上方的镜像规则。

#### 1. 点源靠近平板
若上半平面内 $z_0=x_0+iy_0$ 处有一点源，镜像点位于 $\bar z_0=x_0-iy_0$，且镜像源与原源同强度。组合复势可写成：
源的镜像复势

$$
W(z)=\frac{m}{2\pi}\ln(z-z_0)+\frac{m}{2\pi}\ln(z-\bar z_0)
$$

这说明平板不会改变源的总流量，只是把流线折成关于平板对称的形状，使边界处法向速度为零。

#### 2. 点涡靠近平板
若上半平面内有一点涡，为了让平板成为流线，其镜像涡应取反号。可写成：
点涡的镜像复势

$$
W(z)=\frac{\Gamma}{2\pi i}\ln(z-z_0)-\frac{\Gamma}{2\pi i}\ln(z-\bar z_0)
$$

因此平板边界附近的点涡问题，真正要记住的是：
- 源/汇：镜像同号；
- 点涡：镜像反号；
- 目的都不是“复制奇点”，而是把边界整理成 $\psi=0$ 的流线。

### 三、圆形边界的 Milne–Thomson 圆定理
下一页把平板边界进一步推广到圆形边界。若半径为 $a$ 的圆周 $|z|=a$ 作为固壁，且 $f(z)$ 在圆外解析，则圆外满足无穿透条件的复势可统一写成：
圆定理

$$
W(z)=f(z)+\overline{f\left(\frac{a^2}{\bar z}\right)}
$$

它和前面的平板镜像法是一回事：都是在“真实区域之外”补一个恰到好处的象奇点系统。
圆周上因为 $|z|=a$，故有
圆周成为流线

$$
\frac{a^2}{\bar z}=z
$$

从而
边界实值化

$$
W(z)=f(z)+\overline{f(z)}=2\operatorname{Re}f(z)
\qquad (|z|=a)
$$

所以圆周 $|z|=a$ 也满足 $\psi=0$，即它本身就是固壁边界。

### 四、圆定理最经典的例子：均匀流绕圆柱

若无圆柱时为均匀流，速度分量写为 $(u,v)$，原复势可写成

$$
f(z)=(u-iv)z.
$$

加入半径为 $a$ 的圆柱边界后，圆定理给出

$$
W(z)=(u-iv)z+(u+iv)\frac{a^2}{z}.
$$

当来流沿 $x$ 方向且速度为 $U$ 时，取 $u=U,\ v=0$，即可得到圆柱绕流主模型：

$$
W(z)=U\left(z+\frac{a^2}{z}\right).
$$

也就是说，“均匀流 + 偶极子”的叠加可看作圆形边界构造的结果：
- 不是偶极子凭空出现；
- 而是圆定理把均匀流自动改写成了“带圆形固壁”的外部势流；
- 于是 $r=a$ 自然成为圆柱表面。
这也说明平板镜像法与圆柱绕流并不是两块分散知识，而是同一件事的两种边界版本。

### 五、圆外源/涡的象点位置

这两页后半还提示：若圆外 $z_0$ 处有奇点，则对应象点会落在反演位置

$$
z^*=\frac{a^2}{\bar z_0}.
$$

例如圆外 $z_0$ 处有点源，无圆柱时

$$
f(z)=\frac{Q}{2\pi}\ln(z-z_0).
$$

圆柱存在时，可写成

$$
W(z)=\frac{Q}{2\pi}\ln(z-z_0)
+\frac{Q}{2\pi}\ln\left(\frac{a^2}{z}-\bar z_0\right).
$$

该式中第二项即由圆反演得到的镜像项。对圆外点涡，也同样用圆反演点构造镜像涡，并按环量符号取相应的镜像强度。

也就是：
- 圆外的真实奇点，对应一个圆内的象奇点；
- 圆内外位置通过反演 $a^2/\bar z_0$ 联系；
- 这样既不改变真实外流区的奇点结构，又能把圆周整理成流线。
因此圆外源、圆外点涡、圆外偶极子等问题，都可以整理成同一个套路：
1. 先写自由流的 $f(z)$；
2. 再用圆定理补上 $\overline{f(a^2/\bar z)}$；
3. 最后由 $dW/dz$、Bernoulli 或流函数去读速度、驻点、压强与流量。

---

### 第 55 页：Blasius 定理与二维势流受力（原 PDF 复校）

#### 第六节 理想不可压流体平面无旋运动力学

研究绕流物体受力时，基本路线为

$$
W(z)\longrightarrow \frac{dW}{dz}\longrightarrow p.
$$

#### 一、Blasius 定理

物体边界上的压力微元可写成

$$
dP_x=-p n_x\,ds=-p\,dy,
\qquad
dP_y=-p n_y\,ds=p\,dx.
$$

因此

$$
d(P_x-iP_y)=-p\,dy-i p\,dx=-ip\,dz.
$$

由 Bernoulli 方程

$$
\frac{u^2+v^2}{2}+\frac{p}{\rho}=C,
$$

得

$$
p=C-\frac{\rho}{2}(u^2+v^2).
$$

在复速度写法下，

$$
\frac{dW}{dz}=u-iv,
\qquad
\overline{\frac{dW}{dz}}=u+iv,
$$

因而

$$
u^2+v^2=(u-iv)(u+iv).
$$

沿闭合物体边界积分时，常数项的围道积分为零，留下复速度平方项。代入并沿物体边界 $C$ 积分，可得 Blasius 力公式

$$
P_x-iP_y
=\frac{i\rho}{2}\oint_C
\left(\frac{dW}{dz}\right)^2dz.
$$

若还要求合力矩，则可写为

$$
M=\operatorname{Re}\left[
-\frac{\rho}{2}\oint_C
z\left(\frac{dW}{dz}\right)^2dz
\right].
$$

其中 $C$ 为包围物体边界的闭曲线；合力由 $\left(dW/dz\right)^2$ 的闭合积分决定，力矩式比合力式多出位置因子 $z$。

### 第 56 页：Joukowski 定理与升力公式（原 PDF 复校）

#### 二、Joukowski 定理

若包围物体的闭曲线为 $C$，流动在外部区域解析，并在无穷远处速度有限，则复速度可在无穷远处展开为

$$
\frac{dW}{dz}
=a_0+\frac{a_1}{z}+\frac{a_2}{z^2}+\cdots .
$$

无穷远处的复速度给出

$$
a_0=\overline{U_\infty}.
$$

又由 Cauchy 定理和环量定义，

$$
a_1=\frac{1}{2\pi i}\oint_C\frac{dW}{dz}\,dz
=\frac{\Gamma}{2\pi i}.
$$

将展开式代入 Blasius 力公式时，围道可取包围物体的大圆。闭合积分中只有 $z^{-1}$ 项有贡献：

$$
\oint_C z^{-1}dz=2\pi i,
\qquad
\oint_C z^n dz=0\quad(n\ne -1).
$$

于是

$$
P_x-iP_y=-i\rho\,\overline{U_\infty}\Gamma.
$$

若来流速度大小为 $U_\infty$，则升力大小为

$$
|P|=\rho U_\infty|\Gamma|.
$$

升力方向垂直于来流方向，具体指向由环量符号决定。若无环量，即 $\Gamma=0$，则该定理给出无升力的结果。 这与前面圆柱无环流绕流中合力为零的结论一致，符号取向按原页约定。

由同样的远场展开还可得到合力矩形式

$$
M=-2\pi\rho\,\operatorname{Re}
\left(i\overline{U_\infty}a_2\right).
$$

这里 $a_0$ 代表无穷远来流，$a_1$ 与环量、合力相联系；$a_2$ 进入力矩表达式。按这个口径，Blasius 定理给出一般合力积分，Joukowski 定理则是把远场展开中环量项单独读出来。前面带环量圆柱绕流

$$
W(z)=U\left(z+\frac{a^2}{z}\right)
+\frac{\Gamma}{2\pi i}\ln z
$$

可直接接入本页的 Joukowski 升力结论。

### 第 57 页：平面 Couette 流和平面 Poiseuille 流（原 PDF 复校）

#### 第一节 平面 Couette 流和平面 Poiseuille 流

设两平行平板间为定常不可压粘性流动，取速度只有 $x$ 方向分量：

$$
\vec u=(u(y),0,0).
$$

连续方程自动满足。Navier-Stokes 方程化为

$$
0=-\frac{\partial p}{\partial x}+\mu\frac{d^2u}{dy^2},
$$

$$
0=-\rho g-\frac{\partial p}{\partial y},
\qquad
0=-\frac{\partial p}{\partial z}.
$$

由后两式可得

$$
p=-\rho gy+p(x).
$$

##### 1. 平面 Couette 流

若无压强梯度，仅上板以速度 $U$ 匀速运动，下板静止，则边界条件为

$$
y=0:\ u=0,
\qquad
y=b:\ u=U.
$$

此时速度分布为线性分布：

$$
u=\frac{U}{b}y.
$$

##### 2. 平面 Poiseuille 流

若两板均静止，沿 $x$ 方向存在恒定压强梯度，记

$$
\frac{\partial p}{\partial x}=-a,
$$

则控制方程为

$$
\mu\frac{d^2u}{dy^2}=-a.
$$

边界条件为

$$
y=0:\ u=0,
\qquad
y=b:\ u=0.
$$

解得

$$
u=\frac{a}{2\mu}y(b-y).
$$

若用长度 $L$ 上的压强差 $\Delta p$ 表示，则

$$
a=\frac{\Delta p}{L},
\qquad
u=\frac{\Delta p}{2\mu L}y(b-y).
$$

平均速度为

$$
\overline u
=\frac{1}{b}\int_0^b u\,dy
=\frac{\Delta p}{12\mu L}b^2.
$$

单位宽度流量为

$$
q=\overline u\,b
=\frac{\Delta p}{12\mu L}b^3.
$$

剪应力为

$$
\tau=\mu\frac{du}{dy}
=\frac{\Delta p}{2L}(b-2y).
$$

上式说明平面 Poiseuille 流中速度为抛物线分布，剪应力沿法向作线性变化。

### 第 58 页：不可压粘性流体在无限长等截面管道中的定常流动（原 PDF 复校）

#### 第二节 不可压粘性流体在无限长等截面管道中的定常流动

对无限长等截面管道中的定常粘性流动，设

$$
\vec u=(u(y,z),0,0),
\qquad
\frac{\partial u}{\partial x}=0.
$$

Navier-Stokes 方程化为

$$
0=-\frac{1}{\rho}\frac{\partial p}{\partial x}
+\frac{\mu}{\rho}\nabla^2u,
$$

$$
0=-\frac{1}{\rho}\frac{\partial p}{\partial y},
\qquad
0=-\frac{1}{\rho}\frac{\partial p}{\partial z}.
$$

故

$$
p=p(x).
$$

若截面 $A$ 处压强为 $P_A$，截面 $B$ 处压强为 $P_B$，管长为 $L$，则

$$
\frac{\partial p}{\partial x}
=-\frac{P_A-P_B}{L}.
$$

令

$$
P=\frac{P_A-P_B}{\mu L},
$$

截面内速度满足 Poisson 方程：

$$
\frac{\partial^2u}{\partial y^2}
+\frac{\partial^2u}{\partial z^2}
=-P.
$$

##### 圆管层流

对半径为 $a$ 的圆管，改用柱坐标且 $u=u(r)$，有

$$
\frac{1}{r}\frac{d}{dr}
\left(r\frac{du}{dr}\right)=-P.
$$

由中心 $r=0$ 处速度有限、壁面 $r=a$ 处无滑移 $u=0$，得

$$
u=\frac{P}{4}(a^2-r^2)
=\frac{P_A-P_B}{4\mu L}(a^2-r^2).
$$

最大速度在管轴处：

$$
u_{\max}=\frac{P_A-P_B}{4\mu L}a^2.
$$

体积流量为

$$
Q=\int_A u\,dS
=\int_0^a 2\pi r u\,dr
=\frac{\pi a^4}{8\mu L}(P_A-P_B).
$$

平均速度为

$$
\overline u=\frac{Q}{\pi a^2}
=\frac{P_A-P_B}{8\mu L}a^2
=\frac{1}{2}u_{\max}.
$$

壁面切应力可由

$$
\tau=\mu\frac{du}{dr}
=-\frac{P_A-P_B}{2L}r
$$

给出。它的方向与流动方向相反；在壁面 $r=a$ 处，大小为

$$
|\tau_w|=\frac{a(P_A-P_B)}{2L}.
$$

### 第 59 页：同心旋转圆柱间流体运动（原 PDF 复校）

#### 第二节 同心旋转圆柱间流体运动

两无限长同心圆柱间充满粘性不可压流体，大小圆柱半径分别为 $r_1,r_2$，分别以常角速度 $\omega_1,\omega_2$ 绕共同轴线旋转。

简化条件为

$$
\frac{\partial}{\partial t}=0,\qquad
\frac{\partial}{\partial z}=0,\qquad
\frac{\partial}{\partial\theta}=0,\qquad
u_z=0,\qquad u_r=0,
$$

所以

$$
u_\theta=u_\theta(r),\qquad p=p(r).
$$

N-S 方程变为

$$
\left\{
\begin{aligned}
\frac{u_\theta^2}{r}
&=\frac{1}{\rho}\frac{dp}{dr},\qquad (1)\\[6pt]
\mu\left(
\frac{d^2u_\theta}{dr^2}
+\frac{1}{r}\frac{du_\theta}{dr}
-\frac{u_\theta}{r^2}
\right)&=0.\qquad (2)
\end{aligned}
\right.
$$

其中式 $(1)$ 表示径向压力梯度与离心项平衡。式 $(2)$ 可改写为

$$
\mu\left(
\frac{d^2u_\theta}{dr^2}
+\frac{1}{r}\frac{du_\theta}{dr}
-\frac{u_\theta}{r^2}
\right)
=\frac{1}{2\pi r^2}\frac{d}{dr}
\left[
2\pi r^2\mu
\left(\frac{du_\theta}{dr}-\frac{u_\theta}{r}\right)
\right].
$$

记

$$
P_{r\theta}
=\mu\left(\frac{du_\theta}{dr}-\frac{u_\theta}{r}\right),
\qquad
M=2\pi r^2P_{r\theta},
$$

由上式知

$$
\frac{dM}{dr}=0,\qquad M=\text{const}.
$$

这里 $P_{r\theta}$ 表示法向为 $r$ 的面上沿 $\theta$ 方向的应力；$2\pi rP_{r\theta}$ 是单位长度圆周上的切向力，$2\pi r^2P_{r\theta}$ 是转矩。

解方程时，将式 $(2)$ 变形为

$$
\frac{d}{dr}\left[
\frac{1}{r}\frac{d}{dr}(ru_\theta)
\right]=0,
$$

得

$$
u_\theta=Ar+\frac{B}{r}.
$$

边界条件为

$$
r=r_1:\quad u_\theta=\omega_1r_1,\qquad
r=r_2:\quad u_\theta=\omega_2r_2.
$$

因此

$$
A=\frac{\omega_2r_2^2-\omega_1r_1^2}{r_2^2-r_1^2},
\qquad
B=\frac{(\omega_1-\omega_2)r_1^2r_2^2}{r_2^2-r_1^2}.
$$

于是

$$
u_\theta
=\frac{1}{r_2^2-r_1^2}
\left[
r(\omega_2r_2^2-\omega_1r_1^2)
-\frac{r_1^2r_2^2}{r}(\omega_2-\omega_1)
\right].
$$

用相似性标绘速度图：给定一组 $(r_1,r_2,\omega_1,\omega_2)$ 做实验即可得一套 $u_\theta$。若换一组 $(r_1',r_2',\omega_1',\omega_2')$，只要相对半径、相对角速度一致，速度分布形状相似；绝对大小本身没有意义。

引入

$$
X=\frac{r}{r_2},\qquad
\chi=\frac{r_1}{r_2},\qquad
s=r_2-r_1.
$$

图 a：$\omega_1\ne0,\ \omega_2=0$ 时，

$$
\frac{u_\theta}{\omega_1r_1}
=\frac{\chi}{1-\chi^2}\left(\frac{1}{X}-X\right).
$$

图 b：$\omega_1=0,\ \omega_2\ne0$ 时，

$$
\frac{u_\theta}{\omega_2r_2}
=\frac{1}{1-\chi^2}
\left(X-\frac{\chi^2}{X}\right).
$$

### 第 60 页：圆柱 Couette 极限与低 Reynolds 数球绕流建立（原 PDF 复校）

当 $\chi\to1$，即 $r_1\approx r_2$ 时，同心圆柱间流动趋于 Couette 流。

a 情况下，若 $r_2\to\infty,\ \chi\to0$，则

$$
\frac{u_\theta}{\omega_1r_1}=\frac{\chi}{X}=\frac{r_1}{r},
\qquad
u_\theta=\frac{\omega_1r_1^2}{r}.
$$

b 情况下，若 $r_1\to0,\ \chi\to0$，则

$$
\frac{u_\theta}{\omega_2r_2}=X,
\qquad
u_\theta=\omega_2r.
$$

#### 第四节 低速粘性流体中的运动

低速粘性流体运动中，Reynolds 数小，可不计惯性力。不可压 Navier-Stokes 方程原为

$$
\frac{d\vec u}{dt}
=\vec F-\frac{1}{\rho}\nabla p+\frac{\mu}{\rho}\nabla^2\vec u,
\qquad
\nabla\cdot\vec u=0.
$$

简化条件为：Reynolds 数表示惯性力与粘性力的比，小 Reynolds 数忽略惯性；低速运动近似为定常；球绕流轴对称，故

$$
\frac{\partial}{\partial t}=0,\qquad
\frac{\partial}{\partial\varphi}=0,\qquad
u_\varphi=0.
$$

对半径为 $a$ 的圆球在流体中以速度 $U$ 运动，采用球坐标 $(r,\theta,\varphi)$。Stokes 方程与连续方程写作

$$
\left\{
\begin{aligned}
\frac{\partial p}{\partial r}
&=\mu\left(
\frac{\partial^2u_r}{\partial r^2}
+\frac{1}{r^2}\frac{\partial^2u_r}{\partial\theta^2}
+\frac{2}{r}\frac{\partial u_r}{\partial r}
+\frac{\cot\theta}{r^2}\frac{\partial u_r}{\partial\theta}
-\frac{2}{r^2}\frac{\partial u_\theta}{\partial\theta}
-\frac{2u_r}{r^2}
-\frac{2\cot\theta}{r^2}u_\theta
\right),\\[6pt]
\frac{1}{r}\frac{\partial p}{\partial\theta}
&=\mu\left(
\frac{\partial^2u_\theta}{\partial r^2}
+\frac{1}{r^2}\frac{\partial^2u_\theta}{\partial\theta^2}
+\frac{2}{r}\frac{\partial u_\theta}{\partial r}
+\frac{\cot\theta}{r^2}\frac{\partial u_\theta}{\partial\theta}
+\frac{2}{r^2}\frac{\partial u_r}{\partial\theta}
-\frac{u_\theta}{r^2\sin^2\theta}
\right),\\[6pt]
0&=\frac{\partial u_r}{\partial r}
+\frac{1}{r}\frac{\partial u_\theta}{\partial\theta}
+\frac{2u_r}{r}
+\frac{\cot\theta}{r}u_\theta.
\end{aligned}
\right.
$$

边界条件为

$$
\left\{
\begin{aligned}
r=a\text{（物面）处}:&\quad u_r=u_\theta=0, \qquad (2)\\
r=\infty\text{ 处}:&\quad u_r=U\cos\theta,\quad u_\theta=-U\sin\theta.\qquad (3)
\end{aligned}
\right.
$$

取试解

$$
u_r=R_1(r)F_1(\theta),\qquad
u_\theta=R_2(r)F_2(\theta),\qquad
p=\mu R_3(r)F_3(\theta)+p_\infty.\qquad (4)
$$

由式 $(3)$ 得

$$
F_1(\theta)=\cos\theta,\qquad
F_2(\theta)=-\sin\theta,\qquad
R_1(\infty)=R_2(\infty)=U.
$$

因此

$$
u_r=R_1(r)\cos\theta,\qquad
u_\theta=-R_2(r)\sin\theta.\qquad (5)
$$

将式 $(5)$ 代入连续方程，得

$$
R_1'+\frac{2(R_1-R_2)}{r}=0.\qquad (a)
$$

由压力的角向关系可取

$$
F_3(\theta)=\cos\theta,
$$

从而

$$
p=\mu R_3(r)\cos\theta+p_\infty.\qquad (7)
$$

### 第 61 页：Stokes 球绕流通解、应力与小球阻力（原 PDF 复校）

#### 1. 由球坐标方程得到的径向函数关系

本页承接前一页 Stokes 球绕流推导。设速度分量写成关于 $r$ 的函数 $R_1,R_2$ 与角函数组合，笔记先列出三条关系：

$$
R_1'+\frac{2(R_1-R_2)}{r}=0 \qquad (a)
$$

$$
R_3'=R_1''+\frac{2}{r}R_1'-\frac{4(R_1-R_2)}{r^2}
\qquad (b)
$$

$$
\frac{R_3}{r}=R_2''+\frac{2}{r}R_2'+\frac{2(R_1-R_2)}{r^2}
\qquad (c)
$$

边界条件为球面无滑移与无穷远均匀来流：

$$
R_1(a)=0,\qquad R_2(a)=0 \qquad (A)
$$

$$
R_1(\infty)=U,\qquad R_2(\infty)=U \qquad (B)
$$

由式 $(a)$ 可得

$$
R_2=\frac{r}{2}R_1'+R_1 .
\qquad (11)
$$

代入式 $(c)$ 得

$$
R_3=\frac{1}{2}r^2R_1''+3rR_1'+2R_1 .
\qquad (12)
$$

再把 $(11),(12)$ 代入式 $(b)$，化为

$$
r^3R_1^{(4)}+8r^2R_1'''+8rR_1''-8R_1'=0 .
\qquad (13)
$$

令 $R_1=r^m$，则 $m$ 为下列方程的根：

$$
m(m-1)(m-2)(m-3)
+8m(m-1)(m-2)
+8m(m-1)-8m=0 .
$$

因此

$$
m=0,\ 2,\ -1,\ -3,
$$

于是

$$
R_1=\frac{C_1}{r^3}+\frac{C_2}{r}+C_3+C_4r^2 .
\qquad (14)
$$

由 $(11),(12)$ 可得

$$
R_2=-\frac{C_1}{2r^3}+\frac{C_2}{2r}+C_3+2C_4r^2,
\qquad (15)
$$

$$
R_3=\frac{C_2}{r^2}+10C_4r .
\qquad (16)
$$

#### 2. 代入边界条件后的速度与压强

由边界条件确定常数：

$$
C_1=\frac{1}{2}a^3U,\qquad
C_2=-\frac{3}{2}aU,\qquad
C_3=U,\qquad
C_4=0.
$$

因此

$$
R_1=U\left(\frac{a^3}{2r^3}-\frac{3a}{2r}+1\right),
$$

$$
R_2=U\left(-\frac{a^3}{4r^3}-\frac{3a}{4r}+1\right),
$$

$$
R_3=-\frac{3aU}{2r^2}.
$$

代回速度表达，得

$$
u_r=U\cos\theta\left(1-\frac{3a}{2r}+\frac{a^3}{2r^3}\right),
$$

$$
u_\theta=-U\sin\theta\left(1-\frac{3a}{4r}-\frac{a^3}{4r^3}\right),
$$

$$
p=-\frac{3\mu aU}{2r^2}\cos\theta .
$$

#### 3. 球面应力与 Stokes 阻力

球面上需要把法向应力和切向应力分别投影到来流方向。按笔记记号，法向应力为

$$
p_{rr}=-p+2\mu\frac{\partial u_r}{\partial r},
$$

即

$$
p_{rr}
=\frac{3\mu aU}{2r^2}\cos\theta
+2\mu U\cos\theta
\left(\frac{3a}{2r^2}-\frac{3a^3}{2r^4}\right).
$$

在 $r=a$ 处化为

$$
p_{rr}=\frac{3\mu U}{2a}\cos\theta .
$$

切向应力为

$$
p_{r\theta}
=\mu\left(\frac{1}{r}\frac{\partial u_r}{\partial \theta}
+\frac{\partial u_\theta}{\partial r}
-\frac{u_\theta}{r}\right),
$$

即

$$
p_{r\theta}
=\mu\left(-\frac{3a^3}{2r^4}U\sin\theta\right).
$$

在 $r=a$ 处化为

$$
p_{r\theta}=-\frac{3\mu U}{2a}\sin\theta .
$$

把球面微元 $a^2\sin\theta\,d\theta\,d\varphi$ 上的应力投影到来流方向：

$$
F_1=\int_0^{2\pi}\int_0^\pi
p_{rr}\cos\theta\,a^2\sin\theta\,d\theta\,d\varphi
=2\pi a\mu U,
$$

$$
F_2=\int_0^{2\pi}\int_0^\pi
p_{r\theta}(-\sin\theta)\,a^2\sin\theta\,d\theta\,d\varphi
=4\pi a\mu U.
$$

所以小球总阻力为

$$
F_D=F_1+F_2=6\pi\mu aU .
$$

### 第 62 页：非定常流动与 Stokes 第一问题（原 PDF 复校）

#### 1. 无限大平板突然启动模型

本页标题进入“第五节 非定常流动”。模型为：$x$ 轴处有一无限大平板，上方为黏性流体；初始时流体与平板均静止，某时刻平板以速度 $U$ 沿 $x$ 方向运动。

由几何与运动假设可写

$$
\frac{\partial}{\partial x}=0,\qquad
w=0,\qquad
\frac{\partial}{\partial z}=0,\qquad
u=u(y,t).
$$

连续方程给出

$$
\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}=0.
$$

因 $\partial u/\partial x=0$，得 $\partial v/\partial y=0$；又由边界条件 $v|_{y=0}=0$，故

$$
v=0.
$$

于是 Navier-Stokes 方程化为一维非定常扩散方程：

$$
\frac{\partial u}{\partial t}
=\nu\frac{\partial^2u}{\partial y^2}.
\qquad (1)
$$

初始与边界条件为

$$
t\le 0,\ y>0:\quad u=0,
$$

$$
t>0,\ y=0:\quad u=U,
$$

$$
y\to\infty:\quad u=0.
$$

#### 2. 相似变量与误差函数解

本页用相似变量

$$
\eta=\frac{y}{2\sqrt{\nu t}}
\qquad (3)
$$

并设

$$
\frac{u}{U}=f(\eta).
$$

于是

$$
\frac{\partial u}{\partial t}=-\frac{U}{2t}\eta f',
$$

$$
\frac{\partial u}{\partial y}=\frac{U}{2\sqrt{\nu t}}f',
$$

$$
\frac{\partial^2u}{\partial y^2}=\frac{U}{4\nu t}f''.
$$

代入式 $(1)$ 得

$$
f''+2\eta f'=0,
\qquad (5)
$$

边界条件为

$$
f(0)=1,\qquad f(\infty)=0.
\qquad (6)
$$

积分得

$$
f=A\int_0^\eta e^{-s^2}\,ds+B.
$$

由边界条件确定

$$
A=-\frac{2}{\sqrt{\pi}},\qquad B=1.
$$

因此

$$
\frac{u}{U}
=1-\frac{2}{\sqrt{\pi}}\int_0^\eta e^{-s^2}\,ds
=\operatorname{erfc}(\eta).
\qquad (7)
$$

#### 3. 涡度扩散

本页下方图像强调：随时间推进，受平板拖动的速度影响层向外扩散，尺度为 $\sqrt{\nu t}$。由速度解可得涡度

$$
\omega_z=-\frac{\partial u}{\partial y}
=\frac{U}{\sqrt{\pi\nu t}}e^{-\eta^2}.
$$

所以非定常黏性启动问题的本质是“动量/涡度靠黏性从壁面向流体内部扩散”。

### 第 63 页：量纲分析与流动相似定律引入（原 PDF 复校）

#### 第六节 量纲分析

#### 一、量纲分析基本思想

在一些问题中，问题可以用有限的物理量描述，结果也可用有限的物理量描述。按右图，绕流阻力问题可写为

$$
F=f(\rho,\nu,U,a).
$$

其各量纲应一致。基本量纲以 $L,T,M$ 表示长度、时间、质量；$[A]$ 记为物理量 $A$ 的量纲。

#### 二、例：物体在无边界面流体运动时的阻力

物体长度 $l$，相对平移速度 $v$，流体密度 $\rho$，黏滞系数 $\mu$，阻力记作 $Q$。设

$$
Q=kl^\alpha v^\beta\rho^\gamma\mu^\delta.
\qquad (1)
$$

关键是把影响因素写全。量纲关系为

$$
[Q]=[l]^\alpha[v]^\beta[\rho]^\gamma[\mu]^\delta.
\qquad (2)
$$

其中

$$
[l]=L,\qquad [v]=LT^{-1},\qquad [\rho]=ML^{-3},
$$

$$
[\mu]=ML^{-1}T^{-1},\qquad [Q]=MLT^{-2}.
$$

由式 (2)：

$$
MLT^{-2}
=L^\alpha(LT^{-1})^\beta(ML^{-3})^\gamma(ML^{-1}T^{-1})^\delta.
$$

比较 $M,L,T$ 指数得

$$
\begin{cases}
1=\gamma+\delta,\\
1=\alpha+\beta-3\gamma-\delta,\\
-2=-\beta-\delta.
\end{cases}
$$

所以

$$
\gamma=1-\delta,\qquad
\beta=2-\delta,\qquad
\alpha=2-\delta.
$$

代入式 (1)：

$$
Q=kl^{2-\delta}v^{2-\delta}\rho^{1-\delta}\mu^\delta.
$$

当 $\delta=1$ 时，

$$
Q=klv\mu,
$$

即 Stokes 阻力定律。

当 $\delta=0$ 时，

$$
Q=kl^2v^2\rho,
$$

即 Newton 阻力定律。

#### 第七节 流动相似定律

引入：仅尺寸不同的两同试样，会有相似的流场结构。在飞机实验中，将飞机按比例缩小也可实验。

#### 一、流动相似定义

1. 几何相似：同比缩放。
2. 物理量特征值：能刻画一物理量特征的量。
3. 特征长度：一物理量随空间的特征变化。
4. 特征时间：一物理量随时间的特征变化。

### 第 64 页：相似点与流动相似条件（原 PDF 复校）

3. 对应点：两个几何相似的流动。

若两个流动的对应点满足

$$
\frac{\mathbf r_1}{L_1}
=\frac{\mathbf r_2}{L_2},
\qquad
\frac{t_1}{T_1}
=\frac{t_2}{T_2},
$$

则称为相似点。

推广到任一物理量 $f$，两个流动的 $f_1,f_2$ 可无量纲化为

$$
\frac{f_1}{f_{01}},
\qquad
\frac{f_2}{f_{02}}.
$$

若几何相似的流动，在任何时间的相似点上，力学物理量均有

$$
\frac{f_1}{f_{01}}
=\frac{f_2}{f_{02}},
$$

则称为相似。

#### 二、流动相似条件

由 N-S 方程：

$$
\begin{cases}
\dfrac{\partial u}{\partial t}
+u\dfrac{\partial u}{\partial x}
+v\dfrac{\partial u}{\partial y}
+w\dfrac{\partial u}{\partial z}
=-\dfrac{1}{\rho}\dfrac{\partial p}{\partial x}
+\nu\nabla^2u,\\[6pt]
\dfrac{\partial v}{\partial t}
+u\dfrac{\partial v}{\partial x}
+v\dfrac{\partial v}{\partial y}
+w\dfrac{\partial v}{\partial z}
=-\dfrac{1}{\rho}\dfrac{\partial p}{\partial y}
+\nu\nabla^2v,\\[6pt]
\dfrac{\partial w}{\partial t}
+u\dfrac{\partial w}{\partial x}
+v\dfrac{\partial w}{\partial y}
+w\dfrac{\partial w}{\partial z}
=-\dfrac{1}{\rho}\dfrac{\partial p}{\partial z}
+\nu\nabla^2w-g.
\end{cases}
\qquad (1)
$$

连续方程：

$$
\frac{\partial u}{\partial x}
+\frac{\partial v}{\partial y}
+\frac{\partial w}{\partial z}=0.
$$

边界条件：

$$
\text{固壁上 }\mathbf u=0,\qquad
\infty\text{ 处 }u=U_\infty.
$$

对两个相似流动，物理量特征量分别为

$$
L_1,T_1,U_1,P_1,\rho_1,
\qquad
L_2,T_2,U_2,P_2,\rho_2.
$$

对应的无量纲量为

$$
x_1'=\frac{x_1}{L_1},\quad
y_1'=\frac{y_1}{L_1},\quad
z_1'=\frac{z_1}{L_1},\quad
u_1'=\frac{u_1}{U_1},\quad
v_1'=\frac{v_1}{U_1},\quad
w_1'=\frac{w_1}{U_1},\quad
p_1'=\frac{p_1}{P_1},\quad
t_1'=\frac{t_1}{T_1},
$$

$$
x_2'=\frac{x_2}{L_2},\quad
y_2'=\frac{y_2}{L_2},\quad
z_2'=\frac{z_2}{L_2},\quad
u_2'=\frac{u_2}{U_2},\quad
v_2'=\frac{v_2}{U_2},\quad
w_2'=\frac{w_2}{U_2},\quad
p_2'=\frac{p_2}{P_2},\quad
t_2'=\frac{t_2}{T_2}.
$$

例如

$$
u_1=U_1u_1',
\qquad
t_1=T_1t_1',
\qquad
\frac{\partial u_1}{\partial t_1}
=\frac{U_1}{T_1}\frac{\partial u_1'}{\partial t_1'}.
$$

由此将式 (1) 中所有量替换，并用 $x_i',p_i',u_i'$ 分别代入，有

$$
\begin{cases}
St\dfrac{\partial u'}{\partial t'}
+u'\dfrac{\partial u'}{\partial x'}
+v'\dfrac{\partial u'}{\partial y'}
+w'\dfrac{\partial u'}{\partial z'}
=-Eu\dfrac{\partial p'}{\partial x'}
+\dfrac{1}{Re}(\nabla')^{2}u',\\[8pt]
St\dfrac{\partial v'}{\partial t'}
+u'\dfrac{\partial v'}{\partial x'}
+v'\dfrac{\partial v'}{\partial y'}
+w'\dfrac{\partial v'}{\partial z'}
=-Eu\dfrac{\partial p'}{\partial y'}
+\dfrac{1}{Re}(\nabla')^{2}v',\\[8pt]
St\dfrac{\partial w'}{\partial t'}
+u'\dfrac{\partial w'}{\partial x'}
+v'\dfrac{\partial w'}{\partial y'}
+w'\dfrac{\partial w'}{\partial z'}
=-Eu\dfrac{\partial p'}{\partial z'}
+\dfrac{1}{Re}(\nabla')^{2}w'
-\dfrac{1}{F},\\[8pt]
\dfrac{\partial u'}{\partial x'}
+\dfrac{\partial v'}{\partial y'}
+\dfrac{\partial w'}{\partial z'}=0.
\end{cases}
$$

其中

$$
St=\frac{L}{UT},\qquad
Eu=\frac{P}{\rho U^2},\qquad
F=\frac{U^2}{gL},\qquad
Re=\frac{UL}{\nu}.
$$

若对应点为同一组，即

$$
(x_1',y_1',z_1',t_1')=(x_2',y_2',z_2',t_2'),
$$

且

$$
u_1'=u_2',\qquad
v_1'=v_2',\qquad
w_1'=w_2',
$$

边界条件相同，$St,Eu,F,Re$ 四参数相等，则两流动动力学相似。

页角列出常见方程类型：

$$
U_{tt}=c^2U_{xx}\quad \text{双曲型},
$$

$$
U_t=kU_{xx}\quad \text{抛物型},
$$

$$
\nabla^2\phi=0\quad \text{椭圆型}.
$$

### 第 65 页：Reynolds 数意义、全书串联与水波动力学开端（原 PDF 复校）

#### 三、Reynolds 数意义

惯性力与黏性力的量级比为

$$
\frac{\rho u\dfrac{\partial u}{\partial x}}
{\mu\dfrac{\partial^2u}{\partial y^2}}
=
\frac{\rho U\dfrac{U}{L}}
{\mu\dfrac{U}{L^2}}
=\frac{\rho UL}{\mu}
=\frac{UL}{\nu}
=Re.
$$

其中 $\partial u'/\partial x'$、$\partial^2u'/\partial (x')^2$ 等无量纲导数的数量级约为 $1$。

$Re$ 大反映惯性作用强，$Re$ 小反映黏性作用强。$Re$ 达到某一临界值时，层流变为湍流；若环境条件很差，更小的 $Re$ 即可达到临界。这种现象对初始条件很敏感，初始条件一旦变化，湍流结果就很不同。

#### 复习课：全书串

页内框图把主线概括为：

1. 图形运动：平动、伸缩、旋转，并联系散度与旋度。
2. 本构：压强、黏性、应力张量。
3. 运动方程：Euler 方程、Navier-Stokes 方程及边界条件。
4. 场：速度场、压力场、势函数、复势

$$
W=\phi+i\psi,
$$

并进一步联系 Joukowski 定理。

#### 第六章 水波动力学

只研究初始静止、平衡形状后受扰动产生的波。

理想流体近似，体积力有势；若初始无涡，则永远无涡，故

$$
\nabla^2\phi=0.
$$

下边界：

$$
\frac{\partial\phi}{\partial y}=0,\qquad y=-h.
$$

上边界：设自由面为

$$
y=\eta(x,z,t),
$$

则表面方程

$$
F(x,y,z,t)=y-\eta(x,z,t)=0.
$$

流动学边界条件：

$$
\frac{DF}{Dt}=0.
$$

于是

$$
\frac{DF}{Dt}
=\frac{dy}{dt}
-\frac{\partial\eta}{\partial t}
-\frac{\partial\eta}{\partial x}\frac{dx}{dt}
-\frac{\partial\eta}{\partial z}\frac{dz}{dt}=0.
$$

写成速度势形式为

$$
\frac{\partial\eta}{\partial t}
=v-u\frac{\partial\eta}{\partial x}
-w\frac{\partial\eta}{\partial z}
=\frac{\partial\phi}{\partial y}
-\frac{\partial\phi}{\partial x}\frac{\partial\eta}{\partial x}
-\frac{\partial\phi}{\partial z}\frac{\partial\eta}{\partial z}.
$$

边界条件里带有未知 $\eta$，因此还需要进一步简化。

### 第 66 页：自由面条件、小振幅假设与分离变量（原 PDF 复校）

由理想、不可压、体积力有势、无涡流动的 Cauchy-Lagrange 积分，得

$$
\frac{\partial\phi}{\partial t}
+\frac{|\mathbf u|^2}{2}
+gy+\frac{p_a}{\rho}=0.
$$

对波长较长的重力波，不同于毛细波，可以忽略表面张力，并视 $p_a$ 为大气压。将 $y=\eta$ 代入上式得

$$
\frac{\partial\phi}{\partial t}
+\frac{1}{2}|\nabla\phi|^2
+g\eta=0.
$$

对 $t$ 微分以消去上边界中的 $\eta$，有

$$
\frac{\partial^2\phi}{\partial t^2}
+\frac{1}{2}\frac{\partial}{\partial t}|\nabla\phi|^2
+g\left(
\frac{\partial\phi}{\partial y}
-\frac{\partial\phi}{\partial x}\frac{\partial\eta}{\partial x}
-\frac{\partial\phi}{\partial z}\frac{\partial\eta}{\partial z}
\right)=0.
$$

这是重要的简化假设：假设水波的振幅很小。

#### 线性波理论

把二阶小量略去后，有

$$
\begin{cases}
\nabla^2\phi=0,\\[4pt]
\dfrac{\partial^2\phi}{\partial t^2}
+g\dfrac{\partial\phi}{\partial y}=0,\qquad y=0,\\[6pt]
\dfrac{\partial\phi}{\partial y}=0,\qquad y=-h.
\end{cases}
$$

现实中波高和波长之比往往在 $0.1$ 以内，由此可知小振幅波近似度较高；但随着时间推移，非线性项的作用会有明显影响，即非线性效应。

为解

$$
\frac{\partial^2\phi}{\partial x^2}
+\frac{\partial^2\phi}{\partial y^2}=0,
\qquad (4)
$$

作分离变量，设

$$
\phi(x,y,t)=\overline{\phi}(x,y)T(t),
\qquad
\overline{\phi}(x,y)=X(x)Y(y).
\qquad (5)
$$

代入式 (4) 得空间项

$$
\overline{\phi}_{xx}+\overline{\phi}_{yy}=0.
\qquad (6)
$$

再代入边界条件：

$$
\begin{cases}
T''\,\overline{\phi}+gT\,\overline{\phi}_y=0,\qquad y=0,\\[4pt]
\overline{\phi}_y=0,\qquad y=-h.
\end{cases}
\qquad (7),(8)
$$

令

$$
\overline{\phi}(x,y)=X(x)Y(y).
\qquad (9)
$$

代入式 (6) 得

$$
-\frac{X''}{X}=\frac{Y''}{Y}=A.
\qquad (10)
$$

1. 若 $A>0$，即 $A=k^2$，则

$$
\begin{cases}
Y''+k^2Y=0,\\
X''-k^2X=0,
\end{cases}
$$

$$
Y(y)=A_1e^{iky}+B_1e^{-iky},
\qquad
X(x)=A_2e^{kx}+B_2e^{-kx}.
$$

2. 若 $A<0$，即 $A=-k^2$，则

$$
Y(y)=A_1'e^{ky}+B_1'e^{-ky},
\qquad
X(x)=A_2'e^{ikx}+B_2'e^{-ikx}.
\qquad (11)
$$

3. 若 $A=0$，则

$$
Y(y)=A_1''y+B_1'',
\qquad
X(x)=A_2''x+B_2''.
$$

$x$ 方向传播的振荡介质，应为第 2 种情形。

### 第 67 页：线性重力波频散关系与自由面表达（原 PDF 复校）

代入底面边界条件可得

$$
\left(A_2e^{ikx}+B_2e^{-ikx}\right)
\left(A_1'ke^{-kh}-B_1'ke^{kh}\right)=0.
$$

由条件二，

$$
A_1'=\frac{C}{2}e^{kh},
\qquad
B_1'=\frac{C}{2}e^{-kh}.
$$

代入前式，得

$$
\phi=C\frac{e^{k(y+h)}+e^{-k(y+h)}}{2}
\left(A_2'e^{ikx}+B_2'e^{-ikx}\right)
=\cosh k(y+h)\left(A_2'e^{ikx}+B_2'e^{-ikx}\right).
\qquad (12)
$$

$k$ 即是波数。

由自由面条件得到

$$
\frac{T''}{T}=-g\,\frac{\Phi_y}{\Phi},
\qquad y=0.
\qquad (13)
$$

若 $B>0$，即 $B=\omega^2$，则

$$
T(t)=A_3'e^{\omega t}+B_3'e^{-\omega t},
\qquad
\Phi_y=-\frac{\omega^2}{g}\Phi,\quad y=0.
$$

若 $B<0$，即 $B=-\omega^2$，则

$$
T(t)=A_3'e^{i\omega t}+B_3'e^{-i\omega t},
\qquad
\Phi_y=-\frac{\omega^2}{g}\Phi,\quad y=0.
\qquad (14)
$$

若 $B=0$，则

$$
T(t)=A_3't+B_3',
\qquad
\Phi_y=0,\quad y=0.
$$

要求 $T(t)$ 为周期的，故选 $B<0$ 的情形。

由 (5)、(12)、(14)，有

$$
\phi(x,y,t)=\cosh k(y+h)
\left(A_2'e^{ikx}+B_2'e^{-ikx}\right)
\left(A_3'e^{i\omega t}+B_3'e^{-i\omega t}\right).
\qquad (15)
$$

由 (14) 中的边界条件，联立 (12) 得

$$
\omega^2=gk\tanh(kh).
$$

$\omega$ 是频率。频率和波数间的关系，即水波的频散关系。

对无限水深，

$$
\lim_{h\to\infty}\tanh(kh)=1,
$$

故

$$
\omega^2=gk,
\qquad (17)
$$

这是深水重力波的频散关系。

由波速

$$
c=\frac{\omega}{k},
$$

得

$$
c^2=\frac{g}{k}\tanh(kh).
\qquad (18)
$$

当 $h\to\infty$ 时，

$$
c=\sqrt{\frac{g}{k}}=\frac{g}{\omega}.
$$

下观察式 (15) 中的解：

$$
\phi(x,y,t)=\cosh k(y+h)
\left(C_1e^{i(kx+\omega t)}
+C_2e^{i(kx-\omega t)}
+C_3e^{-i(kx-\omega t)}
+C_4e^{-i(kx+\omega t)}\right).
$$

以 $x$ 传播波为例：

$$
\phi=C_2\cosh k(y+h)e^{i(kx-\omega t)}.
$$

自由面动力学条件小振幅波线性化后，略去二次小量，得

$$
\eta=-\left.\frac{1}{g}\frac{\partial\phi}{\partial t}\right|_{y=0}
=\frac{i\omega C_2}{g}\cosh(kh)e^{i(kx-\omega t)}.
$$

令

$$
A=\frac{i\omega C_2}{g}\cosh(kh),
$$

则

$$
\eta=Ae^{i(kx-\omega t)}.
$$

取实部：

$$
\eta=A\cos(kx-\omega t).
$$

### 第 68 页：深水重力波质点轨迹与毛细-重力波（原 PDF 复校）

下面跟踪流点，看轨迹，以深水重力波为例：

$$
u=\frac{\partial\phi}{\partial x}
=Ae^{ky}\omega\cos(kx-\omega t),
\qquad
v=\frac{\partial\phi}{\partial y}
=Ae^{ky}\omega\sin(kx-\omega t).
$$

质点轨迹：

$$
\frac{dx}{dt}=u,
\qquad
\frac{dy}{dt}=v.
$$

积分得

$$
x=x_0-Ae^{ky_0}\sin(kx_0-\omega t),
$$

$$
y=y_0+Ae^{ky_0}\cos(kx_0-\omega t).
$$

轨迹都是圆，越近水面速度越大。

若非线性，会发生同方向的向前飘移，即 Stokes 漂移。

下面考虑小振幅毛细波：

$$
p-p_0=-\sigma\left(\frac{1}{R_1}+\frac{1}{R_2}\right).
\qquad (1)
$$

在振幅小、用波面斜率近似时，

$$
p-p_0=-\sigma\frac{\partial^2\eta}{\partial x^2}.
\qquad (2)
$$

动力学边界条件：

$$
\frac{\partial\phi}{\partial t}
+g\eta-\frac{\sigma}{\rho}\frac{\partial^2\eta}{\partial x^2}=0.
\qquad (3)
$$

由

$$
\frac{\partial\eta}{\partial t}
=\frac{\partial\phi}{\partial y}
$$

可得

$$
\frac{\partial^2\phi}{\partial t^2}
=\left(\frac{\sigma}{\rho}\frac{\partial^2}{\partial x^2}-g\right)
\frac{\partial\phi}{\partial y}.
\qquad (4)
$$

代入

$$
\phi=C_2\cosh k(y+h)\cos(kx-\omega t),
$$

得

$$
-\omega^2\cosh(kh)+gk\sinh(kh)
+\frac{\sigma k^3}{\rho}\sinh(kh)=0.
$$

即

$$
\omega^2=gk\tanh(kh)+\frac{\sigma k^3}{\rho}\tanh(kh).
\qquad (5)
$$

换为波速：

$$
c^2=\left(\frac{g}{k}+\frac{\sigma k}{\rho}\right)\tanh(kh).
\qquad (6)
$$

此为重力毛细波。

当 $h\to\infty$，

$$
c^2=\frac{g}{k}+\frac{\sigma k}{\rho}.
\qquad (7)
$$

若波长很长，即 $k\to0$ 时，

$$
c^2\approx\frac{g}{k}\tanh(kh),
$$

主要为重力波；当 $h\to\infty$ 时，

$$
c^2=\frac{g}{k}.
$$

当 $k\to\infty$ 时，

$$
c^2\approx\frac{\sigma k}{\rho},
$$

主要为毛细波。页内图示给出临界波长

$$
L_m=1.78\ \mathrm{cm},
$$

当 $\lambda<L_m$ 时为毛细波。以波速 $c$ 看，$1\ \mathrm{m}$ 长的波约有

$$
c=1.3\ \mathrm{m/s}.
$$

### 第 69 页：流体力学 II，边界层理论基本思想（原 PDF 复校）

流体力学 II：边界层（绕流，黏性流）。

#### 边界层理论

#### 一、着眼于边界层微分方程

边界层理论的基本思想，仍从 N-S 方程出发：

$$
\begin{cases}
\dfrac{\partial u}{\partial t}
+u\dfrac{\partial u}{\partial x}
+v\dfrac{\partial u}{\partial y}
+w\dfrac{\partial u}{\partial z}
=-\dfrac{1}{\rho}\dfrac{\partial p}{\partial x}
+\dfrac{\mu}{\rho}\nabla^2u+F_x,\\[6pt]
\dfrac{\partial v}{\partial t}
+u\dfrac{\partial v}{\partial x}
+v\dfrac{\partial v}{\partial y}
+w\dfrac{\partial v}{\partial z}
=-\dfrac{1}{\rho}\dfrac{\partial p}{\partial y}
+\dfrac{\mu}{\rho}\nabla^2v+F_y,\\[6pt]
\dfrac{\partial w}{\partial t}
+u\dfrac{\partial w}{\partial x}
+v\dfrac{\partial w}{\partial y}
+w\dfrac{\partial w}{\partial z}
=-\dfrac{1}{\rho}\dfrac{\partial p}{\partial z}
+\dfrac{\mu}{\rho}\nabla^2w+F_z.
\end{cases}
$$

右侧惯性项相当于质量为 $m$ 的物体所受的 $ma$。以流固体考虑，绕过物体时受阻力，故又称惯性力。

Reynolds 数：

$$
Re=\frac{UL}{\nu}
=\frac{\text{惯性力}}{\text{黏性力}}.
$$

均匀来流绕过物体造成巨大冲击力。实验证明，物体周围流速从 $0$ 到 $U$ 的距离在任何情况下都非常短，故黏性力项

$$
\mu\frac{du}{dy}
$$

很大，且在边界中 $u,p$ 等物理量均有巨大落差。即使 $Re$ 很大，黏性力整体不如惯性力，但在物体边界附近黏性力还很占优势，此时若使用理想流体理论会出错。

Blasius 定理是纯理想，而此处考虑黏性流体，故需建立边界层理论。

1904 年德国 Prandtl 建立边界层理论，其基本思想为：

1. 分开处理：靠近边界的小区域，即边界层，认为是黏性流体；边界层外部若 $Re$ 很大，则认为是理想流体。
2. 简化内部：在边界层内作量纲估计，忽略 N-S 方程中的小量。

### 第 70 页：平板定常边界层微分方程与量级估计（原 PDF 复校）

#### 二、平板定常边界层微分方程

平面均匀不可压、不计质量力、定常时，速度为 $99\%U$ 的点即为边界层的边界；所有边界点连线，即边界层的外缘。上游薄、下游厚，越往下游越减速。

利用尺度 $L,\delta,U,V$ 进行量纲化：

$$
u'=\frac{u}{U},\qquad
x'=\frac{x}{L},\qquad
y'=\frac{y}{\delta},\qquad
v'=\frac{v}{V}.
$$

于是

$$
\frac{\partial u}{\partial x}
=\frac{U}{L}\frac{\partial u'}{\partial x'},
\qquad
\frac{\partial^2u}{\partial x^2}
=\frac{U}{L^2}\frac{\partial^2u'}{\partial (x')^2},
$$

$$
\frac{\partial u}{\partial y}
=\frac{U}{\delta}\frac{\partial u'}{\partial y'},
\qquad
\frac{\partial^2u}{\partial y^2}
=\frac{U}{\delta^2}\frac{\partial^2u'}{\partial (y')^2},
$$

$$
\frac{\partial v}{\partial x}
=\frac{V}{L}\frac{\partial v'}{\partial x'},
\qquad
\frac{\partial^2v}{\partial x^2}
=\frac{V}{L^2}\frac{\partial^2v'}{\partial (x')^2},
$$

$$
\frac{\partial v}{\partial y}
=\frac{V}{\delta}\frac{\partial v'}{\partial y'},
\qquad
\frac{\partial^2v}{\partial y^2}
=\frac{V}{\delta^2}\frac{\partial^2v'}{\partial (y')^2}.
$$

实验说明，$u',v',x',y'$ 数量级均为 $1$。

二维、定常、不计质量力时：

$$
\rho u\frac{\partial u}{\partial x}
+\rho v\frac{\partial u}{\partial y}
=-\frac{\partial p}{\partial x}
+\mu\left(\frac{\partial^2u}{\partial x^2}
+\frac{\partial^2u}{\partial y^2}\right)
\qquad (1)
$$

$$
\rho u\frac{\partial v}{\partial x}
+\rho v\frac{\partial v}{\partial y}
=-\frac{\partial p}{\partial y}
+\mu\left(\frac{\partial^2v}{\partial x^2}
+\frac{\partial^2v}{\partial y^2}\right)
\qquad (2)
$$

$$
\frac{\partial u}{\partial x}
+\frac{\partial v}{\partial y}=0
\qquad (3)
$$

由连续方程估计

$$
\frac{V}{\delta}\sim\frac{U}{L}
\quad\Rightarrow\quad
V\sim\frac{U\delta}{L}.
$$

在边界层中：

$$
O\left(\rho u\frac{\partial u}{\partial x}\right)
=O\left(\rho\frac{U^2}{L}\right),
\qquad
O\left(\rho v\frac{\partial u}{\partial y}\right)
=O\left(\rho\frac{U^2}{L}\right).
$$

又有

$$
O\left(\mu\frac{\partial^2u}{\partial x^2}\right)
=O\left(\mu\frac{U}{L^2}\right),
\qquad
O\left(\mu\frac{\partial^2u}{\partial y^2}\right)
=O\left(\mu\frac{U}{\delta^2}\right).
$$

因边界层中惯性力与黏性力同阶：

$$
O\left(\rho\frac{U^2}{L}\right)
=O\left(\mu\frac{U}{\delta^2}\right).
$$

故

$$
O(\delta)
=\sqrt{\frac{\mu L}{\rho U}}
=\frac{L}{\sqrt{Re}}.
$$

Reynolds 数越大，边界层越薄。

### 第 71-72 页：位移厚度和动量损失厚度（原 PDF 复校）

约化后的边界层微分方程：

$$
\begin{cases}
\rho\left(u\dfrac{\partial u}{\partial x}
+v\dfrac{\partial u}{\partial y}\right)
=-\dfrac{\partial p}{\partial x}
+\mu\dfrac{\partial^2u}{\partial y^2},\\[6pt]
\dfrac{\partial p}{\partial y}=0,\\[6pt]
\dfrac{\partial u}{\partial x}
+\dfrac{\partial v}{\partial y}=0.
\end{cases}
$$

边界条件：

$$
y=0\text{ 时},\quad u=0,\quad v=0;
\qquad
y=\delta\text{ 时},\quad u=U(x),\quad \frac{\partial u}{\partial y}=0.
$$

$$
\frac{\partial p}{\partial y}=0
$$

表示沿边界层法向压强不变，可用计算物面上的压强。流动中第四章 Blasius 定理是纯理想，第五章黏性流体中小球阻力限于低雷诺数；而边界层中 $Re$ 较大。

#### 三、位移厚度和动量损失厚度

#### 1. 位移厚度

粘性流体通过 AC 的流量，对理想流体经 AB 的同等流量，厚度差 BC 即为位移厚度 $\delta^*$。

理想流体经 AB 流量：

$$
Q_1=U(\delta-\delta^*) \qquad (1)
$$

粘性流体经 AC 流量：

$$
Q_2=\int_0^\delta u\,dy \qquad (2)
$$

令 $Q_1=Q_2$ 有

$$
U(\delta-\delta^*)=\int_0^\delta u\,dy \qquad (3)
$$

所以

$$
U\delta^*=\int_0^\delta (U-u)\,dy \qquad (4)
$$

$$
\delta^*=\int_0^\delta \left(1-\frac{u}{U}\right)dy \qquad (5)
$$

$AC$ 是边界层全部厚度，$\delta,\delta^*$ 都是 $x$ 的函数。

若理想流体、粘性流体均流经 $AC$，则流量损失

$$
\Delta Q=\int_0^\delta (U-u)\,dy \qquad (6)
$$

令

$$
U\delta^*=\Delta Q \qquad (7)
$$

得

$$
\delta^*=\int_0^\delta \left(1-\frac{u}{U}\right)dy \qquad (8)
$$

这也能得到位移厚度 $\delta^*$。曲线下 $OL$ 下面积为

$$
\int_0^\delta (U-u)\,dy,
$$

令

$$
U\delta^*=\int_0^\delta (U-u)\,dy,
$$

则

$$
\delta^*=\int_0^\delta \left(1-\frac{u}{U}\right)dy=MP.
$$

#### 2. 动量损失厚度

理想流体流过 AB 的动量流量：

$$
M_1=\rho U^2(\delta-\delta^*) \qquad (9)
$$

粘性流体流过 AC 的动量流量：

$$
M_2=\int_0^\delta \rho u^2\,dy \qquad (10)
$$

动量损失：

$$
\Delta M=M_1-M_2=\rho U^2(\delta-\delta^*)-\int_0^\delta \rho u^2\,dy \qquad (11)
$$

将式 (3) 代入式 (11)：

$$
\Delta M=\int_0^\delta \rho uU\,dy-\int_0^\delta \rho u^2\,dy
=\int_0^\delta \rho u(U-u)\,dy \qquad (12)
$$

令

$$
\rho U^2\delta^{**}=\Delta M \qquad (13)
$$

有

$$
\delta^{**}
=\int_0^\delta
\frac{u}{U}\left(1-\frac{u}{U}\right)dy \qquad (14)
$$

$\delta^{**}$ 叫动量损失厚度。

---

### 第 73 页：边界层相似变换与 Falkner-Skan 条件（原 PDF 复校）

设

$$
g(x)=h\delta(x).
$$

由

$$
u=U(x)f'(\eta),
\qquad
\psi=U(x)g(x)f(\eta),
$$

以及

$$
\eta=\frac{y}{g(x)}
$$

可得

$$
\frac{\partial \psi}{\partial y}
=
\frac{U}{g}g f'
=
Uf',
$$

$$
\frac{\partial\psi}{\partial x}
=
(Ug)'f+Ug f'\frac{\partial\eta}{\partial x}.
$$

其中

$$
\frac{\partial\eta}{\partial x}
=
-\frac{g'}{g^2}y
=
-\frac{g'}{g}\eta.
$$

代入边界层方程后，原页写成

$$
f'''
+
\frac{g(Ug)'}{\nu}ff''
+
\frac{g^2U'}{\nu}
\left[
1-(f')^2
\right]
=0.
$$

在上式中，$g(x)$、$U(x)$ 仍为函数。为使方程中只剩 $\eta$ 与 $f(\eta)$，令

$$
\frac{g(Ug)'}{\nu}=c_1,
\qquad
\frac{g^2U'}{\nu}=m.
$$

由

$$
\frac{1}{\nu}\frac{d}{dx}(g^2U)=2c_1-m
$$

得

$$
g^2=C(2c_1-m)\frac{\nu x}{U},
$$

故略去常数有

$$
g\sim\sqrt{\frac{\nu x}{U}}.
$$

于是可取

$$
\eta=y\sqrt{\frac{U}{\nu x}}.
$$

将上式代入 $g^2U'/\nu=m$，可得

$$
xU'=mU,
$$

从而

$$
U=Cx^m.
$$

这就是 Falkner-Skan 流；流动相似的条件为上述幂律外流。

### 第 74 页：Falkner-Skan 方程与 Blasius 情形（原 PDF 复校）

代入后得

$$
f'''+\frac{m+1}{2}ff''
-m(f')^2+m=0.
$$

边界条件：

$$
f=f'=0\qquad(\eta=0),
$$

$$
f'\to 1\qquad(\eta\to\infty).
$$

二、平板线边界层流动（Blasius 解）。Falkner 流中

$$
m=0,
\qquad
U_0=\mathrm{const}.
$$

方程组为

$$
\begin{cases}
u\dfrac{\partial u}{\partial x}
+v\dfrac{\partial u}{\partial y}
=
\nu\dfrac{\partial^2u}{\partial y^2},\\[6pt]
\dfrac{\partial u}{\partial x}
+\dfrac{\partial v}{\partial y}=0,\\[6pt]
u=v=0\quad(y=0),\\[4pt]
u\to U_0\quad(y\to\infty),\\[4pt]
u=0\quad(x=0).
\end{cases}
$$

引入

$$
\eta=y\sqrt{\frac{U_0}{\nu x}},
$$

流函数取

$$
\psi=\sqrt{\nu xU_0}\,f(\eta).
$$

由

$$
u=\frac{\partial\psi}{\partial y},
\qquad
v=-\frac{\partial\psi}{\partial x}
$$

有

$$
u=U_0f'(\eta),
$$

$$
v=
\frac12\sqrt{\frac{\nu U_0}{x}}
\left(\eta f'-f\right).
$$

得 $m=0$ 时方程为

$$
2f'''+ff''=0.
$$

边界条件：

$$
f=f'=0\qquad(\eta=0),
$$

$$
f'\to 1\qquad(\eta\to\infty).
$$

第一页底部给出幂级数展开：

$$
f(\eta)=a_0+a_1\eta+a_2\frac{\eta^2}{2!}
+a_3\frac{\eta^3}{3!}+\cdots .
$$

由边界条件，上式恒定项中

$$
a_3=a_4=a_6=a_7=a_9=a_{10}=\cdots=0.
$$

所有非零项可由 $a_2$ 表示。

### 第 75 页：Blasius 数值结果与两层流体入口（原 PDF 复校）

由式（12）代入得

$$
a_2=0.33206.
$$

图中给出 $u/U_0$ 随 $\eta$ 的数值解曲线。

由

$$
u=U_0f'(\eta),
\qquad
\eta=y\sqrt{\frac{U_0}{\nu x}},
$$

故

$$
\left(\frac{\partial u}{\partial y}\right)_0
=
U_0 f''(0)\sqrt{\frac{U_0}{\nu x}}.
$$

作用在平板上的切应力为

$$
\tau_0
=
\mu\left(\frac{\partial u}{\partial y}\right)_0
=
\mu U_0\sqrt{\frac{U_0}{\nu x}}\,f''(0).
$$

切应力系数为

$$
C_f
=
\frac{\tau_0}{\frac12\rho U_0^2}
=
\frac{0.664}{\sqrt{U_0x/\nu}}
=
\frac{0.664}{\sqrt{Re_x}}.
$$

位移厚度：

$$
D
=
\int_0^\delta
\left(1-\frac{u}{U_0}\right)dy
=
1.7208\sqrt{\frac{\nu x}{U_0}}.
$$

边界层厚度：由图，当 $\eta\approx5$ 时，$u/U_0\approx 0.99$，故

$$
\delta\approx 5.0\sqrt{\frac{\nu x}{U_0}}.
$$

三、平行流体间的边界层。

上层流体边界层：

$$
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
=
\nu_1\frac{\partial^2u}{\partial y^2}.
$$

下层流体边界层：

$$
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
=
\nu_2\frac{\partial^2u}{\partial y^2}.
$$

设上层流体为 1，下层流体为 2：

$$
\eta_1=y\sqrt{\frac{U_1}{\nu_1x}},
\qquad
\psi_1=\sqrt{\nu_1xU_1}\,f_1(\eta_1).
$$

则

$$
u=U_1f_1'(\eta_1),
\qquad
v=\frac12\sqrt{\frac{\nu_1U_1}{x}}
\left(\eta_1f_1'-f_1\right),
$$

并有

$$
2f_1'''+f_1f_1''=0.
$$

对下层流体：

$$
\eta_2=y\sqrt{\frac{U_2}{\nu_2x}},
\qquad
\psi_2=\sqrt{\nu_2xU_2}\,f_2(\eta_2).
$$

于是

$$
u=U_2f_2'(\eta_2),
\qquad
v=\frac12\sqrt{\frac{\nu_2U_2}{x}}
\left(\eta_2f_2'-f_2\right),
$$

并有

$$
2f_2'''+f_2f_2''=0.
$$

下层流体以 $U_2$ 为相似依据。

### 第 76-77 页：双层流体边界层的界面条件（原 PDF 复校）

边界条件：

$$
\eta_1=\infty,\qquad f_1'=1\quad (u\to U_1),
$$

$$
\eta_2=-\infty,\qquad f_2'=\frac{U_2}{U_1}=\lambda .
$$

当 $\eta_1=\eta_2=0$ 时，

$$
v=0,
$$

边界是流线，边界随点不离边界。

由式（4）得

$$
\eta_1=0,\qquad f_1=0.
$$

由式（7）得

$$
\eta_2=0,\qquad f_2=0.
$$

取界面线网，则当 $\eta_1=\eta_2=0$ 时，上层、下层切向速度连续：

$$
U_{\text{上层}}=U_{\text{下层}},
\qquad f_1'=f_2'.
$$

切应力连续条件写作

$$
\mu_1\frac{\partial u_1}{\partial y}
=
\mu_2\frac{\partial u_2}{\partial y}.
$$

由

$$
u_1=U_1 f_1'(\eta_1),
\qquad
u_2=U_2 f_2'(\eta_2)
$$

得

$$
\eta_1=\eta_2=0,\qquad
\rho_1^{1/2}U_1^{3/2}f_1''
=
\rho_2^{1/2}U_2^{3/2}f_2''.
$$

图中给出参数

$$
K=\frac{\rho_2\mu_2}{\rho_1\mu_1},
\qquad
\lambda=\frac{U_2}{U_1}.
$$

图旁注：若想 $K$ 很大，下部粘如固体；$\lambda$ 很小时，下部不流动。

### 第 78-80 页：边界层积分方程与附加边界条件（原 PDF 复校）

#### 一、边界层微分方程的积分

边界层方程：

$$
\rho\left(
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
\right)
=
-\frac{\partial p}{\partial x}
+\mu\frac{\partial^2u}{\partial y^2}.
$$

乘以 $u^K\,dy$，并对整个边界层厚度积分：

$$
\int_0^\delta \rho u^{K+1}\frac{\partial u}{\partial x}\,dy
+
\int_0^\delta \rho v u^K\frac{\partial u}{\partial y}\,dy
=
-\frac{\partial p}{\partial x}\int_0^\delta u^K\,dy
+\mu\int_0^\delta u^K\frac{\partial^2u}{\partial y^2}\,dy.
$$

其中

$$
\frac{\partial p}{\partial y}=0.
$$

第一项可写为

$$
\int_0^\delta \rho u^{K+1}\frac{\partial u}{\partial x}\,dy
=
\frac{\rho}{K+2}
\left[
\frac{\partial}{\partial x}\int_0^\delta u^{K+2}\,dy
-U^{K+2}\frac{d\delta}{dx}
\right].
$$

第二项利用连续方程整理为

$$
\int_0^\delta \rho v u^K\frac{\partial u}{\partial y}\,dy
=
\frac{\rho}{K+1}
\left[
U^{K+1}\frac{d}{dx}\int_0^\delta u\,dy
-\int_0^\delta u^{K+1}\frac{\partial u}{\partial x}\,dy
\right].
$$

黏性项为

$$
\int_0^\delta u^K\frac{\partial^2u}{\partial y^2}\,dy
=
\left.u^K\frac{\partial u}{\partial y}\right|_0^\delta
-K\int_0^\delta u^{K-1}
\left(\frac{\partial u}{\partial y}\right)^2dy.
$$

由边界条件和连续方程可得边界关系：

$$
\left.u^{K+2}\right|_0^\delta=U^{K+2},
\qquad
\left.u^K\frac{\partial u}{\partial y}\right|_0^\delta=0.
$$

整理后，原页给出的积分形式为

$$
\frac{1}{K+1}\frac{\partial}{\partial x}
\int_0^\delta \rho u^{K+2}\,dy
-
\frac{U^{K+1}}{K+1}
\frac{\partial}{\partial x}
\int_0^\delta \rho u\,dy
=
-\frac{\partial p}{\partial x}\int_0^\delta u^K\,dy
-\mu\left(u^K\frac{\partial u}{\partial y}\right)_0
-K\int_0^\delta u^{K-1}
\left(\frac{\partial u}{\partial y}\right)^2dy.
$$

令 $K=0$，得 Karman 动量积分方程：

$$
\rho\frac{\partial}{\partial x}\int_0^\delta u^2\,dy
-
\rho U\frac{\partial}{\partial x}\int_0^\delta u\,dy
=
-\frac{\partial p}{\partial x}\delta
-\mu\left(\frac{\partial u}{\partial y}\right)_0.
$$

图中标出各项物理意义：单位时间动量改变、两截面压力差、底部黏性阻力，以及 CD 面流出动量等。

令 $K=1$，得能量积分方程。原页将各项圈出，标注为单位时间 AD、BC 面流出的动能、压力做功率，以及单位时间耗散的能量。

利用积分方程求边界层方程的近似解思路：

1. 取试解

$$
u=\sum C_n y^n.
$$

若为保证精度，取 $C_n$ 至少展开到 4 项，需要 4 个边界条件。

2. 附加边界条件：特区域内应用时，边界处方程给出边界条件。

3. 积分方程联立求解 $\delta(x)$。

#### 二、附加边界条件

边界层方程：

$$
\begin{cases}
\rho\left(
u\dfrac{\partial u}{\partial x}
+v\dfrac{\partial u}{\partial y}
\right)
=-\dfrac{\partial p}{\partial x}
+\mu\dfrac{\partial^2u}{\partial y^2},\\[6pt]
\dfrac{\partial p}{\partial y}=0,\\[6pt]
\dfrac{\partial u}{\partial x}
+\dfrac{\partial v}{\partial y}=0.
\end{cases}
$$

边界条件即在边界满足的条件。附加边界条件为：方程、方程 $n$ 次 $y$ 微分在边界满足。

将方程用于平板，由 $y=0$ 时 $u=v=0$，得

$$
\left.\frac{\partial^2u}{\partial y^2}\right|_{y=0}
=
\frac{1}{\mu}\frac{\partial p}{\partial x}.
$$

对第一式两边同时对 $y$ 求微商，并利用 $y=0$ 时 $u=v=0$ 和连续方程，得

$$
\left.\frac{\partial^3u}{\partial y^3}\right|_{y=0}=0.
$$

用闭边界：由边界条件 $y=\delta$ 时

$$
u=U(x),
\qquad
\frac{\partial u}{\partial y}=0.
$$

由第一式得

$$
\left.\rho u\frac{\partial u}{\partial x}\right|_{y=\delta}
=
-\frac{\partial p}{\partial x}
+\left.\mu\frac{\partial^2u}{\partial y^2}\right|_{y=\delta}.
$$

即

$$
\left.\rho U\frac{dU}{dx}\right|_{y=\delta}
=
-\frac{\partial p}{\partial x}
+\left.\mu\frac{\partial^2u}{\partial y^2}\right|_{y=\delta}.
$$

对外部流动有 Bernoulli 关系

$$
p=C-\frac12\rho U^2,
\qquad
\frac{\partial p}{\partial x}
=-\rho U\frac{dU}{dx}.
$$

于是得到边界层条件

$$
y=\delta\quad\text{时}\quad
\frac{\partial^2u}{\partial y^2}=0.
$$

定常、无旋、正压流体、体积力有势时，在同一流线或涡线上

$$
\nabla E
=
\nabla\left(
\frac{u^2}{2}
+\frac{p}{\rho}
+\pi
\right)=0.
$$

### 第 81 页：平板绕流的三次速度型与动量积分法（原 PDF 复校）

#### §4 积分法应用

二、平板绕流。

由 Bernoulli 关系

$$
p=C-\frac12\rho U^2
$$

知外部流动区

$$
\frac{\partial p}{\partial x}=0,
\qquad
\frac{\partial p}{\partial y}=0.
$$

由于顺压时

$$
\frac{\partial p}{\partial x}=0,
$$

边界层方程退为

$$
\rho\left(
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
\right)
=
\mu\frac{\partial^2u}{\partial y^2},
$$

并有连续方程

$$
\frac{\partial u}{\partial x}
+\frac{\partial v}{\partial y}=0.
$$

边界条件：

$$
y=0:\quad u=v=0,
$$

$$
y=\delta:\quad u=U,\qquad
\frac{\partial u}{\partial y}=0.
$$

取试解

$$
u=C_0+C_1y+C_2y^2+C_3y^3.
$$

附加边界条件为

$$
y=0:\quad
\frac{\partial^2u}{\partial y^2}
=
\frac{1}{\mu}\frac{\partial p}{\partial x}=0.
$$

由以上条件可得

$$
C_0=0,\qquad
C_2=0,
$$

$$
C_1=\frac{3U}{2\delta},
\qquad
C_3=-\frac{U}{2\delta^3}.
$$

于是

$$
u=\frac{3U}{2\delta}y
-\frac{U}{2\delta^3}y^3.
$$

即

$$
\frac{u}{U}
=
\frac32\eta-\frac12\eta^3,
\qquad
\eta=\frac{y}{\delta}.
$$

将上式代入 Karman 积分方程，得

$$
\rho U^2\left(
\frac{3}{2}-\frac{3}{5}
\right)
\frac{d\delta}{dx}
=
\frac{3\mu U}{2\delta}.
$$

原页整理为

$$
\delta^2
=
\frac{280}{13}\frac{\mu}{\rho U}x.
$$

当 $x=0$ 时 $\delta=0$，故

$$
\delta
=
4.64\sqrt{\frac{\mu x}{\rho U}}
=
4.64\frac{x}{\sqrt{Re_x}}.
$$

### 第 82 页：边界层近似方程与平均加速度近似（原 PDF 复校）

边界层近似方程：

$$
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
=
-\frac{1}{\rho}\frac{\partial p}{\partial x}
+\frac{\mu}{\rho}\frac{\partial^2u}{\partial y^2}.
$$

以前是精确方程近似解，现在是近似方程精确解。

令

$$
W_x
=
\frac{1}{\delta}
\int_0^\delta
\left(
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
\right)\,dy.
$$

利用哥路列夫方程 $K=0$，

$$
W_x
=
\frac{1}{\delta}
\left[
\frac{\partial}{\partial x}\int_0^\delta u^2\,dy
-U\frac{\partial}{\partial x}\int_0^\delta u\,dy
\right].
$$

边界层方程写成

$$
\begin{cases}
\rho W_x
=
-\dfrac{\partial p}{\partial x}
+\mu\dfrac{\partial^2u}{\partial y^2},\\[6pt]
\dfrac{\partial p}{\partial y}=0,\\[6pt]
\dfrac{\partial u}{\partial x}
+\dfrac{\partial v}{\partial y}=0.
\end{cases}
$$

多维近似：用

$$
u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
$$

的断面均值 $W_x$ 代替之。$W_x$ 近似视为常数，$\partial p/\partial x$ 与 $y$ 无关。

解为

$$
u
=
\frac{1}{2\mu}
\left(
\frac{\partial p}{\partial x}
+\rho W_x
\right)y^2
+C_1y+C_2.
$$

边界条件：

$$
y=0:\quad u=0,\quad v=0,
$$

$$
y=\delta:\quad u=U(x),
\qquad
\frac{\partial u}{\partial y}=0.
$$

于是

$$
C_1
=
-2\left[
\frac{1}{2\mu}
\left(
\frac{\partial p}{\partial x}
+\rho W_x
\right)
\right]\delta,
\qquad
C_2=0.
$$

并有

$$
U
=
\frac{1}{2\mu}
\left(
\frac{\partial p}{\partial x}
+\rho W_x
\right)\delta^2+C_1\delta,
$$

即

$$
u
=
-
\frac{U}{\delta^2}
\left(y^2-2\delta y\right).
$$

也即

$$
\frac{u}{U}=2\eta-\eta^2,
\qquad
\eta=\frac{y}{\delta}.
$$

将 $u$ 代入前式，原页整理为

$$
-\frac{\partial p}{\partial x}
-\frac{2\mu U}{\delta^2}
=
\frac{2}{15}
\left(
3\delta\frac{\partial U}{\partial x}
-\frac{U}{\delta}\delta'
\right).
$$

利用

$$
\frac{\partial p}{\partial x}
=
-\rho U\frac{dU}{dx},
$$

有

$$
2\delta\delta'
+9\frac{1}{U}\frac{\partial U}{\partial x}\delta^2
=
\frac{30\mu}{\rho U}.
$$

解为

$$
\delta^2
=
\frac{30\mu}{U^9\rho}
\left(
\int U^8\,dx+C_2
\right).
$$

平板时 $U=\mathrm{const}$，$x=0$ 时 $\delta=0$，故

$$
\delta
=
5.48\sqrt{\frac{\mu x}{\rho U}}.
$$

---

### 第 83 页：§6 绕流阻力和边界层（原 PDF 复校）

图示为圆柱绕流：圆柱前方流线受阻，圆柱上下绕流；上方标有 $u_{\max}, p_{\min}$，下方标有 $u_{\min}, p_{\max}$；圆柱后方为脱体区，旁注“脱体的根本原因：摩擦耗散、逆压区”。

在粘性绕流中，物体后方出现尾迹和脱体，绕流阻力的产生与粘性耗散、逆压区中的边界层分离有关。

一、直观分析。

图示：贴壁流线沿曲壁发展，在点 $S$ 附近发生脱体，分离线后方形成旋涡区。

二、脱体现象速度剖面。

可分为顺压区及脱体前后区。图中在 $M$ 点前后给出速度剖面，顺压区旁标

$$
\frac{\partial p}{\partial x}<0,
$$

逆压区旁标

$$
\frac{\partial p}{\partial x}>0.
$$

在靠壁处，边界层很薄，且物面附近 $u,v$ 很小，边界底层 $y\to 0$。忽略 $u,v$ 后，由边界层方程得

$$
\mu \frac{\partial^2 u}{\partial y^2}=\frac{\partial p}{\partial x}. \tag{1}
$$

在顺压区

$$
\frac{\partial p}{\partial x}<0, \tag{2}
$$

故

$$
\left(\frac{\partial^2u}{\partial y^2}\right)_w<0. \tag{3}
$$

当 $y\to\delta$ 时，$\partial u/\partial y\to 0$，故在顺压区内速度斜率仍沿 $y$ 方向逐渐减小。

### 第 84 页：逆压区与脱体判据（原 PDF 复校）

在逆压区

$$
\frac{\partial p}{\partial x}>0. \tag{5}
$$

由式 (1) 有

$$
\left(\frac{\partial^2u}{\partial y^2}\right)_w>0, \tag{6}
$$

当 $y\to\delta$ 时，$\partial u/\partial y\to 0$，并有

$$
\frac{\partial^2u}{\partial y^2}<0. \tag{7}
$$

因此逆压区边界层内 $\partial^2u/\partial y^2$ 要变号，速度剖面出现拐点。

可通过壁面速度梯度判断脱体：

$$
\left(\frac{\partial u}{\partial y}\right)_w=0
$$

为脱体点；脱体点前

$$
\left(\frac{\partial u}{\partial y}\right)_w>0,
$$

脱体点后

$$
\left(\frac{\partial u}{\partial y}\right)_w<0.
$$

三、流体微团受力分析。

图中将贴壁流体微团分成 $1,2,3$ 三个位置，微团高度标为 $\delta y$。右侧标注切应力沿 $y$ 的变化：

$$
1\to 2:\quad \mu\frac{\partial u}{\partial y},
$$

$$
2\to 3:\quad
\mu\frac{\partial u}{\partial y}
+\frac{\partial}{\partial y}\left(\mu\frac{\partial u}{\partial y}\right)(-\delta y),
$$

故位置 2 所受净摩擦力可写成与

$$
\mu\frac{\partial^2u}{\partial y^2}\,\delta y
$$

同量级的形式。

在顺压区若 $\partial^2u/\partial y^2<0$，则粘性拖曳起阻碍作用；在逆压区的贴近边界若 $\partial^2u/\partial y^2>0$，则摩擦起推动作用；在逆压区的运动层若 $\partial^2u/\partial y^2<0$，则仍起阻碍作用。逆压区内的微团下面贴近壁面，速度低，先停下来。

### 第 85 页：边界层总结（原 PDF 复校）

总结：边界层、减速、薄层。

图示一：液体绕流薄层中给出约 $1\%$、$5\%$、$70\%$ 的速度分布标注，表示贴壁速度从零向外层速度过渡。

图示二：流速低处粘性影响强，边界层随流向发展而增厚。

图示三：边界层未剥离时仍贴附于壁面；若出现逆压区，边界层内速度减小，阻力增加，最终可能发生分离。

精确解、近似解、组织思路。

低阶黏度、动量损失厚度定义，用到自然物理的量纲。

### 第 86 页：湍流理论与平均运动（原 PDF 复校）

湍流理论。

图示为实验管流：开始整齐，随流速增至临界值以后混乱；反来发现临界准则是

$$
\frac{Ud}{\nu}
$$

达到临界值才发生扰乱。

湍流理论很精妙但很粗糙。

一、湍流发生的机理：突变；对初始条件敏感。

二、已经生成的湍流的演变规律。图中用不规则曲线表示湍流瞬时状态，旁注：湍流瞬时状态由扰动因素建立，并具有确定的方程。

第 1 节 平均运动方程。

一、平均运动和脉动运动。

定义时间平均速率：

$$
\overline{A}=\frac{1}{\Delta t}\int_{\Delta t}A(t)\,dt,
$$

则脉动值为

$$
A'=A-\overline{A}.
$$

时间平均的运算规则：

$$
\overline{A}=\overline{A},\qquad \overline{A'}=0,\qquad
\overline{A+B}=\overline{A}+\overline{B},
$$

$$
\overline{cA}=c\overline{A},\qquad
\overline{AB}=\overline{A}\,\overline{B}+\overline{A'B'},
$$

$$
\overline{\frac{\partial A}{\partial s}}
=\frac{\partial \overline{A}}{\partial s},\qquad
\overline{\int A\,ds}=\int\overline{A}\,ds.
$$

二、平均运动方程。

对不可压缩流体，$N$-$S$ 方程为

$$
\begin{cases}
\dfrac{\partial u}{\partial t}
+u\dfrac{\partial u}{\partial x}
+v\dfrac{\partial u}{\partial y}
+w\dfrac{\partial u}{\partial z}
=X-\dfrac{1}{\rho}\dfrac{\partial p}{\partial x}+\nu\nabla^2u,\\[6pt]
\dfrac{\partial v}{\partial t}
+u\dfrac{\partial v}{\partial x}
+v\dfrac{\partial v}{\partial y}
+w\dfrac{\partial v}{\partial z}
=Y-\dfrac{1}{\rho}\dfrac{\partial p}{\partial y}+\nu\nabla^2v,\\[6pt]
\dfrac{\partial w}{\partial t}
+u\dfrac{\partial w}{\partial x}
+v\dfrac{\partial w}{\partial y}
+w\dfrac{\partial w}{\partial z}
=Z-\dfrac{1}{\rho}\dfrac{\partial p}{\partial z}+\nu\nabla^2w,\\[6pt]
\dfrac{\partial u}{\partial x}+\dfrac{\partial v}{\partial y}+\dfrac{\partial w}{\partial z}=0.
\end{cases}
$$

### 第 87 页：Reynolds 平均方程与 Reynolds 应力（原 PDF 复校）

对方程组各式进行时间平均，可得

$$
\begin{cases}
\dfrac{\partial \overline{u}}{\partial t}
+\overline{u}\dfrac{\partial \overline{u}}{\partial x}
+\overline{v}\dfrac{\partial \overline{u}}{\partial y}
+\overline{w}\dfrac{\partial \overline{u}}{\partial z}
+\dfrac{\partial\overline{(u')^2}}{\partial x}
+\dfrac{\partial\overline{u'v'}}{\partial y}
+\dfrac{\partial\overline{u'w'}}{\partial z}
=X-\dfrac{1}{\rho}\dfrac{\partial \overline{p}}{\partial x}+\nu\nabla^2\overline{u},\\[6pt]
\dfrac{\partial \overline{v}}{\partial t}
+\overline{u}\dfrac{\partial \overline{v}}{\partial x}
+\overline{v}\dfrac{\partial \overline{v}}{\partial y}
+\overline{w}\dfrac{\partial \overline{v}}{\partial z}
+\dfrac{\partial\overline{u'v'}}{\partial x}
+\dfrac{\partial\overline{(v')^2}}{\partial y}
+\dfrac{\partial\overline{v'w'}}{\partial z}
=Y-\dfrac{1}{\rho}\dfrac{\partial \overline{p}}{\partial y}+\nu\nabla^2\overline{v},\\[6pt]
\dfrac{\partial \overline{w}}{\partial t}
+\overline{u}\dfrac{\partial \overline{w}}{\partial x}
+\overline{v}\dfrac{\partial \overline{w}}{\partial y}
+\overline{w}\dfrac{\partial \overline{w}}{\partial z}
+\dfrac{\partial\overline{u'w'}}{\partial x}
+\dfrac{\partial\overline{v'w'}}{\partial y}
+\dfrac{\partial\overline{(w')^2}}{\partial z}
=Z-\dfrac{1}{\rho}\dfrac{\partial \overline{p}}{\partial z}+\nu\nabla^2\overline{w},\\[6pt]
\dfrac{\partial \overline{u}}{\partial x}
+\dfrac{\partial \overline{v}}{\partial y}
+\dfrac{\partial \overline{w}}{\partial z}=0.
\end{cases}
$$

利用方程组的形式，可写为

$$
\rho\left(
\frac{\partial \overline{u}}{\partial t}
+\overline{u}\frac{\partial \overline{u}}{\partial x}
+\overline{v}\frac{\partial \overline{u}}{\partial y}
+\overline{w}\frac{\partial \overline{u}}{\partial z}
\right)
=\rho X-\frac{\partial \overline{p}}{\partial x}
+\mu\nabla^2\overline{u}
+\frac{\partial(-\rho\overline{(u')^2})}{\partial x}
+\frac{\partial(-\rho\overline{u'v'})}{\partial y}
+\frac{\partial(-\rho\overline{u'w'})}{\partial z},
$$

其余两个方向同理。图中将右端各项标为体积力、压强力、黏动力、脉动项。

Reynolds 应力张量写为

$$
\begin{pmatrix}
P'_{xx} & P'_{xy} & P'_{xz}\\
P'_{yx} & P'_{yy} & P'_{yz}\\
P'_{zx} & P'_{zy} & P'_{zz}
\end{pmatrix}
=
\begin{pmatrix}
-\rho\overline{(u')^2} & -\rho\overline{u'v'} & -\rho\overline{u'w'}\\
-\rho\overline{u'v'} & -\rho\overline{(v')^2} & -\rho\overline{v'w'}\\
-\rho\overline{u'w'} & -\rho\overline{v'w'} & -\rho\overline{(w')^2}
\end{pmatrix}.
$$

称为 Reynolds 应力。

### 第 88 页：混合长度理论（原 PDF 复校）

如何给出湍流中本构呢？

一种思路：第 2 节 混合长度理论。

牛顿黏性理论：

$$
\tau=\mu\frac{du}{dy},
$$

认为运动边的输运现象物理解释，还能将 $\mu$ 用于模型取常值，属于分子黏性。

类比分子黏性，由简单、二维、平行、剪切的平均流动建立混合长度理论。垂直方向有脉动速度 $v'$，起到输运效果，故类比分子黏性大得多。

图示：两层流体分别位于

$$
y+\frac{l'}{2},\qquad y-\frac{l'}{2},
$$

两处脉动微团同时到达同一 $y$ 处动量交换。

由上、下两处进入同一位置的流体所携带动量，可写为

$$
\rho v'\left(\overline{u}+\frac{d\overline{u}}{dy}\frac{l'}{2}\right),
\qquad
\rho v'\left(\overline{u}-\frac{d\overline{u}}{dy}\frac{l'}{2}\right).
$$

由脉动运动的单位时间、单位面积、流体在两处微团交换动量的平均值，可得

$$
\rho v'\left(\overline{u}+\frac{d\overline{u}}{dy}\frac{l'}{2}\right)
-\rho v'\left(\overline{u}-\frac{d\overline{u}}{dy}\frac{l'}{2}\right)
=\rho v'l'\frac{d\overline{u}}{dy}. \tag{1}
$$

由时间平均的 $N$-$S$ 方程，

$$
P'_{yx}=-\rho\overline{u'v'}.
$$

原页圈出近似关系

$$
u'=l'\frac{d\overline{u}}{dy}.
$$

于是

$$
P'_{yx}=A\frac{d\overline{u}}{dy}
=\rho\varepsilon_m\frac{d\overline{u}}{dy}. \tag{4}
$$

其中 $A$ 为湍流黏性系数，且 $A\gg\mu$；$\varepsilon_m$ 为动涡黏性系数。页末写“下面解决 $v'$”。

---

### 第 89 页：混合长假设与湍流平均速度分布（原 PDF 复校）

#### Prandtl 混合长假设续

普朗特假设：$u'$、$v'$ 同量级，取

$$
u'\sim v'.
$$

由

$$
u'\sim l\frac{d\overline{u}}{dy},
$$

可得

$$
v'\sim l\frac{d\overline{u}}{dy}.
$$

由此有

$$
R'_{yx}=-\rho\overline{u'v'}
\sim \rho l^2\left(\frac{d\overline{u}}{dy}\right)^2.
$$

令 $l=\beta y$，则

$$
R'_{yx}=\rho l^2\left(\frac{d\overline{u}}{dy}\right)^2.
$$

原页将该式称为混合长类比自由程。

湍流中平均速度分布的推导假设为：

（1）除与壁靠近的内边界层外，混合长满足

$$
l=\beta y.
$$

（2）$R'_{yx}$ 在边界附近为常数，即

$$
R'_{yx}=\tau_0.
$$

由 Reynolds 应力式

$$
|R'_{yx}|=\tau_0=\rho l^2\left(\frac{d\overline{u}}{dy}\right)^2
$$

和 $l=\beta y$ 得

$$
\frac{d\overline{u}}{dy}
=\frac{1}{\beta y}\sqrt{\frac{\tau_0}{\rho}}.
$$

积分可得

$$
\overline{u}
=\frac{1}{\beta}\sqrt{\frac{\tau_0}{\rho}}\ln y+C.
$$

其中

$$
u_*=\sqrt{\frac{\tau_0}{\rho}}
$$

为摩擦速度。页内还标注 $\beta=0.4$（对比滑平板）。

混合长理论缺点：对外流、混合层和同壁流动虽可得到薄剪切层后的流动形式，但依赖经验，不便回溯运动。

### 第 90 页：湍流基本特性与 Reynolds 平均方程（原 PDF 复校）

#### 湍流的基本特性

湍流的基本特性包括：

（1）随机性：不规则随机运动。

（2）混合性：高效混合，伴随动量等物理量交换。

（3）有旋性：不同尺度的三维涡旋。

（4）耗散性：粘性使湍动细结构转化为内能。

不可压 Navier-Stokes 方程写为

$$
\rho\frac{\partial u_i}{\partial t}
+\rho u_j\frac{\partial u_i}{\partial x_j}
=\rho F_i-\frac{\partial p}{\partial x_i}
+\mu\frac{\partial^2u_i}{\partial x_j\partial x_j},
$$

并有连续方程

$$
\frac{\partial u_i}{\partial x_i}=0.
$$

张量或被统计量可分解为平均量与脉动量，例如

$$
u_i=\overline{u_i}+u_i',
$$

湍流可认为在满足 N-S 方程的每个样本中相互独立，但经平均后会得到湍流应力项。

Reynolds 平均后的动量方程可写成

$$
\rho\frac{D\overline{u}}{Dt}
=\rho\overline{F}_x-\frac{\partial\overline{p}}{\partial x}
+\mu\nabla^2\overline{u}
+\frac{\partial(-\rho\overline{u'u'})}{\partial x}
+\frac{\partial(-\rho\overline{u'v'})}{\partial y}
+\frac{\partial(-\rho\overline{u'w'})}{\partial z}.
$$

页内标出这就是湍流部分多出的项。

Reynolds 应力张量为

$$
\boldsymbol{\tau}^{(t)}
=
\begin{bmatrix}
-\rho\overline{u'u'} & -\rho\overline{u'v'} & -\rho\overline{u'w'}\\
-\rho\overline{v'u'} & -\rho\overline{v'v'} & -\rho\overline{v'w'}\\
-\rho\overline{w'u'} & -\rho\overline{w'v'} & -\rho\overline{w'w'}
\end{bmatrix}.
$$

若各向同性湍流，$\boldsymbol{\tau}^{(t)}$ 对角元相同，非对角元全为 $0$。

对各向异性湍流，以平均流为二维剪切流时，Reynolds 剪切应力与脉动相关，原页图示标明

$$
\overline{u'v'}<0.
$$

### 第 91 页：湍流封闭问题与二维剪切平均方程（原 PDF 复校）

经 Reynolds 平均后，方程中出现 $u',v',w'$ 等未知量，需要封闭。原页列出三种常见处理：

DNS 方法：瞬时的细组封闭，不做时间平均，需分辨求解 $u,v,w,p$ 的全部细节。

RANS 方法：用经验湍流模型对湍流应力模型封闭。

LES 方法：直接模拟大涡，大涡相互作用仍借助模型。

此外也可采用半经验湍流模型，例如 Boussinesq 的涡粘假设。

对二维、单向、平行、均匀的湍流，原页给出关系：

$$
\frac{\partial(P_{yx}-\rho\overline{u'v'})}{\partial y}=0.
$$

由应力形式的 Reynolds 平均 N-S 方程可写为

$$
\begin{cases}
\rho\dfrac{d\overline{u}}{dt}
=\rho\overline{F}_x
+\dfrac{\partial P_{xx}}{\partial x}
+\dfrac{\partial P_{xy}}{\partial y}
+\dfrac{\partial P_{xz}}{\partial z}
+\dfrac{\partial(-\rho\overline{u'u'})}{\partial x}
+\dfrac{\partial(-\rho\overline{u'v'})}{\partial y}
+\dfrac{\partial(-\rho\overline{u'w'})}{\partial z},\\[4pt]
\rho\dfrac{d\overline{v}}{dt}
=\rho\overline{F}_y
+\dfrac{\partial P_{yx}}{\partial x}
+\dfrac{\partial P_{yy}}{\partial y}
+\dfrac{\partial P_{yz}}{\partial z}
+\dfrac{\partial(-\rho\overline{v'u'})}{\partial x}
+\dfrac{\partial(-\rho\overline{v'v'})}{\partial y}
+\dfrac{\partial(-\rho\overline{v'w'})}{\partial z},\\[4pt]
\rho\dfrac{d\overline{w}}{dt}
=\rho\overline{F}_z
+\dfrac{\partial P_{zx}}{\partial x}
+\dfrac{\partial P_{zy}}{\partial y}
+\dfrac{\partial P_{zz}}{\partial z}
+\dfrac{\partial(-\rho\overline{w'u'})}{\partial x}
+\dfrac{\partial(-\rho\overline{w'v'})}{\partial y}
+\dfrac{\partial(-\rho\overline{w'w'})}{\partial z}.
\end{cases}
$$

对二维流动有 $w=0,w'=0$。忽略体积力，平均量只向壁法向变化，$x$ 向变化很小，且定常时

$$
\frac{\partial\overline{u}}{\partial x}=0,\qquad
\frac{\partial\overline{v}}{\partial x}=0,\qquad
\overline{v}=0.
$$

简化得到

$$
\frac{\partial(P_{xy}-\rho\overline{u'v'})}{\partial y}=0,
$$

以及

$$
\frac{\partial(P_{yy}-\rho\overline{v'v'})}{\partial y}=0.
$$

### 第 92 页：平板湍流边界层速度分布（原 PDF 复校）

对流模拟时有 $u',v',w'$。实验表明，固壁外的湍流流动可以划分为三区域：

外区：速度廓线区或缺陷律区。

内区：又可分为粘性底层、对数律层和湍流核心层。

页内图示给出无量纲湍流强度、粘性应力与 Reynolds 应力沿 $y/\delta$ 的分布：

$$
\tau_v=\mu\frac{\partial\overline{u}}{\partial y},
\qquad
\tau_t=-\rho\overline{u'v'}.
$$

在第三种模拟中，用混合长理论可得湍流核心区速度线：

$$
\overline{u}
=\frac{1}{\beta}\sqrt{\frac{\tau_0}{\rho}}\ln y+C,
$$

为对数规律；而在粘性底层，对关系则是线性的。

粘性底层中 Reynolds 应力 $-\rho\overline{u'v'}$ 可忽略，

$$
\tau_w=\mu\frac{d\overline{u}}{dy}.
$$

积分得到

$$
\overline{u}=\frac{\tau_w}{\mu}y.
$$

引入摩擦速度

$$
u_*=\sqrt{\frac{\tau_w}{\rho}},
$$

以及无量纲壁面距离

$$
y^+=\frac{u_*y}{\nu}.
$$

于是

$$
\frac{\overline{u}}{u_*}=y^+,
\qquad 0<y^+<5.
$$

在湍流核心区，黏性力 $\mu\,d\overline{u}/dy$ 可忽略，$\tau_w=-\rho\overline{u'v'}$。由混合长理论有

$$
\tau_w=\rho l^2\left(\frac{d\overline{u}}{dy}\right)^2,
\qquad l=\beta y.
$$

故

$$
\overline{u}=\frac{1}{\beta}\sqrt{\frac{\tau_w}{\rho}}\ln y+C.
$$

移项得

$$
\frac{\overline{u}}{u_*}
=\frac{1}{\beta}\ln y^+ + C,
\qquad 30<y^+<300.
$$

### 第 93 页：平板湍流边界层的量纲分析（原 PDF 复校）

用量纲分析对上节结论分类，可得

$$
\frac{\overline{u}}{u_*}=y^+,\qquad 0<y^+<5,
$$

以及

$$
\frac{\overline{u}}{u_*}=\frac{1}{\beta}\ln y^+ + C,
\qquad 30<y^+<300.
$$

由

$$
\tau_w=\mu\frac{d\overline{u}}{dy}-\rho\overline{u'v'}
$$

可知总壁面平均切应力 $\tau_w$ 与 $y$ 有关，同时由量纲分析得

$$
\overline{u}=f(y,u_*,\nu).
$$

进一步有

$$
\frac{\overline{u}}{u_*}=f(y^+).
$$

当 $y^+$ 很小时，可用 Taylor 级数近似。由边界条件

$$
f(0)=0,\qquad f'(0)=1,
$$

得

$$
\frac{\overline{u}}{u_*}=y^+.
$$

在外区，几何尺度 $\delta$ 设为常量，速度缺陷满足

$$
\frac{U-\overline{u}}{u_*}=F\left(\frac{y}{\delta}\right).
$$

内外区重叠区内，每个变量都伸缩式地变化，规律应适用且曲线相同。于是可得对数律形式

$$
\frac{\overline{u}}{u_*}=\frac{1}{\beta}\ln y + A,
$$

以及速度缺陷律形式

$$
\frac{U-\overline{u}}{u_*}
=-\frac{1}{\beta}\ln\frac{y}{\delta}+B.
$$

原页末尾留有“区域名称、位置、典型特征”表格，行名为内区、粘性底层、过渡层、对数层和外区。

---

### 第 94 页：湍动能耗散率、湍流动能方程、随机过程与频谱（原 PDF 复校）

#### 湍动能耗散率

1\. 湍动能传递是不可逆过程，湍动能耗散率不便直接按粘性系数 $\nu$ 表示。

2\. 湍动能粘性耗散发生在级联末端，大尺度涡经过能量级联逐步向小尺度涡传递。

3\. 大涡特征长度为 $l$，特征速度量级为 $\sqrt{\overline{(u_i')^2}}$，时间尺度为

$$
\frac{l}{\sqrt{\overline{(u_i')^2}}}.
$$

故大涡湍动能传递速率量级为

$$
\varepsilon \sim \frac{\left(\overline{(u_i')^2}\right)^{3/2}}{l}.
$$

#### 湍流动能方程的项

原页把湍流动能方程各项按图标注为

$$
P\,(i),\qquad E\,(ii),\qquad A\,(iii),\qquad D\,(iv),
$$

分别对应生成、扩散、平流和耗散。常用写法可整理为

$$
\frac{\partial k}{\partial t}+\overline{u_j}\frac{\partial k}{\partial x_j}
=-\overline{u_i'u_j'}\frac{\partial \overline{u_i}}{\partial x_j}
-\varepsilon
-\frac{\partial}{\partial x_j}
\left(
\frac{1}{\rho}\overline{p'u_j'}+\frac{1}{2}\overline{u_i'u_i'u_j'}-\nu\frac{\partial k}{\partial x_j}
\right).
$$

其中

$$
k=\frac{1}{2}\overline{u_i'u_i'},\qquad
\varepsilon=\nu\overline{\frac{\partial u_i'}{\partial x_j}\frac{\partial u_i'}{\partial x_j}}.
$$

页内示意图标出 $P,E,A,D$ 四类作用区，并注明图左为连续曲线关系。

#### 第二章：湍流谱

随机过程基础量：

$$
\overline{X(t)},\qquad
\sigma^2(t)=\overline{X(t)X(t)}.
$$

自相关函数与自相关系数：

$$
R_X(t_1,t_2)=\overline{X(t_1)X(t_2)},\qquad
r_{X(t_1)X(t_2)}=
\frac{\overline{X(t_1)X(t_2)}}{\sigma_X(t_1)\sigma_X(t_2)}.
$$

互相关函数与互相关系数：

$$
R_{XY}(t_1,t_2)=\overline{X(t_1)Y(t_2)},\qquad
r_{XY}(t_1,t_2)=
\frac{\overline{X(t_1)Y(t_2)}}{\sigma_X(t_1)\sigma_Y(t_2)}.
$$

若

$$
R_{XY}(t_1,t_2)=\overline{X(t_1)}\,\overline{Y(t_2)},
$$

则 $X(t)$ 与 $Y(t)$ 独立。

平稳过程：若随机过程 $X(t)$ 的统计性质不随时间变化，则 $X(t)$ 是平稳过程。

弱平稳过程：若 $\overline{X(t)}$ 不变，且

$$
\overline{X(t+\tau)X(t)}=R(\tau),
$$

则 $X(t)$ 为弱平稳过程。

在实序中，相关函数常以时间平均表达：

$$
R(\tau)=\lim_{T\to\infty}\frac{1}{2T}\int_{-T}^{T}X(t+\tau)X(t)\,dt,
$$

$$
R(\tau)=\lim_{T\to\infty}\frac{1}{2T}\int_{-T}^{T}X(t+\tau)Y(t)\,dt.
$$

平稳随机过程的谱：

$$
S(\omega)=\frac{1}{2\pi}\int_{-\infty}^{+\infty}R(\tau)e^{-i\omega\tau}\,d\tau,
$$

反演为

$$
R(\tau)=\int_{-\infty}^{+\infty}S(\omega)e^{i\omega\tau}\,d\omega.
$$

例如

$$
\overline{X^2}=R(0)=\int_{-\infty}^{+\infty}S(\omega)\,d\omega.
$$

其波数谱为

$$
S(\vec K)=\frac{1}{(2\pi)^3}\int_{-\infty}^{+\infty}R(\vec r)e^{-i\vec K\cdot\vec r}\,d\vec r,
$$

反演为

$$
R(\vec r)=\int_{-\infty}^{+\infty}S(\vec K)e^{i\vec K\cdot\vec r}\,d\vec K.
$$

例如

$$
R(0)=\overline{x^2}=\int_{-\infty}^{+\infty}S(k)\,dk.
$$

### 第 95 页：湍流脉动速度相关系数与能谱（原 PDF 复校）

#### 湍流脉动速度的相关系数

对空间均匀湍流，同一时刻不同位置的速度脉动相关系数为

$$
r_{ij}(\vec r)=
\frac{\overline{u_i'(\vec x+\vec r)\,u_j'(\vec x)}}{\sigma_i\sigma_j}.
$$

取均流向为 $u$ 时，纵向相关系数可写为

$$
r_{11}(r)=
\frac{\overline{u'(\vec x+\vec r)u'(\vec x)}}{\sigma_i^2}.
$$

积分尺度用于表示湍流尺度：

$$
l_{11}=\int_0^\infty r_{11}(r)\,dr.
$$

原页示意图说明：将相关曲线下面积等效为高度为 $1.0$ 的矩形宽度，即可得到相应积分尺度。

同一位置不同时刻的相关性为

$$
R_{ij}(\vec x,\tau)=
\overline{u_i'(\vec x,t+\tau)u_j'(\vec x,t)},
$$

$$
r_{ij}(\vec x,\tau)=
\frac{\overline{u_i'(\vec x,t+\tau)u_j'(\vec x,t)}}{\sigma_i\sigma_j}.
$$

#### 湍流谱

若湍流平稳均匀，则

$$
R_{ij}(\vec r)=
\overline{u_i'(\vec x+\vec r,t)u_j'(\vec x,t)}.
$$

其谱密度为

$$
S_{ij}(\vec K)=
\frac{1}{(2\pi)^3}\int_{-\infty}^{+\infty}R_{ij}(\vec r)e^{-i\vec K\cdot\vec r}\,d\vec r,
$$

逆变换为

$$
R_{ij}(\vec r)=\int_{-\infty}^{+\infty}S_{ij}(\vec K)e^{i\vec K\cdot\vec r}\,d\vec K.
$$

因此

$$
R_{ii}(0)=\int_{-\infty}^{+\infty}S_{ii}(\vec K)\,d\vec K.
$$

湍动能密度满足

$$
\frac{1}{2}\overline{u_i'u_i'}=\frac{1}{2}R_{ii}(0)
=\int_{-\infty}^{+\infty}\frac{1}{2}S_{ii}(\vec K)\,d\vec K.
$$

将 $\frac{1}{2}S_{ii}(\vec K)$ 在 $K$ 空间内以 $K$ 为半径的球面上积分，约为

$$
E(K)=\int_0^{2\pi}\int_{-\pi/2}^{\pi/2}
\frac{1}{2}S_{ii}(K)K^2\sin\theta\,d\theta\,d\varphi,
$$

其中 $E(K)$ 为湍流能谱密度，并有

$$
\int_0^\infty E(K)\,dK=\frac{1}{2}\overline{u_i'u_i'}.
$$

#### 惯性子区能谱

能谱密度示意图把谱区分为三段：

a 区：大涡区，大涡的间歇性明显，从平均流获取能量。

b 区：惯性涡区，传递为主，湍动能生成和粘性耗散都很小。

c 区：平衡区，获得的湍动能与粘性耗散平衡，小尺度涡各向同性。

### 第 96 页：湍流模式简介（原 PDF 复校）

#### 1. 代数涡粘模式

##### 1-1 Boussinesq 假设 3D 推广

Reynolds 应力写为

$$
-\overline{u_i'u_j'}
=\nu_t\left(\frac{\partial \overline{u_i}}{\partial x_j}
+\frac{\partial \overline{u_j}}{\partial x_i}\right)
-\frac{2}{3}k\delta_{ij}.
$$

标量输运可写为

$$
-\overline{u_i'\theta'}=
\kappa_t\frac{\partial \overline{\theta}}{\partial x_i},
$$

其中 $\kappa_t$ 为湍扩散系数，湍流 Prandtl 数为

$$
Pr_t=\frac{\nu_t}{\kappa_t}\approx 0.6\sim 1.
$$

##### 1-2 混合长模式

对于二维平行剪切流：

$$
\nu_t=l_m^2\left|\frac{\partial \overline{u}}{\partial y}\right|.
$$

对于三维湍流，Smagorinsky 模式写为

$$
\nu_t=l_m^2\left(2\overline{S}_{ij}\overline{S}_{ij}\right)^{1/2}.
$$

其它代数涡粘模式的思路包括：

1\. 利用内、外区的涡粘公式。

2\. 利用 $\nabla\times\overline{\vec V}$ 取代 $\overline{S}_{ij}$。

3\. 对混合长 $l_m$ 做近壁修正。

代数涡粘模式评价：

1\. 缺陷是常把子运动视为各向同性，而湍动粘应力响应具有各向异性。

2\. 一点的湍性质不只由此处场点的平均速度决定，还应与其前历史过程有关，因此不能考虑历史效应。

3\. 在简单二维剪切湍流中，代数模式令人满意；复杂三维湍流中基本不够。

#### 2. 常用的标准 $k-\varepsilon$ 模式

由 Boussinesq 假设：

$$
-\overline{u_i'u_j'}
=\nu_t\left(\frac{\partial \overline{u_i}}{\partial x_j}
+\frac{\partial \overline{u_j}}{\partial x_i}\right)
-\frac{2}{3}k\delta_{ij}.
$$

若大涡特征速度 $V'\sim\sqrt{k}$，大涡特征长度 $l\sim k^{3/2}/\varepsilon$，假设

$$
\nu_t=f(V',l),
$$

量纲分析给出

$$
\nu_t\sim V'l,\qquad
\nu_t=C_\mu\frac{k^2}{\varepsilon}.
$$

也可用尺度分析类比剪切粘性力：

$$
\tau=\mu\frac{du}{dy}=\rho\nu\frac{du}{dy},
$$

并用 $\rho\nu_t\,du/dy$ 表示相应湍流输运。

#### 对 $k$ 的模拟

$$
\frac{\partial k}{\partial t}
+\overline{u_i}\frac{\partial k}{\partial x_i}
=\frac{\partial}{\partial x_i}
\left(
-\frac{1}{\rho}\overline{p'u_i'}-k\overline{u_i'}
+\nu\frac{\partial k}{\partial x_i}
\right)
-\overline{u_i'u_j'}\frac{\partial \overline{u_i}}{\partial x_j}
-\varepsilon.
$$

生成项利用 Boussinesq 假设：

$$
P=-\nu_t\left(
\frac{\partial \overline{u_i}}{\partial x_j}
+\frac{\partial \overline{u_j}}{\partial x_i}
\right)\frac{\partial \overline{u_i}}{\partial x_j}.
$$

扩散项近似为

$$
-\frac{1}{\rho}\overline{p'u_i'}-k\overline{u_i'}
=\frac{\nu_t}{\sigma_k}\frac{\partial k}{\partial x_i},
$$

其中 $\sigma_k$ 为经验湍流 Prandtl 数。

页底可见“对 $\varepsilon$ 的模拟”标题及部分方程，右端被裁切，未强行补全。

### 第 97 页：流体力学易错名词及概念汇总（一）（原 PDF 复校）

1\. 亥姆霍兹速度分析定理：

$$
\vec V(M)=\vec V(M_0)+\mathbf S\cdot\delta\vec r
+\frac{1}{2}\operatorname{rot}\vec V\times\delta\vec r.
$$

即 $M$ 点速度为与 $M_0$ 点相同的平动速度、绕 $M_0$ 点转动在 $M$ 点引起的速度以及因流体变形在 $M$ 点引起的速度三者之和。

2\. 本构方程：

$$
\mathbf P=-p\mathbf I
+2\mu\left(\mathbf S-\frac{1}{3}(\nabla\cdot\vec V)\mathbf I\right)
+\left(\lambda+\frac{2}{3}\mu\right)(\nabla\cdot\vec V)\mathbf I.
$$

应力张量等于静压张量、纯剪切流动引起粘性应力张量和体积变化引起的应力张量之和。

3\. 运动方程（动量方程）：

$$
\frac{d\vec V}{dt}
=\vec F-\frac{1}{\rho}\nabla P+\gamma\nabla^2\vec V
+\frac{1}{3}\gamma\nabla(\nabla\cdot\vec V),
$$

其中 $\gamma$ 是运动粘性系数。$\frac{d\vec V}{dt}$ 为流体微团加速度，右端依次为单位体积上受到的体积力、压强梯度力和粘性力。

4\. 涡度方程：

$$
\frac{d\vec\omega}{dt}
=(\vec\omega\cdot\nabla)\vec V
-\vec\omega(\nabla\cdot\vec V)
+\nabla\times\vec F_b
-\nabla\times\frac{\nabla p}{\rho}
+\nabla\times\gamma\nabla^2\vec V
+\frac{1}{3}\gamma\nabla\times\nabla(\nabla\cdot\vec V).
$$

5\. 尼古拉兹曲线：对圆管有压流进行了系统的沿程阻力系数和断面流速分布的测定。

层流区：粗糙管和光滑管阻力系数相同。

临界过渡区：临界 $Re$ 数与相对粗糙度无关，过渡状态也与相对粗糙度无关。

紊流光滑区：一个相对粗糙度对应阻力系数都有一个分布区域，区域内光滑管等于粗糙管阻力系数。

紊流过渡区：与 $Re$ 和 $k/d$ 有关，粗糙管阻力系数大于光滑管，$k/d$ 越大，发生变化时 $Re$ 越小。

紊流粗糙区（阻力平方区）：只与 $k/d$ 有关，且基本为常数。层流区和紊流光滑区都只与 $Re$ 有关。

6\. 波浪运动水质点特点（考虑小振幅）：若为驻波，流体质点轨迹是直线。在节点处，流体质点在平衡位置附近作水平振动；在波峰、波谷处，流体质点在垂直方向做微小振动。

### 第 98 页：流体力学易错名词及概念汇总（二）（原 PDF 复校）

6\. 波浪运动水质点特点续：若为前进波，流体质点近似作圆周运动或椭圆运动，愈往下质点运动半径愈小。原页提示可复习 Stokes 波、椭圆余弦波、重力波、孤立波和惯性重力波五种波动。

7\. 应变率张量：描述流体变形运动（角变形率、线相对增长率）的二阶张量，用 $\mathbf S$ 表示。

8\. 雷诺实验：流动分为层流、湍流两种。层流流线层次分明，互相平行，沿管道速度剖面呈抛物面分布。湍流中流体质点运动杂乱无章，含有大量无规则三维涡旋，动能和动量高效混合，使平均速度剖面中心部分平坦而边缘更陡，造成壁面剪应力增大，从而使管流阻力增大。

9\. Rossby 数：表征惯性力和科氏力之比。

$$
\frac{V^2/L}{\Omega V}=\frac{V}{\Omega L}=Ro.
$$

它是衡量科氏力效应（旋转效应）的重要参数。当 $Ro\gg 1$ 时，可以不考虑旋转效应；当 $Ro\ll 1$ 时，旋转效应对流体运动有决定意义。

10\. 动能方程：

$$
\rho\frac{D}{Dt}\left(\frac{V^2}{2}\right)=\vec F_b\cdot\vec V+\vec V\cdot(\nabla\cdot\mathbf P).
$$

耗散方程：

$$
\varphi=2\mu\,\mathbf S:\mathbf S-\frac{2\mu}{3}(\operatorname{div}\vec v)^2.
$$

11\. 层流：流动有明晰流线，严格分层，层与层之间有剪切流动，没有法向混合。

湍流：流动没有明晰的流线，不分层；流体团之间混合明显；流动除了沿大方向整体运动，还存在无规则脉动，由扰动产生，伴随涡的产生和传播。

12\. Prandtl 混合长理论：借鉴“分子自由程”的概念，假设湍流中的流体微团有“混合长”，流体微团只有移动了这个尺度距离后才能与其他流体微团发生混合，从而失去了流动特性。

对于二维平行剪切流动，有

$$
-\rho\overline{u'v'}
=\rho l_m^2\left|\frac{d\overline{u}}{dy}\right|\frac{d\overline{u}}{dy},
$$

其中 $l_m$ 为混合长。

13\. 边界层方程见下一页。

### 第 99 页：流体力学易错名词及概念汇总（三）（原 PDF 复校）

13\. 边界层方程：

$$
\begin{cases}
\dfrac{\partial u}{\partial x}+\dfrac{\partial v}{\partial y}=0,\\[4pt]
u\dfrac{\partial u}{\partial x}+v\dfrac{\partial u}{\partial y}
=-\dfrac{1}{\rho}\dfrac{\partial p}{\partial x}
+\nu\dfrac{\partial^2u}{\partial y^2},\\[4pt]
\dfrac{\partial p}{\partial y}=0.
\end{cases}
$$

边界条件：

$$
\begin{cases}
y=0,\quad u=0,\quad v=0,\\
y=\infty,\quad u=v_0(x),\quad \dfrac{\partial u}{\partial y}=0.
\end{cases}
$$

页内手写示意还给出位移厚度关系：

$$
\int_0^\delta u\,dy=U(\delta-\delta^\ast),\qquad
\delta^\ast=\int_0^\delta\left(1-\frac{u}{U}\right)dy.
$$

14\. 边界层理论：在研究大 $Re$ 数、无流动分离的绕流问题时，一般在边界附近分出一薄层，以薄层边界为界；以内按照粘性流体处理，以外按照理想流体绕流处理。一般人为规定与外部流动速度相差 $1\%$ 的地方为边界层上界。Prandtl 边界层理论认为边界层中粘性力和惯性力同量级，粘性效果显著；边界层外粘性效果很小，当 $Re\to\infty$ 时，薄层厚度趋于 $0$。

15\. 位移厚度与动量损失厚度：

$$
\delta_D=\delta_{\overline{v}}=\int_0^\delta\left(1-\frac{u}{V_e}\right)dy,
$$

$$
\theta=\int_0^\delta\frac{u}{V_e}\left(1-\frac{u}{V_e}\right)dy=\delta_m.
$$

16\. 湍流运动基本特性：

随机性：不规则随机运动。

混合性：高效混合。

有旋性：不同尺度三维涡旋。

耗散性：湍流耗散更多能量。

17\. 边界层理论应用：在航空飞行器上，通过设计“层流剖翼面”以维持原流边界层，避免边界层分离，使机翼阻力增加。

18\. Bernoulli 方程：在满足理想正压体积力有势、流体定常流动的情况下，同一条流线上各点单位质量上机械能（动能、压能和体积力势能之和）相等。

19\. 牛顿流体：应力张量 $\mathbf P$ 与应变率张量 $\mathbf S$ 之间关系满足广义牛顿公式的流体称为牛顿流体，否则称为非牛顿流体。

页内手写补式为

$$
\mathbf P=-p\mathbf I+2\mu\left(\mathbf S-\frac{1}{3}\operatorname{div}\vec V\,\mathbf I\right)
+\mu'\operatorname{div}\vec V\,\mathbf I.
$$

20\. 开尔文定理表明：如果考虑的是理想正压流体，且外力有势，则沿任一封闭物质线速度环量和通过任一物质面的涡通量在运动过程中不变。

21\. 流线：同一时刻中流场内速度的连线，读线上速度方向即该点流线的切线方向。

---

### 第 100 页：名词解释速查表续（第 22-30 条，原 PDF 复校）

#### 22. 大 $Re$ 数为什么引入边界层近似？

在物面附近定会有一薄层，其内部流体速度沿物面切向分量，由外部理想流体流动速度迅速减小至物面处切向速度为零。该层内不满足雷诺数远大于 1 的条件，而是粘性力与惯性力同等重要。引入边界层可以解释在离开物面的广大区域，大雷诺数流动与理想流动接近一致，以及在该层物体受到阻力这一事实。

页内手写圈改强调“该层内不满足雷诺数远大于 1 的条件”，并把“大雷诺数流动与理想流动接近一致”以及“受到阻力这一事实”画线标出，说明本条答案重点不是单纯背边界层名称，而是说明外流区近似理想流与近壁区粘性不可忽略两件事可以同时成立。

#### 23. 雷诺应力

雷诺应力产生于湍流脉动，代表脉动对于平均流的作用。一般粘性应力则产生于流体微团之间的相对运动，是一种真实的力；雷诺应力不是真实的力。

原页对“脉动对于平均流的作用”作了下划线，后半句“雷诺应力不是真实的力”是本条辨析的落点。

#### 24. 流体易流动性

流体静止时只有法向应力，没有切向应力。

#### 25. 连续介质假设

液体是由不连续的分子或原子构成的，但在流体运动尺度远大于分子平均自由程时，可将流体看成连续的流体微团，需保证宏观上足够小、微观上足够大。若气体分子自由程较大，例如薄大气层，同样不适用。

#### 26. 几何相似、运动相似、动力相似

几何相似：指流场中被绕流物体和流场中各对应在线元之间夹角相等，且对应长度成比例。分别取模型与实物的特征长度和特征时间构成无量纲量，那么两流场中无量纲坐标和无量纲时间相同的点称为时空对应点。

运动相似：指两个几何相似的流场中，时空对应点上速度方向相同，大小成比例。

动力相似：指两个运动相似的流场中，时空对应点上对应面元所受力方向相同，大小成比例。

#### 27. 速度散度

速度散度 $\nabla\cdot\vec V$ 是流体微团体积相对变化率，等于流体微团沿坐标轴相对伸长率之和。若

$$
\nabla\cdot\vec V=0,
$$

则流体不可压；在二维不可压流动中有流函数。

页内手写补注把二维不可压流函数关系写在右侧，可整理为

$$
\frac{\partial\psi}{\partial y}=u,
\qquad
\frac{\partial\psi}{\partial x}=-v.
$$

#### 28. 速度旋度

速度旋度 $\nabla\times\vec V$ 是流体微团自转角速度的两倍，即 $2\vec\omega$。若

$$
\nabla\times\vec V=0,
$$

则流体无旋，有速度势。

#### 29. 复位势

针对一个理想无旋定常二维流动，可引入复位势

$$
W(z)=\phi+i\psi.
$$

原页公式列为

$$
\operatorname{Re}W(z)=\phi,
\qquad
u=\frac{\partial\phi}{\partial x}
=\frac{\partial\psi}{\partial y},
\qquad
\text{流线 }\psi=\mathrm{const},
$$

$$
\operatorname{Im}W(z)=\psi,
\qquad
v=\frac{\partial\phi}{\partial y}
=-\frac{\partial\psi}{\partial x},
\qquad
Q_{AB}=|\psi_B-\psi_A|.
$$

#### 30. 复位势中象方法基本思想

设想以 $C$ 为边界区域的 $\tau'$ 之外存在一组流体力学上奇点 $S$，如在 $\tau'$ 内放置一组奇点 $S'$ 之后，组合流场恰好存在这样一条流线，它就是边界 $C$，那么奇点 $S'$ 就称为奇点 $S$ 关于边界 $C$ 的镜象。

### 第 101 页：第 30 条续及第 31-34 条（原 PDF 复校）

由奇点 $S$ 和 $S'$ 构成的组合流场的复势，就是所求的 $\tau'$ 之外区域中流场的复势。求 $S$ 的镜象依赖区域 $\tau'$，这种方法通常称为镜象法。

#### 31. 球形液滴下落均匀定常速度

原页给出

$$
V_{\text{定}}
=
\frac{2}{9}
\frac{(\rho-\rho_{\text{空}})ga^2}{\eta},
$$

其中 $a$ 是半径，$\eta$ 为动力粘性系数。

#### 32. 湍流三个区域

湍流三个区域为：粘性底层、缓冲层、完全湍流层或湍流核心区。粘性底层中分子粘性主导；缓冲层中粘性作用与 Reynolds 应力均重要；完全湍流层或对数层中 Reynolds 应力主导。

#### 33. 平板边界层厚度

平板边界层厚度为

$$
\delta=k\sqrt{\frac{\nu x}{u}},
$$

$k$ 为常数，故边界层厚度与流体粘性系数、流体在平板上位置、来流速度有关。也可由

$$
Re_x=\frac{ux}{\nu}
$$

写成

$$
\delta=k\frac{x}{\sqrt{Re_x}}.
$$

#### 34. 边角知识

兰金涡。

圆柱绕流结论：比较零散，在书中自行总结梳理语言，也在其选答案中有结论。

卡门涡街。

地坡风或贸易风现象。

页内右侧手写图示标出副热带（subtropic）、热带（tropic）、赤道（equator）附近的等压线与风向关系，并写有

$$
\nabla p\times\nabla\rho\ne 0,
\qquad
p\ne\text{constant},
\qquad
p=\text{constant}.
$$

各种无量纲数：

$$
Re=\frac{UL}{\nu},
\qquad
Fr=\frac{V_\infty^2}{gL},
\qquad
Ro=\frac{V_\infty}{\Omega L},
$$

$$
Eu=\frac{p}{\rho V_\infty^2},
\qquad
St=\frac{L}{V_\infty T}.
$$

圆管层流剖面。

页内手写边注同时把这一组无量纲数连到左侧括号中的“各种无量纲数”条目；本页只作为索引页，具体定义仍以后续题目或教材对应章节为准。

### 第 102 页：2015 年真题后半页，二维非定常流与风洞测阻力（原 PDF 复校）

#### 二、给定二维速度场的流线、迹线、加速度、势函数与流函数

题设速度场为

$$
u=xt,\qquad v=-yt.
$$

流线方程由

$$
\frac{dx}{u}=\frac{dy}{v}
$$

得到

$$
\frac{dx}{xt}=\frac{dy}{-yt},
\qquad xy=C.
$$

加速度为

$$
a_x=\frac{\partial u}{\partial t}
+u\frac{\partial u}{\partial x}
+v\frac{\partial u}{\partial y}
=x+x t^2,
$$

$$
a_y=\frac{\partial v}{\partial t}
+u\frac{\partial v}{\partial x}
+v\frac{\partial v}{\partial y}
=-y+y t^2.
$$

迹线由

$$
\frac{dx}{dt}=xt,\qquad \frac{dy}{dt}=-yt
$$

积分得

$$
x=C_1e^{t^2/2},\qquad y=C_2e^{-t^2/2}.
$$

于是迹线加速度也可写为

$$
a_x=\frac{d^2x}{dt^2}=C_1e^{t^2/2}(1+t^2),
$$

$$
a_y=\frac{d^2y}{dt^2}=C_2e^{-t^2/2}(-1+t^2).
$$

该速度场满足

$$
\nabla\times\mathbf{V}
=\frac{\partial v}{\partial x}-\frac{\partial u}{\partial y}=0,
$$

故为无旋流，可引入速度势：

$$
d\phi=u\,dx+v\,dy=t(x\,dx-y\,dy),
$$

$$
\phi=\frac{t}{2}(x^2-y^2).
$$

又因为

$$
\nabla\cdot\mathbf{V}
=\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}
=t-t=0,
$$

故可引入流函数。按二维约定

$$
d\psi=u\,dy-v\,dx=t(x\,dy+y\,dx),
$$

得

$$
\psi=xyt.
$$

#### 三、风洞测圆柱阻力系数题

题面：为了测定圆柱体阻力系数 $C_D$，将一直径为 $d$ 的圆柱体放在二维风洞中进行实验。如图，图中虚线为风洞壁面，在截面 $1-1$、$2-2$ 处测得流速分布如图中箭头和线段所示，箭头指示流速方向，线段长度表示速度大小。设流体均质、不可压缩、定常，两截面压强均为 $p_\infty$。求单位长圆柱所受阻力及阻力系数 $C_D$。

原页在本页只露出题面，图中速度分布和后续控制体动量积分需要按原图续看。阻力系数定义可写为

$$
C_D=\frac{D}{\frac12\rho U_\infty^2 d}
$$

其中 $D$ 为单位长圆柱阻力。

### 第 103 页：势函数点源题与突然启动平板（原 PDF 复校）

#### 四、极坐标速度势 $\phi=m\ln r$

题设理想不可压缩流体平面流动在极坐标系下速度势为

$$
\phi=m\ln r.
$$

速度分量由

$$
v_r=\frac{\partial\phi}{\partial r}=\frac{m}{r},
\qquad
v_\theta=\frac{1}{r}\frac{\partial\phi}{\partial\theta}=0
$$

给出。由 Bernoulli 方程

$$
\frac{v^2}{2}+\frac{p}{\rho}
=
\frac{p_\infty}{\rho}
$$

得压强分布

$$
p=p_\infty-\frac{\rho m^2}{2(x^2+y^2)}.
$$

对应流函数为

$$
\psi=m\theta=m\arctan\frac{y}{x}.
$$

两点间体积流量可由流函数差求得，例如页内给出

$$
Q=\psi_{(1,1)}-\psi_{(1,-1)}
=\frac{\pi}{2}m.
$$

#### 五、无限大平板突然启动

题设一无限大平板浸没在无界静止流体中，流体不可压缩，运动学粘性系数为 $\nu$。平板突然沿自身所在平面以速度 $U$ 匀速运动，以 $u(y,t)$ 表示距平板 $y$ 处的流速。

控制方程为

$$
\frac{\partial u}{\partial t}
=
\nu\frac{\partial^2u}{\partial y^2}.
$$

定解条件为

$$
t=0,\ y>0:\quad u=0,
$$

$$
t>0,\ y=0:\quad u=U,
$$

$$
y\to\infty:\quad u\to0.
$$

量纲分析令

$$
\frac{u}{U}=f(t^\alpha y^\beta\nu^\gamma).
$$

由

$$
[t^\alpha y^\beta\nu^\gamma]
=
[T]^\alpha[L]^\beta([L]^2[T]^{-1})^\gamma
$$

得到

$$
\alpha=\gamma,\qquad \beta=-2\gamma.
$$

取 $\gamma=-1/2$，得相似变量

$$
\eta=\frac{y}{\sqrt{\nu t}},
$$

故

$$
\frac{u}{U}=f\left(\frac{y}{\sqrt{\nu t}}\right).
$$

### 第 104 页：2016 年简答题 1-5（原 PDF 复校）

#### 1. 小 Reynolds 数球体阻力

当圆球在水中匀速平移且 Reynolds 数很小时，Navier-Stokes 方程中的惯性力可忽略，粘性力占主导。此时属于 Stokes 阻力区。

球体半径为 $a$、来流速度为 $V_\infty$ 时，

$$
D=6\pi\mu V_\infty a.
$$

阻力系数满足

$$
C_D=\frac{D}{\frac12\rho V_\infty^2\pi a^2}
=\frac{24}{Re},
\qquad
Re=\frac{2aV_\infty}{\nu}.
$$

#### 2. Rankine 组合涡与 Bernoulli 成立范围

速度分布为

$$
V_\theta=
\begin{cases}
\omega r, & r<R,\\
\dfrac{\omega R^2}{r}, & r>R.
\end{cases}
$$

其中 $r<R$ 为强迫涡区域，有旋；$r>R$ 为自由涡区域，无旋。$r<R$ 时 Bernoulli 方程只能沿同一条圆形流线使用；$r>R$ 时可在无旋外区统一使用。

外区满足

$$
\nabla\times\mathbf{V}=0,
$$

故可把外区看作理想无旋流。相应 Bernoulli 形式可写为

$$
\frac{\omega^2R^4}{2r^2}+\frac{p}{\rho}=C.
$$

若远处压强取 $p_\infty$，原页外区写成

$$
p=p_\infty-\frac{\rho}{2}\frac{\omega^2R^4}{r^2}.
$$

内区作刚体旋转，径向平衡给出

$$
\frac{\partial p}{\partial r}=\rho\omega^2r.
$$

原页据此列出内区压强形式：

$$
p=p_\infty-\rho\omega^2R^2+\frac12\rho\omega^2r^2.
$$

#### 3. 船模阻力实验相似条件

船模阻力实验首先要求几何相似；若涉及自由面兴波，主要相似准则为 Froude 数相似：

$$
Fr=\frac{U}{\sqrt{gL}}.
$$

若同时考察粘性阻力，还需讨论 Reynolds 数相似：

$$
Re=\frac{UL}{\nu}.
$$

实际模型实验常以 Froude 相似保证波阻相似，再对摩擦阻力作修正。

#### 4. 绕流脱体现象的原因

绕流脱体的根本原因是边界层内近壁流体因粘性作用不断损失动量，进入逆压梯度区后难以克服沿程压强升高而继续前进。壁面速度梯度逐渐减小，壁面剪应力趋于零，随后出现回流并形成分离。

判据可写为

$$
\tau_w=\mu\left.\frac{\partial u}{\partial y}\right|_{y=0}.
$$

当

$$
\left.\frac{\partial u}{\partial y}\right|_{y=0}=0
$$

时达到分离点。

#### 5. 长圆柱在无界流体中匀速运动的边界条件

设运动圆柱边界可写为

$$
F(x,y,t)=(x-Ut)^2+y^2-a^2=0.
$$

理想流体只要求法向速度与边界运动相容：

$$
V_n=-\frac{\partial F/\partial t}{|\nabla F|}.
$$

粘性流体除满足无穿透外，还要满足无滑移条件，即边界上流体速度等于圆柱表面速度。对圆柱表面可写成

$$
V_r=U\sin\theta,
$$

其中 $\theta$ 是边界上法线与 $x$ 轴负方向的夹角。

### 第 105 页：2016 年第 2 大题，球状肥皂泡缓慢膨胀（原 PDF 复校）

题设：初始静止空气中有一球状肥皂泡，半径按

$$
R=\alpha t+\beta
$$

缓慢增大，并引起肥皂泡外空气的径向流动。泡外空气视为理想、无旋、不可压缩且不计体力。要求：

1. 求肥皂泡外任一点空气速度与加速度；
2. 设初始时刻某流体质点距泡中心为 $r_0$，求该质点在 $t$ 时刻距泡中心的距离；
3. 写出拉格朗日观点下的流体速度与加速度；
4. 判断流动是否有旋；若无旋，求速度势。

#### 1. Euler 形式的速度与加速度

由球面对外推出的体积流率守恒：

$$
4\pi R^2\dot R=4\pi r^2V_r.
$$

所以

$$
V_r(r,t)=\frac{R^2\dot R}{r^2}
=\frac{\alpha(\alpha t+\beta)^2}{r^2}.
$$

径向加速度为

$$
a_r=\frac{\partial V_r}{\partial t}
+V_r\frac{\partial V_r}{\partial r}.
$$

代入得

$$
a_r
=
\frac{2\alpha^2(\alpha t+\beta)}{r^2}
-
\frac{2\alpha^2(\alpha t+\beta)^4}{r^5}.
$$

#### 2. 流体质点轨线

质点运动满足

$$
\frac{dr}{dt}
=
\frac{\alpha(\alpha t+\beta)^2}{r^2}.
$$

即

$$
r^2\,dr=\alpha(\alpha t+\beta)^2\,dt.
$$

积分得

$$
r^3=(\alpha t+\beta)^3+C.
$$

由初始条件 $t=0,\ r=r_0$ 得

$$
C=r_0^3-\beta^3.
$$

因此

$$
r(t)=\left[(\alpha t+\beta)^3+r_0^3-\beta^3\right]^{1/3}.
$$

#### 3. Lagrange 形式的速度与加速度

将上式代回速度表达式，得

$$
V_r(r_0,t)
=
\frac{\alpha(\alpha t+\beta)^2}
{\left[(\alpha t+\beta)^3+r_0^3-\beta^3\right]^{2/3}}.
$$

相应加速度可写为

$$
a_r(r_0,t)
=
\frac{2\alpha^2(\alpha t+\beta)}
{\left[(\alpha t+\beta)^3+r_0^3-\beta^3\right]^{2/3}}
-
\frac{2\alpha^2(\alpha t+\beta)^4}
{\left[(\alpha t+\beta)^3+r_0^3-\beta^3\right]^{5/3}}.
$$

#### 4. 无旋性与速度势

该流动为纯径向球对称流，且

$$
\nabla\times\mathbf{V}=0,
$$

故为无旋流，可引入速度势。由

$$
\nabla\phi=V_r\mathbf{e}_r
$$

得

$$
\frac{\partial\phi}{\partial r}
=
\frac{\alpha(\alpha t+\beta)^2}{r^2}.
$$

积分得

$$
\phi(r,t)
=
-\frac{\alpha(\alpha t+\beta)^2}{r}+C(t).
$$

其中 $C(t)$ 可并入任意时间函数。

### 第 106 页：2016 年第 3、4、5 大题开头（原 PDF 复校）

#### 3. 压差计测速

图示为水管压差计测速，已知水银压差计读数为 $\Delta h$，水和水银密度分别为 $\rho_w$、$\rho_{Hg}$。在 1、2 两点列 Bernoulli 方程：

$$
\frac{V_1^2}{2}+\frac{p_1}{\rho_w}
=
\frac{V_2^2}{2}+\frac{p_2}{\rho_w}.
$$

页内取 $V_1\simeq0$，并由压差计关系写出

$$
p_1-p_2=\rho_{Hg}g\Delta h.
$$

故原页水管流速写为

$$
V_2
=
\sqrt{
\frac{2\rho_{Hg}g\Delta h}{\rho_w}
}.
$$

#### 4. 点源 + 点涡 + 固壁边界

题设：平面流动由一个点源和一个点涡诱导，强度分别为 $Q$、$\Gamma$，在下方有一条固壁，源和涡到壁面的距离为 $b$。求：

1. 固壁上方流动复势；
2. 固壁上的流速与压强分布。

由镜像法，固壁上方复势可写为

$$
W(z)
=
\frac{Q}{2\pi}\ln(z-bi)
+\frac{\Gamma}{2\pi i}\ln(z-bi)
+\frac{Q}{2\pi}\ln(z+bi)
-\frac{\Gamma}{2\pi i}\ln(z+bi).
$$

合并得

$$
W(z)
=
\frac{Q}{2\pi}\ln(z^2+b^2)
+\frac{\Gamma}{2\pi i}
\ln\frac{z-bi}{z+bi}.
$$

复速度为

$$
\frac{dW}{dz}
=
\frac{Q}{\pi}\frac{z}{z^2+b^2}
+\frac{\Gamma b}{\pi}\frac{1}{z^2+b^2}.
$$

在固壁 $y=0$ 上，

$$
V\big|_{y=0}
=
\frac{Q}{\pi}\frac{x}{x^2+b^2}
+\frac{\Gamma}{\pi}\frac{b}{x^2+b^2}.
$$

由 Bernoulli 方程

$$
\frac{V^2}{2}+\frac{p}{\rho}
=
\frac{V_\infty^2}{2}+\frac{p_\infty}{\rho}
$$

且 $V_\infty=0$，得壁面压强分布

$$
p\big|_{y=0}
=
p_\infty
-
\frac{\rho}{2\pi^2}
\left(
\frac{Qx+\Gamma b}{x^2+b^2}
\right)^2.
$$

#### 5. 有限厚度液层的突然启动平板

题设：一无限大平板水平放置，其上方有厚度为 $h$ 的均质不可压缩粘性流体。$t=0$ 时平板突然启动，以常速度 $U$ 沿板面某一方向平移。流动为不定常流，粘性系数为 $\mu$；液体上方为空气，液体表面为自由界面。要求：

1. 写出该流动应力张量各分量，用流速、压强表示；
2. 写出该流动动量方程的 $x,y$ 分量方程；
3. 写出该流动定解条件。

速度场取

$$
\mathbf{V}=(u(y,t),0,0).
$$

应力张量为

$$
\mathbf{P}
=-p\mathbf{I}+2\mu\mathbf{S}
=
\begin{bmatrix}
-p & \mu\dfrac{\partial u}{\partial y} & 0\\
\mu\dfrac{\partial u}{\partial y} & -p & 0\\
0 & 0 & -p
\end{bmatrix}.
$$

### 第 107 页：有限液层突然启动平板的方程与边界条件（原 PDF 复校）

该题继续第 106 页。由速度场 $\mathbf{V}=(u(y,t),0,0)$，动量方程化为

$$
\frac{\partial u}{\partial t}
=
\frac{\mu}{\rho}\frac{\partial^2u}{\partial y^2},
$$

$$
0=-g-\frac{1}{\rho}\frac{\partial p}{\partial y}.
$$

初始条件为

$$
t=0,\qquad y>0:\quad u=0.
$$

边界条件为

$$
t>0,\qquad y=0:\quad u=U,
$$

自由表面处切应力为零：

$$
y=h:\qquad \mu\frac{\partial u}{\partial y}=0.
$$

### 第 108 页：2018 年 803 真题参考答案（一，原 PDF 复校）

#### 1. 雷诺数与雷诺实验

雷诺数写作

$$
Re=\frac{V_cL}{\nu}.
$$

其中 $V_c$ 是特征速度，$L$ 是特征长度，$\nu$ 是运动黏度。雷诺数表示惯性力和黏性力之比，是判定流体原来流动状态的重要判据，是一个无量纲数。

雷诺实验表明：低速时流动为层流，流体质点作有条不紊的分层运动，互相平行，圆管内横截面速度剖面呈抛物面分布；后一种流动状态紊乱无章，含有大量无规则三维涡湍，流体质点动能和动量高效混合，使平均速度剖面中心部分平坦而边缘处陡峭，造成壁面切应力增大，从而使管流阻力增大，这种流动状态是湍流。

#### 2. 稳定转动容器中的自由液面

设液体作刚体转动，角速度为 $\omega$，半径坐标为 $r$。取轴线上参考点与液体内一点 $M(r,0,z)$，由旋转坐标下的 Bernoulli 形式可写为

$$
\frac{V_0^2}{2}+\frac{p_0}{\rho}+ga-\frac{1}{2}\omega^2r_0^2
=
\frac{V_M^2}{2}+\frac{p_M}{\rho}+gz-\frac{1}{2}\omega^2r^2.
$$

稳定刚体旋转时可取

$$
V_0=0,\qquad p_0=0,\qquad r_0=0,\qquad V_M=0,
$$

于是得到压强分布

$$
p_M=\rho g(a-z)+\frac{1}{2}\rho\omega^2r^2.
$$

再令 $M$ 取在液面上，液面压强 $p_M=0$，得

$$
z=a+\frac{\omega^2r^2}{2g}.
$$

所以液面是轴线在旋转轴线上的旋转抛物面。

#### 3. 浅水小振幅波中水质点运动

若为驻波，流体质点轨迹近似为直线。在节点处，流体质点在平衡位置附近作水平方向振动；而在波峰、波谷处，流体质点在垂直方向振动。

若为前进波，流体质点近似作圆周运动，愈往下半径愈小；比较深的有限水深情况下可近似为椭圆轨道。离岸方向风区不能够形成较大波浪，波浪通常表现为波动向岸。

#### 4. 圆管紊流沿程阻力与 Nikuradse 曲线

对圆管有压流，Nikuradse 实验测定了紊流的沿程阻力系数和断面流速分布。原页结论为：层流区、临界过渡区、紊流光滑区都只与 $Re$ 数有关；紊流过渡区与 $Re$ 和相对粗糙度 $k/d$ 有关；紊流粗糙区，也即阻力平方区，只与 $k/d$ 有关，此时与 $Re$ 无关。

可概括为

$$
\lambda=f\left(Re,\frac{k}{d}\right).
$$

其中层流区常用

$$
\lambda=\frac{64}{Re}.
$$

#### 5. 参见 2000 年第 7 题

原页底部保留“见 2000 第 7 题”的提示。

### 第 109 页：2018 年 803 真题参考答案（二，原 PDF 复校）

#### 1. 三角堰流量的量纲分析

由题意，流量 $Q_v$ 与重力加速度 $g$、堰上水头高度 $h$、角度 $\theta$ 有关，其中 $\theta$ 为无量纲量。各量纲为

$$
[Q_v]=L^3T^{-1},\qquad [h]=L,\qquad [g]=LT^{-2}.
$$

因此由量纲分析可得

$$
Q_v=K(\theta)\sqrt{g}\,h^{5/2}.
$$

#### 2. 三角堰流量的解析积分

取水线上的 1、2 两点，由 Bernoulli 方程得

$$
\frac{v_1^2}{2g}+\frac{p_1}{\gamma}+y_1
=
\frac{v_2^2}{2g}+\frac{p_2}{\gamma}+y_2.
$$

由液面处压强为大气压，故 $p_2=0$；并可近似认为 $v_1=0$。又

$$
h=y_1+\frac{p_1}{\gamma},
$$

所以

$$
v_2=\sqrt{2g(h-y)}.
$$

三角堰在深度 $y$ 处的微元宽度为

$$
2y\tan\frac{\theta}{2},
$$

于是

$$
\begin{aligned}
Q_v
&=\int_0^h \sqrt{2g(h-y)}\;2y\tan\frac{\theta}{2}\,dy  \\
&=\frac{8}{15}\sqrt{2g}\tan\frac{\theta}{2}\,h^{5/2}.
\end{aligned}
$$

#### 3. 斜面液层在重力作用下的黏性流动

建立 $o-xyz$ 坐标，取 $x$ 沿斜面向下，$y$ 垂直斜面。充分发展时可取

$$
v=0,\qquad w=0,\qquad u=u(y).
$$

由连续方程

$$
\frac{\partial u}{\partial x}
+\frac{\partial v}{\partial y}
+\frac{\partial w}{\partial z}=0
$$

得

$$
\frac{\partial u}{\partial x}=0.
$$

动量方程可化为

$$
0=g\sin\alpha+\nu\frac{d^2u}{dy^2},
$$

以及法向压强平衡

$$
0=-g\cos\alpha-\frac{1}{\rho}\frac{\partial p}{\partial y}.
$$

因此该流动为沿斜面方向的黏性剪切流，原动力为 $g\sin\alpha$。边界条件可取壁面无滑移与自由面零切应力：

$$
u(0)=0,\qquad
\mu\left.\frac{du}{dy}\right|_{y=h}=0.
$$

#### 4. 点源势流：速度势 $\phi=\dfrac{m}{2\pi}\ln r$

已知

$$
\phi=\frac{m}{2\pi}\ln r.
$$

则其共轭流函数为

$$
\psi=\frac{m}{2\pi}\theta,
$$

复势为

$$
W(z)=\frac{m}{2\pi}\ln z.
$$

速度分量为

$$
v_r=\frac{\partial\phi}{\partial r}
=\frac{m}{2\pi r},
\qquad
v_\theta=\frac{1}{r}\frac{\partial\phi}{\partial\theta}=0.
$$

复速度为

$$
\frac{dW}{dz}
=\frac{m}{2\pi}\frac{1}{z}
=\frac{m}{2\pi}
\left(
\frac{x}{x^2+y^2}
-i\frac{y}{x^2+y^2}
\right).
$$

因此

$$
V^2=\left(\frac{m}{2\pi}\right)^2\frac{1}{x^2+y^2}.
$$

在场中任一点和无穷远处建立 Bernoulli 方程：

$$
\frac{V^2}{2}+\frac{p}{\rho}
=
\frac{V_\infty^2}{2}+\frac{p_\infty}{\rho}.
$$

由 $V_\infty=0$，得

$$
p=p_\infty-\frac{\rho m^2}{8\pi^2}\frac{1}{x^2+y^2}.
$$

由 $\psi=\dfrac{m}{2\pi}\theta$，通过 $A(1,-1)$ 与 $B(1,1)$ 连线的流量为

$$
Q=\psi(1,1)-\psi(1,-1)
=\frac{m}{2\pi}\cdot\frac{\pi}{2}
=\frac{m}{4}.
$$

若 $m>0$，则为沿 $x$ 正向的流动；反之为沿 $x$ 负向的流动。

#### 5. 参见 2005 年第 7 题

原页底部保留“见 2005 第七题”的提示。

### 第 110 页：2019 年 803 真题参考答案（一，原 PDF 复校）

#### 一、名词解释

##### 1. 应变率张量

应变率张量用于描述流体变形运动，即角变形率、线相对伸长率，是一个二阶张量，用 $\mathbf{S}$ 表示：

$$
\mathbf{S}=
\begin{bmatrix}
\dfrac{\partial u}{\partial x}
&
\dfrac{1}{2}\left(\dfrac{\partial u}{\partial y}+\dfrac{\partial v}{\partial x}\right)
&
\dfrac{1}{2}\left(\dfrac{\partial u}{\partial z}+\dfrac{\partial w}{\partial x}\right)
\\[6pt]
\dfrac{1}{2}\left(\dfrac{\partial v}{\partial x}+\dfrac{\partial u}{\partial y}\right)
&
\dfrac{\partial v}{\partial y}
&
\dfrac{1}{2}\left(\dfrac{\partial v}{\partial z}+\dfrac{\partial w}{\partial y}\right)
\\[6pt]
\dfrac{1}{2}\left(\dfrac{\partial w}{\partial x}+\dfrac{\partial u}{\partial z}\right)
&
\dfrac{1}{2}\left(\dfrac{\partial w}{\partial y}+\dfrac{\partial v}{\partial z}\right)
&
\dfrac{\partial w}{\partial z}
\end{bmatrix}.
$$

##### 2. 边界层厚度

在研究大 $Re$ 数流动时，一般取一薄层。薄层内速度变化率较大，黏性效应显著，该薄层厚度称为边界层厚度。平板边界层可写作

$$
\delta=k\sqrt{\frac{\nu x}{U}},
$$

其中 $k$ 为常数，$\nu$ 为运动黏度，$x$ 为沿板长度，$U$ 为特征速度。通常取

$$
\frac{u}{V_\infty}=0.99
$$

处作为流体区域与边界层外缘的分界。

##### 3. 本构方程

在牛顿黏性定律和 Stokes 假设基础上，应力张量与应变率张量的关系可写为

$$
\mathbf{P}
=-p\mathbf{I}
+2\mu\left[
\mathbf{S}
-\frac{1}{3}(\nabla\cdot\mathbf{V})\mathbf{I}
\right]
+\mu'(\nabla\cdot\mathbf{V})\mathbf{I}.
$$

其中 $\mathbf{I}$ 为单位二阶张量。该式说明：应力张量可分解为静压张量、纯剪切流动引起的黏性应力张量，以及体积变化引起的黏性应力张量。

##### 4. 雷诺数

参见 2018 年名词解释第 1 题。常用表达式为

$$
Re=\frac{\rho UL}{\mu}
=\frac{UL}{\nu}.
$$

##### 5. 雷诺应力

雷诺应力产生于湍流脉动，代表脉动对于平均流动的作用；一般黏性应力则是产生于流体微团之间的相对运动，是一种真实的力，而雷诺应力不是真实的力，是时均后表现出的附加动量输运项。二维剪切分量常写为

$$
\tau_t=-\rho\overline{u'v'}.
$$

按混合长模型，也可写为

$$
\tau_t
=\rho l_m^2
\left|
\frac{d\overline{u}}{dy}
\right|
\frac{d\overline{u}}{dy}.
$$

#### 二、脉冲在直管中传播

设流体密度为

$$
\rho=\rho_0 f(ct-x).
$$

一维连续方程为

$$
\frac{\partial \rho}{\partial t}
+\frac{\partial(\rho u)}{\partial x}=0.
$$

记 $\xi=ct-x$，则

$$
\rho_t=\rho_0 c f'(\xi),
\qquad
\rho_x=-\rho_0 f'(\xi).
$$

代入连续方程得

$$
\rho_0 c f'
+\rho\frac{\partial u}{\partial x}
-\rho_0 f'u=0,
$$

即

$$
\frac{\partial u}{\partial x}
=\frac{f'}{f}(u-c).
$$

所以

$$
u=c+\frac{C}{f(ct-x)}.
$$

若按原页把 $f'/f$ 作为该段常比值，则可写为

$$
u=c+K e^{-\frac{f'}{f}x}.
$$

当 $x=0$ 时 $u=u_0$，于是

$$
u=c+(u_0-c)e^{-\frac{f'}{f}x}.
$$

密度的随体导数为

$$
\frac{D\rho}{Dt}
=\frac{\partial\rho}{\partial t}
+u\frac{\partial\rho}{\partial x}
=\rho_0 f'(c-u).
$$

#### 三、正压流体与细导管绝热流出

##### 1. 概念

正压流体是指密度仅是压强函数的流体，即

$$
\rho=\rho(p).
$$

Bernoulli 积分适用于理想、正压、外力有势并沿流线的定常流动；Lagrange 积分通常用于理想、正压、外力有势且无旋的非定常流动。

##### 2. 大容器经细导管流出

由于细导管连接大容器，可不计容器内流体速度。从容器内到外界建立 Bernoulli 方程：

$$
\frac{\gamma}{\gamma-1}\frac{nP_0}{\rho'}
=
\frac{v^2}{2}
+\frac{\gamma}{\gamma-1}\frac{P_0}{\rho}.
$$

又由绝热关系

$$
\frac{\rho'}{\rho}=n^{1/\gamma},
$$

得

$$
v^2=
\frac{2\gamma P_0}{(\gamma-1)\rho}
\left(
n^{\frac{\gamma-1}{\gamma}}-1
\right).
$$

其中 $\rho'$ 为容器内密度。

### 第 111 张图（原页 109）：2019 年 803 真题参考答案（二）

#### 四、绕圆柱势流速度场与圆柱表面压强

设二维不可压、无旋流动可用速度势 $\phi(r,\theta)$ 描述，则极坐标下速度势满足 Laplace 方程

$$
\frac{\partial^2\phi}{\partial r^2}
+\frac1r\frac{\partial\phi}{\partial r}
+\frac1{r^2}\frac{\partial^2\phi}{\partial\theta^2}=0.
$$

圆柱半径为 $a$，无穷远处为速度 $V_\infty$ 的均匀来流。圆柱表面无穿透，故

$$
r=a:\quad V_r=\frac{\partial\phi}{\partial r}=0,
$$

无穷远处速度势与均匀来流一致：

$$
r\to\infty:\quad \phi\sim V_\infty r\cos\theta.
$$

令

$$
\phi=R(r)\cos\theta,
$$

代入 Laplace 方程得

$$
R''(r)+\frac1rR'(r)-\frac1{r^2}R(r)=0.
$$

通解为

$$
R(r)=C_1r+C_2\frac1r.
$$

由无穷远条件得 $C_1=V_\infty$，由圆柱表面无穿透条件得 $C_2=V_\infty a^2$，因此

$$
\phi=V_\infty\left(r+\frac{a^2}{r}\right)\cos\theta.
$$

由速度势可得

$$
V_r=\frac{\partial\phi}{\partial r}
=V_\infty\left(1-\frac{a^2}{r^2}\right)\cos\theta,
$$

$$
V_\theta=\frac1r\frac{\partial\phi}{\partial\theta}
=-V_\infty\left(1+\frac{a^2}{r^2}\right)\sin\theta.
$$

对应流函数为

$$
\psi
=\left(V_\infty r-\frac{V_\infty a^2}{r}\right)\sin\theta.
$$

复势也可写为

$$
W(z)=V_\infty z+\frac{V_\infty a^2}{z}.
$$

圆柱表面 $r=a$ 上

$$
V_r=0,\qquad V_\theta=-2V_\infty\sin\theta.
$$

由 Bernoulli 方程

$$
\frac{V^2}{2}+\frac{p}{\rho}
=
\frac{V_\infty^2}{2}+\frac{p_\infty}{\rho},
$$

可得圆柱表面压强

$$
p_a=p_\infty+\frac12\rho V_\infty^2(1-4\sin^2\theta).
$$

#### 五、两平板间粘性流动与剪切应力

取 $x$ 沿平板运动方向，$y$ 垂直平板。充分发展流动满足

$$
v=0,\qquad w=0,\qquad u=u(y),
$$

连续方程给出

$$
\frac{\partial u}{\partial x}=0.
$$

动量方程化为

$$
\frac{\partial p}{\partial x}
=
\mu\frac{d^2u}{dy^2},
$$

其中 $\mu=\rho\nu$。若令

$$
\frac{\partial p}{\partial x}=\Delta P,
$$

则

$$
u=\frac{\Delta P}{2\mu}y^2+C_1y+C_2.
$$

按原页边界条件，中间板面处 $y=0$ 有

$$
u=U,
$$

两侧固定板面处取

$$
y=\pm h:\quad u=0.
$$

于是上下两侧速度分布可分别按对应边界条件代入二次式确定。壁面剪切应力为

$$
\tau=\mu\left.\frac{du}{dy}\right|_{y=0}.
$$

原页给出的整理结果为

$$
\tau
=2\mu\left(\frac{\Delta P}{2\mu}h+\frac{U}{h}\right)
=\Delta P\,h+\frac{2\mu U}{h},
$$

其方向与板面运动方向相反。

### 第 112 张图（原页 110）：2020 年 803 真题参考答案（一）

#### 一、简答题

##### 1. 皮托管测流速

皮托管有内外两层。内管水平对准来流，测得总压；外管侧面开口，测得静压。故测得的是压差。

在内管 1 和外管 2 处建立 Bernoulli 方程：

$$
\frac{V_1^2}{2}+\frac{p_1}{\rho}+gy_1
=
\frac{V_2^2}{2}+\frac{p_2}{\rho}+gy_2.
$$

因 $y_1\simeq y_2$，且驻点处 $V_1=0$，得

$$
V_2=\sqrt{\frac{2(p_1-p_2)}{\rho}}.
$$

由液柱高度差 $\Delta h$ 可得 $p_1-p_2$，因此

$$
V_2=\sqrt{\frac{2\rho_m}{\rho}g\Delta h},
$$

即可测出流速。这里 $\rho_m$ 表示测压液密度。

##### 2. 湍流的几个特征

（1）随机性：不规则脉动。

（2）混合性：高效混合。

（3）有旋性：不可只按无旋流动处理。

（4）耗散性：湍流涡旋把平均流动能量逐级转化并耗散。

##### 3. 牛顿流体

应力张量 $\boldsymbol P$ 与变形运动张量 $\boldsymbol S$ 之间满足广义 Newton 公式的流体称为牛顿流体，如水等。

##### 4. Euler 法与 Lagrange 法

Euler 法研究控制体或空间点上的流场变化，例如渠流观测、密度流观测等。

Lagrange 法研究流体质点运动，例如追踪浮子、ADCP 声学测流仪等。

##### 5. Rossby 数

$$
R_o=\frac{U^2/L}{\Omega U}
=\frac{U}{\Omega L}.
$$

当 $R_o\gg1$ 时，可以不考虑旋转效应；当 $R_o\ll1$ 时，旋转效应对流体运动有重要意义。

#### 二、二维非定常速度场

原页给出

$$
\frac{dx}{dt}=t+1,\qquad \frac{dy}{dt}=1.
$$

积分得

$$
x=\frac12t^2+t+C_1,\qquad y=t+C_2.
$$

若 $t=0$ 时质点位于原点，则

$$
x=\frac12t^2+t,\qquad y=t.
$$

当 $t=0$ 时

$$
u=1,\qquad v=1,
$$

轨线斜率满足

$$
\frac{dy}{dx}=\frac{v}{u}=1,
$$

且轨线过原点，故

$$
y=x.
$$

当 $t=1$ 时

$$
u=2,\qquad v=1,
$$

运动方向与 $x$ 轴夹角 $\beta$ 满足

$$
\tan\beta=\frac{v}{u}=\frac12,
\qquad
\beta=\arctan\frac12.
$$

#### 三、U 形管中液体振荡

取有液柱中线为基准面，从 1 到 2 使用 Lagrange 方程。原页把速度水头、压强水头和非定常项写成一式：

$$
h_1+\frac{p_1}{\gamma}+\frac{u_1^2}{2g}
=
h_2+\frac{p_2}{\gamma}+\frac{u_2^2}{2g}
+\frac1g\int_1^2\frac{\partial u}{\partial t}\,dl.
$$

在两端自由液面大气压、截面速度相同的近似下，令液面偏移量为 $z$，可化成简谐振动方程

$$
\ddot z=-\frac{2g}{L}z.
$$

因此

$$
\omega=\sqrt{\frac{2g}{L}},
\qquad
z=z_0\sin\left(\sqrt{\frac{2g}{L}}\,t+\frac{\pi}{2}\right).
$$

### 第 113 张图（原页 111）：2020 年 803 真题参考答案（二，原 PDF 复校）

#### 五、Karman 涡街相似与释放频率

##### 1. 动力相似条件

Karman 涡街释放频率与圆柱直径 $d$、流体运动粘度 $\nu$ 和来流速度 $U$ 有关。若保证动力相似，应满足

$$
Re_1=Re_2.
$$

即

$$
\frac{U_1d_1}{\nu_1}
=
\frac{U_2d_2}{\nu_2}.
$$

若两流体相同，则 $\nu_1=\nu_2$，故

$$
\frac{U_1}{U_2}=\frac{d_2}{d_1}.
$$

原页代入给定几何比例后写为

$$
\frac{U_1}{U_2}=\frac{d_2}{d_1}=\frac13.
$$

##### 2. 量纲分析

设

$$
f=k\nu^{\alpha}d^{\beta}U^{\delta}.
$$

各量纲为

$$
[f]=T^{-1},\qquad [\nu]=L^2T^{-1},\qquad [d]=L,\qquad [U]=LT^{-1}.
$$

则

$$
T^{-1}
=
L^{2\alpha+\beta+\delta}T^{-\alpha-\delta}.
$$

量纲齐次给出

$$
2\alpha+\beta+\delta=0,\qquad \alpha+\delta=1.
$$

按原页取 $\alpha=1$，得

$$
\delta=0,\qquad \beta=-2,
$$

故

$$
f=k\frac{\nu}{d^2}.
$$

若模型与实物直径比按原页给定，则

$$
\frac{f_1}{f_2}
=
\left(\frac{d_2}{d_1}\right)^2
=\frac19.
$$

#### 六、同轴圆筒间粘性旋转流

设流动为轴对称纯周向流：

$$
V_r=0,\qquad V_z=0,\qquad V_\theta=V_\theta(r).
$$

由连续方程可知

$$
\frac{\partial V_\theta}{\partial\theta}=0.
$$

径向动量方程为

$$
-\frac{V_\theta^2}{r}
=-\frac1\rho\frac{\partial p}{\partial r}.
$$

周向动量方程化为

$$
\frac{d}{dr}
\left[
\frac1r\frac{d}{dr}(rV_\theta)
\right]=0.
$$

故

$$
V_\theta=C_1r+\frac{C_2}{r}.
$$

##### 1. 内筒固定、外筒转动

边界条件为

$$
r=a:\quad V_\theta=0,
\qquad
r=b:\quad V_\theta=\omega b.
$$

解得

$$
C_1=\frac{\omega b^2}{b^2-a^2},
\qquad
C_2=-\frac{\omega a^2b^2}{b^2-a^2}.
$$

剪切应力为

$$
P_{r\theta}
=
\mu r\frac{d}{dr}\left(\frac{V_\theta}{r}\right)
=
\mu r\frac{d}{dr}\left(C_1+\frac{C_2}{r^2}\right)
=-\frac{2\mu C_2}{r^2}.
$$

代入得

$$
P_{r\theta}
=
\frac{2\mu\omega a^2b^2}{(b^2-a^2)r^2}.
$$

单位长度内筒所受力矩为

$$
M
=
\left.P_{r\theta}\right|_{r=a}\,2\pi a^2
=
\frac{4\pi\mu\omega a^2b^2}{b^2-a^2}.
$$

##### 2. 外筒固定、内筒转动

边界条件为

$$
r=a:\quad V_\theta=\omega a,
\qquad
r=b:\quad V_\theta=0.
$$

解得

$$
C_1=-\frac{\omega a^2}{b^2-a^2},
\qquad
C_2=\frac{\omega a^2b^2}{b^2-a^2}.
$$

于是

$$
P_{r\theta}
=-\frac{2\mu\omega a^2b^2}{(b^2-a^2)r^2}.
$$

单位长度内筒所受力矩为

$$
M
=
\left.P_{r\theta}\right|_{r=a}\,2\pi a^2
=
-\frac{4\pi\mu\omega a^2b^2}{b^2-a^2}.
$$

### 第 114 张图（原页 112）：2020 年 803 真题参考答案（三，原 PDF 复校）

#### 四、均匀流与源汇叠加

如原页图示，均匀流沿 $x$ 轴正向，叠加位于 $x=\pm a$ 的源汇。由平面不可压势流叠加原理，复势可写为

$$
W(z)
=
V_\infty z
-\frac{Q}{2\pi}\ln(z-a)
+\frac{Q}{2\pi}\ln(z+a).
$$

流函数为

$$
\psi
=
V_\infty y
+\frac{Q}{2\pi}(\theta_1-\theta_2).
$$

利用两角差公式可写成

$$
\psi
=
V_\infty y
+\frac{Q}{2\pi}
\arctan\left(
\frac{-2ay}{x^2+y^2-a^2}
\right).
$$

速度势可写为

$$
\phi
=
V_\infty x
+\frac{Q}{2\pi}\ln\sqrt{(x+a)^2+y^2}
-\frac{Q}{2\pi}\ln\sqrt{(x-a)^2+y^2}.
$$

因此速度分量为

$$
u_x=\frac{\partial\phi}{\partial x}
=
V_\infty
+\frac{Q}{2\pi}
\left[
\frac{x+a}{(x+a)^2+y^2}
-\frac{x-a}{(x-a)^2+y^2}
\right],
$$

$$
u_y=\frac{\partial\phi}{\partial y}
=
\frac{Q}{2\pi}
\left[
\frac{y}{(x+a)^2+y^2}
-\frac{y}{(x-a)^2+y^2}
\right].
$$

令 $\psi=0$，可得分界流线方程

$$
V_\infty y
+\frac{Q}{2\pi}
\arctan\left(
\frac{-2ay}{x^2+y^2-a^2}
\right)=0.
$$

整理为

$$
y
=
-\frac{Q}{2\pi V_\infty}
\arctan\left(
\frac{-2ay}{x^2+y^2-a^2}
\right).
$$

原页流线图略，并注明“可自行描述”。

### 第 115 张图（原页 113）：2021 年硕士研究生招生考试试题参考答案（一，原 PDF 复校）

科目代码：803。科目名称：流体力学。

#### 一、速度分解

将邻域内一点 $M$ 的速度分解为中心 $M_0$ 上的平动速度、绕 $M_0$ 点的转动速度和因流体变形在 $M$ 点引起的速度三者之和。

#### 二、文丘里管流量

文丘里管通过设置不同截面积制造压强差，通过 Bernoulli 积分求得流量。

连续方程与 Bernoulli 方程为

$$
Q=S_1V_1=S_2V_2,
$$

$$
\frac{V_1^2}{2}+\frac{P_1}{\rho}
=
\frac{V_2^2}{2}+\frac{P_2}{\rho}.
$$

由此得

$$
Q
=
S_2
\sqrt{
\frac{2(P_1-P_2)}
{\rho\left[1-\left(\dfrac{S_2}{S_1}\right)^2\right]}
}.
$$

其中 $P_1,P_2$ 往往用其他液柱高度差表示。

#### 三、常用无量纲数

Reynolds 数：

$$
Re=\frac{VL}{\nu},
$$

表示流体粘性程度，也可用 $V_\infty$ 表示特征速度，注意防止与速度 $v$ 混淆。

Strouhal 数：

$$
St=\frac{L}{Vt},
$$

表示非定常效应尺度。

Froude 数：

$$
Fr=\frac{V^2}{gL},
$$

表示流体重力效应。

#### 四、贸易风

根据 Bjerknes 定理，等压面和等容面相交，在赤道地区形成信风。原页注明“第二版例 5.4”，并提示使用右手定则判断贸易风方向。

#### 五、层流与湍流

雷诺数大于临界雷诺数，且有扰动产生时，流动可能失稳并由层流转捩为湍流。

层流通过分子热运动发生动量交换。

湍流通过湍流摩擦力和分子热运动共同交换动量。

#### 六、速度场的 Lagrange 表达与 Euler 表达

##### 1. Lagrange 表达

原页给出

$$
u=\frac{\partial x}{\partial t}
=a_1\left(-\frac2k\right)e^{-2t/k}
=-\frac{2a_1}{k}e^{-2t/k},
$$

$$
v=\frac{\partial y}{\partial t}
=a_2\frac1k e^{t/k}
=\frac{a_2}{k}e^{t/k}.
$$

##### 2. Euler 表达

由

$$
x=a_1e^{-2t/k},\qquad y=a_2e^{t/k},
$$

得

$$
a_1=xe^{2t/k},\qquad a_2=ye^{-t/k}.
$$

代入 Lagrange 表达式得速度场

$$
u=-\frac2k x,
\qquad
v=\frac1k y.
$$

### 第 116 张图（原页 114）：2021 年硕士研究生招生考试试题参考答案（二，原 PDF 复校）

#### 七、弯管开启瞬间的非定常压强

用 Lagrange 积分，设截面 3 为 $AB$ 处任意截面，截面 4 为 $BC$ 处任意截面。1、2 分别为 $A$、$C$ 处断面。开启瞬间速度处处为零，且

$$
P_2=P_1=0
$$

（去大气压）。

在 1、2 间应用 Lagrange 方程：

$$
\int_1^2\frac{\partial\vec v}{\partial t}\cdot d\vec l
+g(-H)=0.
$$

于是

$$
2H\frac{\partial v}{\partial t}=gH,
$$

故加速度为

$$
\frac{dv}{dt}
=
\frac{\partial v}{\partial t}
=
\frac12 g.
$$

在 1、3 处用 Lagrange 方程：

$$
\int_1^3\frac{\partial\vec v}{\partial t}\cdot d\vec l
+\frac{p}{\rho}
+g(z-H)=0.
$$

即

$$
\frac{\partial v}{\partial t}(H-z)
+\frac{p}{\rho}
+g(z-H)=0.
$$

因此

$$
P_z=\frac12\rho g(H-z).
$$

若原静压为

$$
P'=\rho g(H-z),
$$

则

$$
P_z=\frac12P'.
$$

另外，由水平压强关系

$$
\int_4^2\frac{\partial\vec v}{\partial t}\cdot d\vec l
+\frac{0-P}{\rho}=0,
$$

得

$$
P_x=-\frac12\rho g(H-x).
$$

#### 八、弯管动量方程

取 1、2 之间为控制体，建立坐标系 $xoy$，$O$ 为转折处中心点，如原图所示。

连续方程为

$$
\frac{\pi}{4}d_1^2v_1
=
\frac{\pi}{4}d_2^2v_2,
$$

即

$$
\frac{v_1}{v_2}=\frac{d_2^2}{d_1^2},
\qquad
Q_1=Q_2.
$$

### 第 117 张图（原页 115）：2021 年硕士研究生招生考试试题参考答案（三，原 PDF 复校）

#### 八、弯管动量方程（续）

动量方程为

$$
\begin{cases}
x\text{ 方向：}\quad
p_1\frac{\pi}{4}d_1^2
-p_2\frac{\pi}{4}d_2^2\cos\theta
+R_x
=Q_2V_2\cos\theta-Q_1V_1,\\[4pt]
y\text{ 方向：}\quad
-p_2\frac{\pi}{4}d_2^2\sin\theta
-mg+R_y
=Q_2V_2\sin\theta.
\end{cases}
$$

联立连续关系可得

$$
\begin{cases}
R_x
=
-p_1\frac{\pi}{4}d_1^2
+p_2\frac{\pi}{4}d_2^2\cos\theta
+\frac{\pi}{4}d_1^2V_1
\left(
\dfrac{d_1^2}{d_2^2}V_1\cos\theta-V_1
\right),\\[8pt]
R_y
=
p_2\frac{\pi}{4}d_2^2\sin\theta
+mg
+\frac{\pi}{4}d_1^2V_1^2
\dfrac{d_1^2}{d_2^2}\sin\theta.
\end{cases}
$$

根据 Newton 第三定律，水流对弯管的作用力为

$$
R_x'=-R_x,\qquad R_y'=-R_y.
$$

#### 九、复势分解与流量、环量

原页给出复势可拆分为

$$
W(z)
=
(1+i)\ln(z+i)
+(1+i)\ln(z-i)
+\frac1z
+(2-3i)\ln(z+2i)
+(2-3i)\ln(z-2i).
$$

因此共有五个点流动：在 $z=\pm i$ 处有一对涡源，在原点处有偶极，在 $z=\pm2i$ 处有一对涡源。

也可以继续拆分为点流动，但原页注明“没必要”。

曲线 $C$ 为

$$
x^2+y^2=2,
$$

故 $z=\pm2i$ 不在该曲线包围范围内，所以

$$
(2-3i)\ln(z\pm2i)
$$

环积分无奇点，贡献为零。

根据留数定理，

$$
Q_v
=
\operatorname{Im}
\left\{
\oint_C\frac{dW(z)}{dz}\,dz
\right\}
=2\pi+2\pi+0+0+0=4\pi.
$$

同理，

$$
\Gamma
=
\operatorname{Re}
\left\{
\oint_C\frac{dW(z)}{dz}\,dz
\right\}
=2\pi+2\pi=4\pi.
$$

因此流量 $Q_v$ 和速度环量 $\Gamma$ 均为

$$
4\pi.
$$

### 第 118 张图（原页 116）：2021 年硕士研究生招生考试试题参考答案（四，原 PDF 复校）

#### 十、粘性流动题提示

此题在真题中已出现多次原题，参考往年真题即可。原页提示：粘性流动一般为最后一题。

### 第 119 张图（原页 105）：流体力学易错名词及概念汇总（一，原 PDF 复校）

#### 1. 亥姆霍兹速度分析定理

$$
\vec V(M)
=
\vec V(M_0)
+\mathbf S\cdot\delta\vec r
+\frac12\operatorname{rot}\vec V\times\delta\vec r.
$$

即 $M$ 点速度是与 $M_0$ 点相同的平动速度 $\vec V(M_0)$、绕 $M_0$ 点转动在 $M$ 点引起的速度

$$
\frac12\operatorname{rot}\vec V\times\delta\vec r,
$$

以及因流体变形在 $M$ 点引起的速度 $\mathbf S\cdot\delta\vec r$ 三者之和。

#### 2. 本构方程

$$
\mathbf P
=
-p\mathbf I
+2\mu\left(\mathbf S-\frac13\nabla\cdot\vec V\,\mathbf I\right)
+\left(\lambda+\frac23\mu\right)(\nabla\cdot\vec V)\mathbf I.
$$

应力张量可理解为

$$
\text{应力张量}
=
\text{静压张量}
+\text{纯剪切流动引起的粘性应力张量}
+\text{体积变化引起的应力张量}.
$$

#### 3. 运动方程（动量方程）

$$
\frac{d\vec V}{dt}
=
\vec F
-\frac1\rho\nabla p
+\gamma\nabla^2\vec V
+\frac13\gamma\nabla(\nabla\cdot\vec V),
$$

其中 $\gamma$ 是运动粘性系数。

物理意义为

$$
\frac{d\vec V}{dt}
=
\text{单位体积上受到的体积力}
+\text{压强梯度力}
+\text{粘性力}.
$$

#### 4. 涡度方程

$$
\frac{d\boldsymbol\omega}{dt}
=
(\boldsymbol\omega\cdot\nabla)\vec V
-\boldsymbol\omega(\nabla\cdot\vec V)
+\nabla\times\vec F_b
-\nabla\times\frac{\nabla p}{\rho}
+\nabla\times\gamma\nabla^2\vec V
+\frac13\gamma\nabla\times\nabla(\nabla\cdot\vec V).
$$

#### 5. Nikuradse 曲线

Nikuradse 曲线用于对圆管有压流进行系统的沿程阻力系数和断面流速分布测定。

（1）层流区：粗糙管和光滑管阻力系数相同。

（2）临界过渡区：临界 $Re$ 数与相对粗糙度无关，过渡状态也与相对粗糙度无关。

（3）紊流光滑区：一个相对粗糙度对应阻力系数，都有一个分布区域；区域内光滑管阻力系数相同。

（4）紊流过渡区：与 $Re$ 和 $k/d$ 有关。粗糙管阻力系数大于光滑管，$k/d$ 越大，发生变化时 $Re$ 越小。

（5）紊流粗糙区（阻力平方区）：只与 $k/d$ 有关，且基本为常数。

第（1）和第（3）区只与 $Re$ 有关。

#### 6. 波浪运动水质点特点（考虑小振幅）

若为驻波，流体质点轨迹是直线；在节点处，流体质点在平衡位置附近作水平振动；在波峰、波谷处，流体质点在垂直方向作微小振动。

### 第 120 张图（原页 106）：流体力学易错名词及概念汇总（二，原 PDF 复校）

若为前进波，流体质点近似作圆周运动或椭圆运动，越往下质点运动半径越小。原页提示可复习 Stokes 波、椭圆余弦波、重力波、孤立波、惯性重力波五种波动展开；若时间不足，参考本条即可。

#### 7. 应变率张量

应变率张量描述流体变形运动，即角变形率、线相对增长率的二阶张量，用 $\mathbf S$ 表示。

#### 8. Reynolds 实验

流动分为层流、湍流两种。层流流线层次分明，互相平行，沿管道速度剖面成抛物面分布。

湍流流动中流体质点运动杂乱无章，含有大量无规则三维涡旋。流体质点动能和动量高效混合，使平均速度剖面中心部分平坦而边缘更陡，造成壁面剪应力增大，从而使管流阻力增大。

#### 9. Rossby 数

Rossby 数表征惯性力和 Coriolis 力之比：

$$
\frac{V^2/L}{\Omega V}
=
\frac{V}{\Omega L}
=R_o.
$$

它是衡量科氏力效应，即旋转效应的重要参数。当 $R_o\gg1$ 时，可以不考虑旋转效应；当 $R_o\ll1$ 时，旋转效应对流体运动有决定意义。

#### 10. 动能方程、能量方程与耗散方程

动能方程：

$$
\rho\frac{D}{Dt}\left(\frac{V^2}{2}\right)
=
\rho\vec F_b\cdot\vec V
-\vec V\cdot\nabla p.
$$

能量方程：

$$
\rho\vec F_b\cdot\vec V
+\vec V\cdot(\nabla\cdot\mathbf P)
+\mathbf P:\mathbf S
+\operatorname{div}(k\nabla T)
=
\rho\frac{De}{Dt}.
$$

耗散方程：

$$
\varphi
=
2\mu\,\mathbf S:\mathbf S
-\frac{2\mu}{3}(\operatorname{div}\vec V)^2.
$$

#### 11. 层流与湍流

层流：流动有明确流线，严格分层，层与层之间有剪切流动，没有法向混合。

湍流：流动没有明确流线，不分层。流体团之间混合明显；流动除了沿大方向整体运动，还存在无规则脉动，由扰动产生，伴随涡的产生和传播。

#### 12. Prandtl 混合长理论

Prandtl 混合长理论借鉴“分子自由程”的概念，假设湍流中的流体微团有“混合长”；流体微团只有移动了这个尺度距离后，才能与其他流体微团发生混合，从而失去原有流动特性。

对于二维平行剪切流动，有公式

$$
-\rho\overline{u'v'}
=
\rho l_m^2
\left|\frac{d\overline u}{dy}\right|
\frac{d\overline u}{dy},
$$

其中 $l_m$ 为混合长。

#### 13. 边界层方程

### 第 121 张图（原页 107）：流体力学易错名词及概念汇总（三，原 PDF 复校）

二维定常不可压边界层方程可写为

$$
\begin{cases}
\dfrac{\partial u}{\partial x}
+\dfrac{\partial v}{\partial y}=0,\\[6pt]
u\dfrac{\partial u}{\partial x}
+v\dfrac{\partial u}{\partial y}
=
-\dfrac1\rho\dfrac{\partial p}{\partial x}
+\nu\dfrac{\partial^2u}{\partial y^2},\\[6pt]
\dfrac{\partial p}{\partial y}=0.
\end{cases}
$$

边界条件为

$$
\begin{cases}
y=0:\quad u=0,\ v=0,\\[4pt]
y\to\infty:\quad u=v_0(x),\ \dfrac{\partial u}{\partial y}=0.
\end{cases}
$$

#### 14. 边界层理论

在研究大 $Re$ 数、无流动分离的绕流问题时，一般在边界附近分出一薄层，以薄层边界为界，层内按照粘性流体处理，层外按照理想流体绕流处理。

以薄层为边界层，一般人为规定与外部流动速度相差 $1\%$ 的地方为边界层上界。

Prandtl 边界层理论认为边界层中粘性力和惯性力同量级，粘性效果显著；边界层外粘性效果很小。当 $Re\to\infty$ 时，薄层厚度趋于零，即边界层厚度尺度远小于固体边界尺度。

#### 15. 位移厚度与动量损失厚度

位移厚度可写为

$$
\delta_p=\delta_v
=
\int_0^\delta
\left(1-\frac{u}{V_e}\right)dy.
$$

动量损失厚度可写为

$$
\theta
=
\int_0^\delta
\frac{u}{V_e}
\left(1-\frac{u}{V_e}\right)dy
=\delta_m.
$$

#### 16. 湍流运动基本特性

随机性：不规则随机运动。

混合性：高效混合。

有旋性：不同尺度三维涡旋。

耗散性：湍流耗散更多能量。

#### 17. 边界层理论应用

在航空飞行器上，通过设计“层流剖翼面”，以维持原边界层，避免边界层分离，使机翼阻力增加。原页提示可多找几个例子。

#### 18. Bernoulli 方程

在满足理想、正压、体积力有势流体定常流动情况下，同一条流线上各点单位质量机械能，即动能、压能和体积力势能之和相等。

#### 19. 牛顿流体

应力张量 $\mathbf P$ 与应变率张量 $\mathbf S$ 之间的关系满足广义牛顿公式的流体称为牛顿流体，否则称为非牛顿流体。

#### 20. Kelvin 定理

Kelvin 定理表明：如果考虑的是理想正压流体，且外力有势，则沿任一封闭物质线的速度环量和通过任一物质面的涡通量在运动过程中不变。

#### 21. 流线

流线是同一时刻流场内速度的连线，线上速度方向即为该点流线的切线方向。

### 第 122 张图（原页 108）：流体力学易错名词及概念汇总（四，原 PDF 复校）

#### 22. 大 $Re$ 数为什么引入边界层近似

在物面附近定会有一薄层，其内部流体速度沿物面切向分量由外部理想流体流动速度迅速减小至物面处切向速度为零。该层内不满足雷诺数远大于 1 的条件，而是粘性力与惯性力同等重要。引入边界层可以解释：在离开物面的广大区域，大雷诺数流动与理想流动接近一致，而在该层物体受到阻力这一事实。

#### 23. 雷诺应力

雷诺应力产生于湍流脉动，代表脉动对于平均流的作用。一般粘性应力则产生于流体微团之间的相对运动，是一种真实的力；雷诺应力不是真实的力。

#### 24. 流体易流动性

流体静止时只有法向应力，没有切向应力。

#### 25. 连续介质假设

液体由不连续的分子或原子构成，但在流体运动尺度远大于分子平均自由程时，可将流体看成连续的流体微团。流体微团需保证宏观上足够小、微观上足够大。若气体分子自由程较大，例如稀薄大气层，同样不适用。

#### 26. 几何相似、运动相似、动力相似

几何相似：指流场中被绕流物体和流场中各对应在线元之间夹角相等，且对应长度成比例。分别取模型与实物的特征长度和特征时间构成无量纲量，那么两流场中无量纲坐标和无量纲时间相同的点称为时空对应点。

运动相似：指两个几何相似的流场中，时空对应点上速度方向相同，大小成比例。

动力相似：指两个运动相似的流场中，时空对应点上对应面元所受力方向相同，大小成比例。

#### 27. 速度散度

$$
\nabla\cdot\vec V
$$

是流体微团体积相对变化率，等于流体微团沿坐标轴相对伸长率之和。若

$$
\nabla\cdot\vec V=0,
$$

则流体不可压，有流函数。

#### 28. 速度旋度

$$
\nabla\times\vec V
$$

是流体微团自转角速度的 $2\boldsymbol\omega$。若

$$
\nabla\times\vec V=0,
$$

则流体无旋，有速度势。

#### 29. 复位势

复位势针对理想、无旋、定常、二维流动。设

$$
W(z)=\phi+i\psi,
$$

则

$$
\operatorname{Re}W(z)=\phi,\qquad
u=\frac{\partial\phi}{\partial x}
=\frac{\partial\psi}{\partial y},
\qquad
\psi=\text{const}
$$

为流线；

$$
\operatorname{Im}W(z)=\psi,\qquad
v=\frac{\partial\phi}{\partial y}
=-\frac{\partial\psi}{\partial x},
$$

且

$$
Q_{AB}=|\psi_B-\psi_A|.
$$

#### 30. 复位势中象方法基本思想

设想以 $C$ 为边界区域的 $\tau'$ 之外存在一组流体力学上的奇点 $S$。若在 $\tau'$ 内放置一组奇点 $S'$ 后，组合流场恰好存在这样一条流线，它就是边界 $C$，那么奇点 $S'$ 就称为奇点 $S$ 关于边界 $C$ 的镜象。

### 第 123 张图（原页 109）：流体力学易错名词及概念汇总（五，原 PDF 复校）

由奇点 $S$ 和 $S'$ 构成的组合流场复势，就是所求的 $\tau'$ 之外区域 $\tau$ 中流场的复势。求 $S$ 的镜象代替区域 $\tau'$，这种方法通常称为镜象法。

#### 31. 球形液滴下落均匀定常速度

$$
V_{te}
=
\frac29
\frac{(\rho-\rho_{\text{空}})ga^2}{\eta},
$$

其中 $a$ 是半径。

#### 32. 湍流三个区域

湍流三个区域见《流体力学第二版下册》P164。

#### 33. 平板边界层厚度

$$
\delta
=
k\sqrt{\frac{\nu x}{V}},
$$

其中 $k$ 为常数。故边界层厚度与流体粘性系数、流体在平板上位置、来流速度有关。

#### 34. 边角知识

原页列出：

兰金涡。

圆柱绕流结论。

比较零散，在书中自行总结整理语言，也可在其他选答题中总结。

卡门涡街。

地坡风或贸易风现象。

各种无量纲数。

圆管层流剖面。

### 第 124 张图（原页 131）：中国海洋大学 2023 年硕士研究生招生考试试题参考答案（一，原 PDF 复校）

科目代码：803。科目名称：流体力学。

#### 1. 写出内能方程及各项的物理意义

$$
\rho\frac{dU}{dt}
=
-p\nabla\cdot\vec V
+\nabla\cdot(k\nabla T)
+\rho q
+\Phi.
$$

各项物理意义为

$$
\text{内能变化项}
=
\text{压缩功}
+\text{扩散项}
+\text{辐射项}
+\text{粘性耗散项}.
$$

#### 2. 为什么潜艇和水面舰船所受阻力不同

潜艇在水面航行时，影响航速的阻力一般有摩擦阻力、旋涡阻力、兴波阻力、突出体阻力和空气阻力。这 5 种阻力随着航速的增加而变大。

潜艇在水下时空气阻力不存在；由波浪造成的兴波阻力也会随着潜艇下潜深度的增加而减小。这样，影响潜艇水下航速的阻力只剩下摩擦阻力、旋涡阻力和突出体阻力。

#### 3. 解释弧线球（香蕉球）原理

Magnus 效应：旋转的球带动空气形成环流，一侧气体加速，另一侧气体速度减小，所以会形成压差。当球带有一定旋转速度时，球一侧的旋转速度与前进速度可以抵消，另一侧相对速度更大，两侧之间形成压力差。

此时会产生相应的 Magnus 力，将球吸向空气流速较高的一侧。足球两侧压力差的净结果是，球受到一个从高压区指向低压区的合力作用，使球偏离原直线运动方向。

原页图示标注为：气流速度大，压力小；气流速度小，压力大。

#### 4. 解释涡旋过山以后为什么旋转会加强

##### 方法 1：位涡守恒

位涡守恒可写为

$$
\frac{\omega+f}{h}=C.
$$

涡旋过山相比于大洋环流属于小尺度，行星涡度在该过程中几乎不变；当涡旋过山后，$h$ 增加。若保持位涡守恒，则相对涡度增加，旋转变快。

##### 方法 2：涡管强度守恒与连续方程

也可用涡管强度守恒定理和连续方程证明：

$$
\omega_A S_A=\omega_B S_B,
$$

$$
L_A S_A=L_B S_B,
$$

故

$$
\frac{\omega_B}{L_B}
=
\frac{\omega_A}{L_A}.
$$

### 第 125 张图（原页 132）：中国海洋大学 2023 年硕士研究生招生考试试题参考答案（二，原 PDF 复校）

#### 5. 湍流核心区和粘性底层速度分布及其原因

在边界层水平剪切力由粘性应力和 Reynolds 应力共同提供：

$$
\tau_w
=
\mu\frac{d\overline u}{dy}
-\rho\overline{u'v'}.
$$

##### 1. 粘性底层

在粘性底层，Reynolds 应力 $-\rho\overline{u'v'}$ 很小，可忽略不计：

$$
\tau_w
=
\mu\frac{d\overline u}{dy}.
$$

于是

$$
\overline u
=
\frac{\tau_w}{\mu}y.
$$

引入摩擦速度

$$
U^*=\sqrt{\frac{\tau_w}{\rho}},
$$

以及无因次位置

$$
y^+=\frac{U^*}{\nu}y.
$$

则

$$
\overline u
=
\frac{(U^*)^2}{\nu}y,
\qquad
\frac{\overline u}{U^*}=y^+,
\qquad
0<y^+<5.
$$

##### 2. 湍流核心区或对数区

在湍流核心区，Reynolds 应力占主要部分，粘性应力可忽略不计：

$$
\tau_w=-\rho\overline{u'v'}.
$$

由混合长理论，

$$
-\rho\overline{u'v'}
=
\rho l^2
\left(\frac{d\overline u}{dy}\right)^2.
$$

若取 $l=By$，则

$$
\tau_w
=
\rho
\left(By\frac{d\overline u}{dy}\right)^2.
$$

因此

$$
d\overline u
=
\frac1B
\sqrt{\frac{\tau_w}{\rho}}\frac{dy}{y}.
$$

积分得

$$
\overline u
=
\frac1B
\sqrt{\frac{\tau_w}{\rho}}\ln y
+c_1
=
\frac1B U^*\ln y+c_1.
$$

移项无量纲化得

$$
\frac{\overline u}{U^*}
=
\frac1B\ln y^+
+c_1,
\qquad
30<y^+<300.
$$

#### 6. 给定速度场求加速度分布、流线及迹线

已知

$$
u=\frac{t}{1+x},
\qquad
v=\frac{2t}{1+x},
\qquad
w=\frac{3t}{1+x}.
$$

### 第 126 张图（原页 133）：中国海洋大学 2023 年硕士研究生招生考试试题参考答案（三，原 PDF 复校）

加速度分布为

$$
\begin{cases}
a_x
=
\dfrac{\partial u}{\partial t}
+u\dfrac{\partial u}{\partial x}
+v\dfrac{\partial u}{\partial y}
+w\dfrac{\partial u}{\partial z}
=
\dfrac1{1+x}
-\dfrac{t^2}{(1+x)^3},\\[8pt]
a_y
=
\dfrac{\partial v}{\partial t}
+u\dfrac{\partial v}{\partial x}
+v\dfrac{\partial v}{\partial y}
+w\dfrac{\partial v}{\partial z}
=
\dfrac2{1+x}
-\dfrac{2t^2}{(1+x)^3},\\[8pt]
a_z
=
\dfrac{\partial w}{\partial t}
+u\dfrac{\partial w}{\partial x}
+v\dfrac{\partial w}{\partial y}
+w\dfrac{\partial w}{\partial z}
=
\dfrac3{1+x}
-\dfrac{3t^2}{(1+x)^3}.
\end{cases}
$$

流线方程为

$$
\frac{dx}{u}
=
\frac{dy}{v}
=
\frac{dz}{w}.
$$

将速度代入得

$$
x=\frac y2=\frac z3.
$$

即流线方程为

$$
x=\frac y2=\frac z3.
$$

迹线方程由

$$
u=\frac{dx}{dt}=\frac{t}{1+x},
\qquad
v=\frac{dy}{dt}=\frac{2t}{1+x},
\qquad
w=\frac{dz}{dt}=\frac{3t}{1+x}
$$

分别积分可得

$$
\begin{cases}
x^2+2x-t^2=C_1,\\[4pt]
y=\dfrac{t^2}{1+x}+C_2,\\[8pt]
z=\dfrac{3t^2}{2(1+x)}+C_3,
\end{cases}
$$

其中 $C_1,C_2,C_3$ 为任意常数。

#### 7. 注射器出流所需时间

由题意可知，注射器内流体沿 $x$ 方向均匀定常流动。又因为流体理想不可压，则在断面 1 和喷口 2 处建立 Bernoulli 方程：

$$
\frac{V_1^2}{2}
+\frac{p_1}{\rho}
+gz_1
=
\frac{V_2^2}{2}
+\frac{p_2}{\rho}
+gz_2.
$$

取中心轴线

$$
z_1=z_2,\qquad
p_1=p_a+\frac{F}{\sigma_1},\qquad
p_2=p_a.
$$

由连续方程可知

$$
V_1\sigma_1=V_2\sigma_2.
$$

求解可得

$$
V_1
=
\sigma_2
\sqrt{
\frac{2F}
{\sigma_1\rho(\sigma_1^2-\sigma_2^2)}
}.
$$

因此

$$
t
=
\frac l{V_1}
=
\frac l{\sigma_2}
\sqrt{
\frac{\sigma_1\rho(\sigma_1^2-\sigma_2^2)}
{2F}
}.
$$

### 第 127 张图（原页 134）：中国海洋大学 2023 年硕士研究生招生考试试题参考答案（四，原 PDF 复校）

#### 8. 小 Reynolds 数绕流阻力量纲分析

由题意可知

$$
F=f(V_\infty,\rho,\gamma,L).
$$

设

$$
[F]=[V_\infty]^x[\rho]^y[\gamma]^z[L]^k.
$$

各量纲为

$$
[F]=[M][L][T]^{-2},
\qquad
[V_\infty]=[L][T]^{-1},
\qquad
[\rho]=[M][L]^{-3},
\qquad
[\gamma]=[L]^2[T]^{-1},
\qquad
[L]=[L].
$$

由量纲齐次可得

$$
\begin{cases}
1=y,\\
1=x+2z-3y+k,\\
-2=-x-z.
\end{cases}
$$

令 $x=a$，则

$$
y=1,\qquad z=2-a,\qquad k=a.
$$

因此

$$
F
=
C V_\infty^a\rho\,\gamma^{2-a}L^a
=
C\rho\gamma^2
\left(\frac{V_\infty L}{\gamma}\right)^a,
$$

其中 $C$ 为常数。

#### 9. 倾斜平板间粘性流动

控制方程为

$$
\begin{cases}
0=\rho g\sin\alpha-\dfrac{\partial p}{\partial x}
+\mu\dfrac{\partial^2u}{\partial y^2},\\[8pt]
0=-\rho g\cos\alpha-\dfrac{\partial p}{\partial y},\\[8pt]
\dfrac{\partial u}{\partial x}=0.
\end{cases}
$$

边界条件为

$$
u(0)=0,\qquad u(b)=U.
$$

由第二式得

$$
p=-\rho g\cos\alpha\,y+p_1(x).
$$

代入第一式并结合第三式，有

$$
-\rho g\sin\alpha
+\frac{\partial p_1}{\partial x}
=
\mu\frac{\partial^2u}{\partial y^2}
=\text{const}.
$$

设

$$
\frac{\partial p}{\partial x}=-G,
\qquad
\frac{\partial p_1}{\partial x}=-G.
$$

代入得

$$
u
=
-\frac{\rho g\sin\alpha+G}{2\mu}y^2
+Ay+B.
$$

再利用边界条件，得到

$$
u
=
\frac{Uy}{b}
+\frac{\rho g\sin\alpha+G}{2\mu}y(b-y).
$$

按题面第（2）问，补算下板摩擦应力为

$$
\tau_0
=
\mu\left.\frac{du}{dy}\right|_{y=0}
=
\mu\frac Ub
+\frac{\rho g\sin\alpha+G}{2}b.
$$

令 $\tau_0=0$，得

$$
U
=
-\frac{(\rho g\sin\alpha+G)b^2}{2\mu}.
$$

若无额外压强梯度（$G=0$），则

$$
U
=
-\frac{\rho g b^2\sin\alpha}{2\mu}.
$$

#### 10. 旋转容器自由液面与底部压力

由题意可知，流体理想不可压，作定常运动。流体所受体积力为重力、离心力，均保守有势。

设静止状态下液面高度为 $h$，则 $P$ 点为自由液面上的最低点

$$
P(0,0,h'),
$$

$M$ 为液体内任意一点

$$
M(r,\theta,z).
$$

### 第 128 张图（原页 135）：中国海洋大学 2023 年硕士研究生招生考试试题参考答案（五，原 PDF 复校）

由 Bernoulli 方程可知

$$
\frac{V_P^2}{2}
+\frac{p}{\rho}
+gh'
=
\frac{V_M^2}{2}
+\frac{p'}{\rho}
+gz
-\frac12\omega^2r^2.
$$

其中

$$
V_P=0,\qquad p=p_a=0,\qquad V_M=0.
$$

求得 $M$ 点压强为

$$
p'
=
\rho g(h'-z)
+\frac12\rho\omega^2r^2.
$$

令 $p'=0$ 恒成立，即得液面表达式

$$
z=h'
+\frac{\omega^2r^2}{2g}.
$$

由体积不变性可知

$$
\int_0^a 2\pi r z\,dr
=
\pi a^2h,
$$

故

$$
h'
=
h-\frac{\omega^2a^2}{4g}.
$$

容器底部压强为

$$
P_d
=
\rho gh'
+\frac12\rho\omega^2r^2
=
\rho gh
-\frac14\rho\omega^2a^2
-\frac12\rho\omega^2r^2.
$$

于是总压力为

$$
\int_0^a 2\pi rP_d\,dr
=
\pi a^2\rho gh.
$$

### 第 129 张图（原页 136）：中国海洋大学 2024 年硕士研究生招生考试试题参考答案（一）（原 PDF 复校）

科目代码：803。科目名称：流体力学。

#### 一、温度升高，液体粘性系数降低、气体粘性系数升高的原理

（1）温度升高会使分子的热运动增强，分子之间的相互作用力减小，从而使液体分子间的运动变得更容易。同时，分子在液体中的距离变大，使得分子之间的相互作用力也相应减小，导致粘性系数降低。

（2）温度升高会增加气体分子的平均动能，使分子之间的碰撞频率和速率增加，导致气体内部分子的相互作用力增强，从而使气体粘性系数升高。

#### 二、皮托管测速原理

皮托管有内外两层。内管头部对准来流，测得总压；外管在侧壁开口，测得静压。

在内管 1 和外管 2 处建立 Bernoulli 方程：

$$
\frac{v_1^2}{2}
+\frac{p_1}{\rho}
+gy_1
=
\frac{v_2^2}{2}
+\frac{p_2}{\rho}
+gy_2.
$$

其中 $y_1\simeq y_2$，内管口可视为驻点，故由压差得

$$
v_1
=
\sqrt{\frac{2(p_1-p_2)}{\rho}}.
$$

再利用管内高度差 $\Delta h$，

$$
p_1-p_2=\rho_m g\Delta h,
$$

于是

$$
V_\infty
=
\sqrt{\frac{2\rho_m g\Delta h}{\rho}},
$$

即可测得流速。

#### 三、理想流体假设使用条件；计算水中阻力时能不能适用理想流体假设

理想流体假设是一种理论假设，用于描述没有粘性、不可压缩、无摩擦力的流体。但是在实际情况下，几乎所有流体都具有一定粘性和摩擦力。

计算流体力学问题时，需要考虑流体的粘性和摩擦力。在一些特殊情况下，如低速流动、小粘度流体等，理想流体假设可以适用。但是在高速流动、大粘度流体等情况下，理想流体假设不能适用。

#### 四、潜艇模型实验水中阻力相似条件、阻力系数定义及相似准则

需要满足：

几何相似。

来流攻角相同。

满足 Reynolds 相似准则：

$$
Re_1=Re_2,
\qquad
\frac{u_1l_1}{\gamma_1}
=
\frac{u_2l_2}{\gamma_2}.
$$

流动相似中，阻力满足

$$
\frac{F_1}{\rho_1l_1^2V_1^2}
=
\frac{F_2}{\rho_2l_2^2V_2^2}.
$$

无量纲物理量相似，由此可换算真实潜艇受力与模型中的受力。

#### 五、涡量输运方程各项的物理意义

原页涡量输运方程写为

$$
\frac{\partial\boldsymbol\omega}{\partial t}
+(\vec V\cdot\nabla)\boldsymbol\omega
=
(\nabla\times\vec V)\cdot\boldsymbol\omega
+\nu\nabla^2\boldsymbol\omega.
$$

原页说明：$\boldsymbol\omega$ 是涡量，$\vec V$ 是流体速度矢量，$\nabla$ 表示梯度算子，$\times$ 表示向量的叉乘，$\nu$ 是运动粘性系数，$\nabla^2$ 表示 Laplace 算子，$t$ 表示时间。

该方程表达涡量随时间变化的速率以及涡量在流体中输运的过程。

### 第 130 张图（原页 137）：中国海洋大学 2024 年硕士研究生招生考试试题参考答案（二）（原 PDF 复校）

涡量输运方程中，第一项表示时间导数，即涡量随时间变化率；第二项表示对流项，描述流体速度场对涡量的输运效应；第三项表示涡量拉伸或旋转项，表示流体速度场的旋转对涡量的贡献；最后一项表示扩散项，描述粘性对涡量的影响。

#### 六、速度场 $u=x+t,\ v=-y+2t$

##### 1. $t=0$ 时经过 $(1,1)$ 点的流线

流线方程为

$$
\frac{dx}{u}
=
\frac{dy}{v}.
$$

当 $t=0$ 时，

$$
u=x,\qquad v=-y.
$$

故

$$
\frac{dx}{x}
=
\frac{dy}{-y}.
$$

即

$$
0=\ln x+\ln y+C.
$$

当 $t=0$ 且经过 $(1,1)$ 时，

$$
\ln x=\ln y=0,
$$

故 $C=0$。于是流线方程为

$$
\ln x+\ln y=0.
$$

##### 2. 运动矢量方向

当 $t=0$ 且经过 $(1,1)$ 点时，

$$
u=1,\qquad v=-1.
$$

则

$$
\tan\theta=\frac vu=-1,
\qquad
\theta=\arctan(-1)=135^\circ.
$$

因此 $t=0$ 时在 $(1,1)$ 点，运动矢量方向为左上，$\theta=135^\circ$。

#### 七、侧孔出流抛射

在 1、2 处建立 Bernoulli 方程：

$$
\frac{V_1^2}{2}
+\frac{p_1}{\rho}
+gh
=
\frac{V_2^2}{2}
+\frac{p_2}{\rho}
+g(h-y).
$$

其中 1、2 处压强均为大气压，

$$
p_1=p_2=p_0.
$$

并且 $V_1\ll V_2$，可视为

$$
V_1=0.
$$

方程简化为

$$
V_2=\sqrt{2gy}.
$$

水体从小孔中流出后，竖直方向作自由落体运动，水平方向作匀速运动：

$$
h-y=\frac12gt^2,
\qquad
x=V_2t.
$$

联立得

$$
4(h-y)y=x^2.
$$

将 $x=2$ 代入，得

$$
y=2\pm\frac{\sqrt{15}}2.
$$

因此当

$$
y=2\,\mathrm m
$$

时，$x$ 最大。

### 第 131 张图（原页 138）：中国海洋大学 2024 年硕士研究生招生考试试题参考答案（三）（原 PDF 复校）

#### 八、溢流坝流动

##### 1. 求下游速度

在 1、2 处建立 Bernoulli 方程：

$$
\frac{V_1^2}{2}
+\frac{p_1}{\rho}
+gh_1
=
\frac{V_2^2}{2}
+\frac{p_2}{\rho}
+gh_2.
$$

其中 1、2 处均压强为大气压，

$$
p_1=p_2=p_0.
$$

同时由体积守恒

$$
V_1h_1=V_2h_2.
$$

故

$$
V_2
=
\sqrt{\frac{2gh_1^2}{h_1+h_2}}.
$$

##### 2. 求坝受到的水平力

将整个水坝看作控制体，进行受力分析。动量方程为

$$
-F
+\int_0^{h_1}P_1\,dy\,B
-\int_0^{h_2}P_2\,dy\,B
=
\left(\rho V_2^2h_2-\rho V_1^2h_1\right)B.
$$

由静压分布

$$
P_1=\rho g(h_1-y),
\qquad
P_2=\rho g(h_2-y),
$$

代入得

$$
\begin{aligned}
F
&=
\int_0^{h_1}\rho g(h_1-y)B\,dy
-\int_0^{h_2}\rho g(h_2-y)B\,dy
-\left(\rho V_2^2h_2-\rho V_1^2h_1\right)B\\
&=
\frac{\rho g}{2}(h_1^2-h_2^2)B
+\rho V_1^2h_1B
-\rho V_2^2h_2B.
\end{aligned}
$$

联立可得

$$
F
=
\frac{\rho gB(h_1-h_2)^3}{2(h_1+h_2)}.
$$

#### 九、复势题

##### 1. 流动组成

拆分得

$$
W(z)=\ln(z+i)+\ln(z-i)-\ln z.
$$

共有三个流动，在 $z=\pm i$ 处有两个点源，在原点处有点源。

##### 2. 流量

原页将复势写为

$$
W(z)
=
m\ln\left(\frac{z^2+1}{z}\right).
$$

令 $z=x+iy$，可化为

$$
W(z)
=
m\ln
\left(
\frac{x^2+y^2+1}{x+iy}
\right)
=
m\ln
\left(
\frac{(x^2+y^2+1)(x+iy)}{x^2+y^2}
\right).
$$

按原页继续整理为

$$
W(z)
=
m\ln
\left(
\frac{(x^3+xy^2+x)+i(x^2y+y^3+y)}{x^2+y^2}
\right).
$$

因此流函数为

$$
\psi=\operatorname{Im}W(z)
=
m\arctan
\frac{x^2y+y^3+y}{xy^2+y^3+x}.
$$

按页内给出的两点计算：

$$
Q
=
\left|\psi_{\left(\frac12,0\right)}-\psi_{(0,1)}\right|
=
\left|0-\frac{\pi}{2}\right|
=
\frac{\pi}{2}.
$$

### 第 132 张图（原页 139）：中国海洋大学 2024 年硕士研究生招生考试试题参考答案（四）（原 PDF 复校）

#### 十、2015 真题原题：无限大平板突然启动

由题意可得

$$
v=w=0.
$$

又由

$$
\nabla\cdot\vec v=0
$$

知

$$
\frac{\partial u}{\partial x}=0,
$$

因此

$$
u=u(y).
$$

Navier-Stokes 方程中 $x$ 方向的速度分布微分方程为

$$
\frac{\partial u}{\partial t}
=
\gamma\frac{\partial^2u}{\partial y^2}.
$$

定解条件为

$$
\begin{cases}
t=0,\ y>0:\quad u=0,\\
t>0,\ y=0:\quad u=U,\\
y\to\infty:\quad u=0.
\end{cases}
$$

量纲分析中，$u/U$ 为无量纲量，令

$$
\frac uU
=
f(t^\alpha y^\beta\gamma^c).
$$

其中

$$
t^\alpha=[T]^\alpha,
\qquad
y^\beta=[L]^\beta,
\qquad
\gamma^c=[L]^{2c}[T]^{-c}.
$$

量纲齐次给出

$$
\begin{cases}
\alpha-c=0,\\
\beta+2c=0.
\end{cases}
$$

等价地，可写为原页中间式

$$
\frac uU
=
f\left[\left(\frac{t\gamma}{y^2}\right)^c\right].
$$

取

$$
c=-\frac12,
$$

于是

$$
\frac uU
=
f\left(\frac{y}{\sqrt{\gamma t}}\right).
$$

### 第 133 张图（原页 140）：中国海洋大学 2023 年硕士研究生招生考试试题（回忆版题面，原 PDF 复校）

科目代码：803。科目名称：流体力学。本试题为 2023 年考生回忆版。

1. 写出内能方程及各项的物理意义。

2. 为什么潜艇和水面的舰船所受的阻力不同？

3. 解释弧线球（香蕉球）原理。

4. 解释涡旋过山以后为什么旋转会加强？

5. 湍流核心区和粘性底层速度分布及其原因。

6. 已知速度场

$$
u=\frac{t}{1+x},
\qquad
v=\frac{2t}{1+x},
\qquad
w=\frac{3t}{1+x},
$$

求加速度、流线及迹线。

7. 一水平放置的注射器，其活塞截面积为 $\sigma_1$，喷口截面积为 $\sigma_2$。如用力 $F$ 水平推动活塞，使活塞向前移动 $l$ 距离，密度为 $\rho$ 的不可压缩流体从注射器喷口流出，问全程需要多少时间？流体为理想流体。

原图示意：左侧为活塞，外力 $F$ 沿水平方向推动；活塞截面标为 $\sigma_1$，喷口截面标为 $\sigma_2$，活塞位移标为 $l$，喷口处有水平出流箭头。

8. 不可压缩均匀来流绕流某物的定常小雷诺数流动。不计重力，使用量纲分析法求物体所受阻力 $F$ 与来流速度 $V_\infty$、流体密度 $\rho$ 和粘性系数 $\gamma$ 以及物体特征尺度 $L$ 的函数关系。

9. 求解粘性流体沿倾斜平板下泻的流动：

（1）流动速度分布；

（2）上板速度多大时，下板的摩擦应力为 0。

### 第 134 张图（原页 141）：中国海洋大学 2023 年硕士研究生招生考试试题（回忆版题面续，原 PDF 复校）

10. 设有不可压缩的受重力作用的液体，盛于一竖直圆柱形回转容器内，像固体一样以角速度 $\omega$ 绕圆柱轴线旋转，忽略液面上的大气压力，试求旋转液体中每点的压强。又如果圆柱半径为 $a$，试给出液体作用在器底的总压力。

原图配有回转容器示意：竖直轴记为 $z$，底部横向轴过 $O$ 点，左右壁底分别标为 $A,D$，上缘标为 $B,C$，液面为中部较低、靠壁较高的旋转抛物面，左侧标出液高 $h$，液体内部取点 $M$。

### 第 135 张图（原页 46）：中国海洋大学 2024 年硕士研究生招生考试试题（回忆版题面，原 PDF 复校）

科目代码：803。科目名称：流体力学。本试题为 2024 年考生回忆版。

一、温度升高时，液体粘性系数降低、气体粘性系数升高的原理。

二、皮托管测速原理。

三、理想流体假设使用条件，计算在水中的阻力时能不能适用理想流体假设。

四、潜艇模型实验水中的阻力要满足哪些相似条件？阻力系数的定义，取决于哪个相似准则？

五、涡量输运方程各项的物理意义。

六、已知速度场

$$
u=x+t,\qquad v=-y+2t.
$$

（1）$t=0$ 时经过 $(1,1)$ 点的流线；

（2）$t=0$ 时 $(1,1)$ 点处的加速度矢量。

七、已知 $h=4\,\mathrm m$。

原图示意为水箱侧壁水平射流：总水深标为 $h$，小孔距自由液面的深度标为 $y$，射流出口速度标为 $V_1$，射流下落到地面的水平距离标为 $x$，小孔至地面的竖向落差为 $h-y$。

（1）$x=2\,\mathrm m$，求 $y$；

（2）$y$ 为多少时，$x$ 最大。

八、河水流过溢流坝，坝宽为 $B$，上游深 $h_1$，下游深 $h_2$。

原图示意为上游来流速度 $V_1$、下游速度 $V_2$，坝体受水平力 $F$；上游水深标 $h_1$，下游水深标 $h_2$。

（1）求下游速度 $V_2$；

（2）求坝受到的水平力 $F$。

九、已知复势为

$$
W(z)=\ln\left(z+\frac{1}{z}\right).
$$

（1）分析流动由哪些基本势流组成；

（2）求 $z=\frac{i}{2}$ 到 $z=1$ 的流量。

### 第 136 张图（原页 47）：中国海洋大学 2024 年硕士研究生招生考试试题（回忆版题面续，原 PDF 复校）

十、2015 真题原题：

一无限大平板浸没在无界的静止流体中，流体不可压缩，运动学粘性系数为 $\gamma$。突然启动平板，使其沿自身所在平面以速度 $U$ 匀速直线运动，以 $u$ 代表经过时间 $t$ 距离平板 $y$ 处的流速。

（1）写出求解该流动速度分布的微分方程和定解条件；

（2）试利用量纲分析方法给出无因次速度 $u/U$ 与 $t$、$y$ 和 $\gamma$ 的可能函数关系。

### 第 137 张图：2022 与 2023 年回忆版摘录（原图复校）

#### 中国海洋大学 2022 年硕士研究生招生考试试题（回忆版）

科目代码：803。科目名称：流体力学。

第一道题：描述流体运动方法，即欧拉坐标与拉格朗日坐标。

第二道题：拉格朗日方程。页上可辨认出非定常 Bernoulli / Lagrange 积分式的骨架：

$$
\int_1^2\frac{\partial V}{\partial t}\,dl
+
\frac{V_2^2}{2}
+
\frac{p_2}{\rho}
+
gz_2
=
\frac{V_1^2}{2}
+
\frac{p_1}{\rho}
+
gz_1.
$$

第三道题：积分形式动量方程。页边手写注明“回忆是一个三叉渠”，因此应按控制体题处理。可先写通式：

$$
\sum \vec F
=
\frac{\partial}{\partial t}\int_{CV}\rho\vec V\,d\tau
+
\int_{CS}\rho\vec V(\vec V\cdot d\vec S).
$$

原页手写还把积分动量方程展开到控制体与控制面的形式；右端后半部分被页边截断，能辨认出的部分为

$$
\frac{\partial}{\partial t}\int_{CV}\rho\vec V\,d\tau
+
\int_{CS}\rho\vec V(\vec V\cdot d\vec S)
=
\int_{CV}\rho\vec F\,d\tau+\cdots .
$$

第四道题：复势。页内手写有

$$
W=\phi+i\psi.
$$

第五道题：无量纲数 Euler 数，并且是一道粘性流体的题。页上可辨认出

$$
Eu=\frac{p}{\rho V^2}.
$$

页边手写按特征量记为

$$
Eu=\frac{p_0}{\rho u_0^2}.
$$

#### 中国海洋大学 2023 年硕士研究生招生考试试题（回忆版）

科目代码：803。科目名称：流体力学。

第一小题：内能方程及各项意义。

第二小题：为什么潜艇和水面的舰船所受的阻力不同？

第三小题：香蕉球原理。

第四小题：涡旋过山以后为什么旋转会加强？

第五小题：湍流核心区和粘性底层速度分布及其原因。

第六题：欧拉和拉格朗日观点经典题型。页内给出的速度场整理为

$$
u=\frac{t}{1+x},
\qquad
v=\frac{2t}{1+x},
\qquad
w=\frac{3t}{1+x}.
$$

题目要求求 Euler 场下的速度分布、Lagrange 观点下的加速度分布，并求流线和迹线。

第七题：注射器问题。用 $f$ 推针管，活塞面积为 $S_1$，针头面积为 $S_2$，求推动距离 $l$ 所用时间。

第八题：量纲分析。原理较简单，求压强 $p$ 与旋转角速度、密度、速度、长度等量之间的关系；原题给出一个公式，要求验证，只需把两边量纲列出对比。

第九题：经典粘性边界层倾斜 $\alpha$ 角度问题。

第十题：浴盆涡。已知一个顺时针旋转的涡，浴盆周围速度近似为零，求浴盆内自由表面方程和涡强度的关系。

页底手写保留 Bernoulli 常数式：

$$
\frac{p_0}{\rho}+\frac{v^2}{2}+gh=C.
$$
