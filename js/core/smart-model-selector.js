/**
 * 智能AI模型选择系统
 * 基于消息复杂度自动选择最合适的AI模型
 * 支持模型可用性检测和智能回退机制
 */
window.SmartModelSelector = (function() {
    'use strict';
    
    // 私有变量
    let config = {
        apiKey: "sk-dhseqxecuwwotodiskfdgwdjahnbexcgdotkfsovbgajxnis",
        apiUrl: "https://api.siliconflow.cn/v1/chat/completions",
        maxRetries: 1, // 减少重试次数，给单次调用更多时间
        requestTimeout: 600000, // 增加到10分钟，专门适应DeepSeek-R1的长推理时间
        rateLimitDelay: 1000
    };
    
    // 模型列表（按性能和用途分类）
    const modelList = {
        // 主推模型 - 高性能
        premium: [
            {
                name: "deepseek-ai/DeepSeek-V3",
                category: "premium",
                complexity: ["complex", "medium"],
                features: ["reasoning", "analysis", "problem-solving"],
                priority: 1
            },
            {
                name: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B", // 使用可用的R1变体
                category: "premium",
                complexity: ["complex"],
                features: ["reasoning", "research", "deep-analysis"],
                priority: 2
            }
        ],
        
        // Qwen系列 - 平衡性能
        balanced: [
            {
                name: "Qwen/Qwen2.5-72B-Instruct",
                category: "balanced",
                complexity: ["complex", "medium"],
                features: ["general", "analysis", "chat"],
                priority: 1
            },
            {
                name: "Qwen/Qwen2.5-32B-Instruct",
                category: "balanced", 
                complexity: ["medium", "simple"],
                features: ["general", "chat", "qa"],
                priority: 2
            },
            {
                name: "Qwen/Qwen2.5-14B-Instruct",
                category: "balanced",
                complexity: ["medium", "simple"],
                features: ["general", "chat"],
                priority: 3
            }
        ],
        
        // 轻量模型 - 快速响应
        lightweight: [
            {
                name: "Qwen/Qwen2.5-7B-Instruct",
                category: "lightweight",
                complexity: ["simple", "medium"],
                features: ["chat", "qa", "simple-tasks"],
                priority: 1
            }
        ],
        
        // 视觉模型
        vision: [
            {
                name: "Qwen/Qwen2.5-VL-72B-Instruct",
                category: "vision",
                complexity: ["complex", "medium"],
                features: ["vision", "image-analysis", "multimodal"],
                priority: 1
            },
            {
                name: "Qwen/Qwen2.5-VL-32B-Instruct",
                category: "vision",
                complexity: ["medium", "simple"],
                features: ["vision", "image-analysis"],
                priority: 2
            }
        ],
        
        // 特殊模型
        special: [
            {
                name: "Qwen/QVQ-72B-Preview",
                category: "special",
                complexity: ["complex"],
                features: ["reasoning", "logic", "math"],
                priority: 1
            },
            {
                name: "Qwen/QwQ-32B",
                category: "special",
                complexity: ["medium", "complex"],
                features: ["qa", "reasoning"],
                priority: 2
            }
        ]
    };
    
    // 可用模型缓存
    let availableModels = new Map();
    let modelPerformance = new Map();
    let lastAvailabilityCheck = 0;
    const CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存
    
    // 复杂度分析关键词
    const complexityKeywords = {
        complex: [
            "为什么", "怎么", "如何", "分析", "解释", "原理", "机制",
            "推理", "逻辑", "证明", "计算", "详细", "深入", "专业",
            "算法", "数学", "物理", "化学", "量子", "深度学习",
            "流体力学", "动力学", "热力学", "传热", "传质", "湍流",
            "边界层", "雷诺数", "纳维-斯托克斯", "伯努利"
        ],
        medium: [
            "什么", "哪个", "建议", "推荐", "比较", "区别", "选择",
            "方法", "步骤", "介绍", "说明", "总结", "概念", "定义",
            "公式", "计算题", "例题", "练习", "应用"
        ],
        simple: [
            "你好", "hello", "hi", "谢谢", "再见", "是什么", "简单",
            "基础", "入门", "快速", "简介"
        ]
    };
    
    // 公有方法
    return {
        /**
         * 初始化智能模型选择器
         * @param {Object} options 配置选项
         */
        init: async function(options = {}) {
            // 合并配置
            Object.assign(config, options);
            
            console.log('🤖 智能AI模型选择器初始化中...');
            
            // 如果配置了跳过可用性检查，则不检查模型
            if (!config.skipAvailabilityCheck) {
                // 检查模型可用性
                await this.checkModelAvailability();
                console.log(`✅ 智能模型选择器初始化完成，发现 ${availableModels.size} 个可用模型`);
            } else {
                console.log('⚡ 跳过模型可用性检查，快速初始化完成');
                // 假设所有模型都可用，存储完整的模型信息
                const allModels = [
                    ...modelList.premium,
                    ...modelList.balanced, 
                    ...modelList.lightweight,
                    ...modelList.vision,
                    ...modelList.special
                ];
                allModels.forEach(model => {
                    availableModels.set(model.name, model);
                });
                console.log(`✅ 预设 ${availableModels.size} 个模型为可用状态`);
            }
            
            return this;
        },
        
        /**
         * 检查所有模型的可用性
         */
        checkModelAvailability: async function() {
            const now = Date.now();
            
            // 如果缓存还有效，直接返回
            if (now - lastAvailabilityCheck < CACHE_DURATION && availableModels.size > 0) {
                console.log('📋 使用缓存的模型可用性信息');
                return availableModels;
            }
            
            console.log('🔍 检查模型可用性...');
            
            const allModels = [
                ...modelList.premium,
                ...modelList.balanced, 
                ...modelList.lightweight,
                ...modelList.vision,
                ...modelList.special
            ];
            
            // 并发检查模型可用性（限制并发数）
            const batchSize = 3;
            for (let i = 0; i < allModels.length; i += batchSize) {
                const batch = allModels.slice(i, i + batchSize);
                const checkPromises = batch.map(model => this.testModelAvailability(model));
                
                await Promise.allSettled(checkPromises);
                
                // 避免API限制
                if (i + batchSize < allModels.length) {
                    await this.sleep(config.rateLimitDelay);
                }
            }
            
            lastAvailabilityCheck = now;
            console.log(`✅ 模型可用性检查完成，${availableModels.size}/${allModels.length} 个模型可用`);
            
            return availableModels;
        },
        
        /**
         * 测试单个模型的可用性
         * @param {Object} model 模型信息
         */
        testModelAvailability: async function(model) {
            try {
                const startTime = Date.now();
                
                const response = await fetch(config.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.apiKey}`
                    },
                    body: JSON.stringify({
                        model: model.name,
                        messages: [{
                            role: "user", 
                            content: "测试"
                        }],
                        max_tokens: 10,
                        temperature: 0.1
                    }),
                    signal: AbortSignal.timeout(10000) // 模型检查使用较短的超时时间
                });
                
                const responseTime = Date.now() - startTime;
                
                if (response.ok) {
                    const result = await response.json();
                    
                    // 记录模型性能
                    modelPerformance.set(model.name, {
                        responseTime,
                        lastTested: Date.now(),
                        success: true
                    });
                    
                    // 添加到可用模型列表
                    availableModels.set(model.name, {
                        ...model,
                        responseTime,
                        available: true
                    });
                    
                    console.log(`✅ ${model.name} - 可用 (${responseTime}ms)`);
                } else {
                    console.log(`❌ ${model.name} - HTTP ${response.status}`);
                }
                
            } catch (error) {
                console.log(`❌ ${model.name} - 错误: ${error.message}`);
                
                modelPerformance.set(model.name, {
                    responseTime: Infinity,
                    lastTested: Date.now(),
                    success: false,
                    error: error.message
                });
            }
        },
        
        /**
         * 智能选择最佳模型
         * @param {string} message 用户消息
         * @param {Object} options 选择选项
         * @returns {Object} 选择的模型信息
         */
        selectBestModel: async function(message, options = {}) {
            // 如果指定了preferredModel，直接返回指定的模型
            if (options.preferredModel) {
                console.log(`🎯 强制使用指定模型: ${options.preferredModel}`);

                if (options.preferredModel === 'deepseek-r1') {
                    // 特殊处理deepseek-r1 - 尝试多个可能的模型名称
                    const possibleModels = [
                        "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
                        "deepseek-ai/DeepSeek-R1",
                        "deepseek-ai/deepseek-r1"
                    ];

                    // 使用第一个可能的模型名称
                    const model = {
                        name: possibleModels[0],
                        category: "premium",
                        complexity: ["complex"],
                        features: ["reasoning", "research", "deep-analysis"],
                        priority: 1
                    };
                    console.log(`✅ 强制选择deepseek-r1模型: ${model.name}`);
                    return model;
                } else if (options.preferredModel === 'deepseek-v3') {
                    // 特殊处理deepseek-v3
                    const model = {
                        name: "deepseek-ai/DeepSeek-V3",
                        category: "premium",
                        complexity: ["complex", "medium"],
                        features: ["reasoning", "analysis", "problem-solving"],
                        priority: 1
                    };
                    console.log(`✅ 强制选择deepseek-v3模型: ${model.name}`);
                    return model;
                } else if (availableModels.has(options.preferredModel)) {
                    const model = availableModels.get(options.preferredModel);
                    console.log(`✅ 强制选择指定模型: ${model.name}`);
                    return model;
                } else {
                    console.warn(`⚠️ 指定模型 ${options.preferredModel} 不可用，回退到智能选择`);
                }
            }

            // 只有在配置允许时才检查模型可用性
            if (!config.skipAvailabilityCheck) {
                await this.checkModelAvailability();
            }

            if (availableModels.size === 0) {
                throw new Error('没有可用的AI模型');
            }

            // 分析消息复杂度
            const complexity = this.analyzeComplexity(message);

            // 根据选项调整选择策略
            const strategy = options.strategy || 'balanced'; // balanced, fast, quality
            const features = options.features || [];

            console.log(`🧠 消息复杂度: ${complexity}, 策略: ${strategy}`);

            // 获取候选模型
            let candidates = this.getCandidateModels(complexity, features, strategy);

            if (candidates.length === 0) {
                // 回退到任何可用模型
                candidates = Array.from(availableModels.values());
            }

            // 选择最佳模型
            const bestModel = this.selectFromCandidates(candidates, strategy);

            console.log(`🎯 选择模型: ${bestModel.name} (${complexity})`);
            
            return bestModel;
        },
        
        /**
         * 分析消息复杂度
         * @param {string} message 用户消息
         * @returns {string} 复杂度级别 (simple, medium, complex)
         */
        analyzeComplexity: function(message) {
            if (!message || message.length < 5) {
                return 'simple';
            }
            
            const messageLower = message.toLowerCase();
            
            // 统计不同复杂度关键词出现次数
            const complexCount = complexityKeywords.complex.filter(
                keyword => messageLower.includes(keyword)
            ).length;
            
            const mediumCount = complexityKeywords.medium.filter(
                keyword => messageLower.includes(keyword)
            ).length;
            
            const simpleCount = complexityKeywords.simple.filter(
                keyword => messageLower.includes(keyword)
            ).length;
            
            // 综合判断
            if (complexCount > 0 || message.length > 100) {
                return 'complex';
            } else if (mediumCount > 0 || message.length > 30) {
                return 'medium';
            } else {
                return 'simple';
            }
        },
        
        /**
         * 获取候选模型
         * @param {string} complexity 复杂度
         * @param {Array} features 需要的功能
         * @param {string} strategy 选择策略
         */
        getCandidateModels: function(complexity, features, strategy) {
            let candidates = [];
            
            // 遍历所有可用模型
            for (const [modelName, modelInfo] of availableModels) {
                // 检查复杂度匹配
                if (!modelInfo.complexity.includes(complexity)) {
                    continue;
                }
                
                // 检查功能匹配
                if (features.length > 0) {
                    const hasRequiredFeatures = features.some(
                        feature => modelInfo.features.includes(feature)
                    );
                    if (!hasRequiredFeatures) {
                        continue;
                    }
                }
                
                candidates.push(modelInfo);
            }
            
            // 根据策略排序
            switch (strategy) {
                case 'fast':
                    candidates.sort((a, b) => a.responseTime - b.responseTime);
                    break;
                case 'quality':
                    candidates.sort((a, b) => a.priority - b.priority);
                    break;
                case 'balanced':
                default:
                    candidates.sort((a, b) => {
                        const scoreA = a.priority + (a.responseTime / 1000);
                        const scoreB = b.priority + (b.responseTime / 1000);
                        return scoreA - scoreB;
                    });
                    break;
            }
            
            return candidates;
        },
        
        /**
         * 从候选模型中选择最佳的
         * @param {Array} candidates 候选模型列表
         * @param {string} strategy 选择策略
         */
        selectFromCandidates: function(candidates, strategy) {
            if (candidates.length === 0) {
                throw new Error('没有符合条件的候选模型');
            }
            
            // 返回第一个候选模型（已经根据策略排序）
            return candidates[0];
        },
        
        /**
         * 调用AI API
         * @param {string} message 用户消息
         * @param {Object} options 调用选项
         */
        callAI: async function(message, options = {}) {
            // selectBestModel现在已经处理了preferredModel逻辑
            const model = await this.selectBestModel(message, options);

            const requestBody = {
                model: model.name,
                messages: options.messages || [
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: options.maxTokens || 1500,
                temperature: options.temperature || 0.7,
                stream: false, // 确保不使用流式响应
                ...options.modelParams
            };

            // 对于DeepSeek-R1，添加特殊优化参数
            if (model.name.includes('DeepSeek-R1')) {
                requestBody.temperature = Math.min(requestBody.temperature, 0.3); // 降低随机性
                requestBody.top_p = 0.8; // 限制采样范围，提高稳定性
                requestBody.frequency_penalty = 0.1; // 减少重复
                console.log('🎯 为DeepSeek-R1优化请求参数:', {
                    temperature: requestBody.temperature,
                    top_p: requestBody.top_p,
                    frequency_penalty: requestBody.frequency_penalty
                });
            }
            
            // 添加系统提示词
            if (options.systemPrompt && !requestBody.messages.find(m => m.role === 'system')) {
                requestBody.messages.unshift({
                    role: 'system',
                    content: options.systemPrompt
                });
            }
            
            let lastError;
            
            // 重试机制
            for (let retry = 0; retry < config.maxRetries; retry++) {
                const timeoutValue = options.requestTimeout || config.requestTimeout;
                console.log(`🚀 调用AI模型: ${model.name} (尝试 ${retry + 1}/${config.maxRetries}) - 超时: ${timeoutValue/1000}秒`);

                // 创建AbortController来手动控制超时
                const controller = new AbortController();
                let timeoutId = null;
                let heartbeatInterval = null; // 移到外层作用域

                try {
                    // 为DeepSeek-R1实现心跳机制
                    if (model.name.includes('DeepSeek-R1') && timeoutValue > 60000) {
                        console.log('💓 启动DeepSeek-R1心跳机制');
                        heartbeatInterval = setInterval(() => {
                            console.log('💓 DeepSeek-R1心跳 - 连接保持活跃');
                        }, 30000); // 每30秒心跳一次
                    }

                    timeoutId = setTimeout(() => {
                        console.warn(`⏰ 模型 ${model.name} 超时 (${timeoutValue/1000}秒)，主动取消请求`);
                        if (heartbeatInterval) {
                            clearInterval(heartbeatInterval);
                        }
                        controller.abort();
                    }, timeoutValue);

                    const response = await fetch(config.apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${config.apiKey}`,
                            'Keep-Alive': 'timeout=600, max=1000', // 保持连接
                            'Connection': 'keep-alive'
                        },
                        body: JSON.stringify(requestBody),
                        signal: controller.signal,
                        keepalive: true // 浏览器保持连接
                    });

                    // 清除超时计时器和心跳
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                    if (heartbeatInterval) {
                        clearInterval(heartbeatInterval);
                        heartbeatInterval = null;
                    }
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    const result = await response.json();
                    
                    // 更新模型性能信息
                    if (modelPerformance.has(model.name)) {
                        const perf = modelPerformance.get(model.name);
                        perf.lastUsed = Date.now();
                        perf.successCount = (perf.successCount || 0) + 1;
                    }
                    
                    return {
                        content: result.choices[0].message.content,
                        model: model.name,
                        usage: result.usage,
                        response: result
                    };
                    
                } catch (error) {
                    // 确保清除超时计时器和心跳
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                    if (heartbeatInterval) {
                        clearInterval(heartbeatInterval);
                        heartbeatInterval = null;
                    }

                    lastError = error;
                    console.warn(`⚠️ 模型 ${model.name} 调用失败 (尝试 ${retry + 1}): ${error.message}`);
                    
                    // 如果不是最后一次重试，等待后重试
                    if (retry < config.maxRetries - 1) {
                        await this.sleep(1000 * (retry + 1)); // 递增延迟
                    }
                }
            }
            
            throw new Error(`AI调用失败: ${lastError.message}`);
        },
        
        /**
         * 获取可用模型统计信息
         */
        getModelStats: function() {
            const stats = {
                total: availableModels.size,
                byCategory: {},
                byComplexity: {},
                performance: {}
            };
            
            for (const [name, model] of availableModels) {
                // 按分类统计
                stats.byCategory[model.category] = (stats.byCategory[model.category] || 0) + 1;
                
                // 按复杂度统计
                model.complexity.forEach(c => {
                    stats.byComplexity[c] = (stats.byComplexity[c] || 0) + 1;
                });
                
                // 性能统计
                if (modelPerformance.has(name)) {
                    const perf = modelPerformance.get(name);
                    stats.performance[name] = {
                        responseTime: perf.responseTime,
                        successCount: perf.successCount || 0,
                        lastUsed: perf.lastUsed
                    };
                }
            }
            
            return stats;
        },
        
        /**
         * 更新配置
         * @param {Object} newConfig 新配置
         */
        updateConfig: function(newConfig) {
            Object.assign(config, newConfig);
            console.log('🔧 智能模型选择器配置已更新');
        },
        
        /**
         * 获取当前配置
         */
        getConfig: function() {
            return { ...config };
        },
        
        /**
         * 睡眠函数
         * @param {number} ms 毫秒数
         */
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };
})(); 