/**
 * 数学公式渲染组件
 * 提供美观的数学公式显示功能
 */
class FormulaRenderer {
    constructor() {
        this.initMathJax();
    }

    /**
     * 初始化MathJax
     */
    initMathJax() {
        // 如果MathJax已经加载，直接配置
        if (window.MathJax) {
            this.configureMathJax();
        } else {
            // 动态加载MathJax
            this.loadMathJax();
        }
    }

    /**
     * 加载MathJax
     */
    loadMathJax() {
        // 加载polyfill
        if (!window.Promise) {
            const polyfillScript = document.createElement('script');
            polyfillScript.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
            document.head.appendChild(polyfillScript);
        }

        // 加载MathJax
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
                processEnvironments: true,
                packages: ['base', 'ams', 'noerrors', 'noundefined']
            },
            options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
                ignoreHtmlClass: 'tex2jax_ignore',
                processHtmlClass: 'tex2jax_process'
            },
            startup: {
                pageReady: () => {
                    console.log('MathJax 配置完成');
                }
            }
        };
    }

    /**
     * 渲染公式容器
     * @param {Object} formulaData - 公式数据
     * @returns {string} HTML字符串
     */
    renderFormulaContainer(formulaData) {
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
            'static': '#f39c12'
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
     * 渲染公式列表
     * @param {Array} formulas - 公式数组
     * @param {string} containerId - 容器ID
     */
    renderFormulaList(formulas, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`容器 ${containerId} 不存在`);
            return;
        }

        const html = formulas.map(formula => this.renderFormulaContainer(formula)).join('');
        container.innerHTML = html;

        // 重新渲染数学公式
        this.typeset();
    }

    /**
     * 渲染单个公式
     * @param {Object} formulaData - 公式数据
     * @param {string} containerId - 容器ID
     */
    renderSingleFormula(formulaData, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`容器 ${containerId} 不存在`);
            return;
        }

        const html = this.renderFormulaContainer(formulaData);
        container.innerHTML = html;

        // 重新渲染数学公式
        this.typeset();
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
     * 创建公式样式
     * @returns {string} CSS样式字符串
     */
    getFormulaStyles() {
        return `
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
    }

    /**
     * 注入样式到页面
     */
    injectStyles() {
        if (document.getElementById('formula-renderer-styles')) {
            return; // 样式已存在
        }

        const style = document.createElement('style');
        style.id = 'formula-renderer-styles';
        style.textContent = this.getFormulaStyles();
        document.head.appendChild(style);
    }

    /**
     * 初始化组件
     */
    init() {
        this.injectStyles();
        console.log('公式渲染器初始化完成');
    }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormulaRenderer;
} else {
    window.FormulaRenderer = FormulaRenderer;
} 