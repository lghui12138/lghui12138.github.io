/**
 * 🚀 题库核心引擎模块
 * 负责题目加载、答题逻辑、统计分析等核心功能
 * 从practice-fullscreen-fixed-final.html优化提取
 */
window.QuestionBankEngine = (function() {
    'use strict';
    
    // ============ 私有变量 ============
    let questions = [];
    let currentQuestionIndex = 0;
    let userAnswers = new Map();
    let statistics = {
        totalQuestions: 0,
        answeredQuestions: 0,
        correctAnswers: 0,
        averageTime: 0,
        startTime: null,
        questionTimes: []
    };
    let questionStartTime = null;
    let isLoading = false;
    
    // GitHub配置
    const GITHUB_CONFIG = {
        owner: 'lghui12138',
        repo: 'lghui12138.github.io',
        branch: 'main',
        rawBaseUrl: 'https://raw.githubusercontent.com/lghui12138/lghui12138.github.io/main'
    };
    
    // ============ 题库数据加载 ============
    async function loadQuestionBank(bankName = 'all') {
        if (isLoading) {
            console.log('⏳ 题库正在加载中...');
            return false;
        }
        
        isLoading = true;
        console.log(`🔄 开始加载题库: ${bankName}`);
        
        try {
            let loadedQuestions = [];
            
            if (bankName === 'all' || bankName === 'github') {
                // 使用成功的批量加载策略
                loadedQuestions = await loadAllQuestionsFromGitHub();
            } else {
                // 单文件加载策略
                loadedQuestions = await tryMultipleLoadStrategies(bankName);
            }
            
            if (loadedQuestions && loadedQuestions.length > 0) {
                questions = shuffleArray([...loadedQuestions]);
                statistics.totalQuestions = questions.length;
                resetStatistics();
                console.log(`✅ 题库加载成功! 共 ${questions.length} 道题目`);
                return true;
            } else {
                throw new Error('无法加载题目数据');
            }
        } catch (error) {
            console.error('❌ 题库加载失败:', error);
            await loadDefaultQuestions();
            return false;
        } finally {
            isLoading = false;
        }
    }
    
    // 🎯 批量加载所有题库 (基于可工作的逻辑)
    async function loadAllQuestionsFromGitHub() {
        console.log('🌐 开始从GitHub批量加载所有题库...');
        
        const files = [
            '易错题集.json',
            '真题_中国海洋大学_2000-2021_cleaned.json',
            '真题_中国海洋大学_2000-2021.json',
            '分类_动量方程.json',
            '分类_势流.json',
            '分类_压力.json',
            '分类_实验与量纲.json',
            '分类_流体力学基础.json',
            '分类_流体性质.json',
            '分类_流线轨迹.json',
            '分类_涡度.json',
            '分类_湍流.json',
            '分类_管道流动.json',
            '分类_粘性.json',
            '分类_能量方程.json',
            '分类_自由面.json',
            '分类_边界层.json',
            '分类_雷诺数.json'
        ];
        
        let loadedQuestions = [];
        let totalLoaded = 0;
        
        for (const file of files) {
            try {
                console.log(`📖 加载: ${file}`);
                const url = `${GITHUB_CONFIG.rawBaseUrl}/question-banks/${file}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const questions = Array.isArray(data) ? data : (data.questions ? data.questions : []);
                    
                    if (questions && questions.length > 0) {
                        const convertedQuestions = questions.map((q, index) => ({
                            id: totalLoaded + index + 1,
                            question: q.title || q.question || `题目${totalLoaded + index + 1}`,
                            options: q.options || ['A', 'B', 'C', 'D'],
                            correctAnswer: typeof q.answer === 'number' ? q.answer : (q.correctAnswer || 0),
                            explanation: q.explanation || '暂无解析',
                            category: q.category || '流体力学',
                            difficulty: q.difficulty || 'medium',
                            year: q.year || null,
                            school: q.school || '中国海洋大学',
                            bank: file.replace('.json', ''),
                            bankId: file
                        }));
                        
                        loadedQuestions = loadedQuestions.concat(convertedQuestions);
                        totalLoaded += convertedQuestions.length;
                        console.log(`✅ ${file}: +${convertedQuestions.length}题`);
                    }
                } else {
                    console.warn(`⚠️ GitHub文件不存在: ${file}`);
                }
            } catch (error) {
                console.warn(`⚠️ 加载失败: ${file}`, error.message);
            }
        }
        
        console.log(`🎉 GitHub批量加载完成！总共: ${loadedQuestions.length} 道题目`);
        return loadedQuestions;
    }
    
    // 多重加载策略
    async function tryMultipleLoadStrategies(bankName) {
        const strategies = [
            () => loadFromGitHubRaw(bankName),
            () => loadFromGitHubAPI(bankName),
            () => loadFromLocalPath(bankName)
        ];
        
        for (const strategy of strategies) {
            try {
                console.log('🔄 尝试加载策略...');
                const result = await strategy();
                if (result && result.length > 0) {
                    console.log(`✅ 加载策略成功，获得 ${result.length} 道题目`);
                    return result;
                }
            } catch (error) {
                console.warn('⚠️ 加载策略失败:', error.message);
                continue;
            }
        }
        return null;
    }
    
    // GitHub Raw加载
    async function loadFromGitHubRaw(bankName) {
        const url = `${GITHUB_CONFIG.rawBaseUrl}/question-banks/${bankName}`;
        console.log(`🌐 从GitHub Raw加载: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : (data.questions || []);
    }
    
    // GitHub API加载
    async function loadFromGitHubAPI(bankName) {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/question-banks/${bankName}`;
        console.log(`🔗 从GitHub API加载: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`GitHub API错误: ${response.status}`);
        }
        
        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        return Array.isArray(content) ? content : (content.questions || []);
    }
    
    // 本地路径加载
    async function loadFromLocalPath(bankName) {
        const url = `./question-banks/${bankName}`;
        console.log(`📁 从本地路径加载: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`本地文件不存在: ${response.status}`);
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : (data.questions || []);
    }
    
    // 加载默认题目
    async function loadDefaultQuestions() {
        console.log('🔄 加载默认题目...');
        questions = [
            {
                id: 1,
                question: "多姆雷茨速度分解定理中，M点速度不包含以下哪项？",
                options: [
                    "A. 平移速度",
                    "B. 绕基点的旋转速度", 
                    "C. 相对基点的变形速度",
                    "D. 绝对加速度"
                ],
                correctAnswer: 3,
                explanation: "多姆雷茨速度分解定理中，M点速度包含平移速度、绕基点的旋转速度和相对基点的变形速度，不包含绝对加速度。"
            },
            {
                id: 2,
                question: "理想流体欧拉运动方程的适用条件是什么？",
                options: [
                    "A. 粘性流体",
                    "B. 无粘性流体",
                    "C. 可压缩流体", 
                    "D. 湍流状态"
                ],
                correctAnswer: 1,
                explanation: "理想流体欧拉运动方程适用于无粘性流体的运动分析。"
            }
        ];
        statistics.totalQuestions = questions.length;
        resetStatistics();
        console.log(`✅ 默认题目加载完成，共 ${questions.length} 道题目`);
    }
    
    // ============ 答题逻辑 ============
    function getCurrentQuestion() {
        if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
            return {
                ...questions[currentQuestionIndex],
                index: currentQuestionIndex,
                total: questions.length,
                progress: ((currentQuestionIndex + 1) / questions.length * 100).toFixed(1)
            };
        }
        return null;
    }
    
    function submitAnswer(questionId, answerIndex, timeSpent = 0) {
        const question = questions[currentQuestionIndex];
        if (!question || question.id !== questionId) {
            console.error('题目ID不匹配');
            return false;
        }
        
        // 记录答案
        const isCorrect = answerIndex === question.correctAnswer;
        userAnswers.set(questionId, {
            answer: answerIndex,
            correct: isCorrect,
            timeSpent: timeSpent,
            timestamp: Date.now()
        });
        
        // 更新统计
        updateStatistics(isCorrect, timeSpent);
        
        console.log(`📝 答题记录: 题目${questionId}, 选择${answerIndex}, ${isCorrect ? '正确' : '错误'}`);
        return true;
    }
    
    function nextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            questionStartTime = Date.now();
            return getCurrentQuestion();
        }
        return null;
    }
    
    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            questionStartTime = Date.now();
            return getCurrentQuestion();
        }
        return null;
    }
    
    function jumpToQuestion(index) {
        if (index >= 0 && index < questions.length) {
            currentQuestionIndex = index;
            questionStartTime = Date.now();
            return getCurrentQuestion();
        }
        return null;
    }
    
    // ============ 统计分析 ============
    function updateStatistics(isCorrect, timeSpent) {
        statistics.answeredQuestions++;
        if (isCorrect) {
            statistics.correctAnswers++;
        }
        
        if (timeSpent > 0) {
            statistics.questionTimes.push(timeSpent);
            statistics.averageTime = statistics.questionTimes.reduce((a, b) => a + b, 0) / statistics.questionTimes.length;
        }
    }
    
    function getStatistics() {
        const accuracy = statistics.answeredQuestions > 0 
            ? (statistics.correctAnswers / statistics.answeredQuestions * 100).toFixed(1)
            : '0';
            
        return {
            ...statistics,
            accuracy: accuracy + '%',
            remaining: statistics.totalQuestions - statistics.answeredQuestions,
            formattedAverageTime: formatTime(statistics.averageTime)
        };
    }
    
    function resetStatistics() {
        statistics = {
            totalQuestions: questions.length,
            answeredQuestions: 0,
            correctAnswers: 0,
            averageTime: 0,
            startTime: Date.now(),
            questionTimes: []
        };
        currentQuestionIndex = 0;
        userAnswers.clear();
        questionStartTime = Date.now();
    }
    
    // ============ 工具函数 ============
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    function formatTime(ms) {
        if (ms < 1000) return '0s';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    function getAnswerHistory() {
        return Array.from(userAnswers.entries()).map(([questionId, answer]) => ({
            questionId,
            ...answer
        }));
    }
    
    // ============ 公共接口 ============
    return {
        // 初始化
        init: async function(bankName) {
            console.log('🚀 题库引擎初始化...');
            questionStartTime = Date.now();
            return await loadQuestionBank(bankName);
        },
        
        // 题目管理
        loadQuestions: loadQuestionBank,
        getCurrentQuestion,
        nextQuestion,
        previousQuestion,
        jumpToQuestion,
        
        // 答题功能
        submitAnswer,
        getAnswerHistory,
        
        // 统计分析
        getStatistics,
        resetStatistics,
        
        // 状态查询
        getTotalQuestions: () => questions.length,
        getCurrentIndex: () => currentQuestionIndex,
        isLoading: () => isLoading,
        
        // 工具函数
        formatTime,
        
        // 事件系统
        on: function(event, callback) {
            document.addEventListener(`questionBank:${event}`, callback);
        },
        
        emit: function(event, data) {
            document.dispatchEvent(new CustomEvent(`questionBank:${event}`, { detail: data }));
        }
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('�� 题库核心引擎已加载');
}); 