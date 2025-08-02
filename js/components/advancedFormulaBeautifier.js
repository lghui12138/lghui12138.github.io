/**
 * 高级公式美化器
 * 将所有公式转换为真正的HTML美观格式
 */
class AdvancedFormulaBeautifier {
    constructor() {
        this.initMathJax();
        this.formulaDatabase = this.createFormulaDatabase();
        this.categoryColors = {
            'static': { bg: 'linear-gradient(135deg, #e8f5e8, #d4edda)', border: '#27ae60', title: '#27ae60' },
            'dynamics': { bg: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', border: '#2196f3', title: '#1976d2' },
            'viscous': { bg: 'linear-gradient(135deg, #ffebee, #ffcdd2)', border: '#f44336', title: '#d32f2f' },
            'turbulent': { bg: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', border: '#9c27b0', title: '#7b1fa2' },
            'properties': { bg: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', border: '#ff9800', title: '#e65100' },
            'vorticity': { bg: 'linear-gradient(135deg, #e0f2f1, #b2dfdb)', border: '#009688', title: '#00695c' },
            'default': { bg: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)', border: '#757575', title: '#424242' }
        };
    }

    /**
     * 创建完整的公式数据库
     */
    createFormulaDatabase() {
        return {
            // 涡量相关公式
            'vorticity-basic': {
                title: '涡量定义',
                formula: '$$\\vec{\\omega} = \\nabla \\times \\vec{v}$$',
                explanation: '表示流体微团的转动强度',
                derivation: [
                    '涡量定义：$\\vec{\\omega} = \\nabla \\times \\vec{v}$',
                    '其中 $\\vec{v}$ 为速度场',
                    '$\\nabla \\times$ 为旋度算子',
                    '表示流体微团的转动强度'
                ],
                physics: '$\\vec{\\omega}$ 方向沿转动轴，大小等于角速度的两倍。当 $\\vec{\\omega} = 0$ 时为无旋流动。',
                category: 'vorticity'
            },
            'vorticity-equation': {
                title: '涡量方程',
                formula: '$$\\frac{D\\vec{\\omega}}{Dt} = (\\vec{\\omega} \\cdot \\nabla)\\vec{v} + \\nu\\nabla^2\\vec{\\omega}$$',
                explanation: '涡量的输运方程包含拉伸和扩散项',
                derivation: [
                    '对N-S方程取旋度得到涡量方程',
                    '$\\frac{D\\vec{\\omega}}{Dt} = (\\vec{\\omega} \\cdot \\nabla)\\vec{v} + \\nu\\nabla^2\\vec{\\omega}$',
                    '其中 $(\\vec{\\omega} \\cdot \\nabla)\\vec{v}$ 为拉伸项',
                    '$\\nu\\nabla^2\\vec{\\omega}$ 为扩散项'
                ],
                physics: '涡量的输运方程包含拉伸和扩散项，描述了涡量在流体中的演化规律。',
                category: 'vorticity'
            },
            'kelvin-theorem': {
                title: 'Kelvin定理粘性修正',
                formula: '$$\\frac{D\\Gamma}{Dt} = \\nu \\oint (\\nabla^2\\vec{v}) \\cdot d\\vec{l}$$',
                explanation: '考虑粘性效应的环量变化率',
                derivation: [
                    '考虑粘性效应环量变化率',
                    '$\\frac{D\\Gamma}{Dt} = \\nu \\oint (\\nabla^2\\vec{v}) \\cdot d\\vec{l}$',
                    '其中 $\\Gamma = \\oint \\vec{v} \\cdot d\\vec{l}$ 为环量',
                    '$\\nu$ 为运动粘性系数'
                ],
                physics: '粘性对环量的影响。在理想流体中环量守恒，但在粘性流体中环量会发生变化。',
                category: 'vorticity'
            },

            // 流体静力学公式
            'static-basic': {
                title: '流体静力学基本方程',
                formula: '$$\\nabla p = \\rho \\vec{g}$$',
                explanation: '压强梯度等于流体密度与重力加速度的乘积',
                derivation: [
                    '考虑流体微元在重力场中的平衡',
                    '微元受力：重力 $F_g = \\rho \\vec{g} dV$',
                    '表面力：$F_s = -\\nabla p dV$',
                    '平衡条件：$F_g + F_s = 0$',
                    '即：$\\rho \\vec{g} - \\nabla p = 0$',
                    '$\\therefore \\nabla p = \\rho \\vec{g}$'
                ],
                physics: '压强梯度等于流体密度与重力加速度的乘积，这是流体静力学的基本微分方程。',
                category: 'static'
            },
            'static-pressure': {
                title: '静水压强分布',
                formula: '$$p = p_0 + \\rho g h$$',
                explanation: '对于不可压缩流体，压强随深度线性增加',
                derivation: [
                    '对微分方程 $\\frac{dp}{dz} = -\\rho g$ 积分',
                    '$\\int dp = -\\rho g \\int dz$',
                    '$p - p_0 = -\\rho g(z - z_0)$',
                    '令 $h = z_0 - z$ (深度)',
                    '$\\therefore p = p_0 + \\rho g h$'
                ],
                physics: '对于不可压缩流体，压强随深度线性增加，斜率为 $\\rho g$。',
                category: 'static'
            },
            'archimedes': {
                title: '阿基米德浮力',
                formula: '$$F_b = \\rho g V$$',
                explanation: '浮力大小等于排开流体的重量',
                derivation: [
                    '浸入流体的物体受到浮力',
                    '$F_b = \\int \\int p \\cdot \\vec{n} dA$',
                    '静水压强：$p = p_0 + \\rho g h$',
                    '$\\therefore F_b = \\rho g \\int \\int h dA = \\rho g V$',
                    '其中 $V$ 为排开流体的体积'
                ],
                physics: '浮力大小等于排开流体的重量，这是阿基米德原理的数学表述。',
                category: 'static'
            },

            // 流体动力学公式
            'continuity': {
                title: '连续性方程',
                formula: '$$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\vec{v}) = 0$$',
                explanation: '基于质量守恒定律',
                derivation: [
                    '基于质量守恒定律',
                    '控制体内质量变化率 = 质量通量',
                    '$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\vec{v}) = 0$',
                    '对于不可压缩流体：',
                    '$\\nabla \\cdot \\vec{v} = 0$ (速度散度为零)'
                ],
                physics: '流体微团体积在运动过程中保持不变。',
                category: 'dynamics'
            },
            'bernoulli': {
                title: '伯努利方程',
                formula: '$$\\frac{p}{\\rho g} + \\frac{v^2}{2g} + z = H$$',
                explanation: '沿流线机械能守恒',
                derivation: [
                    '沿流线积分欧拉方程',
                    '$\\int[\\frac{\\partial \\vec{v}}{\\partial t} + (\\vec{v} \\cdot \\nabla)\\vec{v}] \\cdot ds = \\int[-\\frac{1}{\\rho}\\nabla p + \\vec{g}] \\cdot ds$',
                    '定常流动：$\\frac{\\partial \\vec{v}}{\\partial t} = 0$',
                    '$\\therefore \\int(\\vec{v} \\cdot \\nabla)\\vec{v} \\cdot ds = \\int[-\\frac{1}{\\rho}\\nabla p + \\vec{g}] \\cdot ds$',
                    '积分得到：$\\frac{v^2}{2} + \\frac{p}{\\rho} + gz = 常数$'
                ],
                physics: '沿流线机械能守恒，总水头保持不变。',
                category: 'dynamics'
            },
            'momentum': {
                title: '动量方程',
                formula: '$$\\vec{F} = \\int\\int \\rho\\vec{v}(\\vec{v} \\cdot \\vec{n})\\,dA + \\int\\int p\\vec{n}\\,dA$$',
                explanation: '控制体受力等于动量通量与压力之和',
                derivation: [
                    '基于牛顿第二定律',
                    '控制体内动量变化率 = 动量通量 + 表面力',
                    '$\\frac{\\partial(\\rho\\vec{v})}{\\partial t} + \\nabla \\cdot (\\rho\\vec{v}\\vec{v}) = -\\nabla p + \\rho\\vec{g}$',
                    '积分得到：',
                    '$\\vec{F} = \\int\\int \\rho\\vec{v}(\\vec{v} \\cdot \\vec{n})\\,dA + \\int\\int p\\vec{n}\\,dA$'
                ],
                physics: '控制体受力等于动量通量与压力之和。',
                category: 'dynamics'
            },

            // 粘性流动公式
            'navier-stokes': {
                title: 'N-S方程',
                formula: '$$\\rho(\\frac{\\partial \\vec{v}}{\\partial t} + \\vec{v} \\cdot \\nabla\\vec{v}) = -\\nabla p + \\mu\\nabla^2\\vec{v} + \\rho\\vec{g}$$',
                explanation: '粘性流体的运动方程',
                derivation: [
                    '基于动量守恒定律',
                    '考虑粘性应力：$\\tau = \\mu\\nabla^2\\vec{v}$',
                    '$\\rho(\\frac{\\partial \\vec{v}}{\\partial t} + \\vec{v} \\cdot \\nabla\\vec{v}) = -\\nabla p + \\mu\\nabla^2\\vec{v} + \\rho\\vec{g}$'
                ],
                physics: '粘性流体的运动方程，包含惯性力、压力梯度、粘性力和重力。',
                category: 'viscous'
            },
            'reynolds': {
                title: '雷诺数',
                formula: '$$Re = \\frac{\\rho v L}{\\mu} = \\frac{v L}{\\nu}$$',
                explanation: '判断流动状态的重要参数',
                derivation: [
                    '雷诺数定义：',
                    '$Re = \\frac{惯性力}{粘性力}$',
                    '$= \\frac{\\rho v^2 L^2}{\\mu v L}$',
                    '$= \\frac{\\rho v L}{\\mu} = \\frac{v L}{\\nu}$'
                ],
                physics: '判断流动状态的重要参数，$Re < 2300$ 为层流，$Re > 4000$ 为湍流。',
                category: 'viscous'
            },
            'newton-viscosity': {
                title: 'Newton粘性定律',
                formula: '$$\\tau = \\mu \\frac{\\partial u}{\\partial y}$$',
                explanation: '表征流体抵抗剪切变形的能力',
                derivation: [
                    '基于分子动量传输理论',
                    '切应力与速度梯度成正比：',
                    '$\\tau = \\mu \\frac{\\partial u}{\\partial y}$',
                    '其中 $\\mu$ 为动力粘性系数'
                ],
                physics: '表征流体抵抗剪切变形的能力，是牛顿流体的本构关系。',
                category: 'viscous'
            },

            // 湍流公式
            'rans-equation': {
                title: 'RANS方程',
                formula: '$$\\frac{\\partial \\bar{u}_i}{\\partial t} + \\bar{u}_j\\frac{\\partial \\bar{u}_i}{\\partial x_j} = -\\frac{1}{\\rho}\\frac{\\partial \\bar{p}}{\\partial x_i} + \\nu\\nabla^2\\bar{u}_i + \\frac{1}{\\rho}\\frac{\\partial \\tau_{ij}}{\\partial x_j}$$',
                explanation: '湍流时均运动方程',
                derivation: [
                    '对N-S方程进行雷诺平均',
                    '得到RANS方程：',
                    '$\\frac{\\partial \\bar{u}_i}{\\partial t} + \\bar{u}_j\\frac{\\partial \\bar{u}_i}{\\partial x_j} = -\\frac{1}{\\rho}\\frac{\\partial \\bar{p}}{\\partial x_i} + \\nu\\nabla^2\\bar{u}_i + \\frac{1}{\\rho}\\frac{\\partial \\tau_{ij}}{\\partial x_j}$'
                ],
                physics: '湍流时均运动方程，包含雷诺应力项。',
                category: 'turbulent'
            },
            'reynolds-stress': {
                title: '雷诺应力',
                formula: '$$\\tau_{ij} = -\\rho\\overline{u'_i u'_j}$$',
                explanation: '表示湍流动量传输',
                derivation: [
                    '雷诺应力定义：',
                    '$\\tau_{ij} = -\\rho\\overline{u'_i u'_j}$',
                    '表示湍流动量传输',
                    '是湍流闭合问题的核心'
                ],
                physics: '湍流脉动产生的附加应力，是湍流闭合问题的核心。',
                category: 'turbulent'
            },

            // 流体性质公式
            'density': {
                title: '密度定义',
                formula: '$$\\rho = \\frac{m}{V} = \\frac{N \\cdot \\bar{m}}{V}$$',
                explanation: '密度是流体的基本物理性质',
                derivation: [
                    '分子数密度：$n = \\frac{N}{V}$',
                    '分子质量：$\\bar{m}$',
                    '总质量：$m = N \\cdot \\bar{m}$',
                    '$\\therefore \\rho = \\frac{m}{V} = \\frac{N \\cdot \\bar{m}}{V}$'
                ],
                physics: '密度是流体的基本物理性质，决定了流体的惯性特性。',
                category: 'properties'
            },
            'kinematic-viscosity': {
                title: '运动粘性系数',
                formula: '$$\\nu = \\frac{\\mu}{\\rho}$$',
                explanation: '具有速度平方的量纲',
                derivation: [
                    '$\\nu = \\frac{\\mu}{\\rho}$',
                    '具有速度平方的量纲'
                ],
                physics: '$\\nu$ 表征动量扩散系数，在雷诺数 $Re = \\frac{vL}{\\nu}$ 中起关键作用。',
                category: 'properties'
            }
        };
    }

    /**
     * 初始化MathJax
     */
    initMathJax() {
        if (window.MathJax) {
            this.configureMathJax();
        } else {
            this.loadMathJax();
        }
    }

    /**
     * 加载MathJax
     */
    loadMathJax() {
        const mathJaxScript = document.createElement('script');
        mathJaxScript.id = 'MathJax-script';
        mathJaxScript.async = true;
        mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        
        mathJaxScript.onload = () => {
            this.configureMathJax();
        };

        document.head.appendChild(mathJaxScript);
    }

    /**
     * 配置MathJax
     */
    configureMathJax() {
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                processEscapes: true,
                processEnvironments: true
            },
            options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
            }
        };
    }

