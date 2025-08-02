/**
 * 公式美化组件
 * 自动检测和美化页面中的所有数学公式
 */
class FormulaBeautifier {
    constructor() {
        this.initMathJax();
        this.formulaPatterns = [
            // 涡量相关公式
            { pattern: /ω□\s*=\s*∇\s*×\s*v□/g, replacement: '$$\\vec{\\omega} = \\nabla \\times \\vec{v}$$' },
            { pattern: /Dω□\/Dt\s*=\s*\(ω□\s*·\s*∇\)v□\s*\+\s*v∇²ω□/g, replacement: '$$\\frac{D\\vec{\\omega}}{Dt} = (\\vec{\\omega} \\cdot \\nabla)\\vec{v} + \\nu\\nabla^2\\vec{\\omega}$$' },
            { pattern: /DΓ\/Dt\s*=\s*v\s*§\s*\(∇²v□\)\s*·\s*dl□/g, replacement: '$$\\frac{D\\Gamma}{Dt} = \\nu \\oint (\\nabla^2\\vec{v}) \\cdot d\\vec{l}$$' },
            
            // 流体静力学公式
            { pattern: /∇p\s*=\s*ρg⃗/g, replacement: '$$\\nabla p = \\rho \\vec{g}$$' },
            { pattern: /p\s*=\s*p₀\s*\+\s*ρgh/g, replacement: '$$p = p_0 + \\rho g h$$' },
            { pattern: /Fᵦ\s*=\s*ρgV/g, replacement: '$$F_b = \\rho g V$$' },
            
            // 流体动力学公式
            { pattern: /∂ρ\/∂t\s*\+\s*∇·\(ρv⃗\)\s*=\s*0/g, replacement: '$$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\vec{v}) = 0$$' },
            { pattern: /p\/\(ρg\)\s*\+\s*v²\/\(2g\)\s*\+\s*z\s*=\s*H/g, replacement: '$$\\frac{p}{\\rho g} + \\frac{v^2}{2g} + z = H$$' },
            
            // 粘性流动公式
            { pattern: /τ\s*=\s*μ\(∂u\/∂y\)/g, replacement: '$$\\tau = \\mu(\\frac{\\partial u}{\\partial y})$$' },
            { pattern: /Re\s*=\s*ρvL\/μ\s*=\s*vL\/ν/g, replacement: '$$Re = \\frac{\\rho v L}{\\mu} = \\frac{v L}{\\nu}$$' },
            
            // 湍流公式
            { pattern: /∂ūᵢ\/∂t\s*\+\s*ūⱼ∂ūᵢ\/∂xⱼ\s*=\s*-1\/ρ\s*∂p̄\/∂xᵢ\s*\+\s*ν∇²ūᵢ\s*\+\s*1\/ρ\s*∂τᵢⱼ\/∂xⱼ/g, replacement: '$$\\frac{\\partial \\bar{u}_i}{\\partial t} + \\bar{u}_j\\frac{\\partial \\bar{u}_i}{\\partial x_j} = -\\frac{1}{\\rho}\\frac{\\partial \\bar{p}}{\\partial x_i} + \\nu\\nabla^2\\bar{u}_i + \\frac{1}{\\rho}\\frac{\\partial \\tau_{ij}}{\\partial x_j}$$' },
            
            // 通用数学符号
            { pattern: /∇/g, replacement: '$\\nabla$' },
            { pattern: /∂/g, replacement: '$\\partial$' },
            { pattern: /∫/g, replacement: '$\\int$' },
            { pattern: /ρ/g, replacement: '$\\rho$' },
            { pattern: /μ/g, replacement: '$\\mu$' },
            { pattern: /ν/g, replacement: '$\\nu$' },
            { pattern: /τ/g, replacement: '$\\tau$' },
            { pattern: /ω/g, replacement: '$\\omega$' },
            { pattern: /Γ/g, replacement: '$\\Gamma$' },
            { pattern: /v⃗/g, replacement: '$\\vec{v}$' },
            { pattern: /ω⃗/g, replacement: '$\\vec{\\omega}$' },
            { pattern: /g⃗/g, replacement: '$\\vec{g}$' },
            { pattern: /n⃗/g, replacement: '$\\vec{n}$' },
            { pattern: /dl⃗/g, replacement: '$d\\vec{l}$' },
            { pattern: /dV/g, replacement: '$dV$' },
            { pattern: /dA/g, replacement: '$dA$' },
            { pattern: /dp/g, replacement: '$dp$' },
            { pattern: /dz/g, replacement: '$dz$' },
            { pattern: /dx/g, replacement: '$dx$' },
            { pattern: /dy/g, replacement: '$dy$' },
            { pattern: /dt/g, replacement: '$dt$' },
            { pattern: /dxᵢ/g, replacement: '$dx_i$' },
            { pattern: /∂xᵢ/g, replacement: '$\\partial x_i$' },
            { pattern: /∂xⱼ/g, replacement: '$\\partial x_j$' },
            { pattern: /ūᵢ/g, replacement: '$\\bar{u}_i$' },
            { pattern: /ūⱼ/g, replacement: '$\\bar{u}_j$' },
            { pattern: /p̄/g, replacement: '$\\bar{p}$' },
            { pattern: /τᵢⱼ/g, replacement: '$\\tau_{ij}$' },
            { pattern: /u'ᵢ/g, replacement: "$u'_i$" },
            { pattern: /u'ⱼ/g, replacement: "$u'_j$" },
            { pattern: /ū'ᵢ/g, replacement: "$\\bar{u}'_i$" },
            { pattern: /ū'ⱼ/g, replacement: "$\\bar{u}'_j$" },
            { pattern: /Fₚ/g, replacement: '$F_p$' },
            { pattern: /Fᵦ/g, replacement: '$F_b$' },
            { pattern: /Fₓ/g, replacement: '$F_x$' },
            { pattern: /Fᵧ/g, replacement: '$F_y$' },
            { pattern: /pᶜ/g, replacement: '$p_c$' },
            { pattern: /yᶜ/g, replacement: '$y_c$' },
            { pattern: /xᶜ/g, replacement: '$x_c$' },
            { pattern: /Iₓ/g, replacement: '$I_x$' },
            { pattern: /yᴀ/g, replacement: '$y_a$' },
            { pattern: /p₀/g, replacement: '$p_0$' },
            { pattern: /z₀/g, replacement: '$z_0$' },
            { pattern: /pₐbs/g, replacement: '$p_{abs}$' },
            { pattern: /pₐₜₘ/g, replacement: '$p_{atm}$' },
            { pattern: /pᵣₑₗ/g, replacement: '$p_{rel}$' },
            { pattern: /pᵥₐc/g, replacement: '$p_{vac}$' },
            { pattern: /pᵢ/g, replacement: '$p_i$' },
            { pattern: /Aᵢ/g, replacement: '$A_i$' },
            { pattern: /Fᵢ/g, replacement: '$F_i$' },
            { pattern: /hᵢ/g, replacement: '$h_i$' },
            { pattern: /xᵢ/g, replacement: '$x_i$' },
            { pattern: /yᵢ/g, replacement: '$y_i$' },
            { pattern: /v̄/g, replacement: '$\\bar{v}$' },
            { pattern: /ū/g, replacement: '$\\bar{u}$' },
            { pattern: /λ/g, replacement: '$\\lambda$' },
            { pattern: /κ/g, replacement: '$\\kappa$' },
            { pattern: /ε/g, replacement: '$\\epsilon$' },
            { pattern: /θ/g, replacement: '$\\theta$' },
            { pattern: /φ/g, replacement: '$\\phi$' },
            { pattern: /ψ/g, replacement: '$\\psi$' },
            { pattern: /α/g, replacement: '$\\alpha$' },
            { pattern: /β/g, replacement: '$\\beta$' },
            { pattern: /γ/g, replacement: '$\\gamma$' },
            { pattern: /δ/g, replacement: '$\\delta$' },
            { pattern: /η/g, replacement: '$\\eta$' },
            { pattern: /ξ/g, replacement: '$\\xi$' },
            { pattern: /ζ/g, replacement: '$\\zeta$' },
            { pattern: /χ/g, replacement: '$\\chi$' },
            { pattern: /υ/g, replacement: '$\\upsilon$' },
            { pattern: /ι/g, replacement: '$\\iota$' },
            { pattern: /ο/g, replacement: '$\\omicron$' },
            { pattern: /π/g, replacement: '$\\pi$' },
            { pattern: /σ/g, replacement: '$\\sigma$' },
            { pattern: /ς/g, replacement: '$\\varsigma$' },
            { pattern: /τ/g, replacement: '$\\tau$' },
            { pattern: /υ/g, replacement: '$\\upsilon$' },
            { pattern: /φ/g, replacement: '$\\phi$' },
            { pattern: /χ/g, replacement: '$\\chi$' },
            { pattern: /ψ/g, replacement: '$\\psi$' },
            { pattern: /ω/g, replacement: '$\\omega$' },
            { pattern: /∴/g, replacement: '$\\therefore$' },
            { pattern: /∵/g, replacement: '$\\because$' },
            { pattern: /∞/g, replacement: '$\\infty$' },
            { pattern: /±/g, replacement: '$\\pm$' },
            { pattern: /∓/g, replacement: '$\\mp$' },
            { pattern: /≤/g, replacement: '$\\leq$' },
            { pattern: /≥/g, replacement: '$\\geq$' },
            { pattern: /≠/g, replacement: '$\\neq$' },
            { pattern: /≈/g, replacement: '$\\approx$' },
            { pattern: /≡/g, replacement: '$\\equiv$' },
            { pattern: /∝/g, replacement: '$\\propto$' },
            { pattern: /∈/g, replacement: '$\\in$' },
            { pattern: /∉/g, replacement: '$\\notin$' },
            { pattern: /⊂/g, replacement: '$\\subset$' },
            { pattern: /⊃/g, replacement: '$\\supset$' },
            { pattern: /∪/g, replacement: '$\\cup$' },
            { pattern: /∩/g, replacement: '$\\cap$' },
            { pattern: /∅/g, replacement: '$\\emptyset$' },
            { pattern: /∑/g, replacement: '$\\sum$' },
            { pattern: /∏/g, replacement: '$\\prod$' },
            { pattern: /√/g, replacement: '$\\sqrt{}$' },
            { pattern: /∛/g, replacement: '$\\sqrt[3]{}$' },
            { pattern: /∜/g, replacement: '$\\sqrt[4]{}$' },
            { pattern: /²/g, replacement: '$^2$' },
            { pattern: /³/g, replacement: '$^3$' },
            { pattern: /⁴/g, replacement: '$^4$' },
            { pattern: /⁵/g, replacement: '$^5$' },
            { pattern: /⁶/g, replacement: '$^6$' },
            { pattern: /⁷/g, replacement: '$^7$' },
            { pattern: /⁸/g, replacement: '$^8$' },
            { pattern: /⁹/g, replacement: '$^9$' },
            { pattern: /₀/g, replacement: '$_0$' },
            { pattern: /₁/g, replacement: '$_1$' },
            { pattern: /₂/g, replacement: '$_2$' },
            { pattern: /₃/g, replacement: '$_3$' },
            { pattern: /₄/g, replacement: '$_4$' },
            { pattern: /₅/g, replacement: '$_5$' },
            { pattern: /₆/g, replacement: '$_6$' },
            { pattern: /₇/g, replacement: '$_7$' },
            { pattern: /₈/g, replacement: '$_8$' },
            { pattern: /₉/g, replacement: '$_9$' }
        ];
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

        // 重新渲染数学公式
        this.typeset();
    }

    /**
     * 美化单个元素中的公式
     */
    beautifyElement(element) {
        let content = element.innerHTML;
        let hasChanges = false;

        // 应用所有公式模式
        this.formulaPatterns.forEach(pattern => {
            if (pattern.pattern.test(content)) {
                content = content.replace(pattern.pattern, pattern.replacement);
                hasChanges = true;
            }
        });

        // 如果有变化，更新元素内容
        if (hasChanges) {
            element.innerHTML = content;
            element.classList.add('formula-beautified');
        }
    }

    /**
     * 创建美观的公式容器
     */
    createFormulaContainer(formulaData) {
        const {
            title = '',
            formula = '',
            explanation = '',
            derivation = [],
            physics = '',
            category = 'default'
        } = formulaData;

        const categoryColors = {
            'default': '#27ae60',
            'dynamics': '#3498db',
            'viscous': '#e74c3c',
            'turbulent': '#9b59b6',
            'static': '#f39c12',
            'properties': '#ff9800'
        };

        const color = categoryColors[category] || categoryColors.default;

        return `
            <div class="formula-container" style="border-color: ${color}">
                ${title ? `<div class="formula-title">${title}</div>` : ''}
                
                <div class="formula-display">
                    <div class="formula-main">${formula}</div>
                    ${explanation ? `<div class="formula-explanation">${explanation}</div>` : ''}
                </div>

                ${derivation.length > 0 ? `
                    <div class="formula-derivation">
                        <div class="derivation-title">推导过程：</div>
                        <div class="derivation-steps">
                            ${derivation.map(step => `
                                <div class="derivation-step">${step}</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${physics ? `
                    <div class="formula-physics">
                        <div class="physics-title">物理意义：</div>
                        <div class="physics-meaning">${physics}</div>
                    </div>
                ` : ''}
            </div>
        `;
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
     * 注入样式
     */
    injectStyles() {
        if (document.getElementById('formula-beautifier-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'formula-beautifier-styles';
        style.textContent = `
            .formula-container {
                background: linear-gradient(135deg, #e8f5e8, #d4edda);
                border: 3px solid #27ae60;
                border-radius: 20px;
                padding: 30px;
                margin: 25px 0;
                text-align: center;
                box-shadow: 0 8px 25px rgba(39, 174, 96, 0.2);
                position: relative;
                overflow: hidden;
                animation: fadeInUp 0.6s ease-out;
            }

            .formula-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #27ae60, #2ecc71, #27ae60);
            }

            .formula-title {
                color: #27ae60;
                font-weight: bold;
                font-size: 1.4em;
                margin-bottom: 20px;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
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
                
                .formula-container {
                    padding: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 初始化组件
     */
    init() {
        this.injectStyles();
        console.log('公式美化器初始化完成');
        
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
    module.exports = FormulaBeautifier;
} else {
    window.FormulaBeautifier = FormulaBeautifier;
} 