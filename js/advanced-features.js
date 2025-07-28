// ==================== 高级题库管理系统 ====================
class AdvancedQuizSystem {
    constructor() {
        this.questionBank = [];
        this.userAnswers = [];
        this.currentQuestion = 0;
        this.analytics = {
            totalQuestions: 0,
            correctAnswers: 0,
            timeSpent: 0,
            categoryPerformance: {}
        };
        this.loadQuestionBank();
    }

    // 加载题库数据
    async loadQuestionBank() {
        try {
            const response = await fetch('/data/extended_exercises.json');
            this.questionBank = await response.json();
            console.log('题库加载完成:', this.questionBank.length, '道题目');
        } catch (error) {
            console.error('题库加载失败:', error);
            // 使用默认题库
            this.questionBank = this.getDefaultQuestions();
        }
    }

    // 默认题库
    getDefaultQuestions() {
        return [
            {
                id: 1,
                category: "基础概念",
                difficulty: "初级",
                type: "单选题",
                question: "流体的定义是什么？",
                options: [
                    "能够承受任意大小剪切应力的物质",
                    "不能承受剪切应力的物质",
                    "在静止状态下不能承受剪切应力的物质",
                    "具有固定形状的物质"
                ],
                correct: 2,
                explanation: "流体的基本特征是在静止状态下不能承受剪切应力，一旦有剪切应力作用就会发生连续变形。",
                points: 5,
                tags: ["流体定义", "基础理论"],
                hint: "思考流体与固体的根本区别"
            },
            {
                id: 2,
                category: "基础概念",
                difficulty: "初级",
                type: "单选题",
                question: "连续介质假设的含义是什么？",
                options: [
                    "流体是由连续分布的质点组成的",
                    "流体分子之间没有空隙",
                    "流体的物理量在空间中连续分布",
                    "流体不可压缩"
                ],
                correct: 2,
                explanation: "连续介质假设认为流体的密度、压力、速度等物理量在空间中连续分布，忽略分子运动的随机性。",
                points: 5,
                tags: ["连续介质", "基础假设"],
                hint: "连续介质假设是流体力学的基本假设之一"
            }
        ];
    }

    // 智能出题算法
    generateQuiz(options = {}) {
        const {
            category = 'all',
            difficulty = 'all',
            count = 10,
            type = 'all',
            excludeIds = []
        } = options;

        let filteredQuestions = this.questionBank.filter(q => {
            if (excludeIds.includes(q.id)) return false;
            if (category !== 'all' && q.category !== category) return false;
            if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
            if (type !== 'all' && q.type !== type) return false;
            return true;
        });

        // 智能选题：按难度分布
        const selectedQuestions = this.intelligentSelection(filteredQuestions, count);
        
        return {
            questions: selectedQuestions,
            totalPoints: selectedQuestions.reduce((sum, q) => sum + q.points, 0),
            estimatedTime: selectedQuestions.reduce((sum, q) => sum + (q.estimated_time || 60), 0),
            difficulty_distribution: this.analyzeDifficulty(selectedQuestions)
        };
    }

    // 智能选题算法
    intelligentSelection(questions, count) {
        if (questions.length <= count) return questions;

        // 按难度分层
        const easy = questions.filter(q => q.difficulty === '初级');
        const medium = questions.filter(q => q.difficulty === '中级');
        const hard = questions.filter(q => q.difficulty === '高级');

        // 智能分配比例 (40% 初级, 40% 中级, 20% 高级)
        const easyCount = Math.ceil(count * 0.4);
        const mediumCount = Math.ceil(count * 0.4);
        const hardCount = count - easyCount - mediumCount;

        const selected = [];
        selected.push(...this.randomSelect(easy, easyCount));
        selected.push(...this.randomSelect(medium, mediumCount));
        selected.push(...this.randomSelect(hard, hardCount));

        return selected.slice(0, count);
    }