    /**
     * 创建美观的公式HTML
     */
    createBeautifulFormulaHTML(formulaKey) {
        const formulaData = this.formulaDatabase[formulaKey];
        if (!formulaData) {
            console.warn(`公式 ${formulaKey} 不存在`);
            return '';
        }

        const colors = this.categoryColors[formulaData.category] || this.categoryColors.default;

        return `
            <div class="advanced-formula-container" style="border-color: ${colors.border}; background: ${colors.bg}">
                <div class="formula-header">
                    <div class="formula-title" style="color: ${colors.title}">${formulaData.title}</div>
                    <div class="formula-category">${this.getCategoryName(formulaData.category)}</div>
                </div>
                
                <div class="formula-display">
                    <div class="formula-main">${formulaData.formula}</div>
                    <div class="formula-explanation">${formulaData.explanation}</div>
                </div>

                ${formulaData.derivation ? `
                    <div class="formula-derivation">
                        <div class="derivation-title">推导过程：</div>
                        <div class="derivation-steps">
                            ${formulaData.derivation.map(step => `
                                <div class="derivation-step">${step}</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${formulaData.physics ? `
                    <div class="formula-physics">
                        <div class="physics-title">物理意义：</div>
                        <div class="physics-meaning">${formulaData.physics}</div>
                    </div>
                ` : ''}

                <div class="formula-footer">
                    <div class="formula-tags">
                        <span class="tag">${formulaData.category}</span>
                        <span class="tag">流体力学</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 获取分类名称
     */
    getCategoryName(category) {
        const names = {
            'static': '流体静力学',
            'dynamics': '流体动力学',
            'viscous': '粘性流动',
            'turbulent': '湍流',
            'properties': '流体性质',
            'vorticity': '涡量理论',
            'default': '基础理论'
        };
        return names[category] || '基础理论';
    }

    /**
     * 美化页面中的所有公式
     */
    beautifyAllFormulas() {
        // 查找所有可能包含公式的元素
        const elements = document.querySelectorAll('p, div, span, li, td, th');
        
        elements.forEach(element => {
            if (element.textContent && !element.classList.contains('formula-beautified')) {
                this.beautifyElement(element);
            }
        });

        // 添加所有预定义的公式
        this.addAllPredefinedFormulas();

        // 重新渲染数学公式
        this.typeset();
    }

    /**
     * 美化单个元素中的公式
     */
    beautifyElement(element) {
        let content = element.innerHTML;
        let hasChanges = false;

        // 检查是否包含预定义的公式模式
        Object.keys(this.formulaDatabase).forEach(key => {
            const formulaData = this.formulaDatabase[key];
            const patterns = this.createPatternsForFormula(formulaData);
            
            patterns.forEach(pattern => {
                if (pattern.test(content)) {
                    const beautifulHTML = this.createBeautifulFormulaHTML(key);
                    content = content.replace(pattern, beautifulHTML);
                    hasChanges = true;
                }
            });
        });

        // 如果有变化，更新元素内容
        if (hasChanges) {
            element.innerHTML = content;
            element.classList.add('formula-beautified');
        }
    }

    /**
     * 为公式创建匹配模式
     */
    createPatternsForFormula(formulaData) {
        const patterns = [];
        
        // 创建基于公式标题的模式
        if (formulaData.title) {
            patterns.push(new RegExp(formulaData.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'));
        }
        
        // 创建基于公式内容的模式
        const formulaText = formulaData.formula.replace(/\\[\\$]/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        patterns.push(new RegExp(formulaText, 'gi'));
        
        return patterns;
    }

    /**
     * 添加所有预定义的公式
     */
    addAllPredefinedFormulas() {
        const container = document.querySelector('.formulas-section') || document.body;
        
        if (!container.querySelector('.advanced-formula-container')) {
            const formulasHTML = Object.keys(this.formulaDatabase)
                .map(key => this.createBeautifulFormulaHTML(key))
                .join('');
            
            const formulasWrapper = document.createElement('div');
            formulasWrapper.className = 'all-formulas-wrapper';
            formulasWrapper.innerHTML = formulasHTML;
            
            container.appendChild(formulasWrapper);
        }
    }

    /**
     * 重新渲染数学公式
     */
    typeset() {
        if (window.MathJax && window.MathJax.typeset) {
            try {
                MathJax.typeset();
            } catch (error) {
                console.warn('MathJax typeset 失败:', error);
            }
        }
    }

    /**
     * 注入高级样式
     */
    injectAdvancedStyles() {
        if (document.getElementById('advanced-formula-beautifier-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'advanced-formula-beautifier-styles';
        style.textContent = `
            .advanced-formula-container {
                border: 3px solid #27ae60;
                border-radius: 20px;
                padding: 30px;
                margin: 25px 0;
                text-align: center;
                box-shadow: 0 8px 25px rgba(39, 174, 96, 0.2);
                position: relative;
                overflow: hidden;
                animation: fadeInUp 0.6s ease-out;
                transition: all 0.3s ease;
            }

            .advanced-formula-container:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 35px rgba(39, 174, 96, 0.3);
            }

            .advanced-formula-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #27ae60, #2ecc71, #27ae60);
            }

            .formula-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .formula-title {
                font-weight: bold;
                font-size: 1.4em;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            }

            .formula-category {
                background: rgba(255, 255, 255, 0.2);
                padding: 5px 15px;
                border-radius: 15px;
                font-size: 0.9em;
                font-weight: bold;
            }

            .formula-display {
                background: white;
                border-radius: 15px;
                padding: 25px;
                margin: 20px 0;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                border: 2px solid #e9ecef;
            }

            .formula-main {
                font-size: 1.8em;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 15px;
                font-family: 'Times New Roman', serif;
                text-align: center;
            }

            .formula-explanation {
                color: #555;
                font-style: italic;
                text-align: center;
                margin-bottom: 20px;
                font-size: 1.1em;
            }

            .formula-derivation {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                margin: 15px 0;
                border-left: 4px solid #27ae60;
            }

            .derivation-title {
                color: #27ae60;
                font-weight: bold;
                margin-bottom: 15px;
                font-size: 1.2em;
            }

            .derivation-steps {
                color: #666;
                line-height: 1.8;
                text-align: left;
            }

            .derivation-step {
                margin: 10px 0;
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
            }

            .derivation-step:last-child {
                border-bottom: none;
            }

            .formula-physics {
                background: #fff3cd;
                border-radius: 10px;
                padding: 20px;
                margin: 15px 0;
                border-left: 4px solid #ffc107;
            }

            .physics-title {
                color: #856404;
                font-weight: bold;
                margin-bottom: 15px;
                font-size: 1.2em;
            }

            .physics-meaning {
                color: #856404;
                line-height: 1.6;
            }

            .formula-footer {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
            }

            .formula-tags {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .tag {
                background: rgba(255, 255, 255, 0.3);
                padding: 5px 12px;
                border-radius: 12px;
                font-size: 0.8em;
                font-weight: bold;
                color: #555;
            }

            .all-formulas-wrapper {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 30px;
                margin: 30px 0;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .MathJax {
                font-size: 1.1em !important;
            }

            .formula-display .MathJax {
                font-size: 1.4em !important;
            }

            @media (max-width: 768px) {
                .formula-main {
                    font-size: 1.4em;
                }
                
                .advanced-formula-container {
                    padding: 20px;
                }
                
                .all-formulas-wrapper {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 初始化组件
     */
    init() {
        this.injectAdvancedStyles();
        console.log('高级公式美化器初始化完成');
        
        // 页面加载完成后自动美化公式
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.beautifyAllFormulas(), 1000);
            });
        } else {
            setTimeout(() => this.beautifyAllFormulas(), 1000);
        }
    }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedFormulaBeautifier;
} else {
    window.AdvancedFormulaBeautifier = AdvancedFormulaBeautifier;
} 