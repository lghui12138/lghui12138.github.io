// 🌊 流体力学学习平台 - 共享组件库
// Vue 3.0 组件和工具函数

// 全局配置
window.FluidMechanicsConfig = {
    apiBaseUrl: 'https://lghui12138.github.io',
    version: '2.0.0-dynamic',
    theme: 'ocean',
    debug: true
};

// 共享的Vue Mixin
window.SharedMixin = {
    data() {
        return {
            loading: false,
            notification: '',
            oceanTheme: {
                primaryColor: '#006994',
                secondaryColor: '#4facfe',
                accentColor: '#00f2fe'
            }
        }
    },
    methods: {
        // 显示通知
        showNotification(message, type = 'info', duration = 3000) {
            this.notification = { message, type, show: true };
            setTimeout(() => {
                this.notification = '';
            }, duration);
        },
        
        // 导航到模块
        navigateToModule(moduleUrl, newWindow = true) {
            if (newWindow) {
                window.open(moduleUrl, '_blank');
            } else {
                window.location.href = moduleUrl;
            }
        },
        
        // 设置加载状态
        setLoading(state) {
            this.loading = state;
        },
        
        // 格式化时间
        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        },
        
        // 保存到本地存储
        saveToStorage(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            } catch (e) {
                console.error('保存失败:', e);
                return false;
            }
        },
        
        // 从本地存储读取
        loadFromStorage(key, defaultValue = null) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : defaultValue;
            } catch (e) {
                console.error('读取失败:', e);
                return defaultValue;
            }
        },
        
        // 严格检查是否是指定教师账号
        isAuthorizedTeacher() {
            const currentUser = this.loadFromStorage('currentUser', {});
            const teacherUsers = ['liuguanghui6330156', 'lgh', 'lgh6330156'];
            return teacherUsers.includes(currentUser.username) && currentUser.authorized === true;
        },
        
        // 检查是否是教师账号（兼容旧方法）
        isTeacher() {
            return this.isAuthorizedTeacher();
        },
        
        // 验证教师权限并显示错误信息
        requireTeacherAccess(moduleName = '此功能') {
            if (!this.isAuthorizedTeacher()) {
                this.showNotification(`${moduleName}需要教师权限访问`, 'error');
                return false;
            }
            return true;
        },
        
        // 登录方法（强化权限控制）
        login(username, password) {
            const teacherUsers = ['liuguanghui6330156', 'lgh', 'lgh6330156'];
            // 教师权限必须来自首页的 PBKDF2 会话，避免公开脚本内置口令或免密提权。
            if (teacherUsers.includes(username)) {
                const sessionUser = window.FMSecurity?.getUser?.();
                if (sessionUser?.username === username && sessionUser?.role === 'teacher') {
                    const user = {
                        username: sessionUser.username,
                        role: 'teacher',
                        displayName: sessionUser.name || '教师',
                        loginTime: new Date().toISOString(),
                        authorized: true
                    };
                    this.saveToStorage('currentUser', user);
                    return { success: true, user };
                }
                return { success: false, message: '请先从首页完成教师登录' };
            }
            
            // 学生账号 (简单验证，无教师权限)
            if (username && password) {
                const user = {
                    username: username,
                    role: 'student', 
                    displayName: username,
                    loginTime: new Date().toISOString(),
                    authorized: false
                };
                this.saveToStorage('currentUser', user);
                return { success: true, user };
            }
            
            return { success: false, message: '用户名或密码错误' };
        }
    }
};

