// 题目编辑器模块
window.QuestionEditor = {
    // 创建新题目的默认结构
    createEmptyQuestion() {
        return {
            id: null,
            title: '',
            content: '',
            options: ['', '', '', ''],
            answer: 0,
            explanation: '',
            category: '分类',
            difficulty: 'medium',
            year: null,
            school: '中国海洋大学',
            bank: '',
            bankId: '',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'teacher',
            isCustom: true
        };
    },

    // 验证题目数据
    validateQuestion(question) {
        const errors = [];

        if (!question.title || question.title.trim().length < 5) {
            errors.push('题目标题不能少于5个字符');
        }

        if (!question.options || question.options.length < 2) {
            errors.push('至少需要2个选项');
        }

        const validOptions = question.options.filter(opt => opt && opt.trim().length > 0);
        if (validOptions.length < 2) {
            errors.push('至少需要2个有效选项');
        }

        if (question.answer < 0 || question.answer >= question.options.length) {
            errors.push('正确答案索引无效');
        }

        if (!question.category || question.category.trim().length === 0) {
            errors.push('必须选择题目分类');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // 保存题目到本地存储
    saveQuestion(question) {
        try {
            // 生成ID
            if (!question.id) {
                question.id = this.generateQuestionId();
            }
            question.updatedAt = new Date().toISOString();

            // 获取现有的自定义题目
            const customQuestions = this.getCustomQuestions();
            const existingIndex = customQuestions.findIndex(q => q.id === question.id);

            if (existingIndex >= 0) {
                // 更新现有题目
                customQuestions[existingIndex] = question;
            } else {
                // 添加新题目
                question.createdAt = new Date().toISOString();
                customQuestions.push(question);
            }

            // 保存到本地存储
            localStorage.setItem('customQuestions', JSON.stringify(customQuestions));
            
            // 触发事件通知其他组件
            this.notifyQuestionChanged(question);

            return { success: true, question };
        } catch (error) {
            console.error('保存题目失败:', error);
            return { success: false, error: error.message };
        }
    },

    // 删除题目
    deleteQuestion(questionId) {
        try {
            const customQuestions = this.getCustomQuestions();
            const filteredQuestions = customQuestions.filter(q => q.id !== questionId);
            
            localStorage.setItem('customQuestions', JSON.stringify(filteredQuestions));
            
            this.notifyQuestionDeleted(questionId);
            
            return { success: true };
        } catch (error) {
            console.error('删除题目失败:', error);
            return { success: false, error: error.message };
        }
    },

    // 获取自定义题目
    getCustomQuestions() {
        try {
            const stored = localStorage.getItem('customQuestions');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('获取自定义题目失败:', error);
            return [];
        }
    },

    // 根据ID获取题目
    getQuestionById(questionId) {
        const customQuestions = this.getCustomQuestions();
        return customQuestions.find(q => q.id === questionId) || null;
    },

    // 生成题目ID
    generateQuestionId() {
        return 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // 导出题目为JSON
    exportQuestions(questions = null) {
        const exportData = questions || this.getCustomQuestions();
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `custom_questions_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // 导入题目
    async importQuestions(file) {
        try {
            const text = await file.text();
            const importedQuestions = JSON.parse(text);
            
            if (!Array.isArray(importedQuestions)) {
                throw new Error('导入文件格式错误，应为题目数组');
            }

            const customQuestions = this.getCustomQuestions();
            let addedCount = 0;
            let updatedCount = 0;

            for (const question of importedQuestions) {
                // 验证题目
                const validation = this.validateQuestion(question);
                if (!validation.isValid) {
                    console.warn('跳过无效题目:', question.title, validation.errors);
                    continue;
                }

                // 检查是否已存在
                const existingIndex = customQuestions.findIndex(q => q.id === question.id);
                
                if (existingIndex >= 0) {
                    customQuestions[existingIndex] = { ...question, updatedAt: new Date().toISOString() };
                    updatedCount++;
                } else {
                    if (!question.id) {
                        question.id = this.generateQuestionId();
                    }
                    question.createdAt = new Date().toISOString();
                    question.updatedAt = new Date().toISOString();
                    question.isCustom = true;
                    customQuestions.push(question);
                    addedCount++;
                }
            }

            localStorage.setItem('customQuestions', JSON.stringify(customQuestions));
            
            return {
                success: true,
                added: addedCount,
                updated: updatedCount,
                total: addedCount + updatedCount
            };
        } catch (error) {
            console.error('导入题目失败:', error);
            return { success: false, error: error.message };
        }
    },

    // 批量操作
    batchDelete(questionIds) {
        try {
            const customQuestions = this.getCustomQuestions();
            const filteredQuestions = customQuestions.filter(q => !questionIds.includes(q.id));
            
            localStorage.setItem('customQuestions', JSON.stringify(filteredQuestions));
            
            questionIds.forEach(id => this.notifyQuestionDeleted(id));
            
            return { success: true, deletedCount: questionIds.length };
        } catch (error) {
            console.error('批量删除失败:', error);
            return { success: false, error: error.message };
        }
    },

    // 复制题目
    duplicateQuestion(questionId) {
        try {
            const original = this.getQuestionById(questionId);
            if (!original) {
                throw new Error('原题目不存在');
            }

            const duplicate = {
                ...original,
                id: this.generateQuestionId(),
                title: original.title + ' (副本)',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const result = this.saveQuestion(duplicate);
            return result;
        } catch (error) {
            console.error('复制题目失败:', error);
            return { success: false, error: error.message };
        }
    },

    // 搜索题目
    searchQuestions(query, filters = {}) {
        const customQuestions = this.getCustomQuestions();
        
        return customQuestions.filter(question => {
            // 关键词搜索
            if (query) {
                const searchText = `${question.title} ${question.content}`.toLowerCase();
                if (!searchText.includes(query.toLowerCase())) {
                    return false;
                }
            }

            // 分类筛选
            if (filters.category && question.category !== filters.category) {
                return false;
            }

            // 难度筛选
            if (filters.difficulty && question.difficulty !== filters.difficulty) {
                return false;
            }

            // 年份筛选
            if (filters.year && question.year !== filters.year) {
                return false;
            }

            // 题库筛选
            if (filters.bank && question.bank !== filters.bank) {
                return false;
            }

            return true;
        });
    },

    // 获取统计信息
    getStatistics() {
        const customQuestions = this.getCustomQuestions();
        
        const stats = {
            total: customQuestions.length,
            categories: {},
            difficulties: { easy: 0, medium: 0, hard: 0 },
            years: {},
            recentlyAdded: 0
        };

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        customQuestions.forEach(question => {
            // 统计分类
            stats.categories[question.category] = (stats.categories[question.category] || 0) + 1;
            
            // 统计难度
            if (question.difficulty in stats.difficulties) {
                stats.difficulties[question.difficulty]++;
            }
            
            // 统计年份
            if (question.year) {
                stats.years[question.year] = (stats.years[question.year] || 0) + 1;
            }
            
            // 统计最近添加
            if (new Date(question.createdAt) > oneWeekAgo) {
                stats.recentlyAdded++;
            }
        });

        return stats;
    },

    // 事件通知系统
    notifyQuestionChanged(question) {
        window.dispatchEvent(new CustomEvent('questionChanged', { 
            detail: { question, action: 'save' }
        }));
    },

    notifyQuestionDeleted(questionId) {
        window.dispatchEvent(new CustomEvent('questionChanged', { 
            detail: { questionId, action: 'delete' }
        }));
    },

    // 题目模板
    getQuestionTemplates() {
        return [
            {
                name: '流体力学基础概念题',
                template: {
                    title: '下列关于流体的说法正确的是：',
                    content: '',
                    options: ['流体具有固定的形状', '流体不具有粘性', '流体在静止时不能承受切应力', '流体密度总是恒定的'],
                    answer: 2,
                    explanation: '流体在静止时不能承受切应力，这是流体的基本特性之一。',
                    category: '分类',
                    difficulty: 'easy'
                }
            },
            {
                name: '计算题模板',
                template: {
                    title: '已知条件，求解未知量：',
                    content: '给定条件：\n1. ...\n2. ...\n求解：...',
                    options: ['答案A', '答案B', '答案C', '答案D'],
                    answer: 0,
                    explanation: '解题步骤：\n1. ...\n2. ...\n3. ...',
                    category: '分类',
                    difficulty: 'medium'
                }
            },
            {
                name: '应用题模板',
                template: {
                    title: '在实际工程中，以下哪种情况...',
                    content: '背景描述：...',
                    options: ['选项A：...', '选项B：...', '选项C：...', '选项D：...'],
                    answer: 0,
                    explanation: '在实际应用中，需要考虑...因素，因此...',
                    category: '分类',
                    difficulty: 'hard'
                }
            }
        ];
    },

    // 自动保存功能
    setupAutoSave(interval = 30000) {
        let autoSaveData = null;
        
        return {
            save: (data) => {
                autoSaveData = data;
                localStorage.setItem('questionEditorAutoSave', JSON.stringify(data));
            },
            
            load: () => {
                try {
                    const saved = localStorage.getItem('questionEditorAutoSave');
                    return saved ? JSON.parse(saved) : null;
                } catch (error) {
                    console.error('自动保存数据损坏:', error);
                    return null;
                }
            },
            
            clear: () => {
                autoSaveData = null;
                localStorage.removeItem('questionEditorAutoSave');
            },
            
            startAutoSave: (getDataCallback) => {
                return setInterval(() => {
                    if (typeof getDataCallback === 'function') {
                        const data = getDataCallback();
                        if (data && JSON.stringify(data) !== JSON.stringify(autoSaveData)) {
                            this.save(data);
                            console.log('题目编辑器自动保存完成');
                        }
                    }
                }, interval);
            }
        };
    }
};

console.log('✏️ 题目编辑器模块已加载'); 