    // 随机选择
    randomSelect(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, array.length));
    }

    // 分析难度分布
    analyzeDifficulty(questions) {
        const distribution = { '初级': 0, '中级': 0, '高级': 0 };
        questions.forEach(q => distribution[q.difficulty]++);
        return distribution;
    }

    // 自适应出题系统
    adaptiveQuizGeneration(userProfile) {
        const {
            weakPoints = [],
            strongPoints = [],
            preferredDifficulty = '中级',
            timeLimit = 3600,
            recentMistakes = []
        } = userProfile;

        // 根据用户弱点增加相关题目权重
        let weightedQuestions = this.questionBank.map(q => {
            let weight = 1;
            
            // 弱点题目权重增加
            if (q.knowledge_points && q.knowledge_points.some(point => weakPoints.includes(point))) {
                weight += 2;
            }
            
            // 最近错误题目类型权重增加
            if (recentMistakes.some(mistake => mistake.category === q.category)) {
                weight += 1.5;
            }
            
            // 强项题目权重降低
            if (q.knowledge_points && q.knowledge_points.some(point => strongPoints.includes(point))) {
                weight *= 0.5;
            }

            return { ...q, weight };
        });

        // 按权重选择题目
        return this.weightedSelection(weightedQuestions, timeLimit);
    }

    // 题目推荐系统
    recommendQuestions(userId, currentQuestion) {
        // 基于内容的推荐
        const contentRecommendations = this.getContentBasedRecommendations(currentQuestion);
        
        // 基于协同过滤的推荐
        const collaborativeRecommendations = this.getCollaborativeRecommendations(userId);
        
        return [...contentRecommendations, ...collaborativeRecommendations].slice(0, 10);
    }

    // 基于内容的推荐
    getContentBasedRecommendations(currentQuestion) {
        if (!currentQuestion) return [];
        
        return this.questionBank.filter(q => {
            if (q.id === currentQuestion.id) return false;
            
            // 相同类别
            if (q.category === currentQuestion.category) return true;
            
            // 相关标签
            if (q.tags && currentQuestion.tags && 
                q.tags.some(tag => currentQuestion.tags.includes(tag))) return true;
            
            return false;
        }).slice(0, 5);
    }

    // 评估答题结果
    evaluateAnswer(questionId, userAnswer, timeSpent) {
        const question = this.questionBank.find(q => q.id === questionId);
        if (!question) return null;

        const isCorrect = userAnswer === question.correct;
        const result = {
            questionId,
            userAnswer,
            correctAnswer: question.correct,
            isCorrect,
            timeSpent,
            points: isCorrect ? question.points : 0,
            explanation: question.explanation,
            category: question.category,
            difficulty: question.difficulty
        };

        // 更新统计数据
        this.updateAnalytics(result);
        
        return result;
    }

    // 更新统计数据
    updateAnalytics(result) {
        this.analytics.totalQuestions++;
        if (result.isCorrect) {
            this.analytics.correctAnswers++;
        }
        this.analytics.timeSpent += result.timeSpent;
        
        // 分类别统计
        if (!this.analytics.categoryPerformance[result.category]) {
            this.analytics.categoryPerformance[result.category] = {
                total: 0,
                correct: 0
            };
        }
        this.analytics.categoryPerformance[result.category].total++;
        if (result.isCorrect) {
            this.analytics.categoryPerformance[result.category].correct++;
        }
    }

    // 生成学习报告
    generateReport() {
        const accuracy = this.analytics.totalQuestions > 0 ? 
            (this.analytics.correctAnswers / this.analytics.totalQuestions) * 100 : 0;
        
        const avgTimePerQuestion = this.analytics.totalQuestions > 0 ?
            this.analytics.timeSpent / this.analytics.totalQuestions : 0;

        const categoryAnalysis = Object.entries(this.analytics.categoryPerformance)
            .map(([category, data]) => ({
                category,
                accuracy: (data.correct / data.total) * 100,
                total: data.total
            }));

        return {
            totalQuestions: this.analytics.totalQuestions,
            correctAnswers: this.analytics.correctAnswers,
            accuracy: accuracy.toFixed(1),
            avgTimePerQuestion: Math.round(avgTimePerQuestion),
            categoryAnalysis,
            recommendations: this.generateRecommendations(categoryAnalysis)
        };
    }

    // 生成学习建议
    generateRecommendations(categoryAnalysis) {
        const recommendations = [];
        
        categoryAnalysis.forEach(category => {
            if (category.accuracy < 60) {
                recommendations.push({
                    type: 'weakness',
                    message: `${category.category}需要加强练习，正确率仅为${category.accuracy.toFixed(1)}%`
                });
            } else if (category.accuracy > 85) {
                recommendations.push({
                    type: 'strength',
                    message: `${category.category}掌握良好，正确率达到${category.accuracy.toFixed(1)}%`
                });
            }
        });

        if (this.analytics.totalQuestions < 20) {
            recommendations.push({
                type: 'suggestion',
                message: '建议多做练习题，增加练习量有助于提高成绩'
            });
        }

        return recommendations;
    }
}

