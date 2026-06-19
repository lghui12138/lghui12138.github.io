// 主应用逻辑模块
window.PracticeApp = {
    // 创建Vue应用实例
    createApp() {
        const { createApp } = Vue;

        return createApp({
            data() {
                return {
                    // 基础状态
                    loading: true,
                    loadingText: '正在初始化...',
                    isFullscreen: false,
                    currentView: 'selector', // 'selector' | 'practice' | 'realExamSelector'
                    
                    // 通知系统
                    notification: {
                        show: false,
                        message: '',
                        type: 'info'
                    },
                    
                    // 粒子效果
                    particles: [],
                    
                    // 题库数据
                    availableBanks: [],
                    allQuestions: [],
                    questions: [], // 当前练习的题目
                    totalQuestions: 0,
                    
                    // 真题相关数据
                    realExamYears: [],
                    isRealExamMode: false,
                    
                    // 筛选条件
                    filters: {
                        category: '',
                        year: '',
                        difficulty: '',
                        keyword: ''
                    },
                    
                    // 练习状态
                    currentQuestionIndex: 0,
                    selectedAnswer: null,
                    showResult: false,
                    isCorrect: false,
                    
                    // 统计数据
                    stats: {
                        totalQuestions: 0,
                        answeredQuestions: 0,
                        correctAnswers: 0,
                        correctRate: 0,
                        startTime: null,
                        totalTime: 0
                    },
	                    practiceSessionId: null,
	                    serverProgressHydrated: false,
		                    serverProgressSource: '',
		                    serverProgressStoreMode: '',
		                    serverProgressLastError: '',
		                    progressWritePendingCount: 0,
		                    progressWriteChain: Promise.resolve()
	                };
	            },

            computed: {
                currentQuestion() {
                    return this.questions[this.currentQuestionIndex] || null;
                },
                
                practiceStats() {
                    return {
                        totalQuestions: this.questions.length,
                        answeredQuestions: this.stats.answeredQuestions,
                        correctAnswers: this.stats.correctAnswers
                    };
                },
                
                practiceProgress() {
                    return {
                        currentIndex: this.currentQuestionIndex,
                        total: this.questions.length
                    };
                }
            },

            methods: {
                // 通知管理
                showNotification(message, type = 'info') {
                    this.notification = { show: true, message, type };
                },

                stripAnswerUiText(value) {
                    return String(value == null ? '' : value)
                        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
                        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<\/(?:p|div|li|tr|section|article|h[1-6])>/gi, '\n')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/&nbsp;/gi, ' ')
                        .replace(/&lt;/gi, '<')
                        .replace(/&gt;/gi, '>')
                        .replace(/&amp;/gi, '&')
                        .replace(/&quot;/gi, '"')
                        .replace(/&#39;/g, "'")
                        .replace(/\s+/g, ' ')
                        .trim();
                },

                firstAnswerUiText(values) {
                    for (const value of values) {
                        const text = this.stripAnswerUiText(value);
                        if (text) return text;
                    }
                    return '';
                },

                is181103MaterialQuestion(question) {
                    return Boolean(question && question.extractedFromMaterial === true
                        && /\/resources\/fluid-181103-html\/materials\//.test(String(question.sourceHtmlUrl || question.htmlQuestionSourceUrl || '')));
                },

                sourceImageFrom181103Question(question) {
                    const explicit = String(question && (question.sourcePageImageUrl || question.sourcePageImageEvidenceUrl || question.practiceSourceImageUrl) || '').trim();
                    if (explicit) return explicit;
                    const sourceHtmlUrl = String(question && (question.sourceHtmlUrl || question.htmlQuestionSourceUrl || '') || '').trim();
                    const match = sourceHtmlUrl.match(/^(.*\/materials\/[^/]+\/)index\.html#page-(\d{1,4})$/);
                    return match ? `${match[1]}pages${match[2].padStart(3, '0')}.jpg` : '';
                },

                normalize181103AnswerUiQuestion(question) {
                    if (!this.is181103MaterialQuestion(question)) return question;
                    const sourceHtmlUrl = String(question.sourceHtmlUrl || question.htmlQuestionSourceUrl || question.htmlQuestionCardUrl || '').trim();
                    const sourceImageUrl = this.sourceImageFrom181103Question(question);
                    const answerText = this.firstAnswerUiText([
                        question.answerHtml,
                        question.referenceAnswerHtml,
                        question.sampleAnswerHtml,
                        question.referenceAnswer,
                        question.sampleAnswer,
                        question.answer,
                        question.correct
                    ]);
                    const sourceLine = sourceHtmlUrl ? `来源 HTML：${sourceHtmlUrl}` : '来源 HTML：待补充';
                    const imageLine = sourceImageUrl ? `页图证据：${sourceImageUrl}` : '页图证据：待补充';
                    const fallbackAnswer = [
                        '参考答案待复核：这道 181103 资料题暂未整理出可靠答案文本，不能用空白或旧题库答案替代。',
                        sourceLine,
                        imageLine
                    ].join('\n');
                    let explanation = this.firstAnswerUiText([
                        question.explanationHtml,
                        question.explanation,
                        question.solutionHtml,
                        question.solution,
                        question.analysis
                    ]) || '解析思路待复核：请先打开来源 HTML 核对题面、公式和上下文，再补正式解析。';
                    if (sourceHtmlUrl && !explanation.includes(sourceHtmlUrl)) explanation += `\n${sourceLine}`;
                    if (sourceImageUrl && !explanation.includes(sourceImageUrl)) explanation += `\n${imageLine}`;
                    return {
                        ...question,
                        answer: answerText || fallbackAnswer,
                        referenceAnswer: question.referenceAnswer || question.sampleAnswer || question.answer || answerText || fallbackAnswer,
                        explanation,
                        sourceHtmlUrl,
                        sourcePageImageUrl: sourceImageUrl || question.sourcePageImageUrl || question.sourcePageImageEvidenceUrl || '',
                        answerEvidenceHtmlUrl: sourceHtmlUrl,
                        answerEvidencePageImageUrl: sourceImageUrl,
                        answerUiStatus: answerText ? 'reference-answer-ready' : 'reference-answer-needs-review',
                        round399AnswerUiReady: Boolean(answerText && explanation && sourceHtmlUrl && sourceImageUrl),
                        round399AnswerUiFallbackHonest: !answerText
                    };
                },

                normalizePracticeQuestions(questions) {
                    return Array.isArray(questions)
                        ? questions.map(question => this.normalize181103AnswerUiQuestion(question))
                        : [];
                },

                stableProgressEventId(type, data = {}) {
                    const questionKey = data.questionId || data.questionNumber || this.currentQuestionIndex + 1;
                    const attemptKey = data.attemptNumber || data.practiceAttempt || '';
                    return [
                        type,
                        data.practiceSessionId || this.practiceSessionId || '',
                        data.bankId || data.questionBank || '',
                        questionKey,
                        attemptKey
                    ].filter(value => value !== null && value !== undefined && String(value).trim() !== '').join(':').replace(/\s+/g, '-').slice(0, 220);
                },

                durationMsToSeconds(value) {
                    const numeric = Number(value);
                    if (!Number.isFinite(numeric) || numeric <= 0) return 0;
                    return Math.max(1, Math.round(numeric / 1000));
                },

                progressSourceFromPayload(payload) {
                    const explicit = String(payload && payload.source || '').trim();
                    if (explicit) return explicit;
                    const mode = String(payload && (payload.storeMode || payload.store || '') || '').toLowerCase();
                    if (mode === 'd1') return 'server-d1-learning-progress';
                    if (mode === 'r2' || mode === 'r2-progress') return 'server-r2-learning-progress';
                    if (mode === 'kv' || mode === 'kv-single-write-fallback') return 'server-kv-learning-progress';
                    return 'server-learning-progress-unavailable';
                },

			                progressSnapshotKey(username) {
			                    const safeUser = String(username || 'unknown')
			                        .normalize('NFKC')
		                        .trim()
		                        .replace(/\s+/g, '-')
		                        .replace(/[^a-z0-9_.:@-]/gi, '_')
		                        .slice(0, 120) || 'unknown';
			                    return 'fm_learning_progress_snapshot_v1:' + safeUser;
			                },

			                progressOutboxKey() {
			                    return 'fm_learning_progress_outbox_v1';
			                },

			                progressErrorKey() {
			                    return 'fm_learning_progress_last_error_v1';
			                },

			                readProgressJson(key, fallback) {
			                    try {
			                        const raw = localStorage.getItem(key);
			                        return raw ? JSON.parse(raw) : fallback;
			                    } catch (_) {
			                        return fallback;
			                    }
			                },

			                writeProgressJson(key, value) {
			                    try {
			                        localStorage.setItem(key, JSON.stringify(value));
			                    } catch (_) {}
			                },

			                progressOutbox() {
			                    const items = this.readProgressJson(this.progressOutboxKey(), []);
			                    const now = Date.now();
			                    return (Array.isArray(items) ? items : []).filter(item => {
			                        if (!item || item.queuedReason !== 'network') return false;
			                        const queuedAt = Date.parse(item.queuedAt || '');
			                        return queuedAt && now - queuedAt <= 24 * 60 * 60 * 1000;
			                    });
			                },

			                saveProgressOutbox(items) {
			                    const next = (Array.isArray(items) ? items : []).slice(-200);
			                    this.writeProgressJson(this.progressOutboxKey(), next);
			                    this.progressWritePendingCount = next.length;
			                },

			                progressErrorFromPayload(payload, response) {
			                    const first = payload && Array.isArray(payload.results)
			                        ? payload.results.find(item => item && item.error)
			                        : null;
			                    return String((payload && payload.error) || (first && first.error) || `http_${response && response.status || 0}`);
			                },

			                rememberProgressWriteError(payload, response, event) {
			                    const error = this.progressErrorFromPayload(payload || {}, response || {});
			                    const source = this.progressSourceFromPayload(payload || {});
			                    const storeMode = payload && (payload.storeMode || payload.configuredStoreMode || payload.store || '');
			                    this.serverProgressLastError = error;
			                    this.serverProgressStoreMode = storeMode || this.serverProgressStoreMode || '';
			                    this.writeProgressJson(this.progressErrorKey(), {
			                        syncedAt: new Date().toISOString(),
			                        error,
			                        status: response && response.status || 0,
			                        source,
			                        storeMode,
			                        eventType: event && event.type || '',
			                        clientEventId: event && event.data && event.data.clientEventId || '',
			                        serverUpgradeInvariant: payload && payload.serverUpgradeInvariant || ''
			                    });
			                    return error;
			                },

			                isServerRejectedProgress(payload, response) {
			                    if (!response || response.ok) return false;
			                    const text = JSON.stringify(payload || {});
			                    return response.status >= 500 || /write_quota_exceeded|storage_unavailable|progress_write_failed|write_failed/.test(text);
			                },

			                queueNetworkProgressEvent(event) {
			                    const outbox = this.progressOutbox();
			                    const clientEventId = event && event.data && event.data.clientEventId;
			                    if (!outbox.some(item => item && item.data && item.data.clientEventId === clientEventId)) {
			                        outbox.push({
			                            ...event,
			                            queuedAt: new Date().toISOString(),
			                            queuedReason: 'network'
			                        });
			                    }
			                    this.saveProgressOutbox(outbox);
			                },

			                async flushProgressOutbox() {
			                    const outbox = this.progressOutbox();
			                    this.progressWritePendingCount = outbox.length;
			                    if (!outbox.length) return false;
			                    try {
			                        const response = await fetch('/api/progress', {
			                            method: 'POST',
			                            headers: { 'Content-Type': 'application/json' },
			                            body: JSON.stringify({ events: outbox }),
			                            keepalive: true,
			                            credentials: 'same-origin'
			                        });
			                        const payload = await response.json().catch(() => null);
			                        if (!response.ok) {
			                            const error = this.rememberProgressWriteError(payload, response, outbox[0]);
			                            if (this.isServerRejectedProgress(payload, response)) {
			                                this.saveProgressOutbox([]);
			                                this.showNotification(`服务器学习进度写入失败：${error}；旧累计未变，请联系管理员绑定 D1/R2 主存储。`, 'error');
			                            }
			                            return false;
			                        }
			                        if (payload && payload.ok) {
			                            this.saveProgressOutbox([]);
			                            await this.syncProgressFromServer();
			                            return true;
			                        }
			                    } catch (error) {
			                        this.serverProgressLastError = error && error.message ? error.message : 'progress_outbox_flush_failed';
			                    }
			                    return false;
			                },

			                progressSnapshotUser(payload) {
			                    const explicit = String(payload && (payload.user || (payload.progress && payload.progress.user)) || '').trim();
		                    if (explicit) return explicit;
		                    if (window.FMSecurity && typeof window.FMSecurity.getUser === 'function') {
		                        const guarded = window.FMSecurity.getUser();
		                        if (guarded && guarded.username) return String(guarded.username).trim();
		                    }
		                    try {
		                        const session = JSON.parse(localStorage.getItem('fm_session_v2') || localStorage.getItem('fm_auth_session_v2') || 'null');
		                        const user = session && session.payload && session.payload.user ? session.payload.user : (session && session.user ? session.user : null);
		                        if (user && user.username) return String(user.username).trim();
		                    } catch (_) {}
		                    return 'unknown';
		                },

		                applyServerProgress(payload) {
		                    const stats = payload && (payload.stats || (payload.progress && payload.progress.totals));
		                    if (!stats) return;
	                    const source = this.progressSourceFromPayload(payload || {});
		                    const cumulativeSourceOfTruth = String(payload && payload.cumulativeSourceOfTruth || '').trim();
		                    const noMutationRead = payload && payload.noMutationRead === true && cumulativeSourceOfTruth === 'server-progress-snapshot';
		                    if (!/^(server-d1-learning-progress|server-r2-learning-progress|server-kv-learning-progress)$/.test(source) || !noMutationRead) return;
		                    const snapshotUser = this.progressSnapshotUser(payload);
		                    try {
		                        localStorage.setItem(this.progressSnapshotKey(snapshotUser), JSON.stringify({
		                            syncedAt: new Date().toISOString(),
		                            user: snapshotUser,
		                            source,
		                            progress: payload.progress || null,
		                            storeMode: payload.storeMode || '',
		                            cumulativeSourceOfTruth,
		                            noMutationRead,
		                            stats
		                        }));
                    } catch (_) {}
			                    this.serverProgressHydrated = true;
			                    this.serverProgressSource = source;
			                    this.serverProgressStoreMode = payload && (payload.storeMode || payload.store || '');
			                    this.serverProgressLastError = '';
			                    this.progressWritePendingCount = this.progressOutbox().length;
			                    this.stats = {
                        ...this.stats,
                        answeredQuestions: Number(stats.answered || 0),
                        correctAnswers: Number(stats.correct || 0),
                        correctRate: Number(stats.accuracy || 0),
                        totalTime: Number(stats.studyTimeSeconds || 0)
                    };
                },

                async syncProgressFromServer() {
                    try {
                        const response = await fetch('/api/progress', {
                            method: 'GET',
                            credentials: 'same-origin',
                            cache: 'no-store'
	                        });
		                        const payload = await response.json().catch(() => null);
		                        if (!response.ok) {
		                            this.rememberProgressWriteError(payload, response, { type: 'progress_get' });
		                            if (payload && payload.progress && payload.stats) this.applyServerProgress(payload);
		                            return false;
	                        }
	                        if (payload && payload.ok) {
                            this.applyServerProgress(payload);
                            return true;
                        }
	                    } catch (error) {
                        this.serverProgressLastError = error && error.message ? error.message : 'progress_sync_failed';
                    }
                    return false;
	                },

		                async postProgressEvent(type, data = {}) {
		                    const event = {
                            type,
                            data: {
                                ...data,
                                clientEventId: this.stableProgressEventId(type, data)
                            }
                        };
		                    try {
	                        const response = await fetch('/api/progress', {
	                            method: 'POST',
	                            headers: { 'Content-Type': 'application/json' },
	                            body: JSON.stringify(event),
	                            keepalive: true,
	                            credentials: 'same-origin'
	                        });
			                        const payload = await response.json().catch(() => null);
			                        if (!response.ok) {
			                            const error = this.rememberProgressWriteError(payload, response, event);
			                            if (this.isServerRejectedProgress(payload, response)) {
			                                await this.syncProgressFromServer();
			                                this.showNotification(`服务器学习进度写入失败：${error}；本次做题没有进入累计账本，旧累计未被改动。`, 'error');
			                            }
			                            return false;
			                        }
			                        if (payload && payload.ok) {
	                            await this.syncProgressFromServer();
	                            this.flushProgressOutbox();
	                            return true;
	                        }
		                    } catch (error) {
		                        this.serverProgressLastError = error && error.message ? error.message : 'progress_event_failed';
		                        this.queueNetworkProgressEvent(event);
		                        this.showNotification('网络中断，做题进度已暂存本机，恢复连接后会自动同步。', 'warning');
		                    }
			                    return false;
			                },

			                sendProgressEvent(type, data = {}) {
			                    this.progressWriteChain = this.progressWriteChain
			                        .catch(() => false)
			                        .then(() => this.postProgressEvent(type, data));
			                    return this.progressWriteChain;
			                },

                // 全屏功能
                toggleFullscreen() {
                    if (!this.isFullscreen) {
                        this.enterFullscreen();
                    } else {
                        this.exitFullscreen();
                    }
                },

                enterFullscreen() {
                    const element = document.documentElement;
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                    this.isFullscreen = true;
                    this.showNotification('已进入全屏模式，按F11或ESC可退出', 'info');
                },

                exitFullscreen() {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    this.isFullscreen = false;
                    this.showNotification('已退出全屏模式', 'info');
                },

                exitToPlatform() {
                    window.location.href = '../index-complete.html';
                },

                // 数据加载
                async loadAllQuestionBanks() {
                    this.loading = true;
                    this.loadingText = '正在批量加载所有题库...';

                    try {
                        const result = await PracticeDataLoader.loadAllQuestionBanks((progress) => {
                            if (progress.status === 'loading') {
                                this.loadingText = `正在加载: ${progress.currentFile} (${progress.current}/${progress.total})`;
                            } else if (progress.status === 'completed') {
                                this.loadingText = '加载完成！';
                            }
                        });

                        this.allQuestions = result.questions;
                        this.availableBanks = result.banks;
                        this.totalQuestions = result.questions.length;
                        
                        this.showNotification(
                            `🎉 成功加载 ${result.questions.length} 道题目，来自 ${result.banks.length} 个题库`, 
                            'success'
                        );
                        
                        // 更新统计
                        this.updateStats();
                        
                    } catch (error) {
                        console.error('批量加载失败:', error);
                        this.showNotification('批量加载失败: ' + error.message, 'error');
                    } finally {
                        this.loading = false;
                    }
                },

                // 开始练习
                startPractice(options) {
                    let selectedQuestions = [];
                    
                    if (options.type === 'single') {
                        // 单个题库练习
                        selectedQuestions = this.allQuestions.filter(q => q.bankId === options.bankId);
                    } else if (options.type === 'multiple') {
                        // 多个题库练习
                        selectedQuestions = this.allQuestions.filter(q => 
                            options.bankIds.includes(q.bankId)
                        );
                    }
                    
                    if (selectedQuestions.length === 0) {
                        this.showNotification('选中的题库暂无题目', 'warning');
                        return;
                    }
                    
                    this.questions = this.normalizePracticeQuestions(selectedQuestions);
                    this.currentView = 'practice';
                    this.currentQuestionIndex = 0;
                    this.stats.startTime = Date.now();
                    this.practiceSessionId = `modular-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
                    this.resetQuestionState();
                    
                    this.showNotification(`开始练习！共 ${selectedQuestions.length} 道题目`, 'success');
                },

                startRandomPractice() {
                    if (this.allQuestions.length === 0) {
                        this.showNotification('请先加载题库', 'warning');
                        return;
                    }
                    
                    // 随机打乱所有题目
                    this.questions = this.normalizePracticeQuestions(PracticeUtils.shuffleArray([...this.allQuestions]));
                    this.currentView = 'practice';
                    this.currentQuestionIndex = 0;
                    this.stats.startTime = Date.now();
                    this.practiceSessionId = `modular-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
                    this.resetQuestionState();
                    
                    this.showNotification(`开始随机练习！共 ${this.questions.length} 道题目`, 'success');
                },

                // 题目操作
                submitAnswer(data) {
                    const timeSpentMs = Number(data.timeSpent || data.timeSpentMs || 0);
                    const questionTimeSeconds = this.durationMsToSeconds(timeSpentMs);
                    this.stats.answeredQuestions++;
                    
                    if (data.isCorrect) {
                        this.stats.correctAnswers++;
                        this.showNotification('回答正确！', 'success');
                    } else {
                        this.showNotification('回答错误，请查看解析', 'error');
                    }
                    
                    // 记录答题时间
                    this.stats.totalTime += timeSpentMs || 0;
                    
                    // 更新正确率
                    this.stats.correctRate = Math.round(
                        (this.stats.correctAnswers / this.stats.answeredQuestions) * 100
                    );
                    
                    // 保存进度
                    this.saveProgress();
                    
                    // 发送学生反馈数据给教师
                    this.sendStudentFeedback(data);

                    this.sendProgressEvent('practice_answer_submit', {
                        practiceSessionId: this.practiceSessionId,
                        bankId: this.currentQuestion?.bankId || this.currentQuestion?.bank || '',
                        sessionName: this.currentQuestion?.bank || this.currentQuestion?.category || '模块化练习',
                        questionId: data.questionId || this.currentQuestion?.id || this.currentQuestion?.questionId || this.currentQuestionIndex + 1,
                        questionNumber: this.currentQuestionIndex + 1,
                        totalQuestions: this.questions.length,
                        questionTitle: this.currentQuestion?.title || this.currentQuestion?.question || '',
                        questionType: this.currentQuestion?.type || this.currentQuestion?.questionType || '',
                        knowledge: this.currentQuestion?.knowledge || this.currentQuestion?.category || '',
                        userAnswer: data.selectedAnswer || data.userAnswer || '',
                        correctAnswer: this.currentQuestion?.answer || this.currentQuestion?.correct || '',
                        isCorrect: data.isCorrect,
                        questionTimeSeconds,
                        timeSpentMs: timeSpentMs || 0,
                        durationUnit: 'seconds'
                    });
                },

                navigateQuestion(direction) {
                    if (direction === 'next' && this.currentQuestionIndex < this.questions.length - 1) {
                        this.currentQuestionIndex++;
                        this.resetQuestionState();
                    } else if (direction === 'previous' && this.currentQuestionIndex > 0) {
                        this.currentQuestionIndex--;
                        this.resetQuestionState();
                    }
                },

                resetQuestionState() {
                    this.selectedAnswer = null;
                    this.showResult = false;
                    this.isCorrect = false;
                },

                backToSelector() {
                    if (this.isRealExamMode) {
                        this.currentView = 'realExamSelector';
                    } else {
                    this.currentView = 'selector';
                    }
                    this.resetQuestionState();
                },

                // 进度管理
                saveProgress() {
                    const progress = {
                        currentQuestionIndex: this.currentQuestionIndex,
                        stats: this.stats,
                        serverManaged: this.serverProgressHydrated === true,
                        serverProgressSource: this.serverProgressSource || '',
                        timestamp: new Date().toISOString(),
                        questionsLength: this.questions.length
                    };
                    
                    localStorage.setItem(PracticeConfig.storageKeys.progress, JSON.stringify(progress));
                },

                loadProgress() {
                    try {
                        const saved = localStorage.getItem(PracticeConfig.storageKeys.progress);
                        if (saved) {
                            const progress = JSON.parse(saved);
	                            if (Number.isFinite(Number(progress.currentQuestionIndex))) {
	                                const index = Number(progress.currentQuestionIndex);
	                                if (index >= 0 && index < this.questions.length) this.currentQuestionIndex = index;
	                            }
                        }
                    } catch (error) {
                        console.error('Failed to load progress:', error);
                    }
                },

                // 统计更新
                updateStats() {
                    if (this.serverProgressHydrated) {
                        this.stats = {
                            ...this.stats,
                            totalQuestions: this.totalQuestions
                        };
                        return;
                    }
                    this.stats = {
                        ...this.stats,
                        totalQuestions: this.totalQuestions,
                        answeredQuestions: this.currentView === 'practice' ? this.stats.answeredQuestions : 0,
                        correctAnswers: this.currentView === 'practice' ? this.stats.correctAnswers : 0,
                        correctRate: this.currentView === 'practice' ? this.stats.correctRate : 0,
                        totalTime: this.currentView === 'practice' ? this.stats.totalTime : 0
                    };
                },

                updateFilters(newFilters) {
                    this.filters = { ...newFilters };
                    localStorage.setItem(PracticeConfig.storageKeys.filters, JSON.stringify(this.filters));
                },

                // 真题练习处理
                async handleRealExamPractice(examId, examYear, examMode = 'all') {
                    console.log('📚 处理真题练习请求:', { examId, examYear, examMode });
                    
                    this.loading = true;
                    this.loadingText = '正在加载真题数据...';
                    
                    try {
                        // 加载真题数据
                        await this.loadRealExamData(examId, examYear, examMode);
                        
                        // 根据模式决定如何开始练习
                        if (examMode === 'all') {
                            // 显示真题选择器
                            this.showRealExamSelector();
                        } else {
                            // 自动开始练习
                            this.startRealExamPractice(examId, examYear, examMode);
                        }
                        
                    } catch (error) {
                        console.error('❌ 真题练习初始化失败:', error);
                        this.showNotification('真题练习初始化失败: ' + error.message, 'error');
                        this.loading = false;
                    }
                },

                // 加载真题数据
                async loadRealExamData(examId, examYear, examMode = 'all') {
                    console.log('📖 加载真题数据:', { examId, examYear, examMode });
                    
                    try {
                        // 从真题文件加载数据
                        const response = await fetch('../question-banks/真题_中国海洋大学_2000-2024_fixed.json');
                        if (!response.ok) {
                            throw new Error('真题文件加载失败');
                        }
                        
                        const allExamQuestions = await response.json();
                        
                        // 处理题目数据
                        const processedQuestions = allExamQuestions.map(q => this.normalize181103AnswerUiQuestion({
                            ...q,
                            bankId: 'real-exam',
                            bank: '历年真题',
                            bankName: `${q.year}年真题`,
                            category: '历年真题',
                            difficulty: this.getDifficultyByScore(q.score),
                            options: q.options || [],
                            answer: q.answer || '',
                            explanation: q.explanation || ''
                        }));
                        
                        // 根据模式和年份筛选题目
                        let filteredQuestions = processedQuestions;
                        
                        if (examYear && examYear !== 'all') {
                            filteredQuestions = processedQuestions.filter(q => q.year === parseInt(examYear));
                            console.log(`📅 筛选${examYear}年真题: ${filteredQuestions.length}题`);
                        }
                        
                        if (filteredQuestions.length === 0) {
                            throw new Error(`未找到${examYear || ''}年的真题数据`);
                        }
                        
                        // 存储所有题目和年份信息
                        this.allQuestions = filteredQuestions;
                        this.realExamYears = this.getRealExamYears(processedQuestions);
                        
                        // 构建题库信息
                        this.availableBanks = this.buildRealExamBanks(processedQuestions, examYear);
                        this.totalQuestions = this.allQuestions.length;
                        
                        console.log(`✅ 真题数据加载完成: ${this.allQuestions.length}题，${this.realExamYears.length}个年份`);
                        
                    } catch (error) {
                        console.error('❌ 真题数据加载失败:', error);
                        throw error;
                    }
                },

                // 开始真题练习
                startRealExamPractice(examId, examYear, examMode = 'normal') {
                    console.log('🎯 开始真题练习:', { examId, examYear, examMode });
                    
                    // 设置真题模式
                    this.isRealExamMode = true;
                    
                    // 设置练习题目
                    this.questions = this.normalizePracticeQuestions(this.allQuestions);
                    
                    // 根据模式处理题目
                    if (examMode === 'random') {
                        this.questions = PracticeUtils.shuffleArray([...this.questions]);
                    }
                    
                    this.currentView = 'practice';
                    this.currentQuestionIndex = 0;
                    this.stats.startTime = Date.now();
                    this.resetQuestionState();
                    
                    // 更新加载状态
                    this.loading = false;
                    
                    // 显示练习信息
                    const yearText = examYear ? `${examYear}年` : '历年';
                    const modeText = examMode === 'random' ? '随机' : '顺序';
                    this.showNotification(`🎯 开始${yearText}真题${modeText}练习！共 ${this.questions.length} 道题目`, 'success');
                    
                    // 保存真题练习状态
                    localStorage.setItem('currentRealExamPractice', JSON.stringify({
                        examId,
                        examYear,
                        examMode,
                        startTime: Date.now(),
                        totalQuestions: this.questions.length
                    }));
                },

                // 根据分数判断难度
                getDifficultyByScore(score) {
                    if (score <= 5) return 'easy';
                    if (score <= 10) return 'medium';
                    return 'hard';
                },

                // 获取真题年份列表
                getRealExamYears(questions) {
                    const years = [...new Set(questions.map(q => q.year))].sort((a, b) => b - a);
                    return years.map(year => ({
                        year,
                        count: questions.filter(q => q.year === year).length,
                        label: `${year}年 (${questions.filter(q => q.year === year).length}题)`
                    }));
                },

                // 构建真题题库信息
                buildRealExamBanks(questions, selectedYear) {
                    const banks = [];
                    
                    // 添加"所有真题"选项
                    banks.push({
                        id: 'real-exam-all',
                        name: '所有历年真题',
                        description: `中国海洋大学历年真题合集 (${questions.length}题)`,
                        questionCount: questions.length,
                        year: 'all'
                    });
                    
                    // 按年份添加题库
                    const years = this.getRealExamYears(questions);
                    years.forEach(yearInfo => {
                        banks.push({
                            id: `real-exam-${yearInfo.year}`,
                            name: `${yearInfo.year}年真题`,
                            description: `${yearInfo.year}年中国海洋大学流体力学真题 (${yearInfo.count}题)`,
                            questionCount: yearInfo.count,
                            year: yearInfo.year
                        });
                    });
                    
                    return banks;
                },

                // 显示真题选择器
                showRealExamSelector() {
                    this.loading = false;
                    this.currentView = 'realExamSelector';
                    this.showNotification('请选择要练习的真题年份', 'info');
                },

                // 开始特定年份的真题练习
                startYearPractice(year, mode = 'normal') {
                    let selectedQuestions = [];
                    
                    if (year === 'all') {
                        selectedQuestions = [...this.allQuestions];
                    } else {
                        selectedQuestions = this.allQuestions.filter(q => q.year === year);
                    }
                    
                    if (selectedQuestions.length === 0) {
                        this.showNotification(`未找到${year}年的真题`, 'warning');
                        return;
                    }
                    
                    // 根据模式处理题目
                    if (mode === 'random') {
                        selectedQuestions = PracticeUtils.shuffleArray([...selectedQuestions]);
                    }
                    
                    this.questions = this.normalizePracticeQuestions(selectedQuestions);
                    this.currentView = 'practice';
                    this.currentQuestionIndex = 0;
                    this.stats.startTime = Date.now();
                    this.practiceSessionId = `real-${year}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
                    this.resetQuestionState();
                    
                    const yearText = year === 'all' ? '所有年份' : `${year}年`;
                    const modeText = mode === 'random' ? '随机' : '顺序';
                    this.showNotification(`🎯 开始${yearText}真题${modeText}练习！共 ${selectedQuestions.length} 道题目`, 'success');
                    
                    // 保存真题练习状态
                    localStorage.setItem('currentRealExamPractice', JSON.stringify({
                        year,
                        mode,
                        startTime: Date.now(),
                        totalQuestions: selectedQuestions.length
                    }));
                },

                // 学生反馈功能
                sendStudentFeedback(answerData) {
                    // 获取当前用户信息
                    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                    
                    if (!currentUser.username) return;
                    
                    const feedbackData = {
                        studentId: currentUser.username,
                        studentName: currentUser.displayName || currentUser.username,
                        questionId: answerData.questionId,
                        questionTitle: this.currentQuestion?.title,
                        questionBank: this.currentQuestion?.bank,
                        selectedAnswer: answerData.selectedAnswer,
                        correctAnswer: this.currentQuestion?.answer,
                        isCorrect: answerData.isCorrect,
                        timeSpent: answerData.timeSpent,
                        timestamp: new Date().toISOString(),
                        difficulty: this.currentQuestion?.difficulty,
                        category: this.currentQuestion?.category
                    };
                    
                    // 保存到本地存储供教师查看
                    this.saveStudentFeedback(feedbackData);
                },

                saveStudentFeedback(feedbackData) {
                    const existingFeedback = JSON.parse(localStorage.getItem('studentFeedback') || '[]');
                    existingFeedback.push(feedbackData);
                    
                    // 保留最近1000条记录
                    if (existingFeedback.length > 1000) {
                        existingFeedback.splice(0, existingFeedback.length - 1000);
                    }
                    
                    localStorage.setItem('studentFeedback', JSON.stringify(existingFeedback));
                },

                // 键盘事件处理
                handleKeyboard(event) {
                    if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;

                    switch(event.key) {
                        case 'Enter':
                            if (this.currentView === 'practice') {
                                event.preventDefault();
                                // 触发当前practice interface的提交
                                const practiceInterface = this.$refs.practiceInterface;
                                if (practiceInterface) {
                                    practiceInterface.submitAnswer();
                                }
                            }
                            break;
                        case 'ArrowLeft':
                            if (this.currentView === 'practice') {
                                event.preventDefault();
                                this.navigateQuestion('previous');
                            }
                            break;
                        case 'ArrowRight':
                            if (this.currentView === 'practice') {
                                event.preventDefault();
                                this.navigateQuestion('next');
                            }
                            break;
                        case 'F11':
                            event.preventDefault();
                            this.toggleFullscreen();
                            break;
                        case 'Escape':
                            if (this.isFullscreen) {
                                event.preventDefault();
                                this.exitFullscreen();
                            } else if (this.currentView === 'practice') {
                                this.backToSelector();
                            } else {
                                this.exitToPlatform();
                            }
                            break;
                        case 's':
                            if (event.ctrlKey && this.currentView === 'practice') {
                                event.preventDefault();
                                this.saveProgress();
                                this.showNotification('进度已保存', 'success');
                            }
                            break;
                    }
                },

                // 初始化粒子效果
                initParticles() {
                    this.particles = [];
                    for (let i = 0; i < PracticeConfig.defaults.particleCount; i++) {
                        this.particles.push({
                            style: {
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 30 + 's',
                                animationDuration: (25 + Math.random() * 10) + 's'
                            }
                        });
                    }
                }
            },

            mounted() {
                console.log('🧠 智能题库练习启动！');
                
                // 检查URL参数，判断是否为真题练习
                const urlParams = new URLSearchParams(window.location.search);
                const examType = urlParams.get('type');
                const examId = urlParams.get('exam');
                const examYear = urlParams.get('year');
                const examMode = urlParams.get('mode');
                
                if (examType === 'real') {
                    console.log('📚 检测到真题练习请求:', { examType, examId, examYear, examMode });
                    this.handleRealExamPractice(examId, examYear, examMode);
                } else {
                    // 普通练习模式
	                    setTimeout(async () => {
	                        await this.syncProgressFromServer();
	                        await this.flushProgressOutbox();
	                        this.loadProgress();
	                        this.updateStats();
	                        this.initParticles();
                        this.loading = false;
                        this.showNotification('欢迎来到智能题库！点击"批量加载所有题库"开始', 'info');
                    }, 1500);
                }

                // 绑定键盘事件
                document.addEventListener('keydown', this.handleKeyboard);

                // 监听全屏状态变化
                document.addEventListener('fullscreenchange', () => {
                    this.isFullscreen = !!document.fullscreenElement;
                });

                // 定期保存进度
	                setInterval(() => {
	                    if (this.currentView === 'practice' && this.stats.answeredQuestions > 0) {
	                        this.saveProgress();
	                    }
	                    this.flushProgressOutbox();
	                }, PracticeConfig.defaults.saveProgressInterval);
            },

            beforeUnmount() {
                document.removeEventListener('keydown', this.handleKeyboard);
            },

            // 注册组件
            components: {
                'notification-component': PracticeComponents.NotificationComponent,
                'fullscreen-controls': PracticeComponents.FullscreenControls,
                'question-bank-selector': PracticeComponents.QuestionBankSelector,
                'real-exam-selector': PracticeComponents.RealExamSelector,
                'practice-interface': PracticeComponents.PracticeInterface,
                'keyboard-hints': PracticeComponents.KeyboardHints
            }
        });
    },

    // 启动应用
    mount(selector = '#app') {
        const app = this.createApp();
        return app.mount(selector);
    }
};

// 自动启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.practiceAppInstance = PracticeApp.mount('#app');
});

console.log('🚀 主应用逻辑模块已加载');
