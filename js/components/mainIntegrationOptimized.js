/**
 * 🏠 主界面集成优化模块
 * 将优化的题库功能集成到现有主界面中
 * 保持所有原有功能的同时增强题库体验
 */
window.MainIntegrationOptimized = (function() {
    'use strict';
    
    // ============ 私有变量 ============
    let isInitialized = false;
    let questionBankLoaded = false;
    let originalLocalQuestionBank = null;
    
    // ============ 集成配置 ============
    const INTEGRATION_CONFIG = {
        enableFullscreen: true,
        autoLoadQuestionBank: true,
        defaultQuestionBank: 'all', // 使用批量加载策略
        showLoadingIndicator: true,
        enhancedUI: true
    };
    
    // ============ UI增强样式 ============
    const ENHANCED_STYLES = `
        /* 题库按钮增强 */
        .question-bank-enhanced {
            position: relative;
            overflow: hidden;
        }
        
        .question-bank-enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .question-bank-enhanced:hover::before {
            left: 100%;
        }
        
        .loading-indicator {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .question-bank-status {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #51cf66;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .question-bank-status.loading {
            background: #feca57;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        .question-bank-status.error {
            background: #ff6b6b;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
        }
        
        /* 通知提示样式 */
        .notification-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: #333;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        }
        
        .notification-toast.show {
            transform: translateX(0);
        }
        
        .notification-toast.success {
            border-left: 4px solid #51cf66;
        }
        
        .notification-toast.error {
            border-left: 4px solid #ff6b6b;
        }
        
        .notification-toast.info {
            border-left: 4px solid #4facfe;
        }
    `;
    
    // ============ 核心集成逻辑 ============
    async function initializeQuestionBankIntegration() {
        console.log('🔄 初始化题库集成...');
        
        try {
            // 保存原有的LocalQuestionBank
            if (window.LocalQuestionBank) {
                originalLocalQuestionBank = { ...window.LocalQuestionBank };
                console.log('📦 已保存原有题库系统');
            }
            
            // 等待核心引擎加载
            if (!window.QuestionBankEngine) {
                console.log('⏳ 等待题库引擎加载...');
                await waitForEngine();
            }
            
            // 等待全屏组件加载
            if (!window.FullscreenPracticeComponent) {
                console.log('⏳ 等待全屏组件加载...');
                await waitForComponent();
            }
            
            // 初始化题库引擎
            if (INTEGRATION_CONFIG.autoLoadQuestionBank) {
                showNotification('正在加载题库...', 'info');
                updateQuestionBankStatus('loading');
                
                const success = await window.QuestionBankEngine.init(INTEGRATION_CONFIG.defaultQuestionBank);
                
                if (success) {
                    questionBankLoaded = true;
                    showNotification('题库加载成功！', 'success');
                    updateQuestionBankStatus('ready');
                } else {
                    showNotification('题库加载失败，使用默认题目', 'error');
                    updateQuestionBankStatus('error');
                }
            }
            
            // 增强现有题库功能
            enhanceExistingQuestionBank();
            
            // 注入增强样式
            injectEnhancedStyles();
            
            console.log('✅ 题库集成初始化完成');
            return true;
            
        } catch (error) {
            console.error('❌ 题库集成初始化失败:', error);
            showNotification('题库集成初始化失败', 'error');
            return false;
        }
    }
    
    // 等待引擎加载
    function waitForEngine() {
        return new Promise((resolve) => {
            const checkEngine = () => {
                if (window.QuestionBankEngine) {
                    resolve();
                } else {
                    setTimeout(checkEngine, 100);
                }
            };
            checkEngine();
        });
    }
    
    // 等待组件加载
    function waitForComponent() {
        return new Promise((resolve) => {
            const checkComponent = () => {
                if (window.FullscreenPracticeComponent) {
                    resolve();
                } else {
                    setTimeout(checkComponent, 100);
                }
            };
            checkComponent();
        });
    }
    
    // ============ 增强现有功能 ============
    function enhanceExistingQuestionBank() {
        console.log('🔧 增强现有题库功能...');
        
        // 查找并增强题库导航按钮
        const questionBankLinks = document.querySelectorAll('[onclick*="LocalQuestionBank"], [onclick*="question-bank"], a[href*="question-bank"]');
        
        questionBankLinks.forEach(link => {
            enhanceQuestionBankLink(link);
        });
        
        // 创建增强的LocalQuestionBank对象
        window.LocalQuestionBank = createEnhancedLocalQuestionBank();
        
        console.log('✅ 现有题库功能增强完成');
    }
    
    function enhanceQuestionBankLink(link) {
        // 添加增强样式类
        link.classList.add('question-bank-enhanced');
        
        // 添加状态指示器
        if (!link.querySelector('.question-bank-status')) {
            const statusIndicator = document.createElement('div');
            statusIndicator.className = 'question-bank-status loading';
            link.style.position = 'relative';
            link.appendChild(statusIndicator);
        }
        
        // 增强点击事件
        const originalOnClick = link.getAttribute('onclick');
        link.removeAttribute('onclick');
        
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // 显示加载状态
            showLoadingInButton(link);
            
            try {
                // 确保题库已加载
                if (!questionBankLoaded && window.QuestionBankEngine) {
                    await window.QuestionBankEngine.init(INTEGRATION_CONFIG.defaultQuestionBank);
                    questionBankLoaded = true;
                }
                
                // 调用增强的题库功能
                await openEnhancedQuestionBank();
                
            } catch (error) {
                console.error('打开题库失败:', error);
                showNotification('打开题库失败', 'error');
                
                // 回退到原有功能
                if (originalOnClick && originalLocalQuestionBank?.showModal) {
                    originalLocalQuestionBank.showModal();
                }
            } finally {
                hideLoadingInButton(link);
            }
        });
    }
    
    // ============ 增强的LocalQuestionBank ============
    function createEnhancedLocalQuestionBank() {
        return {
            // 保持原有接口兼容性
            showModal: async function() {
                await openEnhancedQuestionBank();
            },
            
            // 新增的增强功能
            openFullscreen: async function() {
                if (!questionBankLoaded && window.QuestionBankEngine) {
                    await window.QuestionBankEngine.init(INTEGRATION_CONFIG.defaultQuestionBank);
                    questionBankLoaded = true;
                }
                
                if (window.FullscreenPracticeComponent) {
                    window.FullscreenPracticeComponent.enterFullscreen();
                    
                    // 连接引擎和组件
                    connectEngineToComponent();
                }
            },
            
            // 获取统计信息
            getStatistics: function() {
                return window.QuestionBankEngine ? window.QuestionBankEngine.getStatistics() : null;
            },
            
            // 重置进度
            resetProgress: function() {
                if (window.QuestionBankEngine) {
                    window.QuestionBankEngine.resetStatistics();
                }
            },
            
            // 原有功能的备份
            _original: originalLocalQuestionBank
        };
    }
    
    // ============ 题库功能入口 ============
    async function openEnhancedQuestionBank() {
        console.log('🚀 打开增强题库...');
        
        // 显示选择模式的对话框
        const mode = await showQuestionBankModeDialog();
        
        switch (mode) {
            case 'fullscreen':
                if (window.FullscreenPracticeComponent) {
                    window.FullscreenPracticeComponent.enterFullscreen();
                    connectEngineToComponent();
                }
                break;
                
            case 'original':
                if (originalLocalQuestionBank?.showModal) {
                    originalLocalQuestionBank.showModal();
                } else {
                    showNotification('原题库功能不可用', 'error');
                }
                break;
                
            case 'integrated':
            default:
                // 在当前页面中打开集成题库
                await openIntegratedQuestionBank();
                break;
        }
    }
    
    // 连接引擎和组件
    function connectEngineToComponent() {
        if (!window.QuestionBankEngine || !window.FullscreenPracticeComponent) return;
        
        // 重写组件的方法以使用引擎
        window.FullscreenPracticeComponent.nextQuestion = function() {
            const next = window.QuestionBankEngine.nextQuestion();
            if (next) {
                this.renderCurrentQuestion();
            } else {
                showNotification('已经是最后一题了！', 'info');
            }
        };
        
        window.FullscreenPracticeComponent.previousQuestion = function() {
            const prev = window.QuestionBankEngine.previousQuestion();
            if (prev) {
                this.renderCurrentQuestion();
            } else {
                showNotification('已经是第一题了！', 'info');
            }
        };
        
        window.FullscreenPracticeComponent.submitAnswer = function() {
            // 获取用户选择的答案
            const selectedOption = document.querySelector('.option-item.selected');
            if (!selectedOption) {
                showNotification('请先选择一个答案', 'info');
                return;
            }
            
            const answerIndex = Array.from(selectedOption.parentElement.children).indexOf(selectedOption);
            const question = window.QuestionBankEngine.getCurrentQuestion();
            
            if (question) {
                const timeSpent = Date.now() - (this.questionStartTime || Date.now());
                window.QuestionBankEngine.submitAnswer(question.id, answerIndex, timeSpent);
                this.updateStatsDisplay();
                
                // 显示结果
                const isCorrect = answerIndex === question.correctAnswer;
                showNotification(isCorrect ? '回答正确！' : '回答错误', isCorrect ? 'success' : 'error');
            }
        };
        
        window.FullscreenPracticeComponent.resetProgress = function() {
            if (confirm('确定要重置所有答题进度吗？')) {
                window.QuestionBankEngine.resetStatistics();
                this.renderCurrentQuestion();
                this.updateStatsDisplay();
                showNotification('进度已重置', 'info');
            }
        };
        
        // 初始渲染
        setTimeout(() => {
            if (window.FullscreenPracticeComponent.renderCurrentQuestion) {
                window.FullscreenPracticeComponent.renderCurrentQuestion();
            }
        }, 100);
    }
    
    // ============ UI工具函数 ============
    function showQuestionBankModeDialog() {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; border-radius: 15px; padding: 30px; max-width: 400px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                        <h3 style="color: #333; margin-bottom: 20px;">选择练习模式</h3>
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <button onclick="selectMode('fullscreen')" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-size: 16px;">
                                🖥️ 全屏专注模式
                            </button>
                            <button onclick="selectMode('integrated')" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-size: 16px;">
                                📱 集成练习模式
                            </button>
                            <button onclick="selectMode('original')" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-size: 16px;">
                                📚 经典模式
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            window.selectMode = function(mode) {
                document.body.removeChild(dialog);
                delete window.selectMode;
                resolve(mode);
            };
        });
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => notification.classList.add('show'), 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    function updateQuestionBankStatus(status) {
        const statusIndicators = document.querySelectorAll('.question-bank-status');
        statusIndicators.forEach(indicator => {
            indicator.className = `question-bank-status ${status}`;
        });
    }
    
    function showLoadingInButton(button) {
        const icon = button.querySelector('i');
        if (icon && !button.querySelector('.loading-indicator')) {
            const loader = document.createElement('span');
            loader.className = 'loading-indicator';
            icon.parentNode.insertBefore(loader, icon);
            icon.style.display = 'none';
        }
    }
    
    function hideLoadingInButton(button) {
        const loader = button.querySelector('.loading-indicator');
        const icon = button.querySelector('i');
        if (loader) {
            loader.remove();
        }
        if (icon) {
            icon.style.display = '';
        }
    }
    
    function injectEnhancedStyles() {
        if (document.getElementById('main-integration-styles')) return;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'main-integration-styles';
        styleSheet.textContent = ENHANCED_STYLES;
        document.head.appendChild(styleSheet);
    }
    
    // 集成练习模式占位符
    async function openIntegratedQuestionBank() {
        showNotification('集成练习模式开发中，请使用全屏模式', 'info');
        // 暂时跳转到全屏模式
        if (window.FullscreenPracticeComponent) {
            window.FullscreenPracticeComponent.enterFullscreen();
            connectEngineToComponent();
        }
    }
    
    // ============ 公共接口 ============
    return {
        // 初始化
        init: async function() {
            if (isInitialized) return true;
            
            console.log('🏠 初始化主界面集成...');
            
            const success = await initializeQuestionBankIntegration();
            if (success) {
                isInitialized = true;
                console.log('✅ 主界面集成初始化完成');
            }
            
            return success;
        },
        
        // 手动打开题库
        openQuestionBank: openEnhancedQuestionBank,
        
        // 获取状态
        isReady: () => isInitialized && questionBankLoaded,
        getConfig: () => ({ ...INTEGRATION_CONFIG }),
        
        // 配置更新
        updateConfig: function(newConfig) {
            Object.assign(INTEGRATION_CONFIG, newConfig);
        },
        
        // 工具方法
        showNotification,
        
        // 调试信息
        debug: {
            isInitialized: () => isInitialized,
            questionBankLoaded: () => questionBankLoaded,
            hasEngine: () => !!window.QuestionBankEngine,
            hasComponent: () => !!window.FullscreenPracticeComponent,
            originalQuestionBank: () => originalLocalQuestionBank
        }
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 延迟初始化，确保其他模块已加载
    setTimeout(async () => {
        await MainIntegrationOptimized.init();
        console.log('🏠 主界面集成已完成');
    }, 1000);
}); 