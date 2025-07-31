// Safari兼容性修复脚本
(function() {
    'use strict';
    
    // 检测Safari浏览器
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    console.log('🍎 Safari兼容性脚本启动', { isSafari, isIOS });
    
    // Safari兼容性修复
    if (isSafari || isIOS) {
        
        // 修复iOS Safari的100vh问题
        function fixIOSViewport() {
            const setViewportHeight = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };
            
            setViewportHeight();
            window.addEventListener('resize', setViewportHeight);
            window.addEventListener('orientationchange', () => {
                setTimeout(setViewportHeight, 500);
            });
        }
        
        // 修复Safari中的CSS Grid问题
        function fixSafariGrid() {
            const style = document.createElement('style');
            style.textContent = `
                .modules-grid {
                    display: -webkit-grid;
                    display: grid;
                    -webkit-grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
                    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
                }
                
                .stats-panel {
                    display: -webkit-grid;
                    display: grid;
                    -webkit-grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                }
                
                /* 修复Safari中的backdrop-filter */
                .glass-card, .module-card {
                    -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(10px);
                }
                
                /* 修复Safari中的sticky定位 */
                .sticky {
                    position: -webkit-sticky;
                    position: sticky;
                }
                
                /* 修复Safari中的transform3d硬件加速 */
                .animated-element {
                    -webkit-transform: translate3d(0, 0, 0);
                    transform: translate3d(0, 0, 0);
                }
            `;
            document.head.appendChild(style);
        }
        
        // 修复Safari中的事件处理
        function fixSafariEvents() {
            // 修复touch事件
            document.addEventListener('touchstart', function() {}, { passive: true });
            
            // 修复click延迟
            document.addEventListener('click', function(e) {
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                    e.target.style.webkitTapHighlightColor = 'transparent';
                }
            });
        }
        
        // 修复Safari中的fetch API问题
        function fixSafariFetch() {
            const originalFetch = window.fetch;
            window.fetch = function(url, options = {}) {
                // 为Safari添加默认的请求头
                const defaultOptions = {
                    mode: 'cors',
                    credentials: 'same-origin',
                    ...options
                };
                
                return originalFetch(url, defaultOptions).catch(error => {
                    console.warn('Safari fetch error, retrying with different options:', error);
                    // 重试时使用更兼容的选项
                    return originalFetch(url, {
                        ...defaultOptions,
                        mode: 'no-cors'
                    });
                });
            };
        }
        
        // 修复Safari中的Promise兼容性
        function fixSafariPromise() {
            // 确保Promise存在
            if (typeof Promise === 'undefined') {
                console.warn('Promise not supported, loading polyfill');
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js';
                document.head.appendChild(script);
            }
        }
        
        // 修复Safari中的CSS变量问题
        function fixSafariCSSVariables() {
            // 检测CSS变量支持
            if (!window.CSS || !window.CSS.supports || !window.CSS.supports('color', 'var(--fake-var)')) {
                console.warn('CSS Variables not fully supported, applying fallbacks');
                const style = document.createElement('style');
                style.textContent = `
                    :root {
                        /* Safari fallback colors */
                        --primary-color-fallback: #667eea;
                        --secondary-color-fallback: #764ba2;
                        --accent-color-fallback: #4facfe;
                    }
                    
                    body {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // 修复Safari中的滚动问题
        function fixSafariScrolling() {
            // 启用iOS的弹性滚动
            document.body.style.webkitOverflowScrolling = 'touch';
            
            // 修复滚动穿透问题
            let scrollY = 0;
            window.addEventListener('scroll', () => {
                scrollY = window.scrollY;
            });
        }
        
        // 修复Safari中的表单输入问题
        function fixSafariInputs() {
            document.addEventListener('DOMContentLoaded', () => {
                const inputs = document.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    // 修复Safari中的输入框样式
                    input.style.webkitAppearance = 'none';
                    input.style.borderRadius = '0';
                    
                    // 修复Safari中的输入框focus问题
                    input.addEventListener('focus', function() {
                        this.style.webkitUserSelect = 'text';
                        this.style.userSelect = 'text';
                    });
                });
            });
        }
        
        // 主初始化函数
        function initSafariCompatibility() {
            try {
                fixIOSViewport();
                fixSafariGrid();
                fixSafariEvents();
                fixSafariFetch();
                fixSafariPromise();
                fixSafariCSSVariables();
                fixSafariScrolling();
                fixSafariInputs();
                
                console.log('✅ Safari兼容性修复完成');
            } catch (error) {
                console.error('❌ Safari兼容性修复失败:', error);
            }
        }
        
        // 页面加载完成后执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSafariCompatibility);
        } else {
            initSafariCompatibility();
        }
        
        // 添加CSS for 100vh fix
        const vhStyle = document.createElement('style');
        vhStyle.textContent = `
            .full-height {
                height: 100vh;
                height: calc(var(--vh, 1vh) * 100);
            }
            
            body {
                min-height: 100vh;
                min-height: calc(var(--vh, 1vh) * 100);
            }
        `;
        document.head.appendChild(vhStyle);
        
    } else {
        console.log('ℹ️ 非Safari浏览器，跳过兼容性修复');
    }
    
})(); 