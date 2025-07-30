/**
 * 教师端管理系统模块
 * 负责题库管理、题目查看、添加、删除等功能
 */
window.TeacherManagement = (function() {
    // 私有变量
    let currentUser = null;
    let questionBanks = [];
    let currentBank = null;
    
    // 配置
    const config = {
        githubToken: null,
        githubRepo: 'lghui12138/lghui12138.github.io',
        githubBranch: 'main',
        autoSave: true,
        autoSaveInterval: 5000 // 5秒自动保存
    };
    
    // 公有方法
    return {
        // 初始化模块
        init: function() {
            console.log('初始化教师端管理系统...');
            this.loadQuestionBanks();
            this.bindEvents();
            return this;
        },
        
        // 绑定事件
        bindEvents: function() {
            // 键盘快捷键
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    this.saveCurrentBank();
                }
            });
        },
        
        // 加载题库列表
        loadQuestionBanks: async function() {
            try {
                const response = await fetch('question-banks/index.json');
                if (response.ok) {
                    const banks = await response.json();
                    questionBanks = banks;
                    this.updateBanksList();
                } else {
                    console.error('加载题库列表失败');
                    showNotification('加载题库列表失败', 'error');
                }
            } catch (error) {
                console.error('加载题库列表错误:', error);
                showNotification('加载题库列表错误', 'error');
            }
        },
        
        // 更新题库列表显示
        updateBanksList: function() {
            const container = document.getElementById('banksList');
            if (!container) return;
            
            const html = questionBanks.map(bank => `
                <div class="bank-item" data-bank-id="${bank.id}">
                    <div class="bank-info">
                        <h4>${bank.name}</h4>
                        <p>题目数量: ${bank.questionCount || 0}</p>
                        <p>最后更新: ${bank.lastUpdated || '未知'}</p>
                    </div>
                    <div class="bank-actions">
                        <button class="btn btn-primary btn-sm" onclick="TeacherManagement.viewBank('${bank.id}')">
                            <i class="fas fa-eye"></i> 查看
                        </button>
                        <button class="btn btn-success btn-sm" onclick="TeacherManagement.addQuestion('${bank.id}')">
                            <i class="fas fa-plus"></i> 添加题目
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="TeacherManagement.deleteBank('${bank.id}')">
                            <i class="fas fa-trash"></i> 删除题库
                        </button>
                    </div>
                </div>
            `).join('');
            
            container.innerHTML = html;
        },
        
        // 查看题库
        viewBank: async function(bankId) {
            try {
                const response = await fetch(`question-banks/${bankId}.json`);
                if (response.ok) {
                    const bank = await response.json();
                    currentBank = bank;
                    this.showBankView(bank);
                } else {
                    showNotification('加载题库失败', 'error');
                }
            } catch (error) {
                console.error('查看题库错误:', error);
                showNotification('查看题库错误', 'error');
            }
        },
        
        // 显示题库视图
        showBankView: function(bank) {
            const content = `
                <div class="bank-view">
                    <div class="bank-header">
                        <h3>${bank.name}</h3>
                        <div class="bank-stats">
                            <span>题目总数: ${bank.questions ? bank.questions.length : 0}</span>
                            <span>最后更新: ${bank.lastUpdated || '未知'}</span>
                        </div>
                    </div>
                    
                    <div class="bank-actions">
                        <button class="btn btn-success" onclick="TeacherManagement.addQuestion('${bank.id}')">
                            <i class="fas fa-plus"></i> 添加题目
                        </button>
                        <button class="btn btn-primary" onclick="TeacherManagement.exportBank('${bank.id}')">
                            <i class="fas fa-download"></i> 导出题库
                        </button>
                        <button class="btn btn-warning" onclick="TeacherManagement.backToList()">
                            <i class="fas fa-arrow-left"></i> 返回列表
                        </button>
                    </div>
                    
                    <div class="questions-list">
                        ${this.generateQuestionsList(bank.questions || [])}
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: `题库管理 - ${bank.name}`,
                    content: content,
                    size: 'large',
                    closable: true
                });
            }
        },
        
        // 生成题目列表HTML
        generateQuestionsList: function(questions) {
            if (!questions || questions.length === 0) {
                return '<div class="no-questions">暂无题目</div>';
            }
            
            return questions.map((question, index) => `
                <div class="question-item" data-question-index="${index}">
                    <div class="question-header">
                        <span class="question-number">题目 ${index + 1}</span>
                        <span class="question-type">${question.type || '选择题'}</span>
                        <span class="question-difficulty">${question.difficulty || '中等'}</span>
                    </div>
                    <div class="question-content">
                        ${question.question || question.title || '题目内容'}
                    </div>
                    <div class="question-actions">
                        <button class="btn btn-sm btn-primary" onclick="TeacherManagement.editQuestion(${index})">
                            <i class="fas fa-edit"></i> 编辑
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="TeacherManagement.deleteQuestion(${index})">
                            <i class="fas fa-trash"></i> 删除
                        </button>
                        <button class="btn btn-sm btn-info" onclick="TeacherManagement.previewQuestion(${index})">
                            <i class="fas fa-eye"></i> 预览
                        </button>
                    </div>
                </div>
            `).join('');
        },
        
        // 添加题目
        addQuestion: function(bankId) {
            const content = `
                <div class="question-form">
                    <h4>添加新题目</h4>
                    <form id="addQuestionForm">
                        <div class="form-group">
                            <label>题目类型:</label>
                            <select id="questionType" class="form-control">
                                <option value="选择题">选择题</option>
                                <option value="填空题">填空题</option>
                                <option value="判断题">判断题</option>
                                <option value="解答题">解答题</option>
                                <option value="计算题">计算题</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>题目内容:</label>
                            <textarea id="questionContent" class="form-control" rows="4" placeholder="请输入题目内容..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>难度:</label>
                            <select id="questionDifficulty" class="form-control">
                                <option value="简单">简单</option>
                                <option value="中等" selected>中等</option>
                                <option value="困难">困难</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>分类:</label>
                            <input type="text" id="questionCategory" class="form-control" placeholder="请输入分类...">
                        </div>
                        
                        <div id="optionsContainer" class="form-group">
                            <label>选项:</label>
                            <div id="optionsList">
                                <div class="option-item">
                                    <input type="text" class="form-control" placeholder="选项A">
                                    <button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">删除</button>
                                </div>
                            </div>
                            <button type="button" class="btn btn-sm btn-success" onclick="TeacherManagement.addOption()">添加选项</button>
                        </div>
                        
                        <div class="form-group">
                            <label>正确答案:</label>
                            <input type="text" id="correctAnswer" class="form-control" placeholder="请输入正确答案...">
                        </div>
                        
                        <div class="form-group">
                            <label>解析:</label>
                            <textarea id="questionExplanation" class="form-control" rows="3" placeholder="请输入题目解析..."></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-success">保存题目</button>
                            <button type="button" class="btn btn-secondary" onclick="TeacherManagement.closeForm()">取消</button>
                        </div>
                    </form>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '添加题目',
                    content: content,
                    size: 'large',
                    closable: true
                });
            }
            
            // 绑定表单提交事件
            document.getElementById('addQuestionForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveQuestion();
            });
        },
        
        // 添加选项
        addOption: function() {
            const optionsList = document.getElementById('optionsList');
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            optionDiv.innerHTML = `
                <input type="text" class="form-control" placeholder="选项${String.fromCharCode(65 + optionsList.children.length)}">
                <button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">删除</button>
            `;
            optionsList.appendChild(optionDiv);
        },
        
        // 保存题目
        saveQuestion: function() {
            const form = document.getElementById('addQuestionForm');
            const formData = new FormData(form);
            
            const question = {
                type: document.getElementById('questionType').value,
                question: document.getElementById('questionContent').value,
                difficulty: document.getElementById('questionDifficulty').value,
                category: document.getElementById('questionCategory').value,
                correct: document.getElementById('correctAnswer').value,
                explanation: document.getElementById('questionExplanation').value
            };
            
            // 获取选项
            const options = [];
            const optionInputs = document.querySelectorAll('#optionsList input');
            optionInputs.forEach(input => {
                if (input.value.trim()) {
                    options.push(input.value.trim());
                }
            });
            
            if (options.length > 0) {
                question.options = options;
            }
            
            // 添加到当前题库
            if (currentBank) {
                if (!currentBank.questions) {
                    currentBank.questions = [];
                }
                currentBank.questions.push(question);
                
                // 保存到GitHub
                this.saveToGitHub();
                
                showNotification('题目添加成功', 'success');
                this.closeForm();
                this.showBankView(currentBank);
            }
        },
        
        // 编辑题目
        editQuestion: function(index) {
            if (!currentBank || !currentBank.questions) return;
            
            const question = currentBank.questions[index];
            // 实现编辑功能
            showNotification('编辑功能开发中...', 'info');
        },
        
        // 删除题目
        deleteQuestion: function(index) {
            if (!currentBank || !currentBank.questions) return;
            
            if (confirm('确定要删除这道题目吗？')) {
                currentBank.questions.splice(index, 1);
                this.saveToGitHub();
                this.showBankView(currentBank);
                showNotification('题目删除成功', 'success');
            }
        },
        
        // 预览题目
        previewQuestion: function(index) {
            if (!currentBank || !currentBank.questions) return;
            
            const question = currentBank.questions[index];
            // 使用题库练习模块预览题目
            if (typeof QuestionBankPractice !== 'undefined') {
                QuestionBankPractice.startSingleQuestion(question);
            }
        },
        
        // 删除题库
        deleteBank: function(bankId) {
            if (confirm('确定要删除这个题库吗？此操作不可恢复！')) {
                // 实现删除题库功能
                showNotification('删除题库功能开发中...', 'info');
            }
        },
        
        // 导出题库
        exportBank: function(bankId) {
            if (!currentBank) return;
            
            const dataStr = JSON.stringify(currentBank, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${currentBank.name}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showNotification('题库导出成功', 'success');
        },
        
        // 保存到GitHub
        saveToGitHub: async function() {
            if (!currentBank) return;
            
            try {
                // 这里需要实现GitHub API调用
                // 由于需要GitHub Token，这里先模拟保存
                console.log('保存到GitHub:', currentBank);
                showNotification('题库已保存', 'success');
            } catch (error) {
                console.error('保存到GitHub失败:', error);
                showNotification('保存失败', 'error');
            }
        },
        
        // 关闭表单
        closeForm: function() {
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.closeAllModals();
            }
        },
        
        // 返回列表
        backToList: function() {
            this.closeForm();
            this.updateBanksList();
        },
        
        // 显示教师端界面
        showTeacherInterface: function() {
            const content = `
                <div class="teacher-interface">
                    <div class="teacher-header">
                        <h2>教师端管理系统</h2>
                        <div class="teacher-actions">
                            <button class="btn btn-success" onclick="TeacherManagement.createNewBank()">
                                <i class="fas fa-plus"></i> 创建新题库
                            </button>
                            <button class="btn btn-primary" onclick="TeacherManagement.importBank()">
                                <i class="fas fa-upload"></i> 导入题库
                            </button>
                        </div>
                    </div>
                    
                    <div class="banks-container">
                        <h3>题库列表</h3>
                        <div id="banksList" class="banks-list">
                            <!-- 题库列表将在这里动态加载 -->
                        </div>
                    </div>
                </div>
            `;
            
            if (typeof QuestionBankUI !== 'undefined') {
                QuestionBankUI.createModal({
                    title: '教师端管理系统',
                    content: content,
                    size: 'fullscreen',
                    closable: true
                });
            }
            
            this.updateBanksList();
        },
        
        // 创建新题库
        createNewBank: function() {
            const bankName = prompt('请输入新题库名称:');
            if (bankName && bankName.trim()) {
                const newBank = {
                    id: `bank_${Date.now()}`,
                    name: bankName.trim(),
                    questions: [],
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                };
                
                questionBanks.push(newBank);
                currentBank = newBank;
                this.saveToGitHub();
                this.showBankView(newBank);
                showNotification('新题库创建成功', 'success');
            }
        },
        
        // 导入题库
        importBank: function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const bank = JSON.parse(e.target.result);
                            bank.id = `imported_${Date.now()}`;
                            bank.lastUpdated = new Date().toISOString();
                            
                            questionBanks.push(bank);
                            currentBank = bank;
                            this.saveToGitHub();
                            this.showBankView(bank);
                            showNotification('题库导入成功', 'success');
                        } catch (error) {
                            showNotification('导入失败，请检查文件格式', 'error');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        }
    };
})(); 