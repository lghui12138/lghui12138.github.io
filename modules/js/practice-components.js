// Vue组件模块
window.PracticeComponents = {
    // 通知组件
    NotificationComponent: {
        props: ['notification'],
        emits: ['close'],
        template: `
            <div :class="['notification', notification.type, 'show']">
                <i :class="getIconClass()"></i>
                {{ notification.message }}
                <button @click="$emit('close')" class="notification-close">×</button>
            </div>
        `,
        methods: {
            getIconClass() {
                const icons = {
                    success: 'fas fa-check-circle',
                    error: 'fas fa-exclamation-circle',
                    warning: 'fas fa-exclamation-triangle',
                    info: 'fas fa-info-circle'
                };
                return icons[this.notification.type] || icons.info;
            }
        },
        mounted() {
            // 3秒后自动关闭
            setTimeout(() => {
                this.$emit('close');
            }, 3000);
        }
    },

    // 全屏控制组件
    FullscreenControls: {
        props: ['isFullscreen'],
        emits: ['toggle-fullscreen', 'exit'],
        template: `
            <div class="fullscreen-controls">
                <button @click="$emit('toggle-fullscreen')" 
                        :class="['fullscreen-btn', { active: isFullscreen }]" 
                        :title="isFullscreen ? '退出全屏 [F11]' : '进入全屏 [F11]'">
                    <i :class="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'"></i>
                    {{ isFullscreen ? '退出全屏' : '全屏模式' }}
                </button>
                <a href="../index.html" class="exit-btn" title="退出练习 [ESC]">
                    <i class="fas fa-times"></i> 退出练习
                </a>
            </div>
        `
    },

    // 题库选择器组件
    QuestionBankSelector: {
        props: ['banks', 'filters', 'stats', 'loading'],
        emits: ['load-banks', 'start-practice', 'start-random', 'filter-change'],
        data() {
            return {
                selectedBanks: [],
                localFilters: { ...this.filters }
            };
        },
        computed: {
            filteredBanks() {
                return PracticeDataLoader.filterBanks(this.banks, this.localFilters);
            },
            availableYears() {
                const years = new Set();
                this.banks.forEach(bank => {
                    if (bank.year) years.add(bank.year);
                });
                return Array.from(years).sort((a, b) => b - a);
            }
        },
        template: `
            <div class="question-bank-selector">
                <div class="selector-header">
                    <h2 class="selector-title">📚 选择题库</h2>
                    <p class="selector-subtitle">支持按年份、分类、难度筛选，批量加载所有题库</p>
                </div>

                <!-- 统计面板 -->
                <div class="stats-panel">
                    <div class="stat-card">
                        <div class="stat-number">{{ stats.totalQuestions || 0 }}</div>
                        <div class="stat-label">总题数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{{ banks.length }}</div>
                        <div class="stat-label">可用题库</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{{ stats.answeredQuestions || 0 }}</div>
                        <div class="stat-label">已答题</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{{ stats.correctRate || 0 }}%</div>
                        <div class="stat-label">正确率</div>
                    </div>
                </div>

                <!-- 筛选区域 -->
                <div class="filter-section">
                    <div class="filter-header">
                        <i class="fas fa-filter"></i>
                        筛选条件
                    </div>
                    <div class="filter-controls">
                        <div class="filter-group">
                            <label class="filter-label">题库类型</label>
                            <select v-model="localFilters.category" @change="updateFilters" class="filter-select">
                                <option value="">全部类型</option>
                                <option value="真题">历年真题</option>
                                <option value="分类">分类练习</option>
                                <option value="易错">易错题集</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">年份</label>
                            <select v-model="localFilters.year" @change="updateFilters" class="filter-select">
                                <option value="">全部年份</option>
                                <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">难度</label>
                            <select v-model="localFilters.difficulty" @change="updateFilters" class="filter-select">
                                <option value="">全部难度</option>
                                <option value="easy">简单</option>
                                <option value="medium">中等</option>
                                <option value="hard">困难</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">搜索关键词</label>
                            <input v-model="localFilters.keyword" @input="updateFilters" 
                                   class="filter-input" placeholder="搜索题库名称或内容...">
                        </div>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="action-buttons">
                    <button @click="$emit('load-banks')" class="action-btn" :disabled="loading">
                        <i class="fas fa-download"></i> 批量加载所有题库
                    </button>
                    <button @click="$emit('start-random')" class="action-btn btn-success" 
                            :disabled="stats.totalQuestions === 0">
                        <i class="fas fa-random"></i> 随机练习模式
                    </button>
                    <button @click="openTeacherPanel" class="action-btn btn-warning">
                        <i class="fas fa-chalkboard-teacher"></i> 教师管理
                    </button>
                </div>

                <!-- 题库列表 -->
                <div v-if="filteredBanks.length > 0" class="question-bank-list">
                    <div v-for="bank in filteredBanks" :key="bank.id"
                         :class="['bank-item', { selected: selectedBanks.includes(bank.id) }]"
                         @click="toggleBankSelection(bank.id)">
                        <div class="bank-info">
                            <div class="bank-name">{{ bank.name }}</div>
                            <div class="bank-meta">
                                <span><i class="fas fa-question-circle"></i> {{ bank.questionCount || 0 }} 题</span>
                                <span><i class="fas fa-tag"></i> {{ bank.category || '未分类' }}</span>
                                <span v-if="bank.year"><i class="fas fa-calendar"></i> {{ bank.year }}</span>
                                <span><i class="fas fa-signal"></i> {{ getDifficultyText(bank.difficulty) }}</span>
                            </div>
                        </div>
                        <div class="bank-actions" @click.stop>
                            <button @click="startBankPractice(bank.id)" class="bank-btn primary">
                                <i class="fas fa-play"></i> 开始练习
                            </button>
                            <button @click="previewBank(bank.id)" class="bank-btn secondary">
                                <i class="fas fa-eye"></i> 预览
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else-if="!loading" class="question-bank-list" style="text-align: center; color: #666;">
                    <i class="fas fa-search" style="font-size: 3em; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>没有找到匹配的题库</h3>
                    <p>请调整筛选条件或加载题库数据</p>
                </div>

                <!-- 选中题库操作 -->
                <div v-if="selectedBanks.length > 0" class="action-buttons" style="margin-top: 20px;">
                    <button @click="startSelectedBanksPractice" class="action-btn btn-success">
                        <i class="fas fa-play"></i> 开始练习选中题库 ({{ selectedBanks.length }}个)
                    </button>
                    <button @click="clearSelection" class="action-btn">
                        <i class="fas fa-times"></i> 清除选择
                    </button>
                </div>
            </div>
        `,
        methods: {
            toggleBankSelection(bankId) {
                const index = this.selectedBanks.indexOf(bankId);
                if (index > -1) {
                    this.selectedBanks.splice(index, 1);
                } else {
                    this.selectedBanks.push(bankId);
                }
            },
            clearSelection() {
                this.selectedBanks = [];
            },
            startBankPractice(bankId) {
                this.$emit('start-practice', { type: 'single', bankId });
            },
            startSelectedBanksPractice() {
                this.$emit('start-practice', { type: 'multiple', bankIds: this.selectedBanks });
            },
            previewBank(bankId) {
                const bank = this.banks.find(b => b.id === bankId);
                if (bank) {
                    alert(`${bank.name}: ${bank.description} (${bank.questionCount}题)`);
                }
            },
            getDifficultyText(difficulty) {
                return PracticeUtils.getDifficultyText(difficulty);
            },
            updateFilters() {
                this.$emit('filter-change', this.localFilters);
            },
            openTeacherPanel() {
                // 跳转到教师管理页面
                window.location.href = 'teacher-panel.html';
            }
        },
        watch: {
            filters: {
                handler(newFilters) {
                    this.localFilters = { ...newFilters };
                },
                deep: true
            }
        }
    },

    // 练习界面组件
    PracticeInterface: {
        props: ['question', 'stats', 'progress'],
        emits: ['submit', 'navigate', 'back', 'save'],
        data() {
            return {
                selectedAnswer: null,
                showResult: false,
                isCorrect: false
            };
        },
        template: `
            <div>
                <!-- 练习统计 -->
                <div class="practice-stats">
                    <div class="stat-item">
                        <div class="stat-value">{{ progress.currentIndex + 1 }}</div>
                        <div class="stat-label">当前题目</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{{ stats.totalQuestions }}</div>
                        <div class="stat-label">总题目数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{{ stats.correctAnswers }}</div>
                        <div class="stat-label">正确题数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{{ Math.round((stats.correctAnswers / Math.max(stats.answeredQuestions, 1)) * 100) }}%</div>
                        <div class="stat-label">正确率</div>
                    </div>
                </div>

                <!-- 题目卡片 -->
                <div v-if="question" class="question-card">
                    <div class="question-header">
                        <div class="question-number">
                            第 {{ progress.currentIndex + 1 }} 题
                            <span v-if="question.bank" style="font-size: 0.8em; opacity: 0.8;">
                                ({{ question.bank }})
                            </span>
                        </div>
                        <div :class="['question-difficulty', `difficulty-${question.difficulty || 'medium'}`]">
                            {{ getDifficultyText(question.difficulty) }}
                        </div>
                    </div>

                    <div class="question-title">{{ question.title }}</div>
                    <div class="question-content" v-if="question.content" v-html="question.content"></div>

                    <!-- 选项列表 -->
                    <ul class="options-list" v-if="question.options">
                        <li v-for="(option, index) in question.options" :key="index" class="option-item">
                            <label :class="[
                                'option-label', 
                                { 
                                    selected: selectedAnswer === index,
                                    correct: showResult && index === question.answer,
                                    incorrect: showResult && selectedAnswer === index && selectedAnswer !== question.answer
                                }
                            ]" @click="selectOption(index)">
                                <div class="option-letter">{{ String.fromCharCode(65 + index) }}</div>
                                {{ option }}
                            </label>
                        </li>
                    </ul>

                    <!-- 操作按钮 -->
                    <div class="action-buttons">
                        <button @click="submitAnswer" class="action-btn" 
                                :disabled="selectedAnswer === null || showResult">
                            <i class="fas fa-check"></i> 提交答案
                        </button>
                        <button @click="$emit('save')" class="action-btn btn-warning">
                            <i class="fas fa-save"></i> 保存进度
                        </button>
                        <button @click="$emit('back')" class="action-btn">
                            <i class="fas fa-arrow-left"></i> 返回题库选择
                        </button>
                    </div>

                    <!-- 导航按钮 -->
                    <div style="display: flex; gap: 15px; margin-top: 20px;">
                        <button @click="previousQuestion" class="action-btn" 
                                :disabled="progress.currentIndex === 0" style="flex: 1;">
                            <i class="fas fa-arrow-left"></i> 上一题
                        </button>
                        <button @click="nextQuestion" class="action-btn" 
                                :disabled="progress.currentIndex === stats.totalQuestions - 1" style="flex: 1;">
                            下一题 <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>

                    <!-- 答题结果 -->
                    <div v-if="showResult" :class="['result-display', isCorrect ? 'result-correct' : 'result-incorrect']">
                        <div>
                            <i :class="['result-icon', isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle']"></i>
                            <strong>{{ isCorrect ? '回答正确！' : '回答错误！' }}</strong>
                            <span v-if="!isCorrect && question.options">
                                正确答案是：{{ String.fromCharCode(65 + question.answer) }}. {{ question.options[question.answer] }}
                            </span>
                        </div>
                        <div v-if="question.explanation" class="explanation">
                            <strong>📖 解析：</strong>{{ question.explanation }}
                        </div>
                    </div>
                </div>

                <!-- 练习完成 -->
                <div v-else class="question-card" style="text-align: center; padding: 60px;">
                    <i class="fas fa-graduation-cap" style="font-size: 4em; color: #ccc; margin-bottom: 20px;"></i>
                    <h3>练习完成！</h3>
                    <p style="margin: 20px 0;">
                        总计 {{ stats.totalQuestions }} 题，正确 {{ stats.correctAnswers }} 题，
                        正确率 {{ Math.round((stats.correctAnswers / Math.max(stats.totalQuestions, 1)) * 100) }}%
                    </p>
                    <button @click="$emit('back')" class="action-btn btn-success">
                        <i class="fas fa-redo"></i> 重新选择题库
                    </button>
                </div>
            </div>
        `,
        methods: {
            selectOption(index) {
                if (this.showResult) return;
                this.selectedAnswer = index;
            },
            submitAnswer() {
                if (this.selectedAnswer === null) return;
                
                this.isCorrect = this.selectedAnswer === this.question.answer;
                this.showResult = true;
                
                this.$emit('submit', {
                    questionId: this.question.id,
                    selectedAnswer: this.selectedAnswer,
                    isCorrect: this.isCorrect,
                    timeSpent: Date.now() - this.startTime
                });

                // 3秒后自动下一题
                setTimeout(() => {
                    if (this.showResult && this.progress.currentIndex < this.stats.totalQuestions - 1) {
                        this.nextQuestion();
                    }
                }, 3000);
            },
            nextQuestion() {
                this.resetQuestion();
                this.$emit('navigate', 'next');
            },
            previousQuestion() {
                this.resetQuestion();
                this.$emit('navigate', 'previous');
            },
            resetQuestion() {
                this.selectedAnswer = null;
                this.showResult = false;
                this.isCorrect = false;
                this.startTime = Date.now();
            },
            getDifficultyText(difficulty) {
                return PracticeUtils.getDifficultyText(difficulty);
            }
        },
        mounted() {
            this.startTime = Date.now();
        }
    },

    // 快捷键提示组件
    KeyboardHints: {
        template: `
            <div class="shortcuts-hint">
                <i class="fas fa-keyboard"></i> 
                快捷键: Enter-提交 | ←→-切换题目 | F11-全屏 | ESC-退出 | Ctrl+S-保存
            </div>
        `
    }
};

console.log('🎛️ Vue组件模块已加载'); 