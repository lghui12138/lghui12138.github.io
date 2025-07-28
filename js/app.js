// ===== 主应用程序 =====
window.App = {
    // 应用状态
    state: {
        initialized: false,
        modules: new Map(),
        currentView: 'dashboard',
        theme: 'dark',
        language: 'zh-CN'
    },
    
    // 初始化应用
    async init() {
        try {
            console.log('🚀 启动流体力学学习平台...');
            
            // 注册核心模块
            this.registerCoreModules();
            
            // 初始化模块
            await this.initializeModules();
            
            // 设置全局事件监听器
            this.setupGlobalEventListeners();
            
            // 初始化UI
            await this.initializeUI();
            
            // 初始化仪表板
            await this.initializeDashboard();
            
            // 标记应用已初始化
            this.state.initialized = true;
            
            // 发布应用就绪事件
            EventBus.emit(SystemEvents.APP_READY, {
                timestamp: Date.now(),
                modules: Array.from(this.state.modules.keys())
            });
            
            console.log('✅ 流体力学学习平台启动完成');
            
        } catch (error) {
            console.error('❌ 应用启动失败:', error);
            EventBus.emit(SystemEvents.APP_ERROR, { error, fatal: true });
            throw error;
        }
    },
    
    // 注册核心模块
    registerCoreModules() {
        this.state.modules.set('config', { name: 'AppConfig', instance: window.AppConfig });
        this.state.modules.set('utils', { name: 'Utils', instance: window.Utils });
        this.state.modules.set('eventBus', { name: 'EventBus', instance: window.EventBus });
        this.state.modules.set('auth', { name: 'AuthSystem', instance: window.AuthSystem });
        this.state.modules.set('storage', { name: 'GitHubStorage', instance: window.GitHubStorage });
        this.state.modules.set('questionBank', { name: 'LocalQuestionBank', instance: window.LocalQuestionBank });
        this.state.modules.set('aiAssistant', { name: 'IntelligentAIAssistant', instance: window.IntelligentAIAssistant });
        
        console.log('📋 核心模块已注册:', Array.from(this.state.modules.keys()));
    },
    
    // 初始化模块
    async initializeModules() {
        const initPromises = [];
        
        for (const [name, module] of this.state.modules) {
            if (module.instance && typeof module.instance.init === 'function') {
                console.log(`🔄 初始化模块: ${name}`);
                try {
                    const initResult = module.instance.init();
                    if (initResult && typeof initResult.catch === 'function') {
                        // 如果返回的是Promise
                        initPromises.push(
                            initResult.catch(error => {
                                console.error(`❌ 模块 ${name} 初始化失败:`, error);
                                return { module: name, error };
                            })
                        );
                    } else {
                        // 如果返回的不是Promise，直接处理
                        console.log(`✅ 模块 ${name} 初始化完成`);
                    }
                } catch (error) {
                    console.error(`❌ 模块 ${name} 初始化失败:`, error);
                }
            }
        }
        
        const results = await Promise.allSettled(initPromises);
        const failedModules = results
            .filter(result => result.status === 'rejected')
            .map(result => result.reason);
            
        if (failedModules.length > 0) {
            console.warn('⚠️ 部分模块初始化失败:', failedModules);
        }
        
        console.log('✅ 模块初始化完成');
    },
    
    // 设置全局事件监听器
    setupGlobalEventListeners() {
        // 错误处理
        EventBus.on(SystemEvents.ERROR_OCCURRED, (error) => {
            console.error('🚨 系统错误:', error);
            this.showNotification('系统错误: ' + error.message, 'error');
        });
        
        // 性能监控
        EventBus.on(SystemEvents.PERFORMANCE_METRIC, (metric) => {
            if (AppConfig.app.debug) {
                console.log('📊 性能指标:', metric);
            }
        });
        
        // 用户登录事件
        EventBus.on(SystemEvents.USER_LOGIN, (data) => {
            console.log('👤 用户登录:', data.user.username);
            this.showNotification(`欢迎回来，${data.user.profile.name}！`, 'success');
            this.updateNavigation();
        });
        
        // 用户注销事件
        EventBus.on(SystemEvents.USER_LOGOUT, (data) => {
            console.log('👋 用户注销:', data.username);
            this.showNotification('已安全注销', 'info');
            this.updateNavigation();
        });
        
        // 通知显示事件
        EventBus.on(SystemEvents.NOTIFICATION_SHOW, (data) => {
            this.showNotification(data.message, data.type, data.duration);
        });
        
        console.log('📡 全局事件监听器已设置');
    },
    
    // 初始化UI
    async initializeUI() {
        try {
            // 初始化通知系统
            this.initNotificationSystem();
            
            // 设置主题
            this.setTheme(this.state.theme);
            
            // 设置语言
            this.setLanguage(this.state.language);
            
            // 隐藏加载屏幕
            await this.hideLoadingScreen();
            
            console.log('✅ UI初始化完成');
        } catch (error) {
            console.error('❌ UI初始化失败:', error);
            throw error;
        }
    },
    
    // 初始化通知系统
    initNotificationSystem() {
        // 创建通知容器
        if (!Utils.dom.get('.notification-container')) {
            const container = Utils.dom.create('div', {
                className: 'notification-container'
            });
            document.body.appendChild(container);
        }
        
        console.log('🔔 通知系统已初始化');
    },
    
    // 显示通知
    showNotification(message, type = 'info', duration = 3000) {
        const container = Utils.dom.get('.notification-container');
        if (!container) {
            console.warn('⚠️ 通知容器未找到');
            return;
        }
        
        const notification = Utils.dom.create('div', {
            className: `notification notification-${type}`
        });
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="${iconMap[type] || iconMap.info}"></i>
                </div>
                <div class="notification-text">${message}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // 自动隐藏
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.add('hide');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, duration);
        }
        
        console.log(`🔔 通知: ${type} - ${message}`);
    },
    
    // 隐藏加载屏幕
    async hideLoadingScreen() {
        const loadingScreen = Utils.dom.get('#loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            await Utils.async.delay(500);
            loadingScreen.style.display = 'none';
        }
    },
    
    // 设置主题
    setTheme(theme) {
        this.state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        Utils.storage.set('theme', theme);
        
        EventBus.emit(SystemEvents.THEME_CHANGED, { theme });
    },
    
    // 设置语言
    setLanguage(language) {
        this.state.language = language;
        document.documentElement.setAttribute('lang', language);
        Utils.storage.set('language', language);
    },
    
    // 更新导航
    updateNavigation() {
        const isAuthenticated = AuthSystem.isAuthenticated();
        const mainNav = Utils.dom.get('#main-nav');
        
        if (mainNav) {
            mainNav.style.display = isAuthenticated ? 'block' : 'none';
        }
        
        // 更新用户信息显示
        if (isAuthenticated && AuthSystem.currentUser) {
            const userInfo = Utils.dom.get('#user-info');
            if (userInfo) {
                userInfo.innerHTML = `
                    <span class="user-name">${AuthSystem.currentUser.profile.name}</span>
                    <span class="user-role">${AuthSystem.currentUser.role === 'admin' ? '管理员' : '学生'}</span>
                `;
            }
        }
    },
    
    // 初始化仪表板
    async initializeDashboard() {
        try {
            const container = Utils.dom.get('#dashboard-container');
            if (!container) {
                console.warn('⚠️ 仪表板容器未找到');
                return;
            }
            
            // 生成仪表板内容
            container.innerHTML = this.generateDashboardHTML();
            
            // 初始化图表
            this.initializeCharts();
            
            console.log('✅ 仪表板初始化完成');
        } catch (error) {
            console.error('❌ 仪表板初始化失败:', error);
        }
    },
    
    // 生成仪表板HTML
    generateDashboardHTML() {
        return `
            <div class="container">
                <div class="dashboard-header">
                    <h1 class="dashboard-title">流体力学学习平台</h1>
                    <p class="dashboard-subtitle">Enterprise Edition v4.0</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-book"></i>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-value">150+</h3>
                            <p class="stat-label">学习资源</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-value">500+</h3>
                            <p class="stat-label">练习题</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-flask"></i>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-value">20+</h3>
                            <p class="stat-label">仿真实验</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-value">1000+</h3>
                            <p class="stat-label">活跃用户</p>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-content">
                    <div class="content-grid">
                        <div class="content-card">
                            <h3>学习进度</h3>
                            <canvas id="progress-chart"></canvas>
                        </div>
                        
                        <div class="content-card">
                            <h3>最近活动</h3>
                            <div class="activity-list">
                                <div class="activity-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>完成了流体静力学章节</span>
                                    <small>2小时前</small>
                                </div>
                                <div class="activity-item">
                                    <i class="fas fa-star"></i>
                                    <span>获得了"初学者"成就</span>
                                    <small>1天前</small>
                                </div>
                                <div class="activity-item">
                                    <i class="fas fa-play"></i>
                                    <span>观看了伯努利方程视频</span>
                                    <small>2天前</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // 初始化图表
    initializeCharts() {
        const ctx = Utils.dom.get('#progress-chart');
        if (!ctx) return;
        
        // 这里可以集成Chart.js等图表库
        console.log('📊 图表初始化完成');
    },
    
    // 显示仪表板
    showDashboard() {
        this.switchView('dashboard');
        this.updateNavigationActive('dashboard');
    },
    
    // 显示学习中心
    showLearningCenter() {
        this.switchView('learning');
        this.updateNavigationActive('learning');
    },
    
    // 显示仿真实验
    showSimulation() {
        this.switchView('simulation');
        this.updateNavigationActive('simulation');
    },
    
    // 显示AI助手
    showAIAssistant() {
        this.switchView('ai-assistant');
        this.updateNavigationActive('ai-assistant');
    },
    
    // 显示个人中心
    showProfile() {
        this.switchView('profile');
        this.updateNavigationActive('profile');
    },
    
    // 显示通知
    showNotifications() {
        this.showNotification('通知功能开发中...', 'info');
    },
    
    // 显示设置
    showSettings() {
        this.showNotification('设置功能开发中...', 'info');
    },
    
    // 切换视图
    switchView(view) {
        this.state.currentView = view;
        
        // 隐藏所有容器
        const containers = [
            '#dashboard-container',
            '#learning-container', 
            '#simulation-container',
            '#ai-assistant-container'
        ];
        
        containers.forEach(selector => {
            const container = Utils.dom.get(selector);
            if (container) {
                container.style.display = 'none';
            }
        });
        
        // 显示目标容器
        const targetContainer = Utils.dom.get(`#${view}-container`);
        if (targetContainer) {
            targetContainer.style.display = 'block';
        }
    },
    
    // 更新导航激活状态
    updateNavigationActive(view) {
        const navLinks = Utils.dom.getAll('#nav-menu a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${view}`) {
                link.classList.add('active');
            }
        });
    },
    
    // 获取应用状态
    getAppState() {
        return {
            ...this.state,
            modules: Array.from(this.state.modules.keys()),
            user: AuthSystem.currentUser ? {
                username: AuthSystem.currentUser.username,
                role: AuthSystem.currentUser.role
            } : null
        };
    }
};

console.log('🚀 主应用程序已加载'); 