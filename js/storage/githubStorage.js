// ===== GitHub存储系统 =====
window.GitHubStorage = {
    // 连接状态
    isConnected: false,
    
    // 认证信息
    auth: {
        token: null,
        user: null
    },
    
    // 仓库信息
    repo: {
        owner: AppConfig.api.github.owner,
        name: AppConfig.api.github.repo,
        branch: AppConfig.api.github.defaultBranch
    },
    
    // API配置
    apiConfig: {
        baseUrl: AppConfig.api.github.baseUrl,
        timeout: AppConfig.api.github.timeout
    },
    
    // 初始化GitHub存储
    async init() {
        console.log('📁 GitHub存储系统初始化...');
        
        // 尝试从本地存储恢复认证信息
        this.loadStoredAuth();
        
        // 设置事件监听器
        this.setupEventListeners();
        
        console.log('✅ GitHub存储系统已初始化');
    },
    
    // 加载存储的认证信息
    loadStoredAuth() {
        const storedAuth = Utils.storage.get('githubAuth');
        if (storedAuth && storedAuth.token) {
            this.auth = storedAuth;
            console.log('🔐 GitHub认证信息已恢复');
        }
    },
    
    // 保存认证信息
    saveAuth() {
        Utils.storage.set('githubAuth', this.auth, AppConfig.storage.expiry.cache);
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 注册到应用模块系统
        if (window.App && window.App.state) {
            window.App.state.modules.set('githubStorage', { 
                name: 'GitHub Storage System', 
                instance: this 
            });
        }
    },
    
    // 连接到GitHub
    async connect(token, repositoryPath = null) {
        try {
            console.log('🔗 连接到GitHub...');
            
            this.auth.token = token;
            
            if (repositoryPath) {
                const [owner, repo] = repositoryPath.split('/');
                this.repo.owner = owner;
                this.repo.name = repo;
            }
            
            // 验证token和仓库访问
            const userInfo = await this.makeRequest('/user');
            this.auth.user = userInfo;
            
            // 测试仓库访问
            await this.makeRequest(`/repos/${this.repo.owner}/${this.repo.name}`);
            
            this.isConnected = true;
            this.saveAuth();
            
            console.log('✅ GitHub连接成功:', this.auth.user.login);
            
            EventBus.emit(SystemEvents.DATA_SYNC_SUCCESS, {
                provider: 'github',
                user: this.auth.user.login
            });
            
            return {
                success: true,
                user: this.auth.user
            };
            
        } catch (error) {
            console.error('❌ GitHub连接失败:', error);
            this.isConnected = false;
            
            EventBus.emit(SystemEvents.DATA_SYNC_ERROR, {
                provider: 'github',
                error: error.message
            });
            
            throw new Error(`GitHub连接失败: ${error.message}`);
        }
    },
    
    // 断开连接
    disconnect() {
        this.isConnected = false;
        this.auth = { token: null, user: null };
        Utils.storage.remove('githubAuth');
        
        console.log('🔌 GitHub连接已断开');
        
        EventBus.emit(SystemEvents.DATA_SYNC_SUCCESS, {
            provider: 'github',
            action: 'disconnect'
        });
    },
    
    // 发起API请求
    async makeRequest(endpoint, options = {}) {
        if (!this.auth.token) {
            throw new Error('未提供GitHub访问令牌');
        }
        
        const url = `${this.apiConfig.baseUrl}${endpoint}`;
        const requestOptions = {
            timeout: this.apiConfig.timeout,
            headers: {
                'Authorization': `token ${this.auth.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await Utils.async.timeout(
                fetch(url, requestOptions),
                this.apiConfig.timeout
            );
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
            
        } catch (error) {
            if (error.message.includes('操作超时')) {
                throw new Error('GitHub API请求超时，请检查网络连接');
            }
            throw error;
        }
    },
    
    // 获取文件内容
    async getFile(path) {
        try {
            console.log(`📄 获取文件: ${path}`);
            
            const response = await this.makeRequest(`/repos/${this.repo.owner}/${this.repo.name}/contents/${path}`);
            const fileData = await response.json();
            
            if (fileData.content) {
                // Base64解码
                const content = atob(fileData.content.replace(/\n/g, ''));
                return {
                    content,
                    sha: fileData.sha,
                    size: fileData.size,
                    path: fileData.path
                };
            }
            
            throw new Error('文件内容为空');
            
        } catch (error) {
            console.error(`❌ 获取文件失败 ${path}:`, error);
            throw error;
        }
    },
    
    // 保存文件
    async saveFile(path, content, commitMessage = '更新文件', sha = null) {
        try {
            console.log(`💾 保存文件: ${path}`);
            
            const encodedContent = btoa(unescape(encodeURIComponent(content)));
            
            const requestBody = {
                message: commitMessage,
                content: encodedContent,
                branch: this.repo.branch
            };
            
            if (sha) {
                requestBody.sha = sha;
            }
            
            const response = await this.makeRequest(`/repos/${this.repo.owner}/${this.repo.name}/contents/${path}`, {
                method: 'PUT',
                body: JSON.stringify(requestBody)
            });
            
            const result = await response.json();
            console.log('✅ 文件保存成功:', path);
            
            return result;
            
        } catch (error) {
            console.error(`❌ 保存文件失败 ${path}:`, error);
            throw error;
        }
    },
    
    // 删除文件
    async deleteFile(path, commitMessage = '删除文件') {
        try {
            console.log(`🗑️ 删除文件: ${path}`);
            
            // 先获取文件的sha
            const fileInfo = await this.getFile(path);
            
            const response = await this.makeRequest(`/repos/${this.repo.owner}/${this.repo.name}/contents/${path}`, {
                method: 'DELETE',
                body: JSON.stringify({
                    message: commitMessage,
                    sha: fileInfo.sha,
                    branch: this.repo.branch
                })
            });
            
            console.log('✅ 文件删除成功:', path);
            return await response.json();
            
        } catch (error) {
            console.error(`❌ 删除文件失败 ${path}:`, error);
            throw error;
        }
    },
    
    // 获取目录内容
    async getDirectory(path = '') {
        try {
            console.log(`📁 获取目录: ${path || '根目录'}`);
            
            const response = await this.makeRequest(`/repos/${this.repo.owner}/${this.repo.name}/contents/${path}`);
            const contents = await response.json();
            
            if (!Array.isArray(contents)) {
                throw new Error('不是一个目录');
            }
            
            return contents.map(item => ({
                name: item.name,
                path: item.path,
                type: item.type,
                size: item.size,
                sha: item.sha,
                downloadUrl: item.download_url
            }));
            
        } catch (error) {
            console.error(`❌ 获取目录失败 ${path}:`, error);
            throw error;
        }
    },
    
    // 保存JSON数据
    async saveData(path, data, commitMessage = '更新数据') {
        try {
            const jsonContent = JSON.stringify(data, null, 2);
            
            // 尝试获取现有文件的sha
            let sha = null;
            try {
                const existingFile = await this.getFile(path);
                sha = existingFile.sha;
            } catch (error) {
                // 文件不存在，创建新文件
                console.log(`📝 创建新文件: ${path}`);
            }
            
            return await this.saveFile(path, jsonContent, commitMessage, sha);
            
        } catch (error) {
            console.error(`❌ 保存数据失败 ${path}:`, error);
            throw error;
        }
    },
    
    // 加载JSON数据
    async loadData(path, defaultValue = null) {
        try {
            const file = await this.getFile(path);
            return JSON.parse(file.content);
            
        } catch (error) {
            console.warn(`⚠️ 加载数据失败 ${path}:`, error.message);
            return defaultValue;
        }
    },
    
    // 同步用户数据
    async syncUserData(userData) {
        try {
            console.log('🔄 同步用户数据到GitHub...');
            
            EventBus.emit(SystemEvents.DATA_SYNC_START, {
                provider: 'github',
                type: 'user_data'
            });
            
            const timestamp = new Date().toISOString();
            const dataWithTimestamp = {
                ...userData,
                lastSync: timestamp,
                syncedBy: this.auth.user?.login || 'unknown'
            };
            
            await this.saveData('data/user_data.json', dataWithTimestamp, '同步用户数据');
            
            console.log('✅ 用户数据同步成功');
            
            EventBus.emit(SystemEvents.DATA_SYNC_SUCCESS, {
                provider: 'github',
                type: 'user_data',
                timestamp
            });
            
            return true;
            
        } catch (error) {
            console.error('❌ 用户数据同步失败:', error);
            
            EventBus.emit(SystemEvents.DATA_SYNC_ERROR, {
                provider: 'github',
                type: 'user_data',
                error: error.message
            });
            
            throw error;
        }
    },
    
    // 加载用户数据
    async loadUserData() {
        try {
            console.log('📥 从GitHub加载用户数据...');
            
            const userData = await this.loadData('data/user_data.json');
            
            if (userData) {
                console.log('✅ 用户数据加载成功');
                return userData;
            }
            
            return null;
            
        } catch (error) {
            console.error('❌ 用户数据加载失败:', error);
            return null;
        }
    },
    
    // 同步学习进度
    async syncLearningProgress(progressData) {
        try {
            console.log('📈 同步学习进度...');
            
            const timestamp = new Date().toISOString();
            const dataWithMeta = {
                progress: progressData,
                lastUpdated: timestamp,
                version: '1.0'
            };
            
            await this.saveData('data/learning_progress.json', dataWithMeta, '更新学习进度');
            
            console.log('✅ 学习进度同步成功');
            return true;
            
        } catch (error) {
            console.error('❌ 学习进度同步失败:', error);
            throw error;
        }
    },
    
    // 备份题库数据
    async backupQuestionBank(questions) {
        try {
            console.log('💾 备份题库数据...');
            
            const backup = {
                questions,
                backupTime: new Date().toISOString(),
                version: '1.0',
                count: questions.length
            };
            
            const filename = `data/question_bank_backup_${Date.now()}.json`;
            await this.saveData(filename, backup, '备份题库数据');
            
            console.log('✅ 题库数据备份成功');
            return filename;
            
        } catch (error) {
            console.error('❌ 题库数据备份失败:', error);
            throw error;
        }
    },
    
    // 获取仓库统计信息
    async getRepositoryStats() {
        try {
            const response = await this.makeRequest(`/repos/${this.repo.owner}/${this.repo.name}`);
            const repoData = await response.json();
            
            return {
                name: repoData.name,
                fullName: repoData.full_name,
                description: repoData.description,
                size: repoData.size,
                language: repoData.language,
                createdAt: repoData.created_at,
                updatedAt: repoData.updated_at,
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
                isPrivate: repoData.private
            };
            
        } catch (error) {
            console.error('❌ 获取仓库统计失败:', error);
            throw error;
        }
    },
    
    // 获取提交历史
    async getCommitHistory(path = '', limit = 10) {
        try {
            const params = new URLSearchParams({
                per_page: limit.toString()
            });
            
            if (path) {
                params.append('path', path);
            }
            
            const response = await this.makeRequest(`/repos/${this.repo.owner}/${this.repo.name}/commits?${params}`);
            const commits = await response.json();
            
            return commits.map(commit => ({
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                url: commit.html_url
            }));
            
        } catch (error) {
            console.error('❌ 获取提交历史失败:', error);
            throw error;
        }
    },
    
    // 创建分支
    async createBranch(branchName, baseBranch = null) {
        try {
            console.log(`🌿 创建分支: ${branchName}`);
            
            // 获取基础分支的SHA
            const baseRef = baseBranch || this.repo.branch;
            const refResponse = await this.makeRequest(`/repos/${this.repo.owner}/${this.repo.name}/git/refs/heads/${baseRef}`);
            const refData = await refResponse.json();
            
            // 创建新分支
            const response = await this.makeRequest(`/repos/${this.repo.owner}/${this.repo.name}/git/refs`, {
                method: 'POST',
                body: JSON.stringify({
                    ref: `refs/heads/${branchName}`,
                    sha: refData.object.sha
                })
            });
            
            console.log('✅ 分支创建成功:', branchName);
            return await response.json();
            
        } catch (error) {
            console.error(`❌ 创建分支失败 ${branchName}:`, error);
            throw error;
        }
    },
    
    // 检查连接状态
    checkConnection() {
        return {
            isConnected: this.isConnected,
            hasToken: !!this.auth.token,
            user: this.auth.user,
            repository: `${this.repo.owner}/${this.repo.name}`
        };
    },
    
    // 获取存储统计
    getStorageStats() {
        return {
            provider: 'GitHub',
            isConnected: this.isConnected,
            user: this.auth.user?.login,
            repository: `${this.repo.owner}/${this.repo.name}`,
            branch: this.repo.branch,
            lastConnection: Utils.storage.get('githubLastConnection')
        };
    }
};

// 注册模块
document.addEventListener('DOMContentLoaded', () => {
    GitHubStorage.init();
});

console.log('�� GitHub存储系统已加载'); 