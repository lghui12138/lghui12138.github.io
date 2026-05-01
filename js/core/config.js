// ===== 全局配置 =====
window.AppConfig = {
    // 应用信息
    app: {
        name: '流体力学学习平台',
        version: '4.1.0', // 更新版本号强制刷新缓存
        environment: 'production', // 切换到生产环境
        debug: false, // 生产环境关闭调试
        cacheVersion: '20250105' // 缓存版本控制
    },
    
    // API配置
    api: {
        // 硅基流动AI API
        siliconFlow: {
            endpoint: 'https://api.siliconflow.cn/v1/chat/completions',
            apiKey: localStorage.getItem('siliconFlowApiKey') || '',
            model: 'deepseek-chat',
            maxTokens: 2048,
            temperature: 0.7,
            rateLimit: {
                requestsPerMinute: 20,
                delayBetweenRequests: 3000 // 3秒
            }
        },
        
        // 智能AI模型选择配置
        smartAI: {
            enabled: true,
            endpoint: 'https://api.siliconflow.cn/v1/chat/completions',
            apiKey: localStorage.getItem('siliconFlowApiKey') || '',
            maxRetries: 1, // 减少重试次数，给单次调用更多时间
            requestTimeout: 600000, // 10分钟超时，支持DeepSeek-R1长时间推理
            rateLimitDelay: 1000,
            modelCheckInterval: 10 * 60 * 1000, // 10分钟检查一次模型可用性（仅在需要时）
            defaultStrategy: 'balanced', // balanced, fast, quality
            fallbackModel: 'Qwen/Qwen2.5-7B-Instruct',
            skipAvailabilityCheck: true, // 跳过模型可用性检查，节省时间和费用
            
            // 模型选择策略配置
            strategies: {
                fast: {
                    prioritizeSpeed: true,
                    maxResponseTime: 5000,
                    preferredCategories: ['lightweight', 'balanced']
                },
                balanced: {
                    balanceSpeedQuality: true,
                    maxResponseTime: 15000,
                    preferredCategories: ['balanced', 'premium', 'lightweight']
                },
                quality: {
                    prioritizeQuality: true,
                    maxResponseTime: 30000,
                    preferredCategories: ['premium', 'special', 'balanced']
                }
            },
            
            // 复杂度映射配置
            complexityMapping: {
                simple: {
                    preferredCategories: ['lightweight', 'balanced'],
                    maxTokens: 1000,
                    temperature: 0.5
                },
                medium: {
                    preferredCategories: ['balanced', 'premium'],
                    maxTokens: 1500,
                    temperature: 0.7
                },
                complex: {
                    preferredCategories: ['premium', 'special'],
                    maxTokens: 2500,
                    temperature: 0.8
                }
            },
            
            // 功能特定配置
            featureMapping: {
                chat: ['general', 'chat'],
                reasoning: ['reasoning', 'analysis', 'problem-solving'],
                vision: ['vision', 'image-analysis', 'multimodal'],
                math: ['reasoning', 'logic', 'math'],
                qa: ['qa', 'general'],
                generation: ['general', 'chat']
            }
        },
        
        // GitHub存储API
        github: {
            baseUrl: 'https://api.github.com',
            owner: 'lghui12138',
            repo: 'lghui12138.github.io',
            defaultBranch: 'main',
            timeout: 30000
        },
        
        // 其他API
        video: {
            uploadEndpoint: '/api/video/upload',
            streamEndpoint: '/api/video/stream',
            maxFileSize: 500 * 1024 * 1024, // 500MB
            allowedFormats: ['mp4', 'webm', 'ogg', 'mov', 'avi']
        }
    },
    
    // 本地存储配置
    storage: {
        prefix: 'fluidDynamics_',
        keys: {
            userSession: 'userSession',
            preferences: 'preferences',
            learningProgress: 'learningProgress',
            questionBank: 'questionBank',
            videoLibrary: 'videoLibrary',
            aiChatHistory: 'aiChatHistory'
        },
        expiry: {
            session: 24 * 60 * 60 * 1000, // 24小时
            cache: 7 * 24 * 60 * 60 * 1000, // 7天
            temporary: 60 * 60 * 1000 // 1小时
        }
    },
    
    // 题库配置
    questionBank: {
        defaultCategory: 'basic',
        defaultDifficulty: 'medium',
        questionsPerPage: 5,
        timeLimit: 30 * 60, // 30分钟
        categories: {
            basic: '基础概念',
            flow: '流动分析',
            pressure: '压力计算',
            viscosity: '粘性流动',
            turbulence: '湍流理论',
            applications: '工程应用'
        },
        difficulties: {
            easy: { label: '简单', color: '#10b981', points: 1 },
            medium: { label: '中等', color: '#f59e0b', points: 2 },
            hard: { label: '困难', color: '#ef4444', points: 3 }
        }
    },
    
    // UI配置
    ui: {
        theme: {
            primary: '#4facfe',
            secondary: '#00f2fe',
            accent: '#ff6b6b',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        },
        animation: {
            duration: {
                fast: 200,
                normal: 300,
                slow: 500
            },
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        breakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024,
            wide: 1440
        }
    },
    
    // 仿真配置
    simulation: {
        canvas: {
            width: 800,
            height: 600,
            fps: 60
        },
        physics: {
            gravity: 9.81,
            density: 1000,
            viscosity: 0.001,
            timeStep: 0.016
        },
        particles: {
            maxCount: 1000,
            defaultSize: 2,
            colors: ['#4facfe', '#00f2fe', '#ffffff']
        }
    },
    
    // 数据分析配置
    analytics: {
        enabled: true,
        trackingEvents: [
            'login', 'logout', 'question_answered', 'video_watched',
            'simulation_started', 'ai_interaction', 'progress_updated'
        ],
        retentionPeriod: 30, // 天
        exportFormats: ['json', 'csv', 'pdf']
    },
    
    // 安全配置
    security: {
        encryption: {
            algorithm: 'AES-GCM',
            keyLength: 256
        },
        session: {
            timeout: 30 * 60 * 1000, // 30分钟
            renewThreshold: 5 * 60 * 1000 // 5分钟前续期
        },
        validation: {
            password: {
                minLength: 8,
                requireUppercase: true,
                requireNumbers: true,
                requireSpecialChars: true
            },
            username: {
                minLength: 3,
                maxLength: 20,
                allowedPattern: /^[a-zA-Z0-9_]+$/
            }
        }
    },
    
    // 国际化配置
    i18n: {
        defaultLanguage: 'zh-CN',
        supportedLanguages: ['zh-CN', 'en-US'],
        fallbackLanguage: 'zh-CN',
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        numberFormat: {
            decimal: 2,
            thousands: ','
        }
    },
    
    // 性能监控配置
    performance: {
        monitoring: {
            enabled: true,
            metricsEndpoint: '/api/metrics',
            sampleRate: 0.1 // 10%采样率
        },
        optimization: {
            lazyLoading: true,
            imageCompression: true,
            cacheStrategy: 'stale-while-revalidate'
        },
        thresholds: {
            pageLoadTime: 3000, // 3秒
            apiResponseTime: 1000, // 1秒
            memoryUsage: 100 * 1024 * 1024 // 100MB
        }
    }
};

