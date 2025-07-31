// 教师管理主应用模块
window.TeacherApp = {
    // 创建教师Vue应用实例
    createApp() {
        const { createApp } = Vue;

        return createApp({
            data() {
                return {
                    // 基础状态
                    loading: true,
                    loadingText: '正在初始化教师面板...',
                    
                    // 当前用户
                    currentUser: this.getCurrentUser(),
                    
                    // 通知系统
                    notification: {
                        show: false,
                        message: '',
                        type: 'info'
                    },
                    
                    // 界面状态
                    activeTab: 'questions',
                    
                    // 数据
                    allQuestions: [],
                    customQuestions: [],
                    questionBanks: [],
                    studentFeedbacks: [],
                    studentList: [],
                    analyticsData: {},
                    systemSettings: this.getSystemSettings(),
                    
                    // 编辑器状态
                    showEditor: false,
                    editingQuestion: null,
                    
                    // 统计数据
                    stats: {
                        totalQuestions: 0,
                        activeStudents: 0,
                        averageScore: 0,
                        todayAnswers: 0
                    },
                    
                    // 标签页配置
                    tabs: [
                        {
                            id: 'questions',
                            name: '题目管理',
                            icon: 'fas fa-question-circle',
                            badge: null
                        },
                        {
                            id: 'feedback',
                            name: '学生反馈',
                            icon: 'fas fa-chart-line',
                            badge: null
                        },
                        {
                            id: 'analytics',
                            name: '统计分析',
                            icon: 'fas fa-chart-pie',
                            badge: null
                        },
                        {
                            id: 'settings',
                            name: '系统设置',
                            icon: 'fas fa-cog',
                            badge: null
                        }
                    ]
                };
            },

            methods: {
                // 用户管理
                getCurrentUser() {
                    try {
                        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
                        // 验证是否为教师账号
                        if (!user.username || user.role !== 'teacher') {
                            this.redirectToLogin();
                            return {};
                        }
                        return user;
                    } catch (error) {
                        console.error('获取用户信息失败:', error);
                        this.redirectToLogin();
                        return {};
                    }
                },

                redirectToLogin() {
                    alert('请先登录教师账号');
                    window.location.href = '../index.html';
                },

                logout() {
                    if (confirm('确定要退出吗？')) {
                        localStorage.removeItem('currentUser');
                        window.location.href = '../index.html';
                    }
                },

                // 通知管理
                showNotification(message, type = 'info') {
                    this.notification = { show: true, message, type };
                    // 5秒后自动隐藏
                    setTimeout(() => {
                        this.notification.show = false;
                    }, 5000);
                },

                getNotificationIcon() {
                    const icons = {
                        success: 'fas fa-check-circle',
                        error: 'fas fa-exclamation-circle',
                        warning: 'fas fa-exclamation-triangle',
                        info: 'fas fa-info-circle'
                    };
                    return icons[this.notification.type] || icons.info;
                },

                // 数据加载
                async loadQuestions() {
                    try {
                        this.loadingText = '正在加载题目数据...';
                        
                        // 加载自定义题目
                        this.customQuestions = QuestionEditor.getCustomQuestions();
                        
                        // 加载GitHub题库（可选）
                        try {
                            const result = await PracticeDataLoader.loadAllQuestionBanks();
                            this.allQuestions = [...result.questions, ...this.customQuestions];
                            this.questionBanks = result.banks;
                        } catch (error) {
                            console.warn('GitHub题库加载失败，仅显示自定义题目:', error);
                            this.allQuestions = this.customQuestions;
                        }
                        
                        this.updateStats();
                        this.showNotification('题目数据加载完成', 'success');
                        
                    } catch (error) {
                        console.error('加载题目失败:', error);
                        this.showNotification('加载题目失败: ' + error.message, 'error');
                    }
                },

                async loadStudentFeedbacks() {
                    try {
                        this.loadingText = '正在加载学生反馈...';
                        
                        this.studentFeedbacks = StudentFeedback.getAllFeedbacks();
                        const feedbacksByStudent = StudentFeedback.getFeedbacksByStudent();
                        this.studentList = Object.values(feedbacksByStudent).map(s => s.studentInfo);
                        
                        this.updateFeedbackBadges();
                        this.showNotification('学生反馈数据加载完成', 'success');
                        
                    } catch (error) {
                        console.error('加载学生反馈失败:', error);
                        this.showNotification('加载学生反馈失败: ' + error.message, 'error');
                    }
                },

                // 统计数据更新
                updateStats() {
                    const questionStats = QuestionEditor.getStatistics();
                    const feedbackStats = StudentFeedback.getRealTimeStats();
                    
                    this.stats = {
                        totalQuestions: this.allQuestions.length,
                        activeStudents: feedbackStats.totalStudents,
                        averageScore: feedbackStats.averageScore,
                        todayAnswers: feedbackStats.todayAnswers
                    };
                },

                updateFeedbackBadges() {
                    const realTimeStats = StudentFeedback.getRealTimeStats();
                    
                    // 更新反馈标签的徽章
                    const feedbackTab = this.tabs.find(t => t.id === 'feedback');
                    if (feedbackTab && realTimeStats.todayAnswers > 0) {
                        feedbackTab.badge = realTimeStats.todayAnswers;
                    }
                },

                // 题目管理
                showQuestionEditor(question = null) {
                    this.editingQuestion = question;
                    this.showEditor = true;
                },

                editQuestion(question) {
                    this.showQuestionEditor(question);
                },

                deleteQuestion(questionId) {
                    if (confirm('确定要删除这个题目吗？此操作不可撤销。')) {
                        const result = QuestionEditor.deleteQuestion(questionId);
                        if (result.success) {
                            this.loadQuestions(); // 重新加载题目列表
                            this.showNotification('题目删除成功', 'success');
                        } else {
                            this.showNotification('删除失败: ' + result.error, 'error');
                        }
                    }
                },

                saveQuestion(question) {
                    this.closeEditor();
                    this.loadQuestions(); // 重新加载题目列表
                    this.showNotification('题目保存成功', 'success');
                },

                closeEditor() {
                    this.showEditor = false;
                    this.editingQuestion = null;
                },

                // 系统设置
                getSystemSettings() {
                    try {
                        const settings = localStorage.getItem('teacherSystemSettings');
                        return settings ? JSON.parse(settings) : {
                            autoSaveInterval: 30,
                            dataRetentionDays: 90,
                            enableRealTimeSync: true,
                            showAdvancedFeatures: false,
                            emailNotifications: true,
                            backupFrequency: 'weekly'
                        };
                    } catch (error) {
                        console.error('获取系统设置失败:', error);
                        return {};
                    }
                },

                saveSettings(settings) {
                    try {
                        localStorage.setItem('teacherSystemSettings', JSON.stringify(settings));
                        this.systemSettings = settings;
                        this.showNotification('设置保存成功', 'success');
                    } catch (error) {
                        console.error('保存设置失败:', error);
                        this.showNotification('保存设置失败: ' + error.message, 'error');
                    }
                },

                // 数据导出
                exportData(type) {
                    try {
                        switch (type) {
                            case 'questions':
                                QuestionEditor.exportQuestions();
                                break;
                            case 'feedback':
                                StudentFeedback.exportFeedbackData('json');
                                break;
                            case 'csv':
                                StudentFeedback.exportFeedbackData('csv');
                                break;
                            case 'all':
                                this.exportAllData();
                                break;
                        }
                        this.showNotification('数据导出完成', 'success');
                    } catch (error) {
                        console.error('导出数据失败:', error);
                        this.showNotification('导出失败: ' + error.message, 'error');
                    }
                },

                exportAllData() {
                    const allData = {
                        questions: this.allQuestions,
                        customQuestions: this.customQuestions,
                        studentFeedbacks: this.studentFeedbacks,
                        studentList: this.studentList,
                        stats: this.stats,
                        settings: this.systemSettings,
                        exportTime: new Date().toISOString()
                    };

                    const dataStr = JSON.stringify(allData, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `teacher_data_backup_${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                },

                // 初始化数据
                async initializeData() {
                    try {
                        // 并行加载数据
                        await Promise.all([
                            this.loadQuestions(),
                            this.loadStudentFeedbacks()
                        ]);

                        this.updateStats();
                        
                    } catch (error) {
                        console.error('初始化数据失败:', error);
                        this.showNotification('初始化失败: ' + error.message, 'error');
                    }
                },

                // 自动刷新数据
                startAutoRefresh() {
                    // 每5分钟自动刷新学生反馈数据
                    setInterval(() => {
                        if (this.activeTab === 'feedback') {
                            this.loadStudentFeedbacks();
                        }
                    }, 5 * 60 * 1000);

                    // 每30秒更新实时统计
                    setInterval(() => {
                        this.updateStats();
                        this.updateFeedbackBadges();
                    }, 30 * 1000);
                },

                // 事件监听
                setupEventListeners() {
                    // 监听题目变化事件
                    window.addEventListener('questionChanged', (event) => {
                        console.log('题目变化事件:', event.detail);
                        this.loadQuestions();
                    });

                    // 监听页面可见性变化
                    document.addEventListener('visibilitychange', () => {
                        if (!document.hidden && this.activeTab === 'feedback') {
                            this.loadStudentFeedbacks();
                        }
                    });

                    // 监听键盘快捷键
                    document.addEventListener('keydown', (event) => {
                        if (event.ctrlKey) {
                            switch (event.key) {
                                case 'n':
                                    event.preventDefault();
                                    if (this.activeTab === 'questions') {
                                        this.showQuestionEditor();
                                    }
                                    break;
                                case 'r':
                                    event.preventDefault();
                                    if (this.activeTab === 'questions') {
                                        this.loadQuestions();
                                    } else if (this.activeTab === 'feedback') {
                                        this.loadStudentFeedbacks();
                                    }
                                    break;
                                case 's':
                                    event.preventDefault();
                                    if (this.showEditor) {
                                        // 如果编辑器打开，触发保存
                                        console.log('快捷键保存');
                                    }
                                    break;
                            }
                        }
                    });
                }
            },

            async mounted() {
                console.log('👨‍🏫 教师管理面板启动！');
                
                // 验证权限
                if (!this.currentUser.username) {
                    return;
                }

                try {
                    // 初始化数据
                    await this.initializeData();
                    
                    // 设置事件监听
                    this.setupEventListeners();
                    
                    // 启动自动刷新
                    this.startAutoRefresh();
                    
                    this.loading = false;
                    this.showNotification('教师面板初始化完成', 'success');
                    
                } catch (error) {
                    console.error('启动失败:', error);
                    this.loading = false;
                    this.showNotification('启动失败: ' + error.message, 'error');
                }
            },

            // 注册组件
            components: {
                'question-manager': TeacherComponents.QuestionManager,
                'student-feedback-viewer': TeacherComponents.StudentFeedbackViewer,
                'question-editor-modal': TeacherComponents.QuestionEditorModal,
                'analytics-dashboard': {
                    template: '<div>统计分析功能开发中...</div>'
                },
                'system-settings': {
                    props: ['settings'],
                    emits: ['save'],
                    template: `
                        <div class="system-settings">
                            <h4>系统设置</h4>
                            <p>系统设置功能开发中...</p>
                            <div class="setting-item">
                                <label>数据保留天数: {{ settings.dataRetentionDays }}</label>
                            </div>
                            <div class="setting-item">
                                <label>自动保存间隔: {{ settings.autoSaveInterval }}秒</label>
                            </div>
                        </div>
                    `
                }
            }
        });
    },

    // 启动应用
    mount(selector = '#teacherApp') {
        const app = this.createApp();
        return app.mount(selector);
    }
};

// 自动启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.teacherAppInstance = TeacherApp.mount('#teacherApp');
});

console.log('🎯 教师主应用模块已加载'); 