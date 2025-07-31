// 🎓 教师组件库 - Vue 3 组件集合
// 提供教师管理面板所需的各种组件

window.TeacherComponents = {
    // 题目管理器组件
    QuestionManager: {
        props: ['questions', 'selectedBank'],
        emits: ['add-question', 'edit-question', 'delete-question', 'refresh'],
        data() {
            return {
                searchQuery: '',
                selectedDifficulty: '',
                selectedCategory: '',
                sortBy: 'id',
                sortOrder: 'asc',
                selectedQuestions: [],
                showAddModal: false,
                newQuestion: {
                    title: '',
                    content: '',
                    options: ['', '', '', ''],
                    answer: 0,
                    explanation: '',
                    difficulty: 'medium',
                    category: '',
                    knowledgePoints: []
                }
            };
        },
        computed: {
            filteredQuestions() {
                let filtered = this.questions || [];
                
                if (this.searchQuery) {
                    filtered = filtered.filter(q => 
                        q.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        (q.content && q.content.toLowerCase().includes(this.searchQuery.toLowerCase()))
                    );
                }
                
                if (this.selectedDifficulty) {
                    filtered = filtered.filter(q => q.difficulty === this.selectedDifficulty);
                }
                
                if (this.selectedCategory) {
                    filtered = filtered.filter(q => q.category === this.selectedCategory);
                }
                
                // 排序
                filtered.sort((a, b) => {
                    let aValue = a[this.sortBy];
                    let bValue = b[this.sortBy];
                    
                    if (typeof aValue === 'string') {
                        aValue = aValue.toLowerCase();
                        bValue = bValue.toLowerCase();
                    }
                    
                    if (this.sortOrder === 'asc') {
                        return aValue > bValue ? 1 : -1;
                    } else {
                        return aValue < bValue ? 1 : -1;
                    }
                });
                
                return filtered;
            },
            categories() {
                const cats = [...new Set(this.questions.map(q => q.category).filter(Boolean))];
                return cats;
            }
        },
        template: `
            <div class="question-manager">
                <div class="manager-header">
                    <h3><i class="fas fa-tasks"></i> 题目管理</h3>
                    <div class="header-actions">
                        <button @click="showAddModal = true" class="action-btn btn-success">
                            <i class="fas fa-plus"></i> 添加题目
                        </button>
                        <button @click="$emit('refresh')" class="action-btn">
                            <i class="fas fa-sync"></i> 刷新
                        </button>
                    </div>
                </div>

                <div class="filters-section">
                    <div class="filter-group">
                        <input v-model="searchQuery" placeholder="搜索题目..." class="search-input">
                        <select v-model="selectedDifficulty" class="filter-select">
                            <option value="">全部难度</option>
                            <option value="easy">简单</option>
                            <option value="medium">中等</option>
                            <option value="hard">困难</option>
                        </select>
                        <select v-model="selectedCategory" class="filter-select">
                            <option value="">全部分类</option>
                            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                        <select v-model="sortBy" class="filter-select">
                            <option value="id">按ID排序</option>
                            <option value="title">按标题排序</option>
                            <option value="difficulty">按难度排序</option>
                            <option value="category">按分类排序</option>
                        </select>
                        <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="sort-btn">
                            <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                        </button>
                    </div>
                </div>

                <div class="questions-list">
                    <div v-if="filteredQuestions.length === 0" class="no-questions">
                        <i class="fas fa-inbox"></i>
                        <p>暂无题目</p>
                </div>
                    <div v-for="question in filteredQuestions" :key="question.id" class="question-item">
                        <div class="question-header">
                                    <input type="checkbox" :value="question.id" v-model="selectedQuestions">
                            <span class="question-id">#{question.id}</span>
                            <span :class="['difficulty-badge', question.difficulty]">{{ getDifficultyText(question.difficulty) }}</span>
                            <span class="category-badge">{{ question.category }}</span>
                        </div>
                        <div class="question-content">
                            <h4>{{ question.title }}</h4>
                            <p v-if="question.content">{{ question.content }}</p>
                        </div>
                        <div class="question-actions">
                            <button @click="editQuestion(question)" class="action-btn btn-primary">
                                <i class="fas fa-edit"></i> 编辑
                                        </button>
                            <button @click="deleteQuestion(question.id)" class="action-btn btn-danger">
                                <i class="fas fa-trash"></i> 删除
                                        </button>
                                    </div>
                    </div>
                </div>

                <div v-if="selectedQuestions.length > 0" class="batch-actions">
                    <span>已选择 {{ selectedQuestions.length }} 个题目</span>
                    <button @click="batchDelete" class="action-btn btn-danger">
                        <i class="fas fa-trash-alt"></i> 批量删除
                    </button>
                    <button @click="clearSelection" class="action-btn">清空选择</button>
                </div>
            </div>
        `,
        methods: {
            getDifficultyText(difficulty) {
                const map = { easy: '简单', medium: '中等', hard: '困难' };
                return map[difficulty] || '中等';
            },
            editQuestion(question) {
                this.$emit('edit-question', question);
            },
            deleteQuestion(id) {
                if (confirm('确定要删除这个题目吗？')) {
                    this.$emit('delete-question', id);
                }
            },
            clearSelection() {
                this.selectedQuestions = [];
            },
            batchDelete() {
                if (confirm(`确定要删除选中的 ${this.selectedQuestions.length} 个题目吗？`)) {
                    this.selectedQuestions.forEach(id => {
                        this.$emit('delete-question', id);
                    });
                    this.clearSelection();
                }
            }
        }
    },

    // 学生反馈查看器组件
    StudentFeedbackViewer: {
        props: ['feedbacks', 'students'],
        emits: ['refresh'],
        data() {
            return {
                activeTab: 'realtime',
                selectedTimeRange: 'week',
                searchStudent: '',
                selectedStudent: null
            };
        },
        template: `
            <div class="feedback-viewer">
                <div class="viewer-header">
                    <h3><i class="fas fa-chart-line"></i> 学生反馈分析</h3>
                    <div class="header-actions">
                        <button @click="$emit('refresh')" class="action-btn">
                            <i class="fas fa-sync"></i> 刷新数据
                        </button>
                    </div>
                </div>

                <div class="feedback-tabs">
                    <button @click="activeTab = 'realtime'" :class="['tab-btn', {active: activeTab === 'realtime'}]">
                        实时统计
                    </button>
                    <button @click="activeTab = 'students'" :class="['tab-btn', {active: activeTab === 'students'}]">
                        学生进度
                    </button>
                    <button @click="activeTab = 'analytics'" :class="['tab-btn', {active: activeTab === 'analytics'}]">
                        数据分析
                    </button>
                </div>

                <div v-if="activeTab === 'realtime'" class="realtime-stats">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <i class="fas fa-users"></i>
                            <div class="stat-value">{{ students.length }}</div>
                                <div class="stat-label">总学生数</div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-clock"></i>
                            <div class="stat-value">{{ feedbacks.length }}</div>
                            <div class="stat-label">反馈总数</div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },

    // 题库管理器组件
    BankManager: {
        props: ['banks'],
        emits: ['create-bank', 'edit-bank', 'delete-bank', 'select-bank'],
        data() {
            return {
                searchQuery: '',
                showCreateModal: false,
                newBank: {
                    name: '',
                    description: '',
                    category: 'custom'
                }
            };
        },
        computed: {
            filteredBanks() {
                if (!this.searchQuery) return this.banks || [];
                return this.banks.filter(bank => 
                    bank.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    (bank.description && bank.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
                );
            }
        },
        template: `
            <div class="bank-manager">
                <div class="manager-header">
                    <h3><i class="fas fa-database"></i> 题库管理</h3>
                    <button @click="showCreateModal = true" class="action-btn btn-success">
                        <i class="fas fa-plus"></i> 创建题库
                                    </button>
                                </div>
                                
                <div class="search-section">
                    <input v-model="searchQuery" placeholder="搜索题库..." class="search-input">
                        </div>

                <div class="banks-grid">
                    <div v-for="bank in filteredBanks" :key="bank.id" 
                         @click="$emit('select-bank', bank)"
                         class="bank-card">
                        <div class="bank-header">
                            <h4>{{ bank.name }}</h4>
                            <span class="question-count">{{ bank.questionCount || 0 }}题</span>
                        </div>
                        <p class="bank-description">{{ bank.description }}</p>
                        <div class="bank-actions" @click.stop>
                            <button @click="editBank(bank)" class="action-btn btn-primary">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button @click="deleteBank(bank.id)" class="action-btn btn-danger">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        methods: {
            editBank(bank) {
                this.$emit('edit-bank', bank);
            },
            deleteBank(id) {
                if (confirm('确定要删除这个题库吗？')) {
                    this.$emit('delete-bank', id);
                }
            }
        }
    }
};

console.log('👨‍🏫 教师组件库已加载'); 