// ==================== 高级视频管理系统 ====================
class AdvancedVideoSystem {
    constructor() {
        this.videoDatabase = [];
        this.currentVideo = null;
        this.watchHistory = [];
        this.analytics = {
            totalWatchTime: 0,
            videosWatched: 0,
            completionRate: 0
        };
        this.loadVideoDatabase();
    }

    // 加载视频数据库
    async loadVideoDatabase() {
        try {
            const response = await fetch('/data/extended_videos.json');
            this.videoDatabase = await response.json();
            console.log('视频数据库加载完成:', this.videoDatabase.length, '个视频');
        } catch (error) {
            console.error('视频数据库加载失败:', error);
            this.videoDatabase = this.getDefaultVideos();
        }
    }

    // 默认视频数据
    getDefaultVideos() {
        return [
            {
                id: 1,
                title: "流体力学基础概念导论",
                description: "介绍流体力学的基本概念",
                duration: 1800,
                chapter: "第一章",
                difficulty: "初级",
                url: "/videos/chapter1/introduction.mp4",
                thumbnail: "/videos/thumbnails/chapter1_intro.jpg",
                instructor: "张教授"
            },
            {
                id: 2,
                title: "流体的物理性质",
                description: "详解流体的密度、粘度等性质",
                duration: 2100,
                chapter: "第一章",
                difficulty: "初级",
                url: "/videos/chapter1/properties.mp4",
                thumbnail: "/videos/thumbnails/chapter1_properties.jpg",
                instructor: "李教授"
            }
        ];
    }

