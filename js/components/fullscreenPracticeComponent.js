/**
 * 🖥️ 全屏练习组件模块
 * 负责全屏UI、交互体验、视觉效果
 * 优化自practice-fullscreen-fixed-final.html
 */
window.FullscreenPracticeComponent = (function() {
    'use strict';
    
    // ============ 私有变量 ============
    let isFullscreen = false;
    let currentMode = 'normal'; // normal, fullscreen, focus
    let questionStartTime = null;
    let timerInterval = null;
    let isInitialized = false;
    
    // ============ 样式常量 ============
    const STYLES = `
        .fullscreen-practice-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 10000;
            display: none;
            overflow: hidden;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .fullscreen-practice-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            background: white;
            margin: 20px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        
        .fullscreen-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        
        .fullscreen-title {
            font-size: 1.8em;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .fullscreen-controls {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .fullscreen-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
            flex-shrink: 0;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-3px);
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 0.9em;
            opacity: 0.9;
        }
        
        .question-area {
            flex: 1;
            padding: 30px;
            display: flex;
            flex-direction: column;
            min-height: 0;
        }
        
        .question-progress {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .progress-bar {
            flex: 1;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            margin: 0 20px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 4px;
            transition: width 0.3s ease;
            width: 0%;
        }
        
        .question-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
        }
        
        .question-text {
            font-size: 1.3em;
            line-height: 1.6;
            margin-bottom: 30px;
            padding: 25px;
            background: #f8f9fa;
            border-radius: 15px;
            border-left: 5px solid #667eea;
        }
        
        .options-grid {
            display: grid;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .option-item {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1.1em;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .option-item:hover {
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }
        
        .option-item.selected {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
        }
        
        .option-label {
            font-weight: bold;
            min-width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .option-item.selected .option-label {
            background: rgba(255,255,255,0.2);
            color: white;
        }
        
        .question-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            padding: 20px 0;
            border-top: 2px solid #f0f0f0;
        }
        
        .btn-fullscreen {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-fullscreen:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
        }
        
        .btn-success {
            background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
        }
        
        .btn-danger {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        }
        
        .timer-display {
            font-size: 1.2em;
            font-weight: bold;
            color: white;
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .explanation-panel {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            display: none;
        }
        
        .explanation-panel.show {
            display: block;
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .fullscreen-practice-container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .fullscreen-stats {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                padding: 20px;
            }
            
            .question-area {
                padding: 20px;
            }
            
            .question-text {
                font-size: 1.1em;
                padding: 20px;
            }
            
            .option-item {
                padding: 15px;
                font-size: 1em;
            }
        }
    `;
    
    // ============ DOM操作 ============
    function createFullscreenOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'fullscreen-practice-overlay';
        overlay.className = 'fullscreen-practice-overlay';
        
        overlay.innerHTML = `
            <div class="fullscreen-practice-container">
                <div class="fullscreen-header">
                    <div class="fullscreen-title">
                        <i class="fas fa-brain"></i>
                        <span>全屏模式 - 专注学习体验</span>
                    </div>
                    <div class="fullscreen-controls">
                        <div class="timer-display" id="practice-timer">
                            <i class="fas fa-clock"></i>
                            <span>00:00</span>
                        </div>
                        <button class="btn-fullscreen btn-secondary" onclick="FullscreenPracticeComponent.exitFullscreen()">
                            <i class="fas fa-times"></i> 退出全屏
                        </button>
                    </div>
                </div>
                
                <div class="fullscreen-stats" id="practice-stats">
                    <div class="stat-card">
                        <div class="stat-number" id="total-questions">0</div>
                        <div class="stat-label">总题数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="answered-questions">0</div>
                        <div class="stat-label">已答题</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="accuracy-rate">0%</div>
                        <div class="stat-label">正确率</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="average-time">0s</div>
                        <div class="stat-label">平均用时</div>
                    </div>
                </div>
                
                <div class="question-area">
                    <div class="question-progress">
                        <span id="question-number">第 1 题</span>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                        </div>
                        <span id="progress-text">1 / 100</span>
                    </div>
                    
                    <div class="question-content">
                        <div class="question-text" id="question-text">
                            正在加载题目...
                        </div>
                        
                        <div class="options-grid" id="options-grid">
                            <!-- 选项将在这里动态生成 -->
                        </div>
                        
                        <div class="explanation-panel" id="explanation-panel">
                            <h4><i class="fas fa-lightbulb"></i> 题目解析</h4>
                            <p id="explanation-text"></p>
                        </div>
                    </div>
                    
                    <div class="question-actions">
                        <button class="btn-fullscreen btn-secondary" onclick="FullscreenPracticeComponent.previousQuestion()">
                            <i class="fas fa-chevron-left"></i> 上一题
                        </button>
                        <button class="btn-fullscreen btn-success" onclick="FullscreenPracticeComponent.submitAnswer()">
                            <i class="fas fa-check"></i> 提交答案
                        </button>
                        <button class="btn-fullscreen btn-secondary" onclick="FullscreenPracticeComponent.nextQuestion()">
                            下一题 <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="btn-fullscreen btn-danger" onclick="FullscreenPracticeComponent.resetProgress()">
                            <i class="fas fa-redo"></i> 重置进度
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        return overlay;
    }
    
    function injectStyles() {
        if (document.getElementById('fullscreen-practice-styles')) return;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'fullscreen-practice-styles';
        styleSheet.textContent = STYLES;
        document.head.appendChild(styleSheet);
    }
    
    // ============ UI渲染功能 ============ 
    let selectedOptionIndex = null;
    
    function renderCurrentQuestion() {
        if (!window.QuestionBankEngine) {
            console.error('题库引擎未加载');
            return;
        }
        
        const question = window.QuestionBankEngine.getCurrentQuestion();
        if (!question) {
            console.warn('没有当前题目');
            document.getElementById('question-text').textContent = '暂无题目，请先加载题库';
            return;
        }
        
        // 更新题目信息
        updateQuestionDisplay(question);
        
        // 更新统计信息
        updateStatsDisplay();
        
        // 重置计时器
        questionStartTime = Date.now();
        
        // 隐藏解析面板
        hideExplanation();
        
        // 重置选择状态
        selectedOptionIndex = null;
        
        console.log('✅ 题目渲染完成:', question.question.substring(0, 50) + '...');
    }
    
    function updateQuestionDisplay(question) {
        // 更新进度
        document.getElementById('question-number').textContent = `第 ${question.index + 1} 题`;
        document.getElementById('progress-text').textContent = `${question.index + 1} / ${question.total}`;
        document.getElementById('progress-fill').style.width = `${question.progress}%`;
        
        // 更新题目内容
        document.getElementById('question-text').textContent = question.question;
        
        // 更新选项
        const optionsGrid = document.getElementById('options-grid');
        optionsGrid.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.onclick = () => selectOption(index);
            
            optionElement.innerHTML = `
                <div class="option-label">${String.fromCharCode(65 + index)}</div>
                <div class="option-text">${option}</div>
            `;
            
            optionsGrid.appendChild(optionElement);
        });
    }
    
    function updateStatsDisplay() {
        if (!window.QuestionBankEngine) return;
        
        const stats = window.QuestionBankEngine.getStatistics();
        
        document.getElementById('total-questions').textContent = stats.totalQuestions;
        document.getElementById('answered-questions').textContent = stats.answeredQuestions;
        document.getElementById('accuracy-rate').textContent = stats.accuracy;
        document.getElementById('average-time').textContent = stats.formattedAverageTime;
    }
    
    function selectOption(index) {
        // 清除之前的选择
        document.querySelectorAll('.option-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 选择当前选项
        const optionItems = document.querySelectorAll('.option-item');
        if (optionItems[index]) {
            optionItems[index].classList.add('selected');
            selectedOptionIndex = index;
        }
    }
    
    function showExplanation(question, userAnswer) {
        const explanationPanel = document.getElementById('explanation-panel');
        const explanationText = document.getElementById('explanation-text');
        
        const isCorrect = userAnswer === question.correctAnswer;
        const correctLetter = String.fromCharCode(65 + question.correctAnswer);
        
        let explanationContent = `
            <strong>${isCorrect ? '✅ 回答正确！' : '❌ 回答错误'}</strong><br>
            正确答案：${correctLetter}. ${question.options[question.correctAnswer]}<br><br>
        `;
        
        if (question.explanation) {
            explanationContent += question.explanation;
        }
        
        explanationText.innerHTML = explanationContent;
        explanationPanel.classList.add('show');
    }
    
    function hideExplanation() {
        const explanationPanel = document.getElementById('explanation-panel');
        explanationPanel.classList.remove('show');
    }
    
    // ============ 公共接口 ============
    return {
        // 初始化
        init: function() {
            if (isInitialized) return;
            
            console.log('🖥️ 初始化全屏练习组件...');
            
            // 注入样式
            injectStyles();
            
            // 创建覆盖层
            createFullscreenOverlay();
            
            isInitialized = true;
            console.log('✅ 全屏练习组件初始化完成');
        },
        
        // 全屏控制
        enterFullscreen: function() {
            const overlay = document.getElementById('fullscreen-practice-overlay');
            if (overlay) {
                overlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
                isFullscreen = true;
                
                // 渲染当前题目
                setTimeout(() => {
                    renderCurrentQuestion();
                }, 100);
                
                console.log('✅ 进入全屏练习模式');
            }
        },
        
        exitFullscreen: function() {
            const overlay = document.getElementById('fullscreen-practice-overlay');
            if (overlay) {
                overlay.style.display = 'none';
                document.body.style.overflow = '';
                isFullscreen = false;
                console.log('✅ 退出全屏练习模式');
            }
        },
        
        // 题目导航
        nextQuestion: function() {
            if (!window.QuestionBankEngine) return;
            
            const next = window.QuestionBankEngine.nextQuestion();
            if (next) {
                renderCurrentQuestion();
            } else {
                alert('已经是最后一题了！');
            }
        },
        
        previousQuestion: function() {
            if (!window.QuestionBankEngine) return;
            
            const prev = window.QuestionBankEngine.previousQuestion();
            if (prev) {
                renderCurrentQuestion();
            } else {
                alert('已经是第一题了！');
            }
        },
        
        submitAnswer: function() {
            if (!window.QuestionBankEngine) {
                console.error('题库引擎未加载');
                return;
            }
            
            if (selectedOptionIndex === null) {
                alert('请先选择一个答案');
                return;
            }
            
            const question = window.QuestionBankEngine.getCurrentQuestion();
            if (!question) return;
            
            const timeSpent = questionStartTime ? Date.now() - questionStartTime : 0;
            const success = window.QuestionBankEngine.submitAnswer(question.id, selectedOptionIndex, timeSpent);
            
            if (success) {
                // 显示解析
                showExplanation(question, selectedOptionIndex);
                
                // 更新统计
                updateStatsDisplay();
                
                // 重置选择
                selectedOptionIndex = null;
            }
        },
        
        resetProgress: function() {
            if (confirm('确定要重置所有答题进度吗？')) {
                if (window.QuestionBankEngine) {
                    window.QuestionBankEngine.resetStatistics();
                    renderCurrentQuestion();
                    updateStatsDisplay();
                }
            }
        },
        
        // UI更新方法
        renderCurrentQuestion,
        updateStatsDisplay,
        selectOption
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', function() {
    FullscreenPracticeComponent.init();
    console.log('🖥️ 全屏练习组件已加载');
}); 