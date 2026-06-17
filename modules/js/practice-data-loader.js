// 数据加载器模块
window.PracticeDataLoader = {
    // 私有变量
    _loadingPromises: new Map(),
    _cache: new Map(),
    _loadStats: {
        totalFiles: 0,
        loadedFiles: 0,
        failedFiles: 0,
        totalQuestions: 0
    },

    // 获取加载统计
    getLoadStats() {
        return { ...this._loadStats };
    },

    // 重置加载统计
    resetLoadStats() {
        this._loadStats = {
            totalFiles: 0,
            loadedFiles: 0,
            failedFiles: 0,
            totalQuestions: 0
        };
    },

    // 批量加载所有题库
    async loadAllQuestionBanks(onProgress = null) {
        console.log('🚀 开始批量加载所有题库...');
        this.resetLoadStats();
        
        const bankConfigs = PracticeConfig.questionBanks;
        this._loadStats.totalFiles = bankConfigs.length;

        let allQuestions = [];
        let allBanks = [];

        for (const [index, bankConfig] of bankConfigs.entries()) {
            try {
                if (onProgress) {
                    onProgress({
                        current: index + 1,
                        total: bankConfigs.length,
                        currentFile: bankConfig.name,
                        status: 'loading'
                    });
                }

                const result = await this.loadSingleBank(bankConfig);
                if (result.questions.length > 0) {
                    allQuestions = allQuestions.concat(result.questions);
                    allBanks.push(result.bankInfo);
                    this._loadStats.loadedFiles++;
                    this._loadStats.totalQuestions += result.questions.length;
                    
                    console.log(`✅ ${bankConfig.name}: +${result.questions.length}题`);
                } else {
                    this._loadStats.failedFiles++;
                    console.warn(`⚠️ ${bankConfig.name}: 无题目数据`);
                }
            } catch (error) {
                this._loadStats.failedFiles++;
                console.warn(`❌ ${bankConfig.name}: 加载失败`, error.message);
            }
        }

        if (onProgress) {
            onProgress({
                current: bankConfigs.length,
                total: bankConfigs.length,
                status: 'completed',
                stats: this.getLoadStats()
            });
        }

        console.log(`🎉 批量加载完成！成功: ${this._loadStats.loadedFiles}/${this._loadStats.totalFiles}，总题目: ${this._loadStats.totalQuestions}`);
        
        return {
            questions: allQuestions,
            banks: allBanks,
            stats: this.getLoadStats()
        };
    },

    // 加载单个题库
    async loadSingleBank(bankConfig) {
        const cacheKey = bankConfig.file;
        
        // 检查缓存
        if (this._cache.has(cacheKey)) {
            console.log(`📋 从缓存加载: ${bankConfig.name}`);
            return this._cache.get(cacheKey);
        }

        // 检查是否正在加载
        if (this._loadingPromises.has(cacheKey)) {
            return await this._loadingPromises.get(cacheKey);
        }

        // 创建加载Promise
        const loadPromise = this._loadBankFromSource(bankConfig);
        this._loadingPromises.set(cacheKey, loadPromise);

        try {
            const result = await loadPromise;
            // 缓存结果
            this._cache.set(cacheKey, result);
            return result;
        } finally {
            this._loadingPromises.delete(cacheKey);
        }
    },

    // 从源加载题库数据
    async _loadBankFromSource(bankConfig) {
        // 首先尝试从GitHub加载
        try {
            return await this._loadFromGitHub(bankConfig);
        } catch (githubError) {
            console.warn(`GitHub加载失败: ${bankConfig.name}`, githubError.message);
            
            // 回退到本地加载
            try {
                return await this._loadFromLocal(bankConfig);
            } catch (localError) {
                console.error(`本地加载也失败: ${bankConfig.name}`, localError.message);
                throw new Error(`加载失败: ${githubError.message} & ${localError.message}`);
            }
        }
    },

    // 从GitHub加载
    async _loadFromGitHub(bankConfig) {
        const url = `${PracticeConfig.github.rawBaseUrl}/question-banks/${bankConfig.file}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), PracticeConfig.defaults.loadingTimeout);

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return this._processQuestionData(data, bankConfig);
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('请求超时');
            }
            throw error;
        }
    },

    // 从本地加载
    async _loadFromLocal(bankConfig) {
        const url = `question-banks/${bankConfig.file}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`本地文件不存在: ${bankConfig.file}`);
        }

        const data = await response.json();
        return this._processQuestionData(data, bankConfig);
    },

    // 处理题目数据
    _processQuestionData(rawData, bankConfig) {
        // 提取题目数组
        const questions = Array.isArray(rawData) ? rawData : (rawData.questions || []);
        
        if (!questions || questions.length === 0) {
            throw new Error('无有效题目数据');
        }

        const visibleQuestions = questions.filter(question => this._isDisplayableQuestion(question));

        if (visibleQuestions.length === 0) {
            throw new Error('无可展示题目数据');
        }

        // 转换题目格式
        const processedQuestions = visibleQuestions.map((q, index) => ({
            id: `${bankConfig.file}_${index}`,
            title: q.title || q.question || `题目${index + 1}`,
            content: q.content || '',
            options: q.options || ['A', 'B', 'C', 'D'],
            answer: this._normalizeAnswer(q.answer),
            explanation: q.explanation || '暂无解析',
            category: q.category || bankConfig.category,
            difficulty: q.difficulty || bankConfig.difficulty || 'medium',
            year: q.year || bankConfig.year || null,
            school: q.school || '中国海洋大学',
            bank: bankConfig.name,
            bankId: bankConfig.file,
            source: 'github', // 标记数据源
            loadTime: new Date().toISOString()
        }));

        // 创建题库信息
        const bankInfo = {
            id: bankConfig.file,
            name: bankConfig.name,
            description: bankConfig.description,
            category: bankConfig.category,
            year: bankConfig.year,
            questionCount: processedQuestions.length,
            difficulty: bankConfig.difficulty || 'medium',
            file: bankConfig.file,
            loadTime: new Date().toISOString()
        };

        return {
            questions: processedQuestions,
            bankInfo: bankInfo
        };
    },

    _isDisplayableQuestion(question) {
        if (!question || typeof question !== 'object') {
            return false;
        }

        if (question.type === '说明项') {
            return false;
        }

        const tags = Array.isArray(question.tags) ? question.tags : [];
        return !tags.includes('分页占位');
    },

    // 标准化答案格式
    _normalizeAnswer(answer) {
        if (typeof answer === 'number') {
            return answer;
        }
        if (typeof answer === 'string') {
            // 如果是字母答案，转换为数字
            const upperAnswer = answer.toUpperCase();
            if (upperAnswer >= 'A' && upperAnswer <= 'Z') {
                return upperAnswer.charCodeAt(0) - 'A'.charCodeAt(0);
            }
            // 如果是数字字符串
            const numAnswer = parseInt(answer);
            if (!isNaN(numAnswer)) {
                return numAnswer;
            }
        }
        // 默认返回0
        return 0;
    },

    // 按条件筛选题库
    filterBanks(banks, filters) {
        return banks.filter(bank => {
            if (filters.category && !bank.category.includes(filters.category)) {
                return false;
            }
            if (filters.year && bank.year !== filters.year) {
                return false;
            }
            if (filters.difficulty && bank.difficulty !== filters.difficulty) {
                return false;
            }
            if (filters.keyword) {
                const keyword = filters.keyword.toLowerCase();
                const searchText = `${bank.name} ${bank.description}`.toLowerCase();
                if (!searchText.includes(keyword)) {
                    return false;
                }
            }
            return true;
        });
    },

    // 按条件筛选题目
    filterQuestions(questions, filters) {
        return questions.filter(question => {
            if (filters.category && question.category !== filters.category) {
                return false;
            }
            if (filters.difficulty && question.difficulty !== filters.difficulty) {
                return false;
            }
            if (filters.year && question.year !== filters.year) {
                return false;
            }
            if (filters.bank && question.bankId !== filters.bank) {
                return false;
            }
            if (filters.keyword) {
                const keyword = filters.keyword.toLowerCase();
                const searchText = `${question.title} ${question.content}`.toLowerCase();
                if (!searchText.includes(keyword)) {
                    return false;
                }
            }
            return true;
        });
    },

    // 获取题库统计信息
    getBankStats(questions) {
        const stats = {
            totalQuestions: questions.length,
            categories: {},
            difficulties: {},
            years: {},
            banks: {}
        };

        questions.forEach(q => {
            // 统计分类
            stats.categories[q.category] = (stats.categories[q.category] || 0) + 1;
            
            // 统计难度
            stats.difficulties[q.difficulty] = (stats.difficulties[q.difficulty] || 0) + 1;
            
            // 统计年份
            if (q.year) {
                stats.years[q.year] = (stats.years[q.year] || 0) + 1;
            }
            
            // 统计题库
            stats.banks[q.bank] = (stats.banks[q.bank] || 0) + 1;
        });

        return stats;
    },

    // 清除缓存
    clearCache() {
        this._cache.clear();
        this._loadingPromises.clear();
        console.log('📋 缓存已清除');
    },

    // 获取缓存大小
    getCacheSize() {
        return this._cache.size;
    },

    // 预加载指定题库
    async preloadBanks(bankIds) {
        const promises = bankIds.map(id => {
            const bankConfig = PracticeConfig.questionBanks.find(b => b.file === id);
            return bankConfig ? this.loadSingleBank(bankConfig) : null;
        }).filter(Boolean);

        return await Promise.allSettled(promises);
    }
};

console.log('📊 数据加载器模块已加载'); 