// ===== 环境特定配置 =====
if (AppConfig.app.environment === 'production') {
    AppConfig.app.debug = false;
    AppConfig.api.siliconFlow.rateLimit.requestsPerMinute = 10;
    AppConfig.performance.monitoring.sampleRate = 1.0;
}

// ===== 配置验证 =====
function validateConfig() {
    const requiredKeys = [
        'app.name',
        'api.siliconFlow.endpoint',
        'api.siliconFlow.apiKey',
        'storage.prefix'
    ];
    
    for (const key of requiredKeys) {
        const value = key.split('.').reduce((obj, k) => obj?.[k], AppConfig);
        if (!value) {
            console.error(`❌ 配置错误: 缺少必需的配置项 ${key}`);
            return false;
        }
    }
    
    console.log('✅ 配置验证通过');
    return true;
}

// ===== 配置工具函数 =====
window.ConfigUtils = {
    // 获取配置值
    get(path, defaultValue = null) {
        return path.split('.').reduce((obj, key) => obj?.[key], AppConfig) ?? defaultValue;
    },
    
    // 设置配置值
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, AppConfig);
        target[lastKey] = value;
    },
    
    // 获取存储键名
    getStorageKey(key) {
        return AppConfig.storage.prefix + key;
    },
    
    // 获取API URL
    getApiUrl(service, endpoint = '') {
        const baseUrl = AppConfig.api[service]?.baseUrl || AppConfig.api[service]?.endpoint;
        return baseUrl ? `${baseUrl}${endpoint}` : null;
    },
    
    // 检查功能是否启用
    isFeatureEnabled(feature) {
        return this.get(`features.${feature}`, false);
    },
    
    // 获取主题颜色
    getThemeColor(color) {
        return this.get(`ui.theme.${color}`, '#000000');
    }
};

// 验证配置
validateConfig();

console.log('🔧 配置系统已加载', {
    version: AppConfig.app.version,
    environment: AppConfig.app.environment,
    debug: AppConfig.app.debug
}); 
