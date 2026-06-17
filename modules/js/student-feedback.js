// 学生反馈分析模块
window.StudentFeedback = {
    // 获取所有学生反馈数据
    getAllFeedbacks() {
        try {
            const feedbacks = JSON.parse(localStorage.getItem('studentFeedback') || '[]');
            return feedbacks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (error) {
            console.error('获取学生反馈失败:', error);
            return [];
        }
    },

    // 按学生分组获取反馈
    getFeedbacksByStudent() {
        const allFeedbacks = this.getAllFeedbacks();
        const grouped = {};

        allFeedbacks.forEach(feedback => {
            const studentId = feedback.studentId;
            if (!grouped[studentId]) {
                grouped[studentId] = {
                    studentInfo: {
                        id: studentId,
                        name: feedback.studentName,
                        totalAnswers: 0,
                        correctAnswers: 0,
                        correctRate: 0,
                        lastActive: feedback.timestamp,
                        totalTime: 0
                    },
                    feedbacks: []
                };
            }

            grouped[studentId].feedbacks.push(feedback);
            grouped[studentId].studentInfo.totalAnswers++;
            
            if (feedback.isCorrect) {
                grouped[studentId].studentInfo.correctAnswers++;
            }
            
            grouped[studentId].studentInfo.totalTime += feedback.timeSpent || 0;
            
            // 更新最后活跃时间
            if (new Date(feedback.timestamp) > new Date(grouped[studentId].studentInfo.lastActive)) {
                grouped[studentId].studentInfo.lastActive = feedback.timestamp;
            }
        });

        // 计算正确率
        Object.values(grouped).forEach(student => {
            const info = student.studentInfo;
            info.correctRate = info.totalAnswers > 0 ? 
                Math.round((info.correctAnswers / info.totalAnswers) * 100) : 0;
        });

        return grouped;
    },

    // 获取题目错误率统计
    getQuestionErrorStats() {
        const allFeedbacks = this.getAllFeedbacks();
        const questionStats = {};

        allFeedbacks.forEach(feedback => {
            const questionId = feedback.questionId;
            if (!questionStats[questionId]) {
                questionStats[questionId] = {
                    questionId: questionId,
                    questionTitle: feedback.questionTitle,
                    questionBank: feedback.questionBank,
                    category: feedback.category,
                    difficulty: feedback.difficulty,
                    totalAttempts: 0,
                    correctAttempts: 0,
                    incorrectAttempts: 0,
                    errorRate: 0,
                    averageTime: 0,
                    totalTime: 0
                };
            }

            const stats = questionStats[questionId];
            stats.totalAttempts++;
            stats.totalTime += feedback.timeSpent || 0;
            
            if (feedback.isCorrect) {
                stats.correctAttempts++;
            } else {
                stats.incorrectAttempts++;
            }
        });

        // 计算错误率和平均时间
        Object.values(questionStats).forEach(stats => {
            stats.errorRate = stats.totalAttempts > 0 ? 
                Math.round((stats.incorrectAttempts / stats.totalAttempts) * 100) : 0;
            stats.averageTime = stats.totalAttempts > 0 ? 
                Math.round(stats.totalTime / stats.totalAttempts) : 0;
        });

        // 按错误率排序
        return Object.values(questionStats).sort((a, b) => b.errorRate - a.errorRate);
    },

    // 获取学习进度分析
    getLearningProgress() {
        const feedbacksByStudent = this.getFeedbacksByStudent();
        const progress = [];

        Object.values(feedbacksByStudent).forEach(student => {
            const info = student.studentInfo;
            const recentFeedbacks = student.feedbacks
                .filter(f => {
                    const feedbackDate = new Date(f.timestamp);
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return feedbackDate > oneWeekAgo;
                })
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            // 分析最近一周的进度趋势
            const weeklyProgress = this.calculateWeeklyProgress(recentFeedbacks);
            
            progress.push({
                studentId: info.id,
                studentName: info.name,
                totalAnswers: info.totalAnswers,
                correctRate: info.correctRate,
                weeklyAnswers: recentFeedbacks.length,
                weeklyCorrectRate: weeklyProgress.correctRate,
                progressTrend: weeklyProgress.trend, // 'improving' | 'declining' | 'stable'
                lastActive: info.lastActive,
                averageTimePerQuestion: info.totalAnswers > 0 ? 
                    Math.round(info.totalTime / info.totalAnswers / 1000) : 0, // 转换为秒
                strongAreas: this.getStrongAreas(student.feedbacks),
                weakAreas: this.getWeakAreas(student.feedbacks)
            });
        });

        return progress.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
    },

    // 计算周进度
    calculateWeeklyProgress(recentFeedbacks) {
        if (recentFeedbacks.length === 0) {
            return { correctRate: 0, trend: 'stable' };
        }

        const correctAnswers = recentFeedbacks.filter(f => f.isCorrect).length;
        const correctRate = Math.round((correctAnswers / recentFeedbacks.length) * 100);

        // 分析趋势：比较前半周和后半周的表现
        const midPoint = Math.floor(recentFeedbacks.length / 2);
        const firstHalf = recentFeedbacks.slice(0, midPoint);
        const secondHalf = recentFeedbacks.slice(midPoint);

        const firstHalfRate = firstHalf.length > 0 ? 
            (firstHalf.filter(f => f.isCorrect).length / firstHalf.length) * 100 : 0;
        const secondHalfRate = secondHalf.length > 0 ? 
            (secondHalf.filter(f => f.isCorrect).length / secondHalf.length) * 100 : 0;

        let trend = 'stable';
        if (secondHalfRate > firstHalfRate + 10) {
            trend = 'improving';
        } else if (secondHalfRate < firstHalfRate - 10) {
            trend = 'declining';
        }

        return { correctRate, trend };
    },

    // 获取学生强项领域
    getStrongAreas(feedbacks) {
        const categoryStats = {};
        
        feedbacks.forEach(feedback => {
            const category = feedback.category || '未分类';
            if (!categoryStats[category]) {
                categoryStats[category] = { total: 0, correct: 0 };
            }
            categoryStats[category].total++;
            if (feedback.isCorrect) {
                categoryStats[category].correct++;
            }
        });

        return Object.entries(categoryStats)
            .map(([category, stats]) => ({
                category,
                correctRate: Math.round((stats.correct / stats.total) * 100),
                totalQuestions: stats.total
            }))
            .filter(area => area.correctRate >= 80 && area.totalQuestions >= 3)
            .sort((a, b) => b.correctRate - a.correctRate)
            .slice(0, 3);
    },

    // 获取学生薄弱领域
    getWeakAreas(feedbacks) {
        const categoryStats = {};
        
        feedbacks.forEach(feedback => {
            const category = feedback.category || '未分类';
            if (!categoryStats[category]) {
                categoryStats[category] = { total: 0, correct: 0 };
            }
            categoryStats[category].total++;
            if (feedback.isCorrect) {
                categoryStats[category].correct++;
            }
        });

        return Object.entries(categoryStats)
            .map(([category, stats]) => ({
                category,
                correctRate: Math.round((stats.correct / stats.total) * 100),
                totalQuestions: stats.total
            }))
            .filter(area => area.correctRate <= 60 && area.totalQuestions >= 3)
            .sort((a, b) => a.correctRate - b.correctRate)
            .slice(0, 3);
    },

    // 获取实时统计
    getRealTimeStats() {
        const allFeedbacks = this.getAllFeedbacks();
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const todayFeedbacks = allFeedbacks.filter(f => new Date(f.timestamp) >= todayStart);
        const thisWeekFeedbacks = allFeedbacks.filter(f => {
            const feedbackDate = new Date(f.timestamp);
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            return feedbackDate >= weekStart;
        });

        const activeStudents = new Set(allFeedbacks.map(f => f.studentId)).size;
        const totalQuestions = allFeedbacks.length;
        const correctAnswers = allFeedbacks.filter(f => f.isCorrect).length;

        return {
            totalStudents: activeStudents,
            totalAnswers: totalQuestions,
            averageScore: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
            todayAnswers: todayFeedbacks.length,
            weeklyAnswers: thisWeekFeedbacks.length,
            todayActiveStudents: new Set(todayFeedbacks.map(f => f.studentId)).size,
            weeklyActiveStudents: new Set(thisWeekFeedbacks.map(f => f.studentId)).size
        };
    },

    // 导出反馈数据
    exportFeedbackData(format = 'json') {
        const allData = {
            feedbacks: this.getAllFeedbacks(),
            studentStats: this.getFeedbacksByStudent(),
            questionStats: this.getQuestionErrorStats(),
            learningProgress: this.getLearningProgress(),
            realTimeStats: this.getRealTimeStats(),
            exportTime: new Date().toISOString()
        };

        if (format === 'json') {
            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            this.downloadFile(dataBlob, `student_feedback_${new Date().toISOString().split('T')[0]}.json`);
        } else if (format === 'csv') {
            const csvData = this.convertToCSV(allData.feedbacks);
            const dataBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            this.downloadFile(dataBlob, `student_feedback_${new Date().toISOString().split('T')[0]}.csv`);
        }
    },

    // 转换为CSV格式
    convertToCSV(feedbacks) {
        const headers = [
            '学生ID', '学生姓名', '题目ID', '题目标题', '题库', '分类', '难度',
            '选择答案', '正确答案', '是否正确', '答题时间(毫秒)', '时间戳'
        ];

        const csvRows = [headers.join(',')];

        feedbacks.forEach(feedback => {
            const row = [
                feedback.studentId,
                feedback.studentName,
                feedback.questionId,
                `"${feedback.questionTitle}"`, // 用引号包围以处理逗号
                feedback.questionBank,
                feedback.category,
                feedback.difficulty,
                feedback.selectedAnswer,
                feedback.correctAnswer,
                feedback.isCorrect ? '正确' : '错误',
                feedback.timeSpent || 0,
                feedback.timestamp
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    },

    // 下载文件
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // 清理旧数据
    cleanupOldData(daysToKeep = 30) {
        try {
            const allFeedbacks = this.getAllFeedbacks();
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

            const filteredFeedbacks = allFeedbacks.filter(feedback => 
                new Date(feedback.timestamp) > cutoffDate
            );

            localStorage.setItem('studentFeedback', JSON.stringify(filteredFeedbacks));
            
            return {
                success: true,
                removedCount: allFeedbacks.length - filteredFeedbacks.length,
                remainingCount: filteredFeedbacks.length
            };
        } catch (error) {
            console.error('清理旧数据失败:', error);
            return { success: false, error: error.message };
        }
    },

    // 获取学习时间分析
    getTimeAnalysis() {
        const feedbacksByStudent = this.getFeedbacksByStudent();
        const timeAnalysis = [];

        Object.values(feedbacksByStudent).forEach(student => {
            const feedbacks = student.feedbacks;
            const dailyTime = {};

            feedbacks.forEach(feedback => {
                const date = new Date(feedback.timestamp).toISOString().split('T')[0];
                if (!dailyTime[date]) {
                    dailyTime[date] = 0;
                }
                dailyTime[date] += feedback.timeSpent || 0;
            });

            const totalDays = Object.keys(dailyTime).length;
            const totalTime = Object.values(dailyTime).reduce((sum, time) => sum + time, 0);
            const averageDaily = totalDays > 0 ? totalTime / totalDays : 0;

            timeAnalysis.push({
                studentId: student.studentInfo.id,
                studentName: student.studentInfo.name,
                totalTime: totalTime,
                averageDaily: Math.round(averageDaily / 1000), // 转换为秒
                activeDays: totalDays,
                dailyTime: dailyTime
            });
        });

        return timeAnalysis.sort((a, b) => b.totalTime - a.totalTime);
    }
};

console.log('📊 学生反馈分析模块已加载'); 