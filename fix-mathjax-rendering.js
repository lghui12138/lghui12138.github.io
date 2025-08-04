// MathJax渲染修复脚本
console.log('🔧 开始修复MathJax渲染问题...');

// 1. 检查MathJax是否已加载
function checkMathJaxStatus() {
    console.log('=== MathJax状态检查 ===');
    console.log('MathJax对象存在:', !!window.MathJax);
    if (window.MathJax) {
        console.log('MathJax版本:', window.MathJax.version);
        console.log('MathJax.typesetPromise存在:', !!window.MathJax.typesetPromise);
        console.log('MathJax.tex2chtml存在:', !!window.MathJax.tex2chtml);
    }
}

// 2. 强制重新加载MathJax
function reloadMathJax() {
    console.log('🔄 重新加载MathJax...');
    
    // 移除现有的MathJax脚本
    const existingScripts = document.querySelectorAll('script[src*="mathjax"]');
    existingScripts.forEach(script => script.remove());
    
    // 清除现有的MathJax元素
    document.querySelectorAll('.MathJax').forEach(el => el.remove());
    
    // 重新配置MathJax
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
            processHtmlClass: 'tex2jax_process',
            enableMenu: false
        },
        loader: {
            load: ['[tex]/ams', '[tex]/noerrors', '[tex]/noundefined']
        },
        startup: {
            pageReady: () => {
                return MathJax.startup.defaultPageReady().then(() => {
                    console.log('✅ MathJax重新加载完成');
                    setTimeout(forceRenderAllFormulas, 1000);
                });
            }
        }
    };
    
    // 加载MathJax
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    script.onload = () => {
        console.log('✅ MathJax脚本加载完成');
    };
    script.onerror = () => {
        console.log('❌ 主CDN失败，尝试备用CDN...');
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.js';
        fallbackScript.async = true;
        document.head.appendChild(fallbackScript);
    };
    document.head.appendChild(script);
}

// 3. 强制渲染所有公式
function forceRenderAllFormulas() {
    console.log('🎯 强制渲染所有公式...');
    
    if (!window.MathJax || !window.MathJax.typesetPromise) {
        console.log('❌ MathJax未加载，延迟重试...');
        setTimeout(forceRenderAllFormulas, 1000);
        return;
    }
    
    // 检查页面中的公式
    const formulas = document.querySelectorAll('.math-formula');
    console.log(`找到 ${formulas.length} 个公式元素`);
    
    formulas.forEach((el, index) => {
        const content = el.innerHTML;
        const hasMath = content.includes('$$') || content.includes('\\(');
        console.log(`公式${index + 1}: 包含数学符号 = ${hasMath}`);
        if (hasMath) {
            console.log(`公式${index + 1}内容:`, content.substring(0, 100) + '...');
        }
    });
    
    // 强制重新渲染
    MathJax.typesetPromise().then(() => {
        console.log('✅ 所有公式渲染完成');
        
        // 确保所有MathJax元素可见
        document.querySelectorAll('.MathJax').forEach(el => {
            el.style.display = 'block !important';
            el.style.visibility = 'visible !important';
            el.style.opacity = '1 !important';
        });
        
        // 检查渲染结果
        const renderedElements = document.querySelectorAll('.MathJax');
        console.log(`渲染后MathJax元素数量: ${renderedElements.length}`);
        
        if (renderedElements.length === 0) {
            console.log('⚠️ 没有找到渲染的MathJax元素，尝试备用方案...');
            showRawLatex();
        }
    }).catch(error => {
        console.error('❌ 公式渲染失败:', error);
        showRawLatex();
    });
}

// 4. 备用方案：显示原始LaTeX代码
function showRawLatex() {
    console.log('📝 显示原始LaTeX代码...');
    
    document.querySelectorAll('.math-formula').forEach(el => {
        const content = el.innerHTML;
        if (content.includes('$$')) {
            // 将$$公式转换为可读格式
            const formattedContent = content.replace(/\$\$(.*?)\$\$/g, (match, latex) => {
                return `<div style="
                    font-family: 'Courier New', monospace; 
                    background: rgba(255,255,255,0.1); 
                    padding: 15px; 
                    border-radius: 8px; 
                    margin: 10px 0; 
                    border-left: 4px solid #4facfe;
                    color: #fff;
                    font-size: 14px;
                    line-height: 1.4;
                    white-space: pre-wrap;
                ">$$${latex}$$</div>`;
            });
            el.innerHTML = formattedContent;
        }
    });
}

// 5. 添加手动渲染按钮
function addManualRenderButton() {
    // 确保DOM已加载
    if (!document.body) {
        console.log('⏳ DOM未加载，延迟添加按钮...');
        setTimeout(addManualRenderButton, 500);
        return;
    }
    
    // 检查按钮是否已存在
    if (document.getElementById('manual-render-button')) {
        console.log('✅ 手动渲染按钮已存在');
        return;
    }
    
    const button = document.createElement('button');
    button.id = 'manual-render-button';
    button.innerHTML = '🔧 手动渲染公式';
    button.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    button.onclick = () => {
        console.log('🔧 手动触发公式渲染...');
        checkMathJaxStatus();
        if (window.MathJax && window.MathJax.typesetPromise) {
            forceRenderAllFormulas();
        } else {
            reloadMathJax();
        }
    };
    
    button.onmouseover = () => {
        button.style.transform = 'scale(1.05)';
    };
    
    button.onmouseout = () => {
        button.style.transform = 'scale(1)';
    };
    
    try {
        document.body.appendChild(button);
        console.log('✅ 手动渲染按钮已添加');
    } catch (error) {
        console.error('❌ 添加按钮失败:', error);
    }
}

// 6. 主执行函数
function fixMathJaxRendering() {
    console.log('🚀 开始修复MathJax渲染问题...');
    
    // 等待页面完全加载后再添加按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                addManualRenderButton();
                checkMathJaxStatus();
                
                if (!window.MathJax || !window.MathJax.typesetPromise) {
                    console.log('🔄 MathJax未加载，重新加载...');
                    reloadMathJax();
                } else {
                    console.log('✅ MathJax已加载，开始渲染...');
                    forceRenderAllFormulas();
                }
            }, 3000);
        });
    } else {
        setTimeout(() => {
            addManualRenderButton();
            checkMathJaxStatus();
            
            if (!window.MathJax || !window.MathJax.typesetPromise) {
                console.log('🔄 MathJax未加载，重新加载...');
                reloadMathJax();
            } else {
                console.log('✅ MathJax已加载，开始渲染...');
                forceRenderAllFormulas();
            }
        }, 3000);
    }
}

// 7. 暴露函数到全局
window.fixMathJaxRendering = fixMathJaxRendering;
window.checkMathJaxStatus = checkMathJaxStatus;
window.forceRenderAllFormulas = forceRenderAllFormulas;
window.reloadMathJax = reloadMathJax;

// 8. 自动执行修复
fixMathJaxRendering();

console.log('🔧 MathJax修复脚本已加载，等待执行...'); 