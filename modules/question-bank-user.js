/**
 * 题库用户数据管理模块
 * 负责收藏、错题本、学习记录等用户相关数据
 */
window.QuestionBankUser = (function() {
    // 私有变量
    let userData = {
        favorites: [],
        wrongQuestions: [],
        completedQuestions: [],
        studyHistory: [],
        preferences: {},
        stats: {
            totalStudyTime: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            streakDays: 0,
            lastStudyDate: null
        }
    };
    
    // 存储键名
    const STORAGE_KEYS = {
        USER_DATA: 'questionBankUserData',
        FAVORITES: 'favoriteBanks',
        WRONG_QUESTIONS: 'wrongQuestions',
        STUDY_HISTORY: 'studyHistory',
        PREFERENCES: 'userPreferences'
    };
    
    // 公有方法
    return {
        // 初始化模块
        init: function() {
            console.log('初始化用户数据模块...');
            this.loadUserData();
            this.updateStreakDays();
            return this;
        },
        
        // 加载用户数据
        loadUserData: function() {
            try {
                // 加载主要用户数据
                const storedData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    userData = { ...userData, ...parsedData };
                }
                
                // 加载收藏数据（兼容旧版本）
                const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
                if (storedFavorites) {
                    const favorites = JSON.parse(storedFavorites);
                    if (Array.isArray(favorites)) {
                        userData.favorites = favorites;
                    }
                }
                
                // 加载错题数据
                const storedWrongQuestions = localStorage.getItem(STORAGE_KEYS.WRONG_QUESTIONS);
                if (storedWrongQuestions) {
                    const wrongQuestions = JSON.parse(storedWrongQuestions);
                    if (Array.isArray(wrongQuestions)) {
                        userData.wrongQuestions = wrongQuestions;
                    }
                }
                
                console.log('用户数据加载完成:', userData);
            } catch (error) {
                console.error('加载用户数据失败:', error);
                this.resetUserData();
            }
        },
        
        // 保存用户数据
        saveUserData: function() {
            try {
                localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
                localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(userData.favorites));
                localStorage.setItem(STORAGE_KEYS.WRONG_QUESTIONS, JSON.stringify(userData.wrongQuestions));
                console.log('用户数据保存完成');
            } catch (error) {
                console.error('保存用户数据失败:', error);
                showNotification('数据保存失败', 'error');
            }
        },
        
        // 重置用户数据
        resetUserData: function() {
            userData = {
                favorites: [],
                wrongQuestions: [],
                completedQuestions: [],
                studyHistory: [],
                preferences: {},
                stats: {
                    totalStudyTime: 0,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    streakDays: 0,
                    lastStudyDate: null
                }
            };
            this.saveUserData();
        },
        
        // 收藏相关方法
        addFavorite: function(bankId) {
            if (!this.isFavorite(bankId)) {
                userData.favorites.push({
                    id: bankId,
                    addedAt: new Date().toISOString()
                });
                this.saveUserData();
                showNotification('已添加到收藏', 'success');
                this.updateFavoriteDisplay();
                return true;
            }
            return false;
        },
        
        removeFavorite: function(bankId) {
            const index = userData.favorites.findIndex(fav => 
                typeof fav === 'string' ? fav === bankId : fav.id === bankId
            );
            if (index > -1) {
                userData.favorites.splice(index, 1);
                this.saveUserData();
                showNotification('已从收藏中移除', 'info');
                this.updateFavoriteDisplay();
                return true;
            }
            return false;
        },
        
        toggleFavorite: function(bankId) {
            if (this.isFavorite(bankId)) {
                return this.removeFavorite(bankId);
            } else {
                return this.addFavorite(bankId);
            }
        },
        
        isFavorite: function(bankId) {
            return userData.favorites.some(fav => 
                typeof fav === 'string' ? fav === bankId : fav.id === bankId
            );
        },
        
        getFavorites: function() {
            return userData.favorites.map(fav => 
                typeof fav === 'string' ? fav : fav.id
            );
        },
        
        getFavoriteCount: function() {
            return userData.favorites.length;
        },
        
        // 显示收藏列表
        showFavorites: function() {
            const favorites = this.getFavorites();
            if (favorites.length === 0) {
                showNotification('您还没有收藏任何题库', 'info');
                return;
            }
            
            // 筛选显示收藏的题库
            if (typeof QuestionBankData !== 'undefined') {
                const allBanks = QuestionBankData.getAllBanks();
                const favoriteBanks = allBanks.filter(bank => favorites.includes(bank.id));
                
                if (favoriteBanks.length === 0) {
                    showNotification('收藏的题库不存在或已被删除', 'warning');
                    return;
                }
                
                // 这里可以触发数据模块的筛选功能
                showNotification(`找到 ${favoriteBanks.length} 个收藏的题库`, 'info');
            }
        },
        
        // 错题本相关方法
        addWrongQuestion: function(question, bankId) {
            const wrongQuestion = {
                id: question.id || Date.now(),
                bankId: bankId,
                question: question,
                addedAt: new Date().toISOString(),
                reviewCount: 0,
                lastReview: null
            };
            
            // 检查是否已存在
            const existing = userData.wrongQuestions.find(wq => 
                wq.id === wrongQuestion.id && wq.bankId === bankId
            );
            
            if (!existing) {
                userData.wrongQuestions.push(wrongQuestion);
                this.saveUserData();
                showNotification('已添加到错题本', 'info');
            }
        },
        
        removeWrongQuestion: function(questionId, bankId) {
            const index = userData.wrongQuestions.findIndex(wq => 
                wq.id === questionId && wq.bankId === bankId
            );
            if (index > -1) {
                userData.wrongQuestions.splice(index, 1);
                this.saveUserData();
                showNotification('已从错题本移除', 'info');
                return true;
            }
            return false;
        },
        
        getWrongQuestions: function() {
            return userData.wrongQuestions;
        },
        
        getWrongQuestionCount: function() {
            return userData.wrongQuestions.length;
        },
        
        // 显示错题本
        showWrongQuestions: function() {
            const wrongQuestions = this.getWrongQuestions();
            if (wrongQuestions.length === 0) {
                showNotification('错题本是空的，继续加油！', 'success');
                return;
            }
            
            const content = `
                <div>
                    <h4>📚 错题本 (${wrongQuestions.length} 题)</h4>
                    <div style="max-height: 400px; overflow-y: auto; margin-top: 15px;">
                        ${wrongQuestions.map(wq => `
                            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                                <div style="font-weight: bold; color: #333; margin-bottom: 8px;">
                                    ${wq.question.question || wq.question.title || '题目'}
                                </div>
                                <div style="font-size: 0.9em; color: #666; margin-bottom: 8px;">
                                    来源: ${wq.bankId} | 添加时间: ${new Date(wq.addedAt).toLocaleDateString()}
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button class="btn btn-sm btn-primary" onclick="QuestionBankUser.reviewWrongQuestion('${wq.id}', '${wq.bankId}')">
                                        复习
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="QuestionBankUser.removeWrongQuestion('${wq.id}', '${wq.bankId}')">
                                        移除
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="text-align: center; margin-top: 15px;">
                        <button class="btn btn-warning" onclick="QuestionBankUser.clearWrongQuestions()">
                            清空错题本
                        </button>
                        <button class="btn btn-success" onclick="QuestionBankUser.practiceWrongQuestions()">
                            练习错题
                        </button>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '错题本',
                    content: content,
                    size: 'large'
                });
            } else {
                showNotification('错题本功能需要UI模块支持', 'warning');
            }
        },
        
        // 复习错题
        reviewWrongQuestion: function(questionId, bankId) {
            const wrongQuestion = userData.wrongQuestions.find(wq => 
                wq.id === questionId && wq.bankId === bankId
            );
            
            if (wrongQuestion) {
                wrongQuestion.reviewCount++;
                wrongQuestion.lastReview = new Date().toISOString();
                this.saveUserData();
                showNotification('开始复习错题', 'info');
                
                // 这里可以调用练习模块开始单题练习
                if (typeof QuestionBankPractice !== 'undefined') {
                    QuestionBankPractice.startSingleQuestion(wrongQuestion.question);
                }
            }
        },
        
        // 练习错题
        practiceWrongQuestions: function() {
            const wrongQuestions = this.getWrongQuestions();
            if (wrongQuestions.length === 0) {
                showNotification('没有错题可以练习', 'info');
                return;
            }
            
            if (typeof QuestionBankPractice !== 'undefined') {
                const questions = wrongQuestions.map(wq => wq.question);
                QuestionBankPractice.startCustomPractice(questions, '错题练习');
            } else {
                showNotification('练习功能需要练习模块支持', 'warning');
            }
        },
        
        // 清空错题本
        clearWrongQuestions: function() {
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.confirm('确定要清空错题本吗？此操作不可恢复。', '确认清空')
                    .then(confirmed => {
                        if (confirmed) {
                            userData.wrongQuestions = [];
                            this.saveUserData();
                            showNotification('错题本已清空', 'success');
                        }
                    });
            } else {
                userData.wrongQuestions = [];
                this.saveUserData();
                showNotification('错题本已清空', 'success');
            }
        },
        
        // 学习记录相关方法
        recordStudySession: function(sessionData) {
            const session = {
                id: Date.now(),
                bankId: sessionData.bankId || 'unknown',
                startTime: sessionData.startTime || new Date().toISOString(),
                endTime: sessionData.endTime || new Date().toISOString(),
                questionsAnswered: sessionData.questionsAnswered || 0,
                correctAnswers: sessionData.correctAnswers || 0,
                duration: sessionData.duration || 0
            };
            
            userData.studyHistory.push(session);
            
            // 更新统计信息
            userData.stats.totalQuestions += session.questionsAnswered;
            userData.stats.correctAnswers += session.correctAnswers;
            userData.stats.totalStudyTime += session.duration;
            userData.stats.lastStudyDate = session.endTime;
            
            this.saveUserData();
            this.updateStreakDays();
        },
        
        // 更新连续学习天数
        updateStreakDays: function() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (!userData.stats.lastStudyDate) {
                userData.stats.streakDays = 0;
                return;
            }
            
            const lastStudyDate = new Date(userData.stats.lastStudyDate);
            lastStudyDate.setHours(0, 0, 0, 0);
            
            const dayDiff = Math.floor((today - lastStudyDate) / (1000 * 60 * 60 * 24));
            
            if (dayDiff === 0) {
                // 今天已经学习过了
                return;
            } else if (dayDiff === 1) {
                // 昨天学习过，连续天数+1
                userData.stats.streakDays++;
            } else {
                // 断连了，重置为0
                userData.stats.streakDays = 0;
            }
            
            this.saveUserData();
        },
        
        // 获取学习统计
        getStats: function() {
            const stats = { ...userData.stats };
            
            // 计算正确率
            stats.correctRate = stats.totalQuestions > 0 
                ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
                : 0;
                
            // 格式化学习时长
            stats.formattedStudyTime = this.formatDuration(stats.totalStudyTime);
            
            return stats;
        },
        
        // 格式化时长
        formatDuration: function(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            
            if (hours > 0) {
                return `${hours}h ${minutes}m`;
            } else {
                return `${minutes}m`;
            }
        },
        
        // 获取学习历史
        getStudyHistory: function(limit = 10) {
            return userData.studyHistory
                .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
                .slice(0, limit);
        },
        
        // 偏好设置相关方法
        setPreference: function(key, value) {
            userData.preferences[key] = value;
            this.saveUserData();
        },
        
        getPreference: function(key, defaultValue = null) {
            return userData.preferences[key] || defaultValue;
        },
        
        // 更新收藏显示
        updateFavoriteDisplay: function() {
            // 更新收藏数量显示
            const favoriteCountElements = document.querySelectorAll('#favoriteCount');
            favoriteCountElements.forEach(element => {
                element.textContent = this.getFavoriteCount();
            });
            
            // 如果数据模块存在，重新渲染题库列表以更新心形图标
            if (typeof QuestionBankData !== 'undefined') {
                QuestionBankData.renderQuestionBanks();
            }
        },
        
        // 导出用户数据
        exportUserData: function() {
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                userData: userData
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
                type: 'application/json' 
            });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `question-bank-userdata-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('用户数据导出完成', 'success');
        },
        
        // 导入用户数据
        importUserData: function(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    if (importData.userData) {
                        userData = { ...userData, ...importData.userData };
                        this.saveUserData();
                        showNotification('用户数据导入成功', 'success');
                        // 更新显示
                        this.updateFavoriteDisplay();
                        if (typeof QuestionBankStats !== 'undefined') {
                            QuestionBankStats.updateStats();
                        }
                    } else {
                        throw new Error('无效的用户数据格式');
                    }
                } catch (error) {
                    console.error('导入用户数据失败:', error);
                    showNotification('用户数据导入失败', 'error');
                }
            };
            reader.readAsText(file);
        },
        
        // 获取用户数据
        getUserData: function() {
            return { ...userData };
        },
        
        // 检查用户数据完整性
        validateUserData: function() {
            const requiredKeys = ['favorites', 'wrongQuestions', 'completedQuestions', 'studyHistory', 'preferences', 'stats'];
            const isValid = requiredKeys.every(key => userData.hasOwnProperty(key));
            
            if (!isValid) {
                console.warn('用户数据结构不完整，正在修复...');
                this.resetUserData();
            }
            
            return isValid;
        }
    };
})(); 