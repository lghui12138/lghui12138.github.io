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
        syncToken: null,
        cloudStorage: true,
        syncBranch: 'main',
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
            const container = document.getElementById('bankView');
            if (!container) return;
            
            const html = `
                <div class="bank-header">
                    <h3>${bank.name}</h3>
                    <div class="bank-stats">
                        <span>题目数量: ${bank.questions ? bank.questions.length : 0}</span>
                        <span>最后更新: ${bank.lastUpdated || '未知'}</span>
                    </div>
                </div>
                <div class="questions-list">
                    ${bank.questions ? bank.questions.map((question, index) => `
                        <div class="question-item" data-question-id="${index}">
                            <div class="question-content">
                                <h5>题目 ${index + 1}</h5>
                                <p>${question.question}</p>
                                ${question.options ? `<p>选项: ${question.options.join(', ')}</p>` : ''}
                                <p>答案: ${question.answer}</p>
                            </div>
                            <div class="question-actions">
                                <button class="btn btn-warning btn-sm" onclick="TeacherManagement.editQuestion(${index})">
                                    <i class="fas fa-edit"></i> 编辑
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="TeacherManagement.deleteQuestion(${index})">
                                    <i class="fas fa-trash"></i> 删除
                                </button>
                            </div>
                        </div>
                    `).join('') : '<p>暂无题目</p>'}
                </div>
            `;
            
            container.innerHTML = html;
            document.getElementById('bankView').style.display = 'block';
            document.getElementById('banksList').style.display = 'none';
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
            const question = {
                question: prompt('请输入题目内容:'),
                options: [],
                answer: prompt('请输入答案:'),
                explanation: prompt('请输入解析(可选):')
            };
            
            if (question.question && question.answer) {
                if (!currentBank.questions) {
                    currentBank.questions = [];
                }
                currentBank.questions.push(question);
                this.saveToGitHub(currentBank, `添加题目到题库 ${currentBank.name}`);
                this.showBankView(currentBank);
                showNotification('题目添加成功', 'success');
            }
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
        editQuestion: function(questionIndex) {
            const question = currentBank.questions[questionIndex];
            if (!question) return;
            
            const newQuestion = prompt('请输入新的题目内容:', question.question);
            const newAnswer = prompt('请输入新的答案:', question.answer);
            const newExplanation = prompt('请输入新的解析(可选):', question.explanation);
            
            if (newQuestion && newAnswer) {
                question.question = newQuestion;
                question.answer = newAnswer;
                question.explanation = newExplanation;
                
                this.saveToGitHub(currentBank, `编辑题库 ${currentBank.name} 中的题目`);
                this.showBankView(currentBank);
                showNotification('题目编辑成功', 'success');
            }
        },
        
        // 删除题目
        deleteQuestion: function(questionIndex) {
            if (confirm('确定要删除这道题目吗？')) {
                currentBank.questions.splice(questionIndex, 1);
                this.saveToGitHub(currentBank, `删除题库 ${currentBank.name} 中的题目`);
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
                // 从GitHub删除题库文件
                this.deleteFromGitHub(bankId);
                // 从本地列表中移除
                questionBanks = questionBanks.filter(bank => bank.id !== bankId);
                this.updateBanksList();
                showNotification('题库删除成功', 'success');
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
        saveToGitHub: async function(data, commitMessage) {
            try {
                if (!config.githubToken) {
                    showNotification('请先配置GitHub Token', 'warning');
                    return;
                }

                const content = btoa(JSON.stringify(data, null, 2));
                const path = `question-banks/${data.id || 'temp'}.json`;
                
                const response = await fetch(`https://api.github.com/repos/${config.githubRepo}/contents/${path}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${config.githubToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: commitMessage,
                        content: content,
                        branch: config.githubBranch
                    })
                });

                if (response.ok) {
                    console.log('成功保存到GitHub');
                    showNotification('已同步到GitHub', 'success');
                } else {
                    console.error('保存到GitHub失败');
                    showNotification('保存到GitHub失败', 'error');
                }
            } catch (error) {
                console.error('GitHub同步错误:', error);
                showNotification('GitHub同步错误', 'error');
            }
        },

        // 从GitHub删除
        deleteFromGitHub: async function(bankId) {
            try {
                if (!config.githubToken) {
                    showNotification('请先配置GitHub Token', 'warning');
                    return;
                }

                const path = `question-banks/${bankId}.json`;
                
                // 首先获取文件的SHA
                const getResponse = await fetch(`https://api.github.com/repos/${config.githubRepo}/contents/${path}`, {
                    headers: {
                        'Authorization': `token ${config.githubToken}`,
                    }
                });

                if (getResponse.ok) {
                    const fileInfo = await getResponse.json();
                    
                    // 删除文件
                    const deleteResponse = await fetch(`https://api.github.com/repos/${config.githubRepo}/contents/${path}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `token ${config.githubToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: `删除题库 ${bankId}`,
                            sha: fileInfo.sha,
                            branch: config.githubBranch
                        })
                    });

                    if (deleteResponse.ok) {
                        console.log('成功从GitHub删除');
                        showNotification('已从GitHub删除', 'success');
                    } else {
                        console.error('从GitHub删除失败');
                        showNotification('从GitHub删除失败', 'error');
                    }
                }
            } catch (error) {
                console.error('GitHub删除错误:', error);
                showNotification('GitHub删除错误', 'error');
            }
        },

        // 设置GitHub Token
        setGitHubToken: function(token) {
            config.githubToken = token;
            localStorage.setItem('githubToken', token);
            showNotification('GitHub Token已设置', 'success');
        },

        // 获取GitHub Token
        getGitHubToken: function() {
            return config.githubToken || localStorage.getItem('githubToken');
        },

        // 保存当前题库
        saveCurrentBank: function() {
            if (currentBank) {
                this.saveToGitHub(currentBank, `更新题库 ${currentBank.name}`);
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
        },

        // 显示通知
        showNotification: function(message, type = 'info') {
            // 使用全局通知函数或创建简单的通知
            if (typeof showNotification === 'function') {
                showNotification(message, type);
            } else {
                alert(`${type.toUpperCase()}: ${message}`);
            }
        },

        // 新增教师端功能
        
        // 查看学生进度
        viewStudentProgress: function() {
            const content = `
                <div class="student-progress-container">
                    <h2><i class="fas fa-chart-line"></i> 学生学习进度</h2>
                    <div class="progress-stats">
                        <div class="stat-card">
                            <div class="stat-number">156</div>
                            <div class="stat-label">总学生数</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">89%</div>
                            <div class="stat-label">平均完成率</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">78.5</div>
                            <div class="stat-label">平均分数</div>
                        </div>
                    </div>
                    <div class="student-list">
                        <div class="student-item">
                            <span class="student-name">张三</span>
                            <span class="student-progress">85%</span>
                            <span class="student-score">82分</span>
                        </div>
                        <div class="student-item">
                            <span class="student-name">李四</span>
                            <span class="student-progress">92%</span>
                            <span class="student-score">88分</span>
                        </div>
                        <!-- 更多学生数据... -->
                    </div>
                </div>
            `;
            this.showModal('学生进度管理', content);
        },

        // 管理考试
        manageExams: function() {
            const content = `
                <div class="exam-management">
                    <h2><i class="fas fa-clipboard-list"></i> 考试管理</h2>
                    <div class="exam-actions">
                        <button class="btn btn-success" onclick="TeacherManagement.createExam()">
                            <i class="fas fa-plus"></i> 创建新考试
                        </button>
                        <button class="btn btn-primary" onclick="TeacherManagement.viewExamResults()">
                            <i class="fas fa-chart-bar"></i> 查看考试结果
                        </button>
                    </div>
                    <div class="exam-list">
                        <div class="exam-item">
                            <h4>流体力学期中考试</h4>
                            <p>考试时间：2024-01-15 14:00-16:00</p>
                            <p>参考人数：156人</p>
                            <div class="exam-buttons">
                                <button class="btn btn-sm btn-primary">查看详情</button>
                                <button class="btn btn-sm btn-warning">编辑</button>
                                <button class="btn btn-sm btn-danger">删除</button>
                            </div>
                        </div>
                        <!-- 更多考试... -->
                    </div>
                </div>
            `;
            this.showModal('考试管理', content);
        },

        // 查看数据分析
        viewAnalytics: function() {
            const content = `
                <div class="analytics-dashboard">
                    <h2><i class="fas fa-chart-pie"></i> 数据分析仪表板</h2>
                    <div class="analytics-grid">
                        <div class="chart-container">
                            <h3>题目难度分布</h3>
                            <div class="chart-placeholder">
                                [难度分布图表]
                            </div>
                        </div>
                        <div class="chart-container">
                            <h3>学生答题正确率</h3>
                            <div class="chart-placeholder">
                                [正确率趋势图]
                            </div>
                        </div>
                        <div class="chart-container">
                            <h3>知识点掌握情况</h3>
                            <div class="chart-placeholder">
                                [知识点统计图]
                            </div>
                        </div>
                        <div class="chart-container">
                            <h3>学习时间分布</h3>
                            <div class="chart-placeholder">
                                [时间分布图]
                            </div>
                        </div>
                    </div>
                </div>
            `;
            this.showModal('数据分析', content);
        },

        // 管理内容
        manageContent: function() {
            const content = `
                <div class="content-management">
                    <h2><i class="fas fa-video"></i> 内容管理</h2>
                    <div class="content-tabs">
                        <button class="tab-btn active" onclick="TeacherManagement.showContentTab('videos')">视频课程</button>
                        <button class="tab-btn" onclick="TeacherManagement.showContentTab('materials')">学习资料</button>
                        <button class="tab-btn" onclick="TeacherManagement.showContentTab('exercises')">练习题</button>
                    </div>
                    <div class="content-list">
                        <div class="content-item">
                            <h4>流体力学基础理论</h4>
                            <p>时长：45分钟 | 观看次数：1,234</p>
                            <div class="content-buttons">
                                <button class="btn btn-sm btn-primary">编辑</button>
                                <button class="btn btn-sm btn-warning">统计</button>
                                <button class="btn btn-sm btn-danger">删除</button>
                            </div>
                        </div>
                        <!-- 更多内容... -->
                    </div>
                </div>
            `;
            this.showModal('内容管理', content);
        },

        // 系统设置
        systemSettings: function() {
            const content = `
                <div class="system-settings">
                    <h2><i class="fas fa-cog"></i> 系统设置</h2>
                    <div class="settings-sections">
                        <div class="setting-section">
                            <h3>用户权限设置</h3>
                            <div class="setting-item">
                                <label>允许学生创建笔记</label>
                                <input type="checkbox" checked>
                            </div>
                            <div class="setting-item">
                                <label>允许学生查看解析</label>
                                <input type="checkbox" checked>
                            </div>
                        </div>
                        <div class="setting-section">
                            <h3>考试设置</h3>
                            <div class="setting-item">
                                <label>考试时间限制(分钟)</label>
                                <input type="number" value="120">
                            </div>
                            <div class="setting-item">
                                <label>允许考试中暂停</label>
                                <input type="checkbox">
                            </div>
                        </div>
                        <div class="setting-section">
                            <h3>数据同步</h3>
                            <div class="setting-item">
                                <label>自动同步间隔(分钟)</label>
                                <input type="number" value="30">
                            </div>
                            <div class="setting-item">
                                <label>启用数据备份</label>
                                <input type="checkbox" checked>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-success" onclick="TeacherManagement.saveSettings()">保存设置</button>
                </div>
            `;
            this.showModal('系统设置', content);
        },

        // 显示模态框
        showModal: function(title, content) {
            const modal = document.createElement('div');
            modal.className = 'teacher-modal';
            modal.innerHTML = `
                <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="close-btn" onclick="this.closest('.teacher-modal').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            `;
            
            // 添加模态框样式
            const style = document.createElement('style');
            style.textContent = `
                .teacher-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                }
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                }
                .modal-content {
                    position: relative;
                    background: white;
                    margin: 50px auto;
                    max-width: 90%;
                    max-height: 90%;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                .modal-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-body {
                    padding: 30px;
                    max-height: 70vh;
                    overflow-y: auto;
                }
                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(modal);
        },

        // 数据同步密钥管理
        setSyncToken: function(token) {
            if (token && token.trim()) {
                config.syncToken = token.trim();
                localStorage.setItem('sync_token', token.trim());
                showNotification('同步密钥保存成功', 'success');
            } else {
                showNotification('请输入有效的同步密钥', 'error');
            }
        },
        
        getSyncToken: function() {
            return config.syncToken || localStorage.getItem('sync_token') || '';
        }
    };
})(); 