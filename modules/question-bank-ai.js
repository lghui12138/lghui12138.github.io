/**
 * 题库AI助手功能模块
 * 负责AI问题生成、智能推荐等功能
 */
window.QuestionBankAI = (function() {
    // 私有变量
    let aiConfig = {
        apiKey: '',
        apiUrl: 'https://api.siliconflow.com/v1/chat/completions',
        model: 'qwen/Qwen2.5-7B-Instruct',
        maxTokens: 2000,
        temperature: 0.7,
        isConnected: false
    };
    
    let generationCache = new Map();
    let recommendationCache = new Map();
    
    // 题目模板
    const questionTemplates = {
        'fluid-basics': {
            name: '流体力学基础',
            keywords: ['密度', '粘度', '压力', '流速', '连续性方程'],
            templates: [
                '关于{concept}的定义，下列说法正确的是？',
                '在流体力学中，{concept}的单位是？',
                '{concept}与{concept2}之间的关系是？'
            ]
        },
        'momentum': {
            name: '动量方程',
            keywords: ['动量定理', '冲量', '动量守恒', '牛顿第二定律'],
            templates: [
                '动量方程{equation}中，{variable}表示什么？',
                '在{condition}条件下，动量方程如何简化？',
                '动量方程的应用条件是什么？'
            ]
        },
        'viscous-flow': {
            name: '粘性流动',
            keywords: ['雷诺数', '层流', '湍流', '边界层'],
            templates: [
                '当雷诺数Re={value}时，流动状态为？',
                '粘性流动中，{parameter}对流动特性的影响是？',
                '边界层理论的基本假设包括？'
            ]
        }
    };
    
    // 公有方法
    return {
        // 初始化模块
        init: function() {
            console.log('初始化AI助手模块...');
            this.loadConfig();
            this.testConnection();
            return this;
        },
        
        // 加载配置
        loadConfig: function() {
            const savedConfig = localStorage.getItem('aiConfig');
            if (savedConfig) {
                try {
                    const config = JSON.parse(savedConfig);
                    aiConfig = { ...aiConfig, ...config };
                } catch (error) {
                    console.error('加载AI配置失败:', error);
                }
            }
        },
        
        // 保存配置
        saveConfig: function() {
            localStorage.setItem('aiConfig', JSON.stringify(aiConfig));
        },
        
        // 测试连接
        testConnection: async function() {
            try {
                const response = await fetch(aiConfig.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${aiConfig.apiKey}`
                    },
                    body: JSON.stringify({
                        model: aiConfig.model,
                        messages: [
                            {
                                role: 'user',
                                content: '测试连接'
                            }
                        ],
                        max_tokens: 10
                    })
                });
                
                if (response.ok) {
                    aiConfig.isConnected = true;
                    console.log('AI连接测试成功');
                } else {
                    aiConfig.isConnected = false;
                    console.log('AI连接测试失败:', response.status);
                }
            } catch (error) {
                aiConfig.isConnected = false;
                console.error('AI连接测试错误:', error);
            }
        },
        
        // 生成AI题目
        generateQuestion: async function(topic, difficulty = 'medium', questionType = 'choice') {
            if (!aiConfig.isConnected && !aiConfig.apiKey) {
                return this.generateFallbackQuestion(topic, difficulty, questionType);
            }
            
            // 检查缓存
            const cacheKey = `${topic}-${difficulty}-${questionType}`;
            if (generationCache.has(cacheKey)) {
                const cached = generationCache.get(cacheKey);
                if (Date.now() - cached.timestamp < 300000) { // 5分钟缓存
                    return cached.question;
                }
            }
            
            try {
                const prompt = this.buildQuestionPrompt(topic, difficulty, questionType);
                const response = await this.callAI(prompt);
                
                const question = this.parseQuestionResponse(response, topic, difficulty, questionType);
                
                // 缓存结果
                generationCache.set(cacheKey, {
                    question: question,
                    timestamp: Date.now()
                });
                
                return question;
            } catch (error) {
                console.error('AI题目生成失败:', error);
                return this.generateFallbackQuestion(topic, difficulty, questionType);
            }
        },
        
        // 构建题目生成提示
        buildQuestionPrompt: function(topic, difficulty, questionType) {
            const difficultyText = {
                'easy': '简单',
                'medium': '中等', 
                'hard': '困难'
            };
            
            const typeText = {
                'choice': '选择题',
                'fill': '填空题',
                'judge': '判断题'
            };
            
            const basePrompt = `请为流体力学课程生成一道关于"${topic}"的${typeText[questionType]}，难度为${difficultyText[difficulty]}。

要求：
1. 题目内容要准确、清晰
2. 符合流体力学理论
3. 难度适中，适合学习者练习
4. 返回JSON格式，包含以下字段：
   - question: 题目描述
   - options: 选项数组（选择题）或正确答案（填空题、判断题）
   - correct: 正确答案索引（选择题）或正确答案（其他）
   - explanation: 答案解释
   - difficulty: 难度等级
   - category: 知识点分类
   - tags: 相关标签数组

示例格式：
{
  "question": "题目内容",
  "options": ["A选项", "B选项", "C选项", "D选项"],
  "correct": 0,
  "explanation": "详细解释",
  "difficulty": "${difficulty}",
  "category": "${topic}",
  "tags": ["标签1", "标签2"]
}`;

            return basePrompt;
        },
        
        // 调用AI接口
        callAI: async function(prompt) {
            const response = await fetch(aiConfig.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${aiConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: aiConfig.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: aiConfig.maxTokens,
                    temperature: aiConfig.temperature
                })
            });
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        },
        
        // 解析AI响应
        parseQuestionResponse: function(response, topic, difficulty, questionType) {
            try {
                // 尝试提取JSON
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const questionData = JSON.parse(jsonMatch[0]);
                    
                    // 验证和补充数据
                    return {
                        id: Date.now(),
                        question: questionData.question || '生成的题目',
                        type: questionType,
                        options: questionType === 'choice' ? (questionData.options || []) : undefined,
                        correct: questionData.correct,
                        explanation: questionData.explanation || '暂无解释',
                        difficulty: difficulty,
                        category: topic,
                        tags: questionData.tags || [topic],
                        source: 'AI生成',
                        createdAt: new Date().toISOString()
                    };
                }
            } catch (error) {
                console.error('解析AI响应失败:', error);
            }
            
            // 降级到模板生成
            return this.generateFallbackQuestion(topic, difficulty, questionType);
        },
        
        // 生成备用题目
        generateFallbackQuestion: function(topic, difficulty, questionType) {
            const templates = this.getFallbackTemplates(topic);
            const template = templates[Math.floor(Math.random() * templates.length)];
            
            return {
                id: Date.now(),
                question: template.question,
                type: questionType,
                options: questionType === 'choice' ? template.options : undefined,
                correct: template.correct,
                explanation: template.explanation,
                difficulty: difficulty,
                category: topic,
                tags: [topic],
                source: '模板生成',
                createdAt: new Date().toISOString()
            };
        },
        
        // 获取备用模板
        getFallbackTemplates: function(topic) {
            const templates = {
                '流体力学基础': [
                    {
                        question: '流体的连续性假设是指什么？',
                        options: [
                            '流体密度处处相等',
                            '流体是连续介质，无间隙',
                            '流体流动是连续的',
                            '流体温度连续变化'
                        ],
                        correct: 1,
                        explanation: '连续性假设认为流体是连续介质，忽略分子间的间隙，便于用连续函数描述流体运动。'
                    },
                    {
                        question: '理想流体的特点是什么？',
                        options: [
                            '无粘性、不可压缩',
                            '有粘性、可压缩',
                            '无粘性、可压缩',
                            '有粘性、不可压缩'
                        ],
                        correct: 0,
                        explanation: '理想流体是指无粘性且不可压缩的流体，是实际流体在某些条件下的简化模型。'
                    }
                ],
                '动量方程': [
                    {
                        question: '动量方程的物理意义是什么？',
                        options: [
                            '描述流体的能量守恒',
                            '描述流体的质量守恒',
                            '描述流体受力与运动的关系',
                            '描述流体的状态方程'
                        ],
                        correct: 2,
                        explanation: '动量方程反映了牛顿第二定律在流体力学中的应用，描述了流体微团受力与其加速度的关系。'
                    }
                ],
                '粘性流动': [
                    {
                        question: '雷诺数的物理意义是什么？',
                        options: [
                            '惯性力与粘性力的比值',
                            '压力与重力的比值',
                            '动能与势能的比值',
                            '切应力与正应力的比值'
                        ],
                        correct: 0,
                        explanation: '雷诺数Re = ρVL/μ，表示惯性力与粘性力的比值，是判断流动状态的重要无量纲参数。'
                    }
                ]
            };
            
            return templates[topic] || templates['流体力学基础'];
        },
        
        // 智能推荐题库
        generateRecommendations: function(userStats, userPreferences = {}) {
            const cacheKey = JSON.stringify({ userStats, userPreferences });
            if (recommendationCache.has(cacheKey)) {
                const cached = recommendationCache.get(cacheKey);
                if (Date.now() - cached.timestamp < 600000) { // 10分钟缓存
                    return cached.recommendations;
                }
            }
            
            const recommendations = this.analyzeAndRecommend(userStats, userPreferences);
            
            recommendationCache.set(cacheKey, {
                recommendations: recommendations,
                timestamp: Date.now()
            });
            
            return recommendations;
        },
        
        // 分析并推荐
        analyzeAndRecommend: function(userStats, userPreferences) {
            const recommendations = [];
            
            // 基于正确率推荐
            if (userStats.correctRate < 60) {
                recommendations.push({
                    type: 'review',
                    title: '基础知识复习',
                    description: '您的正确率较低，建议先复习基础知识',
                    priority: 'high',
                    action: 'practice_basics',
                    reason: '正确率低于60%'
                });
            }
            
            // 基于错题推荐
            if (userStats.wrongQuestionCount > 10) {
                recommendations.push({
                    type: 'wrong_review',
                    title: '错题本复习',
                    description: '您有较多错题，建议重点复习',
                    priority: 'high',
                    action: 'practice_wrong',
                    reason: '错题数量较多'
                });
            }
            
            // 基于学习习惯推荐
            if (userStats.streakDays < 3) {
                recommendations.push({
                    type: 'habit',
                    title: '培养学习习惯',
                    description: '建议每天坚持练习15-30分钟',
                    priority: 'medium',
                    action: 'daily_practice',
                    reason: '连续学习天数较少'
                });
            }
            
            // 基于完成进度推荐
            const completionRate = userStats.totalQuestions > 0 
                ? (userStats.completedQuestions / userStats.totalQuestions) * 100
                : 0;
            
            if (completionRate < 30) {
                recommendations.push({
                    type: 'progress',
                    title: '增加练习量',
                    description: '您的练习进度较慢，建议增加练习时间',
                    priority: 'medium',
                    action: 'more_practice',
                    reason: '完成进度低于30%'
                });
            }
            
            // 基于知识点分析推荐
            const weakAreas = this.identifyWeakAreas(userStats);
            weakAreas.forEach(area => {
                recommendations.push({
                    type: 'knowledge',
                    title: `加强${area.name}练习`,
                    description: `您在${area.name}方面的表现需要提升`,
                    priority: area.severity,
                    action: `practice_${area.id}`,
                    reason: `${area.name}正确率较低`
                });
            });
            
            // 个性化推荐
            if (userPreferences.preferredDifficulty) {
                recommendations.push({
                    type: 'personalized',
                    title: `${userPreferences.preferredDifficulty}难度练习`,
                    description: '根据您的偏好推荐合适难度的题目',
                    priority: 'low',
                    action: `practice_${userPreferences.preferredDifficulty}`,
                    reason: '基于个人偏好'
                });
            }
            
            // 按优先级排序
            return recommendations.sort((a, b) => {
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
        },
        
        // 识别薄弱知识点
        identifyWeakAreas: function(userStats) {
            // 这里应该基于用户的具体答题记录来分析
            // 暂时返回模拟数据
            const weakAreas = [
                {
                    id: 'viscous',
                    name: '粘性流动',
                    correctRate: 45,
                    severity: 'high'
                },
                {
                    id: 'momentum',
                    name: '动量方程',
                    correctRate: 55,
                    severity: 'medium'
                }
            ];
            
            return weakAreas.filter(area => area.correctRate < 70);
        },
        
        // 生成学习计划
        generateStudyPlan: function(userLevel, timeAvailable, goals) {
            const studyPlan = {
                title: '个性化学习计划',
                duration: this.calculatePlanDuration(userLevel, goals),
                phases: []
            };
            
            // 基础阶段
            if (userLevel === 'beginner' || goals.includes('基础')) {
                studyPlan.phases.push({
                    name: '基础知识阶段',
                    duration: '2-3周',
                    topics: ['流体基本概念', '流体静力学', '连续性方程'],
                    dailyTime: Math.min(timeAvailable, 30),
                    objectives: ['掌握基本概念', '理解基本原理']
                });
            }
            
            // 进阶阶段
            if (userLevel !== 'beginner' || goals.includes('进阶')) {
                studyPlan.phases.push({
                    name: '核心理论阶段',
                    duration: '3-4周',
                    topics: ['动量方程', '能量方程', '粘性流动'],
                    dailyTime: Math.min(timeAvailable, 45),
                    objectives: ['熟练应用方程', '分析流动问题']
                });
            }
            
            // 高级阶段
            if (userLevel === 'advanced' || goals.includes('深化')) {
                studyPlan.phases.push({
                    name: '应用提升阶段',
                    duration: '2-3周',
                    topics: ['边界层理论', '湍流基础', '工程应用'],
                    dailyTime: Math.min(timeAvailable, 60),
                    objectives: ['解决复杂问题', '工程实际应用']
                });
            }
            
            return studyPlan;
        },
        
        // 计算计划时长
        calculatePlanDuration: function(userLevel, goals) {
            const baseWeeks = {
                'beginner': 6,
                'intermediate': 4,
                'advanced': 3
            };
            
            let weeks = baseWeeks[userLevel] || 4;
            
            if (goals.includes('考试')) weeks += 2;
            if (goals.includes('深化')) weeks += 3;
            
            return `${weeks}周`;
        },
        
        // 智能提示功能
        generateHint: function(question, userAnswer = null) {
            const hints = {
                'concept': [
                    '先回忆一下相关的基本概念',
                    '注意关键词的含义',
                    '考虑物理意义'
                ],
                'calculation': [
                    '检查单位是否正确',
                    '注意数值计算的精度',
                    '确认公式应用是否合适'
                ],
                'analysis': [
                    '分析题目给出的条件',
                    '画图可能有助于理解',
                    '考虑问题的物理本质'
                ]
            };
            
            // 根据题目类型和用户答案生成针对性提示
            const questionType = this.analyzeQuestionType(question);
            const relevantHints = hints[questionType] || hints['concept'];
            
            return relevantHints[Math.floor(Math.random() * relevantHints.length)];
        },
        
        // 分析题目类型
        analyzeQuestionType: function(question) {
            const text = (question.question || '').toLowerCase();
            
            if (text.includes('计算') || text.includes('求') || /\d+/.test(text)) {
                return 'calculation';
            } else if (text.includes('分析') || text.includes('说明') || text.includes('为什么')) {
                return 'analysis';
            } else {
                return 'concept';
            }
        },
        
        // 获取AI配置
        getConfig: function() {
            return { ...aiConfig };
        },
        
        // 设置AI配置
        setConfig: function(newConfig) {
            aiConfig = { ...aiConfig, ...newConfig };
            this.saveConfig();
            
            if (newConfig.apiKey) {
                this.testConnection();
            }
        },
        
        // 批量生成题目
        batchGenerateQuestions: async function(topics, count = 5) {
            const questions = [];
            const progressCallback = (progress) => {
                showNotification(`生成进度: ${progress}%`, 'info', 1000);
            };
            
            for (let i = 0; i < topics.length; i++) {
                const topic = topics[i];
                for (let j = 0; j < count; j++) {
                    try {
                        const question = await this.generateQuestion(topic);
                        questions.push(question);
                        
                        const progress = Math.round(((i * count + j + 1) / (topics.length * count)) * 100);
                        progressCallback(progress);
                        
                        // 添加延迟避免API限制
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    } catch (error) {
                        console.error(`生成题目失败 (${topic}):`, error);
                    }
                }
            }
            
            return questions;
        },
        
        // 清理缓存
        clearCache: function() {
            generationCache.clear();
            recommendationCache.clear();
            showNotification('AI缓存已清理', 'success');
        },
        
        // 获取使用统计
        getUsageStats: function() {
            return {
                generationCacheSize: generationCache.size,
                recommendationCacheSize: recommendationCache.size,
                isConnected: aiConfig.isConnected,
                hasApiKey: !!aiConfig.apiKey
            };
        }
    };
})(); 