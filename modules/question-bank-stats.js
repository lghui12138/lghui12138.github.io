/**
 * 题库统计功能模块
 * 负责学习数据统计、进度分析等功能
 */
window.QuestionBankStats = (function() {
    // 私有变量
    let statsData = {
        totalQuestions: 0,
        completedQuestions: 0,
        correctAnswers: 0,
        totalStudyTime: 0,
        streakDays: 0,
        favoriteCount: 0,
        wrongQuestionCount: 0
    };
    
    // 公有方法
    return {
        // 初始化模块
        init: function() {
            console.log('初始化统计模块...');
            this.updateStats();
            return this;
        },
        
        // 更新统计数据
        updateStats: function() {
            this.collectStatsData();
            this.updateStatsDisplay();
            this.updateProgressIndicators();
        },
        
        // 收集统计数据
        collectStatsData: function() {
            // 从题库数据模块获取题库信息
            if (typeof QuestionBankData !== 'undefined') {
                const allBanks = QuestionBankData.getAllBanks();
                statsData.totalQuestions = allBanks.reduce((sum, bank) => sum + bank.questionCount, 0);
            }
            
            // 从用户数据模块获取用户统计
            if (typeof QuestionBankUser !== 'undefined') {
                const userStats = QuestionBankUser.getStats();
                statsData.completedQuestions = userStats.totalQuestions || 0;
                statsData.correctAnswers = userStats.correctAnswers || 0;
                statsData.totalStudyTime = userStats.totalStudyTime || 0;
                statsData.streakDays = userStats.streakDays || 0;
                statsData.favoriteCount = QuestionBankUser.getFavoriteCount();
                statsData.wrongQuestionCount = QuestionBankUser.getWrongQuestionCount();
            }
        },
        
        // 更新统计显示
        updateStatsDisplay: function() {
            // 计算正确率
            const correctRate = statsData.completedQuestions > 0 
                ? Math.round((statsData.correctAnswers / statsData.completedQuestions) * 100)
                : 0;
            
            // 格式化学习时长
            const formattedTime = this.formatDuration(statsData.totalStudyTime);
            
            // 更新各个统计元素
            const statsElements = {
                'totalQuestions': statsData.totalQuestions,
                'completedQuestions': statsData.completedQuestions,
                'correctRate': correctRate + '%',
                'studyTime': formattedTime,
                'streakDays': statsData.streakDays + '天',
                'favoriteCount': statsData.favoriteCount,
                'wrongQuestionCount': statsData.wrongQuestionCount
            };
            
            Object.entries(statsElements).forEach(([id, value]) => {
                const elements = document.querySelectorAll(`#${id}`);
                elements.forEach(element => {
                    if (element) {
                        element.textContent = value;
                    }
                });
            });
        },
        
        // 更新进度指示器
        updateProgressIndicators: function() {
            const progressRate = statsData.totalQuestions > 0 
                ? (statsData.completedQuestions / statsData.totalQuestions) * 100
                : 0;
            
            const correctRate = statsData.completedQuestions > 0 
                ? (statsData.correctAnswers / statsData.completedQuestions) * 100
                : 0;
            
            // 更新进度条
            this.updateProgressBar('overallProgress', progressRate);
            this.updateProgressBar('accuracyProgress', correctRate);
        },
        
        // 更新进度条
        updateProgressBar: function(elementId, percentage) {
            const progressBar = document.getElementById(elementId);
            if (progressBar) {
                progressBar.style.width = percentage + '%';
                progressBar.setAttribute('aria-valuenow', percentage);
            }
        },
        
        // 格式化时长
        formatDuration: function(seconds) {
            if (seconds < 60) {
                return seconds + 's';
            } else if (seconds < 3600) {
                const minutes = Math.floor(seconds / 60);
                return minutes + 'm';
            } else {
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                return hours + 'h' + (minutes > 0 ? ' ' + minutes + 'm' : '');
            }
        },
        
        // 生成学习报告
        generateLearningReport: function() {
            const report = {
                basicStats: this.getBasicStats(),
                progressAnalysis: this.getProgressAnalysis(),
                strengthsAndWeaknesses: this.getStrengthsAndWeaknesses(),
                recommendations: this.getRecommendations(),
                timeAnalysis: this.getTimeAnalysis()
            };
            
            return report;
        },
        
        // 获取基本统计
        getBasicStats: function() {
            const correctRate = statsData.completedQuestions > 0 
                ? (statsData.correctAnswers / statsData.completedQuestions) * 100
                : 0;
            
            return {
                totalQuestions: statsData.totalQuestions,
                completedQuestions: statsData.completedQuestions,
                correctAnswers: statsData.correctAnswers,
                correctRate: Math.round(correctRate * 100) / 100,
                totalStudyTime: statsData.totalStudyTime,
                streakDays: statsData.streakDays,
                favoriteCount: statsData.favoriteCount,
                wrongQuestionCount: statsData.wrongQuestionCount
            };
        },
        
        // 获取进度分析
        getProgressAnalysis: function() {
            const completionRate = statsData.totalQuestions > 0 
                ? (statsData.completedQuestions / statsData.totalQuestions) * 100
                : 0;
            
            let progressLevel = '';
            if (completionRate < 20) {
                progressLevel = '入门阶段';
            } else if (completionRate < 50) {
                progressLevel = '进阶阶段';
            } else if (completionRate < 80) {
                progressLevel = '熟练阶段';
            } else {
                progressLevel = '精通阶段';
            }
            
            return {
                completionRate: Math.round(completionRate * 100) / 100,
                progressLevel: progressLevel,
                remainingQuestions: statsData.totalQuestions - statsData.completedQuestions
            };
        },
        
        // 获取优势和劣势分析
        getStrengthsAndWeaknesses: function() {
            const correctRate = statsData.completedQuestions > 0 
                ? (statsData.correctAnswers / statsData.completedQuestions) * 100
                : 0;
            
            const strengths = [];
            const weaknesses = [];
            
            if (correctRate >= 80) {
                strengths.push('答题准确率很高');
            } else if (correctRate < 60) {
                weaknesses.push('答题准确率需要提升');
            }
            
            if (statsData.streakDays >= 7) {
                strengths.push('学习习惯很好，坚持连续学习');
            } else if (statsData.streakDays < 3) {
                weaknesses.push('需要培养持续学习的习惯');
            }
            
            if (statsData.wrongQuestionCount > statsData.completedQuestions * 0.3) {
                weaknesses.push('错题较多，需要重点复习');
            }
            
            if (statsData.favoriteCount > 3) {
                strengths.push('善于收藏重点题库');
            }
            
            return {
                strengths: strengths,
                weaknesses: weaknesses
            };
        },
        
        // 获取学习建议
        getRecommendations: function() {
            const recommendations = [];
            const correctRate = statsData.completedQuestions > 0 
                ? (statsData.correctAnswers / statsData.completedQuestions) * 100
                : 0;
            
            if (correctRate < 70) {
                recommendations.push('建议重新复习基础知识点');
                recommendations.push('多练习错题，加强薄弱环节');
            }
            
            if (statsData.streakDays < 5) {
                recommendations.push('建议制定每日学习计划，培养学习习惯');
            }
            
            if (statsData.wrongQuestionCount > 10) {
                recommendations.push('建议重点练习错题本中的题目');
            }
            
            if (statsData.completedQuestions < statsData.totalQuestions * 0.5) {
                recommendations.push('建议增加练习量，完成更多题目');
            }
            
            if (recommendations.length === 0) {
                recommendations.push('继续保持良好的学习状态！');
            }
            
            return recommendations;
        },
        
        // 获取时间分析
        getTimeAnalysis: function() {
            const avgTimePerQuestion = statsData.completedQuestions > 0 
                ? statsData.totalStudyTime / statsData.completedQuestions
                : 0;
            
            const dailyAvgTime = statsData.streakDays > 0 
                ? statsData.totalStudyTime / statsData.streakDays
                : 0;
            
            return {
                totalStudyTime: statsData.totalStudyTime,
                avgTimePerQuestion: Math.round(avgTimePerQuestion * 100) / 100,
                dailyAvgTime: Math.round(dailyAvgTime * 100) / 100,
                formattedTotalTime: this.formatDuration(statsData.totalStudyTime),
                formattedAvgPerQuestion: this.formatDuration(avgTimePerQuestion),
                formattedDailyAvg: this.formatDuration(dailyAvgTime)
            };
        },
        
        // 显示详细报告
        showDetailedReport: function() {
            const report = this.generateLearningReport();
            
            const content = `
                <div style="max-height: 500px; overflow-y: auto;">
                    <h4>📊 学习统计报告</h4>
                    
                    <div style="margin: 20px 0;">
                        <h5>📈 基本统计</h5>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <p><strong>题库总数：</strong>${report.basicStats.totalQuestions} 题</p>
                            <p><strong>已完成：</strong>${report.basicStats.completedQuestions} 题</p>
                            <p><strong>正确率：</strong>${report.basicStats.correctRate}%</p>
                            <p><strong>学习时长：</strong>${this.formatDuration(report.basicStats.totalStudyTime)}</p>
                            <p><strong>连续学习：</strong>${report.basicStats.streakDays} 天</p>
                        </div>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h5>🎯 进度分析</h5>
                        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <p><strong>完成进度：</strong>${report.progressAnalysis.completionRate}%</p>
                            <p><strong>当前阶段：</strong>${report.progressAnalysis.progressLevel}</p>
                            <p><strong>剩余题目：</strong>${report.progressAnalysis.remainingQuestions} 题</p>
                        </div>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h5>💪 优势分析</h5>
                        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            ${report.strengthsAndWeaknesses.strengths.length > 0 
                                ? report.strengthsAndWeaknesses.strengths.map(s => `<p>✅ ${s}</p>`).join('')
                                : '<p>继续努力，发现更多优势！</p>'}
                        </div>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h5>⚠️ 需要改进</h5>
                        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            ${report.strengthsAndWeaknesses.weaknesses.length > 0 
                                ? report.strengthsAndWeaknesses.weaknesses.map(w => `<p>⚡ ${w}</p>`).join('')
                                : '<p>表现优秀，继续保持！</p>'}
                        </div>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h5>🎓 学习建议</h5>
                        <div style="background: #f0f4ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            ${report.recommendations.map(r => `<p>💡 ${r}</p>`).join('')}
                        </div>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h5>⏱️ 时间分析</h5>
                        <div style="background: #fafafa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <p><strong>总学习时间：</strong>${report.timeAnalysis.formattedTotalTime}</p>
                            <p><strong>平均每题用时：</strong>${report.timeAnalysis.formattedAvgPerQuestion}</p>
                            <p><strong>日均学习时间：</strong>${report.timeAnalysis.formattedDailyAvg}</p>
                        </div>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '学习统计报告',
                    content: content,
                    size: 'large'
                });
            } else {
                showNotification('统计报告功能需要UI模块支持', 'warning');
            }
        },
        
        // 导出统计数据
        exportStats: function() {
            const report = this.generateLearningReport();
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                learningReport: report,
                rawStats: statsData
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
                type: 'application/json' 
            });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `learning-stats-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('统计数据导出完成', 'success');
        },
        
        // 获取学习趋势数据
        getLearningTrend: function(days = 7) {
            if (typeof QuestionBankUser === 'undefined') {
                return [];
            }
            
            const history = QuestionBankUser.getStudyHistory(50);
            const trendData = [];
            
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                const dayStats = history.filter(session => {
                    const sessionDate = new Date(session.endTime).toISOString().split('T')[0];
                    return sessionDate === dateStr;
                });
                
                const totalQuestions = dayStats.reduce((sum, session) => sum + session.questionsAnswered, 0);
                const correctAnswers = dayStats.reduce((sum, session) => sum + session.correctAnswers, 0);
                const studyTime = dayStats.reduce((sum, session) => sum + session.duration, 0);
                
                trendData.push({
                    date: dateStr,
                    questionsAnswered: totalQuestions,
                    correctAnswers: correctAnswers,
                    correctRate: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
                    studyTime: studyTime
                });
            }
            
            return trendData;
        },
        
        // 显示学习趋势
        showLearningTrend: function() {
            const trendData = this.getLearningTrend(7);
            
            const content = `
                <div>
                    <h4>📈 7天学习趋势</h4>
                    <div style="margin: 20px 0; max-height: 400px; overflow-y: auto;">
                        ${trendData.map(day => `
                            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                                <div style="font-weight: bold; margin-bottom: 8px;">
                                    ${new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
                                </div>
                                <div style="font-size: 0.9em; color: #666;">
                                    <p>📝 答题数量: ${day.questionsAnswered}</p>
                                    <p>✅ 正确率: ${Math.round(day.correctRate)}%</p>
                                    <p>⏱️ 学习时长: ${this.formatDuration(day.studyTime)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="text-align: center; margin-top: 15px;">
                        <button class="btn btn-primary" onclick="QuestionBankStats.exportStats()">
                            导出统计数据
                        </button>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '学习趋势',
                    content: content,
                    size: 'medium'
                });
            } else {
                showNotification('学习趋势功能需要UI模块支持', 'warning');
            }
        },
        
        // 获取当前统计数据
        getStatsData: function() {
            return { ...statsData };
        },
        
        // 计算学习效率
        calculateEfficiency: function() {
            if (statsData.totalStudyTime === 0 || statsData.completedQuestions === 0) {
                return 0;
            }
            
            const questionsPerMinute = statsData.completedQuestions / (statsData.totalStudyTime / 60);
            const correctRate = (statsData.correctAnswers / statsData.completedQuestions) * 100;
            
            // 综合效率 = 速度 * 准确率
            return questionsPerMinute * (correctRate / 100);
        },
        
        // 获取成就信息
        getAchievements: function() {
            const achievements = [];
            
            if (statsData.streakDays >= 7) {
                achievements.push({ name: '坚持一周', icon: '🔥', description: '连续学习7天' });
            }
            if (statsData.streakDays >= 30) {
                achievements.push({ name: '学霸', icon: '🏆', description: '连续学习30天' });
            }
            if (statsData.completedQuestions >= 100) {
                achievements.push({ name: '百题达人', icon: '💯', description: '完成100道题目' });
            }
            if (statsData.completedQuestions >= 500) {
                achievements.push({ name: '题库专家', icon: '🎓', description: '完成500道题目' });
            }
            
            const correctRate = statsData.completedQuestions > 0 
                ? (statsData.correctAnswers / statsData.completedQuestions) * 100
                : 0;
            
            if (correctRate >= 90 && statsData.completedQuestions >= 50) {
                achievements.push({ name: '精准射手', icon: '🎯', description: '正确率达到90%' });
            }
            
            if (statsData.favoriteCount >= 10) {
                achievements.push({ name: '收藏家', icon: '⭐', description: '收藏10个题库' });
            }
            
            return achievements;
        }
    };
})(); 