// 海洋主题组件
window.OceanBackground = {
    template: `
        <div class="ocean-background">
            <div class="ocean-waves">
                <div class="wave" v-for="n in 3" :key="n" :class="'wave-' + n"></div>
            </div>
            <div class="ocean-creatures">
                <div v-for="creature in creatures" :key="creature.id" 
                     class="creature" 
                     :class="'creature-' + creature.id"
                     :style="getCreatureStyle(creature)">
                    {{ creature.icon }}
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            creatures: [
                { id: 1, icon: '🐟', y: 15, delay: 0, duration: 25 },
                { id: 2, icon: '🐠', y: 35, delay: 5, duration: 30 },
                { id: 3, icon: '🐡', y: 55, delay: 10, duration: 20 },
                { id: 4, icon: '🦈', y: 25, delay: 15, duration: 35 },
                { id: 5, icon: '🐙', y: 70, delay: 20, duration: 40 },
                { id: 6, icon: '🦑', y: 45, delay: 25, duration: 28 }
            ]
        }
    },
    methods: {
        getCreatureStyle(creature) {
            return {
                top: creature.y + '%',
                animationDelay: creature.delay + 's',
                animationDuration: creature.duration + 's'
            };
        }
    }
};

// 通知组件
window.NotificationComponent = {
    template: `
        <transition name="notification" appear>
            <div v-if="notification && notification.show" 
                 class="notification" 
                 :class="'notification-' + (notification.type || 'info')">
                <i class="fas" :class="getIcon()"></i>
                <span>{{ notification.message }}</span>
                <button @click="close" class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </transition>
    `,
    props: ['notification'],
    emits: ['close'],
    methods: {
        getIcon() {
            const icons = {
                success: 'fa-check-circle',
                warning: 'fa-exclamation-triangle',
                error: 'fa-times-circle',
                info: 'fa-info-circle'
            };
            return icons[this.notification?.type] || icons.info;
        },
        close() {
            this.$emit('close');
        }
    }
};

// 模块卡片组件
window.ModuleCard = {
    template: `
        <div class="module-card" @click="$emit('click', module)">
            <div class="module-header">
                <div class="module-icon">
                    <i :class="module.icon"></i>
                </div>
                <div class="module-badge" v-if="module.badge" :class="'badge-' + module.badge.type">
                    {{ module.badge.text }}
                </div>
            </div>
            <div class="module-body">
                <h3 class="module-title">{{ module.title }}</h3>
                <p class="module-description">{{ module.description }}</p>
                <div class="module-stats" v-if="hasStats">
                    <span v-if="module.questionCount > 0">
                        <i class="far fa-file-alt"></i> {{ module.questionCount }}题
                    </span>
                    <span v-if="module.estimatedTime > 0">
                        <i class="far fa-clock"></i> {{ module.estimatedTime }}分钟
                    </span>
                    <span class="difficulty" :class="'difficulty-' + module.difficulty">
                        {{ getDifficultyText(module.difficulty) }}
                    </span>
                </div>
                <div class="module-features" v-if="module.features">
                    <span v-for="feature in module.features.slice(0, 3)" 
                          :key="feature" 
                          class="feature-tag">
                        {{ feature }}
                    </span>
                </div>
            </div>
            <div class="module-footer">
                <button class="module-button" @click.stop="$emit('start', module)">
                    <i class="fas fa-play"></i> 开始学习
                </button>
            </div>
        </div>
    `,
    props: ['module'],
    emits: ['click', 'start'],
    computed: {
        hasStats() {
            return this.module.questionCount > 0 || this.module.estimatedTime > 0;
        }
    },
    methods: {
        getDifficultyText(difficulty) {
            const texts = {
                'easy': '简单',
                'medium': '中等',
                'hard': '困难'
            };
            return texts[difficulty] || '未知';
        }
    }
};

// 学习统计组件
window.StatsPanel = {
    template: `
        <div class="stats-panel">
            <h3 class="stats-title">
                <i class="fas fa-chart-bar"></i> 学习统计
            </h3>
            <div class="stats-grid">
                <div class="stat-item" v-for="stat in stats" :key="stat.key">
                    <div class="stat-number" :style="{ color: stat.color }">
                        {{ stat.value }}
                    </div>
                    <div class="stat-label">{{ stat.label }}</div>
                </div>
            </div>
        </div>
    `,
    props: {
        totalQuestions: { type: Number, default: 0 },
        completedSessions: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        studyTime: { type: Number, default: 0 }
    },
    computed: {
        stats() {
            return [
                {
                    key: 'total',
                    value: this.totalQuestions,
                    label: '总题目数',
                    color: '#667eea'
                },
                {
                    key: 'completed',
                    value: this.completedSessions,
                    label: '完成练习',
                    color: '#4facfe'
                },
                {
                    key: 'score',
                    value: this.averageScore + '%',
                    label: '平均分数',
                    color: '#00f2fe'
                },
                {
                    key: 'time',
                    value: this.studyTime,
                    label: '学习时长(分钟)',
                    color: '#764ba2'
                }
            ];
        }
    }
};

// 加载动画组件
window.LoadingSpinner = {
    template: `
        <div class="loading-spinner" v-if="show">
            <div class="spinner">
                <div class="wave-spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
            </div>
            <div class="loading-text">{{ text }}</div>
        </div>
    `,
    props: {
        show: { type: Boolean, default: false },
        text: { type: String, default: '加载中...' }
    }
};

// 样式注入函数
window.injectSharedStyles = function() {
    if (document.getElementById('shared-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'shared-styles';
    style.textContent = `
        /* 海洋背景样式 */
        .ocean-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
        }

        .ocean-waves .wave {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 200%;
            height: 150px;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><path d="M0,50 Q250,0 500,50 T1000,50 L1000,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/></svg>') repeat-x;
            animation: wave-animation 20s linear infinite;
        }

        .ocean-waves .wave-2 {
            bottom: 10px;
            opacity: 0.8;
            animation: wave-animation 18s linear infinite reverse;
        }

        .ocean-waves .wave-3 {
            bottom: 20px;
            opacity: 0.6;
            animation: wave-animation 25s linear infinite;
        }

        @keyframes wave-animation {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        .creature {
            position: absolute;
            font-size: 2em;
            opacity: 0.6;
            animation: swim 25s linear infinite;
            pointer-events: none;
        }

        @keyframes swim {
            0% { 
                transform: translateX(-100px) translateY(0px);
                opacity: 0;
            }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { 
                transform: translateX(calc(100vw + 100px)) translateY(-50px);
                opacity: 0;
            }
        }

        /* 通知样式 */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
        }

        .notification-info { background: rgba(52, 152, 219, 0.9); color: white; }
        .notification-success { background: rgba(39, 174, 96, 0.9); color: white; }
        .notification-warning { background: rgba(243, 156, 18, 0.9); color: white; }
        .notification-error { background: rgba(231, 76, 60, 0.9); color: white; }

        .notification-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 5px;
            margin-left: 10px;
        }

        .notification-enter-active, .notification-leave-active {
            transition: all 0.3s ease;
        }

        .notification-enter-from {
            transform: translateX(100%);
            opacity: 0;
        }

        .notification-leave-to {
            transform: translateX(100%);
            opacity: 0;
        }

        /* 模块卡片样式 */
        .module-card {
            background: white;
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.4s ease;
            cursor: pointer;
            overflow: hidden;
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .module-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .module-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }

        .module-icon {
            font-size: 3em;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .module-badge {
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: bold;
        }

        .badge-new { background: #e74c3c; color: white; }
        .badge-hot { background: #f39c12; color: white; }
        .badge-recommended { background: #27ae60; color: white; }

        .module-body {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .module-title {
            font-size: 1.4em;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
        }

        .module-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 15px;
            flex: 1;
        }

        .module-stats {
            display: flex;
            gap: 15px;
            margin-bottom: 10px;
            font-size: 0.9em;
            color: #888;
            flex-wrap: wrap;
        }

        .difficulty-easy { color: #27ae60; }
        .difficulty-medium { color: #f39c12; }
        .difficulty-hard { color: #e74c3c; }

        .module-features {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }

        .feature-tag {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 500;
        }

        .module-footer {
            margin-top: auto;
        }

        .module-button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .module-button:hover {
            background: linear-gradient(135deg, #5a6fd8, #6a4190);
            transform: scale(1.02);
        }

        /* 统计面板样式 */
        .stats-panel {
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }

        .stats-title {
            color: white;
            text-align: center;
            margin-bottom: 20px;
            font-size: 1.2em;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            text-align: center;
        }

        .stat-item {
            color: white;
        }

        .stat-number {
            font-size: 2.2em;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .stat-label {
            font-size: 0.9em;
            opacity: 0.9;
        }

        /* 加载动画样式 */
        .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: white;
        }

        .wave-spinner {
            display: flex;
            gap: 4px;
        }

        .wave-spinner div {
            background-color: #fff;
            height: 40px;
            width: 6px;
            animation: wave-spinner 1.2s infinite ease-in-out;
        }

        .wave-spinner .rect2 { animation-delay: -1.1s; }
        .wave-spinner .rect3 { animation-delay: -1.0s; }
        .wave-spinner .rect4 { animation-delay: -0.9s; }
        .wave-spinner .rect5 { animation-delay: -0.8s; }

        @keyframes wave-spinner {
            0%, 40%, 100% { 
                transform: scaleY(0.4);
            } 20% { 
                transform: scaleY(1.0);
            }
        }

        .loading-text {
            margin-top: 20px;
            font-size: 1.1em;
        }
    `;
    
    document.head.appendChild(style);
};

// 自动注入样式
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.injectSharedStyles);
    } else {
        window.injectSharedStyles();
    }
}

console.log('🌊 共享组件库加载完成！'); 
