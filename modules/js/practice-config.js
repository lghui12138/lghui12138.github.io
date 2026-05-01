// 练习模块配置文件
window.PracticeConfig = {
    // GitHub配置
    github: {
        owner: 'lghui12138',
        repo: 'lghui12138.github.io',
        branch: 'main',
        rawBaseUrl: 'https://raw.githubusercontent.com/lghui12138/lghui12138.github.io/main'
    },

    // 题库文件配置
    questionBanks: [
        { 
            file: '易错题集.json', 
            category: '易错', 
            name: '易错题集', 
            description: '高频易错题目专项训练',
            difficulty: 'hard'
        },
        { 
            file: '真题_中国海洋大学_2000-2024_fixed.json', 
            category: '真题', 
            name: '真题合集(精修)', 
            description: '中国海洋大学历年真题 2000-2024 精修版', 
            year: '2000-2024',
            difficulty: 'hard'
        },
        { 
            file: '真题_中国海洋大学_2000-2021.json', 
            category: '真题', 
            name: '真题合集(完整)', 
            description: '中国海洋大学历年真题完整版', 
            year: '2000-2021',
            difficulty: 'hard'
        },
        { 
            file: '分类_动量方程.json', 
            category: '分类', 
            name: '动量方程', 
            description: '动量方程专题练习',
            difficulty: 'medium'
        },
        { 
            file: '分类_势流.json', 
            category: '分类', 
            name: '势流', 
            description: '势流理论专题练习',
            difficulty: 'medium'
        },
        { 
            file: '分类_压力.json', 
            category: '分类', 
            name: '压力', 
            description: '流体压力专题练习',
            difficulty: 'easy'
        },
        { 
            file: '分类_实验与量纲.json', 
            category: '分类', 
            name: '实验与量纲', 
            description: '实验方法与量纲分析',
            difficulty: 'medium'
        },
        { 
            file: '分类_流体力学基础.json', 
            category: '分类', 
            name: '流体力学基础', 
            description: '流体力学基础知识',
            difficulty: 'easy'
        },
        { 
            file: '分类_流体性质.json', 
            category: '分类', 
            name: '流体性质', 
            description: '流体物理性质专题',
            difficulty: 'easy'
        },
        { 
            file: '分类_流线轨迹.json', 
            category: '分类', 
            name: '流线轨迹', 
            description: '流线与轨迹线专题',
            difficulty: 'medium'
        },
        { 
            file: '分类_涡度.json', 
            category: '分类', 
            name: '涡度', 
            description: '涡度与旋转流动',
            difficulty: 'hard'
        },
        { 
            file: '分类_湍流.json', 
            category: '分类', 
            name: '湍流', 
            description: '湍流理论与应用',
            difficulty: 'hard'
        },
        { 
            file: '分类_管道流动.json', 
            category: '分类', 
            name: '管道流动', 
            description: '管道内流动专题',
            difficulty: 'medium'
        },
        { 
            file: '分类_粘性.json', 
            category: '分类', 
            name: '粘性', 
            description: '粘性流体力学',
            difficulty: 'medium'
        },
        { 
            file: '分类_能量方程.json', 
            category: '分类', 
            name: '能量方程', 
            description: '能量方程专题练习',
            difficulty: 'medium'
        },
        { 
            file: '分类_自由面.json', 
            category: '分类', 
            name: '自由面', 
            description: '自由表面流动',
            difficulty: 'hard'
        },
        { 
            file: '分类_边界层.json', 
            category: '分类', 
            name: '边界层', 
            description: '边界层理论专题',
            difficulty: 'hard'
        },
        { 
            file: '分类_雷诺数.json', 
            category: '分类', 
            name: '雷诺数', 
            description: '雷诺数与流动状态',
            difficulty: 'medium'
        }
    ],

    // 难度等级配置
    difficultyLevels: {
        easy: { text: '简单', color: '#43e97b' },
        medium: { text: '中等', color: '#feca57' },
        hard: { text: '困难', color: '#ff6b6b' }
    },

    // 默认设置
    defaults: {
        loadingTimeout: 10000, // 加载超时时间(毫秒)
        autoNextDelay: 3000,   // 自动下一题延迟(毫秒)
        particleCount: 9,      // 浮动粒子数量
        saveProgressInterval: 30000, // 自动保存间隔(毫秒)
    },

    // 键盘快捷键配置
    shortcuts: {
        enter: '提交答案',
        arrowLeft: '上一题',
        arrowRight: '下一题',
        f11: '全屏切换',
        escape: '退出/返回',
        's': '保存进度(Ctrl+S)',
        '1': '选择选项A',
        '2': '选择选项B',
        '3': '选择选项C',
        '4': '选择选项D'
    },

    // 本地存储键名
    storageKeys: {
        progress: 'practiceProgress',
        userStats: 'userStats',
        selectedBanks: 'selectedQuestionBanks',
        filters: 'practiceFilters',
        settings: 'practiceSettings'
    },

    // API端点配置
    endpoints: {
        questionBanks: '/question-banks/',
        stats: '/api/stats',
        progress: '/api/progress'
    },

    // 主题色彩配置
    themes: {
        default: {
            primary: '#667eea',
            secondary: '#764ba2',
            accent: '#4facfe',
            success: '#43e97b',
            warning: '#feca57',
            error: '#ff6b6b'
        }
    }
};

// 工具函数
window.PracticeUtils = {
    // 格式化时间
    formatTime(seconds) {
        if (seconds < 60) return `${seconds}秒`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
        return `${Math.floor(seconds / 3600)}小时${Math.floor((seconds % 3600) / 60)}分钟`;
    },

    // 格式化日期
    formatDate(timestamp) {
        return new Date(timestamp).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // 获取难度文本
    getDifficultyText(difficulty) {
        return PracticeConfig.difficultyLevels[difficulty]?.text || '中等';
    },

    // 获取难度颜色
    getDifficultyColor(difficulty) {
        return PracticeConfig.difficultyLevels[difficulty]?.color || '#feca57';
    },

    // 随机打乱数组
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

console.log('🔧 练习模块配置已加载'); 