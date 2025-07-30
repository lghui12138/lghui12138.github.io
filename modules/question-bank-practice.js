/**
 * 题库练习功能模块 - 全面优化版本
 * 负责题目练习、答题逻辑、计时等功能
 */
window.QuestionBankPractice = (function() {
    // 私有变量
    let currentSession = {
        questions: [],
        currentIndex: 0,
        userAnswers: [],
        startTime: null,
        questionTimes: [],
        bankId: null,
        sessionName: ''
    };
    
    let practiceState = {
        isActive: false,
        isPaused: false,
        timer: null,
        questionTimer: null,
        isFullscreen: false
    };
    
    // 配置
    const config = {
        defaultTimeLimit: 0, // 0 表示无时间限制
        showExplanation: true,
        shuffleQuestions: false,
        shuffleOptions: false,
        autoSave: true,
        autoSaveInterval: 30000 // 30秒自动保存
    };
    
    // 公有方法
    return {
        // 初始化模块
        init: function() {
            console.log('初始化练习模块...');
            this.bindEvents();
            this.bindEnhancedEvents();
            return this;
        },
        
        // 绑定事件
        bindEvents: function() {
            // 键盘快捷键
            document.addEventListener('keydown', (e) => {
                if (!practiceState.isActive) return;
                
                // 防止在输入框中触发快捷键
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                switch(e.key) {
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                        if (!practiceState.isPaused) {
                            this.selectOption(parseInt(e.key) - 1);
                        }
                        break;
                    case 'Enter':
                        if (!practiceState.isPaused) {
                            this.submitAnswer();
                        }
                        break;
                    case 'ArrowLeft':
                        this.previousQuestion();
                        break;
                    case 'ArrowRight':
                        this.nextQuestion();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.togglePause();
                        break;
                    case 'Escape':
                        if (practiceState.isFullscreen) {
                            this.toggleFullscreen();
                        } else {
                            this.exitPractice();
                        }
                        break;
                    case 'f':
                    case 'F':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            this.toggleFullscreen();
                        }
                        break;
                }
            });
            
            // 优化鼠标滚轮处理 - 修复滚动问题
            this.setupWheelEvents();
        },
        
        // 设置滚轮事件 - 最终优化版本
        setupWheelEvents: function() {
            // 只在练习界面内设置滚轮事件
            const practiceContainer = document.getElementById('practiceContainer');
            if (!practiceContainer) return;
            
            practiceContainer.addEventListener('wheel', (e) => {
                if (!practiceState.isActive) return;
                
                // 如果目标元素是输入框或文本域，允许正常滚动
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                
                // 获取题目显示容器
                const questionDisplay = document.getElementById('questionDisplay');
                if (!questionDisplay) return;
                
                // 检查是否在全屏模式
                const isFullscreen = practiceState.isFullscreen;
                
                // 检查是否在题目显示区域内
                const rect = questionDisplay.getBoundingClientRect();
                const isInQuestionArea = e.clientY >= rect.top && e.clientY <= rect.bottom;
                
                // 如果不在题目区域内，不处理滚轮事件
                if (!isInQuestionArea) {
                    return;
                }
                
                // 检查容器是否有滚动条
                const hasScrollbar = questionDisplay.scrollHeight > questionDisplay.clientHeight;
                
                if (hasScrollbar) {
                    const isAtTop = questionDisplay.scrollTop === 0;
                    const isAtBottom = questionDisplay.scrollTop + questionDisplay.clientHeight >= questionDisplay.scrollHeight;
                    
                    // 只有在顶部向上滚动或底部向下滚动时才切换题目
                    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                        e.preventDefault();
                        if (e.deltaY > 0) {
                            this.nextQuestion();
                        } else {
                            this.previousQuestion();
                        }
                    }
                    // 其他情况允许正常滚动
                    return;
                } else {
                    // 没有滚动条时，在全屏模式或特定条件下才切换题目
                    if (isFullscreen) {
                        e.preventDefault();
                        if (e.deltaY > 0) {
                            this.nextQuestion();
                        } else {
                            this.previousQuestion();
                        }
                    }
                    // 非全屏模式下有滚动条就正常滚动，没有滚动条也不切换题目
                }
            }, { passive: false });
        },
        
        // 开始练习（从题库）
        startPractice: function(bank) {
            if (!bank || !bank.questions || bank.questions.length === 0) {
                showNotification('该题库没有可用的题目', 'warning');
                return;
            }
            
            this.initSession({
                questions: [...bank.questions],
                bankId: bank.id,
                sessionName: `练习: ${bank.name}`
            });
            
            this.showPracticeInterface();
            showNotification(`开始练习 ${bank.name}`, 'success');
        },
        
        // 开始自定义练习
        startCustomPractice: function(questions, sessionName = '自定义练习') {
            if (!questions || questions.length === 0) {
                showNotification('没有可用的题目', 'warning');
                return;
            }
            
            this.initSession({
                questions: [...questions],
                bankId: 'custom',
                sessionName: sessionName
            });
            
            this.showPracticeInterface();
            showNotification(`开始${sessionName}`, 'success');
        },
        
        // 开始单题练习
        startSingleQuestion: function(question) {
            this.startCustomPractice([question], '单题练习');
        },
        
        // 初始化练习会话
        initSession: function(options) {
            currentSession = {
                questions: options.questions,
                currentIndex: 0,
                userAnswers: new Array(options.questions.length).fill(null),
                startTime: new Date(),
                questionTimes: [],
                bankId: options.bankId,
                sessionName: options.sessionName
            };
            
            practiceState = {
                isActive: true,
                isPaused: false,
                timer: null,
                questionTimer: Date.now(),
                isFullscreen: false
            };
            
            // 打乱题目顺序（如果需要）
            if (config.shuffleQuestions) {
                this.shuffleArray(currentSession.questions);
            }
            
            // 打乱选项顺序（如果需要）
            if (config.shuffleOptions) {
                currentSession.questions.forEach(question => {
                    if (question.options && question.options.length > 0) {
                        const correctAnswer = question.options[question.correct];
                        this.shuffleArray(question.options);
                        question.correct = question.options.indexOf(correctAnswer);
                    }
                });
            }
        },
        
        // 显示练习界面
        showPracticeInterface: function() {
            const content = this.generatePracticeHTML();
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: currentSession.sessionName,
                    content: content,
                    size: 'fullscreen',
                    closable: true,
                    backdrop: false,
                    onHide: () => this.exitPractice()
                });
            } else {
                // 降级方案：直接在页面中显示
                const container = document.getElementById('questionBanksList');
                if (container) {
                    container.innerHTML = content;
                }
            }
            
            // 应用阅读模式样式
            this.applyReadingModeStyles();
            
            // 恢复阅读模式状态
            this.restoreReadingMode();
            
            this.displayCurrentQuestion();
            this.startTimer();
            this.setupFullscreenListener();
        },
        
        // 生成练习界面HTML - 全面优化版本
        generatePracticeHTML: function() {
            return `
                <style>
                    /* 全屏样式优化 */
                    .practice-fullscreen {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        z-index: 9999 !important;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        overflow-y: auto;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    
                    .practice-fullscreen .practice-container {
                        max-width: 1400px;
                        margin: 0 auto;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    /* 题目显示区域优化 - 占据更大空间 */
                    #questionDisplay {
                        flex: 1;
                        min-height: 75vh;
                        max-height: 85vh;
                        overflow-y: auto;
                        font-size: 26px;
                        line-height: 2.2;
                        position: relative;
                        background: rgba(255,255,255,0.98);
                        border-radius: 20px;
                        padding: 50px;
                        margin: 20px 0;
                        box-shadow: 0 15px 50px rgba(0,0,0,0.1);
                        border: 2px solid rgba(79,172,254,0.2);
                        scroll-behavior: smooth;
                    }
                    
                    /* 全屏模式下的题目显示优化 - 最大化显示 */
                    .practice-fullscreen #questionDisplay {
                        min-height: 95vh;
                        max-height: 98vh;
                        font-size: 32px;
                        line-height: 2.4;
                        padding: 80px;
                        margin: 5px 0;
                    }
                    
                    /* 全屏模式下题目内容字体更大 */
                    .practice-fullscreen #questionDisplay h4 {
                        font-size: 36px !important;
                        margin-bottom: 35px !important;
                    }
                    
                    .practice-fullscreen #questionDisplay div[style*="font-size: 1.1em"] {
                        font-size: 1.8em !important;
                        line-height: 2.6 !important;
                    }
                    
                    .practice-fullscreen #questionDisplay div[style*="font-size: 1.2em"] {
                        font-size: 2.0em !important;
                        line-height: 2.8 !important;
                    }
                    
                    /* 全屏模式下选项字体更大 */
                    .practice-fullscreen .option-item {
                        font-size: 26px !important;
                        padding: 25px !important;
                        margin: 20px 0 !important;
                    }
                    
                    .practice-fullscreen .option-item span {
                        width: 45px !important;
                        height: 45px !important;
                        line-height: 45px !important;
                        font-size: 20px !important;
                    }
                    
                    /* 全屏模式下输入框更大 */
                    .practice-fullscreen input[type="text"],
                    .practice-fullscreen textarea {
                        font-size: 24px !important;
                        padding: 30px !important;
                        min-height: 70px !important;
                    }
                    
                    .practice-fullscreen textarea {
                        min-height: 250px !important;
                    }
                    
                    /* 全屏模式下按钮更大 */
                    .practice-fullscreen .judge-btn {
                        font-size: 24px !important;
                        padding: 25px 50px !important;
                        min-width: 150px !important;
                    }
                    
                    /* 字体大小调节按钮 - 优化版本 */
                    .font-size-controls {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 10000;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        background: rgba(255,255,255,0.95);
                        padding: 15px 20px;
                        border-radius: 20px;
                        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                        border: 2px solid rgba(79,172,254,0.2);
                    }
                    
                    .font-size-controls button {
                        width: 45px;
                        height: 45px;
                        border: none;
                        border-radius: 50%;
                        background: #4facfe;
                        color: white;
                        font-size: 20px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 3px 10px rgba(79,172,254,0.3);
                    }
                    
                    .font-size-controls button:hover {
                        background: #00f2fe;
                        transform: scale(1.1);
                        box-shadow: 0 5px 15px rgba(0,242,254,0.4);
                    }
                    
                    .font-size-controls button:disabled {
                        background: #ccc;
                        cursor: not-allowed;
                        box-shadow: none;
                    }
                    
                    .font-size-display {
                        font-size: 16px;
                        font-weight: bold;
                        color: #333;
                        min-width: 50px;
                        text-align: center;
                    }
                    
                    /* 控制面板优化 - 更紧凑 */
                    .control-panel {
                        background: rgba(255,255,255,0.95);
                        border-radius: 15px;
                        padding: 15px 20px;
                        margin-bottom: 15px;
                        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                        border: 1px solid rgba(79,172,254,0.2);
                    }
                    
                    /* 全屏模式下控制面板更紧凑 */
                    .practice-fullscreen .control-panel {
                        padding: 10px 15px;
                        margin-bottom: 10px;
                    }
                    
                    .practice-fullscreen .control-panel button {
                        font-size: 14px !important;
                        padding: 6px 12px !important;
                    }
                    
                    /* 进度条优化 */
                    .progress-section {
                        background: rgba(255,255,255,0.9);
                        border-radius: 15px;
                        padding: 15px 20px;
                        margin-bottom: 15px;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                    }
                    
                    /* 全屏模式下进度条更紧凑 */
                    .practice-fullscreen .progress-section {
                        padding: 10px 15px;
                        margin-bottom: 10px;
                    }
                    
                    /* 自定义滚动条样式 - 优化版本 */
                    .practice-fullscreen::-webkit-scrollbar,
                    #questionDisplay::-webkit-scrollbar,
                    #answerDisplay::-webkit-scrollbar {
                        width: 16px;
                    }
                    
                    .practice-fullscreen::-webkit-scrollbar-track,
                    #questionDisplay::-webkit-scrollbar-track,
                    #answerDisplay::-webkit-scrollbar-track {
                        background: rgba(79,172,254,0.1);
                        border-radius: 12px;
                        border: 1px solid rgba(79,172,254,0.2);
                    }
                    
                    .practice-fullscreen::-webkit-scrollbar-thumb,
                    #questionDisplay::-webkit-scrollbar-thumb,
                    #answerDisplay::-webkit-scrollbar-thumb {
                        background: linear-gradient(180deg, #4facfe, #00f2fe);
                        border-radius: 12px;
                        border: 2px solid rgba(255,255,255,0.5);
                        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    }
                    
                    .practice-fullscreen::-webkit-scrollbar-thumb:hover,
                    #questionDisplay::-webkit-scrollbar-thumb:hover,
                    #answerDisplay::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(180deg, #00f2fe, #4facfe);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        transform: scale(1.05);
                    }
                    
                    /* 滚动条按钮样式 */
                    .practice-fullscreen::-webkit-scrollbar-button,
                    #questionDisplay::-webkit-scrollbar-button,
                    #answerDisplay::-webkit-scrollbar-button {
                        background: rgba(79,172,254,0.3);
                        border-radius: 8px;
                    }
                    
                    .practice-fullscreen::-webkit-scrollbar-button:hover,
                    #questionDisplay::-webkit-scrollbar-button:hover,
                    #answerDisplay::-webkit-scrollbar-button:hover {
                        background: rgba(79,172,254,0.5);
                    }
                    
                    /* 全屏模式下底部操作区域更紧凑 */
                    .practice-fullscreen .question-card[style*="margin-top: 20px"] {
                        margin-top: 10px !important;
                        padding: 10px 15px !important;
                    }
                    
                    .practice-fullscreen .question-card[style*="margin-top: 20px"] button {
                        font-size: 14px !important;
                        padding: 8px 15px !important;
                        border-radius: 15px !important;
                    }
                    
                    /* 全屏模式下答案显示区域更大 */
                    .practice-fullscreen #answerDisplay {
                        max-height: 30vh !important;
                        font-size: 26px !important;
                        padding: 30px !important;
                        line-height: 1.8 !important;
                    }
                    
                    .practice-fullscreen #answerDisplay h5 {
                        font-size: 32px !important;
                        margin-bottom: 25px !important;
                        font-weight: bold !important;
                    }
                    
                    .practice-fullscreen #answerContent {
                        font-size: 24px !important;
                        line-height: 1.8 !important;
                        font-weight: 500 !important;
                    }
                    
                    .practice-fullscreen #explanationContent {
                        font-size: 22px !important;
                        line-height: 1.8 !important;
                        color: #555 !important;
                        margin-top: 30px !important;
                    }
                    
                    /* 响应式设计 */
                    @media (max-width: 768px) {
                        .practice-fullscreen {
                            padding: 10px;
                        }
                        
                        .control-panel {
                            flex-direction: column;
                            gap: 10px;
                        }
                        
                        .control-panel > div {
                            flex-wrap: wrap;
                            justify-content: center;
                        }
                        
                        #questionDisplay {
                            min-height: 50vh;
                            font-size: 16px;
                            padding: 20px;
                        }
                    }
                    
                    /* 动画效果 */
                    .fade-in {
                        animation: fadeIn 0.5s ease-in;
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    .slide-in {
                        animation: slideIn 0.3s ease-out;
                    }
                    
                    @keyframes slideIn {
                        from { transform: translateX(-100%); }
                        to { transform: translateX(0); }
                    }
                    
                    /* 滚动提示动画 */
                    @keyframes fadeInOut {
                        0% { opacity: 0; transform: translateY(20px); }
                        20% { opacity: 1; transform: translateY(0); }
                        80% { opacity: 1; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(-20px); }
                    }
                    
                    /* 滚动指示器动画 */
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
                        40% { transform: translateX(-50%) translateY(-10px); }
                        60% { transform: translateX(-50%) translateY(-5px); }
                    }
                    
                    #scrollIndicator {
                        animation: bounce 2s infinite;
                    }
                    
                    /* 按钮悬停效果 */
                    .btn-hover-effect {
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .btn-hover-effect:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                    }
                    
                    .btn-hover-effect::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                        transition: left 0.5s;
                    }
                    
                    .btn-hover-effect:hover::before {
                        left: 100%;
                    }
                    
                    /* 进度条动画 */
                    .progress-animation {
                        transition: width 0.5s ease-in-out;
                    }
                    
                    /* 题目卡片样式 */
                    .question-card {
                        background: rgba(255,255,255,0.95);
                        backdrop-filter: blur(20px);
                        border-radius: 25px;
                        padding: 30px;
                        margin-bottom: 25px;
                        box-shadow: 0 15px 50px rgba(0,0,0,0.1);
                        border: 1px solid rgba(255,255,255,0.2);
                        transition: all 0.3s ease;
                    }
                    
                    .question-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
                    }
                    
                    /* 选项样式优化 */
                    .option-item {
                        background: rgba(255,255,255,0.8);
                        border: 2px solid rgba(79,172,254,0.3);
                        border-radius: 15px;
                        padding: 15px 20px;
                        margin: 10px 0;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .option-item:hover {
                        background: rgba(79,172,254,0.1);
                        border-color: #4facfe;
                        transform: translateX(5px);
                    }
                    
                    .option-item.selected {
                        background: linear-gradient(135deg, #4facfe, #00f2fe);
                        color: white;
                        border-color: #4facfe;
                        box-shadow: 0 5px 15px rgba(79,172,254,0.4);
                    }
                    
                    .option-item.correct {
                        background: linear-gradient(135deg, #28a745, #20c997);
                        color: white;
                        border-color: #28a745;
                    }
                    
                    .option-item.incorrect {
                        background: linear-gradient(135deg, #dc3545, #fd7e14);
                        color: white;
                        border-color: #dc3545;
                    }
                    
                    /* 输入框样式 */
                    .answer-input {
                        width: 100%;
                        min-height: 120px;
                        padding: 20px;
                        border: 2px solid rgba(79,172,254,0.3);
                        border-radius: 15px;
                        font-size: 16px;
                        line-height: 1.6;
                        resize: vertical;
                        background: rgba(255,255,255,0.9);
                        transition: all 0.3s ease;
                    }
                    
                    .answer-input:focus {
                        outline: none;
                        border-color: #4facfe;
                        box-shadow: 0 0 20px rgba(79,172,254,0.3);
                        background: rgba(255,255,255,1);
                    }
                    
                    /* 全屏模式特殊样式 */
                    .modal-fullscreen {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        z-index: 10000 !important;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        border-radius: 0 !important;
                        margin: 0 !important;
                        padding: 20px !important;
                        box-sizing: border-box !important;
                    }
                    
                    .modal-fullscreen #questionDisplay {
                        min-height: 80vh !important;
                        max-height: 85vh !important;
                        font-size: 22px !important;
                        padding: 40px !important;
                    }
                    
                    .modal-fullscreen .control-panel {
                        padding: 10px 15px !important;
                        margin-bottom: 10px !important;
                    }
                    
                    .modal-fullscreen .progress-section {
                        padding: 10px 15px !important;
                        margin-bottom: 10px !important;
                    }
                </style>
                
                <div id="practiceContainer" class="practice-fullscreen fade-in">
                    <div class="practice-container">
                        <!-- 顶部控制面板 -->
                        <div class="control-panel">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                                <!-- 左侧：时间显示 -->
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <span id="timerDisplay" style="font-size: 18px; font-weight: bold; color: #333; background: rgba(255,255,255,0.8); padding: 8px 15px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                        <i class="fas fa-clock"></i> 时间: 00:00
                                    </span>
                                    <span id="questionTimer" style="font-size: 16px; color: #666; background: rgba(255,255,255,0.6); padding: 6px 12px; border-radius: 15px;">
                                        <i class="fas fa-stopwatch"></i> 本题: 00:00
                                    </span>
                                </div>
                                
                                <!-- 右侧：控制按钮组 -->
                                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                    <!-- 字体控制 -->
                                    <div style="display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.8); padding: 8px 15px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                        <button class="btn btn-outline-secondary btn-sm btn-hover-effect" onclick="QuestionBankPractice.changeFontSize(-1)" title="缩小字体" style="border-radius: 50%; width: 35px; height: 35px; padding: 0;">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <span id="fontSizeDisplay" style="font-weight: bold; color: #333; min-width: 40px; text-align: center;">16px</span>
                                        <button class="btn btn-outline-secondary btn-sm btn-hover-effect" onclick="QuestionBankPractice.changeFontSize(1)" title="放大字体" style="border-radius: 50%; width: 35px; height: 35px; padding: 0;">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    
                                    <!-- 阅读模式 -->
                                    <button id="readingModeBtn" class="btn btn-outline-primary btn-sm btn-hover-effect" onclick="QuestionBankPractice.toggleReadingMode()" title="开启阅读模式" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-book-open"></i> 阅读模式
                                    </button>
                                    
                                    <!-- 主题切换 -->
                                    <button id="themeBtn" class="btn btn-outline-primary btn-sm btn-hover-effect" onclick="QuestionBankPractice.toggleTheme()" title="切换主题" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-palette"></i>
                                    </button>
                                    
                                    <!-- 帮助按钮 -->
                                    <button id="helpBtn" class="btn btn-outline-info btn-sm btn-hover-effect" onclick="QuestionBankPractice.showHelp()" title="快捷键帮助" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-question-circle"></i>
                                    </button>
                                    
                                    <!-- 菜单按钮 -->
                                    <button id="menuBtn" class="btn btn-outline-secondary btn-sm btn-hover-effect" onclick="QuestionBankPractice.toggleMenu()" title="更多功能" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-bars"></i>
                                    </button>
                                    
                                    <!-- 收藏按钮 -->
                                    <button id="bookmarkBtn" class="btn btn-outline-warning btn-sm btn-hover-effect" onclick="QuestionBankPractice.toggleBookmark()" title="收藏此题" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-bookmark"></i>
                                    </button>
                                    
                                    <!-- AI助手 -->
                                    <button id="aiBtn" class="btn btn-outline-success btn-sm btn-hover-effect" onclick="QuestionBankPractice.showAIAssistant()" title="AI智能助手" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-robot"></i>
                                    </button>
                                    
                                    <!-- 学习模式 -->
                                    <button id="modeBtn" class="btn btn-outline-dark btn-sm btn-hover-effect" onclick="QuestionBankPractice.toggleLearningMode()" title="切换学习模式" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-graduation-cap"></i>
                                    </button>
                                    
                                    <!-- 智能分析 -->
                                    <button id="analysisBtn" class="btn btn-outline-primary btn-sm btn-hover-effect" onclick="QuestionBankPractice.analyzeLearningProgress()" title="学习进度分析" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-brain"></i>
                                    </button>
                                    
                                    <!-- 智能提示 -->
                                    <button id="hintBtn" class="btn btn-outline-warning btn-sm btn-hover-effect" onclick="QuestionBankPractice.showSmartHint()" title="智能提示" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-lightbulb"></i>
                                    </button>
                                    
                                    <!-- 语音朗读 -->
                                    <button id="speakBtn" class="btn btn-outline-info btn-sm btn-hover-effect" onclick="QuestionBankPractice.speakQuestion()" title="语音朗读题目" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-volume-up"></i>
                                    </button>
                                    
                                    <!-- 停止朗读 -->
                                    <button id="stopSpeakBtn" class="btn btn-outline-secondary btn-sm btn-hover-effect" onclick="QuestionBankPractice.stopSpeaking()" title="停止朗读" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-volume-mute"></i>
                                    </button>
                                    
                                    <!-- 学习进度 -->
                                    <button id="progressBtn" class="btn btn-outline-success btn-sm btn-hover-effect" onclick="QuestionBankPractice.showLearningProgress()" title="学习进度" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-chart-line"></i>
                                    </button>
                                    
                                    <!-- 错题本 -->
                                    <button id="wrongBookBtn" class="btn btn-outline-danger btn-sm btn-hover-effect" onclick="QuestionBankPractice.showWrongBook()" title="错题本" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-book"></i>
                                    </button>
                                    
                                    <!-- 学习策略 -->
                                    <button id="strategyBtn" class="btn btn-outline-info btn-sm btn-hover-effect" onclick="QuestionBankPractice.showLearningStrategy()" title="学习策略" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-cog"></i>
                                    </button>
                                    
                                    <!-- 全屏按钮 -->
                                    <button id="fullscreenBtn" class="btn btn-outline-primary btn-sm btn-hover-effect" onclick="QuestionBankPractice.toggleFullscreen()" title="全屏 (Ctrl+F)" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-expand"></i>
                                    </button>
                                    
                                    <!-- 显示答案按钮 -->
                                    <button id="showAnswerBtn" class="btn btn-outline-success btn-sm btn-hover-effect" onclick="QuestionBankPractice.toggleAnswer()" title="显示答案" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-eye"></i> 答案
                                    </button>
                                    
                                    <!-- 暂停按钮 -->
                                    <button id="pauseBtn" class="btn btn-warning btn-sm btn-hover-effect" onclick="QuestionBankPractice.togglePause()" title="暂停/继续 (空格)" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-pause"></i> 暂停
                                    </button>
                                    
                                    <!-- 退出按钮 -->
                                    <button id="exitBtn" class="btn btn-danger btn-sm btn-hover-effect" onclick="QuestionBankPractice.exitPractice()" title="退出练习 (ESC)" style="border-radius: 20px; padding: 8px 15px;">
                                        <i class="fas fa-times"></i> 退出
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 进度条和导航 -->
                        <div class="progress-section">
                            <!-- 进度滑块 -->
                            <div style="margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                    <span style="font-weight: bold; color: #333; font-size: 16px;">
                                        <i class="fas fa-tasks"></i> 练习进度
                                    </span>
                                    <span id="progressText" style="font-weight: bold; color: #4facfe; font-size: 14px;">0%</span>
                                </div>
                                <div style="background: rgba(79,172,254,0.2); border-radius: 15px; height: 12px; position: relative; overflow: hidden;">
                                    <div id="progressBar" class="progress-animation" style="background: linear-gradient(90deg, #4facfe, #00f2fe); height: 100%; border-radius: 15px; transition: width 0.3s ease; width: 0%; box-shadow: 0 2px 8px rgba(79,172,254,0.3);"></div>
                                </div>
                            </div>
                            
                            <!-- 题目导航 -->
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <span id="questionCounter" style="font-size: 16px; color: #333; font-weight: bold;">
                                        <i class="fas fa-question-circle"></i> 题目 1 / ${currentSession.questions.length}
                                    </span>
                                    <span style="color: #666; font-size: 14px;">|</span>
                                    <span style="color: #666; font-size: 14px;">
                                        <i class="fas fa-clock"></i> 剩余 ${currentSession.questions.length - 1} 题
                                    </span>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button id="prevBtn" class="btn btn-outline-primary btn-sm btn-hover-effect" onclick="QuestionBankPractice.previousQuestion()" disabled style="border-radius: 15px; padding: 8px 15px; font-size: 14px; transition: all 0.3s ease;">
                                        <i class="fas fa-chevron-left"></i> 上一题
                                    </button>
                                    <button id="nextBtn" class="btn btn-outline-primary btn-sm btn-hover-effect" onclick="QuestionBankPractice.nextQuestion()" style="border-radius: 15px; padding: 8px 15px; font-size: 14px; transition: all 0.3s ease;">
                                        下一题 <i class="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 题目显示区域 - 优化后占据更大空间 -->
                        <div id="questionDisplay" class="slide-in">
                            <!-- 题目内容将在这里动态加载 -->
                        </div>
                        
                        <!-- 答案显示区域 -->
                        <div id="answerDisplay" class="question-card" style="background: rgba(240,248,255,0.95); border: 2px solid #007bff; display: none; max-height: 35vh; overflow-y: auto;">
                            <h5 style="color: #007bff; margin-bottom: 25px; font-size: 1.6em; font-weight: bold;">
                                <i class="fas fa-lightbulb"></i> 参考答案
                            </h5>
                            <div id="answerContent" style="font-size: 20px; line-height: 1.8; font-weight: 500;"></div>
                            <div id="explanationContent" style="font-size: 18px; line-height: 1.8; margin-top: 25px; color: #555;"></div>
                        </div>
                        
                        <!-- 底部操作区域 -->
                        <div class="question-card" style="margin-top: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                    <button id="submitBtn" class="btn btn-success btn-hover-effect" onclick="QuestionBankPractice.submitAnswer()" style="border-radius: 20px; padding: 10px 20px; font-size: 16px;">
                                        <i class="fas fa-check"></i> 提交答案
                                    </button>
                                    <button id="skipBtn" class="btn btn-outline-secondary btn-hover-effect" onclick="QuestionBankPractice.skipQuestion()" style="border-radius: 20px; padding: 10px 20px; font-size: 16px;">
                                        <i class="fas fa-forward"></i> 跳过此题
                                    </button>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button id="saveBtn" class="btn btn-outline-primary btn-hover-effect" onclick="QuestionBankPractice.saveProgress()" style="border-radius: 20px; padding: 10px 20px; font-size: 16px;">
                                        <i class="fas fa-save"></i> 保存进度
                                    </button>
                                    <button id="reportBtn" class="btn btn-outline-warning btn-hover-effect" onclick="QuestionBankPractice.reportQuestion()" style="border-radius: 20px; padding: 10px 20px; font-size: 16px;">
                                        <i class="fas fa-flag"></i> 报告问题
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        // 显示当前题目
        displayCurrentQuestion: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            if (!question) return;
            
            const questionDisplay = document.getElementById('questionDisplay');
            if (!questionDisplay) return;
            
            // 记录题目开始时间
            practiceState.questionTimer = Date.now();
            
            // 生成题目HTML
            const questionHTML = this.generateQuestionHTML(question, currentSession.currentIndex);
            questionDisplay.innerHTML = questionHTML;
            
            // 恢复保存的字体大小
            this.restoreFontSize();
            
            // 内容自适应调整
            this.adjustContentLayout();
            
            // 设置触摸手势支持
            this.setupTouchGestures();
            
            // 显示滚动提示（如果需要）
            setTimeout(() => this.showScrollHint(), 1000);
            
            // 更新进度信息
            this.updateProgress();
            
            // 更新按钮状态
            this.updateButtonStates();
            
            // 如果已经答过这题，显示之前的答案
            const userAnswer = currentSession.userAnswers[currentSession.currentIndex];
            if (userAnswer !== null) {
                this.highlightAnswer(userAnswer);
            }
        },
        
        // 生成题目HTML
        generateQuestionHTML: function(question, index) {
            const questionNumber = index + 1;
            const questionType = question.type || '选择题';
            
            let optionsHTML = '';
            if (question.options && Array.isArray(question.options) && question.options.length > 0) {
                optionsHTML = question.options.map((option, optIndex) => `
                    <div class="option-item" onclick="QuestionBankPractice.selectOption(${optIndex})" 
                         style="background: white; border: 2px solid #e9ecef; border-radius: 15px; padding: 30px; margin: 20px 0; cursor: pointer; transition: all 0.3s ease; font-size: 1.5em; line-height: 2.0;"
                         data-option-index="${optIndex}">
                        <span style="display: inline-block; width: 45px; height: 45px; border-radius: 50%; background: #4facfe; color: white; text-align: center; line-height: 45px; margin-right: 30px; font-weight: bold; font-size: 1.3em;">
                            ${String.fromCharCode(65 + optIndex)}
                        </span>
                        ${option}
                    </div>
                `).join('');
            } else {
                // 没有选项时，不显示提示信息，直接显示输入框
                optionsHTML = '';
            }
            
            // 根据题型生成不同的输入方式
            let inputHTML = '';
            
            // 检查是否有选项
            const hasOptions = question.options && Array.isArray(question.options) && question.options.length > 0;
            
            if (questionType === '填空题') {
                inputHTML = `
                    <div style="margin-top: 30px; background: rgba(248,249,250,0.8); border-radius: 20px; padding: 25px;">
                        <label style="display: block; margin-bottom: 20px; font-weight: bold; color: #333; font-size: 1.2em;">📝 请输入答案：</label>
                        <input type="text" id="fillAnswer" placeholder="请输入答案..." 
                               style="width: 100%; padding: 25px; border: 2px solid #e9ecef; border-radius: 15px; font-size: 1.4em; box-sizing: border-box; transition: all 0.3s ease;"
                               onchange="QuestionBankPractice.handleFillAnswer(this.value)" onfocus="this.style.borderColor='#4facfe'" onblur="this.style.borderColor='#e9ecef'">
                    </div>
                `;
            } else if (questionType === '解答题' || questionType === '计算题') {
                inputHTML = `
                    <div style="margin-top: 30px; background: rgba(248,249,250,0.8); border-radius: 20px; padding: 25px;">
                        <label style="display: block; margin-bottom: 20px; font-weight: bold; color: #333; font-size: 1.2em;">📝 请输入详细答案：</label>
                        <textarea id="essayAnswer" placeholder="请输入详细答案..." 
                                  style="width: 100%; min-height: 200px; padding: 25px; border: 2px solid #e9ecef; border-radius: 15px; font-size: 1.4em; box-sizing: border-box; resize: vertical; transition: all 0.3s ease; line-height: 2.0;"
                                  onchange="QuestionBankPractice.handleEssayAnswer(this.value)" onfocus="this.style.borderColor='#4facfe'" onblur="this.style.borderColor='#e9ecef'"></textarea>
                    </div>
                `;
            } else if (questionType === '判断题') {
                inputHTML = `
                    <div style="margin-top: 30px; background: rgba(248,249,250,0.8); border-radius: 20px; padding: 25px; text-align: center;">
                        <label style="display: block; margin-bottom: 20px; font-weight: bold; color: #333; font-size: 1.2em;">📝 请选择答案：</label>
                        <div style="display: flex; gap: 40px; justify-content: center;">
                            <button class="judge-btn" onclick="QuestionBankPractice.selectJudgeAnswer(true)" 
                                    style="padding: 22px 50px; font-size: 1.3em; border: 2px solid #28a745; background: white; color: #28a745; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; font-weight: bold; min-width: 140px;">
                                ✓ 正确
                            </button>
                            <button class="judge-btn" onclick="QuestionBankPractice.selectJudgeAnswer(false)"
                                    style="padding: 22px 50px; font-size: 1.3em; border: 2px solid #dc3545; background: white; color: #dc3545; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; font-weight: bold; min-width: 140px;">
                                ✗ 错误
                            </button>
                        </div>
                    </div>
                `;
            } else if (questionType === '选择题' && !hasOptions) {
                // 选择题但没有选项，显示输入框
                inputHTML = `
                    <div style="margin-top: 30px; background: rgba(248,249,250,0.8); border-radius: 20px; padding: 25px;">
                        <label style="display: block; margin-bottom: 20px; font-weight: bold; color: #333; font-size: 1.2em;">📝 请输入答案：</label>
                        <input type="text" id="customAnswer" placeholder="请输入您的答案..." 
                               style="width: 100%; padding: 22px; border: 2px solid #e9ecef; border-radius: 15px; font-size: 1.2em; box-sizing: border-box; transition: all 0.3s ease;"
                               onchange="QuestionBankPractice.handleCustomAnswer(this.value)" onfocus="this.style.borderColor='#4facfe'" onblur="this.style.borderColor='#e9ecef'">
                    </div>
                `;
            } else if (questionType === '选择题' && hasOptions) {
                // 选择题有选项，添加额外的输入框
                inputHTML = `
                    <div style="margin-top: 30px; background: rgba(248,249,250,0.8); border-radius: 20px; padding: 25px;">
                        <label style="display: block; margin-bottom: 20px; font-weight: bold; color: #333; font-size: 1.2em;">💭 或者输入您的答案：</label>
                        <input type="text" id="customAnswer" placeholder="请输入您的答案（可选）..." 
                               style="width: 100%; padding: 22px; border: 2px solid #e9ecef; border-radius: 15px; font-size: 1.2em; box-sizing: border-box; transition: all 0.3s ease;"
                               onchange="QuestionBankPractice.handleCustomAnswer(this.value)" onfocus="this.style.borderColor='#4facfe'" onblur="this.style.borderColor='#e9ecef'">
                    </div>
                `;
            } else {
                // 其他题型或没有明确题型的，都显示输入框
                inputHTML = `
                    <div style="margin-top: 30px; background: rgba(248,249,250,0.8); border-radius: 20px; padding: 25px;">
                        <label style="display: block; margin-bottom: 20px; font-weight: bold; color: #333; font-size: 1.2em;">📝 请输入答案：</label>
                        <input type="text" id="customAnswer" placeholder="请输入您的答案..." 
                               style="width: 100%; padding: 22px; border: 2px solid #e9ecef; border-radius: 15px; font-size: 1.2em; box-sizing: border-box; transition: all 0.3s ease;"
                               onchange="QuestionBankPractice.handleCustomAnswer(this.value)" onfocus="this.style.borderColor='#4facfe'" onblur="this.style.borderColor='#e9ecef'">
                    </div>
                `;
            }
            
            return `
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                        <h4 style="color: #333; margin: 0; font-size: 1.4em; font-weight: bold;">题目 ${questionNumber}</h4>
                        <div style="font-size: 0.9em; color: #666;">
                            <span style="background: #4facfe; color: white; padding: 6px 15px; border-radius: 20px; margin-right: 12px; font-size: 0.9em;">
                                ${question.difficulty || '中等'}
                            </span>
                            <span style="background: #f8f9fa; color: #666; padding: 6px 15px; border-radius: 20px; margin-right: 12px; font-size: 0.9em;">
                                ${questionType}
                            </span>
                            ${question.category ? `<span style="background: #f8f9fa; color: #666; padding: 6px 15px; border-radius: 20px; font-size: 0.9em;">${question.category}</span>` : ''}
                        </div>
                    </div>
                    
                    <div style="font-size: 1.6em; line-height: 2.4; margin-bottom: 40px; color: #333; text-align: justify; font-weight: 500;">
                        ${question.question || question.title || '题目内容'}
                    </div>
                    
                    ${question.image ? `<img src="${question.image}" style="max-width: 100%; height: auto; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" alt="题目图片">` : ''}
                    
                    <div id="optionsContainer">
                        ${optionsHTML}
                    </div>
                    
                    ${inputHTML}
                </div>
            `;
        },
        
        // 选择选项
        selectOption: function(optionIndex) {
            if (!practiceState.isActive || practiceState.isPaused) return;
            
            // 清除之前的选择
            document.querySelectorAll('.option-item').forEach(item => {
                item.style.background = 'white';
                item.style.borderColor = '#e9ecef';
                item.classList.remove('selected');
            });
            
            // 高亮当前选择
            const selectedOption = document.querySelector(`[data-option-index="${optionIndex}"]`);
            if (selectedOption) {
                selectedOption.style.background = '#e3f2fd';
                selectedOption.style.borderColor = '#4facfe';
                selectedOption.classList.add('selected');
            }
            
            // 记录答案
            currentSession.userAnswers[currentSession.currentIndex] = optionIndex;
            
            // 显示通知
            showNotification(`已选择选项 ${String.fromCharCode(65 + optionIndex)}`, 'info', 1000);
        },
        
        // 高亮答案
        highlightAnswer: function(answerIndex) {
            const option = document.querySelector(`[data-option-index="${answerIndex}"]`);
            if (option) {
                option.style.background = '#e3f2fd';
                option.style.borderColor = '#4facfe';
            }
        },
        
        // 处理填空题答案
        handleFillAnswer: function(answer) {
            currentSession.userAnswers[currentSession.currentIndex] = answer.trim();
        },
        
        // 处理解答题答案
        handleEssayAnswer: function(answer) {
            currentSession.userAnswers[currentSession.currentIndex] = answer.trim();
        },
        
        // 处理自定义答案
        handleCustomAnswer: function(answer) {
            if (answer.trim()) {
                currentSession.userAnswers[currentSession.currentIndex] = answer.trim();
            }
        },
        
        // 选择判断题答案
        selectJudgeAnswer: function(answer) {
            document.querySelectorAll('.judge-btn').forEach(btn => {
                btn.style.background = 'white';
            });
            
            event.target.style.background = answer ? '#28a745' : '#dc3545';
            event.target.style.color = 'white';
            
            currentSession.userAnswers[currentSession.currentIndex] = answer;
        },
        
        // 提交答案
        submitAnswer: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            const questionType = question.type || '选择题';
            
            // 检查是否已输入答案
            let currentAnswer = currentSession.userAnswers[currentSession.currentIndex];
            
            if (questionType === '填空题') {
                const fillInput = document.getElementById('fillAnswer');
                if (fillInput && fillInput.value.trim()) {
                    currentAnswer = fillInput.value.trim();
                    currentSession.userAnswers[currentSession.currentIndex] = currentAnswer;
                }
            } else if (questionType === '解答题' || questionType === '计算题') {
                const essayInput = document.getElementById('essayAnswer');
                if (essayInput && essayInput.value.trim()) {
                    currentAnswer = essayInput.value.trim();
                    currentSession.userAnswers[currentSession.currentIndex] = currentAnswer;
                }
            } else if (questionType === '判断题') {
                // 判断题已在 selectJudgeAnswer 中设置答案
            } else if (questionType === '选择题') {
                // 检查是否已选择选项或输入自定义答案
                const customInput = document.getElementById('customAnswer');
                if (customInput && customInput.value.trim()) {
                    currentAnswer = customInput.value.trim();
                    currentSession.userAnswers[currentSession.currentIndex] = currentAnswer;
                }
                // 如果已选择选项，currentAnswer 应该已经被设置
            }
            
            if (currentAnswer === null || currentAnswer === undefined || currentAnswer === '') {
                showNotification('请先选择或输入答案', 'warning');
                return;
            }
            
            // 记录答题时间
            const questionTime = (Date.now() - practiceState.questionTimer) / 1000;
            currentSession.questionTimes[currentSession.currentIndex] = questionTime;
            
            // 显示提交成功通知
            showNotification('答案已提交', 'success');
            
            // 检查答案并显示解释
            this.checkAnswer();
        },
        
        // 检查答案
        checkAnswer: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            const userAnswer = currentSession.userAnswers[currentSession.currentIndex];
            const correctAnswer = question.correct;
            
            let isCorrect = false;
            
            // 根据题型检查答案
            switch(question.type) {
                case 'fill':
                    isCorrect = this.checkFillAnswer(userAnswer, correctAnswer);
                    break;
                case 'judge':
                    isCorrect = userAnswer === correctAnswer;
                    break;
                default: // 选择题
                    isCorrect = userAnswer === correctAnswer;
            }
            
            // 显示结果
            this.showAnswerResult(isCorrect, question);
            
            // 自动收集错题
            this.autoCollectWrongQuestions();
            
            // 如果答错了，添加到错题本
            if (!isCorrect && typeof QuestionBankUser !== 'undefined') {
                QuestionBankUser.addWrongQuestion(question, currentSession.bankId);
            }
        },
        
        // 检查填空题答案
        checkFillAnswer: function(userAnswer, correctAnswer) {
            if (!userAnswer || !correctAnswer) return false;
            
            // 如果正确答案是数组，检查是否匹配任一答案
            if (Array.isArray(correctAnswer)) {
                return correctAnswer.some(ans => 
                    userAnswer.toLowerCase().trim() === ans.toLowerCase().trim()
                );
            }
            
            return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        },
        
        // 显示答案结果
        showAnswerResult: function(isCorrect, question) {
            const explanationArea = document.getElementById('explanationArea');
            const explanationContent = document.getElementById('explanationContent');
            
            if (!explanationArea || !explanationContent) return;
            
            const resultIcon = isCorrect ? '✅' : '❌';
            const resultText = isCorrect ? '回答正确！' : '回答错误';
            const resultColor = isCorrect ? '#28a745' : '#dc3545';
            
            // 生成或获取答案
            const answer = this.generateAnswer(question);
            
            explanationContent.innerHTML = `
                <div style="color: ${resultColor}; font-weight: bold; font-size: 1.1em; margin-bottom: 15px;">
                    ${resultIcon} ${resultText}
                </div>
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <strong>📝 参考答案：</strong><br>
                    ${answer}
                </div>
                
                ${question.explanation ? `
                    <div style="margin-bottom: 15px;">
                        <strong>解释：</strong>${question.explanation}
                    </div>
                ` : ''}
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <strong>正确答案：</strong>
                    ${this.formatCorrectAnswer(question)}
                </div>
            `;
            
            explanationArea.style.display = 'block';
            
            // 禁用答题控制
            document.getElementById('submitBtn').disabled = true;
            document.getElementById('optionsContainer').style.pointerEvents = 'none';
        },
        
        // 格式化正确答案显示
        formatCorrectAnswer: function(question) {
            switch(question.type) {
                case 'fill':
                    return Array.isArray(question.correct) 
                        ? question.correct.join(' 或 ')
                        : question.correct;
                case 'judge':
                    return question.correct ? '正确' : '错误';
                default:
                    return question.options 
                        ? `${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}`
                        : question.correct;
            }
        },
        
        // 继续下一题
        continueToNext: function() {
            document.getElementById('explanationArea').style.display = 'none';
            this.nextQuestion();
        },
        
        // 跳过题目
        skipQuestion: function() {
            const questionTime = (Date.now() - practiceState.questionTimer) / 1000;
            currentSession.questionTimes[currentSession.currentIndex] = questionTime;
            this.nextQuestion();
        },
        
        // 导出结果
        exportResults: function() {
            const results = {
                sessionName: currentSession.sessionName,
                totalQuestions: currentSession.questions.length,
                completedQuestions: currentSession.currentIndex + 1,
                userAnswers: currentSession.userAnswers,
                questionTimes: currentSession.questionTimes,
                startTime: currentSession.startTime,
                endTime: new Date().toISOString(),
                accuracy: this.calculateAccuracy(),
                averageTime: this.calculateAverageTime()
            };
            
            const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `practice-results-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('练习结果已导出', 'success');
        },
        
        // 上一题
        previousQuestion: function() {
            if (currentSession.currentIndex > 0) {
                currentSession.currentIndex--;
                this.displayCurrentQuestion();
                
                // 滚动到题目顶部
                const questionDisplay = document.getElementById('questionDisplay');
                if (questionDisplay) {
                    questionDisplay.scrollTop = 0;
                }
            }
        },
        
        // 下一题
        nextQuestion: function() {
            if (currentSession.currentIndex < currentSession.questions.length - 1) {
                currentSession.currentIndex++;
                this.displayCurrentQuestion();
                
                // 滚动到题目顶部
                const questionDisplay = document.getElementById('questionDisplay');
                if (questionDisplay) {
                    questionDisplay.scrollTop = 0;
                }
            } else {
                // 练习完成
                this.completePractice();
            }
        },
        
        // 删除当前题目
        deleteCurrentQuestion: function() {
            const currentIndex = currentSession.currentIndex;
            const question = currentSession.questions[currentIndex];
            
            if (confirm(`确定要删除这道题目吗？\n\n题目：${question.title.substring(0, 100)}${question.title.length > 100 ? '...' : ''}\n\n删除后无法恢复！`)) {
                // 从题目列表中删除
                currentSession.questions.splice(currentIndex, 1);
                
                // 从用户答案中删除
                if (currentSession.userAnswers) {
                    currentSession.userAnswers.splice(currentIndex, 1);
                }
                
                // 如果删除的是最后一题，且不是第一题，则回到上一题
                if (currentIndex >= currentSession.questions.length && currentIndex > 0) {
                    currentSession.currentIndex = currentIndex - 1;
                }
                
                // 如果删除后没有题目了，结束练习
                if (currentSession.questions.length === 0) {
                    showNotification('所有题目已删除，练习结束', 'warning');
                    this.exitPractice();
                    return;
                }
                
                // 显示当前题目
                this.displayCurrentQuestion();
                this.updateProgress();
                this.updateButtonStates();
                
                showNotification(`题目已删除，剩余 ${currentSession.questions.length} 题`, 'success');
            }
        },
        
        // 显示批量删除对话框
        showBatchDeleteDialog: function() {
            const dialog = document.getElementById('batchDeleteDialog');
            if (dialog) {
                dialog.style.display = 'block';
            }
        },
        
        // 关闭批量删除对话框
        closeBatchDeleteDialog: function() {
            const dialog = document.getElementById('batchDeleteDialog');
            if (dialog) {
                dialog.style.display = 'none';
            }
        },
        
        // 预览批量删除
        previewBatchDelete: function() {
            const deleteNoOptions = document.getElementById('deleteNoOptions').checked;
            const deleteShortQuestions = document.getElementById('deleteShortQuestions').checked;
            const deleteSystemQuestions = document.getElementById('deleteSystemQuestions').checked;
            
            const toDelete = [];
            
            currentSession.questions.forEach((question, index) => {
                let shouldDelete = false;
                
                if (deleteNoOptions && (!question.options || question.options.length === 0)) {
                    shouldDelete = true;
                }
                
                if (deleteShortQuestions && question.title.length < 50) {
                    shouldDelete = true;
                }
                
                if (deleteSystemQuestions && (
                    question.title.includes('科目代码') || 
                    question.title.includes('科目名称') ||
                    question.title.includes('考试时间') ||
                    question.title.includes('试卷编号')
                )) {
                    shouldDelete = true;
                }
                
                if (shouldDelete) {
                    toDelete.push({ index, question });
                }
            });
            
            const previewDiv = document.getElementById('deletePreview');
            if (previewDiv) {
                if (toDelete.length === 0) {
                    previewDiv.innerHTML = '<p style="color: #28a745; text-align: center;">✅ 没有符合条件的题目需要删除</p>';
                } else {
                    let html = `<p style="color: #dc3545; margin-bottom: 10px;">将要删除 ${toDelete.length} 道题目：</p>`;
                    toDelete.forEach(({ index, question }) => {
                        html += `<div style="margin-bottom: 8px; padding: 8px; background: rgba(220,53,69,0.1); border-radius: 5px; font-size: 14px;">
                            <strong>第${index + 1}题：</strong>${question.title.substring(0, 80)}${question.title.length > 80 ? '...' : ''}
                        </div>`;
                    });
                    previewDiv.innerHTML = html;
                }
            }
        },
        
        // 执行批量删除
        executeBatchDelete: function() {
            const deleteNoOptions = document.getElementById('deleteNoOptions').checked;
            const deleteShortQuestions = document.getElementById('deleteShortQuestions').checked;
            const deleteSystemQuestions = document.getElementById('deleteSystemQuestions').checked;
            
            const toDelete = [];
            
            currentSession.questions.forEach((question, index) => {
                let shouldDelete = false;
                
                if (deleteNoOptions && (!question.options || question.options.length === 0)) {
                    shouldDelete = true;
                }
                
                if (deleteShortQuestions && question.title.length < 50) {
                    shouldDelete = true;
                }
                
                if (deleteSystemQuestions && (
                    question.title.includes('科目代码') || 
                    question.title.includes('科目名称') ||
                    question.title.includes('考试时间') ||
                    question.title.includes('试卷编号')
                )) {
                    shouldDelete = true;
                }
                
                if (shouldDelete) {
                    toDelete.push(index);
                }
            });
            
            if (toDelete.length === 0) {
                showNotification('没有符合条件的题目需要删除', 'info');
                this.closeBatchDeleteDialog();
                return;
            }
            
            if (confirm(`确定要删除 ${toDelete.length} 道题目吗？\n\n删除后无法恢复！`)) {
                // 从后往前删除，避免索引变化
                toDelete.reverse().forEach(index => {
                    currentSession.questions.splice(index, 1);
                    if (currentSession.userAnswers) {
                        currentSession.userAnswers.splice(index, 1);
                    }
                });
                
                // 调整当前题目索引
                if (currentSession.currentIndex >= currentSession.questions.length) {
                    currentSession.currentIndex = Math.max(0, currentSession.questions.length - 1);
                }
                
                // 如果删除后没有题目了，结束练习
                if (currentSession.questions.length === 0) {
                    showNotification('所有题目已删除，练习结束', 'warning');
                    this.closeBatchDeleteDialog();
                    this.exitPractice();
                    return;
                }
                
                // 显示当前题目
                this.displayCurrentQuestion();
                this.updateProgress();
                this.updateButtonStates();
                
                showNotification(`批量删除了 ${toDelete.length} 道题目，剩余 ${currentSession.questions.length} 题`, 'success');
                this.closeBatchDeleteDialog();
            }
        },
        
        // 显示提示
        showHint: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            if (question.hint) {
                showNotification(`💡 提示：${question.hint}`, 'info', 5000);
            } else {
                showNotification('该题目没有提示', 'info');
            }
        },
        
        // 更新进度
        updateProgress: function() {
            const progressElement = document.getElementById('questionProgress');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            const questionCounter = document.getElementById('questionCounter');
            
            if (progressElement) {
                progressElement.textContent = `${currentSession.currentIndex + 1} / ${currentSession.questions.length}`;
            }
            
            if (progressBar) {
                const progress = ((currentSession.currentIndex + 1) / currentSession.questions.length) * 100;
                progressBar.style.width = progress + '%';
            }
            
            if (progressText) {
                const progress = ((currentSession.currentIndex + 1) / currentSession.questions.length) * 100;
                progressText.textContent = Math.round(progress) + '%';
            }
            
            if (questionCounter) {
                questionCounter.textContent = `题目 ${currentSession.currentIndex + 1} / ${currentSession.questions.length}`;
            }
        },
        
        // 更新按钮状态
        updateButtonStates: function() {
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById('submitBtn');
            
            if (prevBtn) {
                prevBtn.disabled = currentSession.currentIndex === 0;
            }
            
            if (nextBtn) {
                nextBtn.textContent = currentSession.currentIndex === currentSession.questions.length - 1 
                    ? '完成练习' : '下一题 →';
            }
            
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        },
        
        // 开始计时
        startTimer: function() {
            practiceState.timer = setInterval(() => {
                if (!practiceState.isPaused) {
                    this.updateTimer();
                }
            }, 1000);
        },
        
        // 更新计时显示
        updateTimer: function() {
            const timerElement = document.getElementById('practiceTimer');
            if (!timerElement) return;
            
            const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },
        
        // 暂停/继续
        togglePause: function() {
            practiceState.isPaused = !practiceState.isPaused;
            
            const pauseBtn = document.getElementById('pauseBtn');
            if (pauseBtn) {
                pauseBtn.innerHTML = practiceState.isPaused ? '▶️ 继续' : '⏸️ 暂停';
            }
            
            const practiceContainer = document.getElementById('practiceContainer');
            if (practiceContainer) {
                practiceContainer.style.opacity = practiceState.isPaused ? '0.5' : '1';
                practiceContainer.style.pointerEvents = practiceState.isPaused ? 'none' : 'auto';
            }
            
            if (practiceState.isPaused) {
                showNotification('练习已暂停', 'info');
            } else {
                showNotification('练习已继续', 'info');
                // 重新开始当前题目计时
                practiceState.questionTimer = Date.now();
            }
        },
        
        // 完成练习
        completePractice: function() {
            practiceState.isActive = false;
            
            if (practiceState.timer) {
                clearInterval(practiceState.timer);
            }
            
            // 计算总结果
            const results = this.calculateResults();
            
            // 显示完成界面
            this.showCompletionInterface(results);
            
            // 记录学习会话
            if (typeof QuestionBankUser !== 'undefined') {
                QuestionBankUser.recordStudySession({
                    bankId: currentSession.bankId,
                    startTime: currentSession.startTime.toISOString(),
                    endTime: new Date().toISOString(),
                    questionsAnswered: results.answered,
                    correctAnswers: results.correct,
                    duration: results.totalTime
                });
            }
        },
        
        // 计算结果
        calculateResults: function() {
            const answered = currentSession.userAnswers.filter(answer => answer !== null && answer !== undefined).length;
            const correct = currentSession.userAnswers.filter((answer, index) => {
                if (answer === null || answer === undefined) return false;
                const question = currentSession.questions[index];
                
                switch(question.type) {
                    case 'fill':
                        return this.checkFillAnswer(answer, question.correct);
                    case 'judge':
                        return answer === question.correct;
                    default:
                        return answer === question.correct;
                }
            }).length;
            
            const totalTime = Math.floor((Date.now() - currentSession.startTime) / 1000);
            const averageTime = currentSession.questionTimes.length > 0 
                ? currentSession.questionTimes.reduce((sum, time) => sum + time, 0) / currentSession.questionTimes.length
                : 0;
            
            return {
                total: currentSession.questions.length,
                answered: answered,
                correct: correct,
                incorrect: answered - correct,
                unanswered: currentSession.questions.length - answered,
                accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
                totalTime: totalTime,
                averageTime: Math.round(averageTime)
            };
        },
        
        // 显示完成界面
        showCompletionInterface: function(results) {
            const finalStats = document.getElementById('finalStats');
            const completionArea = document.getElementById('completionArea');
            const questionDisplay = document.getElementById('questionDisplay');
            const answerControls = document.getElementById('answerControls');
            
            if (finalStats) {
                finalStats.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; text-align: center;">
                        <div>
                            <div style="font-size: 2em; font-weight: bold; color: #4facfe;">${results.total}</div>
                            <div style="font-size: 0.9em; color: #666;">总题数</div>
                        </div>
                        <div>
                            <div style="font-size: 2em; font-weight: bold; color: #28a745;">${results.correct}</div>
                            <div style="font-size: 0.9em; color: #666;">答对</div>
                        </div>
                        <div>
                            <div style="font-size: 2em; font-weight: bold; color: #dc3545;">${results.incorrect}</div>
                            <div style="font-size: 0.9em; color: #666;">答错</div>
                        </div>
                        <div>
                            <div style="font-size: 2em; font-weight: bold; color: #ffc107;">${results.unanswered}</div>
                            <div style="font-size: 0.9em; color: #666;">未答</div>
                        </div>
                        <div>
                            <div style="font-size: 2em; font-weight: bold; color: #17a2b8;">${results.accuracy}%</div>
                            <div style="font-size: 0.9em; color: #666;">正确率</div>
                        </div>
                        <div>
                            <div style="font-size: 2em; font-weight: bold; color: #6f42c1;">${Math.floor(results.totalTime / 60)}m</div>
                            <div style="font-size: 0.9em; color: #666;">总用时</div>
                        </div>
                    </div>
                `;
            }
            
            if (questionDisplay) questionDisplay.style.display = 'none';
            if (answerControls) answerControls.style.display = 'none';
            if (completionArea) completionArea.style.display = 'block';
        },
        
        // 查看答案
        reviewAnswers: function() {
            const content = this.generateReviewHTML();
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '答案回顾',
                    content: content,
                    size: 'large'
                });
            }
        },
        
        // 生成回顾HTML
        generateReviewHTML: function() {
            return `
                <div style="max-height: 500px; overflow-y: auto;">
                    ${currentSession.questions.map((question, index) => {
                        const userAnswer = currentSession.userAnswers[index];
                        const isCorrect = this.isAnswerCorrect(question, userAnswer);
                        const statusIcon = userAnswer === null ? '⏭️' : (isCorrect ? '✅' : '❌');
                        const statusColor = userAnswer === null ? '#ffc107' : (isCorrect ? '#28a745' : '#dc3545');
                        
                        return `
                            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                                    <h6 style="margin: 0; color: #333;">题目 ${index + 1}</h6>
                                    <span style="color: ${statusColor}; font-weight: bold;">${statusIcon}</span>
                                </div>
                                <div style="margin-bottom: 10px; color: #666;">
                                    ${question.question || question.title || '题目内容'}
                                </div>
                                <div style="font-size: 0.9em;">
                                    <div><strong>您的答案：</strong>${this.formatUserAnswer(question, userAnswer)}</div>
                                    <div><strong>正确答案：</strong>${this.formatCorrectAnswer(question)}</div>
                                    ${question.explanation ? `<div style="margin-top: 8px; color: #666;"><strong>解释：</strong>${question.explanation}</div>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        },
        
        // 格式化用户答案
        formatUserAnswer: function(question, userAnswer) {
            if (userAnswer === null || userAnswer === undefined) {
                return '<span style="color: #ffc107;">未作答</span>';
            }
            
            switch(question.type) {
                case 'judge':
                    return userAnswer ? '正确' : '错误';
                case 'fill':
                    return userAnswer;
                default:
                    return question.options 
                        ? `${String.fromCharCode(65 + userAnswer)}. ${question.options[userAnswer]}`
                        : userAnswer;
            }
        },
        
        // 判断答案是否正确
        isAnswerCorrect: function(question, userAnswer) {
            if (userAnswer === null || userAnswer === undefined) return false;
            
            switch(question.type) {
                case 'fill':
                    return this.checkFillAnswer(userAnswer, question.correct);
                case 'judge':
                    return userAnswer === question.correct;
                default:
                    return userAnswer === question.correct;
            }
        },
        
        // 再次练习
        practiceAgain: function() {
            this.initSession({
                questions: [...currentSession.questions],
                bankId: currentSession.bankId,
                sessionName: currentSession.sessionName
            });
            
            // 重新显示练习界面
            const completionArea = document.getElementById('completionArea');
            const questionDisplay = document.getElementById('questionDisplay');
            const answerControls = document.getElementById('answerControls');
            
            if (completionArea) completionArea.style.display = 'none';
            if (questionDisplay) questionDisplay.style.display = 'block';
            if (answerControls) answerControls.style.display = 'flex';
            
            this.displayCurrentQuestion();
            this.startTimer();
        },
        
        // 保存结果
        saveResults: function() {
            const results = this.calculateResults();
            const exportData = {
                sessionName: currentSession.sessionName,
                bankId: currentSession.bankId,
                startTime: currentSession.startTime.toISOString(),
                endTime: new Date().toISOString(),
                results: results,
                answers: currentSession.userAnswers,
                questions: currentSession.questions.map(q => ({
                    question: q.question || q.title,
                    correct: q.correct,
                    explanation: q.explanation
                }))
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
                type: 'application/json' 
            });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `practice-results-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('练习结果已保存', 'success');
        },
        
        // 退出练习
        exitPractice: function() {
            if (practiceState.isActive) {
                if (typeof QuestionBankUI !== 'undefined') {
                    QuestionBankUI.confirm('确定要退出当前练习吗？进度将不会保存。', '确认退出')
                        .then(confirmed => {
                            if (confirmed) {
                                this.cleanup();
                            }
                        });
                } else {
                    this.cleanup();
                }
            } else {
                this.cleanup();
            }
        },
        
        // 清理资源
        cleanup: function() {
            practiceState.isActive = false;
            practiceState.isPaused = false;
            
            if (practiceState.timer) {
                clearInterval(practiceState.timer);
                practiceState.timer = null;
            }
            
            // 关闭模态框或清空容器
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.closeAllModals();
            } else {
                const container = document.getElementById('questionBanksList');
                if (container) {
                    container.innerHTML = '<div style="text-align: center; padding: 40px; color: white;">练习已结束</div>';
                }
            }
            
            showNotification('练习已退出', 'info');
        },
        
        // 工具方法：数组洗牌
        shuffleArray: function(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        
        // 获取当前练习状态
        getPracticeState: function() {
            return {
                isActive: practiceState.isActive,
                isPaused: practiceState.isPaused,
                currentIndex: currentSession.currentIndex,
                totalQuestions: currentSession.questions.length,
                sessionName: currentSession.sessionName
            };
        },
        
        // 字体大小控制
        changeFontSize: function(delta) {
            const questionDisplay = document.getElementById('questionDisplay');
            const answerDisplay = document.getElementById('answerDisplay');
            
            if (questionDisplay) {
                const currentSize = parseInt(window.getComputedStyle(questionDisplay).fontSize);
                const newSize = Math.max(16, Math.min(32, currentSize + delta));
                questionDisplay.style.fontSize = newSize + 'px';
                if (answerDisplay) answerDisplay.style.fontSize = newSize + 'px';
                
                // 同时调整选项和输入框的字体大小
                const optionItems = questionDisplay.querySelectorAll('.option-item');
                optionItems.forEach(item => {
                    item.style.fontSize = (newSize - 2) + 'px';
                });
                
                const inputs = questionDisplay.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.style.fontSize = (newSize - 2) + 'px';
                });
                
                showNotification(`字体大小已调整为 ${newSize}px`, 'info');
            }
        },
        
        // 全屏控制 - 模态窗口全屏版本
        toggleFullscreen: function() {
            const modalContainer = document.querySelector('.modal-content') || document.querySelector('.practice-modal');
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            
            if (!modalContainer) {
                console.error('找不到模态窗口容器');
                return;
            }
            
            try {
                if (!document.fullscreenElement) {
                    // 进入全屏 - 针对模态窗口
                    if (modalContainer.requestFullscreen) {
                        modalContainer.requestFullscreen();
                    } else if (modalContainer.webkitRequestFullscreen) {
                        modalContainer.webkitRequestFullscreen();
                    } else if (modalContainer.msRequestFullscreen) {
                        modalContainer.msRequestFullscreen();
                    } else if (modalContainer.mozRequestFullScreen) {
                        modalContainer.mozRequestFullScreen();
                    } else {
                        showNotification('您的浏览器不支持全屏功能', 'warning');
                        return;
                    }
                    
                    practiceState.isFullscreen = true;
                    
                    if (fullscreenBtn) {
                        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                        fullscreenBtn.title = '退出全屏 (ESC)';
                        fullscreenBtn.className = 'btn btn-primary btn-sm btn-hover-effect';
                    }
                    
                    // 添加模态窗口全屏样式
                    modalContainer.classList.add('modal-fullscreen');
                    
                    // 添加字体大小调节控件
                    this.addFontSizeControls();
                    
                    showNotification('已进入全屏模式', 'success');
                } else {
                    // 退出全屏
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    }
                    
                    practiceState.isFullscreen = false;
                    
                    if (fullscreenBtn) {
                        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                        fullscreenBtn.title = '全屏 (Ctrl+F)';
                        fullscreenBtn.className = 'btn btn-outline-primary btn-sm btn-hover-effect';
                    }
                    
                    // 移除模态窗口全屏样式
                    modalContainer.classList.remove('modal-fullscreen');
                    
                    // 移除字体大小调节控件
                    this.removeFontSizeControls();
                    
                    showNotification('已退出全屏模式', 'info');
                }
            } catch (error) {
                console.error('全屏切换失败:', error);
                showNotification('全屏切换失败，请重试', 'error');
            }
        },
        
        // 添加字体大小调节控件
        addFontSizeControls: function() {
            // 移除已存在的控件
            this.removeFontSizeControls();
            
            const controls = document.createElement('div');
            controls.className = 'font-size-controls';
            controls.innerHTML = `
                <button onclick="QuestionBankPractice.changeFontSize(-2)" title="减小字体">A-</button>
                <button onclick="QuestionBankPractice.changeFontSize(2)" title="增大字体">A+</button>
                <button onclick="QuestionBankPractice.resetFontSize()" title="重置字体">A</button>
            `;
            
            document.body.appendChild(controls);
        },
        
        // 移除字体大小调节控件
        removeFontSizeControls: function() {
            const existingControls = document.querySelector('.font-size-controls');
            if (existingControls) {
                existingControls.remove();
            }
        },
        
        // 重置字体大小
        resetFontSize: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            const answerDisplay = document.getElementById('answerDisplay');
            
            if (questionDisplay) {
                questionDisplay.style.fontSize = '';
                if (answerDisplay) answerDisplay.style.fontSize = '';
                
                // 重置选项和输入框的字体大小
                const optionItems = questionDisplay.querySelectorAll('.option-item');
                optionItems.forEach(item => {
                    item.style.fontSize = '';
                });
                
                const inputs = questionDisplay.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.style.fontSize = '';
                });
                
                showNotification('字体大小已重置为默认值', 'info');
            }
        },
        
        // 设置全屏监听器
        setupFullscreenListener: function() {
            document.addEventListener('fullscreenchange', () => {
                const fullscreenBtn = document.getElementById('fullscreenBtn');
                const container = document.getElementById('practiceContainer');
                
                if (fullscreenBtn) {
                    if (document.fullscreenElement) {
                        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                        fullscreenBtn.title = '退出全屏 (ESC)';
                        fullscreenBtn.className = 'btn btn-primary btn-sm btn-hover-effect';
                        practiceState.isFullscreen = true;
                        
                        if (container) {
                            container.classList.add('practice-fullscreen');
                        }
                        
                        // 添加字体大小调节控件
                        this.addFontSizeControls();
                    } else {
                        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                        fullscreenBtn.title = '全屏 (Ctrl+F)';
                        fullscreenBtn.className = 'btn btn-outline-primary btn-sm btn-hover-effect';
                        practiceState.isFullscreen = false;
                        
                        if (container) {
                            container.classList.remove('practice-fullscreen');
                        }
                        
                        // 移除字体大小调节控件
                        this.removeFontSizeControls();
                    }
                }
            });
            
            // 监听全屏错误
            document.addEventListener('fullscreenerror', (e) => {
                console.error('全屏错误:', e);
                showNotification('全屏功能出现错误', 'error');
            });
        },
        
        // 显示/隐藏答案
        toggleAnswer: function() {
            const answerDisplay = document.getElementById('answerDisplay');
            const showAnswerBtn = document.getElementById('showAnswerBtn');
            const currentQuestion = currentSession.questions[currentSession.currentIndex];
            
            if (!answerDisplay || !currentQuestion) return;
            
            if (answerDisplay.style.display === 'none') {
                // 显示答案
                const answerContent = document.getElementById('answerContent');
                const explanationContent = document.getElementById('explanationContent');
                
                if (answerContent) {
                    answerContent.innerHTML = `
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin-bottom: 10px;">
                            <strong>📝 答案:</strong><br>
                            ${currentQuestion.answer || '暂无答案'}
                        </div>
                    `;
                }
                
                if (explanationContent) {
                    explanationContent.innerHTML = `
                        <div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 5px; padding: 15px;">
                            <strong>💡 解释:</strong><br>
                            ${currentQuestion.explanation || '暂无解释'}
                        </div>
                    `;
                }
                
                answerDisplay.style.display = 'block';
                if (showAnswerBtn) {
                    showAnswerBtn.innerHTML = '<i class="fas fa-eye-slash"></i> 隐藏';
                    showAnswerBtn.className = 'btn btn-outline-warning btn-sm';
                }
            } else {
                // 隐藏答案
                answerDisplay.style.display = 'none';
                if (showAnswerBtn) {
                    showAnswerBtn.innerHTML = '<i class="fas fa-eye"></i> 答案';
                    showAnswerBtn.className = 'btn btn-outline-success btn-sm';
                }
            }
        },
        
        // 字体大小控制功能
        changeFontSize: function(delta) {
            const questionDisplay = document.getElementById('questionDisplay');
            const fontSizeDisplay = document.getElementById('fontSizeDisplay');
            
            if (!questionDisplay || !fontSizeDisplay) return;
            
            // 获取当前字体大小
            let currentSize = parseInt(fontSizeDisplay.textContent) || 22;
            
            // 计算新字体大小
            let newSize = currentSize + (delta * 2);
            
            // 限制字体大小范围
            newSize = Math.max(16, Math.min(48, newSize));
            
            // 更新显示
            fontSizeDisplay.textContent = newSize + 'px';
            
            // 应用字体大小到题目显示区域
            questionDisplay.style.fontSize = newSize + 'px';
            
            // 同时调整行高
            const lineHeight = Math.max(1.6, newSize / 16);
            questionDisplay.style.lineHeight = lineHeight;
            
            // 保存到本地存储
            localStorage.setItem('questionBankFontSize', newSize);
            
            // 显示通知
            showNotification(`字体大小已调整为 ${newSize}px`, 'info', 1500);
        },
        
        // 重置字体大小
        resetFontSize: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            const fontSizeDisplay = document.getElementById('fontSizeDisplay');
            
            if (!questionDisplay || !fontSizeDisplay) return;
            
            const defaultSize = 22;
            fontSizeDisplay.textContent = defaultSize + 'px';
            questionDisplay.style.fontSize = defaultSize + 'px';
            questionDisplay.style.lineHeight = '2.0';
            
            localStorage.setItem('questionBankFontSize', defaultSize);
            showNotification('字体大小已重置为默认值', 'info', 1500);
        },
        
        // 恢复保存的字体大小
        restoreFontSize: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            const fontSizeDisplay = document.getElementById('fontSizeDisplay');
            
            if (!questionDisplay || !fontSizeDisplay) return;
            
            // 从本地存储获取保存的字体大小
            const savedSize = localStorage.getItem('questionBankFontSize');
            const fontSize = savedSize ? parseInt(savedSize) : 22;
            
            // 应用字体大小
            fontSizeDisplay.textContent = fontSize + 'px';
            questionDisplay.style.fontSize = fontSize + 'px';
            
            // 调整行高
            const lineHeight = Math.max(1.6, fontSize / 16);
            questionDisplay.style.lineHeight = lineHeight;
        },
        
        // 键盘快捷键增强
        bindEnhancedEvents: function() {
            document.addEventListener('keydown', (e) => {
                if (!practiceState.isActive) return;
                
                // 防止在输入框中触发快捷键
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                switch(e.key) {
                    case '=':
                    case '+':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            this.changeFontSize(1);
                        }
                        break;
                    case '-':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            this.changeFontSize(-1);
                        }
                        break;
                    case '0':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            this.resetFontSize();
                        }
                        break;
                    case 'F11':
                        e.preventDefault();
                        this.toggleFullscreen();
                        break;
                    case 'a':
                    case 'A':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            this.toggleAnswer();
                        }
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousQuestion();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextQuestion();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.submitAnswer();
                        break;
                    case 't':
                    case 'T':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                    case 'r':
                    case 'R':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            this.toggleReadingMode();
                        }
                        break;
                    case 'd':
                    case 'D':
                        e.preventDefault();
                        this.deleteCurrentQuestion();
                        break;
                    case 'h':
                    case 'H':
                        e.preventDefault();
                        this.showSmartHint();
                        break;
                    case 's':
                    case 'S':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            this.speakQuestion();
                        }
                        break;
                    case 'm':
                    case 'M':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            this.stopSpeaking();
                        }
                        break;
                    case 's':
                    case 'S':
                        e.preventDefault();
                        this.skipQuestion();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        this.exitPractice();
                        break;
                    case 'p':
                    case 'P':
                        e.preventDefault();
                        this.togglePause();
                        break;
                    case 'r':
                    case 'R':
                        e.preventDefault();
                        this.practiceAgain();
                        break;
                    case '?':
                        e.preventDefault();
                        this.showKeyboardHelp();
                        break;
                    case 'n':
                    case 'N':
                        e.preventDefault();
                        this.toggleNotePanel();
                        break;
                    case 'i':
                    case 'I':
                        e.preventDefault();
                        this.showAIHint();
                        break;
                    case 'm':
                    case 'M':
                        e.preventDefault();
                        this.toggleLearningMode();
                        break;
                    case 'a':
                    case 'A':
                        e.preventDefault();
                        this.showAnalysis();
                        break;
                    case 'p':
                    case 'P':
                        e.preventDefault();
                        this.showLearningProgress();
                        break;
                    case 'w':
                    case 'W':
                        e.preventDefault();
                        this.showWrongBook();
                        break;
                    case 's':
                    case 'S':
                        e.preventDefault();
                        this.showLearningStrategy();
                        break;
                }
            });
            
            // 全屏状态变化监听
            document.addEventListener('fullscreenchange', () => {
                const fullscreenBtn = document.getElementById('fullscreenBtn');
                if (fullscreenBtn) {
                    if (document.fullscreenElement) {
                        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                        fullscreenBtn.title = '退出全屏';
                    } else {
                        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                        fullscreenBtn.title = '全屏';
                    }
                }
            });
        },
        
        // 重置字体大小
        resetFontSize: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            const answerDisplay = document.getElementById('answerDisplay');
            const fontSizeDisplay = document.getElementById('fontSizeDisplay');
            
            if (questionDisplay) {
                questionDisplay.style.fontSize = '16px';
                if (answerDisplay) answerDisplay.style.fontSize = '16px';
                if (fontSizeDisplay) fontSizeDisplay.textContent = '16px';
            }
        },
        
        // 切换主题
        toggleTheme: function() {
            const container = document.getElementById('practiceContainer');
            const themeBtn = document.getElementById('themeBtn');
            
            if (!container) return;
            
            const currentTheme = container.getAttribute('data-theme') || 'default';
            const newTheme = currentTheme === 'default' ? 'dark' : 'default';
            
            container.setAttribute('data-theme', newTheme);
            
            if (themeBtn) {
                if (newTheme === 'dark') {
                    themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
                    themeBtn.title = '切换到浅色主题';
                    container.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
                } else {
                    themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
                    themeBtn.title = '切换到深色主题';
                    container.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
            }
            
            showNotification(`已切换到${newTheme === 'dark' ? '深色' : '浅色'}主题`, 'success');
        },
        
        // 显示帮助
        showHelp: function() {
            const helpContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; max-width: 600px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">
                        <i class="fas fa-question-circle"></i> 快捷键帮助
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div style="background: rgba(79,172,254,0.1); padding: 15px; border-radius: 10px;">
                            <strong>导航控制</strong><br>
                            ← → 上一题/下一题<br>
                            空格 暂停/继续<br>
                            ESC 退出练习
                        </div>
                        <div style="background: rgba(79,172,254,0.1); padding: 15px; border-radius: 10px;">
                            <strong>答题控制</strong><br>
                            1-4 选择选项<br>
                            Enter 提交答案<br>
                            Ctrl+F 全屏切换
                        </div>
                        <div style="background: rgba(79,172,254,0.1); padding: 15px; border-radius: 10px;">
                            <strong>字体控制</strong><br>
                            Ctrl + + 放大字体<br>
                            Ctrl + - 缩小字体<br>
                            Ctrl + 0 重置字体
                        </div>
                        <div style="background: rgba(79,172,254,0.1); padding: 15px; border-radius: 10px;">
                            <strong>其他功能</strong><br>
                            A 显示答案<br>
                            P 学习进度<br>
                            W 错题本<br>
                            S 学习策略
                        </div>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '快捷键帮助',
                    content: helpContent,
                    size: 'medium'
                });
            } else {
                alert('快捷键帮助：\n\n导航：← → 上一题/下一题\n暂停：空格\n退出：ESC\n答题：1-4选择，Enter提交\n全屏：Ctrl+F\n字体：Ctrl +/- 调整');
            }
        },
        
        // 切换菜单
        toggleMenu: function() {
            const menuContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">
                        <i class="fas fa-bars"></i> 更多功能
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <button class="btn btn-outline-primary btn-hover-effect" onclick="QuestionBankPractice.showAnalysis()" style="border-radius: 15px; padding: 15px; text-align: left;">
                            <i class="fas fa-brain"></i><br><strong>智能分析</strong><br><small>AI分析答题情况</small>
                        </button>
                        <button class="btn btn-outline-success btn-hover-effect" onclick="QuestionBankPractice.showLearningProgress()" style="border-radius: 15px; padding: 15px; text-align: left;">
                            <i class="fas fa-chart-line"></i><br><strong>学习进度</strong><br><small>查看学习统计</small>
                        </button>
                        <button class="btn btn-outline-danger btn-hover-effect" onclick="QuestionBankPractice.showWrongBook()" style="border-radius: 15px; padding: 15px; text-align: left;">
                            <i class="fas fa-book"></i><br><strong>错题本</strong><br><small>管理错题记录</small>
                        </button>
                        <button class="btn btn-outline-info btn-hover-effect" onclick="QuestionBankPractice.showLearningStrategy()" style="border-radius: 15px; padding: 15px; text-align: left;">
                            <i class="fas fa-cog"></i><br><strong>学习策略</strong><br><small>个性化学习建议</small>
                        </button>
                        <button class="btn btn-outline-warning btn-hover-effect" onclick="QuestionBankPractice.saveProgress()" style="border-radius: 15px; padding: 15px; text-align: left;">
                            <i class="fas fa-save"></i><br><strong>保存进度</strong><br><small>保存当前练习状态</small>
                        </button>
                        <button class="btn btn-outline-secondary btn-hover-effect" onclick="QuestionBankPractice.exportResults()" style="border-radius: 15px; padding: 15px; text-align: left;">
                            <i class="fas fa-download"></i><br><strong>导出结果</strong><br><small>下载练习报告</small>
                        </button>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '更多功能',
                    content: menuContent,
                    size: 'large'
                });
            }
        },
        
        // 切换收藏
        toggleBookmark: function() {
            const currentQuestion = currentSession.questions[currentSession.currentIndex];
            if (!currentQuestion) return;
            
            const bookmarkBtn = document.getElementById('bookmarkBtn');
            const isBookmarked = currentQuestion.bookmarked || false;
            
            currentQuestion.bookmarked = !isBookmarked;
            
            if (bookmarkBtn) {
                if (currentQuestion.bookmarked) {
                    bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
                    bookmarkBtn.className = 'btn btn-warning btn-sm btn-hover-effect';
                    bookmarkBtn.title = '取消收藏';
                    showNotification('已添加到收藏', 'success');
                } else {
                    bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
                    bookmarkBtn.className = 'btn btn-outline-warning btn-sm btn-hover-effect';
                    bookmarkBtn.title = '收藏此题';
                    showNotification('已取消收藏', 'info');
                }
            }
        },
        
        // 显示AI助手
        showAIAssistant: function() {
            const currentQuestion = currentSession.questions[currentSession.currentIndex];
            if (!currentQuestion) return;
            
            const aiContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">
                        <i class="fas fa-robot"></i> AI智能助手
                    </h4>
                    <div style="background: rgba(79,172,254,0.1); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                        <h5 style="color: #4facfe; margin-bottom: 15px;">当前题目分析</h5>
                        <p style="color: #666; line-height: 1.6;">
                            题目类型：${currentQuestion.type || '未知'}<br>
                            难度等级：${currentQuestion.difficulty || '未知'}<br>
                            知识点：${currentQuestion.knowledge || '未知'}
                        </p>
                    </div>
                    <div style="background: rgba(40,167,69,0.1); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                        <h5 style="color: #28a745; margin-bottom: 15px;">学习建议</h5>
                        <p style="color: #666; line-height: 1.6;">
                            • 仔细阅读题目要求<br>
                            • 注意关键词和条件<br>
                            • 检查计算过程<br>
                            • 验证答案合理性
                        </p>
                    </div>
                    <div style="background: rgba(255,193,7,0.1); border-radius: 15px; padding: 20px;">
                        <h5 style="color: #ffc107; margin-bottom: 15px;">解题技巧</h5>
                        <p style="color: #666; line-height: 1.6;">
                            • 先理解题目核心概念<br>
                            • 列出已知条件和求解目标<br>
                            • 选择合适的解题方法<br>
                            • 逐步推导，避免跳跃
                        </p>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: 'AI智能助手',
                    content: aiContent,
                    size: 'medium'
                });
            }
        },
        
        // 切换学习模式
        toggleLearningMode: function() {
            const modeBtn = document.getElementById('modeBtn');
            const currentMode = practiceState.learningMode || 'practice';
            const newMode = currentMode === 'practice' ? 'study' : 'practice';
            
            practiceState.learningMode = newMode;
            
            if (modeBtn) {
                if (newMode === 'study') {
                    modeBtn.innerHTML = '<i class="fas fa-graduation-cap"></i>';
                    modeBtn.title = '切换到练习模式';
                    modeBtn.className = 'btn btn-dark btn-sm btn-hover-effect';
                    showNotification('已切换到学习模式', 'success');
                } else {
                    modeBtn.innerHTML = '<i class="fas fa-play"></i>';
                    modeBtn.title = '切换到学习模式';
                    modeBtn.className = 'btn btn-outline-dark btn-sm btn-hover-effect';
                    showNotification('已切换到练习模式', 'success');
                }
            }
        },
        
        // 显示智能分析
        showAnalysis: function() {
            const analysisContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">
                        <i class="fas fa-brain"></i> 智能分析报告
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                        <div style="background: rgba(79,172,254,0.1); border-radius: 15px; padding: 20px;">
                            <h5 style="color: #4facfe; margin-bottom: 15px;">答题统计</h5>
                            <p style="color: #666; line-height: 1.6;">
                                已完成：${currentSession.currentIndex + 1} / ${currentSession.questions.length}<br>
                                正确率：${this.calculateAccuracy()}%<br>
                                平均用时：${this.calculateAverageTime()}秒
                            </p>
                        </div>
                        <div style="background: rgba(40,167,69,0.1); border-radius: 15px; padding: 20px;">
                            <h5 style="color: #28a745; margin-bottom: 15px;">学习建议</h5>
                            <p style="color: #666; line-height: 1.6;">
                                • 重点关注错题<br>
                                • 加强薄弱知识点<br>
                                • 提高答题速度<br>
                                • 定期复习巩固
                            </p>
                        </div>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '智能分析',
                    content: analysisContent,
                    size: 'medium'
                });
            }
        },
        
        // 显示学习进度
        showLearningProgress: function() {
            const progressContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">
                        <i class="fas fa-chart-line"></i> 学习进度
                    </h4>
                    <div style="background: rgba(79,172,254,0.1); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                        <h5 style="color: #4facfe; margin-bottom: 15px;">当前进度</h5>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span>完成进度</span>
                            <span>${Math.round((currentSession.currentIndex + 1) / currentSession.questions.length * 100)}%</span>
                        </div>
                        <div style="background: rgba(79,172,254,0.2); border-radius: 10px; height: 10px;">
                            <div style="background: linear-gradient(90deg, #4facfe, #00f2fe); height: 100%; border-radius: 10px; width: ${(currentSession.currentIndex + 1) / currentSession.questions.length * 100}%;"></div>
                        </div>
                    </div>
                    <div style="background: rgba(40,167,69,0.1); border-radius: 15px; padding: 20px;">
                        <h5 style="color: #28a745; margin-bottom: 15px;">学习统计</h5>
                        <p style="color: #666; line-height: 1.6;">
                            总题目数：${currentSession.questions.length}<br>
                            已完成：${currentSession.currentIndex + 1}<br>
                            剩余：${currentSession.questions.length - currentSession.currentIndex - 1}<br>
                            预计完成时间：${this.estimateCompletionTime()}
                        </p>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '学习进度',
                    content: progressContent,
                    size: 'medium'
                });
            }
        },
        
        // 显示错题本
        showWrongBook: function() {
            const wrongQuestions = currentSession.questions.filter(q => q.answered && !q.correct);
            
            const wrongBookContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">
                        <i class="fas fa-book"></i> 错题本
                    </h4>
                    <div style="background: rgba(220,53,69,0.1); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                        <h5 style="color: #dc3545; margin-bottom: 15px;">错题统计</h5>
                        <p style="color: #666; line-height: 1.6;">
                            错题数量：${wrongQuestions.length}<br>
                            错题率：${wrongQuestions.length > 0 ? Math.round(wrongQuestions.length / (currentSession.currentIndex + 1) * 100) : 0}%<br>
                            需要重点复习的题目
                        </p>
                    </div>
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${wrongQuestions.length > 0 ? 
                            wrongQuestions.map((q, index) => `
                                <div style="background: rgba(255,255,255,0.8); border-radius: 10px; padding: 15px; margin-bottom: 10px; border-left: 4px solid #dc3545;">
                                    <strong>错题 ${index + 1}</strong><br>
                                    <small style="color: #666;">${q.question ? q.question.substring(0, 100) + '...' : '题目内容'}</small>
                                </div>
                            `).join('') : 
                            '<p style="text-align: center; color: #666;">暂无错题记录</p>'
                        }
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '错题本',
                    content: wrongBookContent,
                    size: 'medium'
                });
            }
        },
        
        // 显示学习策略
        showLearningStrategy: function() {
            const strategyContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">
                        <i class="fas fa-cog"></i> 学习策略建议
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                        <div style="background: rgba(79,172,254,0.1); border-radius: 15px; padding: 20px;">
                            <h5 style="color: #4facfe; margin-bottom: 15px;">时间管理</h5>
                            <p style="color: #666; line-height: 1.6;">
                                • 合理分配答题时间<br>
                                • 先易后难，循序渐进<br>
                                • 定期休息，保持专注<br>
                                • 设置学习目标
                            </p>
                        </div>
                        <div style="background: rgba(40,167,69,0.1); border-radius: 15px; padding: 20px;">
                            <h5 style="color: #28a745; margin-bottom: 15px;">学习方法</h5>
                            <p style="color: #666; line-height: 1.6;">
                                • 理解概念，不要死记硬背<br>
                                • 多做练习，巩固知识点<br>
                                • 总结错题，查漏补缺<br>
                                • 定期复习，温故知新
                            </p>
                        </div>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '学习策略',
                    content: strategyContent,
                    size: 'medium'
                });
            }
        },
        
        // 保存进度
        saveProgress: function() {
            const progressData = {
                sessionName: currentSession.sessionName,
                currentIndex: currentSession.currentIndex,
                userAnswers: currentSession.userAnswers,
                startTime: currentSession.startTime,
                questionTimes: currentSession.questionTimes,
                bankId: currentSession.bankId,
                timestamp: new Date().toISOString()
            };
            
            try {
                localStorage.setItem('questionBankProgress', JSON.stringify(progressData));
                showNotification('进度已保存', 'success');
            } catch (error) {
                console.error('保存进度失败:', error);
                showNotification('保存进度失败', 'error');
            }
        },
        
        // 报告问题
        reportQuestion: function() {
            const currentQuestion = currentSession.questions[currentSession.currentIndex];
            if (!currentQuestion) return;
            
            const reportContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">
                        <i class="fas fa-flag"></i> 报告问题
                    </h4>
                    <div style="background: rgba(255,193,7,0.1); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                        <h5 style="color: #ffc107; margin-bottom: 15px;">当前题目</h5>
                        <p style="color: #666; line-height: 1.6;">
                            ${currentQuestion.question ? currentQuestion.question.substring(0, 200) + '...' : '题目内容'}
                        </p>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 10px; color: #333; font-weight: bold;">问题类型：</label>
                        <select id="reportType" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 10px;">
                            <option value="error">题目错误</option>
                            <option value="unclear">题目不清晰</option>
                            <option value="duplicate">重复题目</option>
                            <option value="other">其他问题</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 10px; color: #333; font-weight: bold;">详细描述：</label>
                        <textarea id="reportDescription" placeholder="请详细描述您遇到的问题..." style="width: 100%; height: 120px; padding: 15px; border: 2px solid #ddd; border-radius: 10px; resize: vertical;"></textarea>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="btn btn-warning btn-hover-effect" onclick="QuestionBankPractice.submitReport()" style="border-radius: 15px; padding: 10px 20px;">
                            <i class="fas fa-paper-plane"></i> 提交报告
                        </button>
                        <button class="btn btn-secondary btn-hover-effect" onclick="QuestionBankUI.closeAllModals()" style="border-radius: 15px; padding: 10px 20px;">
                            <i class="fas fa-times"></i> 取消
                        </button>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '报告问题',
                    content: reportContent,
                    size: 'medium'
                });
            }
        },
        
        // 提交报告
        submitReport: function() {
            const reportType = document.getElementById('reportType')?.value;
            const reportDescription = document.getElementById('reportDescription')?.value;
            
            if (!reportDescription || reportDescription.trim() === '') {
                showNotification('请填写详细描述', 'warning');
                return;
            }
            
            const report = {
                type: reportType,
                description: reportDescription,
                questionIndex: currentSession.currentIndex,
                timestamp: new Date().toISOString()
            };
            
            // 这里可以发送到服务器或保存到本地
            console.log('问题报告:', report);
            showNotification('问题报告已提交，感谢您的反馈！', 'success');
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.closeAllModals();
            }
        },
        
        // 计算正确率
        calculateAccuracy: function() {
            const answeredQuestions = currentSession.userAnswers.filter(answer => answer !== null);
            if (answeredQuestions.length === 0) return 0;
            
            const correctAnswers = answeredQuestions.filter((answer, index) => {
                const question = currentSession.questions[index];
                return question && answer === question.correct;
            }).length;
            
            return Math.round((correctAnswers / answeredQuestions.length) * 100);
        },
        
        // 计算平均用时
        calculateAverageTime: function() {
            if (currentSession.questionTimes.length === 0) return 0;
            
            const totalTime = currentSession.questionTimes.reduce((sum, time) => sum + time, 0);
            return Math.round(totalTime / currentSession.questionTimes.length);
        },
        
        // 估算完成时间
        estimateCompletionTime: function() {
            const remainingQuestions = currentSession.questions.length - currentSession.currentIndex - 1;
            const averageTime = this.calculateAverageTime();
            const estimatedSeconds = remainingQuestions * averageTime;
            
            if (estimatedSeconds < 60) {
                return `${estimatedSeconds}秒`;
            } else if (estimatedSeconds < 3600) {
                return `${Math.round(estimatedSeconds / 60)}分钟`;
            } else {
                return `${Math.round(estimatedSeconds / 3600)}小时`;
            }
        },
        
        // 切换主题
        toggleTheme: function() {
            const container = document.getElementById('practiceContainer');
            const themeBtn = document.getElementById('themeBtn');
            
            if (!container) return;
            
            const currentTheme = container.getAttribute('data-theme') || 'ocean';
            const newTheme = currentTheme === 'ocean' ? 'sunset' : 'ocean';
            
            container.setAttribute('data-theme', newTheme);
            
            // 更新主题样式
            if (newTheme === 'sunset') {
                container.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)';
                container.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="sunset1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:%23ff6b6b;stop-opacity:0.3"/><stop offset="100%" style="stop-color:%23feca57;stop-opacity:0.3"/></linearGradient></defs><path d="M0,600 Q300,500 600,600 T1200,600 L1200,800 L0,800 Z" fill="url(%23sunset1)"/></svg>')`;
                if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-water"></i>';
            } else {
                container.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                container.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:%234facfe;stop-opacity:0.3"/><stop offset="100%" style="stop-color:%2300f2fe;stop-opacity:0.3"/></linearGradient></defs><path d="M0,600 Q300,500 600,600 T1200,600 L1200,800 L0,800 Z" fill="url(%23wave1)"/></svg>')`;
                if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-palette"></i>';
            }
            
            showNotification(`已切换到${newTheme === 'sunset' ? '日落' : '海洋'}主题`, 'info');
        },
        
        // 显示快捷键帮助
        showKeyboardHelp: function() {
            const helpContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; max-width: 600px; margin: 20px auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">⌨️ 快捷键帮助</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                        <div style="background: rgba(79,172,254,0.1); padding: 15px; border-radius: 10px;">
                            <h6 style="color: #4facfe; margin-bottom: 10px;">📝 答题控制</h6>
                            <div><kbd>空格键</kbd> 提交答案</div>
                            <div><kbd>H</kbd> 显示提示</div>
                            <div><kbd>S</kbd> 跳过题目</div>
                            <div><kbd>D</kbd> 删除题目</div>
                        </div>
                        <div style="background: rgba(255,193,7,0.1); padding: 15px; border-radius: 10px;">
                            <h6 style="color: #ffc107; margin-bottom: 10px;">🎮 导航控制</h6>
                            <div><kbd>←</kbd> 上一题</div>
                            <div><kbd>→</kbd> 下一题</div>
                            <div><kbd>Ctrl+A</kbd> 显示答案</div>
                            <div><kbd>F11</kbd> 全屏切换</div>
                        </div>
                        <div style="background: rgba(40,167,69,0.1); padding: 15px; border-radius: 10px;">
                            <h6 style="color: #28a745; margin-bottom: 10px;">🔍 显示控制</h6>
                            <div><kbd>Ctrl+=</kbd> 放大字体</div>
                            <div><kbd>Ctrl+-</kbd> 缩小字体</div>
                            <div><kbd>Ctrl+0</kbd> 重置字体</div>
                            <div><kbd>T</kbd> 切换主题</div>
                        </div>
                        <div style="background: rgba(220,53,69,0.1); padding: 15px; border-radius: 10px;">
                            <h6 style="color: #dc3545; margin-bottom: 10px;">⚡ 快速操作</h6>
                            <div><kbd>Esc</kbd> 退出练习</div>
                            <div><kbd>P</kbd> 暂停/继续</div>
                            <div><kbd>R</kbd> 重新开始</div>
                            <div><kbd>?</kbd> 显示帮助</div>
                            <div><kbd>N</kbd> 笔记面板</div>
                            <div><kbd>I</kbd> AI智能提示</div>
                            <div><kbd>M</kbd> 切换学习模式</div>
                            <div><kbd>A</kbd> 智能分析</div>
                            <div><kbd>P</kbd> 学习进度</div>
                            <div><kbd>W</kbd> 错题本</div>
                            <div><kbd>S</kbd> 学习策略</div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                        提示：在输入框中不会触发快捷键
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '快捷键帮助',
                    content: helpContent,
                    size: 'medium',
                    closable: true
                });
            } else {
                alert('快捷键帮助：\n空格键 - 提交答案\n← → - 上一题/下一题\nCtrl+A - 显示答案\nCtrl+=/- - 放大/缩小字体\nT - 切换主题\nD - 删除题目\nH - 显示提示\nS - 跳过题目');
            }
        },
        
        // 显示统计面板
        showStatsPanel: function() {
            const stats = this.calculateCurrentStats();
            const statsContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; max-width: 600px; margin: 20px auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">📊 练习统计</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px;">
                        <div style="background: rgba(79,172,254,0.1); padding: 20px; border-radius: 15px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #4facfe;">${stats.totalQuestions}</div>
                            <div style="color: #666; margin-top: 5px;">总题目数</div>
                        </div>
                        <div style="background: rgba(40,167,69,0.1); padding: 20px; border-radius: 15px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #28a745;">${stats.currentIndex + 1}</div>
                            <div style="color: #666; margin-top: 5px;">当前进度</div>
                        </div>
                        <div style="background: rgba(255,193,7,0.1); padding: 20px; border-radius: 15px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${stats.answeredCount}</div>
                            <div style="color: #666; margin-top: 5px;">已答题数</div>
                        </div>
                        <div style="background: rgba(220,53,69,0.1); padding: 20px; border-radius: 15px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${stats.remainingCount}</div>
                            <div style="color: #666; margin-top: 5px;">剩余题目</div>
                        </div>
                    </div>
                    <div style="margin-top: 20px; padding: 20px; background: rgba(248,249,250,0.8); border-radius: 15px;">
                        <h6 style="color: #333; margin-bottom: 15px;">⏱️ 时间统计</h6>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>练习时长：</span>
                            <span style="font-weight: bold; color: #4facfe;">${stats.elapsedTime}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                            <span>平均每题用时：</span>
                            <span style="font-weight: bold; color: #28a745;">${stats.avgTimePerQuestion}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                            <span>预计剩余时间：</span>
                            <span style="font-weight: bold; color: #ffc107;">${stats.estimatedRemainingTime}</span>
                        </div>
                    </div>
                    <div style="margin-top: 20px; padding: 20px; background: rgba(248,249,250,0.8); border-radius: 15px;">
                        <h6 style="color: #333; margin-bottom: 15px;">📈 进度分析</h6>
                        <div style="background: rgba(79,172,254,0.2); border-radius: 10px; height: 20px; overflow: hidden; margin-bottom: 10px;">
                            <div style="background: linear-gradient(90deg, #4facfe, #00f2fe); height: 100%; width: ${stats.progressPercentage}%; transition: width 0.3s ease;"></div>
                        </div>
                        <div style="text-align: center; color: #666; font-size: 12px;">
                            完成进度：${stats.progressPercentage}%
                        </div>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '练习统计',
                    content: statsContent,
                    size: 'medium',
                    closable: true
                });
            } else {
                alert(`练习统计：\n总题目：${stats.totalQuestions}\n当前进度：${stats.currentIndex + 1}\n已答题：${stats.answeredCount}\n剩余题目：${stats.remainingCount}\n练习时长：${stats.elapsedTime}`);
            }
        },
        
        // 计算当前统计
        calculateCurrentStats: function() {
            const totalQuestions = currentSession.questions.length;
            const currentIndex = currentSession.currentIndex;
            const answeredCount = currentSession.userAnswers.filter(answer => answer !== null).length;
            const remainingCount = totalQuestions - (currentIndex + 1);
            
            // 计算时间
            const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const elapsedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // 平均每题用时
            const avgTimePerQuestion = answeredCount > 0 ? Math.round(elapsed / answeredCount) : 0;
            const avgTimeStr = avgTimePerQuestion > 0 ? `${Math.floor(avgTimePerQuestion / 60)}:${(avgTimePerQuestion % 60).toString().padStart(2, '0')}` : '0:00';
            
            // 预计剩余时间
            const estimatedRemainingTime = remainingCount > 0 ? `${Math.floor((avgTimePerQuestion * remainingCount) / 60)}:${((avgTimePerQuestion * remainingCount) % 60).toString().padStart(2, '0')}` : '0:00';
            
            // 进度百分比
            const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);
            
            return {
                totalQuestions,
                currentIndex,
                answeredCount,
                remainingCount,
                elapsedTime,
                avgTimePerQuestion: avgTimeStr,
                estimatedRemainingTime,
                progressPercentage
            };
        },
        
        // 切换笔记面板
        toggleNotePanel: function() {
            const notePanel = document.getElementById('notePanel');
            if (notePanel) {
                const isVisible = notePanel.style.display !== 'none';
                notePanel.style.display = isVisible ? 'none' : 'block';
                
                if (!isVisible) {
                    this.loadCurrentNote();
                    this.loadNoteHistory();
                }
            }
        },
        
        // 保存笔记
        saveNote: function() {
            const noteText = document.getElementById('currentNote').value.trim();
            if (!noteText) {
                showNotification('请输入笔记内容', 'warning');
                return;
            }
            
            const question = currentSession.questions[currentSession.currentIndex];
            const noteData = {
                questionId: question.id,
                questionTitle: question.title.substring(0, 50) + (question.title.length > 50 ? '...' : ''),
                note: noteText,
                timestamp: new Date().toISOString(),
                sessionId: currentSession.bankId
            };
            
            // 保存到本地存储
            let notes = JSON.parse(localStorage.getItem('questionBankNotes') || '[]');
            notes.push(noteData);
            localStorage.setItem('questionBankNotes', JSON.stringify(notes));
            
            showNotification('笔记已保存', 'success');
            this.loadNoteHistory();
        },
        
        // 清空当前笔记
        clearNote: function() {
            if (confirm('确定要清空当前笔记吗？')) {
                document.getElementById('currentNote').value = '';
                showNotification('笔记已清空', 'info');
            }
        },
        
        // 加载当前题目笔记
        loadCurrentNote: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            const notes = JSON.parse(localStorage.getItem('questionBankNotes') || '[]');
            const currentNote = notes.find(note => note.questionId === question.id);
            
            const noteTextarea = document.getElementById('currentNote');
            if (noteTextarea) {
                noteTextarea.value = currentNote ? currentNote.note : '';
            }
        },
        
        // 加载笔记历史
        loadNoteHistory: function() {
            const notes = JSON.parse(localStorage.getItem('questionBankNotes') || '[]');
            const historyContainer = document.getElementById('noteHistory');
            
            if (!historyContainer) return;
            
            if (notes.length === 0) {
                historyContainer.innerHTML = '<p style="color: #666; text-align: center; font-size: 14px;">暂无笔记历史</p>';
                return;
            }
            
            // 按时间倒序排列
            const sortedNotes = notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            let html = '';
            sortedNotes.slice(0, 10).forEach(note => {
                const date = new Date(note.timestamp).toLocaleString();
                html += `
                    <div style="background: rgba(255,193,7,0.1); border-radius: 10px; padding: 15px; margin-bottom: 10px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 5px; font-size: 13px;">
                            ${note.questionTitle}
                        </div>
                        <div style="color: #666; font-size: 12px; margin-bottom: 8px;">
                            ${date}
                        </div>
                        <div style="color: #333; font-size: 13px; line-height: 1.4;">
                            ${note.note}
                        </div>
                        <button onclick="QuestionBankPractice.deleteNote('${note.timestamp}')" style="background: none; border: none; color: #dc3545; font-size: 12px; cursor: pointer; margin-top: 8px;">
                            🗑️ 删除
                        </button>
                    </div>
                `;
            });
            
            historyContainer.innerHTML = html;
        },
        
        // 删除笔记
        deleteNote: function(timestamp) {
            if (confirm('确定要删除这条笔记吗？')) {
                let notes = JSON.parse(localStorage.getItem('questionBankNotes') || '[]');
                notes = notes.filter(note => note.timestamp !== timestamp);
                localStorage.setItem('questionBankNotes', JSON.stringify(notes));
                
                showNotification('笔记已删除', 'success');
                this.loadNoteHistory();
            }
        },
        
        // 显示AI智能提示
        showAIHint: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            const questionText = question.title || question.question || '';
            const questionType = question.type || '选择题';
            
            // 根据题目类型和内容生成智能提示
            let hint = this.generateAIHint(questionText, questionType);
            
            const hintContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; max-width: 600px; margin: 20px auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">🤖 AI智能提示</h4>
                    <div style="background: rgba(23,162,184,0.1); border-left: 4px solid #17a2b8; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h6 style="color: #17a2b8; margin-bottom: 15px;">💡 解题思路</h6>
                        <div style="color: #333; line-height: 1.6; font-size: 14px;">
                            ${hint.thinking}
                        </div>
                    </div>
                    <div style="background: rgba(40,167,69,0.1); border-left: 4px solid #28a745; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h6 style="color: #28a745; margin-bottom: 15px;">📚 相关知识点</h6>
                        <div style="color: #333; line-height: 1.6; font-size: 14px;">
                            ${hint.knowledge}
                        </div>
                    </div>
                    <div style="background: rgba(255,193,7,0.1); border-left: 4px solid #ffc107; padding: 20px; border-radius: 10px;">
                        <h6 style="color: #ffc107; margin-bottom: 15px;">⚡ 解题技巧</h6>
                        <div style="color: #333; line-height: 1.6; font-size: 14px;">
                            ${hint.tips}
                        </div>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: 'AI智能提示',
                    content: hintContent,
                    size: 'medium',
                    closable: true
                });
            } else {
                alert(`AI智能提示：\n\n解题思路：${hint.thinking}\n\n相关知识点：${hint.knowledge}\n\n解题技巧：${hint.tips}`);
            }
        },
        
        // 生成AI提示
        generateAIHint: function(questionText, questionType) {
            // 关键词匹配和智能分析
            const keywords = {
                '边界层': {
                    thinking: '边界层理论是流体力学中的重要概念，需要考虑边界层厚度、分离条件等。',
                    knowledge: '边界层厚度δ∝√(νx/U)，雷诺数Re=ρUL/μ，边界层分离条件。',
                    tips: '注意边界层内外流动特性的差异，边界层内粘性重要，外部可视为无粘流动。'
                },
                '雷诺数': {
                    thinking: '雷诺数是判断流动状态的重要无量纲参数，影响流动的稳定性。',
                    knowledge: 'Re=ρUL/μ，层流Re<2300，湍流Re>4000，过渡区2300<Re<4000。',
                    tips: '雷诺数越大，惯性力越重要；雷诺数越小，粘性力越重要。'
                },
                '伯努利方程': {
                    thinking: '伯努利方程适用于理想流体，需要考虑能量守恒和压力变化。',
                    knowledge: 'p/ρ + v²/2 + gz = 常数，适用于不可压缩、无粘、定常流动。',
                    tips: '注意应用条件，通常用于计算压力分布和速度变化。'
                },
                '势流': {
                    thinking: '势流理论适用于高雷诺数流动，边界层外的主流区域。',
                    knowledge: '势函数φ满足∇²φ=0，流函数ψ满足∇²ψ=0，复势w=φ+iψ。',
                    tips: '势流可以叠加，注意边界条件的处理。'
                },
                '动量方程': {
                    thinking: '动量方程描述流体运动的基本规律，需要考虑力和加速度。',
                    knowledge: 'ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + ρg，包括惯性力、压力梯度、粘性力和重力。',
                    tips: '注意各项的物理意义，选择合适的坐标系简化计算。'
                },
                '连续性方程': {
                    thinking: '连续性方程体现质量守恒，适用于所有流体流动。',
                    knowledge: '∂ρ/∂t + ∇·(ρv) = 0，不可压缩流体∇·v = 0。',
                    tips: '连续性方程是求解流动问题的基本方程之一。'
                }
            };
            
            // 查找匹配的关键词
            let matchedHint = null;
            for (const [key, hint] of Object.entries(keywords)) {
                if (questionText.includes(key)) {
                    matchedHint = hint;
                    break;
                }
            }
            
            // 如果没有匹配的关键词，提供通用提示
            if (!matchedHint) {
                matchedHint = {
                    thinking: '仔细分析题目条件，确定适用的物理定律和数学方法。',
                    knowledge: '复习相关的基础概念和公式，注意应用条件。',
                    tips: '画图帮助理解，注意单位统一，检查计算过程。'
                };
            }
            
            // 根据题目类型调整提示
            if (questionType === '计算题') {
                matchedHint.tips += ' 注意计算步骤的准确性，检查最终结果的合理性。';
            } else if (questionType === '选择题') {
                matchedHint.tips += ' 仔细分析各选项的差异，排除明显错误的选项。';
            } else if (questionType === '填空题') {
                matchedHint.tips += ' 注意答案的格式和单位，确保填写完整。';
            }
            
            return matchedHint;
        },
        
        // 切换学习模式
        toggleLearningMode: function() {
            const modeBtn = document.getElementById('modeBtn');
            const currentMode = currentSession.learningMode || 'practice';
            const newMode = currentMode === 'practice' ? 'study' : 'practice';
            
            currentSession.learningMode = newMode;
            
            if (modeBtn) {
                if (newMode === 'study') {
                    modeBtn.innerHTML = '<i class="fas fa-book-open"></i>';
                    modeBtn.title = '切换到练习模式';
                    modeBtn.className = 'btn btn-dark btn-sm';
                    showNotification('已切换到学习模式 - 显示详细解析', 'info');
                } else {
                    modeBtn.innerHTML = '<i class="fas fa-graduation-cap"></i>';
                    modeBtn.title = '切换到学习模式';
                    modeBtn.className = 'btn btn-outline-dark btn-sm';
                    showNotification('已切换到练习模式 - 隐藏详细解析', 'info');
                }
            }
            
            // 重新显示当前题目以应用新模式
            this.displayCurrentQuestion();
        },
        
        // 显示智能分析
        showAnalysis: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            const questionText = question.title || question.question || '';
            const questionType = question.type || '选择题';
            const userAnswer = currentSession.userAnswers ? currentSession.userAnswers[currentSession.currentIndex] : null;
            
            // 生成智能分析
            const analysis = this.generateAnalysis(question, userAnswer, questionType);
            
            const analysisContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; max-width: 700px; margin: 20px auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">🧠 智能分析报告</h4>
                    
                    <div style="background: rgba(102,126,234,0.1); border-left: 4px solid #667eea; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h6 style="color: #667eea; margin-bottom: 15px;">📊 题目分析</h6>
                        <div style="color: #333; line-height: 1.6; font-size: 14px;">
                            ${analysis.questionAnalysis}
                        </div>
                    </div>
                    
                    <div style="background: rgba(40,167,69,0.1); border-left: 4px solid #28a745; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h6 style="color: #28a745; margin-bottom: 15px;">🎯 答题建议</h6>
                        <div style="color: #333; line-height: 1.6; font-size: 14px;">
                            ${analysis.answerAdvice}
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,193,7,0.1); border-left: 4px solid #ffc107; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h6 style="color: #ffc107; margin-bottom: 15px;">📚 知识点关联</h6>
                        <div style="color: #333; line-height: 1.6; font-size: 14px;">
                            ${analysis.knowledgeConnections}
                        </div>
                    </div>
                    
                    <div style="background: rgba(220,53,69,0.1); border-left: 4px solid #dc3545; padding: 20px; border-radius: 10px;">
                        <h6 style="color: #dc3545; margin-bottom: 15px;">⚠️ 易错点提醒</h6>
                        <div style="color: #333; line-height: 1.6; font-size: 14px;">
                            ${analysis.errorWarnings}
                        </div>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '智能分析报告',
                    content: analysisContent,
                    size: 'large',
                    closable: true
                });
            } else {
                alert(`智能分析：\n\n题目分析：${analysis.questionAnalysis}\n\n答题建议：${analysis.answerAdvice}\n\n知识点关联：${analysis.knowledgeConnections}\n\n易错点提醒：${analysis.errorWarnings}`);
            }
        },
        
        // 生成智能分析
        generateAnalysis: function(question, userAnswer, questionType) {
            const questionText = question.title || question.question || '';
            const correctAnswer = question.answer || '';
            const explanation = question.explanation || '';
            
            // 分析题目难度和类型
            let questionAnalysis = '';
            if (question.difficulty === 'hard') {
                questionAnalysis = '这是一道高难度题目，涉及复杂的概念和计算。';
            } else if (question.difficulty === 'medium') {
                questionAnalysis = '这是一道中等难度题目，需要理解基本概念和简单计算。';
            } else {
                questionAnalysis = '这是一道基础题目，主要考察基本概念。';
            }
            
            questionAnalysis += `题目类型为${questionType}，主要考察${this.getMainTopic(questionText)}相关知识点。`;
            
            // 生成答题建议
            let answerAdvice = '';
            if (questionType === '选择题') {
                answerAdvice = '仔细分析各选项的差异，注意关键词和限定条件。可以先排除明显错误的选项。';
            } else if (questionType === '填空题') {
                answerAdvice = '注意答案的格式和单位，确保填写完整。可以检查答案的合理性。';
            } else if (questionType === '计算题') {
                answerAdvice = '注意计算步骤的准确性，检查最终结果的合理性。注意单位的统一。';
            } else {
                answerAdvice = '仔细分析题目要求，注意答题的完整性和准确性。';
            }
            
            // 生成知识点关联
            let knowledgeConnections = this.getKnowledgeConnections(questionText);
            
            // 生成易错点提醒
            let errorWarnings = this.getErrorWarnings(questionText, questionType);
            
            return {
                questionAnalysis,
                answerAdvice,
                knowledgeConnections,
                errorWarnings
            };
        },
        
        // 获取主要知识点
        getMainTopic: function(questionText) {
            const topics = {
                '边界层': '边界层理论',
                '雷诺数': '雷诺数和流动状态',
                '伯努利': '伯努利方程',
                '势流': '势流理论',
                '动量': '动量方程',
                '连续性': '连续性方程',
                '涡度': '涡度理论',
                '湍流': '湍流理论',
                '层流': '层流理论',
                '粘性': '粘性流动',
                '压力': '压力分布',
                '速度': '速度场',
                '流线': '流线理论',
                '涡旋': '涡旋运动',
                '波浪': '波浪理论'
            };
            
            for (const [key, topic] of Object.entries(topics)) {
                if (questionText.includes(key)) {
                    return topic;
                }
            }
            
            return '流体力学基础';
        },
        
        // 获取知识点关联
        getKnowledgeConnections: function(questionText) {
            const connections = [];
            
            if (questionText.includes('边界层')) {
                connections.push('边界层理论 → 雷诺数 → 流动状态判别');
            }
            if (questionText.includes('雷诺数')) {
                connections.push('雷诺数 → 层流湍流判别 → 阻力系数');
            }
            if (questionText.includes('伯努利')) {
                connections.push('伯努利方程 → 能量守恒 → 压力速度关系');
            }
            if (questionText.includes('势流')) {
                connections.push('势流理论 → 势函数 → 流函数 → 复势');
            }
            if (questionText.includes('动量')) {
                connections.push('动量方程 → 牛顿第二定律 → 力与加速度');
            }
            
            if (connections.length === 0) {
                connections.push('流体力学基础 → 连续介质假设 → 本构关系');
            }
            
            return connections.join('；') + '。';
        },
        
        // 获取易错点提醒
        getErrorWarnings: function(questionText, questionType) {
            const warnings = [];
            
            if (questionText.includes('边界层')) {
                warnings.push('注意边界层内外流动特性的差异');
            }
            if (questionText.includes('雷诺数')) {
                warnings.push('注意雷诺数的物理意义和应用条件');
            }
            if (questionText.includes('伯努利')) {
                warnings.push('注意伯努利方程的适用条件');
            }
            if (questionText.includes('势流')) {
                warnings.push('注意势流理论的应用范围');
            }
            if (questionText.includes('动量')) {
                warnings.push('注意动量方程各项的物理意义');
            }
            
            if (questionType === '选择题') {
                warnings.push('仔细分析各选项的差异，排除明显错误选项');
            } else if (questionType === '填空题') {
                warnings.push('注意答案格式和单位，确保填写完整');
            } else if (questionType === '计算题') {
                warnings.push('注意计算步骤和单位统一，检查结果合理性');
            }
            
            return warnings.join('；') + '。';
        },
        
        // 显示学习进度
        showLearningProgress: function() {
            const progress = this.calculateLearningProgress();
            
            const progressContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; max-width: 600px; margin: 20px auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">📈 学习进度报告</h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="background: rgba(102,126,234,0.1); border-radius: 15px; padding: 20px; text-align: center;">
                            <h5 style="color: #667eea; margin-bottom: 10px;">总题目数</h5>
                            <div style="font-size: 24px; font-weight: bold; color: #667eea;">${progress.totalQuestions}</div>
                        </div>
                        <div style="background: rgba(40,167,69,0.1); border-radius: 15px; padding: 20px; text-align: center;">
                            <h5 style="color: #28a745; margin-bottom: 10px;">已完成</h5>
                            <div style="font-size: 24px; font-weight: bold; color: #28a745;">${progress.completedQuestions}</div>
                        </div>
                        <div style="background: rgba(255,193,7,0.1); border-radius: 15px; padding: 20px; text-align: center;">
                            <h5 style="color: #ffc107; margin-bottom: 10px;">正确率</h5>
                            <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${progress.accuracy}%</div>
                        </div>
                        <div style="background: rgba(220,53,69,0.1); border-radius: 15px; padding: 20px; text-align: center;">
                            <h5 style="color: #dc3545; margin-bottom: 10px;">学习时间</h5>
                            <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${progress.studyTime}</div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(248,249,250,0.8); border-radius: 15px; padding: 20px;">
                        <h6 style="color: #333; margin-bottom: 15px;">📊 详细统计</h6>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div>选择题正确率: ${progress.choiceAccuracy}%</div>
                            <div>填空题正确率: ${progress.fillAccuracy}%</div>
                            <div>计算题正确率: ${progress.calcAccuracy}%</div>
                            <div>平均答题时间: ${progress.avgTime}秒</div>
                            <div>连续答对: ${progress.streak}题</div>
                            <div>错题数量: ${progress.wrongCount}题</div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,193,7,0.1); border-radius: 15px; padding: 20px; margin-top: 20px;">
                        <h6 style="color: #ffc107; margin-bottom: 15px;">🎯 学习建议</h6>
                        <div style="color: #333; line-height: 1.6; font-size: 14px;">
                            ${progress.suggestions}
                        </div>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '学习进度报告',
                    content: progressContent,
                    size: 'medium',
                    closable: true
                });
            } else {
                alert(`学习进度：\n\n总题目：${progress.totalQuestions}\n已完成：${progress.completedQuestions}\n正确率：${progress.accuracy}%\n学习时间：${progress.studyTime}`);
            }
        },
        
        // 计算学习进度
        calculateLearningProgress: function() {
            const totalQuestions = currentSession.questions.length;
            const completedQuestions = currentSession.currentIndex + 1;
            const answeredQuestions = currentSession.userAnswers ? currentSession.userAnswers.filter(a => a !== null && a !== '').length : 0;
            
            // 计算正确率
            let correctCount = 0;
            let choiceCorrect = 0, choiceTotal = 0;
            let fillCorrect = 0, fillTotal = 0;
            let calcCorrect = 0, calcTotal = 0;
            
            if (currentSession.userAnswers) {
                currentSession.userAnswers.forEach((answer, index) => {
                    if (answer !== null && answer !== '') {
                        const question = currentSession.questions[index];
                        const isCorrect = this.checkAnswer(answer, question);
                        
                        if (isCorrect) {
                            correctCount++;
                        }
                        
                        // 按题型统计
                        if (question.type === '选择题') {
                            choiceTotal++;
                            if (isCorrect) choiceCorrect++;
                        } else if (question.type === '填空题') {
                            fillTotal++;
                            if (isCorrect) fillCorrect++;
                        } else if (question.type === '计算题') {
                            calcTotal++;
                            if (isCorrect) calcCorrect++;
                        }
                    }
                });
            }
            
            const accuracy = totalQuestions > 0 ? Math.round((correctCount / answeredQuestions) * 100) : 0;
            const choiceAccuracy = choiceTotal > 0 ? Math.round((choiceCorrect / choiceTotal) * 100) : 0;
            const fillAccuracy = fillTotal > 0 ? Math.round((fillCorrect / fillTotal) * 100) : 0;
            const calcAccuracy = calcTotal > 0 ? Math.round((calcCorrect / calcTotal) * 100) : 0;
            
            // 计算学习时间
            const startTime = currentSession.startTime || Date.now();
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const studyTime = this.formatTime(elapsedTime);
            
            // 计算平均答题时间
            const avgTime = answeredQuestions > 0 ? Math.round(elapsedTime / answeredQuestions) : 0;
            
            // 计算连续答对
            let streak = 0;
            if (currentSession.userAnswers) {
                for (let i = currentSession.userAnswers.length - 1; i >= 0; i--) {
                    if (currentSession.userAnswers[i] !== null && currentSession.userAnswers[i] !== '') {
                        const question = currentSession.questions[i];
                        if (this.checkAnswer(currentSession.userAnswers[i], question)) {
                            streak++;
                        } else {
                            break;
                        }
                    }
                }
            }
            
            // 生成学习建议
            let suggestions = '';
            if (accuracy < 60) {
                suggestions = '建议多复习基础概念，重点关注易错知识点。';
            } else if (accuracy < 80) {
                suggestions = '学习效果良好，可以适当挑战更高难度的题目。';
            } else {
                suggestions = '学习效果优秀，建议尝试综合性和应用性题目。';
            }
            
            if (choiceAccuracy < fillAccuracy) {
                suggestions += '选择题正确率偏低，建议加强选项分析能力。';
            }
            
            return {
                totalQuestions,
                completedQuestions,
                accuracy,
                choiceAccuracy,
                fillAccuracy,
                calcAccuracy,
                studyTime,
                avgTime,
                streak,
                wrongCount: answeredQuestions - correctCount,
                suggestions
            };
        },
        
        // 格式化时间
        formatTime: function(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            if (hours > 0) {
                return `${hours}时${minutes}分`;
            } else if (minutes > 0) {
                return `${minutes}分${secs}秒`;
            } else {
                return `${secs}秒`;
            }
        },
        
        // 检查答案
        checkAnswer: function(userAnswer, question) {
            if (!userAnswer || !question.answer) return false;
            
            const correctAnswer = question.answer.toString().toUpperCase();
            const userAns = userAnswer.toString().toUpperCase();
            
            return correctAnswer === userAns;
        },
        
        // 显示错题本
        showWrongBook: function() {
            const wrongQuestions = this.getWrongQuestions();
            
            if (wrongQuestions.length === 0) {
                showNotification('暂无错题记录', 'info');
                return;
            }
            
            const wrongBookContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; max-width: 800px; margin: 20px auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">📚 错题本 (${wrongQuestions.length}题)</h4>
                    
                    <div style="max-height: 500px; overflow-y: auto;">
                        ${wrongQuestions.map((item, index) => `
                            <div style="background: rgba(220,53,69,0.1); border-radius: 15px; padding: 20px; margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                                    <span style="font-weight: bold; color: #dc3545;">错题 ${index + 1}</span>
                                    <div style="display: flex; gap: 5px;">
                                        <button onclick="QuestionBankPractice.practiceWrongQuestion(${item.index})" class="btn btn-sm btn-primary" style="border-radius: 15px; padding: 5px 10px;">
                                            <i class="fas fa-play"></i> 练习
                                        </button>
                                        <button onclick="QuestionBankPractice.removeFromWrongBook(${item.index})" class="btn btn-sm btn-outline-danger" style="border-radius: 15px; padding: 5px 10px;">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <div style="color: #333; margin-bottom: 10px; font-weight: bold;">
                                    ${item.question.title}
                                </div>
                                <div style="color: #666; font-size: 14px; margin-bottom: 8px;">
                                    <span class="badge bg-secondary">${item.question.type}</span>
                                    <span class="badge bg-danger">你的答案: ${item.userAnswer}</span>
                                    <span class="badge bg-success">正确答案: ${item.question.answer}</span>
                                </div>
                                ${item.question.explanation ? `
                                    <div style="background: rgba(255,193,7,0.1); border-radius: 10px; padding: 15px; margin-top: 10px;">
                                        <strong style="color: #ffc107;">解析：</strong>
                                        <div style="color: #333; font-size: 14px; line-height: 1.5;">
                                            ${item.question.explanation}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                        <button onclick="QuestionBankPractice.practiceAllWrongQuestions()" class="btn btn-primary" style="border-radius: 20px; padding: 10px 20px;">
                            <i class="fas fa-play"></i> 练习全部错题
                        </button>
                        <button onclick="QuestionBankPractice.clearWrongBook()" class="btn btn-outline-danger" style="border-radius: 20px; padding: 10px 20px;">
                            <i class="fas fa-trash"></i> 清空错题本
                        </button>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '错题本',
                    content: wrongBookContent,
                    size: 'large',
                    closable: true
                });
            } else {
                alert(`错题本：共${wrongQuestions.length}道错题`);
            }
        },
        
        // 获取错题列表
        getWrongQuestions: function() {
            const wrongQuestions = [];
            
            if (currentSession.userAnswers) {
                currentSession.userAnswers.forEach((answer, index) => {
                    if (answer !== null && answer !== '') {
                        const question = currentSession.questions[index];
                        const isCorrect = this.checkAnswer(answer, question);
                        
                        if (!isCorrect) {
                            wrongQuestions.push({
                                index,
                                question,
                                userAnswer: answer,
                                correctAnswer: question.answer
                            });
                        }
                    }
                });
            }
            
            return wrongQuestions;
        },
        
        // 练习单个错题
        practiceWrongQuestion: function(index) {
            if (index >= 0 && index < currentSession.questions.length) {
                currentSession.currentIndex = index;
                this.displayCurrentQuestion();
                this.updateProgress();
                this.updateButtonStates();
                
                if (typeof QuestionBankUI !== 'undefined') {
                    QuestionBankUI.closeModal();
                }
                
                showNotification('已跳转到错题，请重新作答', 'info');
            }
        },
        
        // 练习全部错题
        practiceAllWrongQuestions: function() {
            const wrongQuestions = this.getWrongQuestions();
            
            if (wrongQuestions.length === 0) {
                showNotification('暂无错题', 'info');
                return;
            }
            
            // 创建错题练习会话
            const wrongQuestionSession = {
                questions: wrongQuestions.map(item => item.question),
                currentIndex: 0,
                userAnswers: new Array(wrongQuestions.length).fill(null),
                startTime: Date.now(),
                bankId: 'wrong-questions',
                learningMode: currentSession.learningMode || 'practice'
            };
            
            // 保存当前会话
            localStorage.setItem('previousSession', JSON.stringify(currentSession));
            
            // 切换到错题练习
            currentSession = wrongQuestionSession;
            this.displayCurrentQuestion();
            this.updateProgress();
            this.updateButtonStates();
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.closeModal();
            }
            
            showNotification(`开始练习${wrongQuestions.length}道错题`, 'success');
        },
        
        // 从错题本中移除
        removeFromWrongBook: function(index) {
            if (confirm('确定要从错题本中移除这道题吗？')) {
                // 标记为已掌握
                if (currentSession.userAnswers && currentSession.userAnswers[index] !== null) {
                    currentSession.userAnswers[index] = 'MASTERED';
                }
                
                showNotification('已从错题本中移除', 'success');
                this.showWrongBook(); // 刷新错题本
            }
        },
        
        // 清空错题本
        clearWrongBook: function() {
            if (confirm('确定要清空错题本吗？这将清除所有错题记录！')) {
                if (currentSession.userAnswers) {
                    currentSession.userAnswers.forEach((answer, index) => {
                        if (answer !== null && answer !== '') {
                            const question = currentSession.questions[index];
                            const isCorrect = this.checkAnswer(answer, question);
                            if (!isCorrect) {
                                currentSession.userAnswers[index] = 'MASTERED';
                            }
                        }
                    });
                }
                
                showNotification('错题本已清空', 'success');
                this.showWrongBook(); // 刷新错题本
            }
        },
        
        // 显示学习策略
        showLearningStrategy: function() {
            const currentStrategy = currentSession.learningStrategy || 'adaptive';
            const strategies = {
                'adaptive': {
                    name: '自适应学习',
                    description: '根据答题情况自动调整题目难度和顺序',
                    icon: 'fas fa-brain',
                    color: '#667eea'
                },
                'spaced': {
                    name: '间隔重复',
                    description: '按照艾宾浩斯遗忘曲线安排复习',
                    icon: 'fas fa-clock',
                    color: '#28a745'
                },
                'focused': {
                    name: '专注模式',
                    description: '专注于当前知识点，减少干扰',
                    icon: 'fas fa-bullseye',
                    color: '#dc3545'
                },
                'random': {
                    name: '随机练习',
                    description: '随机选择题目，提高适应性',
                    icon: 'fas fa-random',
                    color: '#ffc107'
                }
            };
            
            const strategyContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; max-width: 600px; margin: 20px auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">🎯 学习策略选择</h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        ${Object.entries(strategies).map(([key, strategy]) => `
                            <div onclick="QuestionBankPractice.selectLearningStrategy('${key}')" 
                                 style="background: ${currentStrategy === key ? strategy.color + '20' : 'rgba(248,249,250,0.8)'}; 
                                        border: 2px solid ${currentStrategy === key ? strategy.color : '#dee2e6'}; 
                                        border-radius: 15px; padding: 20px; cursor: pointer; transition: all 0.3s;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                    <i class="${strategy.icon}" style="color: ${strategy.color}; font-size: 20px;"></i>
                                    <h6 style="color: #333; margin: 0; font-weight: bold;">${strategy.name}</h6>
                                </div>
                                <div style="color: #666; font-size: 14px; line-height: 1.4;">
                                    ${strategy.description}
                                </div>
                                ${currentStrategy === key ? '<div style="color: #28a745; font-size: 12px; margin-top: 8px;">✓ 当前策略</div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="background: rgba(255,193,7,0.1); border-radius: 15px; padding: 20px; margin-top: 20px;">
                        <h6 style="color: #ffc107; margin-bottom: 15px;">💡 策略说明</h6>
                        <div style="color: #333; line-height: 1.6; font-size: 14px;">
                            <strong>自适应学习：</strong>系统会根据你的答题情况，自动调整题目难度和出现频率。<br>
                            <strong>间隔重复：</strong>按照科学的遗忘曲线，在最佳时间点安排复习。<br>
                            <strong>专注模式：</strong>集中练习同一知识点的题目，加深理解。<br>
                            <strong>随机练习：</strong>随机选择题目，提高应对不同题型的能力。
                        </div>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '学习策略',
                    content: strategyContent,
                    size: 'medium',
                    closable: true
                });
            } else {
                alert('学习策略功能需要UI模块支持');
            }
        },
        
        // 选择学习策略
        selectLearningStrategy: function(strategy) {
            currentSession.learningStrategy = strategy;
            
            // 根据策略调整题目顺序
            this.applyLearningStrategy(strategy);
            
            showNotification(`已切换到${this.getStrategyName(strategy)}策略`, 'success');
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.closeModal();
            }
        },
        
        // 获取策略名称
        getStrategyName: function(strategy) {
            const names = {
                'adaptive': '自适应学习',
                'spaced': '间隔重复',
                'focused': '专注模式',
                'random': '随机练习'
            };
            return names[strategy] || '未知策略';
        },
        
        // 应用学习策略
        applyLearningStrategy: function(strategy) {
            const originalQuestions = [...currentSession.questions];
            
            switch (strategy) {
                case 'adaptive':
                    // 自适应：根据答题情况调整顺序
                    this.applyAdaptiveStrategy(originalQuestions);
                    break;
                case 'spaced':
                    // 间隔重复：按照遗忘曲线安排
                    this.applySpacedStrategy(originalQuestions);
                    break;
                case 'focused':
                    // 专注模式：按知识点分组
                    this.applyFocusedStrategy(originalQuestions);
                    break;
                case 'random':
                    // 随机练习：随机打乱
                    this.applyRandomStrategy(originalQuestions);
                    break;
            }
            
            currentSession.currentIndex = 0;
            this.displayCurrentQuestion();
            this.updateProgress();
        },
        
        // 自适应策略
        applyAdaptiveStrategy: function(questions) {
            // 根据答题情况调整题目顺序
            const answeredQuestions = [];
            const unansweredQuestions = [];
            
            if (currentSession.userAnswers) {
                questions.forEach((question, index) => {
                    if (currentSession.userAnswers[index] !== null && currentSession.userAnswers[index] !== '') {
                        answeredQuestions.push(question);
                    } else {
                        unansweredQuestions.push(question);
                    }
                });
            } else {
                unansweredQuestions.push(...questions);
            }
            
            // 将未答题目放在前面
            currentSession.questions = [...unansweredQuestions, ...answeredQuestions];
        },
        
        // 间隔重复策略
        applySpacedStrategy: function(questions) {
            // 简单的间隔重复：每3题重复一次
            const spacedQuestions = [];
            const interval = 3;
            
            for (let i = 0; i < questions.length; i += interval) {
                const group = questions.slice(i, i + interval);
                spacedQuestions.push(...group);
                
                // 在每组后添加重复题目
                if (i > 0 && i < questions.length - interval) {
                    const repeatGroup = questions.slice(Math.max(0, i - interval), i);
                    spacedQuestions.push(...repeatGroup);
                }
            }
            
            currentSession.questions = spacedQuestions;
        },
        
        // 专注模式策略
        applyFocusedStrategy: function(questions) {
            // 按知识点分组
            const groupedQuestions = {};
            
            questions.forEach(question => {
                const topic = this.getMainTopic(question.title || question.question || '');
                if (!groupedQuestions[topic]) {
                    groupedQuestions[topic] = [];
                }
                groupedQuestions[topic].push(question);
            });
            
            // 按组重新排列
            const focusedQuestions = [];
            Object.values(groupedQuestions).forEach(group => {
                focusedQuestions.push(...group);
            });
            
            currentSession.questions = focusedQuestions;
        },
        
        // 随机策略
        applyRandomStrategy: function(questions) {
            // 随机打乱题目顺序
            const shuffled = [...questions];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            
            currentSession.questions = shuffled;
        },
        
        // 生成答案
        generateAnswer: function(question) {
            // 如果题目已有答案，直接返回
            if (question.answer) {
                return question.answer;
            }
            
            // 根据题目内容生成答案
            const questionText = question.title || question.question || '';
            const questionType = question.type || '选择题';
            
            // 选择题答案生成
            if (questionType === '选择题' && question.options) {
                // 根据题目关键词判断答案
                const keywords = {
                    '连续性方程': 'C',
                    '位移厚度': 'B', 
                    '雷诺数': 'B',
                    '流函数': 'B',
                    '伯努利方程': 'C',
                    '层流湍流': 'C',
                    '边界层分离': 'C',
                    '涡度': 'B',
                    '表面张力': 'B',
                    '动量方程': 'C'
                };
                
                for (const [key, value] of Object.entries(keywords)) {
                    if (questionText.includes(key)) {
                        return `答案：${value}`;
                    }
                }
                
                // 默认返回第一个选项
                return `答案：A`;
            }
            
            // 填空题答案生成
            if (questionType === '填空题') {
                const fillKeywords = {
                    '涡度沿流线': '常数',
                    '边界层厚度': '减小',
                    '雷诺数': '增大',
                    '粘性': '增大',
                    '压力': '减小'
                };
                
                for (const [key, value] of Object.entries(fillKeywords)) {
                    if (questionText.includes(key)) {
                        return `答案：${value}`;
                    }
                }
                
                return `答案：根据题目内容填写`;
            }
            
            // 解答题答案生成
            if (questionType === '解答题' || questionType === '计算题') {
                if (questionText.includes('边界层理论')) {
                    return `答案：边界层理论的基本假设包括：1) 边界层厚度远小于特征长度；2) 边界层内粘性力与惯性力同量级；3) 边界层外可视为无粘流动；4) 边界层内压力沿法向不变。`;
                }
                
                if (questionText.includes('势流理论')) {
                    return `答案：理想流体势流理论能成功处理绕流问题的原因：1) 高雷诺数下，粘性影响主要局限于边界层内；2) 边界层外的主流区域可视为无粘流动；3) 势流理论能准确预测压力分布和升力；4) 边界层理论提供了粘性效应的修正。`;
                }
                
                if (questionText.includes('流线方程')) {
                    return `答案：流线方程：dx/u = dy/v，积分得到流线方程。具体计算需要根据给定的速度场进行积分。`;
                }
                
                return `答案：根据题目要求，结合相关理论进行分析和计算。`;
            }
            
            return `答案：请参考相关教材或资料。`;
        },
        
        // 智能推荐系统
        getIntelligentRecommendations: function() {
            const currentQuestion = currentSession.questions[currentSession.currentIndex];
            if (!currentQuestion) return [];
            
            const recommendations = [];
            
            // 基于答题历史的推荐
            const userAccuracy = this.calculateAccuracy();
            if (userAccuracy < 60) {
                recommendations.push({
                    type: 'difficulty',
                    title: '建议降低难度',
                    description: '当前正确率较低，建议选择更基础的题目',
                    action: 'switchToEasier'
                });
            } else if (userAccuracy > 90) {
                recommendations.push({
                    type: 'difficulty',
                    title: '建议提高难度',
                    description: '当前表现优秀，可以挑战更难的题目',
                    action: 'switchToHarder'
                });
            }
            
            // 基于答题速度的推荐
            const averageTime = this.calculateAverageTime();
            if (averageTime > 120) {
                recommendations.push({
                    type: 'speed',
                    title: '答题速度较慢',
                    description: '建议提高答题效率，注意时间管理',
                    action: 'showTimeManagementTips'
                });
            }
            
            // 基于错题类型的推荐
            const wrongQuestions = currentSession.questions.filter(q => q.answered && !q.correct);
            if (wrongQuestions.length > 0) {
                const wrongTypes = wrongQuestions.map(q => q.type || '未知').filter((v, i, a) => a.indexOf(v) === i);
                if (wrongTypes.length > 0) {
                    recommendations.push({
                        type: 'review',
                        title: '重点复习建议',
                        description: `建议重点复习以下类型题目：${wrongTypes.join('、')}`,
                        action: 'focusOnWeakAreas'
                    });
                }
            }
            
            return recommendations;
        },
        
        // 自适应难度调整
        adjustDifficulty: function() {
            const accuracy = this.calculateAccuracy();
            const recentAnswers = currentSession.userAnswers.slice(-5).filter(a => a !== null);
            const recentAccuracy = recentAnswers.length > 0 ? 
                recentAnswers.filter((answer, index) => {
                    const question = currentSession.questions[currentSession.currentIndex - recentAnswers.length + index];
                    return question && answer === question.correct;
                }).length / recentAnswers.length * 100 : 0;
            
            let difficultyAdjustment = 0;
            
            if (recentAccuracy < 40) {
                difficultyAdjustment = -1; // 降低难度
            } else if (recentAccuracy > 80) {
                difficultyAdjustment = 1; // 提高难度
            }
            
            return {
                adjustment: difficultyAdjustment,
                reason: recentAccuracy < 40 ? '最近答题正确率较低' : 
                       recentAccuracy > 80 ? '最近答题表现优秀' : '难度适中'
            };
        },
        
        // 学习路径规划
        generateLearningPath: function() {
            const userProfile = this.getUserProfile();
            const learningPath = {
                currentLevel: userProfile.level || 'beginner',
                targetLevel: 'advanced',
                milestones: [],
                estimatedTime: 0,
                recommendations: []
            };
            
            // 根据用户表现生成学习里程碑
            const accuracy = this.calculateAccuracy();
            const averageTime = this.calculateAverageTime();
            
            if (accuracy < 60) {
                learningPath.milestones.push({
                    id: 'basic_mastery',
                    title: '基础掌握',
                    description: '掌握基础概念和简单题目',
                    targetAccuracy: 70,
                    estimatedHours: 10
                });
            }
            
            if (accuracy >= 60 && accuracy < 80) {
                learningPath.milestones.push({
                    id: 'intermediate_skills',
                    title: '中级技能',
                    description: '提升解题技巧和速度',
                    targetAccuracy: 85,
                    estimatedHours: 15
                });
            }
            
            if (accuracy >= 80) {
                learningPath.milestones.push({
                    id: 'advanced_mastery',
                    title: '高级精通',
                    description: '掌握复杂题目和高级技巧',
                    targetAccuracy: 95,
                    estimatedHours: 20
                });
            }
            
            // 计算总预计时间
            learningPath.estimatedTime = learningPath.milestones.reduce((total, milestone) => total + milestone.estimatedHours, 0);
            
            return learningPath;
        },
        
        // 获取用户学习档案
        getUserProfile: function() {
            const accuracy = this.calculateAccuracy();
            const averageTime = this.calculateAverageTime();
            const totalQuestions = currentSession.userAnswers.filter(a => a !== null).length;
            
            let level = 'beginner';
            if (accuracy >= 90 && averageTime < 60) {
                level = 'expert';
            } else if (accuracy >= 75 && averageTime < 90) {
                level = 'advanced';
            } else if (accuracy >= 60) {
                level = 'intermediate';
            }
            
            return {
                level: level,
                accuracy: accuracy,
                averageTime: averageTime,
                totalQuestions: totalQuestions,
                learningStyle: this.determineLearningStyle(),
                strengths: this.identifyStrengths(),
                weaknesses: this.identifyWeaknesses()
            };
        },
        
        // 确定学习风格
        determineLearningStyle: function() {
            const questionTimes = currentSession.questionTimes.filter(t => t > 0);
            const averageTime = questionTimes.length > 0 ? 
                questionTimes.reduce((sum, time) => sum + time, 0) / questionTimes.length : 0;
            
            if (averageTime < 30) {
                return 'quick_learner';
            } else if (averageTime < 90) {
                return 'balanced_learner';
            } else {
                return 'thorough_learner';
            }
        },
        
        // 识别优势领域
        identifyStrengths: function() {
            const answeredQuestions = currentSession.questions.filter((q, index) => 
                currentSession.userAnswers[index] !== null
            );
            
            const strengths = [];
            const typeAccuracy = {};
            
            answeredQuestions.forEach((question, index) => {
                const userAnswer = currentSession.userAnswers[index];
                const isCorrect = userAnswer === question.correct;
                const type = question.type || '未知';
                
                if (!typeAccuracy[type]) {
                    typeAccuracy[type] = { correct: 0, total: 0 };
                }
                
                typeAccuracy[type].total++;
                if (isCorrect) {
                    typeAccuracy[type].correct++;
                }
            });
            
            Object.entries(typeAccuracy).forEach(([type, stats]) => {
                const accuracy = (stats.correct / stats.total) * 100;
                if (accuracy >= 80) {
                    strengths.push({
                        type: type,
                        accuracy: accuracy,
                        count: stats.total
                    });
                }
            });
            
            return strengths;
        },
        
        // 识别薄弱领域
        identifyWeaknesses: function() {
            const answeredQuestions = currentSession.questions.filter((q, index) => 
                currentSession.userAnswers[index] !== null
            );
            
            const weaknesses = [];
            const typeAccuracy = {};
            
            answeredQuestions.forEach((question, index) => {
                const userAnswer = currentSession.userAnswers[index];
                const isCorrect = userAnswer === question.correct;
                const type = question.type || '未知';
                
                if (!typeAccuracy[type]) {
                    typeAccuracy[type] = { correct: 0, total: 0 };
                }
                
                typeAccuracy[type].total++;
                if (isCorrect) {
                    typeAccuracy[type].correct++;
                }
            });
            
            Object.entries(typeAccuracy).forEach(([type, stats]) => {
                const accuracy = (stats.correct / stats.total) * 100;
                if (accuracy < 60) {
                    weaknesses.push({
                        type: type,
                        accuracy: accuracy,
                        count: stats.total,
                        priority: 'high'
                    });
                } else if (accuracy < 80) {
                    weaknesses.push({
                        type: type,
                        accuracy: accuracy,
                        count: stats.total,
                        priority: 'medium'
                    });
                }
            });
            
            return weaknesses.sort((a, b) => a.accuracy - b.accuracy);
        },
        
        // 智能练习模式
        startIntelligentPractice: function() {
            const userProfile = this.getUserProfile();
            const recommendations = this.getIntelligentRecommendations();
            const learningPath = this.generateLearningPath();
            
            // 根据用户档案调整练习策略
            const practiceStrategy = {
                difficulty: userProfile.level === 'beginner' ? 'easy' : 
                           userProfile.level === 'expert' ? 'hard' : 'medium',
                focusAreas: userProfile.weaknesses.map(w => w.type),
                timeLimit: userProfile.learningStyle === 'quick_learner' ? 30 : 
                          userProfile.learningStyle === 'thorough_learner' ? 120 : 60,
                adaptiveMode: true
            };
            
            // 显示智能练习建议
            this.showIntelligentPracticeDialog(practiceStrategy, recommendations, learningPath);
        },
        
        // 显示智能练习对话框
        showIntelligentPracticeDialog: function(strategy, recommendations, learningPath) {
            const dialogContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">
                        <i class="fas fa-brain"></i> 智能练习建议
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                        <div style="background: rgba(79,172,254,0.1); border-radius: 15px; padding: 20px;">
                            <h5 style="color: #4facfe; margin-bottom: 15px;">练习策略</h5>
                            <ul style="color: #666; line-height: 1.6;">
                                <li>难度等级：${strategy.difficulty}</li>
                                <li>重点领域：${strategy.focusAreas.join('、') || '无'}</li>
                                <li>时间限制：${strategy.timeLimit}秒/题</li>
                                <li>自适应模式：${strategy.adaptiveMode ? '开启' : '关闭'}</li>
                            </ul>
                        </div>
                        
                        <div style="background: rgba(40,167,69,0.1); border-radius: 15px; padding: 20px;">
                            <h5 style="color: #28a745; margin-bottom: 15px;">学习路径</h5>
                            <p style="color: #666; line-height: 1.6;">
                                当前等级：${learningPath.currentLevel}<br>
                                目标等级：${learningPath.targetLevel}<br>
                                预计时间：${learningPath.estimatedTime}小时
                            </p>
                        </div>
                    </div>
                    
                    ${recommendations.length > 0 ? `
                        <div style="background: rgba(255,193,7,0.1); border-radius: 15px; padding: 20px; margin-top: 20px;">
                            <h5 style="color: #ffc107; margin-bottom: 15px;">智能推荐</h5>
                            ${recommendations.map(rec => `
                                <div style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.8); border-radius: 10px;">
                                    <strong>${rec.title}</strong><br>
                                    <small style="color: #666;">${rec.description}</small>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                        <button class="btn btn-success btn-hover-effect" onclick="QuestionBankPractice.startAdaptivePractice()" style="border-radius: 15px; padding: 10px 20px;">
                            <i class="fas fa-play"></i> 开始智能练习
                        </button>
                        <button class="btn btn-outline-secondary btn-hover-effect" onclick="QuestionBankUI.closeAllModals()" style="border-radius: 15px; padding: 10px 20px;">
                            <i class="fas fa-times"></i> 取消
                        </button>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '智能练习建议',
                    content: dialogContent,
                    size: 'large'
                });
            }
        },
        
        // 开始自适应练习
        startAdaptivePractice: function() {
            const userProfile = this.getUserProfile();
            const weaknesses = userProfile.weaknesses;
            
            // 根据薄弱领域筛选题目
            let adaptiveQuestions = currentSession.questions;
            if (weaknesses.length > 0) {
                const focusTypes = weaknesses.slice(0, 3).map(w => w.type); // 重点练习前3个薄弱领域
                adaptiveQuestions = currentSession.questions.filter(q => 
                    focusTypes.includes(q.type || '未知')
                );
            }
            
            // 如果筛选后的题目太少，使用原题目
            if (adaptiveQuestions.length < 5) {
                adaptiveQuestions = currentSession.questions;
            }
            
            // 开始自适应练习
            this.startCustomPractice(adaptiveQuestions, '智能自适应练习');
            
            showNotification('已启动智能自适应练习模式', 'success');
        },
        
        // 学习进度追踪
        trackLearningProgress: function() {
            const progress = {
                sessionId: Date.now(),
                startTime: currentSession.startTime,
                currentTime: new Date(),
                totalQuestions: currentSession.questions.length,
                completedQuestions: currentSession.currentIndex + 1,
                accuracy: this.calculateAccuracy(),
                averageTime: this.calculateAverageTime(),
                userProfile: this.getUserProfile(),
                learningPath: this.generateLearningPath(),
                recommendations: this.getIntelligentRecommendations()
            };
            
            // 保存到本地存储
            try {
                const existingProgress = JSON.parse(localStorage.getItem('learningProgress') || '[]');
                existingProgress.push(progress);
                localStorage.setItem('learningProgress', JSON.stringify(existingProgress));
            } catch (error) {
                console.error('保存学习进度失败:', error);
            }
            
            return progress;
        },
        
        // 生成学习报告
        generateLearningReport: function() {
            const progress = this.trackLearningProgress();
            const userProfile = progress.userProfile;
            
            const report = {
                title: '学习进度报告',
                date: new Date().toLocaleDateString(),
                summary: {
                    totalQuestions: progress.totalQuestions,
                    completedQuestions: progress.completedQuestions,
                    accuracy: progress.accuracy,
                    averageTime: progress.averageTime,
                    level: userProfile.level
                },
                analysis: {
                    strengths: userProfile.strengths,
                    weaknesses: userProfile.weaknesses,
                    learningStyle: userProfile.learningStyle,
                    recommendations: progress.recommendations
                },
                learningPath: progress.learningPath,
                nextSteps: this.generateNextSteps(userProfile)
            };
            
            return report;
        },
        
        // 生成下一步学习建议
        generateNextSteps: function(userProfile) {
            const nextSteps = [];
            
            if (userProfile.weaknesses.length > 0) {
                nextSteps.push({
                    priority: 'high',
                    action: 'focus_weak_areas',
                    description: `重点复习薄弱领域：${userProfile.weaknesses.slice(0, 3).map(w => w.type).join('、')}`,
                    estimatedTime: '2-3小时'
                });
            }
            
            if (userProfile.accuracy < 80) {
                nextSteps.push({
                    priority: 'medium',
                    action: 'improve_accuracy',
                    description: '通过更多练习提高答题准确率',
                    estimatedTime: '1-2小时'
                });
            }
            
            if (userProfile.averageTime > 90) {
                nextSteps.push({
                    priority: 'medium',
                    action: 'improve_speed',
                    description: '练习提高答题速度',
                    estimatedTime: '1小时'
                });
            }
            
            if (userProfile.level === 'beginner' || userProfile.level === 'intermediate') {
                nextSteps.push({
                    priority: 'low',
                    action: 'advance_level',
                    description: '挑战更高难度的题目',
                    estimatedTime: '2-4小时'
                });
            }
            
            return nextSteps;
        },
        
        // 显示学习报告
        showLearningReport: function() {
            const report = this.generateLearningReport();
            
            const reportContent = `
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">
                        <i class="fas fa-chart-line"></i> 学习进度报告
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                        <div style="background: rgba(79,172,254,0.1); border-radius: 15px; padding: 20px;">
                            <h5 style="color: #4facfe; margin-bottom: 15px;">学习概况</h5>
                            <ul style="color: #666; line-height: 1.6;">
                                <li>总题目数：${report.summary.totalQuestions}</li>
                                <li>已完成：${report.summary.completedQuestions}</li>
                                <li>正确率：${report.summary.accuracy}%</li>
                                <li>平均用时：${report.summary.averageTime}秒</li>
                                <li>当前等级：${report.summary.level}</li>
                            </ul>
                        </div>
                        
                        <div style="background: rgba(40,167,69,0.1); border-radius: 15px; padding: 20px;">
                            <h5 style="color: #28a745; margin-bottom: 15px;">优势领域</h5>
                            ${report.analysis.strengths.length > 0 ? 
                                report.analysis.strengths.map(strength => `
                                    <div style="margin-bottom: 8px;">
                                        <strong>${strength.type}</strong> - ${strength.accuracy.toFixed(1)}% (${strength.count}题)
                                    </div>
                                `).join('') : 
                                '<p style="color: #666;">暂无优势领域</p>'
                            }
                        </div>
                        
                        <div style="background: rgba(220,53,69,0.1); border-radius: 15px; padding: 20px;">
                            <h5 style="color: #dc3545; margin-bottom: 15px;">薄弱领域</h5>
                            ${report.analysis.weaknesses.length > 0 ? 
                                report.analysis.weaknesses.slice(0, 3).map(weakness => `
                                    <div style="margin-bottom: 8px;">
                                        <strong>${weakness.type}</strong> - ${weakness.accuracy.toFixed(1)}% (${weakness.count}题)
                                    </div>
                                `).join('') : 
                                '<p style="color: #666;">暂无薄弱领域</p>'
                            }
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,193,7,0.1); border-radius: 15px; padding: 20px; margin-top: 20px;">
                        <h5 style="color: #ffc107; margin-bottom: 15px;">下一步建议</h5>
                        ${report.nextSteps.map((step, index) => `
                            <div style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.8); border-radius: 10px;">
                                <strong>${index + 1}. ${step.description}</strong><br>
                                <small style="color: #666;">预计时间：${step.estimatedTime}</small>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                        <button class="btn btn-success btn-hover-effect" onclick="QuestionBankPractice.exportLearningReport()" style="border-radius: 15px; padding: 10px 20px;">
                            <i class="fas fa-download"></i> 导出报告
                        </button>
                        <button class="btn btn-primary btn-hover-effect" onclick="QuestionBankPractice.startIntelligentPractice()" style="border-radius: 15px; padding: 10px 20px;">
                            <i class="fas fa-play"></i> 智能练习
                        </button>
                        <button class="btn btn-outline-secondary btn-hover-effect" onclick="QuestionBankUI.closeAllModals()" style="border-radius: 15px; padding: 10px 20px;">
                            <i class="fas fa-times"></i> 关闭
                        </button>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '学习进度报告',
                    content: reportContent,
                    size: 'large'
                });
            }
        },
        
        // 导出学习报告
        exportLearningReport: function() {
            const report = this.generateLearningReport();
            
            const reportText = `
学习进度报告
================

日期：${report.date}
练习名称：${currentSession.sessionName}

学习概况：
- 总题目数：${report.summary.totalQuestions}
- 已完成：${report.summary.completedQuestions}
- 正确率：${report.summary.accuracy}%
- 平均用时：${report.summary.averageTime}秒
- 当前等级：${report.summary.level}

优势领域：
${report.analysis.strengths.map(s => `- ${s.type}: ${s.accuracy.toFixed(1)}% (${s.count}题)`).join('\n')}

薄弱领域：
${report.analysis.weaknesses.slice(0, 3).map(w => `- ${w.type}: ${w.accuracy.toFixed(1)}% (${w.count}题)`).join('\n')}

学习建议：
${report.nextSteps.map((step, index) => `${index + 1}. ${step.description} (预计时间：${step.estimatedTime})`).join('\n')}

学习路径：
- 当前等级：${report.learningPath.currentLevel}
- 目标等级：${report.learningPath.targetLevel}
- 预计完成时间：${report.learningPath.estimatedTime}小时

里程碑：
${report.learningPath.milestones.map(m => `- ${m.title}: ${m.description} (目标正确率：${m.targetAccuracy}%)`).join('\n')}
            `;
            
            const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `learning-report-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('学习报告已导出', 'success');
        },
        
        // 智能滚动提示
        showScrollHint: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            if (!questionDisplay) return;
            
            const hasScrollbar = questionDisplay.scrollHeight > questionDisplay.clientHeight;
            if (hasScrollbar) {
                // 创建滚动提示
                const hint = document.createElement('div');
                hint.id = 'scrollHint';
                hint.innerHTML = `
                    <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(79,172,254,0.9); color: white; padding: 10px 15px; border-radius: 20px; font-size: 14px; z-index: 1000; animation: fadeInOut 3s ease-in-out;">
                        <i class="fas fa-mouse"></i> 使用鼠标滚轮滚动内容
                    </div>
                `;
                questionDisplay.appendChild(hint);
                
                // 3秒后自动移除
                setTimeout(() => {
                    if (hint.parentNode) {
                        hint.parentNode.removeChild(hint);
                    }
                }, 3000);
            }
        },
        
        // 内容自适应调整
        adjustContentLayout: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            if (!questionDisplay) return;
            
            // 检查内容是否溢出
            const isOverflowing = questionDisplay.scrollHeight > questionDisplay.clientHeight;
            
            if (isOverflowing) {
                // 添加滚动指示器
                this.addScrollIndicator();
                
                // 调整内边距以优化滚动体验
                questionDisplay.style.paddingBottom = '60px';
                
                // 智能调整字体大小以适应内容
                this.autoAdjustFontSize();
            } else {
                // 移除滚动指示器
                this.removeScrollIndicator();
                
                // 恢复正常内边距
                questionDisplay.style.paddingBottom = '40px';
            }
        },
        
        // 智能调整字体大小
        autoAdjustFontSize: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            const fontSizeDisplay = document.getElementById('fontSizeDisplay');
            
            if (!questionDisplay || !fontSizeDisplay) return;
            
            // 获取当前字体大小
            let currentSize = parseInt(fontSizeDisplay.textContent) || 22;
            
            // 检查内容长度
            const contentLength = questionDisplay.textContent.length;
            
            // 根据内容长度智能调整字体大小
            let suggestedSize = currentSize;
            
            if (contentLength > 1000) {
                suggestedSize = Math.min(currentSize, 20);
            } else if (contentLength > 500) {
                suggestedSize = Math.min(currentSize, 22);
            } else if (contentLength < 200) {
                suggestedSize = Math.max(currentSize, 24);
            }
            
            // 如果建议的字体大小与当前不同，询问用户是否调整
            if (suggestedSize !== currentSize) {
                this.suggestFontSizeAdjustment(suggestedSize);
            }
        },
        
        // 建议字体大小调整
        suggestFontSizeAdjustment: function(suggestedSize) {
            const fontSizeDisplay = document.getElementById('fontSizeDisplay');
            if (!fontSizeDisplay) return;
            
            const currentSize = parseInt(fontSizeDisplay.textContent) || 22;
            
            // 创建建议提示
            const suggestion = document.createElement('div');
            suggestion.id = 'fontSizeSuggestion';
            suggestion.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #4facfe; border-radius: 20px; padding: 25px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; text-align: center; max-width: 400px;">
                    <h4 style="color: #333; margin-bottom: 15px;">💡 智能建议</h4>
                    <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
                        检测到题目内容较长，建议将字体大小从 ${currentSize}px 调整为 ${suggestedSize}px 以获得更好的阅读体验。
                    </p>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button onclick="QuestionBankPractice.acceptFontSizeSuggestion(${suggestedSize})" 
                                style="padding: 10px 20px; background: #4facfe; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 14px;">
                            接受建议
                        </button>
                        <button onclick="QuestionBankPractice.dismissFontSizeSuggestion()" 
                                style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 14px;">
                            保持当前
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(suggestion);
            
            // 5秒后自动移除
            setTimeout(() => {
                if (suggestion.parentNode) {
                    suggestion.parentNode.removeChild(suggestion);
                }
            }, 5000);
        },
        
        // 接受字体大小建议
        acceptFontSizeSuggestion: function(suggestedSize) {
            this.changeFontSize((suggestedSize - 22) / 2);
            this.dismissFontSizeSuggestion();
            showNotification('字体大小已根据内容智能调整', 'success');
        },
        
        // 忽略字体大小建议
        dismissFontSizeSuggestion: function() {
            const suggestion = document.getElementById('fontSizeSuggestion');
            if (suggestion && suggestion.parentNode) {
                suggestion.parentNode.removeChild(suggestion);
            }
        },
        
        // 阅读模式切换
        toggleReadingMode: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            const readingModeBtn = document.getElementById('readingModeBtn');
            
            if (!questionDisplay) return;
            
            const isReadingMode = questionDisplay.classList.contains('reading-mode');
            
            if (isReadingMode) {
                // 退出阅读模式
                questionDisplay.classList.remove('reading-mode');
                if (readingModeBtn) {
                    readingModeBtn.innerHTML = '<i class="fas fa-book-open"></i> 阅读模式';
                    readingModeBtn.title = '开启阅读模式';
                }
                showNotification('已退出阅读模式', 'info');
            } else {
                // 进入阅读模式
                questionDisplay.classList.add('reading-mode');
                if (readingModeBtn) {
                    readingModeBtn.innerHTML = '<i class="fas fa-times"></i> 退出阅读';
                    readingModeBtn.title = '退出阅读模式';
                }
                showNotification('已开启阅读模式', 'success');
            }
            
            // 保存阅读模式状态
            localStorage.setItem('questionBankReadingMode', !isReadingMode);
        },
        
        // 恢复阅读模式状态
        restoreReadingMode: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            const readingModeBtn = document.getElementById('readingModeBtn');
            
            if (!questionDisplay) return;
            
            // 从本地存储获取阅读模式状态
            const isReadingMode = localStorage.getItem('questionBankReadingMode') === 'true';
            
            if (isReadingMode) {
                questionDisplay.classList.add('reading-mode');
                if (readingModeBtn) {
                    readingModeBtn.innerHTML = '<i class="fas fa-times"></i> 退出阅读';
                    readingModeBtn.title = '退出阅读模式';
                }
            }
        },
        
        // 应用阅读模式样式
        applyReadingModeStyles: function() {
            const style = document.createElement('style');
            style.id = 'readingModeStyles';
            style.textContent = `
                .reading-mode {
                    background: #f8f9fa !important;
                    color: #2c3e50 !important;
                    font-family: 'Georgia', 'Times New Roman', serif !important;
                    line-height: 1.8 !important;
                    max-width: 800px !important;
                    margin: 0 auto !important;
                    padding: 40px !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                    border: none !important;
                }
                
                .reading-mode h4 {
                    font-size: 28px !important;
                    color: #1a252f !important;
                    margin-bottom: 30px !important;
                    text-align: center !important;
                    font-weight: 300 !important;
                }
                
                .reading-mode div[style*="font-size: 1.4em"] {
                    font-size: 20px !important;
                    line-height: 2.0 !important;
                    text-align: justify !important;
                    color: #34495e !important;
                    font-weight: 400 !important;
                }
                
                .reading-mode .option-item {
                    background: #ffffff !important;
                    border: 1px solid #e9ecef !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin: 15px 0 !important;
                    font-size: 18px !important;
                    line-height: 1.6 !important;
                    color: #495057 !important;
                }
                
                .reading-mode .option-item:hover {
                    background: #f8f9fa !important;
                    border-color: #4facfe !important;
                }
                
                .reading-mode input[type="text"],
                .reading-mode textarea {
                    background: #ffffff !important;
                    border: 1px solid #dee2e6 !important;
                    border-radius: 8px !important;
                    font-size: 18px !important;
                    color: #495057 !important;
                }
                
                .reading-mode input[type="text"]:focus,
                .reading-mode textarea:focus {
                    border-color: #4facfe !important;
                    box-shadow: 0 0 0 3px rgba(79,172,254,0.1) !important;
                }
            `;
            
            // 移除已存在的样式
            const existingStyle = document.getElementById('readingModeStyles');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            document.head.appendChild(style);
        },
        
        // 添加滚动指示器
        addScrollIndicator: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            if (!questionDisplay || document.getElementById('scrollIndicator')) return;
            
            const indicator = document.createElement('div');
            indicator.id = 'scrollIndicator';
            indicator.innerHTML = `
                <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(79,172,254,0.8); color: white; padding: 8px 16px; border-radius: 15px; font-size: 12px; z-index: 1000;">
                    <i class="fas fa-chevron-down"></i> 向下滚动查看更多内容
                </div>
            `;
            questionDisplay.appendChild(indicator);
        },
        
        // 移除滚动指示器
        removeScrollIndicator: function() {
            const indicator = document.getElementById('scrollIndicator');
            if (indicator && indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        },
        
        // 触摸手势支持
        setupTouchGestures: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            if (!questionDisplay) return;
            
            let startY = 0;
            let startX = 0;
            let isScrolling = false;
            
            // 触摸开始
            questionDisplay.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
                startX = e.touches[0].clientX;
                isScrolling = false;
            }, { passive: true });
            
            // 触摸移动
            questionDisplay.addEventListener('touchmove', (e) => {
                if (!isScrolling) {
                    const deltaY = Math.abs(e.touches[0].clientY - startY);
                    const deltaX = Math.abs(e.touches[0].clientX - startX);
                    
                    // 如果垂直移动距离大于水平移动距离，认为是滚动
                    if (deltaY > deltaX && deltaY > 10) {
                        isScrolling = true;
                    }
                }
            }, { passive: true });
            
            // 触摸结束
            questionDisplay.addEventListener('touchend', (e) => {
                if (!isScrolling) {
                    const deltaY = e.changedTouches[0].clientY - startY;
                    const deltaX = e.changedTouches[0].clientX - startX;
                    
                    // 检查是否为滑动切换题目
                    if (Math.abs(deltaY) < 50 && Math.abs(deltaX) > 100) {
                        if (deltaX > 0) {
                            this.previousQuestion();
                        } else {
                            this.nextQuestion();
                        }
                    }
                }
            }, { passive: true });
        },
        
        // 智能答题提示系统
        showSmartHint: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            if (!question) return;
            
            // 分析题目类型和内容，提供智能提示
            const hint = this.generateSmartHint(question);
            
            if (hint) {
                this.displayHint(hint);
            }
        },
        
        // 生成智能提示
        generateSmartHint: function(question) {
            const questionText = question.question || question.title || '';
            const questionType = question.type || '选择题';
            
            let hint = '';
            
            // 根据题目类型和关键词生成提示
            if (questionType === '选择题') {
                if (questionText.includes('流体') && questionText.includes('压力')) {
                    hint = '💡 提示：注意流体的压力分布规律，考虑伯努利方程的应用。';
                } else if (questionText.includes('雷诺数')) {
                    hint = '💡 提示：雷诺数决定了流体的流动状态，注意层流和湍流的区别。';
                } else if (questionText.includes('边界层')) {
                    hint = '💡 提示：边界层内粘性力起主导作用，外部为势流。';
                } else {
                    hint = '💡 提示：仔细阅读题目，注意关键词，排除明显错误的选项。';
                }
            } else if (questionType === '填空题') {
                hint = '💡 提示：注意单位的统一，检查计算过程的准确性。';
            } else if (questionType === '计算题') {
                hint = '💡 提示：列出已知条件，选择合适的公式，注意单位换算。';
            }
            
            return hint;
        },
        
        // 显示提示
        displayHint: function(hint) {
            const hintContainer = document.createElement('div');
            hintContainer.id = 'smartHint';
            hintContainer.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #ffc107; border-radius: 20px; padding: 25px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 500px; text-align: center;">
                    <h4 style="color: #333; margin-bottom: 15px;">🤖 智能提示</h4>
                    <p style="color: #666; margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
                        ${hint}
                    </p>
                    <button onclick="QuestionBankPractice.closeHint()" 
                            style="padding: 10px 20px; background: #ffc107; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 14px;">
                        知道了
                    </button>
                </div>
            `;
            
            document.body.appendChild(hintContainer);
        },
        
        // 关闭提示
        closeHint: function() {
            const hint = document.getElementById('smartHint');
            if (hint && hint.parentNode) {
                hint.parentNode.removeChild(hint);
            }
        },
        
        // 语音朗读功能
        speakQuestion: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            if (!question) return;
            
            const questionText = question.question || question.title || '';
            
            // 检查浏览器是否支持语音合成
            if ('speechSynthesis' in window) {
                // 停止当前朗读
                window.speechSynthesis.cancel();
                
                // 创建语音合成对象
                const utterance = new SpeechSynthesisUtterance(questionText);
                utterance.lang = 'zh-CN';
                utterance.rate = 0.8;
                utterance.pitch = 1.0;
                utterance.volume = 0.8;
                
                // 开始朗读
                window.speechSynthesis.speak(utterance);
                
                showNotification('正在朗读题目...', 'info');
            } else {
                showNotification('您的浏览器不支持语音朗读功能', 'warning');
            }
        },
        
        // 停止语音朗读
        stopSpeaking: function() {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                showNotification('已停止朗读', 'info');
            }
        },
        
        // 学习进度分析
        analyzeLearningProgress: function() {
            const totalQuestions = currentSession.questions.length;
            const answeredQuestions = currentSession.userAnswers.filter(answer => answer !== null).length;
            const correctAnswers = currentSession.userAnswers.filter((answer, index) => {
                const question = currentSession.questions[index];
                return answer !== null && this.isAnswerCorrect(answer, question);
            }).length;
            
            const progress = {
                total: totalQuestions,
                answered: answeredQuestions,
                correct: correctAnswers,
                accuracy: answeredQuestions > 0 ? (correctAnswers / answeredQuestions * 100).toFixed(1) : 0,
                remaining: totalQuestions - answeredQuestions
            };
            
            this.displayProgressAnalysis(progress);
        },
        
        // 显示进度分析
        displayProgressAnalysis: function(progress) {
            const analysisContainer = document.createElement('div');
            analysisContainer.id = 'progressAnalysis';
            analysisContainer.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #4facfe; border-radius: 20px; padding: 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 600px; text-align: center;">
                    <h4 style="color: #333; margin-bottom: 20px;">📊 学习进度分析</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
                        <div style="background: #e3f2fd; padding: 15px; border-radius: 15px;">
                            <div style="font-size: 24px; font-weight: bold; color: #4facfe;">${progress.answered}</div>
                            <div style="color: #666; font-size: 14px;">已答题数</div>
                        </div>
                        <div style="background: #e8f5e8; padding: 15px; border-radius: 15px;">
                            <div style="font-size: 24px; font-weight: bold; color: #28a745;">${progress.correct}</div>
                            <div style="color: #666; font-size: 14px;">正确题数</div>
                        </div>
                        <div style="background: #fff3cd; padding: 15px; border-radius: 15px;">
                            <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${progress.accuracy}%</div>
                            <div style="color: #666; font-size: 14px;">正确率</div>
                        </div>
                        <div style="background: #f8d7da; padding: 15px; border-radius: 15px;">
                            <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${progress.remaining}</div>
                            <div style="color: #666; font-size: 14px;">剩余题数</div>
                        </div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; text-align: left;">
                            <h5 style="color: #333; margin-bottom: 10px;">📈 学习建议</h5>
                            <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 20px;">
                                ${this.generateLearningAdvice(progress)}
                            </ul>
                        </div>
                    </div>
                    <button onclick="QuestionBankPractice.closeProgressAnalysis()" 
                            style="padding: 12px 25px; background: #4facfe; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 16px;">
                        关闭
                    </button>
                </div>
            `;
            
            document.body.appendChild(analysisContainer);
        },
        
        // 生成学习建议
        generateLearningAdvice: function(progress) {
            let advice = [];
            
            if (progress.accuracy < 60) {
                advice.push('建议复习基础知识，巩固概念理解');
            } else if (progress.accuracy < 80) {
                advice.push('继续练习，注意细节和计算准确性');
            } else {
                advice.push('表现优秀，可以挑战更高难度的题目');
            }
            
            if (progress.remaining > 0) {
                advice.push(`还有 ${progress.remaining} 道题目待完成，建议合理安排时间`);
            }
            
            if (progress.answered > 0) {
                advice.push('建议查看错题本，重点复习做错的题目');
            }
            
            return advice.map(item => `<li>${item}</li>`).join('');
        },
        
        // 关闭进度分析
        closeProgressAnalysis: function() {
            const analysis = document.getElementById('progressAnalysis');
            if (analysis && analysis.parentNode) {
                analysis.parentNode.removeChild(analysis);
            }
        },
        
        // 自动收集错题
        autoCollectWrongQuestions: function() {
            const userAnswer = currentSession.userAnswers[currentSession.currentIndex];
            const question = currentSession.questions[currentSession.currentIndex];
            
            if (userAnswer !== null && !this.isAnswerCorrect(userAnswer, question)) {
                this.addToWrongBook(question);
            }
        },
        
        // 添加到错题本
        addToWrongBook: function(question) {
            // 获取现有错题
            let wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
            
            // 检查是否已经存在
            const exists = wrongQuestions.some(q => 
                q.question === question.question && q.title === question.title
            );
            
            if (!exists) {
                // 添加错题信息
                const wrongQuestion = {
                    ...question,
                    addedTime: new Date().toISOString(),
                    sessionName: currentSession.sessionName,
                    userAnswer: currentSession.userAnswers[currentSession.currentIndex]
                };
                
                wrongQuestions.push(wrongQuestion);
                localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestions));
                
                showNotification('已自动添加到错题本', 'info');
            }
        },
        
        // 显示帮助信息
        showHelp: function() {
            const helpContainer = document.createElement('div');
            helpContainer.id = 'helpModal';
            helpContainer.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #4facfe; border-radius: 20px; padding: 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 700px; max-height: 80vh; overflow-y: auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">🎯 题库练习帮助</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 15px;">
                            <h5 style="color: #333; margin-bottom: 10px;">⌨️ 键盘快捷键</h5>
                            <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 20px; font-size: 14px;">
                                <li><kbd>←</kbd> <kbd>→</kbd> 上一题/下一题</li>
                                <li><kbd>空格</kbd> 暂停/继续</li>
                                <li><kbd>1-4</kbd> 选择选项</li>
                                <li><kbd>Enter</kbd> 提交答案</li>
                                <li><kbd>Ctrl+F</kbd> 全屏切换</li>
                                <li><kbd>Ctrl+R</kbd> 阅读模式</li>
                                <li><kbd>Ctrl+±</kbd> 字体大小</li>
                                <li><kbd>H</kbd> 智能提示</li>
                                <li><kbd>Ctrl+S</kbd> 语音朗读</li>
                                <li><kbd>Ctrl+M</kbd> 停止朗读</li>
                                <li><kbd>ESC</kbd> 退出练习</li>
                            </ul>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 15px;">
                            <h5 style="color: #333; margin-bottom: 10px;">🖱️ 鼠标操作</h5>
                            <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 20px; font-size: 14px;">
                                <li>滚轮滚动题目内容</li>
                                <li>滚轮在顶部/底部切换题目</li>
                                <li>点击选项选择答案</li>
                                <li>触摸设备支持滑动切换</li>
                                <li>双击题目区域全屏</li>
                            </ul>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 15px;">
                            <h5 style="color: #333; margin-bottom: 10px;">🤖 智能功能</h5>
                            <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 20px; font-size: 14px;">
                                <li>智能答题提示</li>
                                <li>自动错题收集</li>
                                <li>学习进度分析</li>
                                <li>语音朗读题目</li>
                                <li>字体大小自适应</li>
                                <li>阅读模式优化</li>
                            </ul>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 15px;">
                            <h5 style="color: #333; margin-bottom: 10px;">📊 学习统计</h5>
                            <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 20px; font-size: 14px;">
                                <li>实时答题进度</li>
                                <li>正确率统计</li>
                                <li>答题时间分析</li>
                                <li>错题本管理</li>
                                <li>学习建议生成</li>
                                <li>数据导出功能</li>
                            </ul>
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <button onclick="QuestionBankPractice.closeHelp()" 
                                style="padding: 12px 25px; background: #4facfe; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 16px;">
                            知道了
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(helpContainer);
        },
        
        // 关闭帮助
        closeHelp: function() {
            const help = document.getElementById('helpModal');
            if (help && help.parentNode) {
                help.parentNode.removeChild(help);
            }
        },
        
        // 激活智能学习模式
        activateSmartLearning: function() {
            showNotification('智能学习模式已激活', 'success');
        },
        
        // 停用智能学习模式
        deactivateSmartLearning: function() {
            showNotification('智能学习模式已停用', 'info');
        },
        
        // 实时笔记功能
        toggleNotePanel: function() {
            const notePanel = document.getElementById('notePanel');
            
            if (notePanel) {
                notePanel.remove();
            } else {
                this.createNotePanel();
            }
        },
        
        // 创建笔记面板
        createNotePanel: function() {
            const notePanel = document.createElement('div');
            notePanel.id = 'notePanel';
            notePanel.innerHTML = `
                <div style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.95); border: 2px solid #ffc107; border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 10000; width: 300px; max-height: 80vh;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h5 style="color: #333; margin: 0;">📝 学习笔记</h5>
                        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #666; cursor: pointer; font-size: 18px;">×</button>
                    </div>
                    <textarea id="noteContent" placeholder="在这里记录学习笔记..." style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; resize: vertical; font-size: 14px;"></textarea>
                    <div style="margin-top: 10px; display: flex; gap: 10px;">
                        <button onclick="QuestionBankPractice.saveNote()" style="padding: 8px 15px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">保存</button>
                        <button onclick="QuestionBankPractice.loadNote()" style="padding: 8px 15px; background: #17a2b8; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">加载</button>
                        <button onclick="QuestionBankPractice.clearNote()" style="padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">清空</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(notePanel);
        },
        
        // 保存笔记
        saveNote: function() {
            const noteContent = document.getElementById('noteContent');
            if (!noteContent) return;
            
            const content = noteContent.value.trim();
            if (!content) {
                showNotification('请输入笔记内容', 'warning');
                return;
            }
            
            const note = {
                id: Date.now(),
                content: content,
                questionIndex: currentSession.currentIndex,
                timestamp: new Date().toISOString(),
                questionTitle: currentSession.questions[currentSession.currentIndex]?.title || `题目 ${currentSession.currentIndex + 1}`
            };
            
            // 保存到本地存储
            let notes = JSON.parse(localStorage.getItem('questionNotes') || '[]');
            notes.push(note);
            localStorage.setItem('questionNotes', JSON.stringify(notes));
            
            showNotification('笔记已保存', 'success');
        },
        
        // 加载笔记
        loadNote: function() {
            const noteContent = document.getElementById('noteContent');
            if (!noteContent) return;
            
            const notes = JSON.parse(localStorage.getItem('questionNotes') || '[]');
            const currentNote = notes.find(note => note.questionIndex === currentSession.currentIndex);
            
            if (currentNote) {
                noteContent.value = currentNote.content;
                showNotification('已加载当前题目的笔记', 'info');
            } else {
                noteContent.value = '';
                showNotification('当前题目暂无笔记', 'info');
            }
        },
        
        // 清空笔记
        clearNote: function() {
            const noteContent = document.getElementById('noteContent');
            if (!noteContent) return;
            
            if (confirm('确定要清空当前笔记吗？')) {
                noteContent.value = '';
                showNotification('笔记已清空', 'info');
            }
        },
        
        // 学习路径推荐
        showLearningPath: function() {
            const path = this.generateLearningPath();
            this.displayLearningPath(path);
        },
        
        // 生成学习路径
        generateLearningPath: function() {
            const answeredQuestions = currentSession.userAnswers.filter(answer => answer !== null);
            const correctAnswers = answeredQuestions.filter((answer, index) => {
                const question = currentSession.questions[index];
                return this.isAnswerCorrect(answer, question);
            });
            
            const accuracy = answeredQuestions.length > 0 ? (correctAnswers.length / answeredQuestions.length) * 100 : 0;
            
            let path = [];
            
            if (accuracy < 60) {
                path = [
                    { step: 1, title: '基础概念复习', description: '重点复习流体力学基本概念', difficulty: 'easy' },
                    { step: 2, title: '公式理解', description: '深入理解伯努利方程等核心公式', difficulty: 'medium' },
                    { step: 3, title: '应用练习', description: '通过实际题目练习应用', difficulty: 'medium' }
                ];
            } else if (accuracy < 80) {
                path = [
                    { step: 1, title: '查漏补缺', description: '针对错题进行专项练习', difficulty: 'medium' },
                    { step: 2, title: '综合应用', description: '练习综合性题目', difficulty: 'medium' },
                    { step: 3, title: '进阶挑战', description: '尝试高难度题目', difficulty: 'hard' }
                ];
            } else {
                path = [
                    { step: 1, title: '知识巩固', description: '巩固已掌握的知识点', difficulty: 'medium' },
                    { step: 2, title: '深度拓展', description: '学习更深层次的内容', difficulty: 'hard' },
                    { step: 3, title: '创新应用', description: '尝试创新性题目', difficulty: 'hard' }
                ];
            }
            
            return path;
        },
        
        // 显示学习路径
        displayLearningPath: function(path) {
            const pathContainer = document.createElement('div');
            pathContainer.id = 'learningPath';
            pathContainer.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #20c997; border-radius: 20px; padding: 25px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 500px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">🎯 推荐学习路径</h4>
                    <div style="margin-bottom: 20px;">
                        ${path.map(item => `
                            <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                                <div style="width: 30px; height: 30px; background: #20c997; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">
                                    ${item.step}
                                </div>
                                <div style="flex: 1;">
                                    <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${item.title}</div>
                                    <div style="color: #666; font-size: 14px;">${item.description}</div>
                                    <span style="background: #20c997; color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin-top: 5px; display: inline-block;">${item.difficulty}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="text-align: center;">
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="padding: 10px 20px; background: #20c997; color: white; border: none; border-radius: 10px; cursor: pointer;">
                            开始学习
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(pathContainer);
        },
        
        // 智能学习模式
        toggleSmartLearningMode: function() {
            const isSmartMode = localStorage.getItem('smartLearningMode') === 'true';
            const newMode = !isSmartMode;
            
            localStorage.setItem('smartLearningMode', newMode);
            
            if (newMode) {
                showNotification('已开启智能学习模式', 'success');
                this.activateSmartLearning();
            } else {
                showNotification('已关闭智能学习模式', 'info');
                this.deactivateSmartLearning();
            }
        },
        
        // 激活智能学习模式
        activateSmartLearning: function() {
            // 智能学习模式功能
            this.analyzeUserPerformance();
            this.suggestNextQuestion();
            this.showLearningTips();
        },
        
        // 停用智能学习模式
        deactivateSmartLearning: function() {
            // 清理智能学习相关元素
            const smartElements = document.querySelectorAll('.smart-learning-element');
            smartElements.forEach(el => el.remove());
        },
        
        // 分析用户表现
        analyzeUserPerformance: function() {
            const answeredQuestions = currentSession.userAnswers.filter(answer => answer !== null);
            const correctAnswers = answeredQuestions.filter((answer, index) => {
                const question = currentSession.questions[index];
                return this.isAnswerCorrect(answer, question);
            });
            
            const accuracy = answeredQuestions.length > 0 ? (correctAnswers.length / answeredQuestions.length) * 100 : 0;
            const avgTime = this.calculateAverageTime();
            
            // 根据表现调整学习策略
            this.adjustLearningStrategy(accuracy, avgTime);
        },
        
        // 计算平均答题时间
        calculateAverageTime: function() {
            const times = currentSession.questionTimes.filter(time => time > 0);
            if (times.length === 0) return 0;
            
            return times.reduce((sum, time) => sum + time, 0) / times.length;
        },
        
        // 调整学习策略
        adjustLearningStrategy: function(accuracy, avgTime) {
            let strategy = '';
            
            if (accuracy < 60) {
                strategy = '建议复习基础知识，重点关注概念理解';
            } else if (accuracy < 80) {
                strategy = '继续练习，注意细节和计算准确性';
            } else {
                strategy = '表现优秀，可以挑战更高难度的题目';
            }
            
            if (avgTime > 120) {
                strategy += '，建议提高答题速度';
            }
            
            this.showLearningStrategy(strategy);
        },
        
        // 建议下一题
        suggestNextQuestion: function() {
            const currentQuestion = currentSession.questions[currentSession.currentIndex];
            const userAnswer = currentSession.userAnswers[currentSession.currentIndex];
            
            if (userAnswer !== null) {
                const isCorrect = this.isAnswerCorrect(userAnswer, currentQuestion);
                
                // 根据答题情况推荐下一题
                if (!isCorrect) {
                    // 答错了，推荐相关的基础题目
                    this.recommendRelatedQuestions(currentQuestion);
                } else {
                    // 答对了，推荐进阶题目
                    this.recommendAdvancedQuestions(currentQuestion);
                }
            }
        },
        
        // 推荐相关题目
        recommendRelatedQuestions: function(question) {
            const relatedQuestions = this.findRelatedQuestions(question);
            if (relatedQuestions.length > 0) {
                this.showRecommendation('建议复习相关题目', relatedQuestions);
            }
        },
        
        // 推荐进阶题目
        recommendAdvancedQuestions: function(question) {
            const advancedQuestions = this.findAdvancedQuestions(question);
            if (advancedQuestions.length > 0) {
                this.showRecommendation('可以挑战进阶题目', advancedQuestions);
            }
        },
        
        // 查找相关题目
        findRelatedQuestions: function(question) {
            // 基于知识点和难度查找相关题目
            const keywords = this.extractKeywords(question.question || question.title || '');
            const related = currentSession.questions.filter(q => {
                const qKeywords = this.extractKeywords(q.question || q.title || '');
                const commonKeywords = keywords.filter(k => qKeywords.includes(k));
                return commonKeywords.length > 0 && q.difficulty === 'easy';
            });
            
            return related.slice(0, 3); // 返回前3个相关题目
        },
        
        // 查找进阶题目
        findAdvancedQuestions: function(question) {
            const keywords = this.extractKeywords(question.question || question.title || '');
            const advanced = currentSession.questions.filter(q => {
                const qKeywords = this.extractKeywords(q.question || q.title || '');
                const commonKeywords = keywords.filter(k => qKeywords.includes(k));
                return commonKeywords.length > 0 && q.difficulty === 'hard';
            });
            
            return advanced.slice(0, 3);
        },
        
        // 提取关键词
        extractKeywords: function(text) {
            const keywords = ['流体', '压力', '速度', '雷诺数', '边界层', '粘性', '势流', '湍流', '层流', '伯努利', '动量', '能量'];
            return keywords.filter(keyword => text.includes(keyword));
        },
        
        // 显示推荐
        showRecommendation: function(title, questions) {
            const recommendation = document.createElement('div');
            recommendation.className = 'smart-learning-element';
            recommendation.innerHTML = `
                <div style="position: fixed; top: 20px; left: 20px; background: rgba(255,255,255,0.95); border: 2px solid #4facfe; border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 10000; max-width: 400px;">
                    <h5 style="color: #333; margin-bottom: 15px;">🤖 ${title}</h5>
                    <div style="max-height: 200px; overflow-y: auto;">
                        ${questions.map((q, index) => `
                            <div style="background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 8px; cursor: pointer;" onclick="QuestionBankPractice.jumpToQuestion(${currentSession.questions.indexOf(q)})">
                                <div style="font-weight: bold; color: #4facfe;">题目 ${currentSession.questions.indexOf(q) + 1}</div>
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">${(q.question || q.title || '').substring(0, 50)}...</div>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 15px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">关闭</button>
                </div>
            `;
            
            document.body.appendChild(recommendation);
            
            // 5秒后自动消失
            setTimeout(() => {
                if (recommendation.parentNode) {
                    recommendation.parentNode.removeChild(recommendation);
                }
            }, 5000);
        },
        
        // 跳转到指定题目
        jumpToQuestion: function(index) {
            if (index >= 0 && index < currentSession.questions.length) {
                currentSession.currentIndex = index;
                this.displayCurrentQuestion();
                showNotification(`已跳转到题目 ${index + 1}`, 'info');
            }
        },
        
        // 显示学习策略
        showLearningStrategy: function(strategy) {
            const strategyElement = document.createElement('div');
            strategyElement.className = 'smart-learning-element';
            strategyElement.innerHTML = `
                <div style="position: fixed; bottom: 20px; right: 20px; background: rgba(255,255,255,0.95); border: 2px solid #28a745; border-radius: 15px; padding: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 10000; max-width: 300px;">
                    <h6 style="color: #333; margin-bottom: 10px;">📈 学习建议</h6>
                    <p style="color: #666; font-size: 14px; line-height: 1.4; margin: 0;">${strategy}</p>
                    <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 3px 10px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">知道了</button>
                </div>
            `;
            
            document.body.appendChild(strategyElement);
            
            // 8秒后自动消失
            setTimeout(() => {
                if (strategyElement.parentNode) {
                    strategyElement.parentNode.removeChild(strategyElement);
                }
            }, 8000);
        },
        
        // 实时笔记功能
        toggleNotePanel: function() {
            const notePanel = document.getElementById('notePanel');
            
            if (notePanel) {
                notePanel.remove();
            } else {
                this.createNotePanel();
            }
        },
        
        // 创建笔记面板
        createNotePanel: function() {
            const notePanel = document.createElement('div');
            notePanel.id = 'notePanel';
            notePanel.innerHTML = `
                <div style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.95); border: 2px solid #ffc107; border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 10000; width: 300px; max-height: 80vh;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h5 style="color: #333; margin: 0;">📝 学习笔记</h5>
                        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #666; cursor: pointer; font-size: 18px;">×</button>
                    </div>
                    <textarea id="noteContent" placeholder="在这里记录学习笔记..." style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; resize: vertical; font-size: 14px;"></textarea>
                    <div style="margin-top: 10px; display: flex; gap: 10px;">
                        <button onclick="QuestionBankPractice.saveNote()" style="padding: 8px 15px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">保存</button>
                        <button onclick="QuestionBankPractice.loadNote()" style="padding: 8px 15px; background: #17a2b8; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">加载</button>
                        <button onclick="QuestionBankPractice.clearNote()" style="padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">清空</button>
                    </div>
                    <div id="noteHistory" style="margin-top: 15px; max-height: 150px; overflow-y: auto;">
                        <h6 style="color: #333; margin-bottom: 10px;">📚 笔记历史</h6>
                        <div id="noteList"></div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(notePanel);
            this.loadNoteHistory();
        },
        
        // 保存笔记
        saveNote: function() {
            const noteContent = document.getElementById('noteContent');
            if (!noteContent) return;
            
            const content = noteContent.value.trim();
            if (!content) {
                showNotification('请输入笔记内容', 'warning');
                return;
            }
            
            const note = {
                id: Date.now(),
                content: content,
                questionIndex: currentSession.currentIndex,
                timestamp: new Date().toISOString(),
                questionTitle: currentSession.questions[currentSession.currentIndex]?.title || `题目 ${currentSession.currentIndex + 1}`
            };
            
            // 保存到本地存储
            let notes = JSON.parse(localStorage.getItem('questionNotes') || '[]');
            notes.push(note);
            localStorage.setItem('questionNotes', JSON.stringify(notes));
            
            showNotification('笔记已保存', 'success');
            this.loadNoteHistory();
        },
        
        // 加载笔记
        loadNote: function() {
            const noteContent = document.getElementById('noteContent');
            if (!noteContent) return;
            
            const notes = JSON.parse(localStorage.getItem('questionNotes') || '[]');
            const currentNote = notes.find(note => note.questionIndex === currentSession.currentIndex);
            
            if (currentNote) {
                noteContent.value = currentNote.content;
                showNotification('已加载当前题目的笔记', 'info');
            } else {
                noteContent.value = '';
                showNotification('当前题目暂无笔记', 'info');
            }
        },
        
        // 清空笔记
        clearNote: function() {
            const noteContent = document.getElementById('noteContent');
            if (!noteContent) return;
            
            if (confirm('确定要清空当前笔记吗？')) {
                noteContent.value = '';
                showNotification('笔记已清空', 'info');
            }
        },
        
        // 加载笔记历史
        loadNoteHistory: function() {
            const noteList = document.getElementById('noteList');
            if (!noteList) return;
            
            const notes = JSON.parse(localStorage.getItem('questionNotes') || '[]');
            
            noteList.innerHTML = notes.slice(-5).reverse().map(note => `
                <div style="background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 8px; cursor: pointer;" onclick="QuestionBankPractice.loadNoteById(${note.id})">
                    <div style="font-weight: bold; color: #333; font-size: 12px;">${note.questionTitle}</div>
                    <div style="color: #666; font-size: 11px; margin-top: 3px;">${new Date(note.timestamp).toLocaleString()}</div>
                    <div style="color: #333; font-size: 11px; margin-top: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${note.content.substring(0, 50)}...</div>
                </div>
            `).join('');
        },
        
        // 根据ID加载笔记
        loadNoteById: function(noteId) {
            const notes = JSON.parse(localStorage.getItem('questionNotes') || '[]');
            const note = notes.find(n => n.id === noteId);
            
            if (note) {
                const noteContent = document.getElementById('noteContent');
                if (noteContent) {
                    noteContent.value = note.content;
                    showNotification('已加载笔记', 'info');
                }
            }
        },
        
        // 知识点关联分析
        analyzeKnowledgePoints: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            if (!question) return;
            
            const knowledgePoints = this.extractKnowledgePoints(question);
            const relatedPoints = this.findRelatedKnowledgePoints(knowledgePoints);
            
            this.showKnowledgeAnalysis(knowledgePoints, relatedPoints);
        },
        
        // 提取知识点
        extractKnowledgePoints: function(question) {
            const text = question.question || question.title || '';
            const points = [];
            
            // 流体力学知识点映射
            const knowledgeMap = {
                '伯努利': '伯努利方程',
                '雷诺数': '雷诺数',
                '边界层': '边界层理论',
                '粘性': '粘性流体',
                '势流': '势流理论',
                '湍流': '湍流',
                '层流': '层流',
                '压力': '压力分布',
                '速度': '速度场',
                '动量': '动量方程',
                '能量': '能量方程'
            };
            
            Object.keys(knowledgeMap).forEach(keyword => {
                if (text.includes(keyword)) {
                    points.push(knowledgeMap[keyword]);
                }
            });
            
            return points;
        },
        
        // 查找相关知识点
        findRelatedKnowledgePoints: function(points) {
            const related = {};
            
            points.forEach(point => {
                switch(point) {
                    case '伯努利方程':
                        related[point] = ['压力分布', '速度场', '能量守恒'];
                        break;
                    case '雷诺数':
                        related[point] = ['层流', '湍流', '粘性流体'];
                        break;
                    case '边界层理论':
                        related[point] = ['粘性流体', '势流理论', '压力分布'];
                        break;
                    default:
                        related[point] = ['相关概念'];
                }
            });
            
            return related;
        },
        
                // 显示知识点分析
        showKnowledgeAnalysis: function(points, related) {
            const analysis = document.createElement('div');
            analysis.id = 'knowledgeAnalysis';
            analysis.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #6f42c1; border-radius: 20px; padding: 25px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">🧠 知识点分析</h4>
                    <div style="margin-bottom: 20px;">
                        <h5 style="color: #333; margin-bottom: 10px;">📚 本题涉及知识点</h5>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                            ${points.map(point => `
                                <span style="background: #6f42c1; color: white; padding: 5px 12px; border-radius: 15px; font-size: 12px;">${point}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <h5 style="color: #333; margin-bottom: 10px;">🔗 相关知识点</h5>
                        ${Object.entries(related).map(([point, relatedPoints]) => `
                            <div style="margin-bottom: 15px;">
                                <div style="font-weight: bold; color: #6f42c1; margin-bottom: 5px;">${point}:</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                                    ${relatedPoints.map(rp => `
                                        <span style="background: #e9ecef; color: #495057; padding: 3px 8px; border-radius: 10px; font-size: 11px;">${rp}</span>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="padding: 10px 20px; background: #6f42c1; color: white; border: none; border-radius: 10px; cursor: pointer;">
                        关闭
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(analysis);
        },

        // 高级功能：语音朗读
        toggleVoiceReading: function() {
            if ('speechSynthesis' in window) {
                const question = currentSession.questions[currentSession.currentIndex];
                const text = question.question || question.title || '';
                
                if (speechSynthesis.speaking) {
                    speechSynthesis.cancel();
                    showNotification('已停止朗读', 'info');
                } else {
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'zh-CN';
                    utterance.rate = 0.8;
                    utterance.pitch = 1;
                    speechSynthesis.speak(utterance);
                    showNotification('正在朗读题目', 'success');
                }
            } else {
                showNotification('您的浏览器不支持语音朗读功能', 'warning');
            }
        },

        // 高级功能：题目收藏
        toggleFavorite: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            const favorites = JSON.parse(localStorage.getItem('questionFavorites') || '[]');
            
            const existingIndex = favorites.findIndex(fav => 
                fav.questionId === question.id || 
                fav.question === question.question
            );
            
            if (existingIndex >= 0) {
                favorites.splice(existingIndex, 1);
                showNotification('已取消收藏', 'info');
            } else {
                favorites.push({
                    questionId: question.id,
                    question: question.question || question.title,
                    answer: question.answer,
                    explanation: question.explanation,
                    timestamp: new Date().toISOString(),
                    bankId: currentSession.bankId
                });
                showNotification('已添加到收藏', 'success');
            }
            
            localStorage.setItem('questionFavorites', JSON.stringify(favorites));
        },

        // 高级功能：题目分享
        shareQuestion: function() {
            const question = currentSession.questions[currentSession.currentIndex];
            const shareText = `题目：${question.question || question.title}\n答案：${question.answer}\n解释：${question.explanation}`;
            
            if (navigator.share) {
                navigator.share({
                    title: '流体力学题目分享',
                    text: shareText,
                    url: window.location.href
                }).catch(err => {
                    this.copyToClipboard(shareText);
                });
            } else {
                this.copyToClipboard(shareText);
            }
        },

        // 复制到剪贴板
        copyToClipboard: function(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showNotification('已复制到剪贴板', 'success');
                }).catch(() => {
                    this.fallbackCopyToClipboard(text);
                });
            } else {
                this.fallbackCopyToClipboard(text);
            }
        },

        // 备用复制方法
        fallbackCopyToClipboard: function(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification('已复制到剪贴板', 'success');
            } catch (err) {
                showNotification('复制失败', 'error');
            }
            document.body.removeChild(textArea);
        },

        // 高级功能：学习模式切换
        toggleLearningMode: function() {
            const modes = ['normal', 'exam', 'review', 'speed'];
            const currentMode = localStorage.getItem('learningMode') || 'normal';
            const currentIndex = modes.indexOf(currentMode);
            const nextMode = modes[(currentIndex + 1) % modes.length];
            
            localStorage.setItem('learningMode', nextMode);
            
            const modeNames = {
                normal: '普通模式',
                exam: '考试模式',
                review: '复习模式',
                speed: '速答模式'
            };
            
            showNotification(`已切换到${modeNames[nextMode]}`, 'success');
            this.applyLearningMode(nextMode);
        },

        // 应用学习模式
        applyLearningMode: function(mode) {
            switch(mode) {
                case 'exam':
                    // 考试模式：隐藏答案，计时，不能返回
                    this.hideAnswerDisplay();
                    this.startExamTimer();
                    break;
                case 'review':
                    // 复习模式：显示答案，重点标记
                    this.showAnswerDisplay();
                    this.highlightKeyPoints();
                    break;
                case 'speed':
                    // 速答模式：简化界面，快速答题
                    this.simplifyInterface();
                    this.enableSpeedMode();
                    break;
                default:
                    // 普通模式：正常功能
                    this.resetToNormalMode();
                    break;
            }
        },

        // 隐藏答案显示
        hideAnswerDisplay: function() {
            const answerDisplay = document.getElementById('answerDisplay');
            if (answerDisplay) {
                answerDisplay.style.display = 'none';
            }
        },

        // 显示答案显示
        showAnswerDisplay: function() {
            const answerDisplay = document.getElementById('answerDisplay');
            if (answerDisplay) {
                answerDisplay.style.display = 'block';
            }
        },

        // 开始考试计时
        startExamTimer: function() {
            const examTime = 120; // 2小时
            let remainingTime = examTime * 60;
            
            const timer = setInterval(() => {
                remainingTime--;
                const hours = Math.floor(remainingTime / 3600);
                const minutes = Math.floor((remainingTime % 3600) / 60);
                const seconds = remainingTime % 60;
                
                const timeDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                // 更新计时器显示
                const timerElement = document.getElementById('examTimer');
                if (timerElement) {
                    timerElement.textContent = `考试时间：${timeDisplay}`;
                }
                
                if (remainingTime <= 0) {
                    clearInterval(timer);
                    this.finishExam();
                }
            }, 1000);
        },

        // 完成考试
        finishExam: function() {
            showNotification('考试时间到！', 'warning');
            this.showExamResults();
        },

        // 显示考试结果
        showExamResults: function() {
            const results = this.calculateExamResults();
            const resultsModal = document.createElement('div');
            resultsModal.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #dc3545; border-radius: 20px; padding: 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 500px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">📊 考试结果</h4>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 48px; font-weight: bold; color: #dc3545;">${results.score}分</div>
                        <div style="color: #666; margin-top: 10px;">正确率：${results.accuracy}%</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>总题数：</span>
                            <span style="font-weight: bold;">${results.totalQuestions}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>正确题数：</span>
                            <span style="font-weight: bold; color: #28a745;">${results.correctAnswers}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>错误题数：</span>
                            <span style="font-weight: bold; color: #dc3545;">${results.wrongAnswers}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>用时：</span>
                            <span style="font-weight: bold;">${results.timeUsed}</span>
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <button onclick="this.parentElement.parentElement.remove(); QuestionBankPractice.exitPractice()" 
                                style="padding: 12px 25px; background: #dc3545; color: white; border: none; border-radius: 10px; cursor: pointer;">
                        退出考试
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(resultsModal);
        },

        // 计算考试结果
        calculateExamResults: function() {
            const totalQuestions = currentSession.questions.length;
            const answeredQuestions = currentSession.userAnswers.filter(answer => answer !== null);
            const correctAnswers = answeredQuestions.filter((answer, index) => {
                const question = currentSession.questions[index];
                return this.isAnswerCorrect(answer, question);
            });
            
            const score = Math.round((correctAnswers.length / totalQuestions) * 100);
            const accuracy = Math.round((correctAnswers.length / answeredQuestions.length) * 100);
            
            const timeUsed = this.formatTime(Date.now() - currentSession.startTime);
            
            return {
                score,
                accuracy,
                totalQuestions,
                correctAnswers: correctAnswers.length,
                wrongAnswers: answeredQuestions.length - correctAnswers.length,
                timeUsed
            };
        },

        // 格式化时间
        formatTime: function(milliseconds) {
            const seconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            
            if (hours > 0) {
                return `${hours}小时${minutes % 60}分钟`;
            } else if (minutes > 0) {
                return `${minutes}分钟${seconds % 60}秒`;
            } else {
                return `${seconds}秒`;
            }
        },

        // 高亮重点
        highlightKeyPoints: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            if (!questionDisplay) return;
            
            const text = questionDisplay.innerHTML;
            const highlightedText = text.replace(
                /(伯努利|雷诺数|边界层|粘性|势流|湍流|层流|压力|速度|动量|能量)/g,
                '<mark style="background: #ffeb3b; padding: 2px 4px; border-radius: 3px;">$1</mark>'
            );
            
            questionDisplay.innerHTML = highlightedText;
        },

        // 简化界面
        simplifyInterface: function() {
            const elementsToHide = [
                'notePanel',
                'helpBtn',
                'themeBtn',
                'statsBtn'
            ];
            
            elementsToHide.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.style.display = 'none';
                }
            });
        },

        // 启用速答模式
        enableSpeedMode: function() {
            // 自动提交答案
            this.autoSubmitOnSelect = true;
            
            // 简化选项显示
            const optionItems = document.querySelectorAll('.option-item');
            optionItems.forEach(item => {
                item.style.padding = '8px 12px';
                item.style.margin = '5px 0';
            });
        },

        // 重置为普通模式
        resetToNormalMode: function() {
            this.autoSubmitOnSelect = false;
            
            const elementsToShow = [
                'notePanel',
                'helpBtn',
                'themeBtn',
                'statsBtn'
            ];
            
            elementsToShow.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.style.display = 'block';
                }
            });
        },

        // 高级功能：题目难度自适应
        adaptiveDifficulty: function() {
            const recentAnswers = currentSession.userAnswers.slice(-5).filter(answer => answer !== null);
            const correctCount = recentAnswers.filter((answer, index) => {
                const questionIndex = currentSession.currentIndex - recentAnswers.length + index;
                const question = currentSession.questions[questionIndex];
                return this.isAnswerCorrect(answer, question);
            }).length;
            
            const accuracy = recentAnswers.length > 0 ? correctCount / recentAnswers.length : 0.5;
            
            // 根据正确率调整下一题难度
            if (accuracy > 0.8) {
                this.suggestHarderQuestion();
            } else if (accuracy < 0.4) {
                this.suggestEasierQuestion();
            }
        },

        // 建议更难的题目
        suggestHarderQuestion: function() {
            const harderQuestions = currentSession.questions.filter(q => q.difficulty === 'hard');
            if (harderQuestions.length > 0) {
                const randomHard = harderQuestions[Math.floor(Math.random() * harderQuestions.length)];
                const index = currentSession.questions.indexOf(randomHard);
                this.jumpToQuestion(index);
            }
        },

        // 建议更简单的题目
        suggestEasierQuestion: function() {
            const easierQuestions = currentSession.questions.filter(q => q.difficulty === 'easy');
            if (easierQuestions.length > 0) {
                const randomEasy = easierQuestions[Math.floor(Math.random() * easierQuestions.length)];
                const index = currentSession.questions.indexOf(randomEasy);
                this.jumpToQuestion(index);
            }
        },

        // 高级功能：学习进度可视化
        showProgressVisualization: function() {
            const progress = this.calculateProgressData();
            const chart = this.createProgressChart(progress);
            
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #17a2b8; border-radius: 20px; padding: 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 700px; max-height: 80vh; overflow-y: auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">📈 学习进度可视化</h4>
                    <div id="progressChart" style="margin-bottom: 20px;"></div>
                    <div style="text-align: center;">
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="padding: 10px 20px; background: #17a2b8; color: white; border: none; border-radius: 10px; cursor: pointer;">
                        关闭
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 渲染图表
            const chartContainer = modal.querySelector('#progressChart');
            chartContainer.innerHTML = chart;
        },

        // 计算进度数据
        calculateProgressData: function() {
            const totalQuestions = currentSession.questions.length;
            const answeredQuestions = currentSession.userAnswers.filter(answer => answer !== null);
            const correctAnswers = answeredQuestions.filter((answer, index) => {
                const question = currentSession.questions[index];
                return this.isAnswerCorrect(answer, question);
            });
            
            const progress = [];
            let correctCount = 0;
            
            for (let i = 0; i < answeredQuestions.length; i++) {
                const question = currentSession.questions[i];
                const isCorrect = this.isAnswerCorrect(answeredQuestions[i], question);
                if (isCorrect) correctCount++;
                
                progress.push({
                    question: i + 1,
                    accuracy: (correctCount / (i + 1)) * 100,
                    time: currentSession.questionTimes[i] || 0
                });
            }
            
            return progress;
        },

        // 创建进度图表
        createProgressChart: function(progress) {
            if (progress.length === 0) {
                return '<p style="text-align: center; color: #666;">暂无进度数据</p>';
            }
            
            const maxAccuracy = Math.max(...progress.map(p => p.accuracy));
            const chartHeight = 200;
            
            let chartHTML = '<div style="position: relative; height: 200px; border-bottom: 2px solid #ddd; border-left: 2px solid #ddd;">';
            
            progress.forEach((point, index) => {
                const x = (index / (progress.length - 1)) * 100;
                const y = (point.accuracy / maxAccuracy) * 100;
                
                chartHTML += `
                    <div style="position: absolute; left: ${x}%; bottom: ${y}%; width: 8px; height: 8px; background: #17a2b8; border-radius: 50%; transform: translate(-50%, 50%);"></div>
                `;
                
                if (index > 0) {
                    const prevPoint = progress[index - 1];
                    const prevX = ((index - 1) / (progress.length - 1)) * 100;
                    const prevY = (prevPoint.accuracy / maxAccuracy) * 100;
                    
                    chartHTML += `
                        <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
                            <line x1="${prevX}%" y1="${100 - prevY}%" x2="${x}%" y2="${100 - y}%" stroke="#17a2b8" stroke-width="2"/>
                        </svg>
                    `;
                }
            });
            
            chartHTML += '</div>';
            
            return chartHTML;
        },

        // 高级功能：无障碍模式
        toggleAccessibilityMode: function() {
            const isAccessible = localStorage.getItem('accessibilityMode') === 'true';
            const newMode = !isAccessible;
            
            localStorage.setItem('accessibilityMode', newMode);
            
            if (newMode) {
                this.enableAccessibilityFeatures();
                showNotification('已开启无障碍模式', 'success');
            } else {
                this.disableAccessibilityFeatures();
                showNotification('已关闭无障碍模式', 'info');
            }
        },

        // 启用无障碍功能
        enableAccessibilityFeatures: function() {
            document.body.style.fontSize = '18px';
            document.body.style.lineHeight = '1.8';
            document.body.style.filter = 'contrast(1.2)';
            
            const style = document.createElement('style');
            style.id = 'accessibility-style';
            style.textContent = `
                *:focus {
                    outline: 3px solid #ff6b6b !important;
                    outline-offset: 2px !important;
                }
                .option-item:hover {
                    background-color: #e3f2fd !important;
                    transform: scale(1.02) !important;
                }
                button:hover {
                    transform: scale(1.05) !important;
                }
            `;
            document.head.appendChild(style);
        },

        // 禁用无障碍功能
        disableAccessibilityFeatures: function() {
            document.body.style.fontSize = '';
            document.body.style.lineHeight = '';
            document.body.style.filter = '';
            
            const style = document.getElementById('accessibility-style');
            if (style) {
                style.remove();
            }
        },

        // 高级功能：夜间模式
        toggleNightMode: function() {
            const isNightMode = localStorage.getItem('nightMode') === 'true';
            const newMode = !isNightMode;
            
            localStorage.setItem('nightMode', newMode);
            
            if (newMode) {
                this.enableNightMode();
                showNotification('已开启夜间模式', 'success');
            } else {
                this.disableNightMode();
                showNotification('已关闭夜间模式', 'info');
            }
        },

        // 启用夜间模式
        enableNightMode: function() {
            const style = document.createElement('style');
            style.id = 'night-mode-style';
            style.textContent = `
                body {
                    background-color: #1a1a1a !important;
                    color: #e0e0e0 !important;
                }
                .modal-content, .practice-container {
                    background-color: #2d2d2d !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                }
                .option-item {
                    background-color: #3d3d3d !important;
                    color: #e0e0e0 !important;
                    border-color: #555 !important;
                }
                .option-item:hover {
                    background-color: #4d4d4d !important;
                }
                input, textarea {
                    background-color: #3d3d3d !important;
                    color: #e0e0e0 !important;
                    border-color: #555 !important;
                }
                button {
                    background-color: #4d4d4d !important;
                    color: #e0e0e0 !important;
                    border-color: #555 !important;
                }
                button:hover {
                    background-color: #5d5d5d !important;
                }
            `;
            document.head.appendChild(style);
        },

        // 禁用夜间模式
        disableNightMode: function() {
            const style = document.getElementById('night-mode-style');
            if (style) {
                style.remove();
            }
        },

        // 高级功能：学习成就系统
        checkAchievements: function() {
            const achievements = this.calculateAchievements();
            const newAchievements = achievements.filter(achievement => 
                !JSON.parse(localStorage.getItem('unlockedAchievements') || '[]').includes(achievement.id)
            );
            
            if (newAchievements.length > 0) {
                this.showAchievements(newAchievements);
                this.unlockAchievements(newAchievements);
            }
        },

        // 计算成就
        calculateAchievements: function() {
            const achievements = [];
            const answeredQuestions = currentSession.userAnswers.filter(answer => answer !== null);
            const correctAnswers = answeredQuestions.filter((answer, index) => {
                const question = currentSession.questions[index];
                return this.isAnswerCorrect(answer, question);
            });
            
            const accuracy = answeredQuestions.length > 0 ? (correctAnswers.length / answeredQuestions.length) * 100 : 0;
            
            if (answeredQuestions.length >= 10) {
                achievements.push({ id: 'first_10', name: '初出茅庐', description: '完成10道题目', icon: '🎯' });
            }
            if (answeredQuestions.length >= 50) {
                achievements.push({ id: 'first_50', name: '勤奋学习', description: '完成50道题目', icon: '📚' });
            }
            if (accuracy >= 80) {
                achievements.push({ id: 'high_accuracy', name: '学霸', description: '正确率达到80%', icon: '⭐' });
            }
            
            return achievements;
        },

        // 显示成就
        showAchievements: function(achievements) {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #ffc107; border-radius: 20px; padding: 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 500px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">🏆 获得新成就！</h4>
                    <div style="text-align: center;">
                        ${achievements.map(achievement => `
                            <div style="background: linear-gradient(135deg, #ffc107, #ff9800); color: white; padding: 20px; border-radius: 15px; margin-bottom: 15px;">
                                <div style="font-size: 48px; margin-bottom: 10px;">${achievement.icon}</div>
                                <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${achievement.name}</div>
                                <div style="font-size: 14px; opacity: 0.9;">${achievement.description}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="text-align: center;">
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="padding: 12px 25px; background: #ffc107; color: white; border: none; border-radius: 10px; cursor: pointer;">
                        太棒了！
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        },

        // 解锁成就
        unlockAchievements: function(achievements) {
            const unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
            achievements.forEach(achievement => {
                if (!unlocked.includes(achievement.id)) {
                    unlocked.push(achievement.id);
                }
            });
            localStorage.setItem('unlockedAchievements', JSON.stringify(unlocked));
        },

        // 高级功能：学习报告生成
        generateLearningReport: function() {
            const report = this.calculateLearningReport();
            this.showLearningReport(report);
        },

        // 计算学习报告
        calculateLearningReport: function() {
            const totalQuestions = currentSession.questions.length;
            const answeredQuestions = currentSession.userAnswers.filter(answer => answer !== null);
            const correctAnswers = answeredQuestions.filter((answer, index) => {
                const question = currentSession.questions[index];
                return this.isAnswerCorrect(answer, question);
            });
            
            const accuracy = answeredQuestions.length > 0 ? (correctAnswers.length / answeredQuestions.length) * 100 : 0;
            const completionRate = (answeredQuestions.length / totalQuestions) * 100;
            const avgTime = this.calculateAverageTime();
            
            const knowledgePoints = this.analyzeKnowledgePointMastery();
            const suggestions = this.generateLearningSuggestions(accuracy, knowledgePoints);
            
            return {
                totalQuestions,
                answeredQuestions: answeredQuestions.length,
                correctAnswers: correctAnswers.length,
                accuracy: Math.round(accuracy),
                completionRate: Math.round(completionRate),
                avgTime: this.formatTime(avgTime * 1000),
                knowledgePoints,
                suggestions,
                timestamp: new Date().toISOString()
            };
        },

        // 分析知识点掌握情况
        analyzeKnowledgePointMastery: function() {
            const knowledgeMap = {
                '伯努利': { correct: 0, total: 0, name: '伯努利方程' },
                '雷诺数': { correct: 0, total: 0, name: '雷诺数' },
                '边界层': { correct: 0, total: 0, name: '边界层理论' },
                '粘性': { correct: 0, total: 0, name: '粘性流体' },
                '势流': { correct: 0, total: 0, name: '势流理论' },
                '湍流': { correct: 0, total: 0, name: '湍流' },
                '层流': { correct: 0, total: 0, name: '层流' },
                '压力': { correct: 0, total: 0, name: '压力分布' },
                '速度': { correct: 0, total: 0, name: '速度场' },
                '动量': { correct: 0, total: 0, name: '动量方程' },
                '能量': { correct: 0, total: 0, name: '能量方程' }
            };
            
            currentSession.questions.forEach((question, index) => {
                const userAnswer = currentSession.userAnswers[index];
                if (userAnswer !== null) {
                    const text = question.question || question.title || '';
                    const isCorrect = this.isAnswerCorrect(userAnswer, question);
                    
                    Object.keys(knowledgeMap).forEach(keyword => {
                        if (text.includes(keyword)) {
                            knowledgeMap[keyword].total++;
                            if (isCorrect) {
                                knowledgeMap[keyword].correct++;
                            }
                        }
                    });
                }
            });
            
            Object.keys(knowledgeMap).forEach(key => {
                const point = knowledgeMap[key];
                point.mastery = point.total > 0 ? Math.round((point.correct / point.total) * 100) : 0;
            });
            
            return knowledgeMap;
        },

        // 生成学习建议
        generateLearningSuggestions: function(accuracy, knowledgePoints) {
            const suggestions = [];
            
            if (accuracy < 60) {
                suggestions.push('建议重点复习基础知识，巩固基本概念');
            } else if (accuracy < 80) {
                suggestions.push('继续练习，注意细节和计算准确性');
            } else {
                suggestions.push('表现优秀，可以挑战更高难度的题目');
            }
            
            const weakPoints = Object.values(knowledgePoints).filter(point => point.mastery < 60);
            if (weakPoints.length > 0) {
                const weakPointNames = weakPoints.map(point => point.name).join('、');
                suggestions.push(`建议重点复习：${weakPointNames}`);
            }
            
            return suggestions;
        },

        // 显示学习报告
        showLearningReport: function(report) {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #28a745; border-radius: 20px; padding: 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 800px; max-height: 80vh; overflow-y: auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">📊 学习报告</h4>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
                        <div style="background: rgba(40,167,69,0.1); padding: 20px; border-radius: 15px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #28a745;">${report.accuracy}%</div>
                            <div style="color: #666; margin-top: 5px;">正确率</div>
                        </div>
                        <div style="background: rgba(79,172,254,0.1); padding: 20px; border-radius: 15px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #4facfe;">${report.completionRate}%</div>
                            <div style="color: #666; margin-top: 5px;">完成率</div>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                        <h5 style="color: #333; margin-bottom: 15px;">📚 知识点掌握情况</h5>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                            ${Object.values(report.knowledgePoints).filter(point => point.total > 0).map(point => `
                                <div style="background: white; padding: 10px; border-radius: 8px; border-left: 4px solid ${point.mastery >= 80 ? '#28a745' : point.mastery >= 60 ? '#ffc107' : '#dc3545'};">
                                    <div style="font-weight: bold; color: #333;">${point.name}</div>
                                    <div style="color: #666; font-size: 12px;">${point.correct}/${point.total} 正确</div>
                                    <div style="color: ${point.mastery >= 80 ? '#28a745' : point.mastery >= 60 ? '#ffc107' : '#dc3545'}; font-weight: bold;">${point.mastery}%</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                        <h5 style="color: #333; margin-bottom: 15px;">💡 学习建议</h5>
                        <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 20px;">
                            ${report.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="QuestionBankPractice.exportReport(${JSON.stringify(report).replace(/"/g, '&quot;')})" 
                                style="padding: 12px 25px; background: #17a2b8; color: white; border: none; border-radius: 10px; cursor: pointer; margin-right: 10px;">
                        导出报告
                        </button>
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="padding: 12px 25px; background: #6c757d; color: white; border: none; border-radius: 10px; cursor: pointer;">
                        关闭
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        },

        // 导出学习报告
        exportReport: function(report) {
            const reportText = `
学习报告
生成时间：${new Date(report.timestamp).toLocaleString()}

总体统计：
- 总题数：${report.totalQuestions}
- 已答题数：${report.answeredQuestions}
- 正确题数：${report.correctAnswers}
- 正确率：${report.accuracy}%
- 完成率：${report.completionRate}%
- 平均用时：${report.avgTime}

知识点掌握情况：
${Object.values(report.knowledgePoints).filter(point => point.total > 0).map(point => 
    `- ${point.name}：${point.correct}/${point.total} 正确 (${point.mastery}%)`
).join('\n')}

学习建议：
${report.suggestions.map(suggestion => `- ${suggestion}`).join('\n')}
            `;
            
            const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `学习报告_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('报告已导出', 'success');
        },

        // 高级功能：智能复习
        startSmartReview: function() {
            const wrongQuestions = this.getWrongQuestions();
            if (wrongQuestions.length === 0) {
                showNotification('暂无错题需要复习', 'info');
                return;
            }
            
            const reviewSession = {
                questions: wrongQuestions,
                currentIndex: 0,
                userAnswers: new Array(wrongQuestions.length).fill(null),
                startTime: Date.now(),
                questionTimes: [],
                bankId: 'review',
                sessionName: '智能复习'
            };
            
            const originalSession = { ...currentSession };
            currentSession = reviewSession;
            
            this.displayCurrentQuestion();
            showNotification(`开始复习 ${wrongQuestions.length} 道错题`, 'success');
        },

        // 获取错题
        getWrongQuestions: function() {
            const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
            return wrongQuestions.slice(-20);
        },

        // 高级功能：学习提醒
        setupLearningReminder: function() {
            const reminderTime = localStorage.getItem('learningReminderTime');
            if (reminderTime) {
                this.scheduleReminder(reminderTime);
            }
        },

        // 设置学习提醒
        setLearningReminder: function() {
            const time = prompt('请输入提醒时间（格式：HH:MM，如 20:30）：');
            if (time && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
                localStorage.setItem('learningReminderTime', time);
                this.scheduleReminder(time);
                showNotification(`已设置学习提醒：${time}`, 'success');
            } else {
                showNotification('时间格式不正确', 'error');
            }
        },

        // 安排提醒
        scheduleReminder: function(time) {
            const [hours, minutes] = time.split(':').map(Number);
            const now = new Date();
            const reminderTime = new Date();
            reminderTime.setHours(hours, minutes, 0, 0);
            
            if (reminderTime <= now) {
                reminderTime.setDate(reminderTime.getDate() + 1);
            }
            
            const timeUntilReminder = reminderTime.getTime() - now.getTime();
            
            setTimeout(() => {
                this.showLearningReminder();
                this.scheduleReminder(time);
            }, timeUntilReminder);
        },

        // 显示学习提醒
        showLearningReminder: function() {
            if (Notification.permission === 'granted') {
                new Notification('学习提醒', {
                    body: '该学习了！打开题库练习一下吧',
                    icon: '/favicon.ico'
                });
            } else {
                this.showReminderModal();
            }
        },

        // 显示提醒模态框
        showReminderModal: function() {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #ff6b6b; border-radius: 20px; padding: 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 400px;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">⏰ 学习提醒</h4>
                    <p style="color: #666; text-align: center; margin-bottom: 20px;">该学习了！打开题库练习一下吧</p>
                    <div style="text-align: center;">
                        <button onclick="this.parentElement.parentElement.remove(); window.open('/question-bank.html', '_blank')" 
                                style="padding: 12px 25px; background: #ff6b6b; color: white; border: none; border-radius: 10px; cursor: pointer; margin-right: 10px;">
                        开始学习
                        </button>
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="padding: 12px 25px; background: #6c757d; color: white; border: none; border-radius: 10px; cursor: pointer;">
                        稍后再说
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        },

        // 高级功能：学习计划生成器
        generateLearningPlan: function() {
            const plan = this.createPersonalizedLearningPlan();
            this.showLearningPlan(plan);
        },

        // 创建个性化学习计划
        createPersonalizedLearningPlan: function() {
            const answeredQuestions = currentSession.userAnswers.filter(answer => answer !== null);
            const correctAnswers = answeredQuestions.filter((answer, index) => {
                const question = currentSession.questions[index];
                return this.isAnswerCorrect(answer, question);
            });
            
            const accuracy = answeredQuestions.length > 0 ? (correctAnswers.length / answeredQuestions.length) * 100 : 0;
            const weakPoints = this.identifyWeakPoints();
            
            const plan = {
                dailyGoal: this.calculateDailyGoal(accuracy),
                weeklyTarget: this.calculateWeeklyTarget(accuracy),
                focusAreas: weakPoints,
                recommendedTime: this.calculateRecommendedTime(accuracy),
                studySchedule: this.createStudySchedule(),
                milestones: this.createMilestones(accuracy)
            };
            
            return plan;
        },

        // 识别薄弱点
        identifyWeakPoints: function() {
            const knowledgePoints = this.analyzeKnowledgePointMastery();
            const weakPoints = Object.values(knowledgePoints)
                .filter(point => point.mastery < 60)
                .sort((a, b) => a.mastery - b.mastery)
                .slice(0, 3);
            
            return weakPoints.map(point => ({
                name: point.name,
                mastery: point.mastery,
                target: Math.min(100, point.mastery + 20),
                exercises: this.findExercisesForPoint(point.name)
            }));
        },

        // 查找知识点相关练习
        findExercisesForPoint: function(pointName) {
            const exercises = currentSession.questions.filter(q => {
                const text = q.question || q.title || '';
                return text.includes(pointName.replace('方程', '').replace('理论', '').replace('流体', ''));
            });
            
            return exercises.slice(0, 5);
        },

        // 计算每日目标
        calculateDailyGoal: function(accuracy) {
            if (accuracy < 60) return 20;
            if (accuracy < 80) return 30;
            return 40;
        },

        // 计算每周目标
        calculateWeeklyTarget: function(accuracy) {
            return this.calculateDailyGoal(accuracy) * 5;
        },

        // 计算推荐学习时间
        calculateRecommendedTime: function(accuracy) {
            if (accuracy < 60) return 60; // 60分钟
            if (accuracy < 80) return 45; // 45分钟
            return 30; // 30分钟
        },

        // 创建学习时间表
        createStudySchedule: function() {
            return [
                { day: '周一', time: '20:00-21:00', focus: '基础概念复习' },
                { day: '周二', time: '20:00-21:00', focus: '公式应用练习' },
                { day: '周三', time: '20:00-21:00', focus: '综合题目练习' },
                { day: '周四', time: '20:00-21:00', focus: '错题复习' },
                { day: '周五', time: '20:00-21:00', focus: '模拟测试' },
                { day: '周六', time: '14:00-15:00', focus: '知识点总结' },
                { day: '周日', time: '14:00-15:00', focus: '休息和回顾' }
            ];
        },

        // 创建学习里程碑
        createMilestones: function(accuracy) {
            const milestones = [];
            const currentLevel = this.getCurrentLevel(accuracy);
            
            for (let i = currentLevel; i <= 5; i++) {
                milestones.push({
                    level: i,
                    name: this.getLevelName(i),
                    target: this.getLevelTarget(i),
                    reward: this.getLevelReward(i),
                    completed: i < currentLevel
                });
            }
            
            return milestones;
        },

        // 获取当前等级
        getCurrentLevel: function(accuracy) {
            if (accuracy < 40) return 1;
            if (accuracy < 60) return 2;
            if (accuracy < 80) return 3;
            if (accuracy < 90) return 4;
            return 5;
        },

        // 获取等级名称
        getLevelName: function(level) {
            const names = ['初学者', '进阶者', '熟练者', '专家', '大师'];
            return names[level - 1] || '未知';
        },

        // 获取等级目标
        getLevelTarget: function(level) {
            const targets = ['正确率40%', '正确率60%', '正确率80%', '正确率90%', '正确率95%'];
            return targets[level - 1] || '未知';
        },

        // 获取等级奖励
        getLevelReward: function(level) {
            const rewards = ['基础徽章', '进阶徽章', '熟练徽章', '专家徽章', '大师徽章'];
            return rewards[level - 1] || '未知';
        },

        // 显示学习计划
        showLearningPlan: function(plan) {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #28a745; border-radius: 20px; padding: 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 800px; max-height: 80vh; overflow-y: auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">📋 个性化学习计划</h4>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
                        <div style="background: rgba(40,167,69,0.1); padding: 20px; border-radius: 15px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #28a745;">${plan.dailyGoal}</div>
                            <div style="color: #666; margin-top: 5px;">每日目标题目</div>
                        </div>
                        <div style="background: rgba(79,172,254,0.1); padding: 20px; border-radius: 15px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #4facfe;">${plan.recommendedTime}分钟</div>
                            <div style="color: #666; margin-top: 5px;">推荐学习时间</div>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                        <h5 style="color: #333; margin-bottom: 15px;">🎯 重点学习领域</h5>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                            ${plan.focusAreas.map(area => `
                                <div style="background: white; padding: 15px; border-radius: 10px; border-left: 4px solid #ffc107;">
                                    <div style="font-weight: bold; color: #333;">${area.name}</div>
                                    <div style="color: #666; font-size: 12px; margin: 5px 0;">当前掌握度：${area.mastery}%</div>
                                    <div style="color: #28a745; font-size: 12px;">目标：${area.target}%</div>
                                    <div style="color: #666; font-size: 11px; margin-top: 5px;">推荐练习：${area.exercises.length}题</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                        <h5 style="color: #333; margin-bottom: 15px;">📅 学习时间表</h5>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                            ${plan.studySchedule.map(schedule => `
                                <div style="background: white; padding: 10px; border-radius: 8px; text-align: center;">
                                    <div style="font-weight: bold; color: #333; font-size: 14px;">${schedule.day}</div>
                                    <div style="color: #666; font-size: 12px; margin: 5px 0;">${schedule.time}</div>
                                    <div style="color: #4facfe; font-size: 11px;">${schedule.focus}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                        <h5 style="color: #333; margin-bottom: 15px;">🏆 学习里程碑</h5>
                        <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px;">
                            ${plan.milestones.map(milestone => `
                                <div style="background: white; padding: 15px; border-radius: 10px; min-width: 120px; text-align: center; border: 2px solid ${milestone.completed ? '#28a745' : '#e9ecef'};">
                                    <div style="font-size: 24px; margin-bottom: 5px;">${milestone.completed ? '✅' : '🎯'}</div>
                                    <div style="font-weight: bold; color: #333; font-size: 12px;">${milestone.name}</div>
                                    <div style="color: #666; font-size: 10px; margin: 5px 0;">${milestone.target}</div>
                                    <div style="color: #ffc107; font-size: 10px;">${milestone.reward}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="QuestionBankPractice.startLearningPlan()" 
                                style="padding: 12px 25px; background: #28a745; color: white; border: none; border-radius: 10px; cursor: pointer; margin-right: 10px;">
                        开始执行计划
                        </button>
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="padding: 12px 25px; background: #6c757d; color: white; border: none; border-radius: 10px; cursor: pointer;">
                        关闭
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        },

        // 开始执行学习计划
        startLearningPlan: function() {
            showNotification('学习计划已启动，开始今日学习！', 'success');
            this.trackLearningProgress();
        },

        // 跟踪学习进度
        trackLearningProgress: function() {
            const today = new Date().toISOString().split('T')[0];
            const progress = {
                date: today,
                questionsAnswered: 0,
                correctAnswers: 0,
                studyTime: 0,
                startTime: Date.now()
            };
            
            localStorage.setItem('learningProgress_' + today, JSON.stringify(progress));
            
            // 启动进度跟踪
            this.startProgressTracking();
        },

        // 启动进度跟踪
        startProgressTracking: function() {
            const progressInterval = setInterval(() => {
                const today = new Date().toISOString().split('T')[0];
                const progress = JSON.parse(localStorage.getItem('learningProgress_' + today) || '{}');
                
                if (progress.startTime) {
                    progress.studyTime = Math.floor((Date.now() - progress.startTime) / 1000);
                    localStorage.setItem('learningProgress_' + today, JSON.stringify(progress));
                }
            }, 60000); // 每分钟更新一次
            
            // 保存定时器ID以便清理
            this.progressTrackingInterval = progressInterval;
        },

        // 高级功能：学习数据分析
        analyzeLearningData: function() {
            const data = this.collectLearningData();
            const analysis = this.performDataAnalysis(data);
            this.showDataAnalysis(analysis);
        },

        // 收集学习数据
        collectLearningData: function() {
            const data = {
                totalSessions: 0,
                totalQuestions: 0,
                totalCorrect: 0,
                averageAccuracy: 0,
                studyTime: 0,
                learningStreak: 0,
                weakPoints: [],
                strongPoints: [],
                improvementTrend: []
            };
            
            // 收集会话数据
            const sessions = JSON.parse(localStorage.getItem('practiceSessions') || '[]');
            data.totalSessions = sessions.length;
            
            sessions.forEach(session => {
                data.totalQuestions += session.questionsAnswered || 0;
                data.totalCorrect += session.correctAnswers || 0;
                data.studyTime += session.studyTime || 0;
            });
            
            data.averageAccuracy = data.totalQuestions > 0 ? (data.totalCorrect / data.totalQuestions) * 100 : 0;
            
            // 计算学习连续天数
            data.learningStreak = this.calculateLearningStreak();
            
            // 分析强弱项
            const knowledgePoints = this.analyzeKnowledgePointMastery();
            data.weakPoints = Object.values(knowledgePoints).filter(p => p.mastery < 60);
            data.strongPoints = Object.values(knowledgePoints).filter(p => p.mastery >= 80);
            
            // 分析进步趋势
            data.improvementTrend = this.calculateImprovementTrend();
            
            return data;
        },

        // 计算学习连续天数
        calculateLearningStreak: function() {
            const today = new Date();
            let streak = 0;
            
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const progress = localStorage.getItem('learningProgress_' + dateStr);
                
                if (progress) {
                    const progressData = JSON.parse(progress);
                    if (progressData.questionsAnswered > 0) {
                        streak++;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
            
            return streak;
        },

        // 计算进步趋势
        calculateImprovementTrend: function() {
            const trend = [];
            const today = new Date();
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const progress = localStorage.getItem('learningProgress_' + dateStr);
                
                if (progress) {
                    const progressData = JSON.parse(progress);
                    const accuracy = progressData.questionsAnswered > 0 ? 
                        (progressData.correctAnswers / progressData.questionsAnswered) * 100 : 0;
                    trend.push({
                        date: dateStr,
                        accuracy: accuracy,
                        questions: progressData.questionsAnswered || 0
                    });
                } else {
                    trend.push({
                        date: dateStr,
                        accuracy: 0,
                        questions: 0
                    });
                }
            }
            
            return trend;
        },

        // 执行数据分析
        performDataAnalysis: function(data) {
            const analysis = {
                overallPerformance: this.analyzeOverallPerformance(data),
                learningPatterns: this.analyzeLearningPatterns(data),
                recommendations: this.generateRecommendations(data),
                predictions: this.makePredictions(data)
            };
            
            return analysis;
        },

        // 分析整体表现
        analyzeOverallPerformance: function(data) {
            const performance = {
                level: this.getPerformanceLevel(data.averageAccuracy),
                strength: this.getPerformanceStrength(data),
                areas: this.getPerformanceAreas(data)
            };
            
            return performance;
        },

        // 获取表现等级
        getPerformanceLevel: function(accuracy) {
            if (accuracy >= 90) return '优秀';
            if (accuracy >= 80) return '良好';
            if (accuracy >= 70) return '中等';
            if (accuracy >= 60) return '及格';
            return '需要改进';
        },

        // 获取表现优势
        getPerformanceStrength: function(data) {
            const strengths = [];
            
            if (data.averageAccuracy >= 80) strengths.push('高正确率');
            if (data.learningStreak >= 7) strengths.push('学习持续性');
            if (data.studyTime >= 3600) strengths.push('学习投入度');
            if (data.strongPoints.length >= 3) strengths.push('知识面广');
            
            return strengths;
        },

        // 获取表现领域
        getPerformanceAreas: function(data) {
            return {
                accuracy: data.averageAccuracy,
                consistency: this.calculateConsistency(data),
                efficiency: this.calculateEfficiency(data),
                engagement: this.calculateEngagement(data)
            };
        },

        // 计算一致性
        calculateConsistency: function(data) {
            if (data.improvementTrend.length < 2) return 0;
            
            const accuracies = data.improvementTrend.map(t => t.accuracy);
            const mean = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
            const variance = accuracies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / accuracies.length;
            
            return Math.max(0, 100 - Math.sqrt(variance));
        },

        // 计算效率
        calculateEfficiency: function(data) {
            if (data.studyTime === 0) return 0;
            return Math.min(100, (data.totalCorrect / (data.studyTime / 3600)) * 10);
        },

        // 计算参与度
        calculateEngagement: function(data) {
            return Math.min(100, (data.learningStreak / 30) * 100);
        },

        // 分析学习模式
        analyzeLearningPatterns: function(data) {
            return {
                studyHabits: this.analyzeStudyHabits(data),
                timePatterns: this.analyzeTimePatterns(data),
                difficultyPreference: this.analyzeDifficultyPreference(data)
            };
        },

        // 分析学习习惯
        analyzeStudyHabits: function(data) {
            const habits = [];
            
            if (data.learningStreak >= 7) habits.push('学习习惯良好');
            if (data.averageAccuracy >= 80) habits.push('学习效果优秀');
            if (data.studyTime >= 3600) habits.push('学习投入充足');
            
            return habits;
        },

        // 分析时间模式
        analyzeTimePatterns: function(data) {
            // 这里可以添加更复杂的时间模式分析
            return ['建议保持规律学习时间'];
        },

        // 分析难度偏好
        analyzeDifficultyPreference: function(data) {
            if (data.averageAccuracy >= 85) return '可以挑战更高难度';
            if (data.averageAccuracy >= 70) return '当前难度适中';
            return '建议降低难度';
        },

        // 生成建议
        generateRecommendations: function(data) {
            const recommendations = [];
            
            if (data.averageAccuracy < 70) {
                recommendations.push('建议重点复习基础知识');
            }
            
            if (data.learningStreak < 3) {
                recommendations.push('建议增加学习频率');
            }
            
            if (data.weakPoints.length > 0) {
                recommendations.push(`重点复习：${data.weakPoints.map(p => p.name).join('、')}`);
            }
            
            if (data.studyTime < 1800) {
                recommendations.push('建议增加学习时间');
            }
            
            return recommendations;
        },

        // 做出预测
        makePredictions: function(data) {
            const predictions = [];
            
            if (data.improvementTrend.length >= 3) {
                const recentTrend = data.improvementTrend.slice(-3);
                const avgAccuracy = recentTrend.reduce((a, b) => a + b.accuracy, 0) / 3;
                
                if (avgAccuracy > data.averageAccuracy) {
                    predictions.push('学习效果呈上升趋势');
                } else if (avgAccuracy < data.averageAccuracy) {
                    predictions.push('学习效果需要关注');
                }
            }
            
            if (data.learningStreak >= 5) {
                predictions.push('有望保持良好学习状态');
            }
            
            return predictions;
        },

        // 显示数据分析
        showDataAnalysis: function(analysis) {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border: 2px solid #17a2b8; border-radius: 20px; padding: 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); z-index: 10000; max-width: 900px; max-height: 80vh; overflow-y: auto;">
                    <h4 style="color: #333; margin-bottom: 20px; text-align: center;">📊 学习数据分析</h4>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                        <h5 style="color: #333; margin-bottom: 15px;">🎯 整体表现评估</h5>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                            <div style="background: white; padding: 15px; border-radius: 10px;">
                                <div style="font-weight: bold; color: #333; margin-bottom: 10px;">表现等级</div>
                                <div style="font-size: 24px; color: #17a2b8; font-weight: bold;">${analysis.overallPerformance.level}</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px;">
                                <div style="font-weight: bold; color: #333; margin-bottom: 10px;">主要优势</div>
                                <div style="color: #666; font-size: 14px;">
                                    ${analysis.overallPerformance.strength.map(s => `<div>• ${s}</div>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                        <h5 style="color: #333; margin-bottom: 15px;">📈 学习建议</h5>
                        <div style="background: white; padding: 15px; border-radius: 10px;">
                            ${analysis.recommendations.map(rec => `
                                <div style="color: #666; margin-bottom: 8px; padding: 8px; background: #f8f9fa; border-radius: 5px;">
                                    💡 ${rec}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                        <h5 style="color: #333; margin-bottom: 15px;">🔮 学习预测</h5>
                        <div style="background: white; padding: 15px; border-radius: 10px;">
                            ${analysis.predictions.map(pred => `
                                <div style="color: #666; margin-bottom: 8px; padding: 8px; background: #f8f9fa; border-radius: 5px;">
                                    🔮 ${pred}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="padding: 12px 25px; background: #17a2b8; color: white; border: none; border-radius: 10px; cursor: pointer;">
                        关闭
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
    };
})();