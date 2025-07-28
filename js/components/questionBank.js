// ===== 题库系统 =====
window.LocalQuestionBank = {
    // 当前状态
    currentQuestion: 0,
    selectedAnswers: new Map(),
    startTime: null,
    isActive: false,
    
    // 题库数据
    questions: [
        {
            id: 1,
            category: 'basic',
            difficulty: 'easy',
            question: '流体力学中，连续性方程的基本假设是什么？',
            options: [
                '流体是可压缩的',
                '流体是不可压缩的',
                '流体密度保持恒定',
                '流体速度保持恒定'
            ],
            correctAnswer: 2,
            explanation: '连续性方程基于质量守恒定律，假设流体密度在整个流场中保持恒定。',
            points: 1,
            tags: ['连续性方程', '基础理论']
        },
        {
            id: 2,
            category: 'flow',
            difficulty: 'medium',
            question: '伯努利方程适用于哪种类型的流动？',
            options: [
                '所有流体流动',
                '理想流体的定常流动',
                '粘性流体的非定常流动',
                '可压缩流体流动'
            ],
            correctAnswer: 1,
            explanation: '伯努利方程适用于理想流体（无粘性、不可压缩）的定常流动条件下。',
            points: 2,
            tags: ['伯努利方程', '理想流体']
        },
        {
            id: 3,
            category: 'pressure',
            difficulty: 'medium',
            question: '在水平管道中，流体压力降低主要是由于什么原因？',
            options: [
                '重力作用',
                '摩擦阻力',
                '温度变化',
                '密度变化'
            ],
            correctAnswer: 1,
            explanation: '在水平管道中，流体压力降低主要是由于壁面摩擦阻力造成的能量损失。',
            points: 2,
            tags: ['压力损失', '摩擦阻力']
        },
        {
            id: 4,
            category: 'viscosity',
            difficulty: 'hard',
            question: '雷诺数Re = ρvD/μ中，各参数的物理意义是什么？',
            options: [
                'ρ-密度, v-速度, D-直径, μ-动力粘度',
                'ρ-压力, v-体积, D-深度, μ-质量',
                'ρ-阻力, v-粘度, D-距离, μ-密度',
                'ρ-雷诺应力, v-剪切率, D-变形, μ-应变'
            ],
            correctAnswer: 0,
            explanation: '雷诺数是惯性力与粘性力的比值，ρ为流体密度，v为特征速度，D为特征长度，μ为动力粘度。',
            points: 3,
            tags: ['雷诺数', '无量纲参数']
        },
        {
            id: 5,
            category: 'turbulence',
            difficulty: 'hard',
            question: '湍流的主要特征不包括以下哪一项？',
            options: [
                '流动的随机性和不规则性',
                '强烈的混合和传递过程',
                '流动参数的时间平均值保持稳定',
                '完全可预测的流动模式'
            ],
            correctAnswer: 3,
            explanation: '湍流具有随机性、不规则性和强混合特征，但其流动模式是不可完全预测的。',
            points: 3,
            tags: ['湍流', '流动特征']
        },
        {
            id: 6,
            category: 'applications',
            difficulty: 'medium',
            question: '在管道设计中，为什么要考虑水锤现象？',
            options: [
                '提高流体输送效率',
                '减少能量消耗',
                '防止管道破裂和设备损坏',
                '增加流体流速'
            ],
            correctAnswer: 2,
            explanation: '水锤现象会产生巨大的压力冲击，可能导致管道破裂和设备损坏，因此在设计时必须考虑。',
            points: 2,
            tags: ['水锤现象', '工程应用']
        },
        {
            id: 7,
            category: 'basic',
            difficulty: 'easy',
            question: '流体的主要物理性质包括哪些？',
            options: [
                '密度、粘度、压缩性',
                '颜色、气味、形状',
                '硬度、弹性、磁性',
                '导电性、导热性、透明度'
            ],
            correctAnswer: 0,
            explanation: '流体的主要物理性质包括密度、粘度和压缩性，这些性质决定了流体的流动特性。',
            points: 1,
            tags: ['流体性质', '基础知识']
        },
        {
            id: 8,
            category: 'flow',
            difficulty: 'easy',
            question: '层流和湍流的判断依据是什么？',
            options: [
                '流体温度',
                '管道材料',
                '雷诺数大小',
                '流体颜色'
            ],
            correctAnswer: 2,
            explanation: '层流和湍流的判断主要依据雷诺数：Re < 2300为层流，Re > 4000为湍流。',
            points: 1,
            tags: ['层流', '湍流', '雷诺数']
        },
        {
            id: 9,
            category: 'pressure',
            difficulty: 'hard',
            question: '静压、动压和总压之间的关系是什么？',
            options: [
                '总压 = 静压 - 动压',
                '总压 = 静压 + 动压',
                '静压 = 总压 + 动压',
                '动压 = 静压 - 总压'
            ],
            correctAnswer: 1,
            explanation: '根据伯努利方程，总压等于静压与动压之和：P总 = P静 + ½ρv²',
            points: 3,
            tags: ['压力类型', '伯努利方程']
        },
        {
            id: 10,
            category: 'applications',
            difficulty: 'hard',
            question: '离心泵的工作原理基于什么原理？',
            options: [
                '阿基米德原理',
                '离心力和压力差',
                '毛细现象',
                '虹吸原理'
            ],
            correctAnswer: 1,
            explanation: '离心泵通过叶轮旋转产生离心力，使流体获得动能，然后转换为压力能来输送流体。',
            points: 3,
            tags: ['离心泵', '工作原理']
        }
    ],
    
    // 智能出题系统
    intelligentQuestionGeneration: {
        // API配置
        apiKey: AppConfig.api.siliconFlow.apiKey,
        apiEndpoint: AppConfig.api.siliconFlow.endpoint,
        model: AppConfig.api.siliconFlow.model,
        
        // 知识图谱
        knowledgeGraph: {
            basic: {
                name: '基础概念',
                topics: ['流体性质', '连续性方程', '流体静力学', '流体运动学'],
                difficulty_progression: ['易', '中', '难']
            },
            flow: {
                name: '流动分析',
                topics: ['层流湍流', '伯努利方程', '动量方程', '能量方程'],
                difficulty_progression: ['易', '中', '难']
            },
            pressure: {
                name: '压力计算',
                topics: ['静压分布', '压力损失', '压力测量', '压力传递'],
                difficulty_progression: ['易', '中', '难']
            }
        },
        
        // 难度模型
        difficultyModels: {
            easy: {
                keywords: ['定义', '概念', '基本', '简单'],
                cognitive_level: '记忆和理解',
                complexity: 'low'
            },
            medium: {
                keywords: ['计算', '分析', '应用', '比较'],
                cognitive_level: '应用和分析',
                complexity: 'medium'
            },
            hard: {
                keywords: ['综合', '评价', '设计', '创新'],
                cognitive_level: '综合和评价',
                complexity: 'high'
            }
        },
        
        // 自适应算法
        adaptiveAlgorithms: {
            next_difficulty(userPerformance) {
                const accuracy = userPerformance.correct / userPerformance.total;
                if (accuracy > 0.8) return 'harder';
                if (accuracy < 0.5) return 'easier';
                return 'same';
            },
            
            topic_recommendation(userHistory) {
                const weakTopics = userHistory
                    .filter(item => item.accuracy < 0.6)
                    .map(item => item.topic);
                return weakTopics.length > 0 ? weakTopics[0] : 'random';
            }
        },
        
        // 题目模板
        questionTemplates: {
            concept: "请解释{concept}在流体力学中的定义和重要性。",
            calculation: "在{scenario}中，如何计算{parameter}？请给出详细步骤。",
            application: "{principle}在{application}中是如何应用的？",
            comparison: "比较{concept1}和{concept2}的异同点。"
        },
        
        // 调用硅基流动API
        async callSiliconFlowAPI(prompt) {
            try {
                const response = await fetch(this.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: [
                            {
                                role: "system",
                                content: "你是一个流体力学专家，擅长出题和教学。请根据要求生成高质量的选择题。"
                            },
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        max_tokens: AppConfig.api.siliconFlow.maxTokens,
                        temperature: AppConfig.api.siliconFlow.temperature
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                    throw new Error('API响应格式无效');
                }
                
                return data.choices[0].message.content;
                
            } catch (error) {
                console.error('❌ SiliconFlow API调用失败:', error);
                throw error;
            }
        },
        
        // 构建AI提示词
        buildAIPrompt(category, difficulty, questionType) {
            const categoryInfo = this.knowledgeGraph[category];
            const difficultyInfo = this.difficultyModels[difficulty];
            
            return `请生成一道关于"${categoryInfo.name}"的${difficulty}级别流体力学选择题。

要求：
1. 题目应该测试${difficultyInfo.cognitive_level}能力
2. 包含4个选项（A、B、C、D）
3. 只有一个正确答案
4. 提供详细的解释说明
5. 复杂度：${difficultyInfo.complexity}

请按照以下JSON格式回答：
{
    "question": "题目内容",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "correctAnswer": 0,
    "explanation": "详细解释",
    "tags": ["标签1", "标签2"]
}

主题范围：${categoryInfo.topics.join('、')}
关键词提示：${difficultyInfo.keywords.join('、')}`;
        },
        
        // 解析AI响应
        parseAIResponse(response) {
            try {
                // 尝试提取JSON部分
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error('未找到有效的JSON格式');
                }
                
                const questionData = JSON.parse(jsonMatch[0]);
                
                // 验证必需字段
                const requiredFields = ['question', 'options', 'correctAnswer', 'explanation'];
                for (const field of requiredFields) {
                    if (!questionData[field]) {
                        throw new Error(`缺少必需字段: ${field}`);
                    }
                }
                
                // 验证选项数量
                if (!Array.isArray(questionData.options) || questionData.options.length !== 4) {
                    throw new Error('选项必须是包含4个元素的数组');
                }
                
                // 验证正确答案索引
                if (questionData.correctAnswer < 0 || questionData.correctAnswer > 3) {
                    throw new Error('正确答案索引必须在0-3之间');
                }
                
                return questionData;
                
            } catch (error) {
                console.error('❌ AI响应解析失败:', error);
                throw new Error(`AI响应解析失败: ${error.message}`);
            }
        },
        
        // 生成本地题目（备用）
        generateLocalQuestion(category, difficulty) {
            const templates = [
                {
                    question: `在${category}领域中，以下哪个概念最重要？`,
                    options: ['概念A', '概念B', '概念C', '概念D'],
                    correctAnswer: 0,
                    explanation: `这是一道${difficulty}级别的${category}题目。`,
                    tags: [category, difficulty]
                }
            ];
            
            return templates[0];
        },
        
        // 智能生成题目
        async generateIntelligentQuestion(category, difficulty, questionType = 'concept') {
            try {
                // 更新状态显示
                LocalQuestionBank.updateAIStatus('正在生成题目...');
                
                // 构建提示词
                const prompt = this.buildAIPrompt(category, difficulty, questionType);
                
                // 调用AI API
                const aiResponse = await this.callSiliconFlowAPI(prompt);
                
                // 解析响应
                const questionData = this.parseAIResponse(aiResponse);
                
                // 添加元数据
                const newQuestion = {
                    id: Date.now(),
                    category,
                    difficulty,
                    question: questionData.question,
                    options: questionData.options,
                    correctAnswer: questionData.correctAnswer,
                    explanation: questionData.explanation,
                    points: LocalQuestionBank.getDifficultyPoints(difficulty),
                    tags: questionData.tags || [category, difficulty],
                    generated: true,
                    timestamp: new Date().toISOString()
                };
                
                console.log('✅ AI题目生成成功:', newQuestion);
                return newQuestion;
                
            } catch (error) {
                console.error('❌ 智能出题失败，使用备用方案:', error);
                LocalQuestionBank.updateAIStatus(`出题失败: ${error.message}`);
                
                // 返回本地生成的题目作为备用
                return this.generateLocalQuestion(category, difficulty);
            }
        },
        
        // 批量生成题目
        async generateQuestionBatch(count = 5) {
            const questions = [];
            const categories = Object.keys(this.knowledgeGraph);
            const difficulties = ['easy', 'medium', 'hard'];
            
            LocalQuestionBank.updateAIStatus(`正在批量生成${count}道题目...`);
            
            for (let i = 0; i < count; i++) {
                try {
                    const category = categories[Math.floor(Math.random() * categories.length)];
                    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
                    
                    const question = await this.generateIntelligentQuestion(category, difficulty);
                    questions.push(question);
                    
                    LocalQuestionBank.updateAIStatus(`已生成 ${i + 1}/${count} 道题目`);
                    
                    // 避免API速率限制
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    console.error(`❌ 生成第${i + 1}道题目失败:`, error);
                }
            }
            
            LocalQuestionBank.updateAIStatus(`批量生成完成，共生成${questions.length}道题目`);
            return questions;
        }
    },
    
    // 初始化题库系统
    init() {
        console.log('📚 题库系统初始化...');
        this.setupEventListeners();
        this.loadUserProgress();
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 注册到应用模块系统
        if (window.App && window.App.state) {
            window.App.state.modules.set('questionBank', { 
                name: 'Question Bank System', 
                instance: this 
            });
        }
        
        // 监听用户登录事件
        EventBus.on(SystemEvents.USER_LOGIN, () => {
            this.loadUserProgress();
        });
    },
    
    // 加载用户进度
    loadUserProgress() {
        const progress = Utils.storage.get('questionBankProgress', {
            answeredQuestions: [],
            totalScore: 0,
            categoryProgress: {},
            lastSession: null
        });
        
        this.userProgress = progress;
        console.log('📈 题库进度已加载:', progress);
    },
    
    // 保存用户进度
    saveUserProgress() {
        Utils.storage.set('questionBankProgress', this.userProgress);
    },
    
    // 显示题库模态框
    showModal() {
        if (!AuthSystem.isAuthenticated()) {
            AuthSystem.showMessage('请先登录后使用题库功能', 'warning');
            return;
        }
        
        this.createModal();
        const modal = Utils.dom.get('#question-bank-modal');
        if (modal) {
            modal.classList.add('show');
            EventBus.emit(SystemEvents.MODAL_OPEN, { modal: 'question-bank' });
        }
    },
    
    // 创建题库模态框
    createModal() {
        // 检查是否已存在
        let modal = Utils.dom.get('#question-bank-modal');
        if (modal) {
            modal.remove();
        }
        
        modal = Utils.dom.create('div', {
            id: 'question-bank-modal',
            className: 'modal question-bank-modal'
        });
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="question-bank-header">
                    <h2 class="question-bank-title">
                        <i class="fas fa-question-circle"></i>
                        流体力学题库
                    </h2>
                    <div class="question-bank-stats">
                        <span>总题数: ${this.questions.length}</span>
                        <span>已答题: ${this.userProgress?.answeredQuestions?.length || 0}</span>
                        <span>总分: ${this.userProgress?.totalScore || 0}</span>
                    </div>
                </div>
                
                <div class="question-bank-controls">
                    <div class="control-group">
                        <label>分类</label>
                        <select class="select-control" id="category-filter">
                            <option value="all">全部分类</option>
                            <option value="basic">基础概念</option>
                            <option value="flow">流动分析</option>
                            <option value="pressure">压力计算</option>
                            <option value="viscosity">粘性流动</option>
                            <option value="turbulence">湍流理论</option>
                            <option value="applications">工程应用</option>
                        </select>
                    </div>
                    
                    <div class="control-group">
                        <label>难度</label>
                        <select class="select-control" id="difficulty-filter">
                            <option value="all">全部难度</option>
                            <option value="easy">简单</option>
                            <option value="medium">中等</option>
                            <option value="hard">困难</option>
                        </select>
                    </div>
                    
                    <div class="control-group">
                        <label>模式</label>
                        <button class="filter-btn" onclick="LocalQuestionBank.startPractice()">练习模式</button>
                        <button class="filter-btn" onclick="LocalQuestionBank.startExam()">考试模式</button>
                    </div>
                </div>
                
                <div class="ai-generate-section">
                    <button class="ai-generate-btn" id="ai-generate-btn" onclick="LocalQuestionBank.generateAIQuestion()">
                        <i class="fas fa-magic"></i>
                        AI智能出题
                    </button>
                    <span class="ai-status" id="ai-status">点击开始AI出题</span>
                </div>
                
                <div class="question-container" id="question-container">
                    <div class="question-list" id="question-list">
                        ${this.renderQuestionList()}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupModalEventListeners(modal);
    },
    
    // 渲染题目列表
    renderQuestionList() {
        return this.questions.map(question => `
            <div class="question-card" data-id="${question.id}">
                <div class="question-header">
                    <span class="question-number">#${question.id}</span>
                    <span class="question-difficulty difficulty-${question.difficulty}">
                        ${this.getDifficultyLabel(question.difficulty)}
                    </span>
                </div>
                <div class="question-text">${question.question}</div>
                <div class="question-options">
                    ${question.options.map((option, index) => `
                        <div class="option-item" data-index="${index}">
                            <span class="option-label">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="question-actions">
                    <span class="question-progress">分值: ${question.points}分</span>
                    <div class="question-nav">
                        <button class="nav-btn" onclick="LocalQuestionBank.answerQuestion(${question.id})">
                            回答问题
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // 设置模态框事件监听器
    setupModalEventListeners(modal) {
        // 关闭按钮
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            EventBus.emit(SystemEvents.MODAL_CLOSE, { modal: 'question-bank' });
        });
        
        // 筛选器事件
        const categoryFilter = modal.querySelector('#category-filter');
        const difficultyFilter = modal.querySelector('#difficulty-filter');
        
        categoryFilter.addEventListener('change', () => this.filterQuestions());
        difficultyFilter.addEventListener('change', () => this.filterQuestions());
    },
    
    // 筛选题目
    filterQuestions() {
        const category = Utils.dom.get('#category-filter')?.value || 'all';
        const difficulty = Utils.dom.get('#difficulty-filter')?.value || 'all';
        
        const filteredQuestions = this.questions.filter(question => {
            const categoryMatch = category === 'all' || question.category === category;
            const difficultyMatch = difficulty === 'all' || question.difficulty === difficulty;
            return categoryMatch && difficultyMatch;
        });
        
        const questionList = Utils.dom.get('#question-list');
        if (questionList) {
            questionList.innerHTML = this.renderFilteredQuestions(filteredQuestions);
        }
    },
    
    // 渲染筛选后的题目
    renderFilteredQuestions(questions) {
        if (questions.length === 0) {
            return '<div class="no-questions">没有找到符合条件的题目</div>';
        }
        
        return questions.map(question => `
            <div class="question-card" data-id="${question.id}">
                <div class="question-header">
                    <span class="question-number">#${question.id}</span>
                    <span class="question-difficulty difficulty-${question.difficulty}">
                        ${this.getDifficultyLabel(question.difficulty)}
                    </span>
                </div>
                <div class="question-text">${question.question}</div>
                <div class="question-meta">
                    <span>分类: ${this.getCategoryLabel(question.category)}</span>
                    <span>分值: ${question.points}分</span>
                    <span>标签: ${question.tags?.join(', ') || '无'}</span>
                </div>
                <button class="nav-btn" onclick="LocalQuestionBank.answerQuestion(${question.id})">
                    开始答题
                </button>
            </div>
        `).join('');
    },
    
    // 获取难度标签
    getDifficultyLabel(difficulty) {
        const labels = {
            easy: '简单',
            medium: '中等',
            hard: '困难'
        };
        return labels[difficulty] || difficulty;
    },
    
    // 获取分类标签
    getCategoryLabel(category) {
        const labels = AppConfig.questionBank.categories;
        return labels[category] || category;
    },
    
    // 获取难度分值
    getDifficultyPoints(difficulty) {
        const points = {
            easy: 1,
            medium: 2,
            hard: 3
        };
        return points[difficulty] || 1;
    },
    
    // 生成AI题目
    async generateAIQuestion() {
        const btn = Utils.dom.get('#ai-generate-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...';
        }
        
        try {
            const category = Utils.dom.get('#category-filter')?.value || 'basic';
            const difficulty = Utils.dom.get('#difficulty-filter')?.value || 'medium';
            
            // 如果选择了"全部"，随机选择一个
            const finalCategory = category === 'all' ? 
                Object.keys(AppConfig.questionBank.categories)[0] : category;
            const finalDifficulty = difficulty === 'all' ? 'medium' : difficulty;
            
            const newQuestion = await this.intelligentQuestionGeneration.generateIntelligentQuestion(
                finalCategory, 
                finalDifficulty
            );
            
            // 添加到题库
            this.questions.push(newQuestion);
            
            // 刷新显示
            this.filterQuestions();
            
            this.updateAIStatus('AI题目生成成功！');
            
        } catch (error) {
            this.updateAIStatus(`生成失败: ${error.message}`);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-magic"></i> AI智能出题';
            }
        }
    },
    
    // 更新AI状态
    updateAIStatus(message) {
        const status = Utils.dom.get('#ai-status');
        if (status) {
            status.textContent = message;
        }
        console.log('🤖 AI出题状态:', message);
    },
    
    // 开始练习模式
    startPractice() {
        console.log('📝 开始练习模式');
        this.startQuiz('practice');
    },
    
    // 开始考试模式
    startExam() {
        console.log('📋 开始考试模式');
        this.startQuiz('exam');
    },
    
    // 开始答题
    startQuiz(mode = 'practice') {
        this.isActive = true;
        this.startTime = Date.now();
        this.currentQuestion = 0;
        this.selectedAnswers.clear();
        this.quizMode = mode;
        
        // 获取筛选后的题目
        const category = Utils.dom.get('#category-filter')?.value || 'all';
        const difficulty = Utils.dom.get('#difficulty-filter')?.value || 'all';
        
        this.currentQuestions = this.questions.filter(question => {
            const categoryMatch = category === 'all' || question.category === category;
            const difficultyMatch = difficulty === 'all' || question.difficulty === difficulty;
            return categoryMatch && difficultyMatch;
        });
        
        if (this.currentQuestions.length === 0) {
            this.updateAIStatus('没有可用的题目');
            return;
        }
        
        // 显示第一题
        this.showCurrentQuestion();
    },
    
    // 显示当前题目
    showCurrentQuestion() {
        const container = Utils.dom.get('#question-container');
        if (!container || !this.currentQuestions) return;
        
        const question = this.currentQuestions[this.currentQuestion];
        if (!question) return;
        
        container.innerHTML = `
            <div class="quiz-header">
                <h3>题目 ${this.currentQuestion + 1} / ${this.currentQuestions.length}</h3>
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(this.currentQuestion / this.currentQuestions.length) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="question-card active-question">
                <div class="question-header">
                    <span class="question-difficulty difficulty-${question.difficulty}">
                        ${this.getDifficultyLabel(question.difficulty)}
                    </span>
                    <span class="question-points">${question.points} 分</span>
                </div>
                
                <div class="question-text">${question.question}</div>
                
                <div class="question-options">
                    ${question.options.map((option, index) => `
                        <div class="option-item" data-index="${index}" onclick="LocalQuestionBank.selectOption(${index})">
                            <span class="option-label">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="question-actions">
                    <button class="nav-btn" onclick="LocalQuestionBank.previousQuestion()" ${this.currentQuestion === 0 ? 'disabled' : ''}>
                        上一题
                    </button>
                    <button class="nav-btn" onclick="LocalQuestionBank.submitAnswer()" id="submit-btn" disabled>
                        ${this.currentQuestion === this.currentQuestions.length - 1 ? '提交答案' : '下一题'}
                    </button>
                </div>
            </div>
        `;
    },
    
    // 选择选项
    selectOption(index) {
        // 移除之前的选择
        const options = Utils.dom.getAll('.option-item');
        options.forEach(option => option.classList.remove('selected'));
        
        // 添加新选择
        const selectedOption = Utils.dom.get(`[data-index="${index}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        // 保存选择
        const questionId = this.currentQuestions[this.currentQuestion].id;
        this.selectedAnswers.set(questionId, index);
        
        // 启用提交按钮
        const submitBtn = Utils.dom.get('#submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    },
    
    // 提交答案
    submitAnswer() {
        const question = this.currentQuestions[this.currentQuestion];
        const selectedAnswer = this.selectedAnswers.get(question.id);
        
        if (selectedAnswer === undefined) {
            this.updateAIStatus('请选择一个答案');
            return;
        }
        
        // 显示正确答案和解释
        this.showAnswerExplanation(question, selectedAnswer);
    },
    
    // 显示答案解释
    showAnswerExplanation(question, selectedAnswer) {
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        // 更新选项显示
        const options = Utils.dom.getAll('.option-item');
        options.forEach((option, index) => {
            if (index === question.correctAnswer) {
                option.classList.add('correct');
            } else if (index === selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // 显示解释
        const container = Utils.dom.get('#question-container');
        const explanationDiv = Utils.dom.create('div', {
            className: `answer-explanation ${isCorrect ? 'correct' : 'incorrect'}`,
            innerHTML: `
                <div class="explanation-header">
                    <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
                    <span>${isCorrect ? '回答正确！' : '回答错误'}</span>
                    <span class="points">+${isCorrect ? question.points : 0} 分</span>
                </div>
                <div class="explanation-content">
                    <strong>解释：</strong>${question.explanation}
                </div>
                <div class="explanation-actions">
                    <button class="nav-btn" onclick="LocalQuestionBank.nextQuestion()">
                        ${this.currentQuestion === this.currentQuestions.length - 1 ? '查看结果' : '继续下一题'}
                    </button>
                </div>
            `
        });
        
        container.appendChild(explanationDiv);
        
        // 记录答题结果
        this.recordAnswer(question.id, selectedAnswer, isCorrect, question.points);
        
        // 禁用选项点击
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
    },
    
    // 记录答题结果
    recordAnswer(questionId, selectedAnswer, isCorrect, points) {
        if (!this.userProgress.answeredQuestions) {
            this.userProgress.answeredQuestions = [];
        }
        
        this.userProgress.answeredQuestions.push({
            questionId,
            selectedAnswer,
            isCorrect,
            points: isCorrect ? points : 0,
            timestamp: Date.now()
        });
        
        if (isCorrect) {
            this.userProgress.totalScore = (this.userProgress.totalScore || 0) + points;
        }
        
        this.saveUserProgress();
        
        // 发布答题事件
        EventBus.emit(SystemEvents.QUESTION_ANSWERED, {
            questionId,
            isCorrect,
            points: isCorrect ? points : 0
        });
    },
    
    // 下一题
    nextQuestion() {
        if (this.currentQuestion < this.currentQuestions.length - 1) {
            this.currentQuestion++;
            this.showCurrentQuestion();
        } else {
            this.showQuizResults();
        }
    },
    
    // 上一题
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showCurrentQuestion();
        }
    },
    
    // 显示答题结果
    showQuizResults() {
        const totalQuestions = this.currentQuestions.length;
        const correctAnswers = Array.from(this.selectedAnswers.entries())
            .filter(([questionId, answer]) => {
                const question = this.currentQuestions.find(q => q.id === questionId);
                return question && answer === question.correctAnswer;
            }).length;
        
        const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const totalPoints = this.currentQuestions
            .filter(q => this.selectedAnswers.has(q.id))
            .filter(q => this.selectedAnswers.get(q.id) === q.correctAnswer)
            .reduce((sum, q) => sum + q.points, 0);
        
        const container = Utils.dom.get('#question-container');
        container.innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <i class="fas fa-trophy"></i>
                    <h3>答题完成！</h3>
                </div>
                
                <div class="results-stats">
                    <div class="stat-item">
                        <span class="stat-value">${correctAnswers}</span>
                        <span class="stat-label">正确题数</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${totalQuestions}</span>
                        <span class="stat-label">总题数</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${accuracy.toFixed(1)}%</span>
                        <span class="stat-label">正确率</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${totalPoints}</span>
                        <span class="stat-label">得分</span>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="nav-btn" onclick="LocalQuestionBank.startPractice()">
                        再次练习
                    </button>
                    <button class="nav-btn" onclick="LocalQuestionBank.filterQuestions()">
                        返回题库
                    </button>
                </div>
            </div>
        `;
        
        // 重置状态
        this.isActive = false;
        this.currentQuestions = null;
        this.selectedAnswers.clear();
        
        // 发布完成事件
        EventBus.emit(SystemEvents.PROGRESS_UPDATED, {
            type: 'quiz_completed',
            accuracy,
            totalPoints,
            questionsAnswered: totalQuestions
        });
    },
    
    // 回答特定题目
    answerQuestion(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return;
        
        this.currentQuestions = [question];
        this.currentQuestion = 0;
        this.selectedAnswers.clear();
        this.isActive = true;
        
        this.showCurrentQuestion();
    }
};

// 注册模块
document.addEventListener('DOMContentLoaded', () => {
    LocalQuestionBank.init();
});

console.log('📚 题库系统已加载'); 