    // 视频上传功能
    uploadVideo(file, metadata) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('video/')) {
                reject(new Error('请选择有效的视频文件'));
                return;
            }

            // 检查文件大小 (最大2GB)
            if (file.size > 2 * 1024 * 1024 * 1024) {
                reject(new Error('视频文件过大，请选择小于2GB的文件'));
                return;
            }

            const formData = new FormData();
            formData.append('video', file);
            formData.append('metadata', JSON.stringify(metadata));

            // 创建上传进度跟踪
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    this.updateUploadProgress(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    reject(new Error('上传失败'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('网络错误'));
            });

            xhr.open('POST', '/api/upload/video');
            xhr.send(formData);
        });
    }

    // 更新上传进度
    updateUploadProgress(percent) {
        const progressBar = document.getElementById('upload-progress');
        const progressText = document.getElementById('upload-progress-text');
        
        if (progressBar) {
            progressBar.style.width = percent + '%';
        }
        
        if (progressText) {
            progressText.textContent = `上传进度: ${Math.round(percent)}%`;
        }

        // 触发进度更新事件
        document.dispatchEvent(new CustomEvent('uploadProgress', {
            detail: { percent }
        }));
    }

    // 智能视频推荐
    recommendVideos(userId, currentVideo) {
        const userHistory = this.getUserWatchHistory(userId);
        const userPreferences = this.analyzeUserPreferences(userHistory);
        
        let recommendations = [];

        // 基于内容的推荐
        if (currentVideo) {
            const contentBased = this.getContentBasedVideoRecommendations(currentVideo);
            recommendations.push(...contentBased);
        }

        // 基于用户偏好的推荐
        const preferenceBased = this.getPreferenceBasedRecommendations(userPreferences);
        recommendations.push(...preferenceBased);

        // 去重并排序
        const uniqueRecommendations = this.deduplicateRecommendations(recommendations);
        return this.rankRecommendations(uniqueRecommendations, userPreferences);
    }

    // 分析用户偏好
    analyzeUserPreferences(watchHistory) {
        const preferences = {
            categories: {},
            difficulties: {},
            instructors: {},
            topics: {}
        };

        watchHistory.forEach(record => {
            const video = this.getVideoById(record.videoId);
            if (video) {
                // 分析类别偏好
                preferences.categories[video.category] = 
                    (preferences.categories[video.category] || 0) + record.watchTime / video.duration;

                // 分析难度偏好
                preferences.difficulties[video.difficulty] = 
                    (preferences.difficulties[video.difficulty] || 0) + 1;

                // 分析讲师偏好
                preferences.instructors[video.instructor] = 
                    (preferences.instructors[video.instructor] || 0) + 1;

                // 分析主题偏好
                if (video.tags) {
                    video.tags.forEach(tag => {
                        preferences.topics[tag] = (preferences.topics[tag] || 0) + 1;
                    });
                }
            }
        });

        return preferences;
    }

    // 获取视频信息
    getVideoById(videoId) {
        return this.videoDatabase.find(video => video.id === videoId);
    }

    // 基于内容的视频推荐
    getContentBasedVideoRecommendations(currentVideo) {
        return this.videoDatabase.filter(video => {
            if (video.id === currentVideo.id) return false;
            
            // 相同章节
            if (video.chapter === currentVideo.chapter) return true;
            
            // 相同难度
            if (video.difficulty === currentVideo.difficulty) return true;
            
            // 相同讲师
            if (video.instructor === currentVideo.instructor) return true;
            
            return false;
        }).slice(0, 5);
    }

    // 视频播放分析
    trackVideoAnalytics(videoId, event, data) {
        const analyticsData = {
            videoId,
            event,
            timestamp: Date.now(),
            userId: this.getCurrentUserId(),
            sessionId: this.getSessionId(),
            ...data
        };

        // 发送到分析服务器
        fetch('/api/analytics/video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(analyticsData)
        }).catch(console.error);

        // 本地存储（离线支持）
        this.storeAnalyticsLocally(analyticsData);
    }

    // 视频质量自适应
    adaptiveQuality(videoElement) {
        let currentQuality = 0;
        const qualityLevels = ['480p', '720p', '1080p'];
        
        const checkBandwidth = () => {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            if (connection) {
                const bandwidth = connection.downlink; // Mbps
                
                if (bandwidth > 5) {
                    currentQuality = 2; // 1080p
                } else if (bandwidth > 2) {
                    currentQuality = 1; // 720p
                } else {
                    currentQuality = 0; // 480p
                }
                
                this.switchVideoQuality(videoElement, qualityLevels[currentQuality]);
            }
        };

        // 监听网络变化
        if (navigator.connection) {
            navigator.connection.addEventListener('change', checkBandwidth);
        }

        // 初始检查
        checkBandwidth();

        // 监听缓冲事件
        videoElement.addEventListener('waiting', () => {
            if (currentQuality > 0) {
                currentQuality--;
                this.switchVideoQuality(videoElement, qualityLevels[currentQuality]);
            }
        });
    }

    // 切换视频质量
    switchVideoQuality(videoElement, quality) {
        const currentTime = videoElement.currentTime;
        const currentVideo = this.getVideoById(this.currentVideo?.id);
        
        if (currentVideo && currentVideo.quality_levels) {
            const qualityLevel = currentVideo.quality_levels.find(q => q.resolution === quality);
            if (qualityLevel) {
                videoElement.src = qualityLevel.url;
                videoElement.currentTime = currentTime;
                console.log(`视频质量切换到: ${quality}`);
            }
        }
    }

    // 获取用户观看历史
    getUserWatchHistory(userId) {
        const history = localStorage.getItem(`watch_history_${userId}`);
        return history ? JSON.parse(history) : [];
    }

    // 获取当前用户ID
    getCurrentUserId() {
        return localStorage.getItem('currentUserId') || 'anonymous';
    }

    // 获取会话ID
    getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    // 本地存储分析数据
    storeAnalyticsLocally(data) {
        const localAnalytics = JSON.parse(localStorage.getItem('videoAnalytics') || '[]');
        localAnalytics.push(data);
        
        // 限制本地存储大小
        if (localAnalytics.length > 1000) {
            localAnalytics.splice(0, 100); // 删除最旧的100条记录
        }
        
        localStorage.setItem('videoAnalytics', JSON.stringify(localAnalytics));
    }
}

