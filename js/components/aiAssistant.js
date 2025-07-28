// ===== AI智能助手系统 =====
window.IntelligentAIAssistant = {
    // 当前状态
    isInitialized: false,
    isConnected: false,
    isListening: false,
    
    // 会话管理
    currentSession: null,
    conversationHistory: [],
    maxHistoryLength: 50,
    
    // API配置
    apiConfig: {
        endpoint: AppConfig.api.siliconFlow.endpoint,
        apiKey: AppConfig.api.siliconFlow.apiKey,
        model: AppConfig.api.siliconFlow.model,
        maxTokens: AppConfig.api.siliconFlow.maxTokens,
        temperature: AppConfig.api.siliconFlow.temperature
    },
    
    // 语音识别配置
    speechConfig: {
        recognition: null,
        synthesis: null,
        isSupported: false,
        currentLanguage: 'zh-CN'
    },
    
    // 预设提示词
    systemPrompts: {
        default: `你是一个专业的流体力学AI助手，名叫"流小智"。你的职责是：
1. 回答流体力学相关的学术问题
2. 帮助用户理解复杂的流体力学概念
3. 提供学习建议和解题思路
4. 协助分析实际工程问题

请用专业但易懂的语言回答，适当使用表情符号让对话更生动。对于复杂问题，请分步骤解释。`,
        
        tutor: `你是一位经验丰富的流体力学导师。请：
- 用启发式的方法引导学习
- 提供详细的推导过程
- 给出实际应用例子
- 鼓励独立思考`,
        
        solver: `你是一个流体力学问题解决专家。请：
- 分析问题的物理本质
- 选择合适的理论和方法
- 给出完整的求解步骤
- 验证结果的合理性`
    },
    
    // 快捷回复
    quickReplies: [
        '请解释伯努利方程',
        '层流和湍流的区别',
        '如何计算雷诺数',
        '流体阻力如何产生',
        '什么是连续性方程',
        '管道压力损失计算'
    ],
    
    // 初始化AI助手
    async init() {
        console.log('🤖 AI智能助手初始化...');
        
        try {
            // 初始化语音识别
            await this.initializeSpeechRecognition();
            
            // 加载历史对话
            this.loadConversationHistory();
            
            // 设置事件监听器
            this.setupEventListeners();
            
            // 测试API连接
            await this.testAIConnection();
            
            this.isInitialized = true;
            console.log('✅ AI助手初始化完成');
            
        } catch (error) {
            console.error('❌ AI助手初始化失败:', error);
        }
    },
    
    // 初始化语音识别
    async initializeSpeechRecognition() {
        try {
            // 检查浏览器支持
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const SpeechSynthesis = window.speechSynthesis;
            
            if (SpeechRecognition && SpeechSynthesis) {
                // 初始化语音识别
                this.speechConfig.recognition = new SpeechRecognition();
                this.speechConfig.recognition.continuous = false;
                this.speechConfig.recognition.interimResults = false;
                this.speechConfig.recognition.lang = this.speechConfig.currentLanguage;
                
                // 设置语音识别事件
                this.speechConfig.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    this.handleVoiceInput(transcript);
                };
                
                this.speechConfig.recognition.onerror = (event) => {
                    console.error('语音识别错误:', event.error);
                    this.stopListening();
                };
                
                this.speechConfig.recognition.onend = () => {
                    this.stopListening();
                };
                
                // 初始化语音合成
                this.speechConfig.synthesis = SpeechSynthesis;
                this.speechConfig.isSupported = true;
                
                console.log('🎤 语音功能已启用');
            } else {
                console.warn('⚠️ 浏览器不支持语音功能');
            }
        } catch (error) {
            console.error('❌ 语音初始化失败:', error);
        }
    },
    
    // 加载对话历史
    loadConversationHistory() {
        const history = Utils.storage.get('aiChatHistory', []);
        this.conversationHistory = history.slice(-this.maxHistoryLength);
        console.log('💬 对话历史已加载:', this.conversationHistory.length);
    },
    
    // 保存对话历史
    saveConversationHistory() {
        Utils.storage.set('aiChatHistory', this.conversationHistory);
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 注册到应用模块系统
        if (window.App && window.App.state) {
            window.App.state.modules.set('aiAssistant', { 
                name: 'AI Assistant System', 
                instance: this 
            });
        }
        
        // 监听用户登录事件
        EventBus.on(SystemEvents.USER_LOGIN, () => {
            this.loadConversationHistory();
        });
        
        // 监听AI交互事件
        EventBus.on(SystemEvents.AI_REQUEST_START, (data) => {
            this.updateStatus('思考中...', 'loading');
        });
        
        EventBus.on(SystemEvents.AI_REQUEST_SUCCESS, (data) => {
            this.updateStatus('已连接', 'success');
        });
        
        EventBus.on(SystemEvents.AI_REQUEST_ERROR, (data) => {
            this.updateStatus('连接失败', 'error');
        });
    },
    
    // 测试AI连接
    async testAIConnection() {
        try {
            console.log('🔗 测试AI连接...');
            const testResponse = await this.callAIAPI('你好，请简单回复"连接成功"');
            
            if (testResponse) {
                this.isConnected = true;
                console.log('✅ AI连接测试成功');
                EventBus.emit(SystemEvents.AI_REQUEST_SUCCESS, { type: 'connection_test' });
            }
        } catch (error) {
            console.error('❌ AI连接测试失败:', error);
            this.isConnected = false;
            EventBus.emit(SystemEvents.AI_REQUEST_ERROR, { error, type: 'connection_test' });
        }
    },
    
    // 显示AI助手界面
    showAssistant() {
        if (!AuthSystem.isAuthenticated()) {
            AuthSystem.showMessage('请先登录后使用AI助手', 'warning');
            return;
        }
        
        this.createAssistantUI();
        const container = Utils.dom.get('#ai-assistant-container');
        if (container) {
            Utils.dom.show(container);
            this.focusInput();
        }
    },
    
    // 创建AI助手UI
    createAssistantUI() {
        let container = Utils.dom.get('#ai-assistant-container');
        if (!container) {
            container = Utils.dom.create('div', {
                id: 'ai-assistant-container',
                className: 'ai-assistant-container'
            });
            
            const mainContent = Utils.dom.get('#main-content');
            if (mainContent) {
                mainContent.appendChild(container);
            }
        }
        
        container.innerHTML = `
            <div class="ai-assistant-header">
                <div class="ai-assistant-title">
                    <i class="fas fa-robot"></i>
                    流小智 - AI助手
                    <div class="ai-status-indicator" id="ai-status-indicator"></div>
                </div>
                <div class="ai-assistant-controls">
                    <button class="btn-secondary" onclick="IntelligentAIAssistant.clearHistory()" title="清空对话">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn-secondary" onclick="IntelligentAIAssistant.toggleVoice()" title="语音输入" id="voice-btn">
                        <i class="fas fa-microphone"></i>
                    </button>
                    <button class="btn-secondary" onclick="IntelligentAIAssistant.changeMode()" title="切换模式" id="mode-btn">
                        <i class="fas fa-user-graduate"></i>
                    </button>
                </div>
            </div>
            
            <div class="ai-chat-messages" id="ai-chat-messages">
                ${this.renderChatHistory()}
            </div>
            
            <div class="ai-quick-replies" id="ai-quick-replies">
                <div class="quick-replies-header">快捷问题：</div>
                <div class="quick-replies-list">
                    ${this.quickReplies.map(reply => `
                        <button class="quick-reply-btn" onclick="IntelligentAIAssistant.sendQuickReply('${reply}')">
                            ${reply}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="ai-chat-input">
                <div class="ai-input-group">
                    <textarea 
                        class="ai-input" 
                        id="ai-input" 
                        placeholder="输入您的问题，我来帮您解答..."
                        rows="1"
                    ></textarea>
                    <button class="ai-send-btn" id="ai-send-btn" onclick="IntelligentAIAssistant.sendMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        this.setupUIEventListeners();
        this.updateStatus('已连接', 'success');
    },
    
    // 渲染聊天历史
    renderChatHistory() {
        if (this.conversationHistory.length === 0) {
            return `
                <div class="ai-message assistant">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        您好！我是流小智，您的流体力学AI助手。😊<br>
                        我可以帮您：<br>
                        • 解答流体力学问题<br>
                        • 解释复杂概念<br>
                        • 分析工程案例<br>
                        • 提供学习建议<br><br>
                        有什么问题尽管问我吧！
                    </div>
                </div>
            `;
        }
        
        return this.conversationHistory.map(msg => `
            <div class="ai-message ${msg.role}">
                <div class="message-avatar">${msg.role === 'user' ? '👤' : '🤖'}</div>
                <div class="message-content">
                    ${msg.content}
                    <div class="message-time">${Utils.format.relativeTime(msg.timestamp)}</div>
                </div>
            </div>
        `).join('');
    },
    
    // 设置UI事件监听器
    setupUIEventListeners() {
        // 输入框事件
        const input = Utils.dom.get('#ai-input');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            input.addEventListener('input', () => {
                this.autoResizeInput(input);
            });
        }
    },
    
    // 自动调整输入框高度
    autoResizeInput(input) {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    },
    
    // 发送消息
    async sendMessage() {
        const input = Utils.dom.get('#ai-input');
        const message = input?.value.trim();
        
        if (!message) return;
        
        // 清空输入框
        input.value = '';
        input.style.height = 'auto';
        
        // 添加用户消息到界面
        this.addMessageToUI('user', message);
        
        // 添加到历史记录
        this.addToHistory('user', message);
        
        try {
            // 显示加载状态
            this.showTypingIndicator();
            
            // 调用AI API
            const response = await this.generateAIResponse(message);
            
            // 移除加载状态
            this.hideTypingIndicator();
            
            // 添加AI回复到界面
            this.addMessageToUI('assistant', response);
            
            // 添加到历史记录
            this.addToHistory('assistant', response);
            
            // 语音播报（如果启用）
            if (this.speechConfig.isSupported) {
                this.speakResponse(response);
            }
            
        } catch (error) {
            this.hideTypingIndicator();
            const errorMessage = `抱歉，我遇到了一些问题：${error.message}`;
            this.addMessageToUI('assistant', errorMessage);
            console.error('❌ AI响应失败:', error);
        }
    },
    
    // 发送快捷回复
    sendQuickReply(message) {
        const input = Utils.dom.get('#ai-input');
        if (input) {
            input.value = message;
            this.sendMessage();
        }
    },
    
    // 生成AI回复
    async generateAIResponse(userMessage) {
        const prompt = this.buildConversationPrompt(userMessage);
        
        EventBus.emit(SystemEvents.AI_REQUEST_START, { message: userMessage });
        
        try {
            const response = await this.callAIAPI(prompt);
            
            EventBus.emit(SystemEvents.AI_REQUEST_SUCCESS, { 
                message: userMessage, 
                response 
            });
            
            return response;
            
        } catch (error) {
            EventBus.emit(SystemEvents.AI_REQUEST_ERROR, { 
                message: userMessage, 
                error 
            });
            throw error;
        }
    },
    
    // 构建对话提示词
    buildConversationPrompt(userMessage) {
        const systemPrompt = this.systemPrompts.default;
        
        // 构建上下文（最近的几轮对话）
        const recentHistory = this.conversationHistory
            .slice(-6) // 最近3轮对话
            .map(msg => `${msg.role === 'user' ? '用户' : '助手'}: ${msg.content}`)
            .join('\n');
        
        let contextPrompt = '';
        if (recentHistory) {
            contextPrompt = `\n\n以下是之前的对话历史：\n${recentHistory}\n\n`;
        }
        
        return `${systemPrompt}${contextPrompt}用户: ${userMessage}\n助手:`;
    },
    
    // 调用AI API
    async callAIAPI(prompt) {
        try {
            const response = await fetch(this.apiConfig.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: this.apiConfig.model,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: this.apiConfig.maxTokens,
                    temperature: this.apiConfig.temperature,
                    stream: false
                })
            });
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('API响应格式无效');
            }
            
            return data.choices[0].message.content.trim();
            
        } catch (error) {
            console.error('❌ AI API调用失败:', error);
            throw new Error(`AI服务暂时不可用: ${error.message}`);
        }
    },
    
    // 添加消息到UI
    addMessageToUI(role, content) {
        const messagesContainer = Utils.dom.get('#ai-chat-messages');
        if (!messagesContainer) return;
        
        const messageDiv = Utils.dom.create('div', {
            className: `ai-message ${role}`,
            innerHTML: `
                <div class="message-avatar">${role === 'user' ? '👤' : '🤖'}</div>
                <div class="message-content">
                    ${this.formatMessage(content)}
                    <div class="message-time">${Utils.format.time(new Date(), 'HH:mm')}</div>
                </div>
            `
        });
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    
    // 格式化消息内容
    formatMessage(content) {
        // 处理换行
        content = content.replace(/\n/g, '<br>');
        
        // 处理代码块
        content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // 处理行内代码
        content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 处理数学公式（简单处理）
        content = content.replace(/\$([^$]+)\$/g, '<em>$1</em>');
        
        return content;
    },
    
    // 添加到历史记录
    addToHistory(role, content) {
        this.conversationHistory.push({
            role,
            content,
            timestamp: Date.now()
        });
        
        // 限制历史记录长度
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }
        
        this.saveConversationHistory();
    },
    
    // 显示输入指示器
    showTypingIndicator() {
        const messagesContainer = Utils.dom.get('#ai-chat-messages');
        if (!messagesContainer) return;
        
        const indicator = Utils.dom.create('div', {
            className: 'ai-message assistant typing-indicator',
            id: 'typing-indicator',
            innerHTML: `
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `
        });
        
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    
    // 隐藏输入指示器
    hideTypingIndicator() {
        const indicator = Utils.dom.get('#typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    },
    
    // 清空对话历史
    clearHistory() {
        this.conversationHistory = [];
        this.saveConversationHistory();
        
        const messagesContainer = Utils.dom.get('#ai-chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = this.renderChatHistory();
        }
        
        console.log('🗑️ 对话历史已清空');
    },
    
    // 切换语音输入
    toggleVoice() {
        if (!this.speechConfig.isSupported) {
            this.showMessage('您的浏览器不支持语音功能', 'warning');
            return;
        }
        
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    },
    
    // 开始语音监听
    startListening() {
        if (!this.speechConfig.recognition) return;
        
        try {
            this.speechConfig.recognition.start();
            this.isListening = true;
            
            const voiceBtn = Utils.dom.get('#voice-btn');
            if (voiceBtn) {
                voiceBtn.innerHTML = '<i class="fas fa-microphone-slash" style="color: #ef4444;"></i>';
                voiceBtn.title = '停止录音';
            }
            
            this.updateStatus('正在监听...', 'listening');
            console.log('🎤 开始语音识别');
            
        } catch (error) {
            console.error('❌ 语音识别启动失败:', error);
            this.stopListening();
        }
    },
    
    // 停止语音监听
    stopListening() {
        if (this.speechConfig.recognition) {
            this.speechConfig.recognition.stop();
        }
        
        this.isListening = false;
        
        const voiceBtn = Utils.dom.get('#voice-btn');
        if (voiceBtn) {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.title = '语音输入';
        }
        
        this.updateStatus('已连接', 'success');
        console.log('🎤 语音识别已停止');
    },
    
    // 处理语音输入
    handleVoiceInput(transcript) {
        console.log('🎤 语音识别结果:', transcript);
        
        const input = Utils.dom.get('#ai-input');
        if (input) {
            input.value = transcript;
            this.sendMessage();
        }
    },
    
    // 语音播报回复
    speakResponse(text) {
        if (!this.speechConfig.synthesis) return;
        
        // 移除HTML标签
        const cleanText = text.replace(/<[^>]*>/g, '');
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = this.speechConfig.currentLanguage;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        
        this.speechConfig.synthesis.speak(utterance);
    },
    
    // 切换模式
    changeMode() {
        // 这里可以实现不同的AI助手模式
        console.log('🔄 切换AI助手模式（功能开发中）');
        this.showMessage('模式切换功能正在开发中...', 'info');
    },
    
    // 更新状态
    updateStatus(message, type = 'info') {
        const indicator = Utils.dom.get('#ai-status-indicator');
        if (!indicator) return;
        
        indicator.className = `ai-status-indicator ${type}`;
        indicator.title = message;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            loading: '#4facfe',
            listening: '#8b5cf6'
        };
        
        indicator.style.backgroundColor = colors[type] || colors.info;
    },
    
    // 聚焦输入框
    focusInput() {
        const input = Utils.dom.get('#ai-input');
        if (input) {
            input.focus();
        }
    },
    
    // 显示消息
    showMessage(message, type = 'info') {
        EventBus.emit(SystemEvents.NOTIFICATION_SHOW, {
            message,
            type,
            duration: 3000
        });
    },
    
    // 获取助手统计信息
    getStats() {
        return {
            isConnected: this.isConnected,
            conversationCount: this.conversationHistory.length,
            voiceSupported: this.speechConfig.isSupported,
            lastInteraction: this.conversationHistory.length > 0 ? 
                this.conversationHistory[this.conversationHistory.length - 1].timestamp : null
        };
    }
};

// 注册模块
document.addEventListener('DOMContentLoaded', () => {
    IntelligentAIAssistant.init();
});

console.log('🤖 AI智能助手已加载'); 