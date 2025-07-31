// 教师管理Vue组件模块
window.TeacherComponents = {
    // 题目管理器组件
    QuestionManager: {
        props: ['questions', 'banks'],
        emits: ['add-question', 'edit-question', 'delete-question', 'refresh'],
        data() {
            return {
                searchQuery: '',
                selectedCategory: '',
                selectedDifficulty: '',
                selectedQuestions: [],
                currentPage: 1,
                pageSize: 10,
                showBatchActions: false
            };
        },
        computed: {
            filteredQuestions() {
                return this.questions.filter(q => {
                    if (this.searchQuery && !q.title.toLowerCase().includes(this.searchQuery.toLowerCase())) {
                        return false;
                    }
                    if (this.selectedCategory && q.category !== this.selectedCategory) {
                        return false;
                    }
                    if (this.selectedDifficulty && q.difficulty !== this.selectedDifficulty) {
                        return false;
                    }
                    return true;
                });
            },
            paginatedQuestions() {
                const start = (this.currentPage - 1) * this.pageSize;
                return this.filteredQuestions.slice(start, start + this.pageSize);
            },
            totalPages() {
                return Math.ceil(this.filteredQuestions.length / this.pageSize);
            },
            allCategories() {
                return [...new Set(this.questions.map(q => q.category))];
            }
        },
        template: `
            <div class="question-manager">
                <div class="manager-header">
                    <h3><i class="fas fa-question-circle"></i> 题目管理</h3>
                    <div class="header-actions">
                        <button @click="$emit('refresh')" class="action-btn">
                            <i class="fas fa-sync"></i> 刷新
                        </button>
                        <button @click="$emit('add-question')" class="action-btn btn-primary">
                            <i class="fas fa-plus"></i> 添加题目
                        </button>
                        <button @click="exportQuestions" class="action-btn btn-success">
                            <i class="fas fa-download"></i> 导出题目
                        </button>
                        <input type="file" @change="importQuestions" accept=".json" ref="importInput" style="display: none;">
                        <button @click="$refs.importInput.click()" class="action-btn btn-warning">
                            <i class="fas fa-upload"></i> 导入题目
                        </button>
                    </div>
                </div>

                <!-- 搜索和筛选 -->
                <div class="search-filters">
                    <div class="search-bar">
                        <input v-model="searchQuery" type="text" placeholder="搜索题目标题..." class="form-input">
                    </div>
                    <div class="filter-controls">
                        <select v-model="selectedCategory" class="form-select">
                            <option value="">全部分类</option>
                            <option v-for="category in allCategories" :key="category" :value="category">
                                {{ category }}
                            </option>
                        </select>
                        <select v-model="selectedDifficulty" class="form-select">
                            <option value="">全部难度</option>
                            <option value="easy">简单</option>
                            <option value="medium">中等</option>
                            <option value="hard">困难</option>
                        </select>
                    </div>
                </div>

                <!-- 批量操作 -->
                <div v-if="selectedQuestions.length > 0" class="batch-actions">
                    <span>已选择 {{ selectedQuestions.length }} 个题目</span>
                    <button @click="batchDelete" class="action-btn btn-danger btn-small">
                        <i class="fas fa-trash"></i> 批量删除
                    </button>
                    <button @click="clearSelection" class="action-btn btn-small">
                        <i class="fas fa-times"></i> 清除选择
                    </button>
                </div>

                <!-- 题目表格 -->
                <div class="table-container">
                    <table class="question-table">
                        <thead>
                            <tr>
                                <th width="40">
                                    <input type="checkbox" @change="toggleAllSelection" 
                                           :checked="allSelected" :indeterminate="someSelected">
                                </th>
                                <th>题目标题</th>
                                <th>分类</th>
                                <th>难度</th>
                                <th>题库</th>
                                <th>创建时间</th>
                                <th width="200">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="question in paginatedQuestions" :key="question.id">
                                <td>
                                    <input type="checkbox" :value="question.id" v-model="selectedQuestions">
                                </td>
                                <td class="question-title-cell">
                                    <div class="question-title">{{ question.title }}</div>
                                    <div class="question-preview">{{ question.content || '无描述' }}</div>
                                </td>
                                <td>
                                    <span class="category-tag">{{ question.category }}</span>
                                </td>
                                <td>
                                    <span :class="['difficulty-badge', \`difficulty-\${question.difficulty}\`]">
                                        {{ getDifficultyText(question.difficulty) }}
                                    </span>
                                </td>
                                <td>{{ question.bank || '自定义' }}</td>
                                <td>{{ formatDate(question.createdAt) }}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button @click="$emit('edit-question', question)" 
                                                class="action-btn btn-primary btn-small">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button @click="duplicateQuestion(question)" 
                                                class="action-btn btn-success btn-small">
                                            <i class="fas fa-copy"></i>
                                        </button>
                                        <button @click="$emit('delete-question', question.id)" 
                                                class="action-btn btn-danger btn-small">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 分页 -->
                <div v-if="totalPages > 1" class="pagination">
                    <button @click="currentPage = 1" :disabled="currentPage === 1" class="page-btn">
                        <i class="fas fa-angle-double-left"></i>
                    </button>
                    <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
                        <i class="fas fa-angle-left"></i>
                    </button>
                    <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
                    <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
                        <i class="fas fa-angle-right"></i>
                    </button>
                    <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="page-btn">
                        <i class="fas fa-angle-double-right"></i>
                    </button>
                </div>
            </div>
        `,
        computed: {
            allSelected() {
                return this.paginatedQuestions.length > 0 && 
                       this.selectedQuestions.length === this.paginatedQuestions.length;
            },
            someSelected() {
                return this.selectedQuestions.length > 0 && 
                       this.selectedQuestions.length < this.paginatedQuestions.length;
            }
        },
        methods: {
            getDifficultyText(difficulty) {
                return PracticeUtils.getDifficultyText(difficulty);
            },
            formatDate(dateString) {
                return PracticeUtils.formatDate(dateString);
            },
            toggleAllSelection(event) {
                if (event.target.checked) {
                    this.selectedQuestions = this.paginatedQuestions.map(q => q.id);
                } else {
                    this.selectedQuestions = [];
                }
            },
            clearSelection() {
                this.selectedQuestions = [];
            },
            batchDelete() {
                if (confirm(\`确定要删除选中的 \${this.selectedQuestions.length} 个题目吗？\`)) {
                    this.selectedQuestions.forEach(id => {
                        this.$emit('delete-question', id);
                    });
                    this.clearSelection();
                }
            },
            duplicateQuestion(question) {
                const result = QuestionEditor.duplicateQuestion(question.id);
                if (result.success) {
                    this.$emit('refresh');
                    alert('题目复制成功！');
                } else {
                    alert('复制失败: ' + result.error);
                }
            },
            exportQuestions() {
                QuestionEditor.exportQuestions(this.questions);
            },
            async importQuestions(event) {
                const file = event.target.files[0];
                if (!file) return;

                const result = await QuestionEditor.importQuestions(file);
                if (result.success) {
                    alert(\`导入成功！新增 \${result.added} 题，更新 \${result.updated} 题\`);
                    this.$emit('refresh');
                } else {
                    alert('导入失败: ' + result.error);
                }
                
                // 清空文件选择
                event.target.value = '';
            }
        }
    },

    // 学生反馈查看器组件
    StudentFeedbackViewer: {
        props: ['feedbacks', 'students'],
        emits: ['refresh'],
        data() {
            return {
                activeTab: 'realtime', // 'realtime' | 'students' | 'questions' | 'analytics'
                selectedTimeRange: 'week',
                searchStudent: '',
                selectedStudent: null
            };
        },
        computed: {
            realTimeStats() {
                return StudentFeedback.getRealTimeStats();
            },
            studentProgress() {
                return StudentFeedback.getLearningProgress();
            },
            questionErrorStats() {
                return StudentFeedback.getQuestionErrorStats().slice(0, 10);
            },
            filteredStudentProgress() {
                return this.studentProgress.filter(student => 
                    !this.searchStudent || 
                    student.studentName.toLowerCase().includes(this.searchStudent.toLowerCase())
                );
            }
        },
        template: `
            <div class="feedback-viewer">
                <div class="viewer-header">
                    <h3><i class="fas fa-chart-line"></i> 学生反馈分析</h3>
                    <div class="header-actions">
                        <button @click="$emit('refresh')" class="action-btn">
                            <i class="fas fa-sync"></i> 刷新数据
                        </button>
                        <button @click="exportData" class="action-btn btn-success">
                            <i class="fas fa-download"></i> 导出数据
                        </button>
                        <button @click="cleanupOldData" class="action-btn btn-warning">
                            <i class="fas fa-broom"></i> 清理旧数据
                        </button>
                    </div>
                </div>

                <!-- 标签页导航 -->
                <div class="tab-nav">
                    <button @click="activeTab = 'realtime'" 
                            :class="['tab-btn', { active: activeTab === 'realtime' }]">
                        <i class="fas fa-tachometer-alt"></i> 实时统计
                    </button>
                    <button @click="activeTab = 'students'" 
                            :class="['tab-btn', { active: activeTab === 'students' }]">
                        <i class="fas fa-users"></i> 学生分析
                    </button>
                    <button @click="activeTab = 'questions'" 
                            :class="['tab-btn', { active: activeTab === 'questions' }]">
                        <i class="fas fa-question-circle"></i> 题目分析
                    </button>
                    <button @click="activeTab = 'analytics'" 
                            :class="['tab-btn', { active: activeTab === 'analytics' }]">
                        <i class="fas fa-chart-pie"></i> 深度分析
                    </button>
                </div>

                <!-- 实时统计 -->
                <div v-if="activeTab === 'realtime'" class="tab-content">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-users"></i></div>
                            <div class="stat-content">
                                <div class="stat-number">{{ realTimeStats.totalStudents }}</div>
                                <div class="stat-label">总学生数</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-question-circle"></i></div>
                            <div class="stat-content">
                                <div class="stat-number">{{ realTimeStats.totalAnswers }}</div>
                                <div class="stat-label">总答题数</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                            <div class="stat-content">
                                <div class="stat-number">{{ realTimeStats.averageScore }}%</div>
                                <div class="stat-label">平均得分</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-clock"></i></div>
                            <div class="stat-content">
                                <div class="stat-number">{{ realTimeStats.todayAnswers }}</div>
                                <div class="stat-label">今日答题</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 学生分析 -->
                <div v-if="activeTab === 'students'" class="tab-content">
                    <div class="search-bar">
                        <input v-model="searchStudent" type="text" placeholder="搜索学生姓名..." class="form-input">
                    </div>
                    
                    <div class="student-list">
                        <div v-for="student in filteredStudentProgress" :key="student.studentId" 
                             class="student-card">
                            <div class="student-header">
                                <div class="student-info">
                                    <h4>{{ student.studentName }}</h4>
                                    <span class="student-id">ID: {{ student.studentId }}</span>
                                </div>
                                <div class="student-stats">
                                    <span class="correct-rate" :class="{
                                        high: student.correctRate >= 80,
                                        medium: student.correctRate >= 60 && student.correctRate < 80,
                                        low: student.correctRate < 60
                                    }">{{ student.correctRate }}%</span>
                                    <span class="progress-trend" :class="student.progressTrend">
                                        <i :class="{
                                            'fas fa-arrow-up': student.progressTrend === 'improving',
                                            'fas fa-arrow-down': student.progressTrend === 'declining',
                                            'fas fa-minus': student.progressTrend === 'stable'
                                        }"></i>
                                        {{ getTrendText(student.progressTrend) }}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="student-details">
                                <div class="detail-item">
                                    <span class="label">总答题数:</span>
                                    <span class="value">{{ student.totalAnswers }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">平均用时:</span>
                                    <span class="value">{{ student.averageTimePerQuestion }}秒</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">最后活跃:</span>
                                    <span class="value">{{ formatDate(student.lastActive) }}</span>
                                </div>
                            </div>

                            <div v-if="student.strongAreas.length > 0 || student.weakAreas.length > 0" class="areas-analysis">
                                <div v-if="student.strongAreas.length > 0" class="strong-areas">
                                    <h5><i class="fas fa-star"></i> 强项领域</h5>
                                    <div class="area-tags">
                                        <span v-for="area in student.strongAreas" :key="area.category" 
                                              class="area-tag strong">
                                            {{ area.category }} ({{ area.correctRate }}%)
                                        </span>
                                    </div>
                                </div>
                                
                                <div v-if="student.weakAreas.length > 0" class="weak-areas">
                                    <h5><i class="fas fa-exclamation-triangle"></i> 薄弱领域</h5>
                                    <div class="area-tags">
                                        <span v-for="area in student.weakAreas" :key="area.category" 
                                              class="area-tag weak">
                                            {{ area.category }} ({{ area.correctRate }}%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 题目分析 -->
                <div v-if="activeTab === 'questions'" class="tab-content">
                    <h4>高错误率题目 (Top 10)</h4>
                    <div class="question-error-list">
                        <div v-for="question in questionErrorStats" :key="question.questionId" 
                             class="error-question-item">
                            <div class="question-info">
                                <h5>{{ question.questionTitle }}</h5>
                                <div class="question-meta">
                                    <span class="bank">{{ question.questionBank }}</span>
                                    <span class="category">{{ question.category }}</span>
                                    <span :class="['difficulty', \`difficulty-\${question.difficulty}\`]">
                                        {{ getDifficultyText(question.difficulty) }}
                                    </span>
                                </div>
                            </div>
                            <div class="error-stats">
                                <div class="error-rate" :class="{
                                    high: question.errorRate >= 70,
                                    medium: question.errorRate >= 50 && question.errorRate < 70,
                                    low: question.errorRate < 50
                                }">
                                    {{ question.errorRate }}%
                                </div>
                                <div class="attempt-info">
                                    {{ question.totalAttempts }}次尝试
                                </div>
                                <div class="time-info">
                                    平均{{ Math.round(question.averageTime / 1000) }}秒
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 深度分析 -->
                <div v-if="activeTab === 'analytics'" class="tab-content">
                    <div class="analytics-section">
                        <h4>学习时间分析</h4>
                        <p>功能开发中，将提供学习时间趋势、活跃时段分析等功能...</p>
                    </div>
                </div>
            </div>
        `,
        methods: {
            formatDate(dateString) {
                return PracticeUtils.formatDate(dateString);
            },
            getDifficultyText(difficulty) {
                return PracticeUtils.getDifficultyText(difficulty);
            },
            getTrendText(trend) {
                const trendMap = {
                    improving: '进步中',
                    declining: '下降中',
                    stable: '稳定'
                };
                return trendMap[trend] || '稳定';
            },
            exportData() {
                StudentFeedback.exportFeedbackData('json');
            },
            cleanupOldData() {
                if (confirm('确定要清理30天前的数据吗？此操作不可撤销。')) {
                    const result = StudentFeedback.cleanupOldData(30);
                    if (result.success) {
                        alert(\`清理完成！删除了 \${result.removedCount} 条记录，保留 \${result.remainingCount} 条\`);
                        this.$emit('refresh');
                    } else {
                        alert('清理失败: ' + result.error);
                    }
                }
            }
        }
    },

    // 题目编辑器模态框组件
    QuestionEditorModal: {
        props: ['question', 'banks'],
        emits: ['save', 'close'],
        data() {
            return {
                form: this.getInitialForm(),
                showTemplates: false,
                autoSave: null
            };
        },
        computed: {
            isValid() {
                const validation = QuestionEditor.validateQuestion(this.form);
                return validation.isValid;
            }
        },
        template: `
            <div class="modal-overlay" @click.self="$emit('close')">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">
                            {{ question ? '编辑题目' : '添加题目' }}
                        </h3>
                        <button @click="$emit('close')" class="modal-close">×</button>
                    </div>

                    <div class="modal-body">
                        <!-- 题目基本信息 -->
                        <div class="form-group">
                            <label class="form-label">题目标题 *</label>
                            <input v-model="form.title" type="text" class="form-input" 
                                   placeholder="请输入题目标题...">
                        </div>

                        <div class="form-group">
                            <label class="form-label">题目内容</label>
                            <textarea v-model="form.content" class="form-textarea" 
                                      placeholder="请输入题目的详细描述（可选）..."></textarea>
                        </div>

                        <!-- 选项编辑器 -->
                        <div class="form-group">
                            <label class="form-label">选项设置 *</label>
                            <div class="options-editor">
                                <div v-for="(option, index) in form.options" :key="index" class="option-item">
                                    <div class="option-letter">{{ String.fromCharCode(65 + index) }}</div>
                                    <input v-model="form.options[index]" type="text" class="form-input option-input"
                                           :placeholder="\`选项 \${String.fromCharCode(65 + index)}\`">
                                    <button v-if="form.options.length > 2" @click="removeOption(index)" 
                                            class="action-btn btn-danger btn-small">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                </div>
                                
                                <button @click="addOption" class="action-btn btn-success btn-small">
                                    <i class="fas fa-plus"></i> 添加选项
                                </button>

                                <div class="correct-answer-selector">
                                    <label class="form-label">正确答案:</label>
                                    <select v-model="form.answer" class="form-select">
                                        <option v-for="(option, index) in form.options" :key="index" :value="index">
                                            {{ String.fromCharCode(65 + index) }}. {{ option || '(未填写)' }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- 题目属性 -->
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">分类 *</label>
                                <select v-model="form.category" class="form-select">
                                    <option value="真题">历年真题</option>
                                    <option value="分类">分类练习</option>
                                    <option value="易错">易错题集</option>
                                    <option value="自定义">自定义</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">难度</label>
                                <select v-model="form.difficulty" class="form-select">
                                    <option value="easy">简单</option>
                                    <option value="medium">中等</option>
                                    <option value="hard">困难</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">年份</label>
                                <input v-model="form.year" type="text" class="form-input" 
                                       placeholder="如: 2023">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">解析</label>
                            <textarea v-model="form.explanation" class="form-textarea" 
                                      placeholder="请输入题目解析..."></textarea>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button @click="$emit('close')" class="action-btn">
                            <i class="fas fa-times"></i> 取消
                        </button>
                        <button @click="saveQuestion" :disabled="!isValid" class="action-btn btn-primary">
                            <i class="fas fa-save"></i> 保存
                        </button>
                    </div>
                </div>
            </div>
        `,
        methods: {
            getInitialForm() {
                if (this.question) {
                    return { ...this.question };
                } else {
                    return QuestionEditor.createEmptyQuestion();
                }
            },
            addOption() {
                if (this.form.options.length < 6) {
                    this.form.options.push('');
                }
            },
            removeOption(index) {
                this.form.options.splice(index, 1);
                // 调整正确答案索引
                if (this.form.answer >= this.form.options.length) {
                    this.form.answer = this.form.options.length - 1;
                }
            },
            saveQuestion() {
                const validation = QuestionEditor.validateQuestion(this.form);
                if (!validation.isValid) {
                    alert('请检查题目信息：\\n' + validation.errors.join('\\n'));
                    return;
                }

                const result = QuestionEditor.saveQuestion(this.form);
                if (result.success) {
                    this.$emit('save', result.question);
                } else {
                    alert('保存失败: ' + result.error);
                }
            }
        },
        mounted() {
            // 设置自动保存
            this.autoSave = QuestionEditor.setupAutoSave();
            this.autoSaveInterval = this.autoSave.startAutoSave(() => this.form);
        },
        beforeUnmount() {
            if (this.autoSaveInterval) {
                clearInterval(this.autoSaveInterval);
            }
        }
    }
};

console.log('👨‍🏫 教师组件模块已加载'); 