// ==================== 智能机器人系统 ====================
class IntelligentRobotSystem {
    constructor() {
        this.config = {
            name: "小海",
            avatar: "/images/robot_avatar.png",
            personality: "友善、专业、耐心",
            language: "zh-CN"
        };
        
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.dialogHistory = [];
        this.userContext = {};
        
        this.initializeNLP();
        this.createChatInterface();
    }

    // 初始化知识库
    initializeKnowledgeBase() {
        return {
            concepts: {
                "流体": {
                    definition: "在静止状态下不能承受剪切应力的物质",
                    examples: ["水", "空气", "油", "血液"],
                    properties: ["密度", "粘度", "压缩性", "表面张力"],
                    related: ["固体", "气体", "液体", "等离子体"]
                },
                "伯努利方程": {
                    definition: "描述理想流体沿流线的能量守恒关系",
                    formula: "p/ρ + v²/2 + gz = constant",
                    conditions: ["理想流体", "定常流动", "不可压缩", "沿流线"],
                    applications: ["管道流动", "机翼升力", "文丘里管", "皮托管"]
                }
            },
            
            formulas: {
                "连续性方程": {
                    formula: "ρ₁A₁v₁ = ρ₂A₂v₂",
                    description: "质量守恒定律在流体力学中的表现",
                    variables: {
                        "ρ": "密度",
                        "A": "截面积",
                        "v": "流速"
                    }
                }
            },

            procedures: {
                "解伯努利方程": [
                    "确定研究对象和流线",
                    "选择合适的参考截面",
                    "列出已知条件",
                    "应用伯努利方程",
                    "求解未知量",
                    "检查结果合理性"
                ]
            }
        };
    }

    // 初始化自然语言处理
    initializeNLP() {
        this.nlp = {
            // 意图识别
            classifyIntent: (message) => {
                const intents = {
                    'question': ['什么是', '为什么', '怎么', '如何', '?', '？'],
                    'help': ['帮助', '帮我', '不会', '不懂', '困难'],
                    'homework': ['作业', '题目', '练习', '批改', '检查'],
                    'explanation': ['解释', '说明', '讲解', '详细'],
                    'calculation': ['计算', '求', '解', '答案'],
                    'praise': ['好', '棒', '谢谢', '感谢'],
                    'complaint': ['不好', '错误', '问题', 'bug']
                };

                for (let intent in intents) {
                    if (intents[intent].some(keyword => message.includes(keyword))) {
                        return intent;
                    }
                }
                return 'general';
            },

            // 实体提取
            extractEntities: (message) => {
                const entities = {
                    concepts: [],
                    numbers: [],
                    units: []
                };

                // 提取概念
                Object.keys(this.knowledgeBase.concepts).forEach(concept => {
                    if (message.includes(concept)) {
                        entities.concepts.push(concept);
                    }
                });

                // 提取数字
                const numberRegex = /\d+(\.\d+)?/g;
                const numbers = message.match(numberRegex);
                if (numbers) {
                    entities.numbers = numbers.map(n => parseFloat(n));
                }

                return entities;
            },

            // 情感分析
            analyzeSentiment: (message) => {
                const positiveWords = ['好', '棒', '喜欢', '满意', '开心', '谢谢'];
                const negativeWords = ['不好', '讨厌', '困难', '不懂', '错误', '失望'];

                let positiveScore = 0;
                let negativeScore = 0;

                positiveWords.forEach(word => {
                    if (message.includes(word)) positiveScore++;
                });

                negativeWords.forEach(word => {
                    if (message.includes(word)) negativeScore++;
                });

                if (positiveScore > negativeScore) return 'positive';
                if (negativeScore > positiveScore) return 'negative';
                return 'neutral';
            }
        };
    }

    // 处理用户输入
    processInput(message, userId) {
        const intent = this.nlp.classifyIntent(message);
        const entities = this.nlp.extractEntities(message);
        const sentiment = this.nlp.analyzeSentiment(message);

        // 更新用户上下文
        this.updateUserContext(userId, { intent, entities, sentiment });

        // 生成回复
        const response = this.generateResponse(message, intent, entities, sentiment, userId);

        // 记录对话历史
        this.dialogHistory.push({
            timestamp: Date.now(),
            userId,
            userMessage: message,
            botResponse: response,
            intent,
            entities,
            sentiment
        });

        return response;
    }

