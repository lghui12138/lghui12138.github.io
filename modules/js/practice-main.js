// 主应用逻辑模块
window.PracticeApp = {
    // 创建Vue应用实例
    createApp() {
        const { createApp } = Vue;

        return createApp({
            data() {
                return {
                    // 基础状态
                    loading: true,
                    loadingText: '正在初始化...',
                    isFullscreen: false,
                    currentView: 'selector', // 'selector' | 'practice'
                    
                    // 通知系统
                    notification: {
                        show: false,
                        message: '',
                        type: 'info'
                    },
                    
                    // 粒子效果
                    particles: [],
                    
                    // 题库数据
                    availableBanks: [],
                    allQuestions: [],
                    questions: [], // 当前练习的题目
                    totalQuestions: 0,
                    
                    // 筛选条件
                    filters: {
                        category: '',
                        year: '',
                        difficulty: '',
                        keyword: ''
                    },
                    
                    // 练习状态
                    currentQuestionIndex: 0,
                    selectedAnswer: null,
                    showResult: false,
                    isCorrect: false,
                    
                    // 统计数据
                    stats: {
                        totalQuestions: 0,
                        answeredQuestions: 0,
                        correctAnswers: 0,
                        correctRate: 0,
                        startTime: null,
                        totalTime: 0
                    }
                };
            },

            computed: {
                currentQuestion() {
                    return this.questions[this.currentQuestionIndex] || null;
                },
                
                practiceStats() {
                    return {
                        totalQuestions: this.questions.length,
                        answeredQuestions: this.stats.answeredQuestions,
                        correctAnswers: this.stats.correctAnswers
                    };
                },
                
                practiceProgress() {
                    return {
                        currentIndex: this.currentQuestionIndex,
                        total: this.questions.length
                    };
                }
            },

            methods: {
                // 通知管理
                showNotification(message, type = 'info') {
                    this.notification = { show: true, message, type };
                },

                // 全屏功能
                toggleFullscreen() {
                    if (!this.isFullscreen) {
                        this.enterFullscreen();
                    } else {
                        this.exitFullscreen();
                    }
                },

                enterFullscreen() {
                    const element = document.documentElement;
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                    this.isFullscreen = true;
                    this.showNotification('已进入全屏模式，按F11或ESC可退出', 'info');
                },

                exitFullscreen() {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    this.isFullscreen = false;
                    this.showNotification('已退出全屏模式', 'info');
                },

                exitToPlatform() {
                    window.location.href = '../index.html';
                },

                // 数据加载
                async loadAllQuestionBanks() {
                    this.loading = true;
                    this.loadingText = '正在批量加载所有题库...';

                    try {
                        const result = await PracticeDataLoader.loadAllQuestionBanks((progress) => {
                            if (progress.status === 'loading') {
                                this.loadingText = `正在加载: ${progress.currentFile} (${progress.current}/${progress.total})`;
                            } else if (progress.status === 'completed') {
                                this.loadingText = '加载完成！';
                            }
                        });

                        this.allQuestions = result.questions;
                        this.availableBanks = result.banks;
                        this.totalQuestions = result.questions.length;
                        
                        this.showNotification(
                            `🎉 成功加载 ${result.questions.length} 道题目，来自 ${result.banks.length} 个题库`, 
                            'success'
                        );
                        
                        // 更新统计
                        this.updateStats();
                        
                    } catch (error) {
                        console.error('批量加载失败:', error);
                        this.showNotification('批量加载失败: ' + error.message, 'error');
                    } finally {
                        this.loading = false;
                    }
                },

                // 开始练习
                startPractice(options) {
                    let selectedQuestions = [];
                    
                    if (options.type === 'single') {
                        // 单个题库练习
                        selectedQuestions = this.allQuestions.filter(q => q.bankId === options.bankId);
                    } else if (options.type === 'multiple') {
                        // 多个题库练习
                        selectedQuestions = this.allQuestions.filter(q => 
                            options.bankIds.includes(q.bankId)
                        );
                    }
                    
                    if (selectedQuestions.length === 0) {
                        this.showNotification('选中的题库暂无题目', 'warning');
                        return;
                    }
                    
                    this.questions = selectedQuestions;
                    this.currentView = 'practice';
                    this.currentQuestionIndex = 0;
                    this.stats.startTime = Date.now();
                    this.resetQuestionState();
                    
                    this.showNotification(`开始练习！共 ${selectedQuestions.length} 道题目`, 'success');
                },

                startRandomPractice() {
                    if (this.allQuestions.length === 0) {
                        this.showNotification('请先加载题库', 'warning');
                        return;
                    }
                    
                    // 随机打乱所有题目
                    this.questions = PracticeUtils.shuffleArray([...this.allQuestions]);
                    this.currentView = 'practice';
                    this.currentQuestionIndex = 0;
                    this.stats.startTime = Date.now();
                    this.resetQuestionState();
                    
                    this.showNotification(`开始随机练习！共 ${this.questions.length} 道题目`, 'success');
                },

                // 题目操作
                submitAnswer(data) {
                    this.stats.answeredQuestions++;
                    
                    if (data.isCorrect) {
                        this.stats.correctAnswers++;
                        this.showNotification('回答正确！', 'success');
                    } else {
                        this.showNotification('回答错误，请查看解析', 'error');
                    }
                    
                    // 记录答题时间
                    this.stats.totalTime += data.timeSpent || 0;
                    
                    // 更新正确率
                    this.stats.correctRate = Math.round(
                        (this.stats.correctAnswers / this.stats.answeredQuestions) * 100
                    );
                    
                    // 保存进度
                    this.saveProgress();
                    
                    // 发送学生反馈数据给教师
                    this.sendStudentFeedback(data);
                },

                navigateQuestion(direction) {
                    if (direction === 'next' && this.currentQuestionIndex < this.questions.length - 1) {
                        this.currentQuestionIndex++;
                        this.resetQuestionState();
                    } else if (direction === 'previous' && this.currentQuestionIndex > 0) {
                        this.currentQuestionIndex--;
                        this.resetQuestionState();
                    }
                },

                resetQuestionState() {
                    this.selectedAnswer = null;
                    this.showResult = false;
                    this.isCorrect = false;
                },

                backToSelector() {
                    this.currentView = 'selector';
                    this.resetQuestionState();
                },

                // 进度管理
                saveProgress() {
                    const progress = {
                        currentQuestionIndex: this.currentQuestionIndex,
                        stats: this.stats,
                        timestamp: new Date().toISOString(),
                        questionsLength: this.questions.length
                    };
                    
                    localStorage.setItem(PracticeConfig.storageKeys.progress, JSON.stringify(progress));
                },

                loadProgress() {
                    try {
                        const saved = localStorage.getItem(PracticeConfig.storageKeys.progress);
                        if (saved) {
                            const progress = JSON.parse(saved);
                            this.stats = { ...this.stats, ...progress.stats };
                        }
                    } catch (error) {
                        console.error('Failed to load progress:', error);
                    }
                },

                // 统计更新
                updateStats() {
                    // 从localStorage获取用户统计
                    const userStats = JSON.parse(localStorage.getItem(PracticeConfig.storageKeys.userStats) || '{}');
                    this.stats = {
                        ...this.stats,
                        totalQuestions: this.totalQuestions,
                        answeredQuestions: userStats.answeredQuestions || 0,
                        correctAnswers: userStats.correctAnswers || 0,
                        correctRate: userStats.correctRate || 0
                    };
                },

                updateFilters(newFilters) {
                    this.filters = { ...newFilters };
                    localStorage.setItem(PracticeConfig.storageKeys.filters, JSON.stringify(this.filters));
                },

                // 学生反馈功能
                sendStudentFeedback(answerData) {
                    // 获取当前用户信息
                    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                    
                    if (!currentUser.username) return;
                    
                    const feedbackData = {
                        studentId: currentUser.username,
                        studentName: currentUser.displayName || currentUser.username,
                        questionId: answerData.questionId,
                        questionTitle: this.currentQuestion?.title,
                        questionBank: this.currentQuestion?.bank,
                        selectedAnswer: answerData.selectedAnswer,
                        correctAnswer: this.currentQuestion?.answer,
                        isCorrect: answerData.isCorrect,
                        timeSpent: answerData.timeSpent,
                        timestamp: new Date().toISOString(),
                        difficulty: this.currentQuestion?.difficulty,
                        category: this.currentQuestion?.category
                    };
                    
                    // 保存到本地存储供教师查看
                    this.saveStudentFeedback(feedbackData);
                },

                saveStudentFeedback(feedbackData) {
                    const existingFeedback = JSON.parse(localStorage.getItem('studentFeedback') || '[]');
                    existingFeedback.push(feedbackData);
                    
                    // 保留最近1000条记录
                    if (existingFeedback.length > 1000) {
                        existingFeedback.splice(0, existingFeedback.length - 1000);
                    }
                    
                    localStorage.setItem('studentFeedback', JSON.stringify(existingFeedback));
                },

                // 键盘事件处理
                handleKeyboard(event) {
                    if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;

                    switch(event.key) {
                        case 'Enter':
                            if (this.currentView === 'practice') {
                                event.preventDefault();
                                // 触发当前practice interface的提交
                                const practiceInterface = this.$refs.practiceInterface;
                                if (practiceInterface) {
                                    practiceInterface.submitAnswer();
                                }
                            }
                            break;
                        case 'ArrowLeft':
                            if (this.currentView === 'practice') {
                                event.preventDefault();
                                this.navigateQuestion('previous');
                            }
                            break;
                        case 'ArrowRight':
                            if (this.currentView === 'practice') {
                                event.preventDefault();
                                this.navigateQuestion('next');
                            }
                            break;
                        case 'F11':
                            event.preventDefault();
                            this.toggleFullscreen();
                            break;
                        case 'Escape':
                            if (this.isFullscreen) {
                                event.preventDefault();
                                this.exitFullscreen();
                            } else if (this.currentView === 'practice') {
                                this.backToSelector();
                            } else {
                                this.exitToPlatform();
                            }
                            break;
                        case 's':
                            if (event.ctrlKey && this.currentView === 'practice') {
                                event.preventDefault();
                                this.saveProgress();
                                this.showNotification('进度已保存', 'success');
                            }
                            break;
                    }
                },

                // 初始化粒子效果
                initParticles() {
                    this.particles = [];
                    for (let i = 0; i < PracticeConfig.defaults.particleCount; i++) {
                        this.particles.push({
                            style: {
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 30 + 's',
                                animationDuration: (25 + Math.random() * 10) + 's'
                            }
                        });
                    }
                }
            },

            mounted() {
                console.log('🧠 智能题库练习启动！');
                
                // 初始化
                setTimeout(() => {
                    this.loadProgress();
                    this.updateStats();
                    this.initParticles();
                    this.loading = false;
                    this.showNotification('欢迎来到智能题库！点击"批量加载所有题库"开始', 'info');
                }, 1500);

                // 绑定键盘事件
                document.addEventListener('keydown', this.handleKeyboard);

                // 监听全屏状态变化
                document.addEventListener('fullscreenchange', () => {
                    this.isFullscreen = !!document.fullscreenElement;
                });

                // 定期保存进度
                setInterval(() => {
                    if (this.currentView === 'practice' && this.stats.answeredQuestions > 0) {
                        this.saveProgress();
                    }
                }, PracticeConfig.defaults.saveProgressInterval);
            },

            beforeUnmount() {
                document.removeEventListener('keydown', this.handleKeyboard);
            },

            // 注册组件
            components: {
                'notification-component': PracticeComponents.NotificationComponent,
                'fullscreen-controls': PracticeComponents.FullscreenControls,
                'question-bank-selector': PracticeComponents.QuestionBankSelector,
                'practice-interface': PracticeComponents.PracticeInterface,
                'keyboard-hints': PracticeComponents.KeyboardHints
            }
        });
    },

    // 启动应用
    mount(selector = '#app') {
        const app = this.createApp();
        return app.mount(selector);
    }
};

// 自动启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.practiceAppInstance = PracticeApp.mount('#app');
});

console.log('🚀 主应用逻辑模块已加载'); 