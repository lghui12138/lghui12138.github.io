// ===== 认证系统 =====
window.AuthSystem = {
    // 当前用户信息
    currentUser: null,
    
    // 会话管理
    session: {
        token: null,
        expiresAt: null,
        refreshToken: null
    },
    
    // 默认用户数据（用于演示）
    defaultUsers: [
        {
            id: 1,
            username: 'admin',
            password: 'Admin123!',
            email: 'admin@fluidynamics.com',
            role: 'admin',
            profile: {
                name: '管理员',
                avatar: 'https://via.placeholder.com/64',
                level: 10,
                exp: 5000,
                achievements: ['expert', 'teacher', 'pioneer']
            },
            preferences: {
                theme: 'dark',
                language: 'zh-CN',
                notifications: true
            },
            createdAt: '2024-01-01T00:00:00Z'
        },
        {
            id: 2,
            username: 'student',
            password: 'Student123!',
            email: 'student@example.com',
            role: 'user',
            profile: {
                name: '学生用户',
                avatar: 'https://via.placeholder.com/64',
                level: 3,
                exp: 150,
                achievements: ['beginner']
            },
            preferences: {
                theme: 'light',
                language: 'zh-CN',
                notifications: true
            },
            createdAt: '2024-01-15T08:30:00Z'
        }
    ],
    
    // 初始化认证系统
    async init() {
        console.log('🔐 认证系统初始化...');
        
        try {
            // 检查依赖
            this.checkDependencies();
            
            // 恢复会话
            await this.restoreSession();
            
            // 设置UI事件监听器
            this.setupEventListeners();
            
            // 定期检查会话有效性
            this.startSessionMonitoring();
            
            // 发布初始化完成事件
            if (window.EventBus && window.SystemEvents) {
                EventBus.emit(SystemEvents.APP_INIT, { module: 'auth' });
            }
            
            console.log('✅ 认证系统初始化完成');
        } catch (error) {
            console.error('❌ 认证系统初始化失败:', error);
            this.showMessage('认证系统初始化失败: ' + error.message, 'error');
        }
    },
    
    // 检查依赖
    checkDependencies() {
        const required = ['Utils', 'EventBus', 'SystemEvents', 'AppConfig'];
        const missing = required.filter(dep => !window[dep]);
        
        if (missing.length > 0) {
            throw new Error(`缺少依赖: ${missing.join(', ')}`);
        }
    },
    
    // 恢复会话
    async restoreSession() {
        try {
            const sessionData = Utils.storage.get('userSession');
            
            if (sessionData && sessionData.expiresAt > Date.now()) {
                this.session = sessionData;
                this.currentUser = Utils.storage.get('currentUser');
                
                if (this.currentUser) {
                    console.log('✅ 会话已恢复:', this.currentUser.username);
                    await this.updateUserInterface();
                    return true;
                }
            }
            
            // 清理过期会话
            this.clearSession();
            return false;
        } catch (error) {
            console.error('❌ 恢复会话失败:', error);
            this.clearSession();
            return false;
        }
    },
    
    // 用户登录
    async login(username, password, rememberMe = false) {
        try {
            console.log('🔐 尝试登录:', username);
            
            // 显示加载状态
            this.setLoginLoading(true);
            
            // 验证输入
            const validation = this.validateLoginInput(username, password);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // 模拟网络延迟
            await Utils.async.delay(1000);
            
            // 查找用户
            const user = this.findUser(username, password);
            if (!user) {
                throw new Error('用户名或密码错误');
            }
            
            // 创建会话
            const sessionDuration = rememberMe ? 
                (AppConfig?.storage?.expiry?.cache || 7 * 24 * 60 * 60 * 1000) : 
                (AppConfig?.storage?.expiry?.session || 24 * 60 * 60 * 1000);
                
            this.session = {
                token: this.generateToken(),
                expiresAt: Date.now() + sessionDuration,
                refreshToken: this.generateToken(),
                userId: user.id
            };
            
            // 设置当前用户（移除敏感信息）
            this.currentUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile: user.profile,
                preferences: user.preferences,
                loginTime: new Date().toISOString()
            };
            
            // 保存会话信息
            Utils.storage.set('userSession', this.session, sessionDuration);
            Utils.storage.set('currentUser', this.currentUser, sessionDuration);
            
            // 更新界面
            await this.updateUserInterface();
            
            // 发布登录成功事件
            if (window.EventBus && window.SystemEvents) {
                EventBus.emit(SystemEvents.USER_LOGIN, {
                    user: this.currentUser,
                    sessionDuration
                });
            }
            
            console.log('✅ 用户登录成功:', username);
            this.showMessage('登录成功！欢迎回来，' + user.profile.name, 'success');
            
            // 关闭登录模态框
            this.closeLoginModal();
            
            return { success: true, user: this.currentUser };
            
        } catch (error) {
            console.error('❌ 登录失败:', error.message);
            this.showMessage(error.message, 'error');
            return { success: false, error: error.message };
        } finally {
            this.setLoginLoading(false);
        }
    },
    
    // 用户注销
    async logout() {
        if (!this.currentUser) return;
        
        const username = this.currentUser.username;
        
        // 清理会话
        this.clearSession();
        
        // 更新界面
        await this.updateUserInterface();
        
        // 发布注销事件
        if (window.EventBus && window.SystemEvents) {
            EventBus.emit(SystemEvents.USER_LOGOUT, { username });
        }
        
        console.log('✅ 用户已注销:', username);
        this.showMessage('已安全注销', 'info');
        
        // 显示登录模态框
        this.showLoginModal();
    },
    
    // 清理会话
    clearSession() {
        this.currentUser = null;
        this.session = { token: null, expiresAt: null, refreshToken: null };
        
        Utils.storage.remove('userSession');
        Utils.storage.remove('currentUser');
    },
    
    // 验证登录输入
    validateLoginInput(username, password) {
        if (!username || !password) {
            return { valid: false, message: '请输入用户名和密码' };
        }
        
        if (username.length < 3) {
            return { valid: false, message: '用户名至少需要3个字符' };
        }
        
        if (password.length < 6) {
            return { valid: false, message: '密码至少需要6个字符' };
        }
        
        return { valid: true };
    },
    
    // 查找用户
    findUser(username, password) {
        return this.defaultUsers.find(user => 
            user.username === username && user.password === password
        );
    },
    
    // 生成令牌
    generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    },
    
    // 检查是否已认证
    isAuthenticated() {
        return this.currentUser !== null && 
               this.session.expiresAt > Date.now();
    },
    
    // 检查权限
    hasPermission(permission) {
        if (!this.isAuthenticated()) return false;
        
        const rolePermissions = {
            admin: ['read', 'write', 'delete', 'manage_users', 'manage_content'],
            user: ['read', 'write'],
            guest: ['read']
        };
        
        return rolePermissions[this.currentUser.role]?.includes(permission) || false;
    },
    
    // 更新用户界面
    async updateUserInterface() {
        try {
            const isLoggedIn = this.isAuthenticated();
            
            // 更新导航栏
            this.updateUserDisplay();
            
            // 更新登录模态框
            if (isLoggedIn) {
                this.hideLoginModal();
            } else {
                this.showLoginModal();
            }
            
            // 更新主导航显示
            const mainNav = Utils.dom.get('#main-nav');
            if (mainNav) {
                mainNav.style.display = isLoggedIn ? 'block' : 'none';
            }
            
            console.log('✅ 用户界面已更新，登录状态:', isLoggedIn);
        } catch (error) {
            console.error('❌ 更新用户界面失败:', error);
        }
    },
    
    // 更新用户显示
    updateUserDisplay() {
        const userInfo = Utils.dom.get('#user-info');
        if (userInfo && this.currentUser) {
            userInfo.innerHTML = `
                <span class="user-name">${this.currentUser.profile.name}</span>
                <span class="user-role">${this.currentUser.role === 'admin' ? '管理员' : '学生'}</span>
            `;
        }
    },
    
    // 开始会话监控
    startSessionMonitoring() {
        setInterval(() => {
            if (this.isAuthenticated() && this.session.expiresAt - Date.now() < 5 * 60 * 1000) {
                this.renewSession();
            }
        }, 60000); // 每分钟检查一次
    },
    
    // 续期会话
    async renewSession() {
        try {
            if (!this.isAuthenticated()) return;
            
            const newExpiry = Date.now() + (AppConfig?.storage?.expiry?.session || 24 * 60 * 60 * 1000);
            this.session.expiresAt = newExpiry;
            
            Utils.storage.set('userSession', this.session, newExpiry);
            
            console.log('✅ 会话已续期');
        } catch (error) {
            console.error('❌ 会话续期失败:', error);
            this.handleSessionExpired();
        }
    },
    
    // 处理会话过期
    handleSessionExpired() {
        const username = this.currentUser?.username;
        
        this.clearSession();
        this.updateUserInterface();
        
        if (window.EventBus && window.SystemEvents) {
            EventBus.emit(SystemEvents.USER_SESSION_EXPIRED, { username });
        }
        
        this.showMessage('会话已过期，请重新登录', 'warning');
    },
    
    // 设置事件监听器
    setupEventListeners() {
        try {
            // 登录表单提交
            const loginForm = Utils.dom.get('#login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const username = Utils.dom.get('#username')?.value;
                    const password = Utils.dom.get('#password')?.value;
                    const rememberMe = Utils.dom.get('#remember-me')?.checked;
                    
                    if (!username || !password) {
                        this.showMessage('请输入用户名和密码', 'error');
                        return;
                    }
                    
                    await this.login(username, password, rememberMe);
                });
                
                console.log('✅ 登录表单事件监听器已设置');
            } else {
                console.warn('⚠️ 未找到登录表单');
            }
            
            // 登录模态框关闭按钮
            const closeBtn = Utils.dom.get('#login-modal .close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    if (this.isAuthenticated()) {
                        this.closeLoginModal();
                    }
                });
            }
            
            // 全局注销函数
            window.logout = () => this.logout();
            window.showPasswordResetModal = () => this.showPasswordResetModal();
            window.showSignupModal = () => this.showSignupModal();
            window.loginWithGitHub = () => this.loginWithGitHub();
            window.loginWithGoogle = () => this.loginWithGoogle();
            
            console.log('✅ 认证系统事件监听器已设置');
        } catch (error) {
            console.error('❌ 设置事件监听器失败:', error);
        }
    },
    
    // 显示登录模态框
    showLoginModal() {
        const modal = Utils.dom.get('#login-modal');
        if (modal) {
            modal.classList.add('show');
            Utils.dom.get('#username')?.focus();
        }
    },
    
    // 隐藏登录模态框
    hideLoginModal() {
        const modal = Utils.dom.get('#login-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    },
    
    // 关闭登录模态框
    closeLoginModal() {
        if (this.isAuthenticated()) {
            this.hideLoginModal();
        }
    },
    
    // 设置登录加载状态
    setLoginLoading(loading) {
        const submitBtn = Utils.dom.get('#login-form button[type="submit"]');
        if (submitBtn) {
            if (loading) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
            } else {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 登录';
            }
        }
    },
    
    // 显示消息
    showMessage(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // 发布通知事件
        if (window.EventBus && window.SystemEvents) {
            EventBus.emit(SystemEvents.NOTIFICATION_SHOW, {
                message,
                type,
                duration: 3000
            });
        } else {
            // 备用消息显示
            alert(`${type.toUpperCase()}: ${message}`);
        }
    },
    
    // 社交登录方法（占位符）
    async loginWithGitHub() {
        this.showMessage('GitHub登录功能开发中...', 'info');
    },
    
    async loginWithGoogle() {
        this.showMessage('Google登录功能开发中...', 'info');
    },
    
    // 显示密码重置模态框
    showPasswordResetModal() {
        this.showMessage('密码重置功能开发中...', 'info');
    },
    
    // 显示注册模态框
    showSignupModal() {
        this.showMessage('用户注册功能开发中...', 'info');
    },
    
    // 获取用户统计信息
    getUserStats() {
        if (!this.isAuthenticated()) return null;
        
        return {
            username: this.currentUser.username,
            level: this.currentUser.profile.level,
            exp: this.currentUser.profile.exp,
            achievementCount: this.currentUser.profile.achievements.length,
            loginTime: this.currentUser.loginTime,
            sessionDuration: Math.floor((Date.now() - new Date(this.currentUser.loginTime).getTime()) / 1000)
        };
    }
};

// 初始化认证系统
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AuthSystem.init();
    });
} else {
    // DOM已经加载完成
    AuthSystem.init();
}

console.log('🔐 认证系统已加载'); 