    // 更新用户上下文
    updateUserContext(userId, context) {
        if (!this.userContext[userId]) {
            this.userContext[userId] = {};
        }
        Object.assign(this.userContext[userId], context);
        this.userContext[userId].lastInteraction = Date.now();
    }

    // 生成回复
    generateResponse(message, intent, entities, sentiment, userId) {
        switch (intent) {
            case 'question':
                return this.handleQuestion(entities, message);
            case 'help':
                return this.handleHelp(entities, sentiment);
            case 'homework':
                return this.handleHomework(message, userId);
            case 'explanation':
                return this.handleExplanation(entities);
            case 'calculation':
                return this.handleCalculation(message, entities);
            case 'praise':
                return this.handlePraise();
            case 'complaint':
                return this.handleComplaint(sentiment);
            default:
                return this.handleGeneral(message);
        }
    }

    // 处理问题
    handleQuestion(entities, message) {
        if (entities.concepts.length > 0) {
            const concept = entities.concepts[0];
            const knowledge = this.knowledgeBase.concepts[concept];
            if (knowledge) {
                return `关于${concept}，${knowledge.definition}。它的主要特性包括：${knowledge.properties.join('、')}。相关概念还有：${knowledge.related.join('、')}。你还想了解什么吗？`;
            }
        }
        return this.searchKnowledgeBase(message);
    }

    // 处理帮助请求
    handleHelp(entities, sentiment) {
        if (sentiment === 'negative') {
            return "我理解你的困难，别担心！让我来帮助你。请告诉我具体是哪个概念或问题让你感到困惑，我会详细为你解释。";
        }
        return "我很乐意帮助你！你可以问我关于流体力学的任何问题，比如基本概念、公式推导、题目解答等。有什么具体需要帮助的吗？";
    }

    // 处理作业批改
    handleHomework(message, userId) {
        return "我可以帮你批改作业！请把你的答案发给我，我会检查你的解题过程，指出错误，并给出正确答案和详细解释。";
    }

    // 处理解释请求
    handleExplanation(entities) {
        if (entities.concepts.length > 0) {
            const concept = entities.concepts[0];
            const knowledge = this.knowledgeBase.concepts[concept];
            if (knowledge) {
                return `让我详细解释一下${concept}：\n\n定义：${knowledge.definition}\n\n例子：${knowledge.examples.join('、')}\n\n主要性质：${knowledge.properties.join('、')}\n\n你还想了解这个概念的哪个方面？`;
            }
        }
        return "请告诉我你想了解哪个具体概念，我会为你详细解释。";
    }

    // 处理计算请求
    handleCalculation(message, entities) {
        if (entities.numbers.length > 0) {
            return `我看到你提到了数值：${entities.numbers.join('、')}。请告诉我具体的计算问题，包括已知条件和要求解的量，我会帮你一步步解答。`;
        }
        return "请提供具体的计算题目，包括已知条件和要解的问题，我会详细解答计算过程。";
    }

    // 处理表扬
    handlePraise() {
        const responses = [
            "谢谢夸奖！我会继续努力帮助你学好流体力学。",
            "很高兴能帮到你！学习过程中有任何问题都可以问我。",
            "你的进步也让我很开心！继续保持学习的热情。"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // 处理投诉
    handleComplaint(sentiment) {
        return "很抱歉给你带来了困扰。请告诉我具体遇到了什么问题，我会尽力改进并为你提供更好的帮助。";
    }

    // 处理一般对话
    handleGeneral(message) {
        return "我是你的流体力学学习助手，可以为你提供学习指导。请告诉我你想了解什么？我会一直陪伴你学习的！";
    }

    // 搜索知识库
    searchKnowledgeBase(query) {
        const results = [];
        
        Object.entries(this.knowledgeBase.concepts).forEach(([key, value]) => {
            if (key.includes(query) || value.definition.includes(query)) {
                results.push({ type: 'concept', key, value });
            }
        });

        if (results.length > 0) {
            const result = results[0];
            return `我找到了相关信息：${result.key} - ${result.value.definition}`;
        }

        return "抱歉，我没有找到相关信息。你可以尝试用不同的关键词，或者问我其他问题。";
    }

    // 创建聊天界面
    createChatInterface() {
        const chatContainer = document.createElement('div');
        chatContainer.id = 'robot-chat-container';
        chatContainer.className = 'robot-chat-container';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <img src="${this.config.avatar}" alt="机器人头像" class="robot-avatar">
                <h3>${this.config.name}</h3>
                <div class="chat-controls">
                    <button id="chat-minimize" class="minimize-btn">−</button>
                    <button id="chat-close" class="close-btn">×</button>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            <div class="chat-input-container">
                <input type="text" id="chat-input" placeholder="输入你的问题..." />
                <button id="send-btn">发送</button>
            </div>
            <div class="quick-actions">
                <button class="quick-btn" data-action="help">帮助</button>
                <button class="quick-btn" data-action="homework">作业批改</button>
                <button class="quick-btn" data-action="plan">学习计划</button>
                <button class="quick-btn" data-action="progress">学习进度</button>
            </div>
        `;

        document.body.appendChild(chatContainer);
        this.bindChatEvents();
    }

    // 绑定聊天事件
    bindChatEvents() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const quickBtns = document.querySelectorAll('.quick-btn');

        // 发送消息
        const sendMessage = () => {
            const message = input.value.trim();
            if (message) {
                this.handleUserMessage(message);
                input.value = '';
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // 快捷操作
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    // 处理用户消息
    handleUserMessage(message) {
        this.displayUserMessage(message);
        const response = this.processInput(message, this.getCurrentUserId());
        
        // 模拟思考时间
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            this.displayBotMessage(response);
        }, 1000 + Math.random() * 2000);
    }

    // 显示用户消息
    displayUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 显示机器人消息
    displayBotMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        messageElement.innerHTML = `
            <img src="${this.config.avatar}" alt="机器人" class="message-avatar">
            <div class="message-content">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 显示输入指示器
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'message bot-message typing';
        indicator.innerHTML = `
            <img src="${this.config.avatar}" alt="机器人" class="message-avatar">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 隐藏输入指示器
    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // 获取当前用户ID
    getCurrentUserId() {
        return localStorage.getItem('currentUserId') || 'user_' + Date.now();
    }

    // 处理快捷操作
    handleQuickAction(action) {
        const actions = {
            'help': '我需要帮助',
            'homework': '请帮我批改作业',
            'plan': '请为我制定学习计划',
            'progress': '查看我的学习进度'
        };
        
        if (actions[action]) {
            this.handleUserMessage(actions[action]);
        }
    }
}

// ==================== 数据分析系统 ====================
class DataAnalyticsSystem {
    constructor() {
        this.learningData = [];
        this.charts = {};
        this.reports = {};
    }

    // 收集学习数据
    collectLearningData(userId, activity, data) {
        const record = {
            userId,
            activity,
            data,
            timestamp: Date.now(),
            sessionId: this.getSessionId()
        };

        this.learningData.push(record);
        
        // 本地存储
        this.storeDataLocally(record);
        
        // 发送到服务器
        this.sendDataToServer(record);
    }

    // 生成学习报告
    generateLearningReport(userId, timeRange) {
        const data = this.getLearningData(userId, timeRange);
        
        return {
            summary: this.generateSummary(data),
            progress: this.analyzeProgress(data),
            performance: this.analyzePerformance(data),
            recommendations: this.generateRecommendations(data),
            charts: this.generateCharts(data)
        };
    }

    // 生成图表数据
    generateCharts(data) {
        return {
            studyTime: this.generateStudyTimeChart(data),
            performance: this.generatePerformanceChart(data),
            progress: this.generateProgressChart(data),
            knowledge: this.generateKnowledgeChart(data)
        };
    }

    // 学习时间图表
    generateStudyTimeChart(data) {
        const dailyStudyTime = {};
        
        data.forEach(record => {
            const date = new Date(record.timestamp).toDateString();
            if (record.activity === 'study') {
                dailyStudyTime[date] = (dailyStudyTime[date] || 0) + (record.data.duration || 0);
            }
        });

        return {
            type: 'line',
            data: {
                labels: Object.keys(dailyStudyTime),
                datasets: [{
                    label: '每日学习时间（分钟）',
                    data: Object.values(dailyStudyTime),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
    }

    // 性能分析图表
    generatePerformanceChart(data) {
        const quizData = data.filter(record => record.activity === 'quiz');
        const performanceByCategory = {};

        quizData.forEach(record => {
            const category = record.data.category;
            if (!performanceByCategory[category]) {
                performanceByCategory[category] = { total: 0, correct: 0 };
            }
            performanceByCategory[category].total++;
            if (record.data.correct) {
                performanceByCategory[category].correct++;
            }
        });

        const categories = Object.keys(performanceByCategory);
        const accuracyRates = categories.map(cat => 
            (performanceByCategory[cat].correct / performanceByCategory[cat].total) * 100
        );

        return {
            type: 'radar',
            data: {
                labels: categories,
                datasets: [{
                    label: '正确率 (%)',
                    data: accuracyRates,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff'
                }]
            },
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        };
    }

    // 获取学习数据
    getLearningData(userId, timeRange) {
        const now = Date.now();
        const timeLimit = now - (timeRange * 24 * 60 * 60 * 1000); // timeRange in days
        
        return this.learningData.filter(record => 
            record.userId === userId && record.timestamp >= timeLimit
        );
    }

    // 生成摘要
    generateSummary(data) {
        const totalSessions = data.length;
        const totalTime = data.reduce((sum, record) => sum + (record.data.duration || 0), 0);
        const avgSessionTime = totalSessions > 0 ? totalTime / totalSessions : 0;

        return {
            totalSessions,
            totalTime: Math.round(totalTime),
            avgSessionTime: Math.round(avgSessionTime),
            activeDays: new Set(data.map(record => 
                new Date(record.timestamp).toDateString()
            )).size
        };
    }

    // 分析进度
    analyzeProgress(data) {
        const progressData = data.filter(record => record.activity === 'progress');
        const latestProgress = progressData.reduce((latest, current) => {
            return current.timestamp > latest.timestamp ? current : latest;
        }, progressData[0] || { data: {} });

        return latestProgress.data || {};
    }

    // 分析性能
    analyzePerformance(data) {
        const quizData = data.filter(record => record.activity === 'quiz');
        const totalQuestions = quizData.length;
        const correctAnswers = quizData.filter(record => record.data.correct).length;
        const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        return {
            totalQuestions,
            correctAnswers,
            accuracy: accuracy.toFixed(1),
            averageTime: quizData.reduce((sum, record) => sum + (record.data.timeSpent || 0), 0) / totalQuestions
        };
    }

    // 生成建议
    generateRecommendations(data) {
        const recommendations = [];
        const performance = this.analyzePerformance(data);
        
        if (performance.accuracy < 60) {
            recommendations.push({
                type: 'warning',
                message: '答题正确率较低，建议加强基础概念学习'
            });
        }

        if (data.length < 10) {
            recommendations.push({
                type: 'info',
                message: '学习记录较少，建议增加学习频率'
            });
        }

        return recommendations;
    }

    // 本地存储数据
    storeDataLocally(record) {
        const localData = JSON.parse(localStorage.getItem('learningAnalytics') || '[]');
        localData.push(record);
        
        // 限制本地存储大小
        if (localData.length > 1000) {
            localData.splice(0, 100);
        }
        
        localStorage.setItem('learningAnalytics', JSON.stringify(localData));
    }

    // 发送数据到服务器
    sendDataToServer(record) {
        fetch('/api/analytics/learning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        }).catch(console.error);
    }

    // 获取会话ID
    getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }
}

// ==================== 全局初始化 ====================
// 创建全局实例
window.QuizSystem = new AdvancedQuizSystem();
window.VideoSystem = new AdvancedVideoSystem();
window.RobotSystem = new IntelligentRobotSystem();
window.AnalyticsSystem = new DataAnalyticsSystem();

// 初始化所有系统
document.addEventListener('DOMContentLoaded', function() {
    console.log('高级功能模块已加载');
    
    // 添加欢迎消息
    setTimeout(() => {
        if (window.RobotSystem) {
            window.RobotSystem.displayBotMessage("欢迎使用流体力学学习平台！我是你的AI学习助手小海，随时为你答疑解惑。有什么问题尽管问我吧！");
        }
    }, 2000);
});

// 导出模块
export { AdvancedQuizSystem, AdvancedVideoSystem, IntelligentRobotSystem, DataAnalyticsSystem };