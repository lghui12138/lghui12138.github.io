/**
 * 题库练习功能模块
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
        questionTimer: null
    };
    
    // 配置
    const config = {
        defaultTimeLimit: 0, // 0 表示无时间限制
        showExplanation: true,
        shuffleQuestions: false,
        shuffleOptions: false
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
                        this.exitPractice();
                        break;
                }
            });
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
                questionTimer: Date.now()
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
                    size: 'large',
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
            
            this.displayCurrentQuestion();
            this.startTimer();
        },
        
        // 生成练习界面HTML
        generatePracticeHTML: function() {
            return `
                <style>
                    /* 自定义滚动条样式 */
                    #questionDisplay::-webkit-scrollbar,
                    #answerDisplay::-webkit-scrollbar {
                        width: 8px;
                    }
                    
                    #questionDisplay::-webkit-scrollbar-track,
                    #answerDisplay::-webkit-scrollbar-track {
                        background: rgba(240,248,255,0.5);
                        border-radius: 10px;
                    }
                    
                    #questionDisplay::-webkit-scrollbar-thumb,
                    #answerDisplay::-webkit-scrollbar-thumb {
                        background: linear-gradient(180deg, #4facfe, #00f2fe);
                        border-radius: 10px;
                        border: 1px solid rgba(255,255,255,0.3);
                    }
                    
                    #questionDisplay::-webkit-scrollbar-thumb:hover,
                    #answerDisplay::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(180deg, #3a8bfe, #00d4fe);
                    }
                    
                    /* 平滑滚动 */
                    #questionDisplay,
                    #answerDisplay {
                        scroll-behavior: smooth;
                    }
                </style>
                <div id="practiceContainer" style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:%234facfe;stop-opacity:0.3"/><stop offset="100%" style="stop-color:%2300f2fe;stop-opacity:0.3"/></linearGradient><linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:%23667eea;stop-opacity:0.2"/><stop offset="100%" style="stop-color:%23764ba2;stop-opacity:0.2"/></linearGradient></defs><path d="M0,600 Q300,500 600,600 T1200,600 L1200,800 L0,800 Z" fill="url(%23wave1)"/><path d="M0,650 Q300,550 600,650 T1200,650 L1200,800 L0,800 Z" fill="url(%23wave2)"/><path d="M0,700 Q300,600 600,700 T1200,700 L1200,800 L0,800 Z" fill="%234facfe" opacity="0.1"/></svg>'); background-size: cover; background-position: center; padding: 20px;">
                    <!-- 练习头部信息 -->
                    <div id="practiceHeader" style="background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); padding: 20px; border-radius: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div style="font-size: 1.2em; font-weight: bold; color: #333;">
                                <span id="questionProgress">1 / ${currentSession.questions.length}</span>
                            </div>
                            <div style="color: #666; font-size: 1.1em;">
                                时间: <span id="practiceTimer">00:00</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 15px; align-items: center;">
                            <!-- 字体大小控制 -->
                            <div style="display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.05); padding: 8px 12px; border-radius: 20px;">
                                <button id="zoomOutBtn" class="btn btn-outline-secondary btn-sm" onclick="QuestionBankPractice.zoomOut()" title="缩小字体" style="border-radius: 50%; width: 32px; height: 32px; padding: 0;">
                                    <i class="fas fa-search-minus"></i>
                                </button>
                                <span id="fontSizeDisplay" style="font-size: 12px; min-width: 40px; text-align: center; font-weight: bold;">16px</span>
                                <button id="zoomInBtn" class="btn btn-outline-secondary btn-sm" onclick="QuestionBankPractice.zoomIn()" title="放大字体" style="border-radius: 50%; width: 32px; height: 32px; padding: 0;">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                            
                            <!-- 主题切换 -->
                            <button id="themeBtn" class="btn btn-outline-info btn-sm" onclick="QuestionBankPractice.toggleTheme()" title="切换主题" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-palette"></i>
                            </button>
                            
                            <!-- 快捷键帮助 -->
                            <button id="helpBtn" class="btn btn-outline-secondary btn-sm" onclick="QuestionBankPractice.showKeyboardHelp()" title="快捷键帮助" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-question"></i>
                            </button>
                            
                            <!-- 统计面板 -->
                            <button id="statsBtn" class="btn btn-outline-success btn-sm" onclick="QuestionBankPractice.showStatsPanel()" title="练习统计" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-chart-bar"></i>
                            </button>
                            
                            <!-- 笔记功能 -->
                            <button id="noteBtn" class="btn btn-outline-warning btn-sm" onclick="QuestionBankPractice.toggleNotePanel()" title="添加笔记" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-sticky-note"></i>
                            </button>
                            
                            <!-- 智能提示 -->
                            <button id="aiHintBtn" class="btn btn-outline-info btn-sm" onclick="QuestionBankPractice.showAIHint()" title="AI智能提示" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-robot"></i>
                            </button>
                            
                            <!-- 学习模式 -->
                            <button id="modeBtn" class="btn btn-outline-dark btn-sm" onclick="QuestionBankPractice.toggleLearningMode()" title="切换学习模式" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-graduation-cap"></i>
                            </button>
                            
                            <!-- 智能分析 -->
                            <button id="analysisBtn" class="btn btn-outline-primary btn-sm" onclick="QuestionBankPractice.showAnalysis()" title="智能分析" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-brain"></i>
                            </button>
                            
                            <!-- 学习进度 -->
                            <button id="progressBtn" class="btn btn-outline-success btn-sm" onclick="QuestionBankPractice.showLearningProgress()" title="学习进度" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-chart-line"></i>
                            </button>
                            
                            <!-- 错题本 -->
                            <button id="wrongBookBtn" class="btn btn-outline-danger btn-sm" onclick="QuestionBankPractice.showWrongBook()" title="错题本" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-book"></i>
                            </button>
                            
                            <!-- 学习策略 -->
                            <button id="strategyBtn" class="btn btn-outline-info btn-sm" onclick="QuestionBankPractice.showLearningStrategy()" title="学习策略" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-cog"></i>
                            </button>
                            
                            <!-- 全屏按钮 -->
                            <button id="fullscreenBtn" class="btn btn-outline-primary btn-sm" onclick="QuestionBankPractice.toggleFullscreen()" title="全屏" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-expand"></i>
                            </button>
                            
                            <!-- 显示答案按钮 -->
                            <button id="showAnswerBtn" class="btn btn-outline-success btn-sm" onclick="QuestionBankPractice.toggleAnswer()" title="显示答案" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-eye"></i> 答案
                            </button>
                            
                            <!-- 删除题目按钮 -->
                            <button id="deleteBtn" class="btn btn-outline-danger btn-sm" onclick="QuestionBankPractice.deleteCurrentQuestion()" title="删除此题" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-trash"></i> 删除
                            </button>
                            
                            <!-- 批量删除按钮 -->
                            <button id="batchDeleteBtn" class="btn btn-outline-warning btn-sm" onclick="QuestionBankPractice.showBatchDeleteDialog()" title="批量删除" style="border-radius: 20px; padding: 8px 15px;">
                                <i class="fas fa-trash-alt"></i> 批量
                            </button>
                            
                            <button id="pauseBtn" class="btn btn-warning btn-sm" onclick="QuestionBankPractice.togglePause()" style="border-radius: 20px; padding: 8px 15px;">⏸️ 暂停</button>
                            <button id="exitBtn" class="btn btn-danger btn-sm" onclick="QuestionBankPractice.exitPractice()" style="border-radius: 20px; padding: 8px 15px;">❌ 退出</button>
                        </div>
                    </div>
                    
                    <!-- 进度条和导航 -->
                    <div style="background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 25px; margin-bottom: 25px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                        <!-- 进度滑块 -->
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                <span style="font-weight: bold; color: #333; font-size: 16px;">练习进度</span>
                                <span id="progressText" style="font-weight: bold; color: #4facfe; font-size: 14px;">0%</span>
                            </div>
                            <div style="background: rgba(79,172,254,0.2); border-radius: 15px; height: 12px; position: relative; overflow: hidden;">
                                <div id="progressBar" style="background: linear-gradient(90deg, #4facfe, #00f2fe); height: 100%; border-radius: 15px; transition: width 0.3s ease; width: 0%; box-shadow: 0 2px 8px rgba(79,172,254,0.3);"></div>
                            </div>
                        </div>
                        
                        <!-- 题目导航 -->
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <span id="questionCounter" style="font-size: 16px; color: #333; font-weight: bold;">题目 1 / ${currentSession.questions.length}</span>
                                <span style="color: #666; font-size: 14px;">|</span>
                                <span style="color: #666; font-size: 14px;">剩余 ${currentSession.questions.length - 1} 题</span>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button id="prevBtn" class="btn btn-outline-primary btn-sm" onclick="QuestionBankPractice.previousQuestion()" disabled style="border-radius: 15px; padding: 8px 15px; font-size: 14px; transition: all 0.3s ease;">
                                    <i class="fas fa-chevron-left"></i> 上一题
                                </button>
                                <button id="nextBtn" class="btn btn-outline-primary btn-sm" onclick="QuestionBankPractice.nextQuestion()" style="border-radius: 15px; padding: 8px 15px; font-size: 14px; transition: all 0.3s ease;">
                                    下一题 <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 题目显示区域 -->
                    <div id="questionDisplay" style="background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border: none; border-radius: 20px; padding: 30px; margin-bottom: 25px; max-height: 60vh; overflow-y: auto; font-size: 16px; line-height: 1.8; box-shadow: 0 12px 40px rgba(0,0,0,0.15); scrollbar-width: thin; scrollbar-color: #4facfe #f0f0f0; position: relative;">
                        <!-- 题目内容将在这里动态加载 -->
                    </div>
                    
                    <!-- 答案显示区域 -->
                    <div id="answerDisplay" style="background: rgba(240,248,255,0.95); backdrop-filter: blur(10px); border: 2px solid #007bff; border-radius: 20px; padding: 30px; margin-bottom: 25px; display: none; box-shadow: 0 8px 32px rgba(0,123,255,0.2); max-height: 50vh; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #007bff #f0f8ff;">
                        <h5 style="color: #007bff; margin-bottom: 20px; font-size: 1.3em;">📝 参考答案</h5>
                        <div id="answerContent" style="font-size: 16px; line-height: 1.8;"></div>
                        <div id="explanationContent" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #dee2e6; font-size: 15px; color: #666;"></div>
                    </div>
                    
                    <!-- 答题控制 -->
                    <div id="answerControls" style="background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); position: sticky; bottom: 20px; z-index: 100;">
                        <button id="prevBtn" class="btn btn-secondary" onclick="QuestionBankPractice.previousQuestion()" disabled style="border-radius: 25px; padding: 12px 25px; font-weight: bold;">
                            ← 上一题
                        </button>
                        
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <button id="submitBtn" class="btn btn-primary" onclick="QuestionBankPractice.submitAnswer()" style="border-radius: 25px; padding: 12px 30px; font-weight: bold; box-shadow: 0 4px 15px rgba(79,172,254,0.3);">
                                提交答案
                            </button>
                            <button id="skipBtn" class="btn btn-info" onclick="QuestionBankPractice.skipQuestion()" style="border-radius: 25px; padding: 12px 25px; font-weight: bold;">
                                跳过
                            </button>
                            <button id="hintBtn" class="btn btn-warning" onclick="QuestionBankPractice.showHint()" style="border-radius: 25px; padding: 12px 25px; font-weight: bold;">
                                💡 提示
                            </button>
                        </div>
                        
                        <button id="nextBtn" class="btn btn-secondary" onclick="QuestionBankPractice.nextQuestion()" style="border-radius: 25px; padding: 12px 25px; font-weight: bold;">
                            下一题 →
                        </button>
                    </div>
                    
                    <!-- 答案解释区域 -->
                    <div id="explanationArea" style="background: rgba(232,245,232,0.95); backdrop-filter: blur(10px); border: 2px solid #28a745; border-radius: 20px; padding: 25px; margin-top: 25px; display: none; box-shadow: 0 8px 32px rgba(40,167,69,0.2);">
                        <h5 style="color: #28a745; margin-bottom: 20px; font-size: 1.3em;">📝 答案解释</h5>
                        <div id="explanationContent"></div>
                        <button class="btn btn-success btn-sm" onclick="QuestionBankPractice.continueToNext()" style="margin-top: 15px; border-radius: 20px; padding: 10px 20px; font-weight: bold;">
                            继续下一题
                        </button>
                    </div>
                    
                    <!-- 练习完成界面 -->
                    <div id="completionArea" style="display: none; text-align: center; padding: 40px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.15);">
                        <h3 style="color: #333; margin-bottom: 30px;">🎉 练习完成！</h3>
                        <div id="finalStats" style="background: rgba(248,249,250,0.8); border-radius: 15px; padding: 25px; margin: 25px 0;"></div>
                        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                            <button class="btn btn-primary" onclick="QuestionBankPractice.reviewAnswers()" style="border-radius: 25px; padding: 12px 25px; font-weight: bold;">
                                📋 查看答案
                            </button>
                            <button class="btn btn-success" onclick="QuestionBankPractice.practiceAgain()" style="border-radius: 25px; padding: 12px 25px; font-weight: bold;">
                                🔄 再次练习
                            </button>
                            <button class="btn btn-info" onclick="QuestionBankPractice.saveResults()" style="border-radius: 25px; padding: 12px 25px; font-weight: bold;">
                                💾 保存结果
                            </button>
                            <button class="btn btn-secondary" onclick="QuestionBankPractice.exitPractice()" style="border-radius: 25px; padding: 12px 25px; font-weight: bold;">
                                🏠 返回主页
                            </button>
                        </div>
                    </div>
                    
                    <!-- 批量删除对话框 -->
                    <div id="batchDeleteDialog" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; backdrop-filter: blur(5px);">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                            <h4 style="color: #dc3545; margin-bottom: 20px; text-align: center;">🗑️ 批量删除题目</h4>
                            <div style="margin-bottom: 20px;">
                                <p style="color: #666; margin-bottom: 15px;">选择要删除的题目类型：</p>
                                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
                                    <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                                        <input type="checkbox" id="deleteNoOptions" checked> 无选项题目
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                                        <input type="checkbox" id="deleteShortQuestions"> 短题目（少于50字）
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                                        <input type="checkbox" id="deleteSystemQuestions"> 系统题目（包含"科目代码"等）
                                    </label>
                                </div>
                                <div style="background: rgba(255,193,7,0.1); border: 1px solid #ffc107; border-radius: 10px; padding: 15px; color: #856404;">
                                    <i class="fas fa-exclamation-triangle"></i> 删除后无法恢复，请谨慎操作！
                                </div>
                            </div>
                            <div id="deletePreview" style="background: rgba(248,249,250,0.8); border-radius: 10px; padding: 15px; margin-bottom: 20px; max-height: 200px; overflow-y: auto;">
                                <p style="color: #666; text-align: center;">点击"预览"查看将要删除的题目</p>
                            </div>
                            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                                <button class="btn btn-info" onclick="QuestionBankPractice.previewBatchDelete()" style="border-radius: 20px; padding: 10px 20px;">
                                    👁️ 预览
                                </button>
                                <button class="btn btn-danger" onclick="QuestionBankPractice.executeBatchDelete()" style="border-radius: 20px; padding: 10px 20px;">
                                    🗑️ 确认删除
                                </button>
                                <button class="btn btn-secondary" onclick="QuestionBankPractice.closeBatchDeleteDialog()" style="border-radius: 20px; padding: 10px 20px;">
                                    ❌ 取消
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 笔记面板 -->
                    <div id="notePanel" style="display: none; position: fixed; top: 0; right: 0; width: 350px; height: 100%; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-left: 2px solid #ffc107; box-shadow: -5px 0 20px rgba(0,0,0,0.1); z-index: 999; overflow-y: auto;">
                        <div style="padding: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <h5 style="color: #333; margin: 0;">📝 学习笔记</h5>
                                <button onclick="QuestionBankPractice.toggleNotePanel()" style="background: none; border: none; font-size: 20px; color: #666; cursor: pointer;">×</button>
                            </div>
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">当前题目笔记：</label>
                                <textarea id="currentNote" placeholder="在这里记录你的学习心得、解题思路或重要知识点..." style="width: 100%; height: 120px; padding: 12px; border: 2px solid #ffc107; border-radius: 10px; resize: vertical; font-size: 14px; line-height: 1.5;"></textarea>
                                <div style="display: flex; gap: 10px; margin-top: 10px;">
                                    <button onclick="QuestionBankPractice.saveNote()" class="btn btn-warning btn-sm" style="border-radius: 15px; padding: 8px 15px;">
                                        💾 保存笔记
                                    </button>
                                    <button onclick="QuestionBankPractice.clearNote()" class="btn btn-outline-secondary btn-sm" style="border-radius: 15px; padding: 8px 15px;">
                                        🗑️ 清空
                                    </button>
                                </div>
                            </div>
                            <div style="border-top: 1px solid #dee2e6; padding-top: 20px;">
                                <h6 style="color: #333; margin-bottom: 15px;">📚 笔记历史</h6>
                                <div id="noteHistory" style="max-height: 300px; overflow-y: auto;">
                                    <p style="color: #666; text-align: center; font-size: 14px;">暂无笔记历史</p>
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
                         style="background: white; border: 2px solid #e9ecef; border-radius: 10px; padding: 15px; margin: 10px 0; cursor: pointer; transition: all 0.3s ease;"
                         data-option-index="${optIndex}">
                        <span style="display: inline-block; width: 30px; height: 30px; border-radius: 50%; background: #4facfe; color: white; text-align: center; line-height: 30px; margin-right: 15px; font-weight: bold;">
                            ${String.fromCharCode(65 + optIndex)}
                        </span>
                        ${option}
                    </div>
                `).join('');
            } else {
                // 没有选项时，显示提示信息
                optionsHTML = `
                    <div style="margin-top: 20px; padding: 15px; background: rgba(255,193,7,0.1); border: 1px solid #ffc107; border-radius: 10px; color: #856404;">
                        <i class="fas fa-info-circle"></i> 此题没有选项，请在下方输入框中输入您的答案。
                    </div>
                `;
            }
            
            // 根据题型生成不同的输入方式
            let inputHTML = '';
            
            // 检查是否有选项
            const hasOptions = question.options && Array.isArray(question.options) && question.options.length > 0;
            
            if (questionType === '填空题') {
                inputHTML = `
                    <div style="margin-top: 25px; background: rgba(248,249,250,0.8); border-radius: 15px; padding: 20px;">
                        <label style="display: block; margin-bottom: 15px; font-weight: bold; color: #333; font-size: 1.1em;">📝 请输入答案：</label>
                        <input type="text" id="fillAnswer" placeholder="请输入答案..." 
                               style="width: 100%; padding: 18px; border: 2px solid #e9ecef; border-radius: 12px; font-size: 1.1em; box-sizing: border-box; transition: all 0.3s ease;"
                               onchange="QuestionBankPractice.handleFillAnswer(this.value)" onfocus="this.style.borderColor='#4facfe'" onblur="this.style.borderColor='#e9ecef'">
                    </div>
                `;
            } else if (questionType === '解答题' || questionType === '计算题') {
                inputHTML = `
                    <div style="margin-top: 25px; background: rgba(248,249,250,0.8); border-radius: 15px; padding: 20px;">
                        <label style="display: block; margin-bottom: 15px; font-weight: bold; color: #333; font-size: 1.1em;">📝 请输入详细答案：</label>
                        <textarea id="essayAnswer" placeholder="请输入详细答案..." 
                                  style="width: 100%; min-height: 150px; padding: 18px; border: 2px solid #e9ecef; border-radius: 12px; font-size: 1.1em; box-sizing: border-box; resize: vertical; transition: all 0.3s ease; line-height: 1.6;"
                                  onchange="QuestionBankPractice.handleEssayAnswer(this.value)" onfocus="this.style.borderColor='#4facfe'" onblur="this.style.borderColor='#e9ecef'"></textarea>
                    </div>
                `;
            } else if (questionType === '判断题') {
                inputHTML = `
                    <div style="margin-top: 25px; background: rgba(248,249,250,0.8); border-radius: 15px; padding: 20px; text-align: center;">
                        <label style="display: block; margin-bottom: 15px; font-weight: bold; color: #333; font-size: 1.1em;">📝 请选择答案：</label>
                        <div style="display: flex; gap: 30px; justify-content: center;">
                            <button class="judge-btn" onclick="QuestionBankPractice.selectJudgeAnswer(true)" 
                                    style="padding: 18px 40px; font-size: 1.2em; border: 2px solid #28a745; background: white; color: #28a745; border-radius: 15px; cursor: pointer; transition: all 0.3s ease; font-weight: bold; min-width: 120px;">
                                ✓ 正确
                            </button>
                            <button class="judge-btn" onclick="QuestionBankPractice.selectJudgeAnswer(false)"
                                    style="padding: 18px 40px; font-size: 1.2em; border: 2px solid #dc3545; background: white; color: #dc3545; border-radius: 15px; cursor: pointer; transition: all 0.3s ease; font-weight: bold; min-width: 120px;">
                                ✗ 错误
                            </button>
                        </div>
                    </div>
                `;
            } else if (questionType === '选择题' && !hasOptions) {
                // 选择题但没有选项，显示输入框
                inputHTML = `
                    <div style="margin-top: 25px; background: rgba(248,249,250,0.8); border-radius: 15px; padding: 20px;">
                        <label style="display: block; margin-bottom: 15px; font-weight: bold; color: #333; font-size: 1.1em;">📝 请输入答案：</label>
                        <input type="text" id="customAnswer" placeholder="请输入您的答案..." 
                               style="width: 100%; padding: 18px; border: 2px solid #e9ecef; border-radius: 12px; font-size: 1.1em; box-sizing: border-box; transition: all 0.3s ease;"
                               onchange="QuestionBankPractice.handleCustomAnswer(this.value)" onfocus="this.style.borderColor='#4facfe'" onblur="this.style.borderColor='#e9ecef'">
                    </div>
                `;
            } else if (questionType === '选择题' && hasOptions) {
                // 选择题有选项，添加额外的输入框
                inputHTML = `
                    <div style="margin-top: 25px; background: rgba(248,249,250,0.8); border-radius: 15px; padding: 20px;">
                        <label style="display: block; margin-bottom: 15px; font-weight: bold; color: #333; font-size: 1.1em;">💭 或者输入您的答案：</label>
                        <input type="text" id="customAnswer" placeholder="请输入您的答案（可选）..." 
                               style="width: 100%; padding: 18px; border: 2px solid #e9ecef; border-radius: 12px; font-size: 1.1em; box-sizing: border-box; transition: all 0.3s ease;"
                               onchange="QuestionBankPractice.handleCustomAnswer(this.value)" onfocus="this.style.borderColor='#4facfe'" onblur="this.style.borderColor='#e9ecef'">
                    </div>
                `;
            } else {
                // 其他题型或没有明确题型的，都显示输入框
                inputHTML = `
                    <div style="margin-top: 25px; background: rgba(248,249,250,0.8); border-radius: 15px; padding: 20px;">
                        <label style="display: block; margin-bottom: 15px; font-weight: bold; color: #333; font-size: 1.1em;">📝 请输入答案：</label>
                        <input type="text" id="customAnswer" placeholder="请输入您的答案..." 
                               style="width: 100%; padding: 18px; border: 2px solid #e9ecef; border-radius: 12px; font-size: 1.1em; box-sizing: border-box; transition: all 0.3s ease;"
                               onchange="QuestionBankPractice.handleCustomAnswer(this.value)" onfocus="this.style.borderColor='#4facfe'" onblur="this.style.borderColor='#e9ecef'">
                    </div>
                `;
            }
            
            return `
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h4 style="color: #333; margin: 0;">题目 ${questionNumber}</h4>
                        <div style="font-size: 0.9em; color: #666;">
                            <span style="background: #4facfe; color: white; padding: 4px 12px; border-radius: 15px; margin-right: 10px;">
                                ${question.difficulty || '中等'}
                            </span>
                            <span style="background: #f8f9fa; color: #666; padding: 4px 12px; border-radius: 15px; margin-right: 10px;">
                                ${questionType}
                            </span>
                            ${question.category ? `<span style="background: #f8f9fa; color: #666; padding: 4px 12px; border-radius: 15px;">${question.category}</span>` : ''}
                        </div>
                    </div>
                    
                    <div style="font-size: 1.1em; line-height: 1.6; margin-bottom: 25px; color: #333;">
                        ${question.question || question.title || '题目内容'}
                    </div>
                    
                    ${question.image ? `<img src="${question.image}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;" alt="题目图片">` : ''}
                    
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
            });
            
            // 高亮当前选择
            const selectedOption = document.querySelector(`[data-option-index="${optionIndex}"]`);
            if (selectedOption) {
                selectedOption.style.background = '#e3f2fd';
                selectedOption.style.borderColor = '#4facfe';
            }
            
            // 记录答案
            currentSession.userAnswers[currentSession.currentIndex] = optionIndex;
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
            } else if (questionType === '选择题') {
                // 检查是否有自定义答案
                const customInput = document.getElementById('customAnswer');
                if (customInput && customInput.value.trim()) {
                    currentAnswer = customInput.value.trim();
                    currentSession.userAnswers[currentSession.currentIndex] = currentAnswer;
                }
            }
            
            if (currentAnswer === null || currentAnswer === undefined || currentAnswer === '') {
                showNotification('请先输入答案', 'warning');
                return;
            }
            
            // 记录答题时间
            const questionTime = (Date.now() - practiceState.questionTimer) / 1000;
            currentSession.questionTimes[currentSession.currentIndex] = questionTime;
            
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
        zoomIn: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            const answerDisplay = document.getElementById('answerDisplay');
            const fontSizeDisplay = document.getElementById('fontSizeDisplay');
            
            if (questionDisplay) {
                const currentSize = parseInt(window.getComputedStyle(questionDisplay).fontSize);
                const newSize = Math.min(currentSize + 2, 24); // 最大24px
                questionDisplay.style.fontSize = newSize + 'px';
                if (answerDisplay) answerDisplay.style.fontSize = newSize + 'px';
                if (fontSizeDisplay) fontSizeDisplay.textContent = newSize + 'px';
            }
        },
        
        zoomOut: function() {
            const questionDisplay = document.getElementById('questionDisplay');
            const answerDisplay = document.getElementById('answerDisplay');
            const fontSizeDisplay = document.getElementById('fontSizeDisplay');
            
            if (questionDisplay) {
                const currentSize = parseInt(window.getComputedStyle(questionDisplay).fontSize);
                const newSize = Math.max(currentSize - 2, 12); // 最小12px
                questionDisplay.style.fontSize = newSize + 'px';
                if (answerDisplay) answerDisplay.style.fontSize = newSize + 'px';
                if (fontSizeDisplay) fontSizeDisplay.textContent = newSize + 'px';
            }
        },
        
        // 全屏控制
        toggleFullscreen: function() {
            const container = document.getElementById('practiceContainer');
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            
            if (!container) return;
            
            if (!document.fullscreenElement) {
                // 进入全屏
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
                
                if (fullscreenBtn) {
                    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                    fullscreenBtn.title = '退出全屏';
                }
            } else {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                
                if (fullscreenBtn) {
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                    fullscreenBtn.title = '全屏';
                }
            }
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
                            this.zoomIn();
                        }
                        break;
                    case '-':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            this.zoomOut();
                        }
                        break;
                    case '0':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            this.resetZoom();
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
                    case 'd':
                    case 'D':
                        e.preventDefault();
                        this.deleteCurrentQuestion();
                        break;
                    case 'h':
                    case 'H':
                        e.preventDefault();
                        this.showHint();
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
        resetZoom: function() {
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
        }
